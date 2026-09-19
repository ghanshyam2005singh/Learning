import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // ========================================
  // BEGINNER (10 questions)
  // ========================================
  {
    question: 'What is the difference between horizontal and vertical scaling?',
    answer:
      'Vertical scaling (scaling up) means adding more resources to a single machine — more CPU, RAM, or faster storage. It is simple but has a hard ceiling: you cannot add infinite RAM to one server, and it creates a single point of failure. Horizontal scaling (scaling out) means adding more machines and distributing load across them. It has no theoretical upper limit and provides redundancy — if one machine fails, others continue serving traffic. The tradeoff: horizontal scaling requires stateless servers, a load balancer, and distributed data management, which adds operational complexity. Most systems use vertical scaling first (cheapest and simplest), then transition to horizontal scaling when vertical limits are reached.',
    difficulty: 'beginner',
    followUp: [
      'At what point would you switch from vertical to horizontal scaling?',
      'What does "stateless" mean and why is it required for horizontal scaling?',
    ],
    tip: 'Mention single point of failure for vertical scaling — it shows you think about reliability, not just performance.',
  },
  {
    question: 'What is a load balancer and why is it used?',
    answer:
      "A load balancer is a server that distributes incoming requests across multiple backend servers. Without a load balancer, all traffic hits one server, which becomes a bottleneck and a single point of failure. With a load balancer, you can add more servers horizontally, and traffic is distributed evenly. Load balancers also perform health checks — automatically removing unhealthy servers from the pool and re-adding them when they recover. They can also handle SSL termination (decrypt HTTPS once at the load balancer so backend servers don't need to), session persistence (sticky sessions), and DDoS protection. Common algorithms include round-robin, least connections, and IP hash.",
    difficulty: 'beginner',
    followUp: [
      'What is the difference between an L4 and L7 load balancer?',
      "How do you prevent the load balancer itself from becoming a single point of failure?",
    ],
  },
  {
    question: 'What is caching and what problems does it solve?',
    answer:
      'Caching stores the results of expensive operations in a fast, temporary store so they can be served quickly without re-computation. It solves two primary problems: latency and load. A database query that takes 50ms becomes a Redis cache read in under 1ms. If 100,000 users request the same data in a minute, with caching the database is queried once (or a few times) rather than 100,000 times, dramatically reducing database load. Caching works because of the temporal locality principle — recently accessed data is likely to be accessed again soon — and the 80/20 rule — 20% of data accounts for 80% of reads. The fundamental challenge of caching is cache invalidation: ensuring the cache never serves stale data longer than acceptable.',
    difficulty: 'beginner',
    followUp: [
      'What are the main cache eviction strategies (LRU, LFU, TTL)?',
      'What is cache invalidation and why is it considered hard?',
    ],
  },
  {
    question: 'What is the difference between SQL and NoSQL databases?',
    answer:
      'SQL (relational) databases organize data in tables with predefined schemas and relationships. They guarantee ACID properties (Atomicity, Consistency, Isolation, Durability) and support complex joins and transactions. They scale vertically well but horizontal sharding is complex. NoSQL databases sacrifice some guarantees for flexibility and horizontal scalability. Types include: key-value stores (Redis, DynamoDB) for sub-millisecond lookups, document stores (MongoDB) for flexible JSON-like structures, column-family stores (Cassandra) for massive write throughput, and graph databases (Neo4j) for connected data. Choose SQL when you need ACID transactions, complex multi-table queries, or a well-defined relational schema. Choose NoSQL when you need massive write throughput, flexible schema, or data patterns (time-series, graphs) that map poorly to tables.',
    difficulty: 'beginner',
    followUp: [
      'Can NoSQL databases provide ACID guarantees?',
      'When would you use both SQL and NoSQL in the same system?',
    ],
    tip: "Don't say NoSQL is 'better for scale' — SQL can scale with proper indexing and replication up to very high loads. The choice depends on access patterns and consistency requirements.",
  },
  {
    question: 'What is a CDN and when should you use one?',
    answer:
      "A Content Delivery Network (CDN) is a globally distributed network of servers that cache and serve content from locations close to end users. Without a CDN, a user in Tokyo requesting assets from a server in New York experiences ~150ms of network latency just for the connection, before any data is transferred. With a CDN, that content is cached in a Tokyo edge server and served in under 5ms. CDNs are essential when: you have a globally distributed user base, you serve static assets (JavaScript, CSS, images, fonts), you serve video content, or you need DDoS protection at the edge. CDNs also reduce origin server load — the origin is only hit once per edge location per cache TTL, then all subsequent requests are served from cache.",
    difficulty: 'beginner',
    followUp: [
      'How does a CDN handle cache invalidation when you deploy a new version of your website?',
      "What is the difference between a CDN's push model and pull model?",
    ],
  },
  {
    question: 'What is a database index and what tradeoffs does it introduce?',
    answer:
      "A database index is a separate data structure (typically a B-tree or hash map) that stores a subset of columns and pointers to the full rows, enabling the database to find rows without scanning the entire table. Without an index, a query like 'SELECT * FROM users WHERE email = X' scans every row — O(N) time. With an index on the email column, the database does a B-tree lookup — O(log N) time, dramatically faster. The tradeoffs: indexes consume additional disk space, and every INSERT, UPDATE, and DELETE must update all relevant indexes, slowing writes. In a read-heavy system, adding indexes to common query columns is almost always worth it. In a write-heavy system, excessive indexes can hurt write throughput significantly.",
    difficulty: 'beginner',
    followUp: [
      'What is a composite index and when is it more efficient than individual column indexes?',
      'What is a covering index?',
    ],
  },
  {
    question: 'What is eventual consistency?',
    answer:
      "Eventual consistency is a consistency model where, after a write, all nodes in a distributed system will eventually reflect that write — but there is no guarantee of when. During the propagation window (typically milliseconds to seconds), different nodes may return different values for the same key. This is acceptable for data where brief staleness has low cost: social media feeds (seeing a post 1 second late is fine), DNS records (propagation takes minutes), product recommendation engines (slightly stale recommendations are unnoticeable). Eventual consistency enables higher availability and throughput because nodes don't need to coordinate before responding. It is NOT acceptable for data where consistency is critical: bank balances, inventory counts, authentication state.",
    difficulty: 'beginner',
    followUp: [
      'How does eventual consistency relate to the CAP theorem?',
      'What is "read-your-writes" consistency and when is it important?',
    ],
  },
  {
    question: 'What is a REST API and what makes an API RESTful?',
    answer:
      "REST (Representational State Transfer) is an architectural style for web APIs built on HTTP. An API is RESTful when it follows these constraints: (1) Stateless — each request contains all information needed; the server stores no client session state between requests. (2) Client-server separation — client and server evolve independently. (3) Uniform interface — resources are identified by URLs (/users/123), manipulated using standard HTTP methods (GET to read, POST to create, PUT/PATCH to update, DELETE to remove). (4) HTTP response codes convey outcome: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error. RESTfulness is about using HTTP semantically correctly, not just using HTTP for communication.",
    difficulty: 'beginner',
    followUp: ['What is the difference between PUT and PATCH?', 'When would you choose gRPC over REST?'],
  },
  {
    question: 'What is a message queue and what problems does it solve?',
    answer:
      'A message queue is an asynchronous communication mechanism where producers write messages to a queue and consumers read them at their own pace. It solves several problems: (1) Decoupling — the payment service can publish "payment_completed" to a queue; the email service, inventory service, and analytics service each consume it independently. If the email service is down, the payment still succeeds and the email is sent when it recovers. (2) Load leveling — a traffic spike generates 10,000 requests per second, but your email server can only process 100 per second. The queue buffers the excess; the email server drains it at its own rate. (3) Retry — failed message processing is retried without the producer knowing or caring. Common implementations: Kafka, RabbitMQ, AWS SQS.',
    difficulty: 'beginner',
    followUp: [
      'What is the difference between a message queue and a message broker?',
      'How do you ensure a message is processed exactly once?',
    ],
  },
  {
    question: 'What is a microservice and how is it different from a monolith?',
    answer:
      "A monolith is a single deployable unit where all features — authentication, product catalog, orders, payments — are bundled together and deployed as one application. A microservice is one small, independently deployable service that owns a single business capability and its own database. The benefits of microservices: independent scaling (scale the order service separately from the user service), independent deployment (deploy a payment fix without redeploying the entire application), technology flexibility (use Node.js for the API, Python for ML, Go for the high-throughput service). The costs: network latency between services, distributed tracing complexity, distributed transactions, service discovery, and the operational overhead of deploying and monitoring dozens of services. For most teams and scales, start with a monolith.",
    difficulty: 'beginner',
    followUp: ['When is a monolith preferable to microservices?', 'What is a service mesh?'],
  },

  // ========================================
  // INTERMEDIATE (10 questions)
  // ========================================
  {
    question: 'How would you design a URL shortener?',
    answer:
      "Start with requirements: users create short URLs, short URLs redirect to originals, optionally with analytics. The system is read-heavy (100:1 ratio). Key challenge: generate unique 6-character codes. Best approach: Base62 encoding of auto-increment database IDs — 6 characters gives 62^6 = 56 billion unique codes with zero collision risk (IDs are unique by definition). Store URL mappings in a key-value store (DynamoDB) for O(1) lookups. Cache the top 20% of URLs in Redis — these handle 80% of traffic. Use 302 redirects (not 301) to capture analytics: 301 is cached by browsers and bypasses your server after the first visit. Architecture: client → load balancer → redirect service → Redis (cache hit 90%) → DynamoDB (10% misses). At 100K reads/second, Redis makes this trivially scalable.",
    difficulty: 'intermediate',
    followUp: [
      'How would you support custom aliases?',
      'How would you add click analytics without slowing down redirects?',
      'How would you handle URL expiration?',
    ],
  },
  {
    question: 'How does consistent hashing work and why is it used?',
    answer:
      "Standard hashing assigns a key to server N = hash(key) % numServers. When you add or remove a server, numServers changes, and almost every key remaps to a different server — causing a massive cache miss storm. Consistent hashing arranges all servers on a virtual circular ring using hash(serverName). Each key is assigned to the first server clockwise from hash(key) on the ring. When a server is added, only the keys between it and its predecessor on the ring need to remap — approximately 1/N of all keys. When a server is removed, only its keys move to the next server. Virtual nodes (each server has multiple ring positions) improve load distribution and make the impact of adding/removing a server even smaller. Used in distributed caches (Redis Cluster), database sharding (Cassandra), and CDN routing.",
    difficulty: 'intermediate',
    followUp: [
      "What is the 'virtual nodes' technique and why is it needed?",
      'How does Cassandra use consistent hashing?',
    ],
    tip: 'Drawing the ring in an interview is far more effective than explaining it verbally.',
  },
  {
    question: 'What is the CAP theorem and how does it affect system design?',
    answer:
      "CAP theorem states that a distributed system can guarantee only two of three properties simultaneously: Consistency (all nodes return the same data at the same time), Availability (every request receives a response, even if not the latest), and Partition Tolerance (the system continues despite network failures between nodes). Since network partitions are inevitable in any distributed system, the practical choice is between CP (stay consistent, potentially unavailable during partition) and AP (stay available, potentially serving stale data). CP databases: HBase, Zookeeper, CockroachDB — used for banking, locks, coordination. AP databases: Cassandra, DynamoDB, CouchDB — used for social feeds, user sessions, product catalogs. The nuance: this is a spectrum, not a binary — systems can tune how much consistency they sacrifice for availability via tunable consistency levels.",
    difficulty: 'intermediate',
    followUp: [
      'What is the PACELC model and how does it extend CAP?',
      'Can a system be both CP and AP at different times?',
    ],
  },
  {
    question: 'How do microservices communicate with each other?',
    answer:
      'Microservices use two communication patterns. Synchronous: services call each other directly and wait for a response. REST (HTTP/JSON) is the most common, simple to implement and debug. gRPC (HTTP/2 + Protocol Buffers) is 10x faster and strongly typed — preferred for internal high-throughput service calls. Synchronous communication creates temporal coupling: if Service B is slow or down, Service A is blocked or fails. Asynchronous: services publish events to a message queue (Kafka, RabbitMQ, SQS) and consumers process them independently. This decouples services — Service B being down doesn\'t block Service A. Downside: harder to debug (distributed tracing required), and eventual consistency must be designed for. Rule of thumb: use synchronous for user-facing reads that need immediate responses; use asynchronous for writes and background processing.',
    difficulty: 'intermediate',
    followUp: [
      'What is a service mesh and what problems does it solve?',
      'How do you handle a request that spans multiple microservices?',
    ],
  },
  {
    question: 'What is database sharding and when is it needed?',
    answer:
      "Database sharding is horizontal partitioning — splitting a database table across multiple database servers (shards), each holding a subset of the data. It is needed when a single database can no longer handle the write throughput or storage requirements of your system. Sharding strategies: (1) Hash sharding — shard = hash(key) % numShards. Even distribution, but no range queries. (2) Range sharding — shard by value ranges (users A-M on shard 1, N-Z on shard 2). Enables range queries but can create hotspots. (3) Directory sharding — a lookup table maps each key to its shard. Flexible but the lookup table becomes a bottleneck. Trade-offs of sharding: cross-shard queries become expensive (joins across shards require fetching from multiple servers), transactions spanning multiple shards lose ACID guarantees, and adding shards requires re-sharding (redistributing data). Add sharding only when other optimizations (indexing, caching, read replicas) are insufficient.",
    difficulty: 'intermediate',
    followUp: ['What is re-sharding and how do you minimize its impact?', 'How does Cassandra handle sharding internally?'],
  },
  {
    question: 'What is an API gateway and what problems does it solve?',
    answer:
      "An API gateway is a single entry point that sits in front of all microservices and handles cross-cutting concerns. Without it, every microservice must independently implement authentication, rate limiting, logging, SSL termination, and CORS handling — duplicating effort and creating inconsistency. The API gateway centralizes: (1) Authentication/authorization — validate JWT tokens before forwarding requests, so microservices don't need to. (2) Rate limiting — throttle abusive clients at the edge. (3) Request routing — route /api/users to user-service, /api/orders to order-service. (4) Protocol translation — external REST to internal gRPC. (5) Response aggregation — a mobile app might need user + orders + recommendations in one call; the gateway fetches from 3 services and combines the response. (6) SSL termination — decrypt HTTPS once at the gateway. Common tools: Kong, AWS API Gateway, NGINX, Envoy.",
    difficulty: 'intermediate',
    followUp: [
      'What is the difference between an API gateway and a reverse proxy?',
      'How does the API gateway affect latency?',
    ],
  },
  {
    question: 'What is the difference between optimistic and pessimistic locking?',
    answer:
      "Pessimistic locking assumes conflicts will happen and prevents them by locking the resource before reading or modifying it. In SQL: SELECT ... FOR UPDATE acquires a row lock; other transactions block until the lock is released. It guarantees consistency but serializes access, reducing throughput. Best for high-contention scenarios where conflicts are frequent. Optimistic locking assumes conflicts are rare and doesn't lock upfront. Instead, it reads the current version number, performs the update, and checks at commit time that the version hasn't changed: UPDATE ... WHERE version = X. If the version changed (someone else updated it), the transaction retries. No locks means higher concurrency, but high-contention scenarios cause retry storms. Best for low-to-medium contention. Rule: pessimistic for high contention (bank transfers, flash sale reservations at small scale); optimistic for low contention (profile updates, draft edits).",
    difficulty: 'intermediate',
    followUp: [
      'How does MVCC (Multi-Version Concurrency Control) relate to these patterns?',
      'What happens in an optimistic locking retry storm?',
    ],
  },
  {
    question: 'How does a distributed cache work?',
    answer:
      "A distributed cache is a key-value store (like Redis Cluster or Memcached) that runs across multiple nodes, allowing it to store more data than fits on one machine and serve more requests per second than one node can handle. Data is distributed across nodes using consistent hashing — each key maps to a specific node. Client libraries know the ring topology and route requests to the correct node without a central coordinator. Replication: each node can have replica nodes that take over if the primary fails. Cluster Redis (Redis Cluster) uses 16,384 hash slots distributed across nodes; when a node is added, some slots are migrated to it. The key challenge: cache invalidation across nodes — when data changes, all nodes caching that key must be updated or invalidated.",
    difficulty: 'intermediate',
    followUp: [
      'What is the difference between Redis Cluster and Redis Sentinel?',
      'How does Redis Cluster handle a node failure?',
    ],
  },
  {
    question: 'What is the difference between synchronous and asynchronous processing?',
    answer:
      "In synchronous processing, the caller waits for the operation to complete before continuing. A user submits a form, the server processes it, and the user sees the result — all in one request-response cycle. Simple, predictable, easy to debug. In asynchronous processing, the caller submits work and immediately gets an acknowledgment ('accepted'), then the work is processed in the background. The result is delivered later via callback, webhook, polling, or push notification. Asynchronous is needed when: the operation takes too long (video encoding, report generation), throughput must be higher than processing speed (flash sale orders queued for processing), or decoupling is needed (sending email after purchase — email failure should not fail the purchase). Tradeoffs: async adds complexity (job queues, status tracking, dead-letter queues for failures) but enables much higher throughput and resilience.",
    difficulty: 'intermediate',
    followUp: [
      'How do you show a user the status of an async job?',
      'What is a dead-letter queue and why is it important?',
    ],
  },
  {
    question: 'What is rate limiting and how do you implement it at scale?',
    answer:
      'Rate limiting restricts how many requests a client can make in a time window, preventing abuse and protecting services from overload. Common algorithms: (1) Token bucket — each client has a bucket of tokens; each request consumes one token; tokens refill at a fixed rate. Allows brief bursting up to bucket capacity. (2) Sliding window counter — count requests in the last N seconds using timestamps stored in Redis. Accurate, no burst edge cases. (3) Fixed window — count requests per time bucket (e.g., per minute). Simple but allows 2x the limit at window boundaries. Implementation at scale: store counters in Redis. For per-user rate limiting, key = "rate:{userId}:{window}". Redis INCR with EXPIRE is atomic — safe for distributed environments. Place rate limiting at the API gateway to enforce it before requests reach services. For very high throughput, use local in-memory counters with periodic sync to Redis — slightly less accurate but much faster.',
    difficulty: 'intermediate',
    followUp: [
      'How do you rate limit by IP vs by user account?',
      'What should happen when a rate limit is exceeded — reject immediately or queue?',
    ],
  },

  // ========================================
  // ADVANCED (10 questions)
  // ========================================
  {
    question: 'How would you handle the thundering herd problem?',
    answer:
      'The thundering herd occurs when many concurrent requests simultaneously experience a cache miss — typically when a popular cache key expires — and all hit the database at once, potentially overwhelming it. Solutions: (1) Cache lock (mutex): when a miss occurs, one request acquires a lock to fetch from the DB; other requests wait or return a stale value. Implemented with Redis SET NX (set only if not exists). (2) Random TTL jitter: instead of all instances of a key expiring at exactly the same time (e.g., all at 300 seconds), add a random offset (280-320 seconds) so misses are staggered. (3) Background refresh: proactively refresh cache entries before they expire using a background job. The key is never actually expired from users\' perspective. (4) Probabilistic early expiration: each request has a small probability of refreshing the cache earlier than its TTL — distributes refresh load over time. Option 3 is ideal for extremely hot keys like breaking news or trending topics.',
    difficulty: 'advanced',
    followUp: [
      'What is the difference between thundering herd and cache stampede?',
      'How do you implement a distributed mutex for cache locking?',
    ],
    tip: 'Mention multiple solutions and explain when each is appropriate — this shows you understand the nuances rather than having memorized one answer.',
  },
  {
    question: 'How do you ensure exactly-once message delivery in a distributed system?',
    answer:
      "Exactly-once delivery is the hardest delivery guarantee because it must prevent both message loss (at-least-once requires retries) and duplicates (at-most-once drops on failure). The practical solution combines: (1) At-least-once delivery from the broker (retry on failure, acknowledge only after processing). (2) Idempotent consumers: processing the same message twice produces the same result — achieved by checking a deduplication store before processing. Store processed message IDs in Redis or a DB unique constraint. (3) Transactional outbox pattern: instead of publishing to Kafka in a separate operation, write the event to an 'outbox' table in the same DB transaction as your business logic. A separate process (CDC connector) reliably publishes outbox entries to Kafka. Kafka Transactions enable exactly-once across multiple partitions/topics but add significant complexity. True exactly-once is expensive — most production systems implement idempotent at-least-once, which is functionally equivalent for most use cases.",
    difficulty: 'advanced',
    followUp: ['What is the transactional outbox pattern?', 'How does Kafka Streams achieve exactly-once semantics?'],
  },
  {
    question: 'How would you design a distributed lock?',
    answer:
      "A distributed lock prevents concurrent execution of a critical section across multiple servers. Redis-based approach: SET lock_key unique_value NX PX 30000 — sets the key only if it doesn't exist (NX), with 30-second expiry (PX). The expiry prevents deadlocks if the lock holder crashes. Release: only delete the key if its value matches the value you set (using a Lua script for atomicity) — prevents a process from releasing another process's lock. Redlock: Redis's multi-node algorithm uses majority voting across 5+ Redis instances for fault tolerance against a single node failure. Zookeeper/etcd: use ephemeral nodes (automatically deleted when the session ends) for a stronger guarantee — the lock is released even if the process crashes, without relying on TTL accuracy. The hardest problem: GC pauses. If a JVM pauses for longer than the lock TTL, the lock expires, another node acquires it, and two nodes think they own it. Solution: fencing tokens — a monotonically increasing number returned with the lock; storage systems reject writes with stale tokens.",
    difficulty: 'advanced',
    followUp: ['What is a fencing token and why is it needed?', 'When would you use Zookeeper instead of Redis for distributed locks?'],
    tip: 'Mentioning the GC pause problem and fencing tokens distinguishes a deep understanding from surface knowledge.',
  },
  {
    question: 'What is the CQRS pattern and when should you use it?',
    answer:
      "CQRS (Command Query Responsibility Segregation) separates the write model (commands — creating, updating, deleting) from the read model (queries — fetching data for display). In a traditional architecture, the same model serves both reads and writes, which creates tension: reads often need denormalized, joined data optimized for display; writes need normalized data optimized for integrity. With CQRS, writes go to the command model (normalized database, strong consistency), and an event is published. A separate read model consumes these events and builds a denormalized, query-optimized view. Reads query the read model — never the write model. Benefits: read and write sides scale independently, read models can be optimized per use case (a feed view, a search view, a dashboard view — each a separate materialized model). Cost: increased complexity, eventual consistency between write and read sides. Use when read patterns are significantly more complex or diverse than write patterns, or when read and write loads differ substantially.",
    difficulty: 'advanced',
    followUp: ['How does CQRS relate to event sourcing?', 'What are the consistency implications of CQRS?'],
  },
  {
    question: 'What is event sourcing and how does it differ from traditional state storage?',
    answer:
      "Traditional databases store current state — a user's account balance is whatever the last UPDATE set it to. Event sourcing stores the sequence of events that led to the current state — instead of 'balance = 1500', you store 'deposited 1000', 'withdrew 300', 'deposited 800'. Current state is derived by replaying events. Benefits: complete audit trail (every change is recorded with who, what, and when), ability to replay events to reconstruct state at any point in time, natural fit with event-driven architectures, ability to project the same events into multiple different views (CQRS read models). Costs: replaying all events to get current state is slow for long histories (mitigated by periodic snapshots), eventual consistency between the event store and read projections, and paradigm shift from how most developers think about state. Used in financial systems (complete transaction history), compliance-heavy domains, and any system needing full audit capability.",
    difficulty: 'advanced',
    followUp: [
      'How do you handle schema evolution in event sourcing when event formats change?',
      'What is a snapshot in event sourcing and when do you use one?',
    ],
  },
  {
    question: 'What is the Saga pattern and how does it handle distributed transactions?',
    answer:
      "In a microservices architecture, a transaction spanning multiple services (e.g., place order, reserve inventory, charge payment, send confirmation) cannot use a traditional ACID database transaction. The Saga pattern coordinates this as a sequence of local transactions, each publishing an event that triggers the next. Two implementations: (1) Choreography — each service listens for events and performs its local transaction, then publishes the next event. Decentralized, simple, but hard to track the overall state. (2) Orchestration — a central Saga orchestrator (a dedicated service or state machine) tells each service what to do and tracks overall progress. Easier to monitor and debug. On failure: each step has a compensating transaction — if payment fails after inventory was reserved, the Saga executes 'release inventory reservation' to undo the earlier step. Sagas provide eventual consistency across services, not ACID atomicity.",
    difficulty: 'advanced',
    followUp: [
      'What is the difference between choreography and orchestration in Sagas?',
      'How do you handle a compensating transaction that also fails?',
    ],
  },
  {
    question: 'How would you design a search autocomplete system?',
    answer:
      "Search autocomplete returns suggestions as a user types, with latency requirements under 100ms. The data structure: a Trie (prefix tree) stores all search terms. To find all completions for 'app', traverse the Trie to the node for 'app' and collect all descendant words. Enhancement: store frequency scores at each node — return the top-k most frequent completions for any prefix. At scale (Google-scale), a Trie for billions of terms doesn't fit in memory on one server. Solutions: (1) Prefix-sharded Trie — shard by first 1-3 characters of prefix, so all 'app' queries go to the same shard. (2) Elasticsearch with prefix queries — simpler to implement and operationally manage, slightly higher latency. (3) Redis sorted sets — for each prefix ('a', 'ap', 'app'), store a sorted set of completions by frequency score. ZRANGEBYSCORE returns top-k. Cache: aggressively cache popular prefixes in Redis; 90%+ of queries are for a small set of prefixes. Update: recompute autocomplete indexes periodically (hourly or daily batch) rather than on every search event.",
    difficulty: 'advanced',
    followUp: [
      'How do you personalize autocomplete to show results relevant to the current user?',
      'How do you handle new trending terms that need to appear in autocomplete quickly?',
    ],
  },
  {
    question: 'How would you design a distributed rate limiter that works across multiple API server instances?',
    answer:
      "A single-server rate limiter using in-memory counters does not work when requests for the same user are handled by multiple servers (because each server has a separate counter). Distributed rate limiting requires a shared state store. Redis solution: (1) Fixed window — INCR key:{userId}:{minuteTimestamp}; on first INCR, set EXPIRE 60. If count > limit, reject. Atomic INCR is safe for concurrent increments from multiple servers. (2) Sliding window log — store each request timestamp in a Redis sorted set per user; count entries within last 60 seconds with ZCOUNT. Remove old entries with ZREMRANGEBYSCORE. More accurate than fixed window, more memory. (3) Token bucket — store tokens as a Redis hash; replenish tokens on read using Lua script for atomic read-modify-write. Placement: at the API gateway to avoid per-service implementation. Performance optimization: each API server maintains local counters and syncs to Redis every 100ms — accepts slight inaccuracy (~10% over-counting) in exchange for 10x higher throughput.",
    difficulty: 'advanced',
    followUp: ['How do you handle Redis being unavailable — fail open or fail closed?', 'How do you rate limit by IP when users are behind NAT?'],
  },
  {
    question: 'What is the difference between push and pull models in system design?',
    answer:
      "In a push model, the server actively sends data to clients when new data is available. WebSockets and Server-Sent Events implement this. In a pull model, clients periodically request new data from the server (polling). Push is better for real-time data (chat messages, stock prices) — lower latency, no wasted requests. Pull is simpler and works with any HTTP client — better when real-time isn't required. In event-driven architectures, push and pull refer to how consumers get messages from queues. Kafka consumers pull messages (they control the rate). HTTP webhooks push events to consumers. Pull gives consumers control over processing rate (backpressure) but requires them to be always running. Push simplifies consumer code but can overwhelm slow consumers. Fan-out-on-write (Instagram) is a push model — content is pushed to followers' feeds on publish. Fan-out-on-read is a pull model — feed is assembled when the user requests it.",
    difficulty: 'advanced',
    followUp: [
      'What is backpressure and why is it important in streaming systems?',
      'How does the push/pull distinction apply to feed generation systems?',
    ],
  },
  {
    question: 'How does database replication work and what consistency models does it provide?',
    answer:
      "Database replication copies data from a primary node to one or more replica nodes. Types: (1) Synchronous replication — the primary waits for at least one replica to acknowledge the write before confirming to the client. Guarantees no data loss if the primary fails, but adds write latency (must wait for replica acknowledgment over the network). (2) Asynchronous replication — the primary confirms the write immediately and replicates in the background. Lower write latency but potential data loss if primary fails before replication completes. (3) Semi-synchronous — wait for exactly one replica, asynchronously replicate to others. Balance of consistency and performance. Consistency models: a synchronously replicated replica always has current data (read-your-writes consistent). An asynchronously replicated replica may lag — reads may return stale data. This is the replication lag problem: replica is 50ms behind primary, so reads within that window see old data. Used in: PostgreSQL (streaming replication), MySQL (binary log replication), Cassandra (configurable per-query with consistency levels).",
    difficulty: 'advanced',
    followUp: [
      'How do you handle the case where a primary fails before asynchronous replication completes?',
      'What is multi-primary replication and what consistency challenges does it introduce?',
    ],
  },

  // ========================================
  // EXPERT (10 questions)
  // ========================================
  {
    question: 'How would you design the core feed system for Twitter at 200 million daily active users?',
    answer:
      "Twitter's feed is a hybrid of fan-out-on-write and fan-out-on-read. For regular users (< 1 million followers): when they tweet, fan-out the tweet ID to all followers' home timeline lists (stored in Redis, capped at 800 entries). Feed loads are instant — just read the pre-computed Redis list. For celebrities (> 1 million followers): do NOT fan-out. Instead, when any user loads their feed, merge the fan-out timeline with a real-time fetch of tweets from celebrities they follow. Key components: Timeline Service (serves feeds), Fanout Service (async worker that writes to follower timelines on tweet), Redis clusters (store home timelines — ~800 tweet IDs per user), tweet storage (Twitter uses their own Manhattan and MySQL for tweets). The threshold for 'celebrity' is tuned based on write capacity. At 200M DAU and each user checking feed 5 times/day = 1 billion feed loads/day = ~11,574 reads/second — needs Redis with high replication for availability.",
    difficulty: 'expert',
    followUp: [
      'How do you handle a celebrity tweeting during a major event when millions of followers are simultaneously online?',
      "How does Twitter's search (finding tweets by keyword) work differently from the home timeline?",
    ],
  },
  {
    question: 'How would you design a globally consistent system where users in Tokyo and New York see the same data within 100ms?',
    answer:
      "Global consistency within 100ms is physically challenging: the speed-of-light latency between Tokyo and New York is ~150ms. You cannot do a synchronous round-trip in 100ms for a write that must be confirmed by both regions. Solutions: (1) Accept that global strong consistency is impossible within 100ms at this geographic distance — CAP theorem applies. You can have global eventual consistency (writes propagate within seconds) or strong consistency within a single region (sub-millisecond). (2) Geographically partition data — users in Japan are assigned to the Tokyo region, users in the US to the US-East region. Each user's data is strongly consistent within their region. Cross-region consistency is eventual. (3) CockroachDB / Spanner approach — multi-region consensus clusters using TrueTime (Spanner) or hybrid logical clocks. Achieves external consistency with ~200ms cross-continent write latency. If truly need < 100ms reads globally: serve reads from local region replicas (accept possible stale reads); direct writes to a single 'home region' per user. This is the architecture of most global social platforms.",
    difficulty: 'expert',
    followUp: [
      'How does Google Spanner achieve external consistency across data centers?',
      'What is the TrueTime API and how does it help Spanner?',
    ],
  },
  {
    question: 'How would you design a system to detect anomalies in billions of financial transactions per day in real time?',
    answer:
      "Real-time anomaly detection at this scale requires a stream processing architecture. Data flow: transactions are published to Kafka as events at millions per second. Stream processors (Apache Flink, Apache Spark Streaming, or Kafka Streams) consume these events and apply detection logic in real time with sub-second latency. Anomaly detection approaches: (1) Rule-based — simple thresholds (transaction > $10,000 flag for review, 5 transactions in 1 second from one card). Fast and interpretable. (2) Statistical — maintain rolling averages and standard deviations per user/merchant; flag values > 3 sigma. Requires stateful stream processing. (3) ML model scoring — a trained model scores each transaction. Model is updated in batch (daily/weekly) and served as a microservice; the stream processor calls it synchronously. State management: Flink maintains per-user and per-card state across a sliding window (last 1 hour of transactions). State is checkpointed to durable storage (S3) for fault tolerance. Flagged transactions go to a review queue (Kafka topic); human reviewers or further automated scoring process them. Storage: Cassandra for transaction records (write-heavy, time-series per card).",
    difficulty: 'expert',
    followUp: [
      'How do you handle model updates without stopping the stream processor?',
      'How do you ensure exactly-once processing in the anomaly detection pipeline?',
    ],
  },
  {
    question: 'How would you design YouTube at scale — 500 hours of video uploaded per minute?',
    answer:
      "YouTube handles 500 hours of video per minute across 2+ billion users. Key systems: (1) Upload pipeline: users upload raw video to a distributed upload service. Large files use resumable uploads (chunked, each chunk confirmed before next). Raw video stored in object storage (GCS). (2) Transcoding pipeline: a transcoding service (built on Borg/Kubernetes) fans out to thousands of workers that encode the video into hundreds of formats (360p through 4K, multiple codecs, multiple audio tracks, multiple languages). Each video produces ~1,000 output files. Apache Beam or similar processes the DAG of encoding jobs. (3) Storage: original videos and transcoded outputs in Google Cloud Storage. Metadata (title, description, views, likes) in Spanner (globally consistent SQL). Comments in Bigtable (write-heavy, per-video time-series). (4) Serving: videos served from YouTube's own CDN (1,000+ edge locations globally). Adaptive bitrate streaming (DASH/HLS) adjusts quality based on bandwidth. (5) Recommendation: offline ML jobs (watch history, engagement, content similarity) produce recommendations stored in Bigtable; served in real time from cache. (6) View counting: approximate (HyperLogLog in Redis for real-time estimates), exact counts periodically synced to Spanner.",
    difficulty: 'expert',
    followUp: [
      'How does YouTube handle copyright detection for uploaded videos?',
      'How do you design the comment system that must handle millions of comments on a viral video?',
    ],
  },
  {
    question: 'How do distributed databases achieve consensus and what are the main algorithms?',
    answer:
      "Distributed databases need consensus to elect leaders, replicate data reliably, and ensure all nodes agree on a sequence of operations. Core algorithms: (1) Paxos — the original consensus algorithm. Nodes are divided into proposers and acceptors. A proposer gets a majority of acceptors to accept its value in two phases (Prepare, Accept). Widely used but complex to implement correctly. (2) Raft — designed for understandability, functionally equivalent to Paxos. One leader is elected per term. All writes go through the leader, which replicates to followers. If leader fails, an election is triggered — the node with the most up-to-date log wins. Used in etcd, CockroachDB, and most modern distributed databases. (3) Zab (Zookeeper Atomic Broadcast) — used in Zookeeper. Similar to Raft but with epoch-based leader terms. Key requirement: a majority quorum (> N/2 nodes) must be available for writes to succeed. In a 5-node cluster, 3 nodes must be up. This is why distributed systems have odd numbers of nodes. In practice: most engineers use databases that implement consensus internally (CockroachDB, etcd) rather than implementing it from scratch.",
    difficulty: 'expert',
    followUp: [
      "What is the 'split-brain' problem in consensus systems and how is it prevented?",
      'How does Raft handle leader election?',
    ],
  },
  {
    question: 'How would you design a real-time leaderboard for a game with 10 million concurrent players?',
    answer:
      "A leaderboard ranks players by score in real time. The challenges at 10 million concurrent players: scores update constantly (potentially millions of updates per second), and the top-N leaderboard must reflect current rankings. Solution: Redis Sorted Sets (ZSET). ZSET is a B-skip list where each member has a score. Operations: ZADD player:leaderboard {playerId} {score} updates or adds a player's score — O(log N). ZREVRANGE player:leaderboard 0 99 retrieves the top-100 players by score — O(log N + k). ZRANK player:leaderboard {playerId} returns a player's current rank — O(log N). At 10M players and 1M score updates/second, a single Redis instance handles this well (Redis can do 1M+ simple operations/second). For larger scale: shard the leaderboard by game region or by score range (top 10K players on one shard, others on another). Persistence: Redis AOF/RDB for durability. For daily/weekly leaderboards: separate ZSETs per time period; reset by creating a new ZSET. For fair leaderboards with tie-breaking: encode both score and timestamp in the ZADD score: sortableScore = score * 10^12 + (maxTimestamp - submissionTimestamp).",
    difficulty: 'expert',
    followUp: [
      'How would you design a leaderboard that shows a player their rank among their friends, not globally?',
      'How do you handle score tampering and cheating detection?',
    ],
  },
  {
    question: 'How would you design a multi-region active-active database architecture?',
    answer:
      "Active-active multi-region means all regions accept writes and reads simultaneously, with data replicated across regions. The core challenge: if users in US-East and EU-West both update the same record simultaneously, you have a write conflict — which write wins? Approaches: (1) Last-Write-Wins (LWW) using timestamps — the write with the most recent timestamp wins. Problem: clock skew across data centers can cause the 'earlier' write (by wall clock) to arrive later. DynamoDB uses this with vector clocks. (2) CRDTs (Conflict-free Replicated Data Types) — data structures that merge automatically without conflicts. Counters (increment only), sets (add/remove with tombstones), and last-write registers are common CRDTs. Useful for shopping carts, presence lists, view counts. (3) Partitioned ownership — each user 'belongs' to a home region; only their home region can write their data. Other regions serve reads from replication. No conflicts, but cross-region writes require routing to home region (adds latency). (4) Spanner/CockroachDB — use consensus across regions with TrueTime for global serializability. Works but has higher write latency (~200ms cross-continent).",
    difficulty: 'expert',
    followUp: [
      'What is a CRDT and how does it achieve conflict-free merging?',
      'How do you handle the case where network partition between regions lasts hours?',
    ],
  },
  {
    question: 'How would you design a service that serves 1 million requests per second with 99.99% availability?',
    answer:
      "At 1M RPS and 99.99% availability (52 minutes downtime per year), every architectural decision must account for failure. Compute: stateless API servers auto-scaled horizontally behind multiple load balancers (active-active). Auto-scaling group responds to CPU/memory metrics. Database: horizontally sharded with synchronous replication to at least one replica per shard. Circuit breakers prevent a failing shard from cascading. Caching: Redis cluster with Redis Sentinel for failover. Cache hit rate > 95% required to keep DB load manageable at 50K uncached reads/second. CDN: static assets and cacheable API responses served from CDN edge (further reduces origin load). Multi-AZ: servers, databases, and caches spread across 3+ availability zones. AZ failure (which happens) drops to 67% capacity but stays up. Multi-region active-passive: one region handles all traffic, a second region is warm-standby. DNS failover (with low TTL) switches traffic within 60 seconds of region failure. Deployment: blue-green deployments allow instant rollback. Canary deployments route 1% of traffic to new version before full rollout. Observability: SLO-based alerting, distributed tracing, real-time dashboards. Chaos engineering: scheduled failure injection tests that the system recovers as designed.",
    difficulty: 'expert',
    followUp: [
      'How do you define and measure SLOs (Service Level Objectives) for this system?',
      'What is chaos engineering and how do you implement it safely in production?',
    ],
  },
  {
    question: 'How do you design a system to handle bursty traffic that spikes 100x for short periods?',
    answer:
      "100x traffic spikes (e.g., product launches, viral events, Super Bowl ads) require a combination of strategies. Before the spike: load testing to understand system limits, pre-warming caches before a known event, pre-scaling cloud resources. During the spike: (1) Auto-scaling — cloud instances scale out based on CPU/memory metrics. Problem: auto-scaling takes 2-5 minutes; a spike that lasts 30 seconds will overwhelm before new instances are ready. (2) Request queuing — put all incoming requests in a queue (SQS, Kafka) and process at sustainable rate. Users wait instead of getting errors. Show a 'queue position' UX. (3) Load shedding — reject low-priority requests (recommendations, analytics pings) to preserve capacity for critical operations (checkout, payment). (4) Rate limiting at edge — CDN/API gateway rate limits per user/IP to prevent any one client from using disproportionate capacity. (5) Circuit breakers — if a downstream service (payment, inventory) is overwhelmed, return a graceful error rather than queuing 100x normal requests against it. (6) Static fallback pages — for extreme spikes, serve a pre-rendered HTML page from CDN (bypassing all backend) with a 'visit us later' message.",
    difficulty: 'expert',
    followUp: [
      'How do you decide which requests to shed first during load shedding?',
      'How do you design a virtual waiting room for flash sales?',
    ],
  },
  {
    question: 'How would you design the infrastructure for a system that must process and store 1 petabyte of data per day?',
    answer:
      "1 PB/day = 11.6 GB/second of continuous writes — this is big data territory. Architecture: (1) Ingestion: Apache Kafka as the ingestion layer. Multiple Kafka clusters (partitioned by data type or source) handle the write throughput. Kafka compresses data on disk (LZ4 or SNAPPY) — 1 PB uncompressed → ~200-400 GB/day on disk. (2) Stream processing: Apache Flink or Spark Streaming consumes from Kafka for real-time transformations, enrichment, and aggregations. Real-time results written to serving databases (Cassandra, Redis). (3) Batch processing: Apache Spark on a large cluster processes the full daily dataset for complex analytics, model training, and historical joins. (4) Storage tiers: hot (last 7 days) in Cassandra/ClickHouse for fast queries. Warm (7-90 days) in Parquet files on S3. Cold (90+ days) in compressed Parquet on S3 Glacier (much cheaper). (5) Query layer: ClickHouse or BigQuery for fast analytical queries on columnar data. Presto/Trino for federated queries across storage tiers. (6) Infrastructure: this requires a dedicated data platform team, 100s of servers, and careful capacity planning. Spot/preemptible instances for Spark reduce cost by 60-80%.",
    difficulty: 'expert',
    followUp: [
      'How do you handle schema evolution in a petabyte-scale data lake?',
      'What is the Lambda architecture and when would you use it here?',
    ],
  },
];
