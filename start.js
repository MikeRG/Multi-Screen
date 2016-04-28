 var forever = require('forever-monitor');

  var child = new (forever.Monitor)('main.js', {
  	spinSleepTime	: 1000,		//Wait 1 second before restart
  	killTree		: true,     //Kill previous child
    silent			: true,
    args			: []
  });

  child.start();