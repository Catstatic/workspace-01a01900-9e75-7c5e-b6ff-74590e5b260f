/* smoke22 (jsdom) — ROUND 25 FEYNMAN-FAVORED weighted rotation against the REAL shipped file:
   full chain rot(14) → shuffle(15) → boot(13) → embed(16), ship parse order.
   8 consecutive opens census: FEYNMAN must land 3×, every stamp embedded, zero repeats. */
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
const rotSrc   = extractScript('ROUND 14 — BOOT BACKGROUND ROTATION');
const shufSrc  = extractScript('ROUND 15 — BOOT BACKGROUND SHUFFLE');
const bootSrc  = extractScript('ROUND 13 — BOOT COMMAND CENTER');
const embedSrc = extractScript('ROUND 16 — EMBEDDED BOOT BACKDROPS');

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
  w.eval(rotSrc); w.eval(shufSrc); w.eval(bootSrc); w.eval(embedSrc); /* ship order */
  return { window: w, doc: w.document, errors };
}
const isDataJpeg = s => /^url\("data:image\/jpeg;base64,\/9j\//.test(s || '');

(async function main(){

console.log('[0] shipped statics');
ok(proj.includes('var SCHEDULE=[0,4,1,4,2,4,3];'), 'weighted schedule ships in the deliverable');
ok((proj.match(/var SCHEDULE=\[0,4,1,4,2,4,3\];/g) || []).length === 1, 'schedule declared exactly once (no duplicate rotation blocks)');
ok(proj.includes('ROUND 25 ▶ WEIGHTED WALK'), 'R25 rationale banner present in the shipped block');

console.log('[1] 8-open census on the real patch stack');
const p = makePage();
await wait(100);
let ov = p.doc.getElementById('bootCenterOverlay');
ok(!!ov, 'overlay auto-opened');
const map = p.window.__bootBgEmbed.map;
const stamp = f => 'url("' + map[f] + '")';
const seen = [ov.style.getPropertyValue('--boot-bg')];
for (let i = 0; i < 7; i++){
  p.window.__bootCenter.hide(); await wait(30);
  p.window.__bootCenter.show(); await wait(70);
  ov = p.doc.getElementById('bootCenterOverlay');
  seen.push(ov.style.getPropertyValue('--boot-bg'));
}
ok(seen.length === 8, '8 opens recorded');
ok(seen.every(isDataJpeg), 'all 8 frames stamped as embedded data URIs (self-contained)');
const count = f => seen.filter(s => s === stamp(f)).length;
ok(count('boot-bg-feynman-hq.jpg') === 3, 'FEYNMAN landed 3× in 8 opens (3/7 weight, end-to-end)');
ok(count('boot-bg-void-hq.jpg') === 2, 'VOID 2× (cycle head + wrap restart)');
ok(count('boot-bg-palace-hq.jpg') === 1 && count('boot-bg-babel-hq.jpg') === 1 && count('boot-bg-torii-hq.jpg') === 1,
   'PALACE/BABEL/TORII once each');
ok(seen[0] === stamp('boot-bg-void-hq.jpg'), 'boot #1 = VOID (cycle head)');
ok(seen[1] === stamp('boot-bg-feynman-hq.jpg'), 'boot #2 = FEYNMAN (bias hits immediately)');
ok(seen.every((s, i) => i === 0 || s !== seen[i - 1]), 'zero back-to-back repeats across all 8 opens');
ok(p.window.localStorage.getItem('csir_boot_bg_ptr_v1') === '1', 'pointer after 8 opens = slot 1 (full cycle + 1)');
ok(p.errors.length === 0, 'zero runtime errors across the whole census');

console.log('[2] shuffle still honours the weighted walk');
const btn = p.doc.getElementById('bootShuffle');
ok(!!btn, 'shuffle button present on the fresh overlay');
const before = ov.style.getPropertyValue('--boot-bg');
btn.click(); await wait(40);
const after = ov.style.getPropertyValue('--boot-bg');
ok(isDataJpeg(after) && after !== before, 'shuffle advanced to a different embedded frame');
ok(after === stamp('boot-bg-feynman-hq.jpg'), 'post-shuffle frame = FEYNMAN (slot 1 — pointer landed exactly where the census left it)');
ok(p.errors.length === 0, 'zero errors after shuffle');

console.log('\nsmoke22: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error('SMOKE CRASH:', e); process.exit(1); });
