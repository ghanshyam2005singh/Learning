import type { Lesson } from '@/types';

export const revisionHubLesson: Lesson = {
  id: 'revision-hub',
  slug: 'revision-hub',
  title: 'Revision Hub',
  description:
    'Complete cheat sheets for every major AI engineering topic — LLMs, prompting, RAG, agents, architecture, security, and evaluation. Review before interviews, reference during projects.',
  category: 'Revision',
  order: 23,
  difficulty: 'beginner',
  estimatedTime: 30,
  content: `This is your single reference for everything in the track. Use it before interviews, at the start of a project, or whenever you need a quick refresh.

---

## AI Cheat Sheet

| Concept | One-line definition |
|---------|-------------------|
| AI | Software that performs tasks that typically require human intelligence |
| Machine Learning | AI that learns patterns from data rather than following explicit rules |
| Deep Learning | ML using neural networks with many layers (makes modern AI possible) |
| Generative AI | AI that creates new content (text, images, code, audio) |
| Foundation Model | Large model trained on broad data, fine-tuned for specific tasks |
| Inference | Using a trained model to make predictions (what you do when you call an API) |
| Training | Teaching a model by showing it examples and adjusting weights |
| Parameters | The numbers inside a neural network that encode learned knowledge |

**Why AI became powerful now**: More data + More compute (GPUs) + Better algorithms (Transformers)

**AI vs Traditional Software**:
- Traditional: \`if customer == "angry" → transfer to human\`
- AI: Learns what "angry" looks like from thousands of examples, handles new cases automatically

---

## LLM Cheat Sheet

| Concept | Explanation |
|---------|------------|
| Token | ~¾ of a word. "Hello world" = 2 tokens. LLMs process tokens, not characters. |
| Context window | How much text the model can "see" at once. 200K tokens ≈ 150,000 words. |
| Temperature | Randomness. 0 = deterministic/factual. 1 = creative/varied. |
| Top-p / Top-k | Sampling parameters that control output diversity |
| Hallucination | Model confidently states false information. Root cause: predicting likely next tokens, not retrieving facts. |
| System prompt | Instructions that define the AI's behavior for the entire conversation |
| Attention | Mechanism that lets the model focus on relevant parts of context |

**Major Models**:
- Claude (Anthropic): claude-sonnet-4-6, claude-haiku-4-5-20251001
- GPT (OpenAI): GPT-4o, GPT-4o mini
- Gemini (Google): Gemini 1.5 Pro
- Open source: Llama 3, Mistral, Phi-3

**Model Selection Rule of Thumb**:
- Simple tasks (classification, extraction, short answers) → Haiku/Flash/4o-mini
- Standard tasks (Q&A, summarization, coding) → Sonnet/GPT-4o
- Complex reasoning → Opus/o1

---

## Prompt Engineering Cheat Sheet

**System Prompt Anatomy**:
\`\`\`
Role: "You are a [role] for [company/context]."
Context: What the AI needs to know about the situation
Instructions: What to do (numbered list is clearest)
Constraints: What NOT to do
Format: Exactly how to structure the output
\`\`\`

**Technique → When to Use**:
| Technique | Use when |
|-----------|---------|
| Zero-shot | Simple, clear tasks |
| Few-shot | Unusual format or style needed |
| Chain-of-thought | Multi-step reasoning problems |
| Structured output | Need reliable JSON/XML output |
| Role prompting | Need specific expertise or tone |
| Self-consistency | Need higher accuracy, run same prompt N times |

**Common Prompt Anti-patterns**:
- ❌ "Be helpful" (too vague)
- ❌ "Keep it short if possible" (contradictory + ambiguous)
- ❌ No output format specified
- ❌ Mixing multiple tasks in one prompt
- ✅ "Return a JSON object with keys: name, summary, score"
- ✅ "Answer in exactly 3 bullet points, each under 15 words"

---

## Embeddings Cheat Sheet

| Concept | Explanation |
|---------|------------|
| Embedding | Array of numbers (vector) representing meaning |
| Dimensions | Number of values in the vector (1536 for text-embedding-3-small) |
| Cosine similarity | Distance between vectors. 1.0 = identical, 0 = unrelated, -1 = opposite |
| Semantic search | Find similar meaning, not exact keywords |
| Chunking | Splitting long documents into smaller pieces before embedding |

**Embedding Models**:
- \`text-embedding-3-small\` (OpenAI): 1536 dimensions, fast, cheap, general purpose
- \`text-embedding-3-large\` (OpenAI): 3072 dimensions, more accurate
- \`voyage-code-2\` (Voyage): Specialized for code
- \`nomic-embed\` (Nomic): Open source, good quality

**Chunking Guidelines**:
- Text: 200-400 tokens, ~10-20% overlap
- Code: By function or class (semantic boundaries)
- Overlap prevents splitting relevant context across chunk boundaries

---

## Vector Database Cheat Sheet

| DB | Best for | Hosting |
|----|---------|---------|
| Pinecone | Production, managed, no ops | Cloud only |
| Qdrant | Production, open source, Rust performance | Cloud or self-host |
| Weaviate | Full-text + semantic hybrid | Cloud or self-host |
| Chroma | Development and prototyping | Local |
| pgvector | Already using PostgreSQL | Self-host |
| Milvus | Very large scale (billions of vectors) | Self-host |

**Core Operations**:
- \`upsert\`: Store vectors with metadata
- \`query\`: Find K most similar vectors
- \`delete\`: Remove vectors by ID
- \`filter\`: Narrow search by metadata before similarity ranking

---

## RAG Cheat Sheet

**RAG Pipeline** (two phases):

Phase 1 — Indexing (one-time):
\`\`\`
Documents → Extract text → Chunk → Embed → Store in vector DB
\`\`\`

Phase 2 — Query (each user question):
\`\`\`
Query → Embed → Retrieve top-K chunks → Inject into prompt → LLM generates answer
\`\`\`

**RAG vs Fine-tuning**:
| Situation | Use |
|-----------|-----|
| Private/proprietary data | RAG |
| Data changes frequently | RAG |
| Need citations | RAG |
| Need specific writing style | Fine-tuning |
| Need to handle many examples efficiently | Fine-tuning |
| Need to reduce prompt length | Fine-tuning |

**RAG Debugging Checklist**:
1. Are the right chunks being retrieved? (log retrieved chunks)
2. Is retrieval quality the problem? (check cosine similarity scores)
3. Is the answer in the retrieved context? (read the chunks manually)
4. Is the system prompt instructing the model to use context? ("Answer ONLY from the provided context")

---

## AI Agents Cheat Sheet

**Agent = LLM + Tools + Loop**

**The ReAct Loop**:
\`\`\`
Think → What do I need to do next? What tool should I use?
Act   → Call the tool
Observe → What did the tool return?
Repeat → Until goal is complete
\`\`\`

**Memory Types**:
| Type | What it is | Scope |
|------|-----------|-------|
| In-context | Conversation history | This session only |
| Working | Scratchpad for current task | This task only |
| External | Database lookup | Persistent across sessions |
| Knowledge | Embedded in model weights | Static (from training) |

**Tool Design Rules**:
1. Atomic: one tool does one thing
2. Descriptive: AI reads the description to decide when to use it
3. Safe: irreversible tools (send_email, delete_file) need confirmation
4. Inspectable: log every tool call and result

---

## Agentic AI Cheat Sheet

| Pattern | Use when |
|---------|---------|
| Single agent | Sequential tasks, simple goals |
| Orchestrator + workers | Tasks that can be delegated to specialists |
| Parallel agents | Independent tasks that can run simultaneously |
| Pipeline | Each stage's output feeds the next stage |

**Human-in-the-loop patterns**:
- Checkpoint: Pause before irreversible actions
- Review: Show plan before execution
- Exception: Auto-run unless something unusual happens
- Monitoring: Log everything for async review

**Agentic Safety Rules**:
1. Prefer reversible actions (write draft before sending)
2. Minimize scope of each tool (read-only by default)
3. Confirm before high-impact actions
4. Always set timeouts and maximum step counts
5. Maintain audit log of every action

---

## AI Architecture Cheat Sheet

**Standard AI Application Stack**:
\`\`\`
[Frontend] ← streams tokens → [Backend API]
                                     │
                     ┌───────────────┼──────────────────┐
                     ↓               ↓                  ↓
                  [LLM API]   [Vector DB]           [Tools]
                     │               │                  │
              (Anthropic)     (Pinecone/Chroma)   (your APIs,
                                                  web search,
                                                  databases)
\`\`\`

**Backend Responsibilities**:
- Auth and rate limiting (never trust client)
- Prompt assembly (combine system prompt + context + history + query)
- Cost tracking (log input/output tokens per user)
- Response streaming to client
- Error handling and retries

**What to Monitor**:
| Metric | Alert threshold |
|--------|----------------|
| Response latency (p99) | > 10 seconds |
| AI cost per user/day | > $0.10 per user |
| Error rate | > 1% |
| API availability | < 99.9% |

---

## AI Security Cheat Sheet

**Top Threats**:
1. **Prompt injection**: User payload overrides system instructions
2. **Data leakage**: System prompt or user data exposed
3. **Hallucination**: AI states false information confidently
4. **Jailbreaks**: Tricking model to bypass safety guidelines

**Defense Checklist**:
- [ ] System prompt does not contain secrets (API keys, passwords)
- [ ] User input is clearly delimited from instructions (XML tags)
- [ ] Anchor instruction appears AFTER user input: "Remember: only answer about X"
- [ ] Validate and sanitize AI output before using it in your system
- [ ] Rate limit per user (prevent abuse)
- [ ] Log all requests for audit
- [ ] Test with adversarial inputs before launch

---

## AI Evaluation Cheat Sheet

**Metrics**:
| Metric | What to measure |
|--------|----------------|
| Accuracy | Is the answer factually correct? |
| Relevance | Does it address what was asked? |
| Latency | Time to first token + time to complete |
| Cost | Input tokens + output tokens × price |
| User satisfaction | Thumbs up/down, session length, return visits |

**Evaluation Methods**:
- Human evaluation: Most accurate, expensive, slow
- LLM-as-judge: Scalable, automated, some bias toward verbose answers
- Golden dataset: Fixed test set with known correct answers, run on every change
- A/B testing: Compare two versions with real users

**LLM-as-judge prompt pattern**:
\`\`\`
"Rate this AI response on [dimension] from 1-5.
Question: [question]
Response: [response]
Return only a JSON: { 'score': number, 'reason': string }"
\`\`\`

---

## Interview Quick Reference

**What interviewers test**:
1. Can you explain AI concepts clearly? (conceptual depth)
2. Can you design systems? (AI architecture)
3. Can you write working code? (implementation)
4. Do you have good judgment? (tradeoffs, edge cases)
5. Have you built things? (projects, experience)

**Must-know answers**:

**Q: What is RAG and why use it?**
A: RAG grounds LLM responses in retrieved documents to handle private data and reduce hallucinations. Embed documents, store in vector DB, retrieve relevant chunks on each query, pass them as context to the LLM.

**Q: When do you fine-tune vs use RAG?**
A: RAG for private/changing data. Fine-tuning for style, format, or domain-specific behavior patterns the model needs to internalize permanently.

**Q: How do you handle hallucinations?**
A: RAG with "answer only from context" instruction, output validation, asking the model to cite sources, confidence scoring.

**Q: How do you make AI cost-efficient?**
A: Model routing (haiku for simple tasks), semantic caching, prompt optimization (fewer tokens), smart context truncation.

**Q: How do agents work?**
A: Think (LLM decides what tool to use) → Act (code executes the tool) → Observe (result fed back to LLM) → repeat until done.`,
  codeExamples: [
    {
      title: 'All-in-One AI Engineering Toolkit',
      code: `// Quick reference implementations — copy and adapt

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── 1. BASIC COMPLETION ─────────────────────────────────────────

async function complete(prompt: string, systemPrompt?: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt ?? 'You are a helpful assistant.',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// ─── 2. STREAMING COMPLETION ─────────────────────────────────────

async function stream(prompt: string, onToken: (token: string) => void) {
  const apiStream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  for await (const chunk of apiStream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onToken(chunk.delta.text);
    }
  }
}

// ─── 3. STRUCTURED OUTPUT ────────────────────────────────────────

async function extractJSON<T>(prompt: string, schema: string): Promise<T> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: \`Extract information and return ONLY valid JSON matching this schema: \${schema}. No explanation, no markdown, just JSON.\`,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
  return JSON.parse(text) as T;
}

// Usage:
// const result = await extractJSON<{ name: string; score: number }>(
//   "Product: Apple iPhone 15 (rating 4.5/5)",
//   '{ "name": string, "score": number }'
// );

// ─── 4. CONVERSATION WITH HISTORY ────────────────────────────────

type Message = { role: 'user' | 'assistant'; content: string };

async function chat(userMessage: string, history: Message[]) {
  const messages: Message[] = [...history.slice(-20), { role: 'user', content: userMessage }];
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages,
  });
  const reply = response.content[0].type === 'text' ? response.content[0].text : '';
  return { reply, updatedHistory: [...messages, { role: 'assistant' as const, content: reply }] };
}

// ─── 5. SIMPLE RAG ───────────────────────────────────────────────

async function ragQuery(userQuery: string, retrievedChunks: string[]): Promise<string> {
  const context = retrievedChunks
    .map((chunk, i) => \`[Source \${i + 1}]\n\${chunk}\`)
    .join('\n\n');

  return complete(
    \`Context:\n\${context}\n\nQuestion: \${userQuery}\`,
    'Answer the question using ONLY the provided context. If the answer is not in the context, say "I don\'t have information about that in my sources." Always cite which source (Source 1, Source 2, etc.) you used.'
  );
}

// ─── 6. TOOL USE / FUNCTION CALLING ─────────────────────────────

const tools: Anthropic.Tool[] = [
  {
    name: 'get_weather',
    description: 'Get current weather for a city. Use when the user asks about weather.',
    input_schema: {
      type: 'object' as const,
      properties: {
        city: { type: 'string', description: 'City name, e.g. "San Francisco"' },
        units: { type: 'string', enum: ['celsius', 'fahrenheit'], description: 'Temperature units' },
      },
      required: ['city'],
    },
  },
];

// Simulated tool execution
function executeTool(name: string, input: Record<string, unknown>): string {
  if (name === 'get_weather') {
    return JSON.stringify({ city: input.city, temp: 22, condition: 'sunny' });
  }
  return JSON.stringify({ error: 'Unknown tool' });
}

async function agentLoop(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userMessage }];

  for (let step = 0; step < 10; step++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools,
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock?.type === 'text' ? textBlock.text : '';
    }

    if (response.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = response.content
        .filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
        .map(toolUse => ({
          type: 'tool_result' as const,
          tool_use_id: toolUse.id,
          content: executeTool(toolUse.name, toolUse.input as Record<string, unknown>),
        }));

      messages.push({ role: 'user', content: toolResults });
    }
  }

  return 'Agent reached maximum steps without completing task.';
}

// ─── 7. RETRY WITH EXPONENTIAL BACKOFF ───────────────────────────

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('All retry attempts failed');
}

// Usage: const result = await withRetry(() => complete('Hello'));

// ─── 8. COST TRACKER ─────────────────────────────────────────────

const PRICING = {
  'claude-sonnet-4-6': { input: 3.0, output: 15.0 },        // per million tokens
  'claude-haiku-4-5-20251001': { input: 0.25, output: 1.25 },
};

function calculateCost(
  model: keyof typeof PRICING,
  inputTokens: number,
  outputTokens: number
): number {
  const { input, output } = PRICING[model];
  return (inputTokens * input + outputTokens * output) / 1_000_000;
}

// Usage:
// const response = await client.messages.create({ ... });
// const cost = calculateCost('claude-sonnet-4-6', response.usage.input_tokens, response.usage.output_tokens);`,
      explanation:
        'Eight production-ready utility functions covering every major AI engineering pattern: completion, streaming, structured output (JSON extraction), multi-turn conversation, basic RAG, tool use / agent loop, retry with exponential backoff, and cost calculation. Copy these into your projects as a starting point.',
    },
  ],
  commonMistakes: [
    'Using this cheat sheet as a substitute for understanding — use it as a memory aid AFTER you have learned the concepts, not as a shortcut around learning them',
    'Memorizing definitions without being able to apply them — for every concept here, ask yourself: can I implement it? Can I debug it? Can I explain when NOT to use it?',
    'Ignoring the cost and evaluation sections — these are what separate junior AI engineers from senior ones',
  ],
  interviewQuestions: [
    {
      question: 'Walk me through how you would build a RAG system from scratch.',
      answer:
        'Two phases. Phase 1 (Indexing, runs once): collect documents → extract text → chunk into 200-400 token segments with overlap → embed each chunk using text-embedding-3-small → store vectors + metadata in Pinecone or Chroma. Phase 2 (Query, runs for each user question): embed the user query → query vector DB for top-3 similar chunks → build prompt with system instruction + retrieved chunks + user question → call LLM → return answer with citations. Key decisions: chunk size (400 tokens balances retrieval precision vs context richness), top-k (3-5 chunks is the sweet spot), and the system prompt must say "answer only from the provided context" to prevent hallucinations.',
      difficulty: 'intermediate',
    },
    {
      question: 'Explain how AI agents work and what makes them different from chatbots.',
      answer:
        'A chatbot responds to a single message. An agent takes a goal and autonomously decides what actions to take to achieve it, using tools, and iterating until done. The core mechanism is the ReAct loop: Think (LLM reasons about what to do next and which tool to use), Act (your code executes the tool), Observe (tool result is fed back to the LLM), repeat. The LLM is the brain — it decides what to do. Your code is the hands — it actually executes the actions. This separation means agents can interact with real systems (APIs, databases, file systems) while the LLM handles reasoning. Key engineering challenges: safety (irreversible actions need confirmation), reliability (error handling when tools fail), and context management (long agent runs accumulate lots of history).',
      difficulty: 'intermediate',
    },
    {
      question:
        "You're in charge of AI costs for a startup spending $5,000/month. How do you reduce it?",
      answer:
        'Start by auditing: which requests are costing the most? Break down by (a) request volume, (b) model tier, (c) tokens per request. The three highest-ROI levers: (1) Model routing — if 60% of requests are simple Q&A or short tasks, route them to Haiku (10x cheaper than Sonnet) using a classifier. (2) Semantic caching — embed queries, store in Redis with a vector index, check for cache hits (>0.95 cosine similarity) before calling the API. A product with many users often achieves 20-40% cache hit rate. (3) Token reduction — audit system prompts; most have 20-30% redundant text. Set max_tokens to realistic values (not 4096 for short answers). Combined, these typically achieve 50-70% cost reduction. On a $5K/month spend, that is $2,500-$3,500 savings.',
      difficulty: 'advanced',
    },
  ],
  exercises: [
    {
      id: 'rapid-fire-review',
      title: 'Rapid Fire Self-Assessment',
      description:
        'For each concept, rate yourself 1-3 (1=can explain it, 2=can implement it, 3=can debug and optimize it). Then revisit the lesson for any concept rated 1.',
      starterCode: `// Self-assessment — fill in your ratings (1, 2, or 3) and notes

const selfAssessment = {
  // Foundations
  "What are tokens and why do they matter?": { rating: 0, notes: "" },
  "How does a context window work?": { rating: 0, notes: "" },
  "Why do LLMs hallucinate?": { rating: 0, notes: "" },
  "Temperature and when to use 0 vs 0.7 vs 1.0": { rating: 0, notes: "" },

  // APIs and Prompting
  "Write a production-quality system prompt": { rating: 0, notes: "" },
  "Implement streaming in a Next.js API route": { rating: 0, notes: "" },
  "Design a few-shot prompt with 3 examples": { rating: 0, notes: "" },
  "Defend against prompt injection": { rating: 0, notes: "" },

  // RAG
  "Explain the RAG pipeline (both phases)": { rating: 0, notes: "" },
  "Choose chunk size for a technical documentation site": { rating: 0, notes: "" },
  "Debug why RAG is returning wrong answers": { rating: 0, notes: "" },
  "Choose between Pinecone, Chroma, and pgvector": { rating: 0, notes: "" },

  // Agents and Tools
  "Implement the ReAct agent loop": { rating: 0, notes: "" },
  "Design tool definitions the AI will use correctly": { rating: 0, notes: "" },
  "Decide when to use multi-agent vs single-agent": { rating: 0, notes: "" },
  "Add safety guardrails to an agent with delete/send tools": { rating: 0, notes: "" },

  // Architecture and Production
  "Design the architecture for an AI SaaS product": { rating: 0, notes: "" },
  "Implement model routing for cost optimization": { rating: 0, notes: "" },
  "Build an evaluation test suite for an AI feature": { rating: 0, notes: "" },
  "Calculate cost for 10,000 requests/day": { rating: 0, notes: "" },

  // Interview
  "Answer: What is RAG and why use it?": { rating: 0, notes: "" },
  "Answer: RAG vs fine-tuning — when to use each": { rating: 0, notes: "" },
  "Answer: Design an AI customer support system": { rating: 0, notes: "" },
  "Answer: How do you handle hallucinations in production?": { rating: 0, notes: "" },
};

// Score interpretation:
// 1 = Know the concept, revisit the lesson
// 2 = Can implement it, good — practice builds confidence
// 3 = Can debug and optimize, interview ready

// Areas rated 1 (need review):
const needsReview = Object.entries(selfAssessment)
  .filter(([_, v]) => v.rating === 1)
  .map(([k]) => k);

console.log("Review these lessons:", needsReview);`,
      solution: `// SAMPLE COMPLETED ASSESSMENT (after completing the full track)

const selfAssessment = {
  "What are tokens and why do they matter?": {
    rating: 3,
    notes: "Tokens control cost (priced per token) and context limits. 4 chars ≈ 1 token. Know how to calculate cost.",
  },
  "How does a context window work?": {
    rating: 3,
    notes: "All text the model can 'see' at once. 200K tokens for Claude. Must manage history + context size explicitly.",
  },
  "Why do LLMs hallucinate?": {
    rating: 2,
    notes: "Predict next likely token, not retrieve facts. Fix with RAG + 'answer only from context' instruction.",
  },
  "Temperature and when to use 0 vs 0.7 vs 1.0": {
    rating: 3,
    notes: "0=factual/deterministic, 0.7=balanced, 1.0=creative/varied. Use 0 for extraction and structured output.",
  },
  "Write a production-quality system prompt": {
    rating: 3,
    notes: "Role + Context + Instructions (numbered) + Constraints + Format. Always specify output format.",
  },
  "Implement streaming in a Next.js API route": {
    rating: 2,
    notes: "Use ReadableStream with SSE format. Can implement but need to reference the streaming example.",
  },
  "Design a few-shot prompt with 3 examples": {
    rating: 3,
    notes: "Input/Output pairs that show the model exactly what format/style you want.",
  },
  "Defend against prompt injection": {
    rating: 2,
    notes: "XML delimiters, anchor instruction after user input, explicit security rules section in system prompt.",
  },
  "Explain the RAG pipeline (both phases)": {
    rating: 3,
    notes: "Indexing: chunk → embed → store. Query: embed query → retrieve top-K → inject context → generate.",
  },
  "Choose chunk size for a technical documentation site": {
    rating: 3,
    notes: "400 tokens with 50-token overlap. For code docs: split by function/section headers.",
  },
  "Debug why RAG is returning wrong answers": {
    rating: 2,
    notes: "Log retrieved chunks first. Check semantic mismatch, chunk size, top-k. Then check generation step.",
  },
  "Choose between Pinecone, Chroma, and pgvector": {
    rating: 3,
    notes: "Chroma=dev, Pinecone=managed production, pgvector=already using Postgres.",
  },
  "Implement the ReAct agent loop": {
    rating: 3,
    notes: "Loop: LLM call → if tool_use: execute tool → add result → loop. Stop on end_turn.",
  },
  "Design tool definitions the AI will use correctly": {
    rating: 3,
    notes: "Clear name, precise description, explicit required parameters, example usage in description.",
  },
  "Decide when to use multi-agent vs single-agent": {
    rating: 3,
    notes: "Multi-agent when tasks can run in parallel. Single-agent for sequential tasks. Multi for specialization.",
  },
  "Add safety guardrails to an agent with delete/send tools": {
    rating: 2,
    notes: "Classify tools by reversibility. Add human confirmation for irreversible. Log all actions.",
  },
  "Design the architecture for an AI SaaS product": {
    rating: 2,
    notes: "Frontend → Backend API (auth/rate limit) → LLM layer → Vector DB → Tools → Monitoring.",
  },
  "Implement model routing for cost optimization": {
    rating: 3,
    notes: "Classify request complexity → route simple to Haiku, complex to Sonnet. 10x cost difference.",
  },
  "Build an evaluation test suite for an AI feature": {
    rating: 2,
    notes: "Golden dataset + LLM-as-judge + run on every deploy. Catch regressions before users do.",
  },
  "Calculate cost for 10,000 requests/day": {
    rating: 3,
    notes: "tokens × (input_price + output_price) / 1M. Sonnet: $3/M input, $15/M output.",
  },
  "Answer: What is RAG and why use it?": {
    rating: 3,
    notes: "Grounds LLM in retrieved docs. Use for private data, reducing hallucinations, needing citations.",
  },
  "Answer: RAG vs fine-tuning — when to use each": {
    rating: 3,
    notes: "RAG=private/changing data. Fine-tuning=style/format/domain behavior the model needs to internalize.",
  },
  "Answer: Design an AI customer support system": {
    rating: 2,
    notes: "Intent classification → RAG on knowledge base → escalation for complex/sensitive cases.",
  },
  "Answer: How do you handle hallucinations in production?": {
    rating: 3,
    notes: "RAG with context-only instruction, output validation, citation requirement, eval with human review.",
  },
};`,
      hints: [
        'Be honest with your ratings — overrating yourself leads to gaps in real interviews',
        'A rating of 2 (can implement) is the target for most concepts before interviewing',
        'Focus revision time on concepts rated 1 in architecture and agent design — those are the most common interview topics',
        'Rating 3 for cost calculation and evaluation shows maturity that juniors often lack — study those sections',
      ],
    },
  ],
  keyTakeaways: [
    'AI engineering is a skill, not a certificate — what you can build matters more than what you can define',
    'The most valuable combination: understand the fundamentals deeply enough to debug anything, and know the production patterns well enough to ship confidently',
    'RAG, agents, and architecture are the three topics that appear in every AI engineering interview — know them cold',
    'Cost awareness is what separates junior from senior AI engineers — always know how much your feature costs per user',
    'Security and evaluation are what separate shipped products from toys — add them from day one, not as an afterthought',
    'The cheat sheets here are memory aids, not a substitute for building real things — go build the projects',
  ],
  prevLesson: 'practice-hub',
};
