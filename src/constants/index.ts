export const PG_TITLE_PREFIX = 'Cryptobase';

export const pgRoutes = (isLoggedIn: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/', 'trade'],
        ['page.header.navbar.wallets', '/wallets', 'wallets'],
        ['page.header.navbar.openOrders', '/orders', 'orders'],
        ['page.header.navbar.history', '/history', 'history'],
    ];
    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin', 'signin'],
        ['page.header.signUp', '/signup', 'signup'],
        ['page.header.navbar.trade', '/trading/', 'trade'],
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
        orderBook: {
            asks: 'rgba(232, 94, 89, 0.4)',
            bids: 'rgba(84, 180, 137, 0.4)',
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
        orderBook: {
            asks: 'rgba(232, 94, 89, 0.4)',
            bids: 'rgba(84, 180, 137, 0.4)',
        },
    },
};
