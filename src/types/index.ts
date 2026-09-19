export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CodeExample {
  title: string;
  code: string;
  output?: string;
  explanation?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  expectedOutput?: string;
  testCases?: { input: string; expected: string }[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  difficulty: Difficulty;
  estimatedTime: number; // minutes
  content: string; // markdown-like rich text
  codeExamples: CodeExample[];
  commonMistakes: string[];
  interviewQuestions: InterviewQuestion[];
  exercises: Exercise[];
  keyTakeaways: string[];
  nextLesson?: string;
  prevLesson?: string;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  starterCode: string;
  solution: string;
  hints: string[];
  explanation: string;
  tags: string[];
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty: Difficulty;
  followUp?: string[];
  tip?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  techStack: string[];
  features: string[];
  folderStructure: string;
  steps: ProjectStep[];
  interviewQuestions: InterviewQuestion[];
  tags: string[];
}

export interface ProjectStep {
  title: string;
  description: string;
  code?: string;
  hint?: string;
}

export interface Track {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  color: string;
  lessonCount?: number;
}
