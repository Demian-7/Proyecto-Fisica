class GroundEnemy extends GameObject {

  constructor(type, posX, posY, size, speed, score) {
    super();
    this.name = "Enemy"
    this.type = type;  // Set the enemy type ('ground' or 'flying')
    this.pos = createVector(posX, posY);
    this.w = size;
    this.h = size;
    this.size = size;
    this.speed = speed;
    this.angle = 0; // For flying enemies
    this.amplitude = random(20, 50); // For sine wave movement

    // Speed multiplier logic
    let speedMultiplier = 1 + score / 120; // Adjusting speed based on score
    let maxSpeedMultiplier = 3;
    this.speed = min(speed * speedMultiplier, speed * maxSpeedMultiplier); // Adjusting speed
    
    // Position based on type
    if (type === 'ground') {
      this.isCircle = false; // Ground enemies are always squares
      this.colliderShape = ColliderShape.SQUARE;
      this.pos.y = HEIGHT - this.size / 2;
      //this.pos.x = -400 * speedMultiplier; // Increase speed
    } else if (type === 'flying') {
      this.isCircle = true; // Flying enemies are always circles
      this.colliderShape = ColliderShape.CIRCLE;
      this.pos.y = random(HEIGHT / 2, HEIGHT - this.size * 2);
      //this.pos.x = -200 * speedMultiplier; // Increase speed
      this.angle = 0;
      this.amplitude = random(20, 50);
      this.angularSpeed = random(1, 3); // radians per second
    }
    
  }

  SetSpeed(speed) {
    this.speed = speed; 
  }
  offscreen() {
    return this.pos.x < -this.size;
  }

  Render() {
    stroke(255); // Stroke color
    strokeWeight(2); // Stroke weight
    fill(220, 40, 50);

    if (this.isCircle) {
      ellipse(this.pos.x, this.pos.y, this.size * 2);  // Draw a circle
    } else {
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, this.size * 2);  // Draw a square
    }
  }

  Update(dt) {
    this.pos.x -= this.speed*dt;
    // If flying enemy (using sine wave motion)
    if (this.type === 'flying' && this.isCircle) {
      this.angle += random(1, 3) * dt;
      this.pos.y += sin(this.angle) * this.amplitude * dt;  // Vertical movement using sine
    }
    this.pos.y = constrain(this.pos.y, 0, HEIGHT -this.size);
  }

  Collide(other){

  }

  CheckCollition(other){
    
  }
}

    /*
    if (other.isCircle) {
      // Circle-Rectangle Collision logic
      let testX = other.pos.x;
      let testY = other.pos.y;

      if (other.pos.x < this.pos.x) testX = this.pos.x;
      else if (other.pos.x > this.pos.x + this.size) testX = this.pos.x + this.size;
      if (other.pos.y < this.pos.y) testY = this.pos.y;
      else if (other.pos.y > this.pos.y + this.size) testY = this.pos.y + this.size;

      let distX = other.pos.x - testX;
      let distY = other.pos.y - testY;
      let distance = sqrt(distX * distX + distY * distY);

      return distance <= other.size / 2;
    } else {
      // Rectangle-Rectangle Collision
      return !(
        other.pos.x + other.size / 2 < this.pos.x ||
        other.pos.x - other.size / 2 > this.pos.x + this.size ||
        other.pos.y + other.size / 2 < this.pos.y ||
        other.pos.y - other.size / 2 > this.pos.y + this.size
      );
    }*/ 