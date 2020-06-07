//------------------------------------------------------------------------------
// DomAPI node sort routines
// D. Kadrioski 3/8/2002 - reconceived 7/2/2003
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------

/*
*  usage:   domapi.nodeSort( ...inline object... );
*
*  Inline object parameters:
*  NAME            DEFAULT         TYPE        REQ. DESCRIPTION
*  nodelist        n/a             HTMLElement yes  The list you want sorted. For example pass a <ul> to have items sorted.
*  direction       sdAscending     Integer     no   Direction to sort in, valid entries are sdAscending and sdDescending.
*  type            stAlpha         Integer     no   Type of date being sorted. Use stAlpha for strings, stNumeric for numbers.
*  collection      null            String      no   A sub object to sort on. For example, if nodeList was a colletion of 
*                                                   <tr>s, collection can be "cells" to sort a particular column.
*  collectionIndex 0               Integer     no   If a collection was specified, this is the index within it.  For example,
*                                                   if nodeList is "rows" and collection is "cells", collectionIndex would be
*                                                   the column index.
*  low             0               Integer     no   Index to start sorting from. For example, to skip the first item in the 
*                                                   list, pass 1.
*  high            nodelist.length Integer     no   Index to sort up to.
*  compare         defaultCompare  Function    no   Compare function to use. Standard Array.sort() compare method.
*
*/

//------------------------------------------------------------------------------
sdAscending  = 0;
sdDescending = 1;
stAlpha      = 0;
stNumeric    = 1;
stDateTime   = 2;
stBoolean    = 3;
//------------------------------------------------------------------------------
domapi.nodeSort = function(arg){//c,dir,type,obj,objx,cmp_fn,lo,hi){
  var n      = domapi._private.nodesort;
  var c      = arg["nodelist"];
  if(c == null || c.length<2)return;
  if(n.busy)return 0;
  n.busy     = true;
  var i;
  var n      = domapi._private.nodesort;
  var p      = c[0].parentNode;
  var a      = new Array(c.length-1);
  var lo     = domapi.rInt(arg["low"],0);
  var hi     = domapi.rInt(arg["high"],c.length);
  n.dir      = domapi.rInt(arg["direction"],sdAscending);
  n.obj      = arg["collection"];
  n.objx     = domapi.rInt(arg["collectionIndex"]);
  n.type     = arg["type",stAlpha];
  var cmp_fn = arg["compare"];
  if(cmp_fn == null)cmp_fn = n.defaultCompare;
  // place pointers to all elements in the collection into our array.
  for(i=lo;i<hi;i++)a[i-lo] = c[i];
  // optimization, convert all values first - based on type
  for(i=0;i<a.length;i++)
    if(typeof a[i] == "object"){
      if(!domapi.isNil(n.obj))
        a[i]._sortValue = a[i][n.obj][n.objx].innerText;
      else
        a[i]._sortValue = a[i].innerText;
      switch(n.type){
        case stAlpha :
          a[i]._sortValue = a[i]._sortValue.toLowerCase();
          break;
        case stBoolean :
          a[i]._sortValue = a[i]._sortValue.toLowerCase();
          a[i]._sortValue = (a[i]._sortValue == "true" || a[i]._sortValue == "yes" || a[i]._sortValue == true )?true:false;
          break;
        case stNumeric :
          a[i]._sortValue = parseFloat(sysutils.filterChars(a[i]._sortValue,","));
          break;
        case stDateTime :
          a[i]._sortValue = sysutils.isDate(a[i]._sortValue);
          break;
      }
    }else a[i]._sortValue = 0;
  // sort it
  a.sort(cmp_fn);
  // put em back
  for(i=lo;i<hi;i++)//if(c[i] != a[i])
    domapi.swapNodes(a[i-lo], c[i]);
//    c[i].swapNode(a[i-lo]);
  n.busy = false;
  return 1;
};
//------------------------------------------------------------------------------
// private members
//------------------------------------------------------------------------------
domapi._private.nodesort = {};
//------------------------------------------------------------------------------
domapi._private.nodesort.defaultCompare = function(A,B){
  var n = domapi._private.nodesort;
  var a = A._sortValue;
  var b = B._sortValue;
  if(n.dir == sdAscending)return(a == b)?0:(a > b)?1:-1;
  else                    return(a == b)?0:(a < b)?1:-1;
};
//------------------------------------------------------------------------------