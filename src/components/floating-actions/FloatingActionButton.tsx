'use client';

import { useState, useRef, useEffect } from 'react';

interface FloatingActionButtonProps {
  onOpenAI: () => void;
  onOpenNotes: () => void;
}

export function FloatingActionButton({ onOpenAI, onOpenNotes }: FloatingActionButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleAI() {
    setOpen(false);
    onOpenAI();
  }

  function handleNotes() {
    setOpen(false);
    onOpenNotes();
  }

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3"
      role="region"
      aria-label="Quick actions"
    >
      {/* Menu items */}
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <button
          onClick={handleNotes}
          className="flex items-center gap-2.5 pl-3 pr-4 py-2 bg-[#0f172a] border border-slate-700/70 rounded-full text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors shadow-xl shadow-black/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 whitespace-nowrap"
          tabIndex={open ? 0 : -1}
          aria-label="Open Notes"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 shrink-0">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          Notes
        </button>

        <button
          onClick={handleAI}
          className="flex items-center gap-2.5 pl-3 pr-4 py-2 bg-[#0f172a] border border-slate-700/70 rounded-full text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors shadow-xl shadow-black/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 whitespace-nowrap"
          tabIndex={open ? 0 : -1}
          aria-label="Open AI Assistant"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/15 text-violet-400 shrink-0">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          AI Assistant
        </button>
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close quick actions menu' : 'Open quick actions menu'}
        aria-expanded={open}
        className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-2xl shadow-violet-900/50 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#050508] ${
          open ? 'rotate-45' : 'rotate-0'
        }`}
        style={{ width: '3.25rem', height: '3.25rem' }}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
