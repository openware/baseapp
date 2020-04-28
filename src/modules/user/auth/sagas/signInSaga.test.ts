import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, signUpRequireVerification } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { userData } from '../../profile';
import { signIn, signInError, signInRequire2FA } from '../actions';


describe('SignIn saga', () => {
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

    const fake2FAError = { code: 403, message: ['Require 2fa'] };

    const fakeCredentials = { email: 'john.barong@gmail.com', password: '123123', data: '{\'language\':\'en\'}' };

    const fakeUser = {
        email: 'admin@barong.io',
        uid: 'ID26C901376F',
        role: 'admin',
        level: 3,
        otp: false,
        state: 'active',
        profiles: [],
    };

    const mockSignIn = () => {
        mockAxios.onPost('/identity/sessions').reply(200, fakeUser);
    };

    const mockSignInError = () => {
        mockAxios.onPost('/identity/sessions').reply(403, fake2FAError);
    };

    const expectedActionsFetch = [
        signIn(fakeCredentials),
        userData({user: fakeUser}),
        signUpRequireVerification({ requireVerification: fakeUser.state === 'pending' }),
        signInRequire2FA({ require2fa: false }),
    ];
    const expectedActions2FAError = [
        signIn(fakeCredentials),
        signInRequire2FA({ require2fa: true }),
    ];
    const expectedActionsNetworkError = [
        signIn(fakeCredentials),
        signInError({ code: 500, message: ['Server error'] }),
    ];

    it('should signin user in success flow', async () => {
        mockSignIn();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(signIn(fakeCredentials));

        return promise;
    });

    it('should trigger 2fa error', async () => {
        mockSignInError();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions2FAError.length) {
                    expect(actions).toEqual(expectedActions2FAError);
                    resolve();
                }
            });
        });
        store.dispatch(signIn(fakeCredentials));

        return promise;
    });

    it('should trigger network error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsNetworkError.length) {
                    expect(actions).toEqual(expectedActionsNetworkError);
                    resolve();
                }
            });
        });
        store.dispatch(signIn(fakeCredentials));

        return promise;
    });
});
