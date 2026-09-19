import type { Lesson } from '@/types';

export const modelTrainingFundamentalsLesson: Lesson = {
  id: 'model-training-fundamentals',
  slug: 'model-training-fundamentals',
  title: 'Model Training Fundamentals',
  description:
    'Understand how AI models are trained — datasets, training loops, validation, testing, fine-tuning, inference, and RLHF — with the practical intuition an engineer needs without deep mathematical theory.',
  category: 'Core Concepts',
  order: 16,
  difficulty: 'intermediate',
  estimatedTime: 35,
  content: `You will never train a frontier model from scratch. That requires hundreds of millions of dollars and thousands of specialized GPUs. But you do need to understand how training works to make good decisions about when to fine-tune, what data to use, and what limitations to expect from trained models.

---

## The Training Pipeline

\`\`\`
TRAINING PIPELINE OVERVIEW

  Raw Data → Processed Dataset → Training → Validation → Testing → Fine-tuning → Inference
      │              │              │             │            │           │           │
  Web crawl      Clean, filter    GPU cluster  Check if    Evaluate   Your data    Serving
  Books          chunk, format    runs for     model is    on held-   adapts      predictions
  GitHub         tokenize         weeks        overfitting  out data   the model   to users
\`\`\`

---

## Dataset

The dataset is the foundation. The model can only learn what is in the training data.

**Data collection**:
- Common Crawl (web), Wikipedia, GitHub, books, academic papers
- For frontier models: petabytes of data
- For fine-tuning: hundreds to millions of examples

**Data processing**:

\`\`\`
RAW DATA PROCESSING STEPS

  1. Deduplication
     Remove near-identical documents
     → Prevents model from memorizing repeated text

  2. Quality filtering
     Remove low-quality content (spam, gibberish, very short texts)
     → Filter by perplexity, length, language

  3. Harmful content removal
     Remove hate speech, illegal content
     → Required for responsible model training

  4. Tokenization
     Convert text to tokens using a tokenizer
     → Consistent tokenization for training and inference

  5. Data mixing
     Balance different types of content (code vs prose vs math)
     → Influences model capabilities
\`\`\`

**Data quality over quantity**: Training on 100GB of high-quality curated data often produces a better model than training on 1TB of noisy data.

---

## Training

Training adjusts model parameters to minimize the error between the model's predictions and the correct outputs.

\`\`\`
SIMPLIFIED TRAINING LOOP

  For each batch of training examples:
    1. Forward pass: Run input through model → get prediction
    2. Calculate loss: How wrong was the prediction?
    3. Backward pass: Calculate how to adjust each parameter
    4. Gradient update: Adjust parameters to reduce error

  Repeat billions of times across the entire dataset
  (multiple epochs / passes through the data)
\`\`\`

**Why GPUs?**:
Training requires billions of parallel multiply-accumulate operations (matrix math). GPUs have thousands of cores specifically designed for this. A model that would take years to train on CPU takes weeks on GPU clusters.

**Hyperparameters**:
Settings that control training (not learned from data):
- Learning rate: How big are the parameter adjustments per step?
- Batch size: How many examples to process at once?
- Number of epochs: How many times to pass through all data?
- Context length: Maximum sequence length during training

---

## Validation

During training, you periodically check performance on a **validation set** — data the model has never seen.

\`\`\`
WHY VALIDATION MATTERS — OVERFITTING

  Overfitting: Model memorizes training data rather than learning general patterns

  Training loss: very low (model "knows" the training data)
  Validation loss: stays high or increases (model cannot generalize)

  This is like a student who memorizes answers for past exams
  but cannot solve new problems.

  Correct training behavior:
  → Training loss decreases
  → Validation loss decreases in parallel
  → Stop training when validation loss stops improving
\`\`\`

---

## Testing

After training, evaluate on a **test set** — data held out from both training and validation.

This gives an unbiased estimate of real-world performance. If you used the validation set to make decisions, it has influenced training (indirectly). The test set is truly unseen.

**AI benchmarks** are standardized test sets:
- MMLU (Massive Multitask Language Understanding) — academic knowledge
- HumanEval — code generation
- GSM8K — math word problems
- BIG-Bench — diverse reasoning tasks

When a company claims "Claude scores 87% on MMLU", they are reporting test set performance on this standardized benchmark.

**Important caveat**: Benchmarks can be gamed (intentional or unintentional data contamination). High benchmark scores do not always predict real-world usefulness on your specific task.

---

## Fine-Tuning

Fine-tuning adapts a pre-trained model to a specific task or domain by training it further on targeted examples.

\`\`\`
FINE-TUNING FLOW

  Pre-trained Model                 Fine-tuned Model
  (trained on internet)      +      (your task-specific data)
         │                                    │
  Knows everything              Specialized in your domain
  in general      ──────────►   while retaining general knowledge
\`\`\`

**Types of fine-tuning**:

*Full fine-tuning*: Adjust all model parameters. Most effective but requires significant GPU compute.

*Parameter Efficient Fine-tuning (PEFT / LoRA)*: Only adjust a small subset of parameters. Dramatically reduces GPU memory requirements. Quality comparable to full fine-tuning for many tasks.

*Instruction tuning*: Fine-tune on instruction-following examples. Transforms a completion model into an instruction-following assistant.

**Fine-tuning data format**:
\`\`\`json
[
  {
    "input": "Classify this customer email as: complaint, inquiry, or praise.\nEmail: 'I have been waiting for my order for 3 weeks!'",
    "output": "complaint"
  },
  {
    "input": "Classify this customer email as: complaint, inquiry, or praise.\nEmail: 'When will the new model be released?'",
    "output": "inquiry"
  }
]
\`\`\`

Hundreds to thousands of these examples teach the model the task.

---

## Inference

Inference is running a trained model to get predictions. This is what happens on every API call.

\`\`\`
INFERENCE MODES

  Batch inference:
  → Process many inputs at once (offline)
  → More efficient use of GPU compute
  → Example: Generate reports for 10,000 customers overnight

  Real-time inference:
  → Single request, immediate response
  → What AI API calls do
  → Latency is critical

  Streaming inference:
  → Return tokens as generated
  → Better UX for long responses
  → What you see in Claude and ChatGPT
\`\`\`

**Inference optimization techniques**:
- **Quantization**: Reduce parameter precision (float32 → int8) to use less memory and run faster
- **KV caching**: Cache computed attention values for repeated prompts
- **vLLM / PagedAttention**: Efficient memory management for serving many simultaneous requests

---

## RLHF — Reinforcement Learning from Human Feedback

RLHF is the technique used to make models helpful, harmless, and honest. It is why Claude and ChatGPT are useful assistants rather than raw text completers.

\`\`\`
RLHF PIPELINE

  Stage 1: Supervised Fine-tuning (SFT)
  → Collect demonstration data (human writes ideal responses)
  → Fine-tune model on these demonstrations
  → Model learns basic instruction following

  Stage 2: Reward Model Training
  → Show human raters two model responses
  → Human picks the better one
  → Train a reward model to predict human preferences

  Stage 3: Reinforcement Learning (PPO)
  → Use reward model to score model outputs
  → Train model to produce outputs the reward model scores highly
  → Model learns to produce outputs humans prefer

  Result: Model that is helpful, harmless, and follows instructions
\`\`\`

**Why RLHF matters to you as an engineer**:
Without RLHF, a language model that completes text is not useful. With RLHF, it becomes an assistant that follows instructions, refuses harmful requests, and produces helpful responses. Claude, ChatGPT, and Gemini all use variants of RLHF.

\`\`\`
WITHOUT RLHF                   WITH RLHF
──────────────────────────────────────────────────
User: "Write a poem"           User: "Write a poem"
                               (about what? any style?)
Model: "The user writes..."    Model: "Sure! What theme
(continuing the prompt         and style would you like?"
as if it were text, not
an instruction)
\`\`\``,
  codeExamples: [
    {
      title: 'Preparing Fine-tuning Data and Calling Fine-tuned Models',
      code: `// Preparing data for fine-tuning (OpenAI format)
// Fine-tuning trains on {prompt, completion} pairs

interface FineTuningExample {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

// Helper to create fine-tuning examples
function createExample(
  systemPrompt: string,
  userInput: string,
  idealOutput: string
): FineTuningExample {
  return {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
      { role: 'assistant', content: idealOutput },
    ],
  };
}

// Example: Fine-tuning data for customer email classification
const classificationSystem = 'Classify the customer email. Reply with one word: complaint, inquiry, or praise.';

const trainingData: FineTuningExample[] = [
  createExample(
    classificationSystem,
    "I've been waiting for my order for 3 weeks and nobody is responding to my emails!",
    'complaint'
  ),
  createExample(
    classificationSystem,
    "What payment methods do you accept?",
    'inquiry'
  ),
  createExample(
    classificationSystem,
    "Just received my order and it exceeded my expectations! Love the quality.",
    'praise'
  ),
  createExample(
    classificationSystem,
    "My account has been charged twice for the same order",
    'complaint'
  ),
  createExample(
    classificationSystem,
    "Is there a discount for bulk orders over 100 units?",
    'inquiry'
  ),
];

// Save as JSONL file for OpenAI fine-tuning
const jsonl = trainingData.map(ex => JSON.stringify(ex)).join('\\n');
console.log('Training data (JSONL format):');
console.log(jsonl);
// Upload this file to OpenAI's fine-tuning API

// ---

// After fine-tuning, calling the fine-tuned model
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function classifyEmailWithFineTuned(email: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-4o-mini:your-org::your-model-id', // Fine-tuned model ID
    messages: [
      { role: 'system', content: classificationSystem },
      { role: 'user', content: email },
    ],
    max_tokens: 10,
    temperature: 0,
  });
  return response.choices[0].message.content?.trim() ?? 'unknown';
}`,
      explanation:
        'Fine-tuning data is formatted as conversations — system prompt + user message + ideal assistant response. You prepare hundreds of these examples, upload to the provider, and receive a fine-tuned model ID. The fine-tuned model then handles your specific task with better consistency than prompt engineering alone, and often at lower cost (smaller model can replace larger one).',
    },
  ],
  commonMistakes: [
    'Fine-tuning when prompt engineering would work — fine-tuning is expensive and time-consuming; always try prompting first',
    'Not holding out a validation and test set — without validation, you cannot detect overfitting; without test set, you do not know real performance',
    'Using low-quality training data — "garbage in, garbage out" applies directly; 100 high-quality examples often beats 1000 poor ones',
    'Expecting fine-tuning to add new knowledge — fine-tuning improves behavior and style; it does not reliably add factual knowledge the model did not have',
    'Ignoring data leakage — if test set data appears in training data, your evaluation is invalid (model has seen the answers)',
    'Relying solely on benchmarks to choose models — benchmark performance and performance on your specific task can differ significantly; always test on your actual use case',
  ],
  interviewQuestions: [
    {
      question: 'What is overfitting in model training and how do you prevent it?',
      answer:
        'Overfitting is when a model memorizes training data patterns instead of learning generalizable rules — it performs well on training data but poorly on new data. Signs: training loss decreases but validation loss plateaus or increases. Prevention: (1) Use a validation set and stop training when validation loss stops improving (early stopping), (2) Use more training data, (3) Use regularization techniques, (4) Use data augmentation, (5) Reduce model complexity if appropriate. For fine-tuning specifically: using too many epochs on a small dataset commonly causes overfitting.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is RLHF and why does it matter for the AI models you use?',
      answer:
        'RLHF (Reinforcement Learning from Human Feedback) is the training technique that makes raw language models into useful assistants. A base model trained on text just completes text patterns. RLHF adds three stages: (1) Supervised fine-tuning on human-written ideal responses, (2) Reward model training — humans rank model outputs, the reward model learns to predict these preferences, (3) RL optimization — the model is trained to generate outputs that the reward model scores highly. This transforms a text completer into an assistant that follows instructions, refuses harmful requests, and calibrates responses to be helpful. Claude, GPT-4, Gemini all use RLHF variants.',
      difficulty: 'intermediate',
    },
    {
      question: 'When would you use fine-tuning instead of prompt engineering?',
      answer:
        'Fine-tuning is appropriate when: (1) you need consistent behavior that is very hard to achieve with a prompt (e.g., very specific output format, domain-specific tone), (2) you need to run a smaller, faster, cheaper model for a specific task (fine-tuned small model can match large model on narrow task), (3) you have labeled training data and the task has a specific pattern, (4) you need very high volume and the smaller fine-tuned model will have lower inference cost. Do NOT fine-tune when: prompt engineering works well enough, you need the model to have new factual knowledge (use RAG instead), or your data changes frequently (re-training is expensive).',
      difficulty: 'advanced',
    },
  ],
  exercises: [
    {
      id: 'design-fine-tuning-dataset',
      title: 'Design a Fine-tuning Dataset',
      description:
        'Design a fine-tuning dataset for a specific task. Identify the input-output pairs, write 5 example pairs, and explain what the model should learn from them.',
      starterCode: `// Fine-tuning dataset design exercise

// Choose a task that would benefit from fine-tuning:
// - Customer email classification
// - Code style enforcement (convert to your company's style)
// - Product description writing (in your brand's tone)
// - Bug report summarization
// - Medical symptom intake → structured data

const myFineTuningProject = {
  task: "", // What task are you fine-tuning for?

  whyNotPrompting: "", // Why is fine-tuning better than prompting for this task?

  systemPrompt: "", // What system prompt guides the model?

  // Write 5 training examples
  examples: [
    { userInput: "", idealOutput: "" },
    { userInput: "", idealOutput: "" },
    { userInput: "", idealOutput: "" },
    { userInput: "", idealOutput: "" },
    { userInput: "", idealOutput: "" },
  ],

  // How many examples would you need for real fine-tuning?
  estimatedDatasetSize: "",

  // How would you validate the fine-tuned model works?
  evaluationStrategy: "",
};`,
      solution: `// Example: Fine-tuning for legal document clause classification

const myFineTuningProject = {
  task: "Classify legal contract clauses by type: liability, termination, confidentiality, payment, governing_law, or other",

  whyNotPrompting: "Legal document classification needs very consistent output across thousands of documents per day. The output must be exactly one of 6 labels (no variation). A fine-tuned small model would be 10x cheaper than using GPT-4 for each clause. We also have 5,000 labeled examples from our legal team — perfect for fine-tuning.",

  systemPrompt: "You are a legal clause classifier. Classify the given clause as one of: liability, termination, confidentiality, payment, governing_law, other. Respond with only the classification label.",

  examples: [
    {
      userInput: "Neither party shall be liable for indirect, incidental, or consequential damages arising from this agreement.",
      idealOutput: "liability",
    },
    {
      userInput: "Either party may terminate this agreement with 30 days written notice.",
      idealOutput: "termination",
    },
    {
      userInput: "The receiving party agrees to maintain confidential all proprietary information disclosed under this agreement.",
      idealOutput: "confidentiality",
    },
    {
      userInput: "Payment is due within net-30 days of invoice date. Late payments accrue 1.5% monthly interest.",
      idealOutput: "payment",
    },
    {
      userInput: "This agreement shall be governed by the laws of the State of Delaware.",
      idealOutput: "governing_law",
    },
  ],

  estimatedDatasetSize: "500-2000 examples (100 per class minimum, 300-400 per class ideally). Our legal team has 5000 labeled examples, so we have more than enough.",

  evaluationStrategy: "Hold out 20% of labeled data (1000 examples) for evaluation. Measure: (1) per-class accuracy (each of the 6 classes separately), (2) overall accuracy, (3) confusion matrix to see which classes the model confuses with each other. Target: >95% overall accuracy. Compare against baseline: GPT-4 with prompting only.",
};`,
      hints: [
        'Pick a task where output is structured and consistent — classification, extraction, or format transformation',
        'Why not prompting? Good answers include: need for high volume efficiency, very specific output format, consistent tone/style',
        'More examples per class = better accuracy; at minimum 50-100 examples per label for classification',
        'Evaluation strategy should use held-out data the model never trained on',
      ],
    },
  ],
  keyTakeaways: [
    'Training pipeline: data collection → processing → training loop → validation → testing → fine-tuning → inference',
    'Models learn to minimize prediction error across billions of training examples — more quality data = better models',
    'Validation set detects overfitting; test set gives unbiased final evaluation — both are necessary',
    'RLHF is what transforms a text-completion model into a helpful assistant — Claude, GPT-4, Gemini all use it',
    'Fine-tuning adapts a pre-trained model to a specific task — but always try prompt engineering first',
    'You rarely train from scratch; you use pre-trained models via API and fine-tune when necessary',
  ],
  nextLesson: 'fine-tuning',
  prevLesson: 'building-ai-products',
};
