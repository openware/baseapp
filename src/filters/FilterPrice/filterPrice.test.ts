import { buildFilterPrice, validatePriceStep } from './index';

describe('Describe validatePriceStep filter', () => {
    it('should validate significant_digits filter', () => {
        expect(validatePriceStep(100, [])).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(100, [{ type: 'significant_digits', digits: 5 }].map(buildFilterPrice))).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(100.001, [{ type: 'significant_digits', digits: 5 }].map(buildFilterPrice))).toEqual({ valid: false, priceStep: 0 });
        expect(validatePriceStep(100.001, [{ type: 'significant_digits', digits: 5 }].map(buildFilterPrice))).toEqual({ valid: false, priceStep: 0 });
    });

    it('should validate custom_price_steps filter', () => {
        let filters = [{ type: 'custom_price_steps', rules: [{ limit: '10', step: '0.0001' }, { limit: '0', step: '0.001' }]}].map(buildFilterPrice);
        expect(validatePriceStep(100.001, filters)).toEqual({ valid: true, priceStep: 0 });

        filters = [{ type: 'custom_price_steps', rules: [{ limit: '100', step: '1' }, { limit: '0', step: '10' }]}].map(buildFilterPrice);
        expect(validatePriceStep(99.99, filters)).toEqual({ valid: false, priceStep: 1 });

        filters = [{ type: 'custom_price_steps', rules: [{ limit: '10', step: '1' },{ limit: '0', step: '10'}]}].map(buildFilterPrice);
        expect(validatePriceStep(110, filters)).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(111, filters)).toEqual({ valid: false, priceStep: 10 });
    });

    it('should validate multiple filters', () => {
        const filters = [
            {
                type: 'significant_digits', digits: 5,
            },
            {
                type: 'custom_price_steps', rules: [{ limit: '10', step: '1' },{ limit: '0', step: '10'}],
            },
        ].map(buildFilterPrice);

        expect(validatePriceStep(110, filters)).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(111, filters)).toEqual({ valid: false, priceStep: 10 });
        expect(validatePriceStep(1110, filters)).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(111000, filters)).toEqual({ valid: false, priceStep: 0 });
    });
});
