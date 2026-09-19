'use client';

import { useState, lazy, Suspense } from 'react';
import { FloatingActionButton } from './FloatingActionButton';
import { ServiceWorkerRegistrar } from './ServiceWorkerRegistrar';

const AIAssistant = lazy(() =>
  import('@/components/ai-assistant/AIAssistant').then((m) => ({ default: m.AIAssistant }))
);
const Notes = lazy(() =>
  import('@/components/notes/Notes').then((m) => ({ default: m.Notes }))
);

export function GlobalProviders() {
  const [aiOpen, setAiOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <>
      <ServiceWorkerRegistrar />
      <FloatingActionButton
        onOpenAI={() => setAiOpen(true)}
        onOpenNotes={() => setNotesOpen(true)}
      />
      <Suspense fallback={null}>
        <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      </Suspense>
      <Suspense fallback={null}>
        <Notes isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
      </Suspense>
    </>
  );
}
