/* smoke36 (jsdom) — ROUND 30 INKSTONE: selection toolbar, 4-color highlights,
   margin notes (create/edit/delete), bookmark blocks, manager drawer,
   fingerprint re-anchoring across re-renders, persistence in ink:* keys,
   click-outside collapse. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c) { passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const js = fs.readFileSync('/home/user/_audit/ins28_js.js', 'utf8');
const css = fs.readFileSync('/home/user/_audit/ins28_css.css', 'utf8');

const IGNORE = ['HTMLMediaElement', 'scrollIntoView', 'CSS parsing', 'getBoundingClientRect', 'Could not parse CSS'];
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { const m = String(e && e.message || e); if (!IGNORE.some(x => m.indexOf(x) >= 0)) errors.push(m); });

const CONTENT = '<h2>Hamiltonian Notes</h2><p>The Hamiltonian governs time evolution of every closed system.</p>' +
  '<p>Noether attaches a conserved charge to each continuous symmetry of the action.</p>' +
  '<p>Canonical quantisation promotes the bracket into a commutator with i hbar.</p>';
const html = '<!DOCTYPE html><html><head><style>' + css + '</style></head><body>' +
  '<div class="content-vault-controls"><select id="contentSubject"><option value="qm.md">Quantum Mechanics</option><option value="cm.md">Classical Mechanics</option></select>' +
  '<input id="contentSearch"></div>' +
  '<article id="contentReader">' + CONTENT + '</article>' +
  '</body></html>';

const dom = new JSDOM(html, { url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc, pretendToBeVisual: true });
const w = dom.window, doc = w.document;
w.eval(js);
const reader = () => doc.getElementById('contentReader');
const INK = w.INKSTONE;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function selectText(needle, offsetStart, len) {
  const rd = reader();
  const corpus = (function () { let t = ''; const nodes = []; const wk = doc.createTreeWalker(rd, w.NodeFilter.SHOW_TEXT, null); let n; while (n = wk.nextNode()) { nodes.push({ n, s: t.length }); t += n.nodeValue; } return { nodes, text: t }; })();
  const at = corpus.text.indexOf(needle);
  if (at < 0) throw new Error('needle not found: ' + needle);
  const start = at + (offsetStart || 0), end = start + (len || needle.length);
  let sN, eN, sO, eO;
  corpus.nodes.forEach(x => {
    if (start >= x.s && start <= x.s + x.n.nodeValue.length) { sN = x.n; sO = start - x.s; }
    if (end >= x.s && end <= x.s + x.n.nodeValue.length) { eN = x.n; eO = end - x.s; }
  });
  const r = doc.createRange();
  r.setStart(sN, sO); r.setEnd(eN, eO);
  const sel = w.getSelection();
  sel.removeAllRanges(); sel.addRange(r);
  sN.parentNode.dispatchEvent(new w.MouseEvent('mouseup', { bubbles: true, cancelable: true }));
  return r;
}

(async () => {
  await sleep(60);
  ok(!!INK, 'INKSTONE exported');
  ok(INK.counts().doc === 'qm.md', 'bound to current vault doc (qm.md)');
  ok(!!doc.getElementById('inkDrawerBtn'), 'NOTES button injected into vault controls');

  /* ---- highlight flow ---- */
  selectText('governs time evolution');
  ok(doc.getElementById('inkToolbar').style.display === 'flex', 'selection pops the floating toolbar');
  doc.querySelectorAll('#inkToolbar .ink-dot')[1].click();           // teal
  ok(reader().querySelectorAll('.ink-hl.c-teal[data-ink]').length >= 1, 'teal highlight mark rendered');
  ok(INK.list().length === 1 && INK.list()[0].type === 'hl', 'annotation stored as highlight');
  ok((w.localStorage.getItem('ink:d:qm.md') || '').indexOf('governs time evolution') >= 0, 'fingerprint persisted to ink:d:qm.md');
  ok(doc.getElementById('inkToolbar').style.display === 'none', 'toolbar hides after applying');

  /* ---- note flow ---- */
  selectText('continuous symmetry');
  doc.querySelector('#inkToolbar .ink-act').click();
  ok(doc.getElementById('inkPop').style.display === 'block', 'NOTE opens the editor popover');
  ok(doc.getElementById('inkpQuote').textContent.indexOf('continuous symmetry') >= 0, 'popover quotes the anchor');
  doc.getElementById('inkpText').value = 'charge per symmetry — exam loves this';
  doc.getElementById('inkpSave').click();
  ok(INK.list().length === 2 && INK.list()[1].type === 'note', 'note annotation stored');
  ok(reader().querySelectorAll('.ink-note-mk').length >= 1, 'note marker (dotted) rendered inline');

  /* ---- edit + delete via mark click ---- */
  const markEl = reader().querySelector('.ink-note-mk');
  markEl.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  ok(doc.getElementById('inkPop').style.display === 'block', 'clicking a mark reopens the editor');
  ok(doc.getElementById('inkpText').value.indexOf('exam loves') >= 0, 'editor pre-filled with existing note');
  doc.getElementById('inkpDel').click();
  ok(INK.list().length === 1, 'delete removes the note annotation');
  ok(reader().querySelectorAll('.ink-note-mk').length === 0, 'note marker unwrapped from DOM');

  /* ---- bookmark via test hook (elementFromPoint is not a jsdom thing) ---- */
  const p2 = reader().querySelectorAll('p')[1];
  INK.markBlock(p2);
  ok(INK.list().length === 2 && INK.list()[1].type === 'mark', 'bookmark stored');
  ok(p2.classList.contains('ink-booked'), 'bookmarked block got the teal spine class');
  INK.markBlock(p2); // toggle off
  ok(INK.list().length === 1, 'bookmark toggles off on repeat');

  /* ---- re-render resilience (vault re-renders same content on search) ---- */
  reader().innerHTML = CONTENT;
  await sleep(240);
  ok(reader().querySelectorAll('.ink-hl.c-teal[data-ink]').length >= 1, 'highlight re-anchored after full re-render');
  reader().innerHTML = '<p>totally fresh content loses the anchor</p>' + CONTENT;
  await sleep(240);
  ok(reader().querySelectorAll('.ink-hl.c-teal[data-ink]').length >= 1, 'fuzzy anchor survives upstream content edits');

  /* ---- drawer ---- */
  doc.getElementById('inkDrawerBtn').click();
  ok(doc.getElementById('inkDrawer').classList.contains('open'), 'drawer opens');
  ok(doc.querySelectorAll('#inkdList .inkd-item').length === 1, 'drawer lists the remaining highlight');
  ok((doc.getElementById('inkDrawerBtn').textContent || '').indexOf('(1)') >= 0, 'button badge shows count');
  const before = INK.list().length;
  doc.querySelector('#inkdList .inkd-x').click();
  ok(INK.list().length === before - 1, 'drawer delete works');
  doc.body.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  ok(!doc.getElementById('inkDrawer').classList.contains('open'), 'click-outside collapses drawer');

  /* ---- doc switch isolation ---- */
  doc.getElementById('contentSubject').value = 'cm.md';
  doc.getElementById('contentSubject').dispatchEvent(new w.Event('change', { bubbles: true }));
  await sleep(120);
  ok(INK.counts().doc === 'cm.md' && INK.list().length === 0, 'annotations are per-doc (cm.md has none)');

  ok(errors.length === 0, 'no unexpected jsdom page errors' + (errors.length ? ' :: ' + errors[0] : ''));
  console.log('smoke36: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
