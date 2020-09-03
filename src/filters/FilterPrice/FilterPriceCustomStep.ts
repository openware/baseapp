import { MarketFilterCustomStep } from '../../modules';
import { FilterPrice, PriceValidation } from './index';

export const countDecimals = (value): number => {
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
            const priceDecimals = countDecimals(price);
            const stepDecimals = countDecimals(currentLimit.step);
            const targetCoefficient = priceDecimals > stepDecimals ? priceDecimals : stepDecimals;
            const validStepCoefficient = targetCoefficient ? 10 ** targetCoefficient : 1;

            currentValidation.valid = !(+(validStepCoefficient * price).toFixed(0) % (validStepCoefficient * +currentLimit.step));
            currentValidation.priceStep = !currentValidation.valid ? +currentLimit.step : 0;
        }

        return currentValidation;
    }
}
