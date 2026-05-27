class Player {
  // maxJump ≈ 204px (held) / 143px (tap)
  //   held: v0²/2g = 100/(2×0.245) = 204
  //   tap:  v0²/2g = 100/(2×0.35)  = 143
  static JUMP_POWER = -10;
  static GRAVITY = 0.35;

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
    this.jumpPower = Player.JUMP_POWER;
    this.gravity = Player.GRAVITY;
    this.onGround = false;
    this.jumpHeld = false;
    this.coyoteTime = 0; // Frames remaining for coyote jump
    this.coyoteTimeMax = 8; // Max coyote time frames (about 0.13s at 60fps)
    this.jumpCut = false; // Whether jump was cut short
    this.type = type;
    this.color = color;
    this.score = 0;
    this.lives = 3;
    this.flicker = 0;
  }

  update(game) {
    if (this.flicker > 0) this.flicker--;

    const keys = game.keys;

      // Horizontal movement and jump keys
      let leftKey, rightKey, jumpKey;
      if (this.type === 'cat') {
        leftKey = 'KeyA';
        rightKey = 'KeyD';
        jumpKey = 'KeyW';
      } else {
        leftKey = 'ArrowLeft';
        rightKey = 'ArrowRight';
        jumpKey = 'ArrowUp';
      }

      if (keys[leftKey]) this.vx -= this.accel;
      else if (keys[rightKey]) this.vx += this.accel;
      else this.vx *= this.friction;

      // Jump handling with coyote time and jump cut
      if (keys[jumpKey]) {
        if (this.onGround || this.coyoteTime > 0) {
          this.vy = this.jumpPower;
          this.onGround = false;
          this.jumpHeld = true;
          this.coyoteTime = 0; // Reset coyote time when jumping
          App.playSound('jump');
          this.jumpCut = false;
        } else if (this.jumpHeld && this.vy < 0) {
          // Held jump - reduced gravity for higher jump
          this.vy += this.gravity * 0.7;
        }
      } else {
        this.jumpHeld = false;
        // Jump cut - increase gravity when jump button released early
        if (this.vy < 0) {
          this.vy += this.gravity * 0.3; // Apply extra gravity to cut jump short
          this.jumpCut = true;
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
      const overlapY = Math.min(this.y + this.height, p.y + p.height) - Math.max(this.y, p.y);
      if (overlapY < 15) return;
      if (game.checkCollision(this, p)) {
        const feetY = this.y + this.height;
        if (feetY >= p.y && feetY - p.y <= 12) {
          this.y = p.y - this.height;
          this.vy = 0.5;
        } else {
          if (this.vx > 0) this.x = p.x - this.width;
          else if (this.vx < 0) this.x = p.x + p.width;
          this.vx = 0;
        }
      }
    });

    // Update coyote time - allow jump for a short time after leaving platform
    if (this.onGround) {
      this.coyoteTime = this.coyoteTimeMax;
    } else if (this.coyoteTime > 0) {
      this.coyoteTime--;
    }

    this.y += this.vy;
    this.onGround = false;
    game.platforms.forEach(p => {
      if (game.checkCollision(this, p)) {
        if (this.vy > 0) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.coyoteTime = this.coyoteTimeMax; // Reset coyote time when landing
        } else if (this.vy < 0) {
          this.y = p.y + p.height;
          this.vy = 0;
        }
      }
    });

    // Ceiling
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }

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
    let img = App.assets[assetKey];
    if (!img || !img.complete || !img.naturalWidth > 0) img = null;

    if (this.flicker > 0 && Math.floor(this.flicker / 4) % 2 === 0) return;

    ctx.save();

    if (img) {
      const s = Math.min(this.width / img.width, this.height / img.height);
      const dw = img.width * s;
      const dh = img.height * s;

      if (this.vx < 0) {
        ctx.translate(Math.round(this.x + this.width), 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, 0, this.y + this.height - dh, dw, dh);
      } else {
        ctx.drawImage(img, Math.round(this.x) + (this.width - dw) / 2, this.y + this.height - dh, dw, dh);
      }
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(Math.round(this.x + 14), Math.round(this.y + 18), 12, 12);
      ctx.fillRect(Math.round(this.x + this.width - 26), Math.round(this.y + 18), 12, 12);
    }

    ctx.restore();

    // Name label
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.type, Math.round(this.x + this.width / 2), Math.round(this.y - 8));

    // Lives hearts
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < this.lives ? '#e74c3c' : '#333';
      ctx.font = '12px monospace';
      ctx.fillText('\u2665', Math.round(this.x + 8 + i * 16), Math.round(this.y - 22));
    }
  }

  getSpriteKey() {
    const prefix = this.type === 'cat' ? 'cat' : 'dog';
    if (!this.onGround) return prefix + '_jump';
    if (Math.abs(this.vx) > 0.5) return prefix + '_run';
    return prefix + '_idle';
  }
}
