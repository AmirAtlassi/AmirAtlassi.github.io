function draw(){

    clearScreen();

    drawWorld();

    drawUI();

}

function getCurrentEffect(){

    let effect = null;

    for(const key in game.effects){

        // فقط افکت‌هایی که آیکون دارند
        if(!powerUpInfo[key]) continue;

        if(game.effects[key] <= 0) continue;

        if(
            effect === null ||
            game.effects[key] < game.effects[effect]
        ){
            effect = key;
        }
    }

    return effect;
}


function drawEffectTimer(){
    //console.log(game.effects);

    const effect = getCurrentEffect();

    if(effect == null)
        return;
    //console.log("effect =", effect);
    const info = powerUpInfo[effect];

    const x = game.paddle.x + game.paddle.w/2;

    const y = game.paddle.y + game.paddle.h + 22;

    const time = game.effects[effect];

    //------------------------------------
    // آیکن
    //------------------------------------

    ctx.textAlign = "center";

    ctx.font = "18px Arial";

    ctx.fillStyle = "white";
    //console.log(effect);
    //console.log(powerUpInfo);

    ctx.fillText(
        info.icon,
        x,
        y
    );

    //------------------------------------
    // نوار
    //------------------------------------

    const w = 80;
    const h = 6;

    const barX = x - w/2;
    const barY = y + 8;

    ctx.fillStyle = "#333";

    ctx.fillRect(
        barX,
        barY,
        w,
        h
    );

    const ratio = Math.min(time/10,1);

    const g = ctx.createLinearGradient(
        barX,
        0,
        barX+w,
        0
    );

    g.addColorStop(
        0,
        `hsl(${info.hue1},100%,65%)`
    );

    g.addColorStop(
        1,
        `hsl(${info.hue2},100%,55%)`
    );

    ctx.fillStyle = g;

    ctx.fillRect(
        barX,
        barY,
        w*ratio,
        h
    );

    //------------------------------------
    // ثانیه
    //------------------------------------

    ctx.font = "12px Arial";

    ctx.fillStyle = "white";

    ctx.fillText(
        Math.ceil(time),
        x,
        barY + 22
    );

}


function drawWorld(){

    ctx.save();

    ctx.translate(game.camera.x, game.camera.y);
    //console.log(game.camera.x+" "+game.camera.y)
    //ctx.translate(30,0);

    drawBricks();
    drawFragments();
    for(const ball of game.balls){
        ball.draw(ctx);
    }
    drawLasers();
    drawParticles();
    drawFloatingTexts();
    drawPowerUps();
    game.paddle.draw(ctx);
    drawEffectTimer();


    ctx.restore();

}

function drawUI(){

    drawHUD();
    drawState();

}




function clearScreen(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
}


function drawBricks(){
  for(const brick of game.bricks){
    if (brick === GameState.DEAD) continue;
    brick.draw(ctx);
  }
}


function drawLasers(){

    //console.log(game.lasers.length);

    for(const laser of game.lasers){
        laser.draw();
    }

}


function drawParticles(){
  for(const p of game.particles){
    p.draw(ctx);
  }
}

function drawFloatingTexts(){

    for(const t of game.floatingTexts){

        t.draw(ctx);

    }

}



function drawPowerUps(){
  for (const p of game.powerUps){
    p.draw(ctx);
  }
}


function drawHUD(){

    //-----------------------------
    // نوار بالای بازی
    //-----------------------------

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        "Score : " + game.score,
        20,
        25
    );

    drawLives();

    ctx.fillText(
        "Combo : x" + game.combo,
        340,
        25
    );

    ctx.fillText(
        "Level : " + game.level,
        500,
        25
    );

    ctx.strokeStyle = "brown";
    ctx.lineWidth = 3;

    ctx.strokeRect(
        2,
        2,
        width-2,
        HUD_HEIGHT-2
    );

    //-----------------------------
    // امضا
    //-----------------------------

    ctx.save();

    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,.28)";

    ctx.fillText(
        "Amir Atlassi",
        width-10,
        height-8
    );

    ctx.restore();

    //-----------------------------
    // تایمر پاورآپ
    //-----------------------------

    drawEffectTimer();

}


