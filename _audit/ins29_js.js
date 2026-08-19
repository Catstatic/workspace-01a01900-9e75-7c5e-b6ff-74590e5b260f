/* 🗄️ PAPERFORGE · MOCK VAULT + FORGE COCKPIT (ROUND 31)
   window.PFVAULT — own namespace (pf:* storage), own session runner.
   THE OFFICIAL PYQ LANES ARE NEVER TOUCHED: no shared grader, no SIM_PAPERS
   registration, no base-function monkey-patching. GATE marking math is
   mirrored from per-question fields (MCQ 1M −1/3 · 2M −2/3 · MSQ/NAT no
   negative). All content labelled AI-GENERATED. */
(function () {
'use strict';
var LS = window.localStorage;
var ATT = 'pf:attempts:';
var shell = null, S = null, tick = null;

function $(id){ return document.getElementById(id); }
function banks(){ return window.FORGE_BANKS || {}; }
function bankList(){ return Object.keys(banks()).map(function(k){ return banks()[k]; }); }
function attKey(id){ return ATT + id; }
function attemptsFor(id){
  try { return JSON.parse(LS.getItem(attKey(id)) || '[]'); } catch (e) { return []; }
}
function saveAttempt(bankId, att){
  try {
    var arr = attemptsFor(bankId);
    arr.push(att);
    if (arr.length > 25) arr = arr.slice(-25);
    LS.setItem(attKey(bankId), JSON.stringify(arr));
  } catch (e) {}
}
function fmt(x, dp){ return Number(x).toFixed(dp === undefined ? 2 : dp); }
function h(ms){ var s = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(s / 3600)).padStart(2, '0') + ':' +
         String(Math.floor(s % 3600 / 60)).padStart(2, '0') + ':' +
         String(s % 60).padStart(2, '0'); }
/* lane vocab — module scope: BOTH submit() (grading lanes) and showReview()
   (lane table) use these; nesting them inside showReview once killed grading
   outright (caught by smoke40). */
var LANE_NAMES = { MP: 'Math Physics', CM: 'Classical', EM: 'EM Theory',
  QM: 'Quantum', TH: 'Thermo/Stat', EL: 'Electronics', AN: 'Atomic/Nuclear', SS: 'Solid State',
  GA: 'Aptitude (GA)',
  A: 'Part A · Aptitude (+2/−0.5)', B: 'Part B · Core (+3.5/−0.875)', C: 'Part C · Advanced (+5/−1.25)' };
var LANE2CODE = { mathphys: 'MP', classical: 'CM', emtheory: 'EM', quantum: 'QM', thermo: 'TH',
  electronics: 'EL', atnuc: 'AN', solidstate: 'SS', aptitude: 'GA', nuclear: 'AN', atomic: 'AN' };
function renderMath(el){
  if (typeof window.renderSimMath === 'function') { try { window.renderSimMath(el); return; } catch (e) {} }
  if (typeof window.renderMathInElement === 'function') {
    try { window.renderMathInElement(el, { delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }], throwOnError: false }); } catch (e) {}
  }
}
function toast(m){ if (typeof window.showToast === 'function') window.showToast(m); }

