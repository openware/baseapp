import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import cancelSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../..';
import { CommonError } from '../../../types';
import { cancelOfferError, cancelOffer } from '../actions';

describe('P2P CancelOffer', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = cancelSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const fakeCancelOfferPayload = {
        id: 1,
    };

    const mockP2PCancelOffer = () => {
        mockAxios.onPost(`/private/offers/1/cancel`).reply(200, { id: fakeCancelOfferPayload });
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const expectedP2PCancelOfferActionsFetch = [
        cancelOffer(fakeCancelOfferPayload),
    ];

    const expectedP2PCancelOfferActionsError = [
        cancelOffer(fakeCancelOfferPayload),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: cancelOfferError,
            },
        }),
    ];

    it('should fetch cancelOffer in success flow', async () => {
        mockP2PCancelOffer();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PCancelOfferActionsFetch.length) {
                    expect(actions).toEqual(expectedP2PCancelOfferActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(cancelOffer(fakeCancelOfferPayload));

        return promise;
    });

    it('should trigger fetch cancelOffer error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedP2PCancelOfferActionsError.length) {
                    expect(actions).toEqual(expectedP2PCancelOfferActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(cancelOffer(fakeCancelOfferPayload));

        return promise;
    });
});
