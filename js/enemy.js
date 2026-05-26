class Enemy {
  constructor(x, y, patrolLeft, patrolRight, speed) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 40;
    this.startX = x;
    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.speed = speed;
    this.dir = 1;
    this.time = 0;
  }

  update() {
    this.x += this.speed * this.dir;
    if (this.x >= this.patrolRight || this.x <= this.patrolLeft) {
      this.dir *= -1;
    }
    this.time += 0.05;
  }

  draw(ctx) {
    // Body
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Head
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(this.x + 2, this.y - 6, this.width - 4, 10);

    // Eyes
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(this.x + 6, this.y + 4, 6, 6);
    ctx.fillRect(this.x + this.width - 12, this.y + 4, 6, 6);

    // Pupils (look in direction)
    ctx.fillStyle = '#000';
    const pupilOff = this.dir > 0 ? 3 : 0;
    ctx.fillRect(this.x + 6 + pupilOff, this.y + 5, 3, 4);
    ctx.fillRect(this.x + this.width - 12 + pupilOff, this.y + 5, 3, 4);

    // Antenna
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + 8, this.y - 6);
    ctx.lineTo(this.x + 4, this.y - 16);
    ctx.moveTo(this.x + this.width - 8, this.y - 6);
    ctx.lineTo(this.x + this.width - 4, this.y - 16);
    ctx.stroke();

    // Blinking light
    ctx.fillStyle = Math.sin(this.time * 8) > 0 ? '#e74c3c' : '#ff7675';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y - 10, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
