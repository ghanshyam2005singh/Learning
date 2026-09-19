import { notFound } from 'next/navigation';
import { getDSATopicBySlug, getAllDSATopics } from '@/lib/dsa';
import TopicClient from './TopicClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const topics = getAllDSATopics();
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = getDSATopicBySlug(slug);
  if (!result) return { title: 'Topic Not Found' };
  return {
    title: `${result.topic.title} | DSA Mastery`,
    description: result.topic.introduction ?? result.topic.problemStatement ?? '',
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const result = getDSATopicBySlug(slug);
  if (!result) notFound();

  return <TopicClient topic={result.topic} section={result.section} />;
}
