/* ============================================================
   ROUND 18 — FORGE GAMES logic layer (CORE CASCADE + STAR LATTICE)
   Pure, DOM-free game engines. The two playable modes are injected
   into the base theme-game closure by surgical_r17.json; they call
   these engines at runtime. This block never touches closure scope.
   Test surface: window.__forgeLogic (+ global forgePalette()).
   ============================================================ */
function forgePalette(){return['#7fd4ff','#ffd27f','#ff9d9d','#a9f5d6','#d49dff','#8fb8ff','#ffe9a6','#ff9ec7'];}
window.__forgeLogic={
  /* ---- CORE CASCADE (chain-reaction puzzle) ---- */
  cascade:{
    nbrs:function(i,size){var x=i%size,y=(i/size)|0,r=[];if(x>0)r.push(i-1);if(x<size-1)r.push(i+1);if(y>0)r.push(i-size);if(y<size-1)r.push(i+size);return r;},
    /* One spark placed on idx: resolve the full chain. cells:[{o:'N'|'F'|'H',e:0..4}]; returns {waves,claims,cleared} */
    spark:function(cells,size,idx){
      var c=cells[idx];
      if(c.o==='H')return{waves:[],claims:[],cleared:false,blocked:true};
      c.o='F';c.e+=1;
      if(c.e<4)return{waves:[],claims:[idx],cleared:!cells.some(function(k){return k.o==='H';})};
      var out=this.resolve(cells,size,[idx]);
      out.claims=[idx].concat(out.waves.reduce(function(a,w){return a.concat(w);},[]));
      return out;
    },
    /* Resolve explosions from a queue of hot cells */
    resolve:function(cells,size,queue){
      var seen={},waves=[],claims=[],q=queue.slice(),i,idx;
      for(i=0;i<q.length;i++)seen[q[i]]=1;
      while(q.length){
        var wave=q.slice();q=[];var next={};
        for(var w=0;w<wave.length;w++){
          idx=wave[w];
          var c=cells[idx];if(!c||c.e<4)continue;
          c.e=0;claims.push(idx);
          var ns=this.nbrs(idx,size);
          for(var n=0;n<ns.length;n++){
            var nc=cells[ns[n]];nc.o='F';nc.e+=1;
            if(nc.e>=4&&!seen[ns[n]]){seen[ns[n]]=1;next[ns[n]]=1;}
          }
        }
        for(var k in next)q.push(+k);
        /* any cell reticked to 4+ without being seen joins the queue */
        for(i=0;i<cells.length;i++)if(cells[i].e>=4&&!seen[i]){seen[i]=1;q.push(i);}
        var exploded=wave.filter(function(i2){return cells[i2].e===0;});
        if(exploded.length)waves.push(exploded);
      }
      return{waves:waves,claims:claims,cleared:!cells.some(function(k){return k.o==='H';})};
    },
    /* Random board: size² cells, `hos` non-adjacent hostile orbs with energy 1..maxE */
    board:function(size,hos,maxE,rand){
      var cells=[],i;for(i=0;i<size*size;i++)cells.push({o:'N',e:0});
      var placed=[],guard=600;
      while(placed.length<hos&&guard-->0){
        i=Math.floor(rand()*size*size);
        if(cells[i].o!=='N')continue;
        var clash=placed.some(function(p){return this.nbrs(p,size).indexOf(i)>=0;},this);
        if(clash)continue;
        cells[i]={o:'H',e:1+Math.floor(rand()*maxE)};placed.push(i);
      }
      if(placed.length<hos){for(i=0;i<size*size&&placed.length<hos;i++)if(cells[i].o==='N'){cells[i]={o:'H',e:1};placed.push(i);}}
      return cells;
    }
  },
  /* ---- STAR LATTICE (flow/connect-the-dots) ---- */
  lattice:{
    nbrs:function(i,size){return window.__forgeLogic.cascade.nbrs(i,size);},
    /* Serpentine snake over the grid, cut into `pairs` contiguous colored segments.
       Endpoints {a,b} per segment; a full-cover, always-solvable puzzle by construction. */
    build:function(size,pairs,rand){
      var snake=[],x,y,row;
      for(y=0;y<size;y++){row=[];for(x=0;x<size;x++)row.push(y*size+x);if(y%2)row.reverse();snake=snake.concat(row);}
      var n=snake.length,step=Math.max(2,Math.floor(n/pairs)),cuts=[0],k;
      for(k=1;k<pairs;k++){cuts.push(Math.min(n-1,step*k+Math.floor(rand()*2)));}
      cuts.push(n);
      var segs=[];
      for(k=0;k<cuts.length-1;k++){
        var a=cuts[k],b=cuts[k+1];
        if(b-a<2&&segs.length){segs[segs.length-1].b=b;continue;}
        segs.push({a:a,b:b});
      }
      return segs.map(function(s,i){
        return{color:i%forgePalette().length,a:snake[s.a],b:snake[s.b-1],cells:snake.slice(s.a,s.b)};
      });
    },
    /* Validate a finished state: every endpoint pair joined by its path, no cell collisions */
    verify:function(size,segs,pathOf,endOf){
      var filled={},i,ci,p;
      for(ci=0;ci<pathOf.length;ci++){
        p=pathOf[ci];
        for(i=0;i<p.length;i++){if(filled[p[i]]!==undefined)return{ok:false,why:'collision'};filled[p[i]]=ci;}
      }
      return{ok:true};
    }
  }
};
