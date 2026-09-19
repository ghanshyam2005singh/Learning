import type { Lesson } from '@/types';

export const performanceLesson: Lesson = {
  id: 'performance-optimization',
  slug: 'performance-optimization',
  title: 'Performance Optimization',
  description:
    'One of the most important modules. Master React.memo, memoization hooks, lazy loading, code splitting, render optimization, and the React Profiler — with a measure-first mindset.',
  category: 'Performance',
  order: 20,
  difficulty: 'advanced',
  estimatedTime: 40,
  content: `Performance optimization in React is a nuanced topic. The biggest mistake developers make is optimizing before measuring. This module teaches you to identify real bottlenecks, then apply the right optimization.

**The golden rule:** Write clear, correct code first. Measure second. Optimize only where you measure a problem.

---

## Understanding React's Performance Model

React is fast by default. Re-renders are cheap — calling a function is fast. DOM updates are expensive — writing to the DOM is slow.

React's job is to minimize DOM writes. It does this via the Virtual DOM diff. Your optimization job is to minimize unnecessary re-renders.

**A re-render is a problem when:**
1. The component is expensive to render (complex calculations, large DOM)
2. The re-render triggers expensive children to re-render
3. It happens too frequently (scroll events, animation frames)

**A re-render is NOT a problem when:**
- The component is cheap to render
- The result is the same (React bails out of DOM updates anyway)

---

## Tool 1: React.memo

\`React.memo\` wraps a component and memoizes its rendered output. React skips re-rendering the component if its props have not changed.

\`\`\`tsx
// WITHOUT memo — re-renders whenever parent re-renders
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <span>\${product.price}</span>
    </div>
  );
}

// WITH memo — only re-renders when product prop changes
const ProductCard = React.memo(function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <span>\${product.price}</span>
    </div>
  );
});
\`\`\`

**When to use React.memo:**
- The component renders frequently
- The component is expensive to render
- Props usually do not change between parent re-renders

**When NOT to use React.memo:**
- The component always receives new props (waste of comparison overhead)
- The component is trivially cheap to render
- You haven't measured a performance problem

**React.memo with a custom comparator:**
\`\`\`tsx
const ProductCard = React.memo(
  function ProductCard({ product }) { /* ... */ },
  (prevProps, nextProps) => {
    // Return true if component should NOT re-render
    return prevProps.product.id === nextProps.product.id &&
           prevProps.product.price === nextProps.product.price;
  }
);
\`\`\`

---

## Tool 2: Lazy Loading + Code Splitting

By default, your entire app is in one JavaScript bundle. For large apps, this means a slow initial load.

Code splitting lets you split the bundle into chunks that load on demand.

\`\`\`tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy pages — only download when the route is visited
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const UserManagement = lazy(() => import('./pages/UserManagement'));

function App() {
  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
\`\`\`

**Suspense** shows the fallback while the lazy component loads. Without Suspense, lazy components throw an error.

### Lazy Loading Heavy Components

\`\`\`tsx
// Lazy load components that are not needed on initial render
const Chart = lazy(() => import('./components/Chart'));
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

function PostEditor({ post }) {
  return (
    <div>
      <Suspense fallback={<div>Loading editor...</div>}>
        <RichTextEditor content={post.content} onChange={handleChange} />
      </Suspense>
    </div>
  );
}
\`\`\`

---

## Tool 3: Virtualizing Long Lists

Rendering 10,000 list items means 10,000 DOM nodes. The browser cannot handle this efficiently.

**Virtualization** renders only the visible items — items outside the viewport are not rendered.

\`\`\`tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Estimated row height in px
  });

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: \`\${virtualizer.getTotalSize()}px\`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
              width: '100%',
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

**Libraries:** \`@tanstack/react-virtual\` (modern), \`react-window\`, \`react-virtualized\`

**When to virtualize:** Lists with more than ~100 items, or any list where scrolling is sluggish.

---

## Tool 4: Avoiding Expensive Re-renders

### Move State Down

If only part of the component needs to update, extract it into a separate component:

\`\`\`tsx
// ❌ Entire Dashboard re-renders on every cursor position change
function Dashboard() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setCursorPos({ x: e.clientX, y: e.clientY })}>
      <ExpensiveChart data={largeDataset} />  {/* Re-renders on every mouse move! */}
      <ExpensiveTable data={largeDataset} />  {/* Same! */}
      <CursorDisplay pos={cursorPos} />
    </div>
  );
}

// ✅ Move cursor state to its own component
function CursorTracker() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setCursorPos({ x: e.clientX, y: e.clientY })}>
      <CursorDisplay pos={cursorPos} />
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <ExpensiveChart data={largeDataset} />  {/* Never re-renders due to cursor */}
      <ExpensiveTable data={largeDataset} />
      <CursorTracker />                        {/* Only this re-renders */}
    </div>
  );
}
\`\`\`

### Lift Content Up (Children Trick)

\`\`\`tsx
// ❌ Expensive children re-render on every parent re-render
function ScrollTracker() {
  const [scroll, setScroll] = useState(0);
  return (
    <div onScroll={e => setScroll(e.currentTarget.scrollTop)}>
      <ExpensiveContent /> {/* Re-renders on every scroll event! */}
    </div>
  );
}

// ✅ Pass children from outside — children created by the parent do NOT re-render
// when the ScrollTracker re-renders
function ScrollTracker({ children }: { children: React.ReactNode }) {
  const [scroll, setScroll] = useState(0);
  return (
    <div onScroll={e => setScroll(e.currentTarget.scrollTop)}>
      {children} {/* Reference stable — doesn't re-render */}
    </div>
  );
}

function App() {
  return (
    <ScrollTracker>
      <ExpensiveContent /> {/* Not re-rendered by scroll events! */}
    </ScrollTracker>
  );
}
\`\`\`

---

## Tool 5: The React Profiler

The React DevTools Profiler is the most important performance tool. Use it to find actual bottlenecks before optimizing.

**How to use:**
1. Open React DevTools → Profiler tab
2. Click Record
3. Interact with the UI (click, type, scroll)
4. Stop recording
5. Look for: components with long render times, components that rendered when they shouldn't have

**What to look for:**
- Components with bright bars (long render times)
- Components with yellow/orange highlights (re-rendered due to parent, props unchanged)
- Commit counts (number of times React updated the DOM)

\`\`\`tsx
// Adding Profiler programmatically for production monitoring
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  if (actualDuration > 16) { // More than one frame (60fps = 16ms per frame)
    console.warn(\`Slow render: \${id} took \${actualDuration.toFixed(2)}ms in \${phase} phase\`);
  }
}

<Profiler id="ProductList" onRender={onRenderCallback}>
  <ProductList products={products} />
</Profiler>
\`\`\`

---

## Bundle Optimization

- **Tree shaking:** Import only what you use: \`import { Button } from 'components'\` not \`import Components from 'components'\`
- **Analyze bundle:** Use \`vite-bundle-visualizer\` or \`webpack-bundle-analyzer\` to see what is large
- **Lazy load images:** Use \`loading="lazy"\` on img tags
- **Preload critical assets:** \`<link rel="preload">\` for fonts and critical images

---

## Optimization Checklist

Before optimizing, profile to confirm the problem. Then:

1. **Re-renders from context?** Split context or memoize context value
2. **Unnecessary child re-renders?** Add React.memo + useCallback/useMemo
3. **Long list performance?** Virtualize with @tanstack/react-virtual
4. **Slow initial load?** Lazy load routes and heavy components
5. **Expensive computation on every render?** useMemo
6. **Large bundle?** Code split routes, lazy load heavy third-party libraries`,

  codeExamples: [
    {
      title: 'Complete optimization example — large data table',
      code: `// Scenario: A data table with 500 rows that filters/sorts
// Problem: Every keystroke in the search causes the entire table to re-render

// Row component — memoized since it renders often
const TableRow = React.memo(function TableRow({
  row,
  onSelect,
  isSelected,
}: {
  row: DataRow;
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  return (
    <tr className={isSelected ? 'selected' : ''}>
      <td><input type="checkbox" checked={isSelected} onChange={() => onSelect(row.id)} /></td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>\${row.revenue.toLocaleString()}</td>
    </tr>
  );
});

function DataTable({ data }: { data: DataRow[] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof DataRow>('name');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Memoize expensive filter + sort
  const visibleRows = useMemo(() => {
    return data
      .filter(row => row.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => String(a[sortBy]).localeCompare(String(b[sortBy])));
  }, [data, search, sortBy]);

  // Stable callback reference — won't cause TableRow re-renders
  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      <table>
        <tbody>
          {visibleRows.map(row => (
            <TableRow
              key={row.id}
              row={row}
              onSelect={handleSelect}    // Stable — no TableRow re-render from this
              isSelected={selectedIds.has(row.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      explanation:
        'Three layers of optimization: (1) React.memo on TableRow prevents individual rows from re-rendering when other rows change; (2) useMemo on visibleRows only re-filters/sorts when data, search, or sortBy changes; (3) useCallback on handleSelect gives TableRow a stable callback reference.',
    },
  ],

  commonMistakes: [
    'Optimizing without measuring — adding useMemo and React.memo everywhere creates noise without fixing real problems.',
    'Using React.memo on cheap components — comparison overhead exceeds render time.',
    'React.memo without stable callbacks — React.memo is useless if function props change every render.',
    'Not virtualizing large lists — rendering thousands of DOM nodes causes poor scroll performance.',
    'Over-splitting code — too many chunks create too many network requests (overhead exceeds savings).',
  ],

  interviewQuestions: [
    {
      question: 'What is React.memo and when should you use it?',
      answer:
        'React.memo is a higher-order component that memoizes the rendered output of a component. React skips re-rendering if props have not changed (shallow comparison). Use it when: the component renders frequently with the same props, the component is expensive to render, and you have confirmed a performance problem with the Profiler. Do not use it for trivially cheap components — comparison overhead may exceed render cost.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is code splitting and how does React support it?',
      answer:
        'Code splitting breaks the JavaScript bundle into smaller chunks that load on demand. React supports it with React.lazy() and Suspense. React.lazy(() => import(\'./Component\')) creates a dynamically imported component. Suspense provides a fallback while the chunk loads. Use it for: route-level splitting (each page loads its own chunk), heavy components (chart libraries, rich text editors, video players) that are not needed on initial render.',
      difficulty: 'intermediate',
    },
    {
      question: 'How would you optimize a list of 10,000 items in React?',
      answer:
        'Render 10,000 DOM nodes is inherently slow — the browser cannot handle it. Solutions: (1) Virtualization with @tanstack/react-virtual — only render the ~20 visible items at any time, the rest are simulated with height; (2) Pagination — show only 10-20 items per page, load next page on navigation; (3) Infinite scroll with windowing — load pages as user scrolls, unload off-screen pages. For most cases, virtualization gives the best UX while handling any list size.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'perf-ex-1',
      title: 'Profile and Fix a Re-render Problem',
      description: 'This component has unnecessary re-renders. The Header should not re-render when the count changes. Fix it.',
      starterCode: `function Header({ title, onMenuClick }) {
  console.log('Header rendered'); // Should only render once on mount
  return (
    <header>
      <h1>{title}</h1>
      <button onClick={onMenuClick}>Menu</button>
    </header>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Problem: these props are recreated every render
  const title = "My App";
  const handleMenuClick = () => setMenuOpen(m => !m);

  return (
    <div>
      <Header title={title} onMenuClick={handleMenuClick} />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {menuOpen && <nav>Menu</nav>}
    </div>
  );
}`,
      solution: `// Fix: Memoize Header and stabilize its props
const Header = React.memo(function Header({ title, onMenuClick }) {
  console.log('Header rendered');
  return (
    <header>
      <h1>{title}</h1>
      <button onClick={onMenuClick}>Menu</button>
    </header>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // title is a constant — React.memo sees the same string reference
  const title = "My App";

  // useCallback stabilizes the function reference
  const handleMenuClick = useCallback(() => setMenuOpen(m => !m), []);

  return (
    <div>
      <Header title={title} onMenuClick={handleMenuClick} />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {menuOpen && <nav>Menu</nav>}
    </div>
  );
}

// Now: clicking the counter button updates count state
// → App re-renders → Header receives same props → React.memo skips Header`,
      hints: [
        'Wrap Header in React.memo',
        'Wrap handleMenuClick in useCallback',
        'title is a string literal — React.memo can compare it correctly',
      ],
    },
  ],

  keyTakeaways: [
    'Measure before optimizing — use the React Profiler to identify real bottlenecks.',
    'React.memo prevents re-renders when props haven\'t changed. Requires stable props (useCallback/useMemo).',
    'Code splitting with lazy() + Suspense reduces initial bundle size by loading code on demand.',
    'Virtualize lists with more than ~100 items — never render 1000+ DOM nodes simultaneously.',
    'Move state down and pass children from outside to prevent expensive components from re-rendering.',
    'useMemo for expensive computations, useCallback for stable callbacks passed to memoized children.',
  ],

  nextLesson: 'error-handling',
  prevLesson: 'component-patterns',
};
