var express = require('express')
var app = express()
var socket = require('socket.io')

var server = app.listen(3000)
var io = socket(server);


// server static files : index.html, sketch.js...
app.use(express.static('public'));


// handle get method 
app.get('/posx/:x/posy/:y/posz/:z', function (req, res) {
    // console.log(req.params);
    io.emit('pos', req.params);
    res.send(req.params);
}) 

app.get('/orix/:x/oriy/:y/oriz/:z', function (req, res) {
    // console.log(req.params);
    io.emit('orient', req.params);
    res.send(req.params);
})

app.get('/update/:data', function (req, res) {
    // console.log(req.params['data']);
    io.emit('updateBackground', req.params['data']);
    res.send(req.params);
}) 



// socket.io callback
io.on('connection', newConnection);
io.on('disconnect', disConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);
}

function disConnection(socket) {
    console.log('disconnected: ' + socket.id);
}


console.log("server is running..");
