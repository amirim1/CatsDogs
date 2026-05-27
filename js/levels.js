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
    const platformCount = num === 1 ? 4 + Math.floor(Math.random() * 2)
                      : num === 2 ? 5 + Math.floor(Math.random() * 3)
                      : 8 + Math.floor(Math.random() * 3);

    const floorSets = ['choco', 'clean', 'pink'];
    const floorSet = floorSets[num % 3];

    const level = {
      width: 800 + platformCount * 200,
      height: 720,
      floorSet: floorSet,
      spawn: { cat: { x: 80, y: 540 }, dog: { x: 180, y: 540 } },
      platforms: [],
      diamonds: [],
      doors: [],
      enemies: [],
      key: null,
    };

    const groundY = 648;
    const groundH = level.height - groundY;
    level.platforms.push({ x: 0, y: groundY, width: level.width, height: groundH, style: 'floor', floorSet: floorSet });

    const styles = ['burger', 'sausage'];
    let px = 250;
    let py = 590;
    const maxStepUp = -80;
    const maxStepDown = 70;

    for (let i = 0; i < platformCount; i++) {
      const style = styles[i % styles.length];
      const w = 180 + Math.floor(Math.random() * 60);
      const gapX = 180 + Math.floor(Math.random() * 80);

      let dy;
      if (py <= 200) {
        dy = 20 + Math.floor(Math.random() * 40);
      } else if (py >= groundY - 150) {
        dy = -(40 + Math.floor(Math.random() * 50));
      } else {
        dy = maxStepUp + Math.floor(Math.random() * (maxStepDown - maxStepUp + 1));
      }
      dy = Math.max(maxStepUp, Math.min(maxStepDown, dy));
      const newY = Math.max(150, Math.min(groundY - 100, py + dy));

      px += gapX;
      py = newY;

      level.platforms.push({ x: px, y: py, width: w, height: 36, style: style });

      if (Math.random() < 0.5) {
        level.diamonds.push({ x: px + 20 + Math.floor(Math.random() * (w - 40)), y: py - 30 });
      }
    }

    for (let i = 0; i < 2 + num; i++) {
      level.diamonds.push({
        x: 200 + Math.floor(Math.random() * (level.width - 400)),
        y: groundY - 30,
      });
    }

    const lastPlat = level.platforms[level.platforms.length - 1];
    const doorY = groundY - 96;
    level.doors.push(
      { x: Math.max(lastPlat.x + lastPlat.width + 60, level.width - 360), y: doorY, width: 48, height: 96, isOpen: false, owner: 'cat' },
      { x: Math.max(lastPlat.x + lastPlat.width + 140, level.width - 260), y: doorY, width: 48, height: 96, isOpen: false, owner: 'dog' },
    );

    const midIdx = Math.floor(platformCount / 2);
    const keyPlat = level.platforms[midIdx + 1] || level.platforms[level.platforms.length - 1];
    level.key = { x: keyPlat.x + keyPlat.width / 2 - 12, y: keyPlat.y - 36 };

    if (isHard) {
      const enemyCount = 2 + Math.floor(Math.random() * 2);
      const patterns = ['patrol', 'rush', 'random'];
      for (let e = 0; e < enemyCount; e++) {
        const ei = Math.floor(Math.random() * level.platforms.length);
        const plat = level.platforms[ei] || level.platforms[0];
        const patrolW = Math.min(120 + Math.floor(Math.random() * 80), plat.width - 20);
        const cx = plat.x + plat.width / 2;
        const halfW = patrolW / 2;
        level.enemies.push({
          x: cx,
          y: plat.y - 40,
          patrolLeft: Math.max(plat.x, cx - halfW),
          patrolRight: Math.min(plat.x + plat.width, cx + halfW),
          speed: 0.8 + Math.random() * 0.7,
          pattern: patterns[e % patterns.length],
        });
      }
    }

    return level;
  },
};
