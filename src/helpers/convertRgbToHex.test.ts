import { convertRgbToHex } from './';

describe('Describe convert rgb value to hex', () => {
    it('should convert values', () => {
        expect(convertRgbToHex('255, 255, 255')).toEqual('#ffffff');
        expect(convertRgbToHex('255, 255, 255, 1')).toEqual('#ffffff');
        expect(convertRgbToHex('0, 0, 0')).toEqual('#000000');
    });

    it('should handle wrong values', () => {
        expect(convertRgbToHex('')).toEqual('');
        expect(convertRgbToHex('255, 255')).toEqual('');
    });
});
