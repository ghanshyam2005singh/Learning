import type { InterviewQuestion } from '@/types';

export const interviewQuestions: InterviewQuestion[] = [
  // ─── BEGINNER ────────────────────────────────────────────────────────────────
  {
    question: 'What is Node.js and why does it exist?',
    answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that lets JavaScript run on the server. It exists to solve the C10K problem — handling 10,000+ concurrent connections efficiently. Traditional servers (Apache, Tomcat) block a thread per request. Node.js uses non-blocking I/O and an event loop so a single thread handles thousands of connections without waiting. Result: high concurrency with low memory per connection.',
    difficulty: 'beginner',
    tip: 'Always mention: V8 engine, non-blocking I/O, event-driven, single thread for JS.',
  },
  {
    question: 'What is the difference between Node.js and browser JavaScript?',
    answer: 'Browser JS runs in a security sandbox with DOM access but no file system. Node.js runs on the server with OS-level access (file system, network, processes) but no DOM. Global object is window in browsers, global/globalThis in Node.js. Node.js has built-in modules (fs, http, path, crypto) that browsers lack. Node.js uses CommonJS modules by default; browsers use ES Modules natively.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the V8 engine?',
    answer: 'V8 is Google\'s open-source JavaScript engine written in C++. It compiles JavaScript to native machine code (JIT compilation) rather than interpreting it line by line. Chrome uses V8 in the browser. Node.js takes V8 and adds file system access, network APIs, and OS bindings (through libuv) on top.',
    difficulty: 'beginner',
  },
  {
    question: 'What is npm and what does package.json do?',
    answer: 'npm (Node Package Manager) is the default package manager and registry for Node.js. package.json is the project manifest — it describes the project (name, version, description), lists dependencies (runtime) and devDependencies (development only), defines scripts, and specifies engine requirements. npm install reads package.json to install dependencies. package-lock.json records exact versions for reproducible installs.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between dependencies and devDependencies?',
    answer: 'dependencies are packages needed at runtime in production (express, prisma, bcrypt). devDependencies are only needed during development and testing (typescript, jest, nodemon, eslint). In production Docker builds, use npm ci --omit=dev to skip devDependencies, keeping images smaller. The distinction matters for published packages too — consumers install your dependencies but not devDependencies.',
    difficulty: 'beginner',
  },
  {
    question: 'What is semantic versioning?',
    answer: 'SemVer uses MAJOR.MINOR.PATCH. PATCH (1.0.X) = bug fixes, backward compatible. MINOR (1.X.0) = new features, backward compatible. MAJOR (X.0.0) = breaking changes. In package.json: ^ (caret) allows updates within the same major (^4.1.0 → any 4.x.x). ~ (tilde) allows only patch updates (~4.1.0 → any 4.1.x). Always commit package-lock.json to ensure reproducible installs across team members.',
    difficulty: 'beginner',
  },
  {
    question: 'What is the difference between require() and import?',
    answer: 'require() is CommonJS — synchronous, can be called anywhere (conditions, loops, functions), default in Node.js. import is ES Module syntax — asynchronous loading, static (must be top-level, enables tree-shaking), the browser standard. In Node.js, enable ESM with "type":"module" in package.json or .mjs extension. Key practical differences: ESM requires file extensions in import paths, __dirname does not exist in ESM (use fileURLToPath(import.meta.url)).',
    difficulty: 'beginner',
  },
  {
    question: 'What does it mean that Node.js is single-threaded?',
    answer: 'Node.js executes JavaScript on one thread. Only one piece of JavaScript runs at a time — no parallel JS execution. But "single-threaded" does not mean slow. Node.js achieves high concurrency through non-blocking I/O: instead of blocking the thread waiting for a file read or network request, it registers a callback and handles other requests. The event loop dispatches callbacks when I/O completes. CPU-intensive work should go in worker threads to avoid blocking the main thread.',
    difficulty: 'beginner',
  },

  // ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
  {
    question: 'Explain the Node.js event loop and its phases.',
    answer: 'The event loop is what allows Node.js to perform non-blocking I/O with one JS thread. It runs in phases: (1) Timers — execute setTimeout/setInterval callbacks whose delay has passed. (2) Pending callbacks — I/O callbacks deferred from previous iteration. (3) Poll — retrieve new I/O events and execute their callbacks. (4) Check — execute setImmediate callbacks. (5) Close callbacks — close event handlers. Between every phase, Node.js drains the nextTick queue and Promise microtask queue before moving to the next phase.',
    difficulty: 'intermediate',
    tip: 'Draw the phases on a whiteboard. Always mention: between phases → nextTick → Promises.',
  },
  {
    question: 'What is the execution order: console.log, setTimeout, Promise, process.nextTick?',
    answer: 'Order: (1) console.log — synchronous, runs immediately. (2) process.nextTick — runs after current operation, before microtasks. (3) Promise .then — microtask, runs after nextTick queue is empty. (4) setTimeout — timers phase, runs after all microtasks are drained. Full example: console.log("A"); setTimeout(()=>log("B"),0); Promise.resolve().then(()=>log("C")); nextTick(()=>log("D")); console.log("E"); → Output: A, E, D, C, B.',
    difficulty: 'intermediate',
    tip: 'This is the most common event loop question. Know it cold.',
  },
  {
    question: 'What is libuv and what role does it play?',
    answer: 'libuv is a C library that provides Node.js with cross-platform async I/O. It includes: (1) The event loop implementation (phases, timers, polling). (2) A thread pool (default 4 threads) for operations that cannot be done async by the OS — file I/O, DNS lookups, crypto, zlib. (3) Abstractions over OS-specific async APIs (epoll on Linux, kqueue on macOS, IOCP on Windows). Network I/O does NOT use the thread pool — it uses OS async mechanisms directly.',
    difficulty: 'intermediate',
  },
  {
    question: 'What blocks the event loop in Node.js?',
    answer: 'Synchronous operations that take significant time block the event loop: (1) Synchronous file I/O (fs.readFileSync, writeFileSync). (2) Synchronous crypto (pbkdf2Sync, randomBytesSync). (3) JSON.parse/stringify on very large payloads. (4) Complex regex with catastrophic backtracking. (5) Long-running for loops. (6) Any third-party sync library. While blocked, no other requests can be served — all users wait. Solutions: use async versions, use worker threads for CPU work, break heavy work into smaller chunks with setImmediate.',
    difficulty: 'intermediate',
  },
  {
    question: 'What are streams in Node.js and when do you use them?',
    answer: 'Streams process data in chunks rather than loading it all into memory. Four types: Readable (source), Writable (destination), Duplex (both), Transform (read, modify, write). Use streams when: serving large files, processing large CSVs, compressing data on the fly, streaming video, handling large file uploads. Key advantage: constant memory usage (64KB buffer) regardless of data size. A 10GB file served with createReadStream uses the same memory as a 1KB file.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is backpressure in Node.js streams?',
    answer: 'Backpressure is the mechanism preventing memory buildup when a readable produces data faster than a writable can consume it. When the writable buffer fills up, writable.write() returns false. This signals the readable to pause (readable.pause()). When the writable drains its buffer, it emits "drain", signaling the readable to resume (readable.resume()). pipe() and pipeline() handle backpressure automatically — this is why they should be used instead of manually listening to data events.',
    difficulty: 'advanced',
  },
  {
    question: 'What is the difference between pipe() and pipeline()?',
    answer: 'pipe() connects streams but has a critical flaw: errors in one stream do not propagate to others, and streams are not automatically destroyed on error — causing resource leaks. pipeline() (from stream/promises) properly propagates errors through all streams and destroys them on failure, preventing leaks. In production always use pipeline(). pipe() is acceptable for simple cases in scripts where error handling is less critical.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is middleware in Express?',
    answer: 'Middleware is a function with signature (req, res, next) that sits in the request-response pipeline. Express executes middleware in the order they are registered with app.use(). Each middleware can: read/modify req and res, end the request by sending a response, or call next() to pass control to the next middleware. If next(err) is called with an error, Express skips to the error-handling middleware (4-parameter middleware). Middleware enables cross-cutting concerns: logging, auth, CORS, body parsing, rate limiting.',
    difficulty: 'intermediate',
  },
  {
    question: 'How does error handling work in Express?',
    answer: 'Express has a centralized error handler — middleware with exactly 4 parameters: (err, req, res, next). Errors reach it via: (1) next(err) called explicitly from a middleware or route. (2) throw inside synchronous route handlers (Express v5 catches this automatically). (3) Async routes: must wrap in try/catch and call next(err) — or use an asyncHandler wrapper. The error handler must be registered last. Different error types (JWT, Prisma, validation) should be mapped to appropriate HTTP status codes.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is JWT and how does it work?',
    answer: 'JWT (JSON Web Token) is a compact, URL-safe token with three base64url-encoded parts: header (algorithm), payload (claims — user ID, role, expiry), signature (HMAC of header+payload with a secret). Servers issue JWTs after authentication. Clients send them in the Authorization: Bearer header. Servers verify the signature — no database lookup needed (stateless). JWT payload is NOT encrypted — it is just encoded. Never put sensitive data in the payload. Key concerns: cannot revoke before expiry without a blocklist; use short expiry (15 min).',
    difficulty: 'intermediate',
  },
  {
    question: 'What is the refresh token pattern?',
    answer: 'Two tokens: access token (short-lived, 15 min, in response body) and refresh token (long-lived, 7 days, in httpOnly cookie). On login: issue both. Client uses access token for API calls. When access token expires, client sends a request to /auth/refresh — server validates the refresh token from the cookie, issues a new access token. Logout: delete refresh token from database. The refresh token in httpOnly cookie is inaccessible to JavaScript, preventing XSS theft.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is the N+1 query problem?',
    answer: 'N+1 occurs when you fetch a list of N items, then make N additional queries to fetch related data — total: N+1 queries. Example: fetch 100 users (1 query), then fetch posts for each user (100 queries) = 101 queries total. Solution: use JOINs. In Prisma: include: { posts: true }. In Mongoose: .populate("posts"). ORMs generate one query with a JOIN. In development, enable query logging to detect N+1 — it is one of the most common database performance bugs.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is connection pooling in databases?',
    answer: 'A connection pool pre-creates a set of database connections at startup and reuses them across requests. Opening a new connection per request takes 50-200ms and databases have connection limits (typically 100-500). A pool of 10-20 connections can serve thousands of concurrent requests because most queries complete in milliseconds. ORMs (Prisma, Mongoose) manage pooling automatically. Configure pool size based on expected concurrency and database limits. Too few connections = request queuing; too many = database overload.',
    difficulty: 'intermediate',
  },

  // ─── ADVANCED ─────────────────────────────────────────────────────────────────
  {
    question: 'How do you scale a Node.js application?',
    answer: 'Multiple layers: (1) Vertical scaling — more CPU/RAM on one machine. (2) Cluster module or PM2 — use all CPU cores on one machine (one process per core). (3) Horizontal scaling — multiple servers behind a load balancer. (4) Stateless design — no in-memory sessions; use Redis for shared state. (5) Database scaling — read replicas, connection pooling, caching. (6) Background jobs — offload slow work to queues (BullMQ). (7) CDN — serve static assets without hitting Node.js. (8) Microservices — split by bounded context for independent scaling.',
    difficulty: 'advanced',
  },
  {
    question: 'When would you use worker threads?',
    answer: 'Worker threads provide true JavaScript parallelism on multiple CPU cores. Use them for CPU-intensive JavaScript work that would block the event loop: large JSON parsing, image processing in pure JS, cryptographic operations on large data, scientific computing, PDF generation. Do NOT use for I/O — that is handled efficiently by the event loop. Worker threads share memory via SharedArrayBuffer and communicate via message passing (postMessage). Pool workers for reuse rather than creating a new worker per request.',
    difficulty: 'advanced',
  },
  {
    question: 'What are the security risks of JWT and how do you mitigate them?',
    answer: 'Key risks: (1) Payload is base64, not encrypted — never put sensitive data (passwords, PII) in claims. (2) Cannot revoke before expiry — use short-lived access tokens (15 min) + refresh token pattern. (3) Algorithm confusion attack — explicitly specify algorithm in jwt.verify() options. (4) XSS theft from localStorage — store access tokens in memory, refresh tokens in httpOnly cookies. (5) Secret leakage — anyone with the secret can forge tokens; use strong secrets, rotate periodically. (6) JWT bombing — very large JWTs slow verification; keep payloads small.',
    difficulty: 'advanced',
    tip: 'If asked about JWT security, mention the algorithm confusion attack — it shows deep knowledge.',
  },
  {
    question: 'How do you implement graceful shutdown in Node.js?',
    answer: 'Graceful shutdown: (1) Listen for SIGTERM (sent by Kubernetes, Docker on stop). (2) Stop accepting new connections: server.close(). (3) Wait for in-flight requests to complete — server.close() callback fires when all connections close. (4) Close database connections (prisma.$disconnect(), mongoose.disconnect()). (5) Close Redis/queue connections. (6) Call process.exit(0). (7) Set a force-kill timer (30s) in case shutdown hangs. Without graceful shutdown, in-progress requests fail and database connections leak.',
    difficulty: 'advanced',
  },
  {
    question: 'How do you debug a Node.js memory leak?',
    answer: 'Steps: (1) Confirm: monitor process.memoryUsage().heapUsed — if it grows continuously and does not drop after GC, there is a leak. (2) Take heap snapshots with Chrome DevTools (node --inspect, then take snapshot at intervals, compare). (3) Common causes: global variables accumulating data (caches without eviction), event listeners not removed, closures holding large objects, unclosed database connections, circular references. (4) Use clinic heapProfiler for automated analysis. (5) Use weak references or LRU caches with max size for in-memory storage.',
    difficulty: 'advanced',
  },
  {
    question: 'What is the difference between operational errors and programming errors in Node.js?',
    answer: 'Operational errors are expected, known conditions: invalid user input (400), resource not found (404), database timeout, external API failure. These should be caught, handled gracefully with appropriate HTTP responses, and are not bugs. Programming errors are bugs in code: accessing properties of null, wrong argument types, unhandled promise rejections. These should be logged with stack traces and may require process restart. The key principle: operational errors are part of expected behavior; programming errors indicate defects. The AppError pattern helps distinguish them: err.isOperational = true for operational errors.',
    difficulty: 'advanced',
  },
  {
    question: 'Explain the repository pattern in Node.js backends.',
    answer: 'The repository pattern abstracts database access behind an interface. Controllers call service methods; services call repository methods (findById, create, update, delete); only repositories contain Prisma/Mongoose calls. Benefits: (1) Testability — mock the repository in service unit tests instead of mocking Prisma internals. (2) Replaceability — swap PostgreSQL for MongoDB by changing only the repository layer. (3) Cache transparency — add Redis caching in the repository without changing service logic. (4) Single responsibility — services contain business logic without database details.',
    difficulty: 'advanced',
  },
  {
    question: 'When would you use a job queue and what are the tradeoffs?',
    answer: 'Use a job queue when: work is slow (email, PDF, SMS), can fail and needs retry (webhooks, payments), should not block the user (async processing), needs scheduling/delay (reminders, reports). Tradeoffs: Pros: user gets instant response (202 Accepted), work survives server crashes, automatic retry, horizontal worker scaling. Cons: eventual consistency (user must poll or use webhooks for status), adds infrastructure complexity (Redis required), harder to debug than synchronous code, job ordering guarantees require extra effort.',
    difficulty: 'advanced',
  },
  {
    question: 'How do you handle rate limiting in a distributed Node.js system?',
    answer: 'In-process rate limiters (express-rate-limit default) store counts in memory — each server has independent counts, defeating the limit with multiple servers. Solution: use Redis-backed rate limiting. The limit counter lives in Redis, shared across all servers. Libraries: rate-limit-redis (adapter for express-rate-limit), or implement sliding window in Redis with sorted sets. Apply different limits by tier: general API (100/15min), auth endpoints (5/15min), admin (stricter or no limit). Return Retry-After header so clients know when to retry.',
    difficulty: 'advanced',
  },
  {
    question: 'How does Socket.IO handle scaling across multiple servers?',
    answer: 'Socket.IO connections are stateful — a socket lives on one specific server. Without coordination, emitting to a room from server 1 cannot reach clients on server 2. Solution: @socket.io/redis-adapter. It uses Redis pub/sub. When server 1 emits to a room, it publishes to Redis. All servers (including server 1) subscribe and forward the message to their connected clients in that room. This adds ~1ms latency per message but enables horizontal scaling. Alternative: sticky sessions (load balancer routes the same user to the same server) — simpler but limits scaling flexibility.',
    difficulty: 'advanced',
  },

  // ─── SCENARIO BASED ──────────────────────────────────────────────────────────
  {
    question: 'Your Node.js API starts slowing down under load. How do you diagnose the issue?',
    answer: 'Systematic approach: (1) Measure — check response time percentiles (p50, p95, p99) and error rates. (2) Event loop lag — high lag means something is blocking the thread; use clinic.js or monitorEventLoopDelay. (3) Memory — if heapUsed grows, there is a leak (take heap snapshots). (4) Database — enable ORM query logging; look for slow queries, N+1, full table scans, missing indexes. (5) External services — are third-party APIs timing out? Add timeouts and circuit breakers. (6) CPU — profile with node --prof or clinic flame; identify hot functions. (7) Concurrency — is Node.js running on a single core? Check if clustering is enabled.',
    difficulty: 'advanced',
    tip: 'Structure your answer as a systematic diagnostic process, not a list of guesses.',
  },
  {
    question: 'A user reports they get logged out randomly. How do you investigate?',
    answer: 'Diagnosis checklist: (1) JWT expiry — is the access token TTL too short? Is the client refreshing before expiry? (2) Refresh token — is the /auth/refresh endpoint working? Check logs for 401 responses. (3) Refresh token storage — is it stored in DB? Is the DB reachable? (4) Cookie settings — SameSite=Strict breaks cross-site requests; Secure requires HTTPS; httpOnly prevents JS access. (5) Rate limiting — is the refresh endpoint being rate limited? (6) Session affinity — if using sessions (not JWT), are they stored in Redis (shared) or in-process (not shared across servers)? (7) Token rotation — are refresh tokens being rotated (old one invalidated after use)?',
    difficulty: 'advanced',
  },
  {
    question: 'You need to send emails to 100,000 users after a campaign launch. How do you architect this?',
    answer: 'Never in a request handler. Architecture: (1) API receives campaign trigger → adds one job per user (or bulk) to BullMQ queue → returns 202 Accepted immediately. (2) Multiple worker processes consume the queue — each worker calls the email provider (SendGrid, SES). (3) Rate limit workers to email provider limits (SES: 14 emails/sec by default). (4) Use exponential backoff for failed sends. (5) Track progress: update DB on success/failure per email. (6) Dead letter queue for permanently failed sends (invalid email, unsubscribed). (7) Notify admin when campaign completes via webhook or another job. Use batching if provider supports it.',
    difficulty: 'advanced',
  },
];
