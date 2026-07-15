// ─── District & Energy ───────────────────────────────────────────────────────

export type DistrictStatus = "stable" | "warning" | "critical" | "blackout";

export interface District {
  id: string;
  name: string;
  load: number; // 0-100 %
  status: DistrictStatus;
  trustIndex: number; // 0-100
  trafficLoad: number; // 0-100
  population: number;
  ariaAction: string;
  coordinates: { x: number; y: number }; // SVG position
}

export interface EnergyDataPoint {
  time: string;
  load: number;
  capacity: number;
}

// ─── ARIA Reasoning Log ──────────────────────────────────────────────────────

export type ConfidenceLevel = "high" | "medium" | "low";
export type LogCategory = "energy" | "routing" | "emergency" | "issue" | "override";

export interface ARIALogEntry {
  id: string;
  timestamp: string;
  action: string;
  reasoning: string;
  confidence: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  alternativeConsidered: string;
  category: LogCategory;
  overridden?: boolean;
  issueid?: string;
}

// ─── Emergency ───────────────────────────────────────────────────────────────

export type AssetType = "drone" | "vehicle" | "sensor";
export type AssetStatus = "En Route" | "On Site" | "Returning" | "Standby";
export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export interface EmergencyAsset {
  id: string;
  type: AssetType;
  name: string;
  status: AssetStatus;
  district: string;
  coordinates: { x: number; y: number };
  assignedIncident?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  district: string;
  description: string;
  reportedAt: string;
  assignedAssets: string[];
  issueId?: string;
}

// ─── Citizen Reports Feed ────────────────────────────────────────────────────

export type Sentiment = "positive" | "neutral" | "negative";

export interface CitizenFeedReport {
  id: string;
  citizen: string;
  district: string;
  message: string;
  sentiment: Sentiment;
  timestamp: string;
  category: string;
}

// ─── Issue Pipeline (3-Role Workflow) ────────────────────────────────────────

export type IssueCategory = "energy" | "traffic" | "safety" | "other";
export type IssueStatus =
  | "Submitted"
  | "Under Admin Review"
  | "Approved & Routed"
  | "In Progress"
  | "Resolved"
  | "Rejected";
export type UrgencyLevel = 1 | 2 | 3 | 4 | 5;
export type Department =
  | "Energy Management"
  | "Traffic Control"
  | "Public Safety"
  | "General Services"
  | "Emergency Response"
  | null;

export interface Issue {
  id: string;
  citizenId: string;
  citizenName: string;
  category: IssueCategory;
  district: string;
  description: string;
  urgency: UrgencyLevel;
  status: IssueStatus;
  submittedAt: string;
  updatedAt: string;
  ariaPriority: "High" | "Medium" | "Low";
  ariaConfidence: number; // 0-100
  ariaRecommendedResource?: string;
  routedTo?: Department;
  rejectionReason?: string;
  assignedResource?: string;
  adminNotes?: string;
  resolvedAt?: string;
}

// ─── Role ────────────────────────────────────────────────────────────────────

export type UserRole = "citizen" | "admin" | "official";

export interface RoleState {
  role: UserRole;
  citizenId: string; // simulated logged-in citizen
}

// ─── Fairness ────────────────────────────────────────────────────────────────

export interface FairnessEntry {
  district: string;
  energyImpact: number; // 0-100 (higher = worse impact)
  serviceLevel: number; // 0-100 (higher = better)
  reportRejectionRate: number; // 0-100 %
  flagged: boolean;
}

export interface AccountabilityEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  justification: string;
  district?: string;
}

// ─── Simulator ───────────────────────────────────────────────────────────────

export interface SimulationResult {
  district: string;
  currentLoad: number;
  simulatedLoad: number;
  currentRisk: number;
  simulatedRisk: number;
  etaToStability: string;
}
