/* smoke13 (jsdom) — round 12 audit: every break game boots clean at every level.
   12 theme modes × 4 levels, with fatal-error capture; plus the scroll-fix rules. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };
const DOMS = [];

const proj = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
function extractScript(marker){
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(proj))){ if (m[1].includes(marker)) return m[1]; }
  throw new Error('script not found: ' + marker);
}
const chessSrc = extractScript('BREAK CHESS — playable');
const themeSrc = extractScript('THEME GAMES — rebuilt');
const forge1Src = extractScript('GAMEFORGE (round 10)');
const forge2Src = extractScript('GAMEFORGE II (round 11)');
const forgeLogicSrc = extractScript('ROUND 18 — FORGE GAMES logic layer');

const FIXTURE = `<div id="themeGameModal"></div>
<main id="themeGameArena"></main>
<button id="gameToggleBtn"></button><button id="themeGameClose"></button><button id="themeGameRestart"></button>
<div id="themeGameTitle"></div><div id="themeGameEyebrow"></div><div id="themeGameSubtitle"></div>
<div id="themeGameScore"></div>
<select id="themeGameDifficulty"><option value="noobie">NOOBIE</option><option value="adept" selected>ADEPT</option><option value="elite">ELITE</option><option value="godhood">GODHOOD</option></select>
<b id="themeGameBest"></b><b id="themeGameWins"></b><b id="themeGameStreak"></b>
<button id="themeGameDaily"></button><button id="themeGameAchievementsBtn"></button><div id="themeGameAchievements" hidden></div>
<div id="themeGameClock"></div><span id="themeGameProgressFill"></span><div id="themeGameStatus"></div><div id="themeGameTip"></div>
<span id="themePickerLabel">T</span>
<div id="breakGameModal" class="break-game-modal" aria-hidden="true">
  <div class="break-board-frame"><div id="breakChessBoard" role="grid"></div></div>
  <div id="breakGameStatus" role="status"></div>
  <div id="breakGameQuote"></div><div id="breakGameTitle"></div><div id="breakGameSubtitle"></div>
  <span id="breakTurnMeta"></span><span id="breakMoveMeta"></span><span id="breakTimer"></span>
  <span id="breakProgressFill"></span><b id="breakEngineState"></b>
  <button id="breakGameClose"></button><button id="breakNewGame"></button><button id="breakUndo"></button><button id="breakPause"></button>
  <select id="chessDifficulty"><option value="novice" selected>NOOBIE</option></select>
</div>`;

const wait = ms => new Promise(r => setTimeout(r, ms));

function makePage(bodyClass){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String((e && e.detail && e.detail.message) || e)));
  const dom = new JSDOM('<!DOCTYPE html><html><body class="' + bodyClass + '">' + FIXTURE + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window){
      window.HTMLCanvasElement.prototype.getContext = function(){
        return new Proxy({}, {
          get(t, k){ if (k === 'createLinearGradient') return () => ({addColorStop(){}}); return typeof k === 'string' ? function(){} : undefined; },
          set(){ return true; }
        });
      };
      window.scrollTo = window.scrollTo || function(){};
      window.addEventListener('error', e => errors.push('window: ' + e.message));
    }
  });
  const { window } = dom;
  const toasts = [];
  window.eval("function escapeHtml(str){ const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }");
  window.eval('var showToast = function(m){ window.__toastLog.push(m); };');
  window.__toastLog = toasts;
  window.eval(chessSrc); window.eval(themeSrc); window.eval(forge1Src); window.eval(forge2Src); window.eval(forgeLogicSrc);
  DOMS.push(dom);
  return { window, toasts, doc: window.document, errors };
}
const setLevel = (p, v) => { const s = p.doc.getElementById('themeGameDifficulty'); s.value = v; s.dispatchEvent(new p.window.Event('change')); };

(async function main(){

console.log('[0] round-12 scroll-fix rules present in the shipped file');
ok(/\.break-game-modal,\.theme-game-modal\{[^}]*overflow-y:auto !important/.test(proj), 'both overlays made scrollable');
ok(/\.break-game-shell,\.theme-game-shell\{[^}]*max-height:none !important/.test(proj), 'shell height cap removed (clipping preserved, scrolling restored)');
ok(/@media \(max-height:900px\)[\s\S]{0,1400}break-board-frame\{width:min\(100%,calc\(100vh - 340px\)\)/.test(proj), 'short-viewport compaction shrinks the board to the vertical budget');

console.log('[1] 13 mode-rows × 4 levels — boot/reboot audit');
const MODES = [
  ['memory',   'voice-horikita',            '.memory-grid'],
  ['cipher',   'theme-black',               '#cipherKeypad'],
  ['mystery',  'theme-lotm',                '.mystery-case'],
  ['maze',     'theme-moonknight',          '.upgraded-maze'],
  ['target',   'voice-ryuuen',              '.ryuuen-command-arena'],
  ['shadow',   'theme-system',              '.shadow-command-arena'],
  ['spirit',   'theme-shrek',               '.spirit-command-arena'],
  ['equation', 'theme-physics',             '#equationQuestion'],
  ['feynman',  'theme-physics voice-feynman','#feynmanComponents'],
  ['gravity',  'theme-physics voice-astro', '#gravityCanvas'],
  ['runner',   'theme-neon',                '#neonTrackV2'],
  ['cascade',  'theme-aincrad',             '.forge-cascade-grid'],
  ['lattice',  'theme-kaiju8',             '.forge-lattice-grid']
];
let modeFails = 0;
for (const [mode, cls, marker] of MODES){
  const p = makePage(cls);
  let detail = '';
  try{
    p.doc.getElementById('gameToggleBtn').click(); await wait(45);
    if (!p.doc.getElementById('themeGameModal').classList.contains('open')) detail = 'modal did not open';
    if (!detail && !p.doc.querySelector(marker)) detail = 'missing ' + marker;
    for (const lv of ['elite', 'godhood', 'noobie', 'adept']){
      if (detail) break;
      setLevel(p, lv); await wait(40);
      if (!p.doc.querySelector(marker)) detail = 'lost ' + marker + ' at ' + lv.toUpperCase();
      if (p.doc.getElementById('themeGameArena').children.length === 0) detail = 'empty arena at ' + lv.toUpperCase();
    }
    await wait(160); /* catch timer/rAF errors */
    if (!detail && p.errors.length) detail = 'runtime errors: ' + p.errors.slice(0, 2).join(' | ');
  }catch(e){ detail = 'threw: ' + e.message; }
  if (detail){ modeFails++; failed++; console.log('  ✘ ' + mode.padEnd(8) + ' — ' + detail); }
  else { passed++; console.log('  ✔ ' + mode.padEnd(8) + ' boots clean at NOOBIE/ADEPT/ELITE/GODHOOD, no runtime errors'); }
}
ok(modeFails === 0, 'all 13 mode rows clean');

