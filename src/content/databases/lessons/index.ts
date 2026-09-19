import type { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: 'introduction-to-databases',
    slug: 'introduction-to-databases',
    title: 'Introduction to Databases',
    description: 'Understand what data is, why databases exist, and how real companies like Instagram, Amazon, and Uber use them.',
    category: 'Introduction',
    order: 1,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## What is Data?

Data is any piece of information that can be stored and used. A user's name, an order total, a photo URL, a chat message — all of that is data.

**Real-world analogy:** Data is like raw ingredients in a kitchen. A database is the organized refrigerator that stores them by category so you can find exactly what you need instantly.

Every action you take online generates data:
- You log in → username + password checked
- You post a photo → image URL stored + linked to your profile
- You place an order → product, quantity, address, price all saved
- You send a message → text + sender + receiver + timestamp recorded

---

## What is a Database?

A database is an **organized collection of structured data** stored so it can be easily accessed, managed, and updated.

Think of it as a super-powered spreadsheet that can:
- Store millions of rows without slowing down
- Find a single record in milliseconds
- Handle thousands of users reading and writing at the same time
- Protect data from corruption and loss
- Enforce rules so bad data never gets in

---

## Why Databases Exist — The Problem with File Storage

Before databases, developers stored data in plain files (CSV, JSON, TXT). This caused real problems:

**Problem 1: No concurrent access**
If two users write to the same file at the same time, data gets corrupted. Imagine two cashiers editing the same spreadsheet simultaneously.

**Problem 2: No search speed**
To find one user among 10 million, you must read the entire file line by line. That takes seconds — unacceptable.

**Problem 3: No relationships**
A file can't say "this order belongs to this user who lives at this address." You'd duplicate data everywhere.

**Problem 4: No data integrity**
Nothing stops someone from saving an age of -5, an email without @, or leaving a required field empty.

**Problem 5: No transactions**
If a payment is deducted but the order creation fails halfway, the money is gone but no order exists. Databases prevent this.

**Databases solve all five problems.**

---

## Why Companies Use Databases

| Company | What they store | Why databases matter |
|---------|----------------|----------------------|
| Instagram | Photos, followers, likes, comments | 2 billion users — file storage would crash in seconds |
| WhatsApp | Messages, delivery status, groups | Messages must be delivered exactly once, in order |
| Amazon | Products, inventory, orders, users | One wrong inventory count = selling items you don't have |
| Netflix | Movies, watch history, recommendations | Recommendations require querying millions of rows per user |
| Uber | Drivers, riders, locations, rides | Real-time matching requires sub-millisecond queries |

---

## How to Think About This

Databases are not optional for serious software. Every backend application uses at least one. Whether you're building a side project or working at a FAANG company, you will write database queries every day.

The good news: the core concepts are the same everywhere. Learn them once, apply them anywhere.`,
    codeExamples: [
      {
        title: 'What a database table looks like',
        code: `-- This is a database table called "users"
-- Each row is one user. Each column is one piece of data.

| id | name    | email              | created_at          |
|----|---------|---------------------|---------------------|
|  1 | Alice   | alice@example.com  | 2024-01-15 10:00:00 |
|  2 | Bob     | bob@example.com    | 2024-01-16 11:30:00 |
|  3 | Charlie | charlie@example.com| 2024-01-17 09:15:00 |

-- To find Alice's email:
SELECT email FROM users WHERE name = 'Alice';
-- Result: alice@example.com (instant, even with 10 million rows)`,
        explanation: 'A table organizes data into rows and columns. SQL lets you query exactly what you need in milliseconds.',
      },
      {
        title: 'What file storage looks like vs a database',
        code: `// BAD: Storing users in a JSON file
// users.json
[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob",   "email": "bob@example.com" }
]

// To find Bob: you read the ENTIRE file into memory, then loop
const users = JSON.parse(fs.readFileSync('users.json'));
const bob = users.find(u => u.name === 'Bob'); // O(n) scan

// GOOD: Database query
// SELECT * FROM users WHERE name = 'Bob';
// Result: instant lookup via index, no full scan`,
        explanation: 'File storage requires scanning everything. Databases use indexes for instant lookups.',
      },
    ],
    commonMistakes: [
      'Treating databases as just "fancy spreadsheets" — they handle concurrency, integrity, and scale that spreadsheets cannot.',
      'Using JSON files for production data — fine for config, not for user data that needs querying, relationships, or concurrent access.',
      'Not thinking about the database early — database design affects everything else in your application.',
      'Assuming you only need one database — modern apps often use SQL for structured data AND Redis for caching AND object storage for files.',
    ],
    interviewQuestions: [
      {
        question: 'What is a database and why do we need one instead of just using files?',
        answer: 'A database is an organized system for storing, retrieving, and managing data. We need it instead of files because databases provide: concurrent access without corruption, indexed lookups instead of full scans, relational integrity between data, ACID transactions for safety, and enforced data validation. Files break under any real-world load.',
        difficulty: 'beginner',
      },
      {
        question: 'What problems does a database solve that a plain file cannot?',
        answer: 'Five key problems: (1) Concurrent writes — multiple users can read/write safely. (2) Fast search — indexes find records in O(log n) not O(n). (3) Relationships — foreign keys link tables without duplicating data. (4) Integrity — constraints reject invalid data at insert time. (5) Transactions — all-or-nothing operations prevent partial failures.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between data and a database?',
        answer: 'Data is raw information (a name, a number, a date). A database is the organized system that stores data with structure, rules, and efficient access patterns. Data is the content; the database is the container with intelligence built in.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'db-ex-1-1',
        title: 'Identify the problem',
        description: 'A startup is storing all user orders in a file called orders.json. List 3 specific problems they will face as they grow to 100,000 users.',
        starterCode: `// Think about:
// 1. What happens when two users place orders at exactly the same time?
// 2. How long does it take to find all orders from user #50000?
// 3. What if the server crashes halfway through writing a payment?

// Write your 3 problems here as comments:
// Problem 1:
// Problem 2:
// Problem 3:`,
        solution: `// Problem 1: Race condition — two simultaneous writes corrupt the file.
//             User A and User B both read the file, both add their order,
//             whoever saves last overwrites the other's order.
//
// Problem 2: Slow search — finding orders for user #50000 requires reading
//             and parsing the entire file. At 100k orders that could take seconds.
//
// Problem 3: No atomic transactions — if the server crashes after deducting
//             payment but before writing the order, money is lost with no record.`,
        hints: [
          'Think about simultaneous users',
          'Think about search performance as data grows',
          'Think about what happens if a crash occurs mid-write',
        ],
      },
    ],
    keyTakeaways: [
      'Data is any stored information. A database is an organized system for managing it.',
      'File storage fails at scale due to concurrency, speed, and integrity issues.',
      'Every real application — Instagram, Uber, Amazon — depends on databases.',
      'Databases solve 5 core problems: concurrent access, fast search, relationships, integrity, transactions.',
      'Learning databases is non-negotiable for any backend or full-stack developer.',
    ],
    nextLesson: 'types-of-databases',
  },

  // ─── LESSON 2 ────────────────────────────────────────────────────────────────
  {
    id: 'types-of-databases',
    slug: 'types-of-databases',
    title: 'Types of Databases',
    description: 'Relational, Document, Key-Value, Wide Column, Graph, Vector — understand every database category and when to use each.',
    category: 'Introduction',
    order: 2,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## Why There Are Multiple Types of Databases

No single database is best for everything. Different data shapes and access patterns need different storage engines.

**Analogy:** A toolbox has hammers, screwdrivers, and wrenches. You don't use a hammer for every job. Databases are the same — choose the right tool for the shape of your problem.

---

## 1. Relational Databases (SQL)

**Examples:** PostgreSQL, MySQL, SQLite, SQL Server

Data is stored in **tables** (like spreadsheets) with **rows** (records) and **columns** (fields). Tables link to each other via **foreign keys**.

**When to use:**
- Your data has clear relationships (users → orders → products)
- You need complex queries joining multiple tables
- Data integrity matters (banking, e-commerce, healthcare)
- You need ACID transactions

**Real-world:** Amazon's order system, banking software, hospital records, any e-commerce backend.

| users |          | orders |              |
|-------|----------|--------|--------------|
| id    | name     | id     | user_id      |
| 1     | Alice    | 101    | 1 (Alice)    |
| 2     | Bob      | 102    | 1 (Alice)    |

---

## 2. Document Databases (NoSQL)

**Examples:** MongoDB, CouchDB

Data is stored as **documents** (JSON-like objects) grouped in **collections**. Each document can have a different structure.

**When to use:**
- Your data structure varies between records (product catalog with different attributes)
- You're building with JavaScript/Node.js (native JSON)
- You need flexibility to add new fields without migrations
- Read-heavy workloads

**Real-world:** MongoDB powers Uber's trip metadata, Airbnb's listings, Lyft's ride data.

**Document example:**
\`\`\`json
{
  "_id": "64a7f1b2c3d4e5f6a7b8c9d0",
  "name": "Alice",
  "email": "alice@example.com",
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "orders": [101, 102]
}
\`\`\`

---

## 3. Key-Value Databases

**Examples:** Redis, DynamoDB (can act as one), Memcached

Data is stored as simple **key → value** pairs. Extremely fast. No complex queries — just get and set by key.

**When to use:**
- Caching (store computed results to avoid re-querying)
- Sessions (store logged-in user data)
- Rate limiting (track request counts per IP)
- Real-time leaderboards

**Real-world:** Twitter uses Redis for timeline caching. Instagram uses it for session storage. Every major app uses Redis in its stack.

\`\`\`
Key:   "session:user:1234"
Value: { "userId": 1234, "name": "Alice", "role": "admin" }

Key:   "cache:homepage:trending"
Value: "[...list of trending posts...]"
\`\`\`

---

## 4. Wide Column Databases

**Examples:** Apache Cassandra, Google Bigtable, HBase

Data is stored in rows but columns can vary per row and are grouped into **column families**. Optimized for massive write throughput across distributed clusters.

**When to use:**
- Time-series data (IoT sensor readings, logs, metrics)
- Extremely high write volumes (billions of events/day)
- Data that's naturally partitioned by a key (user activity by userId)

**Real-world:** Netflix uses Cassandra for viewer activity tracking. Discord uses it to store trillions of messages. Apple uses it for iCloud.

---

## 5. Graph Databases

**Examples:** Neo4j, Amazon Neptune

Data is stored as **nodes** (entities) connected by **edges** (relationships). Perfect when the relationships between data are as important as the data itself.

**When to use:**
- Social networks (friends of friends)
- Recommendation engines
- Fraud detection (finding connected fraudulent accounts)
- Knowledge graphs

**Real-world:** LinkedIn's "People You May Know" runs on graph databases. Facebook's social graph. Google's Knowledge Graph.

\`\`\`
(Alice) --[FOLLOWS]--> (Bob)
(Bob)   --[FOLLOWS]--> (Charlie)
(Alice) --[LIKES]-->   (Post #42)
\`\`\`

---

## 6. Vector Databases

**Examples:** Pinecone, Weaviate, Chroma, pgvector

Data is stored as **vectors** — arrays of numbers that represent the semantic meaning of text, images, or audio. Used for similarity search: "find the 10 most similar items to this one."

**When to use:**
- AI applications (semantic search, RAG — Retrieval Augmented Generation)
- Image similarity search
- Recommendation systems based on meaning, not keywords
- Chatbots that need to retrieve relevant context

**Real-world:** ChatGPT plugins use vector databases to find relevant knowledge. Every modern AI app with "search" uses them.

\`\`\`
Text: "database performance optimization"
Vector: [0.82, -0.14, 0.67, 0.33, ...] (1536 numbers)

Query: "how to make queries faster"
→ Find the 5 vectors closest in space
→ Return those documents as context
\`\`\`

---

## Comparison Table

| Type | Best For | Examples | Query Style |
|------|----------|----------|-------------|
| Relational | Structured data + relationships | PostgreSQL, MySQL | SQL |
| Document | Flexible JSON data | MongoDB, CouchDB | JSON queries |
| Key-Value | Caching, sessions | Redis | GET/SET by key |
| Wide Column | Time-series, massive writes | Cassandra | CQL |
| Graph | Relationships, networks | Neo4j | Cypher |
| Vector | AI, semantic search | Pinecone, Chroma | ANN search |`,
    codeExamples: [
      {
        title: 'SQL (Relational) — structured, related data',
        code: `-- PostgreSQL / MySQL
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100
ORDER BY o.total DESC;

-- Result: every user with orders over $100, newest first`,
        explanation: 'SQL joins let you query across related tables. Perfect for structured, relational data.',
      },
      {
        title: 'MongoDB (Document) — flexible JSON documents',
        code: `// Find all users in New York with more than 2 orders
db.users.find({
  "address.city": "New York",
  "orders": { $size: { $gt: 2 } }
});

// Insert a user with a completely different structure
db.users.insertOne({
  name: "Product Manager",
  skills: ["roadmaps", "stakeholders"],  // no email, no orders
  experience: 8
});
// MongoDB allows it — no fixed schema required`,
        explanation: 'MongoDB documents are flexible. Two documents in the same collection can have entirely different fields.',
      },
      {
        title: 'Redis (Key-Value) — instant cache and sessions',
        code: `// Node.js with Redis
const redis = require('redis');
const client = redis.createClient();

// Cache a database result for 60 seconds
await client.setEx('user:1:profile', 60, JSON.stringify(userProfile));

// Retrieve it (no database hit needed)
const cached = await client.get('user:1:profile');
if (cached) return JSON.parse(cached); // instant!

// Rate limiting: track API calls per user
await client.incr('rate:user:1');         // increment
await client.expire('rate:user:1', 3600); // reset after 1 hour
const calls = await client.get('rate:user:1');
if (calls > 100) throw new Error('Rate limit exceeded');`,
        explanation: 'Redis stores data in RAM — reads take microseconds. Use it to cache heavy database queries.',
      },
    ],
    commonMistakes: [
      'Using MongoDB for everything just because it is "easier" — relational data belongs in a relational database.',
      'Using PostgreSQL for caching — relational databases are not optimized for key-value access patterns.',
      'Choosing a database based on hype, not your data shape and access patterns.',
      'Thinking NoSQL means "no schema" — MongoDB, Cassandra all benefit from consistent document/row structure.',
      'Starting with a graph database when a relational JOIN query would work perfectly.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between SQL and NoSQL databases?',
        answer: 'SQL databases use fixed schemas with tables, rows, and columns and support ACID transactions and complex joins. NoSQL databases (document, key-value, wide-column, graph) use flexible schemas, prioritize scalability and speed, and are optimized for specific data shapes. Use SQL when you have relational, structured data. Use NoSQL when you have flexible, high-volume, or specialized access patterns.',
        difficulty: 'beginner',
      },
      {
        question: 'When would you choose MongoDB over PostgreSQL?',
        answer: 'Choose MongoDB when: your data structure varies between records (e.g., a product catalog where phones have different attributes than furniture), you are building a Node.js app and want native JSON storage, your schema is evolving rapidly, or you need horizontal scaling across many servers. Choose PostgreSQL when you need joins, ACID transactions, data integrity, or complex analytical queries.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a vector database and why is it important for AI?',
        answer: 'A vector database stores high-dimensional vectors (numeric representations of text, images, or audio) and supports "similarity search" — finding the items most semantically similar to a query. It is the backbone of RAG (Retrieval-Augmented Generation) systems, semantic search, and recommendation engines. Instead of matching exact keywords, it matches meaning.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-2-1',
        title: 'Match the use case to the database',
        description: 'For each scenario below, identify the best database type and explain why.',
        starterCode: `// Scenarios:
// A) Store user sessions that expire after 30 minutes
// B) Store customer orders with items, addresses, and payments
// C) Build a "people you may know" feature for a social network
// D) Build semantic search for a documentation website
// E) Store sensor readings from 10 million IoT devices per minute

// Database types: Relational, Document, Key-Value, Wide Column, Graph, Vector

// A: _______ because _______
// B: _______ because _______
// C: _______ because _______
// D: _______ because _______
// E: _______ because _______`,
        solution: `// A: Key-Value (Redis) — sessions need get/set by key with auto-expiry (TTL)
// B: Relational (PostgreSQL/MySQL) — orders have strict relationships:
//    user → order → order_items → products → addresses
// C: Graph (Neo4j) — "friends of friends" queries are natural in graph traversal
// D: Vector (Pinecone/Chroma) — semantic similarity search needs vector embeddings
// E: Wide Column (Cassandra) — massive write throughput, time-series data,
//    naturally partitioned by device ID`,
        hints: [
          'Think about the shape of the data',
          'Think about the access pattern (how you read it back)',
          'Think about scale and performance requirements',
        ],
      },
    ],
    keyTakeaways: [
      'Relational (SQL) databases are for structured, related data with integrity requirements.',
      'Document databases (MongoDB) are for flexible JSON data with varied structure.',
      'Key-Value databases (Redis) are for caching, sessions, and instant lookups.',
      'Wide Column (Cassandra) handles billions of writes per day for time-series and events.',
      'Graph databases are for network relationships like social graphs and fraud detection.',
      'Vector databases power AI applications with semantic similarity search.',
      'Choose your database based on data shape and access patterns, not popularity.',
    ],
    prevLesson: 'introduction-to-databases',
    nextLesson: 'sql-foundations',
  },

  // ─── LESSON 3 ────────────────────────────────────────────────────────────────
  {
    id: 'sql-foundations',
    slug: 'sql-foundations',
    title: 'SQL Foundations',
    description: 'Understand databases, schemas, tables, rows, columns, and all SQL data types — the building blocks of every relational database.',
    category: 'SQL',
    order: 3,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## What is SQL?

SQL (Structured Query Language) is the language you use to talk to relational databases. It lets you create tables, insert data, search, update, and delete — all with simple English-like commands.

SQL is not a programming language in the traditional sense. It is a **declarative** language: you describe *what* you want, not *how* to find it. The database engine figures out the how.

**SQL runs everywhere:** PostgreSQL, MySQL, SQLite, SQL Server, and many others all use SQL. Learn it once — it works across all of them with minor differences.

---

## Database

A **database** is the top-level container. It holds all your tables, views, and indexes for one application.

**Real-world analogy:** A database is like a building. Inside the building, there are many rooms (tables). Each room stores a specific type of thing.

- You create one database per application (e.g., \`shopify_db\`, \`instagram_db\`)
- A database server (PostgreSQL, MySQL) can host many databases
- Each database is completely isolated from others

---

## Schema

A **schema** is a namespace inside a database that groups related tables.

In PostgreSQL, the default schema is \`public\`. In larger systems, you might have:
- \`auth.users\` — authentication schema
- \`billing.invoices\` — billing schema
- \`public.posts\` — default schema

For most projects, you work in the default \`public\` schema and don't think about it.

---

## Table

A **table** is where data actually lives. It is organized into rows and columns — exactly like a spreadsheet, but with strict rules.

Every table:
- Has a unique name inside the database
- Has a fixed set of columns (defined upfront)
- Can have millions or billions of rows
- Has at least one column that uniquely identifies each row (primary key)

---

## Row

A **row** (also called a **record** or **tuple**) is one entry in a table. Each row represents one thing — one user, one order, one product.

---

## Column

A **column** (also called a **field** or **attribute**) is one property of that thing. Each column has:
- A name (\`email\`, \`created_at\`, \`price\`)
- A data type (\`VARCHAR\`, \`TIMESTAMP\`, \`DECIMAL\`)
- Optional constraints (\`NOT NULL\`, \`UNIQUE\`, \`DEFAULT\`)

---

## SQL Data Types

Data types tell the database what kind of value to expect. Choosing the right type affects storage, performance, and correctness.

### Numbers
| Type | Use for | Example |
|------|---------|---------|
| \`INT\` / \`INTEGER\` | Whole numbers, IDs, counts | \`age = 25\`, \`order_id = 1001\` |
| \`BIGINT\` | Very large integers (user IDs at scale) | \`post_id = 9876543210\` |
| \`DECIMAL(10,2)\` | Exact money values | \`price = 19.99\` |
| \`FLOAT\` / \`REAL\` | Approximate decimals (science/stats) | \`score = 0.847\` |

**Important:** Never use FLOAT for money. Use DECIMAL to avoid rounding errors.

### Text
| Type | Use for | Example |
|------|---------|---------|
| \`VARCHAR(255)\` | Variable-length text with a limit | \`name\`, \`email\`, \`title\` |
| \`TEXT\` | Unlimited text | Blog posts, descriptions, comments |
| \`CHAR(n)\` | Fixed-length text | Country codes: \`'US'\`, \`'IN'\` |

### Boolean
| Type | Use for | Example |
|------|---------|---------|
| \`BOOLEAN\` | True/false flags | \`is_active\`, \`is_verified\`, \`is_deleted\` |

### Dates and Times
| Type | Use for | Example |
|------|---------|---------|
| \`DATE\` | Calendar date only | \`birthday = '1995-08-23'\` |
| \`TIME\` | Time of day only | \`opens_at = '09:00:00'\` |
| \`TIMESTAMP\` | Date + time (no timezone) | \`created_at = '2024-01-15 10:30:00'\` |
| \`TIMESTAMPTZ\` | Date + time with timezone (PostgreSQL) | Best practice for production |

**Always store timestamps in UTC.** Convert to local time in your application.

### JSON (PostgreSQL)
| Type | Use for | Example |
|------|---------|---------|
| \`JSON\` | Stores JSON text | Flexible metadata |
| \`JSONB\` | Stores binary JSON (queryable) | Queryable product attributes |

JSONB lets you query inside JSON fields — powerful for semi-structured data.

---

## Column Constraints

Constraints enforce rules on your columns:

| Constraint | What it does | Example |
|------------|-------------|---------|
| \`NOT NULL\` | Value is required | \`email VARCHAR(255) NOT NULL\` |
| \`UNIQUE\` | No duplicates allowed | \`email VARCHAR(255) UNIQUE\` |
| \`DEFAULT\` | Fallback value if none given | \`is_active BOOLEAN DEFAULT true\` |
| \`PRIMARY KEY\` | Unique + not null + indexed | \`id SERIAL PRIMARY KEY\` |
| \`CHECK\` | Custom rule | \`age INT CHECK (age >= 0)\` |
| \`REFERENCES\` | Foreign key link | \`user_id INT REFERENCES users(id)\` |`,
    codeExamples: [
      {
        title: 'Creating a database and table',
        code: `-- Step 1: Create a database
CREATE DATABASE myapp;

-- Step 2: Connect to it (in psql: \\c myapp)

-- Step 3: Create a users table
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,        -- auto-incrementing integer
  name       VARCHAR(100) NOT NULL,     -- required, max 100 chars
  email      VARCHAR(255) NOT NULL UNIQUE, -- required, no duplicates
  age        INT CHECK (age >= 0),      -- must be non-negative
  is_active  BOOLEAN DEFAULT true,      -- defaults to true
  created_at TIMESTAMP DEFAULT NOW()    -- auto-set to current time
);

-- id: SERIAL = auto-increment (1, 2, 3...)
-- PRIMARY KEY: uniquely identifies each row, auto-indexed
-- NOT NULL: this field is required
-- UNIQUE: no two users can have the same email
-- DEFAULT: if you don't provide a value, use this one
-- NOW(): built-in function returning the current timestamp`,
        explanation: 'This creates a complete users table. SERIAL auto-increments the ID. Constraints protect data quality.',
      },
      {
        title: 'Data types in practice',
        code: `-- Products table showing appropriate data type choices
CREATE TABLE products (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  description  TEXT,                          -- unlimited text, can be null
  price        DECIMAL(10, 2) NOT NULL,       -- exact: 10 digits, 2 decimal places
  stock_count  INT NOT NULL DEFAULT 0,        -- whole number, defaults to 0
  is_featured  BOOLEAN DEFAULT false,
  metadata     JSONB,                         -- flexible attributes (color, size, etc.)
  created_at   TIMESTAMPTZ DEFAULT NOW()      -- with timezone — best practice
);

-- DECIMAL(10,2) stores values like 19.99, 1234567.89
-- JSONB lets you store: { "color": "red", "size": "XL", "material": "cotton" }
-- TIMESTAMPTZ stores time in UTC, converts on read`,
        explanation: 'Choose DECIMAL for money, TEXT for long content, JSONB for flexible attributes, TIMESTAMPTZ for dates.',
      },
      {
        title: 'Describing an existing table',
        code: `-- PostgreSQL: see table structure
\\d users

-- MySQL: see table structure
DESCRIBE users;

-- Standard SQL: see creation statement
SHOW CREATE TABLE users;

-- List all tables in database
\\dt          -- PostgreSQL
SHOW TABLES; -- MySQL`,
        explanation: 'These commands let you inspect what columns and types a table has — essential for debugging.',
      },
    ],
    commonMistakes: [
      'Using FLOAT for monetary values — always use DECIMAL(10,2) to avoid floating-point errors like 19.99 becoming 19.990000001.',
      'Skipping NOT NULL — without it, a column can be empty, causing null pointer errors in your application.',
      'Using VARCHAR(255) for everything — if data is unbounded (descriptions, posts), use TEXT instead.',
      'Not using TIMESTAMPTZ in PostgreSQL — TIMESTAMP without timezone causes bugs when servers are in different regions.',
      'Naming tables in singular form vs plural — pick one convention (users or user) and stick to it across the whole project.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between VARCHAR and TEXT?',
        answer: 'VARCHAR(n) stores variable-length strings up to n characters and is best when you have a known max length (e.g., email up to 255 chars). TEXT stores unlimited-length strings with no set maximum. In PostgreSQL, both have identical performance. Use VARCHAR when you want the database to enforce a max length, TEXT when content can be any length.',
        difficulty: 'beginner',
      },
      {
        question: 'Why should you never use FLOAT for money?',
        answer: 'FLOAT uses binary floating-point representation which cannot exactly represent most decimal fractions. For example, 0.1 + 0.2 in floating point is 0.30000000000000004, not 0.3. In a financial system, this causes rounding errors that compound over thousands of transactions. Always use DECIMAL(precision, scale) — it stores exact decimal values.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between PRIMARY KEY and UNIQUE constraint?',
        answer: 'Both enforce uniqueness, but PRIMARY KEY additionally disallows NULL and can only be defined once per table. UNIQUE allows NULL (and multiple NULL values in most databases) and a table can have many UNIQUE constraints. PRIMARY KEY is the main identifier for a row; UNIQUE enforces business uniqueness on other columns like email.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-3-1',
        title: 'Design a products table',
        description: 'Write a CREATE TABLE statement for a products table for an e-commerce site. Include: id, name, description, price, stock, category, is_available, and created_at.',
        starterCode: `-- Write a CREATE TABLE statement for products
-- Requirements:
-- id: auto-incrementing primary key
-- name: required, max 200 characters
-- description: optional, unlimited length
-- price: required, exact decimal with 2 decimal places
-- stock: required, whole number, defaults to 0
-- category: required, max 100 characters
-- is_available: true/false, defaults to true
-- created_at: auto-set timestamp with timezone

CREATE TABLE products (
  -- your columns here
);`,
        solution: `CREATE TABLE products (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  description  TEXT,
  price        DECIMAL(10, 2) NOT NULL,
  stock        INT NOT NULL DEFAULT 0,
  category     VARCHAR(100) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);`,
        hints: [
          'Use SERIAL for auto-incrementing IDs',
          'Use DECIMAL(10,2) for price — never FLOAT',
          'TEXT for unlimited text, VARCHAR(n) for limited text',
        ],
      },
    ],
    keyTakeaways: [
      'A database holds tables. A table holds rows and columns. A row is one record.',
      'Columns have types: INT, VARCHAR, TEXT, DECIMAL, BOOLEAN, TIMESTAMP, JSONB.',
      'Use DECIMAL(10,2) for money — never FLOAT.',
      'Use TIMESTAMPTZ in PostgreSQL to handle timezones correctly.',
      'Constraints (NOT NULL, UNIQUE, CHECK) protect data quality at the database level.',
      'SERIAL auto-increments integer IDs — the most common pattern for primary keys.',
    ],
    prevLesson: 'types-of-databases',
    nextLesson: 'sql-queries',
  },

  // ─── LESSON 4 ────────────────────────────────────────────────────────────────
  {
    id: 'sql-queries',
    slug: 'sql-queries',
    title: 'SQL Queries',
    description: 'Master every essential SQL query: CREATE, INSERT, SELECT, UPDATE, DELETE, WHERE, JOIN, GROUP BY, aggregates — with line-by-line explanations.',
    category: 'SQL',
    order: 4,
    difficulty: 'beginner',
    estimatedTime: 60,
    content: `## How to Think About SQL Queries

SQL is a conversation with your database. You describe what you want in plain English, and the database fetches it.

**Mental model:** Imagine your database as a library. SQL queries are your requests to the librarian:
- "Give me all books" → SELECT
- "Give me books by Author X" → SELECT + WHERE
- "Add this new book" → INSERT
- "Update this book's title" → UPDATE
- "Remove this book" → DELETE

---

## CREATE TABLE

Creates a new table with defined columns and constraints.

\`\`\`sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

Line by line:
- \`CREATE TABLE users\` — create a new table named users
- \`id SERIAL PRIMARY KEY\` — auto-incrementing unique identifier
- \`name VARCHAR(100) NOT NULL\` — text up to 100 chars, required
- \`email VARCHAR(255) UNIQUE NOT NULL\` — required, no duplicates allowed
- \`created_at TIMESTAMP DEFAULT NOW()\` — auto-filled with current time

---

## INSERT

Adds new rows to a table.

\`\`\`sql
-- Insert one row
INSERT INTO users (name, email)
VALUES ('Alice', 'alice@example.com');

-- Insert multiple rows at once
INSERT INTO users (name, email) VALUES
  ('Bob',     'bob@example.com'),
  ('Charlie', 'charlie@example.com'),
  ('Diana',   'diana@example.com');
\`\`\`

- You don't include \`id\` — SERIAL fills it automatically
- You don't include \`created_at\` — DEFAULT fills it automatically
- Column order in VALUES must match column order in the column list

---

## SELECT

Retrieves data from a table.

\`\`\`sql
-- Get everything
SELECT * FROM users;

-- Get specific columns
SELECT name, email FROM users;

-- Alias column names
SELECT name AS full_name, email AS contact FROM users;
\`\`\`

**Never use SELECT * in production.** It fetches unnecessary columns, wastes bandwidth, and breaks if you add/remove columns.

---

## WHERE — Filtering Rows

WHERE filters which rows to include. Only rows where the condition is true are returned.

\`\`\`sql
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE name = 'Alice';
SELECT * FROM products WHERE price > 100;
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM users WHERE name IN ('Alice', 'Bob', 'Charlie');
SELECT * FROM users WHERE created_at > '2024-01-01';
SELECT * FROM users WHERE name IS NOT NULL;
\`\`\`

**Operators:** \`=\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`, \`BETWEEN\`, \`LIKE\`, \`IN\`, \`IS NULL\`, \`IS NOT NULL\`

**Combine with AND / OR:**
\`\`\`sql
SELECT * FROM products
WHERE price > 50 AND category = 'Electronics';

SELECT * FROM users
WHERE name = 'Alice' OR name = 'Bob';
\`\`\`

---

## UPDATE

Modifies existing rows. **Always include a WHERE clause** — without it, you update every row.

\`\`\`sql
-- Update one user
UPDATE users
SET name = 'Alice Smith'
WHERE id = 1;

-- Update multiple columns
UPDATE products
SET price = 29.99, stock = 100
WHERE id = 42;

-- WITHOUT WHERE: updates ALL rows (dangerous!)
UPDATE users SET is_active = false; -- affects every user
\`\`\`

---

## DELETE

Removes rows. **Always include a WHERE clause.**

\`\`\`sql
-- Delete one row
DELETE FROM users WHERE id = 5;

-- Delete multiple rows
DELETE FROM orders WHERE created_at < '2023-01-01';

-- WITHOUT WHERE: deletes ALL rows in the table
DELETE FROM users; -- catastrophic!
\`\`\`

---

## ORDER BY — Sorting Results

\`\`\`sql
SELECT * FROM products ORDER BY price ASC;   -- cheapest first
SELECT * FROM products ORDER BY price DESC;  -- most expensive first
SELECT * FROM users ORDER BY name ASC;       -- alphabetical

-- Sort by multiple columns
SELECT * FROM orders ORDER BY user_id ASC, created_at DESC;
\`\`\`

---

## LIMIT and OFFSET — Pagination

\`\`\`sql
SELECT * FROM products LIMIT 10;            -- first 10 rows
SELECT * FROM products LIMIT 10 OFFSET 20; -- rows 21-30 (page 3)

-- Pagination formula:
-- OFFSET = (page - 1) * pageSize
-- Page 1: OFFSET 0
-- Page 2: OFFSET 10
-- Page 3: OFFSET 20
\`\`\`

---

## DISTINCT — Remove Duplicates

\`\`\`sql
-- All unique categories in products table
SELECT DISTINCT category FROM products;

-- All unique cities users are from
SELECT DISTINCT city FROM users;
\`\`\`

---

## GROUP BY — Aggregate by Category

GROUP BY collapses rows with the same value into one group, then you apply aggregate functions.

\`\`\`sql
-- Count users per city
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city;

-- Average order total per user
SELECT user_id, AVG(total) AS avg_order
FROM orders
GROUP BY user_id;
\`\`\`

---

## HAVING — Filter After Grouping

WHERE filters rows before grouping. HAVING filters groups after grouping.

\`\`\`sql
-- Cities with more than 10 users
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 10;

-- Users who have placed more than 3 orders
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 3;
\`\`\`

---

## Aggregate Functions

| Function | What it does | Example |
|----------|-------------|---------|
| \`COUNT(*)\` | Count rows | Total number of users |
| \`SUM(col)\` | Add up values | Total revenue |
| \`AVG(col)\` | Average value | Average order total |
| \`MIN(col)\` | Smallest value | Cheapest product |
| \`MAX(col)\` | Largest value | Most expensive product |

---

## JOINs — Combining Tables

JOINs let you query across related tables.

**INNER JOIN** — only rows that match in both tables:
\`\`\`sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
-- Only users who have at least one order appear
\`\`\`

**LEFT JOIN** — all rows from left table, matching rows from right:
\`\`\`sql
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- All users appear; users with no orders show NULL for total
\`\`\`

**RIGHT JOIN** — all rows from right table, matching rows from left (rare, usually rewritten as LEFT JOIN).

**Aliases make JOINs readable:**
\`\`\`sql
SELECT u.name, o.total, o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100
ORDER BY o.created_at DESC;
\`\`\``,
    codeExamples: [
      {
        title: 'Complete CRUD example — users table',
        code: `-- CREATE
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  city       VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- INSERT
INSERT INTO users (name, email, city) VALUES
  ('Alice',   'alice@example.com',   'New York'),
  ('Bob',     'bob@example.com',     'London'),
  ('Charlie', 'charlie@example.com', 'New York'),
  ('Diana',   'diana@example.com',   'Mumbai');

-- READ
SELECT id, name, email FROM users;
-- Returns all 4 rows with those 3 columns

-- UPDATE
UPDATE users SET city = 'San Francisco' WHERE name = 'Alice';
-- Alice now lives in San Francisco

-- DELETE
DELETE FROM users WHERE name = 'Diana';
-- Diana is removed`,
        output: 'id | name    | email\n---+---------+---------------------\n 1 | Alice   | alice@example.com\n 2 | Bob     | bob@example.com\n 3 | Charlie | charlie@example.com',
        explanation: 'This is the full CRUD cycle: Create, Read, Update, Delete — the four operations every developer uses daily.',
      },
      {
        title: 'Aggregate queries — real analysis',
        code: `-- Sample orders table
-- | id | user_id | total  | status    |
-- |----|---------|--------|-----------|
-- |  1 |       1 | 150.00 | completed |
-- |  2 |       1 |  49.99 | completed |
-- |  3 |       2 | 299.00 | pending   |
-- |  4 |       3 |  25.00 | completed |

-- Total revenue
SELECT SUM(total) AS total_revenue FROM orders;
-- Result: 523.99

-- Count orders by status
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status;
-- Result: completed=3, pending=1

-- Average order total per user
SELECT user_id, AVG(total) AS avg_order, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
ORDER BY avg_order DESC;
-- Result: user 2 has highest avg (299.00)

-- Users with more than 1 order
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 1;
-- Result: user_id=1 (has 2 orders)`,
        explanation: 'Aggregate queries answer business questions: revenue, counts by category, averages — all without writing any code.',
      },
      {
        title: 'JOIN example — users and orders',
        code: `-- Tables:
-- users: id, name, email
-- orders: id, user_id, total, status

-- INNER JOIN: only users who have orders
SELECT u.name, o.total, o.status
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Result: Alice appears twice (2 orders), Bob once, Charlie once
-- Diana doesn't appear (no orders)

-- LEFT JOIN: all users, even those without orders
SELECT u.name, COALESCE(o.total, 0) AS order_total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Result: Diana appears with order_total = 0
-- COALESCE converts NULL to 0

-- Join 3 tables: users + orders + products
SELECT u.name, p.name AS product, oi.quantity
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;`,
        explanation: 'INNER JOIN only returns matched rows. LEFT JOIN includes all left-table rows. Chain multiple JOINs for complex queries.',
      },
    ],
    commonMistakes: [
      'Running UPDATE or DELETE without a WHERE clause — this modifies every row. Always test with SELECT first.',
      'Using SELECT * in production code — specify the columns you need.',
      'Confusing WHERE and HAVING — WHERE filters rows, HAVING filters groups after GROUP BY.',
      'Forgetting INNER JOIN only returns rows that match in BOTH tables — if you want all users including those without orders, use LEFT JOIN.',
      'Not using LIMIT — SELECT on a million-row table without LIMIT can crash your app or timeout.',
      'LIKE with a leading wildcard (%term) cannot use indexes and is very slow on large tables.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between WHERE and HAVING?',
        answer: 'WHERE filters individual rows before grouping happens. HAVING filters groups after GROUP BY. You cannot use aggregate functions (COUNT, SUM) in WHERE — use HAVING for that. Example: WHERE city = "NY" filters rows; HAVING COUNT(*) > 5 filters groups with more than 5 members.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?',
        answer: 'INNER JOIN returns only rows where the join condition matches in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right (unmatched right columns are NULL). RIGHT JOIN is the mirror of LEFT JOIN. In practice, prefer LEFT JOIN over RIGHT JOIN as it is easier to reason about.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you implement pagination in SQL?',
        answer: 'Use LIMIT and OFFSET. LIMIT sets how many rows to return. OFFSET skips that many rows first. Formula: OFFSET = (page - 1) * pageSize. For page 3 with 10 items per page: LIMIT 10 OFFSET 20. Caution: OFFSET-based pagination is slow on large tables because the database must scan and skip all offset rows. Cursor-based pagination (WHERE id > last_seen_id LIMIT 10) is faster at scale.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-4-1',
        title: 'Write queries for an e-commerce database',
        description: 'Given tables: users(id, name, email, city) and orders(id, user_id, total, status, created_at), write queries for the tasks below.',
        starterCode: `-- Task 1: Get all users from "New York"
-- Task 2: Get the top 5 most expensive orders
-- Task 3: Count how many orders each user has placed
-- Task 4: Find users who have spent more than $500 total
-- Task 5: Get each user's name and their total number of orders (include users with 0 orders)

-- Task 1:

-- Task 2:

-- Task 3:

-- Task 4:

-- Task 5:`,
        solution: `-- Task 1:
SELECT * FROM users WHERE city = 'New York';

-- Task 2:
SELECT * FROM orders ORDER BY total DESC LIMIT 5;

-- Task 3:
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;

-- Task 4:
SELECT user_id, SUM(total) AS total_spent
FROM orders
GROUP BY user_id
HAVING SUM(total) > 500;

-- Task 5:
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;`,
        hints: [
          'Task 4 needs HAVING not WHERE — you are filtering after grouping',
          'Task 5 needs LEFT JOIN to include users with zero orders',
          'Task 5 needs COUNT(o.id) not COUNT(*) — COUNT(*) counts NULLs',
        ],
      },
    ],
    keyTakeaways: [
      'INSERT adds rows. SELECT reads rows. UPDATE modifies rows. DELETE removes rows.',
      'Always use WHERE with UPDATE and DELETE. Without it, you affect every row.',
      'WHERE filters rows before grouping. HAVING filters groups after GROUP BY.',
      'INNER JOIN returns only matching rows. LEFT JOIN returns all left rows.',
      'Use LIMIT and OFFSET for pagination. Specify columns instead of SELECT *.',
      'Aggregate functions: COUNT, SUM, AVG, MIN, MAX — used with GROUP BY.',
    ],
    prevLesson: 'sql-foundations',
    nextLesson: 'database-relationships',
  },

  // ─── LESSON 5 ────────────────────────────────────────────────────────────────
  {
    id: 'database-relationships',
    slug: 'database-relationships',
    title: 'Database Relationships',
    description: 'Primary keys, foreign keys, one-to-one, one-to-many, many-to-many — understand how tables link together in real applications.',
    category: 'SQL',
    order: 5,
    difficulty: 'beginner',
    estimatedTime: 35,
    content: `## Why Relationships Exist

Real-world data is connected. A user places orders. An order contains products. A product belongs to a category. These connections are **relationships**.

Without relationships, you would copy the same data everywhere:
\`\`\`
Order 1: Alice, alice@example.com, New York, Product: iPhone, $999
Order 2: Alice, alice@example.com, New York, Product: Case, $29
\`\`\`

Alice's information is duplicated in every order. If her email changes, you update thousands of rows. This is the problem relationships solve.

**With relationships:**
- Users table: Alice's info stored once (id = 1)
- Orders table: orders point to user id = 1
- Change Alice's email once → all orders reflect the change

---

## Primary Key

A **primary key** is a column (or set of columns) that uniquely identifies every row in a table.

Rules:
- Must be UNIQUE — no two rows can have the same value
- Must be NOT NULL — every row must have one
- Should be stable — ideally never changes once set
- Usually an auto-incrementing integer (\`SERIAL\`) or UUID

\`\`\`sql
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,  -- auto-incrementing, unique, not null
  email VARCHAR(255) NOT NULL
);
\`\`\`

**Natural key vs Surrogate key:**
- Natural key: a real-world attribute used as the primary key (email, SSN) — risky because real values change
- Surrogate key: a generated ID with no real-world meaning (id = 1, 2, 3) — preferred in most cases

---

## Foreign Key

A **foreign key** is a column in one table that points to the primary key of another table. It creates the link between tables.

\`\`\`sql
CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  total   DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
\`\`\`

- \`user_id\` in orders references \`id\` in users
- The database rejects any order with a user_id that doesn't exist in users
- This is called **referential integrity**

---

## One-to-Many (Most Common)

One row in Table A maps to many rows in Table B.

**Examples:**
- One user → many orders
- One category → many products
- One post → many comments
- One teacher → many students

\`\`\`sql
-- One user can have many orders
users:
| id | name  |
| 1  | Alice |

orders:
| id | user_id | total |
|  1 |       1 |  99.99|  -- Alice's order
|  2 |       1 | 149.00|  -- Also Alice's order
|  3 |       2 |  49.99|  -- Bob's order
\`\`\`

The foreign key goes on the "many" side (orders.user_id → users.id).

---

## One-to-One

One row in Table A maps to exactly one row in Table B.

**When to use:** When some data is optional or accessed rarely and you want to keep the main table lean.

**Examples:**
- User → UserProfile (detailed bio, avatar, etc.)
- User → UserSettings
- Employee → PayrollDetails

\`\`\`sql
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE user_profiles (
  id         SERIAL PRIMARY KEY,
  user_id    INT UNIQUE NOT NULL,  -- UNIQUE enforces one-to-one
  bio        TEXT,
  avatar_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
-- user_id is UNIQUE: one user can have only one profile
\`\`\`

---

## Many-to-Many

Many rows in Table A map to many rows in Table B. You cannot directly represent this with just foreign keys — you need a **junction table** (also called bridge table, pivot table, or join table).

**Examples:**
- Students ↔ Courses (a student takes many courses; a course has many students)
- Users ↔ Roles (a user has many roles; a role is assigned to many users)
- Products ↔ Orders (an order has many products; a product appears in many orders)

\`\`\`sql
-- Students and Courses — many-to-many
CREATE TABLE students (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id    SERIAL PRIMARY KEY,
  title VARCHAR(200)
);

-- Junction table: one row per student-course pair
CREATE TABLE enrollments (
  student_id INT REFERENCES students(id),
  course_id  INT REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (student_id, course_id)  -- composite primary key
);
\`\`\`

The composite primary key prevents the same student from enrolling in the same course twice.

---

## Practical Example: E-Commerce Schema

\`\`\`sql
-- USERS
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- PRODUCTS
CREATE TABLE products (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(200) NOT NULL,
  price    DECIMAL(10,2) NOT NULL,
  stock    INT DEFAULT 0
);

-- ORDERS (one user → many orders)
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  total      DECIMAL(10,2),
  status     VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ORDER_ITEMS junction table (many-to-many: orders ↔ products)
CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity   INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL  -- store price at time of purchase
);
\`\`\`

**Why store unit_price in order_items?** Products can change price. You need to know what the customer actually paid, not today's price.

---

## ON DELETE behavior

When a parent row is deleted, what happens to child rows?

| Option | Behavior |
|--------|----------|
| \`ON DELETE CASCADE\` | Child rows are automatically deleted |
| \`ON DELETE SET NULL\` | Foreign key column is set to NULL |
| \`ON DELETE RESTRICT\` | Deletion is blocked if children exist (default) |
| \`ON DELETE NO ACTION\` | Same as RESTRICT (checked at end of transaction) |

**Example:** Delete a user → \`ON DELETE CASCADE\` automatically deletes their orders.`,
    codeExamples: [
      {
        title: 'Querying relationships with JOINs',
        code: `-- Get all orders with user names and product details
SELECT
  u.name        AS customer,
  o.id          AS order_id,
  o.status,
  p.name        AS product,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS line_total
FROM users u
JOIN orders o     ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p   ON oi.product_id = p.id
WHERE o.status = 'completed'
ORDER BY o.id;

-- This single query spans 4 tables using relationships`,
        explanation: 'JOINs traverse relationships. This 4-table join is how real e-commerce apps display order details.',
      },
      {
        title: 'Roles and permissions — many-to-many',
        code: `-- Users can have multiple roles. Roles belong to multiple users.
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE roles (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL  -- 'admin', 'editor', 'viewer'
);

-- Junction table: user_roles
CREATE TABLE user_roles (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Assign Alice the admin role
INSERT INTO user_roles (user_id, role_id)
VALUES (1, 1);  -- Alice gets admin

-- Get all roles for user id=1
SELECT r.name
FROM roles r
JOIN user_roles ur ON r.id = ur.role_id
WHERE ur.user_id = 1;`,
        explanation: 'The user_roles junction table implements many-to-many between users and roles. Composite primary key prevents duplicate assignments.',
      },
    ],
    commonMistakes: [
      'Forgetting to add a foreign key constraint — the database then allows orphan records (orders with non-existent user_ids).',
      'Using ON DELETE CASCADE everywhere — sometimes you want to prevent deletion (restrict) rather than cascade it.',
      'Not using a junction table for many-to-many — storing arrays of IDs in a column instead is unqueryable and breaks normalization.',
      'Using email or username as a primary key — these can change, which would break all foreign key references.',
      'Not storing price in order_items — if product price changes, historical orders show wrong amounts.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a primary key and a foreign key?',
        answer: 'A primary key uniquely identifies each row in its own table. A foreign key is a column in one table that references the primary key of another table, creating a link between them. Primary keys cannot be NULL; foreign keys can be NULL (meaning the row is not linked to any parent). Together they enforce referential integrity.',
        difficulty: 'beginner',
      },
      {
        question: 'How do you implement a many-to-many relationship in a relational database?',
        answer: 'You create a junction table (also called a bridge or pivot table) that has two foreign keys — one pointing to each of the related tables. Each row in the junction table represents one relationship. A composite primary key on both foreign keys prevents duplicate pairs. Example: students ↔ courses via an enrollments table with student_id and course_id.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is referential integrity and why does it matter?',
        answer: 'Referential integrity ensures that a foreign key value always points to an existing primary key in the referenced table. It prevents orphan records — for example, an order with user_id = 999 when user 999 does not exist. The database enforces this at insert and delete time, rejecting operations that would violate it. Without it, your data becomes inconsistent and queries return incorrect results.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-5-1',
        title: 'Design a blog database schema',
        description: 'Design tables for a blog with users, posts, categories, comments, and tags. Identify the relationship type for each pair.',
        starterCode: `-- Design these tables:
-- users: can write many posts
-- posts: belong to one user, one category, can have many tags, many comments
-- categories: one category has many posts
-- comments: belong to one post, one user
-- tags: a post can have many tags; a tag can be on many posts

-- Identify: what type of relationship is each?
-- users → posts:
-- posts → categories:
-- posts → comments:
-- posts ↔ tags:

-- Write the CREATE TABLE statements:`,
        solution: `-- users → posts: ONE-TO-MANY (one user writes many posts)
-- posts → categories: MANY-TO-ONE (many posts in one category)
-- posts → comments: ONE-TO-MANY (one post has many comments)
-- posts ↔ tags: MANY-TO-MANY (needs junction table)

CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  email    VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  title       VARCHAR(300) NOT NULL,
  body        TEXT NOT NULL,
  published   BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  post_id    INT REFERENCES posts(id) ON DELETE CASCADE,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Junction table for posts ↔ tags (many-to-many)
CREATE TABLE post_tags (
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INT REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);`,
        hints: [
          'Identify the relationship type before writing SQL',
          'Many-to-many always needs a junction table',
          'Add ON DELETE CASCADE so deleting a post removes its comments and tags',
        ],
      },
    ],
    keyTakeaways: [
      'Primary key uniquely identifies rows. Foreign key links rows between tables.',
      'One-to-many is the most common relationship — foreign key goes on the "many" side.',
      'One-to-one uses UNIQUE on the foreign key column.',
      'Many-to-many requires a junction table with foreign keys to both tables.',
      'Store price in order_items, not just in products — prices change over time.',
      'ON DELETE CASCADE auto-deletes children. ON DELETE RESTRICT blocks deletion.',
    ],
    prevLesson: 'sql-queries',
    nextLesson: 'database-design',
  },

  // ─── LESSON 6 ────────────────────────────────────────────────────────────────
  {
    id: 'database-design',
    slug: 'database-design',
    title: 'Database Design & Normalization',
    description: 'ER diagrams, data modeling, normalization (1NF, 2NF, 3NF), and when to denormalize — focused on building real projects, not academic theory.',
    category: 'Design',
    order: 6,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## What is Database Design?

Database design is the process of deciding how to structure your data before you write a single line of code. Good design:
- Prevents data duplication
- Makes queries fast and simple
- Keeps data consistent
- Is easy to extend later

Bad design causes: slow queries, duplicate data, bugs when updating, and impossible migrations.

**Design first, code second.** Changing a database schema after launch is painful. Spend 20 minutes designing before writing code.

---

## ER Diagrams (Entity-Relationship Diagrams)

ER diagrams are visual maps of your database. They show entities (tables), their attributes (columns), and relationships between them.

**Notation:**
- Rectangle = Entity (table)
- Oval = Attribute (column)
- Diamond = Relationship
- Lines show connections, with cardinality marks (1, M, N)

**Simple ER diagram for a blog:**
\`\`\`
[User] ----< [Post] >---- [Tag]
              |
              v
           [Comment]
\`\`\`
- One User writes many Posts (1:M)
- One Post has many Tags, one Tag has many Posts (M:N)
- One Post has many Comments (1:M)

For real projects, use tools like dbdiagram.io, Lucidchart, or draw.io to draw ER diagrams before coding.

---

## Data Modeling

Data modeling is translating real-world concepts into tables.

**Step 1: Identify entities**
What are the "things" in your system?
- Blog: User, Post, Comment, Tag, Category
- E-commerce: User, Product, Order, Cart, Address
- Slack-like app: Workspace, Channel, User, Message, File

**Step 2: Identify attributes**
What do we know about each entity?
- User: name, email, password_hash, created_at
- Post: title, body, published, author (user)

**Step 3: Identify relationships**
How are entities connected?
- User writes Posts → One-to-Many
- Post has Tags → Many-to-Many

**Step 4: Assign primary keys and foreign keys**

---

## Normalization

Normalization is a process of organizing tables to reduce data redundancy and improve integrity.

**The Problem (Unnormalized data):**
\`\`\`
| order_id | customer_name | customer_email    | product    | price | qty |
|----------|---------------|-------------------|------------|-------|-----|
|        1 | Alice         | alice@example.com | iPhone 15  | 999   |   1 |
|        2 | Alice         | alice@example.com | AirPods    | 249   |   2 |
|        3 | Bob           | bob@example.com   | iPhone 15  | 999   |   1 |
\`\`\`

Problems:
- Alice's email stored 2 times — update anomaly
- iPhone price stored 2 times — if price changes, which is correct?
- If Alice's only order is deleted, her email is lost — deletion anomaly

Normalization fixes these.

---

## First Normal Form (1NF)

**Rule:** Every cell must have a single atomic value. No arrays or comma-separated lists in one column.

**Violation:**
\`\`\`
| id | name  | phone_numbers          |
|----|-------|------------------------|
|  1 | Alice | 555-1111, 555-2222     |  ← two values in one cell
\`\`\`

**Fixed:**
\`\`\`
| id | name  |     | user_id | phone       |
|----|-------|     |---------|-------------|
|  1 | Alice |     |       1 | 555-1111    |
                   |       1 | 555-2222    |
\`\`\`

---

## Second Normal Form (2NF)

**Rule:** Must be in 1NF. Every non-key column must depend on the *entire* primary key (relevant when the primary key is composite).

**Violation (composite key: order_id + product_id):**
\`\`\`
| order_id | product_id | product_name | quantity |
|----------|------------|--------------|----------|
|        1 |         10 | iPhone       |        1 |
\`\`\`
\`product_name\` depends only on \`product_id\`, not on the full composite key. This is a partial dependency.

**Fixed:** Move product_name to a separate products table.

---

## Third Normal Form (3NF)

**Rule:** Must be in 2NF. No transitive dependencies — non-key columns must depend on the primary key, not on other non-key columns.

**Violation:**
\`\`\`
| employee_id | dept_id | dept_name |
|-------------|---------|-----------|
|           1 |       3 | Marketing |
\`\`\`
\`dept_name\` depends on \`dept_id\`, not on \`employee_id\`. This is a transitive dependency.

**Fixed:** Move dept_name to a departments table.

---

## Normalization in Practice (Project Focus)

For most web applications, aim for 3NF by default. Practical rules:

1. **Every table has a single primary key**
2. **Columns describe only what the primary key identifies**
3. **No repeated groups (arrays, comma lists) in columns**
4. **Reference other entities by foreign key, not by copying data**

You don't need to memorize 1NF/2NF/3NF definitions. Just ask: "Is this data duplicated? Could it become inconsistent?"

---

## Denormalization — Breaking the Rules Intentionally

Denormalization is intentionally introducing redundancy for performance.

**When to denormalize:**
- A JOIN is too slow and you need to avoid it
- You have heavy read loads and can tolerate slightly stale data
- Analytics tables (precompute aggregates instead of calculating live)

**Example:** Instead of joining 4 tables to get an order summary, store a precomputed \`total\` column on the orders table. This is denormalized (order_items already have this info) but makes reading orders instant.

**Rule of thumb:** Normalize first. Denormalize only when you have a measured performance problem.`,
    codeExamples: [
      {
        title: 'Going from requirements to schema',
        code: `-- Requirements: "Build a task manager where users can create projects,
-- add tasks to projects, and assign tasks to team members."

-- Step 1: Entities
-- User, Project, Task, Assignment

-- Step 2: Relationships
-- User CREATES many Projects (1:M)
-- Project HAS many Tasks (1:M)
-- Task ASSIGNED TO many Users; User HAS many assigned Tasks (M:N)

-- Step 3: Schema

CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE projects (
  id         SERIAL PRIMARY KEY,
  owner_id   INT REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  project_id  INT REFERENCES projects(id) ON DELETE CASCADE,
  title       VARCHAR(300) NOT NULL,
  status      VARCHAR(50) DEFAULT 'todo',  -- todo, in_progress, done
  due_date    DATE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Many-to-many: tasks ↔ users (assignments)
CREATE TABLE task_assignments (
  task_id    INT REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (task_id, user_id)
);`,
        explanation: 'Start with requirements, identify entities and relationships, then write SQL. Design before coding.',
      },
      {
        title: 'Normalization — before and after',
        code: `-- BEFORE (unnormalized, bad):
CREATE TABLE orders_bad (
  id             SERIAL PRIMARY KEY,
  customer_name  VARCHAR(100),
  customer_email VARCHAR(255),   -- duplicated per order
  customer_city  VARCHAR(100),   -- duplicated per order
  product_name   VARCHAR(200),   -- duplicated per order
  product_price  DECIMAL(10,2),  -- duplicated per order
  quantity       INT
);
-- Problem: if Alice changes her email, update 50 rows
-- Problem: if iPhone price changes, which orders are "correct"?

-- AFTER (normalized, good):
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  city  VARCHAR(100)
);

CREATE TABLE products (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id),    -- link to user, no duplication
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT REFERENCES orders(id),
  product_id INT REFERENCES products(id), -- link to product
  unit_price DECIMAL(10,2) NOT NULL,      -- snapshot of price at purchase
  quantity   INT NOT NULL
);
-- Update Alice's email in ONE place: users table`,
        explanation: 'Normalization removes duplication. One source of truth for each fact. Relationships link data without copying it.',
      },
    ],
    commonMistakes: [
      'Storing comma-separated IDs in a column instead of creating a junction table — you cannot query individual items efficiently.',
      'Copying data between tables instead of using foreign keys — creates update anomalies.',
      'Over-normalizing to the point where every query needs 6 JOINs — pragmatic design allows some deliberate denormalization.',
      'Not designing the schema before coding — changing a schema after launch is painful and risky.',
      'Using a single "type" column to distinguish completely different entities — often a sign you need separate tables.',
    ],
    interviewQuestions: [
      {
        question: 'What is normalization and why does it matter?',
        answer: 'Normalization is organizing tables to eliminate data redundancy and improve integrity. It matters because duplicated data causes anomalies: update anomalies (changing a value in one place but not all copies), insertion anomalies (cannot add data without unrelated data), and deletion anomalies (deleting one record loses other information). 3NF is the standard target for most web applications.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between 1NF, 2NF, and 3NF?',
        answer: '1NF: every column holds atomic (single) values, no arrays or repeating groups. 2NF: 1NF + no partial dependencies — every non-key column depends on the whole primary key (relevant for composite keys). 3NF: 2NF + no transitive dependencies — non-key columns depend only on the primary key, not on other non-key columns. Each level adds a stricter rule.',
        difficulty: 'intermediate',
      },
      {
        question: 'When would you denormalize a database?',
        answer: 'Denormalize when a measured performance problem exists and a JOIN is too expensive. Common cases: analytics tables with precomputed aggregates, read-heavy systems where slightly stale data is acceptable, and caching computed values (like total order amount on the orders table). Always normalize first, then denormalize with justification based on actual performance data.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-6-1',
        title: 'Normalize a bad table',
        description: 'The table below violates normalization rules. Identify the problems and rewrite it as normalized tables.',
        starterCode: `-- BAD TABLE (violations of normalization):
CREATE TABLE student_courses (
  student_id     INT,
  student_name   VARCHAR(100),
  student_email  VARCHAR(255),
  course_id      INT,
  course_name    VARCHAR(200),
  instructor_name VARCHAR(100),
  instructor_email VARCHAR(255),
  grade          CHAR(1)
);

-- Problems to identify:
-- 1.
-- 2.
-- 3.

-- Write normalized tables here:`,
        solution: `-- Problems:
-- 1. student_name, student_email depend only on student_id (partial dependency)
-- 2. course_name depends only on course_id (partial dependency)
-- 3. instructor_name, instructor_email depend on the instructor, not on course+student

-- Normalized solution:
CREATE TABLE students (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE instructors (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE courses (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  instructor_id INT REFERENCES instructors(id)
);

-- Junction table: students ↔ courses (many-to-many)
CREATE TABLE enrollments (
  student_id INT REFERENCES students(id) ON DELETE CASCADE,
  course_id  INT REFERENCES courses(id)  ON DELETE CASCADE,
  grade      CHAR(1),
  PRIMARY KEY (student_id, course_id)
);`,
        hints: [
          'Each table should describe exactly one thing',
          'If a column depends on only part of the key, move it to its own table',
          'Many-to-many relationship needs a junction table',
        ],
      },
    ],
    keyTakeaways: [
      'Design your schema before writing code — schema changes after launch are painful.',
      'ER diagrams map entities and relationships visually. Use dbdiagram.io for quick design.',
      '1NF: atomic values. 2NF: no partial dependencies. 3NF: no transitive dependencies.',
      'Normalization = one source of truth for each fact. Eliminates update anomalies.',
      'Denormalize intentionally, only when you have a measured performance reason.',
      'Real projects aim for 3NF with pragmatic exceptions for performance.',
    ],
    prevLesson: 'database-relationships',
    nextLesson: 'indexing',
  },

  // ─── LESSON 7 ────────────────────────────────────────────────────────────────
  {
    id: 'indexing',
    slug: 'indexing',
    title: 'Indexing & Query Performance',
    description: 'What indexes are, how they work internally, when to add them, when not to, and how to use EXPLAIN to diagnose slow queries.',
    category: 'Performance',
    order: 7,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## What is an Index?

An index is a separate data structure the database maintains to speed up lookups on a column.

**Analogy:** Imagine a 1000-page textbook with no index. To find "normalization," you read every page. With an index at the back, you find it instantly: "normalization — page 342."

Without an index, a query like \`WHERE email = 'alice@example.com'\` scans every row top-to-bottom. With an index on \`email\`, the database jumps directly to Alice's row.

---

## How Indexes Work Internally

Most databases use a **B-Tree** (Balanced Tree) index by default.

A B-Tree index:
- Keeps values in sorted order
- Can find a specific value in O(log n) — a table with 1 million rows needs only ~20 comparisons
- Supports range queries: \`WHERE price BETWEEN 10 AND 50\`
- Supports sorting: \`ORDER BY email\` is instant if email is indexed

**Without index:** Full table scan → O(n) — reads every row
**With B-Tree index:** Tree traversal → O(log n) — jumps to the right place

The database automatically creates an index for PRIMARY KEY and UNIQUE columns. You create indexes manually for other columns you query frequently.

---

## Creating Indexes

\`\`\`sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (for queries filtering on both columns)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Unique index (enforces uniqueness + speeds up lookups)
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Drop an index
DROP INDEX idx_users_email;
\`\`\`

---

## When to Add Indexes

**Good candidates for indexes:**
- Columns in WHERE clauses: \`WHERE user_id = 1\`
- Columns in JOIN conditions: \`ON orders.user_id = users.id\`
- Columns in ORDER BY (especially on large tables)
- Columns with high cardinality (many distinct values: email, username)
- Foreign key columns (PostgreSQL does NOT auto-index them)

**Bad candidates:**
- Columns rarely used in queries
- Columns with low cardinality: \`is_active\` (only true/false — index barely helps)
- Very small tables (< 10,000 rows — full scan is fine)
- Columns that are updated constantly (index rebuild cost outweighs read benefit)

---

## Composite Indexes — Column Order Matters

A composite index on \`(user_id, status)\` helps queries that filter on:
- \`user_id\` alone
- \`user_id AND status\`

It does NOT help queries that filter on \`status\` alone. The leftmost column must be used.

\`\`\`sql
-- This USES the index (user_id is leftmost)
SELECT * FROM orders WHERE user_id = 1 AND status = 'completed';

-- This also uses the index (prefix rule)
SELECT * FROM orders WHERE user_id = 1;

-- This does NOT use the index (status alone, no user_id)
SELECT * FROM orders WHERE status = 'completed';
\`\`\`

Put the most selective column (highest cardinality) first in the composite index.

---

## EXPLAIN — See What the Database Does

EXPLAIN shows the query execution plan — how the database will actually execute your query.

\`\`\`sql
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';
\`\`\`

Key terms in the output:
| Term | Meaning |
|------|---------|
| \`Seq Scan\` | Full table scan — reading every row. Slow on large tables. |
| \`Index Scan\` | Using an index. Fast. |
| \`Index Only Scan\` | Answer found entirely in index, no table read. Fastest. |
| \`Nested Loop\` | JOIN strategy for small tables |
| \`Hash Join\` | JOIN strategy for larger tables |

If you see Seq Scan on a large table with a WHERE clause, you likely need an index.

---

## The Cost of Indexes

Indexes are not free:
- Every INSERT, UPDATE, DELETE must also update all indexes on that table
- Indexes take disk space (can be as large as the table itself)
- Too many indexes slow down writes

**Rule:** Add indexes when you have a real slow-query problem. Don't pre-optimize with 10 indexes on a table you haven't launched yet.

---

## MongoDB Indexes

MongoDB uses the same B-Tree concept:

\`\`\`javascript
// Single field index
db.users.createIndex({ email: 1 });  // 1 = ascending

// Compound index
db.orders.createIndex({ userId: 1, status: 1 });

// Text index for search
db.posts.createIndex({ title: "text", body: "text" });

// See all indexes on a collection
db.users.getIndexes();

// Explain a query
db.users.find({ email: "alice@example.com" }).explain("executionStats");
\`\`\``,
    codeExamples: [
      {
        title: 'Before and after index — the difference is massive',
        code: `-- Table: orders with 5 million rows
-- Query: find all completed orders for user 1234

-- WITHOUT INDEX:
SELECT * FROM orders WHERE user_id = 1234 AND status = 'completed';
-- Execution: Seq Scan — reads all 5 million rows
-- Time: ~2 seconds

-- ADD INDEX:
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- WITH INDEX:
SELECT * FROM orders WHERE user_id = 1234 AND status = 'completed';
-- Execution: Index Scan — jumps to exactly the right rows
-- Time: ~1 millisecond

-- EXPLAIN shows you what's happening:
EXPLAIN ANALYZE SELECT * FROM orders
WHERE user_id = 1234 AND status = 'completed';

-- Before: "Seq Scan on orders (cost=0.00..98234.00 rows=5000000)"
-- After:  "Index Scan using idx_orders_user_status"
--         "(cost=0.56..8.58 rows=3)"`,
        explanation: 'A composite index on (user_id, status) turns a 2-second query into 1 millisecond. This is the real-world impact of indexing.',
      },
      {
        title: 'Index on foreign keys — a common mistake',
        code: `CREATE TABLE orders (
  id      SERIAL PRIMARY KEY,       -- auto-indexed
  user_id INT REFERENCES users(id), -- NOT auto-indexed in PostgreSQL!
  status  VARCHAR(50)
);

-- PostgreSQL auto-indexes PRIMARY KEY and UNIQUE columns only.
-- Foreign keys are NOT automatically indexed.
-- Every JOIN on user_id does a full table scan!

-- Fix: add index manually
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Now this JOIN is fast:
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id;`,
        explanation: 'PostgreSQL does NOT auto-index foreign keys. Always add an index on foreign key columns you join on.',
      },
    ],
    commonMistakes: [
      'Not indexing foreign key columns in PostgreSQL — every JOIN becomes a full table scan.',
      'Adding indexes on every column "just in case" — each index slows down writes.',
      'Using LIKE with a leading wildcard (%term) — indexes cannot help with leading wildcards.',
      'Ignoring EXPLAIN — you cannot know if an index is being used without looking at the execution plan.',
      'Creating a composite index in the wrong column order — the leftmost column must match your WHERE clause.',
    ],
    interviewQuestions: [
      {
        question: 'What is a database index and how does it work?',
        answer: 'An index is a separate data structure (usually a B-Tree) that stores column values in sorted order with pointers to the actual rows. Instead of scanning every row (O(n)), a query can traverse the B-Tree to find the target value in O(log n). The database automatically maintains the index on every insert, update, and delete.',
        difficulty: 'intermediate',
      },
      {
        question: 'What are the tradeoffs of adding an index?',
        answer: 'Indexes speed up reads (SELECT, JOIN, ORDER BY) but slow down writes (INSERT, UPDATE, DELETE) because every write must also update the index data structure. Indexes also consume disk space. The tradeoff is worthwhile when reads heavily outnumber writes and the column is used in frequent queries on large tables.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between a clustered and non-clustered index?',
        answer: 'A clustered index determines the physical order of data on disk — the table rows are stored in index order. There can be only one per table. In SQL Server, the primary key creates a clustered index. A non-clustered index is a separate structure with pointers back to the actual rows. PostgreSQL uses heap tables (non-clustered by default) and the primary key creates a regular non-clustered index.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'db-ex-7-1',
        title: 'Identify which columns need indexes',
        description: 'Given the queries below, identify which indexes to create on the orders and users tables.',
        starterCode: `-- Common queries in an e-commerce app:
-- Q1: SELECT * FROM orders WHERE user_id = 123;
-- Q2: SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC;
-- Q3: SELECT * FROM users WHERE email = 'alice@example.com';
-- Q4: SELECT * FROM orders WHERE user_id = 123 AND status = 'completed';
-- Q5: SELECT * FROM users WHERE name LIKE '%alice%';

-- Write the CREATE INDEX statements:
-- Hint: Q5 cannot be efficiently indexed with LIKE '%...%'`,
        solution: `-- Q1: index on user_id (frequent lookup by user)
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Q2: composite index on (status, created_at) — filters by status, sorts by date
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);

-- Q3: index on email (unique lookups for login)
CREATE INDEX idx_users_email ON users(email);
-- Or: CREATE UNIQUE INDEX (if email has UNIQUE constraint already, this is auto-created)

-- Q4: composite index covers both user_id and status
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- This also covers Q1 (leftmost prefix rule)

-- Q5: LIKE '%alice%' with leading wildcard CANNOT use a B-Tree index.
-- Solution: use PostgreSQL full-text search or a text search engine (Elasticsearch)`,
        hints: [
          'Columns in WHERE clauses are index candidates',
          'Composite indexes help when you filter on multiple columns together',
          'LIKE with a leading % cannot use a B-Tree index',
        ],
      },
    ],
    keyTakeaways: [
      'An index is a B-Tree data structure that makes lookups O(log n) instead of O(n).',
      'The database auto-indexes PRIMARY KEY and UNIQUE columns. Foreign keys need manual indexing.',
      'Composite index column order matters: leftmost column must be in the WHERE clause.',
      'Use EXPLAIN ANALYZE to see if your query uses an index.',
      'Indexes speed up reads but slow down writes. Add them when you have measured slow queries.',
      'LIKE with a leading wildcard (%term) cannot use B-Tree indexes.',
    ],
    prevLesson: 'database-design',
    nextLesson: 'transactions-acid',
  },

  // ─── LESSON 8 ────────────────────────────────────────────────────────────────
  {
    id: 'transactions-acid',
    slug: 'transactions-acid',
    title: 'Transactions & ACID Properties',
    description: 'What transactions are, ACID properties explained with real examples, isolation levels, and why they matter in banking, payments, and e-commerce.',
    category: 'Advanced SQL',
    order: 8,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## The Problem Transactions Solve

Imagine this payment scenario:
1. Deduct $100 from Alice's account
2. Add $100 to Bob's account

If the server crashes after step 1 but before step 2: Alice loses $100 and Bob gets nothing. The money disappears.

A **transaction** groups multiple operations into a single all-or-nothing unit. Either ALL steps succeed, or NONE of them happen.

---

## What is a Transaction?

A transaction is a sequence of database operations that execute as a single logical unit. It starts with \`BEGIN\`, ends with \`COMMIT\` (apply changes) or \`ROLLBACK\` (undo everything).

\`\`\`sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE user_id = 1; -- deduct Alice
  UPDATE accounts SET balance = balance + 100 WHERE user_id = 2; -- credit Bob
COMMIT; -- apply both, or roll back both
\`\`\`

If the server crashes after the first UPDATE but before COMMIT, the database automatically rolls back to the state before BEGIN. Neither change is applied. No money is lost.

---

## ACID Properties

ACID is the set of four guarantees that make transactions safe and reliable.

### A — Atomicity

**"All or nothing."**

Every operation in the transaction succeeds, or none of them do. There is no partial state. If any operation fails, the entire transaction is rolled back.

**Real example:** Booking a flight. Deduct payment + reserve seat + send confirmation email. If payment succeeds but seat reservation fails, the payment must be reversed.

---

### C — Consistency

**"The database always moves from one valid state to another valid state."**

All database constraints (NOT NULL, UNIQUE, CHECK, foreign keys) must hold before and after the transaction. If a transaction would violate a constraint, it is rejected.

**Real example:** A bank account balance cannot go negative (CHECK constraint). A transaction that would make it negative is rejected entirely.

---

### I — Isolation

**"Transactions don't interfere with each other."**

Concurrent transactions execute as if they were sequential. One transaction's intermediate state is invisible to other transactions.

**Real example:** Two people book the last available seat simultaneously. Isolation ensures only one succeeds — the other sees the seat as taken and fails.

---

### D — Durability

**"Once committed, data survives crashes."**

After a COMMIT, the data is written to persistent storage (disk). A server crash, power failure, or restart does not lose committed data.

Databases achieve this through **Write-Ahead Logging (WAL)**: every change is written to a log file before it is applied to the data file. On restart, the database replays the log.

---

## COMMIT and ROLLBACK

\`\`\`sql
-- Successful transaction
BEGIN;
  INSERT INTO orders (user_id, total) VALUES (1, 99.99);
  UPDATE inventory SET stock = stock - 1 WHERE product_id = 42;
COMMIT; -- both changes are saved permanently

-- Failed transaction
BEGIN;
  UPDATE accounts SET balance = balance - 1000 WHERE user_id = 1;
  -- Discover user doesn't have enough balance
ROLLBACK; -- undo the deduction, balance restored
\`\`\`

---

## Isolation Levels

How much do concurrent transactions see each other's changes? Isolation levels control this tradeoff.

| Level | Dirty Reads | Non-Repeatable Reads | Phantom Reads |
|-------|-------------|----------------------|---------------|
| READ UNCOMMITTED | ✓ possible | ✓ possible | ✓ possible |
| READ COMMITTED | ✗ prevented | ✓ possible | ✓ possible |
| REPEATABLE READ | ✗ prevented | ✗ prevented | ✓ possible |
| SERIALIZABLE | ✗ prevented | ✗ prevented | ✗ prevented |

**Dirty Read:** Reading data from a transaction that hasn't committed yet. If that transaction rolls back, you read data that never existed.

**Non-Repeatable Read:** Reading the same row twice in one transaction and getting different values (another transaction updated it in between).

**Phantom Read:** Running the same query twice and getting different rows (another transaction inserted/deleted rows in between).

**PostgreSQL default:** READ COMMITTED — you only see committed data. Safe for most applications.
**Use SERIALIZABLE for:** Financial systems, anything where reading then writing must be consistent.

---

## Savepoints

Savepoints let you partially roll back within a transaction:

\`\`\`sql
BEGIN;
  INSERT INTO orders (user_id, total) VALUES (1, 99.99);
  SAVEPOINT after_order;

  INSERT INTO payments (order_id, amount) VALUES (1, 99.99);
  -- Payment fails!
  ROLLBACK TO SAVEPOINT after_order; -- undo only the payment insert
  -- Order insert is still in effect

  -- Try alternative payment method
  INSERT INTO payments (order_id, amount, method) VALUES (1, 99.99, 'cash');
COMMIT;
\`\`\`

---

## Transactions in Application Code

In Node.js with pg (PostgreSQL):
\`\`\`javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    [100, aliceId]
  );
  await client.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
    [100, bobId]
  );
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
\`\`\``,
    codeExamples: [
      {
        title: 'Bank transfer — the classic transaction example',
        code: `-- Transfer $500 from Alice (id=1) to Bob (id=2)
BEGIN;

-- Check Alice has enough balance
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- FOR UPDATE locks the row so no other transaction modifies it

-- Deduct from Alice
UPDATE accounts
SET balance = balance - 500
WHERE id = 1;

-- Verify balance didn't go negative
-- (CHECK constraint handles this, but good to be explicit)

-- Add to Bob
UPDATE accounts
SET balance = balance + 500
WHERE id = 2;

COMMIT;
-- Both updates happen atomically. Crash between them? Both rolled back.

-- Example of explicit ROLLBACK:
BEGIN;
UPDATE accounts SET balance = balance - 10000 WHERE id = 1;
-- CHECK constraint fires: balance would be negative!
-- Database auto-rejects, but you should explicitly:
ROLLBACK;`,
        explanation: 'FOR UPDATE locks rows so concurrent transfers cannot interfere. COMMIT applies both updates together.',
      },
      {
        title: 'Order placement transaction',
        code: `-- Place an order: deduct inventory + create order + create payment record
BEGIN;

-- 1. Check and lock the product row
SELECT stock FROM products WHERE id = 42 FOR UPDATE;
-- Suppose stock = 3

-- 2. Deduct inventory
UPDATE products SET stock = stock - 1 WHERE id = 42;

-- 3. Create the order
INSERT INTO orders (user_id, status, total)
VALUES (1, 'pending', 29.99)
RETURNING id;  -- get the new order id

-- 4. Create order item
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (lastval(), 42, 1, 29.99);

-- 5. Charge payment (if this fails, everything rolls back)
INSERT INTO payments (order_id, amount, status)
VALUES (lastval(), 29.99, 'charged');

COMMIT;
-- All 4 operations succeed together, or all are rolled back`,
        explanation: 'Real e-commerce order placement touches multiple tables. A transaction guarantees consistency — no order without inventory, no charge without order.',
      },
    ],
    commonMistakes: [
      'Holding transactions open too long — long-running transactions lock rows, blocking other operations and causing performance issues.',
      'Not using transactions for multi-step operations — without a transaction, a crash between two related queries leaves data in an inconsistent state.',
      'Using READ UNCOMMITTED isolation — you can read data that was never committed (dirty reads). Avoid in production.',
      'Forgetting ROLLBACK in error handling — if your application catches an error but does not rollback, the transaction remains open and locks rows.',
      'Not using FOR UPDATE when reading then writing — without it, two transactions can both read the same value, both decide to proceed, causing race conditions.',
    ],
    interviewQuestions: [
      {
        question: 'What are the ACID properties and what does each mean?',
        answer: 'Atomicity: all operations in a transaction succeed or all fail — no partial state. Consistency: the database moves from one valid state to another, all constraints hold. Isolation: concurrent transactions do not see each other\'s intermediate state. Durability: once committed, data survives crashes and restarts via write-ahead logging.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between COMMIT and ROLLBACK?',
        answer: 'COMMIT permanently saves all changes made in the transaction to the database. After COMMIT, the changes are durable and visible to other transactions. ROLLBACK undoes all changes made since BEGIN, restoring the database to its state before the transaction started. ROLLBACK is used when an error occurs or business logic decides the operation should not proceed.',
        difficulty: 'beginner',
      },
      {
        question: 'What are dirty reads, non-repeatable reads, and phantom reads?',
        answer: 'Dirty read: reading uncommitted data from another transaction (that may be rolled back). Non-repeatable read: reading the same row twice in one transaction and getting different values because another transaction committed a change in between. Phantom read: running the same query twice and getting different rows because another transaction inserted or deleted rows. Each isolation level prevents more of these anomalies at the cost of concurrency.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'db-ex-8-1',
        title: 'Write a transaction for seat booking',
        description: 'Write a SQL transaction that books a seat on a flight. It should: check if the seat is available, mark it as taken, and create a booking record — all atomically.',
        starterCode: `-- Tables:
-- seats(id, flight_id, seat_number, is_available)
-- bookings(id, user_id, seat_id, booked_at)

-- Write a transaction to book seat_id=15 for user_id=1:
-- 1. Lock the seat row
-- 2. Check if is_available = true (rollback if not)
-- 3. Mark seat as unavailable
-- 4. Insert booking record

BEGIN;

-- your SQL here

COMMIT;`,
        solution: `BEGIN;

-- 1. Lock the seat row for update (prevents concurrent booking)
SELECT id, is_available
FROM seats
WHERE id = 15
FOR UPDATE;

-- 2. In application code you'd check is_available here and ROLLBACK if false.
--    In pure SQL, use a conditional approach:

-- 3. Update the seat (this will silently update 0 rows if not available)
UPDATE seats
SET is_available = false
WHERE id = 15 AND is_available = true;

-- In application code: check rowCount = 1; if 0, ROLLBACK

-- 4. Create the booking
INSERT INTO bookings (user_id, seat_id, booked_at)
VALUES (1, 15, NOW());

COMMIT;`,
        hints: [
          'Use FOR UPDATE to lock the row and prevent concurrent bookings',
          'Check is_available in the WHERE clause of UPDATE to make it conditional',
          'If UPDATE affects 0 rows, another transaction already booked it — rollback',
        ],
      },
    ],
    keyTakeaways: [
      'A transaction is a group of operations that are all-or-nothing. BEGIN + COMMIT/ROLLBACK.',
      'ACID: Atomicity (all or nothing), Consistency (valid states only), Isolation (no interference), Durability (survives crashes).',
      'READ COMMITTED is the PostgreSQL default — safe for most apps. SERIALIZABLE for financial systems.',
      'FOR UPDATE locks rows to prevent race conditions when reading then writing.',
      'Always ROLLBACK on error in application code. Never leave a transaction open.',
      'Long transactions block other operations. Keep transactions short.',
    ],
    prevLesson: 'indexing',
    nextLesson: 'postgresql',
  },

  // ─── LESSON 9 ────────────────────────────────────────────────────────────────
  {
    id: 'postgresql',
    slug: 'postgresql',
    title: 'PostgreSQL',
    description: 'The most powerful open-source relational database. Setup, commands, JSON support, arrays, full-text search, and real project usage.',
    category: 'Databases',
    order: 9,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## Why PostgreSQL?

PostgreSQL is the gold standard for open-source relational databases. It is:
- **Fully ACID compliant** — most reliable transactions
- **Feature-rich** — JSON, arrays, full-text search, window functions, CTEs
- **Extensible** — add custom types, functions, and extensions (like pgvector for AI)
- **Production-grade** — used by Instagram, Gitlab, Heroku, Supabase, and thousands of companies
- **Free and open source** — no licensing cost

**PostgreSQL vs MySQL:** PostgreSQL is more standards-compliant, supports more data types, and has better support for complex queries. MySQL is simpler and was historically faster for reads. For new projects, PostgreSQL is the modern default.

---

## Installation & Setup

\`\`\`bash
# Ubuntu / Debian
sudo apt install postgresql

# macOS
brew install postgresql
brew services start postgresql

# Start service
sudo service postgresql start

# Connect as postgres superuser
sudo -u postgres psql

# Or using psql directly
psql -U postgres -h localhost
\`\`\`

---

## Essential psql Commands

\`\`\`sql
-- Connect to a database
\\c myapp

-- List all databases
\\l

-- List all tables in current database
\\dt

-- Describe a table (show columns, types, constraints)
\\d users

-- Show all indexes
\\di

-- Execute a SQL file
\\i /path/to/file.sql

-- Show query execution plan
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';

-- Quit psql
\\q
\`\`\`

---

## Database Creation and User Management

\`\`\`sql
-- Create a database
CREATE DATABASE myapp;

-- Create a user/role
CREATE USER myapp_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myapp_user;

-- Connect string for applications:
-- postgresql://myapp_user:secure_password@localhost:5432/myapp
\`\`\`

---

## PostgreSQL-Specific Data Types

PostgreSQL has types not available in MySQL or SQLite:

### JSONB — Queryable JSON
\`\`\`sql
CREATE TABLE products (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(200),
  metadata JSONB  -- store flexible attributes
);

INSERT INTO products (name, metadata) VALUES
('iPhone 15', '{"color": "black", "storage": "256GB", "weight": 171}');

-- Query inside JSON
SELECT name FROM products WHERE metadata->>'color' = 'black';
SELECT name, metadata->>'storage' AS storage FROM products;

-- Index on a JSON field
CREATE INDEX idx_products_color ON products ((metadata->>'color'));
\`\`\`

### Arrays
\`\`\`sql
CREATE TABLE posts (
  id   SERIAL PRIMARY KEY,
  tags TEXT[]  -- array of strings
);

INSERT INTO posts (tags) VALUES ('{"postgresql", "databases", "backend"}');

-- Query: find posts with 'databases' tag
SELECT * FROM posts WHERE 'databases' = ANY(tags);
\`\`\`

### UUID Primary Keys
\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL
);

-- UUIDs are globally unique — useful for distributed systems
-- and public-facing IDs (avoids sequential ID enumeration)
\`\`\`

---

## Full-Text Search

\`\`\`sql
-- Create a searchable column
ALTER TABLE posts ADD COLUMN search_vector TSVECTOR;

-- Build search index
UPDATE posts SET search_vector =
  to_tsvector('english', title || ' ' || body);

CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Search query
SELECT title FROM posts
WHERE search_vector @@ to_tsquery('english', 'database & performance');
\`\`\`

---

## Window Functions

Window functions let you calculate values across a set of rows without collapsing them (unlike GROUP BY).

\`\`\`sql
-- Rank products by price within each category
SELECT
  name,
  category,
  price,
  RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
FROM products;

-- Running total of sales
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) AS running_total
FROM sales;
\`\`\`

---

## Common Table Expressions (CTEs)

CTEs make complex queries readable by giving a name to a subquery:

\`\`\`sql
-- Find users who have spent more than the average user
WITH user_totals AS (
  SELECT user_id, SUM(total) AS total_spent
  FROM orders
  GROUP BY user_id
),
avg_spend AS (
  SELECT AVG(total_spent) AS avg FROM user_totals
)
SELECT u.name, ut.total_spent
FROM users u
JOIN user_totals ut ON u.id = ut.user_id
JOIN avg_spend a ON ut.total_spent > a.avg;
\`\`\`

---

## Connection Pooling

PostgreSQL connections are expensive. In production, use a connection pool:

\`\`\`javascript
// Node.js with pg + connection pool
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                // maximum 20 connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool.query() — automatically manages connections
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
\`\`\`

**Parameterized queries ($1, $2)** prevent SQL injection — always use them with user input.`,
    codeExamples: [
      {
        title: 'Complete PostgreSQL project setup',
        code: `-- 1. Create database and user
CREATE DATABASE ecommerce;
CREATE USER ecommerce_user WITH PASSWORD 'strongpassword';
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_user;

-- 2. Connect to database
\\c ecommerce

-- 3. Create tables
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  attributes  JSONB DEFAULT '{}',  -- flexible: color, size, weight
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_attrs ON products USING GIN(attributes);

-- 5. Insert data
INSERT INTO products (name, price, attributes, tags) VALUES
('iPhone 15', 999.00,
  '{"color": "black", "storage": "128GB"}',
  '{"phone", "apple", "mobile"}');

-- 6. Query with JSON
SELECT name, attributes->>'color' AS color
FROM products
WHERE 'apple' = ANY(tags)
  AND (attributes->>'price')::numeric < 1000;`,
        explanation: 'This is a complete PostgreSQL setup using UUID primary keys, JSONB for flexible attributes, and array tags — patterns used in real production apps.',
      },
      {
        title: 'Upsert — INSERT or UPDATE on conflict',
        code: `-- PostgreSQL's ON CONFLICT handles upserts elegantly
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice')
ON CONFLICT (email)
DO UPDATE SET
  name = EXCLUDED.name,        -- EXCLUDED refers to the values you tried to insert
  updated_at = NOW();

-- If email doesn't exist: insert
-- If email already exists: update name and updated_at

-- Another common pattern: ignore duplicates
INSERT INTO tags (name)
VALUES ('postgresql')
ON CONFLICT (name) DO NOTHING;`,
        explanation: 'ON CONFLICT is PostgreSQL\'s upsert — insert if new, update if exists. More elegant than DELETE + INSERT.',
      },
    ],
    commonMistakes: [
      'Using TIMESTAMP instead of TIMESTAMPTZ — without timezone, times are ambiguous across server regions.',
      'Not using parameterized queries ($1, $2) with user input — this leads to SQL injection vulnerabilities.',
      'Opening a connection per request instead of using a pool — PostgreSQL connections are expensive to create.',
      'Using SERIAL instead of gen_random_uuid() for public-facing IDs — sequential IDs are predictable and allow enumeration attacks.',
      'Not running VACUUM and ANALYZE — PostgreSQL needs periodic maintenance to reclaim dead row space.',
    ],
    interviewQuestions: [
      {
        question: 'Why would you choose PostgreSQL over MySQL?',
        answer: 'PostgreSQL is more standards-compliant, supports richer data types (JSONB, arrays, UUID, ranges), has better support for complex queries (CTEs, window functions, lateral joins), more robust full-text search, and stronger ACID compliance. MySQL has a larger market share and was historically faster for simple reads. For new projects in 2024, PostgreSQL is the modern default choice.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between JSON and JSONB in PostgreSQL?',
        answer: 'JSON stores data as text exactly as received. JSONB stores data in a decomposed binary format that is slower to insert but faster to query and can be indexed with GIN indexes. JSONB also removes duplicate keys and does not preserve key order. In practice, always use JSONB — it is queryable and indexable, making it far more useful for production workloads.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is a connection pool and why is it important?',
        answer: 'A connection pool is a cache of reusable database connections. Creating a new PostgreSQL connection takes ~50ms and consumes server resources. A pool maintains pre-created connections and reuses them across requests, dramatically reducing latency. Without a pool, a high-traffic app creates and destroys connections constantly, overwhelming the database. Libraries like pg-pool (Node.js) or HikariCP (Java) manage pools automatically.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-9-1',
        title: 'Write a PostgreSQL query with JSONB and window functions',
        description: 'Given a products table with a JSONB attributes column, write queries that use PostgreSQL-specific features.',
        starterCode: `-- Table: products(id, name, price, category, attributes JSONB)
-- Sample data:
-- ('iPhone 15', 999, 'phones', '{"brand":"Apple","storage":"128GB"}')
-- ('Galaxy S24', 899, 'phones', '{"brand":"Samsung","storage":"256GB"}')
-- ('MacBook Pro', 1999, 'laptops', '{"brand":"Apple","ram":"16GB"}')

-- Task 1: Find all Apple products
SELECT name FROM products WHERE attributes->>'brand' = 'Apple';

-- Task 2: Rank products by price within each category
-- (use window function)

-- Task 3: Upsert a product (insert or update on conflict with name)`,
        solution: `-- Task 1:
SELECT name, price FROM products
WHERE attributes->>'brand' = 'Apple';

-- Task 2: Rank by price within category
SELECT
  name,
  category,
  price,
  RANK() OVER (PARTITION BY category ORDER BY price ASC) AS price_rank
FROM products;
-- Result: within each category, cheapest gets rank 1

-- Task 3: Upsert
INSERT INTO products (name, price, category, attributes)
VALUES ('iPhone 15', 1099.00, 'phones', '{"brand":"Apple","storage":"256GB"}')
ON CONFLICT (name)
DO UPDATE SET
  price = EXCLUDED.price,
  attributes = EXCLUDED.attributes;`,
        hints: [
          'Use ->>\' operator to extract JSONB field as text',
          'RANK() OVER (PARTITION BY col ORDER BY col) for window ranking',
          'ON CONFLICT (col) DO UPDATE SET ... for upsert',
        ],
      },
    ],
    keyTakeaways: [
      'PostgreSQL is the modern default for relational databases — use it for new projects.',
      'JSONB stores queryable JSON. Arrays store lists. UUID generates globally unique IDs.',
      'Always use TIMESTAMPTZ, parameterized queries ($1, $2), and connection pools in production.',
      'Window functions (RANK, SUM OVER) and CTEs make complex queries readable.',
      'ON CONFLICT DO UPDATE is the PostgreSQL upsert — insert or update in one query.',
      'Use EXPLAIN ANALYZE to diagnose slow queries. GIN indexes for JSONB and arrays.',
    ],
    prevLesson: 'transactions-acid',
    nextLesson: 'mysql',
  },

  // ─── LESSON 10 ───────────────────────────────────────────────────────────────
  {
    id: 'mysql',
    slug: 'mysql',
    title: 'MySQL',
    description: 'MySQL fundamentals, key differences from PostgreSQL, common use cases, and when to choose it for your project.',
    category: 'Databases',
    order: 10,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## What is MySQL?

MySQL is the world's most popular open-source relational database by deployment count. It powers WordPress, Facebook (legacy), Twitter (legacy), YouTube, and millions of web applications.

**Key facts:**
- Created in 1995, now owned by Oracle
- Default database for LAMP stack (Linux, Apache, MySQL, PHP)
- Powers ~60% of the world's websites (mostly via WordPress)
- InnoDB storage engine (default since 5.5) provides full ACID compliance

---

## MySQL vs PostgreSQL — Key Differences

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| JSON support | Basic JSON type | JSONB (binary, queryable, indexable) |
| Arrays | Not supported | Native arrays |
| Standards compliance | Partial | Full SQL standard |
| Full-text search | Basic | Advanced |
| Default port | 3306 | 5432 |
| Auto-increment | AUTO_INCREMENT | SERIAL / GENERATED ALWAYS AS IDENTITY |
| Case-sensitivity | Case-insensitive by default | Case-sensitive |
| Window functions | MySQL 8+ | Full support |
| Community | Huge (WordPress ecosystem) | Growing, developer-favorite |

**When to choose MySQL:**
- Existing WordPress/PHP ecosystem
- Team already knows MySQL
- Simple read-heavy workloads
- Inherited legacy project

**When to choose PostgreSQL over MySQL:**
- New project (green-field)
- Complex queries and data types
- Need JSONB, arrays, or full-text search
- Want better standards compliance

---

## MySQL Syntax — What's Different

\`\`\`sql
-- Auto-increment (different from PostgreSQL's SERIAL)
CREATE TABLE users (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

-- MySQL uses backticks for identifiers (PostgreSQL uses double quotes)
SELECT \`name\`, \`email\` FROM \`users\`;

-- LIMIT syntax is the same
SELECT * FROM users LIMIT 10 OFFSET 20;

-- Show tables (MySQL-specific)
SHOW TABLES;
SHOW DATABASES;
DESCRIBE users;

-- String functions (slightly different names in some cases)
SELECT UPPER(name), LENGTH(email) FROM users;

-- Date/time
SELECT NOW(), CURDATE(), CURTIME();
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') FROM users;
\`\`\`

---

## MySQL Storage Engines

MySQL has pluggable storage engines. The most important:

| Engine | Use case | ACID | Notes |
|--------|----------|------|-------|
| InnoDB | General purpose | Yes | Default, supports transactions and foreign keys |
| MyISAM | Read-heavy, legacy | No | Older engine, no transactions |
| MEMORY | Temporary data | No | Data lost on restart |

**Always use InnoDB.** It is the default and the only production-ready engine.

---

## MySQL in Production (Common Setup)

\`\`\`sql
-- Create database with UTF-8 support
CREATE DATABASE myapp
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
-- utf8mb4 supports emojis and all Unicode characters
-- MySQL's "utf8" is a misnomer — only 3 bytes, doesn't support emojis

-- Create user and grant permissions
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'securepassword';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;

-- Connection string for Node.js
-- mysql://myapp_user:securepassword@localhost:3306/myapp
\`\`\`

---

## MySQL with Node.js

\`\`\`javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'myapp_user',
  password: 'securepassword',
  database: 'myapp',
  waitForConnections: true,
  connectionLimit: 10,
});

// Query with parameterized input (prevents SQL injection)
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE email = ?',
  [userEmail]  // ? placeholder, not $1 like PostgreSQL
);
\`\`\`

Note: MySQL uses \`?\` for parameterized queries. PostgreSQL uses \`$1, $2\`.`,
    codeExamples: [
      {
        title: 'MySQL CRUD — full example',
        code: `-- Create table (MySQL syntax)
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  category    VARCHAR(100),
  in_stock    TINYINT(1) DEFAULT 1,  -- MySQL uses TINYINT for boolean
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ON UPDATE CURRENT_TIMESTAMP auto-updates timestamp on every UPDATE

-- Insert
INSERT INTO products (name, price, category) VALUES
('Laptop', 999.99, 'Electronics'),
('Mouse', 29.99, 'Electronics');

-- Select with ordering and limit
SELECT name, price FROM products
WHERE category = 'Electronics'
ORDER BY price DESC
LIMIT 10;

-- Update
UPDATE products SET price = 899.99 WHERE id = 1;

-- Delete
DELETE FROM products WHERE in_stock = 0;`,
        explanation: 'MySQL CRUD is nearly identical to PostgreSQL. Key differences: AUTO_INCREMENT, TINYINT for bool, ON UPDATE CURRENT_TIMESTAMP.',
      },
    ],
    commonMistakes: [
      'Using MySQL\'s "utf8" charset instead of "utf8mb4" — MySQL\'s utf8 only supports 3 bytes and breaks on emojis.',
      'Forgetting that MySQL is case-insensitive for string comparisons by default — "Alice" = "alice" in MySQL.',
      'Using MyISAM storage engine — it has no transactions or foreign key support. Always use InnoDB.',
      'Using ? parameters in MySQL code but $1 syntax (PostgreSQL style) — they are not interchangeable.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between MySQL and PostgreSQL?',
        answer: 'PostgreSQL is more feature-rich (JSONB, arrays, better full-text search, full SQL compliance), more standards-compliant, and is the modern developer default. MySQL has a larger deployment base (WordPress ecosystem), slightly simpler syntax, and is widely used in legacy LAMP stacks. For new projects, PostgreSQL is generally preferred. MySQL is a solid choice when working in an existing PHP/WordPress ecosystem.',
        difficulty: 'beginner',
      },
      {
        question: 'What is InnoDB and why does it matter?',
        answer: 'InnoDB is MySQL\'s default storage engine. It supports full ACID transactions, foreign key constraints, row-level locking, and crash recovery via write-ahead logging. The older MyISAM engine has none of these. Always use InnoDB. Most MySQL installations default to InnoDB since version 5.5.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-10-1',
        title: 'Convert PostgreSQL schema to MySQL',
        description: 'Convert this PostgreSQL table to MySQL-compatible syntax.',
        starterCode: `-- PostgreSQL version:
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Convert to MySQL syntax:
-- Hints: SERIAL → INT AUTO_INCREMENT
--        BOOLEAN → TINYINT(1)
--        TIMESTAMPTZ → DATETIME
--        Add ENGINE=InnoDB and charset

CREATE TABLE users (
  -- your MySQL version here
);`,
        solution: `CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  is_active  TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
        hints: ['SERIAL becomes INT AUTO_INCREMENT', 'BOOLEAN becomes TINYINT(1)', 'Always specify ENGINE=InnoDB and utf8mb4 charset'],
      },
    ],
    keyTakeaways: [
      'MySQL powers most of the web (WordPress, legacy Facebook, YouTube).',
      'For new projects, prefer PostgreSQL. Choose MySQL for existing PHP/WordPress stacks.',
      'Always use InnoDB engine, utf8mb4 charset, and parameterized queries (?).',
      'MySQL uses AUTO_INCREMENT, TINYINT(1) for booleans, backtick identifiers.',
      'Key MySQL difference: case-insensitive strings by default, no native arrays or JSONB.',
    ],
    prevLesson: 'postgresql',
    nextLesson: 'sqlite',
  },

  // ─── LESSON 11 ───────────────────────────────────────────────────────────────
  {
    id: 'sqlite',
    slug: 'sqlite',
    title: 'SQLite',
    description: 'The world\'s most deployed database — no server required. Perfect for mobile apps, small projects, prototypes, and embedded systems.',
    category: 'Databases',
    order: 11,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## What is SQLite?

SQLite is a **serverless, self-contained, file-based** SQL database. The entire database is a single file on disk. There is no separate server process to install, configure, or maintain.

**Analogy:** PostgreSQL is a restaurant with a professional kitchen staff. SQLite is a lunchbox — simple, portable, requires no setup.

---

## Why SQLite Exists

Most apps don't need the overhead of a full database server. SQLite provides:
- **Zero configuration** — just include the library
- **Single file** — the entire database is one .db file
- **Cross-platform** — works on iOS, Android, Windows, Linux, macOS
- **Serverless** — no network, no authentication, no ports
- **ACID compliant** — full transactions despite being serverless
- **Incredibly small** — library is ~600KB

---

## Where SQLite is Used

**Mobile apps (most common):**
- iOS uses SQLite for CoreData storage
- Android uses SQLite for Room database
- WhatsApp stores messages in SQLite on your phone
- Signal, Telegram, most messaging apps

**Browsers:**
- Chrome stores browsing history, bookmarks, and cookies in SQLite
- Firefox uses SQLite for profile data

**Small and medium web apps:**
- Prototypes and MVPs
- Internal tools
- Blogs with low traffic

**Embedded systems:**
- IoT devices
- Smart TVs
- In-flight entertainment systems

**Development and testing:**
- Spin up a database in tests without Docker or a server
- No cleanup needed — delete the .db file

---

## SQLite Limitations

| Limitation | Details |
|------------|---------|
| Concurrent writes | SQLite uses file-level locking — only one writer at a time |
| No user management | No users, roles, or authentication |
| Limited data types | No array, JSONB, or custom types |
| Not for high-traffic web | Concurrent writes bottle-neck beyond ~100 req/sec |
| Network access | Not designed for client-server use across a network |

**Rule:** Use SQLite for development, mobile, and small tools. Use PostgreSQL or MySQL for production web backends with multiple concurrent users.

---

## SQLite Syntax

SQLite speaks standard SQL with minor differences:

\`\`\`sql
-- Create database: just create a .db file
-- sqlite3 myapp.db

-- Create table (same as standard SQL)
CREATE TABLE users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))  -- stored as text
);

-- SQLite data types are flexible (dynamic typing)
-- INTEGER, TEXT, REAL, BLOB, NULL

-- Standard CRUD works identically
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
SELECT * FROM users WHERE email LIKE '%@example.com';
UPDATE users SET name = 'Alice Smith' WHERE id = 1;
DELETE FROM users WHERE id = 2;

-- SQLite-specific: last inserted row id
SELECT last_insert_rowid();
\`\`\`

---

## SQLite in Node.js

\`\`\`javascript
// Using better-sqlite3 (synchronous, fast)
const Database = require('better-sqlite3');
const db = new Database('myapp.db');

// Create table
db.exec(\`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
\`);

// Prepared statement (parameterized, prevents SQL injection)
const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
insert.run('Alice', 'alice@example.com');

// Query
const user = db.prepare('SELECT * FROM users WHERE email = ?').get('alice@example.com');
console.log(user); // { id: 1, name: 'Alice', email: 'alice@example.com' }

// Close (optional, happens on process exit)
db.close();
\`\`\`

---

## SQLite in Modern Backend (The New Wave)

SQLite is having a renaissance for production use:
- **Cloudflare D1** — SQLite-based distributed database at the edge
- **Turso** — distributed SQLite with global replication
- **Bun** — has built-in SQLite support
- **Litestream** — streams SQLite changes to S3 for backup

For many startups and indie apps, SQLite is now a viable production database when combined with these tools.`,
    codeExamples: [
      {
        title: 'SQLite with Prisma ORM',
        code: `// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"  // creates dev.db file in project
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  body     String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}

// Run: npx prisma migrate dev --name init
// This creates the SQLite file and all tables automatically`,
        explanation: 'Prisma with SQLite is the fastest way to prototype a full application. No server to set up. Change schema.prisma, run migrate.',
      },
    ],
    commonMistakes: [
      'Using SQLite for a high-traffic web API — concurrent writes cause lock contention and timeouts.',
      'Not using WAL (Write-Ahead Logging) mode — default journal mode is slower. Enable WAL for better performance.',
      'Assuming SQLite and PostgreSQL SQL are identical — small syntax differences exist (no RETURNING on older versions, no BOOLEAN type).',
      'Committing the .db file to git — SQLite databases should be in .gitignore for production data.',
    ],
    interviewQuestions: [
      {
        question: 'When would you use SQLite over PostgreSQL?',
        answer: 'SQLite is ideal for: mobile apps (iOS, Android — no server setup), development and testing (no Docker required), small tools and internal utilities with low traffic, embedded systems, and prototypes. Use PostgreSQL for production web backends with concurrent users, complex queries, or data integrity requirements.',
        difficulty: 'beginner',
      },
      {
        question: 'Why do mobile apps use SQLite?',
        answer: 'Mobile apps use SQLite because it is serverless (no network connection needed), extremely lightweight (600KB), runs entirely on the device, provides ACID transactions for data safety, and is built into both iOS and Android. It is perfect for storing local app data like messages, cached responses, user preferences, and offline content.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'db-ex-11-1',
        title: 'Build a note-taking app schema in SQLite',
        description: 'Design a SQLite schema for a simple note-taking app with notes and tags.',
        starterCode: `-- Design tables for: notes (with title and body) and tags
-- Requirements:
-- Notes have: id, title, body, is_pinned, created_at
-- Tags have: id, name
-- A note can have many tags (many-to-many)

-- Write the CREATE TABLE statements for SQLite:`,
        solution: `CREATE TABLE notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  body       TEXT,
  is_pinned  INTEGER DEFAULT 0,  -- SQLite has no BOOLEAN, use 0/1
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE tags (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE note_tags (
  note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  tag_id  INTEGER REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Enable foreign key support (disabled by default in SQLite!)
PRAGMA foreign_keys = ON;`,
        hints: [
          'SQLite uses INTEGER not BOOLEAN for true/false',
          'SQLite foreign keys are OFF by default — enable with PRAGMA foreign_keys = ON',
          'Many-to-many still needs a junction table',
        ],
      },
    ],
    keyTakeaways: [
      'SQLite is a single-file, serverless database — perfect for mobile, prototypes, and tools.',
      'WhatsApp, Chrome, iOS, Android all use SQLite to store local data.',
      'Not suitable for high-concurrency web backends — use PostgreSQL for that.',
      'SQLite foreign keys must be enabled explicitly: PRAGMA foreign_keys = ON.',
      'Prisma + SQLite is the fastest way to prototype a Node.js application.',
      'Turso, Cloudflare D1, and Litestream make SQLite viable for production edge apps.',
    ],
    prevLesson: 'mysql',
    nextLesson: 'mongodb',
  },

  // ─── LESSON 12 ───────────────────────────────────────────────────────────────
  {
    id: 'mongodb',
    slug: 'mongodb',
    title: 'MongoDB',
    description: 'The leading document database — CRUD operations, aggregation pipeline, indexes, embedding vs referencing, and real project patterns with full code examples.',
    category: 'NoSQL',
    order: 12,
    difficulty: 'intermediate',
    estimatedTime: 50,
    content: `## What is MongoDB?

MongoDB is a **document database** — it stores data as JSON-like documents (BSON) instead of rows in tables. Documents can have nested objects and arrays, making them natural to work with in JavaScript.

**Why it exists:** Relational databases require you to define a rigid schema upfront. MongoDB lets you store flexible, nested data without a fixed structure. This makes it fast to prototype and natural for object-oriented applications.

**Real-world usage:** MongoDB powers Uber's geolocation metadata, Airbnb's listings, Lyft's driver profiles, Adobe, and thousands of SaaS applications.

---

## Core Concepts

| SQL Concept | MongoDB Equivalent |
|-------------|-------------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | _id (auto-generated ObjectId) |
| JOIN | $lookup aggregation |
| INDEX | Index |

---

## Documents and Collections

A **document** is a JSON-like object. Every document in MongoDB has an \`_id\` field (auto-generated if not provided):

\`\`\`json
{
  "_id": ObjectId("64a7f1b2c3d4e5f6a7b8c9d0"),
  "name": "Alice",
  "email": "alice@example.com",
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "tags": ["premium", "verified"],
  "createdAt": ISODate("2024-01-15T10:00:00Z")
}
\`\`\`

A **collection** is a group of documents (like a table). Documents in the same collection can have different fields.

---

## CRUD Operations

### Create
\`\`\`javascript
// Insert one document
await db.collection('users').insertOne({
  name: 'Alice',
  email: 'alice@example.com',
  age: 28
});

// Insert many documents
await db.collection('users').insertMany([
  { name: 'Bob',     email: 'bob@example.com',     age: 32 },
  { name: 'Charlie', email: 'charlie@example.com', age: 25 }
]);
\`\`\`

### Read
\`\`\`javascript
// Find all documents
const all = await db.collection('users').find({}).toArray();

// Find with filter
const alice = await db.collection('users').findOne({ email: 'alice@example.com' });

// Find all users over 25
const adults = await db.collection('users')
  .find({ age: { $gt: 25 } })
  .toArray();

// Projection (select specific fields)
const names = await db.collection('users')
  .find({}, { projection: { name: 1, email: 1, _id: 0 } })
  .toArray();

// Sort, skip, limit (pagination)
const page2 = await db.collection('users')
  .find({})
  .sort({ name: 1 })
  .skip(10)
  .limit(10)
  .toArray();
\`\`\`

### Update
\`\`\`javascript
// Update one document
await db.collection('users').updateOne(
  { email: 'alice@example.com' },    // filter
  { $set: { age: 29, city: 'NYC' } } // update operator
);

// $set: updates specific fields without replacing the whole document
// $inc: increment a number field
await db.collection('products').updateOne(
  { _id: productId },
  { $inc: { stock: -1 } }  // decrement stock by 1
);

// Upsert: update if exists, insert if not
await db.collection('users').updateOne(
  { email: 'new@example.com' },
  { $set: { name: 'New User' } },
  { upsert: true }
);
\`\`\`

### Delete
\`\`\`javascript
// Delete one document
await db.collection('users').deleteOne({ email: 'alice@example.com' });

// Delete many documents
await db.collection('orders').deleteMany({ status: 'cancelled' });
\`\`\`

---

## Query Operators

\`\`\`javascript
// Comparison
{ age: { $gt: 25 } }           // greater than
{ age: { $gte: 18, $lte: 65 }} // between 18 and 65
{ status: { $in: ['active', 'premium'] } } // in array
{ status: { $ne: 'banned' } }  // not equal

// Logical
{ $and: [{ age: { $gt: 18 } }, { city: 'New York' }] }
{ $or: [{ status: 'active' }, { role: 'admin' }] }

// Array queries
{ tags: 'premium' }              // array contains 'premium'
{ tags: { $all: ['a', 'b'] } }  // array contains all of these

// Nested document queries
{ 'address.city': 'New York' }  // dot notation for nested fields
\`\`\`

---

## Aggregation Pipeline

The aggregation pipeline is MongoDB's most powerful feature. It processes documents through a series of stages.

\`\`\`javascript
// Find orders per user with total amount
const result = await db.collection('orders').aggregate([
  { $match: { status: 'completed' } },        // Stage 1: filter
  { $group: {                                  // Stage 2: group and sum
      _id: '$userId',
      totalSpent: { $sum: '$amount' },
      orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } },             // Stage 3: sort descending
  { $limit: 10 }                              // Stage 4: top 10
]).toArray();
\`\`\`

Common pipeline stages:
| Stage | SQL Equivalent | Purpose |
|-------|---------------|---------|
| \`$match\` | WHERE | Filter documents |
| \`$group\` | GROUP BY | Aggregate by field |
| \`$sort\` | ORDER BY | Sort results |
| \`$limit\` | LIMIT | Take N documents |
| \`$project\` | SELECT | Shape output fields |
| \`$lookup\` | JOIN | Join from another collection |
| \`$unwind\` | — | Flatten arrays |
| \`$addFields\` | — | Add computed fields |

---

## Embedding vs Referencing

This is the most important MongoDB design decision.

### Embedding — Store related data inside the document
\`\`\`javascript
// User document with embedded addresses
{
  _id: ObjectId("..."),
  name: "Alice",
  addresses: [
    { type: "home", city: "New York", zip: "10001" },
    { type: "work", city: "Brooklyn", zip: "11201" }
  ]
}
\`\`\`

**Use embedding when:**
- Data is always read together (no need to join)
- Nested data belongs only to this document (no sharing)
- Array size is bounded and small (< 100 items)

### Referencing — Store IDs and look up separately
\`\`\`javascript
// Post references author by ID
{
  _id: ObjectId("..."),
  title: "MongoDB Design Patterns",
  authorId: ObjectId("64a7..."),  // reference to users collection
  content: "..."
}
\`\`\`

**Use referencing when:**
- Data is shared between documents (same user → many posts)
- Data can grow unboundedly (comments on a viral post)
- You need to query the related data independently

---

## MongoDB Indexes

\`\`\`javascript
// Single field index
await db.collection('users').createIndex({ email: 1 });

// Compound index
await db.collection('orders').createIndex({ userId: 1, status: 1 });

// Text index for search
await db.collection('posts').createIndex({ title: 'text', body: 'text' });

// Geospatial index (Uber uses this!)
await db.collection('drivers').createIndex({ location: '2dsphere' });

// TTL index: auto-delete documents after N seconds
await db.collection('sessions').createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // auto-delete after 1 hour
);
\`\`\``,
    codeExamples: [
      {
        title: 'MongoDB with Mongoose — full model example',
        code: `const mongoose = require('mongoose');

// Define schema and model
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  profile: {
    bio:    String,
    avatar: String
  },
  tags:      [String],
  createdAt: { type: Date, default: Date.now }
});

// Add an index
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

// Create
const user = await User.create({
  name: 'Alice',
  email: 'alice@example.com',
  tags: ['premium']
});

// Find
const alice = await User.findOne({ email: 'alice@example.com' });
const admins = await User.find({ role: 'admin' }).select('name email');

// Update
await User.findByIdAndUpdate(
  user._id,
  { $push: { tags: 'verified' } },  // add to tags array
  { new: true }                       // return updated document
);

// Delete
await User.findByIdAndDelete(user._id);`,
        explanation: 'Mongoose provides schema validation, model methods, and a cleaner API over the raw MongoDB driver. Used in most Node.js + MongoDB projects.',
      },
      {
        title: 'Aggregation pipeline — analytics query',
        code: `// E-commerce: daily revenue for the last 7 days
const revenue = await db.collection('orders').aggregate([
  // Stage 1: only completed orders in last 7 days
  {
    $match: {
      status: 'completed',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  },
  // Stage 2: group by date, sum revenue
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      revenue: { $sum: '$amount' },
      orders:  { $sum: 1 }
    }
  },
  // Stage 3: sort by date
  { $sort: { _id: 1 } },
  // Stage 4: rename _id to date
  { $project: { date: '$_id', revenue: 1, orders: 1, _id: 0 } }
]).toArray();

// Result:
// [
//   { date: '2024-01-14', revenue: 1250.00, orders: 8 },
//   { date: '2024-01-15', revenue: 2100.50, orders: 14 },
//   ...
// ]`,
        explanation: 'The aggregation pipeline replaces SQL GROUP BY. Each stage transforms the data. This pattern drives real analytics dashboards.',
      },
    ],
    commonMistakes: [
      'Embedding unbounded arrays (like all comments on a post) — documents can grow to 16MB limit.',
      'Not creating indexes — MongoDB with no indexes does full collection scans, just like SQL.',
      'Using MongoDB for highly relational data with many joins ($lookup is expensive compared to SQL JOIN).',
      'Storing money as a float — use NumberDecimal or store as integer cents.',
      'Not using schema validation (Mongoose or MongoDB JSON Schema) — "schema-less" does not mean "validation-less."',
    ],
    interviewQuestions: [
      {
        question: 'When would you choose MongoDB over PostgreSQL?',
        answer: 'Choose MongoDB when: your data structure varies between documents (product catalog), you need to store nested/hierarchical data naturally, you are prototyping quickly with a JavaScript/Node.js stack, or you need flexible schema evolution. Choose PostgreSQL when you need ACID across multiple collections, complex joins, strict data integrity, or analytical queries.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between embedding and referencing in MongoDB?',
        answer: 'Embedding stores related data inside the same document (like an array of addresses inside a user document) — optimal when data is always read together and belongs to one entity. Referencing stores the ID and looks up from another collection — used when data is shared between documents, can grow unboundedly, or needs to be queried independently. The rule: embed for "has-a" with small bounded data, reference for shared or unbounded data.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the MongoDB aggregation pipeline?',
        answer: 'The aggregation pipeline processes documents through a series of transformation stages. Each stage outputs documents that become the input of the next stage. Common stages: $match (filter), $group (aggregate), $sort (order), $project (reshape), $lookup (join), $limit, $skip. It is MongoDB\'s equivalent of complex SQL queries with GROUP BY, JOINs, and subqueries.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-12-1',
        title: 'Design a MongoDB schema for a blog',
        description: 'Design MongoDB documents for a blog with posts, authors, and comments. Decide what to embed and what to reference.',
        starterCode: `// Design MongoDB documents for:
// - Users (authors)
// - Posts (with title, body, tags)
// - Comments (on posts, by users)

// For each relationship, decide: embed or reference? Why?

// User document:
const user = {
  // fill in fields
};

// Post document:
const post = {
  // fill in fields
  // Should comments be embedded or referenced?
  // Should author be embedded or referenced?
};`,
        solution: `// User document — standalone, referenced by posts and comments
const user = {
  _id: ObjectId(),
  name: 'Alice',
  email: 'alice@example.com',
  bio: 'Senior developer at TechCorp',
  avatar: 'https://cdn.example.com/alice.jpg'
};

// Post document — author is REFERENCED (shared entity)
// Tags are EMBEDDED (bounded array, belongs to post)
// Comments are REFERENCED (can grow unboundedly — viral post = millions of comments)
const post = {
  _id: ObjectId(),
  authorId: user._id,       // reference — author data is shared
  title: 'MongoDB Best Practices',
  body: 'Long content here...',
  tags: ['mongodb', 'databases', 'nosql'],  // embedded — bounded, owned by post
  commentCount: 47,         // denormalized count for quick display
  createdAt: new Date()
};

// Comment document — in its own collection
const comment = {
  _id: ObjectId(),
  postId: post._id,         // reference to post
  authorId: user._id,       // reference to user
  body: 'Great article!',
  createdAt: new Date()
};

// Why NOT embed comments: a viral post could have 100k comments,
// hitting MongoDB's 16MB document size limit`,
        hints: [
          'Embed when data is small, bounded, and always read with the parent',
          'Reference when data can grow unboundedly or is shared',
          'Comments on viral posts can exceed the 16MB document limit if embedded',
        ],
      },
    ],
    keyTakeaways: [
      'MongoDB stores documents (JSON-like) in collections. No fixed schema required.',
      '_id is auto-generated for every document. Use it like a primary key.',
      'CRUD: insertOne, findOne/find, updateOne ($set, $inc), deleteOne.',
      'Query operators: $gt, $lt, $in, $and, $or for filtering.',
      'Aggregation pipeline: $match → $group → $sort → $limit for analytics.',
      'Embed for bounded, owned, always-read-together data. Reference for shared/unbounded data.',
      'Always create indexes on fields you query frequently.',
    ],
    prevLesson: 'sqlite',
    nextLesson: 'redis',
  },

  // ─── LESSON 13 ───────────────────────────────────────────────────────────────
  {
    id: 'redis',
    slug: 'redis',
    title: 'Redis',
    description: 'The in-memory data store that powers caching, sessions, rate limiting, queues, and pub/sub in every major backend system.',
    category: 'NoSQL',
    order: 13,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## What is Redis?

Redis (Remote Dictionary Server) is an **in-memory key-value data store**. It stores data in RAM instead of disk, making it 100-1000x faster than disk-based databases for reads and writes.

**Speed:** Redis can handle 1 million operations per second with sub-millisecond latency.

**Analogy:** Your database is like a library — organized, persistent, but slow to fetch. Redis is like your desk — you keep the things you use most often right in front of you for instant access.

---

## Why Redis Exists

**The problem:** Your main database (PostgreSQL, MongoDB) is fast, but repeated queries still add up. If 1000 users per second all request the same user profile, you make 1000 database calls — most returning identical data.

**The solution:** Cache the result in Redis. First request hits the database (slow). Every subsequent request hits Redis (instant). The database gets ~95% fewer queries.

---

## Redis Data Structures

Redis is not just a simple cache. It supports multiple data structures:

| Type | Use case | Commands |
|------|----------|---------|
| String | Caching, counters, session tokens | GET, SET, INCR, EXPIRE |
| Hash | User session data, object cache | HGET, HSET, HGETALL |
| List | Message queues, activity feeds | LPUSH, RPOP, LRANGE |
| Set | Unique visitors, tags | SADD, SMEMBERS, SISMEMBER |
| Sorted Set | Leaderboards, rate limiting | ZADD, ZRANGE, ZRANGEBYSCORE |
| Stream | Event logs, message queues | XADD, XREAD |

---

## Core Use Cases

### 1. Caching
\`\`\`javascript
// Without caching: every request hits database
app.get('/user/:id', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  res.json(user);
});

// With Redis caching: database hit once, Redis serves the rest
app.get('/user/:id', async (req, res) => {
  const cacheKey = \`user:\${req.params.id}\`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached)); // instant!

  // Cache miss: hit database
  const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);

  // Store in Redis for 5 minutes
  await redis.setEx(cacheKey, 300, JSON.stringify(user));

  res.json(user);
});
\`\`\`

### 2. Session Storage
\`\`\`javascript
// Store user session after login
await redis.setEx(
  \`session:\${sessionId}\`,
  86400,                          // 24 hours
  JSON.stringify({ userId: 1, role: 'admin', name: 'Alice' })
);

// Validate session on each request
const session = await redis.get(\`session:\${req.cookies.sessionId}\`);
if (!session) return res.status(401).json({ error: 'Unauthorized' });
const user = JSON.parse(session);
\`\`\`

### 3. Rate Limiting
\`\`\`javascript
// Allow 100 requests per user per hour
async function rateLimit(userId) {
  const key = \`rate:\${userId}:\${Math.floor(Date.now() / 3600000)}\`;
  const count = await redis.incr(key);        // increment counter
  await redis.expire(key, 3600);              // reset after 1 hour

  if (count > 100) {
    throw new Error('Rate limit exceeded');
  }
}
\`\`\`

### 4. Leaderboard with Sorted Sets
\`\`\`javascript
// Add score for user
await redis.zAdd('game:leaderboard', [{ score: 4200, value: 'alice' }]);
await redis.zAdd('game:leaderboard', [{ score: 3800, value: 'bob' }]);

// Get top 10 (highest scores first)
const top10 = await redis.zRangeWithScores('game:leaderboard', 0, 9, { REV: true });
// [{ value: 'alice', score: 4200 }, { value: 'bob', score: 3800 }]

// Get user's rank
const rank = await redis.zRevRank('game:leaderboard', 'alice');
// 0 (first place, 0-indexed)
\`\`\`

### 5. Pub/Sub — Real-time notifications
\`\`\`javascript
// Publisher: when an order is placed
await publisher.publish('order:placed', JSON.stringify({
  orderId: '123',
  userId: '456',
  total: 99.99
}));

// Subscriber: notification service listens
await subscriber.subscribe('order:placed', (message) => {
  const order = JSON.parse(message);
  sendEmail(order.userId, 'Your order has been placed!');
  updateDashboard(order);
});
\`\`\`

### 6. Job Queues
\`\`\`javascript
// Producer: push jobs onto a list
await redis.rPush('email:queue', JSON.stringify({
  to: 'alice@example.com',
  subject: 'Welcome!',
  body: '...'
}));

// Consumer: worker pops and processes jobs
while (true) {
  const job = await redis.blPop('email:queue', 0); // blocking pop
  const email = JSON.parse(job.element);
  await sendEmail(email);
}
\`\`\`

---

## Key Redis Commands

\`\`\`bash
SET key value           # Store a value
GET key                 # Retrieve a value
DEL key                 # Delete a key
EXISTS key              # Check if key exists (1 or 0)
EXPIRE key seconds      # Set TTL (time to live)
TTL key                 # Get remaining TTL
SETEX key seconds value # Set with TTL in one command
INCR key                # Increment integer by 1
INCRBY key amount       # Increment by amount

# Hash operations
HSET user:1 name "Alice" email "alice@example.com"
HGET user:1 name        # "Alice"
HGETALL user:1          # all fields

# List operations
RPUSH queue "job1"      # push to right
LPOP queue              # pop from left (FIFO)
LRANGE queue 0 -1       # view all items

# Sorted set operations
ZADD leaderboard 100 "alice"
ZRANGE leaderboard 0 -1 WITHSCORES  # ascending
ZREVRANGE leaderboard 0 9           # top 10 descending
\`\`\`

---

## Redis Persistence

Redis is in-memory but can persist data:
- **RDB (Redis Database):** Periodic snapshots to disk. Fast restarts. Can lose last few seconds of data.
- **AOF (Append-Only File):** Logs every write command. Slower but more durable.
- **No persistence:** Useful for pure caching where data loss on restart is acceptable.

For caching use cases, no persistence is fine — your database is the source of truth.`,
    codeExamples: [
      {
        title: 'Redis caching pattern in a real Express API',
        code: `const express = require('express');
const { createClient } = require('redis');
const { Pool } = require('pg');

const app = express();
const redis = createClient({ url: process.env.REDIS_URL });
const db = new Pool({ connectionString: process.env.DATABASE_URL });

await redis.connect();

// GET /products — cached for 10 minutes
app.get('/products', async (req, res) => {
  const cacheKey = 'products:all';

  // 1. Check Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    res.set('X-Cache', 'HIT');
    return res.json(JSON.parse(cached));
  }

  // 2. Cache miss: query database
  const { rows } = await db.query('SELECT * FROM products ORDER BY name');

  // 3. Cache for 10 minutes (600 seconds)
  await redis.setEx(cacheKey, 600, JSON.stringify(rows));

  res.set('X-Cache', 'MISS');
  res.json(rows);
});

// When a product is updated, invalidate the cache
app.put('/products/:id', async (req, res) => {
  await db.query('UPDATE products SET name = $1 WHERE id = $2',
    [req.body.name, req.params.id]);

  // Invalidate cache so next request gets fresh data
  await redis.del('products:all');

  res.json({ success: true });
});`,
        explanation: 'This is the cache-aside pattern — check cache first, fall back to DB, populate cache on miss. Cache invalidation on update prevents stale data.',
      },
    ],
    commonMistakes: [
      'Caching without TTL (expiry) — cached data grows forever and becomes stale. Always set EXPIRE.',
      'Storing entire database dumps in Redis — Redis is for frequently accessed hot data, not a full database backup.',
      'Not invalidating cache on data updates — users see stale data after an update.',
      'Using Redis as your primary database — Redis data can be lost on restart (without persistence). It is a cache, not a source of truth.',
      'Not handling Redis connection failures — your app should gracefully fall back to the database if Redis is unavailable.',
    ],
    interviewQuestions: [
      {
        question: 'What is Redis and what are its main use cases?',
        answer: 'Redis is an in-memory key-value data store that operates at sub-millisecond latency. Main use cases: (1) Caching — store database query results to reduce DB load. (2) Session storage — store logged-in user data with auto-expiry. (3) Rate limiting — count requests per user per time window. (4) Leaderboards — sorted sets for ranked scores. (5) Pub/Sub — real-time event broadcasting. (6) Job queues — list-based task queues for background workers.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is cache invalidation and why is it hard?',
        answer: 'Cache invalidation is the process of removing or updating cached data when the underlying data changes. It is hard because: (1) You must remember to invalidate every cache key that depends on updated data. (2) In distributed systems, multiple cache nodes may hold different versions. (3) Cache stampedes can occur when many requests hit an expired key simultaneously. Common strategies: time-based expiry (TTL), explicit deletion on update, and event-driven invalidation.',
        difficulty: 'intermediate',
      },
      {
        question: 'How would you implement rate limiting with Redis?',
        answer: 'Use INCR and EXPIRE. For each user, maintain a counter keyed by user ID and time window (e.g., rate:user:123:2024011514 for hour 14). On each request: INCR the key, set EXPIRE if this is the first increment (count === 1), check if count exceeds the limit. This is atomic-safe with INCR and works across multiple server instances since Redis is centralized.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-13-1',
        title: 'Implement a session management system with Redis',
        description: 'Write functions to create a session on login, validate a session on each request, and delete a session on logout.',
        starterCode: `const { createClient } = require('redis');
const { v4: uuidv4 } = require('uuid');

const redis = createClient();
await redis.connect();

const SESSION_TTL = 86400; // 24 hours

// Task 1: Create a session when user logs in
// Should: generate a session ID, store user data in Redis, return session ID
async function createSession(userId, userData) {
  // your code here
}

// Task 2: Validate a session on each request
// Should: get session data from Redis, return null if expired/missing
async function getSession(sessionId) {
  // your code here
}

// Task 3: Delete session on logout
async function deleteSession(sessionId) {
  // your code here
}`,
        solution: `const SESSION_TTL = 86400; // 24 hours

async function createSession(userId, userData) {
  const sessionId = uuidv4();               // generate unique session ID
  const sessionKey = \`session:\${sessionId}\`;

  await redis.setEx(                        // store with auto-expiry
    sessionKey,
    SESSION_TTL,
    JSON.stringify({ userId, ...userData, createdAt: Date.now() })
  );

  return sessionId;                         // return to client as cookie
}

async function getSession(sessionId) {
  const sessionKey = \`session:\${sessionId}\`;
  const data = await redis.get(sessionKey);

  if (!data) return null;                   // expired or never existed

  // Optional: refresh TTL on activity
  await redis.expire(sessionKey, SESSION_TTL);

  return JSON.parse(data);
}

async function deleteSession(sessionId) {
  const sessionKey = \`session:\${sessionId}\`;
  await redis.del(sessionKey);              // immediately invalidate
}`,
        hints: [
          'Use uuid to generate a unique session ID',
          'setEx stores with automatic expiry — no need for a separate EXPIRE call',
          'Refreshing TTL on each request keeps active sessions alive',
        ],
      },
    ],
    keyTakeaways: [
      'Redis is an in-memory key-value store — microsecond reads, 1M+ operations per second.',
      'Main uses: caching, sessions, rate limiting, leaderboards, pub/sub, job queues.',
      'Always set TTL (expiry) on cached values to prevent stale data.',
      'Invalidate cache when underlying data changes — delete the key or update it.',
      'Redis is a cache/store, not a primary database. Your SQL/MongoDB is the source of truth.',
      'Sorted Sets power leaderboards. Lists power queues. Strings power caching.',
    ],
    prevLesson: 'mongodb',
    nextLesson: 'firebase',
  },

  // ─── LESSON 14 ───────────────────────────────────────────────────────────────
  {
    id: 'firebase',
    slug: 'firebase',
    title: 'Firebase',
    description: 'Google\'s app platform — Firestore, Realtime Database, Authentication, and when Firebase is the right choice for your project.',
    category: 'NoSQL',
    order: 14,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## What is Firebase?

Firebase is Google's **Backend-as-a-Service (BaaS)** platform. Instead of building your own backend, Firebase gives you databases, authentication, file storage, hosting, and serverless functions — all pre-built and managed by Google.

**Why Firebase exists:** Many apps need the same backend features. Firebase packages them so you can build a production app without writing backend code.

---

## Firebase Products

| Product | What it does |
|---------|-------------|
| **Firestore** | NoSQL document database with real-time sync |
| **Realtime Database** | JSON tree database with real-time sync (older) |
| **Authentication** | User login with email, Google, GitHub, phone |
| **Storage** | File/image storage (like S3) |
| **Hosting** | Static site and web app hosting |
| **Cloud Functions** | Serverless backend functions |
| **FCM** | Push notifications |

---

## Firestore vs Realtime Database

Firebase has two databases. For new projects, use **Firestore**.

| | Firestore | Realtime Database |
|--|-----------|-------------------|
| Data model | Documents + Collections | JSON tree |
| Querying | Rich queries, compound filters | Limited |
| Pricing | Per document read/write | Per bandwidth |
| Offline support | Yes | Yes |
| Scale | Better | Good for small data |
| Recommendation | **Use this** | Legacy projects only |

---

## Firestore Data Model

Firestore organizes data into **documents** and **collections**:
- **Collection:** Group of documents (like a table)
- **Document:** JSON object (like a row), identified by an ID
- **Subcollection:** A collection inside a document

\`\`\`
users/                          ← collection
  user123/                      ← document (user)
    name: "Alice"
    email: "alice@..."
    posts/                      ← subcollection
      post456/                  ← document (post)
        title: "Hello World"
\`\`\`

---

## Firestore CRUD

\`\`\`javascript
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc,
  addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, limit, onSnapshot
} from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// CREATE — auto-generated ID
const docRef = await addDoc(collection(db, 'users'), {
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: serverTimestamp()
});
console.log('Created user:', docRef.id);

// CREATE — custom ID
await setDoc(doc(db, 'users', 'alice123'), {
  name: 'Alice',
  email: 'alice@example.com'
});

// READ — single document
const userDoc = await getDoc(doc(db, 'users', 'alice123'));
if (userDoc.exists()) {
  console.log(userDoc.data()); // { name: 'Alice', email: '...' }
}

// READ — query collection
const q = query(
  collection(db, 'users'),
  where('age', '>=', 18),
  orderBy('name'),
  limit(10)
);
const snapshot = await getDocs(q);
snapshot.forEach(doc => console.log(doc.id, doc.data()));

// UPDATE — partial update
await updateDoc(doc(db, 'users', 'alice123'), {
  age: 29,
  updatedAt: serverTimestamp()
});

// DELETE
await deleteDoc(doc(db, 'users', 'alice123'));
\`\`\`

---

## Real-time Listeners

Firestore's killer feature — get live updates when data changes:

\`\`\`javascript
// Listen to a single document
const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
  if (doc.exists()) {
    setUser(doc.data()); // React state updates live!
  }
});

// Listen to a collection query
const unsubscribe = onSnapshot(
  query(collection(db, 'messages'), orderBy('createdAt')),
  (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMessages(messages); // auto-updates when new message arrives
  }
);

// Clean up listener when component unmounts
return () => unsubscribe();
\`\`\`

This is how chat apps, live collaboration, and real-time dashboards work in Firebase.

---

## Firebase Authentication

\`\`\`javascript
import { getAuth, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, signInWithPopup,
         GoogleAuthProvider, signOut } from 'firebase/auth';

const auth = getAuth();

// Email/password signup
await createUserWithEmailAndPassword(auth, email, password);

// Email/password login
await signInWithEmailAndPassword(auth, email, password);

// Google OAuth login
const provider = new GoogleAuthProvider();
await signInWithPopup(auth, provider);

// Logout
await signOut(auth);

// Listen to auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Logged in:', user.uid, user.email);
  } else {
    console.log('Logged out');
  }
});
\`\`\`

---

## Firestore Security Rules

Security rules control who can read/write documents — enforced on Google's servers:

\`\`\`javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
    // Anyone can read posts, only author can write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == resource.data.authorId;
    }
  }
}
\`\`\`

---

## When to Use Firebase

**Great for Firebase:**
- MVPs and prototypes (launch in hours)
- Real-time apps: chat, live collaboration, notifications
- Mobile apps with offline support
- Apps where you don't want to manage backend infrastructure
- Small teams or solo developers

**When to move away from Firebase:**
- Complex relational queries (Firebase can't do SQL-style JOINs)
- Cost at scale (Firestore pricing can be high for read-heavy apps)
- Need to run complex backend logic
- Data portability concerns (vendor lock-in)
- Full control over infrastructure`,
    codeExamples: [
      {
        title: 'Real-time chat app with Firestore',
        code: `// Send a message
async function sendMessage(roomId, userId, text) {
  await addDoc(collection(db, 'rooms', roomId, 'messages'), {
    userId,
    text,
    createdAt: serverTimestamp()
  });
}

// Listen for messages in real-time (React component)
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'rooms', roomId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    // This fires immediately with current data,
    // then fires again whenever a new message is added
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, [roomId]);

  return (
    <div>
      {messages.map(msg => <p key={msg.id}>{msg.text}</p>)}
    </div>
  );
}`,
        explanation: 'onSnapshot creates a real-time listener. New messages appear instantly for all connected users without any polling. This is Firebase\'s most compelling feature.',
      },
    ],
    commonMistakes: [
      'Not setting security rules — by default Firestore is completely open or completely closed. Always write security rules.',
      'Embedding too much data — Firestore documents are limited to 1MB. Don\'t embed unbounded arrays.',
      'Querying without indexes — Firestore requires composite indexes for multi-field queries. Create them in Firebase Console.',
      'Not cleaning up onSnapshot listeners — memory leaks in React if you don\'t call the unsubscribe function on unmount.',
      'Using Firebase for complex analytical queries — Firestore is not designed for aggregations across millions of documents.',
    ],
    interviewQuestions: [
      {
        question: 'What is Firebase Firestore and how is it different from a SQL database?',
        answer: 'Firestore is a NoSQL document database managed by Google. It stores documents in collections (like MongoDB) and syncs changes to clients in real-time. Unlike SQL: no schema migrations needed, real-time listeners update UI automatically, but no complex JOINs, limited aggregations, and pricing is per document read/write. Best for apps needing real-time sync, rapid prototyping, or teams without backend infrastructure.',
        difficulty: 'beginner',
      },
      {
        question: 'How do Firestore security rules work?',
        answer: 'Firestore security rules are declarative expressions evaluated on Google\'s servers before any database operation. They check request.auth (who is making the request), request.resource (incoming data), and resource (existing data) to allow or deny reads and writes. Rules run server-side so they cannot be bypassed by client code. They are the primary access control mechanism for client-side Firebase apps.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-14-1',
        title: 'Design a Firestore schema for a todo app',
        description: 'Design the Firestore collections and documents for a multi-user todo application.',
        starterCode: `// Design a Firestore schema for:
// - Multiple users
// - Each user has their own todo lists
// - Each list has multiple todos
// - Todos have title, completed status, due date

// Collection structure:
// users/
//   {userId}/
//     lists/
//       {listId}/
//         ...

// Write the structure and explain:
// 1. What collections exist
// 2. What fields each document has
// 3. What security rule ensures users can only see their own data`,
        solution: `// Collection structure:
// users/{userId} — user profile
// users/{userId}/lists/{listId} — todo lists
// users/{userId}/lists/{listId}/todos/{todoId} — individual todos

// Document shapes:
const userDoc = {
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: serverTimestamp()
};

const listDoc = {
  title: 'Work Tasks',
  color: '#3B82F6',
  createdAt: serverTimestamp()
};

const todoDoc = {
  title: 'Write API documentation',
  completed: false,
  dueDate: Timestamp.fromDate(new Date('2024-01-20')),
  priority: 'high',
  createdAt: serverTimestamp()
};

// Security rules:
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{userId}/{document=**} {
//       allow read, write: if request.auth.uid == userId;
//     }
//   }
// }
// The {document=**} wildcard covers all subcollections`,
        hints: [
          'Use subcollections to nest lists under users',
          'Todos as subcollections of lists ensures security rules cascade',
          'The {document=**} wildcard in security rules covers nested paths',
        ],
      },
    ],
    keyTakeaways: [
      'Firebase is a BaaS — database, auth, storage, hosting all in one.',
      'Firestore is a document database with real-time sync. Use it, not Realtime Database.',
      'onSnapshot creates live listeners — UI updates automatically when data changes.',
      'Security rules run server-side and cannot be bypassed by clients.',
      'Firebase is ideal for MVPs, real-time apps, and teams without backend infrastructure.',
      'For complex queries, scale, or cost control, move to PostgreSQL + custom backend.',
    ],
    prevLesson: 'redis',
    nextLesson: 'supabase',
  },

  // ─── LESSON 15 ───────────────────────────────────────────────────────────────
  {
    id: 'supabase',
    slug: 'supabase',
    title: 'Supabase',
    description: 'The open-source Firebase alternative built on PostgreSQL — auth, storage, real-time, edge functions, and why startups love it.',
    category: 'Databases',
    order: 15,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## What is Supabase?

Supabase is an **open-source Firebase alternative** built on top of PostgreSQL. It gives you:
- **PostgreSQL** database (fully ACID, full SQL power)
- **Authentication** (email, OAuth, magic links)
- **Real-time subscriptions** (via PostgreSQL's LISTEN/NOTIFY)
- **Storage** (file uploads, image transformations)
- **Edge Functions** (serverless, Deno-based)
- **Auto-generated REST and GraphQL APIs**

**The big difference from Firebase:** Supabase is backed by real PostgreSQL. You write actual SQL. You get foreign keys, joins, transactions — and you can eject and host your own PostgreSQL if needed. No vendor lock-in.

---

## Why Startups Use Supabase

| Concern | Supabase advantage |
|---------|-------------------|
| **Speed to launch** | Auth + DB + storage out of the box |
| **SQL power** | Full PostgreSQL — joins, transactions, indexes |
| **No vendor lock-in** | It's just PostgreSQL — export and self-host anytime |
| **Cost** | Generous free tier (500MB database, 1GB storage) |
| **Real-time** | Built-in, no extra service needed |
| **Open source** | Self-host the entire stack if needed |

---

## Setting Up Supabase

\`\`\`bash
npm install @supabase/supabase-js

# Get your project URL and anon key from supabase.com dashboard
\`\`\`

\`\`\`javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
\`\`\`

---

## Database Queries (PostgreSQL via Supabase Client)

\`\`\`javascript
// SELECT — get all users
const { data: users, error } = await supabase
  .from('users')
  .select('*');

// SELECT with filter, order, limit
const { data: posts } = await supabase
  .from('posts')
  .select('id, title, created_at, users(name)')  // join!
  .eq('published', true)
  .order('created_at', { ascending: false })
  .limit(10);

// INSERT
const { data, error } = await supabase
  .from('users')
  .insert({ name: 'Alice', email: 'alice@example.com' })
  .select();  // return the inserted row

// UPDATE
await supabase
  .from('users')
  .update({ name: 'Alice Smith' })
  .eq('id', userId);

// DELETE
await supabase
  .from('users')
  .delete()
  .eq('id', userId);

// UPSERT
await supabase
  .from('users')
  .upsert({ id: 1, name: 'Alice', email: 'alice@example.com' });
\`\`\`

---

## Authentication

\`\`\`javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'alice@example.com',
  password: 'securepassword'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'alice@example.com',
  password: 'securepassword'
});

// OAuth (Google, GitHub, etc.)
await supabase.auth.signInWithOAuth({ provider: 'google' });

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') setUser(session.user);
  if (event === 'SIGNED_OUT') setUser(null);
});
\`\`\`

---

## Row Level Security (RLS)

RLS is Supabase's security model — PostgreSQL policies that restrict which rows each user can access:

\`\`\`sql
-- Enable RLS on the table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own posts
CREATE POLICY "Users see own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert posts with their own user_id
CREATE POLICY "Users insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own posts
CREATE POLICY "Users update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);
\`\`\`

With RLS enabled, even if a client sends a query for all posts, they only get back their own posts — enforced at the database level.

---

## Real-time Subscriptions

\`\`\`javascript
// Subscribe to new messages in a chat room
const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: \`room_id=eq.\${roomId}\`
  }, (payload) => {
    setMessages(prev => [...prev, payload.new]);
  })
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
\`\`\`

---

## Storage

\`\`\`javascript
// Upload a file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(\`\${userId}/avatar.jpg\`, file, {
    contentType: 'image/jpeg',
    upsert: true
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(\`\${userId}/avatar.jpg\`);

// Delete file
await supabase.storage
  .from('avatars')
  .remove([\`\${userId}/avatar.jpg\`]);
\`\`\`

---

## Supabase vs Firebase Comparison

| Feature | Supabase | Firebase |
|---------|----------|----------|
| Database | PostgreSQL (relational) | Firestore (NoSQL) |
| Queries | Full SQL, JOINs | Limited, no JOINs |
| Real-time | PostgreSQL LISTEN/NOTIFY | WebSocket streams |
| Open source | Yes | No |
| Self-hostable | Yes | No |
| Vendor lock-in | Low | High |
| Complex queries | Excellent | Poor |
| Offline support | Limited | Excellent |
| Learning curve | Higher (SQL) | Lower (JSON) |`,
    codeExamples: [
      {
        title: 'Full Supabase setup for a Next.js app',
        code: `// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// app/api/posts/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  const { data: posts, error, count } = await supabase
    .from('posts')
    .select('id, title, created_at, users!inner(name, avatar)', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * 10, page * 10 - 1);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ posts, total: count });
}

// SQL schema (run in Supabase SQL Editor):
// CREATE TABLE posts (
//   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
//   title      TEXT NOT NULL,
//   body       TEXT,
//   published  BOOLEAN DEFAULT false,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE posts ENABLE ROW LEVEL SECURITY;`,
        explanation: 'Supabase with Next.js is the most popular full-stack startup stack in 2024. Full PostgreSQL power with Firebase-like ease of use.',
      },
    ],
    commonMistakes: [
      'Forgetting to enable Row Level Security — without RLS, all authenticated users can read all data.',
      'Using the service_role key in client-side code — it bypasses RLS. Only use anon key in the browser.',
      'Not handling errors — every Supabase operation returns { data, error }. Always check error.',
      'Over-fetching with select("*") — specify only the columns you need for performance.',
    ],
    interviewQuestions: [
      {
        question: 'What is Supabase and how does it compare to Firebase?',
        answer: 'Supabase is an open-source BaaS built on PostgreSQL. It provides database, auth, storage, real-time, and edge functions — similar to Firebase. Key differences: Supabase uses PostgreSQL so you get full SQL, JOINs, and transactions (Firebase Firestore is NoSQL with limited queries). Supabase is self-hostable with no vendor lock-in. Firebase has better offline support and simpler onboarding for pure NoSQL use cases.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is Row Level Security in Supabase?',
        answer: 'Row Level Security (RLS) is a PostgreSQL feature that Supabase exposes via policies. When enabled on a table, every query has an additional automatic WHERE clause based on the policy. For example, a policy "user_id = auth.uid()" ensures each user only sees their own rows — even if they write a query for all rows. It is enforced at the database level, not in application code, so it cannot be bypassed.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-15-1',
        title: 'Build a Supabase schema with RLS for a note-taking app',
        description: 'Create the tables, enable RLS, and write policies for a note-taking app where users can only access their own notes.',
        starterCode: `-- Create the notes table
-- Enable RLS
-- Write policies: users can SELECT, INSERT, UPDATE, DELETE only their own notes

-- Table structure:
-- notes: id (uuid), user_id (references auth.users), title, body, created_at`,
        solution: `-- Create table
CREATE TABLE notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (without this, policies don't work)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own notes
CREATE POLICY "Users read own notes"
ON notes FOR SELECT
USING (auth.uid() = user_id);

-- Policy: users can insert their own notes
CREATE POLICY "Users insert own notes"
ON notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: users can update their own notes
CREATE POLICY "Users update own notes"
ON notes FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: users can delete their own notes
CREATE POLICY "Users delete own notes"
ON notes FOR DELETE
USING (auth.uid() = user_id);

-- Index for performance (all queries filter by user_id)
CREATE INDEX idx_notes_user_id ON notes(user_id);`,
        hints: [
          'auth.uid() returns the currently authenticated user\'s ID',
          'Each CRUD operation needs its own policy',
          'USING is for SELECT/UPDATE/DELETE; WITH CHECK is for INSERT/UPDATE',
        ],
      },
    ],
    keyTakeaways: [
      'Supabase is open-source Firebase alternative built on PostgreSQL.',
      'You get full SQL power: JOINs, transactions, indexes, constraints.',
      'Row Level Security (RLS) enforces data access at the database level — cannot be bypassed.',
      'Never use service_role key in client-side code — it bypasses all security.',
      'Supabase is the top choice for TypeScript/Next.js startups in 2024.',
      'Real-time via PostgreSQL LISTEN/NOTIFY — subscribe to any table change.',
    ],
    prevLesson: 'firebase',
    nextLesson: 'orms-database-tools',
  },

  // ─── LESSON 16 ───────────────────────────────────────────────────────────────
  {
    id: 'orms-database-tools',
    slug: 'orms-database-tools',
    title: 'ORMs & Database Tools',
    description: 'Prisma, Drizzle, Sequelize, TypeORM, Mongoose — what ORMs are, why they exist, ORM vs raw SQL, and which one to choose.',
    category: 'Tools',
    order: 16,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## What is an ORM?

ORM stands for **Object-Relational Mapper**. It is a library that lets you interact with a database using your programming language (JavaScript, TypeScript) instead of writing raw SQL.

**Without ORM:**
\`\`\`sql
SELECT users.*, orders.total FROM users
JOIN orders ON users.id = orders.user_id
WHERE users.id = $1;
\`\`\`

**With ORM (Prisma):**
\`\`\`javascript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { orders: true }
});
\`\`\`

Same result, no SQL written.

---

## Why ORMs Exist

**Problems ORMs solve:**
1. **Type safety** — TypeScript ORMs know your schema and give autocomplete and type errors
2. **Schema migration** — track and apply database changes as versioned files
3. **Database abstraction** — switch from PostgreSQL to MySQL with minimal changes
4. **Prevents basic SQL injection** — parameterization is built in
5. **Reduces boilerplate** — CRUD operations in 1 line instead of 5

**Problems ORMs create:**
1. **N+1 query problem** — if you forget to use JOINs/includes, you make 1 query per row
2. **Complex queries** — some queries are easier to write in raw SQL
3. **Performance overhead** — ORM layer adds latency and can generate inefficient queries
4. **Learning curve** — you must learn the ORM API on top of SQL concepts

---

## The N+1 Problem

This is the most important ORM pitfall to know for interviews:

\`\`\`javascript
// N+1 Problem: 1 query to get users + 1 query per user to get orders
const users = await User.findAll(); // 1 query
for (const user of users) {
  user.orders = await Order.findAll({ where: { userId: user.id } }); // N queries!
}
// 101 queries for 100 users. Terrible.

// Solution: use include/join to load in one query
const users = await User.findAll({
  include: [{ model: Order }]
});
// 1 query (or 2 optimized queries).
\`\`\`

---

## Prisma — The Modern Choice (TypeScript)

Prisma is the most popular ORM for Node.js/TypeScript in 2024. It uses a schema file to define your models and generates a fully-typed client.

\`\`\`prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
\`\`\`

\`\`\`bash
npx prisma migrate dev --name init   # create and apply migration
npx prisma generate                  # regenerate the client
npx prisma studio                    # visual database browser (amazing!)
\`\`\`

\`\`\`typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: { name: 'Alice', email: 'alice@example.com' }
});

// Read with relation
const userWithPosts = await prisma.user.findUnique({
  where: { email: 'alice@example.com' },
  include: { posts: true }
});

// Update
await prisma.post.update({
  where: { id: 1 },
  data: { published: true }
});

// Delete
await prisma.user.delete({ where: { id: 1 } });

// Complex query
const recentPosts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  include: { author: { select: { name: true } } }
});
\`\`\`

---

## Drizzle ORM — Lightweight, Type-Safe

Drizzle is SQL-first — you write schema in TypeScript, not a custom DSL. Growing fast in 2024.

\`\`\`typescript
import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';

// Schema definition
const users = pgTable('users', {
  id:        serial('id').primaryKey(),
  name:      text('name').notNull(),
  email:     text('email').unique().notNull(),
  isActive:  boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

const db = drizzle(pool);

// Queries look like SQL
const allUsers = await db.select().from(users);
const alice = await db.select().from(users).where(eq(users.email, 'alice@example.com'));
await db.insert(users).values({ name: 'Alice', email: 'alice@example.com' });
await db.update(users).set({ name: 'Alice Smith' }).where(eq(users.id, 1));
await db.delete(users).where(eq(users.id, 1));
\`\`\`

---

## Mongoose — For MongoDB

Mongoose is the most popular ODM (Object-Document Mapper) for MongoDB.

\`\`\`javascript
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:      [String],
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Create
await Post.create({ title: 'Hello', body: 'Content', author: userId });

// Find with population (reference → actual data)
const post = await Post.findById(id).populate('author', 'name email');

// Update
await Post.findByIdAndUpdate(id, { published: true }, { new: true });

// Delete
await Post.findByIdAndDelete(id);
\`\`\`

---

## ORM Comparison

| ORM | Database | Language | Best For |
|-----|----------|----------|---------|
| **Prisma** | PostgreSQL, MySQL, SQLite, MongoDB | TypeScript | Modern TS projects, best DX |
| **Drizzle** | PostgreSQL, MySQL, SQLite | TypeScript | SQL-first, lightweight |
| **Sequelize** | PostgreSQL, MySQL, SQLite | JavaScript | Legacy Node.js projects |
| **TypeORM** | PostgreSQL, MySQL, SQLite | TypeScript | TypeScript with decorators |
| **Mongoose** | MongoDB | JavaScript/TypeScript | MongoDB + Node.js |

---

## ORM vs Raw SQL — When to Use Each

| Scenario | Use ORM | Use Raw SQL |
|----------|---------|-------------|
| CRUD operations | ✓ ORM | |
| Complex reports / analytics | | ✓ Raw SQL |
| Database migrations | ✓ ORM | |
| Performance-critical queries | | ✓ Raw SQL |
| Rapid prototyping | ✓ ORM | |
| Full-text search | | ✓ Raw SQL |
| Simple joins | ✓ ORM | |
| Window functions, CTEs | | ✓ Raw SQL |

**Best practice:** Use an ORM for 80% of queries. Drop to raw SQL for the 20% that are complex or performance-sensitive. Prisma supports raw SQL with \`prisma.$queryRaw\`.`,
    codeExamples: [
      {
        title: 'Prisma migrations workflow',
        code: `# 1. Define your schema in prisma/schema.prisma

# 2. Create your first migration (generates SQL + applies it)
npx prisma migrate dev --name init
# Creates: prisma/migrations/20240115_init/migration.sql

# 3. Add a field to the model
# model User {
#   ...
#   bio String?  ← added
# }

# 4. Create migration for the change
npx prisma migrate dev --name add_bio_to_users
# Creates new migration file, applies ALTER TABLE

# 5. In production: apply migrations without creating new ones
npx prisma migrate deploy

# 6. Open Prisma Studio — visual DB browser
npx prisma studio
# Opens http://localhost:5555 — browse and edit your data`,
        explanation: 'Prisma migrations are tracked in version control. Each change creates a new migration file with the exact SQL. This is how teams safely evolve schemas.',
      },
      {
        title: 'Raw SQL with Prisma — when ORM is not enough',
        code: `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Complex query: top 5 users by revenue with growth rate
// This is hard to express in ORM, easy in raw SQL
const topUsers = await prisma.$queryRaw\`
  WITH monthly AS (
    SELECT
      user_id,
      DATE_TRUNC('month', created_at) AS month,
      SUM(total) AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id, month
  )
  SELECT
    u.name,
    u.email,
    SUM(m.revenue) AS total_revenue,
    COUNT(DISTINCT m.month) AS active_months
  FROM monthly m
  JOIN users u ON u.id = m.user_id
  GROUP BY u.id, u.name, u.email
  ORDER BY total_revenue DESC
  LIMIT 5
\`;

// Prisma.$queryRaw is safe from SQL injection when using template literals`,
        explanation: 'Prisma.$queryRaw lets you write raw SQL when the ORM cannot express a complex query. Template literals are automatically parameterized.',
      },
    ],
    commonMistakes: [
      'Creating N+1 queries by forgetting to include relations — always use include/populate for related data.',
      'Using an ORM and never learning SQL — ORMs generate SQL, and you need to understand it to debug slow queries.',
      'Over-using raw SQL when ORM would be cleaner and safer.',
      'Not using migrations — manually editing tables in production causes schema drift between environments.',
      'Running PrismaClient in every function invocation in serverless — use a singleton pattern or connection pool.',
    ],
    interviewQuestions: [
      {
        question: 'What is an ORM and what are its advantages and disadvantages?',
        answer: 'An ORM (Object-Relational Mapper) maps database tables to objects in code, letting you write queries in your language instead of SQL. Advantages: type safety, auto-migrations, less boilerplate, built-in SQL injection protection. Disadvantages: N+1 query problem if misused, can generate inefficient SQL, learning curve, and can obscure what is happening in the database. Best practice: use ORM for CRUD, raw SQL for complex analytics.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the N+1 query problem and how do you solve it?',
        answer: 'The N+1 problem occurs when you fetch N parent records, then execute 1 additional query per parent to fetch related data — resulting in N+1 total queries. Example: fetching 100 users then querying orders for each user = 101 queries. Solution: use eager loading (include/populate) to fetch all data in 1-2 queries using a JOIN. In Prisma: include: { orders: true }. In Mongoose: .populate("orders").',
        difficulty: 'intermediate',
      },
      {
        question: 'Why would you choose Prisma over Sequelize?',
        answer: 'Prisma has a superior developer experience: auto-generated TypeScript types for your schema (full type safety), a cleaner API, built-in Prisma Studio (visual browser), better migration tooling, and more intuitive relation handling. Sequelize is older, has more configuration, weaker TypeScript support, and a more complex API. For new TypeScript projects, Prisma is the clear choice. Sequelize exists in legacy Node.js codebases.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-16-1',
        title: 'Write Prisma schema for an e-commerce app',
        description: 'Write a complete Prisma schema for an e-commerce app with users, products, orders, and order items.',
        starterCode: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Write models for:
// - User (id, name, email, createdAt)
// - Product (id, name, price, stock, createdAt)
// - Order (id, user, status, total, createdAt)
// - OrderItem (id, order, product, quantity, unitPrice)

// Then write Prisma Client queries for:
// - Create a new user
// - Find all orders for a user, including order items and product names`,
        solution: `// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id         Int         @id @default(autoincrement())
  name       String
  price      Decimal     @db.Decimal(10, 2)
  stock      Int         @default(0)
  orderItems OrderItem[]
  createdAt  DateTime    @default(now())
}

model Order {
  id         Int         @id @default(autoincrement())
  userId     Int
  user       User        @relation(fields: [userId], references: [id])
  status     String      @default("pending")
  total      Decimal     @db.Decimal(10, 2)
  items      OrderItem[]
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id         Int     @id @default(autoincrement())
  orderId    Int
  order      Order   @relation(fields: [orderId], references: [id])
  productId  Int
  product    Product @relation(fields: [productId], references: [id])
  quantity   Int
  unitPrice  Decimal @db.Decimal(10, 2)
}

// Prisma Client queries:

// Create a new user
const user = await prisma.user.create({
  data: { name: 'Alice', email: 'alice@example.com' }
});

// Find all orders for a user with items and product names
const orders = await prisma.order.findMany({
  where: { userId: user.id },
  include: {
    items: {
      include: {
        product: { select: { name: true, price: true } }
      }
    }
  },
  orderBy: { createdAt: 'desc' }
});`,
        hints: [
          'Use @relation to define foreign keys in Prisma',
          'Use include to load related models without N+1 queries',
          '@db.Decimal(10,2) maps to PostgreSQL DECIMAL for exact money values',
        ],
      },
    ],
    keyTakeaways: [
      'ORM maps tables to objects in code — no raw SQL needed for common operations.',
      'N+1 problem: never loop and query. Use include/populate to load relations.',
      'Prisma is the best ORM for TypeScript/Node.js in 2024 — best DX, type safety, migrations.',
      'Drizzle is SQL-first and lighter weight. Mongoose is for MongoDB.',
      'Use ORM for 80% of queries, raw SQL for complex analytics and performance-critical paths.',
      'Prisma migrations track schema changes in version control — essential for team projects.',
    ],
    prevLesson: 'supabase',
    nextLesson: 'database-selection',
  },

  // ─── LESSON 17 ───────────────────────────────────────────────────────────────
  {
    id: 'database-selection',
    slug: 'database-selection',
    title: 'Database Selection Guide',
    description: 'When to choose PostgreSQL, MySQL, MongoDB, Redis, Firebase, Supabase, or SQLite — with project-based examples and comparison tables.',
    category: 'Design',
    order: 17,
    difficulty: 'intermediate',
    estimatedTime: 25,
    content: `## The Most Important Skill: Choosing the Right Database

The #1 database mistake developers make is choosing a database based on popularity or familiarity instead of fit. The wrong database can limit your app, cost you performance, and make future migrations painful.

**Decision framework:**
1. What is the shape of your data?
2. What are your access patterns?
3. How much consistency do you need?
4. What is your scale requirement?
5. What is your team's expertise?

---

## Quick Reference: When to Use What

| Database | Best For | Avoid When |
|----------|----------|------------|
| **PostgreSQL** | Most web apps, complex queries, financial systems | You need massive horizontal write scaling |
| **MySQL** | PHP/WordPress ecosystem, simple CRUD | You need JSONB, arrays, or complex queries |
| **MongoDB** | Flexible schema, document data, content systems | Highly relational data, complex joins |
| **Redis** | Caching, sessions, rate limiting, leaderboards | Primary storage, complex data structures |
| **Firebase** | MVPs, mobile apps, real-time features, no backend | Complex queries, cost-sensitivity at scale |
| **Supabase** | Startups wanting PostgreSQL + BaaS features | Need pure NoSQL or offline-first mobile |
| **SQLite** | Mobile apps, prototypes, embedded systems | High-concurrency web backends |

---

## Decision Flowchart

\`\`\`
Is your data relational? (users → orders → products)
  └─ YES → Is this a mobile/embedded app?
     │       └─ YES → SQLite
     │       └─ NO  → Is this a startup wanting BaaS?
     │                └─ YES → Supabase (PostgreSQL + extras)
     │                └─ NO  → PostgreSQL (default for new projects)
     │                         MySQL (only for PHP/WordPress ecosystem)
  └─ NO  → Is data shape flexible/varying?
            └─ YES → MongoDB
            └─ NO  → Is data key-value with sub-ms speed needed?
                      └─ YES → Redis
                      └─ NO  → Is real-time sync the main need?
                                └─ YES → Firebase
                                └─ NO  → Reconsider PostgreSQL
\`\`\`

---

## By Project Type

### Personal Blog / Content Site
- **Database:** PostgreSQL or Supabase
- **Why:** Posts, authors, tags, categories — all relational. Need full-text search.
- **ORM:** Prisma

### Chat Application
- **Database:** PostgreSQL or MongoDB + Redis
- **Why:** PostgreSQL/MongoDB for message storage. Redis for pub/sub notifications.
- **Real-time:** Supabase subscriptions or Socket.io + Redis pub/sub

### E-Commerce Platform
- **Primary:** PostgreSQL (orders, inventory, transactions — ACID critical)
- **Cache:** Redis (product catalog, cart, sessions)
- **Search:** Elasticsearch or PostgreSQL full-text search
- **ORM:** Prisma or Drizzle

### Social Media Platform
- **Core data:** PostgreSQL (users, posts, follows)
- **Feed/timeline:** Redis (sorted sets for chronological feeds)
- **Images:** Object storage (S3, Cloudflare R2)
- **Analytics:** BigQuery or a data warehouse

### Mobile App (iOS/Android)
- **Local:** SQLite (via SQLite.swift, Room, or Expo SQLite)
- **Backend:** Supabase or Firebase
- **Why:** SQLite for offline support. Firebase/Supabase for sync.

### SaaS Application
- **Database:** PostgreSQL (multi-tenant, complex billing, permissions)
- **Cache:** Redis
- **Recommendation:** Supabase for early stage, self-hosted PostgreSQL at scale

### Real-Time Dashboard / Analytics
- **OLTP:** PostgreSQL (operational data)
- **OLAP:** ClickHouse or BigQuery (analytical queries)
- **Cache:** Redis (real-time counters, current metrics)

### AI Application with Semantic Search
- **Vectors:** pgvector (PostgreSQL extension) or Pinecone
- **Documents:** PostgreSQL or MongoDB
- **Cache:** Redis

---

## Comparison Tables

### PostgreSQL vs MongoDB

| | PostgreSQL | MongoDB |
|--|-----------|---------|
| Schema | Fixed, enforced | Flexible, optional |
| Queries | SQL with JOINs | JSON query API |
| Transactions | Full ACID | Multi-document (4.0+) |
| Scaling | Vertical + read replicas | Horizontal sharding |
| Best for | Relational, financial, complex | Documents, content, flexible |

### Firebase vs Supabase

| | Firebase | Supabase |
|--|----------|----------|
| Database | Firestore (NoSQL) | PostgreSQL (SQL) |
| Vendor lock-in | High | Low (self-hostable) |
| Complex queries | Limited | Full SQL |
| Offline support | Excellent | Limited |
| Open source | No | Yes |
| Learning curve | Low | Medium (need SQL) |

---

## Multi-Database Architecture

Most production systems use multiple databases:

\`\`\`
User Request
    │
    ├── Redis ──────────── Cache check (sub-millisecond)
    │   └── HIT? Return cached result
    │   └── MISS? Continue
    │
    ├── PostgreSQL ─────── Main data store (all writes, cache misses)
    │
    ├── Redis ──────────── Cache result for next request
    │
    └── Background jobs:
        ├── Redis Queue ── Job processing
        └── S3/R2 ──────── File storage
\`\`\`

This is the architecture behind most startups and scale-ups. Learn it.`,
    codeExamples: [
      {
        title: 'Multi-database setup in a Node.js app',
        code: `// config/database.ts — connecting to multiple databases

// PostgreSQL (primary database)
import { Pool } from 'pg';
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

// Redis (cache + sessions)
import { createClient } from 'redis';
export const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// MongoDB (for a specific feature needing flexible schema)
import { MongoClient } from 'mongodb';
const mongoClient = new MongoClient(process.env.MONGODB_URI!);
export const mongodb = mongoClient.db('analytics');

// Usage pattern:
async function getUser(userId: string) {
  // 1. Check Redis cache
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);

  // 2. Fetch from PostgreSQL
  const { rows } = await pgPool.query(
    'SELECT * FROM users WHERE id = $1', [userId]
  );
  const user = rows[0];

  // 3. Cache for 5 minutes
  await redis.setEx(\`user:\${userId}\`, 300, JSON.stringify(user));

  return user;
}`,
        explanation: 'Production apps typically use PostgreSQL as the primary store, Redis for caching, and potentially MongoDB or another specialized DB for specific features.',
      },
    ],
    commonMistakes: [
      'Using MongoDB for everything because "NoSQL is more scalable" — PostgreSQL scales to billions of rows with proper indexes.',
      'Not adding Redis caching when traffic grows — your database will become the bottleneck.',
      'Starting with a complex multi-database setup for an MVP — use Supabase or PostgreSQL alone until you have real scaling needs.',
      'Choosing based on stack (MEAN = MongoDB) instead of problem fit.',
    ],
    interviewQuestions: [
      {
        question: 'How would you choose between PostgreSQL and MongoDB for a new project?',
        answer: 'Choose PostgreSQL when: data has clear relationships (users, orders, products), you need ACID transactions, complex queries with JOINs are common, or data integrity is critical (finance, healthcare). Choose MongoDB when: data structure varies between records, you are building document-centric features (content management, user profiles with varying fields), or your team is JavaScript-heavy and prefers working with native JSON documents.',
        difficulty: 'intermediate',
      },
      {
        question: 'In what scenario would you use multiple databases in one application?',
        answer: 'A common production architecture uses: PostgreSQL as the primary relational store for all persistent data; Redis as a cache layer to reduce PostgreSQL load and store sessions/rate limit counters; optionally MongoDB for a specific flexible-schema feature; and object storage (S3) for files. Each serves a different purpose — you are not duplicating data, but using the right tool for each access pattern.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'db-ex-17-1',
        title: 'Choose databases for real projects',
        description: 'For each project below, choose the right database(s) and explain your reasoning.',
        starterCode: `// Project 1: A hospital management system
// - Patient records, appointments, medical history
// - Multiple doctors accessing simultaneously
// - Data integrity is critical (no partial records)
// Database choice:

// Project 2: A real-time multiplayer game
// - Player scores updated every second
// - Leaderboard showing top 100 players
// - Player profiles and game history
// Database choice(s):

// Project 3: A job board like LinkedIn
// - Job listings with varying fields (some have equity, some don't)
// - Users apply to jobs
// - Search by skill, location, company
// Database choice(s):`,
        solution: `// Project 1: Hospital Management System
// → PostgreSQL
// Why: Patient records are highly relational (patient → appointments → doctors → prescriptions).
//      Medical data requires ACID transactions (partial saves are dangerous).
//      Complex reporting queries (all patients with condition X on medication Y).
//      Data integrity constraints prevent invalid states.

// Project 2: Real-time Multiplayer Game
// → PostgreSQL (primary) + Redis (leaderboard + real-time)
// Why: PostgreSQL for player profiles and game history (relational, persistent).
//      Redis Sorted Sets for the live leaderboard (ZADD/ZRANGE is instant).
//      Redis for real-time score updates (sub-millisecond writes).
//      Redis Pub/Sub for broadcasting score changes to connected players.

// Project 3: Job Board (LinkedIn-style)
// → PostgreSQL + Redis + Elasticsearch
// Why: PostgreSQL for users, applications, companies (relational).
//      Job listings in PostgreSQL with JSONB for flexible field schemas.
//      Redis for session caching and rate limiting.
//      Elasticsearch (or PostgreSQL full-text) for skill/location search.`,
        hints: [
          'Start with the most critical data integrity requirements',
          'Identify which data needs real-time access',
          'Identify which data needs fast search vs structured queries',
        ],
      },
    ],
    keyTakeaways: [
      'Choose databases based on data shape and access patterns, not popularity.',
      'PostgreSQL is the default choice for most web apps — it handles almost everything.',
      'Add Redis when you need sub-millisecond speed for caching, sessions, or leaderboards.',
      'MongoDB for document/content systems where schema flexibility matters.',
      'Firebase for MVPs and real-time mobile apps. Supabase for PostgreSQL + BaaS combo.',
      'Most production apps use PostgreSQL + Redis as the core combination.',
    ],
    prevLesson: 'orms-database-tools',
    nextLesson: 'database-design-projects',
  },

  // ─── LESSON 18 ───────────────────────────────────────────────────────────────
  {
    id: 'database-design-projects',
    slug: 'database-design-projects',
    title: 'Database Design for Real Projects',
    description: 'Complete database schemas for authentication, blogs, e-commerce, social media, chat, and SaaS — the actual tables, relationships, and queries you will use in your projects.',
    category: 'Projects',
    order: 18,
    difficulty: 'intermediate',
    estimatedTime: 55,
    content: `## How Professional Developers Design Databases

When you join a company or build a startup, you will need to design databases from scratch. This lesson shows you the actual schemas for common application types.

**Process:**
1. List all entities (nouns in your requirements)
2. Define attributes for each entity
3. Identify relationships
4. Add constraints and indexes
5. Consider how queries will look

---

## 1. Authentication System

Every application needs this. Users, sessions, password resets.

\`\`\`sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255),             -- null for OAuth-only users
  name            VARCHAR(100) NOT NULL,
  avatar_url      VARCHAR(500),
  email_verified  BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE oauth_accounts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  provider    VARCHAR(50) NOT NULL,          -- 'google', 'github', 'apple'
  provider_id VARCHAR(255) NOT NULL,         -- ID from the OAuth provider
  UNIQUE (provider, provider_id)
);

CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,          -- hash of the token, not the token itself
  expires_at TIMESTAMPTZ NOT NULL,
  revoked    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_oauth_accounts_user ON oauth_accounts(user_id);
\`\`\`

---

## 2. Blog Application

\`\`\`sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  bio        TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id  INT REFERENCES categories(id),
  title        VARCHAR(300) NOT NULL,
  slug         VARCHAR(300) UNIQUE NOT NULL,  -- URL-friendly version of title
  excerpt      TEXT,
  body         TEXT NOT NULL,
  cover_image  VARCHAR(500),
  published    BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  views        INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES comments(id),   -- for nested replies
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_likes (
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)             -- user can like a post only once
);

-- Indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published, published_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
\`\`\`

---

## 3. E-Commerce Application

\`\`\`sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  label       VARCHAR(50),              -- 'home', 'work'
  line1       VARCHAR(255) NOT NULL,
  line2       VARCHAR(255),
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100),
  country     VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  is_default  BOOLEAN DEFAULT false
);

CREATE TABLE categories (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  parent_id INT REFERENCES categories(id)  -- hierarchical categories
);

CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INT REFERENCES categories(id),
  name        VARCHAR(200) NOT NULL,
  slug        VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),           -- original price (for "was $99")
  stock       INT NOT NULL DEFAULT 0,
  sku         VARCHAR(100) UNIQUE,
  images      TEXT[],                    -- array of image URLs
  is_active   BOOLEAN DEFAULT true,
  attributes  JSONB DEFAULT '{}',        -- {"color": "red", "size": "XL"}
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id),
  address_id     UUID REFERENCES addresses(id),
  status         VARCHAR(50) DEFAULT 'pending',
  subtotal       DECIMAL(10,2) NOT NULL,
  shipping_cost  DECIMAL(10,2) DEFAULT 0,
  discount       DECIMAL(10,2) DEFAULT 0,
  total          DECIMAL(10,2) NOT NULL,
  notes          TEXT,
  placed_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,    -- snapshot in case product changes
  unit_price   DECIMAL(10,2) NOT NULL,   -- snapshot of price at purchase
  quantity     INT NOT NULL,
  total        DECIMAL(10,2) NOT NULL
);

CREATE TABLE reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title      VARCHAR(200),
  body       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, user_id)           -- one review per user per product
);
\`\`\`

---

## 4. Chat Application

\`\`\`sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  avatar_url VARCHAR(500),
  status     VARCHAR(50) DEFAULT 'offline',  -- online, offline, away
  last_seen  TIMESTAMPTZ
);

CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(200),              -- null for DMs
  is_group   BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_members (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(50) DEFAULT 'member', -- 'admin', 'member'
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  last_read_at    TIMESTAMPTZ,               -- for unread count
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES users(id),
  content         TEXT,
  message_type    VARCHAR(50) DEFAULT 'text',  -- 'text', 'image', 'file'
  media_url       VARCHAR(500),
  reply_to_id     UUID REFERENCES messages(id),
  edited_at       TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,               -- soft delete
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message_reactions (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  emoji      VARCHAR(10) NOT NULL,
  PRIMARY KEY (message_id, user_id, emoji)
);

-- Critical index: load messages in a conversation
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_members_user ON conversation_members(user_id);
\`\`\`

---

## 5. SaaS Application (Multi-Tenant)

\`\`\`sql
CREATE TABLE organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(200) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  plan       VARCHAR(50) DEFAULT 'free',    -- 'free', 'pro', 'enterprise'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many: users ↔ organizations with roles
CREATE TABLE organization_members (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(50) DEFAULT 'member',  -- 'owner', 'admin', 'member'
  invited_by      UUID REFERENCES users(id),
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
);

-- Example feature table (scoped to organization)
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by      UUID REFERENCES users(id),
  name            VARCHAR(200) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions and billing
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id      VARCHAR(255),
  stripe_subscription_id  VARCHAR(255),
  plan            VARCHAR(50) NOT NULL,
  status          VARCHAR(50) NOT NULL,   -- 'active', 'cancelled', 'past_due'
  current_period_end TIMESTAMPTZ
);
\`\`\``,
    codeExamples: [
      {
        title: 'Key query: get user dashboard data in one query',
        code: `-- E-commerce: get a user's recent orders with item count and status
SELECT
  o.id,
  o.status,
  o.total,
  o.placed_at,
  COUNT(oi.id) AS item_count,
  STRING_AGG(oi.product_name, ', ') AS product_names
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = $1
GROUP BY o.id, o.status, o.total, o.placed_at
ORDER BY o.placed_at DESC
LIMIT 5;

-- Chat: get all conversations with latest message and unread count
SELECT
  c.id,
  c.name,
  c.is_group,
  m.content AS latest_message,
  m.created_at AS latest_at,
  COUNT(m2.id) FILTER (
    WHERE m2.created_at > cm.last_read_at
  ) AS unread_count
FROM conversations c
JOIN conversation_members cm ON c.id = cm.conversation_id AND cm.user_id = $1
LEFT JOIN LATERAL (
  SELECT content, created_at FROM messages
  WHERE conversation_id = c.id
  ORDER BY created_at DESC LIMIT 1
) m ON true
LEFT JOIN messages m2 ON m2.conversation_id = c.id
GROUP BY c.id, c.name, c.is_group, m.content, m.created_at, cm.last_read_at
ORDER BY m.created_at DESC;`,
        explanation: 'These are the real queries that power dashboards. LATERAL JOIN fetches the latest message per conversation efficiently. FILTER on COUNT computes unread counts.',
      },
    ],
    commonMistakes: [
      'Not storing snapshots in order_items (product name, unit_price) — products change over time.',
      'Not soft-deleting messages in chat apps — hard delete removes history that other users have already seen.',
      'Not indexing the messages table on (conversation_id, created_at) — loading a chat history without this index is catastrophically slow.',
      'Forgetting to scope all SaaS data to organization_id — without it, tenants can see each other\'s data.',
    ],
    interviewQuestions: [
      {
        question: 'How would you design a database for a chat application?',
        answer: 'Core tables: users (profile, status), conversations (group or DM), conversation_members (many-to-many: users ↔ conversations with role and last_read_at for unread count), messages (content, type, reply_to for threads, deleted_at for soft delete). Critical index on messages(conversation_id, created_at DESC) for efficient message loading. Use Redis pub/sub or Supabase realtime for live delivery.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you handle multi-tenancy in a SaaS database?',
        answer: 'The most common approach is shared database with tenant ID column — every table has an organization_id column. All queries must filter by organization_id. Row Level Security (in PostgreSQL/Supabase) enforces this at the database level. Alternative approaches: separate schemas per tenant (more isolation, harder to manage) or separate databases per tenant (maximum isolation, expensive at scale).',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'db-ex-18-1',
        title: 'Design a Learning Management System (LMS) database',
        description: 'Design tables for an LMS like Udemy — courses, instructors, students, lessons, enrollments, and progress tracking.',
        starterCode: `-- Design tables for an LMS with:
-- Instructors who create courses
-- Courses with sections and lessons
-- Students who enroll in courses
-- Progress tracking (which lessons completed)
-- Reviews and ratings

-- Write CREATE TABLE statements:`,
        solution: `CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  role       VARCHAR(50) DEFAULT 'student',  -- 'student', 'instructor', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES users(id),
  title       VARCHAR(300) NOT NULL,
  slug        VARCHAR(300) UNIQUE NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) DEFAULT 0,
  thumbnail   VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID REFERENCES courses(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  position   INT NOT NULL         -- for ordering sections
);

CREATE TABLE lessons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id   UUID REFERENCES sections(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  video_url    VARCHAR(500),
  duration_sec INT,               -- video length in seconds
  position     INT NOT NULL,      -- for ordering within section
  is_free      BOOLEAN DEFAULT false  -- preview lessons
);

CREATE TABLE enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID REFERENCES courses(id),
  student_id  UUID REFERENCES users(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (course_id, student_id)
);

CREATE TABLE lesson_progress (
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id     UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed     BOOLEAN DEFAULT false,
  completed_at  TIMESTAMPTZ,
  PRIMARY KEY (enrollment_id, lesson_id)
);

CREATE TABLE course_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID REFERENCES courses(id),
  student_id  UUID REFERENCES users(id),
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (course_id, student_id)
);`,
        hints: [
          'Courses have sections; sections have lessons (nested hierarchy)',
          'Enrollments link students to courses (many-to-many)',
          'Progress is tracked per lesson per enrollment',
        ],
      },
    ],
    keyTakeaways: [
      'Always snapshot product name/price in order_items — source data changes over time.',
      'Use soft deletes (deleted_at column) for chat messages — hard deletes break message history.',
      'Index the combination of (parent_id, created_at DESC) for any feed or message list.',
      'Multi-tenant SaaS: scope every table with organization_id and enforce with RLS.',
      'UUID primary keys for public-facing IDs — prevents sequential enumeration.',
      'last_read_at in chat membership enables unread count calculation.',
    ],
    prevLesson: 'database-selection',
    nextLesson: 'database-interview-prep',
  },

  // ─── LESSON 19 ───────────────────────────────────────────────────────────────
  {
    id: 'database-interview-prep',
    slug: 'database-interview-prep',
    title: 'Database Interview Preparation',
    description: 'SQL questions, design questions, NoSQL questions, scenario-based questions, and system design database questions — everything for your interview.',
    category: 'Interview',
    order: 19,
    difficulty: 'intermediate',
    estimatedTime: 45,
    content: `## How Interviews Test Database Knowledge

Companies test database knowledge in 3 ways:
1. **SQL coding questions** — write queries live
2. **System design** — design a database schema for a system
3. **Conceptual questions** — explain ACID, indexes, normalization

For L3-L5 engineers, you need all three. For junior roles, SQL and schema design are most common.

---

## SQL Interview Questions

### Question 1: Second Highest Salary
\`\`\`sql
-- Table: employees(id, name, salary)
-- Find the employee with the second highest salary

-- Solution 1: LIMIT + OFFSET
SELECT name, salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Solution 2: Subquery (handles ties)
SELECT name, salary FROM employees
WHERE salary = (
  SELECT DISTINCT salary FROM employees
  ORDER BY salary DESC
  LIMIT 1 OFFSET 1
);

-- Solution 3: DENSE_RANK window function (most flexible)
SELECT name, salary FROM (
  SELECT name, salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 2;
\`\`\`

### Question 2: Employees Earning More Than Manager
\`\`\`sql
-- Table: employees(id, name, salary, manager_id)
SELECT e.name AS employee, e.salary AS emp_salary,
       m.name AS manager,  m.salary AS mgr_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
\`\`\`

### Question 3: Duplicate Emails
\`\`\`sql
-- Find emails that appear more than once
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Delete duplicates, keep the one with lowest id
DELETE FROM users
WHERE id NOT IN (
  SELECT MIN(id) FROM users GROUP BY email
);
\`\`\`

### Question 4: Running Total
\`\`\`sql
-- Cumulative sales by date
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) AS running_total
FROM sales
ORDER BY date;
\`\`\`

### Question 5: Users Who Never Ordered
\`\`\`sql
-- Find users who have never placed an order

-- Solution 1: LEFT JOIN + IS NULL
SELECT u.id, u.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- Solution 2: NOT IN subquery
SELECT id, name FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);

-- Solution 3: NOT EXISTS
SELECT id, name FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders WHERE user_id = u.id
);
\`\`\`

---

## Database Design Interview Questions

### Design a URL Shortener Database
\`\`\`sql
CREATE TABLE short_urls (
  id           BIGSERIAL PRIMARY KEY,
  short_code   VARCHAR(10) UNIQUE NOT NULL,  -- the short part (abc123)
  original_url TEXT NOT NULL,
  user_id      UUID REFERENCES users(id),    -- null for anonymous
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,                  -- optional expiry
  is_active    BOOLEAN DEFAULT true
);

CREATE TABLE url_clicks (
  id           BIGSERIAL PRIMARY KEY,
  short_url_id BIGINT REFERENCES short_urls(id),
  clicked_at   TIMESTAMPTZ DEFAULT NOW(),
  ip_address   INET,
  user_agent   TEXT,
  referrer     TEXT
);

CREATE INDEX idx_short_urls_code ON short_urls(short_code);  -- critical
CREATE INDEX idx_url_clicks_short_url ON url_clicks(short_url_id, clicked_at);
\`\`\`

### Design a Twitter-like Database
\`\`\`sql
-- Core tables
CREATE TABLE users (id UUID PK, username UNIQUE, bio, follower_count INT DEFAULT 0);
CREATE TABLE tweets (id UUID PK, user_id FK, content VARCHAR(280), created_at);
CREATE TABLE follows (follower_id UUID FK users, following_id UUID FK users, PK(follower,following));
CREATE TABLE likes (tweet_id UUID FK, user_id UUID FK, PK(tweet,user));
CREATE TABLE retweets (tweet_id UUID FK, user_id UUID FK, PK(tweet,user));

-- Timeline: fan-out on write vs fan-out on read
-- Fan-out on write: on tweet, push tweet_id to all followers' feed caches (Redis)
-- Fan-out on read: on timeline request, query follows table + tweets (simpler but slower)
\`\`\`

---

## Conceptual Questions — Expected Answers

### "What is a transaction?"
A transaction is a group of database operations that execute atomically — all succeed or all fail. It provides ACID guarantees. Transactions are started with BEGIN and ended with COMMIT (save) or ROLLBACK (undo).

### "Explain ACID"
- **Atomicity:** All operations in the transaction succeed or all fail. No partial state.
- **Consistency:** Database moves from one valid state to another. All constraints hold.
- **Isolation:** Concurrent transactions don't interfere. Each runs as if it were sequential.
- **Durability:** Committed changes survive crashes via write-ahead logging.

### "What is an index and what are the tradeoffs?"
An index is a B-Tree data structure that makes lookups O(log n) instead of O(n). It speeds up SELECT, JOIN, and ORDER BY. Tradeoff: indexes slow down INSERT/UPDATE/DELETE because the B-Tree must be updated. Indexes also use disk space. Add indexes where queries are slow on large tables.

### "What is the difference between clustered and non-clustered indexes?"
A clustered index determines the physical order of rows on disk. There can only be one. In SQL Server, the primary key is a clustered index by default. Non-clustered indexes are separate B-Tree structures with pointers to the actual rows. PostgreSQL uses heap tables (no clustering by default).

### "What is database normalization?"
Normalization eliminates data redundancy by organizing tables so each fact is stored in exactly one place. 1NF: atomic values (no arrays in cells). 2NF: no partial dependencies. 3NF: no transitive dependencies. The goal is to prevent update, insertion, and deletion anomalies.

---

## System Design Database Questions

### "How would you scale a database with 100 million users?"

**Vertical scaling first:** Increase server RAM and CPU. Cheaper and simpler.

**Then horizontal approaches:**
1. **Read replicas** — route all reads to replica servers, writes to primary
2. **Connection pooling** — PgBouncer in front of PostgreSQL
3. **Caching layer** — Redis in front of the database (cache hot user data)
4. **Database sharding** — split users across multiple databases by user_id range or hash
5. **CDN + object storage** — move files/images out of the database

**In interview:** mention that most companies serve 100M users on a single PostgreSQL instance with proper indexes and caching. Premature sharding is a common mistake.

### "How do you handle the N+1 query problem?"

Use eager loading — fetch all related data in the initial query using JOINs or the ORM's include feature. In Prisma: \`include: { orders: true }\`. In SQL: a JOIN. The result is 1-2 queries instead of N+1.

---

## MongoDB-Specific Questions

### "When would you embed vs reference in MongoDB?"
Embed when: data is always read with the parent, data belongs to only one parent, array size is bounded (< 100). Reference when: data is shared between documents, array can grow unboundedly, or you need to query the related data independently.

### "What is the MongoDB aggregation pipeline?"
A series of transformation stages that process documents. Each stage's output becomes the next stage's input. Stages: $match (filter), $group (aggregate), $sort, $project (reshape), $lookup (join), $unwind (flatten arrays). It is MongoDB's equivalent of SQL GROUP BY, JOINs, and subqueries.`,
    codeExamples: [
      {
        title: 'Classic interview problem: department with highest average salary',
        code: `-- Table: employees(id, name, salary, department_id)
-- Table: departments(id, name)
-- Find: department name with the highest average salary

-- Step 1: Calculate average salary per department
WITH dept_avg AS (
  SELECT department_id, AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department_id
)
-- Step 2: Join with departments table to get name
-- Step 3: Get the highest
SELECT d.name, da.avg_salary
FROM departments d
JOIN dept_avg da ON d.id = da.department_id
ORDER BY da.avg_salary DESC
LIMIT 1;

-- Alternative without CTE:
SELECT d.name, AVG(e.salary) AS avg_salary
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.id, d.name
ORDER BY avg_salary DESC
LIMIT 1;`,
        explanation: 'Use a CTE to break the problem into steps. First calculate averages, then join to get names. This approach works for any "aggregate + join + filter" interview question.',
      },
      {
        title: 'Consecutive days streak — popular interview problem',
        code: `-- Find users with a login streak of 7+ consecutive days
-- Table: logins(user_id, login_date)

WITH daily_logins AS (
  -- Remove duplicate logins on same day
  SELECT DISTINCT user_id, login_date FROM logins
),
ranked AS (
  SELECT
    user_id,
    login_date,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS rn,
    -- If dates are consecutive, login_date - rn is constant
    login_date - INTERVAL '1 day' * ROW_NUMBER()
      OVER (PARTITION BY user_id ORDER BY login_date) AS grp
  FROM daily_logins
)
SELECT user_id, COUNT(*) AS streak_length
FROM ranked
GROUP BY user_id, grp
HAVING COUNT(*) >= 7
ORDER BY streak_length DESC;`,
        explanation: 'The consecutive days trick: subtract the row number from the date. Consecutive dates produce the same constant group value. This is a classic window function interview question.',
      },
    ],
    commonMistakes: [
      'Writing SELECT * in interview solutions — always specify columns.',
      'Forgetting HAVING when filtering aggregated results.',
      'Not knowing multiple ways to solve the same query (JOIN vs subquery vs NOT EXISTS).',
      'Not mentioning indexes when discussing query performance.',
      'Confusing WHERE and HAVING — cannot use aggregate functions in WHERE.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?',
        answer: 'INNER JOIN returns only rows where the join condition matches in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right (unmatched are NULL). RIGHT JOIN is the mirror of LEFT JOIN. FULL OUTER JOIN returns all rows from both tables — rows without a match in the other table have NULLs. In practice, INNER JOIN and LEFT JOIN cover 99% of cases.',
        difficulty: 'beginner',
      },
      {
        question: 'How would you optimize a slow SQL query?',
        answer: '1. Run EXPLAIN ANALYZE to see the execution plan and find Seq Scans. 2. Add indexes on columns in WHERE, JOIN, and ORDER BY clauses. 3. Avoid SELECT * — select only needed columns. 4. Avoid LIKE with leading wildcards (%term). 5. Use proper JOINs instead of subqueries where possible. 6. Add LIMIT to avoid fetching millions of rows. 7. Check if statistics are up to date (ANALYZE). 8. Consider denormalization for frequently aggregated data.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is database sharding and when would you use it?',
        answer: 'Sharding splits a database horizontally — different rows go to different database servers (shards). For example, users 1-1M on shard 1, 1M-2M on shard 2. Benefits: distributes write load and storage. Drawbacks: JOINs across shards are impossible, cross-shard transactions are complex, rebalancing shards is painful. Use sharding only when you have exhausted vertical scaling, read replicas, and caching. Most companies serve 100M+ users without sharding.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'db-ex-19-1',
        title: 'SQL interview problems practice set',
        description: 'Solve these classic SQL interview questions.',
        starterCode: `-- Problem 1: Find the top 3 products by total sales revenue
-- Tables: products(id, name), order_items(id, order_id, product_id, quantity, unit_price)

-- Problem 2: Find customers who have placed orders in every month of 2024
-- Tables: users(id, name), orders(id, user_id, placed_at)

-- Problem 3: Find the day with the highest number of new user signups
-- Table: users(id, email, created_at)

-- Write your solutions below:`,
        solution: `-- Problem 1: Top 3 products by revenue
SELECT
  p.name,
  SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_revenue DESC
LIMIT 3;

-- Problem 2: Users with orders in every month of 2024
SELECT u.id, u.name
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE EXTRACT(YEAR FROM o.placed_at) = 2024
GROUP BY u.id, u.name
HAVING COUNT(DISTINCT EXTRACT(MONTH FROM o.placed_at)) = 12;
-- 12 distinct months = ordered in every month

-- Problem 3: Day with most signups
SELECT
  DATE(created_at) AS signup_date,
  COUNT(*) AS signups
FROM users
GROUP BY DATE(created_at)
ORDER BY signups DESC
LIMIT 1;`,
        hints: [
          'Problem 1: JOIN products to order_items, GROUP BY product, SUM revenue',
          'Problem 2: Count DISTINCT months, HAVING COUNT = 12',
          'Problem 3: GROUP BY DATE (truncate to day), ORDER BY count DESC LIMIT 1',
        ],
      },
    ],
    keyTakeaways: [
      'SQL interview staples: second highest, duplicates, users without orders, running totals.',
      'Know 3 ways to find "users without orders": LEFT JOIN + IS NULL, NOT IN, NOT EXISTS.',
      'Window functions (RANK, DENSE_RANK, ROW_NUMBER, SUM OVER) appear in 50% of hard SQL questions.',
      'For design questions: identify entities, relationships, constraints, and critical indexes.',
      'For ACID questions: give the banking transfer example.',
      'For scaling questions: vertical → replicas → cache → sharding (in that order).',
    ],
    prevLesson: 'database-design-projects',
    nextLesson: 'database-revision',
  },

  // ─── LESSON 20 ───────────────────────────────────────────────────────────────
  {
    id: 'database-revision',
    slug: 'database-revision',
    title: 'Database Revision Hub',
    description: 'The complete cheat sheet — SQL, MongoDB, PostgreSQL, database design, and interview questions all in one place for fast revision.',
    category: 'Revision',
    order: 20,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## SQL Cheat Sheet

\`\`\`sql
-- ─── DDL: Define Structure ─────────────────────────────────
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE users ADD COLUMN bio TEXT;
DROP TABLE users;

-- ─── DML: Manipulate Data ─────────────────────────────────
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
SELECT id, name FROM users WHERE email = 'alice@example.com';
UPDATE users SET name = 'Alice Smith' WHERE id = 1;
DELETE FROM users WHERE id = 1;

-- ─── Filtering ────────────────────────────────────────────
WHERE age > 18
WHERE age BETWEEN 18 AND 65
WHERE name LIKE 'Al%'          -- starts with Al
WHERE name LIKE '%ice'         -- ends with ice
WHERE status IN ('active', 'premium')
WHERE status IS NOT NULL
WHERE age > 18 AND city = 'NYC'
WHERE age > 18 OR role = 'admin'

-- ─── Sorting, Paging ──────────────────────────────────────
ORDER BY created_at DESC
LIMIT 10 OFFSET 20             -- page 3 (10 items/page)

-- ─── Aggregates ───────────────────────────────────────────
SELECT COUNT(*), SUM(total), AVG(total), MIN(total), MAX(total) FROM orders;
SELECT city, COUNT(*) FROM users GROUP BY city HAVING COUNT(*) > 5;

-- ─── Joins ────────────────────────────────────────────────
INNER JOIN orders o ON u.id = o.user_id   -- only matching rows
LEFT JOIN orders o ON u.id = o.user_id    -- all users, null if no order

-- ─── Window Functions ─────────────────────────────────────
SELECT name, salary,
  RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC),
  SUM(salary) OVER (ORDER BY hire_date)  -- running total
FROM employees;

-- ─── Transactions ─────────────────────────────────────────
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;   -- or ROLLBACK;

-- ─── Indexes ──────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'x@y.com';
\`\`\`

---

## PostgreSQL-Specific Cheat Sheet

\`\`\`sql
-- Data types
SERIAL / BIGSERIAL         -- auto-increment integer
UUID                       -- gen_random_uuid()
BOOLEAN                    -- true/false
TIMESTAMPTZ                -- timestamp with timezone (use this!)
JSONB                      -- queryable binary JSON
TEXT[]                     -- array of text

-- JSONB queries
SELECT metadata->>'color' FROM products;             -- extract as text
SELECT * FROM products WHERE metadata->'size' = '"XL"'; -- exact value
CREATE INDEX ON products USING GIN(metadata);        -- index for JSONB

-- Upsert
INSERT INTO users (email, name) VALUES ('a@b.com', 'Alice')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

-- Return inserted row
INSERT INTO users (name, email) VALUES ('Bob', 'b@b.com') RETURNING id;

-- psql commands
\\l          -- list databases
\\c mydb     -- connect to database
\\dt         -- list tables
\\d users    -- describe table
\\q          -- quit
\`\`\`

---

## MongoDB Cheat Sheet

\`\`\`javascript
// CRUD
db.users.insertOne({ name: 'Alice', email: 'a@example.com' });
db.users.find({ age: { $gt: 18 } });
db.users.findOne({ email: 'a@example.com' });
db.users.updateOne({ _id: id }, { $set: { name: 'Alice Smith' } });
db.users.deleteOne({ _id: id });

// Query operators
{ age: { $gt: 25 } }            // greater than
{ age: { $gte: 18, $lte: 65 }} // between
{ status: { $in: ['a','b'] } }  // in array
{ $and: [{a:1},{b:2}] }         // AND
{ 'address.city': 'NYC' }       // nested field (dot notation)
{ tags: 'javascript' }          // array contains

// Update operators
{ $set: { field: value } }      // set specific field
{ $unset: { field: '' } }       // remove field
{ $inc: { count: 1 } }          // increment
{ $push: { tags: 'new' } }      // add to array
{ $pull: { tags: 'old' } }      // remove from array

// Aggregation
db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$userId', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);

// Indexes
db.users.createIndex({ email: 1 });
db.orders.createIndex({ userId: 1, status: 1 });
\`\`\`

---

## Database Design Quick Reference

\`\`\`
Relationship Types:
  One-to-Many: FK on "many" side (orders.user_id → users.id)
  One-to-One: FK with UNIQUE constraint
  Many-to-Many: junction table (order_items: order_id + product_id)

Normalization:
  1NF: atomic values, no arrays in cells
  2NF: no partial dependencies (on part of composite key)
  3NF: no transitive dependencies (non-key → non-key)

Indexes:
  Add on: WHERE columns, JOIN columns, ORDER BY columns, foreign keys
  Composite: most selective column FIRST
  Never: low cardinality (boolean), very small tables

ACID:
  Atomicity  → BEGIN/COMMIT/ROLLBACK
  Consistency → constraints enforced
  Isolation  → READ COMMITTED (default), SERIALIZABLE (financial)
  Durability → write-ahead log (WAL)
\`\`\`

---

## Database Selection Quick Reference

\`\`\`
PostgreSQL  → default choice, relational data, ACID, complex queries
MySQL       → PHP/WordPress ecosystem
SQLite      → mobile apps, prototypes, embedded
MongoDB     → flexible schema, document data
Redis       → caching, sessions, rate limiting, leaderboards
Firebase    → MVP, mobile, real-time, no backend team
Supabase    → startup, PostgreSQL + BaaS, TypeScript projects
Cassandra   → billions of time-series writes/day
Neo4j       → graph relationships, social networks
Pinecone    → AI, semantic search, embeddings
\`\`\`

---

## Top 20 Interview Questions — Quick Answers

1. **What is ACID?** Atomicity (all-or-nothing), Consistency (valid states), Isolation (no interference), Durability (survives crashes)

2. **SQL vs NoSQL?** SQL: structured, relational, ACID. NoSQL: flexible, scalable, varied types.

3. **What is an index?** B-Tree structure for O(log n) lookups instead of O(n) table scans.

4. **N+1 problem?** Fetching N parents then querying each child separately. Fix: eager loading (JOINs/include).

5. **What is normalization?** Removing redundancy. 3NF: each fact stored in one place.

6. **JOIN types?** INNER: only matches. LEFT: all left + matches. FULL OUTER: all rows from both.

7. **WHERE vs HAVING?** WHERE filters rows. HAVING filters groups after GROUP BY.

8. **What is a foreign key?** Column referencing another table's primary key. Enforces referential integrity.

9. **What is a transaction?** Group of operations that execute atomically.

10. **Clustered vs non-clustered index?** Clustered: rows stored in index order. Non-clustered: separate structure with pointers.

11. **How to scale a database?** Vertical → read replicas → cache (Redis) → sharding.

12. **What is sharding?** Horizontal partitioning — splitting rows across multiple database servers.

13. **Embedding vs referencing (MongoDB)?** Embed: bounded, owned, always read together. Reference: shared, unbounded.

14. **What is Redis?** In-memory key-value store. Sub-millisecond reads. Used for caching, sessions, pub/sub.

15. **What is a connection pool?** Reusable pre-created database connections to avoid connection overhead per request.

16. **INNER JOIN vs LEFT JOIN?** INNER: only matched rows. LEFT: all left rows, NULL for unmatched right.

17. **What is a CTE?** Common Table Expression — named subquery with WITH clause. Makes complex queries readable.

18. **Window functions?** RANK, ROW_NUMBER, SUM OVER — calculate values across rows without collapsing them.

19. **What is ORM?** Object-Relational Mapper — interact with database using language objects instead of SQL.

20. **When to denormalize?** When a JOIN is a measured performance bottleneck and you need to sacrifice some consistency for speed.`,
    codeExamples: [
      {
        title: 'The 10 most commonly tested SQL patterns',
        code: `-- 1. Second highest value
SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;

-- 2. Users without any orders
SELECT * FROM users WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);

-- 3. Duplicate records
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- 4. Running total
SELECT date, SUM(amount) OVER (ORDER BY date) AS running_total FROM sales;

-- 5. Rank within groups
SELECT *, RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) FROM employees;

-- 6. Self join (employee + manager)
SELECT e.name, m.name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id;

-- 7. Count per group + filter
SELECT user_id, COUNT(*) AS orders FROM orders GROUP BY user_id HAVING COUNT(*) > 3;

-- 8. Latest record per group
SELECT DISTINCT ON (user_id) * FROM orders ORDER BY user_id, created_at DESC;

-- 9. Percentage of total
SELECT name, amount, amount * 100.0 / SUM(amount) OVER () AS pct FROM sales;

-- 10. Conditional aggregation
SELECT
  COUNT(*) FILTER (WHERE status = 'active') AS active_count,
  COUNT(*) FILTER (WHERE status = 'inactive') AS inactive_count
FROM users;`,
        explanation: 'These 10 patterns cover 80% of SQL interview questions. Practice each until you can write them from memory.',
      },
    ],
    commonMistakes: [
      'Not reviewing before interviews — database concepts need active recall practice.',
      'Only knowing one solution to common problems — know multiple approaches (JOIN vs subquery vs NOT EXISTS).',
      'Not practicing EXPLAIN ANALYZE — showing you can diagnose performance is a huge differentiator.',
      'Forgetting MongoDB-specific patterns if applying for MEAN stack roles.',
    ],
    interviewQuestions: [
      {
        question: 'Walk me through how you would design a database for Uber.',
        answer: 'Tables: users (riders and drivers), driver_profiles (license, vehicle, status), rides (rider_id, driver_id, status, pickup/dropoff coordinates, price, timestamps), ratings (ride_id, ratee_id, rater_id, score). Location updates every few seconds stored in Redis (current driver locations), not in PostgreSQL. Historical ride data in PostgreSQL. Geospatial index on current driver locations for "find nearby drivers." Payment transactions with ACID requirements in PostgreSQL.',
        difficulty: 'advanced',
      },
      {
        question: 'What is the CAP theorem and how does it relate to database selection?',
        answer: 'CAP theorem states a distributed system can guarantee at most 2 of 3: Consistency (all nodes see same data), Availability (always responds), Partition Tolerance (works despite network splits). PostgreSQL prioritizes CP (consistency over availability). MongoDB configurable but defaults to CP. Cassandra prioritizes AP (availability and partition tolerance over strict consistency). CAP helps explain why distributed NoSQL databases offer eventual consistency — they sacrifice C for A and P.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'db-ex-20-1',
        title: 'Design Instagram database',
        description: 'Design the core database tables for Instagram. Include users, posts, stories, follows, likes, and comments.',
        starterCode: `-- Design Instagram's core database:
-- Users: profiles, bios, follower counts
-- Posts: images, captions, locations
-- Stories: expire after 24 hours
-- Follows: follower → following relationship
-- Likes: on posts
-- Comments: on posts, can have replies

-- Think about:
-- Which counts to denormalize (follower_count, like_count)?
-- How to implement the follower/following system?
-- How to handle story expiry?

-- Write CREATE TABLE statements:`,
        solution: `CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username        VARCHAR(30) UNIQUE NOT NULL,
  full_name       VARCHAR(100),
  bio             VARCHAR(150),
  avatar_url      VARCHAR(500),
  website         VARCHAR(255),
  is_private      BOOLEAN DEFAULT false,
  follower_count  INT DEFAULT 0,   -- denormalized for fast display
  following_count INT DEFAULT 0,
  post_count      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url    VARCHAR(500) NOT NULL,
  caption      TEXT,
  location     VARCHAR(200),
  like_count   INT DEFAULT 0,      -- denormalized
  comment_count INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  media_url  VARCHAR(500) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_stories_expires ON stories(expires_at);  -- for cleanup job

CREATE TABLE follows (
  follower_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);
CREATE INDEX idx_follows_following ON follows(following_id);

CREATE TABLE likes (
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES comments(id),  -- for replies
  body       TEXT NOT NULL,
  like_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_comments_post ON comments(post_id, created_at);`,
        hints: [
          'Denormalize follower_count and like_count for fast profile/post display',
          'Stories need an expires_at column and a cleanup job or index for expiry',
          'follows table is a self-referential many-to-many on the users table',
        ],
      },
    ],
    keyTakeaways: [
      'Keep this lesson bookmarked — return to it the night before any database interview.',
      'The 10 SQL patterns cover 80% of interview questions. Practice them weekly.',
      'ACID, indexes, normalization, and N+1 are the most tested conceptual topics.',
      'For design questions: entities → relationships → constraints → indexes.',
      'Denormalize counts (like_count, follower_count) for fast display in read-heavy social apps.',
      'Know the tradeoffs: PostgreSQL vs MongoDB, embedding vs referencing, SQL vs NoSQL.',
    ],
    prevLesson: 'database-interview-prep',
    nextLesson: 'database-practice',
  },

  // ─── LESSON 21 ───────────────────────────────────────────────────────────────
  {
    id: 'database-practice',
    slug: 'database-practice',
    title: 'Database Practice — Real World Design Challenges',
    description: 'Design Instagram, WhatsApp, Amazon, a blog, and an authentication system from scratch. Practical challenges that build real confidence.',
    category: 'Practice',
    order: 21,
    difficulty: 'intermediate',
    estimatedTime: 60,
    content: `## How to Use This Practice Section

These are open-ended design challenges — there is no single correct answer. The goal is to practice thinking like a database architect:

1. Read the requirements
2. Identify entities (the "nouns")
3. Identify relationships between entities
4. Design the schema
5. Write key queries
6. Identify what needs indexing
7. Choose the right database

Work through each challenge before reading the solution. Time yourself — aim for 15 minutes per challenge.

---

## Challenge 1: Design a Twitter Clone Database

**Requirements:**
- Users have profiles (username, bio, avatar)
- Users can post tweets (max 280 characters)
- Users can follow other users
- Users can like and retweet tweets
- Users can reply to tweets (threads)
- Timeline shows tweets from users you follow

**Think about:**
- How to model the follower graph
- How to generate a timeline efficiently
- What to denormalize for performance

---

## Challenge 2: Design a WhatsApp Database

**Requirements:**
- Users have phone numbers
- Users can have DMs (1-to-1 conversations)
- Users can create group chats (max 256 members)
- Messages can be text, image, video, document
- Messages have delivery receipts (sent, delivered, read)
- Messages can be replied to

**Think about:**
- How to model DMs vs groups with one table
- How to track read receipts efficiently
- How to handle message deletion

---

## Challenge 3: Design an Amazon-like E-Commerce Database

**Requirements:**
- Products with categories, attributes (size, color), and images
- Sellers can list products
- Customers can browse, cart, and purchase
- Orders have multiple items, shipping addresses, status tracking
- Product reviews and ratings
- Inventory management per seller

---

## Challenge 4: Design an Expense Tracker

**Requirements:**
- Users track personal expenses
- Expenses have category, amount, date, notes
- Users can set monthly budgets per category
- Reports: monthly spending, spending by category, vs budget

**Think about:**
- How to store budget rules
- How to calculate remaining budget efficiently

---

## Challenge 5: Design a Multi-Tenant SaaS (Like Notion)

**Requirements:**
- Organizations (workspaces) with members
- Members have roles: owner, admin, member, viewer
- Workspaces have pages (like Notion docs)
- Pages have blocks (text, image, code, table)
- Pages can be nested (page inside page)
- Sharing: pages can be shared publicly or with specific users

**Think about:**
- How to handle multi-tenancy securely
- How to store nested/hierarchical pages
- How to model flexible block content

---

## Solutions and Explanations

### Challenge 4 Solution: Expense Tracker

\`\`\`sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  name       VARCHAR(100) NOT NULL,
  currency   VARCHAR(3) DEFAULT 'USD'
);

CREATE TABLE categories (
  id      SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name    VARCHAR(100) NOT NULL,
  icon    VARCHAR(50),
  color   VARCHAR(7)  -- hex color for UI
);

CREATE TABLE expenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  amount      DECIMAL(10,2) NOT NULL,
  currency    VARCHAR(3) DEFAULT 'USD',
  description VARCHAR(300),
  expense_date DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE budgets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id),
  amount      DECIMAL(10,2) NOT NULL,
  period      VARCHAR(20) DEFAULT 'monthly',  -- 'monthly', 'weekly', 'yearly'
  start_date  DATE NOT NULL,
  UNIQUE (user_id, category_id, period, start_date)
);

-- Indexes for report queries
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(user_id, category_id);

-- Key query: spending vs budget for current month
SELECT
  c.name AS category,
  b.amount AS budget,
  COALESCE(SUM(e.amount), 0) AS spent,
  b.amount - COALESCE(SUM(e.amount), 0) AS remaining,
  ROUND(COALESCE(SUM(e.amount), 0) * 100 / b.amount, 1) AS pct_used
FROM budgets b
JOIN categories c ON b.category_id = c.id
LEFT JOIN expenses e ON e.category_id = b.category_id
  AND e.user_id = b.user_id
  AND DATE_TRUNC('month', e.expense_date) = DATE_TRUNC('month', CURRENT_DATE)
WHERE b.user_id = $1
  AND b.period = 'monthly'
  AND DATE_TRUNC('month', b.start_date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.name, b.amount;
\`\`\``,
    codeExamples: [
      {
        title: 'WhatsApp Database — core schema',
        code: `-- WhatsApp's core design challenge: DMs and groups in one schema
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        VARCHAR(20) UNIQUE NOT NULL,
  name         VARCHAR(100) NOT NULL,
  avatar_url   VARCHAR(500),
  last_seen    TIMESTAMPTZ,
  is_online    BOOLEAN DEFAULT false
);

-- One table for both DMs and group chats
CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       VARCHAR(10) NOT NULL,  -- 'dm' or 'group'
  name       VARCHAR(200),          -- null for DMs, required for groups
  avatar_url VARCHAR(500),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members of each conversation
CREATE TABLE conversation_members (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(20) DEFAULT 'member',  -- 'admin', 'member'
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  last_read_message_id UUID,                     -- for unread count
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages (supports text, image, video, reply)
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES users(id),
  content         TEXT,                          -- null for media-only
  message_type    VARCHAR(20) DEFAULT 'text',    -- text, image, video, doc
  media_url       VARCHAR(500),
  reply_to_id     UUID REFERENCES messages(id), -- for threads
  deleted_for_all BOOLEAN DEFAULT false,         -- "delete for everyone"
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery receipts (sent, delivered, read)
CREATE TABLE message_receipts (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  status     VARCHAR(20) NOT NULL,   -- 'delivered', 'read'
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);

-- Critical indexes
CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_members_user ON conversation_members(user_id);`,
        explanation: 'The key insight: use one conversations table for both DMs and groups, differentiated by a type column. message_receipts handles the double/blue tick system.',
      },
    ],
    commonMistakes: [
      'Designing in isolation without thinking about the read queries — schema design and query patterns are inseparable.',
      'Not adding indexes for the primary access pattern — in chat, you always load messages by conversation.',
      'Storing current location or ephemeral data in PostgreSQL — use Redis for real-time, frequently-updating state.',
      'Not thinking about soft deletes — WhatsApp "delete for everyone" sets a flag; it doesn\'t remove the row.',
    ],
    interviewQuestions: [
      {
        question: 'Design the database for a URL shortener that needs to handle 100 million URLs.',
        answer: 'Core table: short_urls(id BIGSERIAL, short_code VARCHAR(8) UNIQUE, original_url TEXT, created_at, expires_at). Index on short_code for O(log n) lookups. Click analytics in url_clicks table or aggregated daily. At 100M scale: Redis cache for hot short codes (most accessed URLs), consistent hashing for distributed cache. Short code generation: base62 encode the auto-increment ID or use a distributed ID generator. Read-heavy workload benefits massively from Redis caching.',
        difficulty: 'advanced',
      },
      {
        question: 'How would you design a notification system?',
        answer: 'Tables: notifications(id, user_id, type, title, body, data JSONB, read BOOLEAN, created_at). Indexes: (user_id, read, created_at DESC) for "get unread notifications." For delivery: push events via Redis pub/sub or WebSocket. Notification preferences table: users can mute specific notification types. Batch marking as read: UPDATE notifications SET read = true WHERE user_id = $1 AND id = ANY($2). Consider partitioning by created_at for tables with billions of rows.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'db-ex-21-1',
        title: 'Design Twitter (X) database',
        description: 'Design the complete Twitter database with tweets, follows, likes, retweets, and a timeline. Pay attention to the timeline generation strategy.',
        starterCode: `-- Design Twitter's database:
-- Users (username, bio, follower_count)
-- Tweets (content, media, reply_to for threads)
-- Follows (follower → following)
-- Likes (user → tweet)
-- Retweets

-- Then answer:
-- How would you generate a user's timeline?
-- (tweets from all the people they follow, newest first)
-- What are the two strategies? What are their tradeoffs?

-- Write CREATE TABLE statements and explain the timeline strategy:`,
        solution: `CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username        VARCHAR(15) UNIQUE NOT NULL,
  display_name    VARCHAR(50),
  bio             VARCHAR(160),
  avatar_url      VARCHAR(500),
  follower_count  INT DEFAULT 0,   -- denormalized
  following_count INT DEFAULT 0,
  tweet_count     INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tweets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  content      VARCHAR(280),
  media_urls   TEXT[],
  reply_to_id  UUID REFERENCES tweets(id),   -- for thread replies
  retweet_of_id UUID REFERENCES tweets(id),  -- for retweets
  like_count   INT DEFAULT 0,    -- denormalized
  retweet_count INT DEFAULT 0,
  reply_count  INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tweets_user ON tweets(user_id, created_at DESC);

CREATE TABLE follows (
  follower_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);
CREATE INDEX idx_follows_following ON follows(following_id);  -- "who follows me?"
CREATE INDEX idx_follows_follower ON follows(follower_id);    -- "who do I follow?"

CREATE TABLE likes (
  tweet_id   UUID REFERENCES tweets(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (tweet_id, user_id)
);

-- Timeline Strategy 1: Fan-out on Read (Pull model)
-- On timeline request:
-- SELECT t.* FROM tweets t
-- JOIN follows f ON t.user_id = f.following_id
-- WHERE f.follower_id = $userId
-- ORDER BY t.created_at DESC LIMIT 20;
-- Pro: simple, no extra storage. Con: slow for users following 10,000 people.

-- Timeline Strategy 2: Fan-out on Write (Push model) — Twitter's approach
-- When a user tweets, push tweet_id to all followers' timeline caches (Redis sorted set).
-- On timeline request: ZREVRANGE timeline:userId 0 19
-- Pro: instant timeline reads. Con: huge write amplification for popular accounts.
-- Solution: hybrid — fan-out for regular users, fan-out-on-read for celebrities.`,
        hints: [
          'Denormalize like_count and retweet_count on the tweet for fast display',
          'Fan-out on write = push tweet to followers on creation (Twitter\'s actual approach)',
          'Fan-out on read = query follows table on every timeline request (simpler but slower)',
        ],
      },
    ],
    keyTakeaways: [
      'Practice design challenges with a timer — real interviews are time-pressured.',
      'Always think about the read patterns when designing schema.',
      'Denormalize counts (likes, followers) for frequently-displayed numbers.',
      'Twitter uses fan-out on write for timeline generation — push tweet IDs to Redis sorted sets.',
      'WhatsApp uses one conversations table for DMs and groups (differentiated by type column).',
      'Soft deletes (deleted_at, deleted_for_all) are safer than hard deletes in social apps.',
      'After completing this track, you can design any database schema and pass any database interview.',
    ],
    prevLesson: 'database-revision',
  },
];
