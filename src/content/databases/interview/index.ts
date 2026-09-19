import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // ─── SQL BASICS ─────────────────────────────────────────────────────────────
  {
    question: 'What is a database and why do we use them instead of files?',
    answer: 'A database is an organized collection of structured data that can be efficiently accessed, managed, and updated. We use databases over files because they handle concurrent access safely (multiple users reading/writing without corruption), provide fast search via indexes (milliseconds vs seconds for file scans), enforce data integrity with constraints and types, support transactions (atomic operations), and offer query languages like SQL to extract exactly the data you need.',
    difficulty: 'beginner',
    tip: 'Mention concurrency, speed, integrity, and transactions — those are the four core advantages.',
  },
  {
    question: 'What is the difference between SQL and NoSQL databases?',
    answer: 'SQL (relational) databases store data in structured tables with fixed schemas, use SQL for queries, and enforce ACID transactions — examples: PostgreSQL, MySQL, SQLite. NoSQL databases use flexible schemas and store data as documents (MongoDB), key-value pairs (Redis), column families (Cassandra), or graphs (Neo4j). SQL is best for complex relationships and data integrity. NoSQL is best for massive scale, unstructured data, or when schema flexibility matters. PostgreSQL is the most versatile choice for most applications.',
    difficulty: 'beginner',
    followUp: ['When would you choose NoSQL over SQL?', 'Can you use both in the same app?'],
    tip: 'The answer is not "one is better" — they solve different problems.',
  },
  {
    question: 'What are the main SQL commands and how are they categorized?',
    answer: 'SQL commands are grouped into: DDL (Data Definition Language) — CREATE, ALTER, DROP, TRUNCATE — modify schema structure. DML (Data Manipulation Language) — SELECT, INSERT, UPDATE, DELETE — manipulate data. DCL (Data Control Language) — GRANT, REVOKE — manage permissions. TCL (Transaction Control Language) — COMMIT, ROLLBACK, SAVEPOINT — manage transactions.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between WHERE and HAVING?',
    answer: 'WHERE filters rows BEFORE grouping — it operates on individual rows. HAVING filters groups AFTER GROUP BY — it operates on aggregated results. You cannot use aggregate functions (COUNT, SUM, AVG) in WHERE. Example: WHERE salary > 50000 filters employees before grouping. HAVING COUNT(*) > 5 filters departments with more than 5 employees after the GROUP BY.',
    difficulty: 'beginner',
    tip: 'WHERE = before GROUP BY, HAVING = after GROUP BY. This comes up often.',
    followUp: ['Can you use WHERE and HAVING in the same query?'],
  },
  {
    question: 'What is the difference between DELETE, TRUNCATE, and DROP?',
    answer: 'DELETE removes specific rows based on a WHERE clause, can be rolled back, fires triggers, and is slower (row-by-row). TRUNCATE removes ALL rows instantly, cannot be rolled back in most databases, does not fire row-level triggers, and resets auto-increment. DROP removes the entire table structure along with all data — the table no longer exists. Use DELETE for targeted removal, TRUNCATE to empty a table, DROP to remove the table entirely.',
    difficulty: 'beginner',
    followUp: ['Is TRUNCATE faster than DELETE? Why?'],
  },
  {
    question: 'What is normalization and what are the normal forms?',
    answer: 'Normalization is the process of organizing a database to reduce data redundancy and improve integrity. First Normal Form (1NF): each cell has one value, no repeating groups. Second Normal Form (2NF): 1NF + no partial dependencies (every non-key column depends on the entire primary key). Third Normal Form (3NF): 2NF + no transitive dependencies (non-key columns depend only on the primary key, not on other non-key columns). Most production databases target 3NF. Denormalization is sometimes done intentionally for read performance.',
    difficulty: 'intermediate',
    followUp: ['When is denormalization acceptable?', 'What is BCNF?'],
  },

  // ─── JOINS ──────────────────────────────────────────────────────────────────
  {
    question: 'Explain the different types of JOINs in SQL.',
    answer: 'INNER JOIN: returns only rows where the join condition matches in BOTH tables — the most common join. LEFT JOIN (LEFT OUTER JOIN): returns ALL rows from the left table, with NULLs for unmatched right table columns. RIGHT JOIN: opposite of LEFT JOIN — all rows from the right. FULL OUTER JOIN: returns all rows from both tables, NULLs where no match. CROSS JOIN: cartesian product — every row from left combined with every row from right (rarely used). SELF JOIN: joining a table to itself — useful for hierarchies.',
    difficulty: 'beginner',
    followUp: ['When would you use a FULL OUTER JOIN?', 'How do you find rows with no match using a LEFT JOIN?'],
    tip: 'INNER = only matched rows. LEFT = all left rows. The interview classic is "find users with no orders" using LEFT JOIN + WHERE right.id IS NULL.',
  },
  {
    question: 'How do you find records in one table that have no matching records in another?',
    answer: 'Use LEFT JOIN + WHERE right_table.id IS NULL. Example: SELECT u.* FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL — finds users who have placed no orders. This is more efficient than NOT IN (which handles NULLs poorly) and often faster than NOT EXISTS for large datasets in PostgreSQL.',
    difficulty: 'intermediate',
    tip: 'This is one of the most common SQL interview questions. Know it cold.',
  },
  {
    question: 'What is a self join and when would you use it?',
    answer: 'A self join is when a table is joined to itself using table aliases. Use it for hierarchical data in a single table. Classic example: an employees table with a manager_id column that references the same table\'s id. SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON m.id = e.manager_id — this shows each employee with their manager\'s name from the same table.',
    difficulty: 'intermediate',
  },

  // ─── INDEXES ────────────────────────────────────────────────────────────────
  {
    question: 'What is a database index and how does it work?',
    answer: 'An index is a data structure (usually a B-tree) that stores a sorted copy of one or more column values, along with pointers to the actual rows. Without an index, the database scans every row (full table scan) — O(n). With a B-tree index, it finds the target value in O(log n) — milliseconds for millions of rows. Indexes dramatically speed up reads but slightly slow down writes (INSERT, UPDATE, DELETE must update the index too). Primary keys are automatically indexed.',
    difficulty: 'beginner',
    followUp: ['What is the cost of having too many indexes?', 'What is a covering index?'],
    tip: 'Think of it like a book index — instead of reading every page to find "concurrency", you look it up in the index at the back.',
  },
  {
    question: 'When should you create an index and when should you avoid it?',
    answer: 'CREATE an index on: columns frequently used in WHERE clauses, columns used in JOIN conditions, columns used in ORDER BY or GROUP BY, foreign key columns. AVOID indexes on: columns with low cardinality (e.g., boolean is_active — only 2 values, index rarely helps), small tables (full scan is faster), columns that are rarely queried, columns that are updated very frequently (each write updates the index). Rule of thumb: index every foreign key and every column you frequently filter on.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is a composite index and what is the leftmost prefix rule?',
    answer: 'A composite index covers multiple columns: CREATE INDEX idx ON orders(user_id, status). The leftmost prefix rule: the index can be used for queries that filter on the LEFTMOST columns. An index on (user_id, status) helps: WHERE user_id = 1, WHERE user_id = 1 AND status = "pending". It does NOT help: WHERE status = "pending" alone (no leading user_id). Always put the most selective column first, and columns used in equality conditions before range conditions.',
    difficulty: 'intermediate',
    followUp: ['What is index selectivity?'],
  },
  {
    question: 'What is EXPLAIN / EXPLAIN ANALYZE and how do you use it?',
    answer: 'EXPLAIN shows the query execution plan — how the database PLANS to execute a query. EXPLAIN ANALYZE actually runs the query and shows real timings. Key things to look for: "Seq Scan" (full table scan) = missing index. "Index Scan" = index is being used. "cost=X..Y" = estimated cost. "actual time=X..Y" = real time in ms. "rows=N" = estimated vs actual rows. Use it when a query is slow to understand why and identify which indexes are missing or which are being used.',
    difficulty: 'intermediate',
    tip: 'Run EXPLAIN ANALYZE before and after adding an index to confirm improvement.',
  },

  // ─── TRANSACTIONS & ACID ────────────────────────────────────────────────────
  {
    question: 'What are ACID properties?',
    answer: 'ACID guarantees database reliability for transactions: Atomicity — a transaction is all-or-nothing (either all operations succeed or all are rolled back). Consistency — a transaction brings the database from one valid state to another, never violating constraints. Isolation — concurrent transactions do not interfere with each other (each sees a consistent snapshot). Durability — once committed, data survives crashes (written to disk, not just memory). PostgreSQL and MySQL (InnoDB) are fully ACID-compliant.',
    difficulty: 'beginner',
    followUp: ['What does BASE mean in contrast to ACID?', 'What is the cost of full ACID compliance?'],
    tip: 'Atomicity = all or nothing. Consistency = valid state. Isolation = concurrent transactions don\'t see each other\'s partial work. Durability = committed = survived.',
  },
  {
    question: 'What are transaction isolation levels?',
    answer: 'Isolation levels trade consistency for performance: Read Uncommitted — can read uncommitted changes from other transactions (dirty reads). Read Committed — only reads committed data (prevents dirty reads) — PostgreSQL default. Repeatable Read — same query returns same rows within a transaction (prevents non-repeatable reads). Serializable — transactions execute as if one at a time (prevents phantom reads, most strict). Higher isolation = less concurrency. Most applications use Read Committed. Financial systems often use Serializable.',
    difficulty: 'advanced',
    followUp: ['What is a dirty read? A phantom read?'],
  },
  {
    question: 'What is a deadlock and how does it occur?',
    answer: 'A deadlock occurs when two or more transactions are each waiting for the other to release a lock, creating a circular dependency. Example: Transaction A locks row 1 and waits for row 2. Transaction B locks row 2 and waits for row 1. Neither can proceed. Databases detect deadlocks and automatically kill one transaction (it gets rolled back). Prevention: always acquire locks in the same order across all transactions, keep transactions short, use SELECT FOR UPDATE carefully.',
    difficulty: 'advanced',
    followUp: ['How does PostgreSQL detect and resolve deadlocks?'],
  },

  // ─── SCHEMA DESIGN ──────────────────────────────────────────────────────────
  {
    question: 'What is a primary key vs a foreign key?',
    answer: 'A primary key uniquely identifies each row in a table — it must be unique and NOT NULL. A table can only have one primary key (though it can span multiple columns as a composite key). A foreign key is a column that references the primary key of another table — it enforces referential integrity, ensuring you cannot insert a value that does not exist in the referenced table. Example: orders.user_id is a foreign key referencing users.id.',
    difficulty: 'beginner',
    followUp: ['What is CASCADE DELETE?', 'Can a foreign key reference a non-primary key column?'],
  },
  {
    question: 'What is the difference between CHAR, VARCHAR, and TEXT in PostgreSQL?',
    answer: 'CHAR(n) is a fixed-length string padded with spaces to length n — use only when values are always the same length (e.g., country codes). VARCHAR(n) is a variable-length string up to n characters — use when length varies but has a maximum. TEXT has no length limit — use for arbitrary-length strings. In PostgreSQL, VARCHAR and TEXT have identical performance; the n in VARCHAR(n) only enforces a constraint. For most string columns, TEXT or VARCHAR without a limit is the right choice.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is ON DELETE CASCADE and when should you use it?',
    answer: 'ON DELETE CASCADE automatically deletes child rows when the parent row is deleted. If you delete a user, their orders are automatically deleted too. Use it when child data is meaningless without the parent (e.g., comments belong to a post — deleting the post should delete comments). Avoid it for important historical data — instead use ON DELETE RESTRICT (prevents deletion if children exist) or SET NULL (sets the foreign key to NULL). Never use CASCADE for data that has legal, audit, or business retention requirements.',
    difficulty: 'intermediate',
  },

  // ─── PERFORMANCE & OPTIMIZATION ─────────────────────────────────────────────
  {
    question: 'What is the N+1 query problem and how do you solve it?',
    answer: 'The N+1 problem occurs when code runs 1 query to fetch N records, then runs 1 additional query FOR EACH record — N+1 total queries. Example: fetch 100 users (1 query), then fetch each user\'s orders in a loop (100 more queries) = 101 queries. Solution: use a JOIN to fetch users and orders in a single query, or use an ORM\'s eager loading feature (Prisma: include, Sequelize: include, Django: select_related). This is the most common performance bug in web apps.',
    difficulty: 'intermediate',
    followUp: ['How does an ORM\'s "eager loading" solve this?'],
    tip: 'Recognize N+1 in code reviews: a database query inside a loop is almost always N+1.',
  },
  {
    question: 'What is database connection pooling and why is it important?',
    answer: 'Establishing a new database connection is expensive — TCP handshake, authentication, setup — it takes ~100ms. Connection pooling maintains a pool of pre-established connections that are reused for each query. When a request needs a DB connection, it borrows one from the pool (fast), uses it, and returns it. Without pooling, a server with 1000 concurrent users would try to open 1000 connections — most databases have a limit (~100-300 max connections). Node.js apps use pg pool, Python uses SQLAlchemy pool, or a dedicated pooler like PgBouncer.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is a query execution plan and how do you optimize a slow query?',
    answer: 'A query execution plan shows how the database engine will execute a query: which indexes it uses, join order, estimated rows. Optimization steps: 1) Run EXPLAIN ANALYZE to identify the bottleneck. 2) Look for Seq Scan on large tables — add an index. 3) Check if the query can be rewritten (e.g., EXISTS instead of IN for large subqueries). 4) Avoid SELECT * — select only needed columns. 5) Add composite indexes for multi-column WHERE clauses. 6) Avoid functions on indexed columns in WHERE: WHERE LOWER(email) = x prevents index use; store data normalized instead.',
    difficulty: 'advanced',
  },
  {
    question: 'What is database sharding and when would you use it?',
    answer: 'Sharding is horizontal partitioning — splitting a large dataset across multiple database servers, each holding a subset. Example: users 1-1M on shard 1, users 1M-2M on shard 2. Use sharding when a single database server cannot handle the data volume or write throughput, typically at massive scale (millions of users). Downsides: cross-shard JOINs become very complex, transactions across shards lose ACID guarantees, schema changes are harder. Most applications never need sharding — vertical scaling (bigger server) and read replicas solve most problems first.',
    difficulty: 'advanced',
    followUp: ['What is a shard key and how do you choose it?'],
  },

  // ─── NOSQL ──────────────────────────────────────────────────────────────────
  {
    question: 'When would you choose MongoDB over PostgreSQL?',
    answer: 'Choose MongoDB when: your data structure is genuinely variable and hard to define upfront (content management, user-generated forms), you need to store nested arrays/documents that would require many JOIN tables in SQL, or you need extreme write throughput at scale (MongoDB shards naturally). Choose PostgreSQL when: data has clear relationships, you need ACID transactions, you need complex queries with JOINs, or schema consistency matters. For most applications (e-commerce, SaaS, social apps), PostgreSQL with JSONB columns gives you the best of both worlds.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is Redis and what are its primary use cases?',
    answer: 'Redis is an in-memory data structure store — data lives in RAM, making reads/writes microseconds-fast (vs milliseconds for disk-based databases). Primary use cases: 1) Caching — store results of expensive queries with a TTL. 2) Sessions — store user session data. 3) Rate limiting — increment a counter per user per minute. 4) Pub/Sub messaging — real-time notifications. 5) Queues — background job processing (with BullMQ). 6) Leaderboards — sorted sets. The main limitation: data must fit in RAM; Redis is not a replacement for a primary database.',
    difficulty: 'intermediate',
    followUp: ['What is the cache-aside pattern?', 'What happens when Redis runs out of memory?'],
  },
  {
    question: 'What is the CAP theorem?',
    answer: 'The CAP theorem states that a distributed database can only guarantee 2 of 3 properties: Consistency (every read returns the latest write), Availability (every request gets a response, even if stale), and Partition Tolerance (the system continues despite network splits). Since network partitions happen in real distributed systems, the real tradeoff is CP vs AP. PostgreSQL is CP (consistent and partition-tolerant but may become unavailable during partition). Cassandra is AP (always available, but may return stale data). Most web apps prioritize consistency — use CP databases.',
    difficulty: 'advanced',
  },

  // ─── ORM & PRACTICAL ────────────────────────────────────────────────────────
  {
    question: 'What is an ORM and what are its pros and cons?',
    answer: 'An ORM (Object-Relational Mapper) maps database tables to programming language objects, letting you query the database in code without writing raw SQL. Examples: Prisma, Drizzle, TypeORM, Sequelize. Pros: type safety, prevents SQL injection by default, faster development, handles migrations, database-agnostic. Cons: can generate inefficient queries for complex cases, "magic" hides what SQL is actually running, can encourage N+1 patterns if you\'re not careful. Best practice: use an ORM for 90% of queries, drop to raw SQL for performance-critical complex queries.',
    difficulty: 'intermediate',
    followUp: ['How does Prisma prevent SQL injection?'],
  },
  {
    question: 'What is SQL injection and how do you prevent it?',
    answer: 'SQL injection occurs when user input is concatenated directly into a SQL query, allowing attackers to execute arbitrary SQL. Example of vulnerable code: query = "SELECT * FROM users WHERE email = \'" + userInput + "\'"  — an attacker sends userInput = "a\' OR 1=1--" to bypass authentication. Prevention: ALWAYS use parameterized queries (prepared statements). In raw SQL: db.query("SELECT * FROM users WHERE email = $1", [email]). ORMs like Prisma use parameterized queries automatically. Never build SQL by string concatenation with user input.',
    difficulty: 'intermediate',
    tip: 'This is a security critical concept. Know the vulnerable pattern and the safe pattern by heart.',
  },
  {
    question: 'What is a database migration and how do you manage schema changes safely?',
    answer: 'A migration is a versioned script that modifies the database schema — adding columns, creating tables, changing types. Managing schema changes safely: 1) Never modify production schema manually — use migration tools (Prisma Migrate, Flyway, Knex migrations). 2) Make migrations backwards-compatible: add a nullable column before making it required. 3) Deploy in order: run migration BEFORE deploying new code that uses the new column. 4) Never delete a column until the code no longer references it. 5) Test migrations on a copy of production data before applying to prod.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is database replication and what are read replicas?',
    answer: 'Replication is the process of copying data from one database server (primary/master) to one or more other servers (replicas/secondaries). Read replicas receive a copy of all writes and serve read queries — allowing you to scale read traffic horizontally. Write queries still go to the primary. Common setup: 1 primary (all writes) + 2-3 read replicas (distribute SELECT queries). Replication lag is a consideration — replicas may be milliseconds behind the primary, so reading your own writes immediately after a write may return stale data.',
    difficulty: 'advanced',
  },
  {
    question: 'What is a stored procedure and when should you use it?',
    answer: 'A stored procedure is a named block of SQL code stored in the database that can be called with parameters. Advantages: reduces network round trips (logic runs on the database server), reusable, can enforce business rules at the DB level. Disadvantages: logic is split between app code and database (harder to maintain, test, and version control), ties you to a specific database, harder to debug. Modern preference: keep business logic in the application layer, use stored procedures only for database-heavy operations where network round trips are the bottleneck (e.g., bulk data processing).',
    difficulty: 'advanced',
  },
];
