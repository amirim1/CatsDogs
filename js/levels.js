const Levels = {
  _last: null,

  generate(num) {
    const level = this._build(num);
    this._last = level;
    return level;
  },

  getLast() {
    return this._last;
  },

  _build(num) {
    const isHard = num >= 3;
    const platformCount = num === 1 ? 5 + Math.floor(Math.random() * 2)
                      : num === 2 ? 7 + Math.floor(Math.random() * 3)
                      : 10 + Math.floor(Math.random() * 3);

    const level = {
      width: 600 + platformCount * 220 + Math.floor(Math.random() * 200),
      height: 720,
      spawn: { cat: { x: 80, y: 540 }, dog: { x: 180, y: 540 } },
      platforms: [],
      diamonds: [],
      doors: [],
      enemies: [],
      key: null,
    };

    // Floor
    const groundY = 648;
    const groundH = level.height - groundY; // 72
    level.platforms.push({ x: 0, y: groundY, width: level.width, height: groundH, style: 'floor' });

    // Floating platforms
    const styles = ['burger', 'sausage'];
    let px = 250;
    let py = 520;
    const usedHeights = new Set();

    for (let i = 0; i < platformCount; i++) {
      const style = styles[i % styles.length];
      const w = 180 + Math.floor(Math.random() * 80);
      const gapX = 160 + Math.floor(Math.random() * 80);

      // Vertical step
      const canGoUp = py - 130 > 150;
      const canGoDown = py + 60 < groundY - 120;
      let dy;
      if (canGoUp && canGoDown) {
        dy = Math.random() < 0.6 ? -(40 + Math.floor(Math.random() * 80)) : (20 + Math.floor(Math.random() * 40));
      } else if (canGoUp) {
        dy = -(40 + Math.floor(Math.random() * 80));
      } else if (canGoDown) {
        dy = (20 + Math.floor(Math.random() * 40));
      } else {
        dy = -(20 + Math.floor(Math.random() * 40));
      }

      // Clamp
      const newY = Math.max(180, Math.min(groundY - 96, py + dy));

      px += gapX;
      py = newY;

      level.platforms.push({
        x: px, y: py, width: w, height: 36, style: style,
      });

      usedHeights.add(py);

      // Diamond on some platforms
      if (Math.random() < 0.5) {
        level.diamonds.push({ x: px + 20 + Math.floor(Math.random() * (w - 40)), y: py - 30 });
      }
    }

    // Extra diamonds on ground
    for (let i = 0; i < 2 + num; i++) {
      level.diamonds.push({
        x: 200 + Math.floor(Math.random() * (level.width - 400)),
        y: groundY - 30,
      });
    }

    // Key on a middle platform
    const midIdx = Math.floor(platformCount / 2);
    const keyPlat = level.platforms[midIdx + 1] || level.platforms[level.platforms.length - 1];
    level.key = { x: keyPlat.x + keyPlat.width / 2 - 12, y: keyPlat.y - 36 };

    // Doors at the end
    const lastPlat = level.platforms[level.platforms.length - 1];
    const doorY = groundY - 96;
    level.doors.push(
      { x: Math.max(lastPlat.x + lastPlat.width + 80, level.width - 320), y: doorY, width: 48, height: 96, isOpen: false, owner: 'cat' },
      { x: Math.max(lastPlat.x + lastPlat.width + 160, level.width - 240), y: doorY, width: 48, height: 96, isOpen: false, owner: 'dog' },
    );

    // Enemies on level 3
    if (isHard) {
      const enemyCount = 2 + Math.floor(Math.random() * 2);
      const patterns = ['patrol', 'rush', 'random'];
      for (let e = 0; e < enemyCount; e++) {
        const ei = 2 + Math.floor(Math.random() * (platformCount - 3));
        const plat = level.platforms[ei] || level.platforms[level.platforms.length - 1];
        const patrolW = 120 + Math.floor(Math.random() * 80);
        level.enemies.push({
          x: plat.x + plat.width / 2,
          y: plat.y - 40,
          patrolLeft: plat.x + plat.width / 2 - patrolW / 2,
          patrolRight: plat.x + plat.width / 2 + patrolW / 2,
          speed: 1.5 + Math.random(),
          pattern: patterns[e % patterns.length],
        });
      }
    }

    return level;
  },
};
