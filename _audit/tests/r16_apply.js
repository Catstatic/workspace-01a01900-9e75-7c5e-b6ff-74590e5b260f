/* Round 16 apply (idempotent): EMBED the 4 boot backdrops as data URIs — single-file fix.
   Zero surgical edits; one script appended after round 15's, monkey-patching
   __bootBgRotation.frame() so rotation + shuffle + pointer logic stay untouched. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

if (!doc.includes('ROUND 16 — EMBEDDED BOOT BACKDROPS')){
  const js = fs.readFileSync('/home/user/_audit/ins15_js.js', 'utf8').replace(/\s+$/, '');
  if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins15_js appended (' + js.length + ' chars)');
} else console.log('  · ins15_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
