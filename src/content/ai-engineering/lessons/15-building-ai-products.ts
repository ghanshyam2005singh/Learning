import type { Lesson } from '@/types';

export const buildingAIProductsLesson: Lesson = {
  id: 'building-ai-products',
  slug: 'building-ai-products',
  title: 'Building AI Products',
  description:
    'Understand the architecture and product patterns for AI chat apps, AI assistants, AI SaaS, AI search, AI automation, and AI productivity tools — with real examples and actionable implementation guidance.',
  category: 'Building with AI',
  order: 15,
  difficulty: 'intermediate',
  estimatedTime: 45,
  content: `Most AI applications fall into recognizable product patterns. Understanding these patterns means you do not have to design from scratch every time — you recognize the type of product, apply the known architecture, and focus on the differentiation.

---

## AI Chat Applications

The most common AI product type. A conversational interface where users interact with an AI.

**Examples**: ChatGPT, Claude.ai, Perplexity, Customer support bots

\`\`\`
AI CHAT APPLICATION — CORE ARCHITECTURE

  User types message
       │
  Context assembly:
  ├── System prompt (who is the AI?)
  ├── Conversation history (what was said before?)
  ├── Retrieved context (RAG if knowledge-based)
  └── User message
       │
  LLM generates response (streamed)
       │
  Store exchange in DB
       │
  Display to user
\`\`\`

**Key product decisions**:
- **Scope**: General purpose (like Claude) or domain-specific (legal AI, coding AI)?
- **Memory**: Single session or cross-session memory?
- **Knowledge**: General model knowledge, or RAG from your own documents?
- **Persona**: Generic assistant or branded persona with specific behavior?

**Monetization**: Subscription (free tier → Pro), pay-per-message, enterprise contracts.

---

## AI Assistants

AI assistants are more specialized than generic chat — they are built for a specific workflow or user type.

**Examples**: GitHub Copilot (coding), Cursor (coding), Notion AI (writing), Linear AI (project management)

\`\`\`
AI ASSISTANT DIFFERENTIATORS

  Generic Chat App          Domain-Specific Assistant
  ─────────────────────────────────────────────────────
  "Ask me anything"         "I know your codebase"
  General knowledge         Deep context from your data
  Text in, text out         Integrated into your workflow
  External tool             Built into where you work
\`\`\`

**Architecture additions**:
- Deep integration with the host application (access to user's code, documents, project data)
- Context injection from the workspace (current file, open tabs, project structure)
- Actions in the host application (insert code, create task, format document)

**What makes them valuable**: They have context that generic AI does not — your code, your writing style, your project structure.

---

## AI SaaS

An AI-first product that solves a business problem using AI as the core capability.

**Examples**: Copy.ai (marketing copy), Descript (video editing), Jasper (content), ElevenLabs (voice), Synthesia (video)

\`\`\`
AI SAAS PRODUCT ANATOMY

  Core Value Proposition (what AI enables)
       │
  Input Interface (what user provides)
       │
  AI Processing Pipeline (prompt engineering, models, post-processing)
       │
  Output Interface (what user receives)
       │
  Export / Integration (how user uses the output)
\`\`\`

**Example: Copy.ai for marketing emails**

Input: Product info, target audience, campaign goal
AI Pipeline: Generate 5 variations → user selects best → AI refines
Output: Polished email copy ready to send

**Key considerations**:
- Workflow integration (does output fit into user's existing tools?)
- Quality consistency (AI output quality must be reliably high)
- Volume economics (per-seat SaaS model needs low AI cost per action)

---

## AI Search

Replaces or augments traditional keyword search with semantic search or conversational search.

**Examples**: Perplexity (web search), Algolia AI Search, Notion AI search, Kagi

\`\`\`
AI SEARCH ARCHITECTURE PATTERNS

  SEMANTIC SEARCH
  Query → Embed → Vector search → Ranked results (no LLM needed)

  CONVERSATIONAL SEARCH (Perplexity model)
  Query → Web crawl or vector search → Retrieved sources → LLM generates answer with citations → Response

  HYBRID SEARCH
  Query → Keyword search + Semantic search → Combine and rerank → Results
\`\`\`

**Key metrics**: Precision (are results relevant?), Recall (did we find all relevant results?), Latency (search must be fast — under 2 seconds), Trust (users want to see sources).

---

## AI Automation

AI that automates repetitive business processes without (or with minimal) human involvement.

**Examples**: Zapier AI, Make.com AI, customer support automation, invoice processing, email triage

\`\`\`
AI AUTOMATION PATTERNS

  Document Processing:
  Invoice → Extract data (vendor, amount, date) → Enter into accounting system

  Email Triage:
  Incoming email → Classify type → Route to right team/person

  Content Moderation:
  User submission → Check against policies → Approve/flag/reject

  Data Enrichment:
  CRM record → Enrich with public data → Update record

  Report Generation:
  Pull data from DB → Analyze trends → Generate PDF report
\`\`\`

**Engineering requirements**:
- Reliability over creativity — automation must work consistently, not occasionally brilliantly
- Human escalation path — always have a way for humans to review uncertain cases
- Audit trail — log every automated decision with the reasoning
- Accuracy metrics — track false positives/negatives, improve over time

---

## AI Productivity Tools

Tools that make individuals more productive using AI.

**Examples**: Otter.ai (meeting transcription and summary), Notion AI (writing), Grammarly (writing), Superhuman (email), Reclaim (calendar)

\`\`\`
AI PRODUCTIVITY TOOL PATTERNS

  Input from user's workflow → AI transforms/enhances → Return to workflow

  Examples:
  Meeting audio → Transcribe → Summarize → Extract action items
  Draft email → Improve clarity → Return improved draft
  Calendar events → Analyze schedule → Suggest optimizations
  Research notes → Organize and connect ideas → Create knowledge graph
\`\`\`

**What makes them succeed**:
- Zero friction — one click, works in seconds
- Measurable time savings — user can feel the difference
- Integration into existing tools (not another app to open)
- Quality high enough that output is usable with minimal editing

---

## AI Coding Tools

The fastest-growing category. AI that helps developers write, review, debug, and understand code.

**Examples**: GitHub Copilot, Cursor, Claude Code, Tabnine, Codeium

\`\`\`
AI CODING TOOL CAPABILITIES

  Code Completion (Copilot style)
  → Inline suggestions as you type
  → Context: current file + open files
  → Model: fast small model (low latency required)

  Conversational Coding (Cursor style)
  → Chat with your codebase
  → Context: selected code + whole project
  → Model: frontier model (Claude, GPT-4o)

  Autonomous Coding (Claude Code / Devin style)
  → Give goal, agent implements
  → Context: entire codebase + tools (terminal, file system)
  → Model: frontier model + agent loop
\`\`\`

---

## Cost Architecture for AI Products

Each product type has different cost profiles:

\`\`\`
AI PRODUCT COST PATTERNS

  Chat Application:
  Cost driver: tokens per conversation × conversations per day
  Optimization: Use small model for simple messages, large for complex

  Document Processing Automation:
  Cost driver: pages processed × tokens per page
  Optimization: Batch processing, cache results, use small models

  Code Completion:
  Cost driver: completions per hour per developer × tokens per completion
  Optimization: Local model (no API cost), or tiny fast model for latency

  AI Search:
  Cost driver: queries per day × (embedding + reranking costs)
  Optimization: Cache embeddings, cache frequent queries

  Typical healthy economics for AI SaaS:
  → AI cost per user per month < 20% of subscription price
  → Test: if GPT-4o costs $0.10/user/day = $3/user/month, and plan is $20/month, that's 15% — healthy
\`\`\`

---

## Getting to Market Fast

The AI product development approach that works:

\`\`\`
AI PRODUCT DEVELOPMENT CYCLE

  Week 1: Prototype
  → Pick one specific use case
  → Use the simplest architecture (no RAG, no agents — just prompting)
  → Validate the core value: does AI + your use case = useful?

  Week 2-3: First users
  → Get 5-10 users using it
  → Collect feedback on output quality
  → Iterate on prompts (faster than model switching)

  Month 2: Reliability
  → Add proper error handling
  → Add conversation history
  → Add cost tracking
  → Add streaming

  Month 3+: Scale
  → Add RAG if needed for domain knowledge
  → Add agents if needed for multi-step workflows
  → Optimize for cost at scale
\`\`\`

The most common mistake: over-engineering the AI pipeline before validating that anyone wants the product. A well-crafted prompt to Claude is often better than a complex RAG + agent system built before you know what users need.`,
  codeExamples: [
    {
      title: 'AI SaaS Feature — Email Subject Line Generator',
      code: `import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Rate limiter — simple in-memory (use Redis in production)
const rateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimiter.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) return false;
  userLimit.count += 1;
  return true;
}

// The core AI feature — generate email subject lines
async function generateSubjectLines(
  emailBody: string,
  tone: string,
  count: number
): Promise<string[]> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001', // Haiku: fast and cheap for this task
    max_tokens: 300,
    temperature: 0.8, // Some creativity for varied options
    system: \`You are an email marketing expert specializing in high-converting subject lines.
Generate email subject lines that are:
- Clear and specific (not clickbait)
- 6-10 words maximum
- Optimized for open rates
- Match the requested tone exactly
Return ONLY a JSON array of strings. No explanation.\`,
    messages: [
      {
        role: 'user',
        content: \`Generate \${count} subject lines for this email.
Tone: \${tone}
Email body preview:
\${emailBody.slice(0, 500)}

Return JSON array: ["subject 1", "subject 2", ...]\`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('No text response');

  const lines = JSON.parse(content.text) as string[];
  if (!Array.isArray(lines)) throw new Error('Expected array');
  return lines.slice(0, count);
}

// API route
export async function POST(req: NextRequest) {
  // Auth (simplified — in production verify JWT/session)
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  if (!checkRateLimit(userId)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before generating more.' },
      { status: 429 }
    );
  }

  const { emailBody, tone = 'professional', count = 5 } = await req.json() as {
    emailBody: string;
    tone?: string;
    count?: number;
  };

  if (!emailBody || emailBody.length < 50) {
    return NextResponse.json(
      { error: 'Email body must be at least 50 characters' },
      { status: 400 }
    );
  }

  const validTones = ['professional', 'friendly', 'urgent', 'curiosity'];
  if (!validTones.includes(tone)) {
    return NextResponse.json(
      { error: \`Tone must be one of: \${validTones.join(', ')}\` },
      { status: 400 }
    );
  }

  try {
    const subjects = await generateSubjectLines(emailBody, tone, Math.min(count, 10));
    return NextResponse.json({ subjects, count: subjects.length });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'AI returned unexpected format. Please try again.' },
        { status: 500 }
      );
    }
    console.error('Subject generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate subject lines. Please try again.' },
      { status: 500 }
    );
  }
}`,
      explanation:
        'A production-ready AI SaaS feature endpoint: rate limiting per user, input validation, model selection (Haiku — cheap and fast for simple generation), structured JSON output, error handling with user-friendly messages. This pattern applies to any AI SaaS feature — replace the core AI logic with your use case.',
    },
  ],
  commonMistakes: [
    'Building complex RAG + agent architecture before validating core value — start with prompting alone, add complexity only when needed',
    'Not calculating per-user AI cost before pricing — if AI costs $5/user/month and you charge $10, your margin is too thin at scale',
    'Making AI features optional add-ons instead of core value — users do not pay premium for "AI sprinkled in"',
    'No quality control on AI output — for automation and content products, users will churn if outputs are frequently wrong',
    'Ignoring latency — AI is slow by default; plan streaming and loading states from the start, not as an afterthought',
    'Competing on model capability (we use GPT-4!) instead of workflow integration — the model is a commodity; the workflow is the moat',
  ],
  interviewQuestions: [
    {
      question: 'What are the main types of AI products and how do they differ architecturally?',
      answer:
        'Main types: Chat apps (conversational UI, multi-turn history, streaming), AI Assistants (deep integration with host app, workspace context), AI SaaS (input → AI pipeline → output serving a specific workflow), AI Search (semantic/hybrid retrieval, citations), AI Automation (batch processing, audit trails, human escalation), AI Productivity (zero-friction, workflow integration), AI Coding tools (completion, conversational, autonomous). Key architectural differences: search needs low latency retrieval, automation needs reliability and audit trails, chat needs streaming and history management, automation tools need human escalation paths.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you think about unit economics for an AI product?',
      answer:
        'Calculate AI cost per user action: (input tokens × input price + output tokens × output price). This gives you cost per API call. Multiply by average calls per user per month. This is your AI infrastructure cost per user. It must be significantly below your subscription price — healthy ratio is AI cost < 20% of subscription revenue. Example: Haiku at $0.0001/call × 1000 calls/user/month = $0.10/user/month; if you charge $10/month, that\'s 1% — excellent. Optimize: use smaller models for simple tasks, cache repeated queries, minimize prompt length.',
      difficulty: 'advanced',
    },
    {
      question: 'How do you approach building an AI product for the first time?',
      answer:
        'Start simple: (1) Pick one specific use case with clear success criteria; (2) Build a prototype with just prompting — no RAG, no agents, no complex architecture; (3) Get 5-10 real users using it and collect feedback on output quality; (4) Iterate on prompts before changing models or architecture — prompt engineering often solves problems more cheaply than architectural changes; (5) Add complexity only when needed — add RAG when you need domain knowledge, add agents when you need multi-step workflows; (6) Track costs from day one; (7) Add streaming and error handling before scaling, not after.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'design-ai-saas',
      title: 'Design an AI SaaS Product',
      description:
        'Design a complete AI SaaS product from scratch. Choose one of the product types and define: value proposition, target user, core AI pipeline, pricing model, and one technical implementation decision.',
      starterCode: `// AI SaaS Product Design Exercise
// Choose a product type and fill in the design

const myAISaaS = {
  // What type of AI product? (chat, assistant, saas, search, automation, productivity, coding)
  productType: "",

  // What is the product?
  name: "",
  tagline: "", // One sentence: what does it do for who?

  // Who is the target user?
  targetUser: {
    role: "", // developer, marketer, lawyer, etc.
    painPoint: "", // What do they struggle with today?
    currentSolution: "", // How do they solve it now (without AI)?
  },

  // Core AI pipeline
  coreAI: {
    input: "", // What does the user provide?
    model: "", // Which model and why?
    promptStrategy: "", // Prompting only, RAG, agents?
    output: "", // What does the AI produce?
    postProcessing: "", // Any processing after AI response?
  },

  // Pricing
  pricing: {
    freeFeatures: [], // What is free?
    paidFeatures: [], // What requires payment?
    price: "", // Monthly price?
    estimatedAICostPerUser: "", // Calculate this!
    margin: "", // Estimated gross margin on AI costs
  },

  // One key technical implementation decision and rationale
  keyDecision: {
    decision: "",
    why: "",
    tradeoff: "",
  },
};`,
      solution: `// Example: AI Meeting Summary SaaS

const myAISaaS = {
  productType: "productivity",

  name: "MeetClear",
  tagline: "Turn any meeting recording into decisions and action items in 30 seconds.",

  targetUser: {
    role: "Engineering manager or product manager",
    painPoint: "Takes 30-60 minutes after every meeting to write up notes, action items, and decisions. Often forgets important follow-ups.",
    currentSolution: "Manual note-taking, Otter.ai transcription (but still needs summarization), or no notes at all.",
  },

  coreAI: {
    input: "Meeting audio/video file or Zoom/Meet recording link",
    model: "claude-sonnet-4-6 for summarization (needs nuanced reasoning); Whisper for transcription",
    promptStrategy: "Prompting only (no RAG needed — each meeting is self-contained context)",
    output: "Structured summary: TL;DR, Decisions Made, Action Items (with owner + due date), Open Questions",
    postProcessing: "Extract action items into structured JSON → push to Jira/Linear/Notion via integration",
  },

  pricing: {
    freeFeatures: ["3 meetings/month", "Basic summary", "No integrations"],
    paidFeatures: [
      "Unlimited meetings",
      "Jira/Linear/Notion integration",
      "Custom templates",
      "Team workspace",
      "Search past meetings",
    ],
    price: "$25/user/month Pro, $80/seat/month Team",
    estimatedAICostPerUser: "$1.20/month (avg 20 meetings × 60 min × $0.001/min transcription + $0.05 summarization)",
    margin: "95% on AI costs for Pro plan ($25 - $1.20 = $23.80 gross margin on AI)",
  },

  keyDecision: {
    decision: "Use Whisper (self-hosted) for transcription instead of third-party transcription APIs",
    why: "Meeting audio contains sensitive business information. Self-hosted Whisper keeps audio on our servers and never leaves. Third-party transcription APIs (like Assembly AI) receive the audio and have their own data policies.",
    tradeoff: "More infrastructure to manage vs. better privacy story. Worth it because privacy is a key selling point to enterprise customers who would not use a product where confidential meeting audio is sent to third parties.",
  },
};`,
      hints: [
        'Pick a specific niche — "AI for meetings" is too broad; "AI meeting summaries for engineering managers" is a product',
        'Calculate the AI cost per user honestly — this drives your pricing decisions',
        'The model choice should match the task: complex reasoning needs Sonnet, simple tasks use Haiku',
        'Privacy is a selling point for enterprise — mention where data goes as a design decision',
      ],
    },
  ],
  keyTakeaways: [
    'AI products fall into recognizable patterns: chat, assistants, SaaS, search, automation, productivity, coding tools — each with known architectures',
    'Start simple: prompt engineering alone often works for v1; add RAG and agents only when needed',
    'Unit economics matter: calculate AI cost per user action early and ensure it is well below your subscription price',
    'The model is a commodity — workflow integration and domain specialization are the moats',
    'Automation products need reliability and audit trails; chat apps need streaming and history; both need cost controls',
    'Validate core value with 5-10 real users before building complex architecture',
  ],
  nextLesson: 'model-training-fundamentals',
  prevLesson: 'ai-application-architecture',
};
