const Game = {
  players: [],
  platforms: [],
  diamonds: [],
  doors: [],
  enemies: [],
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

    this.players.forEach(p => {
      this.diamonds.forEach(d => {
        if (!d.collected && this.checkCollision(p, d)) {
          d.collected = true;
          p.score++;
        }
      });
    });

    this.doors.forEach(door => {
      door.isOpen = this.diamonds.every(d => d.collected);
    });

    if (this.players.every(p => {
      return this.doors.some(d => d.isOpen && this.checkCollision(p, d));
    })) {
      App.nextLevel();
    }

    this.players.forEach(p => {
      this.enemies.forEach(e => {
        if (this.checkCollision(p, e)) {
          App.restartLevel();
        }
      });
    });

    // Camera follows midpoint between both players
    const midX = (this.players[0].x + this.players[1].x) / 2;
    const midY = (this.players[0].y + this.players[1].y) / 2;
    this.camera.x = midX - App.canvas.width / 2;
    this.camera.y = midY - App.canvas.height / 2;
  },

  render() {
    const ctx = App.ctx;
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    ctx.fillStyle = '#2d2d44';
    ctx.fillRect(0, 0, this.levelWidth, this.levelHeight);

    this.platforms.forEach(p => {
      ctx.fillStyle = p.color || '#555';
      ctx.fillRect(p.x, p.y, p.width, p.height);
      if (p.type === 'grass') {
        ctx.fillStyle = '#4a7c3f';
        ctx.fillRect(p.x, p.y, p.width, 8);
      }
    });

    this.doors.forEach(d => {
      ctx.fillStyle = d.isOpen ? '#2ecc71' : '#7f8c8d';
      ctx.fillRect(d.x, d.y, d.width, d.height);
      if (d.isOpen) {
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(d.x + 4, d.y + 4, d.width - 8, d.height - 8);
      }
    });

    this.diamonds.forEach(d => d.draw(ctx));
    this.enemies.forEach(e => e.draw(ctx));
    this.players.forEach(p => p.draw(ctx));

    ctx.restore();

    UI.drawHUD(ctx);
  },

  checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
};
