if(!domapi.isIE){
  throw new Error(
    "You've loaded the domapix unit in an unsupported browser.\n\n"+
    "Only IE on Windows can use this ActiveX control."
  );
}
document.writeln('<OBJECT ID="domapix" CLASSID="CLSID:C9BFEEA7-5118-4BCB-A04C-D58BCD8E9D35"><\/OBJECT>');