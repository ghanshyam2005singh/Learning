import type { Lesson } from '@/types';

export const whatIsWebDevLesson: Lesson = {
  id: 'what-is-web-development',
  slug: 'what-is-web-development',
  title: 'What is Web Development',
  description:
    'Understand the full picture of web development — frontend, backend, database, infrastructure, and how everything connects into a real product.',
  category: 'Introduction',
  order: 1,
  difficulty: 'beginner',
  estimatedTime: 25,
  content: `Web development is the process of building and maintaining applications that run on the internet or an intranet. It is not one skill — it is a collection of disciplines that work together to deliver software through a browser.

Before you understood individual technologies, you learned them in isolation. JavaScript. React. Node.js. Databases. Now you zoom out and see how they assemble into a complete product.

---

## The Five Layers of a Web Application

Every web application — whether it is a blog, a bank, or an e-commerce store — is built from the same five layers.

\`\`\`
┌──────────────────────────────────────────────────┐
│                   FRONTEND                        │
│       What the user sees and interacts with       │
│           HTML · CSS · JavaScript · React         │
├──────────────────────────────────────────────────┤
│                   BACKEND                         │
│        Business logic, APIs, server code          │
│         Node.js · Express · Python · Go           │
├──────────────────────────────────────────────────┤
│                   DATABASE                        │
│         Persistent data storage and queries       │
│       PostgreSQL · MongoDB · Redis · MySQL        │
├──────────────────────────────────────────────────┤
│                INFRASTRUCTURE                     │
│      Servers, hosting, networking, deployment     │
│        AWS · Docker · Nginx · Kubernetes          │
├──────────────────────────────────────────────────┤
│                   PRODUCT                         │
│       Planning, UX, features, user needs          │
│      Figma · Analytics · Roadmaps · Metrics       │
└──────────────────────────────────────────────────┘
\`\`\`

---

## Frontend Development

**What it is:** Everything the user sees and interacts with in the browser.

Frontend developers write code that runs inside the user's browser. The browser downloads HTML, CSS, and JavaScript, and renders the interface.

**Responsibilities:**
- Building UI components
- Handling user interactions (clicks, forms, navigation)
- Fetching data from APIs and displaying it
- Managing application state (what the user sees right now)
- Performance optimization (page load speed, animations)
- Accessibility (screen readers, keyboard navigation)

**Core technologies:**
- HTML — structure and content
- CSS — visual styling and layout
- JavaScript — behavior and interactivity
- React / Next.js — component libraries and frameworks
- TypeScript — type-safe JavaScript

**What you already know:** You completed the JavaScript, TypeScript, and React tracks. You know how components, hooks, state, and API integration work. This track builds on that foundation.

---

## Backend Development

**What it is:** The server-side code that handles business logic, processes requests, and talks to the database.

Backend code runs on a server, not in the browser. The browser cannot see it. The user never directly interacts with it. But every button click, every form submission, every page of data passes through the backend.

**Responsibilities:**
- Receiving HTTP requests from the frontend
- Validating and processing data
- Querying the database
- Enforcing business rules (can this user do this action?)
- Authentication and authorization
- Sending responses back to the frontend
- Background jobs (sending emails, processing images)

**Core technologies:**
- Node.js / Express — JavaScript on the server
- Python / Django / FastAPI — Python frameworks
- Go — high-performance backend services
- Java / Spring Boot — enterprise applications
- PostgreSQL / MongoDB — databases the backend queries

**What you already know:** You completed the Node.js track. You know how Express works, how to build REST APIs, how to connect to databases, and how to handle authentication.

---

## Database

**What it is:** The layer that permanently stores all application data.

When you close your laptop, the database keeps everything. Posts, users, orders, messages — it all lives in the database.

**Two primary types:**

| Type | Examples | Best For |
|------|----------|----------|
| Relational (SQL) | PostgreSQL, MySQL | Structured data, relationships, transactions |
| Document (NoSQL) | MongoDB, Firestore | Flexible schemas, nested data, fast prototyping |
| Cache | Redis | Temporary data, sessions, rate limiting |

**What you already know:** You completed the Database track. You know SQL, schema design, relationships, indexing, and MongoDB basics.

---

## Infrastructure

**What it is:** The servers, networks, and services that keep your application running.

Code on your laptop is not a product. A product runs on servers, is accessible via a domain name, has SSL encryption, scales under load, and stays online 24/7.

**Responsibilities:**
- Hosting the application on servers (cloud providers)
- Setting up domains and DNS
- Configuring SSL certificates (HTTPS)
- Deploying new code without downtime
- Monitoring server health and uptime
- Scaling resources when traffic spikes
- Security hardening

**Core technologies:**
- AWS, GCP, Azure — cloud providers
- Docker — containerizing applications
- Nginx — web server and reverse proxy
- GitHub Actions — automated deployment (CI/CD)
- Kubernetes — container orchestration at scale

**What you already know:** You completed the DevOps track. You know Docker, GitHub Actions, CI/CD, and cloud basics.

---

## Full Stack Development

A **full stack developer** works across all layers — frontend, backend, and database. They are not the deepest expert in any single layer, but they can build a complete application from scratch.

**In startups:** Full stack developers are common because small teams need people who can do everything.

**In large companies:** Developers typically specialize — frontend teams, backend teams, data engineers, platform engineers. But understanding the full stack makes you a better specialist because you understand what other teams need.

**The most valuable full stack skill** is not knowing every technology. It is understanding how the layers communicate and where problems occur at the boundaries.

---

## Product Development

Technology is not the goal. The product is the goal.

Real web development is:
1. Understanding what users need
2. Planning features that solve those needs
3. Building the simplest version that works
4. Measuring whether it actually helps users
5. Iterating based on feedback

Developers who only think about code ship features users do not want. Developers who understand product think about why they are building something before writing a single line.

---

## How Everything Connects

Here is a simple mental model of a request flow:

\`\`\`
USER
  │ clicks "Load Posts" button
  ▼
BROWSER (Frontend)
  │ React calls fetch('/api/posts')
  ▼
SERVER (Backend)
  │ Express receives GET /api/posts
  │ Validates auth token
  │ Queries database: SELECT * FROM posts WHERE user_id = ?
  ▼
DATABASE
  │ Returns rows
  ▼
SERVER
  │ Formats response as JSON
  │ Sends response
  ▼
BROWSER
  │ React receives JSON
  │ Updates state
  ▼
USER
  sees posts rendered on screen
\`\`\`

Every interaction in every web application follows this same pattern. The details vary. The structure does not.

---

## Real World Workflow

In a real company or startup, a feature is built like this:

1. **Product planning** — what problem are we solving? Who is the user?
2. **Design** — wireframes, UI mockups (Figma)
3. **Backend API** — build endpoints, define request/response shapes
4. **Frontend UI** — build components that call the APIs
5. **Database** — design schema, write migrations
6. **Testing** — unit tests, integration tests, manual QA
7. **Code review** — teammates review the pull request
8. **Deployment** — merge to main, CI/CD deploys automatically
9. **Monitoring** — watch for errors, performance issues
10. **Iteration** — users give feedback, fix bugs, add features

This is not sequential in practice. Backend and frontend are often built in parallel. Design changes mid-development. Planning continues while features are being built.

---

## Why This Track Exists

You know the individual technologies. This track teaches you how to assemble them.

The difference between a developer who learned React and a developer who can build products is understanding:
- How to architect a full application
- How to make technology decisions
- How to deploy to production
- How to work in a team
- How to think like a product engineer

That is what this track covers.`,
  codeExamples: [
    {
      title: 'Full Stack Request Flow — Simplified',
      code: `// FRONTEND (React component)
function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Frontend makes HTTP request to backend
    fetch('/api/posts', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setPosts(data.posts));
  }, []);

  return posts.map(post => <PostCard key={post.id} post={post} />);
}

// BACKEND (Node.js + Express)
app.get('/api/posts', authenticate, async (req, res) => {
  // Backend validates auth, queries database
  const posts = await db.query(
    'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json({ posts: posts.rows });
});

// DATABASE (PostgreSQL schema)
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`,
      explanation:
        'Each layer has one responsibility: React handles UI, Express handles routing and business logic, PostgreSQL stores data. They communicate through HTTP and SQL.',
    },
  ],
  commonMistakes: [
    'Jumping straight into coding without understanding what problem you are solving',
    'Treating frontend and backend as completely separate concerns — they must be designed together',
    'Ignoring infrastructure until the last moment — deployment shapes architecture decisions',
    'Building features instead of products — a feature list is not a product',
    'Underestimating database design — fixing a bad schema in production is expensive',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between frontend and backend development?',
      answer:
        'Frontend runs in the browser and handles what users see and interact with — UI, state, navigation. Backend runs on a server and handles business logic, data processing, authentication, and database queries. They communicate through HTTP APIs. Frontend sends requests; backend processes them and sends responses.',
      difficulty: 'beginner',
    },
    {
      question: 'What does "full stack" mean and what skills does it require?',
      answer:
        'Full stack means being able to build the complete application — frontend UI, backend APIs, database design, and deployment. It requires knowing at least one frontend framework (React), one backend runtime (Node.js), one database (PostgreSQL or MongoDB), and basic deployment (Docker, cloud providers). The key skill is understanding how all layers communicate.',
      difficulty: 'beginner',
    },
    {
      question: 'What is infrastructure and why does a developer need to understand it?',
      answer:
        'Infrastructure is the servers, networks, and services that host and run your application. Developers need to understand it because deployment choices affect architecture, code structure, and performance. A developer who has never deployed code does not know the real constraints their code runs under.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'map-the-stack',
      title: 'Map Your Application Stack',
      description:
        'Think of an application you use daily (Twitter, YouTube, Notion). Draw or write out the five layers: frontend, backend, database, infrastructure, and product. What technologies likely power each layer? What happens when you click a button?',
      starterCode: `// Application: [Your Choice]
//
// Frontend:
//   - Technologies:
//   - Responsibilities:
//
// Backend:
//   - Technologies:
//   - Responsibilities:
//
// Database:
//   - Technologies:
//   - What data is stored:
//
// Infrastructure:
//   - Technologies:
//   - Where it likely runs:
//
// Request flow when I click [action]:
//   1.
//   2.
//   3.`,
      solution: `// Application: Twitter/X
//
// Frontend:
//   - Technologies: React (likely), TypeScript, custom CSS
//   - Responsibilities: Timeline rendering, tweet composer, notifications
//
// Backend:
//   - Technologies: Java microservices, Scala (historically), Python
//   - Responsibilities: Tweet storage, feed ranking algorithm, user auth
//
// Database:
//   - Technologies: MySQL (tweets), Redis (cache/timelines), Hadoop (analytics)
//   - What data is stored: tweets, users, follows, likes, notifications
//
// Infrastructure:
//   - Technologies: GCP, Kubernetes, custom CDN
//   - Where it likely runs: multiple data centers globally
//
// Request flow when I click "Like":
//   1. React fires onClick, makes POST /api/tweets/123/like
//   2. Backend validates auth token, checks tweet exists
//   3. Database: INSERT INTO likes (tweet_id, user_id)
//   4. Cache: increment like_count for tweet_123 in Redis
//   5. Backend returns { liked: true, likeCount: 43 }
//   6. React updates local state, UI shows filled heart`,
      hints: [
        'Focus on the mental model, not exact technologies',
        'Think about what data needs to be stored permanently vs temporarily',
        'Consider what happens if the server receives 1000 requests per second',
      ],
    },
  ],
  keyTakeaways: [
    'Web development has five layers: frontend, backend, database, infrastructure, and product',
    'Frontend runs in the browser; backend runs on servers; they communicate via HTTP',
    'Full stack means being able to build across all layers, not mastering all of them equally',
    'Every user interaction follows the same pattern: browser → server → database → server → browser',
    'Product thinking — understanding why you are building — is as important as technical skill',
    'This track teaches you to assemble what you already know into complete, deployable products',
  ],
  nextLesson: 'how-modern-web-apps-work',
};
