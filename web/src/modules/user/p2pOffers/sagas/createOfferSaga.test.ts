import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../..';
import { CommonError } from '../../../types';
import { createOfferData, createOfferError, createOffer } from '../actions';

describe('P2P CreateOffer', () => {
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

    const fakeCreateOfferPayload = {
        price: 1.2,
        amount: '5534.00',
        min_order_amount: '15',
        max_order_amount: '5000',
        base: 'usdt',
        quote: 'ngn',
        upm_id: ['1'],
        time_limit: '15',
        side: 'buy',
        description: '',
    };

    const mockP2PCreateOffer = () => {
        mockAxios.onPost(`/private/offers`).reply(200, fakeCreateOfferPayload);
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedP2PCreateOfferActionsFetch = [
        createOffer(fakeCreateOfferPayload),
        createOfferData(),
    ];

    const expectedP2PCreateOfferActionsError = [
        createOffer(fakeCreateOfferPayload),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: createOfferError,
            },
        }),
    ];

    it('should fetch createOffer in success flow', async () => {
        mockP2PCreateOffer();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PCreateOfferActionsFetch.length) {
                    expect(actions).toEqual(expectedP2PCreateOfferActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(createOffer(fakeCreateOfferPayload));

        return promise;
    });

    it('should trigger fetch createOffer error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PCreateOfferActionsError.length) {
                    expect(actions).toEqual(expectedP2PCreateOfferActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(createOffer(fakeCreateOfferPayload));

        return promise;
    });
});
