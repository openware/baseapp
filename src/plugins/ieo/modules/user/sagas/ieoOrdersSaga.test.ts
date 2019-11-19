import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { alertPush, rootSaga } from '../../../../../modules/index';
import {
    ieoOrdersData,
    ieoOrdersError,
    ieoOrdersFetch,
} from '../actions';
import { OrderIEOData } from '../types';

const debug = false;

describe('IEO Orders Fetch', () => {
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

    describe('Execute IEO Orders data', () => {
        const fakePayload: OrderIEOData[] = [
            {
                id: 1,
                sale_name: 'Test1',
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
                ratio: '0.31',
                base_currency: 'eth',
                quote_currency: 'btc',
            },
            {
                id: 2,
                sale_name: 'Test2',
                sale_pair_id: 321,
                uid: 'UID6D6B941233',
                contribution: '19.4323',
                executed: '0.0',
                refunded: '19.4323',
                tokens_received: '0.0',
                commission_rate: '0.0005',
                commission_amount: '0.0',
                state: 'cancelled',
                created_at: '2019-10-05T12:51:08.000Z',
                updated_at: '2019-10-05T12:51:08.000Z',
                tokens_ordered: '0.5832',
                ratio: '0.31',
                base_currency: 'eth',
                quote_currency: 'btc',
            },
        ];

        const fakeError = {
            type: 'error',
            code: 500,
            message: ['Server error'],
        };

        const mockIEOOrderFetch = () => {
            mockAxios.onGet('/private/ieo/orders').reply(200, fakePayload);
        };

        const expectedActionsSuccess = [
            ieoOrdersFetch(),
            ieoOrdersData(fakePayload),
        ];

        const expectedActionsError = [
            ieoOrdersFetch(),
            ieoOrdersError({ code: 500, message: ['Server error'] }),
            alertPush(fakeError),
        ];

        it('should fetch IEO orders in success flow', async () => {
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
            store.dispatch(ieoOrdersFetch());

            return promise;
        });

        it('should handle fetch IEO orders error', async () => {
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
            store.dispatch(ieoOrdersFetch());

            return promise;
        });
    });
});
