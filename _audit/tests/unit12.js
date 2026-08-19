/* unit12 — Boot Command Center pure logic: quote bank integrity, day-determinism, skip logic. */
const fs = require('fs');
const vm = require('vm');
const SRC = fs.readFileSync('/home/user/_audit/ins12_js.js', 'utf8');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const sandbox = { window: {}, console }; /* no document/localStorage → defensive paths */
vm.runInNewContext(SRC, sandbox, { filename: 'ins12_js.js' });
const BC = sandbox.window.__bootCenter;
const Q = BC._quotes;

console.log('[1] quote bank integrity');
ok(Array.isArray(Q) && Q.length === 64, 'bank holds exactly 64 original lines (got ' + Q.length + ')');
ok(new Set(Q.map(q => q.toLowerCase())).size === Q.length, 'all quotes unique (case-insensitive)');
ok(Q.every(q => typeof q === 'string' && q.trim().length >= 24 && q.length <= 130), 'every line is 24–130 chars: min ' + Math.min(...Q.map(q => q.length)) + ', max ' + Math.max(...Q.map(q => q.length)));
ok(!Q.some(q => /https?:|www\.|@\w/.test(q)), 'no links/handles hiding in the wisdom');
ok(!Q.some(q => /[\u201C\u201D]/.test(q)), 'quotes carry no baked-in quotes (renderer adds them)');
const tones = ['lab coat', 'entropy', 'White Room', 'episode', 'fog', 'PYQ', 'universe'];
ok(tones.every(t => Q.some(q => q.toLowerCase().includes(t.toLowerCase()))), 'tonal spread: physics + discipline + shonen + zen all represented');

console.log('[2] pick-of-the-day determinism');
const d1 = new Date(2026, 7, 12), d2 = new Date(2026, 7, 12), d3 = new Date(2026, 7, 13);
ok(BC.quoteForDay(d1) === BC.quoteForDay(d2), 'same calendar day → same quote');
ok(BC.quoteForDay(d1) === Q[BC._dayIndex && Q.indexOf(BC.quoteForDay(d1))], 'quote comes straight from the bank');
let varied = new Set();
for (let i = 0; i < 300; i++) varied.add(BC.quoteForDay(new Date(2026, 0, 1 + i)));
ok(varied.size >= 56, 'rotation stays interesting over 300 days (' + varied.size + ' distinct lines)');
ok(BC._dayIndex() >= 0 && BC._dayIndex() < Q.length, 'day index in range today');

console.log('[3] skip-greeting logic');
ok(BC._shouldShow('2026-08-12', '2026-08-12') === false, 'same-day skip value suppresses the greeting');
ok(BC._shouldShow('2026-08-11', '2026-08-12') === true, 'yesterday\'s skip does not suppress today');
ok(BC._shouldShow('', '2026-08-12') === true, 'no skip → greet');
ok(BC._skipKey === 'csir_boot_skip_v1', 'dedicated namespaced storage key');

console.log('[4] DOM-free safety');
ok(typeof BC.show === 'function' && typeof BC.hide === 'function', 'public show/hide exist');
BC.hide(); /* no DOM present — must not throw */
ok(true, 'hide() with no DOM is a no-op');

console.log('==========================');
console.log('UNIT12: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
