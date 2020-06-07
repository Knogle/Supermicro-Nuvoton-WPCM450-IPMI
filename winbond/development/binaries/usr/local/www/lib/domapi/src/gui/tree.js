//==============================================
// DomAPI Tree Component
// D. Kadrioski 7/6/2001
// (c) Nebiru Software 2001,2004
//==============================================

/* NOTES
o No nodes are added to the tree until their parent is "rendered".  Rendering
  happens automatically when a node is expanded, however the user must call init()
  after they are done adding nodes, or if they add nodes later on.  If they add
  nodes later, that are not in the root, they must pass the parent node to init().
o init() defaults to using the tree as it's parent if no node is provided.
o Each node and the tree iteslf has a "nodes" array which stores the actual nodes.
  This is used to determine parent child relationship as the nodes themselves
  may not have been added to the DOM yet.  Not adding them until they are made
  visible dramatically speeds up the tree.
o Nodes are NOT elms, nor do they have any methods attached.  We are running lean
  and mean here.  All the methods used to interact with the nodes are at the Tree
  level.  This includes events, as none are attached to the nodes.
o Basic idea is to keep memory consumption low, and execution times fast.
*/

// tree paint types, used internally when rendering
var tptWindow    = 0;
var tptHighlight = 1;
var tptSelection = 2;
domapi.loadUnit("sysutils");
domapi.loadUnit("customdrag");
domapi.registerComponent("tree");
//------------------------------------------------------------------------------
domapi.Tree = function(arg){return domapi.comps.tree.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.tree.constructor = function(arg){
  var e      = domapi.Component(arg,"tree");
  try{
    e.expanded = true; // root is always open so that first level nodes are rendered
    e.nodes    = [];
    e.selected = null;
    e.rendered = true;

    var p = domapi._private.tree;
    domapi.addEvent(e,"mouseover",p.domouseover);
    domapi.addEvent(e,"mouseout", p.domouseout);
    domapi.addEvent(e,"click",    p.doclick);
    domapi.addEvent(e,"dblclick", p.dodblclick);

    e.turnOnCustomDrag({});
    e.style.overflow = "auto";
    e.setValue("");
    domapi._finalizeComp(e);
    domapi.addEvent(domapi.isIE?e:e._daTabEdit, "keydown", p.dokeydown);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree._free = function(){
  var A, i;
  var recurse = function(n){
    for(var i=0;i<n.nodes.length;i++){
      recurse(n.nodes[i]);
      n.nodes[i].nodes             = [];
      n.nodes[i].img               = null;
      n.nodes[i].nodes             = null;
      n.nodes[i].preRenderedParent = null;
      n.nodes[i].fn                = null;
      n.nodes[i].parent            = null;
    }
  };
  recurse(this);
  recurse       = null;
  this.nodes    = [];
  this.nodes    = null;
  this.selected = null;
  A = this.getElementsByTagName("DIV");
  for(i=0;i<A.length;i++){
    A[i].parent            = null;
    A[i].nodes             = [];
    A[i].nodes             = null;
    A[i].preRenderedParent = null;
    A[i].img               = null;
    A[i].fn                = null;
  }
  A = [];
  A = null;
};
//------------------------------------------------------------------------------
domapi.comps.tree._draw = function(){
  this.treeDraw();
};
//------------------------------------------------------------------------------
domapi.comps.tree.treeDraw = function(){
  var t = domapi.theme;
  var f = t.fonts;
  var s = this.style;
  try{
    var b                = this.doBorder?parseInt(t.border.width):0;
    this.setB(             b);  // set border width *before* border style!!
    this.setColor(         f.window.color);
    this.setBgColor(       this.doBGFill?f.window.bgcolor:"transparent");
    s.borderStyle        = this.doBorder?t.border.solid:"none";
    s.borderColor        = t.border.getInset();
    //if(this.selected)
    //  this.paintNode(this.selected); // to support changing of selectRow midstream
  }finally{
    t = null;f = null;s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree._layout = function(w,h){
};
//------------------------------------------------------------------------------
domapi.comps.tree.refresh = function(n,all){
  // forces the tree to rerender it's images, should not really be needed
  // n is a node or defaults to the tree.  'all' controls recursion
  var recurse = function (root,n,all){
    for(var i=0;i<n.nodes.length;i++)
      if(n.nodes[i].rendered){
        root.renderNode(n.nodes[i],n,true);
        if(all)recurse(root,n.nodes[i],all);
      }
  };
  n   = n?n:this;
  all = domapi.rBool(all,true);
  recurse(this,n,all);
  recurse = null;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// general public members
//------------------------------------------------------------------------------
domapi.comps.tree.addNode = function(arg){
  /* ** VALID ARG PROPERTIES (and their defaults) **
  parent          [the base tree]
  text            ["New Node"]
  fn              [null]
  doAllowSelect   [true]
  doAllowNodeDrag [true]
  doAllowNodeDrop [true]
  img             [open/close folders, defined by theme.skin]  (must be 16x16)
  order     position under the parent, 0 means first position, 1 = second etc. Default is last.
  */
  var p = arg["parent"]?arg["parent"]:this;
  var n = document.createElement("DIV");
  try{
    n.expanded          = false;
    n.selected          = false;
    n.rendered          = false;
    n.nodes             = [];
    n.DA_TYPE           = "NODE";
    n.id=domapi.guid();
    n.preRenderedParent = p;
    if(p != this)p.lineHeight = this.lineHeight;
    // n.innerHTML         = domapi._private.tree.nodeBody;
    // carsten
    n.innerHTML         = domapi._private.tree.nodeBody(n,p);
    n.doAllowSelect     = domapi.rBool(arg["doAllowSelect"],true);
    n.doAllowNodeDrag   = domapi.rBool(arg["doAllowNodeDrag"],true);
    n.doAllowNodeDrop   = domapi.rBool(arg["doAllowNodeDrop"],true);
    this.setText(         n,domapi.rVal(arg["text"],"New Node"));

    // push any remaining arg values into the node
    for(var a in arg)if(typeof n[a]=="undefined" && a!="nodes")n[a] = arg[a];
    if(typeof arg["order"]!="undefined" && arg["order"]!=null) {
      var order = arg["order"];
      if(order>=p.nodes.length) {
        p.nodes.push(n);
      } else {
        var kids = p.nodes.slice(0,p.nodes.length);
        for(i=0,j=0; i<kids.length; i++,j++) {
          if(i==order) {
            p.nodes[j] = n;
            j++;
          }
          p.nodes[j] = kids[i];
        }
      }
    } else {
      p.nodes.push(n);
    }
    return n;
  }finally{
    p = null;n = null;kids = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.insertNode = function(arg){
  // for drag n drop, moves fromNode into toNode
  var f = arg["fromNode"  ];
  var t = arg["toNode"    ];
  try{
    if(!t)t = this; // no node specified, add to tree rrot
    var p = arg["sourceTree"];
    if(arg["insertAbove"] || arg["insertBelow"]){
      t = t.parentNode;
      var i = t.nodes.indexOf(arg["toNode"]);
    }
    if(!f || !t ||!p){
      throw new Error(
        'Error in insertNode, one or more parameters is invalid./n' +
        'fromNode   : ' + f + '/n' +
        'toNode     : ' + t + '/n' +
        'sourceTree : ' + p
      );
      return false;
    }
    p.getParentNode(f).nodes.deleteValue(f);
    var n = p.deleteNode(f);

    n.preRenderedParent = t;
    var _checksum = t.nodes.length;
    if(arg["insertAbove"]){
      t.nodes.insert(i,n);
    }else if(arg["insertBelow"]){
      t.nodes.insert(i+1,n);
    }else t.nodes.push(n);
    if(_checksum >= t.nodes.length)
      throw new Error(
        'Error in insertNode, failed to insert into nodes array./n' +
        'fromNode     : ' + f + '/n' +
        'toNode       : ' + t + '/n' +
        'sourceTree   : ' + p + '/n' +
        'i            : ' + i + '/n' +
        'checksum     : ' + _checksum + '/n' +
        'nodes.length : ' + t.nodes.length
      );

    n.rendered = false; // force refresh
    n.selected = false;
    this.expandNode(t);
    //this.init(n);
    this.renderNode(n,t,true);
    //p.refresh(f, true);
    //this.refresh(t, true);
    p.refresh(null, true);
    this.refresh(null,true);
  }finally{
    f = null;t = null;p = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.deleteNode = function(n){
  if(!n)return this.noNodeError("deleteNode");
  var p = this.getParentNode(n);
  try{
    p.nodes.deleteItem(p.nodes.indexOf(n));
    var e = n.parentNode.removeChild(n);//var e = n.removeNode(true);
    if(p.nodes.length==0) p.expanded    = false;
    if(this.selected===n) this.selected = null;
    return e;
  }finally{
    p = null;e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.clear = function(n){
  var i;
  var C = this.childNodes;
  try{
    this.deselectNode();
    for(i=C.length-1;i>-1;i--)
      this.removeChild(C[i]);
    this.innerHTML = "";
    this.nodes     = [];
  }finally{
    C = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.addPath = function(arg){
  var path = arg["path"];
  var del  = domapi.rVal(arg["del"],this.delimiter);
  var p    = arg["parent"]?arg["parent"]:this;
  try{
    path     = path.split(del);
    var a,b,found,s,last;
    var n = p;
    for(a=0;a<path.length;a++){
      found = 0;
      s     = 0;
      for(b=0;b<n.nodes.length;b++){
        s = n.nodes[b];
        if(this.getText(s) == path[a]){
          n     = s;
          found = 1;
          break;
        }
      }
      if(!found){ // create one
        last = a == (path.length-1);
        n    = this.addNode({parent:n,text:path[a],fn:last?arg.fn:null,img:last?arg.img:null});
      }
    }
    return n;
  }finally{
    p = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.getPath = function(n,del){
  if(!n)return this.noNodeError("getPath");
  del = domapi.rVal(del,this.delimiter);
  var r = "";
  while(n && n != this){
    if(r != "")r = del + r;
    r = this.getText(n).replace(del,"\\"+del) + r;
    if(n.preRenderedParent)
      n = n.preRenderedParent;
    else
      n = n.parentNode;
  }
  return r;
};
//------------------------------------------------------------------------------
domapi.comps.tree.pathExists = function(path,del){
  return this._walkPath(path,del,false,false);
};
//------------------------------------------------------------------------------
domapi.comps.tree.nodeFromPath = function(path,del){
  del  = domapi.rVal(del,this.delimiter);
  path = path.split(del);
  var a,b,found,s;
  var n = this;
  try{
    for(a=0;a<path.length;a++){
      found = 0;
      s     = 0;
      for(b=0;b<n.nodes.length;b++){
        s = n.nodes[b];
        if(this.getText(s) == path[a]){
          n     = s;
          found = 1;
          break;
        }
      }
      if(!found)return null;
    }
    return n;
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.init = function(n, force){ // n is optional.  defaults to the tree
  if(!n)n = this;
  for(var i=0;i<n.nodes.length;i++)
    this.renderNode(n.nodes[i], n, force);
};
//------------------------------------------------------------------------------
domapi.comps.tree.nodeLevel = function(n,p){ // p is optional, used if node has not been added to dom
  if(!n)return this.noNodeError("nodeLevel");
  var r = 0;
  var e = n.parentNode;
  try{
    if(!e)e = p;
    while(e != this){
      r++;
      if(e)
        e = e.parentNode;
      else
        e = this;
    }
    return r;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.nodeIsChild = function(n){
  // if you have more than one tree, this will tell you if the node is a child of one
  if(!n)return this.noNodeError("nodeIsChild");
  //return domapi.findParent(n,"TREE") == this;
  return this.nodeIsChildOfNode(n, this) == this;
};
//------------------------------------------------------------------------------
domapi.comps.tree.nodeIsChildOfNode = function(n,p){
  return n && p && domapi.findParent(n, p) == p;
};
//------------------------------------------------------------------------------
domapi.comps.tree.childCount = function(n){
  if(!n)return this.noNodeError("childCount");
  return n.nodes.length;
};
//------------------------------------------------------------------------------
domapi.comps.tree.hasChildren = function(n){
  if(!n)return this.noNodeError("hasChildren");
  return n.hasChildren?true:(this.childCount(n) > 0);
};
//------------------------------------------------------------------------------
domapi.comps.tree.getParentNode = function(n){
  if(!n)return this.noNodeError("getParentNode");
  return n.preRenderedParent?n.preRenderedParent:n.parentNode;
};
//------------------------------------------------------------------------------
domapi.comps.tree.getPreviousSibling = function(n){
  if(!n)return this.noNodeError("getPreviousSibling");
  var p = this.getParentNode(n).nodes;
  try{
    var i = p.indexOf(n);
    if(i == -1)return this.noNodeError("getPreviousSibling - not in nodes");
    return i>0?p[i-1]:null;
  }finally{
    p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.getNextSibling = function(n){
  if(!n)return this.noNodeError("getNextSibling");
  var p = this.getParentNode(n);
  try{
    if( !p || typeof p.nodes == "undefined")return null;
    var pn = p.nodes;
    var i = pn.indexOf(n);
    if(i == -1)return this.noNodeError("getNextSibling - not in nodes");
    return (i<(pn.length-1))?pn[i+1]:null;
  }finally{
    p = null;pn = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.getLastExpandedChild = function(n) {
  if(!n)return this.noNodeError("getLastExpandedChild");
	if (this.hasChildren(n.nodes[n.nodes.length-1]) && n.nodes[n.nodes.length-1].expanded)
	  return this.getLastExpandedChild(n.nodes[n.nodes.length-1]);
	else
	  return n.nodes[n.nodes.length-1];
};
//------------------------------------------------------------------------------
domapi.comps.tree.getTextCell = function(n){
  if(!n)return this.noNodeError("getTextCell");
  return n.childNodes[0].rows[0].cells[1];
};
//------------------------------------------------------------------------------
domapi.comps.tree.setText = function(n,t){
  if(!n)return this.noNodeError("setText");
  this.getTextCell(n).innerHTML = t;
};
//------------------------------------------------------------------------------
domapi.comps.tree.getText = function(n){
  if(!n)return this.noNodeError("getText");
  return this.getTextCell(n).innerHTML;
};
//------------------------------------------------------------------------------
domapi.comps.tree.expandNode = function(n){
  if(!n)return this.noNodeError("expandNode");
  if(n.expanded)return;

  //if parent is not rendered, call expandPath on getPath
  if(this.getParentNode(n) && !this.getParentNode(n).rendered)
    this.expandPath(this.getPath(n));

  n.expanded = true;
  this.init(n);
  for(var i=0;i<n.nodes.length;i++)
    n.nodes[i].style.display = "";
  this.setImages(n);
  if(this.onexpandnode)this.onexpandnode(n);
};
//------------------------------------------------------------------------------
domapi.comps.tree.expandPath = function(path,del,selectit){
  return this._walkPath(path,del,true,selectit);
};
//------------------------------------------------------------------------------
domapi.comps.tree.collapseNode = function(n){
  if(!n)return this.noNodeError("collapseNode");
  n.expanded = false;
  this.setImages(n);
  for(var i=0;i<n.nodes.length;i++)
    n.nodes[i].style.display = "none";
  if(this.oncollapsenode)this.oncollapsenode(n);
};
//------------------------------------------------------------------------------
domapi.comps.tree.expandAll = function(n){ // uses passed node or defaults to tree
  var recurse = function(root,n){
    var N, i;
    try{
      for(i=0;i<n.nodes.length;i++){
        N = n.nodes[i];
        if(N.DA_TYPE == "NODE")root.expandNode(N);
        recurse(root, N);
      }
    }finally{
      N = null;
    }
  };
  n = n?n:this;
  recurse(this,n);
  recurse = null;
};
//------------------------------------------------------------------------------
domapi.comps.tree.collapseAll = function(n){// uses passed node or defaults to tree
  var recurse = function(root,n){
    var N, i;
    try{
      for(i=0;i<n.nodes.length;i++){
        N = n.nodes[i];
        if(N.DA_TYPE == "NODE")root.collapseNode(N);
        recurse(root, N);
      }
    }finally{
      N = null;
    }
  };
  n = n?n:this;
  recurse(this,n);
  recurse = null;
};
//------------------------------------------------------------------------------
domapi.comps.tree.paintNode = function(n, kind){
  if(!n)return this.noNodeError("paintNode");
  kind  = domapi.rInt(kind, tptWindow);
  var c = n.childNodes[0].rows[0].cells[1];
  var f = domapi.theme.fonts;
  switch(kind){
    case tptWindow    : f = "DA_WINDOW";    break;
    case tptHighlight : f = "DA_HIGHLIGHT"; break;
    case tptSelection : f = "DA_SELECTION"; break;
  }
  if(this.doSelectRow){
    n.class2 = f;
    domapi._private.tree._applyStyle(n);
  }
  c.class2 = f;
  domapi._private.tree._applyStyle(c);

  if(this.ondrawnode)this.ondrawnode(n);
  f = null;
};
//------------------------------------------------------------------------------
domapi.comps.tree.deselectNode = function(){
  if(this.selected){
    this.selected.selected  = false;
    domapi.comps.tree.paintNode(this.selected, tptWindow);
    this.selected = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.selectNode = function(n, silent){
  if(!n)return this.noNodeError("selectNode");

// I always want node clicks to call the function assigned to it even if
// already selected
// [BrandonB] 4/8/2007
//   if(n.selected || this.selected == n)return;

  if(this.selected){
    this.selected.selected  = false;
    this.setImages(this.selected);
    var f = domapi.theme.fonts.window;
    this.paintNode(this.selected, tptWindow);
  }
  n.selected       = true;
  this.selected    = n;
  this.paintNode(    n, tptSelection);
  this.setImages(    n);
  this.setValue(this.getPath(this.selected));
  if(!silent){
    //if(this.onchange)this.onchange();  onchange fires in component.setValue
    if(n.fn){
      if(typeof n.fn == "function")n.fn(n);
      else eval(n.fn);
   }
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.setImages = function(n){
  if(!n)return this.noNodeError("setImages");
  var s = domapi.theme.skin;
  try{
    if(this.doShowLines)
      var src = ["tree_lines"];
    else
      var src = ["tree_noline"];
    if(!n.childNodes[0] || !n.childNodes[0].rows)return;
    var c = n.childNodes[0].rows[0].cells[0]; // cell for images
    var a = c.getElementsByTagName("IMG");    // array of all images
    if(!a.length)return;
    // find what connector to use *********************
    if(this.getNextSibling(n)){  // not last child, use "T"
      src[1] = "_t";
    }else{ // last child, use "L"
      src[1] = "_l";
    }
    if(this.getParentNode(n).DA_TYPE == "TREE" && !this.getPreviousSibling(n)) // root node
  //    src[1] = this.getNextSibling(n)?src[1] = "_b":src[1] = "_r";
      src[1] = (this.getNextSibling(n)||((src[0]=="tree_noline")&&(!this.hasChildren(n))))?src[1] = "_b":src[1] = "_r";
    // ************************************************
    var leafImg  = a[a.length-1]; // last from right
    var nodeImg  = a[a.length-2]; // second to last from right
    leafImg.kind = "leaf";
    nodeImg.kind = "node";
    // find what folder to use ************************
    if(this.hasChildren(n))
      src[2] = n.expanded?"_opened":"_closed";
    if(n.img) // user provided image to use
      leafImg.src = n.img;
    else // use open/closed folders
      leafImg.src = (n.expanded || n.selected)?s["tree_folder_opened"]:s["tree_folder_closed"];
    nodeImg.src = s[src.join("")];
    // now search for any possible I-beams ************
    if(this.doShowLines && a.length > 2){
      for(var i=a.length-3;i>-1;i--){
        n = this.getParentNode(n);
        if(this.getNextSibling(n))
          a[i].src = s["tree_lines_i"];
      }
    }
    if(this.onsetimages)this.onsetimages(n);
  }finally{
    s = null;c = null;a = null;leafImg = null;nodeImg = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.createImages = function(n,p){
  if(!n)return this.noNodeError("createImages");
  var s = domapi.theme.skin;
  try{
    var c = n.childNodes[0].rows[0].cells[0]; // cell for images
    c.innerHTML = ""; // clear existing images
    var img;
    // add the blank images
    for(var i=0;i<n.level+2;i++){
      img       = document.createElement("IMG");
      //img.width = 16;
     //img.border=1;

      // carsten
      img.src   = s["tree_blank"];
      if(i == n.level+1) {
        img.width = p.imgWidth?(n.imgWidth=p.imgWidth):(n.imgWidth?n.imgWidth:16);
        img.height = p.imgHeight?(n.imgHeight=p.imgHeight):(n.imgHeight?n.imgHeight:16);
        img.alt = n.imgAlt?n.imgAlt:n.text;
      } else	img.align = domapi.isIE?"absmiddle":"top";
      // carsten

      img.kind  = "blank";
      c.appendChild(img);
    }
    c.class1 = "DA_TREE_IMAGES";
    c.class2 = "";
    domapi._private.tree._applyStyle(c);
  }finally{
    s = null;img = null;c = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.renderNode = function(n,p,force){
  if(!n)return this.noNodeError("renderNode");
  p = p?p:this;
  if(n.rendered && !force)return;
  // All of this is necessary to support inserting Nodes in between its siblings.
  var i,j;
  for(i=0,j=1; i<p.nodes.length; i++) {
    if(p.nodes[i]===n)break;
    if(p.nodes[i].rendered)j++;
  }
  if(p.expanded==false) n.style.display = "none";
  if(j>=p.childNodes.length){
    p.appendChild(n);
  }else
    p.insertBefore(n,p.childNodes[j]);

  domapi.comps.tree.paintNode(n, tptWindow);
  n.level = this.nodeLevel(n,p);
  this.createImages(n,p);
  this.setImages(n);
  n.rendered  = true;
  if(domapi.isGecko)delete n.preRenderedParent;
  else n.preRenderedParent = null;
  n.class1 = n.nextSibling?"DA_TREE_NODE":"DA_TREE_NODE_LASTCHILD";
  n.class2 = "";
  domapi._private.tree._applyStyle(n);
  if(this.onrendernode)this.onrendernode(n,p);
};
//------------------------------------------------------------------------------
domapi.comps.tree.noNodeError = function(funcNm){
  throw new Error("ERROR!\n" + domapi.formatGetString("TREE_NO_NODE",[funcNm]));
  return false;
};
//------------------------------------------------------------------------------
domapi.comps.tree._walkPath = function(path,del,openit,selectit){
  del  = domapi.rVal(del,this.delimiter);
  path = path.split(del);
  var a,b,found,s;
  var n = this;
  try{
    for(a=0;a<path.length;a++){
      found = 0;
      s     = 0;
      for(b=0;b<n.nodes.length;b++){
        s = n.nodes[b];
        if(this.getText(s) == path[a]){
          n     = s;
          found = 1;
          break;
        }
      }
      if(!found)return false;
      if(openit)this.expandNode(n);
      if(selectit)this.selectNode(n);
    }
    return true;
  }finally{
    n = null;s = null;
  }
};
//------------------------------------------------------------------------------


//******************************************************************************
// JSON support - requires domapi.loadUnit("json")
//------------------------------------------------------------------------------
domapi.comps.tree.loadFromJson = function(j,rootNode){
  domapi.assertUnit("json");
  this._loadFromJson(j,rootNode);
  this.init(rootNode?rootNode:this, true);
  this.draw();
  if(this.selected)this.paintNode(this.selected, tptSelection);
  //add onloadfromjson event same as one in list grid, Henry, April 29th. 2005
  if(this.onloadfromjson)this.onloadfromjson(rootNode?rootNode:this);
};
//------------------------------------------------------------------------------
domapi.comps.tree._loadFromJson = function(j,rootNode){
  domapi.assertUnit("json");
  try{
    var nodes = j.nodes;
    try{
      if(!nodes)return false;
      if(!rootNode)rootNode = this;
      var newNode;
      for(var i=0;i<nodes.length;i++){
        nodes[i].parent = rootNode;
        newNode = this.addNode(nodes[i]);
        this._loadFromJson(nodes[i], newNode); // recursion
      }
    }finally{
      nodes = null;newNode = null;
    }
  }catch(e){}
};
//------------------------------------------------------------------------------
domapi.comps.tree.loadFromJsonUrl = function(url,node){//alert(domapi.getContent(url))
  domapi.assertUnit("json");
  var j = domapi.urlToJson(url);
  try{
    this.loadFromJson(j,node);
  }finally{
    j = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.saveToJson = function(root){
  return domapi.stringToJson(this.saveToJsonString(root, false));
};
//------------------------------------------------------------------------------
domapi.comps.tree.saveToJsonString = function(root,innerCall){
  var n,i,s="";
  var t = (root)? root:this;
  var sep = "";
  var fullJson = (innerCall)? false : true;

  if (fullJson)s += "{";
  if (t.nodes.length) {
    s += "nodes : [";
    for(i=0;i<t.nodes.length;i++){
      n = t.nodes[i];
      if (n) {
        sn = this.saveToJsonString(n,true);
        if (sn.length!=0)sn = ", " + sn;
        s += sep + "{ text : \"" + this.getText(n) + "\", value : \"" + n.value + "\", expanded : " + n.expanded + sn + " }";
          if (sep.length==0)sep=",";
      }
    }
    s += "]";
  }
  if (fullJson)s += "}";
  return s;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
domapi.comps.tree.saveToXML = function(root, pretty){
  var n,i,s="";
  var t = (root)? root:this;
  pretty = pretty?"\n":"";
  for(i=0;i<t.nodes.length;i++){
    n = t.nodes[i];
    if (n)
      s += "<item text=\"" + this.getText(n) + "\">"+pretty+this.saveToXML(n, pretty)+"</item>"+pretty;;
  }
  return s;
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// drag-n-drop support
//------------------------------------------------------------------------------
domapi.comps.tree.ondragallow = function(arg){
  var e = domapi.findParent(domapi.customDrag.elm, "NODE");
  var p = domapi.customDrag.container;
  try{
    return e && p != e && p.doAllowDrag && e.doAllowNodeDrag;
  }finally{
    e = null;p = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.ondragstart = function(arg){
  var d = domapi.customDrag;
  d.elm = domapi.findParent(d.elm, "NODE");
  if(!d.elm)d.container.cancelCustomDrag();
  d = null;
};
//------------------------------------------------------------------------------
domapi.comps.tree.onallowinsertabove = function(arg){
  var e = domapi.findParent(arg["over"], "NODE");
  try{
    return (e);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.tree.onallowinsertbelow = function(arg){
  var e = domapi.findParent(arg["over"], "NODE");
  try{
    return (e);
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members
domapi._private.tree.domouseover = function(E){
  domapi._private.tree.domouse(E,tptHighlight);
};
//------------------------------------------------------------------------------
domapi._private.tree.domouseout = function(E){
  domapi._private.tree.domouse(E,tptWindow);
};
//------------------------------------------------------------------------------
domapi._private.tree.domouse = function(E,kind){
  var e = domapi.findTarget(E,"TD");
  try{
    if(!e || e.class1 != "DA_TREE_TEXT")return;
    var p = domapi.findTarget(E,"TREE");
    var n = domapi.findParent(e,"NODE");
    if(!p.doRollover || !p.enabled || n.selected || (domapi.customDrag.inDrag  && kind != tptWindow))return;
    p.paintNode(n,kind);
  }finally{
    e = null;p = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree.dodblclick = function(E){
  var p = domapi.findTarget(E,"TREE");
  try{
    if(!p || !p.enabled || domapi.customDrag.inDrag)return;
    var e = domapi.findTarget(E,"TD");
    var n = domapi.findParent(e,"NODE");
    if(e && e.class1 == "DA_TREE_TEXT")
      // clicked on the caption
      if(p.doDblClickTextExpands)
        if(n.expanded)p.collapseNode(n);else p.expandNode(n);

    var e = domapi.findTarget(E,"IMG");
    if(e && e.kind && e.kind != "blank"){
      // clicked on either the leaf or the node
      if(e.kind == "leaf")
        if(p.doDblClickFolderExpands && p.hasChildren(n))
          if(n.expanded)p.collapseNode(n);else p.expandNode(n);
    }
  }finally{
    p = null;e = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree.doclick = function(E){
  var p = domapi.findTarget(E,"TREE");
  try{
    if(!p || !p.enabled || domapi.customDrag.inDrag)return;
    var e = domapi.findTarget(E,"TD");
    var n = domapi.findParent(e,"NODE");
    if(e && e.class1 == "DA_TREE_TEXT"){
      // clicked on the caption
      if(n.doAllowSelect)p.selectNode(n);
      if(p.doTextExpands)
        if(n.expanded)p.collapseNode(n);else p.expandNode(n);
    }

    var e = domapi.findTarget(E,"IMG");
    if(e && e.kind && e.kind != "blank"){
      // clicked on either the leaf or the node
      if(e.kind == "node"){ // expand/collapse node
        if(!p.hasChildren(n))return;
        if(n.expanded)p.collapseNode(n);else p.expandNode(n);
      }
      if(e.kind == "leaf"){
        if(p.doFolderExpands && p.hasChildren(n))
          if(n.expanded)p.collapseNode(n);else p.expandNode(n);
        if(p.doFolderSelects && n.doAllowSelect)p.selectNode(n);
      }
    }
  }finally{
    p = null;e = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree.dokeydown = function(E){
  var k = domapi.isIE?event.keyCode:E.which;
  var e = domapi.getTarget(E);
  var r = e._daowner;
  try{
    if(!r)r = domapi.findTarget(E,"TREE");
    var eat = false;
    var i, A, n;
    var shiftKey = domapi.isIE?event.shiftKey:E.shiftKey;
    var ctrlKey  = domapi.isIE?event.ctrlKey :E.ctrlKey;
    if(!r._inedit){
      if(k == 33) // PAGE UP
        r.scrollTop -= r.offsetHeight;
      if(k == 34) // PAGE DOWN
        r.scrollTop += r.offsetHeight;
      if(k == 35 && ctrlKey){ // CTRL+END
        A = r.getElementsByTagName("DIV");
        for(i=A.length-1;i>-1;i--)
          if(A[i].DA_TYPE == "NODE" && A[i].doAllowSelect){
            r.selectNode(A[i]);
            break;
          }
      }
      if(k == 36 && ctrlKey){ // CTRL+HOME
        A = r.getElementsByTagName("DIV");
        for(i=0;i<A.length;i++)
          if(A[i].DA_TYPE == "NODE" && A[i].doAllowSelect){
            r.selectNode(A[i]);
            break;
          }
      }
      if(k == 38){ // UP
        if(r.selected)
          domapi._private.tree._upKeySelectNode(r);
        eat = true;
      }
      if(k == 40){ // DOWN
        if(r.selected)
          domapi._private.tree._downKeySelectNode(r);
        eat = true;
      }
      if(k == 37){ // LEFT
        if(r.selected)
          domapi._private.tree._leftKeySelectNode(r);
        eat = true;
      }
      if(k == 39){ // RIGHT
        if(r.selected)
          domapi._private.tree._rightKeySelectNode(r);
        eat = true;
      }
    }
    // if we are not editing, eat the keystrokes
    if(eat){
      if(E && E.preventDefault)E.preventDefault();
      return false;
    }
    //alert(k)
  }finally{
    e = null;r = null;A = null;n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree._upKeySelectNode = function(r){
  var n = r.getPreviousSibling(r.selected);
  try{
    if (n){
      if(n.expanded && r.hasChildren(n))
        n = r.getLastExpandedChild(n);
    }
    else
      n = r.getParentNode(r.selected);
    if(n && n.doAllowSelect)
      r.selectNode(n);
    domapi._private.tree._scrollIntoView(r);
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree._downKeySelectNode = function(r){
  var n;
  try{
    if(r.hasChildren(r.selected) && r.selected.expanded)
      n = r.selected.nodes[0];
    else{
      n = r.getNextSibling(r.selected);
      if(!n){// we need to keep going up to the parent node until we find a node that has a sibling
        n = r.selected;
        while(n){
          n = r.getParentNode(n);
          if(n && r.getNextSibling(n)){
            n = r.getNextSibling(n);
            break;
          }
        }
      }
    }
    if(n && n.doAllowSelect)
      r.selectNode(n);
    domapi._private.tree._scrollIntoView(r);
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree._leftKeySelectNode = function(r){
  if (r.selected.expanded)
    r.collapseNode(r.selected);
  else try{
    var n = r.getParentNode(r.selected);
    if(n && n.doAllowSelect)
      r.selectNode(n);
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree._rightKeySelectNode = function(r){
  if (!r.selected.expanded)
    r.expandNode(r.selected);
  else try{
    if(r.hasChildren(r.selected)){
      var n = r.selected.nodes[0];
      if(n && n.doAllowSelect)
        r.selectNode(n);
    }
  }finally{
    n = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree._applyStyle = function(e){
  if(typeof e.class1 == "undefined")e.class1 = e.className.split(" ")[0];
  if(typeof e.class2 == "undefined")e.class2 = "";
  if(e.class1 && e.class2)
    e.className = sysutils.trim(e.class1 + " " + e.class2);
  //  domapi.dump([e.className])
};
//------------------------------------------------------------------------------
domapi._private.tree._scrollIntoView = function(r){
  // this ensures that the selected item is visible.
  var sy = r.selected.offsetTop;
  var y;
  if(sy<r.scrollTop){
    y = sy - 5;
    r.scrollTop = (y>0?y:0);
  }else if(sy>r.scrollTop + r.offsetHeight-13){
    y = sy - r.offsetHeight + 25;
    r.scrollTop = y;
  }
};
//------------------------------------------------------------------------------
domapi._private.tree.nodeBody = function(n,p){ // carsten
  var lineHeight = p.lineHeight?p.lineHeight:n.lineHeight?n.lineHeight:16;
  return '<table style="display:block" class="DA_TREE_NODE" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td height='+lineHeight+' class="DA_TREE_IMAGES" nowrap></td><td width="100%" class="DA_TREE_TEXT DA_TREE_NORMAL"></td></tr></table>'
};
//------------------------------------------------------------------------------