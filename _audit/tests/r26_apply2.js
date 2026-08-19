/* Round 26 wave-2 apply (idempotent): ins24_css master revision (fonts/event/milestone
   rails added) + wave-2 surgical pairs from surgical_r26.json. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;
const n = (h, s) => h.split(s).length - 1;

/* ---- ins24_css master revision swap ---- */
const NEW = fs.readFileSync('/home/user/_audit/ins24_css.css', 'utf8').replace(/\s+$/, '');
if (doc.includes(NEW)){ console.log('  · ins24_css already at wave-2 revision, skipped'); }
else {
  /* locate the currently-embedded ins24_css by its known banner and swap any older rev */
  const banner = '/* ============================================================================\n   SKINFORGE + CASTFORGE — VISUAL LAYER (ROUND 26)';
  const start = doc.indexOf(banner);
  if (start < 0){ console.error('✘ embedded ins24_css not found'); process.exit(1); }
  /* embedded block runs to just before the style stack's next section — recover its
     exact extent by matching the wave-1 master on disk (backed up at /tmp/old26_css) */
  const OLD = fs.readFileSync('/tmp/old26_ins24_css.css', 'utf8').replace(/\s+$/, '');
  if (n(doc, OLD) !== 1){ console.error('✘ wave-1 ins24_css not exactly once (' + n(doc, OLD) + ')'); process.exit(1); }
  doc = doc.replace(OLD, () => NEW);
  console.log('  ✔ ins24_css revised (' + OLD.length + ' → ' + NEW.length + ' chars)');
}

/* ---- wave-2 surgical pairs (skip anything already applied) ---- */
const surg = JSON.parse(fs.readFileSync('/home/user/_audit/surgical_r26.json', 'utf8'));
let applied = 0, skipped = 0;
for (const p of surg.pairs){
  if (p.new && doc.includes(p.new)){ skipped++; continue; }
  if (!p.new && !doc.includes(p.old)){ skipped++; continue; }
  if (n(doc, p.old) !== 1){ console.error('✘ ' + p.name + ': old not exactly once (' + n(doc, p.old) + ')'); process.exit(1); }
  doc = doc.replace(p.old, () => p.new);
  applied++;
}
console.log('  ✔ surgical pairs: ' + applied + ' applied this pass, ' + skipped + ' already done');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars (Δ ' + (doc.length - origLen) + ')');
