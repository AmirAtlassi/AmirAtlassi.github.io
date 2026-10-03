class Ball{
    constructor(x,y,radius,speed,dx,dy){
      this.x = x;
      this.y = y;
      this.r = radius;
      this.s = speed;
      this.dx = dx;
      this.dy = dy;
      this.trail = [];

    }

    move(){
      this.oldX = this.x;
      this.oldY = this.y;
      //console.log(this.x+" "+this.y);
      this.trail.push({
        x:this.x,
        y:this.y,
        life:1
      });
      //if(this.x === NaN || this.y === NaN) console.log("problrm here!")
      if (this.trail.length > 12 ) this.trail.shift();

      this.x += this.dx;
      this.y += this.dy;

      if (isNaN(this.x) || isNaN(this.y)) {
        //console.log("Position became NaN"+ this.dx +" "+ this.dy);
        //debugger;
      }
    }

   draw(ctx){
  

    if(this.trail.length === 0){

        ctx.save();

        ctx.shadowBlur = 20;
        ctx.shadowColor = "red";
        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();

        ctx.restore();

        return;
     }

  
      ctx.save();

      
      ctx.beginPath();
      for (let i = 0; i < this.trail.length; i++ ){
        let t = this.trail[i];
        let alpha = (i + 1) / this.trail.length;
        let r = this.r * alpha;
        //console.log(t.x+" "+t.y+" "+r+" "+alpha+" "+this.trail.length+" "+i);
        
        let g = ctx.createRadialGradient(
        t.x,t.y,0,
        t.x,t.y,r*2
        );

        g.addColorStop(0,"white");
        g.addColorStop(0.3,"#ff5050");
        g.addColorStop(1,"transparent");
      


        ctx.beginPath();
        ctx.fillStyle = g //`rgba(255,80,80,${alpha*0.5})`;
        ctx.arc(t.x,t.y,r,0,Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 20;
      ctx.shadowColor = "red";

      ctx.fillStyle = "white";

      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();

      ctx.restore();
     
  
    }

    reset(){
      this.x = game.paddle.x + game.paddle.w / 2;
      this.y = game.paddle.y - this.r;
      this.s = game.baseBallSpeed;
      this.dx = 3;
      this.dy = -4;
      let len = Math.hypot(this.dx, this.dy);
      this.trail = [];

      this.dx = this.dx / len * this.s;
      this.dy = this.dy / len * this.s;

      //game.life --;
      if (game.life === 0) {
        game.baseBallSpeed = 5;
        for(const ball of game.balls){
          this.s = 5;
          this.changeSpeed(0);
        }
        //game.ball.reset();
        if(isHighScore(game.score)){
          game.ui.playerName = "";
          game.state = GameState.HIGHSCORE;    
        } else {
        game.state = GameState.GAMEOVER;
        game.highScoreAnim = performance.now();
        }
      } else {

        game.state = GameState.READY;
      }    
      
    }

    bounceVertical(){
      this.dy *= -1;
    }

    bounceHorizontal(){
      this.dx *= -1;
    }

    changeSpeed(delta){
      //console.log(delta);
      this.s += delta; 
      //if (isNaN(this.s)) {
        //console.log(delta);
        //debugger;
      //}
      this.s = Math.max(3,Math.min(maxSpeed,this.s));
      let angle = Math.atan2(this.dy,this.dx);
      this.dx = Math.cos(angle) * this.s;
      this.dy = Math.sin(angle) * this.s;

    }
  }
