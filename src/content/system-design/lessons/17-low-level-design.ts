import type { Lesson } from '@/types';

export const lowLevelDesignLesson: Lesson = {
  id: 'low-level-design',
  slug: 'low-level-design',
  title: 'Low Level Design (LLD)',
  description:
    'Master object-oriented design for system design interviews: SOLID principles with real examples and violations, coupling and cohesion, UML basics, composition over inheritance, and dependency injection — the skills that separate senior engineers from juniors.',
  category: 'LLD',
  order: 17,
  difficulty: 'intermediate',
  estimatedTime: 50,
  prevLesson: 'high-level-design',
  nextLesson: 'design-patterns',

  content: `## What Is Low-Level Design?

High-level design (HLD) answers: what services exist, how they communicate, what databases to use. Low-level design (LLD) answers: inside one service, how do you structure the code? What classes exist? How do they relate? What are the responsibilities of each?

LLD is the difference between code that works and code that teams can maintain, extend, and test over years. A system can have perfect HLD and be unmaintainable in 6 months if the internal code design is poor.

**Why it matters in interviews:** Companies like Google, Amazon, and Uber explicitly test LLD in system design rounds. You may be asked to design a Parking Lot, Library System, or Hotel Booking system at the class level — with full class diagrams, relationships, and working code.

---

## Object-Oriented Design Fundamentals

### The Four Pillars of OOP

**Encapsulation:** Bundle data and the methods that operate on that data into a single unit (class). Hide internal implementation details; expose only what's needed through a public interface.

\`\`\`typescript
// Bad: data exposed, no control
class BankAccount {
  balance: number = 0;  // anyone can set balance = -999999
}

// Good: encapsulated
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    this.balance += amount;
  }

  getBalance(): number { return this.balance; }
}
\`\`\`

**Abstraction:** Show only what the caller needs, hide how it works. You use \`Array.sort()\` without knowing it's a TimSort implementation.

**Inheritance:** A child class inherits properties and behavior from a parent class. Use sparingly — prefer composition (covered below).

**Polymorphism:** Different objects respond to the same interface differently. A \`Shape.area()\` call works on both Circle and Rectangle, returning different results.

---

## SOLID Principles — Deep Dive

SOLID is not a checklist. Each principle solves a specific class of design problem. Understanding *why* each principle exists is more valuable than memorizing the acronym.

### S — Single Responsibility Principle

**Principle:** A class should have only one reason to change.

**The problem it solves:** When a class does multiple unrelated things, changes to one concern force you to touch (and potentially break) the other concerns. A class that handles user login AND sends welcome emails AND writes to the audit log will break in three different ways when you change any one of those concerns.

**Violation (bad):**
\`\`\`typescript
class UserService {
  createUser(data: UserData): User {
    // Create user in database
    const user = db.insert('users', data);

    // Send welcome email
    const emailBody = \`<h1>Welcome, \${user.name}!</h1>...\`;
    nodemailer.sendMail({ to: user.email, subject: 'Welcome', html: emailBody });

    // Write audit log
    fs.appendFileSync('/var/log/app.log', \`User \${user.id} created at \${new Date()}\`);

    return user;
  }
}
// Reasons to change: (1) database schema changes, (2) email template changes,
// (3) logging format changes, (4) new notification channel added
\`\`\`

**Correct (good):**
\`\`\`typescript
class UserRepository { createUser(data: UserData): User { /* only DB logic */ } }
class EmailService    { sendWelcome(user: User): void  { /* only email logic */ } }
class AuditLogger     { logCreation(user: User): void  { /* only logging */ } }

class UserCreationService {
  constructor(
    private repo: UserRepository,
    private email: EmailService,
    private audit: AuditLogger
  ) {}

  createUser(data: UserData): User {
    const user = this.repo.createUser(data);
    this.email.sendWelcome(user);
    this.audit.logCreation(user);
    return user;
  }
}
\`\`\`

**Real analogy:** A Swiss Army knife is a single physical tool with 10 responsibilities. It's useful in a survival kit but nobody uses a Swiss Army knife for serious cooking, surgery, or construction. Specialist tools outperform general ones for their specific job.

---

### O — Open/Closed Principle

**Principle:** Software entities should be open for extension, closed for modification.

**The problem it solves:** If adding a new feature requires modifying existing, tested, working code, you risk introducing regressions. The OCP says: design so new features are added by writing new code, not changing old code.

**Violation (bad):**
\`\`\`typescript
class PaymentProcessor {
  process(payment: Payment): void {
    if (payment.type === 'credit_card') {
      // process credit card...
    } else if (payment.type === 'paypal') {
      // process paypal...
    } else if (payment.type === 'crypto') {  // added new type → modified this class
      // process crypto...
    }
    // Every new payment type requires modifying this file
  }
}
\`\`\`

**Correct (good):**
\`\`\`typescript
interface PaymentStrategy {
  process(amount: number): void;
}

class CreditCardProcessor implements PaymentStrategy {
  process(amount: number) { /* credit card logic */ }
}
class PayPalProcessor implements PaymentStrategy {
  process(amount: number) { /* paypal logic */ }
}
class CryptoProcessor implements PaymentStrategy {  // new type = new class, no existing code touched
  process(amount: number) { /* crypto logic */ }
}

class PaymentService {
  process(strategy: PaymentStrategy, amount: number) {
    strategy.process(amount);  // unchanged — works with any current or future strategy
  }
}
\`\`\`

**Real analogy:** A USB port is open for extension (you can plug in any USB device ever invented) but closed for modification (you don't need to rebuild the computer to support a new USB peripheral).

---

### L — Liskov Substitution Principle

**Principle:** Objects of a subclass must be usable wherever the parent class is expected, without breaking the program.

**The problem it solves:** Inheritance should represent a true "is-a" relationship where the subtype can fully substitute the parent. Violations create surprises — code that works with the parent type mysteriously breaks when a subtype is substituted.

**Violation (bad):**
\`\`\`typescript
class Rectangle {
  setWidth(w: number)  { this.width = w; }
  setHeight(h: number) { this.height = h; }
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(w: number)  { this.width = w; this.height = w; } // breaks LSP
  setHeight(h: number) { this.width = h; this.height = h; } // breaks LSP
}

// Code that uses Rectangle:
function stretchWidth(rect: Rectangle) {
  rect.setWidth(rect.width * 2);
  // For Rectangle: area doubles. For Square: area quadruples. Different behavior!
  // Substituting Square for Rectangle breaks the program's logic.
}
\`\`\`

**Fix:** Don't model Square as a subclass of Rectangle. They have incompatible contracts. Use a common \`Shape\` interface with an \`area()\` method instead.

**Real analogy:** A penguin "is-a" bird, but if your code calls \`bird.fly()\`, substituting a Penguin breaks everything. The inheritance relationship violates LSP because Penguin can't fulfill the full behavioral contract of Bird.

---

### I — Interface Segregation Principle

**Principle:** No client should be forced to depend on methods it doesn't use. Prefer many small specific interfaces over one large fat interface.

**The problem it solves:** Fat interfaces create coupling to methods you don't need. When the fat interface changes, you're forced to update classes that only implement a subset of it.

**Violation (bad):**
\`\`\`typescript
interface Animal {
  eat(): void;
  sleep(): void;
  fly(): void;   // What about dogs?
  swim(): void;  // What about eagles?
  run(): void;   // What about fish?
}

class Dog implements Animal {
  eat()   { /* ok */ }
  sleep() { /* ok */ }
  fly()   { throw new Error('Dogs cannot fly'); } // forced to implement!
  swim()  { /* some dogs can swim */ }
  run()   { /* ok */ }
}
\`\`\`

**Correct (good):**
\`\`\`typescript
interface Eater   { eat(): void; }
interface Sleeper { sleep(): void; }
interface Flyer   { fly(): void; }
interface Swimmer { swim(): void; }
interface Runner  { run(): void; }

class Dog implements Eater, Sleeper, Swimmer, Runner {
  eat()   { /* ok */ }
  sleep() { /* ok */ }
  swim()  { /* ok */ }
  run()   { /* ok */ }
  // No fly() — not forced to implement what Dogs can't do
}

class Eagle implements Eater, Sleeper, Flyer, Runner {
  eat()   { /* ok */ }
  sleep() { /* ok */ }
  fly()   { /* ok */ }
  run()   { /* ok */ }
}
\`\`\`

**Real analogy:** A restaurant menu doesn't force you to order every item — you order exactly what you want. A fat interface is like being charged for the entire menu when you only ordered coffee.

---

### D — Dependency Inversion Principle

**Principle:** High-level modules should not depend on low-level modules. Both should depend on abstractions (interfaces). Abstractions should not depend on details; details should depend on abstractions.

**The problem it solves:** When high-level business logic directly instantiates low-level implementation details (like a specific database client), changing the implementation requires changing the business logic. By depending on an interface instead, you can swap implementations without touching business logic.

**Violation (bad):**
\`\`\`typescript
class OrderService {
  private db = new MySQLDatabase();  // hardcoded dependency on MySQL

  createOrder(data: OrderData): Order {
    return this.db.save('orders', data); // tied to MySQL forever
  }
}
// Switching to PostgreSQL requires changing OrderService
// Testing requires a real MySQL database
\`\`\`

**Correct (good):**
\`\`\`typescript
interface Database {
  save(table: string, data: object): any;
  find(table: string, id: string): any;
}

class OrderService {
  constructor(private db: Database) {} // depends on abstraction, not implementation

  createOrder(data: OrderData): Order {
    return this.db.save('orders', data);
  }
}

// Production:
const service = new OrderService(new MySQLDatabase());
// Testing:
const service = new OrderService(new InMemoryDatabase()); // no real DB needed
// Switch to Postgres:
const service = new OrderService(new PostgresDatabase()); // OrderService unchanged
\`\`\`

**Real analogy:** A power strip doesn't care if you plug in a lamp, a laptop, or a toaster — it depends on the interface (the plug standard), not on the specific device.

---

## Coupling and Cohesion

These two metrics define code quality at the class/module level.

### Coupling — How Much One Module Knows About Another

**Tight coupling (bad):** Class A directly uses Class B's concrete implementation. Changes to B require changes to A.

**Loose coupling (good):** Class A depends on an interface that B implements. A doesn't know anything about B specifically.

**How to achieve loose coupling:**
1. **Interfaces** — depend on abstractions
2. **Dependency injection** — receive dependencies from outside instead of creating them
3. **Events** — communicate through events instead of direct calls
4. **Facade** — interact with a complex system through a simplified interface

### Cohesion — How Closely Related the Responsibilities Within a Module Are

**High cohesion (good):** Everything in a class belongs together — they relate to the same concept and work together toward one purpose.
- \`UserRepository\` — all methods deal with user persistence
- \`EmailValidator\` — all methods deal with validating email formats

**Low cohesion (bad):** A class has unrelated responsibilities.
- \`UserUtils\` with methods: \`formatName()\`, \`sendEmail()\`, \`calculateTax()\`, \`parseCSV()\`
- These are four unrelated concepts crammed into one class

**The relationship:** High cohesion leads to low coupling. When each class does one thing well, classes don't need to know about each other's internals.

---

## UML Class Diagram Basics

UML is the standard visual language for expressing class design.

\`\`\`
┌─────────────────────────┐
│       ClassName         │   ← Class name
├─────────────────────────┤
│ - privateField: string  │   ← Fields
│ + publicField: number   │   - = private, + = public, # = protected
├─────────────────────────┤
│ + method(): void        │   ← Methods
│ - helper(x: int): bool  │
└─────────────────────────┘

Relationships:
─────────────────────────────────────────────────────────────
Association:   A ────────── B      A "uses" B (loose)
Aggregation:   A ◇────────── B     A "has" B, B can exist alone
Composition:   A ◆────────── B     A "owns" B, B cannot exist alone
Inheritance:   A ──────────▷ B     A "is-a" B (A extends B)
Implementation:A ─ ─ ─ ─ ─▷ B     A implements interface B
─────────────────────────────────────────────────────────────

Example — E-commerce Domain:
┌──────────┐          ┌──────────┐         ┌──────────┐
│  Order   │ ◆────────│OrderItem │─────────│  Product │
│──────────│  1    *  │──────────│  * to 1 │──────────│
│id        │          │quantity  │         │id        │
│status    │          │price     │         │name      │
│createOrder│         │getTotal()│         │stock     │
└──────────┘          └──────────┘         └──────────┘
    ▲
    │ extends
┌──────────────┐
│ SubscriptionOrder│
│──────────────│
│interval      │
│nextBillingDate│
└──────────────┘

- Order ◆── OrderItem: Composition (OrderItems cannot exist without an Order)
- OrderItem ──── Product: Association (Product exists independently)
- SubscriptionOrder ▷── Order: Inheritance (is-a Order)
\`\`\`

### Association vs Aggregation vs Composition

| Relationship | Symbol | Lifecycle | Real Example |
|-------------|--------|-----------|-------------|
| Association | ─────── | Independent | Student "uses" Library |
| Aggregation | ◇─────── | Parent can exist without child; child can exist without parent | Team ◇── Player (player survives team dissolution) |
| Composition | ◆─────── | Child cannot exist without parent | Order ◆── OrderItem (items have no meaning without the order) |

---

## Composition Over Inheritance

**The problem with deep inheritance hierarchies:**

\`\`\`
           Animal
          /      \\
     FlyingAnimal  SwimmingAnimal
         |              |
       Bird            Fish
       /   \\
   Duck   Eagle
\`\`\`

What happens when you need a Duck that also swims? Multiple inheritance (most languages don't support it). The hierarchy breaks.

**Composition solves this:**

\`\`\`typescript
// Behaviors as composable interfaces + implementations
interface Flyable   { fly(): void; }
interface Swimmable { swim(): void; }
interface Runnable  { run(): void; }

class FlyingBehavior  implements Flyable   { fly() { /* wing flap logic */ } }
class SwimmingBehavior implements Swimmable { swim() { /* paddle logic */ } }

class Duck {
  // Compose behaviors instead of inheriting
  private flyer  = new FlyingBehavior();
  private swimmer = new SwimmingBehavior();

  fly()  { this.flyer.fly(); }
  swim() { this.swimmer.swim(); }
}
// Duck can fly AND swim without multiple inheritance
// Behaviors can be reused by any class independently
\`\`\`

**Rule of thumb:** Use inheritance for "is-a" relationships where the subtype genuinely satisfies the LSP. Use composition for "has-a" or "can-do" relationships.

---

## Dependency Injection

**What it is:** Instead of a class creating its own dependencies, dependencies are "injected" from outside — passed in via the constructor, a setter, or a factory.

**Without DI:**
\`\`\`typescript
class ReportService {
  private db = new PostgresDatabase();    // tight coupling
  private mailer = new SendGridMailer(); // tight coupling
  // Cannot test without real Postgres and SendGrid
}
\`\`\`

**With DI (constructor injection):**
\`\`\`typescript
class ReportService {
  constructor(
    private db: Database,        // any Database implementation
    private mailer: Mailer       // any Mailer implementation
  ) {}
  // Test with in-memory mocks; production with real implementations
}
\`\`\`

**Why DI enables testability:** In tests, inject mock implementations that return predictable data without network calls or side effects. The class under test doesn't know or care.

**DI Containers:** Frameworks like InversifyJS (Node) or Spring (Java) automate dependency resolution — you declare dependencies, the container wires them together at startup.`,

  codeExamples: [
    {
      title: 'SOLID in Practice — Notification System',
      code: `// Full example applying all 5 SOLID principles to a notification system

// ── Interface Segregation (I) ─────────────────────────────────────────
// Small, focused interfaces — not one fat NotificationSender

interface EmailSender {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

interface SMSSender {
  sendSMS(to: string, message: string): Promise<void>;
}

interface PushSender {
  sendPush(deviceToken: string, message: string): Promise<void>;
}

// ── Dependency Inversion (D) ──────────────────────────────────────────
// Implementations depend on abstractions, not the other way around

class SendGridEmailSender implements EmailSender {
  async sendEmail(to: string, subject: string, body: string) {
    console.log(\`[SendGrid] Email to \${to}: \${subject}\`);
    // real SendGrid API call
  }
}

class TwilioSMSSender implements SMSSender {
  async sendSMS(to: string, message: string) {
    console.log(\`[Twilio] SMS to \${to}: \${message}\`);
  }
}

// ── Single Responsibility (S) ─────────────────────────────────────────
// Each class has exactly one reason to change

class UserPreferenceService {
  async getPreferredChannel(userId: string): Promise<'email' | 'sms' | 'push'> {
    // Fetch from DB — this class only knows about user preferences
    return 'email';
  }
}

// ── Open/Closed (O) ──────────────────────────────────────────────────
// New notification types = new classes, no modification of existing code

interface NotificationStrategy {
  notify(userId: string, message: string): Promise<void>;
}

class EmailNotificationStrategy implements NotificationStrategy {
  constructor(private sender: EmailSender) {}
  async notify(userId: string, message: string) {
    await this.sender.sendEmail(\`\${userId}@example.com\`, 'Notification', message);
  }
}

class SMSNotificationStrategy implements NotificationStrategy {
  constructor(private sender: SMSSender) {}
  async notify(userId: string, message: string) {
    await this.sender.sendSMS(userId, message);
  }
}

// ── Dependency Injection ──────────────────────────────────────────────
class NotificationService {
  private strategies: Record<string, NotificationStrategy>;

  constructor(
    private preferences: UserPreferenceService,
    emailSender: EmailSender,
    smsSender: SMSSender
  ) {
    // Strategies injected via constructor — easy to test with mocks
    this.strategies = {
      email: new EmailNotificationStrategy(emailSender),
      sms: new SMSNotificationStrategy(smsSender),
    };
  }

  async sendToUser(userId: string, message: string): Promise<void> {
    const channel = await this.preferences.getPreferredChannel(userId);
    const strategy = this.strategies[channel];
    if (!strategy) throw new Error(\`No strategy for channel: \${channel}\`);
    await strategy.notify(userId, message);
  }
}

// ── Wiring (production) ───────────────────────────────────────────────
const service = new NotificationService(
  new UserPreferenceService(),
  new SendGridEmailSender(),
  new TwilioSMSSender()
);

// ── Wiring (test) ─────────────────────────────────────────────────────
class MockEmailSender implements EmailSender {
  public sent: { to: string; subject: string; body: string }[] = [];
  async sendEmail(to: string, subject: string, body: string) {
    this.sent.push({ to, subject, body });
  }
}

const mockEmail = new MockEmailSender();
const testService = new NotificationService(
  new UserPreferenceService(),
  mockEmail,
  { sendSMS: async () => {} }
);

await testService.sendToUser('user123', 'Your order shipped!');
console.log(mockEmail.sent); // inspect without real email being sent`,
      explanation:
        'This example applies all 5 SOLID principles together: (S) each class has one job, (O) new channels require new classes not editing existing ones, (L) each strategy can substitute for NotificationStrategy, (I) three small interfaces instead of one fat one, (D) high-level service depends on abstractions injected from outside.',
    },
    {
      title: 'Composition Over Inheritance — Game Characters',
      code: `// Inheritance approach — breaks for complex combinations
// class Character → Warrior → ArcherWarrior? FlyingWarrior? FlyingArcherWarrior?
// Leads to combinatorial explosion

// Composition approach:

// ── Behavior interfaces ───────────────────────────────────────────────
interface AttackBehavior {
  attack(): string;
}
interface DefenseBehavior {
  defend(): string;
}
interface MovementBehavior {
  move(): string;
}

// ── Concrete behaviors ────────────────────────────────────────────────
class SwordAttack implements AttackBehavior {
  attack() { return 'Swing sword for 50 damage'; }
}
class BowAttack implements AttackBehavior {
  attack() { return 'Fire arrow for 30 damage'; }
}
class MagicAttack implements AttackBehavior {
  attack() { return 'Cast fireball for 80 damage'; }
}

class ShieldDefend implements DefenseBehavior {
  defend() { return 'Block with shield — reduce damage by 40%'; }
}
class DodgeDefend implements DefenseBehavior {
  defend() { return 'Dodge — 30% chance to avoid all damage'; }
}

class WalkMovement implements MovementBehavior {
  move() { return 'Walk at speed 5'; }
}
class FlyMovement implements MovementBehavior {
  move() { return 'Fly at speed 10'; }
}

// ── Character — composed, not inherited ──────────────────────────────
class Character {
  constructor(
    private name: string,
    private attack: AttackBehavior,
    private defense: DefenseBehavior,
    private movement: MovementBehavior
  ) {}

  performAttack()  { console.log(\`\${this.name}: \${this.attack.attack()}\`); }
  performDefense() { console.log(\`\${this.name}: \${this.defense.defend()}\`); }
  performMove()    { console.log(\`\${this.name}: \${this.movement.move()}\`); }

  // Change behavior at runtime (Strategy pattern!)
  equipWeapon(attack: AttackBehavior) { this.attack = attack; }
}

// ── Any combination without hierarchy explosion ───────────────────────
const warrior = new Character('Arthur', new SwordAttack(), new ShieldDefend(), new WalkMovement());
const flyingArcher = new Character('Legolas', new BowAttack(), new DodgeDefend(), new FlyMovement());
const wizard = new Character('Gandalf', new MagicAttack(), new DodgeDefend(), new FlyMovement());

warrior.performAttack();      // Arthur: Swing sword for 50 damage
flyingArcher.performMove();   // Legolas: Fly at speed 10

// Switch weapon at runtime
warrior.equipWeapon(new BowAttack());
warrior.performAttack(); // Arthur: Fire arrow for 30 damage`,
      explanation:
        'Composition makes each behavior independently reusable. Adding a new movement type (TeleportMovement) requires zero changes to existing classes. No inheritance hierarchy can elegantly handle all combinations of attack × defense × movement.',
    },
    {
      title: 'Dependency Injection — Testable Repository Pattern',
      code: `// Interface — the abstraction both sides depend on
interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}

// Production implementation
class PostgresUserRepository implements UserRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async create(data: CreateUserData): Promise<User> {
    const result = await this.pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [data.name, data.email]
    );
    return result.rows[0];
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const sets = Object.keys(data).map((k, i) => \`\${k} = $\${i + 2}\`).join(', ');
    const values = Object.values(data);
    const result = await this.pool.query(
      \`UPDATE users SET \${sets} WHERE id = $1 RETURNING *\`,
      [id, ...values]
    );
    return result.rows[0];
  }
}

// Test implementation — no database needed
class InMemoryUserRepository implements UserRepository {
  private store = new Map<string, User>();
  private nextId = 1;

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null;
  }

  async create(data: CreateUserData): Promise<User> {
    const user: User = { id: String(this.nextId++), ...data };
    this.store.set(user.id, user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const existing = this.store.get(id);
    if (!existing) throw new Error('User not found');
    const updated = { ...existing, ...data };
    this.store.set(id, updated);
    return updated;
  }
}

// Business service — depends on abstraction only
class UserService {
  constructor(private repo: UserRepository) {}

  async promoteToAdmin(userId: string): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('Already an admin');
    return this.repo.update(userId, { role: 'admin' });
  }
}

// Test with no database:
const testRepo = new InMemoryUserRepository();
const service = new UserService(testRepo);

await testRepo.create({ name: 'Alice', email: 'alice@example.com', role: 'user' });
const promoted = await service.promoteToAdmin('1');
console.log(promoted.role); // 'admin'

// Production:
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
const prodService = new UserService(new PostgresUserRepository(pgPool));`,
      explanation:
        'UserService depends on the UserRepository interface, not PostgreSQL. This makes unit testing trivially easy (InMemoryUserRepository) and makes switching databases possible without touching business logic.',
    },
  ],

  commonMistakes: [
    "Treating inheritance as the default code reuse mechanism — inheritance creates the tightest possible coupling (subclass knows parent's internals). Default to composition; use inheritance only for genuine 'is-a' relationships that satisfy LSP.",
    'Writing "God classes" — single classes with hundreds of methods and thousands of lines, handling user management, billing, email, logging, and everything else. One class, one responsibility.',
    'Depending on concrete classes instead of interfaces — when a class directly instantiates \`new MySQLDatabase()\` inside itself, you can never test it without a real MySQL database and can never switch to a different database.',
    'Violating LSP by throwing exceptions in subclass methods that the parent does not throw — callers of the parent class don\'t expect exceptions, so substituting the subclass breaks their code.',
    "Creating fat interfaces that force implementors to stub methods with 'throw new Error(\"not implemented\")' — this is a clear ISP violation. Split the interface.",
    "Confusing aggregation with composition — aggregation means the child can exist independently (Team/Player); composition means the child's lifecycle is tied to the parent's (Order/OrderItem). Getting this wrong produces misleading UML.",
    "Putting business logic in constructors — constructors should only set up state, not make network calls, read files, or compute complex results. This makes testing very hard because you can't construct the object in tests without side effects.",
    "Over-engineering with SOLID on a 10-line script — SOLID principles add indirection and abstraction layers that have a cost. Apply them when complexity justifies it; don't add interfaces 'just in case' to code that will never change.",
  ],

  interviewQuestions: [
    {
      question: 'Explain the Single Responsibility Principle and give a real example of a violation and how to fix it.',
      difficulty: 'intermediate',
      answer:
        "SRP states a class should have only one reason to change — meaning it should encapsulate exactly one concept or responsibility. Violation example: a UserService class that handles user creation, sends welcome emails, writes audit logs, and validates email formats. Each of these is a separate reason to change: the email template changes → modify UserService; the logging format changes → modify UserService; validation rules change → modify UserService. These modifications risk breaking unrelated functionality. Fix: split into UserRepository (DB), EmailService (email), AuditLogger (logs), and EmailValidator (validation). UserCreationService orchestrates them via dependency injection.",
      followUp: ['How granular should you take SRP — should every function be its own class?'],
      tip: "The key phrase is 'reason to change' — a class is well-designed if there is exactly one type of business change that would require modifying it.",
    },
    {
      question: "What is the Dependency Inversion Principle and how does it relate to testability?",
      difficulty: 'intermediate',
      answer:
        "DIP states that high-level modules should depend on abstractions (interfaces), not low-level concrete implementations. Instead of a class doing \`private db = new MySQLDatabase()\` (depends on concrete), inject the dependency: \`constructor(private db: Database) {}\` where Database is an interface. This transforms testing: in production, inject the real MySQL implementation; in tests, inject an in-memory mock that returns predictable data without network connections. Tests become fast (no I/O), isolated (no external dependencies), and deterministic (controlled data). DIP is the architectural foundation of dependency injection frameworks.",
      tip: 'Lead with the testability angle — interviewers care about whether candidates have actually written tests and understand why DI makes testing possible.',
    },
    {
      question: 'What is the difference between composition and inheritance? When should you use each?',
      difficulty: 'intermediate',
      answer:
        "Inheritance is an 'is-a' relationship where a subclass inherits and can override parent behavior. It creates tight coupling (subclass knows parent internals), makes the hierarchy rigid, and causes the 'fragile base class' problem (parent changes break all subclasses). Composition is 'has-a' — a class holds references to objects that implement behavior, delegating to them. Composition is more flexible: behaviors can be swapped at runtime, mixed freely, and changed independently. Use inheritance when: the subclass is genuinely a specialized version of the parent and satisfies Liskov Substitution (Dog is-an Animal). Use composition when: you need to combine behaviors (a Duck that both flies AND swims), or when you want to swap behaviors at runtime (Strategy pattern).",
      tip: "The 'prefer composition over inheritance' guideline from the Gang of Four Design Patterns book is a key signal that you've read the foundational literature.",
    },
    {
      question: 'What is the difference between composition, aggregation, and association in UML?',
      difficulty: 'beginner',
      answer:
        "Association: two classes know about each other but are independent — a Student 'uses' a Library. Aggregation: a 'whole/part' relationship where the part can exist independently if the whole is destroyed — a Team contains Players, but players exist without the team. Lifecycle independent. Aggregation uses a hollow diamond (◇). Composition: a strong whole/part relationship where the part cannot exist without the whole — an Order contains OrderItems; if you delete the Order, the OrderItems have no meaning and are deleted too. Lifecycle dependent. Composition uses a filled diamond (◆). The distinction matters for deletion semantics in your data model and determines cascading behavior in ORMs.",
      tip: 'Use the lifecycle question to distinguish: "If I delete the parent, does the child still make sense?" Yes → aggregation. No → composition.',
    },
    {
      question: 'Give a concrete example of how violating the Open/Closed Principle creates maintenance problems.',
      difficulty: 'intermediate',
      answer:
        "Classic example: a discount calculation function with if/else for each customer type. Adding a 'loyalty member' discount requires opening and modifying the existing function — which is tested, deployed, and works in production. Every modification risks introducing bugs in existing discount types, requires retesting all cases, and creates merge conflicts when multiple developers add discount types simultaneously. OCP fix: define a DiscountStrategy interface, create a class per discount type (RegularDiscount, PremiumDiscount, LoyaltyDiscount). Adding loyalty members = new class, zero changes to existing code. No regressions possible in existing code because existing code wasn't touched.",
      tip: "Frame the answer in terms of risk: 'modifying existing tested code' = regression risk. The OCP reduces regression risk by making extensions additive.",
    },
    {
      question: 'What is cohesion and how does it relate to coupling?',
      difficulty: 'intermediate',
      answer:
        "Cohesion measures how closely related the responsibilities within a single module are. High cohesion: a class does one thing, and all its methods work together toward that one purpose (UserRepository — all methods deal with user persistence). Low cohesion: a 'Utils' class with formatDate(), sendEmail(), calculateTax(), parseCSV() — unrelated responsibilities bundled together. High cohesion and low coupling reinforce each other: when a class is focused (high cohesion), it exposes a small, stable interface and doesn't need to know about many other classes (low coupling). Low-cohesion classes tend to have many dependencies because they do many different things.",
      tip: "If you find yourself naming a class 'Manager', 'Utils', 'Helper', or 'Service' with more than ~5 methods, check its cohesion — these names often hide low cohesion.",
    },
  ],

  exercises: [
    {
      id: 'lld-ex-1',
      title: 'Refactor a Monolithic Class Using SOLID',
      description:
        "The following UserManager class violates multiple SOLID principles. Identify all violations, then refactor it into a properly designed set of classes. The original class: creates users (DB write), validates email format, sends welcome email, logs to console, and generates an avatar URL from a third-party service. Your refactoring should: (1) Apply SRP — split into focused classes. (2) Apply DIP — depend on interfaces. (3) Ensure the new design is testable without real DB, email, or external APIs.",
      starterCode: `class UserManager {
  private dbConnection = new MySQLConnection(process.env.DB_URL!);
  private emailClient = new NodeMailer({ host: 'smtp.gmail.com' });

  async createUser(name: string, email: string, password: string): Promise<User> {
    // Validate email
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) throw new Error('Invalid email');

    // Hash password
    const hash = require('bcrypt').hashSync(password, 10);

    // Save to DB
    const user = await this.dbConnection.query(
      \`INSERT INTO users (name, email, hash) VALUES ('\${name}', '\${email}', '\${hash}')\`
    );

    // Send email
    await this.emailClient.sendMail({
      to: email,
      subject: 'Welcome!',
      text: \`Hi \${name}, welcome to our platform!\`,
    });

    // Generate avatar
    const avatarUrl = \`https://avatars.dicebear.com/api/identicon/\${email}.svg\`;
    await this.dbConnection.query(\`UPDATE users SET avatar = '\${avatarUrl}' WHERE id = \${user.id}\`);

    // Log
    console.log(\`[INFO] User \${user.id} (\${email}) created at \${new Date()}\`);

    return user;
  }
}`,
      solution: `// ── Interfaces (Dependency Inversion) ────────────────────────────────
interface UserRepository {
  create(name: string, email: string, passwordHash: string): Promise<User>;
  updateAvatar(id: string, avatarUrl: string): Promise<void>;
}

interface EmailService {
  sendWelcome(name: string, email: string): Promise<void>;
}

interface AvatarService {
  getAvatarUrl(email: string): string;
}

interface PasswordHasher {
  hash(password: string): Promise<string>;
}

interface Logger {
  info(message: string): void;
}

interface EmailValidator {
  validate(email: string): boolean;
}

// ── Implementations (each has Single Responsibility) ──────────────────
class PostgresUserRepository implements UserRepository {
  constructor(private pool: Pool) {}
  async create(name: string, email: string, passwordHash: string): Promise<User> {
    // Uses parameterized queries (fixes SQL injection from original)
    const r = await this.pool.query(
      'INSERT INTO users (name, email, hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, passwordHash]
    );
    return r.rows[0];
  }
  async updateAvatar(id: string, avatarUrl: string): Promise<void> {
    await this.pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarUrl, id]);
  }
}

class WelcomeEmailService implements EmailService {
  constructor(private mailer: Transporter) {}
  async sendWelcome(name: string, email: string) {
    await this.mailer.sendMail({
      to: email, subject: 'Welcome!',
      text: \`Hi \${name}, welcome to our platform!\`,
    });
  }
}

class DiceBearAvatarService implements AvatarService {
  getAvatarUrl(email: string) {
    return \`https://avatars.dicebear.com/api/identicon/\${email}.svg\`;
  }
}

class BcryptHasher implements PasswordHasher {
  async hash(password: string) { return bcrypt.hash(password, 10); }
}

class ConsoleLogger implements Logger {
  info(message: string) { console.log(\`[INFO] \${new Date().toISOString()} \${message}\`); }
}

class RegexEmailValidator implements EmailValidator {
  validate(email: string) { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email); }
}

// ── Orchestrator (Open/Closed — new features = new classes) ──────────
class UserRegistrationService {
  constructor(
    private repo: UserRepository,
    private email: EmailService,
    private avatar: AvatarService,
    private hasher: PasswordHasher,
    private logger: Logger,
    private validator: EmailValidator
  ) {}

  async register(name: string, emailAddress: string, password: string): Promise<User> {
    if (!this.validator.validate(emailAddress)) {
      throw new Error('Invalid email format');
    }

    const passwordHash = await this.hasher.hash(password);
    const user = await this.repo.create(name, emailAddress, passwordHash);

    const avatarUrl = this.avatar.getAvatarUrl(emailAddress);
    await this.repo.updateAvatar(user.id, avatarUrl);

    await this.email.sendWelcome(name, emailAddress);
    this.logger.info(\`User \${user.id} (\${emailAddress}) created\`);

    return user;
  }
}`,
      hints: [
        'Count the reasons to change in the original: (1) DB changes, (2) email template changes, (3) avatar service changes, (4) logging format changes, (5) email validation rules change — 5 reasons = 5 classes.',
        'The SQL injection in the original is a bonus bug to fix with parameterized queries in the refactored version.',
        'The original has two `this.dbConnection.query()` calls (insert + update avatar) — in the refactored version, both become methods on UserRepository.',
      ],
    },
    {
      id: 'lld-ex-2',
      title: 'Design a Parking Lot System',
      description:
        "Design the class structure for a parking lot system with these requirements: (1) Multiple levels, each with multiple spots. (2) Three spot types: Compact, Regular, Large. (3) Vehicles: Motorcycle (fits any spot), Car (fits Regular or Large), Truck (fits Large only). (4) parkVehicle() finds the nearest available suitable spot and parks the vehicle. (5) unparkVehicle() frees the spot and returns the parking fee. (6) Fee: $2/hour for Compact, $3/hour for Regular, $4/hour for Large. Design the class diagram (describe in code), apply SOLID principles, and explain your design decisions.",
      starterCode: `// Design the complete class hierarchy for this parking lot.
// Start by identifying:
// 1. What are the entities (nouns)?
// 2. What behaviors do they have (verbs)?
// 3. What relationships exist between them?
// 4. What can vary (should be abstracted)?

// Hint: Think about what varies:
// - Vehicle size and which spots they fit
// - Spot availability and type
// - Fee calculation (different per spot type)

// Sketch your class design here:
enum VehicleType { /* ? */ }
enum SpotType { /* ? */ }

interface Vehicle { /* ? */ }
interface ParkingSpot { /* ? */ }
interface FeeCalculator { /* ? */ }
class ParkingLot { /* ? */ }
class ParkingLevel { /* ? */ }`,
      solution: `// ── Enums ─────────────────────────────────────────────────────────────
enum VehicleSize { SMALL, MEDIUM, LARGE }
enum SpotSize    { COMPACT, REGULAR, LARGE }

// ── Vehicles (Liskov: any Vehicle can substitute for any other) ───────
abstract class Vehicle {
  constructor(
    public readonly licensePlate: string,
    public readonly size: VehicleSize
  ) {}
  abstract canFitIn(spot: SpotSize): boolean;
}

class Motorcycle extends Vehicle {
  constructor(plate: string) { super(plate, VehicleSize.SMALL); }
  canFitIn(_spot: SpotSize) { return true; } // fits anywhere
}

class Car extends Vehicle {
  constructor(plate: string) { super(plate, VehicleSize.MEDIUM); }
  canFitIn(spot: SpotSize) { return spot === SpotSize.REGULAR || spot === SpotSize.LARGE; }
}

class Truck extends Vehicle {
  constructor(plate: string) { super(plate, VehicleSize.LARGE); }
  canFitIn(spot: SpotSize) { return spot === SpotSize.LARGE; }
}

// ── Fee Calculator (Open/Closed — new spot types = new classes) ───────
interface FeeCalculator {
  calculate(hours: number): number;
}

class CompactFee  implements FeeCalculator { calculate(h: number) { return h * 2; } }
class RegularFee  implements FeeCalculator { calculate(h: number) { return h * 3; } }
class LargeFee    implements FeeCalculator { calculate(h: number) { return h * 4; } }

// ── Parking Spot (Single Responsibility: manages one spot's state) ────
class ParkingSpot {
  private vehicle: Vehicle | null = null;
  private parkedAt: Date | null = null;

  constructor(
    public readonly id: string,
    public readonly size: SpotSize,
    private readonly feeCalc: FeeCalculator
  ) {}

  get isAvailable() { return this.vehicle === null; }
  get canFit()      { return (v: Vehicle) => v.canFitIn(this.size); }

  park(vehicle: Vehicle): void {
    if (!this.isAvailable) throw new Error('Spot occupied');
    if (!vehicle.canFitIn(this.size)) throw new Error('Vehicle too large for spot');
    this.vehicle = vehicle;
    this.parkedAt = new Date();
  }

  unpark(): number {
    if (!this.vehicle || !this.parkedAt) throw new Error('Spot is empty');
    const hours = (Date.now() - this.parkedAt.getTime()) / 3600000;
    const fee = this.feeCalc.calculate(Math.ceil(hours));
    this.vehicle = null;
    this.parkedAt = null;
    return fee;
  }
}

// ── Parking Level ──────────────────────────────────────────────────────
class ParkingLevel {
  constructor(
    public readonly levelNumber: number,
    public readonly spots: ParkingSpot[]
  ) {}

  findSpotFor(vehicle: Vehicle): ParkingSpot | null {
    return this.spots.find(s => s.isAvailable && vehicle.canFitIn(s.size)) ?? null;
  }
}

// ── Parking Lot (orchestrator) ─────────────────────────────────────────
class ParkingLot {
  private parkedVehicles = new Map<string, ParkingSpot>();

  constructor(private levels: ParkingLevel[]) {}

  parkVehicle(vehicle: Vehicle): ParkingSpot {
    for (const level of this.levels) {
      const spot = level.findSpotFor(vehicle);
      if (spot) {
        spot.park(vehicle);
        this.parkedVehicles.set(vehicle.licensePlate, spot);
        console.log(\`Parked \${vehicle.licensePlate} in spot \${spot.id} (Level \${level.levelNumber})\`);
        return spot;
      }
    }
    throw new Error('Parking lot is full');
  }

  unparkVehicle(licensePlate: string): number {
    const spot = this.parkedVehicles.get(licensePlate);
    if (!spot) throw new Error('Vehicle not found');
    const fee = spot.unpark();
    this.parkedVehicles.delete(licensePlate);
    console.log(\`\${licensePlate} unparked. Fee: $\${fee.toFixed(2)}\`);
    return fee;
  }
}`,
      hints: [
        'Start with the entities: Vehicle, ParkingSpot, ParkingLevel, ParkingLot. Then add behaviors.',
        'The fee calculation varies by spot type — this is the OCP signal. FeeCalculator interface with one implementation per spot type.',
        "Vehicle's canFitIn() method puts the fitting logic on the vehicle itself — the spot just asks the vehicle if it fits, rather than the lot hardcoding size rules for each vehicle type.",
      ],
    },
  ],

  keyTakeaways: [
    "SOLID is not a checklist — each principle solves a specific problem. S eliminates unnecessary coupling between unrelated concerns. O makes additions safe. L ensures substitutability. I prevents forced dependencies. D enables flexibility and testability.",
    "Single Responsibility: 'reason to change' is the key phrase. If you can name multiple business changes that would require editing a class, split it.",
    "Open/Closed is achieved by depending on abstractions (interfaces) and introducing new behavior through new implementations, not by modifying existing code.",
    "Liskov Substitution: if your subclass overrides a method to throw 'not implemented', you've violated LSP. The inheritance hierarchy is wrong.",
    "Dependency Inversion is the architectural principle behind all testability. If you can't unit test a class without real databases and network calls, it violates DIP.",
    "Prefer composition over inheritance for code reuse. Inheritance creates the tightest possible coupling. Composition is flexible, mixable, and swappable at runtime.",
    "High cohesion and low coupling reinforce each other. Focused classes (high cohesion) naturally expose small interfaces (low coupling).",
    "Constructor injection is the preferred DI pattern — dependencies are visible, required, and immutable. It makes the class's dependencies explicit.",
    "In UML: composition (◆) means the child's lifecycle depends on the parent; aggregation (◇) means they're independent. This maps directly to cascade-delete behavior in your database.",
    "SOLID applies at the appropriate scale. Don't extract a one-method interface 'just in case'. Apply principles where complexity genuinely justifies the added indirection.",
  ],
};
