var back_col = 0;
var pos_x, pos_y, pos_z;

var socket = io.connect();

function setup() {

  createCanvas(innerWidth, innerHeight);
  background(51);

  pos_x = 0;
  pos_y = 0;

}

function draw() {
    
    // background(200, 155 + random(100), random(50) + 205, 4);
    background(back_col);

    // noStroke();
    fill(255);
    ellipse(pos_x, pos_y, 80, 80);
 
}


// socket.io callback
socket.on('pos', function(_data) { // position
    // console.log("get pos()")
    var d = pos_x - _data.x;

    pos_x = _data.x;
    pos_y = _data.y;
    pos_z = _data.z;
    // console.log(pos_x + " / " + pos_y + " / " + pos_z)
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



// function mouseDragged() {
//   console.log(mouseX);

//   var data = {
//     x: mouseX,
//     y: mouseY
//   };

//   socket.emit('mouse', data);
// }