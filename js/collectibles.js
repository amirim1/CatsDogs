class Diamond {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 24;
    this.collected = false;
    this.baseY = y;
    this.time = Math.random() * 100;
  }

  draw(ctx) {
    if (this.collected) return;
    this.time += 0.055;
    const floatY = this.baseY + Math.sin(this.time) * 5;
    const pulse = 1 + Math.sin(this.time * 2) * 0.08;

    ctx.save();
    ctx.translate(this.x + this.width / 2, floatY + this.height / 2);
    ctx.rotate(Math.sin(this.time) * 0.12);
    ctx.scale(pulse, pulse);

    const img = App.assets.gem;
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2);
      ctx.lineTo(this.width / 2, 0);
      ctx.lineTo(0, this.height / 2);
      ctx.lineTo(-this.width / 2, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    this.y = floatY;
  }
}

class Key {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.collected = false;
    this.baseY = y;
    this.time = Math.random() * 100;
  }

  draw(ctx) {
    if (this.collected) return;
    this.time += 0.04;
    const floatY = this.baseY + Math.sin(this.time) * 6;

    ctx.save();
    ctx.translate(this.x + this.width / 2, floatY + this.height / 2);
    ctx.rotate(Math.sin(this.time) * 0.1);

    const img = App.assets.key_yellow;
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
    } else {
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.arc(-6, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(0, -3, 17, 6);
      ctx.fillRect(12, 3, 4, 7);
      ctx.fillStyle = '#1a1a2e';
      ctx.beginPath();
      ctx.arc(-6, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    this.y = floatY;
  }
}
