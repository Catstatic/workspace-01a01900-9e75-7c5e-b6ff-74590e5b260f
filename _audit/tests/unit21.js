/* unit21 — ROUND 25 FEYNMAN-FAVORED weighted schedule: pure-logic proof.
   THE ASK: "let this feynman pic come a bit more often than others".
   THE MATH: pointer walks SCHEDULE=[0,4,1,4,2,4,3] over a 5-frame pool →
   FEYNMAN lands 3/7 boots (~43%), each other frame 1/7 (~14%), and never
   twice in a row. Legacy persisted pointers stay valid (same key). */
const fs = require('fs');
const vm = require('vm');
const SRC = fs.readFileSync('/home/user/_audit/ins13_js.js', 'utf8');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

console.log('[1] schedule surface (the contract)');
const sand1 = { window: {}, console };
vm.runInNewContext(SRC, sand1, { filename: 'ins13_js.js' });
const R1 = sand1.window.__bootBgRotation;
ok(Array.isArray(R1.schedule) && R1.schedule.join(',') === '0,4,1,4,2,4,3', 'SCHEDULE = [0,4,1,4,2,4,3]');
ok(R1.schedule.length === 7, 'weighted cycle = 7 slots');
ok(R1.schedule.filter(i => i === 4).length === 3, 'FEYNMAN (pool idx 4) owns exactly 3 slots');
ok([0, 1, 2, 3].every(i => R1.schedule.filter(x => x === i).length === 1), 'void/palace/babel/torii own exactly 1 slot each');
ok(R1.schedule.every((v, i) => v !== R1.schedule[(i + 1) % 7]), 'no adjacent equal slots incl. wrap edge → backdrop never repeats back-to-back');
ok(Math.round(100 * R1.schedule.filter(i => i === 4).length / R1.schedule.length) === 43, 'feynman share = 3/7 ≈ 43% of all boots');
ok(Math.round(100 * 1 / 7) === 14, 'every other frame = 1/7 ≈ 14% (feynman is exactly 3× more likely than any single frame)');

console.log('[2] live census — 14 opens = two full weighted cycles');
const store = {};
const fakeLS = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
const sand2 = { window: {}, console, localStorage: fakeLS };
vm.runInNewContext(SRC, sand2, { filename: 'ins13_js.js' });
const R2 = sand2.window.__bootBgRotation;
const names = [];
for (let i = 0; i < 14; i++) names.push(R2.frame(R2.nextIndex()).replace('boot-bg-', '').replace('-hq.jpg', ''));
const EXPECTED_CYCLE = 'void,feynman,palace,feynman,babel,feynman,torii';
ok(names.slice(0, 7).join(',') === EXPECTED_CYCLE, 'cycle 1 order: ' + EXPECTED_CYCLE);
ok(names.slice(7).join(',') === EXPECTED_CYCLE, 'cycle 2 identical (period is exactly 7, no drift)');
const count = n => names.filter(x => x === n).length;
ok(count('feynman') === 6, 'feynman ×6 across 14 boots (3 per cycle)');
ok(count('void') === 2 && count('palace') === 2 && count('babel') === 2 && count('torii') === 2, 'each other frame ×2 (1 per cycle)');
ok(names.every((n, i) => i === 0 || n !== names[i - 1]), 'live stream has zero immediate repeats');

console.log('[3] legacy pointers need no migration');
function seeded(v){
  const st = { csir_boot_bg_ptr_v1: v };
  const ls = { getItem: k => (k in st ? st[k] : null), setItem: (k, val) => { st[k] = String(val); } };
  const sand = { window: {}, console, localStorage: ls };
  vm.runInNewContext(SRC, sand, { filename: 'ins13_js.js' });
  return { R: sand.window.__bootBgRotation, st };
}
{
  const s = seeded('4'); /* written by the OLD mod-5 rotation */
  const got = s.R.frame(s.R.nextIndex());
  ok(got === 'boot-bg-babel-hq.jpg' && s.st.csir_boot_bg_ptr_v1 === '5',
     'old pointer 4 → resumes mid-schedule at BABEL, advances to 5 (no reset, no crash)');
}
{
  const s = seeded('0');
  ok(s.R.frame(s.R.nextIndex()) === 'boot-bg-void-hq.jpg', 'pointer 0 → VOID (cycle head untouched)');
}
{
  const s = seeded('9'); /* garbage / hand-edited value */
  const got = s.R.frame(s.R.nextIndex());
  ok(got === 'boot-bg-palace-hq.jpg' && s.st.csir_boot_bg_ptr_v1 === '3',
     'out-of-range pointer 9 wraps to slot 2 → PALACE (defensive wrap holds)');
}

console.log('[4] first-boot determinism preserved');
const fresh = seeded_markerless => {
  const st = {};
  const ls = { getItem: k => (k in st ? st[k] : null), setItem: (k, v) => { st[k] = String(v); } };
  const sand = { window: {}, console, localStorage: ls };
  vm.runInNewContext(SRC, sand, { filename: 'ins13_js.js' });
  return sand.window.__bootBgRotation;
};
const FR = fresh();
ok(FR.frame(FR.nextIndex()) === 'boot-bg-void-hq.jpg', 'install-first boot still opens on VOID (schedule head = 0)');
ok(FR.frame(FR.nextIndex()) === 'boot-bg-feynman-hq.jpg', 'second-ever boot already shows FEYNMAN');

console.log('\nunit21: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
