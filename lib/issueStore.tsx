"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { Issue, IssueStatus, UserRole, Department } from "./types";
import { SEED_ISSUES } from "./mockData";
import { generateId } from "./utils";
import type { ARIALogEntry } from "./types";
import { ARIA_LOG_ENTRIES } from "./mockData";

// ─── State Shape ─────────────────────────────────────────────────────────────

interface IssueState {
  issues: Issue[];
  role: UserRole;
  citizenId: string;
  ariaLog: ARIALogEntry[];
}

type IssueAction =
  | { type: "SUBMIT_ISSUE"; payload: Omit<Issue, "id" | "submittedAt" | "updatedAt" | "ariaPriority" | "ariaConfidence" | "ariaRecommendedResource" | "status"> }
  | { type: "APPROVE_ROUTE"; issueId: string; department: Department; adminNotes?: string }
  | { type: "REJECT_ISSUE"; issueId: string; reason: string }
  | { type: "REQUEST_INFO"; issueId: string; adminNotes: string }
  | { type: "ASSIGN_RESOURCE"; issueId: string; resource: string }
  | { type: "MARK_IN_PROGRESS"; issueId: string }
  | { type: "MARK_RESOLVED"; issueId: string }
  | { type: "SET_ROLE"; role: UserRole }
  | { type: "HYDRATE"; state: IssueState };

// ─── ARIA priority scoring ────────────────────────────────────────────────────

function scoreIssue(issue: Partial<Issue>): { priority: "High" | "Medium" | "Low"; confidence: number; resource: string } {
  const urgency = issue.urgency ?? 3;
  const cat = issue.category ?? "other";
  
  let base = urgency * 15;
  if (cat === "safety") base += 20;
  if (cat === "energy") base += 15;
  if (cat === "traffic") base += 10;
  
  const confidence = Math.min(95, Math.max(42, base + Math.floor(Math.random() * 15)));
  const priority = confidence >= 75 ? "High" : confidence >= 55 ? "Medium" : "Low";
  
  const resources: Record<string, string> = {
    energy: "Repair Crew + Drone Survey",
    traffic: "Traffic Control Team",
    safety: "Emergency Response Unit",
    other: "General Services",
  };
  
  return { priority, confidence, resource: resources[cat] ?? "General Services" };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: IssueState, action: IssueAction): IssueState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "SET_ROLE":
      return { ...state, role: action.role };

    case "SUBMIT_ISSUE": {
      const scored = scoreIssue(action.payload);
      const newIssue: Issue = {
        ...action.payload,
        id: `ISS-${String(state.issues.length + 21).padStart(3, "0")}`,
        status: "Submitted",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ariaPriority: scored.priority,
        ariaConfidence: scored.confidence,
        ariaRecommendedResource: scored.resource,
        routedTo: null,
      };

      const logEntry: ARIALogEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        action: `Issue ${newIssue.id} scored ${scored.priority} Priority (${scored.confidence}% confidence)`,
        reasoning: `Category: ${action.payload.category}. District: ${action.payload.district}. Urgency: ${action.payload.urgency}/5. Score: ${scored.confidence}/100.`,
        confidence: scored.confidence,
        confidenceLevel: scored.confidence >= 80 ? "high" : scored.confidence >= 60 ? "medium" : "low",
        alternativeConsidered: scored.priority === "High" ? "Score as Medium — rejected (urgency threshold)" : "Score as High — rejected (below threshold)",
        category: "issue",
        issueid: newIssue.id,
        overridden: false,
      };

      return {
        ...state,
        issues: [newIssue, ...state.issues],
        ariaLog: [logEntry, ...state.ariaLog],
      };
    }

    case "APPROVE_ROUTE": {
      const logEntry: ARIALogEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        action: `Issue ${action.issueId} routed to ${action.department}`,
        reasoning: `Admin approved routing. ${action.adminNotes ?? "Standard routing protocol."}`,
        confidence: 82,
        confidenceLevel: "high",
        alternativeConsidered: "Route to General Services — deferred by admin decision",
        category: "issue",
        issueid: action.issueId,
        overridden: false,
      };
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.issueId
            ? { ...i, status: "Approved & Routed" as IssueStatus, routedTo: action.department, updatedAt: new Date().toISOString(), adminNotes: action.adminNotes }
            : i
        ),
        ariaLog: [logEntry, ...state.ariaLog],
      };
    }

    case "REJECT_ISSUE": {
      const logEntry: ARIALogEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        action: `Issue ${action.issueId} rejected by Admin`,
        reasoning: action.reason,
        confidence: 70,
        confidenceLevel: "medium",
        alternativeConsidered: "Approve & route — rejected by human decision",
        category: "override",
        issueid: action.issueId,
        overridden: true,
      };
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.issueId
            ? { ...i, status: "Rejected" as IssueStatus, rejectionReason: action.reason, updatedAt: new Date().toISOString() }
            : i
        ),
        ariaLog: [logEntry, ...state.ariaLog],
      };
    }

    case "REQUEST_INFO":
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.issueId
            ? { ...i, adminNotes: action.adminNotes, updatedAt: new Date().toISOString() }
            : i
        ),
      };

    case "ASSIGN_RESOURCE": {
      const logEntry: ARIALogEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        action: `Resource ${action.resource} assigned to Issue ${action.issueId}`,
        reasoning: `Government official assigned resource based on ARIA recommendation.`,
        confidence: 85,
        confidenceLevel: "high",
        alternativeConsidered: "Alternative resource — deferred to official judgment",
        category: "issue",
        issueid: action.issueId,
        overridden: false,
      };
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.issueId
            ? { ...i, assignedResource: action.resource, updatedAt: new Date().toISOString() }
            : i
        ),
        ariaLog: [logEntry, ...state.ariaLog],
      };
    }

    case "MARK_IN_PROGRESS":
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.issueId
            ? { ...i, status: "In Progress" as IssueStatus, updatedAt: new Date().toISOString() }
            : i
        ),
      };

    case "MARK_RESOLVED":
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.issueId
            ? { ...i, status: "Resolved" as IssueStatus, resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            : i
        ),
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const IssueContext = createContext<{
  state: IssueState;
  dispatch: React.Dispatch<IssueAction>;
} | null>(null);

