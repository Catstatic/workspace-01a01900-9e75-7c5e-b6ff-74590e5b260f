/* ============================================================
   ROUND 15 — BOOT BACKGROUND SHUFFLE (manual re-roll)
   Round 14 rotates the palette per session-open; the user asked
   for a manual shuffle on the boot card too — "add shuffle".
   Behavior:
   • A 🎲 SHUFFLE button is injected into the boot header whenever
     #bootCenterOverlay exists (same MutationObserver discipline as
     round 14 — we never touch round-13/14 source, just decorate it).
   • Clicking rotates the overlay backdrop to the NEXT pool frame
     immediately (uses __bootBgRotation.paint — same ordering, same
     persisted pointer — so a shuffle simply fast-forwards the
     sequence; the next session resumes after the frame you land on).
   • Never paints the SAME frame twice in a row: if nextIndex()
     would repeat the visible frame, paint again (pool > 1 so this
     terminates). Pointer advances twice in that case — cheap and
     honest.
   • Button rolls its dice glyph via .rolled class; pointer-events
     debounced 400ms so double-clicks can't skip frames.
   Public test surface: window.__bootBgShuffle {inject, shuffle}.
   ============================================================ */
(function(){
  "use strict";

  function rot(){return (typeof window!=="undefined"&&window.__bootBgRotation)?window.__bootBgRotation:null;}
  function overlayHasFrame(ov){
    try{
      var v=ov.style.getPropertyValue("--boot-bg")||"";
      var m=v.match(/boot-bg-\w+-hq\.jpg/);
      return m?m[0]:null;
    }catch(e){return null;}
  }
  function shuffle(ov){
    var R=rot(),node=ov;
    if(!R||typeof R.paint!=="function")return;
    if(!node&&typeof document!=="undefined")node=document.getElementById("bootCenterOverlay");
    if(!node||typeof node.style==="undefined"||typeof node.style.setProperty!=="function")return;
    var before=overlayHasFrame(node);
    R.paint(node);                 /* advance + stamp next frame */
    if(before&&overlayHasFrame(node)===before)R.paint(node); /* never repeat the visible frame */
    return overlayHasFrame(node);
  }
  function inject(ov){
    if(typeof document==="undefined"||!ov)return null;
    if(ov.querySelector&&ov.querySelector("#bootShuffle"))return ov.querySelector("#bootShuffle");
    var head=ov.querySelector?ov.querySelector(".boot-head"):null;
    if(!head)return null;
    var btn=document.createElement("button");
    btn.id="bootShuffle";btn.className="boot-shuffle";btn.type="button";
    btn.title="Shuffle backdrop";btn.setAttribute("aria-label","Shuffle backdrop");
    btn.innerHTML='<span class="dice">🎲</span>';
    var closeBtn=head.querySelector?head.querySelector("#bootClose"):null;
    try{
      if(closeBtn&&closeBtn.parentNode===head)head.insertBefore(btn,closeBtn);
      else head.appendChild(btn);
    }catch(e){return null;}
    var lock=false;
    btn.addEventListener("click",function(){
      if(lock)return;
      lock=true;
      btn.classList.remove("rolled");
      /* force reflow so the dice re-rolls on consecutive shuffles */
      void btn.offsetWidth;
      btn.classList.add("rolled");
      shuffle(ov);
      setTimeout(function(){lock=false;},400);
    });
    return btn;
  }

  if(typeof document!=="undefined"&&typeof MutationObserver!=="undefined"){
    try{
      var mo=new MutationObserver(function(muts){
        for(var m=0;m<muts.length;m++){
          var add=muts[m].addedNodes;
          for(var an=0;an<add.length;an++){
            var node=add[an];
            if(node&&node.nodeType===1&&node.id==="bootCenterOverlay")inject(node);
          }
        }
      });
      mo.observe(document.documentElement||document.body,{childList:true,subtree:true});
      var existing=document.getElementById("bootCenterOverlay");
      if(existing)inject(existing);
    }catch(e){/* no observer → shuffle stays manual-free, rotation still works */ }
  }

  window.__bootBgShuffle={inject:inject,shuffle:shuffle};
})();
