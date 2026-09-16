# Daily Prep Dashboard

A modern, interactive web dashboard for tracking your 60-Day Daily Prep Plan (Foreman Industry Blueprint).

## Features

### 📊 Overview / Home
- **Progress Rings**: Visual representation of overall, Phase A, and Phase B completion percentages
- **Quick Stats Cards**: Days completed, in progress, not started, and current day
- **Today's Focus Card**: Auto-detects current day based on start date (Sep 14, 2026)
- **Upcoming Checkpoints**: Quick access to next milestone days
- **Phase Progress Bars**: Visual progress for Phase A (Build) and Phase B (Defense)

### 📅 Daily View (Most Important)
- **Day Navigation**: 
  - Previous/Next buttons
  - Dropdown selector for any day
  - Mini calendar grid showing all 60 days at a glance
  - "Go to Today" button
- **Day Details**:
  - Date, day number, weekday, and status (editable)
  - **Slot 1** (Fundamentals): Interactive checklist from Excel content
  - **Slot 2** (Foreman Build): Full content with deliverables
  - **Slot 3** (Interview Practice): Practice activities
  - **Slot 4A + 4B** (Deep Topic + System Design/AWS)
  - Deliverable (must run)
  - Interview talking point
  - Daily win
- **Task Tracking**: Click individual tasks to mark complete
- **Notes & Reflection**: Persistent text area per day

### 📋 All Days List
- **Filterable/Kanban-style view** of all 60 days
- **Filters**:
  - Phase A / Phase B
  - Status (Not Started / In Progress / Done)
  - Search by date, deliverable, or topics
- **Week grouping**: Days organized by week
- **Visual indicators**: Checkpoint days (purple), Buffer days (cyan)

### 🚩 Checkpoints & Critical Days
- Dedicated section for Checkpoint days (7, 14, 26, 30, 50, 60)
- Buffer / Recall days section (7, 14, 23, 30, 34, 44)
- Quick navigation to any checkpoint day

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Persistence**: localStorage
- **Data Source**: Parsed from `Daily_Prep_Plan_v12_60Days_Full_PhaseB_Defense_UPDATED.xlsx`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
cd daily-prep-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Data Structure

The dashboard uses data parsed from the Excel file with two sheets:
- `Days_1_30_Build_v10`: Phase A (Days 1-30)
- `Days_31_60_PhaseB_Defense`: Phase B (Days 31-60)

Each day includes:
- Date, day number, weekday
- 4 learning slots with detailed content
- Core interview topics
- Resources
- Deliverables
- Talking points
- Daily wins

## Features Detail

### Progress Tracking
- Status options: Not Started, In Progress, Done
- Auto-save to localStorage
- Task-level tracking within each slot
- Notes/reflections per day

### Export & Reset
- **Export**: Download your progress as JSON
- **Reset**: Clear all progress (with confirmation)

### Responsive Design
- Works on desktop, tablet, and mobile
- Dark mode by default (professional look)
- Smooth interactions and transitions

## Keyboard Shortcuts

- Use arrow keys concept via Previous/Next buttons in Daily View
- Tab navigation supported throughout

## Data Persistence

All progress is saved to `localStorage` automatically:
- Day statuses
- Completed tasks
- Notes and reflections

Data persists across browser sessions.

## Customization

You can modify:
- Start date in `useDailyPrep.ts` (currently Sep 14, 2026)
- Checkpoint days in `types/index.ts`
- Buffer days in `types/index.ts`
- Color themes in Tailwind config

## File Structure

```
src/
├── app/
│   └── page.tsx              # Main entry point
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.tsx     # Main dashboard component
│   │   ├── DashboardOverview.tsx
│   │   ├── DayDetail.tsx
│   │   ├── DayListView.tsx
│   │   └── DaySelector.tsx
│   └── ui/
│       └── ProgressComponents.tsx
├── data/
│   └── daily_prep_data.json  # Parsed Excel data
├── hooks/
│   └── useDailyPrep.ts       # State management & localStorage
├── lib/
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript types
```

## License

Personal use for tracking your Daily Prep Plan progress.
