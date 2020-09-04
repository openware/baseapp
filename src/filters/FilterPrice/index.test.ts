import { countDecimals } from './FilterPriceCustomStep';
import { countMinValidPriceStep, countSignificantDigits } from './FilterPriceSignificantDigit';
import { buildFilterPrice, validatePriceStep } from './index';

describe('Describe countDecimals helper', () => {
    it('should count number of decimal digits', () => {
        expect(countDecimals(100000000)).toEqual(0);
        expect(countDecimals(0.100006)).toEqual(6);
        expect(countDecimals(10005.100006)).toEqual(6);
        expect(countDecimals('10005.100006')).toEqual(6);
        expect(countDecimals('000010000.00000600000')).toEqual(11);
    });
});

describe('Describe countSigDigits helper', () => {
    it('should count significant digits of number type', () => {
        expect(countSignificantDigits(0.000006)).toEqual(1);
        expect(countSignificantDigits(100000000)).toEqual(1);
        expect(countSignificantDigits(100000009)).toEqual(9);
        expect(countSignificantDigits(0.100006)).toEqual(6);
        expect(countSignificantDigits(10005.100006)).toEqual(11);
    });

    it('should count significant digits of string type', () => {
        expect(countSignificantDigits('100000009')).toEqual(9);
        expect(countSignificantDigits('10005.100006')).toEqual(11);
        expect(countSignificantDigits('000010005.10000600000')).toEqual(11);
        expect(countSignificantDigits('000010000.00000600000')).toEqual(11);
    });

    it('should count significant digits of exponent', () => {
        expect(countSignificantDigits('7.71234e+1')).toEqual(6);
    });
});

describe('Describe countMinValidPriceStep helper', () => {
    it('should count minimum valid price step', () => {
        expect(countMinValidPriceStep(0, 0)).toEqual(1);
        expect(countMinValidPriceStep(0, 5)).toEqual(0.00001);
        expect(countMinValidPriceStep(100000000, 5)).toEqual(10000);
        expect(countMinValidPriceStep(0.100006, 5)).toEqual(0.00001);
        expect(countMinValidPriceStep(10005.100006, 5)).toEqual(1);
        expect(countMinValidPriceStep('10005.100006', 6)).toEqual(0.1);
        expect(countMinValidPriceStep('000010000.00000600000', 3)).toEqual(100);
    });
});

describe('Describe validatePriceStep filter', () => {
    it('should validate significant_digits filter', () => {
        expect(validatePriceStep(100, [])).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(100, [{ type: 'significant_digits', digits: 5 }].map(buildFilterPrice))).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(100.001, [{ type: 'significant_digits', digits: 5 }].map(buildFilterPrice))).toEqual({ valid: false, priceStep: 0.01 });
        expect(validatePriceStep(100.001, [{ type: 'significant_digits', digits: 5 }].map(buildFilterPrice))).toEqual({ valid: false, priceStep: 0.01 });
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
                type: 'significant_digits', digits: 2,
            },
            {
                type: 'custom_price_steps', rules: [{ limit: '5', step: '0.01' }, { limit: '10', step: '1' },{ limit: '0', step: '10'}],
            },
        ].map(buildFilterPrice);

        expect(validatePriceStep(1, filters)).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(5.6, filters)).toEqual({ valid: false, priceStep: 1 });
        expect(validatePriceStep(110, filters)).toEqual({ valid: true, priceStep: 0 });
        expect(validatePriceStep(111, filters)).toEqual({ valid: false, priceStep: 10 });
        expect(validatePriceStep(1110, filters)).toEqual({ valid: false, priceStep: 100 });
        expect(validatePriceStep(111000, filters)).toEqual({ valid: false, priceStep: 10000 });
    });
});
