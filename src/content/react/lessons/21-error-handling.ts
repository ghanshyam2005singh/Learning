import type { Lesson } from '@/types';

export const errorHandlingLesson: Lesson = {
  id: 'error-handling',
  slug: 'error-handling',
  title: 'Error Handling',
  description:
    'Handle errors in React properly — Error Boundaries for component errors, fallback UI, error recovery, API error handling, and monitoring production errors.',
  category: 'Error Handling',
  order: 21,
  difficulty: 'intermediate',
  estimatedTime: 20,
  content: `Errors happen in production. The question is whether they crash the entire app or are contained and recoverable. React provides Error Boundaries to catch rendering errors and prevent them from propagating.

---

## Error Boundaries

An Error Boundary is a class component that catches JavaScript errors in its child component tree and displays a fallback UI instead of crashing the whole app.

Error Boundaries catch errors in:
- Render methods
- Lifecycle methods
- Constructors of child components

Error Boundaries do NOT catch errors in:
- Event handlers (use try/catch)
- Async code (useEffect callbacks)
- Server-side rendering
- Errors in the Error Boundary itself

\`\`\`tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error to monitoring service
    logErrorToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Header />
      <ErrorBoundary fallback={<WidgetError />}>
        <Dashboard />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}
\`\`\`

---

## Error Recovery

Allow users to try again after an error:

\`\`\`tsx
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    FallbackComponent: React.ComponentType<{ error: Error; resetError: () => void }>;
  },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError(error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <this.props.FallbackComponent
          error={this.state.error!}
          resetError={this.reset}
        />
      );
    }
    return this.props.children;
  }
}

// Reusable fallback component
function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div role="alert" className="error-boundary">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  );
}
\`\`\`

---

## react-error-boundary Library

The \`react-error-boundary\` package provides a well-tested Error Boundary with hooks support:

\`\`\`tsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => logError(error, info)}
      onReset={() => window.location.reload()}
    >
      <Dashboard />
    </ErrorBoundary>
  );
}

// Throw errors from async code into the boundary
function AsyncComponent() {
  const { showBoundary } = useErrorBoundary();

  async function fetchData() {
    try {
      const data = await api.getData();
      setData(data);
    } catch (error) {
      showBoundary(error); // Routes the error to the nearest ErrorBoundary
    }
  }
}
\`\`\`

---

## Granular Error Boundaries

Place Error Boundaries strategically to contain failures:

\`\`\`tsx
function Dashboard() {
  return (
    <div className="dashboard">
      {/* If analytics widget crashes, the rest of the dashboard still works */}
      <ErrorBoundary fallback={<WidgetError name="Analytics" />}>
        <AnalyticsWidget />
      </ErrorBoundary>

      <ErrorBoundary fallback={<WidgetError name="Revenue" />}>
        <RevenueChart />
      </ErrorBoundary>

      {/* Critical content — no boundary, let it bubble */}
      <MainContent />
    </div>
  );
}
\`\`\`

---

## Monitoring and Logging

In production, surface errors to monitoring services:

\`\`\`tsx
// With Sentry
import * as Sentry from '@sentry/react';

// Option 1: Use Sentry's built-in Error Boundary
const SentryBoundary = Sentry.withErrorBoundary(App, {
  fallback: <p>An error occurred</p>,
});

// Option 2: Log in componentDidCatch
componentDidCatch(error: Error, info: React.ErrorInfo) {
  Sentry.captureException(error, {
    extra: {
      componentStack: info.componentStack,
    },
  });
}

// Sentry wraps your router for automatic navigation tracking:
Sentry.init({ dsn: 'your-dsn' });
\`\`\`

---

## Async Error Handling

Error Boundaries do not catch async errors. Handle them explicitly:

\`\`\`tsx
function DataComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(err => setError(err)); // Catch async errors
  }, []);

  if (error) {
    return (
      <div role="alert">
        <p>Failed to load data: {error.message}</p>
        <button onClick={() => { setError(null); refetch(); }}>
          Retry
        </button>
      </div>
    );
  }

  return data ? <DataDisplay data={data} /> : <Spinner />;
}
\`\`\``,

  codeExamples: [
    {
      title: 'Full error boundary setup',
      code: `// errorBoundary.tsx — reusable throughout the app

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div role="alert" style={{ padding: 24, textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage at different granularity levels
function App() {
  return (
    // Top-level: catches anything that slips through
    <ErrorBoundary onError={Sentry.captureException}>
      <Router>
        <Layout>
          {/* Route-level: each page can fail independently */}
          <ErrorBoundary>
            <Routes />
          </ErrorBoundary>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}`,
      explanation:
        'The reusable ErrorBoundary provides a default fallback if none is passed. Logging to Sentry happens in onError. The reset function lets users try again without a page reload.',
    },
  ],

  commonMistakes: [
    'Not using Error Boundaries — uncaught render errors crash the entire app.',
    'Putting one Error Boundary at the very top only — individual widget failures take down everything.',
    'Expecting Error Boundaries to catch async errors — they don\'t. Use try/catch in async code.',
    'Not logging errors to a monitoring service — you won\'t know about production errors.',
    'No retry/reset mechanism — users are stuck on the error screen with no way to recover.',
  ],

  interviewQuestions: [
    {
      question: 'What is an Error Boundary in React?',
      answer:
        'An Error Boundary is a React class component that catches JavaScript errors anywhere in its child component tree, logs them, and renders a fallback UI instead of the crashed tree. They use getDerivedStateFromError (to trigger fallback rendering) and componentDidCatch (to log the error). Error Boundaries must be class components — there is no hook equivalent. They do not catch errors in event handlers, async code, or server-side rendering.',
      difficulty: 'intermediate',
    },
    {
      question: 'Why are Error Boundaries class components and not hooks?',
      answer:
        'Error Boundaries require getDerivedStateFromError and componentDidCatch lifecycle methods, which only exist in class components. These methods specifically handle the error propagation mechanism in React\'s reconciler. There is no hook equivalent for catching render-phase errors because hooks run after the render phase. The react-error-boundary library provides a hook useErrorBoundary that lets you programmatically trigger a boundary from async code.',
      difficulty: 'advanced',
    },
  ],

  exercises: [
    {
      id: 'error-ex-1',
      title: 'Add Error Boundaries to a Dashboard',
      description: 'Add Error Boundaries so individual widget failures don\'t crash the whole dashboard. Each widget should show its own error fallback.',
      starterCode: `// Add ErrorBoundary components to prevent widget crashes from cascading

function Dashboard() {
  return (
    <div className="dashboard">
      <StatsWidget />    {/* Sometimes crashes with division by zero */}
      <ChartWidget />    {/* Sometimes crashes when data is null */}
      <TableWidget />    {/* Usually stable */}
    </div>
  );
}`,
      solution: `function WidgetError({ name }: { name: string }) {
  return (
    <div role="alert" className="widget-error">
      <p>{name} failed to load</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="dashboard">
      <ErrorBoundary fallback={<WidgetError name="Stats" />}>
        <StatsWidget />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError name="Chart" />}>
        <ChartWidget />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError name="Table" />}>
        <TableWidget />
      </ErrorBoundary>
    </div>
  );
}`,
      hints: [
        'Wrap each widget in its own ErrorBoundary',
        'Use a simple WidgetError fallback component',
        'The key insight: ErrorBoundaries are granular — one per widget',
      ],
    },
  ],

  keyTakeaways: [
    'Error Boundaries catch render-phase errors in children and show a fallback UI instead of crashing.',
    'Error Boundaries must be class components — use getDerivedStateFromError + componentDidCatch.',
    'Place Error Boundaries granularly — per page, per widget — not only at the app root.',
    'Error Boundaries do NOT catch async errors — handle those with try/catch and error state.',
    'Always log errors to a monitoring service (Sentry) in componentDidCatch.',
    'Provide a reset mechanism so users can recover without a full page reload.',
  ],

  nextLesson: 'react-router',
  prevLesson: 'performance-optimization',
};
