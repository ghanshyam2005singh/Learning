import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code';
  language?: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteInput {
  title: string;
  content: string;
  type: 'text' | 'code';
  language?: string;
}

const COLLECTION = 'learning_notes';

function notesRef() {
  return collection(db, COLLECTION);
}

export async function fetchNotes(): Promise<Note[]> {
  const q = query(notesRef(), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? '',
      content: data.content ?? '',
      type: data.type ?? 'text',
      language: data.language,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : Date.now(),
    };
  });
}

export async function createNote(input: NoteInput): Promise<Note> {
  const now = serverTimestamp();
  const data: Record<string, unknown> = {
    title: input.title,
    content: input.content,
    type: input.type,
    createdAt: now,
    updatedAt: now,
  };
  if (input.language !== undefined) {
    data.language = input.language;
  }
  const ref = await addDoc(notesRef(), data);
  return {
    id: ref.id,
    ...input,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export async function updateNote(id: string, input: Partial<NoteInput>): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (input.title !== undefined) data.title = input.title;
  if (input.content !== undefined) data.content = input.content;
  if (input.type !== undefined) data.type = input.type;
  if (input.language !== undefined) data.language = input.language;
  await updateDoc(ref, data);
}

export async function deleteNote(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
