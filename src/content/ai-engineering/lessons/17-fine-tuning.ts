import type { Lesson } from '@/types';

export const fineTuningLesson: Lesson = {
  id: 'fine-tuning',
  slug: 'fine-tuning',
  title: 'Fine-Tuning',
  description:
    'Understand what fine-tuning is, when to use it vs RAG or prompting, the real costs and tradeoffs, and how to approach it practically as a software engineer.',
  category: 'Advanced AI',
  order: 17,
  difficulty: 'intermediate',
  estimatedTime: 35,
  content: `Fine-tuning gets talked about often and misunderstood often. Many developers reach for it too quickly, when prompt engineering or RAG would have been sufficient. This module gives you a clear framework for when fine-tuning makes sense — and when it does not.

---

## What Fine-Tuning Is

Fine-tuning is the process of taking a pre-trained model and continuing training on a smaller, targeted dataset to adapt it for a specific task.

\`\`\`
FINE-TUNING MENTAL MODEL

  General pre-trained model                     Fine-tuned model
  (like a generalist consultant)  ──────────►   (domain specialist)

  Knows about everything in general              Knows your domain deeply
  Follows general conventions                    Follows your specific conventions
  Generic writing style                          Your brand voice
  General code patterns                          Your company's code style

  Fine-tuning is additional training on YOUR data
  using the pre-trained model as starting point.
\`\`\`

---

## Why Fine-Tune?

There are legitimate reasons to fine-tune — but fewer than most developers think.

**1. Style and tone consistency**

If you need every output to sound exactly like your brand, or follow your code style guide, prompt engineering can get you 80% there. Fine-tuning can get you 95%+ with consistent behavior across all outputs.

**2. Task efficiency**

A fine-tuned GPT-4o-mini can often match GPT-4o performance on a narrow task — at 10x lower cost. If you have 1M queries/month, this cost difference matters enormously.

**3. Input/output pattern learning**

Some tasks have very specific input-output patterns that are hard to describe in a prompt but easy to demonstrate with examples.

**4. Confidential examples**

Sometimes your training examples contain information you do not want in the prompt on every call (security, privacy). Fine-tuned behavior does not appear in prompts.

---

## When NOT to Fine-Tune

This is more important than knowing when to fine-tune.

\`\`\`
DO NOT FINE-TUNE WHEN:

  ❌ Prompt engineering works well enough
     → Try prompting first; always

  ❌ You want to add new knowledge
     → Fine-tuning teaches behavior, not facts
     → Use RAG for knowledge

  ❌ Your data changes frequently
     → Re-training is slow and expensive
     → Use RAG for dynamic knowledge

  ❌ You have very few examples (< 50-100)
     → Insufficient for quality fine-tuning
     → Use few-shot prompting instead

  ❌ You need to deploy quickly
     → Fine-tuning takes days to weeks
     → Prompting is instant

  ❌ The task is complex multi-step reasoning
     → Fine-tuning helps with behavior, not reasoning
     → Large frontier models reason better regardless
\`\`\`

---

## Fine-Tuning vs RAG — The Key Distinction

This is the most important comparison to understand.

\`\`\`
FINE-TUNING vs RAG

┌────────────────────┬──────────────────────────┬─────────────────────────────┐
│                    │ Fine-Tuning              │ RAG                         │
├────────────────────┼──────────────────────────┼─────────────────────────────┤
│ What it does       │ Changes model behavior   │ Provides context at runtime │
├────────────────────┼──────────────────────────┼─────────────────────────────┤
│ Best for           │ Style, format, tone,     │ Factual knowledge, docs,    │
│                    │ task-specific patterns   │ private data, changing info │
├────────────────────┼──────────────────────────┼─────────────────────────────┤
│ Data freshness     │ Stale — must retrain     │ Always current              │
│                    │ to update                │                             │
├────────────────────┼──────────────────────────┼─────────────────────────────┤
│ Transparency       │ Opaque — behavior in     │ Explicit — you can see      │
│                    │ weights                  │ what context was retrieved  │
├────────────────────┼──────────────────────────┼─────────────────────────────┤
│ Cost               │ Training: $10-$1000+     │ Embedding + vector DB       │
│                    │ Inference: cheaper       │ ~$0.01-$0.10/user/month     │
├────────────────────┼──────────────────────────┼─────────────────────────────┤
│ Speed              │ Days to weeks            │ Hours to deploy             │
└────────────────────┴──────────────────────────┴─────────────────────────────┘

COMBINATION PATTERN:
  Fine-tune for behavior/style → RAG for knowledge → Best of both
\`\`\`

---

## Costs and Tradeoffs

### Training Costs

Fine-tuning costs have come down dramatically. But they are not free.

\`\`\`
FINE-TUNING COST ESTIMATES (approximate, check provider for current pricing)

  OpenAI GPT-4o-mini fine-tuning:
  → ~$3 per million training tokens
  → 1000 examples × 500 tokens avg = 500K tokens = ~$1.50 training cost
  → 10,000 examples = $15 training cost
  → Reasonable for most applications

  OpenAI GPT-4o fine-tuning:
  → ~$25 per million training tokens
  → 10,000 examples = $125 training cost
  → Worth it only if quality difference is significant

  Inference cost after fine-tuning:
  → Fine-tuned model costs same as base model
  → But if you fine-tune a smaller model to match a larger one's quality:
  → gpt-4o-mini inference < gpt-4o inference → significant savings at scale
\`\`\`

### Quality Tradeoffs

Fine-tuned models can regress on capabilities outside the fine-tuning domain. If you fine-tune for email classification, the model may become worse at general conversation. This is called **catastrophic forgetting**.

Use a smaller model for fine-tuning. Fine-tuning a 70B parameter model when GPT-4o-mini would work is wasteful.

---

## Data Requirements

The quality and quantity of fine-tuning data determines the quality of the fine-tuned model.

\`\`\`
FINE-TUNING DATA GUIDELINES

  Minimum examples: 50-100 (for simple tasks)
  Recommended: 500-5000
  Complex tasks: 5000-50000

  Data quality checklist:
  ✅ Every example has correct input and ideal output
  ✅ Examples cover the full range of inputs you expect
  ✅ No contradictory examples (same input, different outputs)
  ✅ Diverse examples (not all the same pattern)
  ✅ Hold out 10-20% for validation/testing

  Data collection approaches:
  → Hire domain experts to create examples
  → Use existing labeled data (if you have it)
  → Generate with GPT-4 and have humans verify
  → Collect from user interactions (with consent)
\`\`\`

---

## The Decision Framework

\`\`\`
FINE-TUNING DECISION TREE

  Does the task work with prompt engineering?
  ├── YES → Use prompting (and stop here)
  └── NO ↓

  Is the main issue knowledge / factual content?
  ├── YES → Use RAG (and stop here)
  └── NO ↓

  Is the main issue behavior / style / format consistency?
  ├── NO → Reconsider what you are trying to achieve
  └── YES ↓

  Do you have enough quality labeled examples (100+)?
  ├── NO → Collect data first (or use few-shot prompting)
  └── YES ↓

  Is high-volume inference cost a significant concern?
  ├── YES → Fine-tune a smaller model to match quality of larger
  └── NO ↓

  Can you accept the time cost (days to weeks)?
  ├── YES → Proceed with fine-tuning
  └── NO → Try prompting more aggressively first
\`\`\`

---

## Practical Fine-Tuning Process

\`\`\`
STEP-BY-STEP FINE-TUNING

  1. Establish baseline (IMPORTANT — skip this and you waste money)
     → Test with best prompt on GPT-4o or Claude Sonnet
     → Measure quality on 50-100 test examples
     → Is this good enough? If yes, STOP.

  2. Try few-shot prompting in system prompt
     → Include 5-10 examples directly in the prompt
     → Does quality improve enough? If yes, STOP.

  3. Prepare fine-tuning dataset
     → Create 500-2000 high-quality input-output pairs
     → Format as JSONL with messages field
     → Validate: no duplicates, no errors, diverse examples

  4. Validate dataset
     → Use provider's validation tools (OpenAI has built-in checks)
     → Check token count (you pay per training token)

  5. Start fine-tuning job
     → Choose base model (gpt-4o-mini for cost, gpt-4o for quality)
     → Monitor training (loss should decrease steadily)

  6. Evaluate fine-tuned model
     → Test on held-out validation set
     → Compare to baseline on same test cases
     → If not better than baseline, your dataset had issues

  7. Iterate if needed
     → Add more diverse examples
     → Fix contradictions in training data
     → Try different hyperparameters (epochs, learning rate)

  8. Deploy with monitoring
     → Track output quality in production
     → Collect failures for next training iteration
\`\`\``,
  codeExamples: [
    {
      title: 'Preparing and Uploading Fine-tuning Data (OpenAI)',
      code: `import OpenAI from 'openai';
import * as fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fine-tuning data format — messages array format
interface FineTuningMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface FineTuningExample {
  messages: FineTuningMessage[];
}

// Create training data for email tone classifier
const systemPrompt =
  'Analyze the tone of the email and respond with exactly one word: formal, casual, or aggressive.';

const trainingExamples: FineTuningExample[] = [
  {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Dear Mr. Johnson, I hope this email finds you well. I am writing to follow up on our previous correspondence regarding the quarterly review.' },
      { role: 'assistant', content: 'formal' },
    ],
  },
  {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Hey! Just checking in on those slides you were going to send. No rush!' },
      { role: 'assistant', content: 'casual' },
    ],
  },
  {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'I have been waiting THREE WEEKS for a response. This is completely unacceptable and I demand an explanation immediately.' },
      { role: 'assistant', content: 'aggressive' },
    ],
  },
  // In production: 500+ examples for each class
];

// Save as JSONL (one JSON object per line)
function saveAsJSONL(examples: FineTuningExample[], path: string): void {
  const jsonl = examples.map(ex => JSON.stringify(ex)).join('\\n');
  fs.writeFileSync(path, jsonl);
  console.log(\`Saved \${examples.length} examples to \${path}\`);
}

saveAsJSONL(trainingExamples, 'training.jsonl');

// Upload to OpenAI and start fine-tuning
async function startFineTuning(): Promise<string> {
  // 1. Upload training file
  const file = await openai.files.create({
    file: fs.createReadStream('training.jsonl'),
    purpose: 'fine-tune',
  });
  console.log('File uploaded:', file.id);

  // 2. Create fine-tuning job
  const job = await openai.fineTuning.jobs.create({
    training_file: file.id,
    model: 'gpt-4o-mini', // Base model to fine-tune
    hyperparameters: {
      n_epochs: 3, // How many times to train on the full dataset
    },
  });
  console.log('Fine-tuning job created:', job.id);
  console.log('Status:', job.status); // 'queued' initially

  return job.id;
}

// Check status of fine-tuning job
async function checkJobStatus(jobId: string): Promise<void> {
  const job = await openai.fineTuning.jobs.retrieve(jobId);
  console.log('Status:', job.status); // queued → running → succeeded/failed
  console.log('Trained tokens:', job.trained_tokens);

  if (job.fine_tuned_model) {
    console.log('Fine-tuned model ID:', job.fine_tuned_model);
    // e.g., "ft:gpt-4o-mini:your-org::AbCdEfGh"
  }
}

// Use the fine-tuned model
async function classifyWithFineTunedModel(
  email: string,
  fineTunedModelId: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: fineTunedModelId, // Your fine-tuned model
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: email },
    ],
    max_tokens: 5,
    temperature: 0,
  });
  return response.choices[0].message.content?.trim().toLowerCase() ?? 'unknown';
}`,
      explanation:
        'The fine-tuning workflow: (1) create training examples in JSONL format with messages arrays, (2) upload the file to OpenAI, (3) create a fine-tuning job, (4) wait for it to complete (takes minutes to hours), (5) use the returned fine-tuned model ID just like any other model. The fine-tuned model ID looks like "ft:gpt-4o-mini:your-org::AbCdEfGh".',
    },
  ],
  commonMistakes: [
    'Fine-tuning before trying prompt engineering — always try prompting first; it is faster, cheaper, and often sufficient',
    'Using fine-tuning to add factual knowledge — fine-tuning bakes in behavior patterns, not facts; use RAG for knowledge',
    'Too few training examples — 10-20 examples is not enough; you need hundreds for reliable behavior',
    'Contradictory training data — if some examples say "output JSON" and others say "output plain text" for similar inputs, the model will be confused',
    'Not establishing a baseline — if you do not measure performance before fine-tuning, you cannot tell if fine-tuning helped',
    'Fine-tuning the largest model — start with a small model (GPT-4o-mini); fine-tuning often allows a small model to match a large model on narrow tasks at much lower inference cost',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between fine-tuning and RAG, and when do you use each?',
      answer:
        'Fine-tuning changes model behavior — it adapts the model\'s style, tone, format, or task-specific patterns. It is good for: consistent brand voice, specific output formats, task efficiency (smaller fine-tuned model = cheaper inference). RAG provides context at inference time — it gives the model real documents to answer from. It is good for: factual knowledge, private documents, frequently changing information, citeable sources. Use both together: fine-tune for behavior/style, RAG for knowledge. Default: try RAG first — it is faster to deploy, cheaper, and easier to update.',
      difficulty: 'intermediate',
    },
    {
      question: 'What are the risks of fine-tuning, and how do you mitigate them?',
      answer:
        'Key risks: (1) Catastrophic forgetting — model may degrade on tasks outside the fine-tuning domain; mitigate by keeping fine-tuning data diverse and testing capabilities beyond your target task; (2) Overfitting — model memorizes training examples instead of generalizing; mitigate with more data, fewer epochs, and validation monitoring; (3) Data quality issues — bad training examples make a worse model; mitigate by auditing data carefully and hiring domain experts to review; (4) Stale knowledge — fine-tuned knowledge is frozen at training time; use RAG alongside fine-tuning for dynamic knowledge.',
      difficulty: 'advanced',
    },
    {
      question: 'How would you evaluate whether your fine-tuned model is better than the base model?',
      answer:
        'Establish a baseline before fine-tuning: collect 50-200 representative test examples with known correct outputs. Evaluate both base model (with your best prompt) and fine-tuned model on the same test set. Measure: (1) task-specific accuracy (e.g., classification accuracy), (2) output format consistency (does it always return valid JSON?), (3) inference cost per query (fine-tuned smaller model vs base large model), (4) latency. A fine-tuned model that does not outperform the base model on your test set indicates a dataset issue — contradictions, insufficient examples, or wrong base model choice.',
      difficulty: 'advanced',
    },
  ],
  exercises: [
    {
      id: 'fine-tuning-decision',
      title: 'Make the Fine-Tuning Decision',
      description:
        'For each scenario, decide whether to use prompting, RAG, or fine-tuning. Explain your reasoning. There is rarely one right answer — what matters is your reasoning process.',
      starterCode: `// For each scenario, choose your approach and explain why

const scenarios = [
  {
    scenario: "A law firm wants their AI to always format legal citations in the Bluebook style (a specific, complex format) consistently across thousands of documents per month",
    approach: "", // prompting | RAG | fine-tuning | combination
    reasoning: "",
    dataNeeded: "", // What data would you need for your approach?
  },
  {
    scenario: "A hospital wants an AI to answer patient questions using ONLY information from their official medical protocols (which are updated monthly)",
    approach: "",
    reasoning: "",
    dataNeeded: "",
  },
  {
    scenario: "A startup wants an AI to write product descriptions in their specific brand voice for 50,000 products",
    approach: "",
    reasoning: "",
    dataNeeded: "",
  },
  {
    scenario: "A customer support team wants AI to automatically classify 10,000 incoming tickets/day into 20 categories for routing",
    approach: "",
    reasoning: "",
    dataNeeded: "",
  },
];`,
      solution: `const scenarios = [
  {
    scenario: "Law firm wants Bluebook citation style consistently across thousands of docs per month",
    approach: "fine-tuning",
    reasoning: "Bluebook style has very specific, complex rules that are hard to fully express in a prompt. The format is consistent (not based on changing facts). High volume (thousands of docs/month) means a fine-tuned smaller model will be much cheaper than calling GPT-4 with a large style guide prompt. Prompting gets you 80% there; fine-tuning gets you 98%+.",
    dataNeeded: "500-2000 examples of text with incorrectly or uncited references → correctly formatted Bluebook citations. Can be generated by a junior attorney or paralegal reviewing model outputs.",
  },
  {
    scenario: "Hospital wants AI to answer patient questions from official medical protocols updated monthly",
    approach: "RAG",
    reasoning: "The content changes monthly — re-training fine-tuning every month is expensive and slow. RAG lets you update the protocol documents in the knowledge base and they are immediately available. This is exactly what RAG is designed for: answering questions from specific source documents. Fine-tuning cannot reliably 'bake in' factual medical protocols — it teaches behavior, not facts.",
    dataNeeded: "All official medical protocol documents indexed in a vector database. Update the index when protocols change.",
  },
  {
    scenario: "50,000 product descriptions in startup's brand voice",
    approach: "combination (fine-tuning for voice + prompting for product details)",
    reasoning: "Brand voice is about consistent style/tone — perfect for fine-tuning. Each product description is unique (different features) — this content must come from the product data in the prompt. Fine-tune on examples of your brand voice, then at inference time provide product details in the prompt. Alternative: a very detailed brand voice system prompt might be sufficient without fine-tuning — try prompting first.",
    dataNeeded: "For fine-tuning: 200-500 examples of [product data] → [brand voice description]. For prompting only: a detailed style guide with examples in the system prompt.",
  },
  {
    scenario: "10,000 tickets/day into 20 categories",
    approach: "fine-tuning",
    reasoning: "Classification into fixed categories with consistent output is the ideal fine-tuning use case. At 10K tickets/day, cost matters — a fine-tuned gpt-4o-mini model (10x cheaper than gpt-4o) that achieves the same classification accuracy is the right move. You likely have historical ticket data already labeled by your team — this is the training dataset. Prompting with 20 category definitions works but may be inconsistent; fine-tuning provides reliability.",
    dataNeeded: "Historical labeled tickets — ideally 500 per category (10,000 examples total for 20 categories). If you do not have this, start with prompting and collect labeled data over time.",
  },
];`,
      hints: [
        'Fine-tuning is best for: consistent behavior, style/format, task efficiency at high volume',
        'RAG is best for: factual knowledge, frequently changing content, private documents',
        'Prompting is always fastest to deploy — establish it as baseline before anything else',
        'Ask: "Is this a knowledge problem or a behavior problem?" — knowledge → RAG, behavior → fine-tuning',
      ],
    },
  ],
  keyTakeaways: [
    'Fine-tuning adapts model behavior — style, tone, format consistency — NOT factual knowledge',
    'Always try prompt engineering first, then RAG, then fine-tuning — in that order',
    'Fine-tuning vs RAG: fine-tune for behavior, use RAG for knowledge — combine them for best results',
    'Data quality matters more than quantity — 500 excellent examples > 5000 contradictory ones',
    'Fine-tuning a smaller model to match a larger model\'s quality on a narrow task is the main cost optimization use case',
    'Establish a clear baseline before fine-tuning — if you cannot measure improvement, you cannot know if it helped',
  ],
  nextLesson: 'ai-security-and-safety',
  prevLesson: 'model-training-fundamentals',
};
