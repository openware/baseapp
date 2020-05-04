export const countSigDigits = (value: number | string) => {
    if (value === 0) {
        return 0;
    }

    const t1 = String(Math.abs(+value));
    const t2 = t1.replace('.','');
    const i = t2.indexOf('e'); // return the index if number is represented by scientific notation

    if (i > -1) {
        return i;
    }

    return t2.replace(/0+$/,'').length; // remove trailing zeros
};
