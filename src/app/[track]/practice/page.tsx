import Link from 'next/link';
import { getChallenges } from '@/lib/content';
import { Badge } from '@/components/ui/Badge';
import { notFound } from 'next/navigation';

export default async function PracticePage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const challenges = getChallenges(track);
  if (!challenges.length) notFound();

  const topics = Array.from(new Set(challenges.map((c) => c.topic)));

  const grouped = challenges.reduce((acc, c) => {
    if (!acc[c.topic]) acc[c.topic] = [];
    acc[c.topic].push(c);
    return acc;
  }, {} as Record<string, typeof challenges>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Practice Challenges</h1>
        <p className="text-slate-400">{challenges.length} challenges across {topics.length} topics. Write code, see output, reveal solution.</p>
      </div>

      {Object.entries(grouped).map(([topic, topicChallenges]) => (
        <div key={topic} className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{topic}</h2>
          <div className="space-y-2">
            {topicChallenges.map((c) => (
              <Link
                key={c.id}
                href={`/${track}/practice/${c.slug}`}
                className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 rounded-xl transition-all group hover:bg-slate-900/70"
              >
                <div>
                  <span className="text-slate-200 font-medium group-hover:text-white">{c.title}</span>
                  <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{c.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Badge variant={c.difficulty}>{c.difficulty}</Badge>
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
