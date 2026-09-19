import type { Project } from '@/types';

export const placementProjects: Project[] = [
  {
    id: 'placement-proj-1',
    slug: 'aptitude-quiz-app',
    title: 'Aptitude Quiz App',
    description: 'Build a timed aptitude quiz app with score tracking, explanations, and performance analytics across all placement topics.',
    difficulty: 'intermediate',
    estimatedTime: '8-10 hours',
    techStack: ['React', 'TypeScript', 'localStorage', 'CSS'],
    features: [
      'Question bank with categories (aptitude, reasoning, CS fundamentals)',
      'Timed mode — per question timer and full test countdown',
      'Score breakdown by category with percentage display',
      'Review mode showing correct answer and full explanation',
      'Performance history across attempts stored in localStorage',
    ],
    folderStructure: `aptitude-quiz/
├── src/
│   ├── components/
│   │   ├── QuizCard.tsx
│   │   ├── Timer.tsx
│   │   ├── ScoreBoard.tsx
│   │   └── ReviewMode.tsx
│   ├── data/
│   │   ├── aptitude.ts
│   │   ├── reasoning.ts
│   │   └── cs.ts
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   └── useQuiz.ts
│   ├── utils/
│   │   └── storage.ts
│   └── App.tsx
├── package.json
└── tsconfig.json`,
    steps: [
      {
        title: 'Set up question data structures',
        description: 'Define TypeScript interfaces for questions, options, categories. Create question bank files for aptitude, reasoning, and CS.',
        code: `interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'aptitude' | 'reasoning' | 'cs';
  difficulty: 'easy' | 'medium' | 'hard';
}`,
      },
      {
        title: 'Build the Timer hook',
        description: 'Create a custom useTimer hook that counts down and calls a callback on expiry.',
        code: `function useTimer(seconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onExpire(); return; }
    const id = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);
  return remaining;
}`,
      },
      {
        title: 'Build the Quiz state machine',
        description: 'Create useQuiz hook managing states: idle → in-progress → review → complete.',
        hint: 'Use useReducer for complex state transitions between quiz phases.',
      },
      {
        title: 'Build ScoreBoard and analytics',
        description: 'Display scores per category, overall percentage, time taken, and comparison to previous attempts.',
        hint: 'Persist results to localStorage. Parse past results to show trend (improving/declining).',
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you optimize this app to handle a question bank of 10,000+ questions?',
        answer: 'Lazy load questions by category only when needed. Use virtualization for long lists. Index questions by category and difficulty in a Map for O(1) lookup. Consider pagination or random sampling for quiz sessions.',
        difficulty: 'intermediate',
      },
      {
        question: 'How would you make this app work offline?',
        answer: 'Use a Service Worker to cache the app shell and question data. Store quiz progress in localStorage or IndexedDB. Sync results when back online via background sync API.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['React', 'TypeScript', 'Quiz', 'Placement Prep'],
  },
  {
    id: 'placement-proj-2',
    slug: 'resume-builder',
    title: 'ATS-Friendly Resume Builder',
    description: 'Create a resume builder that generates clean, ATS-optimized resumes with live preview and PDF export for tech roles.',
    difficulty: 'intermediate',
    estimatedTime: '10-12 hours',
    techStack: ['React', 'TypeScript', 'CSS Grid', 'html2pdf.js'],
    features: [
      'Multi-section form: header, education, experience, projects, skills',
      'Real-time resume preview as user types',
      'Multiple professional templates (single-column, two-column)',
      'ATS keyword checker — highlights missing role-specific keywords',
      'Export to PDF with one click',
    ],
    folderStructure: `resume-builder/
├── src/
│   ├── components/
│   │   ├── ResumeForm/
│   │   │   ├── HeaderSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   └── SkillsSection.tsx
│   │   ├── ResumePreview/
│   │   │   ├── Template1.tsx
│   │   │   └── Template2.tsx
│   │   └── ATSChecker.tsx
│   ├── hooks/
│   │   └── useResume.ts
│   ├── utils/
│   │   ├── exportPDF.ts
│   │   └── atsKeywords.ts
│   └── App.tsx`,
    steps: [
      {
        title: 'Define Resume data model',
        description: 'Create TypeScript interfaces for all resume sections.',
        code: `interface ResumeData {
  header: { name: string; email: string; phone: string; github: string; };
  education: { college: string; degree: string; year: string; cgpa: string; }[];
  experience: { company: string; role: string; duration: string; bullets: string[]; }[];
  projects: { name: string; stack: string; description: string; link: string; }[];
  skills: { category: string; items: string[]; }[];
}`,
      },
      {
        title: 'Build the live preview component',
        description: 'Map resume state to a styled HTML template that updates on every keystroke.',
        hint: 'Use React context to pass resume state deep without prop drilling.',
      },
      {
        title: 'Implement ATS keyword checker',
        description: 'Maintain keyword lists for common roles. Highlight missing keywords in yellow.',
        hint: 'Store keywords as a Record<role, string[]>. Check resume text against current role keywords.',
      },
      {
        title: 'Add PDF export',
        description: 'Use html2pdf.js or browser print API to export the preview div as a PDF.',
        code: `import html2pdf from 'html2pdf.js';
function exportPDF(element: HTMLElement) {
  html2pdf().from(element).save('resume.pdf');
}`,
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you prevent users from including elements that break ATS parsing?',
        answer: 'Enforce single-column layout in templates. Disallow table-based layouts and images in the resume body. Validate that all text is in real DOM text nodes (not inside SVGs or canvas). Provide a "ATS compatibility score" warning if problematic elements are detected.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['React', 'TypeScript', 'Resume', 'PDF', 'ATS'],
  },
];
