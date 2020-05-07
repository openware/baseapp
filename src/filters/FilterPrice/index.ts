import {
    MarketFilter,
    MarketFilterCustomStep,
    MarketFilterSignificantDigit,
} from '../../modules';
import { FilterPriceCustomStep } from './FilterPriceCustomStep';
import { FilterPriceSignificantDigit } from './FilterPriceSignificantDigit';

export interface PriceValidation {
    valid: boolean;
    priceStep: number;
}

export interface FilterPrice {
    validatePriceStep(price: number): PriceValidation;
}

export const buildFilterPrice = (filter: MarketFilter) : FilterPrice => {
    switch (filter.type) {
        case 'significant_digits':
            return new FilterPriceSignificantDigit(filter as MarketFilterSignificantDigit);
        case 'custom_price_steps':
            return new FilterPriceCustomStep(filter as MarketFilterCustomStep);
        default:
            throw new Error(`Unknown filter ${filter.type}`);
    }
};

export const validatePriceStep = (price: string | number = 0, filters: FilterPrice[]): PriceValidation => {
    return filters.reduce((result, filter) => {
        const currentValidation = filter.validatePriceStep(+price);

        if (!currentValidation.valid) {
            result.valid = false;
            if (currentValidation.priceStep > result.priceStep) {
                result.priceStep = currentValidation.priceStep;
            }
        }

        return result;
    }, { valid: true, priceStep: 0 } as PriceValidation);
};
