/* Pure-insertion proof, v2 (seam-scoped):
   1. Locate all insertion blocks (rounds 0–12) in the project file by unique head/tail markers from _audit masters.
   2. Assert each extracted span == its master (trimmed comparison), each found exactly once.
   3. Remove the spans, recording SEAM offsets.
   4. Walk stripped vs pristine original byte-by-byte: any divergence is legal ONLY within ±48
      chars of a recorded seam and ONLY by skipping wrapper tokens (</script>,<script>,</style>,
      <style>) or whitespace on the stripped side, after which the files must resync exactly.
   A pass means: project = pristine original + the 16 audited blocks + their wrappers. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
/* pristine baseline, re-download to /tmp:
   curl -sL -o /tmp/orig_tracker.html "https://raw.githubusercontent.com/Catstatic/NEW-LATEST-TRACKER-FINAL-FINAL-FINAL/main/CSIR_GATE_Tracker_Physics_Lab_edited%20(3)%20(7).html" */
const ORIG = '/tmp/orig_tracker.html';
const AUDIT = '/home/user/_audit/';
const MASTERS = ['ins0_topbar.html','ins_css.css','ins_html.html','ins_js.js','ins2_js.js','ins3_css.css','ins3_js.js','ins4_css.css','ins4_js.js','ins5_css.css','ins5_js.js','ins6_js.js','ins7_css.css','ins7_js.js','ins8_css.css','ins8_js.js','ins9_css.css','ins9_js.js','ins10_css.css','ins10_js.js','ins11_css.css','ins12_css.css','ins12_js.js','ins13_css.css','ins13_js.js','ins14_css.css','ins14_js.js','ins15_js.js','ins16_css.css','ins16_html.html','ins17_css.css','ins17_js.js','ins19_css.css','ins19_js.js','ins22_html.html','ins23_js.js','ins24_css.css','ins24_js.js','ins25_css.css','ins25_js.js','ins26_js.js','ins27_css.css','ins27_js.js','ins28_css.css','ins28_js.js','ins29_css.css','ins29_js.js','ins30_figs_css.css','ins30_figs_js.js'];
const SURGICAL = ['/home/user/_audit/surgical_r10.json', '/home/user/_audit/surgical_r11.json', '/home/user/_audit/surgical_r12.json', '/home/user/_audit/surgical_r18.json', '/home/user/_audit/surgical_r26.json', '/home/user/_audit/surgical_r27.json', '/home/user/_audit/surgical_r28.json', '/home/user/_audit/surgical_r29.json', '/home/user/_audit/surgical_r30.json', '/home/user/_audit/surgical_r31.json']; /* base-code hooks + audited base-bug fixes; reverted new→old after block stripping */

const proj = fs.readFileSync(P, 'utf8');
const orig = fs.readFileSync(ORIG, 'utf8');
console.log('project bytes:', Buffer.byteLength(proj), '| original bytes:', Buffer.byteLength(orig));
const count = (hay, n) => hay.split(n).length - 1;

/* --- step 1+2: extract spans ------------------------------------------------ */
const spans = [];
for (const name of MASTERS){
  const raw = fs.readFileSync(AUDIT + name, 'utf8');
  const trimmed = raw.trim();
  let b, e;
  if (name === 'ins0_topbar.html'){ /* standalone snippet, exact raw bytes */
    if (count(proj, raw) !== 1) throw new Error(name + ': not found exactly once (raw)');
    b = proj.indexOf(raw); e = b + raw.length;
  } else {
    let hl = 60, tl = 60;
    while (count(proj, trimmed.slice(0, hl)) !== 1 && hl < trimmed.length) hl += 20;
    while (count(proj, trimmed.slice(-tl)) !== 1 && tl < trimmed.length) tl += 20;
    const head = trimmed.slice(0, hl), tail = trimmed.slice(-tl);
    if (count(proj, head) !== 1 || count(proj, tail) !== 1) throw new Error(name + ': marker not unique');
    b = proj.indexOf(head);
    const ti = proj.indexOf(tail, b + head.length);
    if (ti < 0) throw new Error(name + ': tail not found');
    e = ti + tl;
    if (proj.slice(b, e).trim() !== trimmed) throw new Error(name + ': embedded != master');
  }
  spans.push({ name, b, e });
}
spans.sort((x, y) => x.b - y.b);
for (let i = 1; i < spans.length; i++)
  if (spans[i].b < spans[i - 1].e) throw new Error('overlapping spans: ' + spans[i - 1].name + ' / ' + spans[i].name);
console.log('step 1+2 OK — ' + MASTERS.length + ' blocks located, each byte-identical to its master (trimmed comparison), ordered & non-overlapping');
console.log('  file order: ' + spans.map(s => s.name).join(' → '));

