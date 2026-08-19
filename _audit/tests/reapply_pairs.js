/* Generic surgical-pair re-applier for rounds that shipped pairs only (r27–r31 etc.).
   Usage: node reapply_pairs.js 27 28 29 …
   For every pair in _audit/surgical_rNN.json: if new already present → skip (idempotent);
   else assert old occurs exactly once, then replace. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const n = (h, s) => h.split(s).length - 1;
let total = 0, skipped = 0;
for (const arg of process.argv.slice(2)){
  const path = '/home/user/_audit/surgical_r' + arg + '.json';
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  for (const p of json.pairs){
    if (p.new && doc.includes(p.new)){ skipped++; continue; }
    if (!p.new && !doc.includes(p.old)){ skipped++; continue; }
    if (n(doc, p.old) !== 1){ console.error('✘ [r' + arg + '] ' + p.name + ': old count=' + n(doc, p.old)); process.exit(1); }
    doc = doc.replace(p.old, () => p.new);
    total++;
  }
  console.log('  ✔ r' + arg + ' pairs done (' + json.pairs.length + ' in json)');
}
fs.writeFileSync(P, doc, 'utf8');
console.log('applied ' + total + ', skipped ' + skipped + ' (already present)');
