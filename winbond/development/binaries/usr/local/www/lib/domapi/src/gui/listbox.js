//==============================================
// DomAPI Listbox Component
// D. Kadrioski 7/27/2001
// (c) Nebiru Software 2001,2005
//==============================================
// additional contributors:
// Dostick
//==============================================

domapi.registerComponent("listbox");
//------------------------------------------------------------------------------
domapi.Listbox = function(arg){return domapi.comps.listbox.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.listbox.constructor = function(arg){
  if(arg.doAllowDrag)
    domapi.assertUnit("customdrag");
  var e = domapi.Component(arg,"listbox");
  try{
    e.onchange       = function(i){};
    e.onbeforechange = function(i){return true};
    e.setOverflow(     "auto");
    e._inner = document.createElement("DIV");
    e.appendChild(e._inner);
    domapi.disallowSelect(e);
  
    e.items            = e._inner.childNodes;
    e.selected         = [];
    e.itemIndex        = -1;
    e._inner.className = "DA_LISTBOX_INNER";
    e.style.cursor     = "default";
  
    var p = domapi._private.listbox;  
    domapi.addEvent(e, "mouseover", p.domouseover);
    domapi.addEvent(e, "mouseout",  p.domouseout );
    domapi.addEvent(e, "mousedown", p.domousedown);
    domapi.addEvent(e, "mouseup",   p.domouseup  );
    domapi.addEvent(e, "click",     p.doclick    );
    e.onscroll = p.doscroll;
    if(e.doAllowDrag)
      e.turnOnCustomDrag({});

    domapi._finalizeComp(e);
    domapi.addEvent(domapi.isIE?e:e._daTabEdit, "keydown", p.dokeydown);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listbox._draw = function(){
  this.listboxDraw();
};
//------------------------------------------------------------------------------
domapi.comps.listbox._free = function(){
  this.onchange       = null;
  this.onbeforechange = null;
  this._inner         = null;
  this.items          = null;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.listboxDraw = function(){
  var t = domapi.theme;
  var f = t.fonts;
  var s = this.style;
  var i = this.items;
  var b                = this.doBorder?t.border.width:0;
  this.setB(             b);  // set border width *before* border style!!
  this.setColor(         f.window.color);
  this.setBgColor(       this.doBGFill?f.window.bgcolor:"transparent");
  s.borderStyle        = this.doBorder?t.border.solid:"none";
  s.borderColor        = t.border.getInset();
  for(var a=0;a<i.length;a++)this.drawItem(i[a]);
  domapi.css.removeClass(this, "DA_LINED");
  domapi.css.removeClass(this, "DA_LEDGER");
  if(this.doHLines)domapi.css.addClass(this, "DA_LINED");
  if(this.doLedger)domapi.css.addClass(this, "DA_LEDGER");
  t = null; s = null; i = null;
};
//------------------------------------------------------------------------------
domapi.comps.listbox._layout = function(){
  if(this.doAutoWidth && !this._inUpdate){
    var i,w,ww,f;
    var b = this.getB();
    var p = this.getP();
    w = this.minWidth;
    f = domapi.theme.fonts.buttonface.asString();
    for(i=0;i<this.items.length;i++){
      ww = domapi.textWidth(this.items[i].innerHTML, f);
      if(ww > w)w = ww;
    }
    this.setW(
      w +
      domapi.scrollBarWidth()*2 +
      b[1]*4 +
      p[1]*4,
      true
    );
    domapi._private.listbox.scanForSelections.apply(this);
  }
};
//------------------------------------------------------------------------------
domapi.comps.listbox.drawItem = function(item){
  var cn = "";
  if(item.selected && this.doShowSelection)cn = "DA_SELECTION";
  else if(this.doLedger) cn = (domapi.getNodeIndex(item) % 2)==0?"LEDGER1":"LEDGER2";
  if(item.className != cn)item.className = cn;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.addItem = function(arg){
  var e       = document.createElement("DIV");
  var s       = e.style;
  var i       = this.items;
  var t       = domapi.theme;
  if(!arg["text"] )arg["text" ] = arg["value"];
  if(!arg["value"])arg["value"] = arg["text"];
  e.innerHTML = arg["text"];
  e.fn        = domapi.rVal( arg["fn"], null);
  e.selected  = false;
  e.DA_TYPE   = "LISTBOXITEM";
  e.className = "DA_LISTITEM";
  e.value     = arg["value"];
  domapi.disallowSelect(e);
  //---------
  this._inner.appendChild(e);
  if(i.length==1 && !this.doAllowNoSelect)
    this.selectItem(0, true);
  if(!this._inUpdate){
    this.drawItem(e);
    this.layout();
  }
  if(!this._inUpdate)domapi._private.listbox.scanForSelections.apply(this);
  e = null; s = null; t = null; i = null;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.insertItem = function(arg){
  // for drag n drop, moves fromItem above or below toItem
  var f = arg["fromItem"];  
  var t = arg["toItem"  ];
  var w = "afterEnd";
  var p = arg["sourceListbox"];
  try{
  //  dump([this.id, p.id])
    if(!t)t = this; // no toItem specified, add to root
    if(arg["insertAbove"] || arg["insertBelow"]){
      var i = domapi.getNodeIndex(arg["toItem"]);
    }
    if(!f || !t ||!p){
      throw new Error(
        'Error in insertItem, one or more parameters is invalid.\n' +
        'fromItem      : ' + f + '\n' +
        'toItem        : ' + t + '\n' +
        'sourceListbox : ' + p
      );
      return false;
    }
  
    var _checksum = this.items.length;
    if(arg["insertAbove"])w = "beforeBegin";
    if(arg["insertBelow"])w = "afterEnd";
    var n = p.deleteItem(domapi.getNodeIndex(f));//alert(t.DA_TYPE)
    if(t.DA_TYPE == this.DA_TYPE)
      this._inner.appendChild(n);
    else
      t.insertAdjacentElement(w,n);
    if((p == this && _checksum != this.items.length) || (p != this && _checksum >= this.items.length))
      throw new Error(
        'Error in insertItem, failed to insert into items array.\n' +
        'fromItem      : ' + f + '\n' +
        'toItem        : ' + t + '\n' +
        'sourceListbox : ' + p + '\n' +
        'i             : ' + i + '\n' +
        'checksum      : ' + _checksum + '\n' +
        'items.length  : ' + this.items.length
      );
    if(!this._inUpdate)domapi._private.listbox.scanForSelections.apply(this);
    this.draw();
    if(p != this)p.draw();
    return n;
  }finally{
    f = null; t = null; w = null; p = null; n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listbox.setBorderOut = function(sent){sent.style.borderWidth="0px 0px 1px 0px"};
domapi.comps.listbox.setBorderIn  = function(sent){sent.style.borderWidth="1px 0px 0px 0px"};
//------------------------------------------------------------------------------
domapi.comps.listbox.findItem = function(s,ignoreCase){
  var temp="";
  if(ignoreCase)s=s.toLowerCase();
  for(var a=0;a<this.items.length;a++){
    temp=this.items[a].innerHTML;
    if(ignoreCase)temp=temp.toLowerCase();
    if(s==temp)return this.items[a];
  }
  return null;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.setItem = function(i,arg){
  if(i>=this.items.length)return;
  with(this.items[i]){
    innerHTML = arg["text"];
    fn        = domapi.rVal( arg["fn"], null);
    value     = arg["value"];
  }
  if(!this._inUpdate)
    this.layout();
};
//------------------------------------------------------------------------------
domapi.comps.listbox.sortItems = function(dir,type){// dir 0=acsending, 1=descending  
  var i = this.items;
  domapi.assertUnit("nodesort");
  domapi.nodeSort({nodelist:i,direction:dir,type:type});
  for(var a=0;a<i.length;a++)this.drawItem(i[a]);
  domapi._private.listbox.scanForSelections.apply(this);
  i = null;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.deleteItem = function(i){
  if(i>=this.items.length)return;
  var e = this.items[i];
  var s = this.selected;
  try{
    for(var a=s.length-1;a>=0;a--)
      if(s[a]==e)s.deleteItem(a);
  
    e.parentNode.removeChild(e);
    if(!this._inUpdate){
  //    this.onchange(-1);
      this.layout();
    }
    domapi._private.listbox.scanForSelections.apply(this);
    return e;
  }finally{
    s = null; e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listbox.clearItems = function(){
  this.beginUpdate();
  try{
    this._inner.innerHTML = "";
    this.selected = [];
    //for(var a=this.items.length-1;a>-1;a--)this.deleteItem(a);
  }finally{
    this.endUpdate();    
    this.setValue();
//    this.onchange(-1);
  }
  domapi._private.listbox.scanForSelections.apply(this);
};
//------------------------------------------------------------------------------
domapi.comps.listbox.selectItemByValue = function(i){ // Dostick
  for(var a=this.items.length-1;a>-1;a--)
    if(this.items[a].value==i)
      this.selectItem(a, true);
  return true;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.selectItem = function(index, b){
  if(index<0 || index>= this.items.length)return;
  if(domapi.trace)dump(this.toString() + '.listbox.selectItem()<--');  
  var j = this.selected.indexOf(index);
  if(b && j<0){
    if(!this.onbeforechange(this.items[index]))return; // user declined selection    
    this.items[index].selected = true;
    if(!this._inUpdate)this.drawItem(this.items[index]);
    this.selected.push(index);
    this.itemIndex = index;
    if(!this._inUpdate){
      var t = this.items[index].offsetTop;
      var tt = this.scrollTop;
      var h = this.offsetHeight-this.items[index].offsetHeight;
      if(t < tt)this.scrollTop = t;
      if(t > tt+h)this.scrollTop = t-h;
      this.setValue();
      this.onchange(index);
      if(this.items[index].fn){
        if(typeof this.items[index].fn == "function")this.items[index].fn(index);
        else eval(this.items[index].fn);
      }
    }
  }else if(!b && j>-1){
    this.items[index].selected = false;
    if(!this._inUpdate)this.drawItem(this.items[index]);
    this.selected.deleteItem(j);
  }
  if(domapi.trace)dump(this.toString() + '.listbox.selectItem()-->');
};
//------------------------------------------------------------------------------
/*domapi.comps.listbox.setValue = function(v){
  if(this._setValue)this._setValue(v);
  else this.value = v;
  var e = this._formElement;
  v = this.getValue();
  if(e)e.value = v;
};*/
domapi.comps.listbox.setValue = function(v){
  if(domapi.trace)dump(this.toString() + '.listbox.setValue()<--');
  v = this.getValue();
  this.value = v;
  domapi._setFormElementValue(this._formElement, String(v));
//  if(this.onchange)this.onchange(this.value);
  if(domapi.trace)dump(this.toString() + '.listbox.setValue()-->');
};
//------------------------------------------------------------------------------
domapi.comps.listbox.selectAll = function(){
  this.beginUpdate();
  try{
    for(var i=0;i<this.items.length;i++)
      this.selectItem(i, true);
  }finally{
    this.endUpdate();
    this.setValue();
//    this.onchange(-1);
  }
};
//------------------------------------------------------------------------------
domapi.comps.listbox.selectNone = function(){
  if(domapi.trace)dump(this.toString() + '.listbox.selectNone()<--');
//  this.beginUpdate();
  try{
    for(var i=this.selected.length-1; i>=0; i--)
      this.selectItem(this.selected[i], false);
    this.setValue();
//    this.onchange(-1);
  }finally{
  //  this.endUpdate();    
  }
  if(domapi.trace)dump(this.toString() + '.listbox.selectNone()-->');
};
//------------------------------------------------------------------------------
domapi.comps.listbox.delimitedText = function(s,del){
  del = domapi.rVal(del,","); // default delimiter is comma
  this.clearItems();
  this.beginUpdate();
  var list = s.split(del);
  for(var a=0;a<list.length;a++)
    this.addItem({text:list[a]});
  this.endUpdate();
  domapi._private.listbox.scanForSelections.apply(this);
};
//------------------------------------------------------------------------------
domapi.comps.listbox._getValue = function(sep){
  if(domapi.trace)dump(this.toString() + '.listbox._getValue()');
  var j,i;
  var t = "";
  var s = this.selected;
  try{
    for(i=0;i<s.length;i++){
      j = s[i];
      if(j > -1 && j < this.items.length){
        if(i>0)t += sep;
        t += this.items[j].value;
      }
    }
    return t;
  }finally{
    j = null; t = null; s = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi._private.listbox.scanForSelections = function(){
  this.selected = [];
  for(var i=0;i<this.items.length;i++)
    if(this.items[i].selected)this.selected.push(i);
};
//------------------------------------------------------------------------------
domapi._private.listbox.domouseover = function(E){
  var r = domapi.findTarget(E,"LISTBOX");
  var t = domapi.theme;
  var f = t.fonts;
  try{
    if(!r.doRollover || !r.enabled || (domapi.customDrag && domapi.customDrag.inDrag))return;
    var e = domapi.findTarget(E,"LISTBOXITEM");if(!e||e==r)return;
    if(e.selected && r.doShowSelection)return;
    e.className = "DA_HIGHLIGHT";
  }finally{
    r = null; e = null; f = null; t = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listbox.domouseout = function(E){
  var r = domapi.findTarget(E,"LISTBOX");
  var t = domapi.theme;
  var f = t.fonts;
  try{
    if(!r.enabled || !r.doRollover || (domapi.customDrag && domapi.customDrag.inDrag))return;
    var e = domapi.findTarget(E,"LISTBOXITEM");if(!e||e==r)return;
    if(r.doDepress)r.setBorderOut(e);
    if(e.selected && r.doShowSelection)return;
    r.drawItem(e);
  }finally{
    r = null; e = null; f = null; t = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listbox.domousedown = function(E){
  var r = domapi.findTarget(E,"LISTBOX");
  try{
    if(!r.enabled || !r.doDepress || (domapi.customDrag && domapi.customDrag.inDrag))return;
    var e=domapi.findTarget(E,"LISTBOXITEM");if(!e||e==r)return;
    r.setBorderIn(e);
  }finally{
    r = null; e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listbox.domouseup = function(E){
  var r = domapi.findTarget(E,"LISTBOX");
  try{
    if(!r.enabled)return;
    var e = domapi.findTarget(E,"LISTBOXITEM");if(!e||e==r)return;
    if(r.doDepress)r.setBorderOut(e);
    if(domapi.isGecko)E.preventDefault();
    return false;
  }finally{
    e = null;r = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listbox.doclick = function(E){
  var r = domapi.findTarget(E,"LISTBOX");
  var e = domapi.findTarget(E,"LISTBOXITEM");
  try{
    if(!e || e==r || !r.enabled || (domapi.customDrag && domapi.customDrag.inDrag))return;
    var shiftKey = domapi.isIE?event.shiftKey:E.shiftKey;
    var ctrlKey  = domapi.isIE?event.ctrlKey :E.ctrlKey;
    var i = domapi.getNodeIndex(e);
    if(r.onbeforechange)
      if(!e.selected && !r.onbeforechange(e))return; // user declined selection
    if((!(shiftKey || ctrlKey) && r.doMultiSelect) || !r.doMultiSelect)r.selectNone(); // clear current selection
    var oldIndex = r.itemIndex;
    r.itemIndex = i;
  
    if((ctrlKey && e.selected) && (r.doAllowNoSelection || r.selected.length>1)){
      r.selectItem(i,false);
      return;
    }
  
    if(shiftKey && r.doMultiSelect && i > -1){
      var y1,y2;
      if(oldIndex < i){
        y1 = oldIndex;
        y2 = i;
      }else{
        y1 = i;
        y2 = oldIndex;
      }
      for(var j=y1;j<=y2;j++)
        if(j != i)r.selectItem(j, true); // don't select current row, it's done on the next line
    }
    
    r.selectItem(i, true);
  }finally{
    r = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.listbox.doscroll = function(E){
  var r = domapi.findTarget(E,"LISTBOX");
//  r._editBox.setY(r.scrollTop);
  r = null;
};
//------------------------------------------------------------------------------
domapi._private.listbox.dokeydown = function(E){
  if (!E) E = window.event;
  var k = domapi.isIE?E.keyCode:E.which;
  if(domapi.trace)dump('domapi._private.listbox.dokeydown<-- ' + k);
  var e = domapi.isGecko?E.target:E.srcElement ;//domapi.getTarget(E);
  var r = e._daowner;
  var eat = false;
  var shiftKey = E.shiftKey;
  var ctrlKey  = E.ctrlKey;
  try{
    if(!r.enabled)return;
    if(!r._inedit){
      //HT: addded all the else, seem the response is more snappy
      if(k == 33) // PAGE UP
        r.scrollTop -= r.offsetHeight;
      else if(k == 34) // PAGE DOWN
        r.scrollTop += r.offsetHeight;
      else if(k == 35 && ctrlKey){ // CTRL+END
        r.scrollTop = r._inner.offsetHeight;
        r.selectNone();
        r.itemIndex = r.items.length-1;
        r.selectItem(r.itemIndex, true);
      }
      else if(k == 36 && ctrlKey){ // CTRL+HOME
        r.scrollTop = 0;
        r.selectNone();
        r.currentItem = 0;
        r.selectItem(0, true);
      }
      else if(k == 38 && r.itemIndex>0){  // UP
        if((!(shiftKey || ctrlKey) && r.doMultiSelect) || !r.doMultiSelect)
          if(r.onbeforechange && r.onbeforechange(r.items[r.itemIndex-1]))r.selectNone();
        r.itemIndex--;
        r.selectItem(r.itemIndex, true);
        eat = true;
      }
      else if(k == 40 && r.itemIndex<r.items.length-1){// DOWN
        if((!(shiftKey || ctrlKey) && r.doMultiSelect) || !r.doMultiSelect)
          if(r.onbeforechange && r.onbeforechange(r.items[r.itemIndex+1]))r.selectNone();
        r.itemIndex++;
        r.selectItem(r.itemIndex, true);
        eat = true;
      }
      else  if(k == 65 && ctrlKey && r.doMultiSelect){r.selectAll();eat = true;} // CTRL+A
      else  if(k == 27){r.selectNone();r.selectItem(r.itemIndex, true);} // ESC 
      else  if(k >= 48){// && k <= 122) { //alpha & numeric characters (by Chris Lamothe)
        var temp = "";
        var hit = false;
        var reassign = false;
        var startIndex = 0;
        var endIndex = 0;
        var kl = String.fromCharCode(k).toLowerCase();
        //find first selected, if any
        for(var a=0;a<r.items.length;a++)
          if (r.items[a].selected) {
            startIndex = a;
            break;  //mimicking select multiple, it seems to only care about the first one.
          }
        if (!shiftKey){
          //next loop through remainder to see if any
          for(var a=startIndex; a<r.items.length;a++){
            temp = r.items[a].innerHTML.toLowerCase();
            if(kl == temp.substring(0,1) && (r.onbeforechange && r.onbeforechange(r.items[a]))) {  //found a match
              if (r.items[a].selected) { //remember and see if any other occurences
                endIndex = a;
                hit = true;
                continue;
              } else {
                if (hit)r.selectItem(endIndex, false);
                else r.selectNone();
                r.selectItem(a, true); //might need a scrollTo to make it look better. Tried r.scrollTop = (r.items[a].offsetHeight * a) + "px"; //but didn't do anything
                reassign = true;
                break;
              }
            }
          }
          if(!reassign)
            for(var a=0; a<startIndex;a++){
              temp = r.items[a].innerHTML.toLowerCase();
              if(kl == temp.substring(0,1)) {  //found a match
                r.selectNone();
                r.selectItem(a, true); //might need a scrollTo to make it look better.
                break;
              }
            }
        } else if (shiftKey && r.doMultiSelect) {
          //we need to find if there is a second occurence of the letter
          for(var a=startIndex + 1; a<r.items.length;a++){
            temp = r.items[a].innerHTML.toLowerCase();
            if(kl == temp.substring(0,1)) {  //found a match
              endIndex = a;
              hit = true;
              break;
            }
          }
          if(!hit){
            for (var a = 0; a < startIndex; a++) {
              temp = r.items[a].innerHTML.toLowerCase();
              if(kl == temp.substring(0,1)) {  //found a match
                if (r.items[a].selected) { //remember and see if any other occurences
                  endIndex = a;
                  hit = true;
                  break;
                }
              }
            }
          }
          if(hit){
            r.selectNone();
            for (var a = startIndex; a <= endIndex; a++)
              r.selectItem(a, true);
          }
        }
      }
    }
    // if we are not editing, eat the keystrokes
    if(eat){
      if(E && E.preventDefault)E.preventDefault();
      return false;
    }
    //alert(k)
  }finally{
    r = null;e = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// drag-n-drop support
//------------------------------------------------------------------------------
domapi.comps.listbox.ondragallow = function(arg){
  var e = domapi.findParent(domapi.customDrag.elm, "LISTBOXITEM");
  var p = domapi.customDrag.container;
  var canDrag = e && (p != e) && p.doAllowDrag;
  e = null;r = null;
  return canDrag;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.ondragstart = function(arg){
  var d = domapi.customDrag;
  d.elm = domapi.findParent(d.elm, "LISTBOXITEM");
  if(!d.elm)d.container.cancelCustomDrag();
  d = null;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.onallowinsertabove = function(arg){
  var e = domapi.findParent(arg["over"], "LISTBOXITEM");
  try{
    return (e);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.listbox.onallowinsertbelow = function(arg){
  var e = domapi.findParent(arg["over"], "LISTBOXITEM");
  try{
    return (e);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------


//******************************************************************************
// utility functions
//******************************************************************************
// JSON support
//------------------------------------------------------------------------------
domapi.comps.listbox.loadFromJson = function(json){this._loadFromJson(json)};
//------------------------------------------------------------------------------
domapi.comps.listbox._loadFromJson = function(json){
  var i,j,I;
  domapi.assertUnit("json");
  this.beginUpdate();
  try{
    for(i in json){
      if(i == "items"){
        I = json[i];      
        for(j=0;j<I.length;j++)
          this.addItem(I[j]);
      }else this[i] = json[i];
    }
  }finally{
    this.endUpdate();
  }
  I = null;
};
//------------------------------------------------------------------------------
domapi.comps.listbox.loadFromJsonUrl = function(url){this._loadFromJsonUrl(url)};
//------------------------------------------------------------------------------
domapi.comps.listbox._loadFromJsonUrl = function(url){
  if(domapi.trace)dump('_loadFromJsonUrl("'+url+'")');
  domapi.assertUnit("json");
  var j = domapi.urlToJson(url);
  try{
    this.loadFromJson(j);
  }finally{
    j = null;
  }
};
//------------------------------------------------------------------------------