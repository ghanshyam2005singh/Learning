import type { Lesson } from '@/types';

export const apiDesignLesson: Lesson = {
  id: 'api-design',
  slug: 'api-design',
  title: 'API Design',
  description:
    'REST design principles, versioning, error handling, pagination, filtering, search, documentation, and the standards that make APIs a pleasure to work with.',
  category: 'Backend Systems',
  order: 11,
  difficulty: 'intermediate',
  estimatedTime: 28,
  content: `An API is a contract. Once published and used by clients, changing it breaks those clients. Good API design gets the contract right upfront.

This module covers REST design principles and the patterns every production API uses. These are the patterns you will use in every backend project you build.

---

## REST Design Principles

REST (Representational State Transfer) is a set of constraints for building web APIs.

**The core constraint:** Resources, not actions.

\`\`\`
BAD (action-based, RPC style):
  POST /getUser
  POST /createUser
  POST /updateUser
  POST /deleteUser
  POST /getUserPosts
  POST /createPost

GOOD (resource-based, REST style):
  GET    /users/:id        → get user
  POST   /users            → create user
  PUT    /users/:id        → replace user
  PATCH  /users/:id        → update user (partial)
  DELETE /users/:id        → delete user
  GET    /users/:id/posts  → get user's posts
  POST   /users/:id/posts  → create post for user
\`\`\`

**HTTP method semantics:**

| Method | Semantic | Idempotent? | Safe? |
|--------|----------|-------------|-------|
| GET | Read | Yes | Yes |
| POST | Create (or non-idempotent action) | No | No |
| PUT | Replace entire resource | Yes | No |
| PATCH | Partial update | Sometimes | No |
| DELETE | Remove | Yes | No |

Idempotent = calling it multiple times has the same effect as calling it once. Safe = does not modify state.

---

## URL Design

\`\`\`
✓ Use plural nouns for collections
  /users, /posts, /products, /orders

✓ Use :id for specific resources
  /users/123, /posts/abc-def

✓ Nest to show relationships
  /users/123/posts         ← posts belonging to user 123
  /posts/456/comments      ← comments on post 456
  /orders/789/items        ← items in order 789

✓ Use query params for filtering/sorting/pagination
  /posts?category=tech&sort=newest&page=2

✓ Use kebab-case
  /blog-posts, /user-profiles ← correct
  /blogPosts, /UserProfiles   ← avoid

✗ No verbs in URLs
  /users/123/getPosts       ← wrong
  /createUser               ← wrong
  /deletePost/456           ← wrong

✗ No deeply nested URLs (max 2-3 levels)
  /users/1/posts/2/comments/3/likes/4  ← too deep
  /comments/3/likes  ← better
\`\`\`

---

## API Versioning

APIs must be versioned so existing clients are not broken when you change the API.

**URL versioning (most common):**
\`\`\`
/api/v1/users
/api/v2/users
\`\`\`

**Header versioning:**
\`\`\`
GET /api/users
API-Version: 2
\`\`\`

**When to version:**
- Breaking changes: removing fields, changing field names, changing response shape
- Non-breaking changes (new optional fields, new endpoints) do NOT need a version bump

\`\`\`typescript
// Router structure for versioning
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// v2Router extends v1Router for unchanged endpoints
import { postsRouterV1 } from './v1/posts.router';
import { postsRouterV2 } from './v2/posts.router'; // breaking change in posts

v2Router.use('/posts', postsRouterV2);  // uses v2 for posts
v2Router.use('/users', postsRouterV1);  // still uses v1 (no change)
\`\`\`

---

## Error Handling

Consistent error responses make APIs predictable for clients.

**Standard error response shape:**
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ]
  },
  "requestId": "req_abc123"
}
\`\`\`

\`\`\`typescript
// error-response.ts
export function errorResponse(res: Response, statusCode: number, code: string, message: string, details?: unknown[]) {
  return res.status(statusCode).json({
    error: { code, message, ...(details ? { details } : {}) },
    requestId: res.locals.requestId,
  });
}

// Usage:
errorResponse(res, 400, 'VALIDATION_ERROR', 'Validation failed', [
  { field: 'email', message: 'Invalid email format' }
]);

errorResponse(res, 401, 'UNAUTHORIZED', 'Authentication required');
errorResponse(res, 403, 'FORBIDDEN', 'Insufficient permissions');
errorResponse(res, 404, 'NOT_FOUND', 'Post not found');
errorResponse(res, 409, 'CONFLICT', 'Email already registered');
errorResponse(res, 429, 'RATE_LIMIT', 'Too many requests');
errorResponse(res, 500, 'INTERNAL_ERROR', 'Internal server error');
\`\`\`

**HTTP status code guide:**
\`\`\`
2xx Success:
  200 OK              → Successful GET, PUT, PATCH
  201 Created         → Successful POST that created something
  204 No Content      → Successful DELETE (no body to return)

4xx Client errors:
  400 Bad Request     → Malformed request body
  401 Unauthorized    → Not authenticated
  403 Forbidden       → Authenticated but not allowed
  404 Not Found       → Resource does not exist
  409 Conflict        → Duplicate (email taken, uniqueness violation)
  422 Unprocessable   → Validation error (syntactically valid but semantically wrong)
  429 Too Many Req    → Rate limit hit

5xx Server errors:
  500 Internal Error  → Unexpected server bug
  503 Unavailable     → Server is down for maintenance
\`\`\`

---

## Pagination

Never return all records from a database. Large datasets kill performance.

**Offset-based pagination:**
\`\`\`
GET /posts?page=2&limit=20

Response:
{
  "data": [...20 posts...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}

SQL: SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 20
\`\`\`

Problems: for live data, if a new post is added between page 1 and page 2 requests, you may see a duplicate or miss an item.

**Cursor-based pagination (better for real-time data):**
\`\`\`
GET /posts?limit=20
→ Returns first 20 with cursor: "eyJpZCI6MjB9"

GET /posts?limit=20&cursor=eyJpZCI6MjB9
→ Returns next 20 starting after the cursor

Response:
{
  "data": [...20 posts...],
  "pagination": {
    "nextCursor": "eyJpZCI6NDB9",
    "hasMore": true
  }
}

SQL: SELECT * FROM posts WHERE id > $cursor ORDER BY id ASC LIMIT 20
\`\`\`

The cursor is typically a base64-encoded ID or timestamp that marks position in the dataset.

---

## Filtering and Sorting

\`\`\`typescript
// GET /posts?category=tech&status=published&sort=created_at&order=desc&limit=20&page=1

function buildPostsQuery(query: PostQueryParams) {
  let sql = 'SELECT * FROM posts WHERE 1=1';
  const params: unknown[] = [];
  let paramCount = 1;

  // Filtering
  if (query.category) {
    sql += \` AND category = $\${paramCount++}\`;
    params.push(query.category);
  }

  if (query.status) {
    sql += \` AND status = $\${paramCount++}\`;
    params.push(query.status);
  }

  if (query.authorId) {
    sql += \` AND author_id = $\${paramCount++}\`;
    params.push(query.authorId);
  }

  // Date range
  if (query.from) {
    sql += \` AND created_at >= $\${paramCount++}\`;
    params.push(new Date(query.from));
  }

  // Sorting (whitelist to prevent SQL injection)
  const allowedSortFields = ['created_at', 'title', 'likes_count'];
  const sortField = allowedSortFields.includes(query.sort!) ? query.sort : 'created_at';
  const sortOrder = query.order === 'asc' ? 'ASC' : 'DESC';
  sql += \` ORDER BY \${sortField} \${sortOrder}\`;

  // Pagination
  const limit = Math.min(parseInt(query.limit as string) || 20, 100);
  const offset = ((parseInt(query.page as string) || 1) - 1) * limit;
  sql += \` LIMIT \${limit} OFFSET \${offset}\`;

  return { sql, params };
}
\`\`\`

---

## Search

\`\`\`typescript
// Basic full-text search with PostgreSQL
// GET /posts/search?q=react+hooks

async function searchPosts(query: string, page: number) {
  const limit = 20;
  const offset = (page - 1) * limit;

  const { rows } = await db.query(
    \`SELECT id, title, content,
            ts_rank(search_vector, plainto_tsquery('english', $1)) AS rank
     FROM posts
     WHERE search_vector @@ plainto_tsquery('english', $1)
       AND published = true
     ORDER BY rank DESC
     LIMIT $2 OFFSET $3\`,
    [query, limit, offset]
  );

  return rows;
}

// Create the search index when the table is created:
// ALTER TABLE posts ADD COLUMN search_vector tsvector
//   GENERATED ALWAYS AS (
//     to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
//   ) STORED;
// CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
\`\`\`

---

## API Documentation

Every public API must be documented. Without documentation, it is useless.

**OpenAPI / Swagger:**
\`\`\`yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: MyApp API
  version: 1.0.0

paths:
  /api/v1/posts:
    get:
      summary: List posts
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: List of posts
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Post'
    post:
      summary: Create a post
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePostInput'
\`\`\`

**With TypeScript + Zod, you can auto-generate OpenAPI docs:**
\`\`\`typescript
import { generateOpenAPI } from 'zod-to-openapi';
// or use fastify-swagger, or @asteasolutions/zod-to-openapi
\`\`\`

---

## Response Envelope

Be consistent about your response shape.

\`\`\`typescript
// Consistent response format
type ApiResponse<T> = {
  data: T;
  meta?: {
    pagination?: Pagination;
    [key: string]: unknown;
  };
};

// GET /posts → list
{ data: [post1, post2, ...], meta: { pagination: {...} } }

// GET /posts/:id → single
{ data: post }

// POST /posts → created
{ data: newPost }  // HTTP 201

// DELETE /posts/:id
// HTTP 204 No Content — no body

// Error
{ error: { code, message, details? }, requestId }
\`\`\``,
  codeExamples: [
    {
      title: 'Complete REST Endpoint with Pagination, Filtering, and Error Handling',
      code: `// posts.controller.ts
import { z } from 'zod';

const listPostsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  sort: z.enum(['created_at', 'likes_count', 'title']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  q: z.string().min(1).max(200).optional(),
});

export const postsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listPostsSchema.parse(req.query);

      const { posts, total } = await postsService.list(query);

      const totalPages = Math.ceil(total / query.limit);

      res.json({
        data: posts,
        meta: {
          pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages,
            hasNextPage: query.page < totalPages,
            hasPrevPage: query.page > 1,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        });
      }
      next(error);
    }
  },
};`,
      explanation:
        'Zod validates and coerces query parameters (strings from URL become numbers/enums). Response always includes pagination metadata. ZodError is caught and returns 422.',
    },
  ],
  commonMistakes: [
    'Using verbs in URLs (/getUser, /createPost) instead of HTTP methods on resource URLs',
    'Returning 200 for errors — clients cannot distinguish success from failure',
    'No pagination — returning all records causes timeouts on large datasets',
    'No API versioning — making breaking changes breaks existing clients',
    'Inconsistent response shapes — sometimes returning the object directly, sometimes wrapping in { data: ... }',
    'Allowing unsanitized sort field from query params directly in SQL — SQL injection risk',
    'No documentation — other developers (and future you) cannot use the API',
  ],
  interviewQuestions: [
    {
      question: 'What are the HTTP methods and when do you use each?',
      answer:
        'GET retrieves resources (safe, idempotent). POST creates resources or performs non-idempotent actions. PUT replaces an entire resource (idempotent). PATCH partially updates a resource. DELETE removes a resource (idempotent). The key distinction is GET vs POST (read vs write) and PUT vs PATCH (full replace vs partial update).',
      difficulty: 'beginner',
    },
    {
      question: 'What is the difference between offset-based and cursor-based pagination?',
      answer:
        'Offset pagination uses page number and limit (LIMIT n OFFSET m). Simple to implement but has issues with live data — new items added between requests cause items to appear on two pages or be skipped. Cursor pagination uses a pointer to the last seen item (usually ID or timestamp). Always consistent because you are fetching items "after this specific item" regardless of what was inserted. Better for infinite scroll feeds; offset is fine for paginated tables.',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you handle API versioning?',
      answer:
        'URL versioning (/api/v1/, /api/v2/) is the most common approach — explicit, visible in logs, easy to route differently. Breaking changes (removing fields, changing response shape) require a new version. Non-breaking changes (new optional fields, new endpoints) do not. Maintain old versions until clients have migrated, with a deprecation timeline communicated in headers or documentation.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'design-blog-api',
      title: 'Design a Blog API',
      description:
        'Design the complete REST API for a blog platform. List all endpoints (method + URL), their request/response shapes, required auth, and error cases. Include pagination for list endpoints.',
      starterCode: `// Blog API Design
// Entities: User, Post, Comment, Tag

// ENDPOINTS:

// Authentication:
// POST /api/v1/auth/signup  → ...
// POST /api/v1/auth/login   → ...

// Posts:
// GET  /api/v1/posts        → ...
// POST /api/v1/posts        → ...
// ...

// Comments:
// ...

// Tags:
// ...

// Admin:
// ...`,
      solution: `// Blog API Design

// AUTHENTICATION
// POST /api/v1/auth/signup
//   Body: { email, password, name }
//   Response 201: { data: { user, accessToken, refreshToken } }
//   Errors: 409 email exists, 422 validation

// POST /api/v1/auth/login
//   Body: { email, password }
//   Response 200: { data: { user, accessToken, refreshToken } }
//   Errors: 401 invalid credentials

// POST /api/v1/auth/refresh
//   Body: { refreshToken }
//   Response 200: { data: { accessToken } }

// POSTS
// GET /api/v1/posts?page=1&limit=20&category=tech&q=react
//   Response: { data: Post[], meta: { pagination } }

// GET /api/v1/posts/:id
//   Response: { data: Post }
//   Errors: 404 not found

// POST /api/v1/posts  [AUTH REQUIRED]
//   Body: { title, content, category, tags: string[], published?: boolean }
//   Response 201: { data: Post }
//   Errors: 422 validation, 401 unauth

// PATCH /api/v1/posts/:id  [AUTH, OWNER]
//   Body: { title?, content?, published? }
//   Response: { data: Post }
//   Errors: 403 not owner, 404 not found

// DELETE /api/v1/posts/:id  [AUTH, OWNER or ADMIN]
//   Response 204: (no body)
//   Errors: 403 forbidden, 404 not found

// GET /api/v1/users/:id/posts
//   Response: { data: Post[], meta: { pagination } }

// COMMENTS
// GET /api/v1/posts/:postId/comments?page=1
//   Response: { data: Comment[], meta: { pagination } }

// POST /api/v1/posts/:postId/comments  [AUTH]
//   Body: { content, parentId?: string }  // parentId for replies
//   Response 201: { data: Comment }

// PATCH /api/v1/comments/:id  [AUTH, OWNER]
//   Body: { content }
//   Response: { data: Comment }

// DELETE /api/v1/comments/:id  [AUTH, OWNER or ADMIN]
//   Response 204

// TAGS
// GET /api/v1/tags
//   Response: { data: Tag[] }  // all tags (no pagination — usually small)

// GET /api/v1/tags/:slug/posts?page=1
//   Response: { data: Post[], meta: { pagination } }

// ADMIN (requires admin role)
// GET /api/v1/admin/users?page=1
// PATCH /api/v1/admin/users/:id/ban
// DELETE /api/v1/admin/posts/:id`,
      hints: [
        'Every list endpoint needs pagination query params (page, limit)',
        'Auth-required endpoints should be marked clearly — list them explicitly',
        'Owner vs admin: some endpoints allow both (delete own post, admin delete any post)',
        'Comments need a parentId for reply threads',
      ],
    },
  ],
  keyTakeaways: [
    'REST uses HTTP methods on resource URLs — nouns, not verbs',
    'GET retrieves, POST creates, PUT replaces, PATCH partially updates, DELETE removes',
    'Version APIs (/api/v1/) — breaking changes need a new version to avoid breaking clients',
    'Always paginate list endpoints — never return all records',
    'Consistent error response shape: { error: { code, message, details? } }',
    'Whitelist sort fields before using them in SQL to prevent SQL injection',
    'Document every API with OpenAPI/Swagger — undocumented APIs are unusable',
  ],
  nextLesson: 'security',
  prevLesson: 'file-storage',
};