const STORAGE_KEY = "aegis-issue-store-v1";

const initialState: IssueState = {
  issues: SEED_ISSUES,
  role: "citizen",
  citizenId: "cit-001",
  ariaLog: ARIA_LOG_ENTRIES,
};

export function IssueStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as IssueState;
        dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  return (
    <IssueContext.Provider value={{ state, dispatch }}>
      {children}
    </IssueContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIssueStore() {
  const ctx = useContext(IssueContext);
  if (!ctx) throw new Error("useIssueStore must be used within IssueStoreProvider");
  return ctx;
}

// ─── Action Helpers ───────────────────────────────────────────────────────────

export function useIssueActions() {
  const { dispatch } = useIssueStore();

  const submitIssue = useCallback(
    (payload: Omit<Issue, "id" | "submittedAt" | "updatedAt" | "ariaPriority" | "ariaConfidence" | "ariaRecommendedResource" | "status">) => {
      dispatch({ type: "SUBMIT_ISSUE", payload });
    },
    [dispatch]
  );

  const approveAndRoute = useCallback(
    (issueId: string, department: Department, adminNotes?: string) => {
      dispatch({ type: "APPROVE_ROUTE", issueId, department, adminNotes });
    },
    [dispatch]
  );

  const rejectIssue = useCallback(
    (issueId: string, reason: string) => {
      dispatch({ type: "REJECT_ISSUE", issueId, reason });
    },
    [dispatch]
  );

  const requestInfo = useCallback(
    (issueId: string, adminNotes: string) => {
      dispatch({ type: "REQUEST_INFO", issueId, adminNotes });
    },
    [dispatch]
  );

  const assignResource = useCallback(
    (issueId: string, resource: string) => {
      dispatch({ type: "ASSIGN_RESOURCE", issueId, resource });
    },
    [dispatch]
  );

  const markInProgress = useCallback(
    (issueId: string) => {
      dispatch({ type: "MARK_IN_PROGRESS", issueId });
    },
    [dispatch]
  );

  const markResolved = useCallback(
    (issueId: string) => {
      dispatch({ type: "MARK_RESOLVED", issueId });
    },
    [dispatch]
  );

  const setRole = useCallback(
    (role: UserRole) => {
      dispatch({ type: "SET_ROLE", role });
    },
    [dispatch]
  );

  return { submitIssue, approveAndRoute, rejectIssue, requestInfo, assignResource, markInProgress, markResolved, setRole };
}
