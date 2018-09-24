var express = require('express')
var app = express()
var socket = require('socket.io')
var osc = require('osc')

var server = app.listen(3000, "0.0.0.0");
// var server = app.listen(3000, "127.0.0.1");
var io = socket(server);
var socketClientList = [];

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 50000,
    metadata: true
});


var STATUS_NOT_STOPPED = 1;
var STATUS_STOPPED = 0;

// osc
udpPort.open();


// control sc server directly
// udpPort.send({
//     address: "/s_new",
//     args: [
//         {
//             type: "s",
//             value: "default"
//         },
//         {
//             type: "i",
//             value: 100
//         }
//     ]
// }, "127.0.0.1", 57110);



// 4 balls each has 3 axis

var acc_obj = [{}, {}, {}, {}];
var vel_obj = [{}, {}, {}, {}];
var ori_obj = [{}, {}, {}, {}];
var g_obj = [{}, {}, {}, {}];
var prev_ori_obj = [{}, {}, {}, {}];


var angvel_x_buffer = [[0], [0], [0], [0]];
var angvel_y_buffer = [[0], [0], [0], [0]];
var angvel_z_buffer = [[0], [0], [0], [0]];


var acc_x_buffer = [[0], [0], [0], [0]];
var acc_y_buffer = [[0], [0], [0], [0]];
var acc_z_buffer = [[0], [0], [0], [0]];

var acc_x_prev = [[0], [0], [0], [0]];
var acc_y_prev = [[0], [0], [0], [0]];
var acc_z_prev = [[0], [0], [0], [0]];

var acc_x_cur = [[0], [0], [0], [0]];
var acc_y_cur = [[0], [0], [0], [0]];
var acc_z_cur = [[0], [0], [0], [0]];

var vel_x_prev = [[0], [0], [0], [0]];
var vel_y_prev = [[0], [0], [0], [0]];
var vel_z_prev = [[0], [0], [0], [0]];

var vel_x_cur = [[0], [0], [0], [0]];
var vel_y_cur = [[0], [0], [0], [0]];
var vel_z_cur = [[0], [0], [0], [0]];

var vel_x = [[0], [0], [0], [0]];
var vel_y = [[0], [0], [0], [0]];
var vel_z = [[0], [0], [0], [0]];


var count_x = [[0], [0], [0], [0]];
var count_y = [[0], [0], [0], [0]];
var count_z = [[0], [0], [0], [0]];

