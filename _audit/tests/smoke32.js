/* smoke32 (jsdom) — TOPICFORGE T5: real deliverable shell + real companions
   (map + panel + all nine live banks: T1 quantum, T2 classical + mathphys,
   T3 emtheory + thermo, T4 electronics + atomic, T5 nuclear + solidstate)
   + real KaTeX, then FULL headless play-throughs on the NEW T5 fleets:
   TF-NU-01 perfect run (98/98), TF-SS-01 with one wrong seed (93.625),
   figure rendering in cockpit + review, nine-lane fleet rendering, and
   namespace isolation. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c) { passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const H = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const mapSrc = fs.readFileSync('/home/user/project/topicforge-map.js', 'utf8');
const panelSrc = fs.readFileSync('/home/user/project/topicforge-panel.js', 'utf8');
const bankQ = fs.readFileSync('/home/user/project/topicforge-bank-quantum.js', 'utf8');
const bankC = fs.readFileSync('/home/user/project/topicforge-bank-classical.js', 'utf8');
const bankM = fs.readFileSync('/home/user/project/topicforge-bank-mathphys.js', 'utf8');
const bankE = fs.readFileSync('/home/user/project/topicforge-bank-emtheory.js', 'utf8');
const bankT = fs.readFileSync('/home/user/project/topicforge-bank-thermo.js', 'utf8');
const bankEL = fs.readFileSync('/home/user/project/topicforge-bank-electronics.js', 'utf8');
const bankAM = fs.readFileSync('/home/user/project/topicforge-bank-atomic.js', 'utf8');
const bankNU = fs.readFileSync('/home/user/project/topicforge-bank-nuclear.js', 'utf8');
const bankSS = fs.readFileSync('/home/user/project/topicforge-bank-solidstate.js', 'utf8');
const katex = require('/tmp/domt/node_modules/katex');

const shellIdx = H.indexOf('id="panel-topicforge"');
ok(shellIdx > -1, 'panel shell exists in deliverable');
const shell = H.slice(H.lastIndexOf('<div class="panel"', shellIdx), H.indexOf('</div>\n</div><!-- /wrap -->', shellIdx));
const navIdx = H.indexOf('data-tab="topicforge"');
const navBtn = H.slice(H.lastIndexOf('<button', navIdx), H.indexOf('</button>', navIdx) + 9);

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(String(e)));
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div>' + navBtn + '</div>' + shell + '</body></html>',
  { url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc, pretendToBeVisual: true });
const w = dom.window, doc = w.document;
w.katex = katex;
w.eval(mapSrc);
w.eval(bankQ);
w.eval(bankC);
w.eval(bankM);
w.eval(bankE);
w.eval(bankT);
w.eval(bankEL);
w.eval(bankAM);
w.eval(bankNU);
w.eval(bankSS);
w.eval(panelSrc);

const ready = new Promise(res => {
  if (w.document.readyState !== 'loading') res();
  else w.document.addEventListener('DOMContentLoaded', res);
});
ready.then(() => {
  const BANKN = w.TOPICFORGE_BANKS.nuclear;
  const BANKS = w.TOPICFORGE_BANKS.solidstate;

  console.log('[0] bank + renderer wiring');
  ok(typeof w.katex.renderToString === 'function', 'katex live on window');
  ok(typeof w.TOPICFORGE_PANEL_RENDER === 'function', 'panel exposes re-render entry');
  ok(w.TOPICFORGE_BANKS.quantum.mocks.length === 5, 'quantum T1 fleet still mounted');
  ok(w.TOPICFORGE_BANKS.classical.mocks.length === 5 && w.TOPICFORGE_BANKS.mathphys.mocks.length === 5, 'T2 fleets still mounted');
  ok(w.TOPICFORGE_BANKS.electronics.mocks.length === 5 && w.TOPICFORGE_BANKS.atomic.mocks.length === 5, 'T4 fleets still mounted');
  ok(BANKN.mocks.length === 5, '5 nuclear mocks mounted');
  ok(BANKS.mocks.length === 5, '5 solidstate mocks mounted');
  ok(/AI-GENERATED/.test(BANKN.meta.label) && /AI-GENERATED/.test(BANKS.meta.label), 'both T5 banks labelled AI-GENERATED');
  ok(BANKN.meta.stage === 'T5' && BANKS.meta.stage === 'T5', 'stage chip data = T5');

  console.log('[1] fleet rendering on all NINE live lanes');
  ['quantum', 'classical', 'mathphys', 'emtheory', 'thermo', 'electronics', 'atomic', 'nuclear', 'solidstate'].forEach(ln => {
    const lane = doc.querySelector('.tf-lane[data-lane="' + ln + '"]');
    ok(!!lane, ln + ' lane card present');
    const fleet = lane.querySelector('.tf-fleet');
    ok(!!fleet, ln + ' fleet section rendered');
    ok(!lane.querySelector('.tf-lock'), ln + ' lock badge replaced by live fleet');
    ok(lane.querySelectorAll('.tf-mock').length === 5, ln + ' has 5 mock cards');
    ok(/AI-GENERATED/.test(fleet.querySelector('.tf-aichi').textContent), ln + ' AI-GEN chip on fleet head');
  });
  const headN = doc.querySelector('.tf-lane[data-lane="nuclear"] .tf-fleet-head').textContent;
  const headS = doc.querySelector('.tf-lane[data-lane="solidstate"] .tf-fleet-head').textContent;
  const headQ = doc.querySelector('.tf-lane[data-lane="quantum"] .tf-fleet-head').textContent;
  ok(/T5 FORGED/.test(headN), 'nuclear head chip reads T5 FORGED — got: ' + headN.slice(0, 40));
  ok(/T5 FORGED/.test(headS), 'solidstate head chip reads T5 FORGED — got: ' + headS.slice(0, 40));
  ok(/T1 PILOT/.test(headQ), 'quantum head chip keeps T1 PILOT — got: ' + headQ.slice(0, 40));
  const stillLocked = Array.from(doc.querySelectorAll('.tf-lane')).filter(l => ['quantum', 'classical', 'mathphys', 'emtheory', 'thermo', 'electronics', 'atomic', 'nuclear', 'solidstate'].indexOf(l.dataset.lane) === -1);
  ok(stillLocked.length === 1 && stillLocked.every(l => l.querySelector('.tf-lock')), 'only aptitude lane stays locked');

  console.log('[2] cockpit opens on TF-NU-01 (nuclear, figure-bearing)');
  doc.querySelector('[data-tf-play="TF-NU-01"]').click();
  const run = doc.getElementById('tfRun');
  ok(!!run && run.style.display === 'flex', 'overlay opens');
  ok(/TF-NU-01/.test(run.querySelector('.tf-run-id').textContent), 'cockpit titled');
  ok(run.querySelector('.tf-timer').textContent === '55:00', 'timer starts at 55:00');
  ok(run.querySelectorAll('.tf-pal button').length === 25, '25 palette buttons');

  console.log('[3] perfect play-through via clicks (TF-NU-01)');
  const mock1 = BANKN.mocks[0];
  let figSeen = 0;
  mock1.problems.forEach((p, i) => {
    run.querySelector('.tf-pal').querySelectorAll('button')[i].click();
    if (p.fig) {
      const fig = run.querySelector('.tf-fig');
      if (fig && fig.querySelector('svg')) figSeen++;
    }
    const opts = run.querySelectorAll('.tf-qopt');
    ok(/Q \d+ \/ 25/.test(run.querySelector('.tf-prog').textContent), 'progress label at Q' + (i + 1));
    opts[p.a].click();
  });
  const mock1Figs = mock1.problems.filter(p => p.fig).length;
  ok(mock1Figs >= 3, 'TF-NU-01 carries >=3 figures — got ' + mock1Figs);
  ok(figSeen === mock1Figs, 'every figure problem painted its .tf-fig SVG in-cockpit (' + figSeen + '/' + mock1Figs + ')');
  ok(run.querySelectorAll('.tf-pal button.ans').length === 25, 'all 25 marked answered on palette');

  console.log('[4] submit arm-confirm + stored attempt');
  const subm = run.querySelector('.tf-subm');
  subm.click();
  ok(/CONFIRM/.test(subm.textContent), 'first click arms confirmation');
  subm.click();
  const stored1 = JSON.parse(w.localStorage.getItem('tf:att:TF-NU-01'));
  ok(stored1.length === 1, 'one attempt persisted under tf:att:TF-NU-01');
  ok(stored1[0].score === 98 && stored1[0].max === 98, 'perfect run scores 98/98 — got ' + stored1[0].score);
  ok(stored1[0].correct === 25 && stored1[0].wrong === 0 && stored1[0].skip === 0, '25/0/0 breakdown');

  console.log('[5] review mode (figures + solutions)');
  const revs = run.querySelectorAll('.tf-rev');
  ok(revs.length === 25, '25 review cards — got ' + revs.length);
  ok(Array.from(revs).every(r => r.className.indexOf('good') > -1), 'all review cards good');
  ok(run.querySelectorAll('.tf-rev .tf-fig svg').length === mock1Figs, 'figures repainted inside review cards');
  ok(run.querySelectorAll('.tf-sol-lab').length === 50, 'solution + double-check blocks ×25');
  ok(run.querySelectorAll('.katex').length > 200, 'KaTeX actually rendered math — spans: ' + run.querySelectorAll('.katex').length);
  ok(doc.querySelectorAll('.katex-error').length === 0, 'ZERO katex-errors in whole document');
  run.querySelector('.tf-end').click();
  ok(doc.getElementById('tfRun').style.display === 'none', 'overlay closed');

  console.log('[6] fleet stats refreshed on nuclear lane');
  const statsC = doc.querySelector('.tf-lane[data-lane="nuclear"]').querySelectorAll('.tf-mock-stats')[0].textContent;
  ok(/attempts: 1/.test(statsC) && /best: 100.0%/.test(statsC), 'TF-NU-01 card shows 1 attempt, best 100.0% — got: ' + statsC);

  console.log('[7] negative-marking run (TF-SS-01, crystal structures)');
  doc.querySelector('[data-tf-play="TF-SS-01"]').click();
  const mock2 = BANKS.mocks[0];
  mock2.problems.forEach((p, i) => {
    doc.getElementById('tfRun').querySelector('.tf-pal').querySelectorAll('button')[i].click();
    const opts = doc.getElementById('tfRun').querySelectorAll('.tf-qopt');
    const pick = (i === 0) ? (p.a + 1) % 4 : p.a;   // exactly one wrong: Q01 (a seed B-style question)
    opts[pick].click();
  });
  const s2 = doc.querySelector('#tfRun .tf-subm');
  s2.click(); s2.click();
  const stored2 = JSON.parse(w.localStorage.getItem('tf:att:TF-SS-01'));
  const want = Math.round((98 - 3.5 - 0.875) * 1000) / 1000;
  ok(stored2.length === 1, 'solidstate attempt stored');
  ok(stored2[0].score === want, 'one wrong seed answer yields 93.625 (CSIR negative −0.875) — got ' + stored2[0].score + ' want ' + want);
  ok(stored2[0].correct === 24 && stored2[0].wrong === 1, '24 correct / 1 wrong');
  ok(doc.getElementById('tfRun').querySelectorAll('.tf-rev.bad').length === 1, 'exactly one bad review card');
  const statsM = doc.querySelector('.tf-lane[data-lane="solidstate"]').querySelectorAll('.tf-mock-stats')[0].textContent;
  /* counts as written */ ok(/attempts: 1/.test(statsM), 'TF-SS-01 card shows 1 attempt — got: ' + statsM);
  doc.getElementById('tfRun').querySelector('.tf-end').click();

  console.log('[8] namespace isolation + runtime hygiene');
  const keys = [];
  for (let i = 0; i < w.localStorage.length; i++) keys.push(w.localStorage.key(i));
  ok(keys.every(k => k.indexOf('tf:att:') === 0), 'localStorage holds ONLY tf:att: keys — got: ' + keys.join(','));
  ok(keys.indexOf('tf:att:TF-NU-01') > -1 && keys.indexOf('tf:att:TF-SS-01') > -1, 'both T5 attempt keys present');
  ok(errors.length === 0, 'zero jsdom errors');
  ok(errors.filter(e => /SecurityError|Not implemented/.test(e)).length === 0, 'no DOM security not-implemented noise');

  console.log('\nsmoke32: ' + passed + ' passed, ' + failed + ' failed');
  if (failed) process.exit(1);
  process.exit(0);
});
