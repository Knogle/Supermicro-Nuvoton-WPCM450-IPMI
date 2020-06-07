//------------------------------------------------------------------------------
// DomAPI Dataset Object
// D. Kadrioski 9/23/2003
// (c) Nebiru Software 2001-2005
//------------------------------------------------------------------------------
/*
  Working notes.
  Structure is mostly like HTML tables (which is what I expect most consumers to
  resemble)

  Dataset has "cols" and "rows".  "rows" have "cells".
  Data is stored in "cells" in "text" and "value".
  "value" is mandatory, "text" is optional.
  consumer will look to "text" first, then default to "value" if not present.
  for instance, text for cell could be "apple" and value could be "18".  apple
  is displayed even though the cell value is 18 behind the scenes.

  fieldType only applies to "value", "text" is *usually* going to be a string since
  "text" is what is used for display.

  sort() works on "value" only and uses fieldType when performing comparisons

  In all places that a function takes an "arg", ANY properties in it are added to the
  object.  Certain "key" properties are asserted right off the bat though.
  Key properties:

  col.text       // fieldName used if missing
  col.fieldName  // text      used if missing
  col.fieldType

  row.cell.text  // value used if missing
  row.cell.value // required

  don't add prototypes to row, col or cell.. only domapi.Dataset.
  only the dataset maintains its identity when the load functions are used

*/
//------------------------------------------------------------------------------
// field types
ftUnknown = 0;
ftString  = 1;
ftInteger = 2;
ftBoolean = 3;
ftFloat   = 4;
ftDate    = 5;

// control types
ctUnknown       = 0;
ctCustom        = 1;
ctText          = 2;
ctCheckbox      = 3;
ctSelect        = 4;
ctCombobox      = 5;
ctDatepicker    = 6;
ctBrowseButton  = 7;

