import type { Lesson } from '@/types';

export const revisionHubLesson: Lesson = {
  id: 'revision-hub',
  slug: 'revision-hub',
  title: 'Revision Hub',
  description: 'Quick-reference cheat sheets for every System Design topic — architecture, databases, caching, load balancers, messaging, distributed systems, and interview prep.',
  category: 'Revision',
  order: 22,
  difficulty: 'beginner',
  estimatedTime: 20,
  content: `## How to Use This Hub

This is your quick-reference before an interview or final recap. Each section is a compressed cheat sheet — not a replacement for the full lessons.

---

## System Design Cheat Sheet

### Questions to Ask Before Designing Anything

Who are the users? How many? (DAU, MAU)
How many requests per second (QPS) at peak?
How much data — total and per day?
What latency is acceptable?
Consistency vs availability — financial? social?
Read-heavy or write-heavy?

### Capacity Estimation Template

Daily Active Users (DAU) = X million
Requests per user per day = Y
Total requests per day = X million x Y
Requests per second (QPS) = Total divided by 86,400
Peak QPS = Average QPS x 3

Storage per record = Z KB
New records per day = N million
Daily storage growth = N million x Z KB
Annual storage = x 365

### Step-by-Step Interview Framework

1. Clarify requirements — 5 minutes
   Functional: what the system does
   Non-functional: scale, latency, consistency

2. Estimate scale — 3 minutes
   QPS, storage, bandwidth

3. Define APIs — 5 minutes
   REST endpoints or function signatures

4. Design data model — 5 minutes
   Tables/collections, relationships

5. High-level architecture — 10 minutes
   Draw the boxes and arrows

6. Deep dive on 2-3 components — 15 minutes
   Pick the hardest parts

7. Identify bottlenecks — 5 minutes
   What breaks first at 10x scale?

8. Discuss tradeoffs — 3 minutes
   What did you sacrifice? What would you change?

---

## Architecture Cheat Sheet

Monolith: best for early stage, small team, tightly coupled data. Avoid when different scaling needs per component or large teams.

Modular Monolith: growing team, clear domain boundaries. Avoid when independent deployments needed.

Microservices: large teams, independent scaling, diverse tech. Avoid for fewer than 10 engineers or unclear domain boundaries.

Event-Driven: async workflows, decoupled systems, audit logs. Avoid when strong consistency across events is needed.

When to split a monolith:
- Team coordination for deploys is the bottleneck
- One component needs 10x more scale than others
- Different reliability requirements per component
- Teams want to use different tech stacks
- Do NOT split preemptively

---

## Scalability Cheat Sheet

Single server overwhelmed: Horizontal scaling plus Load Balancer
Database read bottleneck: Read replicas plus Caching
Database write bottleneck: Sharding plus Write-ahead log
Slow responses: CDN plus Caching plus Async processing
High latency for global users: Multi-region plus CDN

Key Metrics:
- Latency: time to complete one request
- Throughput: requests per second (QPS)
- P99 latency: 99% of requests complete within X ms (what users experience at worst times)
- Availability: 99.9% = 8.7h per year downtime, 99.99% = 52 min per year

---

## Load Balancer Cheat Sheet

Round Robin: identical servers, similar request durations
Weighted RR: different server capacities
Least Connections: variable request durations
Consistent Hashing: distributed cache, same key to same server
IP Hash: stickiness needed without cookies

Layer 4: sees IP plus Port, fast, no content inspection, use for raw TCP
Layer 7: sees full HTTP, content-aware, SSL termination, use for web apps

Health checks are non-negotiable. Without them, LB sends traffic to dead servers.

---

## Database Cheat Sheet

Use SQL when: ACID transactions, complex joins, clear relational schema, financial or medical data.
Use NoSQL when: flexible schema, horizontal scale, eventual consistency OK, time-series or documents.

Replication:
- Leader-Follower: writes to leader, reads from replicas. Simple, read scaling.
- Multi-Leader: multiple writable leaders. Risk: write conflicts.
- Leaderless: any node accepts writes, quorum ensures consistency.

Sharding:
- Range-based: easy range queries, risk of hot partitions
- Hash-based: even distribution, hard to range query
- Directory: flexible, needs lookup service (extra hop)

Consistency:
- Strong: every read sees latest write. Use for financial, inventory, locks.
- Eventual: replicas converge over time. Use for social likes, views, carts.

---

## Caching Cheat Sheet

Cache-Aside: app reads cache, miss goes to DB, stores in cache. Most common.
Write-Through: write to cache AND DB simultaneously. Consistent but slow writes.
Write-Back: write to cache only, async DB write. Fast writes, data loss risk.
Read-Through: cache handles DB reads automatically. Less control.

Eviction Policies:
- LRU (Least Recently Used): evict what has not been read recently. Most common.
- LFU (Least Frequently Used): evict what is rarely accessed.
- FIFO: evict oldest entry. Rarely the right choice.

Cache Problems:
- Stampede: many simultaneous misses. Fix: add jitter to TTL, use lock.
- Avalanche: many simultaneous expirations. Fix: stagger TTLs.
- Penetration: cache miss plus DB miss. Fix: Bloom filter rejects non-existent keys.

---

## Messaging Cheat Sheet

Kafka: high throughput, replay, event streaming, audit logs.
RabbitMQ: flexible routing, task queues, RPC.
SQS: AWS managed, simple, reliable, no replay.

Rule of thumb:
- Need replay or event sourcing: Kafka
- Complex routing or RPC: RabbitMQ
- AWS environment, managed: SQS

---

## Distributed Systems Cheat Sheet

CAP Theorem:
- CP: Consistency plus Partition Tolerance. Returns error during partition. Use for banking, inventory, locks.
- AP: Availability plus Partition Tolerance. Returns possibly stale data. Use for social feeds, likes, carts.

Quorum: N=total nodes, W=write quorum, R=read quorum. Guarantee: W + R > N.
Common: N=3, W=2, R=2.

Distributed Lock:
- Use SET resource lockId NX PX 30000 (atomic, with TTL)
- Only holder can release (check before delete, use Lua script)
- For critical operations: database SELECT FOR UPDATE is safer

---

## Rate Limiting Cheat Sheet

Token Bucket: allows bursts, low memory, most APIs.
Leaky Bucket: constant output rate, no burst, traffic shaping.
Fixed Window: simple, boundary attack vulnerability.
Sliding Log: accurate, high memory.
Sliding Window Counter: accurate plus low memory, production choice.

Response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.
Status code: 429 Too Many Requests.

---

## Security Cheat Sheet

JWT: stateless, signed, cannot revoke before expiry. Use access token (15 min) plus refresh token (7 days).
Session: stateful, server stores data, revocable. Store in Redis for distributed systems.
OAuth: delegate access (Login with Google). You never handle passwords.

CSRF: attacker tricks authenticated browser. Prevent with: SameSite cookie, CSRF token.
XSS: attacker injects script. Prevent with: escape output, CSP headers, HTTPOnly cookies.
SQL Injection: user input changes SQL. Prevent with: parameterized queries, never string-concatenate SQL.

---

## Design Patterns Quick Reference

Singleton: one global instance. Watch out for testability issues.
Factory: create without knowing exact class. Good for config-driven object creation.
Builder: build complex objects step by step. Good for many optional parameters.
Observer: notify many when one changes. Watch for memory leaks if observers do not unsubscribe.
Strategy: swap algorithm at runtime. Good for payment methods, sorting, compression.
Command: encapsulate request as object. Enables undo, queuing, audit logs.
Adapter: bridge incompatible interfaces. Essential for third-party library integration.
Decorator: add behavior by wrapping. Express middleware is a decorator chain.
Facade: simplify complex subsystem. AWS SDK wraps complex HTTP APIs.
Repository: abstract data access. Makes business logic testable without real database.

---

## Interview Golden Rules

1. Always clarify before designing.
   "Before I start, can I ask a few questions about the scale and requirements?"

2. Always estimate before architecting.
   "Let me estimate QPS and storage first so the design is sized correctly."

3. Always explain WHY, not just WHAT.
   Do not say: "I would use Kafka."
   Do say: "I would use Kafka because we need replay capability and the downstream consumers process at different speeds."

4. Always discuss tradeoffs.
   "I chose eventual consistency here to get better write throughput, accepting that the like count might show 1,000 instead of 1,002 for a few seconds."

5. Always identify bottlenecks.
   "The first bottleneck at 10x scale would be the single database. I would add read replicas first, then shard by user ID if writes grow."`,

  codeExamples: [
    {
      title: 'Capacity estimation — Instagram scale',
      code: `// Instagram-scale capacity estimation
const DAU = 500_000_000;           // 500M daily active users
const photosUploadedPerDay = 100_000_000; // 100M photos/day
const readToWriteRatio = 100;      // 100:1 read/write ratio

// Write QPS
const writeQPS = Math.round(photosUploadedPerDay / 86_400); // ~1,157
const peakWriteQPS = writeQPS * 3; // ~3,472

// Read QPS
const readQPS = writeQPS * readToWriteRatio;  // ~115,700
const peakReadQPS = readQPS * 3;              // ~347,000

// Storage
const avgPhotoSizeKB = 200;
const dailyStorageGB = (photosUploadedPerDay * avgPhotoSizeKB * 1024) / 1e9; // ~20 TB/day
const yearlyStoragePB = (dailyStorageGB * 365) / 1_000_000;                  // ~7.3 PB/year

// What these numbers mean for your design:
// 347K read QPS → cache hit rate must be 90%+ (or 35K DB reads/sec)
// 20 TB/day → object storage (S3), not relational DB rows
// Peak 3.4K write QPS → write-optimized DB + async photo processing`,
      explanation: 'Capacity estimation drives architecture. These numbers tell you: CDN is mandatory, object storage for photos, and you need 90%+ cache hit rate for the economics to work.',
    },
  ],

  commonMistakes: [
    'Using this hub as a substitute for understanding — cheat sheets only work when you understand the underlying concepts.',
    'In interviews, reciting cheat sheet answers without thinking through the specific problem.',
    'Memorizing specific technologies without understanding why they exist.',
    'Not adapting rules to the specific problem — "always use Kafka" is wrong.',
  ],

  interviewQuestions: [
    {
      question: 'Walk me through how you would approach a system design interview.',
      answer: 'I use an 8-step framework: (1) Clarify functional and non-functional requirements. (2) Estimate capacity — QPS, storage, bandwidth. (3) Define APIs. (4) Design the data model. (5) Draw the high-level architecture. (6) Deep dive into the 2-3 most interesting components. (7) Identify what breaks first at 10x scale. (8) Discuss tradeoffs — what I sacrificed and what I would change.',
      difficulty: 'beginner',
      tip: 'Mentioning the framework explicitly signals structured thinking to interviewers.',
    },
  ],

  exercises: [
    {
      id: 'sd-rev-ex1',
      title: 'Full system design: Pastebin',
      description: 'Design Pastebin (text sharing service) using the 8-step framework. Go through all steps.',
      starterCode: '// Step 1: Clarify requirements\n// Functional:\n// Non-functional:\n\n// Step 2: Estimate scale\n// DAU:\n// Write QPS:\n// Read QPS:\n// Storage:\n\n// Step 3: Define APIs\n// POST /paste -> creates paste, returns short URL\n// GET /:key -> retrieves paste content\n\n// Step 4: Data model\n// Table design:\n\n// Step 5: High-level architecture\n// Describe:\n\n// Step 6: Deep dive\n// Short key generation: how do you generate unique keys?\n\n// Step 7: Bottlenecks at 10x\n// What breaks first?\n\n// Step 8: Tradeoffs\n// What did you sacrifice?',
      solution: '// Step 1: Requirements\n// Functional: Create paste with text, get by short URL, optional expiry\n// Non-functional: Read-heavy 10:1, high availability, < 50ms read latency\n\n// Step 2: Scale\n// DAU: 10M, 1M new pastes/day\n// Write QPS: 1M / 86400 = ~12 QPS (low)\n// Read QPS: 12 x 10 = 120 QPS (very low)\n// Storage: avg 10KB x 1M/day = 10GB/day, 3.6TB/year\n\n// Step 3: APIs defined above\n\n// Step 4: Data model\n// pastes: { key VARCHAR(8) PK, content TEXT, expires_at TIMESTAMP, created_at TIMESTAMP }\n// Pre-generate keys in a separate key_pool table to avoid collision\n\n// Step 5: Architecture\n// Client -> CDN (popular pastes) -> API Server -> PostgreSQL\n\n// Step 6: Key generation\n// Pre-generated key pool: background job fills table of unused keys\n// Each paste creation pops one key atomically (no collision possible)\n\n// Step 7: Bottlenecks\n// At 10x: database reads become bottleneck\n// Solution: cache popular pastes in Redis (20% get 80% of reads)\n\n// Step 8: Tradeoffs\n// Sacrificed: paste search (would need ElasticSearch)\n// Added: key pool requires background job maintenance',
      hints: [
        'This system is intentionally simple — resist over-engineering',
        'Read-heavy means: cache aggressively',
        'Key uniqueness is the interesting design challenge here',
      ],
    },
  ],

  keyTakeaways: [
    'Always clarify requirements and estimate scale before designing.',
    'The 8-step interview framework: Clarify, Estimate, API, Data Model, HLD, Deep Dive, Bottlenecks, Tradeoffs.',
    'Architecture: Monolith for early stage, Microservices when team coordination becomes the bottleneck.',
    'Database: SQL for ACID and relationships, NoSQL for scale and flexible schema.',
    'Cache strategy: Cache-Aside for most cases, Write-Through when consistency matters.',
    'Load balancer: Round Robin for uniform load, Least Connections for variable duration, Consistent Hashing for caches.',
    'CAP: CP for financial and inventory, AP for social features.',
    'Rate limiting: Token Bucket allows bursts, Sliding Window Counter for accuracy plus low memory.',
    'Always explain WHY — interviewers care about reasoning, not just correct answers.',
    'Patterns are tools not rules — apply only when they solve a real problem.',
  ],

  prevLesson: 'exercises',
};
