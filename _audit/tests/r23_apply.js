/* Round 23 apply (idempotent): CTRL+G theme-game hotkey. Zero surgical edits —
   one JS block before /body. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

if (!doc.includes('ROUND 23 — CTRL+G THEME GAME SHORTCUT')){
  const js = fs.readFileSync('/home/user/_audit/ins23_js.js', 'utf8').replace(/\s+$/, '');
  if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins23_js appended (' + js.length + ' chars)');
} else console.log('  · ins23_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
