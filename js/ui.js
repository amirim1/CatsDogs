const UI = {
  drawHUD(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;

    // Dark bar at top
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, w, 36);

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textBaseline = 'middle';

    // Level
    ctx.fillText(`Level ${App.currentLevel}`, 12, 18);

    // Diamonds count
    const total = Game.diamonds.length;
    const collected = Game.diamonds.filter(d => d.collected).length;
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`♦ ${collected}/${total}`, 120, 18);

    // Active player indicator
    ctx.fillStyle = '#f1c40f';
    const activeName = Game.activePlayer ? Game.activePlayer.type : 'none';
    ctx.fillText(`Active: ${activeName}`, 240, 18);
  },

  drawMenu(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cats & Dogs', w / 2, h / 2 - 80);

    ctx.fillStyle = '#fff';
    ctx.font = '18px monospace';
    ctx.fillText('2D Platformer Adventure', w / 2, h / 2 - 30);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Cat: WASD + W jump', w / 2, h / 2 + 30);
    ctx.fillText('Dog: Arrow keys + Up jump', w / 2, h / 2 + 52);
    ctx.fillText('Tab — switch character', w / 2, h / 2 + 74);

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('Press ENTER to start', w / 2, h / 2 + 130);
  },

  drawWin(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Victory!', w / 2, h / 2 - 60);

    ctx.fillStyle = '#fff';
    ctx.font = '20px monospace';
    ctx.fillText('Congratulations! You completed all levels!', w / 2, h / 2);

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('Press ENTER to play again', w / 2, h / 2 + 60);
  }
};
