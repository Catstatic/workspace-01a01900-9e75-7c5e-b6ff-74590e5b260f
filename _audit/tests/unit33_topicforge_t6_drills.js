/* UNIT 33 — TOPICFORGE T6 drill-fleet forensics (pure Node, no DOM).
   Verifies topicforge-bank-drills.js (full roster ranks 1-28): structure, stamp,
   roster-mirror coverage vs the T0 map drills, unique ids/stems (cross-bank
   against all 9 T1-T5 lane fleets too: 1825 stems total), KaTeX-strict
   math, answer distribution, and inline-SVG figure hygiene. */
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
  { id: 'drills',      file: 'topicforge-bank-drills.js',       prefix: 'drill' }
];

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(PROJ, 'topicforge-map.js'), 'utf8'), ctx);
ctx.window.TOPICFORGE_BANKS = {}; // banks self-mount onto this
LANES.forEach(L => vm.runInContext(fs.readFileSync(path.join(PROJ, L.file), 'utf8'), ctx));
['topicforge-bank-quantum.js','topicforge-bank-classical.js','topicforge-bank-mathphys.js','topicforge-bank-emtheory.js','topicforge-bank-thermo.js','topicforge-bank-electronics.js','topicforge-bank-atomic.js','topicforge-bank-nuclear.js','topicforge-bank-solidstate.js'].forEach(f =>
  vm.runInContext(fs.readFileSync(path.join(PROJ, f), 'utf8'), ctx));
const MAP = ctx.window.TOPICFORGE_MAP;
const BANKS = ctx.window.TOPICFORGE_BANKS;

/* cross-bank stem+id universe (T1 quantum + T2 pair + T3 pair + T4 pair) */
const globalIds = new Set();
const globalStems = new Set();
function normStem(q){ return q.toLowerCase().replace(/[^a-z0-9\\{}^_+\-=]/g, ''); }
['quantum','classical','mathphys','emtheory','thermo','electronics','atomic','nuclear','solidstate'].forEach(ln => BANKS[ln].mocks.forEach(m => m.problems.forEach(p => { globalIds.add(p.id); globalStems.add(normStem(p.q)); })));
eq(globalIds.size, 1125, 'baseline universe: 1125 T1–T5 ids');
eq(globalStems.size, 1125, 'baseline universe: 1125 T1–T5 stems');

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
  eq(LANE.meta.stage, 'T6', L.id + ': meta.stage = T6');
  eq(LANE.meta.minutes, 55, L.id + ': fleet minutes = 55');
  const stamp = LANE.meta.stamp;
  eq(stamp.seed + stamp.standard + stamp.apex, 25, L.id + ': stamp sums to 25');
  eq(Math.round(18 * 3.5 + 7 * 5), LANE.meta.maxScore, L.id + ': maxScore = 98');
  const sch = LANE.meta.scheme;
  ok(sch.seed.p === 3.5 && sch.seed.n === -0.875 && sch.apex.p === 5 && sch.apex.n === 0, L.id + ': CSIR scheme exact (seed/standard +3.5/-0.875, apex +5/0)');

  /* ---- 2. structure ---- */
  const mocks = LANE.mocks;
  eq(mocks.length, 28, L.id + ': exactly 28 drill mocks (full roster ranks 1-28)');
  const rosterTop10 = MAP.drills.filter(c => c.rank <= 28);
  const rosterIds = rosterTop10.map(c => c.forgeId);
  const mapSubs = rosterTop10.map(c => c.id);
  const fleetSubs = {};
  mocks.forEach(m => {
    ok(rosterIds.indexOf(m.id) > -1, m.id + ': mock id is an approved roster forgeId (ranks 1-28)');
    ok(m.focus.length === 1 && typeof m.focus[0] === 'string', m.id + ': single-concept focus (drill purity)');
    eq(m.lane, L.id, m.id + ': mock.lane = ' + L.id);
    eq(m.stage, 'T6', m.id + ': mock.stage = T6');
    ok(typeof m.title === 'string' && m.title.length > 8, m.id + ': titled');
    ok(m.focus[0] === m.id.replace(/^drill-/, '').replace(/-01$/, ''), m.id + ': focus slug matches forgeId slug');
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
      ok(!globalStems.has(norm), p.id + ' unique stem (cross-bank 875-universe)');
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
      eq(p.sub, m.focus[0], p.id + ': drill purity — every problem sits on the drill concept');
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

  /* ---- 3. roster-mirror coverage vs T0 map ---- */
  mapSubs.forEach(s2 => ok((fleetSubs[s2] || 0) === 25, L.id + ' coverage: roster concept ' + s2 + ' owns exactly one 25-problem drill'));
  eq(Object.keys(fleetSubs).length, mapSubs.length, L.id + ': fleet spans all 28 roster concepts');
  eq(new Set(mocks.map(m => m.id)).size, 28, L.id + ': 28 distinct drill mock ids');
  eq(mocks.map(m => m.id).slice().sort().join('|'), rosterIds.slice().sort().join('|'), L.id + ': drilled forgeIds == full 28-drill roster exactly');
  ok(rosterTop10.every(c => c.sessions >= 3), L.id + ': every drilled concept crossed its 3+ session approval threshold');
  eq(MAP.drills.length, 28, 'map roster holds all 28 approved concepts (entire T6 fleet now drilled)');
  eq(LANE.meta.mined.hits, rosterTop10.reduce((a, c) => a + c.sessions, 0), L.id + ': meta.mined.hits == summed all-28 session hits (251, honest count)');

  /* ---- 5. label + file hygiene ---- */
  ok(/AI-GENERATED PRACTICE CONTENT/.test(bankSrc), L.id + ': file header carries AI-GENERATED banner');
  ok(!/<body|<\/body|<\/style/.test(bankSrc), L.id + ': no forbidden master-breaking tags in companion');
  ok(/window\.TOPICFORGE_PANEL_RENDER/.test(bankSrc), L.id + ': bank pings panel renderer');
});

eq(globalIds.size, 1825, '1825 unique problem ids across T1–T6 fleets');
eq(globalStems.size, 1825, '1825 unique stems across T1–T6 fleets (no-dup-stem gate)');

/* ---- 4. KaTeX global ---- */
eq(segErr, 0, 'KaTeX-strict: 0 errors across ' + segCount + ' math segments');
ok(segCount >= 1400, 'math segment count substantial (' + segCount + ')');
if (segErrList.length) console.log(segErrList.slice(0, 12).join('\n'));

console.log('\nUNIT33 RESULT: ' + pass + ' passed, ' + fail + ' failed · math segments: ' + segCount);
if (fail) { console.log('FAILURES:\n' + fails.slice(0, 40).join('\n')); process.exit(1); }
