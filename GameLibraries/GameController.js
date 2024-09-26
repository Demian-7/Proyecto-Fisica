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
        boss = new Boss(this.bossCount);
        // Do not spawn regular enemies when the boss is active
        if (this.boss === null && millis() - this.lastEnemySpawnTime > adjustedEnemySpawnInterval) {


            let enemyType = random(['ground', 'flying']);
            new Enemy(enemyType, this.score); // Pass score to constructor
            this.lastEnemySpawnTime = millis();
        }

        // If there's no boss and the cooldown has passed, spawn a new one
        if (boss === null && bossCooldown <= 0 && score >= 15) {
            bossCount++; // Increment the boss count each time a new boss spawns
            new Boss(bossCount); // Pass the boss count to determine bullets
        }

        if (boss !== null) {
            boss.Update(dt);
            boss.Render();

            // Check if the boss is destroyed
            if (boss.isDestroyed) {
                boss = null; // Remove the boss
                bossCooldown = bossSpawnDelay; // Start the cooldown timer
            }
        } else {
        // Decrease the cooldown timer if the boss is not present
            if (bossCooldown > 0) {
                bossCooldown -= dt * 1000; // Convert deltaTimeSec to milliseconds
            }
        }
    }

    Render() {
        // Logic to render any UI elements related to the game controller
    }
}