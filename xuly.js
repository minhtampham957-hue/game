const canvas = document.getElementById("gamecv");
if (!canvas) {
  console.error("canvas element not found");
  throw new Error("canvas element not found");
}
const ctx = canvas.getContext("2d");
if (!ctx) {
  console.error("failed to get 2d context");
  throw new Error("failed to get 2d context");
}

// load chicken image
const chickenimg = new Image();
chickenimg.src = "ImageGames/chim.png";
chickenimg.onload = () => {
  console.log("chicken image loaded successfully");
};
chickenimg.onerror = () => {
  console.error("failed to load chicken image");
};

// load mabay
const shipImg = new Image();
shipImg.src = "ImageGames/maybay.png";

shipImg.onload = () => {
  console.log("ship image loaded");
};

shipImg.onerror = () => {
  console.error("failed to load ship image");
};
// game state
// let ship = {
//   x: canvas.width / 2 - 20,
//   y: canvas.height - 60,
//   width: 40,
//   height: 40,
//   fireRate: 50,
// };
let ship = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  fireRate: 50,
  bulletcount: 1,
};

let bullets = [];
let chickens = [];
let powerUps = [];
let eggs = [];
let score = 0;
let keys = {};
let lives = 3;
let gameover = false;
let lastshot = 0;

// function drawship() {
//   ctx.fillStyle = "cyan";
//   ctx.fillRect(ship.x, ship.y, ship.with, ship.height);
// }
function drawship() {
  if (shipImg.complete && shipImg.naturalWidth > 0) {
    ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  } else {
    ctx.fillStyle = "cyan";
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
  }
}

function drawbullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));
}

function drawchicken() {
  chickens.forEach((c) => {
    if (chickenimg.complete && chickenimg.naturalWidth > 0) {
      ctx.drawImage(
        chickenimg,
        c.x - c.radius,
        c.y - c.radius,
        c.radius * 2,
        c.radius * 2,
      );
    } else {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawPowerUps() {
  ctx.fillStyle = "green";
  powerUps.forEach((p) => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function draweggs() {
  ctx.fillStyle = "white";
  eggs.forEach((e) => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });
}

function movebullets() {
  bullets.forEach((b) => (b.y -= 5));
  bullets = bullets.filter((b) => b.y > -10);
}

function movechickens() {
  chickens = chickens.filter((c) => {
    c.y += 2;
    if (Math.random() < 0.001 && !gameover) {
      spawnegg(c.x, c.y);
    }
    if (c.y > canvas.height + c.radius) {
      lives--;
      if (lives <= 0) {
        gameover = true;
      }
      return false;
    }
    return true;
  });
}

function movePowerUps() {
  powerUps = powerUps.filter((p) => {
    p.y += 3;
    if (p.y > canvas.height + p.height) {
      return false;
    }
    return true;
  });
}

function moveeggs() {
  eggs.forEach((e) => (e.y += 5));
  eggs = eggs.filter((e) => e.y < canvas.height + e.height);
}

function spawnegg(x, y) {
  eggs.push({
    x: x - 5,
    y: y,
    width: 10,
    height: 10,
  });
}

function drawlives() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 25);
}

function collisiondetection() {
  const newbullets = [];
  let newchickens = chickens.slice();
  bullets.forEach((b) => {
    let bullethit = false;
    for (let i = newchickens.length - 1; i >= 0; i--) {
      const c = newchickens[i];
      if (
        b.x < c.x + c.radius &&
        b.x + b.width > c.x - c.radius &&
        b.y < c.y + c.radius &&
        b.y + b.height > c.y - c.radius
      ) {
        bullethit = true;
        if (Math.random() < 0.3) {
          powerUps.push({
            x: c.x - 10,
            y: c.y,
            width: 20,
            height: 20,
          });
        }
        newchickens.splice(i, 1);
        score += 1;
      }
    }
    if (!bullethit) {
      newbullets.push(b);
    }
  });
  powerUps = powerUps.filter((p) => {
    if (
      ship.x < p.x + p.width &&
      ship.x + ship.width > p.x &&
      ship.y < p.y + p.height &&
      ship.y + ship.height > p.y
    ) {
      ship.bulletcount = Math.min(ship.bulletcount + 1, 5);
      return false;
    }
    return true;
  });
  eggs = eggs.filter((e) => {
    if (
      ship.x < e.x + e.width &&
      ship.x + ship.width > e.x &&
      ship.y < e.y + e.height &&
      ship.y + ship.height > e.y
    ) {
      lives--;
      if (lives <= 0) {
        gameover = true;
      }
      return false;
    }
    return true;
  });

  newchickens = newchickens.filter((c) => {
    if (
      ship.x < c.x + c.radius &&
      ship.x + ship.width > c.x - c.radius &&
      ship.y < c.y + c.radius &&
      ship.y + ship.height > c.y - c.radius
    ) {
      lives--;
      if (lives <= 0) {
        gameover = true;
      }
      return false;
    }
    return true;
  });
  bullets = newbullets;
  chickens = newchickens;
}

function spawnchicken() {
  if (!gameover) {
    const x = Math.random() * (canvas.width - 30) + 15;
    chickens.push({ x, y: -20, radius: 15 });
  }
}

function resetgame() {
  ship = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    fireRate: 50,
  };
  bullets = [];
  chickens = [];
  powerUps = [];
  eggs = [];
  score = 0;
  lives = 3;
  gameover = false;
  lastshot = 0;
}

function update() {
  if (keys["ArrowLeft"]) ship.x -= 5;
  if (keys["ArrowRight"]) ship.x += 5;
  ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x));
  movebullets();
  movechickens();
  movePowerUps();
  moveeggs();
  collisiondetection();
}

function drawscore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`score: ${score}`, 10, 25);
  drawlives();
}

function gameloop() {
  if (gameover) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("game over", canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText(
      `score:${score}`,
      canvas.width / 2 - 80,
      canvas.height / 2 + 50,
    );
    ctx.fillText(
      "press space to restart",
      canvas.width / 2 - 150,
      canvas.height / 2 + 100,
    );
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawship();
  drawbullets();
  drawchicken();
  drawPowerUps();
  draweggs();
  drawscore();
  requestAnimationFrame(gameloop);
}

let spawnInterval = setInterval(spawnchicken, 1000);

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " " && !gameover) {
    const now = Date.now();
    if (now - lastshot >= ship.fireRate) {
      for (let i = 0; i < ship.bulletcount; i++) {
        const offset = (i - (ship.bulletcount - 1) / 2) * 10;
        bullets.push({
          x: ship.x + ship.width / 2 - 2.5 + offset,
          y: ship.y,
          width: 5,
          height: 10,
        });
      }
      lastshot = now;
    }
  } else if (e.key === " " && gameover) {
    clearInterval(spawnInterval);
    resetgame();
    spawnInterval = setInterval(spawnchicken, 1000);
    gameloop();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

gameloop();
