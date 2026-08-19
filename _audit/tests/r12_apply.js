/* Round 12 apply (idempotent):
   1. surgical bug-fix pairs caught by the 12×4 audit (archived → surgical_r12.json)
   2. ins11_css modal fit & scroll fix (append-if-absent)
   Re-running this script is safe: applied pieces are skipped. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

const PAIRS = [];
const pair = (name, oldS, newS) => PAIRS.push({name, old: oldS, new: newS});

/* ---- AUDIT BUG FIXES (crashes found by smoke13 at specific levels) ---- */
pair('fix maze hearts: noobie 5 lives crashed repeat(3-5)',
`document.getElementById('mazeLives').textContent='♥'.repeat(lives)+'♡'.repeat(3-lives);`,
`document.getElementById('mazeLives').textContent='♥'.repeat(lives)+'♡'.repeat(Math.max(0,3-lives));`);

pair('fix spirit gems: noobie 5 sanity crashed repeat(3-5)',
`document.getElementById('spiritStability').textContent='◆'.repeat(stability)+'◇'.repeat(3-stability);`,
`document.getElementById('spiritStability').textContent='◆'.repeat(stability)+'◇'.repeat(Math.max(0,3-stability));`);

pair('fix runner hearts: noobie 5 lives crashed repeat(3-5)',
`document.getElementById('neonLives').textContent='♥'.repeat(lives)+'♡'.repeat(3-lives);`,
`document.getElementById('neonLives').textContent='♥'.repeat(lives)+'♡'.repeat(Math.max(0,3-lives));`);

pair('fix duel: markup ids telegraph but draw() wrote to non-existent #duelIntentV2 (every draw crashed)',
`'/8';intentEl.textContent=intent;telegraph.textContent='GUARDIAN TELEGRAPH · '+intent;}`,
`'/8';if(intentEl)intentEl.textContent=intent;telegraph.textContent='GUARDIAN TELEGRAPH · '+intent;}`);

/* ---- run surgical pairs (skip if already applied) ---- */
const manifest = [];
for (const p of PAIRS){
  const nOld = doc.split(p.old).length - 1;
  const nNew = doc.split(p.new).length - 1;
  if (nNew === 1 && nOld === 0){ console.log('  · ' + p.name + ' (already applied, skipped)'); manifest.push(p); continue; }
  if (nOld !== 1){ console.error('PAIR FAIL [' + p.name + ']: old found ' + nOld + '×, new ' + nNew + '×'); process.exit(1); }
  doc = doc.replace(p.old, () => p.new);
  manifest.push(p);
  console.log('  ✔ ' + p.name + ' (' + p.old.length + ' → ' + p.new.length + ' chars)');
}

/* ---- ins11_css (append-if-absent, after ins10 block) ---- */
if (!doc.includes('ROUND 12 — break-overlay fit & scroll fix')){
  const css = fs.readFileSync('/home/user/_audit/ins11_css.css', 'utf8').replace(/\s+$/, '');
  const css10 = fs.readFileSync('/home/user/_audit/ins10_css.css', 'utf8');
  const anchor = css10.replace(/\s+$/, '').slice(-60);
  if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins10 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins11_css appended (' + css.length + ' chars)');
} else console.log('  · ins11_css already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
fs.writeFileSync('/home/user/_audit/surgical_r12.json', JSON.stringify({round: 12, note: 'Audit crash fixes (repeat-negative RangeErrors at NOOBIE in maze/spirit/runner; duel null #duelIntentV2). Verifier reverts these new→old after stripping insertion blocks.', pairs: manifest}, null, 1));
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | manifest: _audit/surgical_r12.json (' + manifest.length + ' pairs)');
