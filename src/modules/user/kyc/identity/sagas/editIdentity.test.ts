import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import {
    editIdentity,
    editIdentityData,
    editIdentityError,
} from '../actions';


describe('Edit Identity Saga', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
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

    const fakeError = {
        code: 500,
        message: ['Server error'],
    };

    const confirmIdentityPayload = {
        first_name: 'first_name',
        last_name: 'last_name',
        dob: 'dob',
        address: 'address',
        postcode: 'postcode',
        city: 'city',
        country: 'country',
        metadata: `{'nationality': 'nationality'}`,
    };

    const confirmIdentityResponse = {
        message: 'successfull upload',
    };

    const mockEditIdentity = () => {
        mockAxios.onPut(`/resource/profiles`).reply(200, confirmIdentityResponse);
    };

    const expectedActionsFetch = [editIdentity(confirmIdentityPayload), editIdentityData(confirmIdentityResponse)];
    const expectedActionsError = [editIdentity(confirmIdentityPayload), editIdentityError(fakeError)];

    it('should edit identity data in success flow', async () => {
        mockEditIdentity();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(editIdentity(confirmIdentityPayload));
        return promise;
    });

    it('should trigger edit identity error', async () => {
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
        store.dispatch(editIdentity(confirmIdentityPayload));
        return promise;
    });
});
