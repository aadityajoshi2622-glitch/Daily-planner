'use client';

import { useState } from 'react';
import { DayData, DayStatus } from '@/types';
import { cn, getWeekNumber, isCheckpointDay, isBufferDay, getPhase } from '@/lib/utils';
import { StatusBadge } from '../ui/ProgressComponents';
import { Filter, Search } from 'lucide-react';

interface DayListViewProps {
  days: DayData[];
  progress: Record<number, { status: DayStatus }>;
  onSelectDay: (day: number) => void;
}

type FilterPhase = 'all' | 'A' | 'B';
type FilterStatus = 'all' | 'Not Started' | 'In Progress' | 'Done';

export function DayListView({ days, progress, onSelectDay }: DayListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState<FilterPhase>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDays = days.filter((day) => {
    // Phase filter
    if (filterPhase !== 'all') {
      const dayPhase = getPhase(day.day);
      if (dayPhase !== filterPhase) return false;
    }

    // Status filter
    if (filterStatus !== 'all') {
      const dayProgress = progress[day.day];
      if ((dayProgress?.status || 'Not Started') !== filterStatus) return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        day.date.toLowerCase().includes(searchLower) ||
        day.weekday.toLowerCase().includes(searchLower) ||
        day.deliverable.toLowerCase().includes(searchLower) ||
        day.core_topics.toLowerCase().includes(searchLower) ||
        `day ${day.day}`.includes(searchLower)
      );
    }

    return true;
  });

  // Group by week
  const weeks = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search days..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
            showFilters 
              ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' 
              : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
          )}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Phase</label>
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value as FilterPhase)}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:outline-none"
            >
              <option value="all">All Phases</option>
              <option value="A">Phase A (Days 1-30)</option>
              <option value="B">Phase B (Days 31-60)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-400">
            Showing {filteredDays.length} of {days.length} days
          </div>
        </div>
      )}

      {/* Days List grouped by week */}
      <div className="space-y-6">
        {weeks.map((week) => {
          const weekDays = filteredDays.filter((d) => getWeekNumber(d.day) === week);
          if (weekDays.length === 0) return null;

          return (
            <div key={week}>
              <h3 className="text-sm font-medium text-gray-400 mb-3 sticky top-0 bg-gray-950 py-2">
                Week {week} (Days {(week - 1) * 7 + 1}-{Math.min(week * 7, 60)})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {weekDays.map((day) => {
                  const dayProgress = progress[day.day];
                  const status = dayProgress?.status || 'Not Started';
                  const isCheckpoint = isCheckpointDay(day.day);
                  const isBuffer = isBufferDay(day.day);

                  return (
                    <button
                      key={day.day}
                      onClick={() => onSelectDay(day.day)}
                      className={cn(
                        'p-4 rounded-xl border text-left transition-all hover:scale-[1.02]',
                        'bg-gray-800/30 hover:bg-gray-800/50',
                        status === 'Done' && 'border-green-500/30 hover:border-green-500/50',
                        status === 'In Progress' && 'border-yellow-500/30 hover:border-yellow-500/50',
                        status === 'Not Started' && 'border-gray-700/50 hover:border-gray-600/50',
                        isCheckpoint && 'border-purple-500/50',
                        isBuffer && !isCheckpoint && 'border-cyan-500/50'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-lg font-bold text-white">Day {day.day}</span>
                          <p className="text-xs text-gray-400">{day.date} • {day.weekday}</p>
                        </div>
                        <StatusBadge status={status} />
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 line-clamp-2">
                          🎯 {day.deliverable}
                        </p>
                        {isCheckpoint && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-purple-600/30 text-purple-300">
                            Checkpoint
                          </span>
                        )}
                        {isBuffer && !isCheckpoint && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-600/30 text-cyan-300">
                            Buffer
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
