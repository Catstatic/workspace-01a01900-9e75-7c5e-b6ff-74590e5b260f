/* smoke20 (jsdom) — ROUND 22 STATIC-FIRST BOOT: the shipped static overlay is
   ADOPTED by the round-13 engine (no duplicate build), the guardian hydrates the
   date + honors skip-today pre-paint, late force-show still works, and the veil
   now lives strictly *beneath* the deck. */
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
const bootSrc = extractScript('ROUND 13 — BOOT COMMAND CENTER');
/* the static overlay block: from the R22 audit banner to the guardian script's close */
let i0 = proj.indexOf('ROUND 22 — STATIC-FIRST BOOT COMMAND CENTER');
i0 = proj.lastIndexOf('<!--', i0); /* banner is a decorated comment — anchor to its real start */
ok(i0 > 0, 'R22 banner located in shipped file');
const staticBlock = proj.slice(i0, proj.indexOf('</script>', i0) + 9);
ok(staticBlock.includes('id="bootCenterOverlay"') && staticBlock.includes('ROUND 22 guardian'), 'static deck block extracted (' + staticBlock.length + ' bytes)');
/* guardian script alone (for pre-paint tests in un-skipped pages) */
const g0 = staticBlock.indexOf('/* ROUND 22 guardian');
const guardianSrc = staticBlock.slice(g0, staticBlock.lastIndexOf('</script>'));
const staticHtml = staticBlock.slice(staticBlock.indexOf('<div id="bootCenterOverlay"'), g0).replace(/<script[\s\S]*$/, '').trim();

const FIXTURE = '<div id="panel-dashboard"><section id="commandCenterCard" class="command-center-card"><div class="command-center-head">DAILY OPERATING SYSTEM</div><div class="command-center-body">LIVE CARD</div></section></div>';
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };

function page(withStatic, skipPreset, runGuardian){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e)));
  const bodyHtml = (withStatic ? staticHtml : '') + FIXTURE;
  const dom = new JSDOM('<!DOCTYPE html><html><body>' + bodyHtml + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc
  });
  const { window } = dom;
  if (skipPreset) window.localStorage.setItem('csir_boot_skip_v1', skipPreset);
  if (withStatic && runGuardian !== false) window.eval(guardianSrc);
  window.eval(bootSrc);
  DOMS.push(dom);
  return { window, doc: window.document, errors };
}

(async function main(){

console.log('[1] static deck + guardian + engine = adopted, never duplicated');
let p = page(true, null, true);
await wait(40);
let ovs = p.doc.querySelectorAll('#bootCenterOverlay');
ok(ovs.length === 1, 'exactly one overlay — engine adopted the static node, did not build a second');
let ov = ovs[0];
ok(ov.__bootWired === true, 'adopted node got wired by the engine');
ok(p.doc.getElementById('bootDate').textContent.endsWith('· SHIFT BEGINS'), 'guardian wrote the real date pre-paint');
ok(p.doc.getElementById('bootQuoteText').textContent.length > 10, 'quote hydrated: "' + p.doc.getElementById('bootQuoteText').textContent.slice(0, 30) + '…"');
ok(!p.doc.querySelector('.boot-cc-pending'), 'sync shimmer cleared…');
ok(ov.querySelector('#commandCenterCard') !== null, '…and the LIVE dashboard card docked into the slot');
ok(p.doc.body.classList.contains('boot-open'), 'scroll lock on');
ok(p.errors.length === 0, 'adoption clean');

console.log('[2] dismiss + restore + late force-show');
ov.querySelector('#bootEnter').click(); await wait(30);
ok(p.doc.querySelectorAll('#bootCenterOverlay').length === 0, 'ENTER dismisses the adopted deck');
ok(p.doc.querySelector('#panel-dashboard > #commandCenterCard') !== null, 'live card restored to the dashboard home (nothing lost)');
ok(!p.doc.body.classList.contains('boot-open'), 'scroll lock released');
p.window.__bootCenter.show(); await wait(30); /* force-show: static node is gone → JS build path must take over */
ovs = p.doc.querySelectorAll('#bootCenterOverlay');
ok(ovs.length === 1 && ovs[0].__bootWired === true, 'force-show rebuilds via the JS template path');
ok(ovs[0].querySelector('#commandCenterCard') !== null, 'card re-docks on the rebuilt deck');
ok(p.errors.length === 0, 'rebuild path clean');
p.window.__bootCenter.hide(); await wait(20);
ok(p.doc.querySelectorAll('#bootCenterOverlay').length === 0, 'hide tears down the rebuilt deck too');

console.log('[3] skip-today honored pre-paint (guardian) and respected by the engine');
p = page(true, todayKey(), true);
await wait(40);
ov = p.doc.getElementById('bootCenterOverlay');
ok(ov && ov.style.display === 'none', 'guardian hid the deck before any paint (skip-today set)');
ok(ov.__bootWired !== true, 'engine stood down — adoption never ran');
ok(!p.doc.body.classList.contains('boot-open'), 'no scroll lock on a skipped morning');
ok(p.doc.querySelectorAll('#bootCenterOverlay').length === 1, 'still exactly one node — nothing duplicated');
p.window.__bootCenter.show(); await wait(30); /* user explicitly asks → deck must rise despite skip */
ov = p.doc.getElementById('bootCenterOverlay');
ok(ov.style.display === '' && ov.__bootWired === true, 'explicit Ctrl-free force-show reverses the guardian hide and wires the deck');
ok(p.errors.length === 0, 'skip flow clean');

console.log('[4] veil lifts instantly now (overlay always exists)');
{
  const veilHtml = (() => { const i = proj.indexOf('<!-- ROUND 17 — INSTANT BOOT VEIL'); return proj.slice(i, proj.indexOf('</script>', i) + 9); })();
  const dom = new JSDOM('<!DOCTYPE html><html><body>' + staticHtml + veilHtml + FIXTURE + '</body></html>', { url: 'https://tracker.test/', runScripts: 'dangerously' });
  DOMS.push(dom);
  await wait(120);
  const veil = dom.window.document.getElementById('bootVeil');
  ok(!veil || veil.classList.contains('gone'), 'veil dropped the moment it saw the static deck (no dashboard flash window at all)');
}

for (const d of DOMS) d.window.close();
console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
