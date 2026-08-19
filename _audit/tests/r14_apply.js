/* Round 14 apply (idempotent): Boot background ROTATION — CSS + JS, zero surgical edits.
   Rotates 4 user-picked, locally enhanced artworks on every boot-overlay open.
   Pool files (void/palace/babel/torii HQ jpgs) are companions in project/, same
   pattern as content-figures/ and command-center-bg.*. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

/* ---- ins13_css after ins12_css ---- */
if (!doc.includes('ROUND 14 — BOOT BACKGROUND ROTATION\n   ins12 painted')){
  const css = fs.readFileSync('/home/user/_audit/ins13_css.css', 'utf8').replace(/\s+$/, '');
  const css12 = fs.readFileSync('/home/user/_audit/ins12_css.css', 'utf8');
  const anchor = css12.replace(/\s+$/, '').slice(-60);
  if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins12 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins13_css appended (' + css.length + ' chars)');
} else console.log('  · ins13_css already present, skipped');

/* ---- ins13_js before </body>, AFTER ins12_js (needs __bootCenter-ready DOM hooks) ---- */
if (!doc.includes('ROUND 14 — BOOT BACKGROUND ROTATION (game-free')){
  const js = fs.readFileSync('/home/user/_audit/ins13_js.js', 'utf8').replace(/\s+$/, '');
  if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins13_js appended (' + js.length + ' chars)');
} else console.log('  · ins13_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
