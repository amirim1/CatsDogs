class Diamond {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.collected = false;
    this.baseY = y;
    this.time = 0;
  }

  draw(ctx) {
    if (this.collected) return;
    this.time += 0.05;
    this.y = this.baseY + Math.sin(this.time) * 3;

    const img = App.assets['gem'];
    if (img && img.complete && img.naturalWidth > 0) {
      const s = Math.min(this.width / img.width, this.height / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      const dx = this.x + (this.width - dw) / 2;
      const dy = this.y + (this.height - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height / 2);
      ctx.lineTo(this.x + this.width / 2, this.y + this.height);
      ctx.lineTo(this.x, this.y + this.height / 2);
      ctx.closePath();
      ctx.fill();
    }
  }
}
