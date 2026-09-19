import type { Lesson } from '@/types';

export const frontendArchitectureLesson: Lesson = {
  id: 'frontend-architecture',
  slug: 'frontend-architecture',
  title: 'Frontend Architecture',
  description:
    'Component architecture, folder structure, state architecture, API layer design, shared component strategy, and feature-based organization for scalable React applications.',
  category: 'Architecture',
  order: 6,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `You already know React. You know hooks, state, and API calls. What you are learning here is how to organize a React application at scale — so it does not become a maintenance nightmare as it grows.

This module references the React Track. You should already understand components, hooks, context, and data fetching. Here we focus on how to structure them into a production codebase.

---

## Why Architecture Matters

A small project (5 components, 2 pages) needs no architecture. Just make it work.

A large project (50+ components, 20 pages, 10 developers) without architecture becomes:
- Files that are impossible to find
- State that nobody understands who owns
- API calls duplicated in 5 places
- Components so tangled nobody wants to touch them
- Changes in one place breaking something unrelated

Architecture is the decisions you make before you need them, that prevent the chaos you would otherwise have.

---

## Component Architecture

Components exist on a spectrum from generic to specific.

\`\`\`
MOST GENERIC (UI Primitives):
  Button, Input, Badge, Card, Modal, Table
  These know nothing about your domain.
  They are just visual building blocks.

DOMAIN COMPONENTS:
  UserCard, PostItem, OrderSummary, ProductImage
  These know about your data shapes.
  They receive a specific entity and render it.

FEATURE COMPONENTS:
  LoginForm, CreatePostForm, CheckoutFlow
  These handle a complete user interaction.
  They contain business logic.

PAGE COMPONENTS:
  DashboardPage, ProductDetailPage, SettingsPage
  These assemble features into complete screens.
  They handle routing and data fetching.
\`\`\`

**The rule:** Generic components know nothing about pages. Feature components know nothing about other features. Pages orchestrate everything.

---

## Folder Structure

A feature-based folder structure scales better than type-based.

**Type-based (does NOT scale):**
\`\`\`
src/
  components/
    Button.tsx
    UserCard.tsx
    PostItem.tsx
    LoginForm.tsx
    CheckoutFlow.tsx     ← all components in one folder
  hooks/
    useAuth.ts
    usePosts.ts
    useCart.ts           ← all hooks in one folder
  utils/
    formatDate.ts
    formatPrice.ts
\`\`\`

Problem: When you work on checkout, your files are spread across \`components/\`, \`hooks/\`, \`utils/\`. You are constantly switching folders.

**Feature-based (scales well):**
\`\`\`
src/
  components/            ← shared, reusable UI only
    ui/
      Button.tsx
      Input.tsx
      Modal.tsx
      Badge.tsx
    layout/
      Header.tsx
      Sidebar.tsx
      Footer.tsx

  features/              ← domain features, self-contained
    auth/
      components/
        LoginForm.tsx
        SignupForm.tsx
      hooks/
        useAuth.ts
      api/
        auth.api.ts
      types/
        auth.types.ts
      index.ts            ← public API of this feature

    posts/
      components/
        PostCard.tsx
        PostEditor.tsx
        PostList.tsx
      hooks/
        usePosts.ts
        usePost.ts
      api/
        posts.api.ts
      types/
        post.types.ts

    checkout/
      components/
        CartItem.tsx
        OrderSummary.tsx
        PaymentForm.tsx
      hooks/
        useCart.ts
        useCheckout.ts
      api/
        checkout.api.ts

  pages/                 ← page-level components
    home/
      page.tsx
    dashboard/
      page.tsx
    products/
      [id]/
        page.tsx

  lib/                   ← utilities, configs, clients
    api-client.ts
    utils.ts
    constants.ts
\`\`\`

**The index.ts export rule:**
Each feature exposes only what other features need through its \`index.ts\`:

\`\`\`typescript
// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export type { User, AuthState } from './types/auth.types';
// Does NOT export internal implementation details
\`\`\`

This makes refactoring safe: you can change the internals of a feature without breaking other features, as long as the public API stays the same.

---

## State Architecture

State is the biggest source of complexity in React applications. The key is knowing where state lives.

**State ownership hierarchy:**

\`\`\`
LOCAL STATE (useState)
  ↓ When: state belongs to one component, no one else cares
  Example: modal open/closed, form field values, dropdown open/closed

SHARED COMPONENT STATE (lifted up)
  ↓ When: two sibling components need the same state
  Example: selected tab shared between TabList and TabContent

FEATURE STATE (context or state library)
  ↓ When: multiple components in a feature need the same state
  Example: cart items shared across CartIcon, CartDrawer, CheckoutSummary

GLOBAL STATE (context, Zustand, Redux)
  ↓ When: state is needed across unrelated features
  Example: authenticated user, theme, notifications

SERVER STATE (TanStack Query / SWR)
  ↓ When: state comes from an API
  Example: posts, users, products — any database data
\`\`\`

**The most important rule:** Server state is not the same as client state.

Do not put API responses in useState and manage them manually. Use TanStack Query:

\`\`\`typescript
// WITHOUT TanStack Query (manual, error-prone):
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/posts')
    .then(r => r.json())
    .then(data => { setPosts(data); setLoading(false); })
    .catch(err => { setError(err); setLoading(false); });
}, []);

// You still need to handle: caching, refetching, deduplication,
// background refresh, stale data, optimistic updates...

// WITH TanStack Query (handles all of that):
const { data: posts, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: () => fetch('/api/posts').then(r => r.json()),
  staleTime: 5 * 60 * 1000, // treat data as fresh for 5 minutes
});
\`\`\`

---

## API Layer

Never call \`fetch\` directly in components. Create an API layer.

\`\`\`typescript
// lib/api-client.ts — shared HTTP client
const apiClient = {
  async get<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token');
    const res = await fetch(\`/api\${url}\`, {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return res.json();
  },

  async post<T>(url: string, body: unknown): Promise<T> {
    const token = localStorage.getItem('token');
    const res = await fetch(\`/api\${url}\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return res.json();
  },
};

// features/posts/api/posts.api.ts — domain-specific API functions
export const postsApi = {
  getAll: (page = 1) =>
    apiClient.get<PostsResponse>(\`/posts?page=\${page}\`),

  getById: (id: string) =>
    apiClient.get<Post>(\`/posts/\${id}\`),

  create: (data: CreatePostInput) =>
    apiClient.post<Post>('/posts', data),
};

// features/posts/hooks/usePosts.ts — hooks that use the API layer
export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => postsApi.getAll(page),
  });
}
\`\`\`

**Benefits of this structure:**
- Auth token is added once in the client, not in every fetch call
- Error handling is centralized
- When the API URL changes, you change one file
- Testing is easier — mock \`postsApi\`, not \`fetch\`

---

## Shared Components

Shared components (your design system) must be:

1. **Generic** — they know nothing about your domain
2. **Composable** — they accept children and render props
3. **Accessible** — proper HTML semantics and ARIA
4. **Variant-aware** — different visual states via props

\`\`\`typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={\`
        inline-flex items-center justify-center rounded-md font-medium
        transition-colors focus-visible:outline-none focus-visible:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        \${variants[variant]} \${sizes[size]} \${props.className ?? ''}
      \`}
    >
      {loading ? <Spinner className="mr-2" /> : null}
      {children}
    </button>
  );
}
\`\`\`

---

## Feature-Based Architecture in Practice

A new developer joins your team and needs to add a "Save Post" feature.

**Without feature-based architecture:**
- They search through 50 files in \`components/\`
- They find \`PostCard.tsx\` but post-related API calls are scattered
- They add the save button somewhere, breaking 3 things

**With feature-based architecture:**
\`\`\`
features/posts/
  components/PostCard.tsx    ← add save button here
  hooks/usePosts.ts          ← add useSavePost hook here
  api/posts.api.ts           ← add savePost() function here
  types/post.types.ts        ← add SavedPost type here
\`\`\`

Everything related to posts is in one place. The new developer knows exactly where to work.`,
  codeExamples: [
    {
      title: 'Complete Feature Module Structure',
      code: `// features/posts/api/posts.api.ts
import { apiClient } from '@/lib/api-client';
import type { Post, CreatePostInput, PostsResponse } from '../types/post.types';

export const postsApi = {
  getAll: (page = 1) =>
    apiClient.get<PostsResponse>(\`/posts?page=\${page}\`),
  getById: (id: string) =>
    apiClient.get<Post>(\`/posts/\${id}\`),
  create: (data: CreatePostInput) =>
    apiClient.post<Post>('/posts', data),
  update: (id: string, data: Partial<CreatePostInput>) =>
    apiClient.patch<Post>(\`/posts/\${id}\`, data),
  delete: (id: string) =>
    apiClient.delete(\`/posts/\${id}\`),
};

// features/posts/hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => postsApi.getAll(page),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      // Invalidate and refetch the posts list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// features/posts/components/PostList.tsx
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';

export function PostList({ page }: { page: number }) {
  const { data, isLoading, error } = usePosts(page);

  if (isLoading) return <PostListSkeleton />;
  if (error) return <ErrorMessage message="Failed to load posts" />;

  return (
    <div className="space-y-4">
      {data?.posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// features/posts/index.ts — public API of this feature
export { PostList } from './components/PostList';
export { PostCard } from './components/PostCard';
export { useCreatePost } from './hooks/usePosts';
export type { Post } from './types/post.types';`,
      explanation:
        'A feature module is self-contained: its own API functions, custom hooks, and components. The index.ts exports only what other parts of the app need. Changes inside the feature do not break imports elsewhere.',
    },
  ],
  commonMistakes: [
    'Putting all components in one folder — impossible to navigate when it grows to 50+ files',
    'Calling fetch() directly in components — duplicated auth logic, error handling, and URL construction',
    'Using global state for everything (Redux for every piece of state) — makes tracing data flow painful',
    'Not separating server state from client state — manually managing loading/error/data is reinventing TanStack Query',
    'Deeply nesting component imports (../../../../components) — a sign of poor folder organization',
    'Breaking feature encapsulation by importing internal files from another feature directly',
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between type-based and feature-based folder structure?',
      answer:
        'Type-based groups files by what they are (all components together, all hooks together). Feature-based groups files by what they do (all post-related code together). Feature-based scales better because when you work on a feature, your files are in one place. Type-based folders become hard to navigate as the app grows because one feature\'s files are spread across multiple folders.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between server state and client state?',
      answer:
        'Client state is UI-specific: is a modal open, what tab is selected, what is in the form. Server state is data that lives on the server: posts, users, orders. Server state has unique challenges (caching, stale data, refetching, background sync) that useState cannot handle well. TanStack Query or SWR are designed for server state. Using useState for API data means manually solving these problems.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why should you create an API layer instead of calling fetch directly in components?',
      answer:
        'An API layer centralizes auth headers, base URL, and error handling — you write it once instead of in every fetch call. When you need to add auth, change the base URL, or add request logging, you change one file. It also makes testing easier: mock the API module, not the fetch API. Components stay clean — they call getUser() not fetch("https://api.example.com/v1/users/me", { headers: {...} }).',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'design-a-feature-folder',
      title: 'Design a Feature Folder Structure',
      description:
        'You are building an e-commerce app. Design the feature folder structure for the "products" feature. Include the files for: API calls, TypeScript types, custom hooks, components (ProductCard, ProductGrid, ProductDetail), and the public index.ts exports.',
      starterCode: `// Design the folder structure:
// src/features/products/
//   ...

// Then write the public API (index.ts) — what should other
// features be able to import from the products feature?

// features/products/index.ts
// export { ... } from './components/...';
// export { ... } from './hooks/...';
// export type { ... } from './types/...';`,
      solution: `// Folder structure:
// src/features/products/
//   api/
//     products.api.ts    — API calls: getProducts, getProduct, searchProducts
//   components/
//     ProductCard.tsx    — single product display (image, name, price, rating)
//     ProductGrid.tsx    — responsive grid of ProductCard
//     ProductDetail.tsx  — full product page content
//     ProductSearch.tsx  — search input with results
//   hooks/
//     useProducts.ts     — useProducts(filters), useProduct(id), useSearchProducts
//   types/
//     product.types.ts   — Product, ProductVariant, ProductFilters types
//   index.ts

// features/products/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

// features/products/api/products.api.ts
export const productsApi = {
  getAll: (filters: ProductFilters) =>
    apiClient.get<Product[]>('/products?' + new URLSearchParams(filters as any)),
  getById: (id: string) =>
    apiClient.get<Product>('/products/' + id),
  search: (query: string) =>
    apiClient.get<Product[]>('/products/search?q=' + query),
};

// features/products/index.ts — public API
export { ProductCard } from './components/ProductCard';
export { ProductGrid } from './components/ProductGrid';
export { ProductDetail } from './components/ProductDetail';
export { useProducts, useProduct } from './hooks/useProducts';
export type { Product, ProductFilters } from './types/product.types';

// NOTE: ProductSearch is only used inside the products feature — not exported
// ProductCard's internal subcomponents (rating stars, image gallery) — not exported`,
      hints: [
        'Ask: what does the rest of the app need from the products feature? That is your index.ts exports',
        'Internal implementation details (subcomponents, utility functions) should NOT be exported',
        'The types that other features need (Product type for cart, wishlist) must be exported',
      ],
    },
  ],
  keyTakeaways: [
    'Feature-based folder structure groups code by domain (posts/, auth/, checkout/) not by type',
    'Each feature has its own api/, components/, hooks/, types/ — everything in one place',
    'Features expose a public API through index.ts and keep internals private',
    'Server state (API data) belongs in TanStack Query — not useState with manual loading/error tracking',
    'Create an API layer to centralize auth headers, base URL, and error handling',
    'Shared UI components are generic (know nothing about domain); domain components know your data shapes',
  ],
  nextLesson: 'backend-architecture',
  prevLesson: 'ui-ux-for-developers',
};
