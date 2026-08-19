/* REBUILD rounds 0–9 (persisted after 2026-08-14 fixture accident): splices the legacy
   masters ins0_topbar / ins_html / ins_css / ins_js..ins8_{js,css} onto a PRISTINE baseline,
   reproducing the anchor conventions the r10+ apply scripts depend on:
     - ins0_topbar: right after the theme-picker-wrap close in the topbar.
     - css masters: chained (trimmed, '\n\n'-joined) inside one <style> before </head>,
       order [ins_css, ins3, ins4, ins5, ins7, ins8] so r10's "ins9 after ins8 tail" works.
     - ins_html: immediately before </body>.
     - js masters: each in its own '\n<script>\n…\n\n</script>\n' before </body>,
       order [ins_js, ins2, ins3, ins4, ins5, ins6, ins7, ins8].
   Refuses to run unless the file is pristine (guard banner absent + byte match optional). */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const A = '/home/user/_audit/';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

if (doc.includes('AI FOUNDATION — provider-agnostic settings')){ console.error('ABORT: r0–r9 content already present'); process.exit(1); }

/* ---- ins0_topbar after theme-picker wrap ---- */
const top = fs.readFileSync(A + 'ins0_topbar.html', 'utf8'); /* RAW (keep trailing blank line) */
const topAnchor = 'themePickerDropdown"></div>\n    </div>\n';
if (n(doc, topAnchor) !== 1){ console.error('ABORT: topbar anchor not exactly once (' + n(doc, topAnchor) + ')'); process.exit(1); }
doc = doc.replace(topAnchor, () => topAnchor + top);
console.log('  ✔ ins0_topbar (' + top.length + ' chars)');

/* ---- css bundle in <head>, BEFORE the gate-pyq-data script tag ----
   (must NOT sit adjacent to </head>: r28's pair anchors content-data.js tag + </head>) */
const cssNames = ['ins_css.css','ins3_css.css','ins4_css.css','ins5_css.css','ins7_css.css','ins8_css.css'];
const css = cssNames.map(f => fs.readFileSync(A + f, 'utf8').replace(/\s+$/, '')).join('\n\n');
const headAnchor = '<script src="./gate-pyq-data.js"></script>';
if (n(doc, headAnchor) !== 1){ console.error('ABORT: head script anchor not exactly once'); process.exit(1); }
doc = doc.replace(headAnchor, () => '<style>\n' + css + '\n</style>\n' + headAnchor);
console.log('  ✔ css bundle (' + cssNames.join(', ') + ') = ' + css.length + ' chars');

/* ---- ins_html before </body> ---- */
const html = fs.readFileSync(A + 'ins_html.html', 'utf8').replace(/\s+$/, '');
if (n(doc, '</body>') !== 1){ console.error('ABORT: </body> not exactly once'); process.exit(1); }
doc = doc.replace('</body>', () => '\n' + html + '\n</body>');
console.log('  ✔ ins_html (' + html.length + ' chars)');

/* ---- js chain before </body> ---- */
for (const f of ['ins_js.js','ins2_js.js','ins3_js.js','ins4_js.js','ins5_js.js','ins6_js.js','ins7_js.js','ins8_js.js']){
  const js = fs.readFileSync(A + f, 'utf8').replace(/\s+$/, '');
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ' + f + ' (' + js.length + ' chars)');
}

fs.writeFileSync(P, doc, 'utf8');
console.log('\nr0–r9 rebuild: ' + origLen + ' → ' + doc.length + ' chars (Δ ' + (doc.length - origLen) + ')');
