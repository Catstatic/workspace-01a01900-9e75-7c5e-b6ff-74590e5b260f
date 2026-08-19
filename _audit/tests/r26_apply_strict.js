/* Round 26 STRICT replay (rebuild-safe variant of r26_apply + r26_apply2):
   The original apply scripts had idempotency skip-checks (doc.includes(p.new)) that
   misfire on a fresh rebuild: several cut-* pairs' `new` text natively occurs inside
   their own 334-char `old` span (junction look-alike), so they were silently skipped.
   On a fresh replay from pristine we must apply every pair UNCONDITIONALLY, in json
   order, asserting `old` exactly once. Masters ins24_css/ins24_js use the disk (wave-2)
   revisions so the r26_apply2 master swap is unnecessary in a clean build. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const A = '/home/user/_audit/';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

/* ---- surgical pairs: strict, in-order ---- */
const surg = JSON.parse(fs.readFileSync(A + 'surgical_r26.json', 'utf8'));
for (const p of surg.pairs){
  if (n(doc, p.new) === 1 && n(doc, p.old) === 0){ console.log('  · skip (final state present): ' + p.name); continue; }
  if (p.new.includes(p.old) && n(doc, p.new) >= 1){ console.log('  · skip (superstring graft already in place): ' + p.name); continue; }
  if (n(doc, p.old) !== 1){ console.error('✘ ' + p.name + ': old count=' + n(doc, p.old)); process.exit(1); }
  doc = doc.replace(p.old, () => p.new);
  console.log('  ✔ ' + p.name);
}

/* ---- ins24_css after ins19_css ---- */
if (!doc.includes('SKINFORGE + CASTFORGE — VISUAL LAYER (ROUND 26)')){
  const css = fs.readFileSync(A + 'ins24_css.css', 'utf8').replace(/\s+$/, '');
  const css19 = fs.readFileSync(A + 'ins19_css.css', 'utf8');
  const anchor = css19.replace(/\s+$/, '').slice(-60);
  if (n(doc, anchor) !== 1){ console.error('✘ CSS anchor (ins19 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins24_css appended (' + css.length + ' chars)');
} else console.log('  · ins24_css already present, skipped');

/* ---- ins24_js before </body> ---- */
if (!doc.includes('SKINFORGE + CASTFORGE — OVERLAY INJECTOR (ROUND 26)')){
  const js = fs.readFileSync(A + 'ins24_js.js', 'utf8').replace(/\s+$/, '');
  if (n(doc, '</body>') !== 1){ console.error('✘ body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins24_js appended (' + js.length + ' chars)');
} else console.log('  · ins24_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars (Δ ' + (doc.length - origLen) + ')');
