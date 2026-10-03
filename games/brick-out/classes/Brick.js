const brickState = {
    NORMAL    : 0,
    BREAKING  : 1,
    SHATTER   : 2,
    DEAD      : 3
}
class Brick{
    
  constructor (x,y,w,h,type){
    this.x = x;
    this.y = y+HUD_HEIGHT;
    this.w = w;
    this.h = h;
    //console.log(x,y,w,h,type);
    this.color = type.color;
    this.score = type.score;
    this.hp = type.hp;
    this.maxHp = type.hp;
    this.solid = type.solid;
    this.alive = true;
    this.shineOffset = Math.random() * 2000;
    this.shineOffset = Math.random()*2500;
    this.nextShine = performance.now() + Math.random()*4000;
    this.cracks = [];
    this.state = brickState.NORMAL;

    this.cracks = [];

    this.breakAnim = 0;

    this.breakDuration = 900;

    this.hitX = 0;
    this.hitY = 0;
    this.shatterTimer = 0;

  }

  hit(hitX,hitY){

   //console.log("Brick hit");

    if(this.solid) {
        playSound("wall");
        return false;
    }

    playSound("brickHit");

    this.hp--;

    this.hitX = hitX;
    this.hitY = hitY;

    switch(this.hp){
      case 0:
        this.state = brickState.BREAKING;

        this.breakAnim = performance.now();

        this.generateFinalCracks(hitX,hitY);

        const type = randomType();
        if(type){
          game.powerUps.push(new PowerUp(this.x+this.w/2,this.y,type));
        }
        game.floatingTexts.push(

            new FloatingText(

                this.x + this.w/2,

                this.y,

                "+" + this.score*(game.combo+1),

                "gold"

            )

        );

        return this.score;

       default:
          this.generateFractures(hitX,hitY);
          //this.color = hpColor[this.hp];
          return 0;

    }
  }

  

generateCracks(){
    
}

update(){

    //--------------------------------------
    // رشد ترک‌ها
    //--------------------------------------

    let finished = true;
    if(this.state == brickState.NORMAL && this.cracks.length == 0)
    return;

    for(const crack of this.cracks){

        if(crack.progress < 1){

            crack.progress += 0.04;

            if(crack.progress > 1)
                crack.progress = 1;

        }

        if(crack.progress < 1)
            finished = false;

    }

    //--------------------------------------
    // فقط آجرهای در حال شکستن
    //--------------------------------------

    //-------------------------
// مرحله ترک خوردن
//-------------------------

if(this.state == brickState.BREAKING){

    if(!finished)
        return;

    this.state = brickState.SHATTER;
    this.shatterTimer = performance.now();
    return;
}


//----------------------------
// مرحله خرد شدن
//--------------------------------------

    if(this.state == brickState.SHATTER){

        if(performance.now() - this.shatterTimer > 120){
            playSound("brickBreak");


            createBrickExplosion(
                this.x + this.w/2,
                this.y + this.h/2,
                this.color
            );

            createBrickFragments(this);

            this.alive = false;
            this.state = brickState.DEAD;

            //if(allBricksDestroyed()) nextLevel();

        }

    }
    //--------------------------------------
    // مرحله بعد
    //--------------------------------------

    

}


generateFractures(hitX, hitY){

    const cx = Math.max(2, Math.min(this.w-2, hitX-this.x));
    const cy = Math.max(2, Math.min(this.h-2, hitY-this.y));

    //--------------------------------------
    // جهت اصلی (برعکس جهت ضربه)
    //--------------------------------------

    const baseAngle =
        Math.atan2(
            hitY-(this.y+this.h/2),
            hitX-(this.x+this.w/2)
        ) + Math.PI;

    //--------------------------------------
    // تعداد شاخه ها
    //--------------------------------------

    const branches = 5 + Math.floor(Math.random()*3);

    //--------------------------------------
    // مخروط انتشار
    //--------------------------------------

    const spread = Math.PI/2;

    for(let i=0;i<branches;i++){

        //----------------------------------
        // زاویه اولیه شاخه
        //----------------------------------

        const ratio =
            branches==1 ? 0.5 : i/(branches-1);

        let currentAngle =
            baseAngle +
            (ratio-0.5)*spread;

        currentAngle +=
            (Math.random()-0.5)*0.18;

        //----------------------------------
        // شروع شاخه
        //----------------------------------

        let px = cx;
        let py = cy;

        const points=[];

        points.push({
            x:px,
            y:py
        });

        

        //----------------------------------
        // طول شاخه
        //----------------------------------

        const maxSegments =
            16 + Math.floor(Math.random()*6);

        for(let j=0;j<maxSegments;j++){



            //----------------------------------
            // پیچش آرام
            //----------------------------------

            currentAngle +=
                (Math.random()-0.5)*0.12;

            const step =
                2 + Math.random()*3;

            px += Math.cos(currentAngle)*step;
            py += Math.sin(currentAngle)*step;

            //------------------------------
// شاخه فرعی
//------------------------------

            if(
                j>1 &&
                Math.random()<0.30
            ){

                const branchAngle =
                    currentAngle +
                    (Math.random()<0.5 ? -1 : 1) *
                    (0.5 + Math.random()*0.4);

                const branchPoints=[];

                branchPoints.push({
                    x:px,
                    y:py
                });

                let bx = px;
                let by = py;

                let angle = branchAngle;

                const branchSegments =
                    1 + Math.floor(Math.random()*2);

                for(let k=0;k<branchSegments;k++){

                    angle += (Math.random()-0.5)*0.15;

                    const step =
                        2 + Math.random()*2;

                    bx += Math.cos(angle)*step;
                    by += Math.sin(angle)*step;

                    bx = Math.max(2,Math.min(this.w-2,bx));
                    by = Math.max(2,Math.min(this.h-2,by));

                    branchPoints.push({
                        x:bx,
                        y:by
                    });

                }

                this.cracks.push({

                    points:branchPoints,

                    progress:0,

                    width:0.8

                });

            }

            //----------------------------------
            // اگر به لبه خورد متوقف شود
            //----------------------------------

            let hitBorder=false;

            if(px<2){
                px=2;
                hitBorder=true;
            }

            if(px>this.w-2){
                px=this.w-2;
                hitBorder=true;
            }

            if(py<2){
                py=2;
                hitBorder=true;
            }

            if(py>this.h-2){
                py=this.h-2;
                hitBorder=true;
            }

            points.push({
                x:px,
                y:py
            });

            if(hitBorder)
                break;

        }

        //----------------------------------
        // ذخیره شاخه
        //----------------------------------

        this.cracks.push({

            points:points,

            progress:0,

            width:1.2+Math.random()*0.8

        });

    }

}

generateFinalCracks(hitX, hitY){

    this.generateFractures(hitX, hitY);

}

  
draw(ctx){

    switch(this.state){

        case brickState.NORMAL:

            this.drawNormal(ctx);
            break;

        case brickState.BREAKING:

            this.drawBreaking(ctx);
            break;

    }

}

  

