/* smoke15 (jsdom) — Round 14 background rotation against the REAL shipped script.
   Faithful load order: rotation script evaluates BEFORE the boot script's auto-greet
   (mirrors shipped file, where both parse before DOMContentLoaded → observer armed
   before the first open). */
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
const rotSrc  = extractScript('ROUND 14 — BOOT BACKGROUND ROTATION (game-free');
const bootSrc = extractScript('ROUND 13 — BOOT COMMAND CENTER');

const FIXTURE = '<div id="panel-dashboard"><section id="commandCenterCard" class="command-center-card"><div class="command-center-head">DAILY OPERATING SYSTEM</div></section></div>';

function makePage(){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e)));
  const dom = new JSDOM('<!DOCTYPE html><html><body>' + FIXTURE + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc
  });
  DOMS.push(dom);
  return { window: dom.window, doc: dom.window.document, errors };
}
const wait = ms => new Promise(r => setTimeout(r, ms));

(async function main(){

console.log('[0] shipped-file statics');
ok(/\.boot-overlay::before\{background-image:var\(--boot-bg,url\("command-center-bg\.jpg"\)\),url\("command-center-bg\.svg"\)/.test(proj),
   'CSS consumes --boot-bg with jpg→svg fallback chain intact');
ok(proj.indexOf('ROUND 12 — BOOT') < proj.indexOf('ROUND 13 — BOOT') && proj.indexOf('ROUND 13 — BOOT') < proj.indexOf('ROUND 14 — BOOT'),
   'CSS block order 12 → 13 → 14 (cascade: rotation rule wins last)');
for (const f of ['boot-bg-void-hq.jpg','boot-bg-palace-hq.jpg','boot-bg-babel-hq.jpg','boot-bg-torii-hq.jpg'])
  ok(fs.existsSync('/home/user/project/' + f), 'companion ships: ' + f);
const oldBgStill = fs.existsSync('/home/user/project/command-center-bg.jpg') && fs.existsSync('/home/user/project/command-center-bg.svg');
ok(oldBgStill, 'legacy command-center-bg.{jpg,svg} kept as fallback when JS is off');

console.log('[1] auto-greet paints frame 0 (VOID)');
{
  const p = makePage();
  p.window.eval(rotSrc);   /* observer armed first, exactly like parse order */
  p.window.eval(bootSrc);  /* auto-greet fires now                       */
  await wait(40);
  const ov = p.doc.getElementById('bootCenterOverlay');
  ok(!!ov, 'boot overlay auto-opened');
  await wait(60); /* MutationObserver microtask flush */
  const bg = ov.style.getPropertyValue('--boot-bg');
  ok(bg.includes('boot-bg-void-hq.jpg'), 'first open = VOID (got ' + bg + ')');
  ok(p.window.localStorage.getItem('csir_boot_bg_ptr_v1') === '1', 'pointer advanced to 1 for the next open');
  ok(p.errors.length === 0, 'no runtime errors');

  console.log('[2] close + manual re-open → FEYNMAN (R25 weighted schedule, slot 1)');
  p.window.__bootCenter.hide();
  await wait(30);
  ok(!p.doc.getElementById('bootCenterOverlay'), 'overlay fully torn down (round-13 restore intact)');
  p.window.__bootCenter.show();
  await wait(60);
  const ov2 = p.doc.getElementById('bootCenterOverlay');
  ok(!!ov2, 'overlay rebuilt on manual show()');
  const bg2 = ov2.style.getPropertyValue('--boot-bg');
  ok(bg2.includes('boot-bg-feynman-hq.jpg'), 'second open = FEYNMAN already (got ' + bg2 + ')');
  ok(p.window.localStorage.getItem('csir_boot_bg_ptr_v1') === '2', 'pointer advanced to slot 2');
  ok(p.errors.length === 0, 'still zero runtime errors');

  console.log('[3] weighted cycle: PALACE → FEYNMAN → BABEL → FEYNMAN → TORII → wraps to VOID');
  const seq = [];
  for (let i = 0; i < 6; i++){
    p.window.__bootCenter.hide(); await wait(20);
    p.window.__bootCenter.show(); await wait(60);
    seq.push(p.doc.getElementById('bootCenterOverlay').style.getPropertyValue('--boot-bg'));
  }
  ok(seq[0].includes('boot-bg-palace-hq.jpg'), '3rd open = PALACE');
  ok(seq[1].includes('boot-bg-feynman-hq.jpg'),'4th open = FEYNMAN');
  ok(seq[2].includes('boot-bg-babel-hq.jpg'), '5th open = BABEL');
  ok(seq[3].includes('boot-bg-feynman-hq.jpg'),'6th open = FEYNMAN again (the R25 bias in action)');
  ok(seq[4].includes('boot-bg-torii-hq.jpg'), '7th open = TORII');
  ok(seq[5].includes('boot-bg-void-hq.jpg'),  '8th open wraps back to VOID (weighted cycle length 7)');
  const feynmanHits = [bg, bg2, ...seq].filter(v => v.includes('boot-bg-feynman-hq.jpg')).length;
  ok(feynmanHits === 3, 'across 8 opens FEYNMAN landed exactly 3× (got ' + feynmanHits + ') — 3/7 weight proven end-to-end');
  ok(p.errors.length === 0, 'zero errors across the whole cycle');
}

console.log('[4] public API present for debugging');
{
  const p = makePage();
  p.window.eval(rotSrc);
  const R = p.window.__bootBgRotation;
  ok(R && R.pool.length === 5 && typeof R.frame === 'function' && typeof R.nextIndex === 'function' && typeof R.paint === 'function',
     'window.__bootBgRotation exposes pool(5)/frame/nextIndex/paint');
  ok(Array.isArray(R.schedule) && R.schedule.join(',') === '0,4,1,4,2,4,3', 'weighted schedule exposed for debugging (feynman 3/7)');
  ok(R.pool.every(f => f.startsWith('boot-bg-')), 'pool entries are local companion files only (no http, no AI)');
}

console.log('\nsmoke15: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error('SMOKE CRASH:', e); process.exit(1); });
