const fs = require('fs');
const files = {
  jielong: 'jielong.a9f64306.js',
  chengyujielong: 'chengyujielong.b5539dfc.js',
  allegory: 'allegory.5d84127e.js',
  explain: 'explain.c57b1cbf.js',
  radical: 'radical.54a5bc99.js',
  school: 'school.3a2e04b5.js',
  dynasties: 'dynasties.ef9eca66.js',
  capital: 'capital.56390d43.js',
  zitie_new: 'zitie_new.66f8bcc8.js',
};
// known common blocks to skip (axios package.json etc appear in all bundles)
for (const [name, f] of Object.entries(files)) {
  const s = fs.readFileSync('assets/' + f, 'utf8');
  const re = /JSON\.parse\('((?:[^'\\]|\\.)*)'\)/g;
  let m, i = 0;
  while ((m = re.exec(s)) !== null) {
    if (m[1].length < 3000) continue;
    let parsed;
    try {
      // the captured group is a JS single-quoted string body; eval it safely-ish by reconstructing
      const str = eval("'" + m[1] + "'");   // trusted content from qq bundle
      parsed = JSON.parse(str);
    } catch (e) { console.log(`${name} block@${m.index} len=${m[1].length}: parse ERR ${e.message.slice(0,80)}`); continue; }
    const keys = Array.isArray(parsed) ? `array[${parsed.length}]` : `object{${Object.keys(parsed).length}}`;
    const sample = JSON.stringify(Array.isArray(parsed) ? parsed[0] : Object.entries(parsed)[0]).slice(0, 150);
    // skip axios package.json and other common noise
    if (sample.includes('axios') || sample.includes('follow-redirects')) continue;
    const out = `data/${name}-${i}.json`;
    fs.writeFileSync('../research-data-tmp-' + name + '-' + i + '.json', '');
    fs.writeFileSync(out, JSON.stringify(parsed, null, 1));
    console.log(`${name} block@${m.index} len=${m[1].length} -> ${out}  ${keys}  sample=${sample}`);
    i++;
  }
}