domapi.loadUnit("csv");
domapi.loadUnit("json");
domapi.loadUnit("xmlcore");
domapi.loadUnit("sysutils");
domapi._private.Dataset = {};
//------------------------------------------------------------------------------
domapi.Dataset = function(arg){
  this.cols = [];
  this.rows = [];
  for(var i in arg)
    this[i] = arg[i];
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Dataset object
//------------------------------------------------------------------------------
domapi.Dataset.prototype.defaultColWidth    = 120;
domapi.Dataset.prototype.defaultRowHeight   = domapi.theme.skin.metrics.dropdown.h;
domapi.Dataset.prototype.defaultMinColWidth = 20;
domapi.Dataset.prototype.clear = function(){
  this.rows = [];
  this.dataChanged();
};
domapi.Dataset.prototype.toString = function(){return "[object Dataset]";};

//------------------------------------------------------------------------------
domapi.Dataset.prototype.assert = function(){
  // makes sure we have values or defaults for our key fields.
  // this is especially important after a load operation
  if(this.inUpdate)return;
  var i,j,c,r;
  for(i=0;i<this.cols.length;i++){
    c = this.cols[i];
    c.w           = c.w         || this.defaultColWidth;
    c.minwidth    = c.minwidth  || this.defaultMinColWidth;
    c.textAlign   = c.textAlign || "left";
    c.headerAlign = c.headerAlign || c.textAlign;
    c.sortable    = domapi.rBool(c.sortable,true);
    c.fieldName   = domapi.rVal(c.fieldName, 'Column ' + i);
    c.text        = domapi.rVal(c.text, c.fieldName);
    c.fieldType   = domapi.rInt(c.fieldType,   ftUnknown);
    c.controlType = domapi.rInt(c.controlType, ctUnknown);
    if(c.sorted)this.sortColIndex = i;
  }
  for(j=0;j<this.rows.length;j++){
    r = this.rows[j];
    if (r) {
    //r.h = r.h || this.defaultRowHeight;
      r.h = domapi.rInt(r.h, this.defaultRowHeight);
      this.assertRow(r);
    }
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.assertRow = function(r){
  var c = r.cells;
  var C = this.cols;
  while(c.length < C.length)
    c.push(new domapi.DatasetCell({}));
  if(c.length > C.length) c.length = C.length;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.beginUpdate = function(){
  this.inUpdate = true;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.endUpdate = function(){
  this.inUpdate = false;
  this.dataChanged();
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.dataChanged = function(){
  if(!this.inUpdate){
    this.assert();
    if(this.owner && this.owner._dataChanged)this.owner._dataChanged();
    if(this.ondatachanged)this.ondatachanged();
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.reset = function(silent){
  this.rows = [];
  this.cols = [];
  if(!silent)this.dataChanged();
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.cellByIndex = function(r,c){
  return this.rows[r].cells[c];
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.visibleCol = function(idx){
  // converts a visible index to a physical one
  var r = -1;
  var c = this.cols;
  for(var i=0;i<c.length;i++){
    if(!c[i].hidden)r++;
    if(r == idx)return i;
  }  
  return -1;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.visibleCols = function(){
  var R = [];
  var c = this.cols;
  for(var i=0;i<c.length;i++)
    if(!c[i].hidden)R.push(i);
  return R;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.visibleRows = function(){
  var R = [];
  var r = this.rows;
  for(var i=0;i<r.length;i++)
    if(!r[i].hidden)R.push(i);
  return R;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.visibleRowcount = function(){  
  return this.visibleRows().length;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.getVisibleRowsIndex = function(index, startFrom){
  if(arguments.length == 1)startFrom = 0;  
  var R = this.rows;
  var rl= R.length;
  var r = startFrom - 1;
  for(var i=startFrom;i<rl;i++){
    if(!R[i].hidden)r++;
    if(r == index)return i;
  }
  return r;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.visibleColsWidth = function(){
  var r = 0;
  var a = this.visibleCols();
  for(var i=0;i<a.length;i++)
    r += parseInt(this.cols[a[i]].w);
  return r;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.visibleRowTop = function(index){
  // locate the pixel top of a given row
  var r = 0;
  var a = this.visibleRows();
  for(var i=0;i<index;i++)
    r += this.rows[a[i]].h;
  return r;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.visibleRowsHeight = function(){
  var r = 0;
  var a = this.visibleRows();
  for(var i=0;i<a.length;i++)
    r += this.rows[a[i]].h;
  return r;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.sort = function(colName,dir){
  var a = this.rows;
  for(var i=0;i<this.cols.length;i++)
    if(this.cols[i].fieldName == colName){
      var p = domapi._private.Dataset;
      p.sortColIndex = i;
      p.sortDir      = dir;
      p.obj          = this;
      p.fieldType    = this.cols[i].fieldType;
      p.dateSeed     = new Date(1,1,1901);

      // optimization, convert all values first - based on type
      for(i=0;i<a.length;i++){
        a[i]._sortValue = a[i].cells[p.sortColIndex].value;
        switch(p.fieldType){
          case ftUnknown :
            a[i]._sortValue = a[i]._sortValue.toLowerCase();
            break;
          case ftString :
            a[i]._sortValue = a[i]._sortValue.toLowerCase();
            break;
          case ftBoolean :
            a[i]._sortValue = String(a[i]._sortValue).toLowerCase().trim();
            if(a[i]._sortValue == "")a[i]._sortValue = "false";
            a[i]._sortValue = (a[i]._sortValue == "true" || a[i]._sortValue == "yes" || a[i]._sortValue == true )?true:false;
            break;
          case ftFloat :
            a[i]._sortValue = parseFloat(sysutils.filterChars(a[i]._sortValue,","));
            break;
          case ftInteger :
            a[i]._sortValue = parseInt(sysutils.filterChars(a[i]._sortValue,","));
            break;
          case ftDate :
            a[i]._sortValue = sysutils.isDate(a[i]._sortValue);
            break;
        }
      }

      a.sort(this._sortCompare);
      this.sortColIndex = i;
      this.sortDir      = dir;
      //this.dataChanged();
      if(this.onsort)this.onsort(colName,dir);
      return i;
    }
  return -1; // col not found  
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype._sortCompare = function(A,B){
  var p = domapi._private.Dataset;
  var a = A._sortValue;
  var b = B._sortValue;
  if(p.sortDir)return(a == b)?0:(a < b)?1:-1;
  else         return(a == b)?0:(a > b)?1:-1;
  
  /*
  var aa = a.cells[p.sortColIndex].value;
  var bb = b.cells[p.sortColIndex].value;
  switch(p.fieldType){
    case ftString  :
    case ftUnknown :
      aa = aa.toLowerCase();
      bb = bb.toLowerCase();
      break;
    
    case ftBoolean :
      aa = aa.toLowerCase();
      bb = bb.toLowerCase();
      aa = (aa == "true" || aa == "yes" || aa == true )?true:false;
      bb = (bb == "true" || bb == "yes" || bb == true )?true:false;
      break;
    case ftInteger :
    
      aa = parseInt(aa);
      bb = parseInt(bb);
      break;
    case ftFloat   :
      aa = parseFloat(aa);
      bb = parseFloat(bb);
      break;
    case ftDate    :
      aa = sysutils.daysSince(p.dateSeed,sysutils.isDate(aa));
      bb = sysutils.daysSince(p.dateSeed,sysutils.isDate(bb));
      break;
  }
  //domapi.dump([ftString,p.fieldType,aa,bb])
  var r = (aa == bb)?0:(aa > bb)?1:-1;
  if(p.sortDir)r = 0 - r; // invert
  return r;*/
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.displayText = function(r,c){
  try{
    var cc = this.cellByIndex(r,c);
    if(cc){
      if(typeof cc.text != "undefined")
        return cc.text;
      else if(typeof cc.value != "undefined")
        return cc.value;
      else
        return 'nothing to display';
    }else{
      return 'displayText error: r=' + r + ', c=' + c;
    }
  }catch(E){
    var s = 'Error in domapi.Dataset.prototype.displayText(r='+r+', c='+c+');\n'+E.message;
    if(domapi.debug)dump(s);else throw new Error(s);
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.getValue = function(r,c){
  try{
    var cc = this.cellByIndex(r,c);
    if(cc){
      if(typeof cc.value != "undefined")
        return cc.value;
      else if(typeof cc.text != "undefined")
        return cc.text;
      else
        return 'no_value';
    }else{
      return 'getValue error';
    }
  }catch(E){
    var s = 'Error in domapi.Dataset.prototype.getValue(r='+r+', c='+c+');\n'+E.message;
    if(domapi.debug)dump(s);else throw new Error(s);
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.setValue = function(r,c,value){
  try{
    var cc = this.cellByIndex(r,c);
    if(cc){
      cc.value = value;
      this.dataChanged();
    }else{
      return 'setValue error';
    }
  }catch(E){
    var s = 'Error in domapi.Dataset.prototype.setValue(r='+r+', c='+c+');\n'+E.message;
    if(domapi.debug)dump(s);else throw new Error(s);
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.setText = function(r,c,value){
  try{
    var cc = this.cellByIndex(r,c);
    if(cc){
      cc.text = value;
      this.dataChanged();
    }else{
      return 'setValue error';
    }
  }catch(E){
    var s = 'Error in domapi.Dataset.prototype.setValue(r='+r+', c='+c+');\n'+E.message;
    if(domapi.debug)dump(s);else throw new Error(s);
  }
};
//------------------------------------------------------------------------------
//domapi.Dataset.prototype.cellByName = function(r,n){
//  return this.rows[r].data[n];
//};
//------------------------------------------------------------------------------
//  col stuff
//------------------------------------------------------------------------------
domapi.Dataset.prototype.getColcount = function(){
  return this.cols.length;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.setColcount = function(i){
  while(this.cols.length < i)
    this.addCol();
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.addCol = function(arg){
  var C = new domapi.DatasetCol(arg);
  try{
    this.cols.push(C);
    this.dataChanged();
    if(this.onaddcol)this.onaddcol(C);
    return C;
  }finally{
    C = null;
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.insertCol = function(i,arg){
  var C = new domapi.DatasetCol(arg);
  try{
    this.cols.insert(C);
    this.dataChanged();
    if(this.oninsertcol)this.oninsertcol(C);
    return C;
  }finally{
    C = null;
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.deleteCol = function(i){
  this.cols.deleteItem(i);
  this.dataChanged();
  if(this.ondeletecol)this.ondeletecol(i);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.swapCols = function(i, j){
  var r = this.rows;
  this.cols.swap(i,j);
  for(var k=0;k<r.length;k++)
    r[k].cells.swap(i,j);
  this.dataChanged();
  if(this.onswapcols)this.onswapcols(i,j);
};
//------------------------------------------------------------------------------
// row stuff
//------------------------------------------------------------------------------
domapi.Dataset.prototype.getRowcount = function(){
  return this.rows.length;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.setRowcount = function(i){
  while(this.rows.length < i)
    this.addRow();
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.addRow = function(arg){
  var R = new domapi.DatasetRow(arg);
  try{
    this.rows.push(R);
    this.assert();
    this.dataChanged();
    if(this.onaddrow)this.onaddrow(R);
    return R;
  }finally{
    R = null;
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.insertRow = function(i,arg){
  var R = new domapi.DatasetRow(arg);
  try{
    this.rows.insert(i, R);
    this.dataChanged();
    if(this.oninsertrow)this.oninsertrow(R);
    return R;
  }finally{
    R = null;
  }
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.deleteRow = function(i){
  this.rows.deleteItem(i);
  this.dataChanged();
  if(this.ondeleterow)this.ondeleterow(i);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.swapRows = function(i, j){
  this.rows.swap(i,j);
  this.dataChanged();
  if(this.onswaprows)this.onswaprows(i,j);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.findSelected = function(j){
  for(var i=j;i<this.rows.length;i++)
    if(this.rows[i].selected){
      this._selectedIndexor = i+1;
      return i;
    }
  return -1;
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.firstSelected = function(){
  return this.findSelected(0);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.nextSelected = function(){
  this._selectedIndexor = domapi.rInt(this._selectedIndexor, 0);
  return this.findSelected(this._selectedIndexor);
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Col object
//------------------------------------------------------------------------------
domapi.DatasetCol = function(arg){
  arg["text"        ] = domapi.rVal( arg["text"       ], "col");
  arg["fieldName"   ] = domapi.rVal( arg["fieldName"  ], null );
  arg["fieldType"   ] = domapi.rVal( arg["fieldType"  ], ftUnknown);
  arg["controlType" ] = domapi.rVal( arg["controlType"], ctUnknown);
  arg["w"           ] = domapi.rInt( arg["w"          ], domapi.Dataset.prototype.defaultColWidth   );
  arg["minWidth"    ] = domapi.rInt( arg["minWidth"   ], domapi.Dataset.prototype.defaultMinColWidth);
  arg["maxWidth"    ] = domapi.rInt( arg["maxWidth"   ], null );
  arg["hidden"      ] = domapi.rBool(arg["hidden"     ], false );
  arg["sortable"    ] = domapi.rBool(arg["sortable"   ], true );
  arg["editable"    ] = domapi.rBool(arg["editable"   ], false);
  arg["sorted"      ] = domapi.rBool(arg["sorted"     ], false);
  arg["textAlign"   ] = domapi.rVal( arg["textAlign"  ], "left");
  arg["headerAlign" ] = domapi.rVal( arg["headerAlign"], arg["textAlign" ]);
  for(var i in arg) // add in everything in arg
    this[i] = arg[i];
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Row object
//------------------------------------------------------------------------------
domapi.DatasetRow = function(arg){
  if(!arg.cells)arg.cells = [];
  arg["h"      ] = domapi.rInt( arg["h" ], domapi.Dataset.prototype.defaultRowHeight);
  for(var i in arg) // add in everything in arg
    this[i] = arg[i];
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Cell object
//------------------------------------------------------------------------------
domapi.DatasetCell = function(arg){
  arg["text"   ] = domapi.rVal( arg["text"   ], null);
  arg["value"  ] = domapi.rVal( arg["value"  ], null);
  for(var i in arg) // add in everything in arg
    this[i] = arg[i];
};
//------------------------------------------------------------------------------


//******************************************************************************
// utility functions
//******************************************************************************

//------------------------------------------------------------------------------
// JSON support
//------------------------------------------------------------------------------
domapi.Dataset.prototype.loadFromJson = function(json,silent){
  this.reset(silent);
  for(var i in json)
    this[i] = json[i];
  this.dataChanged();
  if(this.onloadfromjson)this.onloadfromjson();
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.loadFromJsonUrl = function(url,silent){
  var j = domapi.urlToJson(url);
  this.loadFromJson(j,silent);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.saveToJson = function(){
  return {cols:this.cols, rows:this.rows};
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// CSV support
//------------------------------------------------------------------------------
domapi.Dataset.prototype.loadFromCsv = function(csv,silent,noHeader){
  // first line is assumed to be header strings, unless noHeader is true
  this.reset(silent);
  var A = domapi.csvToArray(csv);
  if(A.length){
    var i,j,top,R;
    if(noHeader){
      for(i=0;i<A[0].length;i++)
        this.cols.push({text:'Col'+i, fieldName:'Col'+i});
    }else{
      for(i=0;i<A[0].length;i++)
        this.cols.push({text:A[0][i], fieldName:A[0][i]});
    }
    top = noHeader?0:1;
    for(i=top;i<A.length;i++){
      R = {cells:[]};
      for(j=0;j<A[i].length;j++)
        R.cells.push({text:A[i][j], value:A[i][j]});
      this.rows.push(R);
    }
  }
  this.dataChanged();
  if(this.onloadfromcsv)this.onloadfromcsv();
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.loadFromCsvUrl = function(url,silent,noHeader){
  var s = domapi.getContent(url);
  this.loadFromCsv(s,silent,noHeader);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.saveToCsv = function(noHeader){
  var r = "";
  var i,j,A,top;
  if(!noHeader){
    A = [];
    for(i=0;i<this.cols.length;i++)A.push(this.cols[i].fieldName);
    r += domapi.arrayToCsvLine(A);
  }  
  for(i=0;i<this.rows.length;i++){
    if(i || !noHeader)r += "\n";
    A = [];
    for(j=0;j<this.cols.length;j++)
      A.push(this.getValue(i,j));
    r += domapi.arrayToCsvLine(A);
  }
  return r;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// XML support
//------------------------------------------------------------------------------
domapi.Dataset.prototype.loadFromXml = function(xmlObj, nodeNm, silent){
  this.reset(silent);
  var C = xmlObj.documentElement.selectNodes("//" + nodeNm);
  if(C.length != 1){
    throw new Error(domapi.formatGetString('ERR_MISSING_XML_ROOT', [nodeNm]));
    return false;
  }
  if(this.onloadfromxml)this.onloadfromxml();
  return this.loadFromXmlNode(C[0]);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.loadFromXmlUrl = function(url,nodeNm,silent){
  var xmlObj   = domapi.xml.getDomDocument();
  xmlObj.async = false;
  xmlObj.load(   url);
  if(this.onloadfromxml)this.onloadfromxml(); 
  return this.loadFromXml(xmlObj, nodeNm, silent);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.loadFromXmlNode = function(root){
  var j = domapi.xmlNodeToJson(root);
  this.loadFromJson(j, true); // true for silent
  var C = this.cols;
 // for(var i=0;i<C.length;i++)
//    C[i].w = parseInt(C[i].w);
};
//------------------------------------------------------------------------------
domapi.Dataset.prototype.saveToXml = function(rootNm, pretty){
  rootNm = domapi.rVal(rootNm, "dataset");
  return domapi.jsonToXml(this,rootNm,pretty);
};
//------------------------------------------------------------------------------