/* Round 20 apply (idempotent): swap the embedded round-19 blocks for the R20 refresh —
   QWERTY letter sheets, MUSICAL BREAK launcher beside the game button, strict 15:00
   auto-close, 10 more songs (Dark Aria, Homecoming, Carol of the Bells, Loki, Vellake…).
   Zero surgical pairs: the two round-19 master blocks are replaced in place. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

function swap(label, oldBuf, newBuf){
  const oldS = oldBuf.replace(/\s+$/, ''), newS = newBuf.replace(/\s+$/, '');
  if (doc.includes(newS)){ console.log('  · ' + label + ' already at R20 revision, skipped'); return; }
  if (n(doc, oldS) !== 1){ console.error(label + ': old embedded block not found exactly once (' + n(doc, oldS) + ')'); process.exit(1); }
  doc = doc.replace(oldS, () => newS);
  console.log('  ✔ ' + label + ' swapped (' + oldS.length + ' → ' + newS.length + ' chars)');
}

const newJs = fs.readFileSync('/home/user/_audit/ins19_js.js', 'utf8');
const newCss = fs.readFileSync('/home/user/_audit/ins19_css.css', 'utf8');
/* markers must exist in what we are about to embed */
for (const m of ['ROUND 19 — RESONANCE CHAMBER: Ctrl+M music room', 'MUSICAL BREAK launcher', 'BREAK_MS=15*60*1000']){
  if (!newJs.includes(m)){ console.error('new ins19_js missing marker: ' + m); process.exit(1); }
}

let oldJs, oldCss;
try{
  oldJs = fs.readFileSync('/tmp/old_ins19_js.js', 'utf8');
  oldCss = fs.readFileSync('/tmp/old_ins19_css.css', 'utf8');
}catch(e){
  /* /tmp backups gone: if doc already embeds the final masters, swaps are no-ops. */
  if (doc.includes(newJs.replace(/\s+$/, '')) && doc.includes(newCss.replace(/\s+$/, ''))){
    console.log('  · final masters already embedded, swaps skipped (no /tmp backups)');
    fs.writeFileSync(P, doc, 'utf8');
    console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
    process.exit(0);
  }
  console.error('old master backups missing in /tmp — restore from git-less audit trail first'); process.exit(1);
}

swap('ins19_js → R20', oldJs, newJs);
swap('ins19_css → R20', oldCss, newCss);

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
