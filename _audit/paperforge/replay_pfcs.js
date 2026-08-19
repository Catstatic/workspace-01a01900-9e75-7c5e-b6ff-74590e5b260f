#!/usr/bin/env node
/* PAPERFORGE S5 — assemble paperforge-bank-cs1.js from parts pfcs_p1..pfcs_p7.
   CSIR-NET pattern: Part A 20 (attempt 15, +2/−0.5) · Part B 25 (attempt 20,
   +3.5/−0.875) · Part C 30 (attempt 20, +5/−1.25) — scheme mirrored byte-for-
   byte from the tracker's own official SIM_LIMITS (ground truth, never edited).
   Structural gates run here; physics QA lives in audit_cs1.py. */
'use strict';
const fs = require('fs'), vm = require('vm');
const BASE = '/home/user/_audit/paperforge/';
const parts = [1, 2, 3, 4, 5, 6, 7].map(i =>
  vm.runInNewContext(fs.readFileSync(BASE + 'pfcs_p' + i + '.js', 'utf8'), {}, { filename: 'pfcs_p' + i + '.js' }));
const figs = JSON.parse(fs.readFileSync(BASE + 'figs_live.json', 'utf8'));

/* official scheme as encoded in the tracker's SIM_LIMITS (mined, not written) */
const LIMITS = {
  A: { max: 15, total: 20, correct: 2,   wrong: 0.5 },
  B: { max: 20, total: 25, correct: 3.5, wrong: 0.875 },
  C: { max: 20, total: 30, correct: 5,   wrong: 1.25 }
};

const Q = [].concat(...parts);
const errs = [];
if (Q.length !== 75) errs.push('count ' + Q.length + ' != 75');
const ids = new Set(), stems = new Set();
const tally = { MCQ: 0, parts: { A: 0, B: 0, C: 0 }, letters: [0, 0, 0, 0],
  lanes: { aptitude: 0, mathphys: 0, classical: 0, emtheory: 0, quantum: 0, thermo: 0, electronics: 0, atnuc: 0, solidstate: 0 } };
Q.forEach((q, i) => {
  if (q.n !== i + 1) errs.push(q.id + ' n mismatch: ' + q.n);
  if (ids.has(q.id)) errs.push('dup id ' + q.id); ids.add(q.id);
  const sk = q.stem.toLowerCase().replace(/\s+/g, ' ').trim();
  if (stems.has(sk)) errs.push('dup stem ' + q.id); stems.add(sk);
  if (!/^PF-CS-[ABC]\d\d$/.test(q.id)) errs.push('bad id ' + q.id);
  if (q.type !== 'MCQ') errs.push(q.id + ' CSIR bank is single-correct MCQ only, got ' + q.type);
  if (!LIMITS[q.part]) errs.push(q.id + ' bad part ' + q.part);
  const lim = LIMITS[q.part];
  if (lim && q.marks !== lim.correct) errs.push(q.id + ' marks ' + q.marks + ' != scheme ' + lim.correct);
  /* part window: A = n 1-20, B = n 21-45, C = n 46-75 */
  if (q.part === 'A' && (q.n < 1 || q.n > 20)) errs.push(q.id + ' outside A window');
  if (q.part === 'B' && (q.n < 21 || q.n > 45)) errs.push(q.id + ' outside B window');
  if (q.part === 'C' && (q.n < 46 || q.n > 75)) errs.push(q.id + ' outside C window');
  if (!q.sol || q.sol.length < 30) errs.push(q.id + ' thin solution');
  if (/\.\.\.|AUDIT|TODO|REPLACE|FIXME|…/.test(q.stem + ' ' + q.sol)) errs.push(q.id + ' dirty string');
  if (!Array.isArray(q.opts) || q.opts.length !== 4) errs.push(q.id + ' opts!=4');
  const nz = new Set(q.opts.map(o => o.trim()));
  if (nz.size !== 4) errs.push(q.id + ' dup option text');
  if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3) errs.push(q.id + ' MCQ ans range');
  else tally.letters[q.ans]++;
  tally.MCQ++;
  tally.parts[q.part]++;
  tally.lanes[q.lane]++;
});
/* structural budgets */
if (tally.parts.A !== 20 || tally.parts.B !== 25 || tally.parts.C !== 30)
  errs.push('part mix ' + JSON.stringify(tally.parts) + ' != A20/B25/C30');
