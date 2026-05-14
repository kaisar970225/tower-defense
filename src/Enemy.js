export class Enemy {
    constructor(path, cellSize) {
        this.path = path;
        this.cellSize = cellSize;
        this.pathIndex = 0;
        this.speed = 2;
        this.hp = 100;
        this.maxHp = 100;
        this.size = 20;
        this.isDead = false;
        this.reachedEnd = false;

        // стартовая позиция — первая клетка пути
        const [startCol, startRow] = this.path[0];
        this.x = startCol * this.cellSize + this.cellSize / 2;
        this.y = startRow * this.cellSize + this.cellSize / 2;
    }

    update() {
        if (this.pathIndex >= this.path.length - 1) {
            this.reachedEnd = true;
            return;
        }

        // цель — следующая клетка пути
        const [targetCol, targetRow] = this.path[this.pathIndex + 1];
        const targetX = targetCol * this.cellSize + this.cellSize / 2;
        const targetY = targetRow * this.cellSize + this.cellSize / 2;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            this.x = targetX;
            this.y = targetY;
            this.pathIndex++;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    draw(ctx) {
        // тело врага
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // полоска HP
        const barWidth = this.size * 2;
        const barHeight = 5;
        const barX = this.x - this.size;
        const barY = this.y - this.size - 10;

        ctx.fillStyle = "#333";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(barX, barY, barWidth * (this.hp / this.maxHp), barHeight);
    }
}
