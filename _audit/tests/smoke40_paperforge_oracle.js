#!/usr/bin/env node
/* SMOKE 40 — PAPERFORGE S6: six-bank VAULT + ORACLE A (GATE 2027 prophecy).
   Real-DOM cockpit: GA section played fully (15/15), subject multi-type
   grader check (2M MCQ +2 · MSQ +2 · NAT +2 · 1M MCQ sabotage −0.333 → exact
   20.667), review lane table with real GA row counts (the R34 lane-key fix),
   vault history, namespace isolation. */
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

setTimeout(run, 1400);

function ev(el, type) { el.dispatchEvent(new W.Event(type, { bubbles: true })); }
function click(el) { el.dispatchEvent(new W.MouseEvent('click', { bubbles: true })); }

function run() {
  try {
    /* A. boot + vault */
    T('PFVAULT exported', typeof W.PFVAULT === 'object');
    T('no FORGE leak into SIM_PAPERS', (function () {
      try { return W.eval('SIM_PAPERS.every(function(p){return p.id.indexOf("pf-")!==0;})'); }
      catch (e) { return 'eval-fail:' + e.message; }
    })() === true);
    T('vault section mounted', !!D.getElementById('pfVault'));

    /* B. six banks */
    ['legion1', 'legion2', 'cs1', 'oracle-a', 'oracle-b', 'oracle-c'].forEach(k =>
      W.eval(fs.readFileSync('/home/user/project/paperforge-bank-' + k + '.js', 'utf8')));
    const B = W.FORGE_BANKS['pf-oracle-a'];
    T('oracle-a: 65 questions', B.questions.length === 65);
    T('oracle-a: maxScore 100, 3h', B.maxScore === 100 && B.durationSec === 10800);
    T('oracle-a: GA 10 + PH 55', B.questions.filter(q => q.part === 'GA').length === 10 &&
      B.questions.filter(q => q.part === 'PH').length === 55);
    T('oracle-a: subject has all 3 types', ['MCQ', 'MSQ', 'NAT'].every(t =>
      B.questions.some(q => q.part === 'PH' && q.type === t)));
    T('oracle-a: GA marks 5×1+5×2', B.questions.filter(q => q.part === 'GA' && q.marks === 1).length === 5 &&
      B.questions.filter(q => q.part === 'GA' && q.marks === 2).length === 5);
    T('oracle papers distinct', W.FORGE_BANKS['pf-oracle-a'].questions[11].stem !==
      W.FORGE_BANKS['pf-oracle-b'].questions[11].stem);
    W.PFVAULT.render();
    const cards = D.querySelectorAll('.pf-bank-card');
    T('six-bank vault: 6 cards', cards.length === 6);
    T('card 4 is ORACLE A with prophecy tag', cards.length === 6 && cards[3].textContent.indexOf('ORACLE A') >= 0 &&
      cards[3].textContent.indexOf('prophecy') >= 0);

    /* helpers */
    const curN = () => Number(D.querySelector('.pf-qnum').textContent.match(/QUESTION (\d+)/)[1]);
    const gotoQ = (n) => { click(D.querySelector('#pfPal button[data-n="' + n + '"]')); if (curN() !== n) throw new Error('gotoQ ' + n); };
    const natMid = q => { const a = String(q.ans);
      if (a.indexOf(' to ') >= 0) { const p = a.split(' to '); return String((Number(p[0]) + Number(p[1])) / 2); }
      return a; };

    /* C. GA full play + mixed subject */
    W.PFVAULT.start('pf-oracle-a');
    T('shell active', D.getElementById('pfShell').classList.contains('active'));
    T('timer shows 3h scale', D.getElementById('pfTimer').textContent.indexOf('03:0') === 0 ||
      D.getElementById('pfTimer').textContent.indexOf('02:59') === 0);
    B.questions.filter(q => q.part === 'GA').forEach(q => { gotoQ(q.n); click(D.querySelector('.pf-opt[data-i="' + q.ans + '"]')); });
    const mcq2 = B.questions.find(q => q.part === 'PH' && q.type === 'MCQ' && q.marks === 2);
    const msq = B.questions.find(q => q.part === 'PH' && q.type === 'MSQ');
    const nat = B.questions.find(q => q.part === 'PH' && q.type === 'NAT');
    const mcq1 = B.questions.find(q => q.part === 'PH' && q.type === 'MCQ' && q.marks === 1);
    gotoQ(mcq2.n); click(D.querySelector('.pf-opt[data-i="' + mcq2.ans + '"]'));          /* +2 */
    gotoQ(msq.n); msq.ans.forEach(i => click(D.querySelector('.pf-opt[data-i="' + i + '"]'))); /* +2 */
    gotoQ(nat.n); { const inp = D.getElementById('pfNatIn'); inp.value = natMid(nat); ev(inp, 'input'); } /* +2 */
    gotoQ(mcq1.n); click(D.querySelector('.pf-opt[data-i="' + ((mcq1.ans + 1) % 4) + '"]')); /* −0.333 */
    T('palette answered = 14', D.querySelectorAll('#pfPal .ans, #pfPal .ansmk').length === 14);
    const sb = D.getElementById('pfSubmit');
    click(sb); T('armed', sb.classList.contains('armed')); click(sb);
    const atts = W.PFVAULT.attempts('pf-oracle-a');
    T('attempt stored', atts.length === 1);
    const exp = Math.round((15 + mcq2.marks + msq.marks + nat.marks - 0.333) * 1000) / 1000;
    T('exact score = GA15 +' + (mcq2.marks + msq.marks + nat.marks) + ' − 0.333 → ' + exp,
      atts[0].score === exp && exp === 19.667);
    T('counts 13c/1w/51s', atts[0].correct === 13 && atts[0].wrong === 1 && atts[0].skipped === 51);
    T('review opens with 65 cards', D.querySelectorAll('.pf-rq').length === 65);
    /* R34 lane-table regression: GA row must show REAL counts, not zeros */
    const rows = Array.from(D.querySelectorAll('.pf-lanetable tbody tr'));
    const gaRow = rows.find(r => r.textContent.indexOf('Aptitude (GA)') >= 0);
    T('lane table has Aptitude (GA) row', !!gaRow);
    if (gaRow) {
      const tds = gaRow.querySelectorAll('td');
      T('GA lane row: 10 attempted / 10 correct', tds[1].textContent === '10' && tds[2].textContent === '10');
      const m = tds[4].textContent.match(/([\d.]+)\s*\/\s*([\d.]+)/);
      T('GA lane row: score 15 / 15', !!m && parseFloat(m[1]) === 15 && parseFloat(m[2]) === 15);
    }
    const anyLane = rows.find(r => r.textContent.indexOf('Quantum') >= 0 || r.textContent.indexOf('Classical') >= 0);
    T('a physics lane row shows nonzero max', !!anyLane && !/\/\s*0$/.test(anyLane.textContent.trim()));
    click(D.getElementById('pfSubmit')); /* close review */

    /* D. vault history */
    W.PFVAULT.render();
    const oc = D.querySelectorAll('.pf-bank-card')[3].textContent;
    const mb = oc.match(/best\s+([\d.]+)\/(\d+)/);
    T('oracle-a card: 1 attempt + best ' + exp + ' (2dp display)', oc.indexOf('1 attempt') >= 0 && !!mb && parseFloat(mb[1]) === Math.round(exp * 100) / 100 && mb[2] === '100');

    /* E. hygiene */
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
  console.log('\nSMOKE40: ' + pass + ' passed, ' + fail + ' failed');
  if (errs.length) { console.log('FAILURES:'); errs.forEach(x => console.log(' ✗', x)); }
  try { dom.window.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
}
