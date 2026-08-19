/* smoke12 (jsdom) — round 11 integration with the REAL extracted scripts:
   Gray Fog Archives (mystery mode) ×3 DOMs + White Room Commentator (break chess). */
const fs = require('fs');
const { JSDOM } = require('jsdom');

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

const FIXTURE = `<div id="themeGameModal"></div>
<main id="themeGameArena"></main>
<button id="gameToggleBtn"></button><button id="themeGameClose"></button><button id="themeGameRestart"></button>
<div id="themeGameTitle"></div><div id="themeGameEyebrow"></div><div id="themeGameSubtitle"></div>
<div id="themeGameScore"></div>
<select id="themeGameDifficulty"><option value="noobie">NOOBIE</option><option value="adept" selected>ADEPT</option><option value="elite">ELITE</option><option value="godhood">GODHOOD</option></select>
<b id="themeGameBest"></b><b id="themeGameWins"></b><b id="themeGameStreak"></b>
<button id="themeGameDaily"></button><button id="themeGameAchievementsBtn"></button><div id="themeGameAchievements" hidden></div>
<div id="themeGameClock"></div><span id="themeGameProgressFill"></span><div id="themeGameStatus"></div><div id="themeGameTip"></div>
<span id="themePickerLabel">LOTM</span>
<div id="breakGameModal" class="break-game-modal" aria-hidden="true">
  <div class="break-board-frame"><div id="breakChessBoard" role="grid"></div></div>
  <div id="breakGameStatus" role="status"></div>
  <div id="breakGameQuote"></div><div id="breakGameTitle"></div><div id="breakGameSubtitle"></div>
  <span id="breakTurnMeta"></span><span id="breakMoveMeta"></span><span id="breakTimer"></span>
  <span id="breakProgressFill"></span><b id="breakEngineState"></b>
  <button id="breakGameClose"></button><button id="breakNewGame"></button><button id="breakUndo"></button><button id="breakPause"></button>
  <select id="chessDifficulty"><option value="novice" selected>NOOBIE</option><option value="adept">ROOKIE</option></select>
</div>`;

