/***************************************************************************
 *
 * Jelly - Command Listener
 *
 ***************************************************************************/
JellySpeaker.PluginCommandSearchTest = function(commandName, commandWord){
    this.name = '';
    this.parent = null;
    this.statusSetuped = false;

    this.commandName = commandName;
    this.commandWord = commandWord;
};
JellySpeaker.PluginCommandSearchTest.prototype.setup = function(parent){
    var that = this;
    var conditionMap = {};
    conditionMap[this.commandName] = function(object){
        return that.commandFunction(object, that.commandWord)
    };
    this.parent.setupCommandCondition(conditionMap);
};
JellySpeaker.PluginCommandSearchTest.prototype.start = function(){

};
JellySpeaker.PluginCommandSearchTest.prototype.end = function(){

};
JellySpeaker.PluginCommandSearchTest.prototype.dispose = function(){

};




JellySpeaker.PluginCommandSearchTest.prototype.commandFunction = function(object, commandWord){
    var script = object.script;
    console.log(object, commandWord);
    var commandIndex = script.indexOf(commandWord);
    if (commandIndex != -1){
        var startIndexForKeyword =  0;
        var endIndexForKeyword = commandIndex;
        var keyword = script.substr(startIndexForKeyword, endIndexForKeyword).trim();
        var indexToTest = keyword.indexOf('이라고');
        if (0 < indexToTest && indexToTest == (keyword.length -3)){
            keyword = keyword.substr(0, keyword.length -3);
            return {keyword: keyword};
        }
        //
        var indexToTest = keyword.indexOf('라고');
        if (0 < indexToTest && indexToTest == (keyword.length -2)){
            keyword = keyword.substr(0, keyword.length -2);
            return {keyword: keyword};
        }
        //
        return {keyword: keyword};
    }
};
