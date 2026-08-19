/* Round 17 apply (idempotent): INSTANT BOOT VEIL — pure-CSS cover parked immediately
   after <body> so the boot screen paints FIRST, before the 46MB dashboard finishes.
   Zero surgical edits: one CSS block (after ins14_css) + one HTML block (after <body>). */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

/* ---- ins16_css after ins14_css ---- */
if (!doc.includes('ROUND 17 — INSTANT BOOT VEIL (boot screen paints FIRST)')){
  const css = fs.readFileSync('/home/user/_audit/ins16_css.css', 'utf8').replace(/\s+$/, '');
  const css14 = fs.readFileSync('/home/user/_audit/ins14_css.css', 'utf8');
  const anchor = css14.replace(/\s+$/, '').slice(-60);
  if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins14 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins16_css appended (' + css.length + ' chars)');
} else console.log('  · ins16_css already present, skipped');

/* ---- ins16_html immediately after <body> ---- */
if (!doc.includes('id="bootVeil"')){
  const html = fs.readFileSync('/home/user/_audit/ins16_html.html', 'utf8').replace(/\s+$/, '');
  if (doc.split('<body>').length - 1 !== 1){ console.error('<body> not unique'); process.exit(1); }
  doc = doc.replace('<body>', () => '<body>\n' + html + '\n');
  console.log('  ✔ ins16_html inserted after <body> (' + html.length + ' chars)');
} else console.log('  · ins16_html already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | no surgical pairs this round');
