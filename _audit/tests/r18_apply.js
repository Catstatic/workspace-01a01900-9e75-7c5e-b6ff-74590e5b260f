/* Round 18 apply (idempotent): FORGE GAMES — CORE CASCADE (chain reaction) replaces the
   aincrad duel; STAR LATTICE (connect-the-dots) added as sister mode. Aincrad theme now
   boots 'cascade'. Both modes hub-styled, level-scaled, stats-wired via the base closure.
   Blocks: ins17_css (style), ins17_js (pure logic layer at end of body).
   Surgical: 4 registered pairs (surgical_r18.json) — modeInfo entries, dispatch arms,
   aincrad remap, and injection of the DOM layer (ins18_games_src) into the theme-games
   closure right before startMode(). */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

const pairs = [];
const pair = (name, oldS, newS) => pairs.push({ name, old: oldS, new: newS });

/* ---- pair 1: modeInfo gains cascade + lattice (duel kept, just no longer auto-mapped) ---- */
const duelRow = "    duel:{title:'FLOOR DUEL',subtitle:'Read the telegraph, choose the stance, clear the floor.',eyebrow:'AINCRAD / SWORD ART',tip:'Slash pressures, Guard absorbs, Dash counters. Read before acting.',time:600}";
pair('modeInfo-forge-modes',
  duelRow + '\n  };',
  duelRow + ',' +
  "\n    cascade:{title:'CORE CASCADE',subtitle:'Detonate linked orbs. Convert every hostile core before the sparks run dry.',eyebrow:'AINCRAD / FORGE ARCADE',tip:'Orbs detonate at 4 energy and blast their neighbours. Hostile cores only convert inside a blast wave.',time:480}," +
  "\n    lattice:{title:'STAR LATTICE',subtitle:'Link every twin core with an unbroken line. No crossings allowed.',eyebrow:'FORGE ARCADE / CONSTELLATION',tip:'Tap a core, then trace to its twin one shared edge at a time. Full-field coverage pays a bonus.',time:540}" +
  '\n  };');

/* ---- pair 2: dispatch arms ---- */
pair('dispatch-forge-modes',
  "else if(mode==='duel')initDuel();else initMemory();",
  "else if(mode==='duel')initDuel();else if(mode==='cascade')initCascade();else if(mode==='lattice')initLattice();else initMemory();");

/* ---- pair 3: aincrad theme boots CORE CASCADE (user retired the duel) ---- */
pair('aincrad-to-cascade',
  "if(b.classList.contains('theme-aincrad'))return'duel';",
  "if(b.classList.contains('theme-aincrad'))return'cascade';");

/* ---- pair 4: DOM layer injection inside the theme-games closure ---- */
const domSrc = fs.readFileSync('/home/user/_audit/ins18_games_src.js', 'utf8').replace(/\s+$/, '');
pair('forge-dom-layer-injection',
  '  function startMode(mode){',
  domSrc + '\n\n  function startMode(mode){');

for (const p of pairs){
  const nOld = doc.split(p.old).length - 1, nNew = doc.split(p.new).length - 1;
  if (nNew === 1 && nOld === 0){ console.log('  · surgical [' + p.name + '] already applied, skipped'); continue; }
  if (nOld !== 1){ console.error('surgical [' + p.name + '] old not unique: ' + nOld); process.exit(1); }
  doc = doc.replace(p.old, () => p.new);
  console.log('  ✔ surgical [' + p.name + '] applied (' + (p.new.length - p.old.length) + ' chars delta)');
}
fs.writeFileSync('/home/user/_audit/surgical_r18.json',
  JSON.stringify({ round: 18, note: 'FORGE GAMES: cascade+lattice registered in base theme-game closure; aincrad remapped off duel; DOM layer injected pre-startMode.', pairs }, null, 2));
console.log('  ✔ surgical_r18.json written (' + pairs.length + ' pairs registered)');

/* ---- ins17_css after ins16_css ---- */
if (!doc.includes('ROUND 18 — FORGE GAMES: CORE CASCADE + STAR LATTICE chrome')){
  const css = fs.readFileSync('/home/user/_audit/ins17_css.css', 'utf8').replace(/\s+$/, '');
  const css16 = fs.readFileSync('/home/user/_audit/ins16_css.css', 'utf8');
  const anchor = css16.replace(/\s+$/, '').slice(-60);
  if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins16 tail) not unique'); process.exit(1); }
  doc = doc.replace(anchor, () => anchor + '\n\n' + css);
  console.log('  ✔ ins17_css appended (' + css.length + ' chars)');
} else console.log('  · ins17_css already present, skipped');

/* ---- ins17_js before </body> (after ins15_js) ---- */
if (!doc.includes('ROUND 18 — FORGE GAMES logic layer')){
  const js = fs.readFileSync('/home/user/_audit/ins17_js.js', 'utf8').replace(/\s+$/, '');
  if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
  doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
  console.log('  ✔ ins17_js appended (' + js.length + ' chars)');
} else console.log('  · ins17_js already present, skipped');

fs.writeFileSync(P, doc, 'utf8');
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | 4 surgical pairs registered');
