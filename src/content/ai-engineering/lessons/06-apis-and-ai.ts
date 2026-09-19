import type { Lesson } from '@/types';

export const apisAndAILesson: Lesson = {
  id: 'apis-and-ai',
  slug: 'apis-and-ai',
  title: 'AI APIs — Connecting Your App to AI',
  description:
    'Understand how AI APIs work, how to authenticate, how requests and responses flow, what costs look like, how to handle rate limits, and how to use them correctly in production.',
  category: 'Building with AI',
  order: 6,
  difficulty: 'beginner',
  estimatedTime: 40,
  content: `The fastest way to add AI to your application is through an API. You send a request, you get a response — the same pattern as any other API you have used. But AI APIs have some unique characteristics: they cost money per call, they have rate limits, they stream responses, and the response shape is different from what you might expect.

This module teaches you everything you need to use AI APIs correctly in production.

---

## What Is an AI API?

An AI API is an HTTP endpoint that accepts text (and sometimes images or audio) and returns AI-generated output.

\`\`\`
AI API — BASIC FLOW

  Your Application
       │
       │  HTTP POST request
       │  Headers: { Authorization: "Bearer sk-..." }
       │  Body: { model, messages, max_tokens, ... }
       │
       ▼
  AI Provider's Servers
  (Anthropic, OpenAI, Google)
       │
       │  Model runs inference
       │  Generates response tokens
       │
       ▼
  HTTP Response
  Body: { content: [{text: "..."}], usage: {...} }
       │
       ▼
  Your Application processes the response
\`\`\`

Every major AI provider exposes this via an HTTP API. You can call it with \`fetch\`, \`axios\`, or the provider's official SDK. The SDK is just a typed wrapper around these HTTP calls.

---

## Authentication and API Keys

AI APIs use API keys for authentication. The key is passed in the \`Authorization\` header.

\`\`\`
AUTHENTICATION FLOW

  1. You sign up on provider website (anthropic.com, openai.com, etc.)
  2. You create an API key in the dashboard
  3. You store the key securely (environment variable, secrets manager)
  4. Every API request includes the key in the Authorization header

  Header format:
  Anthropic:  x-api-key: sk-ant-api03-...
  OpenAI:     Authorization: Bearer sk-...
  Google:     x-goog-api-key: AIza...
\`\`\`

**Critical security rules**:
- Never hardcode API keys in source code
- Never commit API keys to Git (even in private repos)
- Use environment variables locally (\`process.env.ANTHROPIC_API_KEY\`)
- Use secrets managers in production (AWS Secrets Manager, Vercel environment variables, Railway)
- Rotate keys if they are ever exposed

\`\`\`bash
# .env file (local development — add to .gitignore)
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
OPENAI_API_KEY=sk-your-key-here

# Never commit this file to Git
# Add to .gitignore:
.env
.env.local
\`\`\`

---

## Request Structure

Every AI API call has a common structure, even if the field names differ slightly between providers.

### Anthropic API Request

\`\`\`json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "system": "You are a helpful assistant.",
  "messages": [
    { "role": "user", "content": "What is the capital of France?" }
  ],
  "temperature": 0.7
}
\`\`\`

**Key fields**:
- \`model\`: Which model to use
- \`max_tokens\`: Maximum tokens to generate (controls cost ceiling + output length)
- \`system\`: The system prompt (instructions that set model behavior)
- \`messages\`: The conversation history and current message
- \`temperature\`: Randomness control (0 = deterministic, 1 = creative)

### OpenAI API Request

\`\`\`json
{
  "model": "gpt-4o",
  "max_tokens": 1024,
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "What is the capital of France?" }
  ],
  "temperature": 0.7
}
\`\`\`

OpenAI includes the system message inside the \`messages\` array with \`role: "system"\`, while Anthropic has a separate \`system\` field. This is a common source of confusion.

---

## Response Structure

### Anthropic API Response

\`\`\`json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "claude-sonnet-4-6",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 25,
    "output_tokens": 9
  }
}
\`\`\`

**Key response fields**:
- \`content\`: Array of content blocks (usually one \`text\` block)
- \`stop_reason\`: Why generation stopped (\`end_turn\` = natural completion, \`max_tokens\` = hit limit)
- \`usage\`: Token counts — critical for cost tracking

**Important**: The \`content\` field is an array because responses can include multiple types (text, tool use). Always access \`response.content[0]\` and check \`type === 'text'\` before accessing \`.text\`.

---

## Costs

AI API costs are usage-based. You pay per token.

\`\`\`
PRICING STRUCTURE (approximate — check provider websites for current pricing)

  Model                   Input               Output
  ─────────────────────────────────────────────────────────
  claude-sonnet-4-6       $3 / 1M tokens      $15 / 1M tokens
  claude-haiku-4-5        $0.25 / 1M tokens   $1.25 / 1M tokens
  gpt-4o                  $2.50 / 1M tokens   $10 / 1M tokens
  gpt-4o-mini             $0.15 / 1M tokens   $0.60 / 1M tokens
  gemini-1.5-pro          $3.50 / 1M tokens   $10.50 / 1M tokens
  gemini-1.5-flash        $0.075 / 1M tokens  $0.30 / 1M tokens

  Note: Output tokens are typically 3-5x more expensive than input tokens.
\`\`\`

**Cost calculation example**:
\`\`\`
User sends: "Explain recursion" (3 words ≈ 4 tokens)
System prompt: 200 tokens
Response: "Recursion is..." (200 tokens)

Input tokens: 200 (system) + 4 (message) = 204 tokens
Output tokens: 200 tokens

Cost (Sonnet): (204 × $3 / 1M) + (200 × $15 / 1M)
             = $0.000612 + $0.003
             = $0.003612 per call
             ≈ 0.36 cents per call

At 10,000 calls/month: ~$36/month
At 100,000 calls/month: ~$360/month
\`\`\`

**Cost optimization strategies**:
1. Use smaller models for simple tasks (Haiku is 10x cheaper than Sonnet)
2. Minimize system prompt length (you pay for system tokens on every call)
3. Set \`max_tokens\` appropriately — do not set 4096 if you need 200
4. Cache responses for repeated identical queries
5. Batch similar requests when possible

---

## Rate Limits

AI APIs impose rate limits to prevent abuse and ensure fair usage.

\`\`\`
RATE LIMIT TYPES

  RPM (Requests Per Minute)
  → Max number of API calls you can make per minute
  → Typically 50-1000 RPM depending on your tier

  TPM (Tokens Per Minute)
  → Max tokens (input + output) per minute
  → Typically 40,000-1,000,000 TPM depending on tier

  TPD (Tokens Per Day)
  → Some providers also have daily limits
\`\`\`

**What happens when you hit rate limits**:
- API returns HTTP 429 (Too Many Requests)
- Response includes \`Retry-After\` header telling you when to retry
- Your application must handle this gracefully

\`\`\`typescript
// Rate limit handling with exponential backoff
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (error instanceof Error && 'status' in error && (error as { status: number }).status === 429) {
        const waitMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(\`Rate limited. Waiting \${waitMs}ms before retry \${attempt + 1}\`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }
      throw error; // Re-throw non-rate-limit errors
    }
  }
  throw new Error('Max retries exceeded');
}
\`\`\`

---

## Streaming Responses

By default, the full response is returned after the model finishes generating. For long responses, users wait several seconds before seeing anything.

Streaming sends tokens to the client as they are generated — users see text appearing progressively, like typing.

\`\`\`
WITHOUT STREAMING                WITH STREAMING
─────────────────────────────────────────────────────
User sends request               User sends request
     ↓                                ↓
Model generates (5 seconds)     Model starts generating
     ↓                                ↓ (0.3s after request)
Full response arrives            First tokens arrive
User sees nothing for 5s        User sees "The..." appear
Then sees full response          Then "answer..." appears
                                 Text streams in like typing
                                 Much better UX for long responses
\`\`\`

---

## Production Usage Patterns

### Environment Setup

\`\`\`typescript
// config/ai.ts
export const aiConfig = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
    defaultModel: 'claude-sonnet-4-6' as const,
    defaultMaxTokens: 1024,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    defaultModel: 'gpt-4o' as const,
  },
};

// Validate at startup — fail fast if keys are missing
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}
\`\`\`

### Error Handling

\`\`\`typescript
// Anthropic errors have meaningful types
import Anthropic from '@anthropic-ai/sdk';

async function safeCall(prompt: string): Promise<string | null> {
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    const content = response.content[0];
    return content.type === 'text' ? content.text : null;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        console.error('Rate limited — implement retry logic');
      } else if (error.status === 401) {
        console.error('Invalid API key');
      } else if (error.status === 400) {
        console.error('Invalid request:', error.message);
      } else {
        console.error('API error:', error.status, error.message);
      }
    }
    return null;
  }
}
\`\`\``,
  codeExamples: [
    {
      title: 'Complete Production AI Client',
      code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Basic completion
async function complete(
  systemPrompt: string,
  userMessage: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> {
  const response = await client.messages.create({
    model: options.model ?? 'claude-sonnet-4-6',
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.7,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  return content.text;
}

// Streaming completion for better UX
async function streamComplete(
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void
): Promise<string> {
  let fullText = '';

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      fullText += chunk.delta.text;
      onChunk(chunk.delta.text); // Send to client in real-time
    }
  }

  return fullText;
}

// Track costs
async function completionWithCostTracking(
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; inputTokens: number; outputTokens: number; costUSD: number }> {
  const INPUT_COST = 3 / 1_000_000;  // $3 per million input tokens
  const OUTPUT_COST = 15 / 1_000_000; // $15 per million output tokens

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = response.content[0];
  const text = content.type === 'text' ? content.text : '';
  const { input_tokens, output_tokens } = response.usage;
  const costUSD = input_tokens * INPUT_COST + output_tokens * OUTPUT_COST;

  return { text, inputTokens: input_tokens, outputTokens: output_tokens, costUSD };
}`,
      explanation:
        'This covers three core production patterns: basic completion, streaming for UX, and cost tracking. In production you will want all three — basic for simple endpoints, streaming for chat UIs, and cost tracking for billing and monitoring.',
    },
    {
      title: 'Using AI API in a Next.js API Route',
      code: `// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const messages = [
      ...history,
      { role: 'user' as const, content: message },
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: 'You are a helpful assistant.',
      messages,
    });

    const content = response.content[0];
    const text = content.type === 'text' ? content.text : '';

    return NextResponse.json({
      message: text,
      usage: response.usage,
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Service is busy. Please try again.' },
          { status: 429 }
        );
      }
    }
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}`,
      explanation:
        'A production Next.js API route for AI chat. Key practices: validate input, pass conversation history for multi-turn context, handle API errors with user-friendly messages, and return token usage for monitoring.',
    },
  ],
  commonMistakes: [
    'Hardcoding API keys in source code — always use environment variables; leaked keys get abused and can cost thousands of dollars',
    'Not handling rate limits — production apps must implement exponential backoff retry logic for 429 errors',
    'Ignoring the usage field in responses — track token usage to monitor costs and catch unexpected spikes',
    'Not setting max_tokens appropriately — if max_tokens is too low, responses get cut off; if too high, you pay for unused capacity ceiling',
    'Calling AI APIs directly from the frontend — expose your API key to clients and anyone can use it; always proxy through your backend',
    'Not streaming for long responses — users abandon products with multi-second blank screens; stream whenever response length is unpredictable',
  ],
  interviewQuestions: [
    {
      question: 'How do you securely use AI API keys in a production application?',
      answer:
        'Never expose API keys to clients. Store them as environment variables server-side only. Use a secrets manager (AWS Secrets Manager, Vercel env vars) in production. Proxy all AI API calls through your backend — never call the AI API directly from the frontend JavaScript. Rotate keys on any suspected exposure. Set up spending limits and alerts in the provider dashboard so a leaked key cannot bankrupt you.',
      difficulty: 'beginner',
    },
    {
      question: 'What happens when you hit an AI API rate limit and how do you handle it?',
      answer:
        'When you hit rate limits, the API returns HTTP 429 with a Retry-After header indicating when you can retry. Handle this with exponential backoff: wait 1s, retry; if still 429, wait 2s; then 4s; etc. In production, also implement request queuing to avoid hitting rate limits in the first place — queue requests and send at a controlled rate. Consider upgrading your API tier if you consistently hit limits. Monitor rate limit errors as a metric to know when usage is outgrowing your tier.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is streaming in AI APIs and when should you use it?',
      answer:
        'Streaming sends generated tokens to the client as they are produced, rather than waiting for the full response. Without streaming, users see a blank screen for potentially 5-30 seconds on long responses. With streaming, they see text appearing token by token — much better UX. Use streaming whenever: (1) responses might be long (more than a sentence), (2) you have a chat-style interface, (3) the user is waiting for output. Use non-streaming when: you need the full response before doing something with it (like parsing JSON or making a decision based on the complete answer).',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'build-ai-api-wrapper',
      title: 'Build a Reusable AI API Client',
      description:
        'Build a production-ready AI client class that handles authentication, error handling, retry logic, and cost tracking. This is the foundation you will use in every AI application.',
      starterCode: `import Anthropic from '@anthropic-ai/sdk';

