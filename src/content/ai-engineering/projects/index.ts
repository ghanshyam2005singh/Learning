import type { Project } from '@/types';

export const aiEngineeringProjects: Project[] = [
  {
    id: 'ai-eng-proj-01',
    slug: 'ai-chatbot',
    title: 'AI Chatbot with Streaming',
    description:
      'Build a full-stack AI chatbot with streaming responses, conversation history, and a clean chat UI. Deploy to Vercel.',
    difficulty: 'beginner',
    estimatedTime: '4-6 hours',
    techStack: ['Next.js 14', 'TypeScript', 'TailwindCSS', 'Anthropic SDK', 'Vercel'],
    features: [
      'Real-time streaming responses (tokens appear as they are generated)',
      'Conversation history maintained across messages',
      'Clear conversation button',
      'Mobile-responsive chat interface',
      'Error handling with user-friendly messages',
    ],
    folderStructure: `ai-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Streaming API route
│   ├── page.tsx                # Chat UI
│   └── layout.tsx
├── components/
│   ├── ChatMessage.tsx         # Individual message component
│   ├── ChatInput.tsx           # Input + send button
│   └── MessageList.tsx         # Scrollable message list
├── .env.local                  # ANTHROPIC_API_KEY
└── package.json`,
    steps: [
      {
        title: 'Set up Next.js project',
        description: 'Create the project with TypeScript and TailwindCSS.',
        code: 'npx create-next-app@latest ai-chatbot --typescript --tailwind --app\ncd ai-chatbot\nnpm install @anthropic-ai/sdk',
      },
      {
        title: 'Create the streaming API route',
        description:
          'Build the backend endpoint that calls Anthropic and streams tokens back via SSE.',
        code: `// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      const encode = (text: string) =>
        controller.enqueue(new TextEncoder().encode(\`data: \${JSON.stringify({ text })}\\n\\n\`));

      const apiStream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [...history.slice(-20), { role: 'user', content: message }],
      });

      for await (const chunk of apiStream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          encode(chunk.delta.text);
        }
      }

      encode('[DONE]');
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}`,
        hint: 'Use SSE (Server-Sent Events) format: each chunk is "data: {json}\\n\\n"',
      },
      {
        title: 'Build the chat UI',
        description:
          'Create a message list and input form that reads from the SSE stream.',
        hint: 'Pre-add an empty assistant message, then fill it in character-by-character as tokens arrive from the stream.',
      },
      {
        title: 'Add conversation history',
        description:
          'Store the conversation in React state and send it with each request. Truncate to the last 20 messages.',
        hint: 'Type the messages array as { role: "user" | "assistant"; content: string }[]',
      },
      {
        title: 'Deploy to Vercel',
        description: 'Push to GitHub and connect to Vercel. Add ANTHROPIC_API_KEY as an environment variable in Vercel settings.',
        code: 'git init && git add . && git commit -m "Initial chatbot"\n# Push to GitHub, then import in vercel.com',
      },
    ],
    interviewQuestions: [
      {
        question: 'How does streaming work in your chatbot?',
        answer:
          'The API route returns a ReadableStream using SSE (Server-Sent Events) format. Each token from Anthropic is wrapped in "data: {json}\\n\\n" and enqueued. The frontend reads this with a ReadableStreamDefaultReader, splits on newlines, parses each JSON chunk, and appends the token to the active message in state. The user sees text appearing character by character rather than waiting for the full response.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['chatbot', 'streaming', 'Next.js', 'beginner'],
  },
  {
    id: 'ai-eng-proj-02',
    slug: 'pdf-qa-system',
    title: 'PDF Q&A System (RAG)',
    description:
      'Build a system where users upload a PDF, and can then ask questions about it. The system uses RAG to retrieve relevant chunks and generate accurate answers with citations.',
    difficulty: 'intermediate',
    estimatedTime: '8-12 hours',
    techStack: [
      'Next.js 14',
      'TypeScript',
      'Anthropic SDK',
      'OpenAI Embeddings',
      'ChromaDB',
      'pdf-parse',
    ],
    features: [
      'PDF upload with drag-and-drop',
      'Automatic text extraction and chunking',
      'Semantic search over document chunks',
      'AI answers with page citations',
      'Multiple PDF support per session',
    ],
    folderStructure: `pdf-qa/
├── app/
│   ├── api/
│   │   ├── upload/route.ts     # PDF processing + indexing
│   │   └── query/route.ts      # RAG query endpoint
│   └── page.tsx
├── lib/
│   ├── pdf.ts                  # Text extraction + chunking
│   ├── embeddings.ts           # Embedding generation
│   └── vectordb.ts             # Chroma operations
└── components/
    ├── UploadZone.tsx
    └── QuestionForm.tsx`,
    steps: [
      {
        title: 'Set up dependencies',
        description: 'Install PDF processing and embedding libraries.',
        code: 'npm install @anthropic-ai/sdk openai pdf-parse chromadb\nnpm install -D @types/pdf-parse',
      },
      {
        title: 'Build PDF text extraction and chunking',
        description: 'Extract text from uploaded PDFs and split into 400-token chunks with overlap.',
        code: `// lib/pdf.ts
import pdfParse from 'pdf-parse';

export async function extractAndChunkPDF(buffer: Buffer): Promise<string[]> {
  const data = await pdfParse(buffer);
  const text = data.text;

  // Split into ~400-token chunks with ~50-token overlap
  const CHUNK_SIZE = 1600;  // ~400 tokens × 4 chars/token
  const OVERLAP = 200;      // ~50 tokens overlap
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += CHUNK_SIZE - OVERLAP) {
    const chunk = text.slice(i, i + CHUNK_SIZE).trim();
    if (chunk.length > 100) chunks.push(chunk); // Skip tiny trailing chunks
  }

  return chunks;
}`,
        hint: 'Overlap prevents answers from being split exactly at chunk boundaries',
      },
      {
        title: 'Build the indexing pipeline',
        description: 'Embed each chunk and store in ChromaDB with metadata.',
        hint: 'Use OpenAI text-embedding-3-small for embeddings (fast and cheap for this use case)',
      },
      {
        title: 'Build the RAG query pipeline',
        description: 'Embed the user query, retrieve top-3 chunks, build context, and generate an answer.',
        hint: 'System prompt must say "answer ONLY from the provided context" to prevent hallucination',
      },
      {
        title: 'Build the upload and query UI',
        description: 'Create a drag-and-drop upload zone and a question input with answer display.',
        hint: 'Show a loading state during PDF processing — extraction and embedding can take 5-30 seconds for large documents',
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you choose chunk size for a RAG system?',
        answer:
          'Smaller chunks (100-200 tokens) give more precise retrieval but may lack context for the answer. Larger chunks (800+ tokens) provide more context but the embedding represents an average of many concepts, reducing precision. For most document Q&A, 300-500 tokens with 10-20% overlap is the sweet spot. Overlap prevents answers from being cut at chunk boundaries. For code, chunk by function; for structured documents, chunk by section headers.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['RAG', 'embeddings', 'PDF', 'vector search', 'intermediate'],
  },
  {
    id: 'ai-eng-proj-03',
    slug: 'multi-agent-research',
    title: 'Multi-Agent Research Workflow',
    description:
      'Build a multi-agent system that researches a topic using parallel agents, each covering a different angle, then synthesizes a structured report.',
    difficulty: 'advanced',
    estimatedTime: '10-16 hours',
    techStack: [
      'Node.js / Next.js',
      'TypeScript',
      'Anthropic SDK',
      'Tavily Search API',
    ],
    features: [
      'Coordinator agent that plans research subtasks',
      'Parallel research agents (one per subtopic)',
      'Synthesis agent that combines findings into a report',
      'Streaming progress updates to the UI',
      'Structured markdown report output',
    ],
    folderStructure: `research-agent/
├── app/
│   ├── api/
│   │   └── research/route.ts   # Research orchestration
│   └── page.tsx
├── lib/
│   ├── agents/
│   │   ├── coordinator.ts      # Plans subtasks
│   │   ├── researcher.ts       # Researches one subtopic
│   │   └── synthesizer.ts      # Combines findings
│   └── tools/
│       └── search.ts           # Tavily web search tool
└── components/
    ├── ResearchForm.tsx
    └── ReportDisplay.tsx`,
    steps: [
      {
        title: 'Set up web search tool',
        description: 'Integrate Tavily API for real web search capability.',
        code: `// lib/tools/search.ts
export async function webSearch(query: string): Promise<string> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      max_results: 3,
    }),
  });
  const data = await response.json();
  return data.results.map((r: { title: string; content: string }) => \`\${r.title}: \${r.content}\`).join('\\n\\n');
}`,
      },
      {
        title: 'Build the coordinator agent',
        description:
          'An agent that takes a research topic and returns a structured plan with 3-5 subtopics for parallel research.',
        hint: 'Use structured output (JSON mode) for the coordinator — you need to parse its plan to dispatch workers',
      },
      {
        title: 'Build the research agent',
        description:
          'A single-purpose agent that researches one specific subtopic using web search and returns a 200-word summary.',
        hint: 'Each research agent runs independently — this is where you get parallelism',
      },
      {
        title: 'Run research agents in parallel',
        description:
          'Dispatch all research agents simultaneously using Promise.all, wait for all to complete, then pass results to the synthesis agent.',
        code: `// Run all research agents in parallel
const researchResults = await Promise.all(
  subtopics.map((subtopic) => researchAgent(topic, subtopic))
);`,
        hint: 'Promise.all is the key to parallelism — without it, agents would run sequentially (N× slower)',
      },
      {
        title: 'Build the synthesis agent',
        description:
          'An agent that takes all research summaries and writes a structured report with introduction, sections per subtopic, and conclusion.',
        hint: 'Pass all research results in the system prompt as context, then ask for a specific report structure',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why did you use multiple agents instead of one agent for this?',
        answer:
          'The research subtopics are independent — they do not depend on each other. That means they can run in parallel, which makes the system N× faster where N is the number of subtopics. A single agent would research them sequentially. The specialization also helps: each research agent focuses on one angle without accumulating irrelevant context from other subtopics. The tradeoff is coordination complexity and higher total cost (more LLM calls), which is worth it for tasks where speed matters.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['multi-agent', 'orchestration', 'parallel', 'advanced', 'research'],
  },
];
