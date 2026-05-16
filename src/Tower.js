import { Bullet } from "./Bullet.js";

export class Tower {
    constructor(col, row, cellSize) {
        this.col = col;
        this.row = row;
        this.cellSize = cellSize;
        this.offsetY = 40;
        this.x = col * cellSize + cellSize / 2;
        this.y = row * cellSize + cellSize / 2 + this.offsetY;
        this.range = 100;
        this.damage = 20;
        this.fireRate = 60;
        this.fireTimer = 0;
        this.target = null;
        this.bullets = [];
    }

    update(enemies) {
        this.target = null;
        let minDist = this.range;

        enemies.forEach((enemy) => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                this.target = enemy;
            }
        });

        if (this.target) {
            this.fireTimer++;
            if (this.fireTimer >= this.fireRate) {
                this.bullets.push(
                    new Bullet(this.x, this.y, this.target, this.damage),
                );
                this.fireTimer = 0;
            }
        }

        this.bullets.forEach((bullet) => bullet.update());
        this.bullets = this.bullets.filter((bullet) => !bullet.isDone);
    }

    draw(ctx) {
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(
            this.col * this.cellSize + 8,
            this.row * this.cellSize + 8 + this.offsetY,
            this.cellSize - 16,
            this.cellSize - 16,
        );

        ctx.fillStyle = "#7f8c8d";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ffffff33";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();

        this.bullets.forEach((bullet) => bullet.draw(ctx));
    }
}
