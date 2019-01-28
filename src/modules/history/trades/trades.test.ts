import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { getTimezone, setTimezone } from '../../../helpers/timezone';
import { tradesFetch } from './actions';
import { TRADES_DATA, TRADES_ERROR, TRADES_FETCH } from './constants';
import { PrivateTrade } from './types';

const debug = false;

// tslint:disable no-console
describe('History/Trades', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;
    let tz;

    afterEach(() => {
        mockAxios.reset();
        setTimezone(tz);
    });

    beforeEach(() => {
        tz = getTimezone();
        setTimezone('America/Los_Angeles');
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('Fetch trades history', () => {
        const trades: PrivateTrade[] = [
            {
                id: 162389,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'xrpbtc',
                created_at: '2018-12-14T12:00:47+01:00',
                side: 'bid',
                maker_type: 'buy',
            },
            {
                id: 162388,
                price: '0.3',
                volume: '0.03',
                funds: '0.009',
                market: 'btceur',
                created_at: '2018-12-14T11:45:42+01:00',
                side: 'bid',
                maker_type: 'sell',
            },
            {
                id: 162387,
                price: '0.3',
                volume: '0.03',
                funds: '0.009',
                market: 'xrpbtc',
                created_at: '2018-12-14T11:32:42+01:00',
                side: 'ask',
                maker_type: 'buy',
            },
            {
                id: 121,
                price: '0.3',
                volume: '0.001',
                funds: '0.0003',
                market: 'btceur',
                created_at: '2018-11-14T12:00:47+01:00',
                side: 'bid',
                maker_type: 'sell',
            },
        ];

        const mockTrades = () => {
            mockAxios.onGet('/api/v2/peatio/market/trades').reply(200, trades);
        };

        const expectedTradesFetch = {
            type: TRADES_FETCH,
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
            store.dispatch(tradesFetch());
            return promise;
        });

        it('should trigger an error action', async () => {
            const expectedTradesError = {
                type: TRADES_ERROR,
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
                        expect(actions[0]).toEqual(expectedTradesFetch);
                        expect(actions[1]).toEqual(expectedTradesError);
                        resolve();
                    }
                });
            });
            store.dispatch(tradesFetch());
            return promise;
        });
    });

});
