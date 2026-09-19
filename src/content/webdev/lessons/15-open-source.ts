import type { Lesson } from '@/types';

export const openSourceLesson: Lesson = {
  id: 'open-source-development',
  slug: 'open-source-development',
  title: 'Open Source Development',
  description:
    'Finding projects, reading codebases, understanding issues, creating pull requests, communicating with maintainers, and building a long-term open source presence.',
  category: 'Professional Skills',
  order: 15,
  difficulty: 'intermediate',
  estimatedTime: 20,
  content: `Open source contribution is one of the most effective ways to grow as a developer. You work with production-quality codebases, learn from experienced maintainers, and build a public portfolio that speaks louder than any resume claim.

---

## Why Contribute

**For learning:**
- Read code written by engineers much more experienced than you
- Learn patterns and practices used in production at scale
- Understand how popular libraries actually work internally

**For career:**
- Public, verifiable proof of your skills
- Employers can read your actual contributions, not just claims
- Network with respected engineers in the ecosystem

**For the community:**
- Fix a bug that was blocking you — help others with the same issue
- Improve documentation so others can learn faster

---

## Finding Projects

**Start with what you already use:**
The best first contribution is to a tool you already use. You know its purpose, you may have already encountered bugs or confusing documentation.

\`\`\`
Tools you might already use:
  - shadcn/ui     → React components
  - TanStack Query → Server state management
  - Prisma        → Database ORM
  - Zod           → Schema validation
  - Lucide        → Icon library
  - T3 Stack      → create-t3-app
\`\`\`

**GitHub search filters:**
\`\`\`
label:"good first issue"           → beginner-friendly issues
label:"help wanted"                → maintainer explicitly wants help
language:TypeScript                → filter by language
is:open is:issue                   → only open issues

Full search:
good first issue language:TypeScript label:"help wanted"
\`\`\`

**Tools for finding issues:**
- **goodfirstissue.dev** — curated list of beginner issues
- **up-for-grabs.net** — projects actively seeking contributors
- **codetriage.com** — issues delivered to your email

---

## Reading a Codebase

When you first open an unfamiliar codebase:

**Step 1: Understand the project**
\`\`\`
Read in this order:
  README.md        → what it does, how to use it
  CONTRIBUTING.md  → how they want contributions
  package.json     → tech stack, scripts
  Project structure → where is what
\`\`\`

**Step 2: Run it locally**
\`\`\`bash
git clone https://github.com/org/project
cd project
npm install
npm run dev  # or follow CONTRIBUTING.md setup
npm test     # ensure tests pass before you change anything
\`\`\`

**Step 3: Find the code path for your issue**
\`\`\`bash
# Search for relevant keywords
grep -r "the error message" src/
grep -r "functionName" --include="*.ts" .

# Use GitHub's code search on the web
# TypeScript Language Server in VS Code — go to definition
\`\`\`

**Step 4: Read tests**
Tests show intended behavior. Reading tests for the area you are working on shows you how the code is supposed to work.

---

## Types of Contributions

**Documentation (best starting point):**
- Fix typos in README
- Improve unclear explanations
- Add missing examples to API docs
- Translate documentation

**Bug fixes:**
- Fix a bug you found or one listed in issues
- Add a test that covers the bug
- Fix the code

**Features:**
- Implement a feature requested in an issue
- Always check if the feature was already declined or is in progress
- Discuss with maintainers before implementing large features

**Infrastructure:**
- Add GitHub Actions workflows
- Improve test coverage
- Update outdated dependencies

---

## The Contribution Process

\`\`\`
1. Find an issue you want to work on
   ↓
2. Comment on the issue: "I'd like to work on this"
   → Wait for maintainer to assign or respond
   → This prevents duplicate work
   ↓
3. Fork the repository on GitHub
   git clone https://github.com/YOUR_USERNAME/project
   cd project
   git remote add upstream https://github.com/ORIGINAL_ORG/project
   ↓
4. Create a branch
   git checkout -b fix/the-issue-description
   ↓
5. Make the change
   - Write the fix
   - Write/update tests
   - Follow the project's code style
   ↓
6. Keep up with upstream changes
   git fetch upstream
   git rebase upstream/main
   ↓
7. Push and open a PR
   git push origin fix/the-issue-description
   Open PR on GitHub against the original repo
   ↓
8. Respond to review
   - Update code based on feedback
   - Respond to every comment
   - Push new commits (don't force push after review starts)
   ↓
9. Merge (maintainer does this)
\`\`\`

---

## Community Communication

**Issue etiquette:**
\`\`\`
✓ Be specific about your environment (OS, Node version, package version)
✓ Include a minimal reproduction case
✓ Search for existing issues before opening a new one
✓ Be patient — maintainers are often volunteers

✗ "This doesn't work" with no details
✗ Demanding a fix or feature
✗ Opening duplicate issues
✗ @mentioning maintainers to speed up a response
\`\`\`

**PR etiquette:**
\`\`\`
✓ Small, focused PRs (one fix/feature per PR)
✓ Fill out the PR template
✓ Run tests before opening the PR
✓ Respond to review feedback promptly
✓ Thank reviewers for their time

✗ PRs with unrelated changes
✗ Ignoring reviewer feedback
✗ Force-pushing after review has started
\`\`\`

---

## Long-Term Contribution

Going from occasional contributor to maintainer-level:

\`\`\`
Occasional contributor
  → Fix one bug
  → Fix a few more bugs in the same codebase
  → Start reviewing other PRs (leave comments, test locally)
  → Get invited as a contributor
  → Help triage issues
  → Get commit access
  → Maintainer
\`\`\`

The fastest path: consistently contribute to one project over months. Breadth (contributing to 50 projects once each) is less valuable than depth (making 20 contributions to one project).

---

## Building in Public

Open source is also a portfolio strategy.

\`\`\`
What employers look for on GitHub:
  - Consistent contribution history (green squares)
  - Quality of contributions (not just quantity)
  - PRs merged in known projects
  - Your own projects with README and working demos
  - Code style in your repositories

What to show:
  - A pinned repository with a working project
  - Contribution history that shows consistency
  - PRs to real projects (not toy repos)
\`\`\``,
  codeExamples: [
    {
      title: 'Setting Up for Open Source Contribution',
      code: `# 1. Fork on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/project-name.git
cd project-name

# 3. Add the original as upstream
git remote add upstream https://github.com/ORIGINAL_ORG/project-name.git

# Verify:
git remote -v
# origin    https://github.com/YOUR_USERNAME/project-name.git (fetch)
# origin    https://github.com/YOUR_USERNAME/project-name.git (push)
# upstream  https://github.com/ORIGINAL_ORG/project-name.git (fetch)
# upstream  https://github.com/ORIGINAL_ORG/project-name.git (push)

# 4. Keep your fork up to date
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# 5. Create a branch for your work
git checkout -b fix/button-focus-visible-styles

# 6. After making changes
git add -p  # review each change before staging
git commit -m "fix(button): add visible focus ring for keyboard navigation

Previously the button had no visible focus indicator when navigated
via keyboard, failing WCAG 2.1 AA accessibility requirements.

Added focus-visible ring using CSS :focus-visible pseudo-class
to not affect mouse users.

Closes #1234"

git push origin fix/button-focus-visible-styles
# Then open a PR on GitHub`,
      explanation:
        'The upstream remote lets you pull in changes from the original repository. Always create a new branch for each contribution — never work directly on main in your fork.',
    },
  ],
  commonMistakes: [
    'Opening a PR without commenting on the issue first — another contributor may be working on it',
    'Making changes without running the test suite — if tests fail, the PR will be rejected',
    'Adding unrelated changes to a PR — "while I was here I also fixed..." belongs in a separate PR',
    'Not reading CONTRIBUTING.md — every project has specific requirements for formatting, testing, PR process',
    'Giving up after the first rejection — rejection and request-for-changes are normal parts of the process',
    'Opening large feature PRs without prior discussion — maintainers may not want the feature',
  ],
  interviewQuestions: [
    {
      question: 'How do you approach contributing to an open source project for the first time?',
      answer:
        'Start by using the project, reading the README and CONTRIBUTING.md, and running it locally. Find a "good first issue" or a documentation improvement. Comment on the issue before starting to avoid duplicate work. Fork the repo, create a branch, make the focused change, run tests, and open a small PR with a clear description. Respond to every review comment. Start small to build trust with maintainers.',
      difficulty: 'beginner',
    },
    {
      question: 'What is a fork vs a clone in the context of open source?',
      answer:
        'A clone is a local copy of any repository. A fork is a copy of someone else\'s repository under your GitHub account, which you have write access to. For open source contribution: you fork the repository (creating a copy you can push to), clone your fork locally, make changes, push to your fork, then open a pull request from your fork to the original repository.',
      difficulty: 'beginner',
    },
  ],
  exercises: [
    {
      id: 'find-your-first-issue',
      title: 'Find and Plan Your First Contribution',
      description:
        'Find a real open source project you use. Find a "good first issue" or a documentation improvement. Write: the project name, the issue URL, what the issue is about, your plan for fixing it, and what you need to understand first.',
      starterCode: `// Project: ...
// Issue URL: ...
// Issue description: ...
//
// My plan:
// 1.
// 2.
// 3.
//
// What I need to understand first:
// - How does X work in this codebase?
// - Where is Y defined?
//
// Files I'll likely need to change:
// -
// -`,
      solution: `// Example answer (your answer will differ based on your chosen project):
//
// Project: shadcn/ui
// Issue URL: https://github.com/shadcn-ui/ui/issues/XXXX
// Issue description: The Select component does not announce selected
// value to screen readers when the dropdown closes.
//
// My plan:
// 1. Run the project locally and reproduce the issue
// 2. Find the Select component in apps/www/registry/ui/select.tsx
// 3. Use Radix UI's accessibility primitives to add aria-live announcement
// 4. Test with a screen reader (NVDA or VoiceOver)
// 5. Update any related Storybook stories or tests
//
// What I need to understand first:
// - How does the Select component use Radix UI primitives?
// - What aria attributes does Radix UI already add?
// - How does the component announcement work vs. what it should do?
//
// Files I'll likely need to change:
// - apps/www/registry/ui/select.tsx (the component itself)
// - apps/www/registry/default/ui/select.tsx (the default variant)
// - May need to add a test or Storybook story`,
      hints: [
        'Look for "good first issue" label on GitHub — these are intentionally approachable',
        'Documentation improvements count — fixing unclear wording is a real contribution',
        'The issue does not need to be complex — small, correct contributions are more valuable than large incorrect ones',
      ],
    },
  ],
  keyTakeaways: [
    'Start with projects you already use — you understand the problem domain and may have hit real bugs',
    'Comment on the issue before starting work — prevents duplicate effort and gets maintainer buy-in',
    'Read CONTRIBUTING.md before making any changes — every project has specific requirements',
    'Small, focused PRs merge faster — one fix or improvement per PR',
    'Depth beats breadth: regular contributions to one project builds real credibility and relationships',
    'Consistent open source activity is more convincing to employers than claims on a resume',
  ],
  nextLesson: 'freelancing-client-work',
  prevLesson: 'team-development',
};
