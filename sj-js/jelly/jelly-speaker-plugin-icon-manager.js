/*****************************************************************************************************************************
 *
 * Jelly - Command Listener
 *
 *****************************************************************************************************************************/
JellySpeaker.PluginIconManager = function(){
    this.event = new SjEvent();

    this.name = '';
    this.parent = null;
    this.statusSetuped = false;

    this.defaultClazz = [JellySpeaker.PluginIconManager.CLASS_ICON_DEFAULT];

    this.currentSetupRunnerIcon = null;

    /** Status Checker **/
    this.statusChecker = null;
    this.cycleTimeForStatusChecker = 5000;
    this.checkerNameMap = {};

    /** Position Shortcut Key **/
    this.elementForPositionShortcutKeyList = [];

    this.classForIconStatusOn = 'jelly-icon-status-on';
    this.classForIconStatusOff = 'jelly-icon-status-off';
    this.classForIconStatusPending = 'jelly-icon-status-pending';
};
JellySpeaker.PluginIconManager.COMMAND_NAME_FOR_OPEN = 'open-plugin-icon-manager';
JellySpeaker.PluginIconManager.COMMAND_NAME_FOR_OPEN_SETUP_RUNNER = 'open-plugin-icon-manager-setup-runner';
JellySpeaker.PluginIconManager.POP_ICON_MANAGER = 'pop-icon-manager';
JellySpeaker.PluginIconManager.POP_ICON_MANAGER_SETUP_RUNNER = 'pop-icon-manager-setup-runner';
JellySpeaker.PluginIconManager.BOX_ICON_LIST = 'box-icon-list';
JellySpeaker.PluginIconManager.EVENT_JELLYICONMANAGER_SETUP = 'jellyiconmanagersetup';
JellySpeaker.PluginIconManager.EVENT_JELLYICONMANAGER_AFTERPOP = 'jellyiconmanagerafterpop';

JellySpeaker.PluginIconManager.CLASS_ICON_DEFAULT = 'jelly-plugin-icon-manager-default';
JellySpeaker.PluginIconManager.CLASS_ICON_TOGGLE = 'jelly-plugin-icon-manager-toggle';



/**************************************************
 *
 * EVENT
 *
 **************************************************/
JellySpeaker.PluginIconManager.prototype.addEventListener               = function(element, eventName, eventFunc){ return this.event.addEventListener(element, eventName, eventFunc); };
JellySpeaker.PluginIconManager.prototype.addEventListenerByEventName    = function(eventName, eventFunc){ this.event.addEventListenerByEventName(eventName, eventFunc); return this; };
JellySpeaker.PluginIconManager.prototype.hasEventListener               = function(element, eventName, eventFunc){ return this.event.hasEventListener(element, eventName, eventFunc); };
JellySpeaker.PluginIconManager.prototype.hasEventListenerByEventName    = function(eventName, eventFunc){ return this.event.hasEventListenerByEventName(eventName, eventFunc); };
JellySpeaker.PluginIconManager.prototype.hasEventListenerByEventFunc    = function(eventFunc){ return this.event.hasEventListenerByEventFunc(eventFunc); };
JellySpeaker.PluginIconManager.prototype.removeEventListener            = function(element, eventName, eventFunc){ return this.event.removeEventListener(element, eventName, eventFunc); };
JellySpeaker.PluginIconManager.prototype.removeEventListenerByEventName = function(eventName, eventFunc){ return this.event.removeEventListenerByEventName(eventName, eventFunc); };
JellySpeaker.PluginIconManager.prototype.removeEventListenerByEventFunc = function(eventFunc){ return this.event.removeEventListenerByEventFunc(eventFunc); };
JellySpeaker.PluginIconManager.prototype.execEventListener              = function(element, eventName, event){ return this.event.execEventListener(element, eventName, event); };
JellySpeaker.PluginIconManager.prototype.execEventListenerByEventName   = function(eventName, event){ return this.event.execEventListenerByEventName(eventName, event); };



/**************************************************
 *
 * OPTION
 *
 **************************************************/
JellySpeaker.PluginIconManager.prototype.setCycleTimeForStatusCheck = function(cycleTime){
    this.cycleTimeForStatusChecker = cycleTime;
    return this;
};
JellySpeaker.PluginIconManager.prototype.setCustomChecker = function(checkerName, filter, func, cycleTime){
    this.checkerNameMap[checkerName] = {
        filter: filter,
        func: func,
        cycleTime: cycleTime
    };
    return this;
};


