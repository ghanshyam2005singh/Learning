'use client';

import { useState, useEffect, useRef } from 'react';
import type { Note, NoteInput } from '@/lib/firebase/notes';

interface NoteEditorProps {
  note: Note | null;
  onSave: (input: NoteInput) => Promise<void>;
  onClose: () => void;
  onDelete?: () => void;
}

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css', 'sql', 'bash', 'json'];

export function NoteEditor({ note, onSave, onClose, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [type, setType] = useState<'text' | 'code'>(note?.type ?? 'text');
  const [language, setLanguage] = useState(note?.language ?? 'javascript');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!note) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaved(false);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await onSave({ title, content, type, language: type === 'code' ? language : undefined });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        // silent auto-save fail
      }
    }, 1000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [title, content, type, language, note]);

  async function handleManualSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaving(true);
    setError(null);
    try {
      await onSave({ title, content, type, language: type === 'code' ? language : undefined });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (!note) onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Back to notes list"
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          {saved && <span className="text-[10px] text-emerald-400">✓ Saved</span>}
          {saving && <span className="text-[10px] text-slate-500">Saving…</span>}
          {note && onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded"
              aria-label="Delete note"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {note ? 'Save' : 'Create'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Type + Language selector */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/60 shrink-0">
        <button
          onClick={() => setType('text')}
          className={`text-xs px-2.5 py-1 rounded-md transition-colors ${type === 'text' ? 'bg-emerald-500/15 text-emerald-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Text
        </button>
        <button
          onClick={() => setType('code')}
          className={`text-xs px-2.5 py-1 rounded-md transition-colors ${type === 'code' ? 'bg-sky-500/15 text-sky-400 font-medium' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Code
        </button>
        {type === 'code' && (
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-auto text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-md px-2 py-1 outline-none focus:border-sky-500/50"
            aria-label="Select programming language"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        )}
      </div>

      {/* Title */}
      <div className="px-4 pt-3 pb-1 shrink-0">
        <input
          ref={titleRef}
          type="text"
          placeholder="Note title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-base font-semibold text-slate-100 placeholder-slate-600 outline-none"
          aria-label="Note title"
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 min-h-0 overflow-hidden">
        {type === 'code' ? (
          <div className="h-full rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700/60 bg-slate-800/50">
              <span className="text-[10px] font-mono text-slate-500 uppercase">{language}</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`// Write your ${language} code here…`}
              className="w-full h-[calc(100%-32px)] bg-transparent px-4 py-3 text-sm font-mono text-slate-200 placeholder-slate-600 outline-none resize-none leading-relaxed"
              spellCheck={false}
              aria-label="Code content"
            />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note…"
            className="w-full h-full bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none resize-none leading-relaxed"
            aria-label="Note content"
          />
        )}
      </div>
    </div>
  );
}
