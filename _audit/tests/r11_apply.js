/* Round 11 apply: GameForge II masters + surgical hooks into base theme-game/chess code.
   Mirrors r10_apply: every surgical pair must occur EXACTLY once; old/new strings are
   archived in _audit/surgical_r11.json so the insertion verifier reverts them byte-exactly. */
const fs = require('fs');
const P = '/home/user/project/CSIR_GATE_Tracker_Physics_Lab_edited (3).html';
let doc = fs.readFileSync(P, 'utf8');
const origLen = doc.length;

const PAIRS = [];
const pair = (name, oldS, newS) => PAIRS.push({name, old: oldS, new: newS});

/* ---- PART A · GRAY FOG ARCHIVES (mystery mode hooks) ---- */
pair('myst-bank: rename handcrafted dossiers to baseCases',
`  function initMystery(){
    const cases=[`,
`  function initMystery(){
    const baseCases=[`);

pair('myst-wire: GameForge queue + difficulty target w/ original fallback',
`    const cfg=levelConfig();let index=0,sanity=cfg.sanity;`,
`    const cases=(window.GameForge&&GameForge.mysteryQueue)?GameForge.mysteryQueue(gameLevel,baseCases):baseCases.slice();
    const cfg=levelConfig();let index=0,sanity=cfg.sanity;const target=(window.GameForge&&GameForge.mysteryTarget)?GameForge.mysteryTarget(gameLevel):baseCases.length;`);

pair('myst-draw: poke + live target + sanity-pip crash fix + AI badge + escaping',
`    function draw(){
      const item=cases[index%cases.length];
      root.innerHTML='<div class="mystery-case-head"><span>CASE '+(index+1)+'/5</span><b>SANITY '+('●'.repeat(sanity)+'○'.repeat(3-sanity))+'</b></div><h3 class="mystery-case-title">'+item.name+'</h3><div class="mystery-clues">'+item.clues.map((c,i)=>'<div class="mystery-clue"><span>0'+(i+1)+'</span>'+c+'</div>').join('')+'</div><div class="mystery-options">'+item.options.map((o,i)=>'<button class="mystery-option" data-index="'+i+'">'+o+'</button>').join('')+'</div>';`,
`    function draw(){
      if(window.GameForge&&GameForge.mysteryPoke)GameForge.mysteryPoke(cases,index,gameLevel);
      const item=cases[index%cases.length];
      root.innerHTML='<div class="mystery-case-head"><span>CASE '+(index+1)+'/'+target+'</span><b>SANITY '+('●'.repeat(sanity)+'○'.repeat(Math.max(0,3-sanity)))+'</b></div>'+(item.ai?'<div class="mystery-ai-note"><span class="gf-ai-badge" title="Case file written by your configured AI provider">\\u2726 AI-GENERATED</span></div>':'')+'<h3 class="mystery-case-title">'+escapeHtml(item.name)+'</h3><div class="mystery-clues">'+item.clues.map((c,i)=>'<div class="mystery-clue"><span>0'+(i+1)+'</span>'+escapeHtml(c)+'</div>').join('')+'</div><div class="mystery-options">'+item.options.map((o,i)=>'<button class="mystery-option" data-index="'+i+'">'+escapeHtml(o)+'</button>').join('')+'</div>';`);

pair('myst-win: target-based victory instead of fixed 5',
`        if(chosen===item.answer){btn.classList.add('good');setScore(score+22+sanity*3);setStatus('Correct deduction · the fog parts.');index++;if(index>=cases.length){finish('The mystery is digested · you return above the gray fog.');return;}setTimeout(draw,420);}`,
`        if(chosen===item.answer){btn.classList.add('good');setScore(score+22+sanity*3);setStatus(index+1<target?('Correct deduction · the fog parts · case '+(index+2)+' of '+target+' surfaces.'):'Correct deduction · the fog parts.');index++;if(index>=target){finish('The mystery is digested · you return above the gray fog.');return;}setTimeout(draw,420);}`);

pair('myst-status: archives status line w/ original fallback',
`    draw();setStatus('Read the three clues, then declare the pathway.');`,
`    draw();setStatus((window.GameForge&&GameForge.mysteryStatus)?GameForge.mysteryStatus(cases,gameLevel,target):'Read the three clues, then declare the pathway.');`);

/* ---- PART B · WHITE ROOM COMMENTATOR (break chess hooks) ---- */
pair('chess-player-move hook',
`      pushHistory();board=applyMove(board,move.from,move.to);lastMove=move;selected=null;legal=[];turn='b';moveNumber+=1;render();
      if(!evaluateAfterMove()){setStatus('Shadow engine calculating · '+notation(move));aiTimer=setTimeout(engineMove,520);}`,
`      pushHistory();board=applyMove(board,move.from,move.to);lastMove=move;selected=null;legal=[];turn='b';moveNumber+=1;render();
      if(!evaluateAfterMove()){setStatus('Shadow engine calculating · '+notation(move));aiTimer=setTimeout(engineMove,520);}
      if(window.GameForge&&GameForge.chessNote)GameForge.chessNote({side:'w',san:notation(move),cap:move.captured?move.captured[1]:null,promote:(move.piece&&move.piece[1]==='P'&&move.to.r===0),check:inCheck(board,'b'),mate:gameOver&&inCheck(board,'b'),ended:gameOver,n:moveNumber,diff:difficultyLabel()});`);

pair('chess-engine-move hook',
`    if(!evaluateAfterMove())setStatus('Your move · '+settings.label+' played '+notation(best)+'.');
    render();
  }
  function newGame(){`,
`    if(!evaluateAfterMove())setStatus('Your move · '+settings.label+' played '+notation(best)+'.');
    if(window.GameForge&&GameForge.chessNote)GameForge.chessNote({side:'b',san:notation(best),cap:best.captured?best.captured[1]:null,promote:(best.piece&&best.piece[1]==='P'&&best.to.r===7),check:inCheck(board,'w'),mate:gameOver&&inCheck(board,'w'),ended:gameOver,n:moveNumber,diff:settings.label});
    render();
  }
  function newGame(){`);

pair('chess-new-game hook',
`    setStatus('Your move · select a white piece.');render();startClock();`,
`    setStatus('Your move · select a white piece.');if(window.GameForge&&GameForge.chessNote)GameForge.chessNote({side:'new',diff:difficultyLabel()});render();startClock();`);

/* ---- run surgical pairs ---- */
const manifest = [];
for (const p of PAIRS){
  const n = doc.split(p.old).length - 1;
  if (n !== 1){ console.error('PAIR FAIL [' + p.name + ']: found ' + n + ' occurrence(s), need exactly 1'); process.exit(1); }
  doc = doc.replace(p.old, () => p.new);
  manifest.push({name: p.name, old: p.old, new: p.new});
  console.log('  ✔ ' + p.name + ' (' + p.old.length + ' → ' + p.new.length + ' chars)');
}

/* ---- append GameForge II CSS after ins9 css ---- */
const css = fs.readFileSync('/home/user/_audit/ins10_css.css', 'utf8').replace(/\s+$/, '');
const css9 = fs.readFileSync('/home/user/_audit/ins9_css.css', 'utf8');
const anchor = css9.replace(/\s+$/, '').slice(-60);
if (doc.split(anchor).length - 1 !== 1){ console.error('CSS anchor (ins9 tail) not unique'); process.exit(1); }
doc = doc.replace(anchor, () => anchor + '\n\n' + css);
console.log('  ✔ ins10_css appended (' + css.length + ' chars)');

/* ---- append GameForge II JS before </body> (after round-10 block) ---- */
const js = fs.readFileSync('/home/user/_audit/ins10_js.js', 'utf8').replace(/\s+$/, '');
if (doc.split('</body>').length - 1 !== 1){ console.error('body close not unique'); process.exit(1); }
doc = doc.replace('</body>', () => '\n<script>\n' + js + '\n\n</script>\n</body>');
console.log('  ✔ ins10_js appended (' + js.length + ' chars)');

fs.writeFileSync(P, doc, 'utf8');
fs.writeFileSync('/home/user/_audit/surgical_r11.json', JSON.stringify({round: 11, note: 'GameForge II surgical hooks (mystery archives + chess commentator); verifier reverts these new→old after stripping insertion blocks.', pairs: manifest}, null, 1));
console.log('\nwritten: ' + origLen + ' → ' + doc.length + ' chars | manifest: _audit/surgical_r11.json (' + manifest.length + ' pairs)');
