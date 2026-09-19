import type { Lesson } from '@/types';

export const databaseDesignLesson: Lesson = {
  id: 'database-design',
  slug: 'database-design',
  title: 'Database Design for Applications',
  description:
    'ER diagrams, schema design, relationships, indexing strategy, scaling considerations, and the most common database design mistakes that cause production problems.',
  category: 'Architecture',
  order: 8,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `You already know SQL and database concepts from the Database track. Here you learn how to design a database for a real application — before writing any application code.

Database design decisions are the hardest to change later. A poorly designed schema at the beginning costs ten times more to fix in production than to design correctly upfront.

---

## Why Database Design Comes First

The schema is the contract between your application and your data. When you design correctly:
- Queries are simple and fast
- Data integrity is enforced at the database level
- Adding features is easy (add columns, add tables)
- The application code stays clean

When you design incorrectly:
- Queries require complex workarounds
- Data gets out of sync (user can have orders that reference deleted products)
- Adding features requires schema migration on live data
- Application code is full of defensive checks for bad data states

---

## ER Diagrams

An Entity Relationship (ER) diagram shows what data you store and how entities relate to each other. Always draw this before writing a single CREATE TABLE.

**Symbols:**
\`\`\`
┌──────────┐         ┌──────────┐
│  Entity  │ ───────  │  Entity  │
└──────────┘  relation └──────────┘

1 ── one (exactly one)
n ── many (zero or more)
1..n ── one or more (at least one)
0..1 ── zero or one (optional)
\`\`\`

**Example: Blog Platform ER Diagram**

\`\`\`
┌────────┐     1:n    ┌────────┐    n:m     ┌─────────┐
│  User  │ ─────────  │  Post  │ ──────────  │   Tag   │
└────────┘            └────────┘            └─────────┘
    │                     │
    │ 1:n                 │ 1:n
    ▼                     ▼
┌─────────┐         ┌─────────────┐
│ Profile │         │   Comment   │
└─────────┘         └─────────────┘
                         │
                         │ self-referential 0..1:n
                         ▼
                    (reply to comment)
\`\`\`

Reading this diagram before writing code reveals:
- Users have one profile (1:1)
- Users write many posts (1:n)
- Posts have many comments (1:n)
- Comments can be replies to other comments (self-referential)
- Posts have many tags, tags belong to many posts (n:m — needs a junction table)

---

## Schema Design Principles

### 1. Normalize First

Normalization means storing each piece of information in exactly one place.

\`\`\`sql
-- DENORMALIZED (bad):
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR,        -- duplicated from users
  customer_email VARCHAR,       -- duplicated from users
  product_name VARCHAR,         -- duplicated from products
  product_price DECIMAL,        -- duplicated from products
  quantity INTEGER
);

-- Problems: if customer changes email, old orders show wrong email.
-- If product price changes, should old orders reflect old or new price?

-- NORMALIZED (correct):
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  current_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL  -- snapshot of price at time of purchase
);
\`\`\`

Note: \`price_at_purchase\` is intentionally duplicated — it captures the historical price. This is correct because you need to know what the customer paid, not what the product costs today.

### 2. Use Appropriate Data Types

\`\`\`sql
-- BAD:
user_id VARCHAR,          -- IDs should be integers or UUIDs
price VARCHAR,            -- prices must be DECIMAL
active VARCHAR,           -- booleans should be BOOLEAN
created_at VARCHAR,       -- dates must be TIMESTAMP

-- GOOD:
user_id INTEGER,
user_id UUID DEFAULT gen_random_uuid(),  -- for distributed systems
price DECIMAL(10, 2),     -- exact decimal, not FLOAT (floating point rounding errors)
active BOOLEAN DEFAULT true,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
\`\`\`

### 3. Always Include Timestamps

Every table should have at minimum:
\`\`\`sql
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
\`\`\`

You will always need to know when records were created and last modified.

### 4. Soft Delete vs Hard Delete

Hard delete: \`DELETE FROM users WHERE id = 1\`

Problem: orders reference this user — foreign key violation or orphaned data.

Soft delete: mark as deleted, keep the row.

\`\`\`sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Delete:
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- Query (exclude deleted):
SELECT * FROM users WHERE deleted_at IS NULL;
\`\`\`

Use soft delete when: records are referenced by other tables, you need audit trails, or you might need to recover deleted data.

---

## Relationships in SQL

### One-to-One (1:1)

\`\`\`sql
-- User has one profile
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url TEXT,
  website VARCHAR
);
-- UNIQUE on user_id enforces 1:1
\`\`\`

### One-to-Many (1:n)

\`\`\`sql
-- User has many posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  content TEXT
);
-- FK on author_id without UNIQUE allows multiple posts per user
\`\`\`

### Many-to-Many (n:m) — Junction Table

\`\`\`sql
-- Posts have many tags, tags have many posts
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)   -- composite PK prevents duplicates
);
\`\`\`

### Self-Referential

\`\`\`sql
-- Comments can reply to other comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id),
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,  -- null = top-level
  content TEXT NOT NULL
);
\`\`\`

---

## ON DELETE Behavior

When a referenced record is deleted, what happens to records that reference it?

\`\`\`sql
REFERENCES users(id) ON DELETE CASCADE     -- delete the child record too
REFERENCES users(id) ON DELETE SET NULL    -- set FK to NULL (field must be nullable)
REFERENCES users(id) ON DELETE RESTRICT    -- error: cannot delete if children exist
REFERENCES users(id) ON DELETE NO ACTION   -- same as RESTRICT (default)
\`\`\`

**Guidelines:**
- \`ON DELETE CASCADE\`: child records have no meaning without parent (comments on a deleted post)
- \`ON DELETE SET NULL\`: child can exist independently (post with deleted author — show "Deleted User")
- \`ON DELETE RESTRICT\`: you must manually handle children before deleting parent (accounting records)

---

## Indexing Strategy

You already know what indexes are. Here is how to decide what to index.

**Automatic indexes:**
- Primary keys get an index automatically
- Columns with UNIQUE constraint get an index automatically

**Add indexes for:**
\`\`\`sql
-- Foreign keys used in JOINs
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Columns used in WHERE clauses
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Composite index for common combined queries
CREATE INDEX idx_posts_author_published ON posts(author_id, published);
-- Optimizes: WHERE author_id = $1 AND published = true
\`\`\`

**Do NOT index:**
- Every column — indexes slow down INSERT/UPDATE/DELETE and use storage
- Low-cardinality columns where most queries return many rows (boolean, status with few values)
- Rarely queried columns

**How to know you need an index:**
\`\`\`sql
-- Run EXPLAIN ANALYZE before adding an index
EXPLAIN ANALYZE
SELECT * FROM posts WHERE author_id = 1 ORDER BY created_at DESC LIMIT 20;

-- Look for: Seq Scan (sequential scan = no index, slow on large tables)
-- After adding index: Index Scan (fast)
\`\`\`

---

## Common Application Schemas

**E-commerce:**
\`\`\`sql
users → orders → order_items → products
                                   ↑
                              product_images
                              categories
                              product_categories (junction)
\`\`\`

**Social Media:**
\`\`\`sql
users → posts → comments
  ↓                ↓
follows           likes
  ↓
notifications
\`\`\`

**SaaS / Multi-tenant:**
\`\`\`sql
organizations → teams → members (users)
      ↓
   workspaces → projects → tasks → comments
\`\`\`

---

## Common Mistakes

### 1. Storing Arrays as Comma-Separated Strings

\`\`\`sql
-- BAD:
tags VARCHAR  -- "javascript,react,node"

-- Can't query by tag, can't enforce referential integrity
-- Querying: WHERE tags LIKE '%react%' is a full table scan

-- GOOD: junction table
\`\`\`

### 2. Using VARCHAR for JSON

\`\`\`sql
-- BAD:
settings VARCHAR  -- '{"theme":"dark","notifications":true}'

-- GOOD: use PostgreSQL's JSONB
settings JSONB

-- JSONB supports: indexing, querying individual fields, operators
SELECT * FROM users WHERE settings->>'theme' = 'dark';
CREATE INDEX idx_users_settings_theme ON users((settings->>'theme'));
\`\`\`

### 3. Missing Indexes on Foreign Keys

PostgreSQL does NOT automatically index foreign keys (only MySQL does).

\`\`\`sql
-- After every foreign key, add an index:
CREATE TABLE comments (
  post_id INTEGER REFERENCES posts(id)
  -- ...
);
-- Add this:
CREATE INDEX idx_comments_post_id ON comments(post_id);
\`\`\`

### 4. Not Planning for Scale

If your posts table will have 100M rows, ORDER BY created_at without an index will take minutes.

Design for the scale you expect in 12-18 months, not just launch day.

---

## Schema Migration Workflow

\`\`\`bash
# With Prisma:
# 1. Update schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_tags_to_posts

# With raw SQL (using node-pg-migrate or similar):
# migrations/20240101_add_tags.sql
ALTER TABLE posts ADD COLUMN tags JSONB DEFAULT '[]';
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
\`\`\`

**Golden rules of migrations:**
- Never modify a migration that has already run in production
- Always write the rollback migration (the \`down\` function)
- Test migrations on a copy of production data before running on production
- Large data migrations on live tables must be done in batches`,
  codeExamples: [
    {
      title: 'Complete E-commerce Schema',
      code: `-- Complete e-commerce database schema
-- Following all design principles

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ  -- soft delete
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  category VARCHAR(100),
  images JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  stripe_payment_id VARCHAR,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,  -- price at time of purchase
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES (after all table creation)
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category ON products(category) WHERE active = true;
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);`,
      explanation:
        'This schema uses UUIDs (better for distributed systems), DECIMAL for prices (no floating point errors), JSONB for flexible fields, CHECK constraints for data integrity, and proper ON DELETE behavior for each relationship.',
    },
  ],
  commonMistakes: [
    'Not drawing an ER diagram before writing tables — you will miss relationships',
    'Using FLOAT for prices — floating point arithmetic causes $9.9999999 instead of $10.00, use DECIMAL',
    'Not adding indexes on foreign keys in PostgreSQL — JOINs become sequential scans',
    'Hard deleting records referenced by other tables — causes foreign key violations',
    'Storing arrays as comma-separated strings — prevents efficient querying and referential integrity',
    'Not including timestamps on every table — you will always need to know when records were created',
    'Designing for today only — a schema for 1000 users that breaks at 1,000,000 is a liability',
  ],
  interviewQuestions: [
    {
      question: 'What is database normalization and why is it important?',
      answer:
        'Normalization is storing each piece of information in exactly one place to eliminate redundancy and prevent update anomalies. If a customer\'s email is stored in both the users table and orders table, changing the email in one place leaves old orders with the wrong email. Normalized schemas store the email once in users and reference it with a foreign key. However, some intentional denormalization (like price_at_purchase in order_items) is correct for historical accuracy.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is a junction table and when do you need one?',
      answer:
        'A junction table (also called a join table or pivot table) is needed for many-to-many relationships. Since you cannot store multiple values in a single column, you create a third table with two foreign keys. Example: posts and tags — a post has many tags, a tag belongs to many posts. The post_tags table has post_id and tag_id columns, with a composite primary key preventing duplicate associations.',
      difficulty: 'intermediate',
    },
    {
      question: 'What does ON DELETE CASCADE mean and when should you use it?',
      answer:
        'ON DELETE CASCADE means when the parent record is deleted, all child records referencing it are automatically deleted too. Use it when child records have no meaning without the parent — deleting a post should delete all its comments. Avoid it when child records should survive independently — deleting a user should not delete their published articles (use ON DELETE SET NULL or ON DELETE RESTRICT instead).',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'design-social-schema',
      title: 'Design a Social Media Schema',
      description:
        'Design the database schema for a social media platform (like Twitter). Users can post tweets, follow other users, like tweets, and reply to tweets. Include proper indexes.',
      starterCode: `-- Draw your ER diagram first (in comments), then write the schema

-- ENTITIES:
-- User
-- Tweet
-- Follow (user follows user)
-- Like (user likes tweet)
-- Indexes

-- ER DIAGRAM:
-- User ─── ? ──── Tweet
-- User ─── ? ──── User
-- User ─── ? ──── Tweet (likes)

-- SCHEMA:
CREATE TABLE users (
  -- ...
);

-- Continue...`,
      solution: `-- ER DIAGRAM:
-- User 1:n Tweet (user writes many tweets)
-- User n:m User via follows (user follows many users)
-- User n:m Tweet via likes (user likes many tweets)
-- Tweet 0..1:n Tweet via parent_id (tweet replies to another tweet)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  followers_count INTEGER DEFAULT 0,  -- denormalized for performance
  following_count INTEGER DEFAULT 0,
  tweet_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content VARCHAR(280) NOT NULL,
  parent_id UUID REFERENCES tweets(id) ON DELETE CASCADE,  -- null = top-level tweet
  like_count INTEGER DEFAULT 0,    -- denormalized counter
  reply_count INTEGER DEFAULT 0,   -- denormalized counter
  retweet_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)  -- can't follow yourself
);

CREATE TABLE likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tweet_id UUID REFERENCES tweets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, tweet_id)  -- prevents duplicate likes
);

-- INDEXES
CREATE INDEX idx_tweets_author_id ON tweets(author_id);
CREATE INDEX idx_tweets_created_at ON tweets(created_at DESC);
CREATE INDEX idx_tweets_parent_id ON tweets(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_likes_tweet_id ON likes(tweet_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);`,
      hints: [
        'Draw the relationships first — who can follow whom? Can you follow yourself?',
        'Think about which counts you query often — denormalized counters avoid expensive COUNT() queries',
        'Composite PRIMARY KEY on junction tables prevents duplicate relationships',
        'Add a CHECK constraint to prevent illogical states (following yourself)',
      ],
    },
  ],
  keyTakeaways: [
    'Design the schema before writing application code — database changes are expensive in production',
    'ER diagrams reveal relationships and prevent missing tables (junction tables for n:m)',
    'Normalize to store each fact in one place; intentional denormalization (counters, price snapshots) is valid',
    'ON DELETE behavior: CASCADE for dependent children, SET NULL for independent children, RESTRICT for critical data',
    'PostgreSQL does not auto-index foreign keys — add indexes manually after every FK definition',
    'Use DECIMAL for money (not FLOAT), TIMESTAMPTZ for dates, JSONB for flexible fields',
    'Always include created_at and updated_at on every table',
  ],
  nextLesson: 'authentication-systems',
  prevLesson: 'backend-architecture',
};
