// Special class for 360° projectiles fired in all directions
class Projectile360 extends GameObject{
    constructor(pos, angle) {
        super();
        this.name = "Projectile360";
        this.pos = pos.copy(); // Starting position is the boss's position
        this.angle = angle; // The direction of the projectile in radians
        this.size = 20; // Smaller than enemies
        // Velocity in the direction of the angle
        this.vel = createVector(cos(this.angle), sin(this.angle)).setMag(200); // Adjust speed as needed
    }
  
    update(dt) {
      let velocityStep = p5.Vector.mult(this.vel, dt);
      this.pos.add(velocityStep);
    }
  
    show() {
      fill(255, 0, 0); // Same red color as enemies
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size); // Use a circular shape for the 360° bullets
    }
  
    offscreen() {
      return (
        this.pos.x < -this.size ||
        this.pos.x > width + this.size ||
        this.pos.y < -this.size ||
        this.pos.y > height + this.size
      );
    }
  }