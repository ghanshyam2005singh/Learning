import type { Lesson } from '@/types';

export const architectureFundamentalsLesson: Lesson = {
  id: 'architecture-fundamentals',
  slug: 'architecture-fundamentals',
  title: 'Architecture Fundamentals',
  description:
    'Understand what software architecture actually is, why it matters, and the foundational patterns — layered, clean, hexagonal, and event-driven — that form the vocabulary of every production system.',
  category: 'Architecture',
  order: 3,
  difficulty: 'intermediate',
  estimatedTime: 40,
  prevLesson: 'system-design-thinking',
  nextLesson: 'monolith-architecture',

  content: `# Architecture Fundamentals

## What Is Software Architecture?

Most developers hear "software architecture" and think it means "the diagram on the whiteboard" — boxes and arrows showing which services talk to which databases. That is a description of an architecture. It is not what architecture IS.

Software architecture is the set of **fundamental structures of a system** and the **decisions that are hard to change later**.

Let's unpack that.

"Fundamental structures" means: how the system is divided into components, how those components communicate, and which component owns which responsibility. These structural decisions determine everything that follows.

"Hard to change later" is the critical part. In day-to-day development, you change code constantly. You add a function, rename a variable, fix a bug. These changes are cheap. But some decisions are expensive to reverse:

- Choosing SQL vs NoSQL (migrating 100TB of data is extremely costly)
- Choosing a monolith vs microservices (breaking a monolith apart takes months or years)
- Choosing synchronous vs asynchronous communication between services (the entire failure handling model changes)
- Choosing to put business logic in the database (stored procedures) vs the application (undoing this is a major refactor)

Architecture is the discipline of making these **high-stakes decisions** thoughtfully, because you will live with them for years.

**Why does architecture exist?** Because software that grows without intentional structure becomes unmaintainable. Every junior developer has opened a codebase where a "God class" has 5,000 lines, where business logic, database calls, and UI rendering are mixed in the same function, where changing one feature mysteriously breaks three others. That is what happens without architecture.

Architecture imposes structure to make systems **understandable**, **changeable**, and **testable**.

---

## Components: The Building Blocks

A **component** is a unit of software that:
1. Has a **clearly defined responsibility** (what it does)
2. Has a **defined interface** (how others interact with it)
3. **Hides its implementation** (others don't need to know how it works internally)

Components are not files. They are not classes. A component can be a module, a package, a service, or an entire application. The key is that it is a meaningful unit of encapsulation.

### Coupling: The Enemy of Maintainability

**Coupling** measures how much one component depends on the internal details of another.

**Tight coupling (bad):**
\`\`\`
Component A directly calls Component B's internal methods.
Component A knows the structure of Component B's database tables.
Changing Component B requires changing Component A.
\`\`\`

**Loose coupling (good):**
\`\`\`
Component A communicates with Component B only through a defined interface (API).
Component B can change its internal implementation without affecting Component A.
They are independent — they only know about the contract, not each other's internals.
\`\`\`

The goal of every architecture pattern is to maximize cohesion (related things together) and minimize coupling (unrelated things apart).

---

## Services: What Makes Something a "Service"?

The word "service" is overloaded. People say "microservices," "web services," "background services" — all meaning different things.

In architecture, a service is a component that:
1. Runs as an **independently deployable** unit (its own process)
2. Communicates via a **network protocol** (HTTP, gRPC, AMQP)
3. Has **its own data store** (in microservices — no shared databases)
4. Can be **started, stopped, and scaled independently**

What distinguishes a service from a library? A library runs in the same process as the caller. A service runs in its own process and is called over the network. This distinction matters enormously for failure handling: a slow library blocks your thread; a slow service can time out without crashing your application (if you handle it correctly).

---

## Communication Patterns: How Components Talk

How components communicate is as important as what they do. The communication pattern determines failure modes, latency characteristics, and operational complexity.

### Synchronous Communication (Request-Response)

One component sends a request and **waits** for a response before continuing.

\`\`\`
Client → sends HTTP request → Server
Client ← receives HTTP response ← Server
(client is blocked until response arrives)
\`\`\`

**When to use:** When you need the result immediately to proceed. User authentication (you need to know if they are authenticated before showing the page). Payment confirmation (you need to know if payment succeeded before confirming the order to the user).

**Risks:**
- If the server is slow, the client is slow
- If the server is down, the client fails
- Creates temporal coupling (both must be running at the same time)

### Asynchronous Communication (Event-Driven)

One component publishes an event or puts a message in a queue, and **does not wait** for processing to complete.

\`\`\`
Producer → puts message in Queue → returns immediately
                                         ↓ (later)
                               Consumer → processes message
\`\`\`

**When to use:** When the caller does not need the result immediately. Sending an email after a user registers. Processing a payment receipt. Generating a report. Updating a search index after a product is modified.

**Advantages:**
- Producer and consumer are decoupled (one can be down without affecting the other)
- Natural load leveling (consumers process at their own pace)
- Easy retry on failure (message stays in queue until processed)

**Tradeoff:** The system is eventually consistent, not immediately consistent. And debugging async flows is significantly harder.

---

## Layers and Separation of Concerns

The principle of **separation of concerns** says: each part of the system should be responsible for one thing, and only one thing.

Why? Because when a change is needed, you should be able to make it in one place without ripple effects throughout the codebase.

**The classic example of violation:**
\`\`\`javascript
// This function does EVERYTHING — UI, business logic, and database. A nightmare to maintain.
function handleCheckout(req, res) {
  const userId = req.session.userId;
  const items = db.query(\`SELECT * FROM cart WHERE user_id = \${userId}\`); // SQL injection risk too
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
    if (item.quantity > item.stock) {
      res.send('<html><body>Out of stock!</body></html>'); // HTML in business logic
      return;
    }
  }
  db.query(\`INSERT INTO orders (user_id, total) VALUES (\${userId}, \${total})\`);
  sendEmail(userId, 'Your order is confirmed'); // side effect mixed in
  res.send('<html><body>Order placed! Total: $' + total + '</body></html>');
}
\`\`\`

This function is impossible to test in isolation, impossible to reuse, and impossible to change safely.

Separation of concerns means splitting this into: route handler (HTTP), order service (business logic), order repository (database), email service (notification). Each can be tested, changed, and reasoned about independently.

---

## Layered Architecture

Layered architecture (also called N-tier) organizes code into horizontal layers where each layer has a specific responsibility and can only communicate with the layer directly below it.

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│          (Controllers, Routes, Request/Response handling)        │
│          Receives HTTP requests, validates input format,         │
│          returns HTTP responses. NO business logic here.         │
└─────────────────────────────────┬───────────────────────────────┘
                                  │  calls
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│          (Services, Use Cases, Domain rules)                     │
│          Enforces business rules. Orchestrates operations.       │
│          Does NOT know about HTTP or databases.                  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │  calls
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│          (Repositories, DAOs, ORM models)                        │
│          Handles all database interaction. Returns domain        │
│          objects. Does NOT contain business logic.               │
└─────────────────────────────────┬───────────────────────────────┘
                                  │  queries
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                  │
│          (PostgreSQL, MySQL, MongoDB, etc.)                       │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

**Why this works:** Each layer has one job. You can change the database (swap PostgreSQL for MySQL) without touching business logic. You can add a new API endpoint (REST → GraphQL) without touching business logic. You can unit test business logic without a database.

**Limitation:** Layered architecture can become rigid. Every request passes through all layers even when it doesn't need to. Adding a cross-cutting concern (logging, caching) requires touching every layer.

---

## Clean Architecture

Clean Architecture (Robert C. Martin) extends layered architecture with one critical rule: the **Dependency Rule**.

> Source code dependencies can only point inward. Nothing in an inner circle can know anything about something in an outer circle.

\`\`\`
         ┌──────────────────────────────────────────┐
         │           FRAMEWORKS & DRIVERS            │
         │  (Express, React, PostgreSQL, Kafka)      │
         │   ┌──────────────────────────────────┐   │
         │   │      INTERFACE ADAPTERS           │   │
         │   │  (Controllers, Repositories,      │   │
         │   │   Presenters, Gateways)            │   │
         │   │   ┌────────────────────────────┐  │   │
         │   │   │    APPLICATION LAYER       │  │   │
         │   │   │  (Use Cases, Interactors)  │  │   │
         │   │   │  ┌──────────────────────┐  │  │   │
         │   │   │  │   ENTITIES (DOMAIN)  │  │  │   │
         │   │   │  │ (Business rules,     │  │  │   │
         │   │   │  │  domain objects)     │  │  │   │
         │   │   │  └──────────────────────┘  │  │   │
         │   │   └────────────────────────────┘  │   │
         │   └──────────────────────────────────┘   │
         └──────────────────────────────────────────┘
         Dependencies flow inward ───────────────────►
\`\`\`

The key difference from plain layered: **the domain/entity layer has zero dependencies**. It does not depend on Express, PostgreSQL, or any external framework. This means the core business logic can be tested with zero infrastructure setup.

**Why this matters:** In 3 years, you might switch from Express to Fastify, from PostgreSQL to CockroachDB. In Clean Architecture, the business logic is untouched — only the outer adapters change.

---

## Hexagonal Architecture (Ports and Adapters)

Hexagonal Architecture (Alistair Cockburn, 2005) thinks about the system differently: there is a **core** (your application) and the outside world (databases, APIs, UIs, message queues). The core communicates with the outside world only through **ports** (interfaces) and **adapters** (implementations).

\`\`\`
                 ┌──────────────┐
   HTTP          │              │         PostgreSQL
   Request ─────►│    PORT      │◄──────── Adapter
   Adapter       │  (Interface) │
                 │              │
   CLI           │   CORE APP   │         Kafka
   Adapter ─────►│   BUSINESS   │◄──────── Adapter
                 │    LOGIC     │
   Tests         │              │         Redis
   Adapter ─────►│              │◄──────── Adapter
                 └──────────────┘

LEFT SIDE (Driving): Things that drive/call your application
RIGHT SIDE (Driven): Things your application drives/calls
\`\`\`

**Why Hexagonal?** The name comes from drawing the core as a hexagon to make clear it has many sides (ports) that can connect to many adapters. It is not about having exactly six sides.

**The key insight:** Your core business logic does not know whether data comes from HTTP or CLI or a test. It does not know whether storage is PostgreSQL or in-memory or a file. It talks to ports (interfaces), and adapters implement those interfaces.

This makes testing trivial: swap the PostgreSQL adapter for an in-memory adapter in tests. No real database needed. Tests run in milliseconds.

---

## Event-Driven Architecture

In Event-Driven Architecture (EDA), components communicate by producing and consuming **events**. An event is a fact: something that happened.

\`\`\`
                      EVENT BUS / MESSAGE BROKER
                    ┌──────────────────────────────┐
                    │                              │
Order Service ──────► "OrderPlaced" event ─────────► Inventory Service
(Producer)          │                              │  (Consumer: reserve stock)
                    │                              │
                    │                              ► Payment Service
                    │                              │  (Consumer: charge customer)
                    │                              │
                    │                              ► Email Service
                    │                              │  (Consumer: send confirmation)
                    │                              │
                    │                              ► Analytics Service
                    └──────────────────────────────┘  (Consumer: update metrics)
\`\`\`

**What an event is NOT:** An event is NOT a command ("ProcessPayment"). It is NOT a request. It is a notification that something happened ("OrderPlaced", "UserRegistered", "PaymentFailed"). The producer does not tell consumers what to do — it just announces what happened, and consumers decide how to react.

**Why EDA enables decoupling:** The Order Service does not know that an Inventory Service, Payment Service, Email Service, or Analytics Service exists. It simply publishes an event. If you add a new service (say, a Fraud Detection Service), the Order Service does not change at all — the new service subscribes to the event.

**Tradeoffs of EDA:**
- Harder to trace a request's full journey (must use distributed tracing)
- Eventually consistent (the payment happens after the order event, not during)
- Testing is more complex (must simulate event publishing and consumption)
- Risk of event schema changes breaking consumers

---

## Architecture Comparison Table

| Aspect | Layered | Clean | Hexagonal | Event-Driven |
|---|---|---|---|---|
| **Primary organizing principle** | Horizontal layers | Dependency rule (inward only) | Core + ports + adapters | Events as communication |
| **Dependency direction** | Top to bottom | Always inward | Core has no external deps | Producer doesn't know consumers |
| **Testability** | Medium (DB needed in lower layers) | High (domain has zero deps) | High (swap adapters) | Complex (async event testing) |
| **Complexity** | Low-Medium | Medium-High | Medium-High | High |
| **Coupling** | Medium (layer-to-layer) | Low (dependency inversion) | Low (ports abstract deps) | Very Low (events decouple) |
| **Best for** | Simple CRUD apps, APIs | Complex domains with evolving requirements | Apps needing multiple UIs or storage backends | Distributed systems, microservices |
| **Operational complexity** | Low | Low | Low | High (needs event broker, tracing) |
| **When NOT to use** | When domain logic is complex | When the app is simple CRUD | When you only ever have one adapter | When strong consistency is required |
`,

  codeExamples: [
    {
      title: 'Layered Architecture: The Same Feature, Properly Separated',
      code: `// ============================================================
// PRESENTATION LAYER: HTTP Controllers
// Responsibility: Handle HTTP request/response ONLY.
// Does NOT contain business logic or database calls.
// ============================================================

class UserController {
  constructor(private userService: UserService) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    // ONLY validates HTTP input format, delegates everything else
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'email, password, and name are required' });
      return;
    }

    try {
      const user = await this.userService.registerUser({ email, password, name });
      res.status(201).json({ userId: user.id, email: user.email });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        res.status(409).json({ error: 'An account with this email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed. Please try again.' });
      }
    }
  }
}

// ============================================================
// BUSINESS LOGIC LAYER: Services
// Responsibility: Enforce domain rules. Orchestrate operations.
// Does NOT know about HTTP. Does NOT write SQL.
// ============================================================

class UserService {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private emailService: EmailService
  ) {}

  async registerUser(data: { email: string; password: string; name: string }): Promise<User> {
    // Business rule: email must be unique
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new EmailAlreadyExistsError(data.email);
    }

    // Business rule: password must meet strength requirements
    if (!this.isStrongPassword(data.password)) {
      throw new WeakPasswordError();
    }

    // Business rule: hash password before storing (never store plaintext)
    const hashedPassword = await this.passwordHasher.hash(data.password);

    const user = await this.userRepository.create({
      email: data.email.toLowerCase(), // normalize email
      name: data.name.trim(),
      passwordHash: hashedPassword,
    });

    // Side effect: send welcome email (could also be async via event)
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }

  private isStrongPassword(password: string): boolean {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }
}

// ============================================================
// DATA ACCESS LAYER: Repositories
// Responsibility: All database interaction. Returns domain objects.
// Does NOT contain business logic.
// ============================================================

class UserRepository {
  constructor(private db: Database) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db.query(
      'SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );
    return row ? this.mapRowToUser(row) : null;
  }

  async create(data: { email: string; name: string; passwordHash: string }): Promise<User> {
    const row = await this.db.query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [data.email, data.name, data.passwordHash]
    );
    return this.mapRowToUser(row);
  }

  private mapRowToUser(row: DatabaseRow): User {
    return new User({
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.created_at,
    });
  }
}`,
      explanation:
        'This is what separation of concerns looks like in code. The controller handles HTTP and nothing else. The service has business rules and nothing else. The repository has database logic and nothing else. You can test the UserService without a real HTTP server. You can test the UserRepository without real business rules. You can swap PostgreSQL for MongoDB by replacing only the UserRepository.',
    },
    {
      title: 'Hexagonal Architecture: Ports and Adapters for Testability',
      code: `// ============================================================
// THE PORT (Interface — what the core requires)
// Defined in the CORE. No dependency on any external framework.
// ============================================================

// Port for storage (driven adapter)
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// Port for notifications (driven adapter)
interface NotificationService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
}

// ============================================================
// THE CORE (Business logic — no external dependencies)
// Depends ONLY on interfaces (ports), never on implementations
// ============================================================

class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,           // interface, not implementation
    private notifications: NotificationService  // interface, not implementation
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    // Pure business logic. No Express. No PostgreSQL. No Nodemailer.
    const existing = await this.userRepo.findById(command.userId);
    if (existing) {
      return { success: false, reason: 'USER_ALREADY_EXISTS' };
    }

    const user = User.create({
      id: command.userId,
      email: command.email,
      name: command.name,
    });

    await this.userRepo.save(user);
    await this.notifications.sendWelcomeEmail(user.email, user.name);

    return { success: true, userId: user.id };
  }
}

// ============================================================
// ADAPTER 1: PostgreSQL implementation (for production)
// ============================================================

class PostgresUserRepository implements UserRepository {
  constructor(private db: PostgresClient) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? User.fromRow(result.rows[0]) : null;
  }

  async save(user: User): Promise<void> {
    await this.db.query(
      'INSERT INTO users (id, email, name) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET email = $2, name = $3',
      [user.id, user.email, user.name]
    );
  }
}

// ============================================================
// ADAPTER 2: In-memory implementation (for testing)
// Same interface — zero database setup needed in tests
// ============================================================

class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}

class NoOpNotificationService implements NotificationService {
  async sendWelcomeEmail(_email: string, _name: string): Promise<void> {
    // Do nothing in tests. No emails sent.
  }
}

// ============================================================
// TEST (no database, no email server, no HTTP — pure unit test)
// ============================================================

describe('RegisterUserUseCase', () => {
  it('should register a new user successfully', async () => {
    const repo = new InMemoryUserRepository();
    const notifications = new NoOpNotificationService();
    const useCase = new RegisterUserUseCase(repo, notifications);

    const result = await useCase.execute({
      userId: 'user-123',
      email: 'alice@example.com',
      name: 'Alice',
    });

    expect(result.success).toBe(true);
    expect(await repo.findById('user-123')).not.toBeNull();
  });

  it('should reject duplicate users', async () => {
    const repo = new InMemoryUserRepository();
    const useCase = new RegisterUserUseCase(repo, new NoOpNotificationService());

    await useCase.execute({ userId: 'user-123', email: 'alice@example.com', name: 'Alice' });
    const result = await useCase.execute({ userId: 'user-123', email: 'alice@example.com', name: 'Alice' });

    expect(result.success).toBe(false);
    expect(result.reason).toBe('USER_ALREADY_EXISTS');
  });
});`,
      explanation:
        'The power of hexagonal architecture: the entire business logic is tested with zero real infrastructure. In-memory adapters replace the database and email service. Tests run in milliseconds. When you deploy to production, you wire in the real PostgreSQL and Nodemailer adapters. The core never changes.',
    },
    {
      title: 'Event-Driven Architecture: Decoupling Services with Events',
      code: `// ============================================================
// WITHOUT EVENT-DRIVEN: Tight coupling nightmare
// The Order Service must know about EVERY downstream service
// Adding a new service requires modifying OrderService
// ============================================================

class OrderService_TIGHTLY_COUPLED {
  constructor(
    private inventoryService: InventoryService,
    private paymentService: PaymentService,
    private emailService: EmailService,
    private analyticsService: AnalyticsService,
    private fraudService: FraudService,     // added later — required modifying this class
    private loyaltyService: LoyaltyService  // added later — required modifying this class
  ) {}

  async placeOrder(order: Order): Promise<void> {
    await this.inventoryService.reserveItems(order.items);     // if this fails, what about payment?
    await this.paymentService.charge(order.payment);           // if this fails, inventory already reserved
    await this.emailService.sendConfirmation(order.userId);    // if this fails, order is still placed
    await this.analyticsService.trackOrder(order);             // why does ordering need analytics?
    await this.fraudService.scoreOrder(order);                 // added months later — had to change core
    await this.loyaltyService.awardPoints(order);             // added months later — had to change core
    // Every new business requirement = change to this central class = risk to entire order flow
  }
}

// ============================================================
// WITH EVENT-DRIVEN: Loose coupling through events
// Order Service only knows: "I placed an order, I publish an event"
// All other services are independently subscribed consumers
// ============================================================

// The event: a plain data structure describing what happened
interface OrderPlacedEvent {
  eventType: 'OrderPlaced';
  eventId: string;
  timestamp: string;
  orderId: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentMethodId: string;
}

// The Order Service: publishes and forgets
class OrderService_EVENT_DRIVEN {
  constructor(private eventBus: EventBus) {}

  async placeOrder(order: Order): Promise<{ orderId: string }> {
    // Core order creation (validate, create DB record)
    const orderId = await this.createOrderRecord(order);

    // Publish event — does NOT call any other service
    await this.eventBus.publish({
      eventType: 'OrderPlaced',
      eventId: generateId(),
      timestamp: new Date().toISOString(),
      orderId,
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentMethodId: order.paymentMethodId,
    });

    return { orderId };
    // Order Service is DONE. It has no idea what happens next.
  }
}

// Consumer 1: Inventory Service (completely independent)
class InventoryConsumer {
  async onOrderPlaced(event: OrderPlacedEvent): Promise<void> {
    for (const item of event.items) {
      await this.reserveInventory(item.productId, item.quantity);
    }
    // If this fails, it retries automatically (message stays in queue)
    // If it keeps failing, it goes to dead-letter queue for manual review
  }
}

// Consumer 2: Payment Service (completely independent)
class PaymentConsumer {
  async onOrderPlaced(event: OrderPlacedEvent): Promise<void> {
    await this.processPayment({
      orderId: event.orderId,
      amount: event.totalAmount,
      paymentMethodId: event.paymentMethodId,
    });
    // Publishes its own event: PaymentSucceeded or PaymentFailed
  }
}

// Consumer 3: Email Service (completely independent)
class EmailConsumer {
  async onOrderPlaced(event: OrderPlacedEvent): Promise<void> {
    const user = await this.userRepo.findById(event.userId);
    await this.emailProvider.send({
      to: user.email,
      template: 'order-confirmation',
      data: { orderId: event.orderId, items: event.items },
    });
  }
}

// Adding a NEW service (Fraud Detection) requires ZERO changes to OrderService:
class FraudDetectionConsumer {
  async onOrderPlaced(event: OrderPlacedEvent): Promise<void> {
    const riskScore = await this.scoreOrder(event);
    if (riskScore > 0.8) {
      await this.flagForReview(event.orderId);
    }
  }
}`,
      explanation:
        'The contrast is stark. In the tightly coupled version, every new business requirement requires modifying the OrderService — a central, risky class. In the event-driven version, the OrderService never changes. New consumers subscribe to the existing event. The system grows without modifying existing code. This is the Open/Closed Principle at the architectural level.',
    },
  ],

  commonMistakes: [
    'Treating architecture as "just the diagram." Architecture is about the decisions embedded in the code structure, not the picture on a whiteboard.',
    'Putting business logic in controllers. Controllers handle HTTP. If your controller contains if-statements about business rules, you have violated separation of concerns.',
    'Putting business logic in the database (stored procedures and triggers). This makes the logic invisible, untestable, and tightly coupled to the specific database vendor.',
    'Skipping the data access layer and writing SQL directly in services or controllers. This makes it impossible to switch databases and impossible to test without a real database.',
    'Using event-driven architecture when you need strong consistency. Events are eventually consistent. If step A and step B must BOTH succeed or BOTH fail atomically, EDA requires a saga pattern, not a simple event.',
    'Making the domain layer depend on external frameworks. If your entity classes import from Express or an ORM, you have violated the dependency rule. The domain must be framework-free.',
    'Choosing a complex architecture (Clean, Hexagonal) for a simple CRUD API that will never change. Simple problems deserve simple solutions.',
    'Naming things "service" without defining clear boundaries. A "UserService" that handles registration, authentication, profile updates, follows, and notifications is not a service — it is a God class with a better name.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between layered architecture and clean architecture?',
      answer:
        'Both organize code into layers with defined responsibilities, but they differ in the direction of dependencies. In traditional layered architecture, each layer depends on the layer below it — the business logic layer depends on the data access layer, which means it is coupled to how data is stored. If you change from PostgreSQL to MongoDB, the business logic layer may need changes. In Clean Architecture, the Dependency Rule says all source code dependencies must point inward toward the domain. The domain entities depend on nothing. The use cases depend only on entities. The outer layers (database, HTTP, UI) depend on the inner layers through abstractions. This means you can change the database, the HTTP framework, or the UI without touching the business logic. The key mechanism is the Dependency Inversion Principle: the business logic defines an interface (port) that the database implementation must satisfy, so the dependency points inward (toward business logic) rather than outward (toward the database).',
      difficulty: 'intermediate',
      followUp: [
        'How do you test business logic in Clean Architecture without a real database?',
        'What is the Dependency Inversion Principle and how does it relate to Clean Architecture?',
      ],
    },
    {
      question: 'What is the difference between synchronous and asynchronous communication between services, and when would you choose each?',
      answer:
        'Synchronous communication (HTTP/gRPC): the caller sends a request and blocks until it receives a response. Asynchronous communication (message queues/event bus): the caller publishes a message and immediately continues without waiting for processing. Choose synchronous when: (1) the caller needs the result immediately to continue (e.g., checking if a user is authenticated before serving a page), (2) strong consistency is required (the operation must complete before proceeding), (3) the operation is time-sensitive and low-latency is critical. Choose asynchronous when: (1) the caller does not need the result immediately (sending an email, updating an analytics counter), (2) you want to decouple producers from consumers (a new consumer can subscribe without changing the producer), (3) you need to handle load spikes gracefully (queue absorbs burst, consumers process steadily), (4) the consumer might be temporarily unavailable (messages wait in the queue). The key tradeoff: synchronous is simpler and more immediately consistent but creates temporal coupling (both services must be running simultaneously). Asynchronous is more resilient and decoupled but introduces eventual consistency and more complex debugging.',
      difficulty: 'intermediate',
      followUp: ['What is temporal coupling and why is it a risk?', 'How do you handle a failure in an asynchronous flow?'],
    },
    {
      question: 'What are ports and adapters in hexagonal architecture and why does this pattern improve testability?',
      answer:
        'A port is an interface that defines how the application core communicates with the outside world. An adapter is a concrete implementation of that interface. There are two kinds: primary/driving adapters that call into the application (HTTP controllers, CLI handlers, test drivers) and secondary/driven adapters that the application calls into (database implementations, email providers, external APIs). Testability improves because the core application depends only on port interfaces, not on concrete implementations. In tests, you substitute real adapters (PostgreSQL, SMTP server) with in-memory or stub adapters that implement the same interface. This means: no real database is needed to test business logic, tests run in milliseconds instead of seconds, and tests are deterministic (no network failures, no database state from previous tests). The result is that 100% of business logic can be covered by fast, reliable unit tests.',
      difficulty: 'intermediate',
      tip: 'Draw the hexagon with left-side (driving) and right-side (driven) adapters. The visual explanation is more compelling than text alone in an interview.',
    },
    {
      question: 'What is an event in event-driven architecture and how is it different from a command?',
      answer:
        'An event is a notification that something happened in the past. It is a fact: "OrderPlaced", "UserRegistered", "PaymentFailed". Events are immutable records of reality. A command is an instruction to do something in the future: "ProcessPayment", "SendEmail", "ReserveInventory". The critical difference in event-driven architecture: when a service publishes an event, it does not tell other services what to do. It announces what happened and other services decide independently how to react. This is what enables true decoupling — the publishing service does not know what consumers exist or what they will do with the event. If you model it as commands instead, the publisher must know about every consumer and what it should do, reintroducing tight coupling. Additionally, events are in the past tense ("OrderPlaced") which naturally expresses that the fact is immutable and cannot be undone — only compensated (with a new "OrderCancelled" event).',
      difficulty: 'intermediate',
      followUp: ['What is event sourcing and how does it relate to events?', 'What is a dead-letter queue and when would you need one?'],
    },
    {
      question: 'How do you decide which architecture pattern to use for a new system?',
      answer:
        'Start with the problem, not the pattern. Ask: (1) How complex is the domain? If it is mostly CRUD with simple rules, layered architecture is sufficient. Complex domain rules with many aggregates and invariants benefit from clean architecture. (2) How many different entry points or storage backends exist? If the system needs to support HTTP, CLI, and event consumers, or might switch databases, hexagonal architecture pays off. (3) How important is decoupling between teams or services? If multiple teams work independently and services need to evolve without coordinating releases, event-driven architecture is worth its complexity. (4) What is the consistency requirement? If operations must be immediately consistent, avoid event-driven. (5) How large is the team and codebase? Complex architectures have higher onboarding costs — a 2-person startup building an MVP does not need clean architecture. A general principle: start with the simplest architecture that works, and refactor toward more complex patterns as specific pain points emerge. The worst outcome is building elaborate architecture for a system that never reaches the scale to need it.',
      difficulty: 'advanced',
      followUp: ['Can you combine architecture patterns? For example, use clean architecture within each service in an event-driven system?'],
    },
  ],

  exercises: [
    {
      id: 'arch-exercise-1',
      title: 'Identify Architecture Violations and Fix Them',
      description: `The following code for a blog post creation feature has multiple architecture violations. Identify each violation and explain how to fix it.

Look for:
- Wrong responsibilities in the wrong layer
- Missing abstractions
- Business logic in the wrong place
- Testability problems

After identifying the problems, rewrite the code with proper separation of concerns.`,
      starterCode: `// This code "works" but has serious architecture problems.
// Find and fix them.

import express from 'express';
import { Pool } from 'pg';

const app = express();
const db = new Pool({ connectionString: process.env.DATABASE_URL });

app.post('/posts', async (req, res) => {
  const { title, content, authorId } = req.body;

  // Problem 1: Find it here
  if (!title || title.length < 5 || title.length > 200) {
    res.status(400).json({ error: 'Invalid title' });
    return;
  }

  if (!content || content.length < 50) {
    res.status(400).json({ error: 'Content too short' });
    return;
  }

  // Problem 2: Find it here
  const authorCheck = await db.query(
    'SELECT id, is_banned FROM users WHERE id = $1',
    [authorId]
  );

  if (authorCheck.rows.length === 0) {
    res.status(404).json({ error: 'Author not found' });
    return;
  }

  if (authorCheck.rows[0].is_banned) {
    res.status(403).json({ error: 'Banned users cannot post' });
    return;
  }

  // Problem 3: Find it here
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  const result = await db.query(
    'INSERT INTO posts (title, content, author_id, slug, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [title, content, authorId, slug, 'draft']
  );

  // Problem 4: Find it here
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: \`Bearer \${process.env.SENDGRID_KEY}\` },
    body: JSON.stringify({
      to: 'editors@blog.com',
      subject: 'New post awaiting review',
      text: \`Post "\${title}" by author \${authorId} needs review.\`,
    }),
  });

  res.status(201).json({ postId: result.rows[0].id, slug });
});`,
      solution: `// IDENTIFIED PROBLEMS:
// Problem 1: HTTP input validation (length checks) is fine in the controller,
//   BUT business rules like "title must be < 200 chars" is a BUSINESS RULE, not HTTP rule.
//   Should be in PostService with proper error types.
//
// Problem 2: Direct SQL in the route handler. The controller is querying the database.
//   Database access belongs in a repository. Also: this mixes author validation
//   (a business rule) with HTTP handling.
//
// Problem 3: Slug generation is business logic (domain logic about what a valid slug is).
//   It lives inside the HTTP route handler. Cannot be reused or tested without HTTP.
//
// Problem 4: Direct HTTP call to SendGrid inside the route handler.
//   Notification sending is a side effect that (a) should be behind an abstraction,
//   (b) should probably be async (don't make the user wait for email to send),
//   (c) couples the route handler to a specific email provider.

// ─── FIXED ARCHITECTURE ────────────────────────────────────────────

// ── Domain: Post entity with business rules ──────────────────────────

class Post {
  static create(data: { title: string; content: string; authorId: string }): Post {
    // Business rule: validate within the domain entity
    if (!data.title || data.title.length < 5 || data.title.length > 200) {
      throw new InvalidPostError('Title must be between 5 and 200 characters');
    }
    if (!data.content || data.content.length < 50) {
      throw new InvalidPostError('Content must be at least 50 characters');
    }
    return new Post({
      ...data,
      slug: Post.generateSlug(data.title), // slug generation lives in the domain
      status: 'draft',
    });
  }

  private static generateSlug(title: string): string {
    return title.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
}

// ── Repository interface (Port) ──────────────────────────────────────

interface PostRepository {
  save(post: Post): Promise<Post>;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
}

interface NotificationService {
  notifyEditorsOfNewPost(postId: string, title: string, authorId: string): Promise<void>;
}

// ── Application Service (Use Case) ──────────────────────────────────

class CreatePostUseCase {
  constructor(
    private postRepo: PostRepository,
    private userRepo: UserRepository,
    private notifications: NotificationService
  ) {}

  async execute(command: { title: string; content: string; authorId: string }): Promise<{ postId: string; slug: string }> {
    // Business rule: author must exist and must not be banned
    const author = await this.userRepo.findById(command.authorId);
    if (!author) throw new AuthorNotFoundError(command.authorId);
    if (author.isBanned) throw new BannedAuthorError(command.authorId);

    // Domain entity validates its own invariants
    const post = Post.create({
      title: command.title,
      content: command.content,
      authorId: command.authorId,
    });

    const savedPost = await this.postRepo.save(post);

    // Notify editors — behind an abstraction, can be swapped for a queue
    await this.notifications.notifyEditorsOfNewPost(savedPost.id, post.title, post.authorId);

    return { postId: savedPost.id, slug: post.slug };
  }
}

// ── HTTP Controller (Presentation Layer only) ────────────────────────

class PostController {
  constructor(private createPost: CreatePostUseCase) {}

  async createPost(req: Request, res: Response): Promise<void> {
    const { title, content, authorId } = req.body;

    // Controller only handles HTTP concerns: missing fields = 400
    if (!title || !content || !authorId) {
      res.status(400).json({ error: 'title, content, and authorId are required' });
      return;
    }

    try {
      const result = await this.createPost.execute({ title, content, authorId });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof InvalidPostError) {
        res.status(422).json({ error: error.message });
      } else if (error instanceof AuthorNotFoundError) {
        res.status(404).json({ error: 'Author not found' });
      } else if (error instanceof BannedAuthorError) {
        res.status(403).json({ error: 'Banned users cannot post' });
      } else {
        res.status(500).json({ error: 'Failed to create post' });
      }
    }
  }
}`,
      hints: [
        'Ask yourself: "If I wanted to create a post via CLI instead of HTTP, which parts of this code could I reuse?" If the answer is "very little," the logic is in the wrong layer.',
        'Ask: "If I wanted to test the rule that banned users cannot post, do I need a real database and HTTP server?" If yes, the rule is in the wrong place.',
        'The slug generation algorithm is a business concept (how do we create a URL-safe identifier from a title?). Where does business logic live?',
        'What if the email provider changes from SendGrid to AWS SES? How many files do you need to change in the original code? How many in the fixed version?',
      ],
    },
    {
      id: 'arch-exercise-2',
      title: 'Design an Event-Driven Flow for Order Processing',
      description: `You are designing the order processing flow for an e-commerce platform. When a user places an order, the following must happen:

1. Order is created and saved to the database
2. Inventory is reserved for each item
3. Payment is charged
4. Confirmation email is sent to the customer
5. Analytics event is tracked
6. Loyalty points are awarded

Design this as an event-driven system:

1. What events do you publish and when? (list at least 3 distinct events with their schemas)
2. Which service publishes each event?
3. Which services subscribe to which events?
4. Draw a flow diagram (text/ASCII)
5. What happens if the Payment Service is down? How does the system handle it?
6. What is the eventual consistency concern here and how do you explain it to a product manager?`,
      starterCode: `# Event-Driven Order Processing Design

## Events (define the schema for each)

### Event 1: ???
Publisher: ???
Schema:
{
  eventType: "???",
  ...
}

### Event 2: ???
Publisher: ???
Schema: { ... }

### Event 3: ???
Publisher: ???
Schema: { ... }

## Event Subscriptions (who listens to what)

OrderPlaced event → consumed by:
  - ???
  - ???

PaymentSucceeded event → consumed by:
  - ???
  - ???

## Flow Diagram
[Order Service] → [???] → ...

## Failure Handling
If Payment Service is down:


## Explaining Eventual Consistency to a Product Manager:`,
      solution: `# Event-Driven Order Processing Design

## Events

### Event 1: OrderCreated
Publisher: Order Service (when order record is persisted to DB)
Schema:
{
  eventType: "OrderCreated",
  eventId: "evt_abc123",
  timestamp: "2024-01-15T10:30:00Z",
  orderId: "order_xyz789",
  userId: "user_alice",
  items: [
    { productId: "prod_001", quantity: 2, unitPrice: 29.99 },
    { productId: "prod_002", quantity: 1, unitPrice: 49.99 }
  ],
  totalAmount: 109.97,
  paymentMethodId: "pm_card_visa"
}

### Event 2: PaymentSucceeded
Publisher: Payment Service (after successfully charging the customer)
Schema:
{
  eventType: "PaymentSucceeded",
  eventId: "evt_def456",
  timestamp: "2024-01-15T10:30:02Z",
  orderId: "order_xyz789",
  userId: "user_alice",
  amountCharged: 109.97,
  currency: "USD",
  transactionId: "txn_stripe_123"
}

### Event 3: PaymentFailed
Publisher: Payment Service (if charge fails)
Schema:
{
  eventType: "PaymentFailed",
  eventId: "evt_ghi789",
  timestamp: "2024-01-15T10:30:02Z",
  orderId: "order_xyz789",
  userId: "user_alice",
  failureReason: "insufficient_funds",
  retryable: false
}

## Event Subscriptions

OrderCreated event → consumed by:
  - Inventory Service: reserve items immediately when order is created
  - Payment Service: charge the customer

PaymentSucceeded event → consumed by:
  - Email Service: send "Order Confirmed" email
  - Analytics Service: track successful conversion
  - Loyalty Service: award points
  - Order Service: update order status to "confirmed"

PaymentFailed event → consumed by:
  - Inventory Service: COMPENSATE — release the reserved inventory
  - Email Service: send "Payment Failed" email with retry link
  - Order Service: update order status to "payment_failed"

## Flow Diagram

User places order
     │
     ▼
[Order Service]
  Creates order (status: pending)
  Publishes: OrderCreated
     │
     ├──────────────────────────────────────────────┐
     ▼                                              ▼
[Inventory Service]                          [Payment Service]
  Reserves stock                               Charges card
  Publishes: StockReserved                     Publishes: PaymentSucceeded
                                                       OR: PaymentFailed
                                                     │
                         ┌───────────────────────────┤
                         │                           │
                         ▼                           ▼
                  [PaymentSucceeded]          [PaymentFailed]
                         │                           │
           ┌─────────────┼──────────┐        ┌──────┴──────┐
           ▼             ▼          ▼         ▼             ▼
     [Email Svc]  [Analytics]  [Loyalty]  [Inventory]  [Email Svc]
      Send            Track       Award     RELEASE      Send
      Confirm         Event       Points    Stock        Failure
                                                         Email

## Failure Handling
If Payment Service is down:
  - The OrderCreated event remains in the message queue (Kafka/RabbitMQ)
  - The queue retries delivery when Payment Service recovers
  - The order stays in "pending" status in the database
  - No money is charged, no inventory is permanently removed
  - When Payment Service recovers, it processes the queued event

  If Payment Service is down for an extended period:
  - After N retries, the message goes to a Dead Letter Queue (DLQ)
  - Operations team is alerted
  - Order is marked "payment_processing_failed"
  - Customer can be notified to retry

## Explaining Eventual Consistency to a Product Manager:

"When a user clicks 'Place Order,' the order is created instantly and they see a
confirmation page. However, the inventory deduction, payment charge, email, and
loyalty points don't all happen at exactly the same microsecond — they happen
within the next few seconds as each service processes the event.

This means: for about 2-5 seconds after placing an order, a user's loyalty points
balance might not yet show the new points. But they will within seconds.

The trade-off is significant: this design means the system can handle 100x more
orders per second because no single operation blocks all others. It also means
that if the email service goes down for 10 minutes, orders still process — we just
catch up on emails when it recovers. In a synchronous system, email service failure
would cause order failure.

For a business like ours, this is the right trade-off: we never want order creation
to fail because of an email problem."`,
      hints: [
        'Think about which events are "facts" (something happened) vs which are commands (do this). Only facts should be events.',
        'The Inventory Service listening to PaymentFailed to release stock is called a "compensating transaction" — this is the Saga pattern',
        'What if inventory reservation fails (item out of stock)? You need another event: InventoryReservationFailed, which causes Payment Service not to charge',
        'Consider the order of events carefully: should payment happen before or after inventory reservation? (Reserve first — prevents charging for items you cannot deliver)',
      ],
    },
  ],

  keyTakeaways: [
    'Software architecture is the set of high-stakes decisions that are hard to reverse later — it is not the diagram, it is the structure embedded in the code.',
    'Loose coupling (components depending only on each other\'s interfaces, not implementations) is the primary goal of every architecture pattern.',
    'Layered architecture separates presentation, business logic, and data access — each layer has one responsibility and can only call the layer below it.',
    'Clean Architecture adds the Dependency Rule: all dependencies point inward. The domain has zero external dependencies, making business logic portable and testable.',
    'Hexagonal Architecture (ports and adapters) makes the application\'s core independent of how it is called (HTTP, CLI, tests) and what it calls (database, email, APIs).',
    'Event-Driven Architecture enables decoupling by having producers publish events without knowing who consumes them — new consumers can be added without touching existing services.',
    'Asynchronous communication (events, queues) enables temporal decoupling — producer and consumer do not need to run simultaneously — but introduces eventual consistency.',
    'No architecture pattern is universally correct. Match complexity to the problem: simple CRUD needs layered, complex domains need clean, multiple adapters need hexagonal, distributed services need event-driven.',
  ],
};
