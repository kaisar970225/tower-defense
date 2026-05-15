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

        // волны
        this.wave = 1;
        this.enemiesPerWave = 5;
        this.enemiesSpawned = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 90;
        this.waveInProgress = true;
        this.betweenWaveTimer = 0;
        this.betweenWaveDelay = 180; // пауза между волнами (3 сек)
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
            // спавним врагов волны
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

            // волна закончилась когда все заспавнены и все дошли до конца
            const allSpawned = this.enemiesSpawned >= this.enemiesPerWave;
            const allGone = this.enemies.length === 0;
            if (allSpawned && allGone) {
                this.waveInProgress = false;
                this.betweenWaveTimer = 0;
            }
        } else {
            // пауза между волнами
            this.betweenWaveTimer++;
            if (this.betweenWaveTimer >= this.betweenWaveDelay) {
                this.wave++;
                this.enemiesPerWave += 3; // каждая волна сложнее
                this.enemiesSpawned = 0;
                this.waveInProgress = true;
            }
        }

        // обновляем врагов
        this.enemies.forEach((enemy) => enemy.update());
        this.enemies = this.enemies.filter((enemy) => !enemy.reachedEnd);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.map.draw();
        this.enemies.forEach((enemy) => enemy.draw(this.ctx));

        // надпись волны
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Wave: ${this.wave}`, 10, 25);

        // надпись между волнами
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
