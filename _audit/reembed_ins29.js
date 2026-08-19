#!/usr/bin/env node
/* Re-embed ROUND 31: remove the embedded ins29 spans (style+script) exactly,
   then splice fresh copies from the masters (index splice — no $-expansion). */
'use strict';
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let src = fs.readFileSync(P, 'utf8');
const css = fs.readFileSync('/home/user/_audit/ins29_css.css', 'utf8').trim();
const js = fs.readFileSync('/home/user/_audit/ins29_js.js', 'utf8').trim();

const startMark = '<style>\n/* 🗄️ PAPERFORGE · MOCK VAULT + FORGE COCKPIT (ROUND 31) — styles';
const tailMark = js.slice(-60) + '\n</' + 'script>\n';
const b = src.indexOf(startMark);
if (b < 0) throw new Error('R31 embed start not found');
const ti = src.indexOf(tailMark, b);
if (ti < 0) throw new Error('R31 embed tail not found');
const e = ti + tailMark.length;
src = src.slice(0, b) + src.slice(e);

const seam = '<script src="./topicforge-map.js"></script>';
const i = src.indexOf(seam);
if (i < 0 || src.split(seam).length - 1 !== 1) throw new Error('seam broken');
const block = '<style>\n' + css + '\n</style>\n<script>\n' + js + '\n</script>\n';
src = src.slice(0, i) + block + src.slice(i);
fs.writeFileSync(P, src);
console.log('ROUND 31 re-embedded clean:', block.length, 'chars.');
