(function() {
    angular.module('app')
    .filter("customDate", function () {
        return function (input, params) {
            if (!input) return "";
            if (!(input instanceof Date)) {
                var timestamp = input.match(/\d+/);
                timestamp[0] /= 1000;
                if (params == "date") {
                    return moment.unix(timestamp[0]).format("YYYY-MM-DD");
                }
                else if (params == "time") {
                    return moment.unix(timestamp[0]).format("HH:mm:ss");
                }
                else {
                    return moment.unix(timestamp[0]).format("YYYY-MM-DD HH:mm:ss");
                }
            }
            else {
                if (params == "date") {
                    return moment(input).format("YYYY-MM-DD");
                }
                else if (params == "time") {
                    return moment(input).format("HH:mm:ss");
                }
                else {
                    return moment(input).format("YYYY-MM-DD HH:mm:ss");
                }
            }
        };
    })
    .filter("filterEmptyClass", function () {
        return function (input, params) {
            if (!input) return [];
            var tempArray = [];
            for (i = 0; i < input.length; i++) {
                if (input[i].nodes.length > 0) {
                    tempArray.push(input[i]);
                }
            }
            return tempArray;
        };
    })
    .filter("filterErrorQuestion", function () {
        return function (input, params) {
            // node.isRight!='false' && node.isKeep!='false'
            if (!input) return [];
            var tempArray = [];
            for (i = 0; i < input.length; i++) {
                if (input[i].isRight != "false") {
                    tempArray.push(input[i]);
                }
            }
            return tempArray;
        };
    })
    .filter("msgContentFormat", function () {
        return function (input, params) {
            // node.isRight!='false' && node.isKeep!='false'
            if (!input) return [];
            var tempArray = [];
            for (i = 0; i < input.length; i++) {
                var temp = input[i].split(":");
                if (temp.length <= 1)
                    temp = input[i].split("：");
                item = {};
                item.key = temp[0] + " : ";
                item.value = temp[1];
                tempArray.push(item);
            }
            return tempArray;
        };
    })
    .filter("titleList", function () {
        return function (input) {
            if (!input) return [];
            var tempArray = [];
            if (input instanceof Array) {
                tempArray = input;
                for (var i = 0; i < tempArray.length; i++) {
                    tempArray[i] = tempArray[i].replace("@check@", "");
                }
            }
            else {
                tempArray.push(input.replace("@check@", ""));
            }
            return tempArray;
        };
    })
    .filter("textLength", function () {
        return function (input, params) {
            if (!input) return "";
            try{
                if (input.length > parseInt(params)) {
                    return input.substring(0, parseInt(params)) + "...";
                }
            }
            catch(ex){

            }
            return input;
            
        };
    })
    .filter("msgFormat", function(){
    	return function(input, params){
    		if (!input)return "";
    		var tempArray = input.split(":");
    		if (tempArray.length == 1)
    			tempArray = input.split("：");
    		if (tempArray.length >= 2){
    			if (params == 'title'){
    				return tempArray[0];
    			}
    			else if (params == 'content'){
    				var tempString = "";
    				for (var i = 1; i < tempArray.length; i++){
    					tempString += tempArray[i];
    				}
    				return tempString;
    			}
    		}
    		else {
    		    if(params == 'title')return "";
    			return input;
    		}
    	}
    })
    .filter("messageContent", function(){
        return function(input, params){
            if (input instanceof Array){
                var list = [];
                for (var i = 0; i < input.length; i++){
                    var item = {};
                    var tempArray = input[i].split(":");
                    if (tempArray.length == 1)
                        tempArray = input[i].split("：");
                    if (tempArray.length >= 2){
                        item.key = tempArray[0];

                        var tempString = "";
                        for (var j = 1; j < tempArray.length; j++) {
                            tempString += tempArray[j];
                        }
                        item.value = tempString;
                        item.isKeyValue = true;
                    }
                    else{
                        item.value = input[i];
                        item.key = "";
                        item.isKeyValue = false;
                    }
                    list.push(item);
                }
                return list;
            }
            return input;
        }
    });
})();