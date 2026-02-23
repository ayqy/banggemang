import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sh(cmd, options = {}) {
  const out = execSync(cmd, {
    cwd: options.cwd || REPO_ROOT,
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe']
  });
  if (out === null || out === undefined) return '';
  return String(out).trim();
}

function shOk(cmd, options = {}) {
  try {
    sh(cmd, options);
    return true;
  } catch {
    return false;
  }
}

function listRemoteBranches() {
  const out = sh('git for-each-ref --format="%(refname:short)" refs/remotes/origin');
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(
      (s) =>
        s !== 'origin/HEAD' &&
        s !== 'origin/main' &&
        s !== 'origin/benchmark' &&
        s !== 'origin/task'
    )
    .map((s) => s.replace(/^origin\//, ''));
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeDirName(branchName) {
  return branchName.replace(/[^a-zA-Z0-9._-]+/g, '_');
}

function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml; charset=utf-8';
    case '.ico':
      return 'image/x-icon';
    case '.woff2':
      return 'font/woff2';
    case '.woff':
      return 'font/woff';
    case '.ttf':
      return 'font/ttf';
    default:
      return 'application/octet-stream';
  }
}

function startStaticServer(rootDir) {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      let reqPath = decodeURIComponent(url.pathname);

      if (reqPath === '/' || reqPath.endsWith('/')) reqPath = path.posix.join(reqPath, 'index.html');

      // Prevent path traversal.
      const absPath = path.resolve(rootDir, '.' + reqPath);
      if (!absPath.startsWith(path.resolve(rootDir))) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
      }

      if (!fs.existsSync(absPath) || !fs.statSync(absPath).isFile()) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', mimeType(absPath));
      fs.createReadStream(absPath).pipe(res);
    } catch (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') return reject(new Error('Failed to get server address'));
      const baseURL = `http://127.0.0.1:${addr.port}`;
      resolve({
        baseURL,
        close: () =>
          new Promise((r) => {
            server.close(() => r());
          })
      });
    });
  });
}

function flattenPlaywrightJson(json) {
  const cases = [];

  function walkSuite(suite) {
    for (const s of suite.suites || []) walkSuite(s);

    // Playwright JSON reporter groups actual tests under suite.specs[*].tests[*].results[*].
    for (const spec of suite.specs || []) {
      const tests = spec.tests || [];

      let finalStatus = 'unknown';
      let error = '';

      if (tests.length === 0) {
        finalStatus = spec.ok ? 'passed' : 'failed';
      } else {
        // Aggregate across projects/retries: fail if any failed, else skip if all skipped, else pass.
        let sawFail = false;
        let sawPass = false;
        let sawSkip = false;

        for (const t of tests) {
          const results = t.results || [];
          const last = results[results.length - 1] || {};
          const status = last.status || t.status || 'unknown';

          if (status === 'passed') sawPass = true;
          else if (status === 'skipped') sawSkip = true;
          else {
            sawFail = true;
            if (!error) error = last.error?.message || last.errors?.[0]?.message || '';
          }
        }

        if (sawFail) finalStatus = 'failed';
        else if (sawPass) finalStatus = 'passed';
        else if (sawSkip) finalStatus = 'skipped';
        else finalStatus = 'unknown';
      }

      cases.push({
        title: spec.title || '',
        status: finalStatus,
        error
      });
    }
  }

  for (const s of json.suites || []) walkSuite(s);
  return cases.filter((c) => c.title);
}

