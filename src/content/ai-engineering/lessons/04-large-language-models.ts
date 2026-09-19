import type { Lesson } from '@/types';

export const largeLanguageModelsLesson: Lesson = {
  id: 'large-language-models',
  slug: 'large-language-models',
  title: 'Large Language Models (LLMs)',
  description:
    'Understand what LLMs are, how they work, why they can do so many things, what their real limitations are, and how the major models compare — everything you need to use them effectively.',
  category: 'Core Concepts',
  order: 4,
  difficulty: 'beginner',
  estimatedTime: 40,
  content: `The most important technology you will work with as an AI engineer is the Large Language Model. ChatGPT, Claude, Gemini, Llama — these are all LLMs. Understanding what they are and how they work will make you dramatically better at building with them.

---

## What Is a Large Language Model?

A Large Language Model (LLM) is a neural network trained on massive amounts of text to predict the next token in a sequence.

Break down each word:

**Large**: These models have billions to trillions of parameters. GPT-3 has 175 billion. GPT-4 has an estimated 1+ trillion. "Large" refers to the scale of the model.

**Language**: The model is specifically trained on text (language) — not images, not audio, not video (though multimodal models extend this).

**Model**: It is a mathematical function — a large set of numbers (parameters/weights) that transform input (your prompt) into output (the response).

\`\`\`
LLM — CORE IDEA

  A language model is trained to answer one question billions of times:

  "Given everything before this point, what token is most likely to come next?"

  "The capital of France is ___"  →  "Paris"
  "def add(a, b):\n    ___"       →  "return a + b"
  "Dear John, I am writing ___"   →  "to inform you"

  After enough training, this simple objective produces a system that:
  - Understands language
  - Can reason (sort of)
  - Can write code
  - Can answer questions
  - Can summarize documents
  - Can translate between languages
  - Can follow complex instructions
\`\`\`

The remarkable thing is that this single training objective — predict the next token — produces systems capable of seemingly general reasoning.

---

## How LLMs Actually Work (Intuition)

You do not need to understand the math, but you do need to understand the intuition.

### The Transformer Architecture

Modern LLMs are built on the Transformer architecture (from the 2017 paper "Attention Is All You Need"). The key innovation is the **attention mechanism**.

**Attention (intuition)**: When the model processes your input, it does not read each word in isolation. For every word, it asks: "which other words in this text are relevant to understanding THIS word?"

\`\`\`
ATTENTION EXAMPLE

  "The bank by the river was steep and muddy"

  When processing "bank":
  - "river" gets HIGH attention → this is a riverbank, not a financial bank
  - "steep" and "muddy" get HIGH attention → confirms physical location
  - "financial" is not in the sentence, so financial meaning is unlikely

  Without attention: "bank" is ambiguous
  With attention: "bank" is clearly a riverbank

  This is how LLMs understand context and disambiguate meaning.
\`\`\`

### Layers of Understanding

Transformers have many layers (GPT-4 has 96 layers). Each layer refines the model's understanding:

- Early layers: understand basic grammar, word types
- Middle layers: understand phrases, relationships between concepts
- Later layers: understand complex reasoning, context, intent

The output of all these layers is a probability distribution over the vocabulary — which token is most likely to come next.

### Token Generation

The model generates text one token at a time:

\`\`\`
TOKEN GENERATION PROCESS

  Your prompt: "What is 2 + 2?"

  Step 1: Model processes entire prompt → predicts most likely next token
          Candidates: "2" (60%), "four" (25%), "The" (8%), ...
          Selected: "2"

  Step 2: Model processes [prompt + "2"] → predicts next token
          Candidates: "." (70%), "," (15%), " which" (10%), ...
          Selected: "."

  Step 3: Model processes [prompt + "2."] → predicts next token
          "\n" or end-of-sequence token is selected

  Final output: "2."

  Each token is generated fresh using ALL previous tokens as context.
  This is why LLMs are slow for long outputs — each token requires
  a full forward pass through the model.
\`\`\`

---

## Training Data and What LLMs "Know"

LLMs are trained on text from the internet, books, code, academic papers, and more. Through training, the model implicitly learns:

- Facts about the world (Paris is the capital of France)
- How language works (grammar, syntax, style)
- How to write code (from GitHub and coding tutorials)
- How to reason through problems (from books, papers, problem sets)
- Cultural references, idioms, domain-specific terminology

**What the model has NOT learned**:
- Events after its training cutoff
- Your private data
- Information not in its training data
- Things that require real-time lookup (current stock prices, live weather)

---

## Context and Prediction

LLMs use context — everything in the conversation before the current token — to make predictions. This is what makes them feel "smart."

\`\`\`
CONTEXT DETERMINES OUTPUT

  Prompt 1: "What are the best practices for Python?"
  → Response about Python coding standards

  Prompt 2: "I am a Python beginner. What are the best practices?"
  → Simpler response with more explanation

  Prompt 3: "I am a Python expert with 10 years of experience. What are the best practices?"
  → Advanced response focusing on architecture and performance

  Same core question. Different context → different response.
  The model uses all prior context to calibrate its output.
\`\`\`

This is why **system prompts** are powerful. They establish context before the user says anything, telling the model who it is, what it knows, how it should behave.

---

## Hallucinations

LLMs hallucinate — they generate false information confidently.

**Why**: The model predicts statistically likely text. If the question has a specific answer the model does not know, it still generates what looks like a plausible answer, because that is what the training data suggests should follow this kind of question.

\`\`\`
HALLUCINATION EXAMPLE

  Question: "What papers did researcher X publish in 2019?"

  If researcher X is obscure (little training data about them):
  Model might generate: "Dr. X published 'Machine Learning Applications in Healthcare'
  (Nature, 2019) and 'Neural Network Optimization Strategies' (ICML, 2019)"

  These papers may not exist. The model generated plausible-sounding titles
  in the correct format because that pattern matches training data.
\`\`\`

**Mitigation**:
- Provide real source documents (RAG) and instruct the model to cite them
- Ask the model to say "I don't know" when uncertain
- Never use LLM output for critical factual claims without verification
- Use tools that allow real-time lookup instead of relying on model memory

---

## Major LLM Families

You will use these models via their APIs. Understanding their strengths helps you choose correctly.

\`\`\`
MAJOR LLM COMPARISON

┌──────────────┬────────────┬─────────────────────────────────────────────┐
│ Model Family │ Creator    │ Notes                                       │
├──────────────┼────────────┼─────────────────────────────────────────────┤
│ GPT-4o       │ OpenAI     │ Strong reasoning, image understanding,      │
│ GPT-4        │            │ widely used, large ecosystem               │
├──────────────┼────────────┼─────────────────────────────────────────────┤
│ Claude 3.5+  │ Anthropic  │ Long context (200K tokens), strong at       │
│              │            │ nuanced reasoning, writing, coding, safety  │
├──────────────┼────────────┼─────────────────────────────────────────────┤
│ Gemini 1.5+  │ Google     │ 1M token context, multimodal, integrated   │
│              │            │ with Google services                        │
├──────────────┼────────────┼─────────────────────────────────────────────┤
│ Llama 3+     │ Meta       │ Open source, run locally, strong for        │
│              │            │ fine-tuning, no API costs if self-hosted    │
├──────────────┼────────────┼─────────────────────────────────────────────┤
│ Mistral      │ Mistral AI │ Efficient open models, good for             │
│              │            │ deployment on smaller hardware              │
└──────────────┴────────────┴─────────────────────────────────────────────┘
\`\`\`

### Choosing a Model

| Task | Recommended |
|------|-------------|
| Production app, complex reasoning | Claude 3.5 Sonnet or GPT-4o |
| High volume, cost-sensitive | Claude Haiku or GPT-4o-mini |
| Long documents (books, codebases) | Claude (200K context) or Gemini |
| Privacy-first / local deployment | Llama 3 (self-hosted) |
| Coding tasks | Claude 3.5 Sonnet, GPT-4o |
| Image understanding | GPT-4o, Gemini, Claude |

---

## LLM Limitations to Know

These are not bugs. They are fundamental characteristics of how LLMs work.

**1. Knowledge cutoff**: Does not know about events after training.

**2. No real-time access**: Cannot browse the internet unless given a tool.

**3. Hallucination**: Generates plausible-sounding false information.

**4. Context window limit**: Cannot process more than its context window allows.

**5. Non-deterministic**: Same prompt may produce slightly different answers each time (controlled by temperature setting).

**6. No persistent memory**: Does not remember previous conversations unless you explicitly provide that history.

**7. Can be confidently wrong**: Does not reliably know what it does not know.

**8. Reasoning has limits**: Struggles with precise math, step-counting, and tasks requiring exact computation (use tools instead).

\`\`\`
LLM LIMITATIONS CHEAT SHEET

  Use tools for: real-time data, exact math, current events
  Use RAG for: domain knowledge, private documents, fact accuracy
  Use memory systems for: persistent user context across sessions
  Use verification for: factual claims, citations, legal/medical advice
\`\`\`

---

## Temperature — Controlling Randomness

Temperature controls how predictable or creative the model's output is.

\`\`\`
TEMPERATURE EFFECT

  Temperature = 0 (deterministic)
  → Model always picks the highest probability token
  → Consistent, predictable output
  → Use for: factual Q&A, classification, structured output

  Temperature = 0.7 (balanced)
  → Some randomness — occasionally picks less likely tokens
  → Varied but still sensible output
  → Use for: general chat, coding assistance, summarization

  Temperature = 1.0 (creative)
  → More randomness — unpredictable choices
  → Creative, diverse output
  → Use for: creative writing, brainstorming, idea generation

  Temperature > 1.0 (chaotic)
  → Very high randomness, often incoherent
  → Rarely useful in practice
\`\`\`

---

## The Emergence Effect

One of the most surprising properties of LLMs is that capabilities appear suddenly at certain scale thresholds.

Small language models struggle to:
- Do multi-step math
- Follow complex instructions
- Reason through novel problems

Large language models (GPT-4, Claude 3.5) can do all of these — not because these skills were trained explicitly, but because they **emerged** from scale.

This is why:
- Bigger models are sometimes worth the cost for complex tasks
- Smaller models are often good enough for simple tasks
- The gap between a small and large model on a complex task can be much larger than the parameter count difference suggests`,
  codeExamples: [
    {
      title: 'Working with LLMs — Core Patterns',
      code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Pattern 1: Basic completion with temperature control
async function factualQuery(question: string): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    temperature: 0, // deterministic for factual tasks
    messages: [{ role: 'user', content: question }],
  });
  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

// Pattern 2: Creative generation with higher temperature
async function generateIdeas(topic: string): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    temperature: 0.9, // more creative
    messages: [
      {
        role: 'user',
        content: \`Generate 5 creative product ideas in the space of: \${topic}\`,
      },
    ],
  });
  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

// Pattern 3: System prompt for context/persona
async function expertAnswer(
  domain: string,
  question: string
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: \`You are an expert in \${domain}.
Answer questions accurately.
If you are not sure about something, say so explicitly rather than guessing.
Focus on practical, actionable information.\`,
    messages: [{ role: 'user', content: question }],
  });
  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

// Pattern 4: Streaming for better UX (shows output as it generates)
async function streamResponse(prompt: string): Promise<void> {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  // Print each chunk as it arrives (don't wait for full response)
  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }
}`,
      explanation:
        'These four patterns cover most LLM use cases: basic queries (temperature=0 for accuracy), creative generation (higher temperature), persona/context setting (system prompts), and streaming (better UX for long responses). Master these and you can build most AI features.',
    },
  ],
  commonMistakes: [
    'Treating LLM output as ground truth — always validate factual claims, especially for important decisions',
    'Using temperature=1 for everything — factual tasks need lower temperature; high temperature on factual queries increases hallucination',
    'Not using system prompts — system prompts dramatically improve output quality and consistency; always use them for production apps',
    'Choosing the biggest model for every task — simple tasks (classification, summarization) work well with smaller, cheaper models',
    'Asking LLMs to do exact math — LLMs are poor at arithmetic; give them a calculator tool or compute mathematically in your code',
    'Forgetting that LLMs are stateless — each API call is independent; you must include conversation history for multi-turn chat',
  ],
  interviewQuestions: [
    {
      question: 'How does a large language model generate text?',
      answer:
        'LLMs generate text one token at a time. For each new token, the model processes all previous tokens (the entire context) and outputs a probability distribution over its vocabulary. It samples from this distribution to select the next token. This repeats until the model generates an end-of-sequence token or reaches the max_tokens limit. The model was trained to make this prediction accurately by seeing billions of next-token prediction examples. This is why output can vary (probabilistic sampling) and why longer outputs take more time (each token requires a full forward pass).',
      difficulty: 'intermediate',
    },
    {
      question: 'What causes LLM hallucinations and how do you address them in production?',
      answer:
        'Hallucinations happen because LLMs predict statistically likely next tokens — they do not retrieve facts from a verified database. When asked something they do not know, they generate plausible-sounding text anyway. Production mitigations: (1) RAG — provide real documents as context and instruct the model to cite them, (2) Explicit instructions: "Say I don\'t know if uncertain", (3) Low temperature for factual tasks, (4) Verification layers that check outputs against known sources, (5) Tool use — let the model query a database or API for real-time facts instead of relying on training memory.',
      difficulty: 'intermediate',
    },
    {
      question: 'How would you choose between GPT-4o, Claude, and Llama for a new AI application?',
      answer:
        'Key factors: (1) Context length — Claude has 200K token context, ideal for long documents; (2) Privacy — Llama can be self-hosted, critical for sensitive data; (3) Cost — Claude Haiku or GPT-4o-mini for high-volume simple tasks; (4) Capability — for complex reasoning, Claude 3.5 Sonnet and GPT-4o are the frontier; (5) Ecosystem — OpenAI has the largest ecosystem, most tutorials and integrations; (6) Task type — benchmark on your actual use case; generic benchmarks do not always predict performance on your specific task. Start with one model, benchmark against the task, then compare.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'model-comparison',
      title: 'Compare Model Responses for Different Tasks',
      description:
        'Run the same prompts with different temperature settings and observe how the output changes. This builds intuition for when to use different temperature values and how model behavior varies. Use the Anthropic API with your own API key.',
      starterCode: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Task: Compare temperature effects on the same prompt

async function compareTemperatures(prompt: string): Promise<void> {
  const temperatures = [0, 0.5, 1.0];

  for (const temp of temperatures) {
    console.log(\`\\n--- Temperature: \${temp} ---\`);

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', // Use Haiku for cost efficiency in experiments
      max_tokens: 200,
      temperature: temp,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      console.log(content.text);
    }
  }
}

// Test with a factual question:
await compareTemperatures("What is the capital of France?");

// Test with a creative prompt:
await compareTemperatures("Give me a creative name for a coffee shop");

// Observe: factual questions → temperature matters little
//          creative prompts → temperature creates meaningful variation`,
      solution: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function compareTemperatures(
  prompt: string,
  repetitions = 2
): Promise<void> {
  console.log(\`\\nPrompt: "\${prompt}"\`);
  console.log('='.repeat(50));

  const temperatures = [0, 0.5, 1.0];

  for (const temp of temperatures) {
    console.log(\`\\nTemperature \${temp}:\`);

    // Run multiple times to see variance
    for (let i = 0; i < repetitions; i++) {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        temperature: temp,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        console.log(\`  Run \${i + 1}: \${content.text.trim()}\`);
      }
    }
  }
}

// Insights you will observe:
// Factual: "What is 15% of 200?"
//   temp=0: "30" (same every time)
//   temp=1: "30" (still consistent — high confidence answer)
//
// Creative: "Give me a tagline for a pizza shop"
//   temp=0: Same tagline every run
//   temp=1: Different tagline each run

await compareTemperatures("What is the capital of Australia?");
await compareTemperatures("Write a one-sentence tagline for a coffee shop");`,
      hints: [
        'Use claude-haiku-4-5-20251001 for experiments — much cheaper than Sonnet while good enough for testing temperature effects',
        'Run creative prompts multiple times at the same temperature to see how much variance there is',
        'Notice that even at temperature=1, factual answers rarely change — the model is very confident about facts it knows well',
        'Temperature does not fix hallucinations — a confident wrong answer at temperature=0 is still a wrong answer',
      ],
    },
  ],
  keyTakeaways: [
    'LLMs are neural networks trained to predict the next token — this simple objective produces surprisingly general capabilities',
    'The attention mechanism lets models understand context: which words are relevant to each other across the entire input',
    'LLMs have hard limitations: knowledge cutoff, no real-time access, hallucination, context window limits, and no persistent memory',
    'Temperature controls creativity vs consistency — lower for factual tasks, higher for creative tasks',
    'Major LLMs (Claude, GPT-4, Gemini, Llama) have different strengths — choose based on context length, cost, privacy, and task type',
    'Hallucinations are fundamental — mitigate with RAG, explicit instructions, low temperature, and verification layers',
  ],
  nextLesson: 'ai-models',
  prevLesson: 'how-modern-ai-works',
};
