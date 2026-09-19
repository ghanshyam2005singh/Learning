import type { Lesson } from '@/types';

export const monolithLesson: Lesson = {
  id: 'monolith-architecture',
  slug: 'monolith-architecture',
  title: 'Monolith Architecture',
  description:
    'Understand what a monolith actually is, why it is not inherently bad, when it is the right choice, how to scale it, and the signals that tell you it is time to break it apart.',
  category: 'Architecture',
  order: 4,
  difficulty: 'intermediate',
  estimatedTime: 35,
  prevLesson: 'architecture-fundamentals',
  nextLesson: 'microservices-architecture',

  content: `# Monolith Architecture

## The Monolith Has Been Unfairly Maligned

Before anything else, let's establish the truth that most tutorials skip:

**A monolith is not a bad architecture. It is a perfectly valid architectural choice that has powered some of the most successful software products in history.**

Amazon started as a monolith. Netflix was a monolith for years before migrating to microservices. Shopify — the platform that processed over $75 billion in sales in 2022 — is still largely a monolith. Stack Overflow, one of the most-visited websites in the world, serves millions of daily requests from a handful of servers using a monolithic architecture.

The narrative that "monolith = legacy = bad" is a misunderstanding. A poorly designed monolith is bad. A well-designed monolith is excellent — especially for teams and products that are not yet at the scale where its limitations become real bottlenecks.

Understanding monolith architecture deeply — including its strengths, its weaknesses, when it applies, and when it stops being the right choice — is fundamental to system design.

---

## What Is a Monolith?

A monolith is a software system where **all components of the application are deployed as a single unit**.

Let's be precise about what "single unit" means:

- **Single deployable artifact**: One JAR file, one Docker image, one binary, one Ruby on Rails application. You deploy one thing, and the entire application starts.
- **Single process**: All code runs within the same operating system process (or tightly coupled set of processes). There is no network call between the User Service and the Order Service — they are both in the same process, calling each other as function calls.
- **Shared memory**: Components communicate through in-process function calls and shared data structures. No serialization, no network, no latency.
- **Shared database**: All components read from and write to the same database. The user module, the order module, and the product module all use the same database connection and often the same tables.

This is not a criticism — it is a description. These properties have significant advantages.

---

## How a Monolith Works Internally

\`\`\`
                    ┌──────────────────────────────────────────────────────┐
                    │                  SINGLE DEPLOYMENT UNIT              │
                    │                                                      │
HTTP Request ──────►│  ┌─────────────┐   ┌─────────────┐                  │
                    │  │    USER     │   │    ORDER    │                  │
HTTP Response ◄─────│  │   MODULE   │──►│   MODULE   │                  │
                    │  └──────┬──────┘   └──────┬──────┘                  │
                    │         │                  │                         │
                    │         ▼                  ▼                         │
                    │  ┌─────────────┐   ┌─────────────┐                  │
                    │  │  PRODUCT   │   │  PAYMENT   │                  │
                    │  │   MODULE   │   │   MODULE   │                  │
                    │  └──────┬──────┘   └──────┬──────┘                  │
                    │         │                  │                         │
                    │         │  (function calls, shared memory)           │
                    │         ▼                  ▼                         │
                    │  ┌─────────────────────────────────────────────┐    │
                    │  │            SHARED CODEBASE                   │    │
                    │  │  (utilities, logging, config, domain models) │    │
                    │  └─────────────────────────────────────────────┘    │
                    │                         │                           │
                    └─────────────────────────┼───────────────────────────┘
                                              │
                                              ▼
                    ┌──────────────────────────────────────────────────────┐
                    │                SINGLE DATABASE                        │
                    │     (all modules read/write to the same DB)          │
                    │                                                      │
                    │   users table  │  orders table  │  products table    │
                    └──────────────────────────────────────────────────────┘
\`\`\`

When the User Module needs to create an order, it calls an in-process function: \`orderService.createOrder(userId, items)\`. This is a direct function call — it takes microseconds. There is no HTTP call, no JSON serialization, no network latency, no timeout to handle.

When the Order Module needs to check product inventory, it queries the same database the Product Module uses — often a direct SQL JOIN across tables. This is trivial in a monolith and requires careful design coordination in microservices.

---

## Advantages of Monolithic Architecture

### 1. Simplicity of Development

In a monolith, a feature that touches users, orders, and products is a single pull request. You write the code, run the tests locally, and deploy one artifact. There is no need to coordinate changes across multiple repositories, negotiate API contracts with other teams, or handle versioning of shared interfaces.

Junior developers can be productive immediately. The entire codebase is in one place, following one set of patterns, with one test runner and one deployment pipeline.

### 2. No Network Overhead Between Components

In a microservices architecture, a request that requires three services to collaborate involves three network calls, three serialization/deserialization cycles, and three potential points of network failure. Each call adds 1-50ms of latency.

In a monolith, the equivalent is three function calls. In-process function calls take nanoseconds, not milliseconds. No serialization, no network stack, no timeout handling.

This is not a small advantage. The difference between 3ms (in-process) and 150ms (three network calls) is significant for user-facing features.

### 3. Easy Debugging and Tracing

When a bug occurs in a monolith, the stack trace shows you exactly where the error originated — across all modules — in a single trace. You can set a breakpoint and step through code across module boundaries.

In a distributed microservices system, a single user request might touch 10 services. When it fails, the error manifests in service 7 but may have originated from a bad state set up by service 3. Tracing this requires distributed tracing infrastructure (Jaeger, Zipkin), correlation IDs propagated through every call, and significant operational investment.

### 4. Transactional Integrity

In a monolith with a shared database, you can wrap multiple operations in a single database transaction:

\`\`\`
BEGIN;
  INSERT INTO orders ...;
  UPDATE inventory SET stock = stock - quantity WHERE ...;
  INSERT INTO payments ...;
COMMIT;  -- all or nothing
\`\`\`

If anything fails, the entire transaction rolls back. Zero partial states. No complex saga patterns needed.

In microservices, each service has its own database. True ACID transactions across services are impossible. You must implement the Saga pattern (compensating transactions) to achieve similar guarantees — which is significantly more complex to implement, test, and reason about.

### 5. Operational Simplicity

One deployment pipeline. One monitoring dashboard. One set of logs. One place to look when something goes wrong.

Microservices require: separate CI/CD pipelines per service, a service mesh or API gateway, distributed logging aggregation, distributed tracing, and service discovery infrastructure. None of this comes for free.

### 6. Cost-Effectiveness at Small Scale

Infrastructure for a monolith: a few application servers and one database. Infrastructure for microservices: hundreds of containers, a Kubernetes cluster, a service mesh, a message broker, a distributed tracing system, and a team to manage it all.

For a startup with 10,000 users, microservices infrastructure is not only unnecessary — it is a significant financial and operational burden that slows down the business.

---

## Disadvantages of Monolithic Architecture

### 1. Scaling Is All-or-Nothing

You cannot scale just the checkout service when it is the bottleneck. You must scale the entire monolith — including the user registration module that is barely used. This wastes resources.

\`\`\`
MONOLITH SCALING:
  Checkout is the bottleneck → must scale entire monolith
  2× servers = 2× cost for ALL modules, even low-traffic ones

MICROSERVICES SCALING:
  Checkout is the bottleneck → scale only the Checkout Service
  2× checkout servers = targeted cost, no waste
\`\`\`

At small scale, this inefficiency is acceptable. At large scale (where checkout handles 100,000 requests/sec but user registration handles 100/sec), it becomes prohibitively wasteful.

### 2. Deployment Risk and Blast Radius

In a monolith, every deployment touches the entire application. A bug in any module — even an obscure admin feature — requires redeploying the entire application. The blast radius of any change is the entire system.

At small scale with good tests, this is manageable. At large scale with 100 engineers deploying 50 times per day, this creates deployment bottlenecks and high-risk deployments.

### 3. Technology Lock-in

Every module in a monolith must use the same language, framework, and runtime. If you discover that a specific computation-heavy module would benefit enormously from being written in Go instead of Node.js, you cannot do that in a monolith.

### 4. Development Bottlenecks at Team Scale

When 5 engineers work on a monolith, they can coordinate easily. When 50 engineers work on a monolith, merge conflicts are constant, deployment queues back up because everyone's changes must be released together, and a test suite that takes 30 minutes means 50 engineers are all waiting.

### 5. Technical Debt Accumulation Risk

Without strict enforcement of module boundaries, a monolith tends toward entanglement over time. The User Module starts importing from the Order Module. The Order Module starts importing from the Payment Module. The Payment Module imports from Users. What began as separate modules becomes a tangle where everything depends on everything — the "Big Ball of Mud."

This is not inevitable (a well-governed Modular Monolith prevents it), but it is the path of least resistance without deliberate architectural discipline.

---

## When to Use a Monolith

Use a monolith when:

**1. You are building an MVP or early-stage product.**
The product requirements will change rapidly. Microservices have high coordination overhead that slows iteration. A monolith lets you change the entire system quickly.

**2. Your team is small (< 15 engineers).**
The operational and coordination overhead of microservices is not justified by the benefits at small team size. A monolith is the default for small teams.

**3. The domain is not yet well-understood.**
Service boundaries in microservices should reflect stable domain boundaries. If you don't yet understand your domain well (common in new products), you will draw service boundaries wrong, resulting in expensive refactoring. A monolith lets you discover the right boundaries over time.

**4. All components need to scale together.**
If your entire system needs to scale proportionally (all components have similar traffic patterns), the "scale entire monolith" characteristic is not a disadvantage.

**5. You need simple, reliable transactions.**
If your application heavily relies on multi-table transactions, a monolith with a shared database provides this trivially.

---

## When NOT to Use a Monolith

Stop using a monolith (and consider breaking it up) when:

**1. Different components have radically different scaling needs.**
If your real-time processing component needs 100 servers and your admin dashboard needs 1, running them in the same monolith wastes 99 servers for admin.

**2. Team size makes monolith deployment a bottleneck.**
When every deployment requires all 80 engineers to coordinate, the deployment becomes a liability event rather than a routine operation.

**3. Different components need different technology stacks.**
If you need Python for ML model serving alongside Node.js for the API, a monolith forces a compromise.

**4. You need to deploy different components independently.**
If the pricing algorithm must be updated 10 times per day and the checkout page must be stable, coupling their deployments together is a real operational risk.

**5. Security or compliance requires isolation.**
PCI-DSS compliance for payment processing often requires the payment code to run in an isolated environment with strict access controls, separate from the rest of the application.

---

## Scaling a Monolith

Before breaking a monolith into microservices, try these scaling techniques:

### Vertical Scaling
Add more CPU and RAM to the server. Simple, requires no code changes. Has limits, but those limits are further away than most people think. A server with 96 cores and 384GB RAM can handle enormous load.

### Horizontal Scaling with a Load Balancer
Run multiple copies of the monolith behind a load balancer.

\`\`\`
                 ┌─────────────────────┐
                 │    LOAD BALANCER    │
                 └──┬─────────────┬───┘
                    │             │
         ┌──────────▼──┐    ┌─────▼────────┐
         │  Monolith   │    │  Monolith    │
         │  Instance 1 │    │  Instance 2  │
         └──────────┬──┘    └──────┬───────┘
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Database   │
                    │  (shared)    │
                    └──────────────┘
\`\`\`

This requires the monolith to be stateless (no session stored in memory — use Redis for sessions) so any instance can handle any request. This is a best practice regardless of monolith vs microservices.

### Read Replicas
Add read-only database replicas for read-heavy operations. Direct all write operations to the primary, all reads to replicas. This is a standard technique that dramatically increases database capacity without architectural changes.

### Caching
Add a caching layer (Redis, Memcached) to reduce database reads. A cache hit costs microseconds and zero database load. A well-designed cache can absorb 80-90% of read traffic.

### CDN for Static Assets
Move static assets (images, CSS, JavaScript) to a CDN. Reduces load on the monolith servers significantly.

With these techniques, a well-designed monolith can often handle 10-50x more load than a naive deployment — before you need to consider architectural changes.

---

## The Modular Monolith: The Smart Middle Ground

The Modular Monolith is the most underrated architectural pattern in software engineering.

A Modular Monolith is a single deployable unit (monolith) where the code is organized into **strongly bounded modules** with explicit, well-enforced interfaces between them.

\`\`\`
┌───────────────────────────────────────────────────────────────────┐
│                     MODULAR MONOLITH                               │
│                                                                   │
│  ┌────────────────────┐    ┌────────────────────┐                 │
│  │   USER MODULE      │    │   ORDER MODULE     │                 │
│  │                    │    │                    │                 │
│  │ - UserService      │    │ - OrderService     │                 │
│  │ - UserRepository   │    │ - OrderRepository  │                 │
│  │ - UserDomain       │    │ - OrderDomain      │                 │
│  │                    │    │                    │                 │
│  │  PUBLIC API:       │    │  PUBLIC API:       │                 │
│  │  getUserById()     │◄───│  (calls User API)  │                 │
│  │  validateUser()    │    │                    │                 │
│  └────────────────────┘    └────────────────────┘                 │
│           ▲                          ▲                            │
│           │  ENFORCED BOUNDARY:      │                            │
│           │  Module A may NOT        │                            │
│           │  import internals of     │                            │
│           │  Module B. Only public   │                            │
│           │  interfaces allowed.     │                            │
│                                                                   │
│  SINGLE DEPLOYMENT → one JAR/container/binary                     │
│  SEPARATE DB SCHEMAS → users schema, orders schema (same DB)      │
└───────────────────────────────────────────────────────────────────┘
\`\`\`

**Why this matters:**
1. **Maintains monolith benefits**: one deployment, in-process function calls, shared database, simple operations.
2. **Prepares for microservices if needed**: because module boundaries are already clean and enforced, extracting a module into its own service later requires less refactoring.
3. **Prevents the Big Ball of Mud**: enforced boundaries mean modules cannot accidentally become entangled.

**How to enforce boundaries:**
- In Java: Java modules (JPMS) or package-private access
- In Node.js: barrel files that export only the public API; linting rules (e.g., eslint-plugin-boundaries) that forbid cross-module internal imports
- In Python: explicit \`__all__\` in \`__init__.py\` plus architectural tests (pytest with import boundary checks)
- In any language: architectural fitness functions (tests that verify no boundary violations exist)

Shopify is the most famous example: a Modular Monolith (Rails application) that has scaled to tens of thousands of merchants and billions in transactions. Their explicit investment in modularity within the monolith has allowed them to scale without the operational overhead of microservices.

---

## Monolith vs Modular Monolith

| Aspect | Traditional Monolith | Modular Monolith |
|---|---|---|
| Code organization | Typically by layer (controllers/, services/, models/) | By bounded domain module (user/, order/, payment/) |
| Module boundaries | Not enforced — any file can import any other | Explicitly enforced via tools, tests, or language features |
| Internal coupling | Tends to grow (Big Ball of Mud risk) | Contained by boundary enforcement |
| Deployment | Same — single artifact | Same — single artifact |
| Migration to microservices | Difficult — entangled code | Easier — boundaries already exist |
| Team ownership | Any team touches any code | Each module can have a clear owning team |
| Operational complexity | Low | Low (same as regular monolith) |

---

## Real-World Examples: Monoliths at Scale

**Amazon (2001-2006):** Amazon's original website was a monolith running on C++, later moved to Java monolith. It was this monolith that powered Amazon's growth from a small bookstore to a large retailer. The shift to services happened later, driven by specific scaling and team-size needs — not because the monolith was "bad."

**Shopify:** Shopify's core platform is a Rails monolith. They have invested heavily in making it a Modular Monolith with clear boundaries. At over $6 billion in annual revenue and processing trillions in merchant transactions, Shopify has demonstrated that a well-engineered monolith can scale far beyond what most companies ever need.

**Stack Overflow:** Stack Overflow serves 1.5 billion page views per month from 9 web servers. Not 9,000. Not 900. Nine. This is possible through aggressive caching, database optimization, and a well-tuned monolith on powerful servers. It is a testament to what operational excellence and smart engineering can achieve without distributed systems complexity.

**GitHub (2008-2016):** GitHub ran as a Ruby on Rails monolith for its first 8 years — through its growth from startup to 14 million users and acquisition by Microsoft for $7.5 billion. They began breaking it apart only when specific scaling needs made it necessary.

---

## Signs You Should Break the Monolith

These are signals, not mandates. Each one is a reason to evaluate — not a trigger to immediately rewrite.

**1. Deployment is a bottleneck.** Deployments take hours, require multiple team approvals, and happen rarely because the risk is high. Feature development is blocked waiting for deployment windows.

**2. A specific component needs 10x more resources than others.** If your video processing pipeline needs 50 servers and your user registration needs 1, running them in the same monolith wastes 49 servers.

**3. Teams are constantly blocked by each other.** Two teams changing the same files every day creates merge conflicts, broken builds, and coordination overhead that slows everyone down.

**4. The test suite takes so long that engineers avoid running it.** A 45-minute test suite means engineers run tests infrequently, bugs reach production, and CI is a bottleneck.

**5. One component needs a different technology that provides significant benefit.** Running ML inference in Python when the rest of the app is Java/Go is a legitimate reason to extract a service.

**6. Compliance requires isolation.** PCI-DSS, HIPAA, or other regulatory requirements may mandate that certain components (payment processing, medical records) run in isolated environments.

---

## The Common Mistake: "Monolith = Technical Debt"

The most damaging misconception in the industry is that having a monolith is inherently a sign of technical debt or poor engineering. This leads to premature migration to microservices — often called "microservices-first" — which is one of the most expensive architectural mistakes a team can make.

Microservices-first means: you start building a new product with microservices from day one, before you have users, before you understand your domain, before you have a team large enough to operate the infrastructure.

The result is always the same: the team spends months building infrastructure (service mesh, container orchestration, distributed tracing, CI/CD for 20 services) instead of building product. The added complexity means bugs that would take 1 hour to debug in a monolith take 2 days in a distributed system. Feature velocity plummets.

Martin Fowler (one of the most respected software engineers in the world) said: "Don't start a new project with microservices, even if you're sure your application will be big enough to make it worthwhile."

The right progression for most systems: **Monolith → Modular Monolith → Extract services where there is a specific, measurable reason to do so.**
`,

  codeExamples: [
    {
      title: 'Monolith Internal Structure: The Right Way and the Wrong Way',
      code: `// ============================================================
// THE WRONG WAY: Unstructured monolith (leads to Big Ball of Mud)
// Everything in one place, no boundaries, anything imports anything
// ============================================================

// src/routes/orderRoutes.ts — mixes HTTP, business logic, and DB
import { db } from '../database';
import { sendEmail } from '../utils/email';
import { stripe } from '../utils/stripe';

router.post('/orders', async (req, res) => {
  const { userId, items } = req.body;

  // Business logic mixed with HTTP handling (WRONG)
  if (items.length === 0) { return res.status(400).json({ error: 'No items' }); }

  // Direct DB query in route handler (WRONG)
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (user.rows[0].credit_score < 600) {
    return res.status(403).json({ error: 'Credit too low' });
  }

  // Direct Stripe call in route handler (WRONG)
  const charge = await stripe.charges.create({ amount: total, currency: 'usd' });

  // Direct email in route handler (WRONG)
  await sendEmail(user.rows[0].email, 'Order confirmed');

  res.json({ orderId: charge.id });
  // This function does: HTTP, business logic, DB queries, payment, email.
  // Completely untestable without HTTP server, database, Stripe, and email server.
});

// ============================================================
// THE RIGHT WAY: Structured monolith with clear module boundaries
// Same deployment — but organized for maintainability and testability
// ============================================================

// src/modules/order/domain/Order.ts — Pure domain logic, zero dependencies
export class Order {
  static create(data: CreateOrderData): Order {
    if (data.items.length === 0) throw new EmptyOrderError();
    if (data.items.some(i => i.quantity <= 0)) throw new InvalidQuantityError();
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return new Order({ ...data, totalAmount: total, status: 'pending' });
  }
}

// src/modules/order/application/OrderService.ts — Use cases
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private userRepo: UserRepository,     // imports USER MODULE's public interface only
    private payments: PaymentService,     // imports PAYMENT MODULE's public interface only
    private notifications: NotificationService
  ) {}

  async placeOrder(command: PlaceOrderCommand): Promise<PlacedOrder> {
    const user = await this.userRepo.findById(command.userId);
    if (!user) throw new UserNotFoundError(command.userId);
    if (user.isSuspended) throw new SuspendedUserError(command.userId);

    const order = Order.create({ userId: command.userId, items: command.items });

    const payment = await this.payments.charge({
      amount: order.totalAmount,
      methodId: command.paymentMethodId,
    });

    order.markAsPaid(payment.transactionId);
    await this.orderRepo.save(order);
    await this.notifications.sendOrderConfirmation(user.email, order);

    return { orderId: order.id, total: order.totalAmount };
  }
}

// src/modules/order/http/OrderController.ts — HTTP handling ONLY
export class OrderController {
  constructor(private orderService: OrderService) {}

  async placeOrder(req: Request, res: Response): Promise<void> {
    const { userId, items, paymentMethodId } = req.body;
    if (!userId || !items || !paymentMethodId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    try {
      const result = await this.orderService.placeOrder({ userId, items, paymentMethodId });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof UserNotFoundError) res.status(404).json({ error: 'User not found' });
      else if (error instanceof SuspendedUserError) res.status(403).json({ error: 'Account suspended' });
      else if (error instanceof PaymentFailedError) res.status(402).json({ error: error.message });
      else res.status(500).json({ error: 'Order failed' });
    }
  }
}

// src/modules/order/index.ts — PUBLIC INTERFACE OF THE ORDER MODULE
// ONLY these exports are allowed to be imported by other modules.
export { OrderService } from './application/OrderService';
export { OrderController } from './http/OrderController';
export type { PlaceOrderCommand, PlacedOrder } from './types';`,
      explanation:
        'The "right way" monolith has the same deployment characteristics — still a single binary, single deployment, single process. But the internal organization makes it maintainable, testable, and ready to extract into microservices if needed. The key is module boundaries: other modules can only import from the public interface (barrel file), not internal implementation files.',
    },
    {
      title: 'Scaling a Monolith: Stateless Design and Read Replicas',
      code: `// ============================================================
// Making a monolith horizontally scalable requires it to be STATELESS.
// "Stateless" means: no session data stored in application server memory.
// ============================================================

// WRONG: Stateful session storage (breaks horizontal scaling)
class SessionManager_WRONG {
  private sessions: Map<string, Session> = new Map(); // stored in THIS server's RAM

  setSession(token: string, session: Session): void {
    this.sessions.set(token, session);
    // If the user's next request goes to Server 2, Server 2 has NO sessions entry.
    // The user appears "logged out" — catastrophic.
  }
}

// RIGHT: Stateless via Redis session store
import { createClient } from 'redis';

class SessionManager_CORRECT {
  private redis = createClient({ url: process.env.REDIS_URL });

  async setSession(token: string, session: Session): Promise<void> {
    // Store in Redis — accessible from ALL server instances
    await this.redis.setEx(\`session:\${token}\`, 86400, JSON.stringify(session));
  }

  async getSession(token: string): Promise<Session | null> {
    const raw = await this.redis.get(\`session:\${token}\`);
    return raw ? JSON.parse(raw) : null;
    // Works from ANY server instance — Redis is shared source of truth
  }
}

// ── Read Replicas: Scaling database reads ────────────────────────────

class DatabaseManager {
  private primaryDb: Database;     // Handles all WRITES
  private replicaDbs: Database[];  // Handle all READS

  async write(query: string, params: unknown[]): Promise<QueryResult> {
    return this.primaryDb.query(query, params); // writes ALWAYS go to primary
  }

  private replicaIndex = 0;
  async read(query: string, params: unknown[]): Promise<QueryResult> {
    const replica = this.replicaDbs[this.replicaIndex % this.replicaDbs.length];
    this.replicaIndex++;
    return replica.query(query, params); // reads go to replicas (round-robin)
  }
}

// ── Caching Layer: Reducing database load ────────────────────────────

class CachedProductRepository {
  constructor(private repo: ProductRepository, private cache: Redis) {}

  async findById(id: string): Promise<Product | null> {
    // 1. Check cache first
    const cached = await this.cache.get(\`product:\${id}\`);
    if (cached) return JSON.parse(cached); // Cache hit: zero DB load

    // 2. Cache miss: query database
    const product = await this.repo.findById(id);

    // 3. Store in cache (TTL: 5 minutes)
    if (product) await this.cache.setEx(\`product:\${id}\`, 300, JSON.stringify(product));

    return product;
  }

  async save(product: Product): Promise<void> {
    await this.repo.save(product);
    await this.cache.del(\`product:\${product.id}\`); // invalidate on update
  }
}

/* nginx.conf — Load Balancer for horizontal scaling
upstream monolith_servers {
  least_conn;
  server app1.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
  server app2.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
  server app3.internal:3000 weight=1 max_fails=3 fail_timeout=30s;
}
server {
  listen 80;
  location / { proxy_pass http://monolith_servers; }
}
*/`,
      output:
        'With stateless design + horizontal scaling + read replicas + caching: a well-designed monolith can handle 10-100x its baseline load without architectural restructuring.',
      explanation:
        'Scaling a monolith does not mean giving up and choosing microservices. Stateless sessions (Redis), horizontal scaling (nginx), read replicas, and caching are standard techniques that can extend a monolith far beyond what most teams need. The critical prerequisite: stateless design. If sessions are in server memory, horizontal scaling breaks.',
    },
    {
      title: 'Detecting Monolith Extraction Signals with Metrics',
      code: `// These are SIGNALS, not verdicts.
// Each signal is a reason to investigate, not an automatic trigger to rewrite.

// ── SIGNAL 1: Deployment Duration ────────────────────────────────────
/*
Healthy monolith:
  Build: < 5 min | Tests: < 10 min | Deploy: < 5 min | Frequency: multiple/day

Warning signs:
  Build: > 15 min | Tests: > 30 min (engineers avoid running) | Frequency: weekly
  "I changed 10 lines in payment, but must wait 45 min for 300K-line app to build"
  → Deployment unit is too large for the rate of change
*/

// ── SIGNAL 2: Scaling Inefficiency ───────────────────────────────────
interface ComponentMetrics {
  name: string;
  cpuUtilizationPercent: number;
  requestsPerSecond: number;
}

function analyzeScalingWaste(metrics: ComponentMetrics[], totalInstances: number): void {
  metrics.forEach(c => {
    const instancesNeeded = Math.ceil(totalInstances * (c.cpuUtilizationPercent / 100));
    const wastedInstances = totalInstances - instancesNeeded;
    console.log(\`\${c.name}: needs \${instancesNeeded} of \${totalInstances} servers, \${wastedInstances} wasted\`);
  });
}

analyzeScalingWaste([
  { name: 'Video Processing', cpuUtilizationPercent: 95, requestsPerSecond: 500 },
  { name: 'User Auth',        cpuUtilizationPercent: 8,  requestsPerSecond: 10000 },
  { name: 'Admin Dashboard',  cpuUtilizationPercent: 1,  requestsPerSecond: 20 },
], 10);

/* Output:
Video Processing: needs 10 of 10 servers, 0 wasted
User Auth: needs 1 of 10 servers, 9 wasted
Admin Dashboard: needs 1 of 10 servers, 9 wasted
→ Video Processing is the extraction candidate (needs all servers)
→ Admin is wasting 9 expensive GPU-enabled servers
*/

// ── DECISION MATRIX: Extract or not? ────────────────────────────────

type Decision = 'keep_in_monolith' | 'extract_service';

function shouldExtractService(component: {
  deployFrequency: 'same' | 'much_higher' | 'much_lower';
  scalingNeeds: 'proportional' | 'very_different';
  techStack: 'same' | 'different_needed';
  consistencyNeeds: 'strong_transactions' | 'eventual_ok';
}): Decision {
  let score = 0;

  if (component.deployFrequency === 'much_higher') score += 2;
  if (component.scalingNeeds === 'very_different') score += 3;
  if (component.techStack === 'different_needed') score += 2;
  if (component.consistencyNeeds === 'eventual_ok') score += 1;
  if (component.consistencyNeeds === 'strong_transactions') score -= 2; // penalty

  return score >= 4 ? 'extract_service' : 'keep_in_monolith';
}

// Video processing component:
console.log(shouldExtractService({
  deployFrequency: 'same',
  scalingNeeds: 'very_different',    // +3
  techStack: 'different_needed',     // +2 (needs GPU optimized runtime)
  consistencyNeeds: 'eventual_ok',   // +1
})); // score = 6 → 'extract_service'

// Admin dashboard component:
console.log(shouldExtractService({
  deployFrequency: 'much_lower',
  scalingNeeds: 'proportional',
  techStack: 'same',
  consistencyNeeds: 'strong_transactions', // -2
})); // score = -1 → 'keep_in_monolith'`,
      explanation:
        'Extraction decisions should be data-driven, not trend-driven. The decision matrix forces you to evaluate concrete factors (scaling needs, deployment frequency, consistency requirements) rather than making architectural decisions based on what Netflix does. "We might need this" is not a valid score in the matrix.',
    },
  ],

  commonMistakes: [
    'Treating "monolith" as a synonym for "bad architecture" or "technical debt." A well-structured monolith is excellent engineering. A poorly structured anything is technical debt.',
    'Building microservices from day one for a new product. You do not understand your domain boundaries yet, your team is small, and the operational overhead will kill velocity. Start with a monolith.',
    'Letting a monolith become a "Big Ball of Mud" by not enforcing module boundaries. A monolith without internal structure is where the "monolith = bad" stereotype comes from. Invest in a Modular Monolith.',
    'Storing session data in application server memory. This makes the monolith stateful and breaks horizontal scaling. Always use Redis or a database for session storage.',
    'Deciding to break up the monolith based on trends and articles rather than measured pain points. If you cannot point to specific, measured bottlenecks, you are not ready to extract services.',
    'Extracting microservices without first making the module boundaries clean in the monolith. Extracting a tightly coupled module into a service makes the coupling a network problem — much worse than a code problem.',
    'Forgetting that vertical scaling and read replicas can defer microservices migration by months or years. These are cheap techniques that should be exhausted before architectural restructuring.',
    'Confusing "the monolith is hard to deploy" (an operational problem with the deployment pipeline) with "we need microservices." Often the deployment problem is the deployment process, not the architecture.',
  ],

  interviewQuestions: [
    {
      question: 'What is a monolithic architecture and what are its main advantages?',
      answer:
        'A monolithic architecture is a system where all components — user management, order processing, payments, notifications — are packaged and deployed as a single unit. Everything runs in the same process, communicates through in-process function calls (not network calls), and typically shares a single database. Main advantages: (1) Simplicity — no distributed systems complexity, no service mesh, no distributed tracing needed; (2) No network overhead — in-process function calls take nanoseconds, not milliseconds; (3) ACID transactions across all components using a single database transaction; (4) Easy debugging — a single stack trace shows the full request path; (5) Low operational overhead — one deployment pipeline, one log stream, one monitoring dashboard; (6) Cost-effective at small scale — no Kubernetes, no service registry, no message broker. The key insight: these advantages are real and significant, not just excuses for "not being mature enough for microservices."',
      difficulty: 'beginner',
      followUp: [
        'Name a large, successful product that uses a monolithic architecture.',
        'At what scale do the advantages of a monolith start to become disadvantages?',
      ],
      tip: 'Mentioning Stack Overflow (millions of daily users, 9 web servers) or Shopify (billions in transactions, largely monolith) immediately shows you have read real engineering case studies, not just textbook definitions.',
    },
    {
      question: 'What is a Modular Monolith and why is it considered a smart middle ground?',
      answer:
        'A Modular Monolith is a single-deployment application where the code is organized into strongly bounded modules with explicit, enforced interfaces between them. Each module owns its domain (User module owns everything related to users, Order module owns orders), exposes a public API (barrel file or explicit interface), and other modules can only use that public API — not internal implementation files. It retains all monolith advantages: single deployment, in-process calls, shared database, simple operations. But it prevents the Big Ball of Mud by making boundaries explicit and enforced. It is "smart middle ground" for two reasons: First, it solves the maintainability problems of an unstructured monolith without adding microservices complexity. Second, if you later decide to extract a module into a microservice, the boundary is already clean — the extraction is primarily a deployment change, not a refactoring effort. Shopify is the canonical real-world example.',
      difficulty: 'intermediate',
      followUp: ['How do you technically enforce module boundaries in a codebase?', 'What is an architectural fitness function?'],
    },
    {
      question: 'When should you break a monolith into microservices?',
      answer:
        'When there are specific, measured, concrete problems that microservices would solve — not when you read an article about Netflix. The signals: (1) Deployment is a bottleneck — deployments are rare, slow, and feared because every change touches everything; (2) Radically different scaling needs — one component needs 100 servers and another needs 1, but you must scale both together; (3) Team autonomy is blocked — multiple large teams constantly conflict on the same codebase; (4) Technology requirements — a specific component genuinely benefits from a different technology stack; (5) Compliance isolation — regulatory requirements mandate separate deployment environments. The anti-pattern is doing this preemptively: "we might need this later" is not a justification. Microservices add real operational complexity — distributed tracing, service mesh, eventual consistency, distributed transactions. That cost must be justified by a specific, measurable benefit.',
      difficulty: 'intermediate',
      followUp: [
        'What steps would you take to prepare a monolith for extraction before creating your first microservice?',
        'What is the Strangler Fig pattern and how does it apply to monolith migration?',
      ],
    },
    {
      question: 'How would you scale a monolith to handle 10x more traffic without breaking it apart?',
      answer:
        'In order of increasing effort: (1) Vertical scaling — upgrade server hardware (more CPU, RAM); simple, immediate, effective up to a point. (2) Stateless refactoring — if the monolith stores sessions in memory, move to Redis; this is required for horizontal scaling. (3) Horizontal scaling — run multiple copies of the monolith behind a load balancer; can multiply capacity linearly. (4) Read replicas — add read-only database replicas; direct SELECT queries to replicas, writes to primary; dramatically increases database read capacity. (5) Caching — add Redis for expensive or frequently-accessed data; a 90% cache hit rate means the database handles 10% of the original load. (6) CDN — move static assets to a CDN; removes significant load from application servers. (7) Query optimization — ensure all frequent queries have proper indexes; a missing index on a high-traffic query can cause 100-1000x slower queries. These techniques combined can extend a monolith by 10-100x before architectural restructuring becomes necessary.',
      difficulty: 'intermediate',
      followUp: ['What is the difference between vertical and horizontal scaling in terms of cost and risk?'],
    },
    {
      question: 'What is the "Big Ball of Mud" anti-pattern and how does it relate to monolithic architecture?',
      answer:
        'The Big Ball of Mud is an architecture where the codebase has no meaningful structure — modules depend on each other in arbitrary directions, any file can import any other file, responsibilities are not clearly separated, and changing one thing unpredictably breaks others. It is commonly associated with monoliths because monoliths provide no technical enforcement of boundaries — any module CAN import from any other module, so over time (without discipline), everything does. But the Big Ball of Mud is NOT caused by the monolith architecture — it is caused by the absence of architectural governance. A microservices architecture without clear domain boundaries is also a Big Ball of Mud — it just has the added burden of network calls between its entangled services. The solution is not switching to microservices — it is adopting a Modular Monolith with enforced boundaries, and using architectural fitness functions to prevent boundary violations from being introduced.',
      difficulty: 'intermediate',
      tip: 'Interviewers want to see you understand the root cause (lack of discipline, not the architecture choice) rather than assuming microservices fixes this problem.',
    },
  ],

  exercises: [
    {
      id: 'monolith-exercise-1',
      title: 'Design a Modular Monolith for an E-Commerce Platform',
      description: `You are designing the initial architecture for a new e-commerce platform (similar to Etsy). The team is 8 engineers and the expected initial scale is 10,000 users.

You have decided a Modular Monolith is the right choice.

Tasks:
1. Identify the core domain modules (at least 5). For each module, specify:
   - Module name
   - What it is responsible for
   - What it is NOT responsible for (important!)
   - Its public API (list 3-5 key methods/operations)

2. Draw the dependency relationships between modules (which modules call which, via public interfaces only)

3. Identify one potential boundary violation risk and explain how to prevent it

4. At what specific scale or team size would you reconsider this architecture and consider extracting a service?`,
      starterCode: `# Modular Monolith Design: E-Commerce Platform

## Core Domain Modules

### Module 1: ???
Responsibility:
NOT responsible for:
Public API (key operations):
  - operation1()
  - operation2()
  - operation3()

### Module 2: ???
Responsibility:
NOT responsible for:
Public API:

### Module 3: ???
Responsibility:
NOT responsible for:
Public API:

### Module 4: ???
Responsibility:
NOT responsible for:
Public API:

### Module 5: ???
Responsibility:
NOT responsible for:
Public API:

## Module Dependencies (who calls whom)
Module A → calls → Module B (via public interface only)


## Boundary Violation Risk
Risk:
Prevention:

## When to Reconsider
Specific trigger to consider extracting a service:`,
      solution: `# Modular Monolith Design: E-Commerce Platform

## Core Domain Modules

### Module 1: Identity
Responsibility:
  User registration, login, password management, session management,
  profile data (name, address, preferences), account suspension.

NOT responsible for:
  Order history (Order module), payment methods on file (Payment module).

Public API:
  - registerUser(email, password, name): User
  - authenticateUser(email, password): AuthToken
  - getUserById(userId): User | null
  - suspendUser(userId, reason): void
  - isUserAllowedToPost(userId): boolean

### Module 2: Catalog
Responsibility:
  Product listings, categories/tags, inventory levels,
  product variants, search indexing coordination.

NOT responsible for:
  Who sells the product (Seller module), order-level reservations (Order module).

Public API:
  - getProductById(productId): Product | null
  - searchProducts(query, filters): Product[]
  - decrementInventory(productId, quantity): InventoryResult
  - listProductsByCategory(categoryId): Product[]

### Module 3: Order
Responsibility:
  Shopping cart, order creation, order status tracking,
  order history, cancellation.

NOT responsible for:
  Payment processing (Payment module), inventory management (Catalog module).

Public API:
  - createOrder(userId, cartItems, shippingAddress): Order
  - getOrderById(orderId): Order | null
  - getOrdersByUser(userId): Order[]
  - cancelOrder(orderId, reason): CancellationResult

### Module 4: Payment
Responsibility:
  Charging payment methods, storing payment tokens,
  refund processing, financial transaction records.

NOT responsible for:
  Order creation, inventory checks, tax calculation.

Public API:
  - chargePaymentMethod(methodId, amount, currency): PaymentResult
  - issueRefund(transactionId, amount): RefundResult
  - savePaymentMethod(userId, token): PaymentMethod

### Module 5: Notification
Responsibility:
  Email sending, push notifications, SMS, notification preferences.

NOT responsible for:
  Deciding WHEN to notify (triggered by other modules), content of order data.

Public API:
  - sendOrderConfirmation(userId, orderId, orderSummary): void
  - sendShippingUpdate(userId, orderId, trackingInfo): void
  - updateNotificationPreferences(userId, preferences): void

## Module Dependencies

Order → Catalog.decrementInventory()  (reserve inventory when order placed)
Order → Payment.chargePaymentMethod() (charge for the order)
Order → Notification.sendOrderConfirmation() (notify user)
Catalog → (no dependencies on other domain modules)
Payment → (no dependencies on other domain modules)
Notification → (no dependencies — receives all data it needs in the call)

RULE: Identity and Catalog are foundational — they do NOT depend on Order or Payment.
This prevents circular dependencies.

## Boundary Violation Risk

Risk: Order module queries the catalog database directly with a SQL JOIN:
  SELECT o.*, p.name, p.price FROM orders o JOIN products p ON o.product_id = p.id
  This bypasses the Catalog module's public API and couples Order to Catalog's schema.

Prevention:
  1. Give each module its own database SCHEMA (same physical DB, separate schemas):
     - Schema "orders": owned by Order module only
     - Schema "catalog": owned by Catalog module only
     - Grant Order module NO SELECT permission on catalog schema tables
  2. Architectural fitness function (automated test):
     Verify that no file in src/modules/order imports from src/modules/catalog/infrastructure

## When to Reconsider

1. Payment module: if PCI-DSS compliance requires payment code in an isolated network segment.
2. Catalog/Search: if search volume demands Elasticsearch and monolith cannot scale search
   without scaling everything else proportionally.
3. Team scale: if the team grows to 40+ engineers split into buyer-facing and seller-facing
   product teams who are constantly blocking each other.

NOT a trigger: reading that microservices are industry standard.`,
      hints: [
        'Good module names come from the business domain, not technical layers. "OrderService" is a class; "Order" is a module.',
        'A key question for each module: "Who owns this data?" The owning module is the only one that writes to it.',
        'If Notification goes down for 30 minutes, should orders still process? Yes — so Order should not call Notification synchronously.',
        'The "NOT responsible for" section is as important as "Responsible for" — it defines boundaries precisely.',
      ],
    },
    {
      id: 'monolith-exercise-2',
      title: 'Analyze and Fix Module Boundary Violations',
      description: `The following codebase is a Modular Monolith for a blog platform with modules: User, Post, Comment, Notification.

Analyze the code and:
1. Identify all boundary violations (there are at least 4)
2. For each violation, explain WHY it is a problem (the concrete harm, not just "it breaks the rule")
3. Provide the correct implementation for each

This tests your ability to reason about WHY architectural rules exist, not just pattern-match on them.`,
      starterCode: `// ── src/modules/post/application/PostService.ts ─────────────
import { UserRepository } from '../../user/infrastructure/UserRepository'; // Line A
import { db } from '../../../shared/database';

export class PostService {
  private userRepo = new UserRepository(); // direct instantiation

  async createPost(authorId: string, title: string, content: string) {
    // Line B: Directly querying another module's table
    const user = await db.query(
      'SELECT * FROM users WHERE id = $1 AND is_banned = false',
      [authorId]
    );
    if (!user.rows[0]) throw new Error('User not found or banned');
    // ... create post
  }
}

// ── src/modules/comment/application/CommentService.ts ────────
import { PostRepository } from '../../post/infrastructure/PostRepository'; // Line C
import { NotificationRepository } from '../../notification/infrastructure/NotificationRepository'; // Line D

export class CommentService {
  private postRepo = new PostRepository();
  private notifRepo = new NotificationRepository();

  async addComment(userId: string, postId: string, text: string) {
    const post = await this.postRepo.findById(postId); // Line C usage
    if (!post) throw new Error('Post not found');
    // ... create comment
    await this.notifRepo.create({             // Line D usage
      userId: post.authorId,
      type: 'new_comment',
      message: \`Someone commented on: "\${post.title}"\`,
    });
  }
}

// ── src/modules/user/infrastructure/UserRepository.ts ────────
import { PostRepository } from '../../post/infrastructure/PostRepository'; // Line E

export class UserRepository {
  private postRepo = new PostRepository();

  async deleteUser(userId: string) {
    await this.postRepo.deleteByAuthor(userId); // Line E usage
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
  }
}`,
      solution: `# Boundary Violation Analysis

## Violation 1 (Line A): PostService imports UserRepository from user/infrastructure

File: src/modules/post/application/PostService.ts

WHY IT IS A PROBLEM:
  "infrastructure" is an internal implementation directory of the User module.
  Post is importing past the public API to use User's internal repository class.
  If User module renames or restructures its repository, Post breaks.
  Post is coupled to HOW User stores data, not just WHAT User provides.

CORRECT IMPLEMENTATION:
  // src/modules/user/index.ts (public API)
  export interface UserPublicService {
    isUserAllowedToPost(userId: string): Promise<boolean>;
    getUserById(userId: string): Promise<User | null>;
  }

  // PostService uses the interface, not the implementation
  class PostService {
    constructor(private userService: UserPublicService) {} // injected via DI
  }

## Violation 2 (Line B): PostService queries the users table directly with raw SQL

WHY IT IS A PROBLEM (most serious violation):
  Post module is defining what "valid user" means by writing:
    WHERE is_banned = false
  But what if User module adds email_verified = true as a condition?
  PostService misses it — a security bug. The User module has lost ownership
  of its own business rule ("what makes a user allowed to act?").
  If User module renames is_banned to account_status, PostService breaks silently.

CORRECT IMPLEMENTATION:
  User module exposes: isUserAllowedToPost(userId: string): Promise<boolean>
  This method encapsulates ALL conditions (not banned, email verified, not suspended).
  PostService calls this and gets a boolean — it does not know the conditions.
  Only User module changes when conditions change.

## Violation 3 (Line C): CommentService imports PostRepository from post/infrastructure

WHY IT IS A PROBLEM:
  Same pattern as Violation 1 — importing another module's internal repository.
  Post module cannot restructure its repository without breaking CommentService.

CORRECT IMPLEMENTATION:
  Post module exposes in index.ts:
    export interface PostPublicService {
      getPostById(postId: string): Promise<Post | null>;
    }
  CommentService imports from the public interface only.

## Violation 4 (Line D): CommentService writes directly to Notification module's repository

WHY IT IS A PROBLEM (most architecturally damaging):
  CommentService is bypassing Notification module's application logic by writing
  directly to its database table. This means:
  - If Notification module adds logic (check user's notification preferences before
    creating a notification), that logic is bypassed
  - "How a notification is created and what it contains" is now defined in CommentService,
    not in the Notification module — the owning module has lost control
  - Any change to notification storage format requires changing CommentService too

CORRECT IMPLEMENTATION (two options):

  Option A (Synchronous): Notification module exposes a public method:
    notifyOnNewComment(postAuthorId: string, postTitle: string, commenterId: string): Promise<void>
    CommentService calls this — Notification module handles its own logic internally.

  Option B (Event-Driven, preferred): CommentService publishes a CommentAdded event.
    Notification module subscribes independently. CommentService has zero dependency
    on Notification module.

## Violation 5 (Line E): UserRepository imports PostRepository — circular dependency risk

WHY IT IS A PROBLEM:
  User module already being used by Post module (Violation 1 direction is Post→User).
  If User also imports from Post, we get circular: User → Post → User.
  This can cause runtime import errors and makes the codebase unpredictable.
  Also: User module should not know HOW to delete posts — that is Post's responsibility.

CORRECT IMPLEMENTATION:

  Option A (Domain Event):
    User module publishes UserDeleted event.
    Post module subscribes and deletes posts by that author.
    User module has zero knowledge of Post module.

  Option B (Application Layer Orchestration):
    A UserLifecycleService (above both modules) coordinates:
      1. await postService.deletePostsByAuthor(userId)   // Post module's public API
      2. await userService.deleteUser(userId)            // User module's public API
    Neither module knows about the other.`,
      hints: [
        'When you see "../../someModule/infrastructure/..." in an import, that is almost always a boundary violation',
        'Ask for each violation: "What breaks in 6 months if this pattern continues?"',
        'Circular dependency (User → Post, Post → User) is a strong sign the dependency is wrong in at least one direction',
        'Notifications are side effects of actions. The module performing the action should not own how notifications work.',
      ],
    },
  ],

  keyTakeaways: [
    'A monolith is a single deployable unit where all components share a process, memory, and often a database. This is a description, not a criticism.',
    'Monoliths have genuine, significant advantages: no network overhead between components, ACID transactions across the entire application, simpler debugging, lower operational cost, and faster development velocity for small teams.',
    'Many successful, large-scale products (Shopify, Stack Overflow, GitHub for years) are or were monoliths. The "monolith = bad" narrative is a misconception born from poorly-designed monoliths, not the architecture itself.',
    'A monolith becomes a liability when: deployment is a bottleneck, components have radically different scaling needs, team size makes coordination expensive, or compliance requires isolation.',
    'A Modular Monolith — with explicit, enforced module boundaries — prevents the Big Ball of Mud while retaining all monolith benefits and making future service extraction easier.',
    'Scaling a monolith (vertical scaling, stateless design + horizontal scaling, read replicas, caching) can extend its capacity 10-100x before architectural restructuring is necessary.',
    'The correct progression for most systems: Monolith → Modular Monolith → Extract specific services where there is a concrete, measured reason — never preemptively.',
    'Signs to evaluate extraction: deployment is feared and slow, a component needs 10x more resources, teams are constantly blocked by each other, or regulatory requirements mandate isolation.',
  ],
};
