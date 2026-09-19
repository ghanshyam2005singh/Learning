import type { Lesson } from '@/types';

export const testingLesson: Lesson = {
  id: 'testing',
  slug: 'testing',
  title: 'Testing React Applications',
  description:
    'Test React components the right way — with React Testing Library, user interactions, mocking, integration tests, and the philosophy that guides good component tests.',
  category: 'Testing',
  order: 23,
  difficulty: 'intermediate',
  estimatedTime: 30,
  content: `Testing React components has a guiding philosophy from the React Testing Library: **test your components as users use them**, not implementation details.

---

## The Testing Philosophy

**Write tests that resemble how users interact with your app.**

\`\`\`
❌ "This component calls setCount when the button is clicked"
✅ "When the user clicks Increment, the count increases"

❌ "The internal state is { count: 1 } after click"
✅ "The screen shows '1' after clicking the button"
\`\`\`

This means:
- Query elements by accessible names, not class names or IDs
- Fire events the way users do (click, type, focus)
- Assert on what the user sees, not internal state

---

## Setup

\`\`\`bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
\`\`\`

\`\`\`ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});

// src/test/setup.ts
import '@testing-library/jest-dom';
\`\`\`

---

## Basic Component Test

\`\`\`tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('displays the initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  it('increments when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={0} />);

    await user.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('does not go below zero', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={0} />);

    await user.click(screen.getByRole('button', { name: /decrement/i }));

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});
\`\`\`

---

## Querying Elements

React Testing Library provides queries that match how users find elements:

\`\`\`tsx
// By role (preferred — most accessible-aware)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('heading', { level: 1 });
screen.getByRole('combobox', { name: /country/i });

// By label text
screen.getByLabelText(/password/i);

// By placeholder
screen.getByPlaceholderText(/search.../i);

// By text content
screen.getByText(/welcome/i);

// By test ID (last resort — avoid coupling to DOM structure)
screen.getByTestId('loading-spinner');

// Async queries (for elements that appear after async operations)
await screen.findByText(/loaded successfully/i);
await screen.findByRole('table');

// Query vs get vs find:
// getBy*  — throws if not found (synchronous)
// queryBy* — returns null if not found (synchronous, good for "not present" assertions)
// findBy*  — waits for element to appear (asynchronous)
\`\`\`

---

## Testing User Interactions

Always use \`@testing-library/user-event\` for realistic event simulation:

\`\`\`tsx
it('submits the form with entered data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /log in/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'alice@example.com',
    password: 'password123',
  });
});

it('shows validation error for empty email', async () => {
  const user = userEvent.setup();
  render(<LoginForm onSubmit={vi.fn()} />);

  // Submit without filling email
  await user.click(screen.getByRole('button', { name: /log in/i }));

  expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
});
\`\`\`

---

## Testing Async Operations

\`\`\`tsx
// Mock the API module
vi.mock('../api/users', () => ({
  fetchUser: vi.fn(),
}));

import { fetchUser } from '../api/users';

it('shows the user profile after loading', async () => {
  const mockUser = { id: '1', name: 'Alice', email: 'alice@example.com' };
  (fetchUser as vi.Mock).mockResolvedValue(mockUser);

  render(<UserProfile userId="1" />);

  // Loading state
  expect(screen.getByRole('status')).toHaveTextContent(/loading/i);

  // Wait for data to appear
  await screen.findByText('Alice');
  expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('shows error when fetch fails', async () => {
  (fetchUser as vi.Mock).mockRejectedValue(new Error('Network error'));

  render(<UserProfile userId="1" />);

  await screen.findByRole('alert');
  expect(screen.getByRole('alert')).toHaveTextContent('Network error');
});
\`\`\`

---

## Testing with Context

Wrap components that need context in test renders:

\`\`\`tsx
function renderWithAuth(ui: React.ReactElement, { user = null } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthContext.Provider value={{ user, isAuthenticated: !!user, login: vi.fn(), logout: vi.fn() }}>
        {children}
      </AuthContext.Provider>
    );
  }
  return render(ui, { wrapper: Wrapper });
}

it('shows user name when authenticated', () => {
  renderWithAuth(<Navbar />, {
    user: { id: '1', name: 'Alice', role: 'admin' },
  });
  expect(screen.getByText('Hello, Alice')).toBeInTheDocument();
});

it('shows login button when not authenticated', () => {
  renderWithAuth(<Navbar />);
  expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
});
\`\`\`

---

## Testing Hooks

Use \`renderHook\` to test custom hooks:

\`\`\`tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with the given value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('increments the count', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
\`\`\`

---

## Mocking

\`\`\`tsx
// Mock a module
vi.mock('../services/analytics', () => ({
  trackEvent: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();
(fetch as vi.Mock).mockResolvedValueOnce({
  ok: true,
  json: () => Promise.resolve({ data: [] }),
});

// Spy on a method
const spy = vi.spyOn(window, 'alert').mockImplementation(() => {});
// ...test code...
expect(spy).toHaveBeenCalledWith('Success!');

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
\`\`\`

---

## What to Test

\`\`\`
✅ Test:
- User interactions (clicks, typing, form submission)
- Rendered output for different props
- Loading, error, and success states
- Conditional rendering
- Accessibility (roles, labels, aria attributes)

❌ Don't test:
- Implementation details (internal state values, method calls)
- Third-party library behavior
- Simple prop pass-through components with no logic
- Exact CSS class names (fragile)
\`\`\``,

  codeExamples: [
    {
      title: 'Complete form test',
      code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    render(<ContactForm onSubmit={onSubmit} />);
  });

  it('renders all form fields', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Alice Smith');
    await user.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: 'Hello there!',
    });
  });

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    onSubmit.mockImplementation(() => new Promise(() => {})); // Never resolves

    await user.type(screen.getByLabelText(/name/i), 'Alice');
    await user.type(screen.getByLabelText(/email/i), 'alice@test.com');
    await user.type(screen.getByLabelText(/message/i), 'msg');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
  });
});`,
      explanation:
        'Each test focuses on user-visible behavior: form renders, valid submission calls onSubmit, empty submission shows errors, button disables while submitting. No test checks internal state values.',
    },
  ],

  commonMistakes: [
    'Using getByTestId for everything — couples tests to DOM structure. Use getByRole and getByLabelText.',
    'Testing implementation details (calling setState, internal state values) — brittle tests that break on refactors.',
    'Not using userEvent — fireEvent does not simulate real user behavior (focus, keyboard events). Use userEvent.',
    'Not waiting for async operations — missing await before findBy* leads to false positives.',
    'Not clearing mocks between tests — mock state leaks between tests causing flaky results.',
  ],

  interviewQuestions: [
    {
      question: 'What is React Testing Library\'s testing philosophy?',
      answer:
        'Test components as users use them, not implementation details. Query elements by accessible attributes (role, label text) not class names or IDs. Fire events the way users do. Assert on visible output. This approach writes tests that break when behavior changes but not when implementation changes, giving you confidence without coupling to internals.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is the difference between getBy, queryBy, and findBy queries?',
      answer:
        'getBy* — synchronous, throws if element not found. Use when the element must exist. queryBy* — synchronous, returns null if not found. Use for asserting an element is NOT present: expect(screen.queryByText(\'error\')).not.toBeInTheDocument(). findBy* — asynchronous, returns a promise that resolves when the element appears. Use for elements that appear after async operations (API calls, timers).',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'testing-ex-1',
      title: 'Write Tests for a Toggle Component',
      description: 'Write a complete test suite for a Toggle button that switches between "ON" and "OFF".',
      starterCode: `// Toggle.tsx
