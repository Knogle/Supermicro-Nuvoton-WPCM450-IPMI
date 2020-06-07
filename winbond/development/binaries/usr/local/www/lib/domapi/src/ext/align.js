//------------------------------------------------------------------------------
// DomAPI alignment routines
// Peter Howarth 1 June 2002
//------------------------------------------------------------------------------
//
// Contributors:
// Peter Howarth
// Philip Mudd
//------------------------------------------------------------------------------
// Created       01/07/2002
// Last Modified 19/07/2002
//------------------------------------------------------------------------------
// History
// 05/07/2002 - First draft created (Peter Howarth)
// 19/07/2002 - Phil's code for snap on collision added in (PH)
//            - moved domapi.snap.isIn() to collision
//            - added spaceVertical and spaceHorizontal
// 24/07/2002 - code update and additional functions for different kinds of spacing (Philip Mudd)
//            - aligning left to right, top to bottom, and distribute elms              
//
//------------------------------------------------------------------------------
// To Do
// - Radial spacing
// - Spacing along a path
// - compress the spacing and distribute code as there is a lot of overlap
//------------------------------------------------------------------------------

//extend domapi API
domapi.align = new Object();

//-------------------------------------------------------------------------------
//-- Functions to align the elms selected in domapi.selection.elms
//-------------------------------------------------------------------------------

