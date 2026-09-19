import type { Lesson } from '@/types';

export const lessons: Lesson[] = [
  // ─── LESSON 1 ─────────────────────────────────────────────────────────────
  {
    id: 'introduction-to-devops',
    slug: 'introduction-to-devops',
    title: 'Introduction to DevOps',
    description: 'What DevOps is, why it exists, the problems it solves, and how real companies use it daily.',
    category: 'Introduction',
    order: 1,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## What is DevOps?

DevOps is a culture, set of practices, and collection of tools that brings **Development (Dev)** and **Operations (Ops)** teams together to deliver software faster, more reliably, and continuously.

**Simple definition:** DevOps is the practice of automating everything between writing code and running it in production.

**Real-world analogy:** Think of a restaurant. The chef (developer) cooks the food. The waiter (operations) delivers it to customers. In a traditional kitchen, the chef tosses food to the waiter who then figures out how to serve it — slow, error-prone. DevOps is a conveyor belt that automatically takes food from the kitchen, checks quality, packages it, and delivers it to the customer — fast and consistent every time.

---

## Problems Before DevOps

Before DevOps became standard, software delivery was chaotic:

**Problem 1: "It works on my machine"**
Developers wrote code on their laptops. Operations deployed it to servers. Different environments, different OS, different library versions = constant failures in production.

**Problem 2: Long release cycles**
Companies released software every 3–6 months. Testing was manual. Deployments happened on Friday nights. Every release was a risky event that caused stress for the entire team.

**Problem 3: Siloed teams**
Developers threw code "over the wall" to operations. Operations had no idea what changed. Developers had no idea how the server was configured. Each team blamed the other when things broke.

**Problem 4: Slow feedback**
A bug written on Monday wasn't discovered until it reached production weeks later. The developer had already forgotten the context. Fixing it was slow.

**Problem 5: Manual deployments**
Someone SSH-ed into a server, manually copied files, restarted services, and hoped for the best. One wrong command could take down the entire application.

---

## Traditional vs DevOps Delivery

| Aspect | Traditional | DevOps |
|--------|------------|--------|
| Release frequency | Every 3–6 months | Multiple times per day |
| Deployment | Manual, risky | Automated, reliable |
| Testing | Manual, end of cycle | Automated, on every commit |
| Feedback | Weeks later | Minutes later |
| Team structure | Dev vs Ops silos | Shared responsibility |
| Failure recovery | Hours to days | Minutes |

---

## The DevOps Lifecycle

DevOps is a continuous loop — code never "stops." The eight phases repeat forever:

\`\`\`
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor → (back to Plan)
\`\`\`

**Plan:** Define features and requirements (Jira, GitHub Issues, Notion)
**Code:** Write the actual code (VS Code, Git)
**Build:** Compile, bundle, or package the code (npm build, Docker)
**Test:** Run automated tests (Jest, Cypress, pytest)
**Release:** Tag a version, create release artifacts
**Deploy:** Push to production (GitHub Actions, Railway, Vercel)
**Operate:** Keep the app running, manage infrastructure
**Monitor:** Track errors, performance, uptime (Grafana, Sentry, Datadog)

---

## Real World DevOps Workflows

### Startup Workflow
A 3-person startup with a Next.js app:
1. Developer pushes code to GitHub
2. GitHub Actions automatically runs tests
3. If tests pass, GitHub Actions deploys to Vercel
4. Total time from push to production: **2 minutes**
5. If something breaks, Sentry sends an alert
6. Fix pushed, process repeats

### Product Company Workflow
A 50-person SaaS company:
1. Developer creates a PR (pull request)
2. CI pipeline runs: lint + tests + security scan
3. PR reviewed and merged to \`main\`
4. Automatic deploy to **staging** environment
5. QA team tests on staging
6. Approved → deploy to **production** (10k users)
7. Monitoring alerts if error rate spikes

### Open Source Workflow
Contributors worldwide pushing code to a public repo:
1. Contributor forks and opens a PR
2. CI runs tests on the PR automatically
3. Maintainer reviews and merges
4. Release pipeline tags a version and publishes to npm/PyPI/Docker Hub
5. Users get the update

---

## Why DevOps Matters for You (as a Developer)

Even if you are not a DevOps engineer, you will:
- Write Dockerfiles for your applications
- Set up GitHub Actions pipelines for your projects
- Deploy to Vercel, Railway, Render, or a VPS
- Debug production issues using logs
- Configure environment variables and secrets

Every modern development job expects at least basic DevOps knowledge. This track covers everything you need.`,
    codeExamples: [
      {
        title: 'A simple GitHub Actions workflow — the entry point to DevOps',
        code: `# .github/workflows/ci.yml
# This file runs automatically every time you push code to GitHub

name: CI Pipeline         # display name in GitHub UI

on:                       # WHEN to run this workflow
  push:                   # trigger: on every push
    branches: [main]      # only for the main branch

jobs:                     # WHAT to do
  build-and-test:         # job name (can be anything)
    runs-on: ubuntu-latest # use a Ubuntu virtual machine

    steps:                # list of steps to execute in order
      - uses: actions/checkout@v4    # step 1: clone your repo
      - uses: actions/setup-node@v4  # step 2: install Node.js
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install             # step 3: npm install

      - name: Run tests
        run: npm test                # step 4: run your tests

      - name: Build project
        run: npm run build           # step 5: build for production`,
        explanation: 'This 20-line file replaces the manual: clone repo → npm install → run tests → build. It runs automatically on every push. This is the foundation of CI/CD.',
      },
    ],
    commonMistakes: [
      'Thinking DevOps is only for large companies — even solo developers benefit from automated testing and deployment.',
      'Confusing DevOps with a job title — DevOps is a culture and set of practices, not just a role.',
      'Skipping DevOps until the project is "big enough" — set up CI/CD from day one, it costs 30 minutes and saves hours.',
      'Thinking DevOps means you have to manage servers — modern DevOps often means using platforms (Vercel, Railway) that hide the server complexity.',
    ],
    interviewQuestions: [
      {
        question: 'What is DevOps and why does it exist?',
        answer: 'DevOps is a culture and set of practices that unifies development and operations teams to deliver software faster and more reliably. It exists because traditional software delivery was slow (monthly releases), error-prone (manual deployments), and plagued by silos between dev and ops teams. DevOps solves these with automation, continuous integration, and continuous deployment.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the DevOps lifecycle?',
        answer: 'The DevOps lifecycle is a continuous loop: Plan (define features) → Code (write it) → Build (compile/bundle) → Test (automated tests) → Release (version tagging) → Deploy (push to production) → Operate (keep it running) → Monitor (track errors and performance) → back to Plan. It never stops — successful companies deploy multiple times per day.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment?',
        answer: 'CI (Continuous Integration) automatically builds and tests code on every commit. CD (Continuous Delivery) means the app is always in a deployable state — deployment is one click. Continuous Deployment goes further — every passing commit is deployed to production automatically with no human approval. Most teams practice CI + Continuous Delivery, with manual approval for production deployments.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-1-1',
        title: 'Map a workflow to DevOps phases',
        description: 'A developer writes a login feature, pushes to GitHub, GitHub Actions runs tests, the code is deployed to Vercel, and Sentry catches an error the next day. Map each step to the DevOps lifecycle phase.',
        starterCode: `// DevOps lifecycle phases:
// Plan | Code | Build | Test | Release | Deploy | Operate | Monitor

// Map each action to a phase:
// 1. Developer writes the login feature
// 2. Code is pushed to GitHub
// 3. GitHub Actions installs npm packages and compiles TypeScript
// 4. GitHub Actions runs Jest tests
// 5. A Docker image is tagged as v1.2.3
// 6. Vercel deploys the new version
// 7. The app serves 10,000 users
// 8. Sentry sends an alert about a failed login bug`,
        solution: `// 1. Developer writes the login feature      → CODE
// 2. Code is pushed to GitHub               → (transition trigger)
// 3. GitHub Actions installs and compiles   → BUILD
// 4. GitHub Actions runs Jest tests         → TEST
// 5. Docker image tagged as v1.2.3         → RELEASE
// 6. Vercel deploys the new version        → DEPLOY
// 7. The app serves 10,000 users           → OPERATE
// 8. Sentry sends an error alert           → MONITOR`,
        hints: ['Each phase has a clear purpose: build = compile, test = verify, deploy = push to servers'],
      },
    ],
    keyTakeaways: [
      'DevOps unites Dev and Ops to ship software faster and more reliably.',
      'Problems before DevOps: long release cycles, manual deployments, team silos, slow feedback.',
      'The DevOps lifecycle: Plan → Code → Build → Test → Release → Deploy → Operate → Monitor.',
      'Even solo developers benefit: automate your tests and deployments from day one.',
      'You do not need to be a DevOps Engineer to use DevOps — it is a core developer skill.',
    ],
    nextLesson: 'linux-for-developers',
  },

  // ─── LESSON 2 ─────────────────────────────────────────────────────────────
  {
    id: 'linux-for-developers',
    slug: 'linux-for-developers',
    title: 'Linux for Developers',
    description: 'Practical Linux every developer needs: filesystem, permissions, SSH, processes, logs, and the 30 commands you will use every day.',
    category: 'Linux',
    order: 2,
    difficulty: 'beginner',
    estimatedTime: 40,
    content: `## Why Linux Matters for Developers

Every server in the world runs Linux. Docker containers run Linux. GitHub Actions runners run Linux. AWS EC2 instances default to Linux. When you deploy your Node.js or Python app to production, it runs on Linux.

You don't need to become a Linux sysadmin. You need to be comfortable enough to navigate a server, read logs, manage files, and diagnose problems.

---

## The Linux Filesystem

Linux organizes everything in a single tree starting from \`/\` (root):

\`\`\`
/                    ← root of everything
├── home/            ← user home directories
│   └── alice/       ← your home: ~
├── etc/             ← configuration files (nginx.conf, ssh config)
├── var/             ← variable data: logs, databases, caches
│   └── log/         ← log files (nginx, system, apps)
├── usr/             ← user programs and libraries
│   └── bin/         ← installed commands (git, node, python)
├── tmp/             ← temporary files (cleared on reboot)
├── opt/             ← optional software
└── proc/            ← virtual files for running processes
\`\`\`

**Key directories to know:**
- \`~\` or \`/home/username\` — your home directory, where you start
- \`/etc\` — config files. Edit nginx here, SSH config here.
- \`/var/log\` — logs. App crashed? Check here first.
- \`/usr/local/bin\` — where you install custom scripts/tools

---

## Essential Commands — Navigation

\`\`\`bash
pwd               # Print Working Directory — where am I?
ls                # list files in current directory
ls -la            # list ALL files including hidden, with details
ls -lh            # human-readable sizes (KB, MB, GB)
cd /etc           # change to /etc directory
cd ~              # go to home directory
cd ..             # go up one level
cd -              # go back to previous directory
\`\`\`

---

## File Operations

\`\`\`bash
# Create
touch file.txt          # create empty file (or update timestamp)
mkdir my-project        # create directory
mkdir -p a/b/c          # create nested directories

# Copy
cp file.txt backup.txt  # copy file
cp -r src/ dest/        # copy directory recursively

# Move / Rename
mv old.txt new.txt      # rename a file
mv file.txt /tmp/       # move to /tmp

# Delete
rm file.txt             # delete file (no recycle bin!)
rm -rf my-folder/       # delete folder and all contents (dangerous!)

# View files
cat file.txt            # print entire file
less file.txt           # scroll through file (q to quit)
head -20 file.txt       # first 20 lines
tail -20 file.txt       # last 20 lines
tail -f app.log         # follow log file in real-time (Ctrl+C to stop)
\`\`\`

---

## Search and Find

\`\`\`bash
# Find files
find . -name "*.log"           # find all .log files from current dir
find /var/log -name "nginx*"   # find nginx logs
find . -type f -newer file.txt # files newer than file.txt

# Search inside files
grep "ERROR" app.log           # find lines containing "ERROR"
grep -r "TODO" src/            # search recursively in directory
grep -n "function" app.js      # show line numbers
grep -i "error" app.log        # case-insensitive search

# Combine: find errors in all logs
grep -r "ERROR" /var/log/
\`\`\`

---

## File Permissions

Every file has permissions for three groups: **owner**, **group**, **others**.

\`\`\`bash
ls -la
# -rwxr-xr-- 1 alice dev 4096 Jan 15 app.sh
#  ^^^------- owner permissions: read(r) write(w) execute(x)
#     ^^^---- group permissions: read(r) no-write no-execute
#        ^^^- others permissions: read(r) only
\`\`\`

**Permission values:**
- \`r\` = read = 4
- \`w\` = write = 2
- \`x\` = execute = 1

\`\`\`bash
chmod 755 script.sh    # owner=rwx(7), group=rx(5), others=rx(5)
chmod 644 file.txt     # owner=rw(6), group=r(4), others=r(4)
chmod +x script.sh     # add execute permission for everyone
chmod -x script.sh     # remove execute permission

chown alice file.txt   # change owner to alice
chown alice:dev dir/   # change owner and group
sudo chown root file   # change to root (needs sudo)
\`\`\`

**Common patterns:**
- \`755\` — scripts and executables (owner can write, everyone can run)
- \`644\` — config files (owner can write, everyone can read)
- \`600\` — SSH keys (owner only, nobody else)
- \`777\` — never use this in production (everyone has full access)

---

## sudo — Superuser Commands

\`\`\`bash
sudo command          # run command as root (superuser)
sudo apt update       # update package list (Ubuntu/Debian)
sudo apt install nginx # install nginx
sudo systemctl start nginx  # start a service
sudo -i               # switch to root shell (be careful!)
\`\`\`

---

## Environment Variables

\`\`\`bash
# View
env                   # list all environment variables
echo $HOME            # print value of HOME
echo $PATH            # print PATH (where shell looks for commands)

# Set (current session only)
export MY_VAR="hello"
echo $MY_VAR          # hello

# Set permanently (add to ~/.bashrc or ~/.zshrc)
echo 'export NODE_ENV=development' >> ~/.bashrc
source ~/.bashrc      # reload without restarting terminal

# Use in scripts
echo "Running in $NODE_ENV mode"
\`\`\`

---

## Processes

\`\`\`bash
ps aux                  # list all running processes
ps aux | grep node      # find node processes
top                     # live process viewer (q to quit)
htop                    # better top (if installed)

# Kill a process
kill 1234               # send SIGTERM (graceful stop) to PID 1234
kill -9 1234            # force kill (SIGKILL) — use when kill fails
pkill node              # kill all processes named "node"

# Background processes
./server.sh &           # run in background
jobs                    # list background jobs
fg                      # bring background job to foreground
\`\`\`

---

## Services (systemctl)

On Linux servers, long-running apps are managed as services:

\`\`\`bash
sudo systemctl start nginx    # start nginx
sudo systemctl stop nginx     # stop nginx
sudo systemctl restart nginx  # restart nginx
sudo systemctl status nginx   # check if running
sudo systemctl enable nginx   # start automatically on boot
sudo systemctl disable nginx  # don't start on boot

# View service logs
sudo journalctl -u nginx      # all nginx logs
sudo journalctl -u nginx -f   # follow live logs
sudo journalctl -u nginx -n 50 # last 50 lines
\`\`\`

---

## Logs

\`\`\`bash
# System logs
tail -f /var/log/syslog       # system log (Debian/Ubuntu)
tail -f /var/log/messages     # system log (CentOS/RHEL)

# Application logs (if using systemd)
journalctl -u myapp -f        # follow your app's logs

# Nginx logs
tail -f /var/log/nginx/access.log  # incoming requests
tail -f /var/log/nginx/error.log   # errors

# Docker logs
docker logs mycontainer -f    # follow container logs
\`\`\`

---

## SSH — Connect to Remote Servers

\`\`\`bash
# Connect to a server
ssh username@server-ip          # password login
ssh -i ~/.ssh/key.pem user@ip   # key-based login (AWS, VPS)

# Generate SSH keys
ssh-keygen -t ed25519 -C "your@email.com"
# Creates: ~/.ssh/id_ed25519 (private key — never share!)
#          ~/.ssh/id_ed25519.pub (public key — copy to server)

# Copy public key to server
ssh-copy-id username@server-ip

# Add to authorized_keys manually
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

# SSH config for convenience (~/.ssh/config)
Host myserver
  HostName 203.0.113.1
  User ubuntu
  IdentityFile ~/.ssh/my-key.pem

# Now just type:
ssh myserver
\`\`\`

---

## Piping and Redirection

\`\`\`bash
# Pipe: send output of one command as input to next
ps aux | grep nginx          # list processes, filter for nginx
cat app.log | grep ERROR | wc -l  # count error lines

# Redirect output
echo "hello" > file.txt     # write to file (overwrite)
echo "world" >> file.txt    # append to file
./server.sh > output.log 2>&1  # redirect stdout AND stderr to file
\`\`\`

---

## Package Management

\`\`\`bash
# Ubuntu / Debian (apt)
sudo apt update               # refresh package list
sudo apt upgrade              # upgrade all packages
sudo apt install nodejs       # install a package
sudo apt remove nodejs        # uninstall

# Check installed version
node --version
npm --version
\`\`\``,
    codeExamples: [
      {
        title: 'Diagnosing a crashed Node.js app on a Linux server',
        code: `# Step 1: Check if the process is running
ps aux | grep node
# Output: nothing — process is not running!

# Step 2: Check system logs for crash info
sudo journalctl -u my-app -n 50
# Output: "Error: EADDRINUSE — address already in use :3000"

# Step 3: Find what is using port 3000
sudo lsof -i :3000
# Output: node    1234  alice   23u  IPv4  socket  TCP *:3000

# Step 4: Kill the old process
kill -9 1234

# Step 5: Check app log file for more details
tail -50 /var/log/my-app/error.log
grep -i "error\|fatal" /var/log/my-app/app.log | tail -20

# Step 6: Restart the app
sudo systemctl restart my-app

# Step 7: Verify it's running
sudo systemctl status my-app
curl http://localhost:3000/health`,
        explanation: 'This is the real troubleshooting flow on a Linux server. ps, journalctl, lsof, and tail are the tools you will use in production.',
      },
      {
        title: 'Setting up a Node.js app as a Linux service',
        code: `# /etc/systemd/system/myapp.service
[Unit]
Description=My Node.js App
After=network.target          # start after network is up

[Service]
Type=simple
User=ubuntu                   # run as ubuntu user, not root
WorkingDirectory=/home/ubuntu/app
ExecStart=/usr/bin/node server.js
Restart=on-failure            # auto-restart if it crashes
RestartSec=5                  # wait 5 seconds before restart
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target    # enable at startup

# Apply and start:
sudo systemctl daemon-reload
sudo systemctl enable myapp   # start on boot
sudo systemctl start myapp    # start now
sudo systemctl status myapp   # verify`,
        explanation: 'This systemd service file makes your Node.js app auto-start on boot and auto-restart on crash — the production standard for VPS deployments.',
      },
    ],
    commonMistakes: [
      'Running apps as root — always use a non-root user. Root has no safety net.',
      'Using rm -rf without double-checking the path — there is no undo. Always check pwd first.',
      'Setting permissions to 777 — gives everyone full access. Use 755 for executables, 644 for files.',
      'Not using tail -f for live log monitoring — developers read static logs and miss live errors.',
      'Forgetting to source ~/.bashrc after editing it — changes only apply after sourcing or restarting the terminal.',
      'Storing passwords in plain text files instead of environment variables or secret managers.',
    ],
    interviewQuestions: [
      {
        question: 'What does chmod 755 do?',
        answer: 'chmod 755 sets permissions on a file: owner gets read+write+execute (7 = 4+2+1), group gets read+execute (5 = 4+1), others get read+execute (5). This is standard for scripts and executables — the owner can modify them, everyone can run them. chmod 644 is standard for config files — owner can read/write, everyone else can only read.',
        difficulty: 'beginner',
      },
      {
        question: 'How do you find and kill a process using a specific port?',
        answer: 'Use lsof -i :PORT to find what is using the port: sudo lsof -i :3000. This shows the PID (process ID). Then kill it: kill PID for graceful stop, or kill -9 PID to force kill. Alternatively, use ss -tulpn | grep :3000 to find the port, then kill the PID shown.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between SSH password auth and key-based auth? Why is key-based preferred?',
        answer: 'Password authentication requires typing a password on every connection and is vulnerable to brute-force attacks. Key-based authentication uses a cryptographic key pair: the private key stays on your machine, the public key is copied to the server. Authentication succeeds if the keys match — no password typed, no brute-force risk. Key-based auth is the standard for production servers. Most cloud providers (AWS, GCP) disable password auth entirely.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-2-1',
        title: 'Linux command quiz',
        description: 'For each task, write the correct Linux command.',
        starterCode: `# Task 1: Find all .env files in the current directory and subdirectories
# Command:

# Task 2: Search for the word "database" inside all .js files
# Command:

# Task 3: Show the last 100 lines of /var/log/app.log and keep following
# Command:

# Task 4: Make deploy.sh executable
# Command:

# Task 5: Show all environment variables containing the word "NODE"
# Command:

# Task 6: Kill the process with PID 5432
# Command:

# Task 7: Create directory structure: /app/logs/2024
# (create all intermediate directories)
# Command:`,
        solution: `# Task 1:
find . -name ".env"

# Task 2:
grep -r "database" --include="*.js" .

# Task 3:
tail -100 -f /var/log/app.log

# Task 4:
chmod +x deploy.sh

# Task 5:
env | grep NODE

# Task 6:
kill 5432
# or force kill:
kill -9 5432

# Task 7:
mkdir -p /app/logs/2024`,
        hints: [
          'find uses -name for filename pattern',
          'grep -r searches recursively, --include filters by extension',
          'tail -f follows the file live',
        ],
      },
    ],
    keyTakeaways: [
      'All production servers run Linux. Know it well enough to navigate, manage files, and read logs.',
      'Key commands: ls, cd, cp, mv, rm, grep, find, tail -f, ps, kill, chmod, ssh.',
      'chmod 755 for executables, 644 for config files, 600 for SSH keys. Never 777 in production.',
      'tail -f follows logs in real time — your most important debugging tool on a server.',
      'Always SSH with key-based auth. Never run production apps as root.',
      'systemctl manages services: start, stop, restart, enable (auto-start on boot), status.',
    ],
    prevLesson: 'introduction-to-devops',
    nextLesson: 'networking-fundamentals',
  },

  // ─── LESSON 3 ─────────────────────────────────────────────────────────────
  {
    id: 'networking-fundamentals',
    slug: 'networking-fundamentals',
    title: 'Networking Fundamentals',
    description: 'IP addresses, ports, DNS, HTTP/HTTPS, TCP/UDP, SSL, and reverse proxies — everything a developer needs to understand how the internet works.',
    category: 'Linux',
    order: 3,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## Why Networking Matters for Developers

When your app doesn't connect to the database, when HTTPS doesn't work, when port 3000 is blocked, when DNS isn't resolving — you need networking knowledge to diagnose and fix it.

You don't need to become a network engineer. You need enough to understand what's happening when things go wrong.

---

## IP Addresses

An **IP address** is a unique number that identifies a device on a network — like a postal address for computers.

**IPv4:** 4 numbers from 0–255, separated by dots: \`192.168.1.100\`
**IPv6:** Newer, longer format: \`2001:0db8:85a3::8a2e:0370:7334\`

### Public IP vs Private IP

| Type | Example | Visible from? |
|------|---------|---------------|
| Public IP | 203.0.113.1 | The entire internet |
| Private IP | 192.168.1.100 | Only your local network |

**Your laptop's IP:** probably \`192.168.x.x\` (private, inside your home network)
**Your server's IP:** a public IP assigned by your cloud provider (e.g., \`54.204.32.1\`)

\`\`\`bash
# Find your public IP
curl ifconfig.me

# Find your private IP
ip addr show        # Linux
ifconfig            # macOS/older Linux
ipconfig            # Windows
\`\`\`

**Special addresses:**
- \`127.0.0.1\` — localhost (your own machine)
- \`0.0.0.0\` — all interfaces (when a server binds here, it listens on all IPs)

---

## Ports

A **port** is a number (0–65535) that specifies which service on a machine should handle incoming traffic.

Think of IP as the building address, port as the apartment number.

**Well-known ports:**
| Port | Protocol | Used by |
|------|----------|---------|
| 80 | HTTP | Web traffic (unencrypted) |
| 443 | HTTPS | Web traffic (encrypted) |
| 22 | SSH | Remote server access |
| 3306 | MySQL | MySQL database |
| 5432 | PostgreSQL | PostgreSQL database |
| 6379 | Redis | Redis cache |
| 27017 | MongoDB | MongoDB database |
| 3000 | (custom) | Node.js / Next.js dev server |
| 8080 | (custom) | Alternative HTTP |

\`\`\`bash
# Check what ports are in use
sudo ss -tulpn                   # Linux: show all listening ports
sudo lsof -i -P -n | grep LISTEN # macOS: all listening ports
sudo lsof -i :3000               # who is using port 3000?

# Check if a port is open on a remote server
telnet myserver.com 3306
nc -zv myserver.com 5432
\`\`\`

---

## DNS — Domain Name System

DNS translates human-readable domain names into IP addresses.

\`\`\`
You type:    google.com
DNS returns: 142.250.80.46
Browser connects to: 142.250.80.46:443
\`\`\`

**DNS is like a phone book:** you look up a name, get the number.

**How DNS resolution works:**
1. You type \`github.com\` in the browser
2. Browser checks local cache — not found
3. Your OS asks the **DNS resolver** (usually your router or ISP's server)
4. Resolver asks the **root nameserver** — "who handles .com?"
5. Root refers to the **.com nameserver**
6. .com nameserver refers to **GitHub's nameserver**
7. GitHub's nameserver returns the IP \`140.82.121.4\`
8. Browser connects to that IP

**Common DNS record types:**
| Record | Purpose | Example |
|--------|---------|---------|
| A | Points domain to IPv4 | api.example.com → 203.0.113.1 |
| CNAME | Alias to another domain | www → example.com |
| MX | Mail server | example.com → mail.google.com |
| TXT | Verification / metadata | "v=spf1 include:..." |

\`\`\`bash
# Lookup DNS records
nslookup github.com
dig github.com
dig github.com A          # only A records
dig github.com MX         # mail records

# Check DNS propagation after changing records
dig @8.8.8.8 yourdomain.com  # query Google's DNS directly
\`\`\`

---

## HTTP and HTTPS

**HTTP** (HyperText Transfer Protocol) is the language browsers and servers use to communicate. It is a request-response protocol.

\`\`\`
Client (browser)                    Server
      │                               │
      │─── GET /api/users HTTP/1.1 ──→│   (request)
      │    Host: api.example.com      │
      │                               │
      │←── HTTP/1.1 200 OK ──────────│   (response)
      │    Content-Type: application/json
      │    {"users": [...]}           │
\`\`\`

**HTTP status codes you must know:**
| Code | Meaning |
|------|---------|
| 200 | OK — success |
| 201 | Created — resource created |
| 301 | Moved Permanently — redirect |
| 400 | Bad Request — client sent invalid data |
| 401 | Unauthorized — not authenticated |
| 403 | Forbidden — authenticated but not allowed |
| 404 | Not Found |
| 500 | Internal Server Error — your backend crashed |
| 502 | Bad Gateway — reverse proxy can't reach the backend |
| 503 | Service Unavailable — server overloaded or down |

**HTTPS** = HTTP + TLS (Transport Layer Security). All data is encrypted between client and server. Any modern production site must use HTTPS.

---

## SSL/TLS Certificates

An SSL/TLS certificate proves your server is who it claims to be and enables encryption.

**How HTTPS works:**
1. Browser visits \`https://bank.com\`
2. Server sends its **certificate** (signed by a Certificate Authority like Let's Encrypt)
3. Browser verifies the certificate is valid and not expired
4. Browser and server exchange encryption keys
5. All data is encrypted — nobody in the middle can read it

**Let's Encrypt** is the free Certificate Authority used by most websites:
\`\`\`bash
# Install certbot and get a free certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Certbot auto-configures nginx and sets up auto-renewal
\`\`\`

---

## TCP vs UDP

| | TCP | UDP |
|-|-----|-----|
| Connection | Establishes connection first | No connection |
| Reliability | Guaranteed delivery, in-order | No guarantee |
| Speed | Slower (overhead) | Faster |
| Use cases | HTTP, SSH, databases, email | Video streaming, DNS, gaming |

Most apps use TCP. HTTP, HTTPS, SSH, database connections — all TCP. UDP is used where speed matters more than perfect delivery (a dropped video frame is fine; a dropped bank transfer is not).

---

## Reverse Proxy

A **reverse proxy** sits in front of your app server and handles incoming requests. Clients talk to the proxy; the proxy forwards to your app.

\`\`\`
Internet → Nginx (port 80/443) → Node.js app (port 3000)
\`\`\`

**Why use a reverse proxy?**
- Handle SSL termination (Nginx manages HTTPS, your app runs plain HTTP)
- Load balancing across multiple app instances
- Serve static files without hitting Node.js
- Rate limiting and security
- Multiple apps on one server (by domain or path)

**Nginx as reverse proxy:**
\`\`\`nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name myapp.com www.myapp.com;

    location / {
        proxy_pass http://localhost:3000;  # forward to Node.js
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\``,
    codeExamples: [
      {
        title: 'Diagnosing a connection problem step-by-step',
        code: `# Problem: "Cannot connect to database" error in your Node.js app

# Step 1: Can you reach the server at all?
ping db.example.com
# If no reply: DNS or routing issue

# Step 2: Does DNS resolve correctly?
nslookup db.example.com
dig db.example.com
# Should return an IP address

# Step 3: Is the database port open?
nc -zv db.example.com 5432
# "Connection refused" = port closed or not listening
# "Connected" = port is open

# Step 4: Is something blocking the port? (on the server)
sudo ss -tulpn | grep 5432
# Nothing = PostgreSQL isn't running
# Something = check if it's binding to 0.0.0.0 (all interfaces)
# vs 127.0.0.1 (localhost only — this would block remote connections)

# Step 5: Check firewall rules
sudo ufw status        # Ubuntu firewall
sudo iptables -L       # iptables rules

# Step 6: Allow the port if needed
sudo ufw allow 5432    # allow PostgreSQL from anywhere (be careful!)
# Or better: only allow from specific IP
sudo ufw allow from 10.0.0.5 to any port 5432`,
        explanation: 'This step-by-step flow — ping → DNS → port check → firewall — diagnoses 90% of network connectivity problems you will encounter in production.',
      },
    ],
    commonMistakes: [
      'Binding a server to 127.0.0.1 and wondering why it\'s not reachable from outside — bind to 0.0.0.0 to accept external connections.',
      'Forgetting that a firewall (ufw, security group) might block ports even if the app is running fine.',
      'Not renewing SSL certificates — Let\'s Encrypt certs expire every 90 days. Set up auto-renewal.',
      'Confusing HTTP 401 (not authenticated) and 403 (authenticated but not allowed) — common interview question.',
      'Running production apps on port 3000 directly instead of using nginx on port 80/443 — ports below 1024 require root, and you don\'t want to run your app as root.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a public IP and a private IP?',
        answer: 'A public IP is a globally unique address visible on the internet, assigned by your ISP or cloud provider. A private IP (e.g., 192.168.x.x, 10.x.x.x) is only visible within a local network — your laptop in a home network has a private IP. When you deploy a server to AWS, it gets both a public IP (internet-facing) and a private IP (internal network). NAT translates between them.',
        difficulty: 'beginner',
      },
      {
        question: 'What is a reverse proxy and why is Nginx commonly used as one?',
        answer: 'A reverse proxy sits between the internet and your app server, forwarding requests on behalf of clients. Nginx is used as a reverse proxy because it handles SSL termination (so your app doesn\'t need to deal with HTTPS), serves static files blazingly fast, load-balances across multiple app instances, and provides a layer for rate limiting and caching. Your Node.js app runs on port 3000; Nginx listens on 80/443 and proxies to it.',
        difficulty: 'intermediate',
      },
      {
        question: 'What happens when you type a URL in the browser and press Enter?',
        answer: 'Full flow: (1) Browser parses the URL. (2) DNS lookup translates the domain to an IP address. (3) Browser establishes a TCP connection to the server on port 80 or 443. (4) If HTTPS, TLS handshake occurs to set up encryption. (5) Browser sends an HTTP request (GET /path HTTP/1.1). (6) Server processes the request and returns an HTTP response (200 OK + HTML). (7) Browser parses HTML, triggers additional requests for CSS, JS, images. (8) Page renders.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-3-1',
        title: 'Match the port to the service',
        description: 'Match each port number to the correct service and explain when you would need to open it in a firewall.',
        starterCode: `// Match ports to services:
// Ports: 22, 80, 443, 3306, 5432, 6379, 27017, 3000

// Services: HTTP, HTTPS, SSH, MySQL, PostgreSQL, Redis, MongoDB, Node.js dev

// Port 22   → Service: ___  When to open: ___
// Port 80   → Service: ___  When to open: ___
// Port 443  → Service: ___  When to open: ___
// Port 3306 → Service: ___  When to open: ___
// Port 5432 → Service: ___  When to open: ___
// Port 6379 → Service: ___  When to open: ___
// Port 27017 → Service: ___ When to open: ___
// Port 3000 → Service: ___  When to open: ___`,
        solution: `// Port 22   → SSH         Open only to your IP, never to 0.0.0.0
// Port 80   → HTTP        Open to everyone (redirect to 443)
// Port 443  → HTTPS       Open to everyone (your main web port)
// Port 3306 → MySQL       Never open to internet; only app server's private IP
// Port 5432 → PostgreSQL  Never open to internet; only app server's private IP
// Port 6379 → Redis       Never open to internet; only trusted internal IPs
// Port 27017 → MongoDB    Never open to internet; only trusted internal IPs
// Port 3000 → Node.js dev Open only during development, never in production
//             (use Nginx on 80/443 in production instead)`,
        hints: [
          'Database ports should NEVER be open to the internet',
          'SSH should only allow your specific IP, not 0.0.0.0/0',
          'In production, your app should be behind Nginx on 80/443, not exposed on 3000',
        ],
      },
    ],
    keyTakeaways: [
      'IP addresses identify machines. Ports identify which service on that machine to talk to.',
      'Public IPs are internet-visible. Private IPs (192.168.x.x, 10.x.x.x) are local network only.',
      '127.0.0.1 = localhost (your own machine). 0.0.0.0 = all interfaces (listen on all IPs).',
      'DNS translates domain names to IPs. Use dig or nslookup to debug DNS issues.',
      'HTTPS = HTTP + TLS encryption. Every production site needs HTTPS. Use Let\'s Encrypt (free).',
      'A reverse proxy (Nginx) sits in front of your app, handles SSL, and routes traffic.',
      'Database ports (3306, 5432, 27017) should never be open to the internet.',
    ],
    prevLesson: 'linux-for-developers',
    nextLesson: 'software-delivery-lifecycle',
  },

  // ─── LESSON 4 ─────────────────────────────────────────────────────────────
  {
    id: 'software-delivery-lifecycle',
    slug: 'software-delivery-lifecycle',
    title: 'Software Delivery Lifecycle',
    description: 'The complete flow from writing code to running in production: Code → Build → Test → Package → Release → Deploy → Monitor.',
    category: 'Introduction',
    order: 4,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## The Journey of Code to Production

Every feature you write goes through a series of stages before users can use it. Understanding this pipeline helps you know where automation helps, where things can go wrong, and what CI/CD is actually doing.

\`\`\`
Write Code → Build → Test → Package → Release → Deploy → Monitor
\`\`\`

---

## Stage 1: Code

The developer writes code and pushes it to a Git repository.

**What happens:**
- Write feature / fix bug in your IDE
- Write or update tests
- Run linter locally (\`npm run lint\`)
- Commit: \`git commit -m "feat: add user authentication"\`
- Push: \`git push origin feature/auth\`
- Open a Pull Request on GitHub

**Tools:** VS Code, Git, GitHub/GitLab/Bitbucket

---

## Stage 2: Build

The source code is compiled or bundled into a deployable artifact.

**What happens (Node.js / Next.js):**
\`\`\`bash
npm install       # install dependencies
npm run build     # compile TypeScript, bundle assets
# Output: .next/ folder or dist/ folder
\`\`\`

**What happens (Go / Java):**
\`\`\`bash
go build -o myapp ./cmd/server    # Go: compile to binary
mvn package                        # Java: compile to .jar
\`\`\`

**Build artifacts:** compiled binaries, .jar files, bundled JS, Docker images.

**Why build separately from deploy?** Build once, deploy many times. You build \`v1.2.3\` once, then deploy that same artifact to staging, then to production. This guarantees staging and production run identical code.

---

## Stage 3: Test

Automated tests run against the built code to verify it works correctly.

**Types of automated tests:**
| Type | What it tests | Speed | Example |
|------|--------------|-------|---------|
| Unit | Single function/class | Milliseconds | Does calculateTotal() return the right number? |
| Integration | Multiple components together | Seconds | Does the API + database return the right user? |
| E2E (End-to-End) | Full user flow | Minutes | Can a user sign up, log in, and place an order? |

\`\`\`bash
npm test               # run all tests
npm run test:unit      # unit tests only (fast)
npm run test:e2e       # end-to-end tests (slow, run less often)
\`\`\`

**If tests fail: stop the pipeline.** Do not deploy broken code.

---

## Stage 4: Package

The tested artifact is packaged into a distributable format.

**Common packaging formats:**
- **Docker image** — most common in modern apps
- **.tar.gz** — compressed archive for deployment
- **.deb / .rpm** — Linux system packages
- **.jar / .war** — Java applications
- **npm package** — libraries published to npmjs.com

\`\`\`bash
# Package as Docker image
docker build -t myapp:1.2.3 .
docker push myregistry/myapp:1.2.3   # push to registry
\`\`\`

**Image tagging:**
- \`myapp:latest\` — latest build (not recommended for production — not pinned)
- \`myapp:1.2.3\` — semantic version (recommended — reproducible)
- \`myapp:abc1234\` — Git commit hash (very precise — exact code)

---

## Stage 5: Release

A specific version is tagged and becomes an official release.

**What happens:**
\`\`\`bash
git tag v1.2.3
git push origin v1.2.3

# GitHub automatically creates a Release from the tag
# Changelog is generated from commit messages
# Release artifacts (binaries) are attached
\`\`\`

**Semantic versioning (SemVer):**
- \`MAJOR.MINOR.PATCH\` → \`1.2.3\`
- MAJOR: breaking change (incompatible API change)
- MINOR: new feature (backwards-compatible)
- PATCH: bug fix (backwards-compatible)

---

## Stage 6: Deploy

The packaged artifact is pushed to a server where users can access it.

**Deployment targets:**
- **Vercel / Netlify** — one-click frontend deployment
- **Railway / Render** — easy backend deployment
- **AWS / GCP / Azure** — full control, higher complexity
- **VPS (DigitalOcean, Hetzner)** — your own Linux server

**Deployment strategies:**

| Strategy | How | Downtime? |
|----------|-----|-----------|
| Recreate | Stop old, start new | Yes (brief) |
| Rolling | Replace instances one by one | No |
| Blue/Green | Run new version alongside old, switch traffic | No |
| Canary | Send 5% of traffic to new version, watch for errors | No |

---

## Stage 7: Monitor

After deployment, you watch for errors, performance degradation, and issues.

**What to monitor:**
- **Error rate:** Are users seeing 500 errors? (Sentry, Datadog)
- **Response time:** Are requests taking longer? (Grafana)
- **Uptime:** Is the app responding? (UptimeRobot, Pingdom)
- **Resource usage:** CPU, memory, disk on the server

**Alerting:** When an error threshold is crossed, send a Slack message, email, or PagerDuty alert to the on-call developer.

\`\`\`bash
# Simple health check endpoint (all apps should have one)
GET /health → { "status": "ok", "uptime": 12345 }
\`\`\``,
    codeExamples: [
      {
        title: 'Full pipeline in a GitHub Actions workflow',
        code: `# .github/workflows/pipeline.yml
name: Full Delivery Pipeline

on:
  push:
    branches: [main]

jobs:
  # Stage 2: Build
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci                   # install (ci = clean install)
      - run: npm run build            # compile/bundle

  # Stage 3: Test
  test:
    runs-on: ubuntu-latest
    needs: build                      # only run if build passes
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test

  # Stage 4: Package
  docker:
    runs-on: ubuntu-latest
    needs: test                       # only run if tests pass
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: |
          docker build -t myapp:\${{ github.sha }} .
          docker tag myapp:\${{ github.sha }} myapp:latest

  # Stage 6: Deploy
  deploy:
    runs-on: ubuntu-latest
    needs: docker
    environment: production           # requires manual approval
    steps:
      - name: Deploy to server
        run: |
          ssh ubuntu@\${{ secrets.SERVER_IP }} "
            docker pull myapp:\${{ github.sha }}
            docker stop myapp || true
            docker run -d --name myapp myapp:\${{ github.sha }}
          "`,
        explanation: 'Each stage in the SDLC becomes a GitHub Actions job. Jobs run in sequence with needs:. If any stage fails, the pipeline stops — broken code never reaches production.',
      },
    ],
    commonMistakes: [
      'Building code on the production server instead of building once and shipping the artifact — this creates different builds in different environments.',
      'Using :latest tag for production deployments — if you need to rollback, you don\'t know which exact version :latest was.',
      'Deploying without a health check — after deployment, verify the app is actually responding before calling it done.',
      'Skipping staging — always test in staging before production, especially for database migrations.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between blue/green deployment and canary deployment?',
        answer: 'Blue/Green: you run two identical environments (blue = current, green = new). When green is ready and tested, you switch all traffic at once. Rollback = switch back to blue. Zero downtime. Canary: you gradually shift traffic — start with 5% to the new version, watch for errors, increase to 25%, 50%, 100%. You catch problems before they affect all users. Canary is safer for major changes; blue/green is simpler to implement.',
        difficulty: 'intermediate',
      },
      {
        question: 'Why should you build once and deploy the same artifact to all environments?',
        answer: 'Building separately per environment risks code differences: a rebuild might pick up a newer dependency version, a compiler update, or a different environment variable. If staging and production run different builds, testing on staging gives false confidence. Build once (e.g., a Docker image tagged with a Git commit hash), promote the same exact artifact from staging to production. This guarantees what you tested is what you deployed.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-4-1',
        title: 'Map your app\'s deployment to SDLC stages',
        description: 'Think about a project you are building (or want to build). Fill in what happens at each stage of the delivery lifecycle.',
        starterCode: `// Project: (e.g., "Personal blog built with Next.js and Supabase")

// Stage 1 - CODE:
// What tools do you use? What does a commit look like?

// Stage 2 - BUILD:
// What command builds your project? What is the output?

// Stage 3 - TEST:
// What tests do you run? (or should run?)

// Stage 4 - PACKAGE:
// How will you package it? Docker? Just the .next/ folder?

// Stage 5 - RELEASE:
// How will you version it? Git tags? SemVer?

// Stage 6 - DEPLOY:
// Where will you deploy? Vercel? Railway? VPS?

// Stage 7 - MONITOR:
// How will you know if it's down or broken?`,
        solution: `// Project: "Personal blog built with Next.js and Supabase"

// Stage 1 - CODE:
// VS Code + Git. Commits like: "feat: add dark mode toggle"
// Push to GitHub → open PR → get review

// Stage 2 - BUILD:
// npm run build → outputs .next/ folder
// TypeScript compiled, pages pre-rendered

// Stage 3 - TEST:
// npm test → Jest unit tests for utility functions
// Playwright E2E test: "can a user read a blog post?"

// Stage 4 - PACKAGE:
// Option A: Let Vercel build from source (simplest)
// Option B: docker build -t blog:v1.0.0 .

// Stage 5 - RELEASE:
// git tag v1.0.0 for major features
// Auto-deploy on every main branch push for patches

// Stage 6 - DEPLOY:
// Vercel (free tier, automatic on push)
// Connected to Supabase (managed PostgreSQL)

// Stage 7 - MONITOR:
// Sentry for error tracking (free tier)
// UptimeRobot checks /health every 5 minutes
// Vercel analytics for page performance`,
        hints: ['There is no wrong answer — this is about understanding the process for your specific project'],
      },
    ],
    keyTakeaways: [
      'SDLC: Code → Build → Test → Package → Release → Deploy → Monitor.',
      'Build once, deploy the same artifact everywhere — ensures staging = production.',
      'Tag Docker images with Git commit hashes (not :latest) for reproducible deployments.',
      'Tests that fail should stop the pipeline. Never deploy broken code.',
      'Every app needs a /health endpoint and monitoring to know when it breaks.',
      'SemVer: MAJOR.MINOR.PATCH — breaking.feature.bugfix.',
    ],
    prevLesson: 'networking-fundamentals',
    nextLesson: 'cicd-fundamentals',
  },

  // ─── LESSON 5 ─────────────────────────────────────────────────────────────
  {
    id: 'cicd-fundamentals',
    slug: 'cicd-fundamentals',
    title: 'CI/CD Fundamentals',
    description: 'Continuous Integration, Continuous Delivery, and Continuous Deployment explained — what they are, how they differ, and why they change how teams work.',
    category: 'Introduction',
    order: 5,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## The Problem CI/CD Solves

In a team of 5 developers, each works on different features. They all commit to the same repo. Without automation:
- Code is integrated manually once a week
- Tests are run manually before a big release
- Integration conflicts are discovered late
- Deployment is a nerve-wracking manual event
- It takes hours (or days) to know if a change broke something

**CI/CD automates the entire feedback loop:** every commit triggers build + test + deploy automatically.

---

## Continuous Integration (CI)

**Definition:** The practice of automatically building and testing code every time a developer pushes a commit.

**What CI does on every push:**
1. Checks out the latest code
2. Installs dependencies
3. Runs the linter (catches style/syntax issues)
4. Runs unit tests (catches broken logic)
5. Runs integration tests (catches broken APIs)
6. Reports: PASS ✅ or FAIL ❌

**Key principle:** If CI fails, the developer must fix it before moving on. The main branch is always in a working state.

**How it changes team behavior:**
- You know within 5 minutes if your commit broke something
- You never merge broken code to main
- Conflicts are discovered early (when they're small), not at release time

---

## Continuous Delivery

**Definition:** An extension of CI where code is always in a deployable state. Every successful CI run produces a release artifact that *can* be deployed with one click.

\`\`\`
Commit → CI (build + test) → Artifact in staging → [Manual approve] → Production
\`\`\`

The difference from CI: after tests pass, the artifact (Docker image, build) is automatically deployed to a **staging environment**. A human then reviews and approves the production deployment.

---

## Continuous Deployment

**Definition:** Every commit that passes CI is automatically deployed to production — no human approval.

\`\`\`
Commit → CI (build + test) → Automatic deploy to production
\`\`\`

This requires:
- Very high test coverage (you trust the tests to catch regressions)
- Feature flags (deploy code before turning it on for users)
- Excellent monitoring (detect problems within seconds of deploy)

**Who does this:** Startups and companies like Netflix, Amazon, and Etsy deploy hundreds of times per day. They rely on automated tests, monitoring, and instant rollback.

---

## CI vs CD vs Continuous Deployment

| | CI | Continuous Delivery | Continuous Deployment |
|--|----|--------------------|----------------------|
| Automates | Build + Test | Build + Test + Staging deploy | Build + Test + Production deploy |
| Human step | Fix failures | Approve production deploy | None (fully automated) |
| Frequency | Every commit | Every commit | Every passing commit |
| Best for | All teams | Most product teams | High-trust, high-coverage teams |

---

## Real World CI/CD Workflow

### Typical startup workflow (GitHub Actions + Vercel):

\`\`\`
Developer pushes to feature branch
    │
    ▼
GitHub Actions: CI runs
    ├── npm install
    ├── npm run lint
    ├── npm test
    └── PASS → PR shows green checkmark

Developer merges PR to main
    │
    ▼
GitHub Actions: CD runs
    ├── npm install
    ├── npm run build
    ├── Docker build + push to registry
    └── Deploy to staging automatically

Team tests on staging
    │
    ▼
Manual approval → Deploy to production
    │
    ▼
Monitor: Sentry, uptime checks, logs
\`\`\`

---

## Benefits of CI/CD

**Faster development:**
- Feedback in minutes, not weeks
- Bugs caught while context is fresh

**Higher quality:**
- Tests run on every commit, not just before release
- Nobody can accidentally skip testing

**Lower risk:**
- Small, frequent deploys are less risky than big quarterly releases
- Easy to rollback: redeploy the previous version

**Team confidence:**
- Developers trust the pipeline to catch issues
- Less fear of breaking production
- On-call engineers sleep better

---

## Common CI/CD Tools

| Tool | Type | Notes |
|------|------|-------|
| **GitHub Actions** | CI/CD | Built into GitHub, free for public repos |
| **GitLab CI** | CI/CD | Built into GitLab |
| **Jenkins** | CI/CD | Self-hosted, very configurable |
| **CircleCI** | CI/CD | Fast, good caching |
| **Travis CI** | CI | Popular for open source |
| **Vercel / Netlify** | CD | One-click deploy for frontend |
| **Railway / Render** | CD | One-click deploy for backend |

For most developers: **GitHub Actions** for CI + **Vercel/Railway** for CD covers 90% of use cases.`,
    codeExamples: [
      {
        title: 'CI pipeline that stops broken code from merging',
        code: `# .github/workflows/ci.yml
# Runs on every PR and push to main
name: CI

on:
  pull_request:           # run on every PR
    branches: [main]
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'          # cache node_modules for speed

      - name: Install
        run: npm ci             # npm ci is faster and more reliable than npm install

      - name: Lint
        run: npm run lint       # fails if code has style errors

      - name: Type Check
        run: npx tsc --noEmit  # fails if TypeScript errors exist

      - name: Test
        run: npm test -- --coverage  # fail if coverage drops

      - name: Build
        run: npm run build      # fail if build breaks

# If ANY step fails, the pipeline fails.
# GitHub blocks the PR merge until CI passes.
# This is the most important DevOps practice for a developer.`,
        explanation: 'This CI workflow runs on every PR. If lint, types, tests, or build fail — the PR cannot be merged. The main branch is always deployable.',
      },
    ],
    commonMistakes: [
      'Running CI only on the main branch — CI should run on every PR so you catch issues before merging.',
      'Having a CI pipeline that always passes because tests are weak — a green CI with no real tests gives false confidence.',
      'Not caching dependencies in CI — npm install from scratch on every run wastes 2–3 minutes. Use actions/cache or node-version cache.',
      'Treating CI failures as optional — "I\'ll fix the tests later" is how tech debt accumulates.',
      'Mixing CI and CD responsibilities in one huge job — separate them so you can see exactly which stage failed.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between Continuous Integration and Continuous Delivery?',
        answer: 'Continuous Integration (CI) automatically builds and tests code on every commit, ensuring the codebase is always in a working state. Continuous Delivery extends this by ensuring every successful CI run produces a deployable artifact and automatically deploys to a staging environment — production deployment still requires human approval. Continuous Deployment goes further: every passing commit is deployed to production automatically with no human step.',
        difficulty: 'beginner',
      },
      {
        question: 'Why do companies prefer many small deploys over big quarterly releases?',
        answer: 'Small, frequent deploys are less risky: fewer changes per deploy means fewer things that can go wrong, bugs are easier to isolate, rollback is simpler (just redeploy the previous version). They also provide faster feedback: a bug introduced today is caught and fixed today, not discovered 3 months later when the developer has forgotten the context. Netflix and Amazon deploy thousands of times per day precisely because smaller, more frequent changes are safer than large infrequent ones.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-5-1',
        title: 'Design a CI/CD pipeline for a startup',
        description: 'A startup has a Next.js frontend, a Node.js API, and a PostgreSQL database. Design their CI/CD pipeline for GitHub Actions.',
        starterCode: `// Design the pipeline:
// 1. What triggers the CI pipeline?
// 2. What steps does CI run?
// 3. What triggers the CD pipeline?
// 4. Where do they deploy to?
// 5. Is the production deployment manual or automatic?
// 6. How do they handle the database migration?

// Write pseudo-YAML or describe each stage:`,
        solution: `// Trigger: Pull Requests to main + pushes to main

// CI (runs on every PR):
// 1. npm ci (clean install)
// 2. npm run lint (ESLint)
// 3. npx tsc --noEmit (TypeScript check)
// 4. npm test (Jest unit + integration tests)
// 5. npm run build (ensure it compiles)
// → PR blocked from merging if any step fails

// CD (runs only when PR merges to main):
// 1. npm ci + npm run build
// 2. docker build -t myapp:$GIT_SHA .
// 3. docker push to GitHub Container Registry
// 4. Auto-deploy to staging (Railway or Render)
//    - Run DB migration: npx prisma migrate deploy
//    - Deploy new Docker image
// 5. Notify Slack: "Staging updated"
// 6. MANUAL APPROVAL → deploy same image to production
//    - Run DB migration on production DB
//    - Deploy same Docker image (no rebuild!)
//    - Run health check: curl /health

// Database migration rule:
// Always run migrations BEFORE deploying new app code.
// Migrations must be backwards-compatible (new column = nullable first)
// This way: old app + new DB works, new app + new DB works.`,
        hints: [
          'Migrations must be backwards-compatible with the old code version',
          'Deploy the same Docker image to staging and production — never rebuild',
          'Run health checks after each deployment to verify success',
        ],
      },
    ],
    keyTakeaways: [
      'CI: automate build + test on every commit. Main branch is always in a working state.',
      'Continuous Delivery: every passing CI run deploys to staging automatically. Production needs human approval.',
      'Continuous Deployment: every passing commit goes to production automatically. Requires high test coverage.',
      'Small, frequent deploys are safer than big infrequent releases.',
      'For most developers: GitHub Actions for CI + Vercel/Railway for CD is the right starting point.',
      'CI runs on every PR. It should block merges when it fails.',
    ],
    prevLesson: 'software-delivery-lifecycle',
    nextLesson: 'docker-fundamentals',
  },

  // ─── LESSON 6 ─────────────────────────────────────────────────────────────
  {
    id: 'docker-fundamentals',
    slug: 'docker-fundamentals',
    title: 'Docker Fundamentals',
    description: 'What Docker is, why it exists, how containers differ from VMs, and how images, containers, and registries fit together.',
    category: 'Docker',
    order: 6,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## The Problem Docker Solves

**"It works on my machine."**

This phrase is responsible for countless hours of lost productivity. A developer builds a feature on macOS. It uses Node.js 18. The production server runs Node.js 16. The app breaks. The developer can't reproduce the bug because their machine is different.

Before Docker, deploying software meant:
- Manually configuring each server to have the right OS, runtime, and dependencies
- Environments drifting apart over time (production installs a library, staging doesn't)
- Onboarding new developers: "spend a week setting up your environment"
- "Works in dev, breaks in staging, crashes in production"

**Docker solves this by packaging your app and everything it needs into a single, portable unit that runs identically everywhere.**

---

## What is Docker?

Docker is a platform for **containerization** — packaging applications with their runtime, dependencies, and configuration into isolated units called **containers**.

A container is like a lightweight, portable virtual machine — but much faster and more efficient.

\`\`\`
Your App + Node.js 20 + npm packages + config
= One Docker image
= Runs identically on your laptop, CI, staging, production
\`\`\`

---

## Virtual Machine vs Container

This is the most important Docker concept to understand.

### Virtual Machine (VM)

\`\`\`
┌──────────────────────────────────┐
│  App A     App B     App C       │
│  Node 18   Python 3  Go 1.21     │
├──────────────────────────────────┤
│  OS (Ubuntu)  OS (CentOS)  OS()  │  ← Each VM has its own full OS
├──────────────────────────────────┤
│         Hypervisor               │  ← Manages VMs (VMware, VirtualBox)
├──────────────────────────────────┤
│      Physical Hardware           │
└──────────────────────────────────┘
\`\`\`

A VM includes a full operating system (several GB). Starting a VM takes minutes.

### Container

\`\`\`
┌──────────────────────────────────┐
│  App A     App B     App C       │
│  Node 18   Python 3  Go 1.21     │
├──────────────────────────────────┤
│  Container Runtime (Docker)      │  ← Shares the host OS kernel
├──────────────────────────────────┤
│      Host OS (Linux)             │  ← One OS for all containers
├──────────────────────────────────┤
│      Physical Hardware           │
└──────────────────────────────────┘
\`\`\`

Containers share the host OS kernel. They only include the app and its dependencies — no full OS. Starting a container takes milliseconds.

| | Virtual Machine | Container |
|-|----------------|-----------|
| Size | Gigabytes | Megabytes |
| Startup time | Minutes | Milliseconds |
| Isolation | Full OS isolation | Process isolation |
| Performance | Overhead from hypervisor | Near-native |
| Portability | Less portable | Highly portable |
| Use case | Strong isolation needed | App deployment |

---

## Docker Architecture

Four core concepts:

### 1. Dockerfile
A text file containing instructions to build an image. Like a recipe.

\`\`\`dockerfile
FROM node:20-alpine      # start from Node 20 image
WORKDIR /app             # set working directory
COPY . .                 # copy source code
RUN npm install          # install dependencies
CMD ["node", "server.js"]  # command to run the app
\`\`\`

### 2. Image
A read-only blueprint built from a Dockerfile. Like a class in OOP.

\`\`\`bash
docker build -t myapp:1.0.0 .   # build image from Dockerfile
docker images                   # list all images
\`\`\`

### 3. Container
A running instance of an image. Like an object instantiated from a class.

\`\`\`bash
docker run -p 3000:3000 myapp:1.0.0   # create and start container
docker ps                              # list running containers
\`\`\`

### 4. Registry
A storage service for Docker images. Docker Hub is the public default.

\`\`\`bash
docker push myusername/myapp:1.0.0   # push to Docker Hub
docker pull myusername/myapp:1.0.0   # pull from Docker Hub
\`\`\`

---

## Image Layers

Every instruction in a Dockerfile creates a **layer**. Layers are cached — if nothing changed, Docker reuses the cached layer instead of rebuilding.

\`\`\`dockerfile
FROM node:20-alpine       # Layer 1: base image
WORKDIR /app              # Layer 2: working directory
COPY package.json .       # Layer 3: just the package.json
RUN npm install           # Layer 4: dependencies (CACHED if package.json unchanged)
COPY . .                  # Layer 5: source code
CMD ["node", "server.js"] # Layer 6: start command
\`\`\`

**Why copy package.json before the source code?** Dependencies change less often than code. By copying package.json first and running npm install before copying the rest of the source, Docker caches the npm install layer. Only changed source files rebuild — making builds much faster.

---

## Real-World Benefits

**Onboarding a new developer:**
\`\`\`bash
# Without Docker: "Spend 3 days setting up your dev environment"
# With Docker:
git clone repo
docker compose up
# Everything running in 2 minutes, identically to production
\`\`\`

**Consistent environments:**
- Staging runs the exact same image as production
- "Works on my machine" becomes "works in my container" → works everywhere

**Easy rollback:**
\`\`\`bash
# If the new deploy breaks production:
docker run myapp:1.2.2   # go back to previous version instantly
\`\`\`

**Microservices:**
Each service runs in its own container with its own runtime and dependencies. A Python ML model and a Node.js API can run side by side without conflicts.`,
    codeExamples: [
      {
        title: 'Docker in 5 commands — from zero to running app',
        code: `# 1. Pull an existing image from Docker Hub
docker pull nginx:alpine
# Pulls the official Nginx web server image (tiny alpine version)

# 2. Run it as a container
docker run -d -p 8080:80 --name mywebserver nginx:alpine
# -d          → run in background (detached mode)
# -p 8080:80  → map your machine's port 8080 to container's port 80
# --name      → give the container a name

# 3. Check it's running
docker ps
# CONTAINER ID  IMAGE         STATUS    PORTS                NAMES
# a1b2c3d4e5f6  nginx:alpine  Up 5s     0.0.0.0:8080->80/tcp mywebserver

# 4. See logs
docker logs mywebserver

# 5. Open http://localhost:8080 in browser — Nginx is serving!

# Clean up
docker stop mywebserver
docker rm mywebserver`,
        explanation: 'You just ran a web server in a container with one command. No installation, no configuration, no "it works on my machine" issues. This is Docker\'s power.',
      },
      {
        title: 'Build your own image and run it',
        code: `# 1. Create a simple Node.js app
# server.js:
# const http = require('http');
# http.createServer((req, res) => {
#   res.end('Hello from Docker!');
# }).listen(3000);

# 2. Write Dockerfile
# FROM node:20-alpine
# WORKDIR /app
# COPY server.js .
# EXPOSE 3000
# CMD ["node", "server.js"]

# 3. Build the image
docker build -t hello-docker:1.0.0 .
# Sending build context to Docker daemon
# Step 1/5: FROM node:20-alpine
# Step 2/5: WORKDIR /app
# Step 3/5: COPY server.js .
# Step 4/5: EXPOSE 3000
# Step 5/5: CMD ["node", "server.js"]
# Successfully built abc123
# Successfully tagged hello-docker:1.0.0

# 4. Run it
docker run -d -p 3000:3000 hello-docker:1.0.0

# 5. Test it
curl http://localhost:3000
# Hello from Docker!

# 6. Share it (push to Docker Hub)
docker tag hello-docker:1.0.0 yourusername/hello-docker:1.0.0
docker push yourusername/hello-docker:1.0.0

# 7. Anyone in the world can now run your app:
docker run -p 3000:3000 yourusername/hello-docker:1.0.0`,
        explanation: 'This is the complete Docker workflow: write code → Dockerfile → build image → run container → push to registry → anyone can pull and run.',
      },
    ],
    commonMistakes: [
      'Running containers as root inside the container — adds security risk. Always add a non-root user in Dockerfile.',
      'Copying everything into the image including node_modules — always add node_modules to .dockerignore.',
      'Not using layer caching correctly — copy package.json and run npm install BEFORE copying source code.',
      'Using :latest tag in production — pin to a specific version (node:20.11.0-alpine) for reproducibility.',
      'Storing secrets in the Dockerfile or image — images are often public. Use environment variables or secrets.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a Docker image and a Docker container?',
        answer: 'A Docker image is a read-only blueprint — like a class or a template. It contains the app, runtime, dependencies, and configuration built layer by layer from a Dockerfile. A Docker container is a running instance of an image — like an object instantiated from a class. Multiple containers can run from the same image. Containers are isolated processes with their own filesystem, network, and resources.',
        difficulty: 'beginner',
      },
      {
        question: 'How is a container different from a virtual machine?',
        answer: 'A VM includes a full operating system (several GB, minutes to start) managed by a hypervisor. A container shares the host OS kernel and only includes the app and its dependencies (megabytes, milliseconds to start). Containers are more efficient but provide less isolation. VMs are used when you need strong OS-level isolation; containers are used for app deployment and microservices where speed and portability matter.',
        difficulty: 'beginner',
      },
      {
        question: 'What is Docker image layering and why does it matter?',
        answer: 'Every Dockerfile instruction creates a layer. Layers are cached — if an instruction and all its inputs are unchanged, Docker reuses the cached layer. This dramatically speeds up builds. Best practice: put rarely-changing instructions first (FROM, installing system packages) and frequently-changing instructions last (COPY source code). This way, changing one line of code only rebuilds the last layer, not the entire image.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-6-1',
        title: 'Explain the Docker architecture',
        description: 'For each scenario, identify what Docker concept is being used and why.',
        starterCode: `// Scenario 1:
// A developer writes a Dockerfile for their Express app.
// They run: docker build -t myapi:1.0.0 .
// What is "myapi:1.0.0"? What has been created?

// Scenario 2:
// The developer runs: docker run -d -p 4000:4000 myapi:1.0.0
// What is now running? How is it different from what was created in scenario 1?

// Scenario 3:
// The developer runs: docker push mycompany/myapi:1.0.0
// Where does the image go? Who can now use it?

// Scenario 4:
// A teammate runs: docker pull mycompany/myapi:1.0.0 && docker run mycompany/myapi:1.0.0
// What do they get? Why does it work identically?`,
        solution: `// Scenario 1:
// "myapi:1.0.0" is a Docker IMAGE.
// docker build reads the Dockerfile and creates a read-only image —
// a layered blueprint containing the app code, Node.js runtime,
// npm packages, and all configuration. Nothing is running yet.

// Scenario 2:
// A CONTAINER is now running — a live instance of the myapi:1.0.0 image.
// Unlike the image (read-only, static), the container is a running process.
// Port mapping: -p 4000:4000 means requests to localhost:4000
// are forwarded to port 4000 inside the container.

// Scenario 3:
// The image is pushed to a REGISTRY (Docker Hub or a private registry).
// Anyone with access can now pull and run the exact same image.

// Scenario 4:
// The teammate gets the EXACT same image — same Node.js version,
// same npm packages, same code. It runs identically because the
// image captures the complete environment. This eliminates
// "works on my machine" problems.`,
        hints: ['Image = blueprint (static). Container = running instance (alive).'],
      },
    ],
    keyTakeaways: [
      'Docker packages your app + runtime + dependencies into a portable container.',
      'Image = blueprint (Dockerfile → build → image). Container = running instance of an image.',
      'Containers share the host OS kernel — much lighter than VMs (MB vs GB, ms vs minutes).',
      'Layer caching: copy package.json and run npm install before copying source code.',
      'Registry (Docker Hub) stores and distributes images. Push once, pull anywhere.',
      'Never store secrets in images. Never run as root inside a container.',
    ],
    prevLesson: 'cicd-fundamentals',
    nextLesson: 'docker-commands',
  },

  // ─── LESSON 7 ─────────────────────────────────────────────────────────────
  {
    id: 'docker-commands',
    slug: 'docker-commands',
    title: 'Docker Commands',
    description: 'Every Docker command you will use daily — docker run, ps, exec, logs, images, pull, push — explained with real examples.',
    category: 'Docker',
    order: 7,
    difficulty: 'beginner',
    estimatedTime: 30,
    content: `## Docker CLI — Your Main Interface

The Docker command line is how you interact with Docker. Once you know these commands, you can manage any containerized application.

\`\`\`bash
docker [command] [options] [arguments]
\`\`\`

---

## Container Lifecycle Commands

### docker run — Create and start a container

The most used Docker command. Creates a new container from an image and starts it.

\`\`\`bash
# Basic run
docker run nginx

# Run in background (detached mode) — most common
docker run -d nginx

# Map ports: host:container
docker run -d -p 8080:80 nginx
# Access at http://localhost:8080

# Give it a name
docker run -d -p 8080:80 --name myserver nginx

# Set environment variables
docker run -d -e NODE_ENV=production -e PORT=3000 myapp

# Mount a volume: host-path:container-path
docker run -d -v /home/user/data:/app/data myapp

# Limit resources
docker run -d --memory="512m" --cpus="1.0" myapp

# Interactive terminal (for debugging)
docker run -it ubuntu bash        # start ubuntu with bash shell
docker run -it --rm node:20 node  # --rm removes container when you exit
\`\`\`

### docker ps — List containers

\`\`\`bash
docker ps               # list RUNNING containers only
docker ps -a            # list ALL containers (including stopped)
docker ps -q            # only show container IDs (useful in scripts)

# Output columns:
# CONTAINER ID  IMAGE   COMMAND        CREATED  STATUS  PORTS    NAMES
# a1b2c3d4      nginx   "/docker-en…"  5min ago Up 5min 80/tcp   myserver
\`\`\`

### docker stop / start / restart

\`\`\`bash
docker stop myserver         # gracefully stop (sends SIGTERM, waits 10s)
docker stop -t 5 myserver    # stop with 5s timeout
docker start myserver        # start a stopped container
docker restart myserver      # stop then start
docker kill myserver         # immediately kill (SIGKILL)
\`\`\`

### docker rm — Remove containers

\`\`\`bash
docker rm myserver           # remove a stopped container
docker rm -f myserver        # force remove (even if running)
docker rm $(docker ps -aq)   # remove ALL stopped containers

# Clean up everything
docker system prune          # remove stopped containers + dangling images
docker system prune -a       # remove everything not currently in use
\`\`\`

---

## Working Inside Containers

### docker exec — Run commands inside a running container

\`\`\`bash
# Open an interactive bash shell inside the container
docker exec -it myserver bash
# Now you're inside the container — explore files, run commands

# Run a single command inside the container
docker exec myserver ls /app
docker exec myserver cat /etc/nginx/nginx.conf
docker exec myserver env              # see all environment variables

# Inspect a running database
docker exec -it postgres-db psql -U postgres
docker exec -it mongodb mongosh

# -i = interactive (keep stdin open)
# -t = allocate a TTY (makes it feel like a terminal)
\`\`\`

### docker logs — View container output

\`\`\`bash
docker logs myserver             # show all logs
docker logs myserver -f          # follow (stream live logs)
docker logs myserver -n 50       # show last 50 lines
docker logs myserver --since 1h  # logs from last 1 hour
docker logs myserver --since 2024-01-15T10:00:00  # since timestamp
\`\`\`

---

## Image Commands

### docker images — List local images

\`\`\`bash
docker images                    # list all local images
docker images nginx              # list all nginx images
docker image inspect nginx       # detailed info about an image
docker image history myapp:1.0   # see all layers and sizes
\`\`\`

### docker pull — Download images

\`\`\`bash
docker pull nginx                # pull latest nginx
docker pull nginx:1.25-alpine    # pull specific version (always pin versions)
docker pull postgres:16          # pull PostgreSQL 16
docker pull node:20-alpine       # pull Node.js 20 alpine
\`\`\`

### docker push — Upload images

\`\`\`bash
# First, tag the image with your registry path
docker tag myapp:1.0.0 myusername/myapp:1.0.0

# Push to Docker Hub
docker push myusername/myapp:1.0.0

# Push to GitHub Container Registry
docker tag myapp:1.0.0 ghcr.io/myusername/myapp:1.0.0
docker push ghcr.io/myusername/myapp:1.0.0
\`\`\`

### docker rmi — Remove images

\`\`\`bash
docker rmi myapp:1.0.0           # remove specific image
docker rmi -f myapp:1.0.0        # force remove
docker image prune               # remove all dangling (untagged) images
docker image prune -a            # remove ALL unused images
\`\`\`

---

## Networking Commands

\`\`\`bash
docker network ls                # list networks
docker network create mynet      # create a custom network
docker run --network mynet myapp # join a container to a network

# Containers on the same network can talk by name:
# http://postgres:5432  (container name as hostname)
\`\`\`

---

## Volume Commands

\`\`\`bash
docker volume ls                 # list volumes
docker volume create mydata      # create named volume
docker volume inspect mydata     # details about a volume
docker volume rm mydata          # remove volume
\`\`\`

---

## Inspect and Debug

\`\`\`bash
# Full details about a container
docker inspect myserver
docker inspect myserver | grep IPAddress   # find container IP

# Resource usage
docker stats                     # live CPU, memory, network for all containers
docker stats myserver            # for one container

# Copy files between host and container
docker cp myserver:/app/log.txt ./log.txt   # container → host
docker cp ./config.json myserver:/app/      # host → container
\`\`\`

---

## Docker in Practice — Useful Patterns

\`\`\`bash
# Run PostgreSQL locally (no installation needed)
docker run -d \\
  --name postgres \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_DB=myapp \\
  -p 5432:5432 \\
  -v postgres_data:/var/lib/postgresql/data \\
  postgres:16

# Run Redis locally
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Run MongoDB locally
docker run -d \\
  --name mongodb \\
  -p 27017:27017 \\
  -e MONGO_INITDB_ROOT_USERNAME=admin \\
  -e MONGO_INITDB_ROOT_PASSWORD=secret \\
  mongo:7

# Stop and remove everything at once
docker stop postgres redis mongodb
docker rm postgres redis mongodb
\`\`\``,
    codeExamples: [
      {
        title: 'Debugging a broken container',
        code: `# Your app container keeps crashing. Here's how to debug it.

# Step 1: See what's running (or not running)
docker ps -a
# Shows: myapp   Exited (1) 30 seconds ago

# Step 2: Check the logs to find the error
docker logs myapp
# Error: Cannot find module 'express'
# → Missing npm dependency

# Step 3: If the container is running but behaving wrong,
# exec into it to investigate
docker exec -it myapp sh
# Inside the container:
ls /app                    # is the code there?
cat /app/package.json      # check dependencies
node -e "require('express')"  # test if module loads
env                        # check environment variables
exit

# Step 4: Check resource usage
docker stats myapp
# Shows: 95% memory used → out of memory!

# Step 5: Inspect the container config
docker inspect myapp
# Check: Env, Mounts, NetworkSettings, State.ExitCode

# Step 6: Fix the issue, rebuild, restart
docker build -t myapp:fixed .
docker stop myapp && docker rm myapp
docker run -d --name myapp -p 3000:3000 myapp:fixed
docker logs myapp -f  # follow to confirm it started correctly`,
        explanation: 'This is the real debugging flow for containerized apps. logs → exec → stats → inspect. Memorize this sequence.',
      },
    ],
    commonMistakes: [
      'Not using -d (detached mode) and blocking your terminal — always use -d for long-running services.',
      'Forgetting -it when running docker exec bash — without -i and -t you get no interactive terminal.',
      'Not using --rm for one-off containers — they pile up as stopped containers and waste disk space.',
      'Running docker rm without stopping first — use docker rm -f or stop first.',
      'Not naming containers with --name — auto-generated names like "quirky_curie" are hard to manage.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between docker stop and docker kill?',
        answer: 'docker stop sends SIGTERM to the container\'s main process, giving it time to clean up (close connections, flush buffers) before stopping — default 10 second timeout. docker kill sends SIGKILL which immediately terminates the process with no cleanup. Always prefer docker stop for graceful shutdown. Use docker kill only when the container is unresponsive and docker stop does not work.',
        difficulty: 'beginner',
      },
      {
        question: 'How do you get a shell inside a running Docker container?',
        answer: 'Use docker exec -it container_name bash (or sh for Alpine-based images that do not have bash). The -i flag keeps stdin open, -t allocates a pseudo-TTY making it feel like an interactive terminal. This is the primary way to debug running containers — inspect files, check environment variables, run diagnostic commands, and test connectivity.',
        difficulty: 'beginner',
      },
      {
        question: 'What is the difference between docker run and docker start?',
        answer: 'docker run creates a new container from an image and starts it — it is equivalent to docker create + docker start. docker start restarts an existing stopped container that was previously created. You use docker run the first time, and docker start/stop to manage the same container thereafter.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-7-1',
        title: 'Docker commands challenge',
        description: 'Write the Docker command for each task.',
        starterCode: `# Task 1: Run PostgreSQL 16 in the background on port 5432,
# with password "mypassword", named "mydb"

# Task 2: Check if "mydb" is running and see its port mapping

# Task 3: View the live logs of "mydb"

# Task 4: Open a psql shell inside the running "mydb" container
# (hint: use exec with psql -U postgres)

# Task 5: Stop and completely remove the "mydb" container

# Task 6: Remove all dangling (untagged) Docker images

# Task 7: Check how much CPU and memory "mydb" is using`,
        solution: `# Task 1:
docker run -d \\
  --name mydb \\
  -e POSTGRES_PASSWORD=mypassword \\
  -p 5432:5432 \\
  postgres:16

# Task 2:
docker ps | grep mydb
# or: docker ps --filter name=mydb

# Task 3:
docker logs mydb -f

# Task 4:
docker exec -it mydb psql -U postgres

# Task 5:
docker stop mydb && docker rm mydb
# or in one command:
docker rm -f mydb

# Task 6:
docker image prune
# or remove ALL unused: docker image prune -a

# Task 7:
docker stats mydb`,
        hints: [
          '-e sets environment variables, -p maps ports, -d runs in background',
          'exec -it for interactive sessions inside containers',
          'prune removes unused/dangling images',
        ],
      },
    ],
    keyTakeaways: [
      'docker run -d -p host:container --name n image — the core run command.',
      'docker ps shows running containers. docker ps -a shows all including stopped.',
      'docker exec -it container bash — get a shell inside a running container.',
      'docker logs container -f — follow live logs. Your primary debugging tool.',
      'docker stop for graceful shutdown. docker kill for force stop.',
      'docker system prune cleans up stopped containers, dangling images, unused networks.',
    ],
    prevLesson: 'docker-fundamentals',
    nextLesson: 'dockerfiles',
  },

  // ─── LESSON 8 ─────────────────────────────────────────────────────────────
  {
    id: 'dockerfiles',
    slug: 'dockerfiles',
    title: 'Docker Images & Dockerfiles',
    description: 'How to write production-ready Dockerfiles — FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, CMD, ENTRYPOINT — with multi-stage builds and real project examples.',
    category: 'Docker',
    order: 8,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## What is a Dockerfile?

A Dockerfile is a text file of instructions that tells Docker how to build your image step by step. Each instruction creates a layer. The result is a portable, reproducible image.

**Analogy:** A Dockerfile is a recipe. The image is the prepared dish. The container is the dish being eaten.

---

## Dockerfile Instructions — Each Explained

### FROM — Base image

Every Dockerfile starts with FROM. It specifies the base image you build on top of.

\`\`\`dockerfile
FROM node:20-alpine
# node = Node.js runtime
# 20 = Node.js version 20 (LTS)
# alpine = tiny Linux (5MB vs 900MB for ubuntu-based)
\`\`\`

**Image variants for Node.js:**
| Tag | Size | Use when |
|-----|------|----------|
| \`node:20\` | ~350MB | You need full Debian tools |
| \`node:20-slim\` | ~80MB | Good balance |
| \`node:20-alpine\` | ~45MB | Production (most common) |

Always pin a version (\`node:20-alpine\`, not \`node:alpine\`). Unpinned tags can change and break builds.

---

### WORKDIR — Set working directory

\`\`\`dockerfile
WORKDIR /app
# Creates /app directory (if not exists) and sets it as the working directory
# All subsequent COPY, RUN, CMD instructions execute from /app
# Best practice: always set WORKDIR — don't work in /
\`\`\`

---

### COPY — Copy files into the image

\`\`\`dockerfile
COPY source destination

COPY . .                  # copy everything from host to WORKDIR
COPY package*.json .      # copy package.json and package-lock.json
COPY src/ ./src/          # copy src folder
COPY --chown=node:node . . # copy and set ownership to node user
\`\`\`

**Important:** create a \`.dockerignore\` file to exclude:
\`\`\`
# .dockerignore
node_modules      # huge, rebuilt inside container
.git              # version control metadata
.env              # secrets!
.next             # build output (rebuilt inside container)
*.log
\`\`\`

---

### RUN — Execute commands during build

\`\`\`dockerfile
# Install dependencies
RUN npm ci                              # cleaner than npm install for CI

# System packages (Alpine uses apk)
RUN apk add --no-cache curl wget

# Combine multiple commands with && to reduce layers
RUN apk add --no-cache curl \\
    && npm ci \\
    && npm cache clean --force
\`\`\`

**RUN at build time. CMD at container runtime.** RUN builds the image; CMD runs the app.

---

### ENV — Environment variables

\`\`\`dockerfile
ENV NODE_ENV=production
ENV PORT=3000

# Reference in other instructions:
EXPOSE $PORT

# Override at runtime:
docker run -e NODE_ENV=staging myapp
\`\`\`

---

### EXPOSE — Document which port the container listens on

\`\`\`dockerfile
EXPOSE 3000
# This is documentation only — it does NOT actually publish the port.
# You still need -p 3000:3000 in docker run.
# But it signals to other developers which port the app uses.
\`\`\`

---

### CMD — Default command to run the container

\`\`\`dockerfile
CMD ["node", "server.js"]       # exec form (preferred)
CMD node server.js              # shell form (runs in /bin/sh -c)
CMD ["npm", "start"]            # using npm start
\`\`\`

- **Use exec form** (JSON array): \`CMD ["node", "server.js"]\`
- Only ONE CMD per Dockerfile. The last one wins.
- CMD can be overridden at runtime: \`docker run myapp node other.js\`

---

### ENTRYPOINT — Fixed command that always runs

\`\`\`dockerfile
ENTRYPOINT ["node"]
CMD ["server.js"]
# Together: always runs node, default argument is server.js
# docker run myapp              → node server.js
# docker run myapp worker.js    → node worker.js (CMD overridden)
\`\`\`

**ENTRYPOINT vs CMD:**
| | CMD | ENTRYPOINT |
|-|-----|------------|
| Override | Easily overridden | Requires --entrypoint flag |
| Use case | Default command | Fixed executable |
| Common combo | Arguments | The program to run |

---

## Production Dockerfile — Node.js / Express

\`\`\`dockerfile
# Use Alpine for small image size
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and set non-root user
WORKDIR /app
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# Copy package files FIRST (for layer caching)
COPY --chown=nodeuser:nodegroup package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy source code AFTER installing deps (cache optimization)
COPY --chown=nodeuser:nodegroup . .

# Switch to non-root user
USER nodeuser

# Document the port
EXPOSE 3000

# Use dumb-init to properly handle signals (Ctrl+C, docker stop)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
\`\`\`

---

## Multi-Stage Builds — Smaller Production Images

Multi-stage builds use multiple FROM instructions. Each stage can use a different base image. Only the final stage ends up in the output image — intermediate stages are discarded.

\`\`\`dockerfile
# Stage 1: Build (includes dev tools)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                        # install ALL deps (including devDeps)
COPY . .
RUN npm run build                 # compile TypeScript → dist/

# Stage 2: Production (minimal image, no dev tools)
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production      # only production deps
COPY --from=builder /app/dist ./dist   # copy ONLY the compiled output
EXPOSE 3000
CMD ["node", "dist/server.js"]

# Result:
# Stage 1 (builder): ~350MB — not shipped
# Stage 2 (production): ~90MB — what gets deployed
\`\`\`

---

## Dockerfile for Next.js (Official Best Practice)

\`\`\`dockerfile
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\``,
    codeExamples: [
      {
        title: 'Complete .dockerignore file',
        code: `# .dockerignore — exclude these from docker build context

# Never include these:
.env                    # secrets!
.env.local
.env.production.local
*.pem                   # private keys

# Build outputs (will be rebuilt inside container)
node_modules
.next
dist
build
out

# Version control
.git
.gitignore

# Documentation
README.md
CHANGELOG.md
docs/

# Editor files
.idea
.vscode
*.swp

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Test files
__tests__
*.test.ts
*.spec.ts
coverage/`,
        explanation: 'A proper .dockerignore prevents secrets, huge node_modules, and unnecessary files from being sent to the Docker build context. This makes builds faster and images smaller.',
      },
      {
        title: 'Layer caching — slow vs fast Dockerfile',
        code: `# SLOW Dockerfile (common beginner mistake):
FROM node:20-alpine
WORKDIR /app
COPY . .           # copies EVERYTHING including source code
RUN npm install    # npm install runs even if only app.js changed!
CMD ["node", "app.js"]

# Problem: every time you change app.js, Docker re-runs npm install
# npm install = 30-60 seconds wasted on every build


# FAST Dockerfile (correct layer caching):
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./   # ONLY package files first
RUN npm ci              # npm ci runs ONLY if package files changed
COPY . .                # source code copied AFTER deps installed
CMD ["node", "app.js"]

# Now:
# Change app.js       → only COPY . . layer rebuilds (1 second)
# Change package.json → npm ci + COPY rebuilds (30 seconds)
# Unchanged           → all layers cached (instant)

# Rule: put what changes LEAST at the top,
#        what changes MOST at the bottom.`,
        explanation: 'Layer caching is the single biggest Dockerfile optimization. The right order can turn 60-second builds into 2-second builds.',
      },
    ],
    commonMistakes: [
      'Copying node_modules into the image instead of running npm install inside — add node_modules to .dockerignore.',
      'Not using .dockerignore — the entire project directory including .git, node_modules, .env gets sent to Docker.',
      'Putting COPY . . before npm install — breaks layer caching, npm install runs on every code change.',
      'Running as root inside the container — creates a security risk. Add a non-root user.',
      'Using CMD in shell form (CMD node server.js) — shell form doesn\'t pass signals correctly, so docker stop doesn\'t work gracefully.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between CMD and ENTRYPOINT in a Dockerfile?',
        answer: 'CMD sets the default command to run, and can be completely overridden when running docker run. ENTRYPOINT sets a fixed executable that always runs, with CMD acting as default arguments. Combined: ENTRYPOINT ["node"] + CMD ["server.js"] means the container always runs node, but the file can be changed at runtime. ENTRYPOINT is for when the container has a fixed purpose; CMD is for defaults that users might override.',
        difficulty: 'intermediate',
      },
      {
        question: 'What are multi-stage builds and why should you use them?',
        answer: 'Multi-stage builds use multiple FROM instructions in one Dockerfile. Build stages can have all development tools, compilers, and test runners. The final stage copies only the compiled output from build stages — discarding dev tools, test files, and intermediate files. Result: much smaller production images (e.g., 350MB build stage → 90MB production stage). Smaller images have smaller attack surface, pull faster, and start faster.',
        difficulty: 'intermediate',
      },
      {
        question: 'Why do you copy package.json before copying the rest of the source code?',
        answer: 'Docker layer caching. Each Dockerfile instruction is a layer. If a layer\'s inputs haven\'t changed, Docker reuses the cached layer. By copying only package.json first and running npm install before copying source code, the npm install layer is only invalidated when dependencies change. Changing application code only rebuilds the layers after COPY . ., which is fast. Otherwise, npm install runs on every code change — wasting 30–60 seconds per build.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-8-1',
        title: 'Write a production Dockerfile for a Node.js API',
        description: 'Write a multi-stage Dockerfile for an Express API that uses TypeScript. The build stage compiles TS, the production stage runs only the compiled JS.',
        starterCode: `# Project structure:
# package.json
# tsconfig.json
# src/
#   server.ts    (entry point)
# dist/           (compiled output — TypeScript compiles here)

# Write a multi-stage Dockerfile:
# Stage 1 (builder): install all deps, compile TypeScript to dist/
# Stage 2 (production): only production deps + compiled dist/
# - Use node:20-alpine
# - Run as non-root user
# - Expose port 3000

FROM node:20-alpine AS builder
# ... your code here

FROM node:20-alpine AS production
# ... your code here`,
        solution: `FROM node:20-alpine AS builder
WORKDIR /app
# Copy package files and install ALL dependencies (including TypeScript)
COPY package*.json ./
RUN npm ci
# Copy source code and compile TypeScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build
# Result: dist/ folder with compiled JavaScript

FROM node:20-alpine AS production
WORKDIR /app
# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Copy and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist
# Set ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        hints: [
          'Stage 1 needs devDependencies (TypeScript). Stage 2 only needs production deps.',
          'Use COPY --from=builder to copy dist/ from the build stage',
          'Always create a non-root user and switch with USER',
        ],
      },
    ],
    keyTakeaways: [
      'FROM → WORKDIR → COPY package.json → RUN npm install → COPY . . → CMD is the correct order.',
      'Layer caching: put frequently-changing layers (source code) at the bottom.',
      'Always create a .dockerignore to exclude node_modules, .env, .git.',
      'Multi-stage builds: compile in a fat image, ship only the output in a slim image.',
      'Use exec form CMD ["node", "app.js"] not shell form CMD node app.js for proper signal handling.',
      'Never run as root inside containers. Create and use a non-root user.',
    ],
    prevLesson: 'docker-commands',
    nextLesson: 'docker-compose',
  },

  // ─── LESSON 9 ─────────────────────────────────────────────────────────────
  {
    id: 'docker-compose',
    slug: 'docker-compose',
    title: 'Docker Compose',
    description: 'Define and run multi-container apps — Next.js + PostgreSQL, Node.js + MongoDB — with services, volumes, networks, and environment variables.',
    category: 'Docker',
    order: 9,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## Why Docker Compose Exists

Running a real app means running multiple containers:
- Your Node.js API
- PostgreSQL database
- Redis cache
- Maybe a worker process

Without Docker Compose, you'd start each container manually with long docker run commands, manually create networks, manually manage volumes. Painful.

**Docker Compose solves this:** define your entire multi-container application in a single YAML file, then start everything with one command:

\`\`\`bash
docker compose up -d      # start all services
docker compose down       # stop and remove all services
\`\`\`

---

## docker-compose.yml Structure

\`\`\`yaml
version: '3.8'          # Compose file version

services:               # define your containers here
  web:                  # service name (you choose)
    image: nginx        # image to use
    ports:
      - "80:80"

  api:
    build: ./api        # build from Dockerfile in ./api
    environment:
      - NODE_ENV=production
    depends_on:
      - database

  database:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:                # named volumes (persist data)
  pgdata:

networks:               # custom networks (optional — Compose creates one by default)
  mynetwork:
\`\`\`

---

## Core Concepts

### Services

Each service becomes a container. Services on the same Compose network can talk to each other using the **service name as the hostname**.

\`\`\`yaml
services:
  api:
    image: myapi
    environment:
      DB_HOST: database    # "database" is the service name below!
      DB_PORT: 5432

  database:
    image: postgres:16
    # Container hostname inside the network = "database"
\`\`\`

Your Node.js app connects to: \`postgresql://postgres:secret@database:5432/mydb\`

### Volumes

Volumes persist data outside containers. When a container is recreated, data survives.

\`\`\`yaml
services:
  database:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data  # named volume
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # bind mount

volumes:
  pgdata:    # declare the named volume here
\`\`\`

- **Named volume** (\`pgdata:/var/lib/...\`) — Docker manages storage. Data persists across \`docker compose down/up\`.
- **Bind mount** (\`./local:/container/path\`) — links a host directory to the container. Changes on host appear instantly inside.

### Networks

Compose automatically creates a default network. All services are on it. For isolation:

\`\`\`yaml
services:
  api:
    networks:
      - frontend
      - backend
  database:
    networks:
      - backend   # only api can reach database, not nginx

networks:
  frontend:
  backend:
\`\`\`

### Environment Variables

\`\`\`yaml
services:
  api:
    environment:
      NODE_ENV: production       # direct value
      PORT: 3000
      DB_PASSWORD: \${DB_PASSWORD}  # from host env variable

    env_file:
      - .env                     # load from .env file
\`\`\`

---

## Project: Node.js + PostgreSQL

\`\`\`yaml
# docker-compose.yml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:secret@database:5432/myapp
      NODE_ENV: production
    depends_on:
      database:
        condition: service_healthy   # wait for DB to be ready
    restart: unless-stopped

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"               # expose for local tools (DBeaver, pgAdmin)
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d  # run SQL on first start
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
\`\`\`

---

## Project: Next.js + PostgreSQL + Redis

\`\`\`yaml
# docker-compose.yml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    command: redis-server --appendonly yes  # enable persistence

volumes:
  pgdata:
  redisdata:
\`\`\`

---

## Essential Compose Commands

\`\`\`bash
# Start all services (build if needed)
docker compose up

# Start in background
docker compose up -d

# Start and force rebuild
docker compose up -d --build

# Stop services (containers kept)
docker compose stop

# Stop and remove containers (data in named volumes survives)
docker compose down

# Stop and remove containers AND volumes (deletes all data!)
docker compose down -v

# View logs for all services
docker compose logs -f

# View logs for one service
docker compose logs -f api

# See running services
docker compose ps

# Execute command in a running service
docker compose exec api bash
docker compose exec database psql -U postgres

# Scale a service (run 3 instances)
docker compose up -d --scale api=3

# Rebuild one service
docker compose build api
docker compose up -d api
\`\`\`

---

## Development vs Production Compose

Use multiple Compose files:
\`\`\`bash
# docker-compose.yml          — base config (shared)
# docker-compose.dev.yml      — development overrides
# docker-compose.prod.yml     — production overrides

# Run dev environment
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Run production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
\`\`\`

**docker-compose.dev.yml** might add:
- Volume mounts for hot reload (\`./src:/app/src\`)
- Expose database ports for local tools
- Set DEBUG environment variables`,
    codeExamples: [
      {
        title: 'Complete development environment with hot reload',
        code: `# docker-compose.dev.yml — for local development

services:
  api:
    build:
      context: .
      target: development       # build the dev stage if using multi-stage
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src          # mount source code for hot reload
      - /app/node_modules       # anonymous volume: don't overwrite container's node_modules
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:dev@db:5432/myapp_dev
    command: npm run dev        # override CMD to use nodemon/ts-node-dev
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: myapp_dev
    ports:
      - "5432:5432"             # expose so you can connect with DBeaver/TablePlus
    volumes:
      - pgdata_dev:/var/lib/postgresql/data

volumes:
  pgdata_dev:

# Run with: docker compose -f docker-compose.dev.yml up
# Edit code on your machine → nodemon inside container auto-restarts`,
        explanation: 'The bind mount (./src:/app/src) syncs your local files into the container in real-time. Nodemon inside the container watches for changes and restarts — full hot reload without rebuilding the image.',
      },
    ],
    commonMistakes: [
      'Using docker-compose (V1) instead of docker compose (V2) — V2 is built into Docker Desktop and the modern CLI.',
      'Not using volumes for database data — when you run docker compose down, all data is lost without a named volume.',
      'Hardcoding passwords in docker-compose.yml committed to git — use env_file: .env and add .env to .gitignore.',
      'Connecting to "localhost" inside the container instead of the service name — containers must use service names as hostnames.',
      'Not using depends_on with health checks — your API might start before the database is ready to accept connections.',
    ],
    interviewQuestions: [
      {
        question: 'What is Docker Compose and when would you use it?',
        answer: 'Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file. You define all services, networks, and volumes in docker-compose.yml and start everything with docker compose up. Use it for local development environments (app + database + cache running together) and for simple production deployments. It replaces many long docker run commands with a single, version-controlled configuration file.',
        difficulty: 'beginner',
      },
      {
        question: 'How do containers in the same docker-compose.yml communicate with each other?',
        answer: 'Compose automatically creates a default bridge network and connects all services to it. Each service is reachable by its service name as a hostname. For example, if you have a service named "database" running PostgreSQL, your API connects with the URL: postgresql://postgres:password@database:5432/mydb — using "database" as the host, not localhost or an IP. This works because Compose sets up DNS resolution within the network.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between a named volume and a bind mount in Docker?',
        answer: 'A named volume (pgdata:/var/lib/postgresql/data) is managed by Docker — it persists between container restarts and survives docker compose down. Good for database data. A bind mount (./src:/app/src) directly maps a host directory into the container — changes on the host are immediately visible inside the container. Good for development hot reload. Never use bind mounts for database storage in production.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-9-1',
        title: 'Write a docker-compose.yml for a full-stack app',
        description: 'Write a docker-compose.yml for a full-stack application with a Next.js frontend, an Express API, and a MongoDB database.',
        starterCode: `# Requirements:
# 1. Service "web": Next.js app, port 3000, needs MONGODB_URI env var
# 2. Service "api": Express app built from ./api/Dockerfile, port 4000
#    needs MONGODB_URI env var, depends on mongodb being healthy
# 3. Service "mongodb": MongoDB 7, port 27017, root user=admin pass=secret
#    data persisted in a named volume
# 4. API URL for Next.js: http://api:4000
# 5. MongoDB URL: mongodb://admin:secret@mongodb:27017

# Write the docker-compose.yml:`,
        solution: `services:
  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      API_URL: http://api:4000
      MONGODB_URI: mongodb://admin:secret@mongodb:27017
    depends_on:
      - api
    restart: unless-stopped

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      MONGODB_URI: mongodb://admin:secret@mongodb:27017/myapp
      NODE_ENV: production
    depends_on:
      mongodb:
        condition: service_healthy
    restart: unless-stopped

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    volumes:
      - mongodata:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  mongodata:`,
        hints: [
          'Services use their name as hostname — api service is reachable at "api"',
          'Use healthcheck + condition: service_healthy to wait for MongoDB',
          'Named volumes persist data across docker compose down/up',
        ],
      },
    ],
    keyTakeaways: [
      'Docker Compose defines multi-container apps in a single YAML file.',
      'Services communicate using service names as hostnames — not localhost.',
      'docker compose up -d starts everything. docker compose down stops it.',
      'Named volumes persist data. Bind mounts sync host files into containers for dev.',
      'Use depends_on with healthcheck to wait for services to be ready.',
      'Never commit passwords to docker-compose.yml — use env_file: .env.',
    ],
    prevLesson: 'dockerfiles',
    nextLesson: 'github-actions',
  },

  // ─── LESSON 10 ────────────────────────────────────────────────────────────
  {
    id: 'github-actions',
    slug: 'github-actions',
    title: 'GitHub Actions',
    description: 'Automate everything with GitHub Actions — workflows, jobs, steps, triggers, runners, secrets, and YAML syntax explained line by line.',
    category: 'CI/CD',
    order: 10,
    difficulty: 'intermediate',
    estimatedTime: 45,
    content: `## What is GitHub Actions?

GitHub Actions is GitHub's built-in automation platform. It lets you run scripts automatically in response to events in your repository — a push, a pull request, a scheduled time, or a manual trigger.

**What you can automate:**
- Run tests on every push
- Deploy to production when a PR merges
- Publish npm packages when a new version is tagged
- Send a Slack notification when a build fails
- Lint code before every PR can merge
- Rebuild Docker images and push to a registry

**Why developers love it:**
- Built into GitHub — no separate account or service
- Free for public repositories
- 2000 free minutes/month for private repos
- Huge marketplace of pre-built actions
- Version-controlled alongside your code

---

## Core Concepts

### Workflow
A YAML file in \`.github/workflows/\`. Each workflow is an automation script. One repo can have many workflows.

### Event (Trigger)
What causes the workflow to run: a push, pull request, schedule, manual trigger, etc.

### Job
A group of steps that run on the same runner (virtual machine). Jobs can run in parallel or sequentially.

### Step
A single task within a job. Either a shell command or a pre-built action.

### Runner
The virtual machine where the job runs. GitHub provides Ubuntu, Windows, and macOS runners.

### Action
A reusable step from the GitHub Marketplace. \`actions/checkout\`, \`actions/setup-node\`, etc.

### Secret
Encrypted values stored in your repo settings. Access as \`\${{ secrets.MY_SECRET }}\`. Never visible in logs.

---

## YAML Syntax — Line by Line

\`\`\`yaml
# .github/workflows/ci.yml

name: CI                          # display name in GitHub UI (required)

on:                               # WHEN does this workflow run?
  push:                           # trigger: on every push
    branches: [main, develop]     # only these branches
  pull_request:                   # also trigger on PRs
    branches: [main]
  schedule:
    - cron: '0 8 * * 1'          # every Monday at 8am UTC
  workflow_dispatch:              # allow manual trigger via GitHub UI

jobs:                             # WHAT to do — list of jobs
  build:                          # job name (you choose)
    runs-on: ubuntu-latest        # which runner to use
    timeout-minutes: 15           # cancel if takes longer

    strategy:
      matrix:                     # run this job for each combination
        node-version: [18, 20]    # test on Node 18 AND Node 20

    steps:                        # list of steps in this job
      - name: Checkout code       # human-readable name (optional but helpful)
        uses: actions/checkout@v4 # pre-built action from Marketplace

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:                     # parameters for the action
          node-version: \${{ matrix.node-version }}
          cache: 'npm'            # cache node_modules automatically

      - name: Install dependencies
        run: npm ci               # shell command

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        env:                      # environment variables for this step
          NODE_ENV: test

      - name: Upload coverage     # upload test coverage report
        uses: codecov/codecov-action@v3
        if: matrix.node-version == '20'  # only on Node 20
\`\`\`

---

## Triggers (on:) — When to Run

\`\`\`yaml
on:
  # Run on push to specific branches
  push:
    branches: [main, 'release/**']
    paths:                        # only if these files changed
      - 'src/**'
      - 'package.json'

  # Run on pull requests
  pull_request:
    types: [opened, synchronize, reopened]  # default
    branches: [main]

  # Run on schedule (cron)
  schedule:
    - cron: '0 0 * * *'          # daily at midnight UTC

  # Allow manual trigger from GitHub UI
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy to'
        required: true
        default: 'staging'

  # Trigger from another workflow
  workflow_call:

  # Run when a GitHub release is published
  release:
    types: [published]
\`\`\`

---

## Secrets and Environment Variables

**Secrets** are encrypted and never shown in logs. Store them in:
- Repo Settings → Secrets and variables → Actions

\`\`\`yaml
steps:
  - name: Deploy
    run: |
      echo "Deploying to \${{ vars.DEPLOY_ENV }}"   # variable (non-secret)
    env:
      DATABASE_URL: \${{ secrets.DATABASE_URL }}     # secret
      API_KEY: \${{ secrets.API_KEY }}               # secret
      # Never: echo \${{ secrets.API_KEY }} — still masked, but bad practice
\`\`\`

**GitHub provides built-in variables:**
\`\`\`yaml
\${{ github.sha }}           # full commit SHA (e.g., abc1234...)
\${{ github.ref }}           # branch/tag ref (refs/heads/main)
\${{ github.event_name }}    # which event triggered this (push, pull_request)
\${{ github.actor }}         # who triggered the workflow
\${{ github.repository }}    # owner/repo-name
\`\`\`

---

## Job Dependencies

\`\`\`yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]

  build:
    runs-on: ubuntu-latest
    needs: test                   # only runs if test passes
    steps: [...]

  deploy:
    runs-on: ubuntu-latest
    needs: [test, build]          # needs both to pass
    if: github.ref == 'refs/heads/main'  # only on main branch
    steps: [...]
\`\`\`

---

## Caching Dependencies

Cache node_modules to speed up workflows by 2–3 minutes:

\`\`\`yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'                  # automatically caches ~/.npm

# Or manually:
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: \${{ runner.os }}-npm-
\`\`\`

---

## Environments and Deployment Protection

\`\`\`yaml
jobs:
  deploy-production:
    environment: production       # references a GitHub Environment
    # GitHub Environments can require:
    # - Manual approval (reviewer must click "approve")
    # - Wait timer (delay 10 minutes after staging deploy)
    # - Branch restrictions (only deploy from main)
    steps:
      - name: Deploy
        run: ./deploy.sh
\`\`\`

Set up in: Repo Settings → Environments → production → Add required reviewers`,
    codeExamples: [
      {
        title: 'Complete CI/CD workflow — test, build Docker, push, deploy',
        code: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  # Job 1: Run tests
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  # Job 2: Build and push Docker image
  docker:
    needs: test                           # only if tests pass
    runs-on: ubuntu-latest
    outputs:
      image-tag: \${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        id: meta
        with:
          context: .
          push: true
          tags: |
            myuser/myapp:latest
            myuser/myapp:\${{ github.sha }}

  # Job 3: Deploy to production
  deploy:
    needs: docker
    runs-on: ubuntu-latest
    environment: production       # requires manual approval!
    steps:
      - name: Deploy to server via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: ubuntu
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull myuser/myapp:\${{ github.sha }}
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp \\
              -p 3000:3000 \\
              -e DATABASE_URL=\${{ secrets.DATABASE_URL }} \\
              myuser/myapp:\${{ github.sha }}`,
        explanation: 'This three-job pipeline: test → build Docker image → deploy. Each job needs the previous one to pass. The deploy job requires manual approval via GitHub Environments.',
      },
    ],
    commonMistakes: [
      'Hardcoding secrets in workflow files — always use ${{ secrets.SECRET_NAME }}.',
      'Not pinning action versions — use actions/checkout@v4 not actions/checkout@latest to avoid unexpected breaking changes.',
      'Running all steps in one job — split into test/build/deploy jobs so you can see which stage failed.',
      'Not caching npm dependencies — adds 2-3 minutes to every workflow run unnecessarily.',
      'Triggering deploy on every push to any branch instead of only main.',
    ],
    interviewQuestions: [
      {
        question: 'What are the main components of a GitHub Actions workflow?',
        answer: 'A workflow has: a trigger (on: push, pull_request, schedule, workflow_dispatch) that determines when it runs; jobs (groups of steps that run on the same runner); steps (individual tasks — either shell commands with run: or reusable actions with uses:); runners (virtual machines — ubuntu-latest, windows-latest, macos-latest); secrets (encrypted values from repo settings); and environment variables. Workflows live in .github/workflows/ as YAML files.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you pass secrets to GitHub Actions without exposing them?',
        answer: 'Store secrets in repo Settings → Secrets and variables → Actions. Access them in workflows with ${{ secrets.SECRET_NAME }}. GitHub automatically masks these values in logs — if a secret accidentally appears in output, it is replaced with ***. Never echo secrets or store them in env files committed to the repo. For deployment secrets (SSH keys, API tokens), use GitHub Environments which can require approval before secrets are accessible.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-10-1',
        title: 'Write a GitHub Actions workflow for a Node.js project',
        description: 'Write a workflow that runs on every PR to main: checks out code, sets up Node 20, installs deps, runs lint and tests, and only allows merging if all steps pass.',
        starterCode: `# .github/workflows/pr-check.yml
# Requirements:
# - Trigger: pull_request targeting main branch
# - Runner: ubuntu-latest
# - Steps: checkout, setup node 20, npm ci, npm run lint, npm test
# - Cache npm dependencies for speed

name: PR Check

on:
  # your trigger here

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      # your steps here`,
        solution: `name: PR Check

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'             # automatically caches ~/.npm

      - name: Install dependencies
        run: npm ci                # faster and safer than npm install

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test`,
        hints: [
          'pull_request trigger with branches: [main] runs on PRs targeting main',
          'cache: npm in setup-node automatically caches dependencies',
          'npm ci is preferred over npm install in CI environments',
        ],
      },
    ],
    keyTakeaways: [
      'GitHub Actions automates tasks triggered by repo events: push, PR, schedule, manual.',
      'Workflow → Jobs → Steps. Jobs can run in parallel or sequentially with needs:.',
      'Secrets are stored encrypted in repo settings. Access with ${{ secrets.NAME }}.',
      'Built-in variables: ${{ github.sha }}, ${{ github.ref }}, ${{ github.actor }}.',
      'Cache npm deps with actions/setup-node cache: npm to save 2–3 minutes per run.',
      'Use GitHub Environments for production deployments with manual approval.',
    ],
    prevLesson: 'docker-compose',
    nextLesson: 'building-ci-pipelines',
  },

  // ─── LESSON 11 ────────────────────────────────────────────────────────────
  {
    id: 'building-ci-pipelines',
    slug: 'building-ci-pipelines',
    title: 'Building CI Pipelines',
    description: 'Real CI pipelines for Node.js, React, Next.js, and Go — lint, test, build, Docker — with working GitHub Actions YAML you can copy and use.',
    category: 'CI/CD',
    order: 11,
    difficulty: 'intermediate',
    estimatedTime: 35,
    content: `## What Makes a Good CI Pipeline?

A CI pipeline should be:
- **Fast** — under 5 minutes for most projects (developers won't wait longer)
- **Reliable** — consistent results, no flakiness
- **Complete** — catches all real issues before they reach main
- **Informative** — clear failure messages so developers know exactly what to fix

**The right checks to run:**
1. Dependencies install correctly
2. Code passes lint rules
3. TypeScript has no type errors
4. All tests pass
5. Project builds successfully

If any step fails → block the merge.

---

## Node.js / Express CI Pipeline

\`\`\`yaml
# .github/workflows/ci.yml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    services:
      # Spin up a PostgreSQL container for integration tests
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/testdb
          NODE_ENV: test

      - name: Build
        run: npm run build
\`\`\`

---

## React / Vite CI Pipeline

\`\`\`yaml
name: React CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Lint (ESLint)
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Unit tests (Vitest)
        run: npm test -- --run     # --run = non-interactive mode for CI

      - name: Build
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7       # keep artifact for 7 days
\`\`\`

---

## Next.js CI Pipeline

\`\`\`yaml
name: Next.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Lint
        run: npm run lint         # next lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
        env:
          # Next.js needs NEXT_PUBLIC_ vars at build time
          NEXT_PUBLIC_API_URL: https://api.example.com
          # Database and secret vars NOT needed at build time for SSG pages

      - name: Check bundle size
        uses: preactjs/compressed-size-action@v2
        with:
          repo-token: \${{ secrets.GITHUB_TOKEN }}
\`\`\`

---

## Go CI Pipeline

\`\`\`yaml
name: Go CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
          cache: true              # caches Go module cache

      - name: Download dependencies
        run: go mod download

      - name: Vet (static analysis)
        run: go vet ./...

      - name: Test
        run: go test ./... -v -race -coverprofile=coverage.out

      - name: Build
        run: go build -o ./bin/server ./cmd/server

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: coverage.out
\`\`\`

---

## Matrix Strategy — Test on Multiple Versions

\`\`\`yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, macos-latest]  # test on multiple OSes

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
      - run: npm ci && npm test

# This creates 6 jobs: 3 node versions × 2 operating systems
# All run in parallel
\`\`\`

---

## Branch Protection Rules

After setting up CI, enforce it:

1. Go to repo Settings → Branches → Add branch protection rule
2. Branch name pattern: \`main\`
3. Enable: **Require status checks to pass before merging**
4. Select your CI workflow check
5. Enable: **Require branches to be up to date before merging**

Now: no code can be merged to main unless CI passes. ✅`,
    codeExamples: [
      {
        title: 'CI with test database using services',
        code: `# services: spins up containers alongside your job.
# They are available on localhost for the job's steps.

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      # PostgreSQL available at localhost:5432
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U test"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5

      # Redis available at localhost:6379
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 5s

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Run integration tests
        run: npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379
          # Note: inside the job, services are at localhost
          # (not at the service name like in docker-compose)`,
        explanation: 'The services: key spins up real databases for your tests. Health checks ensure they are ready before your tests run. This is how you test against a real database in CI.',
      },
    ],
    commonMistakes: [
      'Using npm install instead of npm ci in CI — npm ci is faster, deterministic, and respects package-lock.json.',
      'Not setting --run flag for Vitest in CI — Vitest runs in watch mode by default, hanging the CI job forever.',
      'Running E2E tests in the same CI job as unit tests — E2E tests are slow (minutes). Run them separately or on a schedule.',
      'Not uploading test artifacts on failure — when tests fail, you want to see the screenshots/videos.',
      'Forgetting to set NODE_ENV=test — some code behaves differently in test mode.',
    ],
    interviewQuestions: [
      {
        question: 'How do you run database integration tests in GitHub Actions?',
        answer: 'Use the services: key to spin up a database container alongside your job. GitHub Actions starts the container, runs the health check until the DB is ready, and makes it available on localhost at the mapped port. Set the DATABASE_URL environment variable to point to localhost. This gives you a real database for integration tests without any external dependencies.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the matrix strategy in GitHub Actions and when would you use it?',
        answer: 'Matrix strategy runs the same job multiple times with different values (Node.js versions, OSes, database versions). It creates N×M parallel jobs for all combinations. Use it when you need to ensure compatibility across multiple versions (a library supporting Node 18, 20, and 22) or across platforms. All matrix jobs run in parallel, so total time is the same as one job — not N times longer.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-11-1',
        title: 'Add a CI pipeline to an existing project',
        description: 'Write a complete GitHub Actions CI workflow for a TypeScript Express API that connects to PostgreSQL. Include: lint, type check, tests (with a test database), and build.',
        starterCode: `# .github/workflows/ci.yml
# Project: TypeScript Express API
# Scripts in package.json:
#   "lint": "eslint src/"
#   "type-check": "tsc --noEmit"
#   "test": "jest"
#   "build": "tsc"
# Tests need: DATABASE_URL environment variable

name: CI

on:
  # your triggers

jobs:
  ci:
    runs-on: ubuntu-latest

    services:
      # add postgres here

    steps:
      # add steps here`,
        solution: `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Test
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/testdb
          NODE_ENV: test

      - name: Build
        run: npm run build`,
        hints: [
          'Services are available at localhost, not at the service name',
          'Health checks ensure Postgres is ready before tests run',
          'npm ci is always preferred over npm install in CI',
        ],
      },
    ],
    keyTakeaways: [
      'A good CI pipeline: install → lint → type-check → test → build.',
      'Use services: to spin up databases for integration tests inside CI.',
      'npm ci is faster and more reliable than npm install in CI environments.',
      'Matrix strategy tests across multiple Node.js versions or OSes in parallel.',
      'Enable branch protection rules to require CI to pass before merging.',
      'Upload test artifacts on failure so you can see what went wrong.',
    ],
    prevLesson: 'github-actions',
    nextLesson: 'building-cd-pipelines',
  },

  // ─── LESSON 12 ────────────────────────────────────────────────────────────
  {
    id: 'building-cd-pipelines',
    slug: 'building-cd-pipelines',
    title: 'Building CD Pipelines',
    description: 'Automated deployment with GitHub Actions — deploy to Vercel, Railway, Render, and a VPS. Staging environments, production approvals, and rollback strategies.',
    category: 'CI/CD',
    order: 12,
    difficulty: 'intermediate',
    estimatedTime: 40,
    content: `## What CD Pipelines Do

After CI verifies your code is correct, CD (Continuous Delivery/Deployment) automatically ships it to servers where users can access it.

**CD pipeline responsibilities:**
1. Build the deployment artifact (Docker image, static build)
2. Push to a registry or storage
3. Deploy to staging automatically
4. Run smoke tests on staging
5. Deploy to production (manual or automatic)
6. Verify production is healthy

---

## Deploy to Vercel (Frontend/Next.js)

Vercel has a GitHub integration that handles CD automatically — but you can also trigger it from GitHub Actions for more control.

**Option 1: Automatic (GitHub → Vercel integration)**
Connect repo on vercel.com → Vercel auto-deploys on every push to main. Zero config.

**Option 2: Controlled via GitHub Actions**
\`\`\`yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'     # deploy to production
\`\`\`

---

## Deploy to Railway (Node.js / Full Stack)

Railway auto-deploys from GitHub on push. For fine-grained control via CLI:

\`\`\`yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy
        run: railway up --service \${{ vars.RAILWAY_SERVICE }}
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}
\`\`\`

---

## Deploy to Render (Node.js / Docker)

Render has a Deploy Hook URL — send a POST request to trigger a deploy:

\`\`\`yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]  # run tests first

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST "\${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
\`\`\`

---

## Deploy to VPS with Docker (Production Pattern)

The most common real-world CD pipeline for backend apps:

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  # Step 1: Test
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci && npm test

  # Step 2: Build and push Docker image
  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image: \${{ steps.build.outputs.imageid }}
    steps:
      - uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}   # auto-provided

      - name: Build and push
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            ghcr.io/\${{ github.repository }}:latest

  # Step 3: Deploy to staging automatically
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: SSH deploy to staging
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.STAGING_HOST }}
          username: ubuntu
          key: \${{ secrets.SSH_KEY }}
          script: |
            docker pull ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            docker compose -f /app/docker-compose.yml up -d --no-deps app
            sleep 5
            curl -f http://localhost:3000/health || exit 1

  # Step 4: Deploy to production (requires manual approval)
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production        # requires reviewer approval in GitHub
    steps:
      - name: SSH deploy to production
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.PRODUCTION_HOST }}
          username: ubuntu
          key: \${{ secrets.SSH_KEY }}
          script: |
            docker pull ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            docker compose -f /app/docker-compose.yml up -d --no-deps app
            sleep 10
            curl -f http://localhost:3000/health || exit 1
\`\`\`

---

## Deployment Strategies

### Blue/Green Deployment
\`\`\`bash
# Run new version alongside old, then switch traffic
docker run -d --name app-green -p 3001:3000 myapp:new
# Test it works on port 3001
# Switch nginx to point to 3001
# Stop the old container
docker stop app-blue && docker rm app-blue
\`\`\`

### Rolling Update (Docker Compose)
\`\`\`bash
# Update one container at a time (zero downtime with load balancer)
docker compose up -d --no-deps --scale app=3 app
\`\`\`

### Rollback
\`\`\`bash
# If deploy breaks production, rollback in 30 seconds:
docker run -d --name app -p 3000:3000 myapp:v1.2.2
# The old image is still in the registry — just redeploy it
\`\`\`

---

## Environment Management

\`\`\`
development → staging → production

development:  local machine, docker compose up
staging:      same infrastructure as prod, auto-deployed on every merge
production:   real users, manual approval required
\`\`\`

**Rule:** Never test in production. Staging must mirror production exactly — same Docker image, same environment variables structure, same database type.`,
    codeExamples: [
      {
        title: 'Full staging → production pipeline with health checks',
        code: `# The deploy script on the server:
# /app/deploy.sh

#!/bin/bash
set -e   # exit immediately if any command fails

IMAGE="ghcr.io/mycompany/myapp:$1"  # $1 is the git SHA passed as argument

echo "Pulling image: $IMAGE"
docker pull $IMAGE

echo "Stopping old container..."
docker stop myapp 2>/dev/null || true
docker rm myapp 2>/dev/null || true

echo "Starting new container..."
docker run -d \\
  --name myapp \\
  --restart unless-stopped \\
  -p 3000:3000 \\
  --env-file /app/.env \\
  $IMAGE

echo "Waiting for app to start..."
sleep 5

echo "Health check..."
for i in {1..5}; do
  if curl -sf http://localhost:3000/health; then
    echo "Deploy successful!"
    exit 0
  fi
  echo "Attempt $i failed, retrying..."
  sleep 3
done

echo "Health check failed! Rolling back..."
docker stop myapp || true
docker rm myapp || true
docker run -d --name myapp --restart unless-stopped -p 3000:3000 \\
  --env-file /app/.env \\
  "ghcr.io/mycompany/myapp:$PREVIOUS_SHA"
exit 1`,
        explanation: 'This deploy script pulls the new image, starts it, checks the /health endpoint, and rolls back automatically if the health check fails. Always have an automatic rollback.',
      },
    ],
    commonMistakes: [
      'Deploying directly to production without a staging environment — always test in staging first.',
      'Not having a /health endpoint — you cannot automatically verify a deploy succeeded without one.',
      'Not building the Docker image in CI and reusing it in CD — rebuilding in CD means deploying untested code.',
      'Leaving old Docker images on the server — disk fills up over weeks. Prune old images after deploy.',
      'Not setting restart: unless-stopped — if the server reboots, your container won\'t come back.',
    ],
    interviewQuestions: [
      {
        question: 'What is a deployment environment and why should you have staging?',
        answer: 'A deployment environment is a separate infrastructure where your app runs. Production serves real users. Staging is a production-like environment for final testing before going live. Staging should use the same Docker image, same config structure, and same infrastructure as production — the only difference is scale and data. Testing in staging catches issues that only appear in the production-like environment before they affect users.',
        difficulty: 'intermediate',
      },
      {
        question: 'How do you handle database migrations in a CD pipeline?',
        answer: 'Run migrations before deploying the new application version, not after. This ensures backwards compatibility: the old app version works with the new schema. Migrations must be backwards-compatible — add columns as nullable, never rename in one step. In the deploy pipeline: pull new image → run migration (npx prisma migrate deploy) → start new app container. If migration fails, do not start the new container.',
        difficulty: 'advanced',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-12-1',
        title: 'Design a CD pipeline for a startup',
        description: 'Design the CD pipeline for a Node.js API that deploys to a VPS using Docker. Include staging, production, and a rollback strategy.',
        starterCode: `// Design the pipeline:
// 1. What triggers the CD pipeline?
// 2. What happens in the staging deploy step?
// 3. How do you verify staging is working before deploying to production?
// 4. How do you protect production from accidental deploys?
// 5. What happens if the production deploy fails?
// 6. How would you deploy a database migration?`,
        solution: `// 1. Trigger: when CI passes on main branch (needs: test-and-build)

// 2. Staging deploy:
//    - SSH into staging server
//    - docker pull ghcr.io/myapp:$GIT_SHA
//    - docker compose up -d --no-deps api
//    - Run: curl staging.myapp.com/health → must return 200

// 3. Verify staging:
//    - Automated smoke tests (curl key endpoints)
//    - Optional: Playwright E2E test against staging URL
//    - Slack notification: "Staging updated, please verify before approving"

// 4. Protect production:
//    - GitHub Environment "production" with required reviewers
//    - At least one team member must click "Approve" in GitHub
//    - Only allowed from main branch

// 5. If production deploy fails:
//    - Health check fails (curl /health returns non-200)
//    - Script runs: docker run ghcr.io/myapp:$PREVIOUS_SHA
//    - Alert sent to Slack: "Production deploy failed, rolled back to v1.2.2"

// 6. Database migration:
//    - Before starting new app: docker exec migration-runner npx prisma migrate deploy
//    - Migration runs against production DB first
//    - If migration fails: do NOT start new app container, revert pipeline
//    - If migration succeeds: start new app container`,
        hints: [
          'Migrations run before the new app version starts',
          'GitHub Environments enable manual approval gates',
          'Always have automatic rollback on health check failure',
        ],
      },
    ],
    keyTakeaways: [
      'CD pipeline: build image → push to registry → deploy to staging → test → deploy to production.',
      'Always deploy to staging first. Never test new deploys directly on production.',
      'Use GitHub Environments with required reviewers to protect production.',
      'Every deploy should end with a health check — automatic rollback if it fails.',
      'Build the Docker image once in CI, use the same image in staging and production.',
      'Rollback = redeploy the previous image tag. Keep old images in the registry for this.',
    ],
    prevLesson: 'building-ci-pipelines',
    nextLesson: 'cloud-fundamentals',
  },

  // ─── LESSON 13 ────────────────────────────────────────────────────────────
  {
    id: 'cloud-fundamentals',
    slug: 'cloud-fundamentals',
    title: 'Cloud Fundamentals',
    description: 'What cloud computing is, IaaS vs PaaS vs SaaS, regions, availability zones, compute, storage, and database services — from a developer\'s perspective.',
    category: 'Cloud',
    order: 13,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## What is Cloud Computing?

Cloud computing is renting computing resources (servers, storage, databases, networking) over the internet instead of owning and maintaining physical hardware.

**Before cloud:** Companies bought physical servers, put them in data centers, hired teams to manage them, and hoped they sized the hardware correctly for 5 years of growth.

**With cloud:** Rent what you need. Pay by the hour. Scale up instantly. Scale down when traffic drops. No hardware to buy, no data center to manage.

---

## The Big Three Cloud Providers

| Provider | Name | Market share |
|----------|------|-------------|
| Amazon | AWS (Amazon Web Services) | ~33% |
| Microsoft | Azure | ~22% |
| Google | GCP (Google Cloud Platform) | ~10% |

As a developer, you'll mostly use AWS or GCP. Many startups use managed platforms (Vercel, Railway, Render) that run on top of these clouds.

---

## IaaS vs PaaS vs SaaS

These three models describe how much you manage vs how much the provider manages.

### IaaS — Infrastructure as a Service
You rent raw infrastructure: virtual machines, storage, networking. You manage the OS, runtime, and everything above it.

**Examples:** AWS EC2, Google Compute Engine, DigitalOcean Droplets
**You manage:** OS, patches, runtime, scaling
**Good for:** Full control, custom configurations, experienced teams

### PaaS — Platform as a Service
You provide code; the platform handles runtime, OS, scaling, load balancing.

**Examples:** Vercel, Railway, Render, Heroku, AWS Elastic Beanstalk, Google App Engine
**You manage:** Your code and dependencies
**Good for:** Most startups and developer teams. Focus on product, not infrastructure.

### SaaS — Software as a Service
Fully managed applications you use, not run.

**Examples:** Supabase (managed PostgreSQL), MongoDB Atlas, AWS RDS (managed MySQL/PostgreSQL), Datadog (monitoring)
**You manage:** Nothing — just connect and use
**Good for:** Databases, monitoring, email, auth — managed services you integrate into your app.

**Rule of thumb:** Use PaaS and SaaS wherever possible. Drop to IaaS only when you need specific control or cost optimization at scale.

---

## Regions and Availability Zones

### Regions
A **region** is a geographic location with a cluster of data centers. Examples:
- \`us-east-1\` — North Virginia, USA
- \`eu-west-1\` — Ireland, Europe
- \`ap-southeast-1\` — Singapore, Asia

**Why regions matter:**
- **Latency** — deploy in the region closest to your users
- **Data residency** — GDPR requires EU user data stay in Europe
- **Redundancy** — deploy in multiple regions for disaster recovery

### Availability Zones (AZs)
Each region has multiple availability zones — physically separate data centers within the same region. If one AZ goes down (power failure, fire), the others keep running.

\`\`\`
us-east-1 (region)
  ├── us-east-1a (AZ 1)  — separate data center
  ├── us-east-1b (AZ 2)  — separate data center
  └── us-east-1c (AZ 3)  — separate data center
\`\`\`

For production apps: deploy across at least 2 AZs for high availability.

---

## Compute — Running Your App

### Virtual Machines (IaaS)
- **AWS EC2** — rent a virtual server, choose size, install what you want
- **Google Compute Engine** — same idea on GCP
- **DigitalOcean Droplets** — simpler, developer-friendly IaaS

**EC2 instance types:** t3.micro (1 CPU, 1GB), t3.small (2 CPU, 2GB), t3.large (2 CPU, 8GB)

### Serverless Functions (FaaS)
- **AWS Lambda** — run functions triggered by events, pay only when they run
- **Vercel Functions** — Next.js API routes run as serverless functions
- **Cloudflare Workers** — runs at the edge (globally distributed)

**When to use serverless:** event-driven workloads, APIs with variable traffic, webhooks.

### Container Services
- **AWS ECS** — managed Docker container service
- **AWS EKS** — managed Kubernetes
- **Google Cloud Run** — run containers without managing servers

---

## Storage

| Type | Service | Use for |
|------|---------|---------|
| Object storage | AWS S3, GCS | Images, videos, files, backups |
| Block storage | AWS EBS | Virtual machine disks |
| File storage | AWS EFS | Shared filesystem between servers |

**AWS S3 is the most common:** store user uploads, static assets, backups. Extremely cheap (~$0.023/GB/month), highly durable (99.999999999%).

\`\`\`javascript
// Upload to S3 from Node.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({ region: "us-east-1" });
await s3.send(new PutObjectCommand({
  Bucket: "my-bucket",
  Key: "uploads/profile.jpg",
  Body: fileBuffer,
  ContentType: "image/jpeg"
}));
\`\`\`

---

## Managed Database Services

Running your own database server means managing backups, patches, failover, and scaling. Managed services handle all of that:

| Service | Database | Notes |
|---------|---------|-------|
| AWS RDS | PostgreSQL, MySQL | Managed, automated backups, multi-AZ |
| AWS DynamoDB | NoSQL key-value | Serverless, infinite scale |
| Supabase | PostgreSQL | Developer-friendly, free tier |
| MongoDB Atlas | MongoDB | Official managed MongoDB |
| PlanetScale | MySQL | Serverless MySQL with branching |

**For startups:** Supabase or Railway PostgreSQL. As you scale: AWS RDS with read replicas.

---

## Cloud Costs — What Developers Should Know

Cloud costs can surprise you. Key rules:
1. **Data egress is expensive** — downloading data from AWS costs money; uploading is free
2. **Idle resources cost money** — stop dev instances when not in use
3. **Managed services cost more than raw VMs** — but save engineering time
4. **Set billing alerts** — get notified when you hit $10, $50, $100/month
5. **Use the free tier** — most providers have 12-month or always-free tiers for learning`,
    codeExamples: [
      {
        title: 'Choosing the right platform for a startup',
        code: `// Decision guide for a new startup's infrastructure:

// STAGE 1: Prototype / MVP (0 to 100 users)
// Frontend: Vercel (free tier, auto-deploys, CDN)
// Backend: Railway or Render (free tier, Docker support)
// Database: Supabase (free tier, PostgreSQL + auth + storage)
// Files: Cloudflare R2 (free tier, S3-compatible)
// Total cost: $0/month

// STAGE 2: Early Growth (100 to 10,000 users)
// Frontend: Vercel Pro ($20/month)
// Backend: Railway Pro ($20/month) or Render Starter
// Database: Supabase Pro ($25/month) or PlanetScale
// Files: AWS S3 (~$1-5/month)
// Total cost: ~$50-100/month

// STAGE 3: Scale (10,000+ users)
// Frontend: Vercel or AWS CloudFront + S3
// Backend: AWS ECS or GCP Cloud Run (containerized)
// Database: AWS RDS PostgreSQL (multi-AZ) or Supabase Team
// Cache: AWS ElastiCache (Redis)
// Files: AWS S3
// Total cost: $200-500+/month (depends on traffic)

// Rule: Start simple (PaaS), move to infrastructure (IaaS) only when:
// 1. You have specific requirements PaaS can't meet
// 2. Your bill is high enough that engineering time is cheaper`,
        explanation: 'Most startups stay on Vercel + Railway/Render + Supabase for years. Only move to raw AWS when you have scale problems or specific needs. Don\'t over-engineer early.',
      },
    ],
    commonMistakes: [
      'Opening all ports on a cloud VM\'s firewall — only open 22 (SSH), 80, and 443.',
      'Not setting billing alerts — cloud costs can spiral without notification.',
      'Running development databases on production servers — use separate environments.',
      'Storing AWS credentials in code or .env files committed to git — use IAM roles or environment variables in your CI/CD platform.',
      'Not choosing a region close to your users — adds unnecessary latency.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between IaaS, PaaS, and SaaS?',
        answer: 'IaaS (Infrastructure as a Service) gives you raw virtual machines — you manage OS, runtime, everything above hardware (AWS EC2, DigitalOcean). PaaS (Platform as a Service) takes your code and handles the infrastructure — you just deploy (Vercel, Railway, Heroku). SaaS (Software as a Service) is a fully managed application you consume via API or UI (Supabase, MongoDB Atlas, Datadog). The more managed, the less control but faster time-to-value.',
        difficulty: 'beginner',
      },
      {
        question: 'What is an Availability Zone and why should production apps use multiple ones?',
        answer: 'An Availability Zone is a physically separate data center within a cloud region, with its own power, cooling, and networking. Running across multiple AZs means if one AZ fails (fire, power outage), your app continues running in the others. For production, use at least 2 AZs with a load balancer distributing traffic. This provides high availability — AWS SLAs guarantee 99.99% uptime only when using multi-AZ.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-13-1',
        title: 'Design the cloud infrastructure for a SaaS app',
        description: 'You are building a B2B SaaS with a Next.js frontend, Node.js API, PostgreSQL database, and file uploads. Choose the right services for each component at early stage and at scale.',
        starterCode: `// App requirements:
// - Next.js frontend (mostly SSR pages)
// - Node.js REST API
// - PostgreSQL database
// - User file uploads (profile pictures, documents)
// - Redis for caching
// - Expected users: 0-1000 at launch

// Choose services for:
// Frontend hosting:
// Backend hosting:
// Database:
// File storage:
// Cache:
// Monitoring:
// Total estimated monthly cost:`,
        solution: `// Frontend hosting: Vercel (Pro plan if needed)
//   Why: Perfect for Next.js, CDN built-in, preview deploys on PRs
//   Cost: $0-20/month

// Backend hosting: Railway or Render
//   Why: Docker support, easy deploys, good free tier
//   Cost: $0-25/month

// Database: Supabase
//   Why: Managed PostgreSQL + auth + row-level security
//         Free 500MB, scales to Pro for $25/month
//   Cost: $0-25/month

// File storage: Cloudflare R2 or AWS S3
//   Why: R2 has no egress fees (cheaper for large files)
//        S3 has more ecosystem support
//   Cost: ~$0-5/month at this scale

// Cache: Upstash Redis (serverless Redis)
//   Why: Pay per request, no idle costs, free tier
//   Cost: $0-10/month

// Monitoring: Sentry (error tracking) + UptimeRobot (uptime)
//   Why: Both have generous free tiers
//   Cost: $0/month at this scale

// Total at launch: ~$0-30/month
// Total at 1000 users: ~$50-100/month`,
        hints: ['Start with PaaS services to minimize operations', 'Most services have free tiers that cover early stage startups'],
      },
    ],
    keyTakeaways: [
      'Cloud = rent servers, storage, and databases instead of owning hardware.',
      'IaaS = raw VMs (you manage OS). PaaS = deploy code (provider manages rest). SaaS = use services (fully managed).',
      'Regions = geographic locations. AZs = separate data centers within a region.',
      'Use multiple AZs for production high availability.',
      'For startups: Vercel + Railway/Render + Supabase covers 90% of needs cheaply.',
      'Set billing alerts. Cloud costs are easy to lose track of.',
    ],
    prevLesson: 'building-cd-pipelines',
    nextLesson: 'kubernetes-fundamentals',
  },

  // ─── LESSON 14 ────────────────────────────────────────────────────────────
  {
    id: 'kubernetes-fundamentals',
    slug: 'kubernetes-fundamentals',
    title: 'Kubernetes Fundamentals',
    description: 'What Kubernetes is, why it exists beyond Docker, clusters, nodes, pods, deployments, services, scaling, and rolling updates — understood deeply, not memorized.',
    category: 'Cloud',
    order: 14,
    difficulty: 'intermediate',
    estimatedTime: 45,
    content: `## The Problem Kubernetes Solves

Docker is great for running one app on one machine. But in production at scale, you have problems Docker alone can't solve:

**Problem 1: If a container crashes, who restarts it?**
Docker just lets it die. You need something watching containers and restarting failed ones.

**Problem 2: How do you run 10 copies of your API?**
Docker run creates one container. You'd manually run docker run 10 times. Managing 10 containers manually doesn't scale to 100.

**Problem 3: How do you update your app with zero downtime?**
docker stop + docker start = brief downtime. Users notice.

**Problem 4: How do you distribute containers across multiple servers?**
If all containers run on one server and that server dies, everything goes down.

**Problem 5: How do services find each other?**
At scale, containers start and stop constantly. Their IPs change. Services need a way to find each other reliably.

**Kubernetes solves all five problems.** It is a container orchestration platform — a system for running, scaling, healing, and connecting containers across a cluster of machines.

---

## What is Kubernetes?

Kubernetes (K8s) is an open-source system that automates the deployment, scaling, and management of containerized applications.

**Analogy:** Docker is a ship. Kubernetes is the fleet commander — it decides which ships go where, keeps them running, replaces broken ships, and balances the load.

---

## Kubernetes Architecture

### Cluster
A Kubernetes cluster is a group of machines (nodes) that run your containers. You talk to the cluster through the **control plane**.

\`\`\`
Kubernetes Cluster
├── Control Plane (brain of the cluster)
│   ├── API Server — you talk to K8s through this
│   ├── Scheduler — decides which node to run pods on
│   ├── Controller Manager — keeps desired state matching actual state
│   └── etcd — key-value store of cluster state
│
└── Worker Nodes (where your apps run)
    ├── Node 1 — [Pod A] [Pod B]
    ├── Node 2 — [Pod C] [Pod D] [Pod E]
    └── Node 3 — [Pod F]
\`\`\`

### Control Plane
The brain of Kubernetes. You tell it what you want (4 replicas of my app), and it makes it happen and keeps it that way.

### Worker Node
A machine (VM or physical server) that runs your containers. Each node has:
- **kubelet** — agent that talks to control plane
- **Container runtime** — Docker or containerd
- **kube-proxy** — network rules

---

## Core Building Blocks

### Pod
The smallest deployable unit in Kubernetes. A Pod wraps one or more containers that always run together on the same node.

\`\`\`yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app-pod
spec:
  containers:
  - name: my-app
    image: myapp:1.0.0
    ports:
    - containerPort: 3000
    env:
    - name: NODE_ENV
      value: production
\`\`\`

**You rarely create Pods directly.** Use a Deployment instead — it manages Pods for you.

### Deployment
A Deployment declares the desired state: "I want 3 replicas of myapp:1.0.0 always running." Kubernetes maintains that state — if a pod crashes, it starts a new one.

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3                    # always keep 3 pods running
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: myapp:1.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
\`\`\`

### ReplicaSet
What a Deployment creates under the hood to manage the number of pod replicas. You rarely interact with ReplicaSets directly.

### Service
Pods have dynamic IPs that change. A **Service** provides a stable IP and DNS name that other pods use to reach your app.

\`\`\`yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app              # routes traffic to pods with this label
  ports:
  - port: 80                 # port the service listens on
    targetPort: 3000         # port on the pods
  type: ClusterIP            # only reachable within the cluster
\`\`\`

**Service types:**
| Type | Access | Use case |
|------|--------|---------|
| ClusterIP | Inside cluster only | Service-to-service communication |
| NodePort | Via node's IP + port | Development, testing |
| LoadBalancer | Via a cloud load balancer | Production external access |

### Ingress
An Ingress routes external HTTP/HTTPS traffic to services inside the cluster — like Nginx as a reverse proxy but for Kubernetes.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
  - host: api.myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-service
            port:
              number: 80
\`\`\`

### Namespace
A virtual cluster inside your cluster. Separates resources by team, environment, or app.

\`\`\`bash
kubectl create namespace production
kubectl create namespace staging
kubectl get pods -n production    # pods in production namespace
\`\`\`

### ConfigMap and Secret
\`\`\`yaml
# ConfigMap — non-sensitive config
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: production
  LOG_LEVEL: info

# Secret — sensitive values (base64 encoded, encrypted at rest)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
  JWT_SECRET: supersecretjwt
\`\`\`

---

## Scaling

\`\`\`bash
# Manual scaling
kubectl scale deployment my-app --replicas=5

# Horizontal Pod Autoscaler (HPA) — auto-scale based on CPU
kubectl autoscale deployment my-app --min=2 --max=10 --cpu-percent=70
# When CPU > 70%, scale up. When CPU < 70%, scale down.
\`\`\`

---

## Rolling Updates — Zero Downtime Deploy

\`\`\`bash
# Update the image — Kubernetes rolls out gradually
kubectl set image deployment/my-app my-app=myapp:2.0.0

# K8s strategy:
# 1. Start a new pod with myapp:2.0.0
# 2. Wait for it to be ready
# 3. Stop an old pod with myapp:1.0.0
# 4. Repeat until all pods are updated

# Check rollout status
kubectl rollout status deployment/my-app

# Rollback if the new version has problems
kubectl rollout undo deployment/my-app
\`\`\`

---

## kubectl — The Kubernetes CLI

\`\`\`bash
# Apply configuration files
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ./k8s/          # apply all files in a directory

# View resources
kubectl get pods                  # list pods
kubectl get pods -o wide          # more details including node
kubectl get deployments
kubectl get services
kubectl get all                   # everything

# Inspect
kubectl describe pod my-pod       # detailed info + events
kubectl logs my-pod               # view logs
kubectl logs my-pod -f            # follow logs
kubectl exec -it my-pod -- bash   # shell into pod

# Scaling and updates
kubectl scale deployment my-app --replicas=5
kubectl set image deployment/my-app my-app=myapp:2.0.0
kubectl rollout undo deployment/my-app   # rollback

# Delete resources
kubectl delete -f deployment.yaml
kubectl delete deployment my-app
\`\`\``,
    codeExamples: [
      {
        title: 'Complete Kubernetes setup for a Node.js API',
        code: `# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # can have 1 extra pod during update
      maxUnavailable: 0  # never have less than desired count
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: ghcr.io/mycompany/api:abc1234
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:         # read from Kubernetes Secret
              name: app-secrets
              key: DATABASE_URL
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        readinessProbe:           # only send traffic when ready
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        livenessProbe:            # restart if unhealthy
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP`,
        explanation: 'readinessProbe ensures traffic only goes to pods that are ready. livenessProbe auto-restarts unhealthy pods. RollingUpdate with maxUnavailable=0 means zero-downtime deploys.',
      },
    ],
    commonMistakes: [
      'Creating Pods directly instead of using Deployments — Pods don\'t self-heal. Deployments do.',
      'Not setting resource requests and limits — without limits, one misbehaving pod can starve all others on the node.',
      'Not adding readiness probes — Kubernetes sends traffic to pods that aren\'t ready yet, causing errors.',
      'Storing secrets in ConfigMaps — use Kubernetes Secrets (encrypted at rest) for sensitive values.',
      'Running kubectl delete pod to fix problems — the Deployment just creates a new one. Fix the Deployment spec.',
    ],
    interviewQuestions: [
      {
        question: 'What is Kubernetes and what problem does it solve that Docker alone cannot?',
        answer: 'Kubernetes is a container orchestration platform that manages running, scaling, healing, and connecting containers across multiple machines. Docker runs a single container on a single machine. Kubernetes adds: automatic restart of crashed containers, running N replicas across multiple nodes, zero-downtime rolling updates, service discovery (stable DNS names for changing pod IPs), auto-scaling based on CPU/memory, and load balancing across pod replicas.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between a Pod, a Deployment, and a Service?',
        answer: 'Pod: the smallest unit — wraps one or more containers on the same node. Pods are ephemeral, not self-healing. Deployment: manages a set of identical pods, ensuring N replicas always run and handling rolling updates and rollbacks. You interact with Deployments, not Pods directly. Service: provides a stable IP and DNS name for a set of pods (selected by labels). As pods come and go, the Service always routes to the right ones.',
        difficulty: 'intermediate',
      },
      {
        question: 'How does Kubernetes do a zero-downtime deployment?',
        answer: 'Using a RollingUpdate strategy. Kubernetes starts new pods with the new image version, waits for the readiness probe to pass (verifying the pod is ready to receive traffic), then terminates old pods one by one. With maxUnavailable: 0 and maxSurge: 1, there is always at least the desired number of healthy pods serving traffic. kubectl rollout undo performs an instant rollback to the previous ReplicaSet.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-14-1',
        title: 'Write Kubernetes manifests for a web app',
        description: 'Write a Deployment and Service for a Next.js app running on port 3000. It should have 2 replicas, resource limits, and a readiness probe on /health.',
        starterCode: `# Write deployment.yaml:
# - 2 replicas
# - image: mycompany/nextjs:latest
# - port 3000
# - memory: 256Mi request, 512Mi limit
# - cpu: 250m request, 500m limit
# - readiness probe: GET /health on port 3000

# Write service.yaml:
# - ClusterIP service
# - routes port 80 to pod port 3000`,
        solution: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nextjs-app
  template:
    metadata:
      labels:
        app: nextjs-app
    spec:
      containers:
      - name: nextjs-app
        image: mycompany/nextjs:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nextjs-service
spec:
  selector:
    app: nextjs-app       # matches the labels in the Deployment template
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP`,
        hints: [
          'selector in Deployment and Service must match — use same labels',
          'readinessProbe goes inside the container spec',
          'resources.requests is what K8s reserves, limits is the max',
        ],
      },
    ],
    keyTakeaways: [
      'Kubernetes orchestrates containers across multiple machines — auto-heal, scale, update.',
      'Pod = smallest unit. Deployment = manages pods (replicas, updates, rollback). Service = stable network endpoint.',
      'RollingUpdate with readiness probes = zero-downtime deploys.',
      'kubectl apply -f file.yaml declares state. Kubernetes makes it happen and maintains it.',
      'Always set resource requests and limits, readiness probes, and use Secrets for sensitive values.',
      'kubectl rollout undo deployment/name instantly rolls back to the previous version.',
    ],
    prevLesson: 'cloud-fundamentals',
    nextLesson: 'monitoring-and-logging',
  },

  // ─── LESSON 15 ────────────────────────────────────────────────────────────
  {
    id: 'monitoring-and-logging',
    slug: 'monitoring-and-logging',
    title: 'Monitoring and Logging',
    description: 'Why monitoring matters, what logs and metrics are, how to set up health checks, and an introduction to Grafana, Prometheus, and Loki.',
    category: 'Cloud',
    order: 15,
    difficulty: 'beginner',
    estimatedTime: 25,
    content: `## Why Monitoring Matters

You deployed your app. Users are using it. But how do you know it's working correctly?

Without monitoring:
- You find out your app is down when a user emails you
- You have no idea if a deploy broke something until hours later
- You can't tell whether performance is degrading over time
- You're flying blind in production

**Monitoring answers the question: "Is my app healthy right now?"**
**Logging answers the question: "What happened and when?"**

---

## Logs

A **log** is a timestamped record of something that happened in your application.

\`\`\`
2024-01-15T10:30:01Z INFO  Server started on port 3000
2024-01-15T10:30:45Z INFO  POST /api/login user=alice
2024-01-15T10:31:02Z ERROR Database connection timeout after 5000ms
2024-01-15T10:31:02Z WARN  Retrying database connection (attempt 1/3)
\`\`\`

**Log levels (from least to most severe):**
| Level | When to use |
|-------|------------|
| DEBUG | Detailed debugging info (only in development) |
| INFO  | Normal operations: "user logged in", "payment processed" |
| WARN  | Something unexpected but recoverable: "retry attempt 1" |
| ERROR | Something failed but app is still running |
| FATAL | App cannot continue, about to crash |

**Structured logging** (JSON) is preferred in production — machines can parse it:
\`\`\`javascript
// Bad: plain string log (hard to search)
console.log("User alice logged in from 192.168.1.1 at 10:30am");

// Good: structured JSON log (easy to search and filter)
logger.info({
  event: "user.login",
  userId: "user_123",
  email: "alice@example.com",
  ip: "192.168.1.1",
  duration_ms: 45
});
\`\`\`

**Viewing logs:**
\`\`\`bash
# Docker container logs
docker logs myapp -f
docker logs myapp --since 1h | grep ERROR

# Kubernetes pod logs
kubectl logs deployment/myapp -f
kubectl logs deployment/myapp --since=1h | grep ERROR

# Linux service logs
journalctl -u myapp -f
journalctl -u myapp --since "1 hour ago"
\`\`\`

---

## Metrics

A **metric** is a number measured over time. Metrics tell you the current state and trend of your system.

**The four golden signals (Google SRE):**

| Signal | What it measures | Example |
|--------|-----------------|---------|
| Latency | How long requests take | p99 response time = 450ms |
| Traffic | How much work is happening | 500 requests/second |
| Errors | How many requests fail | 2% error rate |
| Saturation | How full the system is | CPU at 85% |

**Application metrics to track:**
- **Request rate** — requests per second
- **Error rate** — % of requests returning 5xx
- **Response time** — p50, p95, p99 percentiles
- **Active users** — concurrent connections

**Infrastructure metrics to track:**
- **CPU usage** — high CPU means you need to scale
- **Memory usage** — watch for memory leaks
- **Disk usage** — fills up silently and crashes apps
- **Network I/O** — bandwidth usage

---

## Health Checks

A **health check** is an endpoint your app exposes so monitoring systems can verify it's alive.

\`\`\`javascript
// Express health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// More comprehensive health check
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');   // verify database is reachable
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', db: 'disconnected' });
  }
});
\`\`\`

**Where health checks are used:**
- **Docker:** \`HEALTHCHECK CMD curl -f http://localhost:3000/health\`
- **Kubernetes:** readinessProbe and livenessProbe
- **Load balancers:** only route to healthy instances
- **UptimeRobot/Pingdom:** external uptime monitoring

---

## Alerts

Alerts notify you when something needs attention. Good alerts are:
- **Actionable** — you know what to do when you get it
- **Specific** — "error rate above 5%" not "something is wrong"
- **Proportional** — page on-call for critical issues, email for warnings

**Alert examples:**
| Condition | Severity | Action |
|-----------|---------|--------|
| /health returns 503 | Critical | Page on-call immediately |
| Error rate > 5% for 5 min | High | Slack alert |
| CPU > 80% for 15 min | Medium | Email notification |
| Disk usage > 70% | Low | Slack warning |

---

## Grafana

**Grafana** is the most popular open-source dashboard tool. It visualizes metrics as graphs, gauges, and tables.

\`\`\`
What it does:
- Connect to multiple data sources (Prometheus, Loki, databases)
- Build dashboards with graphs, heatmaps, stat panels
- Set up alert rules ("if error rate > 5% for 5 min, notify Slack")
- Share dashboards with your team

Common dashboards:
- Request rate + error rate + latency (the golden signals)
- Container CPU and memory usage
- Node.js event loop lag
- Database query performance
\`\`\`

---

## Prometheus

**Prometheus** is an open-source metrics collection and storage system. It "scrapes" (polls) metrics from your application at regular intervals.

\`\`\`javascript
// Expose metrics from Node.js app
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics(); // auto-collect Node.js metrics (CPU, memory, etc.)

// Expose metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// Custom metric: count API requests
import { Counter } from 'prom-client';
const requestCounter = new Counter({
  name: 'api_requests_total',
  help: 'Total API requests',
  labelNames: ['method', 'route', 'status'],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});
\`\`\`

Prometheus scrapes \`/metrics\` every 15 seconds and stores the data. Grafana reads from Prometheus to build dashboards.

---

## Loki — Log Aggregation

**Loki** is Grafana's log aggregation system. It collects logs from all your containers, stores them, and lets you search them in Grafana.

\`\`\`
Architecture:
App containers → Promtail (log collector) → Loki (storage) → Grafana (query + display)
\`\`\`

With Loki you can:
- Search logs across all services in one place
- Correlate logs with metrics ("error spike at 10:31 — what did the logs show?")
- Query logs with LogQL: \`{app="myapi"} |= "ERROR"\`

---

## Simple Monitoring Setup for a Developer

For most small-to-medium apps, a minimal monitoring stack:

\`\`\`
UptimeRobot (free)
- Checks /health every 5 minutes
- Sends email/SMS if down

Sentry (free tier)
- Catches unhandled errors in your app
- Sends Slack/email notification with full stack trace
- Groups repeated errors

Grafana Cloud (free tier)
- Hosted Grafana + Prometheus + Loki
- No server setup needed
- 10k metrics + 50GB logs free
\`\`\`

**For a personal project or startup MVP:**
\`\`\`javascript
// Minimal: just add Sentry
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
// Now every unhandled error is captured with full context
\`\`\``,
    codeExamples: [
      {
        title: 'Docker Compose with Prometheus + Grafana',
        code: `# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=15d'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"        # access Grafana at localhost:3001
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:

---
# prometheus.yml — tells Prometheus what to scrape
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['myapp:3000']  # scrape /metrics from your app
    metrics_path: /metrics`,
        explanation: 'This stack gives you full metrics monitoring locally. Prometheus scrapes your app every 15 seconds. Grafana lets you build dashboards from those metrics. Run with: docker compose -f docker-compose.monitoring.yml up',
      },
    ],
    commonMistakes: [
      'Not having a /health endpoint — without it, load balancers and monitoring tools cannot check your app.',
      'Logging everything at ERROR level — use levels correctly so alerts on ERROR are meaningful.',
      'Not monitoring disk usage — disk fills up silently and crashes the app with no warning.',
      'Setting alerts on every minor event — alert fatigue causes teams to ignore all alerts including critical ones.',
      'Using console.log in production — use a structured logger (pino, winston) for machine-parseable logs.',
    ],
    interviewQuestions: [
      {
        question: 'What are the four golden signals of monitoring?',
        answer: 'The four golden signals from Google\'s SRE book: Latency (how long requests take — p50, p95, p99 percentiles), Traffic (how many requests per second), Errors (percentage of requests that fail with 5xx status), and Saturation (how full your system is — CPU, memory, disk usage). Monitoring these four signals gives you a complete picture of system health.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between logs, metrics, and traces?',
        answer: 'Logs are timestamped records of discrete events ("user logged in", "database query failed"). Metrics are numeric measurements sampled over time (CPU at 45%, 500 req/s, error rate 2%). Traces follow a single request as it flows through multiple services — showing where time is spent in a distributed system. For most apps: structured logs + key metrics is sufficient. Distributed tracing (Jaeger, Zipkin) is needed when you have many microservices.',
        difficulty: 'intermediate',
      },
      {
        question: 'What should a /health endpoint return?',
        answer: 'A /health endpoint should return HTTP 200 with a JSON body like { "status": "ok" } when the app is healthy. For a more useful health check: also verify critical dependencies are reachable (database connection, Redis ping) and return 503 if they fail. Keep it fast — the health check is called every few seconds. Include uptime and version for debugging. Kubernetes readiness and liveness probes, load balancers, and uptime monitoring tools all rely on this endpoint.',
        difficulty: 'beginner',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-15-1',
        title: 'Design a monitoring strategy for a production app',
        description: 'You have a Node.js API deployed on a VPS. Design a minimal monitoring setup that tells you when things break and gives you enough information to fix them.',
        starterCode: `// App: Node.js Express API, PostgreSQL database, 1000 users/day
// Budget: $0 (use free tiers only)

// 1. What health check endpoint will you add to your app?
// 2. What uptime monitoring service will you use?
// 3. What error tracking tool will you add?
// 4. What metrics will you watch?
// 5. What alerts will you set up?
// 6. Where will you look first when the app breaks?`,
        solution: `// 1. Health check endpoint:
// GET /health → checks DB connection, returns { status: "ok", db: "connected" }
// Returns 503 if DB is unreachable

// 2. Uptime monitoring: UptimeRobot (free)
// - Pings /health every 5 minutes
// - Sends email + SMS if down
// - Public status page for users

// 3. Error tracking: Sentry (free tier - 5000 errors/month)
// - npm install @sentry/node
// - Captures unhandled errors with full stack trace
// - Groups errors by type
// - Slack notification on new error types

// 4. Metrics to watch (from Docker stats or Grafana Cloud free tier):
// - CPU usage (alert if > 80% for 15 minutes)
// - Memory usage (alert if > 90%)
// - Disk usage (alert if > 70%) ← easiest to forget
// - Error rate from Sentry dashboard

// 5. Alerts:
// - UptimeRobot: /health down → SMS immediately
// - Sentry: new error type → Slack
// - Disk > 70% → email (set up a cron job to check)

// 6. When something breaks, check in this order:
// a. UptimeRobot dashboard — is it down?
// b. Sentry — what errors are happening?
// c. docker logs myapp -n 100 | grep ERROR
// d. docker stats — CPU/memory spike?
// e. df -h — disk full?`,
        hints: [
          'Start simple: Sentry + UptimeRobot covers 90% of production issues for free',
          'Disk usage is the most commonly missed metric — many apps crash because disk fills up',
          'Health checks should verify database connectivity, not just that the process is running',
        ],
      },
    ],
    keyTakeaways: [
      'Monitoring = knowing your app is healthy now. Logging = knowing what happened.',
      'The four golden signals: Latency, Traffic, Errors, Saturation.',
      'Every production app needs a /health endpoint. Load balancers and monitors depend on it.',
      'Use structured JSON logging in production. Set log levels correctly (ERROR = actionable).',
      'Minimum viable monitoring: Sentry (errors) + UptimeRobot (uptime). Both free.',
      'Grafana + Prometheus + Loki is the standard open-source observability stack.',
    ],
    prevLesson: 'kubernetes-fundamentals',
    nextLesson: 'security-basics',
  },

  // ─── LESSON 16 ────────────────────────────────────────────────────────────
  {
    id: 'security-basics',
    slug: 'security-basics',
    title: 'Security Basics for Developers',
    description: 'Secrets management, environment variables, API keys, authentication vs authorization, secure deployment practices, and the most common security mistakes developers make.',
    category: 'Cloud',
    order: 16,
    difficulty: 'intermediate',
    estimatedTime: 30,
    content: `## Why Security Is a Developer Responsibility

Security is not just for security engineers. Every developer ships code to production. A leaked API key, a hardcoded password, or an exposed debug endpoint can compromise your entire application and your users' data.

This lesson covers the practical security knowledge every developer needs — not advanced penetration testing, but the basics you must understand to not make common, costly mistakes.

---

## Secrets Management

**A secret is any value that, if exposed, compromises your system:**
- Database passwords
- API keys (Stripe, AWS, Twilio)
- JWT signing secrets
- SSH private keys
- OAuth client secrets

### Rule 1: Never commit secrets to Git

Once a secret is in a Git commit, it is compromised — even if you delete the file later. Git history is permanent. Attackers scan GitHub for leaked secrets using automated tools.

\`\`\`bash
# Wrong — committed to git history forever:
const db = new Database({
  password: "myP@ssw0rd123"   # ❌ hardcoded secret
});

# Right — read from environment:
const db = new Database({
  password: process.env.DB_PASSWORD  # ✅ from environment
});
\`\`\`

**Add to .gitignore BEFORE your first commit:**
\`\`\`
# .gitignore
.env
.env.local
.env.production
*.pem
*.key
secrets/
\`\`\`

### Rule 2: Use environment variables for all secrets

\`\`\`bash
# .env (local development — never commit this file)
DATABASE_URL=postgresql://postgres:secret@localhost:5432/myapp
JWT_SECRET=myjwtsecret
STRIPE_SECRET_KEY=sk_test_abc123
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Load in Node.js:
import 'dotenv/config';   # reads .env file into process.env
\`\`\`

**In production, inject secrets via:**
- CI/CD platform secrets (GitHub Actions secrets)
- Cloud provider environment variables (Railway, Render, Vercel)
- AWS Secrets Manager / HashiCorp Vault (for large teams)

### What to do if you accidentally commit a secret

\`\`\`bash
# Step 1: Immediately revoke/rotate the compromised secret
# (Go to your provider and generate a new key NOW — before anything else)

# Step 2: Remove from git history (BFG Repo Cleaner or git-filter-repo)
# Note: if repo is public, assume it was already scraped. Rotation is #1.

# Step 3: Force push to remove from remote (tell teammates)
# Step 4: Audit: was the secret used maliciously?
\`\`\`

---

## Authentication vs Authorization

These are different concepts that are frequently confused:

| | Authentication (AuthN) | Authorization (AuthZ) |
|-|----------------------|---------------------|
| Question | Who are you? | What are you allowed to do? |
| Example | Login with email + password | Can this user delete this post? |
| Implementation | JWT, sessions, OAuth | RBAC, permissions, policies |
| Failure code | 401 Unauthorized | 403 Forbidden |

\`\`\`javascript
// Authentication middleware — verifies WHO you are
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Authorization middleware — verifies WHAT you can do
function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    next();
  };
}

// Usage:
app.delete('/posts/:id', authenticate, authorize('admin'), deletePost);
\`\`\`

---

## Secure Deployments

### Use HTTPS everywhere

\`\`\`bash
# Never deploy production on HTTP only
# Use Let's Encrypt for free SSL certificates

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
# Auto-renewal is set up automatically
\`\`\`

### Minimal firewall rules

\`\`\`bash
# Only open what you need
sudo ufw default deny incoming     # deny all incoming by default
sudo ufw default allow outgoing
sudo ufw allow ssh                 # port 22: SSH access
sudo ufw allow http                # port 80: HTTP (redirects to HTTPS)
sudo ufw allow https               # port 443: HTTPS
sudo ufw enable

# Never open database ports to the internet:
# Port 5432 (PostgreSQL), 3306 (MySQL), 27017 (MongoDB)
# should ONLY be accessible from your app server's private IP
\`\`\`

### Run as non-root

\`\`\`dockerfile
# In Docker: always create and use a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
CMD ["node", "server.js"]
\`\`\`

### Keep dependencies updated

\`\`\`bash
# Check for vulnerabilities in your dependencies
npm audit

# Fix automatically where possible
npm audit fix

# Check for outdated packages
npm outdated

# Use Dependabot (GitHub) or Renovate to auto-create PRs for updates
\`\`\`

---

## Common Security Mistakes

### 1. Logging sensitive data

\`\`\`javascript
// Bad: logs contain password
console.log('Login attempt:', req.body);
// Output: { email: "alice@example.com", password: "myP@ssword" }

// Good: never log credentials
console.log('Login attempt:', { email: req.body.email });
\`\`\`

### 2. Trusting user input

\`\`\`javascript
// Bad: SQL injection vulnerability
const query = \`SELECT * FROM users WHERE id = \${req.params.id}\`;
// Attacker sends: id = "1; DROP TABLE users;"

// Good: parameterized queries (ORM or prepared statements)
const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
// Or with Prisma/Drizzle: prisma.user.findUnique({ where: { id } })
\`\`\`

### 3. Exposing stack traces to users

\`\`\`javascript
// Bad: exposes internal code structure
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });  // ❌
});

// Good: log internally, send generic message to user
app.use((err, req, res, next) => {
  console.error(err);  // log with full context
  res.status(500).json({ error: 'Internal server error' });  // ✅
});
\`\`\`

### 4. Weak JWT secrets

\`\`\`bash
# Bad: short, guessable secret
JWT_SECRET=secret123

# Good: long random secret (at least 32 characters)
# Generate with:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Output: a4f8b2c9d0e1f3a5... (128 character hex string)
\`\`\`

### 5. Not validating environment on startup

\`\`\`javascript
// Check required secrets are present when app starts
const required = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(\`Missing required environment variable: \${key}\`);
    process.exit(1);  // crash on startup rather than fail silently later
  }
}
\`\`\`

---

## Security in CI/CD

\`\`\`yaml
# GitHub Actions security best practices:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Audit npm dependencies for known vulnerabilities
      - name: npm audit
        run: npm audit --audit-level=high

      # Scan for secrets accidentally committed
      - name: Secret scan
        uses: trufflesecurity/trufflehog@v3
        with:
          path: ./
          base: \${{ github.event.repository.default_branch }}

      # Docker image vulnerability scan
      - name: Scan Docker image
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:latest
          exit-code: 1
          severity: CRITICAL
\`\`\`

---

## Security Checklist for Deployments

Before going to production, check:

- [ ] All secrets in environment variables, not in code or git
- [ ] .env files in .gitignore
- [ ] HTTPS configured with valid SSL certificate
- [ ] Firewall: only ports 22, 80, 443 open
- [ ] Database not accessible from the internet
- [ ] App runs as non-root user
- [ ] npm audit clean (no critical vulnerabilities)
- [ ] Error messages don't expose internal details
- [ ] SQL queries use parameterized inputs
- [ ] JWT secret is long and random (32+ bytes)
- [ ] Logging excludes passwords, tokens, and PII`,
    codeExamples: [
      {
        title: 'Secure environment variable validation on startup',
        code: `// config.ts — validate all required secrets at startup

const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
} as const;

// Check all required vars are present
const missing = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

// Validate JWT secret strength
if (process.env.JWT_SECRET!.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters');
  process.exit(1);
}

export const config = {
  database: { url: requiredEnvVars.DATABASE_URL! },
  jwt: { secret: requiredEnvVars.JWT_SECRET! },
  stripe: { secretKey: requiredEnvVars.STRIPE_SECRET_KEY! },
  aws: {
    accessKeyId: requiredEnvVars.AWS_ACCESS_KEY_ID!,
    secretAccessKey: requiredEnvVars.AWS_SECRET_ACCESS_KEY!,
  },
};

// Import this at the very start of your app:
// import './config';  // crashes immediately if any secret is missing`,
        explanation: 'Fail fast at startup if secrets are missing. This is much better than a confusing runtime error when a user triggers a payment flow and Stripe fails because the key is undefined.',
      },
    ],
    commonMistakes: [
      'Committing .env files to git — the #1 source of leaked credentials. Add .env to .gitignore before your first commit.',
      'Returning HTTP 401 for authorization failures and 403 for authentication failures — it should be the reverse.',
      'Logging req.body which contains passwords — explicitly exclude sensitive fields from logs.',
      'Using short or predictable JWT secrets — generate a cryptographically random 64-byte secret.',
      'Opening database ports in the firewall — databases should never be directly accessible from the internet.',
      'Running as root in Docker containers — a compromised container running as root can escape to the host.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between authentication and authorization?',
        answer: 'Authentication (AuthN) verifies who you are — it answers "are you who you claim to be?" through credentials like passwords, tokens, or biometrics. Authorization (AuthZ) determines what you are allowed to do — it answers "do you have permission to do this?" For example: login is authentication. Checking if you can access the admin panel is authorization. Authentication failure returns 401 Unauthorized. Authorization failure returns 403 Forbidden.',
        difficulty: 'beginner',
      },
      {
        question: 'What should you do if you accidentally commit a secret (API key, password) to a public GitHub repo?',
        answer: 'Step 1 is to immediately revoke and rotate the compromised secret — go to the provider (AWS, Stripe, etc.) and generate a new key. Do this first, before anything else, because bots scan GitHub continuously. Step 2 is to remove from git history using git-filter-repo or BFG Repo Cleaner. Step 3 is to force-push the cleaned history. Step 4 is to audit whether the secret was already used maliciously (check provider logs). Simply deleting the file and making a new commit is not enough — the secret is still in git history.',
        difficulty: 'intermediate',
      },
      {
        question: 'What firewall ports should be open on a production server running a Node.js app?',
        answer: 'Only three ports: 22 (SSH — and ideally only from your IP), 80 (HTTP — for redirect to HTTPS), and 443 (HTTPS). Database ports (5432, 3306, 27017, 6379) must NOT be open to the internet — databases should only be reachable from your app server via internal/private network. Application ports like 3000 should not be open either — Nginx on 443 proxies to the app internally.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-16-1',
        title: 'Security audit of a deployment',
        description: 'Review the following code and deployment config. Identify all security issues and explain how to fix each one.',
        starterCode: `// server.js
import express from 'express';
const app = express();

const DB_PASSWORD = "admin123";  // database password

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", req.body);  // logging credentials

  const user = await db.query(
    \`SELECT * FROM users WHERE email = '\${email}' AND password = '\${password}'\`
  );

  if (user) {
    const token = jwt.sign({ userId: user.id }, "secret", { expiresIn: '7d' });
    res.json({ token });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });  // exposing stack trace
});

// Dockerfile
// FROM node:20
// USER root
// COPY . .
// RUN npm install
// CMD ["node", "server.js"]`,
        solution: `// ISSUES FOUND:
// 1. DB_PASSWORD hardcoded → move to process.env.DB_PASSWORD
// 2. req.body logged → never log passwords: console.log({ email }) only
// 3. SQL injection via string interpolation → use parameterized query
// 4. JWT secret is "secret" (too short/weak) → use long random secret from env
// 5. Stack trace exposed to user → log internally, return generic message
// 6. Dockerfile runs as root → add non-root user
// 7. npm install instead of npm ci → use npm ci in Docker
// 8. Password likely stored as plaintext → should be hashed with bcrypt

// FIXED server.js:
const DB_PASSWORD = process.env.DB_PASSWORD; // ✅ from env

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email }); // ✅ no password in logs

  const user = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  ); // ✅ parameterized query

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    }); // ✅ secret from env
    res.json({ token });
  }
});

app.use((err, req, res, next) => {
  console.error(err); // ✅ log internally
  res.status(500).json({ error: 'Internal server error' }); // ✅ generic message
});

// FIXED Dockerfile:
// FROM node:20-alpine
// RUN addgroup -S app && adduser -S app -G app
// WORKDIR /app
// COPY package*.json ./
// RUN npm ci --only=production  ✅
// COPY . .
// USER app  ✅
// CMD ["node", "server.js"]`,
        hints: [
          'Count the issues: there are at least 7 distinct security problems',
          'SQL injection + hardcoded password + weak JWT + root user are the critical ones',
          'Stack traces expose file paths and internal structure to attackers',
        ],
      },
    ],
    keyTakeaways: [
      'Never commit secrets to git. Use .env files (in .gitignore) and environment variables.',
      'Authentication = who are you (401). Authorization = what can you do (403).',
      'Rotate secrets immediately if compromised — git history deletion comes second.',
      'Firewall: only open ports 22, 80, 443. Never expose database ports.',
      'Always run containers as non-root. Use parameterized queries to prevent SQL injection.',
      'Log errors internally with full context. Return generic error messages to users.',
    ],
    prevLesson: 'monitoring-and-logging',
    nextLesson: 'real-world-projects',
  },

  // ─── LESSON 17 ────────────────────────────────────────────────────────────
  {
    id: 'real-world-projects',
    slug: 'real-world-projects',
    title: 'Real World Deployment Projects',
    description: 'Guided projects: Dockerize an Express app, Dockerize Next.js, compose a full-stack app, build CI/CD pipelines, and deploy to Railway, Render, and a VPS.',
    category: 'Projects',
    order: 17,
    difficulty: 'intermediate',
    estimatedTime: 60,
    content: `## Learning by Doing

Everything in this track comes together in real projects. This lesson is a guided reference — follow each project in order or jump to what you need.

---

## Project 1: Dockerize an Express API

**Goal:** Take a plain Node.js/Express app and package it in Docker.

**Starting point:**
\`\`\`
my-api/
├── package.json
├── package-lock.json
└── src/
    └── server.js
\`\`\`

**Step 1: Create .dockerignore**
\`\`\`
node_modules
.env
.git
*.log
\`\`\`

**Step 2: Write the Dockerfile**
\`\`\`dockerfile
FROM node:20-alpine

RUN apk add --no-cache dumb-init
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --chown=app:app package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --chown=app:app src/ ./src/

USER app
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
\`\`\`

**Step 3: Build and test**
\`\`\`bash
# Build
docker build -t my-api:1.0.0 .

# Run
docker run -d -p 3000:3000 --name my-api \
  -e DATABASE_URL=postgresql://... \
  my-api:1.0.0

# Test
curl http://localhost:3000/health

# View logs
docker logs my-api -f
\`\`\`

**Step 4: Push to Docker Hub**
\`\`\`bash
docker tag my-api:1.0.0 yourusername/my-api:1.0.0
docker login
docker push yourusername/my-api:1.0.0
\`\`\`

---

## Project 2: Dockerize a Next.js App

**Goal:** Multi-stage Dockerfile for Next.js with standalone output.

**Step 1: Enable standalone output in next.config.js**
\`\`\`javascript
// next.config.js
const nextConfig = {
  output: 'standalone',
};
export default nextConfig;
\`\`\`

**Step 2: Write the multi-stage Dockerfile**
\`\`\`dockerfile
FROM node:20-alpine AS base

# Deps stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner stage (final image)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
\`\`\`

**Step 3: Build and run**
\`\`\`bash
docker build -t my-nextjs:1.0.0 .
docker run -d -p 3000:3000 my-nextjs:1.0.0
# Open http://localhost:3000
\`\`\`

---

## Project 3: Next.js + PostgreSQL with Docker Compose

**Goal:** Run the full stack locally with one command.

**Step 1: Create docker-compose.yml**
\`\`\`yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:devpassword@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"      # expose for local database tools
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
\`\`\`

**Step 2: Start everything**
\`\`\`bash
docker compose up -d --build

# Run database migrations (if using Prisma)
docker compose exec web npx prisma migrate dev

# View logs
docker compose logs -f web

# Stop everything
docker compose down
\`\`\`

---

## Project 4: Node.js + MongoDB

\`\`\`yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      MONGODB_URI: mongodb://admin:secret@mongo:27017/myapp?authSource=admin
      NODE_ENV: development
    depends_on:
      mongo:
        condition: service_healthy
    volumes:
      - ./src:/app/src   # hot reload in development

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    volumes:
      - mongodata:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mongodata:
\`\`\`

---

## Project 5: GitHub Actions CI Pipeline

**Goal:** Automated testing on every pull request.

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/testdb
      - run: npm run build
\`\`\`

---

## Project 6: GitHub Actions CD Pipeline

**Goal:** Auto-deploy to production on merge to main.

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/ci.yml    # reuse CI workflow

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            ghcr.io/\${{ github.repository }}:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: ubuntu
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp \
              --restart unless-stopped \
              -p 3000:3000 \
              --env-file /app/.env \
              ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            sleep 5
            curl -f http://localhost:3000/health || exit 1
\`\`\`

---

## Project 7: Deploy to Railway

**Option A: Connect GitHub repo (simplest)**
1. Go to railway.app → New Project → Deploy from GitHub
2. Select your repository
3. Add environment variables (DATABASE_URL, etc.)
4. Railway auto-detects Dockerfile and deploys on every push to main

**Option B: Via GitHub Actions**
\`\`\`yaml
- name: Deploy to Railway
  run: |
    npm install -g @railway/cli
    railway up --service \${{ vars.RAILWAY_SERVICE_ID }}
  env:
    RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}
\`\`\`

---

## Project 8: Deploy to Render

1. Create account at render.com
2. New Web Service → Connect GitHub repo
3. Select "Docker" as environment
4. Add environment variables
5. Copy the Deploy Hook URL from Render dashboard

\`\`\`yaml
# GitHub Actions step to trigger Render deploy
- name: Deploy to Render
  run: curl -X POST "\${{ secrets.RENDER_DEPLOY_HOOK }}"
\`\`\`

---

## Project 9: Deploy to a VPS (DigitalOcean / Hetzner)

**Initial server setup (do once):**
\`\`\`bash
# On the server:
# 1. Install Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker ubuntu

# 2. Set up firewall
ufw allow ssh
ufw allow http
ufw allow https
ufw enable

# 3. Install Nginx
apt install nginx
certbot --nginx -d yourdomain.com

# 4. Create app directory and .env file
mkdir -p /app
nano /app/.env  # add your production secrets here

# 5. Add GitHub Actions SSH key to authorized_keys
echo "ssh-ed25519 AAAA..." >> ~/.ssh/authorized_keys
\`\`\`

**Nginx config as reverse proxy:**
\`\`\`nginx
server {
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\``,
    codeExamples: [
      {
        title: 'Complete project checklist before going to production',
        code: `# Pre-production checklist — run through this for every app

# === APPLICATION ===
# [ ] Health check endpoint: GET /health returns 200
# [ ] All secrets in environment variables (no hardcoding)
# [ ] .env file in .gitignore
# [ ] npm audit passes (no critical vulnerabilities)
# [ ] Error pages don't expose stack traces

# === DOCKER ===
# [ ] .dockerignore excludes node_modules, .env, .git
# [ ] Multi-stage build (builder + slim production image)
# [ ] Non-root user in Dockerfile
# [ ] Image tagged with git SHA (not :latest)
# [ ] Image pushed to registry (GHCR or Docker Hub)

# === CI/CD ===
# [ ] CI runs on every PR (lint + types + test + build)
# [ ] Branch protection enabled (require CI to pass)
# [ ] CD deploys to staging automatically on merge to main
# [ ] CD deploys to production with manual approval
# [ ] Health check after every deployment
# [ ] Automatic rollback on failed health check

# === SERVER ===
# [ ] HTTPS configured with Let's Encrypt
# [ ] Firewall: only 22, 80, 443 open
# [ ] Database ports NOT open to internet
# [ ] Nginx reverse proxy in front of app
# [ ] App running with --restart unless-stopped

# === MONITORING ===
# [ ] UptimeRobot (or similar) monitoring /health
# [ ] Sentry for error tracking
# [ ] Disk usage monitoring set up
# [ ] Alerts configured for downtime

echo "All checks passed? Ready to go live."`,
        explanation: 'Run through this checklist before every production launch. Missing one item can lead to downtime, data loss, or security breaches. Save it as a GitHub issue template or PR description template for your team.',
      },
    ],
    commonMistakes: [
      'Skipping staging and deploying directly to production — always test in a staging environment first.',
      'Not adding .dockerignore before first docker build — sends huge node_modules to the build context.',
      'Forgetting to set restart: unless-stopped — after a server reboot, your container won\'t start.',
      'Not running database migrations before deploying new app code — causes the new code to fail against an old schema.',
      'Storing .env files on the server and committing them — use environment variables injected by CI/CD or the platform.',
    ],
    interviewQuestions: [
      {
        question: 'Walk me through how you would Dockerize and deploy a Node.js API.',
        answer: 'First, write a .dockerignore excluding node_modules, .env, and .git. Then write a Dockerfile: FROM node:20-alpine, create a non-root user, COPY package.json, run npm ci, COPY source code, set USER to non-root, EXPOSE port, CMD. Build with docker build -t myapi:v1.0.0 ., test locally with docker run. Push to a registry (GHCR or Docker Hub). In production: pull the image, stop old container, start new one, check /health endpoint. Automate all of this with GitHub Actions.',
        difficulty: 'intermediate',
      },
      {
        question: 'What is the difference between Railway, Render, and deploying to a raw VPS?',
        answer: 'Railway and Render are PaaS platforms — you connect your GitHub repo, they handle building, running, scaling, and SSL. Great for getting started fast. A raw VPS (DigitalOcean, Hetzner) is IaaS — you manage the OS, Docker, Nginx, SSL, and deployments yourself. VPS is cheaper at scale and gives more control, but requires more operational knowledge. For early-stage apps: Railway/Render. For cost-sensitive or control-sensitive apps: VPS with Docker.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-17-1',
        title: 'Complete DevOps project: from code to production',
        description: 'Take a simple Express API (or use a template) and complete the full DevOps pipeline: Dockerize it, write a CI pipeline, and write a CD pipeline that deploys to Railway or Render.',
        starterCode: `# Step 1: Write the Dockerfile for this Express API
# - Use node:20-alpine
# - Non-root user
# - Proper layer caching (package.json before source code)
# - Health check route: GET /health

# Step 2: Write .github/workflows/ci.yml
# - Trigger: PR to main
# - Steps: checkout, setup node 20, npm ci, npm test, npm run build

# Step 3: Write .github/workflows/deploy.yml
# - Trigger: push to main (after CI passes)
# - Build Docker image tagged with git SHA
# - Push to GHCR
# - Deploy to Railway (or Render deploy hook)

# Start writing below:
# Dockerfile:

# .github/workflows/ci.yml:

# .github/workflows/deploy.yml:`,
        solution: `# Dockerfile:
FROM node:20-alpine
RUN apk add --no-cache dumb-init
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --chown=app:app package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --chown=app:app src/ ./src/
USER app
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]

# .github/workflows/ci.yml:
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build

# .github/workflows/deploy.yml:
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    needs: ci
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}`,
        hints: [
          'Use ENTRYPOINT + CMD for proper signal handling with dumb-init',
          'In deploy.yml, the docker job should have needs: ci to wait for tests',
          'GITHUB_TOKEN is automatically provided — no setup needed for GHCR push',
        ],
      },
    ],
    keyTakeaways: [
      'Follow the order: Dockerize → Docker Compose → CI pipeline → CD pipeline → deploy.',
      'Always use .dockerignore. Always use multi-stage builds for production images.',
      'Railway and Render are the fastest way to ship — connect GitHub repo and done.',
      'VPS deployments need Nginx as a reverse proxy and Let\'s Encrypt for HTTPS.',
      'Every production deployment must end with a health check.',
      'Use this lesson as a reference — come back when you start a new project.',
    ],
    prevLesson: 'security-basics',
    nextLesson: 'devops-interview-prep',
  },

  // ─── LESSON 18 ────────────────────────────────────────────────────────────
  {
    id: 'devops-interview-prep',
    slug: 'devops-interview-prep',
    title: 'DevOps Interview Preparation',
    description: 'Linux, Docker, Dockerfile, GitHub Actions, CI/CD, cloud, Kubernetes, and scenario-based questions — everything you need for DevOps interview rounds.',
    category: 'Interview',
    order: 18,
    difficulty: 'intermediate',
    estimatedTime: 45,
    content: `## How DevOps Interviews Work

DevOps questions appear in:
- **Backend developer interviews** — "Do you know Docker?"
- **Full-stack interviews** — "Walk me through how you deploy your app"
- **DevOps engineer interviews** — deep technical depth across all areas
- **System design interviews** — "How would you set up CI/CD for a microservices app?"

This lesson covers questions at the beginner-to-intermediate level — appropriate for software engineers who need DevOps knowledge, not dedicated DevOps Engineer roles.

---

## Linux Questions

**Q: What does chmod 755 mean?**

chmod 755 sets file permissions:
- Owner: 7 = read(4) + write(2) + execute(1) → full access
- Group: 5 = read(4) + execute(1) → can read and run
- Others: 5 = read(4) + execute(1) → can read and run

Standard for scripts and executables. Use 644 for config files (owner can write, others read-only).

---

**Q: How do you find which process is using port 3000?**

\`\`\`bash
# Linux:
sudo lsof -i :3000
sudo ss -tulpn | grep :3000

# See the PID in the output, then kill:
kill -9 <PID>
\`\`\`

---

**Q: How do you search for a string across all files in a directory?**

\`\`\`bash
grep -r "search term" ./src
grep -rn "ERROR" /var/log/          # -n shows line numbers
grep -r "TODO" . --include="*.ts"  # only TypeScript files
\`\`\`

---

**Q: What is the difference between kill and kill -9?**

\`kill PID\` sends SIGTERM — a polite "please stop." The process can catch it, clean up (close connections, flush data), and exit. Default timeout: 10 seconds.

\`kill -9 PID\` sends SIGKILL — immediate forced termination. The OS kills the process without warning. No cleanup. Use only when kill fails.

---

**Q: How do you make a shell script that runs at server startup?**

\`\`\`bash
# Create a systemd service file
sudo nano /etc/systemd/system/myapp.service
# (add the service definition)
sudo systemctl enable myapp    # enable auto-start on boot
sudo systemctl start myapp     # start now
\`\`\`

---

## Docker Questions

**Q: What is the difference between a Docker image and a container?**

An image is a read-only blueprint — built from a Dockerfile, stored in a registry. Like a class in OOP.
A container is a running instance of an image. Like an object instantiated from the class. Multiple containers can run from the same image.

---

**Q: How do you get a shell inside a running container?**

\`\`\`bash
docker exec -it container_name bash
# or for Alpine-based images (no bash):
docker exec -it container_name sh
\`\`\`

-i = keep stdin open, -t = allocate a terminal (TTY)

---

**Q: What does docker run -d -p 3000:3000 --name api myapi:latest do?**

- \`-d\` — run in background (detached mode)
- \`-p 3000:3000\` — map host port 3000 to container port 3000
- \`--name api\` — name the container "api"
- \`myapi:latest\` — use this image

---

**Q: How do you copy files from a container to your host machine?**

\`\`\`bash
docker cp container_name:/path/inside/container ./local/path
docker cp myapp:/app/logs/error.log ./error.log
\`\`\`

---

## Dockerfile Questions

**Q: Why do you copy package.json before the rest of the source code?**

Layer caching. Docker caches each layer. If you COPY everything first, then run npm install, any code change invalidates the npm install layer and it runs again. If you COPY only package.json first and run npm install, the install layer is only invalidated when dependencies change. Code changes only rebuild the cheaper COPY layer.

---

**Q: What is the difference between CMD and ENTRYPOINT?**

| | CMD | ENTRYPOINT |
|-|-----|------------|
| Overridden by | docker run myimage custom-cmd | requires --entrypoint flag |
| Purpose | Default arguments | Fixed executable |

Best practice: ENTRYPOINT sets the program, CMD sets default arguments. Together: ENTRYPOINT ["node"] + CMD ["server.js"] → always runs node, but you can pass a different file.

---

**Q: What is a multi-stage build and why is it useful?**

Multiple FROM instructions in one Dockerfile. Early stages do the heavy work (install dev deps, compile TypeScript). The final stage starts fresh and only copies the compiled output. Result: much smaller production image (350MB → 90MB). Smaller images = faster pulls, smaller attack surface, faster startup.

---

**Q: What should go in .dockerignore?**

\`\`\`
node_modules
.env
.git
*.log
dist
.next
build
\`\`\`

Without .dockerignore, docker build sends the entire project directory to the Docker daemon — including 300MB of node_modules and your .env secrets.

---

## GitHub Actions Questions

**Q: What are the main components of a GitHub Actions workflow?**

- **Workflow** — the YAML file in .github/workflows/
- **Trigger (on:)** — what starts it: push, pull_request, schedule, workflow_dispatch
- **Job** — a group of steps running on one runner
- **Step** — a single task: either \`run:\` (shell) or \`uses:\` (action)
- **Runner** — the VM where jobs run (ubuntu-latest, etc.)
- **Secret** — encrypted value from repo settings: \`\${{ secrets.NAME }}\`

---

**Q: How do you make one job wait for another to succeed?**

\`\`\`yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: test          # deploy only if test passes
    runs-on: ubuntu-latest
    steps: [...]
\`\`\`

---

**Q: How do you trigger a workflow manually?**

\`\`\`yaml
on:
  workflow_dispatch:      # enables the "Run workflow" button in GitHub UI
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
\`\`\`

---

## CI/CD Questions

**Q: What is the difference between CI and CD?**

CI (Continuous Integration): automatically build and test code on every commit. The goal is catching broken code before it merges.

CD (Continuous Delivery): automatically deploy to staging after CI passes. Production deployment requires manual approval.

Continuous Deployment: every passing commit goes to production automatically. Requires high test coverage and trust.

---

**Q: How would you set up CI for a project that had none?**

1. Create .github/workflows/ci.yml
2. Trigger on: pull_request to main
3. Steps: checkout → install Node → npm ci → lint → test → build
4. Enable branch protection in repo settings: require CI to pass before merging
5. Start: even a workflow that just runs npm test is better than nothing

---

**Q: What do you do if a production deploy breaks the app?**

1. Immediately rollback: redeploy the previous Docker image tag (keep old images in the registry for this)
2. Notify the team
3. Investigate: check logs, compare what changed between the old and new version
4. Fix the issue in a branch, get it reviewed, go through staging first
5. Prevent recurrence: add a test that would have caught this

---

## Cloud Questions

**Q: What is the difference between IaaS, PaaS, and SaaS?**

- IaaS: you get raw VMs, you manage OS and everything above (AWS EC2)
- PaaS: you give them code, they run it (Vercel, Railway, Heroku)
- SaaS: fully managed services you consume via API (Supabase, MongoDB Atlas)

As a developer, prefer PaaS. Use IaaS when you need specific control at scale.

---

**Q: What is an availability zone and why do production apps use multiple?**

An AZ is a physically separate data center within a cloud region, with its own power and network. Using multiple AZs means if one fails, the others keep running. High availability requires at least 2 AZs with a load balancer.

---

## Kubernetes Questions

**Q: What is the difference between a Pod, Deployment, and Service?**

- **Pod**: smallest unit — wraps one or more containers. Ephemeral, not self-healing.
- **Deployment**: manages a desired number of pod replicas, handles rolling updates and rollbacks.
- **Service**: stable network endpoint for a set of pods. Pods come and go; the Service IP stays the same.

---

**Q: How does Kubernetes do a zero-downtime deployment?**

RollingUpdate strategy. Kubernetes starts new pods, waits for their readiness probe to pass, then terminates old pods one by one. With maxUnavailable: 0, there are always enough healthy pods running. kubectl rollout undo does an instant rollback.

---

**Q: What is a readiness probe vs a liveness probe?**

- **Readiness probe**: Is this pod ready to receive traffic? Failing = remove from Service load balancing (but don't restart).
- **Liveness probe**: Is this pod alive? Failing = restart the pod.

Both use the same mechanism (HTTP GET /health, TCP, exec command). Both are critical for production reliability.

---

## Scenario-Based Questions

**Q: "Your app is down. What do you do?"**

\`\`\`
1. Check UptimeRobot / monitoring — is it actually down?
2. Try curl https://yourdomain.com/health — what response?
3. Check recent deploys — did something change in the last hour?
4. ssh into server: docker ps (is container running?)
5. docker logs myapp -n 100 | grep -i error
6. check disk: df -h (disk full?)
7. check memory: free -h (OOM?)
8. If container crashed: docker logs myapp (last output before crash)
9. Rollback if a bad deploy caused it
10. After recovery: post-mortem to prevent recurrence
\`\`\`

**Q: "How would you set up CI/CD from scratch for a new project?"**

\`\`\`
1. Write Dockerfile and .dockerignore
2. Test Docker build locally: docker build + docker run
3. Create .github/workflows/ci.yml
   - Trigger: PR to main
   - Steps: lint + test + build
4. Enable branch protection: require CI to pass
5. Create .github/workflows/deploy.yml
   - Trigger: push to main (after CI)
   - Build Docker image → push to GHCR
   - Deploy to staging → health check
   - Manual approval → deploy to production
6. Set up secrets in repo Settings: SERVER_HOST, SSH_KEY, etc.
7. Set up monitoring: Sentry + UptimeRobot
\`\`\`

**Q: "A developer committed a database password to the public GitHub repo 10 minutes ago. What do you do?"**

\`\`\`
1. Immediately rotate the password at the database provider
2. Update all places that use the old password (app .env, CI secrets)
3. Remove from git history: git-filter-repo or BFG
4. Force push cleaned history
5. Check provider logs for unauthorized access in the last 10 minutes
6. Audit: which services could have used this credential?
7. Add a secret scanning step to CI to prevent this from happening again
\`\`\``,
    codeExamples: [
      {
        title: 'Common interview code questions — Docker and GitHub Actions',
        code: `// ─── QUESTION: Write a Dockerfile for a TypeScript Express API ───

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npm run build               # compiles TypeScript to dist/

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]

// ─── QUESTION: Write a GitHub Actions CI for a React app ───

name: CI
on:
  pull_request:
    branches: [main]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --run      # --run for Vitest (non-interactive)
      - run: npm run build

// ─── QUESTION: Write a docker-compose.yml for API + PostgreSQL ───

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5
volumes:
  pgdata:`,
        explanation: 'These are the three most common "write this" questions in DevOps interviews. Practice writing them from memory. The Dockerfile, CI workflow, and docker-compose.yml should be second nature.',
      },
    ],
    commonMistakes: [
      'Saying "I don\'t know" without explaining how you\'d find the answer — interviewers want to see your thinking process.',
      'Confusing docker stop (SIGTERM, graceful) with docker kill (SIGKILL, immediate).',
      'Saying CMD and ENTRYPOINT are the same — they\'re different and the difference matters.',
      'Forgetting that services in docker-compose communicate by service name, not localhost.',
      'Not mentioning rollback when asked about deployment strategies.',
    ],
    interviewQuestions: [
      {
        question: 'How would you debug a Docker container that keeps restarting?',
        answer: 'First, docker ps -a shows the container status and exit code. Then docker logs container_name -n 100 shows the last output before crash. Common causes: missing environment variable (NODE_ENV, DATABASE_URL undefined), database not reachable (check depends_on and healthcheck), application error on startup (port already in use, syntax error), or out of memory (docker stats). For a crash loop: docker run --rm container_name (removes --restart policy) to see the full output without it auto-restarting.',
        difficulty: 'intermediate',
      },
      {
        question: 'A team pushes 20 commits per day. How do you prevent broken code from reaching production?',
        answer: 'Three layers: (1) CI on every PR — lint, type check, tests, build must pass before a PR can merge. (2) Branch protection rule — require status checks to pass and require PR review. (3) CD with staging gate — auto-deploy to staging on merge to main, require manual approval to promote to production. Additionally: feature flags let you merge code to main without turning it on for users, enabling more frequent integration.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-18-1',
        title: 'Mock interview: scenario questions',
        description: 'Answer these scenario-based DevOps interview questions as if you were in a real interview. Write complete, structured answers.',
        starterCode: `// Scenario 1:
// You join a startup as a developer. They have no CI/CD, no Docker,
// and deploy by SSHing into the server and running git pull.
// They deploy twice a month. You suggest improving this.
// What would you propose, and in what order?

// Scenario 2:
// Your company's Node.js app is showing 5xx errors for 15% of requests.
// The last deploy was 2 hours ago. What is your investigation process?

// Scenario 3:
// A junior developer asks: "Why do we need Docker if the app works fine
// on my laptop without it?" How do you explain it?

// Answer each scenario:`,
        solution: `// Scenario 1: Proposing CI/CD to a startup
// Priority order (quick wins first):

// Week 1: Git hygiene + basic CI
// - Require PRs instead of direct pushes to main
// - Add GitHub Actions CI: npm test on every PR
// - Enable branch protection (require CI to pass)
// This alone catches most bugs before they ship.

// Week 2: Docker
// - Write Dockerfile for the app
// - Write docker-compose.yml for local dev (app + DB)
// - Benefit: "works on my machine" problems disappear

// Week 3: Automated staging
// - Add CD workflow: on merge to main, deploy to staging automatically
// - Staging = same docker image as prod, separate server
// - Team tests on staging before promoting

// Month 2: Production CD + monitoring
// - Add manual approval gate for production in GitHub Environments
// - Add Sentry for error tracking
// - Add UptimeRobot for uptime monitoring
// Cost: ~$0 additional. Time: 3-4 weeks. Risk reduction: massive.

// Scenario 2: Investigating 5xx errors after a deploy
// 1. Check monitoring: which endpoints are 5xx? (Sentry, Datadog)
// 2. Check recent deploy: git diff v_prev...v_current — what changed?
// 3. Check logs: docker logs myapp --since 2h | grep -i "error\|exception"
// 4. Check metrics: CPU, memory spike around deploy time?
// 5. Reproduce: curl failing endpoint with same params
// If it's clearly the deploy: rollback immediately (docker run myapp:prev)
// Then investigate in staging with the bad image

// Scenario 3: Explaining Docker to a junior developer
// "Your laptop runs macOS with Node 20. Production runs Ubuntu with Node 18.
// When you deploy: different OS behavior, different Node version, different
// environment variables. The app works on your machine but not in production.
//
// Docker packages your app with everything it needs: exact Node version,
// exact npm packages, exact configuration. The same package (image) runs
// on your laptop, in CI, in staging, and in production — identically.
//
// Also: new team member joins. Without Docker: spend 3 days setting up dev
// environment. With Docker: git clone + docker compose up = running in 2 min."`,
        hints: [
          'For scenario 1: frame improvements in terms of business value (less risk, faster delivery)',
          'For scenario 2: always check if recent changes caused it before diving deep',
          'For scenario 3: use concrete examples the junior dev can relate to',
        ],
      },
    ],
    keyTakeaways: [
      'Linux: chmod 755, lsof -i :PORT, grep -r, kill vs kill -9, journalctl.',
      'Docker: image=blueprint, container=running instance, exec -it for shell, logs -f for live logs.',
      'Dockerfile: package.json first → npm ci → source code. Multi-stage for production.',
      'GitHub Actions: on: pull_request + needs: for sequential jobs + secrets for credentials.',
      'CI/CD: CI on every PR, CD to staging automatically, production needs manual approval.',
      'Kubernetes: Deployment manages Pods, Service provides stable networking, rolling updates = zero downtime.',
    ],
    prevLesson: 'real-world-projects',
    nextLesson: 'devops-revision-hub',
  },

  // ─── LESSON 19 ────────────────────────────────────────────────────────────
  {
    id: 'devops-revision-hub',
    slug: 'devops-revision-hub',
    title: 'DevOps Revision Hub',
    description: 'Quick-reference cheat sheets for Linux, Docker, Dockerfile, Docker Compose, GitHub Actions, CI/CD, Kubernetes, and cloud basics — everything in one place.',
    category: 'Revision',
    order: 19,
    difficulty: 'beginner',
    estimatedTime: 20,
    content: `## How to Use This Lesson

Bookmark this lesson. Use it to:
- **Revise** before an interview
- **Look up** a command you forgot
- **Review** a concept quickly

Each cheat sheet below summarizes one area. For depth, go back to the dedicated lesson.

---

## Linux Cheat Sheet

\`\`\`bash
# Navigation
pwd               # where am I?
ls -la            # list all files with permissions
cd ~              # home directory
cd -              # previous directory

# Files
cp -r src/ dest/          # copy directory
mv file.txt /tmp/         # move/rename
rm -rf folder/            # delete (careful: no undo)
touch file.txt            # create empty file
mkdir -p a/b/c            # create nested directories

# View files
cat file.txt              # print entire file
tail -f app.log           # follow log in real time ← most useful
grep -r "ERROR" /var/log  # search recursively

# Permissions
chmod 755 script.sh       # rwxr-xr-x (executable)
chmod 644 config.txt      # rw-r--r-- (config file)
chmod 600 key.pem         # rw------- (SSH key)
chown user:group file.txt

# Processes
ps aux | grep node        # find process
kill 1234                 # SIGTERM (graceful)
kill -9 1234              # SIGKILL (force)
lsof -i :3000             # what's using port 3000?

# Services
systemctl start|stop|restart|status nginx
systemctl enable nginx    # start on boot
journalctl -u nginx -f    # follow service logs

# SSH
ssh -i key.pem user@ip
ssh-keygen -t ed25519 -C "email@example.com"
\`\`\`

---

## Docker Commands Cheat Sheet

\`\`\`bash
# Containers
docker run -d -p 3000:3000 --name myapp myimage:tag
docker run -it --rm ubuntu bash           # interactive, auto-remove
docker ps                                 # running containers
docker ps -a                              # all containers
docker stop myapp
docker rm myapp
docker rm -f myapp                        # stop + remove

# Inside containers
docker exec -it myapp bash                # shell inside container
docker logs myapp -f                      # follow logs
docker logs myapp -n 50                   # last 50 lines
docker stats                              # live CPU/memory
docker inspect myapp                      # full details

# Images
docker images
docker pull nginx:alpine
docker build -t myapp:1.0.0 .
docker push username/myapp:1.0.0
docker rmi myapp:1.0.0
docker image prune                        # remove dangling images

# Cleanup
docker system prune                       # remove stopped containers + dangling images
docker system prune -a                    # remove all unused
\`\`\`

---

## Dockerfile Cheat Sheet

\`\`\`dockerfile
FROM node:20-alpine           # base image (always pin version)
WORKDIR /app                  # set working directory
COPY package*.json ./         # copy package files FIRST (layer cache)
RUN npm ci --only=production  # install deps (cached if package.json unchanged)
COPY . .                      # copy source AFTER deps
ENV NODE_ENV=production       # environment variable
EXPOSE 3000                   # documentation only (does NOT publish port)
USER nonroot                  # never run as root
CMD ["node", "server.js"]     # exec form (not shell form)
ENTRYPOINT ["dumb-init", "--"] # proper signal handling
\`\`\`

**Layer caching rule:** Put what changes LEAST at the top, what changes MOST at the bottom.

**Multi-stage build pattern:**
\`\`\`dockerfile
FROM node:20-alpine AS builder
RUN npm ci && npm run build

FROM node:20-alpine AS production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
\`\`\`

**.dockerignore (always add):**
\`\`\`
node_modules
.env
.git
*.log
dist
.next
\`\`\`

---

## Docker Compose Cheat Sheet

\`\`\`yaml
services:
  api:
    build: .                          # build from Dockerfile
    ports:
      - "3000:3000"                   # host:container
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
    env_file:
      - .env                          # load from .env file
    depends_on:
      db:
        condition: service_healthy    # wait for DB ready
    restart: unless-stopped
    volumes:
      - ./src:/app/src                # bind mount (dev hot reload)

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data  # named volume (persists data)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

volumes:
  pgdata:
\`\`\`

**Commands:**
\`\`\`bash
docker compose up -d              # start all (background)
docker compose up -d --build      # rebuild images then start
docker compose down               # stop + remove containers
docker compose down -v            # also delete volumes (loses data!)
docker compose logs -f api        # follow logs for "api" service
docker compose exec db psql -U postgres  # exec into service
docker compose ps                 # status of all services
\`\`\`

**Key rule:** Services talk to each other using **service names** as hostnames, not localhost.

---

## GitHub Actions Cheat Sheet

\`\`\`yaml
name: CI

on:                               # triggers
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 8 * * 1'          # every Monday 8am UTC
  workflow_dispatch:              # manual trigger

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'            # cache ~/.npm
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}

  deploy:
    needs: build                  # waits for build to pass
    if: github.ref == 'refs/heads/main'
    environment: production       # requires manual approval
    steps:
      - run: ./deploy.sh
\`\`\`

**Built-in variables:**
\`\`\`
\${{ github.sha }}          # commit SHA
\${{ github.actor }}        # who triggered
\${{ github.repository }}   # owner/repo
\${{ secrets.MY_SECRET }}   # encrypted secret
\${{ vars.MY_VAR }}         # non-secret variable
\`\`\`

---

## CI/CD Cheat Sheet

**CI (Continuous Integration):**
- Runs on every commit/PR
- Steps: lint → type-check → test → build
- Goal: the main branch is always working

**CD (Continuous Delivery):**
- Runs on merge to main (after CI passes)
- Auto-deploys to staging
- Manual approval for production

**Continuous Deployment:**
- Every passing commit goes directly to production
- Requires high test coverage + monitoring

**Pipeline pattern:**
\`\`\`
PR created → CI (test) → PR merged to main → CD (build image → staging) → approval → production
\`\`\`

**Rollback:**
\`\`\`bash
# Docker: redeploy previous image tag
docker run myapp:v1.2.2

# Kubernetes: instant rollback
kubectl rollout undo deployment/myapp
\`\`\`

---

## Kubernetes Cheat Sheet

**Key resources:**
| Resource | Purpose |
|----------|---------|
| Pod | Runs containers (smallest unit) |
| Deployment | Manages desired number of pod replicas |
| Service | Stable network endpoint for pods |
| Ingress | Routes external traffic to services |
| ConfigMap | Non-sensitive config |
| Secret | Sensitive values (encrypted at rest) |
| Namespace | Virtual cluster for isolation |

**kubectl commands:**
\`\`\`bash
kubectl apply -f file.yaml           # create/update resources
kubectl get pods                     # list pods
kubectl get all                      # list everything
kubectl describe pod pod-name        # detailed info + events
kubectl logs pod-name -f             # follow logs
kubectl exec -it pod-name -- bash    # shell into pod
kubectl scale deployment myapp --replicas=5
kubectl set image deployment/myapp myapp=myapp:2.0.0
kubectl rollout undo deployment/myapp
kubectl delete -f file.yaml
\`\`\`

**Minimal Deployment + Service:**
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
\`\`\`

---

## Cloud Basics Cheat Sheet

| Concept | What it means |
|---------|--------------|
| IaaS | Raw VMs — you manage the OS (AWS EC2, DigitalOcean) |
| PaaS | Deploy code — provider runs it (Vercel, Railway, Render) |
| SaaS | Managed services you use via API (Supabase, MongoDB Atlas) |
| Region | Geographic location (us-east-1, eu-west-1) |
| AZ | Physically separate data center within a region |
| CDN | Serves static files from edge nodes near users |

**Developer-first cloud choices:**
- Frontend: Vercel
- Backend: Railway or Render
- Database: Supabase (PostgreSQL) or MongoDB Atlas
- Files: Cloudflare R2 or AWS S3
- Monitoring: Sentry + UptimeRobot

---

## DevOps Interview Quick Reference

**Most important concepts to know:**
1. Docker: image vs container, layer caching, multi-stage builds
2. Dockerfile: FROM → WORKDIR → COPY package.json → RUN npm ci → COPY . → CMD
3. Docker Compose: services, volumes, depends_on, service names as hostnames
4. GitHub Actions: on:, jobs:, steps:, needs:, secrets, environment protection
5. CI/CD: CI on every PR, staging on merge, manual approval for production
6. Linux: chmod 755/644, grep -r, tail -f, kill vs kill -9, lsof -i :PORT
7. Kubernetes: Pod → Deployment → Service, rolling updates, readiness probes
8. Security: env vars for secrets, non-root containers, HTTPS everywhere, firewall

**Questions you will definitely be asked:**
- "What is Docker and why do we use it?" (containers vs VMs)
- "How do you deploy your applications?" (walk through the pipeline)
- "What is CI/CD?" (continuous integration + continuous delivery)
- "What happens if a production deploy breaks?" (rollback strategy)
- "How do you manage secrets?" (env vars, never in code)`,
    codeExamples: [
      {
        title: 'DevOps in 5 commands — the essential workflow',
        code: `# 1. Build your Docker image
docker build -t myapp:$(git rev-parse --short HEAD) .
# Tags the image with the short git commit SHA

# 2. Test it locally
docker run -d -p 3000:3000 --name test-myapp myapp:abc1234
curl http://localhost:3000/health
docker rm -f test-myapp

# 3. Push to registry
docker push ghcr.io/myusername/myapp:abc1234

# 4. Deploy to server
ssh ubuntu@myserver.com \
  "docker pull ghcr.io/myusername/myapp:abc1234 && \
   docker stop myapp && docker rm myapp && \
   docker run -d --name myapp --restart unless-stopped \
     -p 3000:3000 --env-file /app/.env \
     ghcr.io/myusername/myapp:abc1234"

# 5. Verify
curl https://myapp.com/health
# {"status":"ok"}

# Everything above = what GitHub Actions automates for you.
# Automate steps 1-5 in a workflow, and you have a CD pipeline.`,
        explanation: 'These 5 steps are the manual version of what every CD pipeline does. Understanding the manual process first makes the GitHub Actions YAML make complete sense.',
      },
    ],
    commonMistakes: [
      'Trying to memorize commands without understanding why — understand the concept, the command will follow.',
      'Skipping practice — reading cheat sheets is not the same as writing a Dockerfile from scratch.',
      'Not knowing when NOT to use something — Kubernetes for a personal blog is overkill. Know the right tool for the right scale.',
      'Forgetting that docker-compose down -v deletes all data in volumes — always double-check before running.',
    ],
    interviewQuestions: [
      {
        question: 'Explain the full journey of code from a developer\'s laptop to production.',
        answer: 'Developer writes code → pushes to GitHub → GitHub Actions CI runs (lint, test, build) → if all pass, PR is merged to main → CD pipeline triggers: build Docker image tagged with git SHA → push to container registry → auto-deploy to staging (SSH into server, pull image, restart container, verify /health) → notify team → manual approval in GitHub → deploy same image to production → verify health → monitor with Sentry and uptime tools. The key insight: the same Docker image goes from CI → staging → production with no rebuild.',
        difficulty: 'intermediate',
      },
      {
        question: 'What are the most important DevOps practices for a 5-person startup?',
        answer: 'In priority order: (1) CI on every PR — automated testing catches bugs before merge. (2) Docker — eliminates "works on my machine" and enables consistent deployments. (3) Staging environment — test before going live. (4) Monitoring — Sentry for errors, UptimeRobot for uptime. (5) Secrets management — never in code, use environment variables. These five practices alone dramatically improve reliability and developer confidence without requiring a dedicated DevOps team.',
        difficulty: 'intermediate',
      },
    ],
    exercises: [
      {
        id: 'devops-ex-19-1',
        title: 'Self-assessment: DevOps knowledge check',
        description: 'Rate your understanding of each topic and identify what to revisit before an interview.',
        starterCode: `// Rate each topic: 1 (need to study) | 2 (understand it) | 3 (can explain it confidently)

// Linux:
// - File permissions and chmod         → Rating: ___
// - Finding processes and ports        → Rating: ___
// - Searching with grep                → Rating: ___
// - SSH and key-based auth             → Rating: ___
// - tail -f for log monitoring         → Rating: ___

// Docker:
// - Image vs container                 → Rating: ___
// - Layer caching in Dockerfile        → Rating: ___
// - Multi-stage builds                 → Rating: ___
// - docker exec and docker logs        → Rating: ___
// - Docker Compose services/volumes    → Rating: ___

// CI/CD:
// - What CI does and why               → Rating: ___
// - GitHub Actions workflow structure  → Rating: ___
// - needs: and sequential jobs         → Rating: ___
// - Secrets management                 → Rating: ___
// - Staging vs production environments → Rating: ___

// Cloud:
// - IaaS vs PaaS vs SaaS              → Rating: ___
// - Regions and availability zones     → Rating: ___
// - When to use Railway vs a VPS       → Rating: ___

// Kubernetes:
// - Pod vs Deployment vs Service       → Rating: ___
// - Rolling updates and rollback       → Rating: ___
// - Readiness vs liveness probes       → Rating: ___

// For any topic rated 1 or 2: go back to that lesson and do the exercises.`,
        solution: `// There is no single correct answer — this is a self-assessment tool.

// If you rated anything 1:
// → Re-read the lesson, then try to write the concept from scratch
// → Practice the exercise in that lesson

// If you rated anything 2:
// → You understand it but haven't internalized it
// → Teach it: explain it to someone else (or write a summary)
// → Do one small project using that concept

// If everything is 3:
// → You're ready for junior-to-mid level DevOps interview questions
// → Practice the scenario questions from Lesson 18
// → Build the Project from Lesson 17 end-to-end

// The most important 3s to have:
// ✓ Can explain Docker image vs container clearly
// ✓ Can write a Dockerfile with correct layer caching
// ✓ Can write a GitHub Actions CI workflow from memory
// ✓ Know what to do when production breaks (rollback + investigation)
// ✓ Can explain CI vs CD vs Continuous Deployment`,
        hints: [
          'Be honest with yourself — 2s require action before an interview',
          'Teaching a concept to someone else is the fastest way to find gaps',
          'Build the Project 9 from Lesson 17 to combine all concepts',
        ],
      },
    ],
    keyTakeaways: [
      'Bookmark this lesson — use it the night before an interview or when you forget a command.',
      'The 5-command DevOps workflow: build → test → push → deploy → verify.',
      'Layer caching: package.json first, then npm ci, then source code — always.',
      'Services in Docker Compose talk by service name. Pods in K8s talk by Service name.',
      'Secrets in environment variables. Non-root in containers. HTTPS in production. Firewall closed.',
      'When things break: check logs first, check recent deploys second, rollback third.',
    ],
    prevLesson: 'devops-interview-prep',
  },
];
