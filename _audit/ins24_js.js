/* ============================================================
   SKINFORGE + CASTFORGE — OVERLAY INJECTOR (ROUND 26)
   The base file owns its fx layers as static markup; the three
   new worlds and four persona ultimates get theirs the clean
   way: runtime injection, idempotent, zero base-markup edits.
   Nodes are opacity:0 by CSS default — their theme/persona
   class combinations fade them in (see style master). No JS
   animation drivers: everything visual is pure CSS.
   Public test surface: window.__skinforge {themes, cast, ids}.
   ============================================================ */
(function(){
  "use strict";
  var LAYERS=[
    /* SKINFORGE — three new worlds */
    ["fxKaiju8","fx-atmo-x sf-kaiju8"],
    ["fxBatman","fx-atmo-x sf-batman"],
    ["fxMoonknight","fx-atmo-x sf-moonknight"],
    /* CASTFORGE — four persona ultimates */
    ["fxIgris","fx-atmo-x cast-igris"],
    ["fxHuoyuhao","fx-atmo-x cast-huoyuhao"],
    ["fxGehrman","fx-atmo-x cast-gehrman"],
    ["fxFool","fx-atmo-x cast-fool"]
  ];
  function inject(){
    if(typeof document==="undefined"||!document.body)return false;
    var anchor=document.getElementById("fxLotm");
    for(var i=0;i<LAYERS.length;i++){
      var id=LAYERS[i][0];
      if(document.getElementById(id))continue; /* idempotent */
      var d=document.createElement("div");
      d.id=id;d.className=LAYERS[i][1];
      d.setAttribute("aria-hidden","true");
      if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(d,anchor.nextSibling);
      else document.body.appendChild(d);
    }
    return true;
  }
  if(!inject()){
    /* body not ready (defensive): retry on DOMContentLoaded */
    if(typeof document!=="undefined"&&document.addEventListener){
      document.addEventListener("DOMContentLoaded",function(){inject();});
    }
  }
  if(typeof window!=="undefined"){
    window.__skinforge={
      version:"R26",
      layers:LAYERS.map(function(l){return l[0];}),
      themes:["theme-kaiju8","theme-batman","theme-moonknight"],
      cast:["voice-igris","voice-huoyuhao","voice-gehrman","voice-fool"]
    };
  }
})();
