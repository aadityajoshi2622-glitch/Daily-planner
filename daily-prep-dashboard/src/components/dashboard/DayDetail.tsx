'use client';

import { useState, useEffect } from 'react';
import { DayData, DayStatus } from '@/types';
import { cn } from '@/lib/utils';
import { StatusBadge } from '../ui/ProgressComponents';
import { CheckSquare, Square, Clock } from 'lucide-react';

interface DayDetailProps {
  day: DayData;
  progress: {
    status: DayStatus;
    completedTasks: string[];
    notes: string;
  };
  onUpdateStatus: (status: DayStatus) => void;
  onToggleTask: (task: string) => void;
  onUpdateNotes: (notes: string) => void;
}

export function DayDetail({
  day,
  progress,
  onUpdateStatus,
  onToggleTask,
  onUpdateNotes,
}: DayDetailProps) {
  const [localNotes, setLocalNotes] = useState(progress.notes);

  useEffect(() => {
    setLocalNotes(progress.notes);
  }, [progress.notes]);

  const parseTasks = (content: string): string[] => {
    if (!content) return [];
    const lines = content.split('\n');
    const tasks: string[] = [];
    
    // Extract bullet points and timed sections
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d{1,2}:\d{2}/.test(trimmed)) {
        // Clean up the task text
        let task = trimmed.replace(/^[•-]\s*/, '').replace(/^\d{1,2}:\d{2}[–-]\d{1,2}:\d{2}\s*—\s*/, '');
        // Only add if it's a meaningful task (not just a header)
        if (task.length > 10 && !task.includes('IMPLEMENT') && !task.includes('UNDERSTAND')) {
          tasks.push(task.split('(')[0].trim());
        }
      }
    });
    
    return tasks.slice(0, 8); // Limit to 8 tasks per slot
  };

  const SlotCard = ({ 
    title, 
    content, 
    icon,
    colorClass 
  }: { 
    title: string; 
    content: string;
    icon?: React.ReactNode;
    colorClass: string;
  }) => {
    const tasks = parseTasks(content);
    
    return (
      <div className={cn(
        'rounded-xl border p-5 bg-gray-800/30',
        colorClass
      )}>
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task, idx) => {
              const taskId = `${day.day}-${title}-${idx}`;
              const isCompleted = progress.completedTasks.includes(taskId);
              
              return (
                <button
                  key={idx}
                  onClick={() => onToggleTask(taskId)}
                  className="w-full text-left flex items-start gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  {isCompleted ? (
                    <CheckSquare className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={cn(
                    'text-sm',
                    isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'
                  )}>
                    {task}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 whitespace-pre-wrap">{content}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Day {day.day}: {day.weekday}</h1>
          <p className="text-gray-400">{day.date}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={progress.status}
            onChange={(e) => onUpdateStatus(e.target.value as DayStatus)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <StatusBadge status={progress.status} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slot 1 */}
        <SlotCard
          title="Slot 1: Fundamentals (10:00–12:00)"
          content={day.slot1}
          colorClass="border-blue-500/30"
        />

        {/* Slot 2 */}
        <SlotCard
          title="Slot 2: Foreman Build (12:45–15:45)"
          content={day.slot2}
          colorClass="border-green-500/30"
        />

        {/* Slot 3 */}
        <SlotCard
          title="Slot 3: Interview Practice (16:15–17:45)"
          content={day.slot3}
          colorClass="border-yellow-500/30"
        />

        {/* Slot 4A */}
        <SlotCard
          title="Slot 4A: Deep Topic (18:00–19:30)"
          content={day.slot4a}
          colorClass="border-purple-500/30"
        />

        {/* Slot 4B */}
        <SlotCard
          title="Slot 4B: System Design / AWS (20:30–22:00)"
          content={day.slot4b}
          colorClass="border-indigo-500/30"
        />

        {/* Core Topics & Resources */}
        <div className="rounded-xl border border-gray-700/50 p-5 bg-gray-800/30">
          <h3 className="font-semibold text-white mb-3">Core Interview Topics</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {day.core_topics.split('\n').map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs bg-gray-700 text-gray-300"
              >
                {topic}
              </span>
            ))}
          </div>
          <h3 className="font-semibold text-white mb-2">Resources</h3>
          <p className="text-sm text-gray-400 whitespace-pre-wrap">{day.resources}</p>
        </div>
      </div>

      {/* Deliverables & Talking Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-orange-500/30 p-5 bg-gray-800/30">
          <h3 className="font-semibold text-orange-300 mb-2">🎯 Deliverable (Must Run)</h3>
          <p className="text-sm text-gray-200">{day.deliverable}</p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 p-5 bg-gray-800/30">
          <h3 className="font-semibold text-cyan-300 mb-2">💬 Interview Talking Point</h3>
          <p className="text-sm text-gray-200 italic">{day.talking_point}</p>
        </div>
      </div>

      {/* Daily Win */}
      <div className="rounded-xl border border-green-500/30 p-5 bg-gray-800/30">
        <h3 className="font-semibold text-green-300 mb-2">✅ Daily Win</h3>
        <p className="text-sm text-gray-200">{day.daily_win}</p>
      </div>

      {/* Notes Section */}
      <div className="rounded-xl border border-gray-700/50 p-5 bg-gray-800/30">
        <h3 className="font-semibold text-white mb-3">📝 Notes & Reflection</h3>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={() => onUpdateNotes(localNotes)}
          placeholder="Add your notes, reflections, or things to remember..."
          className="w-full h-32 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none text-sm text-gray-200 resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">
          Notes are auto-saved when you click away
        </p>
      </div>
    </div>
  );
}
