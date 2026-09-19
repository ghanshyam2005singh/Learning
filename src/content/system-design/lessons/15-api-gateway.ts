import type { Lesson } from '@/types';

export const apiGatewayLesson: Lesson = {
  id: 'api-gateway',
  slug: 'api-gateway',
  title: 'API Gateway',
  description:
    'Understand what an API Gateway is, why it exists, everything it does (auth, routing, rate limiting, SSL termination, aggregation), the BFF pattern, and a definitive comparison of API Gateway vs Load Balancer.',
  category: 'Infrastructure',
  order: 15,
  difficulty: 'intermediate',
  estimatedTime: 35,
  prevLesson: 'rate-limiting',
  nextLesson: 'security-fundamentals',

  content: `## What Is an API Gateway?

An API Gateway is a server that acts as the single entry point for all client requests to your backend. Every request from every client flows through the gateway before reaching any service. The gateway handles all the "plumbing" concerns that every service would otherwise have to implement independently.

**Simplest mental model:** An API gateway is the receptionist at a large office building. Every visitor comes to the receptionist first. The receptionist checks their ID (authentication), decides which office they're allowed to visit (authorization + routing), logs the visit (monitoring), and calls up to the office to let them know someone is coming (forwarding). Individual offices don't deal with visitors directly — they just do their core work.

**Real examples:** AWS API Gateway, Kong, Nginx, Traefik, Envoy, Azure API Management, Google Cloud Endpoints.

---

## The Problem Without an API Gateway

Imagine you have five microservices: Users, Orders, Products, Payments, and Notifications. Without a gateway:

\`\`\`
Without API Gateway:

Mobile App ──────────→ users-service:3001
Mobile App ──────────→ orders-service:3002
Mobile App ──────────→ products-service:3003
Web App ─────────────→ users-service:3001
Web App ─────────────→ orders-service:3002
Web App ─────────────→ products-service:3003
Third-party ─────────→ products-service:3003
Third-party ─────────→ orders-service:3002
\`\`\`

**Problem 1: Tight coupling between clients and services**
Every client knows the address and port of every service. When you rename, move, or split a service, you must update every client. Mobile apps can't be updated instantly — users may have old app versions for months.

**Problem 2: Cross-cutting concerns duplicated everywhere**
Authentication logic has to be implemented in all five services. Rate limiting too. Logging too. SSL certificates on all five. This is thousands of lines of duplicated code that must be kept in sync.

**Problem 3: Security surface area**
All five services are exposed to the internet. Every service is a potential attack vector. Security patches must be applied to all five.

**Problem 4: Client-unfriendly API shapes**
The users service returns a massive user object. The mobile app only needs five fields from it. The web app needs different fields. No way to adapt the response per client without changing the service.

---

## The Solution: Everything Through the Gateway

\`\`\`
With API Gateway:

Mobile App ─────┐
Web App ─────── │──→ [API GATEWAY] ──→ users-service
Third-party ────┘         │        ──→ orders-service
                          │        ──→ products-service
                          │        ──→ payments-service
                          │        ──→ notifications-service

The gateway handles:
  ✓ Authentication (verify JWT, check OAuth token)
  ✓ Rate limiting (before requests reach services)
  ✓ Routing (which URL goes to which service)
  ✓ Logging (all traffic visible in one place)
  ✓ SSL termination (HTTPS at gateway, HTTP internally)
  ✓ Request/response transformation
  ✓ Load balancing across service instances
\`\`\`

Only the gateway is exposed to the internet. All backend services run in a private network, unreachable directly from outside. This dramatically reduces the attack surface.

---

## What an API Gateway Does — Each Function Explained

### 1. Authentication and Authorization

The gateway validates credentials on every inbound request before forwarding it:

\`\`\`
Client                  Gateway                   Service
  │                        │                         │
  │── POST /orders ────────→│                         │
  │   Authorization:        │                         │
  │   Bearer <JWT>          │                         │
  │                        │── Decode JWT             │
  │                        │── Verify signature       │
  │                        │── Check expiry           │
  │                        │── Extract user_id, roles │
  │                        │                         │
  │                        │── Forward request ──────→│
  │                        │   X-User-Id: 42          │
  │                        │   X-User-Role: admin     │
\`\`\`

The individual service receives a request with user identity already verified and attached as headers. The service does not need any JWT library or auth logic — it trusts the gateway.

**Benefit:** A single place to update auth logic. Rotate JWT secrets, switch from JWT to OAuth, add MFA — all changes in one place, zero changes to individual services.

### 2. Routing

The gateway maps URL patterns to backend services:

\`\`\`
/api/v1/users/**    → users-service:3001
/api/v1/orders/**   → orders-service:3002
/api/v1/products/** → products-service:3003
/api/v2/users/**    → users-service-v2:3011  (versioned routing!)
\`\`\`

This enables **zero-downtime service migration**: you can run users-service-v1 and users-service-v2 simultaneously, routing 10% of traffic to v2 for canary testing, with no client changes.

### 3. Rate Limiting

As covered in the previous lesson, centralized rate limiting at the gateway means:
- One place to configure limits per user, per endpoint, per tier
- Limits enforced before requests consume any compute from backend services
- Consistent enforcement across all services with zero per-service code

### 4. Monitoring and Observability

All traffic passes through the gateway, making it the ideal place to collect metrics:
- Request count per endpoint
- Latency percentiles (p50, p95, p99)
- Error rates per service
- Active user counts in real time

Without a gateway, each service emits its own metrics in its own format. The gateway creates a single, consistent telemetry plane.

### 5. Request and Response Transformation

The gateway can rewrite requests before forwarding and rewrite responses before returning:

**Header manipulation:**
\`\`\`
Inbound:  { "Authorization": "Bearer <jwt>" }
Outgoing: { "X-User-Id": "42", "X-User-Role": "admin" }
         (strip auth header, add extracted fields)
\`\`\`

**URL rewriting:**
\`\`\`
Client requests: /api/products/123
Gateway forwards: /internal/v2/product?id=123
\`\`\`

**Response filtering:** Return only the fields the client needs instead of the full service response.

### 6. SSL/TLS Termination

The gateway handles HTTPS from clients. Backend services communicate over plain HTTP within the private network:

\`\`\`
Client ─── HTTPS ──→ [Gateway] ─── HTTP ──→ users-service
                     (TLS handled here)      (plain HTTP, private net)
\`\`\`

**Benefits:**
- SSL certificates managed in one place
- No need to distribute certificates to every service
- Services don't pay the CPU cost of TLS handshakes
- Internal traffic doesn't need encryption (trust the network)

### 7. Load Balancing

The gateway can distribute requests across multiple instances of each service:

\`\`\`
                         ┌→ users-service instance 1
Client → [Gateway] ──────┼→ users-service instance 2
                         └→ users-service instance 3
\`\`\`

Strategies: round-robin, least-connections, weighted, IP-hash. The gateway tracks health of each instance and stops routing to unhealthy ones.

### 8. Response Aggregation (BFF Pattern)

The gateway can call multiple services and combine their responses into a single response:

\`\`\`
Client requests: GET /dashboard

Gateway calls:
  → users-service:    GET /users/42
  → orders-service:   GET /orders?userId=42&limit=5
  → products-service: GET /products?ids=1,2,3

Gateway combines results:
{
  user: { name: "Alice", ... },
  recentOrders: [...],
  recommendedProducts: [...]
}

Client gets ONE response instead of making three separate requests.
\`\`\`

This pattern — especially when the gateway tailors the response per client type — is called **BFF (Backend for Frontend)**.

---

## The BFF Pattern — Backend for Frontend

A single API is never optimal for all clients simultaneously:
- **Mobile apps** have limited bandwidth and battery — they need minimal payloads
- **Web apps** often need richer data for desktop layouts
- **Third-party developers** need stable, well-documented, generic APIs

The BFF pattern creates separate gateway layers (or gateway configurations) per client type:

\`\`\`
Mobile App  → [Mobile BFF Gateway]  → (aggregates, trims response to essentials)
Web App     → [Web BFF Gateway]     → (aggregates, returns full rich data)
3rd Party   → [Public API Gateway]  → (stable versioned API, rate limited)
             ↓                    ↓
        [Same backend microservices]
\`\`\`

Each BFF is owned by the frontend team that uses it. Mobile team controls the mobile BFF. Web team controls the web BFF. Backend services remain generic and don't need to know about different client types.

**Real world:** Netflix runs separate BFFs for TV apps, mobile apps, and web. The TV app needs different video quality parameters and UI metadata than the mobile app.

---

## API Gateway vs Load Balancer — Full Comparison

This is one of the most common interview confusion points. They are different tools that often work *together*.

| Feature | API Gateway | Load Balancer |
|---------|-------------|---------------|
| **OSI Layer** | Layer 7 (Application) | L4 (TCP) or L7 (HTTP) |
| **Content awareness** | Reads headers, body, JWT, cookies | L4 LB only sees IP/port; L7 sees HTTP |
| **Routing logic** | URL path, headers, user identity, query params | URL path (L7 LB), IP/port (L4 LB) |
| **Authentication** | Yes — validates JWT, OAuth | No |
| **Rate limiting** | Yes — per user, per endpoint | No |
| **Request transformation** | Yes — headers, body, URL rewrite | Minimal (L7 only) |
| **Response aggregation** | Yes (BFF pattern) | No |
| **SSL termination** | Yes | Yes (both handle this) |
| **Primary purpose** | Cross-cutting concerns, API management | Distribute load across instances |
| **Health checking** | Service-level | Instance-level |
| **Typical position** | Closest to the client (edge) | Between gateway and service instances |

**They work together:**
\`\`\`
Client → [Load Balancer] → [API Gateway instances] → [Load Balancer] → [Service instances]
\`\`\`

A load balancer in front of multiple gateway instances ensures the gateway itself doesn't become a single point of failure. Load balancers behind the gateway distribute traffic to service instances.

**When to use only a Load Balancer:** Non-HTTP traffic (TCP, UDP), when you don't need content-based routing, extremely latency-sensitive paths where gateway overhead matters (microseconds).

**When to use an API Gateway:** You have multiple services, multiple client types, need centralized auth/rate limiting/logging, or building a microservices architecture.

---

## Production Architecture: Full Picture

\`\`\`
Internet
    │
    ▼
[CDN / Edge]               ← Static assets, geographic routing
    │
    ▼
[Load Balancer]            ← Distribute across gateway instances
    │
    ├──────────────────────────────────┐
    ▼                                  ▼
[API Gateway 1]          [API Gateway 2]    ← Gateway instances (HA)
    │
    ├── /api/users ──→  [LB] → [users-service × 3]
    ├── /api/orders ──→ [LB] → [orders-service × 2]
    └── /api/products → [LB] → [products-service × 4]
                               (private network, no internet access)
\`\`\`

**Key insight:** The gateway runs as multiple instances behind its own load balancer to eliminate the gateway as a single point of failure. The gateway must be stateless (no session state stored locally) so requests can be served by any gateway instance.

---

## Popular API Gateway Solutions

| Tool | Best For | Hosted? |
|------|----------|---------|
| **AWS API Gateway** | AWS-native apps, serverless | Fully managed |
| **Kong** | On-premise, plugin ecosystem | Self-hosted or managed |
| **Nginx** | High performance, custom config | Self-hosted |
| **Traefik** | Kubernetes, Docker | Self-hosted |
| **Envoy** | Service mesh, Kubernetes | Self-hosted |
| **Apigee** | Enterprise, monetization | Google managed |

For most teams on AWS: AWS API Gateway or Application Load Balancer (ALB). For Kubernetes: Nginx Ingress or Traefik. For maximum control: Kong or Envoy.`,

  codeExamples: [
    {
      title: 'API Gateway with Express — Auth, Routing, and Logging',
      code: `import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from 'http-proxy-middleware';

const gateway = express();

// ── Service Registry ──────────────────────────────────────────────────
const SERVICE_ROUTES: Record<string, string> = {
  '/api/users':    'http://users-service:3001',
  '/api/orders':   'http://orders-service:3002',
  '/api/products': 'http://products-service:3003',
};

// ── Global Logging Middleware ─────────────────────────────────────────
gateway.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      userId: req.headers['x-user-id'],
    }));
  });
  next();
});

// ── Authentication Middleware ─────────────────────────────────────────
const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register', '/health'];

gateway.use((req, res, next) => {
  if (PUBLIC_PATHS.some((p) => req.path.startsWith(p))) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Inject user identity as trusted headers for downstream services
    req.headers['x-user-id'] = payload.userId;
    req.headers['x-user-role'] = payload.role;
    // Remove raw JWT so services don't need to re-verify
    delete req.headers.authorization;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ── Health Check ──────────────────────────────────────────────────────
gateway.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Dynamic Service Routing ───────────────────────────────────────────
for (const [prefix, target] of Object.entries(SERVICE_ROUTES)) {
  gateway.use(
    prefix,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      // Rewrite path: /api/users/42 → /users/42 (strip prefix)
      pathRewrite: { [\`^\${prefix}\`]: '' },
      on: {
        error: (err, _req, res: Response) => {
          console.error(\`Proxy error to \${target}:\`, err.message);
          res.status(502).json({ error: 'Service temporarily unavailable' });
        },
      },
    })
  );
}

gateway.listen(8080, () => console.log('API Gateway running on :8080'));`,
      explanation:
        'A minimal but production-structured API Gateway: centralized JWT validation injects user identity headers, a service registry drives dynamic proxy routing, and all requests are logged in one place.',
    },
    {
      title: 'BFF Pattern — Response Aggregation',
      code: `import axios from 'axios';

interface DashboardResponse {
  user: { id: string; name: string; email: string };
  recentOrders: Array<{ id: string; total: number; status: string }>;
  recommendedProducts: Array<{ id: string; name: string; price: number }>;
}

// BFF endpoint — aggregates three service calls into one client response
async function getDashboard(userId: string): Promise<DashboardResponse> {
  // Fire all three requests in parallel — don't wait for each sequentially
  const [userRes, ordersRes, productsRes] = await Promise.all([
    axios.get(\`http://users-service/users/\${userId}\`),
    axios.get(\`http://orders-service/orders?userId=\${userId}&limit=5\`),
    axios.get(\`http://products-service/recommendations?userId=\${userId}\`),
  ]);

  // Shape the response for the mobile client (only what it needs)
  return {
    user: {
      id: userRes.data.id,
      name: userRes.data.displayName,
      email: userRes.data.emailAddress,
    },
    recentOrders: ordersRes.data.items.map((o: any) => ({
      id: o.orderId,
      total: o.totalAmount,
      status: o.fulfillmentStatus,
    })),
    recommendedProducts: productsRes.data.slice(0, 3).map((p: any) => ({
      id: p.productId,
      name: p.title,
      price: p.currentPrice,
    })),
  };
}

// Express handler on the API gateway
gateway.get('/api/mobile/dashboard', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const data = await getDashboard(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to assemble dashboard' });
  }
});

// Result: mobile client makes ONE request instead of THREE
// Latency: max(users, orders, products) instead of sum`,
      explanation:
        'BFF aggregation uses Promise.all to fire requests in parallel, not sequentially. Latency is the slowest service call, not the sum of all calls. The gateway shapes the response to exactly what the mobile client needs.',
    },
    {
      title: 'Kong API Gateway — Declarative Configuration (kong.yaml)',
      code: `# Kong declarative configuration — no code, no database
# Deploy with: deck sync kong.yaml

_format_version: "3.0"

services:
  - name: users-service
    url: http://users-service:3001
    routes:
      - name: users-route
        paths: ["/api/users"]
        strip_path: true
    plugins:
      - name: jwt           # Auth plugin
      - name: rate-limiting
        config:
          minute: 1000
          hour: 50000
          policy: redis
          redis_host: redis
      - name: request-transformer
        config:
          add:
            headers: ["X-Gateway-Version:2.0"]
          remove:
            headers: ["Authorization"]   # Strip after validation

  - name: products-service
    url: http://products-service:3003
    routes:
      - name: products-route
        paths: ["/api/products"]
        strip_path: true
    plugins:
      - name: rate-limiting
        config:
          minute: 5000   # Products endpoint gets higher limit
          policy: redis
          redis_host: redis

# Global plugins (apply to all routes)
plugins:
  - name: cors
    config:
      origins: ["https://myapp.com"]
      methods: ["GET", "POST", "PUT", "DELETE"]
  - name: prometheus   # Expose /metrics for Grafana
  - name: file-log
    config:
      path: /var/log/kong/access.log`,
      explanation:
        'Kong allows declarative configuration — auth, rate limiting, CORS, logging configured per-service in YAML with no application code changes. This is the production approach for teams that do not want to maintain a custom gateway.',
    },
  ],

  commonMistakes: [
    'Confusing API Gateway with Load Balancer — a load balancer distributes traffic to identical instances of one service; an API gateway routes to different services and handles cross-cutting concerns. They serve different purposes and are usually used together.',
    'Making the API gateway stateful — storing session data or any per-request state on the gateway instance. This breaks horizontal scaling. The gateway must be completely stateless.',
    'Putting business logic in the gateway — the gateway should only handle cross-cutting concerns (auth, routing, rate limiting, logging). Business rules belong in services. A "fat gateway" becomes a maintenance nightmare.',
    'Not making the gateway itself highly available — teams build a gateway to remove single points of failure from services, but then run only one gateway instance. Run at least two gateway instances behind a load balancer.',
    'Overly complex routing rules that encode domain knowledge — if your routing table requires understanding business rules (e.g., "if user is enterprise, route to different service"), you are leaking business logic into infrastructure.',
    'Not implementing circuit breaking at the gateway — if an upstream service is down, the gateway should fail fast instead of accumulating timeouts that exhaust connection pools.',
    'Ignoring gateway latency overhead — every request pays an extra network hop through the gateway. For latency-critical internal service-to-service calls, use a service mesh (Istio, Linkerd) instead of routing everything through the public gateway.',
  ],

  interviewQuestions: [
    {
      question: 'What is an API gateway and what problems does it solve?',
      difficulty: 'beginner',
      answer:
        'An API gateway is a single entry point for all client requests to a backend composed of multiple services. It solves: (1) Coupling — clients don\'t need to know addresses of individual services. (2) Code duplication — auth, rate limiting, logging are implemented once at the gateway instead of in every service. (3) Security surface area — only the gateway is internet-facing; services run in a private network. (4) Client diversity — can transform and aggregate responses differently for mobile vs web vs third-party clients. Real examples: AWS API Gateway, Kong, Nginx.',
      followUp: [
        'What happens if the API gateway goes down?',
        'How do you make the gateway itself highly available?',
      ],
      tip: 'Frame your answer around "problems it solves" rather than just "what it is." Interviewers want to see you understand the motivation.',
    },
    {
      question: 'What is the difference between an API Gateway and a Load Balancer? Can you use both?',
      difficulty: 'intermediate',
      answer:
        'Load balancers distribute traffic across identical instances of one service to achieve horizontal scaling. They operate at L4 (TCP) or L7 (HTTP) and are content-unaware at L4. API gateways operate at L7, read the full HTTP request (headers, body, JWT), and route to different services based on content. Gateways handle auth, rate limiting, request transformation, and aggregation — none of which a load balancer does. Yes, use both together: a load balancer in front of multiple gateway instances (making the gateway highly available), and load balancers behind the gateway distributing to service instances.',
      followUp: [
        'When would you use only a load balancer without an API gateway?',
        'Where does a service mesh (Istio) fit relative to an API gateway?',
      ],
      tip: 'Draw the architecture: Internet → LB → [Gateway × N] → [LB → Services × N]. This visual wins interviews.',
    },
    {
      question: 'Explain the BFF (Backend for Frontend) pattern.',
      difficulty: 'intermediate',
      answer:
        'BFF creates separate API gateway layers (or configurations) tailored to each client type rather than forcing all clients to use a single generic API. Mobile apps need compact payloads optimized for bandwidth and battery; web apps need richer data; third-party APIs need stable, versioned contracts. A mobile BFF aggregates and trims responses for mobile, owned by the mobile team. A web BFF returns full rich data, owned by the web team. Backend microservices remain generic and stable. Netflix, Airbnb, and SoundCloud pioneered this pattern to enable teams to move independently without coordination overhead.',
      followUp: ['What are the downsides of BFF?', 'When would a single API gateway be sufficient?'],
      tip: 'Mention that BFF shifts API ownership to frontend teams — this is as much an organizational pattern as a technical one.',
    },
    {
      question: 'How does authentication work in an API gateway architecture?',
      difficulty: 'intermediate',
      answer:
        "The gateway validates credentials on every inbound request. For JWT: decode the token, verify the signature against the secret/public key, check expiry, extract user identity (user ID, roles). The gateway then strips the Authorization header and injects trusted headers (X-User-Id, X-User-Role) before forwarding to the service. Individual services trust these injected headers without performing their own JWT validation — they rely on the gateway's trust boundary. This means JWT library code exists only at the gateway. To rotate secrets or switch auth methods, change only the gateway.",
      followUp: [
        'What happens if a malicious internal service sends fake X-User-Id headers?',
        'How do you handle service-to-service auth (no user involved)?',
      ],
      tip: "The follow-up about internal fake headers is important — it's why the trust boundary (private network + mTLS) matters for internal services.",
    },
    {
      question: 'What is SSL termination at the API gateway and why is it done there?',
      difficulty: 'beginner',
      answer:
        "SSL termination means the API gateway handles the TLS handshake and encryption/decryption with clients. Traffic from the gateway to backend services uses plain HTTP over a private network. Benefits: SSL certificates are managed in one place instead of on every service; services don't pay TLS handshake CPU overhead; certificate rotation is a single operation; internal traffic doesn't need encryption because the private network is trusted. The trade-off is that internal traffic is unencrypted — acceptable when services share a private VPC, but some security models require end-to-end TLS (use a service mesh in that case).",
      tip: 'Mention the trade-off: if your compliance requirements demand end-to-end encryption, SSL termination at the gateway is not sufficient.',
    },
  ],

  exercises: [
    {
      id: 'api-gateway-ex-1',
      title: 'Build a Route Registry with Versioned APIs',
      description:
        'Implement a gateway route registry that supports API versioning. Given a registry of route configurations, the gateway should route /api/v1/users to users-service-v1 and /api/v2/users to users-service-v2. If a v2 route exists, 10% of v1 traffic should be shadowed to v2 for testing (shadow traffic — forward to v2 but return v1 response). Write the routing function and the shadow traffic logic.',
      starterCode: `interface RouteConfig {
  prefix: string;
  version: string;
  target: string;
  shadowTarget?: string;  // optional: shadow N% of traffic here
  shadowPercent?: number;
}

const routes: RouteConfig[] = [
  { prefix: '/api/users', version: 'v1', target: 'http://users-v1:3001',
    shadowTarget: 'http://users-v2:3011', shadowPercent: 10 },
  { prefix: '/api/users', version: 'v2', target: 'http://users-v2:3011' },
  { prefix: '/api/orders', version: 'v1', target: 'http://orders-v1:3002' },
];

function resolveRoute(path: string, version: string): RouteConfig | null {
  // TODO: find matching route for path + version
}

async function proxyRequest(
  path: string,
  version: string,
  requestData: object
): Promise<{ status: number; body: object }> {
  // TODO: resolve route, proxy to primary target
  // If shadowTarget configured and random() < shadowPercent/100:
  //   fire request to shadowTarget asynchronously (don't await — fire and forget)
  //   return primary response regardless
}`,
      solution: `function resolveRoute(path: string, version: string): RouteConfig | null {
  return routes.find(
    (r) => path.startsWith(r.prefix) && r.version === version
  ) ?? null;
}

async function proxyRequest(
  path: string,
  version: string,
  requestData: object
): Promise<{ status: number; body: object }> {
  const route = resolveRoute(path, version);
  if (!route) return { status: 404, body: { error: 'Route not found' } };

  // Primary request
  const response = await fetch(\`\${route.target}\${path}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  const body = await response.json();

  // Shadow traffic (fire and forget)
  if (
    route.shadowTarget &&
    route.shadowPercent &&
    Math.random() * 100 < route.shadowPercent
  ) {
    fetch(\`\${route.shadowTarget}\${path}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shadow': 'true' },
      body: JSON.stringify(requestData),
    }).catch((err) => console.warn('Shadow request failed:', err.message));
    // Intentionally NOT awaited — shadow is fire-and-forget
  }

  return { status: response.status, body };
}`,
      hints: [
        'The route lookup should match on both prefix AND version — a /api/users path exists for both v1 and v2.',
        'Shadow traffic must be fire-and-forget (no await) so it does not affect the response latency seen by the client.',
        'Shadow requests should include a header (X-Shadow: true) so the v2 service can distinguish real traffic from shadow traffic in its logs.',
      ],
    },
    {
      id: 'api-gateway-ex-2',
      title: 'Design the Gateway Architecture for a Multi-Tenant SaaS',
      description:
        'A SaaS platform has three client types: (1) End users via Web App, (2) End users via Mobile App, (3) Enterprise customers via REST API. Enterprise customers are identified by an API key in the X-API-Key header. Web/mobile users use JWT. Enterprise customers get 10,000 req/hour, web users get 1,000 req/hour, mobile users get 500 req/hour. Design: (a) The gateway routing and auth logic pseudocode. (b) The Redis key scheme for rate limiting each tier. (c) How you would separate BFF layers for web vs mobile. Write the pseudocode for the middleware chain.',
      starterCode: `// Design the middleware chain for this multi-tenant gateway
// Consider: how do you identify which client type is making the request?
// Consider: how do you store rate limit state in Redis for each tier?

function identifyClientType(req: Request): 'enterprise' | 'web' | 'mobile' | 'unknown' {
  // TODO: how do you tell these apart from the request?
}

function getRateLimit(clientType: string): { limit: number; windowSeconds: number } {
  // TODO: return correct limits per tier
}

function buildRedisKey(clientType: string, identifier: string, windowTimestamp: number): string {
  // TODO: design a Redis key that separates tiers and identifiers
}

// Describe the BFF routing:
// GET /mobile/dashboard → ?
// GET /web/dashboard → ?
// GET /api/v1/products → ?`,
      solution: `function identifyClientType(req: Request): 'enterprise' | 'web' | 'mobile' | 'unknown' {
  if (req.headers['x-api-key']) return 'enterprise';
  if (req.headers['x-client-type'] === 'mobile') return 'mobile';
  if (req.headers['x-client-type'] === 'web') return 'web';
  // Fallback: check User-Agent
  const ua = req.headers['user-agent'] || '';
  if (/Mobile|Android|iPhone/.test(ua)) return 'mobile';
  return 'web';
}

function getRateLimit(clientType: string) {
  const limits = {
    enterprise: { limit: 10000, windowSeconds: 3600 },
    web:        { limit: 1000,  windowSeconds: 3600 },
    mobile:     { limit: 500,   windowSeconds: 3600 },
  };
  return limits[clientType as keyof typeof limits] ?? { limit: 100, windowSeconds: 3600 };
}

function buildRedisKey(clientType: string, identifier: string, windowTimestamp: number): string {
  // Key scheme: rl:<tier>:<identifier>:<windowTimestamp>
  // Examples:
  // rl:enterprise:apikey_abc123:1718928000
  // rl:web:user_42:1718928000
  // rl:mobile:user_42:1718928000
  return \`rl:\${clientType}:\${identifier}:\${windowTimestamp}\`;
}

// BFF routing:
// GET /mobile/dashboard → Mobile BFF → parallel calls to users + orders + products → trimmed response
// GET /web/dashboard    → Web BFF    → parallel calls to users + orders + products → rich response
// GET /api/v1/products  → Enterprise API Gateway → products-service (no aggregation, raw data)

// Middleware chain:
// 1. identifyClientType()        → sets req.clientType
// 2. authenticate()              → validates API key OR JWT based on clientType
// 3. rateLimitMiddleware()       → uses clientType for limits + Redis key scheme
// 4. routeToBFF()                → /mobile/* → mobile BFF, /web/* → web BFF, /api/* → enterprise
// 5. logRequest()                → logs clientType, identifier, endpoint, latency`,
      hints: [
        'Identify client type before authentication — the auth method itself differs by client type (API key vs JWT).',
        'Include the window timestamp in the Redis key so keys naturally expire without explicit cleanup.',
        'BFF routing can be path-based (/mobile/*, /web/*, /api/*) — clients self-identify by which path they call.',
      ],
    },
  ],

  keyTakeaways: [
    'An API gateway is the single entry point for all client requests, acting as reverse proxy that handles all cross-cutting concerns centrally.',
    'Without a gateway, clients are tightly coupled to individual service addresses, and every service must independently implement auth, rate limiting, logging, and SSL — massive code duplication.',
    'The gateway handles: authentication, routing, rate limiting, monitoring, request/response transformation, SSL termination, load balancing, and response aggregation.',
    'The BFF pattern creates separate gateway configurations per client type (mobile, web, third-party) so each client gets a tailored API without affecting backend services.',
    'API Gateway vs Load Balancer: a gateway is L7-aware and handles cross-cutting concerns; a load balancer distributes traffic across identical instances. Use both together — LB in front of gateways, and LBs behind the gateway routing to service instances.',
    'The gateway must be completely stateless so it can scale horizontally — no session data or per-request state stored on the gateway instance.',
    'Never put business logic in the gateway — only infrastructure concerns. Business rules belong in services.',
    'The gateway dramatically reduces attack surface: backend services are unreachable from the internet. Only the gateway is public-facing.',
    'SSL termination at the gateway means one place for certificate management; internal traffic uses plain HTTP over the private network.',
    'For high availability, run multiple gateway instances behind a load balancer — the gateway should not itself be a single point of failure.',
  ],
};
