import { MarketFilterCustomStep } from '../../modules';
import { FilterPrice, PriceValidation } from './index';

export const countDecimals = value => {
    if (!value || Math.floor(value) === value) { return 0; }
    const decimalPart = value.toString().split('.')[1];

    return decimalPart ? decimalPart.length : 0;
};

export class FilterPriceCustomStep implements FilterPrice {
    public filter: MarketFilterCustomStep;

    constructor(filter: MarketFilterCustomStep) {
        this.filter = filter;
    }

    public validatePriceStep(price: number): PriceValidation {
        const currentValidation: PriceValidation = { valid: true, priceStep: 0 };
        const nextIndex = this.filter.rules.findIndex(step => step && +step.limit > price);
        const zeroIndex = this.filter.rules.findIndex(step => step && +step.limit === 0);

        const currentLimit = nextIndex >= 0 ? (
            this.filter.rules[nextIndex]
        ) : (
            zeroIndex ? this.filter.rules[zeroIndex] : null
        );

        if (currentLimit) {
            const stepDecimals = countDecimals(currentLimit.step);
            const validCoefficient = stepDecimals ? 10 ** stepDecimals : 1;
            currentValidation.valid = !(+(validCoefficient * price).toFixed(0) % (validCoefficient * +currentLimit.step));
            currentValidation.priceStep = !currentValidation.valid ? +currentLimit.step : 0;
        }

        return currentValidation;
    }
}
