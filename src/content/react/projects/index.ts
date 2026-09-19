import type { Project } from '@/types';

export const reactProjects: Project[] = [
  {
    id: 'react-todo-app',
    slug: 'todo-app',
    title: 'Todo App',
    description: 'Build a complete todo application with filtering, persistence, and CRUD operations. The classic project — now done properly with TypeScript, immutable state, and localStorage.',
    difficulty: 'beginner',
    estimatedTime: '2 hours',
    techStack: ['React', 'TypeScript', 'localStorage'],
    features: [
      'Add new todos',
      'Mark todos complete / incomplete (toggle)',
      'Delete individual todos',
      'Filter: All / Active / Completed',
      'Show remaining active count',
      'Clear all completed button',
      'Persists across page refreshes via localStorage',
    ],
    folderStructure: `todo-app/
├── src/
│   ├── components/
│   │   ├── TodoForm.tsx      # Input + Add button
│   │   ├── TodoList.tsx      # Filtered list
│   │   ├── TodoItem.tsx      # Single todo row
│   │   └── TodoFooter.tsx    # Count + filter + clear
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── types.ts              # Todo interface
│   └── App.tsx
└── index.html`,
    steps: [
      {
        title: 'Define types and the custom hook',
        description: 'Start with types and useLocalStorage before building any UI.',
        code: `// types.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';

// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });
  function set(v: T) {
    setValue(v);
    window.localStorage.setItem(key, JSON.stringify(v));
  }
  return [value, set];
}`,
        hint: 'Lazy initialization in useState (passing a function) avoids reading localStorage on every render.',
      },
      {
        title: 'Build the state logic in App',
        description: 'All todo state lives in App — components receive data and callbacks as props.',
        code: `function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [filter, setFilter] = useState<Filter>('all');

  function add(text: string) {
    setTodos([...todos, { id: crypto.randomUUID(), text, completed: false }]);
  }

  function toggle(id: string) {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function remove(id: string) {
    setTodos(todos.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(todos.filter(t => !t.completed));
  }

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  const remaining = todos.filter(t => !t.completed).length;
}`,
        hint: 'Use useMemo for the filtered list — it only recomputes when todos or filter changes.',
      },
      {
        title: 'Build the components',
        description: 'Each component is small and focused — receives exactly what it needs.',
        code: `function TodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [input, setInput] = useState('');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="What needs to be done?" />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoItem({ todo, onToggle, onRemove }: {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
      <button onClick={() => onRemove(todo.id)}>×</button>
    </li>
  );
}`,
        hint: 'Components only receive what they need — no massive prop objects.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use useLocalStorage instead of calling localStorage directly in the component?',
        answer: 'A custom hook separates the concern of persistence from the component. The component does not need to know about localStorage — it just uses the same useState-like API. It is also reusable across the app, and easier to test or swap the storage mechanism later.',
        difficulty: 'intermediate',
      },
      {
        question: 'Why is the filter state in App instead of a separate component?',
        answer: 'The filtered list depends on both todos (state) and filter (state). If filter lived in a child component, the parent could not derive the filtered list. State should live at the lowest common ancestor of all components that need it.',
        difficulty: 'beginner',
      },
    ],
    tags: ['useState', 'useMemo', 'custom-hooks', 'localStorage', 'TypeScript'],
  },
  {
    id: 'react-weather-app',
    slug: 'weather-app',
    title: 'Weather App',
    description: 'Fetch real weather data from the OpenWeatherMap API. Implement loading and error states, unit conversion, and search history with TanStack Query.',
    difficulty: 'beginner',
    estimatedTime: '3 hours',
    techStack: ['React', 'TypeScript', 'TanStack Query', 'OpenWeatherMap API'],
    features: [
      'Search by city name',
      'Current weather: temperature, description, humidity, wind speed',
      'Toggle between Celsius and Fahrenheit',
      'Save last 5 searches (localStorage)',
      'Loading state while fetching',
      'Error message for unknown city',
    ],
    folderStructure: `weather-app/
├── src/
│   ├── api/
│   │   └── weather.ts        # API call + TypeScript types
│   ├── components/
│   │   ├── SearchForm.tsx
│   │   ├── WeatherCard.tsx
│   │   └── SearchHistory.tsx
│   ├── hooks/
│   │   └── useWeather.ts     # useQuery wrapper
│   └── App.tsx
└── .env.local                # VITE_WEATHER_API_KEY`,
    steps: [
      {
        title: 'Type the API response',
        description: 'Define TypeScript interfaces matching the OpenWeatherMap API shape before writing any fetch code.',
        code: `// api/weather.ts
export interface WeatherResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number; feels_like: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;

export async function fetchWeather(city: string, unit: 'metric' | 'imperial'): Promise<WeatherResponse> {
  const res = await fetch(
    \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&units=\${unit}&appid=\${API_KEY}\`
  );
  if (!res.ok) throw new Error(res.status === 404 ? 'City not found' : 'Failed to fetch weather');
  return res.json();
}`,
        hint: 'Type the API response first — it makes every component that uses the data fully type-safe.',
      },
      {
        title: 'Wrap in a TanStack Query hook',
        description: 'useQuery handles loading, error, and caching automatically.',
        code: `// hooks/useWeather.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../api/weather';

export function useWeather(city: string, unit: 'metric' | 'imperial') {
  return useQuery({
    queryKey: ['weather', city, unit],
    queryFn: () => fetchWeather(city, unit),
    enabled: city.length > 0,  // Do not fetch if no city entered
    retry: false,               // Don't retry on 404 (city not found)
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
  });
}`,
        hint: 'enabled: city.length > 0 prevents fetching on first render before the user types anything.',
      },
      {
        title: 'Build the App component',
        description: 'Wire search, unit toggle, history, and the weather hook together.',
        code: `function App() {
  const [searchedCity, setSearchedCity] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [history, setHistory] = useLocalStorage<string[]>('weather-history', []);

  const { data, isLoading, error } = useWeather(searchedCity, unit);

  function handleSearch(city: string) {
    setSearchedCity(city);
    setHistory(prev => {
      const deduped = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      return [city, ...deduped].slice(0, 5);
    });
  }

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      <button onClick={() => setUnit(u => u === 'metric' ? 'imperial' : 'metric')}>
        Switch to {unit === 'metric' ? '°F' : '°C'}
      </button>
      <SearchHistory history={history} onSelect={handleSearch} />
      {isLoading && <p>Loading...</p>}
      {error && <p role="alert">{(error as Error).message}</p>}
      {data && <WeatherCard data={data} unit={unit} />}
    </div>
  );
}`,
        hint: 'Keep the searched city and input separate — only update searchedCity on form submit, not on every keystroke.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use TanStack Query instead of useEffect + fetch?',
        answer: 'TanStack Query gives you caching (avoid redundant API calls), automatic background refetching (data stays fresh), loading/error states with no boilerplate, request deduplication, and optimistic updates. useEffect + fetch requires you to implement all of this yourself and is prone to race conditions, memory leaks, and missing loading states.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['TanStack Query', 'API', 'TypeScript', 'custom-hooks', 'error-handling'],
  },
  {
    id: 'react-kanban-board',
    slug: 'kanban-board',
    title: 'Kanban Board',
    description: 'Build a drag-and-drop kanban board with Zustand for state, @hello-pangea/dnd for drag and drop, and localStorage persistence.',
    difficulty: 'intermediate',
    estimatedTime: '6 hours',
    techStack: ['React', 'TypeScript', 'Zustand', '@hello-pangea/dnd'],
    features: [
      'Multiple columns (To Do, In Progress, Done)',
      'Add, edit, delete cards',
      'Drag cards between columns',
      'Add and rename columns',
      'Card detail: title, description',
      'Persists to localStorage',
    ],
    folderStructure: `kanban-board/
├── src/
│   ├── store/
│   │   └── boardStore.ts     # Zustand store
│   ├── components/
│   │   ├── Board.tsx         # DragDropContext wrapper
│   │   ├── Column.tsx        # Droppable column
│   │   ├── Card.tsx          # Draggable card
│   │   └── AddCard.tsx       # Inline add form
│   ├── types.ts
│   └── App.tsx`,
    steps: [
      {
        title: 'Define types and Zustand store',
        description: 'The board state is a list of columns, each with a list of cards.',
        code: `// types.ts
export interface Card {
  id: string;
  title: string;
  description?: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

// store/boardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BoardStore {
  columns: Column[];
  addCard: (columnId: string, title: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  removeCard: (columnId: string, cardId: string) => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      columns: [
        { id: 'todo', title: 'To Do', cards: [] },
        { id: 'in-progress', title: 'In Progress', cards: [] },
        { id: 'done', title: 'Done', cards: [] },
      ],
      addCard: (columnId, title) => set(state => ({
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, cards: [...col.cards, { id: crypto.randomUUID(), title }] }
            : col
        ),
      })),
      moveCard: (cardId, fromColumnId, toColumnId, toIndex) => set(state => {
        const fromCol = state.columns.find(c => c.id === fromColumnId)!;
        const card = fromCol.cards.find(c => c.id === cardId)!;
        return {
          columns: state.columns.map(col => {
            if (col.id === fromColumnId) return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
            if (col.id === toColumnId) {
              const newCards = [...col.cards];
              newCards.splice(toIndex, 0, card);
              return { ...col, cards: newCards };
            }
            return col;
          }),
        };
      }),
      removeCard: (columnId, cardId) => set(state => ({
        columns: state.columns.map(col =>
          col.id === columnId ? { ...col, cards: col.cards.filter(c => c.id !== cardId) } : col
        ),
      })),
    }),
    { name: 'kanban-board' }
  )
);`,
        hint: 'persist middleware from Zustand automatically saves to localStorage. The name field is the localStorage key.',
      },
      {
        title: 'Wire up drag and drop',
        description: 'Use DragDropContext, Droppable (column), and Draggable (card) from @hello-pangea/dnd.',
        code: `import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

function Board() {
  const { columns, moveCard } = useBoardStore();

  function onDragEnd(result: DropResult) {
    if (!result.destination) return; // Dropped outside a column
    const { draggableId, source, destination } = result;
    moveCard(draggableId, source.droppableId, destination.droppableId, destination.index);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 16 }}>
        {columns.map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{column.title}</h3>
                {column.cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {card.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}`,
        hint: 'provided.placeholder is required — it preserves the space while dragging to prevent layout shifts.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use Zustand instead of useState for the kanban board state?',
        answer: 'The board state is shared across many components: Board, Column, Card, AddCard. With useState in the top component, you would need to pass callbacks through every level (prop drilling). Zustand provides a global store that any component can subscribe to directly — no prop drilling, and components only re-render when their specific slice of state changes.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['Zustand', 'drag-and-drop', 'persist', 'complex-state', 'intermediate'],
  },
  {
    id: 'react-ecommerce-ui',
    slug: 'ecommerce-ui',
    title: 'E-Commerce Cart UI',
    description: 'Build a product listing with filtering, a global cart with Zustand, and a multi-step checkout flow with form validation.',
    difficulty: 'intermediate',
    estimatedTime: '8 hours',
    techStack: ['React', 'TypeScript', 'React Router v6', 'Zustand', 'TanStack Query'],
    features: [
      'Product listing with search and category filter',
      'Product detail page',
      'Add to cart with quantity management',
      'Cart sidebar — add, remove, update quantity',
      'Order total: subtotal, tax, shipping',
      'Multi-step checkout: shipping address → payment → confirmation',
    ],
    folderStructure: `ecommerce-ui/
├── src/
│   ├── features/
│   │   ├── products/
│   │   │   ├── api.ts
│   │   │   ├── hooks/useProducts.ts
│   │   │   └── components/
│   │   ├── cart/
│   │   │   ├── store.ts          # Zustand cart store
│   │   │   └── components/
│   │   └── checkout/
│   │       └── components/       # Multi-step form
│   ├── shared/components/ui/
│   └── app/routes.tsx`,
    steps: [
      {
        title: 'Build the cart Zustand store',
        description: 'The cart is global state accessed by the product listing, cart sidebar, and checkout.',
        code: `interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item) => set(state => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) {
      return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
  updateQuantity: (id, quantity) => set(state => {
    if (quantity <= 0) return { items: state.items.filter(i => i.id !== id) };
    return { items: state.items.map(i => i.id === id ? { ...i, quantity } : i) };
  }),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));`,
        hint: 'get() inside Zustand actions reads the current state without triggering a re-render. Use it for derived calculations.',
      },
      {
        title: 'Multi-step checkout form',
        description: 'Track the current step and validate each step before advancing.',
        code: `type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

function Checkout() {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null);

  function handleShippingSubmit(data: ShippingForm) {
    setShippingData(data);
    setStep('payment');
  }

  function handlePaymentSubmit() {
    setStep('confirmation');
  }

  return (
    <div>
      <StepIndicator current={step} steps={['shipping', 'payment', 'confirmation']} />
      {step === 'shipping' && <ShippingForm onSubmit={handleShippingSubmit} />}
      {step === 'payment' && <PaymentForm onSubmit={handlePaymentSubmit} />}
      {step === 'confirmation' && <OrderConfirmation shipping={shippingData!} />}
    </div>
  );
}`,
        hint: 'Each step is a separate component. The parent only tracks which step is active and collects data as each step completes.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you persist the cart state across page refreshes?',
        answer: 'Add the persist middleware from Zustand: create(persist((set, get) => ({ ... }), { name: "cart" })). This automatically syncs the store to localStorage. On page load, Zustand rehydrates from localStorage before first render. You can also use the partialize option to only persist specific fields (e.g., exclude isOpen).',
        difficulty: 'intermediate',
      },
    ],
    tags: ['Zustand', 'React Router', 'TanStack Query', 'forms', 'multi-step', 'advanced'],
  },
  {
    id: 'react-admin-dashboard',
    slug: 'admin-dashboard',
    title: 'Admin Dashboard',
    description: 'Build a data-heavy admin panel with role-based access control, a sortable/filterable table, charts, and bulk operations.',
    difficulty: 'advanced',
    estimatedTime: '10 hours',
    techStack: ['React', 'TypeScript', 'React Router v6', 'TanStack Query', 'Recharts', 'Zustand'],
    features: [
      'Authentication with admin / viewer roles',
      'Role-based route protection (admin only sections)',
      'Users table: sort by column, filter by role/status, paginate',
      'Bulk select and delete selected rows',
      'Edit user modal with form validation',
      'Dashboard stats with Recharts line and bar charts',
      'Export filtered data to CSV',
    ],
    folderStructure: `admin-dashboard/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/LoginPage.tsx
│   │   │   ├── hooks/useAuth.ts
│   │   │   └── store.ts
│   │   ├── users/
│   │   │   ├── api.ts
│   │   │   ├── hooks/useUsers.ts
│   │   │   └── components/
│   │   │       ├── UsersTable.tsx
│   │   │       ├── EditUserModal.tsx
│   │   │       └── BulkActions.tsx
│   │   └── dashboard/
│   │       └── components/
│   │           ├── StatsRow.tsx
│   │           └── Charts.tsx
│   ├── shared/
│   │   ├── components/ui/
│   │   └── hooks/usePermissions.ts
│   └── app/routes.tsx`,
    steps: [
      {
        title: 'Role-based access control',
        description: 'Build a usePermissions hook and RequireRole route wrapper.',
        code: `function usePermissions() {
  const { user } = useAuth();
  return {
    canEdit: user?.role === 'admin',
    canDelete: user?.role === 'admin',
    canExport: user?.role === 'admin' || user?.role === 'manager',
    canView: !!user,
  };
}

function RequireRole({ role, children }: { role: string; children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== role) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

// In routes:
<Route path="/admin/users" element={
  <RequireRole role="admin">
    <UsersPage />
  </RequireRole>
} />`,
        hint: 'usePermissions is more flexible than checking the role directly in components — you change permission rules in one place.',
      },
      {
        title: 'Sortable, filterable table with pagination',
        description: 'Use TanStack Query for data, local state for sort/filter/page.',
        code: `function UsersTable() {
  const [sortKey, setSortKey] = useState<keyof User>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data } = useQuery({
    queryKey: ['users', sortKey, sortDir, roleFilter, page],
    queryFn: () => usersApi.getAll({ sortKey, sortDir, role: roleFilter, page }),
  });

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selected.size === data?.users.length) setSelected(new Set());
    else setSelected(new Set(data?.users.map(u => u.id)));
  }

  // ...render table
}`,
        hint: 'Use a Set for selected IDs — O(1) lookup for checkbox checked state.',
      },
      {
        title: 'Export to CSV',
        description: 'Build a utility that converts filtered data to a downloadable CSV file.',
        code: `function exportToCSV(data: User[], filename: string) {
  const headers = ['ID', 'Name', 'Email', 'Role', 'Status'];
  const rows = data.map(u => [u.id, u.name, u.email, u.role, u.status]);
  const csv = [headers, ...rows].map(row => row.join(',')).join('\\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Usage in component
const { canExport } = usePermissions();
{canExport && (
  <button onClick={() => exportToCSV(filteredUsers, 'users.csv')}>
    Export CSV
  </button>
)}`,
        hint: 'URL.createObjectURL creates a temporary URL for the blob. Revoke it after the download to free memory.',
      },
    ],
    interviewQuestions: [
      {
        question: 'How do you implement bulk delete with optimistic updates?',
        answer: 'Use TanStack Query\'s useMutation with onMutate for optimistic removal. Before the API call, remove selected items from the cache immediately. If the API call fails, roll back using the previous data saved in onMutate context. This makes the UI feel instant — the items disappear immediately, not after the server responds.',
        difficulty: 'advanced',
      },
    ],
    tags: ['RBAC', 'TanStack Query', 'tables', 'Recharts', 'CSV', 'advanced'],
  },
];
