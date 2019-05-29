class Player {
  constructor(side) {
    this.width = 15;
    this.height = 65;
    this.x = side == 'left' ? 150 : canvas.width - 150;
    this.y = canvas.height / 2;
    this.score = 0;
    this.move = DIRECTION.STOPPED; // paddle move only in the Y axis
    this.speed = SPEED.REGULAR;
  }

  incScore() {
    this.score++;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  //draw player
}
