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
	 *   Add a new row to the link list
	 */	

	function addLink()
	{
		var rows = document.getElementById("linkrows");
				
		var l = document.createElement("textbox");
		l.setAttribute("emptytext", "key");
		var u = document.createElement("textbox");
		u.setAttribute("emptytext", "Link URL");

		var r = document.createElement("row");
		r.appendChild(l);
		r.appendChild(u);

		rows.appendChild(r);
		
	}


	function getLink(key)
	{
		var rows = document.getElementById("linkrows");		
		var rlist = rows.childNodes;
		for(var i=0;i<rlist.length;i++){
			var row = rlist[i];
			var tblist = row.childNodes;
			if(tblist[0].tagName != "textbox"){
				continue;
			}
			if(tblist[0].value == key){
				return(tblist[1].value);
			}
		}
		return(null);
	}













