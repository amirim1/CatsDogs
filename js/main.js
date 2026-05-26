const App = {
  canvas: null,
  ctx: null,
  state: 'menu',
  currentLevel: 1,
  assets: {},
  sounds: {},
  assetsLoaded: false,

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    Game.init();
    this.loadAssets();
    this.loadSounds();
    this.loop();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  loadAssets() {
    const list = [
      { id: 'cat_idle', src: 'assets/catndog/png/cat/Idle (1).png' },
      { id: 'cat_run', src: 'assets/catndog/png/cat/Run (1).png' },
      { id: 'cat_jump', src: 'assets/catndog/png/cat/Jump (1).png' },
      { id: 'dog_idle', src: 'assets/catndog/png/dog/Idle (1).png' },
      { id: 'dog_run', src: 'assets/catndog/png/dog/Run (1).png' },
      { id: 'dog_jump', src: 'assets/catndog/png/dog/Jump (1).png' },
      { id: 'platform_grass', src: 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/terrain_grass_block.png' },
      { id: 'platform_stone', src: 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/terrain_stone_block.png' },
      { id: 'gem', src: 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/gem_blue.png' },
      { id: 'door_closed', src: 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/door_closed.png' },
      { id: 'door_open', src: 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/door_open.png' },
      { id: 'background', src: 'assets/kenney_new-platformer-pack-1.1/Sprites/Backgrounds/Default/background_solid_grass.png' },
    ];

    let loaded = 0;
    const total = list.length;
    if (total === 0) { this.assetsLoaded = true; return; }

    list.forEach(item => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        this.assets[item.id] = img;
        if (loaded >= total) this.assetsLoaded = true;
      };
      img.onerror = () => {
        loaded++;
        if (loaded >= total) this.assetsLoaded = true;
      };
      img.src = item.src;
    });
  },

  loadSounds() {
    const list = [
      { id: 'jump', src: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_jump.ogg' },
      { id: 'gem', src: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_gem.ogg' },
      { id: 'hurt', src: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_hurt.ogg' },
      { id: 'win', src: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_magic.ogg' },
    ];

    list.forEach(item => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.oncanplaythrough = () => { this.sounds[item.id] = audio; };
      audio.onerror = () => {};
      audio.src = item.src;
    });
  },

  playSound(id) {
    try {
      if (this.sounds[id]) {
        const s = this.sounds[id].cloneNode();
        s.volume = 0.3;
        s.play().catch(() => {});
      }
    } catch (_) {}
  },

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  },

  update() {
    if (this.state === 'playing') Game.update();
  },

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.state === 'menu') {
      UI.drawMenu(ctx);
    } else if (this.state === 'win') {
      UI.drawWin(ctx);
    } else if (this.state === 'playing') {
      Game.render();
    }
  },

  startGame() {
    this.state = 'playing';
    this.currentLevel = 1;
    Game.initLevel(1);
  },

  nextLevel() {
    App.playSound('win');
    this.currentLevel++;
    if (this.currentLevel > 3) {
      this.state = 'win';
      return;
    }
    Game.initLevel(this.currentLevel);
  },

  restartLevel() {
    App.playSound('hurt');
    Game.initLevel(this.currentLevel);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
