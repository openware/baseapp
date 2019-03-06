import {
    PG_TITLE_PREFIX,
    pgRoutes,
    STORAGE_DEFAULT_LIMIT,
} from './';

describe('Constants', () => {
    const expectedRoutesForLoggedInUser = [
      ['page.header.navbar.trade', '/trading/'],
      ['page.header.navbar.wallets', '/wallets'],
      ['page.header.navbar.openOrders', '/orders'],
      ['page.header.navbar.history', '/history'],
    ];

    const expectedRoutesForNotLoggedInUser = [
      ['page.header.navbar.signIn', '/signin'],
      ['page.header.navbar.trade', '/trading/'],
    ];

    it('Rendering correct title prefix', () => {
        expect(PG_TITLE_PREFIX).toBe('Cryptobase');
    });

    it('Rendering correct storage default limit', () => {
        expect(STORAGE_DEFAULT_LIMIT).toBe(50);
    });

    it('Rendering correct correct routes if user is not logged in', () => {
        expect(pgRoutes(false)).toEqual(expectedRoutesForNotLoggedInUser);
    });

    it('Rendering correct correct routes if user is not logged in', () => {
        expect(pgRoutes(true)).toEqual(expectedRoutesForLoggedInUser);
    });
});
