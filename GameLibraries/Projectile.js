class Projectile extends GameObject {
  constructor(pos, type, angleOffset, playerRef) {
      super();
      this.name = "Projectile";
      this.pos = pos.copy(); // Starting position is the boss's position
      this.type = type; // 'square' o 'triangle'
      this.colliderShape = ColliderShape.SQUARE;
      this.size = 20; // Smaller than enemies
      this.h = this.size;
      this.w = this.size;

      // Referencia al jugador
      this.player = playerRef;

      // Velocidad inicial hacia la posición del jugador con un pequeño offset
      let aim = p5.Vector.sub(this.player.pos, this.pos);
      aim.rotate(angleOffset); // Aplica un ángulo aleatorio
      this.vel = aim.setMag(250); // Ajusta la magnitud de la velocidad

      this.attractionForce = 200; // Fuerza de atracción hacia el jugador
      this.attractionRange = 400; // Rango de atracción
      this.gameOver = false;
  }

  Update(dt) {
      if (!this.gameOver) {
          if (this.type === 'triangle' && this.WithinAttractionRange()) {
              console.log("Triangle within attraction range"); // Confirma la condición
              // Ajusta la velocidad para atraer hacia el jugador
              this.AttractToPlayer(dt);
          } else {
              // Movimiento normal
              let velocityStep = p5.Vector.mult(this.vel, dt);
              this.pos.add(velocityStep);
          }
      }
  }

  Render() {
      if (!this.gameOver) {
          noStroke();

          if (this.type === 'square') {
              fill(255, 0, 0); // Color rojo
              this.colliderShape = ColliderShape.SQUARE;
              rect(this.pos.x, this.pos.y, this.size, this.size);
          } else if (this.type === 'triangle') {
              fill(255, 255, 50); // Color amarillo para triangulos
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
  }

  GameIsOver() {
      this.gameOver = true;
  }

  Offscreen() {
      return (
          this.pos.x < -this.size ||
          this.pos.x > width + this.size ||
          this.pos.y < -this.size ||
          this.pos.y > height + this.size
      );
  }

  // Verifica si el proyectil está dentro del rango de atracción del jugador
  WithinAttractionRange() {
      let distanceToPlayer = dist(this.pos.x, this.pos.y, this.player.pos.x, this.player.pos.y);
      return distanceToPlayer <= this.attractionRange;
  }

  // Ajusta la velocidad para atraer el proyectil hacia el jugador
  AttractToPlayer(dt) {
      console.log("Attracting to player"); // Verifica si entra aquí
      let attractionVector = p5.Vector.sub(this.player.pos, this.pos);
      attractionVector.setMag(this.attractionForce); // Ajusta la magnitud de la atracción
      this.vel.add(p5.Vector.mult(attractionVector, dt)); // Ajusta la velocidad gradualmente
      this.vel.limit(300); // Limita la velocidad máxima
      let velocityStep = p5.Vector.mult(this.vel, dt);
      this.pos.add(velocityStep); // Actualiza la posición
  }

  Collide(other) {
      // Define lógica de colisión
  }

  CheckCollition(other) {
      // Define lógica de chequeo de colisión
  }
}
