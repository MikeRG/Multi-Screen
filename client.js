var net = require ('net');
var client = new net.Socket();

client.on('error', function(error){});

client.on('close', function(error){
	process.exit(1);
});

client.on('connect', function(data){
	this.write('end');
});
client.on('data', function(data){
	console.log(data);	
});

client.connect(8001, '172.24.253.64');