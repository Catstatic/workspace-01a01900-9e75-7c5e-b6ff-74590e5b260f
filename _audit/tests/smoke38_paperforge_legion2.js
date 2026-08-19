#!/usr/bin/env node
/* SMOKE 38 — PAPERFORGE S4: dual-bank VAULT + LEGION II end-to-end.
   jsdom boots the real tracker; the bank companion is injected by hand
   (jsdom fetches no external srcs). Plays two full sessions through REAL DOM
   events: a perfect run (98/98), and a mixed run asserting GATE marking math
   (MCQ −0.333 / MSQ −0 / NAT window) + vault history. Zero tolerance. */
'use strict';
const fs = require('fs');
const { execSync } = require('child_process');
const { JSDOM, VirtualConsole } = require('/tmp/domt/node_modules/jsdom');
/* RAM guard (2 GB sandbox): boot the pruned copy — base64 media mass blanked,
   all logic intact. See _audit/paperforge/prune_for_smoke.js. */
console.log(execSync('node /home/user/_audit/paperforge/prune_for_smoke.js').toString().trim());
const H = fs.readFileSync('/tmp/tracker_pruned.html', 'utf8');

let pass = 0, fail = 0; const errs = [];
function T(name, cond) { if (cond) pass++; else { fail++; errs.push(name); } }

