/* ============================================================
   GAMEFORGE II (round 11) — two more AI-native break experiences
   PART A · GRAY FOG ARCHIVES (Above the Gray Fog / LOTM mode):
       unlimited case files. A procedural clue-path generator
       works offline forever; when your AI provider is configured
       the Archives prefetch AI-written case files (strict JSON
       validation, ✦ AI-GENERATED badge, honest local fallback
       after the first failure). Difficulty is real here: case
       target + clue subtlety both scale with level.
   PART B · WHITE ROOM COMMENTATOR (break chess):
       quiet local quips on every move, upgraded to ✦ AI
       commentary on notable moves (captures, checks, promotions,
       mate) when AI is configured — throttled, async, and never
       blocking the game. AI lines are always labelled.
   Official data is never touched; everything lives in GameForge.
   ============================================================ */
(function(){
  const LEVELS=["noobie","adept","elite","godhood"];
  function lix(level){const i=LEVELS.indexOf(level);return i<0?1:i;}
  function gfToast(msg){try{if(typeof showToast==="function")showToast(msg);}catch(e){}}
  function ri(rnd,a,b){return a+Math.floor(rnd()*(b-a+1));}
  function pick(rnd,arr){return arr[Math.floor(rnd()*arr.length)];}
  function shuffled(rnd,arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function track(label){try{if(window.AiUsage&&typeof window.AiUsage.track==="function")window.AiUsage.track("break games",label);}catch(e){}}
  function aiConfigured(){
    try{const s=JSON.parse(localStorage.getItem("csirnet_ai_settings_v1")||"{}");return !!(s&&s.model&&(s.key||s.format==="custom"));}catch(e){return false;}
  }

  /* ================= PART A · GRAY FOG ARCHIVES ================= */
  /* 12 playable sequence-9 pathways, each with object/witness/symbol clue
     fragments plus oblique variants unlocked at higher difficulty. */
  const PATHS={
    SEER:{
      objects:["A tarot deck, missing its Fool card, was found above the fog.","A warm crystal ball lay beside the untouched teacup.","A star chart annotated in gray ink marks tonight twice."],
      witness:["The witness divined the danger minutes before it arrived.","The suspect prayed to an indistinct gray fog, then smiled.","He spoke of clown paint, miracles, and stacked wishes."],
      symbols:["The pathway symbol is an eye beneath layered fog.","The carved sigil is a pupil inside a spiraling circle.","The emblem shows a gaze fixed on tomorrow."],
      oblique:["Nothing here was seen — everything was foreseen.","The diary records tomorrow's weather, correctly.","He always knocked before fate could answer."]},
    APPRENTICE:{
      objects:["A brass key studded with sapphires opens no visible lock.","A map of doors that were never built was left folded.","A silver door handle, still warm, sits atop the hymnbook."],
      witness:["The figure walked through a wall without opening it.","Every lock stayed shut, yet the room was emptied.","The witness counted doorways like prayer beads."],
      symbols:["The pathway symbol is a door ajar over a spiral path.","The sigil is a ring of keys with no teeth.","The emblem shows a threshold crossed three times."],
      oblique:["Distance politely stepped aside for the visitor.","The locked room was, briefly, a matter of opinion.","Walls here are more suggestion than barrier."]},
    MARAUDER:{
      objects:["A single crystal monocle was left on the ledger.","A pocket watch ticks exactly backwards.","A stolen signature is still drying in the guest book."],
      witness:["The thief apologized while a shadow went missing.","Crows gathered at noon, then left nothing behind.","Nobody saw anything taken — yet everything is gone."],
      symbols:["The pathway symbol is a crow wearing a monocle.","The sigil is an empty hook where a fate once hung.","The emblem shows five mismatched fingers on one glove."],
      oblique:["Time here runs on stolen seconds.","Even the echo arrived without permission.","What was yours is now an anecdote."]},
    SPECTATOR:{
      objects:["A notebook filled with the dreams of strangers was found.","An opera ticket was torn precisely in half.","A glass-dark dragon scale rests in a velvet box."],
      witness:["The suspect never acted — only watched, and knew.","He answered questions nobody had asked aloud.","The crowd was studied like a chessboard."],
      symbols:["The pathway symbol is a calm eye inside a portrait.","The sigil is an auditorium seat never sat in.","The emblem shows a mind unlatched like a window."],
      oblique:["Every thought in the room arrived pre-read.","The verdict came before the confession.","He watched the watcher watching."]},
    READER:{
      objects:["A book that rereads itself every night was seized.","An ivory library card, marked RESTRICTED.","An index of forbidden chapters, perfectly alphabetized."],
      witness:["He quoted the exact page where the accident was recorded.","Every sentence spoken nearby was finished for you.","The crime scene was catalogued alphabetically."],
      symbols:["The pathway symbol is a white tower between two pages.","The sigil is an open eye over an open book.","The emblem shows ink arranged into a staircase."],
      oblique:["The answer was footnoted centuries ago.","Knowledge here outlives its owners.","The library remembers what the town forgets."]},
    SAILOR:{
      objects:["A storm-bent nail, still crusted with salt.","A harbor bell that rings only underwater.","A sealed bottle containing what appears to be lightning."],
      witness:["The captain shouted, and the tide obeyed.","He smelled the storm three days before it formed.","The mast was wrestled — and the mast lost."],
      symbols:["The pathway symbol is a wave curled into a fist.","The sigil is a trident over rough scales.","The emblem shows thunder chained to an anchor."],
      oblique:["The sea here signs its name in foam.","Even the wind files a report.","Calm water is just interrupted rage."]},
    BARD:{
      objects:["A hymn sheet burned only along its edges.","A warm coin stamped with a sunburst.","A chorus robe dusted with gold pollen."],
      witness:["The choir sang until the shadows left the room.","He praised the sun at midnight — sincerely.","Every verse harmonized with the cathedral bells."],
      symbols:["The pathway symbol is a choir of small suns.","The sigil is a golden halo above an empty chair.","The emblem shows light arriving in verses."],
      oblique:["The darkness left a glowing review of the hymn.","Dawn here is a duet.","His shadow keeps perfect rhythm."]},
    SLEEPLESS:{
      objects:["A lantern that burns only after sunset.","An unissued badge of the night watch.","A black cloth soaked in impossible moonlight."],
      witness:["He patrolled the hours everyone slept through.","The burglary was dreamt three nights before it happened.","She never once blinked after sunset."],
      symbols:["The pathway symbol is a closed eye under a dark star.","The sigil is night sewn into a uniform collar.","The emblem shows a moon eclipsed by a hand."],
      oblique:["Insomnia here is a promotion.","The night shift never ends, and neither does he.","Dreams file past her like suspects."]},
    ASSASSIN:{
      objects:["A stiletto cooled in ice water.","A vial of perfume that conceals venom.","A black veil pinned with a silver rose."],
      witness:["She approached with grace and left no footprints.","The guard smiled — and forgot his own name.","One precise strike, exactly where it mattered."],
      symbols:["The pathway symbol is a blade mirrored as a profile.","The sigil is frost blooming along a dagger.","The emblem shows a kiss-shaped burn."],
      oblique:["Mercy was considered, then invoiced.","The quietest person in the room won.","Elegance here is simply efficient violence."]},
    HUNTER:{
      objects:["A map pricked with red pins accumulates daily.","A hunting horn notched thirty times.","Ash arranged carefully into a footprint."],
      witness:["The suspect was tracked across three districts.","A snare was set where no path existed.","Every argument became an ambush."],
      symbols:["The pathway symbol is a flame held in a fist.","The sigil is antlers above a powdered trail.","The emblem shows a spear thrown at smoke."],
      oblique:["Prey here is a word, not a species.","The trail read like a confession.","Patience, loaded, with the safety off."]},
    LAWYER:{
      objects:["A contract whose clauses rearrange overnight.","A gavel wrapped in mourning cloth.","A statute book holding exactly one living page."],
      witness:["He argued the door into unlocking itself.","A loophole in the laws of locks was exploited.","The fog itself was billed for services rendered."],
      symbols:["The pathway symbol is a scale weighted with black wax.","The sigil is a rulebook chained shut.","The emblem shows a seal stamped over silence."],
      oblique:["The fine print did the stabbing.","Every rule here owes him a favor.","Chaos arrives properly formatted."]},
    ARBITER:{
      objects:["A pair of perfectly even brass scales.","A warrant written the day before the crime.","A golden cord knotted in judgement."],
      witness:["She measured the room and found it guilty.","The lock was sentenced before it was opened.","Balance was restored by removing a single lie."],
      symbols:["The pathway symbol is a level blade above still water.","The sigil is an unblinking eye of brass.","The emblem shows justice with its armour on."],
      oblique:["The verdict predates the offence.","Fairness here wears gauntlets.","The scales never lie; people do."]}
  };
  const PATH_KEYS=Object.keys(PATHS);
  const CASE_ADJ=["SEALED","WATCHING","BURNING","SILENT","CROOKED","HOLLOW","GREY","CRIMSON","LAUGHING","DROWNED","PATIENT","GILDED"];
  const CASE_NOUN=["DIARY","CHAPEL","CORRIDOR","MASK","LEDGER","MIRROR","CANDLE","THEATRE","CLOCK","LETTER","ARCHIVE","CABINET"];
  const BANNED_NAMES={"THE WATCHER":1,"THE SEALED ROOM":1,"THE ACTING METHOD":1,"THE FOOL ABOVE":1,"THE FINAL CLUE":1};
  const DOCTRINE={
    ACTING:["The mask must be worn without becoming the mask.","The role was rehearsed until the potion itself applauded.","Names here are costumes; the ledger keeps the real one.","He played the part so well the fog believed him.","Digestion follows performance — never before it."],
    DIVINATION:["The answer was asked, not derived.","Cards, mirrors, pendulums — all doors to the same room.","The future leaned toward the one who inquired correctly.","A coin was flipped; its landing was an instruction.","Nothing was observed — everything was foreseen."],
    RITUAL:["Four candles, one incantation, zero deviations.","The materials were measured to the grain.","Every gesture occurred in the ordained order.","The circle was closed before the name was spoken.","Precision is the only offering this rite accepts."],
    OBSERVATION:["Nothing was done until everything was seen.","The watcher counted three exits before entering.","Patience outperformed every incantation tonight.","The fog cleared only when the counting stopped.","Stillness was the first move, and the sharpest."]
  };
  const DOCTRINE_KEYS=Object.keys(DOCTRINE);
  let lastPaths=[],lastNames=[];

  function caseName(rnd){
    for(let k=0;k<14;k++){
      const n="THE "+pick(rnd,CASE_ADJ)+" "+pick(rnd,CASE_NOUN);
      if(!BANNED_NAMES[n]&&lastNames.indexOf(n)<0){lastNames.push(n);if(lastNames.length>6)lastNames.shift();return n;}
    }
    return "THE "+pick(rnd,CASE_ADJ)+" "+pick(rnd,CASE_NOUN)+[" I"," II"," III"," IV"][ri(rnd,0,3)];
  }
  function genPathwayCase(level,rnd){
    let key=pick(rnd,PATH_KEYS);
    for(let k=0;k<12&&lastPaths.indexOf(key)>=0;k++)key=pick(rnd,PATH_KEYS);
    lastPaths.push(key);if(lastPaths.length>5)lastPaths.shift();
    const p=PATHS[key];
    const others=shuffled(rnd,PATH_KEYS.filter(k=>k!==key)).slice(0,3);
    const options=shuffled(rnd,[key].concat(others));
    const slots=shuffled(rnd,[pick(rnd,p.objects),pick(rnd,p.witness),pick(rnd,p.symbols)]);
    const obliques=lix(level)>=3?2:lix(level)===2?1:0; /* elite: one oblique clue, godhood: two */
    const ob=shuffled(rnd,p.oblique);
    for(let i=0;i<obliques;i++)slots[i]=ob[i%ob.length];
    const clues=[];for(const c of slots){if(clues.indexOf(c)<0)clues.push(c);}
    let k=0;while(clues.length<3){const c=p.oblique[(k++)%p.oblique.length];if(clues.indexOf(c)<0)clues.push(c);}
    return {name:caseName(rnd),clues:clues.slice(0,3),options:options,answer:options.indexOf(key)};
  }
  function genSequenceCase(level,rnd){
    const t=ri(rnd,5,9),a=ri(rnd,2,4);
    const direct=["The stair descends exactly "+t+" steps below the fog — three witnesses counted it twice.","A die of bone was cast; it landed showing "+t+". No hand was seen to move it."];
    const mid=["One step above "+(t-1)+" — the scratch on the pew confirms the seal.","The bone dice summed to the seal: "+a+" and "+(t-a)+"."];
    const subtle=["Half the nave burned tonight: "+(2*t)+" candles in total.","Three knocks at midnight, then "+(t-3)+" more — the ritual counts all of them."];
    const pool=lix(level)>=3?mid.concat(subtle):lix(level)===2?mid.concat(subtle,direct.slice(1)):direct.concat(mid);
    const clues=[];for(const c of shuffled(rnd,pool)){if(clues.indexOf(c)<0)clues.push(c);if(clues.length===3)break;}
    const nums=shuffled(rnd,[4,5,6,7,8,9].filter(n=>n!==t)).slice(0,3);
    const labels=shuffled(rnd,[t].concat(nums)).map(n=>"SEQUENCE "+n);
    const tLabel="SEQUENCE "+t;
    return {name:"THE NUMBERED "+pick(rnd,["DOOR","PEW","CANDLE","STAIR","LEDGER","CHALICE"]),clues,options:labels,answer:labels.indexOf(tLabel)};
  }
  function genDoctrineCase(level,rnd){
    const key=pick(rnd,DOCTRINE_KEYS);
    const bank=shuffled(rnd,DOCTRINE[key]);
    const clues=bank.slice(0,3);
    const options=shuffled(rnd,DOCTRINE_KEYS);
    let name="THE "+pick(rnd,["QUIET","FINAL","PATIENT","MIDNIGHT","GOLDEN"])+" "+pick(rnd,["METHOD","REHEARSAL","LITANY","VIGIL","DOCTRINE"]);
    if(BANNED_NAMES[name])name=name+" II";
    return {name,clues,options,answer:options.indexOf(key)};
  }
  function genMysteryCase(level){
    const rnd=Math.random,r=rnd();
    if(r<0.62)return genPathwayCase(level,rnd);
    if(r<0.84)return genSequenceCase(level,rnd);
    return genDoctrineCase(level,rnd);
  }
  function mysteryTarget(level){return {noobie:4,adept:6,elite:8,godhood:10}[level]||6;}
  function mysteryQueue(level,base){
    const qs=(base||[]).slice(); /* the 5 handcrafted dossiers always open the session, in order */
    while(qs.length<9)qs.push(genMysteryCase(level));
    return qs;
  }
  function mysteryPoke(qs,index,level){
    while(qs.length-index<5&&qs.length<90)qs.push(genMysteryCase(level));
    const aiReady=qs.reduce((n,q)=>n+(q.ai?1:0),0);
    if(aiReady<3&&(index%2===0))prefetchMystery(qs,index,level);
  }
  function mysteryStatus(qs,level,target){
    const ai=qs.reduce((n,q)=>n+(q.ai?1:0),0);
    const bits=["Gray Fog Archives live · unlimited case files","target "+target+" deductions"];
    if(ai)bits.unshift("\u2726 "+ai+" AI-GENERATED file"+(ai>1?"s":"")+" in the fog");
    else if(aiConfigured()&&!mysteryAi.down)bits.unshift("\u2726 AI archivist warming up");
    bits.push(level.toUpperCase());
    return bits.join(" · ");
  }

  let mysteryAi={inFlight:false,down:false,announced:false,warned:false};
  function parseMysteryBatch(text){
    if(!text)return[];
    const i=text.indexOf("["),j=text.lastIndexOf("]");
    if(i<0||j<=i)return[];
    let arr;try{arr=JSON.parse(text.slice(i,j+1));}catch(e){return[];}
    if(!Array.isArray(arr))return[];
    return arr.map(o=>{
      if(!o||typeof o.name!=="string"||!Array.isArray(o.clues)||o.clues.length!==3||!Array.isArray(o.options)||o.options.length!==4)return null;
      const name=String(o.name).trim().toUpperCase();
      if(name.length<4||name.length>40)return null;
      const clues=o.clues.map(c=>String(c||"").trim());
      if(clues.some(c=>c.length<12||c.length>180))return null;
      if(new Set(clues.map(c=>c.toLowerCase())).size!==3)return null;
      const opts=o.options.map(x=>String(x||"").trim().toUpperCase());
      if(opts.some(x=>x.length<2||x.length>28))return null;
      if(new Set(opts.map(x=>x.toLowerCase())).size!==4)return null;
      const a=Number(o.a);
      if(!Number.isInteger(a)||a<0||a>3)return null;
      return {name:name.slice(0,40),clues:clues.map(c=>c.slice(0,180)),options:opts.map(x=>x.slice(0,28)),answer:a,ai:true};
    }).filter(Boolean);
  }
  function prefetchMystery(qs,index,level){
    if(mysteryAi.inFlight||mysteryAi.down)return null;
    if(!window.AiEngine||typeof window.AiEngine.call!=="function"||!aiConfigured())return null;
    mysteryAi.inFlight=true;
    const diff=["very easy, nearly self-evident","moderate, classic association","subtle, the clues need cross-reading","devilish, oblique and ironic"][lix(level)];
    const p=window.AiEngine.call({
      systemPrompt:"You write case files for a deduction mini-game themed on Lord of the Mysteries (gray fog, tarot, pathways, sanity). Every case must be solvable from its own three clues alone — no outside lore required. You return strict JSON only.",
      messages:[{role:"user",content:"Return ONLY a JSON array of exactly 4 objects, no markdown, no commentary. Each object: {\"name\": short ALL-CAPS case title (max 38 chars), \"clues\": array of EXACTLY 3 clue sentences (each max 140 chars, plain text), \"options\": array of EXACTLY 4 distinct short answer labels (ALL-CAPS, max 26 chars), \"a\": index 0-3 marking the correct option}. All three clues must jointly point at the correct option, and only that option. Difficulty: "+diff+". Atmosphere: gray fog, old manuscripts, sealed rooms, tarot."}],
      temperature:0.9,maxTokens:1700
    }).then(res=>{
      const good=parseMysteryBatch(res&&res.text);
      if(!good.length)throw new Error("AI returned no usable case files");
      good.forEach((c,k)=>{const pos=Math.min(index+1+k,qs.length);qs.splice(pos,0,c);});
      track("mystery-ai-batch");
      if(!mysteryAi.announced){mysteryAi.announced=true;gfToast("\u2726 AI archivist online — fresh case files now blend into the gray fog.");}
    }).catch(err=>{
      mysteryAi.down=true;
      if(!mysteryAi.warned){mysteryAi.warned=true;gfToast("AI archivist unavailable ("+String((err&&err.message)||err).slice(0,80)+") · the Archives keep generating locally.");}
    }).finally(()=>{mysteryAi.inFlight=false;});
    return p;
  }

  /* ================= PART B · WHITE ROOM COMMENTATOR ================= */
  const PIECEWORDS={P:"a pawn",N:"a knight",B:"a bishop",R:"a rook",Q:"the queen"};
  const LOCAL={
    open:["The room is quiet. The board remembers everything.","First principles first. Move with intent.","A blank file, a clean mind. Begin."],
    capW:["Material taken. The ledger approves.","Calm hands collect what is offered.","A piece leaves the board. No ceremony.","Greed, when precise, is a virtue."],
    capB:["The shadow collects its toll.","A piece is gone. Learn its price.","The engine bites. Note where — and why."],
    chkW:["Check announced. Interesting.","You found the king's shadow. Press, do not chase.","The monarch feels your gaze."],
    chkB:["Your king feels the draft. Calmly.","Check. Panic is the only losing move.","The shadow knocks on the royal door."],
    endW:["Checkmate. Precise — the room keeps the recording.","It ends quietly. Well played."],
    endB:["Checkmate, against you. Review the turning point.","The lesson is archived. Again?"],
    quiet:["Noted.","The evaluation barely flickers.","Small moves build big rooms.","Patience is also an attack.","The board is listening.","Accuracy over speed."],
    promo:["A pawn completes its long pilgrimage.","Promotion. Ambition, executed."],
    stale:["Stalemate — equilibrium. Neither side deserved more."]
  };
  function commentLocal(evt){
    const r=Math.random;
    if(evt.mate)return pick(r,evt.side==="w"||evt.side==="new"?LOCAL.endW:LOCAL.endB);
    if(evt.ended)return pick(r,LOCAL.stale);
    if(evt.promote)return pick(r,LOCAL.promo);
    if(evt.check)return pick(r,evt.side==="w"?LOCAL.chkW:LOCAL.chkB);
    if(evt.cap)return pick(r,evt.side==="w"?LOCAL.capW:LOCAL.capB);
    if(evt.n&&evt.n<=3)return pick(r,LOCAL.open);
    return pick(r,LOCAL.quiet);
  }
  function commentNotable(evt){
    if(!evt)return false;
    return !!(evt.mate||evt.ended||evt.check||evt.cap||evt.promote)||(evt.side==="w"&&typeof evt.n==="number"&&evt.n%3===0);
  }
  function sanitizeComment(t){
    if(!t)return "";
    let s=String(t).split("\n")[0].trim();
    s=s.replace(/[*_`#>~]/g,"").replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g,"").trim();
    if(s.length<12)return "";
    if(s.length>150)s=s.slice(0,147).replace(/\s+\S*$/,"")+"…";
    return s;
  }
  const CH={panel:null,line:null,lastAt:0,inFlight:false,down:false,announced:false,warned:false,last:null};
  function mountPanel(){
    if(CH.panel&&CH.panel.isConnected)return true;
    try{
      const status=document.getElementById("breakGameStatus");
      if(!status||!status.parentNode)return false;
      const el=document.createElement("div");
      el.id="gfChessCommentary";el.className="gf-chess-commentary";
      el.innerHTML='<span class="gf-chess-tag">\u265E ROOM</span><span class="gf-chess-line"></span>';
      status.parentNode.insertBefore(el,status.nextSibling);
      CH.panel=el;CH.line=el.querySelector(".gf-chess-line");
      return true;
    }catch(e){return false;}
  }
  function sayComment(text,isAi){
    CH.last={text:text,isAi:!!isAi};
    if(!mountPanel())return;
    CH.line.textContent=text;
    CH.panel.classList.toggle("is-ai",!!isAi);
    CH.panel.classList.remove("gf-fade");
    void CH.panel.offsetWidth;
    CH.panel.classList.add("gf-fade");
  }
  function chessNote(evt){
    if(!evt)return null;
    if(evt.side==="new"){
      CH.lastAt=0;
      sayComment("New game · engine reads at "+String(evt.diff||"GRANDMASTER")+". The White Room observes.",false);
      return null;
    }
    sayComment(commentLocal(evt),false); /* instant, offline-first */
    const now=Date.now();
    if(!commentNotable(evt))return null;
    if(CH.down||CH.inFlight||(now-CH.lastAt<9000))return null; /* rate-limit: max 1 AI note per 9s */
    if(!window.AiEngine||typeof window.AiEngine.call!=="function"||!aiConfigured())return null;
    CH.inFlight=true;CH.lastAt=now;
    const who=evt.side==="w"?"White (the candidate)":"Black (the shadow engine)";
    const what=String(evt.san||"a move")+(evt.cap?", capturing "+(PIECEWORDS[evt.cap]||"a piece"):"")+(evt.check?", giving check":"")+(evt.mate?" — checkmate":"")+(evt.promote?", promoting a pawn":"");
    const p=window.AiEngine.call({
      systemPrompt:"You are the White Room chess commentator: calm, clinical, brief, faintly superior. Exactly one sentence, plain text, no markdown, no emojis.",
      messages:[{role:"user",content:"Move "+(evt.n||"?")+" · "+who+" played "+what+". Engine level: "+(evt.diff||"GRANDMASTER")+". Write ONE commentary sentence (max 22 words), cool and precise."}],
      temperature:0.85,maxTokens:80
    }).then(res=>{
      const clean=sanitizeComment(res&&res.text);
      if(!clean)throw new Error("empty commentary");
      sayComment("\u2726 AI · "+clean,true);
      track("chess-commentary");
      if(!CH.announced){CH.announced=true;gfToast("\u2726 AI commentator seated — the White Room has eyes.");}
    }).catch(err=>{
      CH.down=true;
      if(!CH.warned){CH.warned=true;gfToast("AI commentator unavailable ("+String((err&&err.message)||err).slice(0,70)+") · the room returns to silence.");}
    }).finally(()=>{CH.inFlight=false;});
    return p;
  }

  /* merge into the round-10 GameForge singleton (never overwrite) */
  const GF=window.GameForge=window.GameForge||{};
  Object.assign(GF,{
    mysteryQueue:mysteryQueue,mysteryPoke:mysteryPoke,mysteryTarget:mysteryTarget,mysteryStatus:mysteryStatus,
    chessNote:chessNote,
    _genMysteryCase:genMysteryCase,_parseMysteryBatch:parseMysteryBatch,
    _commentLocal:commentLocal,_commentNotable:commentNotable,_sanitizeComment:sanitizeComment,
    _chessState:CH,_mysteryAi:mysteryAi
  });
})();
