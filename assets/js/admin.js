(function(){
var D=document,X=window.SBX,$=function(i){return D.getElementById(i)},tok="",editing=null;
if(!X.ok()){$("lmsg").textContent="Isi url dan key di assets/js/config.js dulu.";}
try{tok=sessionStorage.getItem("tok")||""}catch(e){}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function say(id,t,bad){var e=$(id);e.textContent=t;e.className="msg"+(bad?" bad":"")}
function show(){var on=!!tok;$("login").hidden=on;$("app").hidden=!on;if(on){cats();load()}}
$("login").onsubmit=function(e){e.preventDefault();if(!X.ok())return;
 fetch(window.SB.url+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:window.SB.key,"Content-Type":"application/json"},body:JSON.stringify({email:$("em").value,password:$("pw").value})})
 .then(function(r){return r.json()}).then(function(d){if(!d.access_token)throw new Error(d.msg||d.error_description||"Gagal masuk");
  tok=d.access_token;try{sessionStorage.setItem("tok",tok)}catch(e){}$("pw").value="";$("who").textContent=d.user&&d.user.email||"";show()})
 .catch(function(er){say("lmsg",er.message,1)})};
$("out").onclick=function(){tok="";try{sessionStorage.removeItem("tok")}catch(e){}show()};
function cats(){X.req("/rest/v1/post_categories?select=id,slug,name&order=id",{token:tok}).then(function(c){
 $("cat").innerHTML=c.map(function(x){return '<option value="'+x.id+'">'+X.esc(X.pick(x.name,"id")||x.slug)+'</option>'}).join("")||'<option value="">(belum ada kategori)</option>'}).catch(function(e){say("msg",e.message,1)})}
function load(){X.req("/rest/v1/posts?select=id,slug,title,status&order=id.desc&limit=100",{token:tok}).then(function(p){
 $("list").innerHTML=p.map(function(a){return '<div class="item"><span><b>'+X.esc(X.pick(a.title,"id"))+'</b><small>'+a.status+' · '+X.esc(a.slug)+'</small></span><button class="btn ghost" data-e="'+a.id+'">Ubah</button><button class="btn ghost" data-d="'+a.id+'">Hapus</button></div>'}).join("")||"<p>Belum ada artikel.</p>";
 $("list").querySelectorAll("[data-e]").forEach(function(b){b.onclick=function(){edit(b.dataset.e)}});
 $("list").querySelectorAll("[data-d]").forEach(function(b){b.onclick=function(){if(confirm("Hapus artikel ini?"))X.req("/rest/v1/posts?id=eq."+b.dataset.d,{method:"DELETE",token:tok}).then(load).catch(function(e){say("msg",e.message,1)})}})
}).catch(function(e){if(/JWT|expired/i.test(e.message)){tok="";show()}say("msg",e.message,1)})}
function clear(){editing=null;$("f").reset();$("ft").textContent="Artikel baru";say("msg","")}
$("new").onclick=clear;
$("t_id").oninput=function(){if(!editing)$("slug").value=slug(this.value)};
function edit(id){X.req("/rest/v1/posts?select=*&id=eq."+id,{token:tok}).then(function(r){var a=r[0];editing=a.id;$("ft").textContent="Ubah artikel";
 $("t_id").value=X.pick(a.title,"id");$("t_en").value=(a.title||{}).en||"";$("slug").value=a.slug;if(a.category_id)$("cat").value=a.category_id;
 $("ex_id").value=(a.excerpt||{}).id||"";$("ex_en").value=(a.excerpt||{}).en||"";$("b_id").value=(a.body||{}).id||"";$("b_en").value=(a.body||{}).en||"";
 $("cover").value=a.cover_url||"";$("st").value=a.status;window.scrollTo(0,0)}).catch(function(e){say("msg",e.message,1)})}
$("f").onsubmit=function(e){e.preventDefault();
 function o(a,b){var r={id:a};if(b)r.en=b;return r}
 var d={slug:$("slug").value,category_id:$("cat").value?+$("cat").value:null,title:o($("t_id").value,$("t_en").value),excerpt:o($("ex_id").value,$("ex_en").value),body:o($("b_id").value,$("b_en").value),cover_url:$("cover").value||null,status:$("st").value,
  seo:{title:o($("t_id").value+" – Musicpedia"),description:o($("ex_id").value)}};
 if(d.status==="published")d.published_at=new Date().toISOString();
 var p=editing?X.req("/rest/v1/posts?id=eq."+editing,{method:"PATCH",json:d,token:tok}):X.req("/rest/v1/posts",{method:"POST",json:d,token:tok,prefer:"return=minimal"});
 p.then(function(){say("msg","Tersimpan.");clear();load()}).catch(function(er){say("msg",er.message,1)})};
show();
})();
