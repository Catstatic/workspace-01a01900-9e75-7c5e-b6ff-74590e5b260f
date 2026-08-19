/* synt: syntax-check every inline <script> in the deliverable + every companion js */
const fs = require('fs'), vm = require('vm');
const H = fs.readFileSync('/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html', 'utf8');
let bad = 0, n = 0;
const re = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(H))) {
  n++;
  const body = m[1].trim();
  if (!body) continue;
  try { new vm.Script(body); } catch (e) { bad++; console.log('INLINE #' + n + ' :: ' + e.message.slice(0, 120)); }
}
console.log(n + ' inline scripts checked, ' + bad + ' with syntax errors');
const { execSync } = require('child_process');
const files = execSync('ls /home/user/project/*.js').toString().trim().split('\n');
let bad2 = 0;
files.forEach(f => { try { new vm.Script(fs.readFileSync(f, 'utf8')); } catch (e) { bad2++; console.log('COMPANION ' + f + ' :: ' + e.message.slice(0, 120)); } });
console.log(files.length + ' companion js files checked, ' + bad2 + ' with syntax errors');
process.exit(bad + bad2 ? 1 : 0);
