/* smoke21 (jsdom) — ROUND 23: Ctrl+G toggles the theme game exactly like the
   ♞ BREAK GAME button; plain G is untouched; tooltip advertises the hotkey. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const DOMS = [];

const proj = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
function extractScript(marker){
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(proj))){ if (m[1].includes(marker)) return m[1]; }
  throw new Error('script not found: ' + marker);
}
const themeSrc = extractScript('THEME GAMES — rebuilt');
const forgeLogicSrc = extractScript('ROUND 18 — FORGE GAMES logic layer');
const hotkeySrc = extractScript('ROUND 23 — CTRL+G THEME GAME SHORTCUT');

const FIXTURE = `<div id="themeGameModal"></div><main id="themeGameArena"></main>
<button id="gameToggleBtn" title="Open a playable break game"></button><button id="themeGameClose"></button><button id="themeGameRestart"></button>
<div id="themeGameTitle"></div><div id="themeGameEyebrow"></div><div id="themeGameSubtitle"></div><div id="themeGameScore"></div>
<select id="themeGameDifficulty"><option value="adept" selected>ADEPT</option></select>
<b id="themeGameBest"></b><b id="themeGameWins"></b><b id="themeGameStreak"></b>
<button id="themeGameDaily"></button><button id="themeGameAchievementsBtn"></button><div id="themeGameAchievements" hidden></div>
<div id="themeGameClock"></div><span id="themeGameProgressFill"></span><div id="themeGameStatus"></div><div id="themeGameTip"></div><span id="themePickerLabel">T</span>`;

function page(){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String((e && e.detail && e.detail.message) || e)));
  const dom = new JSDOM('<!DOCTYPE html><html><body class="theme-aincrad">' + FIXTURE + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window){
      window.HTMLCanvasElement.prototype.getContext = function(){ return new Proxy({}, { get(t, k){ return typeof k === 'string' ? function(){} : undefined; }, set(){ return true; } }); };
      window.addEventListener('error', e => errors.push('window: ' + e.message));
    }
  });
  dom.window.eval(themeSrc); dom.window.eval(forgeLogicSrc); dom.window.eval(hotkeySrc);
  DOMS.push(dom);
  return { window: dom.window, doc: dom.window.document, errors };
}
const key = (p, k, opts) => p.doc.dispatchEvent(new p.window.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true, cancelable: true }, opts || {})));

(async function main(){
const p = page();
const modal = p.doc.getElementById('themeGameModal');

console.log('[1] Ctrl+G opens the same game the button opens');
key(p, 'g', { ctrlKey: true }); await wait(45);
ok(modal.classList.contains('open'), 'Ctrl+G opens the theme game modal');
ok(!!p.doc.querySelector('.forge-cascade-grid'), 'CORE CASCADE booted via hotkey (aincrad mapping intact)');
ok(p.doc.getElementById('themeGameTitle').textContent === 'CORE CASCADE', 'header synced: ' + p.doc.getElementById('themeGameTitle').textContent);
ok(p.errors.length === 0, 'open path clean');

console.log('[2] Ctrl+G again closes it');
key(p, 'g', { ctrlKey: true }); await wait(40);
ok(!modal.classList.contains('open'), 'second Ctrl+G closes the modal');
ok(!!p.doc.getElementById('gameToggleBtn'), 'button untouched — single source of truth preserved');

console.log('[3] specificity: plain G, G+alt, G+shift must NOT trigger');
key(p, 'g'); await wait(30);
ok(!modal.classList.contains('open'), 'plain g ignored');
key(p, 'g', { altKey: true, ctrlKey: true }); await wait(30);
ok(!modal.classList.contains('open'), 'ctrl+alt+g ignored (no fat-finger hijack)');
key(p, 'g', { ctrlKey: true, shiftKey: true }); await wait(30);
ok(!modal.classList.contains('open'), 'ctrl+shift+g ignored');
key(p, 'g', { metaKey: true }); await wait(45);
ok(modal.classList.contains('open'), 'cmd+g works too (mac)');
p.doc.getElementById('themeGameClose').click(); await wait(30);

console.log('[4] tooltip advertises the hotkey');
ok(p.doc.getElementById('gameToggleBtn').title.includes('Ctrl+G'), 'button title now says: "' + p.doc.getElementById('gameToggleBtn').title + '"');
ok(typeof p.window.__hotkeyG === 'object' && typeof p.window.__hotkeyG.toggle === 'function', 'test surface exported');
p.window.__hotkeyG.toggle(); await wait(40);
ok(modal.classList.contains('open'), 'programmatic toggle matches keyboard path');
ok(p.errors.length === 0, 'no runtime errors');

for (const d of DOMS) d.window.close();
console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