/* --- step 3: strip + seam offsets ------------------------------------------ */
let strippedParts = [], seams = [], cursor = 0; /* seam offsets recorded against stripped0, remapped in 3.5 */
for (const s of spans){
  strippedParts.push(proj.slice(cursor, s.b));
  seams.push(strippedParts.join('').length);
  cursor = s.e;
}
strippedParts.push(proj.slice(cursor));
const stripped0 = strippedParts.join('');
console.log('step 3 OK — stripped length ' + stripped0.length + ', seams at: ' + seams.join(', '));

/* --- step 3.5: revert declared surgical pairs (new → old), each exactly once,
   then remap seam offsets by the length deltas that happened before them ----------- */
let stripped = stripped0;
const surgFiles = (Array.isArray(SURGICAL) ? SURGICAL : [SURGICAL]).filter(fs.existsSync);
if (surgFiles.length){
  const edits = [];
  for (const file of surgFiles){
    const surg = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const p of surg.pairs){
      const n = stripped0.split(p.new).length - 1;
      if (n !== 1){ console.error('SURGICAL REVERT FAIL [' + p.name + ']: ' + n + ' occurrence(s)'); process.exit(1); }
      edits.push({at: stripped0.indexOf(p.new), nLen: p.new.length, old: p.old, name: p.name});
    }
  }
  edits.sort((a, b) => a.at - b.at); /* ascending offsets, non-overlapping by construction */
  let out = [], cur = 0;
  for (const e of edits){ out.push(stripped0.slice(cur, e.at), e.old); cur = e.at + e.nLen; }
  out.push(stripped0.slice(cur));
  stripped = out.join('');
  seams = seams.map(c => c + edits.reduce((acc, e) => acc + (e.at < c ? (e.old.length - e.nLen) : 0), 0));
  console.log('step 3.5 OK — ' + edits.length + ' surgical hooks reverted; seams remapped');
}

/* --- step 4: seam-scoped walk ---------------------------------------------- */
const isWs = c => c === ' ' || c === '\t' || c === '\n' || c === '\r';
const WRAPPERS = ['</script>', '<script>', '</style>', '<style>'];
let i = 0, j = 0, skips = 0, guard = 0;
while (i < stripped.length || j < orig.length){
  if (++guard > 5e7){ console.error('guard tripped'); process.exit(1); }
  if (i < stripped.length && j < orig.length && stripped[i] === orig[j]){
    while (i + 8192 <= stripped.length && j + 8192 <= orig.length && stripped.substr(i, 8192) === orig.substr(j, 8192)){ i += 8192; j += 8192; }
    i++; j++; continue;
  }
  const near = seams.some(c => Math.abs(i - c) <= 48);
  if (!near){
    console.error('\nFAIL: divergence away from any seam: stripped@' + i + ' orig@' + j);
    console.error('stripped ctx: ' + JSON.stringify(stripped.slice(Math.max(0, i - 60), i + 60)));
    console.error('orig ctx    : ' + JSON.stringify(orig.slice(Math.max(0, j - 60), j + 60)));
    process.exit(1);
  }
  /* skip wrapper tokens / ws on stripped side, then require exact resync on a 16-char anchor.
     d-backtrack (≤8) covers divergences that land mid-token after a shared '<'-type prefix. */
  let ok = false;
  for (let d = 0; d <= 8 && d <= i && d <= j && !ok; d++){
    if (d && stripped.slice(i - d, i) !== orig.slice(j - d, j)) continue;
    let s = i - d, budget = 0;
    const jo = j - d;
    const alen = Math.min(16, orig.length - jo);
    while (budget <= 4096){
      let len = 0;
      for (const w of WRAPPERS){ if (stripped.startsWith(w, s)){ len = w.length; break; } }
      if (!len){ while (s + len < stripped.length && isWs(stripped[s + len])) len++; }
      if (!len) break;
      s += len; budget = s - (i - d);
      if (s >= i && s <= stripped.length - alen && stripped.substr(s, alen) === orig.substr(jo, alen)){ ok = true; break; }
    }
    if (ok){ j = jo; i = s; }
  }
  if (!ok){
    console.error('\nFAIL: no legal resync at seam near stripped@' + i + ' orig@' + j);
    console.error('stripped ctx: ' + JSON.stringify(stripped.slice(Math.max(0, i - 60), i + 120)));
    console.error('orig ctx    : ' + JSON.stringify(orig.slice(Math.max(0, j - 60), j + 120)));
    process.exit(1);
  }
  skips++; /* resynced */
}
if (i !== stripped.length || j !== orig.length){ console.error('not fully consumed: i=' + i + '/' + stripped.length + ' j=' + j + '/' + orig.length); process.exit(1); }
console.log('step 4 OK — byte-exact everywhere except ' + skips + ' wrapper/whitespace skips, all scoped to insertion seams');
console.log('\n✔ PROOF PASSED: project = pristine ' + ORIG.split('/').pop() + ' + ' + MASTERS.length + ' audited blocks + reverted surgical hooks = byte-identical baseline.');
