import type { Lesson } from '@/types';

export const microservicesLesson: Lesson = {
  id: 'microservices-architecture',
  slug: 'microservices-architecture',
  title: 'Microservices Architecture',
  description:
    'Learn how to design, decompose, and operate systems built from independently deployable services — including service boundaries, communication patterns, deployment strategies, and the real operational costs that come with microservices.',
  category: 'Architecture',
  order: 5,
  difficulty: 'advanced',
  estimatedTime: 50,
  prevLesson: 'monolith-architecture',
  nextLesson: 'apis',

  content: `# Microservices Architecture

## What Are Microservices?

A microservice is a small, independently deployable service that does **one thing well**. The emphasis is on two words: **one thing** and **independently deployable**.

- **One thing**: A service owns a single, clearly bounded domain responsibility — e.g., user accounts, payments, notifications, inventory.
- **Independently deployable**: You can deploy, scale, and restart the Payments service without touching the Orders service.

This is the antithesis of a monolith, where all features live in one codebase, one deployment, and one database.

\`\`\`
Monolith                           Microservices
─────────────────────              ──────────────────────────────────────────
┌──────────────────┐               ┌───────────┐  ┌────────────┐  ┌─────────┐
│  Users           │               │  Users    │  │  Orders    │  │ Payments│
│  Orders          │               │  Service  │  │  Service   │  │ Service │
│  Payments        │               └─────┬─────┘  └─────┬──────┘  └────┬────┘
│  Inventory       │                     │               │              │
│  Notifications   │               ┌─────▼───────────────▼──────────────▼────┐
└──────────────────┘               │              Message Bus / API           │
         │                         └──────────────────────────────────────────┘
    One database                   Each service has its own database
\`\`\`

---

## Why Microservices Exist — The Problem They Solve

Imagine a monolith that has grown for 5 years. It has 400 files. 3 teams work on it.

- Team A wants to deploy a payment fix on Friday. But Team B's half-finished feature is already in the branch. Now Team A has to wait or ship Team B's broken code.
- The entire app must be deployed to fix one bug in one screen.
- The checkout flow gets 100x more traffic during Black Friday. You must scale the entire monolith — including the admin dashboard nobody uses.
- One unhandled exception in the image resize feature crashes the entire app, taking payments down with it.

Microservices were invented to solve these exact problems.

---

## Service Boundaries — The Hardest Part

Splitting a system into microservices is easy. Splitting it *correctly* is extremely hard.

### Domain-Driven Design (DDD) — The Right Mental Model

The correct way to define a service boundary is by **business domain**, not technical layers.

**Wrong split** (by technical layer):
- Database service
- API service
- Frontend service

**Right split** (by domain):
- User service (owns user identity, authentication, profiles)
- Order service (owns order lifecycle: placed → confirmed → shipped → delivered)
- Payment service (owns payment initiation, gateway communication, refunds)
- Inventory service (owns product catalog, stock levels, reservations)
- Notification service (owns emails, SMS, push notifications)

### Bounded Context

Each service has a **bounded context** — a clear boundary within which a specific domain model applies. The word "Order" inside the Order service means something different from "Order" inside the Inventory service. That is fine. Each service defines its own model for what it owns.

### Practical Rules for Service Boundaries

1. **Single Responsibility**: A service should have one reason to change. If a change to the notification format also requires changing the user service, your boundaries are wrong.
2. **Data Ownership**: Each service owns its own data. No two services share a database table. If Service A needs data from Service B, it asks Service B — it does not query Service B's database directly.
3. **Team Ownership**: Ideally, one team owns one (or a few related) services end to end.
4. **Deployability**: If deploying Service A always requires deploying Service B, they should probably be one service.

---

## Communication Between Services

This is where most microservice designs go wrong.

### Synchronous Communication (Request/Response)

**REST over HTTP**
- Service A calls Service B's API and waits for the response.
- Simple to implement, familiar to all developers.
- Problem: If Service B is slow or down, Service A is also affected. This is **tight coupling in time**.

**gRPC**
- Uses Protocol Buffers (binary format), HTTP/2, strongly typed contracts.
- 5–10x faster than REST for internal calls.
- Supports bidirectional streaming.
- Harder to debug than REST.

\`\`\`
Synchronous (REST/gRPC):

  Order Service         Payment Service
      │                      │
      │── POST /payments ──▶ │
      │                      │ (processes payment)
      │ ◀── 200 OK ──────── │
      │                      │
  (Order service blocks and waits the entire time)
\`\`\`

**When to use synchronous:**
- The response is needed immediately to proceed (e.g., verifying payment before confirming order)
- Simple reads (e.g., fetching user profile to render a page)

**When NOT to use synchronous:**
- Long-running operations (video encoding, PDF generation, email sending)
- Operations where failure of downstream service should not block the caller
- Fan-out scenarios where one event triggers many independent actions

### Asynchronous Communication (Event-Driven)

Service A publishes an event to a message broker. Service B (and C, D) subscribe and process it independently. Service A does not wait.

\`\`\`
Asynchronous (Message Queue):

  Order Service         Message Broker         Multiple Consumers
      │                 (Kafka/RabbitMQ)            │         │
      │── "order.placed" event ──▶ │                │         │
      │                            │── event ──▶ Email Svc   │
      │ (immediately returns)      │── event ──────────▶ Inventory Svc
      │                            │── event ───────────────────▶ Analytics Svc
\`\`\`

**When to use asynchronous:**
- One event triggers multiple independent actions (order placed → send email + update inventory + log analytics)
- Operations where failure should not block the user
- Rate-limiting processing (batch jobs, ETL pipelines)
- Decoupling services so they evolve independently

**Common message brokers:** Kafka (high throughput, log-based, replay), RabbitMQ (traditional queuing, routing), AWS SQS (managed, simple).

---

## Deployment

Each microservice has its own:
- **Codebase** (separate Git repository)
- **CI/CD pipeline** (deploy independently)
- **Database** (polyglot persistence — use the right DB for the job)
- **Container** (Docker image)
- **Scaling rules** (scale Payment service 10x during Black Friday, not the whole system)

\`\`\`
Service          Database Choice          Reason
─────────────    ─────────────────────    ───────────────────────────────
User Service     PostgreSQL               Relational, ACID, user data
Product Service  MongoDB                  Flexible schema, rich catalog data
Search Service   Elasticsearch            Full-text search, faceting
Session Service  Redis                    Fast key-value, TTL expiry
Analytics Svc    ClickHouse / BigQuery    Columnar, OLAP queries
\`\`\`

---

## Scaling

This is one of the biggest wins of microservices.

During a traffic surge, you identify which service is the bottleneck and scale only that service. In a monolith, you must scale everything — even the parts that have zero load.

**Example: E-commerce Black Friday**
- Product browsing traffic: 50x normal → Scale Product Service to 50 pods
- Checkout traffic: 10x normal → Scale Order + Payment Service to 10 pods
- Admin dashboard: no change → remains at 1 pod
- Email notifications: processing queue lag → Scale Notification Service by 5x

In a monolith, all of these would force you to scale the entire application 50x.

---

## Service Discovery

When Service A needs to call Service B, how does it know Service B's IP address? Service B's pods restart constantly. IPs change. New instances spin up and old ones die.

**The Problem:**
\`\`\`
Order Service wants to call Payment Service.
Payment Service is running on:
  - 10.0.1.4:8080  (pod 1, healthy)
  - 10.0.1.7:8080  (pod 2, just crashed — unhealthy)
  - 10.0.1.9:8080  (pod 3, healthy, just started 2 seconds ago)

How does Order Service know which IP to call?
\`\`\`

**Solution 1: DNS-Based Discovery**
Each service registers with a DNS server. Other services use the service name (e.g., \`payment-service\`), not an IP. The DNS resolves to a healthy IP automatically.

**Solution 2: Consul / etcd**
A dedicated service registry. Services register themselves on startup, send heartbeats, and deregister on shutdown. Callers query the registry to get healthy endpoints.

**Solution 3: Kubernetes (Most Common Today)**
Kubernetes provides a built-in service discovery mechanism. Every service gets a stable DNS name (e.g., \`payment-service.default.svc.cluster.local\`). Kubernetes automatically routes to healthy pods.

\`\`\`
Service Discovery (Kubernetes):

  Order Service                   Kubernetes DNS
      │                                │
      │── "where is payment-service?" ─▶│
      │                                │ (looks up healthy pod IPs)
      │ ◀── "10.0.1.4:8080" ──────── │
      │                                │
      │── POST /payments ─────────────────────────▶ Payment Pod
\`\`\`

---

## Advantages of Microservices

1. **Independent Scaling**: Scale only the services that need it. Cost-efficient at large scale.
2. **Independent Deployment**: Team A ships their service without coordinating with Team B. Faster release cycles.
3. **Technology Diversity**: Use Python for ML services, Go for high-throughput APIs, Node.js for real-time features. Use the right tool.
4. **Fault Isolation**: A crash in the Notification service does not bring down Payments. Circuit breakers can isolate failures.
5. **Team Autonomy**: Each team owns their service end-to-end — from code to database to deployment.
6. **Easier to Understand**: Each service is small and focused. A new developer can understand the Order service in a day.
7. **Replaceability**: Rewrite the Inventory service in Go if the Python version is too slow. Other services don't care.

---

## Disadvantages of Microservices

1. **Operational Complexity**: Instead of deploying 1 app, you deploy 20+ services. You need CI/CD pipelines, container orchestration (Kubernetes), service meshes, and distributed tracing for each.
2. **Network Latency**: In-process calls (nanoseconds) become network calls (milliseconds). At scale, this adds up.
3. **Distributed Transactions**: ACID transactions across multiple databases are extremely hard. You must use eventual consistency patterns (Saga, 2-Phase Commit).
4. **Data Consistency**: When Service A updates its DB and publishes an event that Service B fails to process, your data is inconsistent. You must handle this explicitly.
5. **Testing Complexity**: Testing a single service is easy. Testing interactions between 20 services is hard. You need contract testing, integration test environments.
6. **Debugging**: A single request touches 6 services. If it fails, where? Distributed tracing (Jaeger, Zipkin) is essential but adds infrastructure.
7. **Service Mesh Overhead**: Managing cross-cutting concerns (retries, circuit breaking, mTLS, tracing) across services requires a service mesh (Istio, Linkerd) — a significant operational burden.

---

## Challenges in Practice

### Data Consistency — The Hardest Problem

**Saga Pattern**: Break a distributed transaction into a series of local transactions. Each service publishes an event. If any step fails, compensating transactions undo the previous steps.

\`\`\`
Order Saga:
1. Order Service creates order (status: PENDING)
2. Payment Service charges card → publishes "payment.succeeded"
3. Inventory Service reserves stock → publishes "inventory.reserved"
4. Order Service marks order CONFIRMED

If step 3 fails:
3a. Inventory Service publishes "inventory.failed"
3b. Payment Service refunds the charge (compensating transaction)
3c. Order Service marks order CANCELLED
\`\`\`

### Observability
You cannot use a single log file. You need:
- **Centralized logging** (ELK Stack, Datadog)
- **Distributed tracing** (each request gets a trace ID that flows through all services)
- **Metrics** (Prometheus + Grafana per service)
- **Alerting** (PagerDuty, OpsGenie)

---

## Real World Examples

**Netflix**: 700+ microservices. Each team owns their services independently. Famous for chaos engineering (Chaos Monkey) to test fault tolerance.

**Uber**: Originally a monolith. Rebuilt as microservices — Trips, Drivers, Payments, Surge Pricing, Notifications are all separate services. During a surge, only the Surge Pricing service scales.

**Amazon**: Jeff Bezos's famous "API Mandate" in 2002 — all teams must expose their data through service interfaces only. No internal data coupling. This is what became Amazon Web Services.

---

## Migration: Monolith to Microservices (Strangler Fig Pattern)

You do NOT rewrite the entire monolith. That is how projects fail.

The **Strangler Fig Pattern** extracts services one at a time:

\`\`\`
Phase 1: Identify the service to extract (start with least coupled)
──────────────────────────────────────────────────────────────────
Monolith handles all traffic.

Phase 2: Build the new service alongside the monolith
──────────────────────────────────────────────────────────────────
Route /notifications/* → New Notification Microservice
Route everything else → Monolith (unchanged)

Phase 3: Verify the new service works. Remove code from monolith.
──────────────────────────────────────────────────────────────────
Monolith shrinks. New service grows.

Repeat for each domain until the monolith is gone (or small).
\`\`\`

**Order to extract services** (from least coupled to most):
1. Notification service (pure output, no shared data)
2. Search service (read-only, stateless)
3. Reporting/Analytics (read replicas, no writes)
4. User/Auth service
5. Core business domain (Orders, Payments) — last, hardest

---

## Monolith vs Microservices — When Each Wins

| Dimension | Monolith | Microservices |
|---|---|---|
| Team size | Small (1–10 devs) | Large (50+ devs, multiple teams) |
| Deployment frequency | Monthly | Daily/hourly per service |
| Scaling needs | Uniform load across features | Wildly unequal load between features |
| Development speed (early) | Fast — no distributed systems overhead | Slow — must set up infra first |
| Operational complexity | Low | Very high |
| Fault isolation | Low — one crash brings all down | High — failures are contained |
| Technology flexibility | None — one stack | High — each service chooses |
| Data model | Simple | Complex — distributed, eventual consistency |
| Best for | Startups, new products, small teams | Large orgs, high scale, many teams |
| Real examples | Basecamp, Shopify (hybrid), early Uber | Netflix, Amazon, Uber (current) |

**Rule of thumb**: Start with a monolith. Extract microservices when you have clear team ownership and scaling pain — not before.
`,

  codeExamples: [
    {
      title: 'Synchronous REST Communication Between Services',
      code: `// order-service/src/services/payment.client.ts
// The Order Service calls the Payment Service synchronously

import axios from 'axios';

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerId: string;
}

interface PaymentResponse {
  paymentId: string;
  status: 'success' | 'failed';
  transactionRef: string;
}

export class PaymentServiceClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    // In Kubernetes, this DNS name resolves to healthy Payment pods
    this.baseUrl = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:8080';
    this.timeout = 5000; // 5 seconds — never wait forever
  }

  async chargeCustomer(req: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post<PaymentResponse>(
        \`\${this.baseUrl}/api/v1/payments\`,
        req,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
            // Propagate the trace ID so distributed tracing works
            'X-Trace-ID': req.orderId,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        // Payment service timed out — do NOT assume failure
        // The payment might have succeeded — handle idempotency
        throw new Error('PAYMENT_TIMEOUT_AMBIGUOUS');
      }
      throw error;
    }
  }
}`,
      explanation:
        'This shows how one microservice calls another over HTTP. Notice the timeout (never wait indefinitely), the Kubernetes DNS name (not a hardcoded IP), and the careful error handling — a timeout does not mean failure, which is a critical distributed systems concern.',
    },
    {
      title: 'Asynchronous Event Publishing (Order Service)',
      code: `// order-service/src/events/publisher.ts
// After placing an order, publish an event — do NOT call other services directly

import { Kafka, Producer } from 'kafkajs';

interface OrderPlacedEvent {
  eventType: 'order.placed';
  eventId: string;        // unique event ID for deduplication
  occurredAt: string;     // ISO timestamp
  payload: {
    orderId: string;
    customerId: string;
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
    currency: string;
  };
}

export class EventPublisher {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'order-service',
      brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092'],
    });
    this.producer = kafka.producer();
  }

  async publishOrderPlaced(order: OrderPlacedEvent['payload']): Promise<void> {
    const event: OrderPlacedEvent = {
      eventType: 'order.placed',
      eventId: \`evt-\${Date.now()}-\${Math.random().toString(36).slice(2)}\`,
      occurredAt: new Date().toISOString(),
      payload: order,
    };

    await this.producer.send({
      topic: 'order-events',
      messages: [
        {
          // Use customerId as partition key — all events for one customer
          // go to the same partition, preserving order
          key: order.customerId,
          value: JSON.stringify(event),
        },
      ],
    });

    console.log(\`Published event: \${event.eventType} [\${event.eventId}]\`);
    // Order service is DONE — it does not wait for email, inventory, analytics
  }
}

// Consumers (separate services) listen independently:
// - notification-service: sends confirmation email
// - inventory-service: reserves stock
// - analytics-service: records the sale
// All of these happen asynchronously, in parallel, without Order Service knowing`,
      explanation:
        'This is event-driven microservices communication. The Order service publishes one event and is immediately done — it does not know or care about the email service, inventory service, or analytics service. They each consume the event independently. This is loose coupling at its best.',
    },
    {
      title: 'Saga Pattern — Distributed Transaction',
      code: `// order-service/src/sagas/create-order.saga.ts
// Coordinates a multi-step transaction across multiple services

type SagaStep = {
  name: string;
  execute: () => Promise<void>;
  compensate: () => Promise<void>; // undo if a later step fails
};

export class CreateOrderSaga {
  private completedSteps: SagaStep[] = [];

  async execute(orderData: {
    customerId: string;
    items: { productId: string; quantity: number }[];
    totalAmount: number;
  }): Promise<{ orderId: string }> {
    let orderId: string | null = null;
    let paymentId: string | null = null;

    const steps: SagaStep[] = [
      {
        name: 'CreateOrder',
        execute: async () => {
          orderId = await this.orderRepo.create({ ...orderData, status: 'PENDING' });
        },
        compensate: async () => {
          if (orderId) await this.orderRepo.updateStatus(orderId, 'CANCELLED');
        },
      },
      {
        name: 'ChargePayment',
        execute: async () => {
          const result = await this.paymentClient.charge({
            orderId: orderId!,
            amount: orderData.totalAmount,
            customerId: orderData.customerId,
          });
          paymentId = result.paymentId;
        },
        compensate: async () => {
          if (paymentId) await this.paymentClient.refund(paymentId);
        },
      },
      {
        name: 'ReserveInventory',
        execute: async () => {
          await this.inventoryClient.reserve({
            orderId: orderId!,
            items: orderData.items,
          });
        },
        compensate: async () => {
          if (orderId) await this.inventoryClient.release(orderId);
        },
      },
      {
        name: 'ConfirmOrder',
        execute: async () => {
          await this.orderRepo.updateStatus(orderId!, 'CONFIRMED');
        },
        compensate: async () => {
          if (orderId) await this.orderRepo.updateStatus(orderId, 'CANCELLED');
        },
      },
    ];

    for (const step of steps) {
      try {
        await step.execute();
        this.completedSteps.push(step);
      } catch (error) {
        console.error(\`Saga step '\${step.name}' failed. Running compensations...\`);
        // Run compensations in reverse order
        for (const completed of [...this.completedSteps].reverse()) {
          try {
            await completed.compensate();
          } catch (compensationError) {
            // Log — compensation failures need manual intervention
            console.error(\`Compensation failed for '\${completed.name}'\`, compensationError);
          }
        }
        throw new Error(\`Order creation failed at step: \${step.name}\`);
      }
    }

    return { orderId: orderId! };
  }
}`,
      explanation:
        'The Saga pattern solves distributed transactions without two-phase commit. Each step has an execute and a compensate (undo) action. If any step fails, all previous steps are compensated in reverse order — like a database rollback, but across multiple services and databases.',
    },
  ],

  commonMistakes: [
    'Starting with microservices for a new product with a small team — monolith first is almost always the right choice until you have clear scaling and ownership pain',
    'Sharing a database between two services — this destroys the independence that makes microservices valuable and creates hidden coupling',
    'Making every microservice call synchronous — this chains services together and means one slow service makes everything slow',
    'Defining service boundaries by technical layer (frontend service, API service, DB service) instead of by business domain',
    'Not implementing circuit breakers — without them, a slow downstream service will exhaust all connection pools upstream and cause a cascade failure',
    'Skipping distributed tracing — once you have 10+ services, debugging a failing request without trace IDs is nearly impossible',
    'Doing a "big bang" rewrite of the monolith into microservices instead of the Strangler Fig Pattern — big rewrites almost always fail',
    'Ignoring data consistency — assuming that because you published an event, every consumer processed it successfully',
    'Creating too many tiny services (nanoservices) — a service for each database table is not microservices, it is chaos',
    'Not planning for eventual consistency — developers used to monoliths expect immediate consistency and are surprised when it does not exist',
  ],

  interviewQuestions: [
    {
      question: 'How do you decide where to draw the boundary between two microservices?',
      answer:
        'Service boundaries should align with business domains (Domain-Driven Design bounded contexts). A service should have a single reason to change. Practical rules: (1) Does one team own this end-to-end? (2) Does this service have its own data that no one else should write to directly? (3) Can this service be deployed independently without requiring another service to change simultaneously? If you constantly have to deploy two services together, they should probably be one service. Start with coarser-grained services and split only when you have a real reason.',
      difficulty: 'advanced',
      followUp: [
        'What is a bounded context in DDD?',
        'How would you handle a situation where two services need to share data?',
      ],
      tip: 'Mention DDD and bounded contexts. Interviewers love seeing that you understand this is about business domains, not technical layers.',
    },
    {
      question: 'How do microservices handle a transaction that spans multiple services?',
      answer:
        'There are two main approaches. (1) Saga Pattern: Break the transaction into a sequence of local transactions. Each step publishes an event. If any step fails, compensating transactions undo the previous steps. (2) Two-Phase Commit (2PC): A coordinator asks all services to "prepare", then "commit". This is generally avoided in microservices because it requires all services to be available simultaneously and introduces a distributed lock. The Saga pattern is preferred because it is resilient to partial failures and does not require synchronous coordination. The trade-off is that you must design compensating transactions carefully.',
      difficulty: 'advanced',
      followUp: [
        'What is the difference between choreography-based and orchestration-based sagas?',
        'How do you handle a failed compensating transaction?',
      ],
      tip: 'Draw the saga flow on a whiteboard if you can. Mention that compensation failures need human intervention or a dead-letter queue.',
    },
    {
      question: 'When should you NOT use microservices?',
      answer:
        'Microservices are the wrong choice when: (1) You have a small team — the operational overhead is not worth the benefit. (2) You are building a new product — you do not yet know where the service boundaries should be; premature decomposition leads to wrong boundaries that are painful to change. (3) Your team lacks DevOps maturity — microservices require CI/CD pipelines, container orchestration, observability infrastructure. Without these, you will spend more time fighting infrastructure than building features. (4) Your domain does not have distinct, separately scalable components. Start with a well-structured monolith and extract services when you have real pain.',
      difficulty: 'intermediate',
      followUp: ['How would you convince a team to start with a monolith?'],
      tip: 'Being able to argue against microservices shows maturity. Many candidates only know how to argue for them.',
    },
    {
      question: 'How does service discovery work in a Kubernetes environment?',
      answer:
        'Kubernetes provides built-in service discovery through its DNS system. When you create a Kubernetes Service object for, say, the payment service, Kubernetes assigns it a stable DNS name like payment-service.default.svc.cluster.local. Other services use this DNS name. Kubernetes kube-proxy handles the actual routing — it intercepts requests to the DNS name and load-balances them across healthy pods. Pods can come and go; the DNS name stays stable. For services outside the cluster, Kubernetes Ingress controllers handle external traffic routing.',
      difficulty: 'advanced',
      followUp: ['What happens when a pod crashes — how quickly does it stop receiving traffic?'],
      tip: 'Mention that Kubernetes readiness probes control when traffic starts being sent to a new pod.',
    },
    {
      question: 'How would you migrate a monolith to microservices?',
      answer:
        'Use the Strangler Fig Pattern — extract services incrementally, never do a big-bang rewrite. (1) Identify the least coupled domain to extract first — typically something like notifications or search that has minimal inbound dependencies. (2) Build the new service alongside the monolith. (3) Introduce a routing layer (API gateway or reverse proxy) that directs specific traffic to the new service and everything else to the monolith. (4) Verify the new service works in production with real traffic. (5) Remove the code from the monolith. Repeat for each domain. The monolith shrinks gradually until it either disappears or becomes a small, manageable core.',
      difficulty: 'advanced',
      followUp: [
        'What would you extract first and why?',
        'How do you handle data migration when extracting a service?',
      ],
      tip: 'Name the Strangler Fig Pattern explicitly. It comes from Martin Fowler and interviewers will recognize it.',
    },
  ],

  exercises: [
    {
      id: 'microservices-ex-1',
      title: 'Define Service Boundaries for an E-Commerce System',
      description:
        'Given an e-commerce application with the following features: user registration, product catalog, shopping cart, order placement, payment processing, inventory tracking, shipping, email notifications, and admin reporting — identify 6 microservices. For each service, specify: (1) what it owns, (2) what database it uses and why, (3) what events it publishes, (4) what events it subscribes to.',
      starterCode: `// Define your microservices architecture here

const ecommerceServices = [
  {
    name: 'User Service',
    owns: [],         // what data/logic does this service own?
    database: '',     // what database type and why?
    publishes: [],    // what events does it publish?
    subscribes: [],   // what events does it listen to?
  },
  // Add 5 more services...
];`,
      solution: `const ecommerceServices = [
  {
    name: 'User Service',
    owns: ['user accounts', 'authentication', 'profiles', 'addresses'],
    database: 'PostgreSQL — relational data, ACID compliance needed for accounts',
    publishes: ['user.registered', 'user.deleted', 'user.address.updated'],
    subscribes: [],
  },
  {
    name: 'Product Service',
    owns: ['product catalog', 'categories', 'product metadata', 'pricing'],
    database: 'MongoDB — flexible schema for varied product attributes',
    publishes: ['product.created', 'product.updated', 'product.deleted'],
    subscribes: [],
  },
  {
    name: 'Order Service',
    owns: ['order lifecycle', 'order status', 'order history'],
    database: 'PostgreSQL — transactional integrity for order state',
    publishes: ['order.placed', 'order.confirmed', 'order.cancelled', 'order.delivered'],
    subscribes: ['payment.succeeded', 'payment.failed', 'inventory.reserved', 'inventory.failed', 'shipping.dispatched'],
  },
  {
    name: 'Payment Service',
    owns: ['payment records', 'refunds', 'payment methods'],
    database: 'PostgreSQL — financial data requires ACID, audit trail',
    publishes: ['payment.succeeded', 'payment.failed', 'payment.refunded'],
    subscribes: ['order.placed'],
  },
  {
    name: 'Inventory Service',
    owns: ['stock levels', 'reservations', 'warehouse locations'],
    database: 'PostgreSQL with Redis cache — stock checks must be fast and consistent',
    publishes: ['inventory.reserved', 'inventory.failed', 'inventory.low'],
    subscribes: ['order.placed', 'order.cancelled'],
  },
  {
    name: 'Notification Service',
    owns: ['email templates', 'notification preferences', 'notification history'],
    database: 'MongoDB — flexible notification templates, no relational needs',
    publishes: [],
    subscribes: ['order.placed', 'order.confirmed', 'order.cancelled', 'payment.succeeded', 'payment.failed'],
  },
];`,
      hints: [
        'Each service should own data that no other service writes to directly',
        'The Notification service should subscribe to events from other services, not be called directly',
        'Think about which services need ACID transactions vs which are read-heavy',
        'The Order service is the orchestrator — it reacts to events from Payment and Inventory',
      ],
    },
    {
      id: 'microservices-ex-2',
      title: 'Design a Circuit Breaker',
      description:
        'Implement a simple circuit breaker that wraps any async function call. The circuit breaker should have three states: CLOSED (normal), OPEN (failing, reject immediately), HALF_OPEN (testing recovery). It should open after 5 consecutive failures and attempt recovery after 10 seconds.',
      starterCode: `type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: number | null = null;

  // Configuration
  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 10000; // 10 seconds

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // TODO: Implement circuit breaker logic
    // 1. If OPEN and recovery timeout hasn't passed: reject immediately
    // 2. If OPEN and recovery timeout passed: transition to HALF_OPEN and try
    // 3. If HALF_OPEN: try once. Success → CLOSED. Failure → OPEN
    // 4. If CLOSED: try. On failure, increment counter. At threshold → OPEN
    throw new Error('Not implemented');
  }
}`,
      solution: `type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: number | null = null;

  private readonly failureThreshold = 5;
  private readonly recoveryTimeout = 10000;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - (this.lastFailureTime ?? 0);
      if (timeSinceLastFailure < this.recoveryTimeout) {
        throw new Error('Circuit breaker is OPEN — request rejected');
      }
      // Recovery timeout passed — try again
      this.state = 'HALF_OPEN';
      console.log('Circuit breaker → HALF_OPEN (testing recovery)');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log('Circuit breaker → CLOSED (service recovered)');
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log(\`Circuit breaker → OPEN (failure #\${this.failureCount})\`);
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Usage:
const breaker = new CircuitBreaker();
const paymentClient = { charge: async () => { /* ... */ } };

async function placeOrder() {
  try {
    await breaker.execute(() => paymentClient.charge());
  } catch (err) {
    // Either payment failed OR circuit is open (payment service is down)
    // Handle gracefully — queue for retry, show user a message
  }
}`,
      hints: [
        'The circuit breaker sits between your service and the downstream service call',
        'In OPEN state, you reject immediately without even trying the network call — this is the key benefit',
        'HALF_OPEN is a probe state: you let exactly one request through to test if the service recovered',
        'On success in HALF_OPEN, reset the failure count and go back to CLOSED',
      ],
    },
  ],

  keyTakeaways: [
    'Microservices are independently deployable services with a single domain responsibility — the two key words are "one thing" and "independently deployable"',
    'Service boundaries must follow business domains (DDD bounded contexts), not technical layers — wrong boundaries are the most common and most painful microservices mistake',
    'Each service must own its own database — shared databases destroy independence and create hidden coupling',
    'Synchronous communication (REST/gRPC) is for when you need the response immediately; async (Kafka/RabbitMQ) is for everything else',
    'Distributed transactions require the Saga pattern — you cannot use database transactions across service boundaries',
    'Microservices introduce serious operational complexity: you need CI/CD per service, container orchestration, distributed tracing, centralized logging, and service discovery',
    'Start with a monolith; extract microservices using the Strangler Fig Pattern only when you have real team ownership and scaling pain — not before',
    'The biggest wins of microservices (independent scaling, independent deployment, fault isolation) only materialize at significant scale with multiple teams',
  ],
};
