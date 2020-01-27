/***************************************************************************
 *
 * Jelly - Command Listener
 *
 ***************************************************************************/
function JellySpeaker(object){
    this.event = new SjEvent();
    this.speechRecognizer = null;

    this.lastProcessResult = new JellySpeaker.SpeakProcess();

    //Meta
    this.name = '젤리';
    this.nickName = ['잴리', '쟐리'];
    this.storagePath = '/jelly/icon';

    //Status
    this.statusCalledMyName = false;
    this.startTimeForCommand = null;
    this.endTimeForCommand = null;
    this.lastTimeSpeechInput = null;

    //Datas - Setup
    this.setupObject = {};
    //Temp
    this.commandObject = {};
    this.commandConditionObject = {};
    //Datas - Icon
    this.iconList = [];
    this.systemIconMap = {};
    this.userIconMap = {};
    //Datas - Runner
    this.keyRunnerMap = {};
    this.speechRunnerMap = {};
    this.scheduleRunnerMap = {};
    //Datas - Window
    this.urlOpenMap = {};

    //Plugin
    this.boxman = new BoxMan();
    this.popman = new PopMan();
    this.keyman = new KeyMan();
    this.menuman = new MenuMan();
    this.variableman = new VariableMan();
    this.pluginList = [];

    //Log
    this.logStack = [];

    //Watch
    this.stackToWork = [];
    this.timeToWatch = 500;


    if (object)
        this.setup(object);


    var that = this;
    window.addEventListener('unload', function(){
        for (var iconId in that.urlOpenMap){
            var windowList = that.urlOpenMap[iconId];
            for (var i=0, targetWindow; i<windowList.length; i++){
                targetWindow = windowList[i];
                if (targetWindow && !targetWindow.closed){
                    targetWindow.close();
                }
            }
        }
    });
}
JellySpeaker.TYPE_RUNNER_KEY = 'key';
JellySpeaker.TYPE_RUNNER_SPEECH = 'speech';
JellySpeaker.TYPE_RUNNER_SCHEDULE = 'schedule';
JellySpeaker.EVENT_FINALRESULT = 'finalresult';
JellySpeaker.EVENT_RESULT = 'result';
JellySpeaker.EVENT_STARTSPEECH = 'startspeech';
JellySpeaker.EVENT_ENDSPEECH = 'endspeech';
JellySpeaker.EVENT_NOMORESPEECH = 'nomorespeech';
JellySpeaker.EVENT_STOPSPEECH = 'stopspeech';




/**************************************************
 *
 * EVENT
 *
 **************************************************/
JellySpeaker.prototype.addEventListener               = function(element, eventName, eventFunc){ return this.event.addEventListener(element, eventName, eventFunc); };
JellySpeaker.prototype.addEventListenerByEventName    = function(eventName, eventFunc){ this.event.addEventListenerByEventName(eventName, eventFunc); return this; };
JellySpeaker.prototype.hasEventListener               = function(element, eventName, eventFunc){ return this.event.hasEventListener(element, eventName, eventFunc); };
JellySpeaker.prototype.hasEventListenerByEventName    = function(eventName, eventFunc){ return this.event.hasEventListenerByEventName(eventName, eventFunc); };
JellySpeaker.prototype.hasEventListenerByEventFunc    = function(eventFunc){ return this.event.hasEventListenerByEventFunc(eventFunc); };
JellySpeaker.prototype.removeEventListener            = function(element, eventName, eventFunc){ return this.event.removeEventListener(element, eventName, eventFunc); };
JellySpeaker.prototype.removeEventListenerByEventName = function(eventName, eventFunc){ return this.event.removeEventListenerByEventName(eventName, eventFunc); };
JellySpeaker.prototype.removeEventListenerByEventFunc = function(eventFunc){ return this.event.removeEventListenerByEventFunc(eventFunc); };
JellySpeaker.prototype.execEventListener              = function(element, eventName, event){ return this.event.execEventListener(element, eventName, event); };
JellySpeaker.prototype.execEventListenerByEventName   = function(eventName, event){ return this.event.execEventListenerByEventName(eventName, event); };




/*************************
 *
 * DETECT DOM SETUPED WITH POPMAN OPTION
 *
 *************************/
