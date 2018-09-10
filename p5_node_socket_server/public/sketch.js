var back_col = 0;
var pos_x, pos_y, pos_z;

var socket = io.connect();


var bufferX = [];
var bufferY = [];
var bufferZ = [];
var plotSize = 5;
var scaleY = 3;


var al = 0;

var bloom = 0;

function setup() {

  createCanvas(1200, 800); // for display graph
//   createCanvas(1200, 500);
  background(51);

  pos_x = 0;
  pos_y = 0;

}

function draw() {
    
    // background(200, 155 + random(100), random(50) + 205, 4);
    background(back_col);

    // noStroke();
    // fill(255);
    // ellipse(pos_x, pos_y, 80, 80);



    // Graph


    // horizontal zero line
    // stroke(255);
    line(0, height/2, width, height/2);

    noStroke();

    for (var i = 0; i < bufferX.length; i++) {
        fill(255, 0, 0);
        ellipse(i, height/2 - bufferX[i] * scaleY, plotSize, plotSize);
        fill(0, 255, 0);
        ellipse(i, height/2 - bufferY[i] * scaleY, plotSize, plotSize);
        fill(0, 0, 255);
        ellipse(i, height/2 - bufferZ[i] * scaleY, plotSize, plotSize);
    }


    noStroke();
    fill(255, 0, 0, al);
    ellipse(width/2, height/2, 400, 400);

    if (frameCount % 100 == 0) al = 0;
 
}


// socket.io callback
socket.on('pos', function(_data) { // position
    // console.log("get pos()")
    // console.log(_data);

    pos_x = _data.x;
    pos_y = _data.y;
    pos_z = _data.z;
    // console.log(pos_x + " / " + pos_y + " / " + pos_z)

    bufferX.push(pos_x);
    bufferY.push(pos_y);
    bufferZ.push(pos_z);
    if (bufferX.length > 1024) bufferX.shift();
    if (bufferY.length > 1024) bufferY.shift();
    if (bufferZ.length > 1024) bufferZ.shift();

});

socket.on('orient', function(_data) { // orientation
    console.log("get orientation()")
    ori_x = _data.x;
    ori_y = _data.y;
    ori_z = _data.z;
    console.log(ori_x + " / " + ori_y + " / " + ori_z)
});


socket.on('updateBackground', function(_data) {
  console.log(_data);
  back_col = _data;
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