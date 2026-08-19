/* ============================================================================
   FIGFORGE (ROUND 32) - content-vault inline figure engine.
   Companion ./content-figs.js (window.CONTENT_FIGS) maps each vault doc to
   figure defs {id, anchor, hide, skip, title, cap, svg}. After every vault
   render we locate the anchor heading (fingerprint match, KaTeX-proof),
   then: (a) if the def carries `hide`, the matching legacy ASCII-art
   pre.content-code-block is concealed and the figure lands exactly where
   the sketch used to be; (b) otherwise the figure is inserted `skip`
   blocks after the heading. Idempotent, palette-locked, AI-GENERATED.
   No network beyond the one companion fetch; official notes untouched.
   ============================================================================ */
(function () {
'use strict';
if (typeof document === 'undefined' || !document.addEventListener) return;

var READER_ID = 'contentReader';
var FIG_SEL = '.ff-fig';
var busy = false;
var armTimer = null;

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function currentDoc() {
  var sel = document.getElementById('contentSubject');
  return sel && sel.value ? sel.value : null;
}

function findAnchor(rd, anchorNorm) {
  var hs = rd.querySelectorAll('h1,h2,h3,h4');
  for (var i = 0; i < hs.length; i++) {
    if (norm(hs[i].textContent).indexOf(anchorNorm) >= 0) return hs[i];
  }
  return null;
}

/* first pre.content-code-block after `el` (same flat sibling chain as the
   vault renderer emits) whose text contains `needle`; stop at next h1/h2. */
function findPreAfter(el, needle) {
  var n = el;
  while ((n = n.nextElementSibling)) {
    var tag = n.tagName;
    if (tag === 'H1' || tag === 'H2') return null;
    if (tag === 'PRE' && n.className && String(n.className).indexOf('content-code-block') >= 0) {
      if (needle == null || String(n.textContent).indexOf(needle) >= 0) return n;
    }
  }
  return null;
}

function figHTML(def, num) {
  return '<figure class="ff-fig" data-ff="' + def.id + '" role="img" aria-label="' +
    String(def.title).replace(/"/g, '&quot;') + '">' +
    '<div class="ff-art">' + def.svg + '</div>' +
    '<figcaption><span class="ff-num">FIG ' + num + '</span>' +
    '<span class="ff-title">' + def.title + '</span>' +
    '<span class="ff-ai">AI-GENERATED</span>' +
    '<span class="ff-cap">' + def.cap + '</span></figcaption></figure>';
}

function placeFigure(rd, def, num) {
  if (rd.querySelector('[data-ff="' + def.id + '"]')) return false;
  var el = findAnchor(rd, norm(def.anchor));
  if (!el) return false;
  var html = figHTML(def, num);
  if (def.hide) {
    var pre = findPreAfter(el, def.hide);
    if (pre) {
      pre.setAttribute('data-ff-hidden', def.id);
      pre.insertAdjacentHTML('beforebegin', html);
      return true;
    }
    /* hide target gone (doc edited): fall through to skip placement */
  }
  var node = el;
  var skip = def.skip | 0;
  while (skip-- > 0 && node.nextElementSibling) node = node.nextElementSibling;
  node.insertAdjacentHTML('afterend', html);
  return true;
}

function inject() {
  if (busy) return;
  var rd = document.getElementById(READER_ID);
  if (!rd) return;
  var figs = window.CONTENT_FIGS;
  if (!figs || !figs.docs) return;
  var doc = currentDoc();
  if (!doc) return;
  var defs = figs.docs[doc];
  if (!defs || !defs.length) return;
  busy = true;
  try {
    for (var i = 0; i < defs.length; i++) placeFigure(rd, defs[i], i + 1);
    /* numbering follows READING order, not anchor-table authoring order */
    var nums = rd.querySelectorAll('.ff-fig .ff-num');
    for (var n = 0; n < nums.length; n++) nums[n].textContent = 'FIG ' + (n + 1);
  } catch (e) { /* never break the vault */ }
  busy = false;
}

function armObserver(rd) {
  if (typeof MutationObserver === 'undefined' || !rd || rd.__ffObserved) return;
  rd.__ffObserved = true;
  var mo = new MutationObserver(function (recs) {
    if (busy) return;
    var oursOnly = true;
    for (var i = 0; i < recs.length; i++) {
      var add = recs[i].addedNodes;
      for (var j = 0; j < add.length; j++) {
        var n = add[j];
        if (!(n.nodeType === 1 && n.matches && n.matches(FIG_SEL))) { oursOnly = false; break; }
      }
      if (!oursOnly) break;
    }
    if (oursOnly) return;
    if (armTimer) clearTimeout(armTimer);
    armTimer = setTimeout(inject, 30);
  });
  mo.observe(rd, { childList: true });
}

function loadCompanion(onReady) {
  if (window.CONTENT_FIGS && window.CONTENT_FIGS.docs) { onReady(); return; }
  if (document.getElementById('cfBankFigs')) return;
  var s = document.createElement('script');
  s.id = 'cfBankFigs';
  s.src = './content-figs.js';
  s.onload = function () { inject(); };
  document.head.appendChild(s);
}

function boot() {
  var rd = document.getElementById(READER_ID);
  if (!rd) {
    /* vault not built yet: try again shortly (boot order safe) */
    setTimeout(boot, 120);
    return;
  }
  armObserver(rd);
  loadCompanion(inject);
  inject();
  /* also re-run on subject change even if a re-render did not mutate (cached) */
  var sel = document.getElementById('contentSubject');
  if (sel && !sel.__ffWired) {
    sel.__ffWired = true;
    sel.addEventListener('change', function () { setTimeout(inject, 60); });
  }
}

window.FFORGE = { inject: inject, version: 1 };

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
