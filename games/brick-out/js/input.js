function createEvents(){
  canvas.addEventListener("mousemove",moveMouse);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("mousedown",mouseDown);
  window.addEventListener("keydown", highScoreKeyDown);
  canvas.addEventListener("touchstart", touchStart, {passive:false});
  canvas.addEventListener("touchmove", touchMove, {passive:false});
  document.addEventListener("visibilitychange", function(){ if(document.hidden && game.state === GameState.PLAYING) game.state = GameState.PAUSED; });
  
}

function moveMouse(event){

    if (game.state !== GameState.PLAYING &&
        game.state !== GameState.READY ) return;

    game.paddle.move(canvasX(event.clientX));
  
      
    if(game.state === GameState.READY){

        game.balls[0].x = game.paddle.x + game.paddle.w / 2;
        game.balls[0].y = game.paddle.y - game.balls[0].r;
    }
}

function keyDown(event){
  //console.log(event.code);
    playSound("button");

    if(event.code === "Space"){

        switch(game.state){

        case GameState.START:
            game.state=GameState.PLAYING;
            break;

        case GameState.GAMEOVER:
            resetGame();
            game.state=GameState.PLAYING;
            break;

        case GameState.WIN:
            resetGame();
            game.state=GameState.PLAYING;
            break;
        
        case GameState.PLAYING:
           if(game.effects.laser > 0){

                const now = performance.now();

                if(now - game.lastLaserShot > 500){

                    game.lastLaserShot = now;
                    shootLaser();

                }

            }


            break;
        
    }

    }
    if (event.code === "Escape"){
      //console.log("escape pressed");
      if (game.state === GameState.PLAYING){
        game.state = GameState.PAUSED;
        return;
      }else if (game.state === GameState.PAUSED) game.state = GameState.PLAYING;
    }

}

function shootLaser(){

    if(game.effects.laser<=0)
        return;

    const p = game.paddle;

    const leftX  = game.paddle.x + 13;
    const rightX = game.paddle.x + game.paddle.w - 13;
    console.log(leftX+" "+rightX);

    const startY = game.paddle.y - 18;

    game.lasers.push(new Laser(leftX , startY));
    createMuzzleFlash(leftX,startY);
    game.lasers.push(new Laser(rightX, startY));
    createMuzzleFlash(rightX,startY);

    playSound("laser");
    

}


function mouseDown(event){
    if (event.button !== 0) return;
    //console.log("pressed");
    if(game.state === GameState.START || game.state === GameState.READY) game.state = GameState.PLAYING;

}

function highScoreKeyDown(event){

    if(game.state !== GameState.HIGHSCORE)
        return;

    if(event.key === "Backspace"){

        event.preventDefault();

        game.ui.playerName =
            game.ui.playerName.slice(0,-1);

        return;
    }

    if(event.key === "Enter"){

        let name = game.ui.playerName.trim();

        if(name==="")
            name="PLAYER";

        addHighScore(name,game.score);

        game.state = GameState.GAMEOVER;

        return;
    }

    if(event.key.length===1 &&
       game.ui.playerName.length<10){

        game.ui.playerName +=
            event.key.toUpperCase();

    }

}


// ---------- Mobile / touch support ----------
function canvasX(clientX){
    const rect = canvas.getBoundingClientRect();
    return (clientX - rect.left) * canvas.width / rect.width;
}

function fitCanvas(){
    const scale = Math.min((window.innerWidth - 30) / canvas.width, (window.innerHeight - 80) / canvas.height, 1.4);
    canvas.style.width = Math.floor(canvas.width * scale) + "px";
    canvas.style.height = Math.floor(canvas.height * scale) + "px";
}

function touchMove(event){
    event.preventDefault();
    if (game.state !== GameState.PLAYING && game.state !== GameState.READY) return;
    game.paddle.move(canvasX(event.touches[0].clientX));
    if (game.state === GameState.READY){
        game.balls[0].x = game.paddle.x + game.paddle.w / 2;
        game.balls[0].y = game.paddle.y - game.balls[0].r;
    }
}

function touchStart(event){
    event.preventDefault();
    const x = canvasX(event.touches[0].clientX);

    switch (game.state){
        case GameState.START:
        case GameState.READY:
            game.state = GameState.PLAYING;
            break;
        case GameState.GAMEOVER:
        case GameState.WIN:
            resetGame();
            game.state = GameState.PLAYING;
            break;
        case GameState.PAUSED:
            game.state = GameState.PLAYING;
            break;
        case GameState.HIGHSCORE: {
            let name = (window.prompt("New high score! Enter your name:", "") || "PLAYER").trim().toUpperCase().slice(0, 10);
            addHighScore(name || "PLAYER", game.score);
            game.state = GameState.GAMEOVER;
            break;
        }
        case GameState.PLAYING:
            game.paddle.move(x);
            if (game.effects.laser > 0){
                const now = performance.now();
                if (now - game.lastLaserShot > 500){
                    game.lastLaserShot = now;
                    shootLaser();
                }
            }
            break;
    }
}
