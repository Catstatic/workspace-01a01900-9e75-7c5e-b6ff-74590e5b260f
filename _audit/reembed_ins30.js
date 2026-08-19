#!/usr/bin/env node
/* Re-embed ROUND 32 (FIGFORGE) masters: locate the embedded ins30 pair by its
   UNIQUE banner markers (never a generic comment run), excise exactly that
   span, splice fresh master copies in place (index splice, no $-expansion). */
'use strict';
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let src = fs.readFileSync(P, 'utf8');
const css = fs.readFileSync('/home/user/_audit/ins30_figs_css.css', 'utf8').trim();
const js = fs.readFileSync('/home/user/_audit/ins30_figs_js.js', 'utf8').trim();
if (js.indexOf('</' + 'script>') >= 0) throw new Error('js master contains closing script tag');
if (css.indexOf('</' + 'style>') >= 0) throw new Error('css master contains closing style tag');

const MARK = 'FIGFORGE · CONTENT VAULT INLINE FIGURES (ROUND 32)';
const mi = src.indexOf(MARK);
if (mi < 0) throw new Error('ROUND 32 marker not embedded');
const b = src.lastIndexOf('<style>', mi);
if (b < 0) throw new Error('style open not found before marker');
const tailMark = js.slice(-60) + '\n</' + 'script>';
const ti = src.indexOf(tailMark, mi);
if (ti < 0) throw new Error('engine tail not found after marker');
const e = ti + tailMark.length + 1; /* trailing newline */
src = src.slice(0, b) + src.slice(e);

const seam = '<script src="./topicforge-map.js"></script>';
const i = src.indexOf(seam);
if (i < 0 || src.split(seam).length - 1 !== 1) throw new Error('seam broken');
const block = '<style>\n' + css + '\n</style>\n<script>\n' + js + '\n</script>\n';
src = src.slice(0, i) + block + src.slice(i);
fs.writeFileSync(P, src);
console.log('ROUND 32 re-embedded clean:', block.length, 'chars.');
