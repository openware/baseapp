import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { changePasswordData, changePasswordError, changePasswordFetch } from '../actions';


describe('Module: Change password', () => {
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

    const fakePassword =  {
        old_password: '123123',
        new_password: '123',
        confirm_password: '123',
    };

    const mockChangePassword = () => {
        mockAxios.onPut('/resource/users/password').reply(200);
    };

    const expectedActionsFetch = [changePasswordFetch(fakePassword), changePasswordData()];
    const expectedActionsError = [changePasswordFetch(fakePassword), changePasswordError(fakeError)];

    it('should change password in success flow', async () => {
        mockChangePassword();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(changePasswordFetch(fakePassword));

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
        store.dispatch(changePasswordFetch(fakePassword));

        return promise;
    });
});
