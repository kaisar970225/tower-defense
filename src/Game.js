import { Map } from "./Map.js";
import { Enemy } from "./Enemy.js";
import { Tower } from "./Tower.js";

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
        this.towers = [];

        // волны
        this.wave = 1;
        this.enemiesPerWave = 5;
        this.enemiesSpawned = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 90;
        this.waveInProgress = true;
        this.betweenWaveTimer = 0;
        this.betweenWaveDelay = 180;

        // клик для размещения башни
        this.canvas.addEventListener("click", (e) => this.handleClick(e));
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / this.map.cellSize);
        const row = Math.floor(y / this.map.cellSize);

        // нельзя ставить на путь
        const isPath = this.map.path.some(
            ([pc, pr]) => pc === col && pr === row,
        );
        if (isPath) return;

        // нельзя ставить две башни на одно место
        const occupied = this.towers.some(
            (t) => t.col === col && t.row === row,
        );
        if (occupied) return;

        this.towers.push(new Tower(col, row, this.map.cellSize));
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
        if (this.waveInProgress) {
            if (this.enemiesSpawned < this.enemiesPerWave) {
                this.spawnTimer++;
                if (this.spawnTimer >= this.spawnInterval) {
                    this.enemies.push(
                        new Enemy(this.map.path, this.map.cellSize),
                    );
                    this.enemiesSpawned++;
                    this.spawnTimer = 0;
                }
            }

            const allSpawned = this.enemiesSpawned >= this.enemiesPerWave;
            const allGone = this.enemies.length === 0;
            if (allSpawned && allGone) {
                this.waveInProgress = false;
                this.betweenWaveTimer = 0;
            }
        } else {
            this.betweenWaveTimer++;
            if (this.betweenWaveTimer >= this.betweenWaveDelay) {
                this.wave++;
                this.enemiesPerWave += 3;
                this.enemiesSpawned = 0;
                this.waveInProgress = true;
            }
        }

        this.towers.forEach((tower) => tower.update(this.enemies));
        this.enemies.forEach((enemy) => enemy.update());
        this.enemies = this.enemies.filter(
            (enemy) => !enemy.reachedEnd && !enemy.isDead,
        );
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.map.draw();
        this.towers.forEach((tower) => tower.draw(this.ctx));
        this.enemies.forEach((enemy) => enemy.draw(this.ctx));

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Wave: ${this.wave}`, 10, 25);

        if (!this.waveInProgress) {
            this.ctx.fillStyle = "#f1c40f";
            this.ctx.font = "28px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                `Wave ${this.wave + 1} incoming...`,
                this.width / 2,
                this.height / 2,
            );
        }
    }
}
