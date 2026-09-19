import type { Lesson } from '@/types';

export const interviewPrepLesson: Lesson = {
  id: 'interview-preparation',
  slug: 'interview-preparation',
  title: 'Web Development Interview Preparation',
  description:
    'Comprehensive interview preparation — frontend, backend, database, architecture, and scenario-based questions with detailed answers. What interviewers actually ask.',
  category: 'Interview Prep',
  order: 18,
  difficulty: 'intermediate',
  estimatedTime: 35,
  content: `Web development interviews test both technical knowledge and the ability to reason about systems. This module covers the questions you will actually be asked, with the level of depth interviewers expect.

---

## Frontend Questions

### 1. What is the difference between SSR, SSG, and CSR?

\`\`\`
CSR (Client-Side Rendering):
  Server sends empty HTML + JavaScript bundle.
  React runs in browser, fetches data, renders UI.
  Pros: Rich interactivity, fast navigation after initial load
  Cons: Slow initial load, bad for SEO (no content in initial HTML)
  When: Dashboards, apps that don't need SEO (logged-in experiences)

SSR (Server-Side Rendering):
  Server renders HTML for each request with real data.
  Browser receives pre-rendered HTML → shows content immediately.
  JavaScript loads → React hydrates → becomes interactive.
  Pros: Fast initial content, good SEO, data is fresh per request
  Cons: Server must render every request, slower than cached HTML
  When: Product pages, user feeds, any page that needs fresh data

SSG (Static Site Generation):
  HTML generated at build time, cached on CDN.
  Same HTML served to every user.
  Pros: Fastest possible load (CDN-served), great SEO
  Cons: Stale data until next build, does not work for user-specific content
  When: Marketing sites, blogs, documentation

ISR (Incremental Static Regeneration - Next.js):
  SSG but pages regenerate in background after a set time.
  Best of SSG speed + SSR freshness.
\`\`\`

### 2. Explain the React rendering lifecycle

\`\`\`
Mount:
  1. Component function runs
  2. React renders virtual DOM
  3. React commits to real DOM
  4. useEffect with [] runs (after paint)

Update (state or props change):
  1. Component function runs again
  2. React compares new virtual DOM with previous (reconciliation/diffing)
  3. React applies minimal changes to real DOM
  4. useEffect with dependencies runs if deps changed

Unmount:
  1. React removes component from DOM
  2. useEffect cleanup functions run
\`\`\`

### 3. What is reconciliation and why does the key prop matter?

React's reconciliation algorithm compares the previous virtual DOM with the new one. When you render a list, React uses the \`key\` prop to identify which items changed, were added, or were removed. Without a key, React falls back to index-based comparison, which causes bugs when items are reordered.

\`\`\`tsx
// Bug: without key, React re-renders all items when order changes
{posts.map((post, index) => <PostCard key={index} post={post} />)}

// Correct: stable unique key lets React identify specific items
{posts.map(post => <PostCard key={post.id} post={post} />)}
\`\`\`

### 4. What is a closure and how does it cause stale state bugs in React?

A closure captures variables from the outer scope at the time it is created. In React, event handlers and useEffect callbacks close over state values at render time.

\`\`\`tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // STALE: always reads count from the first render
    }, 1000);
    return () => clearInterval(interval);
  }, []); // empty deps — effect runs once, captures count = 0

  // FIX: use functional update form
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1); // always uses latest value
    }, 1000);
    return () => clearInterval(interval);
  }, []);
}
\`\`\`

---

## Backend Questions

### 5. What is the event loop in Node.js?

Node.js is single-threaded but handles concurrent I/O through an event loop. When you make a database query or HTTP request, Node.js registers a callback and continues executing other code. When the I/O completes, the callback is placed in the event queue and executed when the call stack is empty.

\`\`\`
Event loop phases:
  1. Timers       → setTimeout, setInterval callbacks
  2. I/O polling  → I/O callbacks (network, file system)
  3. setImmediate → after I/O phase
  4. Close events → socket.close() callbacks

Key insight: async/await does not block the thread.
await db.query() suspends only this async function,
letting other callbacks run while waiting.
\`\`\`

### 6. What is middleware in Express and how does it work?

Middleware is a function that receives the request and response, and can modify them, end the response, or call \`next()\` to pass to the next middleware.

\`\`\`typescript
// Middleware runs in order — each calls next() to continue
app.use(cors());          // 1. CORS headers
app.use(helmet());        // 2. Security headers
app.use(express.json());  // 3. Parse body
app.use(logger);          // 4. Log request
app.use('/api', router);  // 5. Routes
app.use(errorHandler);    // 6. Error handling

// If middleware does NOT call next(), the request ends there
\`\`\`

### 7. What is the N+1 query problem?

The N+1 problem occurs when you make 1 query to get a list, then N additional queries for each item.

\`\`\`typescript
// N+1 PROBLEM:
const posts = await db.query('SELECT * FROM posts LIMIT 10');  // 1 query
for (const post of posts.rows) {
  // 10 more queries — one per post!
  post.author = await db.query('SELECT * FROM users WHERE id = $1', [post.author_id]);
}
// Total: 11 queries

// FIX: JOIN or batch fetch
const posts = await db.query(\`
  SELECT posts.*, users.name, users.avatar
  FROM posts
  JOIN users ON posts.author_id = users.id
  LIMIT 10
\`);
// Total: 1 query
\`\`\`

---

## Database Questions

### 8. What is a database index and when do you add one?

An index is a data structure that allows the database to find rows without scanning the entire table. A B-tree index works like a sorted list with pointers to rows.

Add indexes on:
- Foreign keys (PostgreSQL doesn't auto-index them)
- Columns frequently used in WHERE clauses
- Columns used in ORDER BY with large tables
- Composite indexes for queries filtering on multiple columns

Do not index every column — indexes slow down writes and consume storage.

### 9. What is a database transaction and when do you need one?

A transaction is a series of operations that either all succeed or all fail together (atomicity).

\`\`\`sql
-- Without transaction: if step 2 fails, money is deducted but not added
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- With transaction: both or neither
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- if anything fails, ROLLBACK automatically
\`\`\`

Use transactions whenever multiple database operations must succeed or fail together.

---

## Architecture Questions

### 10. How would you design a URL shortener like bit.ly?

\`\`\`
Requirements:
  Functional: shorten URL, redirect to original, track clicks
  Non-functional: very high read volume (redirects >> creates)

Core design:
  POST /shorten → creates record, returns short code
  GET /:code    → looks up code, returns 301 redirect to original URL

Database:
  urls table: id, original_url, short_code (indexed), user_id, created_at
  clicks table: url_id, timestamp, ip, country (for analytics)

Short code generation:
  crypto.randomBytes(4).toString('base64url')  → 6-8 chars
  Or: hash the URL and take first N chars

Caching:
  Most clicks go to the most popular URLs.
  Cache code → url mapping in Redis with TTL.
  Redirect lookup: Redis HIT (1ms) → DB miss only on cold start

Scaling:
  - Horizontal scaling: any server can handle any redirect
  - Read replica for analytics queries
  - CDN for the redirect service (serve from edge)

Analytics:
  - Don't block the redirect to record the click
  - Publish to a queue, process asynchronously
\`\`\`

### 11. What is the difference between horizontal and vertical scaling?

\`\`\`
Vertical scaling: add more resources to existing server
  CPU: 4 cores → 32 cores
  RAM: 16GB → 256GB
  Storage: SSD upgrade
  Pros: simple, no code changes
  Cons: expensive, hardware limit, single point of failure

Horizontal scaling: add more servers
  1 server → 3 servers → 10 servers
  Requires: stateless application (no in-memory state)
  Requires: load balancer to distribute traffic
  Pros: cheap commodity hardware, unlimited scale, redundancy
  Cons: requires distributed architecture, stateless design
\`\`\`

---

## Scenario Questions

### 12. Your production API is suddenly returning 500 errors. Walk me through how you debug it.

\`\`\`
1. Assess severity
   - How many users are affected?
   - Is it all endpoints or specific ones?
   - Is it 100% failure or intermittent?

2. Check metrics immediately
   - Error tracking (Sentry): what is the actual error?
   - Deployment history: did something deploy recently?
   - Database: connection pool exhausted? CPU spike?
   - Memory: is the server OOMing?

3. Check logs
   - What is the exact error message and stack trace?
   - When did errors start?
   - Is there a pattern? (specific user, specific endpoint, specific payload)

4. Reproduce
   - Can you reproduce in staging?
   - What is the minimal request that triggers the error?

5. Fix
   - Hotfix for immediate issue
   - If risky: roll back the last deployment

6. Post-mortem
   - What was the root cause?
   - Why did our tests not catch this?
   - What process change prevents this next time?
\`\`\`

### 13. How do you make a slow database query faster?

\`\`\`
Step 1: EXPLAIN ANALYZE the query
  EXPLAIN ANALYZE SELECT * FROM posts WHERE author_id = 1 ORDER BY created_at DESC;
  Look for: Seq Scan (bad), Index Scan (good)

Step 2: Add the missing index
  CREATE INDEX idx_posts_author_id ON posts(author_id);
  For the ORDER BY too: CREATE INDEX idx_posts_author_created ON posts(author_id, created_at DESC);

Step 3: If still slow after indexing:
  - Reduce columns selected (SELECT * → SELECT only needed columns)
  - Check if JOIN is doing unnecessary work
  - Consider pagination if returning too many rows

Step 4: If the query is unavoidably slow:
  - Cache the result in Redis
  - Move to background job and pre-compute
  - Denormalize: store computed values directly in the table
\`\`\``,
  codeExamples: [
    {
      title: 'System Design Interview: Chat Feature',
      code: `// Question: "Design a real-time chat feature for your web app"

// CLARIFY FIRST:
// - 1:1 chat or group chat?
// - How many concurrent users? (1k? 1M?)
// - What platforms? (web only, mobile too?)
// - Do messages persist? (history required?)
// - Any special features? (read receipts, typing indicators)

// HIGH LEVEL DESIGN:

// 1. Real-time transport: WebSocket (not polling)
// WebSockets maintain a persistent connection —
// server can push messages without client polling

// 2. Backend structure:
// POST /api/conversations       → create 1:1 conversation
// GET  /api/conversations       → list user's conversations
// GET  /api/conversations/:id/messages  → get message history
// WebSocket /ws                 → real-time connection

// 3. WebSocket server (Node.js):
import { WebSocket, WebSocketServer } from 'ws';

const connections = new Map<string, WebSocket>(); // userId → ws

wss.on('connection', (ws, req) => {
  const userId = authenticate(req); // verify JWT from cookie/header
  connections.set(userId, ws);

  ws.on('message', async (data) => {
    const { type, conversationId, content } = JSON.parse(data.toString());

    if (type === 'MESSAGE') {
      // Save to database
      const message = await messagesRepo.create({ conversationId, senderId: userId, content });

      // Get all participants
      const participants = await conversationsRepo.getParticipants(conversationId);

      // Deliver to all connected participants
      for (const participantId of participants) {
        const ws = connections.get(participantId);
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'NEW_MESSAGE', message }));
        }
      }
    }
  });

  ws.on('close', () => connections.delete(userId));
});

// 4. Database:
// conversations: id, created_at
// conversation_participants: conversation_id, user_id (junction)
// messages: id, conversation_id, sender_id, content, created_at, read_at

// 5. Scaling consideration (when needed):
// Multiple WebSocket servers can't share in-memory connections map.
// Solution: publish to Redis Pub/Sub → all servers subscribe → deliver to local connection
// Or: use a managed real-time service (Ably, Pusher) and skip this entirely`,
      explanation:
        'System design interviews test your ability to reason about requirements, components, and tradeoffs — not to produce the perfect answer. Clarify requirements, propose a simple design, identify scaling challenges.',
    },
  ],
  commonMistakes: [
    'Jumping to complex answers before asking clarifying questions in system design',
    'Not being able to explain the difference between 401 and 403 — this comes up constantly',
    'Saying "it depends" without explaining what it depends on and what you would choose',
    'Being unable to reason about N+1 queries — very common in frontend interviews for full stack roles',
    'Not knowing the event loop — asked in virtually every Node.js interview',
    'Confusing authentication and authorization — fundamental concepts that must be precise',
  ],
  interviewQuestions: [
    {
      question: 'What happens in the browser when a React component re-renders?',
      answer:
        'The component function runs again, producing a new virtual DOM tree. React\'s reconciler compares (diffs) the new virtual DOM with the previous one, finding the minimum set of changes. It then commits only those changes to the real DOM in a batch. useEffect hooks run after the DOM is updated. This is why React is efficient — real DOM mutations are minimized.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is database connection pooling and why is it needed?',
      answer:
        'Creating a new database connection for every query is expensive (TCP handshake, authentication). A connection pool maintains a set of pre-established connections that are reused. When a query runs, it borrows a connection from the pool and returns it when done. Without pooling, a server under load creates thousands of connections, overwhelming the database. Libraries like pg (node-postgres) and Prisma use pooling automatically.',
      difficulty: 'intermediate',
    },
    {
      question: 'How would you handle a situation where your React app is very slow?',
      answer:
        'First measure: use React DevTools Profiler and browser Performance tab to find what is slow — do not optimize blindly. Common causes: unnecessary re-renders (fix with React.memo, useMemo, useCallback), large bundle size (fix with code splitting and lazy loading), slow API calls (fix with caching and optimistic updates), N+1 data fetches (fix with better API design). Profile first, identify the bottleneck, fix the specific problem.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'answer-system-design',
      title: 'Answer a System Design Question',
      description:
        'Design a notification system for a social media app. Users should receive notifications when: someone likes their post, someone follows them, someone comments on their post. Notifications should appear in-app in real-time. Write your design: components, database schema, real-time delivery strategy, and how you would scale it.',
      starterCode: `// Question: Design a notification system

// CLARIFYING QUESTIONS:
// 1.
// 2.
// 3.

// DATABASE SCHEMA:

// REAL-TIME DELIVERY STRATEGY:

// API ENDPOINTS:

// SCALING CONSIDERATIONS:`,
      solution: `// CLARIFYING QUESTIONS:
// 1. Do notifications need to persist? (Yes — users should see old ones when they open the app)
// 2. How many users? (Let's say 100k DAU for now)
// 3. Do we need push notifications (mobile/browser) or only in-app? (in-app only for now)

// DATABASE SCHEMA:
// notifications table:
//   id UUID PRIMARY KEY
//   recipient_id UUID REFERENCES users(id)
//   type VARCHAR -- 'like', 'follow', 'comment'
//   actor_id UUID REFERENCES users(id)  -- who triggered it
//   entity_type VARCHAR  -- 'post', 'comment'
//   entity_id UUID       -- which post/comment
//   read_at TIMESTAMPTZ  -- null = unread
//   created_at TIMESTAMPTZ DEFAULT NOW()
//
// INDEX: idx_notifications_recipient_unread ON notifications(recipient_id, read_at) WHERE read_at IS NULL

// REAL-TIME DELIVERY:
// When a like/follow/comment event occurs:
//   1. Write notification to database
//   2. Check if recipient has an active WebSocket connection
//   3. If yes: push notification object directly via WebSocket
//   4. If no: notification waits in DB; client fetches on next load

// API ENDPOINTS:
// GET /api/notifications?page=1&unread=true
//   → paginated list of notifications for current user
// PATCH /api/notifications/:id/read
//   → mark specific notification as read
// POST /api/notifications/read-all
//   → mark all as read
// GET /api/notifications/count
//   → unread count (for bell badge)

// EVENT GENERATION:
// When a post is liked:
//   await notificationsService.create({
//     recipientId: post.authorId,
//     type: 'like',
//     actorId: likingUserId,
//     entityType: 'post',
//     entityId: post.id,
//   });
//   // Don't notify yourself
//   if (post.authorId === likingUserId) return;

// SCALING:
// 100k DAU: the single-server WebSocket map works fine
// 1M+ DAU: multiple WebSocket servers can't share in-memory maps
// Solution: Redis Pub/Sub
//   - Each server subscribes to user-specific channels
//   - Event publisher sends to Redis: PUBLISH user:456 {notification}
//   - The server holding user 456's connection receives and forwards`,
      hints: [
        'Start with clarifying questions — interviewers want to see you define the scope',
        'Avoid over-engineering for scale you have not been asked about',
        'Write the schema before the API — the schema drives the design',
      ],
    },
  ],
  keyTakeaways: [
    'SSR renders per request (fresh data, good SEO); SSG renders at build time (fastest, stale); CSR renders in browser (rich apps)',
    'N+1 queries: detect with EXPLAIN ANALYZE, fix with JOINs or batch queries',
    'Event loop: Node.js is single-threaded, async I/O is non-blocking, callbacks run when I/O completes',
    'System design: clarify requirements → simple design → identify bottlenecks → propose solutions',
    'Debug production issue: check error tracking → check recent deployments → check logs → reproduce → fix → post-mortem',
    'Slow queries: EXPLAIN ANALYZE → add index → reduce columns → cache if unavoidably slow',
    'Transactions: use whenever multiple DB operations must succeed or fail together',
  ],
  nextLesson: 'guided-projects',
  prevLesson: 'startup-development',
};
