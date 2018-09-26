//================================ Global ================================
// staging
var stage = 0;

var GRAPH = -1;
var LOGGED_IN = 0;
var CATCH_BALL_1 = 1;
var CATCH_BALL_2 = 2;
var CATCH_BALL_3 = 3;
var CATCH_BALL_4 = 4;
var CATCH_BALL_ENDDING = 5;
var LOGGED_OUT = 6;

var NUM_IMAGES = 29;

// socket.io
var socket = io.connect();

// graph
var bufferBallsOri = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]]; // [ballID][axis: x, y, z]
var bufferBallsAcc = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]];
var bufferBallsVel = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]];
var bufferBallsG = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]];
var bufLen = 512;
var plotSize = 5;
var scaleY = 3;

var bloom = 0;


// logged in
var logId = "";

// botany
var var_shape, var_color;
var n = 0;
var c = 4;
var botany_max = 300;
var botany_space = 5;
var botany_theta = 137.5;
var botany_color_base = 155;

// images
var imgs = [];  // Declare variable 'img'.
var changeImage = false;
var img_random_idx = 0;
var imgPaddingH, imgPaddingV;
var image_alpha = 125;

// text ball
var sentance = [];



//================================ setup() ================================
function setup() {

  createCanvas(innerWidth-20, innerHeight-20);
  angleMode(DEGREES);


  // load images
  for (var i = 0; i < 29; i++) {
      imgs[i] = loadImage("assets/" + i + ".jpg");
  }

  imgPaddingH = innerWidth/8;
  imgPaddingV = innerHeight/8;


  // sentances
  sentance[0] = "폭탄이 비행기에서 풀리면 비행기의 수평 속도와 같은 수평 속도로 포물선 궤도를 따라 간다. 폭탄은 비행기 바로 밑으로 떨어집니다 (파선). 폭탄이 땅 위의 어떤 높이에서 폭발하면 조각의 질량 중심은 원래의 포물선 궤도 (주황색 곡선)를 따른다. 운동량은 보존됩니다. 즉, 폭발 직전의 각 조각에 대한 매스의 곱과 벡터의 합은 폭발 직후의 운동량과 같습니다";

  // set stage - bind to key pressed to control manually
  stage = LOGGED_IN;

}


