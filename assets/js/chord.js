// Transpose chord: Chord.transpose("Am7/G", 2) -> "Bm7/A"
window.Chord=(function(){
  var N=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],F={Db:"C#",Eb:"D#",Gb:"F#",Ab:"G#",Bb:"A#"};
  function sh(n,s){n=F[n]||n;var i=N.indexOf(n);return i<0?n:N[(i+s%12+12)%12]}
  function transpose(c,s){return c.replace(/([A-G][#b]?)/g,function(m){return sh(m,s)})}
  return{transpose:transpose}
})();
