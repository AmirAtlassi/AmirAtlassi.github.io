//----------------------------------------------------
// Collision Engine V2
// Part 1
//----------------------------------------------------

//----------------------------------------------------
// Move Ball
//----------------------------------------------------

function moveBall(){

    // از آخر به اول برو تا حذف توپ‌ها مشکلی ایجاد نکند
    for(let b = game.balls.length - 1; b >= 0; b--){

        const ball = game.balls[b];

        let remaining = ball.s;

        //--------------------------------------
        // اگر سرعت صفر شد
        //--------------------------------------

        const length = Math.hypot(ball.dx, ball.dy);

        if(length === 0)
            continue;

        //--------------------------------------
        // بردار واحد حرکت
        //--------------------------------------

        const ux = ball.dx / length;
        const uy = ball.dy / length;

        //--------------------------------------
        // حرکت پیکسل به پیکسل
        //--------------------------------------

        while(remaining > 0){

            const step = Math.min(1, remaining);

            //----------------------------------
            // موقعیت قبلی
            //----------------------------------

            ball.prevX = ball.x;
            ball.prevY = ball.y;

            //----------------------------------
            // موقعیت بعدی
            //----------------------------------

            const nextX = ball.x + ux * step;
            const nextY = ball.y + uy * step;

            //----------------------------------
            // دیوار
            //----------------------------------

            const wall = hitWall(nextX, nextY, ball);

            if(wall){

                ball.x = nextX;
                ball.y = nextY;

                resolveWall(wall, ball);

                break;
            }

            //----------------------------------
            // راکت
            //----------------------------------

            if(hitPaddle(nextX, nextY, ball)){

                ball.x = nextX;
                ball.y = nextY;

                resolvePaddle(nextX, ball);

                break;
            }

            //----------------------------------
            // آجر
            //----------------------------------

            const brick = firstBrick(nextX, nextY, ball);

            if(brick){

                ball.x = nextX;
                ball.y = nextY;

                resolveBrick(brick, nextX, nextY, ball);

                break;
            }

            //----------------------------------
            // هیچ برخوردی نبود
            //----------------------------------

            ball.x = nextX;
            ball.y = nextY;

            remaining -= step;
        }
    }

}


//----------------------------------------------------
// Wall
//----------------------------------------------------

function hitWall(nextX,nextY,ball){

    for(const ball of game.balls){

        if(nextX-ball.r<=0)
            return "left";

        if(nextX+ball.r>=width)
            return "right";

        if(nextY-ball.r<=HUD_HEIGHT)
            return "top";

        if(nextY-ball.r>height)
            return "bottom";

        return null;
    }

}

//----------------------------------------------------

function resolveWall(side, ball){

    switch(side){

        case "left":

            ball.x = ball.r;
            ball.bounceHorizontal();
            break;

        case "right":

            ball.x = width - ball.r;
            ball.bounceHorizontal();
            break;

        case "top":

            ball.y = HUD_HEIGHT + ball.r;
            ball.bounceVertical();
            break;

        case "bottom": {

            // فقط همین توپ حذف شود
            const index = game.balls.indexOf(ball);

            if(index !== -1){
                game.balls.splice(index,1);
            }

            // هنوز توپ دیگری داریم → جان کم نشود
            if(game.balls.length > 0){
                return;
            }

            // آخرین توپ بود
            game.life--;
            playSound("lifeLost");
            startShake(15);
            game.state = GameState.READY;
            if(game.life <= 0){

                if(isHighScore(game.score)){

                    game.ui.playerName = "";
                    game.state = GameState.HIGHSCORE;

                }else{
                    game.powerUps = [];

                    game.state = GameState.GAMEOVER;
                    game.highScoreAnim = performance.now();

                }

                return;
            }

            // یک توپ جدید بساز
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

            return;
        }

    }

}

//----------------------------------------------------
// Paddle
//----------------------------------------------------

function hitPaddle(nextX, nextY, ball){

    const paddle = game.paddle;

    // فقط وقتی توپ رو به پایین حرکت می‌کند
    if(ball.dy <= 0)
        return false;

    // هنوز به راکت نرسیده
    if(nextY + ball.r < paddle.y)
        return false;

    // از راکت عبور کرده
    if(nextY - ball.r > paddle.y + paddle.h)
        return false;

    // خارج از محدوده افقی راکت
    if(nextX < paddle.x)
        return false;

    if(nextX > paddle.x + paddle.w)
        return false;

    return true;

}