/**************************************************
 *
 * SETUP
 *
 **************************************************/
JellySpeaker.PluginIconManager.prototype.setup = function(parent){
    var that = this;
    var parent = this.parent;
    var boxman = parent.boxman;
    var popman = parent.popman;
    var keyman = parent.keyman;
    var menuman = parent.menuman;
    /** System Icon **/
    parent.setupSystemIcon([
        new JellySpeaker.Icon(JellySpeaker.PluginIconManager.COMMAND_NAME_FOR_OPEN).setCommand(function(parameter){
            popman.popIfOff(JellySpeaker.PluginIconManager.POP_ICON_MANAGER);
        })
    ]);
    /** User Icon **/
    parent.setupUserIcon([
        new JellySpeaker.Icon('toggle-speech-recognizer').setTitle('음성인식기').setHTML('🎤').setClass(JellySpeaker.PluginIconManager.CLASS_ICON_TOGGLE)
            .setCommand(function(parameter, resolve){
                parameter.status ? parent.stopSpeechRecognizer() : parent.startSpeechRecognizer();
                resolve();
            })
            .setModeStatusCheck(true, function(resolve){
                resolve(parent.checkSpeechRecognizerStatus());
            }),
    ]);
    /** Make Component **/
    ready(function(){
        that.makePopForIconManager();
        that.makePopForSetupRunner();
        that.makeContextMenuForIconManager();
        that.makeChecker();
        /** Make Key **/
        that.addDefaultShortcuts();
        that.addCommander();
    });
};
JellySpeaker.PluginIconManager.prototype.start = function(){

};
JellySpeaker.PluginIconManager.prototype.end = function(){

};
JellySpeaker.PluginIconManager.prototype.dispose = function(){

};





JellySpeaker.PluginIconManager.prototype.makeChecker = function(){
    var that = this;
    var parent = this.parent;
    /** Status Checker **/
    if (that.checkerNameMap){
        getData(that.checkerNameMap).each(function(checkerName, checkerObject){
            parent.addWork(new WorkItem().setEnable(true).setModeDirectStart(true).setCycle(checkerObject.cycleTime).setFunc(function(){
                var icons = parent.getIcons();
                if (checkerObject.filter)
                    icons = getEl(icons).find(checkerObject.filter);
                checkerObject.func(icons, function(statusMap){
                    for (var key in statusMap){
                        var status = statusMap[key];
                        var icon = parent.getIcon(key);
                        icon.status = JellySpeaker.Icon.checkBooleanStatus(status);
                        icon.execEventListenerByEventName(JellySpeaker.Icon.EVENT_CHANGESTATUS, icon);
                    }
                });
                //- URL Checker
                // if (that.customURLChecker){
                //     that.customURLChecker(icons, function(statusMap){
                //         for (var key in statusMap){
                //             var status = statusMap[key];
                //             var icon = parent.getIcon(key);
                //             icon.status = JellySpeaker.Icon.checkBooleanStatus(status);
                //             icon.execEventListenerByEventName(JellySpeaker.Icon.EVENT_CHANGESTATUS, icon);
                //         }
                //     });
                // }else{
                //     for (var ii=0, icon; ii<icons.length; ii++){
                //         icon = icons[ii];
                //         if (icon.url)
                //             continue;
                //         that.checkIconUrl(icon, function(icon){
                //             icon.execEventListenerByEventName(JellySpeaker.Icon.EVENT_CHANGESTATUS, icon);
                //         });
                //     }
                // }
            }));
        });
    }
    /** Status Checker **/
    parent.addWork(new WorkItem().setEnable(true).setModeDirectStart(true).setCycle(that.cycleTimeForStatusChecker).setFunc(function(){
        //- Custom Checker
        var iconListToCheckStatus = getData(icons).findAll(function(it){
            return it.modeStatusCheck;
        });
        getData(iconListToCheckStatus).each(function(it){
            it.checkStatus();
        });
    }));
    /** Custom Status Checker **/
    var icons = parent.getIcons();
    for (var ii=0, icon; ii<icons.length; ii++){
        icon = icons[ii];
        icon.addEventListenerByEventName(JellySpeaker.Icon.EVENT_CHANGESTATUS, function(icon){
            that.styleIcon(icon);
        });
        icon.checkStatus();
    }
    // parent.addWork( new WorkItem().setEnable(true).setModeDirectStart(true).setCycle(that.cycleTimeForStatusChecker).setFunc(function(){
    //     var icons =  parent.getIcons();
    //     for (var ii=0, icon; ii<icons.length; ii++){
    //         icon = icons[ii];
    //         //Check
    //         var status = icon.checkStatus(icon);
    //     }
    // }) );
};



