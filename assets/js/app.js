(function(){
var D=document,B=D.body,R=B.dataset.root||"",I=window.I18N;
var REG=["world","asia","europe","americas","africa","oceania"];
var GEN=["Pop","Rock","Indie","Dangdut","K-Pop","J-Pop","Jazz","Akustik","R&B","Reggae","Latin","Afrobeats"];
var CMAP={};
[["asia","ID MY SG TH VN PH JP KR CN IN TW HK"],["europe","GB DE FR ES IT NL SE PT PL RU"],["americas","US CA BR MX AR CO CL"],["africa","ZA NG EG KE GH"],["oceania","AU NZ"]].forEach(function(a){a[1].split(" ").forEach(function(c){CMAP[c]=a[0]})});

var lang=(new URLSearchParams(location.search).get("lang")||"").slice(0,2);
try{lang=lang||localStorage.getItem("lang")||""}catch(e){}
if(!I[lang])lang=((navigator.languages||[navigator.language||"en"]).map(function(l){return l.slice(0,2)}).find(function(l){return I[l]}))||"en";
var cc=((navigator.language||"").split("-")[1]||"").toUpperCase();
var reg=CMAP[cc]||"world";

function $(id){return D.getElementById(id)}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function flag(c){return c&&c.length===2?String.fromCodePoint.apply(null,c.toUpperCase().split("").map(function(x){return 127397+x.charCodeAt()})):""}
function nf(n){try{return new Intl.NumberFormat(lang,{notation:"compact"}).format(n)}catch(e){return n}}
function T(){return I[lang]}

function emptyHTML(){return '<strong>'+esc(T().empty)+'</strong><span>'+esc(T().hint)+'</span>'}
function rows(items){
  if(!items||!items.length)return '<div class="empty">'+emptyHTML()+'</div>';
  return items.slice(0,20).map(function(s,i){
    return '<a class="row" href="'+R+'chord/'+esc(s.artistSlug||slug(s.artist))+'/'+esc(s.slug||slug(s.title))+'/"><span class="rk">'+(i+1)+'</span><span class="tt"><b>'+esc(s.title)+'</b><small>'+esc(s.artist)+'</small></span><span class="ct">'+flag(s.country)+' '+esc(s.country||"")+'</span><span class="vw">'+nf(s.views||0)+'</span></a>';
  }).join("");
}
function load(){
  var c=$("l-chord");if(!c)return;
  fetch(R+"data/trending-"+reg+".json").then(function(r){return r.json()}).catch(function(){return{}}).then(function(d){
    c.innerHTML=rows(d.chord);$("l-lyr").innerHTML=rows(d.lyrics);
    $("upd").textContent=d.updated||"";
  });
}
function paint(){
  var L=T();
  D.documentElement.lang=lang;D.documentElement.dir=lang==="ar"?"rtl":"ltr";
  D.querySelectorAll("[data-i]").forEach(function(e){var v=L[e.dataset.i];if(v==null)return;if(e.tagName==="INPUT")e.placeholder=v;else e.textContent=v});
  D.querySelectorAll("[data-empty]").forEach(function(e){e.innerHTML=emptyHTML()});
  var s=$("lang");if(s)s.value=lang;
  var rn=L.r[reg];
  if($("h-chord")){$("h-chord").textContent=L.tc+" · "+rn;$("h-lyr").textContent=L.tl+" · "+rn}
  if($("tabs")){
    $("tabs").innerHTML=REG.map(function(k){return '<button aria-pressed="'+(k===reg)+'" data-r="'+k+'">'+esc(L.r[k])+'</button>'}).join("");
    $("tabs").querySelectorAll("button").forEach(function(b){b.onclick=function(){reg=b.dataset.r;paint();load()}});
  }
  if($("gen"))$("gen").innerHTML=GEN.map(function(g){return '<a href="'+R+'genre/?g='+slug(g)+'">'+esc(g)+'</a>'}).join("");
  if($("fregs"))$("fregs").innerHTML=REG.map(function(k){return '<a href="'+R+'?region='+k+'">'+esc(L.r[k])+'</a>'}).join("");
}
var sel=$("lang");
if(sel){Object.keys(I).forEach(function(k){var o=D.createElement("option");o.value=k;o.textContent=k.toUpperCase();sel.appendChild(o)});
sel.onchange=function(){lang=sel.value;try{localStorage.setItem("lang",lang)}catch(e){}paint();load()}}
var qr=new URLSearchParams(location.search).get("region");if(REG.indexOf(qr)>-1)reg=qr;
paint();load();
})();
