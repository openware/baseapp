import { Cryptobase, defaultStorageLimit } from '../../../api';
import { getTimezone, setTimezone } from '../../../helpers/timezone';
import { tradePush, tradesData, tradesError, tradesFetch } from './actions';
import { tradesReducer } from './reducer';
import { PrivateTrade, PrivateTradeEvent } from './types';


describe('Trades reducer', () => {
    let tz;

    afterEach(() => {
        setTimezone(tz);
    });

    beforeEach(() => {
        tz = getTimezone();
        setTimezone('America/Los_Angeles');
    });

    it('supports tradesFetch', () => {
        const state = tradesReducer(undefined, tradesFetch(
            [
                {
                    id: 'ethbtc',
                    name: 'ETH/BTC',
                    bid_fee: '0.0015',
                    ask_fee: '0.0015',
                    ask_unit: 'eth',
                    bid_unit: 'btc',
                    min_ask_price: '0.0',
                    max_bid_price: '0.0',
                    min_ask_amount: '0.0',
                    min_bid_amount: '0.0',
                    ask_precision: 4,
                    bid_precision: 4,
                },
            ],
        ));
        expect(state).toEqual({
            list: [],
            loading: true,
        });
    });
    const trades: PrivateTrade[] = [
        {
            id: 162389,
            price: '0.3',
            volume: '0.001',
            funds: '0.0003',
            market: 'ethbtc',
            created_at: '2018-12-14T12:00:47+01:00',
            maker_type: 'buy',
            side: 'bid',
            order_id: 42,
        },
        {
            id: 162390,
            price: '0.3',
            volume: '0.001',
            funds: '0.0003',
            market: 'ethbtc',
            created_at: '2018-12-14T12:00:47+01:00',
            maker_type: 'buy',
            side: 'bid',
            order_id: 44,
        },
    ];
    it('supports tradesData', () => {
        const state = tradesReducer(undefined, tradesData(trades));
        expect(state).toEqual({
            list: trades,
            loading: false,
        });
    });

    it('supports tradePush', () => {
        const tradeEvent: PrivateTradeEvent = {
            id: 21,
            kind: 'ask',
            at: 4242424242,
            price: '0.3',
            volume: '0.001',
            ask_id: 116,
            bid_id: 117,
            market: 'xrpbtc',
        };

        const initialState = {
            list: trades,
            loading: false,
        };
        const expectedTrades: PrivateTrade[] = [
            {
                id: 21,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'xrpbtc',
                created_at: '2104-06-08T20:10:42-07:00',
                maker_type: 'sell',
            },
        ].concat(trades);
        const state = tradesReducer(initialState, tradePush(tradeEvent));
        expect(state).toEqual({
            list: expectedTrades,
            loading: false,
        });
    });

    it('discrards trades once storageTradesMax is reached', () => {
        const initialLimit = defaultStorageLimit();
        Cryptobase.config.storage.defaultStorageLimit = 2;
        const tradeEvent: PrivateTradeEvent = {
            id: 21,
            at: 4242424242,
            market: 'xrpbtc',
            kind: 'ask',
            price: '0.3',
            volume: '0.001',
            ask_id: 116,
            bid_id: 117,
        };

        const initialState = {
            list: trades,
            loading: false,
        };
        const expectedTrades: PrivateTrade[] = [
            {
                id: 21,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'xrpbtc',
                created_at: '2104-06-08T20:10:42-07:00',
                maker_type: 'sell',
            },
            trades[0],
        ];
        const state = tradesReducer(initialState, tradePush(tradeEvent));
        expect(state).toEqual({
            list: expectedTrades,
            loading: false,
        });
        Cryptobase.config.storage.defaultStorageLimit = initialLimit;
    });

    it('supports tradesError', () => {
        const error = {
            code: 42,
            message: 'something went wrong',
        };
        const state = tradesReducer(undefined, tradesError(error));
        expect(state).toEqual({
            list: [],
            loading: false,
            error,
        });
    });
});