function drawEffectTimer(){

    const effect = getCurrentEffect();

    if(effect == null) return;

    const time = game.effects[effect];

    const icon = powerUpInfo[effect].icon;

    let color = "white";

    // سه ثانیه آخر
    if(time <= 3){

        // هر 150 میلی‌ثانیه چشمک بزند
        if(Math.floor(performance.now()/150) % 2 == 0){
            color = "red";
        }else{
            color = "white";
        }

    }

    ctx.save();

    ctx.textAlign = "center";
    ctx.font = "22px Arial";
    ctx.fillStyle = color;

    ctx.fillText(
        icon + " " + time.toFixed(1),
        game.paddle.x + game.paddle.w/2,
        game.paddle.y + game.paddle.h + 28
    );

    ctx.restore();

}


function drawLives(){

    const startX = 180;
    const y = 12;

    for(let i=0;i<Math.min(game.life,5);i++){

        drawHeart(startX + i*26, y);

    }

    if(game.life > 5){

        ctx.fillStyle = "red";
        ctx.font = "18px Arial";

        ctx.fillText(
            "x" + game.life,
            startX + 5*26-10 ,
            y + 14        );
        ctx.fillStyle = "white";

    }

}

function drawHeart(x,y){

    ctx.save();

    ctx.translate(x,y);

    ctx.beginPath();

    ctx.moveTo(0,6);

    ctx.bezierCurveTo(
        0,-6,
        -12,-6,
        -12,4
    );

    ctx.bezierCurveTo(
        -12,12,
        0,18,
        0,22
    );

    ctx.bezierCurveTo(
        0,18,
        12,12,
        12,4
    );

    ctx.bezierCurveTo(
        12,-6,
        0,-6,
        0,6
    );

    ctx.fillStyle="#ff4040";
    ctx.fill();

    ctx.restore();

}


