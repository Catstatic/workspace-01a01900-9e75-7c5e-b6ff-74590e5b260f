#!/usr/bin/env node
/* PAPERFORGE S4 — assemble paperforge-bank-legion2.js from parts pf2_p1..pf2_p6.
   Structural gates run here; physics QA lives in audit_legion2.py. */
'use strict';
const fs = require('fs'), vm = require('vm');
const BASE = '/home/user/_audit/paperforge/';
const parts = [1, 2, 3, 4, 5, 6].map(i =>
  vm.runInNewContext(fs.readFileSync(BASE + 'pf2_p' + i + '.js', 'utf8'), {}, { filename: 'pf2_p' + i + '.js' }));
const figs = JSON.parse(fs.readFileSync(BASE + 'figs_live.json', 'utf8'));

const Q = [].concat(...parts);
const errs = [];
if (Q.length !== 60) errs.push('count ' + Q.length + ' != 60');
const ids = new Set(), stems = new Set();
const tally = { MCQ: 0, MSQ: 0, NAT: 0, marks1: 0, marks2: 0,
  lanes: { quantum: 0, thermo: 0, electronics: 0, atnuc: 0, solidstate: 0 }, letters: [0, 0, 0, 0] };
Q.forEach((q, i) => {
  if (q.n !== i + 1) errs.push(q.id + ' n mismatch: ' + q.n);
  if (ids.has(q.id)) errs.push('dup id ' + q.id); ids.add(q.id);
  const sk = q.stem.toLowerCase().replace(/\s+/g, ' ').trim();
  if (stems.has(sk)) errs.push('dup stem ' + q.id); stems.add(sk);
  if (!/^PF-(QM|TH|EL|AN|SS)-\d\d$/.test(q.id)) errs.push('bad id ' + q.id);
  if (!['MCQ', 'MSQ', 'NAT'].includes(q.type)) errs.push(q.id + ' bad type');
  if (![1, 2].includes(q.marks)) errs.push(q.id + ' bad marks');
  if (!q.sol || q.sol.length < 30) errs.push(q.id + ' thin solution');
  if (/\.\.\.|AUDIT|TODO|REPLACE|FIXME|…/.test(q.stem + ' ' + q.sol)) errs.push(q.id + ' dirty string');
  if (q.type === 'NAT') {
    if (typeof q.ans !== 'string') errs.push(q.id + ' NAT ans not string');
    if (q.opts) errs.push(q.id + ' NAT has opts');
    const r = q.ans.split(' to ');
    if (r.length === 2) { if (!(Number(r[0]) <= Number(r[1]))) errs.push(q.id + ' bad range'); }
    else if (!Number.isFinite(Number(q.ans))) errs.push(q.id + ' NAT ans not numeric: ' + q.ans);
  } else {
    if (!Array.isArray(q.opts) || q.opts.length !== 4) errs.push(q.id + ' opts!=4');
    const nz = new Set(q.opts.map(o => o.trim()));
    if (nz.size !== 4) errs.push(q.id + ' dup option text');
    if (q.type === 'MCQ') {
      if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans > 3) errs.push(q.id + ' MCQ ans range');
      else tally.letters[q.ans]++;
    } else {
      if (!Array.isArray(q.ans) || q.ans.length < 2 || q.ans.some(a => !Number.isInteger(a) || a < 0 || a > 3)) errs.push(q.id + ' MSQ ans bad');
      if (JSON.stringify(q.ans) !== JSON.stringify([...q.ans].sort((a, b) => a - b))) errs.push(q.id + ' MSQ not sorted');
    }
  }
  tally[q.type]++;
  tally[q.marks === 1 ? 'marks1' : 'marks2']++;
  tally.lanes[q.lane]++;
});
/* lane budget: QM 20 · TH 14 · EL 10 · AN 8 · SS 8 */
const LANES = { quantum: 20, thermo: 14, electronics: 10, atnuc: 8, solidstate: 8 };
Object.keys(LANES).forEach(l => {
  if (tally.lanes[l] !== LANES[l]) errs.push('lane ' + l + ': ' + tally.lanes[l] + ' != ' + LANES[l]);
});
if (tally.MCQ !== 35 || tally.MSQ !== 8 || tally.NAT !== 17)
  errs.push('type mix ' + tally.MCQ + '/' + tally.MSQ + '/' + tally.NAT + ' != 35/8/17');
if (tally.marks1 !== 22 || tally.marks2 !== 38)
  errs.push('marks mix ' + tally.marks1 + '/' + tally.marks2 + ' != 22/38');

Q.forEach(q => {
  q.correctMarks = q.marks;
  q.wrongMarks = q.type === 'MCQ' ? (q.marks === 1 ? 0.333 : 0.667) : 0;
  if (q.fig) { q.figSvg = figs[q.fig]; if (!q.figSvg) errs.push(q.id + ' fig not baked: ' + q.fig); }
});

/* ---- answer-letter rebalance (deterministic greedy rotation, target 9/9/9/8) ---- */
{
  const mcqs = Q.filter(q => q.type === 'MCQ');
  const target = [9, 9, 9, 8];
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

const maxScore = Q.reduce((a, q) => a + q.correctMarks, 0);
if (maxScore !== 98) errs.push('maxScore ' + maxScore + ' != 98');
const bank = {
  id: 'pf-legion-2',
  label: '🏭 PAPERFORGE — LEGION II · GATE pattern (Quantum · Thermo · Electronics · Atomic/Nuclear · Solid State)',
  series: 'PAPERFORGE',
  stage: 'S4',
  minted: '2026-08-18',
  aiGenerated: true,
  note: 'AI-GENERATED original forge bank — zero PYQ photocopies. Every question double-solved (author-solve + audit re-derivation; journal: _audit/paperforge/forge_journal_legion2.md).',
  durationSec: 9900,
  totalQ: 60,
  maxScore,
  partCounts: { QM: 20, TH: 14, EL: 10, AN: 8, SS: 8 },
  typeTally: { MCQ: tally.MCQ, MSQ: tally.MSQ, NAT: tally.NAT },
  questions: Q
};

if (errs.length) { console.error('REPLAY FAILED:\n' + errs.join('\n')); process.exit(1); }

const head = '/* 🏭 PAPERFORGE S4 — LEGION II bank (60 originals · AI-GENERATED · double-solved)\n' +
  '   Built by _audit/paperforge/replay_pf2.js — do not hand-edit; edit pf2_p1..pf2_p6.js and replay. */\n';
fs.writeFileSync('/home/user/project/paperforge-bank-legion2.js',
  head + 'window.FORGE_BANKS = window.FORGE_BANKS || {};\nwindow.FORGE_BANKS["pf-legion-2"] = ' +
  JSON.stringify(bank, null, 1) + ';\n');
console.log('bank written: 60 Q · maxScore', maxScore, '· types', JSON.stringify(bank.typeTally),
  '· marks 1M:' + tally.marks1 + ' 2M:' + tally.marks2,
  '· letters', tally.letters.join('/'), '· figs', Q.filter(q => q.figSvg).length);
