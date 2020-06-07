/*
**	Library : listgrid.js
**	author: chandrasekarr@amiindia.co.in
**
********************************************************
    Initial arguments
    -----------------

	  w				  : width %, px  (parseInt(document.body.clientWidth)-20), //+parseInt(vcolsa[2])
	  h				  : height %, px (parseInt(document.body.clientHeight)-180),
	  doAllowNoSelect : true,

    // to-do
	  doShowHeader    : true


	  Column arguments
	  ----------------

	  w         : width  %, px
	  h         : height %, px
	  textAlign : center, left, right

********************************************************
*/

//#define
IMGPATH = "../res/img";

var lGrid = {};

//debug mode
lGrid.traceOn = false;



if(lGrid.traceOn)
var gTraceWnd = window.open("","tracer","width=800, height=600, scrollbars=yes");

rCln = [];
lGrid.selected = [];
        
var listgrid = function(arg)
{
	lGrid.traceClear();
	lGrid.trace('Listgrid Constructor starting');
	lGrid.__constructor(arg);

	return lGrid;
}

//listgrid constructor object
lGrid.__constructor = function(arg)
{
  this.table = document.createElement('div');
	this.container = document.createElement('table');
	
	this.table.appendChild(this.container);

  this.container.className = "listgrid";

  //delete all spacings and margins and handle them by css
  cellspacing = document.createAttribute('cellspacing');
  cellspacing.nodeValue = 0;
  cellpadding = document.createAttribute('cellpadding');
  cellpadding.nodeValue = 0;
 	this.container.setAttributeNode(cellspacing);
 	this.container.setAttributeNode(cellpadding);

	_this_container_header = this.container.createTHead();
  this.container.header = _this_container_header.insertRow(0);

	this.container.header.className = 'head';


  tBody = document.createElement('tbody');
  this.container.appendChild(tBody);
  
  tBody.style.height = arg.h?arg.h:"";

	this.container.style.width = "100%";
 this.table.style.width = arg.w?arg.w:"100%";
  if(window.ActiveXObject)
  {

 	   this.container.header.style.position = 'absolute';
	   this.container.header.style.top = (this.container.offsetTop-17)+'px';
     this.container.style.width = "99%";
     this.table.style.height = arg.h?arg.h:"";
     this.table.style.overflowX = 'hidden';
     this.table.style.overflowY = 'auto';
  }
  	lGrid.trace("Listgrid .. ActiveXObject out "+this.table+" = "+this.table.style.height);
	for(i in arg)
  {
    if(i!='w' && i!='h')
    lGrid[i] = arg[i];
  }
}

