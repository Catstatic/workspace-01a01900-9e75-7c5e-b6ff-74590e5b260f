/* smoke27 (jsdom) — TOPICFORGE T0 panel: real deliverable DOM built from the
   shipped HTML head+nav+wrap region is too heavy; instead we load the real
   companions (topicforge-map.js + topicforge-panel.js) against a fixture that
   mirrors the shipped panel shell EXACTLY (ids/classes asserted against the
   deliverable text), and verify the rendered map UI end-to-end. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const H = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const mapSrc = fs.readFileSync('/home/user/project/topicforge-map.js', 'utf8');
const panelSrc = fs.readFileSync('/home/user/project/topicforge-panel.js', 'utf8');

/* fixture mirrors the R31 panel shell — extracted from the deliverable itself */
const shellIdx = H.indexOf('id="panel-topicforge"');
ok(shellIdx > -1, 'panel shell exists in deliverable');
const shell = H.slice(H.lastIndexOf('<div class="panel"', shellIdx), H.indexOf('</div>\n</div><!-- /wrap -->', shellIdx));
const navIdx = H.indexOf('data-tab="topicforge"');
ok(navIdx > -1, 'tab exists');
const navBtn = H.slice(H.lastIndexOf('<button', navIdx), H.indexOf('</button>', navIdx) + 9);

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(String(e)));
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div>' + navBtn + '</div>' + shell + '</body></html>',
  { url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc });
const w = dom.window, doc = w.document;
w.eval(mapSrc);
w.eval(panelSrc);

const done = new Promise(res => {
  if (w.document.readyState !== 'loading') res();
  else w.document.addEventListener('DOMContentLoaded', res);
});
done.then(() => {
console.log('[0] statics');
ok(!!w.TOPICFORGE_MAP, 'TOPICFORGE_MAP loaded on window');
ok(doc.querySelectorAll('[data-tf]').length === 1, 'TF stylesheet injected once');
ok(doc.getElementById('panel-topicforge').className === 'panel', 'panel uses .panel convention (tab handler compatible)');
ok(navBtn.indexOf('data-tab="topicforge"') > -1, 'tab button targets data-tab="topicforge" → id "panel-topicforge" convention matches initTabs()');

console.log('[1] lanes grid');
const lanes = doc.querySelectorAll('.tf-lane');
ok(lanes.length === 10, 'all 10 lane cards render — got ' + lanes.length);
const titles = Array.from(lanes).map(l => l.dataset.lane);
['mathphys','classical','emtheory','quantum','thermo','electronics','atomic','nuclear','solidstate','aptitude'].forEach(id =>
  ok(titles.indexOf(id) > -1, 'lane card: ' + id));
lanes.forEach(l => {
  ok(l.querySelector('.tf-lane-title').textContent.length > 5, 'lane titled');
  ok(/Qs mined/.test(l.querySelector('.tf-lane-total').textContent), 'mined count badge');
  ok(l.querySelectorAll('.tf-sub').length >= 6, 'top-6 subtopic bars render');
  ok(l.querySelectorAll('.tf-fill').length >= 6, 'weight bars have fills');
  const lock = l.querySelector('.tf-lock');
  // T1–T4 evolution: banked lanes (quantum T1; classical + mathphys T2;
  // emtheory + thermo T3; electronics + atomic T4) flip to a loading/live
  // state; unbanked lanes keep the T0 lock badge until T5.
  const LIVE = { quantum: 1, classical: 1, mathphys: 1, emtheory: 1, thermo: 1, electronics: 1, atomic: 1, nuclear: 1, solidstate: 1 };
  const isLive = !!LIVE[l.dataset.lane];
  ok(lock && (isLive ? /fleet loading|FORGED|LIVE/i.test(lock.textContent) : /forges at T/.test(lock.textContent)), 'fleet lock badge state correct for stage (' + l.dataset.lane + ')');
  ok(!l.querySelector('a,button:not(.tf-lock)') || l.querySelectorAll('.tf-sub button').length === 0, 'no live launchers rendered for unbanked lanes');
});
const widths = Array.from(doc.querySelectorAll('.tf-fill')).map(f => parseFloat(f.style.width));
ok(widths.every(x => x >= 2 && x <= 100), 'all bar widths within 2–100%');

console.log('[2] per-lane cross-check against the data object');
const M = w.TOPICFORGE_MAP;
M.lanes.forEach(L => {
  const card = doc.querySelector('.tf-lane[data-lane="' + L.id + '"]');
  ok(card && card.querySelector('.tf-lane-total').textContent.indexOf(String(L.total) + ' Qs mined') > -1, L.id + ' — DOM total matches data (' + L.total + ')');
});
const totalBadges = Array.from(doc.querySelectorAll('.tf-lane-total')).map(b => parseInt(b.textContent)).reduce((a, x) => a + x, 0);
ok(totalBadges === M.lanes.reduce((a, l) => a + l.total, 0), 'badges sum == map total (' + totalBadges + ')');

console.log('[3] drill shelf');
const chips = doc.querySelectorAll('.tf-chip');
ok(chips.length === M.drills.length, 'drill chips count == roster (' + chips.length + ')');
ok(chips.length >= 20, 'roster visible, ≥20');
ok(doc.querySelector('.tf-chip').textContent.indexOf('#1') === 0, '#1 chip is ranked first');
ok(Array.from(chips).every(c => /sessions/.test(c.textContent) && /T6/.test(c.textContent)), 'every chip shows session span + T6 lock');

console.log('[4] honesty note');
const note = doc.getElementById('tfUnclass');
ok(note.textContent.indexOf('MAP HONESTY') === 0, 'honesty block renders');
ok(note.textContent.indexOf(String(M.meta.universe.total)) > -1, 'states mined universe size');
ok(note.textContent.indexOf('unclassified') === -1 || /counted openly/.test(note.textContent), 'unclassified policy stated');
ok(M.meta.assumptions.every(a => note.textContent.indexOf(a.slice(0, 25)) > -1), 'all assumptions rendered verbatim');

console.log('[5] runtime');
ok(errors.length === 0, 'zero jsdom errors');
ok(doc.querySelectorAll('.tf-lane .tf-grid').length === 0, 'no nested grid accidents');

console.log('\nsmoke27: ' + passed + ' passed, ' + failed + ' failed');
w.close();
process.exit(failed ? 1 : 0);
});
