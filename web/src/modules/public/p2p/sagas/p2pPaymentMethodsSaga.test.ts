import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../..';
import { CommonError } from '../../../types';
import { p2pPaymentMethodsData, p2pPaymentMethodsError, p2pPaymentMethodsFetch } from '../actions';
import { PaymentMethod } from '../types';

describe('P2P Payment Methods Fetch', () => {
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

    const fakeP2PPaymentMethods: PaymentMethod[] = [
        {
            id: 1,
            type: '',
            name: 'Universal',
            logo: '',
            options: {},
        },
        {
            id: 2,
            type: '',
            name: 'Universal',
            logo: '',
            options: {},
        },
    ];

    const mockP2PPaymentMethods = () => {
        mockAxios.onGet(`/public/payment_methods`).reply(200, fakeP2PPaymentMethods);
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedP2PPaymentMethodsActionsFetch = [
        p2pPaymentMethodsFetch(),
        p2pPaymentMethodsData(fakeP2PPaymentMethods),
    ];

    const expectedP2PPaymentMethodsActionsError = [
        p2pPaymentMethodsFetch(),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: p2pPaymentMethodsError,
            },
        }),
    ];

    it('should fetch p2pPaymentMethods in success flow', async () => {
        mockP2PPaymentMethods();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PPaymentMethodsActionsFetch.length) {
                    expect(actions).toEqual(expectedP2PPaymentMethodsActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(p2pPaymentMethodsFetch());

        return promise;
    });

    it('should trigger fetch p2pPaymentMethods error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PPaymentMethodsActionsError.length) {
                    expect(actions).toEqual(expectedP2PPaymentMethodsActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(p2pPaymentMethodsFetch());

        return promise;
    });
});
