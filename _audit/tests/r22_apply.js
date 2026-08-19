/* Round 22 apply (idempotent): STATIC-FIRST BOOT. The command center overlay becomes
   document-level markup — the first element after <body> — hydrated pre-paint by an
   inline guardian, then ADOPTED by the round-13 engine (swapped master). Zero surgical
   pairs: one block swap (ins12_js) + one insertion (ins22_html). */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

/* ---- 1) ins12_js engine: adopt-or-build refactor ---- */
const newJs = fs.readFileSync('/home/user/_audit/ins12_js.js', 'utf8').replace(/\s+$/, '');
for (const m of ['ROUND 22 ADOPT', 'ov.__bootWired=true', 'if(slot)slot.innerHTML=""']){
  if (!newJs.includes(m)){ console.error('new ins12_js missing R22 marker: ' + m); process.exit(1); }
}
if (doc.includes(newJs)) console.log('  · ins12_js already at R22 revision, skipped');
else {
  const oldJs = fs.readFileSync('/tmp/old22_ins12_js.js', 'utf8').replace(/\s+$/, '');
  if (n(doc, oldJs) !== 1){ console.error('old ins12_js embedded block not exactly once (' + n(doc, oldJs) + ')'); process.exit(1); }
  doc = doc.replace(oldJs, () => newJs);
  console.log('  ✔ ins12_js engine swapped (' + oldJs.length + ' → ' + newJs.length + ' chars)');
}

/* ---- 2) ins22_html: static overlay first in body ---- */
if (!doc.includes('ROUND 22 — STATIC-FIRST BOOT COMMAND CENTER')){
  const html = fs.readFileSync('/home/user/_audit/ins22_html.html', 'utf8').replace(/\s+$/, '');
  if (n(doc, '<body>') !== 1){ console.error('<body> not unique'); process.exit(1); }
  if (n(doc, 'id="bootCenterOverlay"') !== 0 && !doc.includes('ROUND 22')){ console.error('overlay already present without marker — aborting'); process.exit(1); }
  doc = doc.replace('<body>', () => '<body>\n' + html);
  console.log('  ✔ ins22_html installed as first body element (' + html.length + ' chars)');
} else console.log('  · ins22_html already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
