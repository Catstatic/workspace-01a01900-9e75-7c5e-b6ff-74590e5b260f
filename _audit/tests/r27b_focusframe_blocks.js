/* FOCUSFRAME (round 27) block installer — companion to reapply_pairs.js 27 (fg: pair).
   The original r27 apply script lived only in /tmp (wiped 2026-08-14); these anchors
   reproduce the audited placement:
     - ins25_css appended after the ins24_css master tail (css chain convention).
     - ins25_js in its own <script> before the r31 topicforge companion tags
       (r27 historically preceded r31, and r31 anchored on </body>). */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const A = '/home/user/_audit/';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

/* ---- ins25_css after ins24_css ---- */
if (!doc.includes('FOCUSFRAME — TEAL GOAL BRACKETS & READING TIMER (ROUND 27 · part 1: skin)')){
  const css = fs.readFileSync(A + 'ins25_css.css', 'utf8').replace(/\s+$/, '');
  const css24 = fs.readFileSync(A + 'ins24_css.css', 'utf8');
  const anchor = css24.replace(/\s+$/, '').slice(-600); /* tail≤400 chars collides with a similar !important rule block; 600 is unique */
  if (n(doc, anchor) !== 1){ console.error('✘ ins24_css tail anchor not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins25_css appended (' + css.length + ' chars)');
} else console.log('  · ins25_css already present, skipped');

/* ---- ins25_js before the r31 topicforge companion tags ---- */
if (!doc.includes('FOCUSFRAME — TEAL GOAL BRACKETS & READING TIMER (ROUND 27 · part 2: brain)')){
  const js = fs.readFileSync(A + 'ins25_js.js', 'utf8').replace(/\s+$/, '');
  const anchor = '<script src="./topicforge-map.js"></script>';
  if (n(doc, anchor) !== 1){ console.error('✘ topicforge tag anchor not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => '\n<script>\n' + js + '\n\n</script>\n' + anchor);
  console.log('  ✔ ins25_js installed (' + js.length + ' chars)');
} else console.log('  · ins25_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars (Δ ' + (doc.length - origLen) + ')');
