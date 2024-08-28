import "./style.css"
import Chain from "./Chain.ts";
import {getFromLsOrElse} from "./Utils.ts";
import Vector from "./Vector.ts";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// TODO not nice
canvas.width = getFromLsOrElse<number>("WIDTH", document.body.clientWidth * 0.9);
canvas.height = getFromLsOrElse<number>("HEIGHT", document.body.clientHeight * 0.9);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const MAX_SPEED_DISTANCE = getFromLsOrElse<number>("MAX_SPEED_DISTANCE", 200);
const MAX_SPEED_DISTANCE_VISIBLE = getFromLsOrElse<boolean>("MAX_SPEED_DISTANCE_VISIBLE", true);

const origin = new Vector(WIDTH / 2, HEIGHT / 2);
const chain = new Chain(origin, 23, 33, Math.PI/3, 10)

let target = origin.copy();

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    target = new Vector(e.clientX - rect.left, e.clientY - rect.top)
})

const drawTarget = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;

    ctx.fillStyle = '#435164';
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
    ctx.fill();

    if (!MAX_SPEED_DISTANCE_VISIBLE) return;
    ctx.strokeStyle = '#617590';
    ctx.beginPath();
    ctx.arc(target.x, target.y, MAX_SPEED_DISTANCE, 0, Math.PI * 2);
    ctx.stroke()
}

function loop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawTarget(ctx);
    chain.update(target);
    chain.draw(ctx);
    requestAnimationFrame(loop);
}

if (ctx) {
    loop();
}