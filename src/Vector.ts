class Vector {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
    }

    // Static methods
    static add(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static sub(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static mult(v: Vector, n: number): Vector {
        return new Vector(v.x * n, v.y * n);
    }

    static div(v: Vector, n: number): Vector {
        return new Vector(v.x / n, v.y / n);
    }

    static dist(v1: Vector, v2: Vector): number {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(dx * dx + dy * dy);
        // return Math.sqrt(dx^2 + dy^2);
    }

    static dot(v1: Vector, v2: Vector): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static cross(v1: Vector, v2: Vector): number {
        // TODO don't think this is correct
        return v1.x * v2.y - v1.y * v2.x;
    }

    static normalize(v: Vector): Vector {
        const mag = v.mag();
        if (mag > 0) {
            return Vector.div(v, mag);
        }
        return new Vector(0, 0, 0);
    }

    // Instance methods
    add(v: Vector): this {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v: Vector): this {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mult(n: number): this {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n: number): this {
        this.x /= n;
        this.y /= n;
        return this;
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): this {
        const m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }

    limit(max: number): this {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
        return this;
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector): number {
        // TODO probably wrong
        return this.x * v.y - this.y * v.x;
    }

    dist(v: Vector): number {
        return Vector.dist(this, v);
    }

    set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }

    toArray(): number[] {
        return [this.x, this.y];
    }

    toString(): string {
        return `Vector(${this.x}, ${this.y})`;
    }
}


export default Vector;