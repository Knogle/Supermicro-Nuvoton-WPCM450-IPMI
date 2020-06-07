//------------------------------------------------------------------------------
// DomAPI CSV (Comma separated values) Routines
// D. Kadrioski 7/29/2004
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi.urlToCsv = function(url){return domapi.getContent(url)};
//------------------------------------------------------------------------------
domapi.csvToArray = function(s){
  // returns a 2-dimensional array of rows and columns
  var i;
  var lines = s.split('\n');
  for(i=0;i<lines.length;i++)
    lines[i] = domapi.csvLineToArray(String(lines[i]).replace('\r',''));
  return lines;
};
//------------------------------------------------------------------------------
domapi.csvLineToArray = function(line){
  // states
  var INITIAL = 0; var QUOTED = 1;
  var state = null; var idx = 0; var b, lookahead; var s = '';
  // stacks
  var R = []; var states = [INITIAL];
  // shorcuts
  var q = "'"; var qq = '"'; var comma = ",";
  while(b = line.substr(idx, 1)){
    idx++;
    state = states[states.length-1];
    if(state == QUOTED){
      if(b == qq){
        lookahead = line[idx];
        if(lookahead == qq){
          s += b;
          idx++;
          continue;
        }else{
          states.pop();
          state = states[states.length-1];
          continue;
        }
      }
      s += b;
      continue;
    }else{
      if(b == qq){
        states.push(QUOTED);
        continue;
      }
      if(b == comma){
        R.push(s);s = '';
        continue;
      }
      s += b;
      continue;
    }
  }
  if(s != '')R.push(s);
  if(state != INITIAL)throw new Error(domapi.getString("ERR_CSV_FINAL_STATE"));
  return R;
};
//------------------------------------------------------------------------------
domapi.arrayToCsvLine = function(A){
  var s, i;
  var R   = "";
  var re1 = new RegExp('"', "g");
  var re2 = new RegExp('[ ,"]+');
  for(i=0;i<A.length;i++){
    if(i>0)R += ",";
    s = A[i];
    if (typeof(s) == "string") {
      s = s.replace(re1, '""');
      if(s.search(re2) > -1)
        s = '"' + s + '"';
    }  
    R += s;
  }
  return R;
};
//------------------------------------------------------------------------------