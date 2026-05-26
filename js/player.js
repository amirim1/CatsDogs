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
        App.playSound('jump');
      }
    } else {
      if (keys['ArrowLeft']) this.vx = -this.speed;
      else if (keys['ArrowRight']) this.vx = this.speed;
      else this.vx *= 0.7;

      if (keys['ArrowUp'] && this.onGround) {
        this.vy = this.jumpPower;
        this.onGround = false;
        App.playSound('jump');
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
    const assetKey = this.getSpriteKey();
    const img = App.assets[assetKey];

    if (img && img.complete && img.naturalWidth > 0) {
      const s = Math.min(this.width / img.width, this.height / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      const dx = this.x + (this.width - dw) / 2;
      const dy = this.y + this.height - dh;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(this.x + 6, this.y + 8, 6, 6);
      ctx.fillRect(this.x + this.width - 12, this.y + 8, 6, 6);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.type, this.x + this.width / 2, this.y - 5);
  }

  getSpriteKey() {
    const prefix = this.type === 'cat' ? 'cat' : 'dog';
    if (!this.onGround) return prefix + '_jump';
    if (Math.abs(this.vx) > 0.5) return prefix + '_run';
    return prefix + '_idle';
  }
}
