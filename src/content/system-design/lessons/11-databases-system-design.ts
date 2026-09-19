import type { Lesson } from '@/types';

export const databasesSystemDesignLesson: Lesson = {
  id: 'databases-in-system-design',
  slug: 'databases-in-system-design',
  title: 'Databases in System Design',
  description:
    'Deep dive into how databases are used at scale — SQL vs NoSQL trade-offs, sharding strategies, replication topologies, and consistency models. Learn to choose the right database architecture for any system design problem.',
  category: 'Databases',
  order: 11,
  difficulty: 'advanced',
  estimatedTime: 60,
  prevLesson: 'cdn',
  nextLesson: 'distributed-systems',

  content: `
# Databases in System Design

## Why Database Architecture Matters

In a system design interview or a real production system, picking a database and calling it done is not enough. At scale, a single database becomes a bottleneck — it runs out of storage, can not handle the query volume, or becomes a single point of failure.

This lesson covers how production systems solve these problems: SQL vs NoSQL trade-offs, sharding, replication, and the consistency guarantees you get (or sacrifice) with each approach.

---

## SQL vs NoSQL

The most fundamental database decision: relational (SQL) or non-relational (NoSQL)?

### When SQL Wins

**1. ACID Transactions**
SQL databases (Postgres, MySQL) provide ACID guarantees by default:
- **Atomicity:** All steps of a transaction succeed or all fail (no partial writes)
- **Consistency:** Data always satisfies defined constraints
- **Isolation:** Concurrent transactions do not interfere
- **Durability:** Committed data survives crashes

Example: Bank transfer — debit Account A, credit Account B. These must be atomic. SQL excels here.

**2. Complex Queries and Relationships**
SQL's JOIN capability is powerful. If your data has many relationships (users → orders → products → categories), SQL handles this elegantly. NoSQL databases struggle with joins.

**3. Well-Defined Schema**
When your data shape is known and stable (user profiles, financial records), SQL's schema enforcement prevents bad data from entering the system.

**4. Reporting and Analytics**
SQL's query language is extremely expressive for ad-hoc analytics. NoSQL databases require pre-defined query patterns.

### When NoSQL Wins

**1. Massive Write Scale**
NoSQL databases like Cassandra are architected for horizontal write scalability. They can handle millions of writes per second across hundreds of nodes. PostgreSQL on a single node can not.

**2. Flexible Schema**
When data shape varies between records (product catalog where each product has different attributes), document stores (MongoDB) let each document have a different structure.

**3. Eventual Consistency is Acceptable**
For social media feeds, analytics dashboards, or recommendation systems, being briefly stale is fine. NoSQL systems trade strict consistency for speed and availability.

**4. Simple Access Patterns**
If you always query by primary key (user ID lookup, session lookup), NoSQL key-value stores are faster and simpler than SQL.

### SQL vs NoSQL Comparison Table

| Aspect | SQL | NoSQL |
|---|---|---|
| Schema | Fixed, enforced | Flexible, per-document |
| Transactions | Full ACID | Varies (none to limited) |
| Joins | Native, efficient | Very limited or impossible |
| Horizontal scaling | Hard (sharding is complex) | Designed for it |
| Write throughput | Limited by single leader | Horizontally scalable |
| Consistency | Strong by default | Eventual by default |
| Query flexibility | High (ad-hoc SQL) | Low (predefined patterns) |
| Best for | Transactional, relational data | Scale, flexible data, high throughput |

---

## Sharding — Splitting Data Across Nodes

### What is Sharding?

**Sharding** (also called horizontal partitioning) splits your data across multiple database nodes, each called a **shard**. Each shard is an independent database that holds a subset of the total data.

**Why needed:** A single database node has physical limits — disk space, RAM, CPU, and connection count. When your data grows beyond what one machine can handle, you shard.

\`\`\`
Without Sharding:
  All data → [Single DB node]
              (hits limits at ~TB scale or ~100K QPS)

With Sharding:
  User IDs 0–9M    → [Shard 1]
  User IDs 10M–19M → [Shard 2]
  User IDs 20M–29M → [Shard 3]
  (each shard handles ~33% of load)
\`\`\`

### Sharding Strategies

**Range-Based Sharding**

Data is divided into ranges by shard key value. Users with IDs 0–9M go to Shard 1, 10M–19M to Shard 2, etc.

- **Advantage:** Range queries are efficient (get all users with ID between 5M and 6M → query Shard 1 only)
- **Disadvantage:** Hot spots. If new users always get high IDs and new user activity is highest, Shard 3 gets all the load while Shard 1 is idle. Uneven distribution.

**Hash-Based Sharding**

A hash function is applied to the shard key: \`shard_number = hash(user_id) % num_shards\`

- **Advantage:** Even distribution. Hash functions spread data uniformly across shards.
- **Disadvantage:** Range queries are impossible — adjacent IDs go to different shards. Adding or removing shards requires rehashing and migrating data (consistent hashing mitigates this).

**Directory-Based Sharding**

A central lookup service (the directory) maintains a mapping of shard key → shard location. To find data, query the directory first.

- **Advantage:** Flexible. You can place any data on any shard. Easy to rebalance.
- **Disadvantage:** Directory is a single point of failure. Every read requires an extra lookup hop. Added latency and complexity.

### Problems with Sharding

Sharding is powerful but introduces significant complexity:

**1. Cross-Shard Queries:** A query joining data from two shards requires fetching from both and merging in the application layer. This is slow and complex.

**2. Cross-Shard Transactions:** Atomic transactions spanning two shards require a distributed transaction protocol (2PC — Two-Phase Commit), which is complex and slow.

**3. Rebalancing:** When a shard fills up, you need to split it. This requires migrating data from one shard to two, during which the system must remain available. Very difficult in production.

**4. Joins:** SQL JOINs across shards are essentially impossible efficiently. You must denormalize your data (store related data together) to avoid cross-shard joins.

**Rule of thumb:** Avoid sharding as long as possible. A single well-tuned PostgreSQL instance can handle enormous loads. Add read replicas first. Only shard when you genuinely cannot scale vertically.

---

## Partitioning

Partitioning and sharding are often used interchangeably, but have a subtle distinction:

**Partitioning** typically refers to dividing data within a single database instance into separate partitions (separate storage areas, potentially different disks). The database engine manages this transparently.

**Sharding** refers to splitting data across multiple separate database instances (different machines), where the application must be aware of which shard to query.

**Vertical Partitioning:** Split columns across tables. A users table with 50 columns might be split into users (frequently accessed columns: id, name, email) and users_extended (rarely accessed: bio, preferences, settings). The first table is smaller and fits in cache more effectively.

**Horizontal Partitioning (Sharding):** Split rows across nodes or partitions by a key value.

---

## Replication — Why and How

**Replication** means maintaining multiple copies of your data on different machines.

**Why replicate:**
1. **Fault tolerance:** If one node fails, another has the data. No downtime.
2. **Read scaling:** Multiple nodes can serve reads simultaneously.
3. **Geographic distribution:** Put replicas close to different user populations.

### Replication Topologies

**Leader-Follower (Primary-Replica)**

The most common pattern. All writes go to one **leader** (primary). The leader replicates changes to one or more **followers** (replicas/secondaries). Reads can be served from followers.

\`\`\`
        Writes
          |
          v
     [Leader/Primary]
          |
          | Replication (async or sync)
          |
    +-----+------+
    |            |
[Follower 1] [Follower 2]
    |            |
  Read         Read
\`\`\`

- **Replication lag:** Async replication means followers may be seconds (or minutes) behind the leader. Reads from followers may return stale data. This is the primary operational concern.
- **Failover:** If the leader dies, one follower is promoted to leader. During promotion, writes are briefly unavailable.
- **Use when:** You need high read throughput, can tolerate brief stale reads, want simplicity.

**Multi-Leader**

Multiple nodes accept writes simultaneously. Each leader replicates its changes to all other leaders and to followers.

- **Write conflicts:** Two leaders may accept conflicting writes to the same row simultaneously. The system must detect and resolve these conflicts. Last-Write-Wins (LWW) is common but can cause data loss. Application-level conflict resolution is more correct but complex.
- **Use when:** You need writes in multiple geographic regions simultaneously. A user in Tokyo should write to the Tokyo leader, not wait 200ms to reach a US leader.

**Leaderless (Quorum-Based)**

Any node can accept a read or write. There is no designated leader. Consistency is achieved through **quorums** — a majority of nodes must acknowledge a write before it is considered successful.

\`\`\`
Quorum formula: W + R > N
  N = total nodes
  W = nodes that must acknowledge a write
  R = nodes that must respond to a read

Example: N=3, W=2, R=2 → W + R = 4 > N = 3 ✓
Any 2 of 3 nodes acknowledge writes. Any 2 of 3 nodes are read.
At least 1 node is guaranteed to overlap → always get the latest write.
\`\`\`

**Used by:** Amazon DynamoDB (inspired Dynamo paper), Apache Cassandra.

### Replication Topology Comparison

| Topology | Write Nodes | Read Scaling | Conflict Risk | Complexity |
|---|---|---|---|---|
| Leader-Follower | 1 (leader only) | Yes (read from replicas) | None | Low |
| Multi-Leader | Multiple | Yes | High (write conflicts) | High |
| Leaderless | Any node | Yes | Yes (resolved by quorum) | Medium |

---

## Read Replicas

**Read replicas** are follower nodes used specifically to offload read traffic from the primary.

**Why:** In most web applications, reads vastly outnumber writes (10:1 to 100:1). Adding read replicas allows horizontal scaling of reads without complex sharding.

**Replication lag problem:** Because replication is asynchronous, a read replica may return data that is a few seconds old. This is usually acceptable, but there are cases where it is not:

| Stale reads acceptable | Stale reads NOT acceptable |
|---|---|
| User browsing a product catalog | User reads their own profile right after updating it |
| Viewing historical data | Payment confirmation page |
| Social media feed | Security-sensitive data (permissions, tokens) |

**Mitigation:** For reads that must be fresh (e.g., reading your own writes), route those specific reads to the primary instead of the replica.

---

## Consistency Models

### Strong Consistency

Every read returns the most recent write, guaranteed. No stale reads ever.

**How achieved:** Either route all reads through the leader, or use synchronous replication (leader waits for all replicas to confirm before acknowledging write to client).

**Cost:** Higher latency (synchronous replication adds round-trip time), lower availability (if a replica is down, the write blocks).

**When required:** Financial systems, inventory management, booking systems (airline seats — you cannot double-book).

### Eventual Consistency

After a write, replicas will *eventually* converge to the same value — but for a window of time (milliseconds to seconds), different replicas may return different values.

**How achieved:** Asynchronous replication. Leader acknowledges write immediately, replicates in background.

**Benefit:** Lower write latency (no waiting for replicas). Higher availability (system works even if some replicas are down).

**When acceptable:** Social media likes/views, shopping cart recommendations, search indexes, analytics dashboards.

### Choosing a Consistency Model

Ask: "What is the worst-case impact of a user reading stale data?"

- If the answer is "data loss, double-booking, or incorrect financial transaction" → Strong Consistency required.
- If the answer is "they see a like count that is 2 seconds old" → Eventual Consistency is fine.
`,

  codeExamples: [
    {
      title: 'Hash-Based Sharding — Routing Queries to the Right Shard',
      code: `import { createPool, Pool } from 'mysql2/promise';

class ShardedDatabase {
  private shards: Pool[];

  constructor(shardConfigs: DatabaseConfig[]) {
    this.shards = shardConfigs.map(config => createPool(config));
  }

  // Determine which shard a given user ID belongs to
  private getShardIndex(userId: string): number {
    let hash = 0;
    for (const char of userId) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0; // unsigned 32-bit
    }
    return hash % this.shards.length;
  }

  private getShard(userId: string): Pool {
    return this.shards[this.getShardIndex(userId)];
  }

  async getUserById(userId: string) {
    const shard = this.getShard(userId);
    const [rows] = await shard.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return rows[0];
  }

  async createUser(userId: string, data: UserData) {
    const shard = this.getShard(userId);
    await shard.query(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [userId, data.name, data.email]
    );
  }
}

// Usage
const db = new ShardedDatabase([
  { host: 'shard1.db.internal', port: 3306, database: 'users' },
  { host: 'shard2.db.internal', port: 3306, database: 'users' },
  { host: 'shard3.db.internal', port: 3306, database: 'users' },
]);

// User 'u-12345' always routes to the same shard based on hash
const user = await db.getUserById('u-12345');`,
      explanation:
        'Hash-based sharding routes a user ID to the same shard consistently by hashing it. This ensures uniform distribution. The trade-off: range queries (get all users created this week) become cross-shard operations.',
    },
    {
      title: 'Read Replica Routing — Primary for Writes, Replica for Reads',
      code: `import { Pool, createPool } from 'pg';

class ReplicatedDatabase {
  private primary: Pool;
  private replicas: Pool[];
  private replicaIndex: number = 0;

  constructor(primaryConfig: PoolConfig, replicaConfigs: PoolConfig[]) {
    this.primary = createPool(primaryConfig);
    this.replicas = replicaConfigs.map(c => createPool(c));
  }

  // Round-robin across replicas for read distribution
  private getNextReplica(): Pool {
    const replica = this.replicas[this.replicaIndex];
    this.replicaIndex = (this.replicaIndex + 1) % this.replicas.length;
    return replica;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    // Route reads to replicas (may be slightly stale)
    return this.getNextReplica().query(sql, params);
  }

  async queryPrimary(sql: string, params?: any[]): Promise<any> {
    // Use this for reads that MUST be fresh (e.g., read-after-write)
    return this.primary.query(sql, params);
  }

  async execute(sql: string, params?: any[]): Promise<any> {
    // All writes MUST go to primary
    return this.primary.query(sql, params);
  }
}

// Usage patterns
const db = new ReplicatedDatabase(primaryConfig, [replica1Config, replica2Config]);

// Product listing — stale reads OK
const products = await db.query('SELECT * FROM products LIMIT 20');

// User updates their email — must read back from primary to confirm
await db.execute('UPDATE users SET email = $1 WHERE id = $2', [newEmail, userId]);
const updatedUser = await db.queryPrimary('SELECT * FROM users WHERE id = $1', [userId]);`,
      explanation:
        'Route writes and consistency-critical reads to the primary. Route all other reads to replicas. The key is knowing WHEN to use each — after a write, use queryPrimary to avoid reading stale data from a replica.',
    },
    {
      title: 'Quorum Writes and Reads — Leaderless Replication Concept',
      code: `// Conceptual implementation of quorum reads/writes (like Cassandra)
// N=3 nodes, W=2 write quorum, R=2 read quorum

class QuorumDatabase {
  private nodes: DatabaseNode[];
  private N: number; // total nodes
  private W: number; // write quorum
  private R: number; // read quorum

  constructor(nodes: DatabaseNode[], W = 2, R = 2) {
    this.nodes = nodes;
    this.N = nodes.length;
    this.W = W;
    this.R = R;
    // Verify quorum guarantee: W + R > N
    console.assert(W + R > this.N, 'Quorum does not guarantee consistency!');
  }

  async write(key: string, value: any, timestamp: number): Promise<boolean> {
    const results = await Promise.allSettled(
      this.nodes.map(node => node.set(key, { value, timestamp }))
    );

    const successes = results.filter(r => r.status === 'fulfilled').length;

    if (successes >= this.W) {
      console.log(\`Write succeeded: \${successes}/\${this.N} nodes acknowledged\`);
      return true;
    }

    throw new Error(\`Write failed: only \${successes}/\${this.N} nodes (need \${this.W})\`);
  }

  async read(key: string): Promise<any> {
    const results = await Promise.allSettled(
      this.nodes.map(node => node.get(key))
    );

    const successful = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(Boolean);

    if (successful.length < this.R) {
      throw new Error(\`Read failed: only \${successful.length}/\${this.N} nodes responded\`);
    }

    // Return the value with the highest timestamp (most recent write wins)
    return successful.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest
    ).value;
  }
}

// With N=3, W=2, R=2: W+R=4 > N=3
// Even if 1 node is down or stale, the overlap guarantees
// at least 1 node in the read set has the latest write.`,
      explanation:
        'Quorum systems guarantee that read and write sets always overlap when W + R > N. This overlap means at least one node in every read response has the latest write. The highest-timestamp value wins.',
    },
  ],

  commonMistakes: [
    'Sharding too early — a single well-tuned PostgreSQL can handle millions of rows and thousands of QPS. Add read replicas first, shard only when truly necessary.',
    'Choosing NoSQL for "scale" without understanding the data access patterns — if your data has relationships and you need joins, NoSQL makes this much harder.',
    'Ignoring replication lag — reading from a replica right after a write can return stale data. Always route read-after-write reads to the primary.',
    'Using the wrong shard key — choosing a low-cardinality key (e.g., status: active/inactive) creates hot shards. Shard keys must be high-cardinality and evenly distributed.',
    'Not accounting for cross-shard operations — once sharded, queries that span multiple shards are extremely expensive. Design data models to avoid cross-shard joins.',
    'Assuming eventual consistency is always acceptable — for any financial, inventory, or booking data, strong consistency is required. Stale reads can cause real-world harm.',
    'Conflating partitioning with sharding — partitioning is within a single instance, sharding is across instances. They have different operational implications.',
    'Not planning for shard rebalancing — when shards fill up, you need to split them. If you have not designed for this from the start, it becomes a multi-day migration.',
  ],

  interviewQuestions: [
    {
      question: 'When would you choose NoSQL over SQL?',
      difficulty: 'intermediate',
      answer:
        'Choose NoSQL when: (1) You need horizontal write scalability beyond what a single SQL node can provide (Cassandra can handle millions of writes/sec). (2) Your data schema is flexible and varies between records (document stores like MongoDB). (3) Your access patterns are simple key-based lookups with no joins required. (4) Eventual consistency is acceptable for your use case. (5) You are storing large amounts of time-series data (InfluxDB) or graph data (Neo4j). Choose SQL when you need ACID transactions, complex multi-table joins, ad-hoc queries, or when data relationships are complex.',
      followUp: [
        'What NoSQL databases do you know, and what are each best for?',
        'Can you use both SQL and NoSQL in the same system?',
      ],
      tip: 'Many large systems use both — SQL for transactional data (orders, payments) and NoSQL for high-scale read workloads (user feeds, analytics).',
    },
    {
      question: 'Explain the difference between replication and sharding.',
      difficulty: 'intermediate',
      answer:
        'Replication: the same data exists on multiple nodes simultaneously. Purpose: fault tolerance and read scaling. Every replica has ALL the data. Sharding: different subsets of data live on different nodes. Purpose: storage and write scaling beyond what a single node can handle. Each shard has only a PORTION of the data. In practice, you often combine both — each shard has its own replica set for fault tolerance.',
      followUp: ['How do you add read replicas to a sharded database?'],
    },
    {
      question: 'What is the CAP theorem and how does it relate to database replication lag?',
      difficulty: 'advanced',
      answer:
        'The CAP theorem says a distributed system can provide at most 2 of: Consistency (every read gets the latest write), Availability (every request gets a response), and Partition Tolerance. Since network partitions always happen, the real choice is CP vs AP. Replication lag is a direct consequence of choosing AP (Availability + Partition Tolerance) — you sacrifice immediate consistency to keep the system available and fast. When a replica is behind the leader, reads from that replica are available but inconsistent. Strong consistency would require waiting for the replica to catch up or routing to the leader.',
      followUp: ['Can you give a real example of a CP system vs an AP system?'],
    },
    {
      question: 'What are the problems with sharding and when should you avoid it?',
      difficulty: 'advanced',
      answer:
        'Problems: (1) Cross-shard queries require fetching from multiple shards and merging — slow and complex. (2) Cross-shard transactions require distributed 2PC — complex and slow. (3) JOINs across shards are essentially impossible efficiently. (4) Rebalancing when shards fill up is a complex live migration. (5) Operational complexity increases significantly. When to avoid it: before exhausting other options. First: add indexes, optimize queries. Then: add read replicas for read scaling. Then: vertical scaling (bigger machine). Only shard when you genuinely cannot scale vertically or via replicas. Many companies run their entire business on a single well-tuned PostgreSQL instance.',
    },
    {
      question: 'What is replication lag and when is it a problem?',
      difficulty: 'intermediate',
      answer:
        'Replication lag is the time delay between when a write is committed to the primary and when it appears on a replica. It ranges from milliseconds to seconds under normal load, but can grow under high write throughput or network issues. It is a problem when: (1) A user updates their profile and immediately reads it back — they may see the old value from a stale replica. (2) A payment is processed and the balance is immediately checked — the deduction may not have replicated yet. Solution: for reads that must reflect recent writes, route them to the primary. Use read-after-write consistency where needed.',
    },
    {
      question: 'Explain quorum reads and writes. What does W + R > N guarantee?',
      difficulty: 'expert',
      answer:
        'In leaderless replication (Dynamo-style, Cassandra), N is the replication factor (number of nodes holding a copy), W is the number of nodes that must acknowledge a write, and R is the number of nodes queried on a read. When W + R > N, the write set and read set are guaranteed to overlap by at least one node. That overlapping node has the latest write. By taking the value with the latest timestamp from R responses, you always get the most recent value. Example: N=3, W=2, R=2. Write acknowledged by nodes 1 and 2. Read queries nodes 2 and 3. Node 2 is the overlap — it has the latest write.',
    },
  ],

  exercises: [
    {
      id: 'db-sd-ex-1',
      title: 'Design a Sharding Strategy for a Social Media Platform',
      description:
        'You are designing the database architecture for a social media platform with 500 million users. The primary table is "posts" with columns: post_id, user_id, content, created_at, like_count. You need to shard this table. Analyze three sharding keys (user_id, post_id, created_at) and for each: explain data distribution, identify hot spots, analyze query patterns, and recommend with justification.',
      starterCode: `// Document your analysis as structured data
interface ShardingAnalysis {
  shardKey: string;
  distribution: string;        // How data is distributed across shards
  hotSpots: string;            // Potential uneven distribution
  queryPatterns: {
    efficient: string[];       // Queries that work well
    inefficient: string[];     // Queries that are slow
  };
  recommendation: 'good' | 'acceptable' | 'poor';
  reason: string;
}

function analyzeShardingStrategies(): ShardingAnalysis[] {
  // TODO: Analyze shard_key = user_id, post_id, and created_at
  // For each, think about:
  // - Will hot users (Elon Musk with 100M followers) cause hot shards?
  // - Can you efficiently query "get all posts by user X"?
  // - Can you efficiently query "get posts from last hour" (timeline)?
  return [];
}`,
      solution: `function analyzeShardingStrategies(): ShardingAnalysis[] {
  return [
    {
      shardKey: 'user_id (hash-based)',
      distribution: 'Even distribution if hashed — each shard gets ~equal number of users',
      hotSpots: 'Celebrity users (millions of posts) create large shards. A user with 10M posts fills their shard faster than a user with 100 posts.',
      queryPatterns: {
        efficient: [
          'Get all posts by user X (all on same shard)',
          'Get post count for user X',
          'Delete all posts by user X',
        ],
        inefficient: [
          'Get trending posts across all users (requires fan-out to all shards)',
          'Get posts created in last hour (cross-shard time query)',
          'Get all posts with >1000 likes (cross-shard scan)',
        ],
      },
      recommendation: 'good',
      reason: 'The most common access pattern — "get posts for user X" — is efficient. Cross-shard queries are rare in a typical social feed (you load per-user feeds). Hot celebrity users can be handled with sub-sharding.',
    },
    {
      shardKey: 'post_id (hash-based)',
      distribution: 'Very even — post IDs are high cardinality, hash distributes uniformly',
      hotSpots: 'None for individual posts — each post on its own shard basis',
      queryPatterns: {
        efficient: [
          'Get post by ID (direct shard lookup)',
          'Like/unlike a specific post',
        ],
        inefficient: [
          'Get all posts by user X (posts spread across all shards — requires fan-out)',
          'Get user timeline (cross-shard)',
          'ANY user-centric query requires hitting all shards',
        ],
      },
      recommendation: 'poor',
      reason: 'The most critical query — fetching a user\'s posts — requires querying ALL shards. This is the worst possible access pattern at scale.',
    },
    {
      shardKey: 'created_at (range-based, e.g., per month)',
      distribution: 'Time-based: old shards have static data, new shard gets all writes',
      hotSpots: 'SEVERE: The current month\'s shard receives 100% of all writes. All other shards are cold. This is the definition of a hot spot.',
      queryPatterns: {
        efficient: [
          'Get posts from a specific time range (hits only relevant shards)',
          'Analytics queries by time period',
        ],
        inefficient: [
          'Get all posts by user X (spread across time-based shards)',
          'Any user-centric query',
        ],
      },
      recommendation: 'poor',
      reason: 'Write hot spot is catastrophic. The current month shard handles all writes while historical shards sit idle.',
    },
  ];
}

// Conclusion: Shard by user_id with hash-based distribution.
// This aligns the shard key with the most common access pattern (per-user queries).
// Handle celebrity users by sub-sharding or using separate storage for high-follower accounts.`,
      hints: [
        'Think about the access patterns first. What queries does a social media feed need to answer?',
        'A hot spot means one shard gets disproportionate load. This defeats the purpose of sharding.',
        'Range-based time sharding always creates a write hot spot — the current time period gets all new writes.',
        'The best shard key aligns with your most frequent access pattern.',
      ],
    },
    {
      id: 'db-sd-ex-2',
      title: 'Identify Consistency Requirements for Different Features',
      description:
        'For each feature below, decide: (A) Is strong consistency required, or is eventual consistency acceptable? (B) Should reads go to the primary or can they go to a replica? (C) What is the worst-case impact of a stale read? Features: (1) User profile update, (2) Bank account balance, (3) Social media like count, (4) E-commerce inventory (last unit), (5) User authentication/session, (6) Product search results.',
      starterCode: `interface ConsistencyDecision {
  feature: string;
  consistencyModel: 'strong' | 'eventual';
  readTarget: 'primary' | 'replica';
  worstCaseStaleRead: string;
  justification: string;
}

function analyzeConsistencyRequirements(): ConsistencyDecision[] {
  const features = [
    'User profile update',
    'Bank account balance',
    'Social media like count',
    'E-commerce inventory (last unit in stock)',
    'User authentication / session lookup',
    'Product search results',
  ];

  // TODO: For each feature, fill in the ConsistencyDecision
  return [];
}`,
      solution: `function analyzeConsistencyRequirements(): ConsistencyDecision[] {
  return [
    {
      feature: 'User profile update',
      consistencyModel: 'strong',
      readTarget: 'primary',
      worstCaseStaleRead: 'User updates their email, then sees the old email on their profile page — confusing and looks like the update failed.',
      justification: 'Read-after-write consistency required. Route the immediate post-update read to the primary. After a few seconds, the replica catches up and normal reads can use replicas.',
    },
    {
      feature: 'Bank account balance',
      consistencyModel: 'strong',
      readTarget: 'primary',
      worstCaseStaleRead: 'User sends money, balance does not reflect the deduction. They send again thinking it failed. Double payment. Money lost.',
      justification: 'Financial data is the canonical example requiring strong consistency. Always read from primary. Use ACID transactions for all balance operations.',
    },
    {
      feature: 'Social media like count',
      consistencyModel: 'eventual',
      readTarget: 'replica',
      worstCaseStaleRead: 'Like count shows 1,249 instead of 1,250 for a few seconds. User impact: negligible.',
      justification: 'Like counts are approximate by nature — multiple concurrent likes race anyway. A few seconds of staleness is imperceptible and acceptable.',
    },
    {
      feature: 'E-commerce inventory (last unit)',
      consistencyModel: 'strong',
      readTarget: 'primary',
      worstCaseStaleRead: 'Two users both see "1 unit in stock", both add to cart, both checkout. You oversell by 1. Customer receives a cancellation email. Brand damage and operational cost.',
      justification: 'Inventory is a shared mutable resource with business consequences. Use pessimistic locking or SELECT FOR UPDATE at the DB level for the checkout flow.',
    },
    {
      feature: 'User authentication / session lookup',
      consistencyModel: 'strong',
      readTarget: 'primary',
      worstCaseStaleRead: 'User logs out (session deleted from primary). Replica still has old session. User appears to still be logged in. Security vulnerability.',
      justification: 'Session invalidation (logout, password change) must propagate immediately. Replicated session checks cannot be trusted for security-critical operations.',
    },
    {
      feature: 'Product search results',
      consistencyModel: 'eventual',
      readTarget: 'replica',
      worstCaseStaleRead: 'A newly added product takes 2 seconds to appear in search. A deleted product appears in search for 2 seconds. Minor, acceptable.',
      justification: 'Search results are naturally approximate (relevance ranking is heuristic). A brief delay in index updates is imperceptible and acceptable.',
    },
  ];
}`,
      hints: [
        'Ask: "What is the worst thing that happens if a user reads data that is 2 seconds old?"',
        'Financial and security operations almost always require strong consistency.',
        'Social metrics (likes, views) almost always tolerate eventual consistency.',
        'Inventory is tricky — it LOOKS like it could be eventual, but overselling is a real business problem.',
      ],
    },
  ],

  keyTakeaways: [
    'SQL wins when you need ACID transactions, complex joins, and a well-defined schema. NoSQL wins for horizontal write scale, flexible schemas, and high-throughput key-value access.',
    'Replication (multiple copies of the same data) solves fault tolerance and read scaling. Sharding (splitting data across nodes) solves storage and write scaling.',
    'Leader-Follower replication is the most common pattern — writes go to one leader, reads can come from followers. Replication lag is the main operational concern.',
    'Multi-Leader replication enables writes in multiple regions but introduces write conflicts that must be resolved.',
    'Leaderless (quorum) replication uses W + R > N to guarantee consistency without a designated leader. Used by Cassandra and DynamoDB.',
    'Range-based sharding is simple but creates hot spots. Hash-based sharding distributes evenly but breaks range queries. Choose your shard key based on your primary access pattern.',
    'Avoid sharding until you have exhausted other options: indexing, query optimization, read replicas, vertical scaling.',
    'Strong consistency requires routing reads to the primary or using synchronous replication — adds latency but prevents stale reads.',
    'Eventual consistency is acceptable for social feeds, search results, and metrics — but never for financial, inventory, or authentication data.',
    'Replication lag is not just a technical problem — it has business consequences. Know which reads must be strongly consistent in your system.',
  ],
};
