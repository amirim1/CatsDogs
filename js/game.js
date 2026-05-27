const Game = {
  players: [],
  platforms: [],
  diamonds: [],
  doors: [],
  enemies: [],
  particles: [],
  key: null,
  keyCollected: false,
  camera: { x: 0, y: 0 },
  keys: {},
  levelWidth: 0,
  levelHeight: 0,
  levelTime: 0,
  spawn: null,
  shake: 0,

  init() {
    this.setupInput();
  },

  setupInput() {
    window.addEventListener('keydown', (event) => {
      const code = event.code;
      this.keys[code] = true;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        event.preventDefault();
      }

      if (code === 'Enter') {
        if (App.state === 'menu' || App.state === 'win') App.startGame();
        else if (App.state === 'fail') App.restartLevel();
      }

      if (code === 'Escape' && App.state === 'playing') App.paused = !App.paused;
      if (code === 'KeyR' && App.state === 'playing') App.restartLevel();
      if (code === 'KeyM') App.soundEnabled = !App.soundEnabled;
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
    });
  },

  initLevel(levelNum) {
    const data = Levels.generate(levelNum);
    this.levelWidth = data.width;
    this.levelHeight = data.height;
    this.platforms = data.platforms || [];
    this.doors = (data.doors || []).map(door => ({ ...door, isOpen: false }));
    this.keyCollected = false;
    this.levelTime = 0;
    this.particles = [];
    this.shake = 0;

    this.key = data.key ? new Key(data.key.x, data.key.y) : null;
    this.enemies = (data.enemies || []).map(enemy => new Enemy(
      enemy.x,
      enemy.y,
      enemy.patrolLeft,
      enemy.patrolRight,
      enemy.speed,
      enemy.pattern,
    ));
    this.diamonds = (data.diamonds || []).map(diamond => new Diamond(diamond.x, diamond.y));

    this.spawn = data.spawn;
    const cat = new Player(data.spawn.cat.x, data.spawn.cat.y, 'cat', '#e74c3c');
    const dog = new Player(data.spawn.dog.x, data.spawn.dog.y, 'dog', '#3498db');
    this.players = [cat, dog];
    this.camera.x = 0;
    this.camera.y = 0;
  },

  update() {
    if (App.state !== 'playing') return;
    this.levelTime++;
    if (this.shake > 0) this.shake--;

    this.enemies.forEach(enemy => enemy.update(this));
    this.players.forEach(player => player.update(this));
    this.updateParticles();
    this.handleCollectibles();
    this.handleEnemyDamage();
    this.handleFalling();
    this.checkWin();
  },

  getSolids() {
    return this.platforms;
  },

  handleCollectibles() {
    if (this.key && !this.keyCollected) {
      for (const player of this.players) {
        if (this.checkCollision(player, this.key)) {
          this.keyCollected = true;
          this.key.collected = true;
          this.doors.forEach(door => { door.isOpen = true; });
          this.spawnParticles(this.key.x + this.key.width / 2, this.key.y + this.key.height / 2, '#f1c40f', 22);
          App.playSound('key');
          break;
        }
      }
    }

    this.players.forEach(player => {
      this.diamonds.forEach(diamond => {
        if (!diamond.collected && this.checkCollision(player, diamond)) {
          diamond.collected = true;
          player.score++;
          this.spawnParticles(diamond.x + diamond.width / 2, diamond.y + diamond.height / 2, '#4dd8ff', 12);
          App.playSound('gem');
        }
      });
    });
  },

  handleEnemyDamage() {
    this.players.forEach(player => {
      if (player.lives <= 0 || player.flicker > 0) return;
      const enemy = this.enemies.find(item => this.checkCollision(player, item));
      if (!enemy) return;

      const dir = player.x + player.width / 2 < enemy.x + enemy.width / 2 ? -1 : 1;
      if (player.takeDamage(dir, false)) {
        this.shake = 14;
        this.spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#ff7675', 18);
        App.playSound('hurt');
        if (player.lives <= 0) App.state = 'fail';
      }
    });
  },

  handleFalling() {
    this.players.forEach(player => {
      if (player.y > this.levelHeight + 180 && player.lives > 0) {
        if (player.takeDamage(0, true)) {
          this.shake = 10;
          App.playSound('hurt');
        }
        if (player.lives <= 0) App.state = 'fail';
      }
    });
  },

  checkWin() {
    if (!this.keyCollected) return;

    const catAtDoor = this.doors.some(door => door.owner === 'cat' && this.checkCollision(this.players[0], door));
    const dogAtDoor = this.doors.some(door => door.owner === 'dog' && this.checkCollision(this.players[1], door));

    if (catAtDoor && dogAtDoor) App.nextLevel();
  },

  allDiamondsCollected() {
    return this.diamonds.every(diamond => diamond.collected);ы
  },

  updateParticles() {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.18;
      particle.life--;
      return particle.life > 0;
    });
  },

  spawnParticles(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 4,
        color,
        life: 24 + Math.floor(Math.random() * 20),
        maxLife: 44,
      });
    }
  },

  render() {
    const ctx = App.ctx;
    const cw = App.canvas.width;
    const ch = App.canvas.height;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, cw, ch);

    const scale = Math.min(cw / this.levelWidth, ch / this.levelHeight);
    const ox = (cw - this.levelWidth * scale) / 2;
    const oy = (ch - this.levelHeight * scale) / 2;
    const sx = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;
    const sy = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;

    ctx.save();
    ctx.translate(ox + sx, oy + sy);
    ctx.scale(scale, scale);

    this.drawBackground(ctx);
    ctx.imageSmoothingEnabled = false;
    this.platforms.forEach(platform => this.drawPlatform(ctx, platform));
    this.doors.forEach(door => this.drawDoor(ctx, door));
    this.diamonds.forEach(diamond => diamond.draw(ctx));
    if (this.key && !this.keyCollected) this.key.draw(ctx);
    this.enemies.forEach(enemy => enemy.draw(ctx));
    this.players.forEach(player => player.draw(ctx));
    this.drawParticles(ctx);

    ctx.restore();
    UI.drawHUD(ctx);
  },

  drawBackground(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, this.levelHeight);
    sky.addColorStop(0, '#ffb3c7');
    sky.addColorStop(0.55, '#ffd6a5');
    sky.addColorStop(1, '#bde0fe');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.levelWidth, this.levelHeight);

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (let i = 0; i < 8; i++) {
      const x = (i * 260 + (this.levelTime * 0.18)) % (this.levelWidth + 220) - 140;
      const y = 90 + (i % 3) * 55;
      this.drawCloud(ctx, x, y, 1 + (i % 2) * 0.35);
    }

    ctx.fillStyle = 'rgba(100, 55, 130, 0.22)';
    this.drawHills(ctx, 760, 240);
    ctx.fillStyle = 'rgba(86, 132, 96, 0.26)';
    this.drawHills(ctx, 835, 180);
  },

  drawCloud(ctx, x, y, s) {
    ctx.beginPath();
    ctx.arc(x, y, 30 * s, 0, Math.PI * 2);
    ctx.arc(x + 34 * s, y - 12 * s, 38 * s, 0, Math.PI * 2);
    ctx.arc(x + 74 * s, y, 28 * s, 0, Math.PI * 2);
    ctx.rect(x - 8 * s, y, 95 * s, 24 * s);
    ctx.fill();
  },

  drawHills(ctx, baseY, height) {
    ctx.beginPath();
    ctx.moveTo(0, this.levelHeight);
    for (let x = -100; x <= this.levelWidth + 100; x += 160) {
      ctx.quadraticCurveTo(x + 80, baseY - height, x + 160, baseY);
    }
    ctx.lineTo(this.levelWidth, this.levelHeight);
    ctx.closePath();
    ctx.fill();
  },

  drawPlatform(ctx, platform) {
    const tileSize = 36;

    if (platform.style === 'floor') {
      this.drawFloor(ctx, platform, tileSize);
      return;
    }

    if (platform.style === 'sausage2') {
      this.drawSectionedPlatform(ctx, platform, tileSize);
      return;
    }

    const left = App.assets[`${platform.style}_left`];
    const mid = App.assets[`${platform.style}_mid`];
    const right = App.assets[`${platform.style}_right`];

    if (left && mid && right) {
      ctx.drawImage(left, platform.x, platform.y, tileSize, platform.height);
      for (let x = platform.x + tileSize; x < platform.x + platform.width - tileSize; x += tileSize) {
        const tw = Math.min(tileSize, platform.x + platform.width - tileSize - x);
        ctx.drawImage(mid, x, platform.y, tw, platform.height);
      }
      ctx.drawImage(right, platform.x + platform.width - tileSize, platform.y, tileSize, platform.height);
    } else {
      ctx.fillStyle = '#6b4f3a';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(platform.x, platform.y + platform.height - 6, platform.width, 6);
  },

  drawFloor(ctx, platform, tileSize) {
    const floorTiles = {
      top: {
        left: 'pinkfloor2of4',
        mid: 'pinkfloor3of4',
        right: 'pinkfloor4of4',
      },
      middle: {
        left: 'floor_clean_02',
        mid: 'floor_clean_03',
        right: 'floor_clean_04',
      },
      bottom: {
        left: 'floor_choco_02',
        mid: 'floor_choco_03',
        right: 'floor_choco_04',
      },
    };

    const floorBottom = platform.y + platform.height;
    const floorRight = platform.x + platform.width;

    for (let y = platform.y; y < floorBottom; y += tileSize) {
      const th = Math.min(tileSize, floorBottom - y);

      let layer = floorTiles.middle;

      if (y === platform.y) {
        layer = floorTiles.top;
      } else if (y + tileSize >= floorBottom) {
        layer = floorTiles.bottom;
      }

      for (let x = platform.x; x < floorRight; x += tileSize) {
        const tw = Math.min(tileSize, floorRight - x);

        let tileId = layer.mid;

        if (x === platform.x) {
          tileId = layer.left;
        } else if (x + tileSize >= floorRight) {
          tileId = layer.right;
        }

        const img = App.assets[tileId];

        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, x, y, tw, th);
        } else {
          ctx.fillStyle = '#6b4f3a';
          ctx.fillRect(x, y, tw, th);
        }
      }
    }
  },

  drawSectionedPlatform(ctx, platform, tileSize) {
    const left = App.assets.sausage2_left;
    const right = App.assets.sausage2_right;
    if (left && right) {
      ctx.drawImage(left, platform.x, platform.y, tileSize, platform.height);
      for (let x = platform.x + tileSize; x < platform.x + platform.width - tileSize; x += tileSize) {
        ctx.drawImage(left, x, platform.y, Math.min(tileSize, platform.x + platform.width - tileSize - x), platform.height);
      }
      ctx.drawImage(right, platform.x + platform.width - tileSize, platform.y, tileSize, platform.height);
    } else {
      ctx.fillStyle = '#6b4f3a';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
  },

  drawDoor(ctx, door) {
    const img = App.assets[door.isOpen ? 'door_open' : 'door_closed'];
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.min(door.width / img.width, door.height / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, door.x + (door.width - dw) / 2, door.y + door.height - dh, dw, dh);
    } else {
      ctx.fillStyle = door.isOpen ? '#2ecc71' : '#7f8c8d';
      ctx.fillRect(door.x, door.y, door.width, door.height);
    }

    const ready = this.keyCollected;
    ctx.fillStyle = door.owner === 'cat' ? '#ff6b6b' : '#74b9ff';
    ctx.beginPath();
    ctx.arc(door.x + door.width / 2, door.y - 18, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = ready ? '#2ecc71' : '#f1c40f';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ready ? 'GO' : 'LOCK', door.x + door.width / 2, door.y - 32);
  },

  drawParticles(ctx) {
    this.particles.forEach(particle => {
      const alpha = Math.max(0, Math.min(1, particle.life / particle.maxLife));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    });
    ctx.globalAlpha = 1;
  },

  checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
};
