#!/usr/bin/env node
/* KaTeX-strict check: every $...$ segment in every stem/opt/sol of a forge bank.
   Usage: node kcheck_pf.js [bankFile] [bankKey]  (defaults: Legion I) */
'use strict';
const katex = require('/tmp/domt/node_modules/katex');
const file = process.argv[2] || '/home/user/project/paperforge-bank-legion1.js';
const key  = process.argv[3] || 'pf-legion-1';
global.window = {};
require(file);
const B = window.FORGE_BANKS[key];
if (!B) { console.error('bank not found: ' + key + ' in ' + file); process.exit(1); }
let segs = 0, fails = [];
function scan(id, field, s) {
  if (s == null) return;
  const str = String(s);
  const re = /\$([^$]+)\$/g;
  let m;
  while ((m = re.exec(str))) {
    segs++;
    try { katex.renderToString(m[1], { strict: true, throwOnError: true, displayMode: false }); }
    catch (e) { fails.push(id + '·' + field + ': ' + m[1].slice(0, 60) + ' → ' + e.message.slice(0, 80)); }
  }
  // lone-$ residue check (unbalanced delimiters)
  const leftover = str.replace(/\$[^$]+\$/g, '');
  if (leftover.includes('$')) fails.push(id + '·' + field + ': lone $ residue');
}
B.questions.forEach(q => {
  scan(q.id, 'stem', q.stem);
  (q.opts || []).forEach((o, i) => scan(q.id, 'opt' + i, o));
  scan(q.id, 'sol', q.sol);
});
console.log('KaTeX-strict segments checked:', segs);
if (fails.length) { console.error('FAILURES (' + fails.length + '):'); fails.forEach(f => console.error(' ✗', f)); process.exit(1); }
console.log('✔ KCHECK PASSED');
