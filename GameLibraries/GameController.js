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
        this.enemyList = [];
        this.highScore = 0;
        this.gameStarted = false;
        this.enemySpawnInterval = 1500;
        this.lastEnemySpawnTime = 0;
        this.startTime = 0;
        this.playAgainButton = null;
        this.player = null;
        
        this.scoreText = null;
        this.highScoreText = null;
        this.gameOverText = null;
        
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
        location.reload();
        console.log("restart");
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.enemies = [];
        this.projectiles = [];
        this.boss = null;
        this.bossCount = 0;
        this.player.Reset();
        this.playAgainButton.hide();

    }

    GetPlayer(player){
        this.player = player;
    }

    Update(dt) {
        let adjustedEnemySpawnInterval = max(500, this.enemySpawnInterval - this.score * 8.33);
        this.DisplayScore();
        
        // Do not spawn regular enemies when the boss is active
        if (this.boss === null && millis() - this.lastEnemySpawnTime > adjustedEnemySpawnInterval) {


            let enemyType = random(['ground', 'flying']);
            this.enemyList.push(new Enemy(enemyType, this.score)); // Pass score to constructor
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
        if (this.boss === null && this.bossCooldown <= 0 && this.score >= 30) {
            this.bossCount++; // Increment the boss count each time a new boss spawns
             // Pass the boss count to determine bullets
            this.boss = new Boss(this.bossCount);// Remove the boss
        }
        
        //Game over Condition
        if(this.player.GameOver()){
            this.gameOver = true;
            //highscore y game over
            
            if (this.score > this.highScore) {
                this.highScore = this.score;
              }
              this.playAgainButton.show();
              this.DisplayGameOver();
            
        }
        if(this.gameOver){
             this.GameOver();
        }
        else{
        this.score = floor((millis() - this.startTime) / 1000);
        console.log("Score: " + this.score);
        }
    }

    GameOver(){
        for (let i = this.enemyList.length-1; i>=0; i--){
            this.enemyList[i].GameIsOver();
            this.enemyList.splice(i,1);  
            console.log(this.enemyList[i]);
        }
         if (this.boss != null){
            this.boss.GameIsOver();
         }
    }

    DisplayScore(){
        fill(250,250,0);
        textSize(16);
        textAlign(LEFT);
        text('Score: ' + this.score, 10, 20);
        textAlign(RIGHT);
        text('High Score: ' + this.highScore, WIDTH - 10, 20);
    }

    DisplayGameOver(){
        fill(255, 0, 0);
        textSize(48);
        textAlign(CENTER);
        text('Game Over', WIDTH / 2, HEIGHT / 2);
    }

    RestartObjects(){
        for (let i = this.enemyList.length-1; i>=0; i--){
            this.enemyList[i].Restart();
             
            console.log(this.enemyList[i]);
        }
        this.boss.Restart();
    }

    Render() {
        // Logic to render any UI elements related to the game controller
    }
}