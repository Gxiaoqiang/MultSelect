/**
 * 
 * 多线下拉选择器控件
 * 
 */

(function($){
	var multSelects = {};
	var nodes = {};
	var j = {
			contains:function(str,subStr){
				return new RegExp(subStr).test(str);
			},
       apply: function(b, a, c) {
           return typeof b == "function" ? b.apply(N, a ? a : []) : c
       },
       clone: function(b) {
           if (b === null)
               return null;
           var a = j.isArray(b) ? [] : {}, c;
           for (c in b)
               a[c] = b[c]instanceof Date ? new Date(b[c].getTime()) : typeof b[c] === "object" ? arguments.callee(b[c]) : b[c];
           return a
       },
       eqs: function(b, a) {
           return b.toLowerCase() === a.toLowerCase()
       },
       isArray: function(b) {
           return Object.prototype.toString.apply(b) === "[object Array]"
       },
       isJson:function (obj){  
           var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;   
           return isjson;  
       },
       $: function(b, a, c) {
           a && typeof a != "string" && (c = a,
           a = "");
           return typeof b == "string" ? p(b, c ? c.treeObj.get(0).ownerDocument : null) : p("#" + b.tId + a, c ? c.treeObj : null)
       }
   };
	var fnMe = {
			setInitSelected:function(selectNodes,obj){
				obj.selectedData = selectNodes;
				var name = "";
				obj.$hintUl.find("li span").hide();
				if(j.isArray(selectNodes)){
					if(obj.isMult){
						for(var i = 0;i<selectNodes.length;i++){
							name += selectNodes[i].name+",";
							obj.$hintUl.find("li[id="+selectNodes[i].id+"] span").show();
							fnMe.moveSelectedToFirst(obj,selectNodes[i]);
						}
					}else{
						if(selectNodes.length>0){
							name += selectNodes[0].name;
							obj.$hintUl.find("li[id="+selectNodes[0].id+"] span").show();
							fnMe.moveSelectedToFirst(obj,selectNodes[0]);
						}
					}
				}else{
					name += selectNodes.name;
					obj.$hintUl.find("li[id="+selectNodes.id+" span]").show();
					fnMe.moveSelectedToFirst(obj,selectNodes);
				}
				fnMe.setText(obj,name);
			},
			getMultSelectById:function(id){
				return multSelects[id];
			},
			setIsMult:function(obj,flag){
				if(obj){
					if(obj.isMult == flag){
						return;
					}
					obj.isMult = flag;
					if(!flag){
						fnMe.changeMult(obj);
					}else{
						fnMe.setText(obj,obj.selectedData[0].name+",");
					}
				}
			},
			setText:function(multObj,buttonTiltle){
				multObj.$selectedInput.attr("title",buttonTiltle);
				multObj.$selectedInput.val(buttonTiltle);
			},
			stopPropagation:function (e) {  
				if (e.stopPropagation){
					e.stopPropagation();  
				}else{
					 e.cancelBubble = true;
				}   
			} ,
			changeMult:function(multObj){ // 如果设置为单选，则之前进行多选的选项只保留第一个记录。后面的进行删除
				if(!multObj.isMult){
					if(multObj.selectedData.length>1){
						fnMe.setText(multObj,multObj.selectedData[0].name);
						for(var i = 1;i<multObj.selectedData.length;i++){
							multObj.$hintUl.find("li[id="+multObj.selectedData[i].id+"]  span").hide();
						}
						multObj.selectedData.splice(1,multObj.selectedData.length-1);
						fnMe.moveSelectedToFirst(multObj,multObj.selectedData[0]);
					}
				}
			},
			moveSelectedToFirst:function(multObj,node){
				multObj.$hintUl.find("li[id="+node.id+"]").insertBefore(multObj.$hintUl.find("li:first"));
				multObj.$hintUlSearch.find("li[id="+node.id+"]").insertBefore(multObj.$hintUlSearch.find("li:first"));
			},
			moveSelectedToLast:function(multObj,node){
				multObj.$hintUl.find("li[id="+node.id+"]").insertBefore(multObj.$hintUl.find("li:last"));
				multObj.$hintUlSearch.find("li[id="+node.id+"]").insertBefore(multObj.$hintUlSearch.find("li:last"));
			},
			checkAreadySelected:function(node,multObj){
				var flag = false;
				for(var i = 0;i<multObj.selectedData.length;i++){
					if($.trim(node.id) == $.trim(multObj.selectedData[i].id)){
						return true;
					}
				}
				return flag;
			},
			removeSelectedNode:function(multObj,node){
				for(var i = 0;i<multObj.selectedData.length;i++){
					if($.trim(node.id) == $.trim(multObj.selectedData[i].id)){
						multObj.selectedData.splice(i,1);
						return;
					}
				}
			},
			setSelectedNodeDisplay:function(id,multObj){
				multObj.selectedData.forEach(function(data){
					if($.trim(id) == $.trim(data.id)){
						data.display="none";
					}
				});
			}
	};
	var multSelectObject = {
			data:[],// 存放节点
			selectedData:[],// 被选中节点
			isMult:false, // 支持多选,默认不支持
			setIsMult:function(flag){
				fnMe.setIsMult(this,flag);
			},
			getSelectedData:function(){
				return this.selectedData;
			},
			initSelected:function(selectNodes){
				fnMe.setInitSelected(selectNodes,this);
			}
	};
	$.fn.MultSelect = {
			init:function(dom,dataTemp,setting){
				var multObj = $.fn.MultSelect.initNode(dom,dataTemp,setting);
				// 设置词典列表宽度
				$.fn.MultSelect.setHintSearchContainerWidth(multObj);
				// 实现响应式 监听resize事件
				$.fn.MultSelect.bindEvent(multObj);
				return multObj;
			},
			initNode:function(domObj,dataTemp,setting){
				var multObj = j.clone(multSelectObject);
				// p.extend(!0, multObj, a);
				multObj.id = domObj.attr("id");
				var node =  '<div class="multSelectList"><div class="hint-input-span-container">'+
							'<input class="selected-input" title="" readonly><span class="downPic downIcon downselect"></span></input>'+
							'</div><div class="hint-block">'+
							'<div  class="hint-search-div">'+
							'<input type="text" class="hint-search" name="hint-search" value="" placeholder="输入关键字"></div>'+
							'<ul class="hint-ul"></ul>'+
							'<ul class="hint-ul-search"></ul>'+
							'</div></div>';
				$(domObj).html($(node));
				if(setting){
					if(setting.isMult!=null||setting.isMult!=undefined){
						multObj.isMult = setting.isMult;// 设置多选
					}
				}
				multObj.multObj = $(domObj);
				multObj.$selectedInput = $($(domObj).find(".selected-input"));
				multObj.$hintSearch =  $($(domObj).find("input[name='hint-search']"));
				multObj.$hintSearchContainer =  $($(domObj).find(".hint-input-span-container"));
				multObj.$hintBlock =  $($(domObj).find(".hint-block"));
				multObj.$hintUl =  $($(domObj).find(".hint-ul"));
				multObj.$hintUlSearch = $($(domObj).find(".hint-ul-search"));
			    multObj.$multSelectList = $($(domObj).find(".multSelectList"));
				multObj.data = dataTemp;
				delete multSelects[multObj.id];
				multSelects[multObj.id] = multObj;
				$.fn.MultSelect.addDictionary(multObj, function(){
					$.fn.MultSelect.addUlListener(multObj.$hintUl,multObj)});
				return multObj;
			},
			bindEvent:function(multObj){
				// 点击除本身以外的地方，则隐藏
				$(document).mousedown(function(e){
					if(!$.contains(multObj.$multSelectList[0], e.target)){
						multObj.$hintBlock.hide();
					}
				});
				$(window).bind('resize',function(){
					$.fn.MultSelect.setHintSearchContainerWidth(multObj);
				});
				// 获取焦点
				multObj.$hintSearch.focus(function() {
					$.fn.MultSelect.animteDown(multObj);
					multObj.$hintUlSearch.show();
					multObj.$hintUl.hide();
					var text = multObj.$hintSearch.val();
					if ($.trim(text)=="") {
						multObj.$hintUlSearch.empty();
					}
				});
		/*
		 * multObj.$hintSearch.blur(function() {
		 * setTimeout(function() {
		 * multObj.$hintUlSearch.hide();
		 * $.fn.MultSelect.animateUp(multObj);
		 *  }, 200);
		 * });
		 */
				multObj.$hintSearchContainer.click(function(e){
					fnMe.stopPropagation(e);
					multObj.$hintBlock.toggle(function(){
						multObj.$hintUl.show();
						multObj.$hintUlSearch.hide();
						multObj.$hintSearch.val("");
						multObj.$hintUlSearch.empty();
					});
					return false;
				});
				multObj.$hintSearch.keyup(function(e) {
					var text = multObj.$hintSearch.val();
					if (!$.trim(text)=="") {
						multObj.searchArr = [{"name":"无匹配条目"}];
						$.fn.MultSelect.updateSearchDictionary(multObj, function(){
							$.fn.MultSelect.addUlListener(multObj.$hintUlSearch,multObj)
						});
					}
					var tmparr = multObj.data.filter(function(x) {
						return x.name.indexOf(text) != -1;
					})
					if (tmparr.length === 0) {
						tmparr.push({"name":"无匹配条目"});
					}
					multObj.searchArr = tmparr;
					$.fn.MultSelect.updateSearchDictionary(multObj,function(){
						$.fn.MultSelect.addUlListener(multObj.$hintUlSearch,multObj);
					});
				})
			},
			addDictionary:function(multObj, callback) {
				var name ;
				for (var i = 0; i < multObj.data.length; i++) {
					name = multObj.data[i].name ;
					if( name.length > 8){
						name = name.substring(0,8)+"..";
					}
					multObj.$hintUl.append('<li  id = "'+multObj.data[i].id+'" title = "'+multObj.data[i].name+'">' 
							+ name + '<span style="font-size:14px;color:black;float:right;display:none;">√</span></li>');
				}
				callback&&callback();
			},
			updateDictionary:function(multObj, callback) {
				multObj.$hintUl.empty();
				$.fn.MultSelect.addDictionary(multObj, callback);
			},
			updateSearchDictionary:function(multObj,callback){
				multObj.$hintUlSearch.empty();
				$.fn.MultSelect.addSearchDictionary(multObj, callback);
			},
			addSearchDictionary:function(multObj,callback){
				var name ;
				for (var i = 0; i < multObj.searchArr.length; i++) {
					name = multObj.searchArr[i].name ;
					if( name.length > 8){
						name = name.substring(0,8)+"..";
					}
					var li = '<li  id = "'+multObj.searchArr[i].id+'" title = "'+multObj.searchArr[i].name+'">' 
						+ name + '<span style="font-size:14px;color:black;float:right;display:none;">√</span></li>'
						if(fnMe.checkAreadySelected(multObj.searchArr[i],multObj)){
							li = '<li  id = "'+multObj.searchArr[i].id+'" title = "'+multObj.searchArr[i].name+'">' 
							+ name + '<span style="font-size:14px;color:black;float:right;display:block;">√</span></li>'
						}
					multObj.$hintUlSearch.append(li);
				}
				callback&&callback();
			},
			animteDown:function(multObj) {
				multObj.$hintBlock.slideDown('fast');
			},
			animateUp:function(multObj) {
				multObj.$hintBlock.slideUp('fast', function() {
				});
			},
			setHintSearchContainerWidth:function(multObj) {
				var hint_width = multObj.$hintSearchContainer.outerWidth();
				var hint_left = multObj.$hintSearchContainer.position().left;
				multObj.$hintBlock.css({
					'width' : hint_width,
					"margin-left":hint_left
				});
			},
			addSpanListenr:function(multObj) {
				multObj.$hintSearchContainer.find("span").delegate("i", 'click',
						function() {
					var node = {
							"id":$(this).attr("id")
					};
					$(this).parent().remove();
					fnMe.removeSelectedNode(multObj,node);
					fnMe.moveSelectedToLast(multObj,node);
					multObj.$hintBlock.toggle();
				})
			},
			addUlListener :function(ul,multObj) {
				ul.find("li").unbind("click").bind("click",function(){
					var text = $(this).attr("title");
					var id = $(this).attr("id");
					var selected = {
							"name":text,
							"id":$.trim(id),
							"display":"block"
					};
					$.fn.MultSelect.checkLiEvenet(selected,multObj);
				});
			},
			checkLiEvenet:function(selected,multObj){
				var text = selected.name;
				var id = selected.id;
				if (!fnMe.checkAreadySelected(selected,multObj)) { // 未选中
					var selectedNodes = multObj.$selectedInput.attr("title");
					if(!multObj.isMult){
						selectedNodes = text;
						multObj.selectedData.splice(0,1);
						multObj.$hintUl.find("li span").hide();
					}else{
						selectedNodes += text + ",";
					}
					multObj.$hintUl.find("li[id="+id+"] span").show();
					multObj.$hintUlSearch.find("li[id="+id+"] span").show();
					fnMe.setText(multObj,selectedNodes);
					multObj.selectedData.push(selected);
					fnMe.moveSelectedToFirst(multObj,selected);
				}else{               // 已经选中
					multObj.$hintUl.find("li[id="+id+"] span").hide();
					multObj.$hintUlSearch.find("li[id="+id+"] span").hide();
					fnMe.removeSelectedNode(multObj,selected);// 删除已经选中节点中的元素
					var selectedNodes = multObj.$selectedInput.attr("title");
					if(j.contains(selectedNodes,text+",")){
						selectedNodes = selectedNodes.replace(text+",","");// 替换元素
					}else{
						selectedNodes = selectedNodes.replace(text,"");// 替换元素
					}
					fnMe.setText(multObj,selectedNodes);
					fnMe.removeSelectedNode(multObj,selected);
					fnMe.moveSelectedToLast(multObj,selected);
				}
				if(!multObj.isMult){
					multObj.$hintBlock.toggle(function(){
						$.fn.MultSelect.animateUp(multObj);
						multObj.$hintSearch.val("");
						multObj.$hintUlSearch.empty();
						multObj.$hintUlSearch.hide();
						multObj.$hintUl.show();
					});
				}
			},
			getMultSelect:function(id){
				var temp =  fnMe.getMultSelectById(id);
				return temp;
			},
			setInitData:function(selectNodes){
				var obj = $.fn.MultSelect.getMultSelect(id);
				if(obj){
					obj.selectedData = selectNodes;
					var name = "";
					if(j.isArray(selectNodes)){
						for(var i = 0;i<selectNodes.length;i++){
							if(j.isJson(selectNodes)){
								name += selectNodes[i].name+",";
								obj.$hintUl.find("li[id="+selectNodes[i].id+" span]").show();
							}
						}
					}else if(j.isJson(selectNodes)){
						if(j.isJson(selectNodes)){
							name += selectNodes.name;
							obj.$hintUl.find("li[id="+selectNodes.id+" span]").show();
						}
					}
					fnMe.setText(obj,name);
				}
			}
	};
})(jQuery,window,$);