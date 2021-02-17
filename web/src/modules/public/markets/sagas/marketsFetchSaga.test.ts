import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
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

describe('Markets & Tickers sagas', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
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
            base_unit: 'usd',
            quote_unit: 'btc',
            min_price: '0.0',
            max_price: '0.0',
            min_amount: '0.0',
            amount_precision: 4,
            price_precision: 4,
        },
        {
            id: 'btceth',
            name: 'BTC/ETH',
            base_unit: 'btc',
            quote_unit: 'eth',
            min_price: '0.0',
            max_price: '0.0',
            min_amount: '0.0',
            amount_precision: 4,
            price_precision: 4,
        },
    ];

    const btcethTicker: Ticker = {
        amount: '5.0',
        low: '0.0',
        high: '0.0',
        open: 1,
        last: '0.0',
        volume: '10.0',
        avg_price: '1.42857142857142857143',
        price_change_percent: '-100.00%',
    };

    const btcusdTicker: Ticker = {
        amount: '10.0',
        low: '0.0',
        high: '0.0',
        open: 1,
        last: '0.0',
        avg_price: '0.875',
        price_change_percent: '-100.00%',
        volume: '15.5',
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

    const error: CommonError = {
        message: ['Server error'],
        code: 500,
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
        mockNetworkError(mockAxios);
        const expectedActions = [
            marketsFetch(),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: marketsError,
                },
            }),
        ];
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
            });
        });
        store.dispatch(marketsFetch());

        return promise;
    });

    it('should fetch tickers', async () => {
        mockTickers();

        const expectedActions = [marketsTickersFetch(), marketsTickersData(marketsTickersList)];
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
        mockNetworkError(mockAxios);

        const expectedActions = [
            marketsTickersFetch(),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: marketsTickersError,
                },
            }),
        ];
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
            });
        });
        store.dispatch(marketsTickersFetch());

        return promise;
    });
});
