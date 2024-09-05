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
        this.pos = createVector(playerX, playerY);
        this.w = playerW;
        this.h = playerH;
        this.speed = 10;
    }

    /**
     * Renders the player on the screen as a rectangle.
     */
    Render() {
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }

    /**
     * Updates the player's position based on speed and delta time.
     * 
     * @param {Number} dt - Delta time used for updating the player's position.
     */
    Update(dt) {
        let velocidad = createVector(this.speed, this.speed);
        this.pos.x += velocidad.x * dt;
        this.pos.y += velocidad.y * dt;
    }

    /**
     * Handles collisions with other game objects.
     * 
     * @param {GameObject} other - The other game object this player collides with.
     */
    Collide(other) {
        // Collision logic here
    }
}
