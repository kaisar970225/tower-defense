export class Map {
    constructor(ctx) {
        this.ctx = ctx;
        this.cellSize = 50;
        this.cols = 16;
        this.rows = 10;
        this.offsetY = 40;

        this.path = [
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [3, 3],
            [3, 4],
            [4, 4],
            [5, 4],
            [5, 3],
            [5, 2],
            [5, 1],
            [6, 1],
            [7, 1],
            [8, 1],
            [8, 2],
            [8, 3],
            [8, 4],
            [9, 4],
            [10, 4],
            [10, 3],
            [10, 2],
            [10, 1],
            [11, 1],
            [12, 1],
            [13, 1],
            [13, 2],
            [13, 3],
            [13, 4],
            [13, 5],
            [13, 6],
            [12, 6],
            [11, 6],
            [10, 6],
            [9, 6],
            [8, 6],
            [8, 7],
            [8, 8],
            [9, 8],
            [10, 8],
            [11, 8],
            [12, 8],
            [13, 8],
            [14, 8],
            [15, 8],
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
                    row * this.cellSize + this.offsetY,
                    this.cellSize,
                    this.cellSize,
                );

                this.ctx.strokeStyle = "#00000033";
                this.ctx.strokeRect(
                    col * this.cellSize,
                    row * this.cellSize + this.offsetY,
                    this.cellSize,
                    this.cellSize,
                );
            }
        }
    }
}
