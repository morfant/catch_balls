var express = require('express')
var app = express()
var socket = require('socket.io')

var server = app.listen(3000, "0.0.0.0");
var io = socket(server);

var socketClientList = [];


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
io.on('connection',  function(socket) {

    var id = socket.id;

    console.log('new connection: ' + id);

    socketClientList.push(id);
    console.log(socketClientList);

    // emit to client that has specific socket id.
    // io.to(id).emit('greeting', "hi hello : " + id + " !!");


    // emit to random socket cilent
    var r = getRandomInt(socketClientList.length);
    // console.log(r);
    var rid = socketClientList[r];
    // console.log(rid);
    io.to(rid).emit('bloom', "bloom: " + rid + " !!");


    socket.on('disconnect', function () {
        console.log('disconnected: ' + id);

        var index = socketClientList.indexOf(id);
        if (index > -1) {
            socketClientList.splice(index, 1);
        }
        console.log(socketClientList);

    });


    socket.on('ball_0', function(data){
        console.log("ballHandler()");
        // console.log(data);

        var o = data.split('|')[0];
        var a = data.split('|')[1];
        // console.log("ori: " + o);
        // console.log("acc: " + a);
        var splited_o = o.split('/');
        var splited_a = a.split('/');
        // console.log(splited_o);
        // console.log(splited_o[0].split('"')[1]);
        // console.log(splited_o[1]);
        // console.log(splited_o[2]);
        // console.log(splited_a);
        console.log(splited_a[0]);
        console.log(splited_a[1]);
        console.log(splited_a[2].split('"')[0]);

        // var obj = {
        //     x : splited[0].slice(1, splited[0].length).toString(), 
        //     y : splited[1].toString(),
        //     z : splited[2].slice(0, splited[2].length - 1).toString()
        // };

        // console.log(obj);
        // io.emit('pos', obj);
    });



});

io.on('disconnect', disConnection);

// function newConnection(socket) {
//     console.log('new connection: ' + socket.id);
// }

function disConnection(socket) {
    console.log('disconnected: ' + socket.id);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }




console.log("server is running..");
