function doInit() {
	 // TODO: add page initialization code
	 exposeElms(['_defCert',
	 			'_defPrivKey',
	 			'_sslFileBrowse',
	 			'_uploadBtn',
	 			'_upldType']);
	 			
	 
		CheckRole();
		var status = eExt.parseURLvars ('status');
		if (status == 'uploadcomplete')
		{
			xmit.get({url:'/rpc/validatesslcert.asp', onrcv:ValidateSSLCertificate, status:''});
			return;
		}
	
		var key = eExt.parseURLvars('name');
		if(key=='privkeyupload')
		{
			sslFileBrowse.setAttribute('NAME', '/etc/actualprivkey.pem?16384');
			sslFileBrowse.name = "/etc/actualprivkey.pem?16384";
			upldType.innerHTML = "New Private Key";

			uploadBtn.onclick=validate; 
			
		}
		else
		{
			sslFileBrowse.setAttribute('NAME', '/etc/actualcert.pem?16384');
			sslFileBrowse.name = "/etc/actualcert.pem?16384";
			upldType.innerHTML = "New SSL Certificate";

			uploadBtn.onclick=onUpload; 
		}
		
		sslFileBrowse.focus();
				
		xmit.get({url:'/rpc/getsslcertstatus.asp', onrcv:onRcvStatus, status:''});
}

var certificate_status = eLang.getString('common','STR_APP_STR_270');
var certificate_info = eLang.getString('common','STR_APP_STR_271');
var privatekey_status = eLang.getString('common','STR_APP_STR_272');
var privatekey_info = eLang.getString('common','STR_APP_STR_271');
var certexists = false;



/***********************Role Checking functions*********************/
function CheckRole()
{
	xmit.get({url:'/rpc/getrole.asp', onrcv:OnCheckRole, status:''});
}

function OnCheckRole()
{
	if(WEBVAR_JSONVAR_GET_ROLE.WEBVAR_STRUCTNAME_GET_ROLE[0]['CURPRIV'] != 4)
	{
		alert(eLang.getString('common','STR_APP_STR_267'));
		uploadBtn.disabled = true;
		
	}
}



/***********************Role Checking functions*********************/

/*
 * function endsWith
 * Checks whether the string 'str' ends with the string 'lookfor'
 */

function endsWith(str, lookfor)
{
        var strlen = str.length;
        var lookforlen = lookfor.length;
                                                                                                                             
        var lookforptr = lookforlen;
        while( lookforptr > 0 )
        {
                if( str.charAt(strlen-lookforptr) != lookfor.charAt(lookforlen-lookforptr) )
                        return false;
                lookforptr--;
        }
        return true;
}

function convertToLocale(dateString)
{
	var CardDate = new Date(dateString + " GMT");

	return ( CardDate.toLocaleString() );

}

function validate()
{
	var fprivatekeypath = new String(sslFileBrowse.value);
	if(fprivatekeypath.length == 0)
	{
		alert(eLang.getString('common','STR_APP_STR_299'));
		sslFileBrowse.focus();
		return;
	}
	else
	{
		/*	check file name	*/
		if( !endsWith(fprivatekeypath, ".pem") )
		{
			alert(eLang.getString('common','STR_APP_STR_300'));
			sslFileBrowse.focus();
			return;
		}
	}

	uploadBtn.disabled = true;
	//eSys.elm('message').value = 'Uploading ..Please wait';

	//var form = sslFileBrowse.parentNode ;
	var form = document.forms[0];
/*			
	if(form.tagName=='FORM'){
		xmit.get({url:'validatesslcert.asp', onrcv:ValidateSSLCertificate, status:''});
		pageform.m_sslPrivateValue.innerText = "";
	}
*/
	if (form.tagName=='FORM')
	{
		form.action =document.location+'&status=uploadcomplete';
		form.submit();
	}
	
}




