/* topicforge_mine.js — T0 MINER (logic). Classifies the question universe into
   the 10 TOPICFORGE lanes × subtopics + derives the ≥3-distinct-sessions
   concept-drill roster. Emits:
     /home/user/project/topicforge-map.js  (window.TOPICFORGE_MAP — panel companion)
     /home/user/project/TOPICMAP_T0.md     (human approval table — the T0 GATE doc)
   Deterministic: same banks in ⇒ same map out. */
'use strict';
const fs = require('fs'), vm = require('vm');
const { R, LANES, CONCEPTS } = require('/home/user/_audit/topicforge_taxonomy.js');

/* ---- universe assembly ---- */
const sim = JSON.parse(fs.readFileSync('/tmp/sim_papers.json', 'utf8'));
const sGate = { window: {}, console }; vm.createContext(sGate);
vm.runInContext(fs.readFileSync('/home/user/project/gate-pyq-data.js', 'utf8'), sGate);
const ext = sGate.window.GATE_EXTRACTED_BANKS;

const U = [];
const pushQ = (exam, session, q) => U.push({
  exam, session, part: q.part, n: q.n,
  text: (q.q + ' ' + (q.opts || []).join(' ')).toLowerCase().replace(/\s+/g, ' '),
  marks: q.correctMarks || null
});
sim.forEach(p => { if (p.id === 'gate2017') return; /* image stub; extracted text bank owns 2017 */
  (p.questions || []).forEach(q => pushQ(p.id.startsWith('gate') ? 'GATE' : 'CSIR', p.id, q)); });
Object.keys(ext).forEach(k => ext[k].questions.forEach(q => pushQ('GATE', k, q)));

/* ---- lane row state ---- */
LANES.forEach(L => { L.rows = L.subs.map(([id, rules]) =>
  ({ id, rules: rules.map(R), hits: 0, csir: 0, gate: 0, sessions: new Set(), diff: { seed: 0, standard: 0, apex: 0 } })); });
const conceptTally = CONCEPTS.map(([id, rules]) => ({ id, rules: rules.map(R), hits: 0, sessions: new Set(), exams: new Set() }));
const unclass = { csir: [], gate: [] };

/* ---- classify (lane-first: lane = max total rule hits, sub = best rule row inside it) ---- */
U.forEach(item => {
  const isGA = item.part === 'A';
  const pool = isGA ? [LANES.find(L => L.ga)] : LANES.filter(L => !L.ga);
  let laneBest = null, laneScore = 0;
  pool.forEach(L => {
    let sc = 0;
    L.rows.forEach(row => row.rules.forEach(r => { if (r.test(item.text)) sc++; }));
    if (sc > laneScore){ laneScore = sc; laneBest = L; }
  });
  let best = null, bestScore = 0;
  if (laneBest) laneBest.rows.forEach(row => {
    const sc = row.rules.reduce((a, r) => a + (r.test(item.text) ? 1 : 0), 0);
    if (sc > bestScore){ bestScore = sc; best = row; }
  });
  const diff = item.exam === 'CSIR' ? (item.part === 'C' ? 'apex' : 'standard')
                                    : ((item.marks && item.marks >= 2) ? 'standard' : 'seed');
  if (best){
    best.hits++; best.diff[diff]++; best.sessions.add(item.exam + ':' + item.session);
    if (item.exam === 'CSIR') best.csir++; else best.gate++;
  } else {
    (item.exam === 'CSIR' ? unclass.csir : unclass.gate).push(item.session + ' Q' + item.n + ' (' + item.part + ')');
  }
  conceptTally.forEach(c => { if (c.rules.some(r => r.test(item.text))){ c.hits++; c.sessions.add(item.exam + ':' + item.session); c.exams.add(item.exam); } });
});

/* ---- roll up (zero-hit subtopics drop to meta.emptySubs — visible, never silent) ---- */
const emptySubs = [];
const lanesOut = LANES.map(L => {
  const rows = [], hasZero = [];
  L.rows.forEach(r => {
    if (r.hits > 0) rows.push({ id: r.id, hits: r.hits, csir: r.csir, gate: r.gate, sessions: r.sessions.size, diff: r.diff });
    else emptySubs.push(L.id + '/' + r.id);
  });
  rows.sort((a, b) => b.hits - a.hits);
  const total = rows.reduce((a, r) => a + r.hits, 0);
  return { id: L.id, title: L.title, total, rows };
});
const drillRoster = conceptTally
  .map(c => ({ id: c.id, hits: c.hits, sessions: c.sessions.size, exams: [...c.exams].sort().join('+') }))
  .filter(c => c.sessions >= 3)
  .sort((a, b) => b.sessions - a.sessions || b.hits - a.hits)
  .map((c, i) => ({ rank: i + 1, ...c, forgeId: 'drill-' + c.id + '-01' }));

const universe = {
  total: U.length,
  csir: U.filter(q => q.exam === 'CSIR').length,
  gate: U.filter(q => q.exam === 'GATE').length,
  csirSessions: [...new Set(U.filter(q => q.exam === 'CSIR').map(q => q.session))],
  gateSessions: [...new Set(U.filter(q => q.exam === 'GATE').map(q => q.session))],
  gaTotal: U.filter(q => q.part === 'A').length,
  physicsTotal: U.filter(q => q.part !== 'A').length,
  unclassCsir: unclass.csir.length, unclassGate: unclass.gate.length
};
const assignedTotal = universe.total - universe.unclassCsir - universe.unclassGate;

const MAP = {
  meta: {
    op: 'TOPICFORGE T0 — THE MAP', version: 'T0', generated: '2026-08-14',
    universe, classifiedPct: +(100 * assignedTotal / universe.total).toFixed(1),
    assumptions: [
      'Part A (both exams) routes to the General Aptitude lane; everything else routes to the 9 physics lanes.',
      'Difficulty proxy (documented, not claimed exact): CSIR Part C = apex, Part B = standard; GATE 2-mark = standard, 1-mark = seed; CSIR Part A / GATE GA baseline = standard/seed by marks.',
      'Subtopic assignment is LANE-FIRST: lane = max total rule hits, subtopic = best rule inside that lane; ties resolve to the earlier lane in the canonical order.',
      'Zero-hit questions are COUNTED, not hidden (see unclassified); zero-hit subtopics are demoted to meta.emptySubs (still on the T1 coverage checklist).',
      'Concept-drill roster rule: concept matches ≥3 DISTINCT exam sessions across either exam (exam-agnostic per plan).',
      'Mining only — zero problems forged. T1 pilot awaits map approval.'
    ]
  },
  lanes: lanesOut,
  drills: drillRoster,
  unclassified: { csir: unclass.csir, gate: unclass.gate },
  emptySubs
};

fs.writeFileSync('/home/user/project/topicforge-map.js',
  '/* TOPICFORGE T0 — mined lane/subtopic map (generated by _audit/topicforge_mine.js, 2026-08-14)\n' +
  '   Read-only data: the panel scaffold renders this at T0; problems forge at T1+. */\n' +
  'window.TOPICFORGE_MAP = ' + JSON.stringify(MAP, null, 1) + ';\n');

/* ---- console report ---- */
console.log('══════════════════ T0 MAP — universe ══════════════════');
console.log('total:', universe.total, '| CSIR:', universe.csir, '(' + universe.csirSessions.length + ' sessions) | GATE:', universe.gate, '(' + universe.gateSessions.length + ' banks)');
console.log('GA/Part-A:', universe.gaTotal, '| physics:', universe.physicsTotal);
console.log('classified:', assignedTotal, '(' + MAP.meta.classifiedPct + '%) | unclassified: CSIR', universe.unclassCsir, '+ GATE', universe.unclassGate);
console.log('\n══════════════ lanes ══════════════');
lanesOut.forEach(L => {
  console.log('\n[' + L.id + '] ' + L.title + ' — total ' + L.total);
  L.rows.forEach(r => { if (r.hits) console.log('   ' + String(r.hits).padStart(3) + ' (' + String(r.csir).padStart(3) + 'C/' + String(r.gate).padStart(3) + 'G) ' + r.id.padEnd(26) + ' sessions:' + String(r.sessions).padStart(2) + '  diff s/Σ/a ' + r.diff.seed + '/' + r.diff.standard + '/' + r.diff.apex); });
});
console.log('\n══════════════ concept drill roster (≥3 sessions): ' + drillRoster.length + ' ══════════════');
drillRoster.forEach(c => console.log('   #' + String(c.rank).padStart(2) + ' ' + c.id.padEnd(28) + ' hits:' + String(c.hits).padStart(3) + ' sessions:' + String(c.sessions).padStart(2) + ' [' + c.exams + ']'));
console.log('\n--- unclassified (audit, visible — not dropped) ---');
console.log('CSIR (' + unclass.csir.length + '):', unclass.csir.slice(0, 25).join(' | '), unclass.csir.length > 25 ? '…' : '');
console.log('GATE (' + unclass.gate.length + '):', unclass.gate.slice(0, 25).join(' | '), unclass.gate.length > 25 ? '…' : '');
console.log('\n--- zero-hit subtopics (demoted to meta.emptySubs, still on T1 checklist) ---');
console.log(emptySubs.join(', ') || '(none)');