/* ============ grading ============ */
function natOK(q, given){
  if (given === undefined || given === null) return false;
  var v = Number(given);
  if (!Number.isFinite(v)) return false;
  var a = String(q.ans);
  if (a.indexOf(' to ') >= 0) {
    var pr = a.split(' to ');
    var lo = Number(pr[0]), hi = Number(pr[1]);
    return v >= lo - 1e-12 && v <= hi + 1e-12;
  }
  var want = Number(a);
  if (!Number.isFinite(want)) return false;
  if (want === 0) return Math.abs(v) < 1e-9;
  return Math.abs(v - want) <= Math.max(1e-9, Math.abs(want) * 0.005);
}
function pfGrade(q, given){
  if (given === undefined || given === null) return 'skipped';
  if (q.type === 'MCQ') return (given === q.ans) ? 'correct' : 'wrong';
  if (q.type === 'MSQ') {
    if (!Array.isArray(given) || !given.length) return 'skipped';
    var a = q.ans.slice().sort(function(x,y){return x-y;}).join(',');
    var g = given.slice().sort(function(x,y){return x-y;}).join(',');
    return a === g ? 'correct' : 'wrong';
  }
  return natOK(q, given) ? 'correct' : 'wrong';
}
function fmtGiven(q, given){
  var L = ['A', 'B', 'C', 'D'];
  if (given === undefined || given === null || (Array.isArray(given) && !given.length)) return null;
  if (q.type === 'MCQ') return L[given] + '. ' + (q.opts ? q.opts[given] : '');
  if (q.type === 'MSQ') return given.slice().sort().map(function(i){ return L[i]; }).join(', ');
  return String(given);
}
function fmtKey(q){
  var L = ['A', 'B', 'C', 'D'];
  if (q.type === 'MCQ') return L[q.ans] + '. ' + q.opts[q.ans];
  if (q.type === 'MSQ') return q.ans.slice().sort().map(function(i){ return L[i]; }).join(', ');
  return q.ans.indexOf(' to ') >= 0 ? ('any value in ' + q.ans) : String(q.ans);
}

/* ============ vault mount ============ */
function mount(){
  if ($('pfVault')) return;
  var host = document.querySelector('#simPaperList') ? document.querySelector('#simPaperList').closest('.card') : null;
  if (!host || !host.parentNode) return;
  var sec = document.createElement('div');
  sec.id = 'pfVault';
  sec.innerHTML =
    '<div class="pf-vault-head"><span class="pf-vault-title">🗄️ MOCK VAULT — PAPERFORGE</span>' +
    '<span class="pf-ai-tag">AI-GENERATED — ORIGINAL FORGE BANKS</span></div>' +
    '<div class="pf-vault-sub">Forged papers: pattern-faithful to GATE, every question original and ' +
    'double-solved (author + independent audit). MCQ/MSQ/NAT with true GATE marking ' +
    '(MCQ −1/3 per 1M, −2/3 per 2M; MSQ &amp; NAT: no negative). Attempt history is kept in the vault\'s own <b>pf:</b> namespace — the official PYQ lists and their scoring are untouched.</div>' +
    '<div id="pfVaultList"></div>';
  host.parentNode.insertBefore(sec, host);
}
function renderVault(){
  mount();
  var listEl = $('pfVaultList');
  if (!listEl) return;
  var list = bankList();
  if (!list.length) {
    listEl.innerHTML = '<div style="color:var(--ink-2,#8b9bb0);font-size:0.8rem;padding:8px 0;">Forge bank loading…</div>';
    return;
  }
  listEl.innerHTML = list.map(function(b){
    var atts = attemptsFor(b.id);
    var best = atts.length ? Math.max.apply(null, atts.map(function(a){ return a.score; })) : null;
    var t = b.typeTally || {};
    return '<div class="pf-bank-card">' +
      '<div class="pf-bank-info"><div class="pf-bank-title">' + b.label +
      '<span class="pf-bank-tag">READY</span></div>' +
      '<div class="pf-bank-meta">' + b.totalQ + ' questions · ' + (t.MCQ || 0) + ' MCQ / ' + (t.MSQ || 0) + ' MSQ / ' + (t.NAT || 0) + ' NAT · max ' + b.maxScore + ' marks · ' +
      h(b.durationSec * 1000).slice(0, 5).replace(':','h ') + 'm · ' + (b.minted || '') + '</div></div>' +
      '<div style="display:flex;align-items:center;gap:14px;">' +
      '<div class="pf-bank-stats">' + atts.length + ' attempt' + (atts.length === 1 ? '' : 's') +
      (best !== null ? ' · best <b>' + fmt(best) + '</b>/' + b.maxScore : '') + '</div>' +
      '<button class="pf-btn" data-pf-launch="' + b.id + '">' + (atts.length ? 'RE-ATTEMPT' : 'START LEGION') + '</button>' +
      '</div></div>';
  }).join('');
  listEl.querySelectorAll('[data-pf-launch]').forEach(function(btn){
    btn.addEventListener('click', function(){ PFVAULT.start(btn.getAttribute('data-pf-launch')); });
  });
}

