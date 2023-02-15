// merge Objects if their values are arrays
export const mergeObjects = (abilities: any[]) => {
    const mergedObject = {};

    for (const i in abilities) {
        for (const key of Object.keys(abilities[i])) {
            if (Array.isArray(abilities[i][key])) {
                mergedObject[key] = mergedObject[key]
                    ? [...mergedObject[key], ...abilities[i][key]]
                    : abilities[i][key];
            }
        }
    }

    return mergedObject;
};
