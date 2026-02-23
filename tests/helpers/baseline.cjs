const fs = require('fs');
const path = require('path');

function readJson(relativePath) {
  const absPath = path.join(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(absPath, 'utf8'));
}

function listFiles(relativeDir, predicate) {
  const absDir = path.join(process.cwd(), relativeDir);
  return fs
    .readdirSync(absDir)
    .filter((f) => (predicate ? predicate(f) : true))
    .map((f) => path.join(relativeDir, f));
}

function loadBasicStructureScenarios() {
  const files = listFiles('artifacts/baseline/scenarios', (f) =>
    f.endsWith('-basic-structure.json')
  );
  return files
    .map((p) => readJson(p))
    .sort((a, b) => String(a.routeId).localeCompare(String(b.routeId)));
}

function loadEducationHomeDom() {
  return readJson('artifacts/baseline/dom/education-home-remote.json');
}

module.exports = {
  loadBasicStructureScenarios,
  loadEducationHomeDom,
  readJson
};

