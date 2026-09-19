import type { Lesson } from '@/types';

export const introductionLesson: Lesson = {
  id: 'introduction-to-system-design',
  slug: 'introduction-to-system-design',
  title: 'Introduction to System Design',
  description:
    'Understand what system design is, why it exists, and the core principles every engineer must know before designing any system.',
  category: 'Introduction',
  order: 1,
  difficulty: 'beginner',
  estimatedTime: 30,
  nextLesson: 'system-design-thinking',

  content: `# Introduction to System Design

## What Is System Design?

System design is the process of defining the **architecture, components, modules, interfaces, and data flow** of a system to satisfy a set of specified requirements.

But that definition doesn't tell you much. Let's go deeper.

When you write a function, you think about inputs and outputs. When you design a class, you think about state and behavior. When you design a system, you think about **how millions of users interact with software that runs on hundreds of machines, stores terabytes of data, and must never go down.**

System design is engineering at scale. It is the discipline of answering:

- How do we handle 10 million users without the system crashing?
- How do we make sure a user's data is never lost, even if a hard drive dies?
- How do we deploy new features without taking the entire product offline?
- How do we store petabytes of data cheaply and retrieve it in milliseconds?

System design is not about picking the right tool. It is about understanding **why** a tool exists, **what problem** it solves, and **when** the tradeoffs make it the right choice.

---

## Why Does System Design Exist?

In the early days of software, a single developer wrote a program that ran on one computer for one user. There were no users at scale, no concurrent requests, no distributed data. Simple programs solved simple problems.

The internet changed everything.

Now a single product — say, WhatsApp — must handle **100 billion messages per day** across **2 billion users** in **180+ countries**. No single computer can do this. No single database can store this. No single server can respond to 1.6 million requests per second.

System design exists because **scale breaks everything that works at small scale**.

A HashMap that works perfectly for 1000 entries will cause memory crashes at 100 million entries. A single SQL database that handles your startup's 100 users will become a bottleneck at 1 million users. A single server that serves your personal blog will collapse under a traffic spike from a viral post.

System design is the engineering discipline that anticipates these failures **before they happen** and designs systems that remain correct, fast, and available even as they grow.

---

## Functional vs Non-Functional Requirements

Before designing anything, you must understand **what you are building** and **how well it must work**.

### Functional Requirements

Functional requirements describe **what the system does** — its features and behaviors.

Examples:
- Users can register with email and password
- Users can upload photos up to 10MB
- Users can send messages to other users
- Admins can ban users
- The system sends email notifications on new orders

These are the features. If any of these are missing, the system is **functionally incomplete**.

### Non-Functional Requirements

Non-functional requirements describe **how well the system does what it does** — quality attributes.

Examples:
- The system must respond in under 200ms for 99% of requests
- The system must be available 99.99% of the time
- The system must support 1 million concurrent users
- User data must be encrypted at rest and in transit
- The system must recover from a server crash within 30 seconds

| Aspect | Functional Requirement | Non-Functional Requirement |
|---|---|---|
| Definition | What the system does | How well the system does it |
| Example | "User can log in" | "Login must complete in < 300ms" |
| If violated | System is broken | System is degraded or risky |
| Who defines | Product managers | Engineers + architects |
| Testable | Yes (pass/fail) | Yes (measured against SLA) |

**Critical insight:** Non-functional requirements are what make system design hard. Any junior developer can implement login. Making login work for 50 million concurrent users, never losing a session, and responding in under 100ms worldwide — that requires system design.

---

## Scalability

Scalability is the ability of a system to handle **growing amounts of work** by adding resources.

There are two types:

### Vertical Scaling (Scale Up)
Add more power to the existing machine: more CPU, more RAM, faster disks.

**Pros:** Simple, no code changes needed, no distributed system complexity.
**Cons:** Has a hard ceiling. The biggest server Amazon offers still has limits. Very expensive. Single point of failure.

### Horizontal Scaling (Scale Out)
Add more machines and distribute the load across them.

**Pros:** Theoretically unlimited. Fault tolerant — if one machine dies, others continue. Cost-effective (use commodity hardware).
**Cons:** Much more complex. Requires load balancers, distributed state management, consistency challenges.

Most internet-scale systems eventually require horizontal scaling. This is why system design becomes complex — distributing work across machines introduces problems that don't exist on a single machine.

---

## Reliability

Reliability is the probability that a system **performs its required functions under stated conditions for a specified period of time**.

In plain English: does the system do what it's supposed to do, consistently, even when things go wrong?

Things that go wrong in production:
- Hard drives fail (HDDs fail at ~1.5% per year — at 1000 servers, that's 15 failures per year)
- Network packets are lost or corrupted
- Power goes out in a datacenter
- Software bugs are deployed
- A dependent service goes down
- A malicious actor sends malformed requests

Reliable systems handle these failures **gracefully**. They don't crash. They don't corrupt data. They degrade gracefully or recover automatically.

Techniques for reliability:
- **Redundancy**: Run multiple copies so one can fail without impact
- **Replication**: Copy data to multiple locations
- **Checksums**: Detect data corruption
- **Retries with backoff**: Handle transient failures
- **Circuit breakers**: Stop calling a failing service

---

## Availability

Availability is the percentage of time a system is **operational and accessible**.

This is usually expressed as "nines":

| Availability | Downtime per Year | Downtime per Month | Downtime per Day | Use Case |
|---|---|---|---|---|
| 99% (two nines) | 87.6 hours | 7.3 hours | ~14 minutes | Internal tools |
| 99.9% (three nines) | 8.76 hours | 43.8 minutes | ~1.4 minutes | Small web apps |
| 99.99% (four nines) | 52.6 minutes | 4.38 minutes | ~8.6 seconds | E-commerce, SaaS |
| 99.999% (five nines) | 5.26 minutes | 26.3 seconds | ~0.86 seconds | Banking, telecom |
| 99.9999% (six nines) | 31.5 seconds | ~2.6 seconds | < 1 second | Nuclear, aviation |

**Critical insight:** The difference between 99.9% and 99.99% is not "a little better" — it is an order of magnitude difference in allowed downtime. Going from 99.9% to 99.99% requires significant architectural investment.

High availability is achieved through:
- No single point of failure (redundant components at every layer)
- Automatic failover (when one node fails, another takes over)
- Health checks and monitoring
- Load balancing across multiple instances
- Geographic distribution (multiple datacenters)

---

## Maintainability

A system that is hard to maintain will accumulate **technical debt** — and technical debt compounds over time like financial debt.

Maintainability has three dimensions:

1. **Operability**: Can the operations team keep the system running? Is it easy to monitor, debug, and deploy?
2. **Simplicity**: Can new engineers understand the system without months of context? Is complexity managed?
3. **Evolvability**: Can the system be changed easily as requirements evolve?

The best system design is one where an engineer who joins the team 2 years later can understand what is happening, why decisions were made, and how to safely change things.

---

## Performance: Latency vs Throughput

**Latency** is how long a single operation takes. "How fast does my request complete?"

**Throughput** is how many operations the system can handle per unit of time. "How many requests per second can the system handle?"

These are related but different. A system can have:
- Low latency, low throughput (fast but can't handle many users)
- High latency, high throughput (slow per request but handles millions)
- Low latency, high throughput (the goal — fast AND scalable)

Example: A database query that takes 5ms (low latency) on a server that handles 10,000 queries per second (high throughput) is an excellent performer. The same 5ms query on a server that handles only 10 queries per second has terrible throughput, even though latency is the same.

---

## Security as a Design Concern

Security is not something you add at the end. It must be designed into the system from the beginning.

Design-level security considerations:
- **Authentication**: Who are you? (passwords, tokens, biometrics)
- **Authorization**: What are you allowed to do? (roles, permissions)
- **Encryption**: Data in transit (TLS) and at rest (AES encryption)
- **Input validation**: Never trust user input at any layer
- **Rate limiting**: Prevent abuse and DDoS attacks
- **Audit logging**: Record who did what, when, from where
- **Principle of least privilege**: Services should only have access to what they need

Security breaches are catastrophically expensive — in money, reputation, and legal liability. The Equifax breach in 2017 cost $700 million. It was caused by a failure to patch a known vulnerability. Security in system design means thinking: "What happens if an attacker tries to break this?"

---

## Cost as an Engineering Constraint

Every system design decision has a cost implication. More redundancy costs more. More storage costs more. Lower latency costs more.

Experienced engineers think about:
- **Storage costs**: How much data are we storing? How long do we keep it?
- **Compute costs**: How many servers do we need? Can we use spot instances?
- **Network costs**: How much data crosses region boundaries? (Inter-region traffic is expensive)
- **Operational costs**: How much human time does this require to operate?

A system that handles 10 million users but costs $10 million per month when a simpler design would cost $100,000 is a bad design — even if it's technically impressive.

---

## The Fundamental Truth: Every Design Decision is a Tradeoff

This is the most important concept in system design.

**There is no perfect system.** Every decision gains something and gives up something.

Examples:
- More consistency → less availability (CAP theorem)
- More caching → potential stale data
- More redundancy → higher cost
- Microservices → independent scaling, but more network complexity
- SQL → strong consistency, but harder to scale horizontally
- NoSQL → easy horizontal scale, but weaker consistency

The job of a system designer is not to find the perfect solution. It is to understand the tradeoffs and make **informed decisions** based on the specific requirements of the system.

---

## A Basic System Architecture

\`\`\`
                    ┌─────────────────────────────────────────┐
                    │             INTERNET                     │
                    └────────────────┬────────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────────────┐
                    │           LOAD BALANCER                  │
                    │   (distributes requests across servers)  │
                    └────┬──────────────────────┬─────────────┘
                         │                      │
                         ▼                      ▼
              ┌──────────────────┐   ┌──────────────────┐
              │   APP SERVER 1   │   │   APP SERVER 2   │
              │  (handles logic) │   │  (handles logic) │
              └────────┬─────────┘   └────────┬─────────┘
                       │                      │
                       └──────────┬───────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────────────────┐
                    │              DATABASE                    │
                    │         (stores all data)               │
                    └─────────────────────────────────────────┘
\`\`\`

This is the most basic system design: a client makes a request, a load balancer routes it to one of several application servers, and the server reads/writes to a database.

Every complex system you will ever design is an evolution of this basic pattern — adding caches, queues, CDNs, microservices, replication, sharding — but the core remains the same.
`,

  codeExamples: [
    {
      title: 'Defining Functional Requirements (Structured Approach)',
      code: `# System: Photo Sharing Application (like Instagram)

## Functional Requirements (What the system DOES)

USERS:
- User can register with email and password
- User can log in / log out
- User can update their profile (name, bio, profile photo)
- User can follow / unfollow other users

PHOTOS:
- User can upload a photo (max 20MB, formats: JPG, PNG, WebP)
- User can add a caption to a photo (max 2200 characters)
- User can delete their own photos
- User can view photos on their feed (photos from people they follow)
- User can view photos on a user's profile

INTERACTIONS:
- User can like / unlike a photo
- User can comment on a photo
- User can delete their own comments
- User can view the like count on a photo

## What is NOT in scope (important to define boundaries)
- Video uploads (future feature)
- Direct messages (future feature)
- Stories (future feature)
- Shopping features (future feature)`,
      explanation:
        'Before designing anything, write out the exact features. Unclear requirements lead to wrong designs. Notice how we also defined what is OUT of scope — this prevents scope creep and keeps the design focused.',
    },
    {
      title: 'Defining Non-Functional Requirements (Quantified)',
      code: `# System: Photo Sharing Application

## Non-Functional Requirements (How well the system does it)

SCALE:
- Daily Active Users (DAU): 10 million
- Monthly Active Users (MAU): 50 million
- Photos uploaded per day: 5 million
- Photos viewed per day: 200 million (reads are ~40x writes)
- Average photo size: 2MB (after compression)

PERFORMANCE:
- Photo upload: complete in < 5 seconds for 95th percentile
- Feed load: display first 10 posts in < 500ms
- Photo view: render in < 300ms for 95th percentile
- Search results: return in < 200ms

AVAILABILITY:
- System uptime: 99.99% (allows ~52 minutes downtime per year)
- Photo uploads must not be lost (durability: 99.9999999% — nine nines)

STORAGE:
- Photos stored permanently (no auto-deletion)
- Estimated storage: 5M photos/day × 2MB = 10TB/day = 3.65 PB/year

SECURITY:
- Passwords hashed with bcrypt (cost factor 12)
- All API traffic over HTTPS (TLS 1.3)
- Photos stored in private S3 buckets (served via CDN with signed URLs)
- Rate limiting: 100 requests per minute per user
- Auth tokens expire after 30 days of inactivity`,
      explanation:
        'Non-functional requirements must be QUANTIFIED. "Fast" is not a requirement. "< 500ms for 95th percentile" is a requirement. These numbers drive every architectural decision. The 40:1 read-to-write ratio tells us we need aggressive caching. The 10TB/day storage tells us we need object storage, not a database.',
    },
    {
      title: 'Identifying Tradeoffs in a Design Decision',
      code: `# Design Decision: Where to store user sessions?

## Option A: Server-Side Sessions (stored in database/Redis)

Architecture:
  Client → sends session_id cookie → Server → looks up session in Redis → gets user data

Advantages:
  ✅ Can invalidate sessions instantly (logout is real-time)
  ✅ Session data stays on server (less data in cookie)
  ✅ Revoke all sessions for a user if account is compromised

Disadvantages:
  ❌ Every request requires a Redis lookup (latency)
  ❌ Redis becomes a dependency (if Redis is down, auth is down)
  ❌ Harder to scale across datacenters (session state is centralized)

## Option B: Stateless JWT Tokens (stored in client)

Architecture:
  Client → sends JWT token → Server → validates signature → reads user data from token

Advantages:
  ✅ No database lookup needed (self-contained)
  ✅ Works across multiple servers without shared state
  ✅ Easy to scale horizontally
  ✅ Can be used across services (microservices friendly)

Disadvantages:
  ❌ Cannot instantly revoke a token (must wait for expiry)
  ❌ Larger payload than a session ID
  ❌ If signing secret is compromised, all tokens are compromised
  ❌ Token cannot be "extended" — must re-issue on expiry

## Decision for our system:
Use JWT with short expiry (15 minutes) + refresh tokens (stored in Redis)
This gives us: stateless performance + ability to revoke refresh tokens
TRADEOFF: More complex logic, but best of both worlds for our scale`,
      explanation:
        'This is what system design thinking looks like. You never just "pick" a solution — you analyze options, understand tradeoffs, and make an informed decision based on your specific requirements. There is no universally correct answer.',
    },
  ],

  commonMistakes: [
    'Jumping to solutions before understanding requirements. Always spend significant time clarifying what you are building before thinking about how.',
    'Treating non-functional requirements as secondary. At scale, HOW WELL the system works is as important as WHAT it does.',
    'Assuming "more complex = better." A simpler system that meets requirements is always preferable to a complex one that is hard to operate.',
    'Ignoring cost. A technically brilliant design that costs 10x more than necessary is a bad design.',
    'Treating availability as binary. A system is not just "up" or "down" — it can degrade gracefully. Design for graceful degradation.',
    'Forgetting security until the end. Security is a design concern, not a feature you add later.',
    'Assuming the happy path. Design for failure: what happens when the database is slow? What if the network drops mid-request?',
    'Conflating latency and throughput. Optimizing for one does not automatically improve the other.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between scalability and availability?',
      answer:
        'Scalability is the ability to handle more load by adding resources — it is about growth capacity. Availability is the percentage of time the system is operational and accessible — it is about uptime and reliability. A system can be highly scalable but poorly available (can handle millions of users when it works, but goes down frequently). A system can be highly available but not very scalable (almost never goes down, but falls over when too many users join). Ideally, you want both: a system that handles growing load AND stays up reliably.',
      difficulty: 'beginner',
      followUp: [
        'How would you improve availability of a system that has a single application server?',
        'What is the relationship between scalability and cost?',
      ],
      tip: 'A common mistake is using these terms interchangeably. In interviews, show you understand the distinction — it signals engineering maturity.',
    },
    {
      question: 'What does "five nines" availability mean and how hard is it to achieve?',
      answer:
        '99.999% availability means the system can only be down for 5.26 minutes per year — about 26 seconds per month. Achieving this requires: no single points of failure at any layer (load balancers, app servers, databases must all be redundant), automated failover that completes in seconds, zero-downtime deployments, extensive monitoring and alerting, geographic redundancy (survive an entire datacenter outage), and rigorous operational practices. Most consumer web applications operate at 99.9% (three nines — ~8.76 hours of downtime per year). Going from three nines to five nines is not a 2% improvement — it requires a completely different operational discipline and is significantly more expensive.',
      difficulty: 'intermediate',
      followUp: [
        'What are the main techniques for achieving high availability?',
        'Is five nines always necessary? When would you accept lower availability?',
      ],
      tip: 'Mention the SLA table with actual downtime numbers. Interviewers are impressed when candidates can speak concretely about availability SLAs.',
    },
    {
      question: 'What is the CAP theorem and why is it a fundamental constraint in distributed systems?',
      answer:
        'The CAP theorem states that in a distributed system, you can only guarantee two of the following three properties simultaneously: Consistency (every read receives the most recent write or an error), Availability (every request receives a response, though it may not be the most recent), and Partition Tolerance (the system continues operating even when network partitions occur between nodes). Since network partitions are a reality in distributed systems (networks fail), you must always have Partition Tolerance. This means you must choose between Consistency and Availability when a partition occurs. SQL databases typically choose CP (consistent but may be unavailable during partitions). Cassandra and DynamoDB choose AP (always available, but may return stale data). Understanding CAP helps you choose the right database and architecture for your consistency requirements.',
      difficulty: 'intermediate',
      followUp: [
        'Can you give an example of when you would accept eventual consistency over strong consistency?',
        'How does the PACELC theorem extend CAP?',
      ],
      tip: 'Do not just recite the theorem — explain WHY partition tolerance is non-negotiable in practice, which forces the CP vs AP choice.',
    },
    {
      question: 'What is the difference between latency and throughput? Can you optimize both simultaneously?',
      answer:
        'Latency is the time it takes to complete one operation (e.g., a single database query takes 5ms). Throughput is the number of operations the system can complete per unit of time (e.g., the database handles 50,000 queries per second). They are related but not the same. You can sometimes improve both: adding more servers increases throughput (more parallel processing) and may reduce latency (less queuing). But tradeoffs exist: adding more complex caching can reduce latency for cache hits but adds overhead for cache misses. Batching operations improves throughput (process 1000 items at once) but increases latency for individual items (must wait for the batch). In practice, most systems optimize for the constraint that matters most for their use case — user-facing APIs prioritize low latency; data pipelines prioritize high throughput.',
      difficulty: 'beginner',
      followUp: [
        'How does a cache improve latency? How does it affect throughput?',
        'What is a common technique to achieve high throughput for write-heavy systems?',
      ],
    },
    {
      question: 'Why should security be considered in system design rather than added later?',
      answer:
        'Security added as an afterthought is almost always insufficient and expensive to retrofit. Design-level security decisions include: the authentication model (session vs. JWT vs. OAuth — choosing wrong means re-architecting auth for millions of users later), encryption at rest (databases encrypted by default from day one, vs. a complex migration later), network architecture (private subnets for databases, DMZ for public-facing services — these are infrastructure decisions, not code changes), rate limiting and throttling (must be designed into the API gateway layer, not bolted onto individual services), and audit logging (you must design what events to log and where to store them before the system handles real user data — retroactive logging misses events). The Equifax breach (2017, $700M+ in damages) resulted from failing to patch a known vulnerability for months. Security is cheaper to design in than to fix after a breach.',
      difficulty: 'intermediate',
      followUp: [
        'What is the principle of least privilege and how does it apply to system design?',
        'How would you design a system to be secure by default?',
      ],
      tip: 'Interviewers want to see that you think about security proactively, not reactively. Mentioning specific security design patterns (zero-trust, defense in depth) shows depth.',
    },
    {
      question: 'How do you approach a system design problem when you do not know where to start?',
      answer:
        'Start with requirements, not solutions. First, clarify functional requirements (what the system must do) and non-functional requirements (scale, availability, latency). Then estimate the scale: how many users, QPS, storage needs. This immediately constrains your design — a system for 1000 users looks very different from one for 100 million. Next, define the data model — what entities exist and how they relate. Then sketch a high-level architecture starting simple (single server, single DB) and identify where it breaks down at your estimated scale. Add components (load balancer, cache, message queue, CDN) only when justified by a specific requirement or bottleneck. Finally, identify and discuss tradeoffs. The key insight is: requirements and scale drive architecture. You should never choose a technology and then justify it — you should identify the problem and then choose the right tool.',
      difficulty: 'beginner',
      followUp: ['Walk me through your process for estimating capacity.'],
      tip: 'This is often the first question in an interview. Having a clear, structured answer shows you have a process, not just random knowledge.',
    },
  ],

  exercises: [
    {
      id: 'intro-exercise-1',
      title: 'Write Requirements for a URL Shortener (like bit.ly)',
      description: `A URL shortener takes a long URL (e.g., https://www.example.com/very/long/path?with=params) and returns a short URL (e.g., https://short.ly/abc123). When someone visits the short URL, they are redirected to the original long URL.

Your task:
1. Write at least 6 functional requirements for this system
2. Write at least 6 non-functional requirements with specific numbers (not vague terms like "fast")
3. Identify 3 things that are explicitly OUT of scope

Think about: Who uses this? What do they need to do? How many people will use it? How fast must it be? What happens if it goes down?`,
      starterCode: `# URL Shortener Requirements

## Functional Requirements
# What the system DOES (features):
1.
2.
3.
4.
5.
6.

## Non-Functional Requirements
# How well the system does it (with specific numbers):
1.
2.
3.
4.
5.
6.

## Out of Scope
# Things we explicitly are NOT building:
1.
2.
3. `,
      solution: `# URL Shortener Requirements

## Functional Requirements
1. User can submit a long URL and receive a unique short URL
2. Anyone with the short URL can be redirected to the original long URL
3. Short URLs should be random (not guessable) by default
4. Optionally, users can specify a custom alias for their short URL (e.g., short.ly/my-product)
5. Registered users can view analytics: total clicks, clicks per day, referrer breakdown
6. Users can set an expiry date on their short URLs (after which the link returns a 404)
7. Users can delete their short URLs
8. System returns an error if a custom alias is already taken

## Non-Functional Requirements
1. Redirect latency: < 50ms at the 99th percentile (redirects must be near-instant)
2. URL creation latency: < 500ms at the 95th percentile
3. Availability: 99.99% (users must always be able to use their short URLs)
4. Scale: 100 million URLs created per day, 10 billion redirects per day
5. Short URL length: 7 characters (supports 62^7 = ~3.5 trillion unique URLs)
6. Durability: Once a short URL is created, it must never be lost (99.9999999% durability)
7. Throughput: Handle 115,000 redirect requests per second (10B / 86,400 seconds)
8. Storage: 100M URLs/day × 365 days × 500 bytes/URL ≈ 18TB per year

## Out of Scope
1. User authentication / registration (all features work anonymously for now)
2. Team/organization features (sharing URL groups with colleagues)
3. QR code generation for short URLs`,
      hints: [
        'Think about both the person creating the short URL AND the person clicking on it — they have different needs',
        'Non-functional requirements need numbers. Instead of "the system must be fast," write "the redirect must complete in < 50ms"',
        'Calculate the scale: if 100M URLs per day are created and each is clicked 100 times, how many redirects per second is that?',
        'Consider what happens to short URLs after they are created: can they be deleted? Do they expire? Can they be edited?',
      ],
    },
    {
      id: 'intro-exercise-2',
      title: 'Identify Tradeoffs in Database Choice',
      description: `You are designing a social media platform. Your team is debating between using a relational database (PostgreSQL) and a document database (MongoDB) for storing user posts.

A post has: author, content (text), timestamp, list of tags, list of media URLs, and a count of likes and comments.

Analyze both options:
1. List 3 advantages of PostgreSQL for this use case
2. List 3 advantages of MongoDB for this use case
3. What would be the deciding factor for you? Justify your answer.
4. What if the requirement changed and posts needed to support arbitrary nested structures (like Twitter Cards with rich embeds)? Does your answer change?

There is no single right answer. The goal is demonstrating you understand tradeoffs.`,
      starterCode: `# Database Choice Analysis: Social Media Posts

## PostgreSQL (Relational) Advantages for this use case:
1.
2.
3.

## MongoDB (Document) Advantages for this use case:
1.
2.
3.

## My Decision and Justification:
# What factors matter most for this specific use case?


## If posts need arbitrary nested structures:
# Does your answer change? Why?
`,
      solution: `# Database Choice Analysis: Social Media Posts

## PostgreSQL (Relational) Advantages for this use case:
1. ACID transactions ensure like/comment counts are always accurate (no race conditions)
2. Rich query capabilities: easily find "all posts by users I follow, sorted by time, with like count > 100"
3. Foreign key constraints enforce data integrity (can't have a post by a non-existent user)
4. Mature ecosystem for analytics (SQL is universal — any data tool understands it)

## MongoDB (Document) Advantages for this use case:
1. A post and its metadata (tags, media URLs) stored as one document — no JOINs needed for reads
2. Schema flexibility — can add new fields to new posts without migrating existing data
3. Horizontal sharding is simpler — shard by user_id to scale writes independently
4. Array fields (tags, media_urls) are first-class citizens — no need for separate junction tables

## My Decision and Justification:
For this use case, I would choose PostgreSQL because:
- Posts have a well-defined, stable schema (the fields won't change dramatically)
- Accuracy of like/comment counts is important — ACID transactions prevent double-counting
- We will want complex queries: trending posts, posts by followed users, posts by tag
- The relational structure (users, posts, likes, comments) maps naturally to SQL tables

The JSON column type in PostgreSQL also handles flexible fields if needed.

## If posts need arbitrary nested structures:
Yes, my answer changes toward MongoDB. If posts can contain arbitrary embedded rich content
(Twitter Cards, link previews, polls, quizzes — each with different shapes),
the rigid schema of SQL becomes a liability. You'd end up with many nullable columns
or an EAV anti-pattern. MongoDB's document model handles heterogeneous shapes naturally.

HOWEVER: you could also use PostgreSQL with a JSONB column for the flexible parts and
structured columns for the fixed parts. This hybrid approach is often the best of both worlds.`,
      hints: [
        'Think about the read patterns: what queries will be most common? Single post lookups? Feed queries? Search?',
        'Think about the write patterns: how often do likes/comments update? Do you need atomic updates?',
        'Consider the schema stability: will post structure change frequently, or is it well-defined?',
        'Remember: this is not about which database is "better" — it is about which tradeoffs fit your specific requirements',
      ],
    },
  ],

  keyTakeaways: [
    'System design is the engineering discipline of building software that works correctly and efficiently at scale — it goes far beyond writing working code.',
    'Always start with requirements: functional (what the system does) and non-functional (how well it does it). Architecture follows requirements, never the reverse.',
    'Scalability (handling growth) and availability (staying operational) are distinct properties that both require deliberate design.',
    'The five nines of availability (99.999%) means only 5.26 minutes of downtime per year — each additional nine requires significantly more engineering investment.',
    'Latency (how fast one operation completes) and throughput (how many operations per second) are different metrics that require different optimization strategies.',
    'Security must be designed into a system from the beginning. Retrofitting security onto an existing system is expensive, error-prone, and often inadequate.',
    'Cost is an engineering constraint. A technically excellent design that is 10x more expensive than necessary is a failed design.',
    'Every design decision in system design involves a tradeoff. There are no perfect solutions — only solutions that make the right tradeoffs for the specific problem.',
    'The CAP theorem reveals a fundamental constraint: in a distributed system during a network partition, you must choose between consistency and availability.',
    'Start simple. The simplest architecture that meets your requirements is usually the right architecture. Add complexity only when justified by a specific problem.',
  ],
};
