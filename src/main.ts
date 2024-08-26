import './style.css'

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const PI = Math.PI;
canvas.width = document.body.clientWidth * 0.9;
canvas.height = document.body.clientHeight * 0.9;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const DESIRED_DISTANCE = 30;
const MAX_ANGLE = Math.PI / 3;

const MAX_SPEED = 5;
const SPEED_MULTIPLIER = 0.03;
// For Easing Method
const MAX_SPEED_DISTANCE = 200;
const MAX_SPEED_DISTANCE_VISIBLE = false;
const SPEED_MULTIPLIER_EASING = 6;

class Target {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw() {
        if (!ctx) return;

        ctx.fillStyle = '#435164';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();

        if (!MAX_SPEED_DISTANCE_VISIBLE) return;
        ctx.strokeStyle = '#617590';
        ctx.beginPath();
        ctx.arc(this.x, this.y, MAX_SPEED_DISTANCE, 0, Math.PI * 2);
        ctx.stroke()
    }
}

// const sizes = [52, 58, 40, 60, 68, 71, 65, 50, 28, 15, 11, 9, 7, 7, 10, 10, 10, 10, 10, 10];
const sizes = 13;
let target = new Target(0, 0);

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    target = new Target(e.clientX - rect.left, e.clientY - rect.top)
})

class Point {
    x: number;
    y: number;
    private size: number;
    xSpeed: number;
    ySpeed: number;

    constructor(x: number, y: number, size = 8, xSpeed = 0, ySpeed = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    draw() {
        if (!ctx) return;

        ctx.fillStyle = '#272d35';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill()
        ctx.stroke();
    }

    drawWorm(color = "#ffbbc6") {

    }
}

class Line {
    private p1: Point;
    private p2: Point;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw() {
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}

const points: Point[] = [];
points.push(new Point(WIDTH / 2, HEIGHT / 2, 8, 3, 3));
for (let i = 1; i < sizes; i++) {
    points.push(new Point(WIDTH / 2, HEIGHT / 2));
}

const lines: Line[] = [];
for (let i = 0; i < points.length - 1; i++) {
    lines.push(new Line(points[i], points[i + 1]));
}

function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    target.draw()
    // Drawing in reverse so that front is on top ↑
    lines.toReversed().forEach(l => l.draw());
    points.toReversed().forEach(p => p.draw());
}


function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}


function update() {
    if (points.length > 1) {
        const p0 = points[0];
        const p1 = points[1];
        let newX = p0.x + p0.xSpeed;
        let newY = p0.y + p0.ySpeed;
        let angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

        p1.x = p0.x + Math.cos(angle) * DESIRED_DISTANCE;
        p1.y = p0.y + Math.sin(angle) * DESIRED_DISTANCE;

        // For geradeaus
        // let movementAngle = Math.atan2(p0.ySpeed, p0.xSpeed);

        // here starts my shit

        // Turning in circle
        /*let angleAdjustment = Math.PI / 180;
        movementAngle += angleAdjustment;*/

        // Target
        const deltaX = target.x - p0.x;
        const deltaY = target.y - p0.y;
        const targetAngle = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // does not need to compute if it's not moving
        if (distance < 10) return

        const movementAngle = targetAngle

        // console.log(movementAngle)

        // const speed = Math.sqrt(p0.xSpeed * p0.xSpeed + p0.ySpeed * p0.ySpeed);
        // p0.xSpeed = Math.cos(movementAngle) * speed;
        // p0.ySpeed = Math.sin(movementAngle) * speed;

        let speed = 0;
        if (distance > 10) {
            // custom logic
            // speed = Math.min((distance - 10) * SPEED_MULTIPLIER, MAX_SPEED); // Max Speed is 4 // Adjust the multiplier as needed

            // try with easing
            const normalizedDistance = Math.min(1, (distance - 10) / MAX_SPEED_DISTANCE); // 100 is an arbitrary max distance, adjust as needed
            // Apply easing function
            speed = easeOutCubic(normalizedDistance) * SPEED_MULTIPLIER_EASING; // Adjust the multiplier as needed
        }

        p0.xSpeed = Math.cos(movementAngle) * speed;
        p0.ySpeed = Math.sin(movementAngle) * speed;

        // Logic for boouncing off the walls
        /*if (newX - DESIRED_DISTANCE <= 0 || newX + DESIRED_DISTANCE >= WIDTH || newY - DESIRED_DISTANCE <= 0 || newY + DESIRED_DISTANCE >= HEIGHT) {
            let angleAdjustment = Math.PI / 180;
            if (newX - DESIRED_DISTANCE <= 0 || newX + DESIRED_DISTANCE >= WIDTH) {
                movementAngle = Math.PI - movementAngle;
            }
            if (newY - DESIRED_DISTANCE <= 0 || newY + DESIRED_DISTANCE >= HEIGHT) {
                movementAngle = -movementAngle;
            }
            movementAngle += angleAdjustment;

            const speed = Math.sqrt(p0.xSpeed * p0.xSpeed + p0.ySpeed * p0.ySpeed);
            p0.xSpeed = Math.cos(movementAngle) * speed;
            p0.ySpeed = Math.sin(movementAngle) * speed;
        } else {*/
            p0.x = newX;
            p0.y = newY;
        // }
    }

    // Move the rest of the chain
    for (let i = 2; i < points.length; i++) {
        const p0 = points[i - 2];
        const p1 = points[i - 1];
        const p2 = points[i];

        const angle1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const angle2 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        let diffAngle = angle2 - angle1;
        if (diffAngle > PI) diffAngle -= 2 * PI;
        else if (diffAngle < -PI) diffAngle += 2 * PI;

        if (Math.abs(diffAngle) > MAX_ANGLE) {
            const newAngle = angle1 + Math.sign(diffAngle) * MAX_ANGLE;
            p2.x = p1.x + Math.cos(newAngle) * DESIRED_DISTANCE;
            p2.y = p1.y + Math.sin(newAngle) * DESIRED_DISTANCE;
        } else {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance !== DESIRED_DISTANCE) {
                const angle = Math.atan2(dy, dx);
                p2.x = p1.x - Math.cos(angle) * DESIRED_DISTANCE;
                p2.y = p1.y - Math.sin(angle) * DESIRED_DISTANCE;
            }
        }
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

if (ctx) {
    loop();
}