console.log('[2] interactive spot-checks beyond boot');
{
  const p = makePage('theme-neon'); /* runner: buttons + tick */
  p.doc.getElementById('gameToggleBtn').click(); await wait(45);
  const btns = p.doc.querySelectorAll('.neon-run-controls button');
  ok(btns.length >= 2, 'runner controls rendered (' + btns.length + ')');
  if (btns[0]){ btns[0].click(); await wait(30); }
  ok(p.errors.length === 0, 'runner lane move clean');
  p.doc.getElementById('themeGameClose').click();
}
{
  const p = makePage('theme-aincrad'); /* round 18: aincrad now boots CORE CASCADE */
  setLevel(p, 'godhood');
  p.doc.getElementById('gameToggleBtn').click(); await wait(45);
  const cells = p.doc.querySelectorAll('.forge-cascade-grid .forge-cell');
  ok(cells.length === 49, 'cascade renders 7×7 lattice at godhood (' + cells.length + ' cells)');
  const sparks0 = +p.doc.getElementById('forgeSparks').textContent;
  const open = [...cells].find(c => !c.querySelector('.forge-orb'));
  if (open) open.click();
  await wait(320); /* allow a cascade wave to resolve */
  ok(+p.doc.getElementById('forgeSparks').textContent === sparks0 - 1, 'cascade consumes a spark on detonation (' + sparks0 + '→' + p.doc.getElementById('forgeSparks').textContent + ')');
  ok(p.doc.getElementById('forgeMoves').textContent === '1', 'cascade move counter ticks');
  ok(p.errors.length === 0, 'cascade detonation clean at GODHOOD');
  p.doc.getElementById('forgeSwitch').click(); await wait(45); /* switch modes in-place */
  ok(!!p.doc.querySelector('.forge-lattice-grid'), 'switch button boots STAR LATTICE without leaving the shell');
  ok(p.doc.querySelectorAll('.forge-cell.end').length === 14, 'lattice anchors 7 twin cores at godhood');
  ok(p.errors.length === 0, 'cascade→lattice switch clean');
  p.doc.getElementById('themeGameClose').click();
}
{
  const p = makePage('theme-system'); /* shadow raid: command action fires */
  p.doc.getElementById('gameToggleBtn').click(); await wait(45);
  const acts = p.doc.querySelectorAll('.shadow-command-actions button');
  ok(acts.length >= 2, 'shadow raid actions rendered (' + acts.length + ')');
  if (acts[0]) acts[0].click();
  await wait(60);
  ok(p.errors.length === 0, 'shadow raid action clean');
  p.doc.getElementById('themeGameClose').click();
}
{
  const p = makePage('theme-physics voice-astro'); /* gravity: launch path executes */
  p.doc.getElementById('gameToggleBtn').click(); await wait(60);
  const canvas = p.doc.getElementById('gravityCanvas');
  ok(!!canvas, 'gravity canvas mounted');
  ok(p.doc.getElementById('gravityChallenge').textContent === '1/60', 'gravity HUD healthy: ' + p.doc.getElementById('gravityChallenge').textContent);
  ok(p.errors.length === 0, 'gravity tick clean');
  p.doc.getElementById('themeGameClose').click();
}

console.log('==========================');
console.log('SMOKE13: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); DOMS.forEach(d => d.window.close()); process.exit(1); });
