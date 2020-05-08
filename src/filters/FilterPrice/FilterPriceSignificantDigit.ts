import { countMinValidPriceStep, countSigDigits } from '../../helpers';
import { MarketFilterSignificantDigit } from '../../modules';
import { FilterPrice, PriceValidation } from './index';

export class FilterPriceSignificantDigit implements FilterPrice {
    public filter: MarketFilterSignificantDigit;

    constructor(filter: MarketFilterSignificantDigit) {
        this.filter = filter;
    }

    public validatePriceStep(price: number): PriceValidation {
        const valid = countSigDigits(price) <= this.filter.digits;
        let priceStep = 0;

        if (!valid) {
            priceStep = countMinValidPriceStep(price, this.filter.digits);
        }

        return { valid, priceStep } as PriceValidation;
    }
}
