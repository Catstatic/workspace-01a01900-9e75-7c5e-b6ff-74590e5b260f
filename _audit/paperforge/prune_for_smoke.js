#!/usr/bin/env node
/* PRUNE-FOR-SMOKE — memory-safe copy of the tracker for jsdom boots.
   The tracker carries ~43.6 MB of base64 data-URI media (GATE source crops,
   gallery art, audio). jsdom never loads resources, but parsing 47 MB of
   string mass OOM-kills this 2 GB sandbox. We blank long base64 payloads to
   `data:,` (syntactically valid, zero mass) — ALL logic, scripts, styles,
   masters and seams survive untouched. Writes /tmp/tracker_pruned.html. */
'use strict';
const fs = require('fs');
const SRC = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const OUT = '/tmp/tracker_pruned.html';
const s = fs.readFileSync(SRC, 'utf8');
const re = /data:(image|audio|video|font)\/[^;,]+;base64,[A-Za-z0-9+/=]{512,}/g;
const pruned = s.replace(re, 'data:,');
/* logic-integrity sentinels: if pruning ever ate logic, fail loudly */
['PFVAULT', 'SIM_PAPERS', 'topicforge-map.js', 'pf-legion', 'renderSimPaperList'].forEach(k => {
  if (pruned.indexOf(k) < 0) { console.error('PRUNE CORRUPTION: missing ' + k); process.exit(2); }
});
fs.writeFileSync(OUT, pruned);
console.log('pruned: ' + s.length + ' -> ' + pruned.length + ' chars (' +
  (pruned.length / 1048576).toFixed(1) + ' MB)');
