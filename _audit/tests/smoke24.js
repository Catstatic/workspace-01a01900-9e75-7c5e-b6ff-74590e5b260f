/* SMOKE24 — FOCUSFRAME (R27) full jsdom integration:
   mounts the real masters into a content-vault fixture, drives drags via
   synthetic pointer events, and proves the user's red line (computed text
   colors identical with the feature ON vs OFF) plus every spec behavior. */
'use strict';
const fs = require('fs');
const { JSDOM } = require('jsdom');
let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) { pass++; } else { fail++; console.log('  FAIL:', msg); } };

const CSS = fs.readFileSync('/home/user/_audit/ins25_css.css', 'utf8').trim();
const JS  = fs.readFileSync('/home/user/_audit/ins25_js.js', 'utf8').trim();
const PROJECT = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');

const words = n => Array(n).fill('w').join(' ');
const FIXTURE =
`<div class="content-vault-controls">
  <select id="contentSubject"><option value="alpha.md" selected>Alpha</option><option value="beta.md">Beta</option></select>
  <input id="contentSearch">
  <button id="contentTextSmaller">A−</button><button id="contentTextLarger">A+</button>
</div>
<article id="contentReader" class="content-vault-reader">
  <div class="content-vault-status">ALPHA · 9k characters · local content</div>
  <p id="blk0">${words(100)}</p>
  <h2 id="blk1">Thermal Physics</h2>
  <p id="blk2">${words(120)}<span class="katex-display"></span></p>
  <div id="blk3" class="worked-example">${words(40)}</div>
  <figure id="blk4"><img src="x.png"><figcaption>Orbital decay plot</figcaption></figure>
</article>`;

const dom = new JSDOM(
  '<!DOCTYPE html><html><head><style>' + CSS + '\n#blk1{color:rgb(255, 26, 40)}\n</style></head><body>' + FIXTURE + '</body></html>',
  { url: 'https://focusframe.test/', pretendToBeVisual: true, runScripts: 'outside-only' }
);
const win = dom.window, doc = win.document;
const toasts = []; win.showToast = m => toasts.push(String(m));

/* deterministic geometry (jsdom has no layout) */
const reader = doc.getElementById('contentReader');
const TOPS = [100, 205, 260, 390, 480], HGTS = [100, 40, 120, 80, 60];
['blk0','blk1','blk2','blk3','blk4'].forEach((id, i) => {
  const el = doc.getElementById(id);
  Object.defineProperty(el, 'offsetTop', { value: TOPS[i], configurable: true });
  Object.defineProperty(el, 'offsetHeight', { value: HGTS[i], configurable: true });
});
const statusRow = reader.querySelector('.content-vault-status');
Object.defineProperty(statusRow, 'offsetTop', { value: 0, configurable: true });
Object.defineProperty(statusRow, 'offsetHeight', { value: 40, configurable: true });
reader.getBoundingClientRect = () => ({ top: 0, left: 0, right: 800, bottom: 600, width: 800, height: 600 });

win.eval(JS);
const FG = win.__focusframe;
const D = FG._debug;
const $ = id => doc.getElementById(id);
const pev = (type, el, y) => el.dispatchEvent(new win.MouseEvent(type, { bubbles: true, cancelable: true, clientY: y }));
const key = (el, k, extra) => el.dispatchEvent(new win.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true, cancelable: true }, extra)));

/* ---- boot ---- */
ok($('fgToggleBtn') !== null, 'toggle button injected into vault controls');
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'false', 'starts OFF');

/* ---- the RED LINE: computed text color baseline ---- */
const colorBefore = win.getComputedStyle($('blk1')).color;
ok(colorBefore === 'rgb(255, 26, 40)', 'fixture painter sanity: heading is red before toggle');

