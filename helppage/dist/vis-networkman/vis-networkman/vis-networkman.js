/****************************************************************************************************
 *
 * Draw Graph ... using VIS-NETWORK
 *
 ****************************************************************************************************/
function VisNetworkMan(option){
    this.visNetwork = null;
    this.toggleman = new VisNetworkMan.ToggleMan();

    this.globalOption = {
        extendsOption: {
            container: null,
            //Option
            modeCloneNodeWhenDuplicateLink: false,
            modeUniqueDataInSameGroup: false,
            modeUniqueData: false,
            modeOrderByGroup: true,
            modePruneNodeWithoutEdge: true,
            modePruneNodeNotToRootGroup: true,
            modePointAllSubLink: false,
            modeSelectAllSubLink: false,
            modeExtendsPanel: false,
            modeExtendsPanelAutoHide: false,
            modeExtendsPanelSaveToLocalStorage: false,
            //Save
            saveKey: null,
            //ExtendsPanel
            extendsPanelToggleDefaultIndexMap:{
                'direction':0,
                'directionMethod':0,
                'duplication':0,
                'unification':0,
                'edgeLimit':4
            },
            extendsPanelShowItemList:null, //- ExampleForAll) null   //- ExampleForNothing) []   //- ExampleForSelective) ['direction', 'edgeLimit']
            extendsPanelHideItemList:null, //- ExampleForNothing) null or []   //- ExampleForSelective) ['direction', 'edgeLimit']
            //Event-Function
            funcEventSetupNode: null,
            funcEventSetupEdge: null,
            funcEventAfterRender: null,
            funcEventClickNode: null,
            funcEventDoubleClickNode: null,
            funcEventDragNodeOverDistance: null,
            funcForCustomExtendsPanel: function(panel, visnetman){
                //Add element to panel to add custom toggle-button
                //And use visnetman.toggleman to make toggle-button
            },
            //Etc
            maxDistanceWhenDragNode: null,
            maxChildNodeCount: 5,
            orderList: null,
            //Effect
            nodeWhenStart: null,
            edgeWhenStart: null,
            nodeWhenPoint: null,
            edgeWhenPoint: null,
            nodeWhenSelect: null,
            edgeWhenSelect: null
        }
    };

    //Default VisOptions
    VisNetworkMan.mergeIntoOption(this.globalOption, this.makeVisDefaultOptions());

    // Lastest UserSet Data
    this.cachedDataWhenLastUserSetup = {
        option: null,
        nodeDataList: null,
        container: null
    };

    // Lastest Render Data
    this.cachedDataWhenStartRendering = {
        option: null,
        nodeDataList: null,
        edgeData: null,
        nodeData: null
    };

    // Lastest Working
    this.cachedDataWhenAfterWorking = {
        option: null,
        nodeDataList: null,
        nodeData: null,
        edgeData: null,
        // selectingNodeData: null
    };

    //Status
    this.document = document;
    this.statusMouseover = false;

    // Pointing and Selecting
    this.nodeEffectDataListMap = {};
    this.edgeEffectDataListMap = {};
    this.pointingNodeList = [];
    this.pointedNodeMap = {};
    this.pointedEdgeMap = {};
    this.selectingNodeList = [];
    this.selectedNodeMap = {};
    this.selectedEdgeMap = {};

    //Merge GlobalOptions
    if (option)
        this.setup(option);
}
VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON = 'visnetwork-man-extendpanel-option-button';
VisNetworkMan.CLASS_EXTENDPANEL_OPTION_SELECT = 'visnetwork-man-extendpanel-option-select';
VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_BUTTON = 'visnetwork-man-extendpanel-zoom-button';
VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_RANGE = 'visnetwork-man-extendpanel-zoom-range';
VisNetworkMan.EFFECT_TYPE_POINT = 'point';
VisNetworkMan.EFFECT_TYPE_SELECT = 'select';





/**************************************************
 * Setup
 **************************************************/
VisNetworkMan.prototype.setup = function(options){
    VisNetworkMan.mergeIntoOption(this.globalOption, options);
    //to CachedData
    VisNetworkMan.mergeIntoOption(this.cachedDataWhenLastUserSetup.option, options);
    if (this.cachedDataWhenLastUserSetup.option)
        this.mergeExtendsOptionToCorrectProperty(this.cachedDataWhenLastUserSetup.option);
    //to CachedData
    VisNetworkMan.mergeIntoOption(this.cachedDataWhenStartRendering.option, options);
    if (this.cachedDataWhenStartRendering.option)
        this.mergeExtendsOptionToCorrectProperty(this.cachedDataWhenStartRendering.option);
    //to CachedData
    VisNetworkMan.mergeIntoOption(this.cachedDataWhenAfterWorking.option, options);
    if (this.cachedDataWhenAfterWorking.option)
        this.mergeExtendsOptionToCorrectProperty(this.cachedDataWhenAfterWorking.option);
    return this;
};
VisNetworkMan.prototype.setupExtendsOption = function(extendsOption){
    VisNetworkMan.mergeIntoOption(this.globalOption.extendsOption, extendsOption);
    //to CachedData
    if (this.cachedDataWhenLastUserSetup.option)
        VisNetworkMan.mergeIntoOption(this.cachedDataWhenLastUserSetup.option.extendsOption, extendsOption);
    //to CachedData
    if (this.cachedDataWhenStartRendering.option)
        VisNetworkMan.mergeIntoOption(this.cachedDataWhenStartRendering.option.extendsOption, extendsOption);
    //to CachedData
    if (this.cachedDataWhenAfterWorking.option)
        VisNetworkMan.mergeIntoOption(this.cachedDataWhenAfterWorking.option.extendsOption, extendsOption);
    return this;
};
VisNetworkMan.prototype.setDocument = function(document){
    this.document = document;
    this.toggleman.setDocument(document);
    return this;
};
VisNetworkMan.prototype.setupExtendsPanel = function(funcForCustomExtendsPanel){
    this.globalOption.extendsOption.funcForCustomExtendsPanel = funcForCustomExtendsPanel;
    return this;
};
VisNetworkMan.prototype.seModeCloneNodeWhenDuplicateLink = function(mode){
    this.extendsOption.modeCloneNodeWhenDuplicateLink = mode;
    return this;
};
VisNetworkMan.prototype.setModeUniqueDataInSameGroup = function(mode){
    this.extendsOption.modeUniqueDataInSameGroup = mode;
    return this;
};
VisNetworkMan.prototype.setModeUniqueData = function(mode){
    this.extendsOption.modeUniqueData = mode;
    return this;
};
VisNetworkMan.prototype.setModeUniqueDataInSameGroup = function(mode){
    this.extendsOption.modeUniqueDataInSameGroup = mode;
    return this;
};
VisNetworkMan.prototype.setModeOrderByGroup = function(mode){
    this.extendsOption.modeOrderByGroup = mode;
    return this;
};
VisNetworkMan.prototype.cloneWithGlobalSetup = function(){
    return new VisNetworkMan(this.globalOption);
};



/**************************************************
 * Runner
 *  - dataList's field: id, parentId
 *  - able to options
 **************************************************/
VisNetworkMan.prototype.renderWithDataList = function(dataList, option){
    var nodeDataList = VisNetworkMan.makeNewNodeIdDataFromDataList(dataList);
    this.cachedDataWhenLastUserSetup = {
        dataList: VisNetworkMan.cloneObject(dataList),
        nodeDataList: VisNetworkMan.cloneObject(nodeDataList),
        option: VisNetworkMan.newMergeOptionAll(option),
    };
    return this.renderByFilter(nodeDataList, option);
};

/**************************************************
 * Runner by NodeDataList
 *  - nodeDataList's field: nodeId, parentNodeId
 **************************************************/
VisNetworkMan.prototype.renderWithNodeDataList = function(nodeDataList, option){
    nodeDataList = VisNetworkMan.makeNewNodeIdDataFromNodeDataList(nodeDataList);
    this.cachedDataWhenLastUserSetup = {
        nodeDataList: VisNetworkMan.cloneObject(nodeDataList),
        option: VisNetworkMan.newMergeOptionAll(option),
        // option: VisNetworkMan.cloneObject(option)
    };
    return this.renderByFilter(nodeDataList, option);
};

VisNetworkMan.prototype.reRenderByFilter = function(option){
    var cachedDataWhenLastUserSetup = this.cachedDataWhenLastUserSetup;
    var nodeDataList = VisNetworkMan.cloneObject(cachedDataWhenLastUserSetup.nodeDataList);
    var mergedOption = VisNetworkMan.newMergeOptionAll(cachedDataWhenLastUserSetup.option, option);
    mergedOption.container = cachedDataWhenLastUserSetup.container;
    mergedOption.container.innerHTML = '';
    return this.renderByFilter(nodeDataList, mergedOption);
};

VisNetworkMan.prototype.renderByFilter = function(nodeDataList, option){
    /** Validate **/
    //- Check Data
    if (!nodeDataList || nodeDataList.length == 0)
        return this.makeAlertDiv('No Datas', 50);
    /** Setup - Options **/
    option = option ? option : {};
    var clonedOption = VisNetworkMan.cloneObject(option);
    //- Merge Option
    var mergedOption = VisNetworkMan.newMergeOptionAll(this.globalOption, option);
    //- Move ExtendsOption
    this.mergeExtendsOptionToCorrectProperty(mergedOption);
    /** Setup - ExtendsPanel **/
    var extendsPpanel;
    if (mergedOption.extendsOption.modeExtendsPanel){
        //- Make ExtendsPanel
        extendsPpanel = this.makeExtendsPanelForOption(mergedOption);
        (mergedOption.extendsOption.funcForCustomExtendsPanel && mergedOption.extendsOption.funcForCustomExtendsPanel(extendsPpanel, this));
        if (mergedOption.extendsOption.extendsPanelToggleDefaultIndexMap){
            this.toggleman.mergeIntoToggleIndexMap(mergedOption.extendsOption.extendsPanelToggleDefaultIndexMap)
        }
        /** Load SavedData **/
            //- Load Option
        var savedOption = this.toggleman
                .setModeSave(mergedOption.extendsOption.modeExtendsPanelSaveToLocalStorage)
                .setSaveKey(mergedOption.extendsOption.saveKey)
                .loadToggleDataFromLocalStorage()
                .getAllToggledDataList();
        //Refresh
        this.toggleman.refresh();
        mergedOption = VisNetworkMan.newMergeOptionAll(mergedOption, savedOption);
        this.mergeExtendsOptionToCorrectProperty(mergedOption);
    }
    /** Filtering **/
    //- Setup OrderList
    if (mergedOption.extendsOption.modeOrderByGroup || !(mergedOption.extendsOption.orderList instanceof Array && mergedOption.extendsOption.orderList.length > 0))
        mergedOption.extendsOption.orderList = VisNetworkMan.makeOrderByGroup(nodeDataList);
    // console.log('MergedOption: ', mergedOption);
    // console.log(extendsOption);
    //- Filter
    VisNetworkMan.filterGroupOrderly(nodeDataList, mergedOption);
    VisNetworkMan.filterPruningNodeWithoutEdge(nodeDataList, mergedOption);
    /** Make - EdgeDataList **/
    var edgeDataList = VisNetworkMan.makeEdgeDataList(nodeDataList);
    /** Event - setup node by node **/
    if (mergedOption.extendsOption.nodeWhenStart){
        for (var i=0; i<nodeDataList.length; i++){
            VisNetworkMan.mergeIntoOption(nodeDataList[i], mergedOption.extendsOption.nodeWhenStart);
        }
    }
    if (mergedOption.extendsOption.funcEventSetupNode){
        for (var i=0; i<nodeDataList.length; i++){
            mergedOption.extendsOption.funcEventSetupNode(nodeDataList[i]);
        }
    }
    /** Event - setup edge by edge **/
    if (mergedOption.extendsOption.edgeWhenStart){
        for (var i=0; i<edgeDataList.length; i++){
            VisNetworkMan.mergeIntoOption(edgeDataList[i], mergedOption.extendsOption.edgeWhenStart);
        }
    }
    if (mergedOption.extendsOption.funcEventSetupEdge){
        for (var i=0; i<edgeDataList.length; i++){
            mergedOption.extendsOption.funcEventSetupEdge(edgeDataList[i]);
        }
    }
    /** Render **/
        //- Make Container Element
    var container = (mergedOption.extendsOption.container) ? mergedOption.extendsOption.container : this.makeContainer();
    this.cachedDataWhenLastUserSetup.container = container;
    //- Render
    console.log('Try to redder!!');
    console.log('  - Check nodeDataList:', nodeDataList);
    console.log('  - Check edgeDataList:', edgeDataList);
    console.log('  - Check mergedOption:', mergedOption);
    var network = this.render(container, nodeDataList, edgeDataList, mergedOption);
    console.log('Complete rendder!!');
    /** Event - after render **/
    (mergedOption.extendsOption.funcEventAfterRender && mergedOption.extendsOption.funcEventAfterRender(network));
    /** Event **/
    this.setupEvent(network, mergedOption.extendsOption);
    if (extendsPpanel){
        var that = this;
        container.firstChild.insertBefore(extendsPpanel, container.firstChild.firstChild);
        if (mergedOption.extendsOption.modeExtendsPanelAutoHide){
            container.addEventListener('mousemove', function(e){
                if (extendsPpanel.style.display != 'block')
                    extendsPpanel.style.display = 'block';
                that.statusMouseover = true;
            });
            container.addEventListener('mouseout', function(e){
                that.statusMouseover = false;
                extendsPpanel.style.display = 'none';
            });
            extendsPpanel.style.display = (that.statusMouseover) ? 'block' : 'none';
        }
    }
    return container;
};

