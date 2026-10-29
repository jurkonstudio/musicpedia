window.SBX=(function(){
var c=window.SB||{};
function ok(){return !!(c.url&&c.key&&c.url.indexOf("http")===0)}
function req(path,o){o=o||{};var h={apikey:c.key,Authorization:"Bearer "+(o.token||c.key)};
 if(o.json)h["Content-Type"]="application/json";if(o.prefer)h.Prefer=o.prefer;
 return fetch(c.url+path,{method:o.method||"GET",headers:h,body:o.json?JSON.stringify(o.json):undefined}).then(function(r){return r.text().then(function(t){
  var d=null;try{d=t?JSON.parse(t):null}catch(e){}
  if(!r.ok)throw new Error((d&&(d.message||d.msg||d.error_description))||("Error "+r.status));return d})})}
function pick(j,l){if(!j)return"";if(typeof j==="string")return j;return j[l]||j.id||j.en||Object.values(j)[0]||""}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function md(s){s=esc(s);var out=[],list=false;
 function inl(t){return t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g,'<a href="$2" rel="noopener">$1</a>')}
 function close(){if(list){out.push("</ul>");list=false}}
 s.split(/\n/).forEach(function(l){var m;
  if(m=l.match(/^(#{1,3})\s+(.*)/)){close();var n=m[1].length+1;out.push("<h"+n+">"+inl(m[2])+"</h"+n+">")}
  else if(m=l.match(/^[-*]\s+(.*)/)){if(!list){out.push("<ul>");list=true}out.push("<li>"+inl(m[1])+"</li>")}
  else if(!l.trim()){close()}else{close();out.push("<p>"+inl(l)+"</p>")}});
 close();return out.join("")}
return{ok:ok,req:req,pick:pick,esc:esc,md:md}
})();