/* ---- enable via button ---- */
$('fgToggleBtn').dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'true', 'toggle ON');
ok(reader.classList.contains('fg-armed'), 'reader armed');
ok(doc.querySelectorAll('.fg-line').length === 2, 'two teal lines mounted');
ok(doc.querySelector('.fg-chip') !== null, 'estimate chip mounted');
/* default = full document bracket */
ok(D.els().lineS.style.top === '100px', 'START at first block top (100px, got ' + D.els().lineS.style.top + ')');
ok(D.els().lineE.style.top === '540px', 'END at last block bottom (540px)');
ok(['blk0','blk1','blk2','blk3','blk4'].every(id => $(id).classList.contains('fg-in-goal')), 'full range tinted');
ok(!statusRow.classList.contains('fg-in-goal'), 'vault status row never part of the goal');
const bgOn = win.getComputedStyle($('blk3')).backgroundImage;
ok(bgOn.indexOf('linear-gradient') === 0 && bgOn.indexOf('45,212,191') > -1, 'whisper teal overlay engaged on goal blocks');
ok(win.getComputedStyle($('blk1')).color === colorBefore, '★ RED LINE: text color identical with tint ON');

/* ---- estimate: 265 words → 79.5s · +1 eq(+20) · +2 fig(+30) · +1 ex(+10) = 140s ---- */
ok(D.els().chipMain.textContent === '≈ 2 MIN · CLICK TO START', 'waiting time shown pre-start (got "' + D.els().chipMain.textContent + '")');

/* ---- drag END up to y=250 → snaps to boundary 2 (260px) ---- */
pev('pointerdown', D.els().lineE, 540);
pev('pointermove', D.els().lineE, 250);
pev('pointerup', D.els().lineE, 250);
ok(D.els().lineE.style.top === '260px', 'END snapped to block boundary 260px');
ok($('blk0').classList.contains('fg-in-goal') && $('blk1').classList.contains('fg-in-goal'), 'kept blocks still tinted');
ok(!$('blk2').classList.contains('fg-in-goal') && !$('blk4').classList.contains('fg-in-goal'), 'dropped blocks tint removed live');
ok(D.els().chipMain.textContent.indexOf('≈ 1 MIN') === 0, 'estimate recomputed on drop: 102 words → floor ' + D.els().chipMain.textContent.split(' ·')[0]);
const savedGoals = (win.localStorage.getItem('fg:goals') || '');
ok(savedGoals.indexOf('"alpha.md":{"s":0,"e":2}') > -1, 'goal persisted per content item');

/* ---- START can never cross END ---- */
pev('pointerdown', D.els().lineS, 100);
pev('pointermove', D.els().lineS, 500);      /* wants boundary 4, clamped to e-1 = 1 */
pev('pointerup', D.els().lineS, 500);
ok(D.els().lineS.style.top === '205px', 'START clamped at END−1 (never crosses)');

/* ---- a11y sliders ---- */
ok(D.els().lineS.getAttribute('role') === 'slider' && D.els().lineE.getAttribute('role') === 'slider', 'lines expose role=slider');
ok(D.els().lineE.getAttribute('aria-valuenow') === '2' && D.els().lineE.getAttribute('aria-valuemax') === '5', 'aria values track the bracket');

/* ---- keyboard nudge ---- */
key(D.els().lineS, 'ArrowUp');
ok(D.els().lineS.style.top === '100px', 'ArrowUp nudges START one boundary up');
key(D.els().lineE, 'End');
ok(D.els().lineE.style.top === '540px' && D.els().chipMain.textContent.indexOf('≈ 2 MIN') === 0, 'End key returns to full range; estimate back to ≈ 2 MIN');

/* ---- WPM select ---- */
const sel = D.els().chip.querySelector('select');
sel.value = '120';
sel.dispatchEvent(new win.Event('change', { bubbles: true }));
ok(D.els().chipMain.textContent.indexOf('≈ 3 MIN') === 0, 'WPM 120 re-sizes the window (≈ 3 MIN, got ' + D.els().chipMain.textContent.split(' ·')[0] + ')');
ok((win.localStorage.getItem('fg:prefs') || '').indexOf('"wpm":120') > -1, 'WPM preference remembered');

