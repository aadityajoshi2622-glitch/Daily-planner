'use client';

import { useState } from 'react';
import { useDailyPrep } from '@/hooks/useDailyPrep';
import { DaySelector } from './DaySelector';
import { DayDetail } from './DayDetail';
import { DashboardOverview } from './DashboardOverview';
import { DayListView } from './DayListView';
import { ProgressRing, StatCard } from '../ui/ProgressComponents';
import { Home, Calendar, ListTodo, Flag, Download, RotateCcw, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'daily' | 'list' | 'checkpoints';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedDay, setSelectedDay] = useState(1);
  
  const {
    dailyData,
    progress,
    isLoaded,
    getDayProgress,
    updateDayStatus,
    toggleTask,
    updateNotes,
    getStats,
    exportProgress,
    resetProgress,
  } = useDailyPrep();

  const stats = getStats();
  const currentDayData = dailyData.find((d) => d.day === selectedDay);
  const currentProgress = getDayProgress(selectedDay);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const checkpointDays = [7, 14, 26, 30, 50, 60];
  const checkpointData = checkpointDays.map((dayNum) => ({
    day: dayNum,
    data: dailyData.find((d) => d.day === dayNum),
    progress: progress[dayNum],
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Daily Prep Dashboard</h1>
                <p className="text-xs text-gray-400">60-Day Foreman Industry Plan</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportProgress}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
                title="Export progress as JSON"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={resetProgress}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-red-900/30 text-sm transition-colors text-red-400 hover:text-red-300"
                title="Reset all progress"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'daily', label: 'Daily View', icon: Calendar },
              { id: 'list', label: 'All Days', icon: ListTodo },
              { id: 'checkpoints', label: 'Checkpoints', icon: Flag },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as Tab)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            days={dailyData}
            stats={stats}
            selectedDay={selectedDay}
            onSelectDay={(day) => {
              setSelectedDay(day);
              setActiveTab('daily');
            }}
          />
        )}

        {activeTab === 'daily' && currentDayData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-40 space-y-6">
                <DaySelector
                  days={dailyData}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  progress={progress}
                />
                
                {/* Quick Status Update */}
                <div className="rounded-xl bg-gray-800/50 p-4 border border-gray-700/50">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Status</h3>
                  <div className="space-y-2">
                    {(['Not Started', 'In Progress', 'Done'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateDayStatus(selectedDay, status)}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg text-sm transition-colors text-left',
                          currentProgress.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <DayDetail
                day={currentDayData}
                progress={currentProgress}
                onUpdateStatus={(status) => updateDayStatus(selectedDay, status)}
                onToggleTask={(task) => toggleTask(selectedDay, task)}
                onUpdateNotes={(notes) => updateNotes(selectedDay, notes)}
              />
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <DayListView
            days={dailyData}
            progress={progress}
            onSelectDay={(day) => {
              setSelectedDay(day);
              setActiveTab('daily');
            }}
          />
        )}

        {activeTab === 'checkpoints' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Checkpoints & Critical Days</h2>
              <p className="text-gray-400">
                Key milestone days for assessment and review throughout your 60-day journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checkpointData.map(({ day, data, progress: dayProgress }) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setActiveTab('daily');
                  }}
                  className="p-6 rounded-xl bg-gray-800/50 border border-purple-500/30 hover:border-purple-500/50 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600/30 text-purple-300">
                      Checkpoint {checkpointDays.indexOf(day) + 1}
                    </span>
                    {dayProgress?.status === 'Done' ? (
                      <span className="text-green-400">✓ Complete</span>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">Day {day}</h3>
                  <p className="text-sm text-gray-400 mb-3">{data?.date}</p>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Deliverable:</span>
                      <p className="text-gray-300 line-clamp-2">{data?.deliverable}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Buffer Days Section */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-4">Buffer / Recall Days</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[7, 14, 23, 30, 34, 44].map((day) => {
                  const data = dailyData.find((d) => d.day === day);
                  const dayProgress = progress[day];
                  
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDay(day);
                        setActiveTab('daily');
                      }}
                      className="p-4 rounded-xl bg-cyan-900/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-all text-center"
                    >
                      <div className="text-2xl font-bold text-white mb-1">Day {day}</div>
                      <div className="text-xs text-gray-400 mb-2">{data?.date}</div>
                      {dayProgress?.status === 'Done' && (
                        <span className="text-xs text-green-400">✓ Done</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Daily Prep Plan v12 • 60-Day Foreman Industry Blueprint
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Phase A: Days 1-30</span>
              <span>•</span>
              <span>Phase B: Days 31-60</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
