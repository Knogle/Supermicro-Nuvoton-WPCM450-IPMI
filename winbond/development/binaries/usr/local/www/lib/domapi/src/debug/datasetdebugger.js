//------------------------------------------------------------------------------
// DomAPI Dataset Debugging Routines
// D. Kadrioski 10/1/2003
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

domapi.loadUnit("debugger");
domapi._lastDatasetDebug;
domapi._winDataset = null;
//------------------------------------------------------------------------------
domapi.Dataset.prototype.dump = function(){
  var d = domapi.debug;
  var r,i,j;
  domapi._lastDatasetDebug = this;
  domapi._datasetUnload(); // closes window if already open  
  d.dumpProps(this);

  r = '<html><head>'+
    '<style>td,th{vertical-align:top}</style>'+
    '<script>var c = opener.domapi;var d = c.debug;var ds = c._lastDatasetDebug;</script>'+
    '</head><body><table border="1"><tr><th></th>';
  var cols = this.cols;//this.visibleCols();
  for(i=0;i<cols.length;i++)
    r += '<th><a href="#" onclick="d.dumpProps(ds.cols['+
         i+']);return false">' + (cols[i].hidden?"[H] ":"") + cols[i].text + '</a></th>';
    
  for(i=0;i<this.rows.length;i++){
    r += '<tr><th><a href="#" onclick="d.dumpProps(ds.rows['+i+']);return false">'+i+'</a></th>';
    for(j=0;j<cols.length;j++){
      r += '<td><a href="#" onclick="d.dumpProps(ds.cellByIndex('+i+','+j+
      '));return false">' + (cols[j].hidden?"[H] ":"") + this.displayText(i,j) + '&nbsp;</a></td>';
    }
    r += '</tr>';
  }
  r +=
    '</table></body></html>';
  domapi._winDataset = window.open("","","height=400,width=600,resizable=yes,scrollbars=yes");
  domapi._winDataset.document.writeln(r);
  
  var h = parseInt(screen.availHeight / 2);
  var x = parseInt(parseInt(screen.availWidth)*0.35);
  var w = parseInt(screen.availWidth)-x;
//  top.resizeTo(w, h);
  domapi._winDataset.moveTo(x,h);
  domapi._winDataset.resizeTo(w,h);
};
//------------------------------------------------------------------------------
domapi._datasetUnload = function(){
  var w = domapi._winDataset;
  if(w && !w.closed)w.close();
};
//------------------------------------------------------------------------------
domapi.unloadHooks.push(domapi._datasetUnload);
//------------------------------------------------------------------------------