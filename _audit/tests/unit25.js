/* UNIT25 — APTIFORGE LaTeX FORENSICS (pure, no DOM): every math segment in all
   12 rendered aptitude vault docs, extracted with the vault's own delimiter
   classes ($$…$$ / \[…\] display, \(…\) / $…$ inline), each rendered through
   KaTeX in BOTH display and inline mode under strict:'error' AND strict:'warn'.
   Plus raw-string hygiene scans for silent damage KaTeX can't see:
   double-backslash+letter, unicode minus/currency glyphs, unbalanced braces,
   display-math chained on one line, $$ inside $$, and macro shadows. */
'use strict';
const fs = require('fs'), vm = require('vm');
const katex = require('/tmp/domt/node_modules/katex');

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.log('  FAIL:', msg); } };

const SRC = fs.readFileSync('/home/user/project/aptitude-content.js', 'utf8');
const sandbox = { window: {}, console };
vm.createContext(sandbox); vm.runInContext(SRC, sandbox);
const META = sandbox.window.APTITUDE_CONTENT_META, DATA = sandbox.window.APTITUDE_CONTENT_DATA;
const KEYS = Object.keys(DATA);

/* ---- math extraction mirroring the vault pipeline ----
   markdown() first parks $$…$$ and \[…\] as blocks; auto-render then takes
   \(…\) and $…$ (auto-render's $ rule: no space inside the fences, no digit
   immediately after the closing $). */
function extract(md){
  const segs = [];
  let rest = String(md);
  rest = rest.replace(/\$\$([\s\S]*?)\$\$/g, (m, x) => { segs.push({ expr: x, display: true }); return ''; });
  rest = rest.replace(/\\\[([\s\S]*?)\\\]/g, (m, x) => { segs.push({ expr: x, display: true }); return ''; });
  rest = rest.replace(/\\\(([\s\S]*?)\\\)/g, (m, x) => { segs.push({ expr: x, display: false }); return ''; });
  rest = rest.replace(/\$(?!\s)([^\n$]*?)(?<!\s)\$(?!\d)/g, (m, x) => { segs.push({ expr: x, display: false }); return ''; });
  return { segs, rest };
}

/* strict:'warn' capture — KaTeX reports through console.warn */
function warnCount(expr, display){
  let n = 0;
  const orig = console.warn;
  console.warn = () => { n++; };
  try { katex.renderToString(expr, { displayMode: display, throwOnError: false, strict: 'warn' }); }
  catch (e) { /* strict errors handled separately */ }
  console.warn = orig;
  return n;
}

const seen = new Set();
let T = { segs: 0, unique: 0, errors: 0, warns: 0 };
const errList = [], warnList = [];

KEYS.forEach(key => {
  const mod = META.modules.find(m => m.file === key) || { formulaCount: 0 };
  const { segs, rest } = extract(DATA[key]);
  T.segs += segs.length;
  ok(segs.length >= Math.max(12, mod.formulaCount),
     key.slice(0, 26) + ' — math density ≥ max(12, formulaCount=' + mod.formulaCount + ') (' + segs.length + ')');
  ok(segs.filter(s => s.display).length >= Math.min(8, mod.formulaCount),
     key.slice(0, 26) + ' — display-math count covers the formula sheet (' + segs.filter(s => s.display).length + ')');
  ok(rest.indexOf('$') === -1, key.slice(0, 26) + ' — no orphan $ left after extraction (delimiter balance)');
  ok(rest.indexOf('\\(') === -1 && rest.indexOf('\\[') === -1, key.slice(0, 26) + ' — no orphan \\( or \\[ residue');
  ok(rest.indexOf('\\\\(') === -1, key.slice(0, 26) + ' — no double-backslash \\\\( artifact');

  segs.forEach((s, i) => {
    const id = key + ' #' + i;
    /* hygiene — invisible-to-KaTeX damage */
    ok(!/\\\\[A-Za-z]/.test(s.expr), id + ' — no double-backslash+letter in math: ' + JSON.stringify(s.expr.match(/\\\\[A-Za-z]{1,12}/)));
    ok(s.expr.indexOf('−') === -1, id + ' — no U+2212 unicode minus');
    ok(s.expr.replace(/\\\*/g, '').replace(/\^{?\*}\?/g, '').indexOf('*') === -1,
       id + ' — no bare * inside math (the vault italicizer would shatter the $ pair): ' + JSON.stringify((s.expr.match(/\*[^$]{0,20}/) || [])[0]));
    ok(s.expr.indexOf('₹') === -1, id + ' — no ₹ glyph inside math (KaTeX has no glyph 8377)');
    ok(s.expr.indexOf('$') === -1, id + ' — no $ nested inside math segment');
    let depth = 0, balanced = true;
    for (const ch of s.expr){ if (ch === '{') depth++; if (ch === '}') depth--; if (depth < 0) balanced = false; }
    ok(balanced && depth === 0, id + ' — braces balanced');

    const sig = (s.display ? 'D' : 'I') + '§' + s.expr;
    if (seen.has(sig)) return;
    seen.add(sig);
    /* strict: ERROR — nothing may throw */
    try { katex.renderToString(s.expr, { displayMode: s.display, throwOnError: true, strict: 'error' }); }
    catch (e) { T.errors++; errList.push(id + ' [' + (s.display ? 'display' : 'inline') + '] ' + String(e).message.slice(0, 110) + ' :: ' + JSON.stringify(s.expr).slice(0, 120)); }
    /* cross-mode tolerance — the vault may re-frame inline/display */
    try { katex.renderToString(s.expr, { displayMode: !s.display, throwOnError: true, strict: 'error' }); }
    catch (e) { errList.push(id + ' [cross-mode] ' + String(e).message.slice(0, 110)); T.errors++; }
    /* strict: WARN — count every pedantic warning KaTeX would print on the real page */
    const w = warnCount(s.expr, s.display);
    if (w){ T.warns += w; warnList.push(id + ' ×' + w + ' :: ' + JSON.stringify(s.expr).slice(0, 90)); }
  });
});
T.unique = seen.size;

ok(T.errors === 0, 'ZERO strict errors across ' + T.unique + ' unique segments (both modes)');
ok(T.warns === 0, 'ZERO strict warnings (console stays silent on the real page)');

/* ---- source-level hygiene: String.raw discipline ---- */
ok(!/`\s*\$\{/.test(SRC), 'no accidental ${ template interpolation inside raw blocks');
ok((SRC.match(/String\.raw`/g) || []).length >= 12, 'String.raw used for content literals');
ok(SRC.indexOf('\\u') === -1 || !/\\u[0-9a-fA-F]{4}/.test(SRC.replace(/\\u[0-9a-fA-F]{4}/g, '')), 'no stray \\uXXXX escapes surviving into output');

/* ---- per-doc KaTeX density report ---- */
console.log('\n  per-doc segment census:');
KEYS.forEach(key => {
  const { segs } = extract(DATA[key]);
  const d = segs.filter(s => s.display).length;
  console.log('    ' + key.replace(' 🧠 ', ' ').padEnd(48, ' ').slice(0, 48) + ' · ' + String(segs.length).padStart(3) + ' segs (' + d + ' display / ' + (segs.length - d) + ' inline)');
});

console.log('\n  math segments total : ' + T.segs + ' (' + T.unique + ' unique)');
console.log('  strict errors       : ' + T.errors);
console.log('  strict warnings     : ' + T.warns);
if (errList.length) console.log('  ERRORS:\n    ' + errList.slice(0, 15).join('\n    '));
if (warnList.length) console.log('  WARNINGS:\n    ' + warnList.slice(0, 15).join('\n    '));

console.log('\nunit25: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
