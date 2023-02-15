import { MarketFilterSignificantDigit } from '../../modules';
import { FilterPrice, PriceValidation } from './';

export const countMinValidPriceStep = (price: number | string, digits: number) => {
    const clearPrice = String(+price);
    const priceParts = clearPrice.split('.');
    let indexOfDot = priceParts[1] ? clearPrice.indexOf('.') : priceParts[0].length;

    if (priceParts[0] === '0') {
        indexOfDot -= 1;
    }

    let minValidPrice = 10 ** (indexOfDot - digits);

    if (minValidPrice < 1) {
        minValidPrice = +minValidPrice.toFixed(digits - indexOfDot);
    }

    return minValidPrice;
};

export const countSignificantDigits = (value: number | string) => {
    if (value === 0) {
        return 0;
    }

    return Number(value)
        .toExponential()
        .replace(/e[+\-0-9]*$/, '') // remove exponential notation
        .replace(/^0\.?0*|\./, '').length; // remove decimal point and leading zeros
};

export class FilterPriceSignificantDigit implements FilterPrice {
    public filter: MarketFilterSignificantDigit;

    constructor(filter: MarketFilterSignificantDigit) {
        this.filter = filter;
    }

    public validatePriceStep(price: number): PriceValidation {
        const valid = countSignificantDigits(price) <= this.filter.digits;
        let priceStep = 0;

        if (!valid) {
            priceStep = countMinValidPriceStep(price, this.filter.digits);
        }

        return { valid, priceStep } as PriceValidation;
    }
}
