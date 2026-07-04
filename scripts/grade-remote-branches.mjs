import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUTO_GRADE_START = '<!-- AUTO-GRADE:START -->';
const AUTO_GRADE_END = '<!-- AUTO-GRADE:END -->';

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

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function parseCliArgs(argv) {
  let targetPath = null;
  let targetBranch = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--path') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new Error('Missing value for --path');
      if (targetPath !== null) throw new Error('Duplicate --path option');
      targetPath = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('--path=')) {
      const value = arg.slice('--path='.length);
      if (!value) throw new Error('Missing value for --path');
      if (targetPath !== null) throw new Error('Duplicate --path option');
      targetPath = value;
      continue;
    }

    if (arg === '--branch') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) throw new Error('Missing value for --branch');
      if (targetBranch !== null) throw new Error('Duplicate --branch option');
      targetBranch = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('--branch=')) {
      const value = arg.slice('--branch='.length);
      if (!value) throw new Error('Missing value for --branch');
      if (targetBranch !== null) throw new Error('Duplicate --branch option');
      targetBranch = value;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (targetPath !== null && targetBranch !== null) {
    throw new Error('--path and --branch cannot be used together');
  }

  if (targetPath !== null) return { mode: 'path', path: targetPath };
  if (targetBranch !== null) return { mode: 'branch', branch: targetBranch };
  return { mode: 'default' };
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
    } catch {
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

    for (const spec of suite.specs || []) {
      const tests = spec.tests || [];

      let finalStatus = 'unknown';
      let error = '';

      if (tests.length === 0) {
        finalStatus = spec.ok ? 'passed' : 'failed';
      } else {
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
    .replace(/\x1b\[[0-9;]*m/g, '')
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
  const avgRate = routeRates.reduce((sum, r) => sum + r.rate, 0) / routeCount;

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
  } catch {
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

function resolvePathTarget(inputPath) {
  const targetRoot = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
    throw new Error(`Path does not exist or is not a directory: ${targetRoot}`);
  }

  const indexPath = path.join(targetRoot, 'index.html');
  if (!fs.existsSync(indexPath) || !fs.statSync(indexPath).isFile()) {
    throw new Error(`Path does not contain index.html: ${targetRoot}`);
  }

  return targetRoot;
}

function refExists(ref) {
  return shOk(`git rev-parse --verify --quiet ${shellQuote(`${ref}^{commit}`)}`);
}

function resolveBranchRef(branchName) {
  const candidates = [
    `refs/heads/${branchName}`,
    `refs/remotes/origin/${branchName}`,
    branchName
  ];

  for (const ref of candidates) {
    if (refExists(ref)) return ref;
  }

  throw new Error(`Branch not found: ${branchName}`);
}

function materializeBranchSnapshot(branchRef, branchName) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `grade-${safeDirName(branchName)}-`));

  try {
    sh(`git archive ${shellQuote(branchRef)} | tar -x -C ${shellQuote(tempDir)}`);
    return tempDir;
  } catch (error) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    throw error;
  }
}

async function gradeTarget({ targetRoot, targetLabel, branchNameForEnv }) {
  console.log(`\n=== Grading ${targetLabel} ===`);

  const server = await startStaticServer(targetRoot);
  let run;
  try {
    run = await runPlaywright({ baseURL: server.baseURL, branchName: branchNameForEnv });
  } finally {
    await server.close();
  }

  const totalCases = run.cases.length || 1;
  const passedCases = run.cases.filter((c) => c.status === 'passed').length;
  const routeScore = computeScoreByRoute(run.cases);

  return {
    targetLabel,
    branchName: branchNameForEnv,
    score: routeScore.score,
    passedRoutes: routeScore.passedRoutes,
    totalRoutes: routeScore.totalRoutes,
    passedCases,
    totalCases,
    cases: run.cases
  };
}

function printScoreReport(result) {
  const lines = [];
  lines.push(`目标：${result.targetLabel}`);
  lines.push(`总分：${result.score}/100`);
  lines.push(`路由通过：${result.passedRoutes}/${result.totalRoutes}`);
  lines.push(`用例通过：${result.passedCases}/${result.totalCases}`);
  lines.push('');
  lines.push('| Route | Case | 结果 | 备注 |');
  lines.push('| --- | --- | --- | --- |');

  for (const c of result.cases) {
    const ok = c.status === 'passed';
    const status = ok ? 'PASS' : c.status === 'skipped' ? 'SKIP' : 'FAILED';
    const note = ok ? '' : shortError(c.error);
    lines.push(`| ${routeIdFromTitle(c.title)} | ${c.title} | ${status} | ${note} |`);
  }

  console.log(lines.join('\n'));
}

