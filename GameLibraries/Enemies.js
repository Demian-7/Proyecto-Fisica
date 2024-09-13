class GroundEnemy extends GameObject {

  constructor(posX, posY, size, speed) {
    super();
    this.name = "Ground Enemy"
    this.colliderShape = ColliderShape.SQUARE;
    this.pos = createVector(posX, posY);
    this.w = size;
    this.h = size;
    this.speed = speed;
  }

  SetSpeed(speed) {
    this.speed = speed;
  }

  Render() {
    fill(220, 40, 50);
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }

  Update(dt) {
    this.pos.x -= this.speed*dt;
  }

  Collide(other){

  }

  CheckCollition(other){

  }
}