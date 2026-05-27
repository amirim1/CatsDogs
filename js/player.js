class Player {
  constructor(x, y, type, color) {
    this.spawnX = x;
    this.spawnY = y;
    this.x = x;
    this.y = y;
    this.width = 58;
    this.height = 76;
    this.vx = 0;
    this.vy = 0;
    this.accel = 0.64;
    this.friction = 0.82;
    this.maxSpeed = 7.1;
    this.jumpPower = -13.4;
    this.gravity = 0.56;
    this.maxFallSpeed = 18;
    this.stepHeight = 24;
    this.onGround = false;
    this.coyoteTime = 0;
    this.coyoteTimeMax = 10;
    this.jumpBuffer = 0;
    this.jumpBufferMax = 9;
    this.jumpWasDown = false;
    this.facing = 1;
    this.type = type;
    this.color = color;
    this.score = 0;
    this.lives = 3;
    this.flicker = 0;
    this.animTime = Math.random() * 10;
  }

  update(game) {
    if (this.flicker > 0) this.flicker--;

    if (this.onGround) this.coyoteTime = this.coyoteTimeMax;
    else if (this.coyoteTime > 0) this.coyoteTime--;

    const controls = this.type === 'cat'
      ? { left: 'KeyA', right: 'KeyD', jump: 'KeyW' }
      : { left: 'ArrowLeft', right: 'ArrowRight', jump: 'ArrowUp' };

    const left = !!game.keys[controls.left];
    const right = !!game.keys[controls.right];
    const jumpDown = !!game.keys[controls.jump];

    if (left && !right) {
      this.vx -= this.accel;
      this.facing = -1;
    } else if (right && !left) {
      this.vx += this.accel;
      this.facing = 1;
    } else {
      this.vx *= this.friction;
    }

    if (Math.abs(this.vx) > this.maxSpeed) this.vx = Math.sign(this.vx) * this.maxSpeed;
    if (Math.abs(this.vx) < 0.08) this.vx = 0;

    if (jumpDown && !this.jumpWasDown) this.jumpBuffer = this.jumpBufferMax;
    else if (this.jumpBuffer > 0) this.jumpBuffer--;
    this.jumpWasDown = jumpDown;

    if (this.jumpBuffer > 0 && (this.onGround || this.coyoteTime > 0)) {
      this.vy = this.jumpPower;
      this.onGround = false;
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
      App.playSound('jump');
    }

    if (!jumpDown && this.vy < -3.5) this.vy += this.gravity * 0.85;
    this.vy += this.gravity;
    if (this.vy > this.maxFallSpeed) this.vy = this.maxFallSpeed;

    this.moveHorizontal(game);
    this.moveVertical(game);

    if (this.x < 0) { this.x = 0; this.vx = 0; }
    if (this.x + this.width > game.levelWidth) {
      this.x = game.levelWidth - this.width;
      this.vx = 0;
    }

    this.updateAnimation();
  }

  moveHorizontal(game) {
    this.x += this.vx;
    if (this.vx === 0) return;

    for (const p of game.getSolids()) {
      if (!game.checkCollision(this, p)) continue;
      if (this.tryStepUp(game, p)) continue;

      if (this.vx > 0) this.x = p.x - this.width;
      else if (this.vx < 0) this.x = p.x + p.width;
      this.vx = 0;
    }
  }

  tryStepUp(game, platform) {
    if (this.vy < -1) return false;
    const feet = this.y + this.height;
    const requiredStep = feet - platform.y;
    if (requiredStep <= 0 || requiredStep > this.stepHeight) return false;

    const oldY = this.y;
    this.y = platform.y - this.height;
    const blocked = game.getSolids().some(other => other !== platform && game.checkCollision(this, other));
    if (blocked) {
      this.y = oldY;
      return false;
    }

    this.vy = Math.min(this.vy, 0);
    this.onGround = true;
    this.coyoteTime = this.coyoteTimeMax;
    return true;
  }

  moveVertical(game) {
    const oldY = this.y;
    this.y += this.vy;
    this.onGround = false;

    for (const p of game.getSolids()) {
      if (!game.checkCollision(this, p)) continue;

      if (this.vy > 0 && oldY + this.height <= p.y + 2) {
        this.y = p.y - this.height;
        this.vy = 0;
        this.onGround = true;
        this.coyoteTime = this.coyoteTimeMax;
      } else if (this.vy < 0 && oldY >= p.y + p.height - 2) {
        this.y = p.y + p.height;
        this.vy = 0;
      }
    }

    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }
  }

  takeDamage(knockbackDir = 0, respawn = false) {
    if (this.flicker > 0 || this.lives <= 0) return false;
    this.lives--;
    this.flicker = 180;
    this.vx = knockbackDir * 6.5;
    this.vy = -7;
    if (respawn && this.lives > 0) this.respawn();
    return true;
  }

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.coyoteTime = 0;
    this.jumpBuffer = 0;
  }

  updateAnimation() {
    let speed = 0.14;
    if (!this.onGround) speed = 0.16;
    else if (Math.abs(this.vx) > 0.5) speed = 0.28;
    this.animTime += speed;
  }

  draw(ctx) {
    if (this.flicker > 0 && Math.floor(this.flicker / 5) % 2 === 0) return;

    const state = this.getAnimationState();
    const img = App.getAnimationFrame(`${this.type}_${state}`, this.animTime);

    ctx.save();
    if (img) {
      const drawW = this.width * 1.72;
      const drawH = this.height * 1.48;
      const dx = Math.round(this.x + this.width / 2 - drawW / 2);
      const dy = Math.round(this.y + this.height - drawH + 8);

      if (this.facing < 0) {
        ctx.translate(Math.round(this.x + this.width / 2), 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, -drawW / 2, dy, drawW, drawH);
      } else {
        ctx.drawImage(img, dx, dy, drawW, drawH);
      }
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.round(this.x), Math.round(this.y), this.width, this.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(Math.round(this.x + 12), Math.round(this.y + 16), 10, 10);
      ctx.fillRect(Math.round(this.x + this.width - 22), Math.round(this.y + 16), 10, 10);
    }
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = this.type === 'cat' ? '#ff6b6b' : '#74b9ff';
    ctx.fillText(this.type === 'cat' ? 'CAT' : 'DOG', Math.round(this.x + this.width / 2), Math.round(this.y - 8));
    ctx.restore();
  }

  getAnimationState() {
    if (this.flicker > 0) return 'hurt';
    if (!this.onGround && this.vy > 1) return 'fall';
    if (!this.onGround) return 'jump';
    if (Math.abs(this.vx) > 0.5) return 'run';
    return 'idle';
  }
}
