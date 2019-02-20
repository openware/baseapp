import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { emailVerificationData, emailVerificationError, emailVerificationFetch } from '../actions';

describe('Email Verification Saga', () => {
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

    const fakeEmail = 'test@gmail.com';

    const mockResendVerificationEmail = () => {
        mockAxios.onPost('/identity/users/email/generate_code').reply(201);
    };

    const expectedActionsFetch = [emailVerificationFetch(fakeEmail), emailVerificationData()];
    const expectedActionsError = [emailVerificationFetch(fakeEmail), emailVerificationError(fakeError)];

    it('should resend confirmation email in success flow', async () => {
        mockResendVerificationEmail();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(emailVerificationFetch(fakeEmail));
        return promise;
    });

    it('should resend confirmation email an error', async () => {
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
        store.dispatch(emailVerificationFetch(fakeEmail));
        return promise;
    });
});
