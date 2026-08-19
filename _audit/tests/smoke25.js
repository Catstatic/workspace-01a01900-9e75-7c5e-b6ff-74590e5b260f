/* smoke25 (jsdom) — Round 28 APTIFORGE C5: the REAL shipped Content Vault code
   (extracted from the deliverable) runs against the REAL companions
   (content-data.js + aptitude-content.js) with REAL KaTeX auto-render.
   Asserts: 24-doc vault, physics-first order, 🧠 aptitude docs render with
   headings/trap blockquotes/outline, live KaTeX (zero errors, zero $$ residue),
   search hit-counts, font controls, data-merge integrity. */
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };
const DOMS = [];

const proj = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const marker = 'CONTENT VAULT — renders LOCAL_CONTENT_DATA';
const vIdx = proj.indexOf(marker);
const vStart = vIdx > -1 ? proj.lastIndexOf('<script>', vIdx) : -1; /* vault tag itself is a plain <script> */
const vEnd = vIdx > -1 ? proj.indexOf('</script>', vIdx) : -1;
const vaultSrc = (vIdx > -1 && vStart > -1 && vEnd > vStart) ? proj.slice(vStart + 8, vEnd) : null;
const contentSrc = fs.readFileSync('/home/user/project/content-data.js', 'utf8');
const aptiSrc = fs.readFileSync('/home/user/project/aptitude-content.js', 'utf8');
const katexSrc = fs.readFileSync('/tmp/domt/node_modules/katex/dist/katex.min.js', 'utf8');
const autoSrc = fs.readFileSync('/tmp/domt/node_modules/katex/dist/contrib/auto-render.min.js', 'utf8');

console.log('[0] shipped statics (R28 wiring in the deliverable itself)');
ok(!!vaultSrc, 'vault script extractable from deliverable');
ok(proj.split('<script src="./aptitude-content.js"></script>').length - 1 === 1, 'companion script tag exactly once');
ok(proj.indexOf('<script src="./content-data.js"></script>') < proj.indexOf('<script src="./aptitude-content.js"></script>')
   && proj.indexOf('<script src="./aptitude-content.js"></script>') < proj.indexOf('</head>'),
   'load order: content-data.js → aptitude-content.js → </head> (vault sees merged data)');
ok(vIdx > proj.indexOf('aptitude-content.js'), 'vault IIFE sits after the companion tag (head CSS comments use similar wording — marker is the vault banner itself)');

const FIXTURE = '<div id="panel-resources"><div class="section-head"><h2>Resource Index</h2></div></div>';

function makePage(){
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(String(e)));
  const dom = new JSDOM('<!DOCTYPE html><html><body>' + FIXTURE + '</body></html>', {
    url: 'https://tracker.test/', runScripts: 'dangerously', virtualConsole: vc, pretendToBeVisual: true
  });
  DOMS.push(dom);
  const w = dom.window;
  w.eval(contentSrc);      /* real physics companion first … */
  w.eval(aptiSrc);         /* … then aptitude self-mounts into LOCAL_CONTENT_DATA */
  w.eval(katexSrc);
  w.eval(autoSrc);
  w.eval(vaultSrc);        /* real shipped vault: build() fires immediately */
  return { window: w, doc: w.document, errors };
}
const change = (w, el) => el.dispatchEvent(new w.Event('change', { bubbles: true }));
const input  = (w, el) => el.dispatchEvent(new w.Event('input',  { bubbles: true }));

