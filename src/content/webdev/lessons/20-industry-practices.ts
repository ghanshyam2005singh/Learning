import type { Lesson } from '@/types';

export const industryPracticesLesson: Lesson = {
  id: 'industry-engineering-practices',
  slug: 'industry-engineering-practices',
  title: 'Industry Engineering Practices',
  description:
    'Logging, monitoring, analytics, documentation, testing, error tracking, observability, and production readiness — the practices that separate professional code from student code.',
  category: 'Production',
  order: 20,
  difficulty: 'advanced',
  estimatedTime: 28,
  content: `The difference between a project that looks good on GitHub and a project that runs reliably in production is not the features — it is the engineering practices around it.

Production systems need logging, monitoring, error tracking, and observability before something breaks — not after.

---

## Logging

**Why logging matters:**

When your application breaks at 3 AM, logs are the only clue you have. Without good logs, you spend hours guessing.

**What to log:**
\`\`\`typescript
// Log at every important boundary:
// - Requests in / responses out
// - External API calls
// - Database operations (slow queries especially)
// - Authentication events
// - Errors with full context
// - Business events (user signed up, payment processed)

// Structured logging (JSON) — searchable, parseable
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // In production: no pretty printing, machine-parseable JSON
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty' }
    : undefined,
});

// Log levels:
// debug: development only, verbose internal state
// info: normal operations (user logged in, request processed)
// warn: something unexpected but not broken (deprecated API call)
// error: something broke but the service is still running
// fatal: service cannot continue operating

// Example usage:
logger.info({ userId: req.user.id, path: req.path }, 'Request received');

logger.error({
  err: error,
  userId: req.user?.id,
  requestId: res.locals.requestId,
  body: req.body,
}, 'Payment processing failed');
\`\`\`

**Request logging middleware:**
\`\`\`typescript
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  res.locals.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
    }, 'Request completed');

    // Alert on slow requests
    if (duration > 2000) {
      logger.warn({ requestId, duration, path: req.path }, 'Slow request detected');
    }
  });

  next();
});
\`\`\`

**What NOT to log:**
\`\`\`
✗ Passwords (obviously)
✗ Credit card numbers
✗ JWT tokens
✗ Social security numbers
✗ Full request bodies that may contain sensitive data
\`\`\`

---

## Error Tracking

Logs tell you what happened. Error tracking tells you how often it happened, which users were affected, and what code path caused it.

**Sentry integration:**
\`\`\`typescript
// Install: npm install @sentry/node @sentry/nextjs
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,   // sample 10% of transactions for performance
  // Release tracking — ties errors to specific deployments
  release: process.env.VERCEL_GIT_COMMIT_SHA,
});

// Express middleware (must be before routes)
app.use(Sentry.Handlers.requestHandler());

// After all routes (captures unhandled errors)
app.use(Sentry.Handlers.errorHandler());

// Manual error capture with context:
try {
  await processPayment(orderId);
} catch (error) {
  Sentry.withScope(scope => {
    scope.setUser({ id: req.user.id, email: req.user.email });
    scope.setExtra('orderId', orderId);
    scope.setTag('feature', 'payments');
    Sentry.captureException(error);
  });
  throw error; // re-throw after capturing
}
\`\`\`

**Sentry gives you:**
- Error grouping (same error = one issue, not thousands)
- Affected users count
- Stack trace with source maps
- Release tracking (this error appeared in v1.3.2)
- Email/Slack alerts on new errors

---

## Monitoring

Monitoring answers: is my application healthy right now?

**Key metrics to monitor:**

\`\`\`
Infrastructure:
  CPU utilization (alert > 80%)
  Memory usage (alert > 85%)
  Disk usage (alert > 80%)

Application:
  Request rate (requests per second)
  Error rate (% of requests returning 5xx)
  Latency (p50, p95, p99 response times)
  Database connection pool usage

Business:
  Active users
  Sign-ups per day
  Revenue / payment success rate
\`\`\`

**Uptime monitoring:**
\`\`\`
UptimeRobot (free): pings your health endpoint every 5 minutes
Better Uptime (paid): faster checks, status page, incident management

Set up alerts to:
  - Email when site is down
  - Slack channel for team awareness
  - PagerDuty for on-call rotation (large teams)
\`\`\`

**Application Performance Monitoring:**
\`\`\`
Vercel Analytics: built-in Core Web Vitals tracking
Sentry Performance: trace slow endpoints and database queries
Datadog / New Relic: full APM for large teams (expensive)
\`\`\`

---

## Analytics

Analytics tell you what users actually do in your product.

**Event tracking with Posthog (open source, can self-host):**
\`\`\`typescript
import posthog from 'posthog-js';

// Track user actions
posthog.capture('lesson_completed', {
  lesson_id: lesson.id,
  lesson_title: lesson.title,
  track: 'javascript',
  time_spent_seconds: timeSpentSeconds,
});

posthog.capture('purchase_completed', {
  plan: 'pro',
  revenue: 9.99,
  currency: 'USD',
});

// Identify logged-in users
posthog.identify(user.id, {
  email: user.email,
  plan: user.plan,
  createdAt: user.createdAt,
});

// Server-side tracking (for sensitive events)
const serverPosthog = new PostHog(process.env.POSTHOG_API_KEY);
serverPosthog.capture({
  distinctId: user.id,
  event: 'payment_processed',
  properties: { orderId, amount, currency },
});
\`\`\`

**Key metrics to track:**
\`\`\`
Acquisition: how did users find you?
Activation: did users complete the key action?
Retention: do users come back?
Revenue: are users paying?
Referral: do users bring other users?

The most important metric for a product:
  D1/D7/D30 retention — what % of users come back after 1/7/30 days?
\`\`\`

---

## Testing

Not all tests are equal. Focus on tests that prevent real production problems.

**Testing pyramid:**
\`\`\`
       /\\
      /  \\    E2E tests (few, slow, expensive)
     /----\\   End-to-end browser tests (Playwright/Cypress)
    /      \\
   /--------\\  Integration tests
  /          \\ API routes with real database
 /------------\\ Unit tests (many, fast, cheap)
/              \\ Pure functions, services with mocked dependencies
\`\`\`

**What must be tested (minimum):**
\`\`\`typescript
// Critical paths that must never break:
// 1. Authentication (signup, login, logout, token refresh)
// 2. Payment flow (checkout, webhook processing)
// 3. Core CRUD operations (create, read, update, delete main entities)
// 4. Authorization (users can only access their own data)

// Example: Integration test for auth
describe('POST /api/auth/login', () => {
  it('returns JWT token for valid credentials', async () => {
    await createUser({ email: 'test@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined(); // never expose hash
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns same error for wrong email and wrong password', async () => {
    const wrongEmail = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notexist@example.com', password: 'anything' });

    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    // Same error message prevents user enumeration
    expect(wrongEmail.body.error.message).toBe(wrongPassword.body.error.message);
  });
});
\`\`\`

---

## Observability

Observability is the ability to understand the internal state of your system from its external outputs.

**The three pillars:**
\`\`\`
Logs:    What happened?
Metrics: How often? How fast? How many?
Traces:  Where in the system did this request spend time?
\`\`\`

**Distributed tracing:**
\`\`\`typescript
// Add a request ID to every log entry
// So you can trace one request across multiple log lines

// middleware
app.use((req, res, next) => {
  const traceId = req.headers['x-trace-id'] as string || crypto.randomUUID();
  res.locals.traceId = traceId;
  res.setHeader('X-Trace-Id', traceId);

  // All logs in this request context include the trace ID
  req.log = logger.child({ traceId, requestId: crypto.randomUUID() });
  next();
});

// Usage:
req.log.info({ userId: req.user.id }, 'Processing payment');
req.log.error({ err: error }, 'Payment failed');

// Now in your log aggregator (Logtail, Datadog, CloudWatch):
// Search: traceId = "abc-123"
// → See every log line from this request: auth, db query, payment, response
\`\`\`

---

## Production Readiness Checklist

\`\`\`
BEFORE GOING LIVE:

Security:
[ ] HTTPS configured
[ ] Helmet middleware active
[ ] CORS restricted to production domains
[ ] No secrets in code or logs
[ ] Input validation on all endpoints
[ ] Rate limiting on auth endpoints

Observability:
[ ] Structured logging (pino/winston)
[ ] Error tracking (Sentry)
[ ] Uptime monitoring (UptimeRobot)
[ ] Health check endpoint /health

Database:
[ ] Connection pooling configured
[ ] Migrations run before code deploys
[ ] Backup configured (daily)
[ ] Indexes on all foreign keys and query columns

Performance:
[ ] Static assets served from CDN
[ ] Image optimization
[ ] Database queries tested with production-size data

Operations:
[ ] Runbook: how to restart the service if it crashes
[ ] Rollback plan: how to revert a bad deployment
[ ] Incident response: who to contact if things break
\`\`\``,
  codeExamples: [
    {
      title: 'Production-Ready Error Handler with Sentry',
      code: `// Complete error handling setup
import * as Sentry from '@sentry/node';

// Custom error classes
export class AppError extends Error {
  public readonly isOperational = true;
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Global error handler middleware
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Operational errors (our own AppError subclasses): expected, well-handled
  if (err instanceof AppError) {
    // Don't send to Sentry — we expected these
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
      requestId: res.locals.requestId,
    });
  }

  // Unexpected errors: log and track
  const requestId = res.locals.requestId;

  logger.error({
    err,
    requestId,
    method: req.method,
    path: req.path,
    userId: req.user?.id,
  }, 'Unhandled error');

  // Send to Sentry with request context
  Sentry.withScope(scope => {
    scope.setTag('requestId', requestId);
    scope.setUser({ id: req.user?.id, email: req.user?.email });
    scope.setExtra('path', req.path);
    scope.setExtra('method', req.method);
    Sentry.captureException(err);
  });

  // Never expose internal error details to clients in production
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'An unexpected error occurred' : (err as Error).message,
    },
    requestId,
  });
}`,
      explanation:
        'Operational errors (validation, not found, forbidden) are returned as clean API responses without Sentry. Unexpected errors are logged, sent to Sentry, and return a generic 500 to never expose internal details in production.',
    },
  ],
  commonMistakes: [
    'Not setting up error tracking before launch — you will not know what is broken until users complain',
    'Logging too much (every SQL query in production) or too little (no request logging)',
    'Not using structured logging (console.log strings instead of JSON objects) — impossible to search',
    'Logging sensitive data (user passwords, auth tokens, credit card numbers)',
    'Having no backup strategy for the database — test your backups by restoring them',
    'No uptime monitoring — finding out your site is down from Twitter mentions',
    'Testing only the happy path — production breaks on the edge cases you did not test',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between logging and monitoring?',
      answer:
        'Logging records what happened — structured event records with context (who, what, when, request ID). Monitoring observes system health in real-time — metrics like error rate, response time, CPU usage, and uptime. Together: logs help you diagnose what happened after the fact; monitoring tells you something is wrong right now. Error tracking (Sentry) bridges the gap — it groups log-level errors into trackable issues.',
      difficulty: 'intermediate',
    },
    {
      question: 'What does observability mean and why does it matter?',
      answer:
        'Observability is the ability to understand the internal state of a system from its external outputs — logs, metrics, and traces. It matters because in production you cannot attach a debugger. When something breaks at 3 AM, observability determines how quickly you can find and fix it. The three pillars: logs (what happened), metrics (how often and how fast), traces (where in the distributed system did the request spend time).',
      difficulty: 'advanced',
    },
    {
      question: 'What is structured logging and why is it better than console.log?',
      answer:
        'Structured logging outputs machine-parseable JSON objects instead of human-readable strings. console.log("User 123 logged in at 10:30") is a string — you cannot search for specific user IDs or filter by time efficiently. logger.info({ userId: 123, event: "login", timestamp: "..." }) is structured — log aggregation tools (Logtail, Datadog, CloudWatch) can filter, search, and alert on specific field values.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'add-logging-to-route',
      title: 'Add Production Logging to an API Route',
      description:
        'Take this bare API route and add: request/response logging, error capture, performance tracking, and security (never log the request body for auth routes).',
      starterCode: `// BEFORE: no observability
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    const token = generateToken(user.id);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});`,
      solution: `// AFTER: production-ready logging
app.post('/api/auth/login', async (req, res) => {
  const requestId = res.locals.requestId;
  const start = Date.now();

  // Log the attempt (NOT the password or full body)
  logger.info({
    requestId,
    event: 'login_attempt',
    email: req.body.email,  // ok to log email
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  }, 'Login attempt');

  try {
    const user = await authService.login(req.body.email, req.body.password);
    const token = generateToken(user.id);

    const duration = Date.now() - start;

    // Log success
    logger.info({
      requestId,
      event: 'login_success',
      userId: user.id,
      duration,
    }, 'User logged in successfully');

    // Analytics event
    posthog.capture({
      distinctId: user.id,
      event: 'user_login',
      properties: { method: 'email_password' },
    });

    res.json({ data: { token, user: sanitizeUser(user) } });

  } catch (error) {
    const duration = Date.now() - start;

    if (error instanceof AppError) {
      // Expected error (wrong credentials)
      logger.warn({
        requestId,
        event: 'login_failure',
        email: req.body.email,
        reason: error.code,
        duration,
        ip: req.ip,
      }, 'Login failed');

      return res.status(error.statusCode).json({
        error: { code: error.code, message: error.message },
        requestId,
      });
    }

    // Unexpected error — send to Sentry
    Sentry.withScope(scope => {
      scope.setTag('requestId', requestId);
      scope.setExtra('email', req.body.email);
      Sentry.captureException(error);
    });

    logger.error({ requestId, err: error, duration }, 'Login - unexpected error');

    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred' },
      requestId,
    });
  }
});`,
      hints: [
        'Never log the password — ever, in any context',
        'Log both success and failure events — security teams need both',
        'Include requestId in every log line — makes it possible to trace a request',
        'Expected errors (wrong credentials) go to logger.warn, not Sentry',
      ],
    },
  ],
  keyTakeaways: [
    'Structured logging (JSON) is searchable; console.log strings are not — use pino or winston',
    'Error tracking (Sentry) groups exceptions, counts affected users, and ties errors to releases',
    'Monitoring: uptime check (UptimeRobot) + error rate + latency = minimum production setup',
    'Analytics tracks user behavior; logging tracks system behavior — you need both',
    'The testing pyramid: many fast unit tests, some integration tests, few slow E2E tests',
    'Observability = logs (what happened) + metrics (how often) + traces (where in the system)',
    'Production readiness checklist: HTTPS, error tracking, uptime monitoring, backups, health endpoint',
  ],
  nextLesson: 'revision-hub',
  prevLesson: 'guided-projects',
};
