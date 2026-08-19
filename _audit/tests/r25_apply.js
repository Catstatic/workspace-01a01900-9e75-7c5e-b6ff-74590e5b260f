/* Round 25 apply (idempotent): FEYNMAN FAVORED — boot backdrop rotation switches
   from flat round-robin (mod 5) to a weighted 7-slot schedule (3/7 Feynman).
   Zero surgical pairs: single master-block swap (ins13_js). */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

const newS = fs.readFileSync('/home/user/_audit/ins13_js.js', 'utf8').replace(/\s+$/, '');
for (const m of ['var SCHEDULE=[0,4,1,4,2,4,3];', 'ROUND 25 ▶ WEIGHTED WALK', 'schedule:SCHEDULE.slice()']){
  if (!newS.includes(m)){ console.error('ins13_js: new master missing marker ' + m); process.exit(1); }
}
if (doc.includes(newS)){ console.log('  · ins13_js already at R25 revision, skipped'); }
else {
  const oldS = fs.readFileSync('/tmp/old25_ins13_js.js', 'utf8').replace(/\s+$/, '');
  if (n(doc, oldS) !== 1){ console.error('ins13_js: old embedded block not exactly once (' + n(doc, oldS) + ')'); process.exit(1); }
  doc = doc.replace(oldS, () => newS);
  console.log('  ✔ ins13_js (weighted rotation) swapped (' + oldS.length + ' → ' + newS.length + ' chars)');
}

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
