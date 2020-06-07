//------------------------------------------------------------------------------
// DomAPI Snap
// Mark Proctor
// (c) Mark Proctor 2001-2002
//------------------------------------------------------------------------------
// Contributors:
// Peter Howarth
// Phil Mudd
// Mark Proctor
//------------------------------------------------------------------------------
// Created       05/07/2002
// Last Modified 23/07/2002
//------------------------------------------------------------------------------
// History
// 05/07/2002 - First draft created (Peter Howarth)
// 19/07/2002 - Phil's code for snap on collision added in (Peter Howarth)
// 23/07/2002 - Moved snap related align code from align to snap (Mark Proctor)
//------------------------------------------------------------------------------
// To Do
// -More intelligent collision overlap code, that checks the destination of the snap to make sure there isn't an overlap
//------------------------------------------------------------------------------
//
//
//-------- units loaded for snap on collision--------------------------------
domapi.loadUnit("collision");
domapi.loadUnit("groups");
domapi.useElmHooks = true;

//------------------------------------------------------------------------------

domapi.snap = new Object();
domapi.snap.grid = 25;

//-------------------------------------------------------------------------------
domapi.snap.on = function(){
	domapi.regHook('moveTo', domapi.snap._snapXY);
};
//------------------------------------------------------------------------------
domapi.snap.off = function(){
	domapi.unRegHook('moveTo', domapi.snap._snapXY);
};
//------------------------------------------------------------------------------
domapi.snap.setGrid = function(g){
	domapi.snap.grid = g;
};
//-------------------------------------------------------------------------------
//  Snaps the elm to the grid
//-------------------------------------------------------------------------------

domapi.snap._snapXY = function(e) {
  if(domapi.snap._excludeElm(e))return; // D. Kadrioski
  if(e.collisionOccured)
    e.collisionOccured = false;
  else{
	  var x = e.getX() - e.getX()%domapi.snap.grid;
	  var y = e.getY() - e.getY()%domapi.snap.grid;
	  e.setX(x);
	  e.setY(y);
	}
};
//-------------------------------------------------------------------------------
//-- Collision snapping
//-------------------------------------------------------------------------------
domapi.snap.collOn = function(){
	domapi.regHook('moveTo', domapi.snap.checkCollision);
};
//-------------------------------------------------------------------------------
domapi.snap.collOff = function(){
	domapi.unRegHook('moveTo', domapi.snap.checkCollision);
};
//-------------------------------------------------------------------------------
domapi.snap.checkCollision = function(e){
  if(domapi.snap._excludeElm(e))return; // D. Kadrioski
	var a = e.hasHit('all'); 				 //all is a group hard coded in groups.js, all elms on page
  if(!a.length)return;  //D. Kadrioski
	if(a[0][0]){ 				             //use a 'colision' set to collide with...
		domapi.snap._snapToElm(e,a[0][0]);  // hasHit returns an array of collided elms
    e.collisionOccured = true;        // snaps to first one.
  }     														 // however one could iterate through list          
};

//-------------------------------------------------------------------------------
//  Functions for snaping
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
domapi.snap._excludeElm = function(e){ // D. Kadrioski
  if(domapi.unitLoaded("window"))
    if(domapi.findParent(e, "WINDOW"))return true; // exclude the inner parts of windows
  return false;
};
//-------------------------------------------------------------------------------
domapi.snap._snapToElm = function(s,t){
	//needs an alg to work out which are the closest edges..
  //get the dimensions of each elm
	var a = domapi.snap;
	var sX,sY,sW,sH,tX,tY,tW,tH;
	sX = s.getX();
	sY = s.getY();
	sW = s.getW();
	sH = s.getH();
	tX = t.getX();
	tY = t.getY();
	tW = t.getW();
	tH = t.getH();
	var cX = sX + (sW/2);
	var cY = sY + (sH/2);
	var centerIn = false;
	if(a._isIn(t, cX, cY))
  	centerIn = true;
  //should be better than this...
  //use the code from collision to check for overlap....
  //check for  two corners
	if(a._isIn(t,sX,sY) && a._isIn(t,sX,sY+sH) && !(a._isIn(t,sX+sW,sY)) && !(a._isIn(t,sX+sW,sY+sH)))
		domapi.snap._alignLeftToRight(t,s);
	else if(!(a._isIn(t,sX,sY)) && !(a._isIn(t,sX,sY+sH)) && (a._isIn(t,sX+sW,sY)) && (a._isIn(t,sX+sW,sY+sH)))
		domapi.snap._alignRightToLeft(t,s);
	else if((a._isIn(t,sX,sY)) && !(a._isIn(t,sX,sY+sH)) && (a._isIn(t,sX+sW,sY)) && !(a._isIn(t,sX+sW,sY+sH)))
		domapi.snap._alignBottomToTop(t,s);
	else if(!(a._isIn(t,sX,sY)) && (a._isIn(t,sX,sY+sH)) && !(a._isIn(t,sX+sW,sY)) && (a._isIn(t,sX+sW,sY+sH)))
		domapi.snap._alignTopToBottom(t,s);
     //check otherwise
	else if(cX <= (tX + tW/2) && cY <= (tY + tH/2)){
			if(centerIn)
				domapi.snap._alignTopToBottom(t,s);
			else
				domapi.snap._alignRightToLeft(t,s);
			}
			else if(cX <= (tX + tW/2) && cY >= (tY + tH/2)){
      	if(centerIn)
					domapi.snap._alignBottomToTop(t,s);
				else
					domapi.snap._alignRightToLeft(t,s);
			}
			else if(cX >= (tX + tW/2) && cY <= (tY + tH/2)){
      	if(centerIn)
					domapi.snap._alignTopToBottom(t,s);
				else
					domapi.snap._alignLeftToRight(t,s);
			}
			else if(cX >= (tX + tW/2) && cY >= (tY + tH/2)){
				if(centerIn)
					domapi.snap._alignBottomToTop(t,s);
				else
					domapi.snap._alignLeftToRight(t,s);
			}
};
//-------------------------------------------------------------------------------
//  returns true if point (x,y) is withing elm 's'
//-------------------------------------------------------------------------------
domapi.snap._isIn = function(s,x,y){
	if( (x >= s.getX() && x <= (s.getX() + s.getW())) && (y >= s.getY() && y <= (s.getY() + s.getH())))	
    return true;
	else
		return false;
};
//-------------------------------------------------------------------------------
//  aligns bottom of elmMore to top of elmFix
//-------------------------------------------------------------------------------
domapi.snap._alignTopToBottom = function(elmFix,elmMove){
	var topFix = elmFix.getY();
	elmMove.setY(topFix - elmMove.getH());
};
//--------------------------------------------------------
//  aligns top of elmMove to bottom of elmFix
//-------------------------------------------------------------------------------
domapi.snap._alignBottomToTop = function(elmFix,elmMove){
	var botFix = elmFix.getY() + elmFix.getH();
	elmMove.setY(botFix);
};
//-------------------------------------------------------------------------------
//  aligns left of elmMove to right of elmFix
//-------------------------------------------------------------------------------
domapi.snap._alignLeftToRight = function(elmFix,elmMove){
	var leftFix = elmFix.getX() + elmFix.getW();
	elmMove.setX(leftFix);
};
//-------------------------------------------------------------------------------
//  aligns right of elmMove to left of elmFix
//-------------------------------------------------------------------------------
domapi.snap._alignRightToLeft = function(elmFix,elmMove){
	var rightFix = elmFix.getX();
	elmMove.setX(rightFix - elmMove.getW());
};


//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//eof snap.js
