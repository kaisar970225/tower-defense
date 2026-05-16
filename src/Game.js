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

        // UI
        this.lives = 20;
        this.money = 100;
        this.score = 0;

        // выбранный тип башни
        this.selectedTower = "basic";
        this.towerCosts = {
            basic: 25,
            sniper: 50,
            rapid: 35,
        };

        // волны
        this.wave = 1;
        this.enemiesPerWave = 5;
        this.enemiesSpawned = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 90;
        this.waveInProgress = true;
        this.betweenWaveTimer = 0;
        this.betweenWaveDelay = 180;

        this.canvas.addEventListener("click", (e) => this.handleClick(e));
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // рестарт если Game Over
        if (this.lives <= 0) {
            this.restart();
            return;
        }

        // кнопки выбора башни (внизу экрана)
        if (y > this.height - 50) {
            if (x < 150) this.selectedTower = "basic";
            else if (x < 300) this.selectedTower = "sniper";
            else if (x < 450) this.selectedTower = "rapid";
            return;
        }

        const col = Math.floor(x / this.map.cellSize);
        const row = Math.floor((y - this.map.offsetY) / this.map.cellSize);

        const isPath = this.map.path.some(
            ([pc, pr]) => pc === col && pr === row,
        );
        if (isPath) return;

        const occupied = this.towers.some(
            (t) => t.col === col && t.row === row,
        );
        if (occupied) return;

        const cost = this.towerCosts[this.selectedTower];
        if (this.money < cost) return;

        this.money -= cost;
        this.towers.push(
            new Tower(col, row, this.map.cellSize, this.selectedTower),
        );
    }

    restart() {
        this.enemies = [];
        this.towers = [];
        this.lives = 20;
        this.money = 100;
        this.score = 0;
        this.selectedTower = "basic";
        this.wave = 1;
        this.enemiesPerWave = 5;
        this.enemiesSpawned = 0;
        this.spawnTimer = 0;
        this.waveInProgress = true;
        this.betweenWaveTimer = 0;
        this.isRunning = true;
        this.loop();
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
        if (this.lives <= 0) {
            this.isRunning = false;
            return;
        }

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

        this.enemies.forEach((enemy) => {
            if (enemy.isDead) {
                this.money += enemy.reward;
                this.score += 10;
            }
            if (enemy.reachedEnd) {
                this.lives--;
            }
        });

        this.enemies = this.enemies.filter((e) => !e.isDead && !e.reachedEnd);
    }

    drawUI() {
        // верхняя панель
        this.ctx.fillStyle = "#16213e";
        this.ctx.fillRect(0, 0, this.width, 40);

        this.ctx.font = "18px Arial";
        this.ctx.textAlign = "left";

        this.ctx.fillStyle = "#e74c3c";
        this.ctx.fillText(`❤️ ${this.lives}`, 10, 27);

        this.ctx.fillStyle = "#f1c40f";
        this.ctx.fillText(`💰 ${this.money}`, 100, 27);

        this.ctx.fillStyle = "#2ecc71";
        this.ctx.fillText(`⭐ ${this.score}`, 210, 27);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillText(`🌊 Wave: ${this.wave}`, 320, 27);

        // нижняя панель — выбор башни
        this.ctx.fillStyle = "#16213e";
        this.ctx.fillRect(0, this.height - 50, this.width, 50);

        const towers = [
            { type: "basic", label: "🟢 Basic 25💰", x: 0 },
            { type: "sniper", label: "🔵 Sniper 50💰", x: 150 },
            { type: "rapid", label: "🔴 Rapid 35💰", x: 300 },
        ];

        towers.forEach(({ type, label, x }) => {
            // подсветка выбранной башни
            if (this.selectedTower === type) {
                this.ctx.fillStyle = "#ffffff22";
                this.ctx.fillRect(x, this.height - 50, 150, 50);
            }

            this.ctx.fillStyle =
                this.money >= this.towerCosts[type] ? "#ffffff" : "#e74c3c";
            this.ctx.font = "14px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(label, x + 75, this.height - 20);
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.map.draw();
        this.towers.forEach((tower) => tower.draw(this.ctx));
        this.enemies.forEach((enemy) => enemy.draw(this.ctx));

        this.drawUI();

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

        if (this.lives <= 0) {
            this.ctx.fillStyle = "#00000099";
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.fillStyle = "#e74c3c";
            this.ctx.font = "48px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                "GAME OVER",
                this.width / 2,
                this.height / 2 - 40,
            );

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "24px Arial";
            this.ctx.fillText(
                `Score: ${this.score}`,
                this.width / 2,
                this.height / 2 + 10,
            );

            // кнопка рестарта
            this.ctx.fillStyle = "#27ae60";
            this.ctx.beginPath();
            this.ctx.roundRect(
                this.width / 2 - 80,
                this.height / 2 + 40,
                160,
                45,
                8,
            );
            this.ctx.fill();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(
                "🔄 Play Again",
                this.width / 2,
                this.height / 2 + 68,
            );
        }
    }
}
