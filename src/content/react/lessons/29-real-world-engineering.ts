import type { Lesson } from '@/types';

export const realWorldEngineeringLesson: Lesson = {
  id: 'real-world-engineering',
  slug: 'real-world-engineering',
  title: 'Real World Frontend Engineering',
  description:
    'Production-grade React practices — design systems, accessibility (a11y), security in React apps, code review standards, maintainability patterns, and team engineering culture.',
  category: 'Engineering',
  order: 29,
  difficulty: 'advanced',
  estimatedTime: 40,
  content: `Building a React app that works is one skill. Building a React app that works at scale, is accessible, secure, and maintainable by a team for years — that is another level entirely.

---

## Design Systems in React

A design system is a library of reusable UI components with consistent styles, behavior, and documentation.

### Why Build One

Without a design system, every developer re-implements Button, Input, and Modal with subtle differences. With one: consistent UI, faster development, single place to fix bugs.

### Component API Design Principles

\`\`\`tsx
// Principle 1: Extend native HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// Principle 2: Polymorphic components (as prop pattern)
// Let the component render as different HTML elements
interface TextProps<T extends React.ElementType> {
  as?: T;
  variant?: 'h1' | 'h2' | 'body' | 'caption';
  children: React.ReactNode;
}

function Text<T extends React.ElementType = 'p'>({
  as,
  variant = 'body',
  children,
  ...rest
}: TextProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps<T>>) {
  const Component = as ?? 'p';
  return <Component className={\`text-\${variant}\`} {...rest}>{children}</Component>;
}
// Usage:
// <Text as="h1" variant="h1">Title</Text>
// <Text as="span" variant="caption">Small text</Text>

// Principle 3: Compound components for complex widgets
function Select({ children, value, onChange }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      {children}
    </SelectContext.Provider>
  );
}
Select.Trigger = SelectTrigger;
Select.Options = SelectOptions;
Select.Option = SelectOption;
// Usage:
// <Select value={v} onChange={setV}>
//   <Select.Trigger />
//   <Select.Options>
//     <Select.Option value="a">A</Select.Option>
//   </Select.Options>
// </Select>
\`\`\`

### Component Categories

\`\`\`
Primitives (atoms):
Button, Input, Textarea, Select, Checkbox, Radio, Label, Badge, Avatar, Spinner

Compounds (molecules):
FormField (Label + Input + Error), Card, Modal, Dropdown, Tooltip, Toast

Layout:
Container, Grid, Stack, Divider, PageLayout

Patterns (organisms):
DataTable, SearchCombobox, DatePicker, FileUpload, RichTextEditor
\`\`\`

---

## Accessibility (a11y)

Accessibility is not a feature you add at the end — it is how you build from the start.

### Semantic HTML

\`\`\`tsx
// Wrong: divs everywhere
<div onClick={handleClick}>Submit</div>
<div className="heading">Title</div>
<div className="list">
  <div>Item 1</div>
</div>

// Right: semantic elements
<button onClick={handleClick}>Submit</button>
<h2>Title</h2>
<ul>
  <li>Item 1</li>
</ul>
\`\`\`

### ARIA Attributes

\`\`\`tsx
// Loading state
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</button>

// Error messages
<input
  id="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && <span id="email-error" role="alert">{errors.email}</span>}

// Icons without text
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

// Expandable sections
<button
  aria-expanded={isOpen}
  aria-controls="panel-id"
  onClick={() => setIsOpen(!isOpen)}
>
  Section Title
</button>
<div id="panel-id" hidden={!isOpen}>
  Content
</div>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {notification}  {/* Screen readers announce changes */}
</div>
\`\`\`

### Keyboard Navigation

\`\`\`tsx
// Modal must trap focus inside and return it when closed
function Modal({ onClose, children }: ModalProps) {
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstFocusableRef.current?.focus();
    const prevActiveElement = document.activeElement as HTMLElement;
    return () => prevActiveElement?.focus(); // Restore focus on unmount
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  return (
    <div role="dialog" aria-modal="true" onKeyDown={handleKeyDown}>
      <button ref={firstFocusableRef} onClick={onClose} aria-label="Close">×</button>
      {children}
    </div>
  );
}
\`\`\`

### Color and Contrast

- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- Never rely on color alone to convey meaning — add icons, text labels, patterns
- Test with users who have color vision deficiencies

---

## Security in React Apps

React itself handles XSS by escaping HTML in JSX. But there are pitfalls:

### XSS — What React Handles vs What You Must Handle

\`\`\`tsx
// ✅ React escapes this automatically
<div>{userInput}</div>

// ❌ dangerouslySetInnerHTML bypasses escaping — only with sanitized HTML
<div dangerouslySetInnerHTML={{ __html: userHTML }} />
// If you must use it, sanitize with DOMPurify first:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userHTML) }} />

// ❌ Dynamic href can execute JavaScript
// User input: "javascript:alert('XSS')"
<a href={userUrl}>Link</a>
// Fix: validate the URL
function isSafeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
<a href={isSafeUrl(userUrl) ? userUrl : '#'}>Link</a>
\`\`\`

### Sensitive Data

\`\`\`tsx
// Never store tokens in localStorage — accessible to any script
// ❌ localStorage.setItem('token', jwt);

// Use httpOnly cookies — not accessible to JavaScript
// Set server-side: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// Never log tokens or sensitive data
// ❌ console.log('User token:', token);

// Protect env variables — only VITE_* vars are exposed to browser
// Never put API secrets in frontend code
// ✅ API calls go through your backend, which holds the secrets
\`\`\`

### Content Security Policy

Set CSP headers server-side to prevent unauthorized script execution. React apps running on static hosts should configure CSP in the hosting platform (Vercel, Netlify, etc.).

---

## Code Quality and Reviews

### What Good Code Looks Like

\`\`\`tsx
// ❌ Before
function Component({ d }: { d: any }) {
  const [x, setX] = useState(false);
  useEffect(() => {
    // get data
    fetch('/api/data').then(r => r.json()).then(j => setData(j));
  });
  return <div onClick={() => setX(!x)}>{x ? 'a' : 'b'}</div>;
}

// ✅ After
interface DashboardProps {
  userId: string;
}

function Dashboard({ userId }: DashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => dashboardApi.getByUser(userId),
  });

  return (
    <section aria-label="Dashboard summary">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(prev => !prev)}
      >
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && data && <DashboardContent data={data} />}
    </section>
  );
}
\`\`\`

### Code Review Checklist

When reviewing a React PR:

\`\`\`
Types:
☐ No any types (unless justified)
☐ Props interfaces are defined
☐ API responses are typed

State:
☐ State is at the right level (not hoisted unnecessarily)
☐ Derived values are not stored as state
☐ Array/object state updated immutably

Hooks:
☐ No Rules of Hooks violations
☐ useEffect has correct dependencies
☐ No missing cleanup functions
☐ useMemo/useCallback used only where necessary (with justification)

Components:
☐ Components are small and focused (<100 lines)
☐ No component defined inside another component
☐ Lists have stable, unique keys

Accessibility:
☐ Interactive elements use semantic HTML (button, a, input)
☐ Images have alt text
☐ Form fields have labels
☐ Error messages are associated with their inputs

Performance:
☐ No unnecessary re-renders (check with Profiler)
☐ No accidental recreated objects in JSX

Security:
☐ No dangerouslySetInnerHTML with unsanitized content
☐ No dynamic hrefs from user input without validation
☐ No sensitive data in component state or console.log
\`\`\`

---

## Maintainability Patterns

### Writing for the Next Developer

\`\`\`tsx
// Name things clearly — the name should explain purpose
// ❌
const d = useQuery({ queryKey: ['u', id], queryFn: () => getU(id) });
// ✅
const userQuery = useQuery({ queryKey: ['users', userId], queryFn: () => usersApi.getById(userId) });

// Comment the WHY, not the WHAT
// ❌
// Map over posts
posts.map(post => post.title)

// ✅ (only if non-obvious)
// Backend returns published_at as Unix timestamp; display format expects ISO string
const displayDate = new Date(post.published_at * 1000).toISOString();
\`\`\`

### Feature Flags

\`\`\`tsx
// Gate new features behind flags to deploy safely
function NewDashboard() {
  const { isEnabled } = useFeatureFlag('new-dashboard');

  if (!isEnabled) return <OldDashboard />;
  return <Dashboard />;
}
\`\`\`

### Monitoring in Production

\`\`\`tsx
// Sentry for error tracking
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: config.sentryDsn,
  environment: config.isProduction ? 'production' : 'development',
  tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
});

// Custom error with context
function fetchUser(id: string) {
  return fetch(\`/api/users/\${id}\`)
    .then(r => {
      if (!r.ok) {
        Sentry.captureMessage('User fetch failed', {
          level: 'warning',
          extra: { userId: id, status: r.status },
        });
        throw new Error(\`HTTP \${r.status}\`);
      }
      return r.json();
    });
}
\`\`\``,

  codeExamples: [
    {
      title: 'Accessible form with full a11y implementation',
      code: `function AccessibleContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.length < 20) e.message = 'Message must be at least 20 characters';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div role="status" aria-live="polite">
        <h2>Message sent!</h2>
        <p>Thank you for reaching out. We will respond within 2 business days.</p>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      {hasErrors && (
        <div role="alert" aria-live="assertive">
          <p>Please fix the following errors:</p>
          <ul>
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field}><a href={\`#\${field}\`}>{msg}</a></li>
            ))}
          </ul>
        </div>
      )}

      {(['name', 'email', 'message'] as const).map(field => {
        const isTextarea = field === 'message';
        const InputEl = isTextarea ? 'textarea' : 'input';
        return (
          <div key={field}>
            <label htmlFor={field}>
              {field[0].toUpperCase() + field.slice(1)}
              <span aria-hidden="true"> *</span>
              <span className="sr-only"> (required)</span>
            </label>
            <InputEl
              id={field}
              type={field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              aria-required="true"
              aria-invalid={!!errors[field]}
              aria-describedby={errors[field] ? \`\${field}-error\` : undefined}
            />
            {errors[field] && (
              <span id={\`\${field}-error\`} role="alert" className="field-error">
                {errors[field]}
              </span>
            )}
          </div>
        );
      })}

      <button type="submit">Send Message</button>
    </form>
  );
}`,
      explanation:
        'This form uses: aria-required on required fields, aria-invalid on fields with errors, aria-describedby linking inputs to their error messages, role="alert" on validation errors (screen readers announce them), role="status" for success state, and an error summary at the top for users who navigate by landmark.',
    },
  ],

  commonMistakes: [
    'Treating accessibility as an afterthought — building semantically from the start costs almost nothing extra.',
    'Using divs instead of buttons for clickable elements — divs have no keyboard events, no accessibility role.',
    'Storing JWTs in localStorage — vulnerable to XSS. Use httpOnly cookies set by the server.',
    'No CSP headers — allows injected scripts to run. Configure CSP in your hosting platform.',
    'Writing code only you understand — teammates and future-you will thank you for clarity.',
  ],

  interviewQuestions: [
    {
      question: 'How do you make a React app accessible?',
      answer:
        'Accessibility is multi-layered: (1) Semantic HTML — use button for buttons, nav for navigation, not divs; (2) ARIA attributes — aria-label for icon buttons, aria-invalid + aria-describedby for form errors, aria-live for dynamic content; (3) Keyboard navigation — ensure all interactions work without a mouse, modals trap focus; (4) Color contrast — WCAG AA requires 4.5:1 for body text; (5) Screen reader testing — test with VoiceOver or NVDA. The biggest wins come from semantic HTML and proper form labeling.',
      difficulty: 'intermediate',
    },
    {
      question: 'What are XSS vulnerabilities in React and how do you prevent them?',
      answer:
        'React prevents XSS by escaping all values rendered in JSX — user input cannot execute as HTML. The main vulnerabilities: (1) dangerouslySetInnerHTML — bypasses escaping. Only use with content sanitized by DOMPurify; (2) dynamic href with user input — "javascript:URL" can execute code; validate URLs to http/https only; (3) eval() or Function() with user input — never do this. React\'s escaping covers the most common case, but you must actively avoid the escape hatches.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'eng-ex-1',
      title: 'Accessibility Audit',
      description: 'Review this component and list all accessibility issues. Then fix them.',
      starterCode: `// Find all accessibility issues in this component:
function LoginForm({ onLogin }: { onLogin: (e: string, p: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!email || !password) {
      setError('Fill in all fields');
      return;
    }
    onLogin(email, password);
  }

  return (
    <div>
      <div style={{ color: 'red' }}>{error}</div>
      <div>Email</div>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <div>Password</div>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <div onClick={handleSubmit} style={{ background: 'blue', color: 'white', padding: 8, cursor: 'pointer' }}>
        Login
      </div>
    </div>
  );
}`,
      solution: `// Issues found:
// 1. No <form> wrapper — no Enter key submission, no native form semantics
// 2. <div> used instead of <label> — inputs not associated with their labels
// 3. No for/id association between labels and inputs
// 4. Error shown only in color (red text) — no role="alert" for screen readers
// 5. <div onClick> instead of <button> — no keyboard access, no role="button"
// 6. No noValidate on form (would let native validation conflict)

function LoginForm({ onLogin }: { onLogin: (e: string, p: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    onLogin(email, password);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-required="true"
        aria-invalid={!!error && !email}
        autoComplete="email"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        aria-required="true"
        autoComplete="current-password"
      />

      <button type="submit">Log in</button>
    </form>
  );
}`,
      hints: [
        'Count the issues first before fixing — there are at least 5',
        'What HTML element should a "submit" action be?',
        'How do screen readers know what an input is for?',
        'How are dynamic error messages announced to screen readers?',
        'Can you use the form with only a keyboard?',
      ],
    },
  ],

  keyTakeaways: [
    'Accessibility is built in from the start — semantic HTML, labels on inputs, keyboard navigation, ARIA for dynamic content.',
    'React prevents XSS by default; never bypass it with dangerouslySetInnerHTML without DOMPurify.',
    'Never store auth tokens in localStorage — use httpOnly cookies.',
    'Design systems create consistent, accessible, maintainable UIs. Build one instead of re-implementing components.',
    'Code reviews are about the team, not the individual — they spread knowledge and catch issues early.',
    'Write code for the next developer (who might be you in six months).',
  ],

  nextLesson: 'revision-hub',
  prevLesson: 'guided-projects',
};
