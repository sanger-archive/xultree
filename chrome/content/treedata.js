/*-------------------------------------------------------------------
 *  Author: Tony Cox (avc@sanger.ac.uk)
 *  Copyright (c) 2006: Genome Research Ltd.
 * This is free software; you can redistribute it and/or
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
 

function treeItem () {	
	this.id = 0;
	this.isVisible = false;
	this.isContainer = false;
	this.isContainerEmpty = true;
	this.isContainerOpen = false;
	this.level = 0;
	this.datakey = null,
	this.datavalue = null;
	this.datavalueLinkable = false;
}

function nsTreeView(json) {

	// To understand the following line please look at
	// http://xulblog.de/xul/archives/27-wrappedJSObject.html
	// It gives access to underlying properties of the JS object
    this.wrappedJSObject = this;
	
	this._json = json;
	this._treeData = [];
	this._treeCache = {};
	this._level = 0;
	this._count = 0;
	this.treebox = null;
	this.atomService = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
	for (prop in json){
		this.parse(prop,json[prop]);
  	};
};

nsTreeView.prototype = {
	setTree: 				function(treebox){ this.treebox=treebox; },
	cycleHeader: 			function(col, elem) { return false; },
	getImageSrc: 			function(col, elem) { return ""; },
	isSeparator: 			function(col, elem) { return false; },
	isSorted: 				function(row){ return true; },
	getRowProperties: 		function(row,props){},
	getColumnProperties: 	function(col,props){},
		
	//####################################################################
	getCellProperties: function getColumnProperties(row,col,props){
		var n = this._get_tree_item_by_row(row);
		if (col.id == "value" && !n.isContainer){
			if (n.datavalueLinkable){
    			props.AppendElement(this.atomService.getAtom("link"));
			} else {
				props.AppendElement(this.atomService.getAtom("nolink"));
			}			
		}
		if (n.isContainer && n.isContainerEmpty){
			props.AppendElement(this.atomService.getAtom("empty"));
		}			
	},
	//####################################################################
	get rowCount () {
		var rows = 0;
		for (var i=0;i<this._treeData.length;i++){
			var n = this._treeData[i];
			if (n.isVisible == true){
				//consoleDump("Visible: " + n.datavalue + " ID: " + n.id +  " Type: " + n.type );
				rows++;
			}
		}
		//consoleDump("Visible rowcount: " + rows);
		return(rows);
	},
	
	//####################################################################
	getCellText: function getCellText(row,col){
		var i = this._get_tree_item_by_row(row);
		if(!i){
			consoleDump("cannot fetch cell text for row " + row);
			return("error");
		}
    	if (col.id == "item"){
			return(i.id);
		} else if (col.id == "type"){
			return(i.datakey);
		} else if(col.id == "value") {
			if (i.datavalue){
				if (i.type == "object" || i.type == "array"){
					return("");
				} else {
		   			return(i.datavalue);
				}
			}else {
				return("<empty>");
			}
		}
		return "unknown";
	},   

	//####################################################################
 	getLevel: function getLevel(row) { 
		var n = this._get_tree_item_by_row(row);
		if (!n){
			throw("getLevel failed for row " + row);
		} 
		var v = n.level;
		//consoleDump("getLevel for row " + row + " = " + v);
		return v;
	},  

	isContainer: function isContainer(row) { 
		var n = this._get_tree_item_by_row(row);
		if (!n){
			throw("isContainer failed for row " + row);
		} 
		var c = n.isContainer;
		//consoleDump("isContainer for row " + row + " = " + c);
		return c;
	},

	isContainerEmpty: function isContainerEmpty(row) { 
		var n = this._get_tree_item_by_row(row);
		var e = n.isContainerEmpty;
		//consoleDump("isContainerEmpty for row " + row + " = " + e);
		return e;
	},

	/********************************************************/
	isContainerOpen: function isContainerOpen(row) {
		var n = this._get_tree_item_by_row(row);
		var b = n.isContainerOpen;
		//consoleDump("isContainerOpen for row " + row + " = " + b);
		return b;
	},
	
	/********************************************************/
	getParentIndex: function getParentIndex(row) {
		var node = this._get_tree_item_by_row(row);
		//consoleDump("getParentIndex for row " + row + " [item " + node.id + "]");
		for (var i=row;i>=0;i--){
			var n = this._get_tree_item_by_row(i);
			if(n.isVisible && (n.level == node.level-1)){
				//consoleDump("getParentIndex for row " + row + " = " + i + " [item " + n.id + "]");
				return(i);
			}
		}
		//consoleDump("getParentIndex for row " + row + " = -1");
		return(-1);
	},
	
	/********************************************************/
	hasNextSibling: function hasNextSibling(row, afterIndex) {
		var n = this._get_tree_item_by_row(row);
		for(i=row+1;i<this._treeData.length;i++){
			var next = this._get_tree_item_by_row(i);
			if(next == undefined){
				return false;
			}
			if (next.level > n.level){
				continue;
			} else if (next.level < n.level){
				return(false);
			} else {
				return true;
			}
		}
		return(false);
	},
	
	/********************************************************/
	toggleOpenState: function toggleOpenState(row) {
		//consoleDump("toggleOpenState for row " + row);
		var n = this._get_tree_item_by_row(row);
		if (!n.isContainer){
			return;
		} 
		/****************************************************
		/* close the container
		/****************************************************/
		if (n.isContainerOpen){
			n.isContainerOpen = false;
			var children = 0;
			for(i=n.id+1;i<this._treeData.length;i++){
				var child = this._get_tree_item_by_id(i);
				if(child.level == n.level){
					//consoleDump("Exit at child: " + child.id);
					break;
				}
				if((child.level > n.level) && child.isVisible){
					child.isVisible = false;
					if (child.isContainer){
						child.isContainerOpen = false;
					}
					//consoleDump("Closed item " + child.id + " at level " + child.level);
					children++;
				}
			}
			this.treebox.rowCountChanged(row+1,children*-1);
			//consoleDump("Set row " + row + " to open = " + n.isContainerOpen);
			//consoleDump("Closed " + children + " child rows");
		/****************************************************
		/* open the container
		/****************************************************/
		} else if (!n.isContainerOpen){
			n.isContainerOpen = true;
			var children = 0;
			for(i=n.id+1;i<this._treeData.length;i++){
				var child = this._get_tree_item_by_id(i);
				if ((child.level == n.level) && child.isContainer){
					break;
				}
				if(child.level == (n.level + 1) && !child.isVisible){
					child.isVisible = true;
					//consoleDump("Opened item " + child.id + " at level " + child.level);
					children++;
				} 
			}
			this.treebox.rowCountChanged(row+1,children);
			//consoleDump("Set row " + row + " to open = " + n.isContainerOpen);
			//consoleDump("Opened " + children + " child rows");
		}
		this.treebox.invalidateRow(row);
	},	

	//####################################################################

	_get_tree_item_by_row: function _get_tree_item_by_row(row) {
		var count = 0;
		for (var i=0;i<this._treeData.length;i++){
			if(this._treeData[i].isVisible == true){
				if (count == row){
					return(this._treeData[i]);
				}
				count++;
			}
		}
		//consoleDump("No tree node for row " + row + "!");
		return(null)
	},

	_get_tree_item_by_id: function _get_tree_item_by_id(id) {
		return(this._treeData[this._treeCache[id]]);

		// the code above is a speed optimization that
		// queries a cache that maps node ids to treeData 
		// elements

		//var count = 0;
		//for (var i=0;i<treeData.length;i++){
		//	if(treeData[i].id == id){
		//		return(treeData[i]);
		//	}
		//}
		//consoleDump("No tree node for row " + row + "!");
	},

	_get_visible_tree_row_by_id: function _get_visible_tree_row_by_id(id) {
		var count = 0;
		for (var i=0;i<this._treeData.length;i++){
			if(this._treeData[i].isVisible == true){
				if (this._treeData[i].id == id){
					return(count);
				}
				count++;
			}
		}
		return(null)
	},

	_get_visible_tree_rows: function _get_visible_tree_rows () {
			var rows = 0;
			for (var i=0;i<this._treeData.length;i++){
				var n = this._treeData[i];
				if (n.isVisible == true){
					rows++;
				}
			}
			//consoleDump("Visible tree rows: " + rows);
			return(rows);
	},

	_get_all_tree_rows: function _get_all_tree_rows() {
		var rows = 0;
		for (var i=0;i<this._treeData.length;i++){
			var n = this._treeData[i];
			rows++;
		}
		consoleDump("Total tree rows: " + rows);
		return(rows);
	},

	_get_parent_node: function _get_parent_node(id) {
		var node = this._get_tree_item_by_id(id);
		for (var i=id;i>=0;i--){
			var n = this._get_tree_item_by_id(i);
			if(!n){ return null;}
			if(n.level == node.level-1){
				return(n);
			}
		}
		return(null);
	},
	

	//####################################################################
	parse: function parse(key,val) {
		var verbose = false;
		var spacer = " --";
		for (var i=0;i<=this._level;i++){
			spacer = spacer + "--";
		}
		spacer = spacer + "> ";

		var type = typeof(val);

		if (type == "object"){
			if(val.length){
				type = "array";
			}
			if (verbose){
				consoleDump("[" + this._level + "]" + spacer + "Parsing " + type +": " + key);
			}
			var ti = new treeItem();
			ti.isContainer = true;
			ti.datakey = key;
			ti.datavalue = type + " container";
			ti.id = this._count;
			ti.level = this._level;
			ti.type = type;
			if(this._level == 0){
				ti.isVisible = true;
			}
			this._treeData.push(ti); // save the container item
			this._treeCache[this._count] = this._treeData.length - 1;
			this._count++;

			this._level++;
			var child = [];
			if (val.length){
				ti.type = "array";
				for (var c=0;c<val.length;c++){
					//this.parse(key + " #" + c,val[c]);
					this.parse("[" + c + "]",val[c]);
					ti.isContainerEmpty = false;
				}
			} else {
				for (prop in val){
					this.parse(prop,val[prop]);
					ti.isContainerEmpty = false;
				}
			}
			if (verbose){
				consoleDump("[" + this._level + "]" + spacer + "Returned list from object "  + key);
			}
			this._level--;
		} else {
			if (verbose){
				consoleDump("[" + this._level + "]" + spacer + "Parsing " + type + ": " + key + "=" + val);
			}
			var ti = new treeItem();
			ti.datakey = key;
			ti.datavalue = unescape(val);
			ti.id = this._count;
			ti.level = this._level;
			ti.type = typeof(val);
			if(this._level == 0){
				ti.isVisible = true;
			}
			if(getLink(key)){
				ti.datavalueLinkable = true;
			}
			this._treeData.push(ti);
			this._treeCache[this._count] = this._treeData.length - 1;
			this._count++;
		}
	},
		
	_dump: function _dump() {

		var spacer = "";
		consoleDump(spacer + "****************************************************************");
		consoleDump(spacer + "Dumping array of " + this._treeData.length);

		if (this._treeData.length == 0){
			consoleDump(spacer + "Empty array ");
			return;	
		}

		for (var i=0;i<this._treeData.length;i++){
			var n = this._treeData[i];
			var v;
			n.isVisible == true ? v = "+": v = "-";
			var l = n.level;

			spacer = "";
			for (var j=0;j<=n.level;j++){
				spacer = spacer + "  ";
			}

			if (n.isContainer == false){
				consoleDump("[" + l + v  + "]" + spacer + "  Node: " + n.datakey);
				for (prop in n){
					//consoleDump(spacer + "     Prop: " + prop + " = " + n[prop]);
				}
			} else if (n.isContainer == true){
				consoleDump("[" + l + v + "]" + spacer + "Container: " + n.datakey);
				for (prop in n){
					//consoleDump(spacer + "      Prop: " +prop + " = " + n[prop]);
				}
			} else {
				consoleDump("Error: item with no isContainer");
			}
		}

	}

};

