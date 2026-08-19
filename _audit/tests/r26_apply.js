/* Round 26 apply (idempotent): SKINFORGE + CASTFORGE.
   28 surgical pairs (cut escape/backrooms, graft 3 themes + 4 personas)
   + two new masters: ins24_css (visual layer), ins24_js (overlay injector). */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

/* ---- surgical pairs ---- */
const surg = JSON.parse(fs.readFileSync('/home/user/_audit/surgical_r26.json', 'utf8'));
let applied = 0, skipped = 0;
for (const p of surg.pairs){
  if (p.new && doc.includes(p.new)){ skipped++; continue; }
  if (!p.new && !doc.includes(p.old)){ skipped++; continue; }          /* removal already gone */
  if (n(doc, p.old) !== 1){ console.error('✘ ' + p.name + ': old not exactly once (' + n(doc, p.old) + ')'); process.exit(1); }
  doc = doc.replace(p.old, () => p.new);
  applied++;
}
console.log('  ✔ surgical pairs: ' + applied + ' applied, ' + skipped + ' already done');

/* ---- ins24_css after ins19_css ---- */
if (!doc.includes('SKINFORGE + CASTFORGE — VISUAL LAYER (ROUND 26)')){
  const css = fs.readFileSync('/home/user/_audit/ins24_css.css', 'utf8').replace(/\s+$/, '');
  const css19 = fs.readFileSync('/home/user/_audit/ins19_css.css', 'utf8');
  const anchor = css19.replace(/\s+$/, '').slice(-60);
  if (n(doc, anchor) !== 1){ console.error('✘ CSS anchor (ins19 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins24_css appended (' + css.length + ' chars)');
} else console.log('  · ins24_css already present, skipped');

/* ---- ins24_js before /body ---- */
if (!doc.includes('SKINFORGE + CASTFORGE — OVERLAY INJECTOR (ROUND 26)')){
  const js = fs.readFileSync('/home/user/_audit/ins24_js.js', 'utf8').replace(/\s+$/, '');
  if (n(doc, '</body>') !== 1){ console.error('✘ body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins24_js appended (' + js.length + ' chars)');
} else console.log('  · ins24_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars (Δ ' + (doc.length - origLen) + ')');
