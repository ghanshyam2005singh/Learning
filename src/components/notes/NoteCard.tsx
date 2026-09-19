'use client';

import type { Note } from '@/lib/firebase/notes';

interface NoteCardProps {
  note: Note;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onDelete: () => void;
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function NoteCard({ note, viewMode, onClick, onDelete }: NoteCardProps) {
  const preview = note.content.slice(0, 120).replace(/\n/g, ' ');

  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-800/30 transition-colors cursor-pointer">
        <button onClick={onClick} className="flex-1 flex items-center gap-3 min-w-0 text-left">
          <span
            className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] ${
              note.type === 'code'
                ? 'bg-sky-500/15 text-sky-400'
                : 'bg-emerald-500/15 text-emerald-400'
            }`}
          >
            {note.type === 'code' ? '<>' : '✎'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{note.title || 'Untitled'}</p>
            <p className="text-xs text-slate-500 truncate">{preview || 'Empty note'}</p>
          </div>
          <span className="text-[10px] text-slate-600 shrink-0">{formatDate(note.updatedAt)}</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="shrink-0 p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
          aria-label={`Delete note: ${note.title}`}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-800/60 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-800/30 transition-colors cursor-pointer overflow-hidden">
      <button onClick={onClick} className="flex-1 p-3 text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`shrink-0 w-5 h-5 rounded flex items-center justify-center text-[9px] mt-0.5 ${
              note.type === 'code'
                ? 'bg-sky-500/15 text-sky-400'
                : 'bg-emerald-500/15 text-emerald-400'
            }`}
          >
            {note.type === 'code' ? '<>' : '✎'}
          </span>
          <p className="flex-1 text-sm font-medium text-slate-200 leading-tight truncate">
            {note.title || 'Untitled'}
          </p>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {preview || 'Empty note'}
        </p>
      </button>
      <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/60">
        <span className="text-[10px] text-slate-600">{formatDate(note.updatedAt)}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
          aria-label={`Delete note: ${note.title}`}
        >
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
