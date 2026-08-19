/* Round 13 apply (idempotent): Boot Command Center — CSS + JS blocks, zero surgical edits.
   The artwork (command-center-bg.svg / optional -bg.jpg) lives as a companion file in project/
   — same pattern as content-figures/. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

/* ---- ins12_css after ins11_css ---- */
if (!doc.includes('ROUND 13 — BOOT COMMAND CENTER overlay')){
  const css = fs.readFileSync('/home/user/_audit/ins12_css.css', 'utf8').replace(/\s+$/, '');
  const css11 = fs.readFileSync('/home/user/_audit/ins11_css.css', 'utf8');
  const anchor = css11.replace(/\s+$/, '').slice(-60);
  if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins11 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins12_css appended (' + css.length + ' chars)');
} else console.log('  · ins12_css already present, skipped');

/* ---- ins12_js before </body> ---- */
if (!doc.includes('ROUND 13 — BOOT COMMAND CENTER\n') && !doc.includes('BOOT COMMAND CENTER\n   On startup')){
  const js = fs.readFileSync('/home/user/_audit/ins12_js.js', 'utf8').replace(/\s+$/, '');
  if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins12_js appended (' + js.length + ' chars)');
} else console.log('  · ins12_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
