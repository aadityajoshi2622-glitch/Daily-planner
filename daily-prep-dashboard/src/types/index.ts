// Data types for the Daily Prep Plan dashboard

export interface DayData {
  date: string;
  day: number;
  weekday: string;
  status: string;
  slot1: string;
  core_topics: string;
  resources: string;
  slot2: string;
  slot3: string;
  slot4a: string;
  slot4b: string;
  deliverable: string;
  talking_point: string;
  daily_win: string;
}

export type DayStatus = 'Not Started' | 'In Progress' | 'Done';

export interface DayProgress {
  dayId: number;
  status: DayStatus;
  completedTasks: string[];
  notes: string;
  lastUpdated: string;
}

export interface DashboardStats {
  totalDays: number;
  completedDays: number;
  inProgressDays: number;
  notStartedDays: number;
  phaseACompleted: number;
  phaseBCompleted: number;
  overallProgress: number;
  phaseAProgress: number;
  phaseBProgress: number;
}

export const PHASE_A_DAYS = 30;
export const PHASE_B_DAYS = 30;
export const TOTAL_DAYS = 60;

// Checkpoint days (based on the plan structure)
export const CHECKPOINT_DAYS = [7, 14, 26, 30, 50, 60];
export const BUFFER_DAYS = [7, 14, 23, 30, 34, 44];
