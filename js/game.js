const Game = {
  players: [],
  platforms: [],
  diamonds: [],
  doors: [],
  enemies: [],
  key: null,
  keyCollected: false,
  camera: { x: 0, y: 0 },
  keys: {},
  levelWidth: 0,
  levelHeight: 0,

  init() {
    this.setupInput();
  },

  setupInput() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      this.keys[code] = true;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        e.preventDefault();
      }

      if (code === 'Enter') {
        if (App.state === 'menu') App.startGame();
        else if (App.state === 'win') App.startGame();
        else if (App.state === 'fail') App.restartLevel();
      }

      if (code === 'Escape' && App.state === 'playing') {
        App.paused = !App.paused;
      }

      if (code === 'KeyR' && App.state === 'playing') {
        App.restartLevel();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  },

  initLevel(levelNum) {
    const data = Levels.generate(levelNum);
    this.levelWidth = data.width;
    this.levelHeight = data.height;
    this.platforms = data.platforms || [];
    this.doors = data.doors || [];
    this.keyCollected = false;

    this.key = data.key ? new Key(data.key.x, data.key.y) : null;

    this.enemies = [];
    if (data.enemies) {
      data.enemies.forEach(e => {
        this.enemies.push(new Enemy(e.x, e.y, e.patrolLeft, e.patrolRight, e.speed, e.pattern));
      });
    }

    this.diamonds = [];
    if (data.diamonds) {
      data.diamonds.forEach(d => {
        this.diamonds.push(new Diamond(d.x, d.y));
      });
    }

    this.players = [];
    const cat = new Player(data.spawn.cat.x, data.spawn.cat.y, 'cat', '#e74c3c');
    const dog = new Player(data.spawn.dog.x, data.spawn.dog.y, 'dog', '#3498db');
    this.players.push(cat, dog);
    this.camera.x = 0;
    this.camera.y = 0;
  },

  update() {
    if (App.state !== 'playing') return;

    this.enemies.forEach(e => e.update());
    this.players.forEach(p => p.update(this));

    // Key collection
    if (this.key && !this.keyCollected) {
      this.players.forEach(p => {
        if (this.checkCollision(p, this.key)) {
          this.keyCollected = true;
          this.key.collected = true;
          this.doors.forEach(d => d.isOpen = true);
        }
      });
    }

    // Diamond collection
    this.players.forEach(p => {
      this.diamonds.forEach(d => {
        if (!d.collected && this.checkCollision(p, d)) {
          d.collected = true;
          p.score++;
          App.playSound('gem');
        }
      });
    });

    // Win check
    if (this.keyCollected) {
      const catAtDoor = this.doors.some(d => d.owner === 'cat' && this.checkCollision(this.players[0], d));
      const dogAtDoor = this.doors.some(d => d.owner === 'dog' && this.checkCollision(this.players[1], d));
      if (catAtDoor && dogAtDoor) {
        App.nextLevel();
        return;
      }
    }

    // Enemy collision вЂ” only one hit per frame per player
    this.players.forEach(p => {
      if (p.lives <= 0 || p.flicker > 0) return;
      if (this.enemies.some(e => this.checkCollision(p, e))) {
        p.lives--;
        p.flicker = 120;
        App.playSound('hurt');
      }
    });

    // Check if both dead
    if (this.players.some(p => p.lives <= 0)) {
      App.state = 'fail';
    }

    // Fall off вЂ” punish only the falling player
    this.players.forEach(p => {
      if (p.y > this.levelHeight + 50 && p.lives > 0) {
        p.lives--;
        p.flicker = 120;
        App.playSound('hurt');
      }
    });
    if (this.players.some(p => p.lives <= 0)) {
      App.state = 'fail';
    }

    const midX = (this.players[0].x + this.players[1].x) / 2;
    const midY = (this.players[0].y + this.players[1].y) / 2;
    this.camera.x = Math.max(0, Math.min(this.levelWidth - App.canvas.width, midX - App.canvas.width / 2));
    this.camera.y = Math.max(0, Math.min(this.levelHeight - App.canvas.height, midY - App.canvas.height / 2));
  },

  render() {
    const ctx = App.ctx;
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    this.drawBackground(ctx);
    this.platforms.forEach(p => this.drawPlatform(ctx, p));
    this.doors.forEach(d => this.drawDoor(ctx, d));
    this.diamonds.forEach(d => d.draw(ctx));
    if (this.key && !this.keyCollected) this.key.draw(ctx);
    this.enemies.forEach(e => e.draw(ctx));
    this.players.forEach(p => p.draw(ctx));

    ctx.restore();

    UI.drawHUD(ctx);
  },

  drawBackground(ctx) {
    ctx.fillStyle = '#2d2d44';
    ctx.fillRect(-10, -10, this.levelWidth + 20, this.levelHeight + 510);

    const bg = App.assets['background'];
    if (bg && bg.complete && bg.naturalWidth > 0) {
      for (let x = -10; x < this.levelWidth + 20; x += bg.width) {
        for (let y = -10; y < this.levelHeight + 510; y += bg.height) {
          ctx.drawImage(bg, x, y);
        }
      }
    }
  },

  drawPlatform(ctx, p) {
    const tileSize = 36;

    if (p.style === 'floor') {
      const set = p.floorSet || 'choco';
      this.drawFloorColumn(ctx, p, set, tileSize);
      return;
    }

    if (p.style === 'sausage2') {
      this.drawSectionedPlatform(ctx, p, tileSize);
      return;
    }

    const leftKey = p.style + '_left';
    const midKey = p.style + '_mid';
    const rightKey = p.style + '_right';
    const left = App.assets[leftKey];
    const mid = App.assets[midKey];
    const right = App.assets[rightKey];

    if (left && left.complete && left.naturalWidth > 0 &&
        mid && mid.complete && mid.naturalWidth > 0 &&
        right && right.complete && right.naturalWidth > 0) {
      const lw = tileSize;
      const mw = tileSize;
      const rw = tileSize;

      ctx.drawImage(left, p.x, p.y, lw, tileSize);
      for (let x = p.x + lw; x < p.x + p.width - rw; x += mw) {
        const tw = Math.min(mw, p.x + p.width - rw - x);
        ctx.drawImage(mid, x, p.y, tw, tileSize);
      }
      ctx.drawImage(right, p.x + p.width - rw, p.y, rw, tileSize);
    } else {
      ctx.fillStyle = '#555';
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }
  },

  drawFloorColumn(ctx, p, set, tileSize) {
    const setMap = {
      choco: { left: 'floor_choco_01', mid1: 'floor_choco_02', mid2: 'floor_choco_03', right: 'floor_choco_04' },
      clean: { left: 'floor_clean_01', mid1: 'floor_clean_02', mid2: 'floor_clean_03', right: 'floor_clean_04' },
      pink:  { left: 'pinkfloor1of4',  mid1: 'pinkfloor2of4',  mid2: 'pinkfloor3of4',  right: 'pinkfloor4of4'  },
    };
    const names = setMap[set] || setMap.choco;
    const left = App.assets[names.left];
    const mid1 = App.assets[names.mid1];
    const mid2 = App.assets[names.mid2];
    const right = App.assets[names.right];

    let ty = p.y;
    let row = 0;

    while (ty < p.y + p.height) {
      if (row === 0) {
        for (let tx = p.x; tx < p.x + p.width; tx += tileSize) {
          const tw = Math.min(tileSize, p.x + p.width - tx);
          let tile;
          if (tx === p.x) tile = left;
          else if (tx + tileSize >= p.x + p.width) tile = right;
          else tile = (Math.floor((tx - p.x) / tileSize) % 2 === 0) ? mid1 : mid2;
          if (tile && tile.complete && tile.naturalWidth > 0) {
            ctx.drawImage(tile, tx, ty, tw, tileSize);
          } else {
            ctx.fillStyle = '#444';
            ctx.fillRect(tx, ty, tw, tileSize);
          }
        }
      } else {
        const tile = mid1;
        if (tile && tile.complete && tile.naturalWidth > 0) {
          for (let tx = p.x; tx < p.x + p.width; tx += tileSize) {
            const tw = Math.min(tileSize, p.x + p.width - tx);
            ctx.drawImage(tile, tx, ty, tw, tileSize);
          }
        } else {
          ctx.fillStyle = '#444';
          ctx.fillRect(p.x, ty, p.width, tileSize);
        }
      }
      ty += tileSize;
      row++;
    }
  },

  drawSectionedPlatform(ctx, p, tileSize) {
    const left = App.assets['sausage2_left'];
    const right = App.assets['sausage2_right'];
    if (left && left.complete && left.naturalWidth > 0 &&
        right && right.complete && right.naturalWidth > 0) {
      ctx.drawImage(left, p.x, p.y, tileSize, tileSize);
      ctx.drawImage(right, p.x + p.width - tileSize, p.y, tileSize, tileSize);
      // fill middle
      for (let x = p.x + tileSize; x < p.x + p.width - tileSize; x += tileSize) {
        ctx.drawImage(left, x, p.y, Math.min(tileSize, p.x + p.width - tileSize - x), tileSize);
      }
    } else {
      ctx.fillStyle = '#555';
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }
  },

  drawDoor(ctx, d) {
    const key = d.isOpen ? 'door_open' : 'door_closed';
    const img = App.assets[key];
    if (img && img.complete && img.naturalWidth > 0) {
      const s = Math.min(d.width / img.width, d.height / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      ctx.drawImage(img, d.x + (d.width - dw) / 2, d.y + d.height - dh, dw, dh);
    } else {
      ctx.fillStyle = d.isOpen ? '#2ecc71' : '#7f8c8d';
      ctx.fillRect(d.x, d.y, d.width, d.height);
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(d.owner, d.x + d.width / 2, d.y - 6);

    ctx.fillStyle = d.owner === 'cat' ? '#e74c3c' : '#3498db';
    ctx.beginPath();
    ctx.arc(d.x + d.width / 2, d.y - 16, 6, 0, Math.PI * 2);
    ctx.fill();
  },

  checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
};



