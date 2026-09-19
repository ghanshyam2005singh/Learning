import { lessons } from '@/content/javascript/lessons';
import { challenges } from '@/content/javascript/challenges';
import { projects } from '@/content/javascript/projects';
import { interviewQuestions } from '@/content/javascript/interview';
import { interviewQuestions as databaseInterviewQuestions } from '@/content/databases/interview';
import { interviewQuestions as devopsInterviewQuestions } from '@/content/devops/interview';
import { interviewQuestions as systemDesignInterviewQuestions } from '@/content/system-design/interview';
import { interviewQuestions as typescriptInterviewQuestions } from '@/content/typescript/interview';
import { interviewQuestions as nodejsInterviewQuestions } from '@/content/nodejs/interview';
import { lessons as databaseLessons } from '@/content/databases/lessons';
import { challenges as databaseChallenges } from '@/content/databases/challenges';
import { lessons as devopsLessons } from '@/content/devops/lessons';
import { challenges as devopsChallenges } from '@/content/devops/challenges';
import { lessons as systemDesignLessons } from '@/content/system-design/lessons';
import { challenges as systemDesignChallenges } from '@/content/system-design/challenges';
import { lessons as typescriptLessons } from '@/content/typescript/lessons';
import { challenges as typescriptChallenges } from '@/content/typescript/challenges';
import { projects as typescriptProjects } from '@/content/typescript/projects';
import { lessons as nodejsLessons } from '@/content/nodejs/lessons';
import { challenges as nodejsChallenges } from '@/content/nodejs/challenges';
import { projects as nodejsProjects } from '@/content/nodejs/projects';
import { lessons as nextjsLessons } from '@/content/nextjs/lessons';
import { challenges as nextjsChallenges } from '@/content/nextjs/challenges';
import { interviewQuestions as nextjsInterviewQuestions } from '@/content/nextjs/interview';
import { projects as nextjsProjects } from '@/content/nextjs/projects';
import { reactLessons } from '@/content/react/lessons';
import { reactChallenges } from '@/content/react/challenges';
import { reactInterviewQuestions } from '@/content/react/interview';
import { reactProjects } from '@/content/react/projects';
import { webdevLessons } from '@/content/webdev/lessons';
import { webdevChallenges } from '@/content/webdev/challenges';
import { webdevInterviewQuestions } from '@/content/webdev/interview';
import { webdevProjects } from '@/content/webdev/projects';
import { placementLessons } from '@/content/placement/lessons';
import { placementChallenges } from '@/content/placement/challenges';
import { placementInterviewQuestions } from '@/content/placement/interview';
import { placementProjects } from '@/content/placement/projects';
import { behavioralLessons } from '@/content/behavioral/lessons';
import { behavioralChallenges } from '@/content/behavioral/challenges';
import { behavioralInterviewQuestions } from '@/content/behavioral/interview';
import { behavioralProjects } from '@/content/behavioral/projects';
import { aiEngineeringLessons } from '@/content/ai-engineering/lessons';
import { aiEngineeringChallenges } from '@/content/ai-engineering/challenges';
import { aiEngineeringInterviewQuestions } from '@/content/ai-engineering/interview';
import { aiEngineeringProjects } from '@/content/ai-engineering/projects';
import type { Lesson, Challenge, Project, InterviewQuestion } from '@/types';

export function getLessons(track: string): Lesson[] {
  if (track === 'javascript') return lessons;
  if (track === 'databases') return databaseLessons;
  if (track === 'devops') return devopsLessons;
  if (track === 'system-design') return systemDesignLessons;
  if (track === 'typescript') return typescriptLessons;
  if (track === 'nodejs') return nodejsLessons;
  if (track === 'nextjs') return nextjsLessons;
  if (track === 'react') return reactLessons;
  if (track === 'webdev') return webdevLessons;
  if (track === 'placement') return placementLessons;
  if (track === 'behavioral') return behavioralLessons;
  if (track === 'ai-engineering') return aiEngineeringLessons;
  return [];
}

export function getLessonBySlug(track: string, slug: string): Lesson | undefined {
  return getLessons(track).find((l) => l.slug === slug);
}

export function getLessonsByCategory(track: string): Record<string, Lesson[]> {
  const trackLessons = getLessons(track);
  return trackLessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.category]) acc[lesson.category] = [];
      acc[lesson.category].push(lesson);
      return acc;
    },
    {} as Record<string, Lesson[]>
  );
}

export function getChallenges(track: string): Challenge[] {
  if (track === 'javascript') return challenges;
  if (track === 'databases') return databaseChallenges;
  if (track === 'devops') return devopsChallenges;
  if (track === 'system-design') return systemDesignChallenges;
  if (track === 'typescript') return typescriptChallenges;
  if (track === 'nodejs') return nodejsChallenges;
  if (track === 'nextjs') return nextjsChallenges;
  if (track === 'react') return reactChallenges;
  if (track === 'webdev') return webdevChallenges;
  if (track === 'placement') return placementChallenges;
  if (track === 'behavioral') return behavioralChallenges;
  if (track === 'ai-engineering') return aiEngineeringChallenges;
  return [];
}

export function getChallengeBySlug(track: string, slug: string): Challenge | undefined {
  return getChallenges(track).find((c) => c.slug === slug);
}

export function getProjects(track: string): Project[] {
  if (track === 'javascript') return projects;
  if (track === 'typescript') return typescriptProjects;
  if (track === 'nodejs') return nodejsProjects;
  if (track === 'nextjs') return nextjsProjects;
  if (track === 'react') return reactProjects;
  if (track === 'webdev') return webdevProjects;
  if (track === 'placement') return placementProjects;
  if (track === 'behavioral') return behavioralProjects;
  if (track === 'ai-engineering') return aiEngineeringProjects;
  return [];
}

export function getProjectBySlug(track: string, slug: string): Project | undefined {
  return getProjects(track).find((p) => p.slug === slug);
}

export function getInterviewQuestions(track: string): InterviewQuestion[] {
  if (track === 'javascript') return interviewQuestions;
  if (track === 'databases') return databaseInterviewQuestions;
  if (track === 'devops') return devopsInterviewQuestions;
  if (track === 'system-design') return systemDesignInterviewQuestions;
  if (track === 'typescript') return typescriptInterviewQuestions;
  if (track === 'nodejs') return nodejsInterviewQuestions;
  if (track === 'nextjs') return nextjsInterviewQuestions;
  if (track === 'react') return reactInterviewQuestions;
  if (track === 'webdev') return webdevInterviewQuestions;
  if (track === 'placement') return placementInterviewQuestions;
  if (track === 'behavioral') return behavioralInterviewQuestions;
  if (track === 'ai-engineering') return aiEngineeringInterviewQuestions;
  return [];
}
