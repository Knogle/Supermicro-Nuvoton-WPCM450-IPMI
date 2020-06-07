//==============================================
// DomAPI XulReader Object
// P. Fricard <pfricard@wanadoo.fr> 03.10.2004
// Version Alpha 1
//==============================================

domapi.loadUnit("xmlcore");
domapi.loadUnit("packer");

domapi.XulReader = function(arg){
  var xr = new domapi._XulReader(arg);
  try{
    if (xr.uri)
      xr.loadFromUri(xr.uri);
    else if (xr.xmlstr)
      xr.loadFromString(xr.xmlstr);
    else if (xr.xmlnode)
      xr.proceedNode(xr.xmlnode);
    else if (xr.xmldoc)
      xr.proceed();
  
    return xr;
  }finally{
    xr = null;
  }
};

domapi._XulReader = function(arg){
  var xr = this;
  try{
    for (var i in arg) xr[i] = arg[i];
    xr.xmldoc = domapi.xml.getDomDocument();
    xr.xmldoc.async = false;
    xr.container = xr.parent ? xr.parent : null;
  }finally{
    xr = null;
  }
};

domapi._XulReader.prototype.loadFromUri = function(uriXul){
  this.xmldoc.load(uriXul);
  this.proceed();
};

domapi._XulReader.prototype.loadFromString = function(strXul){
  this.xmldoc.loadXML(strXul);
  this.proceed();
};

domapi._XulReader.prototype.proceed = function(){
  if (! this.xmldoc.documentElement || this.xmldoc.documentElement.tagName == "parsererror") throw new Error("Undefined root node. Xml could be badly formed.");
  this.proceedNode(this.xmldoc.documentElement);
};

