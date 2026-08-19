/* smoke28 (jsdom) — TOPICFORGE T1 pilot: real deliverable shell + real companions
   (map + panel + quantum bank) + real KaTeX/auto-render, then a FULL headless
   play-through: open TF-QM-01, answer all 25 correctly via clicks, submit with
   the arm-confirm, assert stored attempt + review + zero math errors; then a
   negative-marking run on TF-QM-02 and the namespace isolation check. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c) { passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const H = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const mapSrc = fs.readFileSync('/home/user/project/topicforge-map.js', 'utf8');
const panelSrc = fs.readFileSync('/home/user/project/topicforge-panel.js', 'utf8');
const bankSrc = fs.readFileSync('/home/user/project/topicforge-bank-quantum.js', 'utf8');
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
w.eval(bankSrc);
w.eval(panelSrc);

const ready = new Promise(res => {
  if (w.document.readyState !== 'loading') res();
  else w.document.addEventListener('DOMContentLoaded', res);
});
ready.then(() => {
  const BANK = w.TOPICFORGE_BANKS.quantum;

  console.log('[0] bank + renderer wiring');
  ok(typeof w.katex.renderToString === 'function', 'katex live on window');
  ok(typeof w.TOPICFORGE_PANEL_RENDER === 'function', 'panel exposes re-render entry');
  ok(BANK.mocks.length === 5, '5 quantum mocks mounted');
  ok(/AI-GENERATED/.test(BANK.meta.label), 'bank labelled AI-GENERATED');

  console.log('[1] fleet rendering on quantum lane');
  const lane = doc.querySelector('.tf-lane[data-lane="quantum"]');
  ok(!!lane, 'quantum lane card present');
  const fleet = lane.querySelector('.tf-fleet');
  ok(!!fleet, 'fleet section rendered');
  ok(!lane.querySelector('.tf-lock'), 'lock badge replaced by live fleet');
  ok(/AI-GENERATED/.test(fleet.querySelector('.tf-aichi').textContent), 'AI-GEN chip on fleet head');
  const cards = Array.from(lane.querySelectorAll('.tf-mock'));
  ok(cards.length === 5, '5 mock cards — got ' + cards.length);
  cards.forEach(c => {
    const meta = c.querySelector('.tf-mock-meta').textContent;
    ok(/25 problems/.test(meta) && /55 min/.test(meta) && /max 98/.test(meta) && /subs:/.test(meta), 'card meta line');
    ok(/not yet attempted/.test(c.querySelector('.tf-mock-stats').textContent), 'fresh stats line');
  });
  const lockedOthers = Array.from(doc.querySelectorAll('.tf-lane')).filter(l => l.dataset.lane !== 'quantum');
  ok(lockedOthers.every(l => l.querySelector('.tf-lock')), 'other 9 lanes stay locked');

  console.log('[2] cockpit opens');
  lane.querySelector('[data-tf-play="TF-QM-01"]').click();
  const run = doc.getElementById('tfRun');
  ok(!!run && run.style.display === 'flex', 'overlay opens');
  ok(/TF-QM-01/.test(run.querySelector('.tf-run-id').textContent), 'cockpit titled');
  ok(run.querySelector('.tf-timer').textContent === '55:00', 'timer starts at 55:00');
  ok(run.querySelectorAll('.tf-pal button').length === 25, '25 palette buttons');
  ok(/AI-GENERATED PRACTICE/.test(run.querySelector('.tf-run-head').textContent), 'AI-GEN chip in cockpit head');
  ok(run.querySelectorAll('.tf-qopt').length === 4, '4 option buttons on Q1');

  console.log('[3] perfect play-through via clicks (TF-QM-01)');
  const mock1 = BANK.mocks[0];
  mock1.problems.forEach((p, i) => {
    run.querySelector('.tf-pal').querySelectorAll('button')[i].click();
    const opts = run.querySelectorAll('.tf-qopt');
    ok(/Q \d+ \/ 25/.test(run.querySelector('.tf-prog').textContent), 'progress label at Q' + (i + 1));
    opts[p.a].click();
  });
  ok(run.querySelectorAll('.tf-pal button.ans').length === 25, 'all 25 marked answered on palette');
  ok(run.querySelectorAll('.tf-qopt.sel').length === 1, 'current option marked selected');

  console.log('[4] submit arm-confirm + stored attempt');
  const subm = run.querySelector('.tf-subm');
  subm.click();
  ok(/CONFIRM/.test(subm.textContent), 'first click arms confirmation');
  subm.click();
  const stored1 = JSON.parse(w.localStorage.getItem('tf:att:TF-QM-01'));
  ok(stored1.length === 1, 'one attempt persisted under tf:att:TF-QM-01');
  ok(stored1[0].score === 98 && stored1[0].max === 98, 'perfect run scores 98/98 — got ' + stored1[0].score);
  ok(stored1[0].correct === 25 && stored1[0].wrong === 0 && stored1[0].skip === 0, '25/0/0 breakdown');
  ok(Object.keys(stored1[0].answers).length === 25, 'all 25 answers archived');

  console.log('[5] review mode');
  const revs = run.querySelectorAll('.tf-rev');
  ok(revs.length === 25, '25 review cards — got ' + revs.length);
  ok(Array.from(revs).every(r => r.className.indexOf('good') > -1), 'all review cards good');
  ok(run.querySelector('.tf-res-big').textContent.indexOf('98') > -1, 'big score renders');
  ok(/CSIR marking applied/.test(Array.from(run.querySelectorAll('.tf-res-sub')).map(x=>x.textContent).join(' | ')), 'scheme disclosure printed');
  ok(run.querySelectorAll('.tf-sol-lab').length === 50, 'solution + double-check blocks ×25 — got ' + run.querySelectorAll('.tf-sol-lab').length);
  ok(/AI-GENERATED/.test(run.querySelector('.tf-sol-lab').textContent), 'solution labelled AI-GENERATED');
  ok(run.querySelectorAll('.tf-rev-opt.corr').length >= 25, 'correct option highlighted in every review card — got ' + run.querySelectorAll('.tf-rev-opt.corr').length);
  ok(run.querySelectorAll('.katex').length > 200, 'KaTeX actually rendered math — spans: ' + run.querySelectorAll('.katex').length);
  ok(doc.querySelectorAll('.katex-error').length === 0, 'ZERO katex-errors in whole document');
  const wrongBtn = Array.from(run.querySelectorAll('.tf-filters button')).find(b => b.textContent === 'WRONG');
  wrongBtn.click();
  ok(run.querySelectorAll('.tf-rev').length === 0, 'WRONG filter empty after perfect run');
  run.querySelector('.tf-end').click();
  ok(doc.getElementById('tfRun').style.display === 'none', 'overlay closed');

  console.log('[6] fleet stats refreshed');
  const stats = lane.querySelectorAll('.tf-mock-stats')[0].textContent;
  ok(/attempts: 1/.test(stats) && /best: 100.0%/.test(stats) && /last: 100.0%/.test(stats), 'card stats show 1 attempt, best/last 100.0% — got: ' + stats);

  console.log('[7] negative-marking run (TF-QM-02)');
  lane.querySelector('[data-tf-play="TF-QM-02"]').click();
  const mock2 = BANK.mocks[1];
  mock2.problems.forEach((p, i) => {
    doc.getElementById('tfRun').querySelector('.tf-pal').querySelectorAll('button')[i].click();
    const opts = doc.getElementById('tfRun').querySelectorAll('.tf-qopt');
    const pick = (i === 0) ? (p.a + 1) % 4 : p.a;   // exactly one wrong: Q01 (a seed B-style question)
    opts[pick].click();
  });
  const s2 = doc.querySelector('#tfRun .tf-subm');
  s2.click(); s2.click();
  const stored2 = JSON.parse(w.localStorage.getItem('tf:att:TF-QM-02'));
  const want = Math.round((98 - 3.5 - 0.875) * 1000) / 1000;
  ok(stored2.length === 1, 'second attempt stored');
  ok(stored2[0].score === want, 'one wrong seed answer yields 93.625 (CSIR negative −0.875) — got ' + stored2[0].score + ' want ' + want);
  ok(stored2[0].correct === 24 && stored2[0].wrong === 1, '24 correct / 1 wrong');
  ok(doc.getElementById('tfRun').querySelectorAll('.tf-rev.bad').length === 1, 'exactly one bad review card');
  ok(doc.getElementById('tfRun').querySelectorAll('.tf-rev-opt.you').length >= 25, 'your pick highlighted (25: 24 corr-you + 1 wrong-you)');
  doc.getElementById('tfRun').querySelector('.tf-end').click();

  console.log('[8] namespace isolation + runtime hygiene');
  const keys = [];
  for (let i = 0; i < w.localStorage.length; i++) keys.push(w.localStorage.key(i));
  ok(keys.every(k => k.indexOf('tf:att:') === 0), 'localStorage holds ONLY tf:att: keys — got: ' + keys.join(','));
  ok(errors.length === 0, 'zero jsdom errors');
  ok(errors.filter(e => /SecurityError|Not implemented/.test(e)).length === 0, 'no DOM security not-implemented noise');

  console.log('\nsmoke28: ' + passed + ' passed, ' + failed + ' failed');
  if (failed) process.exit(1);
  process.exit(0);
});
