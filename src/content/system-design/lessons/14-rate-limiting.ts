import type { Lesson } from '@/types';

export const rateLimitingLesson: Lesson = {
  id: 'rate-limiting',
  slug: 'rate-limiting',
  title: 'Rate Limiting',
  description:
    'Master every rate-limiting algorithm — Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log, and Sliding Window Counter — plus distributed Redis-based implementation, response headers, and real-world production trade-offs.',
  category: 'Infrastructure',
  order: 14,
  difficulty: 'advanced',
  estimatedTime: 45,
  prevLesson: 'messaging-systems',
  nextLesson: 'api-gateway',

  content: `## What Is Rate Limiting?

Rate limiting is a control mechanism that restricts how many requests a client can make to a system within a given time window. It is one of the most fundamental defensive layers in distributed systems, sitting between the outside world and your services.

**Simple mental model:** Imagine a nightclub bouncer with a clicker. Every person who enters gets counted. Once the capacity is reached, nobody else enters until someone leaves. Rate limiting is the same idea applied to API requests.

---

## Why Rate Limiting Exists — The Real Motivations

Understanding *why* a technique exists is more important than memorizing *how* it works. Rate limiting solves five distinct categories of problems:

### 1. Abuse Prevention
The internet is hostile. Bots, scrapers, and malicious actors constantly probe APIs:
- **Web scrapers** hammer your product pages hundreds of times per second
- **Credential stuffing attacks** try thousands of username/password combinations against login endpoints
- **DDoS amplification** uses your own API against you by triggering expensive operations in bulk

Without rate limiting, a single bad actor can exhaust your server resources entirely.

### 2. Resource Protection
Every server has a physical ceiling — CPU cycles, memory, database connections, file handles. A server that can comfortably handle 500 requests/second will degrade and eventually crash at 5,000 requests/second. Rate limiting enforces the contract between what clients *want* to send and what your infrastructure can *safely* handle.

### 3. Cost Control
Modern systems use expensive third-party services:
- LLM API calls (GPT-4, Claude) cost fractions of a dollar *per request*
- SMS/email delivery services charge per message
- Cloud compute scales with usage

A single runaway client or a bug in a retry loop can generate thousands of dollars in API costs in minutes. Rate limiting prevents runaway spending.

### 4. Fair Usage (Multi-Tenancy)
In shared infrastructure, one heavy user must not starve others:
- A data-hungry enterprise client on a shared SaaS platform should not slow down hundreds of small clients
- Rate limits enforce equity and predictable quality of service for everyone

### 5. SLA Tier Enforcement
Rate limits are how companies differentiate their product tiers:
- **Free tier:** 100 requests/hour
- **Pro tier:** 10,000 requests/hour
- **Enterprise:** Custom limits negotiated per contract

This turns rate limiting from a protective measure into a *business model feature*.

---

## Where Rate Limiting Goes Wrong Without These Algorithms

The naive approach is a simple counter: increment on each request, reject when count exceeds limit. This breaks immediately because:
- Counters reset at arbitrary boundaries — what defines "one minute"?
- A fixed reset creates a **boundary vulnerability** (exploited in the Fixed Window problem below)
- A single counter per server fails in a distributed fleet

This is why five distinct algorithms evolved, each solving different trade-offs.

---

## The Five Algorithms — Deep Dive

### Algorithm 1: Token Bucket

**Analogy:** Imagine a physical bucket that holds tokens (poker chips). Tokens are added at a fixed rate — say, 10 tokens per second. Each incoming request takes one token out of the bucket. If the bucket is empty, the request is rejected. If nobody is making requests, tokens accumulate up to the bucket's capacity.

**ASCII Diagram:**
\`\`\`
Refill Rate: 10 tokens/second
Bucket Capacity: 50 tokens

Time 0s:   [●●●●●●●●●●●●●●●●●●●●] 20 tokens
           ↑ 3 requests arrive → consume 3 tokens
Time 0s+:  [●●●●●●●●●●●●●●●●●] 17 tokens

Time 1s:   [●●●●●●●●●●●●●●●●●●●●●●●●●●] 27 tokens (+10 refill)
           ↑ burst of 25 requests → consume 25 tokens
Time 1s+:  [●●] 2 tokens (burst was allowed!)

Time 2s:   [●●●●●●●●●●●●] 12 tokens (+10 refill)
\`\`\`

**Key insight:** The burst capability is the defining feature of token bucket. If the bucket is full (nobody has used the API for a while), a client can fire a burst of up to *capacity* requests immediately. This is usually desirable — it reflects real usage patterns where clients are idle, then suddenly active.

**Parameters:**
- \`capacity\` — maximum tokens the bucket can hold (controls burst size)
- \`refillRate\` — tokens added per second (controls sustained throughput)

**Advantages:**
- Allows controlled bursting — clients can absorb short traffic spikes
- Simple and memory-efficient (just two numbers per client: current tokens + last refill timestamp)
- Works well for most general-purpose API rate limiting

**Disadvantages:**
- Can allow up to 2× the rate limit in a short window at reset boundaries (full bucket → empty → refill)
- Requires floating-point arithmetic for precise token counting at high throughput

**Real-world use:** Stripe, GitHub API, AWS API rate limiting all use token bucket or close variants.

---

### Algorithm 2: Leaky Bucket

**Analogy:** Water drips into a bucket with a hole at the bottom. Water drips *out* at a constant rate regardless of how fast water drips *in*. If water comes in faster than it drips out, the bucket overflows (requests are dropped).

**ASCII Diagram:**
\`\`\`
Requests arrive at variable rate:
  ●●●●●●●●●  (burst of 9)

Bucket (queue):
  ┌───────┐
  │ ●●●●● │  ← 5 queued (4 dropped, bucket was full)
  │       │
  └───┬───┘
      │ drips out at constant rate: 1 req/100ms
      ↓
  [processed at steady rate]
\`\`\`

**Key insight:** Unlike token bucket, leaky bucket *smooths* traffic into a constant output rate. There is no burst at the output. Requests are queued (the bucket) and processed at a fixed rate.

**Parameters:**
- \`bucketSize\` — queue depth (how many requests can wait)
- \`leakRate\` — processing rate (requests per second at output)

**Advantages:**
- Perfectly constant output rate — great for downstream systems that can't handle bursts
- Prevents any burst from reaching the backend

**Disadvantages:**
- Clients experience increased latency when the bucket fills up (waiting in queue)
- No burst capability — a client that has been idle cannot take advantage of available capacity
- Dropping requests when bucket is full can be surprising to clients

**Real-world use:** Network QoS (traffic shaping on routers), video streaming rate control, print spoolers.

---

### Algorithm 3: Fixed Window Counter

**How it works:** Divide time into fixed windows (e.g., every 60 seconds). Each window has a counter. Every request increments the counter. When the counter exceeds the limit, requests are rejected until the next window starts.

**ASCII Diagram:**
\`\`\`
Limit: 100 requests per minute
Windows: [0s–59s] [60s–119s] [120s–179s]

Window 1: 0s────────────────────59s
          Counter: 0 → 100 (limit hit at 100)

Window 2: 60s──────────────────119s
          Counter resets to 0 → can accept 100 more
\`\`\`

**The Boundary Vulnerability (critical flaw):**
\`\`\`
Limit: 100 requests per minute

  Window 1                  Window 2
  0s ─────────── 59s | 60s ──────────── 119s
                 ↑            ↑
             100 requests  100 requests
             at second 59  at second 60

→ 200 requests processed in ~2 seconds!
  This violates the "100 per minute" contract.
\`\`\`

**Advantages:**
- Extremely simple to implement (just a Redis INCR + EXPIRE)
- Very low memory (one integer per user per window)
- Predictable reset time (easy to communicate to clients)

**Disadvantages:**
- Boundary attack allows up to 2× the rate limit at window boundaries
- Not suitable for security-sensitive rate limits (brute force protection)

**Real-world use:** Non-critical rate limits where simplicity outweighs precision, internal service quotas.

---

### Algorithm 4: Sliding Window Log

**How it works:** Store the exact timestamp of every request in a sorted set. To check if a request is allowed, count how many timestamps fall within the last N seconds. If the count is below the limit, allow the request and add the new timestamp. Periodically prune old timestamps.

**ASCII Diagram:**
\`\`\`
Limit: 5 requests per 10 seconds
Current time: T=15s
Window: [5s, 15s]

Log: [5.1s, 7.3s, 9.8s, 12.1s, 14.9s]
     ↑ 5 entries in window → REJECT next request

Time moves to T=16s, window becomes [6s, 16s]
Prune 5.1s (outside window)
Log: [7.3s, 9.8s, 12.1s, 14.9s]
     ↑ 4 entries → ALLOW next request
\`\`\`

**Advantages:**
- Perfectly accurate — no boundary vulnerability
- Each window truly represents "last N seconds" from any point in time

**Disadvantages:**
- High memory: O(requests per window) per user — storing millions of timestamps for millions of users is expensive
- Pruning log requires periodic cleanup work
- Not practical at very high throughput or with many users

**Real-world use:** Low-throughput, high-accuracy scenarios like fraud detection audit logs.

---

### Algorithm 5: Sliding Window Counter (The Production Choice)

**How it works:** Hybrid between Fixed Window and Sliding Window Log. Maintain counters for the current and previous fixed window. Calculate an approximate count by weighting the previous window's count by the proportion of it that overlaps with the current sliding window.

**Formula:**
\`\`\`
slidingCount = previousWindowCount × (1 - elapsedInCurrentWindow / windowSize)
             + currentWindowCount
\`\`\`

**ASCII Diagram:**
\`\`\`
Limit: 100 requests per minute
Window size: 60s

Previous window [0s–59s]: 80 requests
Current window  [60s–119s]: 30 requests
Current time: 75s (15s into current window)

Overlap = 1 - (15/60) = 0.75

slidingCount = 80 × 0.75 + 30 = 60 + 30 = 90 → ALLOW
\`\`\`

**Advantages:**
- Approximates sliding window accuracy without storing individual timestamps
- Very low memory (two counters per user)
- Fast: simple arithmetic, no log scanning
- Within ~0.1% accuracy of true sliding window in practice

**Disadvantages:**
- Slightly approximate (not perfectly accurate at sub-second granularity)
- Slightly more complex logic than fixed window

**Real-world use:** Cloudflare, Redis-based rate limiting libraries, most production API gateways. This is the dominant production algorithm.

---

## Algorithm Comparison Table

| Algorithm | Accuracy | Memory | Burst | Complexity | Best For |
|-----------|----------|--------|-------|------------|----------|
| Token Bucket | High | O(1) | Yes | Low | General API limiting |
| Leaky Bucket | High | O(n) queue | No | Low | Traffic shaping |
| Fixed Window | Low (boundary bug) | O(1) | No | Very Low | Simple internal quotas |
| Sliding Window Log | Perfect | O(n) | No | Medium | Audit/fraud detection |
| Sliding Window Counter | High (~99.9%) | O(1) | No | Medium | Production APIs |

---

## Where to Implement Rate Limiting

### Client-Side (Never rely on this alone)
Clients can implement their own throttling to be polite. But any client-side limit can be bypassed by a malicious or buggy caller. Never trust client-side rate limiting for security.

### Per-Server Rate Limiting (Problematic at Scale)
Each server maintains its own counter. With 10 servers, a client can make 10× the intended limit by spreading requests across servers. Round-robin load balancers make this trivially exploitable.

### Centralized Rate Limiting with Redis (The Right Answer)
All servers share a single Redis instance for rate limit counters. Every request hits Redis to check and increment the counter. Redis's atomic operations (INCR, EXPIRE) prevent race conditions.

\`\`\`
Client → Server 1 ─┐
Client → Server 2 ──→ Redis (shared counter) → Allow/Reject
Client → Server 3 ─┘
\`\`\`

**Trade-off:** Redis becomes a dependency. If Redis goes down, your rate limiting fails. Decision: fail open (allow traffic, protect availability) or fail closed (block traffic, protect backend). Most choose fail open.

### API Gateway Built-In
AWS API Gateway, Kong, Nginx Plus, Traefik — all support rate limiting natively. For most teams, this is the simplest production solution. Configure limits declaratively, no code to write.

---

## Response Headers to Return

When rate limiting, always communicate state to clients so they can self-throttle intelligently:

\`\`\`
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000        # Total requests allowed per window
X-RateLimit-Remaining: 347     # Requests remaining in current window
X-RateLimit-Reset: 1718928000  # Unix timestamp when window resets
Retry-After: 30                # Seconds until client can retry (on 429)

HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718928000
Retry-After: 30
\`\`\`

The **429 Too Many Requests** status code is the standard HTTP response for rate limit violations. Always include \`Retry-After\` on 429 responses so clients know when to retry without hammering your API in a tight loop.

---

## Real-World Rate Limiting in Production

**GitHub API:** 5,000 requests/hour for authenticated users, 60/hour for unauthenticated. Token bucket per user. Headers: \`X-RateLimit-*\`.

**Stripe:** Different limits per endpoint category. Payments: 100/second. Dashboard APIs: lower. Uses token bucket.

**Twitter/X API:** Tiered by plan. Free: 500,000 tweets/month. Enterprise: custom. Sliding window.

**Cloudflare:** Uses sliding window counter in their edge network. Rate limit decisions happen at the CDN layer before traffic ever reaches your origin.

**OpenAI:** Limits by tokens per minute AND requests per minute. Two separate token buckets running simultaneously — enforces both request count and computational cost.`,

  codeExamples: [
    {
      title: 'Token Bucket — TypeScript Implementation',
      code: `class TokenBucket {
  private tokens: number;
  private lastRefillTime: number;

  constructor(
    private readonly capacity: number,
    private readonly refillRate: number // tokens per second
  ) {
    this.tokens = capacity;
    this.lastRefillTime = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefillTime) / 1000; // seconds
    const tokensToAdd = elapsed * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  consume(tokens = 1): boolean {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true; // allowed
    }
    return false; // rate limited
  }

  getStatus() {
    this.refill();
    return {
      tokens: Math.floor(this.tokens),
      capacity: this.capacity,
    };
  }
}

// Usage
const bucket = new TokenBucket(10, 2); // 10 capacity, 2 tokens/sec

for (let i = 0; i < 12; i++) {
  const allowed = bucket.consume();
  console.log(\`Request \${i + 1}: \${allowed ? 'ALLOWED' : 'REJECTED'}\`);
}`,
      output: `Request 1: ALLOWED
Request 2: ALLOWED
...
Request 10: ALLOWED
Request 11: REJECTED
Request 12: REJECTED`,
      explanation:
        'Token bucket allows bursting up to capacity, then throttles at refillRate. Thread-safe implementation requires atomic compare-and-swap in production.',
    },
    {
      title: 'Sliding Window Counter — Redis Implementation',
      code: `import Redis from 'ioredis';

const redis = new Redis();

async function slidingWindowRateLimit(
  userId: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // Current and previous window keys
  const currentWindowStart = Math.floor(now / windowMs) * windowMs;
  const previousWindowStart = currentWindowStart - windowMs;

  const currentKey = \`rl:\${userId}:\${currentWindowStart}\`;
  const previousKey = \`rl:\${userId}:\${previousWindowStart}\`;

  // Atomic pipeline: get both counters and increment current
  const pipeline = redis.pipeline();
  pipeline.get(previousKey);
  pipeline.incr(currentKey);
  pipeline.expire(currentKey, windowSeconds * 2); // TTL = 2 windows
  const results = await pipeline.exec();

  const previousCount = parseInt((results![0][1] as string) || '0', 10);
  const currentCount = results![1][1] as number;

  // Weight previous window by how much it overlaps with current sliding window
  const elapsedInCurrentWindow = now - currentWindowStart;
  const overlapRatio = 1 - elapsedInCurrentWindow / windowMs;
  const slidingCount = previousCount * overlapRatio + currentCount;

  const allowed = slidingCount <= limit;
  const remaining = Math.max(0, limit - Math.floor(slidingCount));
  const resetAt = Math.ceil((currentWindowStart + windowMs) / 1000);

  if (!allowed) {
    // Undo the increment for rejected requests (optional — depends on policy)
    await redis.decr(currentKey);
  }

  return { allowed, remaining, resetAt };
}

// Express middleware
import { Request, Response, NextFunction } from 'express';

export function rateLimitMiddleware(limit: number, windowSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string || req.ip || 'anonymous';

    const { allowed, remaining, resetAt } = await slidingWindowRateLimit(
      userId,
      limit,
      windowSeconds
    );

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetAt);

    if (!allowed) {
      res.setHeader('Retry-After', resetAt - Math.floor(Date.now() / 1000));
      return res.status(429).json({
        error: 'Too Many Requests',
        message: \`Rate limit exceeded. Try again at \${new Date(resetAt * 1000).toISOString()}\`,
      });
    }

    next();
  };
}

// Apply to Express routes
// app.use('/api', rateLimitMiddleware(100, 60)); // 100 req/min`,
      explanation:
        'Production sliding window counter using Redis pipelines for atomic operations. The pipeline ensures we get-and-increment in one round trip, minimizing race conditions.',
    },
    {
      title: 'Fixed Window Counter — Simple Redis Example',
      code: `async function fixedWindowRateLimit(
  userId: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const windowKey = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = \`rl:fixed:\${userId}:\${windowKey}\`;

  // INCR returns new value; if key didn't exist, Redis creates it as 0 then increments
  const count = await redis.incr(key);

  if (count === 1) {
    // First request in this window — set expiry
    await redis.expire(key, windowSeconds);
  }

  return count <= limit;
}

// Vulnerability demonstration:
// If limit = 100 and window = 60s:
// At T=59s: send 100 requests → all allowed (count reaches 100)
// At T=60s: window resets → send 100 more → all allowed
// Result: 200 requests processed in ~2 seconds`,
      explanation:
        'Simple and fast but vulnerable to boundary attacks. Use only for non-security-critical quotas where occasional 2× throughput is acceptable.',
    },
  ],

  commonMistakes: [
    'Using per-server counters instead of centralized Redis counters — in a distributed fleet, each server tracks its own count, allowing clients to exceed the global limit by distributing requests across servers.',
    'Not setting TTL on Redis keys — rate limit keys accumulate indefinitely, consuming memory. Always set expiry to at least 2× the window duration.',
    'Forgetting to return rate limit headers on allowed requests (not just on 429) — clients need X-RateLimit-Remaining on every response to self-throttle before hitting the limit.',
    'Using wall-clock window boundaries without considering distributed clock skew — servers in different data centers may disagree on the current second by up to a few hundred milliseconds.',
    'Applying a single global rate limit when you need per-endpoint limits — login endpoints should have much stricter limits than a product listing endpoint.',
    'Not handling Redis failures gracefully — if your rate limiter crashes and you fail-closed, you block all legitimate traffic. Decide explicitly: fail open (allow traffic) or fail closed (block traffic).',
    'Decrementing the counter for rejected requests — this is a race condition. Reject after the increment so the count accurately reflects load even during bursts.',
    'Rate limiting by IP address alone — behind NAT, thousands of legitimate users share one IP. Rate limit by user ID for authenticated endpoints, IP only for unauthenticated ones.',
  ],

  interviewQuestions: [
    {
      question: 'What are the five main rate-limiting algorithms and their trade-offs?',
      difficulty: 'intermediate',
      answer:
        'Token Bucket: allows bursting, O(1) memory, good for general APIs. Leaky Bucket: constant output rate, no burst, good for traffic shaping. Fixed Window Counter: O(1) memory, simple, but vulnerable to 2× throughput at window boundaries. Sliding Window Log: perfectly accurate, but O(n) memory per user. Sliding Window Counter: hybrid — approximates sliding accuracy with O(1) memory using weighted previous-window calculation. Production systems most commonly use Sliding Window Counter or Token Bucket.',
      followUp: [
        'If a client sends 100 requests at second 59 and 100 at second 60 against a 100/minute limit with Fixed Window, what happens?',
        'How does Token Bucket handle a client that has been idle for 5 minutes?',
      ],
      tip: 'Interviewers want to know you understand the boundary vulnerability in Fixed Window. Always mention the 2× burst attack.',
    },
    {
      question: 'How would you implement rate limiting in a distributed system with 10 application servers?',
      difficulty: 'advanced',
      answer:
        'Per-server counters fail because a client can spread requests across all 10 servers and get 10× the intended limit. The solution is centralized state in Redis. Every server checks and increments a shared Redis counter using atomic operations (INCR + EXPIRE or Lua scripts for multi-step operations). For high throughput, use Redis Cluster for horizontal scaling. For resilience, define a fail-open or fail-closed policy when Redis is unavailable. Consider using a Redis pipeline to batch the GET + INCR into one round trip to minimize latency.',
      followUp: [
        'What happens to your rate limiting if Redis goes down?',
        'How would you handle rate limiting across multiple geographic regions?',
      ],
      tip: 'Mention atomic operations. INCR is atomic in Redis; multi-key operations need Lua scripts or transactions.',
    },
    {
      question: 'A client is getting 429 errors but claims they are under the rate limit. How do you debug this?',
      difficulty: 'advanced',
      answer:
        'Check: (1) Are they rate limited by IP or by user ID — if by IP, they may be behind a NAT sharing an IP with other clients. (2) Check if they are sending correct authentication headers — unauthenticated requests often have stricter limits. (3) Look at the X-RateLimit-Reset header — what window are they in? (4) Check if limits are per-endpoint (login may have different limits than general API). (5) Inspect distributed counter consistency — in a multi-region setup, limits may not be globally synchronized. (6) Check for clock skew affecting window calculation.',
      followUp: ['How would you expose rate limit state for debugging without a full admin API?'],
      tip: 'Always ask what the limit key is — IP vs user ID vs API key vs endpoint-specific. Most debugging starts there.',
    },
    {
      question: 'How would you implement rate limiting for an LLM API that costs money per token?',
      difficulty: 'expert',
      answer:
        'Standard request-count rate limiting is insufficient for LLMs because a single request can consume 100 or 100,000 tokens. You need two simultaneous token buckets: one for request count and one for token count. Both must pass for the request to be allowed. Implement request-count bucket (e.g., 100 requests/minute) and a token budget bucket (e.g., 100,000 tokens/minute). The token bucket is only decremented after the response completes when you know actual token usage. Pre-flight requests can estimate token count via tokenizer and check the budget before sending to the LLM. Implement streaming-aware limits that account for partial responses.',
      followUp: ['How do you handle pre-flight token estimation vs actual usage?'],
      tip: 'This question tests whether you understand that rate limiting is about resource cost, not just request count.',
    },
    {
      question: 'What HTTP status code and headers should a rate-limited response include, and why?',
      difficulty: 'beginner',
      answer:
        '429 Too Many Requests is the correct status code (RFC 6585). Required headers: X-RateLimit-Limit (total allowed), X-RateLimit-Remaining (left in current window — return on every response, not just 429), X-RateLimit-Reset (Unix timestamp when window resets), and Retry-After on 429 responses (seconds until retry). Returning X-RateLimit-Remaining on every response is critical because it allows well-behaved clients to self-throttle before hitting the limit, reducing actual 429 errors.',
      tip: 'Emphasize Retry-After — without it, clients will hammer the API in a tight retry loop, which is worse than the original problem.',
    },
    {
      question: 'Should you apply rate limiting at the client, server, or API gateway level? Why?',
      difficulty: 'intermediate',
      answer:
        'All three layers serve different purposes. Client-side rate limiting is a courtesy (polite clients self-throttle) but cannot be trusted for security — malicious callers ignore it. Per-server rate limiting is unreliable in distributed systems because load balancers spread requests across servers. Centralized rate limiting via Redis or an API gateway (Kong, AWS API Gateway, Nginx) is the correct production approach. API gateways are ideal because they enforce limits before requests consume compute, support declarative configuration, and provide consistent enforcement for all downstream services without per-service code changes.',
      tip: 'The progression client → per-server → centralized → gateway maps to maturity of your system architecture.',
    },
  ],

  exercises: [
    {
      id: 'rate-limiting-ex-1',
      title: 'Implement a Multi-Rule Rate Limiter',
      description:
        'Build a rate limiter that enforces multiple rules simultaneously: 10 requests/second, 100 requests/minute, and 1000 requests/hour. A request is only allowed if ALL three rules pass. Use the Token Bucket algorithm for each rule. The constructor should accept an array of rules. Test it with a burst of 15 requests at time 0.',
      starterCode: `interface RateLimitRule {
  limit: number;
  windowSeconds: number;
}

class MultiRuleRateLimiter {
  private buckets: TokenBucket[];

  constructor(rules: RateLimitRule[]) {
    // TODO: create a TokenBucket for each rule
    // Hint: capacity = rule.limit, refillRate = rule.limit / rule.windowSeconds
  }

  isAllowed(): boolean {
    // TODO: check all buckets — only allow if ALL pass
    // Important: don't consume tokens from any bucket if any bucket rejects
  }
}

// Test:
const limiter = new MultiRuleRateLimiter([
  { limit: 10, windowSeconds: 1 },
  { limit: 100, windowSeconds: 60 },
  { limit: 1000, windowSeconds: 3600 },
]);

for (let i = 0; i < 15; i++) {
  console.log(\`Request \${i + 1}: \${limiter.isAllowed() ? 'ALLOWED' : 'REJECTED'}\`);
}`,
      solution: `class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(private capacity: number, private refillRate: number) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  private refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  canConsume(): boolean {
    this.refill();
    return this.tokens >= 1;
  }

  consume(): boolean {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

class MultiRuleRateLimiter {
  private buckets: TokenBucket[];

  constructor(rules: RateLimitRule[]) {
    this.buckets = rules.map(
      (r) => new TokenBucket(r.limit, r.limit / r.windowSeconds)
    );
  }

  isAllowed(): boolean {
    // Pre-check all buckets without consuming
    if (!this.buckets.every((b) => b.canConsume())) return false;
    // All pass — consume from all
    this.buckets.forEach((b) => b.consume());
    return true;
  }
}`,
      hints: [
        'Pre-check all buckets before consuming from any — otherwise you could consume from bucket 1 but reject because bucket 2 is empty, leaving bucket 1 decremented unfairly.',
        'The refillRate for a rule with limit=100 and window=60s is 100/60 ≈ 1.67 tokens/second.',
        'Use a two-pass approach: canConsume() to check, then consume() to deduct.',
      ],
    },
    {
      id: 'rate-limiting-ex-2',
      title: 'Design Rate Limiting for a Payment API',
      description:
        "You're designing rate limiting for a payment processing API that has the following requirements: (1) No single user can make more than 5 payment attempts per minute to prevent brute-force card testing. (2) The entire system cannot process more than 1000 payments per second globally. (3) Premium users (identified by header X-Premium: true) get 20 attempts per minute instead of 5. (4) The /health endpoint should never be rate limited. Write the Express middleware that enforces all four requirements using the sliding window counter approach. Define what keys to use in Redis for each rule.",
      starterCode: `// Define the Redis key scheme and middleware logic
// Consider: what are the different "scopes" of rate limiting here?
// 1. Per-user limit (different for premium vs free)
// 2. Global system limit
// 3. Endpoint exclusions

async function paymentRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO:
  // Step 1: Skip /health endpoint
  // Step 2: Check global system limit (1000/sec)
  // Step 3: Determine user limit (5/min for free, 20/min for premium)
  // Step 4: Check per-user limit
  // Step 5: Set response headers
  // Step 6: Call next() or return 429
}`,
      solution: `async function paymentRateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Step 1: Skip health checks
  if (req.path === '/health') return next();

  const isPremium = req.headers['x-premium'] === 'true';
  const userId = req.headers['x-user-id'] as string || req.ip;
  const userLimit = isPremium ? 20 : 5;
  const userWindowSec = 60;

  // Step 2: Global system limit (1000/sec)
  const globalResult = await slidingWindowRateLimit('global:payments', 1000, 1);
  if (!globalResult.allowed) {
    res.setHeader('Retry-After', 1);
    return res.status(429).json({ error: 'System capacity reached, retry in 1 second' });
  }

  // Step 3 & 4: Per-user limit
  const userResult = await slidingWindowRateLimit(
    \`user:payments:\${userId}\`,
    userLimit,
    userWindowSec
  );

  // Step 5: Headers
  res.setHeader('X-RateLimit-Limit', userLimit);
  res.setHeader('X-RateLimit-Remaining', userResult.remaining);
  res.setHeader('X-RateLimit-Reset', userResult.resetAt);

  if (!userResult.allowed) {
    res.setHeader('Retry-After', userResult.resetAt - Math.floor(Date.now() / 1000));
    return res.status(429).json({
      error: 'Too Many Requests',
      tier: isPremium ? 'premium' : 'free',
      limit: userLimit,
    });
  }

  next();
}

// Redis key scheme:
// global:payments:<windowTimestamp>          → global counter
// user:payments:<userId>:<windowTimestamp>   → per-user counter`,
      hints: [
        'Check the global limit first — if the system is at capacity, there is no point checking the user limit.',
        'Use different Redis key prefixes for global vs per-user limits so they do not interfere.',
        "The global limit window is 1 second (1000/sec), the user limit window is 60 seconds — they're separate sliding windows.",
      ],
    },
  ],

  keyTakeaways: [
    'Rate limiting solves five distinct problems: abuse prevention, resource protection, cost control, fair multi-tenancy, and SLA tier enforcement — know which problem you are solving before choosing an algorithm.',
    'Token Bucket allows controlled bursting and is the best general-purpose algorithm for API rate limiting. Sliding Window Counter is the best for accuracy with low memory in production.',
    'Fixed Window Counter has a boundary vulnerability that allows 2× the limit at window edges — never use it for security-sensitive endpoints like login or payment.',
    'Per-server rate limiting is broken in distributed systems. Always use centralized state (Redis) or an API gateway for rate limiting across a server fleet.',
    'Always return X-RateLimit-Remaining on every response (not just 429) so well-behaved clients can self-throttle before hitting limits.',
    'Always return Retry-After on 429 responses — without it, clients retry immediately and amplify your traffic problem.',
    'Different endpoints need different limits: login endpoints should be much stricter than read-only data endpoints.',
    'Define your fail behavior (fail open vs fail closed) when your rate limit store (Redis) is unavailable — this is a critical production decision.',
    'For LLMs and other token-based APIs, rate limit by resource cost (tokens) not just request count — a single request can consume vastly different amounts of compute.',
    'Rate limiting by IP alone breaks behind NAT. Rate limit authenticated endpoints by user ID or API key.',
  ],
};