var isStop = [false, false, false, false];
var isRotating = [false, false, false, false];
var flyingCount = 0;


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

    // send 'setBotany' to draw
    // io.to(rid).emit('setBotany', {draw: 1, type: randEle});


    // var buf = Buffer.from('hello sc');
    // var data = '123';

    // client.send(['/fromNode', data], 57120, 'localhost', (err) => {
    //     client.close();
    // });



    socket.on('disconnect', function () {
        console.log('disconnected: ' + id);

        var index = socketClientList.indexOf(id);
        if (index > -1) {
            socketClientList.splice(index, 1);
        }
        console.log(socketClientList);

    });


    socket.on('ball_0', function(data){

        var ballID = 0;
        // console.log("ball_0");
        // console.log(data);

        // split by '|'
        var o = data.split('|')[0]; // orientation
        var a = data.split('|')[1]; // accelerometer
        var g = data.split('|')[2]; // accelerometer
        // console.log("ori: " + o);
        // console.log("acc: " + a);

        ori_obj[ballID] = makeOriObj(o, 3); // it should change to be more simple process.
        acc_obj[ballID] = makeAccObj(a, 2); // (obj, threshold to zero)
        // g_obj[ballID] = makeGObj(g, 1); // (obj, threshold to zero)

        // console.log(acc_obj[ballID]);

        // send for drawing graph
        io.emit('acc'+ballID, acc_obj[ballID]);
        io.emit('ori'+ballID, ori_obj[ballID]);
        // io.emit('g'+ballID, g_obj[ballID]);


        // takeSamples(ballID, acc_obj, 20);


        // acc_x_cur[ballID] = acc_obj[ballID].x;
        // acc_y_cur[ballID] = acc_obj[ballID].y;
        // acc_z_cur[ballID] = acc_obj[ballID].z;

        // getVel(ballID);

        // vel_obj[ballID].x = vel_x_cur[ballID];
        // vel_obj[ballID].y = vel_y_cur[ballID];
        // vel_obj[ballID].z = vel_z_cur[ballID];

        // io.emit('vel'+ballID, vel_obj[ballID]);
   
        isRotating[ballID] = checkSpin(ballID, 20, 20);
        isStop[ballID] = checkStop(ballID, 1, 10);


        // console.log(isRotating[ballID]);
        // console.log(isStop[ballID]);
        // when ball is stop..
        if (isStop[ballID] && !isRotating[ballID]) {
        // if (isStop[ballID]) {
            console.log("ball " + ballID + " is stopped!!!!")

            // udpPort.send({
            //     address: "/isBallStopped",
            //     args: [
            //         {
            //             type: "i",
            //             value: 0 
            //         },
            //     ]
            // }, "127.0.0.1", 57120);

            udpPort.send({
                address: "/isBallStopped",
                args: [
                    {
                        type: "i", value: ballID
                    },
                    {
                        type: "i", value: STATUS_STOPPED 
                    }
                ]
            }, "127.0.0.1", 57120);




            // emit to random socket cilent
            // var r = getRandomInt(socketClientList.length);
            // console.log(r);

            // var rid = socketClientList[r];
            // console.log(rid);

            // io.to(rid).emit('setBotany', {draw: 1, type: 20});

        } else {
            console.log("ball " + ballID + " is NOT stopped!!");

            udpPort.send({
                address: "/isBallStopped",
                args: [
                    {
                        type: "i", value: ballID
                    },
                    {
                        type: "i", value: STATUS_NOT_STOPPED 
                    },
                        { type: "f", value: acc_obj[ballID].x },
                        { type: "f", value: acc_obj[ballID].y },
                        { type: "f", value: acc_obj[ballID].z },
                        { type: "f", value: ori_obj[ballID].x },
                        { type: "f", value: ori_obj[ballID].y },
                        { type: "f", value: ori_obj[ballID].z },

                ]
            }, "127.0.0.1", 57120);


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

    socket.on('ball_1', function(data){
        var ballID = 1;
        

        // console.log("ball_1");
        // console.log("ballHandler()");
        console.log(data);

        // split by '|'
        var o = data.split('|')[0]; // orientation
        var a = data.split('|')[1]; // accelerometer
        // console.log("ori: " + o);
        // console.log("acc: " + a);

        ori_obj[ballID] = makeOriObj(o, 3); // it should change to be more simple process.
        acc_obj[ballID] = makeAccObj(a, 3); // it should change to be more simple process.


        // console.log(acc_obj[ballID]);

        // send for drawing graph
        io.emit('acc'+ballID, acc_obj[ballID]);
        io.emit('ori'+ballID, ori_obj[ballID]);

        // takeSamples(ballID, acc_obj, 20);

        // isStop[ballID] = checkStop(ballID, 25);

   
        // when ball is stop..
        if (isStop[ballID]) {
            console.log("ball " + ballID + " is stopped!!!!")

            // emit to random socket cilent
            // var r = getRandomInt(socketClientList.length);
            // console.log(r);

            // var rid = socketClientList[r];
            // console.log(rid);

            // io.to(rid).emit('setBotany', {draw: 1, type: 20});

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

    socket.on('ball_2', function(data){
        var ballID = 2;

        console.log("ball_2");
        // console.log("ballHandler()");
        console.log(data);

        // split by '|'
        var o = data.split('|')[0]; // orientation
        var a = data.split('|')[1]; // accelerometer
        // console.log("ori: " + o);
        // console.log("acc: " + a);

        ori_obj[ballID] = makeOriObj(o, 3); // it should change to be more simple process.
        acc_obj[ballID] = makeAccObj(a, 3); // it should change to be more simple process.


        // console.log(acc_obj[ballID]);

        // send for drawing graph
        io.emit('acc'+ballID, acc_obj[ballID]);
        io.emit('ori'+ballID, ori_obj[ballID]);

        // takeSamples(ballID, acc_obj, 20);

        // isStop[ballID] = checkStop(ballID, 25);

   
        // when ball is stop..
        if (isStop[ballID]) {
            console.log("ball " + ballID + " is stopped!!!!")

            // emit to random socket cilent
            // var r = getRandomInt(socketClientList.length);
            // console.log(r);

            // var rid = socketClientList[r];
            // console.log(rid);

            // io.to(rid).emit('setBotany', {draw: 1, type: 20});

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

    socket.on('ball_3', function(data){

        var ballID = 3;

        console.log("ball_3");
        // console.log("ballHandler()");
        // console.log(data);

        // split by '|'
        var o = data.split('|')[0]; // orientation
        var a = data.split('|')[1]; // accelerometer
        // console.log("ori: " + o);
        // console.log("acc: " + a);

        ori_obj[ballID] = makeOriObj(o, 3); // it should change to be more simple process.
        acc_obj[ballID] = makeAccObj(a, 3); // it should change to be more simple process.


        // console.log(acc_obj[ballID]);

        // send for drawing graph
        io.emit('acc'+ballID, acc_obj[ballID]);
        io.emit('ori'+ballID, ori_obj[ballID]);

        // takeSamples(ballID, acc_obj, 20);

        isStop[ballID] = checkStop(ballID, 25);

   
        // when ball is stop..
        if (isStop[ballID]) {
            console.log("ball " + ballID + " is stopped!!!!")

            // emit to random socket cilent
            // var r = getRandomInt(socketClientList.length);
            // console.log(r);

            // var rid = socketClientList[r];
            // console.log(rid);

            // io.to(rid).emit('setBotany', {draw: 1, type: 20});

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

function checkSpin(ballID, bufferLen, thr) {

    var diff_spin_x, diff_spin_y, diff_spin_z;
    diff_spin_x = Math.abs(parseFloat(ori_obj[ballID].x) - parseFloat(prev_ori_obj[ballID].x));
    diff_spin_y = Math.abs(parseFloat(ori_obj[ballID].y) - parseFloat(prev_ori_obj[ballID].y));
    diff_spin_z = Math.abs(parseFloat(ori_obj[ballID].z) - parseFloat(prev_ori_obj[ballID].z));
    // console.log(parseFloat(ori_obj[ballID].x));
    // console.log(diff_spin_x);
    // console.log(diff_spin_y);
    // console.log(diff_spin_z);


    // bufferBallsOri[ball_id][2].push(_data.z);
    // if (bufferBallsOri[ball_id][0].length > bufLen) bufferBallsOri[ball_id][0].shift();

    angvel_x_buffer[ballID].push(diff_spin_x);
    angvel_y_buffer[ballID].push(diff_spin_y);
    angvel_z_buffer[ballID].push(diff_spin_z);
    if (angvel_x_buffer[ballID].length > bufferLen) angvel_x_buffer[ballID].shift();
    if (angvel_y_buffer[ballID].length > bufferLen) angvel_y_buffer[ballID].shift();
    if (angvel_z_buffer[ballID].length > bufferLen) angvel_z_buffer[ballID].shift();

    // console.log(angvel_x_buffer[ballID])

    var sum_angvel_x = angvel_x_buffer[ballID].reduce((a, b) => a + b, 0);
    var sum_angvel_y = angvel_y_buffer[ballID].reduce((a, b) => a + b, 0);
    var sum_angvel_z = angvel_z_buffer[ballID].reduce((a, b) => a + b, 0);
    // console.log(sum_angvel_x);
    // console.log(sum_angvel_y);
    // console.log(sum_angvel_z);
    var avg_angvel_x = sum_angvel_x/bufferLen;
    var avg_angvel_y = sum_angvel_y/bufferLen;
    var avg_angvel_z = sum_angvel_z/bufferLen;
    // console.log(avg_angvel_x);
    // console.log(avg_angvel_y);
    // console.log(avg_angvel_z);

    prev_ori_obj[ballID].x = ori_obj[ballID].x;
    prev_ori_obj[ballID].y = ori_obj[ballID].y;
    prev_ori_obj[ballID].z = ori_obj[ballID].z;


    if (avg_angvel_x < thr && avg_angvel_y < thr && avg_angvel_z < thr) {
        // console.log("NOT spinning!!");
        return false;
    } else {
        // console.log("spinning!!");
        return true;
    }

}

function checkStop(ballID, stopCount, flyCount) {

    // x
    if (acc_obj[ballID].x == 0) { count_x[ballID]++; }
    else { count_x[ballID] = 0; vel_x[ballID] = 1;}
    if (count_x[ballID] >= stopCount) { vel_x[ballID] = 0; }

    // y
    if (acc_obj[ballID].y == 0) { count_y[ballID]++; }
    else { count_y[ballID] = 0; vel_y[ballID] = 1;}
    if (count_y[ballID] >= stopCount) { vel_y[ballID] = 0; }

    // z
    if (acc_obj[ballID].z == 0) { count_z[ballID]++; }
    else { count_z[ballID] = 0; vel_z[ballID] = 1;}
    if (count_z[ballID] >= stopCount) { vel_z[ballID] = 0; }


    // check is stop
    if (vel_x[ballID] == 0 && vel_y[ballID] == 0 && vel_z[ballID] == 0) {
        // return true;
        flyingCount = 0;
    } else {
        flyingCount++;
        // return false;
    }


    if (flyingCount > flyCount) {
        return false;
    } else {
        return true;
    }

}

function makeOriObj(data, thr) {
    var splited = data.split('/');

    var obj = {
        x : splited[0].split('"')[1], 
        y : splited[1],
        z : splited[2]
    };

    // discrimination : regards too small value as zero.
    for (var key in obj) {
        if ((obj[key] <= thr) && (obj[key] >= -thr)) {
            obj[key] = 0;
        }
    }

    return obj;

}


function makeAccObj(data, thr) {
    var splited = data.split('/');

    var obj = {
        x : splited[0], 
        y : splited[1],
        z : splited[2]
    };

    // discrimination : regard too small value as zero.
    for (var key in obj) {
        if ((obj[key] <= thr) && (obj[key] >= -thr)) {
            obj[key] = 0;
        }
    }

    return obj;

}


function makeGObj(data, thr) {
    var splited = data.split('/');

    var obj = {
        x : splited[0], 
        y : splited[1],
        z : splited[2].split('"')[0]
    };

    // discrimination : regard too small value as zero.
    for (var key in obj) {
        if ((obj[key] <= thr) && (obj[key] >= -thr)) {
            obj[key] = 0;
        }
    }

    return obj;

}

function getVel(ballID) {
    // console.log("getVel()");
    // console.log( acc_x_prev[ballID] );
    // console.log( acc_x_cur[ballID] );

    // var a = ( Number(acc_x_prev[ballID]) + Number(acc_x_cur[ballID]) >> 1 ); // result as int
    // var a = ( (Number(acc_x_prev[ballID]) + Number(acc_x_cur[ballID]))/2 ); // result as float
    // var a = ( (parseFloat(acc_x_prev[ballID]) + parseFloat(acc_x_cur[ballID])) >> 1 );
    // console.log("sum:" + a);

    // console.log( ((acc_x_prev[ballID] + acc_x_cur[ballID]) >> 1));
    // var d = 0;
    // if (acc_x_prev[ballID] != 0 || acc_x_cur[ballID] != 0) {
    //     d = (acc_x_prev[ballID] + acc_x_cur[ballID]) / 2;
    // }
    // console.log( d );
    // console.log(parseFloat(vel_x_prev[ballID]));
    // console.log(parseFloat(acc_x_prev[ballID]));
    // console.log(parseFloat(acc_x_cur[ballID]));

    // vel_x_cur[ballID] = parseFloat(vel_x_prev[ballID]) + parseFloat(acc_x_prev[ballID]) + ( (parseFloat(acc_x_prev[ballID]) + parseFloat(acc_x_cur[ballID])) >> 1);
    // vel_y_cur[ballID] = parseFloat(vel_y_prev[ballID]) + parseFloat(acc_y_prev[ballID]) + ( (parseFloat(acc_y_prev[ballID]) + parseFloat(acc_y_cur[ballID])) >> 1);
    // vel_z_cur[ballID] = parseFloat(vel_z_prev[ballID]) + parseFloat(acc_z_prev[ballID]) + ( (parseFloat(acc_z_prev[ballID]) + parseFloat(acc_z_cur[ballID])) >> 1);

    vel_x_cur[ballID] = parseFloat(acc_x_prev[ballID]) + ( (parseFloat(acc_x_prev[ballID]) + parseFloat(acc_x_cur[ballID])) >> 1);
    vel_y_cur[ballID] = parseFloat(acc_y_prev[ballID]) + ( (parseFloat(acc_y_prev[ballID]) + parseFloat(acc_y_cur[ballID])) >> 1);
    vel_z_cur[ballID] = parseFloat(acc_z_prev[ballID]) + ( (parseFloat(acc_z_prev[ballID]) + parseFloat(acc_z_cur[ballID])) >> 1);


    // console.log("vel: " + vel_x_cur[ballID]);

    vel_x_prev[ballID] = vel_x_cur[ballID];
    vel_y_prev[ballID] = vel_y_cur[ballID];
    vel_z_prev[ballID] = vel_z_cur[ballID];

    acc_x_prev[ballID] = acc_x_cur[ballID];
    acc_y_prev[ballID] = acc_y_cur[ballID];
    acc_z_prev[ballID] = acc_z_cur[ballID];

}






console.log("server is running..");

