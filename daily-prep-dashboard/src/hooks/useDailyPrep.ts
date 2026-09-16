'use client';

import { useEffect, useState, useCallback } from 'react';
import { DayData, DayProgress, DayStatus, DashboardStats, PHASE_A_DAYS, TOTAL_DAYS } from '@/types';
import dailyData from '@/data/daily_prep_data.json';

const STORAGE_KEY = 'daily-prep-progress';

export function useDailyPrep() {
  const [progress, setProgress] = useState<Record<number, DayProgress>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved progress:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const getDayProgress = useCallback((dayId: number): DayProgress => {
    return (
      progress[dayId] || {
        dayId,
        status: 'Not Started',
        completedTasks: [],
        notes: '',
        lastUpdated: new Date().toISOString(),
      }
    );
  }, [progress]);

  const updateDayStatus = useCallback((dayId: number, status: DayStatus) => {
    setProgress((prev) => ({
      ...prev,
      [dayId]: {
        ...getDayProgress(dayId),
        status,
        lastUpdated: new Date().toISOString(),
      },
    }));
  }, [getDayProgress]);

  const toggleTask = useCallback((dayId: number, task: string) => {
    setProgress((prev) => {
      const current = getDayProgress(dayId);
      const completedTasks = current.completedTasks.includes(task)
        ? current.completedTasks.filter((t) => t !== task)
        : [...current.completedTasks, task];
      
      // Auto-update status based on tasks
      let newStatus: DayStatus = 'Not Started';
      if (completedTasks.length > 0) {
        newStatus = completedTasks.length >= 3 ? 'Done' : 'In Progress';
      }

      return {
        ...prev,
        [dayId]: {
          ...current,
          completedTasks,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  }, [getDayProgress]);

  const updateNotes = useCallback((dayId: number, notes: string) => {
    setProgress((prev) => ({
      ...prev,
      [dayId]: {
        ...getDayProgress(dayId),
        notes,
        lastUpdated: new Date().toISOString(),
      },
    }));
  }, [getDayProgress]);

  const getStats = useCallback((): DashboardStats => {
    const days = Object.values(progress);
    const completedDays = days.filter((d) => d.status === 'Done').length;
    const inProgressDays = days.filter((d) => d.status === 'In Progress').length;
    const notStartedDays = TOTAL_DAYS - completedDays - inProgressDays;

    const phaseADays = days.filter((d) => d.dayId <= PHASE_A_DAYS);
    const phaseBDays = days.filter((d) => d.dayId > PHASE_A_DAYS);

    const phaseACompleted = phaseADays.filter((d) => d.status === 'Done').length;
    const phaseBCompleted = phaseBDays.filter((d) => d.status === 'Done').length;

    return {
      totalDays: TOTAL_DAYS,
      completedDays,
      inProgressDays,
      notStartedDays,
      phaseACompleted,
      phaseBCompleted,
      overallProgress: Math.round((completedDays / TOTAL_DAYS) * 100),
      phaseAProgress: Math.round((phaseACompleted / PHASE_A_DAYS) * 100),
      phaseBProgress: Math.round((phaseBCompleted / PHASE_A_DAYS) * 100),
    };
  }, [progress]);

  const exportProgress = useCallback(() => {
    const dataStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-prep-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [progress]);

  const resetProgress = useCallback(() => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setProgress({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    dailyData: dailyData as DayData[],
    progress,
    isLoaded,
    getDayProgress,
    updateDayStatus,
    toggleTask,
    updateNotes,
    getStats,
    exportProgress,
    resetProgress,
  };
}