JellySpeaker.prototype.detect = function(afterDetectFunc){
    var that = this;
    ready(function(){
        // getEl().ready(function(){
        var setupedElementList;
        /** 객체탐지 적용() **/
        setupedElementList = document.querySelectorAll('[data-jelly-click]');
        for (var j=0; j<setupedElementList.length; j++){
            that.setJellyClick(setupedElementList[j]);
        }
        /** 객체탐지 적용() **/
        setupedElementList = document.querySelectorAll('[data-jelly-enter]');
        for (var j=0; j<setupedElementList.length; j++){
            that.setJellyEnter(setupedElementList[j]);
        }
        /** Run Function After Detect **/
        if (afterDetectFunc)
            afterDetectFunc(that);
        if (that.hasEventListenerByEventName('afterdetect'))
            that.execEventListenerByEventName('afterdetect');
    });
    return this;
};
JellySpeaker.prototype.afterDetect = function(func){
    this.addEventListenerByEventName('afterdetect', func);
    return this;
};
JellySpeaker.prototype.beforeFirstPop = function(func){
    this.addEventListenerByEventName('beforefirstpop', func);
    return this;
};
JellySpeaker.prototype.afterLastPop = function(func){
    this.addEventListenerByEventName('afterlastpop', func);
    return this;
};


JellySpeaker.prototype.setJellyClick = function(element){
    getEl(element).addEventListener('click', function(){
        var command = element.getAttribute('data-jelly-click');
        jelly.runCommand(command);
    });
    return this;
};
JellySpeaker.prototype.setJellyEnter = function(element){
    getEl(element).addEventListener('keydown', function(e){
        if (e.keyCode == 13){
            var command = element.getAttribute('data-jelly-enter');
            jelly.runCommand(command);
        }
    });
    return this;
};



/**************************************************
 *
 *  START
 *
 **************************************************/
JellySpeaker.prototype.start = function(){
    var that = this;
    //Add Work
    this.addWork([
        //Check Log
        new WorkItem().setEnable(false).setCycle(2000).setFunc(function(){
            console.log('Wathcer-Checker>', new Date().getTime());
        }),
        //Check Command Timeout
        new WorkItem().setCycle(1000).setFunc(function(){
            if (WorkItem.checkElapsedTime(that.lastTimeSpeechInput, 4000)){
                if (that.statusCalledMyName)
                    that.stopListenCommand();
                that.execEventListenerByEventName(JellySpeaker.EVENT_NOMORESPEECH, null);
            }
        }),
    ]);
    //Start Auto
    this.startSpeechRecognizer();
    this.startWorkProcess();
    return this;
};
JellySpeaker.prototype.finish = function(){
    this.stopSpeechRecognizer();
    this.stopWorkProcess();
    this.removeAllWorkItem();
    return this;
};



/**************************************************
 *
 *  PLUGIN
 *
 **************************************************/
JellySpeaker.prototype.addPlugin = function(plugin){
    if ( !(plugin instanceof Array) )
        plugin = [plugin];
    for (var i=0, pg; i<plugin.length; i++){
        pg = plugin[i];
        if (pg.statusSetuped)
            return;
        pg.statusSetuped = true;
        pg.parent = this;
        pg.setup(this);
        pg.start(this);
        this.pluginList.push(plugin[i]);
    }
    return this;
};
JellySpeaker.prototype.findPlugin = function(plugin){
    for (var i=0, comparePlugin; i<this.pluginList.length; i++){
        comparePlugin = this.pluginList[i];
        if (comparePlugin instanceof plugin)
            return comparePlugin;
    }
    return null;
};
JellySpeaker.prototype.removePlugin = function(plugin){
    if ( !(plugin instanceof Array) )
        plugin = [plugin];
    for (var i=0, pg; i<plugin.length; i++){
        pg = this.findPlugin(plugin[i]);
        if (!pg || !pg.statusSetuped)
            return;
        pg.end();
        pg.dispose();
        pg.statusSetuped = false;
        pg.parent = null;
        var foundIndex = this.pluginList.indexOf(pg);
        if (foundIndex != -1)
            this.pluginList.splice(foundIndex, 1);
    }
    return this;
};



/**************************************************
 *
 * SETUP
 *
 **************************************************/
JellySpeaker.prototype.setup = function(setupObject){
    for (var key in setupObject){
        this.setupObject[key] = setupObject[key];
    }
    return this;
};



/**************************************************
 *
 * SETUP - ICON
 *
 **************************************************/
