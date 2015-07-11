var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

var listenPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var listenIP = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.set('port', listenPort);
app.set('ipaddr', listenIP);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var speak = [];
var history = []; //only add to this list

app.get('/js/:file', function(req, res){
    res.sendFile(__dirname + '/js/'+req.params.file, res);
});
app.get('/partials/:file', function(req, res){
    res.sendFile(__dirname + '/app/partials/'+req.params.file, res);
});

app.get('/people', function(req, res) {
	res.send(speak);
	console.log("Sent!");
});

app.post('/people', function(req, res) {
	console.log(req.body);
	var person = req.body;
    speak.push(person); //json
    history.push(person);
    io.emit('personAdder', req.body);
    return res.sendStatus(200);
});

app.get('/history', function(req, res) {
	res.send(history);
	console.log("Sent history!");
});

app.post('/history', function(req, res) {
	var msg = req.body;
	if(msg.clear) {
		history = [];
		console.log("Cleared history");
		io.emit('personRemover', "historyClear");
	}
})

app.post('/remove', function(req, res) { //receives index number
	if(req.body.clearAll) {
		speak = [];
		console.log("Removed all");
		io.emit('personRemover', "all");
	}
	else{	
		var id = req.body.index;
		console.log(id);
		speak.splice(id, 1);
		io.emit('personRemover', id);
	}
	return res.sendStatus(200);
});


app.get('*', function(req, res){
    res.sendFile(__dirname + '/app/index.html', res);
});

http.listen(listenPort, listenIP, function () {
    'use strict';
    console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});