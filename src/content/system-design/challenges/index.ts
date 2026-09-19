import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  {
    id: 'design-url-shortener',
    slug: 'design-url-shortener',
    title: 'Design a URL Shortener',
    description:
      'Design a system like bit.ly or tinyurl.com. Users submit a long URL and receive a short URL (e.g., short.ly/abc123). When a user visits the short URL, they are redirected to the original. The system must handle 100 million new URLs per day and 10 billion redirects per day (100:1 read/write ratio) with redirect latency under 50ms.',
    difficulty: 'beginner',
    topic: 'Caching & Databases',
    starterCode: `// URL Shortener System Design

// STEP 1: REQUIREMENTS
// Functional:
//   - POST /shorten: accept long URL, return short URL
//   - GET /:code: redirect to original URL
//   - Optional: custom aliases, expiry, analytics

// Non-Functional:
//   - 100M new URLs/day → ___ writes/second
//   - 10B redirects/day → ___ reads/second
//   - Redirect latency < 50ms
//   - High availability (broken links = bad for customers)

// STEP 2: SHORT CODE GENERATION
// Option A: MD5 hash of long URL, take first 6 characters
//   Problem: ___
// Option B: Auto-increment database ID + Base62 encoding
//   Formula: ID 12345 in Base62 = ___
//   Collision risk: ___
// Option C: Pre-generated code pool
//   Benefit: ___

// STEP 3: DATA STORAGE
// URL mapping (short → long): use ___ because ___
// User accounts: use ___ because ___
// Click analytics: use ___ because ___

// STEP 4: CACHING STRATEGY
// Which URLs to cache?: ___
// Cache eviction: ___
// Expected cache hit rate: ___%
// What this means for DB reads/second: ___

// STEP 5: REDIRECT STRATEGY
// 301 vs 302? Choose ___ because ___

// STEP 6: ARCHITECTURE DIAGRAM
// Draw: Client → [___] → [___] → [___]`,
    solution: `// URL Shortener — Complete Solution

// CAPACITY ESTIMATES
// Writes: 100M / 86,400 = 1,157 writes/second
// Reads: 10B / 86,400 = 115,741 reads/second
// Read:write ratio = 100:1 → heavily read-dominant → cache aggressively

// SHORT CODE GENERATION: Base62 encoding of auto-increment ID
// Base62 alphabet: a-z + A-Z + 0-9 = 62 characters
// 6-character code: 62^6 = 56.8 billion unique codes (enough for ~150 years)
// ID 12345 → Base62 → "dnh"
// Zero collision risk: database IDs are globally unique by design

function encodeBase62(num: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  if (num === 0) return chars[0];
  let result = '';
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

// API DESIGN
// POST /api/v1/shorten
//   Body: { url: string, customAlias?: string, expiresAt?: number }
//   Response: { shortUrl: string, shortCode: string, expiresAt: number }
// GET /:shortCode → 302 redirect to original URL

// DATA STORAGE
// URL mapping: DynamoDB
//   Key: shortCode (partition key, fast O(1) lookup)
//   Attributes: originalUrl, userId, createdAt, expiresAt, clickCount
//   Why DynamoDB: key-value access pattern, 115K reads/second at scale
// User accounts: PostgreSQL (ACID, relational, complex queries)
// Analytics: ClickHouse (column-store, fast aggregation of click events)

// CACHE STRATEGY
// Store in Redis: shortCode → originalUrl
// TTL: 24 hours (most redirects happen within 24 hours of creation)
// Eviction: LRU (least recently used)
// The 80/20 rule: cache top 20% of codes (they get 80% of traffic)
// 20% of 100M codes cached = 20M codes × 512 bytes = ~10 GB Redis
// Expected cache hit rate: 90%+
// DB reads/second: 115,741 × 0.10 = 11,574 (manageable by DynamoDB)

// REDIRECT FLOW
// 1. Client requests GET /abc123
// 2. Redirect service checks Redis: cache HIT → return 302 immediately (< 5ms)
// 3. Cache MISS → query DynamoDB → cache result → return 302 (< 50ms)
// 4. Log click event asynchronously (Kafka → ClickHouse)

// WHY 302 NOT 301
// 301 = Moved Permanently → browser caches redirect → never hits our server again
// 302 = Found (temporary) → browser always hits our server → we can count clicks
// Since we charge for analytics, we need 302

// ARCHITECTURE
// Client → CDN (for static assets)
// Client → Load Balancer → Redirect Service (stateless, horizontally scaled)
//                                    ↓
//                              Redis Cluster (cache)
//                                    ↓ (miss)
//                              DynamoDB (authoritative store)
//                                    ↓ (async click logging)
//                              Kafka → Analytics Workers → ClickHouse`,
    hints: [
      'Calculate reads per second first — the number will tell you whether Redis is optional or mandatory (hint: it is mandatory at 115K reads/second)',
      'Think about what 301 vs 302 means for your ability to count clicks — browser behavior is the key difference',
      'Base62 encoding of auto-increment IDs is the cleanest solution — no collision detection needed because IDs are already unique',
    ],
    explanation:
      'The key insight is that URL shorteners are overwhelmingly read-heavy (100:1 ratio). At 115,000 reads/second, a single database cannot handle the load — Redis caching is not optional, it is the core architecture decision. The 301 vs 302 choice directly impacts analytics revenue, making it a business decision as much as a technical one. Base62 encoding of auto-increment IDs elegantly solves the code generation problem without any collision risk or coordination overhead.',
    tags: ['caching', 'databases', 'key-value', 'CDN', 'redirects', 'Base62', 'Redis'],
  },
  {
    id: 'design-rate-limiter',
    slug: 'design-rate-limiter',
    title: 'Design a Rate Limiter',
    description:
      'Design a rate limiter that prevents clients from making more than N requests per time window. It must work across multiple API server instances (distributed), support per-user and per-IP limiting, allow 1 million requests per second globally, and add less than 5ms latency to each request.',
    difficulty: 'beginner',
    topic: 'Distributed Systems',
    starterCode: `// Rate Limiter Design

// ALGORITHMS TO CHOOSE FROM:
// A) Fixed Window Counter: count requests per minute bucket
//    Problem at window boundary: ___
// B) Sliding Window Log: store timestamp of each request
//    Problem: ___
// C) Token Bucket: tokens refill at rate R, each request costs 1 token
//    Benefit: ___
// D) Sliding Window Counter: combine fixed windows with a formula
//    Formula: requests = current_window_count + prev_window_count × overlap_fraction

// CHOSEN ALGORITHM: ___
// Reason: ___

// DISTRIBUTED IMPLEMENTATION
// Why can't we use in-process counters?
//   Problem: ___
// Solution: use ___ for shared state

// REDIS IMPLEMENTATION
// For per-user rate limiting:
//   Key structure: ___
//   Atomic operation: ___
//   TTL: ___

// PERFORMANCE OPTIMIZATION
// Problem: Redis adds latency to every request
// Solution: ___
// Tradeoff: ___

// WHERE TO PLACE THE RATE LIMITER
// Option A: In each application server
//   Problem: ___
// Option B: At the API gateway
//   Benefit: ___`,
    solution: `// Rate Limiter — Complete Solution

// CHOSEN ALGORITHM: Sliding Window Counter (best balance of accuracy vs memory)
// How it works:
//   - Maintain counters for current and previous time windows
//   - Weight the previous window by the overlap fraction
//   - requests = current_count + prev_count × (window_size - elapsed) / window_size

// Redis sliding window implementation
async function isRateLimited(
  redis: any,
  userId: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const currentWindow = Math.floor(now / windowMs);
  const prevWindow = currentWindow - 1;

  const currentKey = \`rate:\${userId}:\${currentWindow}\`;
  const prevKey = \`rate:\${userId}:\${prevWindow}\`;

  // Use Redis pipeline for atomic multi-command execution
  const pipeline = redis.pipeline();
  pipeline.incr(currentKey);
  pipeline.expire(currentKey, windowSeconds * 2); // expire after 2 windows
  pipeline.get(prevKey);
  const [currentCount, , prevCountStr] = await pipeline.exec();

  const prevCount = parseInt(prevCountStr || '0');
  const elapsed = now % windowMs;
  const overlapFraction = (windowMs - elapsed) / windowMs;

  const estimatedCount = currentCount + prevCount * overlapFraction;

  return estimatedCount > limit; // true = rate limited, reject request
}

// PLACEMENT: API Gateway
// Reasons:
// 1. Applied before request reaches any service (saves wasted compute)
// 2. Single place to maintain and update rate limiting logic
// 3. Works across all services without each needing to implement it
// 4. Can rate limit before authentication (IP-based DDoS protection)

// PER-USER vs PER-IP LIMITING
// Per-IP: key = "rate:ip:{ipAddress}:{window}" → protects against unauthenticated DDoS
// Per-user: key = "rate:user:{userId}:{window}" → protects against authenticated abuse
// Both applied: IP limit first (fast, no auth needed), user limit second

// PERFORMANCE OPTIMIZATION
// Problem: Redis round-trip adds 1-5ms to every request
// Solution: Local token bucket in each server process, sync to Redis every 100ms
//   Local tokens: fast in-memory check (nanoseconds)
//   Redis sync: runs in background every 100ms
//   Accuracy: ~10% over-counting possible (two servers each allow 90% in the sync window)
//   Tradeoff: accept slight over-counting in exchange for no per-request Redis latency

// RESPONSE HEADERS (standard practice)
// X-RateLimit-Limit: 1000       → maximum allowed per window
// X-RateLimit-Remaining: 950    → how many left in current window
// X-RateLimit-Reset: 1640000000 → Unix timestamp when window resets
// HTTP 429 Too Many Requests with Retry-After header`,
    hints: [
      'The sliding window counter formula solves the burst-at-boundary problem of fixed windows without the memory cost of sliding window logs',
      'Per-request Redis calls are the biggest performance risk — local counters with periodic sync is the production approach',
      'Rate limiting at the API gateway means you protect even before business logic runs — fail fast and cheap',
    ],
    explanation:
      'The hardest part of distributed rate limiting is not the algorithm — it is maintaining accuracy across multiple servers without adding too much latency. The local counter + periodic Redis sync pattern is how production rate limiters at companies like Cloudflare and Stripe work: accept a small inaccuracy margin in exchange for dramatically better performance. The sliding window counter formula elegantly avoids the edge-case burst problem of fixed windows without the memory overhead of storing individual request timestamps.',
    tags: ['rate-limiting', 'Redis', 'distributed-systems', 'API-gateway', 'token-bucket'],
  },
  {
    id: 'design-key-value-store',
    slug: 'design-key-value-store',
    title: 'Design a Key-Value Store',
    description:
      'Design a distributed key-value store like Redis or DynamoDB. It must support GET(key), SET(key, value), DELETE(key), and support 1 million operations per second. Data must survive server restarts. The store must remain available if up to one-third of servers fail.',
    difficulty: 'intermediate',
    topic: 'Distributed Systems',
    starterCode: `// Distributed Key-Value Store Design

// CORE OPERATIONS
// GET(key) → value
// SET(key, value, ttl?)
// DELETE(key)

// CAPACITY & SCALE
// 1M operations/second
// Assume: 60% reads, 40% writes → 600K reads/second, 400K writes/second
// Data size: 10 TB total, ~100 bytes average value

// DATA DISTRIBUTION
// How do you distribute keys across multiple servers?
// Approach: ___
// Why not simple hash % N?: ___

// DATA REPLICATION
// How many copies of each key?
// Quorum: for N replicas, write quorum W, read quorum R
//   For strong consistency: W + R > N
//   For high availability: W = 1, R = 1 (but weak consistency)
// Choose N, W, R: ___

// HANDLING FAILURES
// Server dies with keys: what happens?
//   Reads: ___
//   Writes: ___
// What is "hinted handoff"?: ___

// CONFLICT RESOLUTION
// Two servers accept writes to the same key simultaneously
// How do you decide which value wins?
//   Approach A: Last Write Wins (timestamp)
//   Approach B: Vector Clocks
//   Approach C: Application-level resolution

// PERSISTENCE
// How does the store survive restarts?
//   Option A: Append-Only File (AOF) — log every write
//   Option B: Snapshots (RDB) — periodic full dumps
//   Recommended: ___`,
    solution: `// Key-Value Store — Complete Solution

// ARCHITECTURE
// Multiple nodes organized using consistent hashing
// Each key hashes to a position on the ring
// Assigned to the N=3 clockwise nodes (replication factor)
// This means each key has 3 copies on different servers

// DATA DISTRIBUTION: Consistent Hashing with Virtual Nodes
// Virtual nodes: each physical server has 150 virtual ring positions
// Benefit: even data distribution even when servers have different capacities
// When server added: only 1/N keys remap (no massive re-distribution)
// When server removed: its keys redistribute to next server on ring

// REPLICATION STRATEGY: N=3, W=2, R=2
// N=3: 3 copies of every key
// W=2: write must be confirmed by 2 replicas (quorum write)
// R=2: read must consult 2 replicas (quorum read)
// W+R=4 > N=3: strong consistency guaranteed
// Can tolerate 1 replica failure and still serve consistent data

// WRITE PATH
// 1. Client sends SET(key, value) to any node (coordinator)
// 2. Coordinator determines responsible nodes via consistent hash ring
// 3. Coordinator sends write to all N=3 nodes in parallel
// 4. Wait for W=2 acknowledgments
// 5. Return success to client
// 6. Third replica gets write asynchronously (if it was slow)

// READ PATH
// 1. Client sends GET(key) to any node (coordinator)
// 2. Coordinator sends read to R=2 responsible nodes in parallel
// 3. Compare responses — if they agree, return value
// 4. If they disagree (one is stale): return newest value + trigger repair
// Read repair: coordinator writes newest value back to stale node

// HANDLING NODE FAILURES
// If a replica is down during write:
//   Use "hinted handoff": write to an alternate node temporarily
//   Store hint: "this data belongs to node X, deliver when it recovers"
//   When node X recovers, alt node delivers the queued hints
// This maintains W=2 availability even during partial failures

// CONFLICT RESOLUTION: Vector Clocks
// Each write carries a vector clock: {nodeA: 3, nodeB: 1}
// On concurrent writes to same key from different nodes:
//   Vector clock comparison detects conflict (neither dominates)
//   Store both versions → return conflict to client → client resolves
// Simpler alternative: Last Write Wins (LWW) using synchronized timestamps
//   Acceptable when occasional data loss is tolerable

// PERSISTENCE
// Hybrid approach (like Redis):
// AOF (Append-Only File): log every write command to disk
//   Recovery: replay AOF to rebuild state
//   Downside: large file, slow recovery
// Snapshot (RDB): periodic point-in-time dump of all data
//   Recovery: load snapshot, then replay AOF entries since snapshot
//   Best of both: fast recovery + no data loss

// GOSSIP PROTOCOL
// Nodes learn about each other's state via gossip
// Every second, each node shares its state with 3 random nodes
// Within log(N) rounds, all nodes know the full cluster state
// No central coordinator needed — scales to thousands of nodes`,
    hints: [
      'Consistent hashing is the foundation — understand why normal modulo hashing fails before explaining why consistent hashing is needed',
      'The W+R > N formula is the key to understanding quorum reads and writes — memorize it and know what happens when you relax it',
      'Hinted handoff is how the system maintains write availability even when a replica is down — it is what prevents data loss during partial outages',
    ],
    explanation:
      'A distributed key-value store is one of the foundational systems designs — DynamoDB, Cassandra, and Riak are all variations of this pattern. The three key decisions are: (1) consistent hashing for data distribution (solves the reshuffling problem), (2) quorum reads/writes for tunable consistency (W+R > N = strong, W+R ≤ N = eventual), and (3) hinted handoff for availability during failures. Understanding these mechanisms deeply gives you the mental model to reason about any distributed storage system.',
    tags: ['distributed-systems', 'consistent-hashing', 'replication', 'quorum', 'NoSQL', 'CAP'],
  },
  {
    id: 'design-notification-system',
    slug: 'design-notification-system',
    title: 'Design a Notification System',
    description:
      'Design a notification system that delivers push notifications, emails, and SMS messages to 10 million users. The system must handle 100 million notifications per day, support two priority tiers (transactional notifications must deliver within 5 seconds; marketing may deliver within 1 hour), and respect user preferences including opt-outs and quiet hours.',
    difficulty: 'intermediate',
    topic: 'Messaging',
    starterCode: `// Notification System Design

// SCALE
// 100M notifications/day = ___ /second average
// Peak assumption (10x average) = ___ /second

// CHANNELS
// Push: FCM (Android), APNs (iOS)
// Email: SendGrid / AWS SES
// SMS: Twilio
// Each channel has different rate limits and failure rates

// PRIORITY TIERS
// Transactional: OTP codes, payment confirmations, security alerts
//   SLA: deliver within 5 seconds
//   Retry: aggressive (5 attempts)
// Marketing: promotions, newsletters
//   SLA: deliver within 1 hour
//   Retry: lenient (2 attempts)
// Question: How do you ensure transactional is never delayed by marketing?
// Answer: ___

// QUEUE ARCHITECTURE
// Option A: Single queue with priority field
//   Problem: ___
// Option B: Separate queues per priority tier
//   Benefit: ___

// IDEMPOTENCY (preventing duplicate sends)
// Problem: worker sends notification, crashes before marking as sent, retry sends again
// Solution: ___

// DELIVERY TRACKING
// What state does each notification go through?
//   pending → ___ → ___ → ___
// Storage for notification records: ___ because ___

// USER PREFERENCES
// Where do you check quiet hours?
//   Before queuing? After queuing? Before sending?
// For transactional: ignore quiet hours (OTP must be sent)
// For marketing: ___`,
    solution: `// Notification System — Complete Solution

// CAPACITY
// 100M/day ÷ 86,400 = 1,157/second average
// Peak (10x): 11,570/second
// 1,157/second × 86,400 = 100M notifications processed daily

// QUEUE ARCHITECTURE: Separate Kafka Topics Per Priority
// notifications.transactional → dedicated consumer group, highest priority
// notifications.marketing → separate consumer group, rate-limited

// Why separate topics, not priority flags?
// A single topic with priority markers still serializes all messages
// A separate topic means transactional consumers NEVER wait behind marketing

// DATA FLOW
// 1. Source service (auth, payments) publishes notification request
// 2. Notification API validates and routes to correct Kafka topic
// 3. Channel Workers consume from topics:
//    PushWorker: reads transactional + marketing queues, calls FCM/APNs
//    EmailWorker: reads transactional + marketing queues, calls SendGrid
//    SMSWorker: reads transactional + marketing queues, calls Twilio

// WORKER DESIGN
async function processNotification(notification: any, provider: any, db: any): Promise<void> {
  // Step 1: Check if already processed (idempotency)
  const existing = await db.notifications.findOne({
    where: { id: notification.id, status: ['sent', 'failed'] }
  });
  if (existing) return; // already processed, skip

  // Step 2: Claim the notification (mark as processing)
  await db.notifications.update({
    status: 'processing',
    processingStartedAt: new Date(),
    workerId: process.env.WORKER_ID
  }, { where: { id: notification.id, status: 'pending' } });

  // Step 3: Check user preferences
  const prefs = await getUserPreferences(notification.userId);
  if (notification.type === 'marketing') {
    if (!prefs.marketingEnabled) return; // opted out
    if (isInQuietHours(prefs.quietHoursStart, prefs.quietHoursEnd)) {
      // Re-schedule for after quiet hours
      await requeueAfterQuietHours(notification, prefs.quietHoursEnd);
      return;
    }
  }
  // Transactional: ignore quiet hours entirely

  // Step 4: Send with provider idempotency key
  try {
    await provider.send({
      ...notification,
      idempotencyKey: notification.id // provider rejects duplicates with same key
    });
    await db.notifications.update({ status: 'sent', sentAt: new Date() },
      { where: { id: notification.id } });
  } catch (err) {
    const retryCount = notification.retryCount + 1;
    const maxRetries = notification.priority === 'transactional' ? 5 : 2;
    if (retryCount >= maxRetries) {
      await db.notifications.update({ status: 'failed' }, { where: { id: notification.id } });
    } else {
      await requeueWithBackoff(notification, retryCount);
    }
  }
}

// DELIVERY TRACKING SCHEMA (Cassandra)
// Table: notifications
//   Partition key: user_id (query: "all notifications for user X")
//   Clustering key: created_at DESC (most recent first)
//   Columns: id, type, channel, priority, status, template_id, sent_at, delivered_at, error

// PROVIDER RATE LIMITING (Redis sliding window per provider)
async function checkProviderRateLimit(provider: string, redis: any): Promise<boolean> {
  const key = \`ratelimit:\${provider}:\${Math.floor(Date.now() / 1000)}\`; // per second
  const count = await redis.incr(key);
  await redis.expire(key, 2);
  const limits: Record<string, number> = { twilio: 100, sendgrid: 1000, fcm: 500 };
  return count > (limits[provider] || 100);
}`,
    hints: [
      'Separate Kafka topics (not priority flags on one topic) is the correct solution for priority isolation — a high-marketing-volume day must never delay OTPs',
      'The idempotency check must happen before the send, not after — use a database lock or INSERT ... ON CONFLICT to handle concurrent workers claiming the same notification',
      'Transactional notifications bypass quiet hours — hard-code this business rule, not a configuration',
    ],
    explanation:
      'The notification system is a classic producer-consumer problem made complex by priority isolation, idempotency, provider rate limits, and user preferences. The critical insight is that priority isolation requires infrastructure separation (different Kafka topics with different consumer groups), not application-level sorting. Idempotency requires claiming the notification before sending (not after), so crashes during sending are handled by the lock timeout rather than creating duplicates.',
    tags: ['messaging', 'Kafka', 'idempotency', 'rate-limiting', 'push-notifications', 'async'],
  },
  {
    id: 'design-chat-application',
    slug: 'design-chat-application',
    title: 'Design a Chat Application',
    description:
      'Design a real-time chat system like WhatsApp or Slack. It must support one-on-one and group messaging (up to 256 members), handle 50 million daily active users sending 20 messages per user per day, deliver messages in under 500ms when both users are online, store message history indefinitely, and implement read receipts (sent, delivered, read).',
    difficulty: 'intermediate',
    topic: 'Real-time Systems',
    starterCode: `// Chat Application Design

// SCALE
// 50M DAU × 20 messages/day = ___ messages/day = ___ messages/second
// Average message: 200 bytes text + metadata

// REAL-TIME CONNECTION
// Why not HTTP polling for real-time chat?: ___
// Why WebSockets?: ___
// How many WebSocket connections per server?: ___
// How many servers needed?: ___

// HOW MESSAGES ARE DELIVERED (both users online)
// 1. Sender sends message to Server A (their connection server)
// 2. Server A needs to find which server recipient is connected to → ___
// 3. Server A forwards to Server B
// 4. Server B delivers to recipient via WebSocket

// HOW MESSAGES ARE DELIVERED (recipient offline)
// 1. Sender sends message → stored in ___
// 2. When recipient reconnects → ___

// READ RECEIPTS
// Single tick (sent): ___
// Double tick (delivered): ___
// Blue tick (read): ___
// Where is receipt state stored?: ___

// GROUP MESSAGING CHALLENGE
// Message sent to group of 256 → 256 deliveries
// 11,574 messages/second × 256 = ___ deliveries/second
// Is this a problem? If so, how to solve?: ___

// DATABASE FOR MESSAGES
// Access pattern: "give me last 50 messages in conversation X, ordered by time"
// Why Cassandra and not PostgreSQL?: ___`,
    solution: `// Chat Application — Complete Solution

// SCALE
// 50M × 20 = 1B messages/day ÷ 86,400 = 11,574 messages/second
// 11,574 × 200 bytes = 2.3 MB/second text data
// Storage: 200 GB/day text only + media in object storage

// REAL-TIME CONNECTIONS: WebSockets
// WebSocket: persistent bidirectional connection over TCP
// Alternative (HTTP long polling): inefficient, 50M users × polling = massive overhead
// Each connection server handles ~10,000 WebSocket connections
// 50M concurrent connections (assume 10% online simultaneously = 5M) ÷ 10K = 500 servers

// SERVICE DISCOVERY LAYER
// When Server A needs to forward to Server B, it needs to know which server Bob is on
// Solution: Redis hash — {userId: serverHostname}
// On connect: redis.hset("user_connections", userId, serverA_hostname)
// On disconnect: redis.hdel("user_connections", userId)
// Server A looks up Bob's server in Redis → forwards message

// MESSAGE DELIVERY FLOW (online)
// Sender → WebSocket → Connection Server A
//   → Redis lookup (which server is recipient on?)
//   → Connection Server B → WebSocket → Recipient
//   → Recipient ACKs → Server B notifies Server A → shows delivered tick

// MESSAGE DELIVERY FLOW (offline)
// Sender → Connection Server A → sees recipient offline
//   → Store message in Cassandra (messages table)
//   → Store in Redis pending queue for recipient: LPUSH pending:{recipientId} messageId
// On recipient reconnect:
//   → Fetch from Redis pending queue → deliver all pending messages
//   → Messages sorted by timestamp (Cassandra clustering key)

// DATABASE: Cassandra
// Table: messages
//   Partition key: conversation_id (all messages for a conversation co-located on same node)
//   Clustering key: message_id (ULID — time-sortable, globally unique)
//   Columns: sender_id, content_encrypted, media_url, created_at
//
// Query: "last 50 messages in conversation X"
//   → Single partition lookup, O(log N) → sub-millisecond
// Why not PostgreSQL: at 11,574 writes/second, Cassandra scales horizontally
//   PostgreSQL needs aggressive sharding and still struggles with write throughput

// READ RECEIPTS
// Single tick: connection server ACKs receipt of message (server received it)
// Double tick: recipient's device sends ACK via WebSocket on delivery
// Blue tick: client sends "read" event when user opens conversation
//
// Receipt storage: Redis hash per message
//   HSET receipt:{messageId} {userId} {status}:{timestamp}
//   Status: "sent" | "delivered" | "read"

// GROUP MESSAGING
// 256 members × 11,574 messages/second = 2.96M deliveries/second
// Manageable across 500+ connection servers (5,920 per server)
// Optimization: batch deliveries to same server (multiple members on same server)
// For massive groups (broadcast channels): Pub/Sub model (Redis PUBLISH)

// END-TO-END ENCRYPTION
// Signal Protocol: each user has public/private keypair on device only
// Messages encrypted with recipient's public key before leaving sender's device
// Server stores only encrypted blobs — cannot decrypt content`,
    hints: [
      'The service discovery layer (Redis hash of userId → serverHostname) is what enables routing between connection servers — without it, messages cannot be forwarded',
      'Cassandra partition key choice is critical: use conversationId so all messages for a conversation are co-located on one node (fast range queries)',
      'Read receipts require the receiver to actively send acknowledgment events — think about which direction each WebSocket message flows',
    ],
    explanation:
      "Chat is one of the most common system design questions and tests knowledge of WebSockets, service discovery, message persistence, and real-time state management. The key insight is that messages need TWO paths: real-time delivery via WebSocket forwarding (for online users) and durable storage via Cassandra (for offline users). The service discovery layer (Redis mapping userId to server) is what makes WebSocket forwarding work at scale — without it, you'd need every server to handle every user's messages.",
    tags: ['WebSockets', 'real-time', 'Cassandra', 'Redis', 'service-discovery', 'encryption'],
  },
  {
    id: 'design-video-streaming',
    slug: 'design-video-streaming',
    title: 'Design a Video Streaming Service',
    description:
      'Design a video streaming service like Netflix or YouTube. The system must support 200 million subscribers, allow creators to upload videos up to 4K resolution, stream to 50 million simultaneous viewers at peak, support adaptive bitrate streaming (automatically adjust quality to network speed), and start playback within 2 seconds of pressing play.',
    difficulty: 'advanced',
    topic: 'CDN & Media',
    starterCode: `// Video Streaming Service Design

// SCALE
// 200M subscribers, 50M simultaneous viewers at peak
// Each stream: average 5 Mbps → total bandwidth = ___ Tbps

// UPLOAD PIPELINE
// Creator uploads raw 4K video file (could be 100+ GB)
// Problem: how do you reliably upload 100 GB over the internet?
// Solution: ___

// TRANSCODING PIPELINE
// Why can't you just serve the original upload?
// What formats are needed?: ___
// How many output files per video?: ___
// How do you parallelize transcoding for a 2-hour movie?: ___

// CDN STRATEGY
// At 230 Tbps, can a single data center serve this?
// Netflix's Open Connect approach: ___
// How do you decide what content to pre-push to edge servers?: ___

// ADAPTIVE BITRATE STREAMING
// What is HLS or DASH?: ___
// How does the player choose quality?: ___
// Segment size: ___

// VIDEO STORAGE
// Original files: stored in ___
// Transcoded segments: stored in ___
// Metadata (title, duration, etc.): stored in ___
// Viewing history: stored in ___ because ___

// PLAYBACK FLOW
// User clicks play:
// 1. ___ → fetch video metadata
// 2. ___ → get CDN URL for video segments
// 3. ___ → download first few segments
// 4. Player begins playback while background downloading continues`,
    solution: `// Video Streaming — Complete Solution

// SCALE
// 50M streams × 5 Mbps = 250 Tbps at peak
// No single data center can serve 250 Tbps — requires global CDN

// UPLOAD PIPELINE: Chunked Resumable Upload
// Split file into 5-25 MB chunks
// Upload each chunk independently with retry on failure
// Server reassembles chunks after all confirmed
// If connection drops at 99%: resume from last successful chunk
// Protocol: TUS (resumable upload protocol) or custom HTTP with range headers

// TRANSCODING PIPELINE
// Input: raw video (e.g., 4K ProRes from creator)
// Outputs needed:
//   Resolutions: 240p, 360p, 480p, 720p, 1080p, 4K
//   Codecs: H.264 (compatibility), H.265/HEVC (efficiency), AV1 (best compression)
//   Audio: stereo, 5.1, Dolby Atmos
//   Subtitles: embedded + WebVTT per language
//   Total: ~300-1200 output files per video

// PARALLELIZED TRANSCODING
// Divide 2-hour video into 10-second segments → 720 segments
// Each segment transcoded independently by separate worker
// Outputs: 720 × 12 qualities = 8,640 files → assembled into DASH/HLS manifest
// Full parallelization: 2-hour video transcoded in ~5-10 minutes at scale

// CDN STRATEGY: Netflix Open Connect approach
// Problem: serving from origin data center means transatlantic latency for most users
// Solution: place cache servers INSIDE ISPs globally
//   - ISP in Tokyo has Netflix cache servers in their data center
//   - User in Tokyo fetches video from local ISP server → 1-5ms latency
//   - Off-peak hours: pre-push most popular content to edge servers
//   - Popularity-based: top 10,000 titles cover 80%+ of streaming demand

// ADAPTIVE BITRATE STREAMING (ABR)
// HLS (HTTP Live Streaming) / MPEG-DASH
// Video split into 2-10 second segments per quality level
// Manifest file (m3u8/MPD) lists all segment URLs per quality
// Player downloads at best quality for available bandwidth:
//   - Measure download speed of last 3 segments
//   - If speed drops: switch to lower quality segment URL
//   - If speed improves: switch to higher quality
// This is why Netflix can switch from 4K to 720p seamlessly mid-video

// STORAGE ARCHITECTURE
// Original uploads: object storage (S3/GCS) — immutable, long-term
// Transcoded segments: object storage (S3/GCS) → cached by CDN
// Video metadata: Spanner or MySQL (title, description, duration, creator)
// Viewing history: Cassandra
//   Partition key: user_id, Clustering key: watch_timestamp DESC
//   Write-heavy (every user, every session), time-series → Cassandra is ideal
// Search index: Elasticsearch (full-text search of titles, descriptions, tags)
// Recommendations: batch ML → Bigtable/DynamoDB for pre-computed results

// PLAYBACK FLOW (2-second start time)
// 1. User clicks play → API call for video metadata (CDN-cached)
// 2. API returns manifest URL (CDN URL of .m3u8 or .mpd file)
// 3. Player fetches manifest from CDN edge → list of segment URLs per quality
// 4. Player fetches first 2-4 segments (10-20 seconds of video) from CDN edge
// 5. Playback begins (~500ms from manifest fetch) while background buffering continues
// 6. Player continuously adjusts quality based on measured throughput`,
    hints: [
      'The transcoding pipeline is the most interesting design problem — think about how to parallelize a 2-hour video across hundreds of machines simultaneously',
      'Adaptive bitrate streaming (HLS/DASH) is the reason streaming quality adjusts automatically — design for the manifest + segment URL structure',
      "Netflix's Open Connect (CDN inside ISPs) is the key to serving 250 Tbps — no traditional CDN could handle this at acceptable cost",
    ],
    explanation:
      "Video streaming is a masterclass in separating the write path (upload + transcode) from the read path (streaming). The transcoding pipeline is what makes video streaming complex: one source file becomes hundreds of output files across multiple resolutions and codecs. CDN is not optional at Netflix-scale — it is the primary architecture decision. The ABR algorithm (quality switching based on measured download speed) is what makes streaming feel seamless even on variable-quality connections.",
    tags: ['CDN', 'video-streaming', 'transcoding', 'HLS', 'adaptive-bitrate', 'object-storage'],
  },
  {
    id: 'design-ride-sharing',
    slug: 'design-ride-sharing',
    title: 'Design a Ride Sharing Platform',
    description:
      'Design a ride-sharing platform like Uber or Lyft. The system must support 5 million active drivers updating their GPS location every 4 seconds, match riders to drivers in under 1 second, support real-time trip tracking for both riders and drivers, implement surge pricing based on local supply/demand, and handle 25 million trips per day.',
    difficulty: 'advanced',
    topic: 'Geospatial Systems',
    starterCode: `// Ride Sharing Platform Design

// SCALE
// 5M drivers × location update every 4 seconds = ___ location writes/second
// 25M trips/day = ___ trips/second peak
// This is a very write-heavy system

// DRIVER LOCATION UPDATES
// 5M drivers × 1 update/4 seconds = ___ writes/second
// Database options for live location:
//   PostgreSQL with PostGIS?: ___
//   Redis GEO commands?: ___
// Which is better and why?: ___

// GEOSPATIAL MATCHING
// Problem: find all available drivers within 2km of a rider's location
// Naive approach: scan all 5M drivers and calculate distance → O(N) → too slow
// Better approach: geohashing
//   What is geohashing?: ___
//   How does it help find nearby drivers?: ___

// MATCHING ALGORITHM
// Finding the nearest driver is not just about distance
// Other factors: ___
// How do you balance these factors?: ___

// TRIP LIFECYCLE
// States: requested → accepted → en_route → arrived → in_trip → completed
// When does the driver location need to update in real time for the RIDER to see?
//   State: ___
// How does the rider see the driver moving on the map?: ___

// SURGE PRICING
// Definition: price multiplier when demand > supply in a local area
// How do you calculate it per zone?: ___
// How often is surge recalculated?: ___
// Data needed: ___`,
    solution: `// Ride Sharing Platform — Complete Solution

// SCALE
// 5M drivers × 1 update/4 sec = 1.25M location writes/second (extremely write-heavy)
// 25M trips/day = 290 trips/second (manageable)

// DRIVER LOCATION: Redis GEO Commands
// Redis GEOADD: O(log N) insert/update of a geospatial member
// Redis GEORADIUS: O(N+log M) — find all members within X km

// Why not PostgreSQL with PostGIS?
// 1.25M writes/second would overwhelm any relational DB
// PostGIS spatial queries need indexes refreshed constantly
// Redis in-memory GEO operations: 1M+ operations/second easily

// Location update flow
async function updateDriverLocation(
  redis: any, driverId: string, lat: number, lng: number
): Promise<void> {
  await Promise.all([
    redis.geoadd('drivers:available', lng, lat, driverId), // GEO index
    redis.hset(\`driver:\${driverId}\`, { lat, lng, updatedAt: Date.now() }), // driver state
  ]);
}

// GEOHASHING FOR MATCHING
// World divided into grid cells using base32 string prefix
// Nearby locations share the same prefix
// Precision 6 = ~1.2km × 0.6km cells (good for ride matching radius)

async function findNearbyDrivers(
  redis: any, riderLat: number, riderLng: number, radiusKm: number
): Promise<{ driverId: string; distanceKm: number }[]> {
  const results = await redis.georadius(
    'drivers:available', riderLng, riderLat, radiusKm, 'km',
    'WITHCOORD', 'WITHDIST', 'ASC', 'COUNT', 20
  );
  return results.map(([driverId, dist]: [string, string]) => ({
    driverId,
    distanceKm: parseFloat(dist)
  }));
}

// MATCHING ALGORITHM (beyond just distance)
// Factors considered:
// 1. Distance/ETA (primary factor)
// 2. Driver heading (driver moving toward you = better than same distance moving away)
// 3. Driver acceptance rate (avoid dispatching to drivers who reject)
// 4. Vehicle type (UberX vs UberBlack)
// 5. Rider rating (drivers can decline low-rated riders)
// Implementation: score = f(ETA, heading_bonus, acceptance_rate) → sort → offer to top driver

// TRIP LIFECYCLE
// Stored in PostgreSQL (ACID required — billing, legal, analytics need accuracy)
// State machine: requested → driver_accepted → en_route → arrived → in_trip → completed
// During en_route and in_trip: driver app sends location every 4 seconds
//   Location stored in Redis (current position)
//   Pushed to rider via WebSocket

// REAL-TIME TRACKING FOR RIDER
// Rider and driver connected via WebSockets to tracking service
// Every driver location update: tracking service pushes to rider's WebSocket
// Rider sees driver moving on map in (near) real time (4-second update cycle)
// Location history: written asynchronously to Cassandra (time-series, not needed for real-time)

// SURGE PRICING
// World divided into geohash zones (precision 5 = ~5km × 5km)
// Every 60 seconds, a batch job calculates per-zone metrics:
//   pending_requests = COUNT(rides requested in zone in last 5 minutes)
//   available_drivers = COUNT(available drivers in zone from Redis GEO)
//   demand_ratio = pending_requests / available_drivers
//   surge = max(1.0, 1.0 + (demand_ratio - 1.0) * 0.5) // capped at 2.5x
// Result stored in Redis: SETEX surge:{geohash} 60 {multiplier}
// Every price quote checks this key → under 1ms lookup

// DATABASE SUMMARY
// Redis: live driver locations (GEO), surge prices, driver status, rider-driver matching state
// PostgreSQL: trips, users, payments, driver profiles (ACID required)
// Cassandra: trip location history, driver location history (write-heavy time-series)
// Kafka: location update event stream (enables analytics, billing, ETA model training)`,
    hints: [
      'Calculate location writes per second first: 5M drivers × every 4 seconds = 1.25M writes/second — this alone rules out any relational database as the primary location store',
      'Redis GEO commands (GEOADD, GEORADIUS) are purpose-built for this exact use case — they use geohashing internally and run in memory',
      'Surge pricing is a batch computation (every minute), not real-time — store the result in Redis with a 60-second TTL so every price quote is just a Redis GET',
    ],
    explanation:
      'Ride sharing is dominated by one scale problem: 1.25 million location writes per second from 5 million drivers. This single requirement drives the entire architecture toward Redis as the primary location store. Everything else (matching, surge pricing, trip tracking) is built on top of that Redis layer. The geospatial matching problem is elegantly solved by Redis GEO commands, which implement geohashing internally. Surge pricing is notably simple — it is a periodic batch job that writes results to Redis, not a complex real-time computation.',
    tags: ['geospatial', 'Redis', 'WebSockets', 'real-time', 'geohashing', 'location-tracking'],
  },
  {
    id: 'design-distributed-cache',
    slug: 'design-distributed-cache',
    title: 'Design a Distributed Cache',
    description:
      'Design a distributed in-memory cache like Memcached or Redis Cluster. It must support GET, SET, DELETE, and optional TTL. It must handle 1 million operations per second, distribute data across 10 nodes, remain available if up to 2 nodes fail, and add less than 1ms latency compared to direct database access.',
    difficulty: 'advanced',
    topic: 'Distributed Systems',
    starterCode: `// Distributed Cache Design

// OPERATIONS
// GET(key) → value | null
// SET(key, value, ttl?) → ok
// DELETE(key) → ok
// STATS() → hit rate, memory usage, key count

// DATA DISTRIBUTION ACROSS NODES
// Problem: you have 10 nodes. Which node stores key "user:12345"?
// Bad approach: node = hash(key) % 10
//   Why bad: ___
// Good approach: ___

// REPLICATION
// If a node goes down, the data on it is unavailable
// Options:
// A) No replication: data is lost on node failure (cache miss, DB must serve)
//    Acceptable because: ___
// B) Each key replicated to 2 nodes:
//    Write: ___
//    Read: ___
//    Failure: ___

// MEMORY MANAGEMENT
// Cache is bounded by available RAM
// When cache is full, you must evict something to store new data
// Eviction policies:
//   LRU: ___
//   LFU: ___
//   TTL: ___

// CLIENT-SIDE OPERATIONS
// How does a client know which node to connect to for a given key?
// Option A: client has copy of ring topology → routes directly
// Option B: any node routes the request to correct node (proxy model)
// Chosen: ___

// CONSISTENCY ON WRITE
// Client updates DB and needs to update cache
// Option A: invalidate cache key (delete it)
// Option B: update cache with new value
// Which is safer? Why?: ___`,
    solution: `// Distributed Cache — Complete Solution

// DATA DISTRIBUTION: Consistent Hashing with Virtual Nodes
// Ring: hash space [0, 2^32) arranged as a circle
// Each physical node gets 150 virtual positions on the ring
//   hash("node1-v1"), hash("node1-v2"), ... hash("node1-v150")
// Key placement: hash(key) → find next clockwise virtual node → that physical node
// On node addition: only keys between new node and its predecessor move → ~10% remap
// On node removal: its keys move to the next node → ~10% affected

class ConsistentHash {
  private ring: Map<number, string> = new Map();
  private sortedKeys: number[] = [];
  private virtualNodes = 150;

  addNode(nodeId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this.hash(\`\${nodeId}-v\${i}\`);
      this.ring.set(hash, nodeId);
      this.sortedKeys.push(hash);
    }
    this.sortedKeys.sort((a, b) => a - b);
  }

  getNode(key: string): string {
    if (this.sortedKeys.length === 0) throw new Error('No nodes');
    const hash = this.hash(key);
    // Find first ring position >= hash (clockwise)
    const idx = this.sortedKeys.findIndex(k => k >= hash);
    const ringPos = idx === -1 ? this.sortedKeys[0] : this.sortedKeys[idx];
    return this.ring.get(ringPos)!;
  }

  private hash(input: string): number {
    // MurmurHash3 or FNV-1a in production; simplified here
    let h = 5381;
    for (let i = 0; i < input.length; i++) h = (h * 33) ^ input.charCodeAt(i);
    return Math.abs(h);
  }
}

// REPLICATION STRATEGY
// For a cache (not a database), single-copy with graceful miss is acceptable:
//   Node failure → cache miss → DB serves request → repopulate cache when node recovers
//   Rationale: caches are designed to miss — the DB is the source of truth
//
// For higher availability: replicate each key to 2 nodes (primary + 1 replica)
//   Write: SET to primary first → async replicate to replica
//   Read: GET from primary → if primary down, GET from replica
//   This adds complexity but halves the miss rate during failures

// MEMORY MANAGEMENT: LRU + TTL hybrid
// LRU (Least Recently Used): O(1) implementation using doubly-linked list + HashMap
//   LinkedList: nodes ordered by recency (most recent at head)
//   HashMap: key → node pointer for O(1) access
//   On access: move node to head
//   On eviction: remove tail
// TTL: each entry has an expiry timestamp
//   Lazy eviction: check TTL on GET; if expired, delete and return miss
//   Active eviction: background thread periodically scans for expired entries (Redis approach)

// CLIENT TOPOLOGY
// Client-side routing: each client has the consistent hash ring
//   Client computes which node to contact directly → 0 extra hops
//   Trade-off: all clients must be updated when topology changes
// Implementation: clients fetch topology on startup + subscribe to changes (via Zookeeper or etcd)

// CACHE INVALIDATION ON WRITE
// Invalidate (delete) is SAFER than update:
//   Update race: 1) DB update, 2) cache update, 3) another request reads old DB value before step 1 propagated
//   This leaves a stale cache value with no TTL to expire it
// Invalidate pattern:
//   1. Update DB
//   2. DELETE cache key (not update)
//   3. Next read: cache miss → DB read → populate cache with fresh value
// Delete + TTL as fallback: if delete fails, TTL ensures staleness is bounded

// CACHE CLIENT WITH CONSISTENT HASHING
class DistributedCache {
  private ring = new ConsistentHash();
  private nodes: Map<string, any> = new Map(); // nodeId → connection

  constructor(nodeIds: string[]) {
    nodeIds.forEach(id => this.ring.addNode(id));
  }

  async get(key: string): Promise<string | null> {
    const nodeId = this.ring.getNode(key);
    const conn = this.nodes.get(nodeId);
    return conn.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const nodeId = this.ring.getNode(key);
    const conn = this.nodes.get(nodeId);
    await conn.set(key, value, ttlSeconds);
  }
}`,
    hints: [
      'The critical insight: a cache is OK to lose data on node failure (the DB is the source of truth), so replication is optional for availability — just let the DB serve the miss',
      'LRU requires O(1) both get and evict operations — only a doubly-linked list + hashmap combination achieves this',
      'Invalidate (delete) on write is safer than update because there is no race condition — the next read rebuilds from DB automatically',
    ],
    explanation:
      'The distributed cache design teaches the most important caching principle: caches are not the source of truth, so losing cached data on node failure is acceptable. This realization simplifies the design significantly — you do not need complex replication strategies like databases require. The consistent hashing implementation with virtual nodes is the core algorithm that every distributed caching system (Redis Cluster, Memcached) uses. The LRU eviction implementation (doubly-linked list + hashmap) is a classic coding interview problem that directly applies to cache design.',
    tags: ['consistent-hashing', 'LRU', 'distributed-systems', 'in-memory', 'eviction', 'cache-invalidation'],
  },
  {
    id: 'design-search-autocomplete',
    slug: 'design-search-autocomplete',
    title: 'Design Search Autocomplete',
    description:
      'Design a search autocomplete system like Google\'s "search as you type". It must return the top-10 most relevant completions for any prefix, respond in under 100ms, handle 10 million queries per second at peak (10% of Google-scale), and update suggestions based on query frequency.',
    difficulty: 'intermediate',
    topic: 'Data Structures & APIs',
    starterCode: `// Search Autocomplete Design

// REQUIREMENTS
// Input: prefix (e.g., "appl")
// Output: top-10 completions (e.g., ["apple", "apple watch", "apple store", ...])
// Latency: < 100ms
// Update frequency: suggestions based on aggregate query frequency (updated hourly)

// DATA STRUCTURE: TRIE
// What is a Trie?: ___
// How does it find completions for "appl"?
//   1. ___
//   2. ___
// How do you return the TOP-10 (not just any completions)?: ___

// SCALE PROBLEM
// At 10M queries/second, a single Trie in memory won't work
// Problem 1: Trie for all Google queries won't fit in one machine's RAM
//   Solution: ___
// Problem 2: 10M queries/second on one server
//   Solution: ___

// FREQUENCY UPDATES
// Frequency of each query changes over time (trending searches)
// If you rebuild the Trie on every search: ___
// Better approach: ___
// How often to update: ___

// CACHING LAYER
// What percentage of autocomplete queries are for the same popular prefixes?
// Cache what?: ___
// TTL: ___
// Cache invalidation: when does it need to update?

// API DESIGN
// GET /api/autocomplete?prefix={q}&limit={n}
// Response: { suggestions: string[], responseTimeMs: number }

// PERSONALIZATION (advanced)
// How would you show personalized suggestions based on user's search history?
// Where do you merge personal and global suggestions?: ___`,
    solution: `// Search Autocomplete — Complete Solution

// CORE DATA STRUCTURE: Trie with Frequency Scores
// Each node represents a character
// Each terminal node stores frequency score
// Finding top-10 for "appl": traverse to 'l' node, then DFS to find all completions,
//   return top-10 by frequency score

// TRIE NODE WITH TOP-K CACHE (optimization)
// Problem with basic Trie: finding top-10 requires DFS of entire subtree — expensive
// Optimization: each Trie node caches its own top-10 completions
//   Cost: more memory, more complex updates
//   Benefit: GET(prefix) → O(prefix_length) instead of O(subtree_size)

interface TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  frequency: number;
  topSuggestions: Array<{ word: string; frequency: number }>; // cached top-10
}

// AT SCALE: Prefix Sharding
// Single Trie for all queries doesn't fit in RAM on one server
// Solution: shard by prefix
//   Queries starting with 'a' → Shard 1
//   Queries starting with 'b' → Shard 2
//   ...
//   More granular: "aa"-"az" → Shard A, "ba"-"bz" → Shard B
// Each shard handles queries for its prefix range
// Client routes query to correct shard based on first 1-2 characters

// FULL ARCHITECTURE
// Client types "appl":
// 1. Client-side debounce: wait 100ms after keypress before querying (reduces requests)
// 2. API Gateway routes GET /autocomplete?q=appl to prefix shard for "ap"
// 3. Shard checks Redis cache: SMEMBERS autocomplete:appl → cache hit → return immediately
// 4. Cache miss: query in-memory Trie → return top-10 → cache in Redis (TTL: 1 hour)

// REDIS SORTED SETS ALTERNATIVE TO TRIE
// For simpler implementation at moderate scale:
// ZADD search_completions {frequency} "{query}"
// For prefix search: ZREVRANGEBYLEX search_completions "[appl" "[applz" LIMIT 0 10
// Advantage: simpler to update frequency scores, no Trie management
// Disadvantage: O(log N + k) per query, less memory-efficient than Trie for large vocabularies

// FREQUENCY UPDATES (Batch Approach — recommended)
// Problem: rebuilding Trie on every query = too expensive
// Solution: batch updates
//   Kafka: every search query published as an event
//   Spark batch job (hourly): aggregate query counts from Kafka → compute new frequencies
//   Rebuild Trie hourly with updated frequencies
//   Blue-green deployment: build new Trie in background, swap atomically
// Why hourly (not real-time): search trends don't change second-to-second
//   Exception: breaking news. For trending terms, a faster pipeline (10-min updates) is needed

// CACHING STRATEGY
// ~90% of all queries are for the same popular prefixes ("app", "goo", "you")
// Cache hit for popular prefixes: Redis stores top-10 suggestions per prefix string
// Key: autocomplete:{prefix}
// Value: JSON array of top-10 suggestions
// TTL: 1 hour (aligned with hourly Trie rebuild)
// Memory: 10M unique prefixes × 500 bytes = 5 GB Redis (manageable)
// Cache hit rate: ~95%+ for top prefixes

// PERSONALIZATION
// User types "jav" and has recently searched Java, JavaScript, Jakarta
// Merge personal history with global suggestions:
//   global_top10 = cache lookup for "jav"
//   personal_recent = fetch from user's search history store (Redis sorted set per user)
//   merged = interleave personal (with boost) + global → deduplicate → return top-10
// Personal suggestions stored in: Redis sorted set "user_searches:{userId}"
//   Score = search timestamp (recent searches rank higher)
//   ZREVRANGEBYSCORE to fetch recent searches matching prefix

// CLIENT OPTIMIZATION
// Debounce: wait 100-300ms after each keypress before querying
// Pre-fetch: when user types "a", pre-fetch results for "ap" in background
// Result: by the time user has typed "ap", result is already in browser cache`,
    hints: [
      'Caching is the most impactful optimization: the top 1000 prefixes account for a huge fraction of all autocomplete queries — cache them aggressively',
      'Batch frequency updates (hourly Spark job) is better than real-time for most autocomplete use cases — trends change slowly except for breaking news',
      'Client-side debounce (wait 100-300ms after typing before querying) dramatically reduces server load without hurting user experience',
    ],
    explanation:
      "Search autocomplete is a data structure problem masquerading as a systems design problem. The Trie is the core data structure, but the systems challenge is: how do you serve 10M queries/second from Tries that are too large for one server? The answer is prefix sharding + Redis caching. The frequency update problem is equally important: real-time updates are expensive; hourly batch recomputation covers 99% of use cases and is operationally simple.",
    tags: ['trie', 'prefix-search', 'Redis', 'caching', 'sharding', 'debounce', 'autocomplete'],
  },
  {
    id: 'design-news-feed',
    slug: 'design-news-feed',
    title: 'Design a News Feed',
    description:
      'Design the news feed system for a social network like Facebook or Instagram. The feed must show the most relevant and recent posts from accounts the user follows. The system must handle 500 million daily active users, 100 million posts per day, and return a personalized feed in under 2 seconds. It must also handle the "celebrity problem" where some accounts have 100+ million followers.',
    difficulty: 'advanced',
    topic: 'Feed Generation',
    starterCode: `// News Feed Design

// SCALE
// 500M DAU, each refreshes feed 5x/day = ___ feed reads/day = ___ reads/second
// 100M posts/day = ___ posts/second (writes)
// Read:write ratio = ___:1

// OPTION A: FAN-OUT ON WRITE
// When Alice posts: immediately write her post to all followers' feed tables
// Process: ___
// Read time: O(1) — pre-computed
// Write cost for normal user (1000 followers): ___
// Write cost for celebrity (100M followers): ___
// Celebrity problem: ___

// OPTION B: FAN-OUT ON READ (PULL MODEL)
// When Bob loads feed: query all accounts Bob follows, get recent posts, merge + sort
// Process: ___
// Read time: ___
// Write cost: ___
// Problem for user following 10,000 accounts: ___

// OPTION C: HYBRID MODEL
// Combine both based on account size
// For regular users: ___
// For celebrities: ___
// Threshold: ___

// FEED STORAGE
// What does a feed "entry" look like?: ___
// Where is it stored?: ___
// Why not just store full post content in the feed?: ___

// RANKING
// Simple approach: most recent first (chronological)
// Advanced: machine learning-based ranking
//   Signals: ___
//   Where is ranking computed?: ___

// PAGINATION
// GET /api/feed?userId=X&cursor=___&limit=20
// Why cursor-based and not offset-based?: ___`,
    solution: `// News Feed — Complete Solution

// SCALE
// 500M × 5 = 2.5B feed reads/day ÷ 86,400 = 28,935 reads/second
// 100M posts/day ÷ 86,400 = 1,157 writes/second
// Read:write ratio = 25:1 → read-heavy → optimize reads with pre-computation

// CHOSEN APPROACH: Hybrid Fan-Out
// Regular users (< 1M followers): Fan-Out on Write
//   Post → Fanout Service writes postId to all follower feed tables
//   Feed read: SELECT postIds FROM user_feed WHERE userId = X ORDER BY score DESC LIMIT 20
//   Then: fetch post details for those postIds from post cache
// Celebrities (> 1M followers): Fan-Out on Read
//   Post stored in celebrity_posts table only
//   When user loads feed: get pre-computed feed + query celebrity posts on-the-fly

// WHY SEPARATE CELEBRITIES
// Ariana Grande has 400M followers. She posts → 400M writes. Takes hours. Unacceptable.
// Solution: don't fan-out celebrity posts. Inject them at read time.
// Mixed feed generation (every feed request):
//   regular_feed = Redis.get("feed:{userId}") → pre-computed, instant
//   celebrity_posts = for each celebrity followed by user, fetch their last 3 posts
//   merged = merge + sort by score → return top-20

// DATA STORAGE
// Feed entries (post IDs + scores): Redis Sorted Set per user
//   Key: feed:{userId}
//   Score: timestamp or ML ranking score (higher = more recent/relevant)
//   Value: postId (not full post content — content fetched separately)
//   Max entries: 800 per user (limit Redis memory usage)
//   ZREVRANGE feed:{userId} 0 19 → top 20 entries by score

// Why store only postIds (not full content) in the feed?
// Content changes (edits) would require updating millions of feed entries
// Content can be large (photos, text) — storing in Redis is expensive
// Post content fetched from separate post store (Cassandra or cache)

// POST STORAGE
// Posts: Cassandra
//   Partition key: post_id
//   Why Cassandra: 1,157 writes/second, post_id lookups are key-value
// Post cache: Redis with post_id → post content
//   Cache hit rate goal: 95%+ (popular posts cached, long-tail from Cassandra)

// FANOUT SERVICE (async)
async function fanoutPost(postId: string, authorId: string, db: any, redis: any): Promise<void> {
  const author = await db.users.findOne({ id: authorId });
  if (author.followerCount > 1_000_000) {
    // Celebrity: write to celebrity_posts table only, fan-out on read
    await db.celebrity_posts.insert({ authorId, postId, createdAt: Date.now() });
    return;
  }

  // Regular user: fan-out to all followers' Redis feed sorted sets
  const followers = await db.follows.getFollowers(authorId);
  const score = Date.now(); // or ML score

  // Batch Redis operations using pipeline
  const pipeline = redis.pipeline();
  for (const followerId of followers) {
    pipeline.zadd(\`feed:\${followerId}\`, score, postId);
    pipeline.zremrangebyrank(\`feed:\${followerId}\`, 0, -801); // keep only 800 entries
  }
  await pipeline.exec();
}

// RANKING
// Simple: chronological (score = timestamp)
// ML ranking: predict engagement probability per post-user pair
//   Signals: likes on similar posts, time since post, relationship strength
//   Pre-computed: ML model runs hourly batch jobs, stores per-post scores
//   Real-time: apply user-specific multipliers at read time

// FEED READ API
async function getUserFeed(userId: string, cursor: string | null, limit: number, redis: any, db: any) {
  // Get regular feed from Redis (fan-out on write for regular accounts)
  const maxScore = cursor ? parseInt(cursor) : Date.now();
  const postIds = await redis.zrevrangebyscore(\`feed:\${userId}\`, maxScore, '-inf', 'LIMIT', 0, limit);

  // Inject celebrity posts on the fly
  const followedCelebrities = await db.celebrity_follows.get(userId);
  const celebPosts = await fetchRecentCelebPosts(followedCelebrities, maxScore);

  // Merge and sort
  const allPostIds = [...postIds, ...celebPosts.map(p => p.postId)];
  const posts = await fetchPostDetails(allPostIds, redis, db);
  const sorted = posts.sort((a, b) => b.score - a.score).slice(0, limit);

  return {
    posts: sorted,
    nextCursor: sorted.length > 0 ? String(sorted[sorted.length - 1].score) : null
  };
}`,
    hints: [
      'Always calculate the celebrity problem math: 400M followers × 1 post = 400M writes. At even 1,000 writes/second, this takes 111 hours. The math makes the hybrid approach obviously necessary.',
      'Store only postIds in the Redis feed sorted set (not full content) — content is large, changes, and is fetched separately from a post cache',
      'Cursor-based pagination uses the last post score as the cursor — this stays stable even when new posts are added, unlike offset pagination which shifts everything',
    ],
    explanation:
      "The news feed problem is the quintessential fan-out design problem. The hybrid approach (fan-out on write for regular users, fan-out on read for celebrities) is how Instagram and Twitter actually work. The key insight is that the celebrity threshold is not arbitrary — it is determined by how many writes per second your fanout service can handle. Storing only postIds in Redis (not full content) is a critical optimization that reduces memory usage and eliminates the need to update millions of feed entries when a post is edited.",
    tags: ['fan-out', 'Redis', 'Cassandra', 'social-feed', 'celebrity-problem', 'cursor-pagination'],
  },
  {
    id: 'design-payment-system',
    slug: 'design-payment-system',
    title: 'Design a Payment System',
    description:
      'Design a payment processing system that handles 10,000 transactions per second. It must be idempotent (retrying a payment never double-charges), support refunds, maintain a complete audit trail, and achieve 99.999% reliability. Security and data integrity are critical.',
    difficulty: 'advanced',
    topic: 'Databases & Transactions',
    starterCode: '// PAYMENT SYSTEM DESIGN\n\n// Core challenge: exactly-once processing\n// A user retries on network timeout — you must not charge twice\n\n// STEP 1: IDEMPOTENCY\n// What is an idempotency key? ___\n// Where does it come from? ___\n// Where do you store it? ___\n// How do you use it to prevent double-charging? ___\n\n// STEP 2: PAYMENT STATE MACHINE\n// States: initiated → ___ → ___ → completed/failed/refunded\n// Why a state machine? ___\n\n// STEP 3: CONSISTENCY CHOICE\n// SQL or NoSQL? ___ because ___\n// Why is eventual consistency NOT acceptable here? ___\n\n// STEP 4: GATEWAY INTEGRATION\n// Problem: network timeout after charging, before storing result\n// Solution: ___\n\n// STEP 5: AUDIT LOG\n// What must be logged? ___\n// Where to store logs? ___',
    solution: '// PAYMENT SYSTEM — SOLUTION\n\n// IDEMPOTENCY PATTERN\n// Client generates UUID per payment attempt (idempotency key)\n// Server stores: idempotency_key → result in DB BEFORE processing\n// On retry: check DB first, return cached result if found\n// Use: INSERT INTO idempotency_keys (key) VALUES ($1) ON CONFLICT DO NOTHING\n//       RETURNING key → 0 rows means duplicate, return cached result\n\n// STATE MACHINE: initiated → authorized → captured → completed\n//                                  ↓                      ↓\n//                              cancelled              refunded\n// Each state transition is atomic (single DB transaction)\n// No state is skipped — provides clear audit trail\n\n// DATABASE: PostgreSQL with ACID transactions\n// Tables: payments, idempotency_keys, audit_log, refunds\n// Why SQL: we need: transactions across tables, ACID, complex queries for auditing\n// Why NOT NoSQL: eventual consistency risks double-charging\n\n// GATEWAY TIMEOUT PROBLEM:\n// Charge gateway → timeout (did it charge?) → retry\n// Solution: Outbox pattern\n//   1. Write payment_intent + outbox_event in ONE DB transaction\n//   2. Separate poller reads outbox, calls gateway\n//   3. Marks outbox entry as processed\n//   4. If gateway returns "already charged" → idempotent, mark success\n\n// AUDIT LOG: append-only table, log every state change\n// Fields: payment_id, from_state, to_state, timestamp, actor, metadata',
    hints: [
      'The idempotency key is the single most important concept — explain it before anything else.',
      'The outbox pattern solves the "charged but timeout" problem — look this up if unfamiliar.',
      'Ask: what is the cost of charging twice vs the cost of not charging? That determines your consistency requirements.',
    ],
    explanation:
      'Payment systems are the canonical example of where eventual consistency is unacceptable. The idempotency key pattern is how every major payment processor (Stripe, Razorpay) prevents double charges — the key is generated by the client before any attempt and submitted with every retry. The outbox pattern solves the distributed transaction problem without a 2-phase commit.',
    tags: ['payments', 'idempotency', 'ACID', 'state-machine', 'outbox-pattern'],
  },
  {
    id: 'design-distributed-file-storage',
    slug: 'design-distributed-file-storage',
    title: 'Design Distributed File Storage',
    description:
      'Design a system like Google Drive or Dropbox. Users upload files of any size, share with others, edit collaboratively, and sync across devices. Handle 50 million users, 500 billion files, and 10 petabytes of storage.',
    difficulty: 'expert',
    topic: 'Distributed Systems & Storage',
    starterCode: '// DISTRIBUTED FILE STORAGE DESIGN\n\n// STEP 1: CHUNKING STRATEGY\n// Why chunk files? ___\n// Chunk size: choose between 1MB, 4MB, 64MB. Which and why? ___\n// How does chunking enable delta sync? ___\n\n// STEP 2: DEDUPLICATION\n// What is block-level deduplication? ___\n// How do you detect duplicate chunks? ___\n// Space savings estimate for a 10-person team sharing code repos? ___\n\n// STEP 3: METADATA STORAGE\n// What metadata is needed? ___\n// Why is metadata stored separately from file content? ___\n// Which database for metadata? ___\n\n// STEP 4: SYNC ALGORITHM\n// How does a client know which files changed? ___\n// How do you handle conflicts (same file edited on two devices offline)? ___\n\n// STEP 5: LARGE FILE UPLOADS\n// How do you handle a 10GB video upload? ___\n// What if the upload fails at 80%? ___',
    solution: '// DISTRIBUTED FILE STORAGE — SOLUTION\n\n// CHUNKING: Split every file into 4MB blocks\n// - Content-defined chunking: chunk boundaries based on content hash\n//   (different from fixed 4MB so similar files share more chunks)\n// - Each chunk identified by SHA-256 hash of its content\n// - Chunk list stored in metadata (ordered array of chunk hashes)\n\n// DEDUPLICATION:\n// - Before uploading, client hashes each chunk\n// - Client asks server: "do you already have chunk abc123?"\n// - Server says yes: skip upload, just reference existing chunk\n// - Result: two users with the same file = stored once\n// - Same concept at block level makes version history cheap\n\n// METADATA STORAGE (separate from content):\n// - PostgreSQL: file tree, permissions, version history, sharing settings\n// - Object storage (S3/GCS): actual chunk content, addressed by hash\n// - Why separate: metadata needs transactions, complex queries, ACL checks\n//   Content needs horizontal scale, cheap storage, CDN distribution\n\n// SYNC:\n// - Client maintains local database of file_path → (chunk_list, mtime)\n// - On reconnect: compare local DB with server metadata\n// - Only upload/download changed chunks (delta sync)\n// - Conflict resolution: last-write-wins (most implementations),\n//   or create conflict copy (Dropbox "conflicted copy" approach)\n\n// RESUMABLE UPLOADS:\n// - Client gets presigned upload URL per chunk\n// - Upload each chunk independently\n// - Server tracks which chunks received\n// - On failure: re-upload only missing chunks',
    hints: [
      'Content-defined chunking (CDC) is why Google Drive deduplication is so effective — explain it.',
      'The key insight: metadata (file tree, permissions) and content (bytes) have completely different storage needs.',
      'Delta sync is only possible because of chunking — without chunks you would re-upload the entire file on every change.',
    ],
    explanation:
      'The chunking + deduplication combination is the core insight of distributed file storage. By splitting files into content-addressed blocks and storing each block once regardless of how many files reference it, you achieve both efficient storage and cheap version history (a new version of a file only stores its changed blocks). Separating metadata from content is a universal principle in distributed storage systems.',
    tags: ['file-storage', 'chunking', 'deduplication', 'delta-sync', 'object-storage'],
  },
  {
    id: 'design-ecommerce-platform',
    slug: 'design-ecommerce-platform',
    title: 'Design an E-Commerce Platform',
    description:
      'Design an e-commerce platform like Amazon with product catalog, inventory management, cart, checkout, and order management. Handle 1 million DAU, flash sales with 100x normal traffic spikes, and zero tolerance for overselling.',
    difficulty: 'advanced',
    topic: 'System Design & Scalability',
    starterCode: '// E-COMMERCE PLATFORM DESIGN\n\n// STEP 1: FLASH SALE PROBLEM\n// 1000 items go on sale. 100,000 users hit "buy" simultaneously.\n// How do you prevent selling 2000 items when only 1000 exist?\n// Naive approach: check stock → decrement. Problem: ___\n// Better approach: ___\n\n// STEP 2: INVENTORY ARCHITECTURE\n// Where is inventory stored? ___\n// How do you make the check-and-decrement atomic? ___\n// When do you release a reserved item? ___\n\n// STEP 3: CART STORAGE\n// Cart belongs to: SQL or Redis or both? ___\n// What if user has items in cart, then logs in from another device? ___\n\n// STEP 4: SEARCH ARCHITECTURE\n// Can you use your main database for product search? ___\n// What technology handles full-text search with filters? ___\n\n// STEP 5: CHECKOUT FLOW\n// List the steps in order: ___\n// Which step is the critical section (only one customer wins)? ___',
    solution: '// E-COMMERCE — SOLUTION\n\n// FLASH SALE: ATOMIC INVENTORY DECREMENT\n// Problem: SELECT stock (100) → read (100) → UPDATE stock=99 is not atomic\n// Two users read 1 stock simultaneously → both decrement → oversell\n//\n// Solution 1 (DB): UPDATE inventory SET reserved = reserved + 1\n//   WHERE product_id = $1 AND (stock - reserved) >= $2\n//   → Atomic at DB level, returns 0 rows if out of stock\n//\n// Solution 2 (Redis): DECRBY stock:product:123 1\n//   → Redis single-threaded, atomic decrement, fast\n//   → Sync to DB async, but Redis is source of truth for availability\n//\n// For flash sales: pre-load inventory into Redis\n// Rate limit queue: accept only N requests per second into checkout\n\n// CART: Redis for active carts (fast reads/writes during browsing)\n// Persist to PostgreSQL on checkout (durable, transactional)\n// Anonymous cart: stored in Redis by session ID\n// On login: merge anonymous cart + user cart\n\n// SEARCH: ElasticSearch\n// Main DB (PostgreSQL) handles writes + simple lookups by ID\n// ElasticSearch handles: full-text search, faceted filters,\n//   autocomplete, relevance ranking\n// Sync: Kafka stream from PostgreSQL CDC → ElasticSearch indexer\n\n// CHECKOUT FLOW:\n// 1. Validate cart items exist and prices are current\n// 2. Reserve inventory (atomic decrement)\n// 3. Create order record (status: pending)\n// 4. Process payment (idempotent with idempotency key)\n// 5. Confirm inventory deduction (from reserved to sold)\n// 6. Update order status to confirmed\n// 7. Emit OrderConfirmed event → notifications, fulfillment, analytics',
    hints: [
      'The atomic inventory decrement is the key insight — SQL UPDATE with WHERE condition is atomic at the row level.',
      'Redis DECRBY is single-threaded and atomic — no locks needed at the application level.',
      'The checkout flow must handle the case where payment succeeds but confirmation fails — use idempotency.',
    ],
    explanation:
      'E-commerce system design centers on the inventory reservation problem. The naive check-then-decrement is a race condition at any scale. Database-level atomic UPDATE with stock check, or Redis atomic DECRBY, are the two production-proven solutions. Flash sales add the dimension of queue management — you cannot let 100,000 concurrent users all attempt atomic decrements simultaneously; rate limiting the checkout queue is how Amazon and Flipkart handle it.',
    tags: ['e-commerce', 'inventory', 'flash-sale', 'cart', 'elasticsearch', 'checkout'],
  },
  {
    id: 'design-recommendation-system',
    slug: 'design-recommendation-system',
    title: 'Design a Recommendation System',
    description:
      'Design a recommendation system like Netflix or Spotify that suggests content to users based on their history. The system must generate recommendations in < 100ms, handle 100M users, 10M items, and update recommendations as users interact.',
    difficulty: 'expert',
    topic: 'Machine Learning Systems & Caching',
    starterCode: '// RECOMMENDATION SYSTEM DESIGN\n\n// STEP 1: ALGORITHM CHOICE\n// Collaborative filtering: "users like you also liked"\n//   How it works: ___\n//   Cold-start problem: ___\n// Content-based filtering: "because you liked X"\n//   How it works: ___\n// Hybrid approach: ___\n\n// STEP 2: LATENCY REQUIREMENT\n// Recommendations must load in < 100ms\n// Can you run ML inference in < 100ms on every page load? ___\n// How do you pre-compute recommendations? ___\n\n// STEP 3: CANDIDATE GENERATION vs RANKING\n// Why not rank all 10M items for every user? ___\n// What is candidate generation? ___\n// What is the ranking stage? ___\n\n// STEP 4: FRESHNESS vs PERFORMANCE\n// Pre-computed recs are stale by the time user sees them\n// How do you inject real-time signals (just watched, just liked)? ___\n\n// STEP 5: STORAGE\n// Where to store pre-computed recommendations? ___\n// Where to store item embeddings? ___',
    solution: '// RECOMMENDATION SYSTEM — SOLUTION\n\n// TWO-STAGE PIPELINE:\n// Stage 1: Candidate Generation (offline, batch, ~hours)\n//   - Matrix factorization: represent users and items as embedding vectors\n//   - For each user, find 1000 nearest neighbor items by cosine similarity\n//   - Store: user_id → [item_id_1, item_id_2, ..., item_id_1000]\n//   - Tools: collaborative filtering (ALS), neural embeddings (Two-Tower model)\n//   Output: 1000 candidates per user, pre-computed\n//\n// Stage 2: Ranking (online, < 100ms)\n//   - Take 1000 candidates from cache\n//   - Run lightweight ML model to score each candidate\n//   - Inputs: user context (time, device, location), item freshness, diversity\n//   - Return top 20 ranked results\n\n// PRE-COMPUTATION STORAGE:\n// Candidate lists → Redis/DynamoDB: user:123:candidates → [item list]\n// Item embeddings → ANN index (FAISS, Pinecone, Weaviate) for similarity search\n// User embeddings → same ANN index\n\n// REAL-TIME SIGNAL INJECTION:\n// User just watched a movie → increment watch signal in Redis\n// Ranking stage reads recent signals alongside pre-computed candidates\n// Re-run ranking (fast, < 50ms) to re-score with fresh signals\n// This gives appearance of real-time without full ML inference on every request\n\n// COLD START:\n// New user: show popular content, genre preferences from onboarding\n// New item: content-based filtering using item features until enough interactions\n\n// FEEDBACK LOOP:\n// Log impressions + interactions to Kafka\n// Daily batch job retrains model on fresh data\n// Weekly A/B tests to compare model versions',
    hints: [
      'The two-stage pipeline (candidate generation + ranking) is how every major recommendation system works at scale.',
      '100ms is too fast for full ML inference on 10M items — pre-computation is non-negotiable.',
      'Embeddings + ANN (approximate nearest neighbor) search is the industry-standard approach for candidate generation.',
    ],
    explanation:
      'Recommendation systems at scale universally use the two-stage pipeline: expensive offline candidate generation followed by fast online ranking. The latency requirement makes any other approach impractical — you cannot run full model inference over 10M items in 100ms. The real-time signal injection pattern (reading recent interactions at ranking time) is how systems give the appearance of real-time recommendations while relying mostly on pre-computed candidate sets.',
    tags: ['recommendation', 'machine-learning', 'embeddings', 'two-stage', 'cold-start', 'A/B-testing'],
  },
  {
    id: 'design-realtime-analytics',
    slug: 'design-realtime-analytics',
    title: 'Design a Real-Time Analytics System',
    description:
      'Design a real-time analytics system that processes 1 million events per second (page views, clicks, purchases, errors) and serves dashboards with < 5 second data freshness. Support aggregations over time windows: last 5 minutes, last hour, last 24 hours.',
    difficulty: 'expert',
    topic: 'Streaming Systems & Databases',
    starterCode: '// REAL-TIME ANALYTICS DESIGN\n\n// STEP 1: EVENT INGESTION\n// 1M events/second. Can you write directly to a database? ___\n// What component absorbs this write spike? ___\n\n// STEP 2: STREAM PROCESSING\n// What is stream processing vs batch processing? ___\n// What is a tumbling window? A sliding window? ___\n// Which window type for "events in the last 5 minutes"? ___\n\n// STEP 3: PRE-AGGREGATION\n// Why not compute aggregations at query time? ___\n// What are you pre-aggregating? ___\n// Trade-off of pre-aggregation: ___\n\n// STEP 4: STORAGE TIERS\n// Hot data (last hour): ___ because ___\n// Warm data (last 7 days): ___ because ___\n// Cold data (last year): ___ because ___\n\n// STEP 5: QUERY LAYER\n// How do you serve "events per minute for the last hour" in < 500ms? ___',
    solution: '// REAL-TIME ANALYTICS — SOLUTION\n\n// INGESTION: Kafka\n// 1M events/sec → cannot write directly to OLTP database\n// Kafka buffers: producers write fast, consumers process at their pace\n// Topic: "events" with 100 partitions (10,000 events/sec per partition)\n// Producers: client SDKs (web, mobile, server) batch and send\n\n// STREAM PROCESSING: Apache Flink or Spark Streaming\n// Reads from Kafka, processes in micro-batches (1-5 second windows)\n// Operations: filter, enrich (lookup user info), aggregate\n// Window types:\n//   Tumbling: non-overlapping 1-minute buckets (0:00-0:59, 1:00-1:59)\n//   Sliding: "last 5 minutes" recalculated every 30 seconds\n//   Session: per-user activity sessions\n\n// PRE-AGGREGATION:\n// Flink computes: events_per_minute, events_per_page, revenue_per_hour\n// Writes pre-aggregated results to storage every minute\n// Dashboard queries pre-aggregated tables, not raw events\n// Trade-off: cannot answer arbitrary new questions against old data\n\n// STORAGE TIERS:\n// Hot (last 24h): Redis → pre-aggregated minute-level metrics\n//   Served in < 10ms, small data volume, TTL-based expiry\n// Warm (last 90 days): ClickHouse or Druid (columnar OLAP)\n//   Sub-second aggregation queries over billions of rows\n//   Columnar storage reads only relevant columns\n// Cold (historical): S3/GCS as Parquet files\n//   Queried via Athena/BigQuery for ad-hoc analysis\n\n// DASHBOARD SERVING:\n// Most dashboard views = pre-aggregated Redis lookups (< 10ms)\n// Complex custom queries → ClickHouse (< 500ms for 90-day range)\n// Historical analysis → S3 + Athena (seconds to minutes, acceptable for reports)',
    hints: [
      'The key insight is that 1M events/sec is too fast for any database — Kafka is the entry point, not a database.',
      'Pre-aggregation trades query flexibility for query speed — pre-aggregate what dashboards need, accept raw queries are slow.',
      'The three storage tiers (Redis/ClickHouse/S3) reflect the recency-freshness-cost tradeoff.',
    ],
    explanation:
      'Real-time analytics architecture is driven by the Lambda/Kappa architecture principle: separate the fast path (streaming) from the slow path (batch). Kafka absorbs the write spike, stream processors aggregate in near-real-time, and a columnar OLAP database (ClickHouse, Druid) serves analytical queries orders of magnitude faster than row-oriented databases. The three-tier storage model directly maps to the access pattern: < 1 hour data is served from Redis, < 90 days from ClickHouse, older from object storage.',
    tags: ['analytics', 'kafka', 'flink', 'clickhouse', 'stream-processing', 'olap', 'lambda-architecture'],
  },
];
