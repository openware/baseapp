import { PG_TITLE_PREFIX, pgRoutes } from './';

describe('Constants', () => {
    const expectedRoutesForLoggedInUser = [
        ['page.header.navbar.trade', '/trading/', 'trade'],
        ['page.header.navbar.quick.exchange', '/quick-exchange', 'quick_exchange'],
        ['page.header.navbar.wallets', '/wallets', 'wallets'],
        ['page.header.navbar.openOrders', '/orders', 'orders'],
        ['page.header.navbar.history', '/history', 'history'],
        ['page.header.navbar.api', '/docs', 'api'],
        ['page.header.navbar.internal.transfer', '/internal-transfer', 'internal_transfer'],
    ];

    const expectedRoutesForLoggedInUser2 = [
        ['page.header.navbar.trade', '/trading/', 'trade'],
        ['page.header.navbar.quick.exchange', '/quick-exchange', 'quick_exchange'],
        ['page.header.navbar.wallets', '/wallets', 'wallets'],
        ['page.header.navbar.openOrders', '/orders', 'orders'],
        ['page.header.navbar.history', '/history', 'history'],
        ['page.header.navbar.p2p', '/p2p', 'p2p'],
        ['page.header.navbar.api', '/docs', 'api'],
        ['page.header.navbar.internal.transfer', '/internal-transfer', 'internal_transfer'],
    ];

    const expectedRoutesForNotLoggedInUser = [
        ['page.header.navbar.signIn', '/signin', 'signin'],
        ['page.header.signUp', '/signup', 'signup'],
        ['page.header.navbar.trade', '/trading/', 'trade'],
    ];

    it('Rendering correct title prefix', () => {
        expect(PG_TITLE_PREFIX).toBe('Cryptobase');
    });

    it('Rendering correct routes if user is not logged in', () => {
        expect(pgRoutes(false, {})).toEqual(expectedRoutesForNotLoggedInUser);
    });

    it('Rendering correct routes if user is logged in', () => {
        expect(pgRoutes(true, {read: ['QuickExchange']})).toEqual(expectedRoutesForLoggedInUser);
    });

    it('Rendering correct routes if user is logged in', () => {
        expect(pgRoutes(true, {read: ['QuickExchange']})).toEqual(expectedRoutesForLoggedInUser);
    });

    it('Rendering correct routes if user is logged in with P2P ability', () => {
        expect(pgRoutes(true, {read: ['QuickExchange', 'P2P']})).toEqual(expectedRoutesForLoggedInUser2);
    });
});
