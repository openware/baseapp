export const PG_TITLE_PREFIX = 'Cryptobase';

export const pgRoutes = (isLoggedIn: boolean): string[][] => {
    const routes = [
        ['Trade', '/trade'],
        ['Wallets', '/wallets'],
        ['Orders', '/orders'],
        ['History', '/history'],
    ];
    const routesUnloggedIn = [
        ['Sign In', '/signin'],
        ['Trade', '/trade'],
    ];
    return isLoggedIn ? routes : routesUnloggedIn;
};

export const STORAGE_DEFAULT_LIMIT = 50;
