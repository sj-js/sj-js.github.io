/**************************************************
 *
 * ICON
 *
 **************************************************/
JellySpeaker.Icon = function(object){
    this.event = new SjEvent();

    this.parent = null;
    this.modeVisible = true;
    this.modeEnable = true;
    this.modeSystem = false;

    this.id = '';
    this.title = '';
    this.html = '';
    this.url = null;
    this.clazz = null;
    this.command = null;
    this.commandForOff = null;
    this.commandForPending = null;
    this.status = null;
    this.lastStatus = null;
    this.parameter = null;
    this.runnerList = [];

    this.objElement = null;
    this.data = {};

    this.modeStatusCheck = null;

    if (object){
        if (typeof object == 'string'){
            this.id = object;
        }else{
            this.init(object);
        }
    }
    this.setModeEnable(this.modeEnable);
};
JellySpeaker.Icon.STATUS_OFF= 0;
JellySpeaker.Icon.STATUS_ON = 1;
JellySpeaker.Icon.STATUS_PENDING = 2;
JellySpeaker.Icon.EVENT_CHANGESTATUS = 'changestatus';





/**************************************************
 *
 * EVENT
 *
 **************************************************/
JellySpeaker.Icon.prototype.addEventListener               = function(element, eventName, eventFunc){ return this.event.addEventListener(element, eventName, eventFunc); };
JellySpeaker.Icon.prototype.addEventListenerByEventName    = function(eventName, eventFunc){ this.event.addEventListenerByEventName(eventName, eventFunc); return this; };
JellySpeaker.Icon.prototype.hasEventListener               = function(element, eventName, eventFunc){ return this.event.hasEventListener(element, eventName, eventFunc); };
JellySpeaker.Icon.prototype.hasEventListenerByEventName    = function(eventName, eventFunc){ return this.event.hasEventListenerByEventName(eventName, eventFunc); };
JellySpeaker.Icon.prototype.hasEventListenerByEventFunc    = function(eventFunc){ return this.event.hasEventListenerByEventFunc(eventFunc); };
JellySpeaker.Icon.prototype.removeEventListener            = function(element, eventName, eventFunc){ return this.event.removeEventListener(element, eventName, eventFunc); };
JellySpeaker.Icon.prototype.removeEventListenerByEventName = function(eventName, eventFunc){ return this.event.removeEventListenerByEventName(eventName, eventFunc); };
JellySpeaker.Icon.prototype.removeEventListenerByEventFunc = function(eventFunc){ return this.event.removeEventListenerByEventFunc(eventFunc); };
JellySpeaker.Icon.prototype.execEventListener              = function(element, eventName, event){ return this.event.execEventListener(element, eventName, event); };
JellySpeaker.Icon.prototype.execEventListenerByEventName   = function(eventName, event){ return this.event.execEventListenerByEventName(eventName, event); };





JellySpeaker.Icon.prototype.init = function(object){
    for (var key in object)
        this[key]= object[key];
    return this;
};
JellySpeaker.Icon.prototype.setTitle = function(title){
    this.title = title;
    return this;
};
JellySpeaker.Icon.prototype.setHTML = function(html){
    this.html = html;
    return this;
};
JellySpeaker.Icon.prototype.setURL = function(url){
    this.url = url;
    return this;
};
JellySpeaker.Icon.prototype.setData = function(data){
    for (var key in data){
        this.data[key] = data[key];
    }
    return this;
};
JellySpeaker.Icon.prototype.setClass = function(clazz){
    if (! (clazz instanceof Array))
        clazz = [clazz];
    this.clazz = clazz;
    return this;
};
JellySpeaker.Icon.prototype.setCommand = function(command){
    this.command = command;
    return this;
};
JellySpeaker.Icon.prototype.setModeStatusCheck = function(mode, func){
    this.modeStatusCheck = mode;
    if (func)
        this.statusChecker = func;
    return this;
};
JellySpeaker.Icon.prototype.setModeVisible = function(mode){
    this.modeVisible = mode;
    return this;
};
JellySpeaker.Icon.prototype.setModeEnable = function(mode){
    this.modeEnable = mode;
    var toClass = (this.modeEnable) ? 'jelly-icon-enabled' : 'jelly-icon-disabled';
    getEl(this.objElement).removeClass(['jelly-icon-enabled', 'jelly-icon-disabled']).addClass(toClass);
    return this;
};
JellySpeaker.Icon.prototype.setModeSystem = function(mode){
    this.modeSystem = mode;
    return this;
};
JellySpeaker.Icon.prototype.setRunner = function(runnerObject){
    this.runnerList = [];
    return this.addRunner(runnerObject);
};
JellySpeaker.Icon.prototype.addRunner = function(runnerObject){
    if (! (runnerObject instanceof Array))
        runnerObject = [runnerObject];
    for (var i=0, runner; i<runnerObject.length; i++){
        runner = runnerObject[i];
        this.runnerList.push(runner);
    }
    return this;
};
JellySpeaker.Icon.prototype.removeRunner = function(runnerObject){
    if (! (runnerObject instanceof Array))
        runnerObject = [runnerObject];
    for (var i=0; i<runnerObject.length; i++){
        var foundIndex = this.runnerList.indexOf(runnerObject[i]);
        if (foundIndex != -1)
            this.runnerList.splice(foundIndex, 1);
    }
    return this;
};



JellySpeaker.Icon.prototype.getKeyRunnerList = function(runnerObject){
    var resultList = [];
    return resultList;
};
JellySpeaker.Icon.prototype.getSpeechRunnerList = function(runnerObject){
    var resultList = [];
    return resultList;
};
JellySpeaker.Icon.prototype.getScheduleRunnerList = function(runnerObject){
    var resultList = [];
    return resultList;
};


JellySpeaker.Icon.prototype.runCommand = function(parameter){
    if (!this.modeEnable)
        return;
    var that = this;
    var parent = this.parent;
    //- Check Parameter
    parameter = (parameter) ? parameter : {};
    parameter.icon = this;
    parameter.status = this.status;
    //- Check Command
    var command = this.command;
    //- Status - Pending
    if (this.modeStatusCheck)
        this.status = JellySpeaker.Icon.STATUS_PENDING;
    //- Run Command
    if (!this.command && this.url)
        return parent.openWindowWithURL(this);
    var callbackWhenResolved = function(){
        that.checkStatus();
    };
    parent.runCommand(command, parameter, callbackWhenResolved);
};


JellySpeaker.Icon.prototype.removeFromParent = function(){
    this.parent.removeIcon(this);
};

JellySpeaker.Icon.prototype.checkStatus = function(){
    if (this.modeStatusCheck && this.statusChecker){
        var that = this;
        var callbackWhenResolved = function(status){
            that.status = JellySpeaker.Icon.checkBooleanStatus(status);
            /** Event **/
            that.execEventListenerByEventName(JellySpeaker.Icon.EVENT_CHANGESTATUS, that);
        };
        this.statusChecker(callbackWhenResolved);
    }
    return this;
};





JellySpeaker.Icon.checkBooleanStatus = function(boolean){
    if (boolean == true){
        return JellySpeaker.Icon.STATUS_ON;
    }else if (boolean == false){
        return JellySpeaker.Icon.STATUS_OFF;
    }
    return boolean;
}