//================================ draw() ================================
function draw() {

    switch(stage) {
        case GRAPH:

            // vertical center line
            colorMode(RGB);
            background(0);
            stroke(255);
            line(0, height/2, width, height/2);

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
            break;


        case LOGGED_IN:

            background(0);
            textAlign(CENTER);
            
            var ts = innerWidth/8;
            textSize(ts/2);
            colorMode(HSB);
            fill(random(255), 100, 100);
            text("Id: " + logId, innerWidth/2, innerHeight/2 - ts/2);

            textSize(ts);
            colorMode(RGB);
            fill(255);
            text("Logged In", innerWidth/2, innerHeight/2 + ts/2);

            break;

        case CATCH_BALL_1:
            // draw botany all at once
            // draw frame by frame or all at once?
            background(0);
            colorMode(HSB);
            var k, s;
            
            // botany variation
            switch(var_shape) {
                case 0:
                    k = 137.3;
                    s = 2;
                    break;
                case 1:
                    k = 137.5;
                    break;
                case 20:
                    k = 137.6;
                    break;
                default:
                    k = 137.6;
            }

            switch(var_color) {
                case 0:
                    fill(55, 100 * cos(a/3), 100);
                    break;
                case 1:
                    fill(5, 100 * cos(a/3), 100);
                    break;
                case 20:
                    fill(155, 100 * cos(a/3), 100);
                    break;
                default:
                    fill(155, 100 * cos(a/3), 100);
            }


            var a = n * k;
            var r = c * sqrt(n);

            var x = 2 * r * cos(a) + width/2;
            var y = 2 * r * sin(a) + height/2;

            noStroke();
                
            if (n % 3 == 0) {

                // ellipse
                ellipse(x, y, random(4, 8), random(4, 10));    

                // text
                var curChar = sentance[0][n%sentance[0].length];
                if (curChar === '폭' || curChar === '탄') {
                    fill(5, 100, 100);
                    textSize(20);
                };
                text(curChar, x, y);

            }
            n+=1;

            break;

        case CATCH_BALL_2:
            // botany + rotation by ball orientation of which ball? as a team of specific ball?
            // botany color, shape variation
            background(0);
            colorMode(HSB);
    
            // text ball
            push();
            translate(innerWidth/2, innerHeight/2);

            // rotate
            // var r = frameCount*10 % 360;
            // rotate(r);
            // console.log(r);

            // noise random values
            if (variantBotany == 1) {
                botany_max = noise(frameCount/20) * 600;
                botany_theta = 134 + noise(frameCount/50) * 1.7;
                botany_space = 3 + 1 + noise(frameCount/30) * 4;
                botany_color_base = getRandomInt(255);
                variantBotany = 0;
            }

            // fill(155, 100 * cos(a/3) * 255, 200);
            for (var i = 0; i < botany_max; i+=1) {

                // var a = i * 135.6;
                var a = i * botany_theta;
                var r = c * sqrt(i);

                var x = botany_space * r * cos(a); 
                var y = botany_space * r * sin(a);

                fill(botany_color_base * sin(a), 100 * cos(a/3), 10 + 100 * ((botany_max - i)/botany_max));

                ellipse(x, y, random(4, 8), random(4, 10));    
                // vertex(x, y);
        
            }

            pop();
            break;


        case CATCH_BALL_3: 
            // botany + trajectory images : when ball is flying
            // botany color, shape variation
            background(0);
            colorMode(HSB);
            imageMode(CENTER);
    
            // text ball
            push();
            translate(innerWidth/2, innerHeight/2);

            // rotate
            // var r = frameCount*10 % 360;
            // rotate(r);
            // console.log(r);

            // noise random values
            if (variantBotany == 1) {
                botany_max = noise(frameCount/20) * 600;
                botany_theta = 134 + noise(frameCount/50) * 1.7;
                botany_space = 3 + 1 + noise(frameCount/30) * 4;
                botany_color_base = getRandomInt(255);
                variantBotany = 0;
            }

            // fill(155, 100 * cos(a/3) * 255, 200);
            for (var i = 0; i < botany_max; i+=1) {

                // var a = i * 135.6;
                var a = i * botany_theta;
                var r = c * sqrt(i);

                var x = botany_space * r * cos(a); 
                var y = botany_space * r * sin(a);

                // var curChar = sentance[0][i%sentance[0].length];
                // console.log(curChar);

                fill(botany_color_base * sin(a), 100 * cos(a/3), 10 + 100 * ((botany_max - i)/botany_max));
                // textSize(ts);

                // if (curChar === '폭' || curChar === '탄') {
                //     fill(5, 100, 10 + 100 * ((botany_max - i)/botany_max));
                //     textSize(ts*2);
                // };

                ellipse(x, y, random(4, 8), random(4, 10));    
                // text(curChar, x, y);
                // vertex(x, y);
        
            }

            if (changeImage) {
                img_random_idx = Math.floor((Math.random() * NUM_IMAGES));
                image_alpha = 0;
                
                // console.log(img_random_idx);

                // var img_w = innerWidth - (2 * imgPaddingH);
                // var img_h = innerHeight - (2 * imgPaddingV);

                // image(imgs[img_random_idx], innerWidth/2, innerHeight/2, img.width, img.height);
                changeImage = false;
            }

            tint(255, image_alpha); // Apply transparency without changing color
            image(imgs[img_random_idx], innerWidth/2, innerHeight/2, innerWidth*6/8, innerHeight*6/8);

            break;

        case CATCH_BALL_4:
            // when ball stop: text botany (frame by frame) / when ball flying: char changes as ellipse + CATCH_BALL_3 trajectory images
            background(0);
            colorMode(HSB);
            var k, s;
            
            // botany variation
            // switch(var_shape) {
            //     case 0:
            //         k = 137.3;
            //         s = 2;
            //         break;
            //     case 1:
            //         k = 137.5;
            //         break;
            //     case 20:
            //         k = 137.6;
            //         break;
            //     default:
            //         k = 137.6;
            // }

            // switch(var_color) {
            //     case 0:
            //         fill(55, 100 * cos(a/3), bness);
            //         break;
            //     case 1:
            //         fill(5, 100 * cos(a/3), bness);
            //         break;
            //     case 20:
            //         fill(155, 100 * cos(a/3), bness);
            //         break;
            //     default:
            //         fill(155, 100 * cos(a/3), bness);
            // }

            var a = n * k;
            var r = c * sqrt(n);

            var x = 2 * r * cos(a) + width/2;
            var y = 2 * r * sin(a) + height/2;

            noStroke();
                
            if (n % 1 == 0) {

                // ellipse
                // show if bness 100;
                fill(155, 100 * cos(a/3), bness);
                ellipse(x, y, random(4, 8), random(4, 10));    


                // text
                // show if bness 0;
                fill(155, 100 * cos(a/3), 100 - bness);
                var curChar = sentance[0][n%sentance[0].length];
                if (curChar === '폭' || curChar === '탄') {
                    fill(5, 100, 100 - bness);
                    textSize(20);
                };
                text(curChar, x, y);

            }
            n+=1;


            break;

        case CATCH_BALL_ENDDING:
            // text ball rotation with 1 ball
            colorMode(HSB);
            if (endingMakeWhite) background(0, 0, 100);
            else background(endingBackCol, 100, 100);

            // text ball
            push();
            translate(innerWidth/2, innerHeight/2);

            // rotate
            var r = frameCount*10 % 360;
            rotate(r);
            // console.log(r);

            // noise random values
            var max = noise(frameCount/20) * 600;
            var ka = 134 + noise(frameCount/50) * 1.7;
            var space = 3 + 1 + noise(frameCount/30) * 4;
            var ts = 30 + noise(frameCount/10) * 20;


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

            pop();
            break;

        case LOGGED_OUT:
            background(0);
            text("Logged Out");
            // blinking text
            break;

        default:
            break;
    }

 
}


