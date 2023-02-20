import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { CommonError } from '../../../../types';
import { sendAddresses, sendAddressesData, sendAddressesError } from '../actions';

const debug = false;

describe('KYC - Addresses', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const payloadFormData = new FormData();

    const confirmAddressesResponse = {
        message: 'Success',
    };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const mockConfirmAddressesFetch = () => {
        mockAxios.onPost(`/resource/addresses`).reply(200, confirmAddressesResponse);
    };

    const expectedActionsSuccess = [sendAddresses(payloadFormData), sendAddressesData(confirmAddressesResponse)];

    const expectedActionsError = [
        sendAddresses(payloadFormData),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: sendAddressesError,
            },
        }),
    ];

    it('should fetch sending addresses data', async () => {
        mockConfirmAddressesFetch();
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsSuccess.length) {
                    expect(actions).toEqual(expectedActionsSuccess);
                    resolve();
                }
            });
        });
        store.dispatch(sendAddresses(payloadFormData));

        return promise;
    });

    it('should fetch sending addresses error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise<void>((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(sendAddresses(payloadFormData));

        return promise;
    });
});
