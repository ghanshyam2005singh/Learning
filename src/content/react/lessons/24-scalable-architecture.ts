import type { Lesson } from '@/types';

export const scalableArchitectureLesson: Lesson = {
  id: 'scalable-architecture',
  slug: 'scalable-architecture',
  title: 'Scalable Frontend Architecture',
  description:
    'Structure large React applications for maintainability and scale — feature-based architecture, component organization, shared layer, services, API layer, and enterprise patterns.',
  category: 'Architecture',
  order: 24,
  difficulty: 'advanced',
  estimatedTime: 35,
  content: `As React applications grow from hundreds to thousands of files, structure becomes critical. Poor architecture creates a codebase nobody wants to touch. Good architecture makes large teams productive.

---

## The Core Principle: Feature-Based Architecture

Do not organize by file type. Organize by feature.

\`\`\`
❌ Type-based (does not scale):
src/
├── components/          ← 200+ files
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── PostCard.tsx
│   ├── UserAvatar.tsx
│   └── ...
├── hooks/               ← 50+ files
├── utils/               ← 100+ files
└── pages/               ← 30+ files

✅ Feature-based (scales well):
src/
├── features/
│   ├── auth/            ← All auth code together
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   └── store.ts
│   ├── posts/           ← All posts code together
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api.ts
│   └── users/
├── shared/              ← Truly reusable code
│   ├── components/
│   ├── hooks/
│   └── utils/
└── app/                 ← App-level code
    ├── routes.tsx
    ├── store.ts
    └── providers.tsx
\`\`\`

---

## Complete Folder Structure

\`\`\`
src/
├── app/
│   ├── App.tsx              # Root component
│   ├── routes.tsx           # All route definitions
│   ├── providers.tsx        # All providers (QueryClient, Auth, Theme)
│   └── store.ts             # Global Zustand store
│
├── features/                # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── PasswordResetForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePermissions.ts
│   │   ├── api.ts           # Auth API calls
│   │   ├── store.ts         # Auth Zustand slice
│   │   ├── types.ts         # Auth types
│   │   └── index.ts         # Public API of the feature
│   │
│   ├── posts/
│   │   ├── components/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostEditor.tsx
│   │   │   └── PostDetail.tsx
│   │   ├── hooks/
│   │   │   ├── usePosts.ts
│   │   │   └── usePostEditor.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       └── index.ts
│
├── shared/                  # Reusable across features
│   ├── components/
│   │   ├── ui/              # Design system components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Table/
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── PageLayout.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useWindowSize.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── date.ts
│   └── types/
│       └── index.ts
│
├── pages/                   # Route-level page components
│   ├── HomePage.tsx
│   ├── PostsPage.tsx
│   └── SettingsPage.tsx
│
└── lib/                     # Third-party library configuration
    ├── axios.ts             # Configured axios instance
    ├── queryClient.ts       # TanStack Query configuration
    └── sentry.ts            # Error monitoring setup
\`\`\`

---

## Feature Index Files (The Public API)

Each feature should have an \`index.ts\` that exports only what other features need:

\`\`\`ts
// features/auth/index.ts
// The public API of the auth feature
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export { AuthProvider } from './components/AuthProvider';
export type { User, AuthState } from './types';

// Everything NOT exported is internal to the feature
// Other features import from 'features/auth', not 'features/auth/hooks/useAuth'
\`\`\`

**Why:** Creates a clear boundary. Refactoring internals does not break other features as long as the public API is stable.

---

## The API Layer

Centralize all API calls. Never call fetch() directly in components:

\`\`\`ts
// lib/axios.ts — configured instance
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor: add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// Response interceptor: handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired — logout user
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// features/posts/api.ts
export const postsApi = {
  getAll: (params?: PostQueryParams) =>
    api.get<PaginatedResponse<Post>>('/posts', { params }).then(r => r.data),

  getById: (id: string) =>
    api.get<Post>(\`/posts/\${id}\`).then(r => r.data),

  create: (data: CreatePostInput) =>
    api.post<Post>('/posts', data).then(r => r.data),

  update: (id: string, data: Partial<Post>) =>
    api.patch<Post>(\`/posts/\${id}\`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(\`/posts/\${id}\`),
};
\`\`\`

---

## The Services Layer

Some business logic does not belong in components or API functions — it belongs in services:

\`\`\`ts
// features/posts/services/postService.ts
export const postService = {
  // Business logic: format post for display
  formatForCard(post: Post): PostCardData {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.content.slice(0, 150) + '...',
      readingTime: Math.ceil(post.content.split(' ').length / 200),
      authorName: \`\${post.author.firstName} \${post.author.lastName}\`,
      formattedDate: formatRelativeDate(post.publishedAt),
    };
  },

  // Business logic: validate before submit
  validate(post: Partial<Post>): ValidationResult {
    const errors: string[] = [];
    if (!post.title?.trim()) errors.push('Title is required');
    if (post.title && post.title.length > 200) errors.push('Title too long');
    if (!post.content?.trim()) errors.push('Content is required');
    return { valid: errors.length === 0, errors };
  },
};
\`\`\`

---

## Component Organization Within a Feature

For complex components, use the folder pattern:

\`\`\`
PostEditor/
├── PostEditor.tsx           # Main component
├── PostEditor.test.tsx      # Tests
├── PostEditor.module.css    # Styles
├── components/              # Internal sub-components
│   ├── EditorToolbar.tsx
│   ├── EditorContent.tsx
│   └── PublishButton.tsx
└── hooks/
    └── usePostEditor.ts     # Editor-specific state logic
\`\`\`

The internal components and hooks are not exported from the feature's index.ts. They are implementation details of PostEditor.

---

## Dependency Rules

Enforce these rules to prevent circular dependencies and spaghetti code:

\`\`\`
features/ → shared/        ✅ Features can use shared code
features/ → lib/           ✅ Features can use library config
features/auth/ → features/posts/ ❌ Features should NOT depend on each other
shared/ → features/        ❌ Shared code should NOT import from features
pages/ → features/         ✅ Pages compose features
\`\`\`

Use ESLint's \`import/no-restricted-paths\` rule to enforce these boundaries.

---

## Environment Configuration

\`\`\`ts
// lib/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN as string,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
\`\`\`

Never access \`import.meta.env\` or \`process.env\` directly in components. Use the config object. This makes mocking in tests easy.`,

  codeExamples: [
    {
      title: 'Feature module structure — complete example',
      code: `// features/posts/types.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  author: { id: string; name: string; avatar: string };
  tags: string[];
  publishedAt: string;
  status: 'draft' | 'published';
}

export interface PostFilters {
  search?: string;
  tag?: string;
  status?: Post['status'];
  page?: number;
}

// features/posts/api.ts
export const postsApi = {
  getAll: (filters?: PostFilters) =>
    api.get<{ data: Post[]; total: number }>('/posts', { params: filters })
       .then(r => r.data),
  getById: (id: string) => api.get<Post>(\`/posts/\${id}\`).then(r => r.data),
  create: (data: Pick<Post, 'title' | 'content' | 'tags'>) =>
    api.post<Post>('/posts', data).then(r => r.data),
  update: (id: string, data: Partial<Post>) =>
    api.patch<Post>(\`/posts/\${id}\`, data).then(r => r.data),
  delete: (id: string) => api.delete(\`/posts/\${id}\`),
};

// features/posts/hooks/usePosts.ts
export function usePosts(filters?: PostFilters) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postsApi.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postsApi.getById(id),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });
}

// features/posts/index.ts — public API
export { PostCard } from './components/PostCard';
export { PostList } from './components/PostList';
export { PostEditor } from './components/PostEditor';
export { usePosts, usePost, useCreatePost } from './hooks/usePosts';
export type { Post, PostFilters } from './types';

// pages/PostsPage.tsx — composes the feature
import { PostList } from 'features/posts';

export function PostsPage() {
  return (
    <PageLayout title="Posts">
      <PostList />
    </PageLayout>
  );
}`,
      explanation:
        'The feature is self-contained: types, API, hooks, and components are all internal. The index.ts exports only what pages and other consumers need. Pages are thin composers — they assemble features into layouts.',
    },
  ],

  commonMistakes: [
    'Type-based organization — a "components" folder with 200 files is unnavigable.',
    'No index.ts boundary — other features reach into internals, creating tight coupling.',
    'Scattered API calls — fetch() in every component creates duplication and no central error handling.',
    'Everything in shared/ — truly shared code should be rare. Most code belongs in a feature.',
    'No dependency rules — features importing each other creates circular dependencies and coupling.',
  ],

  interviewQuestions: [
    {
      question: 'How do you structure a large React application?',
      answer:
        'Use feature-based organization: group all code for a domain (auth, posts, users) into feature folders with their own components, hooks, API functions, and types. Have a shared/ folder for truly reusable code. Use index.ts files to define each feature\'s public API. Have an app/ folder for root-level configuration (routes, providers, stores). Keep pages thin — they compose features. This structure scales because: related code is colocated, teams own features, and import boundaries prevent coupling.',
      difficulty: 'advanced',
    },
    {
      question: 'What is an API layer in a React application and why is it important?',
      answer:
        'An API layer is a centralized module (or set of modules) that contains all network requests. Instead of calling fetch() directly in components, components call typed functions like postsApi.getById(id). Benefits: (1) Single place to handle auth tokens, error handling, retry logic; (2) TypeScript types for responses; (3) Easy to mock in tests; (4) If the backend changes, you update one file not every component; (5) Works cleanly with TanStack Query\'s queryFn.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'arch-ex-1',
      title: 'Organize a Messy Codebase',
      description: 'Given this flat file structure, reorganize it into a feature-based structure. Write the new folder structure as a comment.',
      starterCode: `// Current messy flat structure:
// components/
//   Button.tsx
//   Modal.tsx
//   PostCard.tsx
//   PostEditor.tsx
//   UserAvatar.tsx
//   LoginForm.tsx
//   DashboardChart.tsx
//   Sidebar.tsx
// hooks/
//   useAuth.ts
//   useFetch.ts
//   usePosts.ts
//   useUserProfile.ts
// api.ts (contains all API calls)
// store.ts (contains all state)
//
// Redesign this into a feature-based structure.
// Write your answer as a folder tree in comments.`,
      solution: `// Feature-based reorganization:
//
// src/
// ├── app/
// │   ├── App.tsx
// │   ├── routes.tsx
// │   └── providers.tsx
// │
// ├── features/
// │   ├── auth/
// │   │   ├── components/
// │   │   │   └── LoginForm.tsx
// │   │   ├── hooks/
// │   │   │   └── useAuth.ts
// │   │   ├── api.ts           (auth endpoints only)
// │   │   ├── store.ts         (auth state only)
// │   │   └── index.ts
// │   │
// │   ├── posts/
// │   │   ├── components/
// │   │   │   ├── PostCard.tsx
// │   │   │   └── PostEditor.tsx
// │   │   ├── hooks/
// │   │   │   └── usePosts.ts
// │   │   ├── api.ts           (posts endpoints only)
// │   │   └── index.ts
// │   │
// │   └── dashboard/
// │       ├── components/
// │       │   └── DashboardChart.tsx
// │       └── index.ts
// │
// ├── shared/
// │   ├── components/
// │   │   ├── ui/
// │   │   │   ├── Button.tsx
// │   │   │   └── Modal.tsx
// │   │   └── layout/
// │   │       ├── Sidebar.tsx
// │   │       └── UserAvatar.tsx
// │   └── hooks/
// │       ├── useFetch.ts      (generic fetch hook)
// │       └── useUserProfile.ts (if used in multiple features)
// │
// └── lib/
//     ├── axios.ts             (configured API client)
//     └── queryClient.ts`,
      hints: [
        'Group by domain (auth, posts, dashboard) not by file type',
        'Button and Modal are shared — used everywhere',
        'API calls specific to a feature go in that feature\'s api.ts',
        'Generic hooks (useFetch) go in shared/hooks/',
      ],
    },
  ],

  keyTakeaways: [
    'Organize by feature (domain) not by type (components, hooks, utils) — features scale; types do not.',
    'Each feature has an index.ts public API — internals are hidden, contracts are stable.',
    'Centralize API calls in an API layer with typed functions — not scattered fetch() calls.',
    'Shared code is code used by 3+ features — move things to shared/ only when proven reusable.',
    'Pages are thin composers — they assemble features, not implement them.',
    'Enforce dependency rules: features depend on shared, not on each other.',
  ],

  nextLesson: 'react-typescript',
  prevLesson: 'testing',
};
