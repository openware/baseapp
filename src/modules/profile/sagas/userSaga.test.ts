import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import {
    userData,
    userError,
    userFetch,
} from '../actions';


describe('Module: User', () => {
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
        message: 'Server error',
    };

    const fakeUser = {
        email: 'admin@barong.io',
        uid: 'ID26C901376F',
        role: 'admin',
        level: 3,
        otp: false,
        state: 'active',
    };

    const fakeUserActivity = {
        id: 966,
        user_id: 59,
        user_ip: '195.214.197.210',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        topic: 'session',
        action: 'login',
        result: 'succeed',
        created_at: '2019-01-28T09:28:03.000Z',
    };

    const mockUser = () => {
        mockAxios.onGet('/resource/users/me').reply(200, fakeUser);
    };

    const mockUserActivity = () => {
        mockAxios.onGet('/resource/users/activity/all').reply(200, [fakeUserActivity]);
    };

    const expectedActionsFetch = [userFetch(), userData({user: fakeUser, activity: [fakeUserActivity]})];
    const expectedActionsError = [userFetch(), userError(fakeError)];

    it('should fetch user in success flow', async () => {
        mockUser();
        mockUserActivity();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(userFetch());
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
        store.dispatch(userFetch());
        return promise;
    });
});
