/* Round 15 apply (idempotent): Boot background SHUFFLE button — CSS + JS, zero surgical edits. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

/* ---- ins14_css after ins13_css ---- */
if (!doc.includes('ROUND 15 — BOOT BACKGROUND SHUFFLE BUTTON')){
  const css = fs.readFileSync('/home/user/_audit/ins14_css.css', 'utf8').replace(/\s+$/, '');
  const css13 = fs.readFileSync('/home/user/_audit/ins13_css.css', 'utf8');
  const anchor = css13.replace(/\s+$/, '').slice(-60);
  if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins13 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins14_css appended (' + css.length + ' chars)');
} else console.log('  · ins14_css already present, skipped');

/* ---- ins14_js before </body>, after ins13_js (needs __bootBgRotation present) ---- */
if (!doc.includes('ROUND 15 — BOOT BACKGROUND SHUFFLE (manual re-roll)')){
  const js = fs.readFileSync('/home/user/_audit/ins14_js.js', 'utf8').replace(/\s+$/, '');
  if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins14_js appended (' + js.length + ' chars)');
} else console.log('  · ins14_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
