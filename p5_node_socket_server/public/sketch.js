var back_col = 0;
var socket = io.connect();

var bufferBallsOri = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]]; // [ballID][axis: x, y, z]
var bufferBallsAcc = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]];
var bufferBallsVel = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]];
var bufferBallsG = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]];
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

// images
var img = [];  // Declare variable 'img'.
var drawImage = true;
var img_random_idx = 0;


var sentance = [];

function setup() {

  createCanvas(innerWidth, innerHeight); // for display graph
  background(51);
  angleMode(DEGREES);

  pos_x = 0;
  pos_y = 0;

  for (var i = 0; i < 29; i++) {
      img[i] = loadImage("assets/" + i + ".jpg");
  }
//   img = loadImage("assets/moonwalk.jpg");  // Load the image

  sentance[0] = "폭탄이 비행기에서 풀리면 비행기의 수평 속도와 같은 수평 속도로 포물선 궤도를 따라 간다. 폭탄은 비행기 바로 밑으로 떨어집니다 (파선). 폭탄이 땅 위의 어떤 높이에서 폭발하면 조각의 질량 중심은 원래의 포물선 궤도 (주황색 곡선)를 따른다. 운동량은 보존됩니다. 즉, 폭발 직전의 각 조각에 대한 매스의 곱과 벡터의 합은 폭발 직후의 운동량과 같습니다";


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

    // display image
    // if (drawImage) {
    //     image(img[img_random_idx], 0, 0);
    // }

    noStroke();

    // colorMode(HSB);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < bufferBallsOri[i][0].length; j++) {

            // Orientation
            fill("Blue");
            ellipse(j, height/2 - bufferBallsOri[i][0][j] * scaleY, plotSize/2, plotSize/2);
            fill("Coral");
            // fill((255/(i+1)) + 30, 100, 100);
            ellipse(j, height/2 - bufferBallsOri[i][1][j] * scaleY, plotSize/2, plotSize/2);
            fill("Crimson");
            // fill((255/(i+1)) + 60, 100, 100);
            ellipse(j, height/2 - bufferBallsOri[i][2][j] * scaleY, plotSize/2, plotSize/2);


            // Acceleration
            // fill((255/(i+1)), 100, 100);
            // ellipse(j, height/2 - bufferBallsAcc[i][0][j] * scaleY, plotSize/2, plotSize/2);
            // fill((255/(i+1)) + 20, 100, 100);
            // ellipse(j, height/2 - bufferBallsAcc[i][1][j] * scaleY, plotSize/2, plotSize/2);
            // fill((255/(i+1)) + 40, 100, 100);
            // ellipse(j, height/2 - bufferBallsAcc[i][2][j] * scaleY, plotSize/2, plotSize/2);


            // Velocity ? : using integral
            // fill((155/(i+1)), 10, 100);
            // ellipse(j, height/2 - bufferBallsVel[i][0][j] * scaleY, plotSize/2, plotSize/2);
            // fill((155/(i+1)) + 20, 10, 100);
            // ellipse(j, height/2 - bufferBallsVel[i][1][j] * scaleY, plotSize/2, plotSize/2);
            // fill((155/(i+1)) + 40, 10, 100);
            // ellipse(j, height/2 - bufferBallsVel[i][2][j] * scaleY, plotSize/2, plotSize/2);

            // Gravity
            // fill("DarkBlue");
            // ellipse(j, height/2 - bufferBallsG[i][0][j] * scaleY, plotSize/2, plotSize/2);
            // fill("DarkGrey");
            // ellipse(j, height/2 - bufferBallsG[i][1][j] * scaleY, plotSize/2, plotSize/2);
            // fill("DarkGreen");
            // ellipse(j, height/2 - bufferBallsG[i][2][j] * scaleY, plotSize/2, plotSize/2);

            // var sumG = Math.abs(bufferBallsG[i][0][j]) + Math.abs(bufferBallsG[i][1][j]) + Math.abs(bufferBallsG[i][2][j]);
            // fill("DeepPink");
            // ellipse(j, height/2 - sumG * scaleY, plotSize/2, plotSize/2);


        }
    }

    // noStroke();
    // fill(255, 0, 0, al);
    // ellipse(width/2, height/2, 400, 400);

    // text ball
    push();
    translate(innerWidth/2, innerHeight/2);
    var r = frameCount*10 % 360;
    rotate(r);
    // console.log(r);

    // doDraw = true;
    doDraw = false;
    // background(0);

    var max = noise(frameCount/20) * 600;
    var ka = 134 + noise(frameCount/50) * 1.7;
    var space = 3 + 1 + noise(frameCount/30) * 4;
    var ts = 30 + noise(frameCount/10) * 20;

    if (doDraw) {

        // fill(155, 100 * cos(a/3) * 255, 200);
        for (var i = 0; i < max; i+=1) {

            // var a = i * 135.6;
            var a = i * ka;
            var r = c * sqrt(i);

            var x = space * r * cos(a); 
            var y = space * r * sin(a);

            var curChar = sentance[0][i%sentance[0].length];
            // console.log(curChar);

            fill(155, 100 * cos(a/3) * 255, 10 + 100 * ((max - i)/max));
            textSize(ts);

            if (curChar === '폭' || curChar === '탄') {
                fill(5, 100, 10 + 100 * ((max - i)/max));
                textSize(ts*2);
            };

            text(curChar, x, y);
            // vertex(x, y);
    
        }
 
    }



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
            // ellipse(x, y, random(4, 8), random(4, 10));    

            var curChar = sentance[0][n%sentance[0].length];
            if (curChar === '폭' || curChar === '탄') {
                fill(5, 100, 100);
                textSize(20);
            };


            text(curChar, x, y);

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

socket.on('g0', function(_data) {
    // console.log("get ori of ball 1 from client()");
    // console.log(_data);
    storeGravity(0, _data);
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



socket.on('vel0', function(_data) { 
    // console.log("get vel of ball 0 from client()");
    console.log(_data);
    storeVelocity(0, _data);
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

function storeGravity(ball_id, _data) {

    // console.log(_data.x);
    // console.log(_data.y);
    // console.log(_data.z);
    // console.log("sum");
    // console.log(parseFloat(_data.x) + parseFloat(_data.y) + parseFloat(_data.z));

    bufferBallsG[ball_id][0].push(_data.x);
    bufferBallsG[ball_id][1].push(_data.y);
    bufferBallsG[ball_id][2].push(_data.z);
    if (bufferBallsG[ball_id][0].length > bufLen) bufferBallsG[ball_id][0].shift();
    if (bufferBallsG[ball_id][1].length > bufLen) bufferBallsG[ball_id][1].shift();
    if (bufferBallsG[ball_id][2].length > bufLen) bufferBallsG[ball_id][2].shift();

}


function storeVelocity(ball_id, _data) {

    bufferBallsVel[ball_id][0].push(_data.x);
    bufferBallsVel[ball_id][1].push(_data.y);
    bufferBallsVel[ball_id][2].push(_data.z);
    if (bufferBallsVel[ball_id][0].length > bufLen) bufferBallsVel[ball_id][0].shift();
    if (bufferBallsVel[ball_id][1].length > bufLen) bufferBallsVel[ball_id][1].shift();
    if (bufferBallsVel[ball_id][2].length > bufLen) bufferBallsVel[ball_id][2].shift();

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


function mousePressed() {

}

function mouseClicked() {

    img_random_idx = Math.floor((Math.random() * 29));
    console.log(img_random_idx);
    // drawImage = !drawImage;

}