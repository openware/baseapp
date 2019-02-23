import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import {
    marketsData,
    marketsError,
    marketsFetch,
    marketsTickersData,
    marketsTickersError,
    marketsTickersFetch,
    setCurrentMarketIfUnset,
} from '../actions';
import { Market, Ticker } from '../types';

// tslint:disable no-any no-magic-numbers
describe('Saga: marketsFetchSaga', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const fakeMarkets: Market[] = [
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

    const btcethTicker: Ticker = {
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

    const btcusdTicker: Ticker = {
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

    const marketsTickersListResponse = {
        btceth: {
            at: 1547559181,
            ticker: btcethTicker,
        },
        btcusd: {
            at: 1547559181,
            ticker: btcusdTicker,
        },
    };

    const fakeError = {
        code: 500,
        message: ['Server error'],
    };

    const mockMarkets = () => {
        mockAxios.onGet('/public/markets').reply(200, fakeMarkets);
    };

    const mockTickers = () => {
        mockAxios.onGet('/public/markets/tickers').reply(200, marketsTickersListResponse);
    };

    const marketsTickersList = {
        btceth: btcethTicker,
        btcusd: btcusdTicker,
    };

    it('should fetch markets', async () => {
        const expectedActions = [marketsFetch(), marketsData(fakeMarkets), setCurrentMarketIfUnset(fakeMarkets[0])];
        mockMarkets();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(marketsFetch());
        return promise;
    });

    it('should trigger an error on market fetch', async () => {
        const expectedActions = [marketsFetch(), marketsError(fakeError)];
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(marketsFetch());
        return promise;
    });

    it('should fetch tickers', async () => {
        const expectedActions = [marketsTickersFetch(), marketsTickersData(marketsTickersList)];
        mockTickers();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(marketsTickersFetch());
        return promise;
    });

    it('should trigger an error on tickers fetch', async () => {
        const expectedActions = [marketsTickersFetch(), marketsTickersError(fakeError)];
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(marketsTickersFetch());
        return promise;
    });
});
