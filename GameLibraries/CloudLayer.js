class CloudLayer extends GameObject {

    constructor(speedMultiplier) {
        super();
        this.clouds = [];
        this.speedMultiplier = speedMultiplier;
        this.speed = speedMultiplier * 50; // pixels per second
        this.Generate();
    }

    Render() {
        fill(246, 1, 157, 200);
      noStroke();
      for (let cloud of this.clouds) {
        ellipse(cloud.pos.x, cloud.pos.y, cloud.size, cloud.size * 0.6);
        ellipse(
          cloud.pos.x + cloud.size * 0.4,
          cloud.pos.y + cloud.size * 0.1,
          cloud.size * 0.7,
          cloud.size * 0.5
        );
        ellipse(
          cloud.pos.x - cloud.size * 0.4,
          cloud.pos.y + cloud.size * 0.1,
          cloud.size * 0.7,
          cloud.size * 0.5
        );
      }
    }

    Update(dt) {
        for (let cloud of this.clouds) {
            cloud.pos.x -= this.speed * dt;
            if (cloud.pos.x < -cloud.size) {
              cloud.pos.x = width + cloud.size;
            }
          }
    }

    Generate(){
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
              pos: createVector(random(width), random(20, 100) - this.speedMultiplier * 10),
              size: random(50, 100),
            });
          }
    }




    Collide(other) {
        // Collision logic here    
    }
    CheckCollition(other) {
        //console.log(this.name + " : Collide() is not yet defined");  // Default placeholder message
    }
}