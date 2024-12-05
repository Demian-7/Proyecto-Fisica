class CloudLayer extends GameObject {

  /**
   * Constructor for the CloudLayer class.
   * Initializes the cloud layer with a speed multiplier for parallax and generates initial clouds.
   * 
   * @param {Number} speedMultiplier - Multiplier for the cloud movement speed.
   */
  constructor(speedMultiplier) {
      super();
      this.clouds = []; // Array to store individual clouds.
      this.name = "Cloud Layer"; // Name for identification purposes.
      this.colliderShape = ColliderShape.NULL; // No collision logic is needed for clouds.
      this.speedMultiplier = speedMultiplier; // Parallax speed multiplier; higher values mean faster clouds.
      this.speed = speedMultiplier * 50; // Base speed for the cloud movement, influenced by the multiplier.
      this.Generate(); // Generate the initial set of clouds.
  }

  /**
   * Render all clouds in the layer.
   * Each cloud is drawn as a combination of ellipses to create a fluffy appearance.
   */
  Render() {
      fill(246, 1, 157, 200); // Color and transparency for the clouds.
      noStroke();
      for (let cloud of this.clouds) {
          // Central ellipse for the main cloud body.
          ellipse(cloud.pos.x, cloud.pos.y, cloud.size, cloud.size * 0.6);

          // Smaller ellipses for the "puffy" parts on the left and right.
          ellipse(
              cloud.pos.x + cloud.size * 0.4, // Offset to the right.
              cloud.pos.y + cloud.size * 0.1, // Slight vertical adjustment.
              cloud.size * 0.7, // Smaller size.
              cloud.size * 0.5 // Flatter ellipse.
          );
          ellipse(
              cloud.pos.x - cloud.size * 0.4, // Offset to the left.
              cloud.pos.y + cloud.size * 0.1,
              cloud.size * 0.7,
              cloud.size * 0.5
          );
      }
  }

  /**
   * Update the position of each cloud in the layer based on the speed and delta time.
   * Respawn clouds that move offscreen to the right.
   * 
   * @param {Number} dt - Delta time for frame-independent movement.
   */
  Update(dt) {
      for (let cloud of this.clouds) {
          cloud.pos.x -= this.speed * dt; // Move the cloud to the left based on the speed.
          if (cloud.pos.x < -cloud.size) {
              // If the cloud moves offscreen to the left, respawn it on the right.
              cloud.pos.x = width + cloud.size;
          }
      }
  }

  /**
   * Generate an initial set of clouds for the layer.
   * Each cloud has a random position and size.
   */
  Generate() {
      for (let i = 0; i < 5; i++) { // Generate 5 clouds by default.
          this.clouds.push({
              pos: createVector(
                  random(width), // Random horizontal position within the canvas width.
                  random(20, 100) - this.speedMultiplier * 10 // Vertical position depends on speedMultiplier.
              ),
              size: random(50, 100), // Random cloud size.
          });
      }
  }

  /**
   * Placeholder for collision logic. Not needed for clouds.
   */
  Collide(other) {
      // Collision logic here    
  }

  /**
   * Placeholder for collision checking. Not needed for clouds.
   */
  CheckCollition(other) {
      //console.log(this.name + " : Collide() is not yet defined");  // Default placeholder message.
  }
}
