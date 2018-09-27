//================================ Global ================================
// staging
var GRAPH = -1;
var LOGGING_IN = 0;
var CATCH_BALL_1 = 1;
var CATCH_BALL_2 = 2;
var CATCH_BALL_3 = 3;
var CATCH_BALL_4 = 4;
var CATCH_BALL_ENDDING = 5;
var LOGGED_OUT = 6;

// stage holder
var stage = LOGGING_IN;

// constant
var ORI_X_MIN = 0;
var ORI_X_MAX = 360;

var NUM_IMAGES = 29;
var NUM_SHAPE_VAR = 5;
var NUM_COLOR_VAR = 5;
var NUM_TEXT_VAR = 12;

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
var uniqueVarShape = 0;
var uniqueVarColor = 0;
var uniqueVarTextIdx = 0;

// catch_ball_1
var oneIsFirstTime = true;
var fourIsFirstTime = true;


// botany
var var_shape, var_color;
var variantBotany = 0;
var n = 0;
var c = 4;
var botany_max = 300;
var botany_space = 5;
var botany_theta = 137.5;
var botany_color_base = 155;
var botany_ellipse_x = 5;
var botany_ellipse_y = 6;
var botany_sat_base = 40;
var botany_sat_div = 1;
var botany_orientation = 0;
var botany_count = 0;
var botany_frameDiv = 20;

// images
var imgs = [];  // Declare variable 'img'.
// var changeImage = 0;
var img_random_idx = 0;
var imgPaddingH, imgPaddingV;
var image_alpha = 125;
var drawImages = 0;
var drawText = 0;

