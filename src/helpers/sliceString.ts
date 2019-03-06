export const sliceString = (str, period) => {
    return str ? str.length > period ? `${str.slice(0, period)}...` : str : str;
};
