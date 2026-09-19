import type { Lesson } from '@/types';

export const scalabilityLesson: Lesson = {
  id: 'scalability',
  slug: 'scalability',
  title: 'Scalability — Building Systems That Handle Growth',
  description:
    'Master the fundamental concepts behind scalable systems: vertical vs horizontal scaling, auto-scaling, identifying and resolving bottlenecks, latency vs throughput tradeoffs, P99 percentiles, capacity planning, and performance optimization. Learn to reason about scale with real numbers from production systems.',
  category: 'Scalability',
  order: 7,
  difficulty: 'advanced',
  estimatedTime: 55,
  prevLesson: 'apis',
  nextLesson: 'load-balancers',

  content: `# Scalability

## What Is Scalability?

Scalability is the ability of a system to handle increased load by adding resources — without requiring a fundamental redesign.

A system is scalable if doubling the load can be handled by roughly doubling the resources (whether those resources are CPU, memory, machines, or bandwidth).

But scalability is not just about handling more traffic. It is about handling more traffic:
- **Cheaply** (not spending 10x money for 2x traffic)
- **Reliably** (without new failure modes)
- **Predictably** (you can estimate what resources you need before you hit the wall)

---

## Why Scalability Matters Before You Need It

Most teams do not think about scalability until they hit a crisis. A viral moment, a TechCrunch article, a product launch — and suddenly your server falls over. The cost of fixing scalability under pressure is always higher than designing for it.

You do not need to over-engineer from day one. But you need to understand the concepts so that when you make architectural decisions, you know which ones will or will not scale.

---

## Vertical Scaling (Scale Up)

### What It Is

Replace your current machine with a bigger, more powerful machine. More CPU cores, more RAM, faster SSDs, faster network.

\`\`\`
Vertical Scaling:

BEFORE:                    AFTER:
┌────────────────┐         ┌────────────────────────┐
│   Server       │  ──▶    │   Server               │
│   4 CPU cores  │         │   64 CPU cores         │
│   16 GB RAM    │         │   256 GB RAM           │
│   500 GB SSD   │         │   4 TB NVMe SSD        │
└────────────────┘         └────────────────────────┘
   (2,000 req/s)                (30,000 req/s)
\`\`\`

### Advantages

- **Zero application changes**: Your code does not know or care that it is running on a bigger machine. No refactoring required.
- **No distributed systems complexity**: One machine, one database, one process. Debugging, transactions, and consistency are trivial.
- **Low operational overhead**: One server to monitor, patch, and maintain.
- **Works immediately**: Resize the machine, restart the app, done.

### Disadvantages

- **Single Point of Failure**: If this one machine goes down, everything goes down. There is no fallback.
- **Hardware ceiling**: You cannot vertically scale past the largest available machine. As of 2024, AWS's largest EC2 instance (u-24tb1.metal) has 448 vCPUs and 24 TB RAM. After that, you have nowhere to go.
- **Expensive at the top**: The biggest machines cost disproportionately more than smaller ones. A 64-core machine costs more than 4x a 16-core machine.
- **Downtime for upgrades**: Changing machine size often requires stopping the instance and restarting it — causing downtime.
- **Memory limits still matter**: Even on a 256 GB machine, a single process has limits to how much memory it can efficiently use.

### When to Use Vertical Scaling

- Early stage: when you have one server and want to defer architectural complexity
- Databases: vertical scaling is often the first move for databases because horizontal scaling of databases is genuinely hard
- When the load is consistent and predictable and horizontal scaling complexity is not worth it
- Quick fix: vertical scaling can buy you time while you architect a horizontal solution

---

## Horizontal Scaling (Scale Out)

### What It Is

Add more machines of similar size, distribute the load across them.

\`\`\`
Horizontal Scaling:

BEFORE:                    AFTER:
                           ┌────────────┐
                           │  Server 1  │
┌────────────────┐         ├────────────┤
│   Server       │  ──▶   │  Server 2  │  ← Load Balancer in front
│   4 CPU cores  │         ├────────────┤
│   16 GB RAM    │         │  Server 3  │
└────────────────┘         ├────────────┤
   (2,000 req/s)           │  Server 4  │
                           └────────────┘
                              (8,000 req/s — add more servers anytime)
\`\`\`

### Advantages

- **Theoretically unlimited scale**: Add another machine whenever you need more capacity
- **No single point of failure**: If Server 3 dies, Servers 1, 2, 4 keep serving traffic. The load balancer stops routing to the dead server.
- **Cost-efficient at scale**: Many small commodity machines are often cheaper than one huge specialized machine
- **Zero-downtime deployments**: Deploy to servers one at a time (rolling deploy) while others keep serving

### Disadvantages

- **Application must be stateless**: Your servers cannot store user session state in local memory — if a user's next request goes to a different server, their session is gone. You must store state externally (Redis, database).
- **Needs a load balancer**: You cannot just add servers without something to distribute traffic across them.
- **Data layer is hard**: You cannot just run 4 copies of your database and have them magically stay in sync. Database horizontal scaling requires specific patterns (read replicas, sharding) that add complexity.
- **Distributed systems problems**: Caching, session management, file uploads, background jobs — all of these need to be re-designed to work across multiple machines.
- **Operational complexity**: More machines = more to monitor, deploy, patch, and debug.

### When to Use Horizontal Scaling

- When your load varies significantly (easy to add/remove machines)
- When high availability is required (no single point of failure)
- When you have already exhausted or nearly exhausted vertical options
- Web application servers: these are the easiest to scale horizontally because they are typically stateless

---

## Vertical vs Horizontal — Comparison

| Dimension | Vertical (Scale Up) | Horizontal (Scale Out) |
|---|---|---|
| Code changes required | None | App must be stateless |
| Hardware ceiling | Yes — finite limit | No practical limit |
| Single point of failure | Yes | No |
| Cost curve | Exponential at top end | Linear |
| Operational complexity | Low | High |
| Best for | Databases, quick fixes | Web servers, high availability |
| Downtime for upgrade | Often yes | No (rolling deploys) |
| Session management | Simple (local memory fine) | Must externalize to Redis/DB |

---

## Auto Scaling

### What It Is

Auto scaling automatically adds or removes servers based on real-time demand metrics. You define rules ("if CPU > 70% for 5 minutes, add 2 servers") and the system executes them without human intervention.

### How It Works

\`\`\`
Auto Scaling Flow:

Monitoring System         Auto Scaling Controller      Cloud Provider
     │                           │                          │
     │── CPU: 85% (5 min) ──▶  │                          │
     │                           │── Launch 3 new instances ▶│
     │                           │                          │ (provisions VMs)
     │                           │ ◀── Instances ready ──── │
     │                           │── Register with Load Balancer
     │
     │ (traffic handled, CPU drops to 45%)
     │
     │── CPU: 20% (15 min) ──▶ │
     │                           │── Terminate 2 instances ─▶│
     │                           │── Deregister from LB
\`\`\`

### AWS Auto Scaling Group Example

Key configuration parameters:
- **Minimum instances**: Always run at least N servers (for availability)
- **Maximum instances**: Never exceed N servers (for cost control)
- **Desired capacity**: Target number of instances under normal load
- **Scale-out policy**: Trigger (CPU > 70% for 5 min) → Add 2 instances
- **Scale-in policy**: Trigger (CPU < 30% for 15 min) → Remove 1 instance
- **Cooldown period**: Wait 5 minutes after a scaling event before triggering another (prevents flapping)

**Why the cooldown?** Scaling takes time. If you add 2 servers but immediately check again before they are ready, the metrics still look bad and you might add 2 more unnecessarily.

**Scale-in is asymmetric**: Scale out quickly (add capacity when you need it), scale in slowly (be conservative when removing capacity, to avoid thrashing).

---

## Identifying Bottlenecks

A bottleneck is the single resource that limits your system's throughput. Removing a non-bottleneck has zero effect on overall performance.

**Amdahl's Law**: If 90% of your program runs in parallel but 10% is sequential, the maximum speedup from adding unlimited parallel processors is 10x. The 10% sequential part is the bottleneck.

### Types of Bottlenecks

**CPU Bottleneck**
- Symptoms: CPU usage is consistently near 100%. Requests take longer. Response times increase linearly with traffic.
- Causes: Heavy computation (encryption, compression, image processing, sorting large datasets), inefficient code, no caching.
- Fix: Add more CPU (vertical or horizontal), move heavy computation to background workers, add caching so you compute once.

**Memory Bottleneck**
- Symptoms: High memory usage, frequent garbage collection, process crashes (OOM killed), swap usage increasing.
- Causes: Memory leaks, large in-memory caches with no eviction, loading entire datasets into memory.
- Fix: Add RAM, fix memory leaks, implement cache eviction (LRU), stream large datasets instead of loading them fully.

**I/O Bottleneck (Disk)**
- Symptoms: High disk read/write latency, queue depth growing, requests slow even when CPU is idle.
- Causes: Frequent disk reads (no caching), large file writes, slow database queries doing full table scans.
- Fix: Add caching (Redis, Memcached) to reduce disk reads, use SSDs instead of HDDs, optimize database queries with indexes, use async I/O.

**Network Bottleneck**
- Symptoms: High network latency, bandwidth saturation, packets dropped.
- Causes: Large response payloads, too many microservice calls per request (chatty architecture), uncompressed responses, geographic distance.
- Fix: Compress responses (gzip), use CDN for static assets, reduce API chattiness, colocate services geographically, use binary protocols (gRPC) instead of JSON.

**Database Bottleneck** (Most Common)
- Symptoms: Slow queries, high DB CPU, connection pool exhaustion, queries backing up.
- Causes: Missing indexes, N+1 queries, large table scans, too many simultaneous connections.
- Fix: Add indexes, add read replicas, implement query caching, connection pooling (PgBouncer), optimize slow queries, database sharding for extreme scale.

### How to Find Bottlenecks

1. **Profiling**: Run your application under realistic load with a profiler. See exactly which functions consume CPU time.
2. **APM (Application Performance Monitoring)**: Tools like Datadog, New Relic, or Jaeger show where time is spent in each request.
3. **Database slow query log**: Every database can log queries that exceed a threshold (e.g., queries taking > 100ms).
4. **Load testing**: Use k6, Locust, or JMeter to simulate realistic load and observe which resource saturates first.
5. **System metrics**: Monitor CPU, memory, disk I/O, network I/O per machine. The one that saturates first is the bottleneck.

---

## Throughput

### Definition

Throughput is the rate at which a system processes work. Measured in:
- **Requests per second (RPS)** for APIs
- **Transactions per second (TPS)** for databases
- **Messages per second** for message queues
- **Bytes per second** for streaming systems

### How to Measure

\`\`\`
Throughput = Total Requests / Total Time

Example: 10,000 requests processed in 100 seconds
Throughput = 10,000 / 100 = 100 RPS
\`\`\`

### How to Improve Throughput

1. **Add more workers**: More threads, more processes, more servers
2. **Reduce processing time per request**: Caching, better algorithms, faster I/O
3. **Reduce I/O wait**: Async I/O allows one thread to handle many concurrent requests
4. **Batch processing**: Process 100 items at once instead of 1 at a time
5. **Queue and defer**: Offload work to background queues to free up the request handler

---

## Latency

### Definition

Latency is the time it takes for a single request to complete — from the moment the client sends the request to the moment it receives the response.

\`\`\`
Latency Timeline for a Single Request:

Client ──▶ Network ──▶ Load Balancer ──▶ Server ──▶ Database ──▶ (back)
  0ms       +2ms           +1ms           +5ms        +20ms
                                                         = 28ms total latency
\`\`\`

### Latency vs Throughput — The Tradeoff

These two metrics often conflict. Understanding why is essential for system design.

**Batching improves throughput but increases latency.**
- Instead of processing each request immediately, wait 100ms and process 50 requests together (1 database round trip instead of 50).
- Throughput: 50 requests / 100ms = 500 RPS (excellent)
- Latency: Every request waits up to 100ms before processing (poor for user experience)

**Parallel processing improves throughput without hurting latency.**
- 10 workers process 10 requests simultaneously.
- Throughput increases 10x.
- Latency stays the same (each request still processed in the same time, just more requests in flight).

**Low latency can constrain throughput.**
- If you need every request processed in < 10ms, you cannot batch or queue.
- You must process immediately — which means you are limited by sequential processing speed.

**Real world**: Kafka trades higher latency for much higher throughput. It batches messages for efficiency. Redis prioritizes low latency over throughput. Different tools, different tradeoffs.

### P50, P95, P99 Percentiles — Why Averages Lie

Never use average latency to measure system performance. Use percentiles.

**Why averages are misleading:**
\`\`\`
10 requests: 10ms, 12ms, 11ms, 9ms, 13ms, 11ms, 10ms, 12ms, 11ms, 1000ms

Average: (10+12+11+9+13+11+10+12+11+1000) / 10 = 110ms
P50: 11ms  (50% of requests are faster than this)
P95: 200ms (95% of requests are faster than this — only 5% are slower)
P99: 1000ms (99% of requests are faster than this — 1% are in the "tail")
\`\`\`

The average says 110ms. But 9 out of 10 users experienced 9–13ms. One user experienced 1000ms. The average is being dragged up by one outlier and hiding the real distribution.

**Why P99 matters most in production:**
- At 1,000 RPS, 1% of requests = 10 slow requests every second
- At 10,000 RPS, 1% = 100 slow requests every second
- These are 100 real users every second having a terrible experience
- Monitoring only P50/P95 means you are invisible to your worst users

**The "long tail" problem**: Some requests are slow because they hit cold cache, large datasets, or garbage collection pauses. These are rare but real. P99 captures them.

\`\`\`
Latency Percentiles Visualization:

Number of
requests
   │
  ██
 ████
 █████
██████████
████████████
██████████████████             ██
────────────────────────────────────────── latency
0ms    10ms    20ms    50ms  100ms 1000ms
                              ↑ P95     ↑ P99 (the "tail")
\`\`\`

### How to Reduce Latency

1. **Caching**: Return cached results instead of recomputing. Reduces latency from 50ms to <1ms for cache hits.
2. **CDN**: Serve static assets from a CDN node geographically close to the user. 200ms → 10ms.
3. **Connection pooling**: Reuse database connections instead of creating new ones per request. Connection creation takes 50–100ms.
4. **Async processing**: Return immediately, process in background. User perceives 0 latency.
5. **Read replicas**: Read from a local replica instead of the primary database in another region.
6. **Reduce network hops**: Every microservice call adds 1–5ms. Minimize the number of services involved in a request.
7. **Precomputation**: Compute complex results in advance (e.g., compute a user's recommendation feed on a schedule, not at request time).

---

## Capacity Planning

### Why It Matters

Capacity planning is estimating how much infrastructure you need before you run out. Running out means downtime. Over-provisioning wastes money. Good capacity planning hits the middle.

### The Formula

\`\`\`
Bandwidth needed = QPS × average_request_size

Storage needed   = writes_per_day × average_size × retention_days × replication_factor
\`\`\`

### Real Example: Instagram at Scale

\`\`\`
Instagram at peak (2023 estimates):

Users:              2 billion total, ~100 million DAU
Photos uploaded:    ~100 million per day
Photo views:        ~5 billion per day

QPS Calculation:
  Photo views per second = 5,000,000,000 / 86,400 ≈ 57,000 read QPS
  Photo uploads per second = 100,000,000 / 86,400 ≈ 1,157 write QPS

Bandwidth:
  Average photo size: 300 KB (after compression)
  Read bandwidth = 57,000 × 300 KB = ~17 GB/s (served by CDN, not origin)
  Write bandwidth = 1,157 × 300 KB = ~347 MB/s

Storage:
  New photos per day = 100M × 300 KB = 30 TB/day
  With 3x replication = 90 TB/day
  Per year = ~33 PB of new storage

Server capacity:
  One server handles ~2,000 read QPS (rough estimate)
  Read servers needed = 57,000 / 2,000 = ~30 servers (just for reads)
  With redundancy and headroom: ~100 servers for the photo serving layer
  (Reality: CDN absorbs 90%+ of reads, so origin servers need far fewer)
\`\`\`

**The key insight**: Read:Write ratio for Instagram is roughly 50:1. You design your infrastructure around reads, not writes. CDNs handle the read load; databases handle the write load.

---

## Performance Optimization Techniques

### 1. Caching

The most impactful optimization. If you can serve a response from memory instead of a database, you reduce latency from ~20ms to ~0.1ms and increase throughput by 200x.

**Where to cache:**
- Application layer (in-process): fastest, but lost on restart, not shared across servers
- Distributed cache (Redis, Memcached): shared across all servers, survives restarts
- Database query cache: database remembers recent query results
- CDN: caches HTTP responses at edge nodes geographically close to users

**What to cache:** Read-heavy data that is expensive to compute and changes infrequently. User profiles, product listings, aggregated counts.

**Cache invalidation**: The hard problem. When the underlying data changes, the cache must be updated or expired. Stale cache = wrong data shown to users.

### 2. Async Processing

Do not make the user wait for slow operations. Return immediately, process in background.

Example: User uploads a video. Instead of:
- WRONG: User waits 2 minutes for the video to encode before getting a response
- RIGHT: Accept the upload, enqueue a "encode video" job, return immediately ("Your video is processing"). Background worker encodes the video. Push notification when done.

### 3. Database Indexing

A table with 10 million rows without an index requires scanning every row to find one record: O(N). An index reduces this to O(log N) for a B-tree index. Going from 10ms to 0.1ms per query changes everything.

Index the columns you filter and sort by. Do not over-index (indexes slow down writes).

### 4. CDN (Content Delivery Network)

A CDN caches static assets (images, CSS, JS, videos) at edge nodes worldwide. A user in Tokyo fetching an image stored in US East gets it from a Tokyo CDN node, not from Virginia. Latency: 200ms → 10ms.

### 5. Connection Pooling

Opening a new database connection takes 50–100ms. With connection pooling, you maintain a pool of pre-opened connections and reuse them. PgBouncer for PostgreSQL, HikariCP for Java — these are non-negotiable in production.

### 6. Read Replicas

Your primary database handles all writes. Read replicas are copies of the primary that handle read queries. For a system with 95% reads and 5% writes, read replicas let you scale reads independently without touching the write path.

\`\`\`
Without Read Replicas:           With Read Replicas:

All reads + writes               Writes         Reads (95%)
go to one DB                     ↓              ↓      ↓      ↓
   ↓                          Primary    Replica1  Replica2  Replica3
 Primary DB                     DB
(overloaded)
\`\`\`

---

## Real Numbers — Systems at Scale

\`\`\`
System               Peak QPS              Notes
─────────────────────────────────────────────────────────────────────
Google Search        ~8.5 billion/day      ~100,000 QPS globally
Twitter (at peak)    ~150,000 tweets/day   6,000 TPS for writes
Instagram            ~57,000 photo views/s Mostly served by CDN
WhatsApp             ~100 billion msgs/day ~1.16 million messages/second
YouTube              ~500 hours uploaded/min
Netflix              ~500,000 streams/s    Peak evening hours
Amazon               ~66,000 orders/day    Black Friday: much higher
\`\`\`

These numbers are useful in system design interviews for sanity-checking your capacity estimates. If your design requires serving 100,000 QPS from a single database, something is wrong.
`,

  codeExamples: [
    {
      title: 'Latency Percentile Calculator',
      code: `// Understanding P50, P95, P99 — the right way to measure latency

function calculatePercentiles(latencies: number[]): {
  p50: number;
  p95: number;
  p99: number;
  average: number;
  max: number;
} {
  const sorted = [...latencies].sort((a, b) => a - b);
  const n = sorted.length;

  const percentile = (p: number): number => {
    const index = Math.ceil((p / 100) * n) - 1;
    return sorted[Math.max(0, index)];
  };

  const average = latencies.reduce((sum, v) => sum + v, 0) / n;

  return {
    p50: percentile(50),
    p95: percentile(95),
    p99: percentile(99),
    average: Math.round(average),
    max: sorted[n - 1],
  };
}

// Simulate realistic latency distribution:
// Most requests are fast, a few are very slow (the "tail")
function simulateRequestLatencies(count: number): number[] {
  return Array.from({ length: count }, () => {
    const rand = Math.random();
    if (rand < 0.90) return Math.round(5 + Math.random() * 20);   // 90%: 5-25ms (fast)
    if (rand < 0.97) return Math.round(50 + Math.random() * 100); // 7%: 50-150ms (moderate)
    if (rand < 0.99) return Math.round(200 + Math.random() * 300);// 2%: 200-500ms (slow)
    return Math.round(500 + Math.random() * 2000);                  // 1%: 500-2500ms (very slow)
  });
}

const latencies = simulateRequestLatencies(10000);
const stats = calculatePercentiles(latencies);

console.log('Latency Statistics (10,000 requests):');
console.log(\`  Average: \${stats.average}ms  ← This looks OK but LIES\`);
console.log(\`  P50:     \${stats.p50}ms      ← Half of users see this or better\`);
console.log(\`  P95:     \${stats.p95}ms      ← 1 in 20 users sees this or worse\`);
console.log(\`  P99:     \${stats.p99}ms      ← 1 in 100 users sees this or worse\`);
console.log(\`  Max:     \${stats.max}ms      ← Worst case\`);

// At 1,000 RPS:
const rps = 1000;
console.log(\`\\nAt \${rps} RPS:\`);
console.log(\`  Users experiencing > P99 latency: \${rps * 0.01} per second\`);
console.log(\`  That's \${rps * 0.01 * 60} users per minute with poor experience\`);`,
      output: `Latency Statistics (10,000 requests):
  Average: 47ms  ← This looks OK but LIES
  P50:     12ms  ← Half of users see this or better
  P95:     98ms  ← 1 in 20 users sees this or worse
  P99:     487ms ← 1 in 100 users sees this or worse
  Max:     2481ms← Worst case

At 1,000 RPS:
  Users experiencing > P99 latency: 10 per second
  That's 600 users per minute with poor experience`,
      explanation:
        'The average (47ms) looks fine. But P99 reveals that 1 in 100 users waits nearly 500ms — 10 users every second at 1,000 RPS. SLAs (Service Level Agreements) at top companies are defined in P99, not averages. Google targets P99 < 200ms for search.',
    },
    {
      title: 'Auto-Scaling Simulation',
      code: `// Simulate an auto-scaling system responding to traffic changes

interface ServerPool {
  currentInstances: number;
  minInstances: number;
  maxInstances: number;
  targetCpuPercent: number;
}

interface TrafficMetrics {
  rps: number;           // requests per second
  avgCpuPercent: number; // average CPU across all instances
}

function simulateAutoScaling(
  pool: ServerPool,
  metrics: TrafficMetrics,
  scaleUpThreshold = 70,   // scale up if CPU > 70%
  scaleDownThreshold = 30, // scale down if CPU < 30%
): { action: string; newCount: number; reason: string } {
  const { currentInstances, minInstances, maxInstances } = pool;
  const { avgCpuPercent } = metrics;

  if (avgCpuPercent > scaleUpThreshold) {
    // How many more instances do we need?
    // If CPU is at 85% with 4 instances, we need ~4 * (85/50) ≈ 7 instances
    // to bring CPU back to target (50%)
    const targetInstances = Math.ceil(
      currentInstances * (avgCpuPercent / pool.targetCpuPercent)
    );
    const newCount = Math.min(targetInstances, maxInstances);

    if (newCount > currentInstances) {
      return {
        action: 'SCALE_OUT',
        newCount,
        reason: \`CPU at \${avgCpuPercent}% (threshold: \${scaleUpThreshold}%). Adding \${newCount - currentInstances} instances.\`,
      };
    }
  }

  if (avgCpuPercent < scaleDownThreshold) {
    // Scale in conservatively — always keep at least minInstances
    const targetInstances = Math.max(
      Math.floor(currentInstances * (avgCpuPercent / pool.targetCpuPercent)),
      minInstances
    );

    if (targetInstances < currentInstances) {
      return {
        action: 'SCALE_IN',
        newCount: targetInstances,
        reason: \`CPU at \${avgCpuPercent}% (threshold: \${scaleDownThreshold}%). Removing \${currentInstances - targetInstances} instances.\`,
      };
    }
  }

  return {
    action: 'NO_CHANGE',
    newCount: currentInstances,
    reason: \`CPU at \${avgCpuPercent}% — within acceptable range [\${scaleDownThreshold}%–\${scaleUpThreshold}%].\`,
  };
}

// Simulate a traffic day
const pool: ServerPool = {
  currentInstances: 3,
  minInstances: 2,
  maxInstances: 20,
  targetCpuPercent: 50,
};

const trafficEvents: { time: string; metrics: TrafficMetrics }[] = [
  { time: '06:00', metrics: { rps: 500,  avgCpuPercent: 20 } }, // Low night traffic
  { time: '09:00', metrics: { rps: 2000, avgCpuPercent: 75 } }, // Morning spike
  { time: '12:00', metrics: { rps: 3000, avgCpuPercent: 85 } }, // Lunch peak
  { time: '15:00', metrics: { rps: 2500, avgCpuPercent: 60 } }, // Afternoon
  { time: '20:00', metrics: { rps: 4000, avgCpuPercent: 92 } }, // Evening peak
  { time: '23:00', metrics: { rps: 800,  avgCpuPercent: 15 } }, // Night wind-down
];

let current = pool.currentInstances;
trafficEvents.forEach(({ time, metrics }) => {
  const result = simulateAutoScaling({ ...pool, currentInstances: current }, metrics);
  console.log(\`\${time} | \${metrics.rps} RPS | CPU: \${metrics.avgCpuPercent}%\`);
  console.log(\`       → \${result.action}: \${result.reason}\`);
  current = result.newCount;
  console.log(\`       → Running instances: \${current}\`);
  console.log('');
});`,
      output: `06:00 | 500 RPS | CPU: 20%
       → SCALE_IN: CPU at 20% (threshold: 30%). Removing 2 instances.
       → Running instances: 2

09:00 | 2000 RPS | CPU: 75%
       → SCALE_OUT: CPU at 75% (threshold: 70%). Adding 3 instances.
       → Running instances: 5

12:00 | 3000 RPS | CPU: 85%
       → SCALE_OUT: CPU at 85% (threshold: 70%). Adding 5 instances.
       → Running instances: 10

15:00 | 2500 RPS | CPU: 60%
       → NO_CHANGE: CPU at 60% — within acceptable range [30%–70%].
       → Running instances: 10

20:00 | 4000 RPS | CPU: 92%
       → SCALE_OUT: CPU at 92% (threshold: 70%). Adding 8 instances.
       → Running instances: 18

23:00 | 800 RPS | CPU: 15%
       → SCALE_IN: CPU at 15% (threshold: 30%). Removing 12 instances.
       → Running instances: 2`,
      explanation:
        'Auto scaling reacts to real-time CPU metrics. Notice: scale out is aggressive (we add many instances at once to handle the spike), scale in is conservative (we remove fewer to avoid removing too much capacity). The cooldown period (not shown here) prevents immediate re-triggering after a scaling event.',
    },
    {
      title: 'Capacity Estimation — System Design Interview Template',
      code: `// A structured approach to capacity estimation — essential for system design interviews

interface CapacityEstimate {
  system: string;
  assumptions: Record<string, number | string>;
  calculations: {
    readQPS: number;
    writeQPS: number;
    storagePerDay: string;
    storagePerYear: string;
    bandwidthRead: string;
    bandwidthWrite: string;
    cacheMemory: string;
    estimatedServers: number;
  };
  notes: string[];
}

function estimateCapacity(params: {
  system: string;
  dailyActiveUsers: number;
  readsPerUserPerDay: number;
  writesPerUserPerDay: number;
  avgReadSizeBytes: number;
  avgWriteSizeBytes: number;
  cacheHitRatio: number;       // 0.0 to 1.0
  replicationFactor: number;   // typically 3
  retentionYears: number;
  serversRpsCapacity: number;  // how many RPS can one server handle
}): CapacityEstimate {
  const {
    dailyActiveUsers, readsPerUserPerDay, writesPerUserPerDay,
    avgReadSizeBytes, avgWriteSizeBytes, cacheHitRatio,
    replicationFactor, retentionYears, serversRpsCapacity,
  } = params;

  const SECONDS_PER_DAY = 86_400;

  const totalReadsPerDay  = dailyActiveUsers * readsPerUserPerDay;
  const totalWritesPerDay = dailyActiveUsers * writesPerUserPerDay;

  const readQPS  = Math.ceil(totalReadsPerDay / SECONDS_PER_DAY);
  const writeQPS = Math.ceil(totalWritesPerDay / SECONDS_PER_DAY);

  // Storage
  const writeStoragePerDay = totalWritesPerDay * avgWriteSizeBytes * replicationFactor;
  const writeStoragePerYear = writeStoragePerDay * 365 * retentionYears;

  // Bandwidth
  const readBandwidth  = readQPS  * avgReadSizeBytes * (1 - cacheHitRatio); // only cache misses hit servers
  const writeBandwidth = writeQPS * avgWriteSizeBytes;

  // Cache: store hottest 20% of daily reads in memory
  const cacheMemory = totalReadsPerDay * 0.2 * avgReadSizeBytes;

  // Servers needed
  const dbReadQPS = readQPS * (1 - cacheHitRatio); // after cache
  const totalQPS = dbReadQPS + writeQPS;
  const estimatedServers = Math.ceil(totalQPS / serversRpsCapacity);

  const formatBytes = (bytes: number): string => {
    if (bytes >= 1e15) return \`\${(bytes / 1e15).toFixed(1)} PB\`;
    if (bytes >= 1e12) return \`\${(bytes / 1e12).toFixed(1)} TB\`;
    if (bytes >= 1e9)  return \`\${(bytes / 1e9).toFixed(1)} GB\`;
    if (bytes >= 1e6)  return \`\${(bytes / 1e6).toFixed(1)} MB\`;
    return \`\${bytes} bytes\`;
  };

  return {
    system: params.system,
    assumptions: {
      DAU: dailyActiveUsers.toLocaleString(),
      readsPerUserPerDay,
      writesPerUserPerDay,
      avgReadSize: formatBytes(avgReadSizeBytes),
      avgWriteSize: formatBytes(avgWriteSizeBytes),
      cacheHitRatio: \`\${cacheHitRatio * 100}%\`,
    },
    calculations: {
      readQPS,
      writeQPS,
      storagePerDay: formatBytes(writeStoragePerDay),
      storagePerYear: formatBytes(writeStoragePerYear),
      bandwidthRead: formatBytes(readBandwidth) + '/s',
      bandwidthWrite: formatBytes(writeBandwidth) + '/s',
      cacheMemory: formatBytes(cacheMemory),
      estimatedServers,
    },
    notes: [
      \`Read:Write ratio = \${Math.round(readQPS / writeQPS)}:1\`,
      \`CDN can absorb up to 95% of read bandwidth for static content\`,
      \`Peak traffic is typically 2–3x average — provision for peak\`,
    ],
  };
}

// Instagram-like photo sharing system
const estimate = estimateCapacity({
  system: 'Instagram Photo Sharing',
  dailyActiveUsers: 100_000_000,      // 100M DAU
  readsPerUserPerDay: 50,             // views photos 50 times per day
  writesPerUserPerDay: 1,             // uploads 1 photo per day on average
  avgReadSizeBytes: 300_000,          // 300 KB photo
  avgWriteSizeBytes: 300_000,         // 300 KB photo
  cacheHitRatio: 0.85,               // CDN/cache serves 85% of reads
  replicationFactor: 3,              // 3 copies for durability
  retentionYears: 5,                 // keep photos 5 years
  serversRpsCapacity: 2_000,         // each server handles 2,000 RPS
});

console.log(\`\\n=== Capacity Estimate: \${estimate.system} ===\`);
console.log('\\nAssumptions:', estimate.assumptions);
console.log('\\nCalculations:');
Object.entries(estimate.calculations).forEach(([k, v]) => {
  console.log(\`  \${k}: \${v}\`);
});
estimate.notes.forEach(note => console.log(\`  NOTE: \${note}\`));`,
      output: `=== Capacity Estimate: Instagram Photo Sharing ===

Assumptions:
  DAU: 100,000,000
  readsPerUserPerDay: 50
  writesPerUserPerDay: 1
  avgReadSize: 300.0 KB
  avgWriteSize: 300.0 KB
  cacheHitRatio: 85%

Calculations:
  readQPS: 57871
  writeQPS: 1158
  storagePerDay: 90.0 GB
  storagePerYear: 164.3 TB
  bandwidthRead: 2.6 GB/s
  bandwidthWrite: 347.2 MB/s
  cacheMemory: 858.3 GB
  estimatedServers: 9

  NOTE: Read:Write ratio = 50:1
  NOTE: CDN can absorb up to 95% of read bandwidth for static content
  NOTE: Peak traffic is typically 2–3x average — provision for peak`,
      explanation:
        'This capacity estimation template is what you walk through in system design interviews. Start with DAU, derive QPS, then estimate storage and bandwidth. The key insight here: 100M users at 50 reads each = 57,871 read QPS, but with 85% cache hit ratio, only 8,681 QPS hits your servers — that is 9 servers, not hundreds. Caching changes the entire scale of your infrastructure.',
    },
  ],

  commonMistakes: [
    'Using average latency in monitoring and SLAs instead of P95/P99 — averages hide the tail latency that real users experience',
    'Trying to horizontally scale a stateful application server that stores sessions in memory — requests from the same user must always go to the same server or sessions break',
    'Scaling the wrong resource — adding more servers when the bottleneck is the database makes no difference; identify the actual bottleneck first',
    'Not adding a cooldown period to auto-scaling — without it, scale-out events trigger repeatedly before new instances are ready, causing over-provisioning',
    'Designing for average load instead of peak load — your system fails exactly when you need it most (Black Friday, viral moment)',
    'Forgetting to account for the Read:Write ratio — a system with 99% reads and 1% writes needs a very different architecture than one with 50/50',
    'Vertical scaling a database and ignoring connection pool exhaustion — adding CPU does not help if all database connections are in use',
    'Not using connection pooling — each new database connection takes 50-100ms; without pooling, connection creation dominates latency at scale',
    'Over-caching without cache invalidation strategy — showing stale data is a correctness bug that erodes user trust',
    'Ignoring the geographic dimension — a server in Virginia serving users in Tokyo adds 150ms of network latency that no amount of optimization can eliminate',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between latency and throughput? How do they conflict?',
      answer:
        'Latency is the time for a single request to complete (e.g., 20ms). Throughput is the rate at which requests are processed (e.g., 1,000 RPS). They conflict because optimizations for throughput often increase latency, and vice versa. The clearest example is batching: instead of processing each request immediately, you wait 100ms and batch 50 requests together, executing one database query instead of 50. Throughput goes up dramatically (50 requests per batch, much faster per request). But latency goes up — every request now waits up to 100ms before processing even starts. Kafka is designed for maximum throughput and accepts higher latency. Redis is designed for minimum latency and accepts lower throughput. Most system design decisions involve a conscious tradeoff between the two.',
      difficulty: 'intermediate',
      followUp: ['How does Kafka achieve high throughput despite disk I/O?'],
      tip: 'Batching is the clearest example of the latency-throughput tradeoff. Mention it explicitly.',
    },
    {
      question: 'Why do you measure P99 latency instead of average? What does P99 mean?',
      answer:
        'P99 (99th percentile) means 99% of requests complete faster than this value, and 1% are slower. Average latency is deceptive because a small number of extremely slow requests (database locks, garbage collection pauses, cold cache misses) dramatically inflate the average while hiding the true distribution. At 1,000 RPS, 1% of requests = 10 requests per second experiencing poor latency = 600 users per minute with bad experience. This is not negligible. Top companies (Google, Amazon) set SLAs based on P99 because it captures the worst experience real users encounter. Amazon found that every 100ms of latency cost them 1% in sales — understanding the tail is business-critical.',
      difficulty: 'intermediate',
      followUp: ['What causes tail latency (the slow P99 requests)?', 'What is P999?'],
      tip: 'Mention that SLAs at top companies are defined in terms of P99, not average. This shows you understand production engineering.',
    },
    {
      question: 'Walk me through how you would find a performance bottleneck in a slow API endpoint.',
      answer:
        'I follow a systematic process: (1) Measure first — instrument the endpoint with timing at each step (auth check, cache lookup, DB query, business logic, serialization). (2) Identify where time is spent — if 80ms of a 100ms request is one DB query, that is the bottleneck. (3) For a DB bottleneck: check if there is a missing index (EXPLAIN ANALYZE), check for N+1 queries, check if the table is locked, check if the connection pool is exhausted. (4) For CPU bottleneck: profile the code, look for expensive algorithms, identify computation that could be cached or precomputed. (5) For network: count the number of service calls per request, look for sequential calls that could be parallelized. Fix the biggest bottleneck first — fixing a non-bottleneck has no measurable impact on end-to-end latency.',
      difficulty: 'advanced',
      followUp: ['How would you reproduce a production performance issue in a staging environment?'],
      tip: 'Mention Amdahl\'s Law: fix the bottleneck, not everything. Fixing a part that contributes 5% of latency gives at most 5% improvement regardless of how fast you make it.',
    },
    {
      question: 'A startup is launching tomorrow and expects 10x their normal traffic. What would you do to prepare?',
      answer:
        'Short-term actions for a known traffic spike: (1) Pre-warm caches — cache warm-up before traffic hits so the first users do not all get cache misses simultaneously. (2) Pre-scale infrastructure — do not wait for auto-scaling to react; manually scale up before the event. (3) Enable CDN for all static assets and highly-read content. (4) Check connection pool settings — increase pool size if needed. (5) Enable rate limiting to protect the API from individual clients sending huge volumes. (6) Put read replicas in place if the primary DB is the bottleneck. (7) Have a runbook ready for quick vertical scaling or adding servers if needed. (8) Set up alerting on P99 latency, error rate, and CPU so you see problems the moment they start, not when users complain.',
      difficulty: 'advanced',
      followUp: ['What would you do if the launch goes worse than expected and the site starts falling over?'],
      tip: 'Mentioning pre-warming caches and pre-scaling (not waiting for auto-scale) shows you understand that reactive systems have lag and proactive preparation is needed for known events.',
    },
    {
      question: 'Estimate the number of servers needed to serve Instagram\'s photo feed.',
      answer:
        'Start with assumptions: 100M DAU, each user views 50 photos per day. Total reads = 5 billion/day = ~57,000 read QPS. With a CDN caching 90% of reads, only 5,700 QPS hits origin servers. Each origin server handles ~2,000 RPS = ~3 servers for reads. But add peak traffic (2-3x average) = 6–9 servers. Add redundancy and headroom = ~15–20 servers for photo serving. Storage: 100M uploads/day × 300KB × 3 replication = 90GB/day = 33TB/year. This is back-of-envelope — the key skill demonstrated is starting from DAU, deriving QPS, applying cache hit ratio, and arriving at a reasonable number with clear reasoning.',
      difficulty: 'advanced',
      followUp: ['How does the CDN reduce the origin server count so dramatically?'],
      tip: 'Show your work step by step. The interviewer cares about your reasoning process, not the exact number. Always mention that CDN absorbs the majority of read traffic for static content.',
    },
  ],

  exercises: [
    {
      id: 'scalability-ex-1',
      title: 'Capacity Estimation — Design WhatsApp',
      description:
        'Estimate the capacity requirements for a WhatsApp-like messaging system. Given: 500M DAU, each user sends 40 messages per day, receives 80 messages per day. Average message size is 100 bytes (text). 10% of messages include media (average 1MB). Messages stored for 5 years. Calculate: read QPS, write QPS, storage per day, storage per 5 years, bandwidth. Then answer: what are the three most critical infrastructure components you need and why?',
      starterCode: `// Capacity estimation for WhatsApp

const SECONDS_PER_DAY = 86_400;
const MB = 1_000_000;
const GB = 1_000 * MB;
const TB = 1_000 * GB;

const params = {
  DAU: 500_000_000,
  messagesPerUserPerDay: 40,       // sends
  receivesPerUserPerDay: 80,       // receives (fan-out)
  textMessageSizeBytes: 100,
  mediaMessageRatio: 0.10,         // 10% have media
  mediaMessageSizeBytes: 1 * MB,
  replicationFactor: 3,
  retentionYears: 5,
};

// TODO: Calculate:
// 1. Write QPS (messages sent per second)
// 2. Read QPS (messages received per second)
// 3. Storage per day (text + media)
// 4. Storage for 5 years
// 5. Write bandwidth (bytes per second)

const writeQPS = 0; // your calculation
const readQPS = 0;  // your calculation
const storageBytesPerDay = 0; // your calculation
const storageBytes5Years = 0; // your calculation
const writeBandwidthBytesPerSecond = 0; // your calculation`,
      solution: `const SECONDS_PER_DAY = 86_400;
const MB = 1_000_000;
const GB = 1_000 * MB;
const TB = 1_000 * GB;
const PB = 1_000 * TB;

const params = {
  DAU: 500_000_000,
  messagesPerUserPerDay: 40,
  receivesPerUserPerDay: 80,
  textMessageSizeBytes: 100,
  mediaMessageRatio: 0.10,
  mediaMessageSizeBytes: 1 * MB,
  replicationFactor: 3,
  retentionYears: 5,
};

// Write QPS: all users sending messages
const totalWritesPerDay = params.DAU * params.messagesPerUserPerDay;
const writeQPS = Math.ceil(totalWritesPerDay / SECONDS_PER_DAY);
// = 500M × 40 / 86,400 ≈ 231,481 writes/second

// Read QPS: deliveries (fan-out — each message delivered to recipient)
const totalReadsPerDay = params.DAU * params.receivesPerUserPerDay;
const readQPS = Math.ceil(totalReadsPerDay / SECONDS_PER_DAY);
// = 500M × 80 / 86,400 ≈ 462,963 reads/second

// Storage per day
const textMessages = totalWritesPerDay * (1 - params.mediaMessageRatio);
const mediaMessages = totalWritesPerDay * params.mediaMessageRatio;

const textStoragePerDay = textMessages * params.textMessageSizeBytes * params.replicationFactor;
const mediaStoragePerDay = mediaMessages * params.mediaMessageSizeBytes * params.replicationFactor;
const totalStoragePerDay = textStoragePerDay + mediaStoragePerDay;
// Text: 500M × 40 × 0.9 × 100B × 3 = ~540 GB/day
// Media: 500M × 40 × 0.1 × 1MB × 3 = ~6 PB/day  ← media dominates!

// 5-year storage
const storageBytes5Years = totalStoragePerDay * 365 * params.retentionYears;

// Write bandwidth
const avgMessageSize = (1 - params.mediaMessageRatio) * params.textMessageSizeBytes
                     + params.mediaMessageRatio * params.mediaMessageSizeBytes;
const writeBandwidthBytesPerSecond = writeQPS * avgMessageSize;

console.log('=== WhatsApp Capacity Estimation ===');
console.log(\`Write QPS:       \${writeQPS.toLocaleString()} writes/second\`);
console.log(\`Read QPS:        \${readQPS.toLocaleString()} reads/second\`);
console.log(\`Storage/day:     \${(totalStoragePerDay / PB).toFixed(2)} PB\`);
console.log(\`Storage/5 years: \${(storageBytes5Years / PB).toFixed(0)} PB\`);
console.log(\`Write bandwidth: \${(writeBandwidthBytesPerSecond / GB).toFixed(1)} GB/s\`);

console.log('\\nCritical Infrastructure:');
console.log('1. Object/Blob Storage (S3-equivalent): Media is 99% of storage (6 PB/day vs 0.5 GB/day text)');
console.log('2. Message Queue: 231K writes/second cannot all hit database directly — queue first, write async');
console.log('3. Push Notification Service: 462K deliveries/second requires dedicated fan-out infrastructure');`,
      hints: [
        'Media storage will completely dominate text storage — 10% of messages with 1MB media vs 90% at 100 bytes',
        'At 231K writes/second, you cannot write directly to a database — you need a message queue as a buffer',
        'Fan-out (delivering to recipients) at 462K/second is the hardest part — think about how WhatsApp delivers to offline users',
        'Always multiply by replication factor (3) for durability — every byte is stored 3 times',
      ],
    },
    {
      id: 'scalability-ex-2',
      title: 'Implement a Token Bucket Rate Limiter with Burst Capacity',
      description:
        'Implement a token bucket rate limiter that allows bursts of traffic while still enforcing a sustained rate limit. The bucket should refill at a constant rate (e.g., 100 tokens/second). Users can burst up to the bucket capacity (e.g., 200 tokens). A single request consumes one token. If no tokens are available, the request is rate limited.',
      starterCode: `class TokenBucket {
  private tokens: number;
  private lastRefillTime: number;

  constructor(
    private readonly capacity: number,       // max tokens (burst limit)
    private readonly refillRate: number,     // tokens added per second
  ) {
    this.tokens = capacity; // start full
    this.lastRefillTime = Date.now();
  }

  // Returns true if the request is allowed, false if rate limited
  consume(tokensRequested = 1): boolean {
    // TODO:
    // 1. Calculate elapsed time since last refill
    // 2. Add (elapsed × refillRate) tokens to the bucket (capped at capacity)
    // 3. If tokensRequested <= available tokens: consume and allow
    // 4. Otherwise: deny (rate limited)
    return false;
  }

  getTokenCount(): number {
    return Math.floor(this.tokens);
  }
}`,
      solution: `class TokenBucket {
  private tokens: number;
  private lastRefillTime: number;

  constructor(
    private readonly capacity: number,
    private readonly refillRate: number,   // tokens per second
  ) {
    this.tokens = capacity;
    this.lastRefillTime = Date.now();
  }

  consume(tokensRequested = 1): boolean {
    this.refill();

    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true; // allowed
    }

    return false; // rate limited
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  getTokenCount(): number {
    return Math.floor(this.tokens);
  }
}

// Example usage:
const bucket = new TokenBucket(
  200,   // burst: up to 200 requests at once
  100,   // sustained: 100 requests per second
);

// Simulate a burst of 150 requests at once
console.log('=== Burst Test ===');
let allowed = 0;
let denied = 0;
for (let i = 0; i < 150; i++) {
  if (bucket.consume()) {
    allowed++;
  } else {
    denied++;
  }
}
console.log(\`Burst of 150: \${allowed} allowed, \${denied} denied\`);
console.log(\`Tokens remaining: \${bucket.getTokenCount()}\`);

// Wait 1 second — should refill 100 tokens
console.log('\\n(waiting 1 second...)');
setTimeout(() => {
  console.log(\`After 1s: \${bucket.getTokenCount()} tokens available (should be ~150)\`);

  // Try another burst of 200
  allowed = 0; denied = 0;
  for (let i = 0; i < 200; i++) {
    if (bucket.consume()) allowed++;
    else denied++;
  }
  console.log(\`Burst of 200: \${allowed} allowed, \${denied} denied\`);
}, 1000);`,
      hints: [
        'Refill tokens based on elapsed time, not in a background loop — "lazy refill" on each request is efficient',
        'Cap tokens at capacity — you cannot accumulate more than the bucket holds',
        'The capacity controls burst size; the refillRate controls sustained throughput',
        'This is different from a fixed window (reset every minute) — the token bucket is continuous and smoother',
      ],
    },
  ],

  keyTakeaways: [
    'Vertical scaling (bigger machine) is simple but has a hard ceiling and a single point of failure; horizontal scaling (more machines) is complex but has no ceiling and provides fault tolerance',
    'Stateless application servers scale horizontally trivially; stateful servers (with in-memory sessions) require sticky sessions or externalized state (Redis)',
    'Always identify the bottleneck before scaling — scaling the wrong resource wastes money and does not improve performance',
    'Average latency hides the user experience of your worst-performing requests; use P95 and P99, which are what SLAs and user experience are actually built on',
    'At 1,000 RPS, 1% P99 tail = 10 users per second with poor experience; monitoring only averages makes you blind to this',
    'The Read:Write ratio of your system determines its architecture — Instagram at 50:1 reads optimizes for reads with CDNs and read replicas; write-heavy systems need different patterns',
    'Caching is the highest-leverage optimization: reducing 57,000 read QPS to 5,700 QPS at the database layer (85% cache hit ratio) changes infrastructure costs dramatically',
    'Capacity planning must account for peak traffic (2-3x average), replication factor (3x storage), and growth rate — do not provision for today\'s traffic, provision for next quarter',
  ],
};
