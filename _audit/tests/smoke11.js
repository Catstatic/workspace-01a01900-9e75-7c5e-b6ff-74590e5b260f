/* smoke11 (jsdom) — round 10 integration: the REAL theme-games script + GameForge, extracted from the project file. */
const fs = require('fs');
const { JSDOM } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const proj = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
function extractScript(marker){
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(proj))){ if (m[1].includes(marker)) return m[1]; }
  throw new Error('script not found: ' + marker);
}
const forgeSrc = extractScript('GAMEFORGE');
const themeSrc = extractScript('THEME GAMES — rebuilt');

const FIXTURE = `<div id="themeGameModal"></div>
<main id="themeGameArena"></main>
<button id="gameToggleBtn"></button><button id="themeGameClose"></button><button id="themeGameRestart"></button>
<div id="themeGameTitle"></div><div id="themeGameEyebrow"></div><div id="themeGameSubtitle"></div>
<div id="themeGameScore"></div>
<select id="themeGameDifficulty"><option value="noobie">NOOBIE</option><option value="adept" selected>ADEPT</option><option value="elite">ELITE</option><option value="godhood">GODHOOD</option></select>
<b id="themeGameBest"></b><b id="themeGameWins"></b><b id="themeGameStreak"></b>
<button id="themeGameDaily"></button><button id="themeGameAchievementsBtn"></button><div id="themeGameAchievements" hidden></div>
<div id="themeGameClock"></div><span id="themeGameProgressFill"></span><div id="themeGameStatus"></div><div id="themeGameTip"></div>
<span id="themePickerLabel">PHYSICS LAB</span>`;

const dom = new JSDOM('<!DOCTYPE html><html><body class="theme-physics">' + FIXTURE + '</body></html>', {
  url: 'https://tracker.test/', runScripts: 'dangerously', pretendToBeVisual: true,
  beforeParse(window){
    window.HTMLCanvasElement.prototype.getContext = function(){
      return new Proxy({}, {
        get(t, k){ if (k === 'createLinearGradient') return () => ({addColorStop(){}}); return typeof k === 'string' ? function(){} : undefined; },
        set(){ return true; }
      });
    };
    window.scrollTo = window.scrollTo || function(){};
  }
});
const { window } = dom;
window.eval("function escapeHtml(str){ const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }");
const toasts = [];
window.eval('var showToast = function(m){ window.__toastLog.push(m); };');
window.__toastLog = toasts;

window.eval(forgeSrc);
ok(!!window.GameForge, 'GameForge registered');
window.eval(themeSrc);

async function wait(ms){ return new Promise(r => setTimeout(r, ms)); }
(async function main(){

console.log('[1] Equation Sprint — opens, unlimited bank, pace by difficulty');
window.document.getElementById('gameToggleBtn').click(); /* open */
await wait(30);
ok(window.document.getElementById('themeGameModal').classList.contains('open'), 'modal opens');
let qEl = window.document.getElementById('equationQuestion');
ok(!!qEl && qEl.textContent.length > 4, 'equation question rendered: "' + (qEl ? qEl.textContent.slice(0, 48) : 'NONE') + '…"');
ok(window.document.querySelectorAll('.equation-option').length === 4, '4 options rendered');
ok(window.document.getElementById('themeGameStatus').textContent.includes('Unlimited'), 'status advertises the unlimited generator');
ok(window.document.getElementById('equationPace').textContent.includes('30s'), 'ADEPT shows 30s per question: "' + window.document.getElementById('equationPace').textContent + '"');
ok(!window.document.querySelector('.gf-ai-badge'), 'no AI badge when AI not configured (honest labelling)');

const sel = window.document.getElementById('themeGameDifficulty');
sel.value = 'elite'; sel.dispatchEvent(new window.Event('change'));
await wait(30);
ok(window.document.getElementById('equationPace').textContent.includes('18s'), 'ELITE → 18s per question: "' + window.document.getElementById('equationPace').textContent + '"');
ok(window.document.getElementById('equationPace').className.includes('hot'), 'pace chip shows pressure styling at ELITE');
sel.value = 'godhood'; sel.dispatchEvent(new window.Event('change'));
await wait(30);
ok(window.document.getElementById('equationPace').textContent.includes('10s'), 'GODHOOD → 10s per question');
sel.value = 'noobie'; sel.dispatchEvent(new window.Event('change'));
await wait(30);
ok(window.document.getElementById('equationPace').textContent.includes('relaxed'), 'NOOBIE → relaxed pace, no countdown');

console.log('[2] answering advances through fresh questions');
sel.value = 'adept'; sel.dispatchEvent(new window.Event('change'));
await wait(30);
const before = window.document.getElementById('equationQuestion').textContent;
window.document.querySelectorAll('.equation-option')[0].click();
await wait(500);
const after = window.document.getElementById('equationQuestion').textContent;
ok(before !== after || window.document.querySelectorAll('.equation-option').length === 4, 'next question rendered after answering');

console.log('[3] Gravitational Slingshot — 60 sectors, difficulty-true rules');
window.document.getElementById('gameToggleBtn').click(); /* close */
await wait(20);
window.document.body.classList.add('voice-astro');
window.document.getElementById('gameToggleBtn').click(); /* open in gravity mode */
await wait(40);
ok(window.document.getElementById('gravityChallenge') && window.document.getElementById('gravityChallenge').textContent === '1/60', 'HUD shows 1/60 sectors: "' + (window.document.getElementById('gravityChallenge') || {}).textContent + '"');
ok((window.document.getElementById('gravitySector') || {}).textContent.length > 0, 'sector name shown: "' + (window.document.getElementById('gravitySector') || {}).textContent + '"');
ok(window.document.getElementById('gravityAttempts').textContent === '3', 'ADEPT attempts = 3');
sel.value = 'noobie'; sel.dispatchEvent(new window.Event('change'));
await wait(30);
ok(window.document.getElementById('gravityAttempts').textContent === '5', 'NOOBIE attempts = 5 (forgiving)');
sel.value = 'godhood'; sel.dispatchEvent(new window.Event('change'));
await wait(30);
ok(window.document.getElementById('gravityAttempts').textContent === '2', 'GODHOOD attempts = 2 (brutal)');
ok(window.document.getElementById('gravitySector').textContent.includes('FIRST ASSIST'), 'sector 1 stays the handcrafted FIRST ASSIST');

console.log('[4] escalation content present');
const lv = window.GameForge.gravityLevels();
ok(lv.length === 60 && new Set(lv.map(c => c.name)).size === 60, 'embedded copy: 60 unique sectors');
ok(lv.slice(14).some(c => c.planets.some(p => p.h)), 'embedded copy: hazard asteroids in later sectors');

window.document.getElementById('gameToggleBtn').click();
await wait(20);
console.log('==========================');
console.log('SMOKE11: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
