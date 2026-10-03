class Particle{
  constructor(x,y,color,life = 40 , speed = 10){
    this.x = x;
    this.y = y;

    this.dx = (Math.random()-0.5)*speed;
    this.dy = (Math.random()-0.5)*speed;

    this.life = life;
    
    this.color = color;
    this.size = Math.random() * 3 + 2;
  }

  update(){
    this.x += this.dx;
    this.y += this.dy;

    this.dx *= 0.98;
    this.dy *= 0.98;

    this.life--;
  }

  draw(ctx){
    ctx.save();

    const g = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size * 2
    );

    g.addColorStop(0, "white");
    g.addColorStop(0.3, this.color);
    g.addColorStop(1, "transparent");

    ctx.globalAlpha = this.life / 40;
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
 }
}