const vc = new VirtualConsole();
const jsdomErrors = [];
vc.on('jsdomError', e => {
  const m = String((e && e.message) || e);
  if (/Not implemented|Could not parse CSS|canvas/i.test(m)) return; /* benign sandbox noise */
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

function ev(el, type) {
  el.dispatchEvent(new W.Event(type, { bubbles: true }));
}
function click(el) { el.dispatchEvent(new W.MouseEvent('click', { bubbles: true })); }

function run() {
  try {
    /* A. boot + vault mount */
    T('PFVAULT exported', typeof W.PFVAULT === 'object');
    T('no FORGE leak into SIM_PAPERS', (function () {
      try { return W.eval('SIM_PAPERS.every(function(p){return p.id.indexOf("pf-legion")<0;})'); }
      catch (e) { return 'eval-fail:' + e.message; }
    })() === true);
    T('vault section mounted', !!D.getElementById('pfVault'));
    T('vault says AI-GENERATED', D.getElementById('pfVault').textContent.indexOf('AI-GENERATED') >= 0);

    /* B. inject BOTH banks + render */
    W.eval(fs.readFileSync('/home/user/project/paperforge-bank-legion1.js', 'utf8'));
    W.eval(fs.readFileSync('/home/user/project/paperforge-bank-legion2.js', 'utf8'));
    const B = W.FORGE_BANKS['pf-legion-2'];
    T('legion-2 bank loads: 60 questions', B.questions.length === 60);
    T('legion-2 maxScore 98', B.maxScore === 98);
    T('legion-2 type tally 35/8/17', B.typeTally.MCQ === 35 && B.typeTally.MSQ === 8 && B.typeTally.NAT === 17);
    T('legion-2 lane budget 20/14/10/8/8', B.partCounts.QM === 20 && B.partCounts.TH === 14 &&
      B.partCounts.EL === 10 && B.partCounts.AN === 8 && B.partCounts.SS === 8);
    T('legion-2 carries 4 baked figures', B.questions.filter(q => q.figSvg).length === 4);
    W.PFVAULT.render();
    const cards = D.querySelectorAll('.pf-bank-card');
    T('dual-bank vault: 2 cards', cards.length === 2);
    T('card order: LEGION I then LEGION II',
      cards.length === 2 && cards[0].textContent.indexOf('LEGION I') >= 0 && cards[1].textContent.indexOf('LEGION II') >= 0);
    T('card meta mentions MSQ+NAT', cards[1].textContent.indexOf('MSQ') >= 0 && cards[1].textContent.indexOf('NAT') >= 0);

    /* C. perfect run through DOM events */
    W.PFVAULT.start('pf-legion-2');
    T('shell active', D.getElementById('pfShell').classList.contains('active'));
    const natMid = q => { const a = String(q.ans);
      if (a.indexOf(' to ') >= 0) { const p = a.split(' to '); return String((Number(p[0]) + Number(p[1])) / 2); }
      return a; };
    B.questions.forEach((q) => {
      // current question must equal q.n by construction order check happens later
      const cur = Number(D.querySelector('.pf-qnum').textContent.match(/QUESTION (\d+)/)[1]);
      if (cur !== q.n) throw new Error('nav desync at ' + q.n + ' (showing ' + cur + ')');
      if (q.type === 'MCQ') {
        click(D.querySelector('.pf-opt[data-i="' + q.ans + '"]'));
      } else if (q.type === 'MSQ') {
        q.ans.forEach(i => click(D.querySelector('.pf-opt[data-i="' + i + '"]')));
      } else {
        const inp = D.getElementById('pfNatIn');
        inp.value = natMid(q);
        ev(inp, 'input');
      }
      if (q.n < 60) click(D.getElementById('pfNext'));
    });
    T('palette answered count = 60', D.querySelectorAll('#pfPal .ans, #pfPal .ansmk').length === 60);
    T('progress footer shows 60 answered', D.getElementById('pfProgress').textContent.indexOf('60 answered') >= 0);
    const sb = D.getElementById('pfSubmit');
    click(sb);
    T('submit two-step armed', sb.classList.contains('armed'));
    click(sb);
    const atts = W.PFVAULT.attempts('pf-legion-2');
    T('attempt stored', atts.length === 1);
    T('perfect score 98/98', atts[0].score === 98 && atts[0].maxScore === 98);
    T('correct=60 wrong=0 skipped=0', atts[0].correct === 60 && atts[0].wrong === 0 && atts[0].skipped === 0);
    T('review opens', D.getElementById('pfShell').classList.contains('active') && D.getElementById('pfShell').textContent.indexOf('WORKED SOLUTION') >= 0);
    T('review count 60 cards', D.querySelectorAll('.pf-rq').length === 60);
    T('review all-correct', D.querySelectorAll('.pf-rq.correct').length === 60);
    const closeBtn = D.getElementById('pfSubmit');
    T('close button labelled', closeBtn.textContent.indexOf('CLOSE') >= 0);
    click(closeBtn);
    T('shell closed after review', !D.getElementById('pfShell').classList.contains('active'));

    /* D. mixed run: one 1M MCQ wrong, one MSQ wrong, one NAT out-of-window, one 2M MCQ right */
    W.PFVAULT.start('pf-legion-2');
    const q1 = B.questions.find(q => q.type === 'MCQ' && q.marks === 1);
    const q2 = B.questions.find(q => q.type === 'MSQ');
    const q3 = B.questions.find(q => q.type === 'NAT');
    const q4 = B.questions.find(q => q.type === 'MCQ' && q.marks === 2);
    const gotoQ = (n) => {
      for (let g = 0; g < 70; g++) {
        const cur = Number(D.querySelector('.pf-qnum').textContent.match(/QUESTION (\d+)/)[1]);
        if (cur === n) return;
        click(D.getElementById(cur < n ? 'pfNext' : 'pfPrev'));
      }
      throw new Error('gotoQ failed ' + n);
    };
    gotoQ(q1.n);
    click(D.querySelector('.pf-opt[data-i="' + ((q1.ans + 1) % 4) + '"]'));      // wrong 1M MCQ → −0.333
    gotoQ(q2.n);
    click(D.querySelector('.pf-opt[data-i="' + q2.ans[0] + '"]'));               // partial MSQ → wrong, −0
    gotoQ(q3.n);
    const inp = D.getElementById('pfNatIn'); inp.value = '999999'; ev(inp, 'input');  // NAT out of window → 0
    gotoQ(q4.n);
    click(D.querySelector('.pf-opt[data-i="' + q4.ans + '"]'));                  // right 2M MCQ → +2
    click(D.getElementById('pfSubmit'));
    click(D.getElementById('pfSubmit'));
    const atts2 = W.PFVAULT.attempts('pf-legion-2');
    T('attempt 2 stored', atts2.length === 2);
    const exp = Math.round((2 - 0.333 - 0 - 0) * 1000) / 1000;
    T('GATE marking math exact (1.667)', atts2[1].score === exp && exp === 1.667);
    T('mixed run counts 1c/3w/56s', atts2[1].correct === 1 && atts2[1].wrong === 3 && atts2[1].skipped === 56);
    const rev = D.getElementById('pfShell');
    T('review shows key line', rev.textContent.indexOf('✓ key:') >= 0);
    T('review marks 3 wrong + 56 skipped cards', D.querySelectorAll('.pf-rq.wrong').length === 3 && D.querySelectorAll('.pf-rq.skipped').length === 56);
    /* filter row */
    const wrongBtn = Array.from(D.querySelectorAll('#pfFilterRow button')).find(b => b.getAttribute('data-f') === 'wrong');
    click(wrongBtn);
    T('wrong filter shows 3', Array.from(D.querySelectorAll('.pf-rq')).filter(c => c.style.display !== 'none').length === 3);

    /* E. vault history refresh */
    T('review lane table shows new lanes', rev.textContent.indexOf('Quantum') >= 0 && rev.textContent.indexOf('Solid State') >= 0);
    click(D.getElementById('pfSubmit')); /* close review */
    W.PFVAULT.render();
    const l2card = D.querySelectorAll('.pf-bank-card')[1].textContent;
    T('vault shows 2 attempts + best 98 on legion 2', l2card.indexOf('2 attempts') >= 0 && l2card.indexOf('98') >= 0);

    /* F. namespace isolation: no pf: keys collide with sim lanes */
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
  console.log('\nSMOKE38: ' + pass + ' passed, ' + fail + ' failed');
  if (errs.length) { console.log('FAILURES:'); errs.forEach(x => console.log(' ✗', x)); }
  try { dom.window.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
}
