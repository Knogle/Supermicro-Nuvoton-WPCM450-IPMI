//==============================================
// DomAPI Calendar Template
// D. Kadrioski 1/20/2002
// (c) Nebiru Software 2001,2005
//==============================================

domapi.loadUnit("sysutils");
domapi.loadUnit("list");
domapi.registerComponent("calendar");
//------------------------------------------------------------------------------
domapi.Calendar = function(arg){return domapi.comps.calendar.constructor(arg)};
//------------------------------------------------------------------------------
domapi.comps.calendar.constructor = function(arg){
  var e             = domapi.Component(arg,"calendar");
  try{
    e.style.cursor    = "default";
    e._holidayCells   = [];
    e.selection       = [];
    e.m               = e.value.getMonth();
    e.d               = e.value.getDate();
    e.y               = e.value.getFullYear();
  
    e.titlebar        = domapi.Elm({parent:e,h:18});
    e.titlebar2       = domapi.Elm({parent:e,h:18});
  
    e.controls        = domapi.Elm({parent:e,h:26,type:"DIV",position:"relative",skipAdd:true});
    e.controls.setP(0);e.controls.setM(0);
    
    e._body           = domapi.Elm({skipAdd:true});
    e._body.innerHTML = domapi._private.calendar.bodyHTML;
    e._cal            = domapi.Elm({ref:e._body.childNodes[0]});
  
    e._cal.style.position = "relative";
    e._cal.style.left     = "-1px";
  
    var s = domapi.theme.skin;
    e.titlebar.className       = "DA_CALENDAR_TITLE";
    e.titlebar2.className      = "DA_CALENDAR_TITLE";
    e.titlebar.style.textAlign = "center";
    e.titlebar2.innerHTML =
      '<table align="center" border="0" cellpadding="0" cellspacing="0"><tr>' +
      '<td align="left"><img style="cursor:'+ domapi.cursors.hand +'" ' +
      'src="' + s.calendarLeft.src + '" title="' + domapi.getString("DECREMENT_MONTH") + '" ' +
      'onclick="document.getElementById(\'' + e.id + '\').setMonthBy(-1)"></td>' +
      '<td align="center"></td>' +
      '<td align="left"><img style="cursor:'+ domapi.cursors.hand +'" ' +
      'src="' + s.calendarRight.src + '" title="' + domapi.getString("INCREMENT_MONTH") + '" ' +
      'onclick="document.getElementById(\'' + e.id + '\').setMonthBy(1)"></td>' +
      '</tr></table>';
  
    e.controls.innerHTML = '<select></select><input type="Text" size="6">';
    e.cbMonths = e.controls.childNodes[0];
    e.edtYears = e.controls.childNodes[1];
  
    e.cbMonths.style.fontSize = "8pt";
    var list = new domapi.List();
    for(var i=0;i<12;i++)
      list.add(domapi.getString("MONTHS")[i],i);
    list.saveToSelect(e.cbMonths);
    e.cbMonths.selectedIndex = e.m;
    e.cbMonths.style.width   = "80px";  
    e.edtYears.style.font    = 'normal 8pt "Courier New", Courier, monospace';
    e.edtYears.value         = e.y;
    
    e.cols         = e._cal.childNodes;
    e.todayCell    = null; // these are for quick refreshes
    e.selectedCell = null; // pointer to cell is cleared, rather than re-rendering
  
    e.appendChild(e.controls);
    e.appendChild(e._body);
  
    // attach event handlers
    var p = domapi._private.calendar;
    domapi.addEvent(e._body   ,"mouseover",p.domouseover);
    domapi.addEvent(e._body   ,"mouseout" ,p.domouseout );
    domapi.addEvent(e._body   ,"click"    ,p.doclick    );  
    domapi.addEvent(e.cbMonths,"change"   ,p.docbmonthchange);
    domapi.addEvent(e.cbMonths,"click"    ,p.docbclick);
    domapi.addEvent(e.edtYears,"click"    ,p.docbclick);
    domapi.addEvent(e.edtYears,"keyup"    ,p.doedtyearchange);
  
    domapi.disallowSelect(e._body);
    domapi.disallowSelect(e.titlebar);
    domapi.disallowSelect(e.titlebar2);
    e.setValue(e.value, "I");
    e.render(); // fills the calendar
  
    domapi._finalizeComp( e);
    e.drawAndLayout();  // TODO@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //second layout is required as subelements aren't on the page yet
    return e;
  }finally{
    s    = null;
    e    = null;
    list = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.calendar._free = function(){
  this.titlebar     = null;
  this.titlebar2    = null;
  this.cols         = null;
  this.todayCell    = null;
  this.selectedCell = null;
  this.controls     = null;
  this._body        = null;
  this._cal         = null;
  this.cbMonths     = null;
  this.edtYears     = null;
};
//------------------------------------------------------------------------------
domapi.comps.calendar._draw = function(){
  this.calendarDraw();
};
//------------------------------------------------------------------------------
domapi.comps.calendar.calendarDraw = function(){
  var firstWeekDay = parseInt(domapi.getString("STARTOFWEEK"));
  var weekArray    = domapi.getString("SHORTWEEKDAYS");
  var j;
  for(var i=0;i<7;i++){
    j = i + firstWeekDay;
    if(j > 6)j -= 7;
    this.cols[i].childNodes[0].innerHTML = weekArray[j];
  }

  var t = domapi.theme;
  var f = t.fonts;
  var s = this.style;
  try{
    var b          = this.doBorder?parseInt(t.border.width):0;
    this.setB(       b);  // set border width *before* border style!!
    this.setColor(   f.buttonface.color);
    this.setBgColor( this.doBGFill?f.buttonface.bgcolor:"transparent");
    s.borderStyle  = this.doBorder?t.border.solid:"none";
    s.borderColor  = t.border.threed.darkShadow;
    this.render();
  }finally{
    f = null;
    s = null;
    t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.calendar._layout = function(w,h){
  this._body.setW(    w+2);
  this._cal.setW(     w+2);

  this.titlebar.setW( w);
  this.controls.setW( w);
  this.controls.setH(this.controls.childNodes[0].offsetHeight);

  this.cbMonths.style.width = w - this.edtYears.offsetWidth - 2 + "px";

  this.titlebar2.style.display = this.mode=="compact"?"":"none";
  this.titlebar.style.display  = this.doShowTitle    ?"":"none";
  this.controls.style.display  = this.doShowControls ?"":"none";  

  h -= (this.titlebar2.style.display != "none"?this.titlebar2.getH()+1:0);
  h -= (this.titlebar.style.display  != "none"?this.titlebar.getH() +1:0);
  h -= (this.controls.style.display  != "none"?this.controls.getH() +1:0);
  h -= (this.doShowDays?this.cols[0].childNodes[0].offsetHeight+1:0);
  if(domapi.isIE)h -= 7;
  
  var i, j, s;
  var ww = Math.floor(w/7);
  h += (domapi.isGecko?-4:5);
  var hh = Math.floor(h/6);
  try{
    for(i=0;i<7;i++){
      s = this.cols[i].style;
      s.position = "absolute";
      s.top      = "-1px";
      s.left     = ww * i + "px";
      if(i==6)ww = w - (ww * 6) + 1; // grow to fit width
      s.width    = ww + "px";
      for(j=0;j<7;j++){
        s = this.cols[i].childNodes[j].style;
        if(j==0)
          s.display = this.doShowDays ?"":"none";
        else{           
          if(j == 6)//dump([h,h - (hh*5) + "px", hh, hh*6])
            s.height = (h - (hh*5)) + "px"; // grow to fit
          else
            s.height = hh + "px";
          s.lineHeight = s.height;
        }
      }
    }
  }finally{
    s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.calendar._onchange = function(){if(this.onchange)this.onchange()};
//------------------------------------------------------------------------------
domapi.comps.calendar._getValue = function(){return sysutils.formatDate(this.value, this.mask)};
//------------------------------------------------------------------------------
domapi.comps.calendar._setValue = function(D){
  this.setDate(sysutils.formatDate(D, this.mask), "D");
  return true;
};
//------------------------------------------------------------------------------
domapi.comps.calendar.setMask = function(m){
  this.mask = m;
  this.setValue(this.value);
};
//------------------------------------------------------------------------------
domapi.comps.calendar._setEnabled = function(){
  this.cbMonths.disabled = !this.enabled;
  this.edtYears.disabled = !this.enabled;
};
//------------------------------------------------------------------------------
domapi.comps.calendar.render = function(){
  var firstWeekDay = parseInt(domapi.getString("STARTOFWEEK"));
  var today = sysutils.now();
  today.m   = today.getMonth();
  today.d   = today.getDate();
  today.y   = today.getFullYear();
  this._holidayCells = [];
  var startday  = sysutils.getStartDay(   this.m, this.y);
  var numberday = sysutils.getMonthLength(this.m, this.y);
  var holidays  = [];
  if(this.doShowHolidays){
    if(this.calculateHolidays)
      holidays = this.calculateHolidays(this.m, this.y);
    else
      holidays = domapi.lang.calculateHolidays(this.m, this.y);
    if(this.ongetholidays)
      holidays = holidays.concat(this.ongetholidays(this.m,this.y));
  }
  startday -= firstWeekDay;
  var a,b,i;
  var c = this._body;
  try{
    for(a=1;a<7;a++){
      for(b=0;b<7;b++){
        t=this.cols[b].childNodes[a];if(!t)continue;
        //domapi.disallowSelect(t);
        tempint = ((a-1)*7+b+1);
        temp = tempint - startday;
        if((this.doShowToday) && (temp==today.d) && (this.m==today.m) && (this.y==today.y)){
          t.title     = domapi.getString("TODAYSTR");
          t.className = "DA_CALENDAR_TODAY";
        }else{
          t.title     = "";
          t.className = "DA_CALENDAR_NORM";
        }
        if(this.doShowHolidays){
          for(i=0;i<holidays.length;i++)
            if(holidays[i][0] == temp){
              t.title = holidays[i][1];
              t.className = "DA_CALENDAR_HOLIDAY";
              t.isHoliday = true;
              this._holidayCells.push(t);
            }
        }
        if(temp == this.d)t.className = "DA_CALENDAR_SEL";
        if((tempint>startday) && (temp<(numberday+1)))
          t.innerHTML = temp;
        else{
          t.innerHTML = "&nbsp;";
          t.className = "DA_CALENDAR_EMPTY";
        }
      }
    }
  }finally{
    c = null; t = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.calendar._cellToPoint = function(c){
  if(!c)return [0,0];
  var x = domapi.getNodeIndex(c);
  var y = domapi.getNodeIndex(c.parentNode);
  return [x,y];
};
//------------------------------------------------------------------------------
domapi.comps.calendar._pointToCell = function(p){
  var x = p[0]; var y = p[1];
  if((x>6 || y>6) || (x<0 || y<0))return;
  return this.rows[y].cells[x];
};
//------------------------------------------------------------------------------
domapi.comps.calendar._dayToCell = function(d){
  // assumes you mean in the selected month and year
  var startday = sysutils.getStartDay(this.m,this.y);
  var dayOfWeek = new Date(this.y, this.m, d).getDay();
  dayOfWeek -= parseInt(domapi.getString("STARTOFWEEK"));  
  var weekOfMonth = sysutils.getWeekOfMonth(this.m, d, this.y);
  if(dayOfWeek<0){
    dayOfWeek += 7;
    weekOfMonth--;
  }
  return this.cols[dayOfWeek].childNodes[weekOfMonth];
};
//------------------------------------------------------------------------------
domapi.comps.calendar._colorCell = function(e,c){
  if(e)e.className = c;
};
//------------------------------------------------------------------------------
domapi.comps.calendar._clearSelection = function(){
  for(var i=0;i<this.selection.length;i++)
    this._colorCell(this._dayToCell(this.selection[i]), "DA_CALENDAR_NORM");
  this.selection = [];  
};
//------------------------------------------------------------------------------
domapi.comps.calendar.getMonth = function() {return this.m};
domapi.comps.calendar.getDay   = function() {return this.d};
domapi.comps.calendar.getYear  = function() {return this.y};
//------------------------------------------------------------------------------
domapi.comps.calendar.setMonth = function(m,preserve,range){this.setDate(sysutils.formatDate(new Date(this.y, m, this.d), this.mask), "M")};
domapi.comps.calendar.setDay   = function(d,preserve,range){this.setDate(sysutils.formatDate(new Date(this.y, this.m, d), this.mask), "D", preserve, range)};
domapi.comps.calendar.setYear  = function(y,preserve,range){this.setDate(sysutils.formatDate(new Date(y, this.m, this.d), this.mask), "Y")};
//------------------------------------------------------------------------------
domapi.comps.calendar.setMonthBy = function(moveby){
  var m = this.m + moveby;
  if(m>11){m = 0;  this.setYear(this.y+1,1)}
  if(m<0 ){m = 11; this.setYear(this.y-1,1)}
  this.setMonth(m,1);
};
//------------------------------------------------------------------------------
domapi.comps.calendar.setYearBy = function(moveby){this.setYear(this.y + moveby,1)};
//------------------------------------------------------------------------------
domapi.comps.calendar.setDate = function(D,kk,preserve,range){
  if(kk == null || sysutils.trim(kk) == "")return false;
  if(typeof D == "string")
    D = sysutils.isDate(D, this.mask);
  if(!D)return false;
  D.m = D.getMonth();
  D.d = D.getDate();
  D.y = D.getFullYear();
  var i,j,k;
  var s = domapi.theme.skin;
  try{
    var monthChanged = (this.m != D.m) || (this.y != D.y);
  
    if(!preserve || monthChanged)this._clearSelection();
  
    if(preserve){
      if(range){
        j = D.d; k = this.d;
        if(k < j){
          k = D.d; j = this.d;
        }
      }else{
        j = D.d; k = D.d;
      }
      for(i=j;i<=k;i++){
        this.selection.deleteValue(i); // to avoid doubles
        this.selection.push(i);
      }
    }else this.selection.push(D.d);
    
    
    var today    = sysutils.now();
    today.m      = today.getMonth();
    today.d      = today.getDate();
    today.y      = today.getFullYear();
  
    //this._colorCell(this.todayCell   ,"DA_CALENDAR_NORM");
    this._colorCell(this.selectedCell,"DA_CALENDAR_NORM");
    for(i=0;i<this._holidayCells.length;i++)
      this._colorCell(this._holidayCells[i], "DA_CALENDAR_HOLIDAY");
    for(i=0;i<this.selection.length;i++)
      this._colorCell(this._dayToCell(this.selection[i]), "DA_CALENDAR_SEL");
  
    if((D.m == today.m) && (D.y == today.y))
      this.todayCell = this._dayToCell(today.d);
    else
      this.todayCell = null;
  
    this.value = D;
    this.m = D.m;
    this.d = D.d;
    this.y = D.y;
    this.cbMonths.selectedIndex = this.m;
    this.edtYears.value         = this.y;
  
    this.selectedCell = this._dayToCell(this.d);
    this._colorCell(this.todayCell   ,"DA_CALENDAR_TODAY");
    this._colorCell(this.selectedCell,"DA_CALENDAR_SEL");
    //--------------
  //  this.setValue(sysutils.formatDate(this.value,this.mask));
    //--------------
    this.titlebar.innerHTML =
      domapi.getString("MONTHS")[this.m] + " "  +
      sysutils.dayOfMonthStr(  this.d) + ", " +
      this.y;
    this.titlebar2.getElementsByTagName("TD")[1].innerHTML =
      domapi.getString("SHORTMONTHS")[this.m] + " " + 
      this.y;
    if(monthChanged)this.render();
    kk = domapi.rVal(kk,"I");
    switch(kk){
      case "I" :
        break;
      case "Y" :
        if(this.onyearchange)this.onyearchange(this.y);
        break;
      case "M" :
        if(this.onmonthchange)this.onmonthchange(this.m);
        break;
      case "D" :
        if(this.ondaychange)this.ondaychange(this.d);
        break;
    }
    this.selection.sort(domapi.arraySortCompare_Integer);
    this._onchange();
    return true;
  }finally{
    s = null;
  }
};
//------------------------------------------------------------------------------
domapi.comps.calendar._ondafocus = function(){try{this.cbMonths.focus()}catch(E){}};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// private members

// ugly, but it's much faster then what you may be thinking
domapi._private.calendar.bodyHTML =
  '<div class="DA_CALENDAR_BODY">';    
domapi.temp =
  '<div class="DA_CALENDAR_COL">' +
    '<div class="DA_CALENDAR_HEADER"></div>' +
    '<div>.</div>' +
    '<div>.</div>' +
    '<div>.</div>' +
    '<div>.</div>' +
    '<div>.</div>' +
    '<div>.</div>' +
  '</div>';
for(_i=0;_i<7;_i++)
  domapi._private.calendar.bodyHTML += domapi.temp;
domapi._private.calendar.bodyHTML += '</div>';
//------------------------------------------------------------------------------
domapi._private.calendar.domouseover = function(E){
  var e = domapi.findTarget(E,"DIV");
  try{
    if(!e || !sysutils.isInteger(e.innerHTML))return;
    var p = domapi.findTarget(E,"CALENDAR");
    if(!p.doRollover || !p.enabled ||
      (e == p.todayCell && p.doShowToday) || e == p.selectedCell || e.className == "DA_CALENDAR_SEL" ||
      (p.doShowHolidays   && e.isHoliday))return;
    e.className = "DA_CALENDAR_OVER";
  }finally{
    e = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.calendar.domouseout = function(E){
  var e = domapi.findTarget(E,"DIV");
  try{
    if(!e || !sysutils.isInteger(e.innerHTML))return;
    var p = domapi.findTarget(E,"CALENDAR");
    if(!p.doRollover || !p.enabled ||
      (e == p.todayCell && p.doShowToday) || e == p.selectedCell || e.className == "DA_CALENDAR_SEL" ||
      (p.doShowHolidays   && e.isHoliday))return;
    e.className = "DA_CALENDAR_NORM";
  }finally{
    e = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.calendar.docbclick = function(E){
  domapi.preventBubble(E);
  return false;
};
//------------------------------------------------------------------------------
domapi._private.calendar.doclick = function(E){
  var preserve = E.shiftKey || E.ctrlKey;
  var range    = E.shiftKey;
  var e   = domapi.findTarget(E,"DIV");
  try{
    if(!e || !sysutils.isInteger(e.innerHTML))return;
    var p   = domapi.findTarget(E,"CALENDAR");
    if(!p.doMultiSelect){
      if(preserve){
        if(domapi.isGecko)E.preventDefault();
        return false;
      }
      preserve = false; range = false;    
    }  
    if(!p.enabled){
      if(domapi.isGecko)E.preventDefault();
      return false;
    }
    var day = parseInt(e.innerHTML);
    if(E.ctrlKey && e.className == "DA_CALENDAR_SEL" && p.doMultiSelect && p.selection.length > 1){
      // ctrl-clicked a selected day and at least one other day is selected as well
      
      p.selection.deleteValue(day);
      // if that was the current value, set it to another (highest) day
      if(p.d == day)
        p.setDay(p.selection[p.selection.length-1], true, false);
      else 
        p.setDay(p.d, true, false); // force update of selection
      e.className = "DA_CALENDAR_NORM";  // deselect clicked day
      if(domapi.isGecko)E.preventDefault();
      return false;
    }
    if(!preserve)p._clearSelection();
    if(e.className == "DA_CALENDAR_SEL")return;
    p.setDay(day, preserve, range);
    if(domapi.isGecko)E.preventDefault();
    return false;
  }finally{
    e = null; p = null;
  }
};
//------------------------------------------------------------------------------
domapi._private.calendar.docbmonthchange = function(E){
  var t = domapi.isIE?domapi.findTarget(E,"SELECT"):this;
  var p = domapi.findParent(t,"CALENDAR");
  try{
    p.setMonth(t.selectedIndex);
  }finally{t = null; p = null}
};
//------------------------------------------------------------------------------
domapi._private.calendar.doedtyearchange = function(E){
  var t = domapi.isIE?domapi.findTarget(E,"INPUT"):this;
  var p = domapi.findParent(t,"CALENDAR");
  try{
    var y = domapi.rInt(t.value);
    if((y < 1972) || (String(y).length > 4))return;
    p.setYear(y);
  }finally{
    t = null; p = null;
  }
};
//------------------------------------------------------------------------------