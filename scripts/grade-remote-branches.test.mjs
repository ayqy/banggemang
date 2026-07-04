import assert from 'node:assert/strict';
import test from 'node:test';

import {
  mergeLeaderboardResults,
  parseAutogradeLeaderboard,
  parseCliArgs,
  renderMainLeaderboardBlock,
  upsertAutogradeBlock
} from './grade-remote-branches.mjs';

test('parseCliArgs returns default mode with no args', () => {
  assert.deepEqual(parseCliArgs([]), { mode: 'default' });
});

test('parseCliArgs parses --path', () => {
  assert.deepEqual(parseCliArgs(['--path', './site']), { mode: 'path', path: './site' });
  assert.deepEqual(parseCliArgs(['--path=./site']), { mode: 'path', path: './site' });
});

test('parseCliArgs parses --branch', () => {
  assert.deepEqual(parseCliArgs(['--branch', 'fable-5']), { mode: 'branch', branch: 'fable-5' });
  assert.deepEqual(parseCliArgs(['--branch=fable-5']), { mode: 'branch', branch: 'fable-5' });
});

test('parseCliArgs rejects --path and --branch together', () => {
  assert.throws(
    () => parseCliArgs(['--path', '.', '--branch', 'fable-5']),
    /--path and --branch cannot be used together/
  );
});

test('parseCliArgs rejects missing option values', () => {
  assert.throws(() => parseCliArgs(['--path']), /Missing value for --path/);
  assert.throws(() => parseCliArgs(['--branch']), /Missing value for --branch/);
});

test('leaderboard parsing and merge preserve old rows while updating new ones', () => {
  const existingRows = [
    {
      branchName: 'alpha',
      score: 80,
      passedRoutes: 8,
      totalRoutes: 10,
      passedCases: 16,
      totalCases: 20
    },
    {
      branchName: 'beta',
      score: 70,
      passedRoutes: 7,
      totalRoutes: 10,
      passedCases: 14,
      totalCases: 20
    }
  ];

  const existingReadme = upsertAutogradeBlock('# 标题\n', renderMainLeaderboardBlock(existingRows));
  const parsedRows = parseAutogradeLeaderboard(existingReadme);
  const merged = mergeLeaderboardResults(parsedRows, [
    {
      branchName: 'alpha',
      score: 95,
      passedRoutes: 9,
      totalRoutes: 10,
      passedCases: 19,
      totalCases: 20
    },
    {
      branchName: 'gamma',
      score: 60,
      passedRoutes: 6,
      totalRoutes: 10,
      passedCases: 12,
      totalCases: 20
    }
  ]);

  assert.equal(merged.length, 3);
  assert.deepEqual(
    merged.find((row) => row.branchName === 'alpha'),
    {
      branchName: 'alpha',
      score: 95,
      passedRoutes: 9,
      totalRoutes: 10,
      passedCases: 19,
      totalCases: 20
    }
  );
  assert.deepEqual(
    merged.find((row) => row.branchName === 'beta'),
    {
      branchName: 'beta',
      score: 70,
      passedRoutes: 7,
      totalRoutes: 10,
      passedCases: 14,
      totalCases: 20
    }
  );
  assert.deepEqual(
    merged.find((row) => row.branchName === 'gamma'),
    {
      branchName: 'gamma',
      score: 60,
      passedRoutes: 6,
      totalRoutes: 10,
      passedCases: 12,
      totalCases: 20
    }
  );
});

test('upsertAutogradeBlock replaces an existing block', () => {
  const oldBlock = '<!-- AUTO-GRADE:START -->\n旧内容\n<!-- AUTO-GRADE:END -->';
  const nextBlock = '<!-- AUTO-GRADE:START -->\n新内容\n<!-- AUTO-GRADE:END -->';
  const doc = `前言\n\n${oldBlock}\n\n后文\n`;
  const updated = upsertAutogradeBlock(doc, nextBlock);

  assert.match(updated, /新内容/);
  assert.doesNotMatch(updated, /旧内容/);
  assert.match(updated, /后文/);
});

test('upsertAutogradeBlock inserts a block when none exists', () => {
  const nextBlock = '<!-- AUTO-GRADE:START -->\n新内容\n<!-- AUTO-GRADE:END -->';
  const updated = upsertAutogradeBlock('# 文档\n', nextBlock);

  assert.ok(updated.startsWith(nextBlock));
  assert.match(updated, /# 文档/);
});

test('parseAutogradeLeaderboard throws on invalid row data', () => {
  const invalid = `<!-- AUTO-GRADE:START -->
## 自动测评排行榜

| 排名 | 分支 | 分数 | 路由通过 | 用例通过 |
| --- | --- | --- | --- | --- |
| 1 | broken | not-a-score | 1/2 | 3/4 |

<!-- AUTO-GRADE:END -->
`;

  assert.throws(() => parseAutogradeLeaderboard(invalid), /Invalid leaderboard row/);
});
