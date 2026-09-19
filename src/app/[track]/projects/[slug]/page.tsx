import { getProjectBySlug, getProjects } from '@/lib/content';
import { ProjectPageClient } from './ProjectPageClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const tracks = ['javascript', 'typescript', 'nodejs', 'nextjs', 'react', 'placement'];
  return tracks.flatMap((track) =>
    getProjects(track).map((p) => ({ track, slug: p.slug }))
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ track: string; slug: string }> }) {
  const { track, slug } = await params;
  const project = getProjectBySlug(track, slug);
  if (!project) notFound();

  return <ProjectPageClient project={project} track={track} />;
}