//add heading columns to the listgrid
lGrid.addCol = function(arg)
{

 	//var th = this.container.header.insertCell(-1);
 	var th = document.createElement('th');
  this.container.header.appendChild(th);

 	arg.value = arg.value?arg.value:arg.text;

	th.innerHTML = "&nbsp; "+arg.value + " &nbsp; <img src='"+IMGPATH+"/sortup.gif' title='Ascending' alt='Ascending' />" ;

	th.image = th.getElementsByTagName('img')[0];
	th.idno = this.container.header.cells.length-1;
	th.fieldType = arg.fieldType;

	th.style.width = arg.w.toString().indexOf('%')==-1?arg.w+'px':arg.w;

	th.className = 'head';
	th.style.whiteSpace = 'nowrap';

	th.onmouseover = function()
  {
    // this.className = 'headHover';
    this.style.backgroundColor = '#AAAAAA';
    this.style.cursor = 'pointer';
    this.style.cursor = 'hand';
  }

  th.onmouseout = function()
  {
     this.style.backgroundColor= '#ECE9D8';    
  }

  th.onclick = function()
  {
  try{
  	lGrid.table.scrollTop='0';
  	}catch(e){
  	alert(e.description);
  	}
     this.image.src = this.image.src.indexOf('sortup')==-1?IMGPATH+"/sortup.gif":IMGPATH+"/sortdown.gif";

     // prepare for the sorting combat [-O<]


        // using rCln now;
        var _srtAry = [];


         for(i=0; i<rCln.length; i++)
         {
           _srtAry[i] = rCln[i].cells[this.idno].innerHTML.replace(/<wbr\/?>/ig,'');
         }


        //now sort
        if(this.fieldType == 2)
        {
          _srtAry = _srtAry.sort(sortNumber);
        }else
        {
          _srtAry = _srtAry.sort();
        }



        //now remove previous fields and add current
        var fSrtAry = [];

        var bkCln = rCln;


        //take single sorted array

        if(this.image.src.indexOf('sortup')!= -1)
        {
          this.image.title='Ascending';
          this.image.alt='Ascending';

        for(i=0; i<_srtAry.length; i++)
        {
          lGrid.trace("i = "+i);
          //check which row the element was resided
          for(rs = 0; rs < bkCln.length; rs++)
          {
            if(_srtAry[i] == bkCln[rs].cells[this.idno].innerHTML.replace(/<wbr\/?>/ig,''))
            {
              fSrtAry[i] = [];
              //copy that row content to an array
              for(h = 0; h<lGrid.container.header.cells.length; h++)
              {
                fSrtAry[i][h] = bkCln[rs].cells[h].innerHTML.replace(/<wbr\/?>/ig,'');
              }

              lGrid.trace("fSrtAry["+i+"] = " + fSrtAry[i]);

              //remove the cell entry
              bkCln[rs].cells[this.idno].innerHTML = '';

              break;
            }
          }
        }

        }else
        {
          this.image.title='Descending';
          this.image.alt='Descending';

        for(i=_srtAry.length-1; i>=0; i--)
        {
          lGrid.trace("i = "+i);
          //check which row the element was resided
          for(rs = 0; rs < bkCln.length; rs++)
          {
            if(_srtAry[i] == bkCln[rs].cells[this.idno].innerHTML.replace(/<wbr\/?>/ig,''))
            {
              fSrtAry[(_srtAry.length-1)-i] = [];
              //copy that row content to an array
              for(h = 0; h<lGrid.container.header.cells.length; h++)
              {
                fSrtAry[(_srtAry.length-1)-i][h] = bkCln[rs].cells[h].innerHTML.replace(/<wbr\/?>/ig,'');
              }
              lGrid.trace("fSrtAry["+((_srtAry.length-1)-i)+"] = " + fSrtAry[(_srtAry.length-1)-i]);

              //remove the cell entry to stop any further comparison
              bkCln[rs].cells[this.idno].innerHTML = '';

              break;
            }
          }
        }

        }

        //delete allData
        lGrid.clear(false);


        //now add all data to the table.
           for(i=0; i<fSrtAry.length; i++)
           {
             lGrid.addRow(fSrtAry[i].join(','));
           }

        //GC and mem leaks
        delete bkCln;
        delete _srtAry;
        delete fSrtAry;
        
     // Thank you ! god!!!
  }

	if(arg.h)
  {
	  th.style.height = (arg.h.toString().indexOf('%')==-1?arg.h+'px':arg.h);
  }

  th.style.textAlign = (arg.textAlign && arg.textAlign!=undefined)?arg.textAlign:'left';

  //fire onload event;
  this.onload();
}

//this list acts loaded when headers are added
lGrid.onload = function()
{
	//IE fix
	if(window.ActiveXObject){
		if(document.body.offsetWidth<this.container.header.offsetWidth)
			this.table.style.width = (this.container.header.offsetWidth+20)+'px';
	}
}

//add a new row
// arg - comma separated values
lGrid.addRow = function(arg)
{
  //var tr = this.container.insertRow(this.container.rows.length);
  var tr = document.createElement('tr');
  this.container.tBodies[0].appendChild(tr);

  rCln.push(tr);

  tr.className = 'normal';

  sArgs = arg.split(',');

  for(s=0; s<sArgs.length; s++)
  {
    var td = tr.insertCell(s);
    td.innerHTML = sArgs[s].toString().replace(/:COMMA:/g,','); 
    if(td.innerHTML == "")
    {
    	td.innerHTML = "&nbsp; "; //"~";
    }
    //planning to use this in really long words having an optional argument
    //.wordWrap(10,"<wbr/>",true);
	try{
		td.style.textAlign = lGrid.container.header.cells[s].style.textAlign;
	}catch(e){
		//not a problem set it as left
		td.style.textAlign = 'left';
	}
    td.style.paddingRight = '1em';
    td.style.paddingLeft = '1em';
  }

  if(!this.doAllowNoSelect)
  {
    tr.onclick = function()
    {
       // allow multi selection later
		lGrid.selectRow(this);
    }
    
    //hook document keydown event for listgrid
    //support for mozilla firefox 
    //IE can support directly from lGrid.table
    //But this is cross-browser override
    
    document.onkeydown = function(e)
    {
    	if(!e) e = window.event;
    	if(e.keyCode==116)
    	{
    		top.g_userpressedF5 = true;
    	}
    	
    	if(lGrid.selected.length==0) return;
    
    	if(e.keyCode==38)
    	{
    		//do move up
    		if(lGrid.selected[0].previousSibling)
    		{
    			lGrid.selectRow(lGrid.selected[0].previousSibling);
    		}
    	}
    	
    	if(e.keyCode==40)
    	{
    		//do move down
    		if(lGrid.selected[0].nextSibling)
    		{
    			lGrid.selectRow(lGrid.selected[0].nextSibling);
    		}
    	}
    }
  }
	
  //fire onload event;
  this.onload();
}


//select a given row in the listgrid
lGrid.selectRow = function(tRow)
{
	for(i=0; i<rCln.length; i++)
	{
	  rCln[i].className = 'normal';
	}
	
	tRow.className = 'selected';
	tRow.focus();
	
	lGrid.selected = [];
	
	lGrid.selected[0] = tRow;
	lGrid.trace(tRow + " clicked ");
	
	//handle following event if any
	if(lGrid.ontableselect)
		 lGrid.ontableselect();
}

//load json object elements - compatible with DOMAPI 4
lGrid.loadFromJson = function(args)
{
  this.clear(true);

  for(c=0; c<args.cols.length; c++)
  {
    this.addCol(args.cols[c]);
  }

  if(args.rows){
  for(r=0; r<args.rows.length; r++)
  {
    var tCell = [];
    for(cell=0; cell<args.rows[r].cells.length; cell++)
    {
	  if(args.rows[r].cells[cell])
	  {
		var txt = args.rows[r].cells[cell].text;
		txt = txt.toString().replace(/,/g,':COMMA:');
		tCell.push(txt);
	  }
	  else
	  {
		tCell.push('~');
	  }
    }
    this.addRow(tCell.join(','));
  }
  }
}

//Delete all rows in the listgrid
lGrid.clear = function(headDelete)
{
   if(headDelete)
   {
     while(lGrid.container.header.cells.length)
        lGrid.container.header.deleteCell(lGrid.container.header.cells.length-1);
   }

    while(lGrid.container.rows.length>1)
    {
       //remove all rows
       lGrid.container.deleteRow(lGrid.container.rows.length-1);
    }


    while(rCln.length) rCln.pop();
    delete rCln;
    rCln = [];
}

//get any selected row
lGrid.getRow = function(tr)
{
	return tr;
}

//for debug
lGrid.trace = function(stack)
{
  if(lGrid.traceOn)
  {
  	if(!gTraceWnd || gTraceWnd=='undefined' || gTraceWnd==undefined)
	{
      	  gTraceWnd = window.open("","tracer","width=800, height=600, scrollbars=yes");
    	}

	gTraceWnd.document.writeln(stack+"<br><br>");
	gTraceWnd.scrollTo(0,10000000);
  }
}

//try clear debug
lGrid.traceClear = function()
{
  if(lGrid.traceOn){
    if(!gTraceWnd || gTraceWnd=='undefined' || gTraceWnd==undefined)
    {
  	  gTraceWnd.src="";
    }
  }
}

//do a wordwrap with <wbr> to all strings inside table to prevent long text
// override

String.prototype.wordWrap = function(m, b, c){
	var i, j, s, r = this.split("\n");
	if(m > 0) for(i in r){
		for(s = r[i], r[i] = ""; s.length > m;
			j = c ? m : (j = s.substr(0, m).match(/\S*$/)).input.length - j[0].length
			|| j.input.length + (j = s.substr(m).match(/^\S*/)).input.length + j[0].length,
			r[i] += s.substr(0, j) + ((s = s.substr(j)).length ? b : "")
		);
		r[i] += s;
	}
	return r.join("\n");
};



if(window.ActiveXObject){
	window.onresize = function()
	{
		try{
			lGrid.container.header.style.top = (lGrid.table.parentNode.offsetTop - 17)+'px';	
		}catch(e){
			// before table load event..
		}
	}

	top.window.document.body.onresize = function()
	{
		lGrid.container.header.style.top = (lGrid.table.parentNode.offsetTop - 17)+'px';
			//handle custom events
			
			if(lGrid.onpageresize)
			{
				lGrid.onpageresize();
			}
	}
}

//for sorting number array
function sortNumber(a,b)
{
  return a-b;
}
