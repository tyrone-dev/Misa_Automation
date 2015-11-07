var socket = io();
iosocket = io.connect();
initButtons();
var toggleVal=0;

function initButtons(){
	$('.btn-toggle').button();
	$('.btn-pirate').button();				
}

$(document).ready(function() {
	
	$('.btn-toggle').click(function() {
		toggleVal1 = 1;					
		iosocket.emit('toggle-light',toggleVal1);
		
	});
	
	iosocket.on('light-off', function(value){
		$('#light-status').text(value.key);		
	});
	
	iosocket.on('light-on', function(value){
		$('#light-status').text(value.key);		
	});
	
	iosocket.on('time-update', function(value){
		$('#time').text(value.data);		
	});
	
	
});