function makePage(bodyClass){
  const dom = new JSDOM('<!DOCTYPE html><html><body class="' + bodyClass + '">' + FIXTURE + '</body></html>', {
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
  const toasts = [];
  window.eval("function escapeHtml(str){ const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }");
  window.eval('var showToast = function(m){ window.__toastLog.push(m); };');
  window.__toastLog = toasts;
  window.eval(chessSrc); window.eval(themeSrc); window.eval(forge1Src); window.eval(forge2Src);
  DOMS.push(dom);
  return { window, toasts, doc: window.document };
}
const wait = ms => new Promise(r => setTimeout(r, ms));
const setLevel = (p, v) => { const s = p.doc.getElementById('themeGameDifficulty'); s.value = v; s.dispatchEvent(new p.window.Event('change')); };
const openTheme = p => { p.doc.getElementById('gameToggleBtn').click(); };
const head = p => { const h = p.doc.querySelector('.mystery-case-head'); return h ? h.textContent : ''; };
const clickCorrect = p => {
  const title = p.doc.querySelector('.mystery-case-title').textContent;
  const known = {'THE WATCHER':'SPECTATOR','THE SEALED ROOM':'SEQUENCE 8','THE ACTING METHOD':'ACTING','THE FOOL ABOVE':'THE FOOL','THE FINAL CLUE':'OBSERVE'};
  const want = known[title];
  if (!want) return false;
  const btn = [...p.doc.querySelectorAll('.mystery-option')].find(b => b.textContent === want);
  if (btn){ btn.click(); return true; }
  return false;
};
const AI_BATCH = JSON.stringify([
  {name:'THE VELVET HOUR', clues:['The clock struck thirteen at dawn today.','Every mirror showed a different moon last night.','The guest book wrote its own final entry.'], options:['DREAM PATHWAY','RIVER PATHWAY','SUN PATHWAY','DOOR PATHWAY'], a:0},
  {name:'THE QUIET LEDGER', clues:['The numbers added themselves every single night.','The banker in question never owned a bank.','Gold vanished without a lock turning once.'], options:['MARAUDER','SEER','BARD','SAILOR'], a:0},
  {name:'THE ASHEN CHOIR', clues:['The hymn continued after the singers left.','Candles leaned toward an absent flame.','The applause came from the empty balcony.'], options:['BARD','HUNTER','LAWYER','READER'], a:0},
  {name:'THE BACKWARD TIDE', clues:['The harbor emptied before the storm arrived.','Fish were found arranged as an arrow.','The lighthouse keeper dreamt in reverse.'], options:['SAILOR','SLEEPLESS','ASSASSIN','ARBITER'], a:0}
]);

(async function main(){

console.log('[1] Gray Fog Archives — offline (AI not configured)');
let p = makePage('theme-lotm');
setLevel(p, 'adept'); openTheme(p); await wait(40);
ok(p.doc.getElementById('themeGameModal').classList.contains('open'), 'modal opens in mystery mode');
ok(head(p).includes('CASE 1/6'), 'ADEPT target 6 → "' + head(p).split('SANITY')[0].trim() + '"');
ok((head(p).match(/●/g) || []).length === 3, 'ADEPT sanity shows 3 pips');
ok(p.doc.querySelector('.mystery-case-title').textContent === 'THE WATCHER', 'handcrafted dossier opens first: ' + p.doc.querySelector('.mystery-case-title').textContent);
ok(p.doc.getElementById('themeGameStatus').textContent.includes('Gray Fog Archives'), 'status advertises the unlimited Archives');
ok(!p.doc.querySelector('.gf-ai-badge'), 'no AI badge when AI is not configured');
setLevel(p, 'noobie'); await wait(30);
ok(head(p).includes('CASE 1/4'), 'NOOBIE target 4');
ok((head(p).match(/●/g) || []).length === 5, 'NOOBIE sanity = 5 pips, no RangeError crash (latent base bug fixed)');
setLevel(p, 'godhood'); await wait(30);
ok(head(p).includes('CASE 1/10'), 'GODHOOD target 10');
ok((head(p).match(/●/g) || []).length === 1, 'GODHOOD sanity = 1 pip');

console.log('[2] answering advances the fog');
setLevel(p, 'elite'); await wait(30);
ok(head(p).includes('CASE 1/8'), 'ELITE target 8');
ok(clickCorrect(p), 'clicked SPECTATOR for THE WATCHER');
await wait(520);
ok(head(p).includes('CASE 2/8'), 'advanced to CASE 2/8 after correct deduction');
ok(p.doc.getElementById('themeGameScore').textContent !== '00', 'score banked the deduction');

console.log('[3] AI archivist — successful batch blends in, labelled');
p.window.localStorage.setItem('csirnet_ai_settings_v1', JSON.stringify({ format:'openai', model:'m', key:'k' }));
let aiCalls = 0;
p.window.AiEngine = { call: async () => { aiCalls++; return { text: AI_BATCH }; } };
p.doc.getElementById('themeGameRestart').click(); await wait(80); /* single clean restart warms the AI queue */
ok(aiCalls >= 1, 'AI batch requested on restart (' + aiCalls + ' call)');
ok(p.toasts.some(t => t.includes('AI archivist online')), 'toast: AI archivist online');
ok(clickCorrect(p), 'clear case 1 again');
await wait(520);
ok(!!p.doc.querySelector('.gf-ai-badge'), 'second case carries the ✦ AI-GENERATED badge');
ok(p.doc.querySelector('.gf-ai-badge').textContent.includes('AI-GENERATED'), 'badge text says AI-GENERATED (never hidden)');
ok(p.doc.querySelector('.mystery-case-title').textContent === 'THE VELVET HOUR', 'AI case file rendered: ' + p.doc.querySelector('.mystery-case-title').textContent);
ok(p.doc.querySelectorAll('.mystery-clue').length === 3 && p.doc.querySelectorAll('.mystery-option').length === 4, 'AI case: 3 clues + 4 options rendered');
p.doc.getElementById('themeGameClose').click(); await wait(20);

console.log('[4] AI archivist — failure degrades honestly, game continues');
let p2 = makePage('theme-lotm');
p2.window.localStorage.setItem('csirnet_ai_settings_v1', JSON.stringify({ format:'openai', model:'m', key:'k' }));
let failCalls = 0;
p2.window.AiEngine = { call: async () => { failCalls++; throw new Error('HTTP 429 quota'); } };
setLevel(p2, 'elite'); openTheme(p2); await wait(80);
ok(failCalls === 1, 'one AI attempt made');
ok(p2.toasts.some(t => t.includes('AI archivist unavailable')), 'one honest failure toast: "' + (p2.toasts.find(t => t.includes('unavailable')) || '').slice(0, 60) + '…"');
ok(clickCorrect(p2), 'case 1 still answerable after AI failure');
await wait(520);
ok(head(p2).includes('CASE 2/8'), 'game advances on the local generator');
ok(!p2.doc.querySelector('.gf-ai-badge'), 'no phantom AI badge after failure');
ok(failCalls === 1, 'no retry spam after the latch');
p2.doc.getElementById('themeGameClose').click();

console.log('[5] White Room Commentator — panel, local quips, AI upgrade, throttle');
let p3 = makePage('voice-ayanokoji');
p3.doc.getElementById('gameToggleBtn').click(); await wait(40);
ok(!p3.doc.getElementById('themeGameModal').classList.contains('open'), 'theme modal stays closed for Ayanokoji (chess takes the button)');
ok(p3.doc.getElementById('breakGameModal').classList.contains('open'), 'chess modal opens');
ok(!!p3.doc.getElementById('gfChessCommentary'), 'commentary panel mounted after the status line');
ok(p3.doc.querySelector('#gfChessCommentary .gf-chess-line').textContent.includes('White Room'), 'opening line: "' + p3.doc.querySelector('#gfChessCommentary .gf-chess-line').textContent.slice(0, 52) + '…"');
const cell = (r, c) => p3.doc.querySelector('[data-r="' + r + '"][data-c="' + c + '"]');
cell(6, 4).click(); await wait(20);
cell(4, 4).click(); await wait(30); /* e2 → e4 */
ok(p3.doc.getElementById('breakGameStatus').textContent.includes('Shadow engine'), 'player move registered: "' + p3.doc.getElementById('breakGameStatus').textContent.slice(0, 44) + '…"');
await wait(800); /* novice engine replies fast */
ok(p3.doc.getElementById('breakGameStatus').textContent.startsWith('Your move'), 'engine replied: "' + p3.doc.getElementById('breakGameStatus').textContent.slice(0, 60) + '"');
const lineEl = p3.doc.querySelector('#gfChessCommentary .gf-chess-line');
ok(lineEl.textContent.length > 3, 'commentator spoke during the exchange: "' + lineEl.textContent.slice(0, 48) + '"');
p3.window.localStorage.setItem('csirnet_ai_settings_v1', JSON.stringify({ format:'openai', model:'m', key:'k' }));
let chessCalls = 0;
p3.window.AiEngine = { call: async () => { chessCalls++; return { text: 'A clean conversion; the room records it without applause.' }; } };
p3.window.GameForge.chessNote({ side:'w', san:'f3–e5', cap:'N', check:false, mate:false, ended:false, n:9, diff:'NOOBIE' });
await wait(60);
ok(lineEl.textContent.startsWith('✦ AI · '), 'AI commentary line labelled: "' + lineEl.textContent.slice(0, 56) + '"');
ok(p3.doc.getElementById('gfChessCommentary').classList.contains('is-ai'), 'panel carries the is-ai styling hook');
ok(p3.toasts.some(t => t.includes('AI commentator seated')), 'toast: AI commentator seated');
p3.window.GameForge.chessNote({ side:'w', san:'d1–f3', cap:'Q', check:true, mate:false, ended:false, n:10, diff:'NOOBIE' });
await wait(60);
ok(chessCalls === 1, 'immediate second notable event throttled (1 call total)');

console.log('==========================');
console.log('SMOKE12: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); DOMS.forEach(d => d.window.close()); process.exit(1); });
