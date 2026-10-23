var lb=document.getElementById('lb'),li=lb.querySelector('img'),previousFocus;
function closePreview(){lb.style.display='none';document.body.style.overflow='';if(previousFocus)previousFocus.focus()}
document.querySelectorAll('[data-zoom]').forEach(function(i){
 i.tabIndex=0;i.setAttribute('role','button');i.setAttribute('aria-label','Enlarge: '+i.alt);
 function openPreview(){previousFocus=document.activeElement;li.src=i.dataset.full||i.src;li.alt=i.alt;lb.style.display='flex';document.body.style.overflow='hidden';document.getElementById('lbClose').focus()}
 i.onclick=openPreview;i.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openPreview()}};
});
lb.onclick=closePreview;
lb.onkeydown=function(e){if(e.key==='Escape')closePreview();if(e.key==='Tab'){e.preventDefault();document.getElementById('lbClose').focus()}};

document.getElementById('playBtn').onclick=function(){
 var frame=document.getElementById('frame');
 if(frame.querySelector('iframe')){frame.querySelector('iframe').focus();return}
 var game=document.createElement('iframe');game.src='games/brick-out/index.html';game.title='Brick-Out';game.allow='autoplay';
 frame.replaceChildren(game);this.textContent='Game loaded — focus to play';game.focus();
};

if ('IntersectionObserver' in window) {
 var hero=document.querySelector('header');
 new IntersectionObserver(function(entries){
  hero.querySelectorAll('.scene-signal,.scene-spark').forEach(function(node){node.style.animationPlayState=entries[0].isIntersecting?'running':'paused'});
 }).observe(hero);
}

// Time-based cubic Bezier flights; each visit enters and leaves at the left edge.
(function(){
 var area=document.querySelector('.bird-airspace'),bird=area.querySelector('button'),sprite=bird.querySelector('img'),birdHero=document.querySelector('header');
 function playMode(){return birdHero.dataset.world==='play'}
 var normal='assets/bird/bird_normal.png',flap='assets/bird/bird_flap.png',clash='assets/bird/bird_clash.png';
 [normal,flap,clash].forEach(function(src){var image=new Image();image.src=src});
 var motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 var segments=[],index=0,elapsed=0,last=0,request=0,wait=0,hitUntil=0,visible=true,total=0,currentSource='',heading=0,facing=1;
 function random(a,b){return a+Math.random()*(b-a)}
 function image(src){if(currentSource!==src){sprite.src=src;bird.dataset.pose=src===clash?'clash':'flight';currentSource=src}}
 function build(){
  var w=area.clientWidth,size=bird.offsetWidth,h=Math.max(10,area.clientHeight-size),far=Math.max(20,w-size-12);
  function y(){return random(5,h)}
  var points=[{x:-size-10,y:y()},{x:far*.32,y:y()},{x:far*.7,y:y()},{x:far,y:y()},{x:far*.65,y:y()},{x:far*.3,y:y()},{x:-size-10,y:y()}];
  segments=[];
  for(var i=0;i<points.length-1;i++){
   var a=points[i],b=points[i+1],dx=b.x-a.x;
   segments.push({a:a,b:b,c:{x:a.x+dx*.35,y:a.y},d:{x:a.x+dx*.7,y:b.y},duration:Math.max(1500,Math.abs(dx)/85*1000)});
  }
  index=0;elapsed=0;wait=0;
 }
 function point(s,t){var u=1-t;return {x:u*u*u*s.a.x+3*u*u*t*s.c.x+3*u*t*t*s.d.x+t*t*t*s.b.x,y:u*u*u*s.a.y+3*u*u*t*s.c.y+3*u*t*t*s.d.y+t*t*t*s.b.y}}
 function frame(now){
  request=0;
  if(!playMode()||!visible||document.hidden||motion.matches){last=0;return}
  var delta=last?Math.min(now-last,60):0;last=now;
  if(now<hitUntil){image(clash);request=requestAnimationFrame(frame);return}
  total+=delta;
  if(wait>0){wait-=delta;if(wait<=0)build()}
  else{
   var seg=segments[index];elapsed+=delta;
   var t=Math.min(1,elapsed/seg.duration),p=point(seg,t),u=1-t;
   var dx=3*u*u*(seg.c.x-seg.a.x)+6*u*t*(seg.d.x-seg.c.x)+3*t*t*(seg.b.x-seg.d.x);
   var dy=3*u*u*(seg.c.y-seg.a.y)+6*u*t*(seg.d.y-seg.c.y)+3*t*t*(seg.b.y-seg.d.y);
   var face=dx>=0?1:-1,angle=Math.max(-22,Math.min(22,Math.atan2(dy,Math.abs(dx))*180/Math.PI));
   var blend=1-Math.exp(-delta/100);
   heading+=(angle*face-heading)*blend;facing+=(face-facing)*blend;
   bird.style.transform='translate('+p.x+'px,'+p.y+'px) rotate('+heading+'deg) scaleX('+facing+')';
   if(t===1){elapsed=0;index++;if(index===segments.length){wait=random(1200,3000)}}
  }
  image(now<hitUntil?clash:(Math.floor(total/125)%2?flap:normal));
  request=requestAnimationFrame(frame);
 }
 function start(){if(playMode()&&!request&&!motion.matches&&visible&&!document.hidden){last=0;request=requestAnimationFrame(frame)}}
 bird.addEventListener('click',function(){
  hitUntil=performance.now()+600;image(clash);
  // Restore even while motion is paused or reduced motion is enabled.
  setTimeout(function(){if(performance.now()>=hitUntil)image(normal)},620);
 });
 // Keyboard focus holds the bird still so the target remains easy to activate.
 bird.addEventListener('focus',function(){if(bird.matches(':focus-visible')){if(request)cancelAnimationFrame(request);request=0;last=0}});
 bird.addEventListener('blur',start);
 function reset(){build();if(motion.matches){if(request)cancelAnimationFrame(request);request=0;bird.style.transform='translate('+Math.max(8,area.clientWidth-bird.offsetWidth-24)+'px,40px)';image(normal)}else start()}
 if('IntersectionObserver' in window)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;if(visible)start();else{if(request)cancelAnimationFrame(request);request=0;last=0}}).observe(area);
 document.addEventListener('visibilitychange',function(){if(document.hidden){if(request)cancelAnimationFrame(request);request=0;last=0}else start()});
 function modeChanged(){
  var enabled=playMode();area.inert=!enabled;area.setAttribute('aria-hidden',String(!enabled));
  if(request)cancelAnimationFrame(request);request=0;last=0;hitUntil=0;
  if(enabled){heading=0;facing=1;reset()}
 }
 birdHero.addEventListener('worldchange',modeChanged);
 window.addEventListener('resize',reset);motion.addEventListener('change',reset);modeChanged();
})();

