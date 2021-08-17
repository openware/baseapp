import { incrementalOrderBook, isFinexEnabled, rangerUrl } from 'src/api';
import { DEFAULT_TRADING_VIEW_INTERVAL } from 'src/constants';
import { Market, Ticker, TickerEvent } from 'src/modules/public/markets';

export const baseUrl = (withAuth: boolean) => `${rangerUrl()}/${withAuth ? 'private' : 'public'}`;
export const isTradingPage = route => route?.split('/')[1] === 'trading';
export const generateSocketURI = (withAuth: boolean, s: string[]) => `${baseUrl(withAuth)}/?stream=${s.sort().join('&stream=')}`;

export const formatTicker = (events: { [pair: string]: TickerEvent }): { [pair: string]: Ticker } => {
    const tickers = {};
    for (const market in events) {
        if (events.hasOwnProperty(market)) {
            const event: TickerEvent = events[market];
            const {
                amount,
                avg_price,
                high,
                last,
                low,
                open,
                price_change_percent,
                volume,
            } = event;
            tickers[market] = {
                amount,
                avg_price,
                high,
                last,
                low,
                open,
                price_change_percent,
                volume,
            };
        }
    }

    return tickers;
};

export const streamsBuilder = (withAuth: boolean, withP2P: boolean, market: Market | undefined, route: string) => {
    let streams: string[] = [];

    switch (route.split('/')[1]) {
        case 'wallets':
            streams = [
                (withAuth && isFinexEnabled() && 'balances'),
                (withAuth && 'deposit_address'),
            ];

            break;
        case 'trading':
            streams = [
                (withAuth && isFinexEnabled() && 'balances'),
                (withAuth && 'order'),
                (withAuth && 'trade'),
                ...(market ? marketStreams(market).channels : []),
                'global.tickers',
            ];

            break;
        case 'quick-exchange':
            streams = [
                (withAuth && isFinexEnabled() && 'balances'),
                'global.tickers',
            ];

            break;
        case 'orders':
            streams = [ withAuth && 'order' ];

            break;
        case 'history':
            streams = [ withAuth && 'trade' ];

            break;
        case 'p2p':
            streams = [
                withAuth && isFinexEnabled() && 'balances',
                (withP2P && 'p2p.event'),
            ];

            break;
        case 'internal-transfer':
            streams = [ withAuth && isFinexEnabled() && 'balances' ];

            break;
        case '':
            streams = [ 'global.tickers' ];

            break;
        default:
            break;
    }

    streams = [
        ...streams,
        (withP2P && withAuth && 'p2p'),
    ];

    return streams.filter(i => !!i);
};

export const periodsMapNumber: { [pair: string]: number } = {
    '1m': 1,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '2h': 120,
    '4h': 240,
    '6h': 360,
    '12h': 720,
    '1d': 1440,
    '3d': 4320,
    '1w': 10080,
};

export const periodsMapString: { [pair: number]: string } = {
    1: '1m',
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    120: '2h',
    240: '4h',
    360: '6h',
    720: '12h',
    1440: '1d',
    4320: '3d',
    10080: '1w',
};

export const periodStringToMinutes = (period: string): number => periodsMapNumber[period] || +DEFAULT_TRADING_VIEW_INTERVAL;
export const periodMinutesToString = (period: number): string => periodsMapString[period] || periodsMapString[+DEFAULT_TRADING_VIEW_INTERVAL];

export const marketKlineStreams = (marketId: string, periodString: string) => ({
    channels: [
        `${marketId}.kline-${periodString}`,
    ],
});

export const marketStreams = (market: Market) => {
    const channels = [
        `${market.id}.trades`,
    ];

    if (incrementalOrderBook()) {
        return {
            channels: [
                ...channels,
                `${market.id}.ob-inc`,
            ],
        };
    }

    return {
        channels: [
            ...channels,
            `${market.id}.update`,
        ],
    };
};
