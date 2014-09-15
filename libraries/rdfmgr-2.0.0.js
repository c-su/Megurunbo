function RDFmgr(projectID, serverURL){
	var rdfserverURL = new String();
	var default_project = new String();
	var ownerKey = null;
	var ownerFlag = false;

	if(typeof serverURL === "undefined"){
		rdfserverURL = "http://lodcu.cs.chubu.ac.jp/SparqlEPCU/RDFServer.jsp";
	}else{
		rdfserverURL = serverURL;
	}

	if(typeof projectID === 'undefined'){
		default_project = "undefined";
	}else{
		default_project = projectID;
	}
	this.setURL = function(url){
		rdfserverURL = url;
	}
	this.getURL = function(){
		return rdfserverURL;
	}
	this.setDefaultProject = function(projectID){
		default_project = projectID;
	}
	this.getDefaultProject = function(){
		return default_project;
	}

	this.executeSparql = function(obj){
		if(typeof obj === 'undefined' || typeof obj === "null") obj = {};
		if(typeof obj.remakeJson === 'undefined' || typeof obj.remakeJson === 'null') obj.remakeJson = true;
		if(typeof obj.inference === 'undefined' || typeof obj.inference === 'null') obj.inference = true;
		if(typeof obj.replacePrefix === 'undefined') obj.replacePrefix = true;
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";
		if(typeof obj.output === 'undefined') obj.output = "N3";

		var urlData = "&reqtype=search";
		urlData += "&type=search";
		urlData += "&graphID=" + encodeURIComponent(obj.graphID);
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&sparqlText=" + encodeURIComponent(obj.sparql);
		urlData += "&inference=" + encodeURIComponent(obj.inference);
		urlData += "&replace=" + encodeURIComponent(obj.replacePrefix);
		urlData += "&output=" + encodeURIComponent(obj.output);

		transport({
			urlData: urlData,
			success: function(data){
				data = makeResult(data);
				obj.success(data);
			},
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	this.executeQuery = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.remakeJson === 'undefined' || typeof obj.remakeJson === 'null') obj.remakeJson = true;
		if(typeof obj.inference === 'undefined') obj.inference = true;
		if(typeof obj.replacePrefix === 'undefined') obj.replacePrefix = true;
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;
		if(typeof obj.output === 'undefined') obj.output = "N3";

		var urlData = "&reqtype=sparql";
		urlData += "&type=query";
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&sparqlText=" + encodeURIComponent(obj.sparql);
		urlData += "&replace=" + encodeURIComponent(obj.replacePrefix);
		urlData += "&output=" + encodeURIComponent(obj.output);

		transport({
			urlData: urlData,
			success: function(data){
				data = makeResult(data);
				obj.success(data);
			},
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	this.executeUpdate = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;

		var urlData = "&reqtype=sparql";
		urlData += "&type=update";
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&sparqlText=" + encodeURIComponent(obj.sparql);

		transport({
			urlData: urlData,
			success: obj.success,
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	function makeResult(data){
		var varlist = new Array();
		var dlist = new Array();
		var strtemp = new String();
		var strtype = new String();

		var result = new Object();

		if(data.queryType == "ASK"){
			return data;
		}else if(data.queryType == "CONSTRUCT"){
			return data;
		}else if(data.queryType == "DESCRIBE"){
			return data;
		}

		for(var i=0; i < data.head.vars.length; i++){
			varlist.push(data.head.vars[i]);
		}

		for(var i=0; i < data.results.bindings.length; i++){
			var addlist = new Array();
			var addobj = new Object();
			var obj = data.results.bindings[i];
			for(var j=0; j < varlist.length; j++){
				if((obj[varlist[j]]) != undefined){
					strtemp = obj[varlist[j]].value;
					strtype = obj[varlist[j]].type;
				}else{
					strtemp = undefined;
				}
				if(strtemp != undefined){
					addlist.push({type: strtype ,value:strtemp});
				}else{
					addlist.push({type: undefined ,value:undefined});
				}
			}
			dlist.push(addlist);
		}

		result.keylist = varlist;
		result.valuelist = dlist;
		result.jsonlist = data;
		result.now = -1;
		result.next = function(){
			this.now++;
			if(this.now >= this.getValueListLength()){
				return false;
			}else{
				return true;
			}
		}
		result.getValue = function(v){
			if(this.now == -1){
				console.log("Error. Please use the 'next()' before use 'getValue()'.");
			}else{
				if(typeof v == "string"){
					var varindex = this.keylist.indexOf(v);
					if(varindex == -1){
						return undefined;
					}else{
						return this.valuelist[this.now][varindex].value;
					}
				}else if(typeof v == "number"){
					return this.valuelist[this.now][v].value;
				}
			}
		}
		result.getType = function(v){
			if(this.now == -1){
				console.log("Error. Please use the 'next()' before use 'getType()'.");
			}else{
				if(typeof v == "string"){
					var varindex = this.keylist.indexOf(v);
					if(varindex == -1){
						return undefined;
					}else{
						return this.valuelist[now][varindex].type;
					}
				}else if(typeof v == "number"){
					return this.valuelist[this.now][v].type;
				}
			}
		}
		result.getKey = function(i){
			return this.keylist[i];
		}
		result.getKeyList = function(){
			return this.keylsit;
		}
		result.getList = function(){
			return this.valuelist[this.now];
		}
		result.getValueList = function(){
			return this.valuelist;
		}
		result.getJson = function(){
			return this.jsonlist;
		}
		result.getKeyListLength = function(){
			return this.keylist.length;
		}
		result.getLength = function(){
			if(this.now == -1){
				console.log("Error. Please use the 'next()' before use 'getLength()'.");
			}else{
				return this.valuelist[this.now].length;
			}
		}
		result.getValueListLength = function(){
			return this.valuelist.length;
		}
		result.reset = function(){
			this.now = -1;
		}

		return result;
	}

	this.insertInstance = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.type === 'undefined') obj.type = "CSV";
		if(typeof obj.rdfdata === 'undefined') obj.rdfdata = undefined;
		if(typeof obj.overwrite === 'undefined') obj.overwrite = false;
		if(Array.isArray(obj.rdfdata)){
			obj.rdfdata = makeCSV(obj.columnList,obj.rdfdata);
		}
		if(obj.overwrite){
			obj.type += "_overwrite";
		}
		sendRDFdata(obj);
	}

	this.insertStatement = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.type === 'undefined') obj.type = undefined;
		if(typeof obj.rdfdata === 'undefined') obj.rdfdata = undefined;
		if(typeof obj.overwrite === 'undefined') obj.overwrite = false;

		if(obj.type == "List"){
			obj.rdfdata = obj.rdfdata.join(",");
		}
		if(obj.type != undefined){
			obj.type += "_statement";
		}
		if(obj.overwrite){
			obj.type += "_overwrite";
		}
		sendRDFdata(obj);
	}

	this.insertSchema = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.type === 'undefined') obj.type = undefined;
		if(typeof obj.rdfdata === 'undefined') obj.rdfdata = undefined;
		if(typeof obj.rdfdata === "Array"){
			obj.rdfdata = makeCSV(undefined,obj.rdfdata);
			obj.type = "csv";
		}

		if(obj.type != undefined){
			obj.type += "_schema";
		}

		sendRDFdata(obj);
	}

	function makeCSV(columnlist,data){
		var s = new String();

		if(columnlist != undefined){
			for(var i=0; i < columnlist.length; i++){
				if(i != 0){
					s += ",";
				}
				s += columnlist[i];
			}
			s += "\n";
		}
		for(var i=0; i < data.length; i++){
			if(i != 0){
				s += ",";
			}
			s += data[i];
		}
		s += "";
		//console.log(s);
		return s;
	}

	this.clearProject = function(obj){
		if(typeof obj === 'undefined') obj = {};
		obj.type = "clearProject";
		sendRDFdata(obj);
	}

	this.clearGraph = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";
		obj.type = "clearGraph";
		sendRDFdata(obj);
	}

	this.deleteInstance = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;
		if(typeof obj.subject === 'undefined') obj.subject = undefined;
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";

		console.log(obj);
		var urlData = "&reqtype=manage";
		urlData += "&type=removeInstance";
		urlData += "&graphID=" + encodeURIComponent(obj.graphID);
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&subject=" + encodeURIComponent(obj.subject);

		transport({
			urlData: urlData,
			success: obj.success,
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	this.updateInstance = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;
		if(typeof obj.subject === 'undefined') obj.subject = undefined;
		if(typeof obj.predicate === 'undefined') obj.predicate = undefined;
		if(typeof obj.object === 'undefined') obj.object = undefined;
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";

		var urlData = "&reqtype=manage";
		urlData += "&type=updateInstance";
		urlData += "&graphID=" + encodeURIComponent(obj.graphID);
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&subject=" + encodeURIComponent(obj.subject);
		urlData += "&predicate=" + encodeURIComponent(obj.predicate);
		urlData += "&object=" + encodeURIComponent(obj.object);

		transport({
			urlData: urlData,
			success: obj.success,
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	this.deleteStatement = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;
		if(typeof obj.subject === 'undefined') obj.subject = undefined;
		if(typeof obj.predicate === 'undefined') obj.predicate = undefined;
		if(typeof obj.object === 'undefined') obj.object = undefined;
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";

		var urlData = "&reqtype=manage";
		urlData += "&type=removeStatement";
		urlData += "&graphID=" + encodeURIComponent(obj.graphID);
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&subject=" + encodeURIComponent(obj.subject);
		urlData += "&predicate=" + encodeURIComponent(obj.predicate);
		urlData += "&object=" + encodeURIComponent(obj.object);

		transport({
			urlData: urlData,
			success: obj.success,
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	this.updateStatement = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";

		var urlData = "&reqtype=manage";
		urlData += "&type=updateStatement";
		urlData += "&graphID=" + encodeURIComponent(obj.graphID);
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&s_subject="+ encodeURIComponent(obj.subject1);
		urlData += "&s_predicate="+ encodeURIComponent(obj.predicate1);
		urlData += "&s_object="+ encodeURIComponent(obj.object1);
		urlData += "&z_subject="+ encodeURIComponent(obj.subject2);
		urlData += "&z_predicate="+ encodeURIComponent(obj.predicate2);
		urlData += "&z_object="+ encodeURIComponent(obj.object2);

		transport({
			urlData: urlData,
			success: obj.success,
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	function sendRDFdata(obj){
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";
		var urlData = "&reqtype=manage";
		urlData += "&type=" + obj.type;
		urlData += "&graphID=" + encodeURIComponent(obj.graphID);
		urlData += "&project=" + encodeURIComponent(obj.projectID);
		urlData += "&data=" + encodeURIComponent(obj.rdfdata);

		transport({
			urlData: urlData,
			success: obj.success,
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	this.projectDump = function(obj){
		if(typeof obj === 'undefined') obj = {};
		if(typeof obj.projectID === 'undefined') obj.projectID = default_project;;
		if(typeof obj.inference === 'undefined') obj.inference = true;
		if(typeof obj.graphID === 'undefined') obj.graphID = "null";

		var urlData = "&reqtype=manage";
		urlData += "&type=projectDump";
		urlData += "&graphID=" + encodeURIComponent(obj.graphID);
		urlData += "&project="+obj.projectID;
		urlData += "&filetype="+encodeURIComponent(obj.filetype);
		urlData += "&inference="+obj.inference;
		transport({
			urlData: urlData,
			success: obj.success,
			error: obj.error,
			connectionError: obj.connectionError
		});
	}

	if (!Array.prototype.indexOf)
	{
		Array.prototype.indexOf = function(elt /*, from*/)
		{
			var len = this.length;

			var from = Number(arguments[1]) || 0;
			from = (from < 0)
			? Math.ceil(from)
					: Math.floor(from);
			if (from < 0)
				from += len;

			for (; from < len; from++)
			{
				if (from in this &&
						this[from] === elt)
					return from;
			}
			return -1;
		};
	}

	function transport(obj){
		var ie_flag = false;

		if(typeof obj.success === 'undefined') obj.success = function(){};
		if(typeof obj.error === 'undefined') obj.error = function(){};
		if(typeof obj.connectionError === 'undefined') obj.connectionError = function(){};
		var timestamp = Date.now();
		var callbackName = "RDFmgr" + timestamp;

		var url = rdfserverURL;
		url += "?sparqlCallback=" + callbackName;
		url += "&hostname=" + encodeURIComponent(location.hostname);
		url += obj.urlData;

		if(url.length >= 7500){
			//console.log(url.length);
			//console.log("データが大きすぎます.");
			obj.error("DataIsTooBig", "送信しようとしているデータが大きすぎます",undefined);
		}

		var script = document.createElement("script");
		script.async = "async";
		script.src = url;
		var head = document.getElementsByTagName("head")[0] || document.documentElement;
		window[callbackName] = function(data){
			if(data.error){
				obj.error(data.errorType,data.errorMsg,data.errorInfo);
			}else{
				obj.success(data);
			}
		}
		head.appendChild(script);
		script.onreadystatechange = function(){
			if(ie_flag){
				head.removeChild(script);
			}
			ie_flag = true;
		}
		var isMSIE = /*@cc_on!@*/false;
		if(!isMSIE){
			script.onload = function(){
				head.removeChild(script);
			}
		}
		script.onerror = function(){
			head.removeChild(script);
			obj.connectionError();
		}
	}
}

/*
ver.2.0.0 アップデート内容

・executeQueryを追加
・executeUpdateを追加
・各メソッドにgraphID機能を実装
・大きすぎるデータを送信しようとした場合、エラー関数を実行するよう変更
*/