function ValidateSSLCertificate (arg)
{
	var certValid = 0;
	var privkeyValid = 0;

	if(WEBVAR_JSONVAR_VALIDATESSLCERT.HAPI_STATUS == 0)
	{
                certValid=WEBVAR_JSONVAR_VALIDATESSLCERT.WEBVAR_STRUCTNAME_VALIDATESSLCERT[0]['CERT_VALID'];
                                                                                                                                                            
                privkeyValid=WEBVAR_JSONVAR_VALIDATESSLCERT.WEBVAR_STRUCTNAME_VALIDATESSLCERT[0]['PRIVKEY_VALID'];
                                                                                                                                                            
                if(privkeyValid == 2)
                {

			alert(eLang.getString('common','STR_APP_STR_301'));
			location.href = "upload_ssl_certificate.html";
			return;
                }

		if( certValid && privkeyValid )
		{
//			pageform.m_sslDefaultValue.innerText = "SSL Certificate and Private Key successfully uploaded.";
			
			xmit.get({url:'/rpc/getsslcertstatus.asp', onrcv:onRcvStatus, status:''});
			var rebootoption = confirm(eLang.getString('common','STR_APP_STR_302'));
			if(rebootoption)
			{
				location.href = "/UI_resetonload.html";
				//rebootCard();
			}
		}
		else
		{
//			pageform.m_sslDefaultValue.innerText = "SSL certificate validation failed.Please try to upload the certificate and key again."
			alert(eLang.getString('common','STR_APP_STR_303'));			
		}
	}
	else
	{
//		pageform.m_sslDefaultValue.innerText = "SSL certificate validation failed.Please try to upload the certificate and key again."
		alert(eLang.getString('common','STR_APP_STR_303'));
	}
	location.href = "upload_ssl_certificate.html";
	
}



function rebootCard()
{
	location.href = "/UI_resetonload.html";
}


onreboot = function()
{
	//shouldnt come here at all
}


function onUpload()
{
        var fcertpath = new String(sslFileBrowse.value);
        if(fcertpath.length == 0)
        {
                alert(eLang.getString('common','STR_APP_STR_305'));
               sslFileBrowse.focus();
                return;
        }
        else
        {
                /*      check file name */
                if( !endsWith(fcertpath, ".pem") )
                {
                        alert(eLang.getString('common','STR_APP_STR_306'));
                       sslFileBrowse.focus();
                        return;
                }
        }
	if(certexists)
	{
		var conf = confirm(eLang.getString('common','STR_APP_STR_307'));
		if(conf == false)
			return;
	}
	
	uploadBtn.disabled = true;
	//eSys.elm('message').value = 'Uploading ..Please wait';
	
	//var form = sslFileBrowse.parentNode ;
	var form = document.forms[0];
			
	if(form.tagName=='FORM'){
	
		form.action =document.location+'?name=privkeyupload';
		form.submit();
	}

}







function formatstr(formstr)
{
	var cstr = new String(formstr);

	cstr = cstr.replace(/\r/g, "");
	cstr = cstr.replace(/\n/g, " "); /* can also be replaced with <BR>*/
	cstr = cstr.replace(/"/g, '\\'+'"');
	cstr = cstr.replace(/'/g, "\\"+"'");

	return cstr;
}




function onRcvStatus (arg)
{
	if(WEBVAR_JSONVAR_SSLCERTSTATUS.HAPI_STATUS == 0)
	{

		if(WEBVAR_JSONVAR_SSLCERTSTATUS.WEBVAR_STRUCTNAME_SSLCERTSTATUS[0]['CERT_EXISTS'] != 0)
		{
			certexists = true;
		}

		if(WEBVAR_JSONVAR_SSLCERTSTATUS.WEBVAR_STRUCTNAME_SSLCERTSTATUS[0]['CERT_INFO'] != "Not Available")
		{
			certificate_status = eLang.getString('common','STR_APP_STR_410');
			certificate_info = new String(WEBVAR_JSONVAR_SSLCERTSTATUS.WEBVAR_STRUCTNAME_SSLCERTSTATUS[0]['CERT_INFO']);
			certificate_info = convertToLocale(certificate_info);
		}


		if(WEBVAR_JSONVAR_SSLCERTSTATUS.WEBVAR_STRUCTNAME_SSLCERTSTATUS[0]['PRIVKEY_INFO'] != "Not Available")
		{
			privatekey_status = eLang.getString('common','STR_APP_STR_410');
			privatekey_info = new String(WEBVAR_JSONVAR_SSLCERTSTATUS.WEBVAR_STRUCTNAME_SSLCERTSTATUS[0]['PRIVKEY_INFO']);
			privatekey_info = convertToLocale(privatekey_info);
		}

	}
	defCert.innerHTML = certificate_info; //certificate_status + ' ' + certificate_info;
	defPrivKey.innerHTML = privatekey_info; //privatekey_status + ' ' + privatekey_info;
}