function shortError(msg) {
  if (!msg) return '';
  return String(msg)
    .replace(/\x1b\[[0-9;]*m/g, '') // strip ANSI color codes
    .replace(/\s+/g, ' ')
    .slice(0, 160);
}

function routeIdFromTitle(title) {
  const t = String(title || '');
  const idx = t.indexOf(':');
  if (idx <= 0) return 'misc';
  return t.slice(0, idx);
}

function computeScoreByRoute(cases) {
  const routes = new Map();
  for (const c of cases) {
    const routeId = routeIdFromTitle(c.title);
    if (!routes.has(routeId)) routes.set(routeId, { passed: 0, total: 0 });
    const r = routes.get(routeId);
    r.total += 1;
    if (c.status === 'passed') r.passed += 1;
  }

  const routeEntries = Array.from(routes.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const routeRates = routeEntries.map(([routeId, r]) => ({
    routeId,
    passed: r.passed,
    total: r.total,
    rate: r.total ? r.passed / r.total : 0
  }));

  const routeCount = routeRates.length || 1;
  const avgRate =
    routeRates.reduce((sum, r) => sum + r.rate, 0) / routeCount;

  const score = Math.round(avgRate * 100);
  const passedRoutes = routeRates.filter((r) => r.passed === r.total && r.total > 0).length;

  return {
    score,
    routes: routeRates,
    passedRoutes,
    totalRoutes: routeCount
  };
}

function renderReadme({ branchName, score, passedCases, totalCases, passedRoutes, totalRoutes, cases }) {
  const lines = [];
  lines.push('# 自动测评评分');
  lines.push('');
  lines.push(`分支：${branchName}`);
  lines.push(`总分：${score}/100`);
  lines.push(`路由通过：${passedRoutes}/${totalRoutes}`);
  lines.push(`用例通过：${passedCases}/${totalCases}`);
  lines.push('');
  lines.push('| Route | Case | 结果 | 备注 |');
  lines.push('| --- | --- | --- | --- |');

  for (const c of cases) {
    const ok = c.status === 'passed';
    const result = ok ? 'PASS' : c.status === 'skipped' ? 'SKIP' : 'FAILED';
    const note = ok ? '' : shortError(c.error);
    lines.push(`| ${routeIdFromTitle(c.title)} | ${c.title} | ${result} | ${note} |`);
  }

  lines.push('');
  return lines.join('\n');
}

async function runPlaywright({ baseURL, branchName }) {
  const bin = path.join(REPO_ROOT, 'node_modules', '.bin', 'playwright');
  const args = ['test', '--config=playwright.config.cjs', '--reporter=json'];

  const env = {
    ...process.env,
    BASE_URL: baseURL,
    TARGET_BRANCH: branchName
  };

  const maxBytes = 100 * 1024 * 1024;

  const proc = spawn(bin, args, {
    cwd: REPO_ROOT,
    env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let stdout = '';
  let stderr = '';

  proc.stdout.setEncoding('utf8');
  proc.stderr.setEncoding('utf8');

  proc.stdout.on('data', (chunk) => {
    stdout += chunk;
    if (stdout.length > maxBytes) proc.kill('SIGKILL');
  });

  proc.stderr.on('data', (chunk) => {
    stderr += chunk;
    if (stderr.length > maxBytes) proc.kill('SIGKILL');
  });

  const { exitCode, signal } = await new Promise((resolve) => {
    proc.on('close', (code, sig) => resolve({ exitCode: code, signal: sig }));
  });

  stdout = stdout.trim();
  stderr = stderr.trim();

  if (!stdout) {
    return {
      exitCode: exitCode ?? 1,
      rawStdout: stdout,
      rawStderr: stderr,
      cases: [
        {
          title: 'runner:json-output',
          status: 'failed',
          error: stderr || (signal ? `Playwright killed by signal ${signal}` : 'No JSON output from Playwright')
        }
      ]
    };
  }

  try {
    const json = JSON.parse(stdout);
    return {
      exitCode: exitCode ?? 0,
      rawStdout: stdout,
      rawStderr: stderr,
      cases: flattenPlaywrightJson(json)
    };
  } catch (e) {
    return {
      exitCode: exitCode ?? 1,
      rawStdout: stdout,
      rawStderr: stderr,
      cases: [
        {
          title: 'runner:json-parse',
          status: 'failed',
          error: `Failed to parse JSON reporter output. stderr=${stderr}`
        }
      ]
    };
  }
}

function ensureWorktree(branchName) {
  const worktreesDir = path.join(REPO_ROOT, '.worktrees');
  ensureDir(worktreesDir);

  const dirName = safeDirName(branchName);
  const worktreePath = path.join(worktreesDir, dirName);

  if (fs.existsSync(worktreePath)) {
    shOk(`git worktree remove -f "${worktreePath}"`);
    // If still exists (e.g. not a worktree), leave it as-is and reuse.
  }

  if (!fs.existsSync(worktreePath)) {
    sh(`git worktree add -f -B "${branchName}" "${worktreePath}" "origin/${branchName}"`, {
      stdio: ['ignore', 'inherit', 'inherit']
    });
  }

  return worktreePath;
}

function writeReadmeAndPush({ worktreePath, branchName, readmeContent }) {
  const readmePath = path.join(worktreePath, 'README.md');
  fs.writeFileSync(readmePath, readmeContent, 'utf8');

  sh('git add README.md', { cwd: worktreePath });

  const staged = sh('git diff --cached --name-only', { cwd: worktreePath });
  if (!staged) return;

  sh(`git commit -m "chore: auto grading score"`, { cwd: worktreePath });
  sh(`git push origin "${branchName}"`, { cwd: worktreePath, stdio: ['ignore', 'inherit', 'inherit'] });
}

function nowTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function rankBadge(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return String(rank);
}

function renderMainLeaderboardBlock(results) {
  const lines = [];
  lines.push('<!-- AUTO-GRADE:START -->');
  lines.push('## 自动测评排行榜');
  lines.push('');
  lines.push(`更新时间：${nowTimestamp()}`);
  lines.push('');
  lines.push('| 排名 | 分支 | 分数 | 路由通过 | 用例通过 |');
  lines.push('| --- | --- | --- | --- | --- |');

  const sorted = [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return String(a.branchName).localeCompare(String(b.branchName));
  });

  for (let i = 0; i < sorted.length; i += 1) {
    const r = sorted[i];
    const rank = i + 1;
    lines.push(
      `| ${rankBadge(rank)} | ${r.branchName} | ${r.score}/100 | ${r.passedRoutes}/${r.totalRoutes} | ${r.passedCases}/${r.totalCases} |`
    );
  }

  lines.push('');
  lines.push('<!-- AUTO-GRADE:END -->');
  return lines.join('\n');
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function upsertAutogradeBlock(existing, block) {
  const start = '<!-- AUTO-GRADE:START -->';
  const end = '<!-- AUTO-GRADE:END -->';
  const re = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}\\n*`, 'm');

  if (re.test(existing)) {
    return existing.replace(re, `${block}\n\n`);
  }

  return `${block}\n\n${String(existing || '').trimStart()}`;
}

function writeMainLeaderboardAndPush({ results }) {
  const branchName = 'main';
  const worktreePath = ensureWorktree(branchName);

  const readmePath = path.join(worktreePath, 'README.md');
  const oldContent = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';

  const block = renderMainLeaderboardBlock(results);
  const newContent = upsertAutogradeBlock(oldContent, block);
  fs.writeFileSync(readmePath, newContent, 'utf8');

  sh('git add README.md', { cwd: worktreePath });

  const staged = sh('git diff --cached --name-only', { cwd: worktreePath });
  if (!staged) return;

  sh('git commit -m "chore: update grading leaderboard"', { cwd: worktreePath });
  sh(`git push origin "${branchName}"`, { cwd: worktreePath, stdio: ['ignore', 'inherit', 'inherit'] });
}

async function main() {
  sh('git fetch origin --prune', { stdio: ['ignore', 'inherit', 'inherit'] });

  const branches = listRemoteBranches();
  if (branches.length === 0) {
    console.log('No remote branches to grade (excluding main/benchmark).');
    return;
  }

  console.log(`Branches to grade: ${branches.join(', ')}`);

  const results = [];

  for (const branchName of branches) {
    console.log(`\n=== Grading ${branchName} ===`);
    const worktreePath = ensureWorktree(branchName);

    const server = await startStaticServer(worktreePath);
    let run;
    try {
      run = await runPlaywright({ baseURL: server.baseURL, branchName });
    } finally {
      await server.close();
    }

    const total = run.cases.length || 1;
    const passed = run.cases.filter((c) => c.status === 'passed').length;
    const routeScore = computeScoreByRoute(run.cases);
    const score = routeScore.score;

    const readme = renderReadme({
      branchName,
      score,
      passedCases: passed,
      totalCases: total,
      passedRoutes: routeScore.passedRoutes,
      totalRoutes: routeScore.totalRoutes,
      cases: run.cases
    });
    writeReadmeAndPush({ worktreePath, branchName, readmeContent: readme });

    console.log(
      `Score ${score}/100 (routes ${routeScore.passedRoutes}/${routeScore.totalRoutes}, cases ${passed}/${total})`
    );

    results.push({
      branchName,
      score,
      passedRoutes: routeScore.passedRoutes,
      totalRoutes: routeScore.totalRoutes,
      passedCases: passed,
      totalCases: total
    });
  }

  console.log('\n=== Updating main leaderboard ===');
  writeMainLeaderboardAndPush({ results });
}

await main();