/* ============ cockpit ============ */
function ensureShell(){
  if (shell) return shell;
  shell = document.createElement('div');
  shell.id = 'pfShell';
  shell.innerHTML =
    '<div class="pf-top"><span class="pf-title" id="pfTitle"></span>' +
    '<span id="pfProgress" style="font-family:var(--font-mono,monospace);font-size:0.72rem;color:var(--ink-2,#8b9bb0);"></span>' +
    '<span class="pf-timer" id="pfTimer">--:--:--</span>' +
    '<button class="pf-btn danger" id="pfSubmit">SUBMIT</button></div>' +
    '<div class="pf-body"><div class="pf-main" id="pfMain"></div>' +
    '<div class="pf-side"><div id="pfPartCtr" style="margin-bottom:10px;"></div>' +
    '<div class="pf-pal" id="pfPal"></div>' +
    '<div class="pf-legend"><span class="pf-dot" style="background:#17381f;"></span>answered<br>' +
    '<span class="pf-dot" style="background:#4a3a14;"></span>answered + marked<br>' +
    '<span class="pf-dot" style="background:#3a1420;"></span>marked<br>' +
    '<span class="pf-dot" style="background:#101823;"></span>not visited/seen</div></div></div>' +
    '<div class="pf-nav"><button class="pf-btn ghost" id="pfPrev">← PREVIOUS</button>' +
    '<button class="pf-btn ghost" id="pfMark">MARK</button>' +
    '<button class="pf-btn ghost" id="pfClear">CLEAR</button>' +
    '<span class="spacer"></span>' +
    '<button class="pf-btn" id="pfNext">NEXT →</button></div>';
  document.body.appendChild(shell);
  $('pfPrev').addEventListener('click', function(){ nav(-1); });
  $('pfNext').addEventListener('click', function(){ nav(1); });
  $('pfMark').addEventListener('click', function(){
    if (!S) return;
    S.marked[S.cur] = !S.marked[S.cur];
    if (!S.marked[S.cur]) delete S.marked[S.cur];
    paint(); paintPal();
  });
  $('pfClear').addEventListener('click', function(){
    if (!S) return;
    delete S.answers[S.cur];
    paint(); paintPal();
  });
  /* pfSubmit intentionally gets NO addEventListener here: its single live
     binding is (re)installed via restoreSubmit() — a listener + onclick pair
     would double-fire (first click would arm then instantly submit). */
  return shell;
}
function bank(){ return S.bank; }
function qcur(){
  var qs = bank().questions;
  for (var i = 0; i < qs.length; i++) if (qs[i].n === S.cur) return qs[i];
  return null;
}
function nav(d){
  if (!S) return;
  var tot = bank().totalQ;
  S.cur = Math.min(tot, Math.max(1, S.cur + d));
  S.visited[S.cur] = true;
  paint(); paintPal();
}
/* ---- CSIR-style per-part attempt caps (official SIM_LIMITS pattern, mirrored) ---- */
function partAttempted(part){
  if (!S) return 0;
  var c = 0;
  bank().questions.forEach(function(q){
    if (q.part === part && S.answers[q.n] !== undefined) c++;
  });
  return c;
}
function canAnswer(q){
  if (!S || !S.bank.limits) return true;
  if (S.answers[q.n] !== undefined) return true; /* re-answer is always free */
  var lim = S.bank.limits[q.part];
  if (!lim) return true;
  return partAttempted(q.part) < lim.max;
}
function capToast(q){
  var lim = S.bank.limits[q.part];
  toast('Part ' + q.part + ' attempt limit (' + lim.max + ') reached — CLEAR one Part ' + q.part + ' answer to free a slot.');
}
function paintPartCtr(){
  var el = $('pfPartCtr');
  if (!el) return;
  if (!S || !S.bank.limits) { el.innerHTML = ''; return; }
  el.innerHTML = Object.keys(S.bank.limits).map(function(p){
    var lim = S.bank.limits[p];
    var n = partAttempted(p);
    var full = n >= lim.max;
    return '<span style="display:inline-block;margin:2px 4px 2px 0;padding:4px 7px;border:1px solid ' +
      (full ? '#e5534b' : '#3a4b5f') + ';border-radius:5px;font-family:var(--font-mono,monospace);font-size:0.66rem;color:' +
      (full ? '#e5534b' : '#9db2c8') + ';">Part ' + p + ': ' + n + '/' + lim.max + (full ? ' MAX' : '') + '</span>';
  }).join('');
}
function paint(){
  var q = qcur(); if (!q) return;
  var main = $('pfMain');
  var given = S.answers[q.n];
  var letters = ['A', 'B', 'C', 'D'];
  var marks = '<span class="pf-pill">+' + q.correctMarks + (q.wrongMarks ? ' / −' + q.wrongMarks : ' / no negative') + '</span>';
  var html = '<span class="pf-pill pf-t-' + q.type + '">' + q.type + '</span>' + marks +
    '<div class="pf-qnum">QUESTION ' + q.n + ' · ' + q.lane + ' · ' + q.sub + ' · ' + q.diff + '</div>' +
    '<div class="pf-qtext">' + q.stem + '</div>' +
    (q.figSvg ? '<div class="pf-figbox">' + q.figSvg + '</div>' : '');
  if (q.type === 'MCQ') {
    html += q.opts.map(function(o, i){
      return '<div class="pf-opt' + (given === i ? ' selected' : '') + '" data-i="' + i + '">' +
        '<span class="pf-letter">' + letters[i] + '</span><span class="pf-opt-text">' + o + '</span></div>';
    }).join('');
  } else if (q.type === 'MSQ') {
    html += '<div class="pf-msq-hint">◆ MULTIPLE SELECT — one or more options may be correct. No negative marking; all-or-nothing credit.</div>' +
      q.opts.map(function(o, i){
        var sel = Array.isArray(given) && given.indexOf(i) >= 0;
        return '<div class="pf-opt' + (sel ? ' selected' : '') + '" data-i="' + i + '">' +
          '<span class="pf-letter">' + letters[i] + '</span><span class="pf-opt-text">' + o + '</span></div>';
      }).join('');
  } else {
    html += '<div class="pf-nat-wrap"><input class="pf-nat-input" id="pfNatIn" type="text" inputmode="decimal" placeholder="type the number…" value="' +
      (given !== undefined ? String(given).replace(/"/g, '&quot;') : '') + '">' +
      '<div class="pf-nat-note">◆ NUMERICAL ANSWER TYPE — enter a number; graded inside the official-style window. No negative marking.</div></div>';
  }
  main.innerHTML = html;
  main.querySelectorAll('.pf-opt').forEach(function(el){
    el.addEventListener('click', function(){
      var i = Number(el.getAttribute('data-i'));
      if (q.type === 'MCQ') {
        if (S.answers[q.n] === undefined && !canAnswer(q)) { capToast(q); return; }
        S.answers[q.n] = i;
      } else {
        var g = Array.isArray(S.answers[q.n]) ? S.answers[q.n].slice() : [];
        var ix = g.indexOf(i);
        if (ix >= 0) g.splice(ix, 1);
        else {
          if (S.answers[q.n] === undefined && !canAnswer(q)) { capToast(q); return; }
          g.push(i); g.sort(function(a,b){return a-b;});
        }
        if (g.length) S.answers[q.n] = g; else delete S.answers[q.n];
      }
      paint(); paintPal();
    });
  });
  var ni = $('pfNatIn');
  if (ni) {
    ni.addEventListener('input', function(){
      var v = ni.value.trim();
      if (v === '') delete S.answers[q.n];
      else {
        if (S.answers[q.n] === undefined && !canAnswer(q)) { ni.value = ''; capToast(q); return; }
        S.answers[q.n] = v;
      }
      paintPal();
      /* paint() is skipped here to protect the live input, so refresh the
         progress footer directly — it must never lag the answer map. */
      var pp = $('pfProgress');
      if (pp) pp.textContent = 'Q ' + q.n + '/' + bank().totalQ + ' · ' + Object.keys(S.answers).length + ' answered';
    });
  }
  $('pfMark').textContent = S.marked[q.n] ? 'UNMARK' : 'MARK';
  $('pfProgress').textContent = 'Q ' + q.n + '/' + bank().totalQ + ' · ' + Object.keys(S.answers).length + ' answered';
  renderMath(main);
  main.scrollTop = 0;
}
function paintPal(){
  var pal = $('pfPal'); if (!pal || !S) return;
  pal.innerHTML = bank().questions.map(function(q){
    var cls = '';
    if (S.answers[q.n] !== undefined && !(Array.isArray(S.answers[q.n]) && !S.answers[q.n].length)) cls = S.marked[q.n] ? 'ansmk' : 'ans';
    else if (S.marked[q.n]) cls = 'mk';
    if (q.n === S.cur) cls += ' cur';
    return '<button class="' + cls + '" data-n="' + q.n + '">' + q.n + '</button>';
  }).join('');
  pal.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click', function(){
      S.cur = Number(b.getAttribute('data-n'));
      S.visited[S.cur] = true;
      paint(); paintPal();
    });
  });
  paintPartCtr();
}
function tickFn(){
  if (!S) return;
  var left = S.endAt - Date.now();
  var t = $('pfTimer');
  if (t) { t.textContent = h(left); t.classList.toggle('low', left < 5 * 60 * 1000); }
  if (left <= 0) { toast('Time up — auto-submitting legion.'); submit(true); }
}
function submit(auto){
  if (!S) return;
  clearInterval(tick); tick = null;
  var b = bank();
  var score = 0, corr = 0, wrong = 0, skip = 0;
  var lanes = {};
  b.questions.forEach(function(q){
    /* lane code: CSIR banks group by part (A/B/C), else map q.lane to the
       partCounts code — the review table keys on partCounts codes. */
    var code = (b.limits && q.part) ? q.part : (LANE2CODE[q.lane] || q.lane);
    if (!lanes[code]) lanes[code] = { attempted: 0, correct: 0, wrong: 0, score: 0, max: 0 };
    lanes[code].max += q.correctMarks;
    var st = pfGrade(q, S.answers[q.n]);
    if (st === 'skipped') { skip++; return; }
    lanes[code].attempted++;
    if (st === 'correct') { corr++; score += q.correctMarks; lanes[code].correct++; lanes[code].score += q.correctMarks; }
    else { wrong++; score -= q.wrongMarks; lanes[code].wrong++; lanes[code].score -= q.wrongMarks; }
  });
  score = Math.round(score * 1000) / 1000;
  var att = {
    id: 'pf_' + Date.now(), bankId: b.id, label: b.label,
    submittedAt: new Date().toISOString(), auto: !!auto,
    score: score, maxScore: b.maxScore, correct: corr, wrong: wrong, skipped: skip,
    lanes: lanes,
    usedSec: Math.round((b.durationSec * 1000 - Math.max(0, S.endAt - Date.now())) / 1000),
    answers: JSON.parse(JSON.stringify(S.answers))
  };
  saveAttempt(b.id, att);
  try { if (typeof state !== 'undefined' && state) { state.xp = (state.xp || 0) + 40; if (typeof saveState === 'function') saveState(); } } catch (e) {}
  closeShell();
  renderVault();
  showReview(att);
  toast((auto ? 'Auto-submitted. ' : 'Submitted. ') + 'Score ' + fmt(att.score) + '/' + att.maxScore);
}
function closeShell(){
  if (shell) shell.classList.remove('active');
  S = null;
}

