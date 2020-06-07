//------------------------------------------------------------------------------
// DomAPI Form Validation
// D. Kadrioski 11/1/2000
// (c) Nebiru Software 2001-2004
//------------------------------------------------------------------------------

domapi.loadUnit("sysutils");

validate = {};

//==============================================================================
// form validation routines ====================================================
//==============================================================================

validate.currency = function(formfield){
  formfield.value=sysutils.trim(formfield.value);
  if(sysutils.isMoney(formfield.value))return true;
  formfield.select();
  formfield.focus();
  alert(domapi.getString("VAL_DOLLAR"));
  return false;
};
//------------------------------------------------------------------------------
validate.state = function(formfield){
  formfield.value=sysutils.trim(formfield.value);
  if(!domapi.isNil(formfield.value) && sysutils.isStateCode(formfield.value)) return true;
  formfield.select();
  formfield.focus();
  alert(domapi.getString("VAL_STATE"));
  return false;
};
//------------------------------------------------------------------------------
validate.string = function(formfield, fieldname){
  formfield.value=sysutils.trim(formfield.value);
  if(!domapi.isNil(formfield.value))return true;
  fieldname=domapi.rVal(fieldname,"value");
  formfield.select();
  formfield.focus();
  alert(domapi.formatGetString("VAL_STRING",[fieldname]));
  return false;
};
//------------------------------------------------------------------------------
validate.stringLen = function(formfield, fieldname, len){
  formfield.value=sysutils.trim(formfield.value);
  if(formfield.value.length>=len)return true;
  fieldname=domapi.rVal(fieldname,"Field");
  formfield.select();
  formfield.focus();
  var p = [fieldname, len,(len!=1?"s":"")];
  alert(domapi.formatGetString("VAL_STRING_LEN",p));
  return false;
};
//------------------------------------------------------------------------------
validate.zip = function(formfield){
  formfield.value=sysutils.trim(formfield.value);
  if(!domapi.isNil(formfield.value)){
    var temp = sysutils.filterNonDigits(formfield.value);
    if((temp.length == 5) || (temp.length == 9))return true;
  }
  formfield.select();
  formfield.focus();
  alert(domapi.getString("VAL_ZIP"));
  return false;
};
//------------------------------------------------------------------------------
validate.integer = function(formfield, fieldname){
  formfield.value=sysutils.trim(formfield.value);
  if(!domapi.isNil(formfield.value) && sysutils.isInteger(formfield.value))return true;
  fieldname=domapi.rVal(fieldname,"integer");
  formfield.select();
  formfield.focus();
  alert(domapi.formatGetString("VAL_NUMBER",[fieldname]));
  return false;
};
//------------------------------------------------------------------------------
validate.number = function(formfield, fieldname){
  formfield.value=sysutils.trim(formfield.value);
  if(sysutils.isFloat(formfield.value))return true;
  fieldname=domapi.rVal(fieldname,"number");
  formfield.select();
  formfield.focus();
  alert(domapi.formatGetString("VAL_NUMBER",[fieldname]));
  return false;
};
//------------------------------------------------------------------------------
validate.date = function(formfield,format){
  formfield.value=sysutils.trim(formfield.value);
  if(sysutils.isDate(formfield.value,format))return true;
  format=domapi.rVal(format,sysutils.defaultDateMask);
  formfield.select();
  formfield.focus();
  alert(domapi.formatGetString("VAL_DATE",[formfield.value,format]));
  return false;
};
//------------------------------------------------------------------------------