function drawState(){

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";

    switch(game.state){

      case GameState.START:

        ctx.save();

        ctx.textAlign = "center";

        //--------------------------------
        // Background Glow
        //--------------------------------

        const glow =
            ctx.createRadialGradient(
                width/2,
                height/2,
                40,
                width/2,
                height/2,
                350
            );

        glow.addColorStop(0,"rgba(255,255,255,.06)");
        glow.addColorStop(1,"rgba(0,0,0,0)");

        ctx.fillStyle = glow;
        ctx.fillRect(0,0,width,height);

        //--------------------------------
        // Title
        //--------------------------------

        drawLogo();
        /*
        ctx.font = "bold 60px Arial";
        ctx.fillStyle = "white";

        ctx.shadowColor = "#00c8ff";
        ctx.shadowBlur = 25;

        ctx.fillText(
            "BRICK-OUT",
            width/2,
            240
        );

        ctx.shadowBlur = 0;
            */
        //--------------------------------
        // Subtitle
        //--------------------------------

        ctx.font = "20px Arial";
        ctx.fillStyle = "#bbbbbb";

        ctx.fillText(
            "Classic Brick Breaker",
            width/2,
            280
        );

        //--------------------------------
        // Press SPACE
        //--------------------------------

        if(Math.floor(performance.now()/450)%2==0){

            ctx.font = "bold 28px Arial";
            ctx.fillStyle = "#FFD700";

            ctx.fillText(
                (("ontouchstart" in window) ? "TAP TO START" : "PRESS SPACE"),
                width/2,
                height/2+25
            );

        }

        //--------------------------------
        // Created by
        //--------------------------------

        ctx.font = "18px Arial";
        ctx.fillStyle = "rgba(255,255,255,.45)";

        ctx.fillText(
            "Created by",
            width/2,
            height-195
        );

        //--------------------------------
        // Amir Atlassi
        //--------------------------------

        const name = "Amir Atlassi";

        ctx.font = "bold 28px Arial";

        const textWidth =
            ctx.measureText(name).width;

        const x =
            width/2 - textWidth/2;

        const y =
            height-155;

        //--------------------------------
        // Rainbow Gradient
        //--------------------------------

        const t =
            performance.now()*0.002;

        const grad =
            ctx.createLinearGradient(

                x + Math.sin(t)*120,
                0,

                x + textWidth + Math.sin(t)*120,
                0

            );

        grad.addColorStop(0.00,"#ff4040");
        grad.addColorStop(0.15,"#ff9f1c");
        grad.addColorStop(0.30,"#ffd60a");
        grad.addColorStop(0.45,"#70e000");
        grad.addColorStop(0.60,"#00d4ff");
        grad.addColorStop(0.75,"#3a86ff");
        grad.addColorStop(0.90,"#8338ec");
        grad.addColorStop(1.00,"#ff006e");

        ctx.fillStyle = grad;

        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 1;

        ctx.fillText(
            name,
            width/2,
            y
        );

        ctx.shadowBlur = 0;

        //--------------------------------
        // Version
        //--------------------------------

        ctx.font = "14px Arial";
        ctx.fillStyle = "rgba(255,255,255,.18)";

        ctx.fillText(
            "Version 1.0",
            width/2,
            height-25
        );

        ctx.restore();

        break;

        case GameState.PAUSED:
            //ctx.fillText("PAUSED", width/2, height/2);
            ctx.fillStyle = "rgba(0,0,0,.5)";
            ctx.fillRect(0,0,width,height);
            ctx.fillStyle="white";
            ctx.font="40px Arial";
            ctx.textAlign="center";
            ctx.fillText("PAUSED",width/2,height/2);
            break;
        case GameState.READY:

            ctx.fillStyle="rgba(0,0,0,.45)";
            ctx.fillRect(0,0,width,height);

            ctx.fillStyle="white";
            ctx.font="34px Arial";
            ctx.fillText("CLICK TO START",width/2,height/2);

            break;

        case GameState.WIN:
               ctx.fillStyle="rgba(0,0,0,0.6)";
              ctx.fillRect(0,0,width,height);

              ctx.fillStyle="lime";
              ctx.font="48px Arial";
              ctx.fillText("YOU WIN!",width/2,height/2);

              ctx.font="22px Arial";
              ctx.fillStyle="white";
              ctx.fillText((("ontouchstart" in window) ? "Tap to restart" : "Press SPACE"),width/2,height/2+45);
              game.baseBallSpeed = 5;
               drawHighScores();

            break;

        case GameState.GAMEOVER:
            ctx.fillStyle="rgba(0,0,0,0.6)";
            ctx.fillRect(0,0,width,height);

            ctx.fillStyle="red";
            ctx.font="48px Arial";
            ctx.fillText("GAME OVER",width/2,height/2);

            ctx.font="22px Arial";
            ctx.fillStyle="white";
            ctx.fillText((("ontouchstart" in window) ? "Tap to restart" : "Press SPACE"),width/2,height/2+45);
            drawHighScores();

            break;
        case GameState.HIGHSCORE:

            game.baseBallSpeed = 5;

            ctx.fillStyle="rgba(0,0,0,.65)";
            ctx.fillRect(0,0,width,height);

            ctx.textAlign="center";

            ctx.fillStyle="gold";
            ctx.font="40px Arial";
            ctx.fillText("NEW HIGH SCORE!",width/2,180);

            ctx.fillStyle="white";
            ctx.font="24px Arial";
            drawNameBoxes();

            ctx.fillText(
                "ENTER YOUR NAME",
                width/2,
                300
            );

            function drawNameBoxes(){
              //console.log("DrawBox");
              const maxLetters = 10;

              const boxW = 34;
              const boxH = 46;
              const gap = 8;

              const total =
                  maxLetters * boxW +
                  (maxLetters-1)*gap;

              let startX = width/2 - total/2;
              let y = 335;

              ctx.font = "bold 28px Consolas";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              for(let i=0;i<maxLetters;i++){

                  let x = startX + i*(boxW+gap);

                  // Glow
                  ctx.shadowBlur = 12;
                  ctx.shadowColor = "#00ff66";

                  // Background
                  ctx.fillStyle = "#111";
                  ctx.fillRect(x,y,boxW,boxH);

                  // Border
                  ctx.lineWidth = 2;
                  ctx.strokeStyle = "#00ff66";
                  ctx.strokeRect(x,y,boxW,boxH);

                  // Letter
                  ctx.shadowBlur = 0;

                  let ch="";

                  if(i<game.ui.playerName.length)
                      ch=game.ui.playerName[i];

                  else if(
                      i===game.ui.playerName.length &&
                      game.ui.cursorVisible
                  )
                      ch="_";

                  ctx.fillStyle="white";

                  ctx.fillText(
                      ch,
                      x+boxW/2,
                      y+boxH/2+1
                  );
              }

          }

            ctx.font="20px Arial";

            ctx.fillStyle="gray";

            ctx.fillText(
                "Press ENTER",
                width/2,
                420
            );

            break;
        }

    ctx.textAlign = "left";
}


