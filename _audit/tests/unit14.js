/* unit14 — Boot background SHUFFLE pure logic + defensive paths (no DOM needed). */
const fs = require('fs');
const vm = require('vm');
const SRC = fs.readFileSync('/home/user/_audit/ins14_js.js', 'utf8');
const ROT = fs.readFileSync('/home/user/_audit/ins13_js.js', 'utf8');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

/* --- DOM-free: exports test surface, never throws --- */
const sand1 = { window: {}, console };
vm.runInNewContext(SRC, sand1, { filename: 'ins14_js.js' });
const S1 = sand1.window.__bootBgShuffle;

console.log('[1] API surface + null-world safety');
ok(S1 && typeof S1.inject === 'function' && typeof S1.shuffle === 'function', 'exports {inject, shuffle}');
ok(S1.shuffle(null) === undefined && S1.inject(null) === null, 'shuffle(null)/inject(null) no-op, no throw');
ok(S1.shuffle({}) === undefined, 'shuffle on style-less object no-ops');

/* --- with rotation module present: shuffle advances, never repeats --- */
console.log('[2] shuffle via __bootBgRotation (fake overlay + fake storage)');
function makeSand(storage){
  return { window: {}, console, localStorage: storage };
}
const store = {};
const fakeLS = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
const sand2 = makeSand(fakeLS);
vm.runInNewContext(ROT, sand2, { filename: 'ins13_js.js' });
vm.runInNewContext(SRC, sand2, { filename: 'ins14_js.js' });
const R2 = sand2.window.__bootBgRotation, S2 = sand2.window.__bootBgShuffle;

const stamped = [];
const fakeOverlay = {
  style: {
    _v: '',
    setProperty(p, v){ this._v = v; },
    getPropertyValue(p){ return this._v; }
  }
};
const f1 = S2.shuffle(fakeOverlay);
ok(/^boot-bg-\w+-hq\.jpg$/.test(f1), 'shuffle returns the frame it landed on (' + f1 + ')');
ok(fakeOverlay.style._v.includes(f1), 'overlay style actually carries that frame');
const f2 = S2.shuffle(fakeOverlay);
ok(f2 !== f1, 'second shuffle gives a DIFFERENT frame (' + f1 + ' → ' + f2 + ')');
ok(store['csir_boot_bg_ptr_v1'] !== null, 'shared pointer advanced (session resumes after shuffle)');
const i = parseInt(store['csir_boot_bg_ptr_v1'], 10);
ok(R2.frame(i - 1) === f2, 'persisted pointer = one schedule slot past the frame now visible (frame() wraps)');

console.log('[3] no-rotation grace period');
const sand3 = { window: {}, console };
vm.runInNewContext(SRC, sand3, { filename: 'ins14_js.js' });
ok(sand3.window.__bootBgShuffle.shuffle(fakeOverlay) === undefined, 'without __bootBgRotation, shuffle is a silent no-op (rotation load-order safe)');

console.log('\nunit14: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
