// Projectile class for normal shots with slight offset
class Projectile extends GameObject {
    constructor(pos, type, angleOffset) {
        super();
        this.name = "Projectile";
        this.pos = pos.copy(); // Starting position is the boss's position
        this.type = type; // 'square' or 'triangle'
        this.colliderShape = ColliderShape.SQUARE;
        this.size = 20; // Smaller than enemies
        // Velocity towards the player's position with slight random offset
        let aim = p5.Vector.sub(player.pos, this.pos);
        aim.rotate(angleOffset); // Apply the random angle offset to create gaps
        this.vel = aim.setMag(250); // Adjust speed to 250
    }
  
    Update(dt) {
        let velocityStep = p5.Vector.mult(this.vel, dt);
        this.pos.add(velocityStep);
        
    }
  
    Render() {
        fill(255, 0, 0); // Same red color as enemies
        noStroke();
        
        if (this.type === 'square') {
            this.colliderShape = ColliderShape.SQUARE;
            rectMode(CENTER);
            rect(this.pos.x, this.pos.y, this.size, this.size);
        } else if (this.type === 'triangle') {
            this.colliderShape = ColliderShape.TRIANGLE;
            push();
            translate(this.pos.x, this.pos.y);
            triangle(
              -this.size / 2, this.size / 2,
              0, -this.size / 2,
              this.size / 2, this.size / 2
            );
            pop();
          }
    }
  
    Offscreen() {
      return (
        this.pos.x < -this.size ||
        this.pos.x > width + this.size ||
        this.pos.y < -this.size ||
        this.pos.y > height + this.size
      );
    }
    
    Collide(other){

    }

    CheckCollition(other){

    }
}