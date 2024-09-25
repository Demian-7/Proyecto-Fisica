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
    constructor(playerX, playerY, size) {
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
    }

    /**
     * Renders the player on the screen as a rectangle.
     */
    Render() {
        fill(255, 255, 255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
        if (this.isGliding){
            this.DrawWings();
        }
    }

    /**
     * Updates the player's position based on speed and delta time.
     * 
     * @param {Number} dt - Delta time used for updating the player's position.
     */
    Update(dt) {
        //this.pos.y += this.vel.y*dt;
        //this.vel.y += this.gravity.y*dt;
        //this.pos.y = constrain(this.pos.y, 0, HEIGHT - this.h)

        let gravityStep;
        if (this.isGliding){
            gravityStep = p5.Vector.mult(this.glideGravity, dt); 
        }
        else {
            gravityStep = p5.Vector.mult(this.gravity, dt);
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
        if (this.shapeChangeTime > 0 && millis() - this.shapeChangeTime > 5000) {
            this.isCircle = false;
            this.size = 40; // Reset to original square size after 5 seconds
            this.shapeChangeTime = 0;
        }

        //ELIMINAR MAS ADELANTE, SOLO TEST
        // Ground collision 
         if (this.pos.y >= HEIGHT - this.size / 2) {
          this.pos.y = HEIGHT - this.size / 2;
           this.vel.y = 0;
           this.isGliding = false; // Stop gliding when on the ground
       }
    }

    //Salto
    Jump(){
        if(this.OnGround()){
          this.vel.y = -this.jumpForce;
        }
        else{
            this.StartGlide();
            console.log("start glide");
        }
      }
    //Caida rapida
    FallFast() {
        if (!this.OnGround()) {
          this.vel.y = this.maxFallSpeed;
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

        let centerX = this.pos.x + this.size / 2;
        let centerY = this.pos.y + this.size / 2;
    
        // Left wing
        triangle(
            centerX - wingOffsetX,
            centerY,
            centerX - wingOffsetX - wingSize,
            centerY - wingOffsetY,
            centerX - wingOffsetX - wingSize,
            centerY + wingOffsetY
        );
    
        // Right wing
        triangle(
            centerX + wingOffsetX,
            centerY,
            centerX + wingOffsetX + wingSize,
            centerY - wingOffsetY,
            centerX + wingOffsetX + wingSize,
            centerY + wingOffsetY
        );
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
    /**
     * Handles collisions with other game objects.
     * 
     * @param {GameObject} other - The other game object this player collides with.
     */
    Collide(other) {
        // Collision logic here
        print(this.name + " collided with " + other.name);
    }

    CheckCollition(other) {
        //console.log(this.name + " : Collide() is not yet defined");  // Default placeholder message
    }
}
