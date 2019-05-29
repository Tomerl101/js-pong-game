let canvas;
let ctx;

let player;
let aiPlayer;
let ball;
let gameMode = GAME_MODES.STOP;
let gameOver = false;
let delayAmount;
let targetForBall;

document.addEventListener('DOMContentLoaded', setupCanvas);

//SetupCanvas
function setupCanvas() {
  canvas = document.getElementById('pong-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 1400;
  canvas.height = 1000;
  player = new Player('left');
  aiPlayer = new Player('right');
  ball = new Ball(SPEED.VERY_SLOW);
  aiPlayer.setSpeed(SPEED.SLOW); //less speed make aiPlayer less difficult
  targetForBall = player;
  delayAmount = new Date().getTime();
  document.addEventListener('keydown', movePlayer);
  document.addEventListener('keyup', stopPlayer);
  draw();
}

//Draw
function draw() {
  clearCanvas();
  drawPlayers();
  drawBall();
  drawText();
}

//clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//draw player
function drawPlayers() {
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(aiPlayer.x, aiPlayer.y, aiPlayer.width, aiPlayer.height);
}

function drawBall() {
  ctx.fillStyle = 'white';
  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function drawText() {
  ctx.font = '80px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(player.score.toString(), canvas.width / 2 - 300, 100);
  ctx.fillText(aiPlayer.score.toString(), canvas.width / 2 + 300, 100);

  if (player.score === WIN_SCORE) {
    ctx.fillText('Player Wins', canvas.width / 2, 300);
    gameOver = true;
  }

  if (aiPlayer.score === WIN_SCORE) {
    ctx.fillText('AI Wins', canvas.width / 2, 300);
    gameOver = true;
  }
}

//Update
function update() {
  if (!gameOver) {
    //TODO: add to the same if statment
    if (ball.x <= 0) {
      //if ball passed behinde the player
      resetBall(aiPlayer, player);
    }

    if (ball.x >= canvas.width - ball.width) {
      resetBall(player, aiPlayer);
    }

    //change direction if ball hit floor or celling
    if (ball.y <= 0) {
      ball.moveY = DIRECTION.DOWN;
    }

    if (ball.y >= canvas.height - ball.height) {
      ball.moveY = DIRECTION.UP;
    }

    //player movement
    if (player.move == DIRECTION.DOWN) {
      player.y += player.speed;
    } else if (player.move == DIRECTION.UP) {
      player.y -= player.speed;
    }

    //prevent player to go outside the canvas borders
    if (player.y < 0) {
      player.y = 0;
    } else if (player.y >= canvas.height - player.height) {
      player.y = canvas.height - player.height;
    }

    //ai player movement (follow the ball height)
    if (aiPlayer.y > ball.y - aiPlayer.height / 2) {
      if (ball.moveX === DIRECTION.RIGHT) {
        aiPlayer.y -= aiPlayer.speed;
      }
    }

    if (aiPlayer.y < ball.y - aiPlayer.height / 2) {
      if (ball.moveX === DIRECTION.RIGHT) {
        aiPlayer.y += aiPlayer.speed;
      }
    }

    //collision detection
    //is ball touching player?
    if (ball.x <= player.x + player.width && ball.x + ball.width >= player.x) {
      if (
        ball.y <= player.y + player.height &&
        ball.y + ball.height >= player.y
      ) {
        ball.x = player.x + ball.width;
        ball.moveX = DIRECTION.RIGHT; //if hit change ball diraction to other side
        //TODO:make hit sound
      }
    }

    if (
      ball.x - ball.width <= aiPlayer.x &&
      ball.x >= aiPlayer.x - aiPlayer.width
    ) {
      if (
        ball.y <= aiPlayer.y + aiPlayer.height &&
        ball.y + ball.height >= aiPlayer.y
      ) {
        ball.x = aiPlayer.x - ball.width;
        ball.moveX = DIRECTION.LEFT; //if hit change ball diraction to other side
        //TODO:make hit sound
      }
    }

    //prevent player to go outside the canvas borders
    if (aiPlayer.y < 0) {
      aiPlayer.y = 0;
    } else if (aiPlayer.y >= canvas.height - player.height) {
      aiPlayer.y = canvas.height - player.height;
    }

    if (addDelay() && targetForBall) {
      ball.moveX = targetForBall === player ? DIRECTION.LEFT : DIRECTION.RIGHT;
      ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())]; //move ball up or down randomly

      ball.y = canvas.height / 2;
      targetForBall = null;
    }

    //ball movement
    if (ball.moveY == DIRECTION.UP) {
      ball.y -= ball.speed;
    } else if (ball.moveY == DIRECTION.DOWN) {
      ball.y += ball.speed;
    }

    if (ball.moveX == DIRECTION.LEFT) {
      ball.x -= ball.speed;
    } else if (ball.moveX == DIRECTION.RIGHT) {
      ball.x += ball.speed;
    }
  }
}
//MovePlayer
function movePlayer(keyPressed) {
  if (gameMode == GAME_MODES.STOP) {
    gameMode = GAME_MODES.RUNNING;
    window.requestAnimationFrame(gameLoop);
  }

  //TODO: refactor to use switch cases
  if (
    keyPressed.keyCode === KEYS_CODE.UP ||
    keyPressed.keyCode === KEYS_CODE.W
  ) {
    player.move = DIRECTION.UP;
  }

  if (
    keyPressed.keyCode === KEYS_CODE.DOWN ||
    keyPressed.keyCode === KEYS_CODE.S
  ) {
    player.move = DIRECTION.DOWN;
  }
}

//StopPlayer
function stopPlayer(e) {
  player.move = DIRECTION.STOPPED;
}
//GameLoop -> update -> draw
function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

//ResetBall
function resetBall(scoredPlayer, opponentPlayer) {
  scoredPlayer.incScore();

  let newBallSpeed = ball.incSpeed(); //increase difficult every goal
  ball = new Ball(newBallSpeed); //make new ball to center it on the screen TODO:add resetPos method to ball class
  targetForBall = opponentPlayer;
  delayAmount = new Date().getTime();
}

//AddDelay
function addDelay() {
  return new Date().getTime() - delayAmount >= 1000;
}
