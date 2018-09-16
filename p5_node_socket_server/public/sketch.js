var back_col = 0;
var socket = io.connect();

var bufferBallsOri = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]]; // [ballID][axis: x, y, z]
var bufferBallsAcc = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]];
var bufLen = 512;
var plotSize = 5;
var scaleY = 3;

var al = 0;
var bloom = 0;


// botany
var drawBotany = 0; // 1 = true, 0 = false
var eraseBotany = false;
var type = 0;
var n = 0;
var c = 4;


function setup() {

  createCanvas(innerWidth, innerHeight); // for display graph
  background(51);
  angleMode(DEGREES);

  pos_x = 0;
  pos_y = 0;

}

function draw() {
    
    // background(200, 155 + random(100), random(50) + 205, 4);
    // background(back_col);

    // noStroke();
    // fill(255);
    // ellipse(pos_x, pos_y, 80, 80);



    // Graph
    // horizontal zero line
    colorMode(RGB);
    background(0);
    stroke(255);
    line(0, height/2, width, height/2);

    noStroke();

    colorMode(HSB);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < bufferBallsOri[i][0].length; j++) {

            // Orientation
            fill((255/(i+1)), 100, 100);
            ellipse(j, height/2 - bufferBallsOri[i][0][j] * scaleY, plotSize/2, plotSize/2);
            fill((255/(i+1)) + 30, 100, 100);
            ellipse(j, height/2 - bufferBallsOri[i][1][j] * scaleY, plotSize/2, plotSize/2);
            fill((255/(i+1)) + 60, 100, 100);
            ellipse(j, height/2 - bufferBallsOri[i][2][j] * scaleY, plotSize/2, plotSize/2);

            // Acceleration
            fill((255/(i+1)), 100, 100);
            ellipse(j, height/2 - bufferBallsAcc[i][0][j] * scaleY, plotSize/2, plotSize/2);
            fill((255/(i+1)) + 20, 100, 100);
            ellipse(j, height/2 - bufferBallsAcc[i][1][j] * scaleY, plotSize/2, plotSize/2);
            fill((255/(i+1)) + 40, 100, 100);
            ellipse(j, height/2 - bufferBallsAcc[i][2][j] * scaleY, plotSize/2, plotSize/2);


            // Velocity ? : using integral


        }
    }

    // noStroke();
    // fill(255, 0, 0, al);
    // ellipse(width/2, height/2, 400, 400);

    // botany
    if (drawBotany == 1) {
        colorMode(HSB);
        
        switch(type) {
            case 0:
                var a = n * 137.3;
                fill(55, 100 * cos(a/3), 100);
                break;
            case 1:
                var a = n * 137.5;
                fill(5, 100 * cos(a/3), 100);
                break;
            case 20:
                var a = n * 137.6;
                fill(155, 100 * cos(a/3), 100);
                break;
            default:
                var a = n * 137.6;
                fill(155, 100 * cos(a/3), 100);
        }

        var r = c * sqrt(n);

        var x = 2 * r * cos(a) + width/2;
        var y = 2 * r * sin(a) + height/2;

        noStroke();
            
    //    if (n % 3 == 0) {
           ellipse(x, y, random(4, 8), random(4, 10));    
    //    }
        n+=1;
    } else {
        // background(0);
    }




    // test red ellipse
    // noStroke();
    // fill(255, 0, 0, al);
    // ellipse(width/2, height/2, 400, 400);

    // if (frameCount % 100 == 0) al = 0;
 
}


// socket.io callback
socket.on('ori0', function(_data) {
    storeOrientation(0, _data);
});

socket.on('acc0', function(_data) {
    // console.log("get acc from client()")
    // console.log(_data);
    storeAcceleration(0, _data);
});

socket.on('ori1', function(_data) {
    // console.log("get ori of ball 1 from client()");
    // console.log(_data);
    storeOrientation(1, _data);
});

socket.on('acc1', function(_data) {
    // console.log("get acc of ball 1 from client()");
    // console.log(_data);
    storeAcceleration(1, _data);
});

socket.on('ori2', function(_data) {
    // console.log("get ori of ball 2 from client()");
    // console.log(_data);
    storeOrientation(2, _data);
});

socket.on('acc2', function(_data) {
    // console.log("get acc of ball 2 from client()");
    // console.log(_data);
    storeAcceleration(2, _data);
});

socket.on('ori3', function(_data) {
    // console.log("get ori of ball 3 from client()");
    // console.log(_data);
    storeOrientation(3, _data);
});

socket.on('acc3', function(_data) { 
    // console.log("get acc of ball 3 from client()");
    // console.log(_data);
    storeAcceleration(3, _data);
});


function storeOrientation(ball_id, _data) {

    bufferBallsOri[ball_id][0].push(_data.x);
    bufferBallsOri[ball_id][1].push(_data.y);
    bufferBallsOri[ball_id][2].push(_data.z);
    if (bufferBallsOri[ball_id][0].length > bufLen) bufferBallsOri[ball_id][0].shift();
    if (bufferBallsOri[ball_id][1].length > bufLen) bufferBallsOri[ball_id][1].shift();
    if (bufferBallsOri[ball_id][2].length > bufLen) bufferBallsOri[ball_id][2].shift();


}

function storeAcceleration(ball_id, _data) {

    bufferBallsAcc[ball_id][0].push(_data.x);
    bufferBallsAcc[ball_id][1].push(_data.y);
    bufferBallsAcc[ball_id][2].push(_data.z);
    if (bufferBallsAcc[ball_id][0].length > bufLen) bufferBallsAcc[ball_id][0].shift();
    if (bufferBallsAcc[ball_id][1].length > bufLen) bufferBallsAcc[ball_id][1].shift();
    if (bufferBallsAcc[ball_id][2].length > bufLen) bufferBallsAcc[ball_id][2].shift();

}


socket.on('updateBackground', function(_data) {
  console.log(_data);
  back_col = _data;
});


socket.on('setBotany', function(_data) {
  console.log(_data);
  drawBotany = _data.draw;
  type = _data.type;
});


socket.on('bloom', function(_data) { 
    al = 255;
    console.log(_data);
});

// function mouseDragged() {
//   console.log(mouseX);

//   var data = {
//     x: mouseX,
//     y: mouseY
//   };

//   socket.emit('mouse', data);
// }