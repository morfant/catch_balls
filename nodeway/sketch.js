
var pos_x = 0;
var pos_y = 0;

var back_col = 100;

var spd = 1;

function setup() {

  // socket = io.connect('http://localhost:8080');
  socket = io.connect();
  createCanvas(400, 400);
  background(151, 100, 100);


  socket.on('updateBackground', function(data) {
    back_col = data;
    console.log("socket io callback!!!");
    console.log(back_col);
  });



}


function draw() {

    // background(200, 155 + random(100), random(50) + 205, 4);
    background(back_col);
    stroke(random(255));
    rect(width/2, height/2, 100, 100);

    for (var i = 110; i > 0; i=i-2) {
        strokeWeight(i/100);
        ellipse(pos_x - i/15, pos_y - i/10, i, i);
    }
    
    pos_x = (pos_x + spd)%innerWidth;
    pos_y = (pos_y + spd)%innerHeight;
 
}




