import { countMinValidPriceStep } from './index';

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
