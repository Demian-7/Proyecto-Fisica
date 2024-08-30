let y = 50;
let gravedad = 9.81;

const WIDTH = 800;
const HEIGHT = 800;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player = new Player(100,100,50,50);
  ball = new Proyectile(400,y,50, 10, 10);
}

function draw() {
  background(0);
  let dt = deltaTime /1000;
  
  fill(255);
  
  //Process
  ball.fallAndBounce(dt,gravedad);
  player.move(10,10,dt);
  
  
  //Render
  player.dibujar();
  ball.dibujar();
}