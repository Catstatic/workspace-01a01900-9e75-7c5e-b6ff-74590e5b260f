/* bankcheck: structural + hygiene checks on a TOPICFORGE bank file */
const fs = require('fs');
const f = process.argv[2];
global.window = {};
eval(fs.readFileSync(f, 'utf8'));
const lanes = Object.keys(window.TOPICFORGE_BANKS || {});
const lane = lanes[0];
const bank = window.TOPICFORGE_BANKS[lane];
let issues = 0;
const err = (m) => { console.log('  X ' + m); issues++; };
const PALETTE = ['#405060','#6ea8fe','#d9a441','#e5534b','#9db2c8','#6b7c8f','#2ea043','#7ee787','#0b0e13'];
const banField = (txt, where) => {
  if (/[<>	−₹]/.test(txt)) err(where + ' banned char in q/o/sol/vfy');
};
const fleetSubs = {};
bank.mocks.forEach(m => {
  let seeds = 0, std = 0, apex = 0; const letters = [0,0,0,0]; let figs = 0;
  if (m.problems.length !== 25) err(m.id + ' has ' + m.problems.length + ' problems');
  m.problems.forEach(p => {
    if (p.diff === 'seed') seeds++; else if (p.diff === 'standard') std++; else apex++;
    letters[p.a]++;
    if (p.fig) {
      figs++;
      if (/<script|<image|<use|href|url\(|http(?!:\/\/www\.w3\.org\/2000\/svg)/.test(p.fig)) err(p.id + ' fig banned token');
      if (/[	−₹]/.test(p.fig)) err(p.id + ' fig banned char');
      const cols = PALETTE.filter(c => p.fig.includes(c));
      if (cols.length < 2) err(p.id + ' fig uses <2 palette colors');
      (p.fig.match(/#[0-9a-fA-F]{6}/g) || []).forEach(c => { if (PALETTE.indexOf(c.toLowerCase()) === -1) err(p.id + ' off-palette hex ' + c); });
    }
    if (p.q.length < 30) err(p.id + ' q short ' + p.q.length);
    if (p.sol.length < 80) err(p.id + ' sol short ' + p.sol.length);
    if (p.vfy.length < 30) err(p.id + ' vfy short ' + p.vfy.length);
    if (!Array.isArray(p.o) || p.o.length !== 4) err(p.id + ' options != 4');
    banField(p.q, p.id); banField(p.sol, p.id); banField(p.vfy, p.id);
    p.o.forEach(o => banField(o, p.id));
    fleetSubs[p.sub] = (fleetSubs[p.sub] || 0) + 1;
  });
  console.log(`${m.id} | stamp ${seeds}/${std}/${apex} | letters ${letters.join('/')} | figs ${figs}`);
  if (seeds !== 6 || std !== 12 || apex !== 7) err(m.id + ' stamp off');
  letters.forEach((c, i) => { if (c < 4) err(m.id + ' letter <4'); });
});
console.log('fleet subs: ' + JSON.stringify(fleetSubs));
console.log(issues ? 'BANKCHECK: ' + issues + ' issues' : 'BANKCHECK PASS');
process.exit(issues ? 1 : 0);
