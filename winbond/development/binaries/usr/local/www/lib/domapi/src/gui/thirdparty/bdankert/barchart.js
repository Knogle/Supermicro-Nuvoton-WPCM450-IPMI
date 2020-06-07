//-----------
// BarChart Component
// Robert Dankert (c) 2002
// 

/*
  I always get confused what theme colors control what, so here is a list!
    ctrlBgColor = background of the component
    bdrColor    = color of the border
    hlBgColor   = color of the chart
    ctrlFgColor = color of the text       
    selBgColor  = color of the bar


  Properties
    DA_TYPE  - BARCHART
    lines        <int>  - the number of grid lines to be drawn.  READ ONLY
    lType        <int>  - Method to set the gridlines.  1 is to set them to a specified number of lines, 2 is to draw a line according to a certain multiple
    lMult        <int>  - used when lType is 2, specifying the multiple
    lRound       <int>  - Specifies the number of decimals to display in the label (not displayed if 0)
    labels       <int>  - the number of labels to be drawn
    range        <int>  - the upper limit for the chart (defaults to the greatest value);
    data         <arr>  - associative array (n by 2 deep) with arr[n][0] with bar values, and arr[n][1] with bar names
    labelFont    <str>  - Font used for the label text, Arial is default (only some fonts support scaling down to <10 px)
    labelSize    <int>  - font size used for labels, in pixels
    axisFont     <str>  - Font used for the axis text, Arial is default 
    axisSize     <int>  - Font size used for the axis, in pixels
    isNames      <boo>  - Internal boolean expression.  READ ONLY  true if names are being drawn, false if not
    colors       <arr>  - Array used to define the colors of the bars, if multi-colored bars are desired.  Default is null.  Repeated sequence

  Methods
    addChart    <x, y, width, height, lines/multiple, type>    Adds a chart to the barchart, and sets the gridlines according to the method described in setGrid  
    addData     <bars, names, delimiter>                       Adds an array of bars set to a numeric value, assigns to each a name, defined in the 'names' list, seperated with the delimiter (Default is a comma)  Be sure not to use the delimiter in any of the 'names'
    addTitle    <title,x,y>                                    Adds the title to the page.  Uses automatic positioning by default (above the chart, centered) but can be positioned manually by setting x and y
    setXAxis    <value,x,y>                                    Sets the x-axis to the page.  Uses automatic positioning by default (below the names/labels, centered) but can be positioned manually
    setYAxis    <value,x,y>                                    Sets the y-axis to the page.  Uses automatic positioning by default (below the names/labels, centered) but can be positioned manually
    setNames                                                   Adds the names of the bars to the horizantal bar
    setLabels   <lines, pixels, round>                         Sets the number of divisions (defaults to the number of gridlines), pixels defines the font height for the text, round defines the number of decimals to display
    setColors   <colors,delimiter>                             Sets the color sequence for the bars colors passed in a delimited list, default delimiter is comma.  If no colors are passed, defaults to none
    setGrid     <lines/multiple, type>                         Sets the number of gridlines.  If type is 1, sets <lines> number of lines.  If type is 2, draws a line every <multiple>
    setOrient   <value>                                        0 is for vertical, 1 is for horizantal bars within the chart.  The grid and labels will be adjusted accordingly
    clearNames                                                 Clears the names
    clearTitle                                                 Clears the title
    clearXAxis                                                 Clears the x-axis
    clearYAxis                                                 Clears the y-axis
    sortData    <type>                                         This sorts the data according to the type (1-value  2-reverse value  3-name  4-reverse name)
    drawBars                                                   redraws the chart bars on the screen
    drawChart                                                  redraws the chart
    reDraw                                                     redraws the component
*/    

domapi.registerComponent("barchart");
//------------------------------------------------------------------------------
domapi.Barchart = function(arg){return domapi.comps.barchart.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.barchart.constructor = function(arg){//parent,theme,x,y,w,h){
  domapi._assert(arg,"w",200); domapi._assert(arg,"h",200); // sets defaults
  var e         = domapi.Component(arg, "barchart");
  try{
    e.appendChild(document.createElement("DIV")); // This creates the label support
    e.appendChild(document.createElement("DIV")); // This creates the name support
    e.isChart     = false;                      // set the default as not having a chart
    e.isTitle     = false;                      // set the default as having no Title
    e.isXAxis     = false;                      // set the default as having no x-axis
    e.isYAxis     = false;                      // set the default as having no y-axis
    e.isLabel     = false;                      // set the default as not having any labels
    e.isNames     = false;                      // set to draw names 
    e.labelFont   = "arial";                    // set the default font
    e.labelSize   = 10;                         // set the default font size
    e.lRound      = 1;                          // set the number of decimal places to display for the labels (doesn't use a decimal if the end is 0)
    e.axisFont    = "arial";                    // set the default font
    e.axisSize    = 10;                         // set the default font size
    e.xText       = "";                         // set the x-axis text to nothing
    e.yText       = "";                         // set the y-axis text to nothing
    e.lines       = 0;                          // reference for the gridlines
    e.lType       = 1;                          // method for drawing lines (set number is default)
    e.lMult       = 0;                          // multiple for drawing gridlines with method 2
    e.labels      = 0;                          // reference for the labels
    e.range       = 0;                          // sets the maximum range of the chart
    e.data        = [];                         // creates an array for the bar values/names
    e.colors      = [];                         // creates an array for the color-definitions
    e.isColors    = false;                      // Default is do not use color sequence
    e.isVert      = true;                       // Default is for vertical bars
    e.hText       = false;                      // Default is dont use horizantal text in horizantal mode
    e.offX        = 0;                          // the x-offset from the chart
    e.offY        = 0;                          // the y offset from the chart
    e.change      = 0;                          // an internal variable to tell if the range has shifted
    e.g           = 0;                          // Just a global check if grid lines have been drawn or not
    domapi._finalizeComp( e);
    return e;
  }finally{
    e = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart._free = function(){
  this._constructor = null;
  this.barTitle     = null;
  this.chart        = null;
  this.xAxis        = null;
  this.yAxis        = null;
};
//------------------------------------------------------------------------------
domapi.comps.barchart.sort1=function(a,b){return (a[0] > b[0])?-1:1;};
domapi.comps.barchart.sort2=function(a,b){return (a[0] < b[0])?-1:1;};
domapi.comps.barchart.sort3=function(a,b){return (a[1] < b[1])?-1:1;};
domapi.comps.barchart.sort4=function(a,b){return (a[1] > b[1])?-1:1;};
//------------------------------------------------------------------------------
domapi.comps.barchart.alG=function(a){    return Math.round((((((this.isVert)?(this.chart.getH()):(this.chart.getW()))-2)/(this.lines))*(a+1)*(10/11)-1));   };
domapi.comps.barchart.alM=function(a){    return Math.round((((this.isVert)?(this.chart.getH()):(this.chart.getW()))-2)*(a/this.range));                     };
domapi.comps.barchart.alH=function(){     return this.chart.getY()+this.chart.getH();                                                                        };
domapi.comps.barchart.alW=function(){     return (((this.isVert)?(this.chart.getW()):(this.chart.getH())-2)/(this.data.length))/2;                           };
domapi.comps.barchart.alN=function(a,p){  return Math.round(((a*2*this.alW())+this.alW())-(p/4));                                                            };
domapi.comps.barchart.alB=function(a){    return Math.round((this.data[i][0]*((((this.isVert)?(this.chart.getH()):(this.chart.getW()))-2)/this.range))+2);   };
domapi.comps.barchart.alA=function(t){    return Math.round(this.chart.getY()+this.chart.getH()*0.5-t.length*0.5*(this.axisSize-1));                         };
//------------------------------------------------------------------------------
domapi.comps.barchart.vText=function(s,o){
  try{
    for(var a=0;a<s.length;a++){
      var b=document.createElement("SPAN");
      if(s.substr(a,1)==" ")
        b.innerHTML="&nbsp;";
      else
        b.innerHTML=s.substr(a,1);
      b.style.display='block';
      o.appendChild(b);
    }
  }finally{
    b = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.addChart=function(x,y,w,h,l,q){
  if(this.isChart)return;                     // return if there is a chart already created
  q=domapi.rInt(q,this.lType);
  this.lType=q;
  l=domapi.rInt(l,this.lines);
  if(q==1)this.lines=l;
  else {this.lines=0;this.lMult=l;}
  this.chart         = domapi.Elm({parent:this,x:x,y:y,w:w,h:h});
  this.chart.appendChild(document.createElement("DIV"));  // This creates the grid support
  this.isChart       = true;
  this.chart.setB(1);
  var w=this.chart.style;
  w.borderStyle     = domapi.theme.border.solid;
  w.borderColor     = domapi.theme.border.active;
  w.backgroundColor = domapi.theme.fonts.highlight.bgcolor;
  w = null;
};
//------------------------------------------------------------------------------
domapi.comps.barchart.addData=function(set,name,del){
  if(!this.isChart)return;
  del = del?del:",";                          // default delimiter is comma
  var bars = set.split(del);
  var names = name.split(del);
  try{
    for(i=0;i<bars.length;i++){
      if(parseInt(bars[i])*1.1>this.range){this.range=parseInt(bars[i])*1.1;this.change=1;if(this.lType==2)this.lines=Math.floor((this.range*0.99)/this.lMult);}       // changes the max range if necessary
      var t = this.data;
      t[t.length]=new Array();
      t[t.length-1][0]=parseInt(bars[i]);       // add the new bar
      t[t.length-1][1]=names[i];                // add the name for the bar
      var bar = domapi.Elm({parent:this.chart,x:0,y:0,w:0,h:0});
    }
    var q=((domapi.isIE && domapi.major==5 && domapi.minor==0)?(100):(0));
    setTimeout('domapi.getElm("'+this.id+'").drawBars()',q);
  }finally{
    bar = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.addTitle=function(t,x,y){
  if(domapi.isNil(t)){this.clearTitle();return;}
  if(!this.barTitle)
    this.barTitle = domapi.Elm({parent:this,x:x,y:y});
  this.isTitle = true;
  this.barTitle.setText(t);
  this.barTitle.setP(5);
  var w=this.barTitle.style;
  try{
    w.textAlign='center';
    w.font= domapi.theme.fonts.window.asString();
    w.fontWeight='bold';
    w.color=domapi.theme.fonts.window.color;
    w.top='10px';
    w.visibility='visible';
  }finally{w = null}
};
//------------------------------------------------------------------------------
domapi.comps.barchart.setGrid=function(l,q){
  if(!this.isChart)return;
  q=domapi.rInt(q,this.lType);
  this.lType=q;
  l=domapi.rInt(l,this.lines);
  if(q==1)this.lines=l;
  else {this.lMult=l;this.lines=Math.floor((this.range*0.99)/this.lMult);}
  this.g=1;
  var t=this.chart.childNodes[0];
  try{
    var x=t.childNodes.length;                  
    if(x>0)                                     // remove any old gridlines
      for(var a=0;a<x;a++)
        t.removeChild(t.childNodes[0]);
    if(q==1){
      for(var a=0;a<l;a++){                       // create the new gridlines
        var temp = document.createElement("DIV");
        var w=temp.style;      
        w.position="absolute";
        w.height=((this.isVert)?1:this.chart.getH())+"px";
        w.width=((this.isVert)?this.chart.getW():1)+"px";
        w.left=((this.isVert)?0:this.alG(a))+"px";
        w.top=((this.isVert)?(this.chart.getH()-this.alG(a)-4):0)+"px";
        w.backgroundColor=domapi.theme.fonts.buttonface.color;
        w.overflow="hidden";
        t.appendChild(temp);
      }
    } else {
      var b=[this.lMult];
      while(b[b.length-1]+this.lMult<(this.range*0.99))
        b[b.length]=b[b.length-1]+this.lMult;
      for(var a=0;a<b.length;a++){
        var temp=document.createElement("DIV");
        var w=temp.style;
        w.position="absolute";
        w.height=((this.isVert)?1:this.chart.getH())+"px";
        w.width=((this.isVert)?this.chart.getW():1)+"px";
        w.left=((this.isVert)?0:this.alM(b[a])-1)+"px";
        w.top=((this.isVert)?(this.chart.getH()-this.alM(b[a])-3):0)+"px";
        w.backgroundColor=domapi.theme.fonts.buttonface.color;
        w.overflow="hidden";
        t.appendChild(temp);
      }
    }
  }finally{
    t = null; temp = null; w = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.setLabels=function(l,p,r){
  if(!this.isChart)return;
  l=domapi.rInt(l,this.lines);
  p=domapi.rInt(p,this.labelSize);
  this.labels=l;
  r=domapi.rInt(r,this.lRound);
  this.lRound=r;
  var t=this.childNodes[0];                   // Assigns the working architecture
  try{
    var z=t.childNodes.length;
    if(this.lType==2){
      var b=[this.lMult];
      while(b[b.length-1]+this.lMult<(this.range*0.99))
        b[b.length]=b[b.length-1]+this.lMult;
    }
    if(z>0)                                     // remove any old gridlines
      for(var a=0;a<z;a++)
        t.removeChild(t.childNodes[0]);
    for(var a=0;a<l;a++){
      var temp = document.createElement("DIV");
      var temp2 = document.createElement("DIV");
      var w=temp.style;
      w.position="absolute";
      w.height=((this.isVert)?1:2)+"px";
      w.width=((this.isVert)?2:1)+"px";
      w.left=((this.isVert)?(this.chart.getX()-2):(((this.lType==1)?(this.alG(a)):(this.alM(b[a])-1))+this.chart.getX()+1))+"px";
      w.top=((this.isVert)?(this.alH()-((this.lType==1)?(this.alG(a)):(this.alM(b[a])-1))-3):(this.alH()))+"px";
      w.backgroundColor=domapi.theme.fonts.buttonface.color;
      w.overflow="hidden";
      var w=temp2.style;
      w.position="absolute";
      w.height=((this.isVert)?1:20)+"px";
      w.width=((this.isVert)?this.chart.getX()-4:1)+"px";
      w.left=((this.isVert)?(0):((((this.lType==1)?(this.alG(a)):(this.alM(b[a])-1))+this.chart.getX()+1)-(p/8)))+"px";
      w.top=((this.isVert)?(this.alH()-((this.lType==1)?(this.alG(a)):(this.alM(b[a])-1))-5-(p/2)):(this.alH()+4))+"px";
      w.color=domapi.theme.fonts.buttonface.color;
      w.textAlign='right';
      w.fontFamily=this.labelFont;
      w.fontSize=p+"px";
      if(!this.isVert)w.lineHeight=(p-1)+'px';
      if(this.lType==1){
  			var qq=Math.round(((this.range*(10/11))/(l)*(a+1))*Math.pow(10,r));
  			var qw=qq.toString().substr(qq.toString().length-r,r);
  			var g=qq.toString().substr(0,qq.toString().length-r);
  			if(parseInt(qw)!=0 && r!=0)g+='.'+qw;
      }
      else var g=b[a];
      if(this.isVert){temp2.innerHTML="<span>"+g+"</span>";}
      else 
        if(this.hText) temp2.innerHTML=g;
        else{this.vText(g.toString(),temp2);if(g.toString().length*(p-1)>this.offY){this.change=1;this.offY=g.toString().length*(p-1);}}  // Routine to get v-height
      t.appendChild(temp);
      t.appendChild(temp2);
      if(temp2.childNodes[0].offsetWidth>this.offX){this.change=1;this.offX=temp2.childNodes[0].offsetWidth;}
    }
    if(this.change==1){
      this.change=0;
      this.setXAxis();
      this.setYAxis();
    } 
    if(this.g!=1)this.setGrid();
  }finally{
    t     = null;
    temp  = null;
    temp2 = null;
    w     = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.setNames=function(p){
  if(!this.isChart||this.data.length==0)return;
  p=domapi.rInt(p,this.labelSize);
  var t=this.childNodes[1];
  try{
    var z=t.childNodes.length;                  // Must create a var with the length so it stays static in the loop
    this.clearNames();
    this.isNames=true;
    for(var a=0;a<this.data.length;a++){       // this adds each text caption
      temp = document.createElement("DIV");
      var w=temp.style;
      w.position="absolute";
      w.fontSize=p+"px";
      w.fontFamily=this.labelFont;
      w.textAlign=(this.isVert)?('center'):('right');
      w.lineHeight=(p-1)+'px';
      w.top=((this.isVert)?(this.alH()):(this.chart.getY()+this.alN(a,p)))+"px";
      w.left=((this.isVert)?(this.chart.getX()+this.alN(a,p)-2):(0))+"px";
      if(!this.isVert)w.width=this.chart.getX()-4;
      if(!this.isVert)temp.innerHTML='<span>'+this.data[a][1]+'</span>';
      else
        if(this.hText)temp.innerHTML='<span>'+this.data[a][1]+'</span>';
        else{this.vText(this.data[a][1],temp);if(this.data[a][1].length*(p-1)>this.offY){this.change=1;this.offY=this.data[a][1].length*(p-1);}}  // This adds the vertical text
      t.appendChild(temp);
      if(!this.isVert)if(temp.childNodes[0].offsetWidth>this.offX){this.change=1;this.offX=temp.childNodes[0].offsetWidth;}
    }
    if(this.change==1){
      this.change=0;
      this.setXAxis();
      this.setYAxis();
    }
  }finally{
    t = null;w = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.setColors=function(c,d){
  if(!this.isChart)return;
  if(c==null)
    this.isColors=false;
  else{
    d = d?d:",";                          // default delimiter is comma
    this.colors = c.split(d);
    this.isColors=true;
  }
  this.drawBars();
};
//------------------------------------------------------------------------------
domapi.comps.barchart.setOrient=function(x){
  x=domapi.rInt(x,0);
  this.isVert=((x==0)?true:false);
  this.draw();
};
//------------------------------------------------------------------------------
domapi.comps.barchart.setXAxis=function(t,x,y){
  if(domapi.isNil(t))t=this.xText;
  this.xText=t;
  if(this.offY==0)this.offY=this.labelSize;
  if(this.offX==0)this.offX=this.labelSize;
  if(!this.xAxis)
    this.xAxis = domapi.Elm({parent:this,x:0,y:0});
  this.isXAxis = true;
  this.xAxis.setText('');
  if(this.isVert)this.xAxis.setText(t);
    else this.vText(t,this.xAxis);
  if(x)this.xAxis.setX(x);
    else 
      if(this.isVert)this.xAxis.setX(this.chart.getX());
        else this.xAxis.setX(this.chart.getX()-this.offX-this.axisSize-4);
  if(y)this.xAxis.setY(y);
    else
      if(this.isVert)this.xAxis.setY(this.alH()+this.offY);
        else this.xAxis.setY(this.alA(t));
  if(this.isVert)this.xAxis.setW(this.chart.getW());
    else this.xAxis.setW(this.axisSize);
  var w=this.xAxis.style;
  try{
    w.textAlign='center';
    w.fontFamily=this.axisFont;
    w.fontWeight='bold';
    w.fontSize=this.axisSize+'px';
    w.color=domapi.theme.fonts.window.color;
    w.visibility='visible';
  }finally{w = null}
};
//------------------------------------------------------------------------------
domapi.comps.barchart.setYAxis=function(t,x,y){
  if(domapi.isNil(t))t=this.yText;
  this.yText=t;
  if(this.offY==0)this.offY=this.labelSize;
  if(this.offX==0)this.offX=this.labelSize;
  if(!this.yAxis)
    this.yAxis = domapi.Elm({parent:this,x:0,y:0});
  this.isYAxis = true;
  this.yAxis.setText('');
  if(this.isVert)this.vText(t,this.yAxis);
    else this.yAxis.setText(t);
  if(x)this.yAxis.setX(x);
    else
      if(this.isVert)this.yAxis.setX(this.chart.getX()-this.offX-this.axisSize-4);
        else this.yAxis.setX(this.chart.getX());
  if(y)this.yAxis.setY(y);
    else 
      if(this.isVert)this.yAxis.setY(this.alA(t));
        else this.yAxis.setY(this.alH()+this.offY+4);
  if(!this.isVert)this.yAxis.setW(this.chart.getW());
    else this.yAxis.setW(this.axisSize);
  var w=this.yAxis.style;
  try{
    w.textAlign='center';
    w.fontFamily=this.axisFont;
    w.fontWeight='bold';
    w.fontSize=this.axisSize+'px';
    w.color=domapi.theme.fonts.window.color;
    w.visibility='visible';
    if(this.isVert)w.lineHeight=(this.axisSize-1)+'px';
  }finally{w = null}
};
//------------------------------------------------------------------------------
domapi.comps.barchart.clearNames=function(){                    // Used to clear the bar-names
  var t=this.childNodes[1];
  try{
    var z=t.childNodes.length;                
    this.isNames=false;
    if(z>0)
      for(var a=0;a<z;a++)
        t.removeChild(t.childNodes[0]);
  }finally{t = null}
};
//------------------------------------------------------------------------------
domapi.comps.barchart.clearTitle=function(){
  if(!this.barTitle)return;
  this.barTitle.style.visibility='hidden';
  this.isTitle=false;
};
//------------------------------------------------------------------------------
domapi.comps.barchart.clearXAxis=function(){
  if(!this.xAxis)return;
  this.xAxis.style.visibility='hidden';
  this.xAxis=false;
};
//------------------------------------------------------------------------------
domapi.comps.barchart.clearYAxis=function(){
  if(!this.yAxis)return;
  this.yAxis.style.visibility='hidden';
  this.isYAxis=false;
};
//------------------------------------------------------------------------------
domapi.comps.barchart.drawBars=function(){
  var t = domapi.theme;
  var f = t.fonts;
  if(!this.isChart)return;
  try{
    var e = this.data.length;
    for(i=0;i<e;i++){
      if(this.isColors)var a=this.colors[i%this.colors.length];
      else var a=f.selection.bgcolor;
      if(a=='theme')a=f.selection.bgcolor;
      var w=this.chart.childNodes[i+1];
      w.setB(1);
      w.setW((this.isVert)?(this.alW()):(this.alB(i)-1));
      w.setH((this.isVert)?(this.alB(i)):(this.alW()));
      w.setX((this.isVert)?(Math.round(((i)*2*(this.alW()))+(this.alW()/2))):(-1));
      w.setY((this.isVert)?((this.chart.getH()-2)-(this.alB(i))+1):(Math.round(((i)*2*(this.alW()))+(this.alW()/2))));
      w.setZ(1);
      w.setBgColor(a);
      w.style.borderStyle=t.border.solid;
      w.style.borderColor=t.border.active;
    }
    var q=((domapi.isIE && domapi.major==5 && domapi.minor==0)?(100):(0));
    if(this.labels>0)this.setLabels();
    if(this.isNames)setTimeout('domapi.getElm("'+this.id+'").setNames()',q);
  }finally{
    t = null; f = null; w = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.drawChart=function(){
  this.chart.setB(1);
  var w=this.chart.style;
  try{
    w.backgroundColor = this.theme.hlBgColor;
    w.borderColor     = this.theme.bdrColor;      
    for(var a=0;a<this.lines;a++)
      this.chart.childNodes[0].childNodes[a].style.backgroundColor=this.theme.ctrlFgColor;
    this.setGrid();
    this.drawBars();
    if(this.xAxis)this.setXAxis();
    if(this.yAxis)this.setYAxis();
  }finally{
    w = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.draw=function(){
  var t = domapi.theme;
  var f = t.fonts;
  var s = this.style;
  try{
    this.offX=0;this.offY=0;
    /*this.setB(this.theme.bdrWidth);
    var w=this.style;
      w.backgroundColor = this.theme.ctrlBgColor;
      w.color           = this.theme.ctrlFgColor;
      w.borderColor     = this.theme.bdrColor;
      w.borderStyle     = this.theme.bdrSolid;
    if(this.barTitle)
      this.barTitle.style.color = this.theme.fgColor;*/
      
    var b                = this.doBorder?t.border.width:0;
    this.setB(             b);  // set border width *before* border style!!
    this.setColor(         f.window.color);
    this.setBgColor(       this.doBGFill?f.window.bgcolor:"transparent");
    s.borderStyle        = this.doBorder?t.border.solid:"none";
    s.borderColor        = t.border.getInset();

    if(this.isChart)this.drawChart();
  }finally{
    t = null; f = null; s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.barchart.dataSort=function(t){
  this.data=this.data.sort(eval('this.sort'+t));
};
//------------------------------------------------------------------------------