const LANE_BUDGET = { aptitude: 20, mathphys: 7, classical: 7, emtheory: 8, quantum: 8, thermo: 8, electronics: 6, atnuc: 4, solidstate: 7 };
Object.keys(LANE_BUDGET).forEach(l => {
  if (tally.lanes[l] !== LANE_BUDGET[l]) errs.push('lane ' + l + ': ' + tally.lanes[l] + ' != ' + LANE_BUDGET[l]);
});

Q.forEach(q => {
  const lim = LIMITS[q.part];
  q.correctMarks = lim.correct;
  q.wrongMarks = lim.wrong;
  if (q.fig) { q.figSvg = figs[q.fig]; if (!q.figSvg) errs.push(q.id + ' fig not baked: ' + q.fig); }
});

/* ---- answer-letter rebalance (deterministic greedy rotation, target 19/19/19/18) ---- */
{
  const mcqs = Q; /* whole bank is MCQ */
  const target = [19, 19, 19, 18];
  const cur = [0, 0, 0, 0];
  mcqs.forEach(q => {
    let t = 0;
    for (let L = 1; L < 4; L++) if (target[L] - cur[L] > target[t] - cur[t]) t = L;
    const r = (t - q.ans + 4) % 4;
    if (r) q.opts = [0, 1, 2, 3].map(i => q.opts[(i - r + 4) % 4]);
    q.ans = t;
    cur[t]++;
  });
  tally.letters = cur;
  if (Math.max(...cur) - Math.min(...cur) > 1) errs.push('letter rebalance failed: ' + cur.join('/'));
}

const maxScore = Object.keys(LIMITS).reduce((a, p) => a + LIMITS[p].max * LIMITS[p].correct, 0);
if (maxScore !== 200) errs.push('capped maxScore ' + maxScore + ' != 200');
const bank = {
  id: 'pf-cs-1',
  label: '🏭 PAPERFORGE — LEGION CS-I · CSIR-NET pattern (A: Aptitude · B: Core · C: Advanced)',
  series: 'PAPERFORGE',
  stage: 'S5',
  minted: '2026-08-18',
  aiGenerated: true,
  note: 'AI-GENERATED original forge bank — zero PYQ photocopies. Official CSIR scheme mirrored from the tracker\u2019s own SIM_LIMITS (A 15/20 +2/−0.5 · B 20/25 +3.5/−0.875 · C 20/30 +5/−1.25). Every question double-solved (journal: _audit/paperforge/forge_journal_cs1.md). Attempt caps enforced at answer time, CLEAR frees a slot.',
  durationSec: 10800,
  totalQ: 75,
  maxScore,
  limits: LIMITS,
  partCounts: { A: 20, B: 25, C: 30 },
  typeTally: { MCQ: tally.MCQ, MSQ: 0, NAT: 0 },
  questions: Q
};

if (errs.length) { console.error('REPLAY FAILED:\n' + errs.join('\n')); process.exit(1); }

const head = '/* 🏭 PAPERFORGE S5 — LEGION CS-I bank (75 originals · AI-GENERATED · double-solved)\n' +
  '   Built by _audit/paperforge/replay_pfcs.js — do not hand-edit; edit pfcs_p1..pfcs_p7.js and replay. */\n';
fs.writeFileSync('/home/user/project/paperforge-bank-cs1.js',
  head + 'window.FORGE_BANKS = window.FORGE_BANKS || {};\nwindow.FORGE_BANKS["pf-cs-1"] = ' +
  JSON.stringify(bank, null, 1) + ';\n');
console.log('bank written: 75 Q · capped maxScore', maxScore, '· parts', JSON.stringify(bank.partCounts),
  '· letters', tally.letters.join('/'), '· figs', Q.filter(q => q.figSvg).length,
  '· duration', bank.durationSec / 3600 + 'h');
