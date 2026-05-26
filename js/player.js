class Player {
  constructor(x, y, type, color) {
    this.x = x;
    this.y = y;
    this.width = 72;
    this.height = 96;
    this.vx = 0;
    this.vy = 0;
    this.accel = 0.4;
    this.friction = 0.88;
    this.maxSpeed = 5;
    this.jumpPower = -14;
    this.gravity = 0.35;
    this.onGround = false;
    this.jumpHeld = false;
    this.type = type;
    this.color = color;
    this.score = 0;
  }

  update(game) {
    const keys = game.keys;

    if (this.type === 'cat') {
      if (keys['KeyA']) this.vx -= this.accel;
      else if (keys['KeyD']) this.vx += this.accel;
      else this.vx *= this.friction;

      if (keys['KeyW']) {
        if (this.onGround) {
          this.vy = this.jumpPower;
          this.onGround = false;
          this.jumpHeld = true;
          App.playSound('jump');
        } else if (this.jumpHeld && this.vy < 0) {
          this.vy += this.gravity * 0.4;
        }
      } else {
        this.jumpHeld = false;
      }
    } else {
      if (keys['ArrowLeft']) this.vx -= this.accel;
      else if (keys['ArrowRight']) this.vx += this.accel;
      else this.vx *= this.friction;

      if (keys['ArrowUp']) {
        if (this.onGround) {
          this.vy = this.jumpPower;
          this.onGround = false;
          this.jumpHeld = true;
          App.playSound('jump');
        } else if (this.jumpHeld && this.vy < 0) {
          this.vy += this.gravity * 0.4;
        }
      } else {
        this.jumpHeld = false;
      }
    }

    if (Math.abs(this.vx) > this.maxSpeed) {
      this.vx = Math.sign(this.vx) * this.maxSpeed;
    }
    if (Math.abs(this.vx) < 0.1) this.vx = 0;

    if (!this.jumpHeld || this.vy >= 0) {
      this.vy += this.gravity;
    }
    if (this.vy > 18) this.vy = 18;

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
      ctx.fillRect(this.x + 14, this.y + 18, 12, 12);
      ctx.fillRect(this.x + this.width - 26, this.y + 18, 12, 12);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.type, this.x + this.width / 2, this.y - 8);
  }

  getSpriteKey() {
    const prefix = this.type === 'cat' ? 'cat' : 'dog';
    if (!this.onGround) return prefix + '_jump';
    if (Math.abs(this.vx) > 0.5) return prefix + '_run';
    return prefix + '_idle';
  }
}
