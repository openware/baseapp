import { FilterPrice, PriceValidation } from './FilterPrice';

export class FilterPriceSignificantDigit implements FilterPrice {
    public validatePriceStep(price: Number): PriceValidation {
        throw new Error('Method not implemented.');
    }
}
