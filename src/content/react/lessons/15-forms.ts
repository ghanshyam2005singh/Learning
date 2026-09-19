import type { Lesson } from '@/types';

export const formsLesson: Lesson = {
  id: 'forms',
  slug: 'forms',
  title: 'Forms in React',
  description:
    'Master controlled vs uncontrolled components, form state management, validation patterns, error handling, and production-ready form architecture.',
  category: 'Forms',
  order: 15,
  difficulty: 'intermediate',
  estimatedTime: 25,
  content: `Forms are one of the most common UI patterns in web applications. React gives you two approaches: **controlled** and **uncontrolled** components. Understanding when to use each — and how to handle validation and errors properly — is a core React skill.

---

## Controlled vs Uncontrolled Components

### Controlled Components

In a controlled component, React state is the **single source of truth** for the input's value. The input's value is always driven by state.

\`\`\`jsx
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}         // React state drives the display
      onChange={e => setValue(e.target.value)}  // User typing updates state
    />
  );
}
\`\`\`

Data flow: user types → onChange fires → state updates → React re-renders → input shows new value.

The value in the input always matches the state. You can always read the current value from state, not from the DOM.

### Uncontrolled Components

In an uncontrolled component, the DOM maintains the input's value. You read it using a ref when needed (e.g., on submit).

\`\`\`jsx
function UncontrolledInput() {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(inputRef.current.value); // Read directly from DOM
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="initial value" />
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

Notice: \`defaultValue\` instead of \`value\` — this sets the initial value without React controlling subsequent changes.

### When to Use Each

| | Controlled | Uncontrolled |
|---|---|---|
| Real-time validation | ✅ Easy | ❌ Awkward |
| Conditional disabling | ✅ Easy | ❌ Awkward |
| Dynamic field values | ✅ Easy | ❌ Awkward |
| Simple one-shot forms | ✅ Works | ✅ Simpler |
| Performance (huge forms) | Slightly more re-renders | Fewer re-renders |
| Integration with non-React | ❌ Complex | ✅ Natural |

**Default choice: controlled components.** They are predictable, testable, and give you full control over the UI at every moment. Use uncontrolled components only when performance is a measured concern or when integrating with non-React code.

---

## Building a Complete Controlled Form

\`\`\`tsx
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'developer' | 'designer' | 'manager';
  agreeToTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

function RegistrationForm({ onSuccess }: { onSuccess: (data: RegisterFormData) => void }) {
  const [form, setForm] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'developer',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!form.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await registerUser(form);
      onSuccess(form);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={e => updateField('email', e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">{errors.email}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={e => updateField('password', e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <span id="password-error" role="alert">{errors.password}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={form.role}
          onChange={e => updateField('role', e.target.value as RegisterFormData['role'])}
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <div className="field-checkbox">
        <input
          id="terms"
          type="checkbox"
          checked={form.agreeToTerms}
          onChange={e => updateField('agreeToTerms', e.target.checked)}
        />
        <label htmlFor="terms">I agree to the Terms of Service</label>
        {errors.agreeToTerms && (
          <span role="alert">{errors.agreeToTerms}</span>
        )}
      </div>

      {submitError && (
        <div role="alert" className="submit-error">{submitError}</div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
\`\`\`

---

## Validation Strategies

### Strategy 1: On Submit Only

Simple — validate everything when the user submits. Clear errors as user fixes fields.

Best for: Simple forms where real-time feedback is not needed.

### Strategy 2: On Blur (when field loses focus)

Validate a field when the user leaves it. Shows errors progressively.

\`\`\`jsx
const [touched, setTouched] = useState({});

function handleBlur(fieldName) {
  setTouched(prev => ({ ...prev, [fieldName]: true }));
}

// Only show error if field has been touched
{touched.email && errors.email && <span>{errors.email}</span>}
\`\`\`

Best for: Most forms — validates when the user is done with a field.

### Strategy 3: On Change (real-time)

Validate on every keystroke. Can be noisy if shown immediately.

Common pattern: Show errors on change only after the first submit attempt or after blur.

\`\`\`jsx
const [hasSubmitted, setHasSubmitted] = useState(false);

// Only show real-time errors after first submit
const shouldShowError = (field) => hasSubmitted || touched[field];
\`\`\`

---

## Dynamic Forms

Adding and removing fields dynamically:

\`\`\`tsx
interface PhoneNumber {
  id: string;
  type: 'mobile' | 'home' | 'work';
  number: string;
}

function PhoneNumbersField() {
  const [phones, setPhones] = useState<PhoneNumber[]>([
    { id: crypto.randomUUID(), type: 'mobile', number: '' },
  ]);

  function addPhone() {
    setPhones(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'mobile', number: '' },
    ]);
  }

  function removePhone(id: string) {
    setPhones(prev => prev.filter(p => p.id !== id));
  }

  function updatePhone(id: string, field: keyof Omit<PhoneNumber, 'id'>, value: string) {
    setPhones(prev =>
      prev.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  }

  return (
    <div>
      {phones.map((phone, index) => (
        <div key={phone.id} className="phone-row">
          <select
            value={phone.type}
            onChange={e => updatePhone(phone.id, 'type', e.target.value)}
          >
            <option value="mobile">Mobile</option>
            <option value="home">Home</option>
            <option value="work">Work</option>
          </select>
          <input
            type="tel"
            value={phone.number}
            onChange={e => updatePhone(phone.id, 'number', e.target.value)}
            placeholder="Phone number"
          />
          {phones.length > 1 && (
            <button type="button" onClick={() => removePhone(phone.id)}>
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addPhone}>Add Phone Number</button>
    </div>
  );
}
\`\`\`

Note: Use stable IDs (\`crypto.randomUUID()\`) as keys for dynamic form rows, not index.

---

## Server-Side Validation Errors

Validation is not only client-side. The server may reject data for reasons the client cannot know:

\`\`\`tsx
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!validateLocally()) return;

  setIsSubmitting(true);
  try {
    await submitForm(formData);
    onSuccess();
  } catch (err) {
    if (err.status === 422) {
      // Server returned field-level validation errors
      // e.g., { email: "already taken", username: "invalid characters" }
      setErrors(err.fieldErrors);
    } else {
      setGlobalError(err.message);
    }
  } finally {
    setIsSubmitting(false);
  }
}
\`\`\`

---

## Accessibility in Forms

Forms are a critical accessibility area:

\`\`\`jsx
// Always associate labels with inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Use aria-invalid for invalid fields
<input aria-invalid={!!errors.email} />

// Use aria-describedby to connect errors to inputs
<input aria-describedby={errors.email ? 'email-error' : undefined} />
<span id="email-error" role="alert">{errors.email}</span>

// Use role="alert" for dynamically added errors (screen reader reads them)
<span role="alert">Password must be at least 8 characters</span>

// Disable submit during submission to prevent double-submit
<button disabled={isSubmitting}>Submit</button>

// Use noValidate to suppress browser validation (use your own)
<form noValidate onSubmit={handleSubmit}>
\`\`\``,

  codeExamples: [
    {
      title: 'File upload with preview',
      code: `function ImageUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('Image must be under 5MB');
      return;
    }

    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    onUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as any;
      handleFileChange(fakeEvent);
    }
  }

  return (
    <div
      className="upload-zone"
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {preview ? (
        <img src={preview} alt="Preview" className="preview" />
      ) : (
        <p>Drop an image here or click to upload</p>
      )}
      {error && <span role="alert" className="error">{error}</span>}
    </div>
  );
}`,
      explanation:
        'Uncontrolled file input (file inputs cannot be controlled) with React-managed preview state. The hidden input is triggered imperatively via ref. Drag and drop is handled by the div. Validation runs on selection.',
    },
  ],

  commonMistakes: [
    'Forgetting event.preventDefault() on form submit — page reloads, all state lost.',
    'Not clearing errors as the user corrects fields — stale error messages are confusing.',
    'Using value without onChange on an input — creates a read-only field. React warns about this.',
    'Using index as key for dynamic form rows — causes incorrect state binding when rows are added/removed.',
    'Not disabling the submit button during submission — users can double-submit.',
    'Missing label/input association (htmlFor/id) — breaks screen readers and click targets.',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between a controlled and uncontrolled component in React?',
      answer:
        'In a controlled component, React state is the single source of truth for the input value. The value prop drives the display; onChange updates the state. You always know the current value from state. In an uncontrolled component, the DOM manages the value. You use a ref to access the value when needed (e.g., on submit). Controlled components are the default choice — they enable real-time validation, conditional logic, and predictable state. Uncontrolled components are simpler for basic forms and necessary for file inputs.',
      difficulty: 'intermediate',
    },
    {
      question: 'What happens if you set value on an input without onChange?',
      answer:
        'If you set value without onChange, the input becomes read-only — the user cannot type in it. React detects this and logs a warning. React controls the displayed value via the value prop; without onChange to update state, the value never changes and user input is ignored. Either add an onChange handler to make it a controlled input, or use defaultValue instead of value for an uncontrolled input.',
      difficulty: 'beginner',
    },
  ],

  exercises: [
    {
      id: 'forms-ex-1',
      title: 'Multi-Step Form with Validation',
      description: 'Build a 3-step form: step 1 (name, email), step 2 (password), step 3 (review and submit). Validate each step before allowing next.',
      starterCode: `interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function MultiStepSignup() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // TODO: validateStep(step) → boolean
  // TODO: handleNext() → validates current step, advances if valid
  // TODO: render correct step based on step number

  return <div>{/* TODO */}</div>;
}`,
      solution: `function MultiStepSignup() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function update(field: keyof FormData, value: string) {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validateStep(s: number): boolean {
    const newErrors: Partial<FormData> = {};
    if (s === 1) {
      if (!data.name.trim()) newErrors.name = 'Name is required';
      if (!data.email.includes('@')) newErrors.email = 'Valid email required';
    }
    if (s === 2) {
      if (data.password.length < 8) newErrors.password = 'Min 8 characters';
      if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep(s => s + 1);
  }

  return (
    <div>
      <div>Step {step} of 3</div>
      {step === 1 && (
        <div>
          <input value={data.name} onChange={e => update('name', e.target.value)} placeholder="Name" />
          {errors.name && <span>{errors.name}</span>}
          <input value={data.email} onChange={e => update('email', e.target.value)} placeholder="Email" />
          {errors.email && <span>{errors.email}</span>}
        </div>
      )}
      {step === 2 && (
        <div>
          <input type="password" value={data.password} onChange={e => update('password', e.target.value)} placeholder="Password" />
          {errors.password && <span>{errors.password}</span>}
          <input type="password" value={data.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Confirm" />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>
      )}
      {step === 3 && (
        <div>
          <p>Name: {data.name}</p>
          <p>Email: {data.email}</p>
          <p>Password: {'*'.repeat(data.password.length)}</p>
        </div>
      )}
      <div>
        {step > 1 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 3 && <button onClick={handleNext}>Next</button>}
        {step === 3 && <button onClick={() => submitRegistration(data)}>Submit</button>}
      </div>
    </div>
  );
}`,
      hints: [
        'Track step with useState',
        'validateStep validates only the fields for the current step',
        'handleNext calls validateStep and only advances if valid',
        'Render different fields based on current step number',
      ],
    },
  ],

  keyTakeaways: [
    'Controlled: React state drives the input value (via value + onChange). Uncontrolled: DOM manages the value (via defaultValue + ref).',
    'Controlled components are the default choice — predictable, testable, enable real-time validation.',
    'Always call event.preventDefault() on form submit to prevent page reload.',
    'Clear field errors when the user starts correcting them — improves UX.',
    'Use stable IDs (not array index) as keys for dynamic form rows.',
    'Accessibility essentials: htmlFor/id pairs, aria-invalid, aria-describedby, role="alert" for errors.',
  ],

  nextLesson: 'api-integration',
  prevLesson: 'custom-hooks',
};
