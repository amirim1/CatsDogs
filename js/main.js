const App = {
  canvas: null,
  ctx: null,
  state: 'menu', // menu | playing | win
  currentLevel: 1,
  assets: {},
  assetsLoaded: false,
  assetsTotal: 0,
  assetsLoadedCount: 0,

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    Game.init();
    this.loop();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  },

  update() {
    if (this.state === 'menu' || this.state === 'win') return;
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
    this.currentLevel++;
    if (this.currentLevel > 3) {
      this.state = 'win';
      return;
    }
    Game.initLevel(this.currentLevel);
  },

  restartLevel() {
    Game.initLevel(this.currentLevel);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
