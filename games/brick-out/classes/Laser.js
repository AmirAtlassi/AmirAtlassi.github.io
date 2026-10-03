
class Laser{

    constructor(x,y){
        console.log(x+" "+y)

        this.x = x;
        this.y = y;

        this.w = 4;
        this.h = 18;

        this.speed = 12;

        this.dead = false;

    }

    update(){

        this.y -= this.speed;

        if(this.y + this.h < 0){
            this.dead = true;
        }

    }

    draw(){

        ctx.save();

        ctx.fillStyle = "red";

        ctx.fillRect(
            this.x-this.w/2,
            this.y,
            this.w,
            this.h
        );

        ctx.restore();

    }

}