/* unit17 — round 19 RESONANCE CHAMBER pure layer: note math, DSL expansion,
   keymap integrity, zither tuning, octave clamp. vm-based, no DOM/Audio needed. */
const fs = require('fs');
const vm = require('vm');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const src = fs.readFileSync('/home/user/_audit/ins19_js.js', 'utf8');
const sandbox = { window: {}, Math, JSON }; /* no document → pure surface only */
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: 'ins19_js.js' });
const R = sandbox.window.__resonance;

console.log('[1] note parsing & frequency math');
ok(R && typeof R.parseNote === 'function', 'pure surface exported');
ok(R.parseNote('C4') === 60 && R.parseNote('A4') === 69, 'C4=60, A4=69 (scientific pitch)');
ok(R.parseNote('C#4') === 61 && R.parseNote('Db4') === 61, 'enharmonic equivalence C#=Db');
ok(R.parseNote('Bb3') === 58 && R.parseNote('G5') === 79, 'flats parse');
ok(R.parseNote('H4') === -1 && R.parseNote('C') === -1, 'bad input rejected');
ok(R.midiName(60) === 'C4' && R.midiName(61) === 'C#4' && R.midiName(69) === 'A4', 'midi→name roundtrip');
ok(Math.abs(R.midiFreq(69) - 440) < 1e-9 && Math.abs(R.midiFreq(57) - 220) < 1e-6, 'A4=440Hz, A3=220Hz');
ok(Math.abs(R.midiFreq(72) / R.midiFreq(60) - 2) < 1e-9, 'octave doubles frequency');

console.log('[2] keymap covers a chromatic 2-octave span with no collisions');
{
  const offs = Object.values(R.KEYMAP);
  const uniq = new Set(offs);
  ok(uniq.size === offs.length, 'no two pc-keys map to the same semitone');
  ok(Math.min(...offs) === 0 && Math.max(...offs) === 28, 'spans 0..28 semitones');
  ok(R.KEYMAP.z === 0 && R.KEYMAP.m === 11 && R.KEYMAP.q === 12 && R.KEYMAP.u === 23, 'Z-M lower row, Q-U upper row');
  ok(R.KEYMAP.s === 1 && R.KEYMAP['2'] === 13, 'accidentals on S D / 2 3 rows');
  const chromatic = new Set([0,2,4,5,7,9,11]);
  ok([...chromatic].every(o => offs.includes(o)), 'all white-note offsets present');
}

console.log('[3] zither tuning');
{
  const z = R.ZITHER_MIDIS;
  ok(z.length === 15, '15 strings');
  ok(z.every((m, i) => i === 0 || m > z[i - 1]), 'strictly ascending pitch');
  ok(z[0] === 60 && z[14] === 93, 'tuned C4 .. A6');
  const pent = new Set([0, 2, 4, 7, 9]);
  ok(z.every(m => pent.has(m % 12)), 'every string is C-major pentatonic (everything sounds in tune)');
}

console.log('[4] octave window clamp');
ok(R.clampWin(10) === 36 && R.clampWin(999) === 72 && R.clampWin(60) === 60, 'clamped to C2..C6 window starts');
ok(R.clampWin(60) + 24 === 84, 'default window C4..C6 covers every song note range check below');

console.log('[5] all 29 songs parse and are playable inside the reachable range');
ok(R.SONGS.length === 29, '29 songs ship inside (R21: +viva la vida, shape of you, see you again, let it be)');
let allOk = true, allNotes = 0;
for (const s of R.SONGS){
  const ev = R.expandSong(s.src, s.bpm);
  const notes = ev.filter(e => e.midi > 0);
  allNotes += notes.length;
  const inRange = notes.every(e => e.midi >= 60 && e.midi <= 84);
  const durOk = ev.every(e => e.ms >= 100 && e.ms <= 6000);
  if (!(notes.length >= 8 && inRange && durOk && ev.length === notes.length + ev.filter(e => !e.midi).length)){
    allOk = false;
    console.log('    ✘ song issue: ' + s.t);
  }
}
ok(allOk, 'every motif: ≥8 notes, all inside the default C4..C6 window (every qwerty letter exists)');
ok(allNotes >= 340, 'library carries ' + allNotes + ' playable notes total');
{
  const g = R.SONGS.find(s => s.t === 'GURENGE');
  ok(!!g && g.tag === 'ANIME' && /LiSA/.test(g.by), 'Gurenge (LiSA) present, tagged ANIME');
  const ev = R.expandSong(g.src, g.bpm);
  ok(ev.filter(e => !e.midi).every(e => e.beats > 0), 'rests carry duration');
  const eighth = R.expandSong('A4e', 120)[0], half = R.expandSong('A4h', 120)[0];
  ok(eighth.ms === 250 && half.ms === 1000, 'e=250ms, h=1000ms at 120bpm');
}
{
  const tags = new Set(R.SONGS.map(s => s.tag));
  ok(tags.has('ANIME') && tags.has('INDIA') && tags.has('SOOTHE') && tags.has('ICON'), 'ANIME + INDIA + SOOTHE + ICON shelves stocked');
  ok(R.SONGS.filter(s => s.tag === 'INDIA').length === 5, '5 Indian motifs (anthem, vande mataram, tum hi ho, kal ho naa ho, vellake)');
  ok(R.SONGS.filter(s => s.tag === 'ANIME').length === 6, '6 anime motifs (gurenge, unravel, sadness&sorrow, guren no yumiya, zen zen zense, dark aria)');
  const names = R.SONGS.map(s => s.t).join('|');
  ['DARK ARIA','SPIDER-MAN: HOMECOMING SUITE','CAROL OF THE BELLS','LOKI — GREEN THEME','VELLAKE','MY HEART WILL GO ON','INTERSTELLAR','HALLELUJAH','GREENSLEEVES','MOON RIVER','VIVA LA VIDA','SHAPE OF YOU','SEE YOU AGAIN','LET IT BE'].forEach(t => {
    if (!names.includes(t)){ allOk = false; console.log('    ✘ missing song: ' + t); }
  });
  ok(['DARK ARIA','SPIDER-MAN: HOMECOMING SUITE','CAROL OF THE BELLS','LOKI — GREEN THEME','VELLAKE','MY HEART WILL GO ON','INTERSTELLAR','HALLELUJAH','GREENSLEEVES','MOON RIVER','VIVA LA VIDA','SHAPE OF YOU','SEE YOU AGAIN','LET IT BE'].every(t => names.includes(t)), 'all 14 requested/timeless additions present');
}

console.log('[6] QWERTY letter sheets');
{
  const g = R.SONGS.find(s => s.t === 'GURENGE');
  const sheet = R.qwertySheet(g.src, 60);
  ok(sheet.split(' ').slice(0, 5).join(' ') === 'w w w q W', 'Gurenge sheet starts w w w q W (D5 D5 D5 C5 D5)');
  ok(R.qwertySheet('Rq', 60) === '·', 'rest renders as ·');
  ok(R.keyToken(72, 'h', 60) === 'Q–', 'half-note C5 renders Q– (hold)');
  ok(R.keyToken(60, 'e', 60) === 'z', 'eighth C4 renders z (quick)');
  ok(R.keyToken(84 + 12, 'q', 60).indexOf('\u2039') === 0, 'out-of-window note falls back to ‹NOTE›');
  const shifted = R.qwertySheet('C5q', 72); /* window moved an octave up */
  ok(shifted === 'Z', 'sheet follows the octave window (C5 = Z after OCT up)');
  const allIn = R.SONGS.every(s => R.qwertySheet(s.src, 60).indexOf('\u2039') === -1);
  ok(allIn, 'every song fully fits the default window — no ‹fallouts› in any sheet');
}

console.log('[7] sargam notation — byte-level correctness against the playback engine');
{
  ok(Array.isArray(R.SARGAM_NAMES) && R.SARGAM_NAMES.join() === 'Sa,re,Re,ga,Ga,Ma,M#,Pa,dha,Dha,ni,Ni', '12-swara map: Sa re Re ga Ga Ma M# Pa dha Dha ni Ni');
  ok(R.sargamFor(60, 60) === 'Sa' && R.sargamFor(62, 60) === 'Re' && R.sargamFor(66, 60) === 'M#', 'shudh/tivra spelling at Sa=C4');
  ok(R.sargamFor(72, 60) === "Sa'" && R.sargamFor(59, 60) === ',Ni', 'octave marks: taar ′ and mandra ,');
  const ode = R.SONGS.find(x => x.t === 'ODE TO JOY');
  ok(R.sargamSheet(ode.src, ode.sa).split(' ').slice(0, 4).join(' ') === 'Ga Ga Ma Pa', 'Ode to Joy opens Ga Ga Ma Pa (E E F G on Sa=C)');
  const anthem = R.SONGS.find(x => x.t === 'JANA GANA MANA');
  ok(R.sargamSheet(anthem.src, anthem.sa).split(' ').slice(0, 4).join(' ') === 'Sa Re Ga Ma', 'anthem opens Sa Re Ga Ma (D E F# G on Sa=D)');
  const gur = R.SONGS.find(x => x.t === 'GURENGE');
  ok(R.sargamSheet(gur.src, gur.sa).split(' ')[0] === "Sa'", 'Gurenge opens on taar Sa (D5 on Sa=D)');
  /* THE EXACTNESS PROOF: every token of every song's sargam line must decode back
     to the exact semitone the chamber will play — zero transcription drift. */
  const PC = {}; R.SARGAM_NAMES.forEach((n, i) => PC[n] = i);
  let checked = 0, bad = 0;
  for (const s of R.SONGS){
    const sa = s.sa || 60;
    const evs = R.expandSong(s.src, s.bpm).filter(e => e.midi > 0);
    const toks = R.sargamSheet(s.src, sa).split(' ').filter(t => t !== '·');
    if (toks.length !== evs.length){ bad++; continue; }
    for (let i = 0; i < evs.length; i++){
      const pitch = toks[i].replace(/[–=]/g, ''); /* strip duration marks first */
      const bare = pitch.replace(/^,/, '').replace(/'$/, '');
      const rel = evs[i].midi - sa;
      const pcExp = ((rel % 12) + 12) % 12;
      if (PC[bare] !== pcExp) bad++;
      const upper = pitch.endsWith("'"), lower = pitch.startsWith(',');
      const oct = Math.floor(rel / 12);
      if ((oct > 0) !== upper || (oct < 0) !== lower) bad++;
      checked++;
    }
  }
  ok(checked > 340 && bad === 0, 'all ' + checked + ' sargam tokens across 29 songs decode to the exact semitone + octave played (0 mismatches)');
}

console.log('[8] strict 15-minute break contract');
ok(R.BREAK_MS === 900000, 'break cap is exactly 15:00.000');
ok(R.fmtClock(900000) === '15:00' && R.fmtClock(59000) === '0:59' && R.fmtClock(-5) === '0:00', 'countdown clock formatting');
ok(typeof R._expireBreak === 'function', 'test hook for expiry exposed');

console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