(function main(){

console.log('[1] merge — 12 physics + 12 aptitude, insertion order preserved');
const p = makePage(), w = p.window, doc = p.doc;
const DATA = w.LOCAL_CONTENT_DATA, META = w.APTITUDE_CONTENT_META;
ok(DATA && typeof DATA === 'object', 'LOCAL_CONTENT_DATA exists on window');
const keys = Object.keys(DATA);
ok(keys.length === 24, '24 docs total (12 physics + 12 aptitude) — got ' + keys.length);
ok(keys.slice(0, 12).every(k => k.indexOf('🧠') === -1), 'docs 1–12 all physics (no 🧠 leak into the physics block)');
ok(keys.slice(12).every(k => k.indexOf('🧠 A') === 0), 'docs 13–24 all carry the 🧠 group prefix');
ok(JSON.stringify(keys.slice(12)) === JSON.stringify(META.modules.map(m => m.file)),
   'aptitude order A1→A12 matches META module order exactly');
ok(typeof w.renderMathInElement === 'function', 'KaTeX auto-render live in page');
ok(p.errors.length === 0, 'zero errors during companion + vault boot');

console.log('[2] vault chrome');
const vault = doc.getElementById('contentVault');
ok(!!vault, '#contentVault injected into #panel-resources');
ok(!!doc.querySelector('#panel-resources .content-vault-shell'), 'vault lives inside the resources panel');
const select = doc.getElementById('contentSubject');
ok(select && select.options.length === 24, 'subject select lists all 24 notes');
ok(select.options[0].textContent !== select.options[0].value.replace(/\.md$/, ''), 'physics option label comes from the base labels map (not the raw filename): “' + select.options[0].textContent + '”');
ok(Array.from(select.options).slice(0, 24).every(o => o.textContent.indexOf('.md') === -1), 'no raw .md filenames leak into the select UI');
ok(select.options[12].textContent === '🧠 A1 · Number Sense & Arithmetic Toolkit',
   'aptitude fallback labels strip .md and keep the 🧠 badge');
ok(doc.getElementById('contentVaultCount').textContent === '24 SUBJECT NOTE SETS', 'counter badge reads 24 SUBJECT NOTE SETS');
ok(!!doc.getElementById('contentSearch') && !!doc.getElementById('contentOutline') && !!doc.getElementById('contentReader'),
   'search box, outline, reader all present');

console.log('[3] default render (physics lead doc, untouched by the merge)');
let reader = doc.getElementById('contentReader');
ok(reader.querySelectorAll('h1,h2').length > 0, 'physics doc rendered headings');
ok(reader.querySelectorAll('.katex').length > 0, 'physics math still renders through KaTeX (' + reader.querySelectorAll('.katex').length + ' spans)');
ok(reader.querySelectorAll('.katex-error').length === 0, 'no KaTeX errors on physics doc');

console.log('[4] select 🧠 A1 — full aptitude render path');
select.value = keys[12]; change(w, select);
const h1 = reader.querySelector('h1');
ok(h1 && h1.textContent.indexOf('APTITUDE · A1') > -1, 'A1 header renders: ' + (h1 ? h1.textContent.slice(0, 48) : '—'));
ok(h1 && h1.textContent.indexOf('🧠') === 0, '🧠 emoji badge survives markdown → HTML');
const katexN = reader.querySelectorAll('.katex').length;
ok(katexN >= 30, 'A1 formula sheet + examples render to ' + katexN + ' KaTeX spans (≥30)');
ok(reader.querySelectorAll('.katex-error').length === 0, 'zero .katex-error nodes in A1');
ok(reader.textContent.indexOf('$$') === -1, 'no raw $$ residue (all display math consumed)');
ok(reader.querySelectorAll('blockquote').length >= 8, 'trap callouts render as blockquotes (' + reader.querySelectorAll('blockquote').length + ')');
ok(reader.querySelectorAll('ol li').length >= 12, 'numbered formula sheet survived (<ol> route — no pipe tables)');
const outlineBtns = doc.querySelectorAll('#contentOutline button');
ok(outlineBtns.length >= 5, 'outline populated from A1 headings (' + outlineBtns.length + ' buttons)');
ok(outlineBtns[0].className === 'level-1', 'outline levels map h1 → level-1');
let status = reader.querySelector('.content-vault-status').textContent;
ok(status.indexOf('local content') > -1 && status.indexOf('k characters') > -1, 'status line: label + size + “local content”');

console.log('[5] WORKED EXAMPLES + SPEED SHEET sections intact');
const headings = Array.from(reader.querySelectorAll('h1,h2')).map(h => h.textContent); /* PART banners are `# ` → h1; speed sheet is `## ` → h2 */
ok(headings.some(h => h.indexOf('CONCEPT CARDS') > -1), 'PART 1 · CONCEPT CARDS present');
ok(headings.some(h => h.indexOf('FORMULA SHEET') > -1), 'PART 2 · FORMULA SHEET present');
ok(headings.some(h => h.indexOf('WORKED EXAMPLES') > -1), 'PART 3 · WORKED EXAMPLES present');
ok(headings.some(h => h.indexOf('SPEED SHEET') > -1), 'SPEED SHEET present');
ok(reader.textContent.indexOf('WHERE STUDENTS BLEED') > -1, 'trap banner text survives');

console.log('[6] search — hit counter on aptitude content');
const search = doc.getElementById('contentSearch');
search.value = 'percent'; input(w, search);
status = reader.querySelector('.content-vault-status').textContent;
const mHits = status.match(/(\d+) matches?/);
ok(mHits && parseInt(mHits[1], 10) > 0, '“percent” → ' + (mHits ? mHits[1] : 0) + ' matches counted in status line');
search.value = 'zzqnotaword'; input(w, search);
status = reader.querySelector('.content-vault-status').textContent;
ok(status.indexOf('0 matches') > -1, 'zero-hit query reports “0 matches” (base behaviour: badge always shown when query non-empty)');
search.value = ''; input(w, search);

console.log('[7] font controls');
ok(reader.style.fontSize === '', 'reader starts at stylesheet size');
doc.getElementById('contentTextLarger').click();
ok(reader.style.fontSize === '16.8px', 'A+ bumps to 16.8px — got ' + reader.style.fontSize);
doc.getElementById('contentTextSmaller').click(); /* delta is relative: 16.8 − 0.8 = 16.0 */
ok(reader.style.fontSize === '16px', 'A− once lands back at 16px');
doc.getElementById('contentTextSmaller').click();
ok(reader.style.fontSize === '15.2px', 'A− again continues down to 15.2px (no stall)');
ok(parseFloat(reader.style.fontSize) <= 23, 'within clamp ceiling');

console.log('[8] deep-select 🧠 A12 (Exam Craft) — order independence');
select.value = keys[23]; change(w, select);
const h1b = reader.querySelector('h1');
ok(h1b && h1b.textContent.indexOf('APTITUDE · A12') > -1, 'A12 renders after re-select');
ok(reader.textContent.indexOf('expected value') > -1 || reader.textContent.indexOf('Expected Value') > -1 || reader.textContent.indexOf('EV') > -1,
   'EV-ledger content present');
ok(reader.querySelectorAll('.katex').length >= 5, 'A12 math renders (' + reader.querySelectorAll('.katex').length + ' spans)');
ok(reader.querySelectorAll('.katex-error').length === 0, 'zero .katex-error nodes in A12');

console.log('[9] data integrity after all renders (vault is read-only)');
ok(Object.keys(DATA).length === 24, 'LOCAL_CONTENT_DATA still 24 keys after 3 renders');
ok(keys.every(k => DATA[k] && DATA[k].length > 9000), 'every doc still ≥9k chars (nothing clobbered)');
ok(p.errors.length === 0, 'zero runtime errors across the whole smoke');

console.log('\nsmoke25: ' + passed + ' passed, ' + failed + ' failed');
DOMS.forEach(d => d.window.close());
process.exit(failed ? 1 : 0);
})();
