import {
    PG_TITLE_PREFIX,
    pgRoutes,
    STORAGE_DEFAULT_LIMIT,
} from './';

describe('Constants', () => {
    const expectedRoutesForLoggedInUser = [
        ['Trade', '/trade'],
        ['Wallets', '/wallets'],
        ['Buy/Sell', '/exchange'],
        ['Orders', '/orders'],
        ['History', '/history'],
    ];

    const expectedRoutesForNotLoggedInUser = [
        ['Sign In', '/signin'],
        ['Trade', '/trade'],
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