function Toggle({ onToggle }: { onToggle?: (on: boolean) => void }) {
  const [on, setOn] = useState(false);
  function handleClick() {
    const next = !on;
    setOn(next);
    onToggle?.(next);
  }
  return (
    <button onClick={handleClick} aria-pressed={on}>
      {on ? 'ON' : 'OFF'}
    </button>
  );
}

// Toggle.test.tsx — write tests here:
describe('Toggle', () => {
  // TODO: test initial state
  // TODO: test clicking toggles state
  // TODO: test clicking twice returns to off
  // TODO: test onToggle callback is called with correct value
});`,
      solution: `describe('Toggle', () => {
  it('shows OFF initially', () => {
    render(<Toggle />);
    expect(screen.getByRole('button', { name: 'OFF' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows ON after clicking', async () => {
    const user = userEvent.setup();
    render(<Toggle />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'ON' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('returns to OFF after clicking twice', async () => {
    const user = userEvent.setup();
    render(<Toggle />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'OFF' })).toBeInTheDocument();
  });

  it('calls onToggle with true on first click', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Toggle onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with false on second click', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<Toggle onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenLastCalledWith(false);
  });
});`,
      hints: [
        'Use getByRole("button", { name: "OFF" }) to find the button by its text',
        'aria-pressed attribute shows the toggle state',
        'userEvent.setup() creates a user instance; await user.click()',
        'vi.fn() creates a mock function; expect(fn).toHaveBeenCalledWith(value)',
      ],
    },
  ],

  keyTakeaways: [
    'Test what users see and do — not implementation details. If your test breaks on a refactor but not a behavior change, it\'s testing the wrong thing.',
    'Query by role, label, and text — not class names or test IDs. This tests accessibility and behavior together.',
    'Use @testing-library/user-event (not fireEvent) for realistic user interaction simulation.',
    'findBy* queries are asynchronous — await them for elements that appear after API calls.',
    'Mock API modules at the module level with vi.mock() — not fetch() — for cleaner, more maintainable mocks.',
    'Test loading states, error states, and success states separately.',
  ],

  nextLesson: 'scalable-architecture',
  prevLesson: 'react-router',
};