// text ball
var sentance = [];
var tsNormal = 10;
var tsLarge = 20;


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
  sentance[1] = "영국의 시리아 인권 전망대는 일요일 296 명으로 총 사망자를 기록했다. 폭발물과 파편으로 가득 찬 용기 폭탄이 수요일 Jisreen과 Kfar Batna 마을의 정부 공습에 사용되었다고한다. 화요일에 Ghouta 동부 전역의 적어도 10 개 마을과 마을에 대한 폭격이 이어진다. 시리아 국영 TV는 다마스쿠스 동부의 정부 관리 지역에 살고있는 적어도 6 명이 이른 주 동부에서 총격을받은 포탄들에 의해 이번 주 초에 살해됐다고 보도했다. 시리아 군은 포탄이 발사 된 지역에서 \"정밀 타격\"을 실시했다고 밝혔다.";
  sentance[2] = "시리아 정부가 3 일째 치열한 공격으로 다마스쿠스 반란군 장례식장에서 박격포와 폭탄이 비가 내리고있다. 현지 수사 당국은 월요일 밤까지 하룻밤 사이에 동부 Ghouta에서 격렬한 포격, 로켓 공격 및 공습으로 150 명이 넘는 사람들이 사망했습니다. 시리아 천문대는 48 시간 만에 사망자가 250 명으로 늘어났다고 밝혔다. 많은 시체가 여전히 잔해 아래에 갇혀 있습니다. 압도적 인 응급 처치 요원은 부상당한 사람들의 요구에 부응하기 위해 고군분투하고 있습니다.";
  sentance[3] = "아이 야드, 27 세 나가 원하는 모두는 폭격이 멈추고, 나의 이웃 사람 및 나가 자란 거리와 Ghouta에서 체재하기위한 것이다. 이것은 우리의 고향입니다. 우리는 파괴와 재건을 다룰 수 있습니다. 우리는 단지 머물고 싶습니다. 모하메드, 27 세, 사진 작가 폭탄 테러는 오전 11시에 시작 됐고, 발견 된 첫 번째 시체 인, 친구의 아들은 오후 6시에있었습니다. Taaqi, 30, 구조대 원 어제 밤에 그들이 폭탄 테러에 안전했는지 확인하기 위해 돌아 왔습니다. 모든 이웃이 파괴되었습니다. 그들이 살아 있거나 죽었는지 전혀 모르겠습니다. Hamzi, 24, 구급 요원 당신이 누군가를 구할 때 최대 2 분이 남았습니다. 이 정권은 보통 같은 지역을 두 번 연속적으로 폭파하여 구조 작업 원에게 두 번째 공격을 가하는 것을 목표로 삼고있다. 폭탄으로 부상당한 한 남자가 2 월 20 일 Douma에있는 의료 시설에서 도움을 기다리고있다. Mohammed Badra-EPA-EFE / Shutterstock";
  sentance[4] = "미 행정부와 파키스탄 당국은 민간인의 공격으로 인한 사망자는 거의 없다고 공개적으로 주장했다. [정화가 필요하다] 누출 된 군사 문서에 따르면 사망자의 대다수가 의도 된 표적이 아니며 사망자의 약 13 %가 의도 된 표적이되었다 , 81 %는 다른 \"무장 세력\"이고, 6 %는 민간인이다. [18] [19] 요격당한 언론인에 따르면이 문서를 유출 한 소식통에 따르면 94 %의 무장 세력 사망자 중 일부는 군사력이있는 남성이 포함 된 것으로 알려졌다. 원본은이 사실에 대한 아무런 증거도 제시하지 않았지만 이러한 주장은 문서 자체에서 확인되지 않았음에도 불구하고 명확하게 입증 된 바있다. 민간인 사망자 수의 추정치는 158에서 965 사이다. [6] [10] 국제 앰네스티는 많은 희생자가 무장하지 않았으며 일부 파업은 전쟁 범죄에 해당 될 수 있음을 발견했다.";
  sentance[5] = "인권 단체 인 '희생자 (Retrieve)'가 실시한 무인 항공기 폭격에 대한 대중의 자료에 대한 새로운 분석은 운영자가 특정 개인을 목표로 삼을 때라도 (바락 오바마가 \"표적 살해\"라고 부르는 가장 집중된 노력) 사람들은 종종 여러 번 공격 할 필요가 있습니다. 41 명의 남성을 죽이려는 시도로 11 월 24 일 현재 1,147 명의 사망자가 발생했습니다.";
  sentance[6] = "양국 전역의 무인 항공기 폭격 대상자 41 명을 대상으로 한 자료에 따르면 각자가 여러 번 살해 된 것으로 보도되었다. 그들 중 7 명은 여전히 ​​살아 있다고 믿어집니다. 다른 사람, Haji Omar의 지위는 알려지지 않았습니다. 무인 항공기를 3 번 ​​공격 한 아부 우바이 다 알 마스리 (Abu Ubaidah al-Masri)는 나중에 간염으로 여겨지는 자연 원인으로 사망했다.";
  sentance[7] = "나는 전투 폭격기로 활주 폭격 정밀도를 높이기 위해 레벨 폭격의 기본 발리 스틱에 들어가기로 결정했습니다. 그래서이 글에서는 다른 것들을 떨어 뜨려서 죽게 만드는 기본 수학을 여러분과 공유 할 것입니다.) 우선 우리는 우리의 탑재 물에 작용하는 힘 - 중력과 공기 저항을 이해해야합니다. 저항력을 무시할 것입니다. 왜냐하면 폭탄의 항력 계수를 알지 못하고 폭탄 공격이 낮은 수준에서 이루어지기 때문에 어쨌든 속도가 느려지는 시간이별로 없습니다. 그래서 우리의 폭탄은 중력에 의해 아래쪽으로 가속됩니다.";
  sentance[8] = "미국의 정보 분석가들에 따르면, 북한은 또한 미사일에 맞도록 핵탄두를 충분히 가지고있다. 9 월 2 일, 미국은 가장 강력한 핵 장치를 시험했지만, 미국이 히로시마에 떨어 뜨린 폭탄의 7 배에 달하는 폭발적인 폭발을 보였다.";
  sentance[9] = "미국은 2004 년 6 월부터 파키스탄에 무인 항공기로 폭격했다. CIA는 미국 특수 부대의 무인 항공기가 파키스탄의 무인 항공기에 대한 독점 기밀 유지를 끝낸 2016 년 5 월까지 미국의 모든 무인 항공기에 대한 공격을 담당했다. 파키스탄 정부를 전복하려는 아프간 탈레반과 파키스탄 탈레반, TTP 등 국내 테러 분자들을 포함 해 알 카에다와 그 동맹국을 겨냥한 폭격이 벌어졌습니다. 여성과 어린이를 포함한 수백 명의 시민들과 테러 집단의 고위직도 사망했다. 그러나 더 많은 사람들이 죽임을당한 상태는 아직 알려지지 않았습니다. 그들은 무명으로 죽고, 단지 데이터 세트의 소스 자료의 대부분을 차지하는 언론 보도에서 \"전투적인\"것으로 기록됩니다. 그러나 그들이 무장 단체에 속해 있는지 여부는 분명하지 않습니다.";
  sentance[10] = "전체 데이터 국은 해마다 파키스탄, 아프가니스탄, 소말리아, 예멘에서 미국의 폭격에 대한 이야기의 타임 라인을 발표합니다. 파키스탄에 대한 2018 년 일정은 아래와 같습니다. 다른 모든 타임 라인 링크는 여기에서 찾을 수 있습니다. 우리는 또한 각국의 사상자 수를 나타내는 스프레드 시트를 게시합니다. 파키스탄 전체 시트를 다운로드 할 수 있습니다.";
  sentance[11] = "목표를 초과하면 표식에 대한 정보를 얻기 위해 센서 폭탄을 떨어 뜨립니다. 파워 블록과 미사일 포탑을 찾습니다. 미사일 폭발은 정말로 열심히 펀치를하고 폭탄 궤적을 왜곡하여 목표를 망치고 우리는 먼저 그들을 제거하기를 원합니다. 그리드 정보를 얻으면 운동 폭탄으로 전환하고 정밀 폭격을 시작합니다. 위에서 언급 한 것처럼 먼저 미사일 포탑을 목표로 삼습니다. 적 기지에 원자로 또는 배터리 클러스터가 하나만있는 경우 표적이되어야합니다. 그러면 노크를 사용하는 전력이 포탑과 함께 눈금을 사용할 수 없게됩니다.";

  // set stage - bind to key pressed to control manually
  stage = LOGGING_IN;

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


        case LOGGING_IN:

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

            //reset boolean
            oneIsFirstTime = true;
            n = 0;
            break;

        case CATCH_BALL_1:
            // draw botany all at once
            // draw frame by frame or all at once?

            if (oneIsFirstTime) {
                // erase logged in text
                background(0);
                var_shape = getRandomInt(5);
                // console.log("sh: " + var_shape);
                var_color = getRandomInt(5);
                // console.log("cl: " + var_color);
                oneIsFirstTime = false;
            }

            colorMode(HSB);
            
            // botany variation
            var k, s, rmin, rmax;
            switch(var_shape) {
                case 0:
                    k = 137.3;
                    s = 3;
                    rmin = 6; rmax = 9;
                    break;
                case 1:
                    k = 137.5;
                    s = 2.5;
                    rmin = 1; rmax = 3;
                    break;
                case 2:
                    k = 137.6;
                    s = 1.3;
                    rmin = 4; rmax = 5;
                    break;
                case 3:
                    k = 137.7;
                    s = 3;
                    rmin = 3; rmax = 8;
                    break;
                case 4:
                    k = 137.8;
                    s = 2.9;
                    rmin = 2; rmax = 4;
                    break;
 
                default:
                    k = 137.6;
                    s = 2;
                    rmin = 4; rmax = 8;
                    break;
            }


            var a = n * k;
            var r = c * sqrt(n);

            var x = s * r * cos(a) + innerWidth/2;
            var y = s * r * sin(a) + innerHeight/2;

            noStroke();
                
            switch(var_color) {
                case 0:
                    fill(55, 50 + 50 * cos(a/3), 100);
                    break;
                case 1:
                    fill(5, 40 + 40 * cos(a/2), 100);
                    break;
                case 2:
                    fill(155, 70 + 30 * cos(a/2), 100);
                    break;
                case 3:
                    fill(random(255), 90 + 10 * cos(a/3), 100);
                    break;
                case 4:
                    fill(40, 30 + 50 * cos(a/3), 100);
                    break;

                default:
                    fill(155, 100 * cos(a/3), 100);
                    break;
            }

            ellipse(x, y, random(rmin, rmax), random(rmin, rmax+2));    

            n+=1;

            break;

        case CATCH_BALL_2:
            // botany + rotation by ball orientation of which ball? as a team of specific ball?
            // botany color, shape variation
            background(0);
            colorMode(HSB);
    
            push();
            translate(innerWidth/2, innerHeight/2);

            // rotate
            // var r = frameCount*10 % 360;
            rotate(botany_orientation);
            // console.log(r);

            // noise random values
            if (variantBotany == 1) {
                console.log("in variation");
                botany_max = 30 + random(600);
                botany_theta = 137 + random(0.8);
                botany_space = random(4);
                botany_color_base = getRandomInt(255);
                botany_sat_base = getRandomInt(80);
                botany_sat_div = 1 + getRandomInt(4);
                botany_ellipse_x = random(4, 8);
                botany_ellipse_y = random(4, 10);
                variantBotany = 0;
            }

            // fill(155, 100 * cos(a/3) * 255, 200);
            for (var i = 0; i < botany_max; i+=1) {

                // var a = i * 135.6;
                var a = i * botany_theta;
                var r = c * sqrt(i);

                var x = botany_space * r * cos(a); 
                var y = botany_space * r * sin(a);

                fill(botany_color_base, botany_sat_base + (100 - botany_sat_base) * cos(a/botany_sat_div), 10 + 100 * ((botany_max - i)/botany_max));

                ellipse(x, y, botany_ellipse_x, botany_ellipse_y);    
        
            }

            pop();

            break;


        case CATCH_BALL_3: 
            // botany + trajectory images : when ball is flying
            // botany color, shape variation
            background(0);
            colorMode(HSB);
            imageMode(CENTER);

            push();
            translate(innerWidth/2, innerHeight/2);

            // rotate
            // var r = frameCount*10 % 360;
            rotate(botany_orientation);
            // console.log(r);

            // noise random values
            if (variantBotany == 1) {
                console.log("in variation");
                botany_max = 30 + random(600);
                botany_theta = 137 + random(0.8);
                botany_space = random(4);
                botany_color_base = getRandomInt(255);
                botany_sat_base = getRandomInt(80);
                botany_sat_div = 1 + getRandomInt(4);
                botany_ellipse_x = random(4, 8);
                botany_ellipse_y = random(4, 10);
                variantBotany = 0;
            }

            if (drawImages == 0) {
                for (var i = 0; i < botany_max; i+=1) {

                    // var a = i * 135.6;
                    var a = i * botany_theta;
                    var r = c * sqrt(i);

                    var x = botany_space * r * cos(a); 
                    var y = botany_space * r * sin(a);

                    fill(botany_color_base, botany_sat_base + (100 - botany_sat_base) * cos(a/botany_sat_div), 10 + 100 * ((botany_max - i)/botany_max));

                    ellipse(x, y, botany_ellipse_x, botany_ellipse_y);    
            
                }
            }
            pop();

            // trajectory images
            if (drawImages == 1) {
                // tint is not working : why?
                // tint(255, image_alpha); // Apply transparency without changing color
                // tint(255, 10); // Apply transparency without changing color
                image(imgs[img_random_idx], innerWidth/2, innerHeight/2, innerWidth*6/8, innerHeight*6/8);
            }


            break;

        case CATCH_BALL_4:
            // when ball stop: text botany (frame by frame) / when ball flying: char changes as ellipse

            if (fourIsFirstTime) {
                botany_count = 0;
                fourIsFirstTime = false;
                console.log("sh: " + uniqueVarShape);
                console.log("cl: " + uniqueVarColor);
                console.log("textidx: " + uniqueVarTextIdx);
            }
            
            background(0);
            colorMode(HSB);


            // botany variation
            var k, s, rmin, rmax;
            switch(uniqueVarShape) {
                case 0:
                    k = 137.3;
                    s = 3;
                    rmin = 6; rmax = 9;
                    break;
                case 1:
                    k = 137.5;
                    s = 2.5;
                    rmin = 1; rmax = 3;
                    break;
                case 2:
                    k = 137.6;
                    s = 1.8;
                    rmin = 4; rmax = 5;
                    break;
                case 3:
                    k = 137.7;
                    s = 3;
                    rmin = 3; rmax = 8;
                    break;
                case 4:
                    k = 137.8;
                    s = 2.9;
                    rmin = 2; rmax = 4;
                    break;
 
                default:
                    k = 137.6;
                    s = 2;
                    rmin = 4; rmax = 8;
                    break;
            }


            push();
            translate(innerWidth/2, innerHeight/2);
            
            // Don't rotate : for more readable condition
            // rotate(botany_orientation);

            botany_count = frameCount/botany_frameDiv;

            for (var i = 0; i < botany_count; i+=1) {

                // var a = i * 135.6;
                var a = i * k;
                var r = c * sqrt(i);

                var x = s * r * cos(a); 
                var y = s * r * sin(a);


                // noStroke();
                    
                switch(uniqueVarColor) {
                    case 0:
                        fill(55, 50 + 50 * cos(a/3), 100);
                        break;
                    case 1:
                        fill(5, 40 + 40 * cos(a/2), 100);
                        break;
                    case 2:
                        fill(155, 70 + 30 * cos(a/2), 100);
                        break;
                    case 3:
                        fill(random(255), 90 + 10 * cos(a/3), 100);
                        break;
                    case 4:
                        fill(40, 30 + 50 * cos(a/3), 100);
                        break;

                    default:
                        fill(155, 100 * cos(a/3), 100);
                        break;
                }



                if (drawText == 1) {
                    // text
                    var curChar = sentance[uniqueVarTextIdx][i%sentance[0].length];

                    textSize(tsNormal);

                    // Highlighting
                    var highlightText = ['폭', '탄', '격', '발', '공', '습'];
                    // if (curChar === '폭' || curChar === '탄' || curChar === '격' || curChar === '발' || curChar === '공' || curChar === '습') {
                    if (highlightText.includes(curChar)){
                        fill(5, 100, 100);
                        textSize(tsLarge);
                    };

                    text(curChar, x, y);

                } else {
                    // ellipse
                    ellipse(x, y, tsNormal/2, tsNormal/2 - 1);    
                }
        
            }

            pop();




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

            colorMode(RGB);
            background(255);
            textAlign(CENTER);
            
            var ts = innerWidth/8;
            textSize(ts);

            if (frameCount % 10 == 0) loggedOutBlinking = !loggedOutBlinking;

            if (loggedOutBlinking) fill(0, 0) 
            else fill(0, 255);

            text("Logged Out", innerWidth/2, innerHeight/2);

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

