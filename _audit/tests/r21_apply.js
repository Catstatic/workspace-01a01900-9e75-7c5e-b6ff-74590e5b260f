/* Round 21 apply (idempotent): SARGAM notation layer + 4 more songs (Viva la Vida,
   Shape of You, See You Again, Let It Be). Swaps the embedded round-19 blocks for the
   R21 revision. Zero surgical pairs. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

function swap(label, oldBuf, newBuf){
  const oldS = oldBuf.replace(/\s+$/, ''), newS = newBuf.replace(/\s+$/, '');
  if (doc.includes(newS)){ console.log('  · ' + label + ' already at R21 revision, skipped'); return; }
  if (n(doc, oldS) !== 1){ console.error(label + ': old embedded block not found exactly once (' + n(doc, oldS) + ')'); process.exit(1); }
  doc = doc.replace(oldS, () => newS);
  console.log('  ✔ ' + label + ' swapped (' + oldS.length + ' → ' + newS.length + ' chars)');
}

const newJs = fs.readFileSync('/home/user/_audit/ins19_js.js', 'utf8');
const newCss = fs.readFileSync('/home/user/_audit/ins19_css.css', 'utf8');
for (const m of ['function sargamSheet(', "SARGAM=['Sa'", 'VIVA LA VIDA', 'SHAPE OF YOU', 'SEE YOU AGAIN', 'LET IT BE']){
  if (!newJs.includes(m)){ console.error('new ins19_js missing R21 marker: ' + m); process.exit(1); }
}
/* stale-backup guard removed (needs wiped /tmp); final-master presence is checked below */
let oldJs, oldCss;
try{
  oldJs = fs.readFileSync('/tmp/old21_ins19_js.js', 'utf8');
  oldCss = fs.readFileSync('/tmp/old21_ins19_css.css', 'utf8');
  if (oldJs.includes('function sargamSheet(')){ console.error('backup already holds R21 — stale /tmp state'); process.exit(1); }
}catch(e){
  /* /tmp backups gone: if doc already embeds the final masters, swaps are no-ops. */
  if (doc.includes(newJs.replace(/\s+$/, '')) && doc.includes(newCss.replace(/\s+$/, ''))){
    console.log('  · final masters already embedded, swaps skipped (no /tmp backups)');
    fs.writeFileSync(P, doc, 'utf8');
    console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
    process.exit(0);
  }
  console.error('old master backups missing in /tmp'); process.exit(1);
}

swap('ins19_js → R21', oldJs, newJs);
swap('ins19_css → R21', oldCss, newCss);

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
