//----------------------------------------------------
// Brick Fragments
//----------------------------------------------------

class BrickFragment{

    constructor(x,y,w,h,color,dx,dy){

        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.dx = dx;
        this.dy = dy;

        this.color = color;

        this.angle = 0;

        this.rotation =
            (Math.random()-0.5)*0.35;

        this.alpha = 1;

        this.life = 45;

    }

    update(){

        this.x += this.dx;
        this.y += this.dy;

        this.dy += 0.12;      // gravity

        this.angle += this.rotation;

        this.life--;

        this.alpha = this.life/45;

    }

    draw(ctx){

        ctx.save();

        ctx.translate(
            this.x + this.w/2,
            this.y + this.h/2
        );

        ctx.rotate(this.angle);

        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;

        ctx.fillRect(
            -this.w/2,
            -this.h/2,
            this.w,
            this.h
        );

        ctx.restore();

    }

    get dead(){

        return this.life<=0;

    }

}

//----------------------------------------------------
// Create Brick Fragments
//----------------------------------------------------






function createBrickFragments(brick){

    const cols = 2;
    const rows = 2;

    const pieceW = brick.w/cols;
    const pieceH = brick.h/rows;

    for(let r=0;r<rows;r++){

        for(let c=0;c<cols;c++){

            const x =
                brick.x + c*pieceW;

            const y =
                brick.y + r*pieceH;

            const dx =
                (c-0.5)*2 +
                (Math.random()-0.5);

            const dy =
                (r-0.5)*2 +
                (Math.random()-0.5)-2;

            game.fragments.push(

                new BrickFragment(

                    x,
                    y,

                    pieceW,
                    pieceH,

                    brick.color,

                    dx,
                    dy

                )

            );

        }

    }

}

function createMuzzleFlash(x, y){

    for(let i = 0; i < 10; i++){

        const p = new Particle(
            x,
            y,
            "yellow",
            10,
            4
        );

        // جهت رو به بالا
        const angle =
            (-90 + (Math.random()-0.5)*35) * Math.PI / 180;

        const speed = 2 + Math.random()*3;

        p.dx = Math.cos(angle) * speed;
        p.dy = Math.sin(angle) * speed;

        game.particles.push(p);

    }

}