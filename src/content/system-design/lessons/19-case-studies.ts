import type { Lesson } from '@/types';

export const caseStudiesLesson: Lesson = {
  id: 'case-studies',
  slug: 'case-studies',
  title: 'Real Product Case Studies',
  description:
    'Walk through complete system designs of real products — URL shorteners, WhatsApp, Instagram, Netflix, Uber, and e-commerce platforms — covering requirements, capacity estimation, database choices, caching strategy, and key architectural decisions.',
  category: 'Case Studies',
  order: 19,
  difficulty: 'expert',
  estimatedTime: 90,
  prevLesson: 'design-patterns',
  nextLesson: 'interview-preparation',

  content: `# Real Product Case Studies

## Why Case Studies Matter

You can understand every individual concept — consistent hashing, CAP theorem, message queues, CDN, sharding — and still struggle when you sit in an interview and hear: "Design WhatsApp." That gap exists because real systems are not collections of isolated concepts. They are specific combinations of decisions made in response to specific constraints.

Case studies bridge that gap. They show you how experienced engineers think through a problem from scratch: starting with requirements, reasoning about scale, choosing databases, designing components, and making tradeoffs that are defensible.

The goal is not to memorize these designs. The goal is to internalize the **reasoning process** so that when you encounter a new system, you already know how to think about it.

---

## How to Read a Case Study

For every system, ask these questions before reading the solution:

1. **Is this read-heavy or write-heavy?** This determines your caching strategy and database choice.
2. **What is the scale?** (DAU, QPS, storage) — this determines whether you need sharding.
3. **What is the latency requirement?** — real-time vs. batch-acceptable.
4. **What consistency is required?** — strong (banking) vs. eventual (social feed).
5. **What is the most technically challenging part?** — focus the design there.

---

## Case Study 1: URL Shortener (bit.ly)

### Functional Requirements
- User pastes a long URL and gets a short URL (e.g., bit.ly/abc123)
- User visits the short URL and is redirected to the long URL
- Optional: custom aliases, expiration dates, analytics (click count, geography)

### Non-Functional Requirements
- High availability (downtime means broken links everywhere)
- Low latency redirects (< 10ms is ideal)
- 100:1 read-to-write ratio (URL shorteners are overwhelmingly read-heavy)

### Capacity Estimation

**Writes (URL creation):**
- 100 million new URLs per day
- 100M / 86400 ≈ 1,160 writes/second

**Reads (redirects):**
- 100:1 read ratio → 10 billion redirects/day
- 10B / 86400 ≈ 116,000 reads/second

**Storage:**
- Each URL record: ~500 bytes (long URL + short code + metadata)
- 100M URLs/day × 365 days × 5 years = 182.5 billion URLs
- 182.5B × 500 bytes ≈ **91 TB** over 5 years

### The Core Challenge: Generating Unique Short Codes

You need a unique 6-character code for each URL. With Base62 (a-z, A-Z, 0-9), 6 characters gives you 62^6 = 56.8 billion unique codes — enough for decades.

**Approach 1: MD5 Hash of long URL**
- MD5 produces a 128-bit hash → take first 6 characters
- Problem: two different long URLs can produce the same 6-character prefix (collision)
- Problem: same URL always produces same hash — bad for user-specific short links

**Approach 2: Pre-generated unique codes (recommended)**
- A dedicated "ticket server" pre-generates billions of unique codes
- Store them in a pool table in the database
- When a user creates a short link, pop a code from the pool
- No collision possible. Works at any scale.

**Approach 3: Auto-increment ID + Base62 encoding**
- Use a database auto-increment ID (1, 2, 3, ...)
- Convert to Base62: ID 12345 → "dnh"
- Simple and collision-free
- Problem: sequential IDs are predictable — users can enumerate all short links

### Database Choice

**URL mapping (short → long):**
- This is essentially a key-value lookup: short code → long URL
- Use a **key-value store** (Redis, DynamoDB, or even Cassandra)
- SQL works for small scale, but at 116K reads/second a single SQL DB will struggle without caching

**User accounts and analytics:**
- Use **PostgreSQL** for user accounts (relational, ACID)
- Use **Cassandra** or **ClickHouse** for analytics (write-heavy time-series data)

### Cache Strategy

The 80/20 rule applies strongly here: **20% of URLs generate 80% of traffic**.

- Cache the 20% in **Redis** with TTL
- Cache-aside pattern: check Redis first, miss → query DB → populate Redis
- At 116K reads/second, even a 90% cache hit rate means only 11,600 DB reads/second — manageable

### The 301 vs 302 Decision

This is a classic interview gotcha:

- **301 Permanent Redirect**: browser caches the redirect. Future visits skip your server entirely. Lower server load, but you lose analytics (can't count clicks).
- **302 Temporary Redirect**: browser always hits your server. Higher server load, but you capture every click for analytics.

**Decision: Use 302 if analytics matter. Use 301 if cost/load matters.**

bit.ly uses 302 because their business model depends on click analytics.

### Architecture Overview

\`\`\`
Client → Load Balancer → URL Service → Redis Cache
                                    ↓ (cache miss)
                               URL Database (DynamoDB)
                                    ↓ (analytics)
                               Analytics Service → Cassandra
\`\`\`

---

## Case Study 2: WhatsApp Messenger

### Functional Requirements
- One-on-one text messaging
- Group messaging (up to 256 members)
- Media sharing (photos, videos, documents)
- Read receipts (sent, delivered, read)
- End-to-end encryption

### Non-Functional Requirements
- 2 billion users, 100 billion messages per day
- Messages delivered in < 500ms when both users are online
- Messages must not be lost even if recipient is offline for 30 days
- End-to-end encryption: WhatsApp servers must not be able to read message content

### Capacity Estimation

- 100 billion messages/day ÷ 86,400 = **1.16 million messages/second**
- Average message size: ~100 bytes (text) + metadata
- Storage per day: 100B × 200 bytes = **20 TB/day** (text only)
- Media: separate; WhatsApp stores media on object storage (AWS S3)

### The Core Challenge: Real-Time Delivery

**WebSockets** are the foundation. When a user opens WhatsApp, a persistent WebSocket connection is established between their device and a WhatsApp server. This allows the server to push messages to the client instantly without polling.

At 2 billion users, even if 10% are online simultaneously (200 million connections), you need hundreds of thousands of servers. Each server holds ~10,000 WebSocket connections, so you need ~20,000 servers just for connection management.

**Message flow (both users online):**
1. Sender sends message via WebSocket to their connected server
2. Server looks up which server the recipient is connected to
3. Server-to-server message delivery
4. Recipient's server pushes message via WebSocket to recipient
5. Recipient device sends acknowledgment → server sends "delivered" receipt to sender

**Message flow (recipient offline):**
1. Sender sends message → server sees recipient is offline
2. Message stored in **message queue** (Kafka) and **offline storage** (Cassandra)
3. When recipient reconnects, server fetches pending messages and delivers them
4. Recipient acknowledges → messages marked as delivered → deleted from queue

### Database Choice: Why Cassandra

WhatsApp messages are stored in **Cassandra** because:
- Write-heavy workload (1.16 million writes/second)
- Time-series data (messages ordered by timestamp per conversation)
- Horizontal scaling without a single point of failure
- Each conversation is a partition key → all messages for a conversation stored together
- Cassandra's wide-column model is ideal: row = conversation, columns = messages ordered by timestamp

SQL databases would struggle at this write rate. Even with sharding, the operational complexity would be enormous.

### End-to-End Encryption

WhatsApp uses the **Signal Protocol**:
- Each user has a public/private key pair stored only on their device
- Message is encrypted with recipient's public key on sender's device
- Only the recipient's private key can decrypt it
- WhatsApp servers only see encrypted blobs — they cannot read content
- This is why WhatsApp cannot comply with law enforcement requests to read messages

### Media Storage

Images/videos are **not sent through the message server**. Instead:
1. Sender uploads media to object storage (S3)
2. S3 returns a URL
3. Sender sends a message containing only the URL (encrypted)
4. Recipient downloads media from S3 via CDN

This decouples media handling from messaging, allowing each to scale independently.

### Delivery Receipts

- **Single grey tick**: message sent to WhatsApp server
- **Double grey tick**: message delivered to recipient's device
- **Double blue tick**: recipient has read the message

This requires tracking message state per recipient in a fast store (Redis or Cassandra with status columns).

### Architecture Overview

\`\`\`
[Sender Device] → WebSocket → [Connection Server A]
                                      ↓ (lookup recipient's server)
                              [Service Discovery / Redis]
                                      ↓
                              [Connection Server B] → WebSocket → [Recipient Device]
                                      ↓ (if offline)
                              [Kafka Queue] → [Cassandra (offline storage)]
\`\`\`

---

## Case Study 3: Instagram

### Functional Requirements
- Upload photos/videos
- Follow/unfollow users
- View personalized feed (posts from people you follow)
- Like and comment on posts
- Explore page (trending content)

### Non-Functional Requirements
- 500 million DAU, 100 million photos uploaded per day
- Feed must load in < 2 seconds
- Read-heavy system (10:1 read:write ratio)

### Capacity Estimation

- Photo uploads: 100M/day = **1,160 uploads/second**
- Photo size: average 3MB → 100M × 3MB = **300 TB/day** storage
- Feed reads: 500M users × 5 feed refreshes/day = 2.5 billion reads/day = **29,000 reads/second**

### The Core Challenge: Feed Generation

This is the hardest part of Instagram's design. When a user opens their feed, what should they see?

**Option 1: Fan-Out on Write (Push Model)**
- When Alice posts a photo, immediately write it to the feed table of all her followers
- Alice has 1000 followers → 1000 writes happen immediately
- Feed reads are instant (pre-computed)
- Problem: **celebrity problem** — Cristiano Ronaldo has 600 million followers. One post = 600 million writes. This can take hours and creates a write storm.

**Option 2: Fan-Out on Read (Pull Model)**
- Store only who follows whom (follow graph)
- When a user loads their feed, query all the people they follow and aggregate recent posts
- Problem: if you follow 1000 people, loading your feed requires 1000 queries — slow
- Problem: scales poorly for users who follow many accounts

**Instagram's Actual Approach: Hybrid**
- For regular users (< 1M followers): fan-out on write — pre-compute their followers' feeds
- For celebrities (> 1M followers): fan-out on read — when a regular user loads their feed, inject celebrity posts on the fly
- This avoids the celebrity write storm while keeping feeds fast for most users

### Database Choice

- **Users, follows, likes, comments**: **PostgreSQL** (relational, ACID, complex joins)
- **Feed storage**: **Cassandra** (pre-computed feeds stored as time-sorted lists per user)
- **Media metadata**: **PostgreSQL** with media stored in **S3**
- **Cache**: **Redis** for the most recent 200 feed items per user (covers 95% of reads)

### CDN Strategy

Photos are served through a CDN (Instagram uses Facebook's CDN infrastructure):
1. User uploads photo → stored in S3
2. CDN edge servers cache the photo close to users geographically
3. All photo URLs point to CDN, not directly to S3
4. Cache hit ratio > 99% for popular photos

### Architecture Overview

\`\`\`
[Upload Service] → S3 (media) + PostgreSQL (metadata)
                        ↓ (async)
               [Feed Generation Service]
                        ↓
               Cassandra (pre-computed feeds)
                        ↓
               Redis (cache of recent feeds)
                        ↓
               [Feed API] → Client
\`\`\`

---

## Case Study 4: Netflix

### Functional Requirements
- Browse catalog of movies and TV shows
- Stream video at chosen quality
- Resume playback where you left off
- Personalized recommendations
- Download for offline viewing

### Non-Functional Requirements
- 230 million subscribers worldwide
- 15% of global internet bandwidth during peak hours
- Video must start in < 2 seconds
- Support 4K HDR with adaptive bitrate

### Capacity Estimation

- 230M subscribers, assume 20% watching simultaneously at peak = 46 million concurrent streams
- Each stream: 5 Mbps (HD) → **46M × 5 Mbps = 230 Tbps** of bandwidth at peak
- This is why Netflix built its own CDN (Open Connect)

### Video Transcoding Pipeline

When a creator uploads a video to Netflix:
1. **Raw video ingested** into object storage (S3)
2. **Transcoding service** converts the video into hundreds of formats:
   - Multiple resolutions: 240p, 360p, 480p, 720p, 1080p, 4K
   - Multiple codecs: H.264, H.265, AV1
   - Multiple audio tracks: stereo, 5.1, Dolby Atmos
   - Multiple languages: subtitles and dubbed audio
3. Each segment (2-10 seconds) is encoded separately for parallel processing
4. **Adaptive Bitrate Streaming (ABR)**: player automatically selects quality based on connection speed

Netflix uses **thousands of EC2 instances** to parallelize transcoding. A 2-hour movie may produce 1,200+ encoded versions.

### Open Connect CDN

Netflix built its own CDN specifically for video streaming because:
- Generic CDNs are expensive at Netflix's scale
- They can optimize specifically for large-file video streaming
- They negotiate directly with ISPs to place **Open Connect Appliances (OCA)** — dedicated servers — inside ISP networks

Today, Netflix has 17,000+ OCAs in 6,000+ locations. When you stream Netflix, the video is likely coming from a server inside your ISP, not from Netflix's data centers.

### Database Choices

Netflix uses a microservices architecture with 500+ services, each potentially using different databases:

- **MySQL**: user accounts, subscription billing (ACID required)
- **Cassandra**: viewing history, play events (write-heavy, time-series, no complex joins needed)
- **ElasticSearch**: content search (full-text search across titles, descriptions, actors)
- **S3**: all video files
- **EVCache (Netflix's Redis)**: session data, user preferences, frequently accessed data

### Recommendation System

Netflix's recommendation engine drives 80% of content watched. It uses:
- Collaborative filtering (users who watched X also watched Y)
- Content-based filtering (movie metadata: genre, actors, director)
- Deep learning models trained on billions of viewing events

The recommendations run as a batch process (Spark jobs on historical data) and are cached. Real-time personalization adjusts thumbnails and row ordering.

---

## Case Study 5: Ride Sharing (Uber)

### Functional Requirements
- Rider requests a ride with pickup/dropoff location
- System matches rider with nearest available driver
- Real-time location tracking during the ride
- Dynamic surge pricing
- Payment processing

### Non-Functional Requirements
- 25 million trips per day
- Driver location updated every 4 seconds
- Match a rider to a driver in < 1 second
- Support 5 million active drivers simultaneously

### Capacity Estimation

- 5M drivers updating location every 4 seconds = **1.25 million location updates/second**
- This is an extremely write-heavy workload
- Need: geospatial indexing to quickly find nearest drivers

### The Core Challenge: Real-Time Location Tracking

**Geohashing** divides the world into a grid of cells using a string key. Nearby locations share the same geohash prefix.

- Driver sends GPS coordinates every 4 seconds → converted to geohash
- Uber stores driver locations in **Redis** with the geohash as key
- Redis Geo commands natively support geospatial queries

When a rider requests a pickup:
1. Convert pickup location to geohash
2. Query Redis for all drivers in the same geohash cell (and adjacent cells)
3. Sort by actual distance
4. Match with the best available driver

### Matching Algorithm

Beyond just "nearest driver," Uber's matching considers:
- Driver's current heading (a driver 500m away but heading toward you is better than one 300m away heading away)
- Estimated pickup time (not just distance)
- Driver acceptance rate
- Ride type (UberX, UberBlack, etc.)

### Surge Pricing

Surge pricing is calculated based on supply/demand in each geohash zone:
- Count riders requesting rides in zone → demand
- Count available drivers in zone → supply
- surge_multiplier = f(demand / supply)
- Recalculated every minute or when imbalance detected

### Database Choices

- **PostgreSQL**: trips, users, payments (ACID required — you cannot double-charge someone)
- **Cassandra**: location history (append-only, time-series, massive write volume)
- **Redis**: live driver locations (low latency geospatial queries, in-memory)
- **Kafka**: event streaming (ride events, location events, payment events)

### Architecture Overview

\`\`\`
[Driver App] → Location Service → Redis (geospatial)
[Rider App]  → Matching Service ← Redis
                     ↓ (match found)
               Trip Service → PostgreSQL
                     ↓
               Payment Service → Payment Gateway
                     ↓
               Notification Service → Push Notifications
\`\`\`

---

## Case Study 6: E-Commerce Platform

### Functional Requirements
- Browse and search products
- Add to cart, checkout
- Inventory management (never oversell)
- Order management
- Payment processing
- Flash sales

### Non-Functional Requirements
- 50 million DAU, 10x traffic spikes during flash sales
- Inventory must be accurate (zero overselling tolerance)
- Payment must be idempotent (never double-charge)
- Search must return results in < 500ms

### The Core Challenge: Inventory Locking

Imagine 1000 users trying to buy the last pair of shoes simultaneously. Without proper locking:
- All 1000 check inventory → 1 item available ✓
- All 1000 proceed to checkout
- All 1000 deduct 1 from inventory
- Result: -999 inventory (catastrophically oversold)

**Solutions:**

**Pessimistic Locking (SELECT FOR UPDATE in SQL):**
\`\`\`sql
BEGIN;
SELECT quantity FROM inventory WHERE product_id = 123 FOR UPDATE;
-- Lock held; other transactions wait
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 123;
COMMIT;
\`\`\`
Safe but slow at high concurrency — each lock blocks others.

**Optimistic Locking (version/CAS):**
\`\`\`sql
UPDATE inventory
SET quantity = quantity - 1, version = version + 1
WHERE product_id = 123 AND version = 5 AND quantity > 0;
-- If 0 rows affected, retry (someone else got there first)
\`\`\`
Better throughput. Application retries on failure.

**Redis Atomic Decrement (best for flash sales):**
\`\`\`
DECR inventory:product:123
-- Returns new value atomically
-- If new value < 0, rollback and return "out of stock"
\`\`\`
Redis single-threaded operations are atomic. At flash sale scale, use Redis as inventory counter with periodic sync to DB.

### Payment Idempotency

A user clicks "Pay Now" and the network times out. Did the payment go through? They click again. You must not charge them twice.

Solution: **Idempotency keys**
- Client generates a unique key per checkout attempt (UUID)
- Sends key with every payment request
- Server stores key in DB with payment result
- If same key arrives again, return cached result — do not process twice

### Flash Sale Architecture

Flash sales create 10x-100x traffic spikes on specific products.

- **Rate limiting**: allow only N purchases per second per product
- **Queue**: put all purchase requests in a queue (Kafka/SQS); process at sustainable rate
- **Virtual waiting room**: show users their position in queue (like Ticketmaster)
- **Separate flash sale service**: isolate flash sale traffic from regular catalog

### Search: Elasticsearch

Product catalog search requires:
- Full-text search ("blue running shoes")
- Faceted filtering (brand = Nike, size = 10, color = blue)
- Relevance ranking (most popular blue running shoes first)

PostgreSQL's full-text search works for small catalogs but struggles at millions of products. **Elasticsearch** handles this natively and scales horizontally.

Sync strategy: product updates in PostgreSQL → Kafka event → ElasticSearch indexer updates search index asynchronously.

---

## Key Lessons Across All Case Studies

**Every system has one hard problem.** URL shortener: unique code generation. WhatsApp: offline delivery. Instagram: feed generation. Netflix: transcoding + CDN. Uber: real-time geospatial matching. E-commerce: inventory consistency. Identify the hard problem first — design everything else around it.

**Read-heavy vs. write-heavy determines your caching strategy.** Instagram and Netflix are read-heavy → aggressive CDN and cache. WhatsApp and Uber location tracking are write-heavy → Cassandra, Redis atomic operations.

**Decouple to scale independently.** Netflix transcoding is separate from streaming. Instagram upload is separate from feed generation. This lets you scale each component based on its own load pattern.

**Consistency requirements dictate database choice.** Payment requires strong consistency → PostgreSQL with transactions. Message history only needs eventual consistency → Cassandra. Live locations need speed over consistency → Redis.

**Cache the expensive, cache the hot, cache the immutable.** The most commonly accessed 20% of data should almost never hit the database. Design your cache layer around this principle from day one.`,

  codeExamples: [
    {
      title: 'URL Shortener: Base62 Encoding',
      code: `const BASE62_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function encodeBase62(num: number): string {
  if (num === 0) return BASE62_CHARS[0];

  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

function decodeBase62(str: string): number {
  let result = 0;
  for (const char of str) {
    result = result * 62 + BASE62_CHARS.indexOf(char);
  }
  return result;
}

// Database auto-increment ID 12345 → short code
const shortCode = encodeBase62(12345);
console.log('Short code:', shortCode); // "dnh"
console.log('Decoded:', decodeBase62(shortCode)); // 12345`,
      output: `Short code: dnh
Decoded: 12345`,
      explanation:
        'Base62 converts a numeric database ID into a compact alphanumeric string. ID 12345 becomes "dnh" — 3 characters. A 6-character code supports 62^6 ≈ 56 billion unique URLs.',
    },
    {
      title: 'Geohash: Driver Location Lookup',
      code: `// Conceptual geohash-based driver lookup
// (Real implementation uses Redis GEO commands)

interface Driver {
  id: string;
  lat: number;
  lng: number;
  geohash: string;
}

// Encode coordinates to geohash prefix (precision = characters)
function encodeGeohash(lat: number, lng: number, precision: number = 6): string {
  // Simplified: real implementation uses bit interleaving
  // precision 6 = ~1.2km × 0.6km cell
  return \`geohash:\${lat.toFixed(2)}:\${lng.toFixed(2)}\`.slice(0, precision + 8);
}

// Find nearby drivers within geohash cell
async function findNearbyDrivers(
  riderLat: number,
  riderLng: number,
  radiusKm: number,
  redis: any
): Promise<Driver[]> {
  // Redis GEORADIUS command: returns members within radius
  const nearbyDriverIds = await redis.georadius(
    'driver_locations',   // key
    riderLng,             // longitude first in Redis
    riderLat,             // latitude second
    radiusKm,             // radius
    'km',                 // unit
    'WITHCOORD',          // return coordinates
    'WITHDIST',           // return distance
    'ASC',                // sort by distance
    'COUNT', 10           // max 10 results
  );

  return nearbyDriverIds;
}

// Driver sends location update every 4 seconds
async function updateDriverLocation(
  driverId: string,
  lat: number,
  lng: number,
  redis: any
): Promise<void> {
  // Redis GEOADD: O(log N) operation
  await redis.geoadd('driver_locations', lng, lat, driverId);
  // Also update driver status in hash
  await redis.hset(\`driver:\${driverId}\`, {
    lat, lng,
    lastUpdate: Date.now(),
    status: 'available'
  });
}`,
      explanation:
        "Redis GEO commands use geohashing internally. GEOADD stores a driver's position in O(log N). GEORADIUS finds all drivers within X km in O(N+log M) time. At 5 million drivers, this runs in milliseconds.",
    },
    {
      title: 'Inventory: Optimistic Locking',
      code: `// Optimistic locking for inventory management
// No database locks held — high concurrency friendly

interface InventoryResult {
  success: boolean;
  remainingQuantity?: number;
  error?: string;
}

async function purchaseItem(
  db: any,
  productId: string,
  quantity: number,
  maxRetries: number = 3
): Promise<InventoryResult> {

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Read current state including version
    const item = await db.query(
      'SELECT quantity, version FROM inventory WHERE product_id = $1',
      [productId]
    );

    if (!item || item.quantity < quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    const currentVersion = item.version;
    const newQuantity = item.quantity - quantity;

    // Update only if version hasn't changed (no one else modified it)
    const result = await db.query(
      \`UPDATE inventory
       SET quantity = $1, version = version + 1
       WHERE product_id = $2 AND version = $3 AND quantity >= $4
       RETURNING quantity\`,
      [newQuantity, productId, currentVersion, quantity]
    );

    if (result.rowCount > 0) {
      // Success — we got the update
      return { success: true, remainingQuantity: result.rows[0].quantity };
    }

    // Version changed — someone else updated inventory. Retry.
    console.log(\`Retry \${attempt + 1}: concurrent modification detected\`);
    await new Promise(resolve => setTimeout(resolve, 10 * (attempt + 1))); // backoff
  }

  return { success: false, error: 'Too many concurrent requests, please try again' };
}`,
      explanation:
        'Optimistic locking reads the current version, attempts an update only if version matches, and retries if it does not. This avoids database-level locking (which serializes all transactions) while still preventing overselling.',
    },
    {
      title: 'Payment Idempotency',
      code: `// Idempotency key pattern for payment processing

interface PaymentRequest {
  idempotencyKey: string; // UUID generated by client
  userId: string;
  amount: number;
  currency: string;
  orderId: string;
}

interface PaymentResult {
  status: 'success' | 'failed' | 'duplicate';
  transactionId?: string;
  message: string;
}

async function processPayment(
  db: any,
  paymentGateway: any,
  request: PaymentRequest
): Promise<PaymentResult> {

  // Check if this idempotency key was already processed
  const existing = await db.query(
    'SELECT * FROM payment_records WHERE idempotency_key = $1',
    [request.idempotencyKey]
  );

  if (existing.rows.length > 0) {
    // Return cached result — do NOT charge again
    const record = existing.rows[0];
    return {
      status: 'duplicate',
      transactionId: record.transaction_id,
      message: 'Payment already processed (idempotent response)',
    };
  }

  // Reserve the idempotency key BEFORE charging
  // (prevents race condition where two identical requests arrive simultaneously)
  await db.query(
    \`INSERT INTO payment_records (idempotency_key, user_id, status, created_at)
     VALUES ($1, $2, 'processing', NOW())
     ON CONFLICT (idempotency_key) DO NOTHING\`,
    [request.idempotencyKey, request.userId]
  );

  // Process payment with gateway
  const gatewayResult = await paymentGateway.charge({
    amount: request.amount,
    currency: request.currency,
    userId: request.userId,
  });

  // Update record with final result
  await db.query(
    \`UPDATE payment_records
     SET status = $1, transaction_id = $2, completed_at = NOW()
     WHERE idempotency_key = $3\`,
    [gatewayResult.success ? 'success' : 'failed', gatewayResult.transactionId, request.idempotencyKey]
  );

  return {
    status: gatewayResult.success ? 'success' : 'failed',
    transactionId: gatewayResult.transactionId,
    message: gatewayResult.success ? 'Payment completed' : 'Payment failed',
  };
}`,
      explanation:
        "Idempotency keys ensure a payment is processed exactly once. The client generates a UUID before the request. If the network fails and they retry with the same UUID, the server returns the original result without charging again. The INSERT ... ON CONFLICT pattern prevents race conditions when two requests with the same key arrive simultaneously.",
    },
  ],

  commonMistakes: [
    'Designing the database before understanding the access patterns — always define what queries you need to run before choosing a database',
    'Choosing SQL or NoSQL based on familiarity, not on consistency requirements and scale',
    'Ignoring the celebrity/hotspot problem in fan-out on write — one viral post can trigger millions of writes',
    'Using 301 permanent redirects in URL shorteners when analytics are needed — browser caches bypass your server entirely',
    'Not accounting for the read-to-write ratio before designing the cache strategy',
    'Designing a single payment service without idempotency — network timeouts will cause double charges',
    'Keeping live, fast-changing data (driver locations) in a relational database instead of an in-memory store',
    'Forgetting that media (images, video) should never go through the message/API server — always use object storage + CDN',
    'Not considering the thundering herd problem when caches expire for popular content simultaneously',
    'Overcomplicating the design before estimating whether the simple approach would work at the given scale',
  ],

  interviewQuestions: [
    {
      question: 'Design a URL shortener that handles 100 million URLs per day.',
      answer:
        'Start with requirements: read-heavy (100:1 ratio), need unique 6-character short codes, need analytics. Use Base62 encoding of auto-increment IDs or a pre-generated code pool to avoid collisions. Store URL mappings in a key-value store (DynamoDB or Redis) for fast lookups. Cache the top 20% of URLs in Redis (handles 80% of traffic). Use 302 redirects (not 301) to preserve analytics. The hardest part is generating unique codes at scale — a ticket server approach works best.',
      difficulty: 'intermediate',
      followUp: [
        'How would you add analytics without slowing down redirects?',
        'How would you support custom aliases?',
        'How would you handle URL expiration?',
      ],
      tip: 'Always distinguish 301 vs 302 — it demonstrates you understand real-world implications, not just architecture.',
    },
    {
      question: "What is the 'celebrity problem' in social media feed design and how is it solved?",
      answer:
        "The celebrity problem occurs when a user with millions of followers (e.g., a celebrity) posts content. In a fan-out on write system, one post triggers millions of write operations simultaneously — one per follower. This creates a write storm that can overwhelm databases and queues. The solution is a hybrid approach: fan-out on write for regular users (pre-compute feeds), and fan-out on read for celebrities (inject their posts dynamically when any user loads their feed). Instagram and Twitter both use this hybrid strategy.",
      difficulty: 'advanced',
      followUp: [
        'How do you define the threshold for "celebrity" — is it a fixed follower count?',
        'What are the consistency tradeoffs of the hybrid approach?',
      ],
      tip: "Mention the threshold problem — what counts as a 'celebrity'? Instagram uses follower count thresholds and adjusts dynamically.",
    },
    {
      question:
        'How does Netflix serve video to 46 million simultaneous viewers without its data centers being overwhelmed?',
      answer:
        "Netflix built its own CDN called Open Connect, with 17,000+ servers (Open Connect Appliances) placed directly inside ISP networks worldwide. During off-peak hours, Netflix proactively pushes the most popular content to these edge servers. When a user streams, the video comes from the nearest OCA — often inside their own ISP — not from Netflix's data centers. Additionally, Netflix uses adaptive bitrate streaming: video is pre-transcoded into dozens of quality levels, and the player automatically selects the best quality for the current network speed.",
      difficulty: 'advanced',
      followUp: [
        'Why did Netflix build their own CDN instead of using CloudFront or Akamai?',
        'How does adaptive bitrate streaming work technically?',
      ],
    },
    {
      question: 'How do you prevent overselling during a flash sale where 100,000 users try to buy the last item?',
      answer:
        'There are three approaches: (1) Pessimistic locking — SELECT FOR UPDATE in SQL serializes access but creates a queue that kills throughput. (2) Optimistic locking — read a version number, update only if version unchanged, retry on conflict. Good throughput but adds application complexity. (3) Redis atomic decrement — DECR is atomic in Redis (single-threaded). Decrement the counter; if result is negative, rollback and return "sold out". This is the best approach for flash sales because Redis can handle hundreds of thousands of operations per second. The DB is updated asynchronously after the Redis counter confirms a successful purchase.',
      difficulty: 'expert',
      followUp: [
        'What happens if Redis goes down between the decrement and the DB write?',
        'How would you handle the recovery scenario where Redis and DB are out of sync?',
      ],
      tip: 'Mention all three approaches and explain why Redis wins for flash sales — demonstrates depth of understanding.',
    },
    {
      question: 'Why does WhatsApp store messages in Cassandra instead of PostgreSQL?',
      answer:
        "WhatsApp processes 1.16 million messages per second. Cassandra is chosen because: (1) It is optimized for write-heavy workloads — writes are appends to commit logs, extremely fast. (2) Messages are time-series data per conversation, which maps perfectly to Cassandra's wide-column model (partition key = conversation ID, clustering key = timestamp). (3) Cassandra scales horizontally with no single master — you can add nodes to increase throughput linearly. (4) It has no single point of failure — data is replicated across multiple nodes. PostgreSQL at this write volume would require aggressive sharding, complex operational overhead, and would still struggle with the write throughput ceiling.",
      difficulty: 'advanced',
      followUp: ['How does Cassandra handle the case where a user sends a message to themselves?'],
    },
    {
      question: 'How does Uber match a rider to a driver in under one second at global scale?',
      answer:
        "Uber uses geohashing to index driver locations. The world is divided into grid cells using geohash strings — nearby locations share the same prefix. All 5 million active drivers update their location to Redis every 4 seconds using Redis GEO commands (GEOADD). When a rider requests a trip, Uber converts the pickup location to a geohash cell and queries Redis GEORADIUS to find all available drivers within a radius. Redis GEO operations run in O(N+log M) time in memory — this entire lookup takes milliseconds. The matching algorithm then considers distance, driver heading, ETA, and ride type to select the optimal driver.",
      difficulty: 'expert',
      followUp: [
        "What happens if there are no drivers in the rider's geohash cell?",
        'How does Uber handle the transition between geohash cells as a driver moves?',
      ],
    },
    {
      question: "Explain the tradeoff between 301 and 302 redirects in a URL shortener.",
      answer:
        '301 is a "Moved Permanently" redirect. Browsers cache it: after the first visit, the browser goes directly to the destination without ever hitting your server again. This dramatically reduces server load but means you lose analytics data — you cannot count clicks if the browser bypasses you. 302 is "Found" (temporary redirect). The browser always hits your server on every visit, giving you complete analytics visibility at the cost of higher server load. If your business model depends on click analytics (like bit.ly), you must use 302. If you just want to redirect and do not need analytics, 301 is cheaper to operate.',
      difficulty: 'intermediate',
      tip: 'This question tests whether you understand HTTP semantics and their operational consequences — not just how to build the redirect.',
    },
    {
      question: 'How would you design the payment system to ensure a user is never charged twice?',
      answer:
        'Implement idempotency keys. Before making a payment request, the client generates a UUID and sends it as a header with every request. The server stores the idempotency key and the payment result in a database table with a unique constraint on the key. If the same key arrives again (network retry), the server returns the stored result without processing the payment again. To handle race conditions where two requests with the same key arrive simultaneously, use INSERT ... ON CONFLICT DO NOTHING to reserve the key before processing. This pattern is used by Stripe, PayPal, and all major payment providers.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'case-study-url-shortener',
      title: 'Design a URL Shortener From Scratch',
      description:
        'Without looking at notes, design a URL shortener that handles 50 million new URLs per day and 5 billion redirects per day. Walk through: requirements, capacity estimation, short code generation strategy, database choice, cache design, and redirect strategy (301 vs 302). Draw a simple architecture diagram.',
      starterCode: `// URL Shortener Design Exercise
// Work through each section:

// 1. REQUIREMENTS
// Functional:
//   -
// Non-Functional:
//   -

// 2. CAPACITY ESTIMATION
// Writes: 50M/day = __ writes/second
// Reads: 5B/day = __ reads/second
// Storage: 50M records × __ bytes = __ GB/day

// 3. SHORT CODE GENERATION
// Approach chosen: ___
// Why: ___
// Collision handling: ___

// 4. DATABASE CHOICE
// URL mapping table: ___ because ___
// User accounts: ___ because ___

// 5. CACHE STRATEGY
// Cache: ___
// What to cache: ___
// TTL: ___
// Expected hit rate: ___%

// 6. REDIRECT STRATEGY
// Use 301 or 302? ___
// Why: ___

// 7. ARCHITECTURE
// Draw boxes and arrows for:
// Client → ___ → ___ → ___`,
      solution: `// URL Shortener Design — Complete Solution

// 1. REQUIREMENTS
// Functional:
//   - User submits long URL, receives short URL
//   - User visits short URL, gets redirected
//   - Optional: analytics, custom aliases, expiry
// Non-Functional:
//   - High availability (broken links = lost traffic for customers)
//   - Low latency redirects (< 50ms)
//   - 100:1 read/write ratio

// 2. CAPACITY ESTIMATION
// Writes: 50M / 86400 ≈ 580 writes/second
// Reads: 5B / 86400 ≈ 57,870 reads/second
// Storage: 50M × 500 bytes = 25 GB/day = ~45 TB over 5 years

// 3. SHORT CODE GENERATION — Base62 of auto-increment ID
// Auto-increment ID (1, 2, 3...) encoded in Base62
// 6 characters = 62^6 = 56.8 billion unique codes
// No collision possible (IDs are unique by definition)
// Ticket server approach: separate service hands out pre-generated codes

// 4. DATABASE CHOICE
// URL mapping: DynamoDB (key-value, fast point lookups, scales to 57K reads/sec)
// User accounts: PostgreSQL (relational, ACID for billing/auth)
// Analytics: ClickHouse (column-store, fast aggregation of click events)

// 5. CACHE STRATEGY
// Redis with LRU eviction
// Cache top 20% of URLs (handles 80% of traffic)
// TTL: 24 hours for regular URLs, 1 hour for expiring URLs
// At 90% hit rate: only 5,787 actual DB reads/second

// 6. REDIRECT STRATEGY
// Use 302 (temporary) — we need analytics
// 301 would skip our server after first visit → no click counting

// 7. ARCHITECTURE
// Client → Load Balancer → Redirect Service → Redis
//                                           ↓ (miss)
//                                       DynamoDB
//                                           ↓ (async)
//                                   Analytics Service → ClickHouse`,
      hints: [
        'Calculate reads per second — this number tells you whether Redis is optional or mandatory',
        'Think about what happens when your code generation service goes down — design for failure',
        'The analytics requirement fundamentally changes the redirect strategy — address this explicitly',
      ],
    },
    {
      id: 'case-study-feed-design',
      title: 'Choose a Feed Generation Strategy',
      description:
        "You are designing the feed system for a social platform. You have three types of users: (A) Celebrity with 10 million followers posts 3 times/day. (B) Regular user with 500 followers posts 2 times/day. (C) New user with 10 followers posts occasionally. Design the feed generation strategy, explaining which approach you use for each user type and why. What are the consistency tradeoffs?",
      starterCode: `// Feed Generation Strategy Exercise

// User types:
// A: Celebrity — 10M followers, posts 3x/day
// B: Regular — 500 followers, posts 2x/day
// C: New user — 10 followers, posts occasionally

// Approach options:
// 1. Fan-out on Write: when user posts, write to all followers' feeds immediately
// 2. Fan-out on Read: when follower opens feed, query all followees' posts
// 3. Hybrid: use different strategies per user type

// For Celebrity (User A):
// Strategy: ___
// Why: ___
// Cost of alternative: ___

// For Regular User (User B):
// Strategy: ___
// Why: ___

// For New User (User C):
// Strategy: ___
// Why: ___

// Consistency tradeoff:
// Fan-out on write means feed is ___
// Fan-out on read means feed is ___
// Which is acceptable for a social feed? ___`,
      solution: `// Feed Generation Strategy — Complete Solution

// For Celebrity (User A): FAN-OUT ON READ
// Why: 10M followers × 3 posts/day = 30 million writes per day just for ONE celebrity
//      At 100 celebrities, that's 3 billion writes/day — unsustainable
// Approach: When any user loads their feed, query celebrity posts separately and inject them
// Storage: Only the post itself is stored (not 10M feed entries)

// For Regular User (User B): FAN-OUT ON WRITE
// Why: 500 followers × 2 posts/day = 1000 writes — perfectly manageable
// Approach: When User B posts, write post_id to all 500 followers' feed tables
// Benefit: Feed reads are instant — just read pre-computed feed table
// Storage: 1000 entries per post (acceptable)

// For New User (User C): FAN-OUT ON WRITE (same as B)
// Why: 10 followers × occasional posts = negligible writes
// No special handling needed

// HYBRID THRESHOLD: users with > 1M followers use fan-out on read
// Everyone else uses fan-out on write
// The threshold can be tuned based on write capacity

// Consistency tradeoff:
// Fan-out on write: feed is CONSISTENT — everyone sees the post at same time
// Fan-out on read: feed has EVENTUAL CONSISTENCY — celebrity post injected per-request
// For a social feed, eventual consistency is ACCEPTABLE
// No one needs to see a tweet at the exact millisecond it was posted
// This is NOT banking — 1-2 second delay is imperceptible to users`,
      hints: [
        'Calculate the total writes per day for the celebrity case — the number will make the choice obvious',
        'Think about what "consistency" means for a social feed — is it really critical?',
        'Consider the read cost of fan-out on read for a user who follows 5000 people',
      ],
    },
  ],

  keyTakeaways: [
    'Every real system has one primary hard problem — identify it first and design everything around solving it',
    'Read-heavy systems (Instagram, Netflix) need aggressive CDN and caching; write-heavy systems (WhatsApp, Uber locations) need Cassandra and Redis atomic operations',
    'The celebrity problem requires a hybrid feed strategy — fan-out on write for regular users, fan-out on read for high-follower accounts',
    'URL shorteners should use 302 redirects (not 301) when analytics matter — 301 causes browsers to bypass your server',
    'Cassandra is the right choice for time-series, write-heavy, append-only data (messages, events, location history)',
    'Redis GEO commands enable sub-millisecond geospatial driver lookups that power real-time matching in ride-sharing',
    'Payment systems require idempotency keys to prevent double charging on network retries',
    'Flash sale inventory is best managed with Redis atomic DECR operations, with PostgreSQL as the source of truth updated asynchronously',
    'Media (photos, video) should always be stored in object storage (S3) with CDN delivery — never through your API servers',
    'Netflix Open Connect proves that building domain-specific infrastructure beats generic solutions at sufficient scale',
  ],
};
