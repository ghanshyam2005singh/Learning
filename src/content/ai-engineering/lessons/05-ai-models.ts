import type { Lesson } from '@/types';

export const aiModelsLesson: Lesson = {
  id: 'ai-models',
  slug: 'ai-models',
  title: 'AI Models — Open Source vs Closed, Local vs Cloud',
  description:
    'Understand the landscape of AI models: open source vs closed source, small vs large, local vs cloud — when to use each and why it matters for the products you build.',
  category: 'Core Concepts',
  order: 5,
  difficulty: 'beginner',
  estimatedTime: 30,
  content: `When you decide to add AI to your application, you face an immediate decision: which model? The ecosystem has dozens of options across two major categories — closed source models from AI companies, and open source models you can run yourself.

This module gives you the framework to make that decision correctly.

---

## Closed Source Models

Closed source models are proprietary — the weights and training details are not public. You access them via API and pay per token.

**Examples**:
- **GPT-4o / GPT-4o-mini** (OpenAI)
- **Claude 3.5 Sonnet / Haiku** (Anthropic)
- **Gemini 1.5 Pro / Flash** (Google)
- **Command R+** (Cohere)

\`\`\`
CLOSED SOURCE MODEL FLOW

  Your app
     │
     │  API request (your prompt)
     │
     ▼
  AI Company's servers
  (model weights are private,
  running on their GPU clusters)
     │
     │  API response (generated text)
     │
     ▼
  Your app displays result

  You pay per token. You never see the model. You trust the provider.
\`\`\`

**Advantages**:
- State-of-the-art capability — frontier models are almost always closed source
- No infrastructure to manage — just an API call
- Constantly updated — providers improve models without you doing anything
- Scalable instantly — handles any volume
- SLA guarantees from providers

**Disadvantages**:
- Data goes to third party — privacy concerns for sensitive data
- Ongoing cost per token — expensive at high volume
- Vendor lock-in — switching providers requires code changes
- No customization of model weights
- Dependent on provider uptime

---

## Open Source Models

Open source models have publicly available weights. You download them, run them on your own hardware (or cloud), and no one else sees your data.

**Examples**:
- **Llama 3 (Meta)** — 8B, 70B, 405B variants
- **Mistral 7B / Mixtral** (Mistral AI)
- **Phi-3 (Microsoft)** — small but surprisingly capable
- **Gemma 2 (Google)** — efficient open model
- **Qwen 2.5 (Alibaba)** — strong multilingual

\`\`\`
OPEN SOURCE MODEL FLOW

  Your app
     │
     │  Direct call (no external API)
     │
     ▼
  Your infrastructure
  (model weights downloaded, running
  on your GPU / CPU)
     │
     │  Generated text (local)
     │
     ▼
  Your app displays result

  You manage the infrastructure. Your data never leaves your system.
\`\`\`

**Advantages**:
- Full data privacy — data never leaves your infrastructure
- No per-token cost (after hardware cost)
- Full customization — fine-tune the weights on your own data
- No vendor dependency
- Offline capable — works without internet

**Disadvantages**:
- Generally less capable than frontier closed models (though gap is closing)
- You manage the infrastructure — DevOps complexity
- GPU hardware is expensive
- Slower to update — you manage model versions
- Scaling requires engineering effort

---

## Small Models vs Large Models

Within both categories, models range from tiny (billions of parameters) to enormous (hundreds of billions).

\`\`\`
MODEL SIZE SPECTRUM

  Small (1B–8B params)      Medium (13B–70B params)     Large (70B+ params)
  ────────────────────────────────────────────────────────────────────────
  Fast inference             Balanced capability          Highest capability
  Cheap to run               Moderate cost                Most expensive
  Can run on consumer GPU    Needs good GPU               Needs multiple GPUs
  Great for simple tasks     Most use cases               Complex reasoning
  Examples:                  Examples:                    Examples:
  Phi-3 mini                 Llama 3 8B                   Claude 3.5 Sonnet
  Llama 3.2 1B               Mistral 7B                   GPT-4o
  Claude Haiku               Gemma 7B                     Llama 3 405B
\`\`\`

**Size does not always determine capability for your task**. A small model fine-tuned on your domain data can outperform a general large model on your specific task.

**Rule of thumb**:
- Simple classification, extraction, summarization → Small model (faster, cheaper)
- Complex reasoning, code generation, nuanced writing → Large model
- High volume production → Start with smallest model that meets quality bar

---

## Local Models vs Cloud Models

### Cloud Models

Cloud models run on the provider's infrastructure. You call an API.

**When to use cloud**:
- Need frontier capability
- Cannot manage GPU infrastructure
- Variable workload (scale up/down automatically)
- Starting a new project (fastest path to production)
- Occasional queries (low volume)

**Cost model**: Pay per token used. No upfront cost.

### Local Models

Local models run on your own hardware — either on your laptop/desktop or on your own cloud servers.

**When to use local**:
- Privacy requirements (legal, medical, financial — data cannot leave your control)
- High volume where per-token costs outweigh infrastructure costs
- Air-gapped environments (no internet access)
- Need to fine-tune on proprietary data
- Latency requirements that cloud API cannot meet

**Cost model**: Infrastructure cost (GPU rental or purchase). Zero marginal cost per query.

\`\`\`
CLOUD vs LOCAL — BREAK-EVEN ANALYSIS

  Cloud (API):
    Cost = $0.003 per 1K input tokens
    1 million queries × 1K tokens = $3,000/month

  Local (self-hosted Llama 70B on AWS):
    GPU instance: ~$5/hr (g5.12xlarge)
    = ~$3,600/month

  Break-even: roughly 1 million queries/month
  Below that: cloud is cheaper
  Above that: local may be cheaper (check your actual token counts)
\`\`\`

---

## Serving Open Source Models

If you run open source models, you need infrastructure to serve them:

**Options**:

| Option | What It Is | Best For |
|--------|-----------|---------|
| Ollama | Local model runner (Mac/Linux/Windows) | Development, testing |
| HuggingFace Inference Endpoints | Managed hosting for open models | Easy deployment without DevOps |
| vLLM | High-performance model server | Production, high throughput |
| Together AI | Cloud API for open source models | API convenience without vendor lock-in |
| Replicate | Deploy and call open models via API | Quick experimentation |

\`\`\`bash
# Run Llama 3 locally with Ollama (development)
ollama run llama3

# Pull a specific model
ollama pull llama3:8b

# Ollama exposes an OpenAI-compatible API at localhost:11434
# So you can use it with the OpenAI SDK (just change the base URL)
\`\`\`

---

## Decision Framework

\`\`\`
HOW TO CHOOSE A MODEL

  Question 1: Is data privacy a hard requirement?
  ├── YES → Open source, self-hosted (Llama, Mistral)
  └── NO → Continue

  Question 2: What is the task complexity?
  ├── Simple (classification, extraction, short summaries)
  │   └── Small model: Claude Haiku, GPT-4o-mini, Llama 3 8B
  └── Complex (reasoning, code, long docs, nuanced writing)
      └── Large model: Claude 3.5 Sonnet, GPT-4o

  Question 3: What is the volume?
  ├── Low volume → Cloud API (no infra overhead)
  └── High volume → Compare API cost vs self-hosted cost

  Question 4: Do you need customization?
  ├── YES → Fine-tune open source model
  └── NO → Closed source API with prompt engineering

  Question 5: What is your context length requirement?
  ├── Very long (books, codebases) → Claude (200K) or Gemini (1M)
  └── Standard → Any frontier model
\`\`\`

---

## The Current Model Landscape (2025)

The AI model landscape moves fast. What is true today changes in months. But some useful anchors:

**For most production apps**: Claude 3.5 Sonnet or GPT-4o for quality; Claude Haiku or GPT-4o-mini for cost efficiency

**For privacy-first**: Llama 3 70B self-hosted (via Ollama locally, vLLM in production)

**For very long documents**: Claude with 200K context

**For image + text tasks**: GPT-4o or Claude 3.5 Sonnet (both multimodal)

**For coding specifically**: Claude 3.5 Sonnet tends to perform best on code tasks as of 2025

**For local development/testing**: Ollama with Llama 3 8B — runs on most modern laptops

---

## Embeddings Models (A Different Category)

Separate from chat/completion models, there are **embedding models** — models that convert text into numerical vectors rather than generating text.

You use embedding models for:
- Semantic search
- RAG (Retrieval Augmented Generation)
- Similarity comparison
- Clustering documents

Examples: \`text-embedding-3-small\` (OpenAI), \`voyage-3\` (Voyage AI), \`nomic-embed-text\` (open source via Ollama)

We cover embeddings in depth in Module 8.`,
  codeExamples: [
    {
      title: 'Using Different Model Providers with Consistent Code',
      code: `// Anthropic (Claude)
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function askClaude(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

// ---

// OpenAI (GPT-4o)
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askGPT(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });
  return response.choices[0].message.content ?? '';
}

// ---

// Local Ollama (Llama 3) — uses OpenAI-compatible API
const ollamaClient = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // required but ignored
});

async function askLlama(prompt: string): Promise<string> {
  const response = await ollamaClient.chat.completions.create({
    model: 'llama3',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });
  return response.choices[0].message.content ?? '';
}

// ---

// Unified interface — swap models easily
type Provider = 'claude' | 'gpt4o' | 'llama3';

async function ask(prompt: string, provider: Provider = 'claude'): Promise<string> {
  switch (provider) {
    case 'claude': return askClaude(prompt);
    case 'gpt4o': return askGPT(prompt);
    case 'llama3': return askLlama(prompt);
  }
}`,
      explanation:
        'Anthropic and OpenAI have different SDK interfaces. Ollama runs locally but exposes an OpenAI-compatible API, making it a drop-in replacement during development. Building a unified interface lets you swap models easily — useful for cost optimization and benchmarking.',
    },
  ],
  commonMistakes: [
    'Using a large expensive model for every task — simple tasks like classification or short summarization work fine on small models at 10x lower cost',
    'Ignoring privacy requirements — sending sensitive user data to a cloud API without legal review can violate GDPR, HIPAA, or contractual obligations',
    'Not benchmarking on your actual task — generic AI benchmarks do not always predict performance on your specific use case; always test with your real data',
    'Running open source models on CPU — LLMs on CPU are 10-100x slower than on GPU; always use GPU for production',
    'Assuming open source is always cheaper — at low volume, API costs are far less than GPU infrastructure; run the math before switching',
    'Switching providers without a wrapper — hardcoding to a specific provider SDK makes migration painful; build a thin abstraction layer early',
  ],
  interviewQuestions: [
    {
      question: 'When would you choose an open source model over a closed source API?',
      answer:
        'Three main situations: (1) Data privacy — if data is sensitive (medical, legal, financial) and cannot leave your infrastructure, open source self-hosted is the only option; (2) High volume — at sufficient request volume, infrastructure cost for self-hosted models becomes cheaper than per-token API pricing; (3) Customization — when you need to fine-tune model weights on proprietary data, open source is necessary. For most early-stage products, closed source APIs are faster to build with and cost-effective at low-to-medium volume.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you choose between a small model and a large model?',
      answer:
        'Start with task complexity: simple, well-defined tasks (classification, extraction, short summaries) run well on small models like Claude Haiku or GPT-4o-mini at much lower cost. Complex tasks requiring multi-step reasoning, nuanced writing, or code generation need large models like Claude 3.5 Sonnet or GPT-4o. The practical approach: benchmark both on your actual task with your real data. The smallest model that meets your quality bar is the right choice.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is Ollama and when would you use it?',
      answer:
        'Ollama is a tool that lets you run open source LLMs locally on your machine (Mac, Linux, Windows). It exposes an OpenAI-compatible API at localhost, so you can use the OpenAI SDK to talk to local Llama, Mistral, or Gemma models. Use it for: development and testing without API costs, building privacy-sensitive features where data cannot leave the machine, offline environments, or prototyping with different open source models. Not suitable for production unless you have proper GPU infrastructure — local consumer hardware is too slow for production traffic.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'model-selection-exercise',
      title: 'Choose the Right Model for Each Scenario',
      description:
        'For each product scenario, recommend a model and explain why. Consider cost, privacy, capability, and context length. There is no single right answer — what matters is your reasoning.',
      starterCode: `// For each scenario, fill in your recommendation

const scenarios = [
  {
    scenario: "A healthcare startup wants to summarize patient medical records. Records contain full patient names, diagnoses, and treatment history.",
    recommendedApproach: "", // Which model / approach?
    reasoning: "", // Why?
    keyConstraint: "", // What drove your decision?
  },
  {
    scenario: "A startup is building a customer support chatbot. They expect 100 queries/day to start, growing to 10,000/day in 6 months. Most questions are simple FAQ-style.",
    recommendedApproach: "",
    reasoning: "",
    keyConstraint: "",
  },
  {
    scenario: "A developer tools company wants to build an AI code reviewer that analyzes entire codebases (50,000+ lines) and suggests improvements.",
    recommendedApproach: "",
    reasoning: "",
    keyConstraint: "",
  },
  {
    scenario: "A content marketing agency wants to generate first drafts of blog posts from outlines. They will send 10,000 posts/month.",
    recommendedApproach: "",
    reasoning: "",
    keyConstraint: "",
  },
  {
    scenario: "A startup building in an emerging market where internet connectivity is unreliable wants to offer an offline AI writing assistant.",
    recommendedApproach: "",
    reasoning: "",
    keyConstraint: "",
  },
];`,
      solution: `const scenarios = [
  {
    scenario: "A healthcare startup wants to summarize patient medical records.",
    recommendedApproach: "Open source model (Llama 3 70B) self-hosted on HIPAA-compliant infrastructure",
    reasoning: "Medical data is protected under HIPAA. Sending patient records to a third-party API like OpenAI or Anthropic requires a Business Associate Agreement (BAA) and carries legal risk. Self-hosted open source eliminates this risk. Llama 3 70B is capable enough for medical summarization.",
    keyConstraint: "Data privacy / HIPAA compliance",
  },
  {
    scenario: "Customer support chatbot, 100→10,000 queries/day, simple FAQ-style.",
    recommendedApproach: "Claude Haiku or GPT-4o-mini (cloud API)",
    reasoning: "Simple FAQ questions do not need a large frontier model. At 10K queries/day with ~1K tokens per query = 10M tokens/day. At $0.00025/1K tokens (Haiku pricing) = $2.50/day = $75/month. Very affordable. Small model meets quality bar for simple questions. Cloud API avoids infra overhead while scaling.",
    keyConstraint: "Cost efficiency at scale",
  },
  {
    scenario: "AI code reviewer that analyzes entire codebases (50,000+ lines).",
    recommendedApproach: "Claude 3.5 Sonnet with 200K token context window",
    reasoning: "50,000 lines of code ≈ 150,000–200,000 tokens. Most models have smaller context windows. Claude's 200K context is the only way to fit a large codebase in a single context. For a code review task, quality matters — Claude 3.5 Sonnet is excellent at code analysis.",
    keyConstraint: "Context window length + code quality",
  },
  {
    scenario: "10,000 blog post first drafts per month.",
    recommendedApproach: "GPT-4o-mini or Claude Haiku, or fine-tuned open source model",
    reasoning: "At scale, per-token cost matters. First drafts do not require frontier quality — a smaller model produces good enough first drafts. 10K posts × 1000 tokens output = 10M output tokens/month. At $0.001/1K tokens (mini pricing) = $10/month. Alternatively, fine-tune Llama 3 8B on your brand voice for consistent style at near-zero marginal cost.",
    keyConstraint: "Cost at high volume + consistency of brand voice",
  },
  {
    scenario: "Offline AI writing assistant for unreliable connectivity markets.",
    recommendedApproach: "Local open source model (Llama 3.2 1B or Phi-3 mini via Ollama or similar embedded runtime)",
    reasoning: "No internet = no cloud API. Must run on-device. Llama 3.2 1B and Phi-3 mini are small enough to run on mobile devices and laptops without GPU. Writing assistance is a good fit for small models — not complex reasoning, mostly generation.",
    keyConstraint: "Offline / no internet required",
  },
];`,
      hints: [
        'Privacy requirements (healthcare, legal, finance) often force you toward self-hosted regardless of capability',
        'Calculate actual token costs before assuming cloud is too expensive — it is often far cheaper than infrastructure',
        'Context window is a hard constraint — if your content does not fit, the model cannot process it',
        'Small models are dramatically cheaper and often good enough for simple tasks; do not default to frontier models',
      ],
    },
  ],
  keyTakeaways: [
    'Closed source models (Claude, GPT-4, Gemini) offer best-in-class capability via API but cost per token and send data to third parties',
    'Open source models (Llama, Mistral) give you privacy and cost control at the cost of infrastructure complexity',
    'Small models handle simple tasks well at 5-10x lower cost — use the smallest model that meets your quality bar',
    'Local models (via Ollama) are ideal for development and for privacy-sensitive or offline use cases',
    'Cloud APIs win for low-to-medium volume; self-hosted wins for high volume with tight privacy requirements',
    'The model landscape moves fast — abstract your model calls behind a thin wrapper to switch providers without code surgery',
  ],
  nextLesson: 'apis-and-ai',
  prevLesson: 'large-language-models',
};
