/* smoke18 (jsdom) — round 17 INSTANT BOOT VEIL (covers first paint, lifts when the
   round-13 overlay exists, honors skip-today, 2.2s failsafe) + round 18 FORGE GAMES
   in-shell gameplay: aincrad boots CORE CASCADE, spark/cascade counters move,
   STAR LATTICE switch works and a full colored line can be traced & sealed. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const DOMS = [];

const proj = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');

/* --- shipped veil block (html + inline poll script), exactly as embedded --- */
const vh = proj.indexOf('<!-- ROUND 17 — INSTANT BOOT VEIL');
const veilBlock = proj.slice(vh, proj.indexOf('</script>', vh) + 9);
ok(veilBlock.includes('id="bootVeil"') && veilBlock.includes('bootCenterOverlay'), 'veil block extracted from the shipped file (' + veilBlock.length + ' bytes)');

function veilPage(seedSkip){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String((e && e.detail && e.detail.message) || e)));
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body>' + veilBlock + '<div id="dash">DASHBOARD</div></body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window){
      if (seedSkip){
        const d = new Date();
        const today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        window.localStorage.setItem('csir_boot_skip_v1', today);
      }
    }
  });
  DOMS.push(dom);
  return { window: dom.window, doc: dom.window.document, errors };
}

(async function main(){

console.log('[1] veil covers first paint, lifts once the boot overlay exists');
{
  const p = veilPage(false);
  const v = p.doc.getElementById('bootVeil');
  ok(!!v && !v.classList.contains('gone'), 'veil present from parse, before any dashboard paint');
  await wait(120);
  ok(p.doc.getElementById('bootVeil') && !p.doc.getElementById('bootVeil').classList.contains('gone'), 'veil holds while the boot overlay is not built yet');
  const ov = p.doc.createElement('div'); ov.id = 'bootCenterOverlay'; p.doc.body.appendChild(ov);
  await wait(120);
  ok(p.doc.getElementById('bootVeil').classList.contains('gone'), 'veil fades the moment #bootCenterOverlay appears');
  await wait(620);
  ok(!p.doc.getElementById('bootVeil'), 'veil fully removed from the DOM after the fade');
  ok(p.errors.length === 0, 'no veil runtime errors');
}

console.log('[2] veil honors the round-13 skip-today key');
{
  const p = veilPage(true);
  await wait(60);
  const v = p.doc.getElementById('bootVeil');
  ok(!v || v.classList.contains('gone'), 'skip-today set → veil drops instantly, straight to dashboard');
}

console.log('[3] failsafe: veil never traps the user');
{
  const p = veilPage(false);
  await wait(2920); /* 2.2s failsafe + 520ms fade + slack */
  ok(!p.doc.getElementById('bootVeil'), 'no overlay after 2.2s → failsafe removes the veil anyway');
}

console.log('[4] forge games — aincrad boots CORE CASCADE and plays');
function extractScript(marker){
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(proj))){ if (m[1].includes(marker)) return m[1]; }
  throw new Error('script not found: ' + marker);
}
const themeSrc = extractScript('THEME GAMES — rebuilt');
const logicSrc = extractScript('ROUND 18 — FORGE GAMES logic layer');
const FIXTURE = `<div id="themeGameModal"></div><main id="themeGameArena"></main>
<button id="gameToggleBtn"></button><button id="themeGameClose"></button><button id="themeGameRestart"></button>
<div id="themeGameTitle"></div><div id="themeGameEyebrow"></div><div id="themeGameSubtitle"></div><div id="themeGameScore"></div>
<select id="themeGameDifficulty"><option value="noobie">NOOBIE</option><option value="adept" selected>ADEPT</option><option value="elite">ELITE</option><option value="godhood">GODHOOD</option></select>
<b id="themeGameBest"></b><b id="themeGameWins"></b><b id="themeGameStreak"></b>
<button id="themeGameDaily"></button><button id="themeGameAchievementsBtn"></button><div id="themeGameAchievements" hidden></div>
<div id="themeGameClock"></div><span id="themeGameProgressFill"></span><div id="themeGameStatus"></div><div id="themeGameTip"></div><span id="themePickerLabel">T</span>`;
function gamePage(bodyClass){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String((e && e.detail && e.detail.message) || e)));
  const dom = new JSDOM('<!DOCTYPE html><html><body class="' + bodyClass + '">' + FIXTURE + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window){
      window.HTMLCanvasElement.prototype.getContext = function(){ return new Proxy({}, { get(t, k){ return typeof k === 'string' ? function(){} : undefined; }, set(){ return true; } }); };
      window.addEventListener('error', e => errors.push('window: ' + e.message));
    }
  });
  dom.window.eval(themeSrc); dom.window.eval(logicSrc);
  DOMS.push(dom);
  return { window: dom.window, doc: dom.window.document, errors };
}
const p = gamePage('theme-aincrad');
p.doc.getElementById('gameToggleBtn').click(); await wait(45);
ok(p.doc.getElementById('themeGameTitle').textContent === 'CORE CASCADE', 'aincrad header: CORE CASCADE (duel retired)');
ok(p.doc.querySelectorAll('.forge-cascade-grid .forge-cell').length === 36, 'adept board is 6×6');
const hostileCell = [...p.doc.querySelectorAll('.forge-cascade-grid .forge-cell')].find(c => c.querySelector('.forge-orb') && !c.classList.contains('friendly'));
hostileCell.click(); await wait(30);
ok(p.doc.getElementById('forgeLog').textContent.includes('Hostile core'), 'clicking a hostile orb is rejected with guidance');
const sparks0 = +p.doc.getElementById('forgeSparks').textContent;
const open = [...p.doc.querySelectorAll('.forge-cascade-grid .forge-cell')].find(c => !c.querySelector('.forge-orb'));
open.click(); await wait(320);
ok(+p.doc.getElementById('forgeSparks').textContent === sparks0 - 1 && p.doc.getElementById('forgeMoves').textContent === '1', 'spark spent, move counted');
ok(p.errors.length === 0, 'cascade play clean');