/* ============ review ============ */
function showReview(att){
  var b = banks()[att.bankId]; if (!b) return;
  ensureShell();
  var main = $('pfMain');
  var acc = (att.correct + att.wrong) > 0 ? (100 * att.correct / (att.correct + att.wrong)) : 0;
  var laneRows = Object.keys(b.partCounts || {}).map(function(k){
    var L = att.lanes[k] || { attempted: 0, correct: 0, wrong: 0, score: 0, max: 0 };
    var nm = LANE_NAMES[k] || k;
    return '<tr><td>' + nm + '</td><td>' + L.attempted + '</td><td>' + L.correct + '</td><td>' + L.wrong + '</td><td>' + fmt(L.score) + ' / ' + L.max + '</td></tr>';
  }).join('');
  var cards = b.questions.map(function(q){
    var given = att.answers[q.n];
    var st = pfGrade(q, given);
    var gTxt = fmtGiven(q, given);
    return '<div class="pf-rq ' + st + '" data-st="' + st + '">' +
      '<div class="hd"><span>Q' + q.n + ' · ' + q.type + ' · ' + q.lane + ' · ' + q.diff + '</span>' +
      '<span class="pf-verdict">' + st.toUpperCase() + '</span></div>' +
      '<div class="qt">' + q.stem + '</div>' +
      (q.figSvg ? '<div class="pf-figbox">' + q.figSvg + '</div>' : '') +
      '<div class="pf-ansset">' +
      (gTxt ? '<div class="' + (st === 'wrong' ? 'yours-wrong' : 'right') + '">' + (st === 'wrong' ? '✕ yours: ' : '✓ yours: ') + gTxt + '</div>'
             : '<div class="skip">— not attempted</div>') +
      (st !== 'correct' ? '<div class="right">✓ key: ' + fmtKey(q) + '</div>' : '') +
      '</div>' +
      '<div class="sol"><span class="lab">WORKED SOLUTION</span>' + q.sol + '</div></div>';
  }).join('');
  main.innerHTML =
    '<div class="pf-review-hero">' +
    '<div class="pf-stat-block"><div class="v">' + fmt(att.score) + '</div><div class="k">/ ' + att.maxScore + ' MARKS</div></div>' +
    '<div class="pf-stat-block"><div class="v">' + fmt(acc, 1) + '%</div><div class="k">ACCURACY</div></div>' +
    '<div class="pf-stat-block"><div class="v">' + att.correct + '/' + att.wrong + '/' + att.skipped + '</div><div class="k">C / W / S</div></div>' +
    '<div class="pf-stat-block"><div class="v">' + Math.floor(att.usedSec / 60) + 'm</div><div class="k">TIME USED</div></div></div>' +
    '<table class="pf-lanetable"><thead><tr><th>Lane</th><th>Attempted</th><th>Correct</th><th>Wrong</th><th>Score</th></tr></thead><tbody>' + laneRows + '</tbody></table>' +
    '<div class="pf-filter-row" id="pfFilterRow">' +
    '<button data-f="all" class="active">ALL (' + b.totalQ + ')</button>' +
    '<button data-f="wrong">WRONG (' + att.wrong + ')</button>' +
    '<button data-f="skipped">SKIPPED (' + att.skipped + ')</button>' +
    '<button data-f="correct">CORRECT (' + att.correct + ')</button></div>' +
    '<div id="pfCards">' + cards + '</div>';
  var fr = $('pfFilterRow');
  fr.querySelectorAll('button').forEach(function(btn){
    btn.addEventListener('click', function(){
      fr.querySelectorAll('button').forEach(function(x){ x.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-f');
      $('pfCards').querySelectorAll('.pf-rq').forEach(function(c){
        c.style.display = (f === 'all' || c.getAttribute('data-st') === f) ? '' : 'none';
      });
    });
  });
  $('pfTitle').textContent = att.label + ' — REVIEW';
  $('pfProgress').textContent = '';
  var t = $('pfTimer'); if (t) { t.textContent = '—'; t.classList.remove('low'); }
  var pal = $('pfPal'); if (pal) pal.innerHTML = '';
  var pctr = $('pfPartCtr'); if (pctr) pctr.innerHTML = '';
  var sb = $('pfSubmit');
  sb.classList.remove('armed'); sb.textContent = 'CLOSE REVIEW';
  /* SINGLE-HANDLER INVARIANT: the submit button only ever carries ONE handler,
     and it always lives on the .onclick property. The next restoreSubmit()
     overwrites this close handler cleanly — a clone+addEventListener pair
     survived rebinds and nuked S on the next exam's first submit click. */
  sb.onclick = function(){ closeShell(); restoreSubmit(); };
  var nav = shell.querySelector('.pf-nav'); if (nav) nav.style.display = 'none';
  renderMath(main);
  shell.classList.add('active');
  main.scrollTop = 0;
}
function restoreSubmit(){
  var nav = shell && shell.querySelector('.pf-nav'); if (nav) nav.style.display = '';
  var sb = $('pfSubmit');
  if (sb) { sb.textContent = 'SUBMIT'; sb.classList.remove('armed'); }
  if (sb) sb.onclick = function(){
    if (!S) { closeShell(); return; }
    if (!sb.classList.contains('armed')) {
      sb.classList.add('armed');
      sb.textContent = 'CONFIRM SUBMIT — ' + Object.keys(S.answers).length + '/' + S.bank.totalQ + ' answered';
      setTimeout(function(){ sb.classList.remove('armed'); sb.textContent = 'SUBMIT'; }, 5000);
      return;
    }
    submit(false);
  };
}

var PFVAULT = {
  start: function(bankId){
    var b = banks()[bankId];
    if (!b || !b.questions || !b.questions.length) { toast('Forge bank not ready.'); return; }
    ensureShell();
    S = {
      bank: b, cur: b.questions[0].n,
      answers: {}, marked: {}, visited: {},
      endAt: Date.now() + b.durationSec * 1000
    };
    S.visited[S.cur] = true;
    $('pfTitle').textContent = b.label + ' — LIVE';
    restoreSubmit();
    shell.classList.add('active');
    paint(); paintPal();
    clearInterval(tick);
    tick = setInterval(tickFn, 1000);
    tickFn();
  },
  close: closeShell,
  _grade: pfGrade,
  _natOK: natOK,
  banks: bankList,
  attempts: attemptsFor,
  render: renderVault
};
window.PFVAULT = PFVAULT;

function boot(){
  var COMPANIONS = [
    ['pf-legion-1', 'pfBankLegion1', './paperforge-bank-legion1.js'],
    ['pf-legion-2', 'pfBankLegion2', './paperforge-bank-legion2.js'],
    ['pf-cs-1', 'pfBankCs1', './paperforge-bank-cs1.js'],
    ['pf-oracle-a', 'pfBankOracleA', './paperforge-bank-oracle-a.js'],
    ['pf-oracle-b', 'pfBankOracleB', './paperforge-bank-oracle-b.js'],
    ['pf-oracle-c', 'pfBankOracleC', './paperforge-bank-oracle-c.js']
  ];
  function go(){
    renderVault(); /* mount the vault immediately — shows "Forge bank loading…" until companions arrive */
    COMPANIONS.forEach(function(c){
      if (banks()[c[0]] || $(c[1])) return;
      var s = document.createElement('script');
      s.id = c[1];
      s.src = c[2];
      s.onload = renderVault;
      document.head.appendChild(s);
    });
    renderVault();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
  // vault re-renders whenever the official list re-renders (tab switches)
  if (typeof window.renderSimPaperList === 'function' && !window.renderSimPaperList.__pfWrapped) {
    var orig = window.renderSimPaperList;
    var wrapped = function(){ var r = orig.apply(this, arguments); try { renderVault(); } catch (e) {} return r; };
    wrapped.__pfWrapped = true;
    window.renderSimPaperList = wrapped;
  }
}
boot();
})();
