import type { Lesson } from '@/types';

export const guidedProjectsLesson: Lesson = {
  id: 'guided-projects',
  slug: 'guided-projects',
  title: 'Guided Projects',
  description:
    'Build real AI applications from scratch — an AI chatbot, a PDF Q&A system, a resume analyzer, an interview coach, and a multi-agent workflow. Each project teaches complete architecture and deployment.',
  category: 'Projects',
  order: 21,
  difficulty: 'intermediate',
  estimatedTime: 120,
  content: `The best way to solidify your AI engineering skills is to build complete applications. This module walks you through six progressively complex projects — each one teaching different architectural patterns and real-world considerations.

---

## Project 1: AI Chatbot with Memory

**What you build**: A conversational AI that remembers conversation history and maintains context across a session.

**What you learn**: Multi-turn conversation, streaming, context window management.

**Architecture**:
\`\`\`
User → Frontend chat UI → Next.js API route → Anthropic API
                    ↑                   ↓
                Message history ← Save each exchange
\`\`\`

**Key implementation steps**:
1. Build chat UI with message list and input
2. Set up streaming SSE response from API route
3. Store conversation history in memory (or Redis for production)
4. Include history on every API call, truncate to fit context window
5. Add clear conversation button

**Cost estimate**: ~$0.01 per conversation for typical usage

---

## Project 2: PDF Chat (Document Q&A)

**What you build**: Upload a PDF, ask questions about it, get accurate answers with citations.

**What you learn**: Document processing, chunking, embeddings, RAG, vector storage.

**Architecture**:
\`\`\`
PDF Upload → Extract text → Chunk → Embed → Chroma
                                              ↕
User Query → Embed query → Search chunks → Top-3 chunks
                                              ↓
                            LLM generates answer from chunks
\`\`\`

**Key implementation steps**:
1. PDF text extraction (pdf-parse or LangChain PDF loader)
2. Chunk text into 400-token segments with 50-token overlap
3. Embed all chunks with text-embedding-3-small
4. Store in Chroma (local) or Pinecone (cloud)
5. On each query: embed query, retrieve top-3 chunks, generate answer
6. Display citations (which page/section the answer came from)

**Technical challenge**: PDFs with tables or images — text extraction loses formatting. Consider adding a disclaimer.

---

## Project 3: Resume Analyzer

**What you build**: Upload a resume and job description, get detailed analysis of fit, missing skills, and suggestions.

**What you learn**: Structured output, prompt engineering for complex tasks, multi-document context.

**Architecture**:
\`\`\`
Resume PDF → Extract text →
                            → Combined prompt → LLM → Structured analysis JSON
Job Description text →
\`\`\`

**Prompt design**:
\`\`\`
System: "You are an expert recruiter. Analyze resume-JD fit.
Return JSON with this structure:
{
  'fitScore': number (0-100),
  'matchingSkills': string[],
  'missingSkills': string[],
  'suggestions': string[],
  'summary': string
}"

User: "Resume: [resume text]\n\nJob Description: [JD text]"
\`\`\`

**Key implementation steps**:
1. Accept PDF upload for resume, text input for JD
2. Extract resume text
3. Build combined prompt with both documents
4. Parse JSON response with Zod validation
5. Display structured results with visual fit score

---

## Project 4: Interview Coach

**What you build**: An AI that conducts mock interviews, provides feedback, and tracks your improvement.

**What you learn**: Multi-turn conversation with state, evaluation prompts, session management.

**Architecture**:
\`\`\`
User selects role → AI generates questions → User answers → AI evaluates → Score + Feedback
                                                    ↓
                                        Save to interview session DB
                                                    ↓
                                        Progress tracking across sessions
\`\`\`

**Interview session state**:
\`\`\`json
{
  "sessionId": "abc123",
  "role": "Frontend Engineer",
  "questionsAsked": [...],
  "answers": [...],
  "scores": [...],
  "currentQuestionIndex": 3
}
\`\`\`

**Two-prompt pattern**:
- Question generation prompt: generates interview questions for the role
- Evaluation prompt: evaluates answer quality and gives specific feedback

---

## Project 5: RAG Application (Codebase Assistant)

**What you build**: An AI assistant that can answer questions about a codebase by indexing the code and using semantic search.

**What you learn**: Code indexing, technical RAG, handling structured data.

**Architecture**:
\`\`\`
GitHub repo/local folder → Scan files → Read code files → Chunk by function/class
                                                              ↓
                                                        Embed with code-aware model
                                                              ↓
                                                          Vector DB
                                                              ↓
User asks "How does auth work?" → Retrieve relevant code → LLM explains
\`\`\`

**Code-specific considerations**:
- Chunk by function or class, not arbitrary character count
- Include file path and function name in metadata
- Use voyage-code-2 (specialized for code embeddings) or text-embedding-3-large
- Filter by file type in retrieval (TypeScript files only, or Python only)

---

## Project 6: Multi-Agent Research Workflow

**What you build**: An agent system where a coordinator breaks a research task into subtasks, delegates to specialist agents, and synthesizes a complete report.

**What you learn**: Multi-agent orchestration, agent design patterns, parallel execution.

**Architecture**:
\`\`\`
User: "Research AI coding tools and write a comparison report"
       │
Coordinator Agent: Plans subtasks
       │
       ├── Research Agent 1: GitHub Copilot (web search + summarize)
       ├── Research Agent 2: Cursor (web search + summarize)
       └── Research Agent 3: Claude Code (web search + summarize)
       │
       ▼ (all run in parallel)
       │
Synthesis Agent: Combines findings + writes comparison report
       │
       ▼
Final markdown report with comparison table
\`\`\`

**Key implementation steps**:
1. Build web search tool (Tavily API or SerpAPI)
2. Build single research agent (search + summarize for one topic)
3. Build coordinator that plans and delegates
4. Run research agents in parallel (Promise.all)
5. Build synthesis agent that combines findings
6. Output structured report

---

## Project Difficulty Progression

\`\`\`
PROJECT PROGRESSION

  Project 1 (Chatbot)      → Basic LLM API + streaming
                               ↓
  Project 2 (PDF Chat)     → Add embeddings + vector search (RAG)
                               ↓
  Project 3 (Resume)       → Structured output + multi-document
                               ↓
  Project 4 (Interview)    → Stateful sessions + evaluation prompts
                               ↓
  Project 5 (Codebase)     → Technical RAG + code-specific chunking
                               ↓
  Project 6 (Multi-Agent)  → Agents + parallel execution + orchestration

Each project builds on skills from the previous.
\`\`\`

---

## Portfolio Advice

These projects make excellent portfolio items. For each project:

1. **Deploy it** (Vercel, Railway, or similar) — a live URL beats screenshots
2. **Document the architecture** — write a brief README explaining decisions
3. **Describe the challenge** — "The hardest part was handling PDFs with images. I solved this by..."
4. **Quantify impact** — "Reduced time to extract info from documents from 20 min to 30 sec"
5. **Show the code** — GitHub repo with clean code and good commit history`,
  codeExamples: [
    {
      title: 'Project 1: AI Chatbot — Complete Implementation',
      code: `// Complete streaming chatbot — Next.js + Anthropic
// File: app/api/chat/route.ts

import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type Message = { role: 'user' | 'assistant'; content: string };

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json() as {
    message: string;
    history: Message[];
  };

  // Keep last 20 messages for context (manage context window)
  const trimmedHistory = history.slice(-20) as Message[];

  const stream = new ReadableStream({
    async start(controller) {
      const encode = (text: string) =>
        controller.enqueue(new TextEncoder().encode(\`data: \${JSON.stringify({ text })}\\n\\n\`));

      try {
        const apiStream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: 'You are a helpful AI assistant. Be concise and friendly.',
          messages: [...trimmedHistory, { role: 'user', content: message }],
        });

        for await (const chunk of apiStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            encode(chunk.delta.text);
          }
        }

        encode('[DONE]');
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}

// ─── Frontend: app/chat/page.tsx (simplified) ───────────────────

// 'use client';

// import { useState, useRef } from 'react';

// type Message = { role: 'user' | 'assistant'; content: string };

// export default function ChatPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isStreaming, setIsStreaming] = useState(false);

//   async function sendMessage() {
//     if (!input.trim() || isStreaming) return;
//     const userMessage = input;
//     setInput('');

//     const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
//     setMessages(newMessages);
//     setIsStreaming(true);

//     // Add empty assistant message to fill in as stream arrives
//     setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

//     const response = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message: userMessage, history: messages }),
//     });

//     const reader = response.body!.getReader();
//     const decoder = new TextDecoder();

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       const text = decoder.decode(value);
//       const lines = text.split('\\n').filter(l => l.startsWith('data: '));
//       for (const line of lines) {
//         const data = JSON.parse(line.slice(6));
//         if (data.text === '[DONE]') { setIsStreaming(false); break; }
//         setMessages(prev => {
//           const updated = [...prev];
//           updated[updated.length - 1].content += data.text;
//           return updated;
//         });
//       }
//     }
//   }

//   return (/* JSX chat UI */);
// }`,
      explanation:
        'The complete chatbot implementation: streaming API route and frontend. Key patterns: SSE streaming (server-sent events) for real-time token display, conversation history passed on each request, context truncation (last 20 messages), empty assistant message pre-added to show streaming in place.',
    },
  ],
  commonMistakes: [
    'Building all six projects at once instead of completing one before moving to the next — finish and deploy each before starting the next',
    'Not deploying — a live URL is worth 10x more than code on your laptop for portfolio value',
    'No error handling in projects — production-quality projects handle edge cases; add error states and user-friendly error messages',
    'Skipping the simpler projects — the chatbot (Project 1) teaches fundamentals that the later projects build on',
    'Not documenting architecture decisions — "I built this" is weak; "I chose Chroma over Pinecone because..." demonstrates judgment',
  ],
  interviewQuestions: [
    {
      question: 'Tell me about an AI project you built.',
      answer:
        'Structure your answer: (1) What problem does it solve? (2) What is the architecture? (3) What was the most interesting technical challenge? (4) What did you learn? (5) What would you do differently? Example: "I built a PDF Q&A system where users upload documents and ask questions. It uses RAG — I chunk PDFs into 400-token segments, embed them with text-embedding-3-small, store in Chroma, and retrieve relevant chunks on each query. The hardest part was handling scanned PDFs without text — I added OCR via Tesseract. If I rebuilt it, I would use hybrid search (semantic + BM25 keyword) because some users search by exact product code, which pure semantic search misses."',
      difficulty: 'intermediate',
    },
    {
      question: 'What technical challenges did you encounter building with AI?',
      answer:
        'Good answers include: (1) Context window limits — long documents needed chunking; I implemented overlap chunking to prevent cutting relevant context at chunk boundaries; (2) Hallucination — the model occasionally made up product names; I added RAG with explicit "answer only from context" instruction which reduced this significantly; (3) Latency — users complained about waiting; I added streaming so they see tokens appear immediately; (4) Prompt brittleness — a slight prompt change caused format regression; I built a test suite with 20 representative inputs and run it before every prompt change; (5) Cost at scale — my initial implementation used GPT-4 for all calls; I switched simple classification to Haiku and saved 80% on AI costs.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'project-planning',
      title: 'Plan Your First AI Project',
      description:
        'Choose Project 1 or 2 and write a complete implementation plan before starting to code. Good planning prevents the most common mistakes.',
      starterCode: `// Project Implementation Plan
// Choose: Project 1 (Chatbot) or Project 2 (PDF Chat)

const myProject = {
  choice: "", // "chatbot" or "pdf-chat"

  // What exactly will this do?
  featureList: [],

  // What tech stack?
  stack: {
    frontend: "",
    backend: "",
    aiModel: "",
    database: "", // For conversation history or vector DB
    deploymentTarget: "",
  },

  // What are the main implementation steps (in order)?
  implementationSteps: [],

  // What edge cases will you handle?
  edgeCases: [],

  // What could go wrong?
  risks: [],

  // How will you test it?
  testingApproach: "",

  // How will you deploy it?
  deploymentPlan: "",
};`,
      solution: `const myProject = {
  choice: "pdf-chat",

  featureList: [
    "Upload PDF files (drag-and-drop + file picker)",
    "Extract text from PDFs automatically",
    "Ask questions about the uploaded PDF",
    "Receive AI answers with page citations",
    "Multiple documents per session",
    "Clear/start over button",
  ],

  stack: {
    frontend: "Next.js 14 with App Router, TailwindCSS for styling",
    backend: "Next.js API routes (same project), runs on Node.js",
    aiModel: "claude-sonnet-4-6 for generation, text-embedding-3-small for embeddings",
    database: "Chroma (local development), Pinecone for production deployment",
    deploymentTarget: "Vercel (frontend + API routes) + Pinecone (vector DB)",
  },

  implementationSteps: [
    "1. Set up Next.js project with TailwindCSS",
    "2. Build file upload component with progress indicator",
    "3. Build PDF text extraction API route (using pdf-parse npm package)",
    "4. Implement chunking function (400 tokens, 50 token overlap)",
    "5. Implement embedding + Chroma storage",
    "6. Build query API route (embed query → vector search → generate answer)",
    "7. Build chat UI with message history display",
    "8. Wire up upload → index → query flow end-to-end",
    "9. Add source citations to responses",
    "10. Add error handling and loading states",
    "11. Deploy to Vercel",
  ],

  edgeCases: [
    "Scanned PDFs (image-based, no extractable text) → Show clear error message",
    "Very large PDFs (>100 pages, >50K tokens) → Warn user and process first 100 pages",
    "Empty PDF or PDF with no readable text → Handle gracefully with user feedback",
    "Non-PDF file uploaded → Validate file type, reject non-PDFs",
    "Question with no relevant answer in document → Model should say so, not hallucinate",
    "Very long question → Truncate input tokens to stay within context limits",
  ],

  risks: [
    "PDF text extraction quality varies — tables, columns, footnotes often extract poorly",
    "Cost can spike if users upload many large documents — add file size limit (10MB)",
    "Chroma data doesn't persist across Vercel serverless restarts — need proper vector DB for production",
    "Response latency (embedding + search + generation) may be 3-8 seconds — need good loading UX",
  ],

  testingApproach: "Manual testing with: a simple 5-page text PDF, a complex 50-page research paper, a scanned PDF, and a multi-column formatted document. Verify answers are accurate and citations point to correct pages. Test 'no answer' case with questions not in the document.",

  deploymentPlan: "Phase 1: Deploy to Vercel with Chroma running locally (development only). Phase 2: Switch vector DB to Pinecone for production persistence. Environment variables: ANTHROPIC_API_KEY, OPENAI_API_KEY (for embeddings), PINECONE_API_KEY.",
};`,
      hints: [
        'Plan before coding — knowing what edge cases you will handle prevents half-finished features',
        'Deployment is part of the plan, not an afterthought — design for your deployment target from the start',
        'Include specific package names — knowing "I will use pdf-parse" shows you have researched the implementation',
        'Risk assessment separates junior from senior engineers — identifying what could go wrong shows experience',
      ],
    },
  ],
  keyTakeaways: [
    'Build all six projects in order — each teaches a distinct pattern that the next builds on',
    'Deploy every project — a live URL is far more valuable for your portfolio than code on a local machine',
    'Start with the simplest approach that works; add complexity only when needed',
    'Document your architecture decisions — why you made each choice is as important as what you chose',
    'Every real AI project has edge cases that break it — identify and handle them before calling it done',
    'These projects are your evidence in interviews — "I built X which solved Y using Z approach" is the most compelling thing you can say',
  ],
  nextLesson: 'practice-hub',
  prevLesson: 'ai-engineering-interviews',
};
