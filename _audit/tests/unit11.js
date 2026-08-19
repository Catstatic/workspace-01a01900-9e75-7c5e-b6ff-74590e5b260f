/* unit11 — GameForge II pure logic: Gray Fog generator, AI batch validation,
   White Room commentator (throttle, fallback, sanitisation). No DOM needed. */
const fs = require('fs');
const vm = require('vm');
const SRC = fs.readFileSync('/home/user/_audit/ins10_js.js', 'utf8');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

function makeSandbox(opts){
  opts = opts || {};
  const toasts = [];
  const sandbox = {
    window: {}, console,
    showToast: m => toasts.push(m),
    __toasts: toasts
  };
  if (opts.aiConfigured) sandbox.localStorage = { getItem: () => JSON.stringify({ model: 'm', key: 'k', format: 'openai' }) };
  if (opts.aiEngine) sandbox.window.AiEngine = opts.aiEngine;
  vm.runInNewContext(SRC, sandbox, { filename: 'ins10_js.js' });
  return sandbox;
}
const BASE5 = [
  {name:'THE WATCHER',clues:['a','b','c'],options:['SEER','SPECTATOR','APPRENTICE','FOOL'],answer:1},
  {name:'THE SEALED ROOM',clues:['a','b','c'],options:['SEQUENCE 9','SEQUENCE 8','SEQUENCE 6','SEQUENCE 4'],answer:1},
  {name:'THE ACTING METHOD',clues:['a','b','c'],options:['ACTING','DIVINATION','RITUAL','ESCAPE'],answer:0},
  {name:'THE FOOL ABOVE',clues:['a','b','c'],options:['THE FOOL','THE SUN','THE TOWER','THE MOON'],answer:0},
  {name:'THE FINAL CLUE',clues:['a','b','c'],options:['OBSERVE','RUSH','FORGET','SURRENDER'],answer:0}
];

