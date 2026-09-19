import type { Lesson } from '@/types';

export const distributedSystemsLesson: Lesson = {
  id: 'distributed-systems',
  slug: 'distributed-systems',
  title: 'Distributed Systems Fundamentals',
  description:
    'Master the core concepts that govern how distributed systems behave — CAP theorem, consensus algorithms, split brain, quorum, and distributed locks. Understanding these fundamentals is what separates senior engineers from junior ones in system design.',
  category: 'Distributed Systems',
  order: 12,
  difficulty: 'expert',
  estimatedTime: 60,
  prevLesson: 'databases-in-system-design',
  nextLesson: 'messaging-systems',

  content: `
# Distributed Systems Fundamentals

## What Are Distributed Systems?

A **distributed system** is a collection of independent computers (nodes) that appear to users as a single coherent system. Your phone app, the bank behind it, and the servers processing your transaction are all parts of the same distributed system.

**Why they exist:**

1. **Scale beyond a single machine:** A single server has physical limits — CPU, RAM, disk, and network bandwidth. Distributing work across many machines removes these limits.

2. **Fault tolerance:** A single machine will eventually fail. Distributing means no single machine failure takes down the system.

3. **Geographic distribution:** Users in Tokyo and users in New York both need low-latency access. You need servers in both places.

**The cost of distribution:**

Everything becomes harder. You cannot make assumptions that are trivially true on a single machine:
- **Partial failures:** Some nodes work, some don't. The system must handle mixed states.
- **Latency:** Network calls take 1–100ms. On a single machine, function calls take nanoseconds.
- **No shared clock:** Two machines cannot perfectly synchronize their clocks. One machine's "now" is different from another's.
- **No shared memory:** You cannot read another machine's RAM. All communication is through the network.

These constraints are not implementation bugs — they are physical laws. Understanding them is the foundation of distributed systems.

---

## CAP Theorem

Formulated by Eric Brewer in 2000, the CAP theorem states that a distributed system can only guarantee two of three properties simultaneously:

\`\`\`
              Consistency
                  /\\
                 /  \\
                /    \\
               /  CP  \\
              /        \\
             /    CA    \\
            /____________\\
      Availability    Partition
                      Tolerance

You can pick any 2. In practice: P is always required.
Real choice: CP or AP.
\`\`\`

### The Three Properties

**Consistency (C)**
Every read returns the most recent write (or an error). All nodes see the same data at the same time. Note: this is NOT the same as the C in ACID.

**Availability (A)**
Every request receives a response (not necessarily the latest data, but not an error). The system is always operational.

**Partition Tolerance (P)**
The system continues to operate even when network messages are lost or delayed between nodes. A network partition is when Node A cannot communicate with Node B.

### Why P is Not Optional

In any distributed system, network partitions are inevitable. Networks fail. Cables are cut. Data centers lose connectivity. If you require P=false (no partitions), your system must run on a single node — in which case it is no longer distributed.

Therefore: **In a distributed system, you always need partition tolerance.** The real choice is between **Consistency (CP)** and **Availability (AP)**.

### CP — Consistency over Availability

When a partition occurs, CP systems stop responding rather than returning potentially stale data.

\`\`\`
Partition detected:
Node A cannot reach Node B

CP system: "I cannot confirm data freshness → refuse to serve → return error"
Result: System unavailable during partition. Data is always consistent.
\`\`\`

**Examples:**
- **Apache ZooKeeper:** Used for distributed configuration and leader election. If the ZooKeeper quorum cannot be reached, it stops serving requests rather than return stale config.
- **HBase:** Chooses consistency — if region servers cannot coordinate, requests fail.
- **Google Spanner:** CP with global strong consistency using TrueTime.

**Use when:** Leader election, distributed locks, configuration management, financial transactions — scenarios where returning wrong data is worse than returning no data.

### AP — Availability over Consistency

When a partition occurs, AP systems continue serving requests but may return stale or inconsistent data.

\`\`\`
Partition detected:
Node A cannot reach Node B

AP system: "I'll serve what I have, even if it's slightly stale"
Result: System always responds. Data may be briefly inconsistent.
\`\`\`

**Examples:**
- **Amazon DynamoDB (default):** Highly available, eventually consistent.
- **Apache Cassandra:** AP by default — any node accepts writes, eventual consistency.
- **CouchDB:** Optimized for availability, syncs later.

**Use when:** Social media feeds, shopping carts (can merge), DNS, product catalogs, any scenario where brief staleness is acceptable.

### CAP Theorem Criticism and PACELC

CAP has been criticized because it is too binary — it does not say HOW MUCH consistency or availability you sacrifice. The **PACELC theorem** (proposed by Daniel Abadi) extends CAP:

\`\`\`
PACELC:
If there is a Partition (P):
  Choose between Availability (A) and Consistency (C)
Else (E — no partition, normal operation):
  Choose between Latency (L) and Consistency (C)
\`\`\`

Even without partitions, there is a latency-consistency trade-off: stronger consistency requires more coordination between nodes (more network round-trips = more latency).

---

## Consensus — How Nodes Agree

**Consensus** is the problem of getting multiple nodes to agree on a single value, even when some nodes may fail or network messages may be lost.

**Why it is hard:** Imagine three people in different cities trying to agree on dinner without guaranteed phone connections. Some calls drop. Some people may lie. How do you ensure everyone agrees?

### The Byzantine Generals Problem

Formulated by Lamport, Shostak, and Pease (1982): Generals surrounding a city must coordinate an attack or retreat. Some generals may be traitors sending conflicting messages. How can the loyal generals reach consensus despite traitors?

In distributed systems, "traitors" are nodes that fail in arbitrary ways (send corrupted messages, crash mid-operation). This is **Byzantine fault tolerance**.

Most distributed systems assume **crash-fault tolerance** (nodes either work correctly or stop entirely — no lying). Byzantine fault tolerance is necessary in systems with untrusted participants (blockchains).

### Raft Consensus Algorithm

Raft was designed to be understandable (unlike Paxos). It works by electing a **leader** who has sole authority to commit entries to a replicated log.

**Key roles:**
- **Leader:** Handles all writes. Sends heartbeats to followers. Exactly one leader at a time.
- **Follower:** Passively replicate log entries from the leader. If no heartbeat received, can become candidate.
- **Candidate:** Trying to become leader. Asks other nodes to vote.

**Leader Election:**
1. Followers wait for leader heartbeats. If none received within a timeout (150–300ms), they become candidates.
2. Candidate increments its term number and sends vote requests to all other nodes.
3. Each node votes for the first candidate it hears from in a given term.
4. Candidate with majority vote becomes new leader.

**Log Replication:**
1. Client sends write to leader.
2. Leader appends entry to its log.
3. Leader sends entry to all followers.
4. When a majority (quorum) of followers acknowledge, the entry is committed.
5. Leader notifies client of success.

**Why Raft works:** Only a node with the most up-to-date log can win an election (verified by log index comparison during voting). This prevents old/stale nodes from becoming leader.

**Raft is used in:** etcd (Kubernetes), CockroachDB, TiKV, Consul.

### Paxos

The original consensus algorithm, considered the gold standard but notoriously difficult to understand and implement correctly. Raft was explicitly designed as a more understandable alternative. Paxos is used in Google Chubby, Apache Zookeeper (modified as ZAB), and Cassandra (lightweight transactions).

**Where consensus is used:**
- **Leader election:** Elect one leader among multiple candidates
- **Distributed configuration:** Ensure all nodes have the same config
- **Distributed transactions:** All participants must agree to commit or abort

---

## Split Brain

**Split brain** occurs when a network partition divides a cluster into two groups, each believing it is the only active partition and electing its own leader. Now you have **two leaders** accepting writes simultaneously.

\`\`\`
Before partition:
  [Node 1 - Leader] ---- [Node 2] ---- [Node 3]

After network partition:
  [Node 1 - Leader]     [Node 2 - Leader] ---- [Node 3]
       |                      |
  Accepts writes         Accepts writes
  (partition A)          (partition B)

Both leaders accept conflicting writes. Data diverges.
When partition heals: ??? which writes win?
\`\`\`

**Why it is catastrophic:** Two leaders can make conflicting decisions. In a database, both may write to the same row with different values. In a distributed lock, both may grant the same lock to different holders. Data integrity is destroyed.

### Preventing Split Brain

**Quorum (Majority Rule):** A leader can only operate if it can reach a majority of nodes. With 3 nodes, a partition of 2 vs 1: the group of 2 has quorum and becomes the active partition. The group of 1 cannot reach quorum and stops accepting writes.

\`\`\`
3 nodes, partition: {A, B} vs {C}
  - {A, B} have 2/3 nodes = majority → continue operating
  - {C} has 1/3 nodes = minority → step down, stop accepting writes
Result: Only one active partition, no split brain
\`\`\`

**Fencing Tokens:** When a leader is elected, it receives an incrementing token (fence). Any write to storage must include this token. Storage rejects writes with an older token. If an old leader (thought it was still leader during a partition) tries to write, its old token is rejected.

---

## Quorum

A **quorum** is the minimum number of nodes that must agree for an operation to succeed.

**Formula:** Quorum = floor(N/2) + 1 (majority)

For N=3: quorum = 2. For N=5: quorum = 3.

### Why Quorum Works

With N nodes and quorum Q:
- Writes succeed only if Q nodes acknowledge
- Reads succeed only if Q nodes respond
- Any write set and read set must overlap (because both have majority)
- The overlap guarantees at least one node has the latest write

**Concrete example (N=3, W=2, R=2):**

\`\`\`
Write: Nodes 1, 2 acknowledge (Node 3 down or slow)
Read:  Query Nodes 2, 3 (Node 1 temporarily unreachable)
Overlap: Node 2 is in both sets → Node 2 has the latest write
Read returns Node 2's value = correct result
\`\`\`

**N=5, W=3, R=3:** Even more resilient. Can tolerate 2 node failures while maintaining consistency (any write set of 3 and read set of 3 overlap by at least 1 from 5 nodes).

---

## Distributed Locks

In a single machine, you use a mutex to prevent concurrent access to a shared resource. In a distributed system, you need a **distributed lock** — a lock that multiple nodes can coordinate on.

**Use cases:**
- Prevent two workers from processing the same job
- Ensure only one node runs a cron job at a time
- Coordinate access to a shared external resource

### Redis SETNX Approach

\`\`\`
SETNX lock_key "holder_id" EX 30
// SET if Not EXists, with 30-second expiry
// Returns 1 if lock acquired, 0 if already held
\`\`\`

Simple but has problems:
- **Lock expiry:** If the holder crashes, the lock expires and another node can acquire it — good.
- **False expiry:** If the holder pauses (GC pause, slow operation) longer than TTL, the lock expires while the holder thinks it still holds it. Two nodes now hold the lock simultaneously.

### Redlock Algorithm

Martin Kleppmann's Redlock uses multiple independent Redis instances (N=5 recommended):

1. Get current timestamp T1
2. Try to acquire lock on all N Redis instances simultaneously
3. Count successful acquisitions
4. If successful on majority (3/5) AND total elapsed time < TTL: lock is held
5. If not: release lock on all instances, retry

**Problems with Redlock:**
- **Clock skew:** If Redis instances have different clock times, the TTL calculation is unreliable.
- **GC pauses:** A long GC pause on the lock holder can outlast the TTL, causing two holders.
- **Network delays:** Slow network can make the elapsed time check unreliable.

**Kleppmann vs Antirez debate:** Kleppmann argues Redlock is fundamentally unsafe for mutually exclusive operations due to these issues. Antirez (Redis creator) argues it is safe enough in practice.

**Safer alternative:** Use fencing tokens with Redlock. Every lock acquisition increments a monotonic counter. Storage layers reject writes with old token values, so even if a lock is inadvertently held by two nodes, old-token writes are rejected.

---

## Clocks in Distributed Systems

You cannot rely on wall-clock time for ordering events across machines. Clocks drift. A machine that was paused (VM migration) might be behind by seconds.

**Lamport Clocks:** Logical clocks that capture event ordering within a distributed system without relying on wall time. Each node increments its logical clock on every event. On communication, the receiver takes max(own_clock, sender_clock) + 1. This gives a partial ordering of events.

**Vector Clocks:** Extend Lamport clocks to detect causality — did event A cause event B, or are they concurrent? Used in DynamoDB and Riak for conflict detection.

**Google TrueTime:** Google Spanner uses atomic clocks and GPS receivers to provide bounded clock uncertainty. Spanner waits out this uncertainty before committing, providing global strong consistency with known latency bounds. TrueTime is what allows Spanner to be CP at global scale.
`,

  codeExamples: [
    {
      title: 'Raft-Inspired Leader Election — Simplified',
      code: `// Simplified Raft leader election concepts in TypeScript
// This illustrates the key ideas, not a production implementation

type NodeState = 'follower' | 'candidate' | 'leader';

class RaftNode {
  id: string;
  state: NodeState = 'follower';
  currentTerm: number = 0;
  votedFor: string | null = null;
  votes: Set<string> = new Set();
  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(id: string, private peers: RaftNode[], private quorum: number) {
    this.id = id;
    this.resetHeartbeatTimeout();
  }

  private resetHeartbeatTimeout() {
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    // Random timeout between 150-300ms to avoid simultaneous elections
    const timeout = 150 + Math.random() * 150;
    this.heartbeatTimeout = setTimeout(() => this.startElection(), timeout);
  }

  startElection() {
    if (this.state === 'leader') return;

    this.state = 'candidate';
    this.currentTerm++;
    this.votedFor = this.id; // Vote for self
    this.votes = new Set([this.id]);

    console.log(\`Node \${this.id}: Starting election for term \${this.currentTerm}\`);

    // Request votes from all peers
    for (const peer of this.peers) {
      peer.requestVote(this.id, this.currentTerm).then(granted => {
        if (granted) {
          this.votes.add(peer.id);
          if (this.votes.size >= this.quorum && this.state === 'candidate') {
            this.becomeLeader();
          }
        }
      });
    }
  }

  requestVote(candidateId: string, term: number): Promise<boolean> {
    // Grant vote if: haven't voted this term AND candidate's term is at least as high
    if (term > this.currentTerm && (this.votedFor === null || this.votedFor === candidateId)) {
      this.currentTerm = term;
      this.votedFor = candidateId;
      this.state = 'follower';
      console.log(\`Node \${this.id}: Voting for \${candidateId} in term \${term}\`);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  becomeLeader() {
    this.state = 'leader';
    console.log(\`Node \${this.id}: Became LEADER for term \${this.currentTerm}\`);
    // Start sending heartbeats to maintain leadership
    this.sendHeartbeats();
  }

  private sendHeartbeats() {
    if (this.state !== 'leader') return;
    this.peers.forEach(peer => peer.receiveHeartbeat(this.id, this.currentTerm));
    setTimeout(() => this.sendHeartbeats(), 50); // Heartbeat every 50ms
  }

  receiveHeartbeat(leaderId: string, term: number) {
    if (term >= this.currentTerm) {
      this.currentTerm = term;
      this.state = 'follower';
      this.resetHeartbeatTimeout(); // Reset election timer
    }
  }
}`,
      explanation:
        'This illustrates Raft\'s core election mechanism: nodes start as followers, time out if they hear no heartbeat, become candidates, and collect votes. Majority wins becomes leader and broadcasts heartbeats to prevent new elections.',
    },
    {
      title: 'Distributed Lock with Redis and Fencing Token',
      code: `import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';

class DistributedLock {
  private redis: Redis;
  private lockKey: string;
  private holder: string;
  private ttl: number; // milliseconds

  constructor(redis: Redis, resource: string, ttlMs: number = 30000) {
    this.redis = redis;
    this.lockKey = \`lock:\${resource}\`;
    this.holder = uuid(); // Unique ID for this lock holder
    this.ttl = ttlMs;
  }

  async acquire(): Promise<number | null> {
    // Lua script ensures atomic: SET if not exists + INCR fence token
    const script = \`
      local existing = redis.call('GET', KEYS[1])
      if existing == false then
        -- Get and increment fence token (monotonically increasing)
        local token = redis.call('INCR', KEYS[2])
        -- SET key holder_id EX ttl_seconds
        redis.call('SET', KEYS[1], ARGV[1], 'PX', ARGV[2])
        return token
      end
      return nil
    \`;

    const token = await this.redis.eval(
      script,
      2,
      this.lockKey,
      \`\${this.lockKey}:token\`,
      this.holder,
      this.ttl
    ) as number | null;

    if (token !== null) {
      console.log(\`Lock acquired by \${this.holder}, fence token: \${token}\`);
    }
    return token; // Return fence token to pass to storage operations
  }

  async release(): Promise<boolean> {
    // Only release if WE hold the lock (check holder ID)
    const script = \`
      if redis.call('GET', KEYS[1]) == ARGV[1] then
        return redis.call('DEL', KEYS[1])
      else
        return 0
      end
    \`;
    const result = await this.redis.eval(script, 1, this.lockKey, this.holder) as number;
    return result === 1;
  }
}

// Storage layer that enforces fencing tokens
class FencedStorage {
  private data: Map<string, { value: any; token: number }> = new Map();

  write(key: string, value: any, fenceToken: number): boolean {
    const existing = this.data.get(key);
    if (existing && existing.token >= fenceToken) {
      console.error(\`Rejected write: old token \${fenceToken} <= stored \${existing.token}\`);
      return false; // Reject stale write (prevents split-brain data corruption)
    }
    this.data.set(key, { value, token: fenceToken });
    return true;
  }
}`,
      output: `Lock acquired by a3f2..., fence token: 42
Write accepted with token 42
Write rejected: old token 41 <= stored 42  // Old leader trying to write after expiry`,
      explanation:
        'The fencing token is the critical safety mechanism. Even if a lock holder\'s TTL expires (GC pause, network delay) and another holder acquires the lock, the old holder\'s writes are rejected by storage because their token is lower than the new holder\'s token.',
    },
    {
      title: 'Quorum Read/Write Simulation',
      code: `// Simulates quorum behavior: guarantees consistency with node failures

interface DataEntry {
  value: any;
  version: number;
}

class QuorumCluster {
  private nodes: Map<number, Map<string, DataEntry>> = new Map();
  private N: number;
  private W: number; // Write quorum
  private R: number; // Read quorum

  constructor(N: number, W: number, R: number) {
    this.N = N;
    this.W = W;
    this.R = R;

    if (W + R <= N) throw new Error(\`W(\${W}) + R(\${R}) must be > N(\${N}) for consistency\`);

    for (let i = 0; i < N; i++) {
      this.nodes.set(i, new Map());
    }
    console.log(\`Cluster: N=\${N}, W=\${W}, R=\${R}. Quorum guarantee: W+R=\${W+R} > N=\${N} ✓\`);
  }

  async write(key: string, value: any, failedNodes: number[] = []): Promise<boolean> {
    const version = Date.now();
    let acks = 0;

    for (const [nodeId, store] of this.nodes) {
      if (failedNodes.includes(nodeId)) {
        console.log(\`  Node \${nodeId}: FAILED (simulated)\`);
        continue;
      }
      store.set(key, { value, version });
      acks++;
      console.log(\`  Node \${nodeId}: Wrote "\${value}" v\${version}\`);
    }

    if (acks >= this.W) {
      console.log(\`Write SUCCESS: \${acks}/\${this.N} acks (need \${this.W})\`);
      return true;
    }
    console.log(\`Write FAILED: only \${acks}/\${this.N} acks\`);
    return false;
  }

  async read(key: string, failedNodes: number[] = []): Promise<any> {
    const responses: DataEntry[] = [];

    for (const [nodeId, store] of this.nodes) {
      if (failedNodes.includes(nodeId)) continue;
      const entry = store.get(key);
      if (entry) responses.push(entry);
    }

    if (responses.length < this.R) {
      throw new Error(\`Read FAILED: only \${responses.length} responses (need \${this.R})\`);
    }

    // Take the value with the highest version (latest write)
    const latest = responses.reduce((a, b) => a.version > b.version ? a : b);
    console.log(\`Read SUCCESS from \${responses.length} nodes → "\${latest.value}"\`);
    return latest.value;
  }
}

// Demo
const cluster = new QuorumCluster(3, 2, 2);
await cluster.write('user:1', 'Alice', []);          // All nodes write
await cluster.write('user:1', 'Alice Updated', [2]); // Node 2 fails during write
await cluster.read('user:1', [0]);                   // Node 0 fails during read
// Read hits nodes 1 and 2. Node 1 has latest. Returns 'Alice Updated'. ✓`,
    },
  ],

  commonMistakes: [
    'Treating CAP as "pick any two freely" — Partition Tolerance is mandatory in distributed systems. The real choice is CP vs AP.',
    'Assuming eventual consistency means "briefly wrong" — in worst-case scenarios (under partitions), eventual consistency can be stale for minutes or longer.',
    'Confusing CAP Consistency with ACID Consistency — they mean different things. CAP Consistency means "all nodes see the same data." ACID Consistency means "data satisfies defined constraints."',
    'Implementing distributed locks without fencing tokens — a lock holder that pauses (GC, network) longer than TTL can corrupt shared state even after the lock expires.',
    'Using odd numbers of nodes without understanding why — odd numbers prevent ties in quorum voting. 2 nodes is worse than 3: 2 nodes requires 2/2 for quorum = no fault tolerance.',
    'Ignoring clock skew — using system time for event ordering or lock TTL calculations in distributed systems leads to subtle, hard-to-reproduce bugs.',
    'Building a distributed system when a single machine would suffice — distributed systems are exponentially more complex. Add distribution only when genuinely needed.',
    'Thinking consensus is free — every consensus round requires multiple network round-trips. Raft leader election can take 150-300ms. Design systems to minimize consensus operations.',
  ],

  interviewQuestions: [
    {
      question: 'Explain the CAP theorem. What does it mean in practice?',
      difficulty: 'advanced',
      answer:
        'CAP states a distributed system can only guarantee two of: Consistency (all reads return the latest write), Availability (every request gets a response), and Partition Tolerance (system works despite network splits). In practice, Partition Tolerance is mandatory — networks always fail eventually. So the real choice is CP (sacrifice availability during partitions — return errors instead of stale data) vs AP (sacrifice consistency — return potentially stale data but always respond). CP systems: ZooKeeper, HBase, Spanner. AP systems: DynamoDB, Cassandra, CouchDB. PACELC extends this: even without partitions, there is a latency-consistency trade-off.',
      followUp: ['Can you give an example of when you would choose CP vs AP?', 'What is PACELC and why was it introduced?'],
      tip: 'Always clarify that CAP Consistency != ACID Consistency — interviewers sometimes conflate them.',
    },
    {
      question: 'What is split brain? How do you prevent it?',
      difficulty: 'advanced',
      answer:
        'Split brain occurs when a network partition divides a cluster and both partitions elect their own leader, resulting in two active leaders accepting writes simultaneously. This leads to data divergence and integrity loss. Prevention: (1) Quorum — a leader can only operate if it has majority (>N/2) of nodes. A partition of {2 nodes} vs {1 node} from a 3-node cluster: the group of 2 has quorum, the group of 1 must step down. Only one leader ever active. (2) Fencing tokens — monotonically increasing tokens assigned on leader election. Storage rejects writes with old token values, so old leaders\' stale writes are rejected even if they erroneously think they\'re still leaders.',
      followUp: ['Why is odd number of nodes preferred for consensus clusters?'],
    },
    {
      question: 'What is the W + R > N quorum formula? Give an example.',
      difficulty: 'advanced',
      answer:
        'In a leaderless distributed system with N nodes, W is the write quorum (number of nodes that must acknowledge a write) and R is the read quorum (number of nodes that must respond to a read). When W + R > N, the write and read sets are guaranteed to overlap by at least one node. That overlapping node always has the latest write, so reads always return current data. Example: N=3, W=2, R=2. Write goes to nodes {1,2}. Read queries {2,3}. Node 2 is the overlap and has the latest write. The read returns the correct value even with node 1 down.',
    },
    {
      question: 'How does Raft differ from Paxos?',
      difficulty: 'expert',
      answer:
        'Both Raft and Paxos solve distributed consensus (getting nodes to agree on a sequence of values). Raft was explicitly designed for understandability while Paxos is notoriously difficult to understand and implement correctly. Key Raft differences: (1) Strong leader — all log entries flow through the leader, simpler log replication. (2) Randomized election timeouts — simple mechanism to prevent simultaneous elections. (3) Log matching property — clearly defined rules for when logs are considered identical. Raft is used in etcd, CockroachDB, Consul. Paxos is used in Google Chubby, ZooKeeper (via ZAB). In practice, neither is used verbatim — both have many practical variants and optimizations.',
      tip: 'Mention that you have used etcd or Consul if you have — it shows practical familiarity with Raft-based systems.',
    },
    {
      question: 'What are the problems with distributed locks? How do you make them safe?',
      difficulty: 'expert',
      answer:
        'Core problem: a lock holder can hold a lock past its TTL due to GC pauses, VM migration, or network delays. While the holder thinks it still holds the lock, another process acquires it. Now two processes hold the lock — mutual exclusion is violated. Safety mechanism: fencing tokens. Every lock acquisition increments a monotonic counter and returns the token. The lock holder passes this token with every write to shared storage. Storage rejects writes with token values lower than the current maximum. Even if an expired lock holder wakes up and tries to write, its lower token is rejected.',
      followUp: ['What is the Redlock algorithm? What are its criticisms?'],
    },
    {
      question: 'Why can\'t you use wall-clock time to order events in a distributed system?',
      difficulty: 'expert',
      answer:
        'Wall clocks on different machines drift from each other due to hardware variations, network time sync delays, and VM pauses. A machine that was hibernated may be minutes behind. This means you cannot compare timestamps across machines and trust the ordering. Solutions: (1) Lamport clocks — logical clocks that increment on each event and synchronize on communication, giving partial ordering. (2) Vector clocks — detect causality and concurrency between events. (3) Google TrueTime — uses atomic clocks + GPS to provide bounded clock uncertainty; Spanner waits out this uncertainty window before committing, enabling global strong consistency with known latency overhead.',
    },
  ],

  exercises: [
    {
      id: 'dist-sys-ex-1',
      title: 'Classify Systems as CP or AP and Justify',
      description:
        'For each system below, determine whether it should be CP (prefer consistency over availability) or AP (prefer availability over consistency). Then write a one-paragraph justification explaining what goes wrong if you choose the wrong model. Systems: (1) Distributed database for a bank\'s account balances, (2) Shopping cart in an e-commerce app, (3) Leader election in a Kubernetes cluster, (4) A social media "view count" counter, (5) A distributed rate limiter that caps API calls at 1000/minute per user.',
      starterCode: `interface SystemClassification {
  system: string;
  model: 'CP' | 'AP';
  justification: string;
  wrongChoiceConsequence: string;
}

function classifySystems(): SystemClassification[] {
  // TODO: Classify each system and explain your reasoning
  // Key question for each: "What happens if two nodes see different data?"
  return [];
}`,
      solution: `function classifySystems(): SystemClassification[] {
  return [
    {
      system: "Bank account balances",
      model: 'CP',
      justification: "Financial data requires strong consistency. Every debit and credit must be seen by all nodes immediately. An account balance is a shared mutable value where concurrent reads must agree.",
      wrongChoiceConsequence: "If AP: Node A shows balance $100, deducts $100 (balance = $0). Node B (stale) still shows $100, allows another $100 deduction. Account goes to -$100. Money is lost. This is a direct financial loss.",
    },
    {
      system: "Shopping cart",
      model: 'AP',
      justification: "Shopping carts are user-scoped and items can be merged on sync. Amazon famously chose AP for shopping carts — if two devices add items while disconnected, merge both additions. Brief inconsistency is acceptable: worst case, a user adds the same item twice and removes a duplicate.",
      wrongChoiceConsequence: "If CP: During a partition, the cart becomes unavailable. Users cannot add items. E-commerce revenue drops directly. The cost of lost sales exceeds the cost of a merged duplicate item.",
    },
    {
      system: "Kubernetes leader election",
      model: 'CP',
      justification: "Exactly one leader must manage the cluster at any time. Split brain (two leaders) would cause both to schedule the same pod on multiple nodes, create conflicting deployments, and corrupt cluster state. Correctness is more important than availability.",
      wrongChoiceConsequence: "If AP: Network partition causes two nodes to both become leaders. Both start creating resources, scheduling pods, and updating cluster state simultaneously. When partition heals, state is irreconcilable. Manual intervention required.",
    },
    {
      system: "Social media view count",
      model: 'AP',
      justification: "View counts are approximate by nature — concurrent increments from millions of users are inherently racy. A view count showing 1,249,999 instead of 1,250,000 has zero business impact. High availability and low latency of increment operations matter far more.",
      wrongChoiceConsequence: "If CP: Every view increment requires quorum acknowledgment. At 1M views/second, the quorum coordination overhead would make the system too slow. The consistency gained is useless — the count is still approximate due to concurrent reads.",
    },
    {
      system: "Distributed rate limiter (1000 req/min)",
      model: 'CP',
      justification: "Rate limiting that is critical for security or billing must be consistent. If nodes disagree on the count, a user can make more than the allowed requests by routing to different nodes. Each node seeing a stale lower count allows more requests through.",
      wrongChoiceConsequence: "If AP: User is allowed 1000 req/min per node. With 5 nodes each independently counting, user makes up to 5000 req/min total. Rate limit is completely defeated. If this is a paid tier limit, revenue is lost. If it is abuse prevention, attackers exploit it.",
    },
  ];
}`,
      hints: [
        'The key question is: "What is the worst-case consequence of two nodes briefly seeing different data?"',
        'If the consequence is financial loss, security breach, or data corruption → CP.',
        'If the consequence is a stale UI, approximate counter, or reconcilable state → AP.',
        'Shopping carts are a classic AP example — merging two lists is safe and acceptable.',
      ],
    },
    {
      id: 'dist-sys-ex-2',
      title: 'Design a Distributed Job Queue with Exactly-Once Processing',
      description:
        'You are building a system where workers pick up jobs from a queue and process them. The requirement: each job must be processed exactly once, even if a worker crashes mid-processing. Identify the distributed systems challenges (at-least-once vs exactly-once, duplicate detection, worker failure), then design the solution using: distributed locks with fencing tokens, idempotency keys, and a status machine.',
      starterCode: `// Design a job processing system that guarantees exactly-once processing

interface Job {
  id: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  lockToken?: number;
  workerId?: string;
  processingStartedAt?: Date;
}

class ExactlyOnceJobQueue {
  private jobs: Map<string, Job> = new Map();
  private lockTokenCounter: number = 0;

  // TODO: Implement acquireJob()
  // Must atomically: find a pending job, mark it 'processing',
  // assign a fencing token and worker ID
  async acquireJob(workerId: string): Promise<{ job: Job; token: number } | null> {
    // Your implementation here
    return null;
  }

  // TODO: Implement completeJob()
  // Must validate: only the current lock holder can complete
  // Use fencing token to reject stale completions
  async completeJob(jobId: string, workerId: string, token: number): Promise<boolean> {
    // Your implementation here
    return false;
  }

  // TODO: Implement recoverStaleLocks()
  // Find jobs stuck in 'processing' for >5 minutes (worker crashed)
  // Reset them to 'pending' for reprocessing
  async recoverStaleLocks(): Promise<number> {
    // Your implementation here
    return 0;
  }
}`,
      solution: `class ExactlyOnceJobQueue {
  private jobs: Map<string, Job> = new Map();
  private lockTokenCounter: number = 0;

  async acquireJob(workerId: string): Promise<{ job: Job; token: number } | null> {
    // Find first pending job (in production: use DB atomic SELECT FOR UPDATE SKIP LOCKED)
    const pendingJob = [...this.jobs.values()].find(j => j.status === 'pending');
    if (!pendingJob) return null;

    // Atomically assign lock with incrementing token
    const token = ++this.lockTokenCounter;
    pendingJob.status = 'processing';
    pendingJob.lockToken = token;
    pendingJob.workerId = workerId;
    pendingJob.processingStartedAt = new Date();

    console.log(\`Worker \${workerId} acquired job \${pendingJob.id} with token \${token}\`);
    return { job: pendingJob, token };
  }

  async completeJob(jobId: string, workerId: string, token: number): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    // Fencing token check: reject if token is stale
    if (job.lockToken !== token) {
      console.error(\`Rejected: stale token \${token}, current token \${job.lockToken} (worker \${workerId})\`);
      return false; // Another worker has the lock now
    }

    if (job.workerId !== workerId) {
      console.error(\`Rejected: wrong worker \${workerId}, lock held by \${job.workerId}\`);
      return false;
    }

    job.status = 'completed';
    job.lockToken = undefined;
    console.log(\`Job \${jobId} completed by worker \${workerId}\`);
    return true;
  }

  async recoverStaleLocks(): Promise<number> {
    const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    let recovered = 0;

    for (const job of this.jobs.values()) {
      if (
        job.status === 'processing' &&
        job.processingStartedAt &&
        (now - job.processingStartedAt.getTime()) > STALE_THRESHOLD_MS
      ) {
        console.log(\`Recovering stale job \${job.id} (locked by crashed worker \${job.workerId})\`);
        job.status = 'pending';
        job.lockToken = undefined;
        job.workerId = undefined;
        job.processingStartedAt = undefined;
        recovered++;
      }
    }
    return recovered;
  }
}`,
      hints: [
        'Atomic acquire is the critical operation — in production use SELECT FOR UPDATE SKIP LOCKED in PostgreSQL.',
        'Fencing tokens prevent a crashed-and-recovered worker from completing a job that another worker is now processing.',
        'Recovery from stale locks is essential — without it, crashed workers leave jobs permanently stuck in "processing" state.',
        'Idempotent processing (safe to run twice) + at-least-once delivery = effectively exactly-once semantics.',
      ],
    },
  ],

  keyTakeaways: [
    'Distributed systems trade the simplicity of a single machine for scale and fault tolerance, but introduce new categories of problems: partial failures, latency, and no shared clock.',
    'CAP theorem in practice: Partition Tolerance is mandatory. The real choice is CP (consistency over availability) or AP (availability over consistency during partitions).',
    'Use CP for: financial data, leader election, distributed locks, inventory. Use AP for: social feeds, shopping carts, view counts, product catalogs.',
    'PACELC extends CAP: even without partitions, there is a latency-consistency trade-off. Strong consistency always costs latency.',
    'Consensus (Raft, Paxos) solves distributed agreement. Raft is simpler and more understandable; Paxos is the theoretical foundation. Both require quorum acknowledgment.',
    'Split brain (two leaders) is catastrophic. Prevention: quorum (only majority partition can lead) and fencing tokens (storage rejects stale writes).',
    'Quorum guarantee W + R > N ensures read and write sets always overlap, so reads always return the latest write even with node failures.',
    'Distributed locks are fundamentally unsafe without fencing tokens because lock TTL can expire during GC pauses or network delays.',
    'Never use wall-clock time for event ordering across machines. Use Lamport clocks (logical ordering) or Vector clocks (causal ordering).',
    'Build distributed systems only when a single machine genuinely cannot meet requirements. The complexity cost is enormous.',
  ],
};
