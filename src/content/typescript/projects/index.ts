import type { Project } from '@/types';

export const projects: Project[] = [
  // ─── PROJECT 1 ────────────────────────────────────────────────────────────────
  {
    id: 'ts-typed-todo',
    slug: 'ts-typed-todo',
    title: 'Typed Todo App',
    description: 'Build a fully typed todo application with CRUD operations, filtering, and search — all type-safe.',
    difficulty: 'beginner',
    estimatedTime: '2 hours',
    techStack: ['TypeScript', 'HTML', 'CSS'],
    features: [
      'Create, update, delete todos',
      'Filter by status (pending / in_progress / completed)',
      'Filter by priority (low / medium / high)',
      'Search todos by title',
      'Typed localStorage persistence',
      'Zero any — full type coverage',
    ],
    folderStructure: `typed-todo/
├── src/
│   ├── types.ts        # All TypeScript interfaces
│   ├── storage.ts      # Typed localStorage wrapper
│   ├── service.ts      # TodoService class
│   └── main.ts         # UI and event handlers
├── index.html
└── tsconfig.json`,
    steps: [
      {
        title: 'Define all types first',
        description: 'Start with types — they are the contract everything else follows.',
        code: `// src/types.ts
export type TodoId = \`todo-\${string}\`;
export type Priority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'in_progress' | 'completed';

export interface Todo {
  readonly id: TodoId;
  title: string;
  description?: string;
  priority: Priority;
  status: TodoStatus;
  tags: string[];
  readonly createdAt: string; // ISO string for localStorage serialization
  dueDate?: string;
}

export type CreateTodoInput = Omit<Todo, 'id' | 'createdAt' | 'status'> & {
  status?: TodoStatus;
};

export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'createdAt'>>;

export interface TodoFilters {
  status?: TodoStatus;
  priority?: Priority;
  search?: string;
}`,
        hint: 'Always define types before implementation. Types are the contract everything else follows.',
      },
      {
        title: 'Build a typed localStorage wrapper',
        description: 'Create a generic TypedStorage class so data access is always type-safe.',
        code: `// src/storage.ts
export class TypedStorage<Schema extends Record<string, unknown>> {
  get<K extends keyof Schema>(key: K): Schema[K] | null {
    const raw = localStorage.getItem(String(key));
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as Schema[K];
    } catch {
      return null;
    }
  }

  set<K extends keyof Schema>(key: K, value: Schema[K]): void {
    localStorage.setItem(String(key), JSON.stringify(value));
  }

  remove<K extends keyof Schema>(key: K): void {
    localStorage.removeItem(String(key));
  }
}

// App-specific storage schema
import type { Todo } from './types';

interface AppStorage {
  todos: Todo[];
}

export const storage = new TypedStorage<AppStorage>();`,
        hint: 'The Schema generic ensures every key has a declared type. storage.get("todos") returns Todo[] | null automatically.',
      },
      {
        title: 'Implement the TodoService',
        description: 'The service holds all business logic — no any, no type assertions where avoidable.',
        code: `// src/service.ts
import type { Todo, TodoId, CreateTodoInput, UpdateTodoInput, TodoFilters } from './types';
import { storage } from './storage';

export class TodoService {
  private todos: Todo[];

  constructor() {
    this.todos = storage.get('todos') ?? [];
  }

  private save(): void {
    storage.set('todos', this.todos);
  }

  getAll(filters?: TodoFilters): Todo[] {
    let result = [...this.todos];

    if (filters?.status) {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters?.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }

    return result.sort((a, b) => {
      const order: Record<Todo['priority'], number> = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  }

  create(input: CreateTodoInput): Todo {
    const todo: Todo = {
      id: \`todo-\${crypto.randomUUID()}\` as TodoId,
      status: 'pending',
      tags: [],
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.todos.push(todo);
    this.save();
    return todo;
  }

  update(id: TodoId, input: UpdateTodoInput): Todo {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) throw new Error(\`Todo \${id} not found\`);

    this.todos[index] = { ...this.todos[index], ...input };
    this.save();
    return this.todos[index];
  }

  delete(id: TodoId): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
  }
}`,
        hint: 'The service is pure TypeScript — no DOM access. Keep business logic and UI separate.',
      },
      {
        title: 'Wire up the UI',
        description: 'Connect the typed service to the DOM with properly typed event handlers.',
        code: `// src/main.ts
import { TodoService } from './service';
import type { TodoFilters, Priority, TodoStatus } from './types';

const service = new TodoService();
let filters: TodoFilters = {};

function renderTodos(): void {
  const list = document.getElementById('todo-list')!;
  const todos = service.getAll(filters);

  list.innerHTML = todos.map(todo => \`
    <li class="todo \${todo.status}" data-id="\${todo.id}">
      <span class="priority \${todo.priority}">\${todo.priority}</span>
      <span class="title">\${todo.title}</span>
      <span class="status">\${todo.status}</span>
      <button class="complete-btn" data-id="\${todo.id}">✓</button>
      <button class="delete-btn" data-id="\${todo.id}">✗</button>
    </li>
  \`).join('');
}

// Event: create todo
document.getElementById('create-form')?.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const titleInput = form.querySelector<HTMLInputElement>('[name="title"]')!;
  const prioritySelect = form.querySelector<HTMLSelectElement>('[name="priority"]')!;

  service.create({
    title: titleInput.value.trim(),
    priority: prioritySelect.value as Priority,
    tags: [],
  });

  form.reset();
  renderTodos();
});

// Event: filter
document.getElementById('status-filter')?.addEventListener('change', (e: Event) => {
  const select = e.target as HTMLSelectElement;
  filters = { ...filters, status: (select.value as TodoStatus) || undefined };
  renderTodos();
});

renderTodos();`,
        hint: 'Use querySelector<HTMLInputElement> to get typed DOM elements. Cast select values to the union type when needed.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why did you use Omit and intersection (&) for CreateTodoInput instead of defining it manually?',
        answer: 'Omit<Todo, "id" | "createdAt"> derives from the source type automatically — if I add a field to Todo, CreateTodoInput includes it without manual changes. The intersection & { status?: TodoStatus } adds the optional override. This composition with utility types reduces duplication and keeps types synchronized.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['typescript', 'crud', 'types', 'localStorage'],
  },

  // ─── PROJECT 2 ────────────────────────────────────────────────────────────────
  {
    id: 'ts-typed-api-client',
    slug: 'ts-typed-api-client',
    title: 'Typed API Client',
    description: 'Build a generic type-safe HTTP client where TypeScript knows the response type for every endpoint.',
    difficulty: 'intermediate',
    estimatedTime: '3 hours',
    techStack: ['TypeScript', 'Node.js', 'Fetch API'],
    features: [
      'Generic get<T>, post<TBody, TRes>, put, delete methods',
      'Request interceptors (add auth headers)',
      'Response interceptors (unwrap envelope)',
      'Typed error handling',
      'Request cancellation with AbortController',
      'No any — every response is typed',
    ],
    folderStructure: `typed-api-client/
├── src/
│   ├── types.ts          # ApiResponse, ApiError types
│   ├── client.ts         # TypedApiClient class
│   ├── interceptors.ts   # Auth and response interceptors
│   └── index.ts          # Configured client export
└── tsconfig.json`,
    steps: [
      {
        title: 'Define the API types',
        description: 'Every API response follows a consistent envelope structure.',
        code: `// src/types.ts
export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, string[]>;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiRequestError';
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;`,
        hint: 'Define errors as typed classes so instanceof checks work correctly.',
      },
      {
        title: 'Build the TypedApiClient class',
        description: 'Generic methods that preserve type information through the entire request lifecycle.',
        code: `// src/client.ts
import { ApiRequestError } from './types';
import type { ApiEnvelope, RequestInterceptor, ResponseInterceptor } from './types';

export class TypedApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(private readonly baseUrl: string) {}

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private async buildConfig(init: RequestInit): Promise<RequestInit> {
    let config = init;
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }
    return config;
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    signal?: AbortSignal,
  ): Promise<T> {
    const config = await this.buildConfig({
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
      signal,
    });

    let response = await fetch(\`\${this.baseUrl}\${path}\`, config);

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as Partial<ApiRequestError>;
      throw new ApiRequestError(
        response.status,
        error.code ?? 'UNKNOWN',
        error.message ?? \`HTTP \${response.status}\`,
        error.details,
      );
    }

    const envelope = await response.json() as ApiEnvelope<T>;
    return envelope.data;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: 'GET' }, signal);
  }

  post<TBody, TResponse>(path: string, body: TBody, signal?: AbortSignal): Promise<TResponse> {
    return this.request<TResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }, signal);
  }

  put<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}`,
        hint: 'The generic T in request<T> flows through to the caller. TypeScript knows the resolved type without any casting at the call site.',
      },
      {
        title: 'Create and configure the client',
        description: 'Add auth interceptor and export a configured singleton.',
        code: `// src/index.ts
import { TypedApiClient } from './client';

const client = new TypedApiClient(process.env.API_URL ?? 'http://localhost:3000');

// Auth interceptor — adds JWT to every request
client.addRequestInterceptor((config) => ({
  ...config,
  headers: {
    ...config.headers,
    Authorization: \`Bearer \${localStorage.getItem('token') ?? ''}\`,
  },
}));

export { client };
export type { ApiRequestError } from './types';

// Usage:
interface User { id: string; name: string; email: string; }
interface CreateUserInput { name: string; email: string; }

const user = await client.get<User>('/users/123');
// TypeScript knows: user is User

const newUser = await client.post<CreateUserInput, User>('/users', { name: 'Alice', email: 'alice@example.com' });
// TypeScript knows: newUser is User`,
        hint: 'The client is a singleton. Import client everywhere and TypeScript tracks the types at every call site.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How does TypeScript know the response type when calling client.get<User>("/users/123")?',
        answer: 'The T in get<T>(path: string): Promise<T> is explicitly provided by the caller. TypeScript uses the provided T to type the return. At runtime, the JSON is cast as ApiEnvelope<T> — the type safety is compile-time only. To truly validate the runtime shape, you would add Zod parsing inside the request method.',
        difficulty: 'advanced',
      },
    ],
    tags: ['typescript', 'api', 'generics', 'http-client'],
  },

  // ─── PROJECT 3 ────────────────────────────────────────────────────────────────
  {
    id: 'ts-typed-express-api',
    slug: 'ts-typed-express-api',
    title: 'Typed Express REST API',
    description: 'Build a fully typed Node.js/Express REST API for a blog — typed routes, middleware, services, and database layer.',
    difficulty: 'advanced',
    estimatedTime: '5 hours',
    techStack: ['TypeScript', 'Node.js', 'Express', 'Zod', 'Prisma'],
    features: [
      'Typed request/response with Express generics',
      'Generic Zod validation middleware',
      'Custom error hierarchy (AppError, NotFoundError, ValidationError)',
      'Auth middleware with augmented Express.Request',
      'Typed service and repository layers',
      'Environment variable validation with Zod',
    ],
    folderStructure: `blog-api/
├── src/
│   ├── types/
│   │   ├── domain.ts       # Post, User, Comment interfaces
│   │   ├── dto.ts          # Request/Response DTOs
│   │   └── express.d.ts    # Express Request augmentation
│   ├── errors/
│   │   └── AppError.ts     # Custom error classes
│   ├── middleware/
│   │   ├── auth.ts         # Auth middleware
│   │   ├── validate.ts     # Generic validation middleware
│   │   └── errors.ts       # Error handler middleware
│   ├── services/
│   │   └── PostService.ts
│   ├── routes/
│   │   └── posts.ts
│   └── app.ts
├── tsconfig.json
└── package.json`,
    steps: [
      {
        title: 'Set up types and error classes',
        description: 'Define domain types, DTOs, and a custom error hierarchy.',
        code: `// src/types/domain.ts
export type PostId = string;
export type UserId = string;

export interface Post {
  readonly id: PostId;
  title: string;
  content: string;
  excerpt: string;
  authorId: UserId;
  published: boolean;
  tags: string[];
  readonly createdAt: Date;
  updatedAt: Date;
}

// src/types/dto.ts
export type CreatePostDTO = Pick<Post, 'title' | 'content' | 'tags'> & {
  excerpt?: string;
};
export type UpdatePostDTO = Partial<CreatePostDTO & Pick<Post, 'published'>>;
export type PostResponseDTO = Omit<Post, 'authorId'> & { author: { name: string } };

// src/errors/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(\`\${resource} not found\`, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends AppError {
  constructor(public readonly fields: Record<string, string[]>) {
    super('Validation failed', 'VALIDATION_ERROR', 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('Authentication required', 'UNAUTHORIZED', 401);
  }
}`,
        hint: 'Object.setPrototypeOf(this, new.target.prototype) is essential — it makes instanceof checks work correctly when extending Error.',
      },
      {
        title: 'Augment Express Request and build middleware',
        description: 'Add req.user via declaration merging and build a generic validation middleware.',
        code: `// src/types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'admin' | 'user';
      };
    }
  }
}

// src/middleware/validate.ts
import { z } from 'zod';
import type { RequestHandler } from 'express';
import { ValidationError } from '../errors/AppError';

export function validateBody<T extends z.ZodType>(schema: T): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields: Record<string, string[]> = {};
      result.error.errors.forEach(err => {
        const key = err.path.join('.');
        if (!fields[key]) fields[key] = [];
        fields[key].push(err.message);
      });
      return next(new ValidationError(fields));
    }
    req.body = result.data;
    next();
  };
}

// src/middleware/errors.ts
import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
  } else {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
};`,
        hint: 'The express.d.ts declaration file must be included in tsconfig. The global namespace Express augmentation is how all Express type extensions work.',
      },
      {
        title: 'Build the route handler',
        description: 'Typed route with Zod validation, auth middleware, and proper response types.',
        code: `// src/routes/posts.ts
import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { PostService } from '../services/PostService';
import { NotFoundError } from '../errors/AppError';

const router = Router();
const postService = new PostService();

const CreatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).max(10).default([]),
  excerpt: z.string().max(500).optional(),
});

// GET /posts
router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const posts = await postService.findAll({ page, limit, published: true });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// POST /posts — requires auth + validation
router.post(
  '/',
  requireAuth,
  validateBody(CreatePostSchema),
  async (req, res, next) => {
    try {
      const post = await postService.create({
        ...req.body,
        authorId: req.user!.id, // req.user exists because requireAuth runs first
      });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// GET /posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const post = await postService.findById(req.params.id);
    if (!post) throw new NotFoundError('Post', req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
});

export default router;`,
        hint: 'Always pass errors to next(error) — the error handler middleware catches them. Never use res.status(...).json(...) for errors in routes.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why do you pass errors to next(error) instead of handling them in the route?',
        answer: 'Centralized error handling through the error middleware means consistent error responses across all routes. The typed error hierarchy (AppError subclasses) lets the middleware determine the correct status code and response shape. This keeps routes focused on the happy path and avoids duplicating error formatting logic.',
        difficulty: 'intermediate',
      },
      {
        question: 'What does Object.setPrototypeOf(this, new.target.prototype) do in custom error classes?',
        answer: 'When TypeScript targets ES5 or ES2015 and extends a built-in class like Error, the prototype chain is broken — instanceof does not work correctly. Object.setPrototypeOf(this, new.target.prototype) manually restores the correct prototype after construction, making instanceof checks work as expected. This is a known issue with extending built-in classes before ES2022.',
        difficulty: 'advanced',
      },
    ],
    tags: ['typescript', 'nodejs', 'express', 'rest-api', 'zod'],
  },

  // ─── PROJECT 4 ────────────────────────────────────────────────────────────────
  {
    id: 'ts-react-dashboard',
    slug: 'ts-react-dashboard',
    title: 'Typed React Dashboard',
    description: 'Build a data dashboard with typed components, a custom useFetch hook, a generic DataTable, and typed context for global state.',
    difficulty: 'advanced',
    estimatedTime: '6 hours',
    techStack: ['TypeScript', 'React', 'Vite'],
    features: [
      'Generic DataTable<T> component',
      'Typed useFetch<T> custom hook',
      'Context API with typed global state',
      'Typed form components with React.ChangeEvent',
      'Generic useLocalStorage<T> hook',
      'Type-safe routing with typed route params',
    ],
    folderStructure: `react-dashboard/
├── src/
│   ├── types/
│   │   ├── domain.ts        # User, Product, Order interfaces
│   │   └── api.ts           # ApiResponse, PaginatedResponse types
│   ├── hooks/
│   │   ├── useFetch.ts      # Generic typed fetch hook
│   │   └── useLocalStorage.ts
│   ├── context/
│   │   └── AuthContext.tsx  # Typed auth context
│   ├── components/
│   │   ├── DataTable.tsx    # Generic table component
│   │   ├── UserCard.tsx
│   │   └── StatsCard.tsx
│   └── pages/
│       └── Dashboard.tsx
└── tsconfig.json`,
    steps: [
      {
        title: 'Build the generic useFetch hook',
        description: 'A typed hook that handles loading, error, and data states for any fetch.',
        code: `// src/hooks/useFetch.ts
import { useState, useEffect, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchOptions {
  enabled?: boolean;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
): FetchState<T> & { refetch: () => void } {
  const { enabled = true } = options;
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
      const data = await res.json() as T;
      setState({ data, loading: false, error: null });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Fetch failed',
      });
    }
  };

  useEffect(() => {
    if (enabled) fetchData();
    return () => { abortRef.current?.abort(); };
  }, [url, enabled]);

  return { ...state, refetch: fetchData };
}

// Usage:
// const { data, loading, error } = useFetch<User[]>('/api/users');
// TypeScript knows: data is User[] | null`,
        hint: 'AbortController cancels in-flight requests when the component unmounts or the URL changes — prevents stale state updates.',
      },
      {
        title: 'Build the generic DataTable component',
        description: 'A reusable typed table that works with any data type.',
        code: `// src/components/DataTable.tsx
import React from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data',
  onRowClick,
}: DataTableProps<T>) {
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length}>{emptyMessage}</td></tr>
          ) : (
            data.map(row => (
              <tr
                key={keyExtractor(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map(col => (
                  <td key={String(col.key)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Usage:
// interface User { id: string; name: string; email: string; role: string; }
// <DataTable<User>
//   data={users}
//   keyExtractor={u => u.id}
//   columns={[
//     { key: 'name', header: 'Name' },
//     { key: 'email', header: 'Email' },
//     { key: 'role', header: 'Role', render: r => <Badge>{r}</Badge> },
//   ]}
//   onRowClick={u => navigate(\`/users/\${u.id}\`)}
// />`,
        hint: 'keyof T ensures column keys are valid properties of T. TypeScript prevents using non-existent columns at compile time.',
      },
      {
        title: 'Set up typed Auth Context',
        description: 'Context with a null guard custom hook — clean, safe, typed.',
        code: `// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { user: AuthUser; token: string };
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}`,
        hint: 'createContext<T | null>(null) with a custom hook that throws on null is the standard pattern. It removes null from the type in consuming components.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why does DataTable use Column<T> with keyof T instead of just string for column keys?',
        answer: 'keyof T constrains the key to be a valid property name of T. This means TypeScript will error at compile time if you pass { key: "phone" } when User has no phone property. It also types the value in the render callback — render receives T[keyof T], not any, so TypeScript knows what type the value is.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['typescript', 'react', 'hooks', 'generics', 'context'],
  },

  // ─── PROJECT 5 ────────────────────────────────────────────────────────────────
  {
    id: 'ts-migration-project',
    slug: 'ts-migration-project',
    title: 'JavaScript to TypeScript Migration',
    description: 'Migrate a small but realistic JavaScript Express application to TypeScript — following the incremental migration strategy.',
    difficulty: 'intermediate',
    estimatedTime: '3 hours',
    techStack: ['TypeScript', 'Node.js', 'Express'],
    features: [
      'Incremental migration — JS and TS coexist',
      'Types-first: interfaces defined before code migration',
      'Zero any in the final result',
      'Strict mode enabled',
      'All public APIs typed',
      'Migration checklist pattern',
    ],
    folderStructure: `migration-project/
├── src/
│   ├── types/
│   │   └── index.ts        # Step 1: Create all types first
│   ├── utils/
│   │   ├── helpers.ts      # Step 2: Migrate utilities first
│   │   └── validation.ts
│   ├── services/
│   │   └── UserService.ts  # Step 3: Migrate services
│   └── routes/
│       └── users.ts        # Step 4: Migrate routes last
├── tsconfig.json
└── package.json`,
    steps: [
      {
        title: 'Step 1: Set up tsconfig for migration',
        description: 'Configure TypeScript to allow JavaScript alongside TypeScript during migration.',
        code: `// tsconfig.json — lenient settings for migration start
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "allowJs": true,
    "checkJs": false,
    "strict": false,
    "noImplicitAny": false,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}

// Later, after migration is complete, tighten:
// "strict": true,
// "noImplicitAny": true,
// "checkJs": true (if any .js files remain)`,
        hint: 'allowJs: true lets TypeScript and JavaScript coexist. checkJs: false skips type-checking .js files — enable it gradually.',
      },
      {
        title: 'Step 2: Create types first — before touching any code',
        description: 'Define all interfaces and types. This is the most valuable step.',
        code: `// src/types/index.ts
export type UserId = string;

export interface User {
  readonly id: UserId;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  readonly createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateUserInput = Pick<User, 'name' | 'email' | 'role'>;
export type UpdateUserInput = Partial<Pick<User, 'name' | 'email' | 'role'>>;
export type PublicUser = Omit<User, 'deletedAt'>;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}`,
        hint: 'Types-first migration: define all interfaces before touching any implementation. This makes each subsequent migration step clearer.',
      },
      {
        title: 'Step 3: Migrate utilities (lowest risk)',
        description: 'Migrate pure utility functions first — no dependencies, easiest to verify.',
        code: `// BEFORE: src/utils/helpers.js
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function slugify(text) {
  return text.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function paginate(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// AFTER: src/utils/helpers.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function paginate(
  total: number,
  page: number,
  limit: number
): { total: number; page: number; limit: number; totalPages: number } {
  return { total, page, limit, totalPages: Math.ceil(total / limit) };
}`,
        hint: 'Pure functions with no dependencies migrate fastest. Rename to .ts, add parameter and return types.',
      },
      {
        title: 'Step 4: Migrate services',
        description: 'Migrate the service layer using the types created in Step 2.',
        code: `// BEFORE: src/services/UserService.js
class UserService {
  constructor(db) {
    this.db = db;
  }

  async findById(id) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }

  async create(data) {
    return this.db.query('INSERT INTO users SET ?', [data]);
  }
}

// AFTER: src/services/UserService.ts
import type { User, UserId, CreateUserInput } from '../types';

interface Database {
  query<T>(sql: string, params?: unknown[]): Promise<T | null>;
}

export class UserService {
  constructor(private readonly db: Database) {}

  async findById(id: UserId): Promise<User | null> {
    return this.db.query<User>('SELECT * FROM users WHERE id = ?', [id]);
  }

  async create(data: CreateUserInput): Promise<User> {
    const result = await this.db.query<User>('INSERT INTO users SET ? RETURNING *', [data]);
    if (!result) throw new Error('Failed to create user');
    return result;
  }
}`,
        hint: 'Define the Database interface to avoid importing the actual DB library type in the service. This decouples the service from the implementation.',
      },
    ],
    interviewQuestions: [
      {
        question: 'What is your strategy for migrating a large JavaScript codebase to TypeScript?',
        answer: 'Incremental migration: (1) Set up allowJs: true so JS and TS coexist. (2) Start strict: false and noImplicitAny: false. (3) Create type definition files first — this is the highest-value step. (4) Migrate utilities first (least risk, no dependencies). (5) Then services and data access. (6) Routes/controllers last. (7) Use any as a stepping stone — annotate TODOs. (8) Enable strict options incrementally. (9) Track remaining any with //noImplicitAny comments.',
        difficulty: 'advanced',
      },
    ],
    tags: ['typescript', 'migration', 'express', 'nodejs'],
  },
];
