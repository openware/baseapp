export const accumulateVolume = array => {
    const total: number[] = [];
    array.map(item => {
        return item[1];
    }).reduce((accumulator, currentValue, currentIndex) => {
        total[currentIndex] = Number(accumulator) + Number(currentValue);

        return (Number(accumulator) + Number(currentValue));
    }, 0);

    return total;
};
