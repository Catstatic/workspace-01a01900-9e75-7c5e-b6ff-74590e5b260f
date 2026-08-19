/* Round 19 apply (idempotent): RESONANCE CHAMBER — Ctrl+M music room.
   Zero surgical edits: one CSS block (after ins18_css) + one JS block before /body. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

/* ---- ins19_css after ins18_css ---- */
if (!doc.includes('ROUND 19 — RESONANCE CHAMBER (Ctrl+M music room)')){
  const css = fs.readFileSync('/home/user/_audit/ins19_css.css', 'utf8').replace(/\s+$/, '');
  const css18 = fs.readFileSync('/home/user/_audit/ins17_css.css', 'utf8');
  const anchor = css18.replace(/\s+$/, '').slice(-60);
  if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins18 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins19_css appended (' + css.length + ' chars)');
} else console.log('  · ins19_css already present, skipped');

/* ---- ins19_js before /body ---- */
if (!doc.includes('ROUND 19 — RESONANCE CHAMBER: Ctrl+M music room')){
  const js = fs.readFileSync('/home/user/_audit/ins19_js.js', 'utf8').replace(/\s+$/, '');
  if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins19_js appended (' + js.length + ' chars)');
} else console.log('  · ins19_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
