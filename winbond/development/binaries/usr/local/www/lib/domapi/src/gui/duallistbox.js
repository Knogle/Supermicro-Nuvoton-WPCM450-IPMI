//==============================================
// DomAPI Dual Listbox Component
// D. Kadrioski 12/24/2002
// (c) Nebiru Software 2001,2003
//==============================================

domapi.loadUnit("listbox");
domapi.loadUnit("button" );
domapi.loadUnit("drag"   );
domapi.registerComponent("duallistbox");
//------------------------------------------------------------------------------
domapi.Duallistbox = function(arg){return domapi.comps.duallistbox.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.duallistbox.constructor = function(arg){
  var w            = domapi.rInt(arg.w,350);
  var h            = domapi.rInt(arg.h,200);   
  var list1        = domapi.rVal(arg.list1);
  var list2        = domapi.rVal(arg.list2);
  arg.w            = w;
  arg.h            = h; 
  var e            = domapi.Component(arg, "duallistbox");
  e.btnW           = domapi.rInt(arg.btnW   ,80);
  e.btnH           = domapi.rInt(arg.btnH   ,25);
  e.padW           = domapi.rInt(arg.padW   ,10);
  e.padH           = domapi.rInt(arg.padH   ,10);
  e.btnPadW        = domapi.rInt(arg.btnPadW,10);
  e.btnPadH        = domapi.rInt(arg.btnPadH,10);
  e.btnAlign       = domapi.rInt(arg.btnAlign,"middle");
  var t            = e.theme;
  e.list1          = Listbox({parent:e, theme:t});
  e.list2          = Listbox({parent:e, theme:t});
  e.btn1           = Button({ parent:e, theme:t, text:"&gt;&gt;",x:0,y:0});
  e.btn2           = Button({ parent:e, theme:t, text:"&lt;&lt;",x:0,y:0});

  e.list1.delimitedText(list1);
  e.list2.delimitedText(list2);
  e.list1.ondragdrop = function(src){return src == this.parentNode.list2};
  e.list2.ondragdrop = function(src){return src == this.parentNode.list1};
  e.btn1._dir        = 0;
  e.btn2._dir        = 1;
  e.btn1.onclick     = e.btnClick;
  e.btn2.onclick     = e.btnClick;

  e.reDraw();
  e.allowDrag(true);
  return e;
};
//------------------------------------------------------------------------------
domapi.comps.duallistbox.reDraw = function(){
  this.duallistboxReDraw();
  this.onredraw();
};
//------------------------------------------------------------------------------
domapi.comps.duallistbox.duallistboxReDraw = function(){
  var e         = this;
  var s         = e.style;
  var t         = e.theme;
  e.setB(         t.bdrWidth+1);  // set border width *before* border style!!
  e.setBgColor(   e.doBGFill?t.ctrlBgColor:"transparent");
  s.borderStyle = e.doBorder?t.bdrFrame:"none";

  var w         = e.getW();
  var h         = e.getH();
  var b         = e.getB();
  var listW     = parseInt((w - e.padW*2 - e.btnPadW*2 - e.btnW)/2);
  var listH     = h - (e.padH*2) - b[0] - b[2];
  var btnX      = parseInt((w/2) - (e.btnW/2)) - b[1];
  var btnY      = parseInt(h/2)  - e.btnH - e.btnPadH;
  e.list1.moveTo( e.padW,e.padH);
  e.list1.setSize(listW,listH);

  e.list2.moveTo( (w - listW - e.padW - b[1] - b[3]),e.padH);
  e.list2.setSize(listW,listH);
  e.btn1.setSize( e.btnW,e.btnH);
  e.btn1.moveTo(  btnX,btnY);

  e.btn2.setSize( e.btnW,e.btnH);
  e.btn2.moveTo(  btnX,btnY + e.btnH + e.btnPadH*2);

  e.list1.theme = t;
  e.list2.theme = t;
  e.btn1.theme  = t;
  e.btn2.theme  = t;
  e.list1.reDraw();
  e.list2.reDraw();
  e.btn1.reDraw();
  e.btn2.reDraw();
};
//------------------------------------------------------------------------------
domapi.comps.duallistbox.allowDrag = function(b){
  var e = this;
  var l1 = e.list1.items;
  var l2 = e.list2.items;
  e._dragOn = b;
  
  var i,j;
  for(j=0;j<2;j++){
    if(j==0)L = l1;else L = l2;
    for(i=0;i<L.length;i++){
      if(!L[i]._isElm){
        domapi.Elm(L[i].id);
        L[i]._isElm = true;
      }
      if(b){
        if(!L[i]._dragOn)L[i].turnOnDrag(null,domapi.drag.dtDragDrop,0,null,null,domapi.comps.duallistbox.cleanUp);
        L[i]._dragOn = true;
      }else{
        if(L[i]._dragOn)L[i].turnOnOff();
        L[i]._dragOn = false;
      }
    }
  }
};
//------------------------------------------------------------------------------
domapi.comps.duallistbox.btnClick = function(){
  var e  = this;         // button
  var r  = e.parentNode; // root
  var l1 = r.list1;
  var l2 = r.list2;
  var f,t;               // from, to
  if(e._dir){f = l2; t = l1}else{f = l1; t = l2}
  for(var a=f.selected.length-1;a>-1;a--){
    f.selected[a].selected = false;    
    domapi.transferElm(f.selected[a],t);
    f.selected.deleteItem(a);
  }
  r.cleanUp();
};
//------------------------------------------------------------------------------
domapi.comps.duallistbox.cleanUp = function(){
  var e  = (this.DA_TYPE=="DRAG")?this.elm.parentNode.parentNode:this;
  var l1 = e.list1;
  var l2 = e.list2;
  
  var l,s,i,b;
  for(var a=0;a<2;a++){// execute once for each listbox
    // get some pointers
    if(a)l = l1;else l = l2;
    s = l.selected;
    i = l.items;
    // make sure the items in selected actually belong to this list
    for(b=s.length-1;b>-1;b--)
      if(s[b].parentNode != l)s.deleteItem(b);
    // make sure that only the items in selected are really selected
    // make sure at least one item is selected
    if(s.length<1 && i.length>0)l.selectItem(0);
    // make sure not more than one is selected
    if(s.length>1)
      for(b=s.length-1;b>0;b--){
        s[b].selected = false;
        s.deleteItem(b);
      }alert(s.length);
    l.reDraw();
  }
  
  //e.reDraw();
};
//------------------------------------------------------------------------------
