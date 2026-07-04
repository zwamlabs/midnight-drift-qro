const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const speedText = document.getElementById("speed");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let car = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 35,
  height: 60,
  angle: 0,
  speed: 0,
  maxSpeed: 8,
  acceleration: 0.15,
  friction: 0.04,
  turnSpeed: 0.055
};

let keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

function drawRoad() {
  ctx.fillStyle = "#181818";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 80;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.strokeStyle = "#f5f5f5";
  ctx.lineWidth = 4;
  ctx.setLineDash([30, 30]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawBuildings() {
  ctx.fillStyle = "#222";

  for (let i = 0; i < 6; i++) {
    ctx.fillRect(20, i * 140 + 20, 90, 90);
    ctx.fillRect(canvas.width - 110, i * 140 + 20, 90, 90);
  }

  ctx.fillStyle = "#ff0055";

  for (let i = 0; i < 6; i++) {
    ctx.fillRect(45, i * 140 + 45, 10, 10);
    ctx.fillRect(canvas.width - 80, i * 140 + 45, 10, 10);
  }
}

function drawCar() {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);

  ctx.fillStyle = "#ff0055";
  ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);

  ctx.fillStyle = "#111";
  ctx.fillRect(-12, -20, 24, 18);

  ctx.fillStyle = "#00f7ff";
  ctx.fillRect(-car.width / 2, car.height / 2 - 8, car.width, 5);

  ctx.restore();
}

function updateCar() {
  if (keys.up) {
    car.speed += car.acceleration;
  }

  if (keys.down) {
    car.speed -= car.acceleration;
  }

  if (!keys.up && !keys.down) {
    if (car.speed > 0) car.speed -= car.friction;
    if (car.speed < 0) car.speed += car.friction;
  }

  if (car.speed > car.maxSpeed) car.speed = car.maxSpeed;
  if (car.speed < -car.maxSpeed / 2) car.speed = -car.maxSpeed / 2;

  if (Math.abs(car.speed) > 0.1) {
    if (keys.left) car.angle -= car.turnSpeed;
    if (keys.right) car.angle += car.turnSpeed;
  }

  car.x += Math.sin(car.angle) * car.speed;
  car.y -= Math.cos(car.angle) * car.speed;

  if (car.x < 0) car.x = canvas.width;
  if (car.x > canvas.width) car.x = 0;
  if (car.y < 0) car.y = canvas.height;
  if (car.y > canvas.height) car.y = 0;

  speedText.textContent = Math.abs(Math.round(car.speed * 18));
}

function gameLoop() {
  drawRoad();
  drawBuildings();
  updateCar();
  drawCar();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") keys.up = true;
  if (e.key === "s" || e.key === "ArrowDown") keys.down = true;
  if (e.key === "a" || e.key === "ArrowLeft") keys.left = true;
  if (e.key === "d" || e.key === "ArrowRight") keys.right = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "ArrowUp") keys.up = false;
  if (e.key === "s" || e.key === "ArrowDown") keys.down = false;
  if (e.key === "a" || e.key === "ArrowLeft") keys.left = false;
  if (e.key === "d" || e.key === "ArrowRight") keys.right = false;
});

function setupButton(id, key) {
  const button = document.getElementById(id);

  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys[key] = true;
  });

  button.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys[key] = false;
  });
}

setupButton("accelerate", "up");
setupButton("brake", "down");
setupButton("left", "left");
setupButton("right", "right");

gameLoop();