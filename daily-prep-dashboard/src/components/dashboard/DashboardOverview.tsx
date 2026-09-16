'use client';

import { DayData, DayStatus } from '@/types';
import { ProgressRing, StatCard, ProgressBar } from '../ui/ProgressComponents';
import { Target, CheckCircle, Clock, AlertCircle, Trophy, BookOpen, Code2, MessageSquare } from 'lucide-react';

interface DashboardOverviewProps {
  days: DayData[];
  stats: {
    totalDays: number;
    completedDays: number;
    inProgressDays: number;
    notStartedDays: number;
    phaseACompleted: number;
    phaseBCompleted: number;
    overallProgress: number;
    phaseAProgress: number;
    phaseBProgress: number;
  };
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export function DashboardOverview({
  days,
  stats,
  selectedDay,
  onSelectDay,
}: DashboardOverviewProps) {
  const todayDay = (() => {
    const startDate = new Date('2026-09-14');
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(60, diffDays + 1));
  })();

  const todayData = days.find((d) => d.day === todayDay);
  const checkpointDays = [7, 14, 26, 30, 50, 60];
  const upcomingCheckpoints = checkpointDays.filter((d) => d > selectedDay).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Main Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress Ring */}
        <div className="rounded-xl bg-gray-800/50 p-6 border border-gray-700/50 backdrop-blur-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-white mb-4">Overall Progress</h3>
          <ProgressRing
            progress={stats.overallProgress}
            size={140}
            strokeWidth={10}
            color="#3b82f6"
          />
          <p className="mt-4 text-sm text-gray-400">
            {stats.completedDays} of {stats.totalDays} days complete
          </p>
        </div>

        {/* Phase A Progress */}
        <div className="rounded-xl bg-gray-800/50 p-6 border border-gray-700/50 backdrop-blur-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Phase A (Days 1-30)</h3>
          <ProgressRing
            progress={stats.phaseAProgress}
            size={140}
            strokeWidth={10}
            color="#60a5fa"
          />
          <p className="mt-4 text-sm text-gray-400">
            {stats.phaseACompleted} of 30 days complete
          </p>
        </div>

        {/* Phase B Progress */}
        <div className="rounded-xl bg-gray-800/50 p-6 border border-gray-700/50 backdrop-blur-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-indigo-300 mb-4">Phase B (Days 31-60)</h3>
          <ProgressRing
            progress={stats.phaseBProgress}
            size={140}
            strokeWidth={10}
            color="#818cf8"
          />
          <p className="mt-4 text-sm text-gray-400">
            {stats.phaseBCompleted} of 30 days complete
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Days Completed"
          value={stats.completedDays}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressDays}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          title="Not Started"
          value={stats.notStartedDays}
          icon={<AlertCircle className="w-5 h-5" />}
        />
        <StatCard
          title="Current Day"
          value={selectedDay}
          icon={<Target className="w-5 h-5" />}
        />
      </div>

      {/* Today's Focus Card */}
      {todayData && (
        <div className="rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-6 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Today&apos;s Focus (Day {todayDay})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-blue-300 mb-2">Main Deliverable</h4>
              <p className="text-sm text-gray-300">{todayData.deliverable}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-indigo-300 mb-2">Key Topic</h4>
              <p className="text-sm text-gray-300">{todayData.core_topics.split('\n')[0]}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectDay(todayDay)}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            Go to Day {todayDay}
          </button>
        </div>
      )}

      {/* Upcoming Checkpoints */}
      <div className="rounded-xl bg-gray-800/50 p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Checkpoints</h3>
        <div className="flex flex-wrap gap-3">
          {upcomingCheckpoints.map((dayNum) => {
            const dayData = days.find((d) => d.day === dayNum);
            const dayProgress = days[dayNum - 1] ? 'Done' : 'Not Started';
            
            return (
              <button
                key={dayNum}
                onClick={() => onSelectDay(dayNum)}
                className="px-4 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 transition-colors text-left"
              >
                <div className="text-xs text-purple-300">Checkpoint</div>
                <div className="text-lg font-bold text-white">Day {dayNum}</div>
                <div className="text-xs text-gray-400">{dayData?.date}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Progress Bars */}
      <div className="rounded-xl bg-gray-800/50 p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Phase Progress</h3>
        <div className="space-y-4">
          <ProgressBar
            label="Phase A (Build)"
            progress={stats.phaseAProgress}
            color="bg-blue-500"
          />
          <ProgressBar
            label="Phase B (Defense)"
            progress={stats.phaseBProgress}
            color="bg-indigo-500"
          />
          <ProgressBar
            label="Overall"
            progress={stats.overallProgress}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Key Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h4 className="font-medium text-white">Fundamentals</h4>
          </div>
          <p className="text-sm text-gray-400">
            Daily OOP, Python patterns, and core CS concepts building strong foundation
          </p>
        </div>

        <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-5 h-5 text-green-400" />
            <h4 className="font-medium text-white">Foreman Build</h4>
          </div>
          <p className="text-sm text-gray-400">
            Full-stack agent platform with auth, RAG, approvals, and production hardening
          </p>
        </div>

        <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-yellow-400" />
            <h4 className="font-medium text-white">Interview Defense</h4>
          </div>
          <p className="text-sm text-gray-400">
            Daily recorded explanations and STAR stories for confident delivery
          </p>
        </div>
      </div>
    </div>
  );
}
