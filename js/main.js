const App = {
  canvas: null,
  ctx: null,
  state: 'menu',
  paused: false,
  currentLevel: 1,
  assets: {},
  assetGroups: {},
  assetsLoaded: false,
  loadingProgress: 0,
  frame: 0,
  soundEnabled: true,
  soundCooldowns: {},

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    Game.init();
    this.loadAssets();
    this.loop();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  loadAssets() {
    const list = [];
    const add = (id, src) => list.push({ id, src });
    const addAnimation = (type, animation, frameCount) => {
      const folder = type === 'cat' ? 'cat' : 'dog';
      const filePrefix = animation[0].toUpperCase() + animation.slice(1);
      const groupId = `${type}_${animation}`;
      this.assetGroups[groupId] = [];
      for (let i = 1; i <= frameCount; i++) {
        const id = `${groupId}_${i}`;
        this.assetGroups[groupId].push(id);
        add(id, `assets/catndog/png/${folder}/${filePrefix} (${i}).png`);
      }
    };

    ['cat', 'dog'].forEach(type => {
      addAnimation(type, 'idle', 10);
      addAnimation(type, 'run', 8);
      addAnimation(type, 'jump', 8);
      addAnimation(type, 'fall', 8);
      addAnimation(type, 'hurt', 10);
    });

    [
      ['gem', 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/gem_blue.png'],
      ['door_closed', 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/door_closed.png'],
      ['door_open', 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/door_open.png'],
      ['key_yellow', 'assets/kenney_new-platformer-pack-1.1/Sprites/Tiles/Default/key_yellow.png'],
      ['burger_left', 'assets/floor/burger1of3.png'],
      ['burger_mid', 'assets/floor/burger2of3.png'],
      ['burger_right', 'assets/floor/burger3of3.png'],
      ['sausage_left', 'assets/floor/sausage1of3.png'],
      ['sausage_mid', 'assets/floor/sausage2of3.png'],
      ['sausage_right', 'assets/floor/sausage3of3.png'],
      ['sausage2_left', 'assets/floor/sausage1of2.png'],
      ['sausage2_right', 'assets/floor/sausage2of2.png'],
      ['floor_choco_01', 'assets/floor/floor_choco_01.png'],
      ['floor_choco_02', 'assets/floor/floor_choco_02.png'],
      ['floor_choco_03', 'assets/floor/floor_choco_03.png'],
      ['floor_choco_04', 'assets/floor/floor_choco_04.png'],
      ['floor_clean_01', 'assets/floor/floor_clean_01.png'],
      ['floor_clean_02', 'assets/floor/floor_clean_02.png'],
      ['floor_clean_03', 'assets/floor/floor_clean_03.png'],
      ['floor_clean_04', 'assets/floor/floor_clean_04.png'],
      ['pinkfloor1of4', 'assets/floor/pinkfloor1of4.png'],
      ['pinkfloor2of4', 'assets/floor/pinkfloor2of4.png'],
      ['pinkfloor3of4', 'assets/floor/pinkfloor3of4.png'],
      ['pinkfloor4of4', 'assets/floor/pinkfloor4of4.png'],
    ].forEach(([id, src]) => add(id, src));

    let completed = 0;
    const total = list.length;
    if (total === 0) {
      this.assetsLoaded = true;
      this.loadingProgress = 1;
      return;
    }

    list.forEach(item => {
      const img = new Image();
      const finish = () => {
        completed++;
        this.loadingProgress = completed / total;
        if (completed >= total) this.assetsLoaded = true;
      };
      img.onload = () => {
        this.assets[item.id] = img;
        finish();
      };
      img.onerror = () => {
        console.warn('Failed to load asset:', item.id, item.src);
        finish();
      };
      img.src = item.src;
    });
  },

  getAnimationFrame(groupId, animTime) {
    const ids = this.assetGroups[groupId] || [];
    if (!ids.length) return null;
    const index = Math.floor(animTime) % ids.length;
    const img = this.assets[ids[index]];
    return img && img.complete && img.naturalWidth > 0 ? img : null;
  },

  playSound(id) {
    if (!this.soundEnabled) return;
    try {
      const now = performance.now();
      if ((this.soundCooldowns[id] || 0) > now) return;
      this.soundCooldowns[id] = now + 70;

      const srcMap = {
        jump: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_jump.ogg',
        gem: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_gem.ogg',
        hurt: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_hurt.ogg',
        win: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_magic.ogg',
        key: 'assets/kenney_new-platformer-pack-1.1/Sounds/sfx_select.ogg',
      };
      if (!srcMap[id]) return;
      const audio = new Audio(srcMap[id]);
      audio.volume = id === 'hurt' ? 0.24 : 0.18;
      audio.play().catch(() => {});
    } catch (_) {}
  },

  loop() {
    this.frame++;
    try {
      this.update();
      this.render();
    } catch (error) {
      console.error('Game loop error:', error);
    }
    requestAnimationFrame(() => this.loop());
  },

  update() {
    if (this.state === 'playing' && !this.paused) Game.update();
  },

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.assetsLoaded && this.state === 'menu') {
      UI.drawLoading(ctx, this.loadingProgress);
      return;
    }

    if (this.state === 'menu') {
      UI.drawMenu(ctx);
    } else if (this.state === 'win') {
      UI.drawWin(ctx);
    } else if (this.state === 'fail') {
      UI.drawFail(ctx);
    } else if (this.state === 'playing') {
      Game.render();
      if (this.paused) UI.drawPause(ctx);
    }
  },

  startGame() {
    this.paused = false;
    this.state = 'playing';
    this.currentLevel = 1;
    Game.runStats = { diamondsBase: 0, diamondsTotal: 0, runFrames: 0, newRecords: 0 };
    Game.initLevel(this.currentLevel);
  },

  formatTime(frames) {
    const totalSeconds = Math.floor(frames / 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  },

  loadBestTimes() {
    try {
      return JSON.parse(localStorage.getItem('catsdogs_best_times') || '{}');
    } catch (_) {
      return {};
    }
  },

  saveBestTime(levelNum, frames) {
    try {
      const best = this.loadBestTimes();
      if (best[levelNum] === undefined || frames < best[levelNum]) {
        best[levelNum] = frames;
        localStorage.setItem('catsdogs_best_times', JSON.stringify(best));
        return true;
      }
    } catch (_) {}
    return false;
  },

  nextLevel() {
    this.playSound('win');
    this.currentLevel++;
    if (this.currentLevel > Levels.count()) {
      this.state = 'win';
      return;
    }
    Game.initLevel(this.currentLevel);
  },

  restartLevel() {
    this.paused = false;
    this.state = 'playing';
    Game.initLevel(this.currentLevel);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