//================================== socket.io handler ==================================
// socket.io callback

// orientation
socket.on('ori0', function(_data) {
    storeOrientation(0, _data);
});

socket.on('ori1', function(_data) {
    // console.log("get ori of ball 1 from client()");
    // console.log(_data);
    storeOrientation(1, _data);
});

socket.on('ori2', function(_data) {
    // console.log("get ori of ball 2 from client()");
    // console.log(_data);
    storeOrientation(2, _data);
});

socket.on('ori3', function(_data) {
    // console.log("get ori of ball 3 from client()");
    // console.log(_data);
    storeOrientation(3, _data);
});


// acc
socket.on('acc0', function(_data) {
    // console.log("get acc from client()")
    // console.log(_data);
    storeAcceleration(0, _data);
});

socket.on('acc1', function(_data) {
    // console.log("get acc of ball 1 from client()");
    // console.log(_data);
    storeAcceleration(1, _data);
});

socket.on('acc2', function(_data) {
    // console.log("get acc of ball 2 from client()");
    // console.log(_data);
    storeAcceleration(2, _data);
});

socket.on('acc3', function(_data) { 
    // console.log("get acc of ball 3 from client()");
    // console.log(_data);
    storeAcceleration(3, _data);
});


// logged in
socket.on('loggedIn', function(_data) {
    console.log(_data);
    logId = _data;
});

// ========== 2 ==========
socket.on('drawBotany', function(_data) {
    console.log(_data);
    drawBotany = _data.value;
    var_shape = _data._shape;
    var_color = _data._color;
});

socket.on('variantBotany', function(_data) {
//   console.log(_data);
    variantBotany = _data.value;
});

// ========== 3 ==========
socket.on('changeImage', function(_data) {
    changeImage = _data.value;
});

socket.on('imageAlpha', function(_data) {
//   console.log(_data);
    image_alpha = map(_data.value, 0.0, 360.0, 0, 255);
});

// ========== 4 ==========
socket.on('setBness', function(_data) {
    // _data.value is coming 0 or 1. For using as HSB's Brightness value (0 ~ 100)
    bness = _data.value * 100;
});


// ========== ENDING ==========
socket.on('setBackground', function(_data) {
//   console.log(_data);
    var d = _data.value;
    if (d != 1000) {
        endingBackCol = map(d, ORI_X_MIN, ORI_X_MAX, 0, 255);
        endingMakeWhite = false;
    } else {
        endingBackCol = d;
        endingMakeWhite = true;
    }
});


socket.on('bloom', function(_data) { 
    al = 255;
    console.log(_data);
});



//================================== functions ==================================
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}



//================================== control function ==================================
function mouseClicked() {

    img_random_idx = Math.floor((Math.random() * 29));
    console.log(img_random_idx);
    // drawImage = !drawImage;

}

function keyTyped() {

    if (key === '1') {
        stage = LOGGED_IN;
    } else if (key === '2') {
        stage = CATCH_BALL_1;
    } else if (key === '3') {
        stage = CATCH_BALL_2;
    } else if (key === '4') {
        stage = CATCH_BALL_3;
    } else if (key === '5') {
        stage = CATCH_BALL_4;
    } else if (key === '6') {
        stage = CATCH_BALL_ENDDING;
    } else if (key === '0') {
        stage = GRAPH;
    } 

    // uncomment to prevent any default behavior
    return false;
  }