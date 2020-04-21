export const sliceArray = (data, index) => {
    if (!data || data.length === 0) {
        return [];
    }

    return data.slice(0, index);
};
