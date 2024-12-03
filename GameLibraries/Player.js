// PLAYER
class Player extends GameObject {
    /**
     * Constructor for the Player class.
     * Initializes the player's position, size, and speed.
     * 
     * @param {Number} playerX - The x-coordinate of the player.
     * @param {Number} playerY - The y-coordinate of the player.
     * @param {Number} playerW - The width of the player.
     * @param {Number} playerH - The height of the player.
     */
    constructor(playerX, playerY, size, mass) {
        super();
        this.name = "Player";
        this.colliderShape = ColliderShape.SQUARE;
        this.pos = createVector(playerX, playerY);
        this.w = size;
        this.h = size;
        this.size = size; //Esto es muy cabeza
        this.vel = createVector(0,0);
        this.isCircle = false;
        this.shapeChangeTime = 0;
        this.gravity = createVector(0,2000);
        this.isGliding = false; // New property for gliding state
        this.glideGravity = createVector(0, 500); // Reduced gravity when gliding
        this.jumpForce = 800;
        this.maxFallSpeed = 1000;
        this.circleSize = 20; // Smaller size for the circle form
        this.hit = false;

        this.mass = mass;
        this.gravityForce = createVector(0,mass * this.gravity.y);

        this.fallImpulse = 1.1;
        this.fallImpulseTime = 0.2;
        this.fallImpulseCount = 0;
    }

    /**
     * Renders the player on the screen as a rectangle.
     */
    Render() {
      if (!this.hit){
        fill(255, 255, 255);
        if (this.isCircle) {
          ellipse(this.pos.x, this.pos.y, this.circleSize); // Smaller circle size
        } else {
          //rectMode(CENTER);
          rect(this.pos.x, this.pos.y, this.w, this.h);
        }
        if (this.isGliding){
            this.DrawWings();
        }
      }
    }

    /**
     * Updates the player's position based on speed and delta time.
     * 
     * @param {Number} dt - Delta time used for updating the player's position.
     */
    Update(dt) {
      this.fallImpulseCount += dt;        
      if (!this.hit){
        let gravityStep;
        if (this.isGliding){
            gravityStep = p5.Vector.mult(this.glideGravity, dt); 
        }
        else {
            gravityStep = p5.Vector.mult(this.gravityForce, dt);
        }
        this.vel.add(gravityStep);
        
        // Limit fall speed
        if (this.vel.y > this.maxFallSpeed) {
            this.vel.y = this.maxFallSpeed;
        }

        // Update position
        let velocityStep = p5.Vector.mult(this.vel, dt);
        this.pos.add(velocityStep);

        if (this.OnGround()){
            this.isGliding = false;
        }

        // Shape change duration
        if (this.shapeChangeTime > 0 && (millis() - this.shapeChangeTime) > 5000) {
            this.isCircle = false;
            this.size = 40; // Reset to original square size after 5 seconds
            this.shapeChangeTime = 0;
        }
        // Ground collision 
        if (!(this.isCircle)){
            this.pos.y = constrain(this.pos.y, 0, HEIGHT -this.size);
        }
        else{
          this.pos.y = constrain(this.pos.y, 0, HEIGHT -this.size/2);
        }
      }
    }

    //Salto
    Jump(){
        if(this.OnGround()){
          this.vel.y = -this.jumpForce;
        }
        else{
            this.StartGlide();
            //console.log("start glide");
        }
      }
    //Caida rapida
    FallFast() {
        if (!this.OnGround()) {
         
          this.vel.y = this.maxFallSpeed;
            this.fallImpulseCount = 0;
            if (this.fallImpulseCount < this.fallImpulseTime){
              this.vel.y *= this.fallImpulse;
            }
        }
      }
     
    //Groundcheck
    OnGround() {
        return this.pos.y >= HEIGHT - this.h;
      }
      //Dibujar las alas
      DrawWings() {
        fill(255, 255, 0); // Yellow color for wings
        noStroke();
        let wingSize = this.size / 2;
        let wingOffsetX = this.size / 2;
        let wingOffsetY = this.size / 4;
      
        push();
        if (this.isCircle) {
          translate(this.pos.x, this.pos.y);
        } else {
          translate(this.pos.x + this.w / 2, this.pos.y + this.h / 2);
        }
      
        // Left wing
        triangle(
          -wingOffsetX,
          0,
          -wingOffsetX - wingSize,
          -wingOffsetY,
          -wingOffsetX - wingSize,
          wingOffsetY
        );
      
        // Right wing
        triangle(
          wingOffsetX,
          0,
          wingOffsetX + wingSize,
          -wingOffsetY,
          wingOffsetX + wingSize,
          wingOffsetY
        );
        pop();
      }
    //Booleans
    StartGlide() {
        if (!this.OnGround()) {
          this.isGliding = true;
        }
      }
    StopGlide() {
        this.isGliding = false;
      }
    //Cuadrado -> Circulo
    ChangeShape() {
      console.log("change shape llamado")
        this.isCircle = true;
        this.size = this.circleSize; // Set the size to the smaller circle size
        this.shapeChangeTime = millis();
      }
    //Circulo -> Cuadrado
    Reset() {
        this.pos = createVector(playerX, playerY);
        this.vel = createVector(0, 0);
        this.isCircle = false;
        this.size = 40; // Reset to original square size
        this.shapeChangeTime = 0;
        this.isGliding = false;
      }
    //Verificar que el mouse este dentro del player
    Contains(px, py) {
        if (this.isCircle) {
          //let d = dist(px, py, this.pos.x, this.pos.y); // Cambiar por colision punto - circulo
          let x1 = this.pos.x;
          let y1 = this.pos.y;
        
          let x2 = px;
          let y2 = py;
        
          let distX = x2 - x1;
          let distY = y2 - y1;
          let distance = sqrt(distX * distX + distY * distY);

          return distance < this.circleSize / 2;
        } else {
          return (
            px > this.pos.x &&
            px < this.pos.x + this.size &&
            py > this.pos.y &&
            py < this.pos.y + this.size 
          );
        }
    }

