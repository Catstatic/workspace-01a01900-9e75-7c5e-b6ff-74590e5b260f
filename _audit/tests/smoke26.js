/* smoke26 (jsdom) — APTIFORGE full-render sweep: the REAL shipped Content Vault
   renders EVERY one of the 24 vault docs (12 physics + 12 🧠 aptitude) with
   real KaTeX auto-render. Per doc we assert: zero .katex-error nodes, zero
   delimiter residue ($$, \(, \[, lone $), headings + outline populated, and
   for aptitude docs: trap blockquotes render and h1 carries the 🧠 badge.
   This is the "what the user's eyes will see" guarantee for every doc. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };
const DOMS = [];

const proj = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const marker = 'CONTENT VAULT — renders LOCAL_CONTENT_DATA';
const vIdx = proj.indexOf(marker);
const vaultSrc = proj.slice(proj.lastIndexOf('<script>', vIdx) + 8, proj.indexOf('</script>', vIdx));
const contentSrc = fs.readFileSync('/home/user/project/content-data.js', 'utf8');
const aptiSrc = fs.readFileSync('/home/user/project/aptitude-content.js', 'utf8');
const katexSrc = fs.readFileSync('/tmp/domt/node_modules/katex/dist/katex.min.js', 'utf8');
const autoSrc = fs.readFileSync('/tmp/domt/node_modules/katex/dist/contrib/auto-render.min.js', 'utf8');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(String(e)));
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="panel-resources"><div class="section-head"></div></div></body></html>', {
  url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc, pretendToBeVisual: true
});
DOMS.push(dom);
const w = dom.window, doc = w.document;
w.eval(contentSrc); w.eval(aptiSrc); w.eval(katexSrc); w.eval(autoSrc); w.eval(vaultSrc);

const select = doc.getElementById('contentSubject');
const reader = () => doc.getElementById('contentReader');
const change = el => el.dispatchEvent(new w.Event('change', { bubbles: true }));
const KEYS = Object.keys(w.LOCAL_CONTENT_DATA);
ok(KEYS.length === 24, '24 docs registered in vault');

/* Post-R29: ALL 24 docs are zero-tolerance — the R29 vault-hardening round
   (inline-math parking + pipe-table renderer + 2 content fixes) retired the
   legacy physics regression snapshot. Table expectations come from source md. */
const expects = {};
KEYS.forEach(k => {
  const lines = String(w.LOCAL_CONTENT_DATA[k]).split('\n');
  let blocks = 0, rows = 0, inT = false, inCode = false;
  lines.forEach(l => {
    if (/^```/.test(l.trim())){ inCode = !inCode; return; }  /* ASCII art inside fences is never a table */
    if (inCode) return;
    const isP = /^\s*\|.*\|\s*$/.test(l);
    if (isP && !inT){ blocks++; inT = true; }
    if (!isP) inT = false;
    if (isP){ const isSep = /^\s*\|[\s|\-:]+\|\s*$/.test(l) && l.includes('-'); if (!isSep) rows++; }
  });
  expects[k] = { blocks, headerPlusBody: rows };
});

let totalKatex = 0, totalErrAll = 0, totalResidueAll = 0;
console.log('  per-doc render sweep (real vault + real KaTeX):');
KEYS.forEach((key, i) => {
  select.value = key; change(select);
  const r = reader();
  const isApt = key.indexOf('🧠') === 0;
  const kErr = r.querySelectorAll('.katex-error').length;
  const kN = r.querySelectorAll('.katex').length;
  const txt = r.textContent;
  const residue = (txt.includes('$$') ? 1 : 0) + (txt.includes('\\(') ? 1 : 0) + (txt.includes('\\[') ? 1 : 0) + (txt.includes('\\]') ? 1 : 0);
  const clone = r.cloneNode(true);
  clone.querySelectorAll('.katex').forEach(n => n.remove());
  clone.querySelectorAll('pre').forEach(n => n.remove()); /* literal $ inside code fences is legal text */
  const loneDollar = /\$/.test(clone.textContent);
  const heads = r.querySelectorAll('h1,h2,h3,h4').length;
  const outlines = doc.querySelectorAll('#contentOutline button').length;
  const status = r.querySelector('.content-vault-status');
  const tag = '#' + (i + 1) + ' ' + (isApt ? '🧠' : '⚛') + ' ' + key.slice(0, 30);

  totalKatex += kN; totalErrAll += kErr; totalResidueAll += residue;
  ok(kErr === 0, tag + ' — zero KaTeX errors (' + kN + ' spans)');
  ok(residue === 0, tag + ' — zero delimiter residue ($$/\\(/\\[)');
  ok(!loneDollar, tag + ' — no lone $ visible');
  ok(heads > 0 && outlines > 0, tag + ' — headings + outline populated (' + heads + ' heads, ' + outlines + ' outline btns)');
  ok(!!status && status.textContent.length > 10, tag + ' — status line populated');

  /* R29 pipe tables: block count, header+body row count, math inside cells */
  const exp = expects[key];
  const tables = r.querySelectorAll('table.content-table');
  const domRows = Array.from(tables).reduce((n, t) =>
    n + t.querySelectorAll('thead tr').length + t.querySelectorAll('tbody tr').length, 0);
  ok(tables.length === exp.blocks, tag + ' — table blocks render: ' + tables.length + '/' + exp.blocks);
  ok(domRows === exp.headerPlusBody, tag + ' — table rows match source: ' + domRows + '/' + exp.headerPlusBody);
  if (exp.blocks > 0){
    const cellMath = r.querySelectorAll('table.content-table td .katex, table.content-table th .katex').length;
    ok(cellMath > 0, tag + ' — math renders INSIDE table cells (' + cellMath + ' spans)');
    ok(!!r.querySelector('table.content-table thead th'), tag + ' — thead headers present');
  }

  if (isApt){
    ok(r.querySelector('h1') && r.querySelector('h1').textContent.indexOf('🧠') === 0, tag + ' — 🧠 badge in h1');
    ok(r.querySelectorAll('blockquote').length >= 4, tag + ' — trap callouts render (' + r.querySelectorAll('blockquote').length + ')');
    ok(r.textContent.indexOf('WHERE STUDENTS BLEED') > -1, tag + ' — trap banner present');
    ok(kN > 0, tag + ' — math lanes rendered');
  }
});

console.log('  sweep totals — KaTeX spans: ' + totalKatex + ' · errors: ' + totalErrAll + ' · residue: ' + totalResidueAll);
ok(totalErrAll === 0, 'SWEEP: 0 KaTeX errors across all 24 docs');
ok(totalResidueAll === 0, 'SWEEP: 0 delimiter residue across all 24 docs');
ok(totalKatex > 4000, 'SWEEP: rendered math volume sane (' + totalKatex + ' spans)');
ok(errors.length === 0, 'zero jsdom runtime errors across the sweep');

/* console-warn silence on the real page (KaTeX strict warnings print to console) */
const warns = [];
const origWarn = w.console.warn;
w.console.warn = (...a) => { warns.push(a.join(' ')); };
select.value = KEYS[12]; change(select);
select.value = KEYS[23]; change(select);
w.console.warn = origWarn;
ok(warns.length === 0, 're-render of aptitude docs prints ZERO console warnings' + (warns.length ? ' :: ' + warns[0].slice(0, 120) : ''));

console.log('\nsmoke26: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
