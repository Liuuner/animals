import "./style.css"
import Chain, {type Config} from "./Chain.ts";
import {getFromLsOrElse} from "./Utils.ts";
import Vector from "./Vector.ts";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// TODO not nice
canvas.width = getFromLsOrElse<number>("WIDTH", document.body.clientWidth * 0.9);
canvas.height = getFromLsOrElse<number>("HEIGHT", document.body.clientHeight * 0.9);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const SPEED_MULTIPLIER_EASING = getFromLsOrElse<number>("SPEED_MULTIPLIER_EASING", Chain.DEFAULT_CONFIG.speedMultiplierEasing);
const MAX_SPEED_DISTANCE = getFromLsOrElse<number>("MAX_SPEED_DISTANCE", Chain.DEFAULT_CONFIG.maxSpeedDistance);
const MAX_SPEED_DISTANCE_PREVIEW_ENABLED = getFromLsOrElse<boolean>("MAX_SPEED_DISTANCE_PREVIEW_ENABLED", Chain.DEFAULT_CONFIG.maxSpeedDistancePreviewEnabled);
const MAX_SPEED_DISTANCE_PREVIEW_WIDTH = getFromLsOrElse<number>("MAX_SPEED_DISTANCE_PREVIEW_WIDTH", Chain.DEFAULT_CONFIG.maxSpeedDistancePreviewWidth);
const JOINT_SIZE = getFromLsOrElse<number>("JOINT_SIZE", Chain.DEFAULT_CONFIG.jointSize);
const TURN_SPEED = getFromLsOrElse<number | "instant">("TURN_SPEED", Chain.DEFAULT_CONFIG.turnSpeed);
const STOP_DISTANCE = getFromLsOrElse<number>("STOP_DISTANCE", Chain.DEFAULT_CONFIG.stopDistance);

const JOINT_COUNT = getFromLsOrElse<number>("JOINT_COUNT", 23);
const DISTANCE_CONSTRAINT = getFromLsOrElse<number>("DISTANCE_CONSTRAINT", 33);
const ANGLE_CONSTRAINT = getFromLsOrElse<number>("ANGLE_CONSTRAINT", Math.PI/3);

const config: Config = {
    speedMultiplierEasing: SPEED_MULTIPLIER_EASING,
    maxSpeedDistance: MAX_SPEED_DISTANCE,
    maxSpeedDistancePreviewWidth: MAX_SPEED_DISTANCE_PREVIEW_WIDTH,
    maxSpeedDistancePreviewEnabled: MAX_SPEED_DISTANCE_PREVIEW_ENABLED,
    jointSize: JOINT_SIZE,
    turnSpeed: TURN_SPEED,
    stopDistance: STOP_DISTANCE
}

const origin = new Vector(WIDTH / 2, HEIGHT / 2);
const chain = new Chain(origin, JOINT_COUNT, DISTANCE_CONSTRAINT, ANGLE_CONSTRAINT, config)
let target = origin.copy();

window.addEventListener("mousemove", (e) => {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    target = new Vector(e.clientX - rect.left, e.clientY - rect.top)
})

window.addEventListener("touchmove", (e) => {
    e.preventDefault();

    const touch = e.touches[0];

    const rect = canvas.getBoundingClientRect();
    target = new Vector(touch.clientX - rect.left, touch.clientY - rect.top)
})

const drawTarget = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;

    ctx.fillStyle = '#435164';
    ctx.beginPath();
    ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
    ctx.fill();

    /*if (!MAX_SPEED_DISTANCE_ENABLED) return;
    ctx.strokeStyle = '#617590';
    ctx.beginPath();
    ctx.arc(target.x, target.y, MAX_SPEED_DISTANCE, 0, Math.PI * 2);
    ctx.stroke()*/
}

function loop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawTarget(ctx);
    chain.update(target);
    chain.draw(ctx, target);
    requestAnimationFrame(loop);
}

if (ctx) {
    loop();
}