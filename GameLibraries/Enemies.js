class Enemy extends GameObject {

  constructor(type, score) {
    super();
    this.name = "Enemy"
    this.type = type;  // Set the enemy type ('ground' or 'flying')

    this.size = random(30, 50);
    this.pos = createVector(WIDTH + this.size, 0);
    this.w = this.size;
    this.h = this.size;

    this.vel = createVector(0, 0);

    this.angle = 0; // For flying enemies
    this.amplitude = random(20, 50); // For sine wave movement

    // Speed multiplier logic
    let speedMultiplier = 1 + score / 120; // Adjusting speed based on score
    let maxSpeedMultiplier = 3;
    speedMultiplier = speedMultiplier = min(speedMultiplier, maxSpeedMultiplier);
    
    // Position based on type
    if (type === 'ground') {
      this.isCircle = false; // Ground enemies are always squares
      this.colliderShape = ColliderShape.SQUARE;
      this.pos.y = HEIGHT - this.size / 2;
      this.vel.x = -400 * speedMultiplier; // Increase speed
    } else if (type === 'flying') {
      this.isCircle = true; // Flying enemies are always circles
      this.colliderShape = ColliderShape.CIRCLE;
      this.pos.y = random(HEIGHT / 2, HEIGHT - this.size * 2);
      this.vel.x = -200 * speedMultiplier; // Increase speed
      this.angle = 0;
      this.amplitude = random(20, 50);
      this.angularSpeed = random(1, 3); // radians per second
    }
  }

  offscreen() {
    return this.pos.x < -this.size;
  }

  Render() {
    stroke(255); // Stroke color
    strokeWeight(2); // Stroke weight
    fill(220, 40, 50);



    if (this.isCircle) {
      ellipse(this.pos.x, this.pos.y, this.size);  // Draw a circle
    } else {
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, this.size );  // Draw a square
    }
  }

  Update(dt) {
    this.pos.x += this.vel.x*dt;
    // If flying enemy (using sine wave motion)
    if (this.type === 'flying' && this.isCircle) {
      this.angle += random(1, 3) * dt;
      this.pos.y += sin(this.angle) * this.amplitude * dt;  // Vertical movement using sine
    }
  }

  Collide(other){

  }

  CheckCollition(other){
    
  }
}