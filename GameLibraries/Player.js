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
    constructor(playerX, playerY, playerW, playerH) {
        super();
        this.name = "Player";
        this.colliderShape = ColliderShape.SQUARE;
        this.pos = createVector(playerX, playerY);
        this.w = playerW;
        this.h = playerH;
        this.vy = 0;
        this.gravity = 98;
        this.jumpForce = 200;
    }

    /**
     * Renders the player on the screen as a rectangle.
     */
    Render() {
        fill(255, 255, 255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }

    /**
     * Updates the player's position based on speed and delta time.
     * 
     * @param {Number} dt - Delta time used for updating the player's position.
     */
    Update(dt) {
        this.pos.y += this.vy*dt;
        this.vy += this.gravity*dt;
        this.pos.y = constrain(this.pos.y, 0, HEIGHT - this.h)
    }


    jump(){
        if(this.pos.y == HEIGHT - this.h){
          this.vy = -this.jumpForce;
        }
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