// Tilt follows the pointer; leaving clears all tilt so each button settles flat.
(function(){
 var fine=window.matchMedia('(hover: hover) and (pointer: fine)'),reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.btn').forEach(function(button){
  button.addEventListener('pointermove',function(event){
   if(!fine.matches||reduced.matches)return;
   var bounds=button.getBoundingClientRect();
   var x=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
   var y=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
   button.style.setProperty('--tilt-x',(-y*7).toFixed(2)+'deg');
   button.style.setProperty('--tilt-y',(x*9).toFixed(2)+'deg');
  });
  function settle(){button.style.removeProperty('--tilt-x');button.style.removeProperty('--tilt-y')}
  button.addEventListener('pointerleave',settle);button.addEventListener('pointercancel',settle);button.addEventListener('blur',settle);
 });
})();

// A poster overlay starts native playback only on demand.
document.querySelectorAll('.demo-media').forEach(function(media){
 var video=media.querySelector('video'),button=media.querySelector('.demo-play');
 button.addEventListener('click',function(){
  button.hidden=true;video.controls=true;
  var playing=video.play();
  if(playing&&playing.catch)playing.catch(function(){button.hidden=false});
 });
 video.addEventListener('play',function(){button.hidden=true});
 video.addEventListener('ended',function(){button.hidden=false});
 video.addEventListener('error',function(){button.hidden=false});
});

// Lightweight pointer lighting; only the active surface is updated per frame.
(function(){
 var fine=window.matchMedia('(hover: hover) and (pointer: fine)'),reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.feature,.card,.box').forEach(function(surface){
  var pending=0,lastX=0,lastY=0;
  surface.addEventListener('pointermove',function(event){
   if(!fine.matches||reduced.matches)return;
   lastX=event.clientX;lastY=event.clientY;
   if(pending)return;
   pending=requestAnimationFrame(function(){
    pending=0;var bounds=surface.getBoundingClientRect(),x=lastX-bounds.left,y=lastY-bounds.top;
    surface.style.setProperty('--spot-x',x+'px');surface.style.setProperty('--spot-y',y+'px');
    surface.style.setProperty('--image-rx',((.5-y/bounds.height)*3).toFixed(2)+'deg');
    surface.style.setProperty('--image-ry',((x/bounds.width-.5)*4).toFixed(2)+'deg');
   });
  });
  function reset(){if(pending)cancelAnimationFrame(pending);pending=0;surface.style.removeProperty('--image-rx');surface.style.removeProperty('--image-ry')}
  surface.addEventListener('pointerleave',reset);surface.addEventListener('pointercancel',reset);
 });
})();

// Three deliberate modes: no automatic switching while the visitor is reading.
(function(){
 var hero=document.querySelector('header'),choices=hero.querySelectorAll('[data-world-choice]'),panels=hero.querySelectorAll('[data-world-panel]'),caption=document.getElementById('world-caption');
 var words={industry:'Where coordination meets complexity.',code:'Turn repetitive work into a repeatable result.',play:'Build a world worth getting lost in.'};
 choices.forEach(function(button){button.addEventListener('click',function(){
  var world=button.dataset.worldChoice;hero.dataset.world=world;
  choices.forEach(function(choice){choice.setAttribute('aria-pressed',String(choice===button))});
  panels.forEach(function(panel){var active=panel.dataset.worldPanel===world;panel.setAttribute('aria-hidden',String(!active));panel.inert=!active});
  caption.textContent=words[world];hero.dispatchEvent(new Event('worldchange'));
 })});
 var viewport=hero.querySelector('.world-viewport'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),pending=0,x=0,y=0;
 viewport.addEventListener('pointermove',function(event){
  if(event.pointerType==='touch'||reduced.matches)return;
  var r=viewport.getBoundingClientRect();x=(event.clientX-r.left-r.width/2)/r.width*14;y=(event.clientY-r.top-r.height/2)/r.height*10;
  if(!pending)pending=requestAnimationFrame(function(){pending=0;hero.style.setProperty('--world-mx',x+'px');hero.style.setProperty('--world-my',y+'px')});
 });
 viewport.addEventListener('pointerleave',function(){if(pending)cancelAnimationFrame(pending);pending=0;hero.style.setProperty('--world-mx','0px');hero.style.setProperty('--world-my','0px')});
 // Freeze scene effects outside the visible hero.
 if('IntersectionObserver' in window)new IntersectionObserver(function(entries){hero.querySelectorAll('.steam,.code-cursor,.report-ready,.data-transfer>span,.play-collectibles').forEach(function(el){el.style.animationPlayState=entries[0].isIntersecting?'running':'paused'})}).observe(viewport);
})();
