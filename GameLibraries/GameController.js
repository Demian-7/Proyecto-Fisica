class GameController extends GameObject {
    constructor() {
        super();
        this.name = "GameController";
        this.colliderShape = ColliderShape.NULL;
        this.enemies = [];
        this.boss = null;
        this.bossCooldown = 0;
        this.bossSpawnDelay = 30000;
        this.bossCount = 0;
        this.projectiles = [];
        this.clouds = []; // No es necesario una ves que las nubes esten implementadas en su clase.
        this.gameOver = false;
        this.score = 0;
        this.highScore = 0;
        this.gameStarted = false;
        this.enemySpawnInterval = 1500;
        this.lastEnemySpawnTime = 0;
        this.startTime = 0;
        this.playAgainButton = null;
        this.SetUpGame();
    }

    // Setup the game, initialize variables and UI
    SetUpGame() {
        this.startTime = millis();
        this.playAgainButton = createButton('Play Again');
        this.playAgainButton.position(width / 2 - 50, height / 2 + 30);
        this.playAgainButton.mousePressed(() => this.RestartGame());
        this.playAgainButton.hide();

        if (!this.gameOver) {
            if (!this.gameStarted) {
                this.startTime = millis();
                this.gameStarted = true;
            }
        }
    }

    // Restart the game (reset the states)
    RestartGame() {
        this.score = 0;
        this.gameOver = false;
        this.enemies = [];
        this.projectiles = [];
        this.boss = null;
        this.bossCount = 0;
        this.SetUpGame();
    }

    Update(dt) {
        let adjustedEnemySpawnInterval = max(500, this.enemySpawnInterval - this.score * 8.33);
          
        // Do not spawn regular enemies when the boss is active
        if (this.boss === null && millis() - this.lastEnemySpawnTime > adjustedEnemySpawnInterval) {


            let enemyType = random(['ground', 'flying']);
            new Enemy(enemyType, this.score); // Pass score to constructor
            this.lastEnemySpawnTime = millis();
        }
    
        if (this.boss !== null) {
            // Check if the boss is destroyed
            if (this.boss.isDestroyed) {
                this.boss = null; // Remove the boss
                this.bossCooldown = this.bossSpawnDelay; // Start the cooldown timer
            }
        } else {
        // Decrease the cooldown timer if the boss is not present
            if (this.bossCooldown > 0) {
                this.bossCooldown -= dt * 1000; // Convert deltaTimeSec to milliseconds
            }
        }
        // If there's no boss and the cooldown has passed, spawn a new one
        if (this.boss === null && this.bossCooldown <= 0 && this.score >= 3) {
            this.bossCount++; // Increment the boss count each time a new boss spawns
             // Pass the boss count to determine bullets
            this.boss = new Boss(this.bossCount);; // Remove the boss
        }
        this.score = floor((millis() - this.startTime) / 1000);
        console.log("Score: " + this.score);
    }

    Render() {
        // Logic to render any UI elements related to the game controller
    }
}