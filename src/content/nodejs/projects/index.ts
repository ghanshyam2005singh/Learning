import type { Project } from '@/types';

export const projects: Project[] = [
  // ─── PROJECT 1: Notes API ─────────────────────────────────────────────────────
  {
    id: 'nodejs-notes-api',
    slug: 'nodejs-notes-api',
    title: 'Notes REST API',
    description: 'Build a full CRUD REST API for notes with Express, in-memory storage, validation, pagination, and proper error handling.',
    difficulty: 'beginner',
    estimatedTime: '3 hours',
    techStack: ['Node.js', 'Express', 'Zod'],
    features: [
      'CRUD operations (Create, Read, Update, Delete)',
      'Zod validation for all inputs',
      'Pagination with ?page and ?limit',
      'Search by title',
      'Consistent JSON error responses',
      'Request logging middleware',
      'Health check endpoint',
    ],
    folderStructure: `notes-api/
├── src/
│   ├── app.js              # Express setup
│   ├── server.js           # Entry point
│   ├── routes/
│   │   └── notes.js
│   ├── schemas/
│   │   └── notes.schema.js
│   └── middleware/
│       ├── validate.js
│       └── errorHandler.js
└── package.json`,
    steps: [
      {
        title: 'Set up the project',
        description: 'Initialize npm, install dependencies, and create the entry point.',
        code: `npm init -y
npm install express zod
npm install --save-dev nodemon

# package.json scripts:
# "dev": "nodemon src/server.js"
# "start": "node src/server.js"`,
        hint: 'Keep dependencies minimal — only what you actually need.',
      },
      {
        title: 'Create validation schemas',
        description: 'Define Zod schemas for creating and updating notes.',
        code: `// src/schemas/notes.schema.js
const { z } = require('zod');

const CreateNoteSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  content: z.string().trim().min(1, 'Content is required'),
  tags: z.array(z.string().trim().toLowerCase()).max(10).default([]),
});

const UpdateNoteSchema = CreateNoteSchema.partial(); // all fields optional

const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});

const IdParamSchema = z.object({
  id: z.string().min(1),
});

module.exports = { CreateNoteSchema, UpdateNoteSchema, QuerySchema, IdParamSchema };`,
        hint: 'Define schemas before routes — they are the contract.',
      },
      {
        title: 'Build the routes',
        description: 'Implement all 5 CRUD routes for notes.',
        code: `// src/routes/notes.js
const { Router } = require('express');
const { z } = require('zod');
const { CreateNoteSchema, UpdateNoteSchema, QuerySchema, IdParamSchema } = require('../schemas/notes.schema');
const { validate } = require('../middleware/validate');
const asyncHandler = require('../middleware/asyncHandler');

const router = Router();
const notes = new Map();

router.get('/', validate(QuerySchema, 'query'), asyncHandler(async (req, res) => {
  let { page, limit, search } = req.query;
  let all = [...notes.values()];
  if (search) all = all.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
  const total = all.length;
  const data = all.slice((page - 1) * limit, page * limit);
  res.json({ data, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

router.post('/', validate(CreateNoteSchema), asyncHandler(async (req, res) => {
  const id = \`note-\${Date.now()}\`;
  const note = { id, ...req.body, createdAt: new Date().toISOString() };
  notes.set(id, note);
  res.status(201).json(note);
}));

router.get('/:id', validate(IdParamSchema, 'params'), asyncHandler(async (req, res) => {
  const note = notes.get(req.params.id);
  if (!note) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
  res.json(note);
}));

router.put('/:id', validate(UpdateNoteSchema), asyncHandler(async (req, res) => {
  if (!notes.has(req.params.id)) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
  const updated = { ...notes.get(req.params.id), ...req.body, updatedAt: new Date().toISOString() };
  notes.set(req.params.id, updated);
  res.json(updated);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  if (!notes.has(req.params.id)) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
  notes.delete(req.params.id);
  res.status(204).end();
}));

module.exports = router;`,
        hint: 'DELETE returns 204 No Content — no body. GET list always returns an array, even if empty.',
      },
      {
        title: 'Wire up the Express app',
        description: 'Create app.js with middleware and routes, server.js for listening.',
        code: `// src/app.js
const express = require('express');
const notesRouter = require('./routes/notes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/notes', notesRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

// src/server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Notes API running on port \${PORT}\`));`,
        hint: 'Separate app.js (Express setup) from server.js (listen) — makes testing easier.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why return 204 No Content for DELETE instead of 200?',
        answer: '204 is semantically correct — the operation succeeded but there is nothing to return. 200 implies a response body. REST conventions: POST → 201 Created, DELETE → 204 No Content, GET/PUT/PATCH → 200 OK. Using correct status codes makes your API self-documenting.',
        difficulty: 'beginner',
      },
      {
        question: 'Why use Map for in-memory storage instead of an array?',
        answer: 'Map gives O(1) lookup by key (ID). Array requires O(n) search with .find(). For a notes API where you frequently find/update/delete by ID, Map is significantly faster. Also Map preserves insertion order and has .has(), .get(), .set(), .delete() methods that map naturally to database operations.',
        difficulty: 'beginner',
      },
    ],
    tags: ['express', 'rest', 'validation', 'beginner'],
  },

  // ─── PROJECT 2: Authentication System ────────────────────────────────────────
  {
    id: 'nodejs-auth-system',
    slug: 'nodejs-auth-system',
    title: 'Authentication System',
    description: 'Build a complete authentication system with registration, login, JWT access/refresh tokens, protected routes, and logout.',
    difficulty: 'intermediate',
    estimatedTime: '5 hours',
    techStack: ['Node.js', 'Express', 'bcrypt', 'jsonwebtoken', 'Zod'],
    features: [
      'User registration with password hashing',
      'Login with JWT access + refresh token',
      'Refresh token in httpOnly cookie',
      'Protected route middleware',
      'Role-based access (user, admin)',
      'Logout (revoke refresh token)',
      'Get current user (/auth/me)',
      'Proper error codes (TOKEN_EXPIRED, INVALID_TOKEN)',
    ],
    folderStructure: `auth-system/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   └── errorHandler.js
│   ├── schemas/
│   │   └── auth.schema.js
│   └── db/
│       └── users.js   # in-memory "database"
└── package.json`,
    steps: [
      {
        title: 'Set up token utilities',
        description: 'Create functions to generate and verify access and refresh tokens.',
        code: `// src/utils/tokens.js
const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-min-32-chars!!';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-min-32-chars!!';

function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };`,
        hint: 'Use separate secrets for access and refresh tokens. If one leaks, the other is unaffected.',
      },
      {
        title: 'Build the auth routes',
        description: 'Implement register, login, refresh, logout, and /me endpoints.',
        code: `// src/routes/auth.js
const { Router } = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokens');

const router = Router();
const users = new Map();         // email → user object
const refreshTokens = new Set(); // valid refresh tokens (use DB in production)

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'name, email, and password required' });
    if (users.has(email)) return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already registered' } });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = { id: crypto.randomUUID(), email, name, passwordHash, role: 'user', createdAt: new Date().toISOString() };
    users.set(email, user);

    const tokenPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    refreshTokens.add(refreshToken);

    const { passwordHash: _, ...publicUser } = user;
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
       .status(201)
       .json({ accessToken, user: publicUser });
  } catch (err) { next(err); }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = users.get(email);
    const dummyHash = '$2b$12$invalidhashfortimingrandomness00';
    const valid = await bcrypt.compare(password, user?.passwordHash || dummyHash);

    if (!user || !valid) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    refreshTokens.add(refreshToken);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
       .json({ accessToken });
  } catch (err) { next(err); }
});

// POST /auth/refresh
router.post('/refresh', (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token || !refreshTokens.has(token)) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' } });
  }
  try {
    const decoded = verifyRefreshToken(token);
    const accessToken = generateAccessToken({ sub: decoded.sub, email: decoded.email, role: decoded.role });
    res.json({ accessToken });
  } catch {
    refreshTokens.delete(token);
    res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: 'Refresh token expired' } });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) refreshTokens.delete(token);
  res.clearCookie('refreshToken').json({ message: 'Logged out' });
});

module.exports = router;`,
        hint: 'Use a dummy hash for timing safety — always run bcrypt.compare even if user does not exist.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why store the refresh token in an httpOnly cookie instead of localStorage?',
        answer: 'httpOnly cookies are inaccessible to JavaScript — only the browser sends them automatically in HTTP requests. localStorage is accessible to any JavaScript on the page, making it vulnerable to XSS attacks (malicious scripts can steal tokens). With httpOnly cookies + Secure + SameSite=Strict, even if an attacker injects JavaScript, they cannot steal the refresh token.',
        difficulty: 'intermediate',
      },
      {
        question: 'Why use a dummy bcrypt hash for non-existent users?',
        answer: 'Timing attack: if you return "user not found" immediately (without running bcrypt), the response is fast (~1ms). For existing users with wrong passwords, bcrypt.compare takes ~250ms. An attacker can distinguish these response times to enumerate which emails are registered. Running bcrypt.compare with a dummy hash even for non-existent users makes all login attempts take the same time.',
        difficulty: 'advanced',
      },
    ],
    tags: ['auth', 'jwt', 'security', 'intermediate'],
  },

  // ─── PROJECT 3: Blog Backend ──────────────────────────────────────────────────
  {
    id: 'nodejs-blog-backend',
    slug: 'nodejs-blog-backend',
    title: 'Blog Backend API',
    description: 'Build a complete blog API with posts, comments, categories, authentication, and role-based access control.',
    difficulty: 'intermediate',
    estimatedTime: '8 hours',
    techStack: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Zod'],
    features: [
      'User auth (register, login, JWT)',
      'Posts CRUD with slug generation',
      'Comments on posts',
      'Categories and tags',
      'Admin vs user roles',
      'Pagination and search',
      'Draft vs published status',
      'Soft delete (deletedAt)',
    ],
    folderStructure: `blog-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   └── schemas/
└── package.json`,
    steps: [
      {
        title: 'Define the Prisma schema',
        description: 'Create the database schema for users, posts, comments, and categories.',
        code: `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String
  passwordHash String
  role         Role      @default(USER)
  posts        Post[]
  comments     Comment[]
  createdAt    DateTime  @default(now())
}

enum Role { USER ADMIN }

model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  status      PostStatus @default(DRAFT)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  category    Category? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  tags        String[]
  comments    Comment[]
  views       Int       @default(0)
  deletedAt   DateTime? // soft delete
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([status, createdAt])
  @@index([slug])
}

enum PostStatus { DRAFT PUBLISHED ARCHIVED }

model Comment {
  id        String   @id @default(cuid())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]
}`,
        hint: 'Add indexes on frequently-queried fields. Soft delete (deletedAt) lets you restore deleted posts.',
      },
      {
        title: 'Build the posts service',
        description: 'Implement business logic for creating, reading, updating, and deleting posts.',
        code: `// src/services/posts.service.js
const prisma = require('../config/database');
const { AppError } = require('../utils/errors');

function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\\s+/g, '-')
    .slice(0, 100);
}

async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 0;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = \`\${baseSlug}-\${++counter}\`;
  }
  return slug;
}

async function create(authorId, data) {
  const baseSlug = generateSlug(data.title);
  const slug = await ensureUniqueSlug(baseSlug);
  return prisma.post.create({
    data: { ...data, slug, authorId },
    include: { author: { select: { id: true, name: true } }, category: true },
  });
}

async function findAll({ page = 1, limit = 20, status, categoryId, search, authorId }) {
  const where = {
    deletedAt: null,
    ...(status ? { status } : { status: 'PUBLISHED' }),
    ...(categoryId ? { categoryId } : {}),
    ...(authorId ? { authorId } : {}),
    ...(search ? { OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]} : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true } }, category: true },
    }),
    prisma.post.count({ where }),
  ]);

  return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

module.exports = { create, findAll };`,
        hint: 'Use $transaction to run count and findMany in parallel — one round-trip instead of two.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is soft delete and why use it?',
        answer: 'Soft delete marks records as deleted (deletedAt timestamp) instead of removing them from the database. Benefits: (1) Data recovery — accidentally deleted posts can be restored. (2) Audit trail — you can see what was deleted and when. (3) Referential integrity — related data (comments) still has a valid reference. (4) Analytics — historical data for reports. Trade-off: every query must filter WHERE deletedAt IS NULL, or you accidentally return deleted records.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['express', 'prisma', 'postgresql', 'auth', 'intermediate'],
  },

  // ─── PROJECT 4: URL Shortener ─────────────────────────────────────────────────
  {
    id: 'nodejs-url-shortener',
    slug: 'nodejs-url-shortener',
    title: 'URL Shortener Backend',
    description: 'Build a URL shortener with custom aliases, click tracking, Redis caching, and rate limiting.',
    difficulty: 'intermediate',
    estimatedTime: '6 hours',
    techStack: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Redis', 'Zod'],
    features: [
      'Shorten URLs (auto-generated or custom code)',
      'Redirect with 301/302',
      'Click tracking (total clicks, last clicked)',
      'Redis caching for fast lookups',
      'Rate limiting per IP',
      'Expiry dates for links',
      'Analytics endpoint (top links)',
    ],
    folderStructure: `url-shortener/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── links.js    # POST /links, GET /links/:code/stats
│   │   └── redirect.js # GET /:code → redirect
│   ├── services/
│   │   └── links.service.js
│   └── cache/
│       └── redis.js
└── package.json`,
    steps: [
      {
        title: 'Schema and short code generation',
        description: 'Define the Link model and implement URL shortening logic.',
        code: `// prisma/schema.prisma
model Link {
  id        String    @id @default(cuid())
  code      String    @unique  // short code: 'abc123'
  url       String              // original URL
  clicks    Int       @default(0)
  lastClickAt DateTime?
  expiresAt  DateTime?
  createdAt  DateTime  @default(now())
  @@index([code])
}

// src/services/links.service.js
const crypto = require('crypto');
const prisma = require('../config/database');
const redis = require('../cache/redis');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CACHE_TTL = 3600; // 1 hour

function generateCode(length = 7) {
  return crypto.randomBytes(length)
    .toString('base64url')
    .slice(0, length)
    .replace(/[^a-zA-Z0-9]/g, 'x');
}

async function createLink({ url, code, expiresAt }) {
  // Use custom code or generate unique one
  const shortCode = code || await generateUniqueCode();
  const link = await prisma.link.create({
    data: { code: shortCode, url, expiresAt: expiresAt ? new Date(expiresAt) : null },
  });
  return { ...link, shortUrl: \`\${BASE_URL}/\${link.code}\` };
}

async function generateUniqueCode() {
  for (let i = 0; i < 10; i++) {
    const code = generateCode();
    const exists = await prisma.link.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new Error('Could not generate unique code');
}

async function resolveLink(code) {
  // Check Redis first
  const cached = await redis.get(\`link:\${code}\`);
  if (cached) return JSON.parse(cached);

  const link = await prisma.link.findUnique({ where: { code } });
  if (!link) return null;
  if (link.expiresAt && link.expiresAt < new Date()) return null;

  // Cache for 1 hour
  await redis.setex(\`link:\${code}\`, CACHE_TTL, JSON.stringify(link));
  return link;
}

async function recordClick(code) {
  await prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 }, lastClickAt: new Date() },
  });
  // Invalidate cache so next resolve gets fresh click count
  await redis.del(\`link:\${code}\`);
}

module.exports = { createLink, resolveLink, recordClick };`,
        hint: 'Cache URL lookups in Redis — redirects are read-heavy. Invalidate on click to keep stats fresh.',
      },
      {
        title: 'Build the redirect route',
        description: 'Handle short code lookups and redirects with click tracking.',
        code: `// src/routes/redirect.js
const { Router } = require('express');
const { resolveLink, recordClick } = require('../services/links.service');

const router = Router();

router.get('/:code', async (req, res, next) => {
  try {
    const link = await resolveLink(req.params.code);

    if (!link) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Short link not found or expired' } });
    }

    // Record click asynchronously — do not wait for DB write
    recordClick(req.params.code).catch(console.error);

    // 302 for trackable redirects (not cached by browsers)
    // Use 301 only for permanent links you never want to change
    res.redirect(302, link.url);
  } catch (err) {
    next(err);
  }
});

module.exports = router;`,
        hint: 'Do not await recordClick — users should be redirected immediately. Fire-and-forget for analytics.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use 302 instead of 301 for URL shortener redirects?',
        answer: '301 (Permanent) is cached by browsers indefinitely — if you later change where a short code points, browsers will still go to the old destination. 302 (Found/Temporary) is not cached, so every redirect goes through your server. This gives you control to update destinations and enables accurate click tracking (301 redirects bypass the server after the first visit).',
        difficulty: 'intermediate',
      },
      {
        question: 'How does Redis caching help URL shorteners?',
        answer: 'URL shorteners have a heavily read-biased workload — one URL is created but may be clicked thousands of times. Caching the code→url mapping in Redis means most lookups are served in <1ms from memory rather than ~10ms from PostgreSQL. This dramatically reduces database load. Invalidate the cache on updates (URL change) or record click to keep data accurate.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['redis', 'caching', 'express', 'prisma', 'intermediate'],
  },

  // ─── PROJECT 5: Chat Backend ──────────────────────────────────────────────────
  {
    id: 'nodejs-chat-backend',
    slug: 'nodejs-chat-backend',
    title: 'Real-Time Chat Backend',
    description: 'Build a real-time chat system with Socket.IO — rooms, private messages, typing indicators, presence, and message persistence.',
    difficulty: 'advanced',
    estimatedTime: '10 hours',
    techStack: ['Node.js', 'Express', 'Socket.IO', 'Prisma', 'PostgreSQL', 'Redis'],
    features: [
      'JWT authentication for WebSocket connections',
      'Chat rooms (join, leave, list members)',
      'Real-time messaging with history',
      'Private direct messages',
      'Typing indicators',
      'Online presence (who is online)',
      'Message read receipts',
      'Redis adapter for multi-server scaling',
    ],
    folderStructure: `chat-backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── socket/
│   │   ├── index.js      # Socket.IO setup
│   │   ├── auth.js       # Socket auth middleware
│   │   ├── rooms.js      # Room event handlers
│   │   └── messages.js   # Message event handlers
│   ├── routes/
│   │   ├── auth.js
│   │   └── rooms.js      # REST: create/list rooms
│   └── services/
│       ├── messages.service.js
│       └── rooms.service.js
└── package.json`,
    steps: [
      {
        title: 'Socket.IO authentication middleware',
        description: 'Authenticate WebSocket connections using JWT before allowing them to connect.',
        code: `// src/socket/auth.js
const jwt = require('jsonwebtoken');

function socketAuth(socket, next) {
  // Token can come from auth header or handshake query
  const token = socket.handshake.auth?.token ||
                socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.user = decoded; // { sub, email, role }
    next();
  } catch (err) {
    next(new Error(err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'));
  }
}

module.exports = socketAuth;

// src/socket/index.js
const { Server } = require('socket.io');
const socketAuth = require('./auth');
const registerRoomHandlers = require('./rooms');
const registerMessageHandlers = require('./messages');

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.ALLOWED_ORIGINS?.split(','), credentials: true },
  });

  // Apply auth middleware to all connections
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(\`User \${socket.user.email} connected: \${socket.id}\`);

    // Join personal room for direct messages
    socket.join(\`user:\${socket.user.sub}\`);

    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(\`User \${socket.user.email} disconnected\`);
      // Broadcast offline status to rooms this user was in
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.to(room).emit('user:offline', { userId: socket.user.sub, email: socket.user.email });
        }
      });
    });
  });

  return io;
}

module.exports = initializeSocket;`,
        hint: 'socket.user persists throughout the socket lifecycle — set it in middleware, read it in handlers.',
      },
      {
        title: 'Room and message handlers',
        description: 'Implement joining rooms, sending messages, and typing indicators.',
        code: `// src/socket/rooms.js
const messageService = require('../services/messages.service');

function registerRoomHandlers(io, socket) {
  // Join a room
  socket.on('room:join', async ({ roomId }) => {
    socket.join(roomId);

    // Get recent messages
    const history = await messageService.getRecent(roomId, 50);
    socket.emit('room:history', { roomId, messages: history });

    // Notify others
    socket.to(roomId).emit('room:user_joined', {
      roomId,
      user: { id: socket.user.sub, email: socket.user.email },
    });
  });

  socket.on('room:leave', ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('room:user_left', {
      roomId,
      userId: socket.user.sub,
    });
  });

  // Typing indicators
  const typingTimers = new Map();

  socket.on('typing:start', ({ roomId }) => {
    socket.to(roomId).emit('typing:start', {
      roomId,
      user: { id: socket.user.sub, email: socket.user.email },
    });

    // Auto-stop after 3 seconds of no activity
    clearTimeout(typingTimers.get(roomId));
    typingTimers.set(roomId, setTimeout(() => {
      io.to(roomId).emit('typing:stop', { roomId, userId: socket.user.sub });
    }, 3000));
  });

  socket.on('typing:stop', ({ roomId }) => {
    clearTimeout(typingTimers.get(roomId));
    socket.to(roomId).emit('typing:stop', { roomId, userId: socket.user.sub });
  });
}

// src/socket/messages.js
function registerMessageHandlers(io, socket) {
  socket.on('message:send', async ({ roomId, content }) => {
    if (!content?.trim()) return;

    const message = await messageService.create({
      roomId,
      content: content.trim(),
      senderId: socket.user.sub,
    });

    // Send to all in room (including sender for confirmation)
    io.to(roomId).emit('message:received', message);
  });

  // Direct message
  socket.on('message:direct', async ({ toUserId, content }) => {
    const message = await messageService.createDirect({
      content,
      senderId: socket.user.sub,
      receiverId: toUserId,
    });

    // Send to recipient's personal room
    io.to(\`user:\${toUserId}\`).emit('message:received', message);
    // Confirm to sender
    socket.emit('message:received', message);
  });
}

module.exports = registerMessageHandlers;`,
        hint: 'Auto-stop typing after 3s inactivity — users forget to emit typing:stop. socket.rooms includes the socket\'s own room (socket.id) — filter it out.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you authenticate WebSocket connections?',
        answer: 'WebSocket connections cannot use Authorization headers in the initial handshake from most browsers. Instead: (1) Pass JWT in socket.handshake.auth.token (Socket.IO handshake payload) or as a query parameter. (2) Verify in Socket.IO middleware (io.use()). (3) Attach user to socket for use in event handlers. The token is the same JWT used for REST API calls — no separate auth system needed.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you send a message to a specific user who might be connected on any server?',
        answer: 'Each user joins a personal room (user:{userId}) on connect. To send a direct message, emit to io.to("user:{userId}"). With the Redis adapter, this event is published to Redis and all Socket.IO servers receive it — they forward it to any socket in that room on their server. The sender does not need to know which server the recipient is on.',
        difficulty: 'advanced',
      },
    ],
    tags: ['websocket', 'socket.io', 'realtime', 'advanced'],
  },
];
