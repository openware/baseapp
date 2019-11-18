export const handleIncrementalUpdate = (depthOld: string[][], newOrder: string[], type: string): string[][] => {
    if (!newOrder[0]) {
        return depthOld;
    }
    const depthNew = [...depthOld];

    depthOld.some((prevOrder, index) => {
        if (type === 'asks' && +newOrder[1]) {
            if (newOrder[0] < prevOrder[0]) {
                depthNew.splice(index, 0, newOrder);

                return true;
            }

            if (newOrder[0] > prevOrder[0] && index === (depthOld.length - 1)) {
                depthNew.push(newOrder);

                return true;
            }
        }

        if (type === 'bids' && +newOrder[1]) {
            if (newOrder[0] > prevOrder[0]) {
                depthNew.splice(index, 0, newOrder);

                return true;
            }

            if (newOrder[0] < prevOrder[0] && index === (depthOld.length - 1)) {
                depthNew.push(newOrder);

                return true;
            }
        }

        if (newOrder[0] === prevOrder[0]) {
            if (!+newOrder[1]) {
                depthNew.splice(index, 1);
            } else {
                depthNew.splice(index, 1, newOrder);
            }

            return true;
        }

        return false;
    });

    return depthNew;
};
