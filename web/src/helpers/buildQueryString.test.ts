import { buildQueryString } from './';

describe('Describe build query string helper', () => {
    it('should build correct query string without any parameter', () => {
        expect(buildQueryString({})).toEqual('');
    });

    it('should build correct query string with single parameter', () => {
        const payload = {
            currency: 'btc',
        };
        expect(buildQueryString(payload)).toEqual('currency=btc');
    });

    it('should build correct query string with multiple parameters', () => {
        const payload = {
            currency: 'btc',
            sort_by: 'desc',
            page: 1,
            limit: 25,
        };
        expect(buildQueryString(payload)).toEqual('currency=btc&sort_by=desc&page=1&limit=25');
    });
});
