//----------------------------------------------------------------------------//
// Page implementation file
//----------------------------------------------------------------------------//
var g_bmccfg_resp;
var g_pmcpfile_resp;


//-------------------------------------//
// ONLOAD
//-------------------------------------//

onload=function()
	{
	
	pageform = processPageLoad();	// Must be present for all implementation files
	}

//-------------------------------------//
// Implementation Functions
//-------------------------------------//

function SelectBMC()
{
	
	//enable external address field
	pageform.m_elm7.disabled = false;
	pageform.m_elm8.disabled = false;
	

	//disable the checkboxes that say Upload new File	
	pageform.m_elm11.checkbox().disabled = true;
	pageform.m_elm12.checkbox().disabled = true;
	
	//disable file upload fields themselves
	pageform.m_elm3.disabled = true;
	pageform.m_elm5.disabled = true;
}


function SelectNoBMC()
{
	var spbin_absent_msg = "<b>No previously uploaded PMCP monitoring file</b>";
	var sdrdat_absent_msg = "<b>No previously uploaded Sensor Definition File</b>";;
	
	//disable the BMC address field
	pageform.m_elm7.disabled = true;
	pageform.m_elm8.disabled = true;
	
	if(g_pmcpfile_resp.SPBIN_VALID != 0)
	{
		alert("There seems to be an invalid PMCP monitoring file on the card. Please check or upload a valid file");
		spbin_absent_msg =   "<b> Invalid PMCP file on card</b>";
		g_pmcpfile_resp.SPBIN_PRESENT = 0;
		
	}
	if(g_pmcpfile_resp.SDRDAT_VALID != 0)
	{
		alert("There seems to be an invalid Sensor Definition file on the card. Please check or upload a valid file");
		sdrdat_absent_msg = "<b> Invalid Sensor Definition file on card";
		g_pmcpfile_resp.SDRDAT_PRESENT = 0;
	
	}
	
	
	//allow checkboxes that say Upload New File  based on state
	if(g_pmcpfile_resp.SPBIN_PRESENT == 1)
	{
		
		pageform.m_elm10.innerHTML = "<b>A PMCP monitoring file already exists on the card</b>";
		
		//you also have to check the checkbox in order to enable the file upload field
		pageform.m_elm11.checkbox().disabled = false;
		pageform.m_elm11.checkbox().checked = false;
		pageform.m_elm3.disabled = true;
	}
	else
	{
		
		pageform.m_elm10.innerHTML = spbin_absent_msg;
		
		
		pageform.m_elm11.checkbox().checked = true; //You have to upload a new file
		pageform.m_elm11.checkbox().disabled = true;
		pageform.m_elm3.disabled = false;
		
		
	}
	
	

	if(g_pmcpfile_resp.SDRDAT_PRESENT == 1)	
	{
		pageform.m_elm9.innerHTML = "<b>A SDR definition file already exists on the card</b>";

		//you also have to check the checkbox in order to enable the file upload field
		pageform.m_elm12.checkbox().disabled = false;
		pageform.m_elm12.checkbox().checked = false;
		pageform.m_elm5.disabled = true;
	}
	else
	{
		pageform.m_elm9.innerHTML = sdrdat_absent_msg;
		
		pageform.m_elm12.checkbox().checked = true; //You have to upload a new file
		pageform.m_elm12.checkbox().disabled = true;
		pageform.m_elm5.disabled = false;
	}
	
}

function SPBIN_NewFile()
{
	if(this.checked) 
		pageform.m_elm5.disabled = false;
	else 
	 	pageform.m_elm5.disabled = true;
}

function SDRDAT_NewFile()
{
	if(this.checked) 
		pageform.m_elm3.disabled = false; 
	else 
		pageform.m_elm3.disabled = true;
}


function ProcessPMCPFileStat()
{
        
	showWait(false);
	g_pmcpfile_resp =    WEBVAR_JSONVAR_PMCP_FILE_STATUS.WEBVAR_STRUCTNAME_PMCP_FILE_STATUS[0];
	
	
	
	//we have all the data we want here golbally available. WE act on it now.
	
	if(g_bmccfg_resp.PRESENT == 0)
	{
		//turn on Non BMC radio
		pageform.m_elm1.radio(0).checked = true;
		SelectNoBMC();
		
	}
	else
	{
		//turn on bmc radio
		pageform.m_elm1.radio(1).checked = true;
		SelectBMC();
	}
	
	
	return;
}



function ProcessExtBMCCfg()
{
		
	
	g_bmccfg_resp = WEBVAR_JSONVAR_EXTERNAL_BMC_CONFIG.WEBVAR_STRUCTNAME_EXTERNAL_BMC_CONFIG[0];
	
	xmit.get({url:"getpmcpfilestat.asp",onrcv:ProcessPMCPFileStat, status:''});

}


function SendConfig()
{
	//teo things have to be done here
	//one is to actually send external BMC or no external BMC
	//the other is t actually upload files
	//try to upload file here man
	var form = pageform.m_elm3.parentNode;
	
	
	
	if(form.tagName=='FORM')
	{
		showWait(true);
		//UploadfileNoDefChk(form,"/iPages/i_fwverify.asp");
		
		

		form.action = "";
		//form.action = myfunc;
    		form.submit();
		
		//WaitForSPUpload();
	}
	
}


function WaitResponse()
{
	alert("ok ok ");	
}

function WaitTm()
{
	alert("machi machi");
}
                                                   

function WaitForSPUpload()
{
	
	//alert("in wait for sp upload");
	setTimeout(xmit.get({url:"getpmcpfilestat.asp",onrcv:WaitResponse, status:'',tmout:5,ontimeout:WaitTm}));
}





// Required function, called once all support files are loaded
function doInit()
	{

	//-------------------------------------//
	// Set aliases
	//-------------------------------------//
	
	//-------------------------------------//
	// Set tab order
	//-------------------------------------//

	//-------------------------------------//
	// Set handlers                            ProcessPMCPFileStat
	//-------------------------------------//
	pageform.m_elm1.radio(0).onclick = SelectNoBMC;
	pageform.m_elm1.radio(1).onclick = SelectBMC;	
	pageform.m_elm12.checkbox().onclick = SPBIN_NewFile;
	pageform.m_elm11.checkbox().onclick = SDRDAT_NewFile;
	pageform.m_elm6.onclick = SendConfig;

	//-------------------------------------//
	// Controls init
	//-------------------------------------//
	//read current monitoring mode
	showWait(true);
	xmit.get({url:"getextbmccfg.asp",onrcv:ProcessExtBMCCfg, status:''});

	//-------------------------------------//
	// Code init
	//-------------------------------------//
	}
	
	
