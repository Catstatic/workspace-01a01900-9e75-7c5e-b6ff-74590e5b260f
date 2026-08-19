/* smoke33 (jsdom) — TOPICFORGE T6: real deliverable shell + real companions
   (map + panel + all nine live lane banks + the T6 drill fleet of roster
   ranks 1-10) + real KaTeX, then FULL headless play-throughs on drills:
   drill-harmonic-oscillator-01 perfect run (98/98), drill-dice-coins-
   probability-01 with one wrong seed (93.625), drill-shelf live upgrade,
   figure rendering, and namespace isolation. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c) { passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const H = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const mapSrc = fs.readFileSync('/home/user/project/topicforge-map.js', 'utf8');
const panelSrc = fs.readFileSync('/home/user/project/topicforge-panel.js', 'utf8');
const banks = ['quantum','classical','mathphys','emtheory','thermo','electronics','atomic','nuclear','solidstate','drills']
  .map(l => fs.readFileSync('/home/user/project/topicforge-bank-' + l + '.js', 'utf8'));
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
banks.forEach(b => w.eval(b));
w.eval(panelSrc);

const ready = new Promise(res => {
  if (w.document.readyState !== 'loading') res();
  else w.document.addEventListener('DOMContentLoaded', res);
});
ready.then(() => {
  const DR = w.TOPICFORGE_BANKS.drills;

  console.log('[0] bank + renderer wiring');
  ok(typeof w.katex.renderToString === 'function', 'katex live on window');
  ok(typeof w.TOPICFORGE_PANEL_RENDER === 'function', 'panel exposes re-render entry');
  ok(DR && DR.mocks.length === 28, '28 drill mocks mounted');
  ok(DR.mocks.every(m => m.problems.length === 25), 'every drill carries 25 problems');
  ok(/AI-GENERATED/.test(DR.meta.label), 'drill bank labelled AI-GENERATED');
  ok(DR.meta.stage === 'T6', 'drill bank stage chip data = T6');
  ok(w.TOPICFORGE_BANKS.nuclear.mocks.length === 5, 'T5 fleets still mounted');

  console.log('[1] the nine lane fleets stay live (regression)');
  ['quantum','classical','mathphys','emtheory','thermo','electronics','atomic','nuclear','solidstate'].forEach(ln => {
    const lane = doc.querySelector('.tf-lane[data-lane="' + ln + '"]');
    ok(lane && !lane.querySelector('.tf-lock'), ln + ' lane card live');
  });

  console.log('[2] drill shelf: the full 28-chip roster is live');
  const chips = doc.querySelectorAll('#tfDrills .tf-chip');
  ok(chips.length === 28, '28 roster chips still rendered');
  const live = Array.from(chips).filter(c => c.classList.contains('tf-chip-live'));
  ok(live.length === 28, 'all 28 chips upgraded to live — got ' + live.length);
  ok(live.every(c => c.querySelector('.tf-chip-play')), 'every live chip carries a RUN button');
  ok(Array.from(chips).every(c => /sessions/.test(c.textContent) && /T6/.test(c.textContent)), 'original chip text (sessions + T6) preserved everywhere');
  ok(chips[0].textContent.indexOf('#1') === 0 && chips[0].classList.contains('tf-chip-live'), '#1 chip (dice, 22 sessions) is live first');
  ok(chips[10].classList.contains('tf-chip-live') && chips[27].classList.contains('tf-chip-live'), 'rank 11 (contour) and rank 28 (entropy) chips are live too');
  ok(chips[27].querySelector('.tf-chip-play') && chips[17].querySelector('.tf-chip-play'), 'tail-end live chips carry RUN buttons');
 
  console.log('[3] cockpit opens on drill-harmonic-oscillator-01');
  doc.querySelector('[data-tf-play="drill-harmonic-oscillator-01"]').click();
  const run = doc.getElementById('tfRun');
  ok(!!run && run.style.display === 'flex', 'overlay opens');
  ok(/drill-harmonic-oscillator-01/.test(run.querySelector('.tf-run-id').textContent), 'cockpit titled with drill id');
  ok(run.querySelector('.tf-timer').textContent === '55:00', 'timer starts at 55:00');
  ok(run.querySelectorAll('.tf-pal button').length === 25, '25 palette buttons');

  console.log('[4] perfect play-through via clicks (harmonic oscillator drill)');
  const mock1 = DR.mocks.find(m => m.id === 'drill-harmonic-oscillator-01');
  let figSeen = 0;
  mock1.problems.forEach((p, i) => {
    run.querySelector('.tf-pal').querySelectorAll('button')[i].click();
    if (p.fig) { const fg = run.querySelector('.tf-fig'); if (fg && fg.querySelector('svg')) figSeen++; }
    run.querySelectorAll('.tf-qopt')[p.a].click();
  });
  const m1Figs = mock1.problems.filter(p => p.fig).length;
  ok(m1Figs >= 2, 'oscillator drill carries >=2 figures — got ' + m1Figs);
  ok(figSeen === m1Figs, 'every drill figure painted in-cockpit (' + figSeen + '/' + m1Figs + ')');
  ok(run.querySelectorAll('.tf-pal button.ans').length === 25, 'all 25 marked answered');

  console.log('[5] submit + review');
  const subm = run.querySelector('.tf-subm');
  subm.click(); subm.click();
  const stored1 = JSON.parse(w.localStorage.getItem('tf:att:drill-harmonic-oscillator-01'));
  ok(stored1.length === 1, 'one attempt persisted under tf:att:drill-harmonic-oscillator-01');
  ok(stored1[0].score === 98 && stored1[0].max === 98, 'perfect drill run scores 98/98 — got ' + stored1[0].score);
  ok(run.querySelectorAll('.tf-rev').length === 25, '25 review cards');
  ok(run.querySelectorAll('.katex').length > 200, 'KaTeX rendered math — spans: ' + run.querySelectorAll('.katex').length);
  ok(doc.querySelectorAll('.katex-error').length === 0, 'ZERO katex-errors in whole document');
  run.querySelector('.tf-end').click();

  console.log('[6] drill chip stats refreshed after attempt');
  const chipOsc = Array.from(doc.querySelectorAll('#tfDrills .tf-chip')).find(c => c.textContent.indexOf('harmonic-oscillator') > -1);
  ok(/attempts: 1/.test(chipOsc.querySelector('.tf-chip-stats').textContent), 'oscillator chip now shows attempts: 1 — got: ' + chipOsc.querySelector('.tf-chip-stats').textContent);

  console.log('[7] negative-marking run (dice probability drill)');
  doc.querySelector('[data-tf-play="drill-dice-coins-probability-01"]').click();
  const mock2 = DR.mocks.find(m => m.id === 'drill-dice-coins-probability-01');
  mock2.problems.forEach((p, i) => {
    doc.getElementById('tfRun').querySelector('.tf-pal').querySelectorAll('button')[i].click();
    const opts = doc.getElementById('tfRun').querySelectorAll('.tf-qopt');
    const pick = (i === 0) ? (p.a + 1) % 4 : p.a;   // exactly one wrong: Q01 (seed)
    opts[pick].click();
  });
  const s2 = doc.querySelector('#tfRun .tf-subm');
  s2.click(); s2.click();
  const stored2 = JSON.parse(w.localStorage.getItem('tf:att:drill-dice-coins-probability-01'));
  const want = Math.round((98 - 3.5 - 0.875) * 1000) / 1000;
  ok(stored2.length === 1, 'dice drill attempt stored');
  ok(stored2[0].score === want, 'one wrong seed answer yields 93.625 — got ' + stored2[0].score + ' want ' + want);
  ok(doc.getElementById('tfRun').querySelectorAll('.tf-rev.bad').length === 1, 'exactly one bad review card');
  doc.getElementById('tfRun').querySelector('.tf-end').click();

  console.log('[8] namespace isolation + runtime hygiene');
  const keys = [];
  for (let i = 0; i < w.localStorage.length; i++) keys.push(w.localStorage.key(i));
  ok(keys.every(k => k.indexOf('tf:att:') === 0), 'localStorage holds ONLY tf:att: keys — got: ' + keys.join(','));
  ok(keys.indexOf('tf:att:drill-harmonic-oscillator-01') > -1 && keys.indexOf('tf:att:drill-dice-coins-probability-01') > -1, 'both drill attempt keys present');
  ok(errors.length === 0, 'zero jsdom errors');

  console.log('\nsmoke33: ' + passed + ' passed, ' + failed + ' failed');
  if (failed) process.exit(1);
  process.exit(0);
});
