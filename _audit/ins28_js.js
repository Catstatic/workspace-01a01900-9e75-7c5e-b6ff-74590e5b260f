/* ============================================================================
   ROUND 30 — INKSTONE (part 2: brain) — content-section annotation layer
   Highlight passages, pin margin notes to any word/point, bookmark blocks.
   Anchors are text-fingerprint based (prefix + exact + suffix), so marks
   survive vault re-renders and reloads. State lives in ink:* localStorage
   keys, so annotations RIDE the regular full-backup sweep (user content).
   ============================================================================ */
(function () {
'use strict';
if (typeof document === 'undefined' || !document.addEventListener) return;

var COLORS = ['amber', 'teal', 'rose', 'violet'];
var BLOCK_SEL = 'h1,h2,h3,h4,p,li,pre,table,blockquote,tr,div.content-math-block';
var READER_ID = 'contentReader';

var curDoc = null;
var annos = [];
var pendingRange = null;
var pendingEdit = null;   /* anno or null while popover open over a fresh range */
var applyGuard = false;
var lastSig = '';
var fabBlock = null;

/* ------------------------------ storage ------------------------------ */
function LSK() { return 'ink:d:' + curDoc; }
function loadAnnos() {
  try { annos = JSON.parse(localStorage.getItem(LSK()) || '[]'); }
  catch (e) { annos = []; }
  if (!Array.isArray(annos)) annos = [];
}
function saveAnnos() {
  try { localStorage.setItem(LSK(), JSON.stringify(annos)); } catch (e) {}
  paintDrawerCount();
}
function uid() { return 'a' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }

function reader() { return document.getElementById(READER_ID); }

/* ------------------------------ text corpus + anchoring ------------------------------ */
function textNodes(root) {
  var out = [];
  var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      if (!n.nodeValue || !/\S/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
      var p = n.parentNode;
      while (p && p !== root) {
        var cn = typeof p.className === 'string' ? p.className : '';
        if (cn.indexOf('MathML') >= 0) return NodeFilter.FILTER_REJECT;
        if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
        if (p.getAttribute && p.getAttribute('aria-hidden') === 'true') return NodeFilter.FILTER_REJECT;
        p = p.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var n;
  while ((n = w.nextNode())) out.push(n);
  return out;
}
function buildCorpus() {
  var nodes = textNodes(reader());
  var text = '', offs = [];
  nodes.forEach(function (nd) { offs.push(text.length); text += nd.nodeValue; });
  return { nodes: nodes, offs: offs, text: text };
}
function resolveAnno(a, corpus) {
  /* fuzzy find: every exact occurrence scored by prefix/suffix agreement */
  var idxs = [], at = -1;
  while ((at = corpus.text.indexOf(a.exact, at + 1)) >= 0) idxs.push(at);
  if (!idxs.length) return null;
  var best = idxs[0], bestScore = -1;
  idxs.forEach(function (i) {
    var pre = corpus.text.slice(Math.max(0, i - a.prefix.length), i);
    var post = corpus.text.slice(i + a.exact.length, i + a.exact.length + a.suffix.length);
    var s = 0, k;
    for (k = 0; k < Math.min(pre.length, a.prefix.length); k++) if (pre[pre.length - 1 - k] === a.prefix[a.prefix.length - 1 - k]) s++; else break;
    for (k = 0; k < Math.min(post.length, a.suffix.length); k++) if (post[k] === a.suffix[k]) s++; else break;
    if (s > bestScore) { bestScore = s; best = i; }
  });
  return { start: best, end: best + a.exact.length };
}
function wrapRange(corpus, start, end, anno) {
  applyGuard = true;
  var cls = 'ink-hl c-' + (anno.color || 'amber') + (anno.type === 'note' ? ' ink-note-mk' : '');
  for (var i = 0; i < corpus.nodes.length; i++) {
    var n0 = corpus.offs[i], n1 = n0 + corpus.nodes[i].nodeValue.length;
    if (n1 <= start || n0 >= end) continue;
    var node = corpus.nodes[i];
    var sOff = Math.max(0, start - n0), eOff = node.nodeValue.length - Math.max(0, n1 - end);
    var r = document.createRange();
    try {
      r.setStart(node, sOff); r.setEnd(node, eOff);
      var span = document.createElement('span');
      span.className = cls; span.setAttribute('data-ink', anno.id);
      r.surroundContents(span);
    } catch (e) { /* non-wrappable slice (markup boundary) — skip gracefully */ }
  }
  applyGuard = false;
}
function applyAnnos() {
  if (!curDoc || !reader()) return;
  var corpus = buildCorpus();
  lastSig = curDoc + '|' + corpus.text.length + '|' + corpus.text.slice(0, 48) + '|' + corpus.text.slice(-48);
  annos.slice().sort(function (a, b) { return a.created - b.created; }).forEach(function (a) {
    if (a.type === 'mark') return; /* bookmarks render via gutter, not spans */
    var pos = resolveAnno(a, corpus);
    if (pos) wrapRange(corpus, pos.start, pos.end, a);
  });
  syncBookedClasses(corpus);
}
function syncBookedClasses(corpus) {
  var r = reader();
  var olds = r.querySelectorAll('.ink-booked');
  for (var i = 0; i < olds.length; i++) olds[i].classList.remove('ink-booked');
  annos.forEach(function (a) {
    if (a.type !== 'mark') return;
    var pos = resolveAnno(a, corpus);
    if (!pos) return;
    var node = nodeAt(corpus, pos.start);
    if (!node) return;
    var blk = node.parentNode && node.parentNode.closest ? node.parentNode.closest(BLOCK_SEL) : null;
    if (blk) blk.classList.add('ink-booked');
  });
}
function nodeAt(corpus, off) {
  for (var i = 0; i < corpus.nodes.length; i++) {
    var n0 = corpus.offs[i], n1 = n0 + corpus.nodes[i].nodeValue.length;
    if (off >= n0 && off < n1) return corpus.nodes[i];
  }
  return corpus.nodes[corpus.nodes.length - 1] || null;
}

/* ------------------------------ selection capture ------------------------------ */
function selectionRangeInReader() {
  var sel = window.getSelection ? window.getSelection() : null;
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  var r = sel.getRangeAt(0);
  var rd = reader();
  if (!rd) return null;
  if (!rd.contains(r.commonAncestorContainer)) return null;
  if (!r.toString() || !r.toString().trim()) return null;
  return r;
}

/* ------------------------------ floating UI ------------------------------ */
var toolbar, pop, fab, drawer, drawerBtn, drawerFilter = 'all';

function el(tag, cls, txt) {
  var d = document.createElement(tag);
  if (cls) d.className = cls;
  if (txt !== undefined) d.textContent = txt;
  return d;
}

function buildUI() {
  /* selection toolbar */
  toolbar = el('div', ''); toolbar.id = 'inkToolbar';
  COLORS.forEach(function (c, i) {
    var b = el('button', 'ink-dot c-' + c);
    b.type = 'button'; b.title = 'Highlight (' + c + ')';
    b.addEventListener('click', function (ev) { ev.preventDefault(); commitAnno('hl', c, ''); });
    toolbar.appendChild(b);
  });
  var sep = el('span', '', '·'); toolbar.appendChild(sep);
  var nb = el('button', 'ink-act', '📝 NOTE'); nb.type = 'button';
  nb.addEventListener('click', function (ev) { ev.preventDefault(); openPop(null, true); });
  toolbar.appendChild(nb);
  var xb = el('button', 'ink-x', '✕'); xb.type = 'button';
  xb.addEventListener('click', function (ev) { ev.preventDefault(); hideToolbar(); });
  toolbar.appendChild(xb);
  document.body.appendChild(toolbar);

  /* note popover */
  pop = el('div', ''); pop.id = 'inkPop';
  pop.innerHTML =
    '<div class="inkp-kicker">MARGIN NOTE</div>' +
    '<div class="inkp-quote" id="inkpQuote"></div>' +
    '<div class="inkp-colors">' + COLORS.map(function (c) { return '<button type="button" class="ink-dot c-' + c + '" data-c="' + c + '"></button>'; }).join('') + '</div>' +
    '<textarea id="inkpText" placeholder="your note for this point…"></textarea>' +
    '<div class="inkp-row"><button type="button" class="inkp-del" id="inkpDel">DELETE</button>' +
    '<button type="button" class="inkp-save" id="inkpSave">SAVE</button></div>';
  document.body.appendChild(pop);
  pop.querySelectorAll('.ink-dot').forEach(function (d) {
    d.addEventListener('click', function () {
      pop.querySelectorAll('.ink-dot').forEach(function (x) { x.classList.remove('sel'); });
      d.classList.add('sel');
    });
  });
  pop.querySelector('#inkpSave').addEventListener('click', function () {
    var txt = pop.querySelector('#inkpText').value.trim();
    var colorEl = pop.querySelector('.ink-dot.sel');
    var color = colorEl ? colorEl.getAttribute('data-c') : 'amber';
    if (pendingEdit) {
      pendingEdit.note = txt;
      pendingEdit.color = color;
      pendingEdit.type = txt ? 'note' : 'hl';
      saveAnnos(); reapply(); paintDrawer();
    } else {
      commitAnno(txt ? 'note' : 'hl', color, txt);
    }
    hidePop();
  });
  pop.querySelector('#inkpDel').addEventListener('click', function () {
    if (pendingEdit) { removeAnno(pendingEdit.id); }
    hidePop(); hideToolbar();
  });

  /* bookmark fab */
  fab = el('button', '', '🔖'); fab.id = 'inkBookFab'; fab.type = 'button'; fab.title = 'bookmark this block';
  fab.addEventListener('click', function (ev) { ev.preventDefault(); toggleBookmark(); });
  document.body.appendChild(fab);

  /* manager drawer + its vault-controls button */
  var controls = document.querySelector('.content-vault-controls');
  drawerBtn = el('button', '', '✎ NOTES'); drawerBtn.type = 'button'; drawerBtn.id = 'inkDrawerBtn';
  drawerBtn.title = 'annotation manager — highlights, notes, bookmarks';
  drawerBtn.addEventListener('click', function () {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if (controls) controls.appendChild(drawerBtn);

  drawer = el('div', ''); drawer.id = 'inkDrawer';
  drawer.innerHTML =
    '<div class="inkd-head"><div class="inkd-kicker">INKSTONE — ANNOTATIONS</div><div class="inkd-title" id="inkdDoc"></div></div>' +
    '<div class="inkd-filters">' +
      '<button type="button" class="inkd-f on" data-f="all">ALL</button>' +
      '<button type="button" class="inkd-f" data-f="hl">HIGHLIGHTS</button>' +
      '<button type="button" class="inkd-f" data-f="note">NOTES</button>' +
      '<button type="button" class="inkd-f" data-f="mark">BOOKMARKS</button>' +
    '</div>' +
    '<div class="inkd-list" id="inkdList"></div>' +
    '<div class="inkd-foot">marks ride your normal full backup · ink:* keys</div>';
  document.body.appendChild(drawer);
  drawer.querySelectorAll('.inkd-f').forEach(function (f) {
    f.addEventListener('click', function () {
      drawerFilter = f.getAttribute('data-f');
      drawer.querySelectorAll('.inkd-f').forEach(function (x) { x.classList.toggle('on', x === f); });
      paintDrawer();
    });
  });
}
function paintDrawerCount() {
  if (!drawerBtn) return;
  drawerBtn.textContent = '✎ NOTES' + (annos.length ? ' (' + annos.length + ')' : '');
}

/* ------------------------------ toolbar show/hide ------------------------------ */
function placeAbs(node, rect) {
  var sx = window.pageXOffset || 0, sy = window.pageYOffset || 0;
  node.style.left = Math.max(8, rect.left + sx + rect.width / 2 - 90) + 'px';
  node.style.top = Math.max(8, rect.top + sy - 46) + 'px';
}
function showToolbarFor(range) {
  pendingRange = range;
  var rect;
  try { rect = range.getBoundingClientRect(); } catch (e) { rect = { left: 0, top: 0, width: 0 }; }
  placeAbs(toolbar, rect);
  toolbar.style.display = 'flex';
}
function hideToolbar() { toolbar.style.display = 'none'; pendingRange = null; clearSel(); }
function clearSel() { try { var s = window.getSelection(); if (s) s.removeAllRanges(); } catch (e) {} }

/* ------------------------------ popover ------------------------------ */
function openPop(anno, freshFromSelection) {
  pendingEdit = anno || null;
  pop.querySelector('#inkpText').value = anno ? (anno.note || '') : '';
  pop.querySelector('#inkpQuote').textContent = anno ? clip(anno.exact, 90) : clip(pendingRange ? pendingRange.toString() : '', 90);
  pop.querySelectorAll('.ink-dot').forEach(function (d) {
    d.classList.toggle('sel', d.getAttribute('data-c') === (anno ? anno.color : 'amber'));
  });
  pop.querySelector('#inkpDel').style.visibility = anno ? 'visible' : 'hidden';
  var rect;
  if (anno) {
    var mark = reader().querySelector('[data-ink="' + anno.id + '"]');
    try { rect = mark && mark.getBoundingClientRect ? mark.getBoundingClientRect() : { left: 0, top: 0, width: 0 }; } catch (e) { rect = { left: 0, top: 0, width: 0 }; }
  } else {
    try { rect = pendingRange.getBoundingClientRect(); } catch (e2) { rect = { left: 0, top: 0, width: 0 }; }
  }
  placeAbs(pop, rect);
  pop.style.display = 'block';
  toolbar.style.display = 'none';
}
function hidePop() { pop.style.display = 'none'; pendingEdit = null; if (!pendingRange) clearSel(); }
function clip(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; }

/* ------------------------------ CRUD ------------------------------ */
function commitAnno(type, color, note) {
  if (!pendingRange) return;
  var corpus = buildCorpus();
  var sel = textOffsetsOfRange(corpus, pendingRange);
  if (!sel) { hideToolbar(); return; }
  var exact = corpus.text.slice(sel.start, sel.end);
  if (!exact.trim()) { hideToolbar(); return; }
  annos.push({
    id: uid(), type: type, color: color, note: note || '',
    exact: exact,
    prefix: corpus.text.slice(Math.max(0, sel.start - 32), sel.start),
    suffix: corpus.text.slice(sel.end, sel.end + 32),
    created: Date.now()
  });
  saveAnnos(); reapply(); paintDrawer();
  hideToolbar(); hidePop();
}
function textOffsetsOfRange(corpus, range) {
  /* locate start/end containers inside the corpus nodes */
  var sOff = -1, eOff = -1;
  for (var i = 0; i < corpus.nodes.length; i++) {
    if (corpus.nodes[i] === range.startContainer) sOff = corpus.offs[i] + range.startOffset;
    if (corpus.nodes[i] === range.endContainer) eOff = corpus.offs[i] + range.endOffset;
  }
  if (sOff < 0 || eOff < 0) return null;
  return sOff <= eOff ? { start: sOff, end: eOff } : { start: eOff, end: sOff };
}
function removeAnno(id) {
  annos = annos.filter(function (a) { return a.id !== id; });
  saveAnnos();
  var marks = reader().querySelectorAll('[data-ink="' + id + '"]');
  for (var i = 0; i < marks.length; i++) unwrap(marks[i]);
  syncBookedClasses(buildCorpus());
  paintDrawer();
}
function unwrap(span) {
  applyGuard = true;
  var p = span.parentNode;
  while (span.firstChild) p.insertBefore(span.firstChild, span);
  p.removeChild(span);
  p.normalize();
  applyGuard = false;
}
function reapply() {
  annos.forEach(function (a) {
    var marks = reader().querySelectorAll('[data-ink="' + a.id + '"]');
    for (var i = 0; i < marks.length; i++) unwrap(marks[i]);
  });
  applyAnnos();
}

/* ------------------------------ bookmarks ------------------------------ */
function toggleBookmark() {
  if (!fabBlock || !curDoc) return;
  var txt = clip(fabBlock.textContent, 90);
  if (!txt) return;
  var existing = annos.filter(function (a) { return a.type === 'mark' && clip(a.exact, 90) === txt; })[0];
  if (existing) { removeAnno(existing.id); }
  else {
    var corpus = buildCorpus();
    /* anchor = distinct block snippet; resolve targets its first occurrence */
    annos.push({ id: uid(), type: 'mark', color: 'teal', note: '', exact: txt, prefix: '', suffix: '', created: Date.now() });
    saveAnnos(); syncBookedClasses(corpus); paintDrawer();
  }
  paintFab();
}
function paintFab() {
  if (!fabBlock) { fab.style.display = 'none'; return; }
  var rect;
  try { rect = fabBlock.getBoundingClientRect(); } catch (e) { fab.style.display = 'none'; return; }
  if (rect.width === 0 && rect.height === 0 && !fabBlock.textContent.trim()) { fab.style.display = 'none'; return; }
  var sx = window.pageXOffset || 0, sy = window.pageYOffset || 0;
  fab.style.left = Math.max(4, rect.left + sx - 30) + 'px';
  fab.style.top = (rect.top + sy) + 'px';
  var txt = clip(fabBlock.textContent, 90);
  var marked = annos.some(function (a) { return a.type === 'mark' && clip(a.exact, 90) === txt; });
  fab.classList.toggle('marked', marked);
  fab.style.display = 'flex';
}

/* ------------------------------ drawer ------------------------------ */
function openDrawer() {
  var t = drawer.querySelector('#inkdDoc');
  var sel = document.getElementById('contentSubject');
  var label = sel && sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent : (curDoc || '');
  t.textContent = label;
  drawer.classList.add('open');
  paintDrawer();
}
function closeDrawer() { drawer.classList.remove('open'); }
function paintDrawer() {
  if (!drawer.classList.contains('open')) { paintDrawerCount(); return; }
  var list = drawer.querySelector('#inkdList');
  list.innerHTML = '';
  var rows = annos.filter(function (a) { return drawerFilter === 'all' ? true : a.type === drawerFilter; });
  paintDrawerCount();
  if (!rows.length) { list.appendChild(el('div', 'inkd-empty', 'nothing annotated yet — select text to highlight or note')); return; }
  rows.slice().sort(function (a, b) { return b.created - a.created; }).forEach(function (a) {
    var item = el('div', 'inkd-item');
    item.style.borderLeftColor = ({ amber: '#f5b83d', teal: '#2dd4bf', rose: '#fb7185', violet: '#a78bfa' })[a.color] || '#2dd4bf';
    var body = el('div', 'inkd-body');
    body.appendChild(el('div', 'inkd-q', (a.type === 'mark' ? '🔖 ' : a.type === 'note' ? '📝 ' : '🖍 ') + clip(a.exact, 140)));
    if (a.note) body.appendChild(el('div', 'inkd-n', clip(a.note, 120)));
    var meta = ({ hl: 'HIGHLIGHT', note: 'NOTE', mark: 'BOOKMARK' })[a.type] + ' · ' + new Date(a.created).toLocaleDateString();
    body.appendChild(el('div', 'inkd-meta', meta));
    var del = el('button', 'inkd-x', '✕'); del.type = 'button'; del.title = 'delete';
    del.addEventListener('click', function (ev) { ev.stopPropagation(); removeAnno(a.id); });
    item.appendChild(body); item.appendChild(del);
    item.addEventListener('click', function () { jumpTo(a); });
    list.appendChild(item);
  });
}
function jumpTo(a) {
  var corpus = buildCorpus();
  var pos = resolveAnno(a, corpus);
  if (!pos) return;
  var node = nodeAt(corpus, pos.start);
  if (!node || !node.parentNode) return;
  var host = a.type === 'mark' ? (node.parentNode.closest(BLOCK_SEL) || node.parentNode) : (node.parentNode.closest('[data-ink="' + a.id + '"]') || node.parentNode);
  if (host && typeof host.scrollIntoView === 'function') host.scrollIntoView({ block: 'center', behavior: 'smooth' });
  corpus.nodes && canvasFlash(a.id, host);
}
function canvasFlash(id, host) {
  var marks = reader().querySelectorAll('[data-ink="' + id + '"]');
  var targets = marks.length ? marks : [host];
  [].forEach.call(targets, function (t) {
    if (!t || !t.classList) return;
    t.classList.add('ink-flash');
    setTimeout(function () { t.classList.remove('ink-flash'); }, 1200);
  });
}

/* ------------------------------ event wiring ------------------------------ */
document.addEventListener('mouseup', function (e) {
  var t = e.target;
  if (t && t.closest && t.closest('#inkToolbar,#inkPop,#inkDrawer,#inkBookFab')) return;
  if (pop && pop.style.display === 'block') { /* keep popover until its own buttons act */ }
  var r = selectionRangeInReader();
  if (r) {
    /* close popover only when starting a NEW selection */
    if (pop.style.display === 'block' && !pendingEdit) hidePop();
    showToolbarFor(r);
  } else {
    if (pop && pop.style.display === 'block') return;
    hideToolbarSilently();
  }
}, true);
function hideToolbarSilently() { toolbar.style.display = 'none'; pendingRange = null; }

document.addEventListener('click', function (e) {
  var t = e.target;
  var mark = t && t.closest ? t.closest('.ink-hl[data-ink]') : null;
  if (mark && reader().contains(mark)) {
    var id = mark.getAttribute('data-ink');
    var anno = annos.filter(function (a) { return a.id === id; })[0];
    if (anno) { openPop(anno, false); }
    return;
  }
  if (t && t.closest && !t.closest('#inkToolbar,#inkPop,#inkDrawer,#inkBookFab,#inkDrawerBtn')) {
    if (pop.style.display === 'block') hidePop();
    if (drawer && drawer.classList.contains('open') && !t.closest('.content-vault-controls')) closeDrawer();
  }
}, true);

/* bookmark fab follows hovered blocks inside the reader */
var mvRaf = false;
document.addEventListener('mousemove', function (e) {
  if (mvRaf) return;
  mvRaf = true;
  var x = e.clientX, y = e.clientY;
  setTimeout(function () {
    mvRaf = false;
    var rd = reader();
    if (!rd) return;
    var under = document.elementFromPoint ? document.elementFromPoint(x, y) : null;
    if (!under || !rd.contains(under)) { fabBlock = null; fab.style.display = 'none'; return; }
    if (under.closest && under.closest('#inkToolbar,#inkPop,#inkDrawer,#inkBookFab')) return;
    var blk = under.closest ? under.closest(BLOCK_SEL) : null;
    fabBlock = (blk && rd.contains(blk)) ? blk : null;
    paintFab();
  }, 30);
}, true);
document.addEventListener('scroll', function () { if (fabBlock) paintFab(); }, true);

/* re-apply when the vault re-renders (childList/characterData only) */
var moTimer = null;
function armObserver() {
  var rd = reader();
  if (!rd || typeof MutationObserver === 'undefined') return;
  var mo = new MutationObserver(function () {
    if (applyGuard) return;
    clearTimeout(moTimer);
    moTimer = setTimeout(function () {
      var corpus = buildCorpus();
      var sig = curDoc + '|' + corpus.text.length + '|' + corpus.text.slice(0, 48) + '|' + corpus.text.slice(-48);
      var missing = annos.some(function (a) {
        return a.type !== 'mark' && reader().querySelectorAll('[data-ink="' + a.id + '"]').length === 0;
      });
      if (sig !== lastSig || missing) applyAnnos();
    }, 140);
  });
  mo.observe(rd, { childList: true, characterData: true, subtree: true });
}

/* react to subject changes */
function syncDoc() {
  var sel = document.getElementById('contentSubject');
  var v = sel ? sel.value : null;
  if (v && v !== curDoc) { curDoc = v; loadAnnos(); applyAnnos(); paintDrawerCount(); if (drawer && drawer.classList.contains('open')) paintDrawer(); }
}
document.addEventListener('change', function (e) {
  if (e.target && e.target.id === 'contentSubject') setTimeout(syncDoc, 40);
}, true);
document.addEventListener('input', function (e) {
  if (e.target && e.target.id === 'contentSearch') setTimeout(function () { /* observer covers it */ }, 60);
}, true);

/* ------------------------------ boot ------------------------------ */
function boot() {
  if (document.getElementById('inkToolbar')) return;
  buildUI();
  syncDoc();
  armObserver();
  paintDrawerCount();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
boot();
/* the vault can inject asynchronously in some boot paths — retry quietly */
setTimeout(function () { if (!curDoc) syncDoc(); }, 800);
setTimeout(function () { if (!curDoc) syncDoc(); }, 2500);

window.INKSTONE = {
  counts: function () { return { doc: curDoc, annos: annos.length }; },
  list: function () { return annos.slice(); },
  removeAll: function () { annos.slice().forEach(function (a) { removeAnno(a.id); }); },
  reapply: reapply,
  markBlock: function (b) { fabBlock = b; toggleBookmark(); },
  ui: function () { return { toolbar: toolbar, pop: pop, fab: fab, drawer: drawer, drawerBtn: drawerBtn }; }
};
})();
