import type { Lesson } from '@/types';

export const uiUxForDevsLesson: Lesson = {
  id: 'ui-ux-for-developers',
  slug: 'ui-ux-for-developers',
  title: 'UI/UX for Developers',
  description:
    'Design systems, user experience principles, accessibility, responsive design, mobile-first thinking, and design thinking — what every developer needs to build usable products.',
  category: 'Product Development',
  order: 5,
  difficulty: 'intermediate',
  estimatedTime: 25,
  content: `You do not need to be a designer. But you need to think like one.

Developers who build technically correct but unusable applications waste their own effort. A feature nobody can figure out how to use might as well not exist.

This module is not about making things pretty. It is about understanding why design decisions exist and how to make good ones when there is no designer on your team.

---

## What is UX?

UX (User Experience) is everything a user feels and thinks while using your product.

It is not just how things look. It is:
- How long does it take to complete the core action?
- What happens when something goes wrong?
- How many clicks does it take to find what the user is looking for?
- Does the user feel confused at any point?
- Is the interface predictable?

**The three questions of UX:**
1. Can the user find what they need? (discoverability)
2. Can the user do what they want? (usability)
3. Does the user feel good about it? (satisfaction)

---

## Design Systems

A design system is a collection of reusable components, patterns, and guidelines that ensure consistency across a product.

**What a design system contains:**

\`\`\`
TOKENS (the raw values):
  Colors:       --primary: #3B82F6, --danger: #EF4444
  Typography:   --font-body: 'Inter', --text-base: 16px
  Spacing:      --space-4: 16px, --space-8: 32px
  Shadows:      --shadow-sm, --shadow-lg

COMPONENTS (reusable UI pieces):
  Button (primary, secondary, danger, ghost, loading state)
  Input (text, email, password, with error state)
  Card
  Modal
  Toast notification
  Table
  Badge

PATTERNS (how components combine):
  Form layout
  Empty states
  Error states
  Loading states
  Navigation patterns
\`\`\`

**Why design systems matter:**
- Consistency — users learn the interface once and it works everywhere
- Speed — reuse components instead of rebuilding them
- Maintenance — change the token, everything updates

**Popular design systems you can use:**
- Tailwind CSS + shadcn/ui (most popular in React ecosystem)
- Material UI — Google's design language for React
- Chakra UI — accessible component library
- Radix UI — unstyled, accessible primitives

**For your projects:** Use shadcn/ui with Tailwind. It gives you accessible, customizable components that follow modern design patterns.

---

## User Experience Principles

### 1. Visibility of System Status

Users always need to know what is happening.

\`\`\`
BAD: Click submit → nothing visible happens → user clicks again → duplicate submission

GOOD: Click submit → button shows spinner + "Saving..." → success toast appears
\`\`\`

Show loading states. Show success feedback. Show error messages. Never leave the user wondering.

### 2. Match the Real World

Use language and concepts users already know.

\`\`\`
BAD:  "Click to initiate the data persistence operation"
GOOD: "Click to save"

BAD:  "Authentication failed"
GOOD: "Wrong email or password"
\`\`\`

### 3. User Control and Freedom

Users make mistakes. They need an exit.

- Undo / redo where possible
- Confirmation dialogs before destructive actions
- Cancel buttons on every form
- "Soft delete" instead of permanent deletion where sensible

\`\`\`
BAD:  Click "Delete Account" → account immediately deleted forever

GOOD: Click "Delete Account" → confirmation modal
      "This will permanently delete your account. Type your email to confirm."
      → 30-day grace period where account can be recovered
\`\`\`

### 4. Consistency and Standards

Follow platform conventions. Do not reinvent what users already know.

- Submit button on the right
- Cancel button on the left
- Red for danger/error
- Green for success
- Blue for links and primary actions
- Hamburger menu on mobile

When you deviate from conventions, users have to think. Thinking creates friction.

### 5. Error Prevention

The best error message is the one users never see.

- Disable the submit button until the form is valid
- Show password requirements before the user types
- Email field: validate format as they type
- Destructive actions require confirmation

### 6. Recognition Over Recall

Do not make users remember things.

\`\`\`
BAD:  "Enter your account number from your registration email"
GOOD: Show the account number on the settings page
\`\`\`

Visible options are better than hidden menus. Autocomplete is better than exact recall. Showing recent items is better than requiring search.

---

## Accessibility

Accessibility (a11y) means your product works for everyone, including people with disabilities.

**Why accessibility matters:**
- ~15% of the global population has some form of disability
- Screen readers are used by blind users
- Keyboard navigation is essential for motor-impaired users
- Color contrast is critical for color-blind users
- Legal requirement in many jurisdictions

**The core rules:**

### Semantic HTML
Use the right HTML elements. They carry meaning that screen readers use.

\`\`\`html
<!-- BAD: screen readers cannot identify this as a button -->
<div onclick="submit()">Submit</div>

<!-- GOOD: screen readers know this is a button, spacebar/enter activates it -->
<button type="submit">Submit</button>

<!-- BAD: just a styled div -->
<div class="heading">Section Title</div>

<!-- GOOD: heading hierarchy is readable by screen readers -->
<h2>Section Title</h2>
\`\`\`

### ARIA Labels
When you cannot use semantic HTML, add ARIA attributes.

\`\`\`html
<!-- Icon button with no text -->
<button aria-label="Close modal">
  <XIcon />
</button>

<!-- Form field without visible label -->
<input
  type="search"
  aria-label="Search products"
  placeholder="Search..."
/>
\`\`\`

### Color Contrast
Text must have sufficient contrast against its background.

\`\`\`
WCAG AA standard (minimum):
  Normal text: 4.5:1 contrast ratio
  Large text (18px+): 3:1 contrast ratio

FAIL:  Light gray text (#aaa) on white background (ratio: 2.3:1)
PASS:  Dark gray text (#555) on white background (ratio: 5.7:1)
\`\`\`

Use the browser DevTools accessibility checker or the WebAIM contrast checker.

### Keyboard Navigation
Every interactive element must be reachable and operable via keyboard.

\`\`\`
Tab → moves to next interactive element
Shift+Tab → moves to previous
Enter/Space → activates buttons
Escape → closes modals
Arrow keys → navigates menus and lists
\`\`\`

Test by unplugging your mouse and navigating your app with only a keyboard.

---

## Responsive Design

Your app must work on all screen sizes.

**Breakpoints (Tailwind CSS defaults):**

\`\`\`
sm:   640px+   (large phone landscape)
md:   768px+   (tablet)
lg:   1024px+  (laptop)
xl:   1280px+  (desktop)
2xl:  1536px+  (large desktop)
\`\`\`

**Responsive design patterns:**

| Mobile | Desktop |
|--------|---------|
| Single column | Multi-column (sidebar + main) |
| Hamburger menu | Full navigation bar |
| Full-width cards | Grid cards |
| Bottom navigation | Side navigation |
| Stacked form fields | Side-by-side fields |

\`\`\`tsx
// Tailwind responsive example
<div className="
  flex flex-col        // mobile: stack vertically
  md:flex-row          // tablet+: side by side
  gap-4
">
  <aside className="
    w-full              // mobile: full width
    md:w-64             // tablet+: fixed sidebar width
  ">
    Sidebar
  </aside>
  <main className="flex-1">
    Content
  </main>
</div>
\`\`\`

---

## Mobile First Design

Mobile first means: design for the smallest screen first, then add features for larger screens.

**Why:**
- More than 60% of web traffic is from mobile
- A mobile layout that scales up is easier than a desktop layout squeezed down
- Forces you to prioritize essential features

**Mobile first in Tailwind:**

\`\`\`tsx
// Without prefix = mobile
// md: = tablet+
// lg: = desktop+

<div className="
  p-4              // mobile: 16px padding
  md:p-8           // tablet+: 32px padding
  lg:p-12          // desktop+: 48px padding

  text-sm          // mobile: small text
  md:text-base     // tablet+: normal text

  hidden           // mobile: hidden
  md:block         // tablet+: visible
">
  Sidebar content
</div>
\`\`\`

---

## Design Thinking

Design thinking is a problem-solving process used by product teams.

**Five stages:**

1. **Empathize** — Understand users. Observe them. Interview them. What are their real problems?
2. **Define** — Write a clear problem statement. "Students struggle to track their study progress across multiple subjects."
3. **Ideate** — Generate many solutions without judgment. Quantity before quality.
4. **Prototype** — Build the simplest possible version of the most promising solution.
5. **Test** — Put it in front of real users. Watch them use it. Update your understanding.

**For developers, design thinking means:**

Before building: talk to at least 3 potential users.
Before coding a feature: sketch it (even on paper).
After building: watch someone use it without helping them.

The most valuable information you will ever get about your product comes from watching someone use it for the first time and getting stuck on something you assumed was obvious.

---

## Practical Design Resources

**Free tools:**
- **Figma** — industry standard design tool (free for personal use)
- **Excalidraw** — quick wireframing
- **Coolors.co** — color palette generation
- **Google Fonts** — free typography
- **Heroicons / Lucide** — icon libraries

**When there is no designer:**
1. Use a component library (shadcn/ui, Chakra UI)
2. Copy patterns from products you admire — do not copy their brand, copy the pattern
3. Keep it simple — fewer elements is usually better
4. Test with real users, even informally
5. Improve one thing at a time based on actual feedback`,
  codeExamples: [
    {
      title: 'Accessible Form with Loading and Error States',
      code: `// Form that follows UX principles
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.includes('@') && password.length >= 8;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err) {
      // User-friendly error message (not "Authentication failed")
      setError('Wrong email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Error shown at top of form, linked to form for screen readers */}
      {error && (
        <div role="alert" className="text-red-600 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        {/* Label explicitly linked to input */}
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
          aria-describedby={error ? 'form-error' : undefined}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Disabled until valid, shows loading state */}
      <button
        type="submit"
        disabled={!isValid || loading}
        aria-busy={loading}
        className="w-full bg-blue-600 text-white py-2 rounded
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}`,
      explanation:
        'This form demonstrates: semantic HTML (label + input), accessible error message (role="alert"), button disabled until valid, loading state feedback, and user-friendly error messages.',
    },
    {
      title: 'Mobile-First Responsive Layout',
      code: `// Dashboard layout: stacked on mobile, sidebar+main on desktop
function DashboardLayout({ children, sidebar }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header with hamburger */}
      <header className="
        flex items-center justify-between
        p-4 bg-white border-b
        md:hidden          /* Hide on desktop — desktop has persistent sidebar */
      ">
        <Logo />
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </button>
      </header>

      <div className="
        flex flex-col      /* mobile: stack */
        md:flex-row        /* desktop: side by side */
      ">
        {/* Sidebar: drawer on mobile, persistent on desktop */}
        <aside className={\`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r
          transform transition-transform
          \${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0  /* always visible on desktop */
        \`}>
          <nav>{sidebar}</nav>
        </aside>

        {/* Overlay (mobile only) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="
          flex-1
          p-4          /* mobile: tight padding */
          md:p-8       /* desktop: more breathing room */
        ">
          {children}
        </main>
      </div>
    </div>
  );
}`,
      explanation:
        'Mobile-first approach: default styles for mobile, md: prefix adds desktop styles. Sidebar is a drawer on mobile (off-canvas), persistent panel on desktop. One component, two experiences.',
    },
  ],
  commonMistakes: [
    'Building for desktop first and trying to make it work on mobile later — much harder in reverse',
    'Using color as the only indicator of status (bad for color-blind users) — always pair color with text or icon',
    'Showing technical error messages to users ("ECONNREFUSED", "500 Internal Server Error")',
    'Forgetting loading states — users will click again if they do not see feedback',
    'Using non-semantic div elements for interactive UI — breaks keyboard navigation and screen readers',
    'Making forms submit on first Enter keypress before the user has finished filling them out',
  ],
  interviewQuestions: [
    {
      question: 'What is accessibility in web development and why does it matter?',
      answer:
        'Accessibility (a11y) means building products usable by people with disabilities — visual, motor, auditory, cognitive. It requires semantic HTML (correct element types), ARIA labels for non-semantic elements, sufficient color contrast (4.5:1 for normal text), keyboard navigation support, and screen reader compatibility. It matters ethically, legally (many countries mandate it), and practically (15% of the population has disabilities).',
      difficulty: 'intermediate',
    },
    {
      question: 'What is mobile-first design and why do we use it?',
      answer:
        'Mobile-first means designing and coding for the smallest screen first, then progressively adding features for larger screens. We use it because 60%+ of web traffic is mobile, and it is easier to scale up a simple layout than to squeeze down a complex one. In Tailwind, default styles apply to mobile and breakpoint prefixes (md:, lg:) apply to larger screens.',
      difficulty: 'beginner',
    },
    {
      question: 'What is a design system and what problem does it solve?',
      answer:
        'A design system is a collection of reusable components, design tokens (colors, spacing, typography), and usage guidelines that ensure consistency across a product. It solves the problem of inconsistency — without it, different parts of a product look and behave differently, creating a confusing user experience. It also speeds up development because components are built once and reused everywhere.',
      difficulty: 'intermediate',
    },
  ],
  exercises: [
    {
      id: 'audit-a-form',
      title: 'Audit a Form for UX Issues',
      description:
        'Look at the broken form below and identify all UX and accessibility issues. Then write the corrected version.',
      starterCode: `// BROKEN FORM — find the issues
function BadForm() {
  function handleSubmit() {
    saveData();
  }

  return (
    <div>
      <div style={{ color: '#ccc', fontSize: '10px' }}>Email</div>
      <div contentEditable id="email-input" />

      <div style={{ color: '#ccc', fontSize: '10px' }}>Password</div>
      <div contentEditable id="pw-input" />

      <div onClick={handleSubmit} style={{ background: 'blue', color: 'white' }}>
        SUBMIT
      </div>
    </div>
  );
}

// ISSUES FOUND:
// 1.
// 2.
// 3.
// 4.
// 5.
// 6.

// FIXED FORM:`,
      solution: `// ISSUES FOUND:
// 1. contentEditable divs instead of input elements — not accessible, no type validation
// 2. No <label> elements — screen readers cannot identify what fields are for
// 3. Color is #ccc on white — insufficient contrast (fails WCAG AA)
// 4. Font size 10px — too small for readability
// 5. div onClick instead of <button> — not keyboard accessible, no semantic meaning
// 6. No form element — no Enter key submit, no browser validation, no autocomplete

// FIXED FORM:
function GoodForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.includes('@') && password.length >= 6;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await saveData({ email, password });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}`,
      hints: [
        'Count the issues in the original: there are at least 6 distinct problems',
        'Test the original with Tab key — can you even reach the submit button?',
        'Check WCAG color contrast guidelines for text on backgrounds',
      ],
    },
  ],
  keyTakeaways: [
    'UX is not just visual design — it is discoverability, usability, and how the product makes users feel',
    'Design systems (colors, typography, components) ensure consistency and speed up development',
    'Always show system status: loading states, success feedback, error messages',
    'Accessibility requires semantic HTML, ARIA labels, keyboard navigation, and color contrast',
    'Mobile-first means default styles target mobile; breakpoint prefixes (md:, lg:) add desktop styles',
    'Design thinking: empathize with users before building, prototype before perfecting, test with real users',
  ],
  nextLesson: 'frontend-architecture',
  prevLesson: 'project-planning',
};
