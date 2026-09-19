import type { InterviewQuestion } from '@/types';

export const webdevInterviewQuestions: InterviewQuestion[] = [
  {
    question: 'What is the difference between SSR, SSG, and CSR?',
    answer:
      'CSR (Client-Side Rendering) sends empty HTML and a JavaScript bundle. React runs in the browser, fetches data, and renders. Good for dashboards and logged-in apps. SSR (Server-Side Rendering) renders HTML per request on the server with real data. Browser gets pre-rendered content immediately. Good for SEO and feeds. SSG (Static Site Generation) renders at build time and serves from CDN. Fastest possible load but data may be stale. Good for blogs and marketing sites. ISR (Next.js) regenerates SSG pages in the background after a timeout.',
    difficulty: 'intermediate',
    followUp: ['When would you choose SSR over SSG?', 'How does hydration work?'],
  },
  {
    question: 'What is the layered architecture pattern for backend applications?',
    answer:
      'The layered pattern separates concerns: Controller handles HTTP (parses request, calls service, formats response — no business logic). Service handles business logic (authorization rules, orchestration — no HTTP or DB details). Repository handles data access (all SQL queries — no business logic). This separation allows testing services independently, swapping databases without changing business logic, and reusing service functions from HTTP handlers, CLI scripts, and background jobs.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is SQL injection and how do you prevent it?',
    answer:
      'SQL injection is when user-provided input is concatenated directly into a SQL query, allowing an attacker to modify the query structure. Example: a naive query builds WHERE email = \'[user_input]\' by string concatenation. An attacker submits \'\' OR 1=1 -- as the email, turning the query into WHERE email = \'\' OR 1=1 -- which returns all users. Prevention: always use parameterized queries where values are passed as separate arguments — db.query("SELECT * FROM users WHERE email = $1", [email]). The database treats the parameter as literal data, never as SQL syntax. ORMs like Prisma and Drizzle parameterize automatically.',
    difficulty: 'beginner',
    followUp: ['What other injection attacks exist?', 'How does an ORM protect against SQL injection?'],
  },
  {
    question: 'What is XSS and how does React prevent it?',
    answer:
      'XSS (Cross-Site Scripting) is when attacker-controlled HTML or JavaScript is rendered in a victim\'s browser. React prevents it by escaping all content rendered via JSX interpolation — angle brackets and special characters are converted to HTML entities. The only exception is dangerouslySetInnerHTML which bypasses escaping. When you must render HTML (rich text content), sanitize it first with DOMPurify before passing to dangerouslySetInnerHTML.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is the N+1 query problem?',
    answer:
      'N+1 occurs when you make 1 query to get a list, then N additional queries for each item. Example: query 20 posts (1 query), then for each post query the author (20 queries) = 21 queries total. Fix: use a JOIN to fetch posts and authors in one query, or use a batch query (SELECT * FROM users WHERE id = ANY($1)) to get all authors in one query. TanStack Query and tools like DataLoader help batch requests automatically.',
    difficulty: 'intermediate',
    followUp: ['How would you detect an N+1 problem in production?'],
  },
  {
    question: 'What is a database transaction and when do you need one?',
    answer:
      'A transaction is a set of operations that either all succeed or all roll back together (atomicity). You need one whenever multiple database operations must be consistent — transferring money (debit one account, credit another), creating an order (create order + create order_items + decrement stock), or any multi-step write that must not be left in a partial state. In PostgreSQL: BEGIN → operations → COMMIT (or ROLLBACK if error). Prisma wraps multiple operations in a transaction with prisma.$transaction([...]).',
    difficulty: 'intermediate',
  },
  {
    question: 'What is the difference between authentication and authorization?',
    answer:
      'Authentication verifies identity: are you who you say you are? It validates credentials (email + password, token). Authorization verifies permissions: given that we know who you are, are you allowed to do this? It checks roles and ownership. In code: authentication middleware verifies the JWT and attaches the user to the request. Authorization checks in service functions verify if this user has permission for this specific resource or action.',
    difficulty: 'beginner',
  },
  {
    question: 'How do you design a REST API URL structure?',
    answer:
      'Use plural nouns for collections (/users, /posts). Use :id for specific resources (/users/123). Nest to show ownership relationships (/users/123/posts for posts belonging to user 123, but max 2-3 levels deep). Use HTTP methods for the operation (GET retrieves, POST creates, PUT replaces, PATCH partially updates, DELETE removes). Use query params for filtering, sorting, and pagination (/posts?category=tech&sort=newest&page=2). Never put verbs in URLs (/getUser is wrong, GET /users/:id is correct).',
    difficulty: 'beginner',
    followUp: ['When do you need to version a REST API?', 'What is the difference between PUT and PATCH?'],
  },
  {
    question: 'How would you approach debugging a production API that is returning 500 errors?',
    answer:
      'First assess scope: is it all endpoints or specific ones? Is it 100% or intermittent? Then check error tracking (Sentry) for the actual exception and stack trace. Check deployment history: did something deploy recently? Check database metrics: connection pool exhausted? CPU spike? Read application logs for the specific error pattern. Reproduce in staging. Fix the root cause (not just the symptom). Deploy and verify. Post-mortem: why did tests not catch this? What process change prevents recurrence?',
    difficulty: 'advanced',
    tip: 'Interviewers want to hear your systematic approach, not just "check the logs". Show that you reduce scope before diving deep.',
  },
  {
    question: 'What makes an API design good vs bad?',
    answer:
      'Good API design: consistent resource-based URLs, correct HTTP methods and status codes, consistent error response format with error codes, pagination on all list endpoints, versioned (/api/v1/) to allow non-breaking evolution, documented (OpenAPI/Swagger). Bad API design: verbs in URLs (/getUser), returning 200 for errors, inconsistent error formats (sometimes { error: message }, sometimes { message: error }), no pagination (returns all records), no versioning (breaking changes break clients), no documentation.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is CI/CD and why is it important?',
    answer:
      'CI (Continuous Integration) runs automated tests on every push, catching bugs before they reach production. CD (Continuous Deployment) automatically deploys code that passes tests to production. Together they eliminate manual deployment, ensure every deployment is tested, allow multiple deployments per day safely, and provide an audit trail of what changed when. Without CI/CD, deployments are risky, infrequent events that teams fear. With CI/CD, they are routine and safe.',
    difficulty: 'beginner',
  },
  {
    question: 'What does production readiness mean for a web application?',
    answer:
      'Production readiness means: HTTPS configured, security headers (Helmet), CORS restricted to known origins, input validation on all endpoints, secrets in environment variables not code. Structured logging (pino/winston), error tracking (Sentry), uptime monitoring (UptimeRobot), health check endpoint. Database indexes on FK columns and query columns, connection pooling, daily backups, automated migrations. Performance: static assets on CDN, images optimized, pagination on list endpoints. Documentation: README, runbook, rollback plan.',
    difficulty: 'advanced',
  },
  {
    question: 'What is the difference between horizontal and vertical scaling?',
    answer:
      'Vertical scaling adds more resources to an existing server (more CPU, more RAM). Simple but has hardware limits and creates a single point of failure. Horizontal scaling adds more servers and distributes load. Requires stateless application design (no server-side session memory), a load balancer, and usually a shared cache (Redis). Horizontal scales infinitely in theory and provides redundancy. For most web apps: vertical scaling gets you far; horizontal is needed at significant traffic.',
    difficulty: 'intermediate',
  },
  {
    question: 'How do you secure file uploads?',
    answer:
      'Validate file type using magic bytes (actual file signature), not the extension — a PHP script can be renamed to image.jpg. Limit file size to prevent resource exhaustion. Never use user-provided filenames — use UUID-based names to prevent overwriting and enumeration. Store files in cloud storage (S3, R2), not on the application server (lost on redeploy). Strip EXIF metadata from images (GPS location, device info). Serve files through CDN, not directly from your app. Validate content type in HTTP headers matches actual bytes.',
    difficulty: 'intermediate',
  },
  {
    question: 'What is CSRF and how do you prevent it?',
    answer:
      'CSRF (Cross-Site Request Forgery) tricks an authenticated user\'s browser into making state-changing requests to your application from a malicious site. The browser automatically sends session cookies, so your server thinks it is a legitimate request. Prevention: SameSite=Strict or SameSite=Lax cookie attribute (browser will not send cookies on cross-site requests), CSRF tokens (unique per-session token that must be included in state-changing requests), and CORS configured to only allow requests from your own origin.',
    difficulty: 'intermediate',
  },
];
