import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getWeekNumber(day: number): number {
  return Math.ceil(day / 7);
}

export function isCheckpointDay(day: number): boolean {
  return [7, 14, 26, 30, 50, 60].includes(day);
}

export function isBufferDay(day: number): boolean {
  return [7, 14, 23, 30, 34, 44].includes(day);
}

export function getPhase(day: number): 'A' | 'B' {
  return day <= 30 ? 'A' : 'B';
}
