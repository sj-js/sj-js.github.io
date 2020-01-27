/**************************************************
 *
 * RUNNER - speech
 *
 **************************************************/
JellySpeaker.SpeechRunner = function(object){
    this.type = JellySpeaker.TYPE_RUNNER_SPEECH;
    this.parent = null;
    this.speechExpression = '';
    this.regexp = null;
    if (object instanceof String){
        this.speechExpression = object;
    }else if (object instanceof RegExp){
        this.regexp = object;
    }
    // this.init(object);
};
JellySpeaker.SpeechRunner.prototype.init = function(object){
    for (var key in object)
        this[key]= object[key];
    return this;
};
JellySpeaker.SpeechRunner.prototype.setup = function(parent){
    return this;
};
JellySpeaker.SpeechRunner.prototype.getExpression = function(){
    return this.speechExpression;
};
JellySpeaker.SpeechRunner.prototype.analysis = function(speechText){
    var parent = this.parent;
    var variableman = parent.variableman;
    var speechExpression = this.getExpression();
    if (speechExpression instanceof RegExp){
        speechExpression.match(speechText);
    }else{
        //- Analysis
        var analysisResultList = variableman.parseDataList(speechText, speechExpression);
        //- Make RegExp
        analysisResultList;
        //- Make Parameter

    }
    var parameter = {};
    return parameter;
};



/****************************************************************************************************
 *
 * PROCESS - SpeechRecognizer
 *
 ****************************************************************************************************/
JellySpeaker.prototype.startSpeechRecognizer = function(){
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
    //Make
    var that = this;
    var recognizer = this.speechRecognizer = new SpeechRecognition();
    recognizer.interimResults = true;
    recognizer.continuous = true;
    recognizer.maxAlternatives = 1;
    recognizer.lang = 'ko-KR';
    recognizer.onerror = function(event){
        if (event.error == 'aborted' || event.error == 'no-speech'){
            console.log(event.error, event);
            return;
        }
        console.error('Error', event);
    };
    recognizer.onstart = function() {
        console.log('  >> Speech recognizer service has started');
    };
    recognizer.onend = function() {
        if (!that.speechRecognizer){
            console.log('  >> Speech recognizer service disconnected');
            return that.onStopSpeech();
        }
        console.log('Speech recognizer service retry ~');
        that.startSpeechRecognizer();
    };
    recognizer.onnomatch = function(event) {
        console.log('no match');
    };
    recognizer.onspeechstart = function() {
        console.log('speech start');
        that.onStartSpeechResult();
    };
    recognizer.onspeechend = function() {
        console.log('speech end');
        if (!that.speechRecognizer){
            return;
        }
        that.onEndSpeechResult(that.lastProcessResult);
        that.lastProcessResult = new JellySpeaker.SpeakProcess();
    };
    recognizer.onresult = function(event){
        that.lastTimeSpeechInput = new Date().getTime();
        var results = event.results;

        // that.onSpeechResult(results);
        var processResult = that.lastProcessResult = new JellySpeaker.SpeakProcess({results:results, resultIndex:event.resultIndex});
        that.onSpeechResult(processResult);

        // var result = that.getMostConfidentResult(results);
        var result = results[event.resultIndex];
        if (result.isFinal){
            var finalResult = new JellySpeaker.SpeakResult({
                time: that.lastTimeSpeechInput,
                script: result[0].transcript,
                confidence: result[0].confidence
            });
            that.pushLog(finalResult);
            that.onSpeechFinalResult(finalResult);
        }
    };
    recognizer.start();
};

JellySpeaker.prototype.stopSpeechRecognizer = function(){
    this.speechRecognizer.abort();
    this.speechRecognizer = null;
    return this;
};

JellySpeaker.prototype.checkSpeechRecognizerStatus = function(){
    return !!this.speechRecognizer;
};


JellySpeaker.prototype.getMostConfidentResult = function(results){
    var bestConfidenceIndex = -1;
    for (var i=0, bestConfidence=0; i<results.length; i++){
        if (results[i][0].confidence > bestConfidence){
            bestConfidence = results[i][0].confidence;
            bestConfidenceIndex = i;
        }
    }
    return results[bestConfidenceIndex];
};
JellySpeaker.prototype.onSpeechFinalResult = function(finalResult){
    var result = this.execEventListenerByEventName(JellySpeaker.EVENT_FINALRESULT, finalResult);
    if (!result)
        this.runCommand(finalResult);
};

JellySpeaker.prototype.onSpeechResult = function(result){
    this.execEventListenerByEventName(JellySpeaker.EVENT_RESULT, result);
};

JellySpeaker.prototype.onStartSpeechResult = function(result){
    this.execEventListenerByEventName(JellySpeaker.EVENT_STARTSPEECH, result);
};

JellySpeaker.prototype.onEndSpeechResult = function(result){
    this.execEventListenerByEventName(JellySpeaker.EVENT_ENDSPEECH, result);
};


JellySpeaker.prototype.onSpeechResultMessage = function(speechText){
    this.execEventListenerByEventName(JellySpeaker.EVENT_RESULT, speechText);
    if (this.modeNeedsToCallName){
        if (this.statusCalledMyName){
            this.analysisSpeechExpression(speechText);
        }else if (this.checkMyName(speechText)){
            //Check Listener Name
            this.startListenCommand();
            this.onSpeechResultMessage(speechText);
        }
        return;
    }else{
        this.analysisSpeechExpression(speechText);
    }
};

JellySpeaker.prototype.onStopSpeech = function(){
    this.execEventListenerByEventName(JellySpeaker.EVENT_STOPSPEECH, null);
};





JellySpeaker.prototype.startListenCommand = function(){
    this.statusCalledMyName = true;
    var now = new Date().getTime();
    this.startTimeForCommand = now;
    this.lastTimeSpeechInput = now;
    //- Event
    document.body.style.backgroundColor = '#ee99cc';
    this.textToSpeech('왜 불러?');
    return this;
};
JellySpeaker.prototype.stopListenCommand = function(){
    this.statusCalledMyName = false;
    var now = new Date().getTime();
    this.endTimeForCommand = now;
    //- Event
    document.body.style.backgroundColor = '#000000';
    return this;
};


JellySpeaker.prototype.checkMyName = function(speechText){
    var result = speechText.indexOf(this.name) != -1;
    return result
};

JellySpeaker.prototype.analysisSpeechExpression = function(speechText){
    var that = this;
    //Gether AnalysisResult
    var resultList = [];
    for (var runnerId in this.speechRunnerMap){
        var speechRunner = this.speechRunnerMap[runnerId];
        var parameter = speechRunner.analysis(speechText);
        if (parameter){
            var icon = speechRunner.parent;
            resultList.push({type:icon.commandName, parameter:parameter});
        }

    }
    //Run
    // console.error('Analysis SpeechExp Result>> ', resultList);
    getData(resultList).each(function(it){
        that.runCommand(it.commandName, it.parameter);
    });
    return resultList;
};
JellySpeaker.prototype.match = function(object, condition){
    var result = null;
    if (object.script.trim() == condition.trim())
        result = {ya:true};
    return result;
};
JellySpeaker.prototype.finishCommand = function(){
    return this;
};



JellySpeaker.prototype.textToSpeech = function(text){
    var msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
    return this;
};







