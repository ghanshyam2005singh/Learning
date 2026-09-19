import type { Lesson } from '@/types';

export const reactTypescriptLesson: Lesson = {
  id: 'react-typescript',
  slug: 'react-typescript',
  title: 'React and TypeScript',
  description:
    'React-specific TypeScript patterns — component typing, props, events, hooks, refs, context, and API responses. Assumes TypeScript fundamentals from the TypeScript track.',
  category: 'TypeScript',
  order: 25,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `This module covers TypeScript patterns specific to React. It assumes you have completed the TypeScript track. We focus on patterns unique to React — not TypeScript basics.

---

## Component Typing

\`\`\`tsx
// Inline props interface (for simple components)
function Button({ onClick, disabled = false, children }: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return <button onClick={onClick} disabled={disabled}>{children}</button>;
}

// Separate interface (for complex or exported components)
interface CardProps {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function Card({ title, description, footer, className, children }: CardProps) {
  return (
    <div className={\`card \${className ?? ''}\`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <div className="card-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}
\`\`\`

---

## React.ReactNode vs React.FC

\`\`\`tsx
// React.ReactNode — the type for children prop
// Accepts: JSX, strings, numbers, arrays, null, undefined, boolean
function Wrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// React.FC (Function Component) — avoid in modern React
// It adds implicit children prop (React 17 issue, fixed in v18 with React.FC)
// But it also hides the return type
// Modern convention: type the props directly, let TypeScript infer the return

// ❌ Older style
const Button: React.FC<{ label: string }> = ({ label }) => <button>{label}</button>;

// ✅ Modern style — more explicit
function Button({ label }: { label: string }) {
  return <button>{label}</button>;
}
\`\`\`

---

## Typing Events

React event types are in the \`React\` namespace:

\`\`\`tsx
// Form events
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
}

function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
  console.log(e.target.value);
}

function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  console.log(e.target.value);
}

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

// Mouse events
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log(e.clientX, e.clientY);
}

function handleDrop(e: React.DragEvent<HTMLDivElement>) {
  const file = e.dataTransfer.files[0];
}

// Keyboard events
function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === 'Enter') { /* ... */ }
}

// Focus events
function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
  console.log(e.target.value);
}

// Generic event handler type
type InputHandler = React.ChangeEventHandler<HTMLInputElement>;
const handleInput: InputHandler = (e) => console.log(e.target.value);
\`\`\`

---

## Typing useState

\`\`\`tsx
// TypeScript usually infers from initial value
const [count, setCount] = useState(0);        // number
const [name, setName] = useState('');          // string
const [items, setItems] = useState<string[]>([]); // Needs annotation for arrays

// Explicit annotation for complex types
interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);

// Union types
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');
\`\`\`

---

## Typing useRef

\`\`\`tsx
// DOM ref — initial value is null, will be set by React
const inputRef = useRef<HTMLInputElement>(null);
// TypeScript knows: inputRef.current is HTMLInputElement | null

useEffect(() => {
  inputRef.current?.focus(); // Optional chaining for null safety
}, []);

return <input ref={inputRef} />;

// Mutable ref — not a DOM ref, just a mutable container
const countRef = useRef<number>(0);
// TypeScript knows: countRef.current is number
countRef.current = 42; // No null check needed — initialized with a value

// Common element types:
useRef<HTMLDivElement>(null);
useRef<HTMLButtonElement>(null);
useRef<HTMLFormElement>(null);
useRef<HTMLVideoElement>(null);
\`\`\`

---

## Typing Context

\`\`\`tsx
interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
}

// Create with null default — checked in custom hook
const ThemeContext = createContext<ThemeContextType | null>(null);

function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx; // TypeScript knows this is ThemeContextType (not null)
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
\`\`\`

---

## Typing Custom Hooks

\`\`\`tsx
// Return type inferred — TypeScript figures it out
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, increment, decrement, reset };
}
// Inferred return type: { count: number; increment: () => void; decrement: () => void; reset: () => void }

// Explicit return type for complex hooks
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  // ...implementation
}

// as const for tuple return (not an array)
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle]; // Without 'as const', type is (boolean | () => void)[]
}
// OR:
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle] as const; // 'as const' makes it a readonly tuple
}
\`\`\`

---

## Typing API Responses

\`\`\`tsx
// Define types that match your API contract
interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  tags: string[];
  publishedAt: string; // ISO date string
  status: 'draft' | 'published' | 'archived';
}

// API function with proper typing
async function fetchPosts(page = 1): Promise<ApiResponse<Post[]>> {
  const response = await fetch(\`/api/posts?page=\${page}\`);
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.json();
}

// Component consuming typed data
function PostList() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });
  // data is ApiResponse<Post[]> | undefined

  return (
    <ul>
      {data?.data.map(post => (
        // post is typed as Post — full autocomplete
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

---

## Generic Components

\`\`\`tsx
// Generic list component that works for any item type
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage = 'No items' }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage}</p>;
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage — TypeScript infers T from the items prop
<List
  items={posts}
  keyExtractor={post => post.id}
  renderItem={post => <PostCard post={post} />}
/>

<List
  items={users}
  keyExtractor={user => user.id}
  renderItem={user => <UserCard user={user} />}
/>
\`\`\`

---

## Discriminated Unions for State

\`\`\`tsx
// Instead of three separate booleans, use a discriminated union
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function DataDisplay({ state }: { state: FetchState<Post[]> }) {
  switch (state.status) {
    case 'idle': return null;
    case 'loading': return <Spinner />;
    case 'error': return <Error message={state.error} />; // TypeScript knows error exists
    case 'success': return (                              // TypeScript knows data exists
      <ul>{state.data.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    );
  }
}
\`\`\`

---

## Forwarding Refs with TypeScript

\`\`\`tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// forwardRef with TypeScript
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} aria-invalid={!!error} {...props} />
        {error && <span role="alert">{error}</span>}
      </div>
    );
  }
);

// Parent
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} label="Email" type="email" error={errors.email} />
\`\`\``,

  codeExamples: [
    {
      title: 'Extending HTML element props',
      code: `// Pattern: Create a Button that extends native button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...rest // All remaining native button props (onClick, type, aria-*, etc.)
}: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size} \${className ?? ''}\`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  );
}

// TypeScript validates all usage:
<Button variant="danger" onClick={handleDelete} type="button">  // ✅
<Button variant="invalid">Delete</Button>  // ❌ "invalid" not in union
<Button htmlFor="something">Label</Button>  // ❌ htmlFor not on button`,
      explanation:
        'Extending HTML attributes lets your component accept all native button props without explicitly listing them. ...rest forwards them to the DOM element. This pattern is used in every component library.',
    },
  ],

  commonMistakes: [
    'Using React.FC — adds implicit children prop in old versions, hides return type, adds no real benefit. Type props directly.',
    'Not typing the useState initial value for arrays/objects — TypeScript infers never[] for useState([]).',
    'Not using as const for tuple returns from hooks — TypeScript widens to array type instead of tuple.',
    'Missing null in useRef — DOM refs start as null. useRef<HTMLInputElement>(null) not useRef<HTMLInputElement>().',
    'Typing children as React.ReactNode not ReactElement — ReactNode is more permissive and correct for children.',
  ],

  interviewQuestions: [
    {
      question: 'What is React.ReactNode vs React.ReactElement?',
      answer:
        'ReactElement is a specific type: the object returned by JSX (React.createElement). ReactNode is broader: it includes ReactElement, strings, numbers, booleans, null, undefined, and arrays of these. Use ReactNode for the children prop — it accepts anything renderable. Use ReactElement when you specifically need a JSX element (e.g., a render prop that must return JSX, not a string).',
      difficulty: 'intermediate',
    },
    {
      question: 'How do you type a custom hook that returns a tuple?',
      answer:
        'Without as const, TypeScript widens the return type to an array union. With as const, TypeScript creates a readonly tuple. Example: return [value, toggle] as const — return type is readonly [boolean, () => void]. Alternatively, explicitly type the return: function useToggle(): [boolean, () => void]. The as const approach is cleaner for short tuples.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'react-ts-ex-1',
      title: 'Build a Fully Typed Table Component',
      description: 'Create a generic Table component that works for any row type, with typed columns and sort functionality.',
      starterCode: `// TODO: Create a generic Table component
// interface Column<T> { ... }
// interface TableProps<T> { ... }
// function Table<T>({ ... }: TableProps<T>)

// It should:
// - Accept any row type T
// - Accept column definitions that specify: key, label, optional render function
// - Support sorting by clicking column headers
// - Show a "No data" message when rows is empty`,
      solution: `interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  rows: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

function Table<T>({ rows, columns, keyExtractor, emptyMessage = 'No data' }: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const av = String(a[sortKey]);
      const bv = String(b[sortKey]);
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [rows, sortKey, sortDir]);

  function handleSort(key: keyof T) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} onClick={col.sortable ? () => handleSort(col.key) : undefined} style={{ cursor: col.sortable ? 'pointer' : 'default' }}>
              {col.label}
              {col.sortable && sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr><td colSpan={columns.length}>{emptyMessage}</td></tr>
        ) : (
          sorted.map(row => (
            <tr key={keyExtractor(row)}>
              {columns.map(col => (
                <td key={String(col.key)}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// Usage:
<Table
  rows={users}
  keyExtractor={u => u.id}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', render: (v) => <Badge>{String(v)}</Badge> },
  ]}
/>`,
      hints: [
        'Use generics: function Table<T>',
        'Column<T> needs key: keyof T to be type-safe',
        'render function receives the cell value — type it as T[keyof T]',
        'useMemo for the sorted rows',
      ],
    },
  ],

  keyTakeaways: [
    'Avoid React.FC — type props directly. Use React.ReactNode for children.',
    'Event types are in the React namespace: React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>.',
    'useRef for DOM: useRef<HTMLInputElement>(null). For mutable values: useRef<number>(0).',
    'Extend HTML element interfaces (React.ButtonHTMLAttributes) to forward all native attributes.',
    'Use as const on tuple hook returns to get a typed tuple instead of an array union.',
    'Generic components with TypeScript (<T>) enable reusable, fully type-safe components.',
  ],

  nextLesson: 'interview-prep',
  prevLesson: 'scalable-architecture',
};
