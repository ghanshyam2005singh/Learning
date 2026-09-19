import type { Lesson } from '@/types';

export const reactRouterLesson: Lesson = {
  id: 'react-router',
  slug: 'react-router',
  title: 'React Router',
  description:
    'Master client-side routing with React Router v6 — routes, nested routes, dynamic routes, protected routes, navigation, search params, and real-world routing architecture.',
  category: 'Routing',
  order: 22,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `React Router is the standard routing solution for React SPAs. Version 6 (v6) introduced a cleaner API with nested routes and relative navigation.

---

## Setup

\`\`\`bash
npm install react-router-dom
\`\`\`

\`\`\`tsx
// main.tsx — wrap the app in BrowserRouter
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
\`\`\`

---

## Basic Routing

\`\`\`tsx
import { Routes, Route, Link, NavLink } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav>
        {/* NavLink adds "active" class when the route matches */}
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* 404 */}
      </Routes>
    </div>
  );
}
\`\`\`

---

## Dynamic Routes

Routes with parameters:

\`\`\`tsx
import { useParams } from 'react-router-dom';

<Routes>
  <Route path="/posts/:postId" element={<PostPage />} />
  <Route path="/users/:userId/posts/:postId" element={<UserPostPage />} />
</Routes>

function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { data: post } = useQuery(['post', postId], () => fetchPost(postId!));

  return <article>{post?.title}</article>;
}
\`\`\`

---

## Nested Routes

Nested routes render inside the parent's \`<Outlet />\`:

\`\`\`tsx
function App() {
  return (
    <Routes>
      {/* Layout route — renders shared UI (header, sidebar) */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />    {/* "/" */}
        <Route path="posts" element={<PostList />} />   {/* "/posts" */}
        <Route path="posts/:id" element={<PostDetail />} />  {/* "/posts/123" */}
        <Route path="settings" element={<SettingsLayout />}>
          <Route index element={<GeneralSettings />} />  {/* "/settings" */}
          <Route path="profile" element={<ProfileSettings />} />  {/* "/settings/profile" */}
          <Route path="security" element={<SecuritySettings />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// AppLayout renders children via Outlet
function AppLayout() {
  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
\`\`\`

---

## Protected Routes

Redirect unauthenticated users to login:

\`\`\`tsx
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  if (!user) {
    // Save where they were going so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function RequireRole({ role, children }: { role: string; children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== role) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

// Usage in routes
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/"
    element={
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    }
  >
    <Route index element={<Dashboard />} />
    <Route
      path="admin"
      element={
        <RequireRole role="admin">
          <AdminPanel />
        </RequireRole>
      }
    />
  </Route>
</Routes>

// After login, redirect back to original destination
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/';

  async function handleLogin(credentials) {
    await login(credentials);
    navigate(from, { replace: true }); // Go back to where they were
  }
}
\`\`\`

---

## Programmatic Navigation

\`\`\`tsx
import { useNavigate } from 'react-router-dom';

function CreatePostForm() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    const post = await postsApi.create(data);
    navigate(\`/posts/\${post.id}\`);          // Navigate to new post
    navigate(-1);                             // Go back
    navigate('/dashboard', { replace: true }); // Replace history entry
  }
}
\`\`\`

---

## Search Parameters (URL State)

Search params are perfect for filters, search queries, and tab state — they are shareable via URL:

\`\`\`tsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const page = Number(searchParams.get('page') ?? '1');

  function handleSearch(query: string) {
    setSearchParams(prev => {
      prev.set('q', query);
      prev.set('page', '1'); // Reset to page 1 on new search
      return prev;
    });
  }

  function handleCategoryChange(cat: string) {
    setSearchParams(prev => {
      if (cat === 'all') prev.delete('category');
      else prev.set('category', cat);
      return prev;
    });
  }

  return (
    <div>
      <input value={search} onChange={e => handleSearch(e.target.value)} />
      {/* URL becomes: /products?q=shoes&category=footwear&page=1 */}
      {/* Shareable, bookmarkable, back-button works correctly */}
    </div>
  );
}
\`\`\`

---

## Loader Pattern (React Router v6.4+)

React Router v6.4+ introduced data APIs (loaders and actions):

\`\`\`tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'posts/:id',
        element: <PostPage />,
        loader: async ({ params }) => {
          // Data is fetched before the component renders
          const post = await fetchPost(params.id);
          if (!post) throw new Response('Not Found', { status: 404 });
          return post;
        },
        errorElement: <PostError />,
      },
    ],
  },
]);

function PostPage() {
  const post = useLoaderData() as Post; // Data is already available
  return <article>{post.title}</article>;
}
\`\`\`

---

## Route Architecture Best Practices

\`\`\`
src/
└── routes/
    ├── index.tsx          # Root route definitions
    ├── protected.tsx      # Protected route wrapper
    └── pages/
        ├── HomePage.tsx
        ├── PostPage.tsx
        └── SettingsPage.tsx
\`\`\`

Keep route definitions in one place. Don't scatter \`<Routes>\` throughout the app — this makes it hard to understand the full routing structure.`,

  codeExamples: [
    {
      title: 'Complete app routing setup',
      code: `// routes/index.tsx
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected app routes */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />  {/* Header, Sidebar, Outlet */}
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Posts section */}
        <Route path="/posts">
          <Route index element={<PostListPage />} />
          <Route path="new" element={<NewPostPage />} />
          <Route path=":postId" element={<PostDetailPage />} />
          <Route path=":postId/edit" element={<EditPostPage />} />
        </Route>

        {/* Settings section */}
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="security" element={<SecuritySettingsPage />} />
          <Route path="billing" element={<BillingSettingsPage />} />
        </Route>

        {/* Admin only */}
        <Route
          path="/admin/*"
          element={
            <RequireRole role="admin">
              <AdminRoutes />
            </RequireRole>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}`,
      explanation:
        'This routing structure shows the common patterns: public routes, protected routes with layout, nested sections, and role-based protection. The index redirect at "/" sends to the dashboard immediately.',
    },
  ],

  commonMistakes: [
    'Using Link to="" instead of to="/" — empty string is a relative link to the current path.',
    'Not using replace on post-login navigation — creates extra history entry, breaking the back button.',
    'Forgetting <Outlet /> in layout routes — child routes render nowhere.',
    'Storing filter/search state in component state instead of URL params — state is lost on refresh.',
    'Nesting <BrowserRouter> multiple times — causes "useNavigate() may be used only in context of a <Router>" errors.',
  ],

  interviewQuestions: [
    {
      question: 'How do you implement protected routes in React Router?',
      answer:
        'Create a wrapper component (RequireAuth) that checks authentication state. If the user is not authenticated, render <Navigate to="/login" state={{ from: location }} replace /> — saving the intended location so they can be redirected back after login. Wrap protected route groups with this component. In the login handler, read location.state?.from?.pathname to navigate back to the original destination.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between <Link> and <NavLink>?',
      answer:
        'Both render an anchor tag. NavLink adds an active class (or style) when the current URL matches the to prop. This is useful for navigation menus where the current page should be visually highlighted. NavLink has an end prop — when set, the route matches exactly (so "/" with end does not match "/about").',
      difficulty: 'beginner',
    },
    {
      question: 'What is the Outlet component in React Router?',
      answer:
        'Outlet is a placeholder component that renders the matched child route\'s element. It is used in layout routes — routes that render shared UI (headers, sidebars, navigation) and let child routes fill in the main content area. Without Outlet, child routes have nowhere to render. It is similar to {children} in the component pattern but specific to routing.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'router-ex-1',
      title: 'Add Search Params to a Filter UI',
      description: 'Convert this component from useState-based filters to URL search params so filters are shareable.',
      starterCode: `function JobList() {
  // Currently: filter state is in component — lost on refresh
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [remote, setRemote] = useState(false);

  // TODO: Move to URL search params instead
  // URL should look like: /jobs?q=engineer&type=fulltime&remote=true

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs" />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="all">All Types</option>
        <option value="fulltime">Full Time</option>
        <option value="parttime">Part Time</option>
      </select>
      <label>
        <input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} />
        Remote only
      </label>
    </div>
  );
}`,
      solution: `function JobList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const type = searchParams.get('type') ?? 'all';
  const remote = searchParams.get('remote') === 'true';

  function update(key: string, value: string | null) {
    setSearchParams(prev => {
      if (!value || value === 'false' || value === 'all') prev.delete(key);
      else prev.set(key, value);
      return prev;
    });
  }

  return (
    <div>
      <input
        value={search}
        onChange={e => update('q', e.target.value)}
        placeholder="Search jobs"
      />
      <select value={type} onChange={e => update('type', e.target.value)}>
        <option value="all">All Types</option>
        <option value="fulltime">Full Time</option>
        <option value="parttime">Part Time</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={remote}
          onChange={e => update('remote', String(e.target.checked))}
        />
        Remote only
      </label>
    </div>
  );
}`,
      hints: [
        'useSearchParams returns [searchParams, setSearchParams]',
        'searchParams.get(key) returns the value or null',
        'setSearchParams takes a function that receives the previous URLSearchParams',
        'Delete params that have default/empty values to keep URLs clean',
      ],
    },
  ],

  keyTakeaways: [
    'React Router v6 uses <Routes> + <Route> + <Outlet> for nested, declarative routing.',
    'Dynamic routes use :param syntax; useParams() reads them in components.',
    'Nested routes: parent route element has <Outlet /> where child routes render.',
    'Protected routes: wrapper component checks auth, renders <Navigate> if not authenticated.',
    'URL search params (useSearchParams) are better than state for filterable/searchable lists — shareable and bookmarkable.',
    'useNavigate() for programmatic navigation; navigate(-1) for back; replace: true to avoid extra history entries.',
  ],

  nextLesson: 'testing',
  prevLesson: 'error-handling',
};
