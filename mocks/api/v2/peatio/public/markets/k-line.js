const queryIndex = request.url.indexOf('?')
let k = [];

const parseQuery = (url) => {
    let vars = {};
    url.substring(queryIndex + 1).split("&").forEach((chunk) => {
        const arr = chunk.split("=");
        vars[arr[0]] = arr[1];
    });
    return vars;
}

// Those functions are the same used in k-line mocked ranger event
const minDay = 6;
const maxDay = 10;
const fakePeriod = 86400;

const timeToPrice = (time) => {
    return minDay + (maxDay - minDay) / 2 * (1 + Math.cos((time / fakePeriod) * 2 * Math.PI));
}
const timeToVolume = (time, periodInSeconds) => {
    return maxDay * 10 / 2 * (1 + Math.cos((time / fakePeriod) * 2 * Math.PI));
};

const kLine = (time, period) => {
    const periodInSeconds = parseInt(period * 60);
    time = parseInt(time / periodInSeconds) * periodInSeconds;
    const open = timeToPrice(time);
    const close = timeToPrice(time + periodInSeconds);
    const delta = (maxDay - minDay) / fakePeriod * periodInSeconds * 2;
    const high = Math.max(open, close) + delta;
    const low = Math.min(open, close) - delta;
    const volume = timeToVolume(time, periodInSeconds);
    return [time, open, high, low, close, volume]
}

if (queryIndex != -1) {
    const vars = parseQuery(request.url);
    const period = parseInt(vars.period);
    const time_to = parseInt(vars.time_to);
    const time_from = parseInt(vars.time_from);
    let time = time_from;

    while (time < time_to) {
        k.push(kLine(time, period));
        time += period * 60;
    }
}

module.exports = k;
