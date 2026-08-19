/* Round 24 apply (idempotent): FEYNMAN chalkboard backdrop joins the boot rotation —
   pool extended (ins13_js) and the new frame embedded as a data URI (ins15_js).
   Zero surgical pairs: two master-block swaps. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

function swap(label, oldPath, newPath, markers){
  const newS = fs.readFileSync(newPath, 'utf8').replace(/\s+$/, '');
  for (const m of markers){
    if (!newS.includes(m)){ console.error(label + ': new master missing marker ' + m); process.exit(1); }
  }
  if (doc.includes(newS)){ console.log('  · ' + label + ' already at R24 revision, skipped'); return; }
  const oldS = fs.readFileSync(oldPath, 'utf8').replace(/\s+$/, '');
  if (n(doc, oldS) !== 1){ console.error(label + ': old embedded block not exactly once (' + n(doc, oldS) + ')'); process.exit(1); }
  doc = doc.replace(oldS, () => newS);
  console.log('  ✔ ' + label + ' swapped (' + oldS.length + ' → ' + newS.length + ' chars)');
}

swap('ins13_js (rotation pool)', '/tmp/old24_ins13_js.js', '/home/user/_audit/ins13_js.js',
  ['boot-bg-feynman-hq.jpg', 'ROUND 24 — FEYNMAN AT THE CHALKBOARD']);
swap('ins15_js (embedded frames)', '/tmp/old24_ins15_js.js', '/home/user/_audit/ins15_js.js',
  ['boot-bg-feynman-hq.jpg', 'five frames since ROUND 24']);

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
