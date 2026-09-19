import { dsaSections } from '@/content/dsa';
import type { DSASection, DSATopic } from '@/types/dsa';

export function getDSASections(): DSASection[] {
  return dsaSections;
}

export function getDSASectionBySlug(slug: string): DSASection | undefined {
  return dsaSections.find((s) => s.slug === slug);
}

export function getDSATopicBySlug(slug: string): { topic: DSATopic; section: DSASection } | undefined {
  for (const section of dsaSections) {
    if (section.topics) {
      const topic = section.topics.find((t) => t.slug === slug);
      if (topic) return { topic, section };
    }
    if (section.subsections) {
      for (const sub of section.subsections) {
        const topic = sub.topics.find((t) => t.slug === slug);
        if (topic) return { topic, section };
      }
    }
  }
  return undefined;
}

export function getAllDSATopics(): DSATopic[] {
  const topics: DSATopic[] = [];
  for (const section of dsaSections) {
    if (section.topics) topics.push(...section.topics);
    if (section.subsections) {
      for (const sub of section.subsections) topics.push(...sub.topics);
    }
  }
  return topics;
}

export function getDSAStats() {
  const sections = getDSASections();
  let totalTopics = 0;
  let lessons = 0;
  let problems = 0;
  for (const section of sections) {
    const topics = section.topics ?? section.subsections?.flatMap((s) => s.topics) ?? [];
    for (const t of topics) {
      totalTopics++;
      if (t.type === 'lesson') lessons++;
      else problems++;
    }
  }
  return { sections: sections.length, totalTopics, lessons, problems };
}
