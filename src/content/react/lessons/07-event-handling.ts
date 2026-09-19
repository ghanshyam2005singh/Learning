import type { Lesson } from '@/types';

export const eventHandlingLesson: Lesson = {
  id: 'event-handling',
  slug: 'event-handling',
  title: 'Event Handling',
  description:
    'Handle user interactions in React — synthetic events, form events, mouse and keyboard events, event propagation, and practical patterns for real-world forms.',
  category: 'Events',
  order: 7,
  difficulty: 'beginner',
  estimatedTime: 20,
  content: `Event handling is how React responds to user interaction. React wraps browser events in its own **synthetic event system** that normalizes behavior across browsers and integrates with React's rendering cycle.

---

## React Synthetic Events

React does not attach event listeners directly to DOM nodes. Instead, it uses a single event listener at the root of the application (event delegation) and routes events through its synthetic event wrapper.

A synthetic event wraps the native browser event and provides:
- Consistent API across browsers
- Pooled event objects (older React) or regular objects (React 17+)
- React-specific behavior (e.g., \`onFocus\` works for all elements)

\`\`\`jsx
function Button({ onClick, children }) {
  // React's onClick is different from the DOM's onclick
  // The event parameter is a SyntheticEvent
  return (
    <button onClick={(event) => {
      console.log(event.type);        // "click"
      console.log(event.target);      // the button DOM element
      console.log(event.currentTarget); // same as target for this case
      onClick();
    }}>
      {children}
    </button>
  );
}
\`\`\`

**Key differences from HTML event handlers:**
- React uses camelCase: \`onClick\`, not \`onclick\`
- You pass a **function reference**, not a string: \`onClick={handleClick}\`, not \`onclick="handleClick()"\`

---

## Attaching Event Handlers

\`\`\`jsx
// Method 1: Inline arrow function (creates new function each render)
<button onClick={() => setCount(c => c + 1)}>Increment</button>

// Method 2: Named handler (better for complex logic or performance-sensitive code)
function handleIncrement() {
  setCount(c => c + 1);
  trackAnalytics('increment_clicked');
}
<button onClick={handleIncrement}>Increment</button>

// ❌ Common mistake: calling the function immediately
<button onClick={handleIncrement()}>Increment</button>
// This calls handleIncrement during RENDER, not on click
// Passes the return value (undefined) as the event handler
// onClick should receive a function REFERENCE, not a function call

// ✅ Correct: pass the reference
<button onClick={handleIncrement}>Increment</button>

// When you need to pass arguments, use an arrow wrapper
<button onClick={() => handleDelete(item.id)}>Delete</button>
\`\`\`

---

## Form Events

Forms are one of the most common event handling scenarios in React.

### The onChange event

For input elements, \`onChange\` fires on every keystroke (unlike HTML's \`change\` event which fires on blur):

\`\`\`jsx
function SearchInput() {
  const [query, setQuery] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search..."
    />
  );
}
\`\`\`

\`event.target.value\` gives you the current value of the input. This is how controlled inputs work: state drives the input value, and the input fires events to update state.

### The onSubmit event

\`\`\`jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default browser form submission
    // Now handle the form data
    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
\`\`\`

**Always call \`event.preventDefault()\`** on form submit to prevent the browser from refreshing the page.

### Handling multiple inputs with one handler

\`\`\`jsx
function RegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // One handler for all inputs — uses the input's name attribute
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <form>
      <input name="name"     value={form.name}     onChange={handleChange} />
      <input name="email"    value={form.email}    onChange={handleChange} />
      <input name="password" value={form.password} onChange={handleChange} />
    </form>
  );
}
\`\`\`

The \`name\` attribute on each input maps to the key in the form state object. One handler updates any field.

---

## Event Propagation

Events in React follow the DOM's event propagation model: they bubble up through the component tree.

\`\`\`jsx
function Card({ onClick, children }) {
  return (
    <div
      className="card"
      onClick={() => console.log('Card clicked')}
    >
      {children}
    </div>
  );
}

function App() {
  return (
    <Card>
      <button onClick={() => console.log('Button clicked')}>
        Click me
      </button>
    </Card>
  );
}

// When the button is clicked:
// 1. "Button clicked" logs first
// 2. "Card clicked" logs second (event bubbled up to the card's div)
\`\`\`

To stop an event from bubbling up to parent handlers:

\`\`\`jsx
function Card({ onCardClick, children }) {
  return (
    <div className="card" onClick={onCardClick}>
      {children}
    </div>
  );
}

<Card onCardClick={() => navigate('/post/1')}>
  <button
    onClick={(e) => {
      e.stopPropagation(); // Prevents the card's onClick from firing
      handleLike();
    }}
  >
    Like
  </button>
</Card>
\`\`\`

**Use \`stopPropagation\` carefully.** Overusing it makes event handling hard to debug and breaks components that rely on events bubbling (e.g., click-outside detection for modals).

---

## Mouse Events

\`\`\`jsx
function InteractiveCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => console.log(e.clientX, e.clientY)}
      onDoubleClick={() => handleDoubleClick()}
      className={isHovered ? 'card hovered' : 'card'}
    >
      {isHovered ? 'Hovered!' : 'Hover me'}
    </div>
  );
}
\`\`\`

Common mouse events: \`onClick\`, \`onDoubleClick\`, \`onMouseEnter\`, \`onMouseLeave\`, \`onMouseMove\`, \`onMouseDown\`, \`onMouseUp\`, \`onContextMenu\`

---

## Keyboard Events

\`\`\`jsx
function SearchInput() {
  const [query, setQuery] = useState('');

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSearch(query);
    }
    if (event.key === 'Escape') {
      setQuery('');
    }
  }

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Press Enter to search, Escape to clear"
    />
  );
}
\`\`\`

Use \`event.key\` (not \`event.keyCode\` or \`event.which\`) — it gives descriptive string values like \`'Enter'\`, \`'Escape'\`, \`'ArrowUp'\`.

---

## Practical Pattern: Reusable Form Field

\`\`\`tsx
interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  required?: boolean;
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
}: FieldProps) {
  return (
    <div className={\`field \${error ? 'field-error' : ''}\`}>
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? \`\${name}-error\` : undefined}
      />
      {error && (
        <span id={\`\${name}-error\`} role="alert" className="error-text">
          {error}
        </span>
      )}
    </div>
  );
}
\`\`\`

This reusable \`FormField\` component separates the event handling API from the form implementation. The parent controls the data; the field just reports changes.

---

## Best Practices

1. **Name handlers with "handle" prefix**: \`handleClick\`, \`handleSubmit\`, \`handleChange\` — clear and consistent convention.

2. **Always preventDefault on form submit** — otherwise the browser reloads the page.

3. **Use named handlers for complex logic** — inline arrows are fine for simple callbacks, but extract to named functions when logic grows.

4. **Avoid passing event objects to async functions** — in older React, synthetic events were pooled and reused. Access the values you need synchronously, then pass those values:

\`\`\`jsx
// ✅ Extract the value synchronously
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const value = event.target.value; // Read synchronously
  setTimeout(() => {
    console.log(value); // Safe — value captured before event recycled
  }, 1000);
}
\`\`\`

5. **Use TypeScript event types** — they prevent errors and provide autocompletion for event properties.`,

  codeExamples: [
    {
      title: 'Complete form with multiple event types',
      code: `interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  newsletter: boolean;
}

function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal',
    newsletter: false,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await submitForm(form);
    setSubmitted(true);
  }

  if (submitted) return <p>Thank you! We'll be in touch.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleTextChange} required />
      <input name="email" type="email" value={form.email} onChange={handleTextChange} required />
      <input name="subject" value={form.subject} onChange={handleTextChange} />
      <textarea name="message" value={form.message} onChange={handleTextChange} rows={4} />
      <select name="priority" value={form.priority} onChange={handleTextChange}>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
      <label>
        <input
          name="newsletter"
          type="checkbox"
          checked={form.newsletter}
          onChange={handleCheckboxChange}
        />
        Subscribe to newsletter
      </label>
      <button type="submit">Send Message</button>
    </form>
  );
}`,
      explanation:
        'Notice two separate handlers: handleTextChange for text/select/textarea (uses event.target.value), handleCheckboxChange for checkboxes (uses event.target.checked). Both use the name attribute to know which field to update.',
    },
  ],

  commonMistakes: [
    'Calling the function instead of passing it: onClick={handleClick()} calls immediately. onClick={handleClick} is correct.',
    'Forgetting event.preventDefault() on form submit — browser reloads the page.',
    'Overusing stopPropagation — breaks event-based patterns like click-outside modals.',
    'Using event.keyCode or event.which — deprecated. Use event.key.',
    'Not using TypeScript event types — loses autocomplete and catches errors.',
  ],

  interviewQuestions: [
    {
      question: 'What is a synthetic event in React?',
      answer:
        'A synthetic event is React\'s cross-browser wrapper around the native browser event. React attaches a single event listener at the root (event delegation) and creates SyntheticEvent objects that provide a consistent API across browsers. Synthetic events have the same interface as native events (target, preventDefault, stopPropagation, etc.) but are normalized for cross-browser compatibility. React 17+ no longer pools events, so you can safely read event properties asynchronously.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why do you need to call event.preventDefault() on form submit in React?',
      answer:
        'Without event.preventDefault(), the browser handles the form submission natively: it sends an HTTP request to the form\'s action URL (or the current URL if no action is specified) and reloads the page. This destroys all React state and components. preventDefault() tells the browser to skip its default behavior, giving React control over what happens next.',
      difficulty: 'beginner',
    },
    {
      question: 'What is the difference between onClick={handleClick} and onClick={handleClick()}?',
      answer:
        'onClick={handleClick} passes a function reference — React calls it when the click happens. onClick={handleClick()} calls the function immediately during render and passes its return value as the handler. Since handleClick() likely returns undefined, the click handler becomes undefined. This is one of the most common beginner mistakes in React.',
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'events-ex-1',
      title: 'Build a Keyboard-Navigable Tag Input',
      description: 'Build a tag input where users type a tag, press Enter to add it, and click × to remove it.',
      starterCode: `function TagInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // TODO: handleKeyDown — add tag on Enter, clear input
  // TODO: removeTag — remove tag by value
  // Validation: don't add empty tags, don't add duplicates

  return (
    <div className="tag-input">
      <div className="tags">
        {/* TODO: render tags with × button */}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        // TODO: add onKeyDown
        placeholder="Type a tag and press Enter"
      />
    </div>
  );
}`,
      solution: `function TagInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState('');

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = input.trim().toLowerCase();
      if (tag && !tags.includes(tag)) {
        setTags(prev => [...prev, tag]);
        setInput('');
      }
    }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      setTags(prev => prev.slice(0, -1)); // Remove last tag
    }
  }

  function removeTag(tagToRemove: string) {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }

  return (
    <div className="tag-input">
      <div className="tags">
        {tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={\`Remove tag \${tag}\`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter"
      />
    </div>
  );
}`,
      hints: [
        'Use event.key === "Enter" to detect Enter',
        'trim() the input to avoid empty or whitespace tags',
        'Check for duplicates before adding',
        'Backspace when input is empty can remove the last tag',
      ],
    },
  ],

  keyTakeaways: [
    'React uses synthetic events — a cross-browser wrapper. Same interface as native events but normalized.',
    'Event handlers use camelCase (onClick, onChange) and receive a function reference, not a call.',
    'Always call event.preventDefault() on form submit to prevent page reload.',
    'Use event.target.value for text inputs, event.target.checked for checkboxes.',
    'Use event.key (not keyCode) for keyboard events. "Enter", "Escape", "ArrowUp" etc.',
    'stopPropagation() prevents events from bubbling to parent handlers — use sparingly.',
  ],

  nextLesson: 'hooks-fundamentals',
  prevLesson: 'state',
};