(async function main(){

console.log('[1] exports + queue scaffolding');
const sb = makeSandbox();
const GF = sb.window.GameForge;
ok(GF && typeof GF.mysteryQueue === 'function' && typeof GF.chessNote === 'function', 'GameForge II merges into the singleton');
ok(['noobie','adept','elite','godhood'].map(GF.mysteryTarget).join(',') === '4,6,8,10', 'mysteryTarget: 4/6/8/10 by level (real difficulty)');
ok(GF.mysteryTarget('bogus') === 6, 'mysteryTarget fallback = adept');
const q0 = GF.mysteryQueue('adept', BASE5);
ok(q0.length === 9, 'mysteryQueue: 5 handcrafted + generated to 9');
ok(q0.slice(0,5).every((c,i) => c.name === BASE5[i].name), 'handcrafted 5 keep their original order at the front');
const q1 = q0.slice(); GF.mysteryPoke(q1, 7, 'godhood');
ok(q1.length >= 12, 'mysteryPoke keeps ≥5 cases ahead of the cursor');
const sig = new Set(q0.slice(5).map(c => c.name + '|' + c.clues.join('|')));
ok(sig.size === q0.length - 5, 'generated cases in a queue are unique');

console.log('[2] generator shape, validity, uniqueness at every level');
let shapes = {path:0, seq:0, doc:0}, valid = true, seqOk = true, uniques = new Set();
for (const level of ['noobie','adept','elite','godhood']){
  for (let i = 0; i < 320; i++){
    const c = GF._genMysteryCase(level);
    if (!/^[A-Z0-9 ·—'()-]{4,40}$/.test(c.name)) valid = false;
    if (!Array.isArray(c.clues) || c.clues.length !== 3 || new Set(c.clues).size !== 3) valid = false;
    if (!Array.isArray(c.options) || c.options.length !== 4 || new Set(c.options).size !== 4) valid = false;
    if (!Number.isInteger(c.answer) || c.answer < 0 || c.answer > 3 || !c.options[c.answer]) valid = false;
    uniques.add(c.name + '|' + c.clues[0] + '|' + c.options.slice().sort().join('/'));
    if (c.options.every(o => /^SEQUENCE \d$/.test(o))){
      shapes.seq++;
      const t = Number(c.options[c.answer].slice(-1));
      for (const clue of c.clues){
        let m;
        if ((m = clue.match(/exactly (\d+) steps/)) && Number(m[1]) !== t) seqOk = false;
        if ((m = clue.match(/landed showing (\d+)\./)) && Number(m[1]) !== t) seqOk = false;
        if ((m = clue.match(/above (\d+) —/)) && Number(m[1]) !== t - 1) seqOk = false;
        if ((m = clue.match(/(\d+) candles in total/)) && Number(m[1]) !== 2 * t) seqOk = false;
        if ((m = clue.match(/seal: (\d+) and (\d+)\./)) && Number(m[1]) + Number(m[2]) !== t) seqOk = false;
        if ((m = clue.match(/then (\d+) more/)) && 3 + Number(m[1]) !== t) seqOk = false;
      }
    }
    else if (c.options.every(o => ['ACTING','DIVINATION','RITUAL','OBSERVATION'].includes(o))) shapes.doc++;
    else shapes.path++;
  }
}
ok(valid, 'all 1280 generated cases: name/clues/options/answer well-formed');
ok(shapes.path > 400 && shapes.seq > 100 && shapes.doc > 50, 'all three case shapes appear (path ' + shapes.path + ' / seq ' + shapes.seq + ' / doctrine ' + shapes.doc + ')');
ok(seqOk, 'every sequence-riddle clue is arithmetically true of the correct answer');
const rate = uniques.size / 1280;
ok(rate >= 0.85, 'uniqueness ' + (rate*100).toFixed(1) + '% across 1280 generated cases (≥85% required)');
const g = GF._genMysteryCase('godhood'); /* godhood clue subtlety */
ok(g.clues.length === 3, 'godhood case still exactly 3 clues');

console.log('[3] parseMysteryBatch — strict AI output validation');
const goodBatch = JSON.stringify([
  {name:'THE VELVET HOUR', clues:['The clock struck thirteen at dawn.','Every mirror showed a different moon.','The guest book wrote its own entry.'], options:['DREAM PATHWAY','RIVER PATHWAY','SUN PATHWAY','DOOR PATHWAY'], a:0},
  {name:'THE QUIET LEDGER', clues:['The numbers added themselves nightly.','The banker never owned a bank.','Gold vanished without a single lock turning.'], options:['MARAUDER','SEER','BARD','SAILOR'], a:0}
]);
ok(GF._parseMysteryBatch('prelude ' + goodBatch + ' epilogue').length === 2, 'parses a valid batch out of surrounding prose');
const parsed = GF._parseMysteryBatch(goodBatch)[0];
ok(parsed.ai === true && parsed.name === 'THE VELVET HOUR' && parsed.answer === 0, 'parsed case tagged ai:true with intact fields');
ok(GF._parseMysteryBatch(goodBatch)[0].options.every(o => o === o.toUpperCase()), 'options normalized to ALL-CAPS');
ok(GF._parseMysteryBatch('not json at all').length === 0, 'garbage → empty');
ok(GF._parseMysteryBatch('{"not":"array"}').length === 0, 'non-array JSON → empty');
ok(GF._parseMysteryBatch('[{"name":"X","clues":["a","b"],"options":["A","B","C","D"],"a":0}]').length === 0, 'rejects 2-clue case');
ok(GF._parseMysteryBatch('[{"name":"VALID NAME","clues":["one clue sentence here","two clue sentence ok","third clue here too"],"options":["A","B","C"],"a":0}]').length === 0, 'rejects 3-option case');
ok(GF._parseMysteryBatch('[{"name":"VALID NAME","clues":["one clue sentence here","two clue sentence ok","third clue here too"],"options":["SAME","SAME","C","D"],"a":0}]').length === 0, 'rejects duplicate options');
ok(GF._parseMysteryBatch('[{"name":"VALID NAME","clues":["one clue sentence here","two clue sentence ok","third clue here too"],"options":["A","B","C","D"],"a":4}]').length === 0, 'rejects answer index 4');
ok(GF._parseMysteryBatch('[{"name":"VALID NAME","clues":["one clue sentence here","two clue sentence ok","third clue here too"],"options":["A","B","C","D"],"a":"0"}]').length === 0, 'rejects string answer index');
ok(GF._parseMysteryBatch('[{"name":"VALID NAME","clues":["same clue repeated here","same clue repeated here","third clue here too"],"options":["A","B","C","D"],"a":0}]').length === 0, 'rejects duplicated clues');

console.log('[4] AI archivist prefetch — success, splice position, fallback latch');
const sb2 = makeSandbox({ aiConfigured: true, aiEngine: { calls: 0, async call(){ this.calls++; return { text: goodBatch }; } } });
const qs = sb2.window.GameForge.mysteryQueue('adept', BASE5);
const pr = (function(){ const G = sb2.window.GameForge; G.mysteryPoke(qs, 0, 'adept'); return G; })();
ok(sb2.window.AiEngine.calls === 1, 'prefetch fires one AI batch when warmed');
await new Promise(r => setTimeout(r, 20));
ok(qs.filter(q => q.ai).length === 2, '2 AI case files spliced into the queue');
ok(qs[1].ai === true && qs[2].ai === true, 'AI files land immediately after the current case (positions 1-2)');
ok(sb2.__toasts.some(t => t.includes('AI archivist online')), 'honest toast announces the AI archivist');
const sb3 = makeSandbox({ aiConfigured: true, aiEngine: { calls: 0, async call(){ this.calls++; throw new Error('HTTP 429'); } } });
const qs3 = sb3.window.GameForge.mysteryQueue('elite', BASE5);
sb3.window.GameForge.mysteryPoke(qs3, 0, 'elite');
await new Promise(r => setTimeout(r, 20));
ok(sb3.window.GameForge._mysteryAi.down === true, 'first failure latches aiDown');
ok(sb3.__toasts.some(t => t.includes('AI archivist unavailable')), 'one honest failure toast');
sb3.window.GameForge.mysteryPoke(qs3, 2, 'elite'); sb3.window.GameForge.mysteryPoke(qs3, 4, 'elite');
ok(sb3.window.AiEngine.calls === 1, 'no further AI calls after the latch');
ok(qs3.every(q => !q.ai), 'no phantom AI cases after failure');
ok(qs3.length >= 9, 'local generator keeps the queue alive after AI failure');

console.log('[5] White Room commentator — local quips, AI upgrade, throttle, sanitize');
ok(GF._commentNotable({side:'w', cap:'N'}) === true, 'capture is notable');
ok(GF._commentNotable({side:'w', check:true}) === true, 'check is notable');
ok(GF._commentNotable({side:'w', mate:true}) === true, 'mate is notable');
ok(GF._commentNotable({side:'w', n:9}) === true, 'every 3rd full move is notable');
ok(GF._commentNotable({side:'w', n:10}) === false && GF._commentNotable({side:'b', n:10}) === false, 'quiet moves are not notable');
ok(typeof GF._commentLocal({side:'w', mate:true}) === 'string' && GF._commentLocal({side:'w', cap:'Q', n:5}).length > 5, 'local quips for every category');
ok(GF._sanitizeComment('**too short**') === '', 'sanitizer rejects <12 chars');
ok((() => { const r = GF._sanitizeComment('> **“A very precise move, executed calmly.”**'); return !/[*_`#>~]/.test(r) && r.includes('A very precise move'); })(), 'sanitizer strips markdown/quotes, keeps the sentence');
ok(GF._sanitizeComment('word '.repeat(60)).length <= 150, 'sanitizer clamps to 150 chars');
ok(GF._sanitizeComment('line one is a decent comment.\nline two is dropped').includes('dropped') === false, 'sanitizer keeps only the first line');

const sb4 = makeSandbox({ aiConfigured: false, aiEngine: { calls: 0, async call(){ this.calls++; return { text: 'A quiet execution.' }; } } });
sb4.window.GameForge.chessNote({side:'new', diff:'GRANDMASTER'});
ok(sb4.window.GameForge._chessState.last && sb4.window.GameForge._chessState.last.text.includes('White Room'), 'new game: local opening line, no DOM, no crash');
sb4.window.GameForge.chessNote({side:'w', san:'e2–e4', n:2, diff:'GRANDMASTER'});
sb4.window.GameForge.chessNote({side:'b', san:'e7–e5', n:3, diff:'GRANDMASTER'});
ok(sb4.window.AiEngine.calls === 0, 'AI never called when AI is not configured');
const sb5 = makeSandbox({ aiConfigured: true, aiEngine: { calls: 0, async call(){ this.calls++; return { text: 'The knight falls without ceremony; the room approves.' }; } } });
const p5 = sb5.window.GameForge.chessNote({side:'w', san:'f3–e5', cap:'N', check:false, mate:false, ended:false, n:9, diff:'GRANDMASTER'});
ok(typeof p5.then === 'function', 'notable + configured → chessNote returns the AI promise');
await p5;
ok(sb5.window.GameForge._chessState.last.isAi === true && sb5.window.GameForge._chessState.last.text.startsWith('✦ AI · '), 'AI line labelled “✦ AI · …” (never masquerades as human)');
ok(sb5.__toasts.some(t => t.includes('AI commentator seated')), 'one honest seat-announcement toast');
sb5.window.GameForge.chessNote({side:'w', san:'d1–f3', cap:'Q', n:10, diff:'GRANDMASTER'});
ok(sb5.window.AiEngine.calls === 1, '9s throttle blocks the immediate second notable call');
const sb6 = makeSandbox({ aiConfigured: true, aiEngine: { calls: 0, async call(){ this.calls++; throw new Error('quota'); } } });
const p6 = sb6.window.GameForge.chessNote({side:'b', san:'d8–h4', check:true, n:8, diff:'GODHOOD'});
await p6;
ok(sb6.window.GameForge._chessState.down === true, 'commentator failure latches down');
ok(sb6.__toasts.some(t => t.includes('AI commentator unavailable')), 'honest failure toast for commentator');
sb6.window.GameForge.chessNote({side:'w', san:'e4xf5', cap:'B', mate:true, n:11, diff:'GODHOOD'});
ok(sb6.window.AiEngine.calls === 1, 'latched commentator never retries within the session');
ok(sb6.window.GameForge._chessState.last.isAi === false, 'last line stays a local quip after failure');

console.log('==========================');
console.log('UNIT11: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
