class FloatingText{

    constructor(x,y,text,color="white"){

        this.x = x;
        this.y = y;

        this.text = text;
        this.color = color;

        this.alpha = 1;

        this.scale = 1;

        this.dy = -0.6;

        this.life = 0;

        this.dead = false;

    }

    update(){

        this.life++;

        this.y += this.dy;

        this.alpha -= 0.02;

        this.scale += 0.01;

        if(this.alpha <= 0){

            this.dead = true;

        }

    }

    draw(ctx){

        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.translate(this.x,this.y);

        ctx.scale(this.scale,this.scale);

        ctx.textAlign = "center";

        ctx.font = "bold 18px Arial";

        ctx.lineWidth = 3;

        ctx.strokeStyle = "black";

        ctx.strokeText(
            this.text,
            0,
            0
        );

        ctx.fillStyle = this.color;

        ctx.fillText(
            this.text,
            0,
            0
        );

        ctx.restore();

    }

}