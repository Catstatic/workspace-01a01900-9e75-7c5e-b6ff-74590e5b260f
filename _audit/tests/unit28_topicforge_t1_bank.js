/* UNIT 28 — TOPICFORGE T1 pilot bank forensics (pure Node, no DOM).
   Verifies topicforge-bank-quantum.js: structure, stamp, coverage vs the
   T0 map, unique ids/stems, KaTeX-strict math, answer distribution. */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const katex = require('/tmp/domt/node_modules/katex');

let pass = 0, fail = 0;
const fails = [];
function ok(cond, label) { if (cond) pass++; else { fail++; fails.push(label); } }
function eq(a, b, label) { ok(a === b, label + ' [got ' + JSON.stringify(a) + ' want ' + JSON.stringify(b) + ']'); }

const PROJ = '/home/user/project';
const bankSrc = fs.readFileSync(path.join(PROJ, 'topicforge-bank-quantum.js'), 'utf8');
const mapSrc = fs.readFileSync(path.join(PROJ, 'topicforge-map.js'), 'utf8');

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(mapSrc, ctx);
vm.runInContext(bankSrc, ctx);
const MAP = ctx.window.TOPICFORGE_MAP;
const LANE = ctx.window.TOPICFORGE_BANKS && ctx.window.TOPICFORGE_BANKS.quantum;

/* ---- 1. mount + meta ---- */
ok(!!LANE, 'bank mounts window.TOPICFORGE_BANKS.quantum');
ok(!!LANE && LANE.meta.aiGenerated === true, 'meta.aiGenerated === true');
ok(!!LANE && /AI-GENERATED/.test(LANE.meta.label), 'meta.label carries AI-GENERATED');
eq(LANE.meta.minutes, 55, 'fleet minutes = 55');
const stamp = LANE.meta.stamp;
eq(stamp.seed + stamp.standard + stamp.apex, 25, 'stamp sums to 25');
eq(Math.round(18 * 3.5 + 7 * 5), LANE.meta.maxScore, 'maxScore = 98');

/* ---- 2. structure ---- */
const mocks = LANE.mocks;
eq(mocks.length, 5, 'exactly 5 mocks');
const ids = new Set();
const stems = new Set();
const laneRows = MAP.lanes.find(l => l.id === 'quantum');
const mapSubs = laneRows.rows.map(r => r.id);
const fleetSubs = {};
let segCount = 0, segErr = 0;
const segErrList = [];
function scanMath(txt, owner) {
  // extract $$...$$ first, then $...$ ; assert no stray $ remains
  let rest = String(txt);
  const disp = rest.match(/\$\$[\s\S]+?\$\$/g) || [];
  disp.forEach(s => {
    segCount++;
    const body = s.slice(2, -2);
    try { katex.renderToString(body, { displayMode: true, throwOnError: true, strict: true }); }
    catch (e) { segErr++; segErrList.push(owner + ' DISPLAY: ' + body.slice(0, 60) + ' :: ' + e.message); }
  });
  rest = rest.replace(/\$\$[\s\S]+?\$\$/g, ' ');
  const inl = rest.match(/\$[^$]+?\$/g) || [];
  inl.forEach(s => {
    segCount++;
    const body = s.slice(1, -1);
    try { katex.renderToString(body, { displayMode: false, throwOnError: true, strict: true }); }
    catch (e) { segErr++; segErrList.push(owner + ' INLINE: ' + body.slice(0, 60) + ' :: ' + e.message); }
  });
  const leftover = rest.replace(/\$[^$]+?\$/g, ' ');
  ok(!leftover.includes('$'), owner + ': no unbalanced/lone $ residue');
}
mocks.forEach(m => {
  ok(/^TF-QM-0[1-5]$/.test(m.id), m.id + ': id pattern');
  eq(m.problems.length, 25, m.id + ': exactly 25 problems');
  eq(m.minutes, 55, m.id + ': minutes 55');
  const d = { seed: 0, standard: 0, apex: 0 };
  const letters = [0, 0, 0, 0];
  m.problems.forEach((p, i) => {
    const wantId = m.id + '-Q' + String(i + 1).padStart(2, '0');
    eq(p.id, wantId, 'problem id sequence ' + wantId);
    ok(!ids.has(p.id), p.id + ' unique id');
    ids.add(p.id);
    const norm = p.q.toLowerCase().replace(/[^a-z0-9\\{}^_+\-=]/g, '');
    ok(!stems.has(norm), p.id + ' unique stem');
    stems.add(norm);
    ok(d[p.diff] !== undefined, p.id + ': valid diff');
    d[p.diff]++;
    ok(Array.isArray(p.o) && p.o.length === 4, p.id + ': 4 options');
    ok(new Set(p.o).size === 4, p.id + ': 4 DISTINCT options');
    p.o.forEach(o => ok(String(o).trim().length > 0, p.id + ': non-empty option'));
    ok(Number.isInteger(p.a) && p.a >= 0 && p.a <= 3, p.id + ': answer index 0..3');
    letters[p.a]++;
    ok(String(p.q).length >= 30, p.id + ': stem >=30 chars');
    ok(String(p.sol).length >= 80, p.id + ': solution >=80 chars');
    ok(String(p.vfy).length >= 30, p.id + ': verify >=30 chars');
    ok(!!p.sub && !!p.concept, p.id + ': sub+concept tagged');
    ok(!/[<>]/.test(p.q + p.sol + p.vfy + p.o.join('')), p.id + ': no raw < or > anywhere');
    ok(!/\t|\u2212|\u20B9/.test(p.q + p.sol + p.vfy + p.o.join('')), p.id + ': no tab / unicode-minus / rupee');
    ['q', 'sol', 'vfy'].forEach(f => {
      const dollarCount = (String(p[f]).match(/\$/g) || []).length;
      ok(dollarCount % 2 === 0, p.id + ' field ' + f + ': even $ count');
      scanMath(p[f], p.id + '.' + f);
    });
    p.o.forEach((o, oi) => scanMath(o, p.id + '.o' + oi));
    fleetSubs[p.sub] = (fleetSubs[p.sub] || 0) + 1;
  });
  eq(d.seed, stamp.seed, m.id + ': seed stamp = 6');
  eq(d.standard, stamp.standard, m.id + ': standard stamp = 12');
  eq(d.apex, stamp.apex, m.id + ': apex stamp = 7');
  letters.forEach((n, li) => ok(n >= 4, m.id + ': answer letter ' + 'ABCD'[li] + ' used >=4 times (got ' + n + ')'));
});
eq(ids.size, 125, '125 unique problem ids');
eq(stems.size, 125, '125 unique stems (no-dup-stem gate)');

/* ---- 3. coverage matrix vs T0 map ---- */
mapSubs.forEach(s => ok((fleetSubs[s] || 0) >= 1, 'coverage: sub ' + s + ' forged >=1 across fleet'));
mapSubs.forEach(s => ok((fleetSubs[s] || 0) >= 3, 'depth: sub ' + s + ' has >=3 problems'));
eq(Object.keys(fleetSubs).length, mapSubs.length, 'fleet spans exactly the mapped quantum subtopics');
const minedTop3 = laneRows.rows.slice().sort((a, b) => b.hits - a.hits).slice(0, 3).map(r => r.id).join(',');
const fleetTop3 = Object.keys(fleetSubs).sort((a, b) => fleetSubs[b] - fleetSubs[a]).slice(0, 3).join(',');
eq(fleetTop3, minedTop3, 'fleet top-3 subtopics mirror mined top-3 (' + minedTop3 + ')');
// no large inversions: any pair with a mined gap >=10 must not be inverted in fleet order
let inversions = 0;
const rows = laneRows.rows;
for (let i = 0; i < rows.length; i++) for (let j = 0; j < rows.length; j++) {
  if (rows[i].hits - rows[j].hits >= 10 && fleetSubs[rows[i].id] < fleetSubs[rows[j].id]) inversions++;
}
eq(inversions, 0, 'no weight inversions for mined gaps >=10');

/* ---- 4. KaTeX global ---- */
eq(segErr, 0, 'KaTeX-strict: 0 errors across ' + segCount + ' math segments');
ok(segCount >= 500, 'math segment count substantial (' + segCount + ')');
ok(scanCount => true, 'noop');
ok(segErr === 0, 'no render errors');
if (segErrList.length) console.log(segErrList.slice(0, 10).join('\n'));

/* ---- 5. label + file hygiene ---- */
ok(/AI-GENERATED PRACTICE CONTENT/.test(bankSrc), 'file header carries AI-GENERATED banner');
ok(!/<body|<\/body|<\/style/.test(bankSrc), 'no forbidden master-breaking tags in companion');
ok(/window\.TOPICFORGE_PANEL_RENDER/.test(bankSrc), 'bank pings panel renderer');

console.log('\nUNIT28 RESULT: ' + pass + ' passed, ' + fail + ' failed · math segments: ' + segCount);
if (fail) { console.log('FAILURES:\n' + fails.slice(0, 30).join('\n')); process.exit(1); }
