import { Cryptobase, defaultStorageLimit } from '../../../api';
import { getTimezone, setTimezone } from '../../../helpers/timezone';
import { CommonError } from '../../types';
import { PublicTrade } from '../../user/history';
import { Market } from '../markets';
import { recentTradesData, recentTradesError, recentTradesFetch, recentTradesPush } from './actions';
import { extendTradeWithPriceChange, recentTradesReducer } from './reducer';
import { PublicTradeEvent } from './types';

describe('recentTrade reducer', () => {
    const market: Market = {
        id: 'ethbtc',
        name: 'ETH/BTC',
        base_unit: 'eth',
        quote_unit: 'btc',
        min_price: '0.0',
        max_price: '0.0',
        min_amount: '0.0',
        amount_precision: 4,
        price_precision: 4,
    };
    const fakeTrades: PublicTrade[] = [
        {
            id: 162413,
            price: '0.015',
            total: '0.00059',
            amount: '0.059',
            market: 'bchbtc',
            created_at: '2019-01-14T11:13:08.000Z',
            taker_type: 'sell',
        },
        {
            id: 162414,
            price: '0.01',
            total: '0.0001',
            amount: '0.01',
            market: 'bchbtc',
            created_at: '2019-01-14T11:13:08.000Z',
            taker_type: 'buy',
        },
    ];
    const fakeTradeEvents: PublicTradeEvent[] = [
        {
            tid: 162413,
            taker_type: 'sell',
            date: 1547464388,
            price: '0.015',
            amount: '0.059',
        },
        {
            tid: 162414,
            taker_type: 'buy',
            date: 1547464388,
            price: '0.01',
            amount: '0.01',
        },
    ];

    const fakeTradesAdjusted: PublicTrade[] = [
        {
            id: 162413,
            price: '0.015',
            amount: '0.059',
            market: 'bchbtc',
            created_at: '2019-01-14T11:13:08.000Z',
            taker_type: 'sell',
        },
        {
            id: 162414,
            price: '0.01',
            amount: '0.01',
            market: 'bchbtc',
            created_at: '2019-01-14T11:13:08.000Z',
            taker_type: 'buy',
        },
    ];

    const trade: PublicTrade = {
        id: 162413,
        price: '0.02',
        total: '0.059',
        amount: '0.00059',
        market: 'bchbtc',
        created_at: '2019-01-14T12:13:08-08:00',
        taker_type: 'sell',
    };

    let tz;

    beforeEach(() => {
        tz = getTimezone();
        setTimezone('America/Los_Angeles');
    });

    afterEach(() => {
        setTimezone(tz);
    });

    it('supports recentTradesFetch', () => {
        expect(recentTradesReducer(undefined, recentTradesFetch(market))).toEqual({
            loading: true,
            list: [],
        });
    });

    it('supports recentTradesData', () => {
        expect(recentTradesReducer(undefined, recentTradesData(fakeTrades))).toEqual({
            loading: false,
            list: fakeTrades,
            lastTrade: extendTradeWithPriceChange(fakeTrades[0], fakeTrades[1]),
        });
    });

    it('recentTradesData limits store size', () => {
        const list = [
            {
                ...trade,
                id: 1,
            },
            {
                ...trade,
                id: 2,
            },
            {
                ...trade,
                id: 3,
            },
        ];
        const initialState = {
            loading: false,
            list,
        };
        const initialLimit = defaultStorageLimit();
        Cryptobase.config.storage.defaultStorageLimit = 2;
        expect(recentTradesReducer(initialState, recentTradesData(fakeTrades))).toEqual({
            loading: false,
            list: fakeTrades,
            lastTrade: extendTradeWithPriceChange(fakeTrades[0], fakeTrades[1]),
        });
        Cryptobase.config.storage.defaultStorageLimit = initialLimit;

    });

    it('supports recentTradesPush', () => {
        const initialState = {
            loading: false,
            list: [trade],
            lastTrade: extendTradeWithPriceChange(trade),
        };
        expect(recentTradesReducer(initialState, recentTradesPush({ trades: fakeTradeEvents, market: 'bchbtc' }))).toEqual({
            loading: false,
            list: fakeTradesAdjusted.concat(trade),
            lastTrade: extendTradeWithPriceChange(fakeTradesAdjusted[0], fakeTradesAdjusted[1]),
        });
    });

    it('recentTradesPush limits store size', () => {
        const list = [
            {
                ...trade,
                id: 1,
            },
            {
                ...trade,
                id: 2,
            },
            {
                ...trade,
                id: 3,
            },
        ];
        const initialState = {
            loading: false,
            list,
            lastTrade: extendTradeWithPriceChange(list[0], list[1]),
        };
        const initialLimit = defaultStorageLimit();
        Cryptobase.config.storage.defaultStorageLimit = 2;
        expect(recentTradesReducer(initialState, recentTradesPush({ trades: fakeTradeEvents, market: 'bchbtc' }))).toEqual({
            loading: false,
            list: fakeTradesAdjusted,
            lastTrade: extendTradeWithPriceChange(fakeTradesAdjusted[0], fakeTradesAdjusted[1]),
        });
        Cryptobase.config.storage.defaultStorageLimit = initialLimit;

    });

    it('supports recentTradesError', () => {
        const error: CommonError = {
            code: 421,
            message: ['BADDDD!'],
        };
        expect(recentTradesReducer(undefined, recentTradesError(error))).toEqual({
            loading: false,
            list: [],
            error,
        });
    });
});
