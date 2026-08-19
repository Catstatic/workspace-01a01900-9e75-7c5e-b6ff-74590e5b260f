/* UNIT26 — PHYSICS VAULT FORENSICS (pure, no DOM): the 12 physics docs of
   content-data.js, same triple-depth standard as unit25 (APTIFORGE). Hard gates:
   every math segment must parse under KaTeX strict:'error' in BOTH modes with
   ZERO strict:'warn' output; backslash runs must be legal LaTeX (len 1, or the
   legit matrix row-break class: len 2 followed by space/newline/digit); the two
   R29 content fixes present (d\bar{d}, \omega_{0j}…); content preservation
   (per-doc pipe-row counts, segment census). Runs AFTER the R29 repair round
   flipped these docs from regression-gated to zero-tolerance. */
'use strict';
const fs = require('fs'), vm = require('vm');
const katex = require('/tmp/domt/node_modules/katex');

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.log('  FAIL:', msg); } };

const SRC = fs.readFileSync('/home/user/project/content-data.js', 'utf8');
const s = { window: {}, console };
vm.createContext(s); vm.runInContext(SRC, s);
const DATA = s.window.LOCAL_CONTENT_DATA;
const KEYS = Object.keys(DATA);
const BS = 92;

/* content-preservation snapshot (345 pipe rows total, measured pre-R29) */
const PIPE_ROWS = { 'nuclear and particle physics.md': 56, 'condensed matter.md': 36,
  'atomic and molecular physics.md': 26, 'thermo+ electronics+ experimental methods.md': 42,
  'CM+ EMT+ QM adv.md': 9, 'CSIR_NET_Electronics_Notes.md': 57, 'math methods advanced.md': 5,
  'thermodynamics.md': 27, 'Quantum Mechanics.md': 24, 'Electromagnetic theory .md': 23,
  'classical mechanics.md': 32, 'MATHEMATICAL METHODS IN PHYSICS .md': 28 };
const EXPECT_SEGS = 8052;

ok(KEYS.length === 12, '12 physics docs');
ok(JSON.stringify(Object.keys(PIPE_ROWS).sort()) === JSON.stringify([...KEYS].sort()), 'doc set matches snapshot');

function extract(md){
  const segs = [];
  let rest = String(md);
  rest = rest.replace(/\$\$([\s\S]*?)\$\$/g, (m, x) => { segs.push({ expr: x, display: true }); return ''; });
  rest = rest.replace(/\\\[([\s\S]*?)\\\]/g, (m, x) => { segs.push({ expr: x, display: true }); return ''; });
  rest = rest.replace(/\\\(([\s\S]*?)\\\)/g, (m, x) => { segs.push({ expr: x, display: false }); return ''; });
  rest = rest.replace(/\$(?!\s)([^\n$]*?)(?<!\s)\$(?!\d)/g, (m, x) => { segs.push({ expr: x, display: false }); return ''; });
  return { segs, rest };
}
function warnCount(expr, display){
  let n = 0; const orig = console.warn; console.warn = () => { n++; };
  try { katex.renderToString(expr, { displayMode: display, throwOnError: false, strict: 'warn' }); } catch (e) {}
  console.warn = orig; return n;
}

let segs = 0, strictErr = 0, warns = 0, rowBreakOK = 0;
KEYS.forEach(key => {
  const { segs: ss, rest } = extract(DATA[key]);
  segs += ss.length;
  ok(DATA[key].split('\n').filter(l => /^\s*\|.*\|\s*$/.test(l)).length === PIPE_ROWS[key],
     key.slice(0, 26) + ' — pipe-row census preserved (' + PIPE_ROWS[key] + ')');
  ok(rest.indexOf('$') === -1, key.slice(0, 26) + ' — no orphan $ after extraction');
  ss.forEach((sg, i) => {
    const e = sg.expr;
    /* backslash legality: len-1 runs are macros; len-2 runs legit ONLY as row breaks */
    for (let p = 0; p < e.length; p++){
      if (e.charCodeAt(p) !== BS) continue;
      let q = p; while (q < e.length && e.charCodeAt(q) === BS) q++;
      const len = q - p, next = q < e.length ? e[q] : '';
      const legit = len === 1 || (len === 2 && (next === ' ' || next === '\n' || /[0-9]/.test(next)));
      if (legit && len === 2) rowBreakOK++;
      ok(legit, key.slice(0, 24) + ' seg#' + i + ' — legal backslash run (len=' + len + ' next=' + JSON.stringify(next) + ') ctx=' + JSON.stringify(e.slice(Math.max(0, p - 15), q + 12)));
      p = q - 1;
    }
    try { katex.renderToString(e, { displayMode: sg.display, throwOnError: true, strict: 'error' }); }
    catch (err) { strictErr++; console.log('  strict error [' + key.slice(0, 22) + '#' + i + ']:', String(err.message).slice(0, 100)); }
    try { katex.renderToString(e, { displayMode: !sg.display, throwOnError: true, strict: 'error' }); }
    catch (err) { strictErr++; console.log('  cross-mode error [' + key.slice(0, 22) + '#' + i + ']:', String(err.message).slice(0, 100)); }
    warns += warnCount(e, sg.display);
  });
});

ok(segs === EXPECT_SEGS, 'segment census preserved: ' + segs + ' (expected ' + EXPECT_SEGS + ')');
ok(strictErr === 0, 'ZERO KaTeX strict errors across all physics math (both modes)');
ok(warns === 0, 'ZERO KaTeX strict warnings across all physics math');
ok(rowBreakOK > 100, 'legit matrix row-break runs still intact (' + rowBreakOK + ')');

/* ---- the two R29 content fixes ---- */
ok(DATA['nuclear and particle physics.md'].indexOf('(u\\bar{u} - d\\bar{d})') > -1, 'R29: pi0 wavefunction fixed (d\\bar{d})');
ok(DATA['nuclear and particle physics.md'].indexOf('(u\\bar{u} - d\\d)') === -1, 'R29: old broken \\d gone');
ok(DATA['Electromagnetic theory .md'].indexOf('\\frac{f_j}{\\omega_{0j}^2 - \\omega^2 - i \\gamma_j \\omega}') > -1, 'R29: Drude-Lorentz denominator fixed');
ok(DATA['Electromagnetic theory .md'].indexOf('\\omega_0j}^2') === -1, 'R29: old brace slip gone');

console.log('\n  physics census — segments: ' + segs + ' · strict errors: ' + strictErr + ' · warnings: ' + warns + ' · legit row-breaks: ' + rowBreakOK);
console.log('unit26: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
