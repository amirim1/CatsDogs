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
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  },

  initLevel(levelNum) {
    const data = Levels.getData(levelNum);
    this.levelWidth = data.width;
    this.levelHeight = data.height;
    this.platforms = data.platforms || [];
    this.doors = data.doors || [];
    this.keyCollected = false;

    this.key = data.key ? new Key(data.key.x, data.key.y) : null;

    this.enemies = [];
    if (data.enemies) {
      data.enemies.forEach(e => {
        this.enemies.push(new Enemy(e.x, e.y, e.patrolLeft, e.patrolRight, e.speed));
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

    // Diamond collection (optional, score only)
    this.players.forEach(p => {
      this.diamonds.forEach(d => {
        if (!d.collected && this.checkCollision(p, d)) {
          d.collected = true;
          p.score++;
          App.playSound('gem');
        }
      });
    });

    // Win check: key collected + each player at their own door
    if (this.keyCollected) {
      const catAtDoor = this.doors.some(d => d.owner === 'cat' && this.checkCollision(this.players[0], d));
      const dogAtDoor = this.doors.some(d => d.owner === 'dog' && this.checkCollision(this.players[1], d));
      if (catAtDoor && dogAtDoor) {
        App.nextLevel();
      }
    }

    // Enemy collision
    this.players.forEach(p => {
      this.enemies.forEach(e => {
        if (this.checkCollision(p, e)) {
          App.restartLevel();
        }
      });
    });

    if (this.players.every(p => p.y > this.levelHeight + 50)) {
      App.restartLevel();
    }

    const midX = (this.players[0].x + this.players[1].x) / 2;
    const midY = (this.players[0].y + this.players[1].y) / 2;
    this.camera.x = midX - App.canvas.width / 2;
    this.camera.y = midY - App.canvas.height / 2;
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
    ctx.fillRect(0, 0, this.levelWidth, this.levelHeight);

    const bg = App.assets['background'];
    if (bg && bg.complete && bg.naturalWidth > 0) {
      for (let x = 0; x < this.levelWidth; x += bg.width) {
        for (let y = 0; y < this.levelHeight; y += bg.height) {
          ctx.drawImage(bg, x, y);
        }
      }
    }
  },

  drawPlatform(ctx, p) {
    if (p.style === 'floor') {
      // Floor: monolithic wall from surface down to level bottom
      const tiles = ['floor_clean_01', 'floor_clean_02', 'floor_clean_03', 'floor_clean_04'];
      const tileIdx = App.currentLevel % 2 === 0 ? 'choco' : 'clean';
      const tileSet = {
        choco: ['floor_choco_01', 'floor_choco_02', 'floor_choco_03', 'floor_choco_04'],
        clean: ['floor_clean_01', 'floor_clean_02', 'floor_clean_03', 'floor_clean_04'],
      };
      const set = tileSet[tileIdx];
      this.drawFloorColumn(ctx, p, set);
      return;
    }

    if (p.style === 'sausage2') {
      this.drawSectionedPlatform(ctx, p, p.style + '_left', null, p.style + '_right');
      return;
    }

    const leftKey = p.style + '_left';
    const midKey = p.style + '_mid';
    const rightKey = p.style + '_right';

    const leftImg = App.assets[leftKey];
    const midImg = App.assets[midKey];
    const rightImg = App.assets[rightKey];

    if (leftImg && leftImg.complete && leftImg.naturalWidth > 0) {
      const h = leftImg.height;
      const lw = leftImg.width;
      const rw = rightImg ? rightImg.width : lw;
      const mw = midImg ? midImg.width : lw;

      ctx.drawImage(leftImg, p.x, p.y, lw, h);
      for (let x = p.x + lw; x < p.x + p.width - rw; x += mw) {
        const tw = Math.min(mw, p.x + p.width - rw - x);
        ctx.drawImage(midImg, x, p.y, tw, h);
      }
      ctx.drawImage(rightImg, p.x + p.width - rw, p.y, rw, h);
    } else {
      ctx.fillStyle = '#555';
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }
  },

  drawFloorColumn(ctx, p, tiles) {
    const tileH = 18;
    let ty = p.y;
    let idx = 0;
    while (ty < p.y + p.height) {
      const img = App.assets[tiles[idx % tiles.length]];
      if (img && img.complete && img.naturalWidth > 0) {
        for (let tx = p.x; tx < p.x + p.width; tx += img.width) {
          const tw = Math.min(img.width, p.x + p.width - tx);
          ctx.drawImage(img, tx, ty, tw, tileH);
        }
      } else {
        ctx.fillStyle = '#555';
        ctx.fillRect(p.x, ty, p.width, tileH);
      }
      ty += tileH;
      idx++;
    }
  },

  drawSectionedPlatform(ctx, p, leftKey, midKey, rightKey) {
    const left = App.assets[leftKey];
    const right = App.assets[rightKey];
    if (left && left.complete && left.naturalWidth > 0 && right && right.complete && right.naturalWidth > 0) {
      const h = left.height;
      ctx.drawImage(left, p.x, p.y, left.width, h);
      ctx.drawImage(right, p.x + p.width - right.width, p.y, Math.min(right.width, p.width - left.width), h);
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

    // Owner label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(d.owner, d.x + d.width / 2, d.y - 6);

    // Colored dot
    ctx.fillStyle = d.owner === 'cat' ? '#e74c3c' : '#3498db';
    ctx.beginPath();
    ctx.arc(d.x + d.width / 2, d.y - 14, 5, 0, Math.PI * 2);
    ctx.fill();
  },

  checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
};
