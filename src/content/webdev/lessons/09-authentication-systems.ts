import type { Lesson } from '@/types';

export const authSystemsLesson: Lesson = {
  id: 'authentication-systems',
  slug: 'authentication-systems',
  title: 'Authentication Systems',
  description:
    'Build complete authentication: signup, login, JWT, sessions, OAuth, social login, RBAC, and user management. Full application flow with security best practices.',
  category: 'Backend Systems',
  order: 9,
  difficulty: 'intermediate',
  estimatedTime: 35,
  content: `Authentication is one of the most critical systems in any application. A broken auth system exposes user data, allows account takeover, and creates legal liability.

This module builds the complete authentication flow for a production application. You implement it from scratch to understand exactly what happens inside the libraries you will use.

---

## The Authentication Problem

When a user submits a username and password, the server must:
1. Verify the credentials are correct
2. Remember the user for future requests (without asking them to log in every time)
3. Give other parts of the application a way to know who is making a request

Sessions and JWT tokens are two solutions to step 2 and 3.

---

## Password Storage

**Never store passwords in plain text.**

If your database is compromised and you stored plain text passwords, every user account is immediately accessible. If passwords are hashed, the attacker has to crack each hash individually.

\`\`\`typescript
import bcrypt from 'bcrypt';

// NEVER DO THIS:
const user = { email, password: plainTextPassword };

// ALWAYS DO THIS:
const SALT_ROUNDS = 12; // higher = slower = more secure, but also slower to verify
const passwordHash = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
const user = { email, passwordHash };

// Verification (login):
const isValid = await bcrypt.compare(submittedPassword, user.passwordHash);
// bcrypt automatically handles the salt — it is embedded in the hash
\`\`\`

**Why bcrypt:**
- Designed specifically for passwords — intentionally slow
- Automatically generates and embeds a salt (prevents rainbow table attacks)
- Adjustable work factor — can increase as hardware gets faster

---

## Complete Signup Flow

\`\`\`typescript
// auth.service.ts
import bcrypt from 'bcrypt';
import { usersRepository } from '../users/users.repository';
import { ConflictError, ValidationError } from '@/lib/errors';
import { generateToken, generateRefreshToken } from './auth.utils';

export const authService = {
  async signup(email: string, password: string, name: string) {
    // 1. Validate input
    if (!email.includes('@')) throw new ValidationError('Invalid email');
    if (password.length < 8) throw new ValidationError('Password must be at least 8 characters');
    if (name.trim().length < 2) throw new ValidationError('Name too short');

    // 2. Check if email already exists
    const existing = await usersRepository.findByEmail(email.toLowerCase());
    if (existing) throw new ConflictError('Email already registered');

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Create the user
    const user = await usersRepository.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name.trim(),
    });

    // 5. Generate tokens
    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // 6. Store refresh token (optional but recommended)
    await usersRepository.saveRefreshToken(user.id, refreshToken);

    // 7. Send welcome email (async, don't block)
    emailService.sendWelcome(user.email, user.name).catch(console.error);

    return { user: sanitizeUser(user), accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    // 1. Find user
    const user = await usersRepository.findByEmail(email.toLowerCase());

    // 2. Verify password (use same error message for missing user and wrong password)
    // This prevents user enumeration attacks
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // 3. Check account status
    if (user.deletedAt) throw new UnauthorizedError('Account not found');
    if (user.suspendedAt) throw new ForbiddenError('Account suspended');

    // 4. Generate tokens
    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await usersRepository.saveRefreshToken(user.id, refreshToken);

    return { user: sanitizeUser(user), accessToken, refreshToken };
  },
};

// Never return the passwordHash to the client
function sanitizeUser(user: User) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
\`\`\`

---

## JWT (JSON Web Tokens)

A JWT is a signed token that proves the server issued it. The server signs it with a secret. Any server with the same secret can verify it — no database lookup required.

**JWT Structure:**
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9    ← Header (base64)
.
eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJleHAiOjE3MzM5MDYwMDB9  ← Payload (base64)
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (HMAC with secret)
\`\`\`

\`\`\`typescript
// auth.utils.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '15m' }  // short-lived access token
  );
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' }  // long-lived refresh token
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
}
\`\`\`

**Access Token vs Refresh Token:**

| | Access Token | Refresh Token |
|---|---|---|
| Lifespan | Short (15 min) | Long (30 days) |
| Purpose | Authorize API requests | Get a new access token |
| Storage | Memory or localStorage | httpOnly cookie |
| Database lookup | Not required | Required (to check if revoked) |

**Token refresh flow:**
\`\`\`
Access token expires
  ↓
Client sends refresh token to /api/auth/refresh
  ↓
Server validates refresh token (checks DB if not revoked)
  ↓
Server returns new access token
  ↓
Client uses new access token
\`\`\`

---

## Session-Based Authentication

Sessions store authentication state on the server.

\`\`\`typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { redisClient } from '@/lib/redis';

// Setup
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,   // not accessible by JavaScript
    secure: true,     // HTTPS only
    sameSite: 'lax',  // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}));

// Login: save userId in session
async function loginHandler(req, res) {
  const user = await authService.login(req.body.email, req.body.password);
  req.session.userId = user.id;
  res.json({ user });
}

// Auth middleware: check session
function authenticate(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  req.userId = req.session.userId;
  next();
}

// Logout: destroy session
function logoutHandler(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
}
\`\`\`

---

## OAuth — Social Login

OAuth allows users to log in with Google, GitHub, or other providers.

**OAuth 2.0 Flow:**

\`\`\`
User clicks "Login with Google"
  ↓
Redirect to Google:
  https://accounts.google.com/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/auth/google/callback
  &scope=email profile
  &response_type=code
  &state=random_csrf_token
  ↓
User approves permissions on Google
  ↓
Google redirects to your callback URL:
  https://yourapp.com/auth/google/callback?code=4/0AbcDEF...&state=random_csrf_token
  ↓
Your server exchanges code for tokens:
  POST https://oauth2.googleapis.com/token
  { code, client_id, client_secret, redirect_uri }
  ↓
Google returns access_token
  ↓
Your server fetches user profile:
  GET https://www.googleapis.com/userinfo/v2/me
  Authorization: Bearer access_token
  ↓
{ id: "123456", email: "user@gmail.com", name: "John Doe" }
  ↓
Your server: find or create user in your database
  → if new: INSERT INTO users (email, name, google_id, ...)
  → if existing: UPDATE users SET last_login = NOW()
  ↓
Your server generates your own JWT/session and returns it
\`\`\`

\`\`\`typescript
// Using Passport.js for OAuth
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find existing user by Google ID
    let user = await usersRepository.findByGoogleId(profile.id);

    if (!user) {
      // First time: check if email already exists (link accounts)
      user = await usersRepository.findByEmail(profile.emails![0].value);
      if (user) {
        // Link Google account to existing user
        await usersRepository.updateGoogleId(user.id, profile.id);
      } else {
        // Create new user
        user = await usersRepository.create({
          email: profile.emails![0].value,
          name: profile.displayName,
          googleId: profile.id,
          avatar: profile.photos?.[0].value,
        });
      }
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}));

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    // Redirect to frontend with token
    res.redirect(\`https://yourapp.com/auth/callback?token=\${token}\`);
  }
);
\`\`\`

---

## RBAC — Role-Based Access Control

RBAC controls what authenticated users are allowed to do.

\`\`\`typescript
// Simple role-based authorization
type Role = 'user' | 'moderator' | 'admin';

const PERMISSIONS = {
  'posts:read': ['user', 'moderator', 'admin'],
  'posts:create': ['user', 'moderator', 'admin'],
  'posts:delete:own': ['user', 'moderator', 'admin'],
  'posts:delete:any': ['moderator', 'admin'],
  'users:ban': ['moderator', 'admin'],
  'users:delete': ['admin'],
  'settings:access': ['admin'],
} as const;

function requirePermission(permission: keyof typeof PERMISSIONS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role as Role;
    const allowedRoles = PERMISSIONS[permission];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage in routes:
router.delete('/posts/:id',
  authenticate,
  requirePermission('posts:delete:any'),
  postsController.delete
);

// Or check in service for own vs any:
async function deletePost(postId: string, requestingUser: { id: string, role: Role }) {
  const post = await postsRepository.findById(postId);
  if (!post) throw new NotFoundError('Post not found');

  const isOwner = post.authorId === requestingUser.id;
  const canDeleteAny = ['moderator', 'admin'].includes(requestingUser.role);

  if (!isOwner && !canDeleteAny) {
    throw new ForbiddenError('Cannot delete this post');
  }

  await postsRepository.delete(postId);
}
\`\`\`

---

## Password Reset Flow

\`\`\`typescript
async function requestPasswordReset(email: string) {
  const user = await usersRepository.findByEmail(email);

  // Always respond success even if email not found
  // This prevents user enumeration ("that email is not registered")
  if (!user) return { success: true };

  // Generate cryptographically secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await passwordResetRepository.create({
    userId: user.id,
    tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
    expiresAt,
  });

  await emailService.sendPasswordReset(user.email, token);

  return { success: true };
}

async function resetPassword(token: string, newPassword: string) {
  // Hash the token from the URL to compare with stored hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const resetRecord = await passwordResetRepository.findByHash(tokenHash);

  if (!resetRecord) throw new ValidationError('Invalid or expired reset link');
  if (resetRecord.expiresAt < new Date()) throw new ValidationError('Reset link expired');
  if (resetRecord.usedAt) throw new ValidationError('Reset link already used');

  // Update password
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await usersRepository.updatePassword(resetRecord.userId, passwordHash);

  // Invalidate the reset token
  await passwordResetRepository.markUsed(resetRecord.id);

  // Optional: invalidate all existing sessions/refresh tokens
  await usersRepository.invalidateAllTokens(resetRecord.userId);
}
\`\`\`

---

## Email Verification

\`\`\`typescript
// After signup, send verification email
async function sendVerificationEmail(userId: string, email: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  await emailVerificationRepository.create({ userId, tokenHash, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });

  await emailService.sendVerification(email, token);
}

async function verifyEmail(token: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = await emailVerificationRepository.findByHash(tokenHash);

  if (!record || record.expiresAt < new Date()) {
    throw new ValidationError('Invalid or expired verification link');
  }

  await usersRepository.markEmailVerified(record.userId);
  await emailVerificationRepository.delete(record.id);
}
\`\`\``,
  codeExamples: [
    {
      title: 'Complete Auth Routes Setup',
      code: `// auth.router.ts
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from './auth.controller';
import { authenticate } from '@/middleware/authenticate';

const router = Router();

// Rate limiting on auth routes to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per 15 min per IP
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // 5 signups per hour per IP
  message: { error: 'Too many accounts created. Try again later.' },
});

router.post('/signup', signupLimiter, authController.signup);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/me', authenticate, authController.me);

// OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.oauthCallback
);

export { router as authRouter };`,
      explanation:
        'Rate limiting on login and signup prevents brute force attacks. The /me route returns the current user. OAuth routes delegate to Passport.js for the OAuth dance.',
    },
  ],
  commonMistakes: [
    'Storing passwords in plain text or with weak hashing (MD5, SHA1) — use bcrypt with salt rounds >= 12',
    'Using the same error message for wrong email vs wrong password allows user enumeration attacks',
    'Storing JWTs in localStorage — accessible to XSS; prefer httpOnly cookies for sensitive apps',
    'Not implementing token refresh — forcing users to log in every 15 minutes is bad UX',
    'Not rate limiting authentication endpoints — open to brute force attacks',
    'Sending reset tokens in plain text in the database — store only the hash of the token',
    'Not invalidating all sessions when a user changes their password',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between authentication and authorization?',
      answer:
        'Authentication verifies identity: "Are you who you say you are?" (login with credentials). Authorization verifies permissions: "Are you allowed to do this?" (after authentication, can you delete this resource?). In code: authentication middleware verifies the JWT/session. Authorization checks in the service verify if the authenticated user has permission for the specific action.',
      difficulty: 'beginner',
    },
    {
      question: 'What is the difference between JWT and session-based auth?',
      answer:
        'JWT tokens are stateless: the server does not store them. Any server with the secret can verify a JWT — good for horizontal scaling. Sessions are stateful: the server stores session data (usually in Redis). Sessions can be immediately invalidated; JWTs cannot (they remain valid until expiry). JWTs are better for distributed systems; sessions offer more immediate control and are simpler to implement.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the OAuth 2.0 authorization code flow?',
      answer:
        'User is redirected to the provider (Google) with your client_id. User approves the permissions. Provider redirects back to your callback URL with a one-time authorization code. Your server exchanges this code for an access token by sending the code plus your client_secret to the provider. You use the access token to fetch the user\'s profile. Your server creates/finds the user in your database and issues your own session/JWT.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you implement RBAC?',
      answer:
        'Store a role field on the user (user, moderator, admin). Define a permissions map: which roles can do which actions. Create authorization middleware that checks if the user\'s role has the required permission before the route handler runs. For own vs. any (a user can delete their own post, an admin can delete any post), check ownership in the service layer. More fine-grained systems use a separate permissions table.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'implement-auth-middleware',
      title: 'Implement Auth Middleware Chain',
      description:
        'Implement three middleware functions: authenticate (verify JWT), requireRole (check user role), and requireOwnership (check if user owns the resource).',
      starterCode: `import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

// 1. Verify JWT and attach user to request
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // TODO: extract token from Authorization header
  // TODO: verify token
  // TODO: attach user to req.user
  // TODO: call next() or return 401
}

// 2. Check if user has required role
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: check req.user.role against allowed roles
    // TODO: call next() or return 403
  };
}

// 3. Check resource ownership (the resource must have a userId/authorId field)
export function requireOwnership(
  getResourceUserId: (req: Request) => Promise<string | null>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // TODO: get the resource owner's userId
    // TODO: compare with req.user.id
    // TODO: admins can bypass ownership check
  };
}`,
      solution: `import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: \`Access requires one of: \${roles.join(', ')}\`
      });
    }
    next();
  };
}

export function requireOwnership(
  getResourceUserId: (req: Request) => Promise<string | null>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Admins can do anything
      if (req.user.role === 'admin') return next();

      const ownerId = await getResourceUserId(req);
      if (!ownerId) return res.status(404).json({ error: 'Not found' });

      if (ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Usage:
// router.delete('/posts/:id',
//   authenticate,
//   requireOwnership(req => postsRepository.findAuthorId(req.params.id)),
//   postsController.delete
// );`,
      hints: [
        'The Authorization header format is: "Bearer <token>"',
        'jwt.verify throws an error if the token is invalid or expired',
        'Admins should bypass ownership checks — check role first',
        'requireOwnership needs to query the database to get the resource owner',
      ],
    },
  ],
  keyTakeaways: [
    'Always hash passwords with bcrypt (salt rounds >= 12) — never store plain text or MD5',
    'JWT: stateless, scalable, cannot be immediately revoked; Session: stateful, immediately revocable',
    'Use access tokens (short-lived) + refresh tokens (long-lived stored in httpOnly cookies)',
    'OAuth delegates authentication to a trusted provider (Google, GitHub) — your server creates its own session after',
    'Rate limit all authentication endpoints to prevent brute force attacks',
    'Never reveal whether an email exists during login or password reset — use generic error messages',
    'RBAC: store role on user, define permission map, check in middleware or service layer',
  ],
  nextLesson: 'file-storage',
  prevLesson: 'database-design',
};
