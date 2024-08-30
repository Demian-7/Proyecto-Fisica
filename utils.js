
class Proyectile{
    constructor(proyectileX, proyectileY, proyectileRad, proyectileVelX, proyectileVelY){
      this.pos= createVector(proyectileX,proyectileY);
      this.r = proyectileRad;
      this.vel = createVector(proyectileVelX,proyectileVelY);
    }


    dibujar(){
      ellipse(this.pos.x,this.pos.y,this.r);
    }
    move(velX,velY,dt){
      let velocidad = createVector(velX,velY)
      this.pos.x += velocidad.x * dt ;
      this.pos.y += velocidad.y * dt ;
      
    }
    fallAndBounce(dt,gravedad){
        this.vel.y += gravedad;
        this.pos.y += this.vel.y * dt;

          if(this.pos.y + 25 >WIDTH){
              this.vel.y = -this.vel.y *0.7;
              this.pos.y = WIDTH -25
          }
          
    }
    bulletShoot(playerY){
    if(this.pos.y == playerY){
      return true;
      }
    return false;
    }
  }
  
  //PLAYER
  class Player{
    constructor(playerX, playerY, playerW, playerH){
      this.pos = createVector(playerX,playerY);
      this.w = playerW;
      this.h = playerH;
    }
    
    
    dibujar(){
      rect(this.pos.x,this.pos.y,this.w, this.h);
    }
    move(velX,velY,dt){
      let velocidad = createVector(velX,velY)
      this.pos.x += velocidad.x * dt ;
      this.pos.y += velocidad.y * dt ;
      
    }
  }
  
  //ENEMIGOS
  class Enemy{
    constructor(enemyX, enemyY, enemyW, enemyH){
      this.pos = createVector(enemyX,enemyY);
      this.w = enemyW;
      this.h = enemyH;
    }
    
    
    dibujar(){
      rect(this.pos.x,this.pos.y,this.w, this.h);
    }
    move(velX,velY,dt){
      let velocidad = createVector(velX,velY)
      this.pos.x += velocidad.x * dt ;
      this.pos.y += velocidad.y * dt ;
      
    }
  }
  