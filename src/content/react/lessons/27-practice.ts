import type { Lesson } from '@/types';

export const practiceLesson: Lesson = {
  id: 'practice',
  slug: 'practice',
  title: 'Practice Exercises',
  description:
    'Hands-on practice exercises covering components, state, hooks, context, API integration, and performance optimization. Each exercise has a starter, hints, and a complete solution.',
  category: 'Practice',
  order: 27,
  difficulty: 'intermediate',
  estimatedTime: 90,
  content: `Practice is how understanding becomes ability. These exercises cover every major React concept — work through them in order. Each one is a real pattern you will encounter in production.

---

## How to Practice Effectively

1. **Read the requirement** — understand what the component should do
2. **Write the code yourself** — do not look at hints or solution first
3. **Check your solution** — compare against the provided solution
4. **Understand the difference** — if your solution differs, understand why the reference is preferred
5. **Rebuild from memory** — close everything and write it again

---

## Set 1: Components and Props

### Exercise 1.1 — Badge Component

Build a reusable Badge component:
- Accepts \`variant\` prop: "success" | "error" | "warning" | "info"
- Accepts \`children\` for text content
- Applies different CSS classes per variant
- Has sensible default props

\`\`\`tsx
// Starter:
function Badge() {
  // TODO
}

// Expected usage:
// <Badge variant="success">Active</Badge>
// <Badge variant="error">Failed</Badge>
// <Badge>Default</Badge> — should render without variant
\`\`\`

Solution:
\`\`\`tsx
interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

function Badge({ variant = 'info', children }: BadgeProps) {
  return (
    <span className={\`badge badge--\${variant}\`}>
      {children}
    </span>
  );
}
\`\`\`

---

### Exercise 1.2 — Card with slots

Build a Card component that accepts a header, body content, and footer:

\`\`\`tsx
// Expected usage:
<Card
  header={<h2>Post Title</h2>}
  footer={<button>Read More</button>}
>
  <p>Post content here...</p>
</Card>
\`\`\`

Solution:
\`\`\`tsx
interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

function Card({ header, footer, children }: CardProps) {
  return (
    <div className="card">
      {header && <div className="card__header">{header}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
\`\`\`

---

## Set 2: State Management

### Exercise 2.1 — Shopping Cart

Build a shopping cart with add, remove, and quantity update functionality:

\`\`\`tsx
// Starter:
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // TODO: Implement addItem, removeItem, updateQuantity, clearCart
  // TODO: Calculate total
}
\`\`\`

Solution:
\`\`\`tsx
function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} — \${item.price}
            <input
              type="number"
              value={item.quantity}
              onChange={e => updateQuantity(item.id, Number(e.target.value))}
            />
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: \${total.toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
\`\`\`

---

## Set 3: Hooks

### Exercise 3.1 — useLocalStorage hook

Build a useLocalStorage hook that syncs state with localStorage:

\`\`\`tsx
// Expected API:
const [theme, setTheme] = useLocalStorage('theme', 'dark');
// Reads from localStorage on mount
// Writes to localStorage on every change
// Falls back to initial value if key doesn't exist
\`\`\`

Solution:
\`\`\`tsx
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setValue(value: T) {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('useLocalStorage: could not set value', error);
    }
  }

  return [storedValue, setValue];
}
\`\`\`

---

### Exercise 3.2 — useDebounce hook

Build a useDebounce hook that delays value updates:

\`\`\`tsx
// Expected API:
const debouncedSearch = useDebounce(searchQuery, 300);
// debouncedSearch updates 300ms after searchQuery stops changing
// Used to avoid API calls on every keystroke
\`\`\`

Solution:
\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // Cleanup cancels the timeout if value changes
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

---

## Set 4: Context

### Exercise 4.1 — Notification System

Build a notification system using Context:
- Add notifications (success, error, warning)
- Auto-dismiss after 5 seconds
- Manual dismiss
- Display at top of screen

Solution:
\`\`\`tsx
interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface NotificationContextType {
  notify: (message: string, type: Notification['type']) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: Notification['type']) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="notifications">
        {notifications.map(n => (
          <div key={n.id} className={\`notification notification--\${n.type}\`}>
            {n.message}
            <button onClick={() => dismiss(n.id)}>×</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
\`\`\`

---

## Set 5: API Integration

### Exercise 5.1 — Paginated List

Build a paginated list that fetches data from an API:

\`\`\`tsx
// The component should:
// - Fetch the current page of data
// - Show loading state
// - Show error state with retry
// - Show "Previous" and "Next" buttons
// - Disable buttons at boundaries (page 1, last page)
\`\`\`

Solution:
\`\`\`tsx
function PaginatedList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetch(\`/api/posts?page=\${page}&limit=10\`).then(r => r.json()),
    placeholderData: keepPreviousData, // Keep previous page while loading next
  });

  if (isLoading) return <Spinner />;
  if (isError) return <button onClick={() => refetch()}>Retry</button>;

  return (
    <div>
      <ul>{data.items.map(item => <li key={item.id}>{item.title}</li>)}</ul>
      <div>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Previous
        </button>
        <span>Page {page} of {data.totalPages}</span>
        <button disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
\`\`\`

---

## Set 6: Performance

### Exercise 6.1 — Optimize an Expensive List

Optimize this component that re-renders too often:

\`\`\`tsx
// Problem: Every keystroke in the search input re-renders all 1000 items
function ExpensiveList({ items }: { items: Item[] }) {
  const [search, setSearch] = useState('');

  // This filter runs on every render
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}

// ItemCard re-renders on every parent render
function ItemCard({ item }: { item: Item }) {
  // Expensive render logic
  return <div>{item.name} — {expensiveFormat(item)}</div>;
}
\`\`\`

Solution:
\`\`\`tsx
// Fix 1: Memoize the filter result
function ExpensiveList({ items }: { items: Item[] }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())),
    [items, search] // Only recomputes when items or search changes
  );

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}

// Fix 2: Memoize ItemCard so it only re-renders when its item prop changes
const ItemCard = React.memo(function ItemCard({ item }: { item: Item }) {
  return <div>{item.name} — {expensiveFormat(item)}</div>;
});
\`\`\``,

  codeExamples: [
    {
      title: 'Complete mini app combining all concepts',
      code: `// A complete todo app using: state, context, custom hooks, and TypeScript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// 1. Custom hook for todo logic
function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);

  const add = useCallback((text: string) => {
    setTodos(prev => [...prev, {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    }]);
  }, [setTodos]);

  const toggle = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [setTodos]);

  const remove = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, [setTodos]);

  const active = useMemo(() => todos.filter(t => !t.completed), [todos]);
  const completed = useMemo(() => todos.filter(t => t.completed), [todos]);

  return { todos, add, toggle, remove, active, completed };
}

// 2. Components using the hook
function TodoApp() {
  const { todos, add, toggle, remove, active } = useTodos();
  const [input, setInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    add(input.trim());
    setInput('');
  }

  return (
    <div>
      <h1>Todos ({active.length} remaining)</h1>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggle(todo.id)} />
            {todo.text}
            <button onClick={() => remove(todo.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      explanation:
        'This mini app combines useLocalStorage (custom hook), useMemo (derived state), useCallback (stable references), form handling, and list rendering — all the core patterns in one place.',
    },
  ],

  commonMistakes: [
    'Looking at the solution before attempting the exercise — you learn nothing from reading.',
    'Copying the solution without understanding it — understanding comes from writing it yourself.',
    'Not building from memory after comparing — reproduction is the test of understanding.',
    'Skipping exercises you think you know — the implementation often reveals gaps.',
  ],

  interviewQuestions: [
    {
      question: 'How would you build a debounced search input in React?',
      answer:
        'Create a useDebounce custom hook: useState stores the debounced value, useEffect sets a timeout to update the debounced value after the delay, and the cleanup function cancels the previous timeout if value changes before the delay. Use the debounced value as the queryKey for TanStack Query — API calls only fire after typing stops.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'practice-bonus-1',
      title: 'Build a Star Rating Component',
      description: 'Build a reusable StarRating component that shows 5 stars. Clicking a star sets the rating. Hovering previews the rating. Accepts a controlled value and onChange callback.',
      starterCode: `// StarRating component
// Props: value (1-5), onChange (optional), readonly (optional)
// Features:
// - Filled stars up to the current value
// - Hover effect shows preview
// - If readonly, no hover or click
// - Keyboard accessible (can use arrow keys)

function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}) {
  // TODO
}`,
      solution: `function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div
      role="group"
      aria-label="Star rating"
      onMouseLeave={() => !readonly && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          aria-label={\`\${star} star\${star > 1 ? 's' : ''}\`}
          aria-pressed={star <= value}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          style={{
            background: 'none',
            border: 'none',
            cursor: readonly ? 'default' : 'pointer',
            color: star <= display ? '#f59e0b' : '#d1d5db',
            fontSize: '1.5rem',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}`,
      hints: [
        'Track a separate hovered state for the preview',
        'Display = hovered state if hovering, otherwise the value prop',
        'Use onMouseLeave on the container to clear hover state',
        'Use role="group" and aria-label for accessibility',
        'readonly prop should disable both click and hover effects',
      ],
    },
  ],

  keyTakeaways: [
    'Practice is not reading — it is writing code from scratch, getting it wrong, and figuring out why.',
    'The gap between "I understand this" and "I can write this" is only closed by building.',
    'After checking your solution against the reference, always rebuild it from memory.',
    'These exercises are not tests — they are training. The goal is capability, not a score.',
  ],

  nextLesson: 'guided-projects',
  prevLesson: 'interview-prep',
};
