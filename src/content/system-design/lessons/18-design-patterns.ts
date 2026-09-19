import type { Lesson } from '@/types';

export const designPatternsLesson: Lesson = {
  id: 'design-patterns',
  slug: 'design-patterns',
  title: 'Design Patterns',
  description:
    'Master the most important creational, behavioral, and structural design patterns with deep explanations of what each solves, when to use it, when NOT to use it, and real-world usage in production codebases — from Singleton to Repository.',
  category: 'LLD',
  order: 18,
  difficulty: 'advanced',
  estimatedTime: 60,
  prevLesson: 'low-level-design',
  nextLesson: 'case-studies',

  content: `## What Are Design Patterns?

Design patterns are reusable solutions to commonly occurring problems in software design. They are not libraries to import, frameworks to install, or algorithms to copy-paste — they are *blueprints* that describe how to structure code to solve a class of problem elegantly.

The concept was formalized in the seminal 1994 book *Design Patterns: Elements of Reusable Object-Oriented Software* by the "Gang of Four" (GoF). The book documents 23 patterns organized into three categories:

- **Creational**: How objects are created
- **Structural**: How objects are composed and related
- **Behavioral**: How objects communicate and distribute responsibility

**When NOT to use design patterns (critical warning):** Patterns are solutions to specific problems. Applying patterns to code that does not have those problems is *over-engineering*. A pattern adds indirection, abstraction layers, and complexity. Only use a pattern if you can clearly state the problem it solves in your specific context.

---

## CREATIONAL PATTERNS

### Singleton

**What it is:** Ensures a class has exactly one instance and provides a global access point to it.

**The problem it solves:** Some resources should only exist once — a connection pool managing 10 database connections should not have two separate pools each managing 10 connections (you would have 20). A configuration manager should read the config file once, not once per class that accesses config. Singleton ensures one and only one instance.

**Implementation:**
\`\`\`
+----------------------------------+
|           Singleton              |
+----------------------------------+
| - static instance: Singleton     |
+----------------------------------+
| - constructor() (private)        |
| + static getInstance(): this     |
| + doWork(): void                 |
+----------------------------------+

First call: create instance → store → return
Subsequent calls: return stored instance
\`\`\`

**When to use:**
- Database connection pools (expensive to create, should be shared)
- Configuration manager (read once, share everywhere)
- Logger (consistent log stream, single destination)
- In-memory cache (one cache for the entire app)

**When NOT to use:**
- When you need testability — Singleton is global state. Tests share the same instance and can interfere with each other unless carefully reset. It is notoriously difficult to mock.
- When you might need multiple instances later — a Singleton that "we will never need two of" becomes a painful refactor when you need two environments (test + production) in the same process.
- When the class has mutable state — mutable global state is the root of many concurrency bugs and subtle behavioral dependencies between unrelated parts of the code.

**Real-world use:**
- Node.js module system: require('config') returns the same object every time — effectively a singleton by module caching
- Database ORM instances (Prisma Client, Sequelize connection)
- Winston logger instances

---

### Factory (Factory Method)

**What it is:** Define an interface for creating objects, but let subclasses or configuration decide which class to instantiate. Encapsulates object creation logic.

**The problem it solves:** When object creation is complex (involves configuration, dependencies, or branching logic) or when the exact type to create is determined by runtime conditions, spreading new ConcreteClass() throughout your codebase creates coupling. If you later switch implementations, you update one factory instead of dozens of new calls.

**ASCII Diagram:**
\`\`\`
Client ---> Factory.create('mysql')   ---> MySQLDatabase   (implements Database)
Client ---> Factory.create('postgres') --> PostgresDatabase (implements Database)
Client ---> Factory.create('mongo')   ---> MongoDatabase   (implements Database)

Client knows only the interface (Database).
Factory knows which concrete class to instantiate.
\`\`\`

**When to use:**
- When creation logic is complex or varies by configuration
- When you want to insulate client code from concrete class names
- When you want to support multiple "product families" (different database types, notification channels)
- Plugin systems where new product types are registered at runtime

**When NOT to use:**
- When you have only one concrete implementation — the factory is pure overhead
- When construction is trivially simple (new Point(x, y)) — a factory adds indirection without value
- When the concrete class will never change — factory value is enabling future substitution

**Real-world use:**
- http.createServer() in Node.js — factory for HTTP server instances
- React.createElement() — factory for React element objects
- Database driver factories: knex({ client: 'pg' }) vs knex({ client: 'mysql2' })

---

### Builder

**What it is:** Construct complex objects step by step. The builder separates the construction logic from the object representation, allowing the same construction process to produce different results.

**The problem it solves:** Constructor with many parameters is painful: new User(name, email, age, role, status, avatarUrl, createdAt, preferences) — 8 parameters, easy to swap order, hard to read what each argument means. Optional parameters make it worse.

**ASCII Diagram:**
\`\`\`
QueryBuilder
  .select('id', 'name')
  .from('users')
  .where('age > 18')
  .orderBy('name', 'ASC')
  .limit(10)
  .build()
  --> "SELECT id, name FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10"

Each step returns the builder (fluent interface) for chaining.
\`\`\`

**When to use:**
- Objects with many optional parameters
- When construction must follow a specific sequence of steps
- When you want a readable, fluent API for complex object creation
- Query builders, HTTP request builders, test fixture builders

**When NOT to use:**
- Simple objects with 2-3 parameters — builder is overkill
- When the resulting object is immutable but you need to create it in one shot — just use a named options object

**Real-world use:**
- Knex.js, Prisma query builders
- Axios request configuration
- Test fixture factories in Jest/testing libraries
- Email template builders, URL builders

---

## BEHAVIORAL PATTERNS

### Observer

**What it is:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically. Also called Publish/Subscribe.

**The problem it solves:** When multiple parts of a system need to react to state changes in another part, you need a mechanism for the changed object to notify interested parties without knowing who or what they are. Direct method calls create tight coupling — the subject would need to know about every observer.

**ASCII Diagram:**
\`\`\`
EventEmitter (Subject/Publisher)
     |
     |-- on('orderPlaced', handler)  <-- EmailService subscribes
     |-- on('orderPlaced', handler)  <-- InventoryService subscribes
     |-- on('orderPlaced', handler)  <-- AnalyticsService subscribes
     |
     |-- emit('orderPlaced', order)
             |         |         |
        EmailService Inventory Analytics
        (all notified, subject does not know about them)
\`\`\`

**When to use:**
- Event-driven systems where multiple components need to react to the same event
- UI components that need to update when data changes (React state, Redux)
- Decoupling services: order service should not call email service directly — emit an event
- Real-time updates: notify clients when server-side data changes

**When NOT to use:**
- When observer order matters — Observer pattern does not guarantee notification order
- When you need synchronous confirmation — if EmailService fails, the Order does not know
- Beware memory leaks: observers that are not properly removed stay in memory and receive events indefinitely
- When the system is simple — events add indirection that makes debugging harder

**Real-world use:**
- Node.js EventEmitter (the foundation of the entire Node ecosystem)
- DOM event system (addEventListener)
- React's useState + useEffect (components "observe" state)
- Message queues (Kafka, RabbitMQ) — Observer at distributed scale
- Redux: components subscribe to store changes

---

### Strategy

**What it is:** Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

**The problem it solves:** When you have multiple algorithms for the same task and want to switch between them without modifying the code that uses them. The alternative — a giant if/else or switch selecting algorithms — violates OCP and makes adding new algorithms risky.

**ASCII Diagram:**
\`\`\`
SortingContext
    |-- setSortStrategy(strategy: SortStrategy)
    |-- sort(data: number[]): number[]
         |
         |-> BubbleSortStrategy.sort()   (O(n^2), simple)
         |-> QuickSortStrategy.sort()    (O(n log n) average)
         +-> MergeSortStrategy.sort()    (O(n log n) guaranteed, stable)
\`\`\`

**When to use:**
- Multiple algorithms for the same task that need to be swappable
- When algorithm selection depends on runtime conditions
- Replacing complex conditionals that select an algorithm
- Payment methods, compression algorithms, rendering strategies, validation rules

**When NOT to use:**
- When you only have one algorithm and do not anticipate needing others
- When the number of strategies is small and rarely changes — a simple switch may be clearer
- When the strategies share a lot of context — if strategies need to access many fields of the context object, there may be a design problem

**Real-world use:**
- Passport.js authentication strategies (LocalStrategy, GoogleStrategy, GitHubStrategy)
- Webpack and Vite: different bundling strategies for dev vs production
- Payment processing: CreditCardStrategy, PayPalStrategy, CryptoStrategy
- Compression: GzipStrategy, BrotliStrategy, ZstdStrategy

---

### Command

**What it is:** Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

**The problem it solves:** When you need to: (1) Decouple the sender of a request from the receiver, (2) Queue, log, or replay requests, (3) Support undo/redo operations, (4) Build a command history for auditing.

**ASCII Diagram:**
\`\`\`
Client creates: MoveCommand(piece, from='e2', to='e4')
             --> stored in CommandHistory

Invoker calls: command.execute() --> moves piece
User hits Ctrl+Z --> CommandHistory.undo() --> command.undo() --> moves piece back

Queue: [Cmd1, Cmd2, Cmd3] --> process in order, retry on failure, audit log
\`\`\`

**When to use:**
- Undo/redo functionality (text editors, design tools, games)
- Command queues for async task processing
- Audit logging (store what happened, who did it, when)
- Macro recording (record a sequence of commands, replay them)
- Transactional behavior (batch commands, commit or rollback all)

**When NOT to use:**
- Simple operations that will never need undo/queue/logging — the Command object is pure overhead
- When the system is simple enough that a direct function call suffices

**Real-world use:**
- Text editors (every keystroke is a command, enabling undo)
- Version control (git commits are effectively Commands with undo=revert)
- Task queues (Bull, Celery) — job objects are Commands
- Database transactions: BEGIN/COMMIT/ROLLBACK

---

## STRUCTURAL PATTERNS

### Adapter

**What it is:** Convert the interface of a class into another interface clients expect. Adapter lets classes work together that could not otherwise because of incompatible interfaces.

**The problem it solves:** You have a class with a specific interface. You want to use it somewhere that expects a different interface. You cannot change either interface (third-party library, legacy code, or external service). The Adapter wraps one interface and translates it to another.

**ASCII Diagram:**
\`\`\`
Your code expects: PaymentProcessor.charge(amount, currency)

Third-party Stripe SDK provides: stripe.paymentIntents.create({ amount, currency })

StripeAdapter implements PaymentProcessor {
  charge(amount, currency) {
    return stripe.paymentIntents.create({ amount: amount * 100, currency });
  }
}

Your code --> StripeAdapter.charge() --> Stripe SDK
\`\`\`

**When to use:**
- Integrating third-party libraries with an incompatible interface
- Working with legacy code that cannot be changed
- Building a common interface over multiple payment gateways, logging frameworks, or storage providers

**When NOT to use:**
- When you control both interfaces and can align them directly
- When the adapter is doing significant business logic rather than pure translation

**Real-world use:**
- Payment provider adapters (Stripe, PayPal, Square all get an Adapter behind a common interface)
- Cloud storage adapters (S3Adapter, GCSAdapter, AzureBlobAdapter all implement StorageProvider)
- ORM adapters: TypeORM database drivers are adapters

---

### Decorator

**What it is:** Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

**The problem it solves:** You need to add behavior to an object without modifying its class and without creating a subclass for every combination of behaviors. Example: a coffee order can have milk, sugar, caramel, and extra shot — 4 options, 16 possible combinations. Subclassing would require 16 classes. Decorators compose at runtime.

**ASCII Diagram:**
\`\`\`
Coffee order:
Base: Espresso ($2.00)
  +-- MilkDecorator wraps Espresso      --> cost() = $2.00 + $0.50 = $2.50
       +-- CaramelDecorator wraps Milk  --> cost() = $2.50 + $0.75 = $3.25
            +-- ShotDecorator wraps C   --> cost() = $3.25 + $1.00 = $4.25

Each decorator wraps the previous, adding to the behavior.
\`\`\`

**When to use:**
- Adding cross-cutting concerns (logging, caching, auth, timing) to existing objects without modifying them
- Building composable middleware chains
- When subclassing would produce a combinatorial explosion

**When NOT to use:**
- When the decorators are so numerous and complex that the chain becomes hard to debug
- When order of decoration matters and is non-obvious — document it explicitly

**Real-world use:**
- Express.js middleware is a decorator pattern — each middleware wraps the request handler
- Python decorator syntax
- React Higher-Order Components (HOCs): withAuth(withLogging(MyComponent))
- Java Spring @Transactional, @Cacheable annotations are decorator implementations

---

### Facade

**What it is:** Provide a simplified interface to a complex subsystem. A facade does not encapsulate the subsystem — it provides a convenient, higher-level entry point while the subsystem is still accessible for advanced use.

**The problem it solves:** Complex subsystems have many classes, initialization sequences, and configuration requirements. Client code that knows all these details is tightly coupled to the subsystem. A facade simplifies the common use cases and hides the complexity.

**ASCII Diagram:**
\`\`\`
Without Facade (complex):
Client --> FFmpeg.initialize() --> FFmpeg.setInputFormat() --> FFmpeg.setCodec() -->
           FFmpeg.setResolution() --> FFmpeg.setBitrate() --> FFmpeg.process()

With VideoConverter Facade:
Client --> VideoConverter.convertToMP4(inputFile, outputFile)
           (Facade handles all FFmpeg complexity internally)
\`\`\`

**When to use:**
- Simplify a complex library or subsystem for the 80% common case
- Provide a clean entry point to a legacy system
- Define a high-level interface to a distributed system (Facade over multiple microservice calls)
- Hide implementation details of a third-party SDK

**When NOT to use:**
- When you need full control over subsystem internals — the facade limits access
- When "simplification" means hiding information that advanced users need

**Real-world use:**
- AWS SDK — s3.upload(params) is a facade over complex HTTP S3 API
- jQuery — a facade over inconsistent browser DOM APIs
- Express.js — a facade over Node.js's http module
- React — a facade over complex DOM manipulation and reconciliation

---

### Repository

**What it is:** Mediates between the domain model and the data mapping layer. A repository encapsulates all the logic needed to access data sources, providing collection-like access to domain objects.

**The problem it solves:** Business logic scattered with database queries creates untestable, hard-to-change code. Direct SQL or ORM calls in service classes couple business logic to the database technology. Changing the database (or running tests) requires changing business logic.

**ASCII Diagram:**
\`\`\`
Without Repository:
OrderService --> db.query("SELECT * FROM orders WHERE user_id = $1") --> OrderData

With Repository:
OrderService --> OrderRepository.findByUserId(userId) --> Order[]

OrderService does not know if storage is PostgreSQL, Redis, or an in-memory array.
\`\`\`

**When to use:**
- Separating business logic from data access logic
- When you need to test business logic without a real database
- When you may need to switch data sources
- When you want a clean domain model that does not know about persistence

**When NOT to use:**
- Simple CRUD apps where the business logic is just reading and writing data
- When you are using a framework (like Rails ActiveRecord) that already provides repository-like functionality

**Real-world use:**
- Spring Data JPA Repositories (Java)
- Any codebase that tests business logic without real databases

---

## Pattern Comparison Table

| Pattern | Category | Problem Solved | Key Signal to Use | Key Signal NOT to Use |
|---------|----------|---------------|-------------------|-----------------------|
| Singleton | Creational | One instance globally | Shared expensive resource | Need testability or multiple instances |
| Factory | Creational | Complex/varying object creation | Runtime type selection | Only one concrete type |
| Builder | Creational | Objects with many parameters | 4+ optional params | Simple 2-3 param objects |
| Observer | Behavioral | One-to-many state notification | Decoupled event reactions | Order of notification matters |
| Strategy | Behavioral | Swappable algorithms | Runtime algorithm selection | Only one algorithm |
| Command | Behavioral | Requests as objects | Undo/redo, queuing, audit | Simple operations, no queue |
| Adapter | Structural | Incompatible interfaces | Third-party integration | You control both interfaces |
| Decorator | Structural | Dynamic behavior composition | Cross-cutting concerns | Complex chain ordering |
| Facade | Structural | Simplified subsystem interface | Hiding complexity | Need full subsystem control |
| Repository | Structural | Data access abstraction | Testing without DB, DB swap | Simple CRUD, framework handles it |

---

## Patterns in the Wild — Real Codebases

**Node.js EventEmitter:** Pure Observer. Every on() registers an observer. Every emit() notifies all observers.

**Express.js middleware:** Decorator + Chain of Responsibility. Each middleware wraps the handler, adding behavior (auth, logging, body parsing).

**Passport.js:** Strategy. passport.use(new GoogleStrategy(...)) registers a strategy. passport.authenticate('google') invokes it.

**Redux:** Observer + Command. Actions are Commands. Reducers are observers. The store notifies all subscribers on state change.

**Prisma / TypeORM:** Repository (partially) + Builder. The query builder is Builder. The client abstracts data access like a Repository.

**React Context + useReducer:** Observer + Command. Actions (Commands) dispatched to a reducer, components subscribed to context (Observer).`,

  codeExamples: [
    {
      title: 'Singleton — Database Connection Pool',
      code: `import { Pool } from 'pg';

class DatabasePool {
  private static instance: DatabasePool | null = null;
  private pool: Pool;

  // Private constructor — prevents direct instantiation
  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle DB client:', err);
    });

    console.log('Database pool created (this should appear ONCE)');
  }

  static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    return this.pool.query(sql, params);
  }

  async close(): Promise<void> {
    await this.pool.end();
    DatabasePool.instance = null; // allow recreation (useful in tests)
  }
}

// Usage — always the same pool instance
const db1 = DatabasePool.getInstance();
const db2 = DatabasePool.getInstance();
console.log(db1 === db2); // true

await db1.query('SELECT 1');

// Test reset:
afterEach(async () => {
  await DatabasePool.getInstance().close();
});`,
      explanation:
        'Singleton is appropriate for a connection pool because multiple pools would exhaust database connections. The close() method allows resetting the singleton between tests.',
    },
    {
      title: 'Factory + Strategy — Payment Processing',
      code: `interface PaymentStrategy {
  charge(amount: number, currency: string): Promise<PaymentResult>;
  refund(transactionId: string, amount: number): Promise<void>;
}

interface PaymentResult {
  transactionId: string;
  status: 'success' | 'pending' | 'failed';
  provider: string;
}

class StripeStrategy implements PaymentStrategy {
  constructor(private apiKey: string) {}

  async charge(amount: number, currency: string): Promise<PaymentResult> {
    console.log(\`[Stripe] Charging \${amount} \${currency}\`);
    return { transactionId: 'pi_' + Math.random(), status: 'success', provider: 'stripe' };
  }

  async refund(transactionId: string, amount: number): Promise<void> {
    console.log(\`[Stripe] Refunding \${amount} for \${transactionId}\`);
  }
}

class PayPalStrategy implements PaymentStrategy {
  constructor(private clientId: string, private secret: string) {}

  async charge(amount: number, currency: string): Promise<PaymentResult> {
    console.log(\`[PayPal] Charging \${amount} \${currency}\`);
    return { transactionId: 'PP-' + Math.random(), status: 'success', provider: 'paypal' };
  }

  async refund(transactionId: string, amount: number): Promise<void> {
    console.log(\`[PayPal] Refunding \${amount} for \${transactionId}\`);
  }
}

// Factory creates the correct strategy based on config
class PaymentStrategyFactory {
  private static registry: Record<string, new (...args: any[]) => PaymentStrategy> = {};

  static register(name: string, cls: new (...args: any[]) => PaymentStrategy) {
    this.registry[name] = cls;
  }

  static create(provider: string): PaymentStrategy {
    switch (provider) {
      case 'stripe':
        return new StripeStrategy(process.env.STRIPE_KEY!);
      case 'paypal':
        return new PayPalStrategy(
          process.env.PAYPAL_CLIENT_ID!,
          process.env.PAYPAL_SECRET!
        );
      default:
        throw new Error(\`Unknown payment provider: \${provider}\`);
    }
  }
}

class PaymentService {
  private strategy: PaymentStrategy;

  constructor(provider = process.env.PAYMENT_PROVIDER || 'stripe') {
    this.strategy = PaymentStrategyFactory.create(provider);
  }

  switchProvider(provider: string): void {
    this.strategy = PaymentStrategyFactory.create(provider);
  }

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    return this.strategy.charge(amount, currency);
  }
}

const payments = new PaymentService('stripe');
const result = await payments.processPayment(99.99, 'USD');
console.log(result); // { transactionId: 'pi_...', status: 'success', provider: 'stripe' }

// Switch to PayPal at runtime
payments.switchProvider('paypal');
const result2 = await payments.processPayment(49.99, 'EUR');`,
      explanation:
        'Factory creates the correct Strategy based on configuration. PaymentService depends only on the PaymentStrategy interface. Adding a new provider = new Strategy class + one case in the factory. Zero changes to PaymentService.',
    },
    {
      title: 'Observer — Order Event System',
      code: `interface OrderPlacedEvent {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
}

interface OrderEventHandler {
  handle(event: OrderPlacedEvent): Promise<void>;
}

class EmailConfirmationHandler implements OrderEventHandler {
  async handle(event: OrderPlacedEvent) {
    console.log(\`[Email] Sending confirmation for order \${event.orderId}\`);
  }
}

class InventoryDeductionHandler implements OrderEventHandler {
  async handle(event: OrderPlacedEvent) {
    for (const item of event.items) {
      console.log(\`[Inventory] Deducting \${item.quantity} of product \${item.productId}\`);
    }
  }
}

class AnalyticsHandler implements OrderEventHandler {
  async handle(event: OrderPlacedEvent) {
    console.log(\`[Analytics] Recording order value $\${event.total}\`);
  }
}

class OrderEventBus {
  private handlers: Map<string, OrderEventHandler[]> = new Map();

  subscribe(event: string, handler: OrderEventHandler): void {
    const existing = this.handlers.get(event) ?? [];
    this.handlers.set(event, [...existing, handler]);
  }

  unsubscribe(event: string, handler: OrderEventHandler): void {
    const existing = this.handlers.get(event) ?? [];
    this.handlers.set(event, existing.filter(h => h !== handler));
  }

  async emit(event: string, data: OrderPlacedEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event) ?? [];
    // Use allSettled so one failing handler does not block others
    await Promise.allSettled(eventHandlers.map(h => h.handle(data)));
  }
}

class OrderService {
  constructor(private eventBus: OrderEventBus) {}

  async placeOrder(data: { userId: string; items: any[] }): Promise<string> {
    const orderId = 'ORD-' + Date.now();
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Emit event — OrderService does not know who handles it
    await this.eventBus.emit('order.placed', {
      orderId, userId: data.userId, items: data.items, total,
    });

    return orderId;
  }
}

const bus = new OrderEventBus();
bus.subscribe('order.placed', new EmailConfirmationHandler());
bus.subscribe('order.placed', new InventoryDeductionHandler());
bus.subscribe('order.placed', new AnalyticsHandler());

const orderService = new OrderService(bus);
const orderId = await orderService.placeOrder({
  userId: 'user-42',
  items: [{ productId: 'p1', quantity: 2, price: 29.99 }],
});
// All three handlers run concurrently`,
      explanation:
        'OrderService emits events without knowing about EmailService, InventoryService, or AnalyticsService. Adding a new reaction means subscribing a new handler — zero changes to OrderService. Promise.allSettled ensures one failing handler does not prevent others from running.',
    },
    {
      title: 'Decorator — Composable HTTP Middleware',
      code: `import { Request, Response } from 'express';

type Handler = (req: Request, res: Response) => Promise<void>;
type Middleware = (handler: Handler) => Handler;

// Core handler — no cross-cutting concerns
const getUserHandler: Handler = async (req, res) => {
  const user = { id: req.params.id, name: 'Alice' };
  res.json(user);
};

// Auth decorator
const withAuth: Middleware = (handler) => async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  await handler(req, res);
};

// Logging decorator
const withLogging: Middleware = (handler) => async (req, res) => {
  const start = Date.now();
  console.log(\`--> \${req.method} \${req.path}\`);
  await handler(req, res);
  console.log(\`<-- \${req.method} \${req.path} [\${Date.now() - start}ms]\`);
};

// Caching decorator
const withCache = (ttlSeconds: number): Middleware => (handler) => {
  const cache = new Map<string, { data: any; expiresAt: number }>();
  return async (req, res) => {
    const cacheKey = req.path;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json({ ...cached.data, _fromCache: true });
    }
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      cache.set(cacheKey, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
      return originalJson(data);
    };
    await handler(req, res);
  };
};

// Compose decorators
function compose(...middlewares: Middleware[]) {
  return (handler: Handler): Handler =>
    middlewares.reduceRight((h, mw) => mw(h), handler);
}

// Apply: withLogging --> withAuth --> withCache --> handler
const decoratedHandler = compose(
  withLogging,
  withAuth,
  withCache(60)
)(getUserHandler);

app.get('/users/:id', (req, res) => decoratedHandler(req, res));

// Adding error handling later = new decorator, zero changes to existing ones
const withErrorHandling: Middleware = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};`,
      explanation:
        'Each decorator wraps the next, adding one responsibility. The core handler has no cross-cutting concerns. Adding retry logic, rate limiting, or metrics means adding a new decorator function — zero changes to existing decorators or the core handler.',
    },
    {
      title: 'Repository Pattern — Testable Domain Service',
      code: `interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'cancelled';
  total: number;
  createdAt: Date;
}

interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  save(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
  updateStatus(id: string, status: Order['status']): Promise<Order>;
  findPendingOlderThan(minutes: number): Promise<Order[]>;
}

// Production: Prisma implementation
class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }
  async findByUserId(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }
  async save(data: Omit<Order, 'id' | 'createdAt'>) {
    return this.prisma.order.create({ data });
  }
  async updateStatus(id: string, status: Order['status']) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }
  async findPendingOlderThan(minutes: number) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.prisma.order.findMany({
      where: { status: 'pending', createdAt: { lt: cutoff } },
    });
  }
}

// Test: in-memory implementation — NO database needed
class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>();

  async findById(id: string) { return this.orders.get(id) ?? null; }
  async findByUserId(userId: string) {
    return [...this.orders.values()].filter(o => o.userId === userId);
  }
  async save(data: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const order: Order = { ...data, id: crypto.randomUUID(), createdAt: new Date() };
    this.orders.set(order.id, order);
    return order;
  }
  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error('Order not found');
    const updated = { ...order, status };
    this.orders.set(id, updated);
    return updated;
  }
  async findPendingOlderThan(minutes: number) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return [...this.orders.values()].filter(
      o => o.status === 'pending' && o.createdAt < cutoff
    );
  }
}

// Business service — zero database knowledge
class OrderFulfillmentService {
  constructor(private repo: OrderRepository) {}

  async cancelStaleOrders(): Promise<number> {
    const stale = await this.repo.findPendingOlderThan(30);
    await Promise.all(stale.map(o => this.repo.updateStatus(o.id, 'cancelled')));
    return stale.length;
  }
}

// Test without database:
const testRepo = new InMemoryOrderRepository();
const service = new OrderFulfillmentService(testRepo);

const order = await testRepo.save({ userId: 'u1', status: 'pending', total: 0 });
// Backdate the order for testing
testRepo['orders'].get(order.id)!.createdAt = new Date(Date.now() - 40 * 60000);

const cancelled = await service.cancelStaleOrders();
console.log(cancelled); // 1`,
      explanation:
        'OrderFulfillmentService has zero imports from Prisma or any database library. Tests run in milliseconds with InMemoryOrderRepository. Switching from Prisma to TypeORM means writing a new repository implementation — zero changes to business logic.',
    },
  ],

  commonMistakes: [
    "Over-applying patterns — adding a Factory for objects that are always the same type, wrapping a 3-line function in Strategy, or making every class a Singleton. Patterns add complexity; only use them when you can name the specific problem they solve.",
    "Singleton global state bleeding between tests — if your Singleton holds mutable state, tests that share the instance can interfere. Always reset or provide a test instance mechanism.",
    "Observer memory leaks — subscribing to events without unsubscribing when objects are destroyed. In browser code: always removeEventListener on component unmount. In Node: EventEmitter warnings about too many listeners often indicate this pattern.",
    "Confusing Decorator with Inheritance — Decorator adds behavior to instances at runtime; inheritance adds behavior to all instances of a class at definition time. Decorators are more flexible but harder to debug when deeply nested.",
    "Making Repository too thin (CRUD passthrough) or too fat (business logic in queries) — the Repository should express domain queries (findPendingOrders, findHighValueCustomers) not generic findAll(filters).",
    "Using Factory when you only ever have one implementation — if there is only one concrete type, a factory is pure overhead. Add the factory when the second implementation appears.",
    "Forgetting that Observer events are asynchronous — if handler A must run before handler B, Observer is the wrong pattern. Use a pipeline or Chain of Responsibility instead.",
    "Applying the Command pattern to every function call — Command is warranted when you need undo/redo, queuing, or audit logs. A function that runs once and needs none of those things should just be a function.",
  ],

  interviewQuestions: [
    {
      question: 'What is the Observer pattern and where does it appear in technologies you use daily?',
      difficulty: 'intermediate',
      answer:
        "Observer defines a one-to-many dependency where multiple objects (observers/subscribers) are automatically notified when one object (subject/publisher) changes state. It decouples publishers from subscribers — the publisher does not know who is listening. Real examples: Node.js EventEmitter is the pure Observer implementation; DOM's addEventListener; React's useState + useEffect (components observe state); Redux (components subscribe to store); Kafka and RabbitMQ (Observer at distributed scale). The key insight: Observer appears wherever you need to notify multiple parties about a state change without tightly coupling the notifier to the receivers.",
      followUp: [
        'What are the risks of overusing Observer patterns in a large codebase?',
        'How is Observer different from a simple callback function?',
      ],
      tip: "Name specific technologies (Node EventEmitter, React, Kafka) to demonstrate you have seen this in the real world, not just in textbooks.",
    },
    {
      question: 'When would you choose Strategy pattern over simple if/else or switch statements?',
      difficulty: 'intermediate',
      answer:
        "Use Strategy when: (1) You have 3+ algorithms that solve the same problem and the number may grow. (2) The algorithm selection happens at runtime based on configuration or user choice. (3) Adding a new algorithm without Strategy would require modifying and retesting existing code (OCP violation). Stick with if/else when: you have only 2-3 algorithms that will never change, or the branching is so simple that the abstraction layer would obscure rather than clarify. A payment system with Stripe, PayPal, and Crypto — and the potential for more providers — is an ideal Strategy use case.",
      tip: "Frame the answer around 'when does the switch statement become painful?' — at 3-4 cases with growth potential, extract a Strategy.",
    },
    {
      question: 'What problem does the Repository pattern solve? How does it improve testability?',
      difficulty: 'intermediate',
      answer:
        "Repository separates business logic from data access. Without it, business service classes contain direct SQL queries or ORM calls — making them impossible to test without a real database (slow, requiring schema setup and teardown), and tightly coupled to the specific database technology. With Repository: define an interface for the queries your domain needs (findByUserId, findPendingOrders). Write a production implementation using Prisma/SQL. Write an InMemoryRepository implementing the same interface with simple Map operations. In tests, inject the in-memory version — tests run in milliseconds with no I/O.",
      followUp: ['How granular should a Repository be? One per entity or per aggregate root?'],
      tip: 'Lead with testability — it is the most tangible, immediate benefit.',
    },
    {
      question: 'What is the difference between Decorator and Adapter patterns?',
      difficulty: 'advanced',
      answer:
        "Decorator and Adapter both wrap an object, but they serve different purposes. Adapter changes an interface — it makes an incompatible interface match what the caller expects (StripeAdapter makes Stripe's API look like your PaymentProcessor interface). Decorator enhances an existing compatible interface — it wraps an object and adds behavior while preserving the same interface (LoggingDecorator wraps UserRepository and adds logging, but still implements UserRepository). The key test: after wrapping, is the interface the same (Decorator) or different (Adapter)?",
      tip: "The 'same interface' test is the cleanest way to distinguish them in an interview. Demonstrate with a concrete example of each.",
    },
    {
      question: 'Why is Singleton considered problematic? When is it still appropriate?',
      difficulty: 'intermediate',
      answer:
        "Singleton problems: (1) Global mutable state — any code can modify it, creating hidden dependencies. (2) Testing difficulty — tests share the same instance and can contaminate each other; you cannot inject a mock. (3) Premature assumption — 'we will only ever need one' often turns out wrong. (4) Thread safety — in multi-threaded environments, lazy initialization races require locks. Still appropriate: read-only configuration objects, connection pools where you explicitly want one pool, logging infrastructure. The key question: is this a resource where multiple instances would cause a real problem, or am I being lazy and making it global for convenience?",
      tip: "Name the testing problem specifically — 'tests that share state interfere with each other and produce non-deterministic results.'",
    },
    {
      question: 'Describe the Builder pattern and give an example where it is clearly better than a constructor.',
      difficulty: 'beginner',
      answer:
        "Builder separates the construction of a complex object from its representation, allowing step-by-step creation with a readable fluent API. A constructor becomes painful when it has 5+ parameters, many are optional, and argument order is non-obvious. Compare: new User('Alice', null, null, 'admin', true, null, null) — 7 parameters, unclear what each null means. With Builder: UserBuilder.name('Alice').role('admin').active(true).build() — each step is explicit and readable. SQL query builders (Knex, Prisma) are the canonical real-world example: .select().from().where().orderBy().limit().build() — each step is optional and composable.",
      tip: "Use a real query builder (Knex or Prisma) as your example — every backend developer knows them and they make the pattern immediately concrete.",
    },
  ],

  exercises: [
    {
      id: 'design-patterns-ex-1',
      title: 'Implement a Plugin System Using Factory + Observer',
      description:
        "Build a plugin system for a file processing pipeline. Requirements: (1) A PluginFactory that creates parsers by file type: 'csv', 'json', 'xml'. (2) Each plugin implements a Parser interface with parse(content: string): Record<string, any>[]. (3) A ProcessingPipeline that accepts a file, detects its type, creates the right parser via factory, parses it, then emits a 'file.processed' event with the result. (4) Multiple handlers subscribe to 'file.processed' — implement a DatabaseSaver and a LogHandler. Test the complete flow.",
      starterCode: `interface Parser {
  parse(content: string): Record<string, any>[];
}

interface ProcessedFileEvent {
  fileName: string;
  recordCount: number;
  records: Record<string, any>[];
}

interface FileProcessedHandler {
  handle(event: ProcessedFileEvent): Promise<void>;
}

// TODO: Implement
class ParserFactory {
  static create(fileType: 'csv' | 'json' | 'xml'): Parser {
    // return correct parser
  }
}

class CSVParser implements Parser { /* parse CSV */ }
class JSONParser implements Parser { /* parse JSON */ }

class ProcessingPipeline {
  // subscribe(handler), process(fileName, content)
}`,
      solution: `class CSVParser implements Parser {
  parse(content: string): Record<string, any>[] {
    const lines = content.trim().split('\\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, h, i) => ({ ...obj, [h.trim()]: values[i]?.trim() }), {});
    });
  }
}

class JSONParser implements Parser {
  parse(content: string): Record<string, any>[] {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  }
}

class XMLParser implements Parser {
  parse(content: string): Record<string, any>[] {
    const matches = [...content.matchAll(/<(\\w+)>(.*?)<\\/\\1>/g)];
    const record: Record<string, any> = {};
    matches.forEach(m => { record[m[1]] = m[2]; });
    return [record];
  }
}

class ParserFactory {
  static create(fileType: string): Parser {
    switch (fileType.toLowerCase()) {
      case 'csv':  return new CSVParser();
      case 'json': return new JSONParser();
      case 'xml':  return new XMLParser();
      default: throw new Error(\`Unsupported file type: \${fileType}\`);
    }
  }
}

class DatabaseSaverHandler implements FileProcessedHandler {
  public saved: ProcessedFileEvent[] = [];
  async handle(event: ProcessedFileEvent) {
    console.log(\`[DB] Saving \${event.recordCount} records from \${event.fileName}\`);
    this.saved.push(event);
  }
}

class LogHandler implements FileProcessedHandler {
  async handle(event: ProcessedFileEvent) {
    console.log(\`[Log] Processed \${event.fileName}: \${event.recordCount} records\`);
  }
}

class ProcessingPipeline {
  private handlers: FileProcessedHandler[] = [];

  subscribe(handler: FileProcessedHandler): void {
    this.handlers.push(handler);
  }

  async process(fileName: string, content: string): Promise<void> {
    const extension = fileName.split('.').pop() || 'json';
    const parser = ParserFactory.create(extension);
    const records = parser.parse(content);

    const event: ProcessedFileEvent = { fileName, recordCount: records.length, records };
    await Promise.allSettled(this.handlers.map(h => h.handle(event)));
  }
}

// Test
const pipeline = new ProcessingPipeline();
const dbSaver = new DatabaseSaverHandler();
pipeline.subscribe(dbSaver);
pipeline.subscribe(new LogHandler());

await pipeline.process('users.csv', 'name,age\\nAlice,30\\nBob,25');
await pipeline.process('config.json', '[{"key":"debug","value":"true"}]');

console.log(dbSaver.saved.length); // 2`,
      hints: [
        'Detect file type from the extension: fileName.split(".").pop() gives you the extension.',
        'Use Promise.allSettled (not Promise.all) so one failing handler does not prevent others from running.',
        'The Factory switch statement is fine here — to make it fully Open/Closed, you could use a registry Map that parsers register themselves into.',
      ],
    },
    {
      id: 'design-patterns-ex-2',
      title: 'Implement Undo/Redo Using the Command Pattern',
      description:
        "Build an undo/redo system for a text editor. Commands: InsertCommand(position, text), DeleteCommand(position, length). The editor state is a string. Each command has execute(state) which returns the new state and undo(state) which reverses it. CommandHistory tracks executed commands and supports undo() and redo().",
      starterCode: `interface TextCommand {
  execute(state: string): string;  // returns new state
  undo(state: string): string;     // returns previous state
}

class CommandHistory {
  private history: TextCommand[] = [];
  private redoStack: TextCommand[] = [];
  private currentState: string;

  constructor(initialState: string) {
    this.currentState = initialState;
  }

  execute(command: TextCommand): void {
    // TODO: apply command, clear redo stack
  }

  undo(): string | null {
    // TODO: undo last command
  }

  redo(): string | null {
    // TODO: redo last undone command
  }

  getState(): string { return this.currentState; }
}

class InsertCommand implements TextCommand {
  // TODO
}

class DeleteCommand implements TextCommand {
  // TODO
}`,
      solution: `class InsertCommand implements TextCommand {
  constructor(
    private position: number,
    private text: string
  ) {}

  execute(state: string): string {
    return state.slice(0, this.position) + this.text + state.slice(this.position);
  }

  undo(state: string): string {
    return state.slice(0, this.position) + state.slice(this.position + this.text.length);
  }
}

class DeleteCommand implements TextCommand {
  private deletedText: string = '';

  constructor(
    private position: number,
    private length: number
  ) {}

  execute(state: string): string {
    this.deletedText = state.slice(this.position, this.position + this.length);
    return state.slice(0, this.position) + state.slice(this.position + this.length);
  }

  undo(state: string): string {
    return state.slice(0, this.position) + this.deletedText + state.slice(this.position);
  }
}

class CommandHistory {
  private history: TextCommand[] = [];
  private redoStack: TextCommand[] = [];
  private currentState: string;

  constructor(initialState: string) {
    this.currentState = initialState;
  }

  execute(command: TextCommand): void {
    this.currentState = command.execute(this.currentState);
    this.history.push(command);
    this.redoStack = []; // clear redo stack on new command
  }

  undo(): string | null {
    const command = this.history.pop();
    if (!command) return null;
    this.currentState = command.undo(this.currentState);
    this.redoStack.push(command);
    return this.currentState;
  }

  redo(): string | null {
    const command = this.redoStack.pop();
    if (!command) return null;
    this.currentState = command.execute(this.currentState);
    this.history.push(command);
    return this.currentState;
  }

  getState(): string { return this.currentState; }
}

// Test
const history = new CommandHistory('Hello World');

history.execute(new InsertCommand(5, ','));
console.log(history.getState()); // "Hello, World"

history.execute(new DeleteCommand(7, 5));
console.log(history.getState()); // "Hello, "

history.undo();
console.log(history.getState()); // "Hello, World"

history.undo();
console.log(history.getState()); // "Hello World"

history.redo();
console.log(history.getState()); // "Hello, World"`,
      hints: [
        "DeleteCommand must capture the deleted text during execute() — store it as an instance variable. Without capturing it, undo() cannot know what to re-insert.",
        "Clearing the redo stack when a new command is executed is correct: if you undo 3 steps then make a new edit, you can't redo the original path.",
        'The undo and redo stacks are mirrors: undo() pops from history and pushes to redo. redo() pops from redo and pushes to history.',
      ],
    },
  ],

  keyTakeaways: [
    'Design patterns are solutions to recurring problems — not algorithms to memorize, but conceptual tools to reach for when you recognize a specific problem class. Know the problem each pattern solves before learning its implementation.',
    'Singleton: one instance globally. Use for shared expensive resources (connection pools, config). Avoid for anything mutable or anything you need to test with mocks. Prefer dependency injection.',
    'Factory: encapsulates object creation logic and decouples callers from concrete types. Essential when the type to create varies by runtime configuration.',
    'Builder: step-by-step construction of complex objects. The right tool for objects with many optional parameters, yielding readable fluent APIs.',
    'Observer: one-to-many notification without coupling. The pattern behind every event system, from DOM events to Kafka. Watch for memory leaks from unremoved observers.',
    'Strategy: swappable algorithms behind a common interface. Eliminates giant if/else blocks that violate OCP. Fundamental to payment providers, auth strategies, compression.',
    'Command: requests as objects. Enables undo/redo, queuing, audit logging, and retry. The pattern behind task queues, version control, and text editors.',
    'Adapter: translate incompatible interfaces. The pattern for integrating third-party libraries without polluting your codebase with their specific API shapes.',
    'Decorator: add behavior by wrapping, not by modifying. Express middleware, React HOCs, Python decorators, and Spring annotations are all decorator implementations.',
    'Repository: abstract data access behind a domain-oriented interface. The key enabler of testable business logic and database-agnostic domain services.',
    'Patterns add complexity. The highest skill is knowing when NOT to apply a pattern — when simpler code is clearer and maintainable without the abstraction.',
  ],
};