function drawHighScores(){

    const x = 110;
    const y = 120;
    const w = 380;
    const rowHeight = 30;
    const headerHeight = 55;
    const bottomMargin = 20;
    const h =
    headerHeight +
    game.highScores.length * rowHeight +
    bottomMargin;
    //-------------------------
    // Panel
    //-------------------------

    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.strokeStyle = "gold";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(x,y,w,h,12);
    ctx.fill();
    ctx.stroke();

    //-------------------------
    // Title
    //-------------------------

    ctx.shadowBlur = 18;
    ctx.shadowColor = "gold";

    ctx.fillStyle = "gold";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";

    ctx.fillText("HIGH SCORES",x+w/2,y+35);

    ctx.shadowBlur = 0;

    //-------------------------
    // Animation
    //-------------------------

    let visible = game.highScores.length;

    if(game.highScoreAnim){

        let elapsed =
            (performance.now()-game.highScoreAnim)/100;

        visible = Math.floor(elapsed);

    }

    //-------------------------
    // List
    //-------------------------

    ctx.font = "20px Consolas";
    ctx.textAlign = "left";

    for(let i=0;i<Math.min(visible,game.highScores.length);i++){

        let medal;
        let color;

        switch(i){

            case 0:
                medal="🥇";
                color="gold";
                break;

            case 1:
                medal="🥈";
                color="silver";
                break;

            case 2:
                medal="🥉";
                color="#d27d2d";
                break;

            default:
                medal=(i+1)+".";
                color="white";
        }

        ctx.fillStyle=color;

        if(i===0){

            ctx.shadowBlur=12;
            ctx.shadowColor="gold";

        }else{

            ctx.shadowBlur=0;

        }

        const yy=y+75+i*30;

        ctx.fillText(medal,140,yy);

        ctx.fillStyle="white";

        ctx.fillText(
            game.highScores[i].name,
            180,
            yy
        );

        ctx.textAlign="right";

        ctx.fillText(
            game.highScores[i].score,
            455,
            yy
        );

        ctx.textAlign="left";
    }

    ctx.restore();

}


function drawFragments(){

    for(const f of game.fragments){

        f.draw(ctx);

    }

}

