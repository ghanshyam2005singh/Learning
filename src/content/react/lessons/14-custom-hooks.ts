import type { Lesson } from '@/types';

export const customHooksLesson: Lesson = {
  id: 'custom-hooks',
  slug: 'custom-hooks',
  title: 'Custom Hooks',
  description:
    'Master custom hooks — extracting shared logic, building a library of reusable hooks, and understanding why they are one of React\'s most powerful patterns.',
  category: 'Hooks',
  order: 14,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `Custom hooks are functions that start with \`use\` and call other hooks. They are React's mechanism for extracting and reusing stateful logic across components.

Custom hooks are not a new feature — they are just a convention. But they fundamentally changed how React developers organize and share code.

---

## Why Custom Hooks Exist

Before custom hooks, sharing stateful logic required:
- Higher-Order Components (messy prop chains)
- Render Props (deep nesting)

Custom hooks replaced both patterns with something simpler: functions.

**The core idea:** If you find yourself copy-pasting the same \`useState\` + \`useEffect\` combination into multiple components, extract it into a custom hook.

\`\`\`jsx
// Copy-pasted in 5 components:
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  let cancelled = false;
  fetch(url)
    .then(r => r.json())
    .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
    .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
  return () => { cancelled = true; };
}, [url]);

// Extracted into a custom hook — reusable everywhere:
const { data, loading, error } = useFetch(url);
\`\`\`

---

## Building useFetch

This is the most canonical custom hook example. Let's build it properly:

\`\`\`tsx
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        return response.json() as Promise<T>;
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setState({ data: null, loading: false, error: err.message });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage in any component:
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch<User>(\`/api/users/\${userId}\`);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <UserCard user={user!} />;
}
\`\`\`

---

## Essential Custom Hooks Library

These are the hooks you will build or use on every real project:

### useLocalStorage

\`\`\`tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setAndPersist = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof newValue === 'function'
        ? (newValue as (p: T) => T)(prev)
        : newValue;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [value, setAndPersist] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark');
const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
\`\`\`

### useDebounce

\`\`\`tsx
function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer); // Cleanup cancels pending timer
  }, [value, delayMs]);

  return debouncedValue;
}

// Usage — search only fires after user stops typing for 300ms
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
\`\`\`

### useWindowSize

\`\`\`tsx
interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}
\`\`\`

### useOnClickOutside

\`\`\`tsx
function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    }
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Usage — close dropdown when clicking outside
function Dropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setOpen(o => !o)}>Menu</button>
      {open && <ul>{/* items */}</ul>}
    </div>
  );
}
\`\`\`

### useAsync

\`\`\`tsx
interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: string | null;
}

function useAsync<T>(asyncFn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'pending', data: null, error: null });

    asyncFn()
      .then(data => {
        if (!cancelled) setState({ status: 'success', data, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ status: 'error', data: null, error: err.message });
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

// Usage
function UserPage({ userId }) {
  const { status, data: user, error } = useAsync(
    () => fetchUser(userId),
    [userId]
  );

  if (status === 'pending') return <Spinner />;
  if (status === 'error') return <Error message={error} />;
  if (status === 'success') return <UserCard user={user!} />;
  return null;
}
\`\`\`

---

## Composing Custom Hooks

Custom hooks can call other custom hooks — this is how you build powerful abstractions:

\`\`\`tsx
// Lower-level hook
function useLocalStorage<T>(key: string, initial: T) { /* ... */ }

// Higher-level hook that uses the lower-level one
function useUserPreferences() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
  const [language, setLanguage] = useLocalStorage<string>('language', 'en');
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar', true);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  return {
    theme,
    language,
    sidebarOpen,
    toggleTheme,
    setLanguage,
    setSidebarOpen,
  };
}

// Component is clean and reads like English
function Settings() {
  const { theme, toggleTheme, language, setLanguage } = useUserPreferences();

  return (
    <div>
      <button onClick={toggleTheme}>{theme} mode</button>
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  );
}
\`\`\`

---

## Custom Hooks vs Regular Utilities

Custom hooks must call at least one React hook. If your extracted logic does not use any hooks, it is a regular utility function — not a custom hook.

\`\`\`tsx
// Regular utility — no hooks, no "use" prefix needed
function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency })
    .format(amount);
}

// Custom hook — uses useState and useEffect
function useExchangeRate(currency: string) {
  const [rate, setRate] = useState(1);
  useEffect(() => {
    fetchExchangeRate(currency).then(setRate);
  }, [currency]);
  return rate;
}
\`\`\`

---

## Custom Hook Best Practices

1. **Name with \`use\` prefix** — required for React's lint rules and DevTools
2. **Return an object for multiple values** — easier to destructure selectively
3. **Keep hooks focused** — one responsibility per hook
4. **Accept configuration as parameters** — makes hooks reusable in different contexts
5. **Handle loading/error states** — especially for async operations
6. **Include cleanup** — anything you set up, tear down in the cleanup`,

  codeExamples: [
    {
      title: 'useForm — a complete form management hook',
      code: `type Validator<T> = (value: T) => string | null;
type Validators<T> = Partial<Record<keyof T, Validator<T[keyof T]>>>;

function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validators?: Validators<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Validate on change if field was already touched
    if (touched[name] && validators?.[name]) {
      const error = validators[name]!(value);
      setErrors(prev => ({ ...prev, [name]: error ?? undefined }));
    }
  }, [touched, validators]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validators?.[name]) {
      const error = validators[name]!(values[name]);
      setErrors(prev => ({ ...prev, [name]: error ?? undefined }));
    }
  }, [values, validators]);

  const validate = useCallback(() => {
    if (!validators) return true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    for (const key in validators) {
      const error = validators[key]!(values[key]);
      if (error) newErrors[key] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validators]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) =>
      async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, validate]
  );

  return { values, errors, touched, isSubmitting, setValue, handleBlur, handleSubmit };
}

// Usage
function RegistrationForm() {
  const { values, errors, touched, isSubmitting, setValue, handleBlur, handleSubmit } = useForm(
    { email: '', password: '', name: '' },
    {
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string) ? null : 'Invalid email',
      password: (v) => (v as string).length >= 8 ? null : 'Min 8 characters',
      name: (v) => (v as string).trim() ? null : 'Name is required',
    }
  );

  return (
    <form onSubmit={handleSubmit(async (data) => { await registerUser(data); })}>
      <input
        value={values.name}
        onChange={e => setValue('name', e.target.value)}
        onBlur={() => handleBlur('name')}
      />
      {touched.name && errors.name && <span>{errors.name}</span>}
      {/* ... other fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}`,
      explanation:
        'This custom hook encapsulates the entire form management lifecycle: values, errors, touched state, validation, and submit handling. A component using it only deals with the data API — all the repetitive form plumbing is hidden in the hook.',
    },
  ],

  commonMistakes: [
    'Not starting the name with "use" — React\'s lint rules and DevTools require this.',
    'Putting hooks in non-hook helper functions — breaks the rules of hooks.',
    'Not handling cleanup in hooks that set up subscriptions or event listeners.',
    'Making hooks too generic too early — build for the specific use case first, generalize when you have multiple use cases.',
    'Returning primitives for multiple values — return an object so consumers can destructure only what they need.',
  ],

  interviewQuestions: [
    {
      question: 'What is a custom hook and why would you create one?',
      answer:
        'A custom hook is a function starting with "use" that calls other hooks. Create one when you find yourself: (1) duplicating the same useState + useEffect combination in multiple components; (2) wanting to share stateful logic between components without restructuring the tree; (3) wanting to separate a component\'s data concerns from its rendering concerns. Custom hooks do not share state between components — each component that calls a custom hook gets its own isolated state.',
      difficulty: 'intermediate',
    },
    {
      question: 'Do custom hooks share state between components that use them?',
      answer:
        'No. Each component that calls a custom hook gets its own isolated copy of the state and effects. Two components both using useCounter() each have independent count values. Custom hooks share LOGIC, not state. If you want multiple components to share the same state, use Context, a state management library, or lift the state to a common parent.',
      difficulty: 'intermediate',
      tip: 'This is a very common interview misconception.',
    },
  ],

  exercises: [
    {
      id: 'custom-hooks-ex-1',
      title: 'Build useMediaQuery',
      description: 'Build a hook that returns whether a CSS media query matches. Should update reactively when the viewport changes.',
      starterCode: `// Build useMediaQuery
// useMediaQuery('(max-width: 768px)') → true on mobile
// Should update when viewport size changes

function useMediaQuery(query: string): boolean {
  // TODO: implement
  return false;
}

// Test:
function Layout({ children }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <MobileLayout>{children}</MobileLayout> : <DesktopLayout>{children}</DesktopLayout>;
}`,
      solution: `function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches); // Sync on dependency change

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}`,
      hints: [
        'window.matchMedia(query) returns a MediaQueryList object',
        'MediaQueryList has a matches property and a change event',
        'Initialize with the current match status using lazy init in useState',
        'Clean up the event listener on unmount',
      ],
    },
  ],

  keyTakeaways: [
    'Custom hooks are functions starting with "use" that call other hooks. They share LOGIC, not state.',
    'Each component calling a custom hook gets its own independent state instance.',
    'Build custom hooks when you duplicate stateful logic across components.',
    'Custom hooks can call other custom hooks — enabling powerful layered abstractions.',
    'The must-have hooks library: useFetch, useLocalStorage, useDebounce, useWindowSize, useOnClickOutside.',
    'If the logic doesn\'t use any hooks, it\'s a utility function — not a custom hook.',
  ],

  nextLesson: 'forms',
  prevLesson: 'use-callback',
};
