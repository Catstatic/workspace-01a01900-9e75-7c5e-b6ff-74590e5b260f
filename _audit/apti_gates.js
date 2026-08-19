// ══ APTIFORGE · ZERO-ERROR GATE SUITE (multi-module: C1 pilot A6 + C2 wing A1–A5) ══
// Gates: 0 parse/exports · 1 math (KaTeX) · 2 arithmetic · 3 coverage · 4 English/style
// Run: node _audit/apti_gates.js       (katex from /tmp/domt/node_modules)
const fs=require('fs'),path=require('path'),vm=require('vm');
const SRC=fs.readFileSync(path.join(__dirname,'../project/aptitude-content.js'),'utf8');
let pass=0,fail=0;const fails=[];
function T(name,cond,detail){if(cond){pass++;}else{fail++;fails.push(name+(detail?(' :: '+detail):''));}}

// ── GATE 0 · parse & structural integrity ─────────────────────────────────────
const sandbox={window:{},console};vm.createContext(sandbox);
let M,D;
try{vm.runInContext(SRC,sandbox);M=sandbox.window.APTITUDE_CONTENT_META;D=sandbox.window.APTITUDE_CONTENT_DATA;}
catch(e){console.error('GATE0 FATAL:',e.message);process.exit(1);}
T('GATE0 META+DATA exported, version C4',!!M&&!!D&&M.version==='C4');
T('GATE0 exactly 12 modules (A1..A12)',!!M&&M.modules.length===12,'count='+(M&&M.modules.length));
const mods=M.modules;
mods.forEach(m=>{
  const md=D[m.file]||'';
  T('GATE0 '+m.id+' vault key + markdown >=9KB',md.length>=9000,(md.length/1024).toFixed(1)+'KB');
});

// ── GATE 1 · MATH GATE — every formula must render under KaTeX 0.16.11 ────────
const katex=require('/tmp/domt/node_modules/katex');
let texN=0,texBad=0;const seen=new Set();
function tex(t,where,disp){
  if(seen.has(t))return;seen.add(t);texN++;
  try{katex.renderToString(t,{throwOnError:true,displayMode:disp,strict:'error'});}
  catch(e){texBad++;fails.push('MATH['+where+'] :: '+String(e.message||e).slice(0,150)+' ⟮'+t.slice(0,60)+'⟯');}
}
function scanMath(str,where){
  if(!str)return;
  str.replace(/\$\$([\s\S]*?)\$\$/g,(m,t)=>{tex(t,where,true);return m;});
  str.replace(/\$([^$\n]+)\$/g,(m,t)=>{tex(t,where,false);return m;});
}
mods.forEach(m=>scanMath(D[m.file]||'',m.id));
T('GATE1 math: '+texN+' unique formulas, 0 parse errors (strict mode)',texBad===0);

// ── GATE 2 · ARITHMETIC GATE — re-compute every worked-example answer ─────────
const MATH={Math:Math};   // allow Math.sqrt etc., nothing else
let arN=0,arBad=0;
mods.forEach(m=>m.examples.forEach(e=>{
  const v=e.verify;arN++;
  if(!v||typeof v.value!=='number'||!v.expr){arBad++;fails.push('ARITH '+e.id+' missing verify');return;}
  if(!/^[\d+\-*/%().\s><=!,A-Za-z]+$/.test(v.expr)){arBad++;fails.push('ARITH '+e.id+' bad charset');return;}
  let got;
  try{got=vm.runInNewContext('('+v.expr+')',MATH,{timeout:1000});}
  catch(err){arBad++;fails.push('ARITH '+e.id+' eval :: '+err.message);return;}
  const tol=v.tol!==undefined?v.tol:0.01;
  const ok=typeof got==='number'&&Math.abs(got-v.value)<=Math.max(tol,Math.abs(v.value)*1e-9);
  if(!ok){arBad++;fails.push('ARITH '+e.id+' :: recomputed='+got+' vs declared='+v.value+' '+v.unit);}
}));
T('GATE2 arithmetic: '+arN+' derivations recomputed, 0 mismatches',arBad===0);

// ── GATE 3 · COVERAGE — anchor table ↔ modules (official fence + umbrella flag) ─
const AO=M.anchorsOfficial, UM=M.umbrellaAtoms||{};
const official=new Set();Object.keys(AO).forEach(k=>AO[k].forEach(a=>official.add(k+':'+a)));
const umb=new Set();Object.keys(UM).forEach(k=>UM[k].forEach(a=>umb.add(k+':'+a)));
let covBad=0;
const atomHasCard={},atomHasEx={},atomHasSpeedCover={};
mods.forEach(m=>{
  // anchorAtoms must be declared for every anchor the module claims
  m.anchors.forEach(a=>{
    if(!AO[a]){covBad++;fails.push('COV '+m.id+' unknown anchor '+a);}
    (m.anchorAtoms[a]||[]).forEach(at=>{
      if(!AO[a]||AO[a].indexOf(at)<0){
        if(!(UM[a]&&UM[a].indexOf(at)>=0)){covBad++;fails.push('COV '+m.id+':'+a+':'+at+' outside official fence AND not umbrella-flagged');}
      }
      atomHasCard[a+':'+at]=false;atomHasEx[a+':'+at]=false;
    });
  });
  const declared=new Set();m.anchors.forEach(a=>(m.anchorAtoms[a]||[]).forEach(at=>declared.add(at)));
  m.cards.forEach(c=>c.covers.forEach(x=>{if(!declared.has(x)){covBad++;fails.push('COV '+c.id+' covers undeclared atom "'+x+'"');}}));
  m.examples.forEach(e=>e.covers.forEach(x=>{if(!declared.has(x)){covBad++;fails.push('COV '+e.id+' covers undeclared atom "'+x+'"');}}));
  m.cards.forEach(c=>c.covers.forEach(x=>{m.anchors.forEach(a=>{if((m.anchorAtoms[a]||[]).includes(x))atomHasCard[a+':'+x]=true;});}));
  m.examples.forEach(e=>e.covers.forEach(x=>{m.anchors.forEach(a=>{if((m.anchorAtoms[a]||[]).includes(x))atomHasEx[a+':'+x]=true;});}));
});
Object.keys(atomHasCard).forEach(k=>{
  if(!atomHasCard[k]){covBad++;fails.push('COV atom '+k+' has NO concept card');}
  if(!atomHasEx[k]){covBad++;fails.push('COV atom '+k+' has NO worked example');}
});
// declared anchorAtom stock per module (fence must be non-empty per anchor)
mods.forEach(m=>m.anchors.forEach(a=>{
  if(!(m.anchorAtoms[a]||[]).length){covBad++;fails.push('COV '+m.id+' claims anchor '+a+' but declares no atoms');}
}));
T('GATE3 coverage: '+Object.keys(atomHasCard).length+' anchor-atoms, each ≥1 card + ≥1 example',covBad===0);

// ── GATE 4 · ENGLISH / STYLE ──────────────────────────────────────────────────
let stBad=0,totWords=0,totBleed=0,totEx=0;
mods.forEach(m=>{
  const MD=D[m.file]||'';
  const words=MD.split(/\s+/).length;totWords+=words;
  [['recieve','receive'],['seperate','separate'],['occured','occurred'],['adress','address'],
   ['teh ','the '],['wich ','which '],['precent','percent'],['rainfal(?!l)','rainfall'],
   ['probabiltiy','probability'],['hyptoenuse','hypotenuse']].forEach(([bad,fix])=>{
    if(new RegExp(bad,'i').test(MD)){stBad++;fails.push('STYLE['+m.id+'] typo → "'+fix+'"');}});
  const bleed=(MD.match(/WHERE STUDENTS BLEED/g)||[]).length;totBleed+=bleed;
  if(bleed!==m.examples.length){stBad++;fails.push('STYLE['+m.id+'] trap callouts '+bleed+' != '+m.examples.length+' examples');}
  const exHeads=(MD.match(new RegExp('^## '+m.id+'-E\\d','gm'))||[]).length;
  if(exHeads!==m.examples.length){stBad++;fails.push('STYLE['+m.id+'] example headers '+exHeads+' != '+m.examples.length);}
  // per-example section quality
  const sections={};
  MD.split(new RegExp('^(## '+m.id+'-E\\d+[^\\n]*)$','gm')).forEach((chunk,i,arr)=>{
    const hm=chunk.match(new RegExp('^## ('+m.id+'-E\\d+)'));if(hm)sections[hm[1]]=arr[i+1]||'';});
  m.examples.forEach(e=>{
    const sec=sections[e.id]||'';totEx++;
    if(!sec){stBad++;fails.push('STYLE '+e.id+' section missing in md');return;}
    if(!/\*\*[^*]{15,}/.test(sec)){stBad++;fails.push('STYLE '+e.id+' thin/missing stem');}
    if(!/\*\*Solution/.test(sec)){stBad++;fails.push('STYLE '+e.id+' missing Solution marker');}
    if(!/WHERE STUDENTS BLEED/.test(sec)){stBad++;fails.push('STYLE '+e.id+' missing trap callout');}
    if(!/\$\$[\s\S]*?\$\$/.test(sec)){stBad++;fails.push('STYLE '+e.id+' section lacks display math');}
    if(sec.trim().length<320){stBad++;fails.push('STYLE '+e.id+' section too thin ('+sec.trim().length+' chars)');}
    if(!['seed','standard','apex'].includes(e.difficulty)){stBad++;fails.push('STYLE '+e.id+' bad difficulty tag');}
    if(!['CSIR','GATE','BOTH'].includes(e.exam)){stBad++;fails.push('STYLE '+e.id+' bad exam tag');}
  });
  if(!new RegExp('⚡ '+m.id+' SPEED SHEET').test(MD)){stBad++;fails.push('STYLE['+m.id+'] speed sheet missing');}
  if(words<1600){stBad++;fails.push('STYLE['+m.id+'] register too thin: '+words+' words (<1600)');}
});
T('GATE4 style lint: '+totWords+' words across 12 modules, '+totBleed+'/'+totEx+' trap callouts, no typos',stBad===0);

// ── REPORT ────────────────────────────────────────────────────────────────────
console.log('\n══════════ APTIFORGE GATES (C1-C4 · 12 modules) ══════════');
console.log(' unique formulas parsed :',texN);
console.log(' arithmetic derivations :',arN);
console.log(' anchor-atoms covered   :',Object.keys(atomHasCard).length);
console.log(' total words            :',totWords);
console.log(' trap callouts          :',totBleed+'/'+totEx);
console.log('──────────────────────────────────────────────────────────');
console.log(' PASS:',pass,'   FAIL:',fail);
if(fail){console.log('\n✗ FAILURES:');fails.forEach(f=>console.log('  ✗',f));process.exit(1);}
console.log('\n🔒 C4 ALL FOUR GATES GREEN — all 12 modules zero-error. Ready for C5 integration.');
