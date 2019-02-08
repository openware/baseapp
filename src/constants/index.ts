export const PG_TITLE_PREFIX = 'Cryptobase';

export const pgRoutes = (isLoggedIn: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trade'],
        ['page.header.navbar.wallets', '/wallets'],
        ['page.header.navbar.openOrders', '/orders'],
        ['page.header.navbar.history', '/history'],
    ];
    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin'],
        ['page.header.navbar.trade', '/trade'],
    ];
    return isLoggedIn ? routes : routesUnloggedIn;
};

export const STORAGE_DEFAULT_LIMIT = 50;
