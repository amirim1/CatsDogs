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

    const floorSets = ['choco', 'clean', 'pink'];
    const floorSet = floorSets[num % 3];

    const level = {
      width: 1920,
      height: 1080,
      floorSet: floorSet,
      spawn: { cat: { x: 120, y: 810 }, dog: { x: 270, y: 810 } },
      platforms: [],
      diamonds: [],
      doors: [],
      enemies: [],
      key: null,
    };

    const groundY = 972;
    const groundH = 500;
    level.platforms.push({ x: 0, y: groundY, width: level.width, height: groundH, style: 'floor', floorSet: floorSet });

    const platformLayouts = {
      1: [
        { x: 300, y: 840 },
        { x: 570, y: 765 },
        { x: 840, y: 840 },
        { x: 1110, y: 765 },
      ],
      2: [
        { x: 270, y: 795 },
        { x: 570, y: 705 },
        { x: 870, y: 795 },
        { x: 1170, y: 705 },
        { x: 1470, y: 795 },
      ],
      3: [
        { x: 240, y: 825 },
        { x: 495, y: 720 },
        { x: 750, y: 615 },
        { x: 1005, y: 720 },
        { x: 1260, y: 615 },
        { x: 1515, y: 825 },
      ],
    };
    const positions = platformLayouts[num] || platformLayouts[1];
    const platformCount = positions.length;

    const styles = ['burger', 'sausage'];
    positions.forEach((pos, i) => {
      const style = styles[i % styles.length];
      level.platforms.push({ x: pos.x, y: pos.y, width: 130, height: 36, style: style });
      if (Math.random() < 0.5) {
        level.diamonds.push({ x: pos.x + 30 + Math.floor(Math.random() * 70), y: pos.y - 30 });
      }
    });

    for (let i = 0; i < 2 + num; i++) {
      level.diamonds.push({
        x: 300 + Math.floor(Math.random() * (level.width - 600)),
        y: groundY - 30,
      });
    }

    const doorY = groundY - 96;
    const margin = 120;
    const sectionW = (level.width - margin * 2) / 3;
    const catX = margin + Math.floor(Math.random() * (sectionW - 72));
    const dogX = margin + sectionW * 2 + Math.floor(Math.random() * (sectionW - 72));
    level.doors.push(
      { x: catX, y: doorY, width: 48, height: 96, isOpen: false, owner: 'cat' },
      { x: dogX, y: doorY, width: 48, height: 96, isOpen: false, owner: 'dog' },
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
          speed: 0.3 + Math.random() * 0.3,
          pattern: patterns[e % patterns.length],
        });
      }
    }

    return level;
  },
};
