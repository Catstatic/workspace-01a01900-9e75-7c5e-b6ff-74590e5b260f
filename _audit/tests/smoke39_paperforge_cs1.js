#!/usr/bin/env node
/* SMOKE 39 — PAPERFORGE S5: triple-bank VAULT + LEGION CS-I (CSIR pattern).
   Real-DOM cockpit: per-part attempt caps (A15/B20/C20) enforced at answer
   time, one blocked 16th-A attempt asserted, perfect-at-caps run 200/200,
   mixed run with exact official arithmetic (25.5 + 65.625 + 83.75 = 174.875),
   review, lane table, filters, vault history, namespace isolation. */
'use strict';
const fs = require('fs');
const { execSync } = require('child_process');
const { JSDOM, VirtualConsole } = require('/tmp/domt/node_modules/jsdom');
console.log(execSync('node /home/user/_audit/paperforge/prune_for_smoke.js').toString().trim());
const H = fs.readFileSync('/tmp/tracker_pruned.html', 'utf8');

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

setTimeout(run, 1200);

function ev(el, type) { el.dispatchEvent(new W.Event(type, { bubbles: true })); }
function click(el) { el.dispatchEvent(new W.MouseEvent('click', { bubbles: true })); }

function run() {
  try {
    /* A. boot + vault mount */
    T('PFVAULT exported', typeof W.PFVAULT === 'object');
    T('no FORGE leak into SIM_PAPERS', (function () {
      try { return W.eval('SIM_PAPERS.every(function(p){return p.id.indexOf("pf-")!==0;})'); }
      catch (e) { return 'eval-fail:' + e.message; }
    })() === true);
    T('vault section mounted', !!D.getElementById('pfVault'));
    T('vault says AI-GENERATED', D.getElementById('pfVault').textContent.indexOf('AI-GENERATED') >= 0);

    /* B. inject all three banks + render */
    W.eval(fs.readFileSync('/home/user/project/paperforge-bank-legion1.js', 'utf8'));
    W.eval(fs.readFileSync('/home/user/project/paperforge-bank-legion2.js', 'utf8'));
    W.eval(fs.readFileSync('/home/user/project/paperforge-bank-cs1.js', 'utf8'));
    const B = W.FORGE_BANKS['pf-cs-1'];
    T('cs bank loads: 75 questions', B.questions.length === 75);
    T('cs capped maxScore 200', B.maxScore === 200);
    T('cs official limits embedded', B.limits.A.max === 15 && B.limits.B.max === 20 && B.limits.C.max === 20 &&
      B.limits.B.correct === 3.5 && B.limits.B.wrong === 0.875 && B.limits.C.wrong === 1.25);
    T('cs parts A20/B25/C30', B.partCounts.A === 20 && B.partCounts.B === 25 && B.partCounts.C === 30);
    T('cs carries 4 baked figures', B.questions.filter(q => q.figSvg).length === 4);
    W.PFVAULT.render();
    const cards = D.querySelectorAll('.pf-bank-card');
    T('triple-bank vault: 3 cards', cards.length === 3);
    T('card order: I, II, CS-I', cards.length === 3 &&
      cards[0].textContent.indexOf('LEGION I') >= 0 && cards[1].textContent.indexOf('LEGION II') >= 0 &&
      cards[2].textContent.indexOf('LEGION CS-I') >= 0);
    T('cs card shows max 200', cards[2].textContent.indexOf('200') >= 0);

    /* helpers */
    const curN = () => Number(D.querySelector('.pf-qnum').textContent.match(/QUESTION (\d+)/)[1]);
    const gotoQ = (n) => { click(D.querySelector('#pfPal button[data-n="' + n + '"]')); if (curN() !== n) throw new Error('gotoQ ' + n); };
    const answerRight = (q) => click(D.querySelector('.pf-opt[data-i="' + q.ans + '"]'));
    const partctr = () => D.getElementById('pfPartCtr').textContent;

    /* C. perfect-at-caps run */
    W.PFVAULT.start('pf-cs-1');
    T('shell active', D.getElementById('pfShell').classList.contains('active'));
    T('part counters visible at 0', partctr().indexOf('Part A: 0/15') >= 0);
    const right15A = B.questions.filter(q => q.part === 'A').slice(0, 15);
    right15A.forEach(q => { gotoQ(q.n); answerRight(q); });
    T('part A counter full 15/15', partctr().indexOf('Part A: 15/15') >= 0);
    /* cap enforcement: 16th A answer must be blocked */
    const a16 = B.questions.find(q => q.part === 'A' && q.n === 16);
    gotoQ(16);
    click(D.querySelector('.pf-opt[data-i="0"]'));
    T('16th Part A answer BLOCKED by cap', partctr().indexOf('Part A: 15/15') >= 0 &&
      !D.querySelector('.pf-opt[data-i="0"]').classList.contains('selected'));
    /* B: 20 correct (exactly the cap) */
    B.questions.filter(q => q.part === 'B').slice(0, 20).forEach(q => { gotoQ(q.n); answerRight(q); });
    /* C: 20 correct (exactly the cap) */
    B.questions.filter(q => q.part === 'C').slice(0, 20).forEach(q => { gotoQ(q.n); answerRight(q); });
    T('counters at caps A15/B20/C20', partctr().indexOf('Part A: 15/15') >= 0 &&
      partctr().indexOf('Part B: 20/20') >= 0 && partctr().indexOf('Part C: 20/20') >= 0);
    T('palette answered count = 55', D.querySelectorAll('#pfPal .ans, #pfPal .ansmk').length === 55);
    const sb = D.getElementById('pfSubmit');
    click(sb);
    T('submit two-step armed', sb.classList.contains('armed'));
    click(sb);
    const atts = W.PFVAULT.attempts('pf-cs-1');
    T('attempt stored', atts.length === 1);
    T('perfect-at-caps 200/200', atts[0].score === 200 && atts[0].maxScore === 200);
    T('counts 55c/0w/20s', atts[0].correct === 55 && atts[0].wrong === 0 && atts[0].skipped === 20);
    T('review opens', D.getElementById('pfShell').textContent.indexOf('WORKED SOLUTION') >= 0);
    T('review 75 cards', D.querySelectorAll('.pf-rq').length === 75);
    T('lane table shows CSIR parts', D.getElementById('pfShell').textContent.indexOf('Part A · Aptitude') >= 0 &&
      D.getElementById('pfShell').textContent.indexOf('Part C · Advanced') >= 0);
    const closeBtn = D.getElementById('pfSubmit');
    T('close button labelled', closeBtn.textContent.indexOf('CLOSE') >= 0);
    click(closeBtn);

    /* D. mixed run: A 14 (1w), B 20 (1w), C 18 (1w) -> 25.5 + 65.625 + 83.75 = 174.875 */
    W.PFVAULT.start('pf-cs-1');
    const sabotage = (q) => click(D.querySelector('.pf-opt[data-i="' + ((q.ans + 1) % 4) + '"]'));
    const aQ = B.questions.filter(q => q.part === 'A');
    gotoQ(aQ[0].n); sabotage(aQ[0]);
    aQ.slice(1, 14).forEach(q => { gotoQ(q.n); answerRight(q); });
    const bQ = B.questions.filter(q => q.part === 'B');
    gotoQ(bQ[0].n); sabotage(bQ[0]);
    bQ.slice(1, 20).forEach(q => { gotoQ(q.n); answerRight(q); });
    const cQ = B.questions.filter(q => q.part === 'C');
    gotoQ(cQ[0].n); sabotage(cQ[0]);
    cQ.slice(1, 18).forEach(q => { gotoQ(q.n); answerRight(q); });
    click(D.getElementById('pfSubmit'));
    click(D.getElementById('pfSubmit'));
    const atts2 = W.PFVAULT.attempts('pf-cs-1');
    T('attempt 2 stored', atts2.length === 2);
    const exp = 25.5 + 65.625 + 83.75;
    T('CSIR marking math exact (174.875)', atts2[1].score === exp && exp === 174.875);
    T('mixed counts 49c/3w/23s', atts2[1].correct === 49 && atts2[1].wrong === 3 && atts2[1].skipped === 23);
    T('review marks 3 wrong + 23 skipped', D.querySelectorAll('.pf-rq.wrong').length === 3 &&
      D.querySelectorAll('.pf-rq.skipped').length === 23);
    const wrongBtn = Array.from(D.querySelectorAll('#pfFilterRow button')).find(b => b.getAttribute('data-f') === 'wrong');
    click(wrongBtn);
    T('wrong filter shows 3', Array.from(D.querySelectorAll('.pf-rq')).filter(c => c.style.display !== 'none').length === 3);

    /* E. vault history refresh */
    click(D.getElementById('pfSubmit')); /* close review */
    W.PFVAULT.render();
    const csCard = D.querySelectorAll('.pf-bank-card')[2].textContent;
    T('vault shows 2 attempts + best 200 on CS-I', csCard.indexOf('2 attempts') >= 0 && csCard.indexOf('200') >= 0);

    /* F. namespace isolation + hygiene */
    T('ls keys are pf: namespaced', (function () {
      let ok = true;
      for (let i = 0; i < W.localStorage.length; i++) {
        const k = W.localStorage.key(i);
        if (k.indexOf('pf:') === 0) continue;
        if (k.indexOf('forge') >= 0 || k.indexOf('paperforge') >= 0) ok = false;
      }
      return ok;
    })());
    T('no jsdom page errors', jsdomErrors.length === 0);
    if (jsdomErrors.length) console.log('JSDOM ERRORS:', jsdomErrors.slice(0, 5));
  } catch (e) {
    fail++; errs.push('EXCEPTION: ' + e.message);
  }
  console.log('\nSMOKE39: ' + pass + ' passed, ' + fail + ' failed');
  if (errs.length) { console.log('FAILURES:'); errs.forEach(x => console.log(' ✗', x)); }
  try { dom.window.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
}
