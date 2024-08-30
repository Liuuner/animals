import Vector from "./Vector.ts";
import {easeOutCubic, toReversed} from "./Utils.ts";


class Chain {
    static DEFAULT_CONFIG: Config = {
        speedMultiplierEasing: 10,
        maxSpeedDistance: 200,
        maxSpeedDistancePreviewWidth: Math.PI / 5,
        maxSpeedDistancePreviewEnabled: false,
        jointSize: 8,
        // todo implement logic for this
        turnSpeed: "instant",
        // todo speed = easing(stopDistance + distance)
        stopDistance: 3,
    }

    config: Config;
    private distanceConstraint: number;
    private angleConstraint: number;
    // TODO Temp
    joints: Vector[] = [];
    angles: number[] = [];


    constructor(origin: Vector, jointCount: number, distanceConstraint: number, angleConstraint: number, config: Partial<Config> = {}) {
        if (jointCount < 1) throw new Error("jointCount can't be less than 1")
        if (distanceConstraint <= 0) throw new Error("distanceConstraint can't be negative/zero")

        this.config = {...Chain.DEFAULT_CONFIG, ...config};
        this.distanceConstraint = distanceConstraint;
        this.angleConstraint = angleConstraint;

        this.joints.push(origin.copy());
        this.angles.push(0);

        for (let i = 1; i < jointCount; i++) {
            this.joints.push(Vector.add(this.joints[i - 1], new Vector(0, distanceConstraint)));
            this.angles.push(0);
        }
    }

    update(target: Vector) {
        if (this.joints.length === 2) {
            // TODO implement (hopefully) simple logic
        }

        // Move the head
        const head = this.joints[0]

        const deltaX = target.x - head.x;
        const deltaY = target.y - head.y;
        const targetAngle = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < this.config.stopDistance) return;

        const normalizedDistance = Math.min(1, (distance) / this.config.maxSpeedDistance);
        // Apply easing function ((should be) easeOutCubic in this case 0.33, 1, 0.68, 1)
        // const speed = cubicBezier(normalizedDistance,.12,.58,.33,1) * this.config.speedMultiplierEasing
        const speed = easeOutCubic(normalizedDistance) * this.config.speedMultiplierEasing;


        const speedX = Math.cos(targetAngle) * speed;
        const speedY = Math.sin(targetAngle) * speed;


        const newHeadX = head.x + speedX;
        const newHeadY = head.y + speedY;

        head.x = newHeadX;
        head.y = newHeadY;

        // TODO was also in here, now i know why (because of loop and joints[i-2])
        const p1 = this.joints[1];
        let angle = Math.atan2(p1.y - head.y, p1.x - head.x);

        p1.x = head.x + Math.cos(angle) * this.distanceConstraint;
        p1.y = head.y + Math.sin(angle) * this.distanceConstraint;


        // Move the rest of the chain
        for (let i = 2; i < this.joints.length; i++) {
            const p0 = this.joints[i - 2];
            const p1 = this.joints[i - 1];
            const p2 = this.joints[i];

            const angle1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            const angle2 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            let diffAngle = angle2 - angle1;
            if (diffAngle > Math.PI) diffAngle -= 2 * Math.PI;
            else if (diffAngle < -Math.PI) diffAngle += 2 * Math.PI;

            if (Math.abs(diffAngle) > this.angleConstraint) {
                const newAngle = angle1 + Math.sign(diffAngle) * this.angleConstraint;
                p2.x = p1.x + Math.cos(newAngle) * this.distanceConstraint;
                p2.y = p1.y + Math.sin(newAngle) * this.distanceConstraint;
            } else {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance !== this.distanceConstraint) {
                    const angle = Math.atan2(dy, dx);
                    p2.x = p1.x - Math.cos(angle) * this.distanceConstraint;
                    p2.y = p1.y - Math.sin(angle) * this.distanceConstraint;
                }
            }
        }
    }


    draw(ctx: CanvasRenderingContext2D | null, target: Vector) {
        if (!ctx) return;

        // Connections
        for (let i = 1; i < this.joints.length; i++) {
            const p1 = this.joints[i - 1]
            const p2 = this.joints[i]

            ctx.strokeStyle = '#708ab9'
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        // Joints
        toReversed(this.joints).map(j => {
            ctx.fillStyle = '#2a3340';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(j.x, j.y, this.config.jointSize, 0, Math.PI * 2);
            ctx.fill()
            ctx.stroke();
        });

        if (!this.config.maxSpeedDistancePreviewEnabled) return;
        const head = this.joints[0]

        const deltaX = target.x - head.x;
        const deltaY = target.y - head.y;
        const targetAngle = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        const normalizedDistance = Math.min(1, (distance) / this.config.maxSpeedDistance);
        const speed = Math.max(easeOutCubic(normalizedDistance - 0.4), 0);

        const alphaValue = Math.floor(speed * 255);
        const alphaChannel = alphaValue.toString(16).padStart(2, '0');

        ctx.strokeStyle = '#617590' + alphaChannel;

        ctx.beginPath();
        ctx.arc(head.x, head.y, this.config.maxSpeedDistance, targetAngle - this.config.maxSpeedDistancePreviewWidth /2, targetAngle + this.config.maxSpeedDistancePreviewWidth / 2);
        ctx.stroke();
    }


/*    getPosX(i: number, angleOffset: number, lengthOffset: number) {
    return this.joints[i].x + Math.cos(this.angles[i] + angleOffset) * (bodyWidth(i) + lengthOffset);
}

float getPosY(int i, float angleOffset, float lengthOffset) {
    return this.joints[i].y + Math.sin(this.angles[i] + angleOffset) * (bodyWidth[i] + lengthOffset);
}*/
}

type Config = {
    speedMultiplierEasing: number;
    maxSpeedDistance: number;
    maxSpeedDistancePreviewEnabled: boolean;
    /**
     * Radian
     **/
    maxSpeedDistancePreviewWidth: number;
    jointSize: number;
    stopDistance: number;
    /**
     * Radian
     **/
    turnSpeed: number | "instant"
};

export default Chain;
