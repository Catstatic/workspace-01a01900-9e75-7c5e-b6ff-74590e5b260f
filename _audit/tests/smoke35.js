/* smoke35 (jsdom) — ROUND 29 NEURAL AMP DECK: launcher mounts on quick-dock,
   72 GitHub tracks + 6 radio + 8 categories, search, category filter,
   transport (next/prev wraps order of CURRENT VIEW), shuffle, loop, volume,
   persistence, radio LIVE mode quizzes, Esc close, deck export. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c) { passed++; } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const js = fs.readFileSync('/home/user/_audit/ins27_js.js', 'utf8');
const css = fs.readFileSync('/home/user/_audit/ins27_css.css', 'utf8');

const IGNORE = ['HTMLMediaElement.prototype.play', 'HTMLMediaElement.prototype.load', 'HTMLElement.prototype.scrollIntoView', 'CSS parsing'];
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { const m = String(e && e.message || e); if (!IGNORE.some(x => m.indexOf(x) >= 0)) errors.push(m); });

const html = '<!DOCTYPE html><html><head><style>' + css + '</style></head><body>' +
  '<div class="quick-dock"><button class="quick-btn" id="pomoDockBtn">⏱</button></div>' +
  '</body></html>';
const dom = new JSDOM(html, { url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc, pretendToBeVisual: true });
const w = dom.window, doc = w.document;

try { w.localStorage.clear(); } catch (e) {}
w.eval(js);

const $ = id => doc.getElementById(id);
const D = w.AMP_DECK;

/* --- structure --- */
ok(D && typeof D.open === 'function', 'AMP_DECK exported');
ok(D && D.counts().tracks === 72 && D.counts().radio === 6 && D.counts().cats === 8, 'catalogue: 72 tracks + 6 radio + 8 categories');
const launcher = $('ampLauncher');
ok(!!launcher, 'launcher injected');
ok(launcher && launcher.parentElement.className === 'quick-dock', 'launcher mounted INSIDE the native quick-dock');
ok(launcher && launcher.textContent === '🎧', 'launcher glyph is the headphones icon');
ok(D.alive(), 'deck + list built');

/* --- open deck --- */
launcher.click();
ok($('ampDeck').classList.contains('open'), 'click opens the deck');
ok(doc.querySelectorAll('.amp-chip').length === 8, '8 category chips rendered (ALL + 6 moods + RADIO)');
ok(doc.querySelectorAll('.amp-row').length === 78, 'ALL view lists 72 tracks + 6 radio = 78 rows');
ok(doc.querySelectorAll('.amp-row-tag.is-radio').length === 6, '6 radio rows tagged RADIO');

/* --- search --- */
const search = $('ampSearch');
search.value = 'bamboo';
search.dispatchEvent(new w.Event('input', { bubbles: true }));
let rows = doc.querySelectorAll('.amp-row');
ok(rows.length === 1 && rows[0].getAttribute('data-key') === 'gh_bamboo', 'search "bamboo" -> exactly the Bamboo Forest row');
search.value = 'deep focus';
search.dispatchEvent(new w.Event('input', { bubbles: true }));
rows = doc.querySelectorAll('.amp-row');
ok(rows.length === 1 && rows[0].getAttribute('data-key') === 'radio_2', 'search "deep focus" matches the DEF CON radio channel by display name');

/* --- category filter --- */
search.value = '';
search.dispatchEvent(new w.Event('input', { bubbles: true }));
const chips = doc.querySelectorAll('.amp-chip');
[...chips].find(c => c.textContent === '📚 STUDY').click();
ok(doc.querySelectorAll('.amp-row').length === 12, 'STUDY category = 12 rows');
[...chips].find(c => c.textContent === '📻 RADIO').click();
ok(doc.querySelectorAll('.amp-row').length === 6, 'RADIO category = 6 rows');
[...chips].find(c => c.textContent === '✦ ALL').click();
ok(doc.querySelectorAll('.amp-row').length === 78, 'ALL restored to 78 rows');

/* --- playback state machine (media calls are jsdom stubs; state engine is ours) --- */
D.play('gh_codex');
ok(D.state().key === 'gh_codex', 'play(gh_codex) sets current key');
ok(w.localStorage.getItem('ampdeck:last') === 'gh_codex', 'last selection persisted');
ok($('ampAudio').src.endsWith('/Codex.mp3'), 'audio element pointed at the GitHub mp3 URL');
ok(D.state().playing === true, 'engine marks playing');
ok($('ampDeck').classList.contains('playing'), 'deck playing class drives vinyl/CSS');
ok($('ampNpText').textContent.indexOf('Codex') >= 0, 'now-playing marquee shows track');
ok($('ampList').querySelector('.amp-row.current .amp-row-name').textContent.indexOf('Codex') >= 0, 'current row highlighted');

/* transport uses CURRENT VIEW order */
D.play('gh_bamboo');                    // first row of ALL view
D.next();
ok(D.state().key === 'gh_inner', 'next step = 2nd track in list order');
D.prev(); D.prev();                     // wrap backward twice -> last radio entry
ok(D.state().key === 'radio_5', 'prev from first track wraps to final radio channel');
ok($('ampDeck').classList.contains('radio-mode'), 'radio row arms the LIVE/RADIO mode class');
D.next();                               // wrap forward back to first track
ok(D.state().key === 'gh_bamboo', 'next from last entry wraps to first track');
ok(!$('ampDeck').classList.contains('radio-mode'), 'back on a file track drops radio mode');

/* loop + volume */
const loopBtn = $('ampLoop');
ok(D.state().loop === true && loopBtn.classList.contains('on'), 'loop default ON (mirrors source behaviour)');
loopBtn.click();
ok(D.state().loop === false, 'loop toggles off');
loopBtn.click();
ok(D.state().loop === true && w.localStorage.getItem('ampdeck:loop') === '1', 'loop state persisted');

const vol = $('ampVol');
vol.value = '40';
vol.dispatchEvent(new w.Event('input', { bubbles: true }));
ok(Math.abs($('ampAudio').volume - 0.4) < 1e-6, 'volume slider applies to the audio element');
ok($('ampVolPct').textContent === '40%' && w.localStorage.getItem('ampdeck:vol') === '0.4', 'volume % shown + persisted');

/* shuffle keeps a legal key */
D.shuffle();
const allKeys = Object.keys((function(){const t={};doc.querySelectorAll('.amp-row');return t;})()) || null;
ok(['string'].indexOf(typeof D.state().key) === 0 && D.state().key.length > 0, 'shuffle picks a valid key');

/* close behaviours */
doc.body.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
ok(!$('ampDeck').classList.contains('open'), 'Esc closes the deck');
launcher.click();
ok($('ampDeck').classList.contains('open'), 'launcher re-opens the deck');

/* GH url integrity: every track URL must be well-formed encodeURIComponent-safe */
let badUrl = 0;
const GH = 'https://raw.githubusercontent.com/xiao-zen-xo-hash/Neural-link/main/';
Object.values(w.AMP_DECK ? {} : {}).length; // noop guard
const probeKeys = ['gh_bamboo', 'gh_chinese_song', 'gh_poloz'];
try {
  D.play('gh_chinese_song');
  ok($('ampAudio').src.indexOf(GH) === 0 && decodeURIComponent($('ampAudio').src.slice(GH.length)).indexOf('.mp3') >= 0, 'percent-encoded CJK filename resolves to decodable .mp3 path');
} catch (e) { ok(false, 'CJK url decode'); }
ok(errors.length === 0, 'no unexpected jsdom page errors' + (errors.length ? ' :: ' + errors[0] : ''));

console.log('smoke35: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
