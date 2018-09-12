var back_col = 0;
var acc_x, acc_y, acc_z;

var socket = io.connect();

var bufferOriX = [];
var bufferOriY = [];
var bufferOriZ = [];

var bufferAccX = [];
var bufferAccY = [];
var bufferAccZ = [];

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

    for (var i = 0; i < bufferOriX.length; i++) {
        fill(255, 100, 0);
        ellipse(i, height/2 - bufferOriX[i] * scaleY, plotSize/2, plotSize/2);
        fill(200, 255, 100);
        ellipse(i, height/2 - bufferOriY[i] * scaleY, plotSize/2, plotSize/2);
        fill(100, 0, 255);
        ellipse(i, height/2 - bufferOriZ[i] * scaleY, plotSize/2, plotSize/2);
    }


    for (var i = 0; i < bufferAccX.length; i++) {
        fill(255, 0, 0);
        ellipse(i, height/2 - bufferAccX[i] * scaleY, plotSize, plotSize);
        fill(0, 255, 0);
        ellipse(i, height/2 - bufferAccY[i] * scaleY, plotSize, plotSize);
        fill(0, 0, 255);
        ellipse(i, height/2 - bufferAccZ[i] * scaleY, plotSize, plotSize);
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
socket.on('ori', function(_data) { // orientation
    // console.log("get orientation()")
    ori_x = _data.x;
    ori_y = _data.y;
    ori_z = _data.z;
    // console.log(ori_x + " / " + ori_y + " / " + ori_z)

    bufferOriX.push(ori_x);
    bufferOriY.push(ori_y);
    bufferOriZ.push(ori_z);
    if (bufferOriX.length > 1024) bufferOriX.shift();
    if (bufferOriY.length > 1024) bufferOriY.shift();
    if (bufferOriZ.length > 1024) bufferOriZ.shift();


});


socket.on('acc', function(_data) { // position
    // console.log("get acc from client()")
    // console.log(_data);

    acc_x = _data.x;
    acc_y = _data.y;
    acc_z = _data.z;
    // console.log(acc_x + " / " + acc_y + " / " + acc_z)

    bufferAccX.push(acc_x);
    bufferAccY.push(acc_y);
    bufferAccZ.push(acc_z);
    if (bufferAccX.length > 1024) bufferAccX.shift();
    if (bufferAccY.length > 1024) bufferAccY.shift();
    if (bufferAccZ.length > 1024) bufferAccZ.shift();

});

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