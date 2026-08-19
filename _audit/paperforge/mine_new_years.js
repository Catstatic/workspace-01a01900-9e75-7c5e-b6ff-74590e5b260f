#!/usr/bin/env node
/* PAPERFORGE S1 — classify the newly mined GATE 2020/2024/2025 banks with the
   EXACT TOPICFORGE T0 taxonomy + lane-first algorithm, emit per-year +
   combined blueprint. Report-only: topicforge-map.js is a shipped companion and
   is NOT modified here. */
'use strict';
const fs = require('fs');
const { R, LANES, CONCEPTS } = require('/home/user/_audit/topicforge_taxonomy.js');
const BASE = '/home/user/_audit/paperforge/';

const years = [2020, 2024, 2025];
const banks = years.map(y =>
  JSON.parse(fs.readFileSync(BASE + 'gate' + y + '.json', 'utf8')));

/* old roster for delta report */
const mapSrc = fs.readFileSync('/home/user/project/topicforge-map.js', 'utf8');
const oldMap = JSON.parse(mapSrc.match(/window\.TOPICFORGE_MAP\s*=\s*(\{[\s\S]*\})\s*;?\s*$/)[1]);

function classify(bank) {
  const laneState = LANES.map(L => ({
    id: L.id, ga: !!L.ga,
    rows: L.subs.map(([id, rules]) => ({ id, rules: rules.map(R), hits: 0 })),
    hits: 0,
  }));
  const concepts = CONCEPTS.map(([id, rules]) => ({ id, rules: rules.map(R), hits: 0 }));
  const unclass = [];
  const diff = { seed: 0, standard: 0 };
  const types = { GA: {}, PH: {} };
  const marksSplit = { m1: 0, m2: 0 };

  bank.questions.forEach(q => {
    const text = (q.stem + ' ' + (q.opts || []).join(' '))
      .toLowerCase().replace(/\s+/g, ' ');
    const isGA = q.part === 'GA';
    const pool = isGA ? laneState.filter(L => L.ga) : laneState.filter(L => !L.ga);
    let laneBest = null, laneScore = 0;
    pool.forEach(L => {
      let sc = 0;
      L.rows.forEach(row => row.rules.forEach(r => { if (r.test(text)) sc++; }));
      if (sc > laneScore) { laneScore = sc; laneBest = L; }
    });
    let best = null, bestScore = 0;
    if (laneBest) laneBest.rows.forEach(row => {
      const sc = row.rules.reduce((a, r) => a + (r.test(text) ? 1 : 0), 0);
      if (sc > bestScore) { bestScore = sc; best = row; }
    });
    const d = q.marks >= 2 ? 'standard' : 'seed';
    diff[d]++;
    if (best) {
      best.hits++;
      laneBest.hits++;
    } else {
      unclass.push('Q' + q.n);
    }
    concepts.forEach(c => {
      if (c.rules.some(r => r.test(text))) c.hits++;
    });
    const t = q.type;
    types[isGA ? 'GA' : 'PH'][t] = (types[isGA ? 'GA' : 'PH'][t] || 0) + 1;
    if (q.marks === 1) marksSplit.m1++; else if (q.marks === 2) marksSplit.m2++;
    q._lane = laneBest ? laneBest.id : null;
    q._sub = best ? best.id : null;
  });

  const laneTable = {};
  laneState.forEach(L => {
    if (L.ga) { laneTable[L.id] = { total: L.hits, subs: { 'general-aptitude': L.hits } }; return; }
    const subs = {};
    L.rows.forEach(r => { if (r.hits > 0) subs[r.id] = r.hits; });
    laneTable[L.id] = { total: L.hits, subs };
  });
  const conceptTable = {};
  concepts.forEach(c => { if (c.hits > 0) conceptTable[c.id] = c.hits; });
  return { laneTable, conceptTable, unclass, diff, types, marksSplit };
}

const out = {
  _meta: {
    op: 'PAPERFORGE STAGE 1 — CARTOGRAPHY (new-year extension)',
    generated: '2026-08-17',
    basis: 'user-supplied fiziks PDFs mined by _audit/paperforge/parse_gate.py',
    taxonomy: 'TOPICFORGE T0 taxonomy, lane-first algorithm (identical to topicforge_mine.js)',
    scope: 'GATE 2020 + GATE 2024 + GATE 2025 (the 3 requisition years; 65Q each)',
    keyStatus: {
      gate2020: 'UNKEYED — question paper only, no answers in PDF',
      gate2024: 'fiziks solved key (65/65) — coaching key, not official IIT key sheet',
      gate2025: 'fiziks solved key (65/65) — coaching key, not official IIT key sheet',
    },
    note: 'Report-only. Shipped TOPICFORGE map/fleet untouched.',
  },
  years: {},
  combined: { laneTotals: {}, conceptTotals: {}, types: {}, marksSplit: { m1: 0, m2: 0 }, diff: { seed: 0, standard: 0 } },
  rosterDelta: [],
};

const perYear = {};
banks.forEach(bank => {
  const r = classify(bank);
  // tagged bank export: originals + lane/subtopic tags per question
  bank.questions.forEach(q => { q.lane = q._lane || null; q.subtopic = q._sub || null; delete q._lane; delete q._sub; });
  fs.writeFileSync(BASE + bank.id + '.tagged.json', JSON.stringify(bank, null, 1));
  perYear[bank.id] = r;
  out.years[bank.id] = {
    label: bank.label, keyStatus: bank.keyStatus, totalQ: bank.totalQ,
    ga: bank.questions.filter(q => q.part === 'GA').length,
    ph: bank.questions.filter(q => q.part === 'PH').length,
    typesByPart: r.types, marksSplit: r.marksSplit, difficultyProxy: r.diff,
    lanes: r.laneTable, concepts: r.conceptTable, unclassified: r.unclass,
  };
});

/* combined */
Object.keys(perYear).forEach(id => {
  const r = perYear[id];
  Object.keys(r.laneTable).forEach(l => {
    out.combined.laneTotals[l] = (out.combined.laneTotals[l] || 0) + r.laneTable[l].total;
  });
  Object.keys(r.conceptTable).forEach(c => {
    out.combined.conceptTotals[c] = (out.combined.conceptTotals[c] || 0) + r.conceptTable[c];
  });
  ['GA', 'PH'].forEach(p => Object.keys(r.types[p]).forEach(t => {
    const k = p + ':' + t;
    out.combined.types[k] = (out.combined.types[k] || 0) + r.types[p][t];
  }));
  out.combined.marksSplit.m1 += r.marksSplit.m1;
  out.combined.marksSplit.m2 += r.marksSplit.m2;
  out.combined.diff.seed += r.diff.seed;
  out.combined.diff.standard += r.diff.standard;
});

/* roster delta: the 28 shipped drill concepts vs new-session support */
oldMap.drills.forEach(d => {
  const gained = years.filter(y => (perYear['gate' + y].conceptTable[d.id] || 0) > 0);
  out.rosterDelta.push({
    rank: d.rank, id: d.id, oldSessions: d.sessions, oldHits: d.hits,
    newYearHits: Object.fromEntries(years.map(y => [y, perYear['gate' + y].conceptTable[d.id] || 0])),
    sessionsIfRemined: d.sessions + gained.length,
  });
});

fs.writeFileSync('/home/user/project/paperforge-blueprint.json', JSON.stringify(out, null, 1));

/* console QA print */
years.forEach(y => {
  const r = perYear['gate' + y];
  const lanes = Object.keys(r.laneTable).filter(l => r.laneTable[l].total > 0);
  console.log('GATE ' + y + ' | lanes:', lanes.map(l => l + '=' + r.laneTable[l].total).join(' '));
  console.log('   unclass=' + r.unclass.length + ' | types ' + JSON.stringify(r.types) +
    ' | marks ' + JSON.stringify(r.marksSplit));
});
console.log('combined lanes:', JSON.stringify(out.combined.laneTotals));
console.log('classified of 195:', 195 - years.reduce((a, y) => a + perYear['gate' + y].unclass.length, 0));
console.log('roster delta lines:', out.rosterDelta.length);
