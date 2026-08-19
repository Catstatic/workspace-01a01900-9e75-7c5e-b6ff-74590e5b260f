#!/usr/bin/env node
/* Embed ROUND 32 (FIGFORGE content figures): splice style+script masters
   immediately before the topicforge-map companion seam (the paperforge R31
   pattern). Idempotent via head-marker guard. Index splice, no $-expansion. */
'use strict';
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let src = fs.readFileSync(P, 'utf8');
const css = fs.readFileSync('/home/user/_audit/ins30_figs_css.css', 'utf8').trim();
const js = fs.readFileSync('/home/user/_audit/ins30_figs_js.js', 'utf8').trim();
if (js.indexOf('</' + 'script>') >= 0) throw new Error('js master contains closing script tag');
if (css.indexOf('</' + 'style>') >= 0) throw new Error('css master contains closing style tag');
const headMark = 'FIGFORGE · CONTENT VAULT INLINE FIGURES (ROUND 32)';
if (src.indexOf(headMark) >= 0) throw new Error('ROUND 32 already embedded');
const seam = '<script src="./topicforge-map.js"></script>';
const i = src.indexOf(seam);
if (i < 0 || src.split(seam).length - 1 !== 1) throw new Error('seam broken');
const block = '<style>\n' + css + '\n</style>\n<script>\n' + js + '\n</script>\n';
src = src.slice(0, i) + block + src.slice(i);
fs.writeFileSync(P, src);
console.log('ROUND 32 embedded:', block.length, 'chars before the companion seam.');
