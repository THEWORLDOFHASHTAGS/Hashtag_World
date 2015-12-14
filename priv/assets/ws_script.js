var websocket;
$(document).ready(init);

function init() {
	if (!("WebSocket" in window)) {
		alert("PING: ERROR_1");
		$('#status').append('<p><span style="color: red;">websockets are not supported </span></p>');
	}
	else {
		alert("PING: CHECK");
		$('#status').append('<p><span style="color: green;">websockets are supported </span></p>');
		connect();
	}
}

function connect() {
	//alert("PING: CONNECTING");
	websocket = new WebSocket("ws://localhost:8080/websocket");
	websocket.onopen = function(event) {onOpen(event)};
	websocket.onclose = function(event) {onClose(event)};
	websocket.onmessage = function(event) {onMessage(event)};
	websocket.onerror = function(event) {onError(event)};
};

function send(msg) {
	//alert("PING: SEND");
	websocket.send(msg);
	console.log('Message sent');
}

function onOpen(event) {
	alert("PING: OPEN");
	showScreen('<span style="color: green;">CONNECTED</span>');
}

function onMessage(event) {
	alert("PING: MESSAGE");
	showScreen('<span style="color: blue;">RESPONSE: ' + event.data + '</span>');
};

function onClose(event) {
	//alert("PING: CLOSED");
	showScreen('<span style="color: red;">DISCONNECTED</span>');
}

function onError(event) {
	alert("PING: ERROR_2: " + event.data);
	showScreen('<span style="color: red;">ERROR: ' + event.data + '</span>');
};

function showScreen(txt) {
	$('#output').prepend('<p>' + txt + '</p>');
};