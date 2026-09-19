import type { Lesson } from '@/types';

export const guidedProjectsLesson: Lesson = {
  id: 'guided-projects',
  slug: 'guided-projects',
  title: 'Guided Projects',
  description:
    'Ten complete projects from beginner to production-grade — Counter, Todo, Weather App, Auth UI, Dashboard, E-Commerce Cart, Kanban Board, Chat Interface, Admin Panel, and Learning Platform.',
  category: 'Projects',
  order: 28,
  difficulty: 'advanced',
  estimatedTime: 120,
  content: `Projects are how knowledge becomes skill. Each project here is real — something you would find in a production codebase. They are designed in order: start with Project 1 if you are new, jump to Project 5+ if you are comfortable with the basics.

---

## Project 1 — Counter App

**Concepts:** useState, event handlers, conditional rendering

\`\`\`tsx
// Requirements:
// - Increment, decrement, reset buttons
// - Min value: 0 (decrement disabled at 0)
// - Max value: 10 (increment disabled at 10)
// - Step size configurable via prop (default: 1)
// - Color changes: green above 7, red below 3

function Counter({ step = 1, min = 0, max = 10 }: {
  step?: number;
  min?: number;
  max?: number;
}) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => Math.min(prev + step, max));
  const decrement = () => setCount(prev => Math.max(prev - step, min));
  const reset = () => setCount(0);

  const color = count >= 7 ? 'green' : count <= 3 ? 'red' : 'inherit';

  return (
    <div>
      <h1 style={{ color }}>{count}</h1>
      <button onClick={decrement} disabled={count <= min}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment} disabled={count >= max}>+</button>
    </div>
  );
}
\`\`\`

**What you learn:** Bounded state, disabled states, derived values (color from count).

---

## Project 2 — Todo App

**Concepts:** CRUD state, lists, filtering, localStorage

\`\`\`tsx
// Requirements:
// - Add todos
// - Mark complete / incomplete
// - Delete todos
// - Filter: All / Active / Completed
// - Show count of remaining todos
// - Clear completed button
// - Persists to localStorage

type Filter = 'all' | 'active' | 'completed';

function TodoApp() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text: input.trim(), completed: false }]);
    setInput('');
  }

  function toggle(id: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function remove(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  const remaining = todos.filter(t => !t.completed).length;

  return (
    <div className="todo-app">
      <form onSubmit={add}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="What needs to be done?" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {filtered.map(todo => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggle(todo.id)} />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
            <button onClick={() => remove(todo.id)}>×</button>
          </li>
        ))}
      </ul>

      <footer>
        <span>{remaining} items left</span>
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontWeight: filter === f ? 'bold' : 'normal' }}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={clearCompleted}>Clear Completed</button>
      </footer>
    </div>
  );
}
\`\`\`

---

## Project 3 — Weather App

**Concepts:** API integration, loading/error states, custom hooks, environment variables

\`\`\`tsx
// Requirements:
// - Search by city name
// - Show current weather: temp, description, humidity, wind
// - Loading state while fetching
// - Error handling for invalid city
// - Unit toggle: Celsius / Fahrenheit
// - Save last 5 searches

function useWeather(city: string, unit: 'metric' | 'imperial') {
  return useQuery({
    queryKey: ['weather', city, unit],
    queryFn: () =>
      fetch(\`https://api.openweathermap.org/data/2.5/weather?q=\${city}&units=\${unit}&appid=\${API_KEY}\`)
        .then(r => {
          if (!r.ok) throw new Error('City not found');
          return r.json();
        }),
    enabled: city.length > 0,
    retry: false,
  });
}

function WeatherApp() {
  const [input, setInput] = useState('');
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [history, setHistory] = useLocalStorage<string[]>('weather-history', []);

  const { data, isLoading, error } = useWeather(city, unit);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setCity(input.trim());
    setHistory(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== input.trim().toLowerCase());
      return [input.trim(), ...filtered].slice(0, 5);
    });
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter city" />
        <button type="submit">Search</button>
        <button type="button" onClick={() => setUnit(u => u === 'metric' ? 'imperial' : 'metric')}>
          Switch to {unit === 'metric' ? '°F' : '°C'}
        </button>
      </form>

      {history.length > 0 && (
        <div>
          {history.map(c => (
            <button key={c} onClick={() => { setCity(c); setInput(c); }}>{c}</button>
          ))}
        </div>
      )}

      {isLoading && <Spinner />}
      {error && <p role="alert">{(error as Error).message}</p>}
      {data && (
        <div>
          <h2>{data.name}, {data.sys.country}</h2>
          <p>{data.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p>{data.weather[0].description}</p>
          <p>Humidity: {data.main.humidity}%</p>
          <p>Wind: {data.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
      )}
    </div>
  );
}
\`\`\`

---

## Project 4 — Auth UI

**Concepts:** Form validation, error handling, context, protected routes, navigation

\`\`\`tsx
// Requirements:
// - Login form with email/password
// - Client-side validation
// - Show API error messages
// - Loading state on submit button
// - On success, redirect to dashboard
// - "Remember me" checkbox
// - Forgot password link

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname ?? '/dashboard';

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setIsLoading(true);
    setServerError('');
    try {
      await login(form.email, form.password, form.remember);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError((err as Error).message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <p role="alert">{serverError}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && <span id="email-error" role="alert">{errors.email}</span>}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={form.password}
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
      />
      {errors.password && <span role="alert">{errors.password}</span>}

      <label>
        <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} />
        Remember me
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
\`\`\`

---

## Project 5 — Dashboard with Charts

**Concepts:** API integration, data visualization, responsive layout, TanStack Query

**Architecture:**
\`\`\`
DashboardPage
├── StatsRow (4 stat cards)
├── RevenueChart (line chart with date range filter)
├── RecentTransactions (sortable table)
└── TopProducts (bar chart)
\`\`\`

Each section fetches its own data independently. If one fails, others still work (Error Boundaries per section). Charts use Recharts or Chart.js.

**Key patterns:**
- Each widget has its own useQuery
- Skeleton loaders while loading
- Error boundary per widget
- Date range selector updates all charts

---

## Project 6 — E-Commerce Cart

**Concepts:** Global state (Zustand), optimistic updates, complex list management

**Features:**
- Product listing with filters and search
- Add to cart (with quantity)
- Cart sidebar (slide in/out)
- Quantity update in cart
- Remove item
- Coupon code
- Order total (subtotal + tax + shipping)
- Checkout flow (multi-step form)

**State design:**
\`\`\`ts
interface CartStore {
  items: CartItem[];
  coupon: string | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  applyCoupon: (code: string) => Promise<void>;
  clearCart: () => void;
  // Derived
  subtotal: () => number;
  discount: () => number;
  total: () => number;
}
\`\`\`

---

## Project 7 — Kanban Board

**Concepts:** Drag and drop, complex state management, optimistic updates

**Features:**
- Columns: To Do, In Progress, Done (configurable)
- Cards can be dragged between columns
- Add/edit/delete cards
- Card details (title, description, assignee, due date)
- Column card count
- Keyboard navigation

**Implementation notes:**
- Use @hello-pangea/dnd (react-beautiful-dnd fork) for drag and drop
- Store board in Zustand
- Persist to localStorage
- Optimistic updates for drag operations

---

## Project 8 — Real-Time Chat Interface

**Concepts:** WebSocket, real-time updates, infinite scroll (history), optimistic messages

**Features:**
- Message list (newest at bottom)
- Load older messages on scroll up (infinite scroll upward)
- Send message (optimistic — appears immediately)
- Message status: sending / sent / delivered / read
- Typing indicators
- User presence (online/offline)

**Key technical patterns:**
\`\`\`tsx
// Optimistic message sending
function useSendMessage(channelId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessage,
    onMutate: async (newMessage) => {
      // Add optimistic message immediately
      const optimistic = { ...newMessage, id: 'optimistic', status: 'sending' };
      queryClient.setQueryData(['messages', channelId], (old: Message[]) => [...old, optimistic]);
      return { optimistic };
    },
    onSuccess: (real, _, context) => {
      // Replace optimistic with real message
      queryClient.setQueryData(['messages', channelId], (old: Message[]) =>
        old.map(m => m.id === context?.optimistic.id ? real : m)
      );
    },
    onError: (_, __, context) => {
      // Remove failed message
      queryClient.setQueryData(['messages', channelId], (old: Message[]) =>
        old.filter(m => m.id !== context?.optimistic.id)
      );
    },
  });
}
\`\`\`

---

## Project 9 — Admin Panel

**Concepts:** RBAC, complex tables, bulk actions, export, advanced forms

**Features:**
- Users table with sorting, filtering, pagination
- Bulk select and delete
- Role-based visibility (admin can edit, viewer cannot)
- Export to CSV
- User details modal
- Edit user (multi-field form with validation)
- Activity log

**Role-based rendering:**
\`\`\`tsx
function usePermissions() {
  const { user } = useAuth();
  return {
    canEdit: user?.role === 'admin',
    canDelete: user?.role === 'admin',
    canView: true,
    canExport: user?.role === 'admin' || user?.role === 'manager',
  };
}

function UsersTable() {
  const { canEdit, canDelete } = usePermissions();
  return (
    <table>
      {rows.map(user => (
        <tr key={user.id}>
          <td>{user.name}</td>
          {canEdit && <td><button>Edit</button></td>}
          {canDelete && <td><button>Delete</button></td>}
        </tr>
      ))}
    </table>
  );
}
\`\`\`

---

## Project 10 — Learning Platform UI

**Concepts:** Full-featured SPA — routing, auth, state, API, performance

**This is the capstone project.** Build a UI similar to this platform:

**Features:**
- Home page with track cards
- Track detail page with module list
- Lesson page with: content display, code examples, exercises
- Progress tracking (localStorage)
- Quiz component with score
- Search across lessons
- Responsive (mobile-first)
- Dark/light theme

**Component architecture:**
\`\`\`
App
├── pages/
│   ├── HomePage — track grid
│   ├── TrackPage — module list, progress
│   └── LessonPage — content, examples, exercises
├── features/
│   ├── progress/ — tracking completions
│   ├── search/   — search across content
│   └── quiz/     — quiz state and scoring
└── shared/
    ├── ui/ — Button, Card, Badge, Modal
    └── layout/ — Header, Sidebar, PageLayout
\`\`\`

This project uses every concept from the React track: components, state, hooks, context, routing, TypeScript, performance optimization, and architecture patterns.`,

  codeExamples: [
    {
      title: 'Project scaffold — start here for every project',
      code: `// 1. Start with the data shape
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

// 2. Define the API layer
const postsApi = {
  getAll: () => fetch('/api/posts').then(r => r.json()) as Promise<Post[]>,
  getById: (id: string) => fetch(\`/api/posts/\${id}\`).then(r => r.json()) as Promise<Post>,
};

// 3. Create custom hooks
function usePosts() {
  return useQuery({ queryKey: ['posts'], queryFn: postsApi.getAll });
}

// 4. Build the component
function PostList() {
  const { data, isLoading, isError } = usePosts();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load posts</div>;

  return (
    <ul>
      {data?.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author}</p>
        </li>
      ))}
    </ul>
  );
}`,
      explanation:
        'Every project starts the same way: define types → define API → create hooks → build components. This top-down approach prevents the common mistake of starting with components without knowing the data shape.',
    },
  ],

  commonMistakes: [
    'Starting with UI before defining the data shape — you end up refactoring everything.',
    'Building one giant component — decompose early. If a component is over 100 lines, split it.',
    'Not using TypeScript for projects — real projects use TypeScript. Practice with it.',
    'Skipping error and loading states — production apps must handle these. Build them from the start.',
    'Not reviewing your code after finishing — always look back and ask: what would I change?',
  ],

  interviewQuestions: [
    {
      question: 'Walk me through a React project you built from scratch.',
      answer:
        'Strong answer structure: (1) What it does (user-facing), (2) Tech decisions and why (TanStack Query for server data, Zustand for UI state, React Router for navigation), (3) Architecture (feature-based structure, API layer, custom hooks), (4) Challenges solved (optimistic updates for instant feedback, virtualization for large lists), (5) What you learned. The interviewer wants to hear your thinking, not just what you built.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'projects-ex-1',
      title: 'Choose and Build a Project',
      description: 'Build one of the 10 projects above. Start with Project 1 if you are new to React. Start with Project 5 or higher if you have experience.',
      starterCode: `// Choose a project and start here.
// Scaffold:
// 1. Define types for your data
// 2. Create API functions (or mock them)
// 3. Build custom hooks
// 4. Build components

// Start simple, then add features one at a time.`,
      solution: `// There is no single solution — your implementation is the solution.
// Review your code against these criteria:
// - Does it have types for all data?
// - Does it handle loading and error states?
// - Are components small and focused?
// - Is state placed at the right level?
// - Could another developer read and understand it?`,
      hints: [
        'Start with the simplest version that works — then add features',
        'Types first: what shape is your data?',
        'API layer second: how does data come in?',
        'Hooks third: how does the component access data?',
        'Components last: how is it displayed?',
      ],
    },
  ],

  keyTakeaways: [
    'Projects reveal gaps that exercises cannot — you face real decisions (architecture, state design, error handling) all at once.',
    'Every project should start with types → API → hooks → components. This order prevents rework.',
    'Build the simplest version that works, then add features. Do not design for everything up front.',
    'The capstone (Project 10) uses every concept in the track — return to it after completing the course.',
  ],

  nextLesson: 'real-world-engineering',
  prevLesson: 'practice',
};
