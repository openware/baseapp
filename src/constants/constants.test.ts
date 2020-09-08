import { PluginsManager } from '../plugins/PluginsManager';
import {
    ORDER_BOOK_DEFAULT_SIDE_LIMIT,
    PG_TITLE_PREFIX,
    pgRoutes,
    STORAGE_DEFAULT_LIMIT,
} from './';

const Plugins = new PluginsManager();

describe('Constants', () => {
    const expectedRoutesForLoggedInUser = [
        ['page.header.navbar.trade', '/trading/', 'trade'],
        ['page.header.navbar.wallets', '/wallets', 'wallets'],
        ['page.header.navbar.openOrders', '/orders', 'orders'],
        ['page.header.navbar.history', '/history', 'history'],
    ];

    const expectedRoutesForNotLoggedInUser = [
        ['page.header.navbar.signIn', '/signin', 'signin'],
        ['page.header.signUp', '/signup', 'signup'],
        ['page.header.navbar.trade', '/trading/', 'trade'],
    ];

    it('Rendering correct title prefix', () => {
        expect(PG_TITLE_PREFIX).toBe('Cryptobase');
    });

    it('Rendering correct storage default limit', () => {
        expect(STORAGE_DEFAULT_LIMIT).toBe(50);
    });

    it('Rendering correct order book default limit by side', () => {
        expect(ORDER_BOOK_DEFAULT_SIDE_LIMIT).toBe(25);
    });

    it('Rendering correct correct routes if user is not logged in', () => {
        expect(pgRoutes(false, Plugins)).toEqual(expectedRoutesForNotLoggedInUser);
    });

    it('Rendering correct correct routes if user is not logged in', () => {
        expect(pgRoutes(true, Plugins)).toEqual(expectedRoutesForLoggedInUser);
    });
});
