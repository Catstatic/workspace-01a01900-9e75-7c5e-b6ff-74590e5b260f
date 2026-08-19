/* one-off revert: undo round 17+18 application exactly (inverse of the apply scripts) */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const A = '/home/user/_audit/';
const cut = (s, name) => {
  const n = doc.split(s).length - 1;
  if (n !== 1){ console.error(name + ': ' + n + ' occurrence(s)'); process.exit(1); }
  doc = doc.replace(s, () => '');
  console.log('  ✂ removed ' + name + ' (' + s.length + ' chars)');
};
const r16 = fs.readFileSync(A + 'ins16_css.css', 'utf8').replace(/\s+$/, '');
const r16h = fs.readFileSync(A + 'ins16_html.html', 'utf8').replace(/\s+$/, '');
const r17c = fs.readFileSync(A + 'ins17_css.css', 'utf8').replace(/\s+$/, '');
const r17j = fs.readFileSync(A + 'ins17_js.js', 'utf8').replace(/\s+$/, '');
const surg = JSON.parse(fs.readFileSync(A + 'surgical_r18.json', 'utf8'));
for (const p of surg.pairs){
  const n = doc.split(p.new).length - 1;
  if (n !== 1){ console.error('surgical revert [' + p.name + ']: ' + n); process.exit(1); }
  doc = doc.replace(p.new, () => p.old);
  console.log('  ↩ reverted surgical [' + p.name + ']');
}
cut('\n\n' + r17c, 'ins17_css');
cut('\n<script>\n' + r17j + '\n\n</script>\n', 'ins17_js'); /* exact inverse of the r18 replace() — restores ins15_js's trailing wrapper intact */
cut('\n' + r16h + '\n', 'ins16_html');
cut('\n\n' + r16, 'ins16_css');
fs.writeFileSync(P, doc, 'utf8');
console.log('reverted. bytes:', Buffer.byteLength(doc));
