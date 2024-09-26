let y = 50;
let gravedad = 9.81;

const WIDTH = 800;
const HEIGHT = 400;

let clouds= []

function setup() {
  game = new GameEngine(WIDTH, HEIGHT);
  gameController = new GameController();
  
  player = new Player(100, 100, 40);
  
  // theFloor = new TheFloor();
  for(let i=0; i<3; i++){
  clouds.push(new CloudLayer(i + 1));
  }

}

function keyPressed() {

  if (key == ' ' ) {
    player.Jump();
  }
  if (key == 'Control'){
    player.FallFast();
  }
}

function mousePressed() {
  // if (!musicStarted) {
  //   bgMusic.loop();
  //   musicStarted = true;
  // } !gameOver && -- Esto estaba en el if de abajo
  if (player.Contains(mouseX,mouseY)) {
    
    player.ChangeShape();
  }
}

function draw() {
  let dt = deltaTime / 1000;
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