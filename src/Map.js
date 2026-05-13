export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.cellSize = 50;
        this.cols = 16;
        this.rows = 12;

        // путь врагов - массив координат [col, row]
        this.path = [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
            [3, 2],
            [3, 3],
            [4, 3],
            [5, 3],
            [6, 3],
            [6, 4],
            [6, 5],
            [6, 6],
            [7, 6],
            [8, 6],
            [9, 6],
            [9, 5],
            [9, 4],
            [10, 4],
            [11, 4],
            [12, 4],
            [12, 5],
            [12, 6],
            [12, 7],
            [12, 8],
            [11, 8],
            [10, 8],
            [9, 8],
            [8, 8],
            [8, 9],
            [8, 10],
            [9, 10],
            [10, 10],
            [11, 10],
            [12, 10],
            [13, 10],
            [14, 10],
            [15, 10],
        ];
    }

    draw() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const isPath = this.path.some(
                    ([pc, pr]) => pc === col && pr === row,
                );

                this.ctx.fillStyle = isPath ? "#c8a96e" : "#4a7c59";
                this.ctx.fillRect(
                    col * this.cellSize,
                    row * this.cellSize,
                    this.cellSize,
                    this.cellSize,
                );

                // сетка
                this.ctx.strokeStyle = "#00000033";
                this.ctx.strokeRect(
                    col * this.cellSize,
                    row * this.cellSize,
                    this.cellSize,
                    this.cellSize,
                );
            }
        }
    }
}
