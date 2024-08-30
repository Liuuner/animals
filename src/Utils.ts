function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 2);
}

const getFromLsOrElse = <T>(key: string, defaultValue: T): T => {
    const item = localStorage.getItem(key);
    if (!item) {
        localStorage.setItem(key, "null");
    }
    if (item === "null") {
        return defaultValue;
    }
    return item ? (JSON.parse(item) as T) : defaultValue;
}

const toReversed = (a: any[]) => {
    return [...a].reverse()
}

function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    return mt3 * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t3 * p3;
}

export {
    easeOutCubic,
    getFromLsOrElse,
    toReversed,
    cubicBezier
};
