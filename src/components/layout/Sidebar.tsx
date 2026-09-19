'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Lesson } from '@/types';
import { getCompletedLessons } from '@/lib/progress';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface SidebarProps {
  track: string;
  lessons: Lesson[];
  onCloseMobile?: () => void;
}

const NAV = [
  { href: (t: string) => `/${t}`, label: 'Overview', icon: '⊞' },
  { href: (t: string) => `/${t}/lessons`, label: 'Lessons', icon: '📚' },
  { href: (t: string) => `/${t}/practice`, label: 'Practice', icon: '⚡' },
  { href: (t: string) => `/${t}/projects`, label: 'Projects', icon: '🛠' },
  { href: (t: string) => `/${t}/interview`, label: 'Interview', icon: '🎯' },
  { href: (t: string) => `/${t}/revision`, label: 'Revision', icon: '📋' },
  { href: (t: string) => `/${t}/playground`, label: 'Playground', icon: '▶' },
];

export function Sidebar({ track, lessons, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [completed, setCompleted] = useState<string[]>(() => getCompletedLessons(track));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = () => setCompleted(getCompletedLessons(track));
    window.addEventListener('lessonProgress', handler);
    return () => window.removeEventListener('lessonProgress', handler);
  }, [track]);

  const grouped = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const progress = Math.round((completed.length / Math.max(lessons.length, 1)) * 100);

  function toggleCategory(cat: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  return (
    <aside className="w-60 shrink-0 bg-[#07070b] border-r border-slate-800/50 h-screen flex flex-col overflow-hidden">
      {/* Brand + track header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800/50 shrink-0">
        <Link href="/" onClick={onCloseMobile} className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md shadow-violet-500/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.ico" alt="Logo" className="w-7 h-7" />
          </div>
          <span className="text-sm font-semibold text-slate-300">Learning</span>
        </Link>

        <ProgressBar value={progress} showLabel color="bg-violet-500" />
        <p className="text-[11px] text-slate-600 mt-1">{completed.length} of {lessons.length} lessons done</p>
      </div>

      {/* Quick nav */}
      <div className="px-2 py-2 border-b border-slate-800/50 shrink-0">
        {NAV.map(({ href, label, icon }) => {
          const path = href(track);
          const isActive =
            pathname === path ||
            (path.includes('/lessons') && pathname.startsWith(path) && !pathname.includes('/['));
          return (
            <Link
              key={path}
              href={path}
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors mb-0.5 touch-manipulation ${
                isActive
                  ? 'bg-violet-500/15 text-violet-300 font-medium'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-sm w-4 text-center shrink-0">{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* Lessons tree */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Lessons</p>
        {Object.entries(grouped).map(([category, catLessons]) => {
          const isCollapsed = collapsed.has(category);
          const catDone = catLessons.filter((l) => completed.includes(l.id)).length;
          return (
            <div key={category} className="mb-1">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-400 uppercase tracking-wider transition-colors touch-manipulation"
              >
                <span>{category}</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-700">{catDone}/{catLessons.length}</span>
                  <span className="text-slate-700">{isCollapsed ? '▶' : '▼'}</span>
                </span>
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mb-1">
                  {catLessons.map((lesson) => {
                    const isActive = pathname === `/${track}/lessons/${lesson.slug}`;
                    const isDone = completed.includes(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={`/${track}/lessons/${lesson.slug}`}
                        onClick={onCloseMobile}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors touch-manipulation ${
                          isActive
                            ? 'bg-violet-500/15 text-violet-300 font-medium'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center text-[9px] ${
                            isDone
                              ? 'bg-green-500/20 border-green-500/40 text-green-400'
                              : isActive
                              ? 'border-violet-500/50 text-violet-400'
                              : 'border-slate-700 text-slate-600'
                          }`}
                        >
                          {isDone ? '✓' : lesson.order}
                        </span>
                        <span className="truncate leading-tight">{lesson.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back link */}
      <div className="px-4 py-3 border-t border-slate-800/50 shrink-0">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1.5 touch-manipulation"
        >
          ← All Tracks
        </Link>
      </div>
    </aside>
  );
}
