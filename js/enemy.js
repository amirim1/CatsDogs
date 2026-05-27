class Enemy {
  constructor(x, y, patrolLeft, patrolRight, speed = 1.3, pattern = 'patrol') {
    this.x = x;
    this.y = y;
    this.width = 34;
    this.height = 40;
    this.patrolLeft = patrolLeft;
    this.patrolRight = Math.max(patrolLeft, patrolRight - this.width);
    this.speed = speed;
    this.dir = 1;
    this.time = Math.random() * 100;
    this.pattern = pattern;
    this.pauseTimer = 0;
  }

  update(game) {
    this.time += 0.08;
    if (this.pauseTimer > 0) {
      this.pauseTimer--;
      return;
    }

    let target = null;
    if (this.pattern === 'chase') {
      let best = 360;
      game.players.forEach(player => {
        if (player.lives <= 0) return;
        const dx = Math.abs((player.x + player.width / 2) - (this.x + this.width / 2));
        const dy = Math.abs((player.y + player.height / 2) - (this.y + this.height / 2));
        if (dx < best && dy < 150) {
          best = dx;
          target = player;
        }
      });
    }

    if (target) {
      this.dir = target.x > this.x ? 1 : -1;
      this.x += this.speed * 1.35 * this.dir;
    } else {
      const multiplier = this.pattern === 'rush' ? 1.9 : 1;
      this.x += this.speed * multiplier * this.dir;
    }

    if (this.x >= this.patrolRight) {
      this.x = this.patrolRight;
      this.dir = -1;
      if (this.pattern === 'rush') this.pauseTimer = 22;
    }
    if (this.x <= this.patrolLeft) {
      this.x = this.patrolLeft;
      this.dir = 1;
      if (this.pattern === 'rush') this.pauseTimer = 22;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));

    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(3, this.height - 4, this.width - 6, 7);

    ctx.fillStyle = '#e74c3c';
    this.roundRect(ctx, 0, 5, this.width, this.height - 5, 7);
    ctx.fill();

    ctx.fillStyle = '#c0392b';
    this.roundRect(ctx, 4, 0, this.width - 8, 14, 5);
    ctx.fill();

    ctx.fillStyle = '#ffe66d';
    ctx.fillRect(7, 14, 7, 7);
    ctx.fillRect(this.width - 14, 14, 7, 7);

    ctx.fillStyle = '#111';
    const eyeOffset = this.dir > 0 ? 3 : 0;
    ctx.fillRect(8 + eyeOffset, 15, 3, 4);
    ctx.fillRect(this.width - 13 + eyeOffset, 15, 3, 4);

    ctx.strokeStyle = '#842029';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(9, 1);
    ctx.lineTo(5, -11);
    ctx.moveTo(this.width - 9, 1);
    ctx.lineTo(this.width - 5, -11);
    ctx.stroke();

    ctx.fillStyle = Math.sin(this.time * 5) > 0 ? '#ff7675' : '#ffd166';
    ctx.beginPath();
    ctx.arc(this.width / 2, -7, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#842029';
    ctx.fillRect(8, this.height - 6, 6, 8);
    ctx.fillRect(this.width - 14, this.height - 6, 6, 8);
    ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }
}
