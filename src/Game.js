export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.isRunning = false;
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
        // сюда добавим логику позже
    }

    draw() {
        // очищаем экран
        this.ctx.fillStyle = "#0f3460";
        this.ctx.fillRect(0, 0, this.width, this.height);

        // временный текст чтобы убедиться что всё работает
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "32px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Tower Defense", this.width / 2, this.height / 2);
    }
}
