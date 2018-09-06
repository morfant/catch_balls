// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning


// Text input
var input;
// Submit button
var submitButton;

var back_col = 0;

var socket;

function setup() {

  // socket = io.connect('http://localhost:8080');
  createCanvas(200, 200);
  background(51);


  pos_x = 0;
  pos_y = 0;


  console.log(pos_x);

  // // Text input
  // input = createInput('enter your name');

  // // Submit button
  // var submitButton = createButton('submit');
  // submitButton.mousePressed(submit);

  // // Send data to python Flask server
  // function submit() {
  //   var name = input.value();
  //   loadJSON('/test?name=' + name, gotData);
  // }

}

// Reply back from flask server
function gotData(data) {
  console.log(data);

  // Draw the name when it comes back in the canvas
  var name = data.name;
  var x = random(width);
  var y = random(height);
  fill(255);
  noStroke();
  text(name, x, y);
}


// function draw() {

//     // background(200, 155 + random(100), random(50) + 205, 4);
//     background(back_col);

//     for (var i = 110; i > 0; i=i-2) {
//         strokeWeight(i/100);
//         ellipse(pos_x - i/15, pos_y - i/10, i, i);
//     }
    
//     pos_x = (pos_x + spd)%innerWidth;
//     pos_y = (pos_y + spd)%innerHeight;
 
// }



// socket.on('updateBackground', function(data) {
//   back_col = data;
//   console.log("socket io callback!!!");
//   console.log(back_col);
// });


