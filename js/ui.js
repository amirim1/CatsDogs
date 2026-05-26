const UI = {
  drawHUD(ctx) {
    const w = App.canvas.width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, w, 36);

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.textBaseline = 'middle';

    ctx.fillText(`Level ${App.currentLevel}`, 12, 18);

    ctx.fillStyle = Game.keyCollected ? '#f1c40f' : '#666';
    ctx.fillText(Game.keyCollected ? 'KEY \u2713' : 'KEY ?', 120, 18);

    const total = Game.diamonds.length;
    const collected = Game.diamonds.filter(d => d.collected).length;
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`\u2666 ${collected}/${total}`, 220, 18);

    // Lives
    ctx.fillStyle = '#e74c3c';
    ctx.font = '14px monospace';
    ctx.fillText(`Cat: ${'\u2665'.repeat(Game.players[0] ? Game.players[0].lives : 0)}`, w - 300, 18);
    ctx.fillStyle = '#3498db';
    ctx.fillText(`Dog: ${'\u2665'.repeat(Game.players[1] ? Game.players[1].lives : 0)}`, w - 160, 18);
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
    ctx.fillStyle = '#e74c3c';
    ctx.fillText('Cat: WASD + W to jump', w / 2, h / 2 + 30);
    ctx.fillStyle = '#3498db';
    ctx.fillText('Dog: Arrow keys + Up to jump', w / 2, h / 2 + 52);
    ctx.fillStyle = '#aaa';
    ctx.fillText('Find the key, then each reach their own door!', w / 2, h / 2 + 80);
    ctx.fillText('Each character has 3 lives. Avoid enemies!', w / 2, h / 2 + 100);

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('Press ENTER to start', w / 2, h / 2 + 140);
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
  },

  drawFail(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;

    ctx.fillStyle = '#1a0a0a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Level Failed', w / 2, h / 2 - 40);

    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.fillText('Both characters ran out of lives!', w / 2, h / 2 + 20);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('Press ENTER to retry', w / 2, h / 2 + 70);
  }
};
