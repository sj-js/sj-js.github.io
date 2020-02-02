/***************************************************************************
 * [Node.js] import
 ***************************************************************************/
try{
    var crossman = require('@sj-js/crossman');
    var ready = crossman.ready,
        getEl = crossman.getEl,
        newEl = crossman.newEl,
        getData = crossman.getData,
        SjEvent = crossman.SjEvent
    ;
}catch(e){}

/***************************************************************************
 * Module
 ***************************************************************************/
function FixMan(options){
    var that = this;
    this.event = new SjEvent();
    this.fixedObjList = [];

    /** Mode **/
    this.globalSetup = {
    };
    if (options)
        this.setup(options);

    window.addEventListener('resize', function(event){
        that.resize(event);
    });
    document.addEventListener('scroll', function(event){
        that.whenScroll(event);
    });
}

/***************************************************************************
 * [Node.js] exports
 ***************************************************************************/
try {
    module.exports = exports = FixMan;
} catch (e) {}





FixMan.EVENT_AFTERDETECT = 'afterdetect';
FixMan.EVENT_DETACH = 'detach';
FixMan.EVENT_ANIMATIONBYOBJECTHEIGHT = 'animationbyobjectheight';
FixMan.EVENT_ANIMATIONSTARTBYOBJECTHEIGHT = 'animationstartbyobjectheight';
FixMan.EVENT_ANIMATIONDOINGBYOBJECTHEIGHT = 'animationdoingbyobjectheight';
FixMan.EVENT_ANIMATIONENDBYOBJECTHEIGHT = 'animationendbyobjectheight';



/*************************
 *
 * EVENT
 *
 *************************/
FixMan.prototype.addEventListener               = function(element, eventName, eventFunc){ this.event.addEventListener(element, eventName, eventFunc); return this; };
FixMan.prototype.addEventListenerById           = function(element, eventName, eventFunc){ this.event.addEventListenerById(element, eventName, eventFunc); return this; };
FixMan.prototype.addEventListenerByEventName    = function(eventName, eventFunc){ this.event.addEventListenerByEventName(eventName, eventFunc); return this; };
FixMan.prototype.hasEventListener               = function(element, eventName, eventFunc){ return this.event.hasEventListener(element, eventName, eventFunc); };
FixMan.prototype.hasEventListenerById           = function(element, eventName, eventFunc){ return this.event.hasEventListenerById(element, eventName, eventFunc); };
FixMan.prototype.hasEventListenerByEventName    = function(eventName, eventFunc){ return this.event.hasEventListenerByEventName(eventName, eventFunc); };
FixMan.prototype.hasEventListenerByEventFunc    = function(eventFunc){ return this.event.hasEventListenerByEventFunc(eventFunc); };
FixMan.prototype.removeEventListener            = function(element, eventName, eventFunc){ return this.event.removeEventListener(element, eventName, eventFunc); };
FixMan.prototype.removeEventListenerById        = function(element, eventName, eventFunc){ return this.event.removeEventListenerById(element, eventName, eventFunc); };
FixMan.prototype.removeEventListenerByEventName = function(eventName, eventFunc){ return this.event.removeEventListenerByEventName(eventName, eventFunc); };
FixMan.prototype.removeEventListenerByEventFunc = function(eventFunc){ return this.event.removeEventListenerByEventFunc(eventFunc); };
FixMan.prototype.execEventListener              = function(element, eventName, event){ return this.event.execEventListener(element, eventName, event); };
FixMan.prototype.execEventListenerById          = function(element, eventName, event){ return this.event.execEventListenerById(element, eventName, event); };
FixMan.prototype.execEventListenerByEventName   = function(eventName, event){ return this.event.execEventListenerByEventName(eventName, event); };
FixMan.prototype.execEvent                      = function(eventMap, eventNm, event){ return this.event.execEvent(eventMap, eventNm, event); };






/*************************
 * Setup
 *************************/
FixMan.prototype.setup = function(options){
    for (var objName in options){
        this.globalSetup[objName] = options[objName];
    }
    return this;
};

/*************************
 *
 * DETECT DOM SETUPED WITH POPMAN OPTION
 *
 *************************/
FixMan.prototype.detect = function(afterDetectFunc){
    var that = this;
    ready(function(){
        // getEl().ready(function(){
        var setupedElementList;
        /** 객체탐지 적용(팝창) **/
        setupedElementList = document.querySelectorAll('[data-fixed]');
        for (var j=0; j<setupedElementList.length; j++){
            that.add(setupedElementList[j]);
        }
        /** Run Function After Detect **/
        if (afterDetectFunc)
            afterDetectFunc(that);
        if (that.hasEventListenerByEventName('afterdetect'))
            that.execEventListenerByEventName('afterdetect');
    });
    return this;
};

FixMan.prototype.add = function(obj){
    getEl(obj).addClass('sj-obj-fixable');
    this.fixedObjList.push(obj);
};


FixMan.prototype.resize = function(event){
    /** 초기화 시키고 다시 설정 **/
    for (var j=0, obj; j<this.fixedObjList.length; j++){
        obj = this.fixedObjList[j];
        obj.qMenuY = null;
        if (obj.style.position == 'fixed'){
            //=> 뭔가 정리?
            if (obj.parentNode == obj.emptyDiv.parentNode)
                getEl(obj.emptyDiv).removeFromParent();
            //=> No fixed 상태처리
            getEl(obj).removeClass('sj-obj-fixed').setStyle('position', '').setStyle('top', obj.qMenuY + 'px');
        }
    }
    this.whenScroll(event);
};

FixMan.prototype.whenScroll = function(event){
    this.checkFixableObject();
};

FixMan.prototype.checkFixableObject = function(){
    for (var j=0; j<this.fixedObjList.length; j++){
        try{
            var that = this;
            var obj = this.fixedObjList[j];
            //obj 최초의 값을 기억합니다.
            if (!obj.qMenuY && obj.style.position != 'fixed'){
                var style = window.getComputedStyle(obj, null);
                var ml = parseInt(style.marginLeft?style.marginLeft:0);
                var bl = parseInt(style.borderLeftWidth?style.borderLeftWidth:0);
                var pl = parseInt(style.paddingLeft?style.paddingLeft:0);
                obj.qMenuY = obj.offsetTop;
                obj.qMenuX = obj.offsetLeft -ml;
                obj.qMenuCssText = obj.style.cssText;
                obj.qMenuWidth = obj.clientWidth;
                obj.qMenuHeight = obj.clientHeight;
                obj.qMenuClassName = obj.className;
                // console.log(
                //     getEl(obj).getBoundingOffsetRect(),
                //     getEl(obj).getBoundingClientRect(),
                //     getEl(obj).getBoundingPageRect(),
                // );
                // console.log(obj.offsetLeft, obj.clientLeft, obj.scrollLeft, style);
            }
            //obj를 fixed시키기 전에 같은 크기의 모형Element를 만들어 임시 지지대 역할을 합니다.
            if (!obj.emptyDiv){
                var emptyDiv = obj.emptyDiv = newEl('div').style(obj.qMenuCssText).returnElement();
                if (!emptyDiv.clientWidth)
                    emptyDiv.style.width = obj.qMenuWidth +'px';
                if (!emptyDiv.clientHeight)
                    emptyDiv.style.height = obj.qMenuHeight +'px';
            }
            /** 천장에 닿으면 **/
            if (0 > obj.qMenuY - getEl().getBodyScrollY()){
                if (obj.style.position != 'fixed'){
                    //=> 빈DIV 넣어놓기
                    // obj.emptyDiv.style = obj.qMenuStyle;
                    getEl(obj.emptyDiv).setStyle('opacity', 0);
                    if (obj.qMenuClassName){
                        var classList = obj.qMenuClassName.split(' ');
                        getEl(obj.emptyDiv).addClass(classList);
                    }
                    obj.parentNode.insertBefore(obj.emptyDiv, obj.nextSibling);
                    //=> fixed 상태처리
                    (function doFix(){
                        //Event
                        // if (this.animationFadeOutByTime)
                        //     this.animationFadeOutByTime();
                        //Style
                        getEl(obj).addClass('sj-obj-fixed')
                            .setStyle('position', 'fixed')
                            .setStyle('top', '0')
                            .setStyle('left', obj.qMenuX + 'px');
                    })();
                }

            /** 원위치 좌표로 돌아오면 천장에서 때기 **/
            }else{
                if (obj.style.position == 'fixed') {
                    //=> 빈DIV 제거
                    if (obj.parentNode == obj.emptyDiv.parentNode)
                        getEl(obj.emptyDiv).removeFromParent();
                    //=> No fixed 상태처리
                    (function noFix(){
                        //Event
                        // if (this.animationFadeInByTime)
                        //     this.animationFadeInByTime();
                        //Style
                        getEl(obj).removeClass('sj-obj-fixed')
                            .setStyle('position', '')
                            .setStyle('top', '')
                            .setStyle('left', '');
                    })();
                }
            }

            that.animationByObjectHeight(obj);
        }catch(e){
            console.error(e);
        }
    }
};

FixMan.prototype.animationByObjectHeight = function(object){
    //임시 Event내용
    var scrollY = window.scrollY;
    var fixableObjectHeight = object.qMenuY;
    var offsetTop = object.emptyDiv.getBoundingClientRect().top +scrollY;
    var processHeight = Math.max(0, scrollY - offsetTop);
    var rateReal = (processHeight / fixableObjectHeight);
    var rateLimit = Math.min(1, rateReal);
    var rateLimitReverse = 1 -rateLimit;
    // console.log('fade>', rateLimit.toFixed(1), processHeight, scrollY);

    if (object.statusFixed && 0 >= rateLimit){ /** 다시 위로 떨어질때 **/
        object.statusFixed = false;
        object.statusOverHeight = false;
        this.execEventListener(object, FixMan.EVENT_DETACH, object);

    }else if (!object.statusFixed && 0 < rateLimit){ /** fixed의 원본객체를 가리기 시작할 때 **/
        object.statusFixed = true;
        object.statusOverHeight = false;
        this.execEventListener(object, FixMan.EVENT_ANIMATIONSTARTBYOBJECTHEIGHT, object);

    }else if (object.statusFixed && object.statusOverHeight &&  0 < rateLimit && rateLimit < 1){ /** fixed의 원본객체크기를 가리고 있을 때 **/
        object.statusFixed = true;
        object.statusOverHeight = false;
        this.execEventListener(object, FixMan.EVENT_ANIMATIONDOINGBYOBJECTHEIGHT, object);

    }else if (object.statusFixed && !object.statusOverHeight && 1 == rateLimit){ /** fixed의 원본객체크기가 다 가려졌을 때 **/
        object.statusFixed = true;
        object.statusOverHeight = true;
        this.execEventListener(object, FixMan.EVENT_ANIMATIONENDBYOBJECTHEIGHT, object);
    }

    this.execEventListener(object, FixMan.EVENT_ANIMATIONBYOBJECTHEIGHT, {
        object:object,
        rateLimit:rateLimit,
        rateReal:rateReal,
        fixableObjectHeight: fixableObjectHeight,
        rateLimitReverse: rateLimitReverse,
    });
};



FixMan.prototype.animationFadeInByTime = function(){
    //임시 Event내용
    if (obj.statusFadeIn)
        return;
    obj.statusFadeIn = true;
    var durationTime = 2000;
    var startTime = new Date().getTime();

    var objectToAnimation = obj;
    if (objectToAnimation.style.opacity == "")
        objectToAnimation.style.opacity = 1;

    (function bbb(){
        var elapsedTime = new Date().getTime() - startTime;
        var rate = Math.min(1, elapsedTime / durationTime);
        var rateReverse = 1 -rate;
        console.log('fadein>', rate, elapsedTime);
        objectToAnimation.style.transform = 'scaleY('+ rate +')';
        if (rate >= 1){
            //Finish Event
            // objectToFadeOut.parentNode.removeChild(objectToFadeOut);
            console.error('complete');
        }else{
            // setTimeout(bbb, 16);
        }
    })();
};

FixMan.prototype.animationFadeOutByTime = function(){
    //임시 Event내용
    if (obj.statusFadeOut)
        return;
    obj.statusFadeOut = true;
    var durationTime = 2000;
    var startTime = new Date().getTime();

    // obj.style.top = obj.offsetTop +'px';
    // obj.style.left = obj.offsetLeft +'px';
    // obj.style.position = 'absolute';
    // var objectToFadeOut = obj.children[0];
    var objectToAnimation = obj;
    if (objectToAnimation.style.opacity == "")
        objectToAnimation.style.opacity = 1;

    (function aaa(){
        var elapsedTime = new Date().getTime() - startTime;
        var rate = Math.min(1, elapsedTime / durationTime);
        var rateReverse = 1 -rate;
        console.log('fadeout>', rateReverse, elapsedTime);
        objectToAnimation.style.transform = 'scaleY('+ rateReverse +')';
        if (rate >= 1){
            //Finish Event
            // objectToFadeOut.parentNode.removeChild(objectToFadeOut);
            console.error('complete');
        }else{
            setTimeout(aaa, 16);
        }
    })();
};