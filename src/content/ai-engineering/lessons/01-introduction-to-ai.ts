import type { Lesson } from '@/types';

export const introToAILesson: Lesson = {
  id: 'introduction-to-ai',
  slug: 'introduction-to-ai',
  title: 'Introduction to AI',
  description:
    'Understand what AI actually is, where it came from, why it exploded in popularity, how it differs from traditional software, and where you see it in products you use every day.',
  category: 'Foundations',
  order: 1,
  difficulty: 'beginner',
  estimatedTime: 35,
  content: `You have probably used AI today without thinking about it. Gmail predicted your next word. Spotify recommended a song. Google understood a question you typed in plain English instead of keywords. YouTube decided what video to show you next.

AI is not a future technology. It is already embedded in the products engineers build and the tools engineers use. This module gives you a clear mental model for what AI actually is, where it came from, and why it matters to you as a software engineer.

---

## What Is AI?

Artificial Intelligence is the field of building systems that can perform tasks that normally require human intelligence.

That definition sounds vague because the word "intelligence" is vague. Let us make it concrete.

Human intelligence includes things like:
- Understanding language
- Recognizing patterns in images
- Making decisions based on incomplete information
- Learning from past experience
- Generating creative content

AI is engineering's attempt to make machines do these things.

The key word is **engineering**. AI is not magic. It is not sci-fi. It is a set of mathematical and computational techniques that, combined with large amounts of data and computing power, produces systems that exhibit intelligent behavior.

\`\`\`
WHAT AI ACTUALLY IS

                    Input
                      │
                      ▼
            ┌─────────────────┐
            │   AI System     │
            │  (trained on    │
            │   data, learns  │
            │   patterns)     │
            └─────────────────┘
                      │
                      ▼
                    Output

Examples:
  Input: "What is the capital of France?"
  Output: "Paris"

  Input: Photo of a dog
  Output: "Golden Retriever, 94% confidence"

  Input: "Write a function to reverse a string"
  Output: Working code in Python
\`\`\`

---

## A Very Brief History of AI

Understanding where AI came from helps you understand why it works the way it does today.

### 1950s — The Birth of the Idea

In 1950, Alan Turing asked: "Can machines think?" He proposed a test — the Turing Test — where a machine would be considered intelligent if its conversation was indistinguishable from a human's. This framed AI as a problem of intelligence and language.

The term "Artificial Intelligence" was coined in 1956 at the Dartmouth Conference. Researchers were optimistic. They thought general-purpose intelligent machines were decades away.

### 1960s–1980s — Rule-Based Systems

Early AI was built on explicit rules. Engineers wrote programs like:

\`\`\`
IF patient has fever AND cough THEN suggest flu diagnosis
IF temperature > 100F THEN alert patient
\`\`\`

These "expert systems" worked well in narrow domains but failed at scale. The world is too complex and too unpredictable to cover with explicit rules. You cannot write rules for everything a person might say or every situation a car might encounter.

### 1980s–2000s — Machine Learning Emerges

Instead of writing rules, researchers asked: what if we let machines learn rules from data?

Machine learning (ML) flipped the script. Instead of:
\`\`\`
Human writes rules → Machine applies rules
\`\`\`

It became:
\`\`\`
Human provides data → Machine learns rules → Machine applies learned rules
\`\`\`

This was more powerful. A machine trained on millions of spam emails could detect spam better than any hand-written filter.

### 2010s — Deep Learning Breakthrough

In 2012, a neural network called AlexNet won an image recognition competition by a massive margin. It used "deep learning" — neural networks with many layers — trained on massive datasets using GPUs.

The AI research community shifted entirely toward deep learning. It outperformed every previous technique in image recognition, speech recognition, language understanding, and game playing.

### 2017 — The Transformer Changes Everything

Google published a paper called "Attention Is All You Need" introducing the **Transformer architecture**. This became the foundation for every major language model that exists today — GPT, Claude, Gemini, Llama.

Transformers enabled training on enormous amounts of text, producing models that could understand and generate language with remarkable quality.

### 2020–Present — The LLM Era

GPT-3 (2020) demonstrated that a large language model trained on internet-scale text could write code, answer questions, summarize documents, and hold conversations — without being explicitly programmed for any of those tasks.

ChatGPT (2022) made this accessible to the public. 100 million users in 2 months. The fastest-growing consumer product in history.

The wave you are riding now is the result of 70 years of research, a breakthrough architecture, and the availability of massive compute and data.

---

## Why AI Became Popular Now

AI has existed as a research field for decades. Why did it explode in 2022–2023 and not in 2000 or 1995?

Three things converged:

\`\`\`
THREE PILLARS OF THE AI EXPLOSION

┌─────────────────────────────────────────────────────────┐
│  1. DATA                                                │
│     Internet created trillions of text, image,         │
│     video, and audio examples to train on              │
│     (Wikipedia, GitHub, Reddit, books, news...)        │
├─────────────────────────────────────────────────────────┤
│  2. COMPUTE                                             │
│     GPU computing (originally for gaming) turned out   │
│     to be ideal for the math operations in neural      │
│     networks. Cloud providers made GPUs accessible.    │
├─────────────────────────────────────────────────────────┤
│  3. ALGORITHMS                                          │
│     The Transformer architecture (2017) made it        │
│     possible to train models on massive text datasets  │
│     and produce remarkably capable language models.    │
└─────────────────────────────────────────────────────────┘

Missing any one of these → AI stays in research labs
All three together → Products that 100 million people use
\`\`\`

**Data**: Before the internet, collecting training data was expensive and slow. The internet generated billions of documents, conversations, code repositories, and images that AI systems could train on.

**Compute**: Training a large language model requires billions of mathematical operations per second. GPUs, which were originally designed for video games, turned out to be ideal for this. Companies like NVIDIA built hardware specifically for AI training. Cloud providers (AWS, Google, Azure) made renting massive GPU clusters affordable.

**Algorithms**: The Transformer architecture solved a key problem: how do you train a model to understand context and relationships in long sequences of text? Transformers handle this elegantly and scale extremely well.

---

## AI vs Traditional Software

This is one of the most important concepts to understand as a software engineer.

Traditional software follows explicit rules you write. AI software learns patterns from data.

\`\`\`
TRADITIONAL SOFTWARE vs AI

┌────────────────────┬──────────────────────────┬──────────────────────────┐
│                    │ Traditional Software      │ AI / ML                  │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ How it works       │ Developer writes rules   │ System learns rules       │
│                    │ explicitly               │ from examples             │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ Input              │ Structured, expected      │ Messy, unstructured,     │
│                    │ inputs                   │ open-ended               │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ Output             │ Deterministic             │ Probabilistic            │
│                    │ (same input = same output)│ (may vary each time)    │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ Good at            │ Precise logic, math,      │ Pattern recognition,    │
│                    │ business rules           │ language, images         │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ Fails at           │ Understanding ambiguity,  │ Absolute precision,     │
│                    │ language, images          │ guaranteed correctness   │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ Debugging          │ Trace code paths         │ Hard — model is a black  │
│                    │                          │ box                      │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ Example            │ if (score > 90) grade='A'│ Trained classifier       │
│                    │ else grade='B'           │ that predicts grade      │
│                    │                          │ from essay text          │
└────────────────────┴──────────────────────────┴──────────────────────────┘
\`\`\`

**Key insight**: AI is not replacing traditional software — it is extending it. Your backend still runs on Node.js with explicit business logic. You add AI where you have messy, human-language, or pattern-recognition problems that rules cannot handle.

A real-world example: An e-commerce platform uses:
- Traditional software for: calculating prices, managing inventory, processing payments (must be exact)
- AI for: personalizing recommendations, detecting fraud, understanding search queries, generating product descriptions

---

## Real World Examples of AI in Products

Let us ground this in products you already use.

**ChatGPT (OpenAI)**
A large language model that you interact with through conversation. Ask it to explain code, write an email, debug a problem, or brainstorm ideas. The AI generates responses by predicting what text should come next based on everything it was trained on and the conversation context.

**Claude (Anthropic)**
An AI assistant similar to ChatGPT but with different training priorities — particularly around safety and helpfulness. Claude is known for nuanced reasoning, long document analysis, and careful handling of sensitive topics. The API is what you would use to build your own AI applications.

**Gemini (Google)**
Google's multimodal AI — it understands both text and images. Built into Google Search, Google Docs, Gmail, and Android. When you search Google and get a direct answer instead of just links, that is an AI model interpreting your query.

**GitHub Copilot**
An AI code assistant built into your code editor. Trained on billions of lines of public code from GitHub. As you type, it predicts the code you are about to write — functions, tests, boilerplate, entire implementations. It uses the same underlying model technology as ChatGPT.

**Cursor**
An AI-powered code editor. Unlike Copilot (which autocompletes), Cursor lets you have a conversation with your codebase — "refactor this to use TypeScript", "explain what this function does", "add error handling to all these API calls". It uses AI to understand your entire codebase as context.

**Spotify**
Recommends music using a combination of traditional collaborative filtering (users who liked X also liked Y) and AI models trained on audio features of songs. The "Discover Weekly" playlist is a machine learning system that builds a model of your taste.

**Gmail Smart Compose / Smart Reply**
When Gmail suggests how to finish your sentence or offers quick reply options ("Sounds great!", "Let me check"), that is a small language model running inference. It was trained on billions of emails and learned what words typically follow what other words.

---

## Why This Matters to You as a Software Engineer

You are not training AI models from scratch. That is the job of ML researchers at OpenAI, Anthropic, Google. Your job is different:

- **Using AI APIs** to add intelligence to your applications
- **Building AI-powered products** that users interact with
- **Integrating AI** into existing systems
- **Designing architectures** that include AI components
- **Understanding tradeoffs** between AI approaches

Think of AI models as a new type of API. A few years ago, "adding search to your app" meant integrating Elasticsearch or Algolia. Today, "adding intelligent search to your app" means calling an embedding model and a vector database.

The developers who understand how to use these tools — which model to choose, how to prompt it, how to build RAG systems, how to build agents — will build the best products of the next decade.

---

## Summary

AI is the engineering discipline of building systems that exhibit intelligent behavior — understanding language, recognizing patterns, making decisions.

Modern AI is dominated by deep learning, specifically transformer-based models, which learn from enormous datasets and can perform remarkably general tasks.

The AI explosion happened because three things converged: massive internet data, accessible GPU compute, and the Transformer architecture.

AI differs from traditional software in that it learns rules from data rather than executing rules written by developers. It produces probabilistic outputs rather than deterministic ones.

As a software engineer, your role is to build with AI — using APIs, building applications, designing architectures — not to research new models from scratch.`,
  codeExamples: [
    {
      title: 'Traditional Software vs AI — Code Comparison',
      code: `// TRADITIONAL SOFTWARE: Explicit rules
function classifyEmail(email: string): 'spam' | 'not-spam' {
  const spamKeywords = ['buy now', 'free money', 'click here', 'limited offer'];
  const hasSpamKeyword = spamKeywords.some(kw => email.toLowerCase().includes(kw));
  if (hasSpamKeyword) return 'spam';
  return 'not-spam';
}

// Problem: brittle. New spam tactics break the rules.
// "Get rich quick" → not caught. "Fr33 m0ney" → not caught.

// ---

// AI APPROACH: Call a model trained on millions of spam examples
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function classifyEmailWithAI(email: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 10,
    messages: [
      {
        role: 'user',
        content: \`Is this email spam? Reply with only "spam" or "not-spam".

Email: \${email}\`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === 'text') return content.text.trim();
  return 'not-spam';
}

// AI approach handles:
// - New spam patterns it has never seen before
// - Obfuscated text ("Fr33 m0ney")
// - Context and tone
// - Nuance ("This is a great opportunity" — is it spam? Depends on context)`,
      explanation:
        'Traditional software needs you to anticipate every spam pattern in advance. The AI approach calls a model that has learned patterns from millions of spam emails. The AI handles variations and novel patterns that rule-based systems miss.',
    },
  ],
  commonMistakes: [
    'Thinking AI is magic or a black box you cannot reason about — it is a mathematical system trained on data',
    'Assuming AI output is always correct — all models hallucinate and make mistakes, always validate critical outputs',
    'Treating AI as a replacement for traditional software — use AI where you have ambiguity, language, or patterns; use traditional code where you need precision',
    'Thinking you need to understand deep math to build with AI — you need to understand how to use APIs and design systems',
    'Assuming AI is too expensive — many AI API calls cost fractions of a cent',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between AI and traditional software?',
      answer:
        'Traditional software executes explicit rules written by developers — deterministic, precise, brittle when the world changes. AI systems learn rules from data — they can generalize to new inputs and handle ambiguity, but their outputs are probabilistic (may vary) and they can make mistakes traditional software never would. Use traditional software for precise business logic; use AI where you have natural language, images, or pattern recognition problems.',
      difficulty: 'beginner',
    },
    {
      question: 'Why did AI become mainstream only recently, not in the 1990s?',
      answer:
        'Three things had to converge: data (the internet created trillions of examples to train on), compute (GPUs, originally for gaming, turned out to be ideal for neural network math; cloud providers made them accessible), and algorithms (the Transformer architecture in 2017 made it possible to train models that understand language context at scale). Missing any one of these kept AI in research labs. All three converging in the 2010s–2020s produced the products we use today.',
      difficulty: 'intermediate',
    },
    {
      question: 'What role does a software engineer play in AI — are they training models?',
      answer:
        'For 99% of software engineers, no — you are not training models from scratch. That is the job of ML researchers at AI companies. Software engineers use AI by calling APIs (OpenAI, Anthropic, Google), building products on top of models, designing architectures that include AI components, building RAG systems, building agents, and understanding which approach to use for which problem. Think of AI models as a powerful new type of API you integrate, not something you build from scratch.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'ai-examples-around-you',
      title: 'Identify AI in Products You Use',
      description:
        'Before writing a single line of AI code, build intuition for where AI is already being used. List five products you used in the last 24 hours and identify what specific AI is running in each. This exercise builds your "AI thinking" — the habit of recognizing where intelligence is happening and why.',
      starterCode: `// Map out AI in your daily tools
// Be specific — don't just say "it uses AI", explain what the AI does

const aiInMyLife = [
  {
    product: "Gmail",
    aiFeature: "", // What specific AI feature?
    whatTheProblemIs: "", // What problem would be hard to solve with just rules?
    inputToTheAI: "", // What data goes into the AI?
    outputFromTheAI: "", // What does the AI produce?
  },
  {
    product: "Google Search",
    aiFeature: "",
    whatTheProblemIs: "",
    inputToTheAI: "",
    outputFromTheAI: "",
  },
  {
    product: "", // Your choice
    aiFeature: "",
    whatTheProblemIs: "",
    inputToTheAI: "",
    outputFromTheAI: "",
  },
  {
    product: "", // Your choice
    aiFeature: "",
    whatTheProblemIs: "",
    inputToTheAI: "",
    outputFromTheAI: "",
  },
  {
    product: "", // Your choice
    aiFeature: "",
    whatTheProblemIs: "",
    inputToTheAI: "",
    outputFromTheAI: "",
  },
];`,
      solution: `const aiInMyLife = [
  {
    product: "Gmail",
    aiFeature: "Smart Compose and Smart Reply",
    whatTheProblemIs: "Predicting what word or phrase the user is about to type — impossible with rules because there are infinite things someone could write",
    inputToTheAI: "The email being written so far + the user's writing style from past emails",
    outputFromTheAI: "Suggested text completions and quick reply options",
  },
  {
    product: "Google Search",
    aiFeature: "Natural language query understanding + AI Overviews",
    whatTheProblemIs: "Understanding what a person actually means (not just keyword matching) — 'good restaurants near me open late' requires understanding intent, location, and time preference",
    inputToTheAI: "The search query + user context (location, past searches)",
    outputFromTheAI: "Ranked results + sometimes a direct AI-generated summary answer",
  },
  {
    product: "Spotify",
    aiFeature: "Discover Weekly / song recommendations",
    whatTheProblemIs: "Predicting which songs a specific user will like — a user's taste is too complex and personal to encode in rules",
    inputToTheAI: "The user's listening history, skips, saves, playlist additions",
    outputFromTheAI: "A ranked list of songs the user is predicted to enjoy",
  },
  {
    product: "GitHub Copilot",
    aiFeature: "Code completion and generation",
    whatTheProblemIs: "Predicting what code a developer is about to write — depends on the entire file context, function names, variable names, and programming patterns",
    inputToTheAI: "The current file, cursor position, surrounding code context",
    outputFromTheAI: "Suggested code completions — from single lines to entire functions",
  },
  {
    product: "YouTube",
    aiFeature: "Home feed recommendations",
    whatTheProblemIs: "Deciding which video out of 800 million videos will maximize engagement for this specific user at this moment — no set of rules can capture this",
    inputToTheAI: "Watch history, likes, search history, watch time percentage, time of day, device type",
    outputFromTheAI: "A ranked feed of videos tailored to this user",
  },
];`,
      hints: [
        'Look for features that seem to "know" things about you personally — personalization is almost always AI.',
        'Look for features that understand natural language — any search that understands your intent (not just keywords) uses AI.',
        'Look for content generation — autocomplete, suggested text, generated summaries are all AI.',
      ],
    },
  ],
  keyTakeaways: [
    'AI is an engineering discipline — mathematical systems trained on data to exhibit intelligent behavior, not magic',
    'The AI explosion happened because three things converged: internet-scale data, accessible GPU compute, and the Transformer architecture',
    'Traditional software executes explicit rules; AI learns rules from data — they are complementary tools, not replacements',
    'AI outputs are probabilistic — they can vary and they can be wrong; always validate critical outputs',
    'As a software engineer, your role is to build with AI using APIs and architectures — not to train models from scratch',
    'AI is already embedded in Gmail, Google, Spotify, GitHub Copilot, YouTube — you are building for a world where AI is a standard engineering tool',
  ],
  nextLesson: 'types-of-ai',
};
