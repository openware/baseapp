import { MarketFilterSignificantDigit } from '../../modules';
import { FilterPrice, PriceValidation } from './index';

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

export const countSignificantDigits = (value: number | string) => {
    if (value === 0) { return 0; }

    const formattedValue = String(Math.abs(+value));
    const valueAsInteger = formattedValue.replace('.','');
    const i = valueAsInteger.indexOf('e'); // return the index if number is represented by scientific notation

    if (i > -1) { return i; }
    if (valueAsInteger.length < formattedValue.length) { return valueAsInteger.replace(/^0+/,'').length; }

    return valueAsInteger.length;
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