/* ---- click timer = reading time starts ---- */
D.els().chipMain.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
ok(D.els().chipMain.textContent.indexOf('LEFT') > -1, 'running chip shows countdown + read time');
ok(doc.querySelector('.fg-chip').classList.contains('fg-chip-running'), 'chip running state class');
ok(toasts.some(t => t.indexOf('Reading time started') > -1), 'gentle start toast');
ok((win.localStorage.getItem('fg:session:alpha.md') || '').indexOf('"phase":"running"') > -1, 'running session persisted (crash-safe)');

/* ---- window completion ---- */
const st = D.state().session;
D.forceTick(st.stamp + (st.est + 5) * 1000);
ok(D.state().session.phase === 'done', 'elapsed ≥ estimate → done');
ok(D.els().doneBtn.style.display !== 'none', 'MARK COMPLETE appears');
ok(toasts.some(t => t.indexOf('Focus window reached') > -1), 'soft done toast');

/* ---- complete: clears bracket, logs session, turns off ---- */
D.els().doneBtn.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'false' && !reader.classList.contains('fg-armed'), 'complete disarms the overlay');
ok(doc.querySelector('.fg-layer') === null, 'overlay removed from DOM');
ok(!doc.querySelector('.fg-in-goal'), 'all tint lifted');
const log = JSON.parse(win.localStorage.getItem('fg:log') || '[]');
ok(log.length === 1 && log[0].item === 'alpha.md' && log[0].minutes === 3, 'session logged (3 min window)');
ok((win.localStorage.getItem('fg:goals') || '').indexOf('alpha.md') === -1, 'bracket cleared from storage');

/* ---- hotkeys ---- */
key(doc.body, 'j', { ctrlKey: true });
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'true', 'Ctrl+J toggles ON anywhere');
key(doc.body, 'j', { ctrlKey: true });
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'false', 'Ctrl+J toggles OFF');
key($('blk2'), 'f', { ctrlKey: true });
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'true', 'Ctrl+F intercepted while reading (vault scope)');
key($('blk2'), 'f', { ctrlKey: true });
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'false', 'Ctrl+F again turns it off');
key(doc.body, 'f', { ctrlKey: true });
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'false', 'Ctrl+F outside the vault falls through to browser find');
key($('contentSearch'), 'j', { ctrlKey: true });
ok($('fgToggleBtn').getAttribute('aria-pressed') === 'false', 'hotkeys never fire while typing in inputs');

/* ---- reload restore: goal range ---- */
D.enable();
pev('pointerdown', D.els().lineE, 540);
pev('pointermove', D.els().lineE, 250);
pev('pointerup', D.els().lineE, 250);
D.disable(); D.enable();
ok(D.els().lineE.style.top === '260px', 'simulated reload: bracket restored from storage');

/* ---- reload restore: paused session keeps banked elapsed ---- */
D.els().chipMain.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));            /* start */
D.state().session.stamp = win.Date.now() - 30000;            /* simulate 30s of reading */
D.els().chipMain.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));   /* pause */
const banked = D.state().session.elapsed;
D.disable(); D.enable();
ok(D.state().session.phase === 'paused', 'session restored as paused');
ok(Math.abs(D.state().session.elapsed - banked) < 5, 'banked elapsed survives reload (' + Math.round(D.state().session.elapsed) + 's)');
ok(D.els().chipMain.textContent.indexOf('⏸ PAUSED') === 0, 'paused label restored');
D.disable();

/* ---- backup sweep honors fg: exclusion (functional, from the live deliverable) ---- */
const mSweep = PROJECT.match(/const raw=\{\};for\(let i=0;i<localStorage\.length;i\+\+\)\{[^}]+\}/);
ok(mSweep !== null, 'backup sweep located in deliverable');
const fakeLS = { _d: { 'fg:prefs': '1', 'fg:goals': '2', 'csir_keep': '3' },
  get length() { return Object.keys(this._d).length; },
  key(i) { return Object.keys(this._d)[i]; },
  getItem(k) { return this._d[k]; } };
const raw = (new Function('localStorage', mSweep[0] + ';return raw;'))(fakeLS);
ok(!('fg:prefs' in raw) && !('fg:goals' in raw), 'fg:* keys never enter backup payloads (plan rule)');
ok(raw.csir_keep === '3', 'legit keys still backed up');

dom.window.close();
console.log('smoke24: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