//----------------------------------------------------

function resolvePaddle(nextX, ball){

    const paddle = game.paddle;

    // کمبو ریست شود
    game.combo = 0;

    // توپ دقیقاً روی راکت قرار بگیرد
    ball.y = paddle.y - ball.r;

    // مرکز راکت
    const center = paddle.x + paddle.w / 2;

    // نسبت برخورد
    let ratio = (nextX - center) / (paddle.w / 2);

    ratio = Math.max(-0.95, Math.min(0.95, ratio));

    // سرعت افقی
    ball.dx = ratio * ball.s;

    // سرعت عمودی
    ball.dy = -Math.sqrt(ball.s * ball.s - ball.dx * ball.dx);

}

//----------------------------------------------------
// Brick
//----------------------------------------------------

function firstBrick(nextX,nextY,ball){

    for(const ball of game.balls){

        for(const brick of game.bricks){

            if(brick.state != brickState.NORMAL)
                continue;

            if(
                nextX + ball.r >= brick.x &&
                nextX - ball.r <= brick.x + brick.w &&
                nextY + ball.r >= brick.y &&
                nextY - ball.r <= brick.y + brick.h
            ){
                return brick;
            }

        }
    }

    return null;

}

//----------------------------------------------------

//----------------------------------------------------
// Resolve Brick
//----------------------------------------------------

function resolveBrick(brick,nextX,nextY,ball){

    let side;
    let hitX;
    let hitY;

    //--------------------------------------------------
    // تشخیص جهت ورود توپ
    //--------------------------------------------------

    if(ball.prevY + ball.r <= brick.y){

        side = "top";

    }
    else if(ball.prevY - ball.r >= brick.y + brick.h){

        side = "bottom";

    }
    else if(ball.prevX + ball.r <= brick.x){

        side = "left";

    }
    else if(ball.prevX - ball.r >= brick.x + brick.w){

        side = "right";

    }
    else{

        //--------------------------------------------------
        // برخورد گوشه
        //--------------------------------------------------

        if(Math.abs(ball.dx) >= Math.abs(ball.dy)){

            if(ball.dx > 0)
                side = "left";
            else
                side = "right";

        }else{

            if(ball.dy > 0)
                side = "top";
            else
                side = "bottom";

        }

    }

    //--------------------------------------------------
    // اصلاح محل توپ
    //--------------------------------------------------

    switch(side){

        case "left":

            ball.x = brick.x - ball.r;

            if(game.effects.fire <= 0 || brick.solid){
                ball.bounceHorizontal();
            }

            hitX = brick.x;
            hitY = ball.y;

            break;

        case "right":

            ball.x = brick.x + brick.w + ball.r;

            if(game.effects.fire <= 0 || brick.solid){
                ball.bounceHorizontal();
            }

            hitX = brick.x + brick.w;
            hitY = ball.y;

            break;

        case "top":

            ball.y = brick.y - ball.r;

            if(game.effects.fire <= 0 || brick.solid){
                ball.bounceVertical();
            }

            hitX = ball.x;
            hitY = brick.y;

            break;

        case "bottom":

            ball.y = brick.y + brick.h + ball.r;

            if(game.effects.fire <= 0 || brick.solid){
                ball.bounceVertical();
            }

            hitX = ball.x;
            hitY = brick.y + brick.h;

            break;

    }

    //--------------------------------------------------
    // آسیب به آجر
    //--------------------------------------------------

    game.score += brick.hit(hitX,hitY) * (game.combo+1);

    if(game.effects.fire <= 0 && game.effects.laser <= 0){
        game.combo++;
    }

    //--------------------------------------------------
    // انفجار (اختیاری)
    //--------------------------------------------------

    /*
    if(brick.state == brickState.BREAKING){
        createBrickFragments(brick);
    }
    */

}



//----------------------------------------------------
// All Bricks Destroyed
//----------------------------------------------------

function allBricksDestroyed(){

    for(const brick of game.bricks){

        if(
            brick.state != brickState.DEAD &&
            !brick.solid
        ){
            return false;
        }

    }

    return true;

}

//----------------------------------------------------
// Brick Explosion
//----------------------------------------------------

function createBrickExplosion(x, y, color){

    const count = 20;

    for(let i = 0; i < count; i++){

        game.particles.push(
            new Particle(
                x,
                y,
                color
            )
        );

    }

}
