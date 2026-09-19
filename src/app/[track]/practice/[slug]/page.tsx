import { getChallengeBySlug, getChallenges } from '@/lib/content';
import { ChallengeClient } from './ChallengeClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const tracks = ['javascript', 'typescript', 'databases', 'devops', 'system-design', 'nodejs', 'nextjs', 'react', 'placement'];
  return tracks.flatMap((track) =>
    getChallenges(track).map((c) => ({ track, slug: c.slug }))
  );
}

export default async function ChallengePage({ params }: { params: Promise<{ track: string; slug: string }> }) {
  const { track, slug } = await params;
  const challenge = getChallengeBySlug(track, slug);
  if (!challenge) notFound();

  return <ChallengeClient challenge={challenge} track={track} />;
}
