const Levels = {
  getData(levelNum) {
    switch (levelNum) {
      case 1: return this.level1;
      case 2: return this.level2;
      case 3: return this.level3;
      default: return this.level1;
    }
  },

  level1: {
    width: 1600,
    height: 600,
    spawn: { cat: { x: 50, y: 450 }, dog: { x: 100, y: 450 } },
    platforms: [
      // Ground
      { x: 0, y: 550, width: 1600, height: 50, type: 'grass', color: '#555' },
      // Platforms
      { x: 300, y: 400, width: 200, height: 20, type: 'stone', color: '#777' },
      { x: 600, y: 300, width: 200, height: 20, type: 'stone', color: '#777' },
      { x: 900, y: 400, width: 200, height: 20, type: 'stone', color: '#777' },
      { x: 1200, y: 300, width: 200, height: 20, type: 'stone', color: '#777' },
    ],
    diamonds: [
      { x: 370, y: 370 }, { x: 670, y: 270 },
      { x: 970, y: 370 }, { x: 1270, y: 270 },
    ],
    doors: [
      { x: 1480, y: 500, width: 40, height: 50, isOpen: false },
    ],
    enemies: [],
  },

  level2: {
    width: 2000,
    height: 600,
    spawn: { cat: { x: 50, y: 450 }, dog: { x: 100, y: 450 } },
    platforms: [
      { x: 0, y: 550, width: 2000, height: 50, type: 'grass', color: '#555' },
      { x: 250, y: 400, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 500, y: 300, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 750, y: 200, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 1000, y: 300, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 1250, y: 400, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 1500, y: 300, width: 150, height: 20, type: 'stone', color: '#777' },
    ],
    diamonds: [
      { x: 310, y: 370 }, { x: 560, y: 270 },
      { x: 810, y: 170 }, { x: 1060, y: 270 },
      { x: 1310, y: 370 }, { x: 1560, y: 270 },
    ],
    doors: [
      { x: 1850, y: 500, width: 40, height: 50, isOpen: false },
    ],
    enemies: [],
  },

  level3: {
    width: 2400,
    height: 600,
    spawn: { cat: { x: 50, y: 450 }, dog: { x: 100, y: 450 } },
    platforms: [
      { x: 0, y: 550, width: 2400, height: 50, type: 'grass', color: '#555' },
      { x: 200, y: 400, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 450, y: 300, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 700, y: 200, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 1000, y: 300, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 1300, y: 400, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 1600, y: 300, width: 150, height: 20, type: 'stone', color: '#777' },
      { x: 1900, y: 200, width: 150, height: 20, type: 'stone', color: '#777' },
    ],
    diamonds: [
      { x: 260, y: 370 }, { x: 510, y: 270 },
      { x: 760, y: 170 }, { x: 1060, y: 270 },
      { x: 1360, y: 370 }, { x: 1660, y: 270 },
      { x: 1960, y: 170 },
    ],
    doors: [
      { x: 2250, y: 500, width: 40, height: 50, isOpen: false },
    ],
    enemies: [
      { x: 800, y: 500, patrolLeft: 700, patrolRight: 1200, speed: 2 },
    ],
  },
};
