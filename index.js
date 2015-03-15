var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var speak = [{name: 'bob'},{name: 'tom'}];

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
    io.emit('personAdder', req.body);
    return res.sendStatus(200);
});

app.post('/remove', function(req, res) { //receives index number
	var id = req.body.index;
	// console.log(isSpeaking);
	speak.splice(id, 1);
	io.emit('personRemover', id);
	return res.sendStatus(200);
});


app.get('*', function(req, res){
    res.sendFile(__dirname + '/app/index.html', res);
});

http.listen(3000, function () {
    'use strict';
    console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});