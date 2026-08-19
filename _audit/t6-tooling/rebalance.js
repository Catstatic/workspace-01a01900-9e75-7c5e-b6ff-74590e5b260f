/* rebalance v2 (raw-span safe): rotate correct-answer letters per mock to 7/6/6/6
   by splitting each o:[...] array into RAW source chunks (escapes preserved). */
const fs = require('fs');
const f = process.argv[2];
let s = fs.readFileSync(f, 'utf8');
global.window = {};
eval(s);
const lanes = Object.keys(window.TOPICFORGE_BANKS);
const preBank = JSON.parse(JSON.stringify(window.TOPICFORGE_BANKS[lanes[0]]));
// locate all o:[ ... ],a:N objects via escape-aware walker
function spans() {
  const out = [];
  let i = 0;
  while (true) {
    const j = s.indexOf('o:[', i);
    if (j === -1) break;
    let k = j + 3, depth = 1, inQ = false;
    const chunks = [];
    let cStart = k;
    while (k < s.length && depth > 0) {
      const ch = s[k];
      if (ch === "'") {
        if (s[k-1] === '\\') { k++; continue; }
        inQ = !inQ;
      } else if (!inQ) {
        if (ch === '[') depth++;
        else if (ch === ']') { depth--; if (depth === 0) { chunks.push(s.slice(cStart, k)); break; } }
        else if (ch === ',' && depth === 1) { chunks.push(s.slice(cStart, k)); cStart = k + 1; }
      }
      k++;
    }
    const am = s.slice(k + 1).match(/^,a:(\d)/);
    if (chunks.length !== 4 || !am) { out.push({ err: true, at: j }); i = k; continue; }
    out.push({ oStart: j, aStart: k + 1 + am[0].length - 1, chunks, a: +am[1] });
    i = k;
  }
  return out;
}
const sp = spans();
const mocksFlat = [];
preBank.mocks.forEach(m => m.problems.forEach((p, idx) => mocksFlat.push({ mock: m.id, id: p.id, a: p.a, target: idx % 4 })));
if (sp.length !== mocksFlat.length) { console.log('span/problem mismatch', sp.length, mocksFlat.length); process.exit(1); }
if (sp.some(x => x.err)) { console.log('unparseable spans present'); process.exit(1); }
// rebuild from END backward
for (let g = sp.length - 1; g >= 0; g--) {
  const { oStart, aStart, chunks, a } = sp[g];
  const target = mocksFlat[g].target;
  if (a === target) continue;
  const correct = chunks[a];
  const rest = chunks.filter((_, i2) => i2 !== a);
  const rebuilt = [];
  let ri = 0;
  for (let t = 0; t < 4; t++) rebuilt.push(t === target ? correct : rest[ri++]);
  const newSeg = 'o:[' + rebuilt.join(',') + '],a:' + target;
  s = s.slice(0, oStart) + newSeg + s.slice(aStart + 1);
}
fs.writeFileSync(f, s);
// verify: eval post, compare letters + option-content multisets
const s2 = fs.readFileSync(f, 'utf8');
global.window = {};
eval(s2);
const post = window.TOPICFORGE_BANKS[lanes[0]];
let bad = 0;
post.mocks.forEach((m, mi) => {
  const L = [0,0,0,0];
  m.problems.forEach((p, pi) => {
    L[p.a]++;
    const preP = preBank.mocks[mi].problems[pi];
    const key = arr => arr.slice().sort().join('');
    if (key(preP.o) !== key(p.o)) { bad++; console.log('CONTENT DRIFT', p.id); }
    if (p.o[p.a] !== preP.o[preP.a]) { bad++; console.log('ANSWER DRIFT', p.id); }
  });
  console.log(m.id + ' letters ' + L.join('/'));
});
console.log(bad ? 'REBALANCE: ' + bad + ' drift faults' : 'rebalanced 250 problems, content preserved');
process.exit(bad ? 1 : 0);