// ========== STAGING ==========
socket.on('setStage', function(_data) {
    console.log("Go to stage " + _data.value);
    stage = parseInt(_data.value);
});


// ========== LOGGEED_IN ==========
socket.on('loggedIn', function(_data) {
    console.log(_data);
    logId = _data;
    uniqueVarShape = logId.charCodeAt(0) % NUM_SHAPE_VAR;
    uniqueVarColor = logId.charCodeAt(_data.length-1) % NUM_COLOR_VAR;
    uniqueVarTextIdx = logId.charCodeAt(1) % NUM_TEXT_VAR;

});

// ========== 2 ==========
socket.on('drawBotany', function(_data) {
    console.log(_data);
    drawBotany = _data.value;
    var_shape = _data._shape;
    var_color = _data._color;
});

socket.on('variantBotany', function(_data) {
    // console.log(_data);
    variantBotany = _data.value;
});

socket.on('setRotation', function(_data) {
    // console.log(_data);
    botany_orientation = map(_data.value, ORI_X_MIN, ORI_X_MAX, 0, 360);
});


// ========== 3 ==========
socket.on('drawImages', function(_data) {
    drawImages = _data.value;
    image_alpha = map(_data._alpha, ORI_X_MIN, ORI_X_MAX, 0, 360);
    img_random_idx = Math.floor(map(_data._alpha, ORI_X_MIN, ORI_X_MAX, 0, NUM_IMAGES));
    // console.log(img_random_idx);

});

socket.on('imageAlpha', function(_data) {
//   console.log(_data);
    image_alpha = map(_data.value, 0.0, 360.0, 0, 255);
});

// ========== 4 ==========
socket.on('drawText', function(_data) {
    drawText = _data.value;
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

socket.on('loggedOut', function(_data) { 
    stage = LOGGED_OUT;
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

    if (key === '0') {
        stage = LOGGING_IN;
    } else if (key === '1') {
        stage = CATCH_BALL_1;
    } else if (key === '2') {
        stage = CATCH_BALL_2;
    } else if (key === '3') {
        stage = CATCH_BALL_3;
    } else if (key === '4') {
        stage = CATCH_BALL_4;
    } else if (key === '5') {
        stage = CATCH_BALL_ENDDING;
    } else if (key === '9') {
        stage = GRAPH;
    } else if (key === 'v') {
        variantBotany = 1;
    }

    // uncomment to prevent any default behavior
    return false;
  }