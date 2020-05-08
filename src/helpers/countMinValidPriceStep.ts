export const countMinValidPriceStep = (price: number | string, digits: number) => {
    const clearPrice = String(+price);
    const priceParts = clearPrice.split('.');
    let indexOfDot = (priceParts[1]) ? clearPrice.indexOf('.') : priceParts[0].length;

    if (priceParts[0] === '0') {
        indexOfDot -= 1;
    }

    const minValidPrice = 10 ** (indexOfDot - digits);

    return minValidPrice;
};
