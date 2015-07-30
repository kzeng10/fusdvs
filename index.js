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
var clientID = 1; //increment one after each assignment
var speak = {};
var history = {}; 
var pwstore = {};
var existingChannels = {}; //boolean dict
existingChannels[defaultChannel] = true;


// TODO: get memcachier or memcachedcloud or another memcache service working
//dev purposes only
// try{
// 	require('./secret.js');
// } catch(e) {
// 	console.log('In production, Memcached keys are already in env');
// }

// var MemCache = require('memjs').Client;
// var memcachier = MemCache.create(); //channel:pwhash

io.on('connection', function (socket) {
	socket.emit('clientid', clientID++);
	socket.on('newpass', function(res) {
		console.log(res);
		console.log('adding to db');
		pwstore[res.channel] = res.hash;
		existingChannels[res.channel] = true;
		console.log('SET: ' + res.hash + ' FOR CHANNEL: ' + res.channel);
	});
	socket.on('haspass', function(res) {
		console.log(res);
		console.log('checking db');
		console.log('CHANNEL: ' + res.channel + ' DOES ' + (!!pwstore[res.channel] ? '':'NOT ') + 'HAVE A PASSWORD');
		socket.emit('haspass_'+res.clientid, !!pwstore[res.channel]);
	});
	socket.on('checkpass', function(res) {
		console.log(res);
		console.log('checking pass hash');
		console.log('PASS HASH FOR CLIENT ' + res.clientid + ' is ' + (res.hash === pwstore[res.channel]));
		socket.emit('checkpass_'+res.clientid, res.hash === pwstore[res.channel]);
	});
	socket.on('checkchan', function(res) {
		console.log(res);
		console.log('checkchan_'+res.clientid);
		if(!!!existingChannels[res.channel]) {
			pwstore[res.channel] = res.hash;
			console.log(res.hash);
			existingChannels[res.channel] = true;
			socket.emit('checkchan_'+res.clientid, true);
		}
		else {
			socket.emit('checkchan_'+res.clientid, res.hash === pwstore[res.channel]);
		}
	});
	socket.on('disconnect', function() {
		console.log('A client disconnected.');
	});
});



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