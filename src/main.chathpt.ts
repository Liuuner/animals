class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}


class Snake {
    spine: Point[];
    angles: number[];

    constructor(origin: Point, numPoints: number, segmentLength: number, initialAngle: number) {
        this.spine = [];
        this.angles = [];

        // Initialize spine points and angles
        for (let i = 0; i < numPoints; i++) {
            const x = origin.x + i * segmentLength * Math.cos(initialAngle);
            const y = origin.y + i * segmentLength * Math.sin(initialAngle);
            this.spine.push(new Point(x, y));
            this.angles.push(initialAngle);
        }
    }

    bodyWidth(i: number): number {
        switch (i) {
            case 0:
                return 76;
            case 1:
                return 80;
            default:
                return Math.max(64 - i, 1); // Ensure positive width
        }
    }

    getPosX(i: number, angleOffset: number, lengthOffset: number): number {
        const angle = this.angles[i] + angleOffset;
        return this.spine[i].x + Math.cos(angle) * (this.bodyWidth(i) + lengthOffset);
    }

    getPosY(i: number, angleOffset: number, lengthOffset: number): number {
        const angle = this.angles[i] + angleOffset;
        return this.spine[i].y + Math.sin(angle) * (this.bodyWidth(i) + lengthOffset);
    }

    display(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.fillStyle = 'rgb(172, 57, 49)';

        ctx.beginPath();

        // Right half of the snake
        for (let i = 0; i < this.spine.length; i++) {
            ctx.lineTo(this.getPosX(i, Math.PI / 2, 0), this.getPosY(i, Math.PI / 2, 0));
        }

        ctx.lineTo(this.getPosX(this.spine.length - 1, Math.PI, 0), this.getPosY(this.spine.length - 1, Math.PI, 0));

        // Left half of the snake
        for (let i = this.spine.length - 1; i >= 0; i--) {
            ctx.lineTo(this.getPosX(i, -Math.PI / 2, 0), this.getPosY(i, -Math.PI / 2, 0));
        }

        // Top of the head (completes the loop)
        ctx.lineTo(this.getPosX(0, -Math.PI / 6, 0), this.getPosY(0, -Math.PI / 6, 0));
        ctx.lineTo(this.getPosX(0, 0, 0), this.getPosY(0, 0, 0));
        ctx.lineTo(this.getPosX(0, Math.PI / 6, 0), this.getPosY(0, Math.PI / 6, 0));

        // Extra vertices for curve completion
        ctx.lineTo(this.getPosX(0, Math.PI / 2, 0), this.getPosY(0, Math.PI / 2, 0));
        ctx.lineTo(this.getPosX(1, Math.PI / 2, 0), this.getPosY(1, Math.PI / 2, 0));
        ctx.lineTo(this.getPosX(2, Math.PI / 2, 0), this.getPosY(2, Math.PI / 2, 0));

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    debugDisplay(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let i = 0; i < this.spine.length; i++) {
            ctx.lineTo(this.spine[i].x, this.spine[i].y);
        }
        ctx.stroke();
    }
}



const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx) {
    const origin = new Point(100, 100);
    const snake = new Snake(origin, 48, 10, Math.PI / 8);

    // Draw the snake
    snake.display(ctx);

    // Optionally, debug display the spine
    // snake.debugDisplay(ctx);
}
