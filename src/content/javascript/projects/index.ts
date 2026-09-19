import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'counter-app',
    slug: 'counter-app',
    title: 'Counter App',
    description: 'Build an interactive counter with increment, decrement, reset, and min/max limits.',
    difficulty: 'beginner',
    estimatedTime: '1 hour',
    techStack: ['HTML', 'CSS', 'Vanilla JavaScript'],
    features: [
      'Increment and decrement counter',
      'Reset to zero',
      'Min/max limits (e.g., 0 to 100)',
      'Button disabled state at limits',
      'Step size customization',
    ],
    folderStructure: `counter-app/
├── index.html
├── style.css
└── app.js`,
    steps: [
      {
        title: 'Create the HTML structure',
        description: 'Build the HTML with a display and three buttons (decrement, reset, increment).',
        code: `<!DOCTYPE html>
<html>
<head>
  <title>Counter App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="counter">
    <h1 id="display">0</h1>
    <div class="buttons">
      <button id="dec">-</button>
      <button id="reset">Reset</button>
      <button id="inc">+</button>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        title: 'Initialize state and query DOM',
        description: 'Set up the initial state and select DOM elements.',
        code: `const display = document.getElementById('display');
const decBtn   = document.getElementById('dec');
const incBtn   = document.getElementById('inc');
const resetBtn = document.getElementById('reset');

let count = 0;
const MIN = 0;
const MAX = 100;`,
      },
      {
        title: 'Write the render function',
        description: 'Create a function that updates the UI based on current state.',
        code: `function render() {
  display.textContent = count;
  decBtn.disabled = count <= MIN;
  incBtn.disabled = count >= MAX;
  display.style.color = count < 0 ? 'red' : count > 0 ? 'green' : 'white';
}`,
        hint: 'Always update UI through render() — never modify DOM directly in event handlers.',
      },
      {
        title: 'Add event listeners',
        description: 'Wire up button clicks to state changes.',
        code: `incBtn.addEventListener('click', () => {
  if (count < MAX) count++;
  render();
});

decBtn.addEventListener('click', () => {
  if (count > MIN) count--;
  render();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  render();
});

// Initial render
render();`,
      },
      {
        title: 'Add keyboard support',
        description: 'Allow ArrowUp/ArrowDown keys to control the counter.',
        code: `document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') incBtn.click();
  if (e.key === 'ArrowDown') decBtn.click();
  if (e.key === 'r' || e.key === 'R') resetBtn.click();
});`,
        hint: 'Trigger the button\'s click to keep all logic in one place.',
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use a render() function instead of directly modifying the DOM in each handler?',
        answer: 'Centralizing rendering ensures the UI always reflects the current state. Without it, you risk bugs where UI gets out of sync. This is the foundation of the state → render pattern used by React and other frameworks.',
        difficulty: 'beginner',
      },
      {
        question: 'How would you persist the counter value across page reloads?',
        answer: 'Use localStorage. On change: localStorage.setItem("count", count). On load: count = parseInt(localStorage.getItem("count") || "0"). This persists data in the browser without a server.',
        difficulty: 'beginner',
      },
    ],
    tags: ['dom', 'events', 'state-management', 'beginner'],
  },
  {
    id: 'todo-app',
    slug: 'todo-app',
    title: 'Todo App with localStorage',
    description: 'Build a full-featured Todo app with localStorage persistence, filters, and drag-to-delete.',
    difficulty: 'beginner',
    estimatedTime: '2-3 hours',
    techStack: ['HTML', 'CSS', 'Vanilla JavaScript', 'localStorage'],
    features: [
      'Add new todos',
      'Mark todos as complete',
      'Delete individual todos',
      'Filter: All / Active / Completed',
      'Persist todos to localStorage',
      'Clear all completed',
      'Todo count display',
    ],
    folderStructure: `todo-app/
├── index.html
├── style.css
└── app.js`,
    steps: [
      {
        title: 'Design the data model',
        description: 'Define what a todo looks like and how to store the list.',
        code: `// Todo shape
