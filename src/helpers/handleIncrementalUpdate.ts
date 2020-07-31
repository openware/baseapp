export const handleIncrementalUpdate = (depthOld: string[][], newLevel: string[], type: string): string[][] => {
    if (newLevel.length !== 2) {
        return depthOld;
    }

    const index = depthOld.findIndex(([price]) => +price === +newLevel[0]);

    if (index === -1) {
        const data = [...depthOld, newLevel];
        if (type === 'asks') {
            return data.sort((a, b) => +a[0] - +b[0]);
        }

        return data.sort((a, b) => +b[0] - +a[0]);
    }

    const result = [...depthOld];
    if (Number(newLevel[1]) !== 0) {
        result[index] = newLevel;
    } else {
        result.splice(index, 1);
    }

    return result;
};

export const handleIncrementalUpdateArray = (depthOld: string[][], newLevels: string[][], type: string): string[][] => {
    const prices = {};

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < newLevels.length; i += 1) {
        prices[newLevels[i][0]] = newLevels[i][1];
    }

    const rest = depthOld.filter(([price]) => !prices[price]);
    const newData = newLevels.filter(([_, amount]) => Number(amount) !== 0);
    const result = [...rest, ...newData];

    if (type === 'asks') {
        return result.sort((a, b) => +a[0] - +b[0]);
    }

    return result.sort((a, b) => +b[0] - +a[0]);
};
