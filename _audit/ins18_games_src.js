  /* ====== ROUND 18 FORGE GAMES — CORE CASCADE + STAR LATTICE (DOM layer) ======
     Injected inside the theme-games closure by surgical_r18.json so these
     inits enjoy the same closure helpers (setArena/setScore/finish/...) as
     every other mode. Pure rules live in window.__forgeLogic (logic block
     appended at end of body). Engines: CHAIN REACTION + CONNECT-THE-DOTS,
     both complete, level-scaled, stats-wired, professional chrome. */
  function initCascade(){
    var CAP=4;
    var CFG={noobie:{size:5,hos:6,sparks:10,maxE:2},adept:{size:6,hos:9,sparks:10,maxE:2},elite:{size:6,hos:11,sparks:9,maxE:3},godhood:{size:7,hos:14,sparks:9,maxE:3}};
    var cfg=CFG[gameLevel]||CFG.adept;
    var size=cfg.size,L=window.__forgeLogic.cascade;
    var cells=null,sparks=0,moves=0,chainBest=0,cascading=false,over=false,uid=0;
    setArena('<div class="forge-wrap"><div class="forge-hud">'+
      '<span class="forge-chip">SPARKS <b id="forgeSparks"></b></span>'+
      '<span class="forge-chip warn">HOSTILE <b id="forgeHostile"></b></span>'+
      '<span class="forge-chip">BEST CHAIN <b id="forgeChain">0</b></span>'+
      '<span class="forge-chip">MOVES <b id="forgeMoves">0</b></span></div>'+
      '<div class="forge-grid forge-cascade-grid" id="forgeGrid" style="grid-template-columns:repeat('+size+',auto)"></div>'+
      '<div class="forge-actions"><button class="forge-btn" id="forgeReset">⟲ RESET CORE</button>'+
      '<button class="forge-btn" id="forgeSwitch">✦ SWITCH: STAR LATTICE</button></div>'+
      '<div class="forge-log" id="forgeLog"></div></div>');
    var grid=document.getElementById('forgeGrid'),log=document.getElementById('forgeLog');
    document.getElementById('forgeReset').addEventListener('click',function(){boot(true);});
    document.getElementById('forgeSwitch').addEventListener('click',function(){try{startMode('lattice');}catch(e){}});
    var myUid=++uid;
    function say(t){if(log)log.textContent=t;}
    function hostiles(){var n=0;for(var i=0;i<cells.length;i++)if(cells[i].o==='H')n++;return n;}
    function render(){
      grid.innerHTML='';
      for(var i=0;i<cells.length;i++){draw(i);}
      var s=document.getElementById('forgeSparks'),h=document.getElementById('forgeHostile'),ch=document.getElementById('forgeChain'),mv=document.getElementById('forgeMoves');
      if(s)s.textContent=sparks;if(h)h.textContent=hostiles();if(ch)ch.textContent=chainBest;if(mv)mv.textContent=moves;
    }
    function draw(i){
      var c=cells[i];
      var b=document.createElement('button');
      b.className='forge-cell'+(c.o==='F'?' friendly':'')+(c.o==='F'&&c.e===0?' dormant':'');
      b.type='button';b.id='forgeCell'+i;
      b.setAttribute('aria-label','core cell '+((i%size)+1)+','+(((i/size)|0)+1));
      if(c.e>0){
        var orb=document.createElement('span');
        orb.className='forge-orb s'+Math.min(4,c.e);
        for(var p=0;p<Math.min(4,c.e);p++){
          var pip=document.createElement('i');pip.className='pip';
          pip.style.left=(16+(p%2)*34)+'%';pip.style.top=(16+((p/2)|0)*34)+'%';
          orb.appendChild(pip);
        }
        b.appendChild(orb);
      }
      (function(idx){b.addEventListener('click',function(){press(idx);});})(i);
      grid.appendChild(b);
    }
    function paintCells(list){list.forEach(function(i){grid.children[i]=grid.children[i];});}
    function boot(reset){
      cells=L.board(size,cfg.hos,cfg.maxE,Math.random);
      sparks=cfg.sparks;moves=0;chainBest=0;cascading=false;over=false;
      if(reset)setScore(0);
      setStatus('Core live · '+size+'×'+size+' lattice');
      say('Linked orbs detonate at 4 energy and cascade to their neighbours. Convert every hostile orb before sparks run dry.');
      render();
    }
    function after(res,origin){
      var waveCount=res.waves.length;
      if(waveCount>0){
        chainBest=Math.max(chainBest,waveCount);
        setScore(score+waveCount*12+res.claims.length*3);
        say(waveCount>=3?'CASCADE ×'+waveCount+' — the lattice sings.':(waveCount>1?'Chain ×'+waveCount+'.':'Detonation.'));
      }else setScore(score+2);
      if(res.cleared){
        over=true;cascading=false;
        setScore(score+sparks*15+size*10);
        finish('Core cascade cleared — every hostile orb converted on a '+size+'×'+size+' lattice. Sparks to spare: '+sparks+'.');
        render();return;
      }
      if(sparks<=0){
        over=true;cascading=false;
        finish('The cascade failed — hostile lattice held the core. '+hostiles()+' orbs still hostile.');
        render();return;
      }
      cascading=false;render();
    }
    function press(i){
      if(over||cascading||!gameActive)return;
      var c=cells[i];
      if(c.o==='H'){var el=grid.children[i];if(el){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}say('Hostile core — only a blast wave can convert it. Aim beside it.');render();return;}
      if(sparks<=0){say('Sparks exhausted.');return;}
      sparks--;moves++;
      var before=cells[i].e;
      var res=L.spark(cells,size,i);
      if(res.blocked){render();return;}
      cascading=res.waves.length>0;
      var el2=grid.children[i];if(el2&&before+1>=CAP)el2.classList.add('boom');
      if(cascading)setTimeout(function(){after(res,i);},200);
      else after(res,i);
    }
    cleanup=function(){over=true;cascading=false;};
    boot(false);
  }

  function initLattice(){
    var CFG={noobie:{size:5,pairs:4},adept:{size:6,pairs:5},elite:{size:7,pairs:6},godhood:{size:8,pairs:7}};
    var cfg=CFG[gameLevel]||CFG.adept;
    var size=cfg.size,pal=forgePalette(),LQ=window.__forgeLogic.lattice;
    var segs=null,endOf=null,paths=null,done=null,active=-1,moves=0,over=false;
    setArena('<div class="forge-wrap"><div class="forge-hud">'+
      '<span class="forge-chip">LINKED <b id="forgeLinked"></b></span>'+
      '<span class="forge-chip">COVERAGE <b id="forgeCover">0%</b></span>'+
      '<span class="forge-chip">MOVES <b id="forgeMoves2">0</b></span></div>'+
      '<div class="forge-active-banner" id="forgeActive">TAP A CORE TO BEGIN ITS LINE</div>'+
      '<div class="forge-grid forge-lattice-grid" id="forgeGrid2" style="grid-template-columns:repeat('+size+',auto)"></div>'+
      '<div class="forge-actions"><button class="forge-btn" id="forgeReset2">⟲ NEW CONSTELLATION</button>'+
      '<button class="forge-btn" id="forgeSwitch2">⚡ SWITCH: CORE CASCADE</button></div>'+
      '<div class="forge-log" id="forgeLog2"></div></div>');
    var grid=document.getElementById('forgeGrid2'),log=document.getElementById('forgeLog2'),banner=document.getElementById('forgeActive');
    document.getElementById('forgeReset2').addEventListener('click',function(){boot(true);});
    document.getElementById('forgeSwitch2').addEventListener('click',function(){try{startMode('cascade');}catch(e){}});
    function say(t){if(log)log.textContent=t;}
    function pathSet(ci){var o={};for(var i=0;i<paths[ci].length;i++)o[paths[ci][i]]=1;return o;}
    function filled(){var o={},i,ci;
      for(i=0;i<size*size;i++)if(endOf[i]>=0)o[i]=1;
      for(ci=0;ci<paths.length;ci++)for(i=0;i<paths[ci].length;i++)o[paths[ci][i]]=1;
      var n=0;for(var k in o)n++;return n;}
    function draw(i){
      var b=document.createElement('button');b.type='button';
      var endC=endOf[i];
      b.className='forge-cell';
      var lineC=-1;
      for(var ci=0;ci<paths.length;ci++)if(paths[ci].indexOf(i)>=0){lineC=ci;break;}
      if(endC>=0){b.classList.add('end');if(done[endC])b.classList.add('complete');}
      if(lineC>=0){b.setAttribute('data-fill','line');b.style.setProperty('--line-color',pal[segs[lineC].color]);}
      if(endC>=0){var d=document.createElement('span');d.className='forge-dot';d.style.background=pal[segs[endC].color];d.style.color=pal[segs[endC].color];b.appendChild(d);}
      (function(idx){b.addEventListener('click',function(){press(idx);});})(i);
      grid.appendChild(b);
    }
    function render(){
      grid.innerHTML='';
      for(var i=0;i<size*size;i++)draw(i);
      var a=document.getElementById('forgeLinked'),cv=document.getElementById('forgeCover'),mv=document.getElementById('forgeMoves2');
      var dn=0;for(var k in done)dn++;
      if(a)a.textContent=dn+'/'+segs.length;
      if(cv)cv.textContent=Math.round(100*filled()/(size*size))+'%';
      if(mv)mv.textContent=moves;
      if(banner){
        banner.textContent=active>=0?('LINKING CORE '+('ABCDEFG'[active]||'?')+' — reach its twin without crossing'):'TAP A CORE TO BEGIN ITS LINE';
        banner.style.color=active>=0?pal[segs[active].color]:'';
      }
    }
    function boot(reset){
      segs=LQ.build(size,cfg.pairs,Math.random);
      endOf=[];for(var i=0;i<size*size;i++)endOf.push(-1);
      segs.forEach(function(s,ci){endOf[s.a]=ci;endOf[s.b]=ci;});
      paths=segs.map(function(){return[];});done={};active=-1;moves=0;over=false;
      if(reset)setScore(0);
      setStatus('Constellation open · '+size+'×'+size);
      say('Trace each pair without crossing another line. Full-field coverage pays a bonus.');
      render();
    }
    function tailOf(ci){var p=paths[ci];return p.length?p[p.length-1]:segs[ci].a;}
    function press(i){
      if(over||!gameActive)return;
      var endC=endOf[i],ci;
      if(endC>=0){
        var other=(segs[endC].a===i)?segs[endC].b:segs[endC].a;
        /* seal: active line, touching the twin endpoint, not done yet */
        if(active===endC&&!done[endC]&&i!==segs[endC].a&&LQ.nbrs(tailOf(endC),size).indexOf(i)>=0){
          done[endC]=1;paths[endC]=[];active=-1;moves++;
          setScore(score+10);
          say('Line sealed.');
          var dn=0;for(var k in done)dn++;
          if(dn===segs.length){win();return;}
          render();return;
        }
        /* reopen a finished line */
        if(done[endC]){delete done[endC];active=endC;render();return;}
        active=endC;render();return;
      }
      if(active<0){say('Select a core first — one of the coloured nodes.');return;}
      var p=paths[active],tail=tailOf(active);
      /* erase: click any own-path cell → cut back to just before it */
      var at=p.indexOf(i);
      if(at>=0){paths[active]=p.slice(0,at);moves++;render();return;}
      /* collisions */
      for(ci=0;ci<paths.length;ci++){
        if(ci!==active&&paths[ci].indexOf(i)>=0){var el=grid.children[i];if(el){el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}say('Lines cannot share a cell.');return;}
      }
      if(endOf[i]>=0){return;} /* endpoints of OTHER lines are walls */
      if(LQ.nbrs(tail,size).indexOf(i)<0){say('Lines grow one shared edge at a time.');return;}
      p.push(i);moves++;setScore(score+2);render();
    }
    function win(){
      over=true;
      var full=filled()===size*size;
      if(full)setScore(score+25);
      finish('Star lattice complete — every constellation linked'+(full?' with FULL FIELD coverage':'')+' on a '+size+'×'+size+' grid in '+moves+' moves.');
      render();
    }
    cleanup=function(){over=true;active=-1;};
    boot(false);
  }
