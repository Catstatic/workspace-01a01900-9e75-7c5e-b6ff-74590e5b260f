/* SKINFORGE wave-2: the orphan sweep exposed deeper cut seams (milestone/fonts/event
   token lists, watermark & observer maps, activeText chain, maze/cipher lore copy).
   Validates against the CURRENT (wave-1-applied) deliverable and MERGES into
   surgical_r26.json — verify reverts every pair, so all live in one registry. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const doc = fs.readFileSync(P, 'utf8');
const pairs = [];
const count = s => doc.split(s).length - 1;
function lit(name, old, neu){ pairs.push({ name, old, new: neu }); }

lit('cut-css-milestone', 'body.theme-backrooms .milestone,\nbody.theme-escape .milestone,\n', '');
lit('cut-css-qfonts',
  "body.theme-backrooms{--q-body:'Space Grotesk','Segoe UI',sans-serif;--q-display:'Special Elite','Space Grotesk',sans-serif;--q-mono:'DM Mono','JetBrains Mono',monospace;}\n" +
  "body.theme-escape{--q-body:'Space Grotesk','Segoe UI',sans-serif;--q-display:'Orbitron','Space Grotesk',sans-serif;--q-mono:'DM Mono','JetBrains Mono',monospace;}\n", '');
lit('cut-css-event-accents',
  "body.theme-backrooms{--event-accent:#8b6b25;--event-accent-2:#f2d04d;--event-ink:#3d2f1f;--event-glow:rgba(242,208,77,.38);}\n" +
  "body.theme-escape{--event-accent:#e05c5d;--event-accent-2:#d5a347;--event-ink:#fff1e7;--event-glow:rgba(224,92,93,.46);}\n", '');
lit('cut-css-phys-burst', 'body.theme-backrooms .phys-click-burst::before{border-radius:4px !important;}\n', '');
lit('relabel-css-maze-comment', '/* Maze / backrooms */', '/* Maze — tomb-of-Khonshu skin under MOON KNIGHT */');
lit('relabel-js-comment-pure', '// Pure themes (black, backrooms, escape, neon) — no character tint', '// Pure themes (black, neon, kaiju8, batman, moonknight) — no character tint');
lit('relabel-js-comment-nochar', '// If this theme has NO characters (black room, backrooms, escape, neon) — hide card entirely', '// If this theme has NO characters (black, neon, kaiju8, batman, moonknight) — hide card entirely');

lit('graft-js-activetext',
  "      else if(currentTheme==='theme-escape') activeText = 'LOCK IS OPEN';\n      else if(currentTheme==='theme-backrooms') activeText = 'EXTRACTION IMMINENT';\n",
  "      else if(currentTheme==='theme-kaiju8') activeText = '✦ BREACH SEALED — ACE ON SCENE ✦';\n      else if(currentTheme==='theme-batman') activeText = 'CASE CLOSED — THE CITY SLEEPS';\n      else if(currentTheme==='theme-moonknight') activeText = 'FULL MOON — AVATAR ASCENDANT';\n");
lit('graft-js-watermark',
  "      'theme-white':'WHITE ROOM','theme-black':'BLACK SITE','theme-backrooms':'LEVEL 0',\n      'theme-escape':'ROOM 04','theme-system':'PLAYER','theme-neon':'JACK IN',",
  "      'theme-white':'WHITE ROOM','theme-black':'BLACK SITE','theme-kaiju8':'KAIJU NO. 8',\n      'theme-batman':'DARK KNIGHT','theme-moonknight':'MOON KNIGHT','theme-system':'PLAYER','theme-neon':'JACK IN',");
lit('graft-js-themewords',
  "    'theme-backrooms':['LEVEL SHIFT','KEEP MOVING','EXIT TRACE FOUND','FLUORESCENT HUM'],\n    'theme-escape':['TUMBLER CLICK','LOCK PATTERN FOUND','ESCAPE VECTOR','TIME REMAINS'],\n",
  "    'theme-kaiju8':['BREACH SEALED','SYNC +10%','CORE STABLE','THREAT NEUTRALIZED'],\n    'theme-batman':['EVIDENCE SEALED','PATROL CLEAN','SIGNAL LIT','CASE CLOSED'],\n    'theme-moonknight':['PHASE HELD','ASPECT STEADY','MOONLIT PATH','VIGIL LOGGED'],\n");
lit('graft-js-themelabels',
  "    'theme-backrooms':'LEVEL 0 // OBSERVED',\n    'theme-escape':'LOCK STATE // OBSERVED',\n",
  "    'theme-kaiju8':'KAIJU NO. 8 // OBSERVED',\n    'theme-batman':'GOTHAM NIGHT // OBSERVED',\n    'theme-moonknight':'MOON PHASE // OBSERVED',\n");

lit('relabel-js-cipher-eyebrow', "eyebrow:'BLACK ROOM / ESCAPE ROOM'", "eyebrow:'BLACK ROOM / DARK KNIGHT'");
lit('graft-js-maze-modeinfo',
  "maze:{title:'LEVEL 0 EXTRACTION',subtitle:'The fluorescent hum is not the map. Find the exit.',eyebrow:'BACKROOMS BREAK PROTOCOL',tip:'Recover both keys, keep away from the Smiler, then reach the exit.',time:600},",
  "maze:{title:'TOMB OF KHONSHU',subtitle:'The moonlit corridors are not the map. Find the exit.',eyebrow:'MOON KNIGHT / TOMB PROTOCOL',tip:'Recover both canopic keys, evade the tomb guardian, then reach the exit.',time:600},");
lit('relabel-js-maze-lore1', "'The Smiler found you · heart lost.'", "'The tomb guardian found you · heart lost.'");
lit('relabel-js-maze-lore2', "finish('Extraction failed · the level consumed the subject.')", "finish('The tomb sealed itself · the aspect was claimed.')");
lit('relabel-js-maze-lore3', "finish('Extraction complete · you escaped Level 0.')", "finish('Tomb extraction complete · the moon saw you out.')");
lit('relabel-js-maze-lore4', "setStatus('Find both keys. Avoid the moving Smiler.')", "setStatus('Find both canopic keys. Avoid the moving guardian.')");

let bad = 0;
for (const p of pairs){
  const c = count(p.old);
  if (c !== 1){ bad++; console.log('✘ ' + p.name + ' COUNT=' + c); }
  else console.log('✔ ' + p.name.padEnd(30) + ' old:' + String(p.old.length).padStart(5) + ' → new:' + String(p.new.length).padStart(5));
}
if (bad){ console.error('\n' + bad + ' failed — JSON untouched'); process.exit(1); }
const path = '/home/user/_audit/surgical_r26.json';
const json = JSON.parse(fs.readFileSync(path, 'utf8'));
json.pairs = json.pairs.concat(pairs);
json.note += ' Wave 2: deep-cut token lists, observer maps, activeText chain, maze tomb re-skin.';
fs.writeFileSync(path, JSON.stringify(json, null, 1));
console.log('\n✔ merged — surgical_r26.json now holds ' + json.pairs.length + ' pairs');
