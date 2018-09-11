var express = require('express')
var app = express()
var socket = require('socket.io')

var server = app.listen(3000, "0.0.0.0");
var io = socket(server);


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
    console.log('new connection: ' + socket.id);

    socket.on('ball_0', function(data){
        

        console.log("ballHandler()");
        console.log(data);

        var ballID = 0;
        var acc_obj = makeDataToObj(data); // it should change to be more simple process.
        // takeSamples(ballID, acc_obj, 20);

        isStop[ballID] = checkStop(ballID, 25);

   
        // when ball is stop..
        if (isStop[ballID]) {

        }

        
        // var splited = data.split('/');
        // // console.log(splited);

        // var obj = {
        //     x : splited[0].slice(1, splited[0].length).toString(), 
        //     y : splited[1].toString(),
        //     z : splited[2].slice(0, splited[2].length - 1).toString()
        // };

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
    } eles {
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