console.log('[5] STAR LATTICE — trace and seal a full line');
p.doc.getElementById('forgeSwitch').click(); await wait(45);
ok(p.doc.getElementById('themeGameTitle').textContent === 'STAR LATTICE', 'switch reheads the shell: STAR LATTICE');
{
  const size = 6;
  const cellEls = [...p.doc.querySelectorAll('.forge-lattice-grid .forge-cell')];
  ok(cellEls.length === size * size, 'lattice grid is 6×6 at adept');
  /* rebuild the board from the DOM: endpoints by color */
  const endsByColor = {};
  cellEls.forEach((el, i) => {
    const dot = el.querySelector('.forge-dot');
    if (dot){ (endsByColor[dot.style.background] = endsByColor[dot.style.background] || []).push(i); }
  });
  const colors = Object.keys(endsByColor);
  ok(colors.length === 5 && colors.every(c => endsByColor[c].length === 2), '5 twin cores, exactly 2 endpoints each');
  /* BFS from a to b avoiding all foreign endpoints, then click the path */
  const walls = new Set(colors.flatMap(c => endsByColor[c]));
  let sealed = 0, err = '';
  outer:
  for (const col of colors){
    const [a, b] = endsByColor[col];
    const prev = new Map([[a, -1]]);
    const q = [a];
    while (q.length){
      const cur = q.shift();
      if (cur === b) break;
      const x = cur % size, y = (cur / size) | 0;
      for (const nb of [x > 0 && cur - 1, x < size - 1 && cur + 1, y > 0 && cur - size, y < size - 1 && cur + size].filter(v => v !== false)){
        if (prev.has(nb)) continue;
        if (walls.has(nb) && nb !== b) continue;
        prev.set(nb, cur); q.push(nb);
      }
    }
    if (!prev.has(b)) continue; /* this pair walled off — try another */
    const path = [];
    for (let c = b; c !== -1; c = prev.get(c)) path.unshift(c);
    cellEls[a].click(); await wait(12);
    if (!p.doc.getElementById('forgeActive').textContent.includes('LINKING CORE')){ err = 'core did not activate'; break; }
    for (let s = 1; s < path.length; s++){ cellEls[path[s]].click(); await wait(12); }
    const linked = p.doc.getElementById('forgeLinked').textContent;
    if (linked.startsWith('1/')){ sealed = 1; break outer; }
    err = 'line did not seal (linked=' + linked + ')';
  }
  ok(sealed === 1, 'a full colored line traced & sealed' + (err ? ' — ' + err : ''));
  ok(+p.doc.getElementById('themeGameScore').textContent > 0, 'score accrues from tracing + sealing');
  ok(p.doc.getElementById('forgeActive').textContent.includes('TAP A CORE'), 'banner resets after the seal');
  ok(p.errors.length === 0, 'lattice play clean');
}

for (const d of DOMS) d.window.close();
console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
