//const game={};
//let highScores = JSON.parse(localStorage.getItem("breakoutHighScores")) || [];
//const levels = [];
const powerUpTypes=[
  {type:"fire",chance:2},
  {type:"laser",chance:2},
  {type:"expand",chance:5},
  {type:"slow",chance:5},
  {type:"life",chance:2},
  {type:"multi",chance:2},
  {type:null,chance:84}

];
const powerUpInfo = {

    expand : {
        hue1 : 120,
        hue2 : 180,
        icon : "↔"
    },

    slow : {
        hue1 : 200,
        hue2 : 260,
        icon : "❄"
    },

    life : {
        hue1 : 340,
        hue2 : 10,
        icon : "♥"
    },

    fire : {
        hue1 : 20,
        hue2 : 60,
        icon : "🔥"
    },

    laser : {
        hue1 : 270,
        hue2 : 320,
        icon : "⚡"
    },
    multi : {
        hue1 : 40,
        hue2 : 70,
        icon : "⚪"
    }

};

const hpColor = {
  1 : "red",
  2 : "green",
  3 : "blue",
  4 : "pink"
}
const brickType = {
  "." : null,
  "R" : {color : "red",hp : 1,score : 10,solid : false},
  "G" : {color : "green",hp : 2,score : 20,solid : false},
  "B" : {color : "blue",hp : 3,score : 30,solid : false},
  "P" :{color : "pink",hp : 4,score : 40,solid : false},
  "X" : {color : "silver",hp : 999999,score : 0,solid : true}
}
let canvas;
let ctx;


















function randomType(){
  let total = 0;
  for (const p of powerUpTypes){
    total +=p.chance;    
  }
  //console.log("total="+total);
  let r = Math.random()*total;
  //console.log("r="+r);
  for ( p of powerUpTypes){
    r -= p.chance;
    //console.log("r="+r+"type="+p.type);
    if (r <= 0 ) return p.type;
  }
  return null;
  //return types[Math.floor(Math.random()*types.length)];
}





//console.log("hi");
window.onload = init;






function init(){
  createCanvas();
  //loadSounds();
  createObjects();
  createEvents();
  gameLoop();
  
}
function createCanvas(){
  canvas = document.getElementById("gameCanvas");
  canvas.style.cursor = "none";
  //console.log(canvas);
  //console.log(canvas === null);
  ctx = canvas.getContext("2d");
  canvas.height = height;
  canvas.width = width;
  fitCanvas();
  window.addEventListener("resize", fitCanvas);
  window.addEventListener("orientationchange", fitCanvas);

  //console.log(canvas);
  //console.log(ctx);
  
}
function createObjects(){
  game.lastLaserShot = 0;
  game.lasers = [];
  game.floatingTexts = [];
  game.combo = 0;
  game.camera = {

    shake : 0,
    x : 0,
    y : 0

};
  game.highScores = loadHighScores();
  //game.highScores = loadHighScores();
  game.highScoreAnim = 0;
  game.ui = {
    playerName: "",
    cursorVisible: true,
    cursorTimer: 0
  };
  game.effects = {
    expand:0,
    slow:0,
    slowAmount:0,
    fire:0
  };
  game.powerUps = [];
  game.particles = [];
  game.speedTimer = 0;
  game.lastFrame = performance.now();
  game.state = GameState.START;
  game.level = 1;
  game.baseBallSpeed = 5;
  createBricks();
  
  game.paddle = new Paddle(
    width/2-80/2,
    height-50,
    80,
    15,
    "lime"
  );
  
  game.balls = [];

  game.balls.push(
    new Ball(
        width/2,
        height-55,
        7,
        5,
        3,
        -4
    )
  );
  
  
  game.life = 3;
  game.score = 0;
  
}
function createBricks(){
  const level = levels[game.level];
  game.bricks = [];
  for (let r = 0; r < level.row; r++){
    for (let c = 0; c < level.col; c++){
      if (level.layout[r][c] === "." ) continue;
      const type = brickType[level.layout[r][c]];
      game.bricks.push(
      new Brick (
        level.x + (level.w+level.gapX) * c,
        level.y + (level.h+level.gapY) * r,
        level.w,
        level.h,
        type
      )
     );

    }

  }

}




function gameLoop(){
  let now = performance.now();
  
  
  let delta = (now - game.lastFrame)/1000;
  //console.log(now + " "+game.lastFrame+" "+delta);
  game.lastFrame = now;
  if (isNaN(delta)) delta =.001;
  update(delta);
  
  draw();

  requestAnimationFrame(gameLoop);
}






function nextLevel(){

    playSound("levelUp");

    game.baseBallSpeed = Math.min(
        game.baseBallSpeed + (game.level < 8 ? 0.5 : 0.033),
        maxSpeed
    );

    // پاکسازی افکت‌ها
    game.lasers = [];
    game.effects.laser = 0;
    game.effects.fire = 0;
    game.effects.slow = 0;
    game.effects.slowAmount = 0;

    game.fragments.length = 0;
    game.particles.length = 0;
    game.powerUps.length = 0;

    game.level++;
    game.speedTimer = 0;

    //--------------------------------------
    // آخرین مرحله تمام شده
    //--------------------------------------

    if(!levels[game.level]){

        game.baseBallSpeed = 5;

        // فقط یک توپ باقی بماند
        game.balls = [];

        game.balls.push(
            new Ball(
                width/2,
                height-55,
                7,
                game.baseBallSpeed,
                3,
                -4
            )
        );

        game.combo = 0;

        game.state = GameState.WIN;

        if(isHighScore(game.score)){

            game.ui.playerName = "";
            game.state = GameState.HIGHSCORE;

        }else{

            game.state = GameState.GAMEOVER;
            game.highScoreAnim = performance.now();

        }

        return;
    }

    //--------------------------------------
    // مرحله بعد
    //--------------------------------------

    createBricks();

    // همه توپ‌های قبلی حذف شوند
    game.balls = [];

    // فقط یک توپ جدید روی راکت ساخته شود
    game.balls.push(
        new Ball(
            width/2,
            height-55,
            7,
            game.baseBallSpeed,
            3,
            -4
        )
    );

    game.combo = 0;
    game.state = GameState.READY;
}






function resetGame(){
  
    game.level = 1;
    game.score = 0;
    game.life = 3;

    createBricks();

    //game.ball.reset();

    game.paddle.x = width/2 - game.paddle.w/2;

}


function startShake(power){
  //console.log(power);

    game.camera.shake = Math.max(
        game.camera.shake,
        power
    );

}