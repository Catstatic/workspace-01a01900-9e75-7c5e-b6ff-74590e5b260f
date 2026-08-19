/* ============================================================
   ROUND 14 — BOOT BACKGROUND ROTATION (game-free, network-free)
   Round 13's boot overlay painted one fixed artwork. The user
   hand-picked a five-frame pool (gallery #6 → #2 → #7 → #8 + the ROUND-24 Feynman chalkboard,
   grade-enhanced locally — no AI passes) and wants each boot to
   open on the NEXT frame, remembered across sessions.

   Mechanics:
   • A MutationObserver watches for #bootCenterOverlay being
     inserted into the DOM (round 13 recreates it fresh on every
     open — auto-greet and manual alike). On insertion we stamp
     --boot-bg on the overlay element with the NEXT pool frame and
     advance a persisted pointer in its own localStorage key
     (never exported in backups — same hygiene as all our keys).
   • ROUND 25 ▶ WEIGHTED WALK: the user loves the Feynman
     chalkboard frame and asked for it "a bit more often than
     others". Flat round-robin dealt every frame 1/5 (20%); the
     pointer now walks a repeating 7-slot SCHEDULE of pool
     indices — [0,4,1,4,2,4,3] — so the boot order reads
     VOID · FEYNMAN · PALACE · FEYNMAN · BABEL · FEYNMAN · TORII
     and repeats: FEYNMAN lands 3 of every 7 boots (~43%) while
     each other frame lands once (~14%). Feynman slots are never
     adjacent, so the backdrop can never repeat back-to-back and
     round-15 shuffle's no-repeat guarantee stays trivially true.
   • The persisted pointer now marks a SCHEDULE position (mod 7)
     instead of a pool index (mod 5). Every previously-stored
     pointer (0–4) is still a valid schedule position, so existing
     installs rotate on without migration — same key, same hygiene.
   • Fallback if localStorage is unavailable (private mode /
     file:// edge): a session-only counter, so it still rotates
     instead of freezing on frame 0.
   • Fallback if MutationObserver is missing (ancient engines):
     wrap window.__bootCenter.show instead.
   • Zero network, zero providers, zero AI — pure local files.
   Public test surface: window.__bootBgRotation {pool, key, frame,
   nextIndex, paint, schedule}.
   ============================================================ */
(function(){
  "use strict";
  var POOL=[
    "boot-bg-void-hq.jpg",    /* gallery #6 — VOID OBSERVATORY      */
    "boot-bg-palace-hq.jpg",  /* gallery #2 — MOON PALACE ABOVE FOG */
    "boot-bg-babel-hq.jpg",   /* gallery #7 — BABEL LIBRARY         */
    "boot-bg-torii-hq.jpg",   /* gallery #8 — TORII OF STARS        */
    "boot-bg-feynman-hq.jpg"  /* ROUND 24 — FEYNMAN AT THE CHALKBOARD */
  ];
  /* ROUND 25: weighted walk over POOL indices — FEYNMAN (4) lands 3/7
     boots, every other frame 1/7, never two Feynmans in a row. */
  var SCHEDULE=[0,4,1,4,2,4,3];
  var KEY="csir_boot_bg_ptr_v1";
  var sessionPtr=-1; /* fallback pointer when storage is unavailable */

  function wrap(i){return ((i%SCHEDULE.length)+SCHEDULE.length)%SCHEDULE.length;}
  function frame(i){return POOL[SCHEDULE[wrap(i)]];}
  function readPtr(){
    try{
      var v=localStorage.getItem(KEY);
      if(v===null)return null;
      var n=parseInt(v,10);
      return (isFinite(n)&&n>=0)?wrap(n):null;
    }catch(e){return null;}
  }
  function writePtr(i){
    try{localStorage.setItem(KEY,String(wrap(i)));}catch(e){/* storage off */ }
  }
  /* The frame THIS open should display, then advance the pointer. */
  function nextIndex(){
    var cur=readPtr();
    if(cur===null){
      sessionPtr=wrap(sessionPtr+1);
      writePtr(sessionPtr+1); /* best-effort; may silently no-op */
      return sessionPtr;
    }
    writePtr(cur+1);
    return cur;
  }
  function paint(overlay){
    if(!overlay||typeof overlay.style==="undefined"||typeof overlay.style.setProperty!=="function")return;
    overlay.style.setProperty("--boot-bg",'url("'+frame(nextIndex())+'")');
  }

  if(typeof document!=="undefined"&&typeof window!=="undefined"){
    if(typeof MutationObserver!=="undefined"){
      try{
        var seen=null;
        var mo=new MutationObserver(function(muts){
          for(var m=0;m<muts.length;m++){
            var add=muts[m].addedNodes;
            for(var an=0;an<add.length;an++){
              var node=add[an];
              if(node&&node.nodeType===1&&node.id==="bootCenterOverlay"&&node!==seen){
                seen=node;
                paint(node);
              }
            }
          }
        });
        mo.observe(document.documentElement||document.body,{childList:true,subtree:true});
      }catch(e){/* observer failed; try the hook below */ }
    }else{
      /* Ancient path: round 13 recreated the overlay before we could
         observe it, so wrap its public show() instead. */
      var origShow=window.__bootCenter&&window.__bootCenter.show;
      if(typeof origShow==="function"){
        window.__bootCenter.show=function(){
          var r=origShow.apply(this,arguments);
          if(typeof document!=="undefined"){
            paint(document.getElementById("bootCenterOverlay"));
          }
          return r;
        };
      }
    }
  }

  window.__bootBgRotation={pool:POOL.slice(),schedule:SCHEDULE.slice(),key:KEY,frame:frame,nextIndex:nextIndex,paint:paint};
})();