VisNetworkMan.prototype.render = function(container, nodeDataList, edgeDataList, option){
    if (!option)
        option = Object.assign({}, this.globalOption);
    // provide the data in the vis format
    var data = {
        nodes:new vis.DataSet(nodeDataList),
        edges:new vis.DataSet(edgeDataList)
    };
    // initialize your network!
    var clonedObject = VisNetworkMan.cloneObject(option);
    delete clonedObject.extendsOption;
    var network = this.visNetwork = new vis.Network(container, data, clonedObject);
    // here you init the addEdge mode
    // network.addEdgeMode();
    //- Add ParentEdgeIdList
    for (var i=0, edge; i<edgeDataList.length; i++){
        edge = edgeDataList[i];
        edge.toNode.parentEdgeIdList.push(edge.id);
    }
    //- Cache Starting-Data
    this.cachedDataWhenStartRendering = {
        option: VisNetworkMan.cloneObject(option),
        nodeDataList: VisNetworkMan.cloneObject(nodeDataList),
        nodeData: VisNetworkMan.cloneObject(this.visNetwork.nodesHandler.body.data.nodes._data),
        edgeData: VisNetworkMan.cloneObject(this.visNetwork.nodesHandler.body.data.edges._data),
    };
    //- Cache AfterWorking-Data
    this.cachedDataWhenAfterWorking = {
        option: option,
        nodeDataList: nodeDataList,
        nodeData: this.visNetwork.nodesHandler.body.data.nodes._data,
        edgeData: this.visNetwork.nodesHandler.body.data.edges._data,
    };
    return network;
};



VisNetworkMan.prototype.mergeExtendsOptionToCorrectProperty = function(option){
    if (!option.extendsOption)
        option.extendsOption = {};
    for (var key in this.globalOption.extendsOption){
        option.extendsOption[key] = option.hasOwnProperty(key) ? option[key] : option.extendsOption[key];
        delete option[key];
    }
    return this;
}




/***************************************************************************
 *
 * Extension Panel
 *
 ***************************************************************************/
VisNetworkMan.EXTENDSPANEL_TOGGLE_DIRECTION = 'direction';
VisNetworkMan.EXTENDSPANEL_TOGGLE_DIRECTIONMETHOD = 'directionMethod';
VisNetworkMan.EXTENDSPANEL_TOGGLE_DUPLICATION = 'duplication';
VisNetworkMan.EXTENDSPANEL_TOGGLE_UNIFICATION = 'unification';
VisNetworkMan.EXTENDSPANEL_TOGGLE_EDGELIMIT = 'edgeLimit';
VisNetworkMan.EXTENDSPANEL_TOGGLE_POPWINDOW = 'popWindow';
VisNetworkMan.EXTENDSPANEL_TOGGLE_ZOOM = 'zoom';

VisNetworkMan.prototype.makeExtendsPanelForOption = function(option){
    var that = this;
    var toggleman = this.toggleman;

    /** Button - option **/
    var buttonForOptionUnification = this.document.createElement('button');
    buttonForOptionUnification.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    var buttonForOptionDuplication = this.document.createElement('button');
    buttonForOptionDuplication.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    var buttonForOptionDirection = this.document.createElement('button');
    buttonForOptionDirection.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    var buttonForOptionDirectionMethod = this.document.createElement('button');
    buttonForOptionDirectionMethod.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    /** SELECT - option **/
    var selectForOptionEdgeLimit = this.document.createElement('select');
    selectForOptionEdgeLimit.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_OPTION_SELECT);

    /** Button - Zoom **/
    var inputForZoom = this.inputForZoom = this.document.createElement('input');
    inputForZoom.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_RANGE);
    inputForZoom.style.width = '50px';
    inputForZoom.style.cursor = 'pointer';
    inputForZoom.setAttribute('type', "range");
    inputForZoom.setAttribute('min', "0.1");
    inputForZoom.setAttribute('max', "3");
    inputForZoom.setAttribute('step', ".05");
    inputForZoom.setAttribute('value', "1");
    inputForZoom.addEventListener('input', function(e){
        that.visNetwork.moveTo({scale:e.target.value});
    });
    inputForZoom.addEventListener('change', function(e){
        that.visNetwork.moveTo({scale:e.target.value, animation:true});
    });
    var buttonForZoomIn = this.document.createElement('button');
    buttonForZoomIn.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_BUTTON);
    buttonForZoomIn.innerHTML = '+';
    buttonForZoomIn.style.display = 'inline-block';
    buttonForZoomIn.style.width = '30px';
    buttonForZoomIn.style.height = '30px';
    buttonForZoomIn.style.borderRadius = '20px';
    buttonForZoomIn.style.cursor = 'pointer';
    buttonForZoomIn.addEventListener('click', function(e){
        inputForZoom.value = that.visNetwork.getScale() +0.05;
        that.trigger(inputForZoom, 'change');
    });
    var buttonForZoomOut = this.document.createElement('button');
    buttonForZoomOut.classList.add(VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_BUTTON);
    buttonForZoomOut.innerHTML = '-';
    buttonForZoomOut.style.display = 'inline-block';
    buttonForZoomOut.style.width = '30px';
    buttonForZoomOut.style.height = '30px';
    buttonForZoomOut.style.borderRadius = '20px';
    buttonForZoomOut.style.cursor = 'pointer';
    buttonForZoomOut.addEventListener('click', function(e){
        inputForZoom.value = that.visNetwork.getScale() -0.05;
        that.trigger(inputForZoom, 'change');
    });

    /** New PopWindow **/
    var buttonForNewWindow = this.document.createElement('button');
    buttonForNewWindow.innerHTML = 'Pop Window';
    buttonForNewWindow.addEventListener('click', function(e){
        var popWindow = window.open("", "VIS_WINDOW", "width=910, height=550, scrollbars=no");
        function resizeMain(){
            try{
                var body = popWindow.document.body;
                body.width = (popWindow.innerWidth +'px');
                body.height = (popWindow.innerHeight +'px');
                body.style.width = body.width;
                body.style.height = body.height;
                console.log('resize - window-for-vis', body.width, body.height);
            }catch(e){
                console.error(e);
            }
        }
        popWindow.addEventListener("resize", function(){
            resizeMain();
        });
        window.addEventListener('unload', function(){
            if (popWindow && !popWindow.closed){
                popWindow.close();
            }
        });
        var clonedOption = VisNetworkMan.newMergeOption(that.cachedDataWhenStartRendering.option, {
            height: '100%',
            width: '100%',
            extendsOption:{
                container:null,
                saveKey:null,
                extendsPanelShowItemList:[VisNetworkMan.EXTENDSPANEL_TOGGLE_ZOOM]
            }
        });
        var container = new VisNetworkMan().setup(clonedOption).setDocument(popWindow.document).renderWithNodeDataList(that.cachedDataWhenLastUserSetup.nodeDataList);
        popWindow.document.body.style.margin = '0px';
        popWindow.document.body.appendChild(container);
    });

    var extendsPanelShowItemList = option.extendsOption.extendsPanelShowItemList;
    var extendsPanelHideItemList = option.extendsOption.extendsPanelHideItemList;
    //- Panel For Buttons
    var panelForButtons = this.document.createElement('div');
    panelForButtons.style.display = 'inline-block';
    //- ItemMap in Panel For Buttons
    var mapForPanelForButtons = {};
    mapForPanelForButtons[VisNetworkMan.EXTENDSPANEL_TOGGLE_DIRECTION] = buttonForOptionDirection;
    mapForPanelForButtons[VisNetworkMan.EXTENDSPANEL_TOGGLE_DIRECTIONMETHOD] = buttonForOptionDirectionMethod;
    mapForPanelForButtons[VisNetworkMan.EXTENDSPANEL_TOGGLE_DUPLICATION] = buttonForOptionDuplication;
    mapForPanelForButtons[VisNetworkMan.EXTENDSPANEL_TOGGLE_UNIFICATION] = buttonForOptionUnification;
    mapForPanelForButtons[VisNetworkMan.EXTENDSPANEL_TOGGLE_EDGELIMIT] = selectForOptionEdgeLimit;
    mapForPanelForButtons[VisNetworkMan.EXTENDSPANEL_TOGGLE_POPWINDOW] = buttonForNewWindow;
    for (var key in mapForPanelForButtons){
        if (extendsPanelShowItemList && extendsPanelShowItemList.length > -1 && extendsPanelShowItemList.indexOf(key) == -1)
            continue;
        if (extendsPanelHideItemList && extendsPanelHideItemList.indexOf(key) != -1)
            continue;
        //Add to Panel
        var element = mapForPanelForButtons[key];
        for (var i=0, element=((element instanceof Array)?element:[element]); i<element.length; i++){
            panelForButtons.appendChild(element[i]);
        }
    }

    //- Panel For Zoom
    var panelForZoom = this.document.createElement('div');
    panelForZoom.style.display = 'inline-block';
    //- ItemMap in Panel For Buttons
    var mapForPanelForZoom = {};
    mapForPanelForZoom[VisNetworkMan.EXTENDSPANEL_TOGGLE_ZOOM] = [buttonForZoomOut, inputForZoom, buttonForZoomIn];
    for (var key in mapForPanelForZoom){
        if (extendsPanelShowItemList && extendsPanelShowItemList.length > -1 && extendsPanelShowItemList.indexOf(key) == -1)
            continue;
        if (extendsPanelHideItemList && extendsPanelHideItemList.indexOf(key) != -1)
            continue;
        //Add to Panel
        var element = mapForPanelForZoom[key];
        for (var i=0, element=((element instanceof Array)?element:[element]); i<element.length; i++){
            panelForZoom.appendChild(element[i]);
        }
    }

    //- Panel For Before
    var panelForBefore = this.document.createElement('div');
    panelForBefore.style.display = 'inline-block';

    //- Panel For After
    var panelForAfter = this.document.createElement('div');
    panelForAfter.style.display = 'inline-block';

    /** Panel - top-sticker **/
    var panel = this.document.createElement('div');
    panel.style.position = 'absolute';
    // panel.style.left = '0px';
    // panel.style.top = '0px';
    panel.style.zIndex = 1000;
    panel.style.display = 'block';
    panel.style.textAlign = 'right';
    panel.style.width = '100%';
    panel.style.height = '1px';
    // panel.style.border = '1px solid black';
    panel.appendChild(panelForButtons);
    panel.appendChild(this.document.createElement('br'));
    panel.appendChild(panelForBefore);
    panel.appendChild(this.document.createElement('br'));
    panel.appendChild(panelForZoom);
    panel.appendChild(this.document.createElement('br'));
    panel.appendChild(panelForAfter);
    this.panelForButtons = panelForButtons;
    this.panelForBefore = panelForBefore;
    this.panelForZoom = panelForZoom;
    this.panelForAfter = panelForAfter;

    /** Toggle Manager **/
    toggleman.setToggleData(VisNetworkMan.EXTENDSPANEL_TOGGLE_UNIFICATION, buttonForOptionUnification, {
        'No Unify': {extendsOption:{modeUniqueDataInSameGroup: false, modeUniqueData: false}},
        'Unify in Group': {extendsOption:{modeUniqueDataInSameGroup: true, modeUniqueData: false}},
        'Unify in All': {extendsOption:{modeUniqueDataInSameGroup: false, modeUniqueData: true}}
    });
    toggleman.setToggleData(VisNetworkMan.EXTENDSPANEL_TOGGLE_DUPLICATION, buttonForOptionDuplication, {
        'Dup X': {extendsOption:{modeCloneNodeWhenDuplicateLink: true}},
        'Dup O': {extendsOption:{modeCloneNodeWhenDuplicateLink: false}}
    });
    toggleman.setToggleData(VisNetworkMan.EXTENDSPANEL_TOGGLE_DIRECTION, buttonForOptionDirection, {
        'to ALL': {},
        'to UP': {
            layout: {
                improvedLayout:true,
                hierarchical: {
                    enabled: true,
                    sortMethod: "directed",
                    direction: "DU", //DU, UD, LR, RL
                    nodeSpacing: 200,
                    levelSeparation: 300,
                }
            },
            funcEventAfterRender: function(network){
                network.setOptions({physics: {enabled:false}});
            }
        },
        'to RIGHT': {
            layout: {
                improvedLayout:true,
                hierarchical: {
                    enabled: true,
                    sortMethod: "directed",
                    direction: "LR", //DU, UD, LR, RL
                    nodeSpacing: 200,
                    levelSeparation: 300,
                }
            },
            funcEventAfterRender: function(network){
                network.setOptions({physics: {enabled:false}});
            }
        }
    });
    toggleman.setToggleData(VisNetworkMan.EXTENDSPANEL_TOGGLE_DIRECTIONMETHOD, buttonForOptionDirectionMethod, {
        'Direction': {},
        'Hubsize': {
            layout: {
                hierarchical: {
                    sortMethod: "hubsize"
                }
            }
        }
    });
    toggleman.setToggleData(VisNetworkMan.EXTENDSPANEL_TOGGLE_EDGELIMIT, selectForOptionEdgeLimit, {
        '10x': {extendsOption:{maxChildNodeCount:10}},
        '9x': {extendsOption:{maxChildNodeCount:9}},
        '8x': {extendsOption:{maxChildNodeCount:8}},
        '7x': {extendsOption:{maxChildNodeCount:7}},
        '6x': {extendsOption:{maxChildNodeCount:6}},
        '5x': {extendsOption:{maxChildNodeCount:5}},
        '4x': {extendsOption:{maxChildNodeCount:4}},
        '3x': {extendsOption:{maxChildNodeCount:3}},
        '2x': {extendsOption:{maxChildNodeCount:2}},
        '1x': {extendsOption:{maxChildNodeCount:1}}
    });
    // toggleman.setToggleData(VisNetworkMan.EXTENDSPANEL_TOGGLE_ZOOM, inputForZoom, function(value){
    //
    // });
    toggleman.onaftertoggle = function(data){
        toggleman.saveToggleDataToLocalStorage();
        that.reRenderByFilter( toggleman.getAllToggledDataList() );
    };
    toggleman.refresh();
    return panel;
};





