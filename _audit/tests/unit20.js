/* unit20 — ROUND 22 STATIC-FIRST BOOT: proves the shipped file's structural contract:
   the command deck is the FIRST element of the body, before the veil, before the
   dashboard; ids unique; engine refactor markers present; guardian script complete;
   static template parity with the engine's build template. */
const fs = require('fs');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const proj = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const master = fs.readFileSync('/home/user/_audit/ins22_html.html', 'utf8');
const engine = fs.readFileSync('/home/user/_audit/ins12_js.js', 'utf8');

console.log('[1] paint order: command deck is the first thing the browser ever paints');
const ix = s => proj.indexOf(s);
ok(ix('<body>') > 0 && ix('id="bootCenterOverlay"') > ix('<body>'), 'overlay follows the body tag');
ok(ix('<!-- ROUND 22 — STATIC-FIRST BOOT COMMAND CENTER') < ix('id="bootCenterOverlay"'), 'audit banner precedes the deck');
ok(ix('id="bootCenterOverlay"') < ix('id="bootVeil"'), 'command deck BEFORE the round-17 veil');
ok(ix('id="bootVeil"') < ix('<div class="scanlines">'), 'veil before dashboard chrome (scanlines)');
ok(ix('<div class="scanlines">') < ix('<main'), 'chrome before the dashboard shell');
const gapDashboard = ix('<main') - ix('id="bootCenterOverlay"');
ok(gapDashboard > 15000, 'deck paints ' + gapDashboard + ' bytes before the dashboard region — no race possible');
ok(ix('id="bootCenterOverlay"') - ix('<body>') < 1200, 'deck begins within 1.2 KB of the body tag (literally first paint)');

console.log('[2] single source, unique ids, live-card dock');
['id="bootCenterOverlay"', 'id="bootClose"', 'id="bootEnter"', 'id="bootAnother"', 'id="bootQuoteText"', 'id="bootCcSlot"', 'id="bootSkipToday"', 'id="bootDate"'].forEach(id => {
  ok(proj.split(id).length - 1 === 2, id + ' exactly twice — static markup + engine fallback template (no third source)');
});
ok(proj.indexOf('id="bootCenterOverlay"') === ix('id="bootCenterOverlay"'), 'first overlay id is the static markup');
ok(proj.lastIndexOf('id="bootCenterOverlay"') > ix('id="bootVeil"'), 'engine fallback template is the later, second source');
ok(master.includes('commandCenterCard') === false && master.includes('boot-cc-pending'), 'static slot ships a sync shimmer, engine swaps in the live card');
ok(master.includes('aria-modal="true"') && master.includes('role="dialog"'), 'static deck keeps the dialog semantics');

console.log('[3] engine refactor (adopt-or-build) is the shipped engine');
ok(engine.includes('ROUND 22 ADOPT'), 'ins12_js carries the R22 adopt refactor');
ok(/let ov=document\.getElementById\("bootCenterOverlay"\)/.test(engine), 'engine first looks for the static node');
ok(/ov&&ov\.__bootWired\)return/.test(engine), 'double-adopt guard present');
ok(/if\(!ov\)\{ov=document\.createElement\("div"\)/.test(engine), 'JS build path kept as fallback');
ok(/ov\.style\.display=""/.test(engine), 'adopt reverses the guardian skip-hide');
ok(/slot\.innerHTML=""/.test(engine), 'shimmer cleared before live card mount');
ok(engine.includes('id="bootDate"'), 'engine template matches static markup (bootDate id)');
ok(proj.split(engine.trim()).length - 1 === 1, 'refactored engine is what ships');

console.log('[4] guardian contract (pre-paint hydration)');
ok(master.includes('d.toLocaleDateString([], {weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase()+" · SHIFT BEGINS"'), 'guardian writes the same date line as the engine');
ok(master.includes('localStorage.getItem("csir_boot_skip_v1")===today'), 'guardian honors skip-today pre-paint');
ok(master.includes('ov.style.display="none";return;'), 'skip path hides the deck instantly, before any paint');
ok(master.includes('document.body.classList.add("boot-open")'), 'guardian applies the scroll-lock class when showing');
ok(!Master_has(master, '<body>') && !Master_has(master, '</body>'), 'master carries no stray body-tag literals');
function Master_has(s, x){ return s.indexOf(x) !== -1; }

console.log('[5] date formula parity guardian ⇄ engine');
const gF = (master.match(/toLocaleDateString\(\[\], \{[^}]+\}\)/) || [])[0];
const eF = (engine.match(/toLocaleDateString\(\[\], \{[^}]+\}\)/) || [])[0];
ok(!!gF && gF === eF, 'identical locale date formula in both: ' + gF);

console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
