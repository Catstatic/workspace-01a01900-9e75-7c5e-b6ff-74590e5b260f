#!/usr/bin/env node
/* SMOKE 41 — FIGFORGE ROUND 32: content-vault inline figures end-to-end.
   jsdom boots the real tracker (pruned for RAM), the companion is injected
   by hand (jsdom fetches no external srcs). Drives the REAL vault select to
   swap docs, asserts anchor-matched injection, ASCII-art concealment, FIG
   numbering, palette lock, idempotence, and zero interference with KaTeX
   and the official note text. Zero tolerance.
   WAVE-AGNOSTIC: every count is computed from W.CONTENT_FIGS.docs and
   cross-checked against cf_manifest.json — waves never break this smoke. */
'use strict';
const fs = require('fs');
const { execSync } = require('child_process');
const { JSDOM, VirtualConsole } = require('/tmp/domt/node_modules/jsdom');
console.log(execSync('node /home/user/_audit/paperforge/prune_for_smoke.js').toString().trim());
let H = fs.readFileSync('/tmp/tracker_pruned.html', 'utf8');
/* jsdom fetches no external srcs: inline the content companions exactly as a
   real browser would load them (both are '</' + 'script'-free — verified). */
for (const src of ['./content-data.js', './aptitude-content.js']) {
  const tag = '<script src="' + src + '"></' + 'script>';
  const body = fs.readFileSync('/home/user/project/' + src.slice(2), 'utf8');
  if (H.indexOf(tag) < 0) throw new Error('companion seam missing: ' + src);
  /* function replacement: '$$' in theory text must NOT collapse to '$' */
  H = H.replace(tag, () => '<script>\n' + body + '\n</' + 'script>');
}

let pass = 0, fail = 0; const errs = [];
function T(name, cond) { if (cond) pass++; else { fail++; errs.push(name); } }

const vc = new VirtualConsole();
const jsdomErrors = [];
vc.on('jsdomError', e => {
  const m = String((e && e.message) || e);
  if (/Not implemented|Could not parse CSS|canvas/i.test(m)) return;
  jsdomErrors.push(m);
});
vc.on('error', m => jsdomErrors.push(String(m)));

const dom = new JSDOM(H, {
  url: 'https://pf.local/', runScripts: 'dangerously', pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
    window.scrollTo = function () {};
    window.HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };
    window.HTMLMediaElement.prototype.load = function () {};
  }
});
const W = dom.window;
const D = W.document;

const PALETTE = ['#405060', '#6ea8fe', '#d9a441', '#e5534b', '#9db2c8', '#6b7c8f', '#2ea043', '#7ee787', '#0b0e13'];

function switchDoc(key) {
  const sel = D.getElementById('contentSubject');
  sel.value = key;
  sel.dispatchEvent(new W.Event('change', { bubbles: true }));
}

setTimeout(bootTests, 1400);

function bootTests() {
  try {
    /* A. vault + engine presence */
    T('content vault reader mounted', !!D.getElementById('contentReader'));
    T('FFORGE engine exported', typeof W.FFORGE === 'object' && typeof W.FFORGE.inject === 'function');
    T('ROUND32 styles embedded', Array.from(D.querySelectorAll('style')).some(s => s.textContent.indexOf('.ff-fig') >= 0));

    /* B. companion arrives (hand-injected, like jsdom pattern) — engine must pick it up */
    W.eval(fs.readFileSync('/home/user/project/content-figs.js', 'utf8'));
    T('CONTENT_FIGS live', !!(W.CONTENT_FIGS && W.CONTENT_FIGS.docs));
    const MAN = JSON.parse(fs.readFileSync('/home/user/_audit/figforge/cf_manifest.json', 'utf8'));
    const totalDefs = Object.values(W.CONTENT_FIGS.docs).reduce((a, b) => a + b.length, 0);
    T('figure defs == manifest total (' + MAN.total + ')', totalDefs === MAN.total);
    const manDocs = new Set(MAN.figures.map(f => f.doc));
    T('docs covered == manifest (' + manDocs.size + ')', Object.keys(W.CONTENT_FIGS.docs).length === manDocs.size);
    /* per-doc expectations, computed from the shipped defs */
    W.__EXP = {};
    for (const kv of Object.entries(W.CONTENT_FIGS.docs)) {
      W.__EXP[kv[0]] = { figs: kv[1].length, hides: kv[1].filter(d => d.hide).length };
    }

    /* C. nuclear doc: figures + ASCII art concealed */
    switchDoc('nuclear and particle physics.md');
    setTimeout(nuclearTests, 220);
  } catch (e) {
    fail++; errs.push('boot exception: ' + (e && e.stack || e));
    summary();
  }
}

function nuclearTests() {
  try {
    const rd = D.getElementById('contentReader');
    const NE = W.__EXP['nuclear and particle physics.md'];
    const figs = rd.querySelectorAll('.ff-fig');
    T('nuclear: ' + NE.figs + ' figures injected', figs.length === NE.figs);
    const hidden = rd.querySelectorAll('pre[data-ff-hidden]');
    T('nuclear: ' + NE.hides + ' ASCII sketches concealed', hidden.length === NE.hides);
    const gamowPre = Array.from(hidden).find(p => p.textContent.indexOf('Coulomb Barrier') >= 0);
    T('nuclear: Gamow ASCII concealed by id', !!(gamowPre && gamowPre.getAttribute('data-ff-hidden') === 'ff-nuc-gamow'));
    const seqWant = Array.from({ length: NE.figs }, (_, i) => 'FIG ' + (i + 1)).join('|');
    T('nuclear: FIG numbers sequential (1..' + NE.figs + ')', Array.from(figs).map(f => f.querySelector('.ff-num').textContent).join('|') === seqWant);
    T('nuclear: AI-GENERATED tag on every figure', Array.from(figs).every(f => f.textContent.indexOf('AI-GENERATED') >= 0));
    /* placement: figure sits immediately before the concealed pre (where the ASCII used to be) */
    T('nuclear: figure lands where ASCII was', Array.from(figs).every(f => {
      const n = f.nextElementSibling;
      return n && n.tagName === 'PRE' && n.getAttribute('data-ff-hidden');
    }));
    /* anchor order: FIG of B/A curve appears after its anchor heading */
    const hs = rd.querySelectorAll('h1,h2,h3,h4');
    let baHead = null;
    hs.forEach(h => { if (!baHead && h.textContent.toLowerCase().indexOf('binding energy per nucleon') >= 0) baHead = h; });
    const baFig = rd.querySelector('[data-ff="ff-nuc-ba-curve"]');
    T('nuclear: B/A figure after its anchor heading', !!baHead && !!(baHead.compareDocumentPosition(baFig) & W.Node.DOCUMENT_POSITION_FOLLOWING));
    /* palette lock inside injected svgs */
    const colors = new Set();
    figs.forEach(f => (f.innerHTML.match(/#[0-9a-f]{6}/gi) || []).forEach(c => colors.add(c.toLowerCase())));
    const breach = Array.from(colors).filter(c => PALETTE.indexOf(c) < 0);
    T('nuclear: palette-locked svgs (' + colors.size + ' colors)', breach.length === 0 && colors.size > 3);
    /* KaTeX (CDN) does not load in the sandbox; assert math blocks intact instead.
       (Build gate guarantees no '$' inside any figure svg, so the renderer can
       never mistake figure text for math in a real browser.) */
    const mathBefore = Array.from(rd.querySelectorAll('.content-math-block')).map(d => d.textContent);
    T('nuclear: math blocks present', mathBefore.length > 30);
    W.FFORGE.inject();
    const mathAfter = Array.from(rd.querySelectorAll('.content-math-block')).map(d => d.textContent);
    T('nuclear: math blocks byte-intact through injection', JSON.stringify(mathBefore) === JSON.stringify(mathAfter));

    /* D. idempotence: re-render same doc (search input) + manual inject */
    const search = D.getElementById('contentSearch');
    search.value = 'woods';
    search.dispatchEvent(new W.Event('input', { bubbles: true }));
    setTimeout(idemA, 220);
  } catch (e) {
    fail++; errs.push('nuclear exception: ' + (e && e.stack || e));
    idemA();
  }
}

function idemA() {
  try {
    const rd = D.getElementById('contentReader');
    const NE = W.__EXP['nuclear and particle physics.md'];
    T('nuclear: figures re-injected after re-render', rd.querySelectorAll('.ff-fig').length === NE.figs);
    W.FFORGE.inject(); W.FFORGE.inject();
    T('nuclear: inject() idempotent (no dupes)', rd.querySelectorAll('.ff-fig').length === NE.figs);
    T('nuclear: ASCII still concealed', rd.querySelectorAll('pre[data-ff-hidden]').length === NE.hides);
    /* E. skip-placement doc: quantum figures have no hide -> insert after heading+skip */
    switchDoc('Quantum Mechanics.md');
    setTimeout(qmTests, 220);
  } catch (e) {
    fail++; errs.push('idem exception: ' + (e && e.stack || e));
    qmTests();
  }
}

function qmTests() {
  try {
    const rd = D.getElementById('contentReader');
    const QE = W.__EXP['Quantum Mechanics.md'];
    const figs = rd.querySelectorAll('.ff-fig');
    T('QM: ' + QE.figs + ' figures injected', figs.length === QE.figs);
    const qHidden = rd.querySelectorAll('pre[data-ff-hidden]');
    T('QM: ' + QE.hides + ' ASCII sketches concealed', qHidden.length === QE.hides);
    if (QE.hides > 0) {
      const sternPre = Array.from(qHidden).find(p => p.getAttribute('data-ff-hidden') === 'ff-qm-stern');
      T('QM: Stern-Gerlach ASCII concealed by id', !!sternPre);
    }
    const well = rd.querySelector('[data-ff="ff-qm-well"]');
    T('QM: well figure after its anchor', !!well && (function () {
      const hs = rd.querySelectorAll('h1,h2,h3,h4'); let h0 = null;
      hs.forEach(h => { if (!h0 && h.textContent.toLowerCase().indexOf('infinite square well') >= 0) h0 = h; });
      return h0 && (h0.compareDocumentPosition(well) & W.Node.DOCUMENT_POSITION_FOLLOWING);
    })());
    /* cross-doc switch: condensed matter + electronics quick check */
    switchDoc('condensed matter.md');
    setTimeout(cmTests, 220);
  } catch (e) {
    fail++; errs.push('qm exception: ' + (e && e.stack || e));
    cmTests();
  }
}

function cmTests() {
  try {
    const rd = D.getElementById('contentReader');
    const CE = W.__EXP['condensed matter.md'];
    T('CM: ' + CE.figs + ' figures injected', rd.querySelectorAll('.ff-fig').length === CE.figs);
    T('CM: ' + CE.hides + ' ASCII sketches concealed', rd.querySelectorAll('pre[data-ff-hidden]').length === CE.hides);
    const kronigPre = Array.from(rd.querySelectorAll('pre[data-ff-hidden]')).find(p => p.getAttribute('data-ff-hidden') === 'ff-cm-kronig');
    T('CM: Kronig ASCII concealed by id', !!kronigPre);
    const fonts = rd.querySelector('.ff-fig svg').getAttribute('viewBox');
    T('CM: svg viewBox 1200x700', fonts === '0 0 1200 700');
    if (jsdomErrors.length) console.log('JSDOM ERRORS:', jsdomErrors.slice(0, 6));
    T('no uncaught jsdom errors', jsdomErrors.length === 0);
    summary();
  } catch (e) {
    fail++; errs.push('cm exception: ' + (e && e.stack || e));
    summary();
  }
}

function summary() {
  console.log('\nSMOKE41: ' + pass + ' passed, ' + fail + ' failed');
  if (errs.length) {
    console.log('FAILURES:');
    errs.forEach(e => console.log('  ✗ ' + e.split('\n')[0]));
    process.exit(1);
  }
  process.exit(0);
}
