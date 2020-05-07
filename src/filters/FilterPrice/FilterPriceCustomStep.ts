import { countDecimals } from '../../helpers';
import { MarketFilterCustomStep } from '../../modules';
import { FilterPrice, PriceValidation } from './index';

export class FilterPriceCustomStep implements FilterPrice {
    public filter: MarketFilterCustomStep;

    constructor(filter: MarketFilterCustomStep) {
        this.filter = filter;
    }

    public validatePriceStep(price: number): PriceValidation {
        const currentValidation: PriceValidation = { valid: true, priceStep: 0 };
        const nextIndex = this.filter.rules.findIndex(step => step && +step.limit > price);
        const zeroIndex = this.filter.rules.findIndex(step => step && +step.limit === 0);
        const currentLimit = nextIndex > 0 ? (
            this.filter.rules[nextIndex - 1]
        ) : (
            nextIndex === 0 ? (
                this.filter.rules[nextIndex]
            ) : (
                zeroIndex ? this.filter.rules[zeroIndex] : null
            )
        );

        if (currentLimit) {
            const stepDecimals = countDecimals(currentLimit.step);
            currentValidation.valid = stepDecimals ? price <= +price.toFixed(stepDecimals) : !(price % +currentLimit.step);
            currentValidation.priceStep = !currentValidation.valid ? +currentLimit.step : 0;
        }

        return currentValidation;
    }
}
