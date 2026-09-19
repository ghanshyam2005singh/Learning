'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getInterviewQuestions } from '@/lib/content';
import { Badge } from '@/components/ui/Badge';
import type { Difficulty } from '@/types';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export default function InterviewPage() {
  const { track } = useParams<{ track: string }>();
  const questions = getInterviewQuestions(track);
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [open, setOpen] = useState<Set<number>>(new Set());

  const filtered = filter === 'all' ? questions : questions.filter((q) => q.difficulty === filter);

  function toggle(i: number) {
    if (practiceMode) {
      setOpen((prev) => {
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
      });
    } else {
      setOpen((prev) => {
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
      });
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Interview Prep</h1>
        <p className="text-slate-400">{questions.length} questions with detailed answers. Toggle Practice Mode to hide answers.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${filter === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            All ({questions.length})
          </button>
          {DIFFICULTIES.map((d) => {
            const count = questions.filter((q) => q.difficulty === d).length;
            return (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${filter === d ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                {d} ({count})
              </button>
            );
          })}
        </div>
        <button
          onClick={() => { setPracticeMode((m) => !m); setOpen(new Set()); }}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${practiceMode ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          {practiceMode ? '📖 Practice Mode ON' : '📝 Practice Mode'}
        </button>
      </div>

      {practiceMode && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-300">
          Practice mode: answers are hidden. Click a question to reveal its answer.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((q, i) => (
          <div key={i} className="border border-slate-700/60 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-start justify-between px-4 py-4 text-left hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <Badge variant={q.difficulty}>{q.difficulty}</Badge>
                <span className="text-slate-200 text-sm leading-relaxed">{q.question}</span>
              </div>
              <span className="text-slate-500 flex-shrink-0 ml-3 mt-0.5">{open.has(i) ? '▲' : '▼'}</span>
            </button>
            {open.has(i) && (
              <div className="border-t border-slate-700/60 px-4 py-4 bg-slate-900/40 space-y-3">
                <p className="text-slate-300 text-sm leading-relaxed">{q.answer}</p>
                {q.tip && (
                  <p className="text-violet-400 text-xs">💡 {q.tip}</p>
                )}
                {q.followUp && q.followUp.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Follow-up:</p>
                    <ul className="space-y-0.5">
                      {q.followUp.map((fu, j) => (
                        <li key={j} className="text-xs text-slate-400">• {fu}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
