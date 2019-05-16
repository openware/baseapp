import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import {
    profileIdentityData,
    profileIdentityError,
    profileIdentityFetch,
} from '../actions';

describe('Module: ProfileIdentity', () => {
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

    const fakeIdentity = {
        first_name: 'qwq',
        last_name: 'qw',
        dob: 'qwqw',
        address: 'qwq',
        postcode: 'qw',
        city: 'qwqwq',
        country: 'qwq',
    };

    const fakeData = {
        first_name: 'qwq',
        last_name: 'qw',
        dob: 'qwqw',
        address: 'qwq',
        postcode: 'qw',
        city: 'qwqwq',
        country: 'qwq',
        number: '380936898411',
    };

    const fakePhone = [{
      country: 'UA',
      number: '380936898411',
      validated_at: '2019-05-16T14:43:15.000Z',
    }];

    const mockProfileIdentity = () => {
        mockAxios.onGet('/resource/profiles/me').reply(200, fakeIdentity);
        mockAxios.onGet('/resource/phones').reply(200, fakePhone);
    };

    const expectedActionsFetch = [profileIdentityFetch(), profileIdentityData(fakeData)];
    const expectedActionsError = [profileIdentityFetch(), profileIdentityError(fakeError)];

    it('should fetch profileIdentity in success flow', async () => {
        mockProfileIdentity();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(profileIdentityFetch());
        return promise;
    });

    it('should trigger an error', async () => {
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
        store.dispatch(profileIdentityFetch());
        return promise;
    });
});
