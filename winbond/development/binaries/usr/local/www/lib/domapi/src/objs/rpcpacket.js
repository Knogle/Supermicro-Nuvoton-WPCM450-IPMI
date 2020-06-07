//------------------------------------------------------------------------------
// DomAPI domapi RPC routines
// D. Kadrioski 8/12/2002
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------
domapi.loadUnit("list");
mtGet  = 0;
mtPost = 1;
//------------------------------------------------------------------------------
domapi.RPCPacket = function(arg){
  this.guid       = domapi.guid();
  this.url        = domapi.rVal(arg["url"]);
  this.data       = new domapi.List();
  this.statusText = domapi.rVal(arg["statusText"],domapi.getString("RPC_DEF_STATUS"));
  this.method     = domapi.rInt(arg["method"], mtGet);
};
//------------------------------------------------------------------------------
domapi.RPCPacket.prototype.loadFromForm = function(f){
  this.data.loadFromForm(f,true);
};
//------------------------------------------------------------------------------