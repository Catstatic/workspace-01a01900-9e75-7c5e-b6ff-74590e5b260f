/* smoke16 (jsdom) — Round 15 SHUFFLE button against the REAL shipped scripts. */
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
const shufSrc = extractScript('ROUND 15 — BOOT BACKGROUND SHUFFLE (manual re-roll)');
const rotSrc  = extractScript('ROUND 14 — BOOT BACKGROUND ROTATION');
const bootSrc = extractScript('ROUND 13 — BOOT COMMAND CENTER');

const FIXTURE = '<div id="panel-dashboard"><section id="commandCenterCard" class="command-center-card"><div class="command-center-head">DAILY OPERATING SYSTEM</div></section></div>';
const wait = ms => new Promise(r => setTimeout(r, ms));

function makePage(){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e)));
  const dom = new JSDOM('<!DOCTYPE html><html><body>' + FIXTURE + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc
  });
  DOMS.push(dom);
  const w = dom.window;
  w.eval(rotSrc); w.eval(shufSrc); w.eval(bootSrc); /* parse order 14→15→13 mirrors ship; greet fires last */
  return { window: w, doc: w.document, errors };
}

(async function main(){

console.log('[0] shipped statics');
ok(proj.includes('.boot-shuffle{'), 'shuffle button chrome ships in CSS');
ok(proj.indexOf('ROUND 14 — BOOT BACKGROUND') < proj.indexOf('ROUND 15 — BOOT BACKGROUND'),
   'CSS + JS both land in 14 → 15 order');

console.log('[1] button appears on auto-greet');
let p = makePage();
await wait(80);
let ov = p.doc.getElementById('bootCenterOverlay');
ok(!!ov, 'overlay auto-opened');
let btn = p.doc.getElementById('bootShuffle');
ok(!!btn, 'shuffle button injected into the boot header');
ok(btn && btn.getAttribute('aria-label') === 'Shuffle backdrop', 'a11y label present');
ok(btn && btn.parentNode === ov.querySelector('.boot-head'), 'button lives inside .boot-head');
ok(p.errors.length === 0, 'no runtime errors');

console.log('[2] click shuffles to a different frame, pointer follows');
const bg0 = ov.style.getPropertyValue('--boot-bg');
btn.click();
await wait(40);
const bg1 = ov.style.getPropertyValue('--boot-bg');
ok(bg1 && bg1 !== bg0, 'backdrop changed: ' + bg0.match(/boot-bg-\w+/)[0] + ' → ' + bg1.match(/boot-bg-\w+/)[0]);
ok(p.window.localStorage.getItem('csir_boot_bg_ptr_v1') !== null, 'pointer persisted');
ok(btn.classList.contains('rolled'), 'dice roll animation class applied');

console.log('[3] double-click debounce (no frame skipping)');
const ptrBefore = p.window.localStorage.getItem('csir_boot_bg_ptr_v1');
await wait(450); /* release the 400ms lock from the first click */
btn.click(); btn.click(); /* second click lands inside lock window */
await wait(40);
const ptrAfter = p.window.localStorage.getItem('csir_boot_bg_ptr_v1');
ok(ptrAfter !== null && parseInt(ptrAfter, 10) === (parseInt(ptrBefore, 10) + 1) % 7,
   'only ONE advance registered (' + ptrBefore + ' → ' + ptrAfter + ') — R25: slots wrap mod 7');

console.log('[4] three more distinct clicks never repeat the visible frame');
const frames = [p.doc.getElementById('bootCenterOverlay').style.getPropertyValue('--boot-bg').match(/boot-bg-\w+-hq\.jpg/)[0]];
for (let i = 0; i < 3; i++){
  await wait(450);
  btn.click(); await wait(40);
  frames.push(p.doc.getElementById('bootCenterOverlay').style.getPropertyValue('--boot-bg').match(/boot-bg-\w+-hq\.jpg/)[0]);
}
let noRepeats = true;
for (let i = 1; i < frames.length; i++) if (frames[i] === frames[i - 1]) noRepeats = false;
ok(noRepeats, 'sequence ' + frames.map(f => f.replace('boot-bg-','').replace('-hq.jpg','')).join('→') + ' has no immediate repeats');
ok(p.errors.length === 0, 'zero runtime errors across all shuffles');

console.log('[5] close + reopen resumes after the shuffled frame (rotation + shuffle share one pointer)');
const lastVisible = frames[frames.length - 1];
const pool = ['boot-bg-void-hq.jpg','boot-bg-palace-hq.jpg','boot-bg-babel-hq.jpg','boot-bg-torii-hq.jpg','boot-bg-feynman-hq.jpg'];
const SCHED = [0, 4, 1, 4, 2, 4, 3]; /* R25 weighted walk */
const stored = parseInt(p.window.localStorage.getItem('csir_boot_bg_ptr_v1'), 10); /* read BEFORE reopen — the reopen itself advances one slot */
ok(pool[SCHED[(stored + 6) % 7]] === lastVisible, 'pointer sits exactly one schedule slot past the visible frame');
const expectedNext = pool[SCHED[stored % 7]];
p.window.__bootCenter.hide(); await wait(30);
p.window.__bootCenter.show(); await wait(60);
const ov2 = p.doc.getElementById('bootCenterOverlay');
const reopened = ov2.style.getPropertyValue('--boot-bg');
ok(reopened.includes(expectedNext), 'reopen shows ' + expectedNext.replace('boot-bg-','').replace('-hq.jpg','') + ' — weighted sequence continued from shuffle landing');
ok(p.window.localStorage.getItem('csir_boot_bg_ptr_v1') === String((stored + 1) % 7), 'reopen consumed exactly one slot');
ok(!!p.doc.getElementById('bootShuffle'), 'shuffle button re-injected on the fresh overlay');
ok(p.errors.length === 0, 'no errors after reopen');

console.log('\nsmoke16: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error('SMOKE CRASH:', e); process.exit(1); });
