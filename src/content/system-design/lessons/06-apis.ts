import type { Lesson } from '@/types';

export const apisLesson: Lesson = {
  id: 'apis',
  slug: 'apis',
  title: 'APIs — REST, GraphQL, gRPC, WebSockets & SSE',
  description:
    'Master all five major API paradigms — REST, GraphQL, gRPC, WebSockets, and Server-Sent Events. Understand not just how each works, but why it was invented, when to choose it, when to avoid it, and what happens when you pick the wrong one.',
  category: 'APIs',
  order: 6,
  difficulty: 'intermediate',
  estimatedTime: 45,
  prevLesson: 'microservices-architecture',
  nextLesson: 'scalability',

  content: `# APIs — The Language Services Use to Talk

## What Is an API?

An API (Application Programming Interface) is a contract between two pieces of software: "if you send me this, I will send you back that." Every time your frontend fetches data, every time two microservices communicate, every time your mobile app loads your feed — an API is involved.

There is no single "best" API style. Each was invented to solve a specific problem that the previous style could not solve well. Picking the wrong API style for a use case creates real, measurable problems: slower apps, over-complicated code, or systems that cannot scale.

---

## 1. REST (Representational State Transfer)

### How It Works

REST is not a protocol — it is an architectural style for designing networked APIs on top of HTTP. Roy Fielding defined it in his 2000 PhD dissertation.

Key constraints:
- **Stateless**: Every request must contain all information needed. The server stores no client session state between requests.
- **Resource-based**: You model your API around nouns (resources), not verbs (actions). A User is a resource. An Order is a resource.
- **HTTP Methods as verbs**: Use HTTP methods to express what you want to do with the resource.

\`\`\`
HTTP Method   Meaning          Example
──────────────────────────────────────────────────────────
GET           Read             GET /users/123  → get user 123
POST          Create           POST /orders    → create new order
PUT           Replace (full)   PUT /users/123  → replace entire user
PATCH         Update (partial) PATCH /users/123 → update user's email only
DELETE        Delete           DELETE /users/123 → delete user
\`\`\`

### URL Design Principles

Good REST URL design is about representing resources as nouns in a hierarchy:

\`\`\`
Good REST URLs:
  GET    /users                → list all users
  GET    /users/123            → get user 123
  POST   /users                → create a user
  GET    /users/123/orders     → all orders for user 123
  GET    /users/123/orders/456 → order 456 for user 123
  DELETE /users/123/orders/456 → cancel order 456

Bad REST URLs (verbing the URL):
  GET  /getUser?id=123       ← wrong: verb in URL
  POST /createOrder          ← wrong: verb in URL
  GET  /users/deleteUser/123 ← wrong: using GET to delete
\`\`\`

### HTTP Status Codes

| Code | Meaning | When to Use |
|---|---|---|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST that created a resource |
| 204 | No Content | Success with no body (DELETE) |
| 400 | Bad Request | Client sent invalid data |
| 401 | Unauthorized | Not authenticated (no/invalid token) |
| 403 | Forbidden | Authenticated but not permitted |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists (duplicate email) |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Server bug |
| 503 | Service Unavailable | Server overloaded or down |

### When to Use REST
- CRUD APIs for web and mobile clients
- Public APIs (developers expect REST, it is the universal standard)
- When your team is small and simplicity matters
- When browser caching of GET responses is valuable

### When NOT to Use REST
- When the client needs to subscribe to real-time updates (use WebSockets or SSE)
- When you have a mobile client fetching data for 10 different screens — you will end up over-fetching (use GraphQL)
- When you need extremely low latency between internal services (use gRPC)
- When you have bidirectional streaming needs (use gRPC or WebSockets)

### Advantages
- Universal — every language and platform supports HTTP
- Easily cacheable (GET responses can be cached by browsers and CDNs)
- Human-readable (JSON over HTTP is easy to debug in the browser)
- Stateless design naturally scales horizontally
- Rich tooling (Swagger/OpenAPI, Postman, curl)

### Disadvantages
- Over-fetching: GET /users/123 returns the entire user object even if you only need the name
- Under-fetching: To render a profile page, you might need GET /users/123, GET /users/123/posts, GET /users/123/followers — three round trips
- No real-time capability natively
- HTTP/1.1 limitations (one request per connection; HTTP/2 improves this but REST APIs rarely leverage it fully)

---

## 2. GraphQL

### The Problem It Was Invented To Solve

In 2012, Facebook's mobile team had a severe problem: their REST API was designed for the desktop web. Mobile clients needed different data — less on some screens, more on others, different shapes. The REST API caused:
- **Over-fetching**: Every user endpoint returned 40 fields. Mobile only needed 5.
- **Under-fetching**: A news feed required 7 separate API calls.
- **Slow iteration**: Every new screen required a new backend endpoint or a change to an existing one.

GraphQL was Facebook's solution. They open-sourced it in 2015.

### How It Works

GraphQL has a **single endpoint** (usually \`POST /graphql\`). The client describes exactly what data it needs in a query. The server returns exactly that — nothing more, nothing less.

\`\`\`graphql
# REST would require 3 API calls. GraphQL: one query, exact data.

query GetUserProfile($userId: ID!) {
  user(id: $userId) {
    name         # only the fields I need
    avatarUrl
    followerCount
    recentPosts(limit: 3) {
      title
      publishedAt
      likeCount
    }
  }
}
\`\`\`

Response is exactly what was requested — no extra fields.

### Schema — The Contract

GraphQL's schema is the API contract. It defines every type, query, and mutation:

\`\`\`graphql
type User {
  id: ID!
  name: String!
  email: String!
  avatarUrl: String
  followerCount: Int!
  recentPosts(limit: Int): [Post!]!
}

type Post {
  id: ID!
  title: String!
  publishedAt: String!
  likeCount: Int!
}

type Query {
  user(id: ID!): User
  post(id: ID!): Post
}

type Mutation {
  createPost(title: String!, content: String!): Post!
  likePost(postId: ID!): Post!
}
\`\`\`

The client and server both agree on this schema. If the client requests a field that doesn't exist in the schema, it gets an error. This is strong typing at the API level.

### When to Use GraphQL
- Complex frontends that need flexible, nested data (social media feeds, dashboards)
- Multiple client types (web, iOS, Android) each needing different data shapes from the same backend
- Rapid UI iteration where the frontend team changes data requirements frequently
- When over-fetching and under-fetching are measurable problems (mobile bandwidth, slow devices)

### When NOT to Use GraphQL
- Simple CRUD APIs — GraphQL's complexity is not justified
- When HTTP caching is important — GraphQL queries are POST requests; they are not cached by CDNs
- When you need file uploads — GraphQL does not handle binary data natively
- Small teams where the schema overhead slows down development
- When your API is public and consumed by external developers who expect REST

### Advantages
- Client controls the data shape — no over-fetching or under-fetching
- One endpoint, one round trip for complex data
- Strongly typed schema serves as live documentation
- Introspection: clients can query the schema itself to discover what is available
- Excellent for aggregating data from multiple microservices into one query (GraphQL Federation)

### Disadvantages
- Caching is hard — all requests are POSTs; you need custom caching logic
- N+1 query problem: fetching 100 users and each user's posts triggers 101 database queries unless you use DataLoader
- Higher complexity: schema design, resolvers, types — steeper learning curve
- Error handling is unusual — GraphQL returns HTTP 200 even for errors (errors are in the response body)
- Can be over-engineered for simple APIs

---

## 3. gRPC

### How It Works

gRPC (Google Remote Procedure Call) was created by Google in 2015, built on lessons from their internal system Stubby which handled billions of inter-service calls per day.

Instead of JSON over HTTP, gRPC uses:
- **Protocol Buffers (protobuf)**: Binary serialization format — far smaller and faster to parse than JSON
- **HTTP/2**: Multiplexed streams, header compression, persistent connections
- **Strongly typed contracts** defined in \`.proto\` files

\`\`\`protobuf
// payment.proto — the contract between services

syntax = "proto3";

service PaymentService {
  rpc ChargeCard(ChargeRequest) returns (ChargeResponse);
  rpc StreamTransactions(StreamRequest) returns (stream Transaction);
}

message ChargeRequest {
  string order_id = 1;
  double amount = 2;
  string currency = 3;
  string customer_id = 4;
}

message ChargeResponse {
  string payment_id = 1;
  string status = 2;
  string transaction_ref = 3;
}
\`\`\`

From this \`.proto\` file, gRPC generates client and server code in Python, Go, Java, Node.js, C++, etc. The generated client looks like a local function call.

### gRPC Streaming

gRPC supports four communication patterns:
\`\`\`
1. Unary:          client sends one request, gets one response (like REST)
2. Server Stream:  client sends one request, server streams multiple responses
3. Client Stream:  client streams multiple requests, server sends one response
4. Bidirectional:  both sides stream simultaneously
\`\`\`

### When to Use gRPC
- Internal microservice-to-microservice communication (the primary use case)
- When performance matters: gRPC is ~5–10x faster than REST/JSON for the same data
- Streaming use cases (real-time data pipelines, streaming analytics)
- When you have multiple service languages (protobuf generates clients for all languages)
- When you need strict API contracts (schema changes are versioned and breaking changes are caught at compile time)

### When NOT to Use gRPC
- Browser clients — browsers cannot make raw HTTP/2 gRPC calls natively (gRPC-Web is a workaround with limitations)
- Simple use cases — the protobuf + code generation setup is significant overhead for a simple CRUD API
- When your API is public — external developers expect REST or GraphQL, not gRPC
- When human-readable debugging is important — protobuf is binary and not readable in the browser's network tab

### Advantages
- Extremely fast: binary protocol, HTTP/2 multiplexing, persistent connections
- Strongly typed: breaking API changes are caught at compile time, not at runtime
- Code generation: clients are generated automatically from the proto file — no manual SDK writing
- Native streaming support
- Bidirectional streaming enables sophisticated real-time protocols

### Disadvantages
- Not browser-native
- Binary format makes debugging harder (you need tooling like grpcurl or Postman gRPC support)
- Steeper learning curve: protobuf schema language, code generation workflow
- Less human-readable than REST — harder for API consumers to explore and debug
- Schema changes require regenerating and redeploying all clients

---

## 4. WebSockets

### The Problem It Solves

HTTP is request/response — the client always initiates. For live chat, multiplayer games, collaborative editing, or live trading dashboards, the server needs to push updates to the client the moment something happens. Before WebSockets, developers used "long polling" — the client would make a request and the server would hold it open until it had data. This was wasteful and limited.

WebSockets provide a **persistent, bidirectional, full-duplex connection** over a single TCP connection.

### How It Works

\`\`\`
Connection Lifecycle:

1. Client sends HTTP Upgrade request:
   GET /ws HTTP/1.1
   Upgrade: websocket
   Connection: Upgrade

2. Server responds:
   HTTP/1.1 101 Switching Protocols
   Upgrade: websocket

3. Connection is now a WebSocket — pure TCP, no HTTP overhead.
   Both sides can send messages at any time.

4. Either side sends a Close frame to terminate.

Client ──── "Hello" ──────────▶ Server
Client ◀─── "Hello back" ────── Server
Client ◀─── "New message!" ──── Server (server-initiated push)
Client ──── "Typing..." ──────▶ Server
\`\`\`

### When to Use WebSockets
- Real-time chat applications (WhatsApp Web, Slack)
- Multiplayer games (state must sync continuously between all players)
- Collaborative editing (Google Docs — your cursor position updates everyone's screen)
- Live trading platforms and stock tickers (prices change every millisecond)
- Live sports scores and auction systems
- Notification systems where sub-second delivery matters

### When NOT to Use WebSockets
- One-time requests — if you just need to fetch a user's profile once, use REST; opening a WebSocket for it is extreme overhead
- Mobile apps with battery concerns — a persistent TCP connection drains battery
- When the server only pushes (not bidirectional) — use Server-Sent Events instead; they are simpler and resumable
- Simple REST-like CRUD — wrong tool entirely

### Advantages
- True bidirectional: both client and server can send at any time
- Low overhead after connection: no HTTP headers on every message
- Real-time with minimal latency
- Sub-second event delivery

### Disadvantages
- Stateful: each connection is pinned to one server — horizontal scaling requires sticky sessions or a shared pub/sub layer (Redis Pub/Sub)
- No automatic reconnection — clients must implement reconnection logic
- No built-in message format — you define your own protocol on top
- Load balancers need WebSocket support (most modern ones do, but it must be configured)
- More complex server infrastructure than stateless REST

---

## 5. Server-Sent Events (SSE)

### How It Works

SSE is a simpler, unidirectional (server → client only) alternative to WebSockets for real-time updates. It uses a standard HTTP connection that the server keeps open and pushes events through.

\`\`\`
SSE Connection:

GET /events HTTP/1.1
Accept: text/event-stream

← Server streams:
data: {"type":"notification","message":"You have a new like"}\n\n
data: {"type":"notification","message":"John replied to your post"}\n\n
data: {"type":"status","onlineUsers":142}\n\n
\`\`\`

Key properties:
- Uses regular HTTP (works through corporate firewalls, proxies, CDNs — WebSockets do not)
- Built-in automatic reconnection by the browser
- Built-in event ID for resuming a stream after reconnection (the browser sends the last event ID)
- Only server → client (you cannot send data from client to server on this connection)

### When to Use SSE
- Live notification feeds (new messages, likes, mentions)
- Live dashboards (metrics, server status, deployment progress)
- News tickers and live sports scores
- Progress updates for long-running jobs (e.g., "File upload: 45% complete")
- AI response streaming (ChatGPT uses SSE to stream text token by token)

### When NOT to Use SSE
- You need the client to also send events to the server over the same connection — use WebSockets
- You need more than ~6 concurrent SSE connections per browser (HTTP/1.1 limitation — HTTP/2 removes this)
- You need binary data streaming — SSE is text only

### Advantages
- Simpler than WebSockets — standard HTTP, works everywhere
- Built-in browser support (EventSource API)
- Automatic reconnection with event ID-based resumption
- Works through HTTP proxies and corporate firewalls
- Load balancers handle SSE naturally (it is just a long HTTP response)

### Disadvantages
- Unidirectional only — server to client
- Text-only (UTF-8)
- HTTP/1.1 limits you to 6 concurrent connections per domain (resolved with HTTP/2)

---

## The Mega Comparison Table

| Dimension | REST | GraphQL | gRPC | WebSockets | SSE |
|---|---|---|---|---|---|
| Protocol | HTTP/1.1 or HTTP/2 | HTTP (POST) | HTTP/2 | TCP (upgraded from HTTP) | HTTP (long-lived) |
| Data format | JSON (usually) | JSON | Protocol Buffers (binary) | Any (JSON, binary) | Text (UTF-8) |
| Direction | Request/Response | Request/Response | Request/Response + Streaming | Bidirectional | Server → Client only |
| Latency | Medium (HTTP overhead) | Medium | Low (binary, HTTP/2) | Very low (persistent TCP) | Low (persistent connection) |
| Caching | Excellent (GET is cacheable) | Hard (all POSTs) | Not applicable | Not applicable | Not applicable |
| Browser support | Native | Native (HTTP) | Limited (gRPC-Web) | Native | Native (EventSource) |
| Real-time | No | No (use subscriptions) | Yes (streaming) | Yes | Yes (server push) |
| Best for | Public APIs, CRUD | Complex frontends, mobile | Internal microservices | Chat, games, live data | Notifications, feeds, AI streaming |
| Avoid when | Real-time needed | Simple CRUD, caching critical | Browser clients, simple cases | One-time requests, mobile battery | Bidirectional needed |
| Debugging | Easy (curl, Postman) | Medium (GraphQL Playground) | Hard (binary) | Medium | Easy (browser devtools) |
| Learning curve | Low | Medium | High | Medium | Low |

---

## How to Choose in an Interview

When an interviewer asks "what API would you use for X?", walk through this decision tree:

\`\`\`
Does the client need to receive events without requesting them?
├── YES → Is it bidirectional (client also sends events)?
│         ├── YES → WebSockets
│         └── NO  → SSE (simpler, auto-reconnect, HTTP-compatible)
└── NO  → Is this internal service-to-service?
          ├── YES → gRPC (fast, typed, streaming)
          └── NO  → Is the frontend complex (mobile, multiple clients, nested data)?
                    ├── YES → GraphQL
                    └── NO  → REST
\`\`\`
`,

  codeExamples: [
    {
      title: 'REST API — Express.js',
      code: `import express, { Request, Response } from 'express';

const router = express.Router();

// GET /users/:id — fetch a user
router.get('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userRepository.findById(id);

    if (!user) {
      // 404: resource does not exist
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: \`User with id \${id} does not exist\`,
      });
    }

    // 200: success
    return res.status(200).json({
      data: user,
    });
  } catch (err) {
    // 500: server error
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    });
  }
});

// POST /users — create a user
router.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    // 400: client sent bad data
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'name and email are required',
    });
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    // 409: conflict — resource already exists
    return res.status(409).json({
      error: 'EMAIL_TAKEN',
      message: 'An account with this email already exists',
    });
  }

  const user = await userRepository.create({ name, email });
  // 201: resource was created
  return res.status(201).json({ data: user });
});`,
      explanation:
        'REST API fundamentals: use nouns in URLs (/users, not /getUser), use HTTP methods as verbs (GET to read, POST to create), and use HTTP status codes to communicate the result type (200/201 for success, 4xx for client errors, 5xx for server errors).',
    },
    {
      title: 'GraphQL — Resolver with DataLoader (N+1 fix)',
      code: `import DataLoader from 'dataloader';

// Without DataLoader — N+1 problem:
// Fetching 100 users with their posts = 100 DB queries (1 per user)
// With DataLoader — batched: = 2 DB queries total

// Create a DataLoader — it batches all individual post fetches
// that happen within the same tick into a single DB call
const createPostsLoader = () =>
  new DataLoader<string, Post[]>(async (userIds) => {
    // userIds might be ['user1', 'user2', 'user3'] — all batched together
    const posts = await db.query(
      'SELECT * FROM posts WHERE user_id = ANY($1)',
      [userIds]
    );

    // DataLoader requires results in the same order as the input keys
    return userIds.map((userId) =>
      posts.filter((post) => post.userId === userId)
    );
  });

// GraphQL Resolvers
const resolvers = {
  Query: {
    // Resolver for: query { users { name posts { title } } }
    users: async () => {
      return db.query('SELECT * FROM users'); // 1 query
    },
  },

  User: {
    // This resolver is called once per user — but DataLoader batches them
    posts: async (user: User, _args: unknown, context: { postsLoader: ReturnType<typeof createPostsLoader> }) => {
      // Instead of: db.query('SELECT * FROM posts WHERE user_id = $1', [user.id])
      // We use the loader — it collects all user IDs and batches into one query
      return context.postsLoader.load(user.id);
    },
  },

  Mutation: {
    createPost: async (
      _: unknown,
      args: { title: string; content: string },
      context: { userId: string }
    ) => {
      if (!context.userId) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      return db.create('posts', { ...args, userId: context.userId });
    },
  },
};`,
      explanation:
        'The N+1 problem is the most common GraphQL performance trap. If you fetch 100 users and each user resolver fetches their posts individually, you make 101 queries. DataLoader solves this by batching: it collects all individual .load() calls from a single tick and makes one batched database query.',
    },
    {
      title: 'WebSocket Server with Room-Based Broadcasting',
      code: `import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

interface Client {
  ws: WebSocket;
  userId: string;
  rooms: Set<string>;
}

class ChatServer {
  private wss: WebSocketServer;
  // Map of roomId → Set of client WebSockets in that room
  private rooms = new Map<string, Set<WebSocket>>();
  // Map of WebSocket → client metadata
  private clients = new Map<WebSocket, Client>();

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.wss.on('connection', this.handleConnection.bind(this));
    console.log(\`WebSocket server listening on port \${port}\`);
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    // Extract userId from query string or auth token
    const userId = this.extractUserId(req);
    const client: Client = { ws, userId, rooms: new Set() };
    this.clients.set(ws, client);

    console.log(\`User \${userId} connected. Total: \${this.clients.size}\`);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch {
        ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });

    ws.on('close', () => {
      // Clean up: remove from all rooms
      client.rooms.forEach((roomId) => this.leaveRoom(ws, roomId));
      this.clients.delete(ws);
      console.log(\`User \${userId} disconnected. Total: \${this.clients.size}\`);
    });

    ws.on('error', (err) => {
      console.error(\`WebSocket error for user \${userId}:\`, err);
    });
  }

  private handleMessage(ws: WebSocket, message: Record<string, unknown>): void {
    const client = this.clients.get(ws);
    if (!client) return;

    switch (message.type) {
      case 'join_room':
        this.joinRoom(ws, message.roomId as string);
        break;
      case 'leave_room':
        this.leaveRoom(ws, message.roomId as string);
        break;
      case 'send_message':
        this.broadcastToRoom(message.roomId as string, {
          type: 'new_message',
          from: client.userId,
          text: message.text,
          timestamp: new Date().toISOString(),
        });
        break;
    }
  }

  private joinRoom(ws: WebSocket, roomId: string): void {
    if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Set());
    this.rooms.get(roomId)!.add(ws);
    this.clients.get(ws)?.rooms.add(roomId);
    ws.send(JSON.stringify({ type: 'joined_room', roomId }));
  }

  private leaveRoom(ws: WebSocket, roomId: string): void {
    this.rooms.get(roomId)?.delete(ws);
    this.clients.get(ws)?.rooms.delete(roomId);
  }

  private broadcastToRoom(roomId: string, payload: object): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const message = JSON.stringify(payload);
    room.forEach((clientWs) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(message);
      }
    });
  }

  private extractUserId(req: IncomingMessage): string {
    const url = new URL(req.url || '', 'ws://localhost');
    return url.searchParams.get('userId') || 'anonymous';
  }
}

new ChatServer(8080);`,
      explanation:
        'WebSocket servers are stateful — every active connection is held in memory. This example shows room-based broadcasting (like Slack channels): clients join rooms and messages are broadcast to all members. The key challenge at scale is that connections are pinned to one server instance, so you need Redis Pub/Sub to broadcast across multiple server instances.',
    },
    {
      title: 'Server-Sent Events — AI Response Streaming',
      code: `import express from 'express';

const app = express();
app.use(express.json());

// SSE endpoint — streams an AI response token by token
// This is exactly how ChatGPT's streaming works
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // Set SSE headers — these tell the client this is a stream
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    // Allow cross-origin if needed
    'Access-Control-Allow-Origin': '*',
  });

  // Helper to send an SSE event
  const sendEvent = (eventType: string, data: object) => {
    // SSE format: "event: <type>\ndata: <json>\n\n"
    res.write(\`event: \${eventType}\ndata: \${JSON.stringify(data)}\n\n\`);
  };

  try {
    sendEvent('start', { message: 'Generating response...' });

    // Simulate streaming from an AI model (OpenAI, Claude, etc.)
    const tokens = await streamAIResponse(message);

    for await (const token of tokens) {
      sendEvent('token', { token });
      // In production this comes naturally from the AI stream —
      // no artificial delay needed
    }

    sendEvent('done', { message: 'Complete' });
  } catch (err) {
    sendEvent('error', { message: 'Generation failed' });
  } finally {
    res.end(); // Close the SSE connection
  }
});

// Client-side code (browser):
/*
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Explain microservices' }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  // Parse SSE events and append tokens to the UI
  processSSEChunk(chunk);
}
*/`,
      output: `event: start
data: {"message":"Generating response..."}

event: token
data: {"token":"Microservices"}

event: token
data: {"token":" are"}

event: token
data: {"token":" independently"}

event: done
data: {"message":"Complete"}`,
      explanation:
        'SSE is the technology behind ChatGPT-style streaming responses. Each token arrives as a separate SSE event. The client renders each token immediately as it arrives, creating the "typing" effect. SSE is perfect here because only the server pushes data (the AI response) — the client already sent its message in the initial POST body.',
    },
  ],

  commonMistakes: [
    'Using WebSockets for one-time request/response interactions — REST or gRPC is far simpler and more appropriate',
    'Using REST for internal microservice communication that requires high throughput — gRPC is 5-10x faster for this use case',
    'Ignoring the N+1 query problem in GraphQL — without DataLoader, fetching a list of 100 users with their posts makes 101 database queries',
    'Not using HTTP status codes correctly in REST — returning 200 OK for an error with the error in the body confuses clients and breaks monitoring',
    'Building WebSocket servers without a shared pub/sub layer (Redis) — when you scale to multiple servers, messages only reach clients on the same server instance',
    'Using GraphQL when the team is small and the API is simple CRUD — the schema, resolvers, and DataLoader overhead are not justified',
    'Not implementing reconnection logic for WebSocket clients — connections drop, especially on mobile networks',
    'Choosing gRPC for a public-facing API — external developers expect REST or GraphQL, and gRPC requires client code generation from proto files',
    'Not setting appropriate timeouts on SSE connections — without heartbeats, some proxies and load balancers will close idle connections',
    'Using REST polling ("check every 5 seconds for updates") instead of SSE or WebSockets for near-real-time features',
  ],

  interviewQuestions: [
    {
      question: 'You are designing an API for a chat application like Slack. What API technology would you use and why?',
      answer:
        'WebSockets for real-time messaging. Chat requires bidirectional real-time communication: when User A sends a message, the server must push it to User B immediately without User B making a request. REST polling would add unacceptable latency and server load. SSE is unidirectional so the client cannot send messages. For message history and user management, REST is appropriate. At scale, each WebSocket server holds connections in memory, so you need Redis Pub/Sub to broadcast messages across multiple server instances.',
      difficulty: 'intermediate',
      followUp: [
        'How would you handle reconnection when a user loses network?',
        'How do you scale WebSocket servers horizontally?',
      ],
      tip: 'Mention that REST is still used alongside WebSockets for non-real-time features like loading history, user profiles, and settings.',
    },
    {
      question: 'What is the N+1 problem in GraphQL and how do you fix it?',
      answer:
        'The N+1 problem occurs when a GraphQL query fetches a list of N items and then for each item makes a separate database query — resulting in N+1 total queries. Example: fetch 100 users (1 query), then for each user fetch their posts (100 queries) = 101 queries total. The solution is DataLoader, a utility that batches all individual data fetches within a single event loop tick into one batched query. Instead of making 100 individual post queries, DataLoader collects all 100 user IDs and makes one query: SELECT * FROM posts WHERE user_id IN (1, 2, 3... 100). It also caches results within a single request.',
      difficulty: 'intermediate',
      followUp: ['How does DataLoader know when to execute the batch?'],
      tip: 'DataLoader uses the JavaScript event loop — it collects all .load() calls within one tick, then fires the batch function on the next tick. This is a subtle but important detail that shows deep understanding.',
    },
    {
      question: 'When would you choose gRPC over REST for a new API?',
      answer:
        'gRPC over REST when: (1) It is internal service-to-service communication — not a public API. (2) Performance is critical — gRPC uses binary protobuf and HTTP/2, making it 5-10x faster than REST/JSON. (3) You need streaming — gRPC supports server streaming, client streaming, and bidirectional streaming natively. (4) You have multiple service languages — proto files generate type-safe clients for Python, Go, Java, Node.js automatically. (5) Strong contracts matter — proto files version the API and breaking changes are caught at compile time. I would stick with REST when building a public API, when browser clients are involved (gRPC-Web has limitations), or when the team is small and the overhead is not justified.',
      difficulty: 'advanced',
      followUp: ['How does HTTP/2 make gRPC faster than REST over HTTP/1.1?'],
      tip: 'Mentioning HTTP/2 multiplexing (multiple streams over one TCP connection) and header compression shows you understand the underlying reason for gRPC\'s performance advantage.',
    },
    {
      question: 'What is the difference between WebSockets and Server-Sent Events? When would you choose each?',
      answer:
        'WebSockets provide a full-duplex (bidirectional) persistent TCP connection — both client and server can send messages at any time. SSE provides a unidirectional (server to client only) persistent HTTP connection. Choose WebSockets when the client also needs to send data over the same persistent connection: chat, multiplayer games, collaborative editing. Choose SSE when only the server pushes data: notification feeds, live dashboards, AI response streaming (like ChatGPT), deployment progress updates. SSE has key advantages over WebSockets for one-way push: built-in automatic reconnection with event ID resumption, works through HTTP proxies and corporate firewalls (it is just HTTP), and is simpler to implement and scale (stateless HTTP infrastructure handles it naturally).',
      difficulty: 'intermediate',
      followUp: ['How would you implement SSE reconnection to avoid missing events?'],
      tip: 'The SSE event ID and Last-Event-ID header enable reliable resumption — when the client reconnects, it sends the last received event ID and the server replays events from that point.',
    },
    {
      question: 'Why is HTTP caching hard with GraphQL? How would you address it?',
      answer:
        'HTTP caching works based on the request URL and method. REST GET requests are cacheable — CDNs and browsers cache them automatically based on URL. GraphQL uses POST for all queries (because the query is in the request body, not the URL), and HTTP caches do not cache POST requests. Solutions: (1) Persisted Queries — the client sends a hash of the query instead of the full query text, enabling GET requests for GraphQL that can be cached. (2) Client-side caching with Apollo Client or urql — these cache at the application layer using the response data\'s shape and IDs. (3) Field-level caching with CDN directives. (4) For truly cacheable public data, REST might actually be the right choice over GraphQL.',
      difficulty: 'advanced',
      followUp: ['What are Automatic Persisted Queries (APQ)?'],
      tip: 'Mentioning Apollo Client\'s normalized cache (which deduplicates objects by their __typename + id) shows you understand GraphQL client architecture.',
    },
  ],

  exercises: [
    {
      id: 'apis-ex-1',
      title: 'Design the API for a Twitter-Like Feed',
      description:
        'You are designing the API layer for a Twitter-like application. Users can post tweets, follow other users, and see a real-time feed of tweets from people they follow. New tweets from followed users appear instantly without refreshing. Design the API: (1) Which API technology for each feature? (2) Write the REST endpoints for tweet CRUD. (3) Describe the real-time feed delivery mechanism. (4) What status codes would your POST /tweets endpoint return in various scenarios?',
      starterCode: `// Design your API architecture

const twitterAPIDesign = {
  // 1. Technology choices per feature
  technologies: {
    tweetCRUD: '',       // REST, GraphQL, gRPC, WebSocket, or SSE?
    userProfiles: '',
    realtimeFeed: '',    // What technology and why?
    search: '',
    notifications: '',
  },

  // 2. REST endpoints for tweets
  tweetEndpoints: [
    // { method, path, description, requestBody?, responseCodes }
  ],

  // 3. Real-time feed mechanism
  realtimeFeedDesign: '',

  // 4. Status codes for POST /tweets
  statusCodes: {
    success: 0,
    notAuthenticated: 0,
    tweetTooLong: 0,
    rateLimited: 0,
    serverError: 0,
  },
};`,
      solution: `const twitterAPIDesign = {
  technologies: {
    tweetCRUD: 'REST — standard CRUD operations, cacheable GET requests for tweet detail pages',
    userProfiles: 'REST — resource-based, highly cacheable with CDN',
    realtimeFeed: 'SSE (Server-Sent Events) — server pushes new tweets to the client; client does not need to send anything back over the stream. Simpler than WebSockets and works through corporate proxies.',
    search: 'REST — request/response, results can be cached by query string',
    notifications: 'SSE — server pushes notifications; unidirectional is sufficient',
  },

  tweetEndpoints: [
    { method: 'POST',   path: '/tweets',          description: 'Create a tweet',                    requestBody: '{ content: string }' },
    { method: 'GET',    path: '/tweets/:id',       description: 'Get a specific tweet',              responseCodes: [200, 404] },
    { method: 'DELETE', path: '/tweets/:id',       description: 'Delete a tweet (own tweets only)', responseCodes: [204, 403, 404] },
    { method: 'GET',    path: '/users/:id/tweets', description: 'Get a user\'s tweets (paginated)', query: '?cursor=<tweet_id>&limit=20' },
    { method: 'POST',   path: '/tweets/:id/likes', description: 'Like a tweet',                     responseCodes: [201, 409] },
    { method: 'DELETE', path: '/tweets/:id/likes', description: 'Unlike a tweet',                   responseCodes: [204, 404] },
    { method: 'GET',    path: '/feed',             description: 'Get home timeline (REST fallback)', query: '?cursor=<tweet_id>' },
  ],

  realtimeFeedDesign: \`
    1. Client connects to GET /feed/stream (SSE endpoint) with auth token
    2. Server keeps connection open
    3. When any followed user posts a tweet:
       a. Tweet is saved to database
       b. Tweet is published to Redis Pub/Sub channel for each follower
       c. SSE servers subscribed to those channels push the tweet to connected clients
    4. Client receives SSE event and prepends tweet to the feed
    5. If connection drops, browser automatically reconnects using Last-Event-ID
       to resume from where it left off
  \`,

  statusCodes: {
    success: 201,          // Created — new tweet was successfully created
    notAuthenticated: 401, // Unauthorized — no valid auth token
    tweetTooLong: 422,     // Unprocessable Entity — content validation failed (> 280 chars)
    rateLimited: 429,      // Too Many Requests — posting too fast
    serverError: 500,      // Internal Server Error — database error, etc.
  },
};`,
      hints: [
        'For real-time feeds, think about whether the client needs to send data back over the same connection — this determines WebSockets vs SSE',
        'Twitter uses cursor-based pagination for feeds, not page numbers — think about why (infinite scroll, consistent results)',
        'When you delete a tweet, return 204 No Content — there is no body to return',
        'A like is itself a resource — POST /tweets/:id/likes creates a like, DELETE removes it',
      ],
    },
    {
      id: 'apis-ex-2',
      title: 'Implement a Rate Limiter Middleware for a REST API',
      description:
        'Build an Express middleware that rate limits API requests. Allow 100 requests per minute per IP address. After the limit is exceeded, return HTTP 429 with a Retry-After header indicating when the limit resets. Use an in-memory sliding window approach.',
      starterCode: `import { Request, Response, NextFunction } from 'express';

// In-memory store: IP → { count, windowStart }
const requestCounts = new Map<string, { count: number; windowStart: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || 'unknown';

  // TODO: Implement sliding window rate limiter
  // 1. Get or initialize the request count for this IP
  // 2. If the window has expired, reset it
  // 3. If under the limit, increment and allow
  // 4. If over the limit, return 429 with Retry-After header
}`,
      solution: `import { Request, Response, NextFunction } from 'express';

const requestCounts = new Map<string, { count: number; windowStart: number }>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || 'unknown';
  const now = Date.now();

  const record = requestCounts.get(ip);

  if (!record || now - record.windowStart >= WINDOW_MS) {
    // First request or window has expired — start a new window
    requestCounts.set(ip, { count: 1, windowStart: now });

    // Set rate limit headers (good practice — clients can see their limit)
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - 1);
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + WINDOW_MS) / 1000));

    return next();
  }

  // Window is still active
  if (record.count >= MAX_REQUESTS) {
    const windowEndsAt = record.windowStart + WINDOW_MS;
    const retryAfterSeconds = Math.ceil((windowEndsAt - now) / 1000);

    // RFC 6585: 429 Too Many Requests
    res.setHeader('Retry-After', retryAfterSeconds);
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', Math.ceil(windowEndsAt / 1000));

    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: \`Too many requests. Retry after \${retryAfterSeconds} seconds.\`,
      retryAfter: retryAfterSeconds,
    });
    return;
  }

  // Under the limit — increment and allow
  record.count++;
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - record.count);
  res.setHeader('X-RateLimit-Reset', Math.ceil((record.windowStart + WINDOW_MS) / 1000));

  next();
}`,
      hints: [
        'A "window" starts when the first request arrives and resets after WINDOW_MS milliseconds',
        'The Retry-After header should contain seconds until the rate limit resets — clients use this for exponential backoff',
        'In production, use Redis instead of in-memory Map — multiple server instances do not share memory',
        'Include X-RateLimit-* headers even on successful requests — clients can proactively throttle themselves',
      ],
    },
  ],

  keyTakeaways: [
    'REST is the default choice for public APIs and CRUD operations — it is universal, cacheable, and every developer knows it',
    'GraphQL solves over-fetching and under-fetching for complex frontends with multiple client types; avoid it for simple APIs or when caching is critical',
    'gRPC is the best choice for internal microservice communication — it is 5-10x faster than REST, has streaming support, and generates type-safe clients automatically from proto files',
    'WebSockets are for truly bidirectional real-time communication (chat, multiplayer games, collaborative editing) — the persistent connection is the core feature',
    'SSE is the simpler, HTTP-native alternative to WebSockets when you only need server-to-client push: notifications, live feeds, AI streaming — it auto-reconnects and works through proxies',
    'The API choice is a product decision, not just a technical one: consider who will consume the API, whether caching matters, whether real-time is needed, and your team\'s operational complexity tolerance',
    'In system design interviews, always justify your API choice against the requirements — do not default to REST without considering whether it actually fits',
  ],
};
