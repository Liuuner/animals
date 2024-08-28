function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
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

export {
    easeOutCubic,
    getFromLsOrElse,
    toReversed
};