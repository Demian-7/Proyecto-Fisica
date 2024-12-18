class Boss extends GameObject {

    constructor(bossCount) 
    {
      super();
      this.name = "Boss";
      this.size = 50;
      this.bossCount = bossCount;
      this.pos = createVector(WIDTH + this.size, HEIGHT / 2);
      this.vel = createVector(0, 0); // Sin velocidad inicial

      this.angle = 0;
      this.angularVelocity = 0; // Start spinning
      this.angularAcceleration = 0.5; // Acceleration for spinning
      this.spinningClockwise = true;
      this.spinTime = 0;
      this.state = 'entering'; // States: entering, spinning, shooting, resting, finalShoot, selfDestruct

      this.shootTimer = 0;
      this.shootDuration = 0;
      this.restDuration = 0;
      this.isDestroyed = false;
      this.shotsFired = 0; // Track the number of bullets fired
      this.timeBetweenShots = 0.2; // Time between each bullet
      this.projectileList = [];
      this.projectileList360 = [];
  
      // Calculate the number of bullets for this boss, capping at 20
      this.maxShots = min(5 + (bossCount - 1) * 3, 20); // Each new boss shoots 3 more bullets, capped at 20
      this.attackCycles = 0; // Number of shooting cycles
      this.maxCycles = 4; // After 4 cycles, despawn

      this.gameOver = false;
    }
  
    Render() {
      if(!this.isDestroyed && !this.gameOver){
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        stroke(255);
        strokeWeight(2);
        fill(255, 108, 20); // Green color for boss
        triangle(
          -this.size / 2, this.size / 2,
          0, -this.size / 2,
          this.size / 2, this.size / 2
        );
        pop();
      }
    }

    Update(dt){
      if (!(this.gameOver)){
        if (this.state === 'entering') {
          // console.log("Entrando en estado entering"); // Log para asegurarte de que entra
          // Interpolación para mover al jefe lentamente desde fuera de la pantalla
          let targetX = WIDTH - this.size;
          let travelTime = 0.3 // Tiempo total para desplazarse (en segundos)
          let speed = (targetX - this.pos.x) / travelTime; // Velocidad calculada en X

          this.vel.x = speed;
          this.pos.add(p5.Vector.mult(this.vel, dt));

          // Detener el movimiento al alcanzar el punto objetivo
          if (this.pos.x <= targetX + 5) {
              this.pos.x = targetX;
              this.vel.x = 0;
              this.state = 'spinning'; // Cambiar al siguiente estado
              // console.log("Cambio a estado spinning"); // Verifica el cambio de estado
          }
      } else if (this.state === 'spinning') {
        //console.log("Entrando en estado spinning"); 
        this.spinTime += dt;
        if (this.spinningClockwise) {
          this.angularVelocity += this.angularAcceleration * dt;
        } else {
          this.angularVelocity -= this.angularAcceleration * dt;
        }
        this.angle += this.angularVelocity * dt;
  
        if (this.spinTime >= 2) {
          this.spinningClockwise = !this.spinningClockwise;
          this.spinTime = 0;
  
          if (!this.spinningClockwise) {
            this.state = 'shooting';
            this.shootTimer = 0;
            this.shotsFired = 0;
            this.shootDuration = 0;
          }
        }
      } else if (this.state === 'shooting') {
        this.shootDuration += dt;
        this.shootTimer += dt;
        this.angularVelocity -= this.angularAcceleration * dt; // Increase spin speed
        this.angle += this.angularVelocity * dt;
  
        if (this.shotsFired < this.maxShots && this.shootTimer >= this.timeBetweenShots) {
          this.Shoot();
          this.shootTimer = 0; // Reset timer for next shot
          this.shotsFired++;
        }
  
        if (this.shotsFired >= this.maxShots) { // After shooting the set number of bullets, pause
          this.state = 'resting';
          this.restDuration = 0;
        }
  
      } else if (this.state === 'resting') {
        this.restDuration += dt;
        this.angularVelocity += this.angularAcceleration * dt; // Slow down spin
        this.angle += this.angularVelocity * dt;
  
        if (this.restDuration >= 2) { // Rest for 2 seconds
          this.state = 'spinning';
          this.spinningClockwise = true;
          this.spinTime = 0;
          this.attackCycles++;
  
          if (this.attackCycles >= this.maxCycles) {
            this.state = 'finalShoot';
          }
        }
      } else if (this.state === 'finalShoot') {
        // Fire 12 bullets in a 360-degree pattern
        this.Shoot360();
        this.state = 'selfDestruct';
      } else if (this.state === 'selfDestruct') {
        this.isDestroyed = true;
      }
  
      // Limit angular velocity
      this.angularVelocity = constrain(this.angularVelocity, -5, 5);
     }
     else {
      
      for (let i = this.projectileList.length -1; i>=0; i--){
        this.projectileList[i].GameIsOver();
      }
      for (let i = this.projectileList360.length -1; i>=0; i--){
        this.projectileList360[i].GameIsOver();
      }
      
     }
    }

    GameIsOver(){
      this.gameOver = true;
    }

    CheckCollition(other){
        
    }

    Shoot() {
      // Slightly offset each projectile's trajectory to create gaps
      let projType = random(['square', 'triangle']);
      let offset = random(-PI / 16, PI / 16); // Random offset between -11.25 and +11.25 degrees
      this.projectileList.push(new Projectile(this.pos.copy(), projType, offset, player));  
    }

    Shoot360() {
      // Shoot 12 bullets in a circle (360 degrees)
      let numBullets = 12 * this.bossCount;
      for (let i = 0; i < numBullets; i++) {
        let angle = map(i, 0, numBullets, 0, TWO_PI); // Distribute bullets evenly
        this.projectileList360.push(new Projectile360(this.pos.copy(), angle));
      }
    }
   
    SelfDestruct() {
      this.state = 'selfDestruct';
      this.isDestroyed = true;
    }
}