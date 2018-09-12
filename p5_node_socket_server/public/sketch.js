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
  colorMode(HSB);

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


    // noStroke();
    // fill(255, 0, 0, al);
    // ellipse(width/2, height/2, 400, 400);

    // botany
    if (drawBotany == 1) {
        
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
        background(0);
    }




    // test red ellipse
    noStroke();
    fill(255, 0, 0, al);
    ellipse(width/2, height/2, 400, 400);

    // if (frameCount % 100 == 0) al = 0;
 
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