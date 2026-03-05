// ===== CONFIG =====
let move_speed = 5;
let gravity = 0.5;

// ===== ELEMENTS =====
let bird = document.querySelector(".bird");
let bird_imgs = [
  "ImageGames/b1.png",
  "ImageGames/b2.png",
  "ImageGames/b3.png",
  "ImageGames/b4.png",
];
let bird_img_index = 0;

let score_val = document.querySelector(".score_val");
let score_title = document.querySelector(".score_title");
let message = document.querySelector(".mess");
let background = document.querySelector(".bg").getBoundingClientRect();

// ===== STATE =====
let game_state = "Start";
let bird_dy = 0;

// ===== ANIMATE BIRD (Đập cánh) =====
function animate_bird() {
  if (game_state !== "Play") return;

  bird_img_index = (bird_img_index + 1) % bird_imgs.length;
  bird.src = bird_imgs[bird_img_index];

  setTimeout(animate_bird, 150);
}

// ===== KEY CONTROL =====
document.addEventListener("keydown", (e) => {
  // Bắt đầu hoặc chơi lại game khi nhấn Enter
  if (e.key === "Enter" && game_state !== "Play") {
    // Xóa tất cả ống cũ
    document.querySelectorAll(".pipe").forEach((p) => p.remove());

    // Reset trạng thái chim
    bird.style.top = "40vh";
    bird.style.transform = "none";
    bird.src = "ImageGames/b1.png";

    bird_dy = 0;
    score_val.innerHTML = "0";
    score_title.innerHTML = "Điểm :";
    message.innerHTML = "";

    game_state = "Play";

    // Chạy các hàm logic
    play();
    animate_bird();
    apply_gravity();
    create_pipe();
  }

  // Nhảy lên khi nhấn ArrowUp hoặc Space
  if ((e.key === "ArrowUp" || e.key === " ") && game_state === "Play") {
    bird_dy = -7.6;
  }
});

// ===== GRAVITY (Trọng lực) =====
function apply_gravity() {
  if (game_state !== "Play") return;

  bird_dy += gravity;
  let bird_props = bird.getBoundingClientRect();

  // Kiểm tra va chạm với trần hoặc đất
  if (bird_props.bottom >= background.bottom || bird_props.top <= 0) {
    end_game();
    return;
  }

  bird.style.top = bird_props.top + bird_dy + "px";
  requestAnimationFrame(apply_gravity);
}

// ===== MOVE PIPES + COLLISION + SCORE =====
function play() {
  function move() {
    if (game_state !== "Play") return;

    let pipes = document.querySelectorAll(".pipe");
    let bird_props = bird.getBoundingClientRect();

    pipes.forEach((pipe) => {
      let pipe_props = pipe.getBoundingClientRect();

      // Xóa ống khi trôi khỏi màn hình
      if (pipe_props.right <= 0) {
        pipe.remove();
        return;
      }

      // Xử lý va chạm với ống tre
      if (
        bird_props.left < pipe_props.left + pipe_props.width &&
        bird_props.left + bird_props.width > pipe_props.left &&
        bird_props.top < pipe_props.top + pipe_props.height &&
        bird_props.top + bird_props.height > pipe_props.top
      ) {
        end_game();
        return;
      }

      // Tính điểm (Chỉ tính khi vượt qua ống dưới)
      if (pipe_props.right < bird_props.left && pipe.increase_score === "1") {
        score_val.innerHTML = +score_val.innerHTML + 1;
        pipe.increase_score = "0";
      }

      // Di chuyển ống sang trái
      pipe.style.left = pipe_props.left - move_speed + "px";
    });

    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}

// ===== KẾT THÚC GAME =====
function end_game() {
  game_state = "End";
  message.innerHTML = "Nhấn Enter Để Chơi Lại";
  message.style.left = "28vw";
}

// ===== CREATE PIPE (TẠO ỐNG TRE) =====
let pipe_seperation = 0;
let pipe_gap = 35; // Khoảng cách giữa 2 ống tre

function create_pipe() {
  if (game_state !== "Play") return;

  // Cứ sau một khoảng thời gian thì tạo cặp ống mới
  if (pipe_seperation > 115) {
    pipe_seperation = 0;

    let pipe_posi = Math.floor(Math.random() * 43) + 8;

    // ỐNG TRE TRÊN (Xoay ngược)
    let pipe_inv = document.createElement("div");
    pipe_inv.className = "pipe pipe_inv";
    pipe_inv.style.top = pipe_posi - 70 + "vh";
    pipe_inv.style.left = "100vw";
    document.body.appendChild(pipe_inv);

    // ỐNG TRE DƯỚI
    let pipe = document.createElement("div");
    pipe.className = "pipe";
    pipe.style.top = pipe_posi + pipe_gap + "vh";
    pipe.style.left = "100vw";
    pipe.increase_score = "1"; // Đánh dấu ống này để tính điểm
    document.body.appendChild(pipe);
  }

  pipe_seperation++;
  requestAnimationFrame(create_pipe);
}