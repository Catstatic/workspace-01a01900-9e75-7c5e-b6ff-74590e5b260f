/* smoke23 (jsdom) — ROUND 26 SKINFORGE+CASTFORGE on the real rails:
   game-hub routing for the three new worlds + persona overrides, overlay injection. */
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
const skinSrc = extractScript('SKINFORGE + CASTFORGE — OVERLAY INJECTOR');

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
      window.scrollTo = window.scrollTo || function(){};
      window.addEventListener('error', e => errors.push('window: ' + e.message));
    }
  });
  const { window } = dom;
  window.eval("function escapeHtml(str){ const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }");
  window.eval('var showToast = function(m){ (window.__toastLog = window.__toastLog || []).push(m); };');
  window.eval(chessSrc); window.eval(themeSrc); window.eval(forge1Src); window.eval(forge2Src); window.eval(forgeLogicSrc); window.eval(skinSrc);
  DOMS.push(dom);
  return { window, doc: window.document, errors };
}

(async function main(){

console.log('[0] shipped statics');
ok(proj.includes("'theme-system':   ['jinwoo','igris']") && proj.includes("'theme-lotm':     ['klein','gehrman','fool']"),
   'persona rosters seated in THEME_VOICES');
ok(!/theme-backrooms|theme-escape/.test(proj), 'removed themes absent everywhere');

console.log('[1] overlay injector');
{
  const p = makePage('theme-kaiju8');
  for (const id of ['fxKaiju8', 'fxBatman', 'fxMoonknight', 'fxIgris', 'fxHuoyuhao', 'fxGehrman', 'fxFool']){
    ok(!!p.doc.getElementById(id), 'injected overlay node #' + id);
  }
  ok(p.window.__skinforge && p.window.__skinforge.layers.length === 7, '__skinforge surface exposes 7 layers');
  ok(p.errors.length === 0, 'injector ran with zero errors');
}

console.log('[2] game-hub routing for the three new worlds');
const ROUTES = [
  ['theme-kaiju8',              '.forge-lattice-grid',   'KAIJU NO. 8 → STAR LATTICE'],
  ['theme-batman',              '#cipherKeypad',         'DARK KNIGHT → cipher (detective decoding)'],
  ['theme-moonknight',          '.upgraded-maze',        'MOON KNIGHT → maze (tomb of Khonshu)'],
];
for (const [cls, marker, label] of ROUTES){
  const p = makePage(cls);
  p.doc.getElementById('gameToggleBtn').click(); await wait(45);
  ok(p.doc.getElementById('themeGameModal').classList.contains('open') && !!p.doc.querySelector(marker), label);
  ok(p.errors.length === 0, '  …zero runtime errors for ' + cls);
  p.doc.getElementById('themeGameClose').click();
}
{
  const p = makePage('theme-moonknight'); /* HUD speaks tomb now */
  p.doc.getElementById('gameToggleBtn').click(); await wait(45);
  const title = p.doc.getElementById('themeGameTitle').textContent || '';
  ok(/TOMB OF KHONSHU/i.test(title), 'maze HUD title re-skinned: "' + title + '"');
  p.doc.getElementById('themeGameClose').click();
}

console.log('[3] persona ultimates reroute their games');
const PERSONAS = [
  ['theme-system voice-igris',      '.ryuuen-command-arena', "IGRIS → target (the knight's duel)"],
  ['theme-lotm voice-gehrman',      '.ryuuen-command-arena', "GEHRMAN → target (bounty hunt)"],
  ['theme-lotm voice-fool',         '.mystery-case',         'THE FOOL → mystery (fog seat)'],
  ['theme-shrek voice-huoyuhao',    '.spirit-command-arena', 'HUO YUHAO → spirit (realm wavelength)'],
];
for (const [cls, marker, label] of PERSONAS){
  const p = makePage(cls);
  p.doc.getElementById('gameToggleBtn').click(); await wait(45);
  ok(!!p.doc.querySelector(marker), label);
  ok(p.errors.length === 0, '  …zero runtime errors for ' + cls);
  p.doc.getElementById('themeGameClose').click();
}

console.log('[4] old routing truly gone');
{
  const p = makePage(''); /* plain body: default memory path */
  p.doc.getElementById('gameToggleBtn').click(); await wait(45);
  ok(!!p.doc.querySelector('.memory-grid'), 'no theme → memory default preserved');
  ok(p.errors.length === 0, 'default path zero errors');
}

console.log('\nsmoke23: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error('SMOKE CRASH:', e); DOMS.forEach(d => d.window.close()); process.exit(1); });
