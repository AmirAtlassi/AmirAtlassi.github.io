class PowerUp{

  constructor(x,y,type){
    this.x = x;
    this.y = y;
    this.w = 38;
    this.h = 18;
    this.dy = 2;
    this.type = type;
    this.alive = true;
    this.phase = Math.random() * Math.PI * 2;
    this.spawnTime = performance.now();
  }

  update(){
    this.y +=this.dy;
    //console.log(this.y);
    if (this.y >= height - this.h) this.alive = false;
  }

 draw(ctx){

    const now = performance.now();
    

    // رنگ متغیر
    const info = powerUpInfo[this.type];

    const t = (Math.sin(now / 600) + 1) / 2;

    let hue;

    if(info.hue1 <= info.hue2){

      hue = info.hue1 + (info.hue2 - info.hue1) * t;

    }else{

      // عبور از صفر درجه (مثل قرمز)
      const d = (360 - info.hue1) + info.hue2;

      hue = (info.hue1 + d * t) % 360;

    }
    // تاب خوردن
    const angle = Math.sin(now / 220 + this.phase) * 0.12;

    ctx.save();

    //-----------------------------------
    // انتقال به مرکز
    //-----------------------------------

    ctx.translate(
        this.x + this.w / 2,
        this.y + this.h / 2
    );

    ctx.rotate(angle);

    //-----------------------------------
    // Glow
    //-----------------------------------

    ctx.shadowBlur = 18;
    ctx.shadowColor = `hsl(${hue},90%,55%)`;

    //-----------------------------------
    // بدنه کپسول
    //-----------------------------------

    const g = ctx.createLinearGradient(
        0,
        -this.h/2,
        0,
        this.h/2
    );

    g.addColorStop(0,`hsl(${hue},95%,70%)`);
    g.addColorStop(.45,`hsl(${hue},90%,55%)`);
    g.addColorStop(1,`hsl(${hue},80%,35%)`);

    ctx.fillStyle = g;

    const r = this.h/2;

    ctx.beginPath();

    ctx.roundRect(
        -this.w/2,
        -this.h/2,
        this.w,
        this.h,
        r
    );

    ctx.fill();

    //-----------------------------------
    // خط دور
    //-----------------------------------

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.stroke();

    //-----------------------------------
    // Shine
    //-----------------------------------

    const shineX =
        ((now/2)%(this.w+30))-15;

    ctx.save();

    ctx.beginPath();
    ctx.roundRect(
        -this.w/2,
        -this.h/2,
        this.w,
        this.h,
        r
    );
    ctx.clip();

    ctx.translate(shineX,0);
    ctx.rotate(-0.45);

    const shine = ctx.createLinearGradient(
        -10,
        0,
        10,
        0
    );

    shine.addColorStop(0,"rgba(255,255,255,0)");
    shine.addColorStop(.5,"rgba(255,255,255,.9)");
    shine.addColorStop(1,"rgba(255,255,255,0)");

    ctx.fillStyle = shine;

    ctx.fillRect(
        -10,
        -40,
        20,
        80
    );

    ctx.restore();

    //-----------------------------------
    // آیکون
    //-----------------------------------

    ctx.shadowBlur = 0;

    ctx.fillStyle = "white";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(info.icon,0,1);

    ctx.restore();

}


  apply(){
    playSound("powerup");

    switch(this.type){

        case "expand":

            // اگر اولین بار است
            if(game.effects.expand <= 0){
                game.paddle.w += 30;
                game.paddle.w = Math.min(game.paddle.w,170);
            }

            // فقط تایمر ریست شود
            game.effects.expand = 10;

            break;


        case "life":
            playSound("lifeUp");
            game.life++;

            break;


      case "slow": {

            const amount = 3; // میزان کاهش سرعت

            for(const ball of game.balls){

                ball.changeSpeed(-amount);

                // کمتر از 3 نشود
                if(ball.s < 3){
                    ball.changeSpeed(3 - ball.s);
                }

            }

            // فقط یک بار ذخیره شود
            game.effects.slowAmount = amount;

            // تایمر
            game.effects.slow = 8;

            break;
        }


        case "fire":

            // هر بار سرعت یک واحد کم شود
            //game.ball.changeSpeed(-1);
            //game.effects.slowAmount++;

            // ولی کمتر از 3 نشود
            //if(game.ball.s < 3){
            //    game.ball.changeSpeed(3-game.ball.s);
            //}

            // تایمر
            game.effects.fire = 8;

            break;
        

        case "laser":


            game.effects.laser = 6;
            game.lastLaserShot = 0;
            break;

        case "multi":
            activateMultiBall();
            break;

    }

  }
}

function activateMultiBall(){

    const MAX_BALLS = 10;

    // اگر به سقف رسیدیم
    if(game.balls.length >= MAX_BALLS)
        return;

    const newBalls = [];

    // حداقل زاویه با افق = 15 درجه
    const min = 15 * Math.PI / 180;

    // از هر توپ موجود دو توپ جدید بساز
    for(const ball of game.balls){

        // اگر نزدیک سقف شدیم
        if(game.balls.length + newBalls.length + 2 > MAX_BALLS)
            break;

        // زاویه فعلی توپ
        const angle = Math.atan2(ball.dy, ball.dx);

        let leftAngle  = angle - Math.PI/7;
        let rightAngle = angle + Math.PI/7;

        // جلوگیری از خیلی افقی شدن توپ چپ
        if(Math.abs(Math.sin(leftAngle)) < Math.sin(min)){
            leftAngle = leftAngle > 0 ? min : -min;
        }

        // جلوگیری از خیلی افقی شدن توپ راست
        if(Math.abs(Math.sin(rightAngle)) < Math.sin(min)){
            rightAngle = rightAngle > 0 ? min : -min;
        }

        // توپ چپ
        const left = new Ball(
            ball.x,
            ball.y,
            ball.r,
            ball.s,
            Math.cos(leftAngle) * ball.s,
            Math.sin(leftAngle) * ball.s
        );

        // توپ راست
        const right = new Ball(
            ball.x,
            ball.y,
            ball.r,
            ball.s,
            Math.cos(rightAngle) * ball.s,
            Math.sin(rightAngle) * ball.s
        );

        newBalls.push(left, right);

    }

    game.balls.push(...newBalls);

    playSound("powerup");

}

function clampBallAngle(angle){

    const min = 15 * Math.PI / 180;
    const max = Math.PI - min;

    // زاویه را به بازه 0..2π ببریم
    angle = (angle + Math.PI * 2) % (Math.PI * 2);

    // نیمه بالا
    if(angle > 0 && angle < Math.PI){

        if(angle < min)
            angle = min;

        if(angle > max)
            angle = max;
    }

    // نیمه پایین
    if(angle > Math.PI){

        const lowerMin = Math.PI + min;
        const lowerMax = 2 * Math.PI - min;

        if(angle < lowerMin)
            angle = lowerMin;

        if(angle > lowerMax)
            angle = lowerMax;
    }

    return angle;
}