/*************************
 * ADD SHORTCUT
 *************************/
JellySpeaker.PluginIconManager.prototype.addDefaultShortcuts = function(){
    var that = this;
    var parent = this.parent;
    var boxman = parent.boxman;
    var popman = parent.popman;
    var keyman = parent.keyman;
    var menuman = parent.menuman;

    /** 개발툴창 임시로 보기 **/
    keyman.addShortcut({
        name:'pop_dev',
        keys:[KeyMan.CTRL, KeyMan.SHIFT],
        keydown:function(){
            parent.runCommand(JellySpeaker.PluginIconManager.COMMAND_NAME_FOR_OPEN);
            if (toolContext.devStick)
                getEl('input-dev-search-all').focus();
            that.showPositionShorcutKey();
        },
        keyup:function(){
            that.hidePositionShortcutKey();
            if (!toolContext.devStick)
                popman.close(JellySpeaker.PluginIconManager.POP_ICON_MANAGER);
        }
    });

    /** 개발툴창 임시로 보기 기능 고정해보리기 **/
    keyman.addShortcut({
        name:'stick_dev',
        keys:[KeyMan.SPACE],
        keydown:function(){
            if (keyman.isOn('pop_dev')){
                toolContext.devStick = (toolContext.devStick) ? false : true;
                if (toolContext.devStick)
                    getEl('input-dev-search-all').focus();
            }
        }
    });

    for (var i=0, cnt; i<9; i++){ //TODO: 이상하게 (CTRL + SHIFT + 0)은 안된다.
        cnt = (i+1);
        keyman.addShortcut({
            name:'position-shortcut-' +cnt,
            keys:'CTRL + SHIFT + ' +((cnt == 10) ? 0 : cnt),
            data:{
                index: i
            },
            keydown:function(data){
                var icon = that.getUserIconByOrder(data.index);
                icon.runCommand();
            },
            keyup:function(){
            }
        });
    }
};

/*************************
 * ADD COMMANDER
 *************************/
JellySpeaker.PluginIconManager.prototype.addCommander = function(){
    var that = this;
    var parent = this.parent;
    var boxman = parent.boxman;
    var popman = parent.popman;
    var keyman = parent.keyman;
    var menuman = parent.menuman;

    keyman
        .addCommander('1p')
        .setUp(['w']).setDown(['s']).setLeft(['a']).setRight(['d']).setButtonA(['t']).setButtonB(['SHIFT']).setButtonC(['g']).setButtonD(['h'])
        .addCommandMap({
            'uppercut': [KeyMan.RIGHT, KeyMan.DOWN, KeyMan.DOWNRIGHT, KeyMan.RIGHT, KeyMan.B],
            'rabekku': [KeyMan.LEFT, KeyMan.RIGHT, KeyMan.A],
            'dropkick': [KeyMan.RIGHT, KeyMan.RIGHT, KeyMan.D],
            'openDevTool': [KeyMan.B, KeyMan.B]
        })
        .addCommandEventMap({
            'dropkick': function(){
                // toggleModeMetaDev();
                console.log('dropkick!');
            },
            'openDevTool': function(){
                parent.runCommand(JellySpeaker.PluginIconManager.COMMAND_NAME_FOR_OPEN);
            }
        });

    //TODO: Commander 직관화
    //TODO: KeyMan Context 전환

    // keyman
    //     .addCommandMap({
    //         'hello': [KeyMan.N1, KeyMan.N2, KeyMan.N3],
    //         'hello': [KeyMan.N1, KeyMan.N2, KeyMan.N3],
    //     })
    //     .addCommandEventMap({
    //         'hello': function(){
    //             console.log('dropkick!');
    //         },
    //         'hello2': function(){
    //             console.log('dropkick2!');
    //         }
    //     })
    //
    // keyman
    //     .addCommander('1p')
    //     .setUp(['w']).setDown(['s']).setLeft(['a']).setRight(['d']).setButtonA(['t']).setButtonB(['SHIFT']).setButtonC(['g']).setButtonD(['h'])
    //     .addCommandMap({
    //         'uppercut': [KeyMan.RIGHT, KeyMan.DOWN, KeyMan.DOWNRIGHT, KeyMan.RIGHT, KeyMan.B],
    //         'rabekku': [KeyMan.LEFT, KeyMan.RIGHT, KeyMan.A],
    //         'dropkick': [KeyMan.RIGHT, KeyMan.RIGHT, KeyMan.D],
    //         'openDevTool': [KeyMan.B, KeyMan.B]
    //     })
    //     .addCommandEventMap({
    //         'dropkick': function(){
    //             // toggleModeMetaDev();
    //             console.log('dropkick!');
    //         },
    //         'openDevTool': function(){
    //             parent.runCommand(JellySpeaker.PluginIconManager.COMMAND_NAME_FOR_OPEN);
    //         }
    //     });
};






