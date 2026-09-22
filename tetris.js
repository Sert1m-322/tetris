const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("next");
const ctx2 = canvas2.getContext("2d");

const kletka = 40;
const cols = 10;
const rows = 20;

const score_text = document.querySelector(".points");
const best_text = document.querySelector(".best");
const speed_text = document.querySelector(".speed");

let matrix = [
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
  ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
];

let col =
  "#" +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
ctx.fillStyle = col;
let HEIGHT = 800;
let WIDTH = 400;
let y_p = 0;
let x_p = 4;
let score = 0;
let is_paused = false;
let game_over = false;
let timer_id = null;
let high_score = Number(localStorage.getItem("high_score")) || 0;

let cube_shape = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

let f_molnia = [
  [0, 0],
  [1, 0],
  [1, 1],
  [2, 1],
];

let f_molnia_2 = [
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
];

let f_2x2 = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

let f_1x4 = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
];

let f_r = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
];

let f_L = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
];

let f_chle = [
  [0, 0],
  [1, 0],
  [2, 0],
  [1, 1],
];

let spisok = [f_r, f_L, f_2x2, f_molnia, f_molnia_2, f_1x4, f_chle];

let next_shape = spisok[Math.floor(Math.random() * spisok.length)];

function cube() {
  for (let i = 0; i < cube_shape.length; i++) {
    let x1 = (x_p + cube_shape[i][0]) * kletka;
    let y1 = (y_p + cube_shape[i][1]) * kletka;
    let x2 = x1 + kletka;
    let y2 = y1 + kletka;

    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  }
}

function next_shape_f() {
  for (let i = 0; i < next_shape.length; i++) {
    let x1 = (1 + next_shape[i][0]) * kletka;
    let y1 = (1 + next_shape[i][1]) * kletka;
    let x2 = x1 + kletka;
    let y2 = y1 + kletka;

    ctx2.fillRect(x1, y1, x2 - x1, y2 - y1);
  }
}

function matrix_draw() {
  for (let a = 0; a < matrix.length; a++) {
    for (let b = 0; b < matrix[a].length; b++) {
      if (matrix[a][b] === "1") {
        let x1 = b * kletka;
        let y1 = a * kletka;

        let x2 = x1 + kletka;
        let y2 = y1 + kletka;
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      }
    }

  }
}

function otrisovka() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  cube();
  matrix_draw();
  ctx2.clearRect(0, 0, WIDTH, HEIGHT);
  next_shape_f();

  score_text.innerText = `Score: ${score}`;
  best_text.innerText = `Best: ${high_score}`;
  speed_text.innerText = `Speed in ms: ${tick_time}`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.strokeRect(x * kletka, y * kletka, kletka, kletka);
    }
  }
}

function canMove(dx, dy) {
  for (let i = 0; i < cube_shape.length; i++) {
    let x = x_p + cube_shape[i][0] + dx;
    let y = y_p + cube_shape[i][1] + dy;

    if (x < 0 || x >= 10 || y >= 20 || matrix[y][x] === "1") {
      return false;
    }
  }
  return true;
}

document.addEventListener("keydown", function (event) {
  beweg(event);
  roll(event);
  pausing(event);
});

canvas.addEventListener("click", function (event) {
  if (game_over) {
    let x = event.offsetX;
    let y = event.offsetY;
    if (x >= 40 && x <= 360 && y >= 500 && y <= 580) {
      restart();
    }
  }
});

function beweg(event) {
  if (is_paused == true || game_over == true) {
    return;
  }

  if (event.key === "ArrowLeft" && canMove(-1, 0)) {
    x_p -= 1;
    otrisovka();
  } else if (event.key === "ArrowRight" && canMove(1, 0)) {
    x_p += 1;
    otrisovka();
  } else if (event.key === "ArrowDown" && canMove(0, 1)) {
    y_p += 1;
    otrisovka();
  } else if (event.key === "r" || event.key === "R") {
    restart();
  } else if (event.key === " ") {
    while (canMove(0, 1)) {
      y_p += 1;
    }

    otrisovka();
  }
}

function roll(event) {
  if (is_paused == true || game_over === true) {
    return;
  }

  let new_list = [];
  let can_rotate = true;

  if (event.key === "e" || event.key === "E") {
    for (let block of cube_shape) {
      let new_x = -block[1];
      let new_y = block[0];
      new_list.push([new_x, new_y]);
    }
  } else if (event.key === "q" || event.key === "Q") {
    for (let block of cube_shape) {
      let new_x = block[1];
      let new_y = -block[0];
      new_list.push([new_x, new_y]);
    }
  } else {
    return;
  }

  for (let block of new_list) {
    let r_x = x_p + block[0];
    let r_y = y_p + block[1];

    if (r_x < 0 || r_x >= 10 || r_y < 0 || r_y >= 20) {
      can_rotate = false;
      break;
    }
    if (r_y >= 0 && matrix[r_y][r_x] == "1") {
      can_rotate = false;
      break;
    }
  }

  if (can_rotate && is_paused == false) {
    cube_shape = new_list;
    otrisovka();
  }
}

function matrix_add() {
  for (let i = 0; i < cube_shape.length; i++) {
    let x = x_p + cube_shape[i][0];
    let y = y_p + cube_shape[i][1];
    matrix[y][x] = "1";
  }
}

function delet() {
  let a = 0;
  let i = 19;
  while (i >= 0) {
    if (!matrix[i].includes("0")) {
      matrix.splice(i, 1);
      matrix.unshift(Array(10).fill("0"));
      a += 1;
    } else {
      i -= 1;
    }
  }

  if (a === 1) {
    score += 100;
  } else if (a === 2) {
    score += 300;
  } else if (a === 3) {
    score += 700;
  } else if (a >= 4) {
    score += 1500;
  }

  if (score > high_score) {
    high_score = score;
    localStorage.setItem("high_score", high_score);
  }
}

function pausing(event) {
  if (event.key === "Escape") {
    is_paused = !is_paused;

    if (is_paused) {
      ctx.fillStyle = "red";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("PAUSE", 200, 400);
    } else {
      otrisovka();
      tick();
    }
  }
}

function restart(event = null) {
  if (timer_id !== null) {
    clearTimeout(timer_id);
  }

  score = 0;
  matrix = Array.from({ length: 20 }, () => Array(10).fill("0"));

  matrix.push(Array(10).fill("1"));

  game_over = false;

  cube_shape = spisok[Math.floor(Math.random() * spisok.length)];
  next_shape = spisok[Math.floor(Math.random() * spisok.length)];
  col =
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
  ctx.fillStyle = col;

  y_p = 0;
  x_p = 4;

  otrisovka();
  tick();
}

let tick_time = 1000;

function tick() {
  if (is_paused == true || game_over == true) {
    return;
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  if (!canMove(0, 1) && y_p < 1) {
    game_over = true;
    ctx.fillStyle = "red";

    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME", 200, 220);
    ctx.fillText("OVER", 200, 260);

    ctx.fillStyle = "black";
    ctx.font = "bold 34px Arial";
    ctx.fillText(`Your score: ${score}`, 200, 340);

    ctx.fillStyle = "gray";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Best score: ${high_score}`, 200, 440);

    ctx.fillStyle = "black";
    ctx.fillRect(40, 500, 360 - 40, 580 - 500);

    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Restart game", 200, 540);
    return;
  }

  if (canMove(0, 1)) {
    y_p += 1;
  } else {
    matrix_add();
    delet();
    y_p = 0;
    x_p = 4;
    cube_shape = next_shape;
    next_shape = spisok[Math.floor(Math.random() * spisok.length)];

    col =
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");

    ctx.fillStyle = col;
  }
  otrisovka();

  tick_time = 1000 - Math.floor(score / 10);

  if (tick_time < 200) {
    tick_time = 200;
  }

  timer_id = setTimeout(tick, tick_time);
}

tick();


