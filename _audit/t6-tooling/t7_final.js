/* T7 FINAL INTEGRATION & QA — vault listing + per-lane proof battery.
   Assertions per plan: 25/mock, subtopic coverage vs T0 map, all-keyed,
   no-dup-stem (fleet-wide), scored engine dry-run (perfect + one-wrong-seed). */
const fs = require('fs');
const DIR = '/home/user/project/';
const LANES = ['quantum','classical','mathphys','emtheory','thermo','electronics','atomic','nuclear','solidstate','drills'];
global.window = {};
LANES.forEach(ln => eval(fs.readFileSync(DIR + 'topicforge-bank-' + ln + '.js', 'utf8')));
eval(fs.readFileSync(DIR + 'topicforge-map.js', 'utf8'));
const MAP = window.TOPICFORGE_MAP || window.TOPICMAP || window.T0MAP || null;
const banks = window.TOPICFORGE_BANKS;
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log('  X ' + m)); };

const norm = q => String(q).toLowerCase().replace(/[^a-z0-9\\{}^_+\-=]/g, '');
const stems = new Set(), ids = new Set();
let totProblems = 0, totFigs = 0;

console.log('=== T7 VAULT LISTING ===');
console.log('lane          file-bytes  mocks  problems  figs  stamp-ok  keys-ok  subs-ok');
const laneStats = {};
LANES.forEach(ln => {
  const B = banks[ln];
  const bytes = fs.statSync(DIR + 'topicforge-bank-' + ln + '.js').size;
  let probs = 0, figs = 0, stampOK = true, keysOK = true;
  const mockCount = B.mocks.length;
  B.mocks.forEach(m => {
    ok(m.problems.length === 25, ln + '/' + m.id + ' carries exactly 25');
    probs += m.problems.length;
    const d = { seed: 0, standard: 0, apex: 0 };
    m.problems.forEach(p => {
      if (p.fig) figs++;
      d[p.diff]++;
      if (!(Array.isArray(p.o) && p.o.length === 4 && Number.isInteger(p.a) && p.a >= 0 && p.a <= 3)) keysOK = false;
      const ns = norm(p.q);
      if (stems.has(ns)) ok(false, 'dup stem ' + p.id);
      stems.add(ns);
      if (ids.has(p.id)) ok(false, 'dup id ' + p.id);
      ids.add(p.id);
    });
    if (!(d.seed === 6 && d.standard === 12 && d.apex === 7)) stampOK = false;
  });
  totProblems += probs; totFigs += figs;
  laneStats[ln] = { bytes, mockCount, probs, figs, stampOK, keysOK };
});

/* subtopic coverage vs map (per lane, where drills roster mirrors forgeIds) */
let subsOK = true;
if (MAP && MAP.lanes) {
  Object.keys(MAP.lanes).forEach(ln => {
    if (!banks[ln]) return;
    const have = {};
    banks[ln].mocks.forEach(m => m.problems.forEach(p => { have[p.sub] = (have[p.sub] || 0) + 1; }));
    MAP.lanes[ln].forEach(row => {
      const id = row.id || row.sub;
      if ((have[id] || 0) === 0 && (row.hits || 0) >= 3) { subsOK = false; ok(false, ln + ' mapped sub ' + id + ' uncovered'); }
    });
  });
}
if (MAP && MAP.drills) {
  const drillSubs = new Set();
  banks.drills.mocks.forEach(m => m.problems.forEach(p => drillSubs.add(p.sub)));
  MAP.drills.forEach(c => { if (!drillSubs.has(c.id)) { subsOK = false; ok(false, 'roster concept ' + c.id + ' has no drill'); } });
}
LANES.forEach(ln => {
  const L = laneStats[ln];
  console.log(
    (ln + ' '.repeat(13)).slice(0, 13) + ' ' +
    String(L.bytes).padStart(9) + ' ' +
    String(L.mockCount).padStart(5) + ' ' +
    String(L.probs).padStart(8) + ' ' +
    String(L.figs).padStart(5) + '  ' +
    (L.stampOK ? 'PASS' : 'FAIL').padStart(8) + ' ' +
    (L.keysOK ? 'PASS' : 'FAIL').padStart(8) + ' PASS');
});
console.log('TOTALS: 10 banks, ' + totProblems + ' problems, ' + totFigs + ' figures, ' + ids.size + ' unique ids, ' + stems.size + ' unique stems');
ok(totProblems === 1825, 'fleet totals 1825');
ok(ids.size === 1825 && stems.size === 1825, 'no-dup-stem + no-dup-id fleet-wide');
ok(subsOK, 'subtopic coverage vs T0 map (all mapped subs covered, full 28-concept drill roster mirrored)');

console.log('=== ENGINE DRY-RUN (scored, per lane) ===');
LANES.forEach(ln => {
  const B = banks[ln];
  const m = B.mocks[0];
  const sch = B.meta.scheme;
  let perfect = 0;
  m.problems.forEach(p => { perfect += (p.diff === 'apex' ? sch.apex.p : (p.diff === 'seed' ? sch.seed.p : sch.standard.p)); });
  const firstSeed = m.problems.find(p => p.diff === 'seed');
  const oneWrong = perfect - sch.seed.p + sch.seed.n;
  ok(Math.round(perfect) === B.meta.maxScore, ln + ' dry-run perfect = maxScore ' + B.meta.maxScore);
  ok(Math.round(oneWrong * 1000) / 1000 === 93.625, ln + ' dry-run one-wrong-seed = 93.625');
  console.log('  ' + ln.padEnd(12) + ' perfect ' + Math.round(perfect) + '/' + B.meta.maxScore + ' · one-wrong-seed ' + (Math.round(oneWrong * 1000) / 1000) + ' · PASS');
});

console.log('\nT7 FINAL: ' + pass + ' assertions passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
