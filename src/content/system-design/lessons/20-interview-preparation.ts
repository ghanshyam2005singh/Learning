import type { Lesson } from '@/types';

export const interviewPrepLesson: Lesson = {
  id: 'interview-preparation',
  slug: 'interview-preparation',
  title: 'Interview Preparation',
  description:
    'Master the complete system design interview strategy — the framework every interviewer expects, what separates good candidates from great ones, and detailed Q&A covering beginner through expert-level questions.',
  category: 'Interview',
  order: 20,
  difficulty: 'advanced',
  estimatedTime: 60,
  prevLesson: 'case-studies',
  nextLesson: 'exercises',

  content: `# Interview Preparation

## The Mindset Shift

Most candidates approach system design interviews with the wrong goal. They try to produce the "correct" architecture. But there is no single correct architecture for any system design problem.

The interviewer is not evaluating whether you chose Kafka over RabbitMQ. They are evaluating **how you think**. The process matters more than the answer.

What interviewers actually measure:
- Do you ask clarifying questions before designing? (Or do you assume?)
- Can you reason about scale from first principles? (Or do you guess?)
- Do you explain your decisions? (Or do you just state them?)
- Can you identify the tradeoffs of your own design? (Or do you defend it blindly?)
- Do you know when your design breaks and what you'd change? (Or do you think it's perfect?)

A candidate who says "I'd use Kafka here because we need high-throughput event streaming with replay capability, and our message size is small — Kafka is optimized for exactly this pattern" is far stronger than one who says "I'd use Kafka" with no explanation.

---

## The 8-Step Framework

Use this framework for every system design interview, every time. It structures your thinking, signals preparation to the interviewer, and ensures you never skip a critical phase.

### Step 1: Clarify Requirements (5 minutes)

Never start designing without asking these questions:

**Functional scope:**
- What are the core features? What is explicitly out of scope?
- Who are the users? (Consumers? Businesses? Both?)
- What are the key user stories? ("As a user, I can...")

**Scale:**
- How many daily active users? (1M, 10M, 100M?)
- What is the expected read/write ratio?
- What is the peak QPS?
- How much data is stored? Is it growing?

**Constraints:**
- What are the latency requirements? (< 200ms? < 1 second? Real-time?)
- What consistency level is needed? (Strong? Eventual?)
- What is the availability target? (99.9% = 8.7 hours downtime/year, 99.99% = 52 minutes/year)
- Are there geographic requirements? (Global? Single region?)

**Why this matters:** The same question — "design a messaging system" — has completely different correct answers at 1,000 users vs. 1 billion users. Clarifying prevents you from over-engineering for a simple problem or under-engineering for a massive one.

### Step 2: Estimate Scale (3 minutes)

Use back-of-envelope calculations to size the system. This determines whether you need sharding, caching, or horizontal scaling.

**The key numbers to know:**
- 1 day = 86,400 seconds (~100K for estimates)
- 1 month = 2.5 million seconds
- 1 KB = 1,000 bytes | 1 MB = 10^6 bytes | 1 GB = 10^9 bytes | 1 TB = 10^12 bytes
- Average latency: RAM 100ns | SSD 100μs | HDD 10ms | Network (same DC) 1ms | Network (cross-continent) 150ms

**Example: "Design a Twitter-like system"**
- 100M DAU, each user reads 100 tweets/day → 10 billion reads/day → 116,000 reads/second
- Each user tweets once/day → 100M tweets/day → 1,160 writes/second
- Tweet size: 300 bytes → 100M × 300 = 30 GB storage/day

This tells you: read-heavy (100:1 ratio), heavy caching needed, writes are manageable.

### Step 3: API Design (5 minutes)

Define the key API endpoints before designing the internals. The API is the contract between components.

For each endpoint, specify:
- HTTP method and path
- Request parameters
- Response schema
- Authentication/authorization requirements

\`\`\`
POST /api/v1/tweets
Request: { content: string, mediaUrls?: string[] }
Response: { tweetId: string, createdAt: timestamp }
Auth: Bearer token required

GET /api/v1/feed?userId={id}&cursor={cursor}&limit={n}
Response: { tweets: Tweet[], nextCursor: string }
Auth: Bearer token required
\`\`\`

### Step 4: Data Model (5 minutes)

Design the core database tables/documents. Think about:
- What entities exist? (Users, posts, relationships, events)
- What are the relationships? (One-to-many, many-to-many)
- What are the access patterns? (How will data be queried?)
- Does the access pattern suggest SQL or NoSQL?

**Red flag for interviewers:** Choosing a database before defining the data model and access patterns.

### Step 5: High-Level Design (10 minutes)

Draw the major components and how data flows between them:
- Client (web/mobile)
- Load Balancer
- API Servers (stateless)
- Database (primary + replicas)
- Cache layer
- Message Queue (if async processing needed)
- CDN (if serving static assets)

Keep it simple. Boxes and arrows. No deep implementation details yet.

### Step 6: Deep Dive into 2-3 Components (15 minutes)

The interviewer will guide which components to go deeper on, or you can choose the most interesting ones.

Common deep dives:
- Database schema and indexing strategy
- Cache design (what to cache, eviction policy, consistency)
- Message queue and processing guarantees
- Search architecture
- Feed generation algorithm
- Sharding strategy

This is where you demonstrate depth. Use specific technologies and justify every choice.

### Step 7: Identify Bottlenecks and Solutions (5 minutes)

Every design has bottlenecks. Identifying them proactively shows maturity.

- "The single database is a bottleneck once we exceed 10K writes/second. I'd add read replicas first, then shard if needed."
- "The feed generation service becomes slow as users follow more accounts. I'd pre-compute feeds and cache them."
- "A single Kafka partition limits throughput. I'd partition by userId to allow parallel consumption."

### Step 8: Discuss Tradeoffs (3 minutes)

Close by reflecting on what you chose and what you gave up:
- "I chose eventual consistency for the feed, which means users might see posts 1-2 seconds late. This is acceptable for social media but would not be acceptable for banking."
- "I chose to shard by userId, which works well for per-user queries but makes cross-user analytics expensive."

This signals intellectual honesty — great engineers know their designs are not perfect.

---

## What Interviewers Look For (and Why)

### Asking Good Questions

A candidate who asks "how many daily active users do we need to support?" before drawing a single box is signaling: I understand that design decisions depend on constraints. This is exactly what senior engineers do.

A candidate who starts drawing a complex microservices architecture for what might be a 10,000-user system is signaling the opposite.

### Reasoning About Tradeoffs

The word "tradeoff" should appear multiple times in your interview. Every major decision has a cost. When you say "I'll use Cassandra," immediately add what you're giving up: "...but this means we sacrifice strong consistency and complex queries." Showing you know the downside is more impressive than knowing the upside.

### Communication

System design is a collaborative exercise. Narrate your thinking as you go. Do not sit silently drawing diagrams. Interviewers follow your verbal reasoning — they cannot see inside your head.

Bad: *[silent drawing for 5 minutes]* "Here's my design."
Good: "I'm going to start with the database because the access pattern will determine everything else. We're doing 100K reads per second with a 10:1 read/write ratio, so I'm thinking read replicas — let me size that..."

### Knowing When to Stop

Over-engineering is a red flag. If the problem is small, say: "At this scale, a simple monolith on a single database would work. I'd introduce sharding only when we hit 10K writes/second. For now, let's keep it simple."

---

## Common Interview Mistakes

### Mistake 1: Jumping to Solution Without Clarifying

"Sure, let me design the system for you." — then proceeds to design without asking about scale, consistency, or features.

Fix: Always spend 5 minutes on requirements. Interviewers expect it and will give you points for doing it.

### Mistake 2: Naming Technologies Without Explanation

"I'd use Kafka for messaging."
Why Kafka? Why not RabbitMQ, SQS, or a simple database queue? Kafka has specific use cases — high throughput, event replay, stream processing. If those don't apply, Kafka might be wrong.

Fix: Every technology choice must come with a "because." "I'd use Kafka because we need to replay events for the analytics pipeline and we have high message throughput."

### Mistake 3: Over-Engineering

Designing a 15-microservice architecture for a system that 100K users will use, with distributed transactions, Kafka, Redis clusters, and Kubernetes.

Fix: Match complexity to scale. At 100K users, a well-indexed PostgreSQL on a single large server handles most workloads. Start simple; introduce complexity only when justified.

### Mistake 4: Not Estimating Before Designing

Choosing a database architecture without knowing whether you need to handle 100 or 100 million records.

Fix: Always calculate QPS and storage before choosing a database. 100 writes/second and 100K writes/second require completely different architectures.

### Mistake 5: Defending Your Design When Challenged

Interviewer: "What if the database becomes a bottleneck?"
Bad candidate: "I don't think it will."
Good candidate: "Good point. At ~10K writes/second, a single PostgreSQL instance will struggle. I'd add read replicas first for read-heavy queries, and if write throughput exceeds 10K/second, I'd shard by userId using consistent hashing."

The interviewer is not attacking your design. They are probing whether you can adapt.

---

## Interview Mental Models

**The Scalability Ladder:**
Single server → Add read replicas → Add caching → Shard database → Add CDN → Microservices

Move up the ladder only when the current level is insufficient. Never skip steps without justification.

**The Consistency Spectrum:**
Strong consistency (banking, inventory) → Read-your-writes (social profile) → Eventual consistency (social feed, search index)

Match your consistency model to the use case. Over-specifying consistency for eventually consistent systems wastes resources and reduces availability.

**The Storage Decision Tree:**
Need ACID and complex joins? → SQL
Need massive write throughput, time-series? → Cassandra
Need key-value at speed? → Redis/DynamoDB
Need full-text search? → Elasticsearch
Need files/media/blobs? → Object storage (S3)

---

## Practice Protocol

The best way to prepare:

1. **Mock interviews:** Do 20+ mock interviews with a timer. The time pressure reveals gaps that reading cannot.
2. **Explain out loud:** Practice narrating your design to a rubber duck or friend. If you cannot explain it simply, you do not understand it fully.
3. **Review real architectures:** Study how Instagram, Uber, Netflix, Airbnb, and Discord actually built their systems (their engineering blogs are public).
4. **Do the math:** For every practice problem, calculate QPS, storage, and bandwidth. Make the math habitual.
5. **One system per day:** Spend 45 minutes designing one system from scratch. Whiteboard, not computer. Then compare with known solutions.`,

  codeExamples: [
    {
      title: 'Back-of-Envelope Estimation Template',
      code: `// System Design Estimation Template
// Use this for every problem before drawing architecture

function estimateSystem(params: {
  dau: number;           // Daily Active Users
  requestsPerUserPerDay: number;
  writeToReadRatio: number; // e.g., 1:10 means 1 write per 10 reads
  avgRecordSizeBytes: number;
  writeGrowthPerYear: number; // multiplier, e.g., 1.5 for 50% growth
  yearsToStore: number;
}) {
  const SECONDS_PER_DAY = 86_400;

  const totalRequestsPerDay = params.dau * params.requestsPerUserPerDay;
  const qps = Math.round(totalRequestsPerDay / SECONDS_PER_DAY);

  const writeRatio = 1 / (1 + params.writeToReadRatio);
  const readRatio = 1 - writeRatio;
  const writesPerDay = Math.round(totalRequestsPerDay * writeRatio);
  const readsPerDay = Math.round(totalRequestsPerDay * readRatio);
  const writeQps = Math.round(writesPerDay / SECONDS_PER_DAY);
  const readQps = Math.round(readsPerDay / SECONDS_PER_DAY);

  const storagePerDay = writesPerDay * params.avgRecordSizeBytes;
  const storagePerYear = storagePerDay * 365;
  const totalStorage = storagePerYear * params.yearsToStore;

  const formatBytes = (bytes: number): string => {
    if (bytes < 1e6) return \`\${(bytes / 1e3).toFixed(1)} KB\`;
    if (bytes < 1e9) return \`\${(bytes / 1e6).toFixed(1)} MB\`;
    if (bytes < 1e12) return \`\${(bytes / 1e9).toFixed(1)} GB\`;
    return \`\${(bytes / 1e12).toFixed(1)} TB\`;
  };

  return {
    totalQps: qps,
    readQps,
    writeQps,
    readsPerDay,
    writesPerDay,
    storagePerDay: formatBytes(storagePerDay),
    storagePerYear: formatBytes(storagePerYear),
    totalStorage: formatBytes(totalStorage),
  };
}

// Example: Design Twitter
const twitter = estimateSystem({
  dau: 100_000_000,           // 100M DAU
  requestsPerUserPerDay: 100, // 100 actions/day (reads tweets)
  writeToReadRatio: 100,      // 1 tweet per 100 reads
  avgRecordSizeBytes: 300,    // 300 bytes per tweet
  writeGrowthPerYear: 1.2,
  yearsToStore: 5,
});

console.log('Twitter Estimates:', twitter);
/*
{
  totalQps: 115740,
  readQps: 114595,
  writeQps: 1145,
  readsPerDay: 9900990099,
  writesPerDay: 99009901,
  storagePerDay: '29.7 GB',
  storagePerYear: '10.8 TB',
  totalStorage: '54.2 TB'
}
*/`,
      output: `Twitter Estimates:
{
  totalQps: 115740,
  readQps: 114595,
  writeQps: 1145,
  storagePerDay: '29.7 GB',
  totalStorage: '54.2 TB'
}`,
      explanation:
        "This estimation tells you everything you need to make database decisions: 115K QPS means you definitely need caching (a single DB can't handle this). 1145 write QPS is manageable without sharding initially. 54 TB over 5 years means you'll need archive/cold storage strategy.",
    },
    {
      title: 'API Design Pattern for Interview',
      code: `// Clean API design pattern — show this structure in interviews

// ============ USER SERVICE ============
// POST /api/v1/users/register
interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}
interface RegisterResponse {
  userId: string;
  token: string;
  expiresAt: number;
}

// POST /api/v1/users/login
interface LoginRequest { email: string; password: string; }
interface LoginResponse { token: string; userId: string; expiresAt: number; }

// ============ TWEET SERVICE ============
// POST /api/v1/tweets
interface CreateTweetRequest {
  content: string;         // max 280 chars
  mediaUrls?: string[];    // pre-uploaded to S3
  replyToTweetId?: string; // for replies
}
interface CreateTweetResponse {
  tweetId: string;
  createdAt: number; // Unix timestamp
}

// GET /api/v1/feed
interface GetFeedRequest {
  userId: string;
  cursor?: string;  // for pagination (cursor-based, not offset)
  limit?: number;   // default 20, max 100
}
interface GetFeedResponse {
  tweets: Array<{
    tweetId: string;
    authorId: string;
    content: string;
    createdAt: number;
    likeCount: number;
    replyCount: number;
    mediaUrls?: string[];
  }>;
  nextCursor?: string; // undefined = no more results
  hasMore: boolean;
}

// Note: Use cursor-based pagination, NOT offset-based
// Offset: SELECT * FROM tweets LIMIT 20 OFFSET 1000
//   Problem: as new tweets are added, page 2 shifts — you see duplicates or miss tweets
// Cursor: SELECT * FROM tweets WHERE created_at < :cursor ORDER BY created_at DESC LIMIT 20
//   Stable regardless of new insertions`,
      explanation:
        'Always use cursor-based pagination in interviews — offset pagination breaks with real-time data (new items inserted between pages shift everything). Show clean request/response types. Note the distinction between pre-upload to S3 vs. inline media.',
    },
  ],

  commonMistakes: [
    'Starting to draw architecture without asking about scale — the same question has different answers at 1K vs 100M users',
    'Saying "I would use Kafka/Redis/Cassandra" without explaining why — technology names without justification score zero points',
    'Over-engineering: designing a distributed microservices system for a problem that a single PostgreSQL instance would handle',
    'Under-engineering: designing a single-server system for a problem explicitly stated to have 100M users',
    'Staying silent while thinking — narrate your reasoning, interviewers grade what they can observe',
    'Not identifying bottlenecks in your own design — interviewers expect you to critique yourself',
    'Defending your design aggressively when challenged — treat challenges as collaboration, not attacks',
    'Using offset-based pagination instead of cursor-based pagination — a red flag to experienced interviewers',
    'Forgetting to discuss consistency requirements before choosing a database',
    'Not scoping the problem — trying to design all features when the interviewer only needs the core 3',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between horizontal and vertical scaling?',
      answer:
        'Vertical scaling (scaling up) means adding more resources to a single machine — more CPU, RAM, or faster SSDs. It is simple but has hard limits (you cannot add infinite RAM to one server) and creates a single point of failure. Horizontal scaling (scaling out) means adding more machines to distribute the load. It has no theoretical upper limit and provides redundancy — if one machine fails, others continue serving. The tradeoff: horizontal scaling requires stateless servers, a load balancer, and often distributed data management, which adds operational complexity. Most large systems use vertical scaling first (cheapest), then horizontal when vertical limits are reached.',
      difficulty: 'beginner',
      tip: 'Mention SPOF (Single Point of Failure) for vertical scaling — it shows you think about failure modes, not just performance.',
    },
    {
      question: 'What is a load balancer and why do we use it?',
      answer:
        "A load balancer distributes incoming requests across multiple servers. Without it, all traffic hits one server — that server becomes a bottleneck and a single point of failure. With a load balancer, you can add servers horizontally and the load balancer distributes work evenly. Load balancers also handle health checks (removing unhealthy servers from the pool), SSL termination, and session persistence. Common algorithms: round-robin (default, simple), least connections (send to least loaded server), IP hash (same client always hits same server — useful for session stickiness). L4 load balancers operate at the TCP level; L7 load balancers understand HTTP and can route based on URL path or headers.",
      difficulty: 'beginner',
      followUp: [
        'What is the difference between L4 and L7 load balancers?',
        'How do you avoid the load balancer itself becoming a single point of failure?',
      ],
    },
    {
      question: 'What is caching and what problems does it solve?',
      answer:
        "Caching stores the results of expensive computations or frequent database queries in a fast, temporary store (usually in memory). It solves two problems: (1) Latency — a database query taking 50ms becomes a Redis read taking 0.5ms. (2) Load — if 10,000 users all request the same data, with caching the database is hit once instead of 10,000 times. Caching works because of the temporal locality principle — recently accessed data is likely to be accessed again soon — and the 80/20 rule — 20% of data accounts for 80% of reads. The fundamental challenge of caching is cache invalidation: ensuring the cache never serves stale data for too long.",
      difficulty: 'beginner',
      followUp: ['What are the main cache eviction strategies?', 'How do you handle cache invalidation?'],
    },
    {
      question: 'What is the difference between SQL and NoSQL databases?',
      answer:
        'SQL (relational) databases store data in tables with predefined schemas and relationships. They guarantee ACID properties (Atomicity, Consistency, Isolation, Durability) and support complex joins and transactions. They scale vertically well but horizontal sharding is complex. NoSQL databases sacrifice some guarantees for scalability and flexibility. Types include: key-value (Redis, DynamoDB), document (MongoDB), column-family (Cassandra), and graph (Neo4j). Choose SQL when you need ACID transactions, complex multi-table queries, or a well-defined schema that rarely changes. Choose NoSQL when you need massive write throughput, flexible schema, or data patterns (like time-series) that map poorly to tables.',
      difficulty: 'beginner',
    },
    {
      question: 'What is a CDN and when should you use one?',
      answer:
        'A Content Delivery Network (CDN) is a globally distributed network of servers that caches and serves static content close to users. Without a CDN, a user in Tokyo requesting content from a server in New York experiences ~150ms of network latency just for the TCP handshake, before any content is transferred. With a CDN, that content is cached in a Tokyo edge server and served in < 5ms. CDNs are essential for: static assets (JavaScript, CSS, images), video streaming, and any globally distributed user base. They also reduce origin server load — the origin only serves the first request per edge location, then the CDN serves cached copies to all subsequent users.',
      difficulty: 'beginner',
    },
    {
      question: 'How would you design a URL shortener?',
      answer:
        'Start with requirements: create short URLs, redirect to original, optional analytics. The system is read-heavy (100:1 read/write). For code generation, use Base62 encoding of auto-increment database IDs — 6 characters gives 56 billion unique codes, collision-free. Store mappings in a key-value store (DynamoDB) for fast O(1) lookups. Cache the top 20% of URLs in Redis — these handle 80% of traffic. Use 302 redirects (not 301) to preserve analytics: 301 caches in browser and bypasses your server. Architecture: client → load balancer → redirect service → Redis (cache) → DynamoDB (miss). Scale: with 100:1 ratio and heavy caching, the redirect service handles 100K+ reads/second easily.',
      difficulty: 'intermediate',
      followUp: ['How would you add click analytics without slowing down redirects?', 'How would you prevent abuse (spam links)?'],
    },
    {
      question: 'How does consistent hashing work and why is it used?',
      answer:
        'In normal hashing (server = hash(key) % N), adding or removing one server (changing N) causes almost every key to remap — resulting in a massive cache miss storm. Consistent hashing arranges servers on a virtual ring. Each server occupies positions on the ring based on a hash of its name. Each key is assigned to the first server clockwise from the key\'s hash position. When a server is added or removed, only the keys between that server and its predecessor on the ring need to remap — typically 1/N of all keys. This makes consistent hashing ideal for distributed caches (Redis clusters) and database sharding, where adding capacity should not invalidate most of the cache.',
      difficulty: 'intermediate',
      followUp: ['What is the "virtual nodes" technique in consistent hashing and why is it needed?'],
      tip: 'Draw the ring — visual explanations of consistent hashing are much clearer than verbal ones.',
    },
    {
      question: 'What is the CAP theorem?',
      answer:
        "CAP theorem states that a distributed system can only provide two of three guarantees simultaneously: Consistency (all nodes see the same data at the same time), Availability (every request gets a response, even if it's not the latest data), and Partition Tolerance (the system continues operating despite network failures between nodes). Since network partitions are unavoidable in distributed systems, you must choose between Consistency (CP) and Availability (AP) during a partition. Cassandra and DynamoDB choose AP — they remain available but may return stale data. HBase and Zookeeper choose CP — they may refuse requests during a partition but never return inconsistent data. The nuance: CAP is a spectrum, and PACELC extends it to consider latency tradeoffs even without partitions.",
      difficulty: 'intermediate',
      followUp: [
        'Is the CAP theorem still relevant today, or has it been superseded?',
        'What is the PACELC model and how does it extend CAP?',
      ],
    },
    {
      question: 'How do microservices communicate with each other?',
      answer:
        'Microservices use two communication patterns: synchronous and asynchronous. Synchronous: services call each other directly via REST (HTTP/JSON) or gRPC (Protocol Buffers, faster, type-safe). Synchronous is simple but creates tight coupling — if Service B is slow, Service A is blocked. Asynchronous: services communicate via message queues (Kafka, RabbitMQ, SQS). Service A publishes an event; Service B consumes it at its own pace. This decouples services and enables retry/replay but adds operational complexity. In practice, use synchronous for user-facing requests needing immediate response (login, payment confirmation) and asynchronous for background processing (send email after signup, update analytics after purchase).',
      difficulty: 'intermediate',
    },
    {
      question: 'What is an API gateway and what problems does it solve?',
      answer:
        "An API gateway is a single entry point that sits in front of all microservices and handles cross-cutting concerns. Without it, every microservice must implement authentication, rate limiting, logging, and SSL termination independently — duplicated effort and inconsistent behavior. The API gateway handles: (1) Authentication/authorization — validate JWT tokens before forwarding requests. (2) Rate limiting — throttle abusive clients. (3) Request routing — forward /api/users to user-service, /api/orders to order-service. (4) Protocol translation — external REST to internal gRPC. (5) Response aggregation — combine responses from multiple services for a single client request. Common implementations: Kong, AWS API Gateway, NGINX, Envoy.",
      difficulty: 'intermediate',
    },
    {
      question: 'How would you handle the thundering herd problem?',
      answer:
        'The thundering herd occurs when a popular cache key expires and thousands of simultaneous requests all miss the cache and hit the database at once, potentially overwhelming it. Solutions: (1) Cache lock / mutex: when a cache miss occurs, only one request fetches from DB while others wait for the cache to be populated. (2) Cache staggering: add random jitter to TTLs so cache entries expire at different times, not simultaneously. (3) Background refresh: before a cache entry expires, proactively refresh it in a background job — the entry never actually expires from the users\' perspective. (4) Probabilistic early expiration: each request has a small probability of refreshing the cache before it actually expires, distributing the refresh load over time. Option 3 (background refresh) is preferred for extremely hot keys like trending tweets or breaking news articles.',
      difficulty: 'advanced',
      followUp: ['How would you implement a distributed mutex for cache locking?'],
    },
    {
      question: 'How do you ensure exactly-once message delivery in a distributed system?',
      answer:
        "Exactly-once delivery is the hardest delivery guarantee. At-most-once (fire and forget) loses messages; at-least-once (retry on failure) delivers duplicates; exactly-once requires both. The solution combines: (1) Idempotent consumers — processing the same message twice has the same effect as once. This is often simpler than true exactly-once. (2) Deduplication IDs — each message has a unique ID; consumers track processed IDs and skip duplicates. (3) Transactional outbox pattern — instead of publishing to Kafka directly, write the event to a database table in the same transaction as your business logic, then a separate process reads and publishes. Kafka Transactions enable atomic writes across multiple partitions/topics. True exactly-once is expensive — most systems settle for idempotent at-least-once delivery.",
      difficulty: 'advanced',
    },
    {
      question: 'How would you design a distributed lock?',
      answer:
        'A distributed lock prevents concurrent execution of a critical section across multiple servers. Common approach: Redis with the SET NX PX pattern — SET lock_key value NX (only if not exists) PX 30000 (expire in 30 seconds). The expiry prevents deadlocks if the lock holder crashes. Redlock (Redis\'s own algorithm) uses majority voting across 5+ Redis instances for fault tolerance. Zookeeper provides stronger guarantees using ephemeral nodes: the lock is released automatically when the holder\'s session ends, even if the process crashes, without relying on TTLs. The hardest part: what if the lock holder pauses (GC pause) for longer than the TTL? The lock expires, another node acquires it, and now two nodes think they own the lock. Solutions include fencing tokens — a monotonically increasing number returned with the lock that storage systems check to reject stale writes.',
      difficulty: 'advanced',
      tip: 'Mention the GC pause problem and fencing tokens — this is what separates a "I know Redis" answer from a "I understand distributed systems" answer.',
    },
    {
      question: 'How do you handle cache invalidation at scale?',
      answer:
        "Cache invalidation is the hardest problem in computer science (not literally, but it is genuinely hard). Strategies: (1) TTL-based expiration — simplest; tolerate stale data for a bounded time. Good for data that changes infrequently (product descriptions, user profiles). (2) Write-through invalidation — when the database is updated, immediately delete or update the cache entry. Problem: race conditions between invalidation and new reads. (3) Event-driven invalidation — database changes publish events (via Kafka or CDC tools like Debezium); cache consumers listen and invalidate affected keys. Most scalable for complex systems. (4) Cache versioning — instead of invalidating, change the key (user:123:v2 instead of user:123); old entries naturally expire. At scale, the hardest scenario is invalidating keys spread across a Redis cluster when a database row changes — CDC with Kafka consumers per cache region is the enterprise solution.",
      difficulty: 'advanced',
    },
    {
      question: 'How would you design rate limiting at scale?',
      answer:
        'Rate limiting prevents abuse and protects services from overload. Algorithms: (1) Token bucket — each client gets a bucket of tokens; each request costs a token; tokens refill at a fixed rate. Allows bursting up to bucket size. (2) Sliding window counter — count requests in the last N seconds using a rolling window. More accurate than fixed window. (3) Fixed window — count requests per time window (e.g., 100 requests per minute). Simple but allows 2x burst at window boundary. Implementation at scale: store counters in Redis. Redis INCR with EXPIRE is atomic — safe for distributed use. For per-user rate limiting, key = "rate_limit:{userId}:{window}". For global rate limiting, use a single key. To avoid a Redis bottleneck, use local in-process counters with periodic sync to Redis — accept slight inaccuracy for much higher throughput.',
      difficulty: 'advanced',
    },
    {
      question: 'SQL vs NoSQL — when do you choose each?',
      answer:
        'Choose SQL (PostgreSQL, MySQL) when: you need ACID transactions (financial transfers, inventory updates), you have well-defined relational data with complex joins (orders, customers, products), or your team is familiar with SQL and the scale does not demand NoSQL. Choose NoSQL when: you need massive write throughput > 50K writes/second (Cassandra), your data is document-shaped with no fixed schema (MongoDB), you need sub-millisecond key-value lookups (Redis, DynamoDB), or your data is time-series/append-only (Cassandra, InfluxDB). The common mistake: choosing NoSQL for "scale" when your data is inherently relational — you lose the query power of SQL without a compelling reason. Most startups should default to PostgreSQL; introduce NoSQL databases only for specific access patterns that relational databases handle poorly.',
      difficulty: 'advanced',
    },
    {
      question: 'Microservices vs Monolith for a startup?',
      answer:
        'For a startup, start with a monolith. Monoliths are faster to develop (no service boundaries, shared code, no network calls between components), easier to debug (single codebase, single log stream), and easier to refactor (no API contracts between services). The argument for microservices at startup — "we\'ll need to scale later anyway" — is premature optimization. You do not yet know which services will need to scale independently. Microservices introduce significant overhead: service discovery, inter-service authentication, distributed tracing, network latency between services, and operational complexity of deploying dozens of services. The right time to extract microservices: when a specific component has different scaling requirements than the rest (e.g., the image processing service needs 100x the compute of the user service), or when different teams own different domains and need independent deployment. Modular monolith first; extract services when a concrete need emerges.',
      difficulty: 'advanced',
    },
    {
      question: 'Strong consistency vs eventual consistency — when is each appropriate?',
      answer:
        'Strong consistency guarantees that after a write, all subsequent reads reflect that write. This requires coordination between nodes (consensus protocols like Paxos/Raft), which adds latency and reduces availability. Use strong consistency for: financial transactions (you must never show a wrong balance), inventory (you cannot oversell), authentication (a logged-out user must be logged out everywhere). Eventual consistency means writes propagate to all nodes eventually, but reads may return stale data for a short window. Use eventual consistency for: social media feeds (1-second delay in seeing a new post is acceptable), search indexes (showing a slightly stale product listing is acceptable), analytics (counters can be approximate). The key question: "what is the cost of a user seeing stale data?" If the cost is financial loss or security risk, use strong consistency. If the cost is a momentary delay in seeing a tweet, eventual consistency is perfectly acceptable.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'interview-framework-practice',
      title: 'Apply the 8-Step Framework',
      description:
        "Practice applying the complete 8-step framework to this problem: 'Design a notification system that sends push notifications, emails, and SMS to 50 million users, handling 200 million notifications per day.' Work through all 8 steps: clarify requirements, estimate scale, API design, data model, high-level design, deep dive, bottlenecks, tradeoffs. Time yourself — 45 minutes is the target.",
      starterCode: `// System Design Interview: Notification System
// Time yourself: 45 minutes total

// STEP 1: CLARIFY REQUIREMENTS (5 min)
// Functional:
//   - What notification types? (push, email, SMS)
//   - What triggers notifications? (events from other services)
//   - Priority levels? (transactional vs marketing)
//   - User preferences? (opt-out, frequency limits)
// Non-Functional:
//   - 50M users, 200M notifications/day
//   - SLA? (transactional must deliver in < 5 seconds?)
//   - Retry policy? (how many attempts before giving up?)

// STEP 2: ESTIMATE SCALE (3 min)
// 200M notifications/day = __ /second average
// Peak (assume 10x): __ /second
// Storage: notification records × __ bytes = __

// STEP 3: API DESIGN (5 min)
// POST /notifications/send
// Request: { userId, type, template, priority, idempotencyKey }
// Response: { notificationId, status }

// GET /notifications/status/:id
// Response: { notificationId, status, deliveredAt }

// STEP 4: DATA MODEL (5 min)
// notifications table:
//   id, user_id, type, template_id, status, created_at, sent_at, delivered_at
// user_preferences table:
//   user_id, push_enabled, email_enabled, sms_enabled, quiet_hours

// STEP 5: HIGH-LEVEL DESIGN (10 min)
// [API Gateway] → [Notification Service] → [Priority Queue]
//                                        ↓
//                              [Push Worker] [Email Worker] [SMS Worker]
//                                        ↓
//                              [Provider: FCM / SendGrid / Twilio]

// STEP 6: DEEP DIVE (15 min) — focus on:
// Priority queue design (transactional vs marketing different queues)
// Retry logic with exponential backoff
// Rate limiting per provider (Twilio has API limits)
// Delivery tracking

// STEP 7: BOTTLENECKS (5 min)
// - Single notification service: solution = horizontal scaling (stateless)
// - Database write bottleneck: solution = Cassandra for notification records
// - Provider rate limits: solution = per-provider queues with rate-aware consumers

// STEP 8: TRADEOFFS (3 min)
// - Kafka vs SQS: Kafka gives replay but more ops overhead
// - Separate queues per priority vs single queue with priority scores?`,
      solution: `// Complete Notification System Design

// SCALE: 200M/day = 2,315/sec average, ~23,000/sec peak

// KEY DECISIONS:

// 1. QUEUE STRATEGY: Use separate Kafka topics per priority
//    - "notifications.transactional" — processed immediately, retried aggressively
//    - "notifications.marketing" — rate-limited, batched, lower retry count
//    Why separate topics: marketing cannot starve transactional notifications

// 2. WORKER DESIGN: One worker type per channel
//    - PushWorker: FCM (Android), APNs (iOS)
//    - EmailWorker: SendGrid/SES
//    - SMSWorker: Twilio
//    Why separate: different rate limits, different retry strategies, scale independently

// 3. IDEMPOTENCY: Each notification has idempotencyKey
//    Prevents duplicate sends on retry
//    workers: check if notificationId already in "sent" status before sending

// 4. RATE LIMITING: Redis sliding window per provider
//    Twilio: 100 SMS/second limit → worker checks Redis before each send
//    If limit hit, re-queue with delay

// 5. DELIVERY TRACKING:
//    - Cassandra for notification records (write-heavy, time-series)
//    - Partition key: user_id (query "all notifications for user")
//    - Clustering key: created_at DESC (most recent first)

// 6. RETRY POLICY:
//    Transactional: 5 retries, exponential backoff (1s, 2s, 4s, 8s, 16s)
//    Marketing: 2 retries, then dead-letter queue

// TRADEOFF DISCUSSED:
//    - Kafka: replay capability useful for recovering from provider outages
//    - SQS: simpler ops, but no replay
//    Decision: Kafka (replay is critical — if FCM is down 30min, we need to replay)`,
      hints: [
        'Always design separate queues for different priority levels — never let marketing emails block transactional OTP messages',
        'Provider rate limits are a real constraint — Twilio, SendGrid, and FCM all have per-second limits',
        'Think about what happens when FCM is down for 30 minutes — how do you recover?',
      ],
    },
  ],

  keyTakeaways: [
    'The 8-step framework is non-negotiable: Clarify → Estimate → API → Data Model → HLD → Deep Dive → Bottlenecks → Tradeoffs',
    'Interviewers grade the reasoning process, not the final architecture — narrate every decision and always explain WHY',
    'Spend 5 minutes clarifying requirements before drawing anything — scale fundamentally changes every design decision',
    'Technology choices without justification score zero — "I would use Kafka because we need high-throughput event streaming with replay" beats "I would use Kafka"',
    'Calculate QPS and storage before choosing a database — 100 writes/second and 100K writes/second require completely different solutions',
    'Identify bottlenecks in your own design proactively — saying "this will break at 10K writes/second, and here is how I fix it" is a senior signal',
    'Treat interviewer challenges as collaboration, not attacks — adapt your design gracefully when challenged',
    'Strong consistency is for financial/security-critical data; eventual consistency is acceptable for social feeds, search indexes, and analytics',
    'Match architecture complexity to scale — a monolith on PostgreSQL is the right answer for most startup-scale problems',
    'Cursor-based pagination is always correct for real-time data; offset pagination breaks when new items are inserted',
  ],
};
