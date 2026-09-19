import { getLessonBySlug, getLessons } from '@/lib/content';
import { LessonClient } from './LessonClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const tracks = ['javascript', 'typescript', 'databases', 'devops', 'system-design', 'nodejs', 'nextjs', 'react', 'webdev', 'placement'];
  return tracks.flatMap((track) =>
    getLessons(track).map((l) => ({ track, slug: l.slug }))
  );
}

export default async function LessonPage({ params }: { params: Promise<{ track: string; slug: string }> }) {
  const { track, slug } = await params;
  const lesson = getLessonBySlug(track, slug);
  if (!lesson) notFound();

  return <LessonClient lesson={lesson} track={track} />;
}
