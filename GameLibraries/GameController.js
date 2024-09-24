class GameController extends GameObject {
    constructor() {
        super();
        this.name = "GameController";
        this.enemies = [];
        this.boss = null;
        this.bossCooldown = 0;
        this.bossSpawnDelay = 30000;
        this.bossCount = 0;
        this.projectiles = [];
        this.clouds = [];
        this.gameOver = false;
        this.score = 0;
        this.highScore = 0;
        this.gameStarted = false;
        this.enemySpawnInterval = 1500;
        this.lastEnemySpawnTime = 0;
        this.startTime = 0;
        this.playAgainButton = null;
    }

    // Setup the game, initialize variables and UI
    setupGame() {
        this.startTime = millis();
        this.playAgainButton = createButton('Play Again');
        this.playAgainButton.position(width / 2 - 50, height / 2 + 30);
        this.playAgainButton.mousePressed(() => this.restartGame());
        this.playAgainButton.hide();
    }

    // Restart the game (reset the states)
    restartGame() {
        this.score = 0;
        this.gameOver = false;
        this.enemies = [];
        this.projectiles = [];
        this.boss = null;
        this.bossCount = 0;
        this.setupGame();
    }

    Update(dt) {
        // Logic to update the game state
    }

    Render() {
        // Logic to render any UI elements related to the game controller
    }
}