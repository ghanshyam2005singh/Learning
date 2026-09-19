import type { Lesson } from '@/types';

export const cachingLesson: Lesson = {
  id: 'caching',
  slug: 'caching',
  title: 'Caching',
  description:
    'Master caching — the most impactful performance optimization in system design. Learn cache strategies, eviction policies, cache problems, and when caching hurts more than it helps.',
  category: 'Infrastructure',
  order: 9,
  difficulty: 'advanced',
  estimatedTime: 55,
  prevLesson: 'load-balancers',
  nextLesson: 'cdn',

  content: `
# Caching

## What is a Cache?

A **cache** is a fast, temporary storage layer that sits between your application and a slower data source (usually a database). When you fetch data, you store a copy in the cache. Next time the same data is needed, you return the cached copy instead of hitting the database again.

**Analogy — Browser History vs Library Card Catalog:**

Think of a library. Every time you want a book, you walk to the card catalog (the database), find the reference number, go to the shelf, and retrieve the book. This takes 5 minutes.

But if you've read that book before, you remember where it is (your brain is the cache). Next time — 5 seconds.

A **browser cache** works the same way. The first time you visit a website, images and scripts are downloaded. The second visit, your browser loads them from disk instead of the network. The experience is instant.

---

## Why Caching Exists

Three root causes make caching necessary:

**1. Databases are slow.** A typical database query involving disk I/O takes 1–50ms. That sounds fast, but at 10,000 requests/second, your database is overwhelmed.

**2. The same data is requested repeatedly.** If 1 million users all load the Twitter homepage, they all want the same trending tweets. Querying the database 1 million times is wasteful. Cache it once.

**3. Computation is expensive.** Some results require heavy computation (ranking algorithms, ML inference, aggregations). Cache the result, not the computation.

---

## Cache Hit and Cache Miss

\`\`\`
Request for user_id=42
         |
         v
  [Check Cache]
   /           \\
Found?        Not Found?
(Cache HIT)   (Cache MISS)
   |                |
Return fast    Query Database
 ~0.1ms         Store in Cache
                Return result
                   ~5-50ms
\`\`\`

- **Cache Hit:** Data found in cache. Returned immediately. Fast path.
- **Cache Miss:** Data not in cache. Must go to the source. Slow path.

### Hit Rate and Miss Rate

**Hit Rate = (Cache Hits) / (Total Requests) × 100**

If your cache has a 90% hit rate, 9 out of 10 requests never touch the database. Your database sees only 10% of the traffic it would otherwise handle.

Target: **90%+ hit rate** for most production systems. Below 80% means your caching strategy needs rethinking — either the cache is too small, TTL is too short, or you're caching the wrong data.

---

## TTL — Time To Live

Every cached value should have an expiry time called **TTL (Time To Live)**. After TTL expires, the entry is deleted.

**Why TTL is mandatory:**

Without TTL, you serve stale data forever. Imagine caching a product price at $99. The price changes to $149 in the database. Without TTL, users still see $99 — and you lose money on every order.

**Choosing TTL:**

| Data Type | Suggested TTL |
|---|---|
| User profile | 5–15 minutes |
| Product catalog | 1–24 hours |
| Search results | 5–30 minutes |
| Static configuration | 1–24 hours |
| Session tokens | Match session timeout |
| Real-time stock prices | 1–5 seconds |

Short TTL = more cache misses = fresher data.
Long TTL = fewer cache misses = staler data.
It is always a tradeoff.

---

## Cache Eviction — Memory is Finite

A cache has limited memory. When it fills up, old entries must be removed to make room for new ones. This is **cache eviction**.

### Eviction Policies

**LRU — Least Recently Used**
Evicts the entry that has not been accessed for the longest time. Most commonly used policy. Works well when recently accessed data is likely to be accessed again soon.

**LFU — Least Frequently Used**
Evicts the entry that has been accessed the fewest times. Works well for data with long-lived popularity (trending topics stay popular for days).

**FIFO — First In, First Out**
Evicts the oldest entry, regardless of how recently or frequently it was accessed. Simple but poor performance in most real-world scenarios.

**Random**
Evicts a random entry. Surprisingly effective in some cases — simpler to implement than LRU/LFU.

### Eviction Policy Comparison

| Policy | Evicts | Best For | Worst For |
|---|---|---|---|
| LRU | Least recently accessed | General web apps | Frequency-based access patterns |
| LFU | Least frequently accessed | Long-lived trending data | Newly popular data gets evicted early |
| FIFO | Oldest entry | Simple pipelines | Frequently accessed old data |
| Random | Random entry | Uniform access patterns | Any predictable pattern |

**Redis default:** LRU (configurable)

---

## Warm Cache vs Cold Cache

**Cold Cache:** Cache is empty (after a server restart or first deploy). Every request is a cache miss. Your database gets hammered. This is called the **cold start problem**.

**Warm Cache:** Cache is populated with frequently accessed data. Hit rate is high, performance is good.

**Cache Warming Strategies:**
1. **Pre-warming:** Before deploying, run a script that fetches popular data and populates the cache.
2. **Background jobs:** A cron job periodically refreshes cache entries before they expire.
3. **Gradual rollout:** Route a small percentage of traffic to new cache instances first.

---

## Cache Types

### 1. Browser Cache
HTTP headers control what browsers cache and for how long.

- \`Cache-Control: max-age=3600\` — cache for 1 hour
- \`ETag\` — a hash of the resource; browser sends it back, server returns 304 Not Modified if unchanged
- **When it helps:** Static assets (CSS, JS, images)
- **When it doesn't:** Dynamic API responses that change per user

### 2. Application Cache (In-Process)
An in-memory data structure (like a \`Map\` or dictionary) inside your application process.

- **Pros:** Ultra-fast (nanoseconds), no network round-trip
- **Cons:** Not shared between server instances — if you have 10 servers, each has its own cache. Server restart clears the cache. Memory limits per process.

### 3. Database Cache
Databases cache query results internally.

- **MySQL Query Cache:** Was built into MySQL but was **deprecated in MySQL 5.7 and removed in MySQL 8.0**. Why? It used a global lock, which created severe contention at high concurrency. Every write to a table invalidated all cache entries for that table. More harm than good at scale.
- **Buffer Pool (InnoDB):** MySQL's buffer pool caches disk pages in memory. This is effective and always on.
- **PostgreSQL shared_buffers:** Similar concept — caches frequently read data pages in RAM.

### 4. Distributed Cache
A separate caching service (Redis, Memcached) shared by all application servers. The correct solution at scale.

- **Pros:** Shared state across all instances, persistent across restarts (Redis), rich data structures (Redis)
- **Cons:** Network round-trip (1–5ms), additional infrastructure, single point of failure if not clustered

### 5. CDN Cache
Edge servers cache static assets close to users geographically. Covered in depth in the next lesson.

---

## Cache Strategies

### Cache Aside (Lazy Loading) — Most Common

The application manages the cache directly.

\`\`\`
         App
          |
          |-- Check Cache --|
          |                 |
        HIT                MISS
          |                 |
       Return           Query DB
      cached             Store in Cache
       value             Return value

Flow:
1. App checks cache for user_id=42
2. Cache MISS → App queries DB
3. App stores result in cache with TTL
4. Next request → Cache HIT → return immediately
\`\`\`

**Pros:** Only caches data that is actually requested. Cache failure doesn't break the app (falls back to DB).
**Cons:** First request is always a cache miss. Race condition possible under high concurrency (two threads simultaneously miss and both write to cache).

### Write Through

Every write goes to cache AND database simultaneously.

\`\`\`
App → Write → Cache
App → Write → Database (same transaction)
\`\`\`

**Pros:** Cache is always in sync with database. No stale reads after writes.
**Cons:** Every write takes longer (two writes instead of one). Cache fills with data that may never be read.

### Write Back (Write Behind)

Write to cache immediately. Write to database asynchronously.

\`\`\`
App → Write → Cache (instant, returns to user)
             Cache → Database (async, background)
\`\`\`

**Pros:** Extremely fast writes for the user. Database is not a bottleneck on writes.
**Cons:** Data loss risk — if cache crashes before async write completes, writes are lost. Complexity in managing the async write queue.

### Read Through

The cache layer itself handles DB reads. App only ever talks to the cache.

\`\`\`
App → Read → Cache
              |
           MISS → Cache fetches from DB
                  Caches it
                  Returns to App
\`\`\`

**Pros:** Simpler app code — app doesn't need to know about DB fallback.
**Cons:** Cache must integrate with your database. Cold start still causes latency.

### Strategy Comparison Table

| Strategy | Write Path | Read Path | Consistency | Write Speed | Complexity |
|---|---|---|---|---|---|
| Cache Aside | Direct to DB | App manages cache | Good | Fast | Medium |
| Write Through | Cache + DB | Cache | Excellent | Slow | Low |
| Write Back | Cache only (async DB) | Cache | Risk of loss | Fastest | High |
| Read Through | Direct to DB | Cache manages reads | Good | Fast | Low |

---

## Cache Problems

### 1. Cache Stampede (Thundering Herd)

A popular cached entry expires. Simultaneously, thousands of requests arrive. All of them miss the cache and all hit the database at once. The database gets overwhelmed.

**Solutions:**
- **Mutex / Lock:** Only the first thread fetches from DB; others wait.
- **Probabilistic Early Expiration:** Slightly before TTL, proactively refresh the entry.
- **Background refresh:** A background job refreshes entries before they expire.

### 2. Cache Avalanche

Many cache entries expire at the same time (e.g., all entries were populated with the same TTL during a cache warming). Mass cache misses hit the database simultaneously.

**Solutions:**
- **Jitter:** Add random offset to TTL: \`TTL = base_ttl + random(0, 300)\` seconds.
- **Staggered expiry:** Populate entries at different times.

### 3. Cache Penetration

Requests for data that doesn't exist in the database (e.g., an attacker querying random non-existent user IDs). Every request misses cache AND misses DB. The DB is still hammered.

**Solutions:**
- **Cache null values:** If DB returns no result, cache a null/empty response with a short TTL.
- **Bloom Filter:** A probabilistic data structure that quickly answers "does this key definitely NOT exist?" Filter requests at the cache layer before they reach the DB.
`,

  codeExamples: [
    {
      title: 'Cache Aside Pattern — Node.js with Redis',
      code: `import Redis from 'ioredis';
import { db } from './database';

const redis = new Redis();
const CACHE_TTL = 300; // 5 minutes

async function getUserById(userId: string) {
  const cacheKey = \`user:\${userId}\`;

  // Step 1: Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache HIT');
    return JSON.parse(cached);
  }

  // Step 2: Cache miss — query database
  console.log('Cache MISS — querying DB');
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

  if (!user) {
    // Cache null to prevent cache penetration
    await redis.setex(cacheKey, 30, 'null');
    return null;
  }

  // Step 3: Store in cache with TTL
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(user));

  return user;
}

// Cache invalidation on update
async function updateUser(userId: string, data: Partial<User>) {
  await db.query('UPDATE users SET ... WHERE id = $1', [userId]);

  // Invalidate cache — next read will populate fresh data
  await redis.del(\`user:\${userId}\`);
}`,
      output: `Cache MISS — querying DB     (first call)
Cache HIT                    (subsequent calls within 5 min)`,
      explanation:
        'Cache Aside is the most common pattern. The app checks the cache first. On a miss, it queries the DB and populates the cache. On write, it deletes the stale cache entry so the next read gets fresh data.',
    },
    {
      title: 'TTL Jitter — Preventing Cache Avalanche',
      code: `function getTTLWithJitter(baseTTL: number, jitterRange: number = 60): number {
  // Add random seconds to prevent all keys expiring simultaneously
  return baseTTL + Math.floor(Math.random() * jitterRange);
}

// Instead of:
await redis.setex(key, 300, value); // All expire at exactly t+300

// Use:
await redis.setex(key, getTTLWithJitter(300, 60), value);
// Keys expire between t+300 and t+360, spread out the expiry`,
      explanation:
        'Jitter distributes cache expiry times across a window, preventing the thundering herd that occurs when all entries expire simultaneously.',
    },
    {
      title: 'Bloom Filter for Cache Penetration Prevention',
      code: `import { BloomFilter } from 'bloomfilter';

// Initialize with expected number of elements and false positive rate
const userBloomFilter = new BloomFilter(1000000, 0.01); // 1M users, 1% false positive

// On startup, populate bloom filter with all valid user IDs
async function initBloomFilter() {
  const userIds = await db.query('SELECT id FROM users');
  userIds.forEach(({ id }) => userBloomFilter.add(id));
}

async function getUserById(userId: string) {
  // Quick check: does this user DEFINITELY NOT exist?
  if (!userBloomFilter.test(userId)) {
    // Bloom filter says this ID has never been inserted
    // 0% chance it exists in DB — return null immediately, don't touch DB
    return null;
  }

  // Might exist — check cache then DB as normal
  return await getCacheAside(userId);
}`,
      explanation:
        'A Bloom filter is a probabilistic data structure. If it says an element is absent, it is definitely absent (no false negatives). This blocks cache penetration attacks for non-existent keys at zero DB cost.',
    },
  ],

  commonMistakes: [
    'Caching without TTL — leads to permanently stale data that never refreshes. Always set TTL.',
    'Caching at 100% before measuring — cache the hot 20% of data that serves 80% of requests, not everything blindly.',
    'Not invalidating cache on writes — users see outdated data after updates. Always delete or update cache on writes.',
    'Using in-process cache with multiple server instances — each server has a different view of the data. Use a distributed cache like Redis.',
    'Setting TTL too long for frequently changing data (e.g., stock prices cached for 1 hour).',
    'Forgetting the cold start problem — deploying a new cache without warming leads to a database traffic spike.',
    'Caching sensitive personal data without encryption or in an insecure cache store.',
    'Not monitoring hit rate — a low hit rate means your cache is not helping. Always track cache metrics.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between Cache Aside and Read Through caching?',
      difficulty: 'intermediate',
      answer:
        'In Cache Aside (Lazy Loading), the application manages all cache interactions — it checks the cache, handles misses by querying the DB, and populates the cache itself. The app has full control. In Read Through, the cache layer itself is responsible for fetching from the database on a miss. The application only ever calls the cache and never directly queries the database. Read Through simplifies app code but requires the cache layer to have DB integration. Cache Aside is more flexible and more commonly used.',
      followUp: [
        'Which pattern is more resilient to cache failures?',
        'When would you prefer Read Through over Cache Aside?',
      ],
      tip: 'Cache Aside is resilient to cache failure — if Redis goes down, the app falls back to the DB directly. Read Through breaks if the cache is down.',
    },
    {
      question: 'What is cache stampede and how do you prevent it?',
      difficulty: 'advanced',
      answer:
        'Cache stampede (thundering herd) occurs when a popular cache entry expires and many concurrent requests all miss the cache simultaneously, all hitting the database at once. Prevention strategies: (1) Use a mutex — only one request fetches from DB; others wait and use the result. (2) Probabilistic early expiration — before TTL hits, proactively refresh the entry. (3) Background refresh — a separate process refreshes entries before they expire so the cache is never cold for hot keys.',
      followUp: ['How does a mutex help? What is the downside of using one?'],
      tip: 'The mutex downside is that waiting threads are blocked. At very high concurrency, this can cause its own latency spikes.',
    },
    {
      question: 'What is cache penetration? How is it different from cache avalanche?',
      difficulty: 'advanced',
      answer:
        'Cache penetration: requests for data that does not exist in the DB (non-existent IDs). Every request misses both cache and DB. Attackers exploit this to DDoS the database. Fix: cache null results, use a Bloom filter. Cache avalanche: many cache entries expire simultaneously, causing a burst of DB load all at once. Fix: TTL jitter, staggered expiry, background refresh.',
      followUp: ['What is a Bloom filter and why is it suited for cache penetration?'],
    },
    {
      question: 'Why was the MySQL Query Cache deprecated?',
      difficulty: 'intermediate',
      answer:
        'The MySQL Query Cache used a global lock on every read and write. Every time any row in a cached table was written to, ALL cache entries for that table were invalidated. At high concurrency, this global lock caused severe contention — queries queued up waiting for the lock. The performance gain from caching was completely negated by the locking overhead. It was deprecated in MySQL 5.7 and removed in MySQL 8.0. The recommendation is to use an external cache like Redis instead.',
    },
    {
      question:
        'You have a system where 70% of reads are for the same 1,000 products. How would you cache this efficiently?',
      difficulty: 'advanced',
      answer:
        'Use a distributed cache (Redis) with Cache Aside pattern. On startup, warm the cache by pre-loading these 1,000 products (cache warming). Set an appropriate TTL — say 1 hour — with jitter to avoid simultaneous expiry. On any product update, invalidate only that product\'s cache key. Monitor hit rate — with 70% of reads going to 1,000 products, you should achieve well above 90% hit rate. Use LRU eviction to naturally handle the case where new popular products emerge.',
      tip: 'Mention cache warming explicitly — it shows you understand the cold start problem.',
    },
    {
      question: 'What is the difference between LRU and LFU eviction? When would you use each?',
      difficulty: 'intermediate',
      answer:
        'LRU (Least Recently Used) evicts the item that was accessed least recently. It is optimal when recent access is a good predictor of future access — true for most web applications. LFU (Least Frequently Used) evicts the item with the fewest total accesses. It is better when access frequency is the predictor — for example, trending content that remains popular for days. LRU can evict popular-but-old data, while LFU can fail to cache new-but-about-to-be-popular data (it starts with frequency=1).',
    },
  ],

  exercises: [
    {
      id: 'caching-ex-1',
      title: 'Implement a Cache Aside Pattern with Expiry',
      description:
        'Build a simple in-memory cache class that supports get, set with TTL, and delete. Then wrap a mock database call with cache aside logic. The goal is to understand the full read flow — check cache, handle miss, populate cache, return result.',
      starterCode: `class SimpleCache {
  private store: Map<string, { value: any; expiresAt: number }> = new Map();

  get(key: string): any | null {
    // TODO: Return value if exists and not expired
    // Return null if missing or expired
    // Remember to clean up expired entries
  }

  set(key: string, value: any, ttlSeconds: number): void {
    // TODO: Store value with expiry timestamp
  }

  delete(key: string): void {
    // TODO: Remove entry
  }
}

// Mock database
const mockDB: Record<string, any> = {
  'user:1': { id: '1', name: 'Alice', email: 'alice@example.com' },
  'user:2': { id: '2', name: 'Bob', email: 'bob@example.com' },
};

async function getUser(cache: SimpleCache, userId: string): Promise<any> {
  const key = \`user:\${userId}\`;
  // TODO: Implement cache aside pattern here
  // 1. Check cache
  // 2. On miss: fetch from mockDB
  // 3. Store in cache with 10 second TTL
  // 4. Return result
}`,
      solution: `class SimpleCache {
  private store: Map<string, { value: any; expiresAt: number }> = new Map();

  get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: any, ttlSeconds: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }
}

const mockDB: Record<string, any> = {
  'user:1': { id: '1', name: 'Alice', email: 'alice@example.com' },
  'user:2': { id: '2', name: 'Bob', email: 'bob@example.com' },
};

async function getUser(cache: SimpleCache, userId: string): Promise<any> {
  const key = \`user:\${userId}\`;

  const cached = cache.get(key);
  if (cached !== null) {
    console.log(\`Cache HIT for \${key}\`);
    return cached;
  }

  console.log(\`Cache MISS for \${key} — fetching from DB\`);
  const user = mockDB[key] ?? null;

  if (user) {
    cache.set(key, user, 10); // 10 second TTL
  } else {
    cache.set(key, null, 5); // Cache null to prevent penetration
  }

  return user;
}`,
      hints: [
        'Store expiry as a timestamp (Date.now() + ttl * 1000), not a countdown.',
        'Always check if the entry is expired, not just if it exists.',
        'Return null for both missing and expired entries — the cache aside code should not know the difference.',
        'Cache null results with a shorter TTL to prevent cache penetration.',
      ],
    },
    {
      id: 'caching-ex-2',
      title: 'Debug a Cache Avalanche Scenario',
      description:
        'You are given a cache warming function that sets 1000 entries all with the same TTL of 300 seconds. Identify the problem (cache avalanche) and fix it by adding TTL jitter. Then calculate the probability that at least 2 entries expire within the same second before and after the fix.',
      starterCode: `// Broken: all 1000 entries expire at exactly the same time
async function warmCache(redis: any, products: Product[]) {
  for (const product of products) {
    await redis.setex(\`product:\${product.id}\`, 300, JSON.stringify(product));
  }
}

// TODO: Fix this function to prevent cache avalanche
// Add jitter so TTLs are distributed across a 60-second window
async function warmCacheFixed(redis: any, products: Product[]) {
  // Your implementation here
}

// Bonus: Write a function that computes the effective TTL
// given a base TTL and jitter range
function getTTL(baseTTL: number, jitterRange: number): number {
  // Your implementation here
}`,
      solution: `async function warmCacheFixed(redis: any, products: Product[]) {
  for (const product of products) {
    const ttl = getTTL(300, 60); // 300s base + up to 60s random
    await redis.setex(\`product:\${product.id}\`, ttl, JSON.stringify(product));
  }
}

function getTTL(baseTTL: number, jitterRange: number): number {
  return baseTTL + Math.floor(Math.random() * jitterRange);
}

// Analysis:
// Without jitter: all 1000 entries expire at t+300 (same second)
// → 1000 simultaneous DB queries at t+300 (avalanche)

// With jitter (range=60): entries expire uniformly between t+300 and t+360
// → ~1000/60 ≈ 16 entries expire per second
// → 16 DB queries/second instead of 1000 (94% reduction in peak load)`,
      hints: [
        'Math.random() returns a float between 0 and 1. Multiply by jitterRange and floor it.',
        'Think about the distribution: with range=60, entries are spread across 60 seconds.',
        'Calculate how many entries expire per second with and without jitter to see the impact.',
      ],
    },
  ],

  keyTakeaways: [
    'A cache sits between your app and the database, storing frequently accessed data in fast memory to avoid repeated expensive queries.',
    'Target a cache hit rate of 90%+ in production. Below 80% means your caching strategy needs revision.',
    'Always set TTL on cached entries. Without TTL, you serve stale data forever.',
    'Cache eviction policies: LRU is the safe default for most web apps. LFU is better for stable, long-lived popular data.',
    'Cache Aside (Lazy Loading) is the most common and flexible pattern — the app manages cache reads and writes directly.',
    'Write Through guarantees consistency but doubles write latency. Write Back maximizes write speed but risks data loss.',
    'Cache Stampede: add mutex or probabilistic early refresh. Cache Avalanche: add TTL jitter. Cache Penetration: cache null values or use a Bloom filter.',
    'Always warm your cache on deployment. A cold cache hammers the database and causes latency spikes at startup.',
    'Use distributed cache (Redis) for multi-instance deployments. In-process cache is not shared across servers.',
    'Monitor cache hit rate, eviction rate, and memory usage as core infrastructure metrics.',
  ],
};
