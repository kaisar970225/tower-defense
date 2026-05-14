import { Map } from "./Map.js";
import { Enemy } from "./Enemy.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.isRunning = false;
        this.map = new Map(this.ctx);
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 120; // каждые 120 кадров новый враг
    }

    start() {
        this.isRunning = true;
        this.loop();
    }

    loop() {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        // спавним врагов
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.enemies.push(new Enemy(this.map.path, this.map.cellSize));
            this.spawnTimer = 0;
        }

        // обновляем врагов
        this.enemies.forEach((enemy) => enemy.update());

        // удаляем тех кто дошёл до конца
        this.enemies = this.enemies.filter((enemy) => !enemy.reachedEnd);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.map.draw();
        this.enemies.forEach((enemy) => enemy.draw(this.ctx));
    }
}
