//------------------------------------------------------------------------------
/////xDiff Class used to generate Diff between two XML
//------------------------------------------------------------------------------

domapi.xDiff = function(xmlOrig, xmlChanged, useXupdate, check){
  this.bRoot = xmlOrig.documentElement;
  this.cRoot = xmlChanged.documentElement;
  this.useXupdate = domapi.rBool(useXupdate,false);
  if(this.useXupdate){
    this.xmlDiff = domapi.xml.getDomDocument("http://www.xmldb.org/xupdate","modifications","xupdate");
    this.xmlDiff.documentElement.setAttribute("version","1.0");
  }else
    this.xmlDiff = domapi.xml.getDomDocument(null,"xmldiff");
  this.diffRoot       = this.xmlDiff.documentElement;
  this.checkText      = true;
  this.checkAttribute = true;
  this.calculate(this.bRoot,this.cRoot);
};
//------------------------------------------------------------------------------
domapi.xDiff.prototype.calculate=function(bRoot,cRoot){
  var bChildren = bRoot.childNodes;
  var cChildren = cRoot.childNodes;
  var bList = [];
  var cList = [];
  for(i=0;i<bChildren.length;i++){
    if(bChildren.item(i).nodeType == 1)
      bList[bList.length]=new domapi.listEntry(bChildren.item(i).nodeName,bChildren.item(i));
    else{
     if(bChildren.item(i).nodeType== 3) if(bChildren.item(i).nodeValue.trim() != "") bList[bList.length]=new domapi.listEntry("text"+i,bChildren.item(i));
    }
  }
  for(i=0;i<cChildren.length;i++){
  
    if(cChildren.item(i).nodeType ==1)
      cList[cList.length]=new domapi.listEntry(cChildren.item(i).nodeName,cChildren.item(i));
    else{
    if(cChildren.item(i).nodeType==3)if(cChildren.item(i).nodeValue.trim() != "")cList[cList.length]=new domapi.listEntry("text"+i,cChildren.item(i));
     
    }
  }

  domapi.listEntry.bSort(bList);
  domapi.listEntry.bSort(cList);

  var fpos = 0;
  var spos = 0;
  
  while( fpos < bList.length && spos < cList.length){
    while(spos < cList.length && bList[fpos].name > cList[spos].name){
      sibling = cList[spos].node.previousSibling;
      this.addSubTree(bList[fpos].node.parentNode,cList[spos].node,sibling,domapi.xml.findOrder(cChildren,cList[spos].node));
      spos++;
    }
    if (spos >= cList.length){break;}
    while(fpos < bList.length && bList[fpos].name <  cList[spos].name){
      this.deleteSubTree(bList[fpos].node);
      fpos++;
      if(fpos >= bList.length) break;
    }
    if (fpos >= bList.length) { break;}

    if (bList[fpos].name == cList[spos].name && bList[fpos].name){
      if(bList[fpos].node.nodeType == 3){
        if(!(bList[fpos].node.nodeValue == cList[spos].node.nodeValue) && this.checkText){
          this.textDiff(bList[fpos].node.parentNode, bList[fpos].node.nodeValue,cList[spos].node.nodeValue);
        }
      }else{
        if(this.checkAttribute)
          this.attributeDiff(bList[fpos].node, cList[spos].node);
        this.calculate(bList[fpos].node,cList[spos].node);
      }
      fpos++;
      spos++;
    }
  }
  if (fpos < bList.length){
    while(fpos<bList.length){
      this.deleteSubTree(bList[fpos].node);
      fpos++;
    }
  }else{
    if(spos<cList.length){
      sibling = cList[spos].node.previousSibling;
      this.addSubTree(cList[spos].node.parentNode,cList[spos].node,sibling,-1);
      spos++;
    }
  }
};
//------------------------------------------------------------------------------
domapi.xDiff.prototype.addSubTree=function(parent,subRoot,leftsibling,order){
  var i;
  //Xupdate zone
  if (this.useXupdate){
    if(order == -1 || order == parent.childNodes.length){
      ninsert = this.xmlDiff.createElement("xupdate:append");
      ninsert.setAttribute("select",domapi.xml.generateXPath(parent));
      ninsert.setAttribute("child","last()");
    }else{
      ninsert = this.xmlDiff.createElement("xupdate:insert-after");
      ninsert.setAttribute("select",domapi.xml.generateXPath(parent.childNodes.item(order-1)));
    }
    add = this.xmlDiff.createElement("xupdate:element");
    add.setAttribute("name",subRoot.nodeName);
    ninsert.appendChild(add);
    this.diffRoot.appendChild(ninsert);
    //Attributes to add
    attribs = subRoot.attributes;
    if(attribs){
      for(i=0;i<attribs.length;i++){
        natt = this.xmlDiff.createElement("xupdate:attribute");
        natt.setAttribute("name",attribs.item(i).nodeName);
        natt.text = attribs.item(i).nodeValue;
        add.appendChild(natt);
      }
    }
    nsubtree = subRoot.cloneNode(true);
    for(i=0;i<nsubtree.childNodes.length;i++)
    n = nsubtree.childNodes.item(i);
    //if nodeType is text then add the xupdate:text before value
    if(n.nodeType==3){
      ut = this.xmlDiff.createElement("xupdate:text");
      ut.appendChild(n);
      add.appendChild(ut);
    }else add.appendChild(n);
  }else{
    //Own update format zone
    add = this.xmlDiff.createElement("addsubtree");
    add.setAttribute("xpathparent",domapi.xml.generateXPath(parent));
    if(leftsibling == null){
    }else{
      add.setAttribute("insertOrder",order);
      this.diffRoot.appendChild(add);
      nsubtree = subRoot.cloneNode(true);
      add.appendChild(nsubtree);
    }
  }
};
//------------------------------------------------------------------------------
domapi.xDiff.prototype.deleteSubTree=function(subTreeRoot){
  if(this.useXupdate)
    del = this.xmlDiff.createElement("xupdate:remove");
  else
    del = this.xmlDiff.createElement("delsubtree");

  del.setAttribute((this.useXpath?"select":"xpath"),domapi.xml.generateXPath(subTreeRoot));
  this.diffRoot.appendChild(del);
};
//------------------------------------------------------------------------------
domapi.xDiff.prototype.textDiff=function(parent,oval,nval){
  if(this.useXupdate){
    change = this.xmlDiff.createElement("xupdate:update");
    change.text = nval;
  }else{
    change = this.xmlDiff.createElement("changedata");
    change.setAttribute("newvalue",nval);
    change.setAttribute("oldvalue",oval);
  }
  change.setAttribute((this.useXpath?"select":"xpath"),domapi.xml.generateXPath(parent));
  this.diffRoot.appendChild(change);
};
//------------------------------------------------------------------------------
domapi.xDiff.prototype.attributeDiff=function(bnode,cnode){
  battribs = bnode.attributes;
  cattribs = cnode.attributes;

  if(battribs.length == 0 || cattribs.length==0) return;
  var changeroot;
  if(this.useXupdate)
    changeroot = this.xmlDiff.createElement("xupdate:update");
  else
  changeroot = this.xmlDiff.createElement("changeattr");

  var foundchange = false;
  var i;
  for(i=0;i<battribs.length;i++){
    batt = battribs.item(i);
    catt = cattribs.getNamedItem(batt.nodeName);
    if(catt){
      if(batt.nodeValue != catt.nodeValue){
        foundchange = true;
        if (this.useXupdate){
          changeroot.text = catt.nodeValue;
          changeroot.setAttribute("select",domapi.xml.generateXPath(bnode)+"/@"+catt.nodeName);
        }else{
          attr = this.xmlDiff.createElement("attribute");
          attr.setAttribute("newvalue",catt.nodeValue);
          attr.setAttribute("oldvalue",batt.nodeValue);
          attr.setAttribute("name",batt.nodeName);
          changeroot.setAttribute("xpath",domapi.xml.generateXPath(bnode));
          changeroot.appendChild(attr);
        }
      }
      if(foundchange){
        this.diffRoot.appendChild(changeroot);
      }
    }else{
      //delete attribute cause is not present
      delelm = this.xmlDiff.createElement("xupdate:remove");
      delelm.setAttribute("select",domapi.xml.generateXPath(bnode)+"/@"+batt.nodeName);
      this.diffRoot.appendChild(delelm);
    }
  }
  //add new attributes
  if(cattribs.length > battribs.length){
    appendelm = this.xmlDiff.createElement("xupdate:append");
    appendelm.setAttribute("select",domapi.xml.generateXPath(bnode));
    for(i=0;i<cattribs.length;i++){
      catt = cattribs.item(i);
      batt = battribs.getNamedItem(catt.nodeName);
      if(!batt){
        updtelm = this.xmlDiff.createElement("xupdate:attribute");
        updtelm.setAttribute("name",catt.nodeName);
        updtelm.text = catt.nodeValue;
        appendelm.appendChild(updtelm);
      }
    }
    this.diffRoot.appendChild(appendelm); 
  }
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//ListENtry helper Class for xDiff
//------------------------------------------------------------------------------
domapi.listEntry = function(name,node){
  this.name = name;
  this.node = node;
};
//------------------------------------------------------------------------------
domapi.listEntry.prototype.toString =function(){return this.name};
//------------------------------------------------------------------------------
domapi.listEntry.bSort = function(listEnt){
  st = -1;
  sz = listEnt.length;
  while(st<sz){

    changed=false;
    st++;
    for(i=st;i<sz-2;i++){
      if (listEnt[i].name>listEnt[i+1].name){
        l = listEnt[i];
        listEnt[i] = listEnt[i+1];
        listEnt[i+1] = i;
        changed=true;
      }
    }
    if(!changed) break;
    for(i=sz-2;i>st;i--){
      if (listEnt[i].name>listEnt[i+1].name){
        l = listEnt[i];
        listEnt[i] = listEnt[i+1];
        listEnt[i+1] = i;
        changed=true;
      }
    }
    if(!changed) break;
  }
};
//------------------------------------------------------------------------------