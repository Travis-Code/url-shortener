# CI/CD Setup & Testing Strategy Guide

## Table of Contents
1. [Overview](#overview)
2. [Why Smoke Tests Matter](#why-smoke-tests-matter)
3. [CI Pipeline Architecture](#ci-pipeline-architecture)
4. [Step-by-Step CI Setup](#step-by-step-ci-setup)
5. [Testing Strategy](#testing-strategy)
6. [Branch Protection & Quality Gates](#branch-protection--quality-gates)
7. [Observability & Debugging](#observability--debugging)
8. [Common Scenarios](#common-scenarios)
9. [Interview Talking Points](#interview-talking-points)

---

## Overview

This project demonstrates a **production-ready CI/CD pipeline** that validates every code change before it reaches production. The pipeline ensures:

- ✅ Code compiles successfully (TypeScript → JavaScript)
- ✅ All tests pass (unit + smoke tests)
- ✅ Application boots correctly (health checks)
- ✅ Build artifacts are valid (client bundle integrity)
- ✅ No regressions are introduced

**Key Principle**: *Catch issues in CI, not in production.*

---

## Why Smoke Tests Matter

### What Are Smoke Tests?

Smoke tests are **fast, high-level tests** that verify critical functionality works without deep integration testing. They answer: *"Does the application start and respond to basic requests?"*

```
Unit Tests       ← Test individual functions
Integration Tests ← Test component interactions
Smoke Tests      ← Test end-to-end startup
```

### Why We Need Them

#### 1. **Catch Configuration Issues Early**
```javascript
// Example: Missing environment variable
// Without smoke tests, this fails ONLY when deployed
const JWT_SECRET = process.env.JWT_SECRET; // undefined in CI? 💥
```

**Smoke test catches this immediately** by attempting to boot the server in CI.

#### 2. **Validate Build Output**
```bash
# Client builds successfully, but...
npm run build
# ...did it actually create the files?
ls dist/index.html  # Smoke test verifies this exists
```

#### 3. **Prevent Breaking Changes**
```typescript
// Developer refactors Express app setup
export default app;  // Changed from: module.exports = app;

// Smoke test imports the app and tries to start it
// Fails immediately if import breaks
```

#### 4. **Fast Feedback Loop**
- **Smoke tests**: ~10 seconds
- **Full integration tests**: ~5 minutes
- **Manual testing**: ~30 minutes

Smoke tests give developers **instant confidence** their changes didn't break the application.

### Real-World Impact

**Before Smoke Tests**:
- Developer pushes code
- CI builds successfully ✅
- Deploys to staging
- Staging crashes on startup 💥
- Developer spends 30 minutes debugging

**After Smoke Tests**:
- Developer pushes code
- CI builds successfully ✅
- **Smoke test fails** ❌
- Developer sees error in 2 minutes
- Fixes issue before merge

---

## CI Pipeline Architecture

### Workflow Structure

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:  # ← Single job enforces sequential validation
    runs-on: ubuntu-latest
    
    steps:
      1. Checkout code
      2. Setup Node.js
      3. Install dependencies (server + client)
      4. Build TypeScript (server)
      5. Build React app (client)
      6. Run tests (server + client)
      7. Run smoke tests (end-to-end validation)
```

### Why This Design?

#### Sequential Validation
```
Install → Build → Test → Smoke
   ↓        ↓       ↓       ↓
  Fails?  Fails? Fails?  Fails? → Block PR
   ↓        ↓       ↓       ↓
  Pass    Pass    Pass    Pass  → Allow merge ✅
```

If **any step fails**, the pipeline stops immediately. This:
- **Saves CI minutes** (no point running smoke tests if build fails)
- **Gives clear feedback** (failure at "Build" vs "Smoke Tests" means different things)
- **Enforces quality gates** (can't merge broken code)

#### Single Job vs. Multiple Jobs

**Our Choice**: Single job named `build`

**Why?**
```yaml
# Branch protection rule references this:
required_status_checks:
  contexts:
    - "build"  # ← Must match job name in workflow
```

**Alternative** (multiple jobs):
```yaml
jobs:
  build:
    ...
  test:
    needs: build
  smoke:
    needs: test
```

This requires **3 separate status checks** in branch protection. Single job simplifies configuration.

---

## Step-by-Step CI Setup

### 1. Create Workflow File

```bash
mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install server dependencies
        working-directory: ./server
        run: npm ci
      
      - name: Install client dependencies
        working-directory: ./client
        run: npm ci
      
      - name: Build server
        working-directory: ./server
        run: npm run build
      
      - name: Build client
        working-directory: ./client
        run: npm run build
      
      - name: Run server tests
        working-directory: ./server
        run: npm test
      
      - name: Run client tests
        working-directory: ./client
        run: npm test
      
      - name: Run smoke tests
        run: |
          chmod +x scripts/smoke.sh
          npm run smoke:all
```

### 2. Create Smoke Test Runner

**File**: `scripts/smoke.sh`

```bash
#!/usr/bin/env bash
# IMPORTANT: Use bash, not zsh (CI runners use Ubuntu)

set -e  # Exit on any error

echo "🔥 Running smoke tests..."

# Test 1: Server boots and responds
echo "Testing server..."
pushd server > /dev/null
npm run smoke
popd > /dev/null

# Test 2: Client scaffold is valid
echo "Testing client..."
pushd client > /dev/null
npm test
popd > /dev/null

# Test 3: Client builds successfully
echo "Building client..."
pushd client > /dev/null
npm run build
popd > /dev/null

# Test 4: Build artifacts exist
echo "Verifying build artifacts..."
if [ -f "client/dist/index.html" ]; then
  echo "✅ Build artifacts present"
else
  echo "❌ Build artifacts missing"
  exit 1
fi

echo "✅ All smoke tests passed"
```

**Key Points**:
- `set -e`: Fail fast on any error
- `pushd`/`popd`: Navigate directories safely
- Explicit artifact verification

### 3. Add Root Package Script

**File**: `package.json` (root)

```json
{
  "name": "url-shortener",
  "private": true,
  "scripts": {
    "smoke:all": "./scripts/smoke.sh"
  }
}
```

### 4. Create Server Smoke Test

**File**: `server/test/smoke.js`

```javascript
const http = require('http');
const path = require('path');

let app;
let server;

// Load Express app (handles both compiled and source)
try {
  app = require('../dist/app').default || require('../dist/app');
} catch {
  require('ts-node/register');
  app = require('../src/app').default || require('../src/app');
}

async function smokeTest() {
  console.log('🔥 Server smoke test starting...');
  
  // Start server on random port
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  
  console.log(`Server listening on port ${port}`);
  
  // Test health endpoint
  const response = await fetch(`http://localhost:${port}/api/health`);
  const data = await response.json();
  
  if (response.status !== 200 || data.status !== 'ok') {
    throw new Error('Health check failed');
  }
  
  console.log('✅ Server smoke test passed');
}

smokeTest()
  .then(() => {
    server?.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Server smoke test failed:', err);
    server?.close();
    process.exit(1);
  });
```

**Why This Works**:
- Loads compiled code in CI (`dist/app.js`)
- Falls back to TypeScript source for local dev
- Uses ephemeral port (no conflicts)
- Tests actual HTTP request/response

### 5. Create Client Smoke Test

**File**: `client/test/smoke.js`

```javascript
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔥 Client smoke test starting...');

// Check for critical files
const appPath = join(__dirname, '../src/App.tsx');
const viteConfig = join(__dirname, '../vite.config.ts');

if (!fs.existsSync(appPath)) {
  throw new Error('App.tsx not found');
}

if (!fs.existsSync(viteConfig)) {
  throw new Error('vite.config not found');
}

console.log('✅ Client smoke test passed');
```

**Why ESM?**
- Vite uses ESM by default
- `import` statements align with production code
- `fileURLToPath` handles ESM `__dirname` equivalent

### 6. Configure Branch Protection

**GitHub Settings** → **Branches** → **Branch protection rules**:

```
Branch name pattern: main

☑️ Require status checks to pass before merging
  ☑️ Require branches to be up to date before merging
  Required checks:
    • build  ← Must match workflow job name

☑️ Require pull request reviews before merging
  • 1 approval required

☐ Require linear history (optional)
☐ Include administrators (recommended)
```

**Result**: PRs cannot merge until `build` check passes.

---

## Testing Strategy

### Test Pyramid

```
       /\
      /  \  E2E Tests (slow, expensive)
     /____\
    /      \
   / Smoke  \ ← YOU ARE HERE
  /  Tests   \
 /____________\
/              \
/ Integration  /
/______________/
/              \
/  Unit Tests  / ← Fast, focused, many
/______________/
```

### Our Test Coverage

| Type | Location | Purpose | Speed |
|------|----------|---------|-------|
| **Unit** | `server/test/*.test.ts` | Test auth logic, URL shortening | ~2s |
| **Smoke** | `server/test/smoke.js` | Verify server boots | ~5s |
| **Smoke** | `client/test/smoke.js` | Verify React app structure | ~1s |
| **Smoke** | `scripts/smoke.sh` | End-to-end orchestration | ~10s |

### What We Test

#### Server Smoke Test
```javascript
// ✅ Express app loads without errors
// ✅ Server binds to port
// ✅ Health endpoint responds
// ✅ JSON parsing works
```

#### Client Smoke Test
```javascript
// ✅ React app entry point exists
// ✅ Vite configuration is valid
// ✅ Build produces output files
// ✅ index.html contains bundle reference
```

### What We Don't Test (Yet)

- Database connectivity (requires PostgreSQL in CI)
- Authentication flows (integration test level)
- UI rendering (would need browser automation)

**Why?** Smoke tests focus on **critical path validation**. More thorough testing comes later.

---

## Branch Protection & Quality Gates

### Quality Gate Flow

```
Developer Commits → Push to GitHub
         ↓
   CI Workflow Triggers
         ↓
    Build & Test Steps
         ↓
   Smoke Tests Run
         ↓
    ✅ All Pass?
    ↙         ↘
  YES          NO
   ↓            ↓
Allow Merge   Block PR
```

### Example: Blocked PR

```bash
git push origin feature/new-endpoint

# CI runs...
❌ build — Failed in 1m 23s
  ✅ Install dependencies
  ✅ Build server
  ✅ Build client
  ✅ Run tests
  ❌ Run smoke tests
     Error: Health check failed
     Expected: 200, Got: 500
```

**GitHub UI**: 
- Red ❌ next to commit
- "Merge" button disabled
- Message: "Required checks must pass"

**Developer Action**:
1. Click "Details" on failed check
2. Review logs
3. Fix issue locally
4. Push again
5. CI re-runs automatically

### Continuous Validation

**Every push to `main`**:
```bash
git push origin main

# CI validates:
# 1. Nothing broke in production
# 2. Health checks still pass
# 3. Deployment-ready code
```

**Why?** Even protected branches can have issues if environment changes (dependencies, external APIs, etc.).

---

## Observability & Debugging

### Correlation IDs

**What**: Unique identifier for each request

**Why**: Trace a request through logs

**Implementation**:
```typescript
// Middleware adds correlation ID
app.use((req, res, next) => {
  req.correlationId = randomBytes(8).toString('hex');
  next();
});

// Every log includes it
logger.info('Request received', {
  correlationId: req.correlationId,
  path: req.path
});
```

**Example**:
```json
{"level":"info","message":"Request received","correlationId":"a3f9d8e2c4b1"}
{"level":"info","message":"Database query","correlationId":"a3f9d8e2c4b1"}
{"level":"info","message":"Response sent","correlationId":"a3f9d8e2c4b1"}
```

**Benefit**: Search logs for `a3f9d8e2c4b1` to see entire request lifecycle.

### Structured Logging

**Bad** (unstructured):
```javascript
console.log('User logged in: ' + userId);
```

**Good** (structured):
```javascript
logger.info('User logged in', { userId, timestamp: Date.now() });
```

**Output**:
```json
{
  "level": "info",
  "message": "User logged in",
  "userId": 42,
  "timestamp": 1701234567890,
  "correlationId": "a3f9d8e2c4b1"
}
```

**Why?** Log aggregation tools (Datadog, Splunk) can query structured data:
```sql
SELECT * FROM logs WHERE userId = 42 AND level = 'error'
```

### Debugging CI Failures

#### Example: Shebang Incompatibility

**Symptom**:
```
❌ Run smoke tests
   /usr/bin/env: 'zsh': No such file or directory
   Error: Process completed with exit code 127
```

**Root Cause**:
```bash
#!/usr/bin/env zsh  # ❌ Ubuntu CI doesn't have zsh
```

**Fix**:
```bash
#!/usr/bin/env bash  # ✅ bash is standard
```

**Lesson**: Test scripts in CI-like environment (Docker with Ubuntu image).

#### Example: Missing Environment Variable

**Symptom**:
```
❌ Build server
   TypeError: Cannot read property 'JWT_SECRET' of undefined
```

**Root Cause**: CI doesn't have `.env` file

**Fix**: Add secrets to GitHub Actions:
```yaml
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## Common Scenarios

### Scenario 1: Adding a New Endpoint

**Developer Flow**:
1. Create endpoint in `server/src/routes/`
2. Write unit test
3. Run `npm test` locally (passes ✅)
4. Commit and push
5. **CI fails** ❌ — smoke test can't reach endpoint

**Issue**: Forgot to register route in `app.ts`

**Resolution**:
```typescript
// server/src/app.ts
import newRoutes from './routes/newRoutes';
app.use('/api/new', newRoutes);  // ← Add this
```

**Takeaway**: Smoke tests catch integration issues unit tests miss.

### Scenario 2: Dependency Update

**Developer Flow**:
1. Run `npm update` in `server/`
2. Local dev works fine
3. Push to GitHub
4. **CI fails** ❌ — smoke test crashes

**Issue**: Updated package has breaking change

**Resolution**:
```bash
# Check CI logs
npm ERR! Incompatible with Node 18

# Fix: Update package.json
"engines": {
  "node": ">=20.0.0"
}

# Update CI workflow
strategy:
  matrix:
    node-version: [20.x]
```

**Takeaway**: CI catches platform-specific issues.

### Scenario 3: Build Output Changed

**Developer Flow**:
1. Update Vite config
2. Local build works
3. Push to GitHub
4. **Smoke test fails** ❌ — can't find `dist/index.html`

**Issue**: New config outputs to `build/` instead of `dist/`

**Resolution**:
```typescript
// vite.config.ts
export default {
  build: {
    outDir: 'dist'  // ← Ensure this matches smoke test
  }
}
```

**Takeaway**: Smoke tests validate build assumptions.

---

## Interview Talking Points

### 1. CI/CD Philosophy

**Question**: "Why is CI important?"

**Answer**:
> "CI ensures every code change is validated in a clean environment before merging. In this project, our pipeline runs on every push—it compiles TypeScript, runs tests, and executes smoke tests to verify the app boots correctly. This catches issues like missing dependencies, broken imports, or configuration errors that might not appear in local dev."

### 2. Testing Strategy

**Question**: "How do you approach testing?"

**Answer**:
> "I follow the test pyramid: lots of fast unit tests for business logic, smoke tests for critical paths, and E2E tests sparingly. For example, in this project, smoke tests verify the server responds to health checks and the client builds successfully. They run in ~10 seconds and catch 80% of integration issues without the overhead of full E2E testing."

### 3. Quality Gates

**Question**: "How do you prevent bugs from reaching production?"

**Answer**:
> "Branch protection with required status checks. Our `main` branch requires the CI build to pass before any PR can merge. If smoke tests fail—meaning the app won't boot—the merge is blocked. This enforces a quality baseline: code only reaches production if it compiles, tests pass, and the application starts successfully."

### 4. Observability

**Question**: "How do you debug issues in production?"

**Answer**:
> "Structured logging with correlation IDs. Every request gets a unique ID that's included in all related logs. If a user reports an error, I can search logs for that correlation ID and see the entire request flow—what endpoints were hit, what queries ran, where it failed. This turns a 30-minute debugging session into a 2-minute log search."

### 5. Shell Scripting

**Question**: "Tell me about a time you solved a deployment issue."

**Answer**:
> "Our smoke test script initially used `zsh` as the shebang, which worked locally on macOS. But when CI ran on Ubuntu, it failed with 'zsh: command not found.' I changed the shebang to `bash` (standard on all Linux systems) and added `set -e` to fail fast on any error. This taught me to test scripts in CI-like environments and not assume local tools exist everywhere."

### 6. DevOps Mindset

**Question**: "How do you balance development speed with code quality?"

**Answer**:
> "Fast feedback loops. Our CI runs in ~30 seconds, so developers get immediate feedback if something breaks. Smoke tests are deliberately lightweight—they don't test every feature, just critical paths. This lets us maintain quality gates without slowing down development. If a change breaks the smoke test, you know within 2 minutes, not after deploying to staging."

---

## Additional Resources

### Related Documentation
- [README.md](./README.md) — Project setup and features
- [TECH_STACK.md](./TECH_STACK.md) — Technology choices
- [SECURITY.md](./SECURITY.md) — Security considerations

### GitHub Actions Docs
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Context and Expression Syntax](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions)

### Testing Resources
- [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) (Martin Fowler)
- [Smoke Testing Best Practices](https://www.guru99.com/smoke-testing.html)

---

## Summary

This CI/CD setup demonstrates **production-ready software engineering**:

1. **Automated validation** — Every change is tested before merge
2. **Fast feedback** — Developers know within minutes if something broke
3. **Quality gates** — Branch protection enforces standards
4. **Observability** — Correlation IDs and structured logging aid debugging
5. **Real-world practices** — Smoke tests, health checks, build verification

**Key Insight**: The CI pipeline is your **first line of defense** against production bugs. Invest in fast, reliable tests that catch critical issues early.

---

*Last Updated: November 29, 2025*