interface CompletionOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

interface CompletionResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
}

class AIClient {
  private client: Anthropic;
  private totalCostUSD = 0;
  private totalCalls = 0;

  constructor() {
    // TODO: Initialize Anthropic client
    // TODO: Validate that API key exists
  }

  async complete(
    userMessage: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    // TODO: Call the API with retry on rate limit
    // TODO: Calculate cost
    // TODO: Track total cost and calls
    // TODO: Return result

    return {
      text: '',
      inputTokens: 0,
      outputTokens: 0,
      costUSD: 0,
    };
  }

  getStats(): { totalCalls: number; totalCostUSD: number } {
    // TODO: Return usage stats
    return { totalCalls: 0, totalCostUSD: 0 };
  }
}

// Test it
const ai = new AIClient();
const result = await ai.complete("What is TypeScript?", {
  systemPrompt: "Answer in one sentence.",
  maxTokens: 100,
  temperature: 0,
});
console.log(result.text);
console.log(\`Cost: $\${result.costUSD.toFixed(6)}\`);
console.log(ai.getStats());`,
      solution: `import Anthropic from '@anthropic-ai/sdk';

interface CompletionOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

interface CompletionResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
}

const SONNET_INPUT_COST = 3 / 1_000_000;
const SONNET_OUTPUT_COST = 15 / 1_000_000;

class AIClient {
  private client: Anthropic;
  private totalCostUSD = 0;
  private totalCalls = 0;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async complete(
    userMessage: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: options.maxTokens ?? 1024,
          temperature: options.temperature ?? 0.7,
          ...(options.systemPrompt && { system: options.systemPrompt }),
          messages: [{ role: 'user', content: userMessage }],
        });

        const content = response.content[0];
        const text = content.type === 'text' ? content.text : '';
        const { input_tokens, output_tokens } = response.usage;
        const costUSD =
          input_tokens * SONNET_INPUT_COST +
          output_tokens * SONNET_OUTPUT_COST;

        this.totalCostUSD += costUSD;
        this.totalCalls += 1;

        return { text, inputTokens: input_tokens, outputTokens: output_tokens, costUSD };
      } catch (error) {
        if (error instanceof Anthropic.APIError && error.status === 429) {
          if (attempt < maxRetries - 1) {
            const waitMs = Math.pow(2, attempt) * 1000;
            await new Promise(r => setTimeout(r, waitMs));
            continue;
          }
        }
        throw error;
      }
    }

    throw new Error('Max retries exceeded');
  }

  getStats() {
    return {
      totalCalls: this.totalCalls,
      totalCostUSD: parseFloat(this.totalCostUSD.toFixed(6)),
    };
  }
}`,
      hints: [
        'Validate the API key in the constructor — fail fast at startup, not at runtime',
        'Exponential backoff: wait 1s after first 429, 2s after second, 4s after third',
        'Calculate cost using input_tokens and output_tokens from response.usage',
        'Track cumulative stats in class properties — useful for monitoring and billing',
      ],
    },
  ],
  keyTakeaways: [
    'AI APIs are HTTP endpoints — you POST a request with your prompt and receive generated text; the SDK is just a typed wrapper',
    'API keys must be stored as environment variables server-side — never expose them to clients',
    'Pay attention to token usage in responses — it is the basis for costs and tells you if context is growing too large',
    'Handle rate limits with exponential backoff — 429 errors are normal at scale, not failures',
    'Stream responses for long outputs — it dramatically improves perceived performance and user experience',
    'Always proxy AI API calls through your backend — calling AI APIs from frontend code exposes your keys',
  ],
  nextLesson: 'prompt-engineering',
  prevLesson: 'ai-models',
};
