/* SKINFORGE+CASTFORGE surgical builder — extracts EXACT old spans from the live
   deliverable by validated unique anchors, pairs them with authored grafts, and
   writes _audit/surgical_r26.json. Refuses to write if any old isn't exactly-once. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const doc = fs.readFileSync(P, 'utf8');
const pairs = [];
const count = s => doc.split(s).length - 1;

function span(name, startAnchor, endAnchor, neu){ /* old = [startAnchor, endAnchor) */
  const a = doc.indexOf(startAnchor), b = doc.indexOf(endAnchor, a + 1);
  if (a < 0 || b < 0 || b <= a){ console.error('✘ ' + name + ': anchor fail a=' + a + ' b=' + b); process.exit(2); }
  const old = doc.slice(a, b);
  pairs.push({ name, old, new: neu });
}
function lit(name, old, neu){ pairs.push({ name, old, new: neu }); }

/* ================= THE CUT — escape + backrooms, 14 seams ================= */
span('cut-css-backrooms-family', '/* ============== THEME: BACKROOMS ============== */', '/* ============== THEME: ESCAPE ROOM ============== */', '');
span('cut-css-escape-family', '/* ============== THEME: ESCAPE ROOM ============== */', '/* ============== THEME: SYSTEM (Solo Leveling) ============== */', '');
lit('cut-css-backrooms-gallery', '.theme-backrooms .gallery-card:hover{ box-shadow:0 0 0 1px rgba(74,58,26,0.42), 0 4px 18px rgba(61,47,31,0.18); }\n', '');
lit('cut-css-fxlayer-group', '.theme-black .fx-layer, .theme-backrooms .fx-layer, .theme-escape .fx-layer, .theme-neon .fx-layer, .theme-white .fx-layer{', '.theme-black .fx-layer, .theme-neon .fx-layer, .theme-white .fx-layer{');
span('cut-css-backrooms-ceiling', '/* ---- Backrooms: Ceiling tile flicker + distant hum light ---- */', '.theme-escape .hud-bar-fill::after{', '');
span('cut-css-escape-tumbler', '.theme-escape .hud-bar-fill::after{', '/* Global performance tweak */', '');
lit('cut-css-reduced-motion', '.theme-black::before, .theme-backrooms::before, .theme-escape::after, .theme-system::before,', '.theme-black::before, .theme-system::before,');
span('cut-css-backrooms-fx', '/* ---- BACKROOMS: Exit sign + moist carpet + buzz overlay ---- */', '/* ---- ESCAPE ROOM: Large clock + tumblers + chain ---- */', '');
span('cut-css-escape-fx', '/* ---- ESCAPE ROOM: Large clock + tumblers + chain ---- */', '/* ---- SYSTEM: Damage numbers + mana orb + arise text ---- */', '');
lit('cut-css-fx-show-group', '.theme-backrooms #fxBackrooms,\n.theme-escape #fxEscape,\n', '');
lit('cut-css-fx-hide-others', '.theme-backrooms .fx-atmo:not(#fxBackrooms){ opacity:0 !important; }\n.theme-escape .fx-atmo:not(#fxEscape){ opacity:0 !important; }\n', '');
span('cut-css-character-cards', '.theme-backrooms .character-card{', '.theme-neon .character-card{', '');
lit('cut-dom-fx-divs', '<div class="fx-atmo fx-backrooms-atmo" id="fxBackrooms"></div>\n<div class="fx-atmo fx-escape-atmo" id="fxEscape"></div>\n', '');
span('cut-js-theme-quotes', "  'theme-backrooms': [\n", "  'theme-system': [\n", '');

/* ================= THE GRAFT — registry entries & mappings ================= */
/* THEMES: remove two entries */
lit('cut-js-themes-entries',
  "  'theme-backrooms':{ label:'THE BACKROOMS',  shortLabel:'BACKROOMS',   swatchColors:['#c9b458','#3d2f1f','#8b5a1a','#4a6b1a'], description:'Liminal horror · fluorescent hum',      supportsVoice:false, themeVoice:null },\n" +
  "  'theme-escape':   { label:'ESCAPE ROOM',    shortLabel:'ESCAPE ROOM', swatchColors:['#1c1c1e','#d63031','#b8860b','#00b894'], description:'Puzzle pressure · ticking clock',        supportsVoice:false, themeVoice:null },\n",
  '');
