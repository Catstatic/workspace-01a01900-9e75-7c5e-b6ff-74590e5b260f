#!/usr/bin/env node
/* PAPERFORGE S3 — assemble paperforge-bank-legion1.js from parts pf_p1..pf_p6.
   Structural gates run here; physics QA lives in audit_legion1.py. */
'use strict';
const fs = require('fs'), vm = require('vm');
const BASE = '/home/user/_audit/paperforge/';
const parts = [1, 2, 3, 4, 5, 6].map(i =>
  vm.runInNewContext(fs.readFileSync(BASE + 'pf_p' + i + '.js', 'utf8'), {}, { filename: 'pf_p' + i + '.js' }));
const figs = JSON.parse(fs.readFileSync(BASE + 'figs_live.json', 'utf8'));

const Q = [].concat(...parts);
const errs = [];
if (Q.length !== 60) errs.push('count ' + Q.length + ' != 60');
const ids = new Set(), stems = new Set();
const tally = { MCQ: 0, MSQ: 0, NAT: 0, marks1: 0, marks2: 0, lanes: { mathphys: 0, classical: 0, emtheory: 0 }, letters: [0, 0, 0, 0] };
Q.forEach((q, i) => {
  if (q.n !== i + 1) errs.push(q.id + ' n mismatch: ' + q.n);
  if (ids.has(q.id)) errs.push('dup id ' + q.id); ids.add(q.id);
  const sk = q.stem.toLowerCase().replace(/\s+/g, ' ').trim();
  if (stems.has(sk)) errs.push('dup stem ' + q.id); stems.add(sk);
  if (!/^PF-(MP|CM|EM)-\d\d$/.test(q.id)) errs.push('bad id ' + q.id);
  if (!['MCQ', 'MSQ', 'NAT'].includes(q.type)) errs.push(q.id + ' bad type');
  if (![1, 2].includes(q.marks)) errs.push(q.id + ' bad marks');
  if (!q.sol || q.sol.length < 30) errs.push(q.id + ' thin solution');
  if (/\.\.\.|AUDIT|TODO|REPLACE|FIXME|\u2026/.test(q.stem + ' ' + q.sol)) errs.push(q.id + ' dirty string');
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
    // choose target letter with max remaining deficit
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
const bank = {
  id: 'pf-legion-1',
  label: '🏭 PAPERFORGE — LEGION I · GATE pattern (Math · Classical · EM)',
  series: 'PAPERFORGE',
  stage: 'S3',
  minted: '2026-08-17',
  aiGenerated: true,
  note: 'AI-GENERATED original forge bank — zero PYQ photocopies. Every question double-solved (author-solve + audit re-derivation; journal: _audit/paperforge/forge_journal.md).',
  durationSec: 9900,
  totalQ: 60,
  maxScore,
  partCounts: { MP: 20, CM: 20, EM: 20 },
  typeTally: { MCQ: tally.MCQ, MSQ: tally.MSQ, NAT: tally.NAT },
  questions: Q
};

if (errs.length) { console.error('REPLAY FAILED:\n' + errs.join('\n')); process.exit(1); }

const head = '/* 🏭 PAPERFORGE S3 — LEGION I bank (60 originals · AI-GENERATED · double-solved)\n' +
  '   Built by _audit/paperforge/replay_pf.js — do not hand-edit; edit pf_p1..pf_p6.js and replay. */\n';
fs.writeFileSync('/home/user/project/paperforge-bank-legion1.js',
  head + 'window.FORGE_BANKS = window.FORGE_BANKS || {};\nwindow.FORGE_BANKS["pf-legion-1"] = ' +
  JSON.stringify(bank, null, 1) + ';\n');
console.log('bank written: 60 Q · maxScore', maxScore, '· types', JSON.stringify(bank.typeTally),
  '· marks 1M:' + tally.marks1 + ' 2M:' + tally.marks2,
  '· letters', tally.letters.join('/'), '· figs', Q.filter(q => q.figSvg).length);
