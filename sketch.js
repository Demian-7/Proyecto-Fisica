let y = 50;
let gravedad = 9.81;

const WIDTH = 800;
const HEIGHT = 400;



function setup() {
  game = new GameEngine(WIDTH, HEIGHT);
  gameController = new GameController();
  gameController.setupGame();
  player = new Player(100, 100, 50, 50);
  theFloor = new TheFloor();
  enemy = new GroundEnemy(WIDTH-100, HEIGHT-30, 20, 10);


}

function keyPressed() {

  if (key == ' ' ) {
    player.jump();
  }
  if (key == 'Control'){
    
  }
}

function draw() {

  let dt = deltaTime / 100;
  //print(1/(deltaTime/1000));


  //Process
  game.UpdateAll(dt);
  //ball.fallAndBounce(dt,gravedad);
  //player.move(10,10,dt);


  //Render
  game.RenderAll();


  //Collitions
  game.CheckCollitionAll();
}