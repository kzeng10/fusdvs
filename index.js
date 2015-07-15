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

var defaultChannel = 'default';
var speak = {};
var history = {}; 

app.get('/js/:file', function(req, res){
    res.sendFile(__dirname + '/js/'+req.params.file, res);
});
app.get('/partials/:file', function(req, res){
    res.sendFile(__dirname + '/app/partials/'+req.params.file, res);
});
app.get('/defaultChannel', function(req, res) {
	res.send({defaultChannel: defaultChannel});
});

app.get('/people', function(req, res) {
	var channel = req.query.channel || defaultChannel;
	if(!speak[channel]) {
		speak[channel] = [];
	}
	res.send(speak[channel]);
	console.log("Sent!");
});

app.post('/people', function(req, res) {
	var channel = req.query.channel || defaultChannel;
	console.log(req.body);
	var person = req.body;
    speak[channel].push(person);
    history[channel].push(person);
    io.emit('personAdder_'+channel,req.body);
    return res.sendStatus(200);
});

app.get('/history', function(req, res) {
	var channel = req.query.channel || defaultChannel;
	if(!history[channel]) {
		history[channel] = [];
	}
	res.send(history[channel]);
	console.log("Sent history!");
});

app.post('/history', function(req, res) {
	var channel = req.query.channel || defaultChannel;
	var msg = req.body;
	if(msg.clear) {
		history[channel] = [];
		console.log("Cleared history");
		io.emit('personRemover_'+channel, "historyClear");
	}
});

app.post('/remove', function(req, res) { //receives index number
	var channel = req.query.channel || defaultChannel;
	if(req.body.clearAll) {
		speak[channel] = [];
		console.log("Removed all");
		io.emit('personRemover_'+channel, "all");
	}
	else{	
		var id = req.body.index;
		console.log(id);
		speak[channel].splice(id, 1);
		io.emit('personRemover_'+channel, id);
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