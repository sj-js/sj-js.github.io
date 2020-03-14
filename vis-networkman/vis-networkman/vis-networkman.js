/****************************************************************************************************
 *
 * Draw Graph ... using VIS-NETWORK
 *
 ****************************************************************************************************/
function VisNetworkMan(option){
    this.globalOption = {
        extendsOption: {
            /** Option - Categorizing **/
            modeMakeCategoryNode: false,
            modeMakeCategoryLinkEachNode: false,
            modeTintColorByCategory: false,
            modeDrawingCategoryBackgroundBeforeDrawing: false,
            backgroundRadiusBeforeDrawing: 75,
            tintCondition: function(){ return true },
            categoryIdAndColorMap: null,
            categoryRandomColorList: ['red','orange','yellow','green','blue','indigo','violet','grey','pink','skyblue'],
            categoryIdField: 'categoryId',
            categoryLabelField: 'categoryName',
            /** Option - Unification **/
            modeCloneNodeWhenDuplicateLink: false,
            modeUniqueDataInSameGroup: false,
            modeUniqueData: false,
            modeOrderByGroup: true,
            orderList: null,
            modePruneNodeWithoutEdge: false,
            modePruneNodeNotToRootGroup: false,
            /** Option - Effect **/
            modeLoading: true,
            modePointAllSubLink: false,
            modeSelectAllSubLink: false,
            modePreSavedSubLink: false, //TODO: 구현필요.
            modeNonPointEffect: false,
            nodeWhenStart: null,
            edgeWhenStart: null,
            nodeWhenPoint: null,
            edgeWhenPoint: null,
            nodeWhenNonPoint: { shape:'circle',  color:{background:'rgba(245,245,245,0.1)'}, borderWidth:0, font:{size:0} },
            edgeWhenNonPoint: { color:'rgba(245,245,245,0.1)' },
            nodeWhenSelect: null,
            edgeWhenSelect: null,
            /** Option - Etc **/
            container: null,
            maxDistanceWhenDragNode: null,
            maxChildNodeCount: 5,
            /** Option - ExtendsPanel **/
            modeExtendsPanel: false,
            modeExtendsPanelAutoHide: false,
            modeExtendsPanelSaveToLocalStorage: false,
            saveKey: null,
            extendsPanelToggleDefaultIndexMap:{
                'direction':0,
                'directionMethod':0,
                'duplication':0,
                'unification':0,
                'edgeLimit':4
            },
            extendsPanelShowItemList:null, //- ExampleForAll) null   //- ExampleForNothing) []   //- ExampleForSelective) ['direction', 'edgeLimit']
            extendsPanelHideItemList:null, //- ExampleForNothing) null or []   //- ExampleForSelective) ['direction', 'edgeLimit']
            /** Event for Node - Function **/
            funcEventSetupNode: null,
            funcEventHoverNode: null,
            funcEventBlurNode: null,
            funcEventHoverNodeAndMove: null,
            funcEventClickNode: null,
            funcEventClickNodeBeforeSelect: null,
            funcEventDoubleClickNode: null,
            funcEventDragNodeOverDistance: null,
            funcDataFilter: null,
            /** Event for Edge - Function **/
            funcEventSetupEdge: null,
            funcEventHoverEdge: null,
            funcEventBlurEdge: null,
            funcEventHoverEdgeAndMove: null,
            /** Event ETC - Function **/
            funcEventSetupWhenFinishRender: null,
            funcEventFinishLoading: null,
            funcEventAfterRender: null,
            funcDrawingCategoryBackground: function(node, nodePosition, color, ctx, visnetworkman){
                ctx.strokeStyle = '#d4d6d6';
                ctx.fillStyle = color || '#d6d8d6';
                ctx.beginPath();
                var radius = visnetworkman.globalOption.extendsOption.backgroundRadiusBeforeDrawing;
                ctx.arc(nodePosition.x, nodePosition.y, radius, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
            },
            funcForCustomExtendsPanel: function(panel, visnetworkman){
                //Add element to panel to add custom toggle-button
                //And use visnetman.toggleman to make toggle-button
            }
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
    this.vis = null;
    this.visNetwork = null;
    this.toggleman = new VisNetworkMan.ToggleMan();
    this.document = document;
    this.statusMouseover = false;
    this.currentHoverNode = null;
    this.currentHoverEdge = null;
    this.loadingElement = null;
    this.loadingComplete = false;

    //Data
    this.nodeIdAndDataMap = {};
    this.edgeIdAndDataMap = {};
    this.dataIdAndDataMap = {};
    this.categoryCheckMap = null;
    this.categoryIdAndColorMap = null;

    // Pointing and Selecting
    this.nodeEffectDataListMap = {};
    this.edgeEffectDataListMap = {};
    this.pointingNodeList = [];
    this.pointedNodeMap = {};
    this.pointedEdgeMap = {};
    this.nonPointedNodeMap = {};
    this.nonPointedEdgeMap = {};
    this.selectingNodeList = [];
    this.selectedNodeMap = {};
    this.selectedEdgeMap = {};

    //Merge GlobalOptions
    if (option)
        this.setup(option);
}

/***************************************************************************
 * [Node.js] exports
 ***************************************************************************/
try {
    module.exports = exports = VisNetworkMan;
} catch (e) {}





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
VisNetworkMan.prototype.setVis = function(vis){
    this.vis = vis;
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
    // if (this.globalOption.extendsOption.funcDataFilter){
    //     dataList = this.globalOption.extendsOption.funcDataFilter(dataList);
    // }
    var nodeDataList = VisNetworkMan.makeNewNodeIdDataFromDataList(dataList);
    this.cachedDataWhenLastUserSetup = {
        dataList: VisNetworkMan.cloneObject(dataList),
        nodeDataList: VisNetworkMan.cloneObject(nodeDataList),
        option: VisNetworkMan.newMergeOptionAll(option),
    };
    var container = this.renderByFilter(nodeDataList, option);
    (this.globalOption.extendsOption.funcEventSetupWhenFinishRender && this.globalOption.extendsOption.funcEventSetupWhenFinishRender(this, container));
    return container;
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
    var container = this.renderByFilter(nodeDataList, option);
    (this.globalOption.extendsOption.funcEventSetupWhenFinishRender && this.globalOption.extendsOption.funcEventSetupWhenFinishRender(this, container));
    return container;
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
    var that = this;
    /** Validate **/
    //- Check Data
    if (!nodeDataList || nodeDataList.length == 0)
        return this.makeAlertDiv('No Data', 50);

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
    /** Make - NodeData and EdgeData to SomeData **/
    if (mergedOption.extendsOption.modeMakeCategoryNode || mergedOption.extendsOption.modeMakeCategoryLinkEachNode || mergedOption.extendsOption.modeTintColorByCategory || mergedOption.extendsOption.categoryIdAndColorMap){
        this.categoryIdAndNodeListMap = VisNetworkMan.makeCategoryIdAndNodeListMap(nodeDataList, mergedOption.extendsOption.categoryIdField);
        this.categoryIdAndColorMap = (mergedOption.extendsOption.categoryIdAndColorMap) ? mergedOption.extendsOption.categoryIdAndColorMap : VisNetworkMan.makeCategoryIdAndColorMap(this.categoryIdAndNodeListMap, mergedOption.extendsOption.categoryRandomColorList);
        nodeDataList = VisNetworkMan.makeCategoryNodeAndLinkData(nodeDataList, mergedOption.extendsOption.categoryNodeWhenStart, this.categoryIdAndNodeListMap, this.categoryIdAndColorMap, mergedOption.extendsOption.modeMakeCategoryNode, mergedOption.extendsOption.modeMakeCategoryLinkEachNode, mergedOption.extendsOption.categoryIdField, mergedOption.extendsOption.categoryLabelField);
    }
    /** Make - EdgeData to parent **/
    var edgeDataList = VisNetworkMan.makeEdgeList(nodeDataList);
    /** Make - EdgeData with some condition **/ //TODO: 추후처리
    // edgeDataList.concat( VisNetworkMan.makeEdgeWithSomeConditionDataList(nodeDataList) );
    /** Event - setup node by node **/
    var nodeWhenStart = mergedOption.extendsOption.nodeWhenStart;
    if (nodeWhenStart){
        var nodeWhenStart = mergedOption.extendsOption.nodeWhenStart;
        for (var i=0, node, updateObject; i<nodeDataList.length; i++){
            node = nodeDataList[i];
            updateObject = ((nodeWhenStart instanceof Function) ? nodeWhenStart(node) : nodeWhenStart);
            VisNetworkMan.mergeIntoOption(node, updateObject);
        }
    }
    if (mergedOption.extendsOption.funcEventSetupNode){
        for (var i=0; i<nodeDataList.length; i++){
            mergedOption.extendsOption.funcEventSetupNode(nodeDataList[i]);
        }
    }
    /** Event - setup edge by edge **/
    var edgeWhenStart = mergedOption.extendsOption.edgeWhenStart;
    if (edgeWhenStart){
        for (var i=0, edge, updateObject; i<edgeDataList.length; i++){
            edge = edgeDataList[i];
            updateObject = ((edgeWhenStart instanceof Function) ? edgeWhenStart(edge) : edgeWhenStart);
            VisNetworkMan.mergeIntoOption(edge, updateObject);
        }
    }
    if (mergedOption.extendsOption.funcEventSetupEdge){
        for (var i=0; i<edgeDataList.length; i++){
            mergedOption.extendsOption.funcEventSetupEdge(edgeDataList[i]);
        }
    }
    /** Update tint images **/
    if (mergedOption.extendsOption.modeTintColorByCategory){
        this.tintColor(mergedOption.extendsOption, this.categoryIdAndNodeListMap, this.categoryIdAndColorMap);
    }
    /** Render **/
    //- Make Container Element
    var container = (mergedOption.extendsOption.container) ? mergedOption.extendsOption.container : this.makeContainerElement();
    container.style.position = 'relative';
    //- Network Element
    var containerForVisNetwork = this.makeContainerElement();
    container.appendChild( containerForVisNetwork ); //또 넣어
    this.cachedDataWhenLastUserSetup.container = container;
    //- Loading Element
    if (mergedOption.extendsOption.modeLoading){
        this.loadingElement = this.makeLoadingElement();
        container.appendChild(this.loadingElement);
    }
    if (this.globalOption.extendsOption.funcDataFilter){
        nodeDataList = this.globalOption.extendsOption.funcDataFilter(nodeDataList);
    }
    //- Render
    console.log('Try to redder!!');
    console.log('  - Check nodeDataList:', nodeDataList);
    console.log('  - Check edgeDataList:', edgeDataList);
    console.log('  - Check mergedOption:', mergedOption);
    var network = this.render(containerForVisNetwork, nodeDataList, edgeDataList, mergedOption);
    console.log('Complete rendder!!');
    /** Event - after render **/
    (mergedOption.extendsOption.funcEventAfterRender && mergedOption.extendsOption.funcEventAfterRender(network));
    /** Event **/
    this.setupEvent(network, mergedOption.extendsOption);
    container.addEventListener('mousemove', function(e){
        if (that.currentHoverNode){
            e.visnetworkman = that;
            (mergedOption.extendsOption.funcEventHoverNodeAndMove && mergedOption.extendsOption.funcEventHoverNodeAndMove(that.currentHoverNode, e));
        }
        if (that.currentHoverEdge){
            e.visnetworkman = that;
            (mergedOption.extendsOption.funcEventHoverEdgeAndMove && mergedOption.extendsOption.funcEventHoverEdgeAndMove(that.currentHoverEdge, e));
        }
    });
    container.addEventListener('mouseout', function(e){
        that.unpointNode();
    });
    /** Extends Panel **/
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

VisNetworkMan.prototype.render = function(containerForVisNetwork, nodeDataList, edgeDataList, option){
    if (!option)
        option = VisNetworkMan.assign({}, this.globalOption);
    var vis = (this.vis) ? this.vis : window.vis;
    var data = {
        nodes:new vis.DataSet(nodeDataList),
        edges:new vis.DataSet(edgeDataList)
    };
    this.data = data;
    this.nodeIdAndDataMap = data.nodes.get({returnType:"Object"});
    this.edgeIdAndDataMap = data.edges.get({returnType:"Object"});
    for (var i=0, node; i<nodeDataList.length; i++){
        node = nodeDataList[i];
        this.dataIdAndDataMap[node.dataId] = node;
    }
    var clonedObject = VisNetworkMan.cloneObject(option);
    delete clonedObject.extendsOption;
    var network = this.visNetwork = new vis.Network(containerForVisNetwork, data, clonedObject);

    /** Cluster **/
    // this.clusterTest(network);

    containerForVisNetwork.children[0].style.outline = 'none';

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
        // nodeData: VisNetworkMan.cloneObject(this.visNetwork.nodesHandler.body.data.nodes._data),
        // edgeData: VisNetworkMan.cloneObject(this.visNetwork.nodesHandler.body.data.edges._data),
        nodeData: VisNetworkMan.cloneObject(this.nodeIdAndDataMap),
        edgeData: VisNetworkMan.cloneObject(this.edgeIdAndDataMap),
    };
    //- Cache AfterWorking-Data
    this.cachedDataWhenAfterWorking = {
        option: option,
        nodeDataList: nodeDataList,
        // nodeData: this.visNetwork.nodesHandler.body.data.nodes._data,
        // edgeData: this.visNetwork.nodesHandler.body.data.edges._data,
        nodeData: this.nodeIdAndDataMap,
        edgeData: this.edgeIdAndDataMap,
    };
    return network;
};


VisNetworkMan.prototype.cluster = function(params){
    this.visNetwork.cluster(params);
    return this;
};

VisNetworkMan.prototype.clusterTest = function(visNetwork){
    var categoryList = ['side','job'];
    var clusterOptionsByData;
    for (var i = 0; i < categoryList.length; i++) {
        var category = categoryList[i];
        clusterOptionsByData = {
            joinCondition: function(childOptions){ return childOptions.categoryId == category; },
            processProperties: function(clusterOptions, childNodes, childEdges){
                // var totalMass = 0;
                // for (var i = 0; i < childNodes.length; i++) {
                //     totalMass += childNodes[i].mass;
                // }
                // clusterOptions.mass = totalMass;
                return clusterOptions;
            },
            clusterNodeProperties: {id:'cluster_' +category, borderWidth:3, shape:'database', color:'yellow', label:'category_' +category}
        };
        visNetwork.cluster(clusterOptionsByData);
    }
};




VisNetworkMan.prototype.mergeExtendsOptionToCorrectProperty = function(option){
    if (!option.extendsOption)
        option.extendsOption = {};
    for (var key in this.globalOption.extendsOption){
        option.extendsOption[key] = option.hasOwnProperty(key) ? option[key] : option.extendsOption[key];
        delete option[key];
    }
    return this;
};


VisNetworkMan.prototype.updateNodeAll = function(updateObject, funcForCondition){
    var that = this;
    console.error('[updateNodeAll] START', updateObject);  //TODO: Category도 Node별로 Image가 다를 수 있잖아!? 그걸 간과했네!? 개발진행해??...
    this.eachNode(function(node){
        if (funcForCondition && !funcForCondition(node))
            return; //= continue;
        // console.error('updateNodeAll', node.id, updateObject, node);
        node = VisNetworkMan.mergeIntoOption(node, updateObject);
        that.cachedDataWhenStartRendering.nodeData[node.id] = node;
        that.visNetwork.nodesHandler.body.data.nodes.update(node);
    });
};


// VisNetworkMan.prototype.addNodeTemp = function(dataId){
//     var that = this;
//     console.error(this.cachedDataWhenLastUserSetup.nodeDataList);
//     for (var i=0, node; i<this.cachedDataWhenLastUserSetup.nodeDataList.length;i++){
//         node = this.cachedDataWhenLastUserSetup.nodeDataList[i];
//         if (node.dataId == dataId){
//             console.error(node);
//             that.data.nodes.add(node);
//         }
//     };
//     console.error(this.dataIdAndDataMap[dataId]);
// };


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
    var dom = this.document;
    var buttonForOptionUnification = dom.createElement('button');
    VisNetworkMan.addClass(buttonForOptionUnification, VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    var buttonForOptionDuplication = dom.createElement('button');
    VisNetworkMan.addClass(buttonForOptionDuplication, VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    var buttonForOptionDirection = dom.createElement('button');
    VisNetworkMan.addClass(buttonForOptionDirection, VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    var buttonForOptionDirectionMethod = dom.createElement('button');
    VisNetworkMan.addClass(buttonForOptionDirectionMethod, VisNetworkMan.CLASS_EXTENDPANEL_OPTION_BUTTON);
    /** SELECT - option **/
    var selectForOptionEdgeLimit = dom.createElement('select');
    VisNetworkMan.addClass(selectForOptionEdgeLimit, VisNetworkMan.CLASS_EXTENDPANEL_OPTION_SELECT);

    /** Button - Zoom **/
    var inputForZoom = this.inputForZoom = dom.createElement('input');
    VisNetworkMan.addClass(inputForZoom, VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_RANGE);
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
    var buttonForZoomIn = dom.createElement('button');
    VisNetworkMan.addClass(buttonForZoomIn, VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_BUTTON);
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
    var buttonForZoomOut = dom.createElement('button');
    VisNetworkMan.addClass(buttonForZoomOut, VisNetworkMan.CLASS_EXTENDPANEL_ZOOM_BUTTON);
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
    var buttonForNewWindow = dom.createElement('button');
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
    var panelForButtons = dom.createElement('div');
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
    var panelForZoom = dom.createElement('div');
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
    var panelForBefore = dom.createElement('div');
    panelForBefore.style.display = 'inline-block';

    //- Panel For After
    var panelForAfter = dom.createElement('div');
    panelForAfter.style.display = 'inline-block';

    /** Panel - top-sticker **/
    var panel = dom.createElement('div');
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
    panel.appendChild(dom.createElement('br'));
    panel.appendChild(panelForBefore);
    panel.appendChild(dom.createElement('br'));
    panel.appendChild(panelForZoom);
    panel.appendChild(dom.createElement('br'));
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
        VisNetworkMan.removeClass(itemList[i], VisNetworkMan.ToggleMan.CLASS_TOGGLE_ON);
        VisNetworkMan.addClass(itemList[i], VisNetworkMan.ToggleMan.CLASS_TOGGLE_OFF);
    }
    if (itemList[nextIndex]){
        VisNetworkMan.removeClass(itemList[nextIndex], VisNetworkMan.ToggleMan.CLASS_TOGGLE_OFF);
        VisNetworkMan.addClass(itemList[nextIndex], VisNetworkMan.ToggleMan.CLASS_TOGGLE_ON);
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



VisNetworkMan.prototype.tintColor = function(extendsOption, categoryIdAndNodeListMap, categoryIdAndColorMap){
    for (var categoryId in categoryIdAndNodeListMap){
        var color = categoryIdAndColorMap[categoryId];
        var nodeList = categoryIdAndNodeListMap[categoryId];
        var imageSrcMap = {};
        for (var i=0, node; i<nodeList.length; i++){
            node = nodeList[i];
            //If has image then update tint image async
            if (node.image && node.image.unselected){
                var imgSrc = node.image.unselected;
                if (!imageSrcMap[imgSrc]){
                    imageSrcMap[imgSrc] = true;
                    this.tintImageAsync(imgSrc, color, categoryId, extendsOption.tintCondition);
                }
            //If has no image then update color
            }else{
                node.color = VisNetworkMan.mergeIntoOption(node.color, { background:color });
            }
        }
    }
};

VisNetworkMan.prototype.tintImageAsync = function(imgSrc, color, categoryId, tintCondition){
    var that = this;
    tintCondition = tintCondition ? tintCondition : function(){};
    VisNetworkMan.onLoadTintImage(imgSrc, color, 0.2, function(image){
        that.updateNodeAll({image:{ unselected:image.src }}, function(node){
            return (node.categoryId == categoryId && node.image && node.image.unselected && tintCondition(node));
        });
    });
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
    for (var i=0, newNodeData; i<dataList.length; i++){
        newNodeData = VisNetworkMan.makeNodeData(dataList[i], i);
        newNodeDataList.push( newNodeData );
    }
    return newNodeDataList;
};

VisNetworkMan.makeNodeData = function(data, nodeId){
    var newNodeData = VisNetworkMan.assign({}, data);
    newNodeData['parentNodeIdList'] = []; //NodeId
    newNodeData['childNodeIdList'] = []; //NodeId
    newNodeData['sameCategoryNodeIdList'] = []; //NodeId
    newNodeData['parentEdgeIdList'] = []; //EdgeId
    // newNodeData['parentNodeList'] = []; //Node
    // newNodeData['parentEdgeList'] = []; //Edge
    newNodeData['id'] = nodeId; //NodeId
    newNodeData['nodeId'] = nodeId; //NodeId
    newNodeData['dataId'] = data.id; //DataId
    newNodeData['parentDataId'] = data.parentId; //DataId
    return newNodeData;
};

VisNetworkMan.makeNewNodeIdDataFromNodeDataList = function (nodeDataList){
    if (!nodeDataList)
        return [];
    //- Make newNodeDataList
    var newNodeDataList = [];
    for (var i=0, data, newNodeData; i<nodeDataList.length; i++){
        data = nodeDataList[i];
        newNodeData = VisNetworkMan.assign({}, data);
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
    // var newMergedOption = VisNetworkMan.assign({}, standardOption);
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
                    else if (nextValue[i] instanceof Element)
                        mergedValue = nextValue[i];
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
                    else if (nextValue[key] instanceof Element)
                        mergedValue = nextValue[key];
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

/*****
 * Javascript Object.assign Alternative.
 * @param target
 * @returns {*}
 *****/
VisNetworkMan.assign = function(target){
    for (var i=1; i<arguments.length; i++){
        var source = arguments[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)){
                target[key] = source[key];
            }
        }
    }
    return target;
};

VisNetworkMan.addClass = function(target, className){
    if (target.classList){
        target.classList.add(className);
    }else{
        target.className += ' ' +className+ ' ';
    }
};
VisNetworkMan.removeClass = function(target, className){
    if (target.classList){
        target.classList.remove(className);
    }else if (target.className !== undefined){
        var classList = target.className.split(' ');
        while (classList.indexOf(className) != -1){
            classList.splice(classList.indexOf(className), 1);
        }
        target.className = classList.join(' ');
    }
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
                            var clonedChildNodeData = VisNetworkMan.assign({}, childNodeData);
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
    if (extendsOption.modePruneNodeNotToRootGroup){
        var pruneNoParentAndNoRoot = function(nodeData){
            if (nodeData.parentNodeIdList.length == 0 && nodeData.group != extendsOption.orderList[0]){
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
    if (extendsOption.modePruneNodeWithoutEdge){
        for (var i=nodeDataList.length -1, nodeData; i>-1; i--){
            nodeData = nodeDataList[i];
            if (nodeData.parentNodeIdList.length == 0 && nodeData.childNodeIdList.length == 0)
                nodeDataList.splice(i, 1);
        }
    }

};



VisNetworkMan.makeEdgeList = function(nodeDataList){
    var edgeDataList = [];
    for (var i=0, nodeData; i<nodeDataList.length; i++){
        nodeData = nodeDataList[i];
        //- Parent to Child
        for (var ii=0, parentNodeId, parentNode, edge; ii<nodeData.parentNodeIdList.length; ii++){
            parentNodeId = nodeData.parentNodeIdList[ii];
            parentNode = VisNetworkMan.selectById(nodeDataList, parentNodeId);
            edge = {
                from: parentNodeId,
                to: nodeData.id,
                fromNode: parentNode,
                toNode: nodeData,
                type: 'normal'
            };
            edgeDataList.push(edge);
            // nodeData.parentNodeList.push(parentNode);
            // nodeData.parentEdgeList.push(edge);
        }
        //- Category
        for (var ii=0, sameCategoryNodeId, sameCategoryNode, edge; ii<nodeData.sameCategoryNodeIdList.length; ii++){
            sameCategoryNodeId = nodeData.sameCategoryNodeIdList[ii];
            sameCategoryNode = VisNetworkMan.selectById(nodeDataList, sameCategoryNodeId); //TODO: 요것 좀 느리겠는데?.. ==> 개선해야할듯!?
            edge = {
                from: sameCategoryNodeId,
                to: nodeData.id,
                fromNode: sameCategoryNode,
                toNode: nodeData,
                type: 'category',
                noEffectEdge: true
            };
            edgeDataList.push(edge);
            // nodeData.parentNodeList.push(parentNode);
            // nodeData.parentEdgeList.push(edge);
        }
    }
    return edgeDataList;
};

VisNetworkMan.makeCategoryNodeAndLinkData = function(nodeDataList, categoryNodeWhenStart, categoryIdAndNodeListMap, categoryIdAndColorMap, modeMakeCategoryNode, modeMakeCategoryLinkEachNode, categoryIdField, categoryLabelField){
    /** Get Max Seq ID **/
    var maxSeqId = -1;
    for (var i=0; i<nodeDataList.length; i++){
        maxSeqId = (maxSeqId > nodeDataList[i].id) ? maxSeqId : nodeDataList[i].id;
    }

    /** Making CategoryNode and LinkData **/
    for (var categoryId in categoryIdAndNodeListMap){
        var nodeDataByCategoryList = categoryIdAndNodeListMap[categoryId];
        var categoryLabel = nodeDataByCategoryList[0][categoryLabelField];
        var color = categoryIdAndColorMap[categoryId];
        var nodeForCategory;

        //- Make Category Node
        if (modeMakeCategoryNode){
            var categoryNodeDefaultOption = VisNetworkMan.mergeIntoOption({label:categoryLabel}, categoryNodeWhenStart);
            categoryNodeDefaultOption[categoryIdField] = categoryId;
            nodeForCategory = VisNetworkMan.makeNodeData(categoryNodeDefaultOption, ++maxSeqId);
        }

        //- Make metadata - Linked by Category
        var nodeDataByCategoryListLength = nodeDataByCategoryList.length;
        for (var ii=0, nodeDataA; ii<nodeDataByCategoryListLength -1; ii++){
            nodeDataA = nodeDataByCategoryList[ii];
            //Data-Node to Category-Node
            if (modeMakeCategoryNode)
                nodeForCategory.sameCategoryNodeIdList.push(nodeDataA.id);
            //Data-Node to other Data-Node
            if (modeMakeCategoryLinkEachNode){
                for (var jj=ii+1, nodeDataB; jj<nodeDataByCategoryListLength; jj++){
                    nodeDataB = nodeDataByCategoryList[jj];
                    nodeDataB.sameCategoryNodeIdList.push(nodeDataA.id);
                }
            }
        }

        //마무리
        if (modeMakeCategoryNode){
            //Loop를 아끼려고 위에 N(N-1) Loop에 얻혀서 CategoryNode에 연관 Node관계정보를 넣고 있으며.. 최종Node는 어쩔 수 없이 수동으로 넣어야 OK!
            nodeForCategory.sameCategoryNodeIdList.push(nodeDataByCategoryList[nodeDataByCategoryListLength-1].id);
            //nodeDataByCategoryList에 넣어두어야 TintColor를 할 수있다. (이곳에서 넣어야 재귀Edge생성을 막는다.)
            nodeDataList.push( nodeForCategory );
            nodeDataByCategoryList.push( nodeForCategory );
        }
    }
    return nodeDataList;
};

VisNetworkMan.makeCategoryIdAndNodeListMap = function(nodeDataList, categoryIdField){
    //- Make Category Group
    var categoryIdAndNodeListMap = {};
    for (var i=0, nodeData, categoryId; i<nodeDataList.length; i++){
        nodeData = nodeDataList[i];
        categoryId = nodeData[categoryIdField];  //TODO: 필드변수String Parser 있으면 더 멋지고 다양한 데이터구조로도 Categorinzing 되겟는데

        if (categoryId != null){
            if (!categoryIdAndNodeListMap[categoryId])
                categoryIdAndNodeListMap[categoryId] = [];
            categoryIdAndNodeListMap[categoryId].push(nodeData);
        }
    }
    return categoryIdAndNodeListMap;
};

VisNetworkMan.makeCategoryIdAndColorMap = function(categoryIdAndNodeListMap, categoryRandomColorList){
    //Make Category ColorMap
    var categoryIdAndColorMap = {};
    var categoryIdList = Object.keys(categoryIdAndNodeListMap);
    for (var i=0, categoryId; i<categoryIdList.length; i++){
        categoryId = categoryIdList[i];
        categoryIdAndColorMap[categoryId] = categoryRandomColorList[i];
    }
    return categoryIdAndColorMap;
};

VisNetworkMan.selectById = function(nodeDataList, idToSelect){
    for (var i=0; i<nodeDataList.length; i++){
        if (nodeDataList[i].id == idToSelect)
            return nodeDataList[i];
    }
    return null;
};





VisNetworkMan.prototype.makeContainerElement = function(){
    var container = this.document.createElement('div');
    // container.setAttribute('id', 'mynetwork');
    container.style.width = '100%';
    container.style.height = '100%';
    return container;
};

VisNetworkMan.prototype.makeLoadingElement = function(){
    var loadingContainer = this.document.createElement('div');
    var outerBorderDiv = this.document.createElement('div');
    var textDiv = this.document.createElement('div');
    var borderDiv = this.document.createElement('div');
    var barDiv = this.document.createElement('div');
    VisNetworkMan.addClass(loadingContainer, 'visnetworkman-loading-container');
    VisNetworkMan.addClass(outerBorderDiv, 'visnetworkman-loading-outer-border');
    VisNetworkMan.addClass(textDiv, 'visnetworkman-loading-text');
    VisNetworkMan.addClass(borderDiv, 'visnetworkman-loading-border');
    VisNetworkMan.addClass(barDiv, 'visnetworkman-loading-bar');
    borderDiv.appendChild(barDiv);
    outerBorderDiv.appendChild(textDiv);
    outerBorderDiv.appendChild(borderDiv);
    loadingContainer.appendChild(outerBorderDiv);
    return loadingContainer;
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

    /*************************
     * Stabilization
     *************************/
    network.on("stabilizationProgress", function(params) {
        if (!extendsOption.modeLoading)
            return;
        try{
            var outerDiv = that.loadingElement.children[0];
            var textDiv = outerDiv.children[0];
            var borderDiv = outerDiv.children[1];
            var barDiv = borderDiv.children[0];

            // var borderDiv = that.document.getElementById('border');
            var rect = borderDiv.getBoundingClientRect();
            var maxWidth = rect.width || 496;
            var minWidth = 20;
            var widthFactor = params.iterations/params.total;
            var width = Math.max(minWidth, maxWidth * widthFactor);
            barDiv.style.width = width + 'px';
            textDiv.innerHTML = Math.round(widthFactor*100) + '%';
        }catch(e){
            //Loading을 표현하다가 에러나도 무시~
        }
    });
    network.once("stabilizationIterationsDone", function() {
        if (!extendsOption.modeLoading){
            that.loadingComplete = true;
            return;
        }
        try{
            var outerDiv = that.loadingElement.children[0];
            var textDiv = outerDiv.children[0];
            var borderDiv = outerDiv.children[1];
            var barDiv = borderDiv.children[0];
            // var borderDiv = that.document.getElementById('border');
            var rect = borderDiv.getBoundingClientRect();
            var maxWidth = rect.width || 496;
            textDiv.innerHTML = '100%';
            barDiv.style.width = maxWidth +'px';
            that.loadingElement.style.opacity = 0;
            that.loadingComplete = true;
            //Event
            (extendsOption.funcEventFinishLoading && extendsOption.funcEventFinishLoading(that));
            setTimeout(function () {
                that.loadingElement.style.display = 'none';
                // network.setOptions({physics:{enabled:false}});
            }, 500);
        }catch(e){
            //Loading을 표현하다가 에러나도 무시~
        }
    });

    /*************************
     * Drawing
     *************************/
    network.on("initRedraw", function(){
        //None
    });
    network.on("beforeDrawing", function(ctx){
        if (!extendsOption.modeDrawingCategoryBackgroundBeforeDrawing)
            return;
        var nodeIdAndDataMap = that.nodeIdAndDataMap;
        var categoryIdAndColorMap = that.categoryIdAndColorMap;
        var categoryIdField = extendsOption.categoryIdField;
        var animationDelta = 0.016;
        var radius = extendsOption.backgroundRadiusBeforeDrawing;
        for (var nodeId in nodeIdAndDataMap){
            var node = nodeIdAndDataMap[nodeId];
            var categoryId = node[categoryIdField];
            var color = categoryIdAndColorMap[categoryId];
            if (!color)
                continue;
            var nodePositions = network.getPositions([nodeId]);
            var nodePosition = nodePositions[nodeId];
            extendsOption.funcDrawingCategoryBackground(node, nodePosition, color, ctx, that);
        }
    });
    network.on("afterDrawing", function(ctx){
        //None
    });

    /*************************
     * Action by user
     *************************/
    network.on('click', function(e){
        var nodes = that.nodeIdAndDataMap;
        var edges = that.edgeIdAndDataMap;
        e.visnetworkman = that;
        //- Click Node
        for (var i=0, nodeId, node; i<e.nodes.length; i++){
            nodeId = e.nodes[i];
            node = nodes[nodeId];
            (extendsOption.funcEventClickNode && extendsOption.funcEventClickNode(node, e));
        }
    });
    network.on('doubleClick', function(e){
        // console.log('dbclick', e, e.nodes);
        if (e.nodes){
            var nodes = that.nodeIdAndDataMap;
            var edges = that.edgeIdAndDataMap;
            e.visnetworkman = that;
            //- DoubleClick Node
            for (var i=0, nodeId, node; i<e.nodes.length; i++){
                nodeId = e.nodes[i];
                node = nodes[nodeId];
                (extendsOption.funcEventDoubleClickNode && extendsOption.funcEventDoubleClickNode(node, e));
            }
        }
    });
    network.on('oncontext', function(e){
        console.log('oncontext', e);
    });
    network.on('hoverNode', function(e){
        // console.log('hoverNode', e, e.node);
        that.document.body.style.cursor = 'pointer';
        var nodes = that.nodeIdAndDataMap;
        var edges = that.edgeIdAndDataMap;
        var nodeId = e.node;
        var node = nodes[nodeId];
        e.visnetworkman = that;
        that.currentHoverNode = node;
        if (node){
            //Event
            (extendsOption.funcEventHoverNode && extendsOption.funcEventHoverNode(node, e));
            //All SubLink Highlight
            if (extendsOption.modePointAllSubLink)
                that.pointNode(nodeId, extendsOption.nodeWhenPoint, extendsOption.edgeWhenPoint);
        }else if (network.clustering.isCluster(nodeId)){
            //TODO: Test
            //Event
            (extendsOption.funcEventHoverNode && extendsOption.funcEventHoverNode(node, e));
            if (extendsOption.modePointAllSubLink)
                network.clustering.updateClusteredNode(nodeId, extendsOption.clusterWhenPoint);
        }
    });
    network.on('blurNode', function(e){
        // console.log('blurNode', e, e.node);
        that.document.body.style.cursor = 'auto';
        var nodes = that.nodeIdAndDataMap;
        var edges = that.edgeIdAndDataMap;
        var nodeId = e.node;
        var node = nodes[nodeId];
        e.visnetworkman = that;
        that.currentHoverNode = null;
        if (node){
            //EVENT
            (extendsOption.funcEventBlurNode && extendsOption.funcEventBlurNode(node, e));
            //All SubLink Highlight
            if (extendsOption.modePointAllSubLink)
                that.unpointNode();
        }else if (network.clustering.isCluster(nodeId)){
            //TODO: Test
            //Event
            (extendsOption.funcEventBlurNode && extendsOption.funcEventBlurNode(node, e));
            if (extendsOption.modePointAllSubLink)
                network.clustering.updateClusteredNode(nodeId, extendsOption.clusterWhenStart);
        }
    });
    network.on('hoverEdge', function(e){
        // console.log('hoverEdge', e, e.edge);
        that.document.body.style.cursor = 'pointer';
        var nodes = that.nodeIdAndDataMap;
        var edges = that.edgeIdAndDataMap;
        var edgeId = e.edge;
        var edge = edges[edgeId];
        if (edge){
            e.visnetworkman = that;
            that.currentHoverEdge = edge;
            //Event
            (extendsOption.funcEventHoverEdge && extendsOption.funcEventHoverEdge(edge, e));
            //All SubLink Highlight
            if (extendsOption.modePointAllSubLink)
                that.pointNode(edge.toNode.id, extendsOption.nodeWhenPoint, extendsOption.edgeWhenPoint);
        }
    });
    network.on('blurEdge', function(e){
        // console.log('blurEdge', e, e.edge);
        that.document.body.style.cursor = 'auto';
        var nodes = that.nodeIdAndDataMap;
        var edges = that.edgeIdAndDataMap;
        var edgeId = e.edge;
        var edge = edges[edgeId];
        if (edge){
            e.visnetworkman = that;
            that.currentHoverEdge = null;
            //Event
            (extendsOption.funcEventBlurEdge && extendsOption.funcEventBlurEdge(edge, e));
            //All SubLink Highlight
            if (extendsOption.modePointAllSubLink)
                that.unpointNode();
        }
    });
    network.on('selectNode', function(e){
        // console.log('selectNode', e, e.nodes[0]);
        // var ctrlKeyDown = e.event.srcEvent.altKey;
        // var altKeyDown = e.event.srcEvent.ctrlKey;
        var startTime = new Date().getTime();
        var nodes = that.nodeIdAndDataMap;
        var nodeId = e.nodes[0];
        var node = nodes[nodeId];
        e.visnetworkman = that;
        if (node){
            //- Click Node
            (extendsOption.funcEventClickNodeBeforeSelect && extendsOption.funcEventClickNodeBeforeSelect(node, e));
            //All SubLink Highlight
            if (extendsOption.modeSelectAllSubLink){
                if (extendsOption.modePreSavedSubLink){
                    that.selectNode(nodeId, extendsOption.nodeWhenSelect, extendsOption.edgeWhenSelect);
                }else{
                    that.selectNode(nodeId, extendsOption.nodeWhenSelect, extendsOption.edgeWhenSelect);
                }
            }
        }
        var endTime = new Date().getTime();
        console.error('Select ElaspedTime: ', endTime - startTime);

    });
    network.on('selectEdge', function(e){
        // console.log('selectEdge', e, e.edges[0]);
        var edges = that.edgeIdAndDataMap;
        var edgeId = e.edges[0];
        var edge = edges[edgeId];
        e.visnetworkman = that;
        if (edge){
            //All SubLink Highlight
            if (extendsOption.modeSelectAllSubLink)
                that.selectNode(edge.toNode.id, extendsOption.nodeWhenSelect, extendsOption.edgeWhenSelect);
        }
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
        // var nodes = network.nodesHandler.body.data.nodes;
        var nodes = that.nodeIdAndDataMap;
        var nodeId = e.nodes[0];
        var node = nodes[nodeId];
        if (!node)
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
    var nodes = this.nodeIdAndDataMap;
    var edges = this.edgeIdAndDataMap;
    //- Check Toggle Node
    this.pointingNodeList.push(nodeId);
    //- Update Render
    this.effectPointNodeWithSublinks(
        nodeId,
        nodeDataToUpdate ? nodeDataToUpdate : this.globalOption.extendsOption.nodeWhenPoint,
        edgeDataToUpdate ? edgeDataToUpdate : this.globalOption.extendsOption.edgeWhenPoint
    );
    this.renderNodeEffect(Object.keys(this.pointedNodeMap));
    this.renderEdgeEffect(Object.keys(this.pointedEdgeMap));
    if (this.globalOption.extendsOption.modeNonPointEffect)
        this.runNonPointEffect();
    return this;
};
VisNetworkMan.prototype.pointNodeByDataId = function(dataId){
    var node = this.dataIdAndDataMap[dataId];
    if (!node)
        return;
    var nodeId = node.id;
    this.pointNode(nodeId);
    return this;
};
VisNetworkMan.prototype.unpointNode = function(){
    var that = this;
    var releaseEffectPointNodeIdList = Object.keys(that.pointedNodeMap);
    var releaseEffectPointEdgeIdList = Object.keys(that.pointedEdgeMap);
    that.releaseEffectPointNode();
    that.releaseEffectPointEdge();
    that.renderNodeEffect(releaseEffectPointNodeIdList);
    that.renderEdgeEffect(releaseEffectPointEdgeIdList);
    if (this.globalOption.extendsOption.modeNonPointEffect)
        this.stopNonPointEffect();
    return this;
};



VisNetworkMan.prototype.effectPointNodeWithSublinks = function(node, updateNodeData, updateEdgeData){
    var nodes = this.nodeIdAndDataMap;
    var edges = this.edgeIdAndDataMap;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id;
    }else{
        nodeId = node;
        node = nodes[nodeId];
    }
    this.effectPointNode(node, updateNodeData);
    // this.effectPointEdge(node.parentEdgeIdList, updateEdgeData);
    for (var i=0, parentNodeId, parentNode, parentEdgeId, parentEdge; i<node.parentEdgeIdList.length; i++){
        parentEdgeId = node.parentEdgeIdList[i];
        parentEdge = edges[parentEdgeId];
        if (parentEdge.noEffectEdge)
            continue;
        if (parentEdge.fromNode.group == node.group) //TODO:test
            continue;
        this.effectPointEdge(parentEdgeId, updateEdgeData);
        parentNode = parentEdge.fromNode;
        parentNodeId = parentNode.id;
        if (this.pointedNodeMap[parentNodeId])
            continue;
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
    var nodes = this.nodeIdAndDataMap;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id
    }else{
        nodeId = node;
        node = nodes[nodeId];
    }
    if (node == null)
        return;
    //AddEffect
    if (updateObject instanceof Function)
        updateObject = (updateObject && updateObject(node));
    updateObject.effectType = VisNetworkMan.EFFECT_TYPE_POINT;
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
    var edges = this.edgeIdAndDataMap;
    var edgeId;
    if (typeof edge == 'object'){
        edgeId = edge.id;
    }else{
        edgeId = edge;
        edge = edges[edgeId];
    }
    if (edge == null)
        return;
    if (this.pointedEdgeMap[edge.id])
        return false;
    //AddEffect
    if (updateObject instanceof Function)
        updateObject = (updateObject && updateObject(edge));
    updateObject.effectType = VisNetworkMan.EFFECT_TYPE_POINT;
    this.pointedEdgeMap[edge.id] = updateObject;
    this.addEdgeEffect(edge.id, updateObject);
    return true;
};



VisNetworkMan.prototype.releaseEffectPointNode = function(node){
    if (node != null){
        var nodes = this.nodeIdAndDataMap;
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
        var edges = this.edgeIdAndDataMap;
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
    }else{
        var foundIndex = effectDataList.indexOf(effectObject);
        if (foundIndex != -1)
            effectDataList.splice(foundIndex, 1);
    }
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
    }else{
        var foundIndex = effectDataList.indexOf(effectObject);
        if (foundIndex != -1)
            effectDataList.splice(foundIndex, 1);
    }
    return this;
};
VisNetworkMan.prototype.renderNodeEffect = function(targetIdList){
    var nodes = this.nodeIdAndDataMap;
    var edges = this.edgeIdAndDataMap;
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
        this.visNetwork.nodesHandler.body.data.nodes.update(mergedObject);
    }
};
VisNetworkMan.prototype.renderEdgeEffect = function(targetIdList){
    var nodes = this.nodeIdAndDataMap;
    var edges = this.edgeIdAndDataMap;
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
        this.visNetwork.nodesHandler.body.data.edges.update(mergedObject);
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



VisNetworkMan.prototype.runNonPointEffect = function(){
    //TODO: TEst
    var nodes = this.nodeIdAndDataMap;
    var edges = this.edgeIdAndDataMap;
    var nonPointNodeToUpdate = this.globalOption.extendsOption.nodeWhenNonPoint;
    var nonPointEdgeToUpdate = this.globalOption.extendsOption.edgeWhenNonPoint;
    var mergedObject;
    for (var nodeId in nodes){
        var node = nodes[nodeId];
        if (!this.pointedNodeMap[nodeId]){
            this.nonPointedNodeMap[nodeId] = node;
            mergedObject = VisNetworkMan.newMergeOptionAll(node, nonPointNodeToUpdate);
            this.visNetwork.nodesHandler.body.data.nodes.update(mergedObject);
        }
        for (var i=0, parentNodeId; i<node.parentEdgeIdList.length; i++){
            parentNodeId = node.parentEdgeIdList[i];
            if (!this.pointedEdgeMap[parentNodeId]){
                var edge = edges[parentNodeId];
                if (edge){
                    this.nonPointedEdgeMap[parentNodeId] = edge;
                    mergedObject = VisNetworkMan.newMergeOptionAll(edge, nonPointEdgeToUpdate);
                    this.visNetwork.nodesHandler.body.data.edges.update(mergedObject);
                }
            }
        }
    }
    return this;
};

VisNetworkMan.prototype.stopNonPointEffect = function(){
    //TODO: TEst
    for (var nodeId in this.nonPointedNodeMap){
        var node = this.nonPointedNodeMap[nodeId];
        var nodeWhenStarting = this.cachedDataWhenStartRendering.nodeData[nodeId];
        var mergedObject = VisNetworkMan.newMergeOptionAll(nodeWhenStarting, node);
        this.visNetwork.nodesHandler.body.data.nodes.update(mergedObject);
        delete this.nonPointedNodeMap[nodeId];
    }
    for (var edgeId in this.nonPointedEdgeMap){
        var edge = this.nonPointedEdgeMap[edgeId];
        var edgeWhenStarting = this.cachedDataWhenStartRendering.edgeData[edgeId];
        var mergedObject = VisNetworkMan.newMergeOptionAll(edgeWhenStarting, edge);
        this.visNetwork.nodesHandler.body.data.edges.update(mergedObject);
        delete this.nonPointedEdgeMap[edgeId];
    }
    return this;
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
    this.effectSelectNodeWithSublinks(
        nodeId,
        nodeDataToUpdate ? nodeDataToUpdate : this.globalOption.extendsOption.nodeWhenSelect,
        edgeDataToUpdate ? edgeDataToUpdate : this.globalOption.extendsOption.edgeWhenSelect
    );
    this.renderNodeEffect(Object.keys(this.selectedNodeMap));
    this.renderEdgeEffect(Object.keys(this.selectedEdgeMap));
};
VisNetworkMan.prototype.selectNodeByDataId = function(dataId){
    var node = this.dataIdAndDataMap[dataId];
    if (!node)
        return;
    var nodeId = node.id;
    this.selectNode(nodeId);
};
VisNetworkMan.prototype.unselectNode = function(){
    var that = this;
    var releaseEffectSelectNodeIdList = Object.keys(this.selectedNodeMap);
    var releaseEffectSelectEdgeIdList = Object.keys(this.selectedEdgeMap);
    this.releaseEffectSelectEdge();
    this.releaseEffectSelectNode();
    this.renderNodeEffect(releaseEffectSelectNodeIdList);
    this.renderEdgeEffect(releaseEffectSelectEdgeIdList);
};
VisNetworkMan.prototype.effectSelectNodeWithSublinks = function(node, updateNodeData, updateEdgeData){
    var nodes = this.nodeIdAndDataMap;
    var edges = this.edgeIdAndDataMap;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id;
    }else{
        nodeId = node;
        node = nodes[nodeId];
    }
    this.effectSelectNode(node, updateNodeData);
    // this.effectSelectEdge(node.parentEdgeIdList, updateEdgeData);
    for (var i=0, parentNodeId, parentNode, parentEdgeId, parentEdge; i<node.parentEdgeIdList.length; i++){
        parentEdgeId = node.parentEdgeIdList[i];
        parentEdge = edges[parentEdgeId];
        if (parentEdge.noEffectEdge)
            continue;
        if (parentEdge.fromNode.group == node.group) //TODO:test
            continue;
        this.effectSelectEdge(parentEdgeId, updateEdgeData);
        parentNode = parentEdge.fromNode;
        parentNodeId = parentNode.id;
        if (this.selectedNodeMap[parentNodeId])
            continue;
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
    var nodes = this.nodeIdAndDataMap;
    var nodeId;
    if (typeof node == 'object'){
        nodeId = node.id
    }else{
        nodeId = node;
        node = nodes[nodeId];
    }
    //AddEffect
    if (updateObject instanceof Function)
        updateObject = (updateObject && updateObject(node));
    updateObject.effectType = VisNetworkMan.EFFECT_TYPE_SELECT;
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
    var edges = this.edgeIdAndDataMap;
    var edgeId;
    if (typeof edge == 'object'){
        edgeId = edge.id;
    }else{
        edgeId = edge;
        edge = edges[edgeId];
    }
    //AddEffect
    if (updateObject instanceof Function)
        updateObject = (updateObject && updateObject(edge));
    updateObject.effectType = VisNetworkMan.EFFECT_TYPE_SELECT;
    this.selectedEdgeMap[edge.id] = updateObject;
    this.addEdgeEffect(edge.id, updateObject);
};

VisNetworkMan.prototype.releaseEffectSelectNode = function(node){
    if (node != null){
        var nodes = this.nodeIdAndDataMap;
        var edges = this.edgeIdAndDataMap;
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
        var nodes = this.nodeIdAndDataMap;
        var edges = this.edgeIdAndDataMap;
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
VisNetworkMan.prototype.getNode = function(nodeId){
    return this.nodeIdAndDataMap[nodeId];
};

VisNetworkMan.prototype.getNodeByDataId = function(dataId){
    return this.dataIdAndDataMap[dataId];
};

VisNetworkMan.prototype.getNodeByLabel = function(label){
    var nodeIdAndDataMap = this.nodeIdAndDataMap;
    var nodeData;
    for (var nodeId in nodeIdAndDataMap){
        nodeData = nodeIdAndDataMap[nodeId];
        if (nodeData && nodeData.label != null && nodeData.label == label){
            return nodeData;
        }
    }
    return null;
};

VisNetworkMan.prototype.eachNode = function(callback){
    var nodeIdAndDataMap = this.nodeIdAndDataMap;
    for (var nodeId in nodeIdAndDataMap){
        (callback && callback(nodeIdAndDataMap[nodeId]));
    }
};

VisNetworkMan.prototype.eachEdge = function(callback){
    var edgeIdAndDataMap = this.edgeIdAndDataMap;
    for (var edgeId in edgeIdAndDataMap){
        (callback && callback(edgeIdAndDataMap[edgeId]));
    }
};

VisNetworkMan.prototype.checkLoading = function(){
    return this.loadingComplete;
};


VisNetworkMan.prototype.makeVisDefaultOptions = function(){
    return {
        autoResize: true,
        height: '100%',
        width: '100%',
        locale: 'en',
        // locales: locales,
        clickToUse: false,
        interaction:{
            hover: true,
            zoomView: false,
            // navigationButtons: true,
            keyboard: true
        },
        layout:{ //임의 화면구성 //숫자지정시 고정된 Rendering
            randomSeed: 0 //Number
        },
        /** Group 기본설정 - REF: https://visjs.github.io/vis-network/docs/network/groups.html **/
        //※ 기준노드를 기준으로 파생되어 나가는 연관노드 Depth에 따라 차별을 두어 표기를 위해 Group 속성을 활용하였다.
        // groups:{},
        /** Nodes **/
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
            shadow:true
        },
        /** Edges **/
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




VisNetworkMan.onLoadTintImage = function(image, tintColor, alpha, callback){
    alpha = alpha != null ? alpha : 0.15;
    var imageElement = null;
    var funcWhenLoad = function(){
        // create hidden canvas (using image dimensions)
        var canvas = document.createElement("canvas");
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(imageElement,0,0);

        var map = ctx.getImageData(0,0,canvas.width,canvas.height);
        var imdata = map.data;

        // convert image to grayscale
        var r,g,b,avg;
        for(var p = 0, len = imdata.length; p < len; p+=4) {
            r = imdata[p];
            g = imdata[p+1];
            b = imdata[p+2];

            avg = Math.floor((r+g+b)/3);

            imdata[p] = imdata[p+1] = imdata[p+2] = avg;
        }

        ctx.putImageData(map,0,0);

        // overlay filled rectangle using lighter composition
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = alpha;
        ctx.fillStyle = tintColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // replace image source with canvas data
        imageElement.onload = function(){
            imageElement.onload = null;
            (callback && callback(imageElement));
        };
        imageElement.src = canvas.toDataURL();
    };
    if (typeof image == 'string'){
        var imageElement = new Image();
        imageElement.onload = funcWhenLoad;
        imageElement.src = image;
    }else{
        funcWhenLoad();
    }

    return imageElement.src;
};