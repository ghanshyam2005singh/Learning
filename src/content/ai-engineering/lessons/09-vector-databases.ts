import type { Lesson } from '@/types';

export const vectorDatabasesLesson: Lesson = {
  id: 'vector-databases',
  slug: 'vector-databases',
  title: 'Vector Databases',
  description:
    'Understand what vector databases are, why you need them instead of a regular database, how they power RAG and AI search, and how to use Pinecone, Qdrant, and Chroma in practice.',
  category: 'Building with AI',
  order: 9,
  difficulty: 'intermediate',
  estimatedTime: 35,
  content: `In the previous module, you saw how embeddings can power semantic search. But there is a problem: comparing a query vector against thousands or millions of document vectors by computing cosine similarity one-by-one is too slow for production.

You need a database designed to store vectors and find similar ones fast. That is what a vector database does.

---

## Why Not a Regular Database?

Regular databases (PostgreSQL, MongoDB) store structured data. When you search, you filter by exact values, ranges, or patterns.

\`\`\`
REGULAR DATABASE QUERY
  SELECT * FROM documents WHERE title LIKE '%machine learning%'
  → Exact text match only
  → Misses "neural networks tutorial", "deep learning guide" — same topic, different words

VECTOR DATABASE QUERY
  Find top-10 vectors closest to: [0.23, -0.71, 0.04, ...]
  → Returns semantically related documents regardless of exact wording
  → "neural networks tutorial" → found. "deep learning guide" → found.
\`\`\`

A vector database is optimized for one specific operation: **Approximate Nearest Neighbor (ANN) search** — finding the vectors most similar to a given query vector, fast, across millions of items.

Regular databases can store vectors as arrays but do not have the index structures to find nearest neighbors efficiently at scale. They would require scanning every vector — O(n) — which fails at millions of documents.

Vector databases use index structures (HNSW, IVF, etc.) that find nearest neighbors in milliseconds even across millions of vectors.

---

## Core Operations

Every vector database supports these core operations:

\`\`\`
UPSERT (Insert or Update)
  Store a vector with:
  - A unique ID
  - The vector itself (embedding)
  - Metadata (any JSON — title, source, date, category)

QUERY
  Given a query vector, return:
  - Top-K nearest vectors
  - Their IDs and metadata
  - Their similarity scores

DELETE
  Remove a vector by ID

FILTER (on metadata)
  "Find top-K nearest vectors WHERE category = 'technical'"
  Combines vector similarity with attribute filtering
\`\`\`

---

## Vector Database Options

\`\`\`
VECTOR DATABASE COMPARISON

┌───────────────┬────────────────┬──────────────────────────────────────────┐
│ Database      │ Type           │ Best For                                 │
├───────────────┼────────────────┼──────────────────────────────────────────┤
│ Pinecone      │ Managed cloud  │ Production apps, easy setup, no infra    │
├───────────────┼────────────────┼──────────────────────────────────────────┤
│ Qdrant        │ Open source    │ Self-hosted, rich filtering, fast        │
├───────────────┼────────────────┼──────────────────────────────────────────┤
│ Weaviate      │ Open source    │ Full-featured, built-in ML modules       │
├───────────────┼────────────────┼──────────────────────────────────────────┤
│ Chroma        │ Open source    │ Local development, simple API, free      │
├───────────────┼────────────────┼──────────────────────────────────────────┤
│ pgvector      │ Postgres ext.  │ Already using Postgres, smaller scale    │
├───────────────┼────────────────┼──────────────────────────────────────────┤
│ Milvus        │ Open source    │ Large scale, high performance            │
└───────────────┴────────────────┴──────────────────────────────────────────┘
\`\`\`

### Pinecone — Managed Cloud

Best for production when you want zero infrastructure management.

\`\`\`typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index('my-index');

// Upsert vectors
await index.upsert([
  {
    id: 'doc-1',
    values: [0.1, 0.2, /* ... 1536 total */],
    metadata: { title: 'Intro to AI', category: 'beginner' },
  },
]);

// Query
const results = await index.query({
  vector: [0.1, 0.3, /* ... */],
  topK: 5,
  includeMetadata: true,
  filter: { category: 'beginner' }, // Optional metadata filter
});
\`\`\`

### Chroma — Local Development

Best for development and small projects. Runs locally with no setup.

\`\`\`typescript
import { ChromaClient } from 'chromadb';

const client = new ChromaClient();
const collection = await client.getOrCreateCollection({ name: 'documents' });

// Add documents
await collection.add({
  ids: ['doc-1', 'doc-2'],
  embeddings: [[0.1, 0.2, ...], [0.3, 0.4, ...]],
  documents: ['The original text 1', 'The original text 2'],
  metadatas: [{ source: 'manual' }, { source: 'website' }],
});

// Query
const results = await collection.query({
  queryEmbeddings: [[0.1, 0.25, ...]],
  nResults: 5,
});
\`\`\`

### pgvector — PostgreSQL Extension

Best when you already use PostgreSQL and want to add vector search without a new database.

\`\`\`sql
-- Enable the extension
CREATE EXTENSION vector;

-- Create a table with a vector column
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536)  -- 1536 dimensions for text-embedding-3-small
);

-- Insert with embedding
INSERT INTO documents (content, embedding)
VALUES ('Hello world', '[0.1, 0.2, ...]'::vector);

-- Find nearest neighbors (cosine distance)
SELECT id, content, 1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity
FROM documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;
\`\`\`

---

## The Embeddings + Vector DB Flow

This is the complete flow for building a searchable knowledge base:

\`\`\`
INDEXING FLOW (done once, or when content changes)

  Raw Documents (PDFs, text files, web pages)
        │
        │  1. Chunk documents into paragraphs/sections
        │
        ▼
  Document Chunks ["chunk1...", "chunk2...", ...]
        │
        │  2. Embed each chunk (OpenAI / Voyage / etc.)
        │
        ▼
  Chunk Embeddings [[0.1, 0.2, ...], [0.3, 0.4, ...]]
        │
        │  3. Store in vector database with metadata
        │
        ▼
  Vector Database (ready to query)

─────────────────────────────────────────────────────────────

QUERY FLOW (every time a user searches)

  User Query: "how to handle async errors?"
        │
        │  1. Embed the query
        │
        ▼
  Query Vector: [0.23, -0.71, ...]
        │
        │  2. Search vector database for top-K nearest
        │
        ▼
  Retrieved Chunks (most semantically similar)
        │
        │  3. Return to user (search) or inject into LLM prompt (RAG)
        │
        ▼
  Search Results or AI-generated Answer
\`\`\`

---

## Metadata Filtering

Vector databases let you combine semantic search with attribute filtering. This is essential for real applications.

\`\`\`
WITHOUT FILTERING:
  "How do I deploy?" → Returns deployment docs from React, Node, Docker,
                       AWS, Python, etc. (everything in your knowledge base)

WITH FILTERING:
  "How do I deploy?" + filter: { product: "nodejs-api" }
  → Returns only deployment docs for your Node.js API
  Semantic similarity + exact attribute = precise results
\`\`\`

---

## Choosing Between Vector DBs

\`\`\`
DECISION GUIDE

  Am I just prototyping or building a local tool?
  → Chroma (free, local, zero setup)

  Am I already using PostgreSQL and have < 1M vectors?
  → pgvector (no new infrastructure)

  Do I need a managed cloud solution for production?
  → Pinecone (easiest managed, reliable)

  Do I want self-hosted with advanced filtering?
  → Qdrant (great performance, active development)

  Do I need > 10M vectors with enterprise features?
  → Pinecone or Milvus
\`\`\``,
  codeExamples: [
    {
      title: 'Complete Vector DB Workflow — Chroma (Local)',
      code: `import { ChromaClient, Collection } from 'chromadb';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chroma = new ChromaClient(); // Default: connects to localhost:8000

// Step 1: Create/get collection
async function getCollection(name: string): Promise<Collection> {
  return chroma.getOrCreateCollection({
    name,
    metadata: { description: 'AI engineering course documents' },
  });
}

// Step 2: Embed and store documents
async function indexDocuments(
  collection: Collection,
  docs: Array<{ id: string; text: string; metadata: Record<string, string> }>
): Promise<void> {
  // Embed all documents in batch
  const embedResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: docs.map(d => d.text),
  });

  await collection.add({
    ids: docs.map(d => d.id),
    embeddings: embedResponse.data.map(e => e.embedding),
    documents: docs.map(d => d.text),
    metadatas: docs.map(d => d.metadata),
  });

  console.log(\`Indexed \${docs.length} documents\`);
}

// Step 3: Semantic search
async function search(
  collection: Collection,
  query: string,
  topK = 3,
  filter?: Record<string, string>
): Promise<Array<{ text: string; metadata: Record<string, string>; distance: number }>> {
  // Embed the query
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding.data[0].embedding],
    nResults: topK,
    where: filter,
    include: ['documents', 'metadatas', 'distances'] as ('documents' | 'metadatas' | 'distances')[],
  });

  return (results.documents[0] ?? []).map((doc, i) => ({
    text: doc ?? '',
    metadata: results.metadatas?.[0]?.[i] as Record<string, string> ?? {},
    distance: results.distances?.[0]?.[i] ?? 0,
  }));
}

// Usage example
const collection = await getCollection('course-docs');

await indexDocuments(collection, [
  {
    id: 'js-1',
    text: 'JavaScript closures capture variables from their enclosing scope',
    metadata: { topic: 'javascript', difficulty: 'intermediate' },
  },
  {
    id: 'js-2',
    text: 'async/await is syntactic sugar over Promises in JavaScript',
    metadata: { topic: 'javascript', difficulty: 'beginner' },
  },
  {
    id: 'py-1',
    text: 'Python decorators modify or enhance functions without changing their code',
    metadata: { topic: 'python', difficulty: 'intermediate' },
  },
]);

// Search all topics
const allResults = await search(collection, 'how do functions work with outer variables?');
console.log('All results:', allResults);

// Search with filter — only JavaScript docs
const jsResults = await search(
  collection,
  'how do functions work?',
  3,
  { topic: 'javascript' }
);
console.log('JS only:', jsResults);`,
      explanation:
        'The complete indexing + retrieval workflow: create a collection, batch embed documents, store with metadata, then embed queries and retrieve similar chunks. The metadata filter shows how to scope search results — only return docs from a specific topic.',
    },
  ],
  commonMistakes: [
    'Using different embedding models for indexing and querying — the vectors will be in different spaces and similarity scores will be meaningless',
    'Not chunking large documents before embedding — embedding a 50,000-word document produces a single vector that averages out all the content, losing specificity',
    'Ignoring metadata filtering — without filtering, all searches return results from your entire knowledge base regardless of category or context',
    'Re-embedding documents on every search — embed documents once and store them; only re-embed queries at search time',
    'Not storing the original text alongside embeddings — you need the original text to display results or inject into prompts',
    'Using a vector database for small datasets — if you have fewer than ~1,000 documents, in-memory cosine similarity is fast enough; skip the infrastructure',
  ],
  interviewQuestions: [
    {
      question: 'Why do you need a vector database instead of storing embeddings in PostgreSQL?',
      answer:
        'PostgreSQL can store vector arrays, but finding the nearest neighbors requires scanning all rows and computing similarity — O(n) per query. At 1 million documents, this is too slow. Vector databases use Approximate Nearest Neighbor (ANN) indexes (like HNSW or IVF) that find the most similar vectors in milliseconds even across billions of vectors. The tradeoff is they return approximate results (missing a small percentage of truly nearest neighbors) for dramatically better performance. For most applications, ANN accuracy (>95%) is sufficient.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is metadata filtering in a vector database and why is it important?',
      answer:
        'Metadata filtering combines semantic similarity search with exact attribute matching. When you store a vector, you also store metadata (JSON attributes like category, date, user_id). At query time, you can say "find the 5 most semantically similar chunks WHERE category = \'billing\' AND user_id = \'123\'". Without filtering, searching a knowledge base returns results from all categories regardless of context. With filtering, you can scope results to the specific category, user, document, or date range relevant to the query.',
      difficulty: 'intermediate',
    },
    {
      question: 'When would you use pgvector instead of a dedicated vector database?',
      answer:
        'Use pgvector when: (1) you already use PostgreSQL and want to minimize new infrastructure, (2) your vector dataset is small to medium (under ~1M vectors), (3) you want to join vector search results with relational data in the same query. pgvector has good performance at smaller scales and simplifies architecture by keeping everything in one database. Use a dedicated vector database (Pinecone, Qdrant) when you need: very large scale (tens of millions of vectors), higher query throughput, or advanced ANN index options that pgvector does not support.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'vector-db-rag-pipeline',
      title: 'Build an Indexing + Retrieval Pipeline',
      description:
        'Build a complete pipeline: take a list of documents, chunk them, embed them, store in Chroma, then retrieve relevant chunks for any query. This is the retrieval half of a RAG system.',
      starterCode: `import { ChromaClient } from 'chromadb';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chroma = new ChromaClient();

// Chunk a long text into smaller pieces with overlap
function chunkText(
  text: string,
  chunkSize = 500,
  overlap = 50
): string[] {
  // TODO: Split text into chunks of ~chunkSize characters
  // with overlap characters repeated between consecutive chunks
  // Return array of chunk strings
  return [];
}

// Index a document: chunk it, embed chunks, store in vector DB
async function indexDocument(
  collectionName: string,
  docId: string,
  text: string,
  metadata: Record<string, string>
): Promise<void> {
  // TODO:
  // 1. Chunk the text
  // 2. Get collection from Chroma
  // 3. Embed all chunks
  // 4. Store in Chroma with IDs like "docId-chunk-0", "docId-chunk-1"
}

// Retrieve top-K relevant chunks for a query
async function retrieve(
  collectionName: string,
  query: string,
  topK = 3
): Promise<string[]> {
  // TODO:
  // 1. Embed the query
  // 2. Query Chroma for top-K nearest chunks
  // 3. Return the chunk texts
  return [];
}`,
      solution: `import { ChromaClient } from 'chromadb';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chroma = new ChromaClient();

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start += chunkSize - overlap; // Overlap: next chunk starts before current ends
  }
  return chunks;
}

async function indexDocument(
  collectionName: string,
  docId: string,
  text: string,
  metadata: Record<string, string>
): Promise<void> {
  const chunks = chunkText(text);
  if (chunks.length === 0) return;

  const collection = await chroma.getOrCreateCollection({ name: collectionName });

  const embedResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: chunks,
  });

  await collection.add({
    ids: chunks.map((_, i) => \`\${docId}-chunk-\${i}\`),
    embeddings: embedResponse.data.map(e => e.embedding),
    documents: chunks,
    metadatas: chunks.map(() => ({ ...metadata, docId })),
  });

  console.log(\`Indexed "\${docId}" as \${chunks.length} chunks\`);
}

async function retrieve(
  collectionName: string,
  query: string,
  topK = 3
): Promise<string[]> {
  const collection = await chroma.getOrCreateCollection({ name: collectionName });

  const queryEmbed = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });

  const results = await collection.query({
    queryEmbeddings: [queryEmbed.data[0].embedding],
    nResults: topK,
    include: ['documents'] as ['documents'],
  });

  return (results.documents[0] ?? []).filter(Boolean) as string[];
}`,
      hints: [
        'Chunking with overlap means consecutive chunks share some content — helps when relevant info spans a chunk boundary',
        'Batch all chunk embeddings in one API call (pass array as input) — much cheaper and faster than one call per chunk',
        'IDs for chunks should be derived from the document ID so you can track which doc they came from',
        'In real RAG, you would pass the retrieved chunks to an LLM as context to generate the final answer',
      ],
    },
  ],
  keyTakeaways: [
    'Vector databases store embeddings and find the nearest ones fast using ANN indexes — regular databases cannot do this efficiently at scale',
    'Core operations: upsert (store vector + metadata), query (find top-K nearest), filter (metadata constraints)',
    'Chroma is ideal for local development; Pinecone for managed production; pgvector when you already use PostgreSQL',
    'Always store original text alongside embeddings — you need it to display results and inject into LLM prompts',
    'Metadata filtering lets you combine semantic similarity with attribute filters (category, user ID, date)',
    'The full flow: chunk documents → embed chunks → store in vector DB → embed query → retrieve top-K → use in search or RAG',
  ],
  nextLesson: 'rag',
  prevLesson: 'embeddings',
};
