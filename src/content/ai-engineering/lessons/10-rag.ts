import type { Lesson } from '@/types';

export const ragLesson: Lesson = {
  id: 'rag',
  slug: 'rag',
  title: 'Retrieval Augmented Generation (RAG)',
  description:
    'Understand what RAG is, why it exists, how the full architecture works, and how to build a production RAG system that answers questions from your own documents accurately.',
  category: 'Building with AI',
  order: 10,
  difficulty: 'intermediate',
  estimatedTime: 50,
  content: `RAG is one of the most important patterns in AI engineering. It solves a fundamental problem: LLMs do not know your private data, and they hallucinate when asked about things they do not know.

RAG is how you build an AI that answers questions accurately about your company's documentation, your codebase, your customer data, or any domain-specific knowledge — without training a new model.

---

## What Is RAG?

RAG stands for Retrieval Augmented Generation.

- **Retrieval**: Find the most relevant information for a query (from your documents)
- **Augmented**: Add that information to the prompt
- **Generation**: The LLM generates an answer grounded in the retrieved information

\`\`\`
WITHOUT RAG

  User: "What is our refund policy?"
  LLM: "Most companies have a 30-day refund policy..." (hallucinated, generic)

WITH RAG

  User: "What is our refund policy?"
    │
    │  1. Retrieve: Search your policy docs for "refund policy"
    │     → Found: "All purchases are eligible for refund within 14 days..."
    │
    │  2. Augment: Add to prompt:
    │     "Use this document: [policy text]"
    │
    │  3. Generate: LLM answers based on real document
    │
    ▼
  LLM: "According to your policy, purchases are eligible for refund
        within 14 days of purchase. Full refund on unused items..."
  (Accurate, sourced from your actual document)
\`\`\`

---

## Why RAG Exists

LLMs have three fundamental limitations that RAG addresses:

**1. Knowledge cutoff**
LLMs are trained on data up to a certain date. They do not know about events, products, or documents created after that date. RAG solves this by retrieving current information at query time.

**2. Private data**
LLMs are trained on public internet data. They know nothing about your company's internal documents, customer records, or private codebases. RAG solves this by retrieving your private data and injecting it into the prompt.

**3. Hallucination**
When an LLM does not know something, it often makes up a plausible-sounding answer. RAG reduces hallucination by grounding the model in retrieved facts and instructing it to only answer from those facts.

\`\`\`
THE THREE PROBLEMS RAG SOLVES

  Problem              Without RAG              With RAG
  ──────────────────────────────────────────────────────────────────
  Knowledge cutoff     LLM doesn't know news    Retrieve live/recent docs
                       from last week

  Private data         LLM doesn't know         Retrieve from your
                       your company docs         indexed knowledge base

  Hallucination        LLM fabricates           LLM answers from retrieved
                       plausible answer          source material only
\`\`\`

---

## RAG Architecture

\`\`\`
COMPLETE RAG ARCHITECTURE

  PHASE 1: INDEXING (done in advance)
  ─────────────────────────────────────────────────────────────────
  Source Documents (PDFs, docs, web pages, databases)
        │
        │ 1. Load and parse
        │
        ▼
  Raw text content
        │
        │ 2. Chunk into segments (~500 tokens each)
        │
        ▼
  Text chunks
        │
        │ 3. Embed each chunk (OpenAI, Voyage, etc.)
        │
        ▼
  Chunk embeddings
        │
        │ 4. Store in vector database with metadata
        │
        ▼
  Vector Database (indexed, ready to query)

  ─────────────────────────────────────────────────────────────────
  PHASE 2: RETRIEVAL + GENERATION (per query)
  ─────────────────────────────────────────────────────────────────
  User Query: "What is the cancellation policy?"
        │
        │ 5. Embed the query
        │
        ▼
  Query vector
        │
        │ 6. Search vector database for top-K similar chunks
        │
        ▼
  Top 3-5 relevant chunks
        │
        │ 7. Build augmented prompt:
        │    system: "Answer only from the provided context"
        │    context: [chunk1] [chunk2] [chunk3]
        │    user: "What is the cancellation policy?"
        │
        ▼
  LLM generates answer grounded in retrieved context
        │
        ▼
  Accurate, sourced response to user
\`\`\`

---

## Retrieval — Finding the Right Chunks

The quality of RAG depends heavily on retrieval quality. If you retrieve the wrong chunks, the LLM will either answer incorrectly or say it does not have the information.

### Retrieval Strategies

**Dense retrieval (semantic search)**
Use embeddings and vector similarity. Finds semantically related chunks even without keyword overlap. What we have been building.

**Sparse retrieval (keyword search)**
Traditional BM25 / TF-IDF search. Great for exact keyword matches, product names, error codes, IDs.

**Hybrid retrieval (best of both)**
Combine dense and sparse retrieval — semantic understanding + keyword precision. Most production RAG systems use hybrid retrieval.

\`\`\`
RETRIEVAL COMPARISON

  Query: "What does error code E403 mean?"

  Dense (semantic): might find "permission denied" content
  but could miss exact "E403" reference if the concept
  is explained differently

  Sparse (keyword): finds exact "E403" matches

  Hybrid: finds BOTH — the exact reference AND related explanations
\`\`\`

---

## Context Injection — Building the Augmented Prompt

After retrieval, you build a prompt that includes the retrieved context.

\`\`\`
PROMPT STRUCTURE FOR RAG

  System Prompt:
  ────────────────────────────────────────────────────────
  You are a helpful customer support assistant for Acme Corp.
  Answer questions ONLY based on the provided documentation.
  If the documentation does not contain the answer, say:
  "I don't have information about that in the documentation."
  Do not make up information.
  ────────────────────────────────────────────────────────

  Context (retrieved chunks):
  ────────────────────────────────────────────────────────
  [Document: refund-policy.md]
  Our refund policy allows returns within 14 days of purchase.
  Items must be unused and in original packaging.
  Digital purchases are non-refundable.

  [Document: shipping.md]
  Standard shipping takes 5-7 business days.
  Express shipping is available for $15 additional.
  ────────────────────────────────────────────────────────

  User Message:
  ────────────────────────────────────────────────────────
  Can I return a digital product I bought last week?
  ────────────────────────────────────────────────────────
\`\`\`

The model answers: "Based on the documentation, digital purchases are non-refundable."

---

## Generation — Getting a Grounded Answer

Key prompt instructions for RAG generation:

1. **Ground the model**: "Answer ONLY from the provided context"
2. **Handle gaps**: "If the context does not contain the answer, say so"
3. **Cite sources**: "Reference which document your answer comes from"
4. **Prevent fabrication**: "Do not add information not in the provided context"

\`\`\`typescript
const RAG_SYSTEM_PROMPT = \`You are a helpful assistant. Answer questions based ONLY on the provided context documents.

If the provided context does not contain enough information to answer the question:
- Say "I don't have information about that in the documentation."
- Do NOT guess or add information not in the context.

When answering:
- Be concise and direct
- Reference the source document when relevant
- Quote directly when exact wording matters\`;
\`\`\`

---

## Advantages of RAG

- **Always up to date**: Index new documents and they are immediately available
- **Private data**: Your documents never need to be in the training data
- **Reduced hallucination**: Model answers from source material, not memory
- **Transparent**: You can show users which sources the answer came from
- **Cheap**: No model training required — just an embedding model and vector DB
- **Flexible**: Change knowledge base without changing the model

---

## Limitations of RAG

- **Retrieval can fail**: If the relevant chunk is not retrieved, the answer is wrong
- **Context window limits**: Can only inject so many chunks
- **Chunking quality matters**: Bad chunking causes relevant content to be split badly
- **Embedding quality matters**: Poor embeddings mean poor retrieval
- **Latency**: Each query requires embedding + vector search before LLM call
- **Not suitable for all queries**: RAG works for document Q&A; it does not help with reasoning tasks unrelated to your docs

---

## RAG vs Fine-Tuning

When should you use RAG vs fine-tuning a model?

\`\`\`
RAG vs FINE-TUNING

┌──────────────────────┬─────────────────────────────┬──────────────────────────────┐
│                      │ RAG                         │ Fine-Tuning                  │
├──────────────────────┼─────────────────────────────┼──────────────────────────────┤
│ Data changes         │ Just re-index documents     │ Re-train (expensive)         │
├──────────────────────┼─────────────────────────────┼──────────────────────────────┤
│ Private knowledge    │ Store in vector DB           │ Bake into model weights      │
├──────────────────────┼─────────────────────────────┼──────────────────────────────┤
│ Cost                 │ Low (embedding + API)        │ High (training compute)      │
├──────────────────────┼─────────────────────────────┼──────────────────────────────┤
│ Response style       │ Hard to change               │ Model learns your style      │
├──────────────────────┼─────────────────────────────┼──────────────────────────────┤
│ Transparency         │ Can cite sources             │ Opaque — in weights          │
├──────────────────────┼─────────────────────────────┼──────────────────────────────┤
│ Use case             │ Q&A, document search         │ Style, tone, domain behavior │
└──────────────────────┴─────────────────────────────┴──────────────────────────────┘

Default recommendation: Start with RAG. Only fine-tune if RAG cannot solve your problem.
\`\`\``,
  codeExamples: [
    {
      title: 'Complete RAG System',
      code: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { ChromaClient } from 'chromadb';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chroma = new ChromaClient();

const COLLECTION_NAME = 'knowledge-base';
const EMBED_MODEL = 'text-embedding-3-small';

// ─── INDEXING PHASE ───────────────────────────────────────────────

function chunkText(text: string, chunkSize = 400, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start += chunkSize - overlap;
  }
  return chunks;
}

async function indexDocuments(
  documents: Array<{ id: string; content: string; source: string }>
): Promise<void> {
  const collection = await chroma.getOrCreateCollection({ name: COLLECTION_NAME });

  for (const doc of documents) {
    const chunks = chunkText(doc.content);

    const embedResponse = await openai.embeddings.create({
      model: EMBED_MODEL,
      input: chunks,
    });

    await collection.add({
      ids: chunks.map((_, i) => \`\${doc.id}-\${i}\`),
      embeddings: embedResponse.data.map(e => e.embedding),
      documents: chunks,
      metadatas: chunks.map(() => ({ source: doc.source, docId: doc.id })),
    });
  }

  console.log(\`Indexed \${documents.length} documents\`);
}

// ─── RETRIEVAL + GENERATION PHASE ────────────────────────────────

async function retrieve(query: string, topK = 4): Promise<Array<{ text: string; source: string }>> {
  const collection = await chroma.getOrCreateCollection({ name: COLLECTION_NAME });

  const queryEmbed = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: query,
  });

  const results = await collection.query({
    queryEmbeddings: [queryEmbed.data[0].embedding],
    nResults: topK,
    include: ['documents', 'metadatas'] as ['documents', 'metadatas'],
  });

  return (results.documents[0] ?? []).map((doc, i) => ({
    text: doc ?? '',
    source: (results.metadatas?.[0]?.[i] as { source?: string })?.source ?? 'unknown',
  }));
}

async function ragAnswer(userQuestion: string): Promise<string> {
  // 1. Retrieve relevant chunks
  const chunks = await retrieve(userQuestion);

  if (chunks.length === 0) {
    return "I don't have any relevant information to answer that question.";
  }

  // 2. Build context string from retrieved chunks
  const context = chunks
    .map((c, i) => \`[Source \${i + 1}: \${c.source}]\\n\${c.text}\`)
    .join('\\n\\n');

  // 3. Generate answer grounded in retrieved context
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: \`You are a helpful assistant. Answer questions ONLY based on the provided context.
If the context doesn't contain enough information, say "I don't have that information."
Do not add information not present in the context. Cite sources when relevant.\`,
    messages: [
      {
        role: 'user',
        content: \`Context documents:\\n\\n\${context}\\n\\nQuestion: \${userQuestion}\`,
      },
    ],
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}

// ─── EXAMPLE USAGE ────────────────────────────────────────────────

await indexDocuments([
  {
    id: 'refund-policy',
    content: \`Our refund policy: All purchases are eligible for a full refund within 14 days.
Digital products and downloadable content are non-refundable.
To request a refund, contact support@acme.com with your order number.
Refunds are processed within 5-7 business days.\`,
    source: 'refund-policy.md',
  },
  {
    id: 'shipping',
    content: \`Shipping information: Standard shipping takes 5-7 business days.
Express shipping (2-3 days) is available for $15 additional.
International orders may take 10-14 business days.
Free shipping on orders over $50.\`,
    source: 'shipping.md',
  },
]);

const answer = await ragAnswer("Can I get a refund on a software license I bought yesterday?");
console.log(answer);
// → "According to the refund policy, all purchases are eligible for a full refund
//    within 14 days. However, digital products and downloadable content are
//    non-refundable. [Source: refund-policy.md]"`,
      explanation:
        'This is a complete RAG pipeline: index documents by chunking and embedding them into Chroma, then at query time retrieve relevant chunks, build a grounded prompt, and generate an accurate answer. The key is the system prompt — instructing the model to answer ONLY from context prevents hallucination.',
    },
  ],
  commonMistakes: [
    'Not instructing the model to stay within the retrieved context — without this instruction, the model will mix retrieved content with its own knowledge',
    'Retrieving too few chunks — if the answer requires information across multiple sections, 1-2 chunks may not be enough; try top-5 or top-7',
    'Bad chunking strategy — splitting in the middle of a sentence or concept causes both chunks to lose meaning; chunk at paragraph or sentence boundaries',
    'Not handling the "no relevant results" case — if retrieval finds nothing relevant, the model should say so, not hallucinate',
    'Embedding documents once and never updating — when documents change, you must re-embed and update the vector database',
    'Using RAG when fine-tuning is more appropriate — if the task is about style and behavior rather than factual knowledge, fine-tuning is better',
  ],
  interviewQuestions: [
    {
      question: 'What is RAG and what problem does it solve?',
      answer:
        'RAG (Retrieval Augmented Generation) solves three fundamental LLM limitations: (1) knowledge cutoff — LLMs do not know about recent or current information; (2) private data — LLMs are trained on public data and know nothing about your company\'s documents; (3) hallucination — LLMs make up plausible-sounding answers when they don\'t know something. RAG retrieves relevant documents from your knowledge base, injects them into the prompt as context, and instructs the LLM to answer based on the retrieved content rather than its training memory.',
      difficulty: 'intermediate',
    },
    {
      question: 'Walk me through the complete architecture of a RAG system.',
      answer:
        'Two phases: Indexing and Retrieval+Generation. Indexing (done once): load source documents, chunk into ~400-500 token segments, embed each chunk using an embedding model, store chunks and their embeddings in a vector database with metadata. Retrieval+Generation (per query): embed the user query, search the vector database for top-K most similar chunks, build a prompt that includes the retrieved chunks as context, instruct the LLM to answer only from the context, generate and return the answer. The quality depends on retrieval accuracy — if wrong chunks are retrieved, the answer will be wrong or the model will say it cannot find the answer.',
      difficulty: 'intermediate',
    },
    {
      question: 'When would you choose RAG over fine-tuning?',
      answer:
        'RAG is better when: (1) you need to answer questions from specific documents or a knowledge base, (2) the data changes frequently (new docs get added), (3) you need transparency — show which sources the answer came from, (4) you want lower cost (no training compute), (5) you need quick deployment. Fine-tuning is better when: (1) you need to change the model\'s behavior, tone, or reasoning style, (2) you have very domain-specific jargon the base model does not understand well, (3) you need high-volume inference where a smaller fine-tuned model is cheaper. Default recommendation: try RAG first. Only fine-tune if RAG cannot solve your specific problem.',
      difficulty: 'advanced',
    },
  ],
  exercises: [
    {
      id: 'rag-qa-system',
      title: 'Build a Document Q&A System with RAG',
      description:
        'Build a complete RAG system that can answer questions about provided text documents. This is one of the most common AI features you will build in your career.',
      starterCode: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple in-memory vector store for this exercise
// In production you would use Chroma, Pinecone, etc.
interface StoredChunk {
  id: string;
  text: string;
  embedding: number[];
  source: string;
}

const vectorStore: StoredChunk[] = [];

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

// TODO: Implement indexDocument
// Should chunk the text, embed all chunks, and store in vectorStore
async function indexDocument(source: string, text: string): Promise<void> {
  // chunk → embed → push to vectorStore
}

// TODO: Implement ragAnswer
// Should retrieve top-K chunks, build prompt, call LLM
async function ragAnswer(question: string, topK = 4): Promise<string> {
  return '';
}

// Test your system:
await indexDocument('faq.txt', \`
  Q: What are your business hours?
  A: We are open Monday to Friday, 9am to 6pm EST.

  Q: How do I reset my password?
  A: Click "Forgot Password" on the login page. Enter your email
  and we will send a reset link within 5 minutes.

  Q: Can I cancel my subscription?
  A: Yes. Go to Settings > Subscription > Cancel. Your access
  continues until the end of the billing period.
\`);

console.log(await ragAnswer("When are you open?"));
console.log(await ragAnswer("How do I change my password?"));`,
      solution: `import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface StoredChunk {
  id: string;
  text: string;
  embedding: number[];
  source: string;
}

const vectorStore: StoredChunk[] = [];
let chunkCounter = 0;

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (magA * magB);
}

function chunkText(text: string, size = 400): string[] {
  const sentences = text.split(/(?<=[.?!\\n])\\s+/).filter(s => s.trim().length > 10);
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if ((current + sentence).length > size && current.length > 0) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence + ' ';
  }
  if (current.trim().length > 0) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

async function indexDocument(source: string, text: string): Promise<void> {
  const chunks = chunkText(text);

  const embedResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: chunks,
  });

  embedResponse.data.forEach((e, i) => {
    vectorStore.push({
      id: \`chunk-\${chunkCounter++}\`,
      text: chunks[i],
      embedding: e.embedding,
      source,
    });
  });

  console.log(\`Indexed \${chunks.length} chunks from \${source}\`);
}

async function ragAnswer(question: string, topK = 4): Promise<string> {
  const queryEmbed = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });
  const queryVec = queryEmbed.data[0].embedding;

  const ranked = vectorStore
    .map(chunk => ({ ...chunk, similarity: cosineSimilarity(queryVec, chunk.embedding) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  const context = ranked
    .map((c, i) => \`[Source \${i + 1}: \${c.source}]\\n\${c.text}\`)
    .join('\\n\\n');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: \`Answer questions using ONLY the provided context. If the answer is not in the context, say "I don't have that information." Do not add external knowledge.\`,
    messages: [
      {
        role: 'user',
        content: \`Context:\\n\${context}\\n\\nQuestion: \${question}\`,
      },
    ],
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text : '';
}`,
      hints: [
        'Chunk by sentence boundaries rather than fixed character count — it preserves semantic units better',
        'Batch all chunk embeddings in one API call — more efficient than one call per chunk',
        'Sort retrieved chunks by similarity score before building the context string',
        'The system prompt is critical — without "ONLY from context", the model will mix retrieved knowledge with its training',
      ],
    },
  ],
  keyTakeaways: [
    'RAG combines retrieval (find relevant chunks from your documents) with generation (LLM answers from retrieved context)',
    'RAG solves three LLM problems: knowledge cutoff, private data gaps, and hallucination',
    'The complete flow: chunk documents → embed chunks → store in vector DB → embed query → retrieve top-K → inject into prompt → generate answer',
    'Retrieval quality is the biggest factor in RAG quality — bad retrieval = bad answers even with a great LLM',
    'RAG is almost always preferred over fine-tuning for knowledge-based Q&A — cheaper, more flexible, no training required',
    'Always instruct the model to answer ONLY from provided context and to say so when it cannot find the answer',
  ],
  nextLesson: 'ai-agents',
  prevLesson: 'vector-databases',
};