/***************************************************************************
 *
 * UTIL - ToggleMan
 *
 ***************************************************************************/
VisNetworkMan.ToggleMan = function(){
    this.toggleNameAndItemListMap = {};
    this.toggleNameAndItemDataMap = {};
    this.toggleNameAndItemFunctionMap = {};
    this.toggleNameAndIndexMap = {};
    this.onbeforetoggle = function(){};
    this.onaftertoggle = function(){};
    this.modeSave = false;
    this.saveKey = VisNetworkMan.ToggleMan.SAVE_DEFAULT_NAME;
    this.document = document;
};
VisNetworkMan.ToggleMan.CLASS_TOGGLE_ON = 'toggle-on';
VisNetworkMan.ToggleMan.CLASS_TOGGLE_OFF = 'toggle-off';
VisNetworkMan.ToggleMan.SAVE_DEFAULT_NAME = '/toggleman/visnetworkman/';
VisNetworkMan.ToggleMan.prototype.setDocument = function(document){
    this.document = document;
    return this;
};
VisNetworkMan.ToggleMan.prototype.setToggleData = function(toggleName, item, data){
    var that = this;
    item = (item instanceof Array) ? item : [item];
    //Check
    for (var i=0; i<item.length; i++){
        if (typeof item[i] == 'string'){
            item[i] = document.getElementById(item[i]);
        }
    }
    this.toggleNameAndItemListMap[toggleName] = item;
    this.toggleNameAndItemDataMap[toggleName] = data;
    if (this.toggleNameAndIndexMap[toggleName] === null || this.toggleNameAndIndexMap[toggleName] === undefined)
        this.toggleNameAndIndexMap[toggleName] = 0;
    for (var i=0, it; i<item.length; i++){
        it = item[i];
        //Setup - Element
        switch (it.tagName.toUpperCase()){
            case 'BUTTON':
                break;
            case 'SELECT':
                if (typeof data == 'object'){
                    var keys = Object.keys(data);
                    for (var i=0, labelText; i<keys.length; i++){
                        labelText = keys[i];
                        var optionElement = this.document.createElement('option');
                        optionElement.value = i;
                        optionElement.innerHTML = labelText;
                        it.appendChild(optionElement);
                    }
                }
                break;
            default:
                break;
        }
        //Setup - Event
        that.setupToggleEvent(it, toggleName);
    }
    return this;
};
VisNetworkMan.ToggleMan.prototype.getToggleItem = function(toggle){
    var toggleElement = null;
    var toggleName = null;
    if (typeof toggle == 'string'){
        toggleName = toggle;
        toggleElement = this.toggleNameAndItemListMap[toggleName][0];
    }else if (toggle instanceof Element){
        toggleElement = toggle;
    }
    return toggleElement;
};
VisNetworkMan.ToggleMan.prototype.getToggleName = function(toggle){
    var toggleElement = null;
    var toggleName = null;
    if (typeof toggle == 'string'){
        toggleName = toggle;
    }else if (toggle instanceof Element){
        toggleElement = toggle;
        for (var toggleName in this.toggleNameAndItemListMap){
            var itemList = this.toggleNameAndItemListMap[toggleName];
            var foundIndex = itemList.indexOf(toggleElement);
            if (foundIndex != -1)
                return toggleName;
        }
    }
    return toggleName;
};
VisNetworkMan.ToggleMan.prototype.setToggleFunction = function(toggleName, func){
    func = (func instanceof Array) ? func : [func];
    this.toggleNameAndItemFunctionMap[toggleName] = func;
    return this;
};
VisNetworkMan.ToggleMan.prototype.setupToggleEvent = function(item){
    var that = this;
    switch (item.tagName.toUpperCase()){
        case 'BUTTON':
            item.addEventListener('click', function(event){
                that.toggle(item);
            });
            item.addEventListener('mousewheel', function(event){
                var x = (event.deltaX ? event.deltaX : event.wheelDeltaX) /5;
                var y = (event.deltaY ? event.deltaY : event.wheelDeltaY) /5;
                if (y < 0){
                    that.toggleBefore(item);
                }else if (y > 0){
                    that.toggleNext(item);
                }
            });
            break;
        case 'INPUT':
            if (item.type){
                switch (item.type.toUpperCase()){
                    case 'RANGE':
                        item.addEventListener('mousewheel', function(event){
                            var x = (event.deltaX ? event.deltaX : event.wheelDeltaX) /5;
                            var y = (event.deltaY ? event.deltaY : event.wheelDeltaY) /5;
                            // if (y < 0){
                            //     that.toggleBefore(item);
                            // }else if (y > 0){
                            //     that.toggleNext(item);
                            // }
                        });
                        break;
                    default:
                        break;
                }
            }
            break;
        case 'SELECT':
            item.addEventListener('change', function(event){
                that.toggle(item, item.value);
            });
            item.addEventListener('mousewheel', function(event){
                var x = (event.deltaX ? event.deltaX : event.wheelDeltaX) /5;
                var y = (event.deltaY ? event.deltaY : event.wheelDeltaY) /5;
                if (y < 0){
                    that.toggleBefore(item);
                }else if (y > 0){
                    that.toggleNext(item);
                }
            });
            break;
        default:
            break;
    }

};
VisNetworkMan.ToggleMan.prototype.setToggleRadio = function(toggleName, item, data){
    this.toggleNameAndItemListMap = (item instanceof Array) ? item : [item];
    this.toggleNameAndItemDataMap = data;
    return this;
};
VisNetworkMan.ToggleMan.prototype.toggle = function(toggleObject, selectedIndex, modeWithEvent){
    var that = this;
    var toggleName = this.getToggleName(toggleObject);
    var modeWithEvent = (modeWithEvent == false) ? false : true;
    if (toggleName){
        //Check
        var itemList = this.toggleNameAndItemListMap[toggleName];
        var currentIndex = this.toggleNameAndIndexMap[toggleName];
        var data = this.toggleNameAndItemDataMap[toggleName];
        var currentData;
        var selectData;
        if (!itemList)
            return false;
        //GetIndex
        if (itemList.length == 1 && selectedIndex == null){
            return that.toggleNext(toggleName);
        }else{
            //TODO: 수치가 오버되면 계산하여 때리기..
            selectedIndex = ((selectedIndex != null) ? selectedIndex : 0);
        }
        //Event - BeforeToggle
        if (modeWithEvent){
            if (data instanceof Array){
                currentData = that.toggleNameAndItemDataMap[toggleName][currentIndex];
            }else if (typeof data == 'object'){
                var keys = Object.keys(data);
                var currentKey = keys[currentIndex];
                currentData = that.toggleNameAndItemDataMap[toggleName][currentKey];
            }
            that.onbeforetoggle(currentData);
        }
        //Toggle!
        this.toggleWithoutEvent(toggleObject, selectedIndex);
        //Event - AfterToggle
        if (modeWithEvent){
            if (data instanceof Array){
                selectData = that.toggleNameAndItemDataMap[toggleName][selectedIndex];
            }else if (typeof data == 'object'){
                var keys = Object.keys(data);
                var selectedKey = keys[selectedIndex];
                selectData = that.toggleNameAndItemDataMap[toggleName][selectedKey];
            }
            that.onaftertoggle(selectData);
        }
    }
};
VisNetworkMan.ToggleMan.prototype.toggleWithoutEvent = function(toggleObject, selectedIndex){
    var that = this;
    var toggleName = this.getToggleName(toggleObject);
    //Check
    var itemList = this.toggleNameAndItemListMap[toggleName];
    var currentIndex = this.toggleNameAndIndexMap[toggleName];
    var data = this.toggleNameAndItemDataMap[toggleName];
    //Length
    var labelList;
    var dataLength = -1;
    var itemLength = itemList.length;
    if (data instanceof Array){
        dataLength = (data.length == 1) ? 2 : data.length;
    }else if (typeof data == 'object'){
        labelList = Object.keys(data);
        dataLength = labelList.length;
    }
    //Select Index
    var currentItem = itemList[currentIndex];
    var selectedItemIndex = (itemLength <= selectedIndex) ? 0 : selectedIndex;
    var selectedItem = itemList[selectedItemIndex];
    this.setupClass(toggleName, selectedIndex);
    this.setupFunction(toggleName, selectedIndex);
    this.toggleNameAndIndexMap[toggleName] = selectedIndex;
    if (labelList){
        VisNetworkMan.ToggleMan.setElementLabel(selectedItem, selectedIndex, labelList);
    }
};
VisNetworkMan.ToggleMan.prototype.toggleNext = function(toggle, modeWithEvent){
    var toggleName = this.getToggleName(toggle);
    var data = this.toggleNameAndItemDataMap[toggleName];
    var currentIndex = this.toggleNameAndIndexMap[toggleName];
    //Length
    var labelList;
    var dataLength = -1;
    if (data instanceof Array){
        dataLength = (data.length == 1) ? 2 : data.length;
    }else if (typeof data == 'object'){
        labelList = Object.keys(data);
        dataLength = labelList.length;
    }
    var nextIndex = ((currentIndex +1) < dataLength) ? (currentIndex +1) : 0;
    return this.toggle(toggleName, nextIndex, modeWithEvent);
};
VisNetworkMan.ToggleMan.prototype.toggleBefore = function(toggle, modeWithEvent){
    var toggleName = this.getToggleName(toggle);
    var labelList;
    var data = this.toggleNameAndItemDataMap[toggleName];
    var currentIndex = this.toggleNameAndIndexMap[toggleName];
    //Length
    var labelList;
    var dataLength = -1;
    if (data instanceof Array){
        dataLength = (data.length == 1) ? 2 : data.length;
    }else if (typeof data == 'object'){
        labelList = Object.keys(data);
        dataLength = labelList.length;
    }
    var beforeIndex = ((currentIndex -1) > -1) ? (currentIndex -1) : (dataLength -1);
    return this.toggle(toggleName, beforeIndex, modeWithEvent);
};
VisNetworkMan.ToggleMan.prototype.toggleByIndex = function(toggleName, selectedIndex, modeWithEvent){
    selectedIndex = ((selectedIndex != null) ? selectedIndex : 0);
    return this.toggle(toggleName, selectedIndex, modeWithEvent);
};
VisNetworkMan.ToggleMan.prototype.setupClass = function(toggleName, nextIndex){
    var itemList = this.toggleNameAndItemListMap[toggleName];
    var currentIndex = this.toggleNameAndIndexMap[toggleName];
    //Class
    for (var i=0; i<itemList.length; i++){
        itemList[i].classList.remove(VisNetworkMan.ToggleMan.CLASS_TOGGLE_ON);
        itemList[i].classList.add(VisNetworkMan.ToggleMan.CLASS_TOGGLE_OFF);
    }
    if (itemList[nextIndex]){
        itemList[nextIndex].classList.remove(VisNetworkMan.ToggleMan.CLASS_TOGGLE_OFF);
        itemList[nextIndex].classList.add(VisNetworkMan.ToggleMan.CLASS_TOGGLE_ON);
    }
};
VisNetworkMan.ToggleMan.prototype.setupFunction = function(toggleName, nextIndex){
    var itemList = this.toggleNameAndItemListMap[toggleName];
    var funcList = this.toggleNameAndItemFunctionMap[toggleName];
    var currentIndex = this.toggleNameAndIndexMap[toggleName];
    //Class
    if (!funcList || !funcList[nextIndex])
        return;
    var func = funcList[nextIndex];
    var item = itemList[nextIndex];
    if (!item)
        item = itemList[(itemList.length -1)];
    if (func)
        func(item);
};
VisNetworkMan.ToggleMan.setElementLabel = function(element, nextIndex, labelList){
    var labelText = labelList[nextIndex];
    switch (element.tagName.toUpperCase()){
        case 'BUTTON':
            element.innerHTML = labelText;
            break;
        case 'SELECT':
            element.value = nextIndex;
            break;
        default:
            element.innerHTML = labelText;
            break;
    }
};


