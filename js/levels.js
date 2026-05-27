const Levels = {
  _last: null,

  count() {
    return 5;
  },

  generate(num) {
    const level = this._build(Math.max(1, Math.min(num, this.count())));
    this._last = level;
    return level;
  },

  getLast() {
    return this._last;
  },

  _build(num) {
    const width = 1920;
    const height = 1080;
    const groundY = 952;
    const playerH = 76;
    const floorSets = ['choco', 'clean', 'pink', 'choco', 'pink'];
    const level = {
      width,
      height,
      floorSet: floorSets[num - 1] || 'choco',
      spawn: {
        cat: { x: 120, y: groundY - playerH },
        dog: { x: 210, y: groundY - playerH },
      },
      platforms: [
        { x: 0, y: groundY, width, height: 360, style: 'floor', floorSet: floorSets[num - 1] || 'choco' },
      ],
      diamonds: [],
      doors: [
        { x: width - 245, y: groundY - 96, width: 52, height: 96, owner: 'cat' },
        { x: width - 160, y: groundY - 96, width: 52, height: 96, owner: 'dog' },
      ],
      enemies: [],
      key: null,
    };

    const addPlatform = (x, y, w = 200, style = 'burger') => {
      const platform = { x, y, width: w, height: 36, style };
      level.platforms.push(platform);
      return platform;
    };
    const addDiamond = (x, y) => level.diamonds.push({ x, y });
    const addEnemyOn = (platform, speed = 1.25, pattern = 'patrol', inset = 12) => {
      level.enemies.push({
        x: platform.x + 16,
        y: platform.y - 40,
        patrolLeft: platform.x + inset,
        patrolRight: platform.x + platform.width - inset,
        speed,
        pattern,
      });
    };
    const putKey = (platform) => {
      level.key = { x: platform.x + platform.width / 2 - 15, y: platform.y - 44 };
    };

    if (num === 1) {
      const p1 = addPlatform(330, 830, 220, 'burger');
      const p2 = addPlatform(650, 728, 220, 'sausage');
      const p3 = addPlatform(970, 626, 220, 'burger');
      const p4 = addPlatform(1290, 738, 240, 'sausage');
      putKey(p3);
      [p1, p2, p3, p4].forEach(p => addDiamond(p.x + p.width / 2 - 12, p.y - 34));
      addDiamond(470, groundY - 34);
      addDiamond(1500, groundY - 34);
    }

    if (num === 2) {
      const p1 = addPlatform(300, 820, 210, 'sausage');
      const p2 = addPlatform(600, 710, 230, 'burger');
      const p3 = addPlatform(930, 600, 230, 'sausage');
      const p4 = addPlatform(1260, 710, 230, 'burger');
      const p5 = addPlatform(1480, 840, 210, 'sausage2');
      putKey(p3);
      [p1, p2, p3, p4, p5].forEach((p, i) => addDiamond(p.x + 45 + (i % 2) * 70, p.y - 34));
      addDiamond(760, groundY - 34);
      addDiamond(1160, groundY - 34);
      addEnemyOn({ x: 790, y: groundY, width: 280 }, 1.05, 'patrol', 0);
    }

    if (num === 3) {
      const p1 = addPlatform(260, 820, 210, 'burger');
      const p2 = addPlatform(540, 700, 210, 'sausage');
      const p3 = addPlatform(830, 580, 240, 'burger');
      const p4 = addPlatform(1140, 700, 210, 'sausage');
      const p5 = addPlatform(1430, 820, 230, 'burger');
      const safe = addPlatform(830, 840, 240, 'sausage2');
      putKey(p3);
      [p1, p2, p3, p4, p5, safe].forEach((p, i) => addDiamond(p.x + p.width / 2 - 12 + (i % 2 ? 35 : -35), p.y - 34));
      addEnemyOn(safe, 1.25, 'rush');
      addEnemyOn({ x: 1180, y: groundY, width: 360 }, 1.15, 'patrol', 0);
    }

    if (num === 4) {
      const p1 = addPlatform(250, 815, 190, 'sausage');
      const p2 = addPlatform(520, 705, 205, 'burger');
      const p3 = addPlatform(800, 595, 220, 'sausage');
      const p4 = addPlatform(1080, 485, 230, 'burger');
      const p5 = addPlatform(1370, 610, 220, 'sausage');
      const p6 = addPlatform(1510, 790, 240, 'burger');
      const low = addPlatform(700, 850, 290, 'sausage2');
      putKey(p4);
      [p1, p2, p3, p4, p5, p6, low].forEach((p, i) => addDiamond(p.x + 40 + (i * 43) % Math.max(80, p.width - 70), p.y - 34));
      addEnemyOn(low, 1.35, 'rush');
      addEnemyOn(p5, 1.15, 'chase');
      addEnemyOn({ x: 1280, y: groundY, width: 360 }, 1.25, 'patrol', 0);
    }

    if (num === 5) {
      const p1 = addPlatform(240, 830, 210, 'burger');
      const p2 = addPlatform(520, 720, 210, 'sausage');
      const p3 = addPlatform(790, 610, 210, 'burger');
      const p4 = addPlatform(1060, 500, 230, 'sausage');
      const p5 = addPlatform(1350, 615, 210, 'burger');
      const p6 = addPlatform(1530, 785, 250, 'sausage2');
      const mid = addPlatform(780, 850, 280, 'burger');
      putKey(p4);
      [p1, p2, p3, p4, p5, p6, mid].forEach((p, i) => {
        addDiamond(p.x + 45, p.y - 34);
        if (i % 2 === 0) addDiamond(p.x + p.width - 68, p.y - 34);
      });
      addEnemyOn(mid, 1.4, 'rush');
      addEnemyOn(p5, 1.25, 'chase');
      addEnemyOn({ x: 520, y: groundY, width: 320 }, 1.2, 'patrol', 0);
      addEnemyOn({ x: 1180, y: groundY, width: 360 }, 1.35, 'rush', 0);
    }

    return level;
  },
};
