/* unit13 — Boot background rotation pure logic: pool integrity, pointer advance,
   storage-off fallback, frame wrapping, DOM-free safety. */
const fs = require('fs');
const vm = require('vm');
const SRC = fs.readFileSync('/home/user/_audit/ins13_js.js', 'utf8');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

/* --- run DOM-free first: must not throw, must still export test surface --- */
const sand1 = { window: {}, console };
vm.runInNewContext(SRC, sand1, { filename: 'ins13_js.js' });
const R1 = sand1.window.__bootBgRotation;

console.log('[1] pool integrity');
ok(R1 && Array.isArray(R1.pool) && R1.pool.length === 5, 'pool holds exactly 5 frames (R24: +feynman)');
ok(R1.pool.every(f => /^boot-bg-(void|palace|babel|torii|feynman)-hq\.jpg$/.test(f)), 'all frames are the shipped HQ companions');
ok(R1.pool[0] === 'boot-bg-void-hq.jpg' && R1.pool[1] === 'boot-bg-palace-hq.jpg'
   && R1.pool[2] === 'boot-bg-babel-hq.jpg' && R1.pool[3] === 'boot-bg-torii-hq.jpg'
   && R1.pool[4] === 'boot-bg-feynman-hq.jpg',
   'order = user pick: 6 → 2 → 7 → 8 → FEYNMAN');
ok(R1.frame(-1) === R1.pool[3] && R1.frame(7) === R1.pool[0] && R1.frame(8) === R1.pool[4], 'frame() wraps negatives and overflow (mod 7 schedule positions)');
ok(Array.isArray(R1.schedule) && R1.schedule.join(',') === '0,4,1,4,2,4,3', 'R25 weighted schedule exposed: [0,4,1,4,2,4,3]');
ok(R1.schedule.filter(i => i === 4).length === 3 && [0, 1, 2, 3].every(i => R1.schedule.indexOf(i) !== -1),
   'FEYNMAN weighted 3 slots, every other frame ≥ 1 slot');
ok(R1.key === 'csir_boot_bg_ptr_v1', 'pointer lives in its OWN localStorage key (never in backup payloads)');

console.log('[2] DOM-free safety');
ok(vm.runInNewContext, 'sandbox ran to completion (no document/localStorage available) ✔ implicitly');

/* --- storage-backed advance: fresh sandbox WITH fake localStorage --- */
console.log('[3] pointer advance cycle');
const store = {};
const fakeLS = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); }
};
const sand2 = { window: {}, console, localStorage: fakeLS };
vm.runInNewContext(SRC, sand2, { filename: 'ins13_js.js' });
const R2 = sand2.window.__bootBgRotation;
const seq = [R2.nextIndex(), R2.nextIndex(), R2.nextIndex(), R2.nextIndex(), R2.nextIndex(), R2.nextIndex(), R2.nextIndex(), R2.nextIndex()];
ok(seq.join(',') === '0,1,2,3,4,5,6,0', 'pointer walks all 7 schedule slots then wraps (got ' + seq.join(',') + ')');
ok(store[R2.key] === '1', 'persisted pointer = next slot after 8 opens (1 — one full weighted cycle done)');
ok(R2.frame(parseInt(store[R2.key], 10)) === 'boot-bg-feynman-hq.jpg', 'slot 1 maps to FEYNMAN next (first bias hit)');
const dealt = seq.map(i => R2.frame(i));
ok(dealt.filter(f => f === 'boot-bg-feynman-hq.jpg').length === 3, '8 opens dealt FEYNMAN exactly 3× (cycle weights hold live)');

/* --- storage-off fallback: getItem/setItem throw --- */
console.log('[4] storage-off fallback');
const deadLS = { getItem(){ throw new Error('denied'); }, setItem(){ throw new Error('denied'); } };
const sand3 = { window: {}, console, localStorage: deadLS };
vm.runInNewContext(SRC, sand3, { filename: 'ins13_js.js' });
const R3 = sand3.window.__bootBgRotation;
const seq3 = [R3.nextIndex(), R3.nextIndex(), R3.nextIndex(), R3.nextIndex(), R3.nextIndex(), R3.nextIndex(), R3.nextIndex(), R3.nextIndex()];
ok(seq3.join(',') === '0,1,2,3,4,5,6,0', 'session counter still walks the 7-slot schedule when storage is dead');

console.log('[5] paint() defensive paths');
const calls = [];
const fakeOverlay = { style: { setProperty: (p, v) => calls.push([p, v]) } };
R1.paint(fakeOverlay); /* R1 has no localStorage → session fallback, fine */
ok(calls.length === 1 && calls[0][0] === '--boot-bg', 'paint stamps exactly one --boot-bg property');
ok(/^url\("boot-bg-(void|palace|babel|torii|feynman)-hq\.jpg"\)$/.test(calls[0][1]), 'value is a quoted local jpg url: ' + calls[0][1]);
R1.paint(fakeOverlay);
ok(calls[1][1].includes('boot-bg-feynman-hq.jpg'), 'second paint = FEYNMAN (schedule slot 1 — bias visible from boot #2)');
ok(R1.paint(null) === undefined && R1.paint({}) === undefined, 'paint(null)/paint({}) no-op without throwing');

console.log('\nunit13: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
