function update(delta){
  //movePaddle();
  //console.log(game.ball.s);
if(game.state == GameState.START){

    updateLogo();

}
  if(game.camera.shake > 0){

    game.camera.shake *= 0.85;

    game.camera.x =
        (Math.random()-0.5) *
        game.camera.shake*4;

    game.camera.y =
        (Math.random()-0.5) *
        game.camera.shake*4;

    if(game.camera.shake < 0.3){

        game.camera.shake = 0;
        game.camera.x = 0;
        game.camera.y = 0;

    }

}
  if(game.state===GameState.HIGHSCORE){

    game.ui.cursorTimer += delta;

    if(game.ui.cursorTimer>.5){

        game.ui.cursorTimer=0;

        game.ui.cursorVisible =
            !game.ui.cursorVisible;

    }

  }
  if (game.state != GameState.PLAYING) return;
  game.speedTimer += delta;
  if (game.speedTimer >= 10){
    game.speedTimer = 0;
    for(const ball of game.balls){
        ball.changeSpeed(0.1);
    }
  }
  //game.ball.move();
  moveBall();
  updateLasers();
  updateParticles();
  updateFloatingTexts();
  updatePowerUps();
  updateBricks();
  updateFragments();
  updateEffects(delta);
  updateAutoLaser();
  //checkCollisions();
  
}

function updateLogo(){

    if(!logo.falling)
        return;

    logo.brickY += 7;

    if(logo.brickY >= logo.targetY){

        logo.brickY = logo.targetY;

        logo.falling = false;

        logo.landed = true;

        startShake(12);

        // بعداً:
        // playSound(drop)

        // createParticles()

    }

}


function updateAutoLaser(){
    if (game.state !== GameState.PLAYING || !(game.effects.laser > 0)) return;
    const now = performance.now();
    if (now - game.lastLaserShot >= 500){
        game.lastLaserShot = now;
        shootLaser();
    }
}

function updateLasers(){

    for(let i = game.lasers.length - 1; i >= 0; i--){

        const laser = game.lasers[i];

        laser.update();

        //----------------------------------
        // از صفحه خارج شد
        //----------------------------------

        if(laser.y < 0){

            game.lasers.splice(i,1);
            continue;

        }

        //----------------------------------
        // برخورد با آجر
        //----------------------------------

        if(checkLaserCollision(laser,i))
            continue;

    }

}

function checkLaserCollision(laser,index){

    for(const brick of game.bricks){

        if(brick.state != brickState.NORMAL)
            continue;

        if(
            laser.x >= brick.x &&
            laser.x <= brick.x + brick.w &&
            laser.y >= brick.y &&
            laser.y <= brick.y + brick.h
        ){

            //----------------------------------
            // آسیب به آجر
            //----------------------------------

            game.score += brick.hit(
                laser.x,
                laser.y
            );

            //----------------------------------
            // حذف لیزر
            //----------------------------------

            game.lasers.splice(index,1);

            //----------------------------------
            // صدا
            //----------------------------------

            playSound("brick");

            return true;

        }

    }

    return false;

}

function updateParticles(){
  for (let i = game.particles.length-1; i >= 0; i--){
    let p = game.particles[i];
    p.update();
    if (p.life <=0){
      game.particles.splice(i,1);
    }
  }

}

function updateFloatingTexts(){

    for(
        let i = game.floatingTexts.length-1;
        i>=0;
        i--
    ){

        game.floatingTexts[i].update();

        if(game.floatingTexts[i].dead){

            game.floatingTexts.splice(i,1);

        }

    }

}


function updatePowerUps(){
  for(let i = game.powerUps.length - 1; i >= 0; i--){
    let p = game.powerUps[i];
    p.update();
    if (p.y+p.h >= game.paddle.y && p.x+p.w >= game.paddle.x && p.x <= game.paddle.x+game.paddle.w && p.y <= game.paddle.y+game.paddle.h){
      p.apply();
      p.alive = false;
    }
    if(!p.alive){
      game.powerUps.splice(i,1);
    }
  }
}


function updateBricks(){

    let finished = true;

    for(const brick of game.bricks){

        brick.update();

        if(
            !brick.solid &&
            brick.state != brickState.DEAD
        ){
            finished = false;
        }

    }

    if(finished){

        nextLevel();

    }

}

function updateFragments(){

    for(let i = game.fragments.length - 1; i >= 0; i--){

        game.fragments[i].update();

        if(game.fragments[i].dead){

            game.fragments.splice(i,1);

        }

    }

}


function updateEffects(delta){

    // ---------- Expand ----------

    if(game.effects.expand > 0){

        game.effects.expand -= delta;

        if(game.effects.expand <= 0){

            game.effects.expand = 0;
            game.paddle.w -= 30;

        }

    }


    // ---------- Slow ----------

    if(game.effects.slow > 0){

        game.effects.slow -= delta;

        if(game.effects.slow <= 0){

            game.effects.slow = 0;

            // سرعت برگردد
            //console.log("slow Amount: "+game.effects.slowAmount);
            for(const ball of game.balls){
                ball.changeSpeed(game.effects.slowAmount);
            }
            game.effects.slowAmount = 0;

        }

    }

    if(game.effects.fire > 0){

        game.effects.fire -= delta;

        if(game.effects.fire <= 0){

            game.effects.fire = 0;

          

        }

    }


    if(game.effects.laser > 0){

        game.effects.laser -= delta;

        if(game.effects.laser <= 0){

            game.effects.laser = 0;

            

        }

    }

}
