//------------------------------------------------------------------------------
// DomAPI - Groups
// Mark Proctor
// (c) Mark Proctor 2001-2002
//------------------------------------------------------------------------------
// Contributors:
// Mark Proctor
// Philip Mudd
//------------------------------------------------------------------------------
// Created       28/06/2002
// Last Modified 25/07/2002
//------------------------------------------------------------------------------
// History
// 28/06/2002 - First draft created (Philip Mudd)
// 01/07/2002 - Review and general code update (Mark Proctor)
//            - Replaced evals for object properties with object[property]
//            - Moved from arrays to objects for domapi groups.name
//            - Created deleteGroup and deleteFromGroup, and made them delete bidirectionally
// 23/07/2002 - Duplicate elms in a group are no longer allowed (Mark Proctor)
//------------------------------------------------------------------------------
// To Do
//------------------------------------------------------------------------------
// modified for 4.0 by D. Kadrioski
//------------------------------------------------------------------------------

domapi.groups          = {};
domapi.groups.name     = {};
domapi.groups.name.all = domapi.bags.elms;
//------------------------------------------------------------------------------
// Creates the group
//------------------------------------------------------------------------------
domapi.groups.createGroup = function(name){if(!domapi.groups.groupExists(name))domapi.groups.name[name] = [];};
//------------------------------------------------------------------------------
// Deletes the group
//------------------------------------------------------------------------------
domapi.groups.deleteGroup = function(name) {
	if(domapi.groups.groupExists(name))  {
		var e;
		var g = domapi.groups.name[name];
		for (var i=0;i<g.length;i++)
			delete g[i].groups[name];
		delete domapi.groups.name[name];
	}
};
//------------------------------------------------------------------------------
// Returns an array of strings for the group(s) the elm is in
//------------------------------------------------------------------------------
domapi.elmProto.inGroups = function(){
	var g = [];
	for (var o in this.groups)g.push(o);
	return g;
};
//------------------------------------------------------------------------------
// Checks to see if an elm is in a group, returns true or false
//------------------------------------------------------------------------------
domapi.elmProto.isInGroup = function(name){
	if (!this.groups)return false;
	return (typeof this.groups[name] != 'undefined') ? true : false;
};
//------------------------------------------------------------------------------
// Checks to see if a groups exists, returns true or false
//------------------------------------------------------------------------------
domapi.groups.groupExists = function(name){if (domapi.groups.name[name]) return true; else return false};
//------------------------------------------------------------------------------
// adds an elm to a group 'name'
//------------------------------------------------------------------------------
domapi.elmProto.addToGroup = function(name){
  //need to check it's not already in the group
	if (!domapi.groups.groupExists(name)) domapi.groups.createGroup(name);
	var g = domapi.groups.name[name];
	if (domapi.groups.name[name].indexOf(this) == -1)  g.push(this);
	if(!this.groups) this.groups = new Object();
	//check to see if the elm is already in the group
	if (this.groups[name] != null) return;
	this.groups[name] = g.length-1;
};
//------------------------------------------------------------------------------
// Removes an elm from a group, and deletes its index reference
//------------------------------------------------------------------------------
domapi.elmProto.removeFromGroup = function(name){
	//delete elms reference from the group array;
	var index = this.groups[name];
	var g = domapi.groups.name[name];
	g.deleteItem(index);
	//shift all references after the deleted reference by one.
	for (var i=index;i<g.length;i++)g[i].groups[name]--;
	//delete the group index property from the elm
	delete this.groups[name];
};
//------------------------------------------------------------------------------
// Gets a reference to the group 'name'
//------------------------------------------------------------------------------
domapi.groups.getGroup = function(name){
	if(domapi.groups.groupExists(name)) return domapi.groups.name[name];
	else return null;
};
//------------------------------------------------------------------------------
// Execute a function on a group of elms
//------------------------------------------------------------------------------
domapi.groups.callFunction = function(name, func){
	if (!domapi.groups.groupExists(name)) return;
	g = domapi.groups.name[name];
	for (var i=0; i < g.length; i++) {
		var e = g[i];
		e[func]();
	}
};
//------------------------------------------------------------------------------