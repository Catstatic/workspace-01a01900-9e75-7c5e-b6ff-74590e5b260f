/* hygiene: full-fleet stem/id uniqueness + field sanity across ALL banks */
const fs = require('fs');
const DIR = '/home/user/project/';
const FILES = ['quantum','classical','mathphys','emtheory','thermo','electronics','atomic','nuclear','solidstate','drills']
  .map(l => 'topicforge-bank-' + l + '.js');
global.window = {};
FILES.forEach(f => eval(fs.readFileSync(DIR + f, 'utf8')));
const banks = window.TOPICFORGE_BANKS;
let n = 0, viol = 0, figs = 0;
const ids = new Set(), stems = new Set(), prefixes = {};
function norm(q){ return q.toLowerCase().replace(/[^a-z0-9\\{}^_+\-=]/g, ''); }
Object.keys(banks).forEach(ln => banks[ln].mocks.forEach(m => m.problems.forEach(p => {
  n++;
  if (ids.has(p.id)) { viol++; console.log('DUP ID', p.id); }
  ids.add(p.id);
  const ns = norm(p.q);
  if (stems.has(ns)) { viol++; console.log('DUP STEM', p.id); }
  stems.add(ns);
  if (p.fig) figs++;
  ['q','sol','vfy'].forEach(f => {
    const d = (String(p[f]).match(/\$/g) || []).length;
    if (d % 2) { viol++; console.log('ODD $', p.id + '.' + f); }
  });
  const pre = ns.slice(0, 86);
  if (pre.length >= 60) { prefixes[pre] = (prefixes[pre] || 0) + 1; }
})));
const dupPrefixes = Object.keys(prefixes).filter(k => prefixes[k] > 1);
dupPrefixes.forEach(k => { viol++; console.log('PREFIX COLLISION x' + prefixes[k], k.slice(0, 60)); });
console.log('HYGIENE: ' + n + ' problems scanned, ' + ids.size + ' ids, ' + stems.size + ' stems, ' + figs + ' figs, ' + viol + ' violations');
process.exit(viol ? 1 : 0);
