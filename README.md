# Aegis City — ARIA Command Center

> **AI-powered Smart City Command Center** featuring Explainable AI (XAI), Digital Twin simulations, predictive analytics, real-time emergency response coordination, and a full 3-role citizen-admin-government workflow.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2-ff6b6b)

---

## 🏙️ Overview

Aegis City is a fictional smart city governed by **ARIA** (Autonomous Reasoning & Intelligence Architecture) — an AI system that monitors the energy grid, manages emergency response, and handles citizen issues across 8 city districts.

This dashboard gives three types of stakeholders a window into ARIA's decisions, with full explainability and human-override capability built in.

---

## 🎨 Design

- **Deep navy** background (`#14132b`) with **electric cyan** (`#3fc6e8`) and **orange** (`#f39c3d`) accents
- **Glassmorphic cards** — translucent panels with blur, glow-on-hover borders
- **Futuristic typography** — Inter + Space Grotesk from Google Fonts
- **Animated elements** — pulsing alerts, smooth transitions, live-ticking data
- Dark-mode only · Optimized for laptop/desktop dashboard use

---

## 🗂️ Pages

### Core Dashboard (7 pages)
| Page | Route | Description |
|---|---|---|
| **Overview** | `/` | City-wide SVG map with district nodes, quick stats, risk radar |
| **Energy Grid** | `/energy` | District load table, Approve/Override/Negotiate, Recharts charts |
| **ARIA Reasoning Log** | `/reasoning` | Filterable timeline of AI decisions with confidence scores |
| **Digital Twin Simulator** | `/simulator` | Sandbox reroute simulator with before/after comparison |
| **Fairness & Trust** | `/fairness` | Equity charts, animated trust gauge, accountability log |
| **Emergency Response Mesh** | `/emergency` | Live asset map, incident list, drone/vehicle dispatch |
| **Citizen Reports Feed** | `/citizens-feed` | Sentiment-tagged community feedback with search/filter |

### Role-Based Views (3 pages)
| Page | Route | Role | Description |
|---|---|---|---|
| **Citizen View** | `/citizen` | 👤 Citizen | Report issues, 5-stage progress tracker, trust index |
| **Admin View** | `/admin` | 🛡️ Admin | Review queue, ARIA priority scores, approve/route/reject |
| **Official View** | `/official` | 🏛️ Gov. Official | Assigned queue, resource allocation, status management |

---

## 🔄 3-Role Workflow

```
[Citizen] Submits issue
     ↓  (shared store, localStorage persisted)
[Admin] Reviews → ARIA scored (High/Med/Low + confidence %)
     ↓  Approve & Route to department  (or Reject with reason)
[ARIA Log] New entry: priority scoring + routing decision
     ↓
[Gov. Official] Sees assigned issue → Assigns resource → Marks In Progress
     ↓
[Emergency Map] Live asset shown as deployed
     ↓
[Citizen] My Reports shows "In Progress" → eventually "Resolved"
```

### Role Switcher
Located in the **top navigation bar** — click `Citizen | Admin | Gov. Official` to switch. The active role persists via `localStorage` across page refreshes. The sidebar shows live badge counts for pending admin queue and official assignments.

### Issue Lifecycle
```
Submitted → Under Admin Review → Approved & Routed → In Progress → Resolved
                                        ↓
                                     Rejected (with reason)
```

---

## 🧠 ARIA Integration

Every action in the pipeline appends a new entry to the **ARIA Reasoning Log**:
- Issue submitted → priority scoring entry
- Admin approves → routing decision entry  
- Override/reject → override entry (flagged in log)
- Resource assigned → resource recommendation entry

The reasoning log is visible to **Admin** and **Gov. Official** roles.

---

## 📊 Mock Data

All data is static/seeded — no backend or database required:
- **20 pre-seeded issues** across all 5 lifecycle statuses and 8 districts
- **8 city districts** with energy load, traffic, trust index, ARIA recommendations
- **15 ARIA reasoning log entries** (energy, routing, emergency, override categories)
- **12 emergency assets** (drones, vehicles, sensors)
- **30 citizen feedback reports** with sentiment analysis
- **Live simulation** via `setInterval` — energy load ticks ±1% every 5s, clock updates every 1s

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) App Router |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| State | React Context + `useReducer` + `localStorage` |
| Deployment | [Vercel](https://vercel.com/) (zero config, Next.js auto-detected) |

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Priyanshisahu058/aegis-city-commandos.git
cd aegis-city-commandos

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
/app                        ← Next.js App Router pages
  layout.tsx               ← Root layout (Sidebar + TopBar + Provider)
  page.tsx                 ← Overview (landing)
  /energy/page.tsx
  /reasoning/page.tsx
  /simulator/page.tsx
  /fairness/page.tsx
  /emergency/page.tsx
  /citizens-feed/page.tsx
  /citizen/page.tsx        ← Citizen Role View
  /admin/page.tsx          ← Admin Role View
  /official/page.tsx       ← Government Official Role View

/components
  /layout/                 ← Sidebar, TopBar (role switcher)
  /overview/               ← CityMap, QuickStats
  /energy/                 ← DistrictTable, LoadChart

/lib
  types.ts                 ← All TypeScript interfaces
  mockData.ts              ← Seeded mock data (districts, issues, assets, etc.)
  issueStore.tsx           ← React Context + useReducer issue pipeline
  utils.ts                 ← Formatting and utility functions
```

---

## 🌐 Deploy to Vercel

1. Import this repository at [vercel.com/new](https://vercel.com/new)
2. Vercel auto-detects Next.js — no configuration needed
3. Click **Deploy**

---

## 📜 License

MIT — see [LICENSE](./LICENSE)
