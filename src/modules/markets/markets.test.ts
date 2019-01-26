import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../helpers/jest';
import { marketsFetch, marketsTickersFetch } from './';

const debug = false;

describe('Markets', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });


    describe('Fetch public markets informations', () => {
        const marketsList = [
            {
                id: 'ethusd',
                name: 'ETH/USD',
                ask_unit: 'eth',
                bid_unit: 'usd',
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
                id: 'trsteth',
                name: 'TRST/ETH',
                ask_unit: 'trst',
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
            {
                id: 'kyneth',
                name: 'KYN/ETH',
                ask_unit: 'kyn',
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

        const mockMarkets = () => {
            mockAxios.onGet('/public/markets').reply(200, marketsList);
        };

        const expectedMarketFetch = { type: 'markets/MARKETS_FETCH' };

        it('should fetch wallets', async () => {
            const expectedMarketData = { type: 'markets/MARKETS_DATA', payload: marketsList };

            mockMarkets();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedMarketFetch);
                        expect(actions[1]).toEqual(expectedMarketData);
                        resolve();
                    }
                });
            });
            store.dispatch(marketsFetch());
            return promise;
        });

        it('should trigger an error', async () => {
            const expectedMarketError = {
                type: 'markets/MARKETS_ERROR',
                payload: {
                    code: 500,
                    message: 'Server error',
                },
            };

            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedMarketFetch);
                        expect(actions[1]).toEqual(expectedMarketError);
                        resolve();
                    }
                });
            });
            store.dispatch(marketsFetch());
            return promise;
        });
    });

    describe('Fetch markets tickers', () => {
        const bchzarTicker = {
            buy: '120.0',
            high: '135.0',
            last: '125.0',
            low: '115.0',
            sell: '130.0',
            vol: '12.0',
        };
        const btczarTicker = {
            buy: '200.0',
            sell: '300.0',
            low: '150.0',
            high: '350.0',
            last: '250.0',
            vol: '20.0',
        };
        const marketsTickersListResponse = {
            bchzar: {
                at: 1547559181,
                ticker: bchzarTicker,
            },
            btczar: {
                at: 1547559181,
                ticker: btczarTicker,
            },
        };

        const mockMarketsTickers = () => {
            mockAxios.onGet('/public/markets/tickers').reply(200, marketsTickersListResponse);
        };

        it('should fetch market tickers', async () => {
            const marketsTickersList = {
                bchzar: bchzarTicker,
                btczar: btczarTicker,
            };

            const expectedMarketsTickersFetch = { type: 'markets/MARKET_TICKERS_FETCH' };
            const expectedMarketsTickersData = {
                type: 'markets/MARKET_TICKERS_DATA',
                payload: marketsTickersList,
            };

            mockMarketsTickers();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedMarketsTickersFetch);
                        expect(actions[1]).toEqual(expectedMarketsTickersData);
                        resolve();
                    }
                });
            });
            store.dispatch(marketsTickersFetch());
            return promise;
        });

        it('should report error', async () => {
            const expectedMarketsTickersFetch = { type: 'markets/MARKET_TICKERS_FETCH' };
            const expectedMarketsTickersError = { type: 'markets/MARKET_TICKERS_ERROR', payload: { code: 500, message: 'Server error' } };

            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedMarketsTickersFetch);
                        expect(actions[1]).toEqual(expectedMarketsTickersError);
                        resolve();
                    }
                });
            });
            store.dispatch(marketsTickersFetch());
            return promise;
        });

    });
});
