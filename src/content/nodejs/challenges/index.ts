import type { Challenge } from '@/types';

export const challenges: Challenge[] = [
  // ─── EVENT LOOP ──────────────────────────────────────────────────────────────
  {
    id: 'node-event-loop-order',
    slug: 'node-event-loop-order',
    title: 'Predict Event Loop Output',
    description: 'Without running the code, predict the exact console output order and explain why each line appears in that position.',
    difficulty: 'intermediate',
    topic: 'Event Loop',
    starterCode: `// What is the output order? Write your answer as comments.
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'));

process.nextTick(() => console.log('E'));

setImmediate(() => console.log('F'));

console.log('G');

// Order: ?`,
    solution: `// Order: A, G, E, C, D, F, B
// Explanation:
// A, G — synchronous code runs first
// E — process.nextTick runs before all microtasks
// C — first Promise .then (microtask)
// D — second Promise .then (chained microtask, runs in same batch)
// F — setImmediate runs in the check phase
// B — setTimeout runs in the timers phase (after check phase in most cases)

console.log('A');          // 1
setTimeout(() => console.log('B'), 0);     // queued for timers phase
Promise.resolve()
  .then(() => console.log('C'))            // microtask
  .then(() => console.log('D'));           // chained microtask
process.nextTick(() => console.log('E')); // nextTick — before microtasks
setImmediate(() => console.log('F'));     // check phase
console.log('G');          // 2`,
    hints: [
      'Sync code always runs first',
      'process.nextTick fires before Promise microtasks',
      'setImmediate is the check phase (after I/O polling)',
      'setTimeout 0ms goes to the timers phase — after check phase in this context',
    ],
    explanation: 'Execution order: synchronous → nextTick queue → Promise microtasks → setImmediate (check phase) → setTimeout (timers phase). This ordering is fundamental to understanding Node.js async behavior.',
    tags: ['event-loop', 'async', 'intermediate'],
  },

  {
    id: 'node-non-blocking-io',
    slug: 'node-non-blocking-io',
    title: 'Fix Blocking I/O',
    description: 'This server uses synchronous file I/O in a request handler, blocking all other users. Convert it to non-blocking.',
    difficulty: 'beginner',
    topic: 'Event Loop',
    starterCode: `const express = require('express');
const fs = require('fs');

const app = express();

// ❌ BUG: Blocks the event loop for every user while reading this file
app.get('/config', (req, res) => {
  const data = fs.readFileSync('config.json', 'utf8');
  const config = JSON.parse(data);
  res.json(config);
});

app.listen(3000);`,
    solution: `const express = require('express');
const fs = require('fs/promises');

const app = express();

// ✅ Non-blocking — event loop stays free during file read
app.get('/config', async (req, res, next) => {
  try {
    const data = await fs.readFile('config.json', 'utf8');
    const config = JSON.parse(data);
    res.json(config);
  } catch (err) {
    next(err);
  }
});

app.listen(3000);`,
    hints: [
      'Use fs/promises instead of fs',
      'readFile (async) instead of readFileSync (sync)',
      'Make the route handler async and use await',
      'Wrap in try/catch and call next(err) on error',
    ],
    explanation: 'readFileSync blocks the entire Node.js thread while the file is being read. All other requests — even simple ones — must wait. readFile (async) frees the event loop to handle other requests while the OS reads the file.',
    tags: ['event-loop', 'filesystem', 'beginner'],
  },

  // ─── STREAMS ──────────────────────────────────────────────────────────────────
  {
    id: 'node-stream-file',
    slug: 'node-stream-file',
    title: 'Stream a Large File',
    description: 'Serve a large file as an HTTP response using streams instead of loading it all into memory.',
    difficulty: 'intermediate',
    topic: 'Streams',
    starterCode: `const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();

// ❌ BUG: Loads entire file into memory — will crash on large files
app.get('/download/:filename', async (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);
  const data = await fs.readFile(filePath); // ❌ loads all into memory
  res.set('Content-Type', 'application/octet-stream');
  res.send(data);
});

app.listen(3000);`,
    solution: `const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/download/:filename', async (req, res, next) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);

  try {
    const stat = await fs.promises.stat(filePath);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Length': stat.size,
      'Content-Disposition': \`attachment; filename="\${req.params.filename}"\`,
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', next);
    stream.pipe(res);
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'File not found' });
    next(err);
  }
});

app.listen(3000);`,
    hints: [
      'Use fs.createReadStream instead of readFile',
      'stream.pipe(res) streams directly to the HTTP response',
      'Get file size with fs.promises.stat for Content-Length header',
      'Handle stream errors with stream.on("error", next)',
    ],
    explanation: 'createReadStream reads the file in ~64KB chunks and pipes them to the response. Memory usage stays constant regardless of file size — critical for video/PDF serving.',
    tags: ['streams', 'files', 'intermediate'],
  },

  {
    id: 'node-transform-stream',
    slug: 'node-transform-stream',
    title: 'Build a Transform Stream',
    description: 'Create a Transform stream that uppercases all text passing through it, then pipe stdin through it to stdout.',
    difficulty: 'intermediate',
    topic: 'Streams',
    starterCode: `const { Transform } = require('stream');

// Create a UpperCaseTransform that transforms each chunk to uppercase
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // TODO: push uppercased chunk
  }
}

// Pipe: stdin → UpperCaseTransform → stdout
// When you type text, it should print in uppercase`,
    solution: `const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback(); // signal that this chunk has been processed
  }
}

const upper = new UpperCaseTransform();
process.stdin.pipe(upper).pipe(process.stdout);

// Test: echo "hello world" | node solution.js
// Output: HELLO WORLD`,
    hints: [
      'this.push(data) emits a chunk from the transform',
      'callback() signals processing is done',
      'chunk.toString() converts Buffer to string',
      'pipe: stdin → transform → stdout',
    ],
    explanation: 'Transform streams sit in the middle of a pipeline. _transform receives input chunks, processes them, and pushes output chunks. callback() must be called when the chunk is processed.',
    tags: ['streams', 'transform', 'intermediate'],
  },

  // ─── EXPRESS ──────────────────────────────────────────────────────────────────
  {
    id: 'node-express-middleware',
    slug: 'node-express-middleware',
    title: 'Build a Request Logger Middleware',
    description: 'Create Express middleware that logs each request with method, URL, status code, and response time in milliseconds.',
    difficulty: 'beginner',
    topic: 'Express',
    starterCode: `const express = require('express');
const app = express();

// Create middleware: requestLogger
// Should log: "GET /api/users 200 45ms"
// Hint: response status/time only available AFTER response is sent

function requestLogger(req, res, next) {
  // TODO
}

app.use(requestLogger);
app.get('/api/users', (req, res) => res.json([{ id: 1, name: 'Alice' }]));
app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

function requestLogger(req, res, next) {
  const start = Date.now();

  // 'finish' fires when response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${duration}ms\`);
  });

  next();
}

app.use(requestLogger);
app.get('/api/users', (req, res) => res.json([{ id: 1, name: 'Alice' }]));
app.listen(3000);`,
    hints: [
      'Record Date.now() at the start of the middleware',
      'Listen to the "finish" event on res to know when response is sent',
      'res.statusCode is only set after res.json/send is called',
      'Must call next() to continue the middleware chain',
    ],
    explanation: 'The "finish" event fires after the response has been written and flushed. At that point, res.statusCode is set, and you can calculate the total duration.',
    tags: ['express', 'middleware', 'beginner'],
  },

  {
    id: 'node-async-error-handler',
    slug: 'node-async-error-handler',
    title: 'Fix Async Error Handling',
    description: 'The async route below does not propagate errors to the Express error handler. Fix it.',
    difficulty: 'beginner',
    topic: 'Express',
    starterCode: `const express = require('express');
const app = express();

// ❌ BUG: Unhandled promise rejection — error never reaches the error handler
app.get('/users/:id', async (req, res) => {
  const user = await findUser(req.params.id); // may throw
  res.json(user);
});

// This error handler never runs for the route above
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

async function findUser(id) {
  if (id === '0') throw new Error('User not found');
  return { id, name: 'Alice' };
}

app.listen(3000);`,
    solution: `const express = require('express');
const app = express();

// ✅ Fix 1: try/catch + next(err)
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // forward to error handler
  }
});

// ✅ Fix 2: asyncHandler wrapper (more elegant)
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users/:id/v2', asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id);
  res.json(user);
}));

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

async function findUser(id) {
  if (id === '0') throw new Error('User not found');
  return { id, name: 'Alice' };
}

app.listen(3000);`,
    hints: [
      'Async route handlers must use try/catch',
      'Call next(err) to forward errors to the error handler',
      'Or use an asyncHandler wrapper that catches and calls next',
    ],
    explanation: 'Without try/catch + next(err), promise rejections in async routes are unhandled — the error handler never runs. Express v5 catches async throws automatically, but v4 (still most common) requires explicit handling.',
    tags: ['express', 'error-handling', 'async', 'beginner'],
  },

  // ─── AUTHENTICATION ───────────────────────────────────────────────────────────
  {
    id: 'node-jwt-middleware',
    slug: 'node-jwt-middleware',
    title: 'Implement JWT Authentication Middleware',
    description: 'Build authentication middleware that verifies a Bearer JWT token and attaches the decoded user to req.user.',
    difficulty: 'intermediate',
    topic: 'Authentication',
    starterCode: `const jwt = require('jsonwebtoken');

// Middleware: authenticate
// - Read "Authorization: Bearer <token>" header
// - Verify JWT with process.env.JWT_SECRET
// - Attach decoded payload to req.user
// - Return 401 if no token, invalid, or expired

function authenticate(req, res, next) {
  // TODO
}

module.exports = authenticate;`,
    solution: `const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  }

  const token = authHeader.slice(7); // remove "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: { code: 'TOKEN_EXPIRED', message: 'Token expired' },
      });
    }
    res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    });
  }
}

module.exports = authenticate;`,
    hints: [
      'authHeader.startsWith("Bearer ") checks prefix',
      'authHeader.slice(7) removes "Bearer " (7 chars)',
      'jwt.verify throws on invalid/expired tokens',
      'Check err.name === "TokenExpiredError" for specific message',
    ],
    explanation: 'Return different error codes for expired vs invalid tokens. The client uses TOKEN_EXPIRED to trigger a refresh, while INVALID_TOKEN triggers a logout.',
    tags: ['auth', 'jwt', 'middleware', 'intermediate'],
  },

  {
    id: 'node-hash-verify-password',
    slug: 'node-hash-verify-password',
    title: 'Hash and Verify Passwords',
    description: 'Implement hashPassword and verifyPassword functions using bcrypt with cost factor 12.',
    difficulty: 'beginner',
    topic: 'Authentication',
    starterCode: `const bcrypt = require('bcrypt');

// hashPassword: plain text → bcrypt hash (cost 12)
async function hashPassword(plaintext) {
  // TODO
}

// verifyPassword: compare plain text against stored hash
// returns true if match, false otherwise
async function verifyPassword(plaintext, hash) {
  // TODO
}

// Test
async function test() {
  const hash = await hashPassword('MySecurePass123');
  console.log('Hash:', hash);
  console.log('Valid:', await verifyPassword('MySecurePass123', hash)); // true
  console.log('Invalid:', await verifyPassword('WrongPass', hash));    // false
}
test();`,
    solution: `const bcrypt = require('bcrypt');

const COST_FACTOR = 12; // ~250ms — deliberate slowness against brute force

async function hashPassword(plaintext) {
  return bcrypt.hash(plaintext, COST_FACTOR);
}

async function verifyPassword(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

async function test() {
  const hash = await hashPassword('MySecurePass123');
  console.log('Hash:', hash);
  console.log('Valid:', await verifyPassword('MySecurePass123', hash));
  console.log('Invalid:', await verifyPassword('WrongPass', hash));
}
test();`,
    hints: [
      'bcrypt.hash(password, costFactor) returns a hash',
      'bcrypt.compare(plain, hash) returns true/false',
      'Cost factor 12 = ~250ms — intentionally slow to resist brute force',
    ],
    explanation: 'bcrypt generates a random salt per hash, so the same password produces different hashes each time. bcrypt.compare handles the salt automatically — never compare hashes manually with ===.',
    tags: ['auth', 'bcrypt', 'security', 'beginner'],
  },

  // ─── API DESIGN ───────────────────────────────────────────────────────────────
  {
    id: 'node-pagination',
    slug: 'node-pagination',
    title: 'Implement API Pagination',
    description: 'Add pagination to a GET /products endpoint. Support page and limit query params with proper meta response.',
    difficulty: 'beginner',
    topic: 'API Design',
    starterCode: `const express = require('express');
const router = express.Router();

const products = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1, name: \`Product \${i + 1}\`, price: (i + 1) * 10,
}));

// Add pagination: ?page=1&limit=10
// Response: { data: [...], meta: { page, limit, total, pages } }
router.get('/', (req, res) => {
  res.json(products); // ❌ returns all 100 — add pagination
});

module.exports = router;`,
    solution: `const express = require('express');
const router = express.Router();

const products = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1, name: \`Product \${i + 1}\`, price: (i + 1) * 10,
}));

router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;
  const data = products.slice(offset, offset + limit);

  res.json({
    data,
    meta: {
      page,
      limit,
      total: products.length,
      pages: Math.ceil(products.length / limit),
      hasNext: page * limit < products.length,
      hasPrev: page > 1,
    },
  });
});

module.exports = router;`,
    hints: [
      'offset = (page - 1) * limit',
      'Array.slice(offset, offset + limit) gives the page',
      'pages = Math.ceil(total / limit)',
      'Cap limit to prevent abuse (max 100)',
    ],
    explanation: 'Offset-based pagination: calculate how many items to skip (offset) and how many to return (limit). Always include total and pages in meta so clients can build pagination UI.',
    tags: ['api', 'pagination', 'beginner'],
  },

  {
    id: 'node-zod-validation',
    slug: 'node-zod-validation',
    title: 'Add Zod Validation',
    description: 'Add Zod schema validation to a POST /users route. Validate name (2-50 chars), email (valid email), and age (optional, 13-120).',
    difficulty: 'intermediate',
    topic: 'Validation',
    starterCode: `const express = require('express');
const { z } = require('zod');
const router = express.Router();

// Create schema and validate middleware
// name: required, 2-50 chars, trimmed
// email: required, valid email, lowercased
// password: required, min 8 chars
// age: optional, integer 13-120

router.post('/', (req, res) => {
  // TODO: validate req.body against schema
  // Return 422 with error details if invalid
  // Return 201 with user if valid
  const user = { id: Date.now(), ...req.body };
  res.status(201).json(user);
});

module.exports = router;`,
    solution: `const express = require('express');
const { z } = require('zod');
const router = express.Router();

const CreateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 chars').max(50),
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 chars'),
  age: z.number().int().min(13).max(120).optional(),
});

router.post('/', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: result.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  // result.data is parsed, trimmed, lowercased
  const user = { id: Date.now(), ...result.data, password: undefined };
  res.status(201).json(user);
});

module.exports = router;`,
    hints: [
      'z.string().email() validates email format',
      '.toLowerCase() transforms email to lowercase',
      'safeParse() never throws — check result.success',
      'result.error.errors is an array of { path, message }',
    ],
    explanation: 'Use result.data (not req.body) after validation — it contains the parsed, transformed values (trimmed, lowercased). safeParse is always preferred over parse in route handlers.',
    tags: ['validation', 'zod', 'intermediate'],
  },

  // ─── ARCHITECTURE ─────────────────────────────────────────────────────────────
  {
    id: 'node-event-emitter-build',
    slug: 'node-event-emitter-build',
    title: 'Implement an EventEmitter from Scratch',
    description: 'Build a SimpleEventEmitter class with on(), off(), once(), and emit() methods.',
    difficulty: 'intermediate',
    topic: 'Events',
    starterCode: `class SimpleEventEmitter {
  constructor() {
    // Storage for event listeners
  }

  // on(event, listener) — subscribe
  on(event, listener) { }

  // off(event, listener) — unsubscribe
  off(event, listener) { }

  // once(event, listener) — subscribe for one emission only
  once(event, listener) { }

  // emit(event, ...args) — fire event with data
  emit(event, ...args) { }
}

// Test
const emitter = new SimpleEventEmitter();
emitter.on('greet', (name) => console.log('Hello,', name));
emitter.emit('greet', 'Alice');  // Hello, Alice
emitter.emit('greet', 'Bob');    // Hello, Bob

emitter.once('init', () => console.log('Init!'));
emitter.emit('init'); // Init!
emitter.emit('init'); // (nothing)`,
    solution: `class SimpleEventEmitter {
  constructor() {
    this._events = {}; // event → [listener, ...]
  }

  on(event, listener) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(listener);
    return this;
  }

  off(event, listener) {
    if (this._events[event]) {
      this._events[event] = this._events[event].filter(l => l !== listener);
    }
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    wrapper._original = listener; // store reference for off()
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    if (this._events[event]) {
      [...this._events[event]].forEach(listener => listener(...args));
    }
    return !!this._events[event]?.length;
  }
}`,
    hints: [
      'Store listeners as: { eventName: [fn1, fn2] }',
      'once wraps the listener and calls off() after first fire',
      'Spread [...this._events[event]] before forEach — listeners may modify the array',
      'off uses filter to remove the specific function reference',
    ],
    explanation: 'Copying the listeners array before iterating is essential — a once() listener removes itself during emit, which would mutate the array you are iterating. The spread creates a snapshot.',
    tags: ['events', 'patterns', 'intermediate'],
  },

  // ─── PERFORMANCE ─────────────────────────────────────────────────────────────
  {
    id: 'node-cache-middleware',
    slug: 'node-cache-middleware',
    title: 'Build Response Cache Middleware',
    description: 'Create Express middleware that caches GET responses in an in-memory Map for a configurable TTL (seconds).',
    difficulty: 'intermediate',
    topic: 'Performance',
    starterCode: `const express = require('express');
const app = express();

// Build cacheMiddleware(ttlSeconds)
// - Only cache GET requests
// - Use req.originalUrl as key
// - Cache the JSON body + status code
// - Serve from cache if not expired, set X-Cache: HIT
// - On miss: let request proceed, intercept res.json to cache result

function cacheMiddleware(ttlSeconds) {
  return (req, res, next) => {
    // TODO
  };
}

app.use('/api/products', cacheMiddleware(60));

app.get('/api/products', (req, res) => {
  // Simulates slow DB query
  const data = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
  res.json(data);
});

app.listen(3000);`,
    solution: `function cacheMiddleware(ttlSeconds) {
  const store = new Map(); // key → { data, statusCode, expiresAt }

  return (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = req.originalUrl;
    const cached = store.get(key);

    if (cached && Date.now() < cached.expiresAt) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(cached.statusCode).json(cached.data);
    }

    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        store.set(key, {
          data,
          statusCode: res.statusCode,
          expiresAt: Date.now() + ttlSeconds * 1000,
        });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}`,
    hints: [
      'Use a Map to store cache entries',
      'Store expiresAt = Date.now() + ttl * 1000',
      'Intercept res.json by reassigning it on the res object',
      'Only cache status 200 responses',
    ],
    explanation: 'Intercepting res.json lets you capture what the route handler returns without changing the route code. In production, replace Map with Redis for persistence and multi-server support.',
    tags: ['performance', 'caching', 'middleware', 'intermediate'],
  },

  // ─── ERROR HANDLING ───────────────────────────────────────────────────────────
  {
    id: 'node-error-handler',
    slug: 'node-error-handler',
    title: 'Build a Centralized Error Handler',
    description: 'Create an Express error handler middleware that maps different error types to correct HTTP status codes and returns consistent JSON.',
    difficulty: 'intermediate',
    topic: 'Error Handling',
    starterCode: `// Handle these error types:
// - AppError (has statusCode and code properties)
// - Prisma P2025 → 404 Not Found
// - Prisma P2002 → 409 Conflict
// - JsonWebTokenError → 401 Invalid Token
// - TokenExpiredError → 401 Token Expired
// - Everything else → 500 Internal Server Error

// Response format:
// { error: { code: string, message: string } }

function errorHandler(err, req, res, next) {
  // TODO
}

module.exports = errorHandler;`,
    solution: `function errorHandler(err, req, res, next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  // Map known error types
  if (err.code === 'P2025') {
    statusCode = 404; code = 'NOT_FOUND'; message = 'Record not found';
  } else if (err.code === 'P2002') {
    statusCode = 409; code = 'CONFLICT'; message = 'Record already exists';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401; code = 'INVALID_TOKEN'; message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401; code = 'TOKEN_EXPIRED'; message = 'Token expired';
  } else if (err.name === 'ValidationError') {
    statusCode = 422; code = 'VALIDATION_ERROR';
  }

  // Log server errors (not client errors)
  if (statusCode >= 500) {
    console.error('SERVER ERROR:', { message: err.message, stack: err.stack });
  }

  const body = { error: { code, message } };
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    body.error.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;`,
    hints: [
      'Check err.code for Prisma errors (P2025, P2002)',
      'Check err.name for JWT errors (JsonWebTokenError, TokenExpiredError)',
      'Only log 5xx errors — 4xx are expected client behavior',
      'Only show stack trace in development environment',
    ],
    explanation: 'A centralized error handler is the single point where all errors flow through. It maps library-specific errors (Prisma, JWT) to HTTP responses so route handlers do not need to know about HTTP status codes.',
    tags: ['error-handling', 'express', 'intermediate'],
  },

  // ─── MODULES ─────────────────────────────────────────────────────────────────
  {
    id: 'node-cjs-module',
    slug: 'node-cjs-module',
    title: 'Create a CommonJS Utility Module',
    description: 'Create a math utilities module that exports add, subtract, multiply, divide (throws on zero), and isPrime functions.',
    difficulty: 'beginner',
    topic: 'Modules',
    starterCode: `// math.js — export: add, subtract, multiply, divide, isPrime

// index.js — test imports
const { add, subtract, multiply, divide, isPrime } = require('./math');

console.log(add(10, 5));        // 15
console.log(subtract(10, 3));   // 7
console.log(multiply(4, 5));    // 20
console.log(divide(10, 2));     // 5
console.log(isPrime(17));       // true
console.log(isPrime(18));       // false

try {
  divide(10, 0); // should throw
} catch (e) {
  console.log(e.message); // "Division by zero"
}`,
    solution: `// math.js
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

module.exports = { add, subtract, multiply, divide, isPrime };`,
    hints: [
      'isPrime: check up to Math.sqrt(n) — any factor above sqrt has a corresponding factor below',
      'module.exports = { fn1, fn2 } exports multiple functions',
      'throw new Error("message") for division by zero',
    ],
    explanation: 'CommonJS uses module.exports to export. The require() in another file gets the exports object. Module is cached after first require() — the same object is returned on all subsequent requires.',
    tags: ['modules', 'commonjs', 'beginner'],
  },
];
