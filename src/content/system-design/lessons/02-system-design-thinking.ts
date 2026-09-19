import type { Lesson } from '@/types';

export const systemDesignThinkingLesson: Lesson = {
  id: 'system-design-thinking',
  slug: 'system-design-thinking',
  title: 'System Design Thinking',
  description:
    'Learn how experienced engineers think during system design — from clarifying requirements to estimating capacity to identifying bottlenecks, before writing a single line of architecture.',
  category: 'Introduction',
  order: 2,
  difficulty: 'beginner',
  estimatedTime: 35,
  prevLesson: 'introduction-to-system-design',
  nextLesson: 'architecture-fundamentals',

  content: `# System Design Thinking

## The Biggest Mistake Engineers Make

When most engineers hear a system design problem, they immediately start naming technologies.

"Oh, we need a URL shortener? Use Redis for fast lookups, put a load balancer in front, use Cassandra for storage..."

This is wrong. Not because those choices are bad — but because the engineer is proposing solutions before understanding the problem.

Experienced engineers do the opposite. They spend the majority of their time **understanding the problem** before touching architecture. The architecture is the easy part. Understanding the constraints, the scale, the requirements, and the tradeoffs — that is the hard part.

The mental shift required: **"What problem am I solving?" before "What technology should I use?"**

---

## The Engineer's Mindset: Understanding Before Solving

Think of a system design problem like a doctor diagnosing a patient. A good doctor asks many questions before prescribing. A bad doctor prescribes based on one symptom.

Before designing anything, an experienced engineer asks:

**About users:**
- Who are the users? (consumers, businesses, internal teams?)
- How many users are there now?
- How many users do we expect in 1 year? 5 years?
- Where are the users geographically?
- What devices do they use?

**About behavior:**
- What is the ratio of reads to writes?
- What are the peak usage patterns? (traffic spikes at 9am Monday? viral events?)
- What operations are most frequent? Most critical?

**About data:**
- What kind of data does the system handle? (text, images, video, financial?)
- How large is the data per entity?
- How long must data be retained?
- Are there regulatory requirements on the data? (GDPR, HIPAA?)

**About requirements:**
- What does "working" mean? (what is the minimum viable product?)
- What is the acceptable response time?
- What happens if the system goes down? (loses revenue? safety risk?)
- Is consistency more important, or availability?

These questions are not formalities. Each answer fundamentally shapes the architecture.

---

## The Step-by-Step Interview Framework

This is the structured process experienced engineers follow. In an interview, following this process demonstrates seniority even if you don't know every technical detail.

### Step 1: Clarify Requirements (5-7 minutes)

Ask clarifying questions. Write down the answers. Do NOT skip this.

What to clarify:
- Core features (what must work on day one?)
- Scale (users, QPS, storage)
- Constraints (read-heavy vs write-heavy? latency requirements?)
- What is out of scope?

Example: "Before I start designing, I want to make sure I understand the requirements. Is this system meant for consumers or businesses? What's our expected DAU? Are we designing for global users or a specific region?"

### Step 2: Estimate Scale (5 minutes)

Back-of-the-envelope math. Numbers drive decisions.

Calculate:
- Queries per second (QPS) — read and write separately
- Storage requirements (per day, per year)
- Bandwidth requirements (data in/out per second)
- Memory requirements (if caching)

### Step 3: Define APIs (3-5 minutes)

What operations does the system expose? Define the interface before the implementation.

Example:
\`\`\`
POST /urls             → creates a short URL
GET  /{shortCode}      → redirects to original URL
GET  /urls/{id}/stats  → returns click analytics
DELETE /urls/{id}      → deletes a short URL
\`\`\`

Defining APIs forces you to think about what the system actually does, from the outside in.

### Step 4: Design Data Model (5 minutes)

What entities exist? What are their attributes? How do they relate?

The data model shapes:
- Which database type fits (relational, document, graph, time-series)
- How queries will work
- How the system will scale

### Step 5: Design High-Level Architecture (10 minutes)

Now — and only now — sketch the architecture. Start with the simplest version that could work. Identify where it breaks at scale.

Draw boxes for: clients, load balancers, services, caches, databases, message queues.

### Step 6: Deep Dive Into Components (10-15 minutes)

The interviewer will guide this. They want to see depth in specific areas. Common deep dives:
- How does the database handle scale? (sharding, replication, partitioning)
- How does the cache work? (eviction policy, cache invalidation)
- How does the message queue ensure no message is lost?
- How does the system handle failures?

### Step 7: Identify Bottlenecks (5 minutes)

Every system has a weakest link. Where will this system fail first? What would you do about it?

Common bottlenecks:
- Single database handling all reads and writes
- No caching (every request hits the database)
- Single region (high latency for distant users)
- No CDN (static assets served from app server)

### Step 8: Discuss Tradeoffs (throughout)

At every major decision, say: "I'm choosing X because Y. The tradeoff is Z. An alternative would be..."

This is what differentiates a senior engineer's answer. Not the choice, but the articulation of why.

---

## Capacity Estimation: The Math Every Engineer Needs

Numbers are not optional in system design. They determine the architecture.

### Key Units to Know

\`\`\`
Time:
  1 day = 86,400 seconds (memorize this)
  1 month ≈ 2.5 million seconds
  1 year ≈ 31.5 million seconds

Data:
  1 KB = 10^3 bytes (roughly)
  1 MB = 10^6 bytes
  1 GB = 10^9 bytes
  1 TB = 10^12 bytes
  1 PB = 10^15 bytes

Traffic shorthand:
  1K requests/sec = 1,000 req/s
  1M requests/sec = 1,000,000 req/s
\`\`\`

### Estimation Formula

\`\`\`
QPS = (Daily Active Users × Actions per User per Day) / 86,400

Storage per Day = Daily Events × Size per Event

Storage per Year = Storage per Day × 365

Bandwidth = QPS × Response Size
\`\`\`

---

## Walk-Through Example 1: "User Uploads a Photo"

**Problem statement:** Design the photo upload feature for a social media app.

### Step 1: Clarify Requirements

Questions and assumed answers:
- Max photo size? → 20MB original, system compresses to multiple resolutions
- Supported formats? → JPG, PNG, WebP
- Can photos be deleted? → Yes, by the owner
- Private vs public photos? → Both (user chooses)
- Scale? → 10M DAU, 5M photos uploaded per day

### Step 2: Capacity Estimation

\`\`\`
Uploads:
  5,000,000 photos/day ÷ 86,400 seconds = ~58 uploads/second (peak ~3x = 174/sec)

Storage:
  Average compressed size: 2MB
  5,000,000 × 2MB = 10TB/day
  10TB × 365 = 3.65 PB/year
  (must use object storage: S3, GCS, Azure Blob)

Reads (views):
  Assume 200M photo views/day (40:1 read-to-write ratio)
  200,000,000 ÷ 86,400 = ~2,315 reads/second (peak: ~7,000/sec)
  (must use CDN to serve photos — app server can't handle this)

Bandwidth:
  2,315 reads/sec × 500KB (thumbnail size) = 1.1 GB/s outbound
  (CDN handles this — origin server only serves cache misses)
\`\`\`

### Step 3: Define APIs

\`\`\`
POST /photos
  Request: multipart/form-data (file + metadata)
  Response: { photoId, url, thumbnailUrl }

GET /photos/{photoId}
  Response: { photoId, url, thumbnailUrl, caption, authorId, createdAt }

DELETE /photos/{photoId}
  Auth: only owner can delete
  Response: 204 No Content
\`\`\`

### Step 4: Data Model

\`\`\`
Table: photos
  photo_id      UUID PRIMARY KEY
  author_id     UUID (references users)
  caption       TEXT (max 2200 chars)
  s3_key        VARCHAR (path in object storage)
  status        ENUM (processing, published, deleted)
  is_private    BOOLEAN DEFAULT false
  created_at    TIMESTAMP
  file_size     INTEGER (bytes)

Table: photo_resolutions
  photo_id      UUID (references photos)
  resolution    ENUM (thumbnail_150, medium_640, large_1080, original)
  s3_key        VARCHAR
  width         INTEGER
  height        INTEGER
\`\`\`

### Step 5: High-Level Architecture

\`\`\`
UPLOAD FLOW:
Client → API Gateway → Upload Service → Object Storage (S3)
                                     → Message Queue (Kafka)
                                              ↓
                                    Image Processing Service
                                    (generates thumbnails, strips EXIF)
                                              ↓
                                    Updates DB (photo status: published)
                                    Purges/warms CDN cache

READ FLOW:
Client → CDN → (cache hit: serve photo directly)
             → (cache miss: fetch from S3 → cache → serve)
\`\`\`

### Step 6: Key Design Decisions and Why

**Why object storage (S3) instead of database for photos?**
Photos are binary blobs. Databases store structured data. Storing 10TB/day in a database would be catastrophically expensive and slow. Object storage is designed for this: cheap, durable (11 nines), globally replicable.

**Why a message queue between upload and processing?**
Decoupling. If the image processing service is slow or crashes, the upload still succeeds. The photo is in S3. Processing happens async. The user gets immediate feedback ("photo uploaded!") without waiting for thumbnail generation.

**Why a CDN for reads?**
2,315 reads/second of 500KB thumbnails = 1.1GB/s. No single server can handle this. A CDN (CloudFront, Fastly) caches photos at edge locations globally, reducing both latency (photos served from nearby servers) and load on origin.

---

## Walk-Through Example 2: "User Sends a Message"

**Problem statement:** Design the messaging feature (like WhatsApp direct messages).

### Step 1: Clarify Requirements

- 1:1 messages only (no group chat for now)
- Messages must be delivered in order
- Delivery receipts (sent, delivered, read)
- Offline users must receive messages when they come online
- Scale: 100M DAU, 50 messages sent per user per day

### Step 2: Capacity Estimation

\`\`\`
Messages per day: 100M users × 50 messages = 5 billion messages/day
QPS: 5,000,000,000 ÷ 86,400 = ~57,870 messages/second
Peak: ~175,000 messages/second

Storage per message:
  sender_id: 16 bytes (UUID)
  receiver_id: 16 bytes
  content: avg 100 bytes
  timestamp: 8 bytes
  status: 1 byte
  Total: ~150 bytes

Storage per day: 5B × 150 bytes = 750 GB/day
Storage per year: 750GB × 365 = ~274 TB/year
\`\`\`

### Step 3: Key Architectural Problem — Real-Time Delivery

HTTP is request-response. The client asks, the server responds. But messaging is **push**: the server must push a message to the recipient without them asking.

Solutions:

**Option A: Polling** — Client asks server "any new messages?" every second.
- Pros: Simple to implement
- Cons: Massive waste (99.9% of polls return "nothing new"), high latency (up to 1 second delay)
- Verdict: Bad at scale. 100M users × 1 poll/second = 100M req/sec just for polling

**Option B: Long Polling** — Client asks server, server holds the connection open until a message arrives (up to 30 seconds), then responds.
- Pros: Fewer wasted requests, lower latency than polling
- Cons: Still HTTP connections tied up waiting, hard to scale, message can be lost if connection drops at wrong moment

**Option C: WebSockets** — Persistent bidirectional TCP connection between client and server.
- Pros: True real-time (sub-millisecond), efficient (connection stays open), bidirectional
- Cons: Stateful connections (harder to load-balance), connection limit per server
- Verdict: **Correct choice for real-time messaging**

### Step 4: Data Model

\`\`\`
Table: messages
  message_id    UUID PRIMARY KEY
  sender_id     UUID
  receiver_id   UUID
  content       TEXT
  sent_at       TIMESTAMP
  delivered_at  TIMESTAMP (null until delivered)
  read_at       TIMESTAMP (null until read)

Table: user_connections (in-memory, Redis)
  user_id       → server_id (which WebSocket server is this user connected to?)
\`\`\`

### Step 5: Message Flow

\`\`\`
Alice sends message to Bob:
  1. Alice's client sends message via WebSocket to her connected Chat Server
  2. Chat Server saves message to DB (status: sent)
  3. Chat Server checks Redis: "Which server is Bob connected to?"
     a. If Bob is online: forward message to Bob's Chat Server via internal channel
        Bob's server delivers via WebSocket → update status: delivered
     b. If Bob is offline: store in "pending messages" queue
        When Bob connects, deliver pending messages → update status: delivered
  4. When Bob opens the message → update status: read → notify Alice's client
\`\`\`

---

## Walk-Through Example 3: "User Creates an Order"

**Problem statement:** Design the order creation flow for an e-commerce platform.

### Step 1: Clarify Requirements

- Users can add items to a cart and place an order
- Payment must be processed before the order is confirmed
- Inventory must be checked (can't order out-of-stock items)
- Order confirmation email must be sent
- Scale: 10M DAU, peak 100,000 orders per minute during flash sales

### Step 2: The Core Challenge — Consistency

Order creation involves multiple steps that must ALL succeed or ALL fail:
1. Check inventory (item is in stock)
2. Reserve inventory (decrease available count)
3. Charge payment (call payment provider)
4. Create order record
5. Send confirmation email

If payment succeeds but inventory reservation fails → customer is charged but has no order. Catastrophic.
If order is created but payment fails → customer has an order but hasn't paid. Also catastrophic.

This requires **distributed transactions** or a careful **saga pattern**.

### Step 3: Saga Pattern for Order Creation

A saga breaks the transaction into individual steps, each with a compensating action if it fails:

\`\`\`
Step 1: Reserve Inventory
  Success → proceed to Step 2
  Failure → return "item out of stock" to user (no cleanup needed)

Step 2: Process Payment
  Success → proceed to Step 3
  Failure → COMPENSATE Step 1: release inventory reservation → return "payment failed"

Step 3: Create Order Record
  Success → proceed to Step 4
  Failure → COMPENSATE Step 2: refund payment → COMPENSATE Step 1: release reservation

Step 4: Send Confirmation Email
  Success → done
  Failure → retry (email failure should not fail the order — it's not critical)
  (email can be retried independently via a queue)
\`\`\`

### Step 4: Flash Sale Problem — 100,000 orders per minute

\`\`\`
100,000 orders/minute ÷ 60 = ~1,667 orders/second

Each order requires:
  - DB read (check inventory)
  - DB write (reserve inventory)
  - External API call (payment provider)
  - DB write (create order)
  - Message queue write (send email async)

Bottleneck: Inventory table. Every order reads and writes the same rows.
Race condition: 1000 users simultaneously read "50 items in stock" and all try to order.

Solution: Optimistic Locking or Redis-based inventory reservation
  - Load available inventory into Redis at flash sale start
  - Use Redis atomic DECR operation to reserve (Redis is single-threaded, no race conditions)
  - Only on successful reservation do we write to the database
  - Redis DECR is O(1) and handles >100,000 operations/second on a single instance
\`\`\`
`,

  codeExamples: [
    {
      title: 'Capacity Estimation: Twitter-Scale Feed System',
      code: `# Back-of-the-envelope estimation for Twitter-like feed

## Given assumptions:
Monthly Active Users (MAU): 300 million
Daily Active Users (DAU): 100 million (1/3 of MAU is a common ratio)
Average tweets per active user per day: 5
Average followers per user: 200
Average timeline reads per day: 20 (users check their feed 20 times/day)

## Write QPS (tweet creation):
Tweets per day = 100M DAU × 5 tweets = 500 million tweets/day
Write QPS = 500,000,000 ÷ 86,400 ≈ 5,787 tweets/second
Peak write QPS (assume 3x average) ≈ 17,000 tweets/second

## Read QPS (timeline reads):
Timeline reads/day = 100M DAU × 20 reads = 2 billion reads/day
Read QPS = 2,000,000,000 ÷ 86,400 ≈ 23,148 reads/second
Peak read QPS (assume 3x average) ≈ 70,000 reads/second

Read:Write ratio = 23,148 : 5,787 ≈ 4:1
→ The system is moderately read-heavy. Caching feeds is important.

## Storage estimation (tweets):
Average tweet size:
  tweet_id:     8 bytes
  user_id:      8 bytes
  content:      280 chars × 2 bytes (UTF-16) = 560 bytes
  timestamp:    8 bytes
  metadata:     ~100 bytes (retweet_count, like_count, etc.)
  Total:        ~700 bytes per tweet

Storage per day = 500M × 700 bytes = 350 GB/day
Storage per year = 350GB × 365 ≈ 128 TB/year

## Media storage (photos/videos):
Assume 20% of tweets have media
100M × 5 × 20% = 100M media items/day
Average media size (compressed photo): 500KB
Media storage/day = 100M × 500KB = 50 TB/day
Media storage/year = 50TB × 365 ≈ 18.25 PB/year
→ MUST use object storage (S3 or equivalent)

## Fan-out on write estimation (the hard problem):
When a user with 1M followers tweets, we must update 1M feed caches
1 celebrity tweet = 1M cache update operations
At 5 tweets/day for a celebrity: 5M operations/day just from one user
→ For celebrities (>1M followers): use fan-out on READ, not write
→ For normal users (<10K followers): use fan-out on WRITE (pre-compute feeds)`,
      explanation:
        'This is how engineers actually think about scale. Every number leads to an architectural decision. The read:write ratio tells us to add caching. The 18PB/year of media tells us SQL is wrong for media storage. The fan-out problem shows why Twitter cannot treat all users the same — celebrities require a different code path than regular users.',
    },
    {
      title: 'Defining APIs: The Contract Before the Implementation',
      code: `# API Design for a Ride-Sharing App (like Uber)

# Why define APIs first?
# APIs are the contract between the client and the server.
# Defining them forces you to think about:
# - What data does the client need?
# - What operations must the system support?
# - What are the inputs and outputs?

## Core APIs:

# 1. Request a ride
POST /rides
Request Body:
{
  "pickup_location": { "lat": 37.7749, "lng": -122.4194 },
  "dropoff_location": { "lat": 37.3861, "lng": -122.0839 },
  "ride_type": "economy" | "premium" | "xl",
  "payment_method_id": "pm_abc123"
}
Response (201 Created):
{
  "ride_id": "ride_xyz789",
  "status": "searching_driver",
  "estimated_pickup_minutes": 4,
  "estimated_fare": { "min": 18.50, "max": 24.00, "currency": "USD" }
}

# 2. Get ride status (called repeatedly by client)
GET /rides/{ride_id}
Response:
{
  "ride_id": "ride_xyz789",
  "status": "driver_assigned" | "driver_arriving" | "in_progress" | "completed",
  "driver": {
    "name": "Carlos M.",
    "rating": 4.92,
    "vehicle": "2022 Toyota Camry",
    "plate": "7ABC123",
    "current_location": { "lat": 37.780, "lng": -122.415 }
  },
  "eta_seconds": 180
}

# 3. Driver location update (called by driver app every 3 seconds)
PUT /drivers/{driver_id}/location
Request Body:
{
  "lat": 37.7805,
  "lng": -122.4148,
  "heading": 245,
  "speed_kmh": 35
}
Response: 200 OK

# 4. Cancel a ride
DELETE /rides/{ride_id}
Response:
{
  "cancellation_fee": 2.50,
  "reason": "driver_already_dispatched"
}

# Notice what the APIs reveal about the system:
# - Driver location is updated VERY frequently (every 3 seconds) → need efficient geospatial storage
# - Ride status polling will be frequent → consider WebSockets instead
# - Matching (finding driver for a ride) is not in an API → it happens server-side async
# - Fare is estimated at request time → finalized at completion (pricing is complex)`,
      explanation:
        'API design reveals system complexity before you write any architecture. Notice how the driver location update API (called every 3 seconds per driver) immediately tells us we need efficient time-series/geospatial storage. The ride status API being polled by clients tells us to consider WebSockets. APIs are not just syntax — they expose the fundamental operations the system must support.',
    },
    {
      title: 'QPS Estimation with Traffic Patterns',
      code: `# Real-world QPS estimation accounts for traffic patterns

# Mistake: assuming uniform traffic
# Reality: traffic is bursty and follows daily patterns

## Example: E-commerce platform

DAU: 5 million users
Average page views per user per day: 20
Average API calls per page view: 5

## Naive calculation (WRONG):
Total API calls/day = 5M × 20 × 5 = 500 million
Average QPS = 500,000,000 ÷ 86,400 ≈ 5,787 req/sec

## Reality: Traffic is NOT uniform

Traffic distribution (percentage of daily traffic by hour):
  00:00-06:00  →  2% of daily traffic (very low, overnight)
  06:00-09:00  →  8% of daily traffic (morning ramp-up)
  09:00-12:00  → 20% of daily traffic (morning peak)
  12:00-14:00  → 18% of daily traffic (lunch browsing)
  14:00-18:00  → 22% of daily traffic (afternoon peak)
  18:00-22:00  → 25% of daily traffic (evening peak — highest)
  22:00-00:00  →  5% of daily traffic (late night)

## Peak hour calculation:
Peak hour = 18:00-22:00 = 25% of daily traffic over 4 hours
= 0.25 × 500M requests ÷ (4 × 3600 seconds)
= 125,000,000 ÷ 14,400
≈ 8,680 req/sec during peak

## Flash sale spike:
During a 1-hour flash sale, traffic can be 10-20x normal
Peak flash sale QPS = 5,787 × 15 ≈ 86,805 req/sec

## Design implications:
1. Auto-scaling must trigger BEFORE the evening peak (pre-scale at 17:00)
2. Cache hit rate must be high enough that 86K req/sec doesn't hit the DB
3. Database connection pool must handle bursts: size it for peak × 1.5 safety margin
4. Rate limiting protects against abnormal spikes (bot attacks during flash sales)

## Rule of thumb for planning:
  Design for peak × 2 (safety buffer for unexpected spikes)
  For our system: design for ~17,000 req/sec sustained capacity
  Flash sale: add auto-scaling or pre-provisioned burst capacity`,
      output:
        'Average QPS: ~5,787 | Peak evening QPS: ~8,680 | Flash sale QPS: ~86,805 | Design capacity target: ~17,000 req/sec',
      explanation:
        'Traffic is never uniform. Engineers who design for average load build systems that fail at peak. Always model peak traffic, apply a safety multiplier, and understand the difference between sustained peak and burst peak. Flash sales, viral content, and news events can cause 10-50x normal traffic instantaneously.',
    },
  ],

  commonMistakes: [
    'Proposing technology before understanding requirements. Saying "use Kafka" before knowing if the system even needs async processing shows you are pattern-matching, not thinking.',
    'Skipping capacity estimation. Without numbers, you cannot justify your architectural choices. "We might need caching" is weak. "We have 70,000 reads/second — caching is essential" is engineering.',
    'Designing for the happy path only. Real systems must handle: service unavailability, network timeouts, malformed requests, and unexpected load spikes.',
    'Making the data model an afterthought. The data model drives the database choice, query patterns, and scaling strategy. Design it before the architecture, not after.',
    'Ignoring the read:write ratio. A system that is 99% reads (social media feeds) and a system that is 99% writes (logging) have completely different optimal architectures.',
    'Not defining APIs before components. APIs are the contract. Without a defined contract, you cannot reason about what each component needs to do.',
    'Forgetting to identify bottlenecks. Every system has a critical path and a slowest link. Identifying it (and having a plan) is what separates a good design from a great one.',
    'Treating all users as equal in fan-out scenarios. A tweet from a user with 1M followers requires fundamentally different handling than a tweet from a user with 10 followers.',
  ],

  interviewQuestions: [
    {
      question: 'Walk me through how you would approach a system design problem in an interview.',
      answer:
        'I follow a structured process: First, I spend 5-7 minutes clarifying requirements — I ask about the core features, target scale (DAU, QPS, storage), read/write ratio, availability requirements, and what is out of scope. I never start designing before I understand these. Second, I do capacity estimation — I calculate QPS, storage, and bandwidth needs, because these numbers drive architectural decisions. Third, I define the data model — what entities exist, their attributes, and relationships. This guides database choice. Fourth, I define the APIs — the external interface that the system must fulfill. Fifth, I sketch a high-level architecture, starting simple and adding complexity only where scale requires it. Sixth, I do a targeted deep dive on the most complex or critical component. Throughout, I continuously articulate tradeoffs: why I chose X over Y, what I give up, when I would choose differently.',
      difficulty: 'beginner',
      tip: 'Interviewers are not just evaluating your knowledge — they are evaluating your process. A structured process with clear reasoning is more impressive than a technically deep answer that skips requirements.',
    },
    {
      question: 'How do you estimate the number of servers needed for a system?',
      answer: `Start with peak QPS and the capacity of a single server. A single modern application server (8-core, 16GB RAM) can typically handle: 1,000-5,000 simple API requests/second (database-bound), 10,000-50,000 requests/second for compute-light operations (with connection pooling), or 100,000+ requests/second for static content serving. Example: If peak QPS is 50,000 and each server handles 5,000 req/sec, you need 10 servers. Add 50% buffer for safety: 15 servers. Add redundancy (N+1 or N+2): 17 servers. In practice, you also account for: memory requirements per request, whether requests are IO-bound (database) or CPU-bound (computation), connection pool limits, and auto-scaling headroom. The exact number matters less than the reasoning process.`,
      difficulty: 'intermediate',
      followUp: ['What is the difference between IO-bound and CPU-bound workloads and how does it affect server sizing?'],
    },
    {
      question: 'What is fan-out and why is it a challenge in social media systems?',
      answer:
        'Fan-out is the process of distributing one write operation to many recipients. In a social media context: when a user posts a tweet, that tweet must appear in the feeds of all their followers. If you have 1,000 followers, posting creates 1,000 write operations to update each follower\'s feed. This is called fan-out on write. The challenge is celebrity users. If a celebrity has 10 million followers, one tweet creates 10 million write operations simultaneously — this is a massive write amplification. Solutions: (1) Fan-out on read: do not precompute feeds. When a user opens their feed, query the database for recent posts from all accounts they follow. Scales reads poorly but eliminates write amplification. (2) Fan-out on write: precompute feeds in a cache (Redis). Fast reads, but celebrities cause enormous write spikes. (3) Hybrid: use fan-out on write for normal users (<10K followers), fan-out on read for celebrities. This is what Twitter and Instagram actually do.',
      difficulty: 'intermediate',
      followUp: ['How would you determine the threshold between "normal user" and "celebrity" treatment?'],
      tip: 'The hybrid approach is the right answer, but what makes the answer excellent is explaining WHY each approach fails at the extremes, which forces the hybrid.',
    },
    {
      question: 'How would you design a system to handle a flash sale with 100x normal traffic?',
      answer:
        'A flash sale is a traffic spike problem with a data consistency problem layered on top. Traffic side: Pre-scale infrastructure before the sale (auto-scaling takes minutes, the spike is immediate). Use a CDN and aggressive caching for the product page itself. Rate limit and queue excess requests rather than dropping them. Use a waiting room pattern: show a "you are in queue" page and admit users gradually. Data side: the core problem is inventory. 1 million users simultaneously trying to buy 100 items. Solution: move inventory reservation to Redis. Redis DECR is atomic (no race conditions) and handles >100,000 operations/second. Only users who successfully DECR in Redis proceed to payment. This prevents overselling. Use a message queue to process successful reservations asynchronously — database writes are decoupled from the hot path. Payment processing: queue payments; the user gets "order confirmed" immediately and payment processes in the background.',
      difficulty: 'advanced',
      followUp: ['What happens if Redis crashes during the flash sale? How do you recover?'],
    },
    {
      question: 'Why should you define the data model before choosing a database technology?',
      answer:
        'The data model reveals the access patterns, and access patterns determine the right database type. If your data model has many complex relationships requiring JOINs across multiple entities, you need a relational database. If your data model has flexible, heterogeneous schemas that change frequently, a document database is appropriate. If you need to traverse many-to-many relationships efficiently (social graphs, recommendation engines), a graph database fits. If you are storing time-series data (metrics, logs, IoT sensor readings), a time-series database is optimal. Making the database choice first and then force-fitting your data model to it leads to painful workarounds. For example: storing a graph data model in a relational database means complex multi-join queries for graph traversal. Storing a highly relational model in MongoDB means either duplicating data (denormalization) or multiple round-trips. The data model is the foundation — the database is the tool that fits the foundation.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'thinking-exercise-1',
      title: 'Capacity Estimation: Design a Notification System',
      description: `You are designing the notification system for an e-commerce platform (similar to Amazon).

Given:
- 50 million registered users
- 10 million Daily Active Users
- Types of notifications: order confirmed, order shipped, order delivered, flash sale alert, promotional email
- Average notifications per user per day: 3
- Notification channels: push notification (mobile), email, SMS
- 60% of notifications are push, 35% email, 5% SMS

Calculate:
1. Total notifications sent per day
2. Notifications per second (average and peak — assume 3x for peak)
3. Storage requirements for notification history (retain 90 days)
   - Assume each notification record is 500 bytes
4. What is the biggest bottleneck in sending 5M SMS notifications per day?
5. Why should notification sending be asynchronous (via a message queue)?

Show your math clearly.`,
      starterCode: `# Notification System Capacity Estimation

## Step 1: Total notifications per day
Total notifications/day = DAU × avg notifications per user
= ___M × ___ = ___M notifications/day

## Step 2: QPS calculation
Average QPS = ___M notifications ÷ 86,400 seconds = ___ notifications/sec
Peak QPS (3x) = ___ × 3 = ___ notifications/sec

## Step 3: Breakdown by channel
Push notifications (60%): ___ notifications/day = ___ push/sec (avg)
Email (35%):              ___ notifications/day = ___ emails/sec (avg)
SMS (5%):                 ___ notifications/day = ___ SMS/sec (avg)

## Step 4: Storage for 90-day history
Notifications per day:     ___ million
Storage per day:           ___M × 500 bytes = ___ GB/day
Storage for 90 days:       ___ GB/day × 90 = ___ GB total

## Step 5: SMS bottleneck analysis
SMS per day: ___M
Typical SMS gateway rate limit: ~100 SMS/second per account
Required throughput: ___ SMS/sec
Number of SMS gateway accounts/connections needed: ___

## Step 6: Why async via message queue?
Reason 1:
Reason 2:
Reason 3:`,
      solution: `# Notification System Capacity Estimation

## Step 1: Total notifications per day
Total notifications/day = 10M DAU × 3 = 30 million notifications/day

## Step 2: QPS calculation
Average QPS = 30,000,000 ÷ 86,400 = ~347 notifications/sec
Peak QPS (3x) = 347 × 3 = ~1,042 notifications/sec

## Step 3: Breakdown by channel
Push notifications (60%): 18M notifications/day = ~208 push/sec (avg)
Email (35%):              10.5M notifications/day = ~121 emails/sec (avg)
SMS (5%):                 1.5M notifications/day = ~17 SMS/sec (avg)

## Step 4: Storage for 90-day history
Notifications per day: 30 million
Storage per day: 30,000,000 × 500 bytes = 15,000,000,000 bytes = 15 GB/day
Storage for 90 days: 15 GB/day × 90 = 1,350 GB = ~1.35 TB total

This is manageable — store in a relational DB or time-series DB.
Archive to cheaper cold storage (S3 Glacier) after 90 days.

## Step 5: SMS bottleneck analysis
SMS per day: 1.5 million
Average SMS/sec: ~17
Typical Twilio/AWS SNS SMS rate limit: ~100 SMS/second per account
So 17 SMS/sec is within one account's limit on average.
BUT: peak is 3x = 51 SMS/sec, still within limit.
HOWEVER: flash sales blast 5M SMS at once in minutes.
5,000,000 ÷ (10 min × 60 sec) = ~8,333 SMS/sec during a flash sale blast
Need to either: (a) spread over longer time window, or (b) use multiple SMS gateway accounts

## Step 6: Why async via message queue?
Reason 1: DECOUPLING — the order service should not wait for the email to send before
  responding to the user. PUT the notification event on a queue and return immediately.
  Email/push/SMS delivery is not user-critical path.

Reason 2: RATE LIMITING — SMS gateways have rate limits. A queue allows you to consume
  notifications at a controlled rate (e.g., 100 SMS/sec) without overwhelming the gateway.

Reason 3: RETRY ON FAILURE — if the push notification service is down, messages stay in
  the queue and are retried automatically when it recovers. Without a queue, failed
  notifications are simply lost.`,
      hints: [
        '1 GB = 1,000,000,000 bytes (or use 10^9 for estimation)',
        'Think about what happens during a flash sale — the notification volume is not uniform across the day',
        'SMS is the most expensive channel ($0.0075/message on Twilio) — at 1.5M SMS/day, what is the monthly cost?',
        'The key insight for async: a notification is not part of the user-facing critical path. The order is already created. The email/push can happen later.',
      ],
    },
    {
      id: 'thinking-exercise-2',
      title: 'Walk Through a System Design: Design a Rate Limiter',
      description: `A rate limiter prevents any single client from making too many requests in a time window. For example: "maximum 100 API requests per minute per user."

Walk through the full system design thinking process:

1. Clarify requirements: Write 5 questions you would ask before designing, and provide reasonable answers.

2. Define what "rate limiting" means precisely with an example.

3. Compare these algorithms for implementing rate limiting:
   - Fixed Window Counter
   - Sliding Window Log
   - Token Bucket
   For each: explain how it works, one advantage, one disadvantage.

4. Where should rate limiting happen in a typical system architecture? (client-side? load balancer? API gateway? application server?)

5. In a distributed system with 10 API servers, what is the problem with storing rate limit counters in each server's local memory? How would you solve it?`,
      starterCode: `# Rate Limiter System Design

## 1. Clarifying Questions
Q1: What are we rate limiting? (per user? per IP? per API key?)
A1:

Q2:
A2:

Q3:
A3:

Q4:
A4:

Q5:
A5:

## 2. Precise Definition with Example
A rate limiter is...
Example: User "alice" calls GET /search...

## 3. Algorithm Comparison

### Fixed Window Counter
How it works:
Advantage:
Disadvantage:

### Sliding Window Log
How it works:
Advantage:
Disadvantage:

### Token Bucket
How it works:
Advantage:
Disadvantage:

## 4. Where should rate limiting happen?
Location:
Why not client-side?
Why not application server?

## 5. Distributed Rate Limiting Problem
Problem with local memory:
Solution:`,
      solution: `# Rate Limiter System Design

## 1. Clarifying Questions
Q1: What are we rate limiting? Per user, per IP, or per API key?
A1: Per authenticated user (user_id). Unauthenticated requests rate-limited by IP.

Q2: What are the rate limit thresholds?
A2: 100 requests per minute for standard users, 1000 for premium users.

Q3: What should happen when a user exceeds the limit?
A3: Return HTTP 429 Too Many Requests with a Retry-After header.

Q4: Should rate limits be the same for all endpoints?
A4: No. Read endpoints: 100/min. Write endpoints: 20/min. Auth endpoints: 5/min (critical).

Q5: What is our scale? How many users, and how many requests per second?
A5: 1M DAU, peak 50,000 req/sec. Rate limiter must add < 1ms latency.

## 2. Precise Definition with Example
A rate limiter is a mechanism that controls how frequently a client can perform an action
within a time window, rejecting requests that exceed the defined threshold.

Example: User "alice" has a limit of 5 requests per minute to POST /comments.
  12:00:01 → request 1 → allowed (1/5)
  12:00:15 → request 2 → allowed (2/5)
  12:00:30 → request 3 → allowed (3/5)
  12:00:45 → request 4 → allowed (4/5)
  12:00:55 → request 5 → allowed (5/5)
  12:00:59 → request 6 → REJECTED (429 Too Many Requests)
  12:01:02 → request 7 → allowed (1/5, new window started)

## 3. Algorithm Comparison

### Fixed Window Counter
How it works: Divide time into fixed windows (e.g., 12:00-12:01, 12:01-12:02).
  Count requests in each window. Reset counter at the start of each window.
  Implementation: Redis key "user:alice:ratelimit:202401011200" with INCR and EXPIRE.
Advantage: Simple to implement. O(1) time and space per check.
Disadvantage: Boundary problem — a user can make 100 requests at 12:00:59 and
  100 requests at 12:01:01, effectively getting 200 requests in 2 seconds.

### Sliding Window Log
How it works: Store timestamp of every request in a sorted set (Redis ZSet).
  On each new request: remove timestamps older than (now - window_size),
  count remaining entries. If count < limit, allow. Add current timestamp.
Advantage: Perfectly accurate — no boundary problem.
Disadvantage: High memory usage — must store every timestamp for every user.
  At 100 req/min × 1M users = 100M entries in memory.

### Token Bucket
How it works: Each user has a "bucket" with a max capacity (e.g., 100 tokens).
  Tokens are added at a fixed rate (e.g., 100/minute = ~1.67/second).
  Each request consumes 1 token. If bucket is empty, request is rejected.
Advantage: Allows bursting (up to bucket size) — natural for real usage patterns.
  Very efficient storage (just store: token_count, last_refill_timestamp).
Disadvantage: Slightly more complex calculation. Burst behavior may not be desired.

## 4. Where should rate limiting happen?
Location: API Gateway (in front of all application servers)

Why not client-side? Clients are untrusted. Any client-side rate limit can be bypassed
  by a malicious actor modifying the client code.

Why not application server? If rate limiting is in each app server, a user can bypass it
  by sending requests to different servers. Also: rate limit counters must be shared across
  servers (see question 5).

API Gateway: Single choke point. All traffic passes through it. Can check rate limits
  before the request even reaches application servers (saves compute).

## 5. Distributed Rate Limiting Problem
Problem with local memory: With 10 app servers, each server tracks its own counter.
  User "alice" can make 100 requests to server 1 AND 100 requests to server 2,
  effectively bypassing the 100/minute limit entirely.
  Local memory counters cannot see traffic going to other servers.

Solution: Centralized rate limit storage in Redis.
  Redis is single-threaded (atomic operations), sub-millisecond latency, and
  accessible from all app servers.

  Implementation:
    key = "ratelimit:{user_id}:{window_start_timestamp}"
    value = INCR (atomic increment)
    EXPIRE key 60 (auto-delete after 1 minute)

  Every app server checks the SAME Redis key, so counters are globally consistent.

  Concern: Redis becomes a single point of failure for rate limiting.
  Solution: Use Redis Sentinel or Redis Cluster for HA.
  Fallback: If Redis is unreachable, fail open (allow requests) rather than
  blocking all traffic — availability > rate limiting in most cases.`,
      hints: [
        'For the distributed problem: think about what happens when two requests arrive at the same moment on different servers — who counts it?',
        'Redis INCR is an atomic operation — it increments and returns the new value in a single operation, with no race conditions',
        'The Token Bucket algorithm is used by AWS API Gateway, Stripe, and most major API providers — understand why burst is desirable',
        'HTTP 429 must include a Retry-After header so clients know when to try again — design the response, not just the rejection',
      ],
    },
  ],

  keyTakeaways: [
    'Experienced engineers understand the problem deeply before proposing solutions. Technology choices are outputs of clear thinking, not inputs.',
    'The 8-step interview framework (clarify → estimate → APIs → data model → architecture → deep dive → bottlenecks → tradeoffs) is a thinking process, not a script.',
    'Capacity estimation is not optional. Numbers like QPS, storage, and bandwidth requirements directly determine which architectural patterns are necessary.',
    'Traffic is never uniform. Always calculate peak QPS (typically 3x average), not just average, and design for peak with a safety margin.',
    'Fan-out problems (distributing one write to many recipients) require special handling for power users — a hybrid read/write fan-out strategy is the industry standard.',
    'The data model must be designed before choosing a database. Access patterns revealed by the data model determine the appropriate database type.',
    'APIs should be defined before internal architecture. The external interface tells you what the system must do; the internal architecture is how it does it.',
    'Every system has a bottleneck. Identifying it proactively and having a solution demonstrates the kind of thinking that separates senior from junior engineers.',
  ],
};
