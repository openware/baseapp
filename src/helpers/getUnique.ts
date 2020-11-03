export const getUnique = (arr, comp) => {
    return arr
        .map((item) => item[comp])
        .map((item, i, final) => final.indexOf(item) === i && i)
        .filter((item) => arr[item])
        .map((item) => arr[item]);
};
