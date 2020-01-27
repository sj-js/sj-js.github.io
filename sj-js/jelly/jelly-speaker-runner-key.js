/****************************************************************************************************
 *
 * RUNNER SETUP
 *
 ****************************************************************************************************/
/**************************************************
 *
 * RUNNER - key
 *
 **************************************************/
JellySpeaker.KeyRunner = function(object){
    this.type = JellySpeaker.TYPE_RUNNER_KEY;
    this.parent = null;
    this.keyList = null;

    if (object instanceof Array){
        this.keyList = object;
    }else if (typeof object == 'string'){
        this.keyList = KeyMan.parse(object);
    }
    // this.init(object);
};
JellySpeaker.KeyRunner.prototype.init = function(object){
    for (var key in object)
        this[key]= object[key];
    return this;
};
JellySpeaker.KeyRunner.prototype.setup = function(parent){
    return this;
};
JellySpeaker.KeyRunner.prototype.getExpression = function(){
    return KeyMan.convertToExpression(this.keyList);
};



