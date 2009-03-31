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
	 *   Creates a new HTTP request object
	 */	
	function getXmlHttpObject()
	{
        var httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            throw('Giving up - Cannot create an XMLHTTP object');
            return null;
        }
		return(httpRequest);
	}


	/**
	 * Purpose:
	 *   Simple synchronous HTTP request for a JSON object
	 */	
	function jsonRequest(url)
	{
		var http = getXmlHttpObject();
		if(DEBUG){
			consoleDump("HTTP request: " + url);
		}
		var mode = "GET";
    	http.open(mode,url,false);  	// Synchronous request
    	http.setRequestHeader("X-Requested-With","XMLHttpRequest");
    	http.send(null);         			// Blocking until response arrives
		try{
			var obj = jsonToObject(http.responseText);
			return(obj);
		} catch (e){
			consoleDump("Error fetching (async) JSON data for " + url + ": " + e.toString() );
			return(null);
		}
	}
	
	
	/**
	 * Purpose:
	 *   Asynchronous HTTP request with callback for a JSON object
	 */	
    function jsonAsyncRequest(url,callback,ssoToken) {
		var http = getXmlHttpObject();
		var mode = "GET";
		try {
    		http.open(mode,url,true);  	// Synchronous request
		} catch (e){
			consoleDump(e.toString());
		}
		
		if(DEBUG){
			consoleDump("HTTP async request: " + url);
		}
		http.setRequestHeader("Accept","text/plain");
    	http.setRequestHeader("X-Requested-With","XMLHttpRequest");
		if (ssoToken != undefined){
			http.setRequestHeader("Set-Cookie",ssoToken);			// SSO authentication cookie
		}
		http.setRequestHeader("Content-Type","text/plain");
		http.onreadystatechange = function (evt) {
			if(http.readyState == 4){
				setProgressMeterMode("determined");
				setStatusBarAction();
				if(http.status == 200){
					if(DEBUG){
						//consoleDump(http.responseText);
					}
					var obj = jsonToObject(http.responseText)
					callback(obj);
				}
			}
		}
    	http.send(null);         			// async call
    	setProgressMeterMode("undetermined");
		setStatusBarAction("Fetching data...");
	}

	/**
	 * Purpose:
	 *   Convert an JSON encoded string to a JS object
	 */	
    function jsonToObject(json) {
		try{
			var nativeJSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
			//consoleDump("Decode JSON...");
			return(nativeJSON.decode(json));
		} catch(e){
			consoleDump("nsIJSON error (" + e.toString() + ")" );
			try {
				return(evalJson(json));
			} catch (e){
				consoleDump("Error fetching (async) JSON data (" + e.toString() + ")" );
			}
		}
		return null;
	}

    /**
     * Purpose:
     *   Simple and dangerous(!!) conversion of JSON encoded string to a JS object
     *   Used only if native XUL parser fails.
     */
    function evalJson(json) {
		consoleDump("***Dangerous direct eval of JSON***");
		var obj = eval("(" + json + ")");
		return(obj);
	}

