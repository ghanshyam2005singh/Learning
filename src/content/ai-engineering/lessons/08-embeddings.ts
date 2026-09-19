import type { Lesson } from '@/types';

export const embeddingsLesson: Lesson = {
  id: 'embeddings',
  slug: 'embeddings',
  title: 'Embeddings',
  description:
    'Understand what embeddings are, why they exist, how they power semantic search and AI memory, and how to use embedding APIs to build search and similarity features.',
  category: 'Core Concepts',
  order: 8,
  difficulty: 'intermediate',
  estimatedTime: 40,
  content: `Embeddings are one of the most important concepts in AI engineering and one of the least intuitive. Once you understand them, you will see opportunities to use them everywhere — in search, recommendations, RAG systems, and AI memory.

---

## The Problem Embeddings Solve

Traditional search is keyword-based. You search for "python list" and get results that contain the words "python" and "list." This works for exact matches but fails when:

- User types "snake programming language" (means Python)
- User asks "how do I store multiple items?" (means array/list)
- User writes in a different language
- User uses technical jargon inconsistently

The underlying problem: **text is not a number**. Computers can compare numbers, calculate distances, cluster similar things together. But comparing text requires exact character matching — which does not capture meaning.

Embeddings solve this by converting text into numbers that capture meaning.

---

## What Is an Embedding?

An embedding is a list of numbers (a vector) that represents the meaning of a piece of text.

\`\`\`
EMBEDDING — THE CORE IDEA

  Text: "The dog chased the cat"
  Embedding: [0.23, -0.71, 0.04, 0.89, -0.12, ..., 0.33]
             ↑ a list of hundreds to thousands of numbers

  Text: "A puppy ran after a kitten"
  Embedding: [0.24, -0.68, 0.06, 0.87, -0.14, ..., 0.31]
             ↑ very similar numbers — similar meaning!

  Text: "The stock market crashed 10%"
  Embedding: [-0.82, 0.13, -0.55, 0.02, 0.77, ..., -0.44]
             ↑ very different numbers — different meaning!
\`\`\`

Two texts with similar meanings produce similar vectors. Two texts with different meanings produce distant vectors.

This is not an accident — embedding models are trained specifically to produce this property.

---

## Intuition: The Vector Space

Imagine a space where every piece of text is a point. Similar texts are near each other. Different texts are far apart.

\`\`\`
EMBEDDING SPACE — 2D SIMPLIFICATION
(real embeddings have 768-3072 dimensions)

  Technical topics cluster together:
                      "machine learning tutorial"
                      ●
          "neural networks" ●        ● "deep learning"
              "AI models" ●

  Animal topics cluster together:
                                  "golden retriever"
                                  ●
                     "puppy" ● ●  "labrador"
                     "dog"   ●

  The distance between clusters is large.
  The distance within a cluster is small.
\`\`\`

This is what embeddings create in higher dimensions. When you search for "python snake language", the embedding of your query is mathematically close to embeddings of Python programming content — even if none of them contain the exact words you used.

---

## Similarity Search

Once you have embeddings, you can find similar items by calculating the distance between vectors.

The most common similarity measure is **cosine similarity** — it measures the angle between two vectors, which captures semantic similarity well regardless of document length.

\`\`\`
COSINE SIMILARITY

  Cosine similarity = 1.0  → Identical meaning
  Cosine similarity = 0.9  → Very similar
  Cosine similarity = 0.5  → Somewhat related
  Cosine similarity = 0.0  → Unrelated
  Cosine similarity = -1.0 → Opposite meaning

  Examples:
  "cat" vs "kitten"               → ~0.95 (near identical meaning)
  "car" vs "automobile"           → ~0.97
  "happy" vs "sad"                → ~0.3 (related but opposite sentiment)
  "apple" (fruit) vs "kubernetes" → ~0.1 (unrelated)
\`\`\`

---

## Semantic Search

Traditional search: Find documents containing the exact query words.
Semantic search: Find documents that mean the same thing as the query.

\`\`\`
SEMANTIC SEARCH FLOW

  User query: "how to handle errors in async code"
        │
        │  1. Embed the query
        │     → query_vector = embed("how to handle errors in async code")
        │
        ▼
  Vector database
  (contains embeddings of all your documents)
        │
        │  2. Find nearest neighbors to query_vector
        │     → Find top-K document vectors closest in meaning
        │
        ▼
  Results: (sorted by similarity)
    1. "try/catch with async/await" (similarity: 0.92)
    2. "Promise rejection handling" (similarity: 0.89)
    3. "error boundaries in React" (similarity: 0.85)

  All relevant — even though they do not contain the exact query words
\`\`\`

---

## Real World Usage

**1. AI Chat Memory**

When a user has 1000 past conversations with an AI, you cannot put all of them in the context window. Embeddings let you retrieve only the relevant past messages:

\`\`\`
User: "Remember when I told you about my dog?"
  → Embed the query
  → Search past conversations for similar content
  → Retrieve top 3 most relevant past messages
  → Inject them into current context
\`\`\`

**2. Document Q&A (RAG)**

Embed every paragraph of your documentation. When a user asks a question, embed the question, find the most relevant paragraphs, inject them into the prompt. The model answers based on the retrieved content.

**3. Recommendation Systems**

Embed product descriptions. When a user views a product, embed their behavior and find similar products.

**4. Duplicate Detection**

Embed support tickets. Find tickets that mean the same thing even if they use different words — to detect duplicate issues.

**5. Content Moderation**

Embed known harmful content patterns. Flag new content with high similarity to those patterns.

---

## Embedding Models

You get embeddings by calling an embedding API. These are different from chat models — they do not generate text, they only convert text to vectors.

\`\`\`
POPULAR EMBEDDING MODELS

  Provider      Model                   Dimensions   Cost
  ─────────────────────────────────────────────────────────────────
  OpenAI        text-embedding-3-small  1536         $0.02/1M tokens
  OpenAI        text-embedding-3-large  3072         $0.13/1M tokens
  Voyage AI     voyage-3                1024         $0.006/1M tokens
  Cohere        embed-english-v3.0      1024         $0.10/1M tokens
  HuggingFace   nomic-embed-text        768          Free (open source)
  Google        text-embedding-004      768          Free (limited)
\`\`\`

**Dimensions**: More dimensions = richer representation, more storage, slower comparison. 1536 dimensions is sufficient for most use cases.

---

## Key Constraints

**1. Input length limit**: Embedding models have a maximum input length (tokens). Long documents must be chunked into smaller pieces before embedding.

\`\`\`
CHUNKING STRATEGY

  Full book: 100,000 tokens
  Model limit: 8,192 tokens

  Split into chunks:
  Chapter 1, paragraphs 1-10
  Chapter 1, paragraphs 11-20
  ...
  Each chunk gets its own embedding
  At query time, retrieve top-K most relevant chunks
\`\`\`

**2. Same model for query and documents**: If you embed documents with model A, you must embed queries with model A too. Embeddings from different models are not comparable.

**3. Embeddings are not interpretable**: A vector of 1536 numbers does not tell you anything human-readable. They are only useful for comparison with other vectors from the same model.`,
  codeExamples: [
    {
      title: 'Creating Embeddings and Finding Similar Content',
      code: `import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create an embedding for a single text
async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Find most similar documents to a query
async function semanticSearch(
  query: string,
  documents: string[],
  topK = 3
): Promise<Array<{ document: string; similarity: number }>> {
  // Embed query and all documents
  const [queryEmbedding, ...docEmbeddings] = await Promise.all([
    embed(query),
    ...documents.map(embed),
  ]);

  // Calculate similarity between query and each document
  const results = documents.map((doc, i) => ({
    document: doc,
    similarity: cosineSimilarity(queryEmbedding, docEmbeddings[i]),
  }));

  // Sort by similarity (highest first) and return top K
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// Example usage
const documents = [
  'async/await is syntactic sugar over Promises in JavaScript',
  'try/catch blocks handle synchronous errors in JavaScript',
  'Promise.catch() handles rejected Promises',
  'Python uses the def keyword to define functions',
  'error handling in async functions requires try/catch with await',
];

const results = await semanticSearch(
  'how do I catch errors in asynchronous JavaScript?',
  documents
);

results.forEach(r => {
  console.log(\`Similarity: \${r.similarity.toFixed(3)} — \${r.document}\`);
});
// Output (approximate):
// Similarity: 0.921 — error handling in async functions requires try/catch with await
// Similarity: 0.876 — async/await is syntactic sugar over Promises in JavaScript
// Similarity: 0.851 — Promise.catch() handles rejected Promises
// "Python uses the def keyword" scores low — unrelated topic`,
      explanation:
        'This shows the core embedding workflow: embed the query, embed the documents, calculate cosine similarity for each document against the query, return the most similar ones. In production you would store document embeddings in a vector database rather than computing them on every search.',
    },
  ],
  commonMistakes: [
    'Using different embedding models for documents vs queries — embeddings from different models exist in different spaces and are not comparable',
    'Embedding full long documents without chunking — embedding models have token limits; chunk documents into paragraphs or fixed-size chunks',
    'Treating embeddings as human-readable — a vector of 1536 numbers tells you nothing; they are only meaningful in comparison to other vectors from the same model',
    'Recalculating embeddings for documents that have not changed — embeddings are deterministic for the same input; cache or store them in a vector database',
    'Using keyword search when semantic search is the right tool — if users phrase things differently from your documents, keyword search will miss matches that semantic search finds',
  ],
  interviewQuestions: [
    {
      question: 'What is an embedding and how is it different from a language model?',
      answer:
        'An embedding model converts text into a fixed-length vector of numbers (e.g., 1536 numbers) where texts with similar meaning produce similar vectors. A language model generates new text. Embedding models do not generate anything — they only encode meaning into a mathematical representation. You use embedding models for search, similarity comparison, clustering, and RAG retrieval. You use language models to generate responses, summaries, or code.',
      difficulty: 'intermediate',
    },
    {
      question: 'How does semantic search differ from keyword search?',
      answer:
        'Keyword search finds documents containing the exact query words — it matches strings literally. Semantic search embeds both the query and documents into vector space and finds documents that are mathematically close to the query, regardless of whether they share words. Example: keyword search for "vehicle engine repair" misses an article titled "how to fix your car motor" — different words, same topic. Semantic search finds it because both embed to similar locations in vector space.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is chunking and why is it necessary for embeddings?',
      answer:
        'Chunking splits long documents into smaller pieces before embedding them. Embedding models have a maximum input length (typically 512-8192 tokens). A full book, codebase, or long document cannot fit in a single embedding call. You chunk by paragraph, fixed token count, or logical section. Each chunk gets its own embedding and is stored separately. At query time, you search for the most similar chunks rather than the most similar documents. Good chunking strategy (chunk size, overlap between chunks) significantly impacts RAG quality.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'build-semantic-search',
      title: 'Build a Simple Semantic Search Engine',
      description:
        'Build a function that takes a knowledge base of text snippets, embeds them all, and can answer semantic search queries — finding the most relevant snippet for any question.',
      starterCode: `import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface KnowledgeBaseEntry {
  id: string;
  text: string;
  embedding?: number[];
}

class SemanticSearchEngine {
  private entries: KnowledgeBaseEntry[] = [];

  // TODO: Add documents to the knowledge base
  // Should embed each document and store the embedding
  async addDocuments(docs: Array<{ id: string; text: string }>): Promise<void> {
    // Implement this
  }

  // TODO: Search for the most similar documents to a query
  // Should embed the query and return top-K most similar entries
  async search(
    query: string,
    topK = 3
  ): Promise<Array<{ id: string; text: string; similarity: number }>> {
    // Implement this
    return [];
  }
}

// Test your implementation
const engine = new SemanticSearchEngine();

await engine.addDocuments([
  { id: '1', text: 'JavaScript uses var, let, and const to declare variables' },
  { id: '2', text: 'TypeScript adds static types to JavaScript' },
  { id: '3', text: 'React is a JavaScript library for building user interfaces' },
  { id: '4', text: 'Node.js lets you run JavaScript on the server' },
  { id: '5', text: 'Python is a high-level programming language known for simplicity' },
]);

const results = await engine.search('how to declare variables in JS?');
console.log(results);
// Should return doc 1 as most similar`,
      solution: `import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface KnowledgeBaseEntry {
  id: string;
  text: string;
  embedding: number[];
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

class SemanticSearchEngine {
  private entries: KnowledgeBaseEntry[] = [];

  async addDocuments(
    docs: Array<{ id: string; text: string }>
  ): Promise<void> {
    // Batch embed all documents in one API call (more efficient)
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: docs.map(d => d.text),
    });

    this.entries = docs.map((doc, i) => ({
      id: doc.id,
      text: doc.text,
      embedding: response.data[i].embedding,
    }));

    console.log(\`Indexed \${docs.length} documents\`);
  }

  async search(
    query: string,
    topK = 3
  ): Promise<Array<{ id: string; text: string; similarity: number }>> {
    if (this.entries.length === 0) {
      throw new Error('No documents indexed. Call addDocuments first.');
    }

    // Embed the query
    const queryResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryEmbedding = queryResponse.data[0].embedding;

    // Calculate similarity against all entries
    const scored = this.entries.map(entry => ({
      id: entry.id,
      text: entry.text,
      similarity: cosineSimilarity(queryEmbedding, entry.embedding),
    }));

    // Sort and return top K
    return scored.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  }
}`,
      hints: [
        'You can batch multiple texts in a single embeddings API call — pass an array as the input field',
        'Store embeddings alongside the documents — do not re-embed on every search',
        'The query must use the SAME model as the documents',
        'Cosine similarity = (a · b) / (|a| × |b|) — dot product divided by product of magnitudes',
      ],
    },
  ],
  keyTakeaways: [
    'Embeddings convert text into vectors (lists of numbers) where similar meaning = similar numbers',
    'This enables semantic search — finding content that means the same thing even when worded differently',
    'Cosine similarity measures how close two vectors are — values near 1.0 = similar meaning',
    'You must use the same embedding model for both documents and queries — cross-model comparison is meaningless',
    'Long documents must be chunked before embedding — embedding models have token limits',
    'Embeddings power RAG, semantic search, AI memory, recommendations, and duplicate detection',
  ],
  nextLesson: 'vector-databases',
  prevLesson: 'prompt-engineering',
};