JellySpeaker.PluginIconManager.prototype.setupIcon = function(icon){
    var that = this;
    var parent = this.parent;
    var boxman = parent.boxman;
    var objElement = getEl(boxman.newObj())
        .addClass(that.defaultClazz)
        .addClass(icon.clazz)
        .style('display:inline-block; width:100px; height:100px; overflow:hidden;')
        .html(icon.html + icon.title)
        .addEventListener('click', function(event){
            try{
                icon.runCommand();
            }catch(ex){
                console.error(ex);
            }
        })
        .returnElement();
    icon.objElement = objElement;
    return objElement;
};



JellySpeaker.PluginIconManager.prototype.getIcon = function(param){
    if (typeof param == 'string'){
        return this.getIconById(param);
    }else if (param instanceof Element){
        return this.getIconByEl(param);
    }else if (param instanceof JellySpeaker.Icon){
        return param;
    }else{
        var resultList = this.getObjsByCondition(param);
        if (resultList != null && resultList.length > 0)
            return resultList[0];
    }
    return;
};
JellySpeaker.PluginIconManager.prototype.getIcons = function(){
    return this.iconList;
}
JellySpeaker.prototype.getIconsByCondition = function(condition){
    var resultList = [];
    var iconList = this.parent.iconList;
    // for (var boxName in iconList){
    //     var obj = iconList[boxName];
    //     var result = getEl(obj).find(condition);
    //     if (result)
    //         resultList.push(result);
    // }
    for (var i=0; i<iconList; i++){
        var icon = iconList[i];
        var result = getEl(icon).find(condition);
        if (result)
            resultList.push(result);
    }
    return resultList;
};
JellySpeaker.PluginIconManager.prototype.getIconById = function(id){
    var objElement = document.getElementById(id);
    // var icon = this.iconList[objElement.manid];
    // return icon;

    return this.getIconByEl(objElement);
};
JellySpeaker.PluginIconManager.prototype.getIconByEl = function(element){
    var iconList = this.parent.iconList;
    // if (element && element.manid){
    //     var manid = element.manid;
    //     var icon = iconList[manid];
    //     return icon;
    // }

    for (var i=0, icon; i<iconList.length; i++){
        icon = iconList[i];
        if (icon.objElement && icon.objElement === element){
            return icon;
        }
    }
    return null;
};
JellySpeaker.PluginIconManager.prototype.getUserIconByOrder = function(index){
    var that = this;
    var parent = this.parent;
    var objList = parent.boxman.getObjListByBox(JellySpeaker.PluginIconManager.BOX_ICON_LIST);
    console.error(index, objList);
    return (objList.length > index) ? that.getIcon(objList[index].element) : null;
};


JellySpeaker.PluginIconManager.prototype.removeIcon = function(param){
    var icon = this.getIcon(param);
    this.parent.boxman.delObj(icon.objElement);
    icon.removeFromParent();
    return this;
};
JellySpeaker.PluginIconManager.prototype.delIcon = JellySpeaker.PluginIconManager.prototype.removeIcon;



JellySpeaker.PluginIconManager.prototype.setupRunner = function(icon){
    var that = this;
    var parent = that.parent;
    var runnerList = icon.runnerList;
    for (var i=0, runner; i<runnerList.length; i++){
        runner = runnerList[i];
        if (runner instanceof JellySpeaker.KeyRunner){
            runner.setup(parent);
        }else if (runner instanceof JellySpeaker.SpeechRunner){
            runner.setup(parent);
        }else if (runner instanceof JellySpeaker.ScheduleRunner){
            runner.setup(parent);
        }else{
            //What?
        }
    }
};




/****************************************************************************************************
 *
 * POP - ICON MANAGER
 *
 ****************************************************************************************************/
