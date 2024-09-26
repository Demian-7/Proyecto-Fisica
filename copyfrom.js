// Endless Runner Fisica - UADE - Fuenteki

// Global Variables
let player;
let enemies = [];
let boss = null; // Added: Boss variable
let bossCooldown = 0; // Timer to track cooldown after boss self-destruction
let bossSpawnDelay = 30000; // 30 seconds delay before a new boss spawns
let bossCount = 0; // Tracks how many bosses have spawned
let projectiles = []; // Added: Projectiles array
let clouds = [];
let gameOver = false;
let score = 0;
let highScore = 0;
let gameStarted = false;
let startTime;
let playAgainButton;

let enemySpawnInterval = 1500; // milliseconds
let lastEnemySpawnTime = 0;

let bgMusic; // Background music variable
let musicStarted = false; // Flag to check if music has started

let bgImage; // Background image variable

function preload() {
  bgMusic = loadSound('Ascendancy of the Cube.mp3');
  bgImage = loadImage('synthwave_sunset.gif');
}

function setup() {
  createCanvas(800, 400);
  player = new Player();
  for (let i = 0; i < 3; i++) {
    clouds.push(new CloudLayer(i + 1));
  }
  playAgainButton = createButton('Play Again');
  playAgainButton.position(width / 2 - 50, height / 2 + 30);
  playAgainButton.mousePressed(restartGame);
  playAgainButton.hide();

  bgMusic.setVolume(0.5); // Optional: Adjust volume
}

function draw() {
  // Display the background image
  image(bgImage, 0, 0, width, height);

  let deltaTimeSec = deltaTime / 1000; // Convert deltaTime to seconds

  for (let cloudLayer of clouds) {
    cloudLayer.update(deltaTimeSec);
    cloudLayer.show();
  }

  if (!gameOver) {
    if (!gameStarted) {
      startTime = millis();
      gameStarted = true;
    }
    player.update(deltaTimeSec);
    player.show();
    handleEnemies(deltaTimeSec);
    handleBoss(deltaTimeSec); // Added: Handle boss
    handleProjectiles(deltaTimeSec); // Added: Handle projectiles
    displayScore();
  } else {
    displayGameOver();
  }
}

function keyPressed() {
  if (!musicStarted) {
    bgMusic.loop();
    musicStarted = true;
  }
  if (!gameOver) {
    if (keyCode === CONTROL) {
      player.fallFast();
      player.stopGlide(); // Stop gliding when Control is pressed
    } else if (keyCode === 32) { // Space key
      if (player.onGround()) {
        player.jump();
      } else {
        player.startGlide();
      }
    } else {
      // For other keys, you can implement other actions if needed
      player.jump(); // Keep the ability to jump with any key if desired
    }
  }
}

function keyReleased() {
  if (keyCode === 32) { // Space key
    player.stopGlide();
  }
}

function mousePressed() {
  if (!musicStarted) {
    bgMusic.loop();
    musicStarted = true;
  }
  if (!gameOver && player.contains(mouseX, mouseY)) {
    player.changeShape();
  }
}

function handleEnemies(deltaTimeSec) {
  // Adjust enemySpawnInterval based on score
  let adjustedEnemySpawnInterval = max(500, enemySpawnInterval - score * 8.33);

  // Do not spawn regular enemies when the boss is active
  if (boss === null && millis() - lastEnemySpawnTime > adjustedEnemySpawnInterval) {
    let enemyType = random(['ground', 'flying']);
    enemies.push(new Enemy(enemyType, score)); // Pass score to constructor
    lastEnemySpawnTime = millis();
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    enemy.update(deltaTimeSec);
    enemy.show();

    if (player.collidesWith(enemy)) {
      gameOver = true;
      if (score > highScore) {
        highScore = score;
      }
      playAgainButton.show();
    }

    if (enemy.offscreen()) {
      enemies.splice(i, 1);
    }
  }

  score = floor((millis() - startTime) / 1000);
}

function handleBoss(deltaTimeSec) {
  // If there's no boss and the cooldown has passed, spawn a new one
  if (boss === null && bossCooldown <= 0 && score >= 15) {
    bossCount++; // Increment the boss count each time a new boss spawns
    boss = new Boss(bossCount); // Pass the boss count to determine bullets
  }

  if (boss !== null) {
    boss.update(deltaTimeSec);
    boss.show();

    // Check if the boss is destroyed
    if (boss.isDestroyed) {
      boss = null; // Remove the boss
      bossCooldown = bossSpawnDelay; // Start the cooldown timer
    }
  } else {
    // Decrease the cooldown timer if the boss is not present
    if (bossCooldown > 0) {
      bossCooldown -= deltaTimeSec * 1000; // Convert deltaTimeSec to milliseconds
    }
  }
}



function handleProjectiles(deltaTimeSec) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let proj = projectiles[i];
    proj.update(deltaTimeSec);
    proj.show();

    if (player.collidesWithProjectile(proj)) {
      gameOver = true;
      if (score > highScore) {
        highScore = score;
      }
      playAgainButton.show();
    }

    if (proj.offscreen()) {
      projectiles.splice(i, 1);
    }
  }
}

function displayScore() {
  fill(250,250,0);
  textSize(16);
  textAlign(LEFT);
  text('Score: ' + score, 10, 20);
  textAlign(RIGHT);
  text('High Score: ' + highScore, width - 10, 20);
}

function displayGameOver() {
  fill(255, 0, 0);
  textSize(48);
  textAlign(CENTER);
  text('Game Over', width / 2, height / 2);
}

// Function that we call when restarting the game (e.g: we click 'Play Again')
function restartGame() {
  gameOver = false;
  gameStarted = false;
  enemies = [];
  projectiles = [];
  boss = null;
  bossCount = 0; // Reset boss count to restart difficulty progression
  player.reset();
  playAgainButton.hide();
}

function drawStars() {
  fill(255);
  noStroke();
  for (let i = 0; i < 100; i++) {
    ellipse(random(width), random(height / 2), 1, 1);
  }
}

// Player class with gliding mechanic
class Player {
  constructor() {
    this.pos = createVector(50, height - 50);
    this.size = 40; // Initial size of the square
    this.circleSize = 20; // Smaller size for the circle form
    this.vel = createVector(0, 0);
    this.gravity = createVector(0, 2000); // pixels per second squared
    this.lift = -800; // pixels per second
    this.isCircle = false;
    this.shapeChangeTime = 0;
    this.maxFallSpeed = 1000; // pixels per second
    this.isGliding = false; // New property for gliding state
    this.glideGravity = createVector(0, 500); // Reduced gravity when gliding
  }

  update(dt) {
    // Apply gravity
    let gravityStep;
    if (this.isGliding) {
      gravityStep = p5.Vector.mult(this.glideGravity, dt);
    } else {
      gravityStep = p5.Vector.mult(this.gravity, dt);
    }
    this.vel.add(gravityStep);

    // Limit fall speed
    if (this.vel.y > this.maxFallSpeed) {
      this.vel.y = this.maxFallSpeed;
    }

    // Update position
    let velocityStep = p5.Vector.mult(this.vel, dt);
    this.pos.add(velocityStep);

    // Ground collision
    if (this.pos.y >= height - this.size / 2) {
      this.pos.y = height - this.size / 2;
      this.vel.y = 0;
      this.isGliding = false; // Stop gliding when on the ground
    }

    // Shape change duration
    if (this.shapeChangeTime > 0 && millis() - this.shapeChangeTime > 5000) {
      this.isCircle = false;
      this.size = 40; // Reset to original square size after 5 seconds
      this.shapeChangeTime = 0;
    }
  }

  show() {
    stroke(255); // Added: Set stroke color to white
    strokeWeight(2); // Added: Set stroke weight
    fill(173, 216, 230); // Light cyan color
    if (this.isCircle) {
      ellipse(this.pos.x, this.pos.y, this.circleSize, this.circleSize); // Smaller circle size
    } else {
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, this.size, this.size);
    }

    // Draw wings if gliding
    if (this.isGliding) {
      this.drawWings();
    }
  }

  drawWings() {
    fill(255, 255, 0); // Yellow color for wings
    noStroke();
    let wingSize = this.size / 2;
    let wingOffsetX = this.size / 2;
    let wingOffsetY = this.size / 4;

    // Left wing
    triangle(
      this.pos.x - wingOffsetX,
      this.pos.y,
      this.pos.x - wingOffsetX - wingSize,
      this.pos.y - wingOffsetY,
      this.pos.x - wingOffsetX - wingSize,
      this.pos.y + wingOffsetY
    );

    // Right wing
    triangle(
      this.pos.x + wingOffsetX,
      this.pos.y,
      this.pos.x + wingOffsetX + wingSize,
      this.pos.y - wingOffsetY,
      this.pos.x + wingOffsetX + wingSize,
      this.pos.y + wingOffsetY
    );
  }

  jump() {
    if (this.onGround()) {
      this.vel.y = this.lift;
    }
  }

  fallFast() {
    if (this.pos.y < height - this.size / 2) {
      this.vel.y = this.maxFallSpeed;
    }
  }

  startGlide() {
    if (!this.onGround()) {
      this.isGliding = true;
    }
  }

  stopGlide() {
    this.isGliding = false;
  }

  onGround() {
    return this.pos.y >= height - this.size / 2;
  }

  changeShape() {
    this.isCircle = true;
    this.size = this.circleSize; // Set the size to the smaller circle size
    this.shapeChangeTime = millis();
  }

  collidesWith(enemy) {
    if (this.isCircle) {
      return enemy.collidesWithCircle(this.pos, this.circleSize / 2);
    } else {
      return enemy.collidesWithRect(
        this.pos.x - this.size / 2,
        this.pos.y - this.size / 2,
        this.size,
        this.size
      );
    }
  }

  contains(px, py) {
    if (this.isCircle) {
      let d = dist(px, py, this.pos.x, this.pos.y);
      return d < this.circleSize / 2;
    } else {
      return (
        px > this.pos.x - this.size / 2 &&
        px < this.pos.x + this.size / 2 &&
        py > this.pos.y - this.size / 2 &&
        py < this.pos.y + this.size / 2
      );
    }
  }

  reset() {
    this.pos = createVector(50, height - 50);
    this.vel = createVector(0, 0);
    this.isCircle = false;
    this.size = 40; // Reset to original square size
    this.shapeChangeTime = 0;
    this.isGliding = false;
  }

  collidesWithProjectile(proj) {
    if (this.isCircle) {
      // Circle-Circle collision with projectiles
      let d = p5.Vector.dist(this.pos, proj.pos);
      return d < this.circleSize / 2 + proj.size / 2;
    } else {
      // Rectangle-Circle collision with projectiles
      let testX = proj.pos.x;
      let testY = proj.pos.y;

      let rx = this.pos.x - this.size / 2;
      let ry = this.pos.y - this.size / 2;
      let rw = this.size;
      let rh = this.size;

      if (proj.pos.x < rx) testX = rx;
      else if (proj.pos.x > rx + rw) testX = rx + rw;
      if (proj.pos.y < ry) testY = ry;
      else if (proj.pos.y > ry + rh) testY = ry + rh;

      let distX = proj.pos.x - testX;
      let distY = proj.pos.y - testY;
      let distance = sqrt(distX * distX + distY * distY);

      return distance <= proj.size / 2;
    }
  }
}

// Enemy class with vectors and deltaTime
class Enemy {
  constructor(type, score) {
    this.type = type;
    this.size = random(20, 40);
    this.pos = createVector(width + this.size, 0);
    this.vel = createVector(0, 0);
    this.isCircle = random([true, false]);

    // Calculate speed multiplier based on score
    let speedMultiplier = 1 + score / 120; // Adjusted scaling factor
    let maxSpeedMultiplier = 3; // Example maximum multiplier
    speedMultiplier = min(speedMultiplier, maxSpeedMultiplier);
    if (type === 'ground') {
      this.pos.y = HEIGHT - this.size ;
      this.vel.x = -400 * speedMultiplier; // Increase speed
    } else if (type === 'flying') {
      this.pos.y = random(HEIGHT / 2, HEIGHT - this.size );
      this.vel.x = -200 * speedMultiplier; // Increase speed
      this.angle = 0;
      this.amplitude = random(20, 50);
      this.angularSpeed = random(1, 3); // radians per second
    }
  }

  update(dt) {
    if (this.type === 'flying' && this.isCircle) {
      this.angle += this.angularSpeed * dt;
      this.pos.y += sin(this.angle) * this.amplitude * dt;
    }
    let velocityStep = p5.Vector.mult(this.vel, dt);
    this.pos.add(velocityStep);
  }


  show() {
    stroke(255); // Added: Set stroke color to white
    strokeWeight(2); // Added: Set stroke weight
    fill(255, 0, 0); // Red color
    if (this.isCircle) {
      ellipse(this.pos.x, this.pos.y, this.size, this.size);
    } else {
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, this.size, this.size);
    }
  }

  offscreen() {
    return this.pos.x < -this.size;
  }

  collidesWithRect(rx, ry, rw, rh) {
    if (this.isCircle) {
      // Circle-Rectangle Collision
      let testX = this.pos.x;
      let testY = this.pos.y;

      if (this.pos.x < rx) testX = rx;
      else if (this.pos.x > rx + rw) testX = rx + rw;
      if (this.pos.y < ry) testY = ry;
      else if (this.pos.y > ry + rh) testY = ry + rh;

      let distX = this.pos.x - testX;
      let distY = this.pos.y - testY;
      let distance = sqrt(distX * distX + distY * distY);

      if (distance <= this.size / 2) {
        return true;
      }
    } else {
      // Rectangle-Rectangle Collision
      return !(
        this.pos.x + this.size / 2 < rx ||
        this.pos.x - this.size / 2 > rx + rw ||
        this.pos.y + this.size / 2 < ry ||
        this.pos.y - this.size / 2 > ry + rh
      );
    }
    return false;
  }

  collidesWithCircle(cPos, cR) {
    if (this.isCircle) {
      // Circle-Circle Collision
      let d = p5.Vector.dist(this.pos, cPos);
      return d < this.size / 2 + cR;
    } else {
      // Rectangle-Circle Collision
      let testX = cPos.x;
      let testY = cPos.y;

      let rx = this.pos.x - this.size / 2;
      let ry = this.pos.y - this.size / 2;
      let rw = this.size;
      let rh = this.size;

      if (cPos.x < rx) testX = rx;
      else if (cPos.x > rx + rw) testX = rx + rw;
      if (cPos.y < ry) testY = ry;
      else if (cPos.y > ry + rh) testY = ry + rh;

      let distX = cPos.x - testX;
      let distY = cPos.y - testY;
      let distance = sqrt(distX * distX + distY * distY);

      if (distance <= cR) {
        return true;
      }
    }
    return false;
  }
}

// CloudLayer class with vectors and deltaTime
class CloudLayer {
  constructor(speedMultiplier) {
    this.clouds = [];
    this.speed = speedMultiplier * 50; // pixels per second
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        pos: createVector(random(width), random(20, 100) - speedMultiplier * 10),
        size: random(50, 100),
      });
    }
  }

  update(dt) {
    for (let cloud of this.clouds) {
      cloud.pos.x -= this.speed * dt;
      if (cloud.pos.x < -cloud.size) {
        cloud.pos.x = width + cloud.size;
      }
    }
  }

  show() {
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
}




// Boss class
class Boss {
  constructor(bossCount) {
    this.size = 60;
    this.pos = createVector(width + this.size, height / 2);
    this.vel = createVector(-100, 0); // Move into the screen
    this.angle = 0;
    this.angularVelocity = 0; // Start spinning
    this.angularAcceleration = 0.5; // Acceleration for spinning
    this.spinningClockwise = true;
    this.spinTime = 0;
    this.state = 'entering'; // States: entering, spinning, shooting, resting, finalShoot, selfDestruct
    this.shootTimer = 0;
    this.shootDuration = 0;
    this.restDuration = 0;
    this.isDestroyed = false;
    this.shotsFired = 0; // Track the number of bullets fired
    this.timeBetweenShots = 0.2; // Time between each bullet

    // Calculate the number of bullets for this boss, capping at 20
    this.maxShots = min(5 + (bossCount - 1) * 3, 20); // Each new boss shoots 3 more bullets, capped at 20
    this.attackCycles = 0; // Number of shooting cycles
    this.maxCycles = 4; // After 4 cycles, despawn
  }

  update(dt) {
    if (this.state === 'entering') {
      this.pos.add(p5.Vector.mult(this.vel, dt));
      if (this.pos.x <= width - this.size) {
        this.pos.x = width - this.size;
        this.vel.x = 0;
        this.state = 'spinning';
      }
    } else if (this.state === 'spinning') {
      this.spinTime += dt;
      if (this.spinningClockwise) {
        this.angularVelocity += this.angularAcceleration * dt;
      } else {
        this.angularVelocity -= this.angularAcceleration * dt;
      }
      this.angle += this.angularVelocity * dt;

      if (this.spinTime >= 2) {
        this.spinningClockwise = !this.spinningClockwise;
        this.spinTime = 0;

        if (!this.spinningClockwise) {
          this.state = 'shooting';
          this.shootTimer = 0;
          this.shotsFired = 0;
          this.shootDuration = 0;
        }
      }
    } else if (this.state === 'shooting') {
      this.shootDuration += dt;
      this.shootTimer += dt;
      this.angularVelocity -= this.angularAcceleration * dt; // Increase spin speed
      this.angle += this.angularVelocity * dt;

      if (this.shotsFired < this.maxShots && this.shootTimer >= this.timeBetweenShots) {
        this.shoot();
        this.shootTimer = 0; // Reset timer for next shot
        this.shotsFired++;
      }

      if (this.shotsFired >= this.maxShots) { // After shooting the set number of bullets, pause
        this.state = 'resting';
        this.restDuration = 0;
      }

    } else if (this.state === 'resting') {
      this.restDuration += dt;
      this.angularVelocity += this.angularAcceleration * dt; // Slow down spin
      this.angle += this.angularVelocity * dt;

      if (this.restDuration >= 2) { // Rest for 2 seconds
        this.state = 'spinning';
        this.spinningClockwise = true;
        this.spinTime = 0;
        this.attackCycles++;

        if (this.attackCycles >= this.maxCycles) {
          this.state = 'finalShoot';
        }
      }
    } else if (this.state === 'finalShoot') {
      // Fire 12 bullets in a 360-degree pattern
      this.shoot360();
      this.state = 'selfDestruct';
    } else if (this.state === 'selfDestruct') {
      this.isDestroyed = true;
    }

    // Limit angular velocity
    this.angularVelocity = constrain(this.angularVelocity, -5, 5);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    stroke(255);
    strokeWeight(2);
    fill(255, 108, 20); // Green color for boss
    triangle(
      -this.size / 2, this.size / 2,
      0, -this.size / 2,
      this.size / 2, this.size / 2
    );
    pop();
  }

  shoot() {
    // Slightly offset each projectile's trajectory to create gaps
    let projType = random(['square', 'triangle']);
    let offset = random(-PI / 16, PI / 16); // Random offset between -11.25 and +11.25 degrees
    let projectile = new Projectile(this.pos.copy(), projType, offset);
    projectiles.push(projectile);
  }

  shoot360() {
    // Shoot 12 bullets in a circle (360 degrees)
    let numBullets = 12*bossCount;
    for (let i = 0; i < numBullets; i++) {
      let angle = map(i, 0, numBullets, 0, TWO_PI); // Distribute bullets evenly
      let projectile = new Projectile360(this.pos.copy(), angle);
      projectiles.push(projectile);
    }
  }

  selfDestruct() {
    this.state = 'selfDestruct';
    this.isDestroyed = true;
  }
}


// Special class for 360° projectiles fired in all directions
class Projectile360 {
  constructor(pos, angle) {
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

// Projectile class for normal shots with slight offset
class Projectile {
  constructor(pos, type, angleOffset) {
    this.pos = pos.copy(); // Starting position is the boss's position
    this.type = type; // 'square' or 'triangle'
    this.size = 20; // Smaller than enemies
    // Velocity towards the player's position with slight random offset
    let aim = p5.Vector.sub(player.pos, this.pos);
    aim.rotate(angleOffset); // Apply the random angle offset to create gaps
    this.vel = aim.setMag(250); // Adjust speed to 250
  }

  update(dt) {
    let velocityStep = p5.Vector.mult(this.vel, dt);
    this.pos.add(velocityStep);
  }

  show() {
    fill(255, 0, 0); // Same red color as enemies
    noStroke();
    if (this.type === 'square') {
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, this.size, this.size);
    } else if (this.type === 'triangle') {
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

  offscreen() {
    return (
      this.pos.x < -this.size ||
      this.pos.x > width + this.size ||
      this.pos.y < -this.size ||
      this.pos.y > height + this.size
    );
  }
}