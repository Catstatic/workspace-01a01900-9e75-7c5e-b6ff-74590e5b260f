/* smoke14 (jsdom) — Boot Command Center against the REAL shipped script. */
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
const bootSrc = extractScript('ROUND 13 — BOOT COMMAND CENTER');

const FIXTURE = `<div id="panel-dashboard"><div class="rank-hero"></div>
<section id="commandCenterCard" class="command-center-card"><div class="command-center-head">DAILY OPERATING SYSTEM</div><div class="command-center-body"><button data-command-action="route">OPEN</button></div></section>
</div>`;

function makePage(skipPreset){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e)));
  const dom = new JSDOM('<!DOCTYPE html><html><body>' + FIXTURE + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc
  });
  const { window } = dom;
  if (skipPreset) window.localStorage.setItem('csir_boot_skip_v1', skipPreset);
  window.eval(bootSrc);
  DOMS.push(dom);
  return { window, doc: window.document, errors };
}
const wait = ms => new Promise(r => setTimeout(r, ms));
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };

(async function main(){

console.log('[0] shipped-file statics');
ok(proj.includes('url("command-center-bg.svg")'), 'overlay CSS references the anime scene companion');
ok(/\.boot-overlay\{[^}]*z-index:12000/.test(proj), 'overlay pinned above every modal (z 12000)');
ok(fs.existsSync('/home/user/project/command-center-bg.svg'), 'command-center-bg.svg companion ships in project/');

console.log('[1] auto-greet on load (no skip set)');
let p = makePage(null);
await wait(30);
const ov = () => p.doc.getElementById('bootCenterOverlay');
ok(!!ov(), 'overlay auto-opens at startup');
ok(p.doc.body.classList.contains('boot-open'), 'body scroll locked while greeted');
const card = p.doc.getElementById('commandCenterCard');
ok(!!(card && ov().contains(card)), 'LIVE command center card mounted into the overlay (not a copy)');
const qEl = p.doc.getElementById('bootQuoteText');
ok(/^“[^”]{20,150}”$/.test(qEl.textContent), 'quote of the day rendered with quotes: "' + qEl.textContent.slice(0, 46) + '…"');
ok(qEl.textContent.includes(p.window.__bootCenter.quoteForDay(new Date())), 'auto pick matches the deterministic day quote');
const d1 = qEl.textContent;
let changed = false;
for (let i = 0; i < 8 && !changed; i++){ p.doc.getElementById('bootAnother').click(); await wait(10); changed = qEl.textContent !== d1; }
ok(changed, 'ANOTHER pull swaps the thought');
ok(p.errors.length === 0, 'no runtime errors while open');

console.log('[2] dismiss paths + card restoration');
p.doc.getElementById('bootSkipToday').checked = true;
p.doc.getElementById('bootEnter').click();
await wait(20);
ok(!ov(), 'ENTER closes the deck');
ok(p.window.localStorage.getItem('csir_boot_skip_v1') === todayKey(), 'skip-today persisted for ' + todayKey());
const dash = p.doc.getElementById('panel-dashboard');
ok(dash.contains(p.doc.getElementById('commandCenterCard')), 'live card restored into the dashboard slot');
ok(!p.doc.body.classList.contains('boot-open'), 'scroll lock released');

console.log('[3] honored skip + force reopen');
let p2 = makePage(todayKey());
await wait(30);
ok(!p2.doc.getElementById('bootCenterOverlay'), 'skip honored — no greet today');
p2.window.__bootCenter.show(); await wait(20);
ok(!!p2.doc.getElementById('bootCenterOverlay'), 'manual reopen still works (force)');
p2.doc.getElementById('bootCenterOverlay').dispatchEvent(new p2.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
await wait(20);
ok(!p2.doc.getElementById('bootCenterOverlay'), 'ESC dismisses');
ok(p2.doc.getElementById('panel-dashboard').contains(p2.doc.getElementById('commandCenterCard')), 'card restored after ESC');
ok(p2.errors.length === 0, 'no runtime errors in skipped/reopened session');

console.log('[4] graceful without the card');
const dom3 = new JSDOM('<!DOCTYPE html><html><body><p>no dashboard here</p></body></html>', { url: 'https://tracker.test/', runScripts: 'dangerously' });
DOMS.push(dom3);
dom3.window.eval(bootSrc);
await wait(30);
ok(!!dom3.window.document.querySelector('.boot-cc-fallback'), 'fallback message slot renders when the card is absent');
ok(!!dom3.window.document.getElementById('bootQuoteText').textContent.length, 'quote still works standalone');
dom3.window.document.getElementById('bootClose').click();
await wait(20);
ok(!dom3.window.document.getElementById('bootCenterOverlay'), '× closes cleanly in fallback mode');

console.log('==========================');
console.log('SMOKE14: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); DOMS.forEach(d => d.window.close()); process.exit(1); });
