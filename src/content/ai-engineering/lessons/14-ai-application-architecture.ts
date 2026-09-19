import type { Lesson } from '@/types';

export const aiApplicationArchitectureLesson: Lesson = {
  id: 'ai-application-architecture',
  slug: 'ai-application-architecture',
  title: 'AI Application Architecture',
  description:
    'Understand how to architect complete AI applications — frontend, backend, LLM layer, vector database, retrieval, tools, memory, and monitoring — and how all the pieces connect.',
  category: 'Building with AI',
  order: 14,
  difficulty: 'intermediate',
  estimatedTime: 45,
  content: `Building an AI feature is straightforward. Building a production AI application requires thinking about architecture — how all the components connect, where data flows, how to handle failures, and how to keep costs under control.

This module gives you the mental model for architecting complete AI applications.

---

## The Components of an AI Application

\`\`\`
COMPLETE AI APPLICATION ARCHITECTURE

  ┌─────────────────────────────────────────────────────────────────────┐
  │                         FRONTEND                                    │
  │   React / Next.js UI    Chat Interface    File Upload               │
  └────────────────────────────┬────────────────────────────────────────┘
                               │ HTTP / WebSocket
  ┌────────────────────────────▼────────────────────────────────────────┐
  │                         BACKEND / API                               │
  │   Auth Middleware    Rate Limiting    Request Routing               │
  └──────┬──────────────────────────────────────────┬───────────────────┘
         │                                          │
  ┌──────▼────────┐                      ┌──────────▼────────┐
  │  LLM LAYER    │                      │   RETRIEVAL LAYER │
  │               │                      │                   │
  │  Anthropic    │                      │  Embed query      │
  │  OpenAI       │◄─── context ─────────│  Search vector DB │
  │  Gemini       │     injection        │  Return chunks    │
  └──────┬────────┘                      └──────────┬────────┘
         │ tool calls                               │
  ┌──────▼────────┐                      ┌──────────▼────────┐
  │  TOOLS        │                      │  VECTOR DATABASE  │
  │               │                      │                   │
  │  Web search   │                      │  Pinecone         │
  │  DB queries   │                      │  Chroma           │
  │  APIs         │                      │  pgvector         │
  │  Code exec    │                      └───────────────────┘
  └───────────────┘
         │
  ┌──────▼────────┐     ┌─────────────────────┐     ┌─────────────┐
  │  MEMORY       │     │  MONITORING          │     │  DATABASE   │
  │               │     │                      │     │             │
  │  Conversation │     │  Cost tracking       │     │  User data  │
  │  history DB   │     │  Latency metrics     │     │  Orders     │
  │  User prefs   │     │  Error rates         │     │  Sessions   │
  └───────────────┘     │  Token usage         │     └─────────────┘
                        └─────────────────────┘
\`\`\`

---

## Frontend Layer

The frontend is how users interact with AI features. Design choices here significantly impact the user experience.

### Chat Interface

For conversational AI, a chat interface is the standard pattern:

\`\`\`
CHAT UI REQUIREMENTS

  Messages display:
  - User messages (right aligned)
  - AI messages (left aligned)
  - Streaming support (text appears progressively)
  - Markdown rendering (code blocks, bold, lists)
  - Loading states

  Input area:
  - Text input with submit button
  - File attachment (for document Q&A)
  - New conversation button
  - Clear/reset context option

  Error states:
  - "AI is busy, please try again"
  - "Something went wrong"
  - Network error handling
\`\`\`

### Streaming to the Frontend

For good UX, stream AI responses from the backend to the frontend:

\`\`\`
STREAMING ARCHITECTURE

  Browser
    │
    │  POST /api/chat (EventSource or fetch with streaming)
    │
    ▼
  Next.js API Route
    │
    │  client.messages.stream(...)
    │  Pipe each text chunk to response
    │
    ▼
  Anthropic API

  Each token arrives → piped to frontend → displayed immediately
  User sees typing effect instead of waiting
\`\`\`

---

## Backend Layer

The backend is the orchestration layer — it handles authentication, routes requests, enforces rate limits, calls AI APIs, and manages conversation state.

\`\`\`
BACKEND RESPONSIBILITIES

  Authentication & Authorization
  → Validate user is logged in before any AI call
  → Ensure user can only access their own conversations

  Rate Limiting
  → Limit AI calls per user per hour
  → Prevent abuse and runaway costs
  → Return 429 with clear error when exceeded

  Request Routing
  → Route to different AI models based on request type
  → Example: use Haiku for simple classification, Sonnet for generation

  Context Assembly
  → Load conversation history from DB
  → Retrieve relevant memory chunks from vector DB
  → Build the full prompt before calling LLM

  Cost Control
  → Track token usage per user
  → Implement usage limits per plan tier
  → Alert on unexpected cost spikes
\`\`\`

---

## LLM Layer

The LLM layer is your interface to the AI model. It should be:

\`\`\`
LLM LAYER DESIGN

  Abstract the provider:
  ┌────────────────────────────────────┐
  │  llm.complete(prompt, options)     │
  │  llm.stream(prompt, options)       │
  │  llm.countTokens(text)             │
  └────────────────────────────────────┘
  ↕ implements
  ┌────────────────────────────────────┐
  │  AnthropicProvider                 │
  │  OpenAIProvider                    │
  │  (swap without changing app code)  │
  └────────────────────────────────────┘

  Include retry logic:
  → Retry on 429 (rate limit) with exponential backoff
  → Retry on 500 (server error) with backoff
  → Do NOT retry on 400 (bad request — fix the prompt)

  Include observability:
  → Log: model, tokens used, latency, user ID, conversation ID
  → Track: total cost per user, per conversation, per day
\`\`\`

---

## Vector Database and Retrieval Layer

For RAG-enabled applications:

\`\`\`
RETRIEVAL LAYER DESIGN

  Indexing pipeline (async, not in request path):
  New document uploaded
    → Parse and extract text
    → Chunk into segments
    → Embed with embedding model
    → Upsert into vector DB
    → Update document index in relational DB

  Retrieval (in request path):
  User sends message
    → Embed the message
    → Query vector DB (top-K, filtered by user/workspace)
    → Return chunks ranked by relevance
    → Inject into LLM prompt as context

  Cache embeddings:
  → Cache query embeddings for repeated identical queries
  → Do not re-embed the same document chunks unnecessarily
\`\`\`

---

## Tools Layer

For agent applications, the tools layer handles tool execution:

\`\`\`
TOOLS LAYER DESIGN

  Tool Registry:
  → Defines available tools per user type / permission level
  → "Free tier users get web_search only; Pro users get all tools"

  Tool Execution:
  → Validates tool call arguments
  → Executes in appropriate environment (sandbox for code execution)
  → Returns standardized result format
  → Logs every tool call: name, inputs, outputs, latency

  Safety:
  → Allowlist of permitted tools per context
  → Rate limit tool calls (prevent tool abuse)
  → Timeout on slow tools (prevent hanging the agent loop)
  → Sandbox code execution in Docker containers
\`\`\`

---

## Memory System

AI applications need memory to be useful across sessions:

\`\`\`
MEMORY TYPES IN PRODUCTION

  1. CONVERSATION HISTORY (per session)
     Where: PostgreSQL / Redis
     What: Each message in the current conversation
     How: Load from DB, include in every request, save new messages after response
     Limit: Truncate to fit context window

  2. LONG-TERM USER MEMORY (across sessions)
     Where: Vector database (semantic search) + PostgreSQL (structured)
     What: Key facts about the user, preferences, important history
     How: Extract key facts from conversations → embed → store
          At start of new session, retrieve relevant memories

  3. KNOWLEDGE BASE MEMORY (system-wide)
     Where: Vector database
     What: Your product docs, FAQs, support materials
     How: Index at build/upload time; retrieve at query time (RAG)
\`\`\`

---

## Monitoring Layer

Without monitoring, you are flying blind. Track these in every AI application:

\`\`\`
WHAT TO MONITOR

  COST METRICS
  ├── Tokens per request (input and output separately)
  ├── Cost per user per day
  ├── Total API spend per day
  └── Cost per feature / endpoint

  QUALITY METRICS
  ├── User thumbs up/down on responses
  ├── Conversation length (longer = more engaging)
  ├── Retry rate (users repeating queries = bad responses)
  └── Escalation rate (users asking for human = AI failed)

  PERFORMANCE METRICS
  ├── Time to first token (latency)
  ├── Time to complete response
  ├── Tool call latency
  └── Vector search latency

  RELIABILITY METRICS
  ├── API error rate (4xx, 5xx from AI provider)
  ├── Rate limit hit rate
  ├── Timeout rate
  └── Retry success rate
\`\`\`

---

## Putting It Together — Request Flow

\`\`\`
COMPLETE REQUEST FLOW FOR A RAG CHAT APP

  User types: "How do I integrate Stripe payments?"
       │
  1.   │  Frontend sends POST /api/chat
       │  { message, conversationId }
       │
  2.   ▼  Backend validates auth, loads user state
       │
  3.   │  Retrieve from vector DB:
       │  embed("How do I integrate Stripe payments?")
       │  → top-3 relevant docs from knowledge base
       │
  4.   │  Load conversation history (last 10 messages) from DB
       │
  5.   │  Build prompt:
       │  system: "You are a Stripe integration expert. Use context."
       │  context: [retrieved docs]
       │  history: [last 10 messages]
       │  user: "How do I integrate Stripe payments?"
       │
  6.   │  Call LLM (Anthropic API) with streaming
       │
  7.   │  Stream response chunks to frontend (SSE or ReadableStream)
       │
  8.   │  On completion:
       │  - Save user message + AI response to DB
       │  - Track tokens used (for billing and monitoring)
       │
  9.   ▼  Frontend displays streaming response with markdown rendering
\`\`\``,
  codeExamples: [
    {
      title: 'Production-Ready AI Chat API Route',
      code: `// app/api/chat/route.ts
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Simulate DB and vector DB operations
const conversationStore = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();

async function getConversationHistory(
  conversationId: string
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  return conversationStore.get(conversationId) ?? [];
}

async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const history = conversationStore.get(conversationId) ?? [];
  history.push({ role, content });
  conversationStore.set(conversationId, history);
}

async function retrieveRelevantContext(query: string): Promise<string> {
  // In production: embed query, search vector DB, return top-K chunks
  return \`Relevant documentation for: \${query}\`;
}

function truncateHistory(
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxMessages = 10
) {
  // Keep last N messages to manage context window
  return history.slice(-maxMessages);
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json() as {
      message: string;
      conversationId: string;
    };

    if (!message || !conversationId) {
      return new Response(
        JSON.stringify({ error: 'message and conversationId required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Load conversation history
    const history = await getConversationHistory(conversationId);
    const truncatedHistory = truncateHistory(history);

    // Retrieve relevant context (RAG)
    const context = await retrieveRelevantContext(message);

    // Save user message
    await saveMessage(conversationId, 'user', message);

    // Build messages array with history
    const messages: Anthropic.MessageParam[] = [
      ...truncatedHistory,
      { role: 'user', content: message },
    ];

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';

        try {
          const apiStream = client.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: \`You are a helpful assistant.
Use the following context to inform your answers:

\${context}

If the context does not contain relevant information, answer from your general knowledge.\`,
            messages,
          });

          for await (const chunk of apiStream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const text = chunk.delta.text;
              fullResponse += text;
              controller.enqueue(new TextEncoder().encode(\`data: \${JSON.stringify({ text })}\\n\\n\`));
            }
          }

          // Save complete response after streaming finishes
          await saveMessage(conversationId, 'assistant', fullResponse);

          // Signal stream end
          controller.enqueue(new TextEncoder().encode('data: [DONE]\\n\\n'));
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
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}`,
      explanation:
        'This production chat route handles: conversation history loading and saving, context truncation to manage the context window, RAG context retrieval, streaming response with Server-Sent Events, and saving the complete response after streaming. The streaming approach sends each token as it arrives — users see text appearing immediately.',
    },
  ],
  commonMistakes: [
    'Calling AI APIs directly from the frontend — exposes API keys; always proxy through backend',
    'No conversation history management — storing infinite messages and sending all of them on every request will exceed context limits and cost a fortune',
    'No rate limiting per user — one malicious user could drain your entire API budget; always limit calls per user per time window',
    'No cost tracking — you will not know a feature is too expensive until you get your first bill',
    'Rebuilding context on every request — cache frequently-accessed embeddings and RAG chunks to reduce latency and cost',
    'No monitoring on AI responses — without feedback collection, you cannot know if the AI is producing good answers',
  ],
  interviewQuestions: [
    {
      question: 'How do you architect a production AI chat application?',
      answer:
        'Key components: Frontend (streaming chat UI with markdown rendering, loading states), Backend API (auth, rate limiting, cost tracking), LLM layer (abstracted provider with retry logic and observability), Memory (conversation history in DB truncated to fit context, long-term user memory in vector DB), RAG/Retrieval (embed knowledge base at index time, retrieve relevant chunks at query time, inject into prompt), Monitoring (tokens per request, cost per user, latency, error rates, user satisfaction). The request flow: authenticate → load history → retrieve context → build prompt → stream LLM response → save to DB.',
      difficulty: 'advanced',
    },
    {
      question: 'How do you handle conversation history in a production AI chat app?',
      answer:
        'Store conversation messages in a database (PostgreSQL works well) with conversationId, role, content, and timestamp. On each request: load the full history, truncate to the last N messages (or by token count) to fit within the context window, include in the LLM request, and save the new exchange after the response. Key decisions: (1) truncation strategy — always keep most recent messages as they are most relevant; (2) token counting — track accumulated tokens to avoid hitting context limits; (3) summarization — for very long conversations, periodically summarize old messages to compress history.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you monitor and control costs in a production AI application?',
      answer:
        'Track token usage from every API response (response.usage.input_tokens + output_tokens). Store per user, per conversation, per day. Multiply by model pricing to get dollar cost. Implement: (1) per-user usage limits (e.g., 100K tokens/day on free tier), (2) return 402/429 with clear error when limit exceeded, (3) alerts when daily spend exceeds threshold, (4) dashboard showing cost by feature/model/user. Optimization: use smaller models for simple tasks, minimize system prompt length (billed on every call), cache repeated queries, set appropriate max_tokens (not too high).',
      difficulty: 'advanced',
    },
  ],
  exercises: [
    {
      id: 'design-ai-architecture',
      title: 'Design the Architecture for an AI Feature',
      description:
        'Design the complete architecture for an "AI Email Composer" feature. Given a few bullet points, it drafts a professional email. Map out all components, data flow, and key decisions.',
      starterCode: `// AI Email Composer — Architecture Design Exercise

// Fill in the architecture decisions for each component:

const emailComposerArchitecture = {
  feature: "AI Email Composer — draft professional emails from bullet points",

  frontend: {
    inputs: [], // What inputs does the user provide?
    outputs: [], // What does the UI show?
    streamingNeeded: null, // true/false — why?
    errorStates: [], // What errors should the UI handle?
  },

  backend: {
    endpoint: "", // What API route handles this?
    authRequired: null, // true/false — why?
    rateLimiting: "", // What limits make sense?
    inputValidation: [], // What should you validate before calling AI?
  },

  llmLayer: {
    model: "", // Which model? Why?
    systemPrompt: "", // Write the system prompt
    temperature: null, // What temperature? Why?
    maxTokens: null, // Why this value?
  },

  memory: {
    conversationHistory: null, // needed? why/why not?
    userPreferences: [], // What user preferences to remember?
    whereToStore: "", // Where do you store this?
  },

  monitoring: {
    metricsToTrack: [], // What to measure?
    costControl: "", // How to prevent runaway costs?
  },
};`,
      solution: `const emailComposerArchitecture = {
  feature: "AI Email Composer — draft professional emails from bullet points",

  frontend: {
    inputs: [
      "Bullet points text area (the key points to include)",
      "Recipient context (who is this to? e.g., customer, colleague, recruiter)",
      "Tone selector (formal, friendly, assertive)",
      "Optional: example past emails to match style",
    ],
    outputs: [
      "Generated email draft (full subject + body)",
      "Loading state while generating",
      "Copy to clipboard button",
      "Regenerate button (try again with same inputs)",
      "Edit mode (user can modify before copying)",
    ],
    streamingNeeded: true,
    // Streaming reason: Email drafts can be 200-500 words (30-90 seconds without streaming)
    // With streaming, user sees text appearing immediately — much better UX
    errorStates: [
      "Bullet points too short/vague — validation error before calling AI",
      "AI service unavailable — 'Service temporarily unavailable, try again'",
      "Rate limit exceeded — 'You have used your daily limit, upgrade to Pro'",
      "Network error — 'Connection lost, please check your internet'",
    ],
  },

  backend: {
    endpoint: "POST /api/compose-email",
    authRequired: true,
    // Why: Need to track usage per user for billing and rate limiting
    rateLimiting: "20 requests per user per hour on free tier, 200 on pro",
    // Reason: Each call costs ~$0.01; 20/hr prevents abuse while being generous
    inputValidation: [
      "bulletPoints must be non-empty string",
      "bulletPoints.length must be between 20 and 2000 chars",
      "tone must be one of: formal | friendly | assertive",
      "Sanitize inputs (remove prompt injection attempts)",
    ],
  },

  llmLayer: {
    model: "claude-haiku-4-5-20251001",
    // Why Haiku: Email drafting is a well-defined task, Haiku is 10x cheaper
    // than Sonnet. Test both — Haiku is likely good enough for most emails.
    systemPrompt: \`You are an expert email writer. Given bullet points and context,
draft a professional email with subject line and body.
Format: Subject: [subject line]\\n\\n[email body]
Match the requested tone exactly. Be concise but complete.\`,
    temperature: 0.7,
    // Why: Some creativity for natural-sounding email, but not too high
    // (don't want bizarre/inappropriate creative choices in professional emails)
    maxTokens: 600,
    // Why: Professional email subject + body should be < 400 tokens typically
    // 600 gives buffer for longer emails without excessive cost ceiling
  },

  memory: {
    conversationHistory: false,
    // Not needed: each email composition is independent (no multi-turn dialogue)
    userPreferences: [
      "User's preferred writing style/tone (learned from past emails)",
      "Common recipient types (customer vs internal vs recruiter)",
      "Email signature preferences",
    ],
    whereToStore: "PostgreSQL users table (structured preferences, not semantic)",
    // Preferences are simple key-value, not semantic — no need for vector DB
  },

  monitoring: {
    metricsToTrack: [
      "Tokens per email composition (input + output)",
      "Cost per composition (for billing calculations)",
      "Time to first token (UX metric — should be < 1s)",
      "User regeneration rate (high rate = bad first drafts)",
      "Copy button click rate (clicked = user found it useful)",
    ],
    costControl: "Track tokens per user per day, enforce tier limits (500K tokens/day free, 5M pro). Alert if any single user exceeds 100K tokens in an hour (likely abuse).",
  },
};`,
      hints: [
        'Think about what a user needs to provide and what they expect to get — map inputs to outputs',
        'For model selection: what is the task complexity? Simple drafting → Haiku; complex reasoning → Sonnet',
        'Rate limiting: calculate the worst-case cost if a user hits the limit constantly — is it acceptable?',
        'Temperature: high creativity (0.9+) in professional email = risky; keep it moderate',
      ],
    },
  ],
  keyTakeaways: [
    'AI applications have distinct layers: frontend, backend/API, LLM layer, retrieval, tools, memory, and monitoring — each with specific responsibilities',
    'Always proxy AI API calls through backend — never expose API keys to the frontend',
    'Context assembly happens on the backend: load history, retrieve relevant chunks, build the prompt, then call LLM',
    'Streaming improves UX significantly for any AI response longer than a few words — implement it from the start',
    'Monitoring is non-negotiable: track token usage, latency, error rates, and user satisfaction from day one',
    'Rate limiting per user and cost tracking protect you from runaway costs — implement before launch',
  ],
  nextLesson: 'building-ai-products',
  prevLesson: 'tools-and-function-calling',
};
