export type DSADifficulty = 'easy' | 'medium' | 'hard';

export interface DSAComplexity {
  time: string;
  space: string;
  best?: string;
  average?: string;
  worst?: string;
  note?: string;
}

export interface DSAExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface DSACodeExample {
  title: string;
  code: string;
  language?: 'cpp' | 'javascript' | 'pseudo';
  explanation?: string;
  output?: string;
  dryRun?: string;
}

export interface DSAApproach {
  name: string;
  intuition: string;
  steps: string[];
  complexity: { time: string; space: string };
  code?: string;
  starterCode?: string;
  solutionWithComments?: string;
  expectedOutput?: string;
  dryRun?: string;
}

export interface DSAVideoRef {
  title: string;
  channel: string;
  url: string;
}

export interface DSAInterviewQ {
  question: string;
  answer: string;
  difficulty: DSADifficulty;
}

export interface DSATopic {
  id: string;
  slug: string;
  title: string;
  type: 'lesson' | 'problem';
  difficulty: DSADifficulty;

  // ── LESSON FIELDS ──────────────────────────────────────────────────
  introduction?: string;
  theory?: string;
  complexity?: DSAComplexity;
  codeExamples?: DSACodeExample[];
  commonMistakes?: string[];
  revisionNotes?: string[];

  // ── PROBLEM FIELDS ─────────────────────────────────────────────────
  problemStatement?: string;
  constraints?: string[];
  examples?: DSAExample[];
  pattern?: string;
  conceptsRequired?: string[];
  approaches?: DSAApproach[];
  hints?: string[];
  solution?: string;
  solutionExplanation?: string;
  leetcodeUrl?: string;

  // ── SHARED ─────────────────────────────────────────────────────────
  videoReferences?: DSAVideoRef[];
  interviewQuestions?: DSAInterviewQ[];
  keyTakeaways?: string[];
  relatedTopics?: string[];
}

export interface DSASubsection {
  id: string;
  title: string;
  topics: DSATopic[];
}

export interface DSASection {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  subsections?: DSASubsection[];
  topics?: DSATopic[];
}
