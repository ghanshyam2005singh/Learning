'use client';

const STORAGE_PREFIX = 'devlearn';

function getKey(track: string, suffix: string): string {
  return `${STORAGE_PREFIX}:${track}:${suffix}`;
}

function safeGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function markLessonComplete(track: string, lessonId: string): void {
  const key = getKey(track, 'completed');
  const existing = safeGet(key);
  const completed: string[] = existing ? JSON.parse(existing) : [];
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    safeSet(key, JSON.stringify(completed));
  }
}

export function markLessonIncomplete(track: string, lessonId: string): void {
  const key = getKey(track, 'completed');
  const existing = safeGet(key);
  const completed: string[] = existing ? JSON.parse(existing) : [];
  const updated = completed.filter((id) => id !== lessonId);
  safeSet(key, JSON.stringify(updated));
}

export function isLessonComplete(track: string, lessonId: string): boolean {
  const key = getKey(track, 'completed');
  const existing = safeGet(key);
  if (!existing) return false;
  const completed: string[] = JSON.parse(existing);
  return completed.includes(lessonId);
}

export function getCompletedLessons(track: string): string[] {
  const key = getKey(track, 'completed');
  const existing = safeGet(key);
  return existing ? JSON.parse(existing) : [];
}

export function getTrackProgress(track: string, totalLessons: number): number {
  if (totalLessons === 0) return 0;
  const completed = getCompletedLessons(track);
  return Math.round((completed.length / totalLessons) * 100);
}

export function markChallengeComplete(track: string, challengeId: string): void {
  const key = getKey(track, 'challenges');
  const existing = safeGet(key);
  const completed: string[] = existing ? JSON.parse(existing) : [];
  if (!completed.includes(challengeId)) {
    completed.push(challengeId);
    safeSet(key, JSON.stringify(completed));
  }
}

export function isChallengeComplete(track: string, challengeId: string): boolean {
  const key = getKey(track, 'challenges');
  const existing = safeGet(key);
  if (!existing) return false;
  const completed: string[] = JSON.parse(existing);
  return completed.includes(challengeId);
}

export function addBookmark(track: string, lessonId: string): void {
  const key = getKey(track, 'bookmarks');
  const existing = safeGet(key);
  const bookmarks: string[] = existing ? JSON.parse(existing) : [];
  if (!bookmarks.includes(lessonId)) {
    bookmarks.push(lessonId);
    safeSet(key, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(track: string, lessonId: string): void {
  const key = getKey(track, 'bookmarks');
  const existing = safeGet(key);
  const bookmarks: string[] = existing ? JSON.parse(existing) : [];
  const updated = bookmarks.filter((id) => id !== lessonId);
  safeSet(key, JSON.stringify(updated));
}

export function isBookmarked(track: string, lessonId: string): boolean {
  const key = getKey(track, 'bookmarks');
  const existing = safeGet(key);
  if (!existing) return false;
  const bookmarks: string[] = JSON.parse(existing);
  return bookmarks.includes(lessonId);
}

export function getBookmarks(track: string): string[] {
  const key = getKey(track, 'bookmarks');
  const existing = safeGet(key);
  return existing ? JSON.parse(existing) : [];
}

export function saveNote(track: string, lessonId: string, note: string): void {
  const key = getKey(track, `note:${lessonId}`);
  safeSet(key, note);
}

export function getNote(track: string, lessonId: string): string {
  const key = getKey(track, `note:${lessonId}`);
  return safeGet(key) || '';
}
