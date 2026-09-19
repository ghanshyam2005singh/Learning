import type { Lesson } from '@/types';

export const componentPatternsLesson: Lesson = {
  id: 'component-patterns',
  slug: 'component-patterns',
  title: 'Component Patterns',
  description:
    'Master advanced React component patterns — Compound Components, Render Props, Higher-Order Components, Controlled Patterns, and Headless Components used in real libraries.',
  category: 'Patterns',
  order: 19,
  difficulty: 'advanced',
  estimatedTime: 35,
  content: `Advanced component patterns let you build highly flexible, reusable components. These patterns appear in every major React library — Radix UI, Headless UI, React Table, React Hook Form. Understanding them helps you both use these libraries and build your own.

---

## Compound Components

A compound component is a set of components that work together to form a complete UI. They share implicit state via context and provide a declarative API.

Classic HTML analogy: \`<select>\` and \`<option>\` are compound components. They share state implicitly.

\`\`\`tsx
// Building an Accordion compound component
interface AccordionContextType {
  openItemId: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Must be used inside Accordion');
  return ctx;
}

// Root component — owns state, provides context
function Accordion({ children, defaultOpen = null }: {
  children: React.ReactNode;
  defaultOpen?: string | null;
}) {
  const [openItemId, setOpenItemId] = useState<string | null>(defaultOpen);

  const toggle = (id: string) => setOpenItemId(prev => prev === id ? null : id);

  return (
    <AccordionContext.Provider value={{ openItemId, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

// Sub-components consume context
function AccordionItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { openItemId } = useAccordion();
  return (
    <div className={\`accordion-item \${openItemId === id ? 'open' : ''}\`}>
      {children}
    </div>
  );
}

function AccordionTrigger({ itemId, children }: { itemId: string; children: React.ReactNode }) {
  const { toggle, openItemId } = useAccordion();
  return (
    <button
      className="accordion-trigger"
      onClick={() => toggle(itemId)}
      aria-expanded={openItemId === itemId}
    >
      {children}
    </button>
  );
}

function AccordionContent({ itemId, children }: { itemId: string; children: React.ReactNode }) {
  const { openItemId } = useAccordion();
  if (openItemId !== itemId) return null;
  return <div className="accordion-content">{children}</div>;
}

// Attach sub-components to root (namespace pattern)
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

// Usage — clean, declarative API
function FAQ() {
  return (
    <Accordion defaultOpen="item-1">
      <Accordion.Item id="item-1">
        <Accordion.Trigger itemId="item-1">What is React?</Accordion.Trigger>
        <Accordion.Content itemId="item-1">
          React is a JavaScript library for building user interfaces.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item id="item-2">
        <Accordion.Trigger itemId="item-2">What are hooks?</Accordion.Trigger>
        <Accordion.Content itemId="item-2">
          Hooks are functions that let functional components use React features.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
\`\`\`

**Why compound components:** The user controls the structure and can insert other elements between sub-components. The internal state management is hidden. This is how Radix UI, Headless UI, and most serious component libraries work.

---

## Render Props

Render props pass a function as a prop. The component calls this function to render, passing internal state as arguments. This gives the consumer full control over rendering.

\`\`\`tsx
// MouseTracker with render prop
interface MousePosition {
  x: number;
  y: number;
}

function MouseTracker({
  render,
}: {
  render: (position: MousePosition) => React.ReactNode;
}) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent) {
    setPosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <div style={{ height: '100vh' }} onMouseMove={handleMouseMove}>
      {render(position)} {/* Call the render function with current state */}
    </div>
  );
}

// Usage — consumer decides how to render the position
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          <h1>Mouse at ({x}, {y})</h1>
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 10,
              height: 10,
              background: 'red',
              borderRadius: '50%',
            }}
          />
        </div>
      )}
    />
  );
}
\`\`\`

**Children as function** is a popular variant:
\`\`\`tsx
// Same concept, using children instead of render prop
function MouseTracker({ children }: { children: (pos: MousePosition) => React.ReactNode }) {
  // ...same implementation
  return <div onMouseMove={...}>{children(position)}</div>;
}

// Usage:
<MouseTracker>
  {({ x, y }) => <h1>({x}, {y})</h1>}
</MouseTracker>
\`\`\`

**Note:** Render props are largely replaced by custom hooks in modern React. \`useMousePosition()\` hook achieves the same reuse more cleanly. But render props are still used in libraries for component-level flexibility.

---

## Higher-Order Components (HOC)

A Higher-Order Component is a function that takes a component and returns a new, enhanced component.

\`\`\`tsx
// HOC: withAuth — protects a component, redirects if not authenticated
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;

    return <WrappedComponent {...props} />;
  };
}

// Usage
function Dashboard() {
  return <div>Secret dashboard content</div>;
}

export default withAuth(Dashboard); // Protected Dashboard

// HOC: withErrorBoundary
function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error }>
) {
  return class WithErrorBoundary extends React.Component<P, { error: Error | null }> {
    state = { error: null };
    static getDerivedStateFromError(error: Error) {
      return { error };
    }
    render() {
      if (this.state.error) return <FallbackComponent error={this.state.error} />;
      return <WrappedComponent {...this.props} />;
    }
  };
}
\`\`\`

**Note:** HOCs are largely replaced by custom hooks and direct component wrapping. They add a layer to the component tree and can cause "wrapper hell." Use them when working with class components or libraries that require them (e.g., error boundaries must be class components).

---

## Controlled Component Pattern

You have seen controlled inputs. The same pattern applies to custom components — the parent controls the state:

\`\`\`tsx
// Uncontrolled (internal state) — parent cannot control it
function Tabs({ defaultTab = 0 }: { defaultTab?: number }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  // Parent has no control over active tab
}

// Controlled (external state) — parent can control it
interface ControlledTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  children: React.ReactNode;
}

function Tabs({ activeTab, onTabChange, children }: ControlledTabsProps) {
  // activeTab comes from parent — parent is in full control
}

// Uncontrolled + Controlled (both modes supported)
interface TabsProps {
  defaultTab?: number;  // Uncontrolled: initial state
  activeTab?: number;   // Controlled: external state
  onTabChange?: (tab: number) => void;
}

function Tabs({ defaultTab = 0, activeTab: controlledTab, onTabChange }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab);
  const isControlled = controlledTab !== undefined;
  const activeTab = isControlled ? controlledTab : internalTab;

  function handleTabChange(tab: number) {
    if (!isControlled) setInternalTab(tab);
    onTabChange?.(tab);
  }

  // ...render tabs using activeTab
}

// Usage as uncontrolled (simpler):
<Tabs defaultTab={0} onTabChange={tab => analytics.track(tab)}>
  {/* ... */}
</Tabs>

// Usage as controlled (full control):
<Tabs activeTab={tab} onTabChange={setTab}>
  {/* ... */}
</Tabs>
\`\`\`

This dual-mode pattern is used in most serious component libraries (Radix, React Aria).

---

## Headless Components

A headless component provides **behavior and accessibility** without any visual styling. The consumer provides the UI.

\`\`\`tsx
// Headless Toggle — provides behavior, you provide the UI
function useToggle(initialState = false) {
  const [isOn, setIsOn] = useState(initialState);
  const toggle = useCallback(() => setIsOn(s => !s), []);
  const turnOn = useCallback(() => setIsOn(true), []);
  const turnOff = useCallback(() => setIsOn(false), []);
  return { isOn, toggle, turnOn, turnOff };
}

// Headless Listbox — keyboard navigation, ARIA, selection — no styles
function useListbox<T>({ options, onChange }: { options: T[]; onChange: (value: T) => void }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') setSelectedIndex(i => Math.min(i + 1, options.length - 1));
    if (e.key === 'ArrowUp') setSelectedIndex(i => Math.max(i - 1, 0));
    if (e.key === 'Enter') { onChange(options[selectedIndex]); setIsOpen(false); }
    if (e.key === 'Escape') setIsOpen(false);
  }

  return { isOpen, setIsOpen, selectedIndex, handleKeyDown, selectedValue: options[selectedIndex] };
}

// Consumer styles it however they want
function MyCustomDropdown({ options, value, onChange }) {
  const { isOpen, setIsOpen, selectedIndex, handleKeyDown } = useListbox({ options, onChange });

  return (
    <div className="my-dropdown" onKeyDown={handleKeyDown}>
      <button
        className="my-dropdown-trigger"
        onClick={() => setIsOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value ?? 'Select...'}
      </button>
      {isOpen && (
        <ul role="listbox" className="my-dropdown-list">
          {options.map((opt, i) => (
            <li
              key={String(opt)}
              role="option"
              aria-selected={i === selectedIndex}
              className={\`option \${i === selectedIndex ? 'active' : ''}\`}
              onClick={() => onChange(opt)}
            >
              {String(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
\`\`\`

**Real headless libraries:** Radix UI, Headless UI (Tailwind Labs), React Aria (Adobe), React Table (TanStack). These libraries give you accessibility and behavior; you write the styles.`,

  codeExamples: [
    {
      title: 'Compound component — Select',
      code: `// A typed Select component using compound pattern
interface SelectContextType<T> {
  value: T | null;
  onChange: (value: T) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType<unknown> | null>(null);

function Select<T>({
  value,
  onChange,
  children,
}: {
  value: T | null;
  onChange: (value: T) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <SelectContext.Provider value={{ value, onChange: onChange as (v: unknown) => void, open, setOpen }}>
      <div ref={ref} className="select">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children }: { children: React.ReactNode }) {
  const { open, setOpen, value } = useContext(SelectContext)!;
  return (
    <button onClick={() => setOpen(!open)} aria-expanded={open} className="select-trigger">
      {value !== null ? String(value) : children}
      <span>{open ? '▲' : '▼'}</span>
    </button>
  );
}

function SelectItem<T>({ value, children }: { value: T; children: React.ReactNode }) {
  const ctx = useContext(SelectContext)!;
  return (
    <li
      role="option"
      className={\`select-item \${ctx.value === value ? 'selected' : ''}\`}
      onClick={() => { ctx.onChange(value); ctx.setOpen(false); }}
    >
      {children}
    </li>
  );
}

Select.Trigger = SelectTrigger;
Select.Item = SelectItem;

// Usage
<Select value={country} onChange={setCountry}>
  <Select.Trigger>Select country</Select.Trigger>
  <Select.Item value="US">United States</Select.Item>
  <Select.Item value="UK">United Kingdom</Select.Item>
  <Select.Item value="CA">Canada</Select.Item>
</Select>`,
      explanation:
        'The compound pattern here separates the trigger, items, and state management. The consumer decides the order and content of items. The Select root component handles state invisibly.',
    },
  ],

  commonMistakes: [
    'Using HOCs when custom hooks would be cleaner — hooks are simpler and avoid wrapper hell.',
    'Building controlled-only components — force consumers to manage all state even for simple cases.',
    'Overcomplicating simple components with patterns — not every button needs compound component treatment.',
    'Missing accessibility in custom components — headless libraries solve this; building from scratch requires deep ARIA knowledge.',
  ],

  interviewQuestions: [
    {
      question: 'What is the compound component pattern and why use it?',
      answer:
        'Compound components are a set of components that share implicit state via context and work together to form a UI. Like HTML\'s <select> and <option>. The consumer assembles the components in JSX and has full control over structure and content. Internal state is hidden. This enables open/closed principle design — the accordion or select works without modification, but consumers can add elements, change ordering, or insert custom content between sub-components. Used extensively in Radix UI and Headless UI.',
      difficulty: 'advanced',
    },
    {
      question: 'What are render props and when would you use them over custom hooks?',
      answer:
        'Render props pass a function as a prop. The component calls this function to render, passing internal state. They were the primary code-sharing pattern before hooks. Today, custom hooks are preferred for sharing logic between components. Use render props when: (1) you need component-level (not just logic) sharing — the render function returns JSX so consumers can control rendering; (2) working with older codebases or libraries that use this pattern; (3) you need to inject components at specific positions within a rendered tree.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'patterns-ex-1',
      title: 'Build a Controlled + Uncontrolled Toggle',
      description: 'Build a Toggle component that works both as uncontrolled (manages own state) and controlled (parent manages state).',
      starterCode: `interface ToggleProps {
  defaultOn?: boolean;  // Uncontrolled default
  on?: boolean;         // Controlled value (if provided, component is controlled)
  onToggle?: (on: boolean) => void;
  children: (on: boolean, toggle: () => void) => React.ReactNode;
}

function Toggle({ defaultOn = false, on: controlledOn, onToggle, children }: ToggleProps) {
  // TODO: Support both modes
  // If controlledOn is provided, use it (controlled)
  // Otherwise use internal state (uncontrolled)
}`,
      solution: `function Toggle({ defaultOn = false, on: controlledOn, onToggle, children }: ToggleProps) {
  const [internalOn, setInternalOn] = useState(defaultOn);
  const isControlled = controlledOn !== undefined;
  const on = isControlled ? controlledOn : internalOn;

  function toggle() {
    const newOn = !on;
    if (!isControlled) setInternalOn(newOn);
    onToggle?.(newOn);
  }

  return <>{children(on, toggle)}</>;
}

// Uncontrolled usage:
<Toggle defaultOn={false} onToggle={v => analytics.track('toggle', v)}>
  {(on, toggle) => (
    <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
  )}
</Toggle>

// Controlled usage:
const [on, setOn] = useState(false);
<Toggle on={on} onToggle={setOn}>
  {(on, toggle) => (
    <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
  )}
</Toggle>`,
      hints: [
        'Check if controlledOn !== undefined to determine mode',
        'In controlled mode, do not update internal state',
        'Always call onToggle if provided — both modes should notify the parent',
      ],
    },
  ],

  keyTakeaways: [
    'Compound Components share implicit state via context — parent controls structure, sub-components handle behavior.',
    'Render Props pass rendering control to consumers via function props — mostly replaced by custom hooks.',
    'HOCs wrap components to add behavior — mostly replaced by hooks, still needed for error boundaries.',
    'Controlled component pattern: support both internal state (uncontrolled) and external state (controlled).',
    'Headless components provide behavior + accessibility without styles — the modern way to build UI libraries.',
    'These patterns appear in every serious React library — understanding them is required for advanced work.',
  ],

  nextLesson: 'performance-optimization',
  prevLesson: 'state-management',
};
