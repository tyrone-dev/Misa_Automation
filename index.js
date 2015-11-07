// Misa Pi: Raspberry Pi based room automation, control and monitoring
// based on a real time web application using nodejs

var app = require('express')();
var http = require('http').createServer(app);
var GPIO = require('onoff').Gpio;
var socketServer = require('socket.io').listen(http);
//var async = require('async');
//var time_handler = require('moment');
var toggle_val = 1;
//var counter = 0;

var relay = new GPIO(4, 'out');
var hard_button = new GPIO(17, 'in', 'both');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html')
});

/*
async.whilst(function ()

	{return counter < 1000;},
	function(callback){		
	setTimeout(callback, 60000);
	var time_now = time_handler().format('HH:mm');
	console.log(time_now);
	//socketServer.emit('time-update', {data: time_now});
	socketServer.emit('time-update', {data: time_now});
	}, 
	function (err){
		console.log("error")
	}
);
*/

hard_button.watch(function(err, state){
	
		if (state == 1)
		{
		  toggle_val = toggle_val + 1;
		  toggle_val = toggle_val%2;
		  
		  // relay is triggered by negative logic

		  if (toggle_val == 0){
			  console.log('light off');
			  relay.writeSync(1);
			  socketServer.emit('light-off', {'key': 'OFF'});
		  }
		  if (toggle_val == 1){
			  console.log('light on');
			  relay.writeSync(0);
			  socketServer.emit('light-on', {'key': 'ON'});		  
		  }
		}
	}); 


socketServer.on('connection', function(socket){
  console.log('a user connected');
  
  var old = relay.readSync();
  console.log(old);
  
  if(old == 1){
	 socket.emit('light-off', {'key': 'OFF'}); 
  }
  else{
	 socket.emit('light-on', {'key': 'ON'});
  }  
  
  /*hard_button.watch(function(err, state){
	
		if (state == 1)
		{
		  toggle_val = toggle_val + 1;
		  toggle_val = toggle_val%2;
		  
		  // relay is triggered by negative logic

		  if (toggle_val == 0){
			  console.log('light off');
			  relay.writeSync(1);
			  socket.emit('light-off', {'key': 'OFF'});
		  }
		  if (toggle_val == 1){
			  console.log('light on');
			  relay.writeSync(0);
			  socket.emit('light-on', {'key': 'ON'});		  
		  }
		}
	}); */
  
  socket.on('toggle-light', function(data){
	  console.log('event triggered');
	  
	  toggle_val = toggle_val + data;
	  toggle_val = toggle_val%2;
	  
	  if (toggle_val == 0){
		  console.log('light off');
		  relay.writeSync(1);
		  socket.emit('light-off', {'key': 'OFF'});
	  }
	  if (toggle_val == 1){
		  console.log('light on');
		  relay.writeSync(0);
		  socket.emit('light-on', {'key': 'ON'});		  
	  }	   
  });
	
});

http.listen(3000, function(){
	console.log('listening on *:3000')	
});

app.use(require('express').static(__dirname + '/public')); //sever static files (css, js, fonts, etc.)
