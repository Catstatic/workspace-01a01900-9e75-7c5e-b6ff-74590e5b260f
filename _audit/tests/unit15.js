/* unit15 — Round 16 EMBEDDED backdrops: map integrity, monkey-patch correctness, frame hygiene. */
const fs = require('fs');
const vm = require('vm');
const EMB = fs.readFileSync('/home/user/_audit/ins15_js.js', 'utf8');
const ROT = fs.readFileSync('/home/user/_audit/ins13_js.js', 'utf8');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

console.log('[1] embed map integrity');
const mapMatch = EMB.match(/var EMBED=\{([\s\S]*?)\n  \};/);
ok(!!mapMatch, 'EMBED map literal present');
const entries = [...EMB.matchAll(/^    "(boot-bg-[\w-]+-hq\.jpg)":"(data:image\/jpeg;base64,[A-Za-z0-9+/=]+)",?$/gm)];
ok(entries.length === 5, 'exactly 5 embedded frames (R24: + feynman — got ' + entries.length + ')');
ok(new Set(entries.map(e => e[1])).size === 5, '5 distinct frame keys');
/* decode each payload and verify it IS a jpeg with sane size */
let jpegOk = true, sizes = [];
for (const e of entries){
  const buf = Buffer.from(e[2].split(',')[1], 'base64');
  sizes.push(buf.length);
  if (!(buf[0] === 0xFF && buf[1] === 0xD8 && buf[buf.length-2] === 0xFF && buf[buf.length-1] === 0xD9)) jpegOk = false;
}
ok(jpegOk, 'every payload decodes to a valid JPEG (FFD8…FFD9). sizes: ' + sizes.map(s => Math.round(s/1024) + 'K').join(', '));
ok(entries.every(e => !/[\s"'<>`\\]/.test(e[2])), 'payloads are single-token (no whitespace/quotes/backslashes — CSS url() safe)');
/* payloads must actually equal the shipped companions */
const files = { 'boot-bg-void-hq.jpg':1, 'boot-bg-palace-hq.jpg':1, 'boot-bg-babel-hq.jpg':1, 'boot-bg-torii-hq.jpg':1, 'boot-bg-feynman-hq.jpg':1 };
let byteMatch = true;
for (const e of entries){
  const onDisk = fs.readFileSync('/home/user/project/' + e[1]);
  if (!onDisk.equals(Buffer.from(e[2].split(',')[1], 'base64'))) byteMatch = false;
}
ok(byteMatch, 'embedded bytes == companion bytes on disk (no drift)');

console.log('[2] monkey-patch behavior (rotation runs BEFORE embed script)');
const store = {};
const fakeLS = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
const sand = { window: {}, console, localStorage: fakeLS };
vm.runInNewContext(ROT, sand, { filename: 'ins13_js.js' });
vm.runInNewContext(EMB, sand, { filename: 'ins15_js.js' });
const R = sand.window.__bootBgRotation;
ok(R.embedded === true, 'rotation module flagged embedded=true');
ok(sand.window.__bootBgEmbed && sand.window.__bootBgEmbed.active === true, '__bootBgEmbed.active set');
const f0 = R.frame(0);
ok(f0.startsWith('data:image/jpeg;base64,/9j/'), 'frame(0) now returns a JPEG data URI');
ok(f0.length > 500000, 'data URI carries a full-quality payload (' + Math.round(f0.length/1024) + ' KB)');
ok(R.frame(0) === R.frame(7), 'index wrapping still works through the patch (R25: 7-slot weighted schedule)');
ok(R.pool.length === 5 && R.pool[0] === 'boot-bg-void-hq.jpg' && R.pool[4] === 'boot-bg-feynman-hq.jpg', 'pool list: 4 originals + feynman at the tail');

console.log('[3] paint() through the patch');
const stamped = [];
const fakeOverlay = { style: { setProperty: (p, v) => stamped.push([p, v]) } };
R.paint(fakeOverlay);
ok(stamped.length === 1 && stamped[0][0] === '--boot-bg', 'paint still stamps the same CSS var');
ok(/^url\("data:image\/jpeg;base64,/.test(stamped[0][1]), 'stamped value is a url("data:…") — self-contained');

console.log('[4] no-rotation grace');
const sand2 = { window: {}, console };
vm.runInNewContext(EMB, sand2, { filename: 'ins15_js.js' });
ok(sand2.window.__bootBgEmbed && !sand2.window.__bootBgEmbed.active, 'without rotation module: map stored, no active flag, no crash');

console.log('\nunit15: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
