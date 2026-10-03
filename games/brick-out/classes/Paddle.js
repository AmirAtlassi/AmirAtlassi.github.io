class Paddle{

  constructor(x,y,width,height,color){
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.color = color
  }

  move(mouseX){
    this.x = mouseX - this.w / 2;
    if(this.x < 0 ) this.x = 0;
    if(this.x+this.w > width) this.x = width-this.w;
  }

  draw(ctx){
    ctx.save();

    ctx.shadowBlur = 15;
    ctx.shadowColor = "lime";

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.w,this.h);

    if(game.effects.laser > 0){

      const gunW = 10;
      const gunH = 18;

      // لوله چپ
      ctx.fillStyle = "#666";
      ctx.fillRect(this.x+8, this.y-gunH, gunW, gunH);

      ctx.fillStyle = "#aaa";
      ctx.fillRect(this.x+10, this.y-gunH+2, gunW-4, gunH-4);

      ctx.fillStyle = "#222";
      ctx.fillRect(this.x+11, this.y-gunH, gunW-6, 3);

      // لوله راست
      ctx.fillStyle = "#666";
      ctx.fillRect(this.x+this.w-18, this.y-gunH, gunW, gunH);

      ctx.fillStyle = "#aaa";
      ctx.fillRect(this.x+this.w-16, this.y-gunH+2, gunW-4, gunH-4);

      ctx.fillStyle = "#222";
      ctx.fillRect(this.x+this.w-15, this.y-gunH, gunW-6, 3);

    } 

    ctx.restore();
  }

}
