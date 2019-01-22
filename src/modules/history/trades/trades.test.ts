import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { tradesFetch } from './actions';
import { TRADES_DATA, TRADES_ERROR, TRADES_FETCH } from './constants';

const debug = false;

// tslint:disable no-console
describe('History/Trades', () => {
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

    describe('Fetch trades history', () => {
        const marketsList = [
            {
                id: 'btceur',
                name: 'BTC/EUR',
            },
            {
                id: 'xrpbtc',
                name: 'XRP/BTC',
            },
        ];
        const tradesXrpBtc = [
            {
                id: 162389,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'xrpbtc',
                created_at: '2018-12-14T12:00:47+01:00',
                side: 'bid',
            },
            {
                id: 162387,
                price: '0.3',
                volume: '0.03',
                funds: '0.009',
                market: 'xrpbtc',
                created_at: '2018-12-14T11:32:42+01:00',
                side: 'ask',
            },
        ];

        const tradesBtcEur = [
            {
                id: 121,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'btceur',
                created_at: '2018-11-14T12:00:47+01:00',
                side: 'bid',
            },
            {
                id: 162388,
                price: '0.3',
                volume: '0.03',
                funds: '0.009',
                market: 'btceur',
                created_at: '2018-12-14T11:45:42+01:00',
                side: 'bid',
            },
        ];

        const trades = [
            {
                id: 162389,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'xrpbtc',
                created_at: '2018-12-14T12:00:47+01:00',
                side: 'bid',
            },
            {
                id: 162388,
                price: '0.3',
                volume: '0.03',
                funds: '0.009',
                market: 'btceur',
                created_at: '2018-12-14T11:45:42+01:00',
                side: 'bid',
            },
            {
                id: 162387,
                price: '0.3',
                volume: '0.03',
                funds: '0.009',
                market: 'xrpbtc',
                created_at: '2018-12-14T11:32:42+01:00',
                side: 'ask',
            },
            {
                id: 121,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'btceur',
                created_at: '2018-11-14T12:00:47+01:00',
                side: 'bid',
            },
        ];

        const mockTrades = () => {
            mockAxios.onGet('/api/v2/peatio/market/trades?market=xrpbtc').reply(200, tradesXrpBtc);
            mockAxios.onGet('/api/v2/peatio/market/trades?market=btceur').reply(200, tradesBtcEur);
        };

        const expectedTradesFetch = {
            type: TRADES_FETCH,
            payload: marketsList,
        };

        it('should fetch wallets', async () => {
            const expectedTradesData = {
                type: TRADES_DATA,
                payload: trades,
            };

            mockTrades();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedTradesFetch);
                        expect(actions[1]).toEqual(expectedTradesData);
                        resolve();
                    }
                });
            });
            store.dispatch(tradesFetch(marketsList));
            return promise;
        });

        it('should trigger an error action', async () => {
            const expectedTradesError = {
                type: TRADES_ERROR,
                payload: 'Server error',
            };

            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedTradesFetch);
                        expect(actions[1]).toEqual(expectedTradesError);
                        resolve();
                    }
                });
            });
            store.dispatch(tradesFetch(marketsList));
            return promise;
        });
    });

});
