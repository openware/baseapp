import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { sendIdentity } from './actions';

const debug = false;

describe('KYC - Identity', () => {
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

    describe('Send indentity information', () => {
        const confirmIdentityResponse = {
            message: 'Confirmed',
        };

        const confirmIdentityPayload = {
            first_name: 'first_name',
            last_name: 'last_name',
            dob: 'dob',
            address: 'address',
            postcode: 'postcode',
            city: 'city',
            country: 'country',
        };

        const expectedConfirmIdentityFetch = {
            type: 'identity/SEND_IDENTITY_FETCH',
            payload: confirmIdentityPayload,
        };

        const expectedConfirmIdentityData = {
            type: 'identity/SEND_IDENTITY_DATA',
            payload: confirmIdentityResponse,
        };

        const expectedConfirmIdentityError = {
            type: 'identity/SEND_IDENTITY_ERROR',
            payload: {
                code: 500,
                message: 'Server error',
            },
        };

        const expectedCallErrorHandler = {
            error: {
              code: 500,
              message: 'Server error',
            },
            type: 'error/ERROR_FETCH',
        };

        const mockConfirmIdentityFetch = () => {
            mockAxios.onPost(`/resource/profiles`).reply(200, confirmIdentityResponse);
        };

        it('should fetch confirm identity data', async () => {
            mockConfirmIdentityFetch();
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedConfirmIdentityFetch);
                        expect(actions[1]).toEqual(expectedConfirmIdentityData);
                        resolve();
                    }
                });
            });
            store.dispatch(sendIdentity(confirmIdentityPayload));
            return promise;
        });

        it('should handle confirm identity error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 3) {
                        expect(actions[0]).toEqual(expectedConfirmIdentityFetch);
                        expect(actions[1]).toEqual(expectedConfirmIdentityError);
                        expect(actions[2]).toEqual(expectedCallErrorHandler);
                        resolve();
                    }
                });
            });
            store.dispatch(sendIdentity(confirmIdentityPayload));
            return promise;
        });
    });
});
