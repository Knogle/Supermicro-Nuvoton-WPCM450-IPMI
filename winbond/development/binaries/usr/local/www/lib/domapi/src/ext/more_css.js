//------------------------------------------------------------------------------
// DomAPI css Extentions
// (c) Ben Tudball. 30 December 2002.
//------------------------------------------------------------------------------

domapi.css.selectors     = [];
domapi.css.cssText       = [];
domapi.css.cssTextIndex  = [];
domapi.css.attributes    = [];
domapi.css.format        = [];
domapi.css.formatCssText = [];

//------------------------------------------------------------------------------
// domapi.css.process
// Processes the current domapi.css.sheet - generating arrays, joining multiple 
// selectors and restricting cssText where appropriate. The function has been 
// designed for optimum speed.
//
// b = five digit binary string:
//       digit #1 - domapi.css.selectors[stylesheet index][selector index];
//       digit #2 - domapi.css.cssText[stylesheet index][cssText index];
//       digit #3 - domapi.css.cssTextIndex[stylesheet index][rule index];
//       digit #4 - domapi.css.attributes[stylesheet index][selector index][cssText attribute index][name / value boolean index];
//       digit #5 - domapi.css.format[stylesheet index];
//       digit #6 - domapi.css.formatCssText[stylesheet index][cssText index];
// t = 0 - HTML format output (default)
//     1 - Textarea format output
//
// eg. domapi.css.process("110110");
//     will generate:
//       - domapi.css.selectors[][]
//       - domapi.css.cssText[][]
//       - domapi.css.attributes[][][][]
//       - domapi.css.format[]
//     and will skip:
//       - domapi.css.cssTextIndex[][]
//       - domapi.css.formatCssText[][]
//------------------------------------------------------------------------------
domapi.css.process = function(b,t){
  var n = b.split("");
  if (n.length<5) n[4] = "";
  var br,tb;
  var t = domapi.rInt(t);
  if (t==0) {
    br="<br />";
    tb="&nbsp;&nbsp;";
  } else {
    br="\n";
    tb="\t";
  }
  var a0 = [];
  var a1 = [];
  var a2 = [];
  var a4 = [];
  var a5 = [];
  var u = "";
  var f;
  var d = domapi.isIE?";":"";
  var r = domapi.css.rules;
  var i = domapi.css.index;
  var l = r.length;
  var ii = 0;
  for (var c=0;c<l;c++){
    var s  = "";
    if (c<l-1){
      while (r[c].style.cssText==r[(c+1)].style.cssText) {
        s += r[c].selectorText+", ";
        c++;
        if (c>l-2) break;
      }
    }
    var v = r[c].style.cssText;
    s += r[c].selectorText;
    if (n[0]) a0.push(s);
    if (n[1]) a1.push(v+d);
    if (n[2]) a2.push(c);
    if (n[3]) {
      var a3 = [];
      var g = v.split(";");
      for (var k=0;k<g.length;k++){
        a3.push(g[k].split(": "));
      }
      a4.push(a3);
    }
    if (n[4]||n[5]){
      u += '<a name="da_css_'+ii+'"><span style="color:green;font-weight:bold">'+s+"</span></a> {"+br+tb;
      ii++;
      f = "";
      for (var p=0;p<v.length;p++) {
        if (v.substring(p-1,p+1) == '; '){
          u+=br+tb;
          f+=br;
        } else {
          u+=v.substring(p,p+1);
          f+=v.substring(p,p+1);
        }
      }
      u += ";"+br+"}"+br+br;
      if (n[5]) a5.push(f);
    }
  }
  if (n[0]) domapi.css.selectors[i]     = a0;
  if (n[1]) domapi.css.cssText[i]       = a1;
  if (n[2]) domapi.css.cssTextIndex[i]  = a2;
  if (n[3]) domapi.css.attributes[i]    = a4;
  if (n[4]) domapi.css.format[i]        = u;
  if (n[5]) domapi.css.formatCssText[i] = a5;
};
//------------------------------------------------------------------------------
