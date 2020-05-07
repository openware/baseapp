import { countDecimals } from './index';

describe('Describe countDecimals helper', () => {
    it('should count number of decimal digits', () => {
        expect(countDecimals(100000000)).toEqual(0);
        expect(countDecimals(0.100006)).toEqual(6);
        expect(countDecimals(10005.100006)).toEqual(6);
        expect(countDecimals('10005.100006')).toEqual(6);
        expect(countDecimals('000010000.00000600000')).toEqual(11);
    });
});
