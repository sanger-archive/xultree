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
	 *   request object in json format
	 */	

	function setTreeView(json)
	{
		document.getElementById("testtree").view = new nsTreeView(json);
	}

	function requestJsonUrl()
	{
		var url = document.getElementById("jsonurl").value;
        var json =jsonRequest(url);
		setTreeView(json);
	}

	function expandTree() {
		var treeView = document.getElementById("testtree").treeBoxObject.view;
		for (var i = 0; i < treeView.rowCount; i++) {
			if (treeView.isContainer(i) && !treeView.isContainerOpen(i))
				treeView.toggleOpenState(i);
			}
	}
	function collapseTree() {
		var treeView = document.getElementById("testtree").treeBoxObject.view;
		for (var i = 0; i < treeView.rowCount; i++) {
			if (treeView.isContainer(i) && treeView.isContainerOpen(i))
				treeView.toggleOpenState(i);
			}
	}
	function onTreeSelected(){
		var tree = document.getElementById("testtree");
		var cellIndex = 0;
		var cellText = tree.view.getCellText(tree.currentIndex, tree.columns.getColumnAt(cellIndex));
		alert(cellText);
	}

	function updateFields(evt){
		switch (evt.type){
			case "click":
				if(evt.detail == 1) { // single click
					if(evt.button == 0){ // left mouse button
					} else if (evt.button != 0 || evt.which == 3) { //right mouse button
					}
				} else if (evt.detail == 2) { // double click
					var row = {}, column = {}, part = {};
					var tree = document.getElementById("testtree");
					var boxobject = tree.boxObject;
					boxobject.QueryInterface(Components.interfaces.nsITreeBoxObject);
					boxobject.getCellAt(evt.clientX, evt.clientY, row, column, part);
					if (column.value && typeof column.value != "string"){
						column.value = column.value.id;
					}
					if(column.value	== "value" && part.value == "image"){
						fillLeafNode(row.value);
					}	
				}
				break;
			case "mouseover":
				break;
			case "mouseout":
				break;
			case "mousemove":
				break;
			default:
				consoleDump("Got event: " + evt.type);
		}
	}

	function fillLeafNode(row){
		var tree = document.getElementById("testtree");
		var cellIndex = 0; // types
		var cellType = tree.view.getCellText(tree.currentIndex, tree.columns.getColumnAt(cellIndex));
		var cellIndex = 1; // values
		var cellValue = tree.view.getCellText(tree.currentIndex, tree.columns.getColumnAt(cellIndex));
		var cellIndex = 2; // ID
		var id = tree.view.getCellText(tree.currentIndex, tree.columns.getColumnAt(cellIndex));

		if(linkValues[cellType]){
			var url = linkValues[cellType];
			url = url.replace("VALUE",cellValue);
			var obj =jsonRequest(url);
			getJsonNode(id,obj);
			var json = document.getElementById("testtree").treeBoxObject.view.wrappedJSObject._json;
			document.getElementById("testtree").view = new nsTreeView(json);
			showContainerNode(id);
		}
	}

	function showContainerNode(id){
		var wo = document.getElementById("testtree").treeBoxObject.view.wrappedJSObject;		
		parent = [id];
		var p = wo._get_parent_node(id);
		if(!p){
			return;
		}
		parent.push(p.id);
		while (p.level >= 0){
			p = wo._get_parent_node(p.id);
			if(!p){
				break;
			}
			parent.push(p.id);
		}
		parent = parent.reverse();
		var treeView = document.getElementById("testtree").treeBoxObject.view;
		for(var i=0;i<parent.length;i++){
			var row = wo._get_visible_tree_row_by_id(parent[i]);
			treeView.toggleOpenState(row);
		}
		
	}
	
	
	// This is possibly the most bizarre function I have ever written... 
	function getJsonNode(id,obj){
		var wo = document.getElementById("testtree").treeBoxObject.view.wrappedJSObject;
		var tmp = [];
		tmp.push(wo._get_tree_item_by_id(id).datakey);
		var p = wo._get_parent_node(id);
		if(!p){
			return;
		}
		tmp.push(p.datakey);
		while (p.level != 0){
			p = wo._get_parent_node(p.id);
			tmp.push(p.datakey);
		}
		tmp = tmp.reverse();
		var s = "wo._json";
		for (var i=0;i<tmp.length;i++){
			var field = tmp[i];
			if(field.search(/\[/) == -1){
				s = s + "[\"" + field + "\"]";
			} else {
				s = s + field;
			}
		}
		consoleDump(s);
		eval(s + "=obj");
	}





















