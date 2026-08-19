/* SKINFORGE wave-3 — PROOF REPAIR:
   (a) naive removal pairs (new:'') are unrevertable → rebuild them as
       context-anchored modifications: old = L+removed+R, new = L+R.
       old must hit exactly once in the PRISTINE BASELINE; new exactly once
       in the CURRENT deliverable — making new→old reversion deterministic.
   (b) fix the MOON'S apostrophe syntax break with one more pair. */
const fs = require('fs');
const ORIG = fs.readFileSync('/tmp/orig_tracker.html', 'utf8');
const doc = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
const path = '/home/user/_audit/surgical_r26.json';
const json = JSON.parse(fs.readFileSync(path, 'utf8'));

/* drop naive removals (new==='') — replaced below */
const kept = json.pairs.filter(p => p.new !== '');
console.log('kept ' + kept.length + ' modification/graft pairs');

const SPANS = [
  ['cut-families',    '/* ============== THEME: BACKROOMS ============== */', '/* ============== THEME: SYSTEM (Solo Leveling) ============== */', 64, 80],
  ['cut-gallery',     '.theme-backrooms .gallery-card:hover{',              '.theme-system .gallery-card:hover{',                              90, 70],
  ['cut-ceiling',     '/* ---- Backrooms: Ceiling tile flicker',            '/* Global performance tweak */',                                  70, 80],
  ['cut-fxblocks',    '/* ---- BACKROOMS: Exit sign',                       '/* ---- SYSTEM: Damage numbers',                                  64, 70],
  ['cut-fxshow',      '.theme-backrooms #fxBackrooms,',                     '.theme-system #fxSystem,',                                        26, 30],
  ['cut-fxhide',      '.theme-backrooms .fx-atmo:not(#fxBackrooms)',        '.theme-system .fx-atmo:not(#fxSystem)',                           60, 60],
  ['cut-charcards',   '.theme-backrooms .character-card{',                  '.theme-neon .character-card{',                                    60, 40],
  ['cut-domdivs',     '<div class="fx-atmo fx-backrooms-atmo"',             '<div class="fx-atmo fx-system-atmo" id="fxSystem"></div>',        60, 50],
  ['cut-themequotes', "  'theme-backrooms': [\n",                           "  'theme-system': [\n",                                           40, 30],
  ['cut-themes',      "  'theme-backrooms':{ label:'THE BACKROOMS'",        "  'theme-system':   { label:'SYSTEM'",                            40, 40],
  ['cut-pcolors',     "    'theme-backrooms': ['#8b5a1a'",                  "    'theme-system': ['#00d4ff'",                                  40, 40],
  ['cut-themetext',   "  'theme-backrooms':{ countdown:(d)=>`HOURS",        "  'theme-system':   { countdown",                                 40, 40],
  ['cut-milestone',   'body.theme-backrooms .milestone,',                   'body.voice-ayanokoji.ayanokoji-blue .milestone,',                 40, 50],
  ['cut-qfonts',      'body.theme-backrooms{--q-body',                      'body.theme-system{--q-body',                                      40, 40],
  ['cut-eventacc',    'body.theme-backrooms{--event-accent',                'body.theme-system{--event-accent',                                40, 40],
  ['cut-physburst',   'body.theme-backrooms .phys-click-burst',             null /* auto: next non-blank */,                                   60, 60]
];

const rebuilt = [];
let bad = 0;
for (const [name, sA, eA, ln, rn] of SPANS){
  const s = ORIG.indexOf(sA);
  let e = eA ? ORIG.indexOf(eA, s + 1) : -1;
  if (s < 0 || (eA && e < 0)){ console.error('✘ ' + name + ': anchor miss in baseline'); bad++; continue; }
  if (!eA){ /* phys burst: removed text = the line + its own newline only; blanks stay in right ctx */
    const lineEnd = ORIG.indexOf('\n', s);
    e = lineEnd + 1;
  }
  const removed = ORIG.slice(s, e);
  const left = ORIG.slice(Math.max(0, s - ln), s);
  const right = eA ? ORIG.slice(e, e + rn) : ORIG.slice(e, e + rn);
  const old = left + removed + right;
  const neu = left + right;
  const co = ORIG.split(old).length - 1;
  const cn = doc.split(neu).length - 1;
  if (co !== 1 || cn !== 1){ console.error('✘ ' + name + ' baselineCount=' + co + ' currentCount=' + cn); bad++; continue; }
  rebuilt.push({ name: name, old, new: neu });
  console.log('✔ ' + name.padEnd(16) + ' cut ' + String(removed.length).padStart(5) + ' ctx-pair ok (orig 1×, current 1×)');
}
if (bad) process.exit(1);

/* apostrophe fix for the THEME_TEXT milestone string */
kept.push({
  name: 'fix-themetext-apostrophe',
  old: "'✦ AVATAR ASCENDANT — MOON'S FAVOR SECURED ✦'",
  new: "'✦ AVATAR ASCENDANT — MOONLIGHT CROWNS YOU ✦'"
});

json.pairs = kept.concat(rebuilt);
json.note += ' Wave 3: removals rebuilt as context-anchored pairs (baseline-unique old, current-unique new) + apostrophe fix.';
fs.writeFileSync(path, JSON.stringify(json, null, 1));
console.log('\n✔ surgical_r26.json rebuilt — ' + json.pairs.length + ' pairs, all revert-safe');
