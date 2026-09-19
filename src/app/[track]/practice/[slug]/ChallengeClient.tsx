'use client';

import Link from 'next/link';
import type { Challenge } from '@/types';
import type { Exercise as ExerciseType } from '@/types';
import { Exercise } from '@/components/lesson/Exercise';
import { Badge } from '@/components/ui/Badge';

export function ChallengeClient({ challenge, track }: { challenge: Challenge; track: string }) {
  const exercise: ExerciseType = {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    starterCode: challenge.starterCode,
    solution: challenge.solution,
    hints: challenge.hints,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={`/${track}/practice`} className="text-sm text-slate-500 hover:text-slate-300 mb-4 inline-block transition-colors">
          ← All Challenges
        </Link>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={challenge.difficulty}>{challenge.difficulty}</Badge>
          <Badge variant="default">{challenge.topic}</Badge>
          {challenge.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500">{t}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{challenge.title}</h1>
        <p className="text-slate-400 leading-relaxed">{challenge.description}</p>
      </div>

      <div className="mb-6">
        <Exercise exercise={exercise} />
      </div>

      {challenge.explanation && (
        <div className="p-5 bg-slate-900/50 border border-slate-700/60 rounded-xl">
          <h3 className="font-semibold text-slate-200 mb-2 text-sm">Explanation</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{challenge.explanation}</p>
        </div>
      )}
    </div>
  );
}
