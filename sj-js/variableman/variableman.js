/****************************************************************************************************
 *
 *  VariableMan
 *  Created By sujkim
 *
 ****************************************************************************************************/
function VariableMan(options){
    var that = this;
    this.event = new SjEvent();

    /* Pattern - Variable */
    this.variableSign = '$';
    this.patternBodyToGetVariable = '[{][^{}]*\\w+[^{}]*[}]';
    this.patternToGetVariable = "[" +this.variableSign+ "]" + this.patternBodyToGetVariable;     // If variable contains some word in ${} then convert to User Set Value or...
    /* Pattern - Member */
    this.patternToSeperateMemebers = ',(?=(?:[^"]*"[^"]*")*[^"]*$)(?=(?:[^\']*\'[^\']*\')*[^\']*$)';
    this.patternToGetMembers = '[(][^(]*[^)]*[)]';   //TODO: addVariable()에 들어가는 파라미터르 인식하기 위해서는 매치패턴의 업데이트 필요
    this.charDoubleQuote = '"';
    this.charSingleQuote = "'";
    /* Pattern - Func */
    this.patternToSeperateFuncs = '\\s*[.](?![^(]*[)])\\s*';

    this.modeDebug = false;
    this.modeMustExistCodeRule = true;
    this.modeExistCodeOnly = false;
    this.modeExistFunctionOnly = true

    this.variableStringMap = {};
    this.variableClosureMap = {};
    this.funcMap = {};
    this.conditionFuncMap = {};

    /** Status **/
    this.meta = {
        nowEscControlPop: null,
        nowEnterControlPop: null,
        nowClickControlPop: null,
    };
    /** Mode **/
    this.globalSetup = {
        modeTest: false,
        modeResize: true,
        testPopClass: null,
        testPopBorderWidth: '1px',
        testPopBorderColor: '#39ff3e',
        testPopBackground: '#c0ffc9',
        alertExp: null,
        alertExpx: '300',
        alertExpy: '200',
        alertContent: null,
        confirmExp: null,
        confirmExpx: '400',
        confirmExpy: '300',
        confirmContent: null,
        loadingExp: null,
        loadingExpx: '200',
        loadingExpy: '200',
        loadingContent: null,
    };
    if (options)
        this.setup(options);

    ready(function(){
        // that.resize();
    });
}



/*************************
 * Exports
 *************************/
try{
    module.exports = exports = VariableMan;
}catch(e){}





/**
 * You Can Create Function's Properties With This Object
 */
function OnePartObject(partValue, isCode){
    var partValue = '';
    var originalCode = '';
    var valueCode = '';
    var substitutes = '';
    var parsedValue = '';
    var bytes;
    var startIndex = 0;
    var endIndex = 0;
    var length = 0;
    var userSetLength = 0;
    var byteLength = 0;
    var charLength = 0;
    var isCode = false;
    var isExistCode = false;
    var isOver = false;

    //Condition Method - If
    var modeIf = false;
    var okIfSeq = 0;
    var nowIfSeq = 0;

    var overValue = '';
    var funcNm = '';
    var members = [];
    var funcNameMemberListMap = {};

    //Init
    if (partValue != null)
        this.partValue = partValue;
    if (isCode != null)
        this.isCode = isCode;

    this.hasFunc = function(functionName){
        return funcNameMemberListMap.containsKey(functionName.toUpperCase());
    };
    this.getMembers = function(functionName){
        return funcNameMemberListMap[functionName.toUpperCase()];
    };
    this.getMember = function(functionName, memberIndex){
        var members = this.getMembers(functionName);
        return members ? members[memberIndex] : null;
    };
}







VariableMan.prototype.setup = function(options){
    for (var objName in options){
        this.globalSetup[objName] = options[objName];
    }
    return this;
};



VariableMan.prototype.setModeDebug = function(modeDebug){
    this.modeDebug = modeDebug;
    return this
};
VariableMan.prototype.setModeMustExistCodeRule = function(modeMustExistCodeRule){
    this.modeMustExistCodeRule = modeMustExistCodeRule;
    return this
};
VariableMan.prototype.setModeExistCodeOnly = function(modeExistCodeOnly){
    this.modeExistCodeOnly = modeExistCodeOnly;
    return this
};
VariableMan.prototype.setModeExistFunctionOnly = function(modeExistFunctionOnly){
    this.modeExistFunctionOnly = modeExistFunctionOnly;
    return this
};
VariableMan.prototype.setVariableSign = function(variableSign){
    this.variableSign = variableSign;
    this.patternToGetVariable = "[" +variableSign+ "]" + patternBodyToGetVariable;
    return this
};





/*************************
 *
 * EVENT
 *
 *************************/
VariableMan.prototype.addEventListener               = function(element, eventName, eventFunc){ return this.event.addEventListener(element, eventName, eventFunc); };
VariableMan.prototype.addEventListenerByEventName    = function(eventName, eventFunc){ return this.event.addEventListenerByEventName(eventName, eventFunc); };
VariableMan.prototype.hasEventListener               = function(element, eventName, eventFunc){ return this.event.hasEventListener(element, eventName, eventFunc); };
VariableMan.prototype.hasEventListenerByEventName    = function(eventName, eventFunc){ return this.event.hasEventListenerByEventName(eventName, eventFunc); };
VariableMan.prototype.hasEventListenerByEventFunc    = function(eventFunc){ return this.event.hasEventListenerByEventFunc(eventFunc); };
VariableMan.prototype.removeEventListener            = function(element, eventName, eventFunc){ return this.event.removeEventListener(element, eventName, eventFunc); };
VariableMan.prototype.removeEventListenerByEventName = function(eventName, eventFunc){ return this.event.removeEventListenerByEventName(eventName, eventFunc); };
VariableMan.prototype.removeEventListenerByEventFunc = function(eventFunc){ return this.event.removeEventListenerByEventFunc(eventFunc); };
VariableMan.prototype.execEventListener              = function(element, eventName, event){ return this.event.execEventListener(element, eventName, event); };
VariableMan.prototype.execEventListenerByEventName   = function(eventName, event){ return this.event.execEventListenerByEventName(eventName, event); };



/*************************
 *
 * PARSE
 *
 *************************/
VariableMan.prototype.parseSpeechExpression = function(variableManExpression, variableStringMap){
    /** 분석 **/
    var splitedByCodeArray = variableManExpression.split( new RegExp(this.patternToGetVariable) );
    var matchedWithCodeArray = variableManExpression.match( new RegExp(this.patternToGetVariable, 'g') );
    var partObjectList = [];
    variableStringMap = variableStringMap ? variableStringMap : this.variableStringMap;
    var variableClosureMap = this.variableClosureMap;
    var cnt = -1;
    for (var i=0, code; i<matchedWithCodeArray.length; i++){
        code = matchedWithCodeArray[i];
        cnt++;
        if (splitedByCodeArray && splitedByCodeArray[cnt]){
            partObjectList.push( this.generateOnePartObjectForString(splitedByCodeArray[cnt]) );
        }
        try{
            partObjectList.push( this.generateOnePartObjectForVariable(code, variableStringMap, variableClosureMap) );
        }catch(e){
            //Exit
        }
    }
    cnt++;
    if (splitedByCodeArray && splitedByCodeArray[cnt]){
        partObjectList.push( this.generateOnePartObjectForString(splitedByCodeArray[cnt]) );
    }
    /** 정리 **/
    var index = 0;
    for (var i=0, partObj; i<partObjectList.length; i++){
        partObj = partObjectList[i];
        if (partObj.isCode){
            if (!partObj.isExistCode && !partObj.substitutes){
                partObj.parsedValue = (this.modeExistCodeOnly && partObj.valueCode) ? partObj.partValue : '';
            }else{
                partObj.parsedValue = partObj.substitutes;
            }
        }else{
            partObj.parsedValue = partObj.partValue;
        }
        // byte[] bytes = (charset) ? partObj.parsedValue.getBytes(charset) : partObj.parsedValue.getBytes();
        partObj.userSetLength = partObj.length;
        partObj.byteLength = this.getByteLength(partObj.parsedValue).length;
        partObj.charLength = partObj.parsedValue.length;
        partObj.startIndex = index;
        partObj.endIndex = index + partObj.charLength + (partObj.charLength == 0 ? 0 : -1);
        index += partObj.parsedValue.length;
    }
    return partObjectList;
};

VariableMan.prototype.generateOnePartObjectForString = function(partValue){
    return new OnePartObject(partValue, false);
};

VariableMan.prototype.generateOnePartObjectForVariable = function(partValue, variableStringMap, variableClosureMap){
    var partObj = new OnePartObject(partValue, true);

    // 1. get String in ${ }
    var content = partValue.replaceFirst("[${variableSign}]", '').replaceFirst('\\{', '').replaceFirst('\\}', '');
    this.validateFunc(content);

    // 2. Analysis And Run Function
    var funcStringList = content?.split(this.patternToSeperateFuncs)?.toList();
    var variableEndIndex = funcStringList.findIndexOf{ it.indexOf('(') != -1 };
    var endIndex = funcStringList.size() -1
    if (variableEndIndex != -1){
        var variableString = funcStringList[0..variableEndIndex].join('.');
        if (variableEndIndex < endIndex)
            funcStringList = [variableString] + funcStringList[variableEndIndex+1..endIndex];
        else
            funcStringList = [content];
    }else{
        funcStringList = [content];
    }

    // If There are no LEFT or RIGHT FUNCTION => Set RIGHT FUNCTION
    if ( this.containsIgnoreCase(funcStringList, 'LEFT(') || this.containsIgnoreCase(funcStringList, 'RIGHT(') ){
    }else{
        funcStringList.push('RIGHT()');
    }
    for (var i=0; i<funcStringList.length; i++){
        var oneFuncString = funcStringList[i];
        var procIdx = i;
        // run variable or func
        var funcName = this.getFuncNameFromOneFunc(oneFuncString);
        if (funcName){
            var originalCode = funcName;
            funcName = funcName.toUpperCase();
            partObj.funcNm = funcName;
            partObj.members = this.getMemebersFromOneFunc(oneFuncString);
            if ( this.getIgnoreCase(conditionFuncMap, funcName) ){
                try{
                    this.runConditionFunc(partObj, variableStringMap, variableClosureMap);
                }catch(e){
                    throw e
                }

                // 1) Get Variable's Value
            }else if (procIdx == 0){
                partObj.originalCode = originalCode
                partObj.valueCode = funcName
                this.getVariableValue(partObj, variableStringMap, variableClosureMap)

                // 2) Run Fucntions To Adjust Value
            }else if (procIdx > 0){
                if (!modeExistFunctionOnly || getIgnoreCase(funcMap, funcName)){
                    try{
                        partObj.funcNameMemberListMap = partObj.funcNameMemberListMap ?: [:]
                        partObj.funcNameMemberListMap[funcName] = partObj.members
                        if (partObj.modeIf){
                            if (partObj.okIfSeq == partObj.nowIfSeq)
                                runFunc(partObj, variableStringMap, variableClosureMap)
                        }else{
                            runFunc(partObj, variableStringMap, variableClosureMap)
                        }
                    }catch(e){
                        throw e
                    }
                }else{
                    throw new Exception(VAR4, new Throwable("[${funcNm}]") )
                }

            }else{
                throw new Exception(VAR4, new Throwable("[${funcNm}]") )
            }

        }else{
//                maybe nothing is not bad
//                    throw new Exception( ErrorMessage.VAR5.msg, new Throwable("[${partValue}]") )
        }
    }
    return partObj;
};





VariableMan.prototype.getFuncNameFromOneFunc = function(oneFuncString){
    var funcName = "";
    var array = oneFuncString.replaceFirst('\\(', ' ').split(' ');
    for (var i=0; i<array.length; i++){
        if (i==0)
            funcName = array[i];
    }
    return funcName;
};

VariableMan.prototype.getMemebersFromOneFunc = function(oneFuncString){
    var members = [];
    // get members
    Matcher m = Pattern.compile(patternToGetMembers).matcher(oneFuncString);
    if (m){
        var memberString = m[0];
        members = memberString.substring(1, memberString.length() -1).split(patternToSeperateMemebers).collect{ it.trim() };
    }
    return members;
};





VariableMan.prototype.compute = function(a, computer, b){
    computer = computer.toUpperCase();
    var computerResult = false;
    var modeNegative = false;
    //- parse '!'
    while (computer.startsWith('!')){
        computer = computer.replaceFirst('^[!]','')
        modeNegative = !modeNegative
    }
    //- parse 'not'
    if (computer.startsWith('NOT')){
        computer = computer.replaceFirst('^NOT','')
        modeNegative = !modeNegative
    }
    switch (computer){
        case {['EQUALS', '=='].contains(it)}:
            computerResult = (a != null) ? a.equals(b) : false; break;
        case {['STARTS', '^'].contains(it)}:
            computerResult = (a != null) ? a.startsWith(b) : false; break;
        case {['ENDS'].contains(it)}:
            computerResult = (a != null) ? a.endsWith(b) : false; break;
        case {['CONTAINS', '~'].contains(it)}:
            computerResult = (a != null) ? a.contains(b) : false; break;
        case {['MATCHES'].contains(it)}:
            computerResult = (a != null) ? a.matches(b) : false; break;
        case {['EXISTS'].contains(it)}:
            computerResult = (!!a); break;
        case {['EMPTY'].contains(it)}:
            computerResult = (a != null) ? (a == '') : false; break;
        case {['NULL'].contains(it)}:
            computerResult = (a == null); break;
    }
    return (modeNegative) ? !computerResult : computerResult
};

VariableMan.prototype.containsIgnoreCase = function(stringList, value){
    value = value.toUpperCase();
    var resultItems = stringList.findAll{ stringItem ->
    stringItem.toUpperCase().contains(value);
    }
    if (resultItems && resultItems.size() > 0)
        return true;
    else
        return false;
};

VariableMan.prototype.containsKeyIgnoreCase = function(map, key){
    key = key.toUpperCase();
    var resultKeys = map.keySet().findAll{ itKey ->
        itKey.toUpperCase().contains(key);
    }.toList();
    if (resultKeys && resultKeys.size() > 0)
        return true;
    else
        return false;
};

VariableMan.prototype.getIgnoreCase = function(map, key){
    key = key.toUpperCase();
    var resultKeys = map.keySet().findAll{ String itKey ->
        itKey.toUpperCase().equals(key);
    }.toList();
    if (resultKeys && resultKeys.size() > 0){
        key = resultKeys[0];
        return map[key];
    }else{
        return null;
    }
};



// https://programmingsummaries.tistory.com/133
VariableMan.prototype.getByteLength = function(text, b, i, c){
    for (b=i=0; c=text.charCodeAt(i++); b+=c>>11?3:c>>7?2:1);
    return b;
};