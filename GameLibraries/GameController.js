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
        // Logic to update the game state
        // Logica para crear a los enemigos
    }

    Render() {
        // Logic to render any UI elements related to the game controller
    }
}