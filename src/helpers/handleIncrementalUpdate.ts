export const handleIncrementalUpdate = (depthOld: string[][], newLevel: string[], type: string): string[][] => {
    if (newLevel.length !== 2 || !newLevel[1]) {
        return depthOld;
    }
    const newLevelPrice = +newLevel[0];
    const newLevelVolume = +newLevel[1];
    const depthNew = [...depthOld];

    if (depthOld.length === 0) {
      return [newLevel];
    }

    for (let index = 0; index < depthOld.length; index++) {
        const levelPrice = +depthOld[index][0];
        if (type === 'asks' && newLevelVolume > 0) {
            if (newLevelPrice < levelPrice) {
                depthNew.splice(index, 0, newLevel);
                break;
            }

            if (newLevelPrice > levelPrice && index === (depthOld.length - 1)) {
                depthNew.push(newLevel);
                break;
            }
        }

        if (type === 'bids' && newLevelVolume > 0) {
            if (newLevelPrice > levelPrice) {
                depthNew.splice(index, 0, newLevel);
                break;
            }

            if (newLevelPrice < levelPrice && index === (depthOld.length - 1)) {
                depthNew.push(newLevel);
                break;
            }
        }

        if (newLevelPrice === levelPrice) {
            if (newLevelVolume === 0) {
                depthNew.splice(index, 1);
            } else {
                depthNew.splice(index, 1, newLevel);
            }
            break;
        }
    }

    return depthNew;
};


export const handleIncrementalUpdateArray = (depthOld: string[][], newLevels: string[][], type: string): string[][] => {
    const depthNew = newLevels.reduce((result: string[][], currentLevel: string[]) => {
        return handleIncrementalUpdate(result, currentLevel, type);
    }, depthOld);

    return depthNew;
};
