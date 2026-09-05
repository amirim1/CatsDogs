const UI = {
  drawHUD(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;
    const total = Game.diamonds.length;
    const collected = Game.diamonds.filter(diamond => diamond.collected).length;
    const catLives = Game.players[0] ? Game.players[0].lives : 0;
    const dogLives = Game.players[1] ? Game.players[1].lives : 0;
    const runFrames = Game.runStats.runFrames + Game.levelTime;
    const best = App.loadBestTimes()[App.currentLevel];

    ctx.save();
    ctx.fillStyle = 'rgba(16, 24, 39, 0.78)';
    ctx.fillRect(0, 0, w, 52);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    let x = 18;
    const put = (text, color, bold = false) => {
      ctx.font = `${bold ? 'bold ' : ''}16px monospace`;
      ctx.fillStyle = color;
      ctx.fillText(text, x, 26);
      x += ctx.measureText(text).width + 28;
    };

    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Level ${App.currentLevel}/${Levels.count()}`, x, 26);
    x += ctx.measureText(`Level ${App.currentLevel}/${Levels.count()}`).width + 28;

    put(`⏱ ${App.formatTime(runFrames)}`, '#e5e7eb');
    if (best !== undefined) put(`Best ${App.formatTime(best)}`, '#f1c40f');
    put(Game.keyCollected ? 'Key ✓' : 'Key ?', Game.keyCollected ? '#f1c40f' : '#9ca3af');
    put(`Diamonds ${collected}/${total}`, collected === total ? '#2ecc71' : '#4dd8ff');

    if (w >= 900 && x < w * 0.55) {
      ctx.font = '15px monospace';
      ctx.fillStyle = '#d1d5db';
      ctx.textAlign = 'center';
      ctx.fillText(Game.keyCollected ? 'Doors are ready' : 'Find the key to open the doors', w / 2, 26);
    }

    ctx.textAlign = 'right';
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText(`Cat ${'♥'.repeat(catLives)}${'♡'.repeat(Math.max(0, 3 - catLives))}`, w - 245, 26);
    ctx.fillStyle = '#74b9ff';
    ctx.fillText(`Dog ${'♥'.repeat(dogLives)}${'♡'.repeat(Math.max(0, 3 - dogLives))}`, w - 95, 26);

    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = '12px monospace';
    ctx.fillText(`R — restart   ESC — pause   M — sound: ${App.soundEnabled ? 'on' : 'off'}`, w - 18, h - 18);
    ctx.restore();
  },

  drawLoading(ctx, progress) {
    const w = App.canvas.width;
    const h = App.canvas.height;
    this.drawMenuBackground(ctx, w, h);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px monospace';
    ctx.fillText('Cats & Dogs', w / 2, h / 2 - 80);

    const barW = Math.min(420, w * 0.7);
    const barH = 18;
    const x = w / 2 - barW / 2;
    const y = h / 2 - 10;
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    this.roundRect(ctx, x, y, barW, barH, 9);
    ctx.fill();
    ctx.fillStyle = '#2ecc71';
    this.roundRect(ctx, x, y, barW * progress, barH, 9);
    ctx.fill();
    ctx.fillStyle = '#d1d5db';
    ctx.font = '16px monospace';
    ctx.fillText(`Loading assets... ${Math.round(progress * 100)}%`, w / 2, h / 2 + 36);
    ctx.restore();
  },

  drawMenu(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;
    this.drawMenuBackground(ctx, w, h);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 56px monospace';
    ctx.fillText('Cats & Dogs', w / 2, h / 2 - 142);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText('кооперативный 2D-платформер', w / 2, h / 2 - 92);

    this.drawMenuCard(ctx, w / 2 - 300, h / 2 - 40, 600, 150);
    ctx.font = '17px monospace';
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText('Cat: A / D — движение, W — прыжок', w / 2, h / 2 - 3);
    ctx.fillStyle = '#74b9ff';
    ctx.fillText('Dog: ← / → — движение, ↑ — прыжок', w / 2, h / 2 + 27);
    ctx.fillStyle = '#d1d5db';
    ctx.fillText('Найдите ключ и дойдите до своих дверей. Алмазы — бонус.', w / 2, h / 2 + 67);

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('Press ENTER to start', w / 2, h / 2 + 155);

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '13px monospace';
    ctx.fillText('R — restart   ESC — pause   M — sound', w / 2, h - 34);
    ctx.restore();
  },

  drawPause(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;
    const runFrames = Game.runStats.runFrames + Game.levelTime;
    const total = Game.diamonds.length;
    const collected = Game.diamonds.filter(diamond => diamond.collected).length;

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px monospace';
    ctx.fillText('PAUSED', w / 2, h / 2 - 60);
    ctx.font = '17px monospace';
    ctx.fillStyle = '#d1d5db';
    ctx.fillText(`Уровень ${App.currentLevel} из ${Levels.count()}`, w / 2, h / 2 - 2);
    ctx.fillText(`⏱ ${App.formatTime(runFrames)}   💎 ${collected}/${total}`, w / 2, h / 2 + 30);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Press ESC to continue   ·   R to restart level', w / 2, h / 2 + 74);
    ctx.restore();
  },

  drawWin(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;
    const stats = Game.runStats;
    const perfect = stats.diamondsTotal > 0 && stats.diamondsBase >= stats.diamondsTotal;

    this.drawMenuBackground(ctx, w, h);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 54px monospace';
    ctx.fillText('Победа!', w / 2, h / 2 - 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px monospace';
    ctx.fillText('Все уровни пройдены!', w / 2, h / 2 - 64);

    const cardY = h / 2 - 20;
    this.drawMenuCard(ctx, w / 2 - 230, cardY, 460, 150);
    ctx.font = '20px monospace';
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(`⏱ Общее время: ${App.formatTime(stats.runFrames)}`, w / 2, cardY + 40);
    ctx.fillStyle = '#4dd8ff';
    ctx.fillText(`💎 Алмазы: ${stats.diamondsBase}/${stats.diamondsTotal}`, w / 2, cardY + 78);
    if (perfect) {
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('⭐ PERFECT — все алмазы собраны!', w / 2, cardY + 118);
    } else {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '17px monospace';
      ctx.fillText(`Алмазы — бонус к статистике. Попробуй собрать все!`, w / 2, cardY + 118);
    }

    if (stats.newRecords > 0) {
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 19px monospace';
      ctx.fillText(`🏆 Новых рекордов: ${stats.newRecords}`, w / 2, h / 2 + 160);
    }

    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('Нажмите ENTER, чтобы начать заново', w / 2, h / 2 + 210);

    ctx.restore();
  },

  drawFail(ctx) {
    const w = App.canvas.width;
    const h = App.canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#2b1115');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 52px monospace';
    ctx.fillText('Level Failed', w / 2, h / 2 - 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px monospace';
    ctx.fillText('Один из героев потерял все жизни.', w / 2, h / 2 - 8);
    ctx.fillStyle = '#d1d5db';
    ctx.fillText('Попробуй двигаться аккуратнее и собрать ключ до выхода.', w / 2, h / 2 + 24);
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 23px monospace';
    ctx.fillText('Press ENTER to retry', w / 2, h / 2 + 92);
    ctx.restore();
  },

  drawMenuBackground(ctx, w, h) {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#172554');
    gradient.addColorStop(0.5, '#312e81');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 80; i++) {
      const x = (i * 97) % w;
      const y = (i * 53) % h;
      ctx.fillRect(x, y, 2, 2);
    }
  },

  drawMenuCard(ctx, x, y, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    this.roundRect(ctx, x, y, width, height, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.stroke();
    ctx.restore();
  },

  roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
};
