'use client';

import { useEffect, useState } from 'react';
import type { Lesson } from '@/types';
import { LessonContent } from '@/components/lesson/LessonContent';
import { markLessonComplete, markLessonIncomplete, isLessonComplete } from '@/lib/progress';

export function LessonClient({ lesson, track }: { lesson: Lesson; track: string }) {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setComplete(isLessonComplete(track, lesson.id));
  }, [track, lesson.id]);

  function handleToggle() {
    if (complete) {
      markLessonIncomplete(track, lesson.id);
    } else {
      markLessonComplete(track, lesson.id);
    }
    setComplete((c) => !c);
    window.dispatchEvent(new Event('lessonProgress'));
  }

  return (
    <LessonContent
      lesson={lesson}
      track={track}
      isComplete={complete}
      onToggleComplete={handleToggle}
    />
  );
}
