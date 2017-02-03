// JavaScript Document
var SORTTREETB = SORTTREETB || {};   
(function(sort,window,document){
	
	sort.SORT=function(option){
		this.id=option.id;
		this.json= option.json;
		this.lang_opt = option.lang;
		this.html="";
		this.init(); 
	};
	sort.SORT.prototype={
		
		$:function(elemId){
			return document.getElementById(elemId);
		},
		sortTable:function(tableId, sortCol, sortType)	{
			var self=this;
			var oTbody = self.$(tableId).tBodies[0];//得到指定id的表格对象下的tbody
			var dataRows = oTbody.rows;
			var tdJsonArr = [];
			var tdJson={};
			var sortRows = [];
			/*直接对json进行排序
			for(var i=0; i<dataRows.length; i++){
				sortRows.push(dataRows[i]);
			}

			// sortRows.push(dataRows[i]);
			sortRows.sort(function(oTr1, oTr2){
				var cellVal1 = oTr1.cells[colIdx].textContent;//firstChild.nodeValue
				var cellVal2 = oTr2.cells[colIdx].textContent;

				return sortType=="asc"?self.compare(cellVal1, cellVal2):self.compare(cellVal2, cellVal1);
			});
					
			for(var j=0; j<sortRows.length; j++){
				oTbody.appendChild(sortRows[j]);
			}
			*/
			self.sortTree(self.json,sortType,sortCol);
			
			self.html="";
			self.renderHtml(self.json);
			self.doTreeTable();
		},
		sortTree:function(o,sortType,sortCol){
			var self =this;
			o.sort(self.sortJson(sortType,sortCol));
			for(var i=0;i<o.length;i++){
			 	if(o[i].children!=null && o[i].children.length>0){
			 		self.sortTree(o[i].children,sortType,sortCol);
			 	}
			 }
		},
		sortJson:function(order, sortBy){
			var ordAlpah = (order == 'asc') ? '>' : '<';
		    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
		    return sortFun;
		},
		compare:function(val1, val2){
			if(!isNaN(val1) && !isNaN(val2)){
				return parseInt(val1) - parseInt(val2);
			}

			return val1.localeCompare(val2);
		},
		init:function(){
			var self = this;
			if(self.id){
				self.renderHtml(self.json);
				self.doTreeTable();
				var sortType = "asc";
				$(".sorting").each(function(){
					var sortCol = this;
					$(sortCol).on("click",  function(){
						sortType = (sortType == "asc")?"desc":"asc";
						this.className = "sorting_" + sortType;			
						self.sortTable(self.id, $(this).attr("alt"), sortType);
					});
				})
			}
			
		},
		renderHtml:function(o){
			var self = this;
	          var lang = self.lang_opt=="CN"?"":"_en";
	          for(var i=0;i<o.length;i++){
	            var url,str = "";
	            var id=o[i]["audience_id"];
	            var pid = o[i]["parent_id"];
	            var pHtml =  pid=="0"?"":"data-tt-parent-id="+pid;
	            var evenOrOdd = i%2==0?"odd ":"even "
	            var branchOrleaf = (o[i]["children"] != null && o[i]["children"].length>0)||pid=="0";
	            var trClass = branchOrleaf?"branch "+evenOrOdd:"leaf "+evenOrOdd;
	            try{
	                urlstr = "<tr data-tt-id='"+id+"' "+pHtml+" class='"+trClass+"expanded'><td><span class='indenter' style='padding-left: 5px;'></span>"+ o[i]["name"+lang] +"</td><td>"+o[i]["name"+lang]+"</td><td>"+id+"</td></tr>";
	             
	              self.html += urlstr;
	              if(branchOrleaf){
	                self.renderHtml(o[i]["children"]);
	              }
	            }catch(e){}
	          }
      	},
      	doTreeTable:function(){
      		var self = this;
      		//console.log(self.html);
      		$("#"+self.id).find("tbody").html(self.html);
      		$("#"+self.id).treetable({ expandable: true},true);
      	}
	}
	
})(SORTTREETB,window,document);



