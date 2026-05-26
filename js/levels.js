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
    width: 2000,
    height: 700,
    spawn: { cat: { x: 80, y: 550 }, dog: { x: 180, y: 550 } },
    platforms: [
      { x: 0, y: 650, width: 2000, height: 50, style: 'floor' },
      { x: 350, y: 480, width: 200, height: 18, style: 'burger' },
      { x: 650, y: 380, width: 200, height: 18, style: 'sausage' },
      { x: 1000, y: 480, width: 200, height: 18, style: 'burger' },
      { x: 1350, y: 380, width: 200, height: 18, style: 'sausage' },
    ],
    diamonds: [
      { x: 420, y: 440 }, { x: 720, y: 340 },
      { x: 1070, y: 440 }, { x: 1420, y: 340 },
    ],
    doors: [
      { x: 1750, y: 554, width: 48, height: 96, isOpen: false, owner: 'cat' },
      { x: 1850, y: 554, width: 48, height: 96, isOpen: false, owner: 'dog' },
    ],
    enemies: [],
    key: { x: 900, y: 620 },
  },

  level2: {
    width: 2500,
    height: 700,
    spawn: { cat: { x: 80, y: 550 }, dog: { x: 180, y: 550 } },
    platforms: [
      { x: 0, y: 650, width: 2500, height: 50, style: 'floor' },
      { x: 300, y: 480, width: 180, height: 18, style: 'burger' },
      { x: 580, y: 380, width: 180, height: 18, style: 'sausage' },
      { x: 860, y: 280, width: 180, height: 18, style: 'burger' },
      { x: 1140, y: 380, width: 180, height: 18, style: 'sausage' },
      { x: 1420, y: 480, width: 180, height: 18, style: 'burger' },
      { x: 1700, y: 380, width: 180, height: 18, style: 'sausage' },
    ],
    diamonds: [
      { x: 370, y: 440 }, { x: 650, y: 340 },
      { x: 930, y: 240 }, { x: 1210, y: 340 },
      { x: 1490, y: 440 }, { x: 1770, y: 340 },
    ],
    doors: [
      { x: 2200, y: 554, width: 48, height: 96, isOpen: false, owner: 'cat' },
      { x: 2320, y: 554, width: 48, height: 96, isOpen: false, owner: 'dog' },
    ],
    enemies: [],
    key: { x: 1050, y: 620 },
  },

  level3: {
    width: 3000,
    height: 700,
    spawn: { cat: { x: 80, y: 550 }, dog: { x: 180, y: 550 } },
    platforms: [
      { x: 0, y: 650, width: 3000, height: 50, style: 'floor' },
      { x: 250, y: 480, width: 180, height: 18, style: 'burger' },
      { x: 520, y: 380, width: 180, height: 18, style: 'sausage' },
      { x: 790, y: 280, width: 180, height: 18, style: 'burger' },
      { x: 1060, y: 380, width: 180, height: 18, style: 'sausage' },
      { x: 1330, y: 480, width: 180, height: 18, style: 'burger' },
      { x: 1600, y: 380, width: 180, height: 18, style: 'sausage' },
      { x: 1900, y: 280, width: 180, height: 18, style: 'burger' },
      { x: 2200, y: 380, width: 180, height: 18, style: 'sausage' },
    ],
    diamonds: [
      { x: 320, y: 440 }, { x: 590, y: 340 },
      { x: 860, y: 240 }, { x: 1130, y: 340 },
      { x: 1400, y: 440 }, { x: 1670, y: 340 },
      { x: 1970, y: 240 }, { x: 2270, y: 340 },
    ],
    doors: [
      { x: 2700, y: 554, width: 48, height: 96, isOpen: false, owner: 'cat' },
      { x: 2840, y: 554, width: 48, height: 96, isOpen: false, owner: 'dog' },
    ],
    enemies: [
      { x: 900, y: 600, patrolLeft: 700, patrolRight: 1500, speed: 2 },
    ],
    key: { x: 1300, y: 620 },
  },
};