// { id: string, text: string, completed: boolean, createdAt: number }

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let filter = 'all'; // 'all' | 'active' | 'completed'

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}`,
      },
      {
        title: 'CRUD operations',
        description: 'Functions to add, toggle, and delete todos.',
        code: `function addTodo(text) {
  todos.push({
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  render();
}`,
      },
      {
        title: 'Filter and render',
        description: 'Filter todos based on current filter and render the list.',
        code: `function getFilteredTodos() {
  if (filter === 'active') return todos.filter(t => !t.completed);
  if (filter === 'completed') return todos.filter(t => t.completed);
  return todos;
}

function render() {
  const list = document.getElementById('todo-list');
  const filtered = getFilteredTodos();

  list.innerHTML = filtered.map(todo => \`
    <li class="todo-item \${todo.completed ? 'completed' : ''}" data-id="\${todo.id}">
      <input type="checkbox" \${todo.completed ? 'checked' : ''}>
      <span>\${escapeHtml(todo.text)}</span>
      <button class="delete-btn">×</button>
    </li>
  \`).join('');

  document.getElementById('count').textContent =
    todos.filter(t => !t.completed).length + ' items left';
}

// IMPORTANT: escape user input to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}`,
        hint: 'Always escape user input before inserting into innerHTML to prevent XSS attacks.',
      },
      {
        title: 'Event delegation for todo actions',
        description: 'Use event delegation on the list to handle clicks on dynamically created items.',
        code: `document.getElementById('todo-list').addEventListener('click', (e) => {
  const li = e.target.closest('.todo-item');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.matches('input[type="checkbox"]')) {
    toggleTodo(id);
  } else if (e.target.matches('.delete-btn')) {
    deleteTodo(id);
  }
});`,
        hint: 'Event delegation is crucial here because the list items are dynamically rendered.',
      },
      {
        title: 'Add input and filter handlers',
        description: 'Handle form submission and filter button clicks.',
        code: `document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  if (input.value.trim()) {
    addTodo(input.value);
    input.value = '';
  }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

render();`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why use event delegation instead of adding listeners to each todo item?',
        answer: 'Todo items are dynamically added/removed. If you add listeners to each item, you need to add/remove them manually. Event delegation adds one listener to the parent, which handles events from all current and future children via bubbling. It is also more memory-efficient.',
        difficulty: 'intermediate',
      },
      {
        question: 'Why did you use escapeHtml before inserting user input into innerHTML?',
        answer: 'To prevent XSS (Cross-Site Scripting). If a user types <script>alert("hack")</script> as a todo, inserting it directly with innerHTML would execute the script. Escaping converts < to &lt; which displays but doesn\'t execute.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['dom', 'localStorage', 'events', 'beginner'],
  },
  {
    id: 'weather-app',
    slug: 'weather-app',
    title: 'Weather App',
    description: 'Build a weather app using the free Open-Meteo API (no API key required).',
    difficulty: 'intermediate',
    estimatedTime: '3-4 hours',
    techStack: ['HTML', 'CSS', 'Vanilla JavaScript', 'Fetch API', 'Open-Meteo API'],
    features: [
      'Get current weather by city name',
      'Display temperature, wind speed, weather condition',
      'Loading and error states',
      'Geolocation support',
      'Recent searches stored in localStorage',
    ],
    folderStructure: `weather-app/
├── index.html
├── style.css
└── app.js`,
    steps: [
      {
        title: 'Understand the APIs',
        description: 'Open-Meteo requires lat/lon. Use geocoding API to get coordinates from city name.',
        code: `// Step 1: Geocoding — city name → lat/lon
// https://geocoding-api.open-meteo.com/v1/search?name=London

// Step 2: Weather — lat/lon → weather data
// https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current_weather=true`,
      },
      {
        title: 'Create the API functions',
        description: 'Fetch city coordinates, then weather data.',
        code: `async function getCityCoords(city) {
  const url = \`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(city)}&count=1\`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (!data.results?.length) throw new Error(\`City "\${city}" not found\`);
  return data.results[0]; // { name, latitude, longitude, country }
}

async function getWeather(lat, lon) {
  const url = \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current_weather=true&hourly=temperature_2m,windspeed_10m\`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
}

const WMO_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 51: 'Light drizzle', 61: 'Slight rain', 71: 'Slight snow',
  80: 'Rain showers', 95: 'Thunderstorm',
};`,
      },
      {
        title: 'Build the main search flow',
        description: 'Orchestrate geocoding and weather fetch with loading/error states.',
        code: `async function searchWeather(city) {
  const display = document.getElementById('weather-display');
  const loading = document.getElementById('loading');

  try {
    loading.style.display = 'block';
    display.innerHTML = '';

    const location = await getCityCoords(city);
    const weather = await getWeather(location.latitude, location.longitude);
    const current = weather.current_weather;

    display.innerHTML = \`
      <h2>\${location.name}, \${location.country}</h2>
      <p class="temp">\${current.temperature}°C</p>
      <p>\${WMO_CODES[current.weathercode] || 'Unknown'}</p>
      <p>Wind: \${current.windspeed} km/h</p>
    \`;

    saveRecentSearch(city);
  } catch (err) {
    display.innerHTML = \`<p class="error">Error: \${err.message}</p>\`;
  } finally {
    loading.style.display = 'none';
  }
}`,
      },
      {
        title: 'Add geolocation',
        description: 'Get weather for user\'s current location.',
        code: `document.getElementById('location-btn').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      const weather = await getWeather(coords.latitude, coords.longitude);
      renderWeather(weather, 'Your location');
    },
    () => alert('Location access denied')
  );
});`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why do you use encodeURIComponent on the city name?',
        answer: 'City names can contain spaces, accents, and special characters. encodeURIComponent encodes these into URL-safe percent-encoded strings (e.g., "São Paulo" → "S%C3%A3o%20Paulo"). Without it, the URL would be malformed.',
        difficulty: 'intermediate',
      },
      {
        question: 'How does the try/catch in an async function handle network errors?',
        answer: 'When fetch() fails (network down, timeout) or res.json() fails, they throw. await unwraps the promise, and if it rejects, the error is thrown at the await line. try/catch around the await block catches it just like synchronous errors.',
        difficulty: 'intermediate',
      },
    ],
    tags: ['fetch-api', 'async-await', 'dom', 'intermediate'],
  },
  {
    id: 'quiz-app',
    slug: 'quiz-app',
    title: 'Quiz App',
    description: 'Interactive quiz with timer, score tracking, and question randomization.',
    difficulty: 'intermediate',
    estimatedTime: '3-4 hours',
    techStack: ['HTML', 'CSS', 'Vanilla JavaScript'],
    features: [
      'Multiple choice questions',
      'Countdown timer per question',
      'Score tracking',
      'Question randomization',
      'Results screen with review',
      'Progress bar',
    ],
    folderStructure: `quiz-app/
├── index.html
├── style.css
├── app.js
└── questions.js`,
    steps: [
      {
        title: 'Define question data',
        description: 'Create a questions array with question, options, and correct answer.',
        code: `const questions = [
  {
    question: "What does 'typeof null' return?",
    options: ["null", "object", "undefined", "error"],
    correct: 1,  // index of correct option
    explanation: "typeof null === 'object' is a historical bug"
  },
  {
    question: "Which method does NOT mutate the array?",
    options: ["push", "pop", "map", "splice"],
    correct: 2,
    explanation: "map returns a new array"
  },
  // add more...
];`,
      },
      {
        title: 'Quiz state management',
        description: 'Track current question, score, and timer.',
        code: `let state = {
  questions: shuffle([...questions]),
  currentIndex: 0,
  score: 0,
  answers: [],
  timer: null,
  timeLeft: 15
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}`,
      },
      {
        title: 'Render current question',
        description: 'Display question and options.',
        code: `function renderQuestion() {
  const q = state.questions[state.currentIndex];
  document.getElementById('question').textContent = q.question;
  document.getElementById('progress').textContent =
    \`Question \${state.currentIndex + 1} of \${state.questions.length}\`;

  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = q.options.map((opt, i) => \`
    <button class="option" data-index="\${i}">\${opt}</button>
  \`).join('');

  startTimer();
}`,
      },
      {
        title: 'Handle answer and timer',
        description: 'Process answer selection and manage the countdown timer.',
        code: `function handleAnswer(selectedIndex) {
  clearInterval(state.timer);
  const q = state.questions[state.currentIndex];
  const isCorrect = selectedIndex === q.correct;

  if (isCorrect) state.score++;
  state.answers.push({ question: q.question, selected: selectedIndex, correct: q.correct });

  // Highlight correct/wrong
  document.querySelectorAll('.option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === selectedIndex) btn.classList.add('wrong');
  });

  setTimeout(() => {
    state.currentIndex++;
    if (state.currentIndex < state.questions.length) renderQuestion();
    else showResults();
  }, 1500);
}

function startTimer() {
  state.timeLeft = 15;
  updateTimerDisplay();
  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) handleAnswer(-1); // timed out
  }, 1000);
}`,
      },
    ],
    interviewQuestions: [
      {
        question: 'Why clear the timer before processing an answer?',
        answer: 'If you don\'t clearInterval, the timer keeps running and eventually calls handleAnswer again for the same question. clearInterval stops it as soon as the user answers.',
        difficulty: 'beginner',
      },
    ],
    tags: ['dom', 'state-management', 'timers', 'intermediate'],
  },
  {
    id: 'jwt-auth',
    slug: 'jwt-auth',
    title: 'JWT Authentication System',
    description: 'Build a complete login/register system with JWT tokens using Node.js backend.',
    difficulty: 'advanced',
    estimatedTime: '8-10 hours',
    techStack: ['Node.js 22+', 'Express.js', 'JWT', 'bcrypt', 'Vanilla JS frontend'],
    features: [
      'User registration with hashed passwords',
      'Login with JWT token generation',
      'Protected routes with JWT middleware',
      'Token refresh',
      'Logout (client-side)',
      'Role-based access (admin/user)',
    ],
    folderStructure: `jwt-auth/
├── backend/
│   ├── server.js
│   ├── middleware/auth.js
│   ├── routes/auth.js
│   └── package.json
└── frontend/
    ├── index.html
    └── app.js`,
    steps: [
      {
        title: 'Set up Node.js backend',
        description: 'Initialize project and install dependencies.',
        code: `// backend/package.json
{
  "name": "jwt-auth-backend",
  "type": "module",
  "scripts": { "start": "node server.js", "dev": "node --watch server.js" },
  "dependencies": {
    "express": "^4.19.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5"
  }
}

// Install: npm install (use Node.js 22+)`,
      },
      {
        title: 'Create the server and in-memory user store',
        description: 'Set up Express with a simple in-memory users array (replace with DB in production).',
        code: `// backend/server.js
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/auth', authRouter);

// Protected route example
import { verifyToken } from './middleware/auth.js';
app.get('/api/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(4000, () => console.log('Server on http://localhost:4000'));

// In-memory store (use a DB in real apps)
export const users = [];`,
      },
      {
        title: 'Build auth routes (register + login)',
        description: 'Implement registration with bcrypt and login with JWT.',
        code: `// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../server.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
export const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = { id: Date.now().toString(), email, password: hashedPassword, role: 'user' };
  users.push(user);

  const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email, role: user.role } });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email, role: user.role } });
});`,
      },
      {
        title: 'JWT middleware',
        description: 'Middleware to verify JWT on protected routes.',
        code: `// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Role-based middleware factory
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}`,
      },
      {
        title: 'Frontend: API calls with token',
        description: 'Store the JWT in localStorage and send it with authenticated requests.',
        code: `// frontend/app.js
const API = 'http://localhost:4000/api';

async function register(email, password) {
  const res = await fetch(\`\${API}/auth/register\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  localStorage.setItem('token', data.token);
  return data.user;
}

async function fetchProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(\`\${API}/profile\`, {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Session expired');
  }
  return res.json();
}

function logout() {
  localStorage.removeItem('token');
  // Redirect to login
}`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is a JWT and what are its three parts?',
        answer: 'JSON Web Token is a self-contained token for authentication. Three parts separated by dots: Header (algorithm and type), Payload (claims: user data, expiry), Signature (header+payload signed with secret). Base64 encoded, not encrypted — don\'t store sensitive data in payload.',
        difficulty: 'intermediate',
      },
      {
        question: 'Why hash passwords with bcrypt instead of storing plaintext?',
        answer: 'If the database is compromised, plaintext passwords expose all users. bcrypt is a slow hashing algorithm designed for passwords — the salt prevents rainbow table attacks. The cost factor makes brute-force impractical. Never store, log, or transmit plaintext passwords.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between authentication and authorization?',
        answer: 'Authentication: proving who you are (login — verifying identity). Authorization: what you are allowed to do (role-based access — admin vs. user). JWT carries both: the identity (sub/id claim) and roles/permissions (role claim).',
        difficulty: 'intermediate',
      },
    ],
    tags: ['node.js', 'jwt', 'authentication', 'backend', 'advanced'],
  },
  {
    id: 'expense-tracker',
    slug: 'expense-tracker',
    title: 'Expense Tracker',
    description: 'Track income and expenses with categories, totals, and a visual summary.',
    difficulty: 'intermediate',
    estimatedTime: '4-5 hours',
    techStack: ['HTML', 'CSS', 'Vanilla JavaScript', 'localStorage', 'Chart.js'],
    features: [
      'Add income and expense transactions',
      'Categorize transactions',
      'Running balance display',
      'Filter by category/date',
      'Pie chart of expense categories',
      'Persistent storage',
    ],
    folderStructure: `expense-tracker/
├── index.html
├── style.css
└── app.js`,
    steps: [
      {
        title: 'Data model',
        description: 'Define transaction structure and state.',
        code: `// Transaction shape
// { id, description, amount, type: 'income'|'expense', category, date }

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other'];

let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

function save() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getBalance() {
  return transactions.reduce((total, t) =>
    t.type === 'income' ? total + t.amount : total - t.amount, 0);
}

function getTotalByType(type) {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}`,
      },
      {
        title: 'Add and delete transactions',
        description: 'Implement adding and deleting transactions.',
        code: `function addTransaction({ description, amount, type, category }) {
  transactions.push({
    id: Date.now().toString(),
    description,
    amount: Math.abs(parseFloat(amount)),
    type,
    category,
    date: new Date().toISOString()
  });
  save();
  render();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
}`,
      },
      {
        title: 'Render transactions and summary',
        description: 'Display the transaction list and summary figures.',
        code: `function render() {
  document.getElementById('balance').textContent =
    \`\${getBalance() >= 0 ? '+' : ''}\${getBalance().toFixed(2)}\`;
  document.getElementById('income-total').textContent = getTotalByType('income').toFixed(2);
  document.getElementById('expense-total').textContent = getTotalByType('expense').toFixed(2);

  const list = document.getElementById('transaction-list');
  list.innerHTML = transactions.slice().reverse().map(t => \`
    <li class="transaction \${t.type}" data-id="\${t.id}">
      <span>\${escapeHtml(t.description)}</span>
      <span class="category">\${t.category}</span>
      <span class="amount">\${t.type === 'income' ? '+' : '-'}$\${t.amount.toFixed(2)}</span>
      <button class="delete-btn">×</button>
    </li>
  \`).join('');
}`,
      },
    ],
    interviewQuestions: [
      {
        question: 'How would you add data validation to the expense form?',
        answer: 'Check: amount is a positive number (parseFloat > 0, !isNaN), description is not empty (text.trim().length > 0), category is one of the valid options (CATEGORIES.includes(category)). Show inline error messages. Also consider max description length to prevent large payloads.',
        difficulty: 'beginner',
      },
    ],
    tags: ['dom', 'localStorage', 'data-visualization', 'intermediate'],
  },
  {
    id: 'rest-api-client',
    slug: 'rest-api-client',
    title: 'REST API Client Dashboard',
    description: 'Build a dashboard to test REST APIs — like a mini Postman in the browser.',
    difficulty: 'advanced',
    estimatedTime: '8-10 hours',
    techStack: ['HTML', 'CSS', 'Vanilla JavaScript', 'Fetch API', 'Monaco Editor'],
    features: [
      'Send GET, POST, PUT, DELETE requests',
      'Custom headers and request body',
      'Response display with syntax highlighting',
      'Request history',
      'Environment variables',
      'Export requests',
    ],
    folderStructure: `rest-client/
├── index.html
├── style.css
└── app.js`,
    steps: [
      {
        title: 'Build the request engine',
        description: 'Core function to send HTTP requests with all options.',
        code: `async function sendRequest({ method, url, headers, body }) {
  const startTime = performance.now();

  try {
    const res = await fetch(url, {
      method,
      headers: Object.fromEntries(
        headers.filter(h => h.key && h.value)
               .map(h => [h.key, h.value])
      ),
      body: ['GET', 'HEAD'].includes(method) ? undefined : body,
    });

    const duration = Math.round(performance.now() - startTime);
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();
    let parsed;

    try {
      parsed = contentType.includes('json') ? JSON.parse(text) : text;
    } catch {
      parsed = text;
    }

    return {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      body: parsed,
      duration,
      ok: res.ok
    };
  } catch (err) {
    throw new Error(\`Network error: \${err.message}\`);
  }
}`,
      },
      {
        title: 'Request history with localStorage',
        description: 'Save and load previous requests.',
        code: `const MAX_HISTORY = 50;

function saveToHistory(request, response) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    request,
    response: { status: response.status, duration: response.duration }
  });
  localStorage.setItem('api-history', JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function getHistory() {
  return JSON.parse(localStorage.getItem('api-history') || '[]');
}`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is CORS and why does it affect this app?',
        answer: 'CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks requests from a different origin unless the server explicitly allows it via headers. This app makes requests to external APIs — if those APIs don\'t include CORS headers, the browser blocks the response. A real client like Postman doesn\'t have this restriction because it is not a browser.',
        difficulty: 'advanced',
      },
    ],
    tags: ['fetch-api', 'async-await', 'dom', 'advanced'],
  },
  {
    id: 'realtime-chat',
    slug: 'realtime-chat',
    title: 'Realtime Chat with WebSockets',
    description: 'Build a multi-user realtime chat using WebSockets and Node.js.',
    difficulty: 'expert',
    estimatedTime: '10-12 hours',
    techStack: ['Node.js 22+', 'ws (WebSocket library)', 'Vanilla JS frontend'],
    features: [
      'Real-time message delivery',
      'Multiple users',
      'User join/leave notifications',
      'Message history (last 50)',
      'Typing indicators',
      'Username selection',
    ],
    folderStructure: `realtime-chat/
├── server/
│   ├── server.js
│   └── package.json
└── client/
    ├── index.html
    └── app.js`,
    steps: [
      {
        title: 'Set up WebSocket server',
        description: 'Create a WebSocket server with the ws library.',
        code: `// server/server.js
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const server = createServer();
const wss = new WebSocketServer({ server });

const clients = new Map(); // ws → { username, id }
const messageHistory = [];

wss.on('connection', (ws) => {
  const clientId = Date.now().toString();
  clients.set(ws, { id: clientId, username: null });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(ws, message);
    } catch {}
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client?.username) {
      broadcast({ type: 'system', text: \`\${client.username} left\`, timestamp: Date.now() });
    }
    clients.delete(ws);
  });
});

function broadcast(message, exclude = null) {
  const data = JSON.stringify(message);
  for (const [client] of clients) {
    if (client !== exclude && client.readyState === 1) {
      client.send(data);
    }
  }
}

server.listen(8080, () => console.log('WS Server on ws://localhost:8080'));`,
      },
      {
        title: 'Handle message types',
        description: 'Process different message types: join, message, typing.',
        code: `function handleMessage(ws, message) {
  const client = clients.get(ws);

  if (message.type === 'join') {
    client.username = message.username;
    // Send history to new client
    ws.send(JSON.stringify({ type: 'history', messages: messageHistory }));
    // Notify others
    broadcast({ type: 'system', text: \`\${message.username} joined\`, timestamp: Date.now() }, ws);

  } else if (message.type === 'message') {
    const msg = {
      type: 'message',
      id: Date.now().toString(),
      username: client.username,
      text: message.text,
      timestamp: Date.now()
    };
    messageHistory.push(msg);
    if (messageHistory.length > 50) messageHistory.shift();
    broadcast(msg);

  } else if (message.type === 'typing') {
    broadcast({ type: 'typing', username: client.username, isTyping: message.isTyping }, ws);
  }
}`,
      },
      {
        title: 'Frontend WebSocket client',
        description: 'Connect to the WebSocket server and handle messages.',
        code: `// client/app.js
const ws = new WebSocket('ws://localhost:8080');
const username = prompt('Enter your username:') || 'Anonymous';

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'join', username }));
};

ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);

  if (message.type === 'history') {
    message.messages.forEach(addMessageToDOM);
  } else if (message.type === 'message') {
    addMessageToDOM(message);
  } else if (message.type === 'system') {
    addSystemMessage(message.text);
  }
};

function sendMessage(text) {
  ws.send(JSON.stringify({ type: 'message', text }));
}

document.getElementById('send-btn').addEventListener('click', () => {
  const input = document.getElementById('message-input');
  if (input.value.trim()) {
    sendMessage(input.value.trim());
    input.value = '';
  }
});`,
      },
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between HTTP and WebSockets?',
        answer: 'HTTP is request-response: client initiates every interaction, server responds then closes. WebSocket is full-duplex: both sides can send at any time after the initial handshake. HTTP is stateless; WebSocket maintains a persistent connection. WebSockets are ideal for realtime applications: chat, live updates, gaming.',
        difficulty: 'advanced',
      },
      {
        question: 'How would you scale this chat server to multiple Node.js instances?',
        answer: 'Each Node.js instance would have its own set of connected clients. For messages to reach clients on other instances, you need a pub/sub mechanism. Use Redis Pub/Sub: when a message arrives on instance A, publish to Redis; all instances subscribe and broadcast to their local clients.',
        difficulty: 'expert',
      },
    ],
    tags: ['websockets', 'node.js', 'realtime', 'expert'],
  },
];
