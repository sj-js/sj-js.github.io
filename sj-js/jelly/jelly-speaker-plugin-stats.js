/***************************************************************************
 *
 * Jelly - Command Listener
 *
 ***************************************************************************/
JellySpeaker.PluginStats = function(){
    this.name = '';
    this.parent = null;
    this.statusSetuped = false;
};
JellySpeaker.PluginStats.prototype.setup = function(parent){
    var that = this;
    var popman = parent.popman;
    var keyman = parent.keyman;
    ready(function(){
        popman.add(popman.new({
            id:'pop-stats',
            exp:'(90%)*/(10%)*',
            modeDark: false,
            closebyesc: true,
            closebyclickout: true,
            add:function(data){
                getEl(data.element).style('text-align:left; font-family: monospace;')
            },
        }));
    });

    this.parent
        .addEventListenerByEventName(JellySpeaker.EVENT_NOMORESPEECH, function(data){
            popman.close('pop-stats');
        })
        .addEventListenerByEventName(JellySpeaker.EVENT_RESULT, function(result){
            var pop = popman.pop('pop-stats');
            that.makePopForRecogStats(result.results, result.resultIndex);
            pop.element.parentNode.scrollTop = pop.element.parentNode.scrollHeight;

        });
};
JellySpeaker.PluginStats.prototype.start = function(){

};
JellySpeaker.PluginStats.prototype.end = function(){

};
JellySpeaker.PluginStats.prototype.dispose = function(){

};





JellySpeaker.PluginStats.prototype.makePopForRecogStats = function(results, idx){
    var that = this;
    var parent = that.parent;
    var popman = parent.popman;
    var keyman = parent.keyman;
    var popStats = popman.getPop('pop-stats');
    var divSpeakStats = popStats.element;
    //Clear
    divSpeakStats.innerHTML = '';
    //Make
    for (var i=0, result, isFinal, script,confidence; i<results.length; i++){
        result = results[i];
        isFinal = result.isFinal;
        script = result[0].transcript;
        confidence = result[0].confidence;
        var ridxExp = (i == idx) ? '>> ' : '&nbsp;&nbsp;&nbsp;';
        var expressionForConfidence = ridxExp + '[' +makeGageExpression(confidence) +'] ' +i+ ') ';
        if (isFinal){
            getEl(divSpeakStats).addEl('<div>' +expressionForConfidence+ '<span style="font-weight:bold">' +script+ '</span></div>');
        }else{
            getEl(divSpeakStats).addEl('<div>' +expressionForConfidence+ '<span>' +script+ '</span></div>');
        }
    }
};


