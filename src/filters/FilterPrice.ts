export interface PriceValidation {
    valid: boolean;
    priceStep: number;
}

export interface FilterPrice {
    validatePriceStep(price: number): PriceValidation;
}

export const validatePriceStep = (price: number, filters: FilterPrice[]): PriceValidation => {
    return filters.reduce((result, filter) => {
        const { valid, priceStep } = filter.validatePriceStep(price);

        if (!valid) {
            result.valid = false;
            if (result.priceStep < priceStep) {
                result.priceStep = priceStep;
            }
        }

        return result;
    }, { valid: true, priceStep: 0 } as PriceValidation);
};
