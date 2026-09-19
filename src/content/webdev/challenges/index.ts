import type { Challenge } from '@/types';

export const webdevChallenges: Challenge[] = [
  {
    id: 'rest-api-design',
    slug: 'rest-api-design',
    title: 'Design a REST API',
    description:
      'Given the requirements for a task management app, design the complete REST API: all endpoints, HTTP methods, URL structure, request/response shapes, and HTTP status codes.',
    difficulty: 'intermediate',
    topic: 'API Design',
    starterCode: `// Task Management App API Design
// Entities: User, Project, Task, Comment
//
// Requirements:
// - Users can create projects
// - Projects have multiple tasks
// - Tasks can be assigned to users
// - Tasks have: title, description, status (todo/in-progress/done), due_date
// - Users can comment on tasks
//
// Design the REST API endpoints:

// Authentication:
// POST /api/auth/...

// Projects:
// GET  /api/...

// Tasks:
// GET  /api/...

// Comments:
// GET  /api/...`,
    solution: `// Authentication:
// POST /api/auth/signup    → { email, password, name } → 201 { user, token }
// POST /api/auth/login     → { email, password } → 200 { user, token }
// POST /api/auth/logout    → (auth required) → 204
// GET  /api/auth/me        → (auth required) → 200 { user }

// Projects:
// GET    /api/projects                → 200 { data: Project[], meta: { pagination } }
// POST   /api/projects                → { name, description } → 201 { data: Project }
// GET    /api/projects/:id            → 200 { data: Project }
// PATCH  /api/projects/:id            → { name?, description? } → 200 { data: Project }
// DELETE /api/projects/:id            → 204

// Tasks:
// GET    /api/projects/:projectId/tasks     → ?status=todo&assignee=userId&sort=due_date
//        → 200 { data: Task[], meta: { pagination } }
// POST   /api/projects/:projectId/tasks     → { title, description, assigneeId?, dueDate? }
//        → 201 { data: Task }
// GET    /api/tasks/:id                     → 200 { data: Task }
// PATCH  /api/tasks/:id                     → { title?, description?, status?, assigneeId?, dueDate? }
//        → 200 { data: Task }
// DELETE /api/tasks/:id                     → 204
// PATCH  /api/tasks/:id/assign              → { userId } → 200 { data: Task }

// Comments:
// GET    /api/tasks/:taskId/comments  → 200 { data: Comment[], meta: { pagination } }
// POST   /api/tasks/:taskId/comments  → { content } → 201 { data: Comment }
// PATCH  /api/comments/:id            → { content } → 200 { data: Comment }
// DELETE /api/comments/:id            → 204

// Error responses always:
// { error: { code: 'ERROR_CODE', message: '...', details?: [...] }, requestId: '...' }`,
    hints: [
      'Start with authentication endpoints — everything else requires auth',
      'Nested URLs show ownership relationships (/projects/:id/tasks)',
      'Include query params for filtering on list endpoints',
      'Every list endpoint needs to support pagination',
    ],
    explanation:
      'REST API design uses resource-based URLs with HTTP methods. Nesting (projects/:id/tasks) shows the relationship between resources. List endpoints must support pagination, filtering, and sorting via query parameters. Error responses must be consistent across all endpoints.',
    tags: ['api-design', 'rest', 'backend', 'architecture'],
  },
  {
    id: 'database-schema-design',
    slug: 'database-schema-design',
    title: 'Design a Database Schema',
    description:
      'Design the complete PostgreSQL schema for a hotel booking system. Users can book rooms, rooms have types and amenities, bookings have payment status.',
    difficulty: 'intermediate',
    topic: 'Database Design',
    starterCode: `-- Hotel Booking System Schema
-- Draw ER diagram first (in comments), then write CREATE TABLE statements

-- ENTITIES:
-- Hotel
-- Room (belongs to hotel, has type: single/double/suite)
-- User
-- Booking (user books a room for date range)
-- Payment

-- ER DIAGRAM (sketch in comments):
-- Hotel ─── ? ─── Room
-- Room  ─── ? ─── Booking
-- User  ─── ? ─── Booking

-- SCHEMA:
CREATE TABLE hotels (
  -- ...
);`,
    solution: `-- ER DIAGRAM:
-- Hotel 1:n Room (hotel has many rooms)
-- Room 1:n Booking (room has many bookings, non-overlapping)
-- User 1:n Booking (user has many bookings)
-- Booking 1:1 Payment (one payment per booking)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
  description TEXT,
  amenities JSONB DEFAULT '[]',  -- ["pool", "gym", "spa"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_number VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'double', 'suite', 'deluxe')),
  max_guests INTEGER NOT NULL DEFAULT 2,
  price_per_night DECIMAL(10, 2) NOT NULL,
  amenities JSONB DEFAULT '[]',  -- ["balcony", "sea_view", "jacuzzi"]
  active BOOLEAN DEFAULT true,
  UNIQUE(hotel_id, room_number)
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount DECIMAL(10, 2) NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (check_out > check_in),  -- must check out after check in
  CHECK (guests >= 1)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'refunded', 'failed')),
  stripe_payment_id VARCHAR,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_room_id ON bookings(room_id);
CREATE INDEX idx_bookings_dates ON bookings(room_id, check_in, check_out);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- CONSTRAINT: Prevent overlapping bookings for the same room
-- (Enforced in application layer with SELECT FOR UPDATE, or exclusion constraint)
-- CREATE EXTENSION IF NOT EXISTS btree_gist;
-- ALTER TABLE bookings ADD CONSTRAINT no_overlap
--   EXCLUDE USING GIST (room_id WITH =, daterange(check_in, check_out) WITH &&)
--   WHERE (status != 'cancelled');`,
    hints: [
      'Draw the ER diagram first — count the relationships',
      'Bookings must prevent overlapping dates for the same room',
      'Use DECIMAL for money, DATE for dates (not TIMESTAMPTZ for check-in/out)',
      'What is the ON DELETE behavior for bookings? You never want to delete user data with financial records',
    ],
    explanation:
      'The booking system requires careful constraint design. UNIQUE(hotel_id, room_number) prevents duplicate room numbers. CHECK(check_out > check_in) enforces valid date range. ON DELETE RESTRICT on bookings protects financial records. The overlap constraint requires an application-level check or PostgreSQL exclusion constraint.',
    tags: ['database', 'schema-design', 'postgresql', 'architecture'],
  },
  {
    id: 'implement-auth-flow',
    slug: 'implement-auth-flow',
    title: 'Implement JWT Authentication',
    description:
      'Implement a complete JWT authentication system: signup, login, logout, and a protected route. Use bcrypt for passwords and proper error responses.',
    difficulty: 'intermediate',
    topic: 'Authentication',
    starterCode: `import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-min-32-chars-long';

// In-memory user store for this challenge (real apps use a database)
const users: Array<{ id: string; email: string; passwordHash: string; name: string }> = [];

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  // TODO:
  // 1. Validate email, password (min 8 chars), name
  // 2. Check if email already exists
  // 3. Hash password with bcrypt
  // 4. Create user
  // 5. Generate JWT
  // 6. Return { user (without hash), token }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  // TODO:
  // 1. Find user by email
  // 2. Verify password
  // 3. Same error for wrong email AND wrong password
  // 4. Generate JWT
  // 5. Return { user, token }
});

// GET /api/auth/me (protected route)
app.get('/api/auth/me', (req, res) => {
  // TODO:
  // 1. Extract Bearer token from Authorization header
  // 2. Verify JWT
  // 3. Find user by decoded userId
  // 4. Return user (without password hash)
});`,
    solution: `import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-must-be-at-least-32-chars';

const users: Array<{ id: string; email: string; passwordHash: string; name: string }> = [];

function sanitizeUser(user: typeof users[0]) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid email' } });
  }
  if (!password || password.length < 8) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters' } });
  }
  if (!name || name.trim().length < 2) {
    return res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: 'Name too short' } });
  }

  const existing = users.find(u => u.email === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already registered' } });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = { id: crypto.randomUUID(), email: email.toLowerCase(), passwordHash, name: name.trim() };
  users.push(user);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });

  res.status(201).json({ data: { user: sanitizeUser(user), token } });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email?.toLowerCase());
  const isValid = user && await bcrypt.compare(password, user.passwordHash);

  // Same error for wrong email AND wrong password (prevents user enumeration)
  if (!isValid) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });

  res.json({ data: { user: sanitizeUser(user), token } });
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = users.find(u => u.id === payload.userId);

    if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'User not found' } });

    res.json({ data: { user: sanitizeUser(user) } });
  } catch {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
});`,
    hints: [
      'bcrypt.compare() handles salt comparison automatically',
      'Use the same error message for wrong email and wrong password',
      'Never return passwordHash in any response',
      'jwt.verify() throws an exception if the token is invalid or expired',
    ],
    explanation:
      'The key security points: bcrypt hashing with salt rounds >= 12, same error message for wrong email and wrong password (prevents user enumeration), JWT with expiry, and sanitizing the user before returning (never expose passwordHash).',
    tags: ['authentication', 'jwt', 'security', 'backend'],
  },
];