VisNetworkMan.ToggleMan.prototype.getAllToggledDataList = function(){
    var dataList = [];
    var toggleNameList = Object.keys(this.toggleNameAndIndexMap);
    for (var i=0, toggleName; i<toggleNameList.length; i++){
        toggleName = toggleNameList[i];
        var index = this.toggleNameAndIndexMap[toggleName];
        var toggledData = this.toggleNameAndItemDataMap[toggleName];
        if (toggledData){
            if (toggledData instanceof Array){
                var data = toggledData[index];
                dataList.push(data);
            }else if (typeof toggledData == 'object'){
                var keys = Object.keys(toggledData);
                var labelText = keys[index];
                var data = toggledData[labelText];
                dataList.push(data);
            }
        }
    }
    return dataList;
};

VisNetworkMan.ToggleMan.prototype.setModeSave = function(mode){
    this.modeSave = mode;
    return this;
};
VisNetworkMan.ToggleMan.prototype.setSaveKey = function(saveKey){
    if (saveKey != null)
        this.saveKey = VisNetworkMan.ToggleMan.SAVE_DEFAULT_NAME + saveKey;
    return this;
};
VisNetworkMan.ToggleMan.prototype.saveToggleDataToLocalStorage = function(){
    if (!this.modeSave)
        return this;
    var data = this.toggleNameAndIndexMap;
    localStorage.setItem(this.saveKey, JSON.stringify(data));
    return this;
};
VisNetworkMan.ToggleMan.prototype.loadToggleDataFromLocalStorage = function(){
    if (!this.modeSave)
        return this;
    var data = localStorage.getItem(this.saveKey);
    if (!data)
        return this;
    var loadedIndexMap = JSON.parse(data);
    this.mergeIntoToggleIndexMap(loadedIndexMap);
    this.refresh();
    return this;
};
VisNetworkMan.ToggleMan.prototype.mergeIntoToggleIndexMap = function(toggleNameAndIndexMap){
    for (var toggleName in toggleNameAndIndexMap){
        this.toggleNameAndIndexMap[toggleName] = toggleNameAndIndexMap[toggleName];
    }
    return this;
};
VisNetworkMan.ToggleMan.prototype.refresh = function(){
    for (var toggleName in this.toggleNameAndIndexMap){
        var currentIndex = this.toggleNameAndIndexMap[toggleName];
        // this.toggleByIndex(toggleName, currentIndex);
        this.toggleWithoutEvent(toggleName, currentIndex);
    }
    return this;
};



/***************************************************************************
 *
 * UTIL - for VisNetwork
 *
 ***************************************************************************/
VisNetworkMan.makeNewNodeIdDataFromDataList = function(dataList){
    if (!dataList)
        return [];
    //- Make newNodeDataList
    var newNodeDataList = [];
    for (var i=0, data, newNodeData; i<dataList.length; i++){
        data = dataList[i];
        newNodeData = Object.assign({}, data);
        newNodeData['parentNodeIdList'] = []; //NodeId
        newNodeData['childNodeIdList'] = []; //NodeId
        newNodeData['parentEdgeIdList'] = []; //EdgeId
        // newNodeData['parentNodeList'] = []; //Node
        // newNodeData['parentEdgeList'] = []; //Edge
        newNodeData['id'] = i; //NodeId
        newNodeData['nodeId'] = i; //NodeId
        newNodeData['dataId'] = data.id; //DataId
        newNodeData['parentDataId'] = data.parentId; //DataId
        newNodeDataList.push(newNodeData);
    }
    return newNodeDataList;
};

VisNetworkMan.makeNewNodeIdDataFromNodeDataList = function (nodeDataList){
    if (!nodeDataList)
        return [];
    //- Make newNodeDataList
    var newNodeDataList = [];
    for (var i=0, data, newNodeData; i<nodeDataList.length; i++){
        data = nodeDataList[i];
        newNodeData = Object.assign({}, data);
        newNodeData['parentNodeIdList'] = []; //NodeId
        newNodeData['childNodeIdList'] = []; //NodeId
        newNodeData['parentEdgeIdList'] = []; //EdgeId
        // newNodeData['parentNodeList'] = []; //Node
        // newNodeData['parentEdgeList'] = []; //Edge
        newNodeData['id'] = newNodeData['nodeId'];
        if (newNodeData['parentNodeId'] != null){
            newNodeData['parentNodeIdList'].push(newNodeData['parentNodeId']);
        }
        newNodeDataList.push(newNodeData);
    }
    return newNodeDataList;
};

VisNetworkMan.makeOrderByGroup = function (nodeDataList){
    var checkMap = {};
    for (var i=0, nodeData, groupName; i<nodeDataList.length; i++){
        nodeData = nodeDataList[i];
        groupName = nodeData.group;
        checkMap[groupName] = true;
    }
    var groupNameList = Object.keys(checkMap);
    var orderList = groupNameList.sort(function(a, b){
        return a - b;
    });
    return orderList;
};





/***************************************************************************
 *
 * UTIL - Common
 *
 ***************************************************************************/
VisNetworkMan.newMergeOptionAll = function(standardOption, mergeOption){
    var mergedOption = standardOption;
    if (!mergeOption){
        mergedOption = VisNetworkMan.newMergeOptionAll({}, mergedOption);
    }else{
        //- Make List
        if (!(mergeOption instanceof Array) && !mergeOption.length) //Array from other window is converted to Not Array... shit..
            mergeOption = [mergeOption];
        //- Merge All
        for (var i=0; i<mergeOption.length; i++){
            mergedOption = VisNetworkMan.newMergeOption(mergedOption, mergeOption[i]);
        }
    }
    return mergedOption;
};

VisNetworkMan.newMergeOption = function(standardOption, mergeOption){
    if (!standardOption){
        if (mergeOption instanceof Array)
            standardOption = [];
        else
            standardOption = {};
    }
    // var newMergedOption = Object.assign({}, standardOption);
    // var newMergedOption = JSON.parse(JSON.stringify(standardOption));
    var newMergedOption = VisNetworkMan.cloneObject(standardOption);
    return VisNetworkMan.mergeIntoOption(newMergedOption, mergeOption);
};

VisNetworkMan.mergeIntoOption = function(standardOption, mergeOption){
    if (mergeOption){
        if (!standardOption){
            if (mergeOption instanceof Array)
                standardOption = [];
            else
                standardOption = {};
        }

        for (var optionName in mergeOption){
            var nextValue = mergeOption[optionName];
            var mergedValue = null;
            if (nextValue === null){
                standardOption[optionName] = null;

            }else if (nextValue === undefined){
                standardOption[optionName] = undefined;

            }else if (nextValue instanceof Element){
                mergedValue = nextValue;
                standardOption[optionName] = mergedValue;

            }else if (nextValue instanceof Array){
                if (!standardOption[optionName])
                    standardOption[optionName] = [];
                for (var i=0; i<nextValue.length; i++){
                    if (nextValue[i] === null)
                        mergedValue = null;
                    else if (nextValue[i] === undefined)
                        mergedValue = undefined;
                    else if (nextValue[i] instanceof Array)
                        mergedValue = VisNetworkMan.newMergeOption(standardOption[optionName][i], nextValue[i]);
                    else if (typeof nextValue[i] == 'object')
                        mergedValue = VisNetworkMan.newMergeOption(standardOption[optionName][i], nextValue[i]);
                    else
                        mergedValue = nextValue[i];
                    standardOption[optionName][i] = mergedValue;
                }

            }else if (typeof nextValue == 'object'){
                if (standardOption[optionName] == null)
                    standardOption[optionName] = {};
                for (var key in nextValue){
                    if (nextValue[key] === null)
                        mergedValue = null;
                    else if (nextValue[key] === undefined)
                        mergedValue = undefined;
                    else if (nextValue[key] instanceof Array)
                        mergedValue = VisNetworkMan.newMergeOption(standardOption[optionName][key], nextValue[key]);
                    else if (typeof nextValue[key] == 'object')
                        mergedValue = VisNetworkMan.newMergeOption(standardOption[optionName][key], nextValue[key]);
                    else
                        mergedValue = nextValue[key];
                    standardOption[optionName][key] = mergedValue;
                }

            }else{
                mergedValue = nextValue;
                standardOption[optionName] = mergedValue;
            }
        }
    }
    return standardOption;
};

VisNetworkMan.cloneObject = function(obj){
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj)
        return obj;

    // Handle Date
    if (obj instanceof Date){
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array){
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++){
            copy[i] = VisNetworkMan.cloneObject(obj[i]);
        }
        return copy;
    }

    //This is Refference :)
    if (obj instanceof Element){
        copy = obj;
        return copy;
    }

    // Handle Object
    if (typeof obj == 'object' || obj instanceof Object){
        copy = {};
        for (var attr in obj){
            if (obj.hasOwnProperty(attr))
                copy[attr] = VisNetworkMan.cloneObject(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};

VisNetworkMan.prototype.trigger = function(element, eventName){
    if ("createEvent" in this.document) {
        var event = this.document.createEvent("HTMLEvents");
        event.initEvent(eventName, false, true);
        element.dispatchEvent(event);
    }else{
        element.fireEvent("on" +eventName);
    }
}



VisNetworkMan.filterGroupOrderly = function (nodeDataList, option){
    var extendsOption = option.extendsOption;
    //- Make FilterMap
    var childSameDataByAllIdChecker = {};
    var childSameDataByGroupIdChecker = {};
    var dataIdAndNodeDataListMapByAllNameMap = {};
    var dataIdAndNodeDataListMapByGroupNameMap = {};
    for (var i=0, nodeData; i<nodeDataList.length; i++){
        nodeData = nodeDataList[i];
        if (nodeData.dataId == null)
            continue;
        //By All
        if (!dataIdAndNodeDataListMapByAllNameMap[nodeData.dataId])
            dataIdAndNodeDataListMapByAllNameMap[nodeData.dataId] = [];
        dataIdAndNodeDataListMapByAllNameMap[nodeData.dataId].push(nodeData);
        //By Group
        if (!dataIdAndNodeDataListMapByGroupNameMap[nodeData.group])
            dataIdAndNodeDataListMapByGroupNameMap[nodeData.group] = {};
        if (!dataIdAndNodeDataListMapByGroupNameMap[nodeData.group][nodeData.dataId])
            dataIdAndNodeDataListMapByGroupNameMap[nodeData.group][nodeData.dataId] = [];
        dataIdAndNodeDataListMapByGroupNameMap[nodeData.group][nodeData.dataId].push(nodeData);
    }

    //- Add to ParentNodeIdList
    var addChild = function(parentNode, childNode, extendsOption){
        if (extendsOption.maxChildNodeCount !== null && extendsOption.maxChildNodeCount !== undefined && extendsOption.maxChildNodeCount > -1){
            if (parentNode.childNodeIdList.length >= extendsOption.maxChildNodeCount)
                return;
        }
        childNode.parentNodeIdList.push(parentNode.id);
        parentNode.childNodeIdList.push(childNode.id);
    };
    for (var i=0, parentNodeDataList, childNodeDataList, orderGroupName, nextOrderGroupName; i<extendsOption.orderList.length; i++){
        if (i > extendsOption.orderList.length -1)
            continue;
        orderGroupName = extendsOption.orderList[i];
        nextOrderGroupName = extendsOption.orderList[i +1];
        var parentNodeDataListMap = dataIdAndNodeDataListMapByGroupNameMap[orderGroupName];
        var childNodeDataListMap = dataIdAndNodeDataListMapByGroupNameMap[nextOrderGroupName];
        if (!parentNodeDataListMap || !childNodeDataListMap)
            continue;
        for (var childNodeId in childNodeDataListMap){
            childNodeDataList = childNodeDataListMap[childNodeId];
            childSameDataByGroupIdChecker = {};

            for (var ii=0, childNodeData; ii<childNodeDataList.length; ii++){
                childNodeData = childNodeDataList[ii];

                //Mode - UniqueDataAll
                if (extendsOption.modeUniqueData){
                    if (!childSameDataByAllIdChecker[childNodeData.dataId])
                        childSameDataByAllIdChecker[childNodeData.dataId] = childNodeData;
                    var uniqueChildNodeData = childSameDataByAllIdChecker[childNodeData.dataId];
                    if (uniqueChildNodeData !== childNodeData)
                        nodeDataList.splice(nodeDataList.indexOf(childNodeData), 1);
                    parentNodeDataList = dataIdAndNodeDataListMapByAllNameMap[childNodeData.parentDataId];
                    if (parentNodeDataList){
                        for (var k=0; k<parentNodeDataList.length; k++){
                            parentNodeData = parentNodeDataList[k];
                            if (uniqueChildNodeData.parentNodeIdList.indexOf(parentNodeData.id) == -1){
                                addChild(parentNodeData, uniqueChildNodeData, extendsOption);
                            }
                        }
                    }
                    continue;
                }

                if (childNodeData.parentDataId == null)
                    continue;
                parentNodeDataList = parentNodeDataListMap[childNodeData.parentDataId];
                if (!parentNodeDataList)
                    continue;
                for (var jj=0, parentNodeData; jj<parentNodeDataList.length; jj++){
                    parentNodeData = parentNodeDataList[jj];

                    //Mode - Clone Data
                    if (extendsOption.modeCloneNodeWhenDuplicateLink){
                        if (childNodeData.parentNodeIdList.length > 0){
                            var clonedChildNodeData = Object.assign({}, childNodeData);
                            clonedChildNodeData.id = nodeDataList.length;
                            clonedChildNodeData.parentNodeIdList = [];
                            clonedChildNodeData.childNodeIdList = [];
                            nodeDataList.push(clonedChildNodeData);
                            childNodeData = clonedChildNodeData;
                        }
                    }

                    //Mode - UniqueDataSameGroup
                    if (extendsOption.modeUniqueDataInSameGroup){
                        if (!childSameDataByGroupIdChecker[childNodeData.dataId])
                            childSameDataByGroupIdChecker[childNodeData.dataId] = childNodeData;
                        var uniqueChildNodeData = childSameDataByGroupIdChecker[childNodeData.dataId];
                        if (uniqueChildNodeData !== childNodeData)
                            nodeDataList.splice(nodeDataList.indexOf(childNodeData), 1);
                        if (uniqueChildNodeData.parentNodeIdList.indexOf(parentNodeData.id) == -1){
                            addChild(parentNodeData, uniqueChildNodeData, extendsOption);
                        }
                        continue;
                    }

                    addChild(parentNodeData, childNodeData, extendsOption);
                }
            }
        }
    }
};
VisNetworkMan.filterPruningNodeWithoutEdge = function(nodeDataList, option){
    var extendsOption = option.extendsOption;
    //- Make FilterMap
    var nodeIdAndNodeDataMap = {}; //By All
    for (var i=0, nodeData; i<nodeDataList.length; i++){
        nodeData = nodeDataList[i];
        nodeIdAndNodeDataMap[nodeData.id] = nodeData;
    }
    //- Prune ParentNodeId Not Exists
    for (var nodeId in nodeIdAndNodeDataMap){
        var nodeData = nodeIdAndNodeDataMap[nodeId];
        for (var i=nodeData.parentNodeIdList.length -1, parentNodeId; i>-1; i--){
            parentNodeId = nodeData.parentNodeIdList[i];
            if (!nodeIdAndNodeDataMap[parentNodeId])
                nodeData.parentNodeIdList.splice(i, 1);
        }
    }
    //- Prune - Node Not to Root
    if (option.extendsOption.modePruneNodeNotToRootGroup){
        var pruneNoParentAndNoRoot = function(nodeData){
            if (nodeData.parentNodeIdList.length == 0 && nodeData.group != option.extendsOption.orderList[0]){
                //Delete All ChildNodeId
                for (var i=0, checkNodeId; i<nodeData.childNodeIdList.length; i++){
                    checkNodeId = nodeData.childNodeIdList[i];
                    var checkNode = nodeIdAndNodeDataMap[checkNodeId];
                    var foundIndex = checkNode.parentNodeIdList.indexOf(nodeData.id);
                    if (foundIndex != -1)
                        checkNode.parentNodeIdList.splice(foundIndex, 1);
                    pruneNoParentAndNoRoot(checkNode);
                }
                nodeData.childNodeIdList = [];
            }
        };
        for (var i=nodeDataList.length -1, nodeData; i>-1; i--){
            nodeData = nodeDataList[i];
            pruneNoParentAndNoRoot(nodeData);
        }
    }
    //- Prune - Node Without Edge
    if (option.extendsOption.modePruneNodeWithoutEdge){
        for (var i=nodeDataList.length -1, nodeData; i>-1; i--){
            nodeData = nodeDataList[i];
            if (nodeData.parentNodeIdList.length == 0 && nodeData.childNodeIdList.length == 0)
                nodeDataList.splice(i, 1);
        }
    }

};



VisNetworkMan.makeEdgeDataList = function(nodeDataList){
    var edgeDataList = [];
    for (var i=0, nodeData; i<nodeDataList.length; i++){
        nodeData = nodeDataList[i];
        for (var ii=0, parentNodeId, parentNode, edge; ii<nodeData.parentNodeIdList.length; ii++){
            parentNodeId = nodeData.parentNodeIdList[ii];
            parentNode = VisNetworkMan.selectById(nodeDataList, parentNodeId);
            edge = {
                from: parentNodeId,
                to: nodeData.id,
                fromNode: parentNode,
                toNode: nodeData
            };
            edgeDataList.push(edge);
            // nodeData.parentNodeList.push(parentNode);
            // nodeData.parentEdgeList.push(edge);
        }
    }
    return edgeDataList;
};

VisNetworkMan.selectById = function(nodeDataList, idToSelect){
    for (var i=0; i<nodeDataList.length; i++){
        if (nodeDataList[i].id == idToSelect)
            return nodeDataList[i];
    }
    return null;
};



VisNetworkMan.prototype.makeContainer = function(){
    var container = this.document.createElement('div');
    container.setAttribute('id', 'mynetwork');
    container.style.width = '100%';
    container.style.height = '100%';
    return container;
};

VisNetworkMan.prototype.makeAlertDiv = function(message, size){
    var divToAlert = this.document.createElement('div');
    divToAlert.setAttribute('id', 'alert-message');
    divToAlert.style.width = '100%';
    divToAlert.style.height = '100%';
    size = size ? size : 30;
    divToAlert.style.fontSize = size+ 'px';
    // divToAlert.style.position = 'absolute';
    divToAlert.style.border = '0px solid';
    divToAlert.style.textAlign = 'center';
    divToAlert.innerHTML = '<br/><br/><span style="display:inline-block; border:3px dashed red">' +message+ '</span>';
    return divToAlert;
};

VisNetworkMan.prototype.setupEvent = function(network, extendsOption){
    var that = this;
    network.on('click', function(e){
        var nodes = network.nodesHandler.body.data.nodes;
        var edges = network.nodesHandler.body.data.edges;
        // console.log('click', e, e.nodes, e.edges);
        //- Run Node
        var nodeMap = network.nodesHandler.body.data.nodes._data;
        for (var i=0, nodeId, node; i<e.nodes.length; i++){
            nodeId = e.nodes[i];
            node = nodeMap[nodeId];
            if (extendsOption.funcEventClickNode)
                extendsOption.funcEventClickNode(node);
        }
    });
    network.on('doubleClick', function(e){
        // console.log('dbclick', e, e.nodes);
        if (e.nodes){
            var nodeMap = network.nodesHandler.body.data.nodes._data;
            for (var i=0, nodeId, node; i<e.nodes.length; i++){
                nodeId = e.nodes[i];
                node = nodeMap[nodeId];
                if (extendsOption.funcEventDoubleClickNode)
                    extendsOption.funcEventDoubleClickNode(node);
            }
        }
    });
    network.on('oncontext', function(e){
        console.log('oncontext', e);
    });
    network.on('hoverNode', function(e){
        // console.log('hoverNode', e, e.node);
        that.document.body.style.cursor = 'pointer';
        var nodeId = e.node;
        if (extendsOption.modePointAllSubLink)
            that.pointNode(nodeId, extendsOption.nodeWhenPoint, extendsOption.edgeWhenPoint);
    });
    network.on('hoverEdge', function(e){
        // console.log('hoverEdge', e, e.edge);
        that.document.body.style.cursor = 'pointer';
        var edges = network.nodesHandler.body.data.edges;
        var edgeId = e.edge;
        var edge = edges._data[edgeId];
        if (extendsOption.modePointAllSubLink)
            that.pointNode(edge.toNode.id, extendsOption.nodeWhenPoint, extendsOption.edgeWhenPoint);
    });
    network.on('blurNode', function(e){
        // console.log('blurNode', e, e.node);
        that.document.body.style.cursor = 'auto';
        if (extendsOption.modePointAllSubLink)
            that.unpointNode();
    });
    network.on('blurEdge', function(e){
        // console.log('blurEdge', e, e.edge);
        that.document.body.style.cursor = 'auto';
        if (extendsOption.modePointAllSubLink)
            that.unpointNode();
    });
    network.on('selectNode', function(e){
        // console.log('selectNode', e, e.nodes[0]);
        var ctrlKeyDown = e.event.srcEvent.altKey;
        var altKeyDown = e.event.srcEvent.ctrlKey;
        var nodeId = e.nodes[0];
        if (extendsOption.modeSelectAllSubLink)
            that.selectNode(nodeId, extendsOption.nodeWhenSelect, extendsOption.edgeWhenSelect);
    });
    network.on('selectEdge', function(e){
        // console.log('selectEdge', e, e.edges[0]);
        var edges = network.nodesHandler.body.data.edges;
        var edgeId = e.edges[0];
        var edge = edges._data[edgeId];
        if (extendsOption.modeSelectAllSubLink)
            that.selectNode(edge.toNode.id, extendsOption.nodeWhenSelect, extendsOption.edgeWhenSelect);
    });
    network.on('deselectNode', function(e){
        // console.log('deselectNode', e, e.node);
        // if (extendsOption.modeSelectAllSubLink)
        //     that.unselectNode();
    });
    network.on('deselectEdge', function(e){
        // console.log('deselectEdge', e, e.edge);
        // if (extendsOption.modeSelectAllSubLink)
        //     that.unselectNode();
    });
    network.on('dragStart', function(e){
    });
    network.on('dragging', function(e){
        // console.log('dragging', e, e.event.distance);
        var nodes = network.nodesHandler.body.data.nodes;
        var nodeId = e.nodes[0];
        var node = nodes._data[nodeId];
        if (!nodeId)
            return;
        if (extendsOption.maxDistanceWhenDragNode != null && e.event.distance > extendsOption.maxDistanceWhenDragNode && !that.flagAlreadyDragedMaxDistance){
            that.flagAlreadyDragedMaxDistance = true;
            network.setOptions({interaction: {dragNodes:false, dragView:false}});
            //Event
            (extendsOption.funcEventDragNodeOverDistance && extendsOption.funcEventDragNodeOverDistance(node));
        }
    });
    network.on('dragEnd', function(e){
        // console.error('dragend',e);
        if (extendsOption.maxDistanceWhenDragNode != null){
            that.flagAlreadyDragedMaxDistance = false;
            network.setOptions({interaction: {dragNodes:true, dragView:true}});
        }
    });
    network.on('zoom', function(e){
        // console.log('zoom', network.getScale(), e);
    });
    network.on('release', function(e){
        // console.log('release', e, that.visNetwork.getScale());
    });
    network.on('resize', function(e){
        // console.log('resize', e, that.visNetwork.getScale());
        if (that.inputForZoom){
            that.inputForZoom.value = that.visNetwork.getScale();
            // VisNetworkMan.trigger(that.inputForZoom, 'change');
        }
    });
    network.on('stabilized', function(e){
        // console.log('stabilized', e, that.visNetwork.getScale());
    });
    network.on('initRedraw', function(e){
        // console.log('initRedraw', e, that.visNetwork.getScale());
    });
    network.on('afterDrawing', function(e){
        // console.log('afterDrawing', e, that.visNetwork.getScale());
    });
};


/***************************************************************************
 *
 * Event - Pointing
 *
 ***************************************************************************/
VisNetworkMan.prototype.pointNode = function(nodeId, nodeDataToUpdate, edgeDataToUpdate){
    var that = this;
    //- Check Toggle Node
    this.pointingNodeList.push(nodeId);
    //- Update Render
    if (nodeDataToUpdate)
        nodeDataToUpdate.effectType = VisNetworkMan.EFFECT_TYPE_POINT;
    if (edgeDataToUpdate)
        edgeDataToUpdate.effectType = VisNetworkMan.EFFECT_TYPE_POINT;
    this.effectPointNodeWithSublinks(
        nodeId,
        nodeDataToUpdate,
        edgeDataToUpdate
    );
    this.renderNodeEffect(Object.keys(this.pointedNodeMap));
    this.renderEdgeEffect(Object.keys(this.pointedEdgeMap));
};
VisNetworkMan.prototype.unpointNode = function(){
    var that = this;
    var releaseEffectPointNodeIdList = Object.keys(that.pointedNodeMap);
    var releaseEffectPointEdgeIdList = Object.keys(that.pointedEdgeMap);
    that.releaseEffectPointNode();
    that.releaseEffectPointEdge();
    that.renderNodeEffect(releaseEffectPointNodeIdList);
    that.renderEdgeEffect(releaseEffectPointEdgeIdList);
};
VisNetworkMan.prototype.effectPointNodeWithSublinks = function(node, updateNodeData, updateEdgeData){
    var nodes = this.visNetwork.nodesHandler.body.data.nodes;
    var edges = this.visNetwork.nodesHandler.body.data.edges;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id;
    }else{
        nodeId = node;
        node = nodes._data[nodeId];
    }
    this.effectPointNode(node, updateNodeData);
    this.effectPointEdge(node.parentEdgeIdList, updateEdgeData);
    for (var i=0, parentNodeId, parentNode; i<node.parentNodeIdList.length; i++){
        parentNodeId = node.parentNodeIdList[i];
        parentNode = nodes._data[parentNodeId];
        if (parentNode){
            this.effectPointNodeWithSublinks(parentNode, updateNodeData, updateEdgeData);
        }
    }
};
VisNetworkMan.prototype.effectPointNode = function(node, updateObject){
    if (node == null)
        return;
    if (node instanceof Array){
        for (var i=0; i<node.length; i++){
            this.effectPointNode(node[i], updateObject);
        }
        return;
    }
    var nodes = this.visNetwork.nodesHandler.body.data.nodes;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id
    }else{
        nodeId = node;
        node = nodes._data[nodeId];
    }
    if (node == null)
        return;
    this.pointedNodeMap[node.id] = updateObject;
    this.addNodeEffect(node.id, updateObject);
};
VisNetworkMan.prototype.effectPointEdge = function(edge, updateObject){
    if (edge == null)
        return;
    if (edge instanceof Array){
        for (var i=0; i<edge.length; i++){
            this.effectPointEdge(edge[i], updateObject);
        }
        return;
    }
    var edges = this.visNetwork.nodesHandler.body.data.edges;
    var edgeId;
    if (typeof edge == 'object'){
        edgeId = edge.id;
    }else{
        edgeId = edge;
        edge = edges._data[edgeId];
    }
    if (edge == null)
        return;
    this.pointedEdgeMap[edge.id] = updateObject;
    this.addEdgeEffect(edge.id, updateObject);
};

VisNetworkMan.prototype.releaseEffectPointNode = function(node){
    if (node != null){
        var nodes = this.visNetwork.nodesHandler.body.data.nodes;
        var nodeId;
        if (typeof node == 'object'){
            nodeId = node.id;
        }else{
            nodeId = node;
            node = this.pointedNodeMap[nodeId];
        }
        var nodeObject = this.pointedNodeMap[nodeId];
        this.removeNodeEffect(nodeId, nodeObject, VisNetworkMan.EFFECT_TYPE_POINT);
        delete this.pointedNodeMap[nodeId];
    }else{
        for (var nodeId in this.pointedNodeMap){
            // var selectedNode = this.pointedNodeMap[nodeId];
            this.releaseEffectPointNode(nodeId);
        }
    }
};
VisNetworkMan.prototype.releaseEffectPointEdge = function(edge){
    if (edge != null){
        var edges = this.visNetwork.nodesHandler.body.data.edges;
        var edgeId;
        if (typeof edge == 'object'){
            edgeId = edge.id;
        }else{
            edgeId = edge;
            edge = this.pointedEdgeMap[edgeId];
        }
        var edgeObject = this.pointedEdgeMap[edgeId];
        this.removeEdgeEffect(edgeId, edgeObject, VisNetworkMan.EFFECT_TYPE_POINT);
        delete this.pointedEdgeMap[edgeId];
    }else{
        for (var edgeId in this.pointedEdgeMap){
            // var selectedEdge = this.pointedEdgeMap[edgeId];
            this.releaseEffectPointEdge(edgeId);
        }
    }
};

VisNetworkMan.prototype.addNodeEffect = function(id, effectObject){
    if (!this.nodeEffectDataListMap[id])
        this.nodeEffectDataListMap[id] = [];
    var effectDataList = this.nodeEffectDataListMap[id];
    effectDataList.push(effectObject);
    return this;
};
VisNetworkMan.prototype.addEdgeEffect = function(id, effectObject){
    if (!this.edgeEffectDataListMap[id])
        this.edgeEffectDataListMap[id] = [];
    var effectDataList = this.edgeEffectDataListMap[id];
    effectDataList.push(effectObject);
    return this;
};
VisNetworkMan.prototype.removeNodeEffect = function(id, effectObject, effectType){
    if (!this.nodeEffectDataListMap[id])
        return this;
    var effectDataList = this.nodeEffectDataListMap[id];
    if (effectType){
        for (var i=effectDataList.length -1, effectData; i>-1; i--){
            effectData = effectDataList[i];
            if (effectData.effectType == effectType)
                effectDataList.splice(i, 1);
        }
        return this;
    }
    var foundIndex = effectDataList.indexOf(effectObject);
    if (foundIndex != -1)
        effectDataList.splice(foundIndex, 1);
    return this;
};
VisNetworkMan.prototype.removeEdgeEffect = function(id, effectObject, effectType){
    if (!this.edgeEffectDataListMap[id])
        return this;
    var effectDataList = this.edgeEffectDataListMap[id];
    if (effectType){
        for (var i=effectDataList.length -1, effectData; i>-1; i--){
            effectData = effectDataList[i];
            if (effectData.effectType == effectType){
                effectDataList.splice(i, 1);
            }
        }
        return this;
    }
    var foundIndex = effectDataList.indexOf(effectObject);
    if (foundIndex != -1)
        effectDataList.splice(foundIndex, 1);
    return this;
};
VisNetworkMan.prototype.renderNodeEffect = function(targetIdList){
    var nodes = this.visNetwork.nodesHandler.body.data.nodes;
    var edges = this.visNetwork.nodesHandler.body.data.edges;
    // console.error('Node', targetIdList);
    for (var i=0, id; i<targetIdList.length; i++){
        id = targetIdList[i];
        var nodeWhenStarting = this.cachedDataWhenStartRendering.nodeData[id];
        var nodeEffectDataList = this.nodeEffectDataListMap[id];
        var mergedObject = VisNetworkMan.newMergeOptionAll(nodeWhenStarting, nodeEffectDataList);
        //TODO: 비교 삭제 - 해도 안되네..
        // var currentData = nodes._data[mergedObject.id];
        // this.deleteNotExistsProperty(currentData, mergedObject);
        // console.error('Render Node', currentData, mergedObject);
        nodes.update(mergedObject);
    }
};
VisNetworkMan.prototype.renderEdgeEffect = function(targetIdList){
    var nodes = this.visNetwork.nodesHandler.body.data.nodes;
    var edges = this.visNetwork.nodesHandler.body.data.edges;
    // console.error('Edge', targetIdList);
    for (var i=0, id; i<targetIdList.length; i++){
        id = targetIdList[i];
        var edgeWhenStarting = this.cachedDataWhenStartRendering.edgeData[id];
        var edgeEffectDataList = this.edgeEffectDataListMap[id];
        var mergedObject = VisNetworkMan.newMergeOptionAll(edgeWhenStarting, edgeEffectDataList);
        //TODO: 비교 삭제 - 해도 안되네..
        // var currentData = edges._data[mergedObject.id];
        // this.deleteNotExistsProperty(currentData, mergedObject);
        // console.error('Render Edge', currentData, mergedObject);
        edges.update(mergedObject);
    }
};

VisNetworkMan.prototype.deleteNotExistsProperty = function(standard, target){ //target에 없는 게 있으면 standard꺼 지워
    for (var key in standard){
        var standardProp = standard[key];
        var targetProp = target[key];
        if (!target.hasOwnProperty(key)){
            console.error('>>> remove:', key);
            delete standard[key];
            continue;
        }
        if (standard instanceof Array) {
        }else if (standard instanceof Function){
        }else if (typeof standard == 'object'){
            this.deleteNotExistsProperty(standard[key], target[key]);
        }
    }
};



/***************************************************************************
 *
 * Event - Selecting
 *
 ***************************************************************************/
VisNetworkMan.prototype.selectNode = function(nodeId, nodeDataToUpdate, edgeDataToUpdate){
    var that = this;
    //- Check Toggle Node
    if (this.selectingNodeList.length > 0){
        this.unselectNode(this.selectingNodeList);
    }
    this.selectingNodeList.push(nodeId);
    //- Update Render
    if (nodeDataToUpdate)
        nodeDataToUpdate.effectType = VisNetworkMan.EFFECT_TYPE_SELECT;
    if (edgeDataToUpdate)
        edgeDataToUpdate.effectType = VisNetworkMan.EFFECT_TYPE_SELECT;
    this.effectSelectNodeWithSublinks(
        nodeId,
        nodeDataToUpdate,
        edgeDataToUpdate
    );
    this.renderNodeEffect(Object.keys(this.selectedNodeMap));
    this.renderEdgeEffect(Object.keys(this.selectedEdgeMap));
};
VisNetworkMan.prototype.unselectNode = function(node){
    var that = this;
    var releaseEffectSelectNodeIdList = Object.keys(this.selectedNodeMap);
    var releaseEffectSelectEdgeIdList = Object.keys(this.selectedEdgeMap);
    this.releaseEffectSelectEdge();
    this.releaseEffectSelectNode();
    this.renderNodeEffect(releaseEffectSelectNodeIdList);
    this.renderEdgeEffect(releaseEffectSelectEdgeIdList);
};
VisNetworkMan.prototype.effectSelectNodeWithSublinks = function(node, updateNodeData, updateEdgeData){
    var nodes = this.visNetwork.nodesHandler.body.data.nodes;
    var edges = this.visNetwork.nodesHandler.body.data.edges;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id;
    }else{
        nodeId = node;
        node = nodes._data[nodeId];
    }
    this.effectSelectNode(node, updateNodeData);
    this.effectSelectEdge(node.parentEdgeIdList, updateEdgeData);
    for (var i=0, parentNodeId, parentNode; i<node.parentNodeIdList.length; i++){
        parentNodeId = node.parentNodeIdList[i];
        parentNode = nodes._data[parentNodeId];
        if (parentNode){
            this.effectSelectNodeWithSublinks(parentNode, updateNodeData, updateEdgeData);
        }
    }
};
VisNetworkMan.prototype.effectSelectNode = function(node, updateObject){
    if (node == null)
        return;
    if (node instanceof Array){
        for (var i=0; i<node.length; i++){
            this.effectSelectNode(node[i], updateObject);
        }
        return;
    }
    var nodes = this.visNetwork.nodesHandler.body.data.nodes;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id
    }else{
        nodeId = node;
        node = nodes._data[nodeId];
    }
    this.selectedNodeMap[node.id] = updateObject;
    this.addNodeEffect(node.id, updateObject);
};
VisNetworkMan.prototype.effectSelectEdge = function(edge, updateObject){
    if (edge == null)
        return;
    if (edge instanceof Array){
        for (var i=0; i<edge.length; i++){
            this.effectSelectEdge(edge[i], updateObject);
        }
        return;
    }
    var edges = this.visNetwork.nodesHandler.body.data.edges;
    var edgeId;
    if (typeof edge == 'object'){
        edgeId = edge.id;
    }else{
        edgeId = edge;
        edge = edges._data[edgeId];
    }
    this.selectedEdgeMap[edge.id] = updateObject;
    this.addEdgeEffect(edge.id, updateObject);
};

VisNetworkMan.prototype.releaseEffectSelectNode = function(node){
    if (node != null){
        var nodes = this.visNetwork.nodesHandler.body.data.nodes;
        var edges = this.visNetwork.nodesHandler.body.data.edges;
        var nodeId;
        if (typeof node == 'object'){
            nodeId = node.id;
        }else{
            nodeId = node;
            node = this.selectedNodeMap[nodeId];
        }
        var nodeObject = this.selectedNodeMap[nodeId];
        this.removeNodeEffect(nodeId, nodeObject, VisNetworkMan.EFFECT_TYPE_SELECT);
        delete this.selectedNodeMap[nodeId];
    }else{
        for (var nodeId in this.selectedNodeMap){
            this.releaseEffectSelectNode(nodeId);
        }
    }
};
VisNetworkMan.prototype.releaseEffectSelectEdge = function(edge){
    if (edge != null){
        var nodes = this.visNetwork.nodesHandler.body.data.nodes;
        var edges = this.visNetwork.nodesHandler.body.data.edges;
        var edgeId;
        if (typeof edge == 'object'){
            edgeId = edge.id;
        }else{
            edgeId = edge;
            edge = this.selectedEdgeMap[edgeId];
        }
        var edgeObject = this.selectedEdgeMap[edgeId];
        this.removeEdgeEffect(edgeId, edgeObject, VisNetworkMan.EFFECT_TYPE_SELECT);
        delete this.selectedEdgeMap[edgeId];
    }else{
        for (var edgeId in this.selectedEdgeMap){
            this.releaseEffectSelectEdge(edgeId);
        }
    }
};





























/**************************************************
 *
 * TEST DATA
 *
 **************************************************/
