/* unit16 — round 18 FORGE GAMES logic layer: CORE CASCADE chain-reaction engine
   + STAR LATTICE puzzle builder/verifier. Runs the shipped ins17_js.js in a vm. */
const fs = require('fs');
const vm = require('vm');

let passed = 0, failed = 0;
const ok = (c, n) => { if (c){ passed++; console.log('  ✔ ' + n); } else { failed++; console.log('  ✘ FAIL: ' + n); } };

const src = fs.readFileSync('/home/user/_audit/ins17_js.js', 'utf8');
const sandbox = { window: {}, Math, console };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: 'ins17_js.js' });
const L = sandbox.window.__forgeLogic;
const pal = sandbox.forgePalette; /* top-level function declaration → context global */

console.log('[1] lattice/cascade primitives');
ok(typeof pal === 'function' && pal().length === 8 && pal().every(c => /^#[0-9a-f]{6}$/i.test(c)), 'forgePalette(): 8 hex colors');
ok(L.cascade.nbrs(0, 5).join(',') === '1,5', 'corner cell has 2 neighbours');
ok(L.cascade.nbrs(6, 5).sort((a, b) => a - b).join(',') === '1,5,7,11', 'interior cell has 4 neighbours');
ok(L.cascade.nbrs(2, 5).sort((a, b) => a - b).join(',') === '1,3,7', 'edge cell has 3 neighbours');

console.log('[2] cascade board generation');
{
  let seed = 42;
  const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000;
  const cells = L.cascade.board(6, 9, 2, rand);
  ok(cells.length === 36, 'board fills 6×6');
  const hos = cells.map((c, i) => c.o === 'H' ? i : -1).filter(i => i >= 0);
  ok(hos.length === 9, 'exactly 9 hostile orbs seeded');
  ok(hos.every(i => cells[i].e >= 1 && cells[i].e <= 2), 'hostile energy within 1..maxE');
  const adj = hos.some(i => L.cascade.nbrs(i, 6).some(j => cells[j].o === 'H'));
  ok(!adj, 'no two hostile orbs start adjacent (no instant chain)');
  ok(cells.every(c => c.o !== 'H' ? c.e === 0 : true), 'neutral cells start empty');
}

console.log('[3] cascade spark/resolve math');
{
  const mk = () => Array.from({ length: 9 }, () => ({ o: 'N', e: 0 }));
  /* single below-threshold tap: claims one cell, no explosion */
  let cells = mk(); cells[4] = { o: 'H', e: 1 };
  let r = L.cascade.spark(cells, 3, 0);
  ok(r.claims.length === 1 && r.waves.length === 0 && cells[0].e === 1 && cells[0].o === 'F', 'tap below 4 energy: claims, no wave');
  ok(r.cleared === false, 'hostile still standing → not cleared');
  /* hostile cells reject sparks */
  r = L.cascade.spark(cells, 3, 4);
  ok(r.blocked === true && cells[4].o === 'H' && cells[4].e === 1, 'sparking a hostile core is blocked');
  /* chain: 0 (e3) beside 1 (H, e3) — one spark cascades, converts, clears */
  cells = mk(); cells[0] = { o: 'F', e: 3 }; cells[1] = { o: 'H', e: 3 };
  r = L.cascade.spark(cells, 3, 0);
  ok(r.waves.length === 2, 'two detonation waves (cell 0, then cell 1)');
  ok(cells[1].o === 'F', 'hostile converted by the blast wave');
  ok(r.cleared === true, 'board cleared once last hostile converts');
  ok(r.claims.includes(0) && r.claims.includes(1), 'claims cover both detonators');
  /* multi-wave: three in a row at e3, spark the end */
  cells = mk(); cells[0] = { o: 'F', e: 3 }; cells[3] = { o: 'H', e: 3 }; cells[6] = { o: 'H', e: 3 };
  r = L.cascade.spark(cells, 3, 0);
  ok(r.waves.length === 3, 'chain propagates down the column (F→H→H)');
  ok(cells[3].o === 'F' && cells[6].o === 'F' && r.cleared, 'vertical cascade converts the stack');
  /* energy release spills to all 4 neighbours */
  cells = mk(); cells[4] = { o: 'F', e: 3 }; cells[1] = { o: 'H', e: 1 }; cells[7] = { o: 'H', e: 2 };
  L.cascade.spark(cells, 3, 4);
  ok(cells[1].o === 'F' && cells[1].e === 2 && cells[7].o === 'F' && cells[7].e === 3, 'blast ticks every neighbour +1');
  ok(cells[3].o === 'F' && cells[5].o === 'F', 'empty neighbours claim as friendly');
}

console.log('[4] star lattice builder invariants');
for (const [size, pairs] of [[5, 4], [6, 5], [8, 7]]){
  let seed = 7;
  const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000;
  const segs = L.lattice.build(size, pairs, rand);
  const seen = {};
  let cellsTotal = 0, dupes = 0;
  for (const s of segs) for (const c of s.cells){ cellsTotal++; if (seen[c]) dupes++; seen[c] = 1; }
  ok(dupes === 0 && cellsTotal === size * size, size + '×' + size + ': segments tile the whole grid exactly once');
  ok(segs.every(s => s.cells[0] === s.a && s.cells[s.cells.length - 1] === s.b), size + '×' + size + ': endpoints are the true segment ends');
  ok(segs.every(s => s.cells.length >= 2), size + '×' + size + ': no degenerate 1-cell segment');
  ok(segs.length >= pairs - 1, size + '×' + size + ': ~' + pairs + ' cores (' + segs.length + ')');
  /* solution exists by construction: walking each seg's cells from a to b */
  ok(segs.every(s => s.cells.every((c, i) => i === 0 || L.lattice.nbrs(s.cells[i - 1], size).includes(c))), size + '×' + size + ': built-in solution is edge-connected');
}

console.log('[5] lattice verify');
{
  const segs = [{ a: 0, b: 2 }, { a: 3, b: 5 }];
  ok(L.lattice.verify(3, segs, [[0, 1, 2], [3, 4, 5]]).ok === true, 'disjoint full paths verify ok');
  ok(L.lattice.verify(3, segs, [[0, 1, 2], [1, 4, 5]]).ok === false, 'cell collision rejects the state');
}

console.log('\n' + passed + ' passed, ' + failed + ' failed');
if (failed) process.exit(1);
