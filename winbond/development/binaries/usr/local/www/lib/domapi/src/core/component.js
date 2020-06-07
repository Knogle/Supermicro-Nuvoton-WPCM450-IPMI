//------------------------------------------------------------------------------
// DomAPI domapi routines
// D. Kadrioski 6/1/2002
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

domapi._private.component = {};
//------------------------------------------------------------------------------
domapi.registerComponent = function(nm){
  domapi.bags[nm]             = [];
  domapi.bags[nm].isComponent = true;
  domapi.comps[nm]            = {};
  domapi._private[nm]         = {};

  var T = domapi.theme;
  // preload
  if(T.preloadImages[nm] && T.skin.preloaded.indexOf(nm) < 0 && domapi.doPreloadImages){
    T.preloadImages[nm]();
    T.skin.preloaded.push(nm);
  }  
};
//------------------------------------------------------------------------------
domapi.Component = function(arg,compClass,delay,t){
  // delay means skip inheritance, default is false
  // t is HTMLElement type, default is DIV
  var e,c,i;
  try{
    if(t)arg["type"]    = t;
    if(domapi.theme.preDefaults[compClass])domapi.theme.preDefaults[compClass](arg);
    var _skipAdd        = arg["skipAdd"];
    arg["skipAdd"]      = true;
    e                   = domapi.Elm(arg);
    arg["skipAdd"]      = _skipAdd;
    // note: the following values can be overwritten in the arg, actual overwrite
    // takes place near the end of this function - this is faster than asserting
    e.enabled           = true;
    e.doRollover        = true;
    e.doBorder          = true;
    e.doDepress         = true;
    e.doBGFill          = true;
    e.doRolloverFill    = true;
    e.doAllowDrag       = false;
    e._inUpdate         = false;
    e.daWantTabs        = true;
  
    // inherit the component class
    c = domapi.componentProto;
    for(i in c)
      e[i] = c[i];
  
    e._draw             = function(){};    // abstract, implementation by component author is required
    e._layout           = function(w,h){}; // abstract, implementation by component author is required
    e._saveToJson       = function(){};    // abstract, implementation by component author is optional
    e._loadFromJSON     = function(s){};   // abstract, implementation by component author is optional
    e._setEnabled       = function(b){};   // abstract, implementation by component author is optional
    e.onlayout          = function(){};    // abstract, implementation by page author is optional
    e.ondraw            = function(){};    // abstract, implementation by page author is optional
    e._toString         = function(){return '[object '+this.DA_TYPE+', id='+this.id+']';};     //implementation by component author is optional
  
    e.DA_TYPE           = compClass.toUpperCase();
    domapi.css.addClass(e, "DA_COMPONENT");
    domapi.css.addClass(e, "DA_" + e.DA_TYPE);
    if(arg.position == "relative")
      domapi.css.addClass(e, "DA_RELATIVE");
  
    e.isComponent       = true;
    e[domapi.toMixedCase("is " + compClass)] = true; // isButton, isLabel, etc...
    if(!delay)domapi._inherit(e,compClass);
    e.toString          = function(){return this._toString();};
    // add any theme specific defaults
    if(domapi.theme.postDefaults[compClass])domapi.theme.postDefaults[compClass](arg);
    // push any remaining arg values into the elm
    // note, these could override the values we set above
  
    // thanks to moz1.x highjacking what should be user-defined vars, we need to remove
    // certain keys from the arg.
    // x and y have no setters in IMG and some other tags
    if(!domapi.isKHTML){
      delete(arg["x"]);
      delete(arg["y"]);
    }
    try{ // in case moz highjacks any others, we'll trap for possible errors with setters
      for(i in arg)
        e[i] = arg[i];
    }catch(e){
      throw new Error("Error applying '" + i + "=" + arg[i] + "' in domapi.Component():\n" + e.message);
    }
    var bag             = domapi.bags[compClass];
    bag[bag.length]     = e;
    // hang on to the arg in case we need it during instantiation, we'll delete it after domapi._finalizeComp() fires
    e._arg              = arg;  
    if(domapi.trace)dump(e.toString()+' domapi.Component() CREATED');
    domapi.Component.count++;
    if(domapi.Component.count == 1 && domapi.isIE)
      domapi.addEvent(document, "click", domapi._private.component._dodocumentblurclick);
    return e;
  }finally{
    e   = null;
    bag = null;
  }
};
domapi.Component.count = 0;
//------------------------------------------------------------------------------
domapi._private.component._rectifyComp = function(e){
  // when using delayed creation in mozilla, the box correcting fails.
  // to counteract this, call this method before calling _finalizeComp
  // on any components that have a border
  if(domapi.trace)dump(e.toString()+'._rectifyComp()<--');
  if(domapi.isGecko && !e.added && !domapi.isStrict){
    var b = (e.doBorder?domapi.theme.border.width:0)*2;
    if(e.tagName == "TABLE")b = 0;
    e._arg["w"] = domapi.rInt(e._arg["w"])-b;
    e._arg["h"] = domapi.rInt(e._arg["h"])-b;
    e.setSize(e._arg["w"], e._arg["h"], true);
  }
  if(domapi.trace)dump(e.toString()+'._rectifyComp()-->');
};
//------------------------------------------------------------------------------
domapi._finalizeComp = function(e){
  domapi._private.component._rectifyComp(e);
  if(domapi.trace)dump(e.toString()+'._finalizeComp()<--');
//  if(domapi.isGecko && !e.added)e._arg["skipDraw"] = true;
  if(!e._arg["skipDraw"  ])e.draw();  
  if(!e._arg["skipLayout"] && !e._layoutWasCalled)e.layout();
  if(!e.added && !e.skipAdd){ // common to all components (that use delayed loading)
    if(!e._arg["parent"])e._arg["parent"] = document.body;
    e._arg["parent"].appendChild(e);
    if(e._iframeShield)e._arg["parent"].appendChild(e._iframeShield);
    e.added = true;
  }
  // process 'attachToForm' info if present
  if(e._arg["formName"])
    e.attachToForm(document.forms[e._arg["formName"]], e._arg["elementName"]);
  // allow focusing if tabIndex present
  // passing -1 bypasses the automatic registration of tabbing
  if(e._arg["tabIndex"] && e._arg["tabIndex"] > -1)e.setTabIndex(e._arg["tabIndex"]);
  if(domapi.isGecko){
    delete e._arg;
    delete e._layoutWasCalled;
  }else{
    e._arg             = null;
    e._layoutWasCalled = null;
  }
  if(domapi.trace)dump(e.toString()+'._finalizeComp()-->');
};
//------------------------------------------------------------------------------
domapi._inherit = function(e,compClass){
  var proto = domapi.comps[compClass];
  for(var a in proto)e[a] = proto[a];
  e.ancestor = compClass;
};
//------------------------------------------------------------------------------
domapi._freeComponent = function(e){
  e._draw             = null;
  e._layout           = null;
  e._saveToJson       = null;
  e._loadFromJSON     = null;
  e._setEnabled       = null;
  e.onlayout          = null;
  e.ondraw            = null;
  e._toString         = null;
  e.toString          = null;
  e.parent            = null;
  if(e._daTabEdit)e._daTabEdit._daowner = null;
  e._daTabEdit        = null;
  e._formElement      = null;

  if(e._free){
    e._free();
    e._free = null;
  }
  domapi._freeElm(e);
  e.freed = true;
  //e = null;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// 'attachToForm' support
//------------------------------------------------------------------------------
domapi._attachToForm = function(f,n,v){
  e = document.createElement("INPUT");
  e.setAttribute("type","hidden");
  e.name  = n;
  //e.value = "";
  f.appendChild(e);
  //------
  if(!domapi.isNil(v))domapi._setFormElementValue(e,v);
  return e;
};
//------------------------------------------------------------------------------
domapi._setFormElementValue = function(e,v){
  if(!e)return false;
  //e.setAttribute("value",v);
  e.value = v;
  return true;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// tabkey and focus support
//------------------------------------------------------------------------------
domapi._private.component._daonfocus = function(E){
  var e = domapi.getTarget(E);
//  if(e.focused)return;
  if(e._daowner)e._daowner.daFocus();
  return true;
};
//------------------------------------------------------------------------------
domapi._private.component._daonblur = function(E){
  var e = domapi.getTarget(E);
  if(domapi.trace)dump(e.toString()+'._daonblur()<--');
  if(e._daowner)e._daowner.daBlur();
  if(domapi.trace)dump(e.toString()+'._daonblur()-->');
};
//------------------------------------------------------------------------------
domapi._private.component._daFocus = function(){
  if(!this.enabled)return;
  if(domapi.trace)dump(this.toString()+'._daFocus()<--');
  if(typeof domapi.focusedElm != "undefined" && domapi.focusedElm != this)
    domapi.focusedElm.daBlur();  
  domapi.css.addClass(this, "DA_FOCUSED");
  domapi.focusedElm = this;
  this.focused      = true;  
  if(this._ondafocus)this._ondafocus();
  if(this.ondafocus)this.ondafocus();
  if(domapi.trace)dump(this.toString()+'._daFocus()-->');
};
//------------------------------------------------------------------------------
domapi._private.component._daBlur = function(){
  if(domapi.trace)dump(this.toString()+'._daBlur()');
  var _wasFocused = this.focused;
  this.focused    = false;
  //domapi.focusedElm = null;
  if(!_wasFocused)
    setTimeout("domapi._private.component._daBlurHelper('"+this.id+"')",10);
};
//------------------------------------------------------------------------------
domapi._private.component._daBlurHelper = function(id){
  // in the event that the control is being blurred and focused again quickly,
  // this allows us to ignore the blur and avoid any 'flicker' - job000176
  var e = domapi.getElm(id);
  if(domapi.trace)dump(e.toString()+'._daBlurHelper(focused='+e.focused+')');
  if(e && !e.focused){
    domapi.css.removeClass(e, "DA_FOCUSED");
    if(e._ondablur)e._ondablur();
    if(e.ondablur)e.ondablur();
  }
  e = null;
};
//------------------------------------------------------------------------------
domapi._private.component._doclick = function(E){//alert(2)//return true;
  var e = domapi.getTarget(E);
  var _e = e;
  while(e){
    if(e._daTabEdit){ // element has focus support
      if(!domapi.isIE){
        e._daTabEdit.style.top = e.getY() - _e.scrollTop + "px";
        setTimeout('try{document.getElementById("'+e._daTabEdit.id+'").focus()}catch(E){}', 10);
      }else
        setTimeout('try{document.getElementById("'+e.id+'").daFocus()}catch(E){}', 10);
      break;
    }
    e = e.parentNode;
  }
  e = null;
  return true;
};
//------------------------------------------------------------------------------
domapi._private.component._dodocumentblurclick = function(E){
  if(!domapi.focusedElm)return;
  var e = domapi.getTarget(E);
  while(e){
    if(e._daTabEdit)
      break;
    e = e.parentNode;
  }
  if(!e)
    domapi.focusedElm.daBlur();
  else{
    if(document.activeElement && document.activeElement.tagName != "BODY" &&  document.activeElement.blur)
      try{
        document.activeElement.blur();
        e.focus();
      }catch(E){}
  }
  e = null;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// everything from here down is the Component class
//------------------------------------------------------------------------------
domapi.componentProto = {};
//------------------------------------------------------------------------------
domapi.componentProto.draw = function(){
  if(domapi.trace)dump(this.toString() + '.componentProto.draw()<--');
  this._draw();
  this.ondraw();
  if(domapi.trace)dump(this.toString() + '.componentProto.draw()-->');
};
//------------------------------------------------------------------------------
domapi.componentProto.free = function(){if(this._free)this._free()};
//------------------------------------------------------------------------------
domapi.componentProto.drawAndLayout = function(){
  if(domapi.trace)dump(this.toString() + '.componentProto.drawAndLayout()<--');
  this.draw();
  this.layout();
  if(domapi.trace)dump(this.toString() + '.componentProto.drawAndLayout()-->');
};
//------------------------------------------------------------------------------
domapi.componentProto.layout = function(w,h){ // w and h override getting actual values, needed if not in dom yet
  if(this._inLayout || this._inUpdate)return;
  if(domapi.trace)dump(this.toString() + '.componentProto.layout('+w+','+h+')<-- _inLayout = '+this._inLayout+' _inUpdate = '+this._inUpdate);  
  if(!this.added && this._arg){
    w = this._arg["w"];
    h = this._arg["h"];
  }
  if(!w)w = this.getW();
  if(!h)h = this.getH();
  if(!h && !w){
    if(domapi.trace)dump(this.toString() + '.componentProto.layout() EARLY-->');
    return;
  }
  this._inLayout = true;
  this._layout(w,h);
  this.onlayout(w,h);
  this._inLayout        = false;
  this._layoutWasCalled = true;
  if(domapi.trace)dump(this.toString() + '.componentProto.layout('+w+','+h+')-->');
};
//------------------------------------------------------------------------------
domapi.componentProto.beginUpdate = function(){
  if(domapi.trace)dump(this.toString() + '.componentProto.beginUpdate()');
  this._inUpdate = true;
};
//------------------------------------------------------------------------------
domapi.componentProto.endUpdate   = function(){
  if(domapi.trace)dump(this.toString() + '.componentProto.endUpdate()');
  this._inUpdate = false;this.drawAndLayout();
};
//------------------------------------------------------------------------------
domapi.componentProto.saveToJson   = function(){return this._saveToJson()};
//------------------------------------------------------------------------------
domapi.componentProto.loadFromJSON = function(s){this._loadFromJSON(s)};
//------------------------------------------------------------------------------
domapi.componentProto.setTabIndex = function(i){
  if(domapi.trace)dump(this.toString() + '.componentProto.setTabIndex()');
  if(this._setTabIndex){
    this._setTabIndex(i);
  }else{
    this.tabIndex   = -1;
    this.daTabIndex = i;
    if(typeof this._daTabEdit == "undefined"){
      // create the edit control to use for tab management/keystroke hooking
      if(domapi.isIE){
        this._daTabEdit = this;
        this.hideFocus = true;
        var p = domapi._private.component;
        var e = this;
        e._daowner = this;
        e.daFocus  = p._daFocus;
        e.daBlur   = p._daBlur;      
//        e.onfocus  = p._daonfocus;
        e.onblur   = p._daonblur;
        domapi.addEvent(e, "click", p._doclick);
      }else{
        this._daTabEdit = document.createElement("INPUT");
        var e = this._daTabEdit;
        var s = e.style;
        var p = domapi._private.component;
        e.setAttribute("TYPE","TEXT");      
        domapi.addEvent(this, "click", p._doclick);
        e.id              = domapi.guid();
        s["mozUserFocus"] = "normal";
        s.position        = "absolute";
        s.left            = "-1000px";
        s.top             = this.offsetTop + "px";
        e._daowner        = this;
        e.DA_TYPE         = "FOCUSEDIT";
        this.daFocus      = p._daFocus;
        this.daBlur       = p._daBlur;      
        e.onfocus         = p._daonfocus;
        e.onblur          = p._daonblur;
         if(this.parentNode)
          this.parentNode.appendChild(e);
      }
    }
    this._daTabEdit.tabIndex = i;
  }
  s = null;
  e = null;
};
//------------------------------------------------------------------------------
domapi.componentProto.getTabIndex = function(i){
  if(domapi.trace)dump(this.toString() + '.componentProto.getTabIndex()');
  if(this._getTabIndex){
    return this._getTabIndex();
  }else{
    return this.tabIndex;
  }
};
//------------------------------------------------------------------------------
domapi.componentProto.setFocus = function(){
  if(this._daTabEdit)
    if(domapi.isIE){
      this.daFocus();
      this._daTabEdit.focus();
    }else try{
      this._daTabEdit.focus();
    }catch(E){}
};
//------------------------------------------------------------------------------
domapi.componentProto.setBlur  = function(){if(this._daTabEdit)this._daTabEdit.blur()};
//------------------------------------------------------------------------------
domapi.componentProto.attachToForm = function(f,n){
  this._formElement = domapi._attachToForm(f,n);
  this.setValue(this.value);
};
//------------------------------------------------------------------------------
domapi.componentProto.setFormValue = function(v){domapi._setFormElementValue(this._formElement, v)};
//------------------------------------------------------------------------------
domapi.componentProto.setEnabled = function(b){
  this.enabled = b;
  this._setEnabled(b);
  if(this.daBlur)
    this.daBlur();
  this.drawAndLayout();
};
//------------------------------------------------------------------------------
domapi.componentProto.getValue = function(sep){
  if(this._getValue)return this._getValue(domapi.rVal(sep,"\n"));
  return this.value;
};
//------------------------------------------------------------------------------
domapi.componentProto.setValue = function(v){
  if(domapi.trace)dump(this.toString() + '.componentProto.setValue()<--');
  if(this._setValue){
    if(!this._setValue(v)){
      if(domapi.trace)dump(this.toString() + '.componentProto.setValue()-->');
      return false;
    }
  }else this.value = v;
  domapi._setFormElementValue(this._formElement, String(this.getValue()));
  if(this.onchange)this.onchange(this.value);
  if(domapi.trace)dump(this.toString() + '.componentProto.setValue()-->');
};
//------------------------------------------------------------------------------
domapi.componentProto.ondragallow = function(arg){return(this.doAllowDrag)};
//------------------------------------------------------------------------------