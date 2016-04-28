//Forever Monitor
var forever = require('forever-monitor');

//Server
var net = require('net');
var client = [];

//Electron window
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var windows = [null,null]

//Get the config file data
const config = require('config.json') ("myConfig.json");
var configOption = config.Cell;
var theString = "var configValue = '"+ configOption +"';"
	+"var element = document.getElementById('cellSelect');"
			+"for(var i = 0; i < element.options.length; i++){"
				+"if(element.options[i].text == configValue){"
					+"element.options[i].selected = true;"
					+"$('.cellSelectForm')[0].childNodes[5].click();"
					+"break;"
				+"}"
			+"}"

//*********************************************
//Get the server started
//Reload the pages when data is pushed
var port = 8001;
var myServer = new net.Server();
var date = new Date();

myServer.on('listening', function() {	//Connect to our server at a given IP and port
	console.log('Server is listening ' + date);
});
myServer.listen(port);

myServer.on('connection', function(client){

	client.on('error', function(error){
		throw error;
	});

	client.on('data', function(data) {						//If we receive data from the client, close out the pages
		console.log('Received: ' + data);	
		if ('' + data === 'end'){
			this.destroy();
			process.exit(1);
		}
	});

	client.on('close', function() {								//Should the client ever be closed (manually lost, network lost, etc), log to the console with the date
		console.log('Connection closed: ' + date);		
	});
});//End myServer.listen()


//**************************************************************************
//This will create a browser window in all connected monitors 
//and the bowsers will be in kiosk
app.on('ready', function(){
  var electronScreen = electron.screen;
  
	//Display
	var displays = electronScreen.getAllDisplays();
  var displayExternal = null;
	var displayPrimary = null;	
	
	//Window size
	var sizePrimary = null;
	var sizeExternal = null;	
	//console.log(electronScreen.getAllDisplays()); 	 //Use this to figure out the bounds of all connected monitors, if needed


	//********************************************************************************************/
	// Figure out the how many displays are available and grab the workAreaSize for each		  
	// to display the window in full screen																	  													
	for (var i in displays){
		if (displays[i].bounds.x == 0 && displays[i].bounds.y == 0){
			displayPrimary = displays[i];
			sizePrimary = displays[i].workAreaSize;
			continue;
    }
		
    if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0){
			displayExternal = displays[i];
			sizeExternal = displays[i].workAreaSize;
			continue;
    }			
  }//End for()
	
	//
	if (displayPrimary){
		var window = new BrowserWindow({
			width: sizePrimary.width, 
			height: sizePrimary.height,
			x: displayPrimary.bounds.x,
			y: displayPrimary.bounds.y,
			kiosk: true,
			frame: false,
			webPreferences: {nodeIntegration: false}
		});
		windows[0] = window
		
		//mainWindow.webContents.openDevTools();
		window.loadURL('http://172.24.253.4:8080');
		
			windows[0].webContents.on('did-stop-loading', function(){
				setTimeout(function(){
					windows[0].webContents.executeJavaScript(theString);
				}, 4000)
			});
	}//End if(displayPrimary)


	//External display is at port 8083
	if (displayExternal){
		var window = new BrowserWindow({
  			width: sizeExternal.width, 
			height: sizeExternal.height,
	 		x: displayExternal.bounds.x,
	  		y: displayExternal.bounds.y,
			kiosk: true,
			frame: false,
			webPreferences: {nodeIntegration: false}
		});
		windows[1] = window
	
		window.loadURL('http://172.24.253.4:8083');
		windows[1].webContents.on('did-stop-loading', function(){
				setTimeout(function(){
					windows[1].webContents.executeJavaScript(theString);
				},4000)
			});
	}//End if(displayExternal)

	console.log("Program End");
});//End app.on