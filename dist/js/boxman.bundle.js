!function(e){function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var o={};t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=5)}({0:function(e,t){function o(e){var t=this;return this.event=new SjEvent,this.event.setSpecialEventListener(function(e,o){if("external"==o){getEl(e).clas.add("sj-obj-exbox"),getEl(e).addEventListener("dragenter",t.handleDragEnter(t,e)),getEl(e).addEventListener("dragover",t.handleDragOver(t,e)),getEl(e).addEventListener("dragleave",t.handleDragOut(t,e)),getEl(e).addEventListener("drop",t.handleDrop(t,e));var n=getEl(e).getBoundingClientRect(),i=newEl("div");i.style.width=n.width,i.style.height=n.height,i.style.background="rgba(0,0,0,0.5)",i.style.position="absolute",i.style.top=n.top,i.style.left=n.left,i.parentElement=e,t.cover=i,getEl(i).clas.add("sj-obj-exbox"),getEl(i).addEventListener("dragenter",t.handleDragEnter(t,i)),getEl(i).addEventListener("dragover",t.handleDragOver(t,i)),getEl(i).addEventListener("dragleave",t.handleDragOut(t,i)),getEl(i).addEventListener("drop",t.handleDrop(t,i))}}),this.keyboarder=new i(this),this.objs={},this.boxObjs={},this.exBoxObjs={},this.cover,this.globalSetup={modeTest:!1,testBoxClass:null,testBoxBorderWidth:"1px",testBoxBorderColor:"#f8e",testObjClass:null,testObjBorderWidth:"1px",testObjBorderColor:"#7effb4",modeCopy:!1,modeOnlyBoxToBox:!0,modeRemoveOutOfBox:!1,appendType:o.APPEND_TYPE_LAST},this.globalSetupForBox={},this.globalSetupForObj={},this.globalSetupForExBox={},this.metaObj={mvObj:void 0,isOnDown:!1,isOnMoving:!1,lastPosX:0,lastPosY:0,mvObjPreviewClone:void 0,mvObjPreviewOriginalClone:void 0,mvObjStartBodyOffset:void 0,mvObjCloneList:[],mvObjAppendTypeBefore:void 0,mvObjOriginalBox:void 0,mvObjOriginalShelterList:[],cam:{w:window.innerWidth,h:window.innerHeight},limit:2,layerOnMove:void 0,mode:new n(this.globalSetup)},e&&this.setup(e),getEl().ready(function(){getEl().resize(function(){t.setMaxSize()}),t.setMaxSize(),t.isMobile()?(getEl(document).addEventListener("touchstart",function(e){t.whenMouseDown(e)}),getEl(document).addEventListener("touchmove",function(e){t.whenMouseMove(e)}),getEl(document).addEventListener("touchend",function(e){t.whenMouseUp(e)})):(getEl(document).addEventListener("mousedown",function(e){t.whenMouseDown(e)}),getEl(document).addEventListener("mousemove",function(e){t.whenMouseMove(e)}),getEl(document).addEventListener("mouseup",function(e){t.whenMouseUp(e)}))}),this}function n(e){this.modes={},this.set(e)}function i(e){var t=this;this.boxMan=e,this.selectorBox,this.targetBox,this.meta={goingToBeInThisBox:null,isEventStarted:!1,keborderStatus:t.STATUS_NONE}}try{e.exports=o}catch(e){}o.APPEND_TYPE_LAST=1,o.APPEND_TYPE_FIRST=2,o.APPEND_TYPE_BETWEEN=3,o.APPEND_TYPE_OVERWRITE=4,o.APPEND_TYPE_SWAP=5,o.APPEND_TYPE_INVISIBLE=6,o.prototype.setup=function(e){for(var t in e)this.globalSetup[t]=e[t];return this},o.prototype.clone=function(e){var t,o=getEl(e).obj,n=o.cloneNode(!0),i={};null!=o.getAttribute("data-box")?t=this.getBoxByManId(o.manid):null!=o.getAttribute("data-obj")&&(t=this.getObjByManId(o.manid));for(var r in t)i[r]=t[r];return this.setObj(n,i),n},o.prototype.ready=function(e){var t=this;e&&getEl().ready(function(){e(t)})},o.prototype.detect=function(e){var t=this;return getEl().ready(function(){var o;o=document.querySelectorAll("[data-box]");for(var n=0;n<o.length;n++)t.addBox(o[n]);o=document.querySelectorAll("[data-obj]");for(var n=0;n<o.length;n++)t.addObj(o[n]);e&&e(t),t.hasEventListenerByEventName("afterdetect")&&t.execEventListenerByEventName("afterdetect")}),this},o.prototype.afterDetect=function(e){return this.addEventListenerByEventName("afterdetect",e),this},o.prototype.addEventListener=function(e,t,o){return this.event.addEventListener(e,t,o)},o.prototype.addEventListenerByEventName=function(e,t){return this.event.addEventListenerByEventName(e,t)},o.prototype.hasEventListener=function(e,t,o){return this.event.hasEventListener(e,t,o)},o.prototype.hasEventListenerByEventName=function(e,t){return this.event.hasEventListenerByEventName(e,t)},o.prototype.hasEventListenerByEventFunc=function(e){return this.event.hasEventListenerByEventFunc(e)},o.prototype.removeEventListener=function(e,t,o){return this.event.removeEventListener(e,t,o)},o.prototype.removeEventListenerByEventName=function(e,t){return this.event.removeEventListenerByEventName(e,t)},o.prototype.removeEventListenerByEventFunc=function(e){return this.event.removeEventListenerByEventFunc(e)},o.prototype.execEventListener=function(e,t,o){return this.event.execEventListener(e,t,o)},o.prototype.execEventListenerByEventName=function(e,t){return this.event.execEventListenerByEventName(e,t)},o.prototype.execEvent=function(e,t,o){return this.event.execEvent(e,t,o)},o.prototype.handleDragEnter=function(e,t){var t=getEl(t).obj;return function(o){o.stopPropagation(),o.preventDefault(),o.dataTransfer.dropEffect="copy",t!=e.cover&&t.appendChild(e.cover)}},o.prototype.handleDragOver=function(e,t){var t=getEl(t).obj;return function(e){e.stopPropagation(),e.preventDefault(),e.dataTransfer.dropEffect="copy"}},o.prototype.handleDragOut=function(e,t){var t=getEl(t).obj;return function(o){o.stopPropagation(),o.preventDefault(),o.dataTransfer.dropEffect="copy",t==e.cover&&e.cover.parentNode.removeChild(e.cover)}},o.prototype.handleDrop=function(e,t){var t=getEl(t).obj;return function(o){o.stopPropagation(),o.preventDefault();var n=o.originalEvent?o.originalEvent.dataTransfer.files:o.dataTransfer?o.dataTransfer.files:"";if(o.exbox={files:n},t==e.cover){var i=e.cover.parentElement;e.execEventListener(i,"external",o),getEl(e.cover).removeFromParent()}}},o.prototype.addBox=function(e){null==e.getAttribute("data-box")&&void 0==e.getAttribute("data-box")&&e.setAttribute("data-box",""),this.setBox(e,{limit:e.getAttribute("data-limit"),acceptbox:getData(e.getAttribute("data-accept-box")).parse(),rejectbox:getData(e.getAttribute("data-reject-box")).parse(),acceptobj:getData(e.getAttribute("data-accept-obj")).parse(),rejectobj:getData(e.getAttribute("data-reject-obj")).parse(),start:e.getAttribute("data-event-start"),boxin:e.getAttribute("data-event-boxin"),boxout:e.getAttribute("data-event-boxout"),boxinout:e.getAttribute("data-event-boxinout"),beforeboxin:e.getAttribute("data-event-beforeboxin"),mustdo:e.getAttribute("data-event-mustdo"),swappedin:e.getAttribute("data-event-swappedin"),swappedout:e.getAttribute("data-event-swappedout"),external:e.getAttribute("data-event-external")})},o.prototype.newBox=function(e){var t,o=newEl("div",{"data-box":"true"},"");return e||(e={parent:document.body}),t=e.parent?"string"==typeof parent?document.getElementById(e.parent):e.parent:e.parentEl?e.parentEl:document.body,this.setBox(o,e,t),o},o.prototype.setBox=function(e,t,o){var i=this,r=this.boxObjs;if(e=getEl(e).obj,t=t||{},t.conditionbox=[],t.conditionobj=[],e.isAdaptedBox)return!1;e.isAdaptedBox=!0,getEl(e).clas.add("sj-obj-box");var s=t.manid?t.manid:getEl(r).getNewSeqId("tmpBox"),a=t.id?t.id:e.id;e.manid=s,e.id=a,this.boxObjs[s]=t,this.boxObjs[s].element=e,this.boxObjs[s].id=a,this.boxObjs[s].manid=s,this.boxObjs[s].mode=new n;var l=this.globalSetupForBox,d=t||{};for(var b in l)d[b]||(d[b]=l[b]);return this.setBoxView(d),this.setTestViewForBox(d,i.globalSetup),o&&getEl(o).add(e),this.setBoxEvent(d),s},o.prototype.setBoxView=function(e){var t=e.element;e&&(e.imgURL&&(t.style.background='url("'+e.imgURL+'")'),e.width&&e.height&&(t.style.backgroundSize=e.width+" "+e.height),e.width&&(t.style.width=e.width),e.height&&(t.style.height=e.height),e.minWidth&&(t.style.minWidth=e.minWidth),e.minHeight&&(t.style.minHeight=e.minHeight),e.class&&getEl(t).clas.add(e.class),e.clazz&&getEl(t).clas.add(e.clazz),e.content&&(t.innerHTML=e.content))},o.prototype.setTestViewForBox=function(e,t){var o=e.element;t.modeTest&&(t.testBoxClass&&getEl(o).addClass(t.testBoxClass),t.testBoxBorderWidth&&(o.style.borderWidth=t.testBoxBorderWidth),t.testBoxBorderColor&&(o.style.borderColor=t.testBoxBorderColor))},o.prototype.setTestViewForObj=function(e,t){var o=e.element;t.modeTest&&(t.testObjClass&&getEl(o).addClass(t.testObjClass),t.testObjBorderWidth&&(o.style.borderWidth=t.testObjBorderWidth),t.testObjBorderColor&&(o.style.borderColor=t.testObjBorderColor))},o.prototype.setBoxEvent=function(e){var t=e.element;e.start&&(this.addEventListener(t,"start",e.start),this.execEventListener(t,"start",{box:t,obj:void 0,boxSize:this.getMovableObjCount(t)})),e.boxin&&this.addEventListener(t,"boxin",new Function("event",e.boxin)),e.boxout&&this.addEventListener(t,"boxout",new Function("event",e.boxout)),e.boxinout&&this.addEventListener(t,"boxinout",new Function("event",e.boxinout)),e.beforeboxin&&this.addEventListener(t,"beforeboxin",new Function("event",e.beforeboxin)),e.mustdo&&this.addEventListener(t,"mustdo",new Function("event",e.mustdo)),e.swappedin&&this.addEventListener(t,"swappedin",new Function("event",e.swappedin)),e.swappedout&&this.addEventListener(t,"swappedout",new Function("event",e.swappedout)),e.external&&this.addEventListener(t,"external",new Function("event",e.external))},o.prototype.delBox=function(e){var t=this.getBox(e),o=t.element,n=o.manid;return delete this.boxObjs[n],o.parentNode.removeChild(o),this},o.prototype.getBox=function(e){if("string"==typeof e)return this.getBoxById(e);if(e instanceof Element)return this.getBoxByEl(e);var t=this.getBoxesByCondition(e);return null!=t&&t.length>0?t[0]:void 0},o.prototype.getElementByBox=function(e){return this.getBox(e).element},o.prototype.setBoxMode=function(e,t){for(var o=this.getBoxesByCondition(e),n=0;n<o.length;n++){o[n].mode.set(t)}return this},o.prototype.getBoxById=function(e){var t=document.getElementById(e);return this.boxObjs[t.manid]},o.prototype.getBoxByEl=function(e){var t=this.boxObjs;if(e&&e.manid){return t[e.manid]}},o.prototype.getBoxByManId=function(e){return this.boxObjs[e]},o.prototype.getBoxes=function(){return this.boxObjs},o.prototype.getBoxesByCondition=function(e){var t=[],o=this.boxObjs;for(var n in o){var i=o[n],r=getEl(i).find(e);r&&t.push(r)}return t},o.prototype.getBoxesByDomAttributeCondition=function(e){var t=[],o=this.boxObjs;for(var n in o){var i=o[n],r=i.element,s=getEl(r).findDomAttribute(e);s&&t.push(s)}return t},o.prototype.clearBox=function(e){var t=getEl(e).obj;return t&&(t.innerHTML=""),this},o.prototype.addAcceptBox=function(e,t){for(var o=this.getBoxesByCondition(e),n=0;n<o.length;n++){var i=o[n];void 0!=i.acceptbox&&null!=i.acceptbox||(i.acceptbox=[]),i.acceptbox instanceof Array?t instanceof Array?i.acceptbox=i.acceptbox.concat(t):i.acceptbox.push(t):i.acceptbox=[i.acceptbox]}return this},o.prototype.addRejectBox=function(e,t){for(var o=this.getBoxesByCondition(e),n=0;n<o.length;n++){var i=o[n];void 0!=i.rejectbox&&null!=i.rejectbox||(i.rejectbox=[]),i.rejectbox instanceof Array?t instanceof Array?i.rejectbox=i.rejectbox.concat(t):i.rejectbox.push(t):i.rejectbox=[i.acceptbox]}return this},o.prototype.addConditionWithBox=function(e,t,o){for(var n=this.getBoxesByCondition(e),i=0;i<n.length;i++){n[i].conditionbox.push({condition:t,data:o})}return this},o.prototype.getConditionData=function(e,t){var o={};if(null!=t&&t.length>0)for(var n=0;n<t.length;n++){var i=t[n],r=i.condition,s=i.data;if(getEl(e).isAccepted(r))for(var a in s)o[a]=s[a]}return o},o.prototype.addAcceptObj=function(e,t){for(var o=this.getBoxesByCondition(e),n=0;n<o.length;n++){var i=o[n];void 0!=i.acceptobj&&null!=i.acceptobj||(i.acceptobj=[]),i.acceptobj instanceof Array?t instanceof Array?i.acceptobj=i.acceptobj.concat(t):i.acceptobj.push(t):i.acceptobj=[i.acceptobj]}return this},o.prototype.addRejectObj=function(e,t){for(var o=this.getBoxesByCondition(e),n=0;n<o.length;n++){var i=o[n];void 0!=i.rejectobj&&null!=i.rejectobj||(i.rejectobj=[]),i.rejectobj instanceof Array?t instanceof Array?i.rejectobj=i.rejectobj.concat(t):i.rejectobj.push(t):i.rejectobj=[i.rejectobj]}return this},o.prototype.addConditionWithObj=function(e,t,o){for(var n=this.getBoxesByCondition(e),i=0;i<n.length;i++){n[i].conditionobj.push({condition:conditionForBox,data:o})}return this},o.prototype.suspendBox=function(e,t){var o=getEl(e).obj,n=getEl(t).obj,i=n.offsetTop+n.offsetHeight,r=n.offsetLeft;o.style.position="absolute",o.style.top=i+"px",o.style.left=r+"px"},o.prototype.addObj=function(e){var t={manid:e.getAttribute("data-obj-id")};this.setObj(e,t)},o.prototype.newObj=function(e,t){t||(t={}),t["data-obj"]="true";var o,n=newEl("div",t,"");return e||(e={parent:document.body}),e.id&&(n.id=e.id),o=e.parent?"string"==typeof parent?document.getElementById(e.parent):e.parent:e.parentEl?e.parentEl:document.body,this.setObj(n,e,o),n},o.prototype.setObj=function(e,t,o){if(t=t||{},e.isAdaptedMovable)return!1;e.isAdaptedMovable=!0,getEl(e).clas.add("sj-obj-movable");var n=this,i=this.objs,r=getEl(i).getNewSeqId("tmpObj");e.manid=r,this.objs[r]=t,this.objs[r].element=e,this.objs[r].id=e.id,this.objs[r].manid=r;var s=this.globalSetupForObj,a=t||{};for(var l in s)a[l]||(a[l]=s[l]);return a&&(a.imgURL&&(e.style.background='url("'+a.imgURL+'")'),a.width&&a.height&&(e.style.backgroundSize=a.width+" "+a.height),a.width&&(e.style.width=a.width),a.height&&(e.style.height=a.height),a.minWidth&&(e.style.minWidth=a.minWidth),a.minHeight&&(e.style.minHeight=a.minHeight),a.class&&getEl(e).clas.add(a.class),a.clazz&&getEl(e).clas.add(a.clazz),a.content&&(e.innerHTML=a.content)),e.style.left=e.offsetLeft+"px",e.style.top=e.offsetTop+"px",this.setTestViewForObj(a,n.globalSetup),o&&getEl(o).add(e),this.isMobile()?getEl(e).addEventListener("touchstart",function(t){n.objStartMove(t,e)}):getEl(e).addEventListener("mousedown",function(t){n.objStartMove(t,e)}),getEl(e).addEventListener("click",function(){}),r},o.prototype.delObj=function(e){var t=this.getObj(e),o=t.element,n=o.manid;return delete this.objs[n],o.parentNode.removeChild(o),this},o.prototype.delObjByBox=function(e){var t=this.getBox(e);if(t)for(var o=t.element,n=0;n<o.children.length;n++){var i=o.children[n];null!=i.getAttribute("data-obj")&&this.delObj(i)}return this},o.prototype.getObj=function(e){if("string"==typeof e)return this.getObjById(e);if(e instanceof Element)return this.getObjByEl(e);var t=this.getObjsByCondition(e);return null!=t&&t.length>0?t[0]:void 0},o.prototype.getElementByObj=function(e){return this.getObj(e).element},o.prototype.getObjs=function(){return this.objs},o.prototype.getObjsByCondition=function(e){var t=[],o=this.objs;for(var n in o){var i=o[n],r=getEl(i).find(e);r&&t.push(r)}return t},o.prototype.getObjById=function(e){var t=document.getElementById(e);return this.objs[t.manid]},o.prototype.getObjByManId=function(e){return this.objs[e]},o.prototype.getObjByEl=function(e){var t=this.objs;if(e&&e.manid){return t[e.manid]}},o.prototype.getObjsByBox=function(e){for(var t={},o=this.getBox(e),n=o.element,i=0;i<n.children.length;i++){var r=n.children[i];if(null!=r.getAttribute("data-obj")){var s=r.manid,a=this.objs[s];t[s]=a}}return t},o.prototype.getObjListByBox=function(e){for(var t=[],o=this.getBox(e),n=o.element,i=0;i<n.children.length;i++){var r=n.children[i];if(null!=r.getAttribute("data-obj")){var s=r.manid,a=this.objs[s];t.push(a)}}return t},o.prototype.getObjAttributeListByBox=function(e){for(var t=[],o=this.getBox(e),n=o.element,i=0;i<n.children.length;i++){var r=n.children[i];if(null!=r.getAttribute("data-obj")){var s=r.manid,a=this.objs[s];t.push(a.attribute)}}return t},o.prototype.moveAllToOtherBox=function(e,t){var o=getEl(e).obj,n=getEl(t).obj,i=this.getObjsByBox(o);for(var r in i){var s=i[r].element;n.appendChild(s)}},o.prototype.shellterToBox=function(e){for(var t=this.metaObj.mvObjOriginalShelterList,o=getEl(e).obj,n=0;n<t.length;n++){var i=t[n];o.appendChild(i)}},o.prototype.whenMouseDown=function(e){return this.metaObj.isOnMoving=!1,!0},o.prototype.objStartMove=function(e,t){var o,n=this.metaObj;if(-1!=navigator.userAgent.indexOf("Firefox")&&e.preventDefault(),t!=window)o=t;else{var i=getEl(e.target).getParentEl("data-obj");i&&(o=i)}n.mvObj=o;var r=this.createPreviewer(o);n.mvObjPreviewClone=r,n.mvObjCloneList.push(r);var s=this.createPreviewer(o);n.mvObjPreviewOriginalClone=s,n.mvObjOriginalShelterList=[],this.saveInfoBeforeMove(o,e)},o.prototype.whenMouseMove=function(e){var t=this.metaObj,o=t.mvObj;t.timerObj&&!this.isInBox(t.timerObj,t.lastPosX,t.lastPosY)&&this.removeTimer(),t.isOnDown&&(this.setLastPos(e),e.preventDefault(),this.setPreviewer(o,e),this.setMovingState(o))},o.prototype.whenMouseUp=function(e){var t=this.metaObj,o=t.mvObj;if(this.removeTimer(),t.isOnDown&&(getEl(o).clas.remove("sj-obj-is-on-moving"),t.isOnDown=!1),t.isOnMoving){var n=this.getDecidedBox(o,this.boxObjs,t.lastPosX,t.lastPosY);n=n||t.layerOnMove,this.deletePreviewer(),this.deleteOriginalClonePreviewer(),this.moveObjTo(o,n),o.style.zIndex=t.mvObjBeforeIndex,0==t.additionalStartPosLeft&&0==t.additionalStartPosTop||(o.style.left=parseInt(o.style.left)-t.additionalStartPosLeft+"px",o.style.top=parseInt(o.style.top)-t.additionalStartPosTop+"px"),o=null}},o.prototype.getDecidedBox=function(e,t,o,n){var i,r,s=[],a=0,l=0,d=0;for(var b in t){var h=t[b].element;this.isInBox(h,o,n)&&e!=h&&s.push(h)}for(var u=0;u<s.length;u++){var v=s[u].parentNode,c=0,p=!1,f=!1,g=0;for("fixed"==s[u].style.position&&(f=!0);v;){if(v==e){p=!0;break}if(!this.isInBox(v,o,n)&&v!=document.body&&v!=document.body.parentNode&&v!=document.body.parentNode.parentNode){p=!0,console.debug("뭣???!!!!",v,o,n),console.debug(v,v.scrollTop+"<"+n+"<"+(v.offsetHeight+v.scrollTop));break}v.style&&"fixed"==v.style.position&&(f=!0),this.isPropManObj(v)&&(g=v.popIndex),v=v.parentNode,c++}if(console.debug(i,v,c,p),!p){if(d<g)d=g,a=c,i=s[u];else if(d!=g)continue;f?l<c&&(l=c,r=s[u]):a<c&&(a=c,i=s[u])}}return r||i},o.prototype.getMovableObjCount=function(e){var t=0;if(e)for(var o=0;o<e.children.length;o++){var n=e.children[o].getAttribute("data-obj");null!=n&&void 0!=n&&"false"!=n&&t++}return t},o.prototype.getMovableObj=function(e,t){var o=this.metaObj;if(e)for(var n=0;n<e.children.length;n++){var i=e.children[n],r=i.getAttribute("data-obj"),s=i.getAttribute("data-obj-previewer");if((null!=s||null!=r&&void 0!=r&&"false"!=r)&&this.isInBox(i,o.lastPosX,o.lastPosY))return i}},o.prototype.saveInfoBeforeMove=function(e,t){var o=this.metaObj;o.mvObjBeforeBox=e.parentNode,o.mvObjBeforeIndex=e.style.zIndex,o.mvObjBeforePosition=e.style.position,o.mvObjBeforeNextSibling=e.nextSibling,o.mvObjStartBodyOffset=getEl(e).getBoundingClientRect(),e.style.zIndex=getData().findHighestZIndex(["div"])+1,o.lastGoingToBeInThisBox=o.mvObjBeforeBox,o.mode.clear().merge(this.globalSetup);var n=this.getBox(o.mvObjBeforeBox);if(n&&o.mode.merge(n.mode),e.parentNode!=document.body){var i=this.findAbsoluteParentEl(e),r=getEl(i).getBoundingClientRect();o.additionalStartPosLeft=r.left,o.additionalStartPosTop=r.top,console.debug(r.left,r.top)}else o.additionalStartPosLeft=0,o.additionalStartPosTop=0;this.setLastPos(t),void 0!=t.touches?(o.timerObj=t.touches[0].target,this.removeTimer(),o.timer=setInterval(setTimer,100),e.adjustX=t.touches[0].pageX-o.mvObjStartBodyOffset.left,e.adjustY=t.touches[0].pageY-o.mvObjStartBodyOffset.top):(e.adjustX=t.clientX-o.mvObjStartBodyOffset.left+getEl().getBodyScrollX(),e.adjustY=t.clientY-o.mvObjStartBodyOffset.top+getEl().getBodyScrollY(),getEl(e).clas.add("sj-obj-is-on-moving"),o.isOnDown=!0,o.isOnMoving=!1)},o.prototype.setMovingState=function(e){var t=this.metaObj,o=t.lastPosX,n=t.lastPosY,i=t.cam;o-e.adjustX>=1&&o-e.adjustX+e.offsetWidth<=i.w?e.style.left=o-e.adjustX+"px":(o-e.adjustX<1&&(e.style.left="0px"),o-e.adjustX+e.offsetWidth>i.w&&(e.style.left=i.w-e.offsetWidth+"px")),n-e.adjustY>=1&&n-e.adjustY+e.offsetHeight<=i.h?e.style.top=n-e.adjustY+"px":(n-e.adjustY<1&&(e.style.top="0px"),n-e.adjustY+e.offsetHeight>i.h&&(e.style.top=i.h-e.offsetHeight+"px")),e.style.position="absolute",e.style.float="",getEl(e).clas.add("sj-obj-is-on-moving"),getEl(document.body).add(e),t.isOnMoving||((e.adjustX>e.offsetWidth||e.adjustX<0)&&(e.adjustX=e.offsetWidth),(e.adjustY>e.offsetHeight||e.adjustY<0)&&(e.adjustY=e.offsetHeight)),t.isOnMoving=!0},o.prototype.moveObjTo=function(e,t){var n=this.metaObj,i=n.mode,r=n.mvObjBeforeBox,s=n.mvObjPreviewClone,a=(n.mvObjPreviewOriginalClone,this.getBox(r)),l=this.getBox(t),d=this.getObj(e),b=void 0!=a,h=void 0!=l,u=a==l,v=!1;if(h){var c=this.getConditionData(a,l.conditionbox),p=this.getConditionData(d,l.conditionobj);i.merge(c),i.merge(p),v=l.limit>this.getMovableObjCount(t)||void 0==l.limit}var f=i.get("appendType"),g=i.get("modeRemoveOutOfBox"),x=i.get("modeOnlyBoxToBox"),m=i.get("modeCopy"),j=f==o.APPEND_TYPE_BETWEEN,B=!j&&(u||!v),y=j&&!v&&!u,E=h&&this.hasEventListener(t,"beforeboxin")&&!this.execEventListener(t,"beforeboxin",{box:t,obj:e,boxSize:this.getMovableObjCount(r)}),O=g&&!h&&!u,P=x&&!h&&b,T=!h||getEl(a).isAccepted(l.acceptbox,l.rejectbox),A=!h||getEl(d).isAccepted(l.acceptobj,l.rejectobj),S=!1,w=!1,L=!1;if(B||E||P||!T||!A){if(O&&!h)return void this.delObj(e);this.backToBefore(e,r,f)}else if(t){if(y)return void this.backToBefore(e,r,f);var C;if(m&&f!=o.APPEND_TYPE_SWAP&&!u){var N=this.clone(e);C=N,this.backToBefore(e,r,f)}else C=e;f!=o.APPEND_TYPE_OVERWRITE||u?f==o.APPEND_TYPE_SWAP&&!u&&v&&this.shellterToBox(r):this.clearBox(t),this.goTo(C,t,f,s),S=!0,w=!0,L=!0}else n.mvObjBeforeBox.appendChild(e);if(S||!P&&h){var I=this.getMovableObjCount(r);this.hasEventListener(r,"mustdo")&&this.execEventListener(r,"mustdo"),this.hasEventListener(r,"boxinout")&&this.execEventListener(r,"boxinout",{boxel:t,obj:e,boxSize:I,boxBefore:r}),this.hasEventListener(r,"boxout")&&this.execEventListener(r,"boxout",{boxel:t,obj:e,boxSize:I,boxBefore:r}),this.hasEventListener(r,"swappedin")&&this.metaObj.mvObjOriginalShelterList.length>0&&this.execEventListener(r,"swappedin",{boxel:r,obj:this.metaObj.mvObjOriginalShelterList,boxBefore:t})}if(w){var D=this.getMovableObjCount(t);this.hasEventListener(t,"mustdo")&&this.execEventListener(t,"mustdo"),this.hasEventListener(t,"boxinout")&&this.execEventListener(t,"boxinout",{boxel:t,obj:e,boxSize:D,boxBefore:r}),this.hasEventListener(t,"boxin")&&this.execEventListener(t,"boxin",{boxel:t,obj:e,boxSize:D,boxBefore:r}),this.hasEventListener(t,"swappedout")&&this.execEventListener(t,"swappedout",{boxel:r,obj:this.metaObj.mvObjOriginalShelterList,boxBefore:t})}return e=null,L},o.prototype.goTo=function(e,t,n,i){if(n==o.APPEND_TYPE_LAST)t.appendChild(e);else if(n==o.APPEND_TYPE_FIRST)t.insertBefore(e,t.firstChild);else if(n==o.APPEND_TYPE_BETWEEN){var r=this.getMovableObj(t,event);r?r==i.nextSibling?t.insertBefore(e,r.nextSibling):r!=i&&t.insertBefore(e,r):t.appendChild(e)}else n==o.APPEND_TYPE_OVERWRITE?t.appendChild(e):n==o.APPEND_TYPE_SWAP?t.appendChild(e):o.APPEND_TYPE_INVISIBLE;e.style.position=""},o.prototype.backToBefore=function(e,t,n,i){if(!i||n==o.APPEND_TYPE_SWAP){var r=this.metaObj,s=r.mvObjBeforeNextSibling,a=r.mvObjBeforePosition,l=r.mvObjStartBodyOffset;t.insertBefore(e,s),e.style.position="absolute"==a?"absolute":"","absolute"==a&&(e.style.left=l.x+"px",e.style.top=l.y+"px",e.style.float="")}},o.prototype.originalCopyBackToBefore=function(e,t,n,i){if(i&&n!=o.APPEND_TYPE_SWAP){if(e.parentNode!=t){if(!i||n==o.APPEND_TYPE_SWAP)return;var r=this.metaObj,s=r.mvObjBeforeNextSibling,a=r.mvObjBeforePosition,l=r.mvObjStartBodyOffset;t.insertBefore(e,s),e.style.position="absolute"==a?"absolute":"","absolute"==a&&(e.style.left=l.x+"px",e.style.top=l.y+"px",e.style.float="")}}else e.parentNode&&e.parentNode.removeChild(e)},o.prototype.createPreviewer=function(e){var t=(this.metaObj,e.cloneNode(!0));return t.setAttribute("data-obj","false"),t.setAttribute("data-obj-previewer","true"),getEl(t).clas.add("sj-preview-going-to-be-in-box"),t.style.position="",t},o.prototype.setPreviewer=function(e,t){var n=this.metaObj,i=n.mode.clone(),r=n.lastGoingToBeInThisBox,s=n.mvObjPreviewClone,a=n.mvObjPreviewOriginalClone,l=n.mvObjBeforeBox,d=this.getDecidedBox(e,this.boxObjs,n.lastPosX,n.lastPosY),b=d,h=this.getBox(l),u=this.getBox(b),v=this.getObj(e),c=void 0!=h,p=void 0!=u,f=h==u,g=!1;if(p){var x=this.getConditionData(h,u.conditionbox),m=this.getConditionData(v,u.conditionobj);i.merge(x),i.merge(m),g=u.limit>this.getMovableObjCount(b)||void 0==u.limit}var j=i.get("appendType");n.mvObjAppendTypeBefore=j;var B=i.get("modeRemoveOutOfBox"),y=i.get("modeOnlyBoxToBox"),E=i.get("modeCopy"),O=j==o.APPEND_TYPE_BETWEEN,P=!O&&(f||!g),T=O&&!g&&!f,A=!O&&y&&!p&&c,S=!p||getEl(h).isAccepted(u.acceptbox,u.rejectbox),w=!p||getEl(v).isAccepted(u.acceptobj,u.rejectobj);if(P||A||!S||!w){if(B&&!f&&!p)return s.parentNode&&s.parentNode.removeChild(s),this.originalCopyBackToBefore(a,l,j,E),this.overWriteAndSwapPreview(d,j),void(n.lastGoingToBeInThisBox=d);if(!S||!w)return this.originalCopyBackToBefore(a,l,j,E),this.overWriteAndSwapPreview(d,j),n.lastGoingToBeInThisBox=d,void this.backToBefore(s,l,j,E);this.originalCopyBackToBefore(a,l,j,E),this.overWriteAndSwapPreview(d,j),n.lastGoingToBeInThisBox=d,this.backToBefore(s,l,j,E)}else if(b){if(T)return this.backToBefore(s,l,j,E),void(n.lastGoingToBeInThisBox=d);j!=o.APPEND_TYPE_OVERWRITE||f?j==o.APPEND_TYPE_SWAP&&!f&&g?(this.originalCopyBackToBefore(a,l,j,E),this.overWriteAndSwapPreview(d,j)):this.originalCopyBackToBefore(a,l,j,E):(this.originalCopyBackToBefore(a,l,j,E),E&&s.parentNode&&s.parentNode.removeChild(s),this.overWriteAndSwapPreview(d,j)),this.goTo(s,d,j,s)}else r&&getEl(r).clas.remove("sj-tree-box-to-go"),s.parentNode&&s.parentNode.removeChild(s),this.overWriteAndSwapPreview(d,j);n.lastGoingToBeInThisBox=d},o.prototype.deletePreviewer=function(){var e=this.metaObj,t=e.mvObjPreviewClone,o=e.mvObjCloneList;t&&t.parentNode&&(t.parentNode.removeChild(t),t=void 0);for(var n=0;n<o.length;n++)o[n].parentNode&&o[n].parentNode.removeChild(o[n]);o.length>10&&(e.mvObjCloneList=[])},o.prototype.deleteOriginalClonePreviewer=function(){var e=this.metaObj,t=e.mvObjPreviewOriginalClone;t.parentNode&&t.parentNode.removeChild(t)},o.prototype.overWriteAndSwapPreview=function(e,t){var n=this.metaObj;if(n.lastGoingToBeInThisBox!=e){for(var i=0;i<n.mvObjOriginalShelterList.length;i++){var r=n.mvObjOriginalShelterList[i];n.mvObjOriginalBox.appendChild(r)}if(this.deletePreviewer(),n.mvObjAppendTypeBefore!=o.APPEND_TYPE_SWAP&&n.mvObjAppendTypeBefore!=o.APPEND_TYPE_OVERWRITE)return;if(e&&e!=n.mvObjBeforeBox){n.mvObjOriginalBox=e,n.mvObjOriginalShelterList=[];var s=this.getObjsByBox(e);if(s){for(var a in s){var l=s[a];l&&n.mvObjOriginalShelterList.push(l.element)}if(this.clearBox(e),t==o.APPEND_TYPE_SWAP)for(var i=0;i<n.mvObjOriginalShelterList.length;i++){var d=n.mvObjOriginalShelterList[i],b=this.createPreviewer(d);n.mvObjCloneList.push(b),n.mvObjBeforeBox.appendChild(b)}else o.APPEND_TYPE_OVERWRITE}}}},o.prototype.isMobile=function(){var e=!1;return navigator.platform&&(e="win16|win32|win64|mac".indexOf(navigator.platform.toLowerCase())<0),e},o.prototype.setMaxSize=function(e){var t=this.metaObj,o=document.createElement("div");o.style.display="block",o.style.position="absolute",o.style.top="-7777px",o.style.left="-7777px",o.style.width="100%",o.style.height="100%",o.style.border="0px solid",o.style.padding="0px",o.style.margin="0px",getEl(document.body).add(o);var n=o.offsetWidth,i=o.offsetHeight;console.debug("MAX:"+t.cam.w+"/"+t.cam.h),console.debug("=> "+n+"/"+i),t.cam.w=n,t.cam.h=i},o.prototype.setLastPos=function(e){var t=this.metaObj;void 0!=e.touches?(t.lastPosX=e.touches[0].pageX,t.lastPosY=e.touches[0].pageY):(t.lastPosX=e.clientX+getEl().getBodyScrollX(),t.lastPosY=e.clientY+getEl().getBodyScrollY())},o.prototype.isInBox=function(e,t,o){var n=getEl(e).getBoundingClientRect(),i=n.left,r=n.top;return i+e.scrollLeft<t&&i+e.offsetWidth+e.scrollLeft>t&&r+e.scrollTop<o+e.scrollTop&&r+e.offsetHeight+e.scrollTop>o+e.scrollTop},o.prototype.isPropManObj=function(e){return e&&e.getAttribute&&null!=e.getAttribute("data-pop")},o.prototype.setTimer=function(e){var t=this.metaObj;return function(e){t.timerTime+=100,t.timerTime>=t.timeForReadyToDrag&&(e.preventDefault(e),getEl(t.mvObj).clas.add("sj-obj-is-on-moving"),t.isOnDown=!0,t.isOnMoving=!1,clearTimeout(timer),t.timerTime=0)}},o.prototype.removeTimer=function(){var e=this.metaObj;clearTimeout(e.timer),e.timerTime=0},o.prototype.findAbsoluteParentEl=function(e){for(var t=e.parentNode;t&&(!t.style||!t.style.position||"absolute"!=t.style.position);)t=t.parentNode;return t||document.body},o.prototype.getKeyboarder=function(){return this.keyboarder},n.prototype={set:function(e){if(e instanceof Object)for(var t in e)this.modes[t]=e[t];else"string"==typeof e&&(this.modes[e]=!0);return this},get:function(e){return this.modes[e]},del:function(e){return delete this.modes[e],this},toggle:function(e){var t=this.modes[e];return void 0!=this.modes[e]&&null!=this.modes[e]&&"boolean"==typeof t&&(this.modes[e]=!t),this},clear:function(){return this.modes={},this},clone:function(){return new n(this.modes)},merge:function(e){if(e instanceof n){var t=e.modes;for(var o in t)this.modes[o]=t[o]}else this.set(e);return this}},i.prototype={STATUS_NONE:0,STATUS_MOVE:1,STATUS_DROP:2,setSelectorBox:function(e){var t=this,o=this.meta;this.delSelectorBox();var e=this.boxMan.getBox(e),n=e.element;this.selectorBox=e,n.setAttribute("data-status","selected"),o.isEventStarted||(o.isEventStarted=!0,getEl(document).addEventListener("keydown",function(e){null!=t.selectorBox&&void 0!=t.selectorBox&&(38==e.keyCode&&t.selectPrevObjInBox(t.selectorBox.element),40==e.keyCode&&t.selectNextObjInBox(t.selectorBox.element),17==e.keyCode&&t.handleKeyborderControler(t.selectorBox.element))}))},delSelectorBox:function(e){var t;if(null!=(t=null!=e&&""!=e?this.boxMan.getBox(e):this.selectorBox)&&void 0!=t){var o=t.element;if(null!=o&&void 0!=o&&"selected"==o.getAttribute("data-status")){o.removeAttribute("data-status"),this.selectorBox=void 0;var n=this.getSelectedObjInBox(o);n&&n.element&&n.element.removeAttribute("data-status")}}},setTargetBox:function(e){},handleKeyborderControler:function(e){this.keborderStatus==this.STATUS_NONE?this.keborderStatus=this.STATUS_MOVE:this.keborderStatus==this.STATUS_MOVE&&(this.keborderStatus=this.STATUS_DROP,this.keborderStatus=this.STATUS_NONE)},selectNextObjInBox:function(e){var t=this.getSelectedObjIndexInBox(e);return this.deselectObjAllInBox(e),this.selectObjInBoxByIndex(e,t+1),this},selectPrevObjInBox:function(e){var t=this.getSelectedObjIndexInBox(e);return this.deselectObjAllInBox(e),this.selectObjInBoxByIndex(e,t-1),this},deselectObjAllInBox:function(e){for(var t=this.boxMan.getBox(e),o=t.element,n=0;n<o.children.length;n++){var i=o.children[n];null!=i.getAttribute("data-obj")&&null!=i.getAttribute("data-status")&&i.removeAttribute("data-status")}return this},selectObjInBoxByIndex:function(e,t){var o=this.boxMan.getBox(e),n=o.element,i=n.children.length,r=-1;t=t>0?t:0,t=t<i?t:i-1;for(var s=0;s<n.children.length;s++){var a=n.children[s];if(null!=a.getAttribute("data-obj")&&++r==t){a.setAttribute("data-status","selected");break}}return this},getSelectedObjInBox:function(e){for(var t,o=this.boxMan.getBox(e),n=o.element,i=-1,r=0;r<n.children.length;r++){var s=n.children[r];if(null!=s.getAttribute("data-obj")&&(i++,null!=s.getAttribute("data-status"))){t=s;break}}return this.boxMan.getObj(t)},getSelectedObjIndexInBox:function(e){for(var t=this.boxMan.getBox(e),o=t.element,n=-1,i=n,r=0;r<o.children.length;r++){var s=o.children[r];if(null!=s.getAttribute("data-obj")&&(n++,null!=s.getAttribute("data-status"))){i=n;break}}return i}}},5:function(e,t,o){e.exports=o(0)}});