var isIE = ((navigator.appName.indexOf('Microsoft')>=0)?true:false);

function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_listLang',
	 			'_btnApply']);
	 			
	 
	 btnApply.onclick = butApply_onclick;
	 
	 listLang.style.textAlign = 'center';
	 
	 optInd=0;
	 
	 for(var avLang in eLang.title_strings)
	 {
	 	listLang.add(new Option(eLang.getString('title', avLang)+" ("+avLang+")", avLang), isIE?optInd++:null);
	 }
	 
	 listLang.onclick = checkLang;
	 
	 for(i=0; i<listLang.options.length; i++)
	 {
	 	if(top.gLangSetting==listLang.options[i].value)
	 	{
	 		listLang.options[i].selected = true;
	 		btnApply.disabled = true;
	 		break;
	 	}
	 }
}

function checkLang()
{
	if(listLang.options[listLang.options.selectedIndex].value==top.gLangSetting)
	{
		btnApply.disabled = true;
	}else
	{
		btnApply.disabled = false;
	}
}

function butApply_onclick(evt)
{
	if (!btnApply.disabled)
	{

		var curLang=listLang.options[listLang.options.selectedIndex].value;
		
		top.document.cookie = "lang="+curLang+"; expires=Wed, 1 Dec 2027 20:47:11 UTC; path=/";
		parent.location.reload();
		/*
		var url = parent.location.href.split('?')[0];
		url += '?lang='+lang;
		if (confirm(eLang.getString('common',"STR_LANGUAGES_1")))
			parent.location.href = url;
		*/
	}
}
