import { handleAmountFromValue } from './component';

describe('Exchange component', () => {
    it('should handle correct amountFrom value', () => {
        const res = handleAmountFromValue('10', 20, 30, 'buy', 0.3);
        expect(res).toEqual(10);
    });

    it('should handle incorrect amountFrom value (buy)', () => {
        const res = handleAmountFromValue('100500', 20, 30, 'buy', 0.3);
        expect(res).toEqual(20 / 0.3);
    });

    it('should handle incorrect amountFrom value (sell)', () => {
        const res = handleAmountFromValue('100500', 20, 30, 'sell', 0.3);
        expect(res).toEqual(30);
    });
});