JellySpeaker.prototype.setupCommandCondition = function(commandConditionObject){
    for (var key in commandConditionObject){
        var condition = commandConditionObject[key];
        if ( !(condition instanceof Array) )
            condition = [condition];
        if (!this.commandConditionObject[key])
            this.commandConditionObject[key] = [];
        for (var i=0; i<condition.length; i++){
            this.commandConditionObject[key].push(condition[i]);
        }
    }
    return this;
};
JellySpeaker.prototype.setupSystemIcon = function(iconObject){
    var that = this;
    if ( !(iconObject instanceof Array))
        iconObject = [iconObject];
    for( var i=0, icon; i<iconObject.length; i++){
        icon = iconObject[i];
        //Something add class
        icon.setModeSystem(true);
    }
    this.setupUserIcon(iconObject);
    return this;
};
JellySpeaker.prototype.setupUserIcon = function(iconObject){
    var that = this;
    if ( !(iconObject instanceof Array))
        iconObject = [iconObject];
    for( var i=0, icon; i<iconObject.length; i++){
        icon = iconObject[i];
        icon.parent = this;
        this.iconList.push(icon);

        /** Setup Runner **/
        for (var j=0, runner; j<icon.runnerList.length; j++){
            runner = icon.runnerList[j];
            runner.parent = icon;
            if (runner instanceof JellySpeaker.KeyRunner){
                this.addKey(runner);
            }else if (runner instanceof JellySpeaker.ScheduleRunner){
                this.addSchedule(runner);
            }else if (runner instanceof JellySpeaker.SpeechRunner){
                this.addSpeech(runner);
            }
        }
    }
    return this;
};



/**************************************************
 *
 * SETUP - BOT
 *
 **************************************************/
JellySpeaker.prototype.setupBot = function(botObject){
    var that = this;
    if ( !(botObject instanceof Array))
        botObject = [botObject];
    for( var i=0, icon; i<botObject.length; i++){
        icon = botObject[i];
        icon.parent = this;
        this.iconList.push(icon);

        /** Setup Runner **/
        for (var j=0, runner; j<icon.runnerList.length; j++){
            runner = icon.runnerList[j];
            runner.parent = icon;
            if (runner instanceof JellySpeaker.KeyRunner){
                this.addKey(runner);
            }else if (runner instanceof JellySpeaker.ScheduleRunner){
                this.addSchedule(runner);
            }else if (runner instanceof JellySpeaker.SpeechRunner){
                this.addSpeech(runner);
            }
        }
    }
    return this;
};



/**************************************************
 *
 * SAVE & LOAD
 *
 **************************************************/
JellySpeaker.prototype.saveIcon = function(sotragePathKey){
    this.execEventListenerByEventName('saveicon', null);
    return this;
};
JellySpeaker.prototype.loadIcon = function(sotragePathKey){
    this.execEventListenerByEventName('loadicon', null);
    return this;
};



JellySpeaker.prototype.getIcon = function(param){
    if (typeof param == 'string'){
        return this.getIconById(param);
    }else if (param instanceof Element){
        // return this.getIconByEl(param);
    }else{
        var resultList = this.getIconsByCondition(param);
        if (resultList != null && resultList.length > 0)
            return resultList[0];
    }
    return;
};
JellySpeaker.prototype.getIcons = function(){
    return this.iconList;
}
BoxMan.prototype.getIconsByCondition = function(condition){
    var resultList = [];
    var iconList = this.iconList;
    for (var boxName in iconList){
        var obj = iconList[boxName];
        var result = getEl(obj).find(condition);
        if (result)
            resultList.push(result);
    }
    return resultList;
};
JellySpeaker.prototype.getIconById = function(id){
    // var objElement = document.getElementById(id);
    // var icon = this.iconList[objElement.manid];
    for (var i=0, icon; i<this.iconList.length; i++){
        icon = this.iconList[i];
        if (icon.id == id){
            return icon;
        }
    }
    return null;
};
JellySpeaker.prototype.getIconByEl = function(element){
    var iconList = this.iconList;
    if (element && element.manid){
        var manid = element.manid;
        var icon = iconList[manid];
        return icon;
    }
};

JellySpeaker.prototype.removeIcon = function(param){
    // var icon = this.getIcon(param);
    var icon = param;
    var foundIndex = this.iconList.indexOf(icon);
    if (foundIndex != -1)
        this.iconList.splice(foundIndex, 1);
    return this;
};




/**************************************************
 *
 * SETUP - RUNNER
 *
 **************************************************/
JellySpeaker.prototype.addKey = function(runner){
    var that = this;
    var keyman = this.keyman;
    var id = createUUID();
    this.keyman.addShortcut({
        name: id,
        keys: runner.keyList,
        data: {
            shortcutName: id,
            shortcutKeyList: runner.keyList,
            runType: 'runType',
            menuName: 'menuName'
        },
        keydown:function(data){
            // console.log('CHECK RUN TYPE!!! ', data.shortcutName, data.runType, RUN_TYPE_DB)
            //Alert 등을 사용할때 키눌림상태를 해결할 수 있는 기능
            keyman.check(data.shortcutName);
            console.error(runner);
            var icon = runner.parent;
            icon.runCommand(icon.command, icon.parameter);
            // that.runCommand(runner.parent.command, runner.parent.parameter);
        }
    });
};

JellySpeaker.prototype.addSpeech = function(runner){
    var that = this;
    var icon = runner.parent;
    var command = icon.command;
    var speechExpression = runner.speechExpression;
    //
    var speechData = {};
    speechData[command] = [speechExpression];
    this.setupCommandCondition(speechData);
};

JellySpeaker.prototype.addSchedule = function(runner){
    var that = this;
    if (runner.cycleTime){
        that.addWork( new WorkItem().setEnable(true).setModeDirectStart(true).setCycle(runner.cycleTime).setFunc(function(){
            var icon = runner.parent;
            icon.runCommand(icon.command, icon.parameter);
            // that.runCommand(runner.parent.command, runner.parent.parameter);
        }) );
    }else if (runner.getExpression()){
        that.addWork( new WorkItem().setEnable(true).setModeDirectStart(true).setTimeManExp(runner.getExpression()).setFunc(function(){
            var icon = runner.parent;
            icon.runCommand(icon.command, icon.parameter);
            // that.runCommand(runner.parent.command, runner.parent.parameter);
        }) );
    }
};



/**************************************************
 *
 * COMMAND
 *
 **************************************************/
JellySpeaker.prototype.command = function(object){
    if (object instanceof JellySpeaker.SpeakResult){
        var resultList = this.analysisSpeechExpression(object);
        for (var i=0, result; i<resultList.length; i++){
            result = resultList[i];
            this.runCommand(result.type, result.parameter);
        }
    }else if (object instanceof JellySpeaker.JellyCommand){
        this.runCommand(object.type, object.parameter)
    }
    return this;
};
JellySpeaker.prototype.runCommand = function(command, parameter, resolve){
    parameter = (parameter) ? parameter: {};
    var commandFunc;
    if (command instanceof JellySpeaker.JellyCommand){
        commandFunc = command.command;
        parameter = command.parameter;
    }
    if (typeof command == 'string'){
        // commandFunc = this.commandObject[command];
        var icon = this.getIcon(command);
        if (icon)
            return this.runCommand(icon.command, parameter, resolve);
    }
    if (command instanceof Function){
        commandFunc = command;
    }else if (typeof command == 'object'){
        commandFunc = command;
    }
    if (commandFunc){
        commandFunc(parameter, resolve);
    }else{
        this.popman.alert('존재하지 않는 명령입니다. [' +command+ ']');
    }
    return this;
};

JellySpeaker.prototype.openWindowWithURL = function(icon){
    var that = this;
    var openTargetWindow;
    if (!this.urlOpenMap[icon.id])
        this.urlOpenMap[icon.id] = [];
    //창 1개 제한
    this.clearClosedWindows(icon.id);
    console.error('Ooen Window', icon.id, that.urlOpenMap[icon.id]);
    if (this.urlOpenMap[icon.id].length > 0){
        openTargetWindow = this.urlOpenMap[icon.id][0];
        openTargetWindow.focus();
        return;
    }
    //Open NewPage
    openTargetWindow = window.open(icon.url, '_blank');
    //Event
    openTargetWindow.addEventListener('beforeunload ', function(e){
        console.error('Delete Window', that.urlOpenMap[icon.id]);
        var list = that.urlOpenMap[icon.id];
        if (!list)
            return;
        var foundIndex = list.indexOf(openTargetWindow);
        if (foundIndex != -1)
            list.splice(foundIndex, 1);
    });
    this.urlOpenMap[icon.id].push(openTargetWindow);
};
JellySpeaker.prototype.clearClosedWindows = function(iconId){
    var list = this.urlOpenMap[iconId];
    for (var i=list.length -1, win; i>-1; i--){
        win = list[i];
        if (win.closed)
            list.splice(i, 1);
    }
};
JellySpeaker.prototype.closeWindowWithURL = function(icon){
    var windowList = this.urlOpenMap[icon.id];
    if (windowList){
        windowList[0].close();
    }
};



JellySpeaker.prototype.triggerByText = function(script){
    var finalResult = new JellySpeaker.SpeakResult({
        time:new Date().getTime(), script:script, confidence:1, type:JellySpeaker.SpeakResult.TYPE_TEXT
    });
    this.onSpeechFinalResult(finalResult);
};
JellySpeaker.prototype.pushLog = function(logObject){
    this.logStack.push(logObject);
};








