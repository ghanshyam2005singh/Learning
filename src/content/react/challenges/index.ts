import type { Challenge } from '@/types';

export const reactChallenges: Challenge[] = [
  {
    id: 'react-counter-history',
    slug: 'counter-with-history',
    title: 'Counter with History',
    description: 'Build a counter that tracks its history and allows undoing the last action. The undo button should be disabled when there is nothing to undo.',
    difficulty: 'beginner',
    topic: 'State',
    starterCode: `function CounterWithHistory() {
  // TODO: Implement
  // - Increment (+1) and Decrement (-1) buttons
  // - Undo button that reverts the last action
  // - Display the count
  // - Undo button disabled when history is empty

  return <div>Implement me</div>;
}`,
    solution: `function CounterWithHistory() {
  const [history, setHistory] = useState<number[]>([0]);
  const count = history[history.length - 1];

  function increment() {
    setHistory(prev => [...prev, prev[prev.length - 1] + 1]);
  }

  function decrement() {
    setHistory(prev => [...prev, prev[prev.length - 1] - 1]);
  }

  function undo() {
    setHistory(prev => prev.slice(0, -1));
  }

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={undo} disabled={history.length <= 1}>
        Undo
      </button>
    </div>
  );
}`,
    hints: [
      'Store an array of values as history instead of just the current count',
      'The current count is the last element: history[history.length - 1]',
      'Undo removes the last element: history.slice(0, -1)',
      'Disabled when history.length <= 1 (only initial value remains)',
    ],
    explanation: 'Instead of storing just the count, store the entire history as an array. The current count is always the last element. Undo removes the last element, reverting to the previous value. This pattern (storing history as a stack) is the foundation of undo/redo in real editors.',
    tags: ['useState', 'state', 'arrays', 'beginner'],
  },
  {
    id: 'react-debounced-search',
    slug: 'debounced-search',
    title: 'Debounced Search Hook',
    description: 'Build a useDebounce hook that delays a value update until the user stops changing it. Then use it in a search component so the search only fires 500ms after typing stops.',
    difficulty: 'intermediate',
    topic: 'Custom Hooks',
    starterCode: `// Step 1: Implement the hook
function useDebounce<T>(value: T, delay: number): T {
  // Should return the debounced value
  // Updates only after 'delay' ms of no changes
}

// Step 2: Use it in a search component
function SearchComponent({ onSearch }: { onSearch: (query: string) => void }) {
  // Should show "Typing..." while debouncing
  // Should call onSearch only after user stops typing for 500ms
}`,
    solution: `function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(timer); // Cancel if value changes before delay
  }, [value, delay]);

  return debounced;
}

function SearchComponent({ onSearch }: { onSearch: (query: string) => void }) {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);
  const isDebouncing = input !== debouncedInput;

  useEffect(() => {
    if (debouncedInput) {
      onSearch(debouncedInput);
    }
  }, [debouncedInput, onSearch]);

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Search..."
      />
      {isDebouncing && <span>Typing...</span>}
    </div>
  );
}`,
    hints: [
      'useDebounce needs useState to store the debounced value',
      'useEffect with setTimeout — update the debounced value after the delay',
      'The cleanup function (return) cancels the previous timer when value changes',
      'Compare input vs debouncedInput to know if still debouncing',
    ],
    explanation: 'The key insight: every time value changes, we set a new timer. If value changes again before the timer fires, the cleanup cancels the previous timer. Only when the user stops changing the value does the timer complete and the debounced value update. This prevents API calls on every keystroke.',
    tags: ['useEffect', 'custom-hooks', 'debounce', 'intermediate'],
  },
  {
    id: 'react-infinite-scroll',
    slug: 'infinite-scroll',
    title: 'Infinite Scroll with IntersectionObserver',
    description: 'Build a list that loads more items when the user scrolls to the bottom. Use IntersectionObserver to detect when a sentinel element enters the viewport — no scroll event listeners.',
    difficulty: 'advanced',
    topic: 'Custom Hooks',
    starterCode: `// Step 1: Build a hook that returns [ref, isVisible]
function useIntersectionObserver(): [React.RefObject<HTMLDivElement>, boolean] {
  // Should return a ref to attach to the sentinel element
  // And a boolean indicating if the sentinel is currently visible
}

// Step 2: Use it for infinite scroll
function InfiniteList() {
  const [items, setItems] = useState<number[]>(
    Array.from({ length: 20 }, (_, i) => i)
  );
  // Load 20 more items when sentinel becomes visible
}`,
    solution: `function useIntersectionObserver(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

function InfiniteList() {
  const [items, setItems] = useState<number[]>(
    Array.from({ length: 20 }, (_, i) => i)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sentinelRef, isSentinelVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isSentinelVisible || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setItems(prev => [
        ...prev,
        ...Array.from({ length: 20 }, (_, i) => prev.length + i),
      ]);
      setIsLoading(false);
    }, 500);
  }, [isSentinelVisible, isLoading]);

  return (
    <div style={{ height: '400px', overflowY: 'auto' }}>
      {items.map(item => (
        <div key={item} style={{ padding: 16, borderBottom: '1px solid #333' }}>
          Item {item}
        </div>
      ))}
      <div ref={sentinelRef}>
        {isLoading ? 'Loading more...' : ''}
      </div>
    </div>
  );
}`,
    hints: [
      'IntersectionObserver fires a callback when the target enters/leaves the viewport',
      'Disconnect the observer in the cleanup function',
      'Place the sentinel div at the bottom of the list — it triggers loading when visible',
      'Guard with isLoading to prevent multiple simultaneous loads',
    ],
    explanation: 'IntersectionObserver is more efficient than scroll event listeners — it fires only when visibility changes. The sentinel is an empty div at the list bottom. When it scrolls into view, the observer fires, and we load more items. The isLoading guard prevents multiple fetches from triggering simultaneously.',
    tags: ['useEffect', 'useRef', 'custom-hooks', 'IntersectionObserver', 'advanced'],
  },
  {
    id: 'react-shopping-cart',
    slug: 'shopping-cart-context',
    title: 'Shopping Cart with Context',
    description: 'Build a shopping cart using React Context. The cart state should be accessible from any component — an Add to Cart button, a Cart Icon showing total items, and a Cart Page showing all items.',
    difficulty: 'intermediate',
    topic: 'Context',
    starterCode: `interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// TODO: Create CartContext and CartProvider
// TODO: Implement addItem, removeItem, clearCart
// TODO: Derived: totalItems (sum of quantities), totalPrice

function CartIcon() {
  // Should show: Cart (N) where N is total item count
}

function ProductCard({ product }: { product: { id: string; name: string; price: number } }) {
  // Should have an Add to Cart button
}`,
    solution: `interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, totalItems, totalPrice, addItem, removeItem, clearCart }),
    [items, totalItems, totalPrice, addItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function CartIcon() {
  const { totalItems } = useCart();
  return <div>Cart ({totalItems})</div>;
}

function ProductCard({ product }: { product: { id: string; name: string; price: number } }) {
  const { addItem } = useCart();
  return (
    <div>
      <p>{product.name} — \${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}`,
    hints: [
      'createContext with null default, check for null in the custom hook',
      'Wrap children in CartContext.Provider with the value',
      'Memoize the context value object — new object reference on every render causes all consumers to re-render',
      'Memoize callbacks with useCallback so they are stable references',
    ],
    explanation: 'Context avoids prop drilling — CartIcon and ProductCard both access the cart without passing props through every parent. The performance key: memoize the context value object and all functions, otherwise every state change creates a new object reference and re-renders all consumers.',
    tags: ['context', 'useContext', 'useMemo', 'useCallback', 'intermediate'],
  },
];
