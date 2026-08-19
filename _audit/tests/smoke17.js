/* smoke17 (jsdom) — Round 16 EMBEDDED backdrops against the REAL shipped file:
   full chain rot(14) → shuffle(15) → boot(13) → embed(16), same parse order as shipped. */
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
ok(proj.includes('ROUND 16 — EMBEDDED BOOT BACKDROPS'), 'round-16 block present in deliverable');
ok((proj.match(/"boot-bg-[\w-]+-hq\.jpg":"data:image\/jpeg;base64,/g) || []).length === 5, 'exactly 5 keyed JPEG data URIs embedded in the map');
ok(proj.indexOf('ROUND 14 — BOOT BACKGROUND ROTATION (game-free') < proj.indexOf('ROUND 16 — EMBEDDED') &&
   proj.indexOf('ROUND 15 — BOOT BACKGROUND SHUFFLE (manual') < proj.indexOf('ROUND 16 — EMBEDDED'),
   'embed script parses AFTER rotation + shuffle (patch targets exist)');

console.log('[1] auto-greet paints an EMBEDDED frame');
let p = makePage();
await wait(100);
const ov = p.doc.getElementById('bootCenterOverlay');
ok(!!ov, 'overlay auto-opened');
const bg = ov.style.getPropertyValue('--boot-bg');
ok(isDataJpeg(bg), 'first open = data URI frame (self-contained, no file fetch)');
ok(bg.length > 600000, 'payload is the full HQ frame (' + Math.round(bg.length/1024) + ' KB)');
ok(p.window.__bootBgEmbed && p.window.__bootBgEmbed.active === true, 'embed layer flagged active');
ok(p.window.localStorage.getItem('csir_boot_bg_ptr_v1') === '1', 'rotation pointer still advances exactly once');
ok(p.errors.length === 0, 'no runtime errors');

console.log('[2] shuffle → next embedded frame (never a file name)');
const btn = p.doc.getElementById('bootShuffle');
ok(!!btn, 'shuffle button injected');
const map = p.window.__bootBgEmbed.map;
const framesSeen = new Set([bg]);
btn.click(); await wait(40);
const bg2 = ov.style.getPropertyValue('--boot-bg');
ok(isDataJpeg(bg2), 'post-shuffle value is a data URI');
ok(bg2 !== bg, 'frame actually changed');
ok(framesSeen.add(bg2) && framesSeen.size === 2, 'distinct frame landed');
ok(!/boot-bg-[\w-]+-hq\.jpg/.test(bg2.replace(/data:image\/jpeg;base64,[A-Za-z0-9+/=]{100}/,'')), 'no stray file-name reference in the stamped value');
ok(p.errors.length === 0, 'zero errors');

console.log('[3] reopened overlay still embedded (upgrade observer on fresh node)');
p.window.__bootCenter.hide(); await wait(30);
p.window.__bootCenter.show(); await wait(80);
const ov2 = p.doc.getElementById('bootCenterOverlay');
ok(!!ov2, 'overlay rebuilt');
const bg3 = ov2.style.getPropertyValue('--boot-bg');
ok(isDataJpeg(bg3), 'reopened overlay paints embedded frame via patch stack');
ok(bg3 !== bg2, 'sequence continued (not stuck on previous frame)');
ok(p.errors.length === 0, 'no errors after reopen');

console.log('[4] map covers the whole pool');
const pool = p.window.__bootBgRotation.pool;
ok(pool.every(f => typeof map[f] === 'string' && map[f].startsWith('data:image/jpeg;base64,')), 'every pool frame has an embedded counterpart');

console.log('\nsmoke17: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error('SMOKE CRASH:', e); process.exit(1); });
