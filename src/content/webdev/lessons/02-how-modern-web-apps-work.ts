import type { Lesson } from '@/types';

export const howWebAppsWorkLesson: Lesson = {
  id: 'how-modern-web-apps-work',
  slug: 'how-modern-web-apps-work',
  title: 'How Modern Web Applications Work',
  description:
    'Trace the complete request lifecycle — from browser to CDN to server to database and back. Understand every layer: DNS, HTTP, APIs, auth, caching, and deployment.',
  category: 'Introduction',
  order: 2,
  difficulty: 'beginner',
  estimatedTime: 30,
  content: `You open Instagram on your phone. In less than two seconds you see your feed, stories, and notifications. Where did that data come from? How did it get to your screen? What happened in those two seconds?

Understanding the complete request lifecycle is foundational. Every bug you fix, every performance issue you debug, and every architecture decision you make is connected to how requests flow through a system.

---

## The Complete Picture

\`\`\`
                    ┌─────────┐
                    │  USER   │
                    └────┬────┘
                         │ types instagram.com
                         ▼
                    ┌─────────┐
                    │   DNS   │  Resolves domain to IP address
                    └────┬────┘
                         │ 157.240.22.35
                         ▼
                    ┌─────────┐
                    │   CDN   │  Serves static assets from nearby edge
                    └────┬────┘
                         │ HTML, CSS, JS bundle
                         ▼
                    ┌─────────┐
                    │ BROWSER │  Parses HTML, loads JS, runs React
                    └────┬────┘
                         │ API requests
                         ▼
               ┌─────────────────┐
               │  LOAD BALANCER  │  Distributes requests across servers
               └────────┬────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │ SERVER1 │  │ SERVER2 │  │ SERVER3 │  Application servers
     └────┬────┘  └─────────┘  └─────────┘
          │
          ├──────────────────────────┐
          ▼                          ▼
   ┌─────────────┐           ┌──────────────┐
   │    CACHE    │           │   DATABASE   │
   │   (Redis)   │           │ (PostgreSQL) │
   └─────────────┘           └──────────────┘
\`\`\`

---

## Step 1: Browser — The Client

The browser is the client. It is the program that sends requests and renders responses.

When you type a URL and press Enter, the browser does not immediately know where to go. It must first find the server.

**What the browser does:**
1. Parses the URL (protocol, domain, path, query params)
2. Asks DNS to resolve the domain to an IP address
3. Opens a TCP connection to that IP
4. Performs TLS handshake (for HTTPS)
5. Sends HTTP request
6. Receives HTTP response
7. Parses HTML, requests linked CSS/JS files
8. Renders the page
9. Executes JavaScript

**In a React/Next.js app:**
The browser downloads the JavaScript bundle, React initializes, and the app "hydrates" — attaches event listeners to the server-rendered HTML so it becomes interactive.

---

## Step 2: DNS — The Phone Book

DNS (Domain Name System) translates human-readable domain names into IP addresses.

\`\`\`
instagram.com  →  157.240.22.35
google.com     →  142.250.80.46
yourdomain.com →  your-server-ip
\`\`\`

**How DNS resolution works:**

\`\`\`
Browser: "What is instagram.com?"
  ↓
Local DNS cache: "Not found."
  ↓
OS resolver: "Not found."
  ↓
Recursive resolver (your ISP or 8.8.8.8): "Let me check..."
  ↓
Root nameserver: "Ask .com nameserver"
  ↓
.com nameserver: "Ask instagram.com nameserver"
  ↓
instagram.com nameserver: "157.240.22.35"
  ↓
Browser: "Got it. Connecting..."
\`\`\`

This entire process takes milliseconds. The result is cached — so the second time you visit instagram.com, the browser uses the cached IP.

**Why this matters for developers:**
- When you deploy, you configure DNS records to point your domain to your server
- DNS propagation takes time (up to 48 hours) — plan deployments around this
- Incorrect DNS is why "my site is online but my domain doesn't work"

---

## Step 3: CDN — Content Delivery Network

A CDN is a network of servers distributed globally. It stores copies of your static files (HTML, CSS, JS, images) close to your users.

\`\`\`
WITHOUT CDN:
User in India → Server in New York → Response: 200ms

WITH CDN:
User in India → CDN edge in Mumbai → Response: 20ms
\`\`\`

**What CDNs serve:**
- JavaScript bundles
- CSS files
- Images, fonts
- Videos
- Sometimes even HTML (for static sites)

**Popular CDNs:** Cloudflare, AWS CloudFront, Vercel Edge Network, Fastly

**For Next.js apps on Vercel:** static assets are automatically served from the CDN. Your API routes still hit the server.

---

## Step 4: The Server

The server receives the HTTP request and processes it. In a typical Node.js application:

\`\`\`
Incoming request: GET /api/feed

  ↓
Middleware stack:
  - Parse request body
  - Validate CORS headers
  - Verify authentication (JWT token)
  - Rate limit check

  ↓
Route handler:
  - Extract user ID from token
  - Query database for feed

  ↓
Database query:
  SELECT posts.*, users.username, users.avatar
  FROM posts
  JOIN follows ON posts.user_id = follows.followed_id
  WHERE follows.follower_id = $1
  ORDER BY posts.created_at DESC
  LIMIT 20;

  ↓
Response:
  JSON: { posts: [...], nextCursor: "..." }
\`\`\`

---

## Step 5: Database

The database is the single source of truth for your data. When the server needs data, it queries the database.

**Types of database reads:**

| Type | Example | Speed |
|------|---------|-------|
| Primary key lookup | Find user by ID | Very fast (microseconds) |
| Indexed column query | Find posts by user_id | Fast (milliseconds) |
| Full table scan | Find all users with name "John" without index | Slow (seconds on large tables) |
| Join across tables | Posts + users + likes | Depends on indexes |

**Why indexes matter:**
Without an index on \`user_id\`, finding all posts by a user requires scanning every row in the table. With an index, it jumps directly to the relevant rows. This is the difference between 2ms and 2 seconds on a large table.

---

## Step 6: Cache

A cache stores the result of expensive operations so they do not need to be recomputed.

\`\`\`
Request for user profile:

First request:
  ↓
Check cache (Redis): MISS
  ↓
Query database: 45ms
  ↓
Store in cache: SET user:123 <data> EX 300
  ↓
Return response

Second request (within 5 minutes):
  ↓
Check cache (Redis): HIT → return immediately: 2ms
\`\`\`

**What to cache:**
- User sessions
- Expensive database query results
- API responses from external services
- Computed values (follower counts, trending hashtags)

**What NOT to cache:**
- Sensitive financial data without careful invalidation
- Data that must be real-time accurate (bank balance)
- Data that changes frequently without a clear invalidation strategy

---

## Step 7: Authentication

Every private route must verify who is making the request.

**Token-based authentication (JWT):**

\`\`\`
LOGIN:
  User submits email + password
  Server validates credentials
  Server generates JWT token:
    { userId: 123, email: "user@example.com", exp: 1234567890 }
    Signed with server's secret key
  Token sent to browser
  Browser stores token (localStorage or httpOnly cookie)

SUBSEQUENT REQUESTS:
  Browser sends: Authorization: Bearer eyJhbGci...
  Server decodes token, verifies signature
  Extracts userId — no database lookup needed
  Processes request as user 123
\`\`\`

**Session-based authentication:**

\`\`\`
LOGIN:
  User submits credentials
  Server creates session in database/Redis:
    sessions:abc123 → { userId: 123, createdAt: ... }
  Browser receives session cookie: sessionId=abc123

SUBSEQUENT REQUESTS:
  Browser sends cookie automatically
  Server looks up session in Redis
  Gets userId — database lookup required
  Processes request
\`\`\`

---

## Step 8: APIs

The API (Application Programming Interface) is the contract between frontend and backend.

**REST API pattern:**

\`\`\`
GET    /api/users/:id          → Get user profile
POST   /api/users              → Create new user
PUT    /api/users/:id          → Update user (full replacement)
PATCH  /api/users/:id          → Update user (partial)
DELETE /api/users/:id          → Delete user

GET    /api/posts              → List posts
POST   /api/posts              → Create post
GET    /api/posts/:id          → Get single post
POST   /api/posts/:id/like     → Like a post
\`\`\`

**HTTP status codes you must know:**

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST that creates resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate entry (email already exists) |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Bug on the server |

---

## Step 9: Deployment

Your code runs in production on servers you do not physically touch.

**How a request reaches your code:**

\`\`\`
Internet
  ↓
Domain: api.yourdomain.com
  ↓
DNS → Load Balancer IP
  ↓
Load Balancer (Nginx or AWS ALB)
  → Routes to one of your servers
  ↓
Your Server (Node.js process)
  → Running inside a Docker container
  ↓
Your Code
\`\`\`

**What keeps it running:**
- Process managers (PM2) restart crashed Node.js processes
- Container orchestration (Docker + Kubernetes) restarts crashed containers
- Health checks detect and replace unhealthy servers
- Auto-scaling adds servers when traffic spikes

---

## The Instagram Example — Complete Flow

User opens Instagram on mobile:

1. App resolves \`i.instagram.com\` via DNS
2. TLS handshake establishes encrypted connection
3. App sends: \`GET /api/v1/feed/ Authorization: Bearer eyJ...\`
4. Load balancer picks a backend server
5. Server validates JWT, extracts user ID 456789
6. Checks Redis: \`feed:456789\` — MISS
7. Queries PostgreSQL (or Cassandra in reality): selects 12 posts with media URLs
8. Caches result in Redis for 60 seconds
9. Returns JSON with posts, stories, suggested accounts
10. App renders feed, lazy-loads images from CDN (S3 + CloudFront)
11. You see your feed in ~800ms

Every interaction — like, comment, story view, DM — is a separate API call following this same pattern.`,
  codeExamples: [
    {
      title: 'Complete API Request with Auth and Cache Check',
      code: `// Server-side request handling (Node.js + Express)
import express from 'express';
import redis from './lib/redis';
import db from './lib/db';
import { verifyToken } from './lib/auth';

const app = express();

// Middleware: authenticate every request
app.use('/api', async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = verifyToken(token); // decodes JWT, no DB lookup
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /api/feed — with cache
app.get('/api/feed', async (req, res) => {
  const cacheKey = \`feed:\${req.user.id}\`;

  // 1. Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached)); // returns in ~2ms
  }

  // 2. Cache miss — query database
  const { rows: posts } = await db.query(\`
    SELECT p.*, u.username, u.avatar_url
    FROM posts p
    JOIN follows f ON p.user_id = f.followed_id
    JOIN users u ON p.user_id = u.id
    WHERE f.follower_id = $1
    ORDER BY p.created_at DESC
    LIMIT 20
  \`, [req.user.id]);

  // 3. Store in cache for 60 seconds
  await redis.setex(cacheKey, 60, JSON.stringify(posts));

  res.json(posts);
});`,
      explanation:
        'This shows the three-layer read pattern: check cache → query database → store in cache. Every production API follows this pattern for performance.',
    },
    {
      title: 'Frontend — Making Authenticated API Calls',
      code: `// React hook for authenticated API calls
function useFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/feed', {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      }
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            // Token expired — redirect to login
            window.location.href = '/login';
            return;
          }
          throw new Error(\`API error: \${res.status}\`);
        }
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { posts, loading, error };
}`,
      explanation:
        'The frontend always sends the token in the Authorization header. It handles specific error codes (401 = redirect to login, other errors = show message).',
    },
  ],
  commonMistakes: [
    'Assuming the database is always fast — without proper indexes, queries on large tables can take seconds',
    'Not caching expensive queries — every call hitting the database creates unnecessary load',
    'Storing tokens in localStorage when httpOnly cookies are safer for sensitive applications',
    'Ignoring HTTP status codes — returning 200 for an error confuses clients',
    'Not understanding DNS TTL — changing DNS and expecting immediate effect in all clients',
    'Forgetting that CDN caches responses — pushing a bug fix but the CDN still serves the old version',
  ],
  interviewQuestions: [
    {
      question: 'What happens when you type a URL and press Enter?',
      answer:
        'DNS resolves the domain to an IP. Browser establishes TCP connection, performs TLS handshake for HTTPS. Sends HTTP GET request. Server processes the request, queries database if needed, returns HTTP response. Browser parses HTML, requests CSS/JS, renders the page, executes JavaScript. For SPAs, React hydrates and the app becomes interactive.',
      difficulty: 'intermediate',
      followUp: ['What is the difference between HTTP and HTTPS?', 'What is TLS and why does it matter?'],
    },
    {
      question: 'What is a CDN and why is it used?',
      answer:
        'A CDN (Content Delivery Network) is a globally distributed network of servers that stores cached copies of static assets near users. Instead of every user downloading files from one central server (high latency), they download from a nearby edge node (low latency). This reduces page load time, offloads traffic from origin servers, and improves availability.',
      difficulty: 'beginner',
    },
    {
      question: 'What is the difference between authentication and authorization?',
      answer:
        'Authentication answers "who are you?" — verifying identity via credentials (email/password, JWT token). Authorization answers "what can you do?" — checking if an authenticated user has permission to perform an action. A logged-in user (authenticated) might not be allowed to delete another user\'s post (not authorized).',
      difficulty: 'beginner',
    },
    {
      question: 'Why is caching important and what are the risks?',
      answer:
        'Caching stores expensive computation results (DB queries, API calls) so they can be reused without re-computation. This reduces database load and latency. The main risk is stale data — if the underlying data changes but the cache is not invalidated, users see outdated information. Cache invalidation strategy is one of the hardest problems in engineering.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'trace-the-request',
      title: 'Trace a Request Through the System',
      description:
        'Write out the complete step-by-step flow for: a user clicks "Post Tweet" on Twitter. Include every layer from browser click to data being saved and the UI updating.',
      starterCode: `// User clicks "Post Tweet"
// Tweet text: "Hello World!"
// User is logged in with JWT token

// Step 1: Browser
// Step 2:
// Step 3:
// Step 4:
// Step 5:
// Step 6:
// Step 7:
// Step 8:`,
      solution: `// User clicks "Post Tweet"
// Tweet text: "Hello World!"

// Step 1: Browser
// React onClick fires → sets loading state → calls createTweet()
// fetch('POST /api/tweets', { body: { text: "Hello World!" }, headers: { Authorization: "Bearer eyJ..." } })

// Step 2: DNS + Network
// Domain already resolved (cached from page load)
// HTTPS connection already established (reused)
// Request travels to CDN → CDN passes API requests to origin

// Step 3: Load Balancer
// Receives request, routes to least-busy app server

// Step 4: Server (Express middleware)
// Parse JSON body: { text: "Hello World!" }
// Verify JWT token → extract userId: 123
// Rate limit check: user has not exceeded 300 tweets/hour

// Step 5: Validation
// text.length <= 280 ✓
// text is not empty ✓
// No prohibited content ✓

// Step 6: Database
// INSERT INTO tweets (user_id, content, created_at) VALUES (123, 'Hello World!', NOW())
// Returns new tweet with id: 9876

// Step 7: Cache invalidation
// Delete user:123:timeline from Redis (timeline is now stale)
// Queue background job: fan out tweet to followers' feeds

// Step 8: Response
// HTTP 201 Created
// { tweet: { id: 9876, text: "Hello World!", createdAt: "..." } }

// Step 9: Browser
// React receives 201 response
// Prepends new tweet to local state
// Clears composer input
// Shows "Tweet sent" toast notification`,
      hints: [
        'Think about what validation must happen before writing to the database',
        'What happens to the cache when new data is written?',
        'How does the UI know the tweet was saved successfully vs. failed?',
      ],
    },
  ],
  keyTakeaways: [
    'Every web request travels: browser → DNS → CDN → load balancer → server → cache/database → back',
    'DNS translates domain names to IP addresses; understanding it prevents deployment confusion',
    'CDNs serve static assets from edge locations near users, reducing latency dramatically',
    'Every private API route must authenticate the request — verify the token before processing',
    'Cache expensive database queries in Redis; always plan your cache invalidation strategy',
    'HTTP status codes are a contract — use them correctly so clients can handle responses properly',
    'The complete request lifecycle is the foundation for debugging every production issue',
  ],
  nextLesson: 'choosing-a-tech-stack',
  prevLesson: 'what-is-web-development',
};
