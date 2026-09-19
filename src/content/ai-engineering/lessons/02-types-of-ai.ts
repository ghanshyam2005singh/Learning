import type { Lesson } from '@/types';

export const typesOfAILesson: Lesson = {
  id: 'types-of-ai',
  slug: 'types-of-ai',
  title: 'Types of AI',
  description:
    'Understand Narrow AI, General AI, Generative AI, Predictive AI, Conversational AI, and Agentic AI — what each type is, how it works, and where you encounter it in real products.',
  category: 'Foundations',
  order: 2,
  difficulty: 'beginner',
  estimatedTime: 30,
  content: `Not all AI is the same. When your email filters spam, that is AI. When ChatGPT writes code, that is AI. When a self-driving car navigates traffic, that is AI. But these are fundamentally different systems doing fundamentally different things.

Understanding the types of AI helps you choose the right approach for the problem you are solving — and helps you have intelligent conversations about AI in interviews and on teams.

---

## Narrow AI vs General AI vs Super AI

This is the most fundamental distinction in AI.

### Narrow AI (What exists today)

Narrow AI — also called Weak AI or Artificial Narrow Intelligence (ANI) — does one thing well. It is trained for a specific task and cannot transfer its skill to a different domain.

Examples:
- **Gmail spam filter**: excellent at classifying email as spam or not — cannot write code
- **AlphaGo**: the world's best Go player — cannot play chess
- **Face ID**: recognizes your face with extreme accuracy — cannot understand your voice
- **GPT-4**: exceptional at language tasks — cannot drive a car or play piano

Even the most impressive AI systems today — GPT-4, Claude, Gemini — are sophisticated Narrow AI. They are trained on text and are remarkably capable at language tasks. They do not have general understanding of the world the way humans do.

\`\`\`
NARROW AI — Each system is a specialist

   Spam Filter        Image Classifier      Language Model
   ┌─────────┐        ┌──────────────┐      ┌──────────────┐
   │  SPAM   │        │  CAT / DOG   │      │  TEXT TASKS  │
   │  OR NOT │        │  CLASSIFIER  │      │  ONLY        │
   └─────────┘        └──────────────┘      └──────────────┘
   Can't do images    Can't filter spam     Can't classify images
\`\`\`

### General AI (Does not exist yet)

Artificial General Intelligence (AGI) would be an AI system that can perform any intellectual task a human can — with the same flexibility and ability to transfer knowledge across domains.

A human who learns to play chess can then apply the strategic thinking to business negotiations. AGI would do the same thing. It would be able to learn a new task from minimal examples, the way humans can.

AGI does not exist. The timeline for when (or if) it will exist is genuinely uncertain. Researchers estimate anywhere from "never" to "within a decade." This is an open research problem.

**Why it matters to you**: Do not build products assuming AGI capabilities. Build with the Narrow AI tools that exist today.

### Super AI (Hypothetical)

Artificial Superintelligence (ASI) would surpass human intelligence across every domain — not just matching humans but exceeding them the way a calculator exceeds human arithmetic.

This is a theoretical concept. It does not exist. It is discussed in academic and philosophical contexts but has no bearing on what you build as a software engineer today.

\`\`\`
AI CAPABILITY LEVELS

  TODAY                       FUTURE (UNCERTAIN)
  ──────────────────────────────────────────────

  Narrow AI                   General AI (AGI)       Super AI (ASI)
  ┌─────────────┐             ┌─────────────┐        ┌─────────────┐
  │ Specialist  │             │  Generalist │        │  Exceeds    │
  │ in one area │     ?→      │  like human │  ??→   │  humans in  │
  │ (real now)  │             │ (not yet)   │        │ all domains │
  └─────────────┘             └─────────────┘        └─────────────┘
\`\`\`

---

## Generative AI

Generative AI creates new content — text, images, code, audio, video — rather than just analyzing or classifying existing content.

This is the category that exploded with ChatGPT in 2022.

**How it works (intuition)**: A generative model is trained to predict what comes next. A text model trained on billions of sentences learns that after "The capital of France is" the word "Paris" is overwhelmingly likely. After enough training, it can generate fluent, coherent text that sounds like it was written by a human.

**Real products using Generative AI**:

| Product | What It Generates |
|---------|------------------|
| ChatGPT | Text, code, analysis |
| Claude | Text, reasoning, documents |
| Midjourney | Images from text descriptions |
| GitHub Copilot | Code from comments/context |
| Suno | Music from text prompts |
| ElevenLabs | Voice audio from text |
| Runway | Video from text or images |

\`\`\`
GENERATIVE AI FLOW

  Prompt / Input
       │
       ▼
  ┌─────────────────────────────────┐
  │  Generative Model               │
  │  (trained to predict what       │
  │   should come next)             │
  └─────────────────────────────────┘
       │
       ▼
  Generated Output
  (text, image, code, audio, video)
\`\`\`

**Why it matters**: You will almost certainly build applications that use generative AI. The core pattern — send a prompt, get generated content back — is the foundation of AI Engineering.

---

## Predictive AI

Predictive AI analyzes patterns in existing data to make predictions about future or unknown outcomes. This is what most machine learning historically looked like before generative AI.

Predictive AI does not generate new content. It classifies, forecasts, or scores.

**Real products using Predictive AI**:

| Use Case | Prediction |
|----------|-----------|
| Credit scoring | Will this person repay a loan? |
| Fraud detection | Is this transaction fraudulent? |
| Recommendation engines | Will this user like this product? |
| Demand forecasting | How many units will sell this week? |
| Customer churn | Will this customer cancel their subscription? |
| Medical diagnosis support | Does this X-ray show signs of pneumonia? |

\`\`\`
PREDICTIVE AI FLOW

  Historical Data           New Input
  (past transactions,       (new transaction)
  labels: fraud/not)
       │                         │
       ▼                         ▼
  ┌──────────────────────────────────┐
  │  Trained Predictive Model        │
  │  (learned patterns from history) │
  └──────────────────────────────────┘
                    │
                    ▼
             Prediction + Confidence
             ("Fraud: 94% confidence")
\`\`\`

**When to use Predictive AI**: When you have historical data with outcomes (labels) and want to predict outcomes for new, unlabeled data.

---

## Conversational AI

Conversational AI enables natural language interaction — systems you can talk to or text with in plain English (or any language).

This includes:
- **Chatbots**: Customer support bots, FAQ bots (often rule-based, not truly AI)
- **Virtual Assistants**: Siri, Alexa, Google Assistant
- **LLM-powered chat**: ChatGPT, Claude, Gemini

The key distinction: early chatbots were rule-based ("if user says 'refund' then show refund options"). Modern conversational AI uses large language models that actually understand intent, context, and nuance.

\`\`\`
EVOLUTION OF CONVERSATIONAL AI

  Rule-Based Chatbot         Modern LLM Chat
  ─────────────────────────────────────────────
  User: "I want a refund"    User: "I ordered the wrong size"

  Bot scans for keyword      LLM understands intent
  "refund" → shows menu      → offers exchange/refund options
                             → asks for order details
                             → tailors response to context

  Brittle — breaks on        Flexible — handles nearly
  anything unexpected        any phrasing
\`\`\`

**Real examples**:
- **Intercom / Zendesk bots**: Customer support with LLM understanding real customer issues
- **Perplexity**: Conversational web search — ask a question, get a sourced answer in plain English
- **Character.AI**: Conversational characters with distinct personalities
- **Claude / ChatGPT**: General-purpose conversation for any task

---

## Agentic AI

Agentic AI is AI that can take actions in the world to accomplish multi-step goals — not just respond to a single question but plan, reason, use tools, and execute a sequence of steps.

This is the most important category for AI Engineering in 2024 and beyond.

**The difference**:
- **Chatbot**: "What is the weather in Mumbai?" → AI answers with text
- **Agent**: "Book me a flight to Mumbai for next Friday under $300" → AI searches flights, compares prices, handles booking steps, confirms with you

An agent can:
- Break a goal into steps
- Use tools (search the web, call APIs, write files, run code)
- Observe the result of each step
- Adjust its plan based on what it finds
- Loop until the goal is complete

\`\`\`
AGENTIC AI FLOW

  Goal: "Research competitors and write a summary report"
       │
       ▼
  ┌─────────────────────────────────────────────────────┐
  │  Agent (LLM + Planning + Tool Use)                  │
  │                                                     │
  │  Step 1: Search web for "top competitors in X"      │
  │  Step 2: Read and analyze each competitor's site    │
  │  Step 3: Extract pricing, features, positioning     │
  │  Step 4: Synthesize findings                        │
  │  Step 5: Write structured report                    │
  └─────────────────────────────────────────────────────┘
       │
       ▼
  Completed report (no human input needed between steps)
\`\`\`

**Real examples of Agentic AI**:
- **Cursor**: AI agent that can read your entire codebase, write code, run tests, fix errors — a multi-step coding workflow
- **Devin**: AI software engineer that can take a feature ticket and implement it end-to-end
- **Claude Code**: AI coding assistant that can read files, write code, run commands in your terminal
- **OpenAI Agents**: Build multi-step workflows where AI orchestrates tool calls

---

## Comparison Table

\`\`\`
AI TYPES SUMMARY

┌──────────────────┬───────────────────────────────┬───────────────────────────┐
│ Type             │ What It Does                  │ Example                   │
├──────────────────┼───────────────────────────────┼───────────────────────────┤
│ Narrow AI        │ One specific task very well   │ Spam filter, face ID      │
├──────────────────┼───────────────────────────────┼───────────────────────────┤
│ General AI (AGI) │ Any task humans can do        │ Does not exist yet        │
├──────────────────┼───────────────────────────────┼───────────────────────────┤
│ Generative AI    │ Creates new content           │ ChatGPT, Midjourney       │
├──────────────────┼───────────────────────────────┼───────────────────────────┤
│ Predictive AI    │ Forecasts outcomes from data  │ Fraud detection, churn    │
├──────────────────┼───────────────────────────────┼───────────────────────────┤
│ Conversational AI│ Natural language interaction  │ ChatGPT, Siri, Alexa      │
├──────────────────┼───────────────────────────────┼───────────────────────────┤
│ Agentic AI       │ Multi-step goal completion    │ Cursor, Devin, Claude Code│
└──────────────────┴───────────────────────────────┴───────────────────────────┘
\`\`\`

---

## Which Types You Will Work With

As a software engineer building AI applications, you will primarily work with:

**Generative AI** — for text generation, code generation, summarization, content creation
**Conversational AI** — for chatbots, assistants, question-answering interfaces
**Agentic AI** — for automating multi-step workflows, building autonomous assistants

Predictive AI is also important if you are building data-heavy products (fraud detection, recommendations, forecasting) — but the tooling and workflow differs (more scikit-learn and data pipelines than LLM APIs).

Narrow AI, AGI, and Super AI are more useful as mental models than as practical categories for what you build.`,
  codeExamples: [
    {
      title: 'Comparing AI Types in Code',
      code: `// PREDICTIVE AI: Classification — spam or not?
// This model outputs a probability score for existing categories
async function predictSpam(emailText: string): Promise<number> {
  // Returns probability 0-1 that email is spam
  // Model was trained on labeled spam/not-spam examples
  const response = await fetch('/api/spam-classifier', {
    method: 'POST',
    body: JSON.stringify({ text: emailText }),
  });
  const { spamProbability } = await response.json();
  return spamProbability; // e.g. 0.94
}

// ---

// GENERATIVE AI: Creates new content from a prompt
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

async function generateEmailReply(originalEmail: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: \`Write a professional reply to this email:\n\n\${originalEmail}\`,
      },
    ],
  });
  const content = message.content[0];
  return content.type === 'text' ? content.text : '';
}

// ---

// CONVERSATIONAL AI: Multi-turn dialogue with context
const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

async function chat(userMessage: string): Promise<string> {
  conversationHistory.push({ role: 'user', content: userMessage });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: 'You are a helpful customer support agent for an e-commerce store.',
    messages: conversationHistory,
  });

  const content = response.content[0];
  const assistantMessage = content.type === 'text' ? content.text : '';
  conversationHistory.push({ role: 'assistant', content: assistantMessage });
  return assistantMessage;
}

// Usage:
// await chat("I haven't received my order")
// await chat("My order number is #12345")
// await chat("It's been 10 days now")
// Each turn has full context of the previous conversation`,
      explanation:
        'Predictive AI returns a score or label for existing categories. Generative AI produces new content. Conversational AI maintains context across multiple turns of a dialogue. These are the three types you will use most as an AI engineer.',
    },
  ],
  commonMistakes: [
    'Confusing Generative AI with General AI — Generative AI creates content (exists today), General AI matches human flexibility (does not exist yet)',
    'Thinking ChatGPT is General AI — it is sophisticated Narrow AI, excellent at language but cannot generalize across domains the way humans can',
    'Building "agentic" features without proper error handling — agents take multiple steps and each step can fail; you need retry logic and human-in-the-loop checkpoints',
    'Using Generative AI when Predictive AI is the right tool — if you have labeled historical data and want to classify or forecast, train a predictive model rather than prompting an LLM',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between Generative AI and Predictive AI?',
      answer:
        'Predictive AI analyzes patterns in existing labeled data to predict outcomes for new data — it classifies, forecasts, or scores (e.g., spam detection, fraud detection, churn prediction). Generative AI creates new content — text, images, code, audio — by learning to predict what should come next from training data. Predictive AI outputs a category or score; Generative AI outputs novel content that did not exist before.',
      difficulty: 'beginner',
    },
    {
      question: 'Does AGI (Artificial General Intelligence) exist?',
      answer:
        'No. AGI — AI with the flexibility to perform any intellectual task a human can and transfer skills across domains — does not exist. Today\'s AI systems, including GPT-4 and Claude, are sophisticated Narrow AI: exceptional at language tasks but unable to generalize the way humans do. The timeline for AGI is genuinely uncertain, ranging from "never" to "within a decade" depending on which researcher you ask. Do not build products assuming AGI capabilities.',
      difficulty: 'beginner',
    },
    {
      question: 'What makes an AI system "agentic" and why does it matter for engineering?',
      answer:
        'An agentic AI system can take multi-step actions to accomplish a goal — it plans, uses tools, observes results, adjusts, and loops until complete. This matters because it shifts AI from answering questions (chatbot) to accomplishing tasks (agent). For engineering, agentic AI requires careful design: tool definitions, retry logic, human-in-the-loop checkpoints, and error handling at each step. Products like Cursor and Devin are agentic systems that can do multi-step software engineering work autonomously.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'classify-ai-types',
      title: 'Classify Real AI Features by Type',
      description:
        'Given a list of AI features from real products, classify each one as Generative, Predictive, Conversational, or Agentic. Explain your reasoning. This builds your intuition for recognizing which type of AI solves which problem.',
      starterCode: `// Classify each AI feature and explain why

const aiFeatures = [
  {
    product: "Netflix",
    feature: "Recommends shows based on your watch history",
    type: "", // Generative | Predictive | Conversational | Agentic
    reasoning: "",
  },
  {
    product: "GitHub Copilot",
    feature: "Generates code completions as you type",
    type: "",
    reasoning: "",
  },
  {
    product: "Siri",
    feature: "Answers questions and sets reminders via voice",
    type: "",
    reasoning: "",
  },
  {
    product: "Devin",
    feature: "Takes a GitHub issue, writes code, runs tests, opens a PR",
    type: "",
    reasoning: "",
  },
  {
    product: "Stripe Radar",
    feature: "Flags transactions as likely fraudulent",
    type: "",
    reasoning: "",
  },
  {
    product: "Midjourney",
    feature: "Creates images from text descriptions",
    type: "",
    reasoning: "",
  },
];`,
      solution: `const aiFeatures = [
  {
    product: "Netflix",
    feature: "Recommends shows based on your watch history",
    type: "Predictive",
    reasoning: "It is predicting which shows you will like based on historical viewing data — it outputs a ranked list of existing shows, not new content. Trained on millions of users' watching patterns.",
  },
  {
    product: "GitHub Copilot",
    feature: "Generates code completions as you type",
    type: "Generative",
    reasoning: "It generates new code that did not exist before based on the context. Trained on billions of lines of code to predict what code should come next.",
  },
  {
    product: "Siri",
    feature: "Answers questions and sets reminders via voice",
    type: "Conversational",
    reasoning: "It understands natural language input and responds in natural language. Multi-turn capable, understands context, and can handle follow-up requests.",
  },
  {
    product: "Devin",
    feature: "Takes a GitHub issue, writes code, runs tests, opens a PR",
    type: "Agentic",
    reasoning: "This is a multi-step workflow: read the issue, plan the implementation, write code, run tests, debug failures, commit, open PR. The AI takes many sequential actions autonomously to accomplish a goal.",
  },
  {
    product: "Stripe Radar",
    feature: "Flags transactions as likely fraudulent",
    type: "Predictive",
    reasoning: "It predicts whether a transaction is fraudulent by recognizing patterns from millions of labeled historical transactions. Outputs a risk score, not new content.",
  },
  {
    product: "Midjourney",
    feature: "Creates images from text descriptions",
    type: "Generative",
    reasoning: "It generates entirely new images that did not exist before. The model was trained on image-text pairs and learned to create images matching a description.",
  },
];`,
      hints: [
        'Predictive AI: historical labeled data → predicts an outcome or category for new data',
        'Generative AI: creates new content that did not exist before (text, images, code)',
        'Conversational AI: multi-turn dialogue with natural language understanding',
        'Agentic AI: takes multiple sequential actions using tools to accomplish a goal',
      ],
    },
  ],
  keyTakeaways: [
    'Narrow AI (all AI that exists today) does one thing well — even GPT-4 is Narrow AI, specialized in language',
    'AGI (General AI) does not exist — do not build products assuming human-level generalization',
    'Generative AI creates new content (text, images, code); Predictive AI forecasts outcomes from data',
    'Conversational AI enables natural language dialogue with context across multiple turns',
    'Agentic AI accomplishes multi-step goals by planning, using tools, and taking sequential actions — the frontier of AI engineering',
    'As a builder, you will primarily work with Generative, Conversational, and Agentic AI using LLM APIs',
  ],
  nextLesson: 'how-modern-ai-works',
  prevLesson: 'introduction-to-ai',
};
