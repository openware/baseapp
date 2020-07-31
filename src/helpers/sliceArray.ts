export const sliceArray = (data, limit) => {
    const temp = data;
    if (!temp) {
        return temp;
    }

    if (temp.length > limit) {
        temp.length = limit;
    }

    return temp;
};
