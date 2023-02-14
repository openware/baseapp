export const timeTo12HFormat = (timeInput: string) => {
    let time: string[] = timeInput.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [timeInput];

    if (time.length > 1) {
        time = time.slice(1);
        time[5] = +time[0] < 12 ? "AM" : "PM";
        time[0] = String(+time[0] % 12 || 12);
    }

    return `${time[0]}${time[1]}${time[2]} ${time[5]}`;
};

export const dateTo12HFormat = (value: string) => {
    const date = new Date(value).toUTCString().split(" ");

    return `${date[2]} ${date[1]}, ${date[3]} ${timeTo12HFormat(date[4])}`;
};
