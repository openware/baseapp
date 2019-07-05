import { Cryptobase, defaultStorageLimit } from '../../../api';
import { getTimezone, setTimezone } from '../../../helpers/timezone';
import { PublicTrade } from '../../user/history';
import { Market } from '../markets';
import { recentTradesData, recentTradesError, recentTradesFetch, recentTradesPush } from './actions';
import { recentTradesReducer } from './reducer';
import { PublicTradeEvent } from './types';


describe('recentTrade reducer', () => {
    const market: Market = {
        id: 'ethbtc',
        name: 'ETH/BTC',
        bid_fee: '0.0015',
        ask_fee: '0.0015',
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
            price: '0.01',
            volume: '0.059',
            funds: '0.00059',
            market: 'bchbtc',
            created_at: '2019-01-14T11:13:08.000Z',
            taker_type: 'sell',
        },
        {
            id: 162414,
            price: '0.01',
            volume: '0.01',
            funds: '0.0001',
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
            price: '0.01',
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

    const trade: PublicTrade = {
        id: 162413,
        price: '0.01',
        volume: '0.059',
        funds: '0.00059',
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
        });
        Cryptobase.config.storage.defaultStorageLimit = initialLimit;

    });

    it('supports recentTradesPush', () => {
        const initialState = {
            loading: false,
            list: [trade],
        };
        expect(recentTradesReducer(initialState, recentTradesPush({ trades: fakeTradeEvents, market: 'bchbtc' }))).toEqual({
            loading: false,
            list: fakeTrades.concat(trade),
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
        };
        const initialLimit = defaultStorageLimit();
        Cryptobase.config.storage.defaultStorageLimit = 2;
        expect(recentTradesReducer(initialState, recentTradesPush({ trades: fakeTradeEvents, market: 'bchbtc' }))).toEqual({
            loading: false,
            list: fakeTrades,
        });
        Cryptobase.config.storage.defaultStorageLimit = initialLimit;

    });

    it('supports recentTradesError', () => {
        const error = {
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