VisNetworkMan.prototype.makeVisDefaultOptions = function(){
    return {
        autoResize: true,
        height: '95%',
        width: '95%',
        locale: 'en',
        // locales: locales,
        clickToUse: false,
        interaction:{
            hover: true,
            zoomView: false,
            // navigationButtons: true,
            keyboard: true
        },
        layout:{ //임의 화면구성
            randomSeed: undefined //Number
        },
        // groups:{
        //     0: {
        //         // shape:'image',
        //         // image: {
        //         //     unselected: 'data:image/png;base64,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/GMzLdsAADoyaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNC0xMi0yM1QxMjozODozMyswMTowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTQtMTItMjNUMTI6Mzg6MzMrMDE6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE0LTEyLTIzVDEyOjM4OjMzKzAxOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDplNTM5OWJjMy1hYmIzLTUwNDQtYTcwOC1mZTI1MzQ3YWQ5MGY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDozNTkyYTgwYy04YTk4LTExZTQtOGYwNC1kYWI3OTI4MmQ4YjU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo0NDc3NTgzMi04YWJiLTFiNDYtYTU2ZC1iMzNlYTM1NjE5YzM8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NDQ3NzU4MzItOGFiYi0xYjQ2LWE1NmQtYjMzZWEzNTYxOWMzPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE0LTEyLTIzVDEyOjM4OjMzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmU1Mzk5YmMzLWFiYjMtNTA0NC1hNzA4LWZlMjUzNDdhZDkwZjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNC0xMi0yM1QxMjozODozMyswMTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PnGrDjMAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAANvJJREFUeNrsvXmUZPdV5/m9v+W9F1tG5F5VmVmZtUsqrZZkSZZsLLAbbAGDsJlz3IDdMIB16DaD3Q1eMINtGtocmsEc28iykLHB2AhrRp72cqZtDsKDZWPJQpK1VKkkVamyMrNyz8iM7W2/350/IiIrMyuXiKi9FPeUpFJkxMt4v/d59939R8yMtrTlchHRXoK2tIFuS1vaQLelLW2g29KWNtBtaQPdlra0gW5LW9pAt6UtbaDb0pY20G1pA92WtrSBbktbLhpR7SVoRBiwxsT5BY6NyuWE67Y1QRvoi1EsYIPAlEoymSStTaXC5bKdn4vHx8KpKbu0ZGZmzNSULS5hMY+xEwgCMTBkurtlukNu3676+kQ262zbLgeHZFcXpVLS8wQAojZbF0Tosi8fZcBGkalUTKFgTp4MT57kxcV4ZsZMT5v5eZRKmJjAzAx6eiLP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',
        //         //     selected: 'data:image/png;base64,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/GMzLdsAADoyaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNC0xMi0yM1QxMjo0MjoyMyswMTowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTQtMTItMjNUMTI6NDI6MjMrMDE6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE0LTEyLTIzVDEyOjQyOjIzKzAxOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDoyNjllZDdiZi0zNDAwLWYzNDItYTIxMC1hNTljNDFhNmUyYmQ8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiYmJhZjc4Yy04YTk4LTExZTQtOGYwNC1kYWI3OTI4MmQ4YjU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo2NzEzYzMzMi0wMDZkLWE0NGMtYjQ4OC01Yjg3Zjc1MGIzNDA8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NjcxM2MzMzItMDA2ZC1hNDRjLWI0ODgtNWI4N2Y3NTBiMzQwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE0LTEyLTIzVDEyOjQyOjIzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjI2OWVkN2JmLTM0MDAtZjM0Mi1hMjEwLWE1OWM0MWE2ZTJiZDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNC0xMi0yM1QxMjo0MjoyMyswMTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgywV9wAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAHchJREFUeNrsnWmQXNd13//nvvd6X6eX6dlXEBgsJEGQEEGKpExJEUXKKVmOopRTSUW2FdtZFFcS2UpSikuWt3JSpYqd2Irj2KmSKmW7EolSJJqSKFGUBJIANxAgAGKZpQez974v77178qEHA2AIklhmpl8337/wYfB6ppd7f33eOefeew7lcjm8t5Uqca6GO+LU+m+2QMsV0euW0TBv6+su5NmUGOmhNn72U4tyuIeCbuqa2VTxnlfMTww+v8YDPvrjFzhdZlUQE0JO/Iv3w+/erteVEu3l6MIa9wa6imYAwgYaQNxPAvRv/1ZxOwL3jgfuHvUeHPF5Pf4vPC2yhW2cb2ofS5dy7NIQ91OXTaUNNAAw4yvH5JFRT2/oKsoDuH/S+zs/kNtloRmiTTitFmVdx1CYum8qbaAB4Olz7HF7HA7Mn3/17EvPAFieO/vac19f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'
        //         // },
        //         color: {background: '#e2798b', border:'#e3a683'},
        //         size: 65,
        //         borderWidth:9,
        //     },
        //     1: {
        //         color: {background: '#dce2b5', border:'#e3de69'},
        //         size: 50,
        //         borderWidth:7,
        //     },
        //     2: {
        //         color: {background: '#bbbbbb', border:'#bbbbbb'},
        //         size: 35,
        //         borderWidth:5
        //     },
        //     3: {
        //         color: {background: '#888888', border:'#888888'},
        //         size: 20,
        //         borderWidth:3
        //     },
        //     3: {
        //         color: {background: '#555555', border:'#555555'},
        //         size: 20,
        //         borderWidth:1
        //     },
        //     4: {
        //         color: {background: '#222222', border:'#222222'},
        //         size: 20,
        //         borderWidth:1
        //     },
        // },
        nodes:{
            chosen:{
                node: function(values, id, selected, hovering) {
                    // console.error('[CHOSEN] node', values, hovering);
                    // if (hovering)
                    //     values.color = '#eeffaa';
                    // else
                    //     values.color = '#00ff00';
                },
                label: function(values, id, selected, hovering) {
                    // console.error('label', values);
                    if (hovering)
                        values.color = '#c24639';
                    else
                        values.color = '#bc5b3c';
                },
            },
            shape: 'dot', //dot, image, circularImage
            size: 30,
            font: {
                size: 32
            },
            borderWidth: 2,
            // image: {
            //     unselected: 'data:image/png;base64,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/GMzLdsAADoyaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNC0xMi0yM1QxMjozODozMyswMTowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTQtMTItMjNUMTI6Mzg6MzMrMDE6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE0LTEyLTIzVDEyOjM4OjMzKzAxOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDplNTM5OWJjMy1hYmIzLTUwNDQtYTcwOC1mZTI1MzQ3YWQ5MGY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDozNTkyYTgwYy04YTk4LTExZTQtOGYwNC1kYWI3OTI4MmQ4YjU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo0NDc3NTgzMi04YWJiLTFiNDYtYTU2ZC1iMzNlYTM1NjE5YzM8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NDQ3NzU4MzItOGFiYi0xYjQ2LWE1NmQtYjMzZWEzNTYxOWMzPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE0LTEyLTIzVDEyOjM4OjMzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmU1Mzk5YmMzLWFiYjMtNTA0NC1hNzA4LWZlMjUzNDdhZDkwZjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNC0xMi0yM1QxMjozODozMyswMTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PnGrDjMAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAANvJJREFUeNrsvXmUZPdV5/m9v+W9F1tG5F5VmVmZtUsqrZZkSZZsLLAbbAGDsJlz3IDdMIB16DaD3Q1eMINtGtocmsEc28iykLHB2AhrRp72cqZtDsKDZWPJQpK1VKkkVamyMrNyz8iM7W2/350/IiIrMyuXiKi9FPeUpFJkxMt4v/d59939R8yMtrTlchHRXoK2tIFuS1vaQLelLW2g29KWNtBtaQPdlra0gW5LW9pAt6UtbaDb0pY20G1pA92WtrSBbktbLhpR7SVoRBiwxsT5BY6NyuWE67Y1QRvoi1EsYIPAlEoymSStTaXC5bKdn4vHx8KpKbu0ZGZmzNSULS5hMY+xEwgCMTBkurtlukNu3676+kQ262zbLgeHZFcXpVLS8wQAojZbF0Tosi8fZcBGkalUTKFgTp4MT57kxcV4ZsZMT5v5eZRKmJjAzAx6eiLP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',
            //     selected: 'data:image/png;base64,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/GMzLdsAADoyaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzAxNCA3OS4xNTY3OTcsIDIwMTQvMDgvMjAtMDk6NTM6MDIgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNC0xMi0yM1QxMjo0MjoyMyswMTowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTQtMTItMjNUMTI6NDI6MjMrMDE6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE0LTEyLTIzVDEyOjQyOjIzKzAxOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDoyNjllZDdiZi0zNDAwLWYzNDItYTIxMC1hNTljNDFhNmUyYmQ8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiYmJhZjc4Yy04YTk4LTExZTQtOGYwNC1kYWI3OTI4MmQ4YjU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo2NzEzYzMzMi0wMDZkLWE0NGMtYjQ4OC01Yjg3Zjc1MGIzNDA8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NjcxM2MzMzItMDA2ZC1hNDRjLWI0ODgtNWI4N2Y3NTBiMzQwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE0LTEyLTIzVDEyOjQyOjIzKzAxOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjI2OWVkN2JmLTM0MDAtZjM0Mi1hMjEwLWE1OWM0MWE2ZTJiZDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNC0xMi0yM1QxMjo0MjoyMyswMTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDxwaG90b3Nob3A6Q29sb3JNb2RlPjM8L3Bob3Rvc2hvcDpDb2xvck1vZGU+CiAgICAgICAgIDxwaG90b3Nob3A6SUNDUHJvZmlsZT5zUkdCIElFQzYxOTY2LTIuMTwvcGhvdG9zaG9wOklDQ1Byb2ZpbGU+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0MDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PgywV9wAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAHchJREFUeNrsnWmQXNd13//nvvd6X6eX6dlXEBgsJEGQEEGKpExJEUXKKVmOopRTSUW2FdtZFFcS2UpSikuWt3JSpYqd2Irj2KmSKmW7EolSJJqSKFGUBJIANxAgAGKZpQez974v77178qEHA2AIklhmpl8337/wYfB6ppd7f33eOefeew7lcjm8t5Uqca6GO+LU+m+2QMsV0euW0TBv6+su5NmUGOmhNn72U4tyuIeCbuqa2VTxnlfMTww+v8YDPvrjFzhdZlUQE0JO/Iv3w+/erteVEu3l6MIa9wa6imYAwgYaQNxPAvRv/1ZxOwL3jgfuHvUeHPF5Pf4vPC2yhW2cb2ofS5dy7NIQ91OXTaUNNAAw4yvH5JFRT2/oKsoDuH/S+zs/kNtloRmiTTitFmVdx1CYum8qbaAB4Olz7HF7HA7Mn3/17EvPAFieO/vac19f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'
            // },
            shadow:true
        },
        edges: {
            chosen:{
                edge: function(values, id, selected, hovering) {
                    // console.error('node', values);
                    // if (hovering)
                    //     values.color = '#eeffaa';
                    // else
                    //     values.color = '#00ff00';
                },
                label: function(values, id, selected, hovering) {
                    // console.error('label', values);
                    if (hovering)
                        values.color = '#d54243';
                    else
                        values.color = '#9f462e';
                },
            },
            width: 2,
            color: {inherit:false},
            shadow:true
        },
    };
};

VisNetworkMan.loadTestDataList = function(){
    var nodeDataList = [
        {id: 0, label: 'START', group:0, url:'url/to/where/you/want/go?id=0', parentId:undefined},
        {id: 1, label: 'Node 1', group:1, parentId:0},
        {id: 2, label: 'Node 2', group:1, parentId:0},
        {id: 3, label: 'Node 3', group:1, parentId:0},
        {id: 4, label: 'Node 4', group:1, parentId:0},
        {id: 5, label: 'Node 5', group:1, parentId:0},
        {id: 7, label: 'Node 7', group:1, parentId:0},
        {id: 7, label: 'Node 7', group:2, parentId:0},
        {id: 7, label: 'Node 7', group:3, parentId:0},

        {id: 11, label: 'Node 11', group:2, parentId:1},
        {id: 12, label: 'Node 12', group:2, parentId:1},
        {id: 13, label: 'Node 13', group:2, parentId:1},
        {id: 14, label: 'Node 14', group:2, parentId:1},
        {id: 15, label: 'Node 15', group:2, parentId:1},
        {id: 15, label: 'Node 15', group:2, parentId:3},
        {id: 21, label: 'Node 21', group:2, parentId:2},
        {id: 22, label: 'Node 22', group:2, parentId:2},
        {id: 23, label: 'Node 23', group:2, parentId:2},
        {id: 24, label: 'Node 24', group:2, parentId:2},
        {id: 25, label: 'Node 25', group:2, parentId:2},
        {id: 31, label: 'Node 31', group:2, parentId:3},
        {id: 31, label: 'Node 31', group:2, parentId:3},
        {id: 32, label: 'Node 32', group:2, parentId:3},
        {id: 33, label: 'Node 33', group:2, parentId:3},
        {id: 34, label: 'Node 34', group:2, parentId:3},
        {id: 35, label: 'Node 35', group:2, parentId:3},
        {id: 41, label: 'Node 41', group:2, parentId:4},
        {id: 42, label: 'Node 42', group:2, parentId:4},
        {id: 43, label: 'Node 43', group:2, parentId:4},
        {id: 44, label: 'Node 44', group:2, parentId:4},
        {id: 45, label: 'Node 45', group:2, parentId:4},
        {id: 51, label: 'Node 51', group:2, parentId:5},
        {id: 52, label: 'Node 52', group:2, parentId:5},
        {id: 53, label: 'Node 53', group:2, parentId:5},
        {id: 54, label: 'Node 54', group:2, parentId:5},
        {id: 55, label: 'Node 55', group:2, parentId:5},
        {id: 7, label: 'Node 7', group:2, parentId:11},

        {id: 111, label: 'Node 111', group:3, parentId:11},
        {id: 112, label: 'Node 112', group:3, parentId:11},
        {id: 113, label: 'Node 113', group:3, parentId:11},
        {id: 114, label: 'Node 114', group:3, parentId:11},
        {id: 115, label: 'Node 115', group:3, parentId:11},
        {id: 121, label: 'Node 121', group:3, parentId:12},
        {id: 122, label: 'Node 122', group:3, parentId:12},
        {id: 123, label: 'Node 123', group:3, parentId:12},
        {id: 124, label: 'Node 124', group:3, parentId:12},
        {id: 125, label: 'Node 125', group:3, parentId:12},
        {id: 131, label: 'Node 131', group:3, parentId:13},
        {id: 132, label: 'Node 132', group:3, parentId:13},
        {id: 133, label: 'Node 133', group:3, parentId:13},
        {id: 134, label: 'Node 134', group:3, parentId:13},
        {id: 135, label: 'Node 135', group:3, parentId:13},
        {id: 141, label: 'Node 141', group:3, parentId:14},
        {id: 142, label: 'Node 142', group:3, parentId:14},
        {id: 143, label: 'Node 143', group:3, parentId:14},
        {id: 144, label: 'Node 144', group:3, parentId:14},
        {id: 145, label: 'Node 145', group:3, parentId:14},
        {id: 151, label: 'Node 151', group:3, parentId:15},
        {id: 152, label: 'Node 152', group:3, parentId:15},
        {id: 153, label: 'Node 153', group:3, parentId:15},
        {id: 154, label: 'Node 154', group:3, parentId:15},
        {id: 155, label: 'Node 155', group:3, parentId:15},
        {id: 7, label: 'Node 7', group:3, parentId:111},
        {id: 7, label: 'Node 7', group:3, parentId:143},
    ];
    //Default Node Options
    var defaultNodeOptions = {
        // physics: false
    };
    for (var i=0, node, optionName; i<nodeDataList.length; i++){
        node = nodeDataList[i];
        for (optionName in defaultNodeOptions){
            node[optionName] = defaultNodeOptions[optionName];
        }
    }
    return nodeDataList;
};

VisNetworkMan.loadTestNodeDataList = function(){
    var dataList = VisNetworkMan.loadTestDataList();
    var nodeDataList = [];
    var checkerMap = {};
    for (var i=0, data; i<dataList.length; i++){
        data = dataList[i];
        data.nodeId = data.id;
        data.parentNodeId = data.parentId;
        //Remove Duplicate Node
        if (!checkerMap[data.nodeId])
            nodeDataList.push(data);
        checkerMap[data.nodeId] = true;
    }
    return nodeDataList;
};