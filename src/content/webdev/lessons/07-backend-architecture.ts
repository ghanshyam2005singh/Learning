import type { Lesson } from '@/types';

export const backendArchitectureLesson: Lesson = {
  id: 'backend-architecture',
  slug: 'backend-architecture',
  title: 'Backend Architecture',
  description:
    'Services, controllers, repositories, validation, authentication middleware, modular design — how to structure a Node.js backend that scales with your team and requirements.',
  category: 'Architecture',
  order: 7,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `You already know how to build Express routes and query databases from the Node.js track. What you are learning here is how to organize a backend application that multiple developers can work on without stepping on each other.

A route handler that does everything — validation, business logic, database query, response formatting — works for small projects. It does not work when:
- You need to test business logic independently of HTTP
- Two developers are working on the same feature
- The same logic is needed in multiple places
- You need to swap the database without rewriting business logic

---

## The Layered Architecture Pattern

A well-structured backend has distinct layers, each with one responsibility.

\`\`\`
HTTP Request
     ↓
┌─────────────────────────────────────────────────┐
│                   MIDDLEWARE                      │
│  Authentication, CORS, rate limiting, logging    │
└─────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────┐
│                  CONTROLLER                       │
│  Parse request, call service, format response    │
│  Knows HTTP. Knows nothing about business logic. │
└─────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────┐
│                   SERVICE                         │
│  Business logic. Orchestrates operations.        │
│  Knows nothing about HTTP or database details.   │
└─────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────┐
│                 REPOSITORY                        │
│  Database access. All queries live here.         │
│  Knows nothing about HTTP or business logic.     │
└─────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────┐
│                  DATABASE                         │
│              PostgreSQL / MongoDB                │
└─────────────────────────────────────────────────┘
\`\`\`

---

## Folder Structure

\`\`\`
src/
  modules/               ← feature modules
    users/
      users.controller.ts
      users.service.ts
      users.repository.ts
      users.validation.ts
      users.types.ts
      users.router.ts
      users.test.ts

    posts/
      posts.controller.ts
      posts.service.ts
      posts.repository.ts
      posts.validation.ts
      posts.types.ts
      posts.router.ts

    auth/
      auth.controller.ts
      auth.service.ts
      auth.validation.ts
      auth.types.ts
      auth.router.ts

  middleware/
    authenticate.ts       ← JWT verification
    validate.ts           ← request validation middleware
    errorHandler.ts       ← global error handler
    rateLimiter.ts        ← rate limiting

  lib/
    db.ts                 ← database connection
    redis.ts              ← Redis connection
    email.ts              ← email client
    logger.ts             ← structured logging

  app.ts                  ← Express app setup
  server.ts               ← HTTP server start
\`\`\`

---

## Controllers

A controller handles one thing: translating HTTP to function calls and back.

**What a controller does:**
1. Extract data from request (params, body, query, user)
2. Call the service with that data
3. Return the response

**What a controller does NOT do:**
- Business logic (does the user have permission? is the post valid?)
- Database queries
- External API calls

\`\`\`typescript
// modules/posts/posts.controller.ts
import type { Request, Response, NextFunction } from 'express';
import { postsService } from './posts.service';
import { createPostSchema, updatePostSchema } from './posts.validation';

export const postsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const posts = await postsService.getAllForUser(req.user.id, page);
      res.json({ posts, page });
    } catch (error) {
      next(error); // pass to global error handler
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postsService.getById(req.params.id, req.user.id);
      res.json(post);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPostSchema.parse(req.body); // validate
      const post = await postsService.create(data, req.user.id);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updatePostSchema.parse(req.body);
      const post = await postsService.update(req.params.id, data, req.user.id);
      res.json(post);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await postsService.delete(req.params.id, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
\`\`\`

---

## Services

Services contain business logic. This is where decisions are made.

\`\`\`typescript
// modules/posts/posts.service.ts
import { postsRepository } from './posts.repository';
import { NotFoundError, ForbiddenError } from '@/lib/errors';
import type { CreatePostInput, UpdatePostInput } from './posts.types';

export const postsService = {
  async getAllForUser(userId: string, page: number) {
    const limit = 20;
    const offset = (page - 1) * limit;
    return postsRepository.findByUser(userId, { limit, offset });
  },

  async getById(postId: string, requestingUserId: string) {
    const post = await postsRepository.findById(postId);
    if (!post) throw new NotFoundError('Post not found');

    // Business rule: can only see your own private posts
    if (!post.published && post.authorId !== requestingUserId) {
      throw new ForbiddenError('Access denied');
    }

    return post;
  },

  async create(data: CreatePostInput, authorId: string) {
    // Business rule: enforce word limit
    const wordCount = data.content.split(' ').length;
    if (wordCount > 10000) {
      throw new ValidationError('Post cannot exceed 10,000 words');
    }

    return postsRepository.create({ ...data, authorId });
  },

  async update(postId: string, data: UpdatePostInput, requestingUserId: string) {
    const post = await postsRepository.findById(postId);
    if (!post) throw new NotFoundError('Post not found');

    // Business rule: only author can edit
    if (post.authorId !== requestingUserId) {
      throw new ForbiddenError('You cannot edit this post');
    }

    return postsRepository.update(postId, data);
  },

  async delete(postId: string, requestingUserId: string) {
    const post = await postsRepository.findById(postId);
    if (!post) throw new NotFoundError('Post not found');

    if (post.authorId !== requestingUserId) {
      throw new ForbiddenError('You cannot delete this post');
    }

    await postsRepository.delete(postId);
  },
};
\`\`\`

Notice: the service never uses \`req\` or \`res\`. It works with plain data. This means you can call service functions from:
- HTTP request handlers
- Background jobs
- CLI scripts
- Tests

---

## Repositories

Repositories contain all database access. One repository per entity.

\`\`\`typescript
// modules/posts/posts.repository.ts
import { db } from '@/lib/db';
import type { Post, CreatePostInput, UpdatePostInput } from './posts.types';

export const postsRepository = {
  async findByUser(
    userId: string,
    { limit, offset }: { limit: number; offset: number }
  ): Promise<Post[]> {
    const { rows } = await db.query(
      \`SELECT id, title, content, published, created_at
       FROM posts
       WHERE author_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3\`,
      [userId, limit, offset]
    );
    return rows;
  },

  async findById(id: string): Promise<Post | null> {
    const { rows } = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    return rows[0] ?? null;
  },

  async create(data: CreatePostInput & { authorId: string }): Promise<Post> {
    const { rows } = await db.query(
      \`INSERT INTO posts (title, content, author_id, published)
       VALUES ($1, $2, $3, $4)
       RETURNING *\`,
      [data.title, data.content, data.authorId, data.published ?? false]
    );
    return rows[0];
  },

  async update(id: string, data: UpdatePostInput): Promise<Post> {
    const { rows } = await db.query(
      \`UPDATE posts
       SET title = COALESCE($2, title),
           content = COALESCE($3, content),
           published = COALESCE($4, published),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *\`,
      [id, data.title, data.content, data.published]
    );
    return rows[0];
  },

  async delete(id: string): Promise<void> {
    await db.query('DELETE FROM posts WHERE id = $1', [id]);
  },
};
\`\`\`

---

## Validation

Validate all input at the boundary — before it reaches business logic.

\`\`\`typescript
// modules/posts/posts.validation.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().optional().default(false),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
});

// Validation middleware
export function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
}
\`\`\`

---

## Authentication Middleware

\`\`\`typescript
// middleware/authenticate.ts
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Optional authentication — user might or might not be logged in
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = { id: payload.userId, email: payload.email };
    } catch {
      // Token invalid — treat as anonymous, don't error
    }
  }
  next();
}
\`\`\`

---

## Routers

The router wires middleware, validation, and controllers together.

\`\`\`typescript
// modules/posts/posts.router.ts
import { Router } from 'express';
import { authenticate } from '@/middleware/authenticate';
import { validate } from '@/middleware/validate';
import { postsController } from './posts.controller';
import { createPostSchema, updatePostSchema } from './posts.validation';

const router = Router();

router.get('/', authenticate, postsController.getAll);
router.get('/:id', authenticate, postsController.getById);
router.post('/', authenticate, validate(createPostSchema), postsController.create);
router.patch('/:id', authenticate, validate(updatePostSchema), postsController.update);
router.delete('/:id', authenticate, postsController.delete);

export { router as postsRouter };

// app.ts
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
\`\`\`

---

## Global Error Handler

\`\`\`typescript
// middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') { super(404, message); }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') { super(403, message); }
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  // Unexpected errors
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
}

// Register as last middleware in app.ts
app.use(errorHandler);
\`\`\``,
  codeExamples: [
    {
      title: 'Testing the Service Layer in Isolation',
      code: `// modules/posts/posts.service.test.ts
import { postsService } from './posts.service';
import { postsRepository } from './posts.repository';

// Mock the repository — service should not hit the real database
jest.mock('./posts.repository');
const mockRepo = postsRepository as jest.Mocked<typeof postsRepository>;

describe('postsService.delete', () => {
  it('throws NotFoundError when post does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(postsService.delete('999', 'user-1'))
      .rejects.toThrow('Post not found');
  });

  it('throws ForbiddenError when user is not the author', async () => {
    mockRepo.findById.mockResolvedValue({
      id: '1', authorId: 'user-2', title: 'Post', content: 'Content'
    });

    await expect(postsService.delete('1', 'user-1'))
      .rejects.toThrow('You cannot delete this post');
  });

  it('deletes the post when user is the author', async () => {
    mockRepo.findById.mockResolvedValue({
      id: '1', authorId: 'user-1', title: 'Post', content: 'Content'
    });
    mockRepo.delete.mockResolvedValue();

    await postsService.delete('1', 'user-1');

    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });
});`,
      explanation:
        'Because the service has no HTTP or database dependencies, testing it is clean. Mock the repository, test business logic in isolation. This is impossible if business logic is inside route handlers.',
    },
  ],
  commonMistakes: [
    'Putting database queries inside controllers — impossible to test without a real database',
    'Putting business logic inside repositories — repositories should only query, never decide',
    'Not using a global error handler — try/catch in every controller is repetitive and inconsistent',
    'Skipping input validation — raw req.body reaching service code causes unpredictable errors',
    'Not typing req.user — TypeScript cannot help you if the user shape is unknown',
    'Putting all routes in one file — impossible to maintain when the application grows',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between a controller, service, and repository?',
      answer:
        'Controller handles HTTP concerns: parsing request, calling service, formatting response. Service handles business logic: authorization checks, validation rules, orchestrating operations. Repository handles data access: all database queries live here. This separation means you can test business logic without HTTP, swap databases without touching business logic, and reuse service logic from different entry points (HTTP, CLI, jobs).',
      difficulty: 'intermediate',
    },
    {
      question: 'Why should you use a global error handler in Express?',
      answer:
        'A global error handler (registered as the last middleware with 4 parameters) catches all errors passed via next(error). Without it, you need try/catch in every controller with consistent error formatting. With it, all errors are handled in one place: AppError subclasses get their status codes, unexpected errors get 500 responses, and all error responses have a consistent structure.',
      difficulty: 'intermediate',
    },
    {
      question: 'Where should input validation happen in a layered backend?',
      answer:
        'Validation should happen at the boundary — in middleware before the request reaches the controller, or at the start of the controller. Service functions should receive already-validated, correctly-typed data. Using Zod (or Joi) schemas at the route level catches invalid input before it reaches business logic, and returns consistent 422 Validation errors with field-level details.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'implement-users-module',
      title: 'Implement the Users Module',
      description:
        'Create the users module following the layered architecture. Implement: users.types.ts (User, UpdateUserInput), users.repository.ts (findById, update, delete), users.service.ts (getProfile, updateProfile, deleteAccount), users.controller.ts (getProfile, updateProfile).',
      starterCode: `// users.types.ts
export interface User {
  // ...
}

export interface UpdateUserInput {
  // ...
}

// users.repository.ts
export const usersRepository = {
  async findById(id: string): Promise<User | null> {
    // TODO
  },
  async update(id: string, data: UpdateUserInput): Promise<User> {
    // TODO
  },
  async delete(id: string): Promise<void> {
    // TODO
  },
};

// users.service.ts
export const usersService = {
  async getProfile(userId: string): Promise<User> {
    // TODO: fetch user, throw NotFoundError if not found
  },
  async updateProfile(userId: string, data: UpdateUserInput): Promise<User> {
    // TODO: validate, update, return updated user
  },
  async deleteAccount(userId: string): Promise<void> {
    // TODO: delete user and their data
  },
};`,
      solution: `// users.types.ts
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

export interface UpdateUserInput {
  username?: string;
  avatar?: string;
  bio?: string;
}

// users.repository.ts
import { db } from '@/lib/db';

export const usersRepository = {
  async findById(id: string): Promise<User | null> {
    const { rows } = await db.query(
      'SELECT id, email, username, avatar, bio, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] ?? null;
  },

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const { rows } = await db.query(
      \`UPDATE users
       SET username = COALESCE($2, username),
           avatar = COALESCE($3, avatar),
           bio = COALESCE($4, bio),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, username, avatar, bio, created_at\`,
      [id, data.username, data.avatar, data.bio]
    );
    return rows[0];
  },

  async delete(id: string): Promise<void> {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  },
};

// users.service.ts
import { usersRepository } from './users.repository';
import { NotFoundError } from '@/lib/errors';

export const usersService = {
  async getProfile(userId: string): Promise<User> {
    const user = await usersRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return user;
  },

  async updateProfile(userId: string, data: UpdateUserInput): Promise<User> {
    const user = await usersRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return usersRepository.update(userId, data);
  },

  async deleteAccount(userId: string): Promise<void> {
    const user = await usersRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    // In production: anonymize data, cancel subscriptions, etc.
    await usersRepository.delete(userId);
  },
};`,
      hints: [
        'Repository never throws business errors — it returns null for not found',
        'Service throws NotFoundError when the repository returns null',
        'Controller catches errors and passes them to next()',
      ],
    },
  ],
  keyTakeaways: [
    'Layered architecture: middleware → controller → service → repository → database',
    'Controllers translate HTTP to function calls; they contain no business logic',
    'Services contain business logic (authorization, rules, orchestration); they know nothing about HTTP',
    'Repositories contain all database queries; they know nothing about business logic',
    'Validate all input at the boundary before it reaches the service',
    'A global error handler eliminates repetitive try/catch with consistent error responses',
    'Separated layers make unit testing possible: mock the repository, test the service in isolation',
  ],
  nextLesson: 'database-design',
  prevLesson: 'frontend-architecture',
};