/* THEMES: append three (tail slice before its closing '};') */
{
  const start = doc.indexOf('const THEMES = {');
  const end = doc.indexOf('\n};', start);
  const tail = doc.slice(end - 520, end); /* ends with the theme-physics entry line */
  if (!tail.includes("'theme-physics'")){ console.error('✘ themes-add tail miss'); process.exit(2); }
  lit('graft-js-themes-add', tail, tail +
    ",\n  'theme-kaiju8':    { label:'KAIJU NO. 8',    shortLabel:'KAIJU NO. 8', swatchColors:['#05070f','#00e5ff','#7df9ff','#ff3355'], description:'Kaiju defense · bio-energy · breach grid',  supportsVoice:false, themeVoice:null }," +
    "\n  'theme-batman':    { label:'THE DARK KNIGHT', shortLabel:'BATMAN',      swatchColors:['#0a0a0c','#ffd60a','#9aa5b1','#1b2735'], description:'Gotham noir · bat-signal · detective',    supportsVoice:false, themeVoice:null }," +
    "\n  'theme-moonknight':{ label:'MOON KNIGHT',     shortLabel:'MOON KNIGHT', swatchColors:['#0d1021','#e8e6df','#d4af37','#5eead4'], description:'Moonlit marble · Khonshu gold · tomb maze', supportsVoice:false, themeVoice:null }");
}

/* THEME_VOICES whole block (comment incl. — it name-drops the cut themes) */
{
  const start = doc.indexOf('// STRICT THEME-VOICE MAPPING');
  const end = doc.indexOf('\n};', doc.indexOf('const THEME_VOICES = {'));
  if (start < 0 || end < 0){ console.error('✘ theme-voices block fail'); process.exit(2); }
  const old = doc.slice(start, end + 3);
  const neu =
"// STRICT THEME-VOICE MAPPING — characters stay locked to their own theme\n" +
"// White Room = COTE roster; CASTFORGE (R26) seated Igris in System, Huo Yuhao beside Tang San, Gehrman & The Fool in Beyonder.\n" +
"// Themes with empty array have NO characters (black, neon, kaiju8, batman, moonknight).\n" +
"const THEME_VOICES = {\n" +
"  'theme-white':    ['ayanokoji','horikita','ryuuen','ichinose','sakayanagi'],\n" +
"  'theme-black':    [],\n" +
"  'theme-neon':     [],\n" +
"  'theme-kaiju8':   [],\n" +
"  'theme-batman':   [],\n" +
"  'theme-moonknight':[],\n" +
"  'theme-system':   ['jinwoo','igris'],\n" +
"  'theme-aincrad':  ['kirito'],\n" +
"  'theme-shrek':    ['tangsan','huoyuhao'],\n" +
"  'theme-lotm':     ['klein','gehrman','fool'],\n" +
"  // Physics Guy intentionally comes first when Physics Lab opens.\n" +
"  'theme-physics':  ['physguy','feynman','astro']\n" +
"};";
  lit('graft-js-theme-voices', old, neu);
}

/* getParticleColors: remove two lines, append three */
lit('cut-js-particle-colors', "    'theme-backrooms': ['#8b5a1a','#c9b458','#5a4a30'],\n    'theme-escape': ['#d63031','#b8860b','#00b894'],\n", '');
lit('graft-js-particle-colors',
  "    'theme-lotm': ['#c8985a','#e0b878','#f4e4c1']\n  };",
  "    'theme-lotm': ['#c8985a','#e0b878','#f4e4c1'],\n    'theme-kaiju8': ['#00e5ff','#7df9ff','#ff3355'],\n    'theme-batman': ['#ffd60a','#9aa5b1','#1b2735'],\n    'theme-moonknight': ['#e8e6df','#d4af37','#5eead4']\n  };");

/* THEME_QUOTES: append three arrays before map close */
{
  const start = doc.indexOf('const THEME_QUOTES =');
  const end = doc.indexOf('\n};', start);
  const tail = doc.slice(end - 90, end); // final lines of the physics quotes array
  lit('graft-js-theme-quotes-add', tail, tail +
",\n  'theme-kaiju8': [" +
"\n    \"Breach alarm rings for the unprepared. You? You logged the drill.\"," +
"\n    \"No. 8 didn't choose power over study. Power followed the form book.\"," +
"\n    \"Sync rate rises one honest rep at a time. No shortcut circuits.\"," +
"\n    \"Defense Force rule: hold the line. The topic you skip is the breach.\"," +
"\n    \"Core pulse steady? Then steady the schedule too.\"," +
"\n    \"Monster of record clears the board quietly. Be the record.\"," +
"\n    \"A clean sweep starts with one clean session.\"," +
"\n    \"The suit only amplifies what's inside. Charge the operator first.\"," +
"\n    \"Every marked question is a neutralized threat. Mark honestly.\"," +
"\n    \"Sortie complete only when the log says complete.\"" +
"\n  ]," +
"\n  'theme-batman': [" +
"\n    \"Gotham rewards the prepared. Preparation is the plan, bats optional.\"," +
"\n    \"No superpowers here. Detective work. Topic by topic, case closed.\"," +
"\n    \"The signal only shines when clouds gather. Hard week? Beacon hours.\"," +
"\n    \"Fear is data. Mark where it spikes, then patrol there twice.\"," +
"\n    \"Evidence board: weak topics connected by one red string — avoidance.\"," +
"\n    \"Midnight oil burns cleanest in small disciplined shifts.\"," +
"\n    \"Armor on, cape off. Notes first, glory later.\"," +
"\n    \"The city sleeps; the ledger doesn't. Log the patrol.\"," +
"\n    \"A lead ignored becomes a case unsolved. Follow the lead today.\"," +
"\n    \"Be the storm the weakness fears.\"" +
"\n  ]," +
"\n  'theme-moonknight': [" +
"\n    \"Moonlight favors the nightly. One more vigil, one more aspect.\"," +
"\n    \"Khonshu counts phases, not excuses. Tonight counts.\"," +
"\n    \"Two identities, one ledger: reading and recall. Balance both.\"," +
"\n    \"The tomb opens for the patient. Chapter by chapter, sealed deep.\"," +
"\n    \"Crescent to full — slow arcs win the night sky.\"," +
"\n    \"The mummy wraps in layers. So does mastery.\"," +
"\n    \"White suit shows every stain. Clean answers show every step.\"," +
"\n    \"Voices argue; the plan executes. Silence the debate, start the block.\"," +
"\n    \"Egyptian nights were mapped by watchers. Watch the syllabus nightly.\"," +
"\n    \"The avatar acts because the god commands. Your god is the logbook.\"" +
"\n  ]");
}

/* THEME_TEXT: cut two, append three */
lit('cut-js-theme-text', "  'theme-backrooms':{ countdown:(d)=>`HOURS UNTIL EXTRACTION: ~${d*24}`, milestone:()=>'LEVEL UP — keep moving', pomoComplete:'⟢ Quiet time over. Continue.', pomoBreakDone:'⟢ Stay silent a while longer.', examLabel:(p)=>`${p} — FOUND DOCUMENT` },\n  'theme-escape':   { countdown:(d)=>`LOCKDOWN IN: ${d} DAYS`, milestone:(r)=>`TUMBLER ${r===1?'FINAL':r} CLICKED. The lock is opening.`, pomoComplete:'⟢ Lock logged. Take a breather.', pomoBreakDone:'⟢ Back to the lock.', examLabel:(p)=>`${p} — LOCK ATTEMPT` },\n", '');
{
  const start = doc.indexOf('const THEME_TEXT = {');
  const end = doc.indexOf('\n};', start);
  const tail = doc.slice(end - 120, end);
  lit('graft-js-theme-text-add', tail, tail +
",\n  'theme-kaiju8':    { countdown:(d)=>`NEUTRALIZATION WINDOW: ${d} DAYS TO BREACH`, milestone:(r)=>r===1?'✦ THREAT LEVEL ZERO — YOU ARE THE ACE ✦':`⟢ Breach level ${r} sealed. Suit sync +${r*10}%.`, pomoComplete:'⟢ Drill logged. Core output +10.', pomoBreakDone:'⟢ Reactor cooled. Next sortie primed.', examLabel:(p)=>`${p} — KAIJU ENGAGEMENT` }," +
"\n  'theme-batman':    { countdown:(d)=>`GOTHAM PROTOCOL: ${d} NIGHTS TO MIDNIGHT`, milestone:(r)=>r===1?'◆ THE CITY SLEEPS SAFE — CASES CLEARED ◆':`⟢ Case ${r} closed. Evidence sealed.`, pomoComplete:'⟢ Patrol logged. Intel +10.', pomoBreakDone:'⟢ Cape hung. Cowl charged. Next patrol ready.', examLabel:(p)=>`${p} — CASE FILE` }," +
"\n  'theme-moonknight':{ countdown:(d)=>`PHASE COUNT: ${d} NIGHTS TO FULL MOON`, milestone:(r)=>r===1?'✦ AVATAR ASCENDANT — MOON'S FAVOR SECURED ✦':`⟢ Phase ${r} complete. Path cleared.`, pomoComplete:'⟢ Vigil logged. Resolve +10.', pomoBreakDone:'⟢ Shade rested. Streets await the next round.', examLabel:(p)=>`${p} — NIGHT PATROL` }");
}

/* VOICES: append four personas */
{
  const start = doc.indexOf('VOICES = {');
  const end = doc.indexOf('\n};', start);
  const tail = doc.slice(end - 60, end);
  lit('graft-js-voices-add', tail, tail +
",\n  igris: { label:'IGRIS', greeting:'Silent · absolute · knightly', role:'Blood-Red Commander · first blade of the Shadow Army', description:'\"The Monarch commands. I execute.\" Igris does not flatter and does not hurry. Each rep you log is a soldier raised; he counts them without comment, then asks for one more.', signature:'The knight who knelt only once — and never again. His aura runs crimson because his patience does not.' }," +
"\n  huoyuhao: { label:'HUO YUHAO', greeting:'Observant · gentle · unshakable', role:'Spirit Eyes · Ice Emperor lineage · Soul Land 2', description:'\"Look closer — the match is decided before the first strike.\" Huo Yuhao reads the whole field at once: weak points, openings, escape routes. He studies the way he fights, with every sense open and nothing wasted.', signature:'The boy the Spirit Eyes chose. Where Tang San built the legend, Huo Yuhao inherits it — in violet and ice.' }," +
"\n  gehrman: { label:'GEHRMAN SPARROW', greeting:'Cold · precise · courteous as a drawn trigger', role:'Bounty hunter above the Sea of Fog', description:'\"State the target. Everything else is waste.\" Gehrman strips each task to a mark and a method. No drama, no drift — the syllabus is only a wanted poster: name, face, time of collection.', signature:'The cold idol of the Fog Sea. Gentlest manners, quickest draw — with him, revision is a hunt and every weak topic gets a bounty.' }," +
"\n  fool: { label:'THE FOOL', greeting:'Distant · tranquil · impossibly deep', role:'The great existence above the gray fog · host of the Tarot Club', description:'\"Whisper the doubt. The fog will answer.\" The Fool does not lecture. He listens — and the gray fog rearranges what you know into what you command. Slow words, long patience, pathways made home.', signature:'Seated at the fog-shrouded table head. Beyonders advance by acting — he advances you by making the unknown feel seated beside you.' }");
}

