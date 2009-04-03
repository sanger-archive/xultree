/*-------------------------------------------------------------------
 *  Author: Tony Cox (avc@sanger.ac.uk)
 *  Copyright (c) 2006: Genome Research Ltd.
 * Xulnpg is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 * or see the on-line version at http://www.gnu.org/copyleft/gpl.txt
 *-------------------------------------------------------------------
 * This file is part of the Xulnpg package and was written by
 * 	Tony Cox (Sanger Institute, UK) avc@sanger.ac.uk
 *
 * Description: Provides interface for monitoring data in Illumina pipeline
 *              
 * Exported functions: None
 * HISTORY:
 *-------------------------------------------------------------------
 */
 
	/**
	 * Purpose:
	 *   What are we running on?
	 */	
	function getAppInfo ()
	{
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
		var tmp = {};
		tmp.vendor 		= appInfo.vendor;
		tmp.name 		= appInfo.name;
		tmp.id 			= appInfo.ID;
		tmp.version 	= appInfo.version;
		tmp.build 		= appInfo.appBuildID;
		tmp.platformVersion = appInfo.platformVersion;
		tmp.platformBuild = appInfo.platformBuild;
	}
		
	/**
	 * Purpose:
	 *   Clean or forced application exit
	 */	
	function xulExit (aForceQuit)
	{
	  var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].getService(Components.interfaces.nsIAppStartup);
	
	  // eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
	  // process if there is unsaved data. eForceQuit will quit no matter what.
	  var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
	                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
	  appStartup.quit(quitSeverity);
	}


	/**
	 * Purpose:
	 *   Utility hex->dec/dec->hex conversion routines
	 */	
	function d2h(d) {return d.toString(16);}
	function h2d(h) {return parseInt(h,16);}
	

	/**
	 * Purpose:
	 *   Generic sort for trees
	 */	
	function alphaNumSort(m,n){
        try{
            var cnt= 0, ax, tem;
            var a= m.toLowerCase();
            var b= n.tpLowerCase();
            if(a== b) return 0;
            var x=/^(\.)?\d/;

            var L= Math.min(a.length,b.length)+ 1;
            while(cnt< L && a.charAt(cnt)=== b.charAt(cnt) &&
            x.test(b.substring(cnt))== false && x.test(a.substring(cnt))== false) cnt++;
            a= a.substring(cnt);
            b= b.substring(cnt);

                if(x.test(a) || x.test(b)){
                    if(x.test(a)== false)return (a)? 1: -1;
                    else if(x.test(b)== false)return (b)? -1: 1;
                    else{
                            tem= parseFloat(a)-parseFloat(b);
                            if(tem!= 0) return tem;
                            else tem= a.search(/[^\.\d]/);
                            if(tem== -1) tem= b.search(/[^\.\d]/);
                            a= a.substring(tem);
                            b= b.substring(tem);
                    }
                }
                if(a== b) return 0;
            else return (a >b)? 1: -1;
    	}
    	catch(er){
    	        return 0;
    	}
	}

	
	
	
	//===============================================================================================
	// Opens a URI in an external web browserS
	//===============================================================================================
	function openBrowserUrl(url) {
		// first construct an nsIURI object using the ioservice
		var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		var uriToOpen = ioservice.newURI(url, null, null);
		var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
		if (extps.externalProtocolHandlerExists("http")) {
			// Handler for http:// URLs exists
			// now, open it!
			try{
				extps.loadURI(uriToOpen, null);
			} catch(e){
				consoleDump("Could not open URL (" + uriToOpen + ") - " + e.toString);
				return;
			}
		} else {
            getPromptService().alert(null,"URL Open","You do not appear to have a default application registered for the HTTP protocol. Cannot open URL");
		}
	}

	//===============================================================================================
	// Provided access to user-defined UI promps
	//===============================================================================================
	function getPromptService() {
		try {
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        			.getService(Components.interfaces.nsIPromptService);
			return(prompts);
		} catch (e) {
			alert("Cannot create an alert!");
		}
		return(null);
	}						
						
	

	function str2date (str_datetime) {
		var re_date = /^(\d+)\-(\d+)\-(\d+)\s+(\d+)\:(\d+)\:(\d+)$/;
		if (!re_date.exec(str_datetime))
		return (null);
		var d = new Date();
		d.setMonth(parseInt(RegExp.$2));
		d.setDate(parseInt(RegExp.$3));
		d.setFullYear(parseInt(RegExp.$1));
		d.setHours(parseInt(RegExp.$4));
		d.setMinutes(parseInt(RegExp.$5));
		d.setSeconds(parseInt(RegExp.$6));
		//consoleDump("Time: " + d.toLocaleString());
		return (d);
	}



	/**
	* Parses string argument and returns boolean true if string is "yes", "true" or represents number
	* greater than 0 else returns boolean false.
	*
	* Returns corresponding boolean if argument of boolean or number type.
	* Returns false if argument is null or undefined.
	*
	* @syntax parseBoolean(booleanString)
	* @param booleanString
	* @return Boolean
	*/
	function parseBoolean(s)
	{
		s = s.toString().toLowerCase();
		if (s == "true" || s == "yes" || parseInt(s) > 0) {
			return true;
		}
		return false;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
