import type { Lesson } from '@/types';

export const howModernAIWorksLesson: Lesson = {
  id: 'how-modern-ai-works',
  slug: 'how-modern-ai-works',
  title: 'How Modern AI Works',
  description:
    'Understand the full AI pipeline — data, training, models, inference, tokens, context windows, parameters, and fine-tuning — with the intuition a software engineer needs to build with AI effectively.',
  category: 'Foundations',
  order: 3,
  difficulty: 'beginner',
  estimatedTime: 40,
  content: `When you call an AI API, something complex happens inside that black box. You do not need to understand the mathematics — but you do need a mental model of the pipeline so you can make good decisions: why does this model cost more, why does it make things up, why does it forget what I said earlier, when should I fine-tune vs use a prompt.

This module gives you that mental model.

---

## The Full AI Pipeline

Building a modern AI model involves five stages:

\`\`\`
AI MODEL PIPELINE

  Stage 1          Stage 2          Stage 3          Stage 4          Stage 5
  ─────────        ─────────────    ─────────────    ─────────────    ─────────────
  DATA             TRAINING         MODEL            INFERENCE        PREDICTIONS
  Collection  →    (learn from  →   (the trained →   (run the     →   (output)
  & Cleaning       the data)        artifact)        model on new
                                                     input)

  Wikipedia        GPU clusters     Claude 3.5       Your API call    "The answer
  GitHub           run for          Sonnet           to Anthropic     is Paris"
  Books            weeks/months
  Web pages
\`\`\`

Let us walk through each stage.

---

## Stage 1: Data

AI models learn from data. The quality and quantity of training data determines the quality of the model.

For a language model like GPT or Claude, the training data is text — enormous amounts of it:
- Books (hundreds of thousands)
- Web pages (billions of crawled pages)
- Wikipedia
- Academic papers
- GitHub code repositories
- Conversations and forums

The data is not raw scraped text. It goes through extensive cleaning:
- Removing duplicates
- Filtering low-quality content
- Removing personal information
- Deduplicating near-identical documents
- Language filtering

**Why data quality matters**: A model trained on bad data produces bad outputs. "Garbage in, garbage out" applies to AI even more than to traditional software.

\`\`\`
DATA QUALITY IMPACT

  Low quality training data    →    Model outputs errors, bias, bad reasoning
  High quality training data   →    Model reasons well, accurate, nuanced

  Also matters:
  Data diversity — model trained only on formal English will struggle with casual text
  Data recency — model trained on 2021 data will not know about 2024 events
\`\`\`

**Knowledge cutoff**: Language models have a training cutoff date — a point after which they have no data. GPT-4's knowledge cuts off at a specific date. Claude's does too. Events after that date are unknown to the model. This is why you cannot ask ChatGPT about something that happened last week without giving it that context yourself.

---

## Stage 2: Training

Training is the process of adjusting a model's internal parameters to minimize its prediction errors on the training data.

**Intuition for non-ML engineers**:

Imagine you are learning to predict the next word in a sentence. You see:

\`\`\`
"The capital of France is ___"
\`\`\`

You guess "London." Wrong. The correct answer is "Paris." You update your understanding.

You see this millions of times:
- "The Eiffel Tower is in ___" → "Paris"
- "The French president lives in ___" → "Paris"
- "Paris is the capital of ___" → "France"

After millions of examples, your prediction for "France capital" strongly points to "Paris."

A neural network does this mathematically. It starts with random parameters (weights). It sees a training example, makes a prediction, compares to the correct answer, calculates the error, and adjusts its parameters to reduce the error. It does this billions of times until the errors are small.

\`\`\`
SIMPLIFIED TRAINING LOOP

  1. Initialize with random weights
  2. Show training example: "The capital of France is ___"
  3. Model predicts: "Berlin" (wrong)
  4. Calculate error: predicted "Berlin", correct is "Paris"
  5. Adjust weights to make "Paris" more likely
  6. Repeat for billions of examples
  7. After enough iterations: model predicts well
\`\`\`

**Training is expensive**:
- Training GPT-4 reportedly cost over $100 million in compute
- It required thousands of A100 GPUs running for months
- This is why only a few companies can train frontier models

You will never train a frontier model. You will use the trained models via APIs.

---

## Stage 3: The Model

The trained model is a file (technically a set of numerical weights) that encodes everything the model learned from the training data.

**Parameters**: A model's parameters are the numerical weights that define how the model processes input. GPT-3 has 175 billion parameters. GPT-4 is estimated to have over 1 trillion. Each parameter is a floating-point number.

\`\`\`
WHAT PARAMETERS ARE

  Think of parameters as millions of dials.
  Training adjusts all the dials until the model predicts well.
  Inference (running the model) reads all the dials to generate output.

  More parameters = more capacity to learn complex patterns
  More parameters = more expensive to run
  More parameters ≠ always better (efficiency matters)
\`\`\`

**Model size vs capability**:
- Larger models generally understand more nuance and handle complex tasks better
- Larger models cost more per token to run
- Smaller models are cheaper and faster but less capable
- Modern small models (Llama 3.2 3B, Claude Haiku) are often good enough for simple tasks

---

## Stage 4: Inference

Inference is the process of running a trained model on new input to get output.

When you call the Anthropic API with a question, that is inference. The model takes your input, runs it through its parameters, and produces output.

\`\`\`
INFERENCE FLOW

  Your code
    │
    │  POST /v1/messages
    │  { "model": "claude-sonnet-4-6",
    │    "messages": [{"role": "user", "content": "What is 2+2?"}] }
    │
    ▼
  Anthropic's servers
    │
    │  (Run the model on your input)
    │  (Generate tokens one by one)
    │
    ▼
  Response: { "content": [{"text": "4"}] }
    │
    ▼
  Your code receives the result
\`\`\`

**Inference costs**: You pay per token when using AI APIs. Inference is relatively cheap (fractions of a cent for a typical request) but adds up at scale.

---

## Tokens — The Fundamental Unit

This is one of the most important concepts to understand.

AI models do not process text character by character or word by word. They process **tokens** — chunks of characters that are common in the training data.

A token is roughly 3-4 characters or about 0.75 words on average in English.

\`\`\`
TOKENIZATION EXAMPLES

  "Hello, world!"
   [Hello] [,] [ world] [!]
   → 4 tokens

  "JavaScript is a programming language"
   [Java] [Script] [ is] [ a] [ programming] [ language]
   → 6 tokens (note: "JavaScript" splits into two tokens)

  "AI Engineering Fundamentals"
   [AI] [ Engineering] [ Fund] [amentals]
   → 4 tokens

  Code is often more tokens per character:
  "function reverseString(str) { return str.split('').reverse().join(''); }"
  → approximately 20-25 tokens
\`\`\`

**Why tokens matter for engineers**:

1. **Cost**: You pay per token. A 1,000-word document is roughly 1,300 tokens.
2. **Context limits**: Models have a maximum number of tokens they can process at once.
3. **Speed**: Generating more tokens takes more time.
4. **Pricing differences**: Input tokens (your prompt) often cost differently from output tokens (the response).

\`\`\`
TOKEN PRICING INTUITION (approximate)

  claude-sonnet-4-6:
    Input:  $3 per million tokens
    Output: $15 per million tokens

  A typical API call:
    1,000 input tokens + 500 output tokens
    = $0.003 + $0.0075
    = ~$0.01 per call

  At scale (1 million calls/month):
    = ~$10,000/month just for tokens
\`\`\`

---

## Context Window

The context window is the maximum amount of text (in tokens) a model can "see" at once — including your system prompt, conversation history, and the current message.

\`\`\`
CONTEXT WINDOW VISUALIZATION

  ┌─────────────────────────────────────────────────────────────────┐
  │ CONTEXT WINDOW (e.g. 200,000 tokens for Claude)                │
  │                                                                 │
  │  System Prompt          Conversation History       Your Message │
  │  ─────────────          ────────────────────       ──────────── │
  │  "You are a             [Turn 1] [Turn 2]          "What was    │
  │  helpful                [Turn 3] [Turn 4]          my first     │
  │  assistant"             [Turn 5] ...               question?"   │
  │                                                                 │
  │  All of this must fit within the context window                │
  └─────────────────────────────────────────────────────────────────┘
\`\`\`

**Context window sizes** (approximate):
- GPT-3.5: 4,096 tokens (~3,000 words)
- GPT-4: 128,000 tokens (~96,000 words)
- Claude 3.5 Sonnet: 200,000 tokens (~150,000 words)
- Gemini 1.5 Pro: 1,000,000 tokens (~750,000 words)

**Why context window matters**:
- If your conversation history exceeds the context window, old messages get dropped
- Large documents must fit in the context window to be analyzed
- Larger context = more expensive inference
- The model's "memory" is only what is in the current context window — it does not remember previous sessions unless you include that history in the prompt

**The context is not permanent**: Close the conversation, start a new one, and the model has no memory of what you discussed before. This is why building "persistent memory" for AI applications requires you to store conversation history in a database and inject it into new conversations.

---

## Predictions and Hallucinations

Language models predict the next token. They do not retrieve answers from a database. They do not look things up. They generate text that is statistically likely to be correct based on their training.

This is why models hallucinate — generate false information confidently.

\`\`\`
WHY HALLUCINATIONS HAPPEN

  Question: "What is the phone number of the Eiffel Tower?"

  Model does not know the answer. But it has learned:
  - Questions about places are often followed by specific information
  - Phone numbers look like +33 X XX XX XX XX
  - Making up a plausible-sounding answer is statistically "normal"

  So the model generates: "+33 1 44 11 23 45" — completely fabricated.

  The model is not lying. It is doing what it was trained to do: predict
  the most statistically likely next tokens given the context.
\`\`\`

**What this means for building with AI**:
- Never trust AI output for factual claims without verification
- Use Retrieval Augmented Generation (RAG) to give the model real data to work from
- Add grounding: "Only answer based on the provided documents"
- Build validation layers for critical information

---

## Fine Tuning

Fine tuning is taking a pre-trained model and training it further on a smaller, task-specific dataset.

\`\`\`
FINE TUNING

  Pre-trained model               Fine-tuned model
  (trained on internet)    +      (your domain data)
  "Knows everything          →    "Knows everything + expert in
  in general"                      your specific domain"

  Example: Fine-tune GPT on 10,000 customer support tickets
  Result: Model that responds in your company's tone, knows your products
\`\`\`

**When to fine-tune vs when to use prompting**:

| Situation | Use Prompting | Use Fine Tuning |
|-----------|--------------|----------------|
| Task complexity | Simple to medium tasks | Complex patterns hard to explain in a prompt |
| Style consistency | Easy to describe in a system prompt | Consistent tone across thousands of outputs |
| Domain data | General knowledge is fine | Need specialized domain knowledge |
| Cost | Single task, low volume | High volume where smaller fine-tuned model is cheaper |
| Time | Need results now | Can spend weeks on training |

Fine tuning is not always necessary. Most AI applications are built with prompting alone. Only fine-tune when you have a specific problem that prompting cannot solve.

---

## The Full Picture

\`\`\`
HOW AN AI API CALL WORKS — COMPLETE VIEW

  Your application
       │
       │  You send: system prompt + conversation history + user message
       │  (all encoded as tokens)
       │
       ▼
  API endpoint (Anthropic / OpenAI / Google)
       │
       │  Validates request, routes to model servers
       │
       ▼
  Model inference (GPU cluster)
       │
       │  Tokenizes your input
       │  Runs input through the model (transformer layers, attention)
       │  Generates output tokens one by one
       │  Each new token uses all previous tokens as context
       │
       ▼
  Response
       │
       │  Detokenizes tokens back to text
       │  Returns to your application
       │
       ▼
  Your application displays the result
\`\`\`

Understanding this pipeline explains:
- Why there is latency (especially for long outputs — tokens generate one by one)
- Why costs increase with longer prompts and longer responses
- Why the model does not remember previous sessions
- Why you get slightly different outputs for the same prompt (sampling is probabilistic)
- Why the model does not know about recent events (knowledge cutoff)`,
  codeExamples: [
    {
      title: 'Token Counting and Context Management',
      code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Count tokens before sending (to estimate cost or check context limits)
async function countTokens(text: string): Promise<number> {
  const response = await client.messages.countTokens({
    model: 'claude-sonnet-4-6',
    messages: [{ role: 'user', content: text }],
  });
  return response.input_tokens;
}

// Manage context window — truncate old messages if needed
function truncateHistory(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokensForHistory: number
): Array<{ role: 'user' | 'assistant'; content: string }> {
  // Rough estimate: 1 token ≈ 4 chars
  let totalChars = 0;
  const result = [];

  // Walk backwards (keep most recent messages)
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgChars = messages[i].content.length;
    if (totalChars + msgChars > maxTokensForHistory * 4) break;
    result.unshift(messages[i]);
    totalChars += msgChars;
  }

  return result;
}

// Example: chat with context management
async function managedChat(
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<string> {
  const MAX_HISTORY_TOKENS = 100_000; // Leave room for system prompt + response

  const trimmedHistory = truncateHistory(history, MAX_HISTORY_TOKENS);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are a helpful assistant.',
    messages: [
      ...trimmedHistory,
      { role: 'user', content: userMessage },
    ],
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}`,
      explanation:
        'Token counting lets you estimate costs and check if you are approaching context limits. Context management is essential for long conversations — you must truncate old messages when approaching the model\'s context window limit. Always keep the most recent messages since those are most relevant.',
    },
  ],
  commonMistakes: [
    'Assuming the model remembers previous conversations — each API call is stateless; you must include conversation history in every request',
    'Ignoring token limits — sending very long prompts or document contents that exceed the context window will cause errors or truncation',
    'Trusting AI factual output without verification — models hallucinate confidently; always validate critical facts',
    'Fine-tuning when prompting would suffice — fine-tuning is expensive and time-consuming; try prompt engineering first',
    'Forgetting the knowledge cutoff — models do not know about events after their training data; provide recent information in the prompt',
    'Not counting tokens before building at scale — what costs $0.01 per call costs $10,000/month at 1M calls; model cost early',
  ],
  interviewQuestions: [
    {
      question: 'What is a token in the context of LLMs and why does it matter?',
      answer:
        'A token is the basic unit of text that AI models process — roughly 3-4 characters or 0.75 words in English. Models tokenize input text into tokens before processing, and generate output tokens one at a time. Tokens matter for engineers because: (1) API cost is billed per token, (2) models have a maximum context window measured in tokens, (3) generation speed depends on output token count. Understanding tokens helps you estimate costs, manage context limits, and optimize prompt length.',
      difficulty: 'beginner',
    },
    {
      question: 'What is a context window and what happens when you exceed it?',
      answer:
        'The context window is the maximum number of tokens a model can process in a single inference call — it includes your system prompt, conversation history, and current message. When you exceed the context window, one of two things happens: the API returns an error, or older messages get silently dropped. Well-designed applications track token usage and truncate old conversation history when approaching the limit, keeping the most recent (most relevant) messages.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why do AI models hallucinate, and how do you mitigate it?',
      answer:
        'Models hallucinate because they predict statistically likely next tokens rather than retrieving verified facts. When asked something they do not know, they generate plausible-sounding text anyway. Mitigation strategies: (1) Use RAG — provide real documents as context and instruct the model to only answer from those, (2) Add explicit instructions: "If you do not know, say so", (3) Request sources or citations and verify them, (4) Use temperature=0 for factual tasks to reduce randomness, (5) Build validation layers for critical outputs.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'token-cost-calculator',
      title: 'Build a Token Cost Calculator',
      description:
        'Write a function that estimates the cost of an AI API call before making it. This forces you to think about tokens concretely. Use rough estimates: 1 token ≈ 4 characters. Input tokens and output tokens often have different prices.',
      starterCode: `// Token cost calculator
// Claude Sonnet approximate pricing:
// Input: $3 per 1 million tokens
// Output: $15 per 1 million tokens

interface CostEstimate {
  inputTokens: number;
  maxOutputTokens: number;
  estimatedInputCost: number;
  maxOutputCost: number;
  totalMaxCost: number;
}

function estimateCost(
  systemPrompt: string,
  conversationHistory: string[],
  userMessage: string,
  maxOutputTokens: number
): CostEstimate {
  // TODO: Implement this function
  // 1. Estimate tokens for each part (rough: 1 token ≈ 4 characters)
  // 2. Sum all input tokens
  // 3. Calculate input cost
  // 4. Calculate max output cost
  // 5. Return the estimate

  return {
    inputTokens: 0,
    maxOutputTokens: 0,
    estimatedInputCost: 0,
    maxOutputCost: 0,
    totalMaxCost: 0,
  };
}

// Test it:
const estimate = estimateCost(
  "You are a helpful assistant.",
  ["User: Hello", "Assistant: Hi there!", "User: Tell me about AI"],
  "Explain what tokens are in simple terms",
  500
);
console.log(estimate);`,
      solution: `const INPUT_COST_PER_TOKEN = 3 / 1_000_000;   // $3 per million tokens
const OUTPUT_COST_PER_TOKEN = 15 / 1_000_000; // $15 per million tokens
const CHARS_PER_TOKEN = 4; // rough estimate

function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

function estimateCost(
  systemPrompt: string,
  conversationHistory: string[],
  userMessage: string,
  maxOutputTokens: number
): CostEstimate {
  const systemTokens = estimateTokens(systemPrompt);
  const historyTokens = conversationHistory.reduce(
    (sum, msg) => sum + estimateTokens(msg),
    0
  );
  const messageTokens = estimateTokens(userMessage);
  const inputTokens = systemTokens + historyTokens + messageTokens;

  const estimatedInputCost = inputTokens * INPUT_COST_PER_TOKEN;
  const maxOutputCost = maxOutputTokens * OUTPUT_COST_PER_TOKEN;
  const totalMaxCost = estimatedInputCost + maxOutputCost;

  return {
    inputTokens,
    maxOutputTokens,
    estimatedInputCost: parseFloat(estimatedInputCost.toFixed(6)),
    maxOutputCost: parseFloat(maxOutputCost.toFixed(6)),
    totalMaxCost: parseFloat(totalMaxCost.toFixed(6)),
  };
}

// With our test:
// systemPrompt: 28 chars → 7 tokens
// history: ~60 chars → 15 tokens
// message: 44 chars → 11 tokens
// inputTokens: ~33
// input cost: ~$0.0001
// maxOutputCost (500 tokens): $0.0075
// totalMaxCost: ~$0.0076 per call
// At 100,000 calls/month: ~$760/month`,
      hints: [
        'Rough conversion: 1 token ≈ 4 characters (works well enough for estimation)',
        'Input tokens = system prompt tokens + all message history tokens + current message tokens',
        'You pay for max_tokens even if the model generates fewer — it is the maximum possible output cost',
        'Multiply per-token cost by token count, then divide by 1,000,000 to go from "per million" pricing to actual cost',
      ],
    },
  ],
  keyTakeaways: [
    'The AI pipeline: collect data → train model → save weights → run inference → get predictions',
    'Models have knowledge cutoffs — they do not know about events after their training data ended',
    'Tokens are the unit of text AI processes — roughly 4 characters each — and determine both cost and context limits',
    'Context window is the total tokens a model can see at once — exceeding it drops old content',
    'Models predict next tokens probabilistically — this is why they hallucinate rather than saying "I don\'t know"',
    'Fine-tuning adapts a pre-trained model to a specific domain — but prompting should always be tried first',
  ],
  nextLesson: 'large-language-models',
  prevLesson: 'types-of-ai',
};