//------------------------------------------------------------------------------
domapi.align.alignLeft = function() {
  var s = domapi.selection.elms;
  if (s == null || s.length<1) return;
  else {
    var left = s[0].getX();
    for(var i=1; i<s.length; i++) {
			s[i].setX(left);
    }
  }
};
//------------------------------------------------------------------------------
domapi.align.alignRight = function() {
  var s = domapi.selection.elms;
  if (s == null || s.length<1) return;
  else {
    var right = s[0].getX() + s[0].getW();
    for(var i=1; i<s.length; i++) {
      var x = right - s[i].getW();
      s[i].setX(x);
    }
  }
};
//------------------------------------------------------------------------------
domapi.align.alignCentre = function() {
  var s = domapi.selection.elms;
  if (s == null || s.length<1) return;
  else {
    var centre = s[0].getX() + s[0].getW()/2;
    for(var i=1; i<s.length; i++) {
      var x = centre - s[i].getW()/2;
      s[i].setX(x);
    }
  }
};
//------------------------------------------------------------------------------
domapi.align.alignTop = function() {
  var s = domapi.selection.elms;
  if (s == null || s.length<1) return;
  else {
    var top = s[0].getY();
    for(var i=1; i<s.length; i++) {
      s[i].setY(top);
    }
  }
};
//------------------------------------------------------------------------------
domapi.align.alignBottom = function() {
  var s = domapi.selection.elms;
  if (s == null || s.length<1) return;
  else {
    var bottom = s[0].getY() + s[0].getH();
    for(var i=1; i<s.length; i++) {
      var x = bottom - s[i].getH();
      s[i].setY(x);
    }
  }
};
//------------------------------------------------------------------------------
domapi.align.alignMiddle = function() {
  var s = domapi.selection.elms;
  if (s == null || s.length<1) return;
  else {
    var middle = s[0].getY() + s[0].getH()/2;
    for(var i=1; i<s.length; i++) {
      var x = middle - s[i].getH()/2;
      s[i].setY(x);
    }
  }
};
//------------------------------------------------------------------------------
domapi.align.horizontalSpacing = function(){
  var s = domapi.selection.elms;
  if (s == null || s.length<3) return;
  var l = s.length;  

  domapi.align.xValue = new Array();
  var x = domapi.align.xValue;
  for(var i=0; i<l; i++) x[i] = [s[i].getX(), s[i]];
  x.sort(function(a,b){return a[0]-b[0];}); // sort in x order
  var minX = x[0];// + x[0][0].getW();
  minX[0] = minX[0] + minX[1].getW(); //set min to right of elm
	var maxX = x[s.length-1];
	var gap = maxX[0] - minX[0];
	var totalElmsWidth =0;
	for(var i=1; i < x.length-1; i++) // check the elms will fit in the gap
		totalElmsWidth += x[i][1].getW();
	//if(totalElmsWidth > gap) alert("Elms won't fit in the gap");	
	var remainder = (gap - totalElmsWidth) / (l-1); //remainder is gap around elms	  
	for(var j=1; j<s.length-1; j++)
	x[j][1].setX((x[j-1][1].getX() + x[j-1][1].getW()) + remainder);
};
//------------------------------------------------------------------------------
domapi.align.verticalSpacing = function(){
  var s = domapi.selection.elms;
  if (s == null || s.length<3) return;
  var l = s.length;  
  domapi.align.yValue = new Array();
  var y = domapi.align.yValue;
  for(var i=0; i<l; i++) y[i] = [s[i].getY(), s[i]];
  y.sort(function(a,b){return a[0]-b[0];});
  var minY = y[0];
  minY[0] = minY[0] + minY[1].getH(); // set min to bottom of elm
  var maxY = y[s.length-1];
  var gap = maxY[0] - minY[0];
  var totalElmsWidth =0;
	for(var i=1; i < y.length-1; i++) // check the elms will fit in the gap
	  totalElmsWidth += y[i][1].getH();
	//if(totalElmsWidth > gap) alert("Elms won't fit in the gap");
	var remainder = (gap - totalElmsWidth) / (l-1); //remainder is gap around elms
  for(var j=1; j<s.length-1; j++)
    y[j][1].setY((y[j-1][1].getY() + y[j-1][1].getH()) + remainder);
};
//------------------------------------------------------------------------------
domapi.align.centreHorizontal = function(){
  var s = domapi.selection.elms;
  if(s== null || s.length <3) return;
  var l = s.length; 
  domapi.align.xValue = new Array();
  var x = domapi.align.xValue;
  for(var i=0; i<l; i++)
    x[i] = [s[i].getX(), s[i]];
  x.sort(function(a,b){return b[0]-a[0];});
  var minX = x[0];
  var maxX = x[s.length-1];
  var interval = (maxX[0] - minX[0])/(l -1);
  for(var j=1; j<s.length-1; j++)
    x[j][1].setX(minX[0] + (interval*j));          
};
//------------------------------------------------------------------------------
domapi.align.centreVertical = function(){
  var s = domapi.selection.elms;
  if (s == null || s.length <3) return;
  var l = s.length;
  domapi.align.yValue = new Array();
  var y = domapi.align.yValue;
  for(var i=0; i<l; i++)
    y[i] = [s[i].getY(), s[i]];
  y.sort(function(a,b){return b[0]-a[0];});
  var minY = y[0];
  var maxY = y[s.length-1];
  var interval = (maxY[0] - minY[0])/(l -1);
  for(var j=1; j<s.length-1; j++)
    y[j][1].setY(minY[0] + (interval*j));    
};

//------------------------------------------------------------------------------
domapi.align.alignVertical = function(dir){  
	var s = domapi.selection.elms;
	if (s == null || s.length<2) return;
	refElm = s[0];
	if(dir == "down")
    for(var i=1; i< s.length; i++)
      s[i].setY(s[i-1].getY()+ s[i-1].getH());
  else if(dir == "up")
    for(var i=1; i< s.length; i++)
      s[i].setY(s[i-1].getY() - s[i].getH());
    
};
//------------------------------------------------------------------------------
domapi.align.alignHorizontal = function(dir){
  var s = domapi.selection.elms;
  if (s == null || s.length<2) return;	
  refElm = s[0];
  if(dir =="right")
    for(var i=1; i< s.length; i++)
      s[i].setX(s[i-1].getX()+ s[i-1].getW());
  else if(dir == "left")
    for(var i=1; i< s.length; i++)
      s[i].setX(s[i-1].getX() - s[i].getW());
};

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//eof align.js

			