import type { Lesson } from '@/types';

export const apiIntegrationLesson: Lesson = {
  id: 'api-integration',
  slug: 'api-integration',
  title: 'API Integration',
  description:
    'Data fetching patterns in React — loading states, error states, race conditions, retry, the API layer architecture, and why TanStack Query solves problems raw useEffect cannot.',
  category: 'API',
  order: 16,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `Integrating APIs is one of the most common tasks in React development. This module covers patterns for doing it correctly — from basic fetching to production-grade data architecture.

---

## The Core Pattern

Every API call in React needs three pieces of state:

\`\`\`tsx
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
\`\`\`

And transitions between them:
\`\`\`
idle → loading → success (data populated)
                → error (error populated)
success → loading → success (refetch)
\`\`\`

---

## Basic Data Fetching

\`\`\`tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`Error \${res.status}: \${res.statusText}\`);
        return res.json() as Promise<User>;
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => {/* refetch */}} />;
  if (!user) return null;

  return <UserCard user={user} />;
}
\`\`\`

---

## The API Layer

Do not scatter \`fetch\` calls throughout your components. Create a centralized API layer:

\`\`\`ts
// src/api/users.ts
const BASE_URL = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message ?? response.statusText);
  }

  return response.json();
}

export const usersApi = {
  getById: (id: string) => request<User>(\`/users/\${id}\`),
  getAll: (params?: UserQueryParams) =>
    request<PaginatedResponse<User>>(\`/users?\${new URLSearchParams(params as any)}\`),
  create: (data: CreateUserInput) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<User>) =>
    request<User>(\`/users/\${id}\`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(\`/users/\${id}\`, { method: 'DELETE' }),
};

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
\`\`\`

Components use the API layer:

\`\`\`tsx
useEffect(() => {
  const ac = new AbortController();
  usersApi.getById(userId)
    .then(setUser)
    .catch(err => setError(err.message));
  return () => ac.abort();
}, [userId]);
\`\`\`

---

## Optimistic Updates

For better UX, update the UI immediately before the API call completes. Roll back on failure.

\`\`\`tsx
function LikeButton({ postId, initialLikes, isLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);

  async function handleLike() {
    // Optimistic update — change UI immediately
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await postsApi.toggleLike(postId, newLiked);
    } catch {
      // Rollback on failure
      setLiked(!newLiked);
      setLikes(prev => newLiked ? prev - 1 : prev + 1);
      toast.error('Failed to update like');
    }
  }

  return (
    <button onClick={handleLike} className={liked ? 'liked' : ''}>
      ❤️ {likes}
    </button>
  );
}
\`\`\`

---

## Retry Pattern

\`\`\`tsx
function useRetryableFetch<T>(url: string, maxRetries = 3) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
    retryCount: number;
  }>({ data: null, loading: true, error: null, retryCount: 0 });

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function attempt() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const data = await response.json() as T;
        if (!cancelled) setState({ data, loading: false, error: null, retryCount: attempts });
      } catch (err) {
        if (cancelled) return;
        attempts++;
        if (attempts < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempts - 1)));
          attempt();
        } else {
          setState({ data: null, loading: false, error: (err as Error).message, retryCount: attempts });
        }
      }
    }

    attempt();
    return () => { cancelled = true; };
  }, [url]);

  const retry = () => setState(prev => ({ ...prev, loading: true, error: null }));

  return { ...state, retry };
}
\`\`\`

---

## Pagination

\`\`\`tsx
function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    postsApi.getAll({ page, limit: 10 })
      .then(({ data, meta }) => {
        setPosts(data);
        setTotalPages(meta.totalPages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  return (
    <div>
      {loading ? <Spinner /> : posts.map(p => <PostCard key={p.id} post={p} />)}
      <Pagination
        current={page}
        total={totalPages}
        onChange={setPage}
      />
    </div>
  );
}
\`\`\`

### Infinite Scroll / Load More

\`\`\`tsx
function InfinitePostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    const { data, meta } = await postsApi.getAll({ page, limit: 10 });
    setPosts(prev => [...prev, ...data]); // Append — not replace
    setHasMore(page < meta.totalPages);
    setPage(p => p + 1);
    setLoading(false);
  }

  useEffect(() => { loadMore(); }, []); // Load first page on mount

  return (
    <div>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
\`\`\`

---

## Why TanStack Query (React Query)

Managing API state manually — loading, error, caching, refetching, pagination — becomes complex quickly. TanStack Query solves all of this:

\`\`\`tsx
// With TanStack Query — the raw useEffect code above becomes:
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getById(userId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <UserCard user={user} />;
}

// What TanStack Query adds for free:
// ✅ Automatic caching — same query key → same cache entry
// ✅ Background refetching — stale data refreshed when window regains focus
// ✅ Deduplication — multiple components requesting same query = one network call
// ✅ Retry on failure — automatic retry with backoff
// ✅ Loading/error/stale states — built in
// ✅ Optimistic updates — with built-in rollback
// ✅ Pagination helpers
// ✅ Infinite scroll helpers
\`\`\`

TanStack Query is covered in depth in the State Management module. For complex data fetching in production apps, it is the standard choice.

---

## Mutation Pattern

For POST/PATCH/DELETE operations:

\`\`\`tsx
function CreatePostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const newPost = await postsApi.create({ title });
      // On success: navigate, show toast, update parent state
      router.push(\`/posts/\${newPost.id}\`);
      toast.success('Post created!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      {error && <span role="alert">{error}</span>}
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
\`\`\``,

  codeExamples: [
    {
      title: 'useFetch custom hook — production ready',
      code: `interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`\${res.status} \${res.statusText}\`);
        return res.json() as Promise<T>;
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [url, fetchTrigger]);

  const refetch = useCallback(() => {
    setFetchTrigger(n => n + 1);
  }, []);

  return { data, loading, error, refetch };
}

// Usage
function Posts() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useFetch<Post[]>(\`/api/posts?page=\${page}\`);

  if (loading) return <Spinner />;
  if (error) return <button onClick={refetch}>Retry: {error}</button>;

  return (/* render posts */);
}`,
      explanation:
        'The fetchTrigger allows manual refetching by incrementing a counter in the dependency array. Passing null as the URL skips fetching entirely — useful for conditional fetching.',
    },
  ],

  commonMistakes: [
    'Not handling the AbortController / cancellation — causes memory leaks and state updates after unmount.',
    'Not resetting loading/error state when parameters change — shows stale error from previous fetch.',
    'Scattering fetch() calls throughout components — use a centralized API layer instead.',
    'Not checking response.ok before parsing JSON — a 404 or 500 response is still a "successful" fetch.',
    'Ignoring error handling — a network error with no feedback is a terrible user experience.',
  ],

  interviewQuestions: [
    {
      question: 'How do you handle loading and error states when fetching data in React?',
      answer:
        'Create three state variables: data (null initially), loading (true initially), error (null initially). In useEffect, set loading true before the fetch, then on success set data and loading false, on error set error message and loading false. Always use AbortController to cancel the fetch on cleanup (useEffect return). Render different UI based on the state: a spinner for loading, an error message (with retry button) for errors, and the actual data on success.',
      difficulty: 'beginner',
    },
    {
      question: 'What is an optimistic update and when should you use it?',
      answer:
        'An optimistic update immediately reflects an action in the UI before the server confirms it, then rolls back if the server returns an error. Use it for actions that are highly likely to succeed (likes, follows, toggles) where waiting for server confirmation causes noticeable lag. Implementation: update state immediately, make the API call, catch errors and revert state on failure. TanStack Query has built-in optimistic update support.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'api-ex-1',
      title: 'Build a Complete Data Fetching Component',
      description: 'Build a UserList component that fetches from /api/users, shows a loading spinner, handles errors with retry, and supports search filtering.',
      starterCode: `interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function UserList() {
  // TODO: fetch /api/users
  // TODO: show loading spinner
  // TODO: show error with retry button
  // TODO: search/filter by name
  // TODO: show count of visible users

  return <div>TODO</div>;
}`,
      solution: `function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch('/api/users', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`Failed to load users (HTTP \${res.status})\`);
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [refetchKey]);

  const filtered = useMemo(
    () => users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  if (loading) return <div>Loading users...</div>;
  if (error) return (
    <div>
      <p>Error: {error}</p>
      <button onClick={() => setRefetchKey(k => k + 1)}>Retry</button>
    </div>
  );

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search users..."
      />
      <p>Showing {filtered.length} of {users.length} users</p>
      <ul>
        {filtered.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      hints: [
        'Use a refetchKey in the useEffect deps to enable manual retry',
        'AbortController prevents state updates after unmount',
        'Search filtering is derived state — use useMemo',
        'Check response.ok before calling .json()',
      ],
    },
  ],

  keyTakeaways: [
    'Every API call needs three state variables: data, loading, and error.',
    'Always use AbortController to cancel fetches on cleanup — prevents race conditions and memory leaks.',
    'Create a centralized API layer — do not scatter fetch() calls throughout components.',
    'Check response.ok before parsing JSON — HTTP errors are still "successful" fetch calls.',
    'Optimistic updates improve perceived performance for high-success-rate mutations.',
    'For production apps with complex data needs, use TanStack Query — it solves caching, refetching, deduplication, and more.',
  ],

  nextLesson: 'context-api',
  prevLesson: 'forms',
};
