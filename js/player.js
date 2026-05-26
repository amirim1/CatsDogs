class Player {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 40;
    this.vx = 0;
    this.vy = 0;
    this.speed = 4;
    this.jumpPower = -10;
    this.onGround = false;
    this.type = type;
    this.color = color;
    this.score = 0;
  }

  update(game) {
    const keys = game.keys;

    if (this.type === 'cat') {
      if (keys['KeyA']) this.vx = -this.speed;
      else if (keys['KeyD']) this.vx = this.speed;
      else this.vx *= 0.7;

      if (keys['KeyW'] && this.onGround) {
        this.vy = this.jumpPower;
        this.onGround = false;
      }
    } else {
      if (keys['ArrowLeft']) this.vx = -this.speed;
      else if (keys['ArrowRight']) this.vx = this.speed;
      else this.vx *= 0.7;

      if (keys['ArrowUp'] && this.onGround) {
        this.vy = this.jumpPower;
        this.onGround = false;
      }
    }

    this.vy += 0.6;
    if (this.vy > 15) this.vy = 15;

    this.x += this.vx;
    game.platforms.forEach(p => {
      if (game.checkCollision(this, p)) {
        if (this.vx > 0) this.x = p.x - this.width;
        else if (this.vx < 0) this.x = p.x + p.width;
        this.vx = 0;
      }
    });

    this.y += this.vy;
    this.onGround = false;
    game.platforms.forEach(p => {
      if (game.checkCollision(this, p)) {
        if (this.vy > 0) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.onGround = true;
        } else if (this.vy < 0) {
          this.y = p.y + p.height;
          this.vy = 0;
        }
      }
    });

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > game.levelWidth) this.x = game.levelWidth - this.width;
    if (this.y + this.height > game.levelHeight) {
      this.y = game.levelHeight - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + 6, this.y + 8, 6, 6);
    ctx.fillRect(this.x + this.width - 12, this.y + 8, 6, 6);

    if (Game.activePlayer === this) {
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    }
  }
}
