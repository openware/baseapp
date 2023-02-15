export const ssToMMSS = (seconds: number, minutes: number = 0) => {
    let initialMinutes = minutes;
    let initialSeconds = seconds;

    if (seconds > 59) {
        initialSeconds = seconds - 60;
        initialMinutes = minutes + 1;

        return ssToMMSS(initialSeconds, initialMinutes);
    } else {
        return {
            initialSeconds: initialSeconds,
            initialMinutes: initialMinutes,
        };
    }
};
