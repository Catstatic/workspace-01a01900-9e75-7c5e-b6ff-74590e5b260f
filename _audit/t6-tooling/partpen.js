/* penance for a single part file: parse + hygiene checks against T6 gremlin classes */
const fs = require('fs');
const f = process.argv[2];
const raw = fs.readFileSync(f, 'utf8');
let issues = 0;
const err = m => { console.log('  X ' + m); issues++; };
[/\bwait\b/i, /\bhmm\b/i, /\bactually\b/i, /\boops\b/i, /\blet me\b/i].forEach(r => { if (r.test(raw)) err('self-talk ' + r); });
if (/'\s*\+\s*'/.test(raw)) err("string concat '+");
if (/(?<!\\)\\{3}(?!\\)/.test(raw)) err('illegal 3/5+ backslash run in raw source');
if (/[一-鿿぀-ヿ가-힯]/.test(raw)) err('CJK gremlin char in raw source');
let arr = null;
try { arr = eval('[' + raw.replace(/,\s*$/, '') + ']'); } catch (e) { err('EVAL FAIL ' + e.message); }
if (!arr) { console.log('PENANCE FAIL (parse)'); process.exit(1); }
if (arr.length !== 25) err('count ' + arr.length);
const ids = new Set();
arr.forEach((p, i) => {
  const want = '-Q' + String(i + 1).padStart(2, '0');
  if (!p.id.endsWith(want)) err(p.id + ' order mismatch, want ' + want);
  if (ids.has(p.id)) err('dup id ' + p.id);
  ids.add(p.id);
  if (!/^drill-[a-z0-9-]+-Q\d\d$/.test(p.id)) err('bad id shape ' + p.id);
  if (!/^[a-z0-9-]+$/.test(p.sub)) err(p.id + ' sub shape');
  if (!/^[a-z0-9-]+$/.test(p.concept)) err(p.id + ' concept shape ' + p.concept);
  if (!['seed', 'standard', 'apex'].includes(p.diff)) err(p.id + ' diff ' + p.diff);
  ['q', 'sol', 'vfy'].forEach(k => {
    const t = p[k];
    if ((t.match(/\$/g) || []).length % 2) err(p.id + '.' + k + ' odd $');
    if (/[<>\t−₹]/.test(t)) err(p.id + '.' + k + ' banned char');
    if (t.endsWith('\\')) err(p.id + '.' + k + ' ends with backslash');
  });
  if (!Array.isArray(p.o) || p.o.length !== 4) err(p.id + ' options != 4');
  else p.o.forEach((oi, j) => {
    if ((oi.match(/\$/g) || []).length % 2) err(p.id + '.o' + j + ' odd $');
    if (/[<>\t−₹]/.test(oi)) err(p.id + '.o' + j + ' banned char');
    if (oi.endsWith('\\')) err(p.id + '.o' + j + ' ends with backslash');
  });
  if (p.q.length < 30) err(p.id + ' q short ' + p.q.length);
  if (p.sol.length < 80) err(p.id + ' sol short ' + p.sol.length);
  if (p.vfy.length < 30) err(p.id + ' vfy short ' + p.vfy.length);
  if (typeof p.a !== 'number' || p.a < 0 || p.a > 3) err(p.id + ' a range');
  if (p.fig) {
    if (/<script|<image|<use|href|url\(|http(?!:\/\/www\.w3\.org\/2000\/svg)/.test(p.fig)) err(p.id + ' fig banned token');
    if (/[\t−₹]/.test(p.fig)) err(p.id + ' fig banned char');
    if (p.fig.indexOf("'") !== -1) err(p.id + ' fig apostrophe');
    const cols = ['#405060', '#6ea8fe', '#d9a441', '#e5534b', '#9db2c8', '#6b7c8f', '#2ea043', '#7ee787', '#0b0e13'];
    if (cols.filter(c => p.fig.includes(c)).length < 2) err(p.id + ' fig <2 palette');
    (p.fig.match(/#[0-9a-fA-F]{6}/g) || []).forEach(c => { if (!cols.includes(c.toLowerCase())) err(p.id + ' fig off-palette ' + c); });
  }
});
console.log((issues ? 'PENANCE FAIL ' : 'PENANCE PASS ') + issues + ' issues, ' + arr.length + ' problems');
process.exit(issues ? 1 : 0);
