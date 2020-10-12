import { sortAsks, sortBids } from './sortByPrice';

export const handleIncrementalUpdate = (depthOld: string[][], newLevel: string[], type: string): string[][] => {
    if (newLevel.length !== 2) {
        return depthOld;
    }

    const index = depthOld.findIndex(([price]) => +price === +newLevel[0]);

    if (index === -1) {
        const data = [...depthOld, newLevel];
        if (type === 'asks') {
            return sortAsks(data);
        }

        return sortBids(data);
    }

    const result = [...depthOld];
    if (Number(newLevel[1]) !== 0) {
        result[index] = newLevel;
    } else {
        result.splice(index, 1);
    }

    return result.filter(order => order[1]); //order[0] - price, order[1] - amount
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
        return sortAsks(result);
    }

    return sortBids(result.filter(order => order[1])); //order[0] - price, order[1] - amount
};
