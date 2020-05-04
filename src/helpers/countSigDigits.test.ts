import { countSigDigits } from './index';

describe('Describe countSigDigits helper', () => {
    it('should count significant digits of number type', () => {
        expect(countSigDigits(100000009)).toEqual(9);
        expect(countSigDigits(10005.100006)).toEqual(11);
    });

    it('should count significant digits of string type', () => {
        expect(countSigDigits('100000009')).toEqual(9);
        expect(countSigDigits('10005.100006')).toEqual(11);
        expect(countSigDigits('000010005.10000600000')).toEqual(11);
        expect(countSigDigits('000010000.00000600000')).toEqual(11);
    });

    it('should count significant digits of exponent', () => {
        expect(countSigDigits('7.71234e+1')).toEqual(6);
    });
});
