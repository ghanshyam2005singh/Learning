import type { Lesson } from '@/types';

export const highLevelDesignLesson: Lesson = {
  id: 'high-level-design',
  slug: 'high-level-design',
  title: 'High Level Design (HLD)',
  description:
    'Master high-level system design for interviews and production: the 6-step HLD framework, capacity estimation with real math, database selection decision trees, scalability patterns, and full case studies for a URL shortener and Instagram Feed — with every decision justified, not just stated.',
  category: 'HLD',
  order: 17,
  difficulty: 'intermediate',
  estimatedTime: 60,
  prevLesson: 'security-fundamentals',
  nextLesson: 'low-level-design',

  content: `## What Is High-Level Design?

High-level design (HLD) answers the macro question: **what components exist in this system, how do they communicate, and what technologies serve each role?**

Low-level design (LLD) answers the micro question: inside one service, how do you structure the code, what classes exist, how do they relate?

Think of building a city. HLD is the city plan — where the highways go, where the power plants sit, how water flows from reservoirs to homes. LLD is the architectural blueprint for a single building — how many floors, where the walls go, how electricity runs through the walls.

**Why HLD matters in interviews:** Every senior engineering interview at companies like Google, Amazon, Meta, and Uber includes a system design round. You'll be asked to design systems like "Design Twitter", "Design YouTube", or "Design a Rate Limiter". The interviewer is not looking for a perfect answer — they are evaluating how you think, how you structure ambiguity into concrete decisions, and whether you understand the tradeoffs behind every choice.

**The core HLD question:** Given a set of functional and non-functional requirements, design a system that fulfills them at scale.

---

## The 6-Step HLD Interview Framework

Experienced candidates don't dive straight into drawing boxes. They follow a structured process that communicates clarity of thought. Here is the exact framework used by engineers who pass system design rounds at top companies.

### Step 1 — Clarify Requirements (5 minutes)

Before drawing anything, clarify what you are building. Most system design problems are intentionally vague to test whether you ask the right questions.

**Functional requirements** — what the system does:
- What are the core features? (for Twitter: post tweets, follow users, see a feed)
- What does NOT need to be in scope? (direct messages? trending topics?)
- Who are the users? (consumers, businesses, developers via API?)

**Non-functional requirements** — how well it does it:
- Scale: How many daily active users (DAU)? Reads vs. writes ratio?
- Latency: What's acceptable response time? 100ms? 500ms?
- Consistency: Can users see stale data? Is eventual consistency acceptable?
- Availability: 99.9%? 99.99%? (they differ by 8.7 hours of downtime per year)
- Durability: Can we lose any data ever?

**Why this step matters:** Designing a system for 1,000 users looks completely different from one for 1 billion users. Asking requirements signals that you understand that design decisions depend on context. A candidate who jumps straight to "let's use Kafka" without understanding the read/write ratio looks like they're pattern-matching from tutorials, not thinking.

### Step 2 — Capacity Estimation (5–8 minutes)

Translate the requirements into numbers. This step drives almost every architectural decision.

**Daily Active Users (DAU):** How many users actively use the system per day?
**Queries Per Second (QPS):** DAU × average requests per user per day ÷ 86,400 seconds
**Storage:** How much new data per day × retention period = total storage needed
**Bandwidth:** Bytes per request × QPS = bytes per second to handle

These numbers tell you:
- QPS < 100: a single server handles this
- QPS 100–10,000: load balancing across a small cluster
- QPS > 100,000: you need sharding, caching, CDN, everything

### Step 3 — Define APIs (3–5 minutes)

Define the core API endpoints or interfaces the system exposes. This forces you to be concrete about inputs, outputs, and data contracts before drawing infrastructure.

For a URL shortener:
\`\`\`
POST /shorten   { longUrl: string } → { shortCode: string, shortUrl: string }
GET  /:code     → 301 Redirect to long URL
GET  /stats/:code → { clicks: number, createdAt: string }
\`\`\`

Defining APIs forces clarity: what data flows in, what flows out? This naturally reveals what the database must store.

### Step 4 — Database Design (5–8 minutes)

What data must be persisted? What is the data model? What are the access patterns (read-heavy, write-heavy, or both)?

The data model + access patterns determine which database you choose. This is not a random choice — it follows from the data itself.

### Step 5 — High-Level Diagram (10–15 minutes)

Now draw the system. Start with the user and work your way through each layer: client → CDN → load balancer → API servers → cache → database. Add message queues and object storage where they serve a clear purpose.

Explain EACH component's purpose as you add it. Never add a component without justifying why it's there.

### Step 6 — Deep Dive into Critical Components (10–15 minutes)

Pick the 2–3 most interesting or most challenging parts of the system and go deep. This is where candidates distinguish themselves. Typical deep-dive topics:
- How exactly does sharding work for this data?
- How do you handle cache invalidation?
- How does the feed generation algorithm scale?
- What happens during a database failover?

---

## Core Components of Every Distributed System

Every large-scale system is composed of the same set of fundamental building blocks. Understanding each one — what it does, WHY it exists, and when to use it — is the foundation of HLD.

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│           Web Browser / Mobile App / API Consumer               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CDN (Content Delivery Network)             │
│         Serves static assets from edge nodes near users         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       LOAD BALANCER                             │
│         Distributes requests across multiple API servers        │
└───────┬───────────────────┬───────────────────┬─────────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
  ┌──────────┐       ┌──────────┐       ┌──────────┐
  │ API      │       │ API      │       │ API      │
  │ Server 1 │       │ Server 2 │       │ Server 3 │
  └────┬─────┘       └────┬─────┘       └────┬─────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
              ┌───────────┴──────────┐
              ▼                      ▼
       ┌─────────────┐       ┌──────────────┐
       │ CACHE       │       │ MESSAGE QUEUE│
       │ (Redis)     │       │ (Kafka/SQS)  │
       └──────┬──────┘       └──────┬───────┘
              │                     │
              ▼                     ▼
       ┌─────────────────────────────────────┐
       │            DATABASE LAYER           │
       │   Primary DB ──────── Replica DB    │
       │   (PostgreSQL)        (Read only)   │
       └─────────────────────────────────────┘
              │
              ▼
       ┌─────────────┐
       │ OBJECT      │
       │ STORAGE     │
       │ (S3)        │
       └─────────────┘
\`\`\`

### Component 1: Client

The entry point into your system. Clients are:
- **Web browsers** making HTTP requests
- **Mobile apps** (iOS/Android) consuming your API
- **Third-party developers** using your public API

Why it matters in HLD: the client determines your protocol (HTTP/HTTPS, WebSockets for real-time), your authentication method (JWT tokens in headers, OAuth), and whether you need mobile-specific optimizations (smaller payloads, offline support).

### Component 2: CDN (Content Delivery Network)

A CDN is a geographically distributed network of servers that cache static content (images, CSS, JavaScript, videos) at edge locations physically close to users.

**Why it exists:** Without a CDN, a user in Mumbai requesting a video stored in a data center in Virginia must wait for data to travel ~13,000 km round trip — adding 150–200ms of latency on top of your application processing time. A CDN caches that video in an edge server in Mumbai. The request now travels ~50 km.

**What to cache on CDN:**
- Static assets: images, videos, CSS, JavaScript bundles
- Rarely-changing API responses (product catalog, public profile data)

**What NOT to cache on CDN:**
- User-specific data (shopping cart, inbox)
- Real-time data (live stock prices, current GPS location)

**Examples:** Cloudflare, AWS CloudFront, Fastly, Akamai

### Component 3: Load Balancer

A load balancer sits in front of multiple identical API servers and distributes incoming requests across them.

**Why it exists:** A single server has finite CPU, memory, and network capacity. At 50,000 QPS, no single machine can handle all requests. Load balancers allow **horizontal scaling** — you add more API servers behind the load balancer, and each handles a portion of traffic.

**Load balancing algorithms:**
- **Round-robin:** Requests go to each server in turn (1, 2, 3, 1, 2, 3...). Simple, works well when all servers are equal.
- **Least connections:** Send to the server with fewest active connections. Better for long-running requests.
- **IP hash:** Same client IP always goes to the same server. Needed for stateful sessions (though modern systems avoid server-side session state).

**Health checks:** Load balancers continuously ping each server. If a server stops responding, the load balancer stops sending it traffic — this is how you achieve high availability automatically.

**Examples:** AWS ALB/NLB, Nginx, HAProxy

### Component 4: API Servers (Application Tier)

These are your stateless application servers that contain the business logic.

**Why stateless is critical:** If server A handles your login request and stores session state in memory, then server B handles your next request and doesn't have that state — you appear logged out. By making servers stateless (all session state goes into Redis, all data into databases), ANY server can handle ANY request. This is what makes horizontal scaling possible.

**Typical responsibilities:**
- Authenticate and authorize the request
- Validate input
- Query the cache; on miss, query the database
- Apply business logic
- Return the response

### Component 5: Cache Layer (Redis)

A cache is an in-memory data store that holds frequently accessed data for sub-millisecond reads.

**Why it exists:** Database queries involve disk I/O, network calls, and query parsing — even a fast database takes 1–10ms per query. Redis serves the same data from memory in 0.1–0.5ms — 10–100x faster. At high QPS, this difference prevents the database from being overwhelmed.

**Cache patterns:**
- **Cache-aside (lazy loading):** Application checks cache first; on miss, queries DB and populates cache. Most common pattern.
- **Write-through:** Write to cache AND database simultaneously on every write. Cache is always fresh but writes are slower.
- **Write-behind:** Write to cache immediately, then asynchronously flush to database. Fastest writes, risk of data loss if cache fails.

**What to cache:**
- User sessions
- Frequently read, rarely written data (product catalog, user profile)
- Computed results (trending topics leaderboard)
- Rate limiting counters

**Cache invalidation:** The hardest problem in caching. When data changes, how do you ensure the cache is updated? Common approaches: TTL (time-to-live — cache entry expires after N seconds), event-driven invalidation (when DB updates, delete the cache key), and versioned keys.

### Component 6: Primary Database and Read Replicas

The primary (master) database handles all writes. Read replicas are copies that stream changes from the primary and handle read queries.

**Why replicas exist:** Most web applications are read-heavy (10:1 or 100:1 read-to-write ratio). By sending reads to replicas, you:
- Reduce load on the primary (which only handles writes and replication)
- Increase total read throughput linearly with replica count
- Provide geographic distribution (replica in each region)

**Replication lag:** There is a small delay (usually milliseconds) between when the primary writes data and when the replica receives it. For most use cases this is fine. For "read-your-own-writes" consistency (user posts a comment and immediately sees it), route the user's own reads to the primary for a few seconds after a write.

### Component 7: Message Queue

A message queue (Kafka, RabbitMQ, Amazon SQS) decouples producers (services that generate work) from consumers (services that process work).

**Why it exists:** Without a queue, if your image processing service is down when a user uploads a photo, the upload fails. With a queue, the upload service puts a message on the queue ("process this image") and returns success immediately. The image processor picks up the message when it's available. The two services are decoupled in time.

**When to use a queue:**
- Tasks that can be processed asynchronously (image resizing, email sending, push notifications)
- Smoothing traffic spikes (order processing: accept 10,000 orders instantly, process them at sustainable rate)
- Fan-out (one event triggers multiple downstream actions)
- Guaranteed delivery (message stays in queue until consumer acknowledges it)

**Examples:** Apache Kafka (high-throughput streaming), Amazon SQS (managed queue), RabbitMQ (flexible routing)

### Component 8: Object Storage

Object storage (Amazon S3, Google Cloud Storage) stores binary files — images, videos, documents, backups.

**Why it exists:** Relational databases are designed for structured data — rows and columns. Storing a 50MB video in a database table is a catastrophic misuse: it bloats backups, destroys query performance, and is expensive. Object storage is purpose-built for files: infinitely scalable, cheap per GB, globally accessible via URLs, and highly durable (99.999999999% — "eleven nines").

**Pattern:** Upload files directly to S3 (optionally via pre-signed URLs to avoid routing through your servers), store the S3 URL in your database, serve via CDN for performance.

---

## Capacity Estimation — The Math You Must Know

Capacity estimation is not just a checkbox — the numbers drive your architecture. Let's work through a full example.

### Example: Design Instagram at 100M DAU

**Given:**
- 100 million daily active users (DAU)
- Average user views 50 photos/day, uploads 0.2 photos/day
- Average photo size: 2 MB
- Metadata per photo: ~200 bytes
- Data retention: forever

**Step 1: Calculate QPS**

\`\`\`
Read QPS (photo views):
  100M users × 50 views/day = 5 billion reads/day
  5,000,000,000 ÷ 86,400 seconds ≈ 57,870 reads/second ≈ ~58K read QPS

Write QPS (uploads):
  100M users × 0.2 uploads/day = 20 million uploads/day
  20,000,000 ÷ 86,400 ≈ 231 writes/second ≈ ~230 write QPS

Read-to-write ratio: 58,000 : 230 ≈ 250:1 — extremely read-heavy
\`\`\`

**What this tells us:**
- We absolutely need caching — 58K QPS against a database directly is unsustainable
- We need many read replicas — reads dwarf writes
- Write path can be simpler — 230 QPS is manageable

**Step 2: Storage estimation**

\`\`\`
New photos per day:
  20 million photos × 2 MB = 40 TB of new photo data per day

Metadata per day:
  20 million photos × 200 bytes = 4 GB of metadata per day

After 1 year:
  Photos: 40 TB × 365 = 14.6 PB (petabytes) of photo storage
  Metadata: 4 GB × 365 = 1.46 TB of metadata (trivial, fits in PostgreSQL)
\`\`\`

**What this tells us:**
- Photos MUST go to object storage (S3) — we cannot store 14 PB in a relational DB
- Metadata (photo ID, user ID, caption, timestamp, S3 URL) is small enough for PostgreSQL
- CDN is essential — we can't serve 58K photos/second directly from S3 without a CDN layer

**Step 3: Bandwidth**

\`\`\`
Incoming bandwidth (uploads):
  230 writes/sec × 2 MB = 460 MB/sec = ~3.7 Gbps incoming

Outgoing bandwidth (views):
  58,000 reads/sec × 2 MB = 116 GB/sec outgoing

116 GB/sec ≈ 928 Gbps outgoing!
\`\`\`

**What this tells us:**
- We need aggressive CDN caching — no data center can serve 928 Gbps from origin servers
- CDN edge servers serve cached photos; only cache misses hit origin
- If CDN cache hit rate is 99%, actual origin traffic is 928 Gbps × 0.01 = 9.28 Gbps — manageable

---

## Database Selection — The Decision Framework

Choosing a database is one of the most consequential decisions in HLD. It's not "SQL is old, NoSQL is modern." Every database is a set of tradeoffs optimized for a specific set of access patterns.

### The Core Tradeoff: ACID vs Scale

**SQL databases (PostgreSQL, MySQL)** provide ACID guarantees:
- **Atomicity:** A transaction either fully succeeds or fully rolls back
- **Consistency:** Data is always in a valid state per constraints
- **Isolation:** Concurrent transactions don't see each other's partial state
- **Durability:** Committed data survives crashes

These guarantees come at a cost: they make horizontal sharding hard (transactions across shards break ACID) and impose a fixed schema.

**NoSQL databases** trade some ACID guarantees for horizontal scalability and flexible schema.

### The Decision Tree

\`\`\`
Is the data relational (entities with complex relationships)?
├── YES → Do you need ACID transactions (money, inventory)?
│          ├── YES → PostgreSQL / MySQL
│          └── NO → Could still use PostgreSQL, or consider DynamoDB
└── NO → What is the primary access pattern?
          ├── Key-value lookups (get user by ID, session by token)
          │    └── Redis (in-memory, ephemeral) or DynamoDB (persistent)
          ├── Time-series data (metrics, logs, IoT)
          │    └── InfluxDB, TimescaleDB, Cassandra
          ├── Wide-column, write-heavy, time-ordered
          │    └── Apache Cassandra
          ├── Full-text search (search bar, autocomplete)
          │    └── Elasticsearch
          ├── Document storage (user profiles, product catalogs, flexible schema)
          │    └── MongoDB
          └── Large files/blobs (images, videos, backups)
               └── Amazon S3 / Google Cloud Storage
\`\`\`

### Concrete Rules: When to Use What

**PostgreSQL** — Use when:
- You have relations between entities (users → orders → order items)
- You need ACID transactions (financial transfers, inventory deductions)
- Your schema is well-defined and stable
- You need complex queries (JOINs, aggregations, window functions)
- Default choice for most web applications

**Redis** — Use when:
- You need sub-millisecond reads (cache, session storage)
- Data fits in memory (or you're willing to accept eviction)
- You need atomic counters (rate limiting, view counts)
- You need pub/sub messaging (real-time notifications)
- Never as your primary/only database for persistent data you cannot afford to lose

**Cassandra** — Use when:
- Write throughput is enormous (billions of rows/day — IoT, metrics, activity logs)
- Data is time-series or append-only (you rarely update old records)
- You need geographical distribution across multiple data centers
- You can live without JOINs and complex queries
- Example use: Instagram stores user activity logs, Facebook Messenger messages

**MongoDB** — Use when:
- Data is document-oriented (a "product" has varying attributes depending on category)
- Schema flexibility is genuinely needed (each document can have different fields)
- You need rich queries on nested document fields
- Caution: flexible schema often signals unclear data modeling; PostgreSQL's JSONB column often handles this without abandoning relational benefits

**Elasticsearch** — Use when:
- You need full-text search (search bar, product search, log analysis)
- You need faceted search and aggregations over text fields
- Always use alongside a primary database — Elasticsearch is a search index, not a source of truth

**Amazon S3** — Use when:
- Data is binary/unstructured (images, videos, backups, CSVs, ML training data)
- Size per object can be gigabytes or larger
- You need 99.999999999% durability
- Cost per GB matters (S3 is roughly 20x cheaper per GB than relational storage)

---

## API Design in HLD

In system design, API design is about defining the contract between clients and your system. You don't need to specify every HTTP status code — focus on the core endpoints, request/response shapes, and key design decisions.

### REST Endpoint Design

Good REST APIs follow resource-oriented design:

\`\`\`
# URL Shortener API

POST   /urls                    → Create short URL
GET    /urls/{code}             → Get original URL (for redirect)
GET    /urls/{code}/stats       → Get click analytics
DELETE /urls/{code}             → Delete short URL

# Instagram API

POST   /users/{userId}/photos           → Upload photo
GET    /users/{userId}/photos           → List user's photos (paginated)
GET    /photos/{photoId}                → Get photo details
POST   /photos/{photoId}/likes          → Like a photo
DELETE /photos/{photoId}/likes/{userId} → Unlike a photo
GET    /feed                            → Get personalized feed (paginated)
POST   /users/{userId}/follow           → Follow a user
\`\`\`

### Pagination — Why It's Essential

Never return unbounded results. A user might have 10,000 photos. Returning all at once:
- Kills database performance (full table scan with OFFSET is O(n))
- Wastes bandwidth
- Crashes the client with too much data

**Cursor-based pagination** (preferred for feeds):
\`\`\`
GET /feed?cursor=1705234567&limit=20

Response:
{
  "posts": [...],
  "nextCursor": "1705234100",  // timestamp of last item
  "hasMore": true
}
\`\`\`

Why cursor over page number? Page numbers break when new items are inserted — "page 3" shifts when new posts arrive. Cursors are stable because they point to a specific item.

### Rate Limiting

Rate limiting prevents abuse and protects your backend:
- A client can make at most N requests per time window
- After exceeding the limit, return HTTP 429 Too Many Requests

**Implementation in HLD:** Use Redis to maintain a counter per user/IP per time window.

\`\`\`
GET /photos → check Redis: user:123:requests:minute
  if count >= 100: return 429 { "error": "rate limit exceeded", "retryAfter": 45 }
  else: increment counter with TTL 60s, process request
\`\`\`

---

## Scalability Decisions

### Read Replicas

**Problem:** At high read QPS, a single database can't handle all read queries without degrading write performance.

**Solution:** Add read replicas. Every write goes to the primary; reads distribute across replicas.

\`\`\`
                 ┌─────────────┐
  All WRITES ──► │   PRIMARY   │ ──── streams to ───► REPLICA 1 (reads)
                 │   DATABASE  │ ──── streams to ───► REPLICA 2 (reads)
                 └─────────────┘ ──── streams to ───► REPLICA 3 (reads)

API server: SELECT queries → load balanced across replicas
            INSERT/UPDATE/DELETE → always primary
\`\`\`

**Tradeoff:** Replication lag. If you write to primary and immediately read from replica, you might get stale data. For Instagram, this is fine — seeing a photo you uploaded 200ms later is not a problem. For bank account balance after a transfer, it is.

### Sharding (Horizontal Partitioning)

**Problem:** Even with replicas, a single primary can only handle so many writes. PostgreSQL tops out around 10,000–50,000 writes/second on good hardware.

**Solution:** Shard — split the database into multiple independent databases (shards), each owning a subset of data.

**Sharding strategies:**

**Range-based sharding:**
\`\`\`
Shard 1: users with ID 1        to 10,000,000
Shard 2: users with ID 10M+1    to 20,000,000
Shard 3: users with ID 20M+1    to 30,000,000

Problem: hot shards. If most new users are recent (high IDs),
Shard 3 takes all the write load. Shard 1 sits idle.
\`\`\`

**Hash-based sharding:**
\`\`\`
shard = hash(userId) % numberOfShards

User 1234567 → hash → 8234... % 4 = shard 2
User 9876543 → hash → 3891... % 4 = shard 3

Each shard gets ~equal load (hashes distribute uniformly).
Problem: resharding. Adding a 5th shard changes the modulo,
remapping ~80% of all data to different shards.
\`\`\`

**Consistent hashing** (preferred for dynamic clusters):
\`\`\`
Place shards on a virtual ring. Each key maps to the nearest
clockwise shard on the ring. Adding/removing a shard only
remaps ~1/N of keys, not all of them.

Used by: Amazon DynamoDB, Apache Cassandra, Redis Cluster
\`\`\`

**The cost of sharding:** Cross-shard queries are expensive or impossible. JOINs across shards don't work. You can't have a transaction that writes to shard 1 and shard 2 atomically. Sharding is a last resort — add caching, read replicas, and vertical scaling first.

### Cache-Aside Pattern (Lazy Loading)

The most common and practical caching pattern:

\`\`\`
function getUserProfile(userId: string) {
  // 1. Check cache
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);   // cache HIT: ~0.5ms

  // 2. Cache MISS: query database
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

  // 3. Populate cache for next request (TTL = 1 hour)
  await redis.setex(\`user:\${userId}\`, 3600, JSON.stringify(user));

  return user;  // first request: ~5ms; subsequent requests: ~0.5ms
}
\`\`\`

**Why "lazy"?** Data only enters the cache when it's actually requested. Cold caches fill themselves automatically on first access.

**When to invalidate:**
\`\`\`
async function updateUser(userId: string, data: UpdateData) {
  await db.query('UPDATE users SET ... WHERE id = $1', [userId]);
  await redis.del(\`user:\${userId}\`);  // delete cache entry; next read will re-fetch
}
\`\`\`

### Async Processing with Message Queues

**Problem:** Some operations are slow (image resizing, sending emails, computing recommendations) but don't need to be synchronous. Making the user wait for them degrades experience.

**Solution:** Put the work on a queue; return success immediately; a background worker processes the task.

\`\`\`
User uploads photo:
  1. API server saves raw photo to S3
  2. API server puts message on queue: { photoId, s3Url, userId }
  3. API server returns 202 Accepted immediately   ← user sees success
  4. Image processing worker picks up message
  5. Worker creates thumbnail, applies filters
  6. Worker saves processed versions to S3
  7. Worker updates database with final URLs

User experience: instant response
Image processing: asynchronous, can retry on failure
\`\`\`

---

## Case Study 1: URL Shortener (like bit.ly)

This is one of the most common system design interview questions. Let's walk through the full HLD.

### Step 1 — Requirements

**Functional:**
- Given a long URL, generate a short URL (e.g., bit.ly/abc123)
- Redirect short URL → long URL
- Optional: custom aliases, expiration, analytics

**Non-functional:**
- High availability (redirects must work; downtime = broken links across the internet)
- Low latency for redirects (< 100ms)
- Scale: 100M URLs created, 10 billion redirects/day

### Step 2 — Capacity Estimation

\`\`\`
Writes (URL creation):
  Assume 100M total URLs, growing by 1M new URLs/day
  1,000,000 ÷ 86,400 ≈ 12 writes/second  ← trivially small

Reads (redirects):
  10 billion redirects/day
  10,000,000,000 ÷ 86,400 ≈ 115,740 redirects/second ≈ 116K read QPS

Read-to-write ratio: 116,000 : 12 ≈ 10,000:1  ← massively read-heavy

Storage:
  1 URL record ≈ 500 bytes (long URL up to ~2048 chars + metadata)
  100M URLs × 500 bytes = 50 GB total  ← tiny, fits on a single server
\`\`\`

**What this tells us:**
- The write path is trivial — 12 writes/second needs almost nothing
- The read path needs aggressive caching — 116K reads/second against a database is too slow
- Storage is small — no sharding needed for the data itself
- The bottleneck is redirect latency; optimize for that

### Step 3 — API Design

\`\`\`
POST /urls
  Body: { longUrl: "https://example.com/very/long/path?query=params" }
  Response: { shortCode: "abc1234", shortUrl: "https://bit.ly/abc1234" }

GET /{shortCode}
  Response: HTTP 301 Redirect to long URL
  (or 302 if you want analytics to see each click — 301s get cached by browser)

GET /urls/{shortCode}/stats
  Response: { clicks: 48291, createdAt: "2024-01-15T10:30:00Z" }
\`\`\`

### Step 4 — Short Code Generation

**The core algorithm problem:** Given a long URL, generate a short, unique, URL-safe code.

**Option A: Random generation**
\`\`\`
Generate 6 random characters from [a-z, A-Z, 0-9] (62 chars)
62^6 = 56 billion possible codes
At 1M new URLs/day, collision probability is negligible
\`\`\`

**Option B: Base62 encoding of a counter**
\`\`\`
Maintain a global auto-incrementing counter in the database
URL #1,000,000 → encode 1000000 in base62 → "4c92"

Pros: guaranteed unique, no collision
Cons: predictable (sequential codes can be enumerated by attackers),
      requires a centralized counter (single point of failure at massive scale)
\`\`\`

**Option C: MD5/SHA hash of the long URL**
\`\`\`
hash = MD5("https://example.com/very/long") → "5d41402abc4b2a76b9719d911017c592"
shortCode = first 7 chars → "5d41402"

Problem: hash collisions. Two different URLs could produce the same 7-char prefix.
Need to handle collision: if code exists for a different URL, append a suffix and retry.
\`\`\`

**Best approach for interviews:** Base62 counter encoding with a distributed ID generator (like Twitter's Snowflake) to avoid the single-counter bottleneck at massive scale.

### Step 5 — High-Level Diagram

\`\`\`
User Browser
     │
     ▼
  CDN (cache popular short codes — 80% of traffic is to 20% of URLs)
     │ (cache miss)
     ▼
  Load Balancer
     │
     ▼
  API Servers (stateless, horizontally scalable)
     │                    │
     ▼                    ▼
  Redis Cache          URL Database (PostgreSQL)
  (shortCode → longUrl)  │
  TTL: 24 hours          ├── Table: urls
  Cache hit: <1ms        │   ├── id (bigint, PK)
                         │   ├── short_code (varchar, indexed)
                         │   ├── long_url (text)
                         │   ├── created_at (timestamp)
                         │   ├── expires_at (timestamp, nullable)
                         │   └── user_id (bigint, nullable)
                         │
                         └── Analytics: clicks table
                             ├── id, short_code, clicked_at, ip, user_agent
\`\`\`

**Redirect flow:**
\`\`\`
1. GET /abc1234
2. Check Redis: key "abc1234" → found "https://example.com/..."  (cache hit)
3. Return HTTP 302 Redirect (302 not 301 so analytics can see each click)
4. Record click asynchronously via message queue (don't slow down redirect)

On cache miss:
1. GET /abc1234
2. Redis miss
3. Query PostgreSQL: SELECT long_url FROM urls WHERE short_code = 'abc1234'
4. Store in Redis with 24h TTL
5. Redirect
\`\`\`

### Key Decisions and Why

| Decision | Choice | Why |
|----------|--------|-----|
| Cache layer | Redis | 116K read QPS needs sub-ms responses; DB alone can't sustain it |
| Click tracking | Async queue | Don't slow the redirect for analytics; eventual consistency is fine |
| Redirect code | 302 (not 301) | 301s are cached by browser forever; you lose analytics data |
| Database | PostgreSQL | Small dataset (50GB), needs exact-match lookups on short_code index |
| Short code | Base62 counter | Unique by construction, no collision handling needed |

---

## Case Study 2: Instagram Feed

More complex than the URL shortener — involves social graphs, content ranking, and fan-out at scale.

### Step 1 — Requirements

**Functional:**
- Users can upload photos with captions
- Users can follow other users
- Users see a personalized feed of photos from people they follow, ordered by recency
- Users can like and comment on photos

**Non-functional:**
- 500M DAU
- Feed must load in < 200ms
- High availability — users expect Instagram to always work
- Eventual consistency is acceptable (feed doesn't need to be perfectly up to the millisecond)

### Step 2 — Capacity Estimation

\`\`\`
Uploads:
  500M users × 0.2 uploads/day = 100M photos/day
  100M ÷ 86,400 ≈ 1,157 writes/second

Feed reads:
  500M users × 20 feed loads/day = 10 billion reads/day
  10B ÷ 86,400 ≈ 115,740 feed reads/second

Photo size: 2MB average
Daily storage: 100M × 2MB = 200 TB/day of photos
\`\`\`

### Step 3 — The Core Problem: Feed Generation

Building a feed (what photos does this user see?) can be done two ways:

**Pull model (fan-out on read):**
\`\`\`
When user opens the app:
  1. Query: "who does user 123 follow?" → [user_456, user_789, user_101, ...]
  2. For each followed user, get their recent photos
  3. Merge, sort by time, return top 20

Problem: if user follows 5,000 celebrities, step 2 makes 5,000 DB queries per feed load.
At 115K feed reads/second, this creates 5,000 × 115,000 = 575 million DB queries/second.
Catastrophic.
\`\`\`

**Push model (fan-out on write):**
\`\`\`
When celebrity user_456 (10M followers) posts a photo:
  1. Save photo to database + S3
  2. Find all 10M followers of user_456
  3. For each follower, insert the photo into their personal "feed table"

When user 123 loads their feed:
  1. Query user 123's pre-computed feed table → already sorted, instant
  2. Return top 20 photos

Problem: when a celebrity with 10M followers posts, you must do 10M write operations.
If Kylie Jenner posts, 10M database rows must be updated.
\`\`\`

**Hybrid approach (what Instagram actually does):**
\`\`\`
Regular users (< ~1,000 followers): fan-out on write
  → Pre-compute their feed into followers' feed tables

Celebrity users (> 1,000 followers): fan-out on read
  → Their content is not pushed; followers fetch celebrity content at read time

When user loads feed:
  1. Read pre-computed feed from table (covers people they follow with < 1K followers)
  2. Fetch recent posts from followed celebrities directly
  3. Merge both lists, sort by time, return
\`\`\`

### Step 4 — High-Level Diagram

\`\`\`
Mobile App
    │
    ├── Upload photo
    │       ▼
    │   Load Balancer → Upload Service
    │       │
    │       ├── Save metadata → PostgreSQL (photo metadata)
    │       ├── Save raw image → S3
    │       └── Publish to Kafka: "photo_uploaded" event
    │                 │
    │                 ▼
    │           Fan-out Service (consumes Kafka)
    │               │
    │               ├── Regular followers: write to Feed Table (Redis/Cassandra)
    │               └── Celebrity post: skip (handled at read time)
    │
    └── Load feed
            ▼
        Load Balancer → Feed Service
            │
            ├── Read pre-computed feed from Feed Table (Redis)
            ├── Fetch recent celebrity posts (cache + DB)
            ├── Merge + rank
            └── Return top 20 photos (with S3 URLs)
                        │
                        ▼ (client fetches actual photos)
                    CDN → S3 (photos cached at edge)
\`\`\`

### Step 5 — Database Schema

\`\`\`sql
-- Users
users: id, username, email, profile_photo_url, follower_count, created_at

-- Photos
photos: id, user_id, caption, s3_url, thumbnail_url, like_count, created_at
        INDEX ON (user_id, created_at DESC)  -- for "get user's photos"

-- Social graph (who follows whom)
follows: follower_id, followee_id, created_at
         INDEX ON follower_id  -- "who does this user follow?"
         INDEX ON followee_id  -- "who follows this user?"

-- Pre-computed feed (stored in Cassandra for write-heavy fan-out)
user_feed: user_id, photo_id, photo_owner_id, created_at
           PRIMARY KEY (user_id, created_at DESC)  -- efficient feed retrieval

-- Likes (high write volume — consider Cassandra or Redis counters)
likes: photo_id, user_id, created_at
\`\`\`

**Why Cassandra for the feed table?**
The feed table is write-heavy (every photo from a followed user inserts a row) and has a simple access pattern (give me user X's recent photos, sorted by time). Cassandra is designed exactly for this: time-ordered, write-heavy, key-value-like access with no JOINs.

### Key Decisions and Why

| Decision | Choice | Why |
|----------|--------|-----|
| Photo storage | S3 + CDN | Cannot store PBs of binary data in relational DB; CDN essential for 115K reads/sec |
| Feed generation | Hybrid push/pull | Pure push fails for celebrities (10M writes per post); pure pull fails at scale |
| Fan-out messaging | Kafka | Durable, high-throughput event streaming; fans out to multiple consumers |
| Feed table DB | Cassandra | Write-heavy, time-ordered, single access pattern — Cassandra's sweet spot |
| Metadata DB | PostgreSQL | Relational data (users, follows, likes) with complex queries |

---

## HLD vs LLD — Comparison

| Aspect | High-Level Design (HLD) | Low-Level Design (LLD) |
|--------|------------------------|------------------------|
| **Question answered** | What services exist? How do they communicate? What databases to use? | Inside one service, how is the code structured? What classes exist? |
| **Scope** | Entire system (multiple services) | Single service or component |
| **Output** | Architecture diagram, database choices, API contracts | Class diagrams, data models, method signatures |
| **Abstractions** | Services, databases, queues, CDN | Classes, interfaces, design patterns |
| **Time in interview** | 30–45 minutes | 20–30 minutes |
| **Focus** | Scalability, availability, data flow | Maintainability, extensibility, OOP principles |
| **Key skills** | Capacity math, tradeoff analysis, distributed systems | SOLID, design patterns, cohesion/coupling |
| **Example question** | "Design Twitter" | "Design the class structure for a Twitter feed object" |
| **Technologies discussed** | Redis, Kafka, PostgreSQL, S3, CDN | No external tech — pure code structure |
| **Most common mistake** | Jumping to solutions before clarifying requirements | Designing too abstractly without concrete implementation |

**Critical insight:** HLD and LLD are not in opposition — they operate at different levels. A great system needs both: well-chosen macro architecture (HLD) AND well-structured internal code (LLD). A perfect HLD with bad LLD produces a scalable but unmaintainable codebase. Perfect LLD with bad HLD produces beautifully structured code that falls over under load.

---

## Implementation Thinking: How to Approach Any HLD Problem

When you encounter a new system design problem, follow this mental process:

**1. Name the data**
What data exists? Users? Posts? Messages? Products? Orders?
Data is the foundation. Everything else — databases, services, caches — exists to serve the data.

**2. Find the access patterns**
How is each type of data accessed? Read-heavy or write-heavy?
What queries are needed? Point lookups (by ID), range queries (by time), full-text search?

**3. Choose databases based on access patterns** (not trend or familiarity)
The access pattern determines the database, not the other way around.

**4. Identify the bottleneck**
Where will the system break at scale? Is it the database? The computation? The network? Design specifically to handle that bottleneck.

**5. Add components only when justified**
Every component has cost: operational complexity, potential failure points, infrastructure cost. Don't add Redis if a database index solves the problem. Don't add Kafka if a synchronous call works. Add complexity only when you can articulate the specific problem it solves.

**6. State tradeoffs explicitly**
Every architectural decision trades one thing for another. Caching trades consistency for speed. Eventual consistency trades data freshness for availability. CDN trades storage for latency. Explicitly naming the tradeoff shows the interviewer you understand the decision.`,

  codeExamples: [
    {
      title: 'Complete System Architecture — URL Shortener',
      code: `// ── URL Shortener: Full System Architecture in Pseudocode ──────────────
//
// This represents the data flow and component interactions,
// not a deployable implementation.
//
// Components:
//   Client → Load Balancer → API Server → Redis Cache → PostgreSQL
//                                      ↘ Kafka → Analytics Worker

// ── Database Schema ──────────────────────────────────────────────────────

/*
TABLE urls (
  id           BIGSERIAL PRIMARY KEY,
  short_code   VARCHAR(10) UNIQUE NOT NULL,   -- indexed for O(log n) lookup
  long_url     TEXT NOT NULL,
  user_id      BIGINT REFERENCES users(id),   -- nullable (anonymous creation)
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,                   -- nullable (never expires)
  is_active    BOOLEAN DEFAULT true
)

TABLE clicks (
  id           BIGSERIAL PRIMARY KEY,
  short_code   VARCHAR(10) NOT NULL,
  clicked_at   TIMESTAMPTZ DEFAULT NOW(),
  ip_address   INET,
  user_agent   TEXT,
  referrer     TEXT
)
-- clicks is append-only and write-heavy → good candidate for Cassandra
-- or partition by clicked_at for PostgreSQL partition pruning
*/

// ── Short Code Generation (Base62) ──────────────────────────────────────
const BASE62_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function encodeBase62(num: number): string {
  if (num === 0) return BASE62_CHARS[0];
  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

// Auto-increment ID from DB → encode to short code
// ID: 1,000,000 → "4c92"
// ID: 1,000,001 → "4c93"
// 62^6 = 56 billion possible 6-char codes (enough for centuries)

// ── API Server: Create Short URL ─────────────────────────────────────────
async function createShortUrl(longUrl: string, userId?: string): Promise<string> {
  // 1. Validate the URL
  try {
    new URL(longUrl); // throws if invalid
  } catch {
    throw new Error('Invalid URL format');
  }

  // 2. Check if this exact long URL already has a short code (deduplication)
  const existing = await db.query(
    'SELECT short_code FROM urls WHERE long_url = $1 AND user_id IS NULL',
    [longUrl]
  );
  if (existing.rows[0]) return \`https://bit.ly/\${existing.rows[0].short_code}\`;

  // 3. Insert and get auto-incremented ID
  const result = await db.query(
    'INSERT INTO urls (long_url, user_id) VALUES ($1, $2) RETURNING id',
    [longUrl, userId ?? null]
  );
  const id = result.rows[0].id;

  // 4. Generate short code from ID
  const shortCode = encodeBase62(id).padStart(6, 'a'); // ensure minimum 6 chars

  // 5. Store short code back
  await db.query('UPDATE urls SET short_code = $1 WHERE id = $2', [shortCode, id]);

  return \`https://bit.ly/\${shortCode}\`;
}

// ── API Server: Redirect ─────────────────────────────────────────────────
async function handleRedirect(shortCode: string): Promise<string> {
  // 1. Check Redis cache first (sub-millisecond)
  const cached = await redis.get(\`url:\${shortCode}\`);
  if (cached) {
    // Async: record click WITHOUT blocking the redirect
    recordClickAsync(shortCode);
    return cached; // the long URL
  }

  // 2. Cache miss — query PostgreSQL
  const result = await db.query(
    \`SELECT long_url, is_active, expires_at
     FROM urls WHERE short_code = $1\`,
    [shortCode]
  );

  if (!result.rows[0]) throw new Error('Short URL not found');
  const { long_url, is_active, expires_at } = result.rows[0];

  if (!is_active) throw new Error('This URL has been deactivated');
  if (expires_at && new Date(expires_at) < new Date()) {
    throw new Error('This URL has expired');
  }

  // 3. Cache for next request (TTL: 24 hours)
  await redis.setex(\`url:\${shortCode}\`, 86400, long_url);

  // 4. Record click asynchronously
  recordClickAsync(shortCode);

  return long_url;
}

// ── Async Click Recording (via Kafka) ────────────────────────────────────
function recordClickAsync(shortCode: string): void {
  // Fire and forget — do NOT await. The redirect must be instant.
  kafka.produce('url-clicks', {
    shortCode,
    timestamp: Date.now(),
    // ip, userAgent would come from request context
  }).catch(err => logger.error('Failed to record click:', err));
}

// ── Analytics Worker (consumes Kafka) ────────────────────────────────────
kafka.consume('url-clicks', async (message) => {
  const { shortCode, timestamp } = message;

  // Batch insert clicks into the clicks table
  await db.query(
    'INSERT INTO clicks (short_code, clicked_at) VALUES ($1, to_timestamp($2 / 1000.0))',
    [shortCode, timestamp]
  );

  // Update Redis counter for real-time stats
  await redis.incr(\`clicks:\${shortCode}\`);
});

// ── System Architecture Diagram ──────────────────────────────────────────
/*
Write path (create short URL):
  Client → POST /urls → Load Balancer → API Server → PostgreSQL
                                                           ↑
  Response: { shortUrl: "bit.ly/abc123" }       insert URL, get ID, update short_code

Read path (redirect — the hot path, 116K QPS):
  Client → GET /abc123 → Load Balancer → API Server
                                              │
                                         Redis.get("url:abc123")
                                              │
                                    ┌─────────┴─────────┐
                               CACHE HIT            CACHE MISS
                          (99% of requests)    (first request for this code)
                                    │                    │
                               long_url ◄──── PostgreSQL.query
                                    │                    │
                               Redirect            Redis.setex(TTL=24h)
                                    │
                         Kafka.produce("url-clicks")   ← async, non-blocking
                                    │
                         Analytics worker consumes asynchronously
*/`,
      explanation:
        'This shows the full data flow for both the write path (create) and the read path (redirect). Notice that the hot path (redirect) hits Redis first — the database is only consulted on the first request for each short code. Click recording is entirely asynchronous so it never delays the redirect. This is the key architectural pattern: optimize the hot path relentlessly; defer everything non-essential.',
    },
    {
      title: 'Instagram Feed — Fan-Out Architecture',
      code: `// ── Instagram Feed: Fan-Out on Write vs Fan-Out on Read ─────────────────

// ── Database Schema (simplified) ─────────────────────────────────────────
/*
TABLE users      (id, username, follower_count, is_celebrity)
TABLE photos     (id, user_id, s3_url, caption, created_at)
TABLE follows    (follower_id, followee_id, created_at)

-- Pre-computed feed table (Cassandra for write-heavy fan-out)
TABLE user_feed  (user_id, created_at, photo_id, author_id)
  PRIMARY KEY (user_id, created_at DESC)
  -- Cassandra: efficient range query: "give me user 123's feed after timestamp T"
*/

// ── Photo Upload Service ──────────────────────────────────────────────────
async function uploadPhoto(userId: string, imageBuffer: Buffer, caption: string) {
  // 1. Upload raw image to S3
  const s3Key = \`photos/\${userId}/\${Date.now()}-original.jpg\`;
  await s3.putObject({ Bucket: 'instagram-photos', Key: s3Key, Body: imageBuffer });

  // 2. Save metadata to PostgreSQL
  const result = await db.query(
    'INSERT INTO photos (user_id, s3_url, caption) VALUES ($1, $2, $3) RETURNING id',
    [userId, \`https://s3.amazonaws.com/instagram-photos/\${s3Key}\`, caption]
  );
  const photoId = result.rows[0].id;

  // 3. Publish event to Kafka — triggers fan-out
  await kafka.produce('photo-uploaded', {
    photoId,
    authorId: userId,
    createdAt: Date.now(),
  });

  // 4. Return immediately — don't wait for fan-out
  return { photoId, status: 'processing' };
}

// ── Fan-Out Worker (consumes Kafka "photo-uploaded" events) ───────────────
const CELEBRITY_THRESHOLD = 1_000; // users with > 1K followers use fan-out on read

kafka.consume('photo-uploaded', async ({ photoId, authorId, createdAt }) => {
  // Check if this is a celebrity post
  const user = await db.query('SELECT follower_count FROM users WHERE id = $1', [authorId]);
  const isCelebrity = user.rows[0].follower_count > CELEBRITY_THRESHOLD;

  if (isCelebrity) {
    // Don't fan-out. Celebrity posts are fetched at read time.
    // Mark in cache: "celebrity has new content"
    await redis.set(\`celebrity_new:\${authorId}\`, createdAt, 'EX', 3600);
    return;
  }

  // Regular user: fan out to all followers
  // Get all followers (paginated to avoid loading millions of IDs into memory)
  let cursor = 0;
  while (true) {
    const followers = await db.query(
      'SELECT follower_id FROM follows WHERE followee_id = $1 LIMIT 1000 OFFSET $2',
      [authorId, cursor]
    );
    if (followers.rows.length === 0) break;

    // Batch insert into Cassandra feed table
    const insertions = followers.rows.map(({ follower_id }) => ({
      user_id: follower_id,
      photo_id: photoId,
      author_id: authorId,
      created_at: createdAt,
    }));

    await cassandra.batch(insertions.map(row =>
      \`INSERT INTO user_feed (user_id, created_at, photo_id, author_id)
       VALUES (\${row.user_id}, \${row.created_at}, \${row.photo_id}, \${row.author_id})\`
    ));

    cursor += 1000;
  }
});

// ── Feed Service (serve the feed) ────────────────────────────────────────
async function getFeed(userId: string, cursor?: number, limit = 20): Promise<Photo[]> {
  // 1. Get pre-computed feed from Cassandra (covers non-celebrity follows)
  const feedRows = await cassandra.query(
    \`SELECT photo_id, author_id, created_at FROM user_feed
     WHERE user_id = ? AND created_at < ?
     ORDER BY created_at DESC LIMIT ?\`,
    [userId, cursor ?? Date.now(), limit]
  );

  // 2. Get list of celebrities this user follows
  const celebrities = await redis.smembers(\`user:\${userId}:celebrity_follows\`);

  // 3. Fetch recent celebrity posts directly (fan-out on read for celebrities)
  const celebrityPhotos: Photo[] = [];
  for (const celebId of celebrities) {
    const photos = await db.query(
      \`SELECT id, s3_url, caption, created_at FROM photos
       WHERE user_id = $1 AND created_at > $2
       ORDER BY created_at DESC LIMIT 5\`,
      [celebId, new Date(Date.now() - 24 * 60 * 60 * 1000)] // last 24 hours
    );
    celebrityPhotos.push(...photos.rows);
  }

  // 4. Merge pre-computed feed + celebrity posts
  const allPosts = [
    ...feedRows.map(r => ({ photoId: r.photo_id, createdAt: r.created_at })),
    ...celebrityPhotos.map(p => ({ photoId: p.id, createdAt: p.created_at })),
  ];

  // 5. Sort by time, take top N
  allPosts.sort((a, b) => b.createdAt - a.createdAt);
  const topPosts = allPosts.slice(0, limit);

  // 6. Batch-fetch full photo details (from cache or DB)
  return Promise.all(topPosts.map(p => getPhotoDetails(p.photoId)));
}

// ── Photo Detail Fetching with Cache ────────────────────────────────────
async function getPhotoDetails(photoId: string): Promise<Photo> {
  const cacheKey = \`photo:\${photoId}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const photo = await db.query(
    'SELECT * FROM photos WHERE id = $1',
    [photoId]
  );
  const result = photo.rows[0];

  // Replace raw S3 URL with CDN URL for fast delivery
  result.imageUrl = result.s3_url.replace(
    's3.amazonaws.com/instagram-photos',
    'cdn.instagram.com'
  );

  await redis.setex(cacheKey, 3600, JSON.stringify(result));
  return result;
}

// ── Architecture Summary ─────────────────────────────────────────────────
/*
WRITE PATH (photo upload):
  Mobile App
      │ POST /photos (multipart)
      ▼
  Upload Service
      ├── S3 ← raw image stored here
      ├── PostgreSQL ← metadata (user_id, s3_url, caption)
      └── Kafka ← "photo-uploaded" event published
                      │
                      ▼
              Fan-Out Worker
                      │
              ┌───────┴────────┐
         Regular user      Celebrity user
         (≤ 1K followers)  (> 1K followers)
              │                    │
              ▼                    ▼
        Cassandra           Redis flag only
        (insert row         (fetched at read time)
         per follower)

READ PATH (load feed):
  Mobile App
      │ GET /feed?cursor=1234567890
      ▼
  Feed Service
      ├── Cassandra → pre-computed rows for non-celebrity follows
      ├── Redis → celebrity list for this user
      ├── PostgreSQL/Redis → celebrity recent posts
      ├── Merge + sort + take top 20
      └── Batch-fetch photo details (Redis → PostgreSQL)
                                        │
                                    CDN serves actual images
*/`,
      explanation:
        'This shows the core architectural pattern that Instagram-scale systems use: hybrid fan-out. The key insight is that no single strategy works for all cases. Celebrity posts would create catastrophic write amplification if fanned out to millions of followers. Regular user posts are pre-computed because pulling them at read time would require too many queries. The hybrid approach serves both cases efficiently at the cost of increased system complexity.',
    },
    {
      title: 'Capacity Estimation — Step by Step Math',
      code: `// ── Capacity Estimation Template ─────────────────────────────────────────
// Use this mental model for any system design problem

// ── Example: Design a system like Twitter ────────────────────────────────

const SECONDS_PER_DAY = 86_400;
const MB = 1_000_000;       // 1 MB in bytes
const GB = 1_000_000_000;   // 1 GB in bytes
const TB = 1_000_000_000_000;

// ── Given Assumptions ─────────────────────────────────────────────────────
const DAU = 300_000_000;           // 300 million daily active users
const tweetsPerUserPerDay = 0.3;   // average user tweets 0.3 times/day
const tweetsReadPerUserPerDay = 60; // average user reads 60 tweets/day
const avgTweetSizeBytes = 300;     // text + metadata per tweet (not media)
const mediaAttachmentRate = 0.15;  // 15% of tweets include an image
const avgImageSizeBytes = 1 * MB;

// ── Write QPS (tweet creation) ───────────────────────────────────────────
const tweetsPerDay = DAU * tweetsPerUserPerDay;
// = 300M × 0.3 = 90 million tweets/day

const writeQPS = tweetsPerDay / SECONDS_PER_DAY;
// = 90,000,000 / 86,400 ≈ 1,042 writes/second

console.log(\`Tweet write QPS: ~\${Math.round(writeQPS).toLocaleString()}/sec\`);
// → 1,042 writes/second — manageable with standard PostgreSQL + small cluster

// ── Read QPS (timeline reads) ────────────────────────────────────────────
const tweetReadsPerDay = DAU * tweetsReadPerUserPerDay;
// = 300M × 60 = 18 billion reads/day

const readQPS = tweetReadsPerDay / SECONDS_PER_DAY;
// = 18,000,000,000 / 86,400 ≈ 208,333 reads/second

console.log(\`Tweet read QPS: ~\${Math.round(readQPS).toLocaleString()}/sec\`);
// → ~208K reads/second — requires aggressive caching; DB cannot sustain this directly

// ── Read-to-Write Ratio ───────────────────────────────────────────────────
const readWriteRatio = readQPS / writeQPS;
console.log(\`Read-to-write ratio: \${Math.round(readWriteRatio)}:1\`);
// → 200:1 — this system is massively read-heavy
// Architecture implication: optimize reads with caching + read replicas

// ── Storage Estimation ───────────────────────────────────────────────────
// Text storage
const textStoragePerDay = tweetsPerDay * avgTweetSizeBytes;
// = 90M × 300 bytes = 27 GB/day

// Media storage
const tweetsWithMediaPerDay = tweetsPerDay * mediaAttachmentRate;
const mediaStoragePerDay = tweetsWithMediaPerDay * avgImageSizeBytes;
// = 90M × 0.15 × 1MB = 13.5 TB/day

const totalStoragePerDay = textStoragePerDay + mediaStoragePerDay;
console.log(\`Storage per day: text=\${(textStoragePerDay / GB).toFixed(1)}GB, media=\${(mediaStoragePerDay / TB).toFixed(1)}TB\`);
// → text=27GB/day (trivial), media=13.5TB/day (significant)

// Storage for 5 years
const storageFor5Years = totalStoragePerDay * 365 * 5;
console.log(\`5-year storage: ~\${(storageFor5Years / TB / 1000).toFixed(0)} petabytes\`);
// → ~24 petabytes — definitely need object storage (S3)

// ── Bandwidth Estimation ──────────────────────────────────────────────────
// Outgoing bandwidth for text reads
const textBandwidth = readQPS * avgTweetSizeBytes;
// = 208,333 × 300 bytes = 62.5 MB/second

// Assume each feed load shows 2 images on average
const imageBandwidthPerRead = 2 * avgImageSizeBytes;
const imageBandwidth = readQPS * imageBandwidthPerRead;
// = 208,333 × 2MB = 416 GB/second (!!!)

console.log(\`Outgoing bandwidth: text=\${(textBandwidth / MB).toFixed(0)}MB/s, images=\${(imageBandwidth / GB).toFixed(0)}GB/s\`);
// → text: 62MB/s (fine), images: 416GB/s (impossible without CDN)

// ── Architecture Implications from the Numbers ──────────────────────────
/*
1. Write QPS = 1,042/sec
   → Single primary PostgreSQL handles this easily
   → No sharding needed on the write path

2. Read QPS = 208,333/sec
   → Cannot hit database for every read
   → Redis cache for hot tweets (most reads are to popular/recent tweets)
   → Assume 95% cache hit rate: only 10,416 DB reads/sec remain
   → Still need read replicas: 10K QPS across 3–5 replicas

3. Image bandwidth = 416 GB/sec
   → Mathematically impossible to serve from a single data center
   → CDN is NOT optional — it's the only way this works
   → CDN caches images at 200+ edge locations worldwide
   → With 99% CDN hit rate: only 4.16 GB/sec hits origin (manageable)

4. Media storage = 13.5 TB/day
   → Must use object storage (S3)
   → PostgreSQL cannot store 13TB of binary data per day
   → S3 is designed exactly for this: scalable, durable, cheap

5. Text storage = 27 GB/day
   → Trivial for PostgreSQL
   → After 5 years: ~50 TB — achievable with standard database sharding
   → Or use time-partitioning: old tweets on cheap cold storage
*/`,
      explanation:
        'Capacity estimation is not just math for its own sake — every number drives an architectural decision. Image bandwidth of 416 GB/second forces a CDN. Read QPS of 208K forces caching. Storage of 13 TB/day forces object storage. The math TELLS you what components you need. This is why interviewers want you to do the estimation before drawing the diagram — the numbers should guide the architecture, not the other way around.',
    },
  ],

  commonMistakes: [
    "Jumping straight to the solution diagram without clarifying requirements. Asking 'Is this read-heavy or write-heavy?', 'How many users?', 'Do we need real-time or eventual consistency?' signals engineering maturity. Skipping requirements and jumping to 'we need Kafka' looks like pattern-matching from tutorials.",
    "Adding components without justification. Every box in your diagram needs a reason. 'Let's add Kafka here' without explaining what producer, consumer, and problem it solves tells the interviewer you're drawing from memorized diagrams, not thinking.",
    "Treating NoSQL as automatically superior to SQL for scale. PostgreSQL with read replicas, proper indexing, and caching handles millions of QPS. NoSQL sacrifices query flexibility and ACID transactions. Use NoSQL only when you've exhausted SQL optimizations and can clearly articulate what you're gaining and what you're sacrificing.",
    "Forgetting to handle the cache invalidation problem. Saying 'we'll cache user profiles in Redis' is incomplete. What happens when a user updates their profile? If the cache isn't invalidated, every user sees the stale profile for up to TTL duration. Always discuss invalidation strategy alongside caching strategy.",
    "Designing for perfect consistency when eventual consistency is acceptable. Demanding strong consistency (every read sees the latest write) requires expensive distributed coordination and kills throughput. For an Instagram feed, seeing a post 500ms late is perfectly acceptable. Clarify consistency requirements in Step 1 and design accordingly.",
    "Ignoring the fan-out problem for social graphs. Designing a Twitter feed as 'query the database for everyone I follow' reveals no understanding of scale. At 100M users each following 500 accounts, that's 50 billion rows scanned per feed load. Pre-computing feeds (fan-out on write) or caching aggressively is the answer.",
    "Neglecting failure modes and retry logic. Distributed systems fail in partial and unexpected ways. What happens if the message queue is temporarily unavailable? If a database replica lags? Briefly addressing failure modes (queue persistence, retry with backoff, circuit breakers) elevates your answer from junior to senior.",
    "Using a single number for capacity without considering peak load. An average of 1,000 QPS doesn't mean 1,000 QPS all day. Traffic follows diurnal patterns — peak can be 3–10x average. Instagram sees 10x normal traffic when a celebrity posts. Design for peak, not average, or your system falls over every morning when users wake up.",
  ],

  interviewQuestions: [
    {
      question:
        'How would you design a URL shortening service like bit.ly? Walk me through your complete HLD.',
      difficulty: 'intermediate',
      answer:
        "Start with requirements: create short URLs, redirect short → long, optionally track clicks. Non-functional: low latency redirects (< 100ms), high availability, 100M URLs at 10 billion redirects/day. Capacity: 116K read QPS (redirects), only 12 write QPS — massively read-heavy. This drives the architecture: reads need Redis caching; writes are trivial. Short code generation: auto-increment ID encoded as Base62 — unique by construction. Architecture: Client → CDN (cache popular codes at edge) → Load Balancer → API Servers → Redis (cache short_code → long_url, TTL 24h) → PostgreSQL on cache miss. Click tracking: async via Kafka so it never blocks the redirect. Why 302 not 301? 301 is cached by browsers permanently — you lose analytics on repeat visitors. Key insight: this is a caching problem disguised as a design problem. 99% of requests are reads; get caching right and everything else is simple.",
      followUp: [
        'How would you handle custom aliases (bit.ly/mycustomcode)?',
        'How would you scale the short code generation if you need to generate 100K codes/second?',
        'What if you need to support URL expiration?',
      ],
      tip: "Lead with the capacity math — '116K read QPS tells me this is a caching problem, not a database scaling problem.' Interviewers are impressed when numbers drive architecture rather than gut feel.",
    },
    {
      question:
        'Why would you choose Cassandra over PostgreSQL for storing an Instagram-like feed?',
      difficulty: 'intermediate',
      answer:
        "The feed table has characteristics that match Cassandra's strengths and clash with PostgreSQL's. The feed is: (1) write-heavy — every photo posted by a followed user inserts a row into hundreds or thousands of followers' feed tables; (2) append-only — you add rows but rarely update them; (3) time-ordered — you always query 'give me this user's feed ordered by time descending'; (4) accessed by a single partition key (user_id) — no cross-row JOINs needed. Cassandra is designed for exactly this: it partitions data by a partition key (user_id maps directly to a Cassandra partition), sorts within the partition by a clustering key (created_at), and handles millions of writes per second with no single-node bottleneck. PostgreSQL would require locking, B-tree index updates, and vacuum/autovacuum overhead at this write rate. The key principle: choose the database that matches your access pattern, not the most familiar one.",
      tip: "Frame the answer as 'Cassandra's primary key design maps perfectly to this access pattern' — this shows you understand WHY Cassandra is faster for this use case, not just that it is.",
    },
    {
      question:
        "What is the fan-out problem? Describe both fan-out on write and fan-out on read, and explain when you'd use each.",
      difficulty: 'intermediate',
      answer:
        "Fan-out is the problem of distributing one event (a new post) to all interested parties (followers). Fan-out on write: when a user posts, immediately write the post into every follower's pre-computed feed table. Pros: reading the feed is instant (just read one table). Cons: if a celebrity has 10M followers and posts, you must perform 10M writes — this can take seconds and overwhelm your write capacity. Fan-out on read: don't pre-compute anything; when a user loads their feed, query for recent posts from everyone they follow in real-time. Pros: no write amplification. Cons: loading a feed requires many queries (one per followed user); at 100K QPS this is catastrophic. Hybrid approach (what Instagram actually does): regular users (< 1K followers) use fan-out on write because the write amplification is manageable. Celebrities (> 1K followers) use fan-out on read because their writes would amplify to millions of operations. At feed load time, merge pre-computed feed (for regular follows) with a real-time query for celebrity posts.",
      followUp: [
        'What threshold would you use to define a celebrity? Is 1,000 followers right?',
        'How does Kafka help with the fan-out on write approach?',
      ],
      tip: "Mentioning the hybrid approach immediately signals you've thought deeply about this problem. Pure fan-out on write and pure fan-out on read both have fatal failure modes at scale.",
    },
    {
      question:
        'A service currently handles 1,000 QPS but needs to handle 100,000 QPS after a viral event. Walk me through how you would scale it.',
      difficulty: 'intermediate',
      answer:
        "Scale in layers, from cheapest to most complex: (1) Vertical scaling first — is the database CPU-bound? More RAM? Upgrade the server. Fast but has a ceiling. (2) Add caching — if this is a read-heavy service, Redis caching can reduce DB load by 90–99% with minimal code changes. At 100K QPS, a 99% cache hit rate means only 1K QPS hits the database. (3) Read replicas — distribute read load across multiple DB copies. 4 replicas × 25K QPS each = 100K QPS total reads. (4) Horizontal scaling of API tier — add more stateless API servers behind the load balancer. Stateless is key: if servers hold session state, you can't freely add/remove them. (5) Database sharding — if writes are the bottleneck and vertical + caching didn't help, shard the database by user ID or another key. Last resort due to complexity: no cross-shard transactions, no cross-shard JOINs. (6) CDN — if bandwidth is the bottleneck for static assets, CDN eliminates the origin bandwidth problem entirely. Start with the simplest solution that works; add complexity only when required.",
      tip: "The order matters: caching → replicas → sharding. Jumping straight to sharding when caching would have solved it shows poor engineering judgment. Express the hierarchy explicitly.",
    },
    {
      question:
        'Explain the CAP theorem and how it influences database selection in system design.',
      difficulty: 'intermediate',
      answer:
        "CAP theorem states that a distributed system can guarantee at most two of three properties: Consistency (every read receives the most recent write), Availability (every request receives a response — not necessarily the latest data), and Partition tolerance (the system continues operating if network partitions occur). Since network partitions are a reality in distributed systems (not optional), you always need partition tolerance. The real choice is: CA systems (sacrifice partition tolerance — not realistic for distributed systems), CP systems (consistent + partition tolerant, but unavailable during partitions — e.g., HBase, ZooKeeper), or AP systems (available + partition tolerant, but eventually consistent — e.g., Cassandra, DynamoDB, CouchDB). Practical application: banking systems need CP — you cannot show a user an incorrect balance, so you'd accept brief unavailability during a network partition. Social media feeds are AP — showing a tweet 500ms late or slightly stale like counts is fine; the system should never refuse to load. PostgreSQL is CA (not truly partition tolerant without extra complexity). MongoDB, Cassandra, DynamoDB are AP. The key: match consistency requirements from your requirements phase to the database's CAP position.",
      tip: "The practical punchline is: 'In distributed systems, partition tolerance is mandatory, so the real question is: do you choose consistency or availability when a network partition occurs?' Frame it as a business decision — what does your user lose if you choose wrong?",
    },
    {
      question:
        'How would you design a rate limiter? Walk through the algorithm choices and implementation.',
      difficulty: 'intermediate',
      answer:
        "A rate limiter allows at most N requests per user per time window. Algorithm options: (1) Fixed window counter — maintain a counter per user per time window (e.g., per minute). Simple but has a burst problem: a user can make 100 requests at 12:00:59 and 100 more at 12:01:00 — 200 requests in 2 seconds. (2) Sliding window log — store timestamp of every request for the past minute; count entries to check limit. Accurate but memory-intensive. (3) Sliding window counter — hybrid: current window count + previous window count weighted by time overlap. Good balance of accuracy and memory. (4) Token bucket — each user has a bucket that refills at rate R tokens/second with max capacity B. Each request consumes 1 token. Allows controlled bursting up to B. Most commonly used. Implementation with Redis: INCR key with EXPIRE — atomic increment and TTL in Redis. Redis is the right tool because rate limiting requires: (a) sub-millisecond latency (checking on every request), (b) atomicity (INCR is atomic — no race conditions), (c) distributed state (works across multiple API servers). Return 429 Too Many Requests with Retry-After header when limit exceeded. Where to implement: as middleware in the API layer, before business logic is executed.",
      followUp: [
        'How would you implement rate limiting per IP vs per user? What are the tradeoffs?',
        'How does a distributed rate limiter work when you have 50 API servers?',
      ],
      tip: "Mentioning the token bucket algorithm by name and explaining why Redis's atomic INCR is the right primitive immediately signals you've thought about the implementation, not just the concept.",
    },
  ],

  exercises: [
    {
      id: 'hld-ex-1',
      title: 'Design a Pastebin Service (like pastebin.com)',
      description:
        'Design a high-level system for Pastebin — a service where users can paste text (code, notes) and share it via a short URL. Requirements: (1) Users can create pastes with optional expiration. (2) Anyone with the link can view the paste. (3) Pastes can be up to 10 MB of text. (4) 100M pastes total, 500K new pastes per day, 50M paste reads per day. Your task: (a) Estimate read and write QPS. (b) Estimate total storage needed for 5 years. (c) Design the API (create paste, get paste, delete paste). (d) Choose your databases and justify each choice. (e) Draw the high-level architecture diagram (text format). (f) Explain what happens when a paste is created (step-by-step data flow). (g) Explain what happens when a paste is read (step-by-step data flow including cache)',
      starterCode: `// Work through each part systematically:

// PART A: QPS Estimation
const DAU_reads = 50_000_000; // paste reads per day
const DAU_writes = 500_000;   // new pastes per day

const readQPS  = /* ? */ 0;
const writeQPS = /* ? */ 0;
// What does this ratio tell you about the architecture?

// PART B: Storage Estimation
const pastesPerDay = 500_000;
const avgPasteSizeBytes = /* ? */; // average between tiny snippets and 10MB max
const textStoragePerDay = /* ? */;
// After 5 years:
const fiveYearStorage = /* ? */;

// PART C: API Design
/*
POST /pastes
  Body: { content: string, expiresAt?: string, syntax?: string }
  Response: { pasteId: string, url: string, expiresAt?: string }

GET /pastes/{pasteId}
  Response: ?

DELETE /pastes/{pasteId}
  Response: ?
*/

// PART D: Database Choice
/*
What database for paste metadata? Why?
What storage for paste content? Why?
(Hint: pastes up to 10MB — where does that change your storage choice?)
*/

// PART E: Architecture Diagram (text format)
/*
Client
  │
  ▼
[?]
  │
  ▼
[?]
  ...
*/`,
      solution: `// PART A: QPS Estimation
const SECONDS_PER_DAY = 86_400;

const readQPS  = 50_000_000 / SECONDS_PER_DAY;  // ≈ 579 reads/second
const writeQPS = 500_000    / SECONDS_PER_DAY;  // ≈ 6 writes/second

// Read-to-write ratio: 579:6 ≈ 100:1 — very read-heavy
// This means: optimize reads aggressively with caching
// Writes are so infrequent that almost any approach works

// PART B: Storage Estimation
const avgPasteSizeBytes = 100_000; // 100KB average (mix of small code snippets and large files)

const textStoragePerDay = 500_000 * avgPasteSizeBytes; // 50 GB/day
const fiveYearStorage   = textStoragePerDay * 365 * 5; // ~91 TB

// 91 TB of text content — this CANNOT go in a relational database column.
// Must use object storage (S3). Database stores metadata + S3 URL only.

// PART C: API Design
/*
POST /pastes
  Body: { content: string, expiresAt?: string, syntax?: 'javascript' | 'python' | ... }
  Response: { pasteId: "a3f9k2", url: "https://paste.io/a3f9k2", expiresAt?: string }
  Status: 201 Created

GET /pastes/{pasteId}
  Response: { pasteId, content, syntax, createdAt, expiresAt, size, views }
  Status: 200 OK
  Status: 404 if not found
  Status: 410 Gone if expired (distinguish from never existed)

DELETE /pastes/{pasteId}
  Headers: Authorization (only creator can delete)
  Response: {} empty
  Status: 204 No Content

GET /pastes/{pasteId}/raw
  Response: text/plain content directly (no JSON wrapper — useful for wget/curl)
*/

// PART D: Database Choices
/*
PostgreSQL (metadata):
  - paste_id (varchar, PK)
  - user_id (nullable — anonymous pastes allowed)
  - s3_key (path to content in S3)
  - syntax_highlight (varchar)
  - size_bytes (integer)
  - view_count (integer)
  - created_at, expires_at (timestamp)
  - Reason: metadata is relational, small per row, needs exact-match lookups

Amazon S3 (paste content):
  - Key: pastes/{pasteId}.txt
  - Reason: content up to 10MB cannot live in DB column (performance, cost, backup bloat)
  - S3 is durable (11 nines), cheap (~$0.023/GB), and designed for this
  - Serve via CDN for fast delivery worldwide

Redis (cache):
  - Cache: paste_id → { metadata + content } for popular pastes
  - TTL: 1 hour (balance freshness vs cache hit rate)
  - Why: 579 read QPS × average content size = significant DB + S3 load without cache
  - Popular pastes get millions of reads — cache them aggressively
*/

// PART E: Architecture Diagram
/*
Client
    │
    ▼
  CDN (cache full paste responses for popular paste IDs)
    │ (cache miss or first request)
    ▼
  Load Balancer
    │
    ▼
  API Servers (stateless)
    │
    ├── On GET /pastes/{id}:
    │     1. Check Redis: "paste:a3f9k2" → HIT: return immediately (sub-ms)
    │     2. MISS: query PostgreSQL for metadata (has it expired? exists?)
    │     3. Fetch content from S3 (or CDN-cached S3 URL)
    │     4. Combine metadata + content → store in Redis (TTL: 1 hour)
    │     5. Return to client
    │     6. Increment view_count asynchronously (queue)
    │
    ├── On POST /pastes:
    │     1. Validate content size (reject > 10MB)
    │     2. Generate pasteId (random Base62, 6 chars)
    │     3. Upload content → S3 key: "pastes/{pasteId}.txt"
    │     4. Insert metadata row → PostgreSQL
    │     5. Return { pasteId, url }
    │     (No cache population on write — lazy loading on first read)
    │
    └── On expiration cleanup:
          Cron job every hour:
          DELETE FROM pastes WHERE expires_at < NOW()
          For each deleted paste: delete S3 object, delete Redis key

  PostgreSQL ← metadata (paste_id, s3_key, expiry, view_count)
  S3          ← content (up to 10MB per paste, 91TB total over 5 years)
  Redis       ← cache (hot pastes, TTL 1 hour)
*/

// KEY DECISIONS EXPLAINED:
/*
1. Why S3 for content, not PostgreSQL?
   → 10MB blobs in a DB column destroy index performance, bloat backups,
     and make row scans slow. S3 is cheaper ($0.023/GB vs ~$0.50/GB for DB).

2. Why cache the full paste (not just metadata)?
   → Content is the expensive S3 fetch. If we cache only metadata,
     we still go to S3 on every read. Cache the full response.

3. Why 410 Gone vs 404 for expired pastes?
   → 404 = "never existed." 410 = "existed but gone." Correct HTTP semantics.

4. Why async view_count increment?
   → Don't slow down the read path for a non-critical counter.
     Use a Redis INCR (atomic) and batch-sync to PostgreSQL every minute.
*/`,
      hints: [
        'Paste content can be up to 10MB. A PostgreSQL TEXT column can hold this but at massive scale (91TB), it becomes expensive and slow. Ask yourself: what is S3 designed for?',
        "The read-to-write ratio (100:1) tells you the cache hit rate needs to be high. If 99% of reads hit Redis, only 1% (6 QPS) hit the database. That's trivially easy to handle.",
        "For the data flow, think about what happens when a paste is created in this order: (1) Where does the content go first? (2) Where does the metadata go? (3) What do you return to the user? Then trace what happens when that paste is read for the first time vs the hundredth time.",
      ],
    },
  ],

  keyTakeaways: [
    "HLD is about choosing components and justifying tradeoffs — not drawing boxes. Every component must earn its place by solving a specific, articulated problem. 'We'll add Kafka' without explaining what producer, consumer, and decoupling problem it solves is an incomplete answer.",
    'The 6-step framework (Requirements → Estimation → API → Database → Diagram → Deep Dive) is not just interview structure — it is the correct order of thinking. Requirements drive estimation; estimation drives component choices; components drive the diagram.',
    "Capacity estimation is not optional math — it is the compass for your architecture. QPS tells you whether you need caching. Storage volume tells you whether you need object storage. Bandwidth tells you whether you need a CDN. Let the numbers drive the design, not the other way around.",
    "Read-to-write ratio is the single most important number in system design. A 100:1 ratio means you optimize reads. A 1:100 ratio means you optimize writes. This single number determines whether you need caching, read replicas, write-optimized databases (Cassandra), or message queues for write buffering.",
    'Database selection follows access patterns, not trends. PostgreSQL for relational data with ACID needs. Cassandra for write-heavy, time-ordered, large-scale append-only data. Redis for caching and real-time counters. Elasticsearch for full-text search. S3 for binary files. Never choose a database by brand preference.',
    "Cache invalidation is where caching strategies succeed or fail. Always design invalidation alongside caching. When data changes, either delete the cache key (cache-aside) or update it. TTL alone as a strategy means users see stale data until expiration — sometimes acceptable, often not.",
    "The fan-out problem is the defining challenge of social media systems. Fan-out on write (pre-compute feeds) scales reads but creates write amplification. Fan-out on read (compute at load time) scales writes but creates read-time query explosion. The hybrid approach — fan-out on write for regular users, fan-out on read for celebrities — is the production answer.",
    "Async processing with message queues separates 'fast' from 'slow' operations without coupling them. Photo upload should return success in 200ms; generating thumbnails can take 2 seconds and run in the background. Kafka/SQS decouples these concerns, enables retry on failure, and smooths traffic spikes.",
    'Sharding is a last resort, not a first move. Add caching first (reduces read load 90–99%). Add read replicas second (linear read scale). Add vertical scaling third. Only shard when you have proven the write path is the bottleneck and simpler solutions are exhausted. Sharding breaks transactions, eliminates JOINs, and adds enormous operational complexity.',
    'HLD and LLD are complementary, not competing. The best system needs correct macro-level architecture (right services, right databases, right communication patterns) AND correct micro-level structure (SOLID, design patterns, clean code within each service). A beautiful HLD with spaghetti code inside each service produces a scalable but unmaintainable system.',
  ],
};