domapi._XulReader.prototype.proceedNode = function(node, c){
  if (! node || node.tagName == "parsererror") throw new Error("Undefined node. Xml could be badly formed.");

  var e = null;
  var recurs = true;
  var dopack = true;
  var h;
  var side = "top";
  var vAnchor = null;
  try{
    if (! c)
      c = this.container;
    else
      side = domapi.rVal(c.defaultSide, "top");
  
    if (node.nodeType == 1){
      var nodename = node.tagName.toLowerCase();
      var pTag = "";
  
      if (this["_" + nodename]){
        res = this["_" + nodename](node, c);
        c = res[0];
        e = res[1];
        }
      switch (nodename){
        case "xml":
            e = c;
            dopack = false;
            break;
        //Element without packing
        case "window":
        case "caption":
            dopack = false;
            break;
        //Element without recursion
        case "button":
        case "spacer":
        case "description":
        case "label":
        case "textbox":
        case "listbox":
        case "menulist":
            recurs = false;
            break;
        //specific treatments
        case "groupbox":
            e = domapi.Elm({ parent: c, type: "fieldset", x: 0, y: 0});
            l = domapi.Elm({ parent: e, type: "legend"});
            if (node.hasChildNodes()){
              //find first element
              for (i = 0; i < node.childNodes.length; i++)
                if (node.childNodes[i].nodeType == 1) break;
                ncapt = node.childNodes[i];
                if (ncapt.tagName == "caption"){
                  l.setText(ncapt.getAttribute("label"));
                  if (ncapt.childNodes.length > 0) l.setText(ncapt.xml);
                }
              }
            h = domapi.Elm({parent:e});
            break;
        case "vbox":
            switch (e._align){
              case "start":
                  vAnchor = "n";
                  break;
              case "center":
                  vAnchor = "c";
                  break;
              case "end":
                  vAnchor = "s";
                  break;
              }
            side = "top";
            break;
        case "box":
            for (var a = 0; a < node.attributes.length; a++){
              att = node.attributes[a];
              switch (att.name){
                case "orient": att.value == "vertical" ? "top" : "left";
                }
              }
            break;
        case "bbox":
        case "hbox":
            switch (e._align){
              case "start":
                  vAnchor = "w";
                  break;
              case "center":
                  vAnchor = "c";
                  break;
              case "end":
                  vAnchor = "e";
                  break;
              }
            side = "left";
            break;
        default:
            sTag = nodename.split(":");
  
            if (node.parentNode)
              pTag = node.parentNode.tagName.toLowerCase().split(":")[0];
  
            if (sTag[0] == "html"){
              if (sTag[1] == "script"){
                sScript = "";
                for (var cni = 0; cni < node.childNodes.length; cni++){
                  if (node.childNodes[cni].nodeType == 3){
                    if (node.childNodes[cni].nodeValue){
                    sScript += node.childNodes[cni].nodeValue;
                      }
                    }
                  }
                eval(sScript);
                }
  
              else{
                if (pTag != "html") e = domapi.Elm({ parent: c});
  
                if (e) e.style.whiteSpace = "nowrap";
                h = domapi.Elm({ parent: pTag != "html" ? e : c, type: sTag[1], skipStyle: true});
  
                domapi.xml.applyAttributes(node, h);
                for (var a = 0; a < node.childNodes.length; a++)
                    otmp = this.proceedNode(node.childNodes[a], h);
                }
              }
            recurs = false;
            break;
        }
  
      //Proceed subnode and rendering
      if (e && dopack){
        e.packerOn({ anchor: c.defaultSide == "left" ? "n" : "w", side: c.defaultSide});
  
        var opt = e.packer.opt;
  
        if (node.getAttribute("flex")){
          opt.expand = "yes";
          opt.fill = c.defaultSide == "left" ? "x" : "y";
          opt.fill = "both";
          opt.yweight = opt.xweight = Number(node.getAttribute("flex"));
          }
  
        if (nodename.match(new RegExp("^.{0,1}box"))) opt.fill = "both";
  
        if (node.parentNode.tagName.toLowerCase() == "bbox") opt.anchor = "s";
  
        if (h) opt.fill = "both";
  
        if (c.defaultAnchor){
          opt.anchor = c.defaultAnchor;
          opt.expand = "yes";
          }
  
        if (nodename == "groupbox"){
          opt.padLeft = 1;
          opt.ipadX = 4;
          opt.padBottom = 8;
  
          if (domapi.isIE)
            opt.marginTop = 15;
  
          if (domapi.isGecko)
            opt.marginLeft = - 22;
          }
        }
  
      //if no element set element to container
      if (! e) e = c;
  
      //Store pointer to the element in a reader property
      if (e)
        if (e.id && ! this[e.id.replace(new RegExp("-"), "_")])
          this[e.id.replace(new RegExp("-"), "_")] = e;
  
      //Recurse call if required
      if (node.hasChildNodes()){
        if (node.nodeType != 2 && recurs){
          e.defaultSide = side;
          e.defaultAnchor = vAnchor;
  
          for (var a = 0; a < node.childNodes.length; a++)
              this.proceedNode(node.childNodes[a], pTag == "html" ? h : e);
  
          if (nodename == "groupbox" && domapi.isGecko){
            e.packer.origH = e.getH() - 42;
            e.packer.origW = e.parentNode.getW() - 24;
            }
  
          if (e.packerChildren){
            //adjust size of the element on initialization
            if (nodename == "window" && c.DA_TYPE == "WINDOW"){
              domapi.packer.render(e, true);
              c.adjustSize();
              e.packer.origW = e.getW();
              e.packer.origH = e.getH();
              }
            else{
              robj = domapi.packer.render(e, false);
              e.setSize(robj.width, robj.height);
              e.packer.origW = robj.width;
              e.packer.origH = robj.height;
              }
            }
          }
        }
      }
  
    if (node.nodeType == 3){
      if (node.nodeValue){
        var newText = document.createTextNode(node.nodeValue);
        c.appendChild(newText);
        }
      }
  }finally{
    e     = null;
    c     = null;
    res   = null;
    l     = null;
    ncapt = null;
    opt   = null;
    h     = null;
    otmp  = null;
  }
};

domapi._XulReader.prototype._bbox = function(node, c){
  return this._box(node, c);
};

domapi._XulReader.prototype._box = function(node, c){
  var e = domapi.Elm({ parent: c, x: 0, y: 0});
  var att;
  try{
    e.setText("&nbsp;");
  	
    if (node.attributes.length > 0)
      for (var a = 0; a < node.attributes.length; a++){
        att = node.attributes[a];
        switch (att.name){
          case "id":
              e.id = att.value;
              break;
          case "style":
              e.setStyleFromString(att.value);
              break;
          case "width":
              e.setW(Number(att.value));
              break;
          case "height":
              e.setH(Number(att.value));
              break;
          case "align":
              e._align = att.value;
              break;
          }
        }
  
    return [c, e];
  }finally{
    e = null;
  }
};

domapi._XulReader.prototype._button = function(node, c){
  if (!domapi.unitLoaded("button")) throw new Error("Button unit required");
  var att;
  var e = domapi.Button({ parent: c, x: 0, y: 0, text: node.getAttribute("label")});
  try{
    if (node.attributes.length > 0)
      for (var a = 0; a < node.attributes.length; a++){
        att = node.attributes[a];
        switch (att.name){
          case "id":
              e.id = att.value;
              break;
          case "width":
              e.setW(Number(att.value));
              break;
          case "height":
              e.setH(Number(att.value));
              break;
          case "style":
              e.setStyleFromString(att.value);
              break;
          case "disabled":
              if (att.value == "true")
                e.setEnabled(false);
              break;
          case "onclick":
              eval("e.onclick = function(){" + att.value + "}");
              break;
          }
        }
  
    return [c, e];
  }finally{
    e = null;
  }
};

domapi._XulReader.prototype._description = function(node, c){
  return this._label(node, c);
};

domapi._XulReader.prototype._hbox = function(node, c){
  return this._box(node, c);
};

domapi._XulReader.prototype._label = function(node, c){
  var e, att;
  try{
    if (node.parentNode.tagName != "groupbox")
      e = domapi.Elm({ parent: c, x: 0, y: 0});
    else
      e = domapi.Elm({ parent: c});
  
    e.style.whiteSpace = "nowrap";
  
    for (var a = 0; a < node.attributes.length; a++){
      att = node.attributes[a];
      switch (att.name){
        case "id":
            e.id = att.value;
            break;
        case "value":
            e.setText(att.value);
            break;
        }
      }
  
    if (node.childNodes.length > 0)
      e.setText(node.childNodes[0].nodeValue);
  
    tw = domapi.textWidth(e.innerHTML);
    if (tw)
      e.setW(tw);
  
    return [c, e];
  }finally{
    e = null; att = null;
  }
};

domapi._XulReader.prototype._listbox = function(node, c){
  var nChild, e;
  //Check listcols item exist
  //if it exist the listbox could be considered as a listgrid
  //if it doesn't exist listox is a listbox with one col
  var nCols = node.selectSingleNode("listcols");
  try{
    if (nCols){
      if (!domapi.unitLoaded("listgrid")) throw new Error("Listgrid unit required");
      //Headers
      nHead = node.selectSingleNode("listhead");
      nHeaders={};
      var bDoShowHeader = false;
      if (nHead){
        nHeaders = nHead.selectNodes("listheader");
        bDoShowHeader = true;
    
        }
      //Columns
      nlCol = nCols.selectNodes("listcol");
      
      //Calculate listgrid min width
      var minWidth = 0;
      for (var a = 0; a < nlCol.length; a++){
        minWidth += domapi.Dataset.prototype.defaultColWidth;
        }
      e = domapi.Listgrid({ parent: c, w: minWidth, h: 100, x: 0, y: 0, doShowHeader: bDoShowHeader,doShowRowbar: false, doVirtualMode: false});
      e.setGridlines("none");
      var D = e.data;
      
      for (var a = 0; a < nlCol.length; a++){
        if(nHeaders[D.cols.length])
          D.cols.push({ text: nHeaders[D.cols.length].getAttribute("label"), fieldName: nHeaders[D.cols.length].getAttribute("label")});
        else
          D.cols.push({ text: "Col" + a, fieldName: "Col" + a});
        }
  
      //Rows
      nRows = node.selectNodes("listitem");
      for(var a = 0; a < nRows.length; a++){
        nCells = nRows[a].selectNodes("listcell");
        R = {cells:[]};
        for(var i = 0; i < nCells.length; i++){
          R.cells.push({text: nCells[i].getAttribute("label"), value: nCells[i].getAttribute("label")});
          }
        D.rows.push(R);
        }
      D.dataChanged();
      if (D.rows.length > 0) e.currentRow = 0;
      if (D.cols.length > 0) e.currentCol = 0;
      e.refresh();
      }
  
    else{
    if (!domapi.unitLoaded("listbox")) throw new Error("Listbox unit required");
      e = domapi.Listbox({ parent: c, w: 200, x: 0, y: 0});
  
      for (var a = 0; a < node.childNodes.length; a++)
          if (node.childNodes[a].nodeType == 1){
            e.addItem({ text: node.childNodes[a].getAttribute("label")});
          }
  
      for (var a = 0; a < node.attributes.length; a++){
        att = node.attributes[a];
        switch (att.name){
          case "id":
              e.id = att.value;
              break;
          case "style":
              e.setStyleFromString(att.value);
              break;
          case "rows":
              e.setH(16 * att.value);
              break;
          }
        }
      }
  
    return [c, e];
  }finally{
    nChild   = null;
    nCols    = null;
    nHead    = null;
    nHeaders = null;
    nlCols   = null;
    D        = null;
    R        = null;
    e        = null;
    nCells   = null;
  }
};

domapi._XulReader.prototype._menulist = function(node, c){
  if (!domapi.unitLoaded("combobox")) throw new Error("Combobox unit required");
  var e = domapi.Combobox({ parent: c, w: 100, x: 0, y: 0});
  var att;
  try{
    var selIndex = null;
  
    var nPopup = node.selectSingleNode("menupopup");
    var nlMenuItem = nPopup.selectNodes("menuitem");
    for (var a = 0; a < nlMenuItem.length; a++){
          e.addItem(nlMenuItem[a].getAttribute("label"));
          if (nlMenuItem[a].getAttribute("selected") == "true")
            e.selectItem(a);
          }
  
    for (var a = 0; a < node.attributes.length; a++){
      att = node.attributes[a];
      switch (att.name){
        case "id":
            e.id = att.value;
            break;
        case "style":
            e.setStyleFromString(att.value);
            break;
        case "rows":
            e.dropdown.setH(16 * att.value);
            break;
        }
      }
  
    return [c, e];
  }finally{
    e = null;
    nPopup = null;
    nlMenuItem = null;
  }
};

domapi._XulReader.prototype._spacer = function(node, c){
  var e,att;
  e = domapi.Elm({ parent: c, w: 1, h: 1, x: 0, y: 0});
  try{
    for (var a = 0; a < node.attributes.length; a++){
      att = node.attributes[a];
      switch (att.name){
        case "id":
            e.id = att.value;
            break;
        case "style":
            e.setStyleFromString(att.value);
            break;
        }
      }
  
    return [c, e];
  }finally{
    e = null;
  }
};

domapi._XulReader.prototype._textbox = function(node, c){
  var e,att;
  e = domapi.Elm({ parent: c, type: "input", skipAdd: true, x: 0, y: 0, h: 16});
  try{
    if (node.getAttribute("type")){
      if (node.getAttribute("type") == "autocomplete"){
      if (!domapi.unitLoaded("form")) throw new Error("Form unit required");
        e.type = "text";
        e.setB(2);e.setP(1);
        domapi.autocompleteOn(e, ["red", "orange", "yellow", "green", "gray", "blue", "indigo", "violet", "brown"])
        }
      else
        e.type = node.getAttribute("type");
        
      }
    c.appendChild(e);
    for (var a = 0; a < node.attributes.length; a++){
      att = node.attributes[a];
      switch (att.name){
        case "id": e.id = att.value;
        case "type": break;
        case "style":
            e.setStyleFromString(att.value);
            break;
        case "size":
            e.size = att.value;
            break;
        case "maxlength":
            e.maxLength = att.value;
            break;
        case "readonly":
            e.readOnly = (att.value == "true");
            break;
        case "disabled":
            e.disabled = (att.value == "true");
            break;
        case "value":
            e.value = att.value;
            break;
        default: break;
        }
      }
    if (e.type == "text" || e.type == "password"){
          e.setB(2);e.setP(1);   
          }
    return [c, e];
  }finally{
    e = null;
  }
};

domapi._XulReader.prototype._vbox = function(node, c){
  return this._box(node, c);
};

domapi._XulReader.prototype._window = function(node, c){
  if (!domapi.unitLoaded("window")) throw new Error("Window unit required");
  var c,att;
  var e = null;
  try{
    if (! c){
      c = domapi.Window({ x: this.x, y: this.y, w: 200, h: 100});
      c.onendresize = function(){
        if (this.getW() < this.minWidth)
          this.setW(this.minWidth);
        if (this.getW() > this.maxWidth)
          this.setW(this.maxWidth);
        var w = this.workspace;
        domapi.packer.render(w);
        //fix scrollbar
        w.style.overflow = "scroll";
        w.style.overflow = "auto";
        };
      this.container = e = c.workspace;
      for (var a = 0; a < node.attributes.length; a++){
        att = node.attributes[a];
        switch (att.name){
          case "id":
              c.id = att.value;
              break;
          case "title":
              c.setText(att.value);
              break;
          default: c[att.name] = att.value;
          }
        }
  
      if (c.minWidth && c.maxWidth)
        if (c.minWidth == c.maxWidth)
          c.allowResize(false);
      }
  
    var orient = node.getAttribute("orient") == "horizontal" ? "left" : "top";
    if (e) e.defaultSide = orient;
    else
      c.defaultSide = orient;
  
    if (c.id && ! this[c.id.replace(new RegExp("-"), "_")])
      this[c.id.replace(new RegExp("-"), "_")] = c;
  
    return [c, e];
  }finally{
    e = null;c = null;w = null;
  }
};

domapi.elmProto.setStyleFromString = function(strStyle){
  this.style.cssText = this.style.cssText + ";" + strStyle.replace(new RegExp("(\\s+)([px]|[em]|[%]|[in]|[pt]|[cm]|[mm]|[pc]|[ex])","gi"), "$2");
};
