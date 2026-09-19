import type { Lesson } from '@/types';

export const loadBalancersLesson: Lesson = {
  id: 'load-balancers',
  slug: 'load-balancers',
  title: 'Load Balancers — Distributing Traffic Across Servers',
  description:
    'Understand how load balancers work, why they are essential for any horizontally scaled system, every major load balancing algorithm with its tradeoffs, the critical difference between Layer 4 and Layer 7 load balancing, health checks, sticky sessions, and how to reason about load balancers in system design interviews.',
  category: 'Infrastructure',
  order: 8,
  difficulty: 'advanced',
  estimatedTime: 50,
  prevLesson: 'scalability',
  nextLesson: 'caching',

  content: `# Load Balancers

## Why Load Balancers Exist

Before load balancers, scaling a web application looked like this:

\`\`\`
All users (10,000 requests/sec)
            │
            ▼
     ┌─────────────┐
     │  Server 1   │  ← handles ALL traffic
     │  CPU: 100%  │  ← overwhelmed
     │  RAM: 95%   │
     └─────────────┘

     Server 2, 3, 4 exist but users don't know about them.
     100% of traffic goes to one server.
     It crashes. Everything is down.
\`\`\`

You could buy more servers. But having servers is worthless if all traffic still hits the same one.

A load balancer solves this fundamental problem: **it sits in front of your servers and distributes incoming requests across all of them.** No single server sees all the traffic. If one server dies, the load balancer stops sending traffic to it. The system stays up.

---

## What Is a Load Balancer?

A load balancer is a component (hardware or software) that:
1. Receives all incoming client requests at a single IP address/domain
2. Selects a healthy backend server according to a routing algorithm
3. Forwards the request to that server
4. Returns the server's response to the client

The client never knows which server handled its request. From the client's perspective, it is talking to one address.

\`\`\`
Without Load Balancer:          With Load Balancer:

User ──▶ api.example.com        User ──▶ api.example.com
           (one server)                    │
                                    ┌──────▼───────┐
                                    │ Load Balancer │
                                    └──────┬───────┘
                                           │
                             ┌─────────────┼─────────────┐
                             ▼             ▼             ▼
                          Server 1      Server 2      Server 3
                         (33% load)   (33% load)   (33% load)
\`\`\`

---

## How a Request Flows Through a Load Balancer

Understanding the complete request lifecycle is essential:

\`\`\`
Step-by-Step Request Flow:

1. Client resolves api.example.com → gets Load Balancer IP (e.g., 10.0.0.1)

2. Client sends: POST /api/orders HTTP/1.1
                 Host: api.example.com
                 → to 10.0.0.1 (Load Balancer)

3. Load Balancer:
   a. Receives the request
   b. Checks which servers are currently healthy
   c. Applies selection algorithm → picks Server 2 (10.0.1.7)
   d. Forwards request to Server 2

4. Server 2 processes the request, returns:
   HTTP/1.1 201 Created
   { "orderId": "abc123" }
   → back to Load Balancer

5. Load Balancer forwards response to Client

6. Client receives the response.
   Client has no idea Server 2 handled this request.
\`\`\`

This flow adds a small amount of latency (typically < 1ms for a well-configured software LB). The benefit — distributing load, high availability, hiding server topology — is worth it at scale.

---

## Health Checks — The Foundation of Reliability

A load balancer is only useful if it routes to **healthy** servers. Health checks are how it knows which servers are healthy.

### Active Health Checks

The load balancer proactively sends a request to each server at regular intervals:

\`\`\`
Load Balancer                    Server 2 (every 5 seconds)
     │                                │
     │── GET /health ────────────────▶│
     │ ◀── 200 OK {"status":"ok"} ── │
     │                                │  (Server 2 is healthy)
     │
     │── GET /health ────────────────▶│
     │                  (no response, server crashed)
     │── retry (2 more times) ────────▶│
     │                  (still no response)
     │
     └── Mark Server 2 as UNHEALTHY
         Stop routing traffic to it
         Alert on-call engineer
\`\`\`

Health check endpoint best practice: \`GET /health\` should not just return 200 — it should verify that the application can actually serve traffic:
- Database connection is up
- Cache connection is up
- Dependent services are reachable
- Memory and CPU are within acceptable bounds

A server that returns 200 but cannot connect to its database is not healthy.

### Passive Health Checks

The load balancer observes real traffic. If responses to actual requests are consistently failing (e.g., 5 consecutive 5xx errors), it marks the server unhealthy without sending a separate health check request.

### Health Check Configuration

- **Interval**: How often to check (e.g., every 5 seconds)
- **Threshold**: How many consecutive failures before marking unhealthy (e.g., 3 failures)
- **Recovery threshold**: How many consecutive successes before marking healthy again (e.g., 2 successes)
- **Timeout**: How long to wait for the health check response (e.g., 3 seconds)

The threshold prevents flapping — a server with intermittent issues does not get rapidly added/removed from the pool.

---

## Failover — Automatic Recovery

When a server is marked unhealthy, the load balancer:
1. Stops routing new requests to it
2. (Optionally) Drains in-flight requests on existing connections gracefully
3. Alerts your monitoring system

If the server recovers (health checks pass again), it is automatically added back to the pool. This is **automatic failover** — no human intervention required.

\`\`\`
Normal state:               Server 2 fails:          Server 2 recovers:
  LB → Server 1 (33%)        LB → Server 1 (50%)      LB → Server 1 (33%)
  LB → Server 2 (33%)        LB → Server 3 (50%)      LB → Server 2 (33%)
  LB → Server 3 (33%)        (Server 2: no traffic)    LB → Server 3 (33%)
\`\`\`

---

## Load Balancing Algorithms

The algorithm determines which server gets the next request. Each has tradeoffs. Choosing the wrong algorithm for your workload wastes capacity.

### 1. Round Robin

**How it works**: Requests are assigned to servers in a fixed rotating sequence. Request 1 → Server A, Request 2 → Server B, Request 3 → Server C, Request 4 → Server A, and so on.

\`\`\`
Round Robin:
Request 1 ──▶ Server A
Request 2 ──▶ Server B
Request 3 ──▶ Server C
Request 4 ──▶ Server A  (back to the beginning)
Request 5 ──▶ Server B
\`\`\`

**Advantages:**
- Dead simple — trivial to implement and understand
- Works well when requests have roughly equal processing cost and all servers have equal capacity
- Predictable and auditable

**Disadvantages:**
- Ignores server load — sends a new request to Server A even if Server A is processing a 10-second heavy computation while Server B is idle
- Ignores server capacity — sends equal traffic to a 4-core and a 16-core server
- A few expensive requests can make one server significantly hotter than others

**Use when:** Requests are homogeneous (similar cost, similar duration), all servers are identical, and load is relatively predictable.

---

### 2. Weighted Round Robin

**How it works**: Same as Round Robin, but each server is assigned a weight. A server with weight 3 receives 3 requests for every 1 request sent to a server with weight 1.

\`\`\`
Weights: Server A=1, Server B=1, Server C=3

Sequence: A → B → C → C → C → A → B → C → C → C → ...
(Server C gets 60% of traffic, A and B each get 20%)
\`\`\`

**Advantages:**
- Simple extension of Round Robin
- Lets you use servers of different capacities in the same pool
- Good for mixed-instance-type deployments (some big, some small)

**Disadvantages:**
- Static weights must be configured manually — if a server slows down, the weight does not automatically change
- Still does not react to actual real-time load

**Use when:** You have servers of different sizes (e.g., some c5.large and some c5.4xlarge) in the same pool.

---

### 3. Least Connections

**How it works**: The load balancer tracks the number of active connections on each server. Each new request is sent to the server with the fewest currently open connections.

\`\`\`
State:
  Server A: 12 active connections
  Server B: 3 active connections  ← new request goes here
  Server C: 8 active connections

Next request → Server B (fewest connections)
\`\`\`

**Advantages:**
- Adapts to unequal request durations — long-running requests accumulate on servers that handle them, and new requests go elsewhere
- Works well when request processing time varies significantly (e.g., some requests take 100ms, others take 10 seconds)
- Self-balancing — if one server is slow, it accumulates connections and new traffic naturally flows to faster servers

**Disadvantages:**
- Slightly more complex to implement (must maintain connection count state)
- Does not account for server capacity — a low-spec server with 3 connections may be more loaded than a high-spec server with 12 connections

**Use when:** Requests vary significantly in duration or resource consumption. Very good for WebSocket servers (persistent connections).

---

### 4. Weighted Least Connections

**How it works**: Combines least connections with server weights. The effective score for each server is \`active_connections / weight\`. Lowest score gets the next request.

\`\`\`
Server A: weight=1, connections=4 → score = 4/1 = 4.0
Server B: weight=4, connections=8 → score = 8/4 = 2.0  ← new request goes here
Server C: weight=2, connections=5 → score = 5/2 = 2.5
\`\`\`

**Advantages:**
- Best of both worlds: accounts for both server capacity and current load
- The most "fair" algorithm in heterogeneous environments

**Disadvantages:**
- More complex, requires both connection tracking and weight management

**Use when:** You have servers of different sizes AND requests vary in duration. The go-to algorithm for production heterogeneous environments.

---

### 5. IP Hashing

**How it works**: Hash the client's IP address to determine which server handles their requests. The same IP always maps to the same server.

\`\`\`
Client IP: 192.168.1.45
hash(192.168.1.45) % 3 = 2 → always Server C

Client IP: 10.0.0.12
hash(10.0.0.12) % 3 = 0 → always Server A

Client IP: 172.16.0.7
hash(172.16.0.7) % 3 = 1 → always Server B
\`\`\`

**Advantages:**
- Same client always goes to the same server — solves session affinity without sticky session cookies
- Useful when server-side caching benefits from a client always going to the same server (warm cache)

**Disadvantages:**
- **Uneven distribution**: If many users share an IP (corporate NAT, VPN, mobile carrier NAT), one server gets all of them
- **Non-adaptive**: If one server is slow, IP hashing does not automatically route around it
- **Scaling breaks affinity**: Adding or removing a server changes which server handles each IP (hashing % new_count). All clients are rerouted.

**Use when:** You need simple session affinity and consistent hashing is too complex. Rarely the best choice — consistent hashing solves its problems elegantly.

---

### 6. Consistent Hashing — The Elegant Solution

Consistent hashing solves the biggest problem with IP hashing: when servers are added or removed, the mapping of clients to servers changes minimally (only the clients that mapped to the changed server are affected, not all clients).

**How it works:**

\`\`\`
The Ring:

Imagine a circle (ring) with positions 0 to 2^32 - 1.

1. Hash each server to a position on the ring:
   Server A → position 100
   Server B → position 200
   Server C → position 350

2. For each client request, hash the client key (IP or user ID)
   and find the next server clockwise on the ring:

   Client key hashes to position 150:
   → Next server clockwise: Server B (at 200)

   Client key hashes to position 280:
   → Next server clockwise: Server C (at 350)

   Client key hashes to position 380:
   → Next server clockwise: Server A (at 100, wrapping around)

3. Add Server D at position 250:
   Only clients between 200 and 250 are rerouted to D.
   Everyone else stays on their current server.

4. Remove Server B at position 200:
   Only clients that were routed to B move to the next server (C).
   Everyone else stays unchanged.
\`\`\`

**Virtual Nodes**: In practice, each physical server is placed at multiple positions on the ring (e.g., 150 virtual nodes). This ensures that when a server is added or removed, the load is redistributed evenly across all remaining servers, not just the adjacent one.

**Real world**: Used by Amazon DynamoDB, Apache Cassandra, and content distribution networks for distributing data and requests across a cluster.

**Advantages:**
- Minimal disruption when adding/removing servers
- Even distribution (with virtual nodes)
- Excellent for distributed caches (same key always goes to same shard, only affected shard moves when cluster changes)

**Disadvantages:**
- More complex to implement and reason about than Round Robin or Least Connections
- Virtual nodes add implementation complexity

**Use when:** You have a distributed cache or database where routing consistency matters (e.g., all requests for user 123 should go to the same cache server to maximize hit rate).

---

### 7. Random

**How it works**: Select a server randomly from the healthy pool.

**Advantages:**
- Dead simple to implement
- Mathematically approximates Round Robin at high request counts (law of large numbers)
- Surprisingly effective — works well enough for most stateless applications

**Disadvantages:**
- No guarantee of even distribution for small request counts
- Does not account for server load or capacity
- Can cause occasional hot spots due to randomness

**Use when:** You need a simple baseline algorithm and request counts are high (thousands per second). Random with enough traffic converges to uniform distribution.

---

### Algorithm Comparison Table

| Algorithm | Load Awareness | Capacity Aware | Session Affinity | Complexity | Best For |
|---|---|---|---|---|---|
| Round Robin | No | No | No | Lowest | Homogeneous servers, equal-cost requests |
| Weighted Round Robin | No | Yes | No | Low | Mixed server capacities |
| Least Connections | Yes | No | No | Medium | Variable-duration requests |
| Weighted Least Connections | Yes | Yes | No | Medium | Mixed capacity + variable requests |
| IP Hashing | No | No | Yes (simple) | Low | Simple session affinity |
| Consistent Hashing | No | No | Yes (robust) | High | Distributed caches, minimal redistribution |
| Random | No | No | No | Lowest | Simple stateless, high volume |

---

## Sticky Sessions

### What They Are

Sticky sessions (also called session affinity) ensure that a user's requests are always routed to the same server. This is needed when server-side session state is stored locally (in memory or local disk) rather than externalized.

### How They Work

The load balancer sets a cookie (e.g., \`SERVERID=server2\`) in the HTTP response. On subsequent requests, the browser sends this cookie, and the load balancer uses it to route the request to the same server.

\`\`\`
Request 1:
  Client → LB → Server 2 (handles request)
  Response includes: Set-Cookie: SERVERID=server2

Request 2:
  Client sends: Cookie: SERVERID=server2
  LB reads cookie → sends to Server 2 (same server)

Request 3 (Server 2 crashes):
  Client sends: Cookie: SERVERID=server2
  LB detects Server 2 is unhealthy
  Sends to Server 1 instead
  ← User's session is LOST (logged out, cart empty)
\`\`\`

### Problems with Sticky Sessions

1. **Session loss on failure**: If the server with your session crashes, your session is gone.
2. **Uneven load distribution**: If some users have expensive long sessions, those servers become hot. The load balancer cannot rebalance them.
3. **Scaling difficulty**: Moving sessions between servers requires session migration, which is complex.

### The Better Alternative — Externalized Sessions

Store sessions in Redis (or another shared cache) instead of server memory. Any server can look up any session. Sticky sessions become unnecessary.

\`\`\`
Without external sessions:          With Redis session store:
  Server 1: User A session            Redis: { "session_abc": {user: A} }
  Server 2: User B, C sessions               { "session_def": {user: B} }

  Any request for User A MUST         Any server can handle any user
  go to Server 1. Sticky required.    No stickiness needed.
\`\`\`

---

## Layer 4 vs Layer 7 Load Balancers

This is one of the most common system design interview topics around load balancers.

### Layer 4 (Transport Layer)

Operates at the TCP/UDP protocol level. It does not look at the HTTP content — it only sees IP addresses, ports, and TCP connection state.

\`\`\`
Layer 4 Load Balancer:

Client: "I want to connect to 10.0.0.1:443"
L4 LB: "I see a TCP connection to port 443. Route to Server 2."
       (Forwards raw TCP bytes — cannot see HTTP method, URL, headers)

Client ──TCP──▶ L4 LB ──TCP──▶ Server 2
\`\`\`

**Characteristics:**
- Works at IP/TCP/UDP level — blind to HTTP content
- Extremely fast (no content parsing)
- Cannot route based on URL path, HTTP headers, or cookies
- Cannot do SSL termination at this layer (it sees encrypted bytes)
- One TCP connection from client to LB and one from LB to server (connection is forwarded)

### Layer 7 (Application Layer)

Operates at the HTTP/HTTPS level. It reads the full HTTP request — method, URL, headers, cookies — and can make routing decisions based on content.

\`\`\`
Layer 7 Load Balancer:

Client sends: GET /api/images/large.jpg HTTP/1.1
L7 LB reads the URL and routes to the image server pool:
  - /api/images/* → Image Server Pool
  - /api/orders/* → Order Service Pool
  - /api/* → General API Pool
  - /* → Static Frontend Servers
\`\`\`

**Characteristics:**
- Reads HTTP content — can route by URL, method, headers, cookies
- Can terminate SSL (decrypt HTTPS, inspect content, re-encrypt if needed)
- Can add/modify headers (e.g., add X-Real-IP header with client's actual IP)
- Can perform A/B testing by routing % of requests to different versions
- Can implement rate limiting per URL or user
- More CPU-intensive than L4 (must parse HTTP)
- Slightly higher latency than L4 (< 1ms difference in practice)

### Side-by-Side Comparison

\`\`\`
Layer 4 Load Balancer:              Layer 7 Load Balancer:

  Client                              Client
    │                                   │
    │ TCP connection                     │ HTTPS connection
    ▼                                   ▼
  ┌─────────┐                         ┌─────────────────────┐
  │  L4 LB  │                         │       L7 LB         │
  │ (TCP/IP │                         │ (Reads HTTP content)│
  │  only)  │                         │ - URL routing       │
  └────┬────┘                         │ - Header inspection │
       │                              │ - SSL termination   │
       │ TCP proxy                    │ - Cookie-based      │
       ▼                              │   session affinity  │
   Server Pool                        └──────────┬──────────┘
   (any TCP service)                              │
                                      ┌───────────┼───────────┐
                                      ▼           ▼           ▼
                                  API Pool    Image Pool  Static Pool
\`\`\`

### Feature Comparison Table

| Feature | Layer 4 | Layer 7 |
|---|---|---|
| Protocol visibility | TCP/UDP only | Full HTTP/HTTPS |
| URL-based routing | No | Yes |
| Header inspection | No | Yes |
| Cookie-based affinity | No | Yes |
| SSL termination | No | Yes |
| Performance | Faster (raw TCP) | Slightly slower (parses HTTP) |
| A/B testing | No | Yes |
| Rate limiting by user | No | Yes |
| WebSocket support | Yes (TCP passthrough) | Yes (with upgrade support) |
| Example tools | HAProxy (TCP mode), AWS NLB | Nginx, HAProxy (HTTP mode), AWS ALB |

### When to Use Each

**Use Layer 4 when:**
- Raw TCP/UDP services (non-HTTP): database connections, game servers, DNS
- You need maximum throughput with minimum latency
- You need to handle millions of concurrent connections (L4 is far more efficient per connection)
- Your backend servers handle their own SSL

**Use Layer 7 when:**
- HTTP/HTTPS traffic (the vast majority of web applications)
- You need to route different URLs to different service pools (microservices)
- You need SSL termination at the load balancer (centralized certificate management)
- You need to implement rate limiting, A/B testing, or canary deployments
- You need to add security headers or authentication at the edge

**The most common real-world setup**: Use a Layer 7 load balancer (like AWS ALB or Nginx) for HTTP traffic. If you have extremely high-throughput non-HTTP services, use Layer 4 (AWS NLB).

---

## Load Balancer Architecture in Production

### High Availability for the Load Balancer Itself

A load balancer is itself a single point of failure. In production, you run multiple load balancers:

\`\`\`
Production Setup (AWS):

Internet
   │
   ▼
Route 53 (DNS) ──▶ Elastic IP (floating IP)
                         │
                    ┌────┴─────┐
                    ▼          ▼
               ALB Primary  ALB Standby
               (active)     (takes over if primary fails)
                    │
            ┌───────┼───────┐
            ▼       ▼       ▼
         Server1  Server2  Server3
         (EC2)    (EC2)    (EC2)
\`\`\`

AWS ALB (Application Load Balancer) is itself a managed service that runs across multiple availability zones, so AWS handles the HA for you.

### Global Load Balancing

For global applications, you use DNS-based global load balancing to route users to the nearest data center:

\`\`\`
api.example.com
      │
   Route 53 (GeoDNS)
      │
      ├── US users ──▶ US East load balancer
      ├── EU users ──▶ EU West load balancer
      └── Asia users ──▶ AP Southeast load balancer
\`\`\`

---

## Real-World Load Balancer Tools

| Tool | Type | Best For |
|---|---|---|
| Nginx | L7 (also L4) | HTTP reverse proxy, static files, SSL termination |
| HAProxy | L4 + L7 | High performance, TCP + HTTP, advanced routing |
| AWS ALB | L7 | Managed HTTP(S) LB on AWS, integrates with ECS/EKS |
| AWS NLB | L4 | Managed TCP/UDP LB on AWS, ultra-low latency |
| Envoy | L7 | Service mesh sidecar, gRPC, advanced observability |
| Traefik | L7 | Kubernetes-native, auto-discovers services |
| Cloudflare | L7 + CDN | Global LB + DDoS protection at edge |
`,

  codeExamples: [
    {
      title: 'Load Balancing Algorithms Implementation',
      code: `// Implementing the core load balancing algorithms from scratch

interface Server {
  id: string;
  host: string;
  weight: number;        // for weighted algorithms
  connections: number;   // current active connections
  healthy: boolean;
}

// 1. Round Robin
class RoundRobinBalancer {
  private currentIndex = 0;

  selectServer(servers: Server[]): Server | null {
    const healthy = servers.filter(s => s.healthy);
    if (healthy.length === 0) return null;

    const server = healthy[this.currentIndex % healthy.length];
    this.currentIndex = (this.currentIndex + 1) % healthy.length;
    return server;
  }
}

// 2. Least Connections
class LeastConnectionsBalancer {
  selectServer(servers: Server[]): Server | null {
    const healthy = servers.filter(s => s.healthy);
    if (healthy.length === 0) return null;

    return healthy.reduce((least, current) =>
      current.connections < least.connections ? current : least
    );
  }
}

// 3. Weighted Least Connections
class WeightedLeastConnectionsBalancer {
  selectServer(servers: Server[]): Server | null {
    const healthy = servers.filter(s => s.healthy);
    if (healthy.length === 0) return null;

    // Score = connections / weight. Lower score = better candidate.
    return healthy.reduce((best, current) => {
      const bestScore = best.connections / best.weight;
      const currentScore = current.connections / current.weight;
      return currentScore < bestScore ? current : best;
    });
  }
}

// 4. IP Hashing
class IPHashBalancer {
  selectServer(servers: Server[], clientIp: string): Server | null {
    const healthy = servers.filter(s => s.healthy);
    if (healthy.length === 0) return null;

    const hash = clientIp.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);

    const index = Math.abs(hash) % healthy.length;
    return healthy[index];
  }
}

// 5. Consistent Hashing
class ConsistentHashBalancer {
  private ring = new Map<number, Server>(); // position → server
  private readonly virtualNodes = 150;

  addServer(server: Server): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const position = this.hash(\`\${server.id}:\${i}\`);
      this.ring.set(position, server);
    }
  }

  removeServer(server: Server): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const position = this.hash(\`\${server.id}:\${i}\`);
      this.ring.delete(position);
    }
  }

  selectServer(key: string): Server | null {
    if (this.ring.size === 0) return null;

    const keyHash = this.hash(key);
    const sortedPositions = [...this.ring.keys()].sort((a, b) => a - b);

    // Find the first position >= keyHash (clockwise on ring)
    const targetPosition = sortedPositions.find(pos => pos >= keyHash)
      ?? sortedPositions[0]; // wrap around to beginning

    return this.ring.get(targetPosition) ?? null;
  }

  private hash(key: string): number {
    let hash = 2166136261;
    for (const char of key) {
      hash ^= char.charCodeAt(0);
      hash = (hash * 16777619) >>> 0;
    }
    return hash;
  }
}

// Demonstration
const servers: Server[] = [
  { id: 'server-1', host: '10.0.1.1:8080', weight: 1, connections: 12, healthy: true },
  { id: 'server-2', host: '10.0.1.2:8080', weight: 3, connections: 8,  healthy: true },
  { id: 'server-3', host: '10.0.1.3:8080', weight: 2, connections: 4,  healthy: false },
];

const lc = new LeastConnectionsBalancer();
const wlc = new WeightedLeastConnectionsBalancer();

console.log('Least Connections:');
console.log(lc.selectServer(servers)?.id);
// server-2 has 8 connections vs server-1's 12 (server-3 unhealthy)

console.log('Weighted Least Connections:');
// Server 1: score = 12/1 = 12.0
// Server 2: score = 8/3 = 2.67 ← wins
console.log(wlc.selectServer(servers)?.id);

const ch = new ConsistentHashBalancer();
servers.filter(s => s.healthy).forEach(s => ch.addServer(s));
console.log('Consistent Hashing (user-123):', ch.selectServer('user-123')?.id);
console.log('Consistent Hashing (user-456):', ch.selectServer('user-456')?.id);`,
      output: `Least Connections:
server-2  (8 connections < 12 connections)

Weighted Least Connections:
server-2  (score 8/3=2.67 beats server-1 score 12/1=12.0)

Consistent Hashing (user-123): server-1
Consistent Hashing (user-456): server-2
(same keys always map to same servers)`,
      explanation:
        'Weighted Least Connections is the most intelligent algorithm: it accounts for both current load (connection count) and server capacity (weight). A server with weight=3 needs 3x more connections than a weight=1 server before it is considered "equally loaded." Consistent hashing is different in purpose — it provides stable routing so the same user/key always goes to the same server, with minimal disruption when servers join or leave.',
    },
    {
      title: 'Health Check Monitor',
      code: `// Production-grade health check monitoring

interface ServerStatus {
  id: string;
  host: string;
  port: number;
  healthy: boolean;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastCheckTime: number;
  lastStatusCode: number | null;
  responseTimeMs: number | null;
}

interface HealthCheckConfig {
  intervalMs: number;        // check every N milliseconds
  timeoutMs: number;         // fail if no response within N ms
  failureThreshold: number;  // mark unhealthy after N consecutive failures
  successThreshold: number;  // mark healthy again after N consecutive successes
  healthPath: string;        // e.g. '/health'
}

class HealthChecker {
  private serverStatuses: Map<string, ServerStatus>;
  private timer: ReturnType<typeof setInterval> | null = null;
  private onStatusChange: (server: ServerStatus, wasHealthy: boolean) => void;

  constructor(
    servers: { id: string; host: string; port: number }[],
    private config: HealthCheckConfig,
    onStatusChange: (server: ServerStatus, wasHealthy: boolean) => void,
  ) {
    this.onStatusChange = onStatusChange;
    this.serverStatuses = new Map(
      servers.map(s => [s.id, {
        ...s,
        healthy: true,
        consecutiveFailures: 0,
        consecutiveSuccesses: 0,
        lastCheckTime: 0,
        lastStatusCode: null,
        responseTimeMs: null,
      }])
    );
  }

  start(): void {
    this.checkAll();
    this.timer = setInterval(() => this.checkAll(), this.config.intervalMs);
    console.log(\`Health checker started. Checking \${this.serverStatuses.size} servers every \${this.config.intervalMs}ms.\`);
  }

  stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  getHealthyServers(): ServerStatus[] {
    return [...this.serverStatuses.values()].filter(s => s.healthy);
  }

  private async checkAll(): Promise<void> {
    // Check all servers in parallel — do not let one slow server block others
    await Promise.all([...this.serverStatuses.values()].map(s => this.checkServer(s)));
  }

  private async checkServer(server: ServerStatus): Promise<void> {
    const startTime = Date.now();
    const wasHealthy = server.healthy;

    try {
      const statusCode = await this.makeHealthRequest(server);
      server.lastCheckTime = startTime;
      server.lastStatusCode = statusCode;
      server.responseTimeMs = Date.now() - startTime;

      if (statusCode >= 200 && statusCode < 300) {
        server.consecutiveFailures = 0;
        server.consecutiveSuccesses++;
        if (!server.healthy && server.consecutiveSuccesses >= this.config.successThreshold) {
          server.healthy = true;
          this.onStatusChange(server, wasHealthy);
        }
      } else {
        this.recordFailure(server, wasHealthy);
      }
    } catch {
      server.lastCheckTime = startTime;
      server.lastStatusCode = null;
      server.responseTimeMs = null;
      this.recordFailure(server, wasHealthy);
    }
  }

  private recordFailure(server: ServerStatus, wasHealthy: boolean): void {
    server.consecutiveFailures++;
    server.consecutiveSuccesses = 0;
    if (server.healthy && server.consecutiveFailures >= this.config.failureThreshold) {
      server.healthy = false;
      this.onStatusChange(server, wasHealthy);
    }
  }

  private makeHealthRequest(server: ServerStatus): Promise<number> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('timeout')), this.config.timeoutMs);
      // In production: use http.request(...)
      // Simplified: simulate response
      clearTimeout(timeout);
      resolve(200);
    });
  }
}

const checker = new HealthChecker(
  [
    { id: 'api-1', host: '10.0.1.1', port: 8080 },
    { id: 'api-2', host: '10.0.1.2', port: 8080 },
  ],
  { intervalMs: 5000, timeoutMs: 3000, failureThreshold: 3, successThreshold: 2, healthPath: '/health' },
  (server, wasHealthy) => {
    if (!server.healthy) {
      console.error(\`Server \${server.id} UNHEALTHY after \${server.consecutiveFailures} failures\`);
    } else {
      console.log(\`Server \${server.id} RECOVERED after \${server.consecutiveSuccesses} successes\`);
    }
  }
);

checker.start();`,
      explanation:
        'Health checks use two separate thresholds: failureThreshold and successThreshold. The asymmetry is intentional — fail fast (3 failures to mark unhealthy) but recover cautiously (2 successes to mark healthy again). Parallel checks via Promise.all are critical: you must not let a slow/unresponsive server block health checks for all other servers.',
    },
    {
      title: 'Nginx Layer 7 Configuration',
      code: `# nginx.conf — Production Layer 7 Load Balancer
# This is Nginx configuration syntax, not TypeScript

# Upstream server pools — one per service
upstream api_servers {
    least_conn;
    server 10.0.1.1:8080 weight=3;   # high-capacity server
    server 10.0.1.2:8080 weight=3;
    server 10.0.1.3:8080 weight=1;   # low-capacity server
    keepalive 32;
}

upstream image_servers {
    least_conn;
    server 10.0.2.1:8080;
    server 10.0.2.2:8080;
    server 10.0.2.3:8080;
}

upstream static_servers {
    round_robin;
    server 10.0.3.1:80;
    server 10.0.3.2:80;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    # SSL Termination — a Layer 7 exclusive capability
    ssl_certificate     /etc/ssl/certs/api.example.com.crt;
    ssl_certificate_key /etc/ssl/private/api.example.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # URL-based routing — a Layer 7 exclusive capability
    location /api/images/ {
        proxy_pass http://image_servers;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        proxy_pass http://static_servers;
        proxy_cache_valid 200 1d;
    }

    location /api/ {
        proxy_pass http://api_servers;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 5s;
        proxy_read_timeout    60s;
    }
}`,
      output: `Traffic routing:
  GET /api/images/photo.jpg → image_servers pool (least_conn)
  GET /static/app.js        → static_servers pool (round_robin, cached 1 day)
  POST /api/orders          → api_servers pool   (least_conn, weighted)

SSL is terminated at Nginx.
Backend servers receive plain HTTP.
X-Real-IP gives backends the real client IP.`,
      explanation:
        'This Nginx config demonstrates Layer 7 power: URL-based routing sends image requests to a specialized image server pool, static assets to a cached static pool, and API requests to the main application pool. Each pool uses the best algorithm for its workload. SSL is terminated centrally at Nginx — only one place manages certificates. X-Real-IP lets backend servers see the real client IP for analytics and rate limiting.',
    },
  ],

  commonMistakes: [
    'Running a single load balancer — it is itself a single point of failure; in production, use multiple LB instances or a managed service (AWS ALB) that is inherently multi-AZ',
    'Using sticky sessions with server-side memory sessions — when the target server crashes, the session is gone; externalize sessions to Redis instead',
    'Using Round Robin when request processing times vary significantly — expensive requests accumulate on unlucky servers; use Least Connections',
    'Health check endpoints that always return 200 regardless of actual application state — the endpoint must check real dependencies (DB, cache) and return 503 if they are down',
    'Setting health check thresholds too low (1 failure = unhealthy) — causes flapping on transient network issues; use 3 consecutive failures minimum',
    'Forgetting the X-Real-IP or X-Forwarded-For header — backend servers see the load balancer IP instead of the client IP, breaking rate limiting and geo-detection',
    'Not setting proxy timeouts — if a backend hangs, the load balancer holds the connection indefinitely, exhausting the connection pool',
    'Choosing Layer 4 for HTTP microservices traffic where URL-based routing is needed — you lose content-aware routing capability',
    'Not draining connections when removing a server — in-flight requests are abruptly cut off; use connection draining (graceful removal) instead',
    'Ignoring the load balancer as a potential bottleneck itself — at extreme scale, the LB can become the saturation point; plan for LB horizontal scaling too',
  ],

  interviewQuestions: [
    {
      question: 'What happens when a backend server goes down — how does the load balancer handle it?',
      answer:
        'The load balancer detects failure through health checks. In active health checking, it sends requests (e.g., GET /health) to each server at regular intervals (e.g., every 5 seconds). If a server fails to respond or returns an error for N consecutive checks (configurable threshold — typically 3), it is marked unhealthy and traffic stops routing to it. In-flight requests may be retried on another server depending on configuration. Remaining healthy servers absorb the redistributed load. Monitoring alerts fire. When the server recovers and passes health checks again (typically 2 consecutive successes), it is automatically re-added to the pool. The asymmetric threshold (3 failures to remove, 2 successes to add back) prevents rapid flapping on intermittent issues.',
      difficulty: 'intermediate',
      followUp: ['What is connection draining and why is it important during planned server removals?'],
      tip: 'Mention both failure and recovery thresholds, and explain why they are asymmetric. This level of detail shows production experience.',
    },
    {
      question: 'What is the difference between Layer 4 and Layer 7 load balancers?',
      answer:
        'Layer 4 operates at the TCP/UDP level — it only sees source/destination IPs and ports, forwards raw bytes, and cannot inspect HTTP content. It is extremely fast and efficient but cannot route based on URL, headers, or cookies. Layer 7 operates at the HTTP/HTTPS level — it reads the full HTTP request and can route based on URL path, host header, cookies, query parameters, or any HTTP content. Layer 7 enables: URL-based routing (route /api/images to image servers), SSL termination (centralized certificate management), A/B testing, rate limiting per endpoint, and cookie-based session affinity. Use Layer 4 for raw TCP services (databases, game servers), maximum connection count, or non-HTTP protocols. Use Layer 7 (the default for web applications) when you need any content-aware routing. AWS ALB = Layer 7, AWS NLB = Layer 4.',
      difficulty: 'advanced',
      followUp: ['How does SSL termination at the load balancer affect end-to-end encryption?'],
      tip: 'Give concrete examples of what Layer 7 can do that Layer 4 cannot — URL routing is the clearest one. Name real products (AWS ALB/NLB, Nginx) to ground the answer.',
    },
    {
      question: 'Why is Consistent Hashing better than simple IP Hashing when servers are added or removed?',
      answer:
        'With simple IP hashing, you map a client IP to a server using hash(IP) % server_count. When you add or remove a server, server_count changes, which changes the modulo result for essentially every IP — all clients are suddenly remapped to different servers. In a distributed cache, this means every cached item is now on the "wrong" server, causing a cache miss storm. Consistent hashing places servers and client keys on a virtual ring (positions 0 to 2^32). When a server is added or removed, only the clients that were mapped to that specific server move — everyone else stays on their current server. Adding one server to a four-server cluster remaps roughly 25% of keys (1/4), not all of them. Virtual nodes (150 positions per server) ensure the redistribution is even across all remaining servers, not just the adjacent one on the ring.',
      difficulty: 'advanced',
      followUp: ['What are virtual nodes and why are they necessary?'],
      tip: 'The key phrase is "only the affected keys are remapped." This is the core property of consistent hashing. Without it, any cluster change causes full rehashing.',
    },
    {
      question: 'Why are sticky sessions a problem, and what is the correct solution?',
      answer:
        'Sticky sessions route all of a user\'s requests to the same server so their session state (stored in that server\'s local memory) is accessible. Problems: (1) If the server crashes, the user\'s session is gone — they are logged out. (2) Load cannot be rebalanced — users with active sessions are pinned to servers, creating hot servers while others are underutilized. (3) Scaling down or replacing servers disrupts sessions. The correct solution is externalizing session state to a shared store like Redis. Every server reads and writes sessions to Redis. Any server can handle any request from any user. Sessions survive server crashes (Redis can be replicated). You can add/remove servers freely without disrupting anyone. Redis latency (< 1ms) is negligible compared to the benefits.',
      difficulty: 'intermediate',
      followUp: ['When might sticky sessions still be acceptable despite these problems?'],
      tip: 'Frame sticky sessions as a workaround for not externalizing state. The correct architectural answer is: make your servers stateless and store state externally.',
    },
    {
      question: 'You have three servers: 16-core, 8-core, 4-core. Which load balancing algorithm would you choose?',
      answer:
        'Weighted Least Connections, with weights proportional to capacity: 16-core gets weight=4, 8-core gets weight=2, 4-core gets weight=1. The score for each server is active_connections / weight. The server with the lowest score receives the next request. This means the 16-core server handles 4x the connections of the 4-core server before it is considered "equally loaded." It adapts to both heterogeneous capacity (via weights) and variable request cost (via real-time connection tracking). If all requests had identical processing time, Weighted Round Robin would suffice. But requests always vary in the real world, so Weighted Least Connections provides better load distribution.',
      difficulty: 'advanced',
      followUp: ['How would you handle a situation where one server starts running slower than its weight suggests?'],
      tip: 'State the score formula explicitly: score = connections / weight. Lower score wins. This demonstrates mechanical understanding, not just conceptual familiarity.',
    },
  ],

  exercises: [
    {
      id: 'lb-ex-1',
      title: 'Build a Load Balancer with Health Monitoring',
      description:
        'Implement a load balancer class combining Weighted Round Robin with health monitoring. It should: (1) Distribute requests across healthy servers using weights, (2) Mark a server unhealthy after 3 consecutive failures via reportResult(), (3) Mark it healthy again after 2 consecutive successes, (4) Return null if no healthy servers exist, (5) Log a message when a server transitions between healthy and unhealthy.',
      starterCode: `interface Server {
  id: string;
  url: string;
  weight: number;
  healthy: boolean;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

class LoadBalancer {
  private servers: Server[];
  private rrIndex = 0;
  private rrWeight = 0;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly SUCCESS_THRESHOLD = 2;

  constructor(servers: Omit<Server, 'healthy' | 'consecutiveFailures' | 'consecutiveSuccesses'>[]) {
    this.servers = servers.map(s => ({
      ...s,
      healthy: true,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
    }));
    this.rrWeight = Math.max(...this.servers.map(s => s.weight));
  }

  route(): string | null {
    // TODO: Weighted Round Robin across healthy servers only
    return null;
  }

  reportResult(serverId: string, success: boolean): void {
    // TODO: Update failure/success counts and health status
  }

  getStatus(): { id: string; healthy: boolean }[] {
    return this.servers.map(({ id, healthy }) => ({ id, healthy }));
  }
}`,
      solution: `interface Server {
  id: string;
  url: string;
  weight: number;
  healthy: boolean;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

class LoadBalancer {
  private servers: Server[];
  private rrIndex = 0;
  private rrWeight = 0;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly SUCCESS_THRESHOLD = 2;

  constructor(servers: Omit<Server, 'healthy' | 'consecutiveFailures' | 'consecutiveSuccesses'>[]) {
    this.servers = servers.map(s => ({
      ...s,
      healthy: true,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
    }));
    this.rrWeight = Math.max(...this.servers.map(s => s.weight));
  }

  route(): string | null {
    const healthy = this.servers.filter(s => s.healthy);
    if (healthy.length === 0) return null;

    const maxWeight = Math.max(...healthy.map(s => s.weight));
    const gcd = this.computeGCD(healthy.map(s => s.weight));

    // Weighted Round Robin: cycle through servers, select when weight >= threshold
    for (let attempts = 0; attempts < healthy.length * maxWeight; attempts++) {
      this.rrIndex = (this.rrIndex + 1) % healthy.length;
      if (this.rrIndex === 0) {
        this.rrWeight -= gcd;
        if (this.rrWeight <= 0) this.rrWeight = maxWeight;
      }
      if (healthy[this.rrIndex].weight >= this.rrWeight) {
        return healthy[this.rrIndex].url;
      }
    }

    return healthy[0].url; // fallback
  }

  reportResult(serverId: string, success: boolean): void {
    const server = this.servers.find(s => s.id === serverId);
    if (!server) return;

    if (success) {
      server.consecutiveFailures = 0;
      server.consecutiveSuccesses++;
      if (!server.healthy && server.consecutiveSuccesses >= this.SUCCESS_THRESHOLD) {
        server.healthy = true;
        console.log(\`Server \${serverId} HEALTHY (after \${server.consecutiveSuccesses} successes)\`);
      }
    } else {
      server.consecutiveSuccesses = 0;
      server.consecutiveFailures++;
      if (server.healthy && server.consecutiveFailures >= this.FAILURE_THRESHOLD) {
        server.healthy = false;
        console.log(\`Server \${serverId} UNHEALTHY (after \${server.consecutiveFailures} failures)\`);
      }
    }
  }

  getStatus(): { id: string; healthy: boolean }[] {
    return this.servers.map(({ id, healthy }) => ({ id, healthy }));
  }

  private computeGCD(nums: number[]): number {
    return nums.reduce((a, b) => { while (b) { [a, b] = [b, a % b]; } return a; });
  }
}

// Test
const lb = new LoadBalancer([
  { id: 'server-a', url: 'http://10.0.1.1', weight: 3 },
  { id: 'server-b', url: 'http://10.0.1.2', weight: 1 },
]);

// server-a should get 75% of traffic
const counts: Record<string, number> = {};
for (let i = 0; i < 8; i++) {
  const url = lb.route()!;
  counts[url] = (counts[url] ?? 0) + 1;
}
console.log('Routing distribution:', counts);

// Fail server-a 3 times
lb.reportResult('server-a', false);
lb.reportResult('server-a', false);
lb.reportResult('server-a', false); // → UNHEALTHY log

console.log('After failure:', lb.route()); // only server-b

// Recover server-a
lb.reportResult('server-a', true);
lb.reportResult('server-a', true); // → HEALTHY log
console.log('After recovery:', lb.getStatus());`,
      hints: [
        'Weighted Round Robin: reduce the weight threshold by GCD each time the index wraps; a server is selected when its weight >= threshold',
        'The health tracking is separate from routing — routing only checks the healthy flag',
        'Fail fast (3 failures) and recover cautiously (2 successes) — the asymmetry is intentional',
        'When all servers are unhealthy, return null — the caller must handle this gracefully',
      ],
    },
    {
      id: 'lb-ex-2',
      title: 'Consistent Hashing Ring — Impact of Server Changes',
      description:
        'Implement a consistent hash ring and demonstrate what happens when servers are added or removed. Run two scenarios: (1) Add a 4th server to a 3-server cluster and count how many of 10 sample keys are remapped. (2) Remove one server from a 3-server cluster and count remapped keys. The expected remapping rate should be approximately 1/N of all keys.',
      starterCode: `class ConsistentHashRing {
  private ring = new Map<number, string>(); // position → serverId
  private readonly virtualNodes: number;

  constructor(virtualNodes = 150) {
    this.virtualNodes = virtualNodes;
  }

  addServer(serverId: string): void {
    // TODO: Place virtualNodes positions for this server on the ring
  }

  removeServer(serverId: string): void {
    // TODO: Remove all virtual node positions for this server
  }

  getServer(key: string): string | null {
    // TODO: Find the next server clockwise from this key's hash position
    return null;
  }

  private hash(key: string): number {
    let h = 5381;
    for (const c of key) { h = ((h << 5) + h) + c.charCodeAt(0); h = h & h; }
    return Math.abs(h);
  }
}`,
      solution: `class ConsistentHashRing {
  private ring = new Map<number, string>();
  private readonly virtualNodes: number;

  constructor(virtualNodes = 150) {
    this.virtualNodes = virtualNodes;
  }

  addServer(serverId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const position = this.hash(\`\${serverId}:vnode:\${i}\`);
      this.ring.set(position, serverId);
    }
  }

  removeServer(serverId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const position = this.hash(\`\${serverId}:vnode:\${i}\`);
      this.ring.delete(position);
    }
  }

  getServer(key: string): string | null {
    if (this.ring.size === 0) return null;
    const keyHash = this.hash(key);
    const positions = [...this.ring.keys()].sort((a, b) => a - b);
    const target = positions.find(pos => pos >= keyHash) ?? positions[0];
    return this.ring.get(target) ?? null;
  }

  private hash(key: string): number {
    let h = 5381;
    for (const c of key) { h = ((h << 5) + h) + c.charCodeAt(0); h = h & h; }
    return Math.abs(h);
  }
}

const sampleKeys = [
  'user:1001', 'user:1002', 'user:1003', 'session:abc', 'session:def',
  'cache:product:42', 'cache:product:99', 'order:555', 'order:666', 'order:777',
];

// Scenario 1: Add a 4th server
console.log('=== Adding a server ===');
const ring1 = new ConsistentHashRing(150);
['server-A', 'server-B', 'server-C'].forEach(s => ring1.addServer(s));

const before1 = new Map(sampleKeys.map(k => [k, ring1.getServer(k)]));
ring1.addServer('server-D');
const after1 = new Map(sampleKeys.map(k => [k, ring1.getServer(k)]));

let remapped1 = 0;
sampleKeys.forEach(k => {
  if (before1.get(k) !== after1.get(k)) {
    remapped1++;
    console.log(\`  \${k}: \${before1.get(k)} → \${after1.get(k)}\`);
  }
});
console.log(\`Remapped: \${remapped1}/\${sampleKeys.length} (~25% expected for 3→4 servers)\`);

// Scenario 2: Remove a server
console.log('\\n=== Removing a server ===');
const ring2 = new ConsistentHashRing(150);
['server-A', 'server-B', 'server-C'].forEach(s => ring2.addServer(s));

const before2 = new Map(sampleKeys.map(k => [k, ring2.getServer(k)]));
ring2.removeServer('server-B');
const after2 = new Map(sampleKeys.map(k => [k, ring2.getServer(k)]));

let remapped2 = 0;
sampleKeys.forEach(k => {
  if (before2.get(k) !== after2.get(k)) {
    remapped2++;
    console.log(\`  \${k}: \${before2.get(k)} → \${after2.get(k)}\`);
  }
});
console.log(\`Remapped: \${remapped2}/\${sampleKeys.length} (~33% expected for removing 1 of 3 servers)\`);`,
      hints: [
        'Virtual nodes (150 per server) ensure the ring is well-distributed — fewer virtual nodes causes hot spots',
        'When adding 1 server to a 3-server cluster, expect roughly 25% (1/4) of keys to move',
        'When removing a server, only its keys move — they go to the next server clockwise',
        'Sort ring positions before binary-searching — the ring is an ordered structure and order determines routing',
      ],
    },
  ],

  keyTakeaways: [
    'A load balancer distributes traffic across multiple servers through a single entry point, providing both horizontal scalability and fault tolerance — without it, you cannot benefit from multiple servers',
    'Health checks with asymmetric thresholds (fail fast at 3 failures, recover cautiously at 2 successes) are the mechanism that makes automatic failover work without flapping',
    'Match your algorithm to your workload: Round Robin for identical servers with uniform requests; Least Connections for variable-duration requests; Weighted variants for heterogeneous server pools',
    'Consistent hashing solves the distributed cache key distribution problem: when a server is added or removed, only ~1/N keys are remapped, preventing cache miss storms',
    'Layer 4 LB operates at the TCP level (fast, blind to content); Layer 7 operates at the HTTP level (URL routing, SSL termination, header manipulation) — use L7 for virtually all web traffic',
    'Sticky sessions create correctness and scaling problems; the correct solution is stateless servers with session state externalized to Redis',
    'The load balancer itself must not be a single point of failure — use managed services (AWS ALB) or run multiple LB instances; a single LB defeats the purpose of the redundancy behind it',
    'In system design interviews, justify your algorithm choice, explain health check mechanics, address the LB as a SPOF, and clarify whether you need L4 or L7 based on routing requirements',
  ],
};
