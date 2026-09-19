import Link from 'next/link';
import { getLessons } from '@/lib/content';
import { Badge } from '@/components/ui/Badge';
import { formatTime } from '@/lib/utils';
import { notFound } from 'next/navigation';

export default async function LessonsPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const lessons = getLessons(track);
  if (!lessons.length) notFound();

  const grouped = lessons.reduce((acc, l) => {
    if (!acc[l.category]) acc[l.category] = [];
    acc[l.category].push(l);
    return acc;
  }, {} as Record<string, typeof lessons>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Lessons</h1>
        <p className="text-slate-400">{lessons.length} lessons from beginner to advanced.</p>
      </div>

      {Object.entries(grouped).map(([category, catLessons]) => (
        <div key={category} className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
            {category}
          </h2>
          <div className="space-y-2">
            {catLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/${track}/lessons/${lesson.slug}`}
                className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 rounded-xl transition-all group hover:bg-slate-900/70"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-mono text-slate-500 flex-shrink-0">
                    {lesson.order}
                  </span>
                  <div>
                    <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                      {lesson.title}
                    </span>
                    <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">{lesson.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Badge variant={lesson.difficulty}>{lesson.difficulty}</Badge>
                  <span className="text-xs text-slate-600 hidden sm:block">{formatTime(lesson.estimatedTime)}</span>
                  <span className="text-slate-600">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