 drawNormal(ctx){

    ctx.save();

    //------------------ بدنه آجر ------------------

    let body = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x,
        this.y + this.h
    );

    body.addColorStop(0,"white");
    body.addColorStop(0.12,this.color);
    body.addColorStop(1,this.color);

    ctx.fillStyle = body;
    ctx.fillRect(this.x,this.y,this.w,this.h);


    //------------------ سایه پایین ------------------

    let dark = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x,
        this.y+this.h
    );

    dark.addColorStop(0,"rgba(0,0,0,0)");
    dark.addColorStop(1,"rgba(0,0,0,.28)");

    ctx.fillStyle = dark;
    ctx.fillRect(this.x,this.y,this.w,this.h);


    //------------------ برق متحرک ------------------

    const now = performance.now();

    if(this.shineStart === undefined){
        this.shineStart = now;
        this.shining = false;
    }

    // شروع برق
    if(!this.shining && now >= this.nextShine){
        this.shining = true;
        this.shineStart = now;
    }

    if(this.shining){

        // مدت برق (حدود نیم ثانیه)
        const duration = 450;

        // تقریباً دو برابر سریع‌تر از قبل
        const t = (now - this.shineStart)/duration;

        if(t>=1){

            this.shining = false;

            // دفعه بعد بین 2 تا 5 ثانیه
            this.nextShine = now + 5000+ Math.random()*5000

        }else{

            const shineWidth = this.w*0.55;

            const shineX =
                this.x-shineWidth+
                t*(this.w+shineWidth*2);

            ctx.save();

            ctx.beginPath();
            ctx.rect(this.x,this.y,this.w,this.h);
            ctx.clip();

            ctx.translate(shineX,this.y);
            ctx.rotate(-0.45);

            let shine = ctx.createLinearGradient(
                0,
                0,
                shineWidth,
                0
            );

            shine.addColorStop(0,"rgba(255,255,255,0)");
            shine.addColorStop(.25,"rgba(255,255,255,.15)");
            shine.addColorStop(.50,"rgba(255,255,255,.95)");
            shine.addColorStop(.75,"rgba(255,255,255,.15)");
            shine.addColorStop(1,"rgba(255,255,255,0)");

            ctx.fillStyle = shine;

            ctx.fillRect(
                -shineWidth,
                -this.h,
                shineWidth*2,
                this.h*4
            );

            ctx.restore();

        }
    }


    //------------------ لبه بالا ------------------

    ctx.fillStyle="rgba(255,255,255,.25)";
    ctx.fillRect(this.x+2,this.y+2,this.w-4,2);


    //------------------ ترک ------------------

    this.drawCracks(ctx);

    ctx.restore();

}

drawBreaking(ctx){

    const t =
        (performance.now()-this.breakAnim)
        /this.breakDuration;

    const alpha = 1-t;

    ctx.save();

    //ctx.globalAlpha = alpha;

    this.drawNormal(ctx);

    ctx.restore();

}

 drawCracks(ctx){

    if(this.cracks.length === 0)
        return;

    ctx.save();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for(const crack of this.cracks){

        const pts = crack.points;

        if(pts.length < 2)
            continue;

        const maxSegment =
            Math.floor((pts.length-1) * crack.progress);

        if(maxSegment <= 0)
            continue;

        for(let i=1; i<=maxSegment; i++){

            const t = i / maxSegment;

            //----------------------------------
            // ضخامت ترک
            //----------------------------------

            ctx.lineWidth =
                crack.width * (1 - t * 0.55);

            //----------------------------------
            // محو شدن نوک ترک
            //----------------------------------

            const fade =
                Math.pow(1 - t, 1.6);

            ctx.strokeStyle =
                `rgba(255,255,255,${0.95 * fade})`;

            //----------------------------------
            // رسم هر قطعه
            //----------------------------------

            ctx.beginPath();

            ctx.moveTo(
                this.x + pts[i-1].x,
                this.y + pts[i-1].y
            );

            ctx.lineTo(
                this.x + pts[i].x,
                this.y + pts[i].y
            );

            ctx.stroke();

        }

    }

    ctx.restore();

}
 /*checkCollision(ball){

    const left   = this.x;
    const right  = this.x + this.w;
    const top    = this.y;
    const bottom = this.y + this.h;

    const ballLeft   = ball.x - ball.r;
    const ballRight  = ball.x + ball.r;
    const ballTop    = ball.y - ball.r;
    const ballBottom = ball.y + ball.r;

    // اصلاً برخوردی وجود ندارد
    if (
        ballRight <= left ||
        ballLeft >= right ||
        ballBottom <= top ||
        ballTop >= bottom
    ){
        return null;
    }

    // اگر حرکت عمودی غالب است
    if(Math.abs(ball.dy) >= Math.abs(ball.dx)){

        if(ball.dy > 0){
            return "top";
        }else{
            return "bottom";
        }

    }

    // اگر حرکت افقی غالب است
    else{

        if(ball.dx > 0){
            return "left";
        }else{
            return "right";
        }

    }

  }*/
}