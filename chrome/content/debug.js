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

	function jsDump(str)
	{
	  Components.classes['@mozilla.org/consoleservice;1']
            	.getService(Components.interfaces.nsIConsoleService)
            	.logStringMessage(str + "\n");
	}
	
	function consoleDump(str)
	{
		dump(str + "\n");
	}


	function jsonDump(j)
	{
		dump(j.toJSONPrettyString() + "\n");
	}


	function npgalert(str) 
	{
		alert("Shout: " + str + "\n");
	}


	function objDump(obj)
	{
		var MAX_DUMP_DEPTH = 10;
		var indent = "";
		var name = "objDump";
		var depth = 10;
		
		if (depth > MAX_DUMP_DEPTH) {
    		 return indent + name + ": <Maximum Depth Reached>\n";
		}

		if (typeof obj == "object") {
    		 var child = null;
    		 var output = indent + name + "\n";
    		 indent += "\t";
    		 for (var item in obj)
    		 {
        		   try {
                		  child = obj[item];
        		   } catch (e) {
                		  child = "<Unable to Evaluate>";
        		   }
        		   if (typeof child == "object") {
                		  output += objDump(child);
        		   } else {
                		  output += indent + item + ": " + child + "\n";
        		   }
    		 }
    		 return output;
		} else {
    		 return obj;
		}
	}	
	   

	function basicObjDump(o)
	{
		for (prop in o){
			if (typeof o[prop] == 'object'){
				objDump(o[prop]);
			}
			if (o[prop] != undefined){
				consoleDump(prop + ":" + o[prop]);
			} else {
				consoleDump(prop);
			}
		}
		consoleDump("\n");
	}

	function arrayDump(a)
	{
		for (var i = 0; i < a.length; i++) {
			if (typeof(a[i]) == 'object'){
				if (a[i] instanceof Array) {
					arrayDump(a[i]);
					return;
				} else {
					objDump(a[i]);
					return;
				}
			}
			consoleDump(a[i]);
		}
	} 

	// Required to start the Venkman debugger
	function toOpenWindowByType(inType, uri) {
	  var winopts = "chrome,extrachrome,menubar,resizable,scrollbars,status,toolbar";
	  window.open(uri, "_blank", winopts);
	}
