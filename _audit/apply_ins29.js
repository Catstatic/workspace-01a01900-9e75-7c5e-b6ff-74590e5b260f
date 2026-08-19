#!/usr/bin/env node
/* ROUND 31 apply — embed ins29_css.css + ins29_js.js at the canonical seam
   (directly before the topicforge-map.js script tag), matching the house
   wrapper form used by R26-R30. Idempotent: refuses double-embed. */
'use strict';
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
const css = fs.readFileSync('/home/user/_audit/ins29_css.css', 'utf8').trim();
const js = fs.readFileSync('/home/user/_audit/ins29_js.js', 'utf8').trim();

let src = fs.readFileSync(P, 'utf8');
const seam = '<script src="./topicforge-map.js"></script>';
if (src.split(seam).length - 1 !== 1) throw new Error('seam tag count != 1');
if (src.indexOf('PAPERFORGE · MOCK VAULT + FORGE COCKPIT (ROUND 31)') >= 0)
  throw new Error('ROUND 31 already embedded — refusing double embed');
if (js.indexOf('</scr' + 'ipt>') >= 0) throw new Error('js master contains a closing script tag');
if (/\<\/body\>|\<\/style\>/.test(css)) throw new Error('css master contains forbidden literal');

const block = '<style>\n' + css + '\n</style>\n<script>\n' + js + '\n</script>\n';
/* splice by index — never String.replace: $-sequences ($$, $&, $') in the payload
   would expand. (R31 first attempt hit exactly this; corrected.) */
const i = src.indexOf(seam);
src = src.slice(0, i) + block + src.slice(i);
fs.writeFileSync(P, src);
console.log('ROUND 31 embedded:', block.length, 'chars inserted at seam.');
