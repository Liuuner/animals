class Angle {
    private _radians;

    constructor(value: number, unit: "rad" | "deg" = 'rad') {
        if (unit === 'deg') {
            this._radians = this._degToRad(value);
        } else if (unit === 'rad') {
            this._radians = value;
        } else {
            throw new Error("Invalid unit, use 'rad' or 'deg'");
        }
        this._normalize();
    }

    // Convert degrees to radians
    _degToRad(deg: number) {
        return (deg * Math.PI) / 180;
    }

    // Convert radians to degrees
    _radToDeg(rad: number) {
        return (rad * 180) / Math.PI;
    }

    // Ensure the angle is positive and normalized within 0 to 2π
    _normalize() {
        this._radians = this._radians % (2 * Math.PI);
        if (this._radians < 0) {
            this._radians += 2 * Math.PI;
        }
    }

    // Add an angle in either radians or degrees
    add(value: number, unit = 'rad') {
        if (unit === 'deg') {
            this._radians += this._degToRad(value);
        } else if (unit === 'rad') {
            this._radians += value;
        } else {
            throw new Error("Invalid unit, use 'rad' or 'deg'");
        }
        this._normalize();
        return this;
    }

    // Subtract an angle in either radians or degrees
    subtract(value: number, unit: "rad" | "deg" = 'rad') {
        if (unit === 'deg') {
            this._radians -= this._degToRad(value);
        } else if (unit === 'rad') {
            this._radians -= value;
        } else {
            throw new Error("Invalid unit, use 'rad' or 'deg'");
        }
        this._normalize();
        return this;
    }

    shortestAngleTo(targetAngle: Angle) {
        let difference = targetAngle.radians - this.radians;
        difference = ((difference + Math.PI) % (2 * Math.PI)) - Math.PI;
        return difference;
    }

    // Update the angle by moving towards the target angle
    turnTowards(targetAngle: Angle, turnSpeed: number | "instant") {
        if (turnSpeed === "instant") {
            this._radians = targetAngle._radians
            return;
        }

        let angleDifference = this.shortestAngleTo(targetAngle);

        if (Math.abs(angleDifference) <= turnSpeed) {
            // If the difference is smaller than turnSpeed, snap to the target angle
            this.radians = targetAngle.radians;
        } else if (angleDifference > 0) {
            // Turn clockwise
            this.add(turnSpeed);
        } else if (angleDifference < 0){
            // Turn counterclockwise
            this.subtract(turnSpeed);
        }
    }

    // Get the angle in radians
    get radians() {
        return this._radians;
    }

    // Get the angle in degrees
    get degrees() {
        return this._radToDeg(this._radians);
    }

    // Set the angle using radians
    set radians(value) {
        this._radians = value;
        this._normalize();
    }

    // Set the angle using degrees
    set degrees(value) {
        this._radians = this._degToRad(value);
        this._normalize();
    }
}

export default Angle;