/* unit10 — GameForge (round 10): infinite equation queue, AI batch pipeline, slingshot sectors & rules. */
const fs = require('fs');
const src = fs.readFileSync('/home/user/_audit/ins9_js.js', 'utf8');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

function makeEnv(opts){
  opts = opts || {};
  const store = {};
  if (opts.settings) store['csirnet_ai_settings_v1'] = JSON.stringify(opts.settings);
  const calls = { ai: 0, usage: [], toasts: [] };
  const sandbox = {
    window: {},
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    showToast: m => calls.toasts.push(m),
    console: { info(){}, warn(){}, error(){} }
  };
  if (opts.aiImpl) sandbox.window.AiEngine = { call: (...a) => { calls.ai++; return opts.aiImpl(...a); } };
  sandbox.window.AiUsage = { track: (s, m) => calls.usage.push([s, m]) };
  const names = Object.keys(sandbox);
  const api = new Function(...names, src + '\n;return window.GameForge;')(...names.map(n => sandbox[n]));
  return { GF: api, calls };
}

(async function main(){
console.log('\n[1] procedural equation generator');
{
  const { GF } = makeEnv();
  const tiers2 = ['Coulomb','de Broglie','partition function','scales as x','Photoelectric','Infinite 1D','canonical ensemble','Ideal gas'];
  const n00b = Array.from({length: 300}, () => GF._genEquation('noobie'));
  ok(n00b.every(q => !tiers2.some(t => q.q.includes(t))), 'noobie pool never serves elite/godhood families');
  ok(n00b.every(q => q.o.length === 4 && new Set(q.o).size === 4 && q.a >= 0 && q.a < 4), 'noobie: 4 unique options, valid answer index');
  const god = Array.from({length: 300}, () => GF._genEquation('godhood'));
  ok(god.some(q => tiers2.some(t => q.q.includes(t))), 'godhood pool unlocks elite/trick families');
  ok(god.every(q => q.o.length === 4 && new Set(q.o).size === 4), 'godhood: options always 4 & unique');
  const uniq = new Set(god.map(q => q.q));
  ok(uniq.size >= 255, 'godhood: ' + uniq.size + '/300 unique questions (near-unlimited variety)');
  const correctOk = god.every(q => q.o[q.a] !== undefined);
  ok(correctOk, 'answer index always points at a real option');
}

console.log('\n[2] queue + poke + pace + status');
{
  const { GF } = makeEnv();
  const qs = GF.equationQueue('adept', [{q:'B',o:['1','2','3','4'],a:0}], [{q:'H',o:['1','2','3','4'],a:1}]);
  ok(qs.length >= 10, 'queue seeds to >=10 instantly (offline, no AI needed)');
  GF.equationPoke(qs, 8, 'elite');
  ok(qs.length - 8 >= 6, 'poke keeps 6+ questions ahead of the cursor');
  ok(GF.equationPace('noobie') === 0 && GF.equationPace('elite') === 18 && GF.equationPace('godhood') === 10, 'pace: noobie relaxed, elite 18s, godhood 10s');
  ok(GF.equationPace('nonsense') === 30, 'unknown level falls back to adept pace');
  const st = GF.equationStatus(qs, 'elite');
  ok(/[Uu]nlimited/.test(st) && st.includes('18s'), 'status line reports unlimited generator + pace');
}

console.log('\n[3] AI batch parse/validation');
{
  const { GF } = makeEnv();
  const good = 'junk before[{"q":"What is 2+2 in physics units?","o":["4","3","22","0"],"a":0},{"q":"λ = h/p — p doubles, λ?","o":["half","double","zero","same"],"a":0}]junk after';
  const parsed = GF._parseAiBatch(good);
  ok(parsed.length === 2 && parsed.every(q => q.ai === true), 'valid batch parsed, tagged ai:true');
  ok(GF._parseAiBatch('[{"q":"short","o":["a","b","c","d"],"a":0}]').length === 0, 'too-short question rejected');
  ok(GF._parseAiBatch('[{"q":"Long enough question text here","o":["a","a","c","d"],"a":0}]').length === 0, 'duplicate options rejected');
  ok(GF._parseAiBatch('[{"q":"Long enough question text here","o":["a","b","c","d"],"a":7}]').length === 0, 'out-of-range answer index rejected');
  ok(GF._parseAiBatch('no array here at all').length === 0 && GF._parseAiBatch('').length === 0, 'missing/empty payload → empty, no crash');
}

console.log('\n[4] AI prefetch — success, failure, offline');
{
  const settings = {provider:'gemini', format:'gemini', model:'gemini-3.6-flash', key:'K'};
  const batch = JSON.stringify(Array.from({length: 8}, (_, i) => ({q: 'AI question number ' + i + ' — pick the true statement', o: ['yes','no','maybe','never'], a: 0})));
  const env = makeEnv({settings, aiImpl: async () => ({text: batch})});
  const qs = env.GF.equationQueue('elite', [], []);
  GF_pokeAwait(env.GF, qs, 2, 'elite');
  await new Promise(r => setTimeout(r, 30));
  const aiCount = qs.filter(q => q.ai).length;
  ok(aiCount === 8, 'AI batch blended into live queue (' + aiCount + ' ai-tagged)');
  ok(env.calls.usage.length === 1 && env.calls.usage[0][1] === 'equation-ai-batch', 'AiUsage tracked');
  ok(env.calls.toasts.some(t => t.includes('AI question bank online')), 'user told AI bank is online');

  const env2 = makeEnv({settings, aiImpl: async () => { throw new Error('HTTP 404 nonsense'); }});
  const qs2 = env2.GF.equationQueue('noobie', [], []);
  GF_pokeAwait(env2.GF, qs2, 0, 'noobie');
  await new Promise(r => setTimeout(r, 30));
  GF_pokeAwait(env2.GF, qs2, 2, 'noobie');
  await new Promise(r => setTimeout(r, 30));
  ok(env2.calls.ai === 1, 'after one failure AI is latched off (no hammering): calls=' + env2.calls.ai);
  ok(env2.calls.toasts.some(t => t.includes('built-in unlimited generator')), 'fallback honestly announced');
  ok(!qs2.some(q => q.ai), 'no fake ai-tagged items on failure');

  const env3 = makeEnv({settings, aiImpl: async () => ({text: 'I cannot help with that.'})});
  const qs3 = env3.GF.equationQueue('adept', [], []);
  GF_pokeAwait(env3.GF, qs3, 0, 'adept');
  await new Promise(r => setTimeout(r, 30));
  ok(env3.calls.toasts.some(t => t.includes('unavailable')), 'unparseable AI reply → fallback notice');
}
function GF_pokeAwait(GF, qs, i, level){ try{ GF.equationPoke(qs, i, level); }catch(e){ console.log('poke error', e); } }

console.log('\n[5] slingshot sectors');
{
  const { GF } = makeEnv();
  const lv = GF.gravityLevels();
  ok(lv.length === 60, '60 sectors total (5 handcrafted + 55 generated)');
  ok(lv.slice(0,5).map(c => c.name).join(',') === 'FIRST ASSIST,LAGRANGE TURN,DOUBLE SLING,NEUTRON PASS,BLACK-HOLE GATE', 'original 5 untouched & first');
  const names = new Set(lv.map(c => c.name));
  ok(names.size === 60, 'all 60 sector names unique');
  const layouts = new Set(lv.slice(5).map(c => JSON.stringify([c.start, c.goal, c.planets])));
  ok(layouts.size === 55, 'all 55 generated layouts unique');
  ok(lv.every(c => c.planets.every(p => p.x >= 0.2 && p.x <= 0.8 && p.y >= 0.2 && p.y <= 0.82 && p.r >= 8 && p.r <= 32 && p.m > 0 && p.m <= 3)), 'planets within safe physical ranges');
  ok(lv.every(c => c.planets.every(p => Math.hypot(p.x - c.start[0], p.y - c.start[1]) > 0.14 && Math.hypot(p.x - c.goal[0], p.y - c.goal[1]) > 0.14)), 'start/goal never colliding with a planet');
  ok(lv.slice(14).some(c => c.planets.some(p => p.h)), 'hazard asteroids actually appear in later sectors');
  ok(lv[5].planets.every(p => !p.h), 'first generated sector is gentle (no hazards)');
  ok(lv.every((c, i) => i < 5 || (c.gateScale >= 0.55 && c.gateScale <= 1)), 'gateScale sane everywhere');
  const late = lv[55], early = lv[5];
  ok(late.gateScale <= early.gateScale, 'gates tighten as sectors progress');
  ok(JSON.stringify(GF._genSector(20)) === JSON.stringify(GF._genSector(20)), 'sector generation deterministic (same sector on every visit)');
}

console.log('\n[6] difficulty is REAL (slingshot rules)');
{
  const { GF } = makeEnv();
  const n = GF.gravityRules('noobie'), a = GF.gravityRules('adept'), e = GF.gravityRules('elite'), g = GF.gravityRules('godhood');
  ok(n.attempts === 5 && a.attempts === 3 && e.attempts === 2, 'attempts shrink: 5 → 3 → 2');
  ok(n.pull < a.pull && a.pull < e.pull && e.pull < g.pull, 'gravity pull strengthens ' + n.pull + '→' + g.pull);
  ok(n.gate > a.gate && a.gate > e.gate && e.gate > g.gate, 'dock gate tightens ' + n.gate + '→' + g.gate);
  ok(GF.gravityRules('godhood', {gateScale: 0.6}).gate < g.gate, 'sector gateScale multiplies difficulty');
  ok(GF.gravityRules('weird').attempts === 3, 'unknown level → adept rules');
}

console.log('\n==========================');
console.log('UNIT10: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
})();
