'use client';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parse, isToday, isPast } from 'date-fns';
import { DayData, DayStatus } from '@/types';
import { cn, isCheckpointDay, isBufferDay, getPhase } from '@/lib/utils';
import { StatusBadge } from '../ui/ProgressComponents';

interface DaySelectorProps {
  days: DayData[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  progress: Record<number, { status: DayStatus }>;
}

export function DaySelector({ days, selectedDay, onSelectDay, progress }: DaySelectorProps) {
  const currentDayData = days.find((d) => d.day === selectedDay);

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDay = direction === 'prev' ? selectedDay - 1 : selectedDay + 1;
    if (newDay >= 1 && newDay <= 60) {
      onSelectDay(newDay);
    }
  };

  const goToToday = () => {
    // Calculate day based on start date (Sep 14, 2026)
    const startDate = new Date('2026-09-14');
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const calculatedDay = Math.max(1, Math.min(60, diffDays + 1));
    onSelectDay(calculatedDay);
  };

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateDay('prev')}
          disabled={selectedDay <= 1}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">
            Day {selectedDay}
          </h2>
          {currentDayData && (
            <span className="text-sm text-gray-400">
              {currentDayData.weekday}, {currentDayData.date}
            </span>
          )}
          {isCheckpointDay(selectedDay) && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-600/30 text-purple-300 border border-purple-600/50">
              Checkpoint
            </span>
          )}
          {isBufferDay(selectedDay) && !isCheckpointDay(selectedDay) && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-600/30 text-cyan-300 border border-cyan-600/50">
              Buffer
            </span>
          )}
          <span className={cn(
            'px-2 py-0.5 rounded-full text-xs font-medium',
            getPhase(selectedDay) === 'A' 
              ? 'bg-blue-600/30 text-blue-300 border border-blue-600/50'
              : 'bg-indigo-600/30 text-indigo-300 border border-indigo-600/50'
          )}>
            Phase {getPhase(selectedDay)}
          </span>
        </div>

        <button
          onClick={() => navigateDay('next')}
          disabled={selectedDay >= 60}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToToday}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Go to Today
        </button>
        <select
          value={selectedDay}
          onChange={(e) => onSelectDay(Number(e.target.value))}
          className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
        >
          {days.map((day) => (
            <option key={day.day} value={day.day}>
              Day {day.day} - {day.date}
            </option>
          ))}
        </select>
      </div>

      {/* Mini Calendar Grid */}
      <div className="grid grid-cols-10 gap-1">
        {days.map((day) => {
          const dayProgress = progress[day.day];
          const status = dayProgress?.status || 'Not Started';
          const isDone = status === 'Done';
          const isInProgress = status === 'In Progress';

          return (
            <button
              key={day.day}
              onClick={() => onSelectDay(day.day)}
              className={cn(
                'aspect-square rounded-lg text-xs font-medium transition-all',
                'flex flex-col items-center justify-center gap-0.5',
                selectedDay === day.day && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900',
                isDone && 'bg-green-600/30 text-green-300 border border-green-600/50',
                isInProgress && !isDone && 'bg-yellow-600/30 text-yellow-300 border border-yellow-600/50',
                !isDone && !isInProgress && 'bg-gray-800 text-gray-400 hover:bg-gray-700',
                isCheckpointDay(day.day) && 'border-purple-500/50',
                isBufferDay(day.day) && !isCheckpointDay(day.day) && 'border-cyan-500/50'
              )}
            >
              <span>{day.day}</span>
              {isDone && <span className="text-[8px]">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
