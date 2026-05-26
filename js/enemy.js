class Enemy {
  constructor(x, y, patrolLeft, patrolRight, speed, pattern) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 40;
    this.startX = x;
    this.patrolLeft = patrolLeft;
    this.patrolRight = patrolRight;
    this.speed = speed || 2;
    this.dir = 1;
    this.time = 0;
    this.pattern = pattern || 'patrol';
    this.pauseTimer = 0;
    this.patternTimer = 300 + Math.floor(Math.random() * 180);
  }

  update() {
    this.time += 0.05;

    // Periodically switch pattern
    this.patternTimer--;
    if (this.patternTimer <= 0) {
      const patterns = ['patrol', 'rush', 'random', 'chase'];
      this.pattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = 300 + Math.floor(Math.random() * 180);
    }

    // Pause timer
    if (this.pauseTimer > 0) {
      this.pauseTimer--;
      return;
    }

    const players = Game.players;

    switch (this.pattern) {
      case 'patrol':
        this.x += this.speed * this.dir;
        if (this.x >= this.patrolRight) { this.x = this.patrolRight; this.dir = -1; }
        if (this.x <= this.patrolLeft) { this.x = this.patrolLeft; this.dir = 1; }
        break;

      case 'rush':
        this.x += this.speed * 2.5 * this.dir;
        if (this.x >= this.patrolRight || this.x <= this.patrolLeft) {
          this.dir *= -1;
          this.pauseTimer = 40 + Math.floor(Math.random() * 40);
        }
        break;

      case 'random':
        if (Math.random() < 0.02) this.dir *= -1;
        this.x += this.speed * this.dir;
        if (this.x >= this.patrolRight) { this.x = this.patrolRight; this.dir = -1; }
        if (this.x <= this.patrolLeft) { this.x = this.patrolLeft; this.dir = 1; }
        break;

      case 'chase':
        let target = null;
        let minDist = 300;
        players.forEach(p => {
          if (p.lives <= 0) return;
          const d = Math.abs(p.x - this.x);
          if (d < minDist) {
            minDist = d;
            target = p;
          }
        });
        if (target) {
          this.dir = target.x > this.x ? 1 : -1;
          this.x += this.speed * this.dir;
        } else {
          this.x += this.speed * this.dir;
          if (this.x >= this.patrolRight || this.x <= this.patrolLeft) this.dir *= -1;
        }
        break;
    }
  }

  draw(ctx) {
    // Body
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Head / antenna base
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(this.x + 2, this.y - 6, this.width - 4, 10);

    // Eyes
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(this.x + 6, this.y + 4, 6, 6);
    ctx.fillRect(this.x + this.width - 12, this.y + 4, 6, 6);

    // Pupils
    ctx.fillStyle = '#000';
    const off = this.dir > 0 ? 3 : 0;
    ctx.fillRect(this.x + 6 + off, this.y + 5, 3, 4);
    ctx.fillRect(this.x + this.width - 12 + off, this.y + 5, 3, 4);

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

    // Pattern label
    ctx.fillStyle = '#fff';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.pattern, this.x + this.width / 2, this.y - 20);
  }
}
