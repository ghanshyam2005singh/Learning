import { getLessons } from '@/lib/content';
import { TrackLayout } from '@/components/layout/TrackLayout';
import { notFound } from 'next/navigation';

const VALID_TRACKS = ['javascript', 'typescript', 'databases', 'devops', 'system-design', 'nodejs', 'nextjs', 'react', 'webdev', 'placement', 'behavioral', 'ai-engineering'];

export default async function TrackRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  if (!VALID_TRACKS.includes(track)) notFound();

  const lessons = getLessons(track);

  return (
    <TrackLayout track={track} lessons={lessons}>
      {children}
    </TrackLayout>
  );
}