    GameOver(){
      return this.hit;
    }

    // Reset() {
    //   this.pos = createVector(100, 100);
    //   this.vel = createVector(0, 0);
    //   this.isCircle = false;
    //   this.size = 40; // Reset to original square size
    //   this.shapeChangeTime = 0;
    //   this.isGliding = false;
    //   this.hit = false;
    // }
    /**
     * Handles collisions with other game objects.
     * 
     * @param {GameObject} other - The other game object this player collides with.
     */
    Collide(other) {
        // Collision logic here
        //print(this.name + " collided with " + other.name);
       if(other.name == 'Enemy'||
          other.name == 'Projectile' ||
          other.name == 'Projectile360'
         ){
          this.hit = true;
          //console.log("Name: " + other.name + "\nPos X: " + other.pos.x + "\nPos Y: " + other.pos.y + "\nWith: " + other.w + "\nHeight: " + other.h + "\nSize: " + other.size);
          //console.log("Name: " + this.name + "\nPos X: " + this.pos.x + "\nPos Y: " + this.pos.y + "\nWith: " + this.w + "\nHeight: " + this.h + "\nSize: " + this.size);
        
       }      
    }

    CheckCollition(other) { // Other = All Gameobjects with collision shape except this
        //console.log(this.name + " : Collide() is not yet defined");  // Default placeholder message
        let impact = false;
        if (!this.isCircle){    // Square Shape Collisions 
          //   Rect to Rect
          if (other.colliderShape == ColliderShape.SQUARE){
          if (!(this.pos.x + this.w < other.pos.x ||
              this.pos.x > other.pos.x + other.w ||
              this.pos.y + this.h < other.pos.y ||
              this.pos.y > other.pos.y + other.h)){
                impact = true;
                console.log("rect to rect");
              }
          }
          if (other.colliderShape == ColliderShape.CIRCLE){
            // Rect to Circle
            let testX = other.pos.x;
            let testY = other.pos.y;
          
            let rx = this.pos.x ;
            let ry = this.pos.y ;
            let rw = this.size;
            let rh = this.size;
          
            if (other.pos.x < rx) testX = rx;
            else if (other.pos.x > rx + rw) testX = rx + rw;
            if (other.pos.y < ry) testY = ry;
            else if (other.pos.y > ry + rh) testY = ry + rh;
          
            let distX = other.pos.x - testX;
            let distY = other.pos.y - testY;
            let distance = sqrt(distX * distX + distY * distY);
          
            if (distance <= other.size/2) {
              impact = true;
              //console.log("rect to circle");
            }
          } 
        }
        else{ // Circle Shape Collisions
          // Circle to Circle
          if (other.colliderShape == ColliderShape.CIRCLE){
            let x1 = this.pos.x;
            let y1 = this.pos.y;

            let x2 = other.pos.x;
            let y2 = other.pos.y;

            let distX = x2 - x1;
            let distY = y2 - y1;

            let distance = sqrt(distX * distX + distY * distY);
            if (distance <= (this.size / 2) + (other.size / 2)) {
              impact = true;
              //console.log("circle to circle");
            }
          }

          // Rect to Circle
          if (other.colliderShape == ColliderShape.SQUARE){
            let testX = this.pos.x;
            let testY = this.pos.y;
          
            let rx = other.pos.x ;
            let ry = other.pos.y ;
            let rw = other.w;
            let rh = other.h;
          
            if (this.pos.x < rx) testX = rx;
            else if (this.pos.x > rx + rw) testX = rx + rw;
            if (this.pos.y < ry) testY = ry;
            else if (this.pos.y > ry + rh) testY = ry + rh;
          
            let distX2 = this.pos.x - testX;
            let distY2 = this.pos.y - testY;
            let distance2 = sqrt(distX2 * distX2 + distY2 * distY2);
          
            if (distance2 <= this.circleSize) {
              impact = true;
              console.log("circle to rect");
            }

          }
        }
        if (impact){
          this.Collide(other);

        }
        
    }
}
