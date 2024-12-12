// BOARD
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// BIRD
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdVelocityY = 0;
let gravity = 0.2;
let jumpVelocity = -6;

// PIPE
let pipeArray = [];
let pipeWidth = 43;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let pipeGap = 120;
let pipeSpeed = -2;

let topPipeImg;
let bottomPipeImg;
let birdImg;

// SCORE
let score = 0;

// GAME STATE
let gameOver = false;

window.onload = function () {
  board = document.querySelector("#board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // LOAD IMAGE
  birdImg = new Image();
  birdImg.src = "./assets/Vaishali Mam.png";

  topPipeImg = new Image();
  topPipeImg.src = "./assets/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./assets/bottompipe.png";

  birdImg.onload = function () {
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
  };

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);

  // EVENT LISTENER FOR JUMP
  document.addEventListener("keydown", function (e) {
    if (e.key === " " && !gameOver) {
      birdVelocityY = jumpVelocity;
    }
  });
};

function update() {
  if (!gameOver) {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // BIRD
    birdVelocityY += gravity;
    birdY += birdVelocityY;
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

    // COLLISION WITH GROUND
    if (birdY + birdHeight > boardHeight) {
      gameOver = true;
    }

    // PIPES
    for (let i = 0; i < pipeArray.length; i++) {
      let pipe = pipeArray[i];
      pipe.x += pipeSpeed;

      // COLLISION WITH PIPES
      if (
        birdX + birdWidth > pipe.x &&
        birdX < pipe.x + pipeWidth &&
        (birdY < pipe.y + pipe.height || birdY + birdHeight > pipe.y + pipeGap)
      ) {
        gameOver = true;
      }

      // SCORE
      if (pipe.x + pipeWidth / 2 === birdX && !pipe.passed) {
        score++;
        pipe.passed = true;
      }

      // DRAW PIPES
      context.drawImage(topPipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
      context.drawImage(
        bottomPipeImg,
        pipe.x,
        pipe.y + pipeGap,
        pipe.width,
        boardHeight - pipeGap - pipe.y
      );
    }

    // DRAW SCORE
    context.font = "24px Arial";
    context.fillStyle = "black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " + score, 10, 10);
  } else {
    // GAME OVER SCREEN
    context.font = "48px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over!", boardWidth / 2, boardHeight / 2);
    context.font = "24px Arial";
    context.fillText(
      "Press Space to restart",
      boardWidth / 2,
      boardHeight / 2 + 30
    );

    // EVENT LISTENER FOR RESTART
    document.addEventListener("keydown", function (e) {
      if (e.key === " ") {
        restartGame();
      }
    });
  }
}

function placePipes() {
  let pipeY = Math.floor(Math.random() * (boardHeight - pipeGap));
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: 0,
    width: pipeWidth,
    height: pipeY,
    passed: false,
  };

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: pipeY + pipeGap,
    width: pipeWidth,
    height: boardHeight - pipeGap - pipeY,
    passed: false,
  };

  pipeArray.push(topPipe);
  pipeArray.push(bottomPipe);
}

function restartGame() {
  birdY = boardHeight / 2;
  birdVelocityY = 0;
  pipeArray = [];
  score = 0;
  gameOver = false;
}
