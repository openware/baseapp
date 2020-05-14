import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { sendAddresses } from '../actions';

const debug = false;

describe('KYC - Addresses', () => {
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

    describe('Send addresses', () => {
        const payloadFormData = new FormData();

        const confirmAddressesResponse = {
            message: 'Success',
        };

        const expectedConfirmAddressesFetch = {
            type: 'addresses/SEND_ADDRESSES_FETCH',
            payload: payloadFormData,
        };

        const expectedConfirmAddressesData = {
            type: 'addresses/SEND_ADDRESSES_DATA',
            payload: confirmAddressesResponse,
        };

        const expectedConfirmAddressesError = {
            type: 'addresses/SEND_ADDRESSES_ERROR',
            payload: {
                code: 500,
                message: ['Server error'],
            },
        };

        const expectedCallErrorHandler = {
            payload: {
                type: 'error',
                code: 500,
                message: ['Server error'],
            },
            type: 'alert/ALERT_PUSH',
        };

        const mockConfirmAddressesFetch = () => {
            mockAxios.onPost(`/resource/addresses`).reply(200, confirmAddressesResponse);
        };

        it('should fetch sending addresses data', async () => {
            mockConfirmAddressesFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedConfirmAddressesFetch);
                        expect(actions[1]).toEqual(expectedConfirmAddressesData);
                        resolve();
                    }
                });
            });
            store.dispatch(sendAddresses(payloadFormData));

            return promise;
        });

        it('should fetch sending addresses error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedConfirmAddressesFetch);
                        expect(actions[1]).toEqual(expectedConfirmAddressesError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(sendAddresses(payloadFormData));

            return promise;
        });
    });
});
