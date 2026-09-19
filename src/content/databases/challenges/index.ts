import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  // ─── SQL BASICS ────────────────────────────────────────────────────────────
  {
    id: 'db-select-all-users',
    slug: 'select-all-users',
    title: 'Select All Users',
    description: 'Write a SQL query to retrieve all columns from the users table.',
    difficulty: 'beginner',
    topic: 'SQL Basics',
    starterCode: `-- Table: users
-- Columns: id, name, email, created_at

-- Write a query to fetch all users:`,
    solution: `SELECT * FROM users;`,
    hints: [
      'Use SELECT to choose columns',
      '* means all columns',
      'FROM specifies the table',
    ],
    explanation: 'SELECT * FROM users; retrieves every row and every column from the users table. The * is a wildcard meaning "all columns". In production code prefer listing column names explicitly for clarity and performance.',
    tags: ['sql', 'select', 'beginner'],
  },
  {
    id: 'db-filter-active-users',
    slug: 'filter-active-users',
    title: 'Filter Active Users',
    description: 'Retrieve only users where the is_active column is true and order them by name alphabetically.',
    difficulty: 'beginner',
    topic: 'SQL Basics',
    starterCode: `-- Table: users
-- Columns: id, name, email, is_active, created_at

-- Fetch active users ordered by name:`,
    solution: `SELECT id, name, email
FROM users
WHERE is_active = true
ORDER BY name ASC;`,
    hints: [
      'Use WHERE to filter rows',
      'Use ORDER BY to sort results',
      'ASC = ascending (A to Z), DESC = descending (Z to A)',
    ],
    explanation: 'WHERE filters rows before they are returned. ORDER BY sorts the result set. ASC is the default sort direction but it is good practice to be explicit. Listing only needed columns (id, name, email) instead of * is a best practice.',
    tags: ['sql', 'where', 'order-by', 'beginner'],
  },
  {
    id: 'db-count-users',
    slug: 'count-users-by-status',
    title: 'Count Users by Status',
    description: 'Count how many users are active and how many are inactive. Return two rows: one for each status.',
    difficulty: 'beginner',
    topic: 'SQL Basics',
    starterCode: `-- Table: users
-- Columns: id, name, email, is_active

-- Count users grouped by is_active status:`,
    solution: `SELECT is_active, COUNT(*) AS user_count
FROM users
GROUP BY is_active;`,
    hints: [
      'Use COUNT(*) to count rows',
      'Use GROUP BY to group rows with the same value',
      'AS gives the counted column an alias',
    ],
    explanation: 'GROUP BY groups all rows with the same is_active value together. COUNT(*) counts how many rows exist in each group. AS user_count gives the result column a readable name. This is the foundation of aggregate queries.',
    tags: ['sql', 'group-by', 'count', 'aggregate', 'beginner'],
  },
  {
    id: 'db-insert-user',
    slug: 'insert-a-user',
    title: 'Insert a New User',
    description: 'Insert a new user into the users table with name "Alice", email "alice@example.com", and is_active set to true.',
    difficulty: 'beginner',
    topic: 'SQL Basics',
    starterCode: `-- Table: users
-- Columns: id (auto-generated), name, email, is_active, created_at (auto-generated)

-- Insert Alice:`,
    solution: `INSERT INTO users (name, email, is_active)
VALUES ('Alice', 'alice@example.com', true);`,
    hints: [
      'INSERT INTO specifies the table and which columns to fill',
      'VALUES provides the data in the same order as the column list',
      'Skip auto-generated columns (id, created_at)',
    ],
    explanation: 'INSERT INTO specifies the table and the columns you are providing values for. VALUES lists the values in the same order as the columns. Auto-generated columns (id with SERIAL/AUTO_INCREMENT, created_at with DEFAULT NOW()) are omitted — the database fills them in.',
    tags: ['sql', 'insert', 'beginner'],
  },
  {
    id: 'db-update-email',
    slug: 'update-user-email',
    title: 'Update a User\'s Email',
    description: 'Update the email of the user with id = 5 to "newemail@example.com".',
    difficulty: 'beginner',
    topic: 'SQL Basics',
    starterCode: `-- Table: users
-- Columns: id, name, email, is_active

-- Update email for user with id = 5:`,
    solution: `UPDATE users
SET email = 'newemail@example.com'
WHERE id = 5;`,
    hints: [
      'UPDATE specifies the table',
      'SET specifies the column and new value',
      'WHERE limits which rows are changed — ALWAYS include WHERE with UPDATE',
    ],
    explanation: 'UPDATE without WHERE updates EVERY row in the table — a common and catastrophic mistake. Always include a WHERE clause to target specific rows. SET can update multiple columns at once: SET email = \'...\', name = \'...\'.',
    tags: ['sql', 'update', 'beginner'],
  },

  // ─── JOINS ──────────────────────────────────────────────────────────────────
  {
    id: 'db-inner-join-orders',
    slug: 'join-users-and-orders',
    title: 'Join Users and Orders',
    description: 'Retrieve a list of all orders with the customer\'s name and email. Use an INNER JOIN between the users and orders tables.',
    difficulty: 'intermediate',
    topic: 'Joins',
    starterCode: `-- Table: users
-- Columns: id, name, email

-- Table: orders
-- Columns: id, user_id, product, amount, created_at

-- Get each order with the user's name and email:`,
    solution: `SELECT
  o.id AS order_id,
  u.name AS customer_name,
  u.email,
  o.product,
  o.amount,
  o.created_at
FROM orders o
INNER JOIN users u ON u.id = o.user_id
ORDER BY o.created_at DESC;`,
    hints: [
      'INNER JOIN returns only rows where the join condition matches in both tables',
      'ON specifies how to match rows between tables',
      'Use table aliases (o, u) to avoid writing full table names repeatedly',
    ],
    explanation: 'INNER JOIN combines rows from two tables where the ON condition matches. Orders without a matching user (orphaned records) are excluded. The table alias o and u shorten the query. This is the most common join type — use it when you need data from both tables and both sides must exist.',
    tags: ['sql', 'join', 'inner-join', 'intermediate'],
  },
  {
    id: 'db-left-join-no-orders',
    slug: 'find-users-with-no-orders',
    title: 'Find Users With No Orders',
    description: 'Find all users who have never placed an order. Use a LEFT JOIN and filter for NULL.',
    difficulty: 'intermediate',
    topic: 'Joins',
    starterCode: `-- Table: users
-- Columns: id, name, email

-- Table: orders
-- Columns: id, user_id, product, amount

-- Find users who have ZERO orders:`,
    solution: `SELECT u.id, u.name, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
    hints: [
      'LEFT JOIN keeps ALL users, even those with no matching orders',
      'When there is no matching order, the orders columns will be NULL',
      'Filter WHERE o.id IS NULL to keep only users with no orders',
    ],
    explanation: 'LEFT JOIN keeps all rows from the left table (users) and fills in NULLs for columns from the right table (orders) when there is no match. Filtering WHERE o.id IS NULL isolates users who have no orders at all. This is the standard pattern for "find records with no related records".',
    tags: ['sql', 'left-join', 'null', 'intermediate'],
  },
  {
    id: 'db-aggregation-top-spenders',
    slug: 'top-spenders',
    title: 'Find Top Spenders',
    description: 'Find the top 5 users by total amount spent across all their orders. Show the user\'s name and total spent, sorted highest first.',
    difficulty: 'intermediate',
    topic: 'Joins',
    starterCode: `-- Table: users
-- Columns: id, name, email

-- Table: orders
-- Columns: id, user_id, amount

-- Get top 5 users by total amount spent:`,
    solution: `SELECT
  u.name,
  SUM(o.amount) AS total_spent
FROM users u
INNER JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY total_spent DESC
LIMIT 5;`,
    hints: [
      'JOIN users and orders on user_id',
      'GROUP BY user to aggregate per user',
      'SUM(o.amount) totals each user\'s orders',
      'LIMIT 5 returns only the top 5',
    ],
    explanation: 'This combines JOIN + GROUP BY + aggregate functions. INNER JOIN links users to orders. GROUP BY u.id, u.name groups all orders per user. SUM(o.amount) totals each group. ORDER BY total_spent DESC puts the highest spenders first. LIMIT 5 trims the result to 5 rows.',
    tags: ['sql', 'join', 'group-by', 'sum', 'limit', 'intermediate'],
  },

  // ─── INDEXES ────────────────────────────────────────────────────────────────
  {
    id: 'db-create-index',
    slug: 'create-an-index',
    title: 'Create an Index',
    description: 'The users table has 10 million rows and queries filtering by email are slow. Write the SQL to create an index on the email column.',
    difficulty: 'intermediate',
    topic: 'Indexing',
    starterCode: `-- Table: users (10 million rows)
-- Columns: id, name, email, created_at

-- This query is slow:
-- SELECT * FROM users WHERE email = 'alice@example.com';

-- Create an index to speed it up:`,
    solution: `CREATE INDEX idx_users_email ON users(email);

-- For uniqueness (email should be unique):
CREATE UNIQUE INDEX idx_users_email ON users(email);`,
    hints: [
      'CREATE INDEX index_name ON table(column)',
      'If email must be unique, use CREATE UNIQUE INDEX',
      'Index names conventionally start with idx_',
    ],
    explanation: 'Without an index, the database scans all 10 million rows (full table scan) for every email lookup — O(n). With a B-tree index on email, the lookup is O(log n) — milliseconds instead of seconds. A UNIQUE index also enforces uniqueness as a constraint. Indexes speed up reads but slightly slow down writes (INSERT, UPDATE, DELETE must update the index too).',
    tags: ['sql', 'index', 'performance', 'intermediate'],
  },
  {
    id: 'db-composite-index',
    slug: 'composite-index',
    title: 'When to Use a Composite Index',
    description: 'Your app frequently queries orders by both user_id AND status together. Should you create two separate indexes or one composite index? Write the correct CREATE INDEX statement.',
    difficulty: 'intermediate',
    topic: 'Indexing',
    starterCode: `-- Table: orders
-- Columns: id, user_id, status, amount, created_at

-- Frequent query:
-- SELECT * FROM orders WHERE user_id = 42 AND status = 'pending';

-- Option A: Two separate indexes
-- CREATE INDEX idx_orders_user_id ON orders(user_id);
-- CREATE INDEX idx_orders_status ON orders(status);

-- Option B: One composite index
-- ???

-- Which is better and why? Write the correct statement:`,
    solution: `-- A composite index is better for this query:
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- This index can answer:
-- WHERE user_id = 42 AND status = 'pending'  ✓ uses both columns
-- WHERE user_id = 42                          ✓ uses first column (leftmost prefix)
-- WHERE status = 'pending'                    ✗ CANNOT use this index alone`,
    hints: [
      'A composite index can answer queries that use the leftmost prefix of columns',
      'The most selective column (user_id) should usually come first',
      'A composite index is more efficient than two separate indexes for AND queries',
    ],
    explanation: 'A composite index on (user_id, status) is more efficient than two separate indexes because the database can satisfy the entire WHERE clause with a single index scan. The leftmost prefix rule: this index also helps queries filtering by user_id alone. But it cannot help queries filtering only on status — for those you would still need a separate status index.',
    tags: ['sql', 'index', 'composite-index', 'performance', 'intermediate'],
  },

  // ─── TRANSACTIONS ────────────────────────────────────────────────────────────
  {
    id: 'db-bank-transfer',
    slug: 'bank-transfer-transaction',
    title: 'Bank Transfer with Transaction',
    description: 'Write a SQL transaction to transfer $100 from account 1 to account 2. Both the debit and credit must succeed together, or neither should happen.',
    difficulty: 'intermediate',
    topic: 'Transactions',
    starterCode: `-- Table: accounts
-- Columns: id, owner_name, balance

-- Transfer $100 from account id=1 to account id=2
-- This must be atomic — both updates succeed or neither does:`,
    solution: `BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;

-- If anything goes wrong, use:
-- ROLLBACK;
-- to undo both updates`,
    hints: [
      'BEGIN starts a transaction',
      'COMMIT saves all changes permanently',
      'ROLLBACK undoes all changes in the transaction',
      'Both updates are invisible to other queries until COMMIT',
    ],
    explanation: 'A transaction groups multiple SQL statements into one atomic unit. Either ALL statements succeed (COMMIT) or ALL are undone (ROLLBACK). Without a transaction, if the server crashes after the debit but before the credit, account 1 loses $100 and account 2 never receives it. Transactions enforce Atomicity — the A in ACID.',
    tags: ['sql', 'transaction', 'acid', 'intermediate'],
  },

  // ─── SCHEMA DESIGN ──────────────────────────────────────────────────────────
  {
    id: 'db-design-blog-schema',
    slug: 'design-blog-schema',
    title: 'Design a Blog Database Schema',
    description: 'Design the SQL schema for a blog with users, posts, comments, and tags. Include primary keys, foreign keys, and appropriate data types.',
    difficulty: 'intermediate',
    topic: 'Schema Design',
    starterCode: `-- Design tables for a blog with:
-- 1. Users (who write posts and comments)
-- 2. Posts (belong to a user)
-- 3. Comments (belong to a post and a user)
-- 4. Tags (posts can have many tags, tags can be on many posts)

-- Write CREATE TABLE statements:`,
    solution: `CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  content    TEXT NOT NULL,
  published  BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  post_id    INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Junction table: many-to-many between posts and tags
CREATE TABLE post_tags (
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);`,
    hints: [
      'Use SERIAL for auto-incrementing IDs',
      'Foreign keys use REFERENCES table(column)',
      'Many-to-many relationships need a junction table',
      'ON DELETE CASCADE deletes child rows when the parent is deleted',
    ],
    explanation: 'This schema demonstrates the most common patterns: SERIAL for auto-IDs, NOT NULL for required fields, UNIQUE for fields that must not repeat, REFERENCES for foreign keys, and a junction table (post_tags) for the many-to-many relationship between posts and tags. ON DELETE CASCADE automatically removes comments/tags when a post is deleted.',
    tags: ['sql', 'schema', 'foreign-key', 'many-to-many', 'intermediate'],
  },

  // ─── ADVANCED QUERIES ───────────────────────────────────────────────────────
  {
    id: 'db-subquery-above-average',
    slug: 'above-average-orders',
    title: 'Find Above-Average Orders',
    description: 'Find all orders where the amount is greater than the average order amount. Use a subquery.',
    difficulty: 'advanced',
    topic: 'Advanced Queries',
    starterCode: `-- Table: orders
-- Columns: id, user_id, product, amount

-- Find orders where amount > average amount across all orders:`,
    solution: `SELECT id, user_id, product, amount
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders)
ORDER BY amount DESC;`,
    hints: [
      'A subquery inside WHERE calculates the average first',
      'AVG() returns the average of all values',
      'The subquery runs once, then each row is compared to it',
    ],
    explanation: 'The subquery (SELECT AVG(amount) FROM orders) calculates the average once. The outer query then compares each order\'s amount against that average. Subqueries in WHERE are powerful for threshold comparisons. For complex cases, a CTE (WITH clause) is more readable than nested subqueries.',
    tags: ['sql', 'subquery', 'avg', 'advanced'],
  },
  {
    id: 'db-window-function-rank',
    slug: 'rank-users-by-spending',
    title: 'Rank Users by Spending',
    description: 'Rank all users by their total spending using a window function. Show each user\'s name, total spent, and their rank.',
    difficulty: 'advanced',
    topic: 'Advanced Queries',
    starterCode: `-- Table: users: id, name, email
-- Table: orders: id, user_id, amount

-- Rank users by total spending (highest = rank 1):`,
    solution: `SELECT
  u.name,
  SUM(o.amount) AS total_spent,
  RANK() OVER (ORDER BY SUM(o.amount) DESC) AS spending_rank
FROM users u
INNER JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY spending_rank;`,
    hints: [
      'RANK() OVER (...) is a window function',
      'ORDER BY inside OVER() determines the ranking order',
      'GROUP BY is still needed to aggregate orders per user',
    ],
    explanation: 'Window functions like RANK() operate across a set of rows related to the current row without collapsing them like GROUP BY does. RANK() OVER (ORDER BY SUM(o.amount) DESC) assigns rank 1 to the highest spender. If two users tie, they get the same rank and the next rank is skipped (1, 1, 3). Use DENSE_RANK() to avoid gaps.',
    tags: ['sql', 'window-function', 'rank', 'advanced'],
  },
  {
    id: 'db-explain-query',
    slug: 'analyze-a-slow-query',
    title: 'Analyze a Slow Query',
    description: 'A query runs in 8 seconds on a table with 5 million rows. Use EXPLAIN ANALYZE to understand why and suggest a fix.',
    difficulty: 'advanced',
    topic: 'Advanced Queries',
    starterCode: `-- Table: orders (5 million rows)
-- Columns: id, user_id, status, amount, created_at
-- No indexes except PRIMARY KEY on id

-- This query takes 8 seconds:
SELECT * FROM orders WHERE status = 'pending' AND user_id = 42;

-- Step 1: Use EXPLAIN ANALYZE to understand the execution plan:

-- Step 2: Identify the problem from the output:

-- Step 3: Write the fix:`,
    solution: `-- Step 1: Analyze the query
EXPLAIN ANALYZE
SELECT * FROM orders WHERE status = 'pending' AND user_id = 42;

-- Typical slow output shows:
-- Seq Scan on orders (cost=0.00..124000.00 rows=5000000)
-- "Seq Scan" = full table scan — reads ALL 5 million rows!
-- This is the problem.

-- Step 2: The problem is a Seq Scan due to missing indexes

-- Step 3: Fix — create a composite index
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- After the index, EXPLAIN ANALYZE shows:
-- Index Scan using idx_orders_user_status on orders
-- Much faster — reads only matching rows`,
    hints: [
      'EXPLAIN ANALYZE shows the actual execution plan',
      'Seq Scan means full table scan — reads every row',
      'Index Scan means the database used an index — much faster',
      'A composite index covers both WHERE conditions at once',
    ],
    explanation: 'EXPLAIN ANALYZE is the single most important tool for query optimization. "Seq Scan" reveals the database is reading all 5 million rows. Creating an index on (user_id, status) turns this into an Index Scan that reads only the matching rows. Always check EXPLAIN ANALYZE before and after adding an index to confirm improvement.',
    tags: ['sql', 'explain', 'performance', 'index', 'advanced'],
  },

  // ─── NOSQL / REDIS ──────────────────────────────────────────────────────────
  {
    id: 'db-redis-caching',
    slug: 'redis-cache-pattern',
    title: 'Redis Cache-Aside Pattern',
    description: 'Write the cache-aside pattern for fetching a user profile: check Redis first, fall back to the database, and cache the result with a 10-minute TTL.',
    difficulty: 'intermediate',
    topic: 'Redis & Caching',
    starterCode: `// Pseudo-code / Node.js style
// You have: redis client and db (PostgreSQL) client

async function getUserProfile(userId) {
  // 1. Check Redis cache first
  // 2. If found (cache hit): return cached value
  // 3. If not found (cache miss): fetch from database
  // 4. Store in Redis with 10-minute TTL
  // 5. Return the data
}`,
    solution: `async function getUserProfile(userId) {
  const cacheKey = \`user:\${userId}\`;

  // 1. Check Redis cache
  const cached = await redis.get(cacheKey);

  // 2. Cache hit — return immediately (no DB query)
  if (cached) {
    return JSON.parse(cached);
  }

  // 3. Cache miss — fetch from database
  const user = await db.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [userId]
  );

  if (!user) return null;

  // 4. Store in Redis with 10-minute TTL (600 seconds)
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 600);

  // 5. Return the data
  return user;
}`,
    hints: [
      'Cache key should be specific: user:123 not just "user"',
      'Parse JSON when reading from Redis (Redis stores strings)',
      'EX sets expiry in seconds — 600 seconds = 10 minutes',
      'Always handle the cache miss case (go to database)',
    ],
    explanation: 'Cache-aside (lazy loading) is the most common caching pattern. The app is responsible for loading data into the cache. On a cache miss, data is fetched from the DB and stored in Redis with a TTL. The TTL (Time To Live) ensures stale data eventually expires. This pattern reduces DB load dramatically for frequently-read data like user profiles.',
    tags: ['redis', 'caching', 'cache-aside', 'performance', 'intermediate'],
  },

  // ─── MONGODB ────────────────────────────────────────────────────────────────
  {
    id: 'db-mongodb-find',
    slug: 'mongodb-query-active-users',
    title: 'MongoDB: Query Active Users',
    description: 'Write a MongoDB query to find all users where isActive is true and age is greater than 25, returning only name and email fields, sorted by name.',
    difficulty: 'beginner',
    topic: 'MongoDB',
    starterCode: `// Collection: users
// Document shape: { _id, name, email, age, isActive, createdAt }

// Find active users older than 25, return name + email, sort by name:
db.users.find(
  // filter here,
  // projection here
)`,
    solution: `db.users.find(
  {
    isActive: true,
    age: { $gt: 25 }
  },
  {
    name: 1,
    email: 1,
    _id: 0
  }
).sort({ name: 1 });`,
    hints: [
      '$gt means "greater than" in MongoDB query operators',
      'The second argument to find() is the projection (which fields to return)',
      '1 in projection = include, 0 = exclude',
      '.sort({ name: 1 }) sorts ascending',
    ],
    explanation: 'MongoDB\'s find() takes a filter document and an optional projection. $gt is a comparison operator. The projection { name: 1, email: 1, _id: 0 } returns only name and email, explicitly excluding _id (it is included by default unless you set it to 0). sort({ name: 1 }) sorts ascending; -1 would be descending.',
    tags: ['mongodb', 'find', 'query', 'beginner'],
  },
  {
    id: 'db-mongodb-aggregation',
    slug: 'mongodb-count-by-country',
    title: 'MongoDB: Count Users by Country',
    description: 'Use MongoDB\'s aggregation pipeline to count how many users exist per country, sorted by count descending.',
    difficulty: 'intermediate',
    topic: 'MongoDB',
    starterCode: `// Collection: users
// Document shape: { _id, name, email, country, createdAt }

// Count users per country, highest count first:
db.users.aggregate([
  // pipeline stages here
])`,
    solution: `db.users.aggregate([
  {
    $group: {
      _id: '$country',
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $project: {
      country: '$_id',
      count: 1,
      _id: 0
    }
  }
]);`,
    hints: [
      '$group is like SQL\'s GROUP BY',
      '$sum: 1 counts one for each document in the group',
      '$sort: { count: -1 } sorts descending',
      '$project renames _id to country for cleaner output',
    ],
    explanation: 'The aggregation pipeline processes documents through stages in sequence. $group groups documents by country and counts them with $sum: 1. $sort orders the results by count descending. $project renames _id (the group key) to country for readable output. This pipeline is equivalent to SQL\'s SELECT country, COUNT(*) FROM users GROUP BY country ORDER BY count DESC.',
    tags: ['mongodb', 'aggregation', 'group', 'intermediate'],
  },
];
