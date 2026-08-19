/* ============================================================
   ROUND 19 — RESONANCE CHAMBER: Ctrl+M music room.
   (R20/21 refresh: QWERTY letter sheets · MUSICAL BREAK launcher beside
   the break-game button · strict 15-minute auto-close · 25 songs.)
   A real two-octave keyboard + a 15-string pentatonic zither.
   Zither strings are PHYSICALLY MODELLED (Karplus-Strong plucked
   string, generated per note, cached) — not samples. Keyboard uses
   a warm triangle+sine voice through a lowpass + ambience delay.
   PC keyboard rows: Z–M lower octave, Q–U upper (+ 2 3 / 5 6 7
   sharps, I = high C). Arrows shift the octave window. Ctrl+M or
   Esc closes. Melodies ship as adapted motifs with QWERTY sheets.
   No network, no secrets — pure WebAudio. Test surface:
   window.__resonance (pure functions + SONGS + KEYMAP).
   ============================================================ */
(function(){
'use strict';
/* ============ pure layer (unit-testable without DOM/Audio) ============ */
var NOTE_IDX={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
var NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
function parseNote(s){ /* 'C#4' | 'Bb3' | 'A4' -> midi (C4=60) */
  var m=/^([A-G])(#|b)?(-?\d+)$/.exec(s);
  if(!m)return -1;
  var pc=NOTE_IDX[m[1]+(m[2]||'')]; if(pc===undefined)return -1;
  return (+m[3]+1)*12+pc;
}
function midiName(m){ return NAMES[((m%12)+12)%12]+(Math.floor(m/12)-1); }
function midiFreq(m){ return 440*Math.pow(2,(m-69)/12); }
function durBeats(sfx){ return sfx==='e'?0.5:sfx==='h'?2:sfx==='w'?4:1; }
function expandSong(src,bpm){ /* DSL: 'A4e Bb3h Rq' -> [{midi|0,beats,ms}] */
  var out=[],toks=String(src).split(/[\s|,]+/);
  for(var i=0;i<toks.length;i++){
    var t=toks[i]; if(!t)continue;
    var m=/^([A-G][#b]?\d|R)([eqhw])?$/.exec(t);
    if(!m)continue;
    var b=durBeats(m[2]||'q');
    out.push({midi:m[1]==='R'?0:parseNote(m[1]),beats:b,ms:Math.round(b*60000/bpm)});
  }
  return out;
}
/* PC-key map: key -> semitone offset from window start (C4 default = 60) */
var KEYMAP={z:0,s:1,x:2,d:3,c:4,v:5,g:6,b:7,h:8,n:9,j:10,m:11,q:12,'2':13,w:14,'3':15,e:16,r:17,'5':18,t:19,'6':20,y:21,'7':22,u:23,i:24,'9':25,o:26,'0':27,p:28};
var KEY2=(function(){var o={};for(var k in KEYMAP)o[KEYMAP[k]]=k;return o;})();
var ZROW=['z','x','c','v','b','n','m'],QROW=['q','w','e','r','t','y','u'];
var ZITHER_MIDIS=(function(){ /* C major pentatonic, C4..A6 — a real zither keeps its tuning */
  var pcs=[0,2,4,7,9],out=[];
  for(var oct=4;oct<=6;oct++)for(var k=0;k<5;k++)out.push(12*(oct+1)+pcs[k]);
  return out.slice(0,15);
})();
function clampWin(w){ return Math.max(36,Math.min(72,w)); } /* C2 .. C6 window starts */
/* QWERTY sheet: token -> the physical key for its note in the given window.
   lowercase = eighth (quick), UPPER = quarter, UPPER+'–' = half (hold),
   UPPER+'=' = whole (long hold), '·' = rest, ‹NOTE› = outside window. */
function keyToken(midi,sfx,win){
  var off=midi-win;
  var base=(off>=0&&off<=28)?KEY2[off]:null;
  if(!base)return '\u2039'+midiName(midi)+'\u203A';
  var ch=sfx==='e'?base:base.toUpperCase();
  return ch+(sfx==='h'?'\u2013':sfx==='w'?'=':'');
}
function qwertySheet(src,win){
  var out=[],toks=String(src).split(/[\s|,]+/);
  for(var i=0;i<toks.length;i++){
    var t=toks[i]; if(!t)continue;
    var m=/^([A-G][#b]?\d|R)([eqhw])?$/.exec(t); if(!m)continue;
    out.push(m[1]==='R'?'\u00B7':keyToken(parseNote(m[1]),m[2]||'q',win));
  }
  return out.join(' ');
}
/* SARGAM (Sa Re Ga Ma Pa Dha Ni) — derived note-for-note from the exact midi the
   chamber plays. lowercase = komal (flat), M# = tivra Ma, ' = taar (upper)
   octave, , = mandra (lower) octave. Sa is set per song to its tonal centre. */
var SARGAM=['Sa','re','Re','ga','Ga','Ma','M#','Pa','dha','Dha','ni','Ni'];
function sargamFor(midi,sa){
  var rel=midi-sa, pc=((rel%12)+12)%12, oct=Math.floor(rel/12);
  var tok=SARGAM[pc];
  return oct<0?(','+tok):oct>0?(tok+"'"):tok;
}
function sargamSheet(src,sa){
  var out=[],toks=String(src).split(/[\s|,]+/);
  for(var i=0;i<toks.length;i++){
    var t=toks[i]; if(!t)continue;
    var m=/^([A-G][#b]?\d|R)([eqhw])?$/.exec(t); if(!m)continue;
    if(m[1]==='R'){out.push('\u00B7');continue;}
    var sfx=m[2]||'q';
    out.push(sargamFor(parseNote(m[1]),sa)+(sfx==='h'?'\u2013':sfx==='w'?'=':''));
  }
  return out.join(' ');
}
var BREAK_MS=15*60*1000; /* strict 15-minute musical break */
function fmtClock(ms){var s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
var SONGS=[
 {tag:'ANIME',t:'GURENGE',by:'LiSA · Demon Slayer',bpm:150,suggest:'keys',sa:62,src:'D5e D5e D5e C5e D5q F5e E5e D5q C5e D5e E5e C5e A4q Rq D5e D5e D5e F5e G5q F5e E5e D5e E5q C5q D5h Rq'},
 {tag:'ANIME',t:'UNRAVEL',by:'TK · Tokyo Ghoul',bpm:124,suggest:'keys',sa:62,src:'F#5e E5e D5e E5e F#5q E5e D5e B4q C#5e D5e E5e D5e C#5q B4h F#5q E5e D5e E5e D5e C#5e D5q B4q C#5h Rq'},
 {tag:'ANIME',t:'SADNESS AND SORROW',by:'Toshio Masuda · Naruto',bpm:76,suggest:'strings',sa:64,src:'E4q G4q A4q B4q A4q G4q E4h D4q E4q G4q A4q B4q A4q G4h E4q G4q A4q B4q D5q B4q A4q G4q A4h Rq'},
 {tag:'ANIME',t:'GUREN NO YUMIYA',by:'Linked Horizon · Attack on Titan',bpm:160,suggest:'keys',sa:62,src:'D5q C5q D5q F5h E5q D5q C5q Bb4h A4q Bb4q C5q D5h Rq D5q D5q F5q G5q G5q F5q E5q D5q E5h Rq'},
 {tag:'ANIME',t:'ZEN ZEN ZENSE',by:'RADWIMPS · Your Name',bpm:150,suggest:'keys',sa:69,src:'B4e C#5e D5e C#5e B4q A4q E5e D5e C#5e D5e E5h B4e C#5e D5e C#5e B4e A4e G#4q A4q B4q C#5h Rq'},
 {tag:'ANIME',t:'DARK ARIA',by:'Hiroyuki Sawano · Solo Leveling (LV2)',bpm:138,suggest:'keys',sa:62,src:'D4q A4q C5q D5q F5q E5q D5q C5q D5h Rq A4q C5q D5q E5q F5q E5q D5h Rq'},
 {tag:'ICON',t:'SPIDER-MAN: HOMECOMING SUITE',by:'Michael Giacchino · adapted theme',bpm:132,suggest:'keys',sa:60,src:'C4q G4q C5q E5q G5q E5q C5h Rq E5q D5q C5q D5q E5q C5q G4h Rq'},
 {tag:'ICON',t:'CAROL OF THE BELLS',by:'Lindsey Stirling fire · adapted',bpm:150,suggest:'keys',sa:60,src:'A4e G4e A4e E4e A4e G4e A4e E4e A4e B4e C5e B4e A4h Rq E5e D5e E5e C5e D5e C5e D5e B4e C5q A4h Rq'},
 {tag:'ICON',t:'LOKI — GREEN THEME',by:'Natalie Holt · Loki (adapted)',bpm:112,suggest:'strings',sa:64,src:'E4h G4h B4q A4q G4h E4h B4q C5q B4w Rq'},
 {tag:'INDIA',t:'VELLAKE',by:'Bharatt-Saurabh · adapted motif',bpm:86,suggest:'strings',sa:64,src:'E4q G4q A4q B4q C5q B4q A4q G4q A4h Rq G4q A4q B4q C5q B4q A4q G4q E4h Rq'},
 {tag:'INDIA',t:'JANA GANA MANA',by:'Rabindranath Tagore · national anthem (opening)',bpm:92,suggest:'keys',sa:62,src:'D4q E4q F#4q G4q F#4q E4q F#4q G4e A4e A4q B4q A4q G4q F#4q E4q F#4q E4q D4h Rq'},
 {tag:'INDIA',t:'VANDE MATARAM',by:'Bankim Chandra · adapted motif',bpm:96,suggest:'strings',sa:62,src:'D4q F#4q A4h B4q A4q G4q F#4q E4q F#4q G4q E4q D4h Rq A4q B4q C5q B4q A4h Rq'},
 {tag:'INDIA',t:'TUM HI HO',by:'Arijit Singh · Aashiqui 2 (hook)',bpm:72,suggest:'keys',sa:64,src:'A4q G4q E4q G4h A4q C5q B4q A4h G4q A4q G4q E4h E4h Rq A4q B4q C5q B4q A4h Rq'},
 {tag:'INDIA',t:'KAL HO NAA HO',by:'Shankar–Ehsaan–Loy · flute hook',bpm:104,suggest:'strings',sa:64,src:'B4q D5q E5h D5q B4q A4q G4q A4q B4q A4q G4q E4h Rq G4q A4q B4q D5q E5h Rq'},
 {tag:'ICON',t:'MY HEART WILL GO ON',by:'James Horner · Titanic (tin-whistle hook)',bpm:100,suggest:'strings',sa:64,src:'E4q F#4q G#4q A4q B4q A4q G#4h Rq B4q C#5q B4q A4q G#4h Rq'},
 {tag:'ICON',t:'INTERSTELLAR',by:'Hans Zimmer · organ motif (adapted)',bpm:96,suggest:'keys',sa:60,src:'A4q A4q A4h G4q G4q G4h A4q C5q B4q A4h Rq'},
 {tag:'ICON',t:'HALLELUJAH',by:'Leonard Cohen · adapted motif',bpm:84,suggest:'strings',sa:60,src:'E4q G4q G4q A4q A4q A4q G4h E4e G4e A4q A4q G4q E4h Rq'},
 {tag:'ICON',t:'VIVA LA VIDA',by:'Coldplay · string-anthem hook (adapted)',bpm:138,sa:60,suggest:'keys',src:'E5q D5q C5q B4q C5q D5q E5q C5h Rq A4q B4q C5q D5q E5q D5q C5h Rq'},
 {tag:'ICON',t:'SHAPE OF YOU',by:'Ed Sheeran · marimba bounce (adapted)',bpm:96,sa:69,suggest:'keys',src:'A4q C5q A4q G4q A4q E5q D5q C5q A4h Rq A4q C5q E5q D5q C5q A4q G4h Rq'},
 {tag:'ICON',t:'SEE YOU AGAIN',by:'Wiz Khalifa ft. Charlie Puth (adapted)',bpm:80,sa:60,suggest:'strings',src:'E4q G4q A4q C5q B4q A4q G4q E4h Rq G4q A4q B4q C5q D5q C5q B4q A4h Rq'},
 {tag:'ICON',t:'LET IT BE',by:'The Beatles (adapted)',bpm:72,sa:60,suggest:'strings',src:'G4q A4q G4q E4q G4q G4q A4q C5h Rq C5q B4q A4q G4q A4q G4q E4h Rq'},
 {tag:'SOOTHE',t:'RIVER FLOWS IN YOU',by:'Yiruma · adapted figure',bpm:70,suggest:'strings',sa:69,src:'A4e B4e C#5e B4e A4e G#4e A4q E5e D5e C#5e D5e C#5e B4e A4h A4e B4e C#5e B4e A4e E5e C#5h Rq'},
 {tag:'SOOTHE',t:'CANON IN D',by:'Pachelbel',bpm:84,suggest:'strings',sa:62,src:'F#5q E5q D5q C#5q B4q A4q B4q C#5q D5q C#5q B4q A4q G4q F#4q G4q E4h Rq'},
 {tag:'SOOTHE',t:'FUR ELISE',by:'Beethoven',bpm:120,suggest:'keys',sa:60,src:'E5e D#5e E5e D#5e E5e B4e D5e C5e A4h Rq C4e E4e A4e B4h Rq E4e G#4e B4e C5h Rq'},
 {tag:'SOOTHE',t:'MOON RIVER',by:'Henry Mancini · adapted motif',bpm:80,suggest:'strings',sa:60,src:'G4q B4q C5q B4q A4q G4q E4h D4q E4q G4h Rq'},
 {tag:'SOOTHE',t:'GREENSLEEVES',by:'traditional · English folk',bpm:96,suggest:'strings',sa:60,src:'A4q C5q D5e E5e F5e E5e D5q B4q G4e A4e B4q C5q A4h Rq'},
 {tag:'SOOTHE',t:'ODE TO JOY',by:'Beethoven',bpm:108,suggest:'keys',sa:60,src:'E4q E4q F4q G4q G4q F4q E4q D4q C4q C4q D4q E4q E4q D4q D4h Rq'},
 {tag:'WORLD',t:'HAPPY BIRTHDAY',by:'traditional',bpm:120,suggest:'keys',sa:60,src:'G4e G4e A4q G4q C5q B4h Rq G4e G4e A4q G4q D5q C5h Rq G4q G4q G5q E5q C5q B4q A4h'},
 {tag:'WORLD',t:'TWINKLE TWINKLE',by:'traditional',bpm:104,suggest:'strings',sa:60,src:'C4q C4q G4q G4q A4q A4q G4h F4q F4q E4q E4q D4q D4q C4h Rq'}
];
/* ============ export pure surface ============ */
var R={parseNote:parseNote,midiName:midiName,midiFreq:midiFreq,expandSong:expandSong,KEYMAP:KEYMAP,ZITHER_MIDIS:ZITHER_MIDIS,SONGS:SONGS,clampWin:clampWin,ZROW:ZROW,QROW:QROW,qwertySheet:qwertySheet,keyToken:keyToken,sargamFor:sargamFor,sargamSheet:sargamSheet,SARGAM_NAMES:SARGAM,BREAK_MS:BREAK_MS,fmtClock:fmtClock,launcherInjected:false,
 _expireBreak:function(){breakDeadline=0;}};
if(typeof window!=='undefined')window.__resonance=R;
if(typeof document==='undefined'||!document.addEventListener)return; /* vm/unit context */

/* ============ state ============ */
var LS='csir_resonance_v1',LS_LAST='csir_resonance_v1_last';
var state={inst:'keys',win:60}; /* window start midi (C4) */
try{var s0=JSON.parse(localStorage.getItem(LS)||'{}');if(s0.inst==='keys'||s0.inst==='strings')state.inst=s0.inst;if(s0.win)state.win=clampWin(+s0.win);}catch(e){}
var veil=null,built=false,open=false,playing=null,playTimer=null,playSeq=null,playIdx=0;
var rec=[],recStart=0;
var ac=null,acOk=false,master=null,ksCache={};
var breakDeadline=0,breakTicker=null;
function persist(){try{localStorage.setItem(LS,JSON.stringify(state));}catch(e){}}

/* ============ audio engine ============ */
function ctxNow(){
  if(ac){if(ac.state==='suspended'&&ac.resume)ac.resume();return ac;}
  try{
    var C=window.AudioContext||window.webkitAudioContext; if(!C)throw 0;
    ac=new C();
    master=ac.createGain(); master.gain.value=.85;
    var dry=ac.createGain(); dry.gain.value=.9;
    var delay=ac.createDelay(1); delay.delayTime.value=.26;
    var fb=ac.createGain(); fb.gain.value=.28;
    var lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1700;
    var wet=ac.createGain(); wet.gain.value=.22;
    master.connect(dry); dry.connect(ac.destination);
    master.connect(delay); delay.connect(fb); fb.connect(lp); lp.connect(delay);
    delay.connect(wet); wet.connect(ac.destination);
    acOk=true;
  }catch(e){ac=null;acOk=false;}
  return ac;
}
function envGain(t,a,peak,dec){
  var g=ac.createGain();
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(peak,t+a);
  g.gain.exponentialRampToValueAtTime(.0001,t+dec);
  return g;
}
function playPiano(midi,vel,when){
  if(!ctxNow())return;
  var t=when||ac.currentTime,f=midiFreq(midi),v=vel||.9;
  var lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2500; lp.Q.value=.4;
  var g=envGain(t,.004,v*.5,2.4);
  var o1=ac.createOscillator(); o1.type='triangle'; o1.frequency.value=f;
  var o2=ac.createOscillator(); o2.type='sine'; o2.frequency.value=f*2.005;
  var g2=ac.createGain(); g2.gain.value=.16;
  o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(lp); lp.connect(master);
  o1.start(t); o2.start(t); o1.stop(t+2.5); o2.stop(t+2.5);
}
function ksBuffer(midi){ /* Karplus-Strong plucked string, two detuned lines blended */
  if(ksCache[midi])return ksCache[midi];
  var sr=ac.sampleRate,f=midiFreq(midi),len=Math.floor(sr*2.6);
  var buf=ac.createBuffer(1,len,sr),d=buf.getChannelData(0);
  function line(det){
    var N=Math.max(2,Math.round(sr/(f*det))),ring=new Float32Array(len),i;
    for(i=0;i<N;i++)ring[i]=Math.random()*2-1;
    for(i=N;i<len;i++)ring[i]=(ring[i-N]+ring[Math.min(i-N+1,len-1)])*.5*.9986;
    return ring;
  }
  var a=line(1),b=line(1.0007);
  for(var i=0;i<len;i++)d[i]=a[i]*.62+b[i]*.38;
  /* gentle overall fade to kill any tail click */
  var fade=Math.floor(sr*.18);
  for(var k=0;k<fade;k++){var w=(len-1-k);d[w]*=(1-k/fade);}
  ksCache[midi]=buf;return buf;
}
function playZither(midi,vel,when){
  if(!ctxNow())return;
  var t=when||ac.currentTime;
  var src=ac.createBufferSource(); src.buffer=ksBuffer(midi);
  var g=ac.createGain(); g.gain.value=(vel||.9)*.85;
  var lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=5400;
  src.connect(g); g.connect(lp); lp.connect(master); src.start(t);
}
function playVoice(midi,vel){
  if(state.inst==='strings')playZither(ZITHER_MIDIS.indexOf(midi)>=0?midi:nearestZither(midi),vel);
  else playPiano(midi,vel);
}
function nearestZither(midi){
  var best=ZITHER_MIDIS[0],bd=99;
  for(var i=0;i<ZITHER_MIDIS.length;i++){var d=Math.abs(ZITHER_MIDIS[i]-midi);if(d<bd){bd=d;best=ZITHER_MIDIS[i];}}
  return best;
}

/* ============ DOM build ============ */
function h(html){var d=document.createElement('div');d.innerHTML=html;return d.firstChild;}
function build(){
  if(built)return; built=true;
  veil=h('<div class="rc-veil" id="resonanceChamber" aria-hidden="true"></div>');
  veil.appendChild(h(
'<div class="rc-shell" role="dialog" aria-label="Resonance Chamber">'
+'<div class="rc-head"><div class="rc-brand"><span class="rc-eyebrow">BREAK WING · CTRL+M</span><span class="rc-title">RESONANCE CHAMBER</span></div>'
+'<div class="rc-tabs"><button class="rc-tab on" id="rcTabKeys" type="button">⌨ KEYS</button><button class="rc-tab" id="rcTabStrings" type="button">🎻 STRINGS</button></div>'
+'<div class="rc-head-right"><span class="rc-brk" id="rcBreak" title="strict 15-minute break — the chamber closes itself at 0:00">15:00</span><button class="rc-btn" id="rcOctDown" type="button">◀ OCT</button><button class="rc-btn" id="rcOctUp" type="button">OCT ▶</button>'
+'<button class="rc-btn gold" id="rcReplay" type="button">↻ REPLAY LAST</button><button class="rc-btn warn" id="rcClose" type="button">✕</button></div></div>'
+'<div class="rc-stage" id="rcStage"></div>'
+'<div class="rc-strip"><div class="rc-status" id="rcStatus"></div></div>'
+'<div class="rc-progress" id="rcProg"><i></i></div>'
+'<div class="rc-songrow"><select class="rc-select" id="rcSong"></select>'
+'<button class="rc-btn" id="rcPlay" type="button">▶ PLAY</button><button class="rc-btn warn" id="rcStop" type="button">■ STOP</button></div>'
+'<div class="rc-sheet" id="rcSheet"></div>'
+'<div class="rc-trail" id="rcTrail"></div>'
+'<div class="rc-help">KEYS — Z X C V B N M lower octave · Q W E R T Y U upper · 2 3 5 6 7 sharps · I high C · ←/→ shift octave<br>'
+'STRINGS — click or drag across the wires to strum · same letter rows pluck strings<br>'
+'sheet letters are PHYSICAL KEYS: lowercase = quick tap · CAPS = full · – = hold · = = long hold · · = rest<br>'
+'SARGAM — Sa Re Ga Ma Pa Dha Ni · lowercase = komal · M# = tivra · \u2032 = upper · , = lower octave<br>'
+'STRICT 15:00 break — the chamber closes itself at zero · Ctrl+M / Esc closes early</div>'
+'</div>'));
  document.body.appendChild(veil);
  var sel=veil.querySelector('#rcSong'),i;
  for(i=0;i<SONGS.length;i++){
    var o=document.createElement('option');
    o.value=i;o.textContent='['+SONGS[i].tag+'] '+SONGS[i].t+' — '+SONGS[i].by;
    sel.appendChild(o);
  }
  veil.querySelector('#rcClose').addEventListener('click',closeRC);
  veil.querySelector('#rcTabKeys').addEventListener('click',function(){setInst('keys');});
  veil.querySelector('#rcTabStrings').addEventListener('click',function(){setInst('strings');});
  veil.querySelector('#rcOctDown').addEventListener('click',function(){shiftWin(-12);});
  veil.querySelector('#rcOctUp').addEventListener('click',function(){shiftWin(12);});
  veil.querySelector('#rcPlay').addEventListener('click',function(){playSong(+sel.value);});
  veil.querySelector('#rcStop').addEventListener('click',stopSong);
  veil.querySelector('#rcReplay').addEventListener('click',replayLast);
  veil.addEventListener('pointerdown',function(e){if(e.target===veil)closeRC();});
  sel.addEventListener('change',renderSheet);
  breakTicker=setInterval(tickBreak,500);
  setStatus('chamber ready — 15:00 on the clock. pick an instrument and play.');
  renderSheet();
  renderStage();
}
function setStatus(t){var el=document.getElementById('rcStatus');if(el)el.textContent=t;}
function setInst(inst){
  state.inst=inst;persist();
  document.getElementById('rcTabKeys').classList.toggle('on',inst==='keys');
  document.getElementById('rcTabStrings').classList.toggle('on',inst==='strings');
  renderStage();
  setStatus(inst==='keys'?'grand keys — mellow triangle voice.':'zither strung — 15 wires, C-pentatonic C4→A6.');
}
function shiftWin(d){state.win=clampWin(state.win+d);persist();if(state.inst==='keys')renderStage();renderSheet();setStatus('octave window: '+midiName(state.win)+' → '+midiName(state.win+24));}

/* ---- stage renderers ---- */
function renderStage(){
  var st=document.getElementById('rcStage'); if(!st)return;
  st.innerHTML='';
  if(state.inst==='keys')renderPiano(st);else renderZither(st);
}
function badgeFor(midi){
  var off=midi-state.win;
  return (off>=0&&off<=28&&KEY2[off])?KEY2[off].toUpperCase():'';
}
function renderPiano(st){
  var wrap=h('<div class="rc-piano" id="rcPiano"></div>'); st.appendChild(wrap);
  var base=state.win,whiteCount=0,i,midi;
  var whitePos={};
  for(i=0;i<=24;i++){midi=base+i;
    if(NAMES[midi%12].indexOf('#')<0){
      var wk=h('<div class="rc-wkey" data-m="'+midi+'"></div>');
      var bd=badgeFor(midi);
      wk.innerHTML='<span class="rc-kname">'+midiName(midi)+'</span>'+(bd?'<span class="rc-kbadge">'+bd+'</span>':'');
      bindKey(wk,midi); wrap.appendChild(wk);
      whitePos[midi]=whiteCount; whiteCount++;
    }
  }
  var keyW=100/whiteCount;
  for(i=0;i<=24;i++){midi=base+i;
    if(NAMES[midi%12].indexOf('#')>=0){
      var leftWhite=whitePos[midi-1]+1; /* black sits after the white below it */
      var bk=h('<div class="rc-bkey" data-m="'+midi+'"></div>');
      bk.style.left='calc('+(leftWhite*keyW)+'% - 17px)';
      var bd2=badgeFor(midi);
      bk.innerHTML=(bd2?'<span class="rc-kbadge">'+bd2+'</span>':'');
      bindKey(bk,midi); wrap.appendChild(bk);
    }
  }
}
function bindKey(el,midi){
  el.addEventListener('pointerdown',function(e){e.preventDefault();strike(midi);});
}
function renderZither(st){
  var board=h('<div class="rc-board" id="rcBoard"></div>'); st.appendChild(board);
  board.appendChild(h('<div class="rc-rail">ZITHER</div>'));
  var strings=h('<div class="rc-strings" id="rcStrings"></div>'); board.appendChild(strings);
  board.appendChild(h('<div class="rc-rail">C4 → A6</div>'));
  for(var i=0;i<ZITHER_MIDIS.length;i++){
    (function(midi,idx){
      var row=h('<div class="rc-string" data-m="'+midi+'"><i class="rc-peg"></i><span class="rc-wire"></span><span class="rc-sname">'+midiName(midi)+'</span></div>');
      row.addEventListener('pointerdown',function(e){e.preventDefault();strike(midi);});
      row.addEventListener('pointerenter',function(e){if(e.buttons&1)strike(midi);}); /* strum by drag */
      strings.appendChild(row);
    })(ZITHER_MIDIS[i],i);
  }
  /* touch strum */
  strings.addEventListener('touchstart',touchStrum,{passive:false});
  strings.addEventListener('touchmove',touchStrum,{passive:false});
}
function touchStrum(e){
  e.preventDefault();
  var t=e.touches[0]; if(!t)return;
  var el=document.elementFromPoint(t.clientX,t.clientY);
  var s=el&&el.closest?el.closest('.rc-string'):null;
  if(s)strike(+s.getAttribute('data-m'));
}

/* ---- strike: sound + visual + trail + recorder ---- */
function strike(midi){
  if(open)playVoice(midi);
  flash(midi);
  trail(midiName(midi));
  rec.push({m:midi,t:Math.max(0,Math.round(performance.now()-recStart))});if(rec.length>128)rec.shift();
}
function flash(midi){
  var el=veil&&veil.querySelector('[data-m="'+midi+'"]');
  if(!el&&state.inst==='strings')el=veil.querySelector('[data-m="'+nearestZither(midi)+'"]');
  if(!el)return;
  el.classList.remove('live'); void el.offsetWidth; el.classList.add('live');
  setTimeout(function(){el.classList.remove('live');},560);
}
function trail(name){
  var tr=document.getElementById('rcTrail'); if(!tr)return;
  var chip=h('<span class="rc-notechip">'+name+'</span>');
  tr.appendChild(chip);
  while(tr.children.length>24)tr.removeChild(tr.firstChild);
}

/* ---- song sheets (QWERTY) + player ---- */
function renderSheet(){
  var sel=document.getElementById('rcSong'); if(!sel)return;
  var s=SONGS[+sel.value||0];
  var el=document.getElementById('rcSheet');
  el.innerHTML='<b>'+s.t+'</b> — '+s.by+' · '+s.bpm+' bpm'+(s.suggest==='strings'?' · <b>best on STRINGS</b>':'')
    +' · Sa='+midiName(s.sa||60)+' · window '+midiName(state.win)+'–'+midiName(state.win+24)+'\n<b>KEYS:</b> '+qwertySheet(s.src,state.win)+'\n<b>SARGAM:</b> '+sargamSheet(s.src,s.sa||60);
}
function stopSong(){
  if(playTimer){clearTimeout(playTimer);playTimer=null;}
  playing=null;
  var pr=document.getElementById('rcProg'); if(pr){pr.classList.remove('on');pr.firstChild.style.width='0%';}
}
function playSong(idx){
  var s=SONGS[idx]; if(!s)return;
  stopSong();
  playSeq=expandSong(s.src,s.bpm); playIdx=0; playing=s;
  var pr=document.getElementById('rcProg'); if(pr)pr.classList.add('on');
  setStatus('▶ '+s.t+' — '+playSeq.length+' notes at '+s.bpm+' bpm ('+state.inst+')');
  step();
}
function step(){
  if(!playing)return;
  if(playIdx>=playSeq.length){
    var done=playing.t||'';
    stopSong(); setStatus(done+' — done. the chamber is yours.');
    return;
  }
  var ev=playSeq[playIdx++];
  if(ev.midi&&open)playVoice(ev.midi);
  if(ev.midi){flash(ev.midi);trail(midiName(ev.midi));}
  var pr=document.getElementById('rcProg'); if(pr)pr.firstChild.style.width=Math.round(100*playIdx/playSeq.length)+'%';
  playTimer=setTimeout(step,ev.ms);
}
function replayLast(){
  var seq=rec.length?rec.slice():null;
  if(!seq){
    try{seq=JSON.parse(localStorage.getItem(LS_LAST)||'[]');}catch(e){seq=[];}
  }
  if(!seq||!seq.length){setStatus('nothing recorded yet — play something first.');return;}
  stopSong();
  playing={t:'YOUR LAST SESSION'}; playIdx=0;
  var i=0;
  setStatus('↻ replaying your last session ('+seq.length+' notes)');
  (function tick(){
    if(i>=seq.length){playing=null;return;}
    var ev=seq[i++];
    if(open)playVoice(ev.m);
    flash(ev.m); trail(midiName(ev.m));
    var next=i<seq.length?Math.max(24,Math.min(1500,seq[i].t-ev.t)):240;
    playTimer=setTimeout(tick,next);
  })();
}

/* ---- strict 15-minute break clock ---- */
function tickBreak(){
  if(!open||!veil)return;
  var el=document.getElementById('rcBreak'); if(!el)return;
  var rem=breakDeadline-Date.now();
  if(rem<=0){
    closeRC();
    if(typeof window.showToast==='function'){try{window.showToast('⏳ MUSICAL BREAK OVER — 15:00 served. back to the mission.');}catch(e){}}
    return;
  }
  el.textContent=fmtClock(rem);
  el.classList.toggle('warn',rem<60000);
}

/* ---- open/close + global keys ---- */
function openRC(){
  build();
  stopSong(); rec=[]; recStart=performance.now();
  breakDeadline=Date.now()+BREAK_MS;
  var brk=document.getElementById('rcBreak'); if(brk){brk.textContent='15:00';brk.classList.remove('warn');}
  try{var last=JSON.parse(localStorage.getItem(LS_LAST)||'[]');if(last.length)setStatus('welcome back — ↻ REPLAY LAST restores your last session ('+last.length+' notes).');}catch(e){}
  veil.classList.add('open'); veil.setAttribute('aria-hidden','false');
  open=true; ctxNow();
}
function closeRC(){
  if(!veil)return;
  stopSong();
  try{localStorage.setItem(LS_LAST,JSON.stringify(rec.slice(-128)));}catch(e){}
  veil.classList.remove('open'); veil.setAttribute('aria-hidden','true');
  open=false;
}
/* ---- MUSICAL BREAK launcher, parked beside the break-game button ---- */
function injectLauncher(){
  if(document.getElementById('musicBreakBtn'))return;
  var gw=document.getElementById('gameWrap');
  if(!gw||!gw.parentNode)return;
  var wrap=document.createElement('div');
  wrap.id='musicBreakWrap';
  wrap.style.cssText='position:relative; display:inline-block; margin-left:8px;';
  wrap.innerHTML='<button class="voice-picker" id="musicBreakBtn" title="Musical break — 15 minutes max, the chamber closes itself · Ctrl+M" style="padding:6px 10px; font-size:0.65rem;" type="button">♪ MUSICAL BREAK</button>';
  gw.parentNode.insertBefore(wrap,gw.nextSibling);
  wrap.firstChild.addEventListener('click',function(){openRC();});
  R.launcherInjected=true;
}
try{injectLauncher();}catch(e){}
document.addEventListener('keydown',function(e){
  var k=(e.key||'').toLowerCase();
  if((e.ctrlKey||e.metaKey)&&k==='m'){
    e.preventDefault();
    if(open)closeRC();else openRC();
    return;
  }
  if(!open)return;
  if(k==='escape'){e.preventDefault();closeRC();return;}
  if(k==='arrowleft'){e.preventDefault();shiftWin(-12);return;}
  if(k==='arrowright'){e.preventDefault();shiftWin(12);return;}
  if(e.repeat)return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(k in KEYMAP){
    e.preventDefault();
    var off=KEYMAP[k];
    if(state.inst==='strings'){
      var row=ZROW.indexOf(k),row2=QROW.indexOf(k),idx;
      if(row>=0)idx=row;else if(row2>=0)idx=7+row2;else if(k==='i')idx=14;else idx=Math.round(off/24*14);
      strike(ZITHER_MIDIS[Math.max(0,Math.min(14,idx))]);
    }else{
      strike(state.win+off);
    }
  }
},true);
})();