function drawLogo(){

    ctx.save();

    ctx.textAlign = "left";
    ctx.font = "bold 62px Arial";

    //--------------------------------
    // Glow
    //--------------------------------

    ctx.shadowColor = "#00d4ff";
    ctx.shadowBlur = 30;

    //--------------------------------
    // Gradient
    //--------------------------------

    const g = ctx.createLinearGradient(
        0,
        170,
        0,
        250
    );

    g.addColorStop(0,"#ffffff");
    g.addColorStop(.30,"#dff7ff");
    g.addColorStop(1,"#58d8ff");

    ctx.fillStyle = g;

    //--------------------------------
    // Text Parts
    //--------------------------------

    const left  = "BR";
    const right = "CK-OUT";

    const brickSize = 36;

    const leftWidth  = ctx.measureText(left).width;
    const rightWidth = ctx.measureText(right).width;

    const totalWidth =
        leftWidth +
        brickSize +
        rightWidth;

    const startX =
        width/2 - totalWidth/2;

    const baseY = 240;

    //--------------------------------
    // Left
    //--------------------------------

    ctx.fillText(
        left,
        startX,
        baseY
    );

    //--------------------------------
    // Right
    //--------------------------------

    ctx.fillText(
        right,
        startX + leftWidth + brickSize,
        baseY
    );

    //--------------------------------
    // Brick (جای حرف I)
    //--------------------------------

    const bx = startX + leftWidth + 4;
    const by = logo.brickY;

    const body = ctx.createLinearGradient(
        bx,
        by,
        bx,
        by+34
    );
    drawBrickIcon(
        bx,
        by,
        brickSize-8,
        brickSize+8
    );

    // هایلایت بالا

    /*ctx.fillStyle = "rgba(255,255,255,.35)";

    ctx.fillRect(
        bx+2,
        by+2,
        brickSize-12,
        2
    );

    //--------------------------------
    // Outline
    //--------------------------------

    ctx.shadowBlur = 0;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#003040";

    ctx.strokeText(
        left,
        startX,
        baseY
    );

    ctx.strokeText(
        right,
        startX + leftWidth + brickSize,
        baseY
    );
    

    ctx.strokeRect(
        bx,
        by,
        brickSize-8,
        brickSize-4
    );
    */
    ctx.restore();

}

//------------------------------------------------
// Draw Brick Icon
//------------------------------------------------

function drawBrickIcon(x, y, w, h){

    ctx.save();

    //--------------------------------
    // قاب بیرونی
    //--------------------------------

    const body = ctx.createLinearGradient(
        x,
        y,
        x,
        y+h
    );

    body.addColorStop(0,"#ffb27a");
    body.addColorStop(.18,"#e95d1c");
    body.addColorStop(1,"#a52d00");

    ctx.fillStyle = body;
    ctx.fillRect(x,y,w,h);

    //--------------------------------
    // خطوط دیوار
    //--------------------------------

    const rows = 3;
    const rowH = h / rows;

    ctx.strokeStyle = "#ffd7b0";
    ctx.lineWidth = Math.max(1,w*0.02);

    ctx.beginPath();

    // خطوط افقی
    for(let r=1;r<rows;r++){

        ctx.moveTo(x,y+r*rowH);
        ctx.lineTo(x+w,y+r*rowH);

    }

    //--------------------------------
    // ردیف اول
    //--------------------------------

    for(let i=1;i<4;i++){

        let xx=x+i*w/4;

        ctx.moveTo(xx,y);
        ctx.lineTo(xx,y+rowH);

    }

    //--------------------------------
    // ردیف دوم (جابجا شده)
    //--------------------------------

    for(let i=0;i<4;i++){

        let xx=x+w/8+i*w/4;

        ctx.moveTo(xx,y+rowH);
        ctx.lineTo(xx,y+rowH*2);

    }

    //--------------------------------
    // ردیف سوم
    //--------------------------------

    for(let i=1;i<4;i++){

        let xx=x+i*w/4;

        ctx.moveTo(xx,y+rowH*2);
        ctx.lineTo(xx,y+h);

    }

    ctx.stroke();

    //--------------------------------
    // هایلایت
    //--------------------------------

    ctx.fillStyle="rgba(255,255,255,.22)";

    ctx.fillRect(
        x+w*0.03,
        y+h*0.04,
        w*0.94,
        h*0.08
    );

    //--------------------------------
    // قاب
    //--------------------------------

    ctx.strokeStyle="#6d1e00";
    ctx.lineWidth=Math.max(2,w*0.04);

    ctx.strokeRect(x,y,w,h);

    ctx.restore();

}