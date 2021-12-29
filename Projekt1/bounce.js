var canvas, ctx, container;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
var ball;
var message = "";

// predkosc osi x
var vx = 11;
// predkosc osi y
var vy = 11;
var raf;
var gravity = 0.5;
var bounce = 0.5;
var xFriction = 0.2;
ball = { x: 100, y: 100, radius: 15, status: 0, color: "red" };
let state = 0;
var flaga = 0;
async function simulate(wspX, wspY,VX,VY,RAY,ACC,RES,RUB) {

  ball.x = parseInt(wspX);
  ball.y = parseInt(wspY);
  vx = parseInt(VX);
  vy = parseInt(VY);
  ball.radius = parseInt(RAY);
  gravity = parseFloat(ACC);
  bounce = parseFloat(RES);
  xFriction = parseFloat(RUB);
  //setInterval(draw, 1000 / 35);
  
  setupCanvas();
  if(flaga == 0)
  {
    raf = window.requestAnimationFrame(draw);
    
  }
  else
  {
    raf = window.cancelAnimationFrame(draw);
  }
  

  flaga = 1;
  console.log(flaga);
}

function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration * 1000);
  });
}

async function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "solid #000";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
  if (flaga == 0) {
    await sleep(0.5);
    flaga = 1;
  }
  ballMovement();
}

function ballMovement() {
  ball.x += vx;
  ball.y += vy;
  vy += gravity;


  //If either wall is hit, change direction on x axis
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    vx *= -1;
  }

  // Ball hits the floor
  if (ball.y + ball.radius > canvas.height) {
    // ||

    // Re-positioning on the base
    ball.y = canvas.height - ball.radius;

    //bounce the ball
    vy *= -bounce;
    //do this otherwise, ball never stops bouncing
    if (vy < 0 && vy > -2.1) vy = 0;
    //do this otherwise ball never stops on xaxis
    if (Math.abs(vx) < 1.1) vx = 0;

    xF();
  }
  raf = window.requestAnimationFrame(draw);
}

function xF() {
  if (vx > 0) vx = vx - xFriction;
  if (vx < 0) vx = vx + xFriction;
}

function setupCanvas() {
  container = document.createElement("div");
  container.className = "container";
  container.style.width = "800px";
  container.style.height = "600px";
  container.style.background = "blue";
  container.style.cssText =
    "font:20px;position:absolute;top:150px;left:1050px;border:3px  Verdana;";

  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(container);
  container.appendChild(canvas);

  ctx.strokeStyle = "black";

  ctx.lineWidth = 3;
}
