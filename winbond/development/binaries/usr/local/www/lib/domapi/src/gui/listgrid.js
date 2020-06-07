//==============================================
// DomAPI Listgrid Component
// D. Kadrioski 11/03/2001, 10/09/2002, 5/16/2004
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit("dataset"   );
domapi.loadUnit("customdrag");
domapi.registerComponent("listgrid");

//domapi.trace = true;
if(domapi.trace)dump("Trace is on.");

domapi.Listgrid = function(arg){return domapi.comps.listgrid.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.listgrid.constructor = function(arg){
  var e = domapi.Component(arg,"listgrid");
  try{
    e.data               = new domapi.Dataset({owner:e});
    e._divData           = document.createElement("DIV");
    e._divHeader         = document.createElement("DIV");
    e._divRowbar         = document.createElement("DIV");
    e._divUpperLeftSpace = document.createElement("DIV");
    e._goboContainer     = document.createElement("DIV");
    e._gobo              = document.createElement("DIV");
    e._state = { // cached properties
      sbw                  : domapi.scrollBarWidth(),
      inresize             : false,
      inmove               : false,
      inedit               : false,
      toprow               : 0,
      rowbarwidth          : 0,
      visiblerows          : 0,
      viewablerows         : 0,
      visiblecols          : [],
      headerheight         : 0,
      visiblerowsheight    : 0,
      visiblecolswidth     : 0,
      scrolltop            : 0,
      scrollleft           : 0,
      lastheaderclip       : [],
      lastdataclip         : [],
      vertscrollbarvisible : false,
      horzscrollbarvisible : false,
      viewportw            : arg["w"],
      viewporth            : arg["h"]
    };
    e._divRowbar._datastack        = "";
    e._divRowbar._datastack.count  = 0;
    e._divData.className           = "DA_LISTGRID_DATA";
    e._divHeader.className         = "DA_LISTGRID_HEADER";
    e._divRowbar.className         = "DA_LISTGRID_ROWBAR";
    e._divUpperLeftSpace.className = "DA_LISTGRID_UPPERLEFT_SPACE";
    e._goboContainer.className     = "DA_LISTGRID_GOBO_CONTAINER";
    e._divHeader.DA_TYPE           = "LISTGRID_HEADER";
    e._divUpperLeftSpace.DA_TYPE   = "LISTGRID_UPPERLEFT_SPACE";
    e._divRowbar.DA_TYPE           = "LISTGRID_ROWBAR";
    e.setGridlines(e.gridlines);
    e.cols              = e._divHeader.childNodes;
    e.selected          = []; // indexes
    e.currentRow        = -1;
    e.currentCol        = -1;

    e._goboContainer.appendChild(e._gobo);
    e.appendChild(e._divHeader);
    e.appendChild(e._divData);
    e.appendChild(e._divRowbar);
    e.appendChild(e._divUpperLeftSpace);
    e.appendChild(e._goboContainer);
    //e._divData.style.background="red"
    //e._goboContainer.style.background="blue"
    //e._gobo.style.background="yellow"

    e._ghost = domapi.Elm({parent:e,x:0,y:0,w:50,h:domapi.theme.skin.metrics.headerbar.h});
    e._ghost.setAlpha(80);
    e._ghost.setZ(1000);  
    e._ghost.className = "DA_LISTGRID_GHOST";
    //e._ghost.hide();
    e._ghost.style.display = "none";
    e._ghost.showing       = false;

    e._resizebar = domapi.Elm({parent:e,x:0,y:0,w:1,h:100});
    e._resizebar.setZ(20);
    e._resizebar.style.border          = "0px dashed black";
    e._resizebar.style.borderLeftWidth = "1px";
    e._resizebar.showing               = false;
    e._resizebar.hide();

    var p = domapi._private.listgrid;
    //  domapi.addEvent(e._goboContainer, "scroll", p.doscroll); moz ignores this(!)
    e._doscroll               = p._doscroll;
    e._goboContainer.onscroll = p.doscroll;
    domapi.addEvent(e._divHeader, "mouseover",  p.doheadermouseover);
    domapi.addEvent(e._divHeader, "mouseout",   p.doheadermouseout);
    domapi.addEvent(e._divHeader, "mousemove",  p.doheadermousemove);
    domapi.addEvent(e._divHeader, "mousedown",  p.doheadermousedown);
    domapi.addEvent(e._divHeader, "mouseup",    p.doheadermouseup);
    domapi.addEvent(e, "mouseup",    p.dodataclick);
    domapi.addEvent(e, domapi.isIE?"mousewheel":"DOMMouseScroll", p.domousewheel);
    domapi.Elm({ref:e._divHeader});
    e._divHeader.doAllowDrag = true;
    e._divHeader.dragIcon    = "none";
    e._divHeader.turnOnCustomDrag({});
    e._divHeader.ondragallow = p.ondragallow;
    e._divHeader.ondragstart = p.ondragstart;
    e._divHeader.ondragmove  = p.ondragmove;
    e._divHeader.ondragend   = p.ondragend;
    
    if(domapi.debug){
      e.dumpState         = function(){return domapi._private.listgrid.dumpState(this)};
      e.dumpStateNoFormat = function(){return domapi._private.listgrid.dumpStateNoFormat(this)};
    }

//    e.dragIcon = "nope";
    if(e.doAllowDrag)
      e.turnOnCustomDrag({});

    domapi._finalizeComp( e);
    domapi.addEvent(domapi.isIE?e:e._daTabEdit, "keydown", p.dokeydown);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._free = function(){
  for(var i=0;i<this.cols.length;i++)
    this.cols[i].editControl = null;
  this._ghost             = null;
  this.data               = null;
  this._divData           = null;
  this._divHeader         = null;
  this._divRowbar         = null;
  this._divUpperLeftSpace = null;
  this._goboContainer     = null;
  this._gobo              = null;
  _freeObject(this._state);
  this._state             = null;
  this._resizebar         = null;
  this.cols               = null;
  this.selected           = null;
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._draw = function(){this.listgridDraw();};
//------------------------------------------------------------------------------
domapi.comps.listgrid.listgridDraw = function(){
  if(domapi.trace)dump(this.toString()+'.listgridDraw()');
  var t         = domapi.theme;
  var s         = this.style;
  var b         = this.doBorder?t.border.width:0;
  try{
    this.setB(      b);  // set border width *before* border style!!
    s.borderStyle = this.doBorder?t.border.solid:"none";
    s.borderColor = t.border.getInset();
    if(this.doLedgerMode)
      domapi.css.addClass(this, "DA_LISTGRID_LEDGER");
    else
      domapi.css.removeClass(this, "DA_LISTGRID_LEDGER");
  }finally{
    t = null;s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._layout = function(w,h){
  if(domapi.trace)dump(this.toString()+'._layout(' + w + ', ' + h + ')');
  this._dataChanged(); // causes metrics to be calculated
  var C, i, c, s;
  var _h = h; var _w = w;
  var S  = this._state;
  var H  = this._divHeader;
  var C  = this._goboContainer;
  var R  = this._divRowbar;
  var D  = this._divData;
  var U  = this._divUpperLeftSpace;
  var rw = S.rowbarwidth;
  var hh = S.headerheight;
  try{
    H.style.height  = hh - ((domapi.isIE && domapi.isStrict && hh > 2) || (domapi.isKHTML)?2:0) + "px";
    R.style.width   = rw - ((domapi.isIE && domapi.isStrict && rw > 2) || (domapi.isKHTML)?2:0) + "px";
    U.style.width   = rw + "px";
    U.style.height  = hh + "px";
    U.style.display = (this.doShowHeader && this.doShowRowbar)?"":"none";
    R.style.display = this.doShowRowbar?"":"none";
    H.style.display = this.doShowHeader?"":"none";

    // endupdate calls this method
    for(i =0;i<D.childNodes.length;i++){
      C = D.childNodes[i];
      domapi.disallowSelect(C);
      if(C._datastack != ""){
        C.innerHTML += C._datastack;
        C._datastack       = "";
        C._datastack_count = 0;
      }
    }
    if(R._datastack != ""){
      R.innerHTML += R._datastack;
      R._datastack = "";
    }

    if(!this._inUpdate){
      var C = D.childNodes;
      if(C.length){ // there is at least one col
        c = C[C.length-1]; // last col
        s = this._gobo.style;
        w = S.visiblecolswidth + (domapi.isIE?(domapi.isStrict?1:0):2);
        S.viewportw   = _w;
        s.width       = w + "px";
        D.style.width = w + "px";

        if(c.childNodes.length){ // there is at least one row
          h = S.visiblerowsheight + hh + "px";
          s.height       = h;
          D.style.height = h;
          if(this.doVirtualMode)
            S.viewporth = _h;
          else
            S.viewporth = _h; //parseInt(h);
        }
      }
      this._layoutScroll();
    }

    //2005-03-31 Henry Tam
    //change the default selection behavior, no selection by default
    if(!this.doAllowNoSelect && this.currentRow != -1 && C.length){
      if(!this._ontimedefaultselect)
        this.selectRow(this.currentRow, true, true);
      this._ontimedefaultselect = true;
    }else if(!this.doAllowNoSelect && this.currentRow == -1 && C.length){
      this.currentRow = 0;
      this.selectRow(0, true, true);
    }//else this._showRowPersistentEditors();
    domapi._private.listgrid.scanForSelections.apply(this);
  }finally{
    S  = null;
    H  = null;
    C  = null;
    R  = null;
    D  = null;
    U  = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._layoutScroll = function(){
  if(domapi.trace)dump(this.toString()+'._layoutScroll()');
  var S  = this._state;
  var V  = this.doVirtualMode;
  var H  = this._divHeader;
  var C  = this._goboContainer;
  var R  = this._divRowbar;
  var D  = this._divData;
  var rw = S.rowbarwidth;
  var hh = S.headerheight;
  try{
    D.style.left  = rw - C.scrollLeft       + "px";
    D.style.top   = hh - (V?0:C.scrollTop)  + "px";
    R.style.top   = hh - (V?0:C.scrollTop)  + "px";
    H.style.left  = rw - C.scrollLeft       + "px";
    H.style.width = this._gobo.offsetWidth - (domapi.isIE?0:2) + "px";
    var r = C.scrollLeft + this.offsetWidth  - rw;
    var b = (V?0:C.scrollTop)  + this.offsetHeight - hh;
    if(S.vertscrollbarvisible)r -= (S.sbw +2);
    if(S.horzscrollbarvisible)b -= (S.sbw +2);
    H.style.clip     = "rect(0px, " + r + "px, " + H.offsetHeight + "px, 0px)";
    D.style.clip     = "rect("+(V?0:C.scrollTop)+"px, " + r + "px, " + b + "px, "+C.scrollLeft+"px)";
    S.lastheaderclip = [0, r, H.offsetHeight, 0];
    S.lastdataclip   = [(V?0:C.scrollTop), r, b, C.scrollLeft];
    //if(domapi.trace)dump([(V?0:C.scrollTop), r , b , C.scrollLeft, S.vertscrollbarvisible, S.horzscrollbarvisible])
  }finally{
    S = null;V = null;H = null;C = null;R = null;D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.clear = function(){
  if(domapi.trace)dump(this.toString()+'.clear()');
  this.selectNone();
  this.currentRow = -1;
  this.currentCol = -1;
  this._goboContainer.scrollTop = 0;
  this._state.scrolltop = 0;
//  this._layoutScroll();
  this.data.clear();
  var C = this.cols;
  try{
    //handle editControl
    var c;
    for (var i = C.length -1; i>=0 ; i--) {
      if(C[i].editControl) {
        var c = C[i].editControl;
        if (c.DA_TYPE)
          c.hide();
        else
          c.style.display = "none";
      }
    }
    for(i=0;i<C.length;i++)
      C[i].innerHTML = "";
    this._divRowbar.innerHTML = "";
    this._divHeader.innerHTML = "";
    this._state.toprow = 0;
    //this.refresh();
    for(var i=0;i<this.data.cols.length;i++)
      this.data.cols[i].sorted = false;
    this.data.sortColIndex = -1;
  }finally{
    C = null;
    c = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.beginUpdate = function(){
  if(this._inUpdate)return;
  if(domapi.trace)dump(this.toString()+'.beginUpdate()');
  this._inUpdate     = true;
  this.data.inUpdate = true;
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.endUpdate   = function(){
  if(!this._inUpdate)return;
  if(domapi.trace)dump(this.toString()+'.endUpdate()');
  this.data.inUpdate = false;
  this.data.assert();
  this.assert();
  this._inUpdate = false;
  this.drawAndLayout();
  //alert(this._divData.childNodes[0].offsetHeight)
  //domapi.loadUnit("debugger");

//  dumpProps(this._divData.childNodes[0]);
  //this._divData.childNodes[0].style.position = "relative";
  //this._divData.childNodes[0].style.display = "";
  //alert(this._divData.childNodes[0].innerHTML)
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.assert = function(){
  if(domapi.trace)dump(this.toString()+'.assert()');
  var s, i, j, e, e1, c, C;
  var d = this.data;
  var H = this._divHeader;
  var D = this._divData;
  var p = domapi._private.listgrid;
  var S = this._state;
  var adding = false;
  try{
    d.assert();
    var imgUp   = ' <img src="' + domapi.theme.skin.lg_sortup.src   + '">';
    var imgDown = ' <img src="' + domapi.theme.skin.lg_sortdown.src + '">';

    // make sure we have enough cols
    for(i=0;i<S.visiblecols.length;i++){
      // assert header
      if(i >= H.childNodes.length){
        e = document.createElement("DIV");
        adding = true;
      }else{
        e = H.childNodes[i];
        adding = false;
      }
      e._index    = i; // used in mouseevents
      e.innerHTML = d.cols[S.visiblecols[i]].text;
      if(d.visibleCol(i) == d.sortColIndex)
      e.innerHTML += (d.sortDir==0)?imgUp:imgDown;
      e.DA_TYPE   = "LISTGRID_HEADER_COL";
      e.className = "DA_LISTGRID_HEADER_COL";
      if(adding) H.appendChild(e);

      // assert col
      if(i >= D.childNodes.length){
        e1 = document.createElement("DIV");
        adding = true;
      }else{
        e1 = D.childNodes[i];
        adding = false;
      }
      e1.innerHTML     = "&nbsp;";
      //e1.style.display = "none";  why were we hiding this?  cols were not showing in safari, but were elsewhere -- why????
      e1._index        = D.childNodes.length; // not used yet, maybe in future mouse events
      e1.DA_TYPE       = "LISTGRID_COL";
      e1.className     = "DA_LISTGRID_COL";
      if(adding) D.appendChild(e1);
      p.buildColClass(this, i);
    } 

    // remove extra cols
    // TODO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    this._assertCols();
    this._assertRows();
  }finally{
    d = null;H = null;D = null;S = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._assertCols = function(){
  var i, ii, C, c, e;
  var S = this._state;
  var d = this.data;
  var D = this._divData;
  try{
    for(i=0;i<D.childNodes.length;i++){ // loop all cols
      var ii = d.visibleCol(i);
      C = this.cols[i]; // the physical col
      c = d.cols[ii];      // the data col
      e = C.editControl;
      if(e && e.controlType != c.controlType){
        // current control is not of the correct type - use must have changed it
        e.parentNode.removeChild(e);
        e = null;
        C.editControl = null;
      }
      if(!C.editControl && c.editable && this.doAllowEdit){ // need to create the control
        // create the control, loading units inline as needed
        switch(c.controlType){
          case ctCheckbox      : break; // these are handled as images actually, no edit control needed
          case ctCustom        : break;
          case ctSelect        :
            C.editControl = domapi.Elm({parent:this,type:"SELECT",x:0,y:0,w:50,h:20});
            e = C.editControl;
            //high -6px . set font to fix size to control sel height
            e.style.fontSize = "10px";
            
            //HT: TEST , it take array of string, object with value and text or csv string, should
            //put it somewhere else later on 
            if (c.controlData) {
              var a;
              if (typeof (c.controlData) == "string")
                a = c.controlData.split(",");
              else 
                a = c.controlData;
              var o;
              for (var si = 0; si < a.length; si++) {
                o = document.createElement("OPTION");
                if (typeof (a[si]) == "string") {
                  o.text = a[si];
                  o.value = a[si];
                } else {
                  o.text = a[si].text;
                  o.value = a[si].value;
                  if (a[si].selected)
                  	o.selected = a[si].selected;
                }
                e.add(o)
              }
              o = null;
            }
            e.onclick = function (E) {if (!E)E = window.event; domapi.preventBubble(E);};
            break;
          case ctCombobox      : break;
          case ctDatepicker    :
            domapi.loadUnit("datepicker2");
            C.editControl = domapi.Datepicker2({parent:this,x:0,y:0,w:50,h:20});
            C.editControl.edit.style.borderStyle = "none";
            C.editControl.displayCol = ii;
            break;
          case ctText          :
          case ctUnknown       :
            C.editControl = domapi.Elm({parent:this,type:"INPUT",x:0,y:0,w:50,h:20});
            e = C.editControl;
            e.setAttribute("TYPE","TEXT");
            // e.onkeydown = function (E) {if(!E) E=window.event; var k = domapi.isIE?E.keyCode:E.which;/* if (k!=13) domapi.preventBubble(E);*/};
            e.onclick = function (E) { if (!E) E=window.event; domapi.preventBubble(E);};
            //e.onblur = function(E) { if(!E)E=window.event;var r = domapi.findTarget(E,"LISTGRID"); if(r)r.commitEdit(); domapi.preventBubble(E, false);};
            break;
          case ctBrowseButton    :
            //once speedbutton border problem is solved, this control should base on that.
            domapi.assertUnit("button");
            C.editControl = domapi.Button({parent:this,x:0,y:0,w:2,h:2,text:"...",tabIndex:-1});
          
            //HT:another test
            //C.editControl = domapi.Elm({parent:this,type:"BUTTON",x:0,y:0,w:2,h:2,text:"..."});
            //C.editControl.setText("...");
          
            //HT: speedbutton border growth when row over, didn't happen in it's own test page...
            //domapi.assertUnit("speedbutton");
            //C.editControl = domapi.Speedbutton({parent:this, x : 0, y : 0,w:16,h:16, hint : "Browse ...", text : "..." });
            //e = C.editControl;
            break;
        }
        if(C.editControl){
          e = C.editControl;
          e.controlType = c.controlType;
          //e.style.font  = domapi.theme.fonts.window.asString();
          e.setB(0);
          //e.setZ(this._divData.style.zIndex+11);
          e.hide();
        }
      }
      domapi._private.listgrid.buildColClass(this, i);
    }
  }catch(E){
  }finally{
    S = null;d = null;D = null;C = null;c = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._assertRows = function(){
  if(domapi.trace)dump(this.toString()+'._assertRows()');
  // only fill in missing cells
  var rv = this._state.viewablerows; // d.rows.length; // this can change later in virtual mode
  var have, needed, C, odd, c, s, i;
  var d = this.data;
  var D = this._divData;
  var R = this._divRowbar;
  var S = this._state;
  try{
    for(i=0;i<D.childNodes.length;i++){ // loop all cols
      var ii = d.visibleCol(i);
      C      = D.childNodes[i]; // the col
      if(C.innerHTML == "&nbsp;" && ((this.doVirtualMode?rv:this._state.visiblerows) > 0)){
        C.innerHTML     = "";
        C.style.display = "";
      }
      if(domapi.isKHTML && C.childNodes.length == 1){
        // safari would sometimes register one blank textnode at the start of loading
        // if it reports there is one childnodes but also says there are no divs, clear the nodes
        // else our counts of needed elements are off by one
        if(C.getElementsByTagName("DIV").length == 0)C.innerHTML = "";
      }
      have   = C.childNodes.length;
      needed = (this.doVirtualMode?rv:this._state.visiblerows) - have;
      C._datastack_count = 0;
      C._datastack       = "";
      for(j=C.childNodes.length;j<needed;j++){ // loop missing rows for this col
        if(!this._inUpdate){
          odd = (D.childNodes.length % 2 == 0);
          c   = "DA_LG_" + this.id + "_ROW" + D.childNodes.length + " DA_LG_" + this.id + "_CELL_" + i +"_" +  D.childNodes.length;
        }else{
          odd = (C._datastack_count % 2 == 0);
          c   = "DA_LG_" + this.id + "_ROW" + C._datastack_count + " DA_LG_" + this.id + "_CELL_" + i +"_" + C._datastack_count;
        }
        //if(domapi.trace)dump('data.displayText('+j+','+i+')');
        s = '<div class="DA_LISTGRID_CELL ' + c +' ' +
                (odd?"DA_LISTGRID_ROW_ODD":"DA_LISTGRID_ROW_EVEN") + '">' + this._getDisplayText(j, ii) + '&nbsp;</div>';
        if(!this._inUpdate)
          D.innerHTML += s;
        else{
          C._datastack += s;
          C._datastack_count++;
        }
      }
    }

    // fill in missing rowbars
    R._datastack_count = 0;
    R._datastack       = "";
    for(j=R.childNodes.length;j<needed;j++){
      s = '<div class="DA_LISTGRID_ROWBAR_CELL">&nbsp;</div>';
      if(!this._inUpdate)
        R.innerHTML += s;
      else R._datastack += s;
    }
  }finally{
    d = null;D = null;R = null;S = null;C = null;
  }
};
//------------------------------------------------------------------------------
/*domapi.comps.listgrid._assertCellEditor = function(col){
  if(domapi.trace)dump(this.toString()+'._assertCellEditor('+col+') <--');
  var i,e;
  var d = this.data;
  for(i=0;i<d.cols.length;i++)
    if(this.cols[i]){
      e = this.cols[i].editControl;
      if(e){
        if(i != col)e.style.display = "none";
        else
          this.editCell();
      }
    }
  if(domapi.trace)dump(this.toString()+'._assertCellEditor('+col+') -->');
};*/
//------------------------------------------------------------------------------
domapi.comps.listgrid._showRowPersistentEditors = function(){
  if(domapi.trace)dump(this.toString()+'._showRowPersistentEditors() <--');
  var i,e;
  var d = this.data;
  try{
    for(i=0;i<d.cols.length;i++)
      if(this.cols[i]){
        e = this.cols[i].editControl;
        if(e && e.tagName != "INPUT")
          this._positionCellEditor(this.currentRow,i);
      }
    if(domapi.trace)dump(this.toString()+'._showRowPersistentEditors() -->');
  }finally{
    d = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._showRowPersistentEditor = function(col){
  if(domapi.trace)dump(this.toString()+'._showRowPersistentEditor('+col+')');
  if(this.cols[col])try{
    var e = this.cols[col].editControl;
    if(e && e.tagName != "INPUT")
      this._positionCellEditor(this.currentRow,col);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._getDisplayText = function(i, j){
  var d = this.data;
  var v = d.displayText(i, j);
  var C = d.cols[j];
  if(C.controlType == ctCheckbox){
    var m = domapi.theme.skin.metrics.checkbox;
    var s = domapi.theme.skin.path + 'form/single_cb_';
    var vv;
    if (typeof(v) != "string") v = v.toString();
    var vv = v.toUpperCase().trim();

    if(this.enabled && C.editable)
      s += "enabled_";
    else
      s += "disabled_";
    if(vv == "TRUE" || vv == "YES" || vv == "CHECKED")
      s += "checked.gif";
    else
      s += "cleared.gif";
    v = '<img border="0" align="bottom" src="'+s+'" width="'+m.w+'" height="'+m.h+'" onclick="domapi.listgridCheckboxOnClick(this)">';
  }
  return v;
};
domapi.listgridCheckboxOnClick = function(e){domapi._private.listgrid._docbclick(e)}; // for compressor
//------------------------------------------------------------------------------
domapi.comps.listgrid._renderCells = function(){
  if(domapi.trace)dump(this.toString()+'._renderCells()');
  var i, j, C, y, v;
  var d       = this.data;
  var D       = this._divData;
  var S       = this._state;
  var topR    = S.toprow+(S.scrolltop > 0?0:0);
  var bottomR = topR + S.viewablerows;
  try{
    //  if(domapi.isIE && this.doVirtualMode)bottomR = bottomR + 2;
    if(domapi.trace)
      dump(this.toString()+'._renderCells() '+topR+' - '+bottomR + ' - ' + S.viewablerows);
    for(i=0;i<S.visiblecols.length;i++){
      y = 0;
      var C = D.childNodes[i];
      var ii = d.visibleCol(i);
      domapi._private.listgrid.buildColClass(this, i);
      if(C)
        for(j=topR;j<bottomR;j++){
          if(C.childNodes[y]){
            C.childNodes[y].innerHTML = this._getDisplayText(j,ii) + '&nbsp;';
            if(this.ondrawcell)this.ondrawcell(C.childNodes[y], i, j, ii, y);
          }
          y++;
        }
    }
  }finally{
    d = null;D = null;S = null;C = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._viewChanged = function(){
  if(domapi.trace)dump(this.toString()+'._viewChanged()');
  this.getTopRow();
  this.getRowsViewable();
  domapi._private.listgrid.scanForSelections.apply(this);
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._dataChanged = function(){
  if(domapi.trace)dump(this.toString()+'._dataChanged()');
  // when row/col number or sizes change, call this to layout the control
  // and re-calculate the metrics
  var S = this._state;
  var D = this.data;
  try{
    S.visiblerowsheight = D.visibleRowsHeight();
    S.visiblecolswidth  = D.visibleColsWidth();
    S.visiblecols       = D.visibleCols();
    this.getRowbarWidth();
    this.getHeaderHeight();
    this.getRowsVisible();
    this.getVertScrollBarVisible();
    this.getHorzScrollBarVisible();
    this._viewChanged();
  }finally{
    S = null;D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.refresh = function(){
  if(domapi.trace)dump(this.toString()+'.refresh()');
  // refill all cells
  this.beginUpdate();
  //this._selected = this.selected.join().split();
  try{
    domapi._private.listgrid.scanForSelections.apply(this);
    this.__selected = this._selected.join().split(",");
    this.selectNone();
    this._dataChanged(); // causes metrics to be re-calculated
    this.getRowsVisible();
    this._divData.innerHTML   = "";
    //this._divHeader.innerHTML = ""; job000223 -- we adapt around this in assert()
    this._divRowbar.innerHTML = "";
  }finally{
    this.endUpdate();
    setTimeout("document.getElementById('" + this.id + "')._refreshCleanup()", 10);
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._refreshCleanup = function(){
  //this._selected = this.selected.join().split();
  //this.selectNone();alert(this._selected)
//  domapi._private.listgrid.scanForSelections.apply(this);alert(this._selected);
  this.selected = [];
  for(var i=0;i<this.__selected.length;i++)
    this.selectRow(this.__selected[i],true,true);
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.selectAll = function(){
  if(domapi.trace)dump(this.toString()+'.selectAll()');
  if(!this.doShowSelection)return;
  var i, j;
  var D = this.data;
  var c = ".DA_LG_" + this.id;
  var f = domapi.theme.fonts.selection.cssColor(true);
  try{
    for(i=0;i<D.rows.length;i++){
      if(this.selectMode == "row"){
        if(this.selected.indexOf(i)<0){
          //D.rows[i].classIndex = domapi.css.addRule(c + "_ROW" + i, f, true);
          //this.selected.push(i);
          this.selectRow(i, true, false);
        }
      }else for(j=0;j<D.cols.length;j++){
        if(this.selectMode == "col"){
          if(i==0){
            //D.cols[j].classIndex = domapi.css.addRule(c + "_COL" + j, f, true);
            if(this.selected.indexOf(i)<0)this.selected.push(i);
          }
        }else{
          D.rows[i].cells[j].classIndex = domapi.css.addRule(c + "_CELL_" + j +"_" +  i, f, true);
          //if(this.selected.indexOf(i)<0)this.selected.push(i);  // TODO @@@@@@@@@@@@@@@@@@@@@@@@@
        }
      }
    }
  }finally{
    D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.selectNone = function(){
  if(domapi.trace)dump(this.toString()+'.selectNone()');
  var i, j;
  //var D = this.data;
  var c = ".DA_LG_" + this.id;
  try{
    // remove all visible row indicator icons
    for(j=0;j<this.selected.length;j++){
      pi = this._physicalIndex(this.selected[j]);
      if(this._rowViewable(pi) && this._divRowbar.childNodes[pi])
        this._divRowbar.childNodes[pi].innerHTML = "";
    }
    for(var i=this.selected.length-1;i>-1;i--){
      switch(this.selectMode){
        case "row"  : this.selectRow(this.selected[i], false); break;
  //      case "col"  : domapi.css.removeRule(c + "_COL" + i);   break;
        case "cell" : break; // TODO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
      }
    }
  }finally{
    //D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._physicalIndex = function(i){
  var S = this._state;
  var r = i - (this.doVirtualMode?S.toprow:0);
  try{
    if(domapi.trace)dump(this.toString()+'._physicalIndex(' + i + ') = ' + r + '; toprow = ' + S.toprow);
    return r;
  }finally{
    S = null;r = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.rowVisible = function(i){
  var S = this._state;
  try{
    if(this.doVirtualMode)return (i >= S.toprow && i < (S.toprow + S.viewablerows-1));
    else{
      var y = this.data.visibleRowTop(i);
      return (y > this._goboContainer.scrollTop && y < this._goboContainer.scrollTop + this.offsetHeight-30);
    }
  }finally{
    S = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._rowViewable = function(i){
  var S = this._state;
  try{
    var r = ((!this.doVirtualMode) || (i > -1 && i < (S.toprow + S.viewablerows)));  
    if(domapi.trace)dump(this.toString()+'._rowViewable(' + i + ') = ' + r + '; toprow = ' + S.toprow+'; viewablerows = ' + S.viewablerows);
    return r;
  }finally{
    S = null;r = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.selectRow = function(i, b, makeCurrent){
  if(domapi.trace)dump(this.toString()+'.selectRow(' + i + ', ' + (b==true) + ', ' + (makeCurrent==true) + ')');
  var k;
  var pi = this._physicalIndex(i); // shortcut
  if(pi < 0 || pi > this.data.rows.length-1)return; // out of range
  var j = this.selected.indexOf(i);
//  if(!this.data.rows[pi])return;
  this.data.rows[pi].selected = b;
  if(b && j<0){
    if(this._rowViewable(pi))
     /* this["css_row" + pi] = domapi.css.addRule(
        ".DA_LG_" + this.id + "_ROW" + pi,
        domapi.theme.fonts.selection.cssColor(true),
        false);*/
    for(k=0;k<this.cols.length;k++)
      if(this._divData.childNodes[k])
        domapi.css.addClass(this._divData.childNodes[k].childNodes[pi], "DA_SELECTION");
    this.selected.push(i);
  }else if(!b /*&& j>-1*/){
    //domapi.css.removeRule(".DA_LG_" + this.id + "_ROW" + pi);
    if(this._rowViewable(pi))
      for(k=0;k<this.cols.length;k++)
        if(this._divData.childNodes[k])
          domapi.css.removeClass(this._divData.childNodes[k].childNodes[pi], "DA_SELECTION");
    this.selected.deleteItem(j);
    if(!b && this.ondeselectrow)this.ondeselectrow(i);
  }
  // remove all visible row indicator icons
  for(j=0;j<this.selected.length;j++){
    pi = this._physicalIndex(this.selected[j]);
    if(this._rowViewable(pi) && this._divRowbar.childNodes[pi])
      this._divRowbar.childNodes[pi].innerHTML = "";
  }

  if(makeCurrent && this.currentRow > -1){
    pi = this._physicalIndex(this.currentRow);
    if(this._rowViewable(pi) && this._divRowbar.childNodes[i]){
      this._divRowbar.childNodes[i].innerHTML =
        '<img src="' + domapi.theme.skin.lg_rowindicator.src + '">';
//      alert([pi,i])
    }

    pi += (this.doVirtualMode?this._state.toprow:0);
    if(b && !this.rowVisible(pi)){  // row is not visible, attempt to scroll it into view
      if(pi == this._state.toprow && this._state.toprow > 0)
        pi -= this._state.viewablerows;
      pi = domapi.rangeInt(pi, 0, this._state.visiblerows-1);
     // dump(['p', pi, this._state.toprow , this._state.viewablerows])
      this.setTopRow(pi);
    }

    if(b && this.onselectrow)this.onselectrow(this.currentRow);
  }
//  this._assertCellEditor(this.currentCol);
  this._showRowPersistentEditors();
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.getRow = function(i){
  var r = {cells:[]};
  var pi = this._physicalIndex(i);
  try{
    for(var k=0;k<this.cols.length;k++)
      r.cells.push(this._divData.childNodes[k].childNodes[pi]);
    return r;
  }finally{
    r = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi.comps.listgrid.getVertScrollBarVisible = function(){  
  var S = this._state;
  try{
    if(!this.doVirtualMode)
//      S.vertscrollbarvisible = S.visiblerowsheight > S.viewporth - 20;
      S.vertscrollbarvisible = S.visiblerowsheight > (S.viewporth - (S.horzscrollbarvisible?(S.sbw*2):0));
    else 
      S.vertscrollbarvisible = S.visiblerows != S.viewablerows;
    if(domapi.trace)dump(this.toString()+'.getVerticalScrollBarVisible() = ' + S.vertscrollbarvisible + ' ' + [S.visiblerowsheight, S.viewporth]);
    return S.vertscrollbarvisible;
  }finally{
    S = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.getHorzScrollBarVisible = function(){
  var S = this._state;
  try{
    S.horzscrollbarvisible = S.visiblecolswidth > (S.viewportw - (S.vertscrollbarvisible?(S.sbw+2):0));
  //  S.horzscrollbarvisible = S.visiblecolswidth > S.viewportw;
    if(domapi.trace)dump(this.toString()+'.getHorzScrollBarVisible() = ' + S.horzscrollbarvisible + ' ' + [S.visiblecolswidth, S.viewportw]);
    return S.horzscrollbarvisible;
  }finally{
    S = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.getHeaderHeight = function(){
  var S = this._state;
  try{
    S.headerheight = this.doShowHeader?(this.headerH-(domapi.isGecko?0:0)):0;
    if(domapi.trace)dump(this.toString()+'.getHeaderHeight() = ' + S.headerheight);
    return S.headerheight;
  }finally{
    S = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.getRowbarWidth  = function(){
  var S = this._state;
  try{
    S.rowbarwidth = this.doShowRowbar?this.rowbarW:0;
    if(domapi.trace)dump(this.toString()+'.getRowbarWidth() = ' + S.rowbarwidth);
    return S.rowbarwidth;
  }finally{
    S = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.getRowsViewable = function(){
  var S = this._state; 
  var r   = 0;
  var rh  = 0;
  var D   = this.data;
  var top = S.toprow;
  var h   = S.viewporth;  // -35 so we never have a partial row at the bottom
  try{
    if(S.horzscrollbarvisible)h -= S.sbw;
    var rb = 0;
    if((this.gridlines == "horz") || (this.gridlines == "both"))rb = 1;
    for(var i=top;i<D.rows.length;i++)
      if(!D.rows[i].hidden){
        rh += D.rows[i].h + rb; // +2 for border, top and bottom
  //      if(domapi.isIE)rh-=2; // -2 for box model
        if(rh >= h)break;//dump(this._state.viewporth)
        r++;
      }
      //dump([h,rh])
    if(top + r > D.rows.length)
      r = D.row.length - top; // not enough to fill the viewport
    //if(this.doVirtualMode && domapi.isIE && r > 1)r = r - 2;
    S.viewablerows = r;
  //  if((domapi.isGecko) && ((this.gridlines == "vert") || (this.gridlines == "none")) && ((top+S.viewablerows+1) < S.visiblerows))
  //    S.viewablerows++;
    if(domapi.trace)dump(this.toString()+'.getRowsViewable(V) = ' + S.viewablerows);
    return S.viewablerows;
  }finally{
    S = null;D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.getRowsVisible = function(){
  var S = this._state;
  try{
    S.visiblerows = this.data.visibleRowcount();  
    if(domapi.trace)dump(this.toString()+'.getRowsVisible() = ' + S.visiblerows);
    return S.visiblerows;
  }finally{
    S = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.setTopRow = function(index){
  this._goboContainer.scrollTop = this.data.visibleRowTop(index);
  this._doscroll();
  this._layoutScroll();
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.getTopRow = function(){
  // only virtualmode should call this
  var i;
  var t    = 0;
  var h    = 0;
  var S    = this._state;
  var trgt = (this.doVirtualMode?S.scrolltop:this._goboContainer.scrollTop) +
             (domapi.isGecko?S.headerheight:S.headerheight); // otherwise last row is not rendered in virtualmode
  var r    = this.data.rows;
  try{
    for(i=0;i<r.length;i++)
      if(!r[i].hidden){
        h += r[i].h;
        if(h >= (trgt)){
          S.toprow = t;
          if(domapi.trace)dump(this.toString()+'.getTopRow() = ' + t);
          return S.toprow;
        }
        t++;
      }
    S.toprow = t;
    if(domapi.trace)dump(this.toString()+'.getTopRow() = ' + t);
    return S.toprow;
  }finally{
    S = null;r = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi.comps.listgrid.setGridlines = function(v){
  if(domapi.trace)dump(this.toString()+'.setGridlines(' + v + ') _inUpdate='+this._inUpdate);
  this.gridlines = v;
  domapi.css.removeClass(this, "GRIDLINES_VERT");
  domapi.css.removeClass(this, "GRIDLINES_HORZ");
  if(v == "both" || v == "horz")domapi.css.addClass(this, "GRIDLINES_HORZ");
  if(v == "both" || v == "vert")domapi.css.addClass(this, "GRIDLINES_VERT");
  if(this.doVirtualMode && !this._inUpdate && this.data.rows.length)this.refresh();
  this._showRowPersistentEditors();
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.addCol = function(arg){
  if(domapi.trace)dump(this.toString()+'.addCol()');
  this.data.addCol(arg);
  if(!this._inUpdate)this.assert();
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.addRow = function(arg,del){
  if(domapi.trace)dump(this.toString()+'.addRow()');
  var isArray  = arg.constructor == Array;
  var isString = arg.constructor == String;
  if(isArray )arg = {cells:arg};
  if(isString)arg = {cells:arg.split(domapi.rVal(del,","))};

  if(isArray || isString)
    for(var i=0;i<arg.cells.length;i++)
      arg.cells[i] = {value:arg.cells[i]};

  this.data.addRow(arg);//domapi.debug.dumpProps(arg.cells[0])
  if(!this._inUpdate)this.assert();
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.deleteRow = function(i){
  if(domapi.trace)dump(this.toString()+'.deleteRow('+i+')');
  this.data.deleteRow(i);
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._positionCellEditor = function(r,c){
  var D = this.data;
  try{
    if(r < 0 || c < 0)return false;
    var e,x,y,w,h,C, rw, hh, v, g;
    var S = this._state;
    try{
      e  = this.cols[c].editControl;
    }catch(E){return false}
    if(!e || !this.doAllowEdit)return false;
    if(domapi.trace)dump(this.toString()+'._positionCellEditor('+r+','+c+')');
    rw = this.getRowbarWidth();
    hh = this.getHeaderHeight();
    g  = this._goboContainer;
    C  = this._divData.childNodes[c].childNodes[r];
    if(!C)return false;
    x  = this._divData.childNodes[c].offsetLeft + rw + 1 - g.scrollLeft;
    y  = C.offsetTop + hh - g.scrollTop;
    w  = C.offsetWidth  - 3;
    h  = C.offsetHeight - 3;
    // TODO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22
    // double check this accuracy
    if((x + w) + g.scrollLeft > (this.offsetWidth - rw)){
      var diffx = g.scrollLeft - this.offsetWidth - rw - w - 10;
      if (diffx <0) diffx = 0;
      g.scrollLeft += diffx;
      x += diffx;
  //    this._layoutScroll();
      this.scrollLeft = 0
    }
    if(e.isDatepicker2){
      w += domapi.theme.border.width*2;
      e.onchange= function(v){domapi._private.listgrid._dodatepickerchange(this, v);};
    }
    ////////////////////
    else if(e.controlType == ctBrowseButton)
    {  w =18; //these code i believe need to check isStrict in the future.
      h +=2;
      x = x + this.cols[c].offsetWidth - 18;
      //sometime the currentCol is not if use clickon the btn directly for the first time
      //temp hack.
      e.onclick = function(E) {domapi._private.listgrid._dobrowsebtnclick(E, r ,c);}
    }
    //////////////////
    else if (e.controlType == ctSelect)
    {
      x--;
      w+=3;
      e.style.fontSize = (h -6)+"px";
      e.onchange = function(E){domapi._private.listgrid._doselectchange(this, r ,c);}
    }
    // position the editor
    e.setSize(w,h+2);
    e.moveTo( x,y);
    // clip the edit if it exceeds the extents
    var clip = [0,w+2,h+2,0];
    var totalL = x + w - g.scrollLeft;
    var maxL = this.offsetWidth - (S.vertscrollbarvisible?S.sbw:0);
    if(totalL > maxL)
      clip[1] = w - (totalL - maxL)-2; // overlapping the right scrollbar
    totalL = y + h;
    maxL = this.offsetHeight - (S.horzscrollbarvisible?S.sbw:0);
    if(totalL > maxL)
      clip[2] = h - (totalL - maxL)-2; // overlapping the bottom scrollbar
    if(this.doShowRowbar && x < rw)
      clip[3] = rw - x;                // overlapping the rowbar
    if(this.doShowHeader && y < S.headerheight)
      clip[0] = S.headerheight - y;    // overlapping the header
    e.setClip(clip);
    //change to getValue, should be value driven
    v = D.getValue(r, D.visibleCol(c));
    if(e._setValue)
      e._setValue(v);
    else
      e.value = v;
    //the browse button didn't show well....
    e.bringToFront();
    e.show();
  }finally{
    D = null;e = null;g = null;C = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.editCell = function(){
  if(domapi.trace)dump(this.toString()+'.editCell()');
  var e= null;
  try{
    this._positionCellEditor(this.currentRow, this.currentCol);
    try{
     //e = this._editBox = this.cols[this.data.visibleCol(this.currentCol)].editControl;
     this._editBox = this.cols[this.currentCol].editControl;
     e = this._editBox;
    }catch(E){return false}
    if(!e)return false;
    try{
      e.select();
      setTimeout("try{domapi.getElm('"+this.id+"')._editBox.focus();}catch(E){}",200);
    }catch(E){}
    //browse button didn't cover the whole cell, want to prevent the I beam
    if ((this._editBox.controlType ==ctText) || (this._editBox.controlType==ctUnknown)) {
      this._divRowbar.childNodes[this.currentRow].innerHTML = '<img src="' + domapi.theme.skin.lg_rowedit.src + '">';
      this._state.inedit = true;
    }
    if(this.onbeginedit)this.onbeginedit();
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.cancelEdit = function(){
  if(domapi.trace)dump(this.toString()+'.cancelEdit()');
  if(!this._state.inedit)return;
  this._editBox.hide();
  this._state.inedit = false;
  this._divRowbar.childNodes[this.currentRow].innerHTML = '<img src="' + domapi.theme.skin.lg_rowindicator.src + '">';
  if(this.oncanceledit)this.oncanceledit();
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.commitEdit = function(){
  var flag = true;
  if(domapi.trace)dump(this.toString()+'.commitEdit()');
  if(!this._state.inedit)return flag;
  this._divRowbar.childNodes[this.currentRow].innerHTML = '<img src="' + domapi.theme.skin.lg_rowindicator.src + '">';
  var r = this.currentRow; var c = this.currentCol;
  if(r < 0 || c < 0)return false;
  var e = this._editBox;
  try{
    //HT: 1st try, need to further standardize
    if(this.onendedit)
      flag = this.onendedit(this.data.rows[r].cells[this.data.visibleCol(c)].value,e.value);
    if(flag){
      e.hide();
      this._state.inedit = false;
      this.data.rows[r].cells[this.data.visibleCol(c)].value = e.value;
      this.data.rows[r].cells[this.data.visibleCol(c)].text  = e.value;
      this._divData.childNodes[c].childNodes[r].innerHTML    = e.value;
    }
    //HT:can cancel the event now with custom onendedit
    return flag;
  }finally{
    e = null;
   //HT: add to handle custom onendendit that update more than one col.
   //    but having problem after add in support for commitedit on blur
   // this.refresh();
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.swapCols = function(i,j){
  var k;
  var D  = this.data;
  var c  = this.cols;
  var cc = this._divData.childNodes;
  var P  = domapi._private.listgrid;
  try{
    if(i==j)return;
    if(!c[i] || !c[j])return;
    // make sure i is less than j
    if(i>j){var t = i; i = j; j = t;}
    // swap underlying data
    D.swapCols(D.visibleCol(i), D.visibleCol(j));
    // swap col headers and fix indexes
    c[i]._index = j;
    c[j]._index = i;
    domapi.swapNodes(c[i], c[j]);
    // swap data cols and fix indexes
    cc[i]._index = j;
    cc[j]._index = i;
    domapi.swapNodes(cc[i], cc[j]);

    if(!this._inUpdate){
      // update css
      for(k=0;k<c.length;k++)
        P.buildColClass(this, k);
      // raise event
      if(this.oncolswap)this.oncolswap(i,j);
    }
  }finally{
    D = null;c = null;cc = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.sortCol = function(i,dir){
  try{
    var D = this.data;
    var C = D.cols[D.visibleCol(i)];
    if(C && C.sortable){
      C.sortDir = domapi.rInt(dir, 1);
      if(D.cols[D.sortColIndex])D.cols[D.sortColIndex].sorted = false;
      D.sort(C.fieldName, C.sortDir);
      C.sorted = true;
      this.refresh();
    }
  }finally{
    D = null; C = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid._inResizeRange = function(e,E){
//  if(domapi.trace)dump(this.toString()+'._inResizeRange()');
  if(this.doColResize){
    var b = this.resizeBdr;
    var offX = domapi.isGecko?E.layerX:event.offsetX;
    return offX >= (e.offsetWidth - b);
  }else return false;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi._private.listgrid.buildColClass = function(g, i){
  if(domapi.trace)dump(g.toString()+'.buildColClass(' + g + ', ' + i + ')');
  var d  = g.data;
  var l  = 0;
  var ii = d.visibleCol(i);
  var w  = d.cols[ii].w;
  var a  = d.cols[ii].textAlign;
  try{
    for(var j=0;j<i;j++)l += d.cols[d.visibleCol(j)].w;
    with(g._divData.childNodes[i].style){
      width     = w + "px";
      left      = l + "px";
      textAlign = a;//alert(g._divData.childNodes[i].style.width)
    }
    if((domapi.isStrict && domapi.isIE) || domapi.isKHTML)w -= 8;
    with(g._divHeader.childNodes[i].style){
      width     = w + "px";
      left      = l + "px";
      textAlign = d.cols[ii].headerAlign;;
    }
    g._showRowPersistentEditor(i);
  }finally{
    d = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi._private.listgrid.doscroll = function(E){
  if(domapi.isGecko && !E)return; // this can occur when not in virtual mode
  var e = domapi.findTarget(E,"LISTGRID");
  try{
    if(!e)return;
    if(e._state.inedit)e.cancelEdit();
    if(e._inLayoutScroll)return;
    e._inLayoutScroll = true;
    if(domapi.trace)dump(this.toString()+'.doscroll()');
    if(!e.doVirtualMode){
      e._layoutScroll();
      if(this.onscroll)this.onscroll();
    }else{
      if(e._scrollTimer)clearTimeout(e.scrollTimer);
      e._scrollTimer = setTimeout('document.getElementById("'+e.id+'")._doscroll()', 100);
    }
    e._showRowPersistentEditors();
    e._inLayoutScroll = false;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid._doscroll = function(){
  if(domapi.trace)dump(this.toString()+'._doscroll()');
  // this is only used when in virtual mode
  var pi, k;
  var C = this._goboContainer;
  var S = this._state;
  var R = this._divRowbar;
  var f = domapi.theme.fonts.selection.cssColor();
  var s = this.selected;
  try{
    if(C.scrollTop != S.scrolltop){
      // remove all visible row indicator icons and selected statuses
      for(j=0;j<s.length;j++){
        pi = this._physicalIndex(s[j]);
        if(this._rowViewable(pi)){
          for(k=0;k<this.cols.length;k++)
            domapi.css.removeClass(this._divData.childNodes[k].childNodes[pi], "DA_SELECTION");
          //domapi.css.removeRule(".DA_LG_" + this.id + "_ROW" + pi);
          if(R.childNodes[pi]) R.childNodes[pi].innerHTML = "";
        }
      }
      S.scrolltop = C.scrollTop;
      this._viewChanged();
      if(S.viewablerows > 0)
        this._renderCells();
        //this._assertRows();
      // replace selected row statues
      for(j=0;j<s.length;j++){
        pi = this._physicalIndex(s[j]);
        if(this._rowViewable(pi)){
          //this["css_row" + pi] = domapi.css.addRule(".DA_LG_" + this.id + "_ROW" + pi, f, false);
          for(k=0;k<this.cols.length;k++)
            domapi.css.addClass(this._divData.childNodes[k].childNodes[pi], "DA_SELECTION");
          if(pi == this.currentRow && R.childNodes[pi])
            R.childNodes[pi].innerHTML =
              '<img src="' + domapi.theme.skin.lg_rowindicator.src + '">';
        }
      }
    }else{
      if(C.scrollLeft != S.scrollleft){
        this._layoutScroll();
        S.scrollleft = C.scrollLeft;
      }
    }
    if(this.onscroll)this.onscroll();
  }finally{
    C = null;S = null;R = null;s = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.doheadermouseover = function(E){
  var e = domapi.findTarget(E,"LISTGRID_HEADER_COL");
  try{
    if(!e)return;
    var r = domapi.findTarget(E,"LISTGRID");
    var p = domapi._private.listgrid;
    if(r._state.inresize|| !r.enabled || (domapi.customDrag && domapi.customDrag.inDrag))return;
    if(r.doRollover && !r._inResizeRange(e,E) && !r._state.inmove){
      domapi.css.addClass(e, "DA_LISTGRID_HEADER_COL_OVER");
    }else p.doheadermouseout(E);
  }finally{
    e = null;r = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.doheadermousemove = function(E){
  var e = domapi.findTarget(E,"LISTGRID_HEADER_COL");
  try{
    if(!e)return;
    var r = domapi.findTarget(E,"LISTGRID");
    var p = domapi._private.listgrid;
    if(r._state.inresize||!r.enabled || (domapi.customDrag && domapi.customDrag.inDrag))return;
    var s  = e.style;//status = s.cursor
    if(r.doColResize){
      if(r._inResizeRange(e,E) && !r._state.inmove){
        if(s.cursor != domapi.cursors.vertBeam){
          p.doheadermouseout(E);
          s.cursor = domapi.cursors.vertBeam;
        }
      }else{
        if(s.cursor != "default"){
          p.doheadermouseover(E);
          s.cursor = "default";
        }
      }
    }else s.cursor = "default";
  }finally{
    e = null;r = null;p = null;s = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.doheadermouseout = function(E){
  var e = domapi.findTarget(E,"LISTGRID_HEADER_COL");
  try{
    if(!e)return;
    var r = domapi.findTarget(E,"LISTGRID");
    if(r._state.inresize || r._state.inmove)return;
    domapi.css.removeClass(e, "DA_LISTGRID_HEADER_COL_OVER");
  }finally{
    e = null;r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.doheadermousedown = function(E){
  var e = domapi.findTarget(E,"LISTGRID_HEADER_COL");
  try{
    if(e){
      var r = domapi.findTarget(E,"LISTGRID");
      if(r.enabled && r.doDepress && !r._inResizeRange(e,E))domapi.css.addClass(e, "DA_LISTGRID_HEADER_COL_DOWN");
    }
  }finally{
    e = null;r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.doheadermouseup = function(E){
  var e = domapi.findTarget(E,"LISTGRID_HEADER_COL");
  var r = domapi.findTarget(E,"LISTGRID");
  var D = r.data;
  try{
    if(e){
      domapi.css.removeClass(e, "DA_LISTGRID_HEADER_COL_DOWN");
      if(r.doColSort && !r._state.inresize && !r._state.inmove){
        var C = D.cols[D.visibleCol(domapi.getNodeIndex(e))];
        if(C && C.sortable){
          C.sortDir = domapi.rInt(C.sortDir, 1);
          C.sortDir = 1 - C.sortDir; // toggle
          domapi.customDrag.container.cancelCustomDrag({});
          r.sortCol(domapi.getNodeIndex(e), C.sortDir);
        }
      }
      if(r.onheaderclick)r.onheaderclick(domapi.getNodeIndex(e));
    }
    r.setFocus();
  }finally{
    e = null; r = null; D = null; C = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.findCell = function(E){
  var c = domapi.findTarget(E,"DIV");
  try{
    while(c){
      if(c.parentNode && c.parentNode.DA_TYPE && c.parentNode.DA_TYPE == "LISTGRID_COL")
        return c;
      else c = c.parentNode;
    }
    return null;
  }finally{
    c = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.scanForSelections = function(){
  this._selected = [];
  for(var i=0;i<this.data.rows.length;i++)
    if(this.data.rows[i].selected)this._selected.push(i);
};
//------------------------------------------------------------------------------
domapi._private.listgrid.dodataclick = function(E){
  var r        = domapi.findTarget(E,"LISTGRID");
  var shiftKey = domapi.isIE?event.shiftKey:E.shiftKey;
  var ctrlKey  = domapi.isIE?event.ctrlKey :E.ctrlKey;
  var c        = domapi._private.listgrid.findCell(E);
  try{
    if(!r || !c || !r.enabled)return;
    if(domapi.trace)dump(r.toString()+'.dodataclick()');
    var C = c.parentNode;
    var x = C._index;
    var y = domapi.getNodeIndex(c) + (r.doVirtualMode?r._state.toprow:0);
    var i = r._physicalIndex(r.currentRow);
    if(r._rowViewable(i) && r._divRowbar.childNodes[i])r._divRowbar.childNodes[i].innerHTML = '';
    var rowChanged = y != r.currentRow;
    var colChanged = x != r.currentCol;
    var oldRow     = r.currentRow;
    //HT:chenge to commit when switch cell, cancel if fail to commit
    if(rowChanged || colChanged){if (!r.commitEdit()) return;};
    r.currentRow   = y;
    r.currentCol   = x;
    if((!(shiftKey || ctrlKey) && r.doMultiSelect) || !r.doMultiSelect)r.selectNone(); // clear current selection
    if((ctrlKey && r.selected.indexOf(y)>-1) && (r.doAllowNoSelect || r.selected.length>1)){
      r.selectRow(y,false);
      return;
    }

    if(shiftKey && r.doMultiSelect && r.currentRow > -1){
      var y1,y2;
      if(oldRow < y){
        y1 = oldRow;
        y2 = y;
      }else{
        y1 = y;
        y2 = oldRow;
      }
      for(var i=y1;i<=y2;i++)
        if(i != y)r.selectRow(i, true, true); // don't select current row, it's done on the next line
    }

    r.selectRow(y, true, true);
    if(!rowChanged && !colChanged){
      if(r.enabled && r.doAllowEdit && r.data.cols[r.data.visibleCol(x)].editable){
        if(r.onallowedit && !r.onallowedit(x))return;
        r.editCell();
      }
    }
    //  r._assertCellEditor(r.currentCol);
   } catch(E){//r.data.visibleCol(x) can return -1
  }finally{
    r = null;c = null;C = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.domousewheel = function(E){ // Henry Tam
  var e = domapi.getTarget( E, "LISTGRID_COL");
  var r = domapi.findTarget(E, "LISTGRID");
  var d = 0;
  if(e && r){
    if(!E)E = window.event;
    if(E.wheelDelta)d =  E.wheelDelta;
    else if(E.detail){
      d = -E.detail;
      // detail property still seems buggy in FF, default to a reasonable value if out-of-range
      if(d == 32768) d = 120;
      else if(d == -32768) d = -120;
    }
    if(domapi.isIE) {
       if (E.wheelDelta <0) 
           r._goboContainer.doScroll("down");
       else
           r._goboContainer.doScroll("up");
    } else {
    r._goboContainer.scrollTop -= d;
      if(!r.doVirtualMode){
        r._layoutScroll();
      }else{
        if(r._scrollTimer)clearTimeout(r.scrollTimer);
        r._scrollTimer = setTimeout('document.getElementById("'+r.id+'")._doscroll()', 100);
      }
    }
    domapi.preventBubble(E);
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.dokeydown = function(E){
  var k   = domapi.isIE?event.keyCode:E.which;
  var e = domapi.getTarget(E);
  var r = e._daowner;
  if(!r)r = domapi.findTarget(E, "LISTGRID");
  var x   = r.currentCol;
  var D   = r.data;
  var eat = false;
  var i;
  var shiftKey = domapi.isIE?event.shiftKey:E.shiftKey;
  var ctrlKey  = domapi.isIE?event.ctrlKey :E.ctrlKey;
  try{
    if(!r.enabled)return;
    if(domapi.trace)dump(this.toString()+'.dokeydown('+k+')');
    if(k == 113 && r.enabled && r.doAllowEdit && D.cols[D.visibleCol(x)].editable){  // F2
      if(r.onallowedit && !r.onallowedit(x))return;
      r.editCell();
      eat = true;
    }
    if(k == 27 && r._state.inedit)r.cancelEdit(); // ESC
    if(k == 13 && r._state.inedit)r.commitEdit(); // RETURN
    if(!r._state.inedit){
      if(k == 33 || k == 34){ // PAGE UP/ DOWN
        if(k == 33)i = r.currentRow - r._state.viewablerows;
        if(k == 34)i = r.currentRow + r._state.viewablerows;
        r.selectNone();
        r.currentRow = domapi.rangeInt(i, 0, r._state.visiblerows-1);
        r.selectRow(r.currentRow, true, true);
        eat = true;
      }
      if(k == 35 && ctrlKey){ // CTRL+END
        r._goboContainer.scrollTop = D.visibleRowsHeight();
        r._layoutScroll();
        r.selectNone();
        r.currentRow = D.rows.length-1;
        r.selectRow(r.currentRow, true, true);
      }
      if(k == 35 && !ctrlKey)r.currentCol = r.cols.length-1; // END
      if(k == 36 && ctrlKey){ // CTRL+HOME
        r._goboContainer.scrollTop = 0;
        r._layoutScroll();
        r.selectNone();
        r.currentRow = 0;
        r.selectRow(r.currentRow, true, true);
      }
      if(k == 36 && !ctrlKey){r.currentCol = 0;eat = true;} // HOME
      if(k == 37 && r.currentCol > 0){r.currentCol--;eat = true;/*r._assertCellEditor(r.currentCol);*/} // LEFT
      if(k == 38 && r.currentRow>0){  // UP
        if((!(shiftKey || ctrlKey) && r.doMultiSelect) || !r.doMultiSelect)r.selectNone();
        r.currentRow--;
        r.selectRow(r.currentRow, true, true);
        eat = true;
      }
      if(k == 39 && r.currentCol < (r.cols.length-1)){r.currentCol++;eat = true;/*r._assertCellEditor(r.currentCol);*/} // RIGHT
      if(k == 40 && r.currentRow<D.rows.length-1){// DOWN
        //HT, canel and commit swap
        if(r._state.inedit)r.commitEdit();
        if((!(shiftKey || ctrlKey) && r.doMultiSelect) || !r.doMultiSelect)r.selectNone();
        r.currentRow++;
        r.selectRow(r.currentRow, true, true);
        eat = true;
      }
      if(k == 65 && ctrlKey && r.doMultiSelect){r.selectAll();eat = true;} // CTRL+A
      if(k == 27){r.selectNone();r.selectRow(r.currentRow, true, true);} // ESC
    }
    // if we are not editing, eat the keystrokes
    if(eat){
      if(E && E.preventDefault)E.preventDefault();
      return false;
    }
    //alert(k)
  }catch (E) {
  }finally{
    r = null;e = null;D = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid._docbclick = function(e){
  // fires when a checkbox is clicked, 'e' is the checkbox
  var R = domapi.findParent(e,"LISTGRID");
  try{
    if(!R || !e || !R.enabled || R._state.inedit)return;
    var enabled = e.src.indexOf('enabled') > -1;
    var checked = e.src.indexOf('checked') > -1;
    var grayed  = e.src.indexOf('grayed' ) > -1;
    if(!enabled)return;

    var r = R.currentRow;
    var c = R.currentCol;
    if(r < 0 || c < 0)return;

    if(checked)e.src = e.src.replace(new RegExp("checked"), "cleared");
    else if(grayed )e.src = e.src.replace(new RegExp("grayed"), "checked");
    else e.src = e.src.replace(new RegExp("cleared"), "checked");

    var _cell = R.data.rows[r].cells[R.data.visibleCol(c)];
    switch(_cell.value){ // attempt to maintain case
      case true    : _cell.value = false;   break;
      case false   : _cell.value = true;    break;
      case 1       : _cell.value = 0;       break;
      case 0       : _cell.value = 1;       break;
      case ""      : _cell.value = true;    break;
      case "true"  : _cell.value = "false"; break;
      case "True"  : _cell.value = "False"; break;
      case "TRUE"  : _cell.value = "FALSE"; break;
      case "false" : _cell.value = "true";  break;
      case "False" : _cell.value = "True";  break;
      case "FALSE" : _cell.value = "TRUE";  break;
      case "yes"   : _cell.value = "no";    break;
      case "Yes"   : _cell.value = "No";    break;
      case "YES"   : _cell.value = "NO";    break;
      case "no"    : _cell.value = "yes";   break;
      case "No"    : _cell.value = "Yes";   break;
      case "NO"    : _cell.value = "YES";   break;
    }
    _cell.text = String(_cell.value);
    if(R.onendedit)R.onendedit();
  }finally{
    R = null;_cell = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid._dobrowsebtnclick = function(E, r, c){
  if(!E) E = window.event;
  // fires when the browse button is clicked
  var R = domapi.findTarget(E,"LISTGRID");
  try{
    if(!R || !R.enabled || R._state.inedit)return;
    // var r = R.currentRow;
    // var c = R.currentCol; <-- in some initial case , this is wrong
    //alert("r: " + r + " c: " + c);
    if(r < 0 || c < 0)return;
    var rc = R.data.visibleCol(c);
    var rr = R._physicalIndex(r); /// hmm may need to handle getVisiableRow(r) later
    //user must provide the event handler, check and call
    if (R.data.cols[rc].onbeginedit)
       R.data.cols[rc].onbeginedit(rr, rc);
    domapi.preventBubble(E);
    //var _cell = R.data.rows[r].cells[R.data.visibleCol(c)];
    //if(R.onendedit)R.onendedit();
  }finally{
    R = null;_cell = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid._doselectchange = function(e,r,c){
  // fires when a select box is changed, 'e' is the select
  var R = domapi.findParent(e,"LISTGRID");
  try{
    if(!R || !e || !R.enabled || R._state.inedit)return;
    if(r < 0 || c < 0)return;
    var _cell = R.data.rows[r].cells[R.data.visibleCol(c)];
    _cell.value = e.value;
    _cell.text = e.options[e.selectedIndex].text;
    R._divData.childNodes[c].childNodes[r].innerHTML = e.options[e.selectedIndex].text;
    if(R.onendedit)R.onendedit();
  }finally{
    R = null;_cell = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid._dodatepickerchange = function(e, v){
  var R = domapi.findParent(e,"LISTGRID");
  var e = domapi.findParent(e, "DATEPICKER2");
  try{
    if(!R || !e || !R.enabled || R._state.inedit)return;
    R.data.setValue(R.currentRow, e.displayCol, v);
    R.data.setText(R.currentRow, e.displayCol, e.getValue());
    if(R.onendedit)R.onendedit();
    R.refresh();
  }finally{
    R = null;
    e = null;
  }
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// header drag-n-drop support
//------------------------------------------------------------------------------
domapi._private.listgrid.ondragallow = function(arg){
  var e = domapi.findParent(domapi.customDrag.elm, "LISTGRID_HEADER_COL");
  var C = domapi.customDrag;
  var p = domapi.findParent(C.container, "LISTGRID");
  try{
    C.dragThreshold = 4;
    C.col = e;
    if(!e || !p || !p.enabled || p._state.inresize || p._state.inmove)return false;
    if(p._inResizeRange(e, arg.E) && p.doColResize){
      p._state.inresize = true;
      p._WantinMove     = false;
      p._resizeIndex    = e._index;
      C.dragThreshold   = 0;
      C.startX          = e.offsetLeft + e.offsetWidth;//e.getX() + e.getW();
      return true;
    }
    if(!p._inResizeRange(e, arg.E) && p.doColMove && !p._state.inresize && !p._state.inmove){
      p._WantinMove = true;
      p._moveIndex  = e._index;
      C.startX      = e.offsetLeft + e.offsetWidth;//e.getX() + e.getW();
      for(var i=0;i<p.cols.length;i++)
        if(p.cols[i] != e)
          domapi.css.removeClass(p.cols[i], "DA_LISTGRID_HEADER_COL_OVER");
      return true;
    }

    p.style.cursor = "default";
    e.style.cursor = "default";
    return false;
  }finally{
    e = null; C = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.ondragstart = function(arg){
  var C = domapi.customDrag;
  var p = domapi.findParent(C.container, "LISTGRID");
  if(p._WantinMove)p._state.inmove = true;
  C = null;p = null;
};
//------------------------------------------------------------------------------
domapi._private.listgrid.ondragmove = function(arg){
  var e = domapi.findParent(arg.source, "LISTGRID_HEADER_COL");if(!e)return;
  var C = domapi.customDrag;
  var p = domapi.findParent(C.container, "LISTGRID");
  try{
    if(p._state.inresize){
      var b = p._resizebar;
      if(!b.showing){
        b.show();
        b.showing = true;
        b.setH(p.getH());
        b.setY(0);
      }
      C.colX = arg.dX + C.startX + 2;
      if(C.colX - e.offsetLeft < p.minColWidth){
        C.colX = e.offsetLeft + p.minColWidth;
      }
      b.setX(C.colX - p._goboContainer.scrollLeft /*- p.getRowbarWidth()*/);
    }
    if(p._state.inmove){
      var g = p._ghost;
      if(!g.showing){
        g.innerHTML = C.col.innerHTML;
        //g.show();
        g.style.display = "";
        g.showing       = true;
        g.setSize(C.col.offsetWidth, C.col.offsetHeight);
        //g.setY(0);
      }
      C.colX = arg.dX + C.startX - (C.col.offsetWidth / 1);
     // if(C.colX - e.offsetLeft < p.minColWidth){
     //   C.colX = e.offsetLeft + p.minColWidth;
     // }
      g.setX(C.colX - p._goboContainer.scrollLeft /*- p.getRowbarWidth()*/);
    }
  }finally{
    e = null;C = null;p = null;g = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listgrid.ondragend = function(arg){
  var i;
  var C = domapi.customDrag;
  var p = domapi.findParent(C.container, "LISTGRID");
  var c = p.cols;
  var D = p.data;
  if(domapi.trace)dump(p.toString()+'.ondragend()');
  try{
    if(p._state.inresize){
      var e = C.col; if(!e)return;
      p._state.inresize = false;
      p._resizebar.hide();
      p._resizebar.showing = false;
      p.style.cursor       = "default";
      e.style.cursor       = "default";

      D.cols[D.visibleCol(e._index)].w += (C.cursorX - C.cursorStartX);
      if(D.cols[D.visibleCol(e._index)].w < p.minColWidth)D.cols[D.visibleCol(e._index)].w = p.minColWidth;

      for(i=e._index;i<c.length;i++)
        domapi._private.listgrid.buildColClass(p, i);
      p.layout();
      return;
    }
    if(p._state.inmove){
      var x, curI, newI;
      var g     = p._ghost;
      p._state.inmove = false;
      p._showRowPersistentEditors();
      if(!g.showing)return;
      g.showing = false;
      //g.hide();
      // cleanup css
      for(var i=0;i<c.length;i++)
        domapi.css.removeClass(c[i], "DA_LISTGRID_HEADER_COL_OVER");
      // Find out where the ghost is located in relation to cells.
      // If the ghost seems to be between two cells, and neither of them is the
      // target cell, then place the target between them.
      // If ghost is infront of first cell, move the target to the beginning.
      // If ghost is past the last one, move it to the end.
      x    = g.getX();
      curI = p._moveIndex;
      newI = curI;
      if(x<0)newI = 0; // before first
      if(x>c[c.length-1].offsetLeft)newI = c.length-1; // past last
      for(i=0;i<c.length-1;i++) //  <--- intentionally one less then length
        if((x>c[i].offsetLeft)&&(x<c[i].offsetLeft+c[i].offsetWidth)){
          newI = i+1;
          break;
        }
      if(newI != curI){
        p.beginUpdate();
        var dir = (curI < newI)?1:-1;
        while(newI != curI){
          p.swapCols(curI, curI + dir);
          curI += dir;
          if((newI - curI) == 1)break;
        }
        p.endUpdate();
        // update css
        var P = domapi._private.listgrid;
        for(k=0;k<c.length;k++)
          P.buildColClass(p, k);
        // raise event
        if(p.oncolswap)p.oncolswap(i,j);
      }
      g.style.display = "none";
    }
  }finally{
    e = null;g = null;p = null;D = null;C = null;c = null;
  }
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// row drag-n-drop support
//------------------------------------------------------------------------------
domapi.comps.listgrid.ondragallow = function(arg){
  var e = domapi.findChildOfParent(domapi.customDrag.elm, "LISTGRID_COL");
  var p = domapi.customDrag.container;
  try{
    var canDrag = e && (p != e) && p.doAllowDrag && 
      !p._state.inmove && !p._state.inresize && !p._state.inedit;
    return canDrag;
  }finally{
    e = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.ondragstart = function(arg){
  var d = domapi.customDrag;
  try{
    d.elm = domapi.findChildOfParent(d.elm, "LISTGRID_COL"); // should be a cell
    if(!d.elm)d.container.cancelCustomDrag();
    var r = domapi.findParent(d.elm, "LISTGRID");
    r.dragRowIndex = domapi.getNodeIndex( d.elm);
    r.dragRowIndex += r._state.toprow;
    d.dragRowIndex = r.dragRowIndex;
  }finally{
    d = null;
  }
};
//------------------------------------------------------------------------------

//******************************************************************************
// utility functions
//******************************************************************************
// JSON support
//------------------------------------------------------------------------------
domapi.comps.listgrid.loadFromJson = function(json){this._loadFromJson(json)};
//------------------------------------------------------------------------------
domapi.comps.listgrid._loadFromJson = function(json){
  var D = this.data;
  try{
    if(domapi.trace)dump(this.toString()+'._loadFromJson()');
    this.clear();
    //this._state.toprow = 0;//this.refresh();this.assert();
    D.loadFromJson(json, true); // true for silent
    if(D.rows.length > 0)this.currentRow = 0;
    if(D.cols.length > 0)this.currentCol = 0;
    //this._state.toprow = 0;
    setTimeout('document.getElementById("'+this.id+'").refresh();',100);
    //if(!this.doAllowNoSelect && this.currentRow == 0)
    //  setTimeout('document.getElementById("'+this.id+'").selectRow(0,true,true)',250); // needs to processMessages
    //  this._layoutScroll();
    //  this.refresh();
    //this.assert();
  }finally{
    D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.loadFromJsonUrl = function(url){this._loadFromJsonUrl(url)};
//------------------------------------------------------------------------------
domapi.comps.listgrid._loadFromJsonUrl = function(url){
  if(domapi.trace)dump(this.toString()+'._loadFromJsonUrl("'+url+'")');
  var j = domapi.urlToJson(url);
  this.loadFromJson(j);
  j = null;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// CSV support
//------------------------------------------------------------------------------
domapi.comps.listgrid.loadFromCsv = function(s){this._loadFromCsv(s)};
//------------------------------------------------------------------------------
domapi.comps.listgrid._loadFromCsv = function(s){
  var D = this.data;
  try{
    if(domapi.trace)dump(this.toString()+'._loadFromCsv()');
    this.clear();
    D.loadFromCsv(s, true); // true for silent
    if(D.rows.length > 0)this.currentRow = 0;
    if(D.cols.length > 0)this.currentCol = 0;
    this.refresh();
    if(!this.doAllowNoSelect && this.currentRow == 0)
      setTimeout('document.getElementById("'+this.id+'").selectRow(0,true,true)',10); // needs to processMessages
  }finally{
    D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.loadFromCsvUrl = function(url){this._loadFromCsvUrl(url)};
//------------------------------------------------------------------------------
domapi.comps.listgrid._loadFromCsvUrl = function(url){
  if(domapi.trace)dump(this.toString()+'._loadFromCsvUrl("'+url+'")');
  var j = domapi.urlToCsv(url);
  this.loadFromCsv(j);
  j = null;
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// XML support
//------------------------------------------------------------------------------
domapi.comps.listgrid.loadFromXml = function(xmlobj, nodeNm){this._loadFromXml(xmlobj)};
//------------------------------------------------------------------------------
domapi.comps.listgrid._loadFromXml = function(xmlobj, nodeNm){
  var D = this.data;
  try{
    if(domapi.trace)dump(this.toString()+'._loadFromXml()');
    this.clear();
    D.loadFromXml(xmlobj, nodeNm, true); // true for silent
    if(D.rows.length > 0)this.currentRow = 0;
    if(D.cols.length > 0)this.currentCol = 0;
    this.refresh();
    if(!this.doAllowNoSelect && this.currentRow == 0)
      setTimeout('document.getElementById("'+this.id+'").selectRow(0,true,true)',10); // needs to processMessages
  }finally{
    D = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listgrid.loadFromXmlUrl = function(url, nodeNm){this._loadFromXmlUrl(url, nodeNm)};
//------------------------------------------------------------------------------
domapi.comps.listgrid._loadFromXmlUrl = function(url, nodeNm){
  var D = this.data;
  try{
    if(domapi.trace)dump(this.toString()+'._loadFromXmlUrl("'+url+'")');
    this.clear();
    D.loadFromXmlUrl(url, nodeNm, true); // true for silent
    if(D.rows.length > 0)this.currentRow = 0;
    if(D.cols.length > 0)this.currentCol = 0;
    this.refresh();
    if(!this.doAllowNoSelect && this.currentRow == 0)
      setTimeout('document.getElementById("'+this.id+'").selectRow(0,true,true)',10); // needs to processMessages
  }finally{
    D = null;
  }
};
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi._private.listgrid.dumpStateNoFormat = function(G){
  var s = "";
  var b = "\n";
  var S = G._state;
  line = function(n, v){
    return n + " : " + v + b;
  };
  s +=
    "state dump of grid " + G.id + b +
    "-----------------------------" + b +
    line("selected",         '['+G.selected+']')         +
    line("currentRow",           G.currentRow)           +
    line("currentCol",           G.currentCol)           +
    line("sbw",                  S.sbw)                  +
    line("viewportw",            S.viewportw)            +
    line("viewporth",            S.viewporth)            +
    line("toprow",               S.toprow)               +
    line("rowbarwidth",          S.rowbarwidth)          +
    line("visiblerows",          S.visiblerows)          +
    line("viewablerows",         S.viewablerows)         +
    line("headerheight",         S.headerheight)         +
    line("scrolltop",            S.scrolltop)            +
    line("scrollleft",           S.scrollleft)           +
    line("visiblerowsheight",    S.visiblerowsheight)    +
    line("visiblecolswidth",     S.visiblecolswidth)     +
    line("vertscrollbarvisible", S.vertscrollbarvisible) +
    line("horzscrollbarvisible", S.horzscrollbarvisible) +
    line("inresize",             S.inresize)             +
    line("inedit",               S.inedit)               +
    line("inmove",               S.inmove)               +
    line("lastheaderclip",   '['+S.lastheaderclip+']')   +
    line("lastdataclip",     '['+S.lastdataclip  +']');
  S = null;
  return s;
};
//------------------------------------------------------------------------------
domapi._private.listgrid.dumpState = function(G){
  var s = "";
  var b = "</td></tr><br />";
  var S = G._state;
  line = function(n, v){
    return "<tr><td>]" + n + "&nbsp;</td><td>" + v + "</td></tr>";
  };
  s += '<table cellpadding="0" cellspacing="0" border="0">' +
    line("selected",         '['+G.selected+']')         +
    line("currentRow",           G.currentRow)           +
    line("currentCol",           G.currentCol)           +
    line("sbw",                  S.sbw)                  +
    line("viewportw",            S.viewportw)            +
    line("viewporth",            S.viewporth)            +
    line("toprow",               S.toprow)               +
    line("rowbarwidth",          S.rowbarwidth)          +
    line("visiblerows",          S.visiblerows)          +
    line("viewablerows",         S.viewablerows)         +
    line("headerheight",         S.headerheight)         +
    line("scrolltop",            S.scrolltop)            +
    line("scrollleft",           S.scrollleft)           +
    line("visiblerowsheight",    S.visiblerowsheight)    +
    line("visiblecolswidth",     S.visiblecolswidth)     +
    line("vertscrollbarvisible", S.vertscrollbarvisible) +
    line("horzscrollbarvisible", S.horzscrollbarvisible) +
    line("inresize",             S.inresize)             +
    line("inedit",               S.inedit)               +
    line("inmove",               S.inmove)               +
    line("lastheaderclip",   '['+S.lastheaderclip+']')   +
    line("lastdataclip",     '['+S.lastdataclip  +']')   +
    '</table>';
  dump("");
  dump("================= GRID STATE ==================");
  dump(s);
  dump("===============================================");
  S = null;
};
//------------------------------------------------------------------------------