#!/usr/bin/env node
/* PAPERFORGE S6 — ORACLE forge: mints 3 GATE-2027 prophecy papers (ORACLE A/B/C)
   by blueprint-weighted assembly. READS LANE WEIGHTS + TYPE MIX FROM
   paperforge-blueprint.json (feeds on the S1 table, per plan).

   Per paper: GA 10 (fresh, own set; 5×1M + 5×2M) + SUBJECT 55 drawn without
   replacement from LEGION I+II pools — lane targets via largest remainder of
   blueprint shares ×55, marks 25×1M/30×2M exact, type mix within ±2 of the
   blueprint PH ratio. Deterministic sealed seeds; assembly log written to MD. */
'use strict';
const fs = require('fs'), vm = require('vm');
const BASE = '/home/user/_audit/paperforge/';
const PROJ = '/home/user/project/';

/* ---- blueprint: weights (never hand-hardcoded) ---- */
const bp = JSON.parse(fs.readFileSync(PROJ + 'paperforge-blueprint.json', 'utf8'));
const laneTotals = bp.combined.laneTotals;
const SUBJ_LANES = ['mathphys', 'classical', 'emtheory', 'quantum', 'thermo', 'electronics', 'atnuc', 'solidstate'];
const merged = {
  mathphys: laneTotals.mathphys, classical: laneTotals.classical, emtheory: laneTotals.emtheory,
  quantum: laneTotals.quantum, thermo: laneTotals.thermo, electronics: laneTotals.electronics,
  atnuc: laneTotals.atomic + laneTotals.nuclear, solidstate: laneTotals.solidstate
};
const LANE_CODE = { mathphys: 'MP', classical: 'CM', emtheory: 'EM', quantum: 'QM', thermo: 'TH', electronics: 'EL', atnuc: 'AN', solidstate: 'SS' };

/* largest-remainder apportionment helper */
function apportion(weights, total, order) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const exact = weights.map(w => w * total / sum);
  const out = exact.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  exact.map((f, i) => [f - out[i], i]).sort((a, b) => (b[0] - a[0]) || (order.indexOf(a[1]) - order.indexOf(b[1])))
    .forEach(p => { if (left-- > 0) out[p[1]]++; });
  return out;
}
const subjShares = SUBJ_LANES.map(l => merged[l]);
const LANE_TARGET = {};
SUBJ_LANES.forEach((l, i) => LANE_TARGET[l] = apportion(subjShares, 55, SUBJ_LANES.map((_, k) => k))[i]);
/* subject type split from blueprint PH types ×55 */
const tp = bp.combined.types; // {'GA:MCQ':30,'PH:MCQ':82,'PH:NAT':50,'PH:MSQ':33}
const phTot = tp['PH:MCQ'] + tp['PH:NAT'] + tp['PH:MSQ'];
const TYPE_TARGET = {};
['MCQ', 'MSQ', 'NAT'].forEach((t, i, arr) =>
  TYPE_TARGET[t] = apportion([tp['PH:MCQ'], tp['PH:MSQ'], tp['PH:NAT']], 55, [0, 1, 2])[i]);
/* marks split per lane: 25 of the 55 subject slots are 1-mark */
const marksAp = apportion(SUBJ_LANES.map(l => LANE_TARGET[l]), 25, SUBJ_LANES.map((_, k) => k));
const LANE_M1 = {}; SUBJ_LANES.forEach((l, i) => LANE_M1[l] = marksAp[i]);

/* ---- load pools ---- */
function loadBank(file, key) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(PROJ + file, 'utf8'), ctx, { filename: file });
  return ctx.window.FORGE_BANKS[key];
}
const POOL = [].concat(
  loadBank('paperforge-bank-legion1.js', 'pf-legion-1').questions.map(q => Object.assign({}, q, { srcId: q.id, srcBank: 'pf-legion-1' })),
  loadBank('paperforge-bank-legion2.js', 'pf-legion-2').questions.map(q => Object.assign({}, q, { srcId: q.id, srcBank: 'pf-legion-2' })));
const GA = {};
['a', 'b', 'c'].forEach(s => {
  GA[s] = vm.runInNewContext(fs.readFileSync(BASE + 'pfga_' + s + '.js', 'utf8'), {}, { filename: 'pfga_' + s + '.js' });
});

/* seeded RNG (mulberry32) */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(arr, R) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const PAPERS = [
  { key: 'a', seed: 2701, title: 'ORACLE A' },
  { key: 'b', seed: 2702, title: 'ORACLE B' },
  { key: 'c', seed: 2703, title: 'ORACLE C' }
];
const log = [];
const minted = [];
const errs = [];

PAPERS.forEach(P => {
  const R = rng(P.seed);
  const usedGlobal = new Set();
  const counts = { MCQ: 0, MSQ: 0, NAT: 0 };
  const assign = {}; SUBJ_LANES.forEach(l => assign[l] = { 1: [], 2: [] });
  const laneFill = l => assign[l][1].length + assign[l][2].length;
  function put(l, mk, q) { assign[l][mk].push(q); usedGlobal.add(q.srcId); counts[q.type]++; }
  /* PHASE 1 — MSQ-first: scarce type (pool 16 for target ~11/paper) is seeded
     into lane cells proportional to lane deficit before gates close. */
  {
    let need = TYPE_TARGET.MSQ, guard = 400;
    while (need > 0 && guard--) {
      const open = SUBJ_LANES.filter(l => laneFill(l) < LANE_TARGET[l] &&
        [1, 2].some(mk => POOL.some(q => q.lane === l && q.marks === mk && q.type === 'MSQ' && !usedGlobal.has(q.srcId))));
      if (!open.length) break;
      open.sort((x, y) => (laneFill(y) / LANE_TARGET[y] - laneFill(x) / LANE_TARGET[x]) || (R() - 0.5));
      const l = open[0];
      let mk = assign[l][1].length < LANE_M1[l] ? 1 : 2;
      let cell = POOL.filter(q => q.lane === l && q.marks === mk && q.type === 'MSQ' && !usedGlobal.has(q.srcId));
      if (!cell.length) { mk = 3 - mk; cell = POOL.filter(q => q.lane === l && q.marks === mk && q.type === 'MSQ' && !usedGlobal.has(q.srcId)); }
      put(l, mk, cell[Math.floor(R() * cell.length)]); need--;
    }
  }
  /* PHASE 2 — fill every lane cell to its marks quota, NAT preferred until its
     quota is met, then MCQ; graceful cross-type/cross-marks fallback. */
  SUBJ_LANES.forEach(l => {
    let guard = 200;
    while (laneFill(l) < LANE_TARGET[l] && guard--) {
      const mk = assign[l][1].length < LANE_M1[l] ? 1 : 2;
      const types = counts.NAT < TYPE_TARGET.NAT ? ['NAT', 'MCQ', 'MSQ'] : ['MCQ', 'NAT', 'MSQ'];
      let done = false;
      for (const m0 of [mk, 3 - mk]) {
        for (const t of types) {
          const cand = POOL.filter(q => q.lane === l && q.marks === m0 && q.type === t && !usedGlobal.has(q.srcId));
          if (cand.length) { put(l, m0, cand[Math.floor(R() * cand.length)]); done = true; break; }
        }
        if (done) break;
      }
      if (!done) { errs.push(P.key + ' ' + l + ' cell exhausted mid-fill'); break; }
    }
  });
  /* PHASE 3 — type repair both directions: swap within exact (lane,marks) cells */
  ['MCQ', 'MSQ', 'NAT'].forEach(t => {
    let guard = 80;
    while (counts[t] < TYPE_TARGET[t] - 2 || counts[t] > TYPE_TARGET[t] + 2) {
      if (!guard--) break;
      const deficit = counts[t] < TYPE_TARGET[t] - 2;
      const donorType = ['MCQ', 'MSQ', 'NAT'].find(u => deficit ? counts[u] > TYPE_TARGET[u] - 1 : counts[u] < TYPE_TARGET[u] + 1);
      if (!donorType) break;
      let swapped = false;
      outer:
      for (const l of SUBJ_LANES) for (const mk of [1, 2]) {
        const ix = assign[l][mk].findIndex(q => q.type === (deficit ? donorType : t));
        if (ix < 0) continue;
        const repl = POOL.find(q => q.lane === l && q.marks === mk && q.type === (deficit ? t : donorType) && !usedGlobal.has(q.srcId));
        if (!repl) continue;
        counts[assign[l][mk][ix].type]--; usedGlobal.delete(assign[l][mk][ix].srcId);
        assign[l][mk][ix] = repl; usedGlobal.add(repl.srcId); counts[repl.type]++;
        swapped = true; break outer;
      }
      if (!swapped) break;
    }
  });
  const picked = [];
  SUBJ_LANES.forEach(l => [1, 2].forEach(mk => assign[l][mk].forEach(q => picked.push(q))));
  const tcount = { MCQ: 0, MSQ: 0, NAT: 0 };
  picked.forEach(q => tcount[q.type]++);
  ['MCQ', 'MSQ', 'NAT'].forEach(t => {
    if (Math.abs(tcount[t] - TYPE_TARGET[t]) > 2)
      errs.push(P.key + ' type ' + t + ': ' + tcount[t] + ' vs target ' + TYPE_TARGET[t] + ' (±2)');
  });
  /* GA set */
  const ga = GA[P.key].map(q => Object.assign({}, q, { srcId: q.id, srcBank: 'pf-oracle-ga-' + P.key }));
  const gaM1 = ga.filter(q => q.marks === 1).length, gaM2 = ga.filter(q => q.marks === 2).length;
  if (ga.length !== 10 || gaM1 !== 5 || gaM2 !== 5) errs.push(P.key + ' GA structure ' + ga.length + '/' + gaM1 + '/' + gaM2);
  ga.forEach(q => { if (q.type !== 'MCQ') errs.push(P.key + ' GA non-MCQ: ' + q.id); });
  /* assemble order: GA n1-10, subject shuffled n11-65 */
  const subj = shuffled(picked, R);
  if (picked.length !== 55) errs.push(P.key + ' subject count ' + picked.length);
  const Q = [];
  ga.forEach((q, i) => Q.push(finish(q, i + 1)));
  subj.forEach((q, i) => Q.push(finish(q, i + 11)));
  function finish(q, n) {
    const o = Object.assign({}, q);
    o.id = 'PF-OR-' + P.key.toUpperCase() + '-' + String(n).padStart(2, '0');
    o.n = n;
    o.part = 'GA';
    if (n > 10) o.part = 'PH';
    o.correctMarks = o.marks;
    o.wrongMarks = o.type === 'MCQ' ? (o.marks === 1 ? 0.333 : 0.667) : 0;
    o.code = o.part === 'GA' ? 'GA' : LANE_CODE[o.lane];
    return o;
  }
  const marksSum = Q.reduce((a, q) => a + q.correctMarks, 0);
  if (marksSum !== 100) errs.push(P.key + ' marks sum ' + marksSum + ' != 100');
  const dup = new Set(); Q.forEach(q => { if (dup.has(q.srcId)) errs.push(P.key + ' dup srcId ' + q.srcId); dup.add(q.srcId); });
  const partCounts = { GA: 10 };
  SUBJ_LANES.forEach(l => partCounts[LANE_CODE[l]] = LANE_TARGET[l]);
  const bank = {
    id: 'pf-oracle-' + P.key,
    label: '🔮 PAPERFORGE — ' + P.title + ' · GATE 2027 prophecy (blueprint-weighted)',
    series: 'PAPERFORGE',
    stage: 'S6',
    seed: P.seed,
    minted: '2026-08-18',
    aiGenerated: true,
    note: 'AI-GENERATED prophecy paper — blueprint-weighted assembly over audited forge legions (seed ' + P.seed + ', log: _audit/paperforge/oracle_assembly_log.md). GA set freshly authored for this paper. Official GATE pattern: 65 Q · 100 marks · 3 h · MCQ −1/3 · −2/3, MSQ & NAT no negative.',
    durationSec: 10800,
    totalQ: 65,
    maxScore: marksSum,
    partCounts,
    typeTally: { MCQ: Q.filter(q => q.type === 'MCQ').length, MSQ: tcount.MSQ, NAT: tcount.NAT },
    questions: Q
  };
  fs.writeFileSync(PROJ + 'paperforge-bank-oracle-' + P.key + '.js',
    '/* 🏭 PAPERFORGE S6 — ' + P.title + ' · GATE 2027 prophecy (AI-GENERATED · seeded ' + P.seed + ')\n' +
    '   Minted by _audit/paperforge/forge_oracle.js — do not hand-edit. */\n' +
    'window.FORGE_BANKS = window.FORGE_BANKS || {};\nwindow.FORGE_BANKS["pf-oracle-' + P.key + '"] = ' +
    JSON.stringify(bank, null, 1) + ';\n');
  minted.push(bank);
  log.push({ paper: P.key, seed: P.seed, lanes: partCounts, types: bank.typeTally,
    ga: 'pfga_' + P.key, marks: marksSum,
    srcUse: pool_use(bank) });
});
function pool_use(bank) {
  const m = {};
  bank.questions.forEach(q => { if (q.srcBank) m[q.srcBank] = (m[q.srcBank] || 0) + 1; });
  return m;
}
/* pairwise overlap report */
const ov = [];
for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
  const A = new Set(minted[i].questions.map(q => q.srcId));
  const B = new Set(minted[j].questions.map(q => q.srcId));
  const both = [...A].filter(x => B.has(x)).length;
  ov.push(minted[i].id + ' vs ' + minted[j].id + ': ' + both + ' shared subject/GA items');
}
if (errs.length) { console.error('ORACLE FAILED:\n' + errs.join('\n')); process.exit(1); }

/* assembly log */
const L = [];
L.push('# PAPERFORGE — ORACLE ASSEMBLY LOG (S6)');
L.push('');
L.push('minted: 2026-08-18 · assembler: `_audit/paperforge/forge_oracle.js` · seeds sealed per paper');
L.push('');
L.push('## blueprint inputs (read live from `paperforge-blueprint.json`)');
L.push('');
L.push('| quantity | value |');
L.push('|---|---|');
L.push('| subject lane targets /55 | ' + SUBJ_LANES.map(l => LANE_CODE[l] + ' ' + LANE_TARGET[l]).join(' · ') + ' |');
L.push('| lane 1-mark quota | ' + SUBJ_LANES.map(l => LANE_CODE[l] + ' ' + LANE_M1[l]).join(' · ') + ' |');
L.push('| subject type targets /55 | MCQ ' + TYPE_TARGET.MCQ + ' · MSQ ' + TYPE_TARGET.MSQ + ' · NAT ' + TYPE_TARGET.NAT + ' (tolerance ±2) |');
L.push('| pool | LEGION I 60 + LEGION II 60 = 120 audited originals |');
L.push('');
L.push('## papers minted');
L.push('');
L.push('| paper | seed | GA set | subject type mix | marks | pool draw |');
L.push('|---|---|---|---|---|---|');
log.forEach(r => L.push('| ' + r.paper.toUpperCase() + ' | ' + r.seed + ' | `' + r.ga + '.js` (10 fresh) | ' +
  r.types.MCQ + ' MCQ / ' + r.types.MSQ + ' MSQ / ' + r.types.NAT + ' NAT | ' + r.marks + ' | ' +
  Object.keys(r.srcUse).map(k => k + ':' + r.srcUse[k]).join(' · ') + ' |'));
L.push('');
L.push('## pairwise overlap (subject pool is 120 for 165 slots — honest disclosure)');
L.push('');
ov.forEach(x => L.push('- ' + x));
L.push('');
L.push('Policy: zero repeats WITHIN a paper; GA sets exclusive per paper; overlap exists only');
L.push('across papers and only in lanes thinner than the blueprint demands (logged above).');
L.push('Subject items carry their full audit chain from the source legion (forge journals I/II);');
L.push('GA sets audited fresh in `audit_oracle.py`.');
fs.writeFileSync(BASE + 'oracle_assembly_log.md', L.join('\n') + '\n');
console.log('ORACLE minted: 3 papers × 65 Q · marks 100 each · types', JSON.stringify(minted.map(b => b.typeTally)));
console.log('overlaps:', ov.join(' | '));
