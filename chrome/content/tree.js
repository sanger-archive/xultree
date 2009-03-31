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
	
var treeView = {  
	   childData : {  
	     Solids: ["Silver", "Gold", "Lead"],  
	     Liquids: ["Mercury"],  
	     Gases: ["Helium", "Nitrogen"]  
	   },  
	   
	   visibleData : [  
	     ["Solids", true, false],  
	     ["Liquids", true, false],  
	     ["Gases", true, false]  
	   ],  
	   
	   treeBox: null,  
	   selection: null,  
	   
	   get rowCount()                     { return this.visibleData.length; },  
	   setTree: function(treeBox)         { this.treeBox = treeBox; },  
	   getCellText: function(idx, column) { return this.visibleData[idx][0]; },  
	   isContainer: function(idx)         { return this.visibleData[idx][1]; },  
	   isContainerOpen: function(idx)     { return this.visibleData[idx][2]; },  
	   isContainerEmpty: function(idx)    { return false; },  
	   isSeparator: function(idx)         { return false; },  
	   isSorted: function()               { return false; },  
	   isEditable: function(idx, column)  { return false; },  
	   
	   getParentIndex: function(idx) {  
	     if (this.isContainer(idx)) return -1;  
	     for (var t = idx - 1; t >= 0 ; t--) {  
	       if (this.isContainer(t)) return t;  
	     }  
	   },  
	   getLevel: function(idx) {  
	     if (this.isContainer(idx)) return 0;  
	     return 1;  
	   },  
	   hasNextSibling: function(idx, after) {  
	     var thisLevel = this.getLevel(idx);  
	     for (var t = after + 1; t < this.visibleData.length; t++) {  
	       var nextLevel = this.getLevel(t);  
	       if (nextLevel == thisLevel) return true;  
	       if (nextLevel < thisLevel) break;  
	     }  
	     return false;  
	   },  
	   toggleOpenState: function(idx) {  
	     var item = this.visibleData[idx];  
	     if (!item[1]) return;  
	   
	     if (item[2]) {  
	       item[2] = false;  
	   
	       var thisLevel = this.getLevel(idx);  
	       var deletecount = 0;  
	       for (var t = idx + 1; t < this.visibleData.length; t++) {  
	         if (this.getLevel(t) > thisLevel) deletecount++;  
	         else break;  
	       }  
	       if (deletecount) {  
	         this.visibleData.splice(idx + 1, deletecount);  
	         this.treeBox.rowCountChanged(idx + 1, -deletecount);  
	       }  
	     }  
	     else {  
	       item[2] = true;  
	   
	       var label = this.visibleData[idx][0];  
	       var toinsert = this.childData[label];  
	       for (var i = 0; i < toinsert.length; i++) {  
	         this.visibleData.splice(idx + i + 1, 0, [toinsert[i], false]);  
	       }  
	       this.treeBox.rowCountChanged(idx + 1, toinsert.length);  
	     }  
	     this.treeBox.invalidateRow(idx);  
	   },  
	   
	   getImageSrc: function(idx, column) {},  
	   getProgressMode : function(idx,column) {},  
	   getCellValue: function(idx, column) {},  
	   cycleHeader: function(col, elem) {},  
	   selectionChanged: function() {},  
	   cycleCell: function(idx, column) {},  
	   performAction: function(action) {},  
	   performActionOnCell: function(action, index, column) {},  
	   getRowProperties: function(idx, column, prop) {},  
	   getCellProperties: function(idx, column, prop) {},  
	   getColumnProperties: function(column, element, prop) {},  
	 };  
