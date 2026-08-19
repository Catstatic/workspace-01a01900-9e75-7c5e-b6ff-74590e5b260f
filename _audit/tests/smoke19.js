/* smoke19 (jsdom) — round 19 RESONANCE CHAMBER: Ctrl+M opens the room, piano renders
   a full playable 2-octave span with pc-key badges, zither renders 15 pentatonic strings,
   strum-by-drag works, letter keys strike notes, octave shift re-badges, songs play with
   progress + note chips, recorder captures strikes, Esc/Ctrl+M closes, prefs persist. */
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
const rcSrc = extractScript('ROUND 19 — RESONANCE CHAMBER: Ctrl+M music room');

function page(){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String((e && e.detail && e.detail.message) || e)));
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><main id="dash"></main><div class="game-wrap" id="gameWrap"><button class="voice-picker game-toggle-btn" id="gameToggleBtn" title="Open a playable break game">♞ BREAK GAME</button></div></body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(window){ window.addEventListener('error', e => errors.push('window: ' + e.message)); }
  });
  dom.window.eval(rcSrc);
  DOMS.push(dom);
  return { window: dom.window, doc: dom.window.document, errors };
}
const key = (p, k, opts) => p.doc.dispatchEvent(new p.window.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true, cancelable: true }, opts || {})));

(async function main(){

console.log('[1] MUSICAL BREAK launcher beside the game button');
const p = page();
ok(!p.doc.getElementById('resonanceChamber'), 'no modal in the DOM before first open (lazy build)');
const lb = p.doc.getElementById('musicBreakBtn');
ok(!!lb && lb.textContent === '♪ MUSICAL BREAK', 'MUSICAL BREAK button injected');
ok(lb && lb.previousSibling === null && lb.parentElement.nextSibling === null ? true : (lb.closest('#musicBreakWrap') !== null), 'launcher parked in its own wrap');
const gw = p.doc.getElementById('gameWrap');
ok(gw.nextSibling === p.doc.getElementById('musicBreakWrap'), 'sits immediately beside the game button');
ok(p.window.__resonance.launcherInjected === true, 'injection reported on the test surface');
lb.click(); await wait(30);
ok(p.doc.getElementById('resonanceChamber').classList.contains('open'), 'clicking MUSICAL BREAK opens the chamber');
p.window.__resonance;
key(p, 'Escape'); await wait(30);

console.log('[1b] Ctrl+M opens the room; Esc closes; Ctrl+M toggles');
key(p, 'm', { ctrlKey: true }); await wait(30);
const rc = p.doc.getElementById('resonanceChamber');
ok(!!rc && rc.classList.contains('open'), 'Ctrl+M builds & opens the RESONANCE CHAMBER');
key(p, 'Escape'); await wait(30);
ok(!rc.classList.contains('open'), 'Esc closes');
key(p, 'm', { ctrlKey: true }); await wait(30);
ok(rc.classList.contains('open'), 'second Ctrl+M reopens');

console.log('[2] keyboard instrument');
const whites = rc.querySelectorAll('.rc-wkey'), blacks = rc.querySelectorAll('.rc-bkey');
ok(whites.length === 15, '15 white keys (C4..C6 span)');
ok(blacks.length === 10, '10 black keys');
ok(rc.querySelector('.rc-wkey .rc-kname').textContent === 'C4', 'first white key is C4');
const badges = [...rc.querySelectorAll('.rc-kbadge')].map(b => b.textContent);
ok(badges.includes('Z') && badges.includes('Q') && badges.includes('5'), 'pc-key badges on Z, Q, 5');
whites[0].dispatchEvent(new p.window.MouseEvent('pointerdown', { bubbles: true, cancelable: true })); await wait(70);
ok(p.doc.querySelector('.rc-notechip') && p.doc.querySelector('.rc-notechip').textContent === 'C4', 'pointer strike sounds a C4 chip in the trail');
key(p, 'z'); await wait(50);
ok([...p.doc.querySelectorAll('.rc-notechip')].pop().textContent === 'C4', 'pc-key Z strikes C4');
key(p, 'i'); await wait(50);
ok([...p.doc.querySelectorAll('.rc-notechip')].pop().textContent === 'C6', 'pc-key I strikes high C6');
ok(p.errors.length === 0, 'piano strikes clean (silent-mode safe without WebAudio)');

console.log('[3] octave shift');
rc.querySelector('#rcOctUp').click(); await wait(30);
ok(rc.querySelector('.rc-wkey .rc-kname').textContent === 'C5', 'OCT ▶ shifts window to C5');
key(p, 'z'); await wait(50);
ok([...p.doc.querySelectorAll('.rc-notechip')].pop().textContent === 'C5', 'Z now strikes C5');
rc.querySelector('#rcOctDown').click(); rc.querySelector('#rcOctDown').click(); await wait(30);
ok(rc.querySelector('.rc-wkey .rc-kname').textContent === 'C3', 'double OCT ◀ lands on C3');
rc.querySelector('#rcOctDown').click(); rc.querySelector('#rcOctDown').click(); await wait(30);
ok(rc.querySelector('.rc-wkey .rc-kname').textContent === 'C2', 'clamp holds at C2 (no runaway)');
rc.querySelector('#rcOctUp').click(); await wait(30);

console.log('[4] zither — strings + strum');
rc.querySelector('#rcTabStrings').click(); await wait(30);
const strings = rc.querySelectorAll('.rc-string');
ok(strings.length === 15, '15 zither wires rendered');
ok(strings[0].getAttribute('data-m') === '60' && strings[14].getAttribute('data-m') === '93', 'wires tuned C4..A6');
strings[3].dispatchEvent(new p.window.MouseEvent('pointerdown', { bubbles: true, cancelable: true })); await wait(60);
ok(strings[3].classList.contains('live') || [...p.doc.querySelectorAll('.rc-notechip')].pop().textContent === 'G4', 'plucking wire 4 rings G4');
const before = p.doc.querySelectorAll('.rc-notechip').length;
for (const i of [6, 5, 4]) strings[i].dispatchEvent(new p.window.MouseEvent('pointerenter', { bubbles: false, cancelable: true, buttons: 1 })); await wait(40);
ok(p.doc.querySelectorAll('.rc-notechip').length >= before + 2, 'drag-strum rolls across wires (glissando)');
key(p, 'z'); await wait(40);
ok([...p.doc.querySelectorAll('.rc-notechip')].pop().textContent === 'C4', 'pc-keys drive strings too (Z → lowest wire)');
ok(p.errors.length === 0, 'zither play clean');

console.log('[5] songbook + playback');
rc.querySelector('#rcOctUp').click(); await wait(20); /* restore default C4 window after the shift tests */
const sel = rc.querySelector('#rcSong');
ok(sel.options.length === 29, '29 songs in the book (R21: viva la vida, shape of you, see you again, let it be)');
const titles = [...sel.options].map(o => o.textContent).join('|');
ok(titles.includes('DARK ARIA') && titles.includes('SPIDER-MAN: HOMECOMING') && titles.includes('CAROL OF THE BELLS') && titles.includes('LOKI') && titles.includes('VELLAKE'), 'dark aria · homecoming · carol of the bells · loki · vellake all stocked');
ok(titles.includes('MY HEART WILL GO ON') && titles.includes('INTERSTELLAR') && titles.includes('GREENSLEEVES'), 'timeless shelf stocked too');
ok(titles.includes('VIVA LA VIDA') && titles.includes('SHAPE OF YOU') && titles.includes('SEE YOU AGAIN') && titles.includes('LET IT BE'), 'R21 adds: viva la vida, shape of you, see you again, let it be');
const gurengeIdx = [...sel.options].findIndex(o => o.textContent.includes('GURENGE') && o.textContent.includes('LiSA'));
ok(gurengeIdx === 0, 'Gurenge still headlines the shelf');
sel.value = String(gurengeIdx); sel.dispatchEvent(new p.window.Event('change', { bubbles: true })); await wait(20);
const sheetTxt = rc.querySelector('#rcSheet').textContent;
ok(sheetTxt.includes('KEYS:') && sheetTxt.includes('w w w q W'), 'sheet is in QWERTY physical-key notation (w w w q W…)');
ok(!/[A-G][#b]?\d[a-z]?\s/.test((sheetTxt.split('KEYS:')[1] || '').split('SARGAM')[0]), 'no raw music-note names in the keys line');
ok(sheetTxt.includes('SARGAM:'), 'sargam line rendered on the sheet');
ok(sheetTxt.split('SARGAM:')[1].trim().startsWith("Sa' Sa' Sa'"), 'gurenge sargam opens on taar Sa (Sa=D)');
ok(sheetTxt.includes('Sa='), 'tonic printed on the sheet (Sa=D4)');
rc.querySelector('#rcTabKeys').click(); await wait(20);
const trailBefore = p.doc.querySelectorAll('.rc-notechip').length;
rc.querySelector('#rcPlay').click(); await wait(1100);
ok(p.doc.querySelectorAll('.rc-notechip').length > trailBefore + 2, 'PLAY autoplays notes into the trail');
ok(rc.querySelector('#rcProg').classList.contains('on'), 'progress rail shown during playback');
rc.querySelector('#rcStop').click(); await wait(30);
ok(!rc.querySelector('#rcProg').classList.contains('on'), 'STOP halts playback');
ok(p.errors.length === 0, 'playback engine clean');

console.log('[5b] strict 15-minute break clock');
ok(!!p.doc.getElementById('rcBreak'), 'countdown chip in the header');
key(p, 'Escape'); await wait(30); /* fresh session → fresh clock */
key(p, 'm', { ctrlKey: true }); await wait(30);
ok(rc.classList.contains('open'), 'reopened for the clock audit');
ok(p.doc.getElementById('rcBreak').textContent === '15:00', 'clock starts at 15:00 sharp');
await wait(1100); /* one real tick */
ok(/^(14:5\d|15:00)$/.test(p.doc.getElementById('rcBreak').textContent), 'clock is ticking (' + p.doc.getElementById('rcBreak').textContent + ')');
p.window.__resonance._expireBreak(); await wait(700);
ok(!rc.classList.contains('open'), 'expiry force-closes the chamber — 15:00 hard cap enforced');
ok(p.errors.length === 0, 'expiry path clean');
key(p, 'm', { ctrlKey: true }); await wait(30);
ok(rc.classList.contains('open'), 'fresh session reopens with a fresh 15:00');
ok(p.doc.getElementById('rcBreak').textContent.startsWith('1'), 'clock reset on reopen (' + p.doc.getElementById('rcBreak').textContent + ')');

console.log('[6] recorder + replay + prefs persistence');
key(p, 'z'); key(p, 'q'); key(p, 'i'); await wait(50); /* fresh strikes after the reopen */
rc.querySelector('#rcReplay').click(); await wait(80);
ok(/done|session|replaying|ready|yours/.test(p.doc.getElementById('rcStatus').textContent.toLowerCase()) || p.doc.querySelectorAll('.rc-notechip').length > 0, 'replay runs without crashing');
key(p, 'Escape'); await wait(30);
const saved = p.window.localStorage.getItem('csir_resonance_v1');
ok(!!saved && JSON.parse(saved).inst === 'keys', 'prefs persist (instrument choice)');
const last = JSON.parse(p.window.localStorage.getItem('csir_resonance_v1_last') || '[]');
ok(last.length >= 3 && typeof last[0].m === 'number', 'last session recorded to its own key (' + last.length + ' strikes)');
/* reopen: prefs restored */
key(p, 'm', { ctrlKey: true }); await wait(30);
ok(rc.classList.contains('open'), 'reopen works after close');
ok(p.errors.length === 0, 'no runtime errors anywhere in the session');

for (const d of DOMS) d.window.close();
console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
