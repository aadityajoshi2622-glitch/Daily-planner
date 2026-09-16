'use client';

import { cn } from '@/lib/utils';
import { DashboardStats } from '@/types';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  color = '#3b82f6',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            className="text-gray-700"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-500 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{progress}%</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm font-medium text-gray-300">{label}</span>}
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gray-800/50 p-6 border border-gray-700/50 backdrop-blur-sm',
        'hover:border-gray-600 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-gray-700/50 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  label?: string;
  showLabel?: boolean;
  color?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  label,
  showLabel = true,
  color = 'bg-blue-500',
  className,
}: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
          {showLabel && (
            <span className="text-sm font-medium text-gray-400">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={cn('h-2.5 rounded-full transition-all duration-500 ease-out', color)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    'Not Started': 'bg-gray-700 text-gray-300',
    'In Progress': 'bg-yellow-600/30 text-yellow-300 border border-yellow-600/50',
    'Done': 'bg-green-600/30 text-green-300 border border-green-600/50',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-medium',
        colors[status] || colors['Not Started'],
        className
      )}
    >
      {status}
    </span>
  );
}