/* VOICE_QUOTES: append four sets before close */
{
  const start = doc.indexOf('const VOICE_QUOTES = {');
  const end = doc.indexOf('\n};', start);
  const tail = doc.slice(end - 80, end);
  lit('graft-js-voice-quotes-add', tail, tail +
",\n  igris: [" +
"\n    \"The Commander counts only completed drills. Complete one.\"," +
"\n    \"Kneeling was the beginning. Rise means logging the next hour.\"," +
"\n    \"A blade stays silent until the swing. Your pen, same rule.\"," +
"\n    \"No retreat formation exists in my book. Neither in yours.\"," +
"\n    \"Armor remembers every scar. Memory works — earn yours.\"," +
"\n    \"One order today: clear the marked topic. Move.\"," +
"\n    \"The Monarch watches the tally, not the excuse.\"" +
"\n  ]," +
"\n  huoyuhao: [" +
"\n    \"Spirit Eyes open: the whole field, all at once. Read first, solve fast.\"," +
"\n    \"Ice steadies the hand. Breathe, then derive.\"," +
"\n    \"Weak spots glow violet to a careful observer. Observe yours.\"," +
"\n    \"Control beats force. Pace the session; land every question.\"," +
"\n    \"The ring forms when the practice is real. No counterfeit rings.\"," +
"\n    \"My advantage was attention, not talent. Yours too.\"," +
"\n    \"A calm field of view wins more than a loud strike.\"" +
"\n  ]," +
"\n  gehrman: [" +
"\n    \"Poster drafted: today's weak topic. Collect before dusk.\"," +
"\n    \"A hunter never fires at the fog. Aim only at solved steps.\"," +
"\n    \"Bounty math: forty focused minutes outscore four drifting hours.\"," +
"\n    \"Courtesy costs nothing, panic costs marks. Keep both facts.\"," +
"\n    \"Track the concept, not the clock. Trails stay while ticks fly.\"," +
"\n    \"Every missed question leaves a trail. Follow it tomorrow.\"," +
"\n    \"Close the file, collect the fee. The fee is rank.\"" +
"\n  ]," +
"\n  fool: [" +
"\n    \"Above the fog, all confusion sits as furniture. Move one piece today.\"," +
"\n    \"The pathway advances by acting. Your ritual: one honest block.\"," +
"\n    \"History forgets hesitation. The ledger records only the scripted.\"," +
"\n    \"Tarot is guesswork; progress is architecture. Build, then divine.\"," +
"\n    \"The castle has many chairs. Empty ones await named topics.\"," +
"\n    \"Gray fog clears in spirals. Confusion lifts the same way — slowly, then suddenly.\"," +
"\n    \"Ponder well; the starlight has time, your calendar less so.\"" +
"\n  ]");
}

/* voiceColors: append four */
lit('graft-js-voice-colors',
  "    jinwoo:['#00d4ff','#7c3aed','#ffd700']\n  };",
  "    jinwoo:['#00d4ff','#7c3aed','#ffd700'],\n    igris:['#ff3b47','#ff8a7a','#ffd0c8'],\n    huoyuhao:['#b98cff','#9fd8ff','#efe6ff'],\n    gehrman:['#9aa3ad','#c8ced6','#e8ddd0'],\n    fool:['#8b93a0','#e3e8f2','#d8b8c0']\n  };");

/* modeForTheme: three edits */
lit('graft-js-mode-personas',
  "if(b.classList.contains('voice-ryuuen'))return'target';",
  "if(b.classList.contains('voice-ryuuen')||b.classList.contains('voice-igris')||b.classList.contains('voice-gehrman'))return'target';");
lit('graft-js-mode-worlds',
  "if(b.classList.contains('theme-backrooms'))return'maze';",
  "if(b.classList.contains('theme-moonknight'))return'maze';\n    if(b.classList.contains('theme-kaiju8'))return'lattice';");
lit('graft-js-mode-cipher',
  "if(b.classList.contains('theme-black')||b.classList.contains('theme-escape'))return'cipher';",
  "if(b.classList.contains('theme-black')||b.classList.contains('theme-batman'))return'cipher';");

/* ---------- validate: every old exactly once ---------- */
let bad = 0;
for (const p of pairs){
  const c = count(p.old);
  const marker = c === 1 ? '✔' : '✘';
  if (c !== 1) bad++;
  console.log(marker + ' ' + p.name.padEnd(28) + ' old:' + String(p.old.length).padStart(6) + ' → new:' + String(p.new.length).padStart(6) + (c !== 1 ? '   COUNT=' + c : ''));
}
if (bad){ console.error('\n' + bad + ' pairs failed uniqueness — JSON NOT written'); process.exit(1); }
const json = { round: 26, note: 'SKINFORGE + CASTFORGE: cut escape/backrooms (14 seams), graft kaiju8/batman/moonknight themes + igris/huoyuhao/gehrman/fool personas, mode mappings.', pairs };
fs.writeFileSync('/home/user/_audit/surgical_r26.json', JSON.stringify(json, null, 1));
console.log('\n✔ surgical_r26.json written — ' + pairs.length + ' pairs validated');
