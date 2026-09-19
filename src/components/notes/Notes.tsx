'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Note, NoteInput } from '@/lib/firebase/notes';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';

interface NotesProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'grid' | 'list';
type Size = 'normal' | 'minimized' | 'maximized';

export function Notes({ isOpen, onClose }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('grid');
  const [size, setSize] = useState<Size>('normal');
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadNotes = useCallback(async () => {
    if (!firebaseReady) return;
    setLoading(true);
    setError(null);
    try {
      const { fetchNotes } = await import('@/lib/firebase/notes');
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes. Check Firebase configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [firebaseReady]);

  useEffect(() => {
    const hasConfig = Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
    setFirebaseReady(hasConfig);
  }, []);

  useEffect(() => {
    if (isOpen && firebaseReady) {
      loadNotes();
    }
  }, [isOpen, loadNotes, firebaseReady]);

  async function handleCreate(input: NoteInput) {
    try {
      const { createNote } = await import('@/lib/firebase/notes');
      const note = await createNote(input);
      setNotes((prev) => [note, ...prev]);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function handleUpdate(id: string, input: Partial<NoteInput>) {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...input, updatedAt: Date.now() } : n))
    );
    autoSaveRef.current = setTimeout(async () => {
      try {
        const { updateNote } = await import('@/lib/firebase/notes');
        await updateNote(id, input);
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 800);
  }

  async function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingNote?.id === id) setEditingNote(null);
    try {
      const { deleteNote } = await import('@/lib/firebase/notes');
      await deleteNote(id);
    } catch (err) {
      console.error(err);
      await loadNotes();
    }
  }

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  if (size === 'minimized') {
    return (
      // On mobile: bottom-right above FAB. On desktop: offset left of AI panel.
      <div className="fixed bottom-24 right-4 sm:right-24 z-50">
        <button
          onClick={() => setSize('normal')}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium rounded-full shadow-xl shadow-emerald-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label="Restore Notes"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          Notes
          {notes.length > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold">
              {notes.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  const isMax = size === 'maximized';

  return (
    <div
      className={`fixed z-50 flex flex-col bg-[#07070b] border border-slate-700/60 shadow-2xl shadow-black/60 transition-all duration-200 ${
        isMax
          ? 'inset-3 sm:inset-6 rounded-2xl'
          : 'bottom-24 right-4 sm:right-24 w-[calc(100vw-2rem)] sm:w-[min(480px,calc(100vw-3rem))] h-[min(620px,calc(100vh-7rem))] rounded-2xl'
      }`}
      role="dialog"
      aria-label="Notes"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-emerald-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Notes</p>
            <p className="text-[10px] text-slate-500">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* View toggle */}
          <div className="flex items-center mr-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
              aria-label="Grid view" title="Grid view"
            >
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
              aria-label="List view" title="List view"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setSize('minimized')}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Minimize" title="Minimize"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={() => setSize(isMax ? 'normal' : 'maximized')}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label={isMax ? 'Restore' : 'Maximize'} title={isMax ? 'Restore' : 'Maximize'}
          >
            {isMax ? (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="4,14 10,14 10,20" /><polyline points="20,10 14,10 14,4" />
                <line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="15,3 21,3 21,9" /><polyline points="9,21 3,21 3,15" />
                <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label="Close Notes" title="Close"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor or list */}
      {(editingNote || isCreating) ? (
        <NoteEditor
          note={editingNote}
          onSave={async (input) => {
            if (editingNote) {
              await handleUpdate(editingNote.id, input);
              setEditingNote((prev) => prev ? { ...prev, ...input } : null);
            } else {
              await handleCreate(input);
            }
          }}
          onClose={() => { setEditingNote(null); setIsCreating(false); }}
          onDelete={editingNote ? () => handleDelete(editingNote.id) : undefined}
        />
      ) : (
        <>
          {/* Search + New */}
          <div className="px-4 py-3 border-b border-slate-800 shrink-0 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-slate-800/50 border border-slate-700/60 rounded-lg px-3 py-1.5 focus-within:border-slate-600">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-slate-500 shrink-0">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
                aria-label="Search notes"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-500 hover:text-slate-300" aria-label="Clear search">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Create new note"
            >
              + New
            </button>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {!firebaseReady && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                  <span className="text-amber-400 text-lg">⚠</span>
                </div>
                <p className="text-sm font-medium text-slate-300 mb-1">Firebase not configured</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Add Firebase credentials to <code className="text-violet-400">.env.local</code> to enable note syncing.
                </p>
              </div>
            )}
            {firebaseReady && loading && (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              </div>
            )}
            {firebaseReady && error && (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <p className="text-sm text-red-400">{error}</p>
                <button onClick={loadNotes} className="text-xs text-emerald-400 hover:underline">Retry</button>
              </div>
            )}
            {firebaseReady && !loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="text-emerald-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-300 mb-1">
                  {search ? 'No notes found' : 'No notes yet'}
                </p>
                <p className="text-xs text-slate-500">
                  {search ? 'Try a different search term' : 'Create your first note while learning'}
                </p>
                {!search && (
                  <button onClick={() => setIsCreating(true)} className="mt-3 text-xs text-emerald-400 hover:underline">
                    Create note
                  </button>
                )}
              </div>
            )}
            {firebaseReady && !loading && !error && filtered.length > 0 && (
              <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-2'}>
                {filtered.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    viewMode={view}
                    onClick={() => setEditingNote(note)}
                    onDelete={() => handleDelete(note.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
