import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { alertPush, rootSaga } from '../../../../../modules/index';
import {
    ieoOrderExecuteData,
    ieoOrderExecuteError,
    ieoOrderExecuteFetch,
    OrderIEOExecution,
} from '../actions';
import { OrderIEOData } from '../types';

const debug = false;

describe('IEO Order Execute', () => {
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

    describe('Execute IEO Order data', () => {
        const fakePayload: OrderIEOExecution = {
            sale: 1,
            quote_unit: 'xrp',
            contribution: 10,
        };

        const fakeOrder: OrderIEOData = {
            id: 1,
            sale_name: 'Test',
            sale_pair_id: 672,
            uid: 'UID6D6B9493F0',
            contribution: '27.3941',
            executed: '0.0',
            refunded: '27.3941',
            tokens_received: '0.0',
            commission_rate: '0.0004',
            commission_amount: '0.0',
            state: 'cancelled',
            created_at: '2019-10-03T11:51:08.000Z',
            updated_at: '2019-10-03T11:51:08.000Z',
            tokens_ordered: '0.3954',
            ratio: '0.2',
            base_currency: 'eth',
            quote_currency: 'btc',
        };

        const fakeError = {
            type: 'error',
            code: 500,
            message: ['Server error'],
        };

        const mockIEOOrderFetch = () => {
            mockAxios.onPost('/private/ieo/orders').reply(200, fakeOrder);
        };

        const expectedActionsSuccess = [
            ieoOrderExecuteFetch(fakePayload),
            ieoOrderExecuteData(fakeOrder),
            alertPush({ message: ['success.order.created'], type: 'success'}),
        ];

        const expectedActionsError = [
            ieoOrderExecuteFetch(fakePayload),
            ieoOrderExecuteError({ code: 500, message: ['Server error'] }),
            alertPush(fakeError),
        ];

        it('should execute IEO order in success flow', async () => {
            mockIEOOrderFetch();

            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsSuccess.length) {
                        expect(actions).toEqual(expectedActionsSuccess);
                        resolve();
                    }
                });
            });
            store.dispatch(ieoOrderExecuteFetch(fakePayload));
            return promise;
        });

        it('should execute IEO order error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsError.length) {
                        expect(actions).toEqual(expectedActionsError);
                        resolve();
                    }
                });
            });
            store.dispatch(ieoOrderExecuteFetch(fakePayload));
            return promise;
        });
    });
});
