/* kcheck: KaTeX-strict render every $...$ segment of a part file (or bank file via --bank) */
const fs = require('fs');
const katex = require('katex');
const MODE = process.argv[2];
let arr = [];
if (MODE === '--bank') {
  global.window = {};
  eval(fs.readFileSync(process.argv[3], 'utf8'));
  const lane = Object.keys(window.TOPICFORGE_BANKS)[0];
  window.TOPICFORGE_BANKS[lane].mocks.forEach(m => m.problems.forEach(p => arr.push(p)));
} else {
  const raw = fs.readFileSync(MODE, 'utf8');
  arr = eval('[' + raw.replace(/,\s*$/, '') + ']');
}
let bad = 0, n = 0;
const OPTS = { strict: true, throwOnError: true };
function scan(txt, where) {
  const parts = txt.split('$');
  for (let i = 1; i < parts.length; i += 2) {
    n++;
    try { katex.renderToString(parts[i], OPTS); }
    catch (e) { bad++; console.log('  X KATEX ' + where + ' :: ' + parts[i].slice(0, 60) + ' :: ' + e.message.slice(0, 90)); }
  }
}
arr.forEach(p => {
  scan(p.q, p.id + '.q'); scan(p.sol, p.id + '.sol'); scan(p.vfy, p.id + '.vfy');
  p.o.forEach((oi, j) => scan(oi, p.id + '.o' + j));
});
console.log((bad ? 'KCHECK FAIL ' : 'KCHECK PASS ') + bad + ' bad of ' + n + ' math segments, ' + arr.length + ' problems');
process.exit(bad ? 1 : 0);
