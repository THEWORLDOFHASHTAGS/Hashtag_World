var websocket;
$(document).ready(init);

function init() {
	if (!("WebSocket" in window)) {
		console.log("PING: ERROR_1");
		$('#status').append('<p><span style="color: red;">websockets are not supported </span></p>');
	}
	else {
		console.log("PING: CHECK");
		$('#status').append('<p><span style="color: green;">websockets are supported </span></p>');
		connect();
	}
}

function connect() {
	//console.log("PING: CONNECTING");
	websocket = new WebSocket("ws://129.16.155.39:8080/websocket");
	websocket.onopen = function(event) {onOpen(event)};
	websocket.onclose = function(event) {onClose(event)};
	websocket.onmessage = function(event) {onMessage(event)};
	websocket.onerror = function(event) {onError(event)};
};

function send(msg) {
	//console.log("PING: SEND");
	websocket.send(msg);
	console.log('Message sent');
}

function onOpen(event) {
	console.log("PING: OPEN");
	showScreen('<span style="color: green;">CONNECTED</span>');
}

function onMessage(event) {
    var str = event.data;
    var res = str.split(",");
    for (var i=0; i<res.length; i++) {
        createItem(res[i]);
    }
	console.log("PING: MESSAGE");
	showScreen('<span style="color: blue;">RESPONSE: ' + event.data + '</span>');
};

function onClose(event) {
	//console.log("PING: CLOSED");
	showScreen('<span style="color: red;">DISCONNECTED</span>');
}

function onError(event) {
	console.log("PING: ERROR_2: " + event.data);
	showScreen('<span style="color: red;">ERROR: ' + event.data + '</span>');
};

function showScreen(txt) {
	$('#output').prepend('<p>' + txt + '</p>');
};