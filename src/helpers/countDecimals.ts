export const countDecimals = value => {
    if (Math.floor(value) === value) { return 0; }
    const decimalPart = value.toString().split('.')[1];

    return decimalPart ? decimalPart.length : 0;
};
