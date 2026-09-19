import type { Lesson } from '@/types';

export const cdnLesson: Lesson = {
  id: 'cdn',
  slug: 'cdn',
  title: 'CDN (Content Delivery Network)',
  description:
    'Learn how CDNs eliminate latency by serving content from edge servers close to users, how cache invalidation works on a CDN, and when CDNs are the right — and wrong — tool for the job.',
  category: 'Infrastructure',
  order: 10,
  difficulty: 'intermediate',
  estimatedTime: 30,
  prevLesson: 'caching',
  nextLesson: 'databases-in-system-design',

  content: `
# CDN — Content Delivery Network

## The Problem: Geography and Latency

Imagine your API server is in Mumbai. A user in New York makes a request. That request travels through submarine cables across the Atlantic and Pacific Ocean.

The round-trip time (RTT) is physically constrained by the speed of light in fiber (~200,000 km/s in glass). New York to Mumbai is approximately 12,000 km. Even at the speed of light in fiber, that is:

\`\`\`
Distance: ~12,000 km
Speed of light in fiber: ~200,000 km/s
One-way: 12,000 / 200,000 = 60ms (theoretical minimum)
Round trip: ~120ms minimum
With real-world routing, queuing, and hops: 200–300ms RTT
\`\`\`

A 300ms delay on every image, stylesheet, and font file is catastrophic for user experience. Page load times of 3–5 seconds. Conversions drop dramatically.

**The CDN solves this by moving the content closer to the user.**

---

## What is a CDN?

A **CDN (Content Delivery Network)** is a geographically distributed network of servers that cache copies of your content close to your users.

Instead of every user in New York hitting your server in Mumbai, they hit a CDN edge server in New York — which is potentially 5ms away.

\`\`\`
WITHOUT CDN:
  User (New York) ——————————————————> Origin (Mumbai)
                    ~250ms RTT

WITH CDN:
  User (New York) ——> Edge (New York) ——> Origin (Mumbai)
                  5ms               250ms (only on first request)
  Subsequent requests: 5ms total
\`\`\`

---

## Key Components

### Edge Servers (Edge Nodes)
These are the caching servers distributed globally. They sit at the "edge" of the internet, close to users. When a user requests a file, the CDN routes them to the nearest edge server.

### Points of Presence (PoPs)
A **PoP** is a physical location where CDN edge servers are deployed — a data center within a city or region. A large CDN like Cloudflare has 300+ PoPs across 100+ countries.

\`\`\`
Geographic Distribution:

[User: Tokyo]         [User: London]        [User: São Paulo]
       |                     |                      |
       v                     v                      v
 [PoP: Tokyo]         [PoP: London]        [PoP: São Paulo]
  Edge Server          Edge Server           Edge Server
       |                     |                      |
       +——————————>  [Origin: Mumbai]  <————————————+
                    (only on cache miss)
\`\`\`

---

## How a CDN Works — Step by Step

1. **User requests** \`https://yoursite.com/logo.png\`
2. **DNS resolves** the domain to the nearest CDN edge server (using Anycast routing or GeoDNS)
3. **Edge server checks its cache**
   - **Cache HIT:** Returns the file immediately. User is done. Total latency: ~5ms.
   - **Cache MISS:** Edge server fetches from your **origin server** (Mumbai). Caches the response. Returns it to the user.
4. **Next user** in New York requesting the same file → Cache HIT → 5ms response.

The origin server only handles traffic on the very first request for each file from each PoP. After that, the PoP serves it locally.

---

## Latency Reduction — Real Numbers

| Without CDN | With CDN |
|---|---|
| User in New York, Server in Mumbai | User in New York, PoP in New York |
| ~250ms RTT | ~5–20ms RTT |
| 250ms × 30 assets = 7.5 seconds loading time | 15ms × 30 assets = 0.45 seconds |

For a page with 30 static assets (images, CSS, JS, fonts), a CDN can reduce load time from 7+ seconds to under 500ms for distant users.

---

## Cache Invalidation — The Hard Problem

When you update a file on your origin (e.g., deploy new CSS), CDN edge servers still hold the old cached version. How do you tell them to update?

This is one of the genuinely hard problems in computer science. Phil Karlton famously said: *"There are only two hard things in Computer Science: cache invalidation and naming things."*

### Strategy 1: Versioned URLs (Best Approach)

Instead of \`/styles.css\`, use \`/styles.v3.css\` or \`/styles.abc123.css\` (content hash).

When you change the file, the URL changes. The CDN has never seen this URL before — it fetches fresh from origin. Old URL still cached? Does not matter — nothing references it anymore.

\`\`\`
Old deploy: <link href="/styles.a1b2c3.css">
New deploy: <link href="/styles.d4e5f6.css">

CDN cache for /styles.a1b2c3.css → still valid (nobody requests it)
CDN cache for /styles.d4e5f6.css → MISS → fetch from origin → cached fresh
\`\`\`

**This is the standard practice.** Build tools (Webpack, Vite) do this automatically via content hashing.

### Strategy 2: Cache-Control Headers

\`Cache-Control: max-age=86400\` — cache for 24 hours. Content expires automatically.

Problem: If you deploy a fix, users get the broken version for up to 24 hours. Unsuitable for actively changing content.

Use \`Cache-Control: no-cache\` or \`max-age=0\` for frequently changing files (HTML).
Use \`Cache-Control: max-age=31536000, immutable\` for hashed static assets.

### Strategy 3: Manual Purge

Most CDNs provide an API to manually purge specific URLs or patterns.

\`\`\`bash
# Cloudflare example
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \\
  -H "Authorization: Bearer {token}" \\
  -d '{"files": ["https://yoursite.com/styles.css"]}'
\`\`\`

**Problem:** Propagation delay. Purge must reach 300+ edge servers globally. Can take 30 seconds to 5 minutes. Not suitable for urgent updates at scale.

---

## Static CDN vs Dynamic CDN

### Static CDN (Traditional)

Caches static assets: images, CSS, JavaScript, fonts, videos, PDFs.

These are the same for every user — perfect for caching. Long TTLs (hours to days).

**Examples:** AWS CloudFront for S3 assets, Cloudflare for static sites.

### Dynamic CDN (Edge Computing)

Modern CDNs can also accelerate dynamic content using:
- **Edge caching with short TTL** — for semi-dynamic content (e.g., top trending posts, same for all users for 1 minute)
- **Edge compute / Edge Functions** — run code at the edge (Cloudflare Workers, Vercel Edge Functions). The logic executes at the PoP closest to the user.
- **Persistent connections to origin** — CDN maintains a pool of HTTP/2 connections to your origin, reducing connection overhead even for uncacheable requests

---

## Real-World CDN Providers

| Provider | Strengths | Best For |
|---|---|---|
| Cloudflare | Largest PoP network (300+), DDoS protection, free tier, Workers | Most use cases, especially if you need security |
| AWS CloudFront | Deep AWS integration, Lambda@Edge | AWS-native stacks |
| Akamai | Oldest, enterprise scale, advanced features | Large enterprises |
| Fastly | Instant purge, edge compute (Compute@Edge), VCL config | Sites needing granular cache control |
| Vercel / Netlify Edge | Zero-config for frontend frameworks | JAMstack, Next.js, React |

---

## When to Use a CDN

- You have users geographically distributed across regions or continents
- Your site has significant static assets (images, JS, CSS, fonts, videos)
- You want DDoS protection (CDNs absorb massive traffic before it reaches your origin)
- You need to reduce server bandwidth costs (CDN serves assets, reducing origin egress)
- Page load time is critical to your business (e-commerce, media, SaaS)

**Virtually every public-facing website should use a CDN for static assets.** The cost is low and the benefit is enormous.

---

## When NOT to Use a CDN

**1. Highly personalized dynamic content**
User dashboards, personalized feeds, private API responses — each user gets different data. Caching this is not useful and can cause data leaks (user A seeing user B's data).

**2. Very small user base in one geography**
If all your users are in the same city as your server, CDN adds no latency benefit and adds cost.

**3. Low-latency API endpoints**
CDNs add a small overhead for dynamic, non-cacheable requests. If your origin is fast and close, skipping the CDN edge hop is slightly faster.

**4. Real-time data that must be perfectly fresh**
Live stock prices, real-time chat, live sports scores — stale data is worse than no CDN.

---

## CDN and Security

CDNs provide several security benefits:

- **DDoS Mitigation:** The CDN absorbs volumetric attacks. A 10Tbps DDoS attack that would destroy your origin is spread across hundreds of CDN PoPs.
- **TLS Termination:** CDN handles SSL/TLS, reducing CPU load on origin.
- **WAF (Web Application Firewall):** Cloudflare and others offer edge-based WAF to block SQL injection, XSS, etc. before requests reach your origin.
- **Origin IP hiding:** Users only see CDN IPs. Your origin server's IP remains hidden, preventing direct attacks.
`,

  codeExamples: [
    {
      title: 'Cache-Control Headers for Static Assets',
      code: `// Express.js — serving static assets with CDN-friendly headers
import express from 'express';
const app = express();

// For hashed assets (Webpack/Vite output) — cache forever, immutable
app.use('/static', express.static('public', {
  maxAge: '1y', // 1 year
  immutable: true, // Tells CDN this file will never change at this URL
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// For HTML files — never cache (always fresh so new asset URLs are picked up)
app.get('*.html', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

// For API responses — no CDN caching
app.get('/api/*', (req, res, next) => {
  res.setHeader('Cache-Control', 'private, no-store');
  next();
});`,
      explanation:
        'The key insight: HTML should never be cached (it references hashed asset URLs). Hashed assets should be cached forever (they are immutable by design). API responses should not be cached by CDN.',
    },
    {
      title: 'Versioned Asset URLs — Vite Configuration',
      code: `// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Content-hash in filename — URL changes when content changes
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  }
});

// Output example:
// assets/main-a1b2c3d4.js
// assets/vendor-e5f6g7h8.js
// assets/styles-i9j0k1l2.css
//
// When you change main.ts, only main-NEWHASH.js changes.
// The CDN caches main-a1b2c3d4.js forever — it never changes.
// New deploys use the new URL — CDN fetches fresh automatically.`,
      explanation:
        'Content hashing is the correct solution to CDN cache invalidation. Build tools handle this automatically. The hash changes only when the file content changes, so unchanged files keep their cache.',
    },
    {
      title: 'Cloudflare Cache Purge via API',
      code: `// Programmatically purge CDN cache after a deploy
async function purgeCDNCache(urls: string[]) {
  const response = await fetch(
    \`https://api.cloudflare.com/client/v4/zones/\${process.env.CF_ZONE_ID}/purge_cache\`,
    {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.CF_API_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files: urls }),
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error(\`Purge failed: \${JSON.stringify(result.errors)}\`);
  }
  return result;
}

// Call this in your CI/CD pipeline after deploying
await purgeCDNCache([
  'https://yoursite.com/api/featured-products', // semi-dynamic endpoint
  'https://yoursite.com/sitemap.xml',           // changes on new content
]);`,
      output: `{ success: true, result: { id: "purge-job-id" }, errors: [], messages: [] }`,
      explanation:
        'Manual purge is useful for semi-dynamic content that changes on deploys. For static assets, use versioned URLs instead — purge APIs have propagation delays and rate limits.',
    },
  ],

  commonMistakes: [
    'Caching HTML files on the CDN — HTML references versioned asset URLs; if CDN caches old HTML, users get old asset references even after a deploy.',
    'Setting long TTLs on unversioned files — changing /styles.css on the origin does not invalidate CDN cache, so users get stale CSS for hours.',
    'Using CDN for private, personalized API responses — this can serve user A\'s data to user B (a security incident).',
    'Not setting Cache-Control headers at all — CDNs use heuristic caching (usually short TTL based on Last-Modified), which is unpredictable.',
    'Forgetting to purge CDN cache after deploying changes to non-hashed files.',
    'Routing all traffic through CDN including WebSocket connections — CDNs handle WebSockets differently; verify support before relying on it.',
    'Assuming CDN will handle all performance problems — CDN only helps for static assets and cacheable responses. Slow database queries still slow your API.',
  ],

  interviewQuestions: [
    {
      question: 'What is a CDN and why would you use one?',
      difficulty: 'beginner',
      answer:
        'A CDN (Content Delivery Network) is a globally distributed network of servers that cache your content close to users. You use one to reduce latency — instead of every user hitting your origin server (which may be thousands of miles away), they hit a nearby edge server. This reduces RTT from 200-300ms to 5-20ms for static assets. CDNs also reduce origin server load and provide DDoS protection.',
      followUp: ['What types of content benefit most from CDN?', 'What types should NOT be served from CDN?'],
    },
    {
      question: 'How do you handle CDN cache invalidation when you deploy new code?',
      difficulty: 'intermediate',
      answer:
        'The best practice is versioned URLs (content hashing). Build tools like Webpack/Vite automatically append a hash of the file content to filenames (e.g., main.a1b2c3.js). When the file changes, the hash changes, so the URL changes. The CDN has never seen the new URL and fetches it fresh from origin automatically — no manual invalidation needed. For HTML files, set Cache-Control: no-cache so browsers always fetch fresh HTML, which then references the new hashed asset URLs.',
      tip: 'Always mention the HTML no-cache + hashed assets combination — this is the complete solution.',
    },
    {
      question: 'What is the difference between a CDN and a load balancer?',
      difficulty: 'intermediate',
      answer:
        'A CDN caches content at geographically distributed edge servers to reduce latency for users worldwide. It is primarily about proximity and caching. A load balancer distributes traffic across multiple backend servers in the same data center (or region) to improve availability and throughput. A CDN operates at the edge of the internet, a load balancer operates within your infrastructure. In practice, you use both — CDN for global content delivery, load balancer for scaling your origin servers.',
    },
    {
      question: 'What is the difference between Static CDN and Dynamic CDN (Edge Computing)?',
      difficulty: 'advanced',
      answer:
        'Static CDN caches and serves static assets (images, CSS, JS) that are identical for all users. Dynamic CDN extends this with Edge Computing — running serverless functions at edge PoPs. Examples: Cloudflare Workers, Vercel Edge Functions. This lets you execute logic (personalization, A/B testing, authentication) at the edge, close to users, without the latency of round-tripping to your origin. The result is dynamic, personalized responses with near-CDN latency.',
      followUp: ['What are the limitations of edge computing compared to full server-side logic?'],
    },
    {
      question: 'A user reports they are still seeing an old image after you deployed a new one. What could be wrong and how do you fix it?',
      difficulty: 'intermediate',
      answer:
        'Three possible causes: (1) CDN edge server cached the old image and TTL has not expired — fix: purge CDN cache via API or use versioned URLs. (2) Browser cached the old image — fix: the user clears browser cache, or use versioned URLs so new image has a new URL. (3) Wrong file was deployed or deployment did not reach the server — check deployment logs. Long-term fix: always use content-hashed URLs for assets so cache invalidation is automatic and guaranteed.',
    },
  ],

  exercises: [
    {
      id: 'cdn-ex-1',
      title: 'Design Cache-Control Headers for a Web Application',
      description:
        'Given an Express.js web application with different types of content, write the correct Cache-Control headers for each resource type. Consider: HTML pages, hashed JS/CSS bundles, images with versioned names, a public API endpoint returning the same data for all users (refreshed every 5 minutes), and a private API endpoint returning user-specific data.',
      starterCode: `import express from 'express';
const app = express();

// TODO: Add correct Cache-Control headers for each route type

// 1. HTML pages — should always be fresh
app.get('/', (req, res) => {
  // What Cache-Control header?
  res.sendFile('index.html');
});

// 2. Hashed JS bundles (e.g., /static/main.a1b2c3.js)
app.use('/static', express.static('dist'));

// 3. Public API — data is same for all users, changes every 5 min
app.get('/api/trending', (req, res) => {
  // What Cache-Control header?
  res.json({ trending: [] });
});

// 4. Private API — user-specific data
app.get('/api/profile', (req, res) => {
  // What Cache-Control header?
  res.json({ user: req.user });
});`,
      solution: `import express from 'express';
const app = express();

// 1. HTML pages — no caching (must always be fresh to reference latest hashed assets)
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile('index.html');
});

// 2. Hashed JS/CSS bundles — cache forever, immutable (URL changes when content changes)
app.use('/static', express.static('dist', {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// 3. Public API — cache for 5 minutes (300 seconds), public (CDN can cache)
app.get('/api/trending', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  // s-maxage is specifically for CDNs/shared caches, overrides max-age for CDN
  res.json({ trending: [] });
});

// 4. Private API — never cache on CDN, may cache in browser only
app.get('/api/profile', (req, res) => {
  res.setHeader('Cache-Control', 'private, max-age=60');
  // private = CDN must NOT cache this. Browser may cache for 60s.
  res.json({ user: req.user });
});`,
      hints: [
        'HTML must never be cached — it references your latest hashed asset filenames.',
        'Hashed assets can be cached forever because their URL changes when content changes.',
        's-maxage overrides max-age specifically for shared caches like CDNs.',
        '"private" means the CDN must not cache this, but the browser can.',
      ],
    },
    {
      id: 'cdn-ex-2',
      title: 'Trace a CDN Request Flow',
      description:
        'A user in London visits a website for the first time. The origin server is in San Francisco. The CDN has a PoP in London. Trace the complete request flow for the first visit and the second visit (same user, same resource, 10 minutes later). Identify: where does the request go, what is the TTL check, what does the response contain, and what latency is expected at each step.',
      starterCode: `// Document your analysis as a function that returns the request flow
// This is a thinking exercise — there is no single right code answer

interface RequestStep {
  step: number;
  from: string;
  to: string;
  action: string;
  latency: string;
  result: string;
}

function traceFirstVisit(): RequestStep[] {
  // TODO: Return array of steps for the FIRST request
  // Consider: browser → ?, CDN PoP → ?, origin → ?
  return [];
}

function traceSecondVisit(): RequestStep[] {
  // TODO: Return array of steps for a REPEAT request (same file, 10 min later)
  // Assume TTL is 1 hour
  return [];
}`,
      solution: `function traceFirstVisit(): RequestStep[] {
  return [
    {
      step: 1,
      from: 'Browser (London)',
      to: 'DNS Resolver',
      action: 'Resolve yoursite.com → CDN Anycast IP',
      latency: '~5ms',
      result: 'Returns IP of London CDN PoP',
    },
    {
      step: 2,
      from: 'Browser (London)',
      to: 'CDN PoP (London)',
      action: 'HTTP GET /hero-image.jpg',
      latency: '~5ms',
      result: 'Cache MISS — file not in London PoP cache',
    },
    {
      step: 3,
      from: 'CDN PoP (London)',
      to: 'Origin (San Francisco)',
      action: 'Origin pull — fetch /hero-image.jpg',
      latency: '~140ms',
      result: 'Origin returns file + Cache-Control: max-age=3600',
    },
    {
      step: 4,
      from: 'CDN PoP (London)',
      to: 'CDN PoP cache',
      action: 'Store file with TTL=3600s',
      latency: '~1ms',
      result: 'File cached at London PoP',
    },
    {
      step: 5,
      from: 'CDN PoP (London)',
      to: 'Browser (London)',
      action: 'Return hero-image.jpg',
      latency: '~5ms',
      result: 'User receives file. Total: ~155ms',
    },
  ];
}

function traceSecondVisit(): RequestStep[] {
  return [
    {
      step: 1,
      from: 'Browser (London)',
      to: 'DNS Resolver',
      action: 'Resolve yoursite.com (may be cached)',
      latency: '~0ms (cached) or ~5ms',
      result: 'London CDN PoP IP',
    },
    {
      step: 2,
      from: 'Browser (London)',
      to: 'CDN PoP (London)',
      action: 'HTTP GET /hero-image.jpg',
      latency: '~5ms',
      result: 'Cache HIT — TTL not expired (10min < 60min). Return cached file.',
    },
    // No origin request needed!
    // Total latency: ~10ms instead of ~155ms
  ];
}`,
      hints: [
        'On the first visit, the CDN PoP must go to origin — this is called an "origin pull".',
        'On the second visit within TTL, the PoP returns the cached copy — origin is never contacted.',
        'Total latency first visit = DNS + local CDN hop + origin hop. Second visit = DNS + local CDN hop only.',
      ],
    },
  ],

  keyTakeaways: [
    'A CDN reduces latency by serving content from edge servers (PoPs) close to users, cutting RTT from 200ms+ to 5-20ms.',
    'CDNs only help for content that can be cached — static assets, public API responses with short TTLs.',
    'Cache invalidation is the hardest CDN problem. The solution: use content-hashed URLs for static assets so URL changes when content changes.',
    'HTML must never be cached by the CDN so users always get the latest version with correct hashed asset URLs.',
    'Set Cache-Control: public, max-age=31536000, immutable for hashed assets. Set Cache-Control: no-cache for HTML.',
    'Use s-maxage to control CDN-specific TTL independently from browser TTL.',
    'Private/personalized content must not go through CDN cache — set Cache-Control: private to prevent CDN caching.',
    'CDNs also provide DDoS mitigation, TLS termination, and WAF as bonus benefits.',
    'Edge Computing (Cloudflare Workers, Vercel Edge) extends CDN to run code at edge PoPs for dynamic personalization with low latency.',
  ],
};
