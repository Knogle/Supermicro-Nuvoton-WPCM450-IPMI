//------------------------------------------------------------------------------
// DomAPI - Groups
// Mark Proctor
// (c) Mark Proctor 2001-2002
//------------------------------------------------------------------------------
// Contributors:
// Philip Mudd
//------------------------------------------------------------------------------
// Created       06/06/2002
// Last Modified 04/07/2002
//------------------------------------------------------------------------------
// History
// 06/06/2002 - First draft created (Philip Mudd)
// 04/07/2002 - Review and general code update 
// 23/07/2002 - Array of collisions added (Philip Mudd)
//------------------------------------------------------------------------------
// To Do			
//            - Finalise the grid Searching alogorthim
//------------------------------------------------------------------------------


//-- degugging
debugCollision = false;

domapi.collision = new Object();


//------------------------------------------------------------------------------   
// checks for collision between an elm, group, or an array of groups - group names are strings
//------------------------------------------------------------------------------   
domapi.elmProto.hasHit = function(t){
	return domapi.collision.hasHit(this,t);
};
//------------------------------------------------------------------------------   
// checks for collision between an elm, group, or an array of groups - group names are strings
// Allows for optimal searching using grids
//------------------------------------------------------------------------------   
domapi.collision.hasHit = function(s,t){
  if(
    (domapi.collision._excludeElm(t)) ||
    (domapi.collision._excludeElm(s)) ||
    (s.style.display == "none" || s.style.display == "none") ||
    (s.tagName == "IFRAME" || s.tagName == "IFRAME")
  )return [];
	var _allCollisions = new Array();
	var c;
	if(typeof t == 'string'){
		if(domapi.gridSearch && domapi.gridSearch.gridOn)	c = domapi.collision._checkCollisionInQuads(s,t);
		else c =  domapi.collision._checkCollision(s,t);				
		if(c) _allCollisions.push(c);
	}
  else if((typeof t == 'object') && (!t.DA_TYPE)){  		
  	for(var i=0; i<t.length; i++){
  	  if(domapi.gridSearch && domapi.gridSearch.gridOn) c = domapi.collision._checkCollisionInQuads(s,t[i]);		    
  		else c = domapi.collision._checkCollision(s,t[i]);  		
  		if(c) _allCollisions.push(c);  
  	}						
	}		
  else if(t.DA_TYPE)
    if(domapi.collision._isColl(s,t)) _allCollisions.push([t]); // an elm  
  
  
  return _allCollisions;
  
};
//------------------------------------------------------------------------------   
//------- returns true if there is a collision between s & t
//------------------------------------------------------------------------------   

//-------------------------------------------------------------------------------
domapi.collision._excludeElm = function(e){ // D. Kadrioski
  if(domapi.unitLoaded("window"))
    if(domapi.findParent(e, "WINDOW"))return true; // exclude the inner parts of windows
  return false;
};
//-------------------------------------------------------------------------------
domapi.collision._isColl = function(s,t){	
  var sX, sY, sW, sH, tX, tY, tW, tH;  	
  sX1 = s.getX();
  sY1 = s.getY();
  sX2 = sX1 + s.getW();
  sY2 = sY1 + s.getH();
 	tX1 = t.getX();
  tY1 = t.getY();
  tX2 = tX1 + t.getW();
  tY2 = tY1 + t.getH();
 
  if ( (s != t) &&// not the same elm
    (tY1<=sY1&&tY2>=sY1||  //top overlap
	   tY1<=sY2&&tY2>=sY2||  //bottom overlap
	   tY1>=sY1&&tY2<=sY2)&& //horizontallly enclosed
    (tX1<=sX1&&tX2>=sX1||  //left overlap
     tX1<=sX2&&tX2>=sX2||  //right overlap
     tX1>=sX1&&tX2<=sX2)) {//end if
   
   if(debugCollision)
      alert('collision');
    return true;
  }
    
  return false;
};     

//------------------------------------------------------------------------------   
// checks forCollisions between elm 's' and a groups 'g'
//------------------------------------------------------------------------------   
domapi.collision._checkCollision = function(s,g){
 	var group = domapi.groups.getGroup(g);      
 	var collisions = new Array();  
 	if(group){    	
		for(var i=0; i < group.length; i++)
	   	if(domapi.collision._isColl(s,group[i]))
	   		collisions.push(group[i]);	    	       	
   }
   else
  	 throw new Error("!!-- Group '" + g +"' does not exist");     	  	 	  
  	
  return collisions;       	    
  //return null;
};
//------------------------------------------------------------------------------
// uses the grid / quad system to check for collision
//------------------------------------------------------------------------------

domapi.collision._checkCollisionInQuads = function(s,g){	  
	var group = domapi.groups.getGroup(g);		//reference to the group list of elms
	var quads = domapi.gridSearch.elmInQuad(s); // quads to search through
	var collisions = new Array();
  if(group && quads) //check through groups and quads
	  for(var j=0; j<group.length; j++)
	    for(var k=0; k<quads.length; k++)
	      for(var l=0; l<quads[k].elms.length; l++){
  	      var t = quads[k].elms[l];    	        	
    	    if(group.indexOf(t) >= 0 )
      	   	if(domapi.collision._isColl(s,t)) collisions.push(t);
	     	}
	  	  	  
	if(domapi.gridSearch.ignoredList.indexOf(s) >= 0 && group)//elm is in the ignoredList
	  for(var i=0; i < group.length; i++)
	    if(domapi.collision._isColl(s,group[i]))
	    	collisions.push(group[i]);	    
	  
  if(domapi.gridSearch.searchAll) // include ignored elms list	    
  	for(var i=0; i < domapi.gridSearch.ignoredList.length; i++)
  		if(domapi.collision._isColl(s,domapi.gridSearch.ignoredList[i]))	  	    
  			collisions.push(domapi.gridSearch.ignoredList[i]);  	  	  

	return collisions;	  			  		  	  			
  //return null;
};	


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//eof collision.js
