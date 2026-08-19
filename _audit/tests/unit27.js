/* UNIT27 — TOPICFORGE T0 map integrity (pure, no DOM): schema, universe
   accounting, classification thresholds, drill-roster rule, lane sanity,
   companion wiring in the deliverable. */
'use strict';
const fs = require('fs'), vm = require('vm');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL:', m); } };

const H = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const SRC = fs.readFileSync('/home/user/project/topicforge-map.js', 'utf8');
const s = { window: {}, console }; vm.createContext(s); vm.runInContext(SRC, s);
const MAP = s.window.TOPICFORGE_MAP;

/* ---- wiring ---- */
ok(H.indexOf('data-tab="topicforge"') > -1, 'tab button present in deliverable');
ok(H.indexOf('id="panel-topicforge"') > -1, 'panel shell present');
ok(H.indexOf('<script src="./topicforge-map.js"></script>') > -1, 'map companion wired');
ok(H.indexOf('<script src="./topicforge-panel.js"></script>') > -1, 'panel companion wired');
ok(H.indexOf('topicforge-map.js') < H.indexOf('topicforge-panel.js'), 'map loads before panel renderer');
const PANEL_JS = fs.readFileSync('/home/user/project/topicforge-panel.js', 'utf8');
ok(PANEL_JS.indexOf('</body') === -1 && PANEL_JS.indexOf('</style') === -1, 'panel companion free of forbidden literals');

/* ---- meta/schema ---- */
ok(MAP && MAP.meta && MAP.meta.version === 'T0', 'map version T0');
const U = MAP.meta.universe;
ok(U.total === U.csir + U.gate, 'universe accounting: total = CSIR + GATE (' + U.total + ')');
ok(U.csirSessions.length === 12 && U.gateSessions.length === 11, '12 CSIR sessions + 11 GATE banks');
ok(U.total >= 1600, 'universe size sane: ' + U.total);
ok(U.gaTotal === U.total - U.physicsTotal, 'GA/physics split accounting');
ok(MAP.meta.classifiedPct >= 75, 'classification rate ≥75% — got ' + MAP.meta.classifiedPct);
ok(U.unclassCsir + U.unclassGate === U.total - (MAP.lanes.reduce((a, l) => a + l.total, 0)),
   'unclassified count + lane totals = universe total (counted-not-dropped invariant)');
ok(Array.isArray(MAP.meta.assumptions) && MAP.meta.assumptions.length >= 4, 'assumption ledger present');

/* ---- lanes ---- */
ok(MAP.lanes.length === 10, 'exactly 10 lanes');
const ids = MAP.lanes.map(l => l.id);
ok(new Set(ids).size === 10, 'lane ids unique');
const EXPECTED = ['mathphys','classical','emtheory','quantum','thermo','electronics','atomic','nuclear','solidstate','aptitude'];
EXPECTED.forEach(e => ok(ids.indexOf(e) > -1, 'lane present: ' + e));
ok(Array.isArray(MAP.emptySubs), 'zero-hit subtopics demoted to meta.emptySubs (visible, not silent)');
MAP.lanes.forEach(l => {
  ok(l.rows.length >= 6, l.id + ' — ≥6 populated subtopics (' + l.rows.length + ')');
  const sum = l.rows.reduce((a, r) => a + r.hits, 0);
  ok(sum === l.total, l.id + ' — subtopic hits sum to lane total (' + sum + ')');
  l.rows.forEach(r => {
    ok(r.hits > 0, l.id + '/' + r.id + ' — populated (zero-hit rows live in emptySubs, not here)');
    ok(r.csir + r.gate === r.hits, l.id + '/' + r.id + ' — csir+gate == hits');
    ok(r.diff.seed + r.diff.standard + r.diff.apex === r.hits, l.id + '/' + r.id + ' — difficulty mix sums to hits');
    ok(r.sessions > 0, l.id + '/' + r.id + ' — appears in ≥1 session');
  });
});
const apt = MAP.lanes.find(l => l.id === 'aptitude');
ok(apt.total > 0 && apt.rows.every(r => r.diff.apex === 0), 'aptitude lane: no apex-difficulty leaks from physics proxies');
ok(MAP.lanes.filter(l => l.id !== 'aptitude').every(l => l.total > 25), 'every physics lane has ≥25 mined questions (a full mock of signal)');

/* ---- drill roster rule ---- */
ok(Array.isArray(MAP.drills) && MAP.drills.length >= 20, 'drill roster ≥20 concepts — got ' + MAP.drills.length);
ok(MAP.drills.every(c => c.sessions >= 3), 'every drill concept crosses ≥3 distinct sessions (the plan rule)');
ok(MAP.drills.every(c => c.forgeId === 'drill-' + c.id + '-01'), 'drill forgeIds stamped');
ok(MAP.drills.every((c, i) => c.rank === i + 1), 'ranks contiguous');
ok(MAP.drills.every((c, i, a) => i === 0 || a[i-1].sessions > c.sessions || (a[i-1].sessions === c.sessions && a[i-1].hits >= c.hits)), 'roster sorted by sessions then hits');
ok(MAP.drills.some(c => /harmonic|wells|residue|partition/.test(c.id)), 'physics heavy-hitters on roster');
ok(MAP.drills.some(c => /dice|ratio|series|clock/.test(c.id)), 'GA repeat-offenders on roster');

/* ---- unclassified audit visibility ---- */
ok(Array.isArray(MAP.unclassified.csir) && Array.isArray(MAP.unclassified.gate), 'unclassified lists ship with the map');
ok(MAP.unclassified.csir.length === U.unclassCsir && MAP.unclassified.gate.length === U.unclassGate, 'unclassified list lengths match tallies');

console.log('unit27: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
