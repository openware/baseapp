import { precisionRegExp } from './';

describe('Describe regular expressions helper', () => {
    it('should match precisionRegExp', () => {
        expect('1').toMatch(precisionRegExp(0));
        expect('1.1').not.toMatch(precisionRegExp(0));
        expect('0.0000001').toMatch(precisionRegExp(7));
        expect('0.00000001').not.toMatch(precisionRegExp(7));
    });
});
