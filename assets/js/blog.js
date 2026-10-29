(function(){
var D=document,X=window.SBX,L=function(){return D.documentElement.lang||"id"};
var list=D.getElementById("posts"),art=D.getElementById("post");
function msg(el,t){el.innerHTML='<div class="panel empty"><strong>'+X.esc(t)+'</strong></div>'}
if(!X.ok()){var t="Blog belum terhubung ke database.";if(list)msg(list,t);if(art)msg(art,t);return}
function fmt(d){try{return new Date(d).toLocaleDateString(L(),{year:"numeric",month:"long",day:"numeric"})}catch(e){return""}}
if(list)X.req("/rest/v1/posts?select=slug,title,excerpt,cover_url,published_at&status=eq.published&order=published_at.desc&limit=50").then(function(p){
 if(!p.length)return msg(list,"Belum ada artikel");
 list.innerHTML=p.map(function(a){return '<a class="pcard panel" href="post/?s='+encodeURIComponent(a.slug)+'">'+(a.cover_url?'<img src="'+X.esc(a.cover_url)+'" alt="" loading="lazy">':"")+'<div><h2>'+X.esc(X.pick(a.title,L()))+'</h2><p>'+X.esc(X.pick(a.excerpt,L()))+'</p><time>'+fmt(a.published_at)+'</time></div></a>'}).join("")
}).catch(function(e){msg(list,e.message)});
if(art){var s=new URLSearchParams(location.search).get("s");
 if(!s)msg(art,"Artikel tidak ditemukan");else X.req("/rest/v1/posts?select=*&status=eq.published&slug=eq."+encodeURIComponent(s)+"&limit=1").then(function(r){
  var a=r[0];if(!a)return msg(art,"Artikel tidak ditemukan");
  var t=X.pick(a.title,L());D.title=t+" – Musicpedia";
  var m=D.querySelector('meta[name="description"]');if(m)m.content=X.pick(a.excerpt,L());
  art.innerHTML=(a.cover_url?'<img class="cover" src="'+X.esc(a.cover_url)+'" alt="">':"")+'<h1>'+X.esc(t)+'</h1><time>'+fmt(a.published_at)+'</time><div class="md">'+X.md(X.pick(a.body,L()))+'</div>'
 }).catch(function(e){msg(art,e.message)})}
})();
