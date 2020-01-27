/**************************************************
 *
 * MODEL
 *
 **************************************************/
JellySpeaker.SpeakProcess = function(object){
    this.results = [];
    this.resultIndex = -1;
    this.init(object);
};
JellySpeaker.SpeakProcess.prototype.init = function(object){
    for (var key in object)
        this[key]= object[key];
    return this;
};



JellySpeaker.SpeakResult = function(object){
    this.time = null;
    this.type = JellySpeaker.SpeakResult.TYPE_SPEECH;
    this.confidence = null;
    this.script = null;
    this.analysis = null;
    this.init(object);
};
JellySpeaker.SpeakResult.prototype.init = function(object){
    for (var key in object)
        this[key]= object[key];
    return this;
};
JellySpeaker.SpeakResult.TYPE_SPEECH = 1;
JellySpeaker.SpeakResult.TYPE_TEXT = 2;



JellySpeaker.JellyCommand = function(object){
    this.command;
    this.parameter;
};
JellySpeaker.JellyCommand.prototype.init = function(object){
    for (var key in object)
        this[key]= object[key];
    return this;
};


