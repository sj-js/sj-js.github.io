require('this_lib_css');
require('this_help_css');
require('markdown_css');
require('github_css');


var TesterConverter = require('./SjMarkdownTesterConverter');



var testerConverter = new TesterConverter().init();







//                console.log(0);
//				boxMan.addEventListener('drop', function(event){
//					var files = event.exbox.files;
//					for (var i=0; i<files.length; i++){
//						var file = files[i];
//						var filePath = null;
//						fileExtractor.getObjFromFile(file, filePath, function(content){
//					    	boxMan.newObj({
//					    		content: content,
//					    		type: file.type ? file.type : ''
//					    	});
//						});
//					}
//				});