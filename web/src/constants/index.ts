import { DropdownElem } from '../components/Order';

export const PG_TITLE_PREFIX = 'Cryptobase';

export const pgRoutes = (isLoggedIn: boolean, CanCan: boolean, isLight?: boolean): string[][] => {
    const routes = [
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
        ['page.header.navbar.wallets', '/wallets', `wallets${isLight ? 'Light' : ''}`],
        ['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`],
        ['page.header.navbar.history', '/history', `history${isLight ? 'Light' : ''}`],
        ['page.header.navbar.p2p', '/p2p', `p2p${isLight ? 'Light' : ''}`],
        ['page.header.navbar.api', '/api', `api${isLight ? 'Light' : ''}`],
        ['page.header.navbar.internal.transfer', '/internal-transfer', `internal_transfer${isLight ? 'Light' : ''}`],
    ];

    const routesFinexAbilities = [
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
        ['page.header.navbar.quick.exchange', '/quick-exchange', `quick_exchange${isLight ? 'Light' : ''}`],
        ['page.header.navbar.wallets', '/wallets', `wallets${isLight ? 'Light' : ''}`],
        ['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`],
        ['page.header.navbar.history', '/history', `history${isLight ? 'Light' : ''}`],
        ['page.header.navbar.api', '/docs', `api${isLight ? 'Light' : ''}`],
        ['page.header.navbar.p2p', '/p2p', `p2p${isLight ? 'Light' : ''}`],
        ['page.header.navbar.internal.transfer', '/internal-transfer', `internal_transfer${isLight ? 'Light' : ''}`],
    ];

    const routesUnloggedIn = [
        ['page.header.navbar.signIn', '/signin', `signin${isLight ? 'Light' : ''}`],
        ['page.header.signUp', '/signup', `signup${isLight ? 'Light' : ''}`],
        ['page.header.navbar.trade', '/trading/', `trade${isLight ? 'Light' : ''}`],
    ];

    if (CanCan) {
        return isLoggedIn ? routesFinexAbilities : routesUnloggedIn;
    }

    return isLoggedIn ? routes : routesUnloggedIn;
};

export const DEFAULT_CCY_PRECISION = 4;
export const DEFAULT_FIAT_PRECISION = 2;
export const DEFAULT_TRADING_VIEW_INTERVAL = '15';
export const VALUATION_PRIMARY_CURRENCY = 'USD';
export const VALUATION_SECONDARY_CURRENCY = 'ETH';

export const PASSWORD_ENTROPY_STEP = 6;

export const DEFAULT_KYC_STEPS = ['email', 'phone', 'profile', 'document', 'address'];

export const DEFAULT_MARKET_HEADERS = ['Pair', 'Price', '24h Change'];

export const DEFAULT_ORDER_TYPES: DropdownElem[] = ['Limit', 'Market'];
export const AMOUNT_PERCENTAGE_ARRAY = [0.25, 0.5, 0.75, 1];
export const DEFAULT_TABLE_PAGE_LIMIT = 25;

export const P2P_TIME_LIMIT_LIST = [ '15 min', '30 min', '60 min' ];

export const DEFAULT_MARKET = {
    id: '',
    name: '',
    base_unit: '',
    quote_unit: '',
    min_price: '',
    max_price: 0,
    min_amount: 0,
    amount_precision: 0,
    price_precision: 0,
};

export const colors = {
    light: {
        chart: {
            primary: '#fff',
            up: '#54B489',
            down: '#E85E59',
        },
        navbar: {
            sun: 'var(--icons)',
            moon: 'var(--primary-text-color)',
        },
        orderBook: {
            asks: 'var(--asks-level-4)',
            bids: 'var(--bids-level-4)',
        },
        depth: {
            fillAreaAsk: '#fa5252',
            fillAreaBid: '#12b886',
            gridBackgroundStart: '#1a243b',
            gridBackgroundEnd: '#1a243b',
            strokeAreaAsk: '#fa5252',
            strokeAreaBid: '#12b886',
            strokeGrid: '#B8E9F5',
            strokeAxis: '#cccccc',
        },
    },
    dark: {
        chart: {
            primary: 'var(--rgb-body-background-color)',
            up: 'var(--rgb-bids)',
            down: 'var(--rgb-asks)',
        },
        navbar: {
            sun: 'var(--primary-text-color)',
            moon: 'var(--icons)',
        },
        orderBook: {
            asks: 'var(--asks-level-4)',
            bids: 'var(--bids-level-4)',
        },
        depth: {
            fillAreaAsk: 'var(--rgb-asks)',
            fillAreaBid: 'var(--rgb-bids)',
            gridBackgroundStart: 'var(--rgb-asks)',
            gridBackgroundEnd: 'var(--rgb-asks)',
            strokeAreaAsk: 'var(--rgb-asks)',
            strokeAreaBid: 'var(--rgb-bids)',
            strokeGrid: 'var(--rgb-secondary-contrast-cta-color)',
            strokeAxis: 'var(--rgb-primary-text-color)',
        },
    },
};
