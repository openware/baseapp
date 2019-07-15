export const PG_TITLE_PREFIX = 'Cryptobase';

export const pgRoutes = (isLoggedIn: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/'],
        ['page.header.navbar.wallets', '/wallets'],
        ['page.header.navbar.openOrders', '/orders'],
        ['page.header.navbar.history', '/history'],
    ];
    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin'],
        ['page.header.navbar.trade', '/trading/'],
    ];
    return isLoggedIn ? routes : routesUnloggedIn;
};

export const DEFAULT_CCY_PRECISION = 4;
export const STORAGE_DEFAULT_LIMIT = 50;
export const VALUATION_PRIMARY_CURRENCY = 'USD';
export const VALUATION_SECONDARY_CURRENCY = 'ETH';

export const colors = {
    light: {
        chart: {
            primary: '#fff',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            avatar: '#28334E',
            language: '#28334E',
            logout: '#28334E',
            sun: '#959EAB',
            moon: '#fff',
        },
    },
    basic: {
        chart: {
            primary: '#1E2841',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            avatar: '#737F92',
            language: '#737F92',
            logout: '#fff',
            sun: '#fff',
            moon: '#28334E',
        },
    },
};
