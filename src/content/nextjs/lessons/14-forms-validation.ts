import type { Lesson } from '@/types';

export const formsValidationLesson: Lesson = {
  id: 'nextjs-forms-validation',
  slug: 'nextjs-forms-validation',
  title: 'Forms and Validation',
  description:
    'Master form architecture in Next.js — server validation with Zod, client validation, error state management, react-hook-form integration, file uploads, and multi-step forms.',
  category: 'Forms',
  order: 14,
  difficulty: 'intermediate',
  estimatedTime: 50,
  prevLesson: 'nextjs-database-integration',
  nextLesson: 'nextjs-state-management',

  content: `# Forms and Validation

## Form Architecture in Next.js

Next.js offers two main approaches to forms:

### Approach 1: Server Actions (recommended for most cases)

\`\`\`
User submits form →
Next.js serializes FormData →
Server Action runs validation and mutation →
Returns state (errors or success) →
Form updates
\`\`\`

Benefits: works without JS, simpler mental model, full-stack type safety.

### Approach 2: Client-Side Form Libraries (react-hook-form)

\`\`\`
User interacts with form →
react-hook-form manages state + validation →
User submits →
Calls API endpoint or Server Action →
Handles response
\`\`\`

Benefits: rich validation UX, real-time feedback, complex form interactions.

---

## Server-Side Validation with Zod

This is the most important pattern: **always validate on the server**, regardless of client validation.

\`\`\`tsx
// lib/schemas/user.ts — Reusable Zod schemas

import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Attach error to the confirmPassword field
  }
);

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  bio: z.string().max(500).optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  avatarUrl: z.string().url().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
\`\`\`

---

## The Complete Form Pattern

\`\`\`tsx
// Server Action with full validation and error state

// lib/actions/auth.ts
"use server";

import { z } from 'zod';
import { RegisterSchema } from '@/lib/schemas/user';
import { revalidatePath } from 'next/cache';

export type RegisterState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[]; // General form errors
  };
  success?: boolean;
};

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // 1. Validate input
  const result = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 2. Check for duplicates
  const existing = await db.user.findUnique({
    where: { email: result.data.email },
  });

  if (existing) {
    return {
      errors: { email: ['An account with this email already exists'] },
    };
  }

  // 3. Create user
  try {
    await db.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        hashedPassword: await bcrypt.hash(result.data.password, 12),
      },
    });

    return { success: true };
  } catch (error) {
    return {
      errors: { _form: ['Failed to create account. Please try again.'] },
    };
  }
}
\`\`\`

\`\`\`tsx
// app/register/RegisterForm.tsx — Client Component
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { register, type RegisterState } from '@/lib/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  );
}

// FieldError component for DRY error display
function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p className="text-sm text-red-500 mt-1" role="alert">
      {errors[0]}
    </p>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState<RegisterState, FormData>(register, {});

  if (state.success) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-green-700">Account created!</h2>
        <p className="mt-2 text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in to continue →
          </a>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {/* Global form error */}
      {state.errors?._form && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-sm text-red-700">{state.errors._form[0]}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="mt-1 w-full border rounded px-3 py-2"
          aria-describedby={state.errors?.name ? 'name-error' : undefined}
        />
        <FieldError errors={state.errors?.name} />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full border rounded px-3 py-2"
        />
        <FieldError errors={state.errors?.email} />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full border rounded px-3 py-2"
        />
        <FieldError errors={state.errors?.password} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="mt-1 w-full border rounded px-3 py-2"
        />
        <FieldError errors={state.errors?.confirmPassword} />
      </div>

      <SubmitButton />
    </form>
  );
}
\`\`\`

---

## react-hook-form with Server Actions

For complex forms with real-time validation:

\`\`\`tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProject } from '@/lib/actions/projects';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  description: z.string().max(500).optional(),
  color: z.enum(['red', 'blue', 'green', 'purple'], {
    errorMap: () => ({ message: 'Please select a color' }),
  }),
  isPublic: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

export function CreateProjectForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),  // Client-side validation with Zod
    defaultValues: { isPublic: false },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);

    // Convert to FormData for Server Action
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      formData.append(key, String(val));
    });

    const result = await createProject({}, formData);

    if (result.errors?._form) {
      setServerError(result.errors._form[0]);
    } else if (result.success) {
      setSuccess(true);
      reset();
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label>Project Name</label>
        <input
          {...register('name')}
          className="w-full border rounded px-3 py-2"
          placeholder="My Project"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea
          {...register('description')}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label>Color</label>
        <select {...register('color')} className="w-full border rounded px-3 py-2">
          <option value="">Select a color</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
        </select>
        {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isPublic" {...register('isPublic')} />
        <label htmlFor="isPublic">Make this project public</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
\`\`\`

---

## File Uploads

\`\`\`tsx
// Server Action for file upload
"use server";

export async function uploadAvatar(formData: FormData) {
  const file = formData.get('avatar') as File;

  if (!file || file.size === 0) {
    return { error: 'No file provided' };
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Only JPEG, PNG, and WebP files are allowed' };
  }

  // Validate file size (5MB max)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { error: 'File must be smaller than 5MB' };
  }

  // Upload to storage (S3, Cloudflare R2, Vercel Blob, etc.)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const url = await uploadToStorage(buffer, file.name, file.type);

  // Update user avatar
  const user = await requireAuth();
  await db.user.update({
    where: { id: user.id },
    data: { avatarUrl: url },
  });

  revalidatePath('/settings');
  return { success: true, url };
}
\`\`\`

---

## When to Use Server Actions vs API + fetch

| Form type | Use |
|---|---|
| Simple forms (login, register, contact) | Server Actions |
| Forms with real-time validation | react-hook-form + Server Action |
| Complex multi-step wizards | react-hook-form + Server Action |
| File uploads (small files) | Server Actions |
| File uploads (large files, streaming) | API Route with streaming |
| Forms consumed by mobile app too | API Route |`,

  codeExamples: [
    {
      title: 'Multi-step form with state preservation',
      code: `// A multi-step onboarding form
// Step 1: Personal info → Step 2: Company info → Step 3: Preferences

"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { completeOnboarding } from '@/lib/actions/onboarding';

const Step1Schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  jobTitle: z.string().min(1),
});

const Step2Schema = z.object({
  companyName: z.string().min(1),
  companySize: z.enum(['1-10', '11-50', '51-200', '200+']),
  industry: z.string().min(1),
});

const Step3Schema = z.object({
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
});

type Step1 = z.infer<typeof Step1Schema>;
type Step2 = z.infer<typeof Step2Schema>;
type Step3 = z.infer<typeof Step3Schema>;

type AllData = Step1 & Step2 & Step3;

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AllData>>({});
  const [error, setError] = useState<string | null>(null);

  const step1Form = useForm<Step1>({ resolver: zodResolver(Step1Schema) });
  const step2Form = useForm<Step2>({ resolver: zodResolver(Step2Schema) });
  const step3Form = useForm<Step3>({
    resolver: zodResolver(Step3Schema),
    defaultValues: { notifications: true, theme: 'system', language: 'en' },
  });

  const handleStep1 = step1Form.handleSubmit(async (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  });

  const handleStep2 = step2Form.handleSubmit(async (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  });

  const handleStep3 = step3Form.handleSubmit(async (data) => {
    const allData = { ...formData, ...data } as AllData;

    // Convert to FormData for Server Action
    const fd = new FormData();
    Object.entries(allData).forEach(([k, v]) => fd.append(k, String(v)));

    const result = await completeOnboarding({}, fd);
    if (result.error) setError(result.error);
  });

  return (
    <div className="max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className={\`h-2 flex-1 rounded \${s <= step ? 'bg-blue-600' : 'bg-gray-200'}\`} />
        ))}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-4">
          <h2 className="text-xl font-bold">Personal Information</h2>
          <input {...step1Form.register('firstName')} placeholder="First Name" className="w-full border rounded px-3 py-2" />
          {step1Form.formState.errors.firstName && <p className="text-red-500 text-sm">First name required</p>}
          <input {...step1Form.register('lastName')} placeholder="Last Name" className="w-full border rounded px-3 py-2" />
          <input {...step1Form.register('jobTitle')} placeholder="Job Title" className="w-full border rounded px-3 py-2" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Next →</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2} className="space-y-4">
          <h2 className="text-xl font-bold">Company Information</h2>
          <input {...step2Form.register('companyName')} placeholder="Company Name" className="w-full border rounded px-3 py-2" />
          <select {...step2Form.register('companySize')} className="w-full border rounded px-3 py-2">
            <option value="">Company Size</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="200+">200+</option>
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="flex-1 border py-2 rounded">← Back</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Next →</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleStep3} className="space-y-4">
          <h2 className="text-xl font-bold">Preferences</h2>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...step3Form.register('notifications')} id="notif" />
            <label htmlFor="notif">Email notifications</label>
          </div>
          <select {...step3Form.register('theme')} className="w-full border rounded px-3 py-2">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="flex-1 border py-2 rounded">← Back</button>
            <button
              type="submit"
              disabled={step3Form.formState.isSubmitting}
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              {step3Form.formState.isSubmitting ? 'Finishing...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}`,
      explanation:
        'Multi-step forms preserve data between steps in local state. Each step validates its own schema. On the final step, all accumulated data is submitted via Server Action. react-hook-form manages per-step validation.',
    },
  ],

  commonMistakes: [
    'Trusting client-side validation alone — always validate on the server. Client validation is UX, server validation is security.',
    'Not showing which field has the error — return field-specific errors, not just generic messages.',
    'Not preventing double submission — disable the submit button while pending (useFormStatus or isSubmitting).',
    'Using uncontrolled inputs without defaultValue when server returns an error — users lose their input after a failed submission.',
    'Not clearing sensitive fields on error — never re-populate password fields from server state.',
    'Skipping accessibility — form errors should be announced to screen readers (role="alert" on error messages).',
  ],

  interviewQuestions: [
    {
      question: 'What is the difference between client-side and server-side validation? Which is more important?',
      answer:
        "Server-side validation is MORE important. Client-side validation can be bypassed by anyone who opens DevTools or sends a direct HTTP request. A malicious user can submit any data to your Server Action or API endpoint regardless of client validation. Server-side validation (Zod) is your actual security boundary. Client-side validation (react-hook-form) is a UX improvement — it gives immediate feedback without a network round trip, making the form feel responsive. The pattern: always validate on the server for correctness and security; optionally add client validation for better UX. The same Zod schema can be used for both.",
      difficulty: 'beginner',
    },
    {
      question: 'How does useFormStatus work and why is SubmitButton a separate component?',
      answer:
        "useFormStatus is a React hook that reads the state of the nearest parent form. It returns { pending: boolean, data: FormData, method, action }. It must be called in a component that is a child of the form — it cannot be called in the same component as the form itself. This is why the submit button is extracted to a separate SubmitButton component. When the form is submitting, pending becomes true, allowing the button to be disabled and show a loading state. This prevents double submissions and gives users feedback that something is happening.",
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'form-ex-1',
      title: 'Build a settings form with real-time validation',
      description: `Build a profile settings form that:
1. Has fields: name (required, 2-50 chars), bio (optional, max 300 chars), website (optional, valid URL)
2. Shows real-time character count for bio
3. Shows validation errors as user types
4. Submits to a Server Action
5. Shows success/error state after submission`,
      starterCode: `// TODO: Build the complete form
// Use react-hook-form + Zod for client validation
// Submit to a Server Action

// The Server Action (already provided):
// async function updateProfile(prev, formData): Promise<{ success?: boolean; error?: string }>

// Your task: build the form component with:
// - real-time validation (react-hook-form + zodResolver)
// - character counter for bio
// - proper error display per field
// - disabled state during submission`,
      solution: `"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { updateProfile } from '@/lib/actions/profile';

const ProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional().default(''),
  website: z
    .string()
    .url('Please enter a valid URL (include https://)')
    .optional()
    .or(z.literal('')),
});

type ProfileValues = z.infer<typeof ProfileSchema>;

export function ProfileSettingsForm({ defaultValues }: { defaultValues?: Partial<ProfileValues> }) {
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: defaultValues ?? {},
  });

  const bioValue = watch('bio') ?? '';

  const onSubmit = handleSubmit(async (data) => {
    setServerMessage(null);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => v && fd.append(k, v));
    const result = await updateProfile({}, fd);
    if (result.success) {
      setServerMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else if (result.error) {
      setServerMessage({ type: 'error', text: result.error });
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-6">
      {serverMessage && (
        <div className={\`p-3 rounded text-sm \${
          serverMessage.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }\`}>
          {serverMessage.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          {...register('name')}
          className={\`w-full border rounded px-3 py-2 \${errors.name ? 'border-red-400' : 'border-gray-300'}\`}
          placeholder="Your full name"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <label className="text-sm font-medium">Bio</label>
          <span className={\`text-xs \${bioValue.length > 280 ? 'text-red-500' : 'text-gray-400'}\`}>
            {bioValue.length}/300
          </span>
        </div>
        <textarea
          {...register('bio')}
          rows={3}
          className={\`w-full border rounded px-3 py-2 \${errors.bio ? 'border-red-400' : 'border-gray-300'}\`}
          placeholder="Tell us about yourself"
        />
        {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Website</label>
        <input
          {...register('website')}
          type="url"
          className={\`w-full border rounded px-3 py-2 \${errors.website ? 'border-red-400' : 'border-gray-300'}\`}
          placeholder="https://yoursite.com"
        />
        {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}`,
      hints: [
        'watch("bio") gives you the current bio value for the character counter',
        'isDirty from formState disables the button when nothing has changed',
        'zodResolver connects react-hook-form to your Zod schema for real-time validation',
        'The server action call is inside handleSubmit callback — errors are handled in state',
      ],
    },
  ],

  keyTakeaways: [
    'Always validate on the server — client validation is UX, server validation is security.',
    'Use Zod for schema validation — the same schema can run on both client and server.',
    'useFormState tracks Server Action return value; useFormStatus tracks form pending state.',
    'SubmitButton must be a separate component to use useFormStatus (must be a form child).',
    'react-hook-form + zodResolver gives real-time per-field validation as users type.',
    'Multi-step forms: accumulate data in component state, submit all data on the final step.',
    'File uploads in Server Actions: validate type and size, then upload to storage service.',
    'Show errors per-field with role="alert" for accessibility.',
  ],
};
