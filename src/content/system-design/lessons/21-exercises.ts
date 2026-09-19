import type { Lesson } from '@/types';

export const exercisesLesson: Lesson = {
  id: 'exercises',
  slug: 'exercises',
  title: 'Exercises',
  description:
    'Hands-on system design exercises that build architectural thinking. Every exercise forces you to make a real decision, justify it, and reason about tradeoffs — not recite facts.',
  category: 'Practice',
  order: 21,
  difficulty: 'advanced',
  estimatedTime: 120,
  prevLesson: 'interview-preparation',
  nextLesson: 'revision-hub',

  content: `# Exercises

## The Purpose of These Exercises

Reading about system design makes you familiar with concepts. Doing system design makes you capable of applying them.

These exercises are not tests. There are no single correct answers. The goal is to develop the habit of structured thinking: defining constraints before designing, reasoning about tradeoffs explicitly, and knowing when to change your mind when constraints change.

Every exercise follows this pattern:
1. **Given** — constraints, scale, requirements
2. **Design** — your architecture decisions
3. **Justify** — why you made each decision
4. **Stress test** — what breaks if scale doubles? If a component fails?

### What Separates Good Designs from Great Ones

A good design correctly identifies the main components and their relationships. A great design also:
- Identifies the **single hardest problem** in the system and addresses it directly
- Makes explicit **tradeoff decisions** and explains what was sacrificed and why
- Knows exactly **where the design breaks** and what you'd change at 10x scale
- Chooses the **simplest solution** that actually works at the given scale

### How to Use These Exercises

**Option 1: Solo Practice**
Set a timer for 45 minutes. Draw your design on paper (not a computer). Explain your choices out loud, as if presenting to an interviewer. Then compare with the solution.

**Option 2: Pair Practice**
One person is the "interviewer" and asks clarifying questions to challenge the design. The other presents their design and defends it. Swap after 45 minutes.

**Option 3: Incremental Complexity**
Start with 1,000 users and design the simplest working solution. Then scale to 1 million, then 100 million. Observe how the architecture must change at each step.

---

## Exercise 1: Design a Chat Application

**Given:**
- WhatsApp-style one-on-one and group messaging
- 50 million daily active users
- Average 20 messages sent per user per day
- Must support real-time delivery (< 500ms when both users are online)
- Must store message history (users can scroll up to see old messages)
- Read receipts: single tick (sent), double tick (delivered), blue tick (read)
- Group size: up to 256 members

**Your Task:**
Work through all of the following decisions with justifications:
1. How do you maintain real-time connections?
2. What database stores messages? Why?
3. How do you handle a user who is offline?
4. How do you implement read receipts efficiently?
5. How does group messaging work differently from 1:1?
6. Where do media files (photos, videos) go?

**Scale Check:**
- 50M DAU × 20 messages = 1 billion messages/day
- 1B / 86,400 = 11,574 messages/second
- Each message ~200 bytes → 200 GB/day in text

**The Hard Part:**
At 11,574 messages/second, your message store must accept writes at this rate continuously. Which databases handle this? Which don't?

---

## Exercise 2: Design a Notification System

**Given:**
- Must support push notifications (FCM/APNs), email (SendGrid), and SMS (Twilio)
- 10 million users
- 100 million notifications/day
- Two priority levels: transactional (OTP codes, payment confirmations — deliver in < 5 seconds) and marketing (promotions — deliver within 1 hour, acceptable to fail)
- Users can opt out of specific channels or set quiet hours

**Your Task:**
1. How do you separate transactional and marketing notifications to prevent one from starving the other?
2. How do you handle provider rate limits (Twilio limits SMS/second)?
3. How do you retry failed notifications without duplicate sends?
4. How do you track delivery status per notification per channel?
5. How do you honor user quiet hours without missing the window?

**Scale Check:**
- 100M/day = 1,157 notifications/second average
- Peak (assume 10x): 11,570/second
- At these rates, which components need horizontal scaling?

**The Hard Part:**
Idempotency — if a notification worker crashes after sending but before marking as sent, it retries and sends again. How do you prevent this duplicate?

---

## Exercise 3: Design a Parking Lot System (LLD)

This is a Low-Level Design exercise. The focus is on classes, relationships, and object-oriented modeling — not distributed systems.

**Given:**
- Multi-level parking lot with 500 spots
- Spot types: Compact, Large, Handicapped
- Vehicle types: Motorcycle, Car, Bus
- A motorcycle can fit in any spot
- A car can fit in Compact or Large
- A bus can only fit in Large (occupies 5 consecutive spots)
- System must assign the nearest available spot to the entrance
- Generate ticket on entry with timestamp
- Calculate payment on exit based on hours parked

**Your Task:**
1. Define the classes and their relationships
2. Model the spot assignment algorithm
3. Model the payment calculation
4. Handle edge cases: lot is full, bus needs 5 consecutive spots, handicapped-only spots

**Key Classes to Consider:**
- ParkingLot, ParkingLevel, ParkingSpot
- Vehicle (with subclasses)
- Ticket
- PricingStrategy (could vary by vehicle type or time of day)

**The Hard Part:**
Bus parking requires 5 consecutive spots on the same level. How do you efficiently find and reserve them atomically?

---

## Exercise 4: Cache Strategy Decision

**Given three scenarios, choose the correct caching strategy and justify:**

**Scenario A: User Profile Page**
- A user's profile is read thousands of times per day by their followers
- The user updates their profile picture once every few months
- Data: name, profile photo URL, bio, follower count
- Requirement: followers should see the updated photo within 60 seconds of change

**Scenario B: Product Inventory Count**
- An e-commerce product page shows "7 items left in stock"
- Inventory changes every time someone purchases (frequently during flash sales)
- Requirement: user must never be able to add more items to cart than exist in inventory

**Scenario C: Top 10 Trending Hashtags**
- Calculated from billions of tweets in the last hour
- Calculation takes 30 seconds to run (expensive)
- Displayed on every user's homepage
- Requirement: trending list can be up to 5 minutes stale

**For each scenario, specify:**
1. Cache strategy (Cache-Aside, Write-Through, Write-Back, or no cache)
2. TTL (or event-driven invalidation)
3. What you cache (full object? partial?)
4. What happens on a cache miss?

---

## Exercise 5: Microservices Decomposition

**Given:** A monolith e-commerce application with these features:
1. User registration and authentication
2. Product catalog (browse, search, filter)
3. Product reviews and ratings
4. Shopping cart
5. Checkout and payment
6. Inventory management
7. Order management and tracking
8. Email and notification delivery
9. Analytics and reporting (sales dashboards)
10. Admin panel (manage products, users, orders)

**Context:** The engineering team is 30 people, divided into 5 cross-functional teams. The monolith is becoming hard to deploy — every team's changes must be coordinated. You're averaging 3 deployments per week total.

**Your Task:**
1. Which features should become independent microservices? (Not everything needs to be a service)
2. Which features should stay together in the same service?
3. What are the dependencies between services?
4. How will services communicate? (Synchronous vs asynchronous for each relationship)
5. What shared infrastructure do you need?

**Guidance:**
Ask these questions for each potential service extraction:
- Does this component scale differently from everything else?
- Does a different team own this component and need to deploy it independently?
- Does this component have significantly different infrastructure requirements?
- What is the cost of the network boundary? (Transactions across services become complex)

---

## Exercise 6: Tradeoff Analysis — E-Commerce Flash Sale

**Scenario:**
An e-commerce platform is planning a flash sale: 1 item (limited edition sneaker), 10,000 units, 1,000,000 users will simultaneously try to buy it at noon.

**The Core Conflict:**
- **Strong consistency** guarantees no overselling but requires locking, reducing throughput
- **Eventual consistency** maximizes throughput but risks overselling if not designed carefully

**Your Task — Analyze Each Approach:**

**Approach A: Strong Consistency (SELECT FOR UPDATE)**
- How does it work mechanically?
- What is the maximum throughput in purchases/second?
- What happens to users when the lock is contended?
- Is overselling possible? Why or why not?
- When is this approach acceptable vs. unacceptable?

**Approach B: Optimistic Locking (Version Counter)**
- How does it work mechanically?
- What happens when two users try to buy simultaneously?
- What is the retry strategy?
- When does this approach degrade in performance?
- Is overselling possible? Why or why not?

**Approach C: Redis Atomic Decrement**
- How does it work mechanically?
- Why is DECR atomic in Redis?
- What is the maximum throughput?
- What happens if Redis crashes between DECR and the DB write?
- How do you recover from Redis-DB inconsistency?

**Your Recommendation:**
Given 10,000 units and 1,000,000 simultaneous users, which approach do you choose? What is your reasoning? What consistency guarantee can you offer users?

---

## Thinking Patterns to Practice After Each Exercise

**The Failure Mode Question:**
"What is the single component in this design whose failure would take down the entire system?" Then: "How do I eliminate that single point of failure?"

**The Scale Question:**
"At what order of magnitude does my current design break? What specifically breaks first?" Then: "What change would I make to handle 10x this load?"

**The Consistency Question:**
"For each piece of data in this system, what is the acceptable staleness window?" Then: "Am I applying the right consistency model to each?"

**The Cost Question:**
"What is the most expensive component of this design (compute, storage, network, operational complexity)?" Then: "Is there a simpler approach that achieves the same result at lower cost?"

These four questions, asked repeatedly, develop the instincts that distinguish strong system designers from those who merely know the concepts.`,

  codeExamples: [
    {
      title: 'Parking Lot: Class Structure Template',
      code: `// Parking Lot Low-Level Design

enum SpotType { COMPACT = 'COMPACT', LARGE = 'LARGE', HANDICAPPED = 'HANDICAPPED' }
enum VehicleType { MOTORCYCLE = 'MOTORCYCLE', CAR = 'CAR', BUS = 'BUS' }

class Vehicle {
  constructor(
    public plateNumber: string,
    public type: VehicleType
  ) {}

  canFitIn(spot: ParkingSpot): boolean {
    if (this.type === VehicleType.MOTORCYCLE) return true; // fits anywhere
    if (this.type === VehicleType.CAR) return spot.type !== SpotType.HANDICAPPED || spot.type === SpotType.HANDICAPPED;
    if (this.type === VehicleType.BUS) return spot.type === SpotType.LARGE;
    return false;
  }

  spotsNeeded(): number {
    return this.type === VehicleType.BUS ? 5 : 1;
  }
}

class ParkingSpot {
  public isOccupied: boolean = false;
  public vehicle: Vehicle | null = null;

  constructor(
    public spotId: string,
    public type: SpotType,
    public level: number,
    public spotNumber: number
  ) {}

  occupy(vehicle: Vehicle): void {
    this.isOccupied = true;
    this.vehicle = vehicle;
  }

  vacate(): void {
    this.isOccupied = false;
    this.vehicle = null;
  }
}

class ParkingLevel {
  public spots: ParkingSpot[] = [];

  constructor(public levelNumber: number, spotsConfig: { type: SpotType; count: number }[]) {
    let spotNumber = 0;
    for (const config of spotsConfig) {
      for (let i = 0; i < config.count; i++) {
        this.spots.push(
          new ParkingSpot(\`L\${levelNumber}-\${spotNumber}\`, config.type, levelNumber, spotNumber++)
        );
      }
    }
  }

  findSpotForVehicle(vehicle: Vehicle): ParkingSpot[] | null {
    if (vehicle.type === VehicleType.BUS) {
      return this.findConsecutiveLargeSpots(5);
    }

    // Find nearest available compatible spot
    for (const spot of this.spots) {
      if (!spot.isOccupied && vehicle.canFitIn(spot)) {
        return [spot];
      }
    }
    return null;
  }

  private findConsecutiveLargeSpots(count: number): ParkingSpot[] | null {
    const largeSpots = this.spots.filter(s => s.type === SpotType.LARGE && !s.isOccupied);
    // Find consecutive by spot number
    for (let i = 0; i <= largeSpots.length - count; i++) {
      const consecutive = largeSpots.slice(i, i + count);
      const isConsecutive = consecutive.every(
        (s, idx) => idx === 0 || s.spotNumber === consecutive[idx - 1].spotNumber + 1
      );
      if (isConsecutive) return consecutive;
    }
    return null;
  }
}

class Ticket {
  public entryTime: Date;
  constructor(
    public ticketId: string,
    public vehicle: Vehicle,
    public assignedSpots: ParkingSpot[]
  ) {
    this.entryTime = new Date();
  }

  calculateFee(): number {
    const hoursParked = Math.ceil(
      (Date.now() - this.entryTime.getTime()) / (1000 * 60 * 60)
    );
    const rates = { MOTORCYCLE: 1, CAR: 2, BUS: 5 }; // per hour
    return hoursParked * rates[this.vehicle.type];
  }
}`,
      explanation:
        'The key design decisions: Vehicle types have different spot requirements encoded in the Vehicle class (not hardcoded in the lot). Bus requires 5 consecutive Large spots — handled in ParkingLevel with a separate findConsecutiveLargeSpots method. Ticket holds reference to assigned spots, enabling easy vacating on exit.',
    },
    {
      title: 'Flash Sale: Three Approaches Compared',
      code: `// Approach A: Pessimistic Locking (SELECT FOR UPDATE)
async function purchasePessimistic(db: any, productId: string, userId: string): Promise<boolean> {
  return db.transaction(async (trx: any) => {
    // Lock the row — other transactions WAIT here
    const item = await trx.raw(
      'SELECT quantity FROM inventory WHERE product_id = ? FOR UPDATE',
      [productId]
    );

    if (item[0].quantity <= 0) return false; // sold out

    await trx('inventory').where({ product_id: productId }).decrement('quantity', 1);
    await trx('orders').insert({ user_id: userId, product_id: productId, status: 'confirmed' });
    return true;
  });
  // Lock released when transaction completes
  // MAX THROUGHPUT: ~500-2000 purchases/second (lock serializes everything)
}

// Approach B: Optimistic Locking (Version Counter)
async function purchaseOptimistic(
  db: any, productId: string, userId: string, maxRetries = 3
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    const item = await db('inventory').where({ product_id: productId }).first();
    if (item.quantity <= 0) return false;

    const updated = await db('inventory')
      .where({ product_id: productId, version: item.version })
      .andWhere('quantity', '>', 0)
      .update({ quantity: item.quantity - 1, version: item.version + 1 });

    if (updated > 0) {
      await db('orders').insert({ user_id: userId, product_id: productId });
      return true;
    }
    // Conflict: version changed, retry with backoff
    await new Promise(r => setTimeout(r, Math.pow(2, i) * 10));
  }
  return false; // Give up after retries
}

// Approach C: Redis Atomic DECR (recommended for flash sales)
async function purchaseRedis(
  redis: any, db: any, productId: string, userId: string
): Promise<boolean> {
  // DECR is atomic — only one client can decrement at a time in Redis
  const remaining = await redis.decr(\`inventory:\${productId}\`);

  if (remaining < 0) {
    // We went negative — put it back, sold out
    await redis.incr(\`inventory:\${productId}\`);
    return false;
  }

  // Redis confirmed we have stock — write to DB asynchronously
  // If DB write fails, we have a reconciliation job that syncs Redis→DB
  await db('orders').insert({
    user_id: userId,
    product_id: productId,
    status: 'pending_confirmation'
  });

  // Publish event for async processing
  await redis.lpush('purchase_events', JSON.stringify({ userId, productId }));
  return true;
  // MAX THROUGHPUT: ~100,000 operations/second (Redis single-threaded, in-memory)
}`,
      output: `Throughput comparison:
- Pessimistic locking: ~500-2,000 purchases/second (limited by lock serialization)
- Optimistic locking: ~5,000-10,000/second (works until high contention)
- Redis DECR: ~100,000+/second (Redis single-threaded, atomic, in-memory)

For 1,000,000 simultaneous users competing for 10,000 units:
- Redis handles the spike; database handles the guaranteed records`,
      explanation:
        'At 1,000,000 concurrent users, pessimistic locking creates a queue of 1M transactions waiting for the database lock. Optimistic locking degrades under high contention as retries pile up. Redis DECR is atomic at the memory level — no locks, no retries needed for the inventory check.',
    },
  ],

  commonMistakes: [
    'Skipping the capacity estimation and jumping straight to architecture — scale determines everything, do the math first',
    'Choosing a single database for all data in a complex system — different access patterns often demand different storage solutions',
    'Designing read receipts as synchronous operations — they should be fire-and-forget events, not blocking calls in the message path',
    'Forgetting that bus parking requires consecutive spots — modeling it as "5 separate spots" without the consecutiveness constraint is wrong',
    'Using a single Kafka topic for both transactional and marketing notifications — marketing traffic will delay OTP codes',
    'Applying pessimistic locking to flash sale inventory — at 1M concurrent users, the lock queue creates catastrophic latency',
    'Not considering the Redis crash scenario in Approach C — what happens to the DECR if Redis restarts before the DB write completes?',
    'Extracting every feature into a microservice — the shopping cart and checkout might share a database transaction for atomicity',
    'Choosing write-through cache for inventory during a flash sale — cache updates on every purchase create more load, not less',
    'Forgetting to model user preferences in the notification system — opt-outs and quiet hours are a core requirement, not an afterthought',
  ],

  interviewQuestions: [
    {
      question: 'For a real-time chat system with 50M DAU, what database would you use for messages and why?',
      answer:
        "Cassandra is the right choice for messages at this scale. The access patterns are: (1) write-heavy — 11,574 messages/second requires a database optimized for high write throughput. (2) Time-series per conversation — you always query 'give me the last 50 messages in conversation X', which maps perfectly to Cassandra's partition key (conversationId) + clustering key (timestamp). (3) Append-only — messages are never updated, only added. (4) High availability with no single point of failure. PostgreSQL can handle this with aggressive sharding, but the operational complexity is much higher than Cassandra's native horizontal scaling.",
      difficulty: 'intermediate',
      tip: 'State the access patterns first, then justify the database choice based on those patterns. Never choose a database without first defining what queries you need to run.',
    },
    {
      question: 'In the parking lot design, how do you handle the case where a bus needs 5 consecutive spots?',
      answer:
        'Model each parking level as an ordered list of spots. When a bus arrives, scan the list of available Large spots and check if any 5 consecutive spots (by spot number) are all available. If found, lock all 5 atomically before issuing the ticket. The "atomically" part matters — in a concurrent system, between finding 5 consecutive spots and occupying them, another bus could occupy some of them. Solution: use a database transaction or in-memory mutex when modifying spot state. In the object model, ParkingLevel.findConsecutiveLargeSpots() returns a list of 5 spots, and they are all occupied in a single atomic operation before the ticket is issued.',
      difficulty: 'intermediate',
    },
    {
      question: 'For the notification system exercise, how do you prevent a worker from sending the same notification twice if it crashes after sending but before marking as delivered?',
      answer:
        "This is the exactly-once delivery problem. The solution is idempotency: before sending, update the notification status to 'processing' with a lock timestamp. If a worker picks up a notification already in 'processing' state with a recent lock timestamp, it skips it. If the lock is expired (worker crashed), it can re-acquire. After sending successfully, update status to 'sent'. The provider (SendGrid, Twilio) must also be called idempotently — most providers accept an idempotency key so that if you send the same request twice, they only deliver once. Store the idempotency key alongside the notification record and always use it.",
      difficulty: 'advanced',
    },
    {
      question:
        'In the flash sale exercise, what happens if Redis crashes between the DECR operation and the database write for Approach C?',
      answer:
        "This is the dual-write consistency problem. If Redis decrements successfully but the process crashes before writing to the database, you have lost the sale record — the user was charged (or thinks they were) but no order exists. Solutions: (1) Write to the database first, then decrement Redis. If Redis decrement fails, rollback the DB write. But this brings you back to DB being the bottleneck. (2) Transactional outbox: write to an outbox table in the same DB transaction as the order, then a separate process reads and reconciles with Redis. (3) Accept eventual consistency with a reconciliation job: periodically compare Redis counter with DB order count and correct discrepancies. For flash sales, option 3 is usually acceptable — a brief inconsistency that resolves within seconds is tolerable for inventory.",
      difficulty: 'expert',
    },
    {
      question: 'In the microservices decomposition exercise, would you make the shopping cart and checkout separate services?',
      answer:
        "No — keep them together. Shopping cart and checkout are tightly coupled through a critical business process: you cannot checkout without a cart, and the cart-to-order conversion needs to be atomic (you cannot charge someone without creating the order, and you cannot create the order without confirming payment). If they are separate services, checkout needs to call cart to get items, and then you have a distributed transaction spanning two services — complex and failure-prone. The checkout service should own the cart model, read it locally, and convert it to an order in a single database transaction. Extract a service only when the scaling requirement, team ownership, or technology requirement genuinely differs. Cart + checkout have the same lifecycle and should be owned by one team.",
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'chat-application-design',
      title: 'Design a Chat Application',
      description:
        'Design a WhatsApp-style chat system for 50 million daily active users. Cover: real-time connection strategy, message persistence, offline delivery, read receipts, group messaging, and media storage. Justify every decision with the access pattern it serves.',
      starterCode: `// Chat Application System Design
// 50M DAU | 20 messages/user/day | Real-time delivery | Groups up to 256

// SCALE:
// Messages: 50M × 20 = 1B/day = 11,574/second
// Storage: 1B × 200 bytes = 200 GB/day (text only)

// 1. REAL-TIME CONNECTION
// Technology: ___
// Why not polling?: ___
// How many connections per server?: ___
// How many servers needed for 50M users?: ___

// 2. MESSAGE PERSISTENCE
// Database: ___
// Schema: ___
// Why not PostgreSQL?: ___

// 3. OFFLINE DELIVERY
// Where are messages stored while user is offline?: ___
// How are they delivered when user reconnects?: ___
// For how long are messages stored?: ___

// 4. READ RECEIPTS
// Single tick (sent): triggered when ___
// Double tick (delivered): triggered when ___
// Blue tick (read): triggered when ___
// Storage: where do you store receipt state?: ___

// 5. GROUP MESSAGING (256 members)
// When a message is sent to a group, what happens?: ___
// Problem: 256 deliveries per message × 11,574/sec = ___/sec
// Solution: ___

// 6. MEDIA STORAGE
// Photos/videos stored where?: ___
// Why not through the message server?: ___
// How does the recipient get the media?: ___`,
      solution: `// Chat Application — Complete Design

// 1. REAL-TIME CONNECTION
// Technology: WebSockets (persistent bidirectional TCP connection)
// Why not polling: polling at 50M users = 50M requests/second just for "any new messages?"
// Per server: ~10,000 WebSocket connections per server
// Servers needed: 50M / 10,000 = 5,000 connection servers

// 2. MESSAGE PERSISTENCE
// Database: Cassandra
// Schema:
//   Partition key: conversation_id (all messages in a conversation co-located)
//   Clustering key: message_id (time-sortable UUID like ULID)
//   Columns: sender_id, content, media_url, encrypted_payload
// Why not PostgreSQL: 11,574 writes/second needs horizontal write scaling
// Cassandra: add nodes to linearly increase write throughput

// 3. OFFLINE DELIVERY
// Offline messages stored in: Cassandra (same table, marked as undelivered)
// + Redis queue per user for fast "pending messages" lookup
// On reconnect: fetch from Redis queue, deliver via WebSocket
// Retention: 30 days (WhatsApp standard)

// 4. READ RECEIPTS
// Single tick: message acknowledged by server (sender's connection server received it)
// Double tick: recipient's device acknowledged delivery via WebSocket ACK
// Blue tick: recipient opens conversation → device sends "read" event → server updates
// Storage: Redis hash per conversation tracking last_delivered_at, last_read_at per user

// 5. GROUP MESSAGING
// Fan-out: for each group message, server delivers to each of 256 members
// 256 × 11,574 = 2.96 million deliveries/second — manageable with horizontal connection servers
// Optimization: if multiple members are on same connection server, batch delivery
// For large groups (100M users in broadcast channel): use Pub/Sub architecture

// 6. MEDIA STORAGE
// Photos/videos → S3 or equivalent object storage
// Why not message server: a 5MB video × 11,574/sec = 57 GB/second through message server
// Instead: client uploads directly to S3 (pre-signed URL), message contains only S3 URL
// CDN in front of S3 for fast delivery`,
      hints: [
        'Calculate total connections at 50M DAU to see why you need multiple connection servers and a service discovery layer',
        'Group messaging fan-out math: multiply message rate by average group size to get actual delivery rate',
        'Read receipts require the receiver to proactively send an event — think about the direction of the WebSocket message',
      ],
    },
    {
      id: 'notification-system',
      title: 'Design a Notification System',
      description:
        'Design a multi-channel notification system (push, email, SMS) for 10 million users delivering 100 million notifications per day with separate priority tiers. Cover: queue architecture, provider rate limiting, retry strategy with idempotency, and delivery tracking.',
      starterCode: `// Notification System Design
// 10M users | 100M notifications/day | Push + Email + SMS | Priority tiers

// SCALE:
// 100M/day = 1,157/second average, ~11,570/second peak

// 1. QUEUE ARCHITECTURE
// How do you ensure transactional OTPs are never delayed by marketing emails?
// Queue design:
//   Transactional queue: ___
//   Marketing queue: ___
//   Worker priority: ___

// 2. PROVIDER RATE LIMITS
// Twilio SMS limit: ~100 SMS/second per account
// SendGrid email: ~1,000 emails/second
// FCM push: effectively unlimited but recommended < 500 req/sec per connection
// How do you enforce these limits without blocking workers?: ___

// 3. RETRY STRATEGY (without duplicate sends)
// Step 1: Before sending, mark notification as: ___
// Step 2: Send to provider
// Step 3: On success: mark as ___
// Step 4: On failure: mark as ___, schedule retry at ___
// Idempotency: how do you prevent duplicate sends?: ___

// 4. DELIVERY TRACKING
// What data do you store per notification?
// Table schema: ___
// Database choice: ___ because ___

// 5. QUIET HOURS
// User sets: "Do not disturb from 10pm to 8am"
// When notification arrives at 11pm:
//   For transactional (OTP): ___
//   For marketing: ___`,
      solution: `// Notification System — Complete Design

// 1. QUEUE ARCHITECTURE
// Separate Kafka topics:
//   notifications.transactional (OTP, payment confirmations, alerts)
//   notifications.marketing (promotions, newsletters)
// Workers check transactional topic first; marketing processed at remaining capacity
// Never let marketing topic growth slow transactional consumption

// 2. PROVIDER RATE LIMITS
// Per-provider rate limiter in Redis:
//   redis.incr("rate:twilio:{minute_bucket}")
//   If count > 6000 (100/sec × 60 seconds), delay message by 1 second and re-queue
// Sliding window implementation prevents burst over any 60-second window
// Workers are aware of their own channel — SMS workers respect Twilio limits only

// 3. RETRY STRATEGY
// Step 1: UPDATE status = 'processing', lock_until = NOW() + 60s WHERE status = 'pending'
// Step 2: Call provider API with idempotency key = notification_id
// Step 3: Success → UPDATE status = 'sent', sent_at = NOW()
// Step 4: Failure → UPDATE status = 'failed', retry_count++, next_retry = NOW() + (2^retry_count × 10s)
// Max retries: 5 for transactional, 2 for marketing
// Idempotency: provider's idempotency key = our notification_id → same key always produces same result

// 4. DELIVERY TRACKING
// Schema (Cassandra):
//   partition key: user_id (query "all notifications for user X")
//   clustering key: created_at DESC (most recent first)
//   columns: notification_id, type, channel, status, template_id, sent_at, delivered_at, error
// Cassandra chosen for: write-heavy (1157/sec), time-series per user, no complex joins

// 5. QUIET HOURS
// Transactional: IGNORE quiet hours. OTP codes must be delivered immediately regardless.
// Marketing: check user_preferences.quiet_hours before processing
//   If in quiet window: update scheduled_for = next_available_time (end of quiet window)
//   Re-queue with delay instead of processing immediately`,
      hints: [
        'The key insight for priority queues: separate Kafka topics with separate consumer groups, not message priority flags in one topic',
        'Idempotency key = the notification ID — providers like Twilio and SendGrid accept this natively',
        'Quiet hours only apply to marketing — hard-coding this distinction prevents business logic bugs later',
      ],
    },
    {
      id: 'cache-strategy-decision',
      title: 'Cache Strategy Decision for Three Scenarios',
      description:
        'For each of three scenarios (user profile, product inventory, trending hashtags), choose the correct caching strategy (Cache-Aside, Write-Through, Write-Back, or no cache), specify TTL or invalidation approach, and justify why other strategies would be wrong.',
      starterCode: `// Cache Strategy Decision Exercise

// SCENARIO A: User Profile Page
// - Read thousands of times/day
// - Updated once every few months
// - Must reflect updates within 60 seconds

// Your choice: ___
// TTL: ___
// On update: ___
// On miss: ___
// Why not Write-Through: ___

// SCENARIO B: Product Inventory Count ("7 items left")
// - Changes on every purchase (flash sale: 100s of purchases/second)
// - Must NEVER serve stale count that allows overselling

// Your choice: ___
// Can you cache this? ___
// If yes, how?: ___
// If no, why?: ___

// SCENARIO C: Top 10 Trending Hashtags
// - Calculation takes 30 seconds
// - Can be up to 5 minutes stale
// - Displayed on every user's homepage

// Your choice: ___
// TTL: ___
// Who updates the cache?: ___
// What happens during the 30-second recalculation window?: ___`,
      solution: `// Cache Strategy Solutions

// SCENARIO A: User Profile — Cache-Aside with event-driven invalidation
// On read: check Redis → miss → query PostgreSQL → populate Redis (TTL: 60 seconds)
// On write: update PostgreSQL → delete Redis key (not update — simpler, avoids race)
// TTL as backup: 60 seconds ensures eventual consistency even if delete fails
// Why not Write-Through: writes are rare (once every few months per user)
//   Write-Through would add Redis write overhead on every update for no benefit

// SCENARIO B: Product Inventory — No traditional caching
// Inventory is a strong-consistency requirement — stale cache = overselling = financial loss
// For normal traffic: use PostgreSQL with optimistic locking (no cache)
// For flash sales only: use Redis as the AUTHORITATIVE counter (not a cache)
//   DECR is atomic → Redis IS the inventory system during flash sale
//   PostgreSQL is updated asynchronously (eventual consistency between Redis + DB)
// Key insight: this is NOT caching. Redis is the primary inventory store during the sale.

// SCENARIO C: Trending Hashtags — Background refresh (write-aside cache)
// A cron job / Spark batch runs every 5 minutes:
//   1. Calculate trending hashtags (30 seconds)
//   2. Write result to Redis with TTL = 10 minutes (longer than refresh interval)
// On read: always serve from Redis → instant response (sub-millisecond)
// If Redis misses (first run): trigger calculation synchronously, wait for it
// Why not Cache-Aside: 30-second calculation on cache miss = unacceptable user wait
// Why not short TTL: forces frequent recalculation, and trending data is stale-tolerant`,
      hints: [
        'Inventory is not a caching problem — it is a consistency problem. The answer may be "do not cache this"',
        'For trending hashtags, the user should never wait for the calculation — the cache should always be pre-populated',
        'Cache-Aside with a 60-second TTL as a safety net is better than event-only invalidation — the TTL handles delete failures',
      ],
    },
    {
      id: 'microservices-decomposition',
      title: 'Microservices Decomposition of a Monolith',
      description:
        'Given an e-commerce monolith with 10 features and 5 engineering teams, decide which components to extract as microservices, which to keep together, and how they communicate. Apply the principle: extract only when there is a concrete reason (different scaling, different team ownership, different deployment cycle).',
      starterCode: `// Microservices Decomposition Exercise

// Features in the monolith:
// 1. User registration & auth
// 2. Product catalog (browse, search, filter)
// 3. Product reviews & ratings
// 4. Shopping cart
// 5. Checkout & payment
// 6. Inventory management
// 7. Order management & tracking
// 8. Email & notification delivery
// 9. Analytics & reporting
// 10. Admin panel

// Teams (5 cross-functional teams):
// Team 1: User experience (auth, profiles)
// Team 2: Product (catalog, search, reviews)
// Team 3: Commerce (cart, checkout, inventory, orders)
// Team 4: Platform (notifications, analytics)
// Team 5: Internal tools (admin panel)

// For each potential service, answer:
// Extract as microservice? YES / NO
// Reason: [team ownership / different scaling / different deployment / keep together for transactions]
// Communicates with others via: [sync REST/gRPC] or [async Kafka event]

// 1. User Auth Service: YES/NO — ___
// 2. Product Catalog Service: YES/NO — ___
// 3. Search Service: YES/NO — ___
// 4. Reviews Service: YES/NO — ___
// 5. Cart + Checkout Service: YES/NO — ___
// 6. Inventory Service: YES/NO — ___
// 7. Order Service: YES/NO — ___
// 8. Notification Service: YES/NO — ___
// 9. Analytics Service: YES/NO — ___
// 10. Admin Panel: YES/NO — ___`,
      solution: `// Microservices Decomposition — Recommended Solution

// 1. Auth Service: YES — Team 1 owns it; called by every other service (cross-cutting);
//    different scaling than catalog (auth = every request, catalog = browse requests)
//    Communicates: sync (every API request validates JWT against auth service)

// 2. Product Catalog Service: YES — Team 2 owns it; different scaling (read-heavy browse)
//    Communicates: sync REST for reads; publishes events on product updates

// 3. Search Service: YES — Separate tech (Elasticsearch); Team 2 owns but separate infra
//    Receives: product catalog events via Kafka → updates search index
//    Communicates: async (index update from catalog events), sync (search queries from clients)

// 4. Reviews Service: YES — Team 2 owns; can go down without breaking checkout
//    Reviews are loosely coupled — product page works without reviews (graceful degradation)
//    Communicates: sync for reads; async events when review posted (for analytics)

// 5. Cart + Checkout: KEEP TOGETHER — They share a critical atomic operation
//    Checkout reads cart → reserves inventory → charges payment → creates order — must be atomic
//    Splitting creates distributed transaction across services (huge complexity)
//    Team 3 owns both; deploy together

// 6. Inventory Service: YES — Team 3 owns; different scaling (write-heavy during sales)
//    Checkout calls inventory synchronously (must confirm stock before charging)
//    Cart + Checkout calls Inventory via sync gRPC for low latency

// 7. Order Service: YES — Team 3 owns; different lifecycle (long-running, state machine)
//    Order states: pending → confirmed → shipped → delivered
//    Checkout publishes "order.created" event → Order service picks up
//    Communicates: async (receives events from checkout, publishes shipping events)

// 8. Notification Service: YES — Team 4 owns; completely independent
//    Listens to events from all services (order.created → send confirmation email)
//    Never called synchronously — fire-and-forget
//    Communicates: async only (consumes Kafka events, no sync calls to it)

// 9. Analytics Service: YES — Team 4 owns; different infra (ClickHouse/BigQuery)
//    Completely async — consumes all business events, stores for reporting
//    If analytics is down, commerce still works perfectly

// 10. Admin Panel: KEEP IN MONOLITH or as thin BFF
//    Internal tool; low traffic; Team 5 can share the same deployable
//    Better as a Backend-For-Frontend that calls existing services' APIs`,
      hints: [
        'Ask "what happens if this service goes down?" — if the answer is "checkout breaks", keep them together',
        'Cart and checkout sharing a database transaction is the key reason to keep them together',
        'Notification service should never be in the critical path of any user-facing request — async only',
      ],
    },
    {
      id: 'flash-sale-tradeoff',
      title: 'Tradeoff Analysis: Flash Sale Inventory Consistency',
      description:
        "Analyze all three approaches to flash sale inventory management (pessimistic locking, optimistic locking, Redis DECR). For each, determine maximum theoretical throughput, consistency guarantees, failure modes, and recovery strategies. Then make and defend a recommendation for 10,000 units with 1,000,000 simultaneous buyers.",
      starterCode: `// Flash Sale Tradeoff Analysis
// 10,000 units | 1,000,000 simultaneous users at noon

// APPROACH A: SELECT FOR UPDATE (Pessimistic Locking)
// How it works: ___
// Max throughput: ~___ purchases/second
// What happens to 999,999 waiting users: ___
// Overselling possible?: ___
// Failure mode: what if the DB server goes down mid-transaction?: ___
// When to use: ___
// When NOT to use: ___

// APPROACH B: Optimistic Locking (version counter)
// How it works: ___
// Max throughput: ~___ purchases/second (under low contention)
// Max throughput under HIGH contention (1M users): ___
// Retry storm problem: ___
// Overselling possible?: ___
// When to use: ___

// APPROACH C: Redis DECR
// How it works: ___
// Why is DECR atomic?: ___
// Max throughput: ~___ operations/second
// What if Redis crashes after DECR but before DB write?: ___
// Recovery strategy: ___
// When to use: ___

// YOUR RECOMMENDATION
// For this flash sale scenario (10K units, 1M users):
// Chosen approach: ___
// Why this beats the alternatives: ___
// Consistency guarantee to users: ___
// What you would monitor during the sale: ___`,
      solution: `// Flash Sale Tradeoff Analysis — Complete Solution

// APPROACH A: Pessimistic Locking
// Throughput: ~500-2,000 purchases/second (lock serializes all requests through single queue)
// 1M users: massive queue forms at DB. 1M / 2,000 per second = 500 seconds to process
// This is 8+ minutes wait for users who arrive at second 1 of the sale
// Overselling: impossible (lock prevents concurrent reads and writes)
// DB crash: transaction rolls back automatically, lock released → safe
// Use when: < 1,000 concurrent users, or absolute consistency required regardless of latency

// APPROACH B: Optimistic Locking
// Throughput under low contention: ~10,000 purchases/second
// Throughput at 1M concurrent users: DEGRADES CATASTROPHICALLY
//   Every concurrent user reads version=5000, all try to update WHERE version=5000
//   Only 1 succeeds; 999,999 retry. All retry, only 1 succeeds. Retry storm.
//   Effective throughput may drop to ~100/second under extreme contention
// Overselling: impossible (WHERE version=X AND quantity>0 prevents it)
// Use when: low-to-medium concurrency, high read:write ratio

// APPROACH C: Redis DECR
// Throughput: ~100,000+ operations/second (Redis single-threaded, memory speed)
// Redis crash after DECR, before DB: inventory shows N-1 but no order record
//   Recovery: reconciliation job compares Redis counter with order count
//   Discrepancy = crash happened; set Redis to match order count
//   User gets no confirmation (order in 'pending' state) → manual review or retry
// Use when: flash sales, high concurrent inventory operations

// RECOMMENDATION: Redis DECR
// Reason: at 1M simultaneous users, only Redis can handle the atomicity requirement
//   at the required throughput. DB-based approaches queue or degrade badly.
// Implementation: Redis as primary inventory authority during sale window
//   DB updated asynchronously via event queue
//   Reconciliation job runs every 60 seconds during sale
// Consistency guarantee: "No overselling. May rarely require manual reconciliation
//   if server crashes mid-transaction, but orders are never lost — only delayed."
// Monitoring: Redis counter value, order creation rate, Redis memory usage, reconciliation lag`,
      hints: [
        'Calculate the math for pessimistic locking: 1,000,000 users ÷ 2,000 purchases/second = how many seconds until the last user is served?',
        'The retry storm in optimistic locking gets worse as more users contend — at 1M users all retrying simultaneously, the throughput collapses',
        'The Redis crash scenario is the hardest part — think about what state each system is in when the crash occurs and how to detect the inconsistency',
      ],
    },
  ],

  keyTakeaways: [
    'System design exercises build thinking, not memorization — always justify decisions, do not just list components',
    'Cassandra is the correct choice for chat messages: write-heavy, time-series per conversation, horizontal scaling',
    'Notification systems must use separate queues for transactional and marketing traffic — never let promotions delay OTP codes',
    'Inventory during a flash sale should use Redis DECR (atomic, 100K+ ops/second) — pessimistic locking collapses under 1M concurrent users',
    'Cache-Aside with TTL backup handles profile data; trending content needs background refresh to avoid users waiting 30 seconds on a miss',
    'Cart and checkout should stay together in the same service because they share a critical atomic operation — splitting creates distributed transaction complexity',
    'The parking lot bus problem is really a consecutive resource allocation problem — test your solution against edge cases (bus arrives at the last 5 spots of the level)',
    'Idempotency keys prevent duplicate notification sends — use the notification ID as the provider idempotency key',
    'Extract microservices for concrete reasons (different team, different scaling, different deployment cycle) — not because it sounds better',
    'Every flash sale analysis must address three outcomes: no overselling, reasonable latency under extreme load, and recovery from partial failures',
  ],
};
