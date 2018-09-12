var express = require('express')
var app = express()
var socket = require('socket.io')

var server = app.listen(3000, "0.0.0.0");
var io = socket(server);

var socketClientList = [];


var acc_x_buffer = [[0], [0], [0], [0]];
var acc_y_buffer = [[0], [0], [0], [0]];
var acc_z_buffer = [[0], [0], [0], [0]];

var vel_x = [[0], [0], [0], [0]];
var vel_y = [[0], [0], [0], [0]];
var vel_z = [[0], [0], [0], [0]];

var count_x = [[0], [0], [0], [0]];
var count_y = [[0], [0], [0], [0]];
var count_z = [[0], [0], [0], [0]];

var isStop = [false, false, false, false];


// server static files : index.html, sketch.js...
app.use(express.static('public'));


// handle HTTP get method 
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
    // io.to(rid).emit('setBotany', 1);
    var types = [0, 1, 20];

    var randEle = types[Math.floor(Math.random() * types.length)];

    io.to(rid).emit('setBotany', {draw: 1, type: randEle});




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
        console.log(data);

        var ballID = 0;
        var acc_obj = makeDataToObj(data); // it should change to be more simple process.
        // takeSamples(ballID, acc_obj, 20);

        isStop[ballID] = checkStop(ballID, 25);

   
        // when ball is stop..
        if (isStop[ballID]) {

            // emit to random socket cilent
            var r = getRandomInt(socketClientList.length);
            // console.log(r);
            var rid = socketClientList[r];
            // console.log(rid);
            io.to(rid).emit('setBotany', {draw: 1, type: 20});

        }

        
        // var splited = data.split('/');
        // // console.log(splited);

        // var obj = {
        //     x : splited[0].slice(1, splited[0].length).toString(), 
        //     y : splited[1].toString(),
        //     z : splited[2].slice(0, splited[2].length - 1).toString()
        // };

        // console.log(obj);
        // io.emit('pos', obj);

        // taking 20 samples
        // acc_x_buffer[ballID].push(obj.x);
        // acc_y_buffer[ballID].push(obj.y);
        // acc_z_buffer[ballID].push(obj.z);
        // if (acc_x_buffer[ballID].length > 20) acc_x_buffer[ballID].shift();
        // if (acc_y_buffer[ballID].length > 20) acc_y_buffer[ballID].shift();
        // if (acc_z_buffer[ballID].length > 20) acc_z_buffer[ballID].shift();

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


function takeSamples(ballID, obj, numSample) {
    acc_x_buffer[ballID].push(obj.x);
    acc_y_buffer[ballID].push(obj.y);
    acc_z_buffer[ballID].push(obj.z);
    if (acc_x_buffer[ballID].length > numSample) acc_x_buffer[ballID].shift();
    if (acc_y_buffer[ballID].length > numSample) acc_y_buffer[ballID].shift();
    if (acc_z_buffer[ballID].length > numSample) acc_z_buffer[ballID].shift();
}

function checkStop(ballID, countLimit) {

    // x
    if (acc_obj[ballID].x == 0) { count_x[ballID]++; }
    else { count_x[ballID] = 0; vel_x[ballID] = 1;}
    if (count_x[ballID] >= countLimit) { vel_x[ballID] = 0; }

    // y
    if (acc_obj[ballID].y == 0) { count_y[ballID]++; }
    else { count_y[ballID] = 0; vel_y[ballID] = 1;}
    if (count_y[ballID] >= countLimit) { vel_y[ballID] = 0; }

    // z
    if (acc_obj[ballID].z == 0) { count_z[ballID]++; }
    else { count_z[ballID] = 0; vel_z[ballID] = 1;}
    if (count_z[ballID] >= countLimit) { vel_z[ballID] = 0; }

    // check is stop
    if (vel_x[ballID] == 0 && vel_y[ballID] == 0 && vel_z[ballID] == 0) {
        return true;
    } else {
        return false;
    }

}

function makeDataToObj(data) {
    var splited = data.split('/');
    // console.log(splited);

    var obj = {
        x : splited[0].slice(1, splited[0].length).toString(), 
        y : splited[1].toString(),
        z : splited[2].slice(0, splited[2].length - 1).toString()
    };

    // discrimination : regard too small value as zero.
    for (var key in obj) {
        if ((obj[key] <= thr) && (obj[key] >= -thr)) {
            obj[key] = 0;
        }
    }

    return obj;

}

console.log("server is running..");

