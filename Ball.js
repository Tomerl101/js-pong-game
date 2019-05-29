class Ball {
  constructor(newSpeed) {
    this.width = 15;
    this.height = 15;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.moveX = DIRECTION.STOPPED;
    this.moveY = DIRECTION.STOPPED;
    this.speed = newSpeed;
  }

  incSpeed() {
    this.speed += 0.2;
    return this.speed;
  }
  //resetBall
}