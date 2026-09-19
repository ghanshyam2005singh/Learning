import type { Lesson } from '@/types';

export const serverActionsLesson: Lesson = {
  id: 'nextjs-server-actions',
  slug: 'nextjs-server-actions',
  title: 'Server Actions',
  description:
    'Master Server Actions — what they are, why they exist, form handling, mutations, security, validation with Zod, progressive enhancement, and when to use them vs API endpoints.',
  category: 'Server Actions',
  order: 9,
  difficulty: 'intermediate',
  estimatedTime: 55,
  prevLesson: 'nextjs-data-fetching',
  nextLesson: 'nextjs-api-development',

  content: `# Server Actions

## What are Server Actions?

Server Actions are **async functions that run on the server** but can be called from Client Components. They are the Next.js solution for mutations (creating, updating, deleting data) without needing to create API endpoints.

Before Server Actions, every mutation required:
1. Create an API endpoint (\`/api/posts/create\`)
2. Write the route handler with validation
3. Call it from the client with fetch()
4. Handle loading, error, and success states

With Server Actions:
1. Write an async function with \`"use server"\`
2. Call it from your form or component
3. Done

---

## The "use server" Directive

\`"use server"\` marks a function (or all functions in a file) as a Server Action. This is different from Server Components:

- **Server Components**: No directive needed (default). Run during render.
- **Server Actions**: \`"use server"\` directive. Run when called/invoked (mutations).

\`\`\`tsx
// Method 1: Inline in a Server Component
export default function CreatePostForm() {
  async function createPost(formData: FormData) {
    "use server"; // This function is a Server Action
    const title = formData.get('title') as string;
    await db.post.create({ data: { title } });
    revalidatePath('/posts');
  }

  return (
    <form action={createPost}>
      <input name="title" placeholder="Post title" />
      <button type="submit">Create</button>
    </form>
  );
}

// Method 2: Separate file (better for reuse)
// lib/actions/posts.ts
"use server"; // All functions in this file are Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidatePath('/posts');
}
\`\`\`

---

## How Server Actions Work

When a form action points to a Server Action:

1. User submits the form
2. Next.js serializes the form data
3. Sends it to the server (via POST request, automatically)
4. The Server Action function runs
5. Returns result to client
6. Client updates accordingly

\`\`\`
Form submit → POST request (automatic) → Server Action runs → revalidatePath → page updates
\`\`\`

This works **even without JavaScript** (progressive enhancement). Forms with Server Actions work in browsers that have JS disabled.

---

## Form Handling

### Basic Form

\`\`\`tsx
// app/posts/new/page.tsx
import { createPost } from '@/lib/actions/posts';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <select name="category">
        <option value="tech">Tech</option>
        <option value="life">Life</option>
      </select>
      <button type="submit">Publish Post</button>
    </form>
  );
}

// lib/actions/posts.ts
"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;

  const post = await db.post.create({
    data: { title, content, category, authorId: 'current-user' },
  });

  revalidatePath('/posts'); // Refresh posts list cache
  redirect(\`/posts/\${post.id}\`); // Navigate to the new post
}
\`\`\`

### Form with useFormState and useFormStatus

For showing loading state and error messages:

\`\`\`tsx
// lib/actions/posts.ts
"use server";

import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export type FormState = {
  errors?: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export async function createPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validation = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  try {
    await db.post.create({ data: validation.data });
    revalidatePath('/posts');
    return { success: true };
  } catch (error) {
    return { errors: { _form: ['Failed to create post. Please try again.'] } };
  }
}

// ── Client Component with form status ──────────────────────
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { createPost, type FormState } from '@/lib/actions/posts';

function SubmitButton() {
  const { pending } = useFormStatus(); // Tracks if form is submitting
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Publishing...' : 'Publish Post'}
    </button>
  );
}

export function CreatePostForm() {
  const [state, formAction] = useFormState<FormState, FormData>(
    createPost,
    { errors: {} }
  );

  return (
    <form action={formAction}>
      <div>
        <input name="title" placeholder="Title" />
        {state.errors?.title && (
          <p className="text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <textarea name="content" placeholder="Content" />
        {state.errors?.content && (
          <p className="text-red-500">{state.errors.content[0]}</p>
        )}
      </div>

      {state.errors?._form && (
        <p className="text-red-500">{state.errors._form[0]}</p>
      )}

      {state.success && (
        <p className="text-green-500">Post published successfully!</p>
      )}

      <SubmitButton />
    </form>
  );
}
\`\`\`

---

## Calling Server Actions Programmatically

Server Actions are not only for forms. You can call them from event handlers:

\`\`\`tsx
"use client";

import { deletePost } from '@/lib/actions/posts';
import { useState } from 'react';

export function DeleteButton({ postId }: { postId: string }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    await deletePost(postId); // Called directly — not in a form
    setDeleting(false);
  }

  return (
    <button onClick={handleDelete} disabled={deleting}>
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

// lib/actions/posts.ts
"use server";

export async function deletePost(postId: string) {
  await db.post.delete({ where: { id: postId } });
  revalidatePath('/posts');
}
\`\`\`

---

## Security in Server Actions

Server Actions run on the server but are called from the client. They are essentially API endpoints. You MUST validate and authenticate.

\`\`\`tsx
"use server";

import { getCurrentUserId } from '@/lib/auth';
import { z } from 'zod';

const UpdatePostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

export async function updatePost(postId: string, formData: FormData) {
  // 1. ALWAYS verify authentication
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('Unauthorized');
    // OR: redirect('/login')
  }

  // 2. ALWAYS verify authorization (ownership check)
  const existingPost = await db.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!existingPost) throw new Error('Post not found');
  if (existingPost.authorId !== userId) throw new Error('Forbidden');

  // 3. ALWAYS validate inputs
  const validation = UpdatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validation.success) {
    throw new Error('Invalid input');
  }

  // 4. SAFE to perform the mutation
  await db.post.update({
    where: { id: postId },
    data: validation.data,
  });

  revalidatePath(\`/posts/\${postId}\`);
}

// NEVER trust:
// - The postId parameter (could be forged)
// - The formData content (validate with Zod)
// - That the caller is the owner (always check in DB)
\`\`\`

---

## Optimistic Updates

For instant UI feedback before the server responds:

\`\`\`tsx
"use client";

import { useOptimistic } from 'react';
import { toggleLike } from '@/lib/actions/likes';

export function LikeButton({
  postId,
  initialLikes,
  initialLiked,
}: {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}) {
  const [optimisticState, addOptimistic] = useOptimistic(
    { likes: initialLikes, liked: initialLiked },
    (state, optimisticValue: 'like' | 'unlike') => ({
      likes: optimisticValue === 'like' ? state.likes + 1 : state.likes - 1,
      liked: optimisticValue === 'like',
    })
  );

  async function handleToggle() {
    // Update UI IMMEDIATELY
    addOptimistic(optimisticState.liked ? 'unlike' : 'like');

    // Then actually do it on the server
    await toggleLike(postId);
  }

  return (
    <button onClick={handleToggle}>
      {optimisticState.liked ? '❤️' : '🤍'} {optimisticState.likes}
    </button>
  );
  // If toggleLike fails, React reverts to the real server state
}
\`\`\`

---

## Server Actions vs API Routes

| | Server Actions | API Routes |
|---|---|---|
| Purpose | Mutations from React components | General HTTP API (REST) |
| Calling | From form action or directly | Via fetch() |
| Authentication | Access server context directly | Must parse from request |
| Type safety | Types flow through naturally | Need to manually type request/response |
| External clients | Cannot call from mobile app or other services | Can be called from anywhere |
| Progressive enhancement | Works without JavaScript | Requires JavaScript |
| Use from Server Component | Yes | No (would need fetch) |

**When to use Server Actions:**
- Form submissions from your own Next.js frontend
- Mutations triggered by user interactions in your app
- When you want full-stack type safety without an API layer

**When to use API Routes:**
- Your API is consumed by mobile apps, third-party services, or other teams
- You need webhook endpoints (Stripe, GitHub, etc.)
- You need fine-grained HTTP control (custom status codes, headers)
- You're building a public API

---

## revalidatePath and revalidateTag

After a mutation, you typically need to update cached data:

\`\`\`tsx
"use server";

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createComment(postId: string, formData: FormData) {
  const content = formData.get('content') as string;

  await db.comment.create({
    data: { content, postId, authorId: 'user-123' },
  });

  // Option 1: Revalidate a specific page path
  revalidatePath(\`/posts/\${postId}\`);

  // Option 2: Revalidate all pages matching a pattern
  revalidatePath('/posts/[postId]', 'page');

  // Option 3: Revalidate by cache tag (if you tagged fetches)
  revalidateTag(\`post-\${postId}-comments\`);

  // Option 4: Redirect after mutation
  redirect(\`/posts/\${postId}#comments\`);
}
\`\`\``,

  codeExamples: [
    {
      title: 'Full-featured form with Server Action + Zod validation',
      code: `// lib/actions/contact.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['support', 'sales', 'general'], {
    errorMap: () => ({ message: 'Please select a subject' }),
  }),
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

export type ContactFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
};

export async function submitContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // 1. Validate all inputs
  const result = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 2. Rate limiting (in production, check IP or user session)
  const ip = 'user-ip'; // Would come from headers()
  const recentSubmissions = await db.contactSubmission.count({
    where: {
      ip,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // last hour
    },
  });

  if (recentSubmissions >= 3) {
    return {
      errors: { message: ['Too many submissions. Please wait before trying again.'] },
    };
  }

  // 3. Save to database
  await db.contactSubmission.create({
    data: { ...result.data, ip },
  });

  // 4. Send email notification (fire and forget)
  sendEmailNotification(result.data).catch(console.error);

  return {
    success: true,
    message: 'Your message has been sent. We will get back to you within 24 hours.',
  };
}

// ── Client Component ───────────────────────────────────────────
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { submitContact, type ContactFormState } from '@/lib/actions/contact';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useFormState<ContactFormState, FormData>(
    submitContact,
    {}
  );

  if (state.success) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-lg">
        <h2 className="text-green-800 font-semibold">Message Sent!</h2>
        <p className="text-green-600 mt-2">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required className="w-full border rounded px-3 py-2" />
        {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="w-full border rounded px-3 py-2" />
        {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="subject">Subject</label>
        <select id="subject" name="subject" className="w-full border rounded px-3 py-2">
          <option value="">Select a subject</option>
          <option value="support">Support</option>
          <option value="sales">Sales</option>
          <option value="general">General</option>
        </select>
        {state.errors?.subject && <p className="text-red-500 text-sm">{state.errors.subject[0]}</p>}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} className="w-full border rounded px-3 py-2" />
        {state.errors?.message && <p className="text-red-500 text-sm">{state.errors.message[0]}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}`,
      explanation:
        'A production contact form uses Zod for validation, rate limiting for abuse prevention, and returns typed error state that the form displays per-field. useFormState tracks the action result; useFormStatus tracks the pending state for the submit button.',
    },
  ],

  commonMistakes: [
    'Not validating inputs in Server Actions — they receive raw user input, always validate with Zod.',
    'Not checking authentication and authorization — Server Actions are API endpoints under the hood; never skip auth checks.',
    'Trying to use Server Actions in Client Component files that import them as default exports — they must be named exports from "use server" files.',
    'Calling revalidatePath with the wrong path — the path must match exactly the route pattern in your app directory.',
    'Throwing errors without user-friendly messages — errors thrown in Server Actions propagate to error.tsx; return error state instead of throwing for form validation failures.',
    'Using Server Actions for GET operations (data fetching) — Server Actions are for mutations. Use Server Components with async/await for reads.',
  ],

  interviewQuestions: [
    {
      question: 'What are Server Actions and how do they differ from API routes?',
      answer:
        'Server Actions are async functions marked with "use server" that run on the server but can be called from Client Components. They are designed for mutations (create, update, delete) from React components. API routes are full HTTP endpoints accessible from anywhere. Key differences: Server Actions are called directly as JavaScript functions (Next.js handles the HTTP transport automatically), support progressive enhancement (work without JavaScript via HTML form action attribute), have natural TypeScript flow-through, and can only be called from your own Next.js frontend. API routes are conventional HTTP endpoints callable from mobile apps, third parties, and webhooks. Use Server Actions for mutations in your own UI; use API routes for public APIs or external integrations.',
      difficulty: 'intermediate',
    },
    {
      question: 'What security checks must you always perform in a Server Action?',
      answer:
        'Three mandatory security checks: (1) Authentication — verify the user is logged in. Never assume the caller is authenticated. Call getCurrentUser() or equivalent and throw/redirect if not authenticated. (2) Authorization — verify the user has permission for the specific resource. Just because a user is logged in does not mean they own the post they are trying to delete. Always fetch the resource and check ownership. (3) Validation — validate all inputs with a schema (Zod). Never trust FormData or function arguments — they can contain anything. Server Actions are essentially POST endpoints; treat them with the same security mindset.',
      difficulty: 'intermediate',
    },
    {
      question: 'What is progressive enhancement in the context of Server Actions?',
      answer:
        'Progressive enhancement means the core functionality works without JavaScript. When a form\'s action attribute points to a Server Action, it works as a standard HTML form submission — even in browsers with JavaScript disabled. The form serializes its data, POSTs it to the server, and the page reloads with the result. With JavaScript enabled, Next.js intercepts the submission, sends it via fetch, and updates the page without a full reload. This is important for: accessibility (screen readers, assistive tech), resilience (JS bundle fails to load), and SEO (bots that do not execute JS). With useFormState, you can add rich loading/error UX while still maintaining the no-JS baseline.',
      difficulty: 'intermediate',
    },
  ],

  exercises: [
    {
      id: 'sa-ex-1',
      title: 'Build a task management CRUD with Server Actions',
      description: `Implement a simple task manager with Server Actions:
1. createTask(formData) — creates a new task
2. toggleTask(taskId) — marks task complete/incomplete
3. deleteTask(taskId) — deletes a task

Requirements:
- Validate task title: required, min 3 chars, max 200 chars
- After each mutation, revalidate the page
- Add auth check (mock: pretend user is always logged in as user-123)
- Use Zod for validation`,
      starterCode: `// Mock DB
const tasks = new Map<string, { id: string; title: string; completed: boolean; userId: string }>();

// TODO: Create lib/actions/tasks.ts with:
// 1. createTask(prevState, formData) → FormState
// 2. toggleTask(taskId) → void
// 3. deleteTask(taskId) → void

// TODO: Create app/tasks/page.tsx with:
// - List all tasks
// - Create task form
// - Toggle and delete buttons per task

// Define the types:
type FormState = {
  errors?: { title?: string[] };
  success?: boolean;
};`,
      solution: `// lib/actions/tasks.ts
"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const TaskSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
});

export type TaskFormState = { errors?: { title?: string[] }; success?: boolean };

const MOCK_USER_ID = 'user-123';

export async function createTask(
  prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const userId = MOCK_USER_ID; // In real app: await getCurrentUserId()

  const result = TaskSchema.safeParse({ title: formData.get('title') });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  await db.task.create({
    data: { title: result.data.title, userId, completed: false },
  });

  revalidatePath('/tasks');
  return { success: true };
}

export async function toggleTask(taskId: string) {
  const userId = MOCK_USER_ID;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) throw new Error('Forbidden');

  await db.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });

  revalidatePath('/tasks');
}

export async function deleteTask(taskId: string) {
  const userId = MOCK_USER_ID;

  const task = await db.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) throw new Error('Forbidden');

  await db.task.delete({ where: { id: taskId } });
  revalidatePath('/tasks');
}

// ── app/tasks/page.tsx ────────────────────────────────────────
import { useFormState, useFormStatus } from 'react-dom';
import { createTask, toggleTask, deleteTask } from '@/lib/actions/tasks';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Task'}
    </button>
  );
}

// Client Component for the create form
"use client";
export function CreateTaskForm() {
  const [state, action] = useFormState(createTask, {});
  return (
    <form action={action}>
      <input name="title" placeholder="New task..." />
      {state.errors?.title && <p className="text-red-500">{state.errors.title[0]}</p>}
      <SubmitButton />
    </form>
  );
}

// Server Component for the page
export default async function TasksPage() {
  const tasks = await db.task.findMany({ where: { userId: 'user-123' } });
  return (
    <div>
      <h1>My Tasks</h1>
      <CreateTaskForm />
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="flex gap-2">
            <form action={toggleTask.bind(null, task.id)}>
              <button type="submit">
                {task.completed ? '✓' : '○'}
              </button>
            </form>
            <span className={task.completed ? 'line-through' : ''}>
              {task.title}
            </span>
            <form action={deleteTask.bind(null, task.id)}>
              <button type="submit">🗑</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      hints: [
        'Server Actions need "use server" at file level or inside the function',
        'For toggle and delete (called from form without formData), use .bind(null, id) to pre-bind the ID',
        'Always check ownership before mutating — the taskId could be forged',
        'revalidatePath("/tasks") after every mutation so the list stays current',
      ],
    },
  ],

  keyTakeaways: [
    '"use server" marks a function as a Server Action — it runs on the server but can be called from Client Components.',
    'Server Actions replace the API endpoint + fetch() pattern for mutations within your own Next.js app.',
    'Forms can use Server Actions via the action attribute — this works even without JavaScript (progressive enhancement).',
    'Always: validate inputs with Zod, check authentication, check authorization in every Server Action.',
    'useFormState tracks the Server Action return value; useFormStatus tracks the pending state.',
    'revalidatePath() or revalidateTag() refreshes cached data after a mutation.',
    'Optimistic updates with useOptimistic give instant UI feedback while the server processes.',
    'Server Actions are for mutations. For reads, use Server Components with async/await.',
  ],
};
