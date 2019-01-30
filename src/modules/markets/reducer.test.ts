import * as actions from './actions';
import {
    initialMarketsState,
    marketsReducer,
} from './reducer';

describe('Markets reducer', () => {
    const fakeMarkets = [
        {
            id: 'usdbtc',
            name: 'USD/BTC',
            ask_unit: 'usd',
            bid_unit: 'btc',
            ask_fee: '0.0015',
            bid_fee: '0.0015',
            min_ask_price: '0.0',
            max_bid_price: '0.0',
            min_ask_amount: '0.0',
            min_bid_amount: '0.0',
            ask_precision: 4,
            bid_precision: 4,
        },
        {
            id: 'btceth',
            name: 'BTC/ETH',
            ask_unit: 'btc',
            bid_unit: 'eth',
            ask_fee: '0.0015',
            bid_fee: '0.0015',
            min_ask_price: '0.0',
            max_bid_price: '0.0',
            min_ask_amount: '0.0',
            min_bid_amount: '0.0',
            ask_precision: 4,
            bid_precision: 4,
        },
    ];

    const btcethTicker = {
        buy: '0.0',
        sell: '0.0',
        low: '0.0',
        high: '0.0',
        open: 1,
        last: '0.0',
        vol: '10.0',
        avg_price: '1.42857142857142857143',
        price_change_percent: '-100.00%',
    };

    const btcusdTicker = {
        buy: '0.0',
        sell: '1.0',
        low: '0.0',
        high: '0.0',
        open: 1,
        last: '0.0',
        avg_price: '0.875',
        price_change_percent: '-100.00%',
        vol: '15.5',
    };

    const marketsTickersList = {
        btceth: btcethTicker,
        btcusd: btcusdTicker,
    };

    const error = {
        code: 500,
        message: 'Server error',
    };

    it('should handle MARKETS_FETCH', () => {
        const expectedState = {
            ...initialMarketsState,
            loading: true,
            error: undefined,
        };
        expect(marketsReducer(initialMarketsState, actions.marketsFetch())).toEqual(expectedState);
    });

    it('should handle MARKETS_DATA', () => {
        const expectedState = {
            ...initialMarketsState,
            loading: false,
            error: undefined,
            list: fakeMarkets,
        };
        expect(marketsReducer(initialMarketsState, actions.marketsData(fakeMarkets))).toEqual(expectedState);
    });

    it('should handle MARKETS_ERROR', () => {
        const expectedState = {
            ...initialMarketsState,
            loading: false,
            error: error,
        };
        expect(marketsReducer(initialMarketsState, actions.marketsError(error))).toEqual(expectedState);
    });

    it('should handle SET_CURRENT_MARKET', () => {
        const expectedState = {
            ...initialMarketsState,
            currentMarket: fakeMarkets[0],
        };
        expect(marketsReducer(initialMarketsState, actions.setCurrentMarket(fakeMarkets[0]))).toEqual(expectedState);
    });

    it('should handle MARKETS_TICKERS_FETCH', () => {
        const expectedState = {
            ...initialMarketsState,
            loading: true,
            error: undefined,
        };
        expect(marketsReducer(initialMarketsState, actions.marketsTickersFetch())).toEqual(expectedState);
    });

    it('should handle MARKETS_TICKERS_DATA', () => {
        const expectedState = {
            ...initialMarketsState,
            tickers: marketsTickersList,
        };
        expect(marketsReducer(initialMarketsState, actions.marketsTickersData(marketsTickersList))).toEqual(expectedState);
    });

    it('should handle MARKETS_TICKERS_ERROR', () => {
        const expectedState = {
            ...initialMarketsState,
            loading: false,
            error: error,
        };
        expect(marketsReducer(initialMarketsState, actions.marketsTickersError(error))).toEqual(expectedState);
    });


});
