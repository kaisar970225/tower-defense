import { Bullet } from "./Bullet.js";

export class Tower {
    constructor(col, row, cellSize, type = "basic") {
        this.col = col;
        this.row = row;
        this.cellSize = cellSize;
        this.offsetY = 40;
        this.x = col * cellSize + cellSize / 2;
        this.y = row * cellSize + cellSize / 2 + this.offsetY;
        this.type = type;
        this.bullets = [];
        this.fireTimer = 0;
        this.target = null;

        // характеристики в зависимости от типа
        if (type === "basic") {
            this.range = 100;
            this.damage = 20;
            this.fireRate = 60;
            this.color = "#27ae60";
        } else if (type === "sniper") {
            this.range = 200;
            this.damage = 60;
            this.fireRate = 120;
            this.color = "#2980b9";
        } else if (type === "rapid") {
            this.range = 80;
            this.damage = 10;
            this.fireRate = 20;
            this.color = "#c0392b";
        }
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
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.col * this.cellSize + 8,
            this.row * this.cellSize + 8 + this.offsetY,
            this.cellSize - 16,
            this.cellSize - 16,
        );

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `${this.color}88`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();

        this.bullets.forEach((bullet) => bullet.draw(ctx));
    }
}