JellySpeaker.PluginIconManager.prototype.makePopForIconManager = function(){
    var that = this;
    var parent = this.parent;
    var boxman = parent.boxman;
    var popman = parent.popman;
    var keyman = parent.keyman;
    var menuman = parent.menuman;

    /*************************
     * Make Pop - ICON-MANAGER
     *************************/
    var popElementForIconManager = popman.add(popman.new({
        id: JellySpeaker.PluginIconManager.POP_ICON_MANAGER,
        exp: '85%',
        closebyesc: true,
        closebyclickout: true,
        afterpop: function(data){
            parent.execEventListenerByEventName(JellySpeaker.PluginIconManager.EVENT_JELLYICONMANAGER_AFTERPOP, popElementForIconManager);
        }
    }));

    /*************************
     * Make Box
     *************************/
    var boxElement = boxman.newBox({id:JellySpeaker.PluginIconManager.BOX_ICON_LIST, width:'90%', height:'300px'});
    boxman.setBoxMode(JellySpeaker.PluginIconManager.BOX_ICON_LIST, {appendType:BoxMan.APPEND_TYPE_BETWEEN});

    getEl(popElementForIconManager)
        .setStyle('text-align', 'center')
        .setStyle('font-family', 'monospace')
        .add([
            getEl(boxElement)
                .setStyle('display', 'inline-block')
                .setStyle('text-align', 'left')
        ])
    ;

    /*************************
     * Make Obj - ICON
     *************************/
    for (var i=0, icon, objElement; i<parent.iconList.length; i++){
        icon = parent.iconList[i];
        if (!icon.modeVisible)
            continue;
        if (icon.modeSystem)
            continue;
        //- Make OBJ Element
        objElement = that.setupIcon(icon);
        getEl(objElement).appendTo(boxElement);
        popman.setPreview(objElement, {content:(icon.html+ ' ' + icon.title +' / '+ icon.command)});
        //- Set Runner
        that.setupRunner(icon);
    }

    /** Event **/
    parent.execEventListenerByEventName(JellySpeaker.PluginIconManager.EVENT_JELLYICONMANAGER_SETUP, popElementForIconManager);
};

JellySpeaker.PluginIconManager.prototype.makeContextMenuForIconManager = function(icon){
    var that = this;
    var parent = this.parent;
    var boxman = parent.boxman;
    var popman = parent.popman;
    var keyman = parent.keyman;
    var menuman = parent.menuman;
    /*************************
     * Make ContextMenu
     *************************/
    menuman.addMenuBoard('jelly-icon', [{'class':'*jelly*'}], ['icon-setup-runner', 'icon-enable', 'icon-disable', 'icon-delete']);
    menuman.addMenu('icon-setup-runner', 'Setup Runner', function(dbItem){
        var icon = that.getIcon(dbItem);
        that.currentSetupRunnerIcon = icon;
        popman.pop(JellySpeaker.PluginIconManager.POP_ICON_MANAGER_SETUP_RUNNER, function(data){

        });
        //OK =>
        // var somethingObject;
        // var icon = that.getIcon(dbItem);
        // icon.setupRunner(somethingObject);
        // console.error(icon);
    });
    menuman.addMenu('icon-enable', 'Enable', function(dbItem){
        var icon = that.getIcon(dbItem);
        icon.setModeEnable(true);
    });
    menuman.addMenu('icon-disable', 'Disable', function(dbItem){
        var icon = that.getIcon(dbItem);
        icon.setModeEnable(false);
    });
    menuman.addMenu('icon-delete', 'Delete', function(dbItem){
        var icon = that.getIcon(dbItem);
        popman.confirm('Are you sure to delete icon?' +icon.title, function(){
            that.removeIcon(dbItem);
            return true;
        });
    });
};




/****************************************************************************************************
 *
 * POP - SETUP RUNNER
 *
 ****************************************************************************************************/
JellySpeaker.PluginIconManager.prototype.makePopForSetupRunner = function(){
    var that = this;
    var parent = this.parent;
    var boxman = parent.boxman;
    var popman = parent.popman;
    var keyman = parent.keyman;
    var menuman = parent.menuman;

    var contextForSetupRunner = newEl('div').addClass('jelly-icon-manager-setup-runner').returnElement();
    var contextForTitle = newEl('div').html('<span class="label-pop">Runner</span>').style('text-align:left;').returnElement();
    var divForDescription = newEl('div').returnElement();
    var divListForKeyShortcutRunner = newEl('div').addClass('item-list').returnElement();
    var divListForKeyCommandRunner = newEl('div').addClass('item-list').returnElement();
    var divListForSpeechRunner = newEl('div').addClass('item-list').returnElement();
    var divListForScheduleRunner = newEl('div').addClass('item-list').returnElement();
    var contextForKeyShortcutRunner = newEl('div').html('<span class="label-list">ShortcutKey Runner</span>').style('display:inline-block; text-align:left; width:90%;').returnElement();
    var contextForKeyCommandRunner = newEl('div').html('<span class="label-list">CommandKey Runner</span>').style('display:inline-block; text-align:left; width:90%;').returnElement();
    var contextForSpeechRunner = newEl('div').html('<span class="label-list">Speech Runner</span>').style('display:inline-block; text-align:left; width:90%;').returnElement();
    var contextForScheduleRunner = newEl('div').html('<span class="label-list">Schedule Runner</span>').style('display:inline-block; text-align:left; width:90%;').returnElement();

    /*************************
     * Make Pop - ICON-MANAGER-SETUP-RUNNER
     *************************/
    var popElementForIconManagerSetupRunner = popman.add(popman.new({
        id: JellySpeaker.PluginIconManager.POP_ICON_MANAGER_SETUP_RUNNER,
        exp: '65%',
        closebyesc: true,
        closebyclickout: true,
        add: function(data){
        },
        afterpop: function(data){
            var icon = that.currentSetupRunnerIcon;
            //Runner Title
            getEl(divForDescription).html(icon.title);
            //Runner Item 구성
            getEl(divListForKeyShortcutRunner).html('');
            getEl(divListForKeyCommandRunner).html('');
            getEl(divListForSpeechRunner).html('');
            getEl(divListForScheduleRunner).html('');

            console.error(icon.runnerList);
            for (var i=0; i<icon.runnerList.length; i++){
                var runner = icon.runnerList[i];
                if (runner instanceof JellySpeaker.KeyRunner){
                    var inputElement = newEl('input', {'type':'text'}).returnElement();
                    keyman.addShortcutInput(inputElement);
                    keyman.setShortcutInputValue(inputElement, runner.keyList);
                    getEl(divListForKeyShortcutRunner).add(inputElement);
                }else if (runner instanceof JellySpeaker.SpeechRunner){
                    var inputElement = newEl('input', {'type':'text'}).value(runner.speechExpression).returnElement();
                    getEl(divListForSpeechRunner).add(inputElement);
                }else if (runner instanceof JellySpeaker.ScheduleRunner){
                    var inputElement = newEl('input', {'type':'text'}).value(runner.timeManExpression).returnElement();
                    getEl(divListForScheduleRunner).add(inputElement);
                }else{
                    //What?
                }
            }
        }
    }));

    getEl(popElementForIconManagerSetupRunner).style('text-align:center;').add([
        getEl(contextForSetupRunner).add([
            getEl(contextForTitle).add(divForDescription),
            newEl('div').add([
                newEl('button').html('+ShortcutKey').addEventListener('click', function(e){
                    getEl(divListForKeyShortcutRunner).add([
                        newEl('div').add( keyman.newShortcutInput() )
                    ]);
                }),
                newEl('button').html('+CommandKey').addEventListener('click', function(e){
                    getEl(divListForKeyCommandRunner).add([
                        newEl('div').add( keyman.newCommandInput() )
                    ]);
                }),
                newEl('button').html('+Speech').addEventListener('click', function(e){
                    getEl(divListForSpeechRunner).add([
                        newEl('div').add( newEl('input') )
                    ]);
                }),
                newEl('button').html('+Schedule').addEventListener('click', function(e){
                    getEl(divListForScheduleRunner).add([
                        newEl('div').add( newEl('input') )
                    ]);
                })
            ]),
            getEl(contextForKeyShortcutRunner).add([divListForKeyShortcutRunner]),
            getEl(contextForKeyCommandRunner).add([divListForKeyCommandRunner]),
            getEl(contextForSpeechRunner).add([divListForSpeechRunner]),
            getEl(contextForScheduleRunner).add([divListForScheduleRunner]),
            newEl('div').style('display:inline-block; text-align:center; width:90%;').add([
                newEl('button').html('O').style('width:200px; height:50px;').addEventListener('click', function(e){
                    that.saveToStorage(that.currentSetupRunnerIcon);
                    popman.close(popElementForIconManagerSetupRunner);
                }),
                newEl('button').html('X').style('width:200px; height:50px;').addEventListener('click', function(e){
                    popman.close(popElementForIconManagerSetupRunner);
                })
            ])
        ])
    ]);
};










/**************************************************
 *
 * CHECKER - SETUP RUNNER
 *
 **************************************************/
JellySpeaker.PluginIconManager.prototype.checkIconUrl = function(icon, callback){
    var that = this;
    this.checkUrl(icon.url, function(event, elapsedTime){
        //- Check Status
        if ((status != 404 && event.currentTarget.status != 0) || (event.currentTarget.status == 0 && elapsedTime < 1000)){
            icon.status = JellySpeaker.Icon.STATUS_ON;
        }else{
            icon.status = JellySpeaker.Icon.STATUS_OFF;
        }
        if (callback)
            callback(icon);
    });
};
JellySpeaker.PluginIconManager.prototype.checkUrl = function(url, callback){
    var time = new Date().getTime();
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function(event){
        var elaspedTime = new Date().getTime() - time;
        console.log('Elasped Time => ', url, event.currentTarget.status, elaspedTime);
        if (callback)
            callback(event, elaspedTime);
    };
    http.send(null);
};
JellySpeaker.PluginIconManager.prototype.styleIcon = function(icon){
    var that = this;
    //- Style Status
    if (icon.lastStatus != icon.status){
        // console.log('CHECKING..', icon.url, event.currentTarget.status, icon.status, icon.objElement);
        // icon.execEvent('changestatus', icon.status);
        if (icon.objElement){
            getEl(icon.objElement).removeClass([that.classForIconStatusOn, that.classForIconStatusOff]);
            if (icon.status == JellySpeaker.Icon.STATUS_ON){
                // console.error('ON');
                getEl(icon.objElement).addClass(that.classForIconStatusOn);
            }else if (icon.status == JellySpeaker.Icon.STATUS_OFF){
                // console.error('OFF');
                getEl(icon.objElement).addClass(that.classForIconStatusOff);
            }else if (icon.status == JellySpeaker.Icon.STATUS_PENDING){
                // console.error('OFF');
                getEl(icon.objElement).addClass(that.classForIconStatusOff);
            }
        }
    }
    icon.lastStatus = icon.status;
};




/**************************************************
 *
 * Position ShortcutKey
 *
 **************************************************/
JellySpeaker.PluginIconManager.prototype.showPositionShorcutKey = function(){
    var that = this;
    var parent = this.parent;
    var highestZIndex = getData().findHighestZIndex();
    for (var i=0, icon, order=0; i<parent.iconList.length; i++){
        icon = parent.iconList[i];
        if (!icon.objElement)
            continue;
        if (++order > 9)
            break;
        var clientRect = getEl(icon.objElement).getBoundingClientRect();
        var scrollX = getEl().getBodyScrollX();
        var scrollY = getEl().getBodyScrollY();
        var elementForPositionShortcutKey = newEl('div').html(order == 10 ? 0 : order)
            .addClass('jelly-plugin-icon-manager-position-shortcut')
            .setStyle('position', 'absolute')
            .setStyle('left', (clientRect.left +scrollX -(10))+ 'px')
            .setStyle('top', (clientRect.top +scrollY +(clientRect.height/8))+ 'px')
            .setStyle('zIndex', highestZIndex)
            .returnElement();
        that.elementForPositionShortcutKeyList.push(elementForPositionShortcutKey);
        getEl(document.body).add(elementForPositionShortcutKey);

        //- Show KeyRunner
        // var runnerList = icon.getKeyRunnerList();
        // for (var jj=0, runner; jj<runnerList.length; jj++){
        //     runner = runnerList[jj];
        //     var elementForRunner = newEl('div').html(runner.getExpression())
        //         .addClass('jelly-plugin-icon-manager-key-runner')
        //         .setStyle('position', 'absolute')
        //         .setStyle('left', (clientRect.left -(10))+ 'px')
        //         .setStyle('top', (clientRect.top +(clientRect.height/8) +30)+ 'px')
        //         .setStyle('zIndex', highestZIndex)
        //         .returnElement();
        //     getEl(document.body).add(elementForRunner);
        // }
        // // console.error(icon.objElement, clientRect);
        //
        // //- Show ScheduleRunner
        // var runnerList = icon.getScheduleRunnerList();
        // for (var jj=0, runner; jj<runnerList.length; jj++){
        //     runner = runnerList[jj];
        //     var elementForRunner = newEl('div').html(runner.getRemainingTime())
        //         .addClass('jelly-plugin-icon-manager-key-runner')
        //         .setStyle('position', 'absolute')
        //         .setStyle('left', (clientRect.left -(10))+ 'px')
        //         .setStyle('top', (clientRect.top +(clientRect.height/8) +30)+ 'px')
        //         .setStyle('zIndex', highestZIndex)
        //         .returnElement();
        //     getEl(document.body).add(elementForRunner);
        // }
    }
};
JellySpeaker.PluginIconManager.prototype.hidePositionShortcutKey = function(){
    var that = this;
    var parent = this.parent;
    for (var i=0, elemenetForPositionShortcut; i<this.elementForPositionShortcutKeyList.length; i++){
        elemenetForPositionShortcut = this.elementForPositionShortcutKeyList[i];
        getEl(elemenetForPositionShortcut).removeFromParent();
    }
    this.elementForPositionShortcutKeyList = [];
};






















/**************************************************
 *
 * SAVE & LOAD
 *
 **************************************************/
JellySpeaker.PluginIconManager.prototype.saveIcon = function(){
    this.saveCustomShortcutList();
    this.resetIcon();
    return this;
};
JellySpeaker.PluginIconManager.prototype.resetIcon = function(){
    this.clearCustomShortcutList();
    this.loadCustomShortcutList();
    return this;
};



JellySpeaker.PluginIconManager.prototype.saveCustomShortcutList = function(){
    var that = this;
    var parent = that.parent;

    var dataToSave = {
        iconMap: {}
    };

    //- Make data to save
    for (var i=0, icon, iconDataToSave; i<parent.iconList.length; i++){
        icon = parent.iconList[i];
        if (icon.modeSystem)
            continue;
        //필요없는 필드 삭제
        iconDataToSave = dataToSave.iconMap[icon.id] = {};
        Object.assign(iconDataToSave, icon);
        delete iconDataToSave.parent;
        delete iconDataToSave.objElement;
        for (var j=0, runner; j<iconDataToSave.runnerList.length; j++){
            runner = iconDataToSave.runnerList[j];
            delete runner.parent;
        }
    }

    //- Save data
    console.log('save data', dataToSave);
    storageman.set(parent.storagePath, dataToSave);
};
JellySpeaker.PluginIconManager.prototype.loadCustomShortcutList = function(){
    var that = this;
    var parent = that.parent;

    //- Load data
    var dataToLoad = storageman.get(parent.storagePath);
    console.log('load data', dataToLoad);
    return;

    //- Make
    var iconMap = dataToLoad.iconMap;
    for (var iconId in iconMap){
        var icon = iconMap[iconId];
        parent.userIconMap[iconId] = icon;
    }

    //- Setup Icon
    for (var i=0, icon; i<parent.iconList.length; i++){
        icon = parent.iconList[i];
        //- Setup Runner
        var runnerList = icon.runnerList;
        for (var ii=0, runner; ii<runnerList.length; ii++){
            runner = runnerList[ii];
            if (runner instanceof JellySpeaker.KeyRunner){
                runner.setupShortcut(parent);
            }else if (runner instanceof JellySpeaker.SpeechRunner){
                runner.setupSpeech(parent);
            }else if (runner instanceof JellySpeaker.ScheduleRunner){
                runner.setupSchedule(parent);
            }else{
                //What?
            }
        }
    }
};
JellySpeaker.PluginIconManager.prototype.clearCustomShortcutList = function(){
    var that = this;
    var parent = that.parent;
    //Clear Obj
    boxman.clearBox(JellySpeaker.PluginIconManager.BOX_ICON_LIST);
    //Clear Runner
    for (var i=0, icon; i<parent.iconList.length; i++){
        icon = parent.iconList[i];
        var runnerList = icon.runnerList;
        for (var ii=0, runner; ii<runnerList.length; ii++){
            runner = runnerList[ii];
            if (runner instanceof JellySpeaker.KeyRunner){
                this.delShortcut(runner.key)
            }else if (runner instanceof JellySpeaker.SpeechRunner){
                this.delSpeech();
            }else if (runner instanceof JellySpeaker.ScheduleRunner){
                this.delSchedule();
            }else{
                //What?
            }
        }
    }
};



JellySpeaker.PluginIconManager.prototype.setupShortcut = function(key){
    keyman.addShortcut(key);
};
JellySpeaker.PluginIconManager.prototype.setupSpeech = function(key){

};
JellySpeaker.PluginIconManager.prototype.setupSchedule = function(key){

};

JellySpeaker.PluginIconManager.prototype.delShortcut = function(key){
    keyman.delShortcut(key);
};
JellySpeaker.PluginIconManager.prototype.delSpeech = function(key){

};
JellySpeaker.PluginIconManager.prototype.delSchedule = function(key){

};