function ensureWorktree(branchName) {
  const worktreesDir = path.join(REPO_ROOT, '.worktrees');
  ensureDir(worktreesDir);

  const dirName = safeDirName(branchName);
  const worktreePath = path.join(worktreesDir, dirName);

  if (fs.existsSync(worktreePath)) {
    shOk(`git worktree remove -f "${worktreePath}"`);
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

  sh('git commit -m "chore: auto grading score"', { cwd: worktreePath });
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
  lines.push(AUTO_GRADE_START);
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
  lines.push(AUTO_GRADE_END);
  return lines.join('\n');
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseAutogradeLeaderboard(existingReadme) {
  const content = String(existingReadme || '');
  const re = new RegExp(`${escapeRegExp(AUTO_GRADE_START)}([\\s\\S]*?)${escapeRegExp(AUTO_GRADE_END)}`, 'm');
  const match = content.match(re);
  if (!match) return [];

  const rows = [];
  const lines = match[1].split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line.startsWith('|')) continue;

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length !== 5) {
      throw new Error(`Invalid leaderboard row: ${line}`);
    }

    const isHeader = cells[0] === '排名' && cells[1] === '分支' && cells[2] === '分数';
    const isDivider = cells.every((cell) => /^:?-{3,}:?$/.test(cell));
    if (isHeader || isDivider) continue;

    const branchName = cells[1];
    const scoreMatch = cells[2].match(/^(\d+)\/100$/);
    const routeMatch = cells[3].match(/^(\d+)\/(\d+)$/);
    const caseMatch = cells[4].match(/^(\d+)\/(\d+)$/);

    if (!branchName || !scoreMatch || !routeMatch || !caseMatch) {
      throw new Error(`Invalid leaderboard row: ${line}`);
    }

    rows.push({
      branchName,
      score: Number(scoreMatch[1]),
      passedRoutes: Number(routeMatch[1]),
      totalRoutes: Number(routeMatch[2]),
      passedCases: Number(caseMatch[1]),
      totalCases: Number(caseMatch[2])
    });
  }

  return rows;
}

function mergeLeaderboardResults(existingRows, newRows) {
  const merged = new Map();

  for (const row of existingRows) {
    merged.set(row.branchName, { ...row });
  }

  for (const row of newRows) {
    merged.set(row.branchName, { ...row });
  }

  return Array.from(merged.values());
}

function upsertAutogradeBlock(existing, block) {
  const re = new RegExp(`${escapeRegExp(AUTO_GRADE_START)}[\\s\\S]*?${escapeRegExp(AUTO_GRADE_END)}\\n*`, 'm');

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

  const existingRows = parseAutogradeLeaderboard(oldContent);
  const mergedResults = mergeLeaderboardResults(existingRows, results);
  const block = renderMainLeaderboardBlock(mergedResults);
  const newContent = upsertAutogradeBlock(oldContent, block);
  fs.writeFileSync(readmePath, newContent, 'utf8');

  sh('git add README.md', { cwd: worktreePath });

  const staged = sh('git diff --cached --name-only', { cwd: worktreePath });
  if (!staged) return;

  sh('git commit -m "chore: update grading leaderboard"', { cwd: worktreePath });
  sh(`git push origin "${branchName}"`, { cwd: worktreePath, stdio: ['ignore', 'inherit', 'inherit'] });
}

async function main(argv = process.argv.slice(2)) {
  const options = parseCliArgs(argv);

  if (options.mode === 'path') {
    const targetRoot = resolvePathTarget(options.path);
    const result = await gradeTarget({
      targetRoot,
      targetLabel: targetRoot,
      branchNameForEnv: targetRoot
    });
    printScoreReport(result);
    return;
  }

  if (options.mode === 'branch') {
    const branchRef = resolveBranchRef(options.branch);
    const targetRoot = materializeBranchSnapshot(branchRef, options.branch);

    try {
      const result = await gradeTarget({
        targetRoot,
        targetLabel: options.branch,
        branchNameForEnv: options.branch
      });
      printScoreReport(result);
    } finally {
      fs.rmSync(targetRoot, { recursive: true, force: true });
    }
    return;
  }

  sh('git fetch origin --prune', { stdio: ['ignore', 'inherit', 'inherit'] });
  sh('git worktree prune', { stdio: ['ignore', 'inherit', 'inherit'] });

  const branches = listRemoteBranches();
  if (branches.length === 0) {
    console.log('No remote branches to grade (excluding main/benchmark).');
    return;
  }

  console.log(`Branches to grade: ${branches.join(', ')}`);

  const results = [];

  for (const branchName of branches) {
    const worktreePath = ensureWorktree(branchName);
    const result = await gradeTarget({
      targetRoot: worktreePath,
      targetLabel: branchName,
      branchNameForEnv: branchName
    });

    const readme = renderReadme({
      branchName,
      score: result.score,
      passedCases: result.passedCases,
      totalCases: result.totalCases,
      passedRoutes: result.passedRoutes,
      totalRoutes: result.totalRoutes,
      cases: result.cases
    });
    writeReadmeAndPush({ worktreePath, branchName, readmeContent: readme });

    console.log(
      `Score ${result.score}/100 (routes ${result.passedRoutes}/${result.totalRoutes}, cases ${result.passedCases}/${result.totalCases})`
    );

    results.push({
      branchName,
      score: result.score,
      passedRoutes: result.passedRoutes,
      totalRoutes: result.totalRoutes,
      passedCases: result.passedCases,
      totalCases: result.totalCases
    });
  }

  console.log('\n=== Updating main leaderboard ===');
  writeMainLeaderboardAndPush({ results });
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  await main(process.argv.slice(2));
}

export {
  main,
  mergeLeaderboardResults,
  parseAutogradeLeaderboard,
  parseCliArgs,
  renderMainLeaderboardBlock,
  upsertAutogradeBlock
};
