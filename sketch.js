const WIDTH = 800;
const HEIGHT = 400;

let clouds= []
let bgMusic = null;
let musicStarted = false;
let bgImage = null;

function preload() {
  // pre loading assets
  bgMusic = loadSound('Ascendancy of the Cube.mp3');
  bgImage = loadImage('synthwave_sunset.gif');
}

function setup() {
  game = new GameEngine(WIDTH, HEIGHT);
  gameController = new GameController();
  
  player = new Player(100, 100, 40, 1);
  
  gameController.GetPlayer(player);


  // theFloor = new TheFloor();
  for(let i=0; i<3; i++){
  clouds.push(new CloudLayer(i + 1));
  }

  bgMusic.setVolume(0.2);
}

function keyPressed() {
  if (key === ' ') {
    if (player.OnGround()) {
      player.Jump();
    } else {
      player.StartGlide();
    }
  }
  if (key === 'Control') {
    player.FallFast();
  }
}

function keyReleased() {
  if (key === ' ') {
    player.StopGlide();
  }
}
function mousePressed() {
    if (!musicStarted) {
     bgMusic.loop();
     musicStarted = true;

     if (getAudioContext().state !== 'running'){
      getAudioContext.resume();
     }
    }
    if (player.Contains(mouseX,mouseY)) {
    
    player.ChangeShape();
    }
}

function draw() {
  let dt = deltaTime / 1000;
  //print(1/(deltaTime/1000));
  image(bgImage,0,0, WIDTH, HEIGHT);


  //Process
  game.UpdateAll(dt);
  //ball.fallAndBounce(dt,gravedad);
  //player.move(10,10,dt);


  //Render
  game.RenderAll();


  //Collitions
  game.CheckCollitionAll();
  
}