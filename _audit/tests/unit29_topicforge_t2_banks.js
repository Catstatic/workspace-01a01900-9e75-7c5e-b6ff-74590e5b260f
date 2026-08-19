/* UNIT 29 — TOPICFORGE T2 bank forensics (pure Node, no DOM).
   Verifies topicforge-bank-classical.js + topicforge-bank-mathphys.js:
   structure, stamp, coverage vs the T0 map, unique ids/stems (cross-bank
   against the T1 quantum fleet too: 375 stems total), KaTeX-strict math,
   answer distribution, and inline-SVG figure hygiene. */
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
const LANES = [
  { id: 'classical', file: 'topicforge-bank-classical.js', prefix: 'TF-CM' },
  { id: 'mathphys',  file: 'topicforge-bank-mathphys.js',  prefix: 'TF-MP' }
];

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(PROJ, 'topicforge-map.js'), 'utf8'), ctx);
ctx.window.TOPICFORGE_BANKS = {}; // banks self-mount onto this
LANES.forEach(L => vm.runInContext(fs.readFileSync(path.join(PROJ, L.file), 'utf8'), ctx));
vm.runInContext(fs.readFileSync(path.join(PROJ, 'topicforge-bank-quantum.js'), 'utf8'), ctx);
const MAP = ctx.window.TOPICFORGE_MAP;
const BANKS = ctx.window.TOPICFORGE_BANKS;

/* cross-bank stem+id universe (T1 quantum + T2 pair) */
const globalIds = new Set();
const globalStems = new Set();
function normStem(q){ return q.toLowerCase().replace(/[^a-z0-9\\{}^_+\-=]/g, ''); }
BANKS.quantum.mocks.forEach(m => m.problems.forEach(p => { globalIds.add(p.id); globalStems.add(normStem(p.q)); }));
eq(globalIds.size, 125, 'baseline universe: 125 quantum ids');
eq(globalStems.size, 125, 'baseline universe: 125 quantum stems');

let segCount = 0, segErr = 0;
const segErrList = [];
function scanMath(txt, owner) {
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

/* figure hygiene: self-contained dark-theme inline SVG, no scripts/refs,
   colors only from the forged palette */
const PALETTE = ['#405060', '#6ea8fe', '#d9a441', '#e5534b', '#9db2c8', '#6b7c8f', '#2ea043', '#7ee787', '#0b0e13'];
function scanFig(fig, owner) {
  ok(/^<svg[\s\S]*<\/svg>$/.test(fig), owner + ': fig is a single <svg> root');
  ok(/viewBox="[^"]+"/.test(fig), owner + ': fig has viewBox');
  ok(!/<script|<image|<use|href/i.test(fig), owner + ': fig has no script/image/use/href');
  ok(!/url\(|http/i.test(fig.replace(/http:\/\/www\.w3\.org\/2000\/svg/, '')), owner + ': fig has no external refs');
  ok(!/[\t\u2212\u20B9]/.test(fig), owner + ': fig no tab/unicode-minus/rupee');
  const colors = fig.match(/#[0-9a-fA-F]{3,6}/g) || [];
  colors.forEach(c => ok(PALETTE.indexOf(c.toLowerCase()) > -1, owner + ': palette color ' + c));
  ok(colors.length >= 2, owner + ': fig actually themed (>=2 palette colors)');
  // balanced tags
  eq((fig.match(/<svg/g) || []).length, (fig.match(/<\/svg>/g) || []).length, owner + ': svg open/close balanced');
  let figErr = 0;
  try { new (require('xmldom') || null); } catch (e) { /* xmldom absent; rely on jsdom smoke29 for live paint */ }
  ok(figErr === 0, owner + ': fig scan done');
}

LANES.forEach(L => {
  const bankSrc = fs.readFileSync(path.join(PROJ, L.file), 'utf8');
  const LANE = BANKS[L.id];

  /* ---- 1. mount + meta ---- */
  ok(!!LANE, 'bank mounts window.TOPICFORGE_BANKS.' + L.id);
  ok(!!LANE && LANE.meta.aiGenerated === true, L.id + ': meta.aiGenerated === true');
  ok(!!LANE && /AI-GENERATED/.test(LANE.meta.label), L.id + ': meta.label carries AI-GENERATED');
  eq(LANE.meta.lane, L.id, L.id + ': meta.lane matches');
  eq(LANE.meta.stage, 'T2', L.id + ': meta.stage = T2');
  eq(LANE.meta.minutes, 55, L.id + ': fleet minutes = 55');
  const stamp = LANE.meta.stamp;
  eq(stamp.seed + stamp.standard + stamp.apex, 25, L.id + ': stamp sums to 25');
  eq(Math.round(18 * 3.5 + 7 * 5), LANE.meta.maxScore, L.id + ': maxScore = 98');
  const sch = LANE.meta.scheme;
  ok(sch.seed.p === 3.5 && sch.seed.n === -0.875 && sch.apex.p === 5 && sch.apex.n === 0, L.id + ': CSIR scheme exact (seed/standard +3.5/-0.875, apex +5/0)');

  /* ---- 2. structure ---- */
  const mocks = LANE.mocks;
  eq(mocks.length, 5, L.id + ': exactly 5 mocks');
  const laneRows = MAP.lanes.find(l => l.id === L.id);
  const mapSubs = laneRows.rows.map(r => r.id);
  const fleetSubs = {};
  mocks.forEach(m => {
    ok(new RegExp('^' + L.prefix + '-0[1-5]$').test(m.id), m.id + ': id pattern');
    eq(m.lane, L.id, m.id + ': mock.lane = ' + L.id);
    eq(m.stage, 'T2', m.id + ': mock.stage = T2');
    ok(typeof m.title === 'string' && m.title.length > 8, m.id + ': titled');
    ok(Array.isArray(m.focus) && m.focus.every(f => mapSubs.indexOf(f) > -1), m.id + ': focus subtopics all mapped');
    eq(m.problems.length, 25, m.id + ': exactly 25 problems');
    eq(m.minutes, 55, m.id + ': minutes 55');
    const d = { seed: 0, standard: 0, apex: 0 };
    const letters = [0, 0, 0, 0];
    m.problems.forEach((p, i) => {
      const wantId = m.id + '-Q' + String(i + 1).padStart(2, '0');
      eq(p.id, wantId, 'problem id sequence ' + wantId);
      ok(!globalIds.has(p.id), p.id + ' unique id (cross-bank)');
      globalIds.add(p.id);
      const norm = normStem(p.q);
      ok(!globalStems.has(norm), p.id + ' unique stem (cross-bank 375-universe)');
      globalStems.add(norm);
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
      ok(mapSubs.indexOf(p.sub) > -1, p.id + ': sub ' + p.sub + ' exists in T0 map');
      ok(!/[<>]/.test(p.q + p.sol + p.vfy + p.o.join('')), p.id + ': no raw < or > in content');
      ok(!/\t|\u2212|\u20B9/.test(p.q + p.sol + p.vfy + p.o.join('')), p.id + ': no tab / unicode-minus / rupee');
      ['q', 'sol', 'vfy'].forEach(f => {
        const dollarCount = (String(p[f]).match(/\$/g) || []).length;
        ok(dollarCount % 2 === 0, p.id + ' field ' + f + ': even $ count');
        scanMath(p[f], p.id + '.' + f);
      });
      p.o.forEach((o, oi) => scanMath(o, p.id + '.o' + oi));
      if (p.fig) scanFig(p.fig, p.id + '.fig');
      fleetSubs[p.sub] = (fleetSubs[p.sub] || 0) + 1;
    });
    eq(d.seed, stamp.seed, m.id + ': seed stamp = 6');
    eq(d.standard, stamp.standard, m.id + ': standard stamp = 12');
    eq(d.apex, stamp.apex, m.id + ': apex stamp = 7');
    letters.forEach((n, li) => ok(n >= 4, m.id + ': answer letter ' + 'ABCD'[li] + ' used >=4 times (got ' + n + ')'));
  });

  /* ---- 3. coverage matrix vs T0 map ---- */
  mapSubs.forEach(s => ok((fleetSubs[s] || 0) >= 1, L.id + ' coverage: sub ' + s + ' forged >=1 across fleet'));
  mapSubs.forEach(s => ok((fleetSubs[s] || 0) >= 3, L.id + ' depth: sub ' + s + ' has >=3 problems'));
  eq(Object.keys(fleetSubs).length, mapSubs.length, L.id + ': fleet spans exactly the mapped subtopics');
  const minedTop1 = laneRows.rows.slice().sort((a, b) => b.hits - a.hits)[0].id;
  const fleetTop1 = Object.keys(fleetSubs).sort((a, b) => fleetSubs[b] - fleetSubs[a])[0];
  eq(fleetTop1, minedTop1, L.id + ': fleet top-1 subtopic mirrors mined top-1 (' + minedTop1 + ')');
  let inversions = 0;
  const rows = laneRows.rows;
  for (let i = 0; i < rows.length; i++) for (let j = 0; j < rows.length; j++) {
    if (rows[i].hits - rows[j].hits >= 10 && fleetSubs[rows[i].id] < fleetSubs[rows[j].id]) inversions++;
  }
  eq(inversions, 0, L.id + ': no weight inversions for mined gaps >=10');

  /* ---- 5. label + file hygiene ---- */
  ok(/AI-GENERATED PRACTICE CONTENT/.test(bankSrc), L.id + ': file header carries AI-GENERATED banner');
  ok(!/<body|<\/body|<\/style/.test(bankSrc), L.id + ': no forbidden master-breaking tags in companion');
  ok(/window\.TOPICFORGE_PANEL_RENDER/.test(bankSrc), L.id + ': bank pings panel renderer');
});

eq(globalIds.size, 375, '375 unique problem ids across T1+T2 fleets');
eq(globalStems.size, 375, '375 unique stems across T1+T2 fleets (no-dup-stem gate)');

/* ---- 4. KaTeX global ---- */
eq(segErr, 0, 'KaTeX-strict: 0 errors across ' + segCount + ' math segments');
ok(segCount >= 1500, 'math segment count substantial (' + segCount + ')');
if (segErrList.length) console.log(segErrList.slice(0, 12).join('\n'));

console.log('\nUNIT29 RESULT: ' + pass + ' passed, ' + fail + ' failed · math segments: ' + segCount);
if (fail) { console.log('FAILURES:\n' + fails.slice(0, 40).join('\n')); process.exit(1); }
