import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../helpers/jest';
import { changeForgotPasswordFetch, changeForgotPasswordSuccess,forgotPasswordError } from '../actions';


describe('Change Forgot Password Saga', () => {
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
    code: 422,
    message: 'User doesnt exist or has already been activated',
  };

  const fakeNetworkError = {
    code: 500,
    message: 'Server error',
  };

  const fakeNewPassword = {
    reset_password_token: '12345671234567',
    password: 'password',
    confirm_password: 'password',
  };

  const mockChangeForgotPassword = () => {
    mockAxios.onPost('/identity/users/password/confirm_code').reply(200);
  };

  const mockChangeForgotPasswordError = () => {
    mockAxios.onPost('/identity/users/password/confirm_code').reply(422, {
      error: 'User doesnt exist or has already been activated',
    });
  };

  const expectedActionsFetch = [changeForgotPasswordFetch(fakeNewPassword), changeForgotPasswordSuccess()];
  const expectedActionsNetworkError = [changeForgotPasswordFetch(fakeNewPassword), forgotPasswordError(fakeNetworkError)];
  const expectedActionsError = [changeForgotPasswordFetch(fakeNewPassword), forgotPasswordError(fakeError)];

  it('should change forgotten password in success flow', async () => {
    mockChangeForgotPassword();
    const promise = new Promise(resolve => {
      store.subscribe(() => {
        const actions = store.getActions();
        if (actions.length === expectedActionsFetch.length) {
          expect(actions).toEqual(expectedActionsFetch);
          resolve();
        }
      });
    });

    store.dispatch(changeForgotPasswordFetch(fakeNewPassword));
    return promise;
  });

  it('should change forgotten password in error flow', async () => {
    mockChangeForgotPasswordError();
    const promise = new Promise(resolve => {
      store.subscribe(() => {
        const actions = store.getActions();
        if (actions.length === expectedActionsError.length) {
          expect(actions).toEqual(expectedActionsError);
          resolve();
        }
      });
    });

    store.dispatch(changeForgotPasswordFetch(fakeNewPassword));
    return promise;
  });

  it('should request forgotten password in network error', async () => {
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
    store.dispatch(changeForgotPasswordFetch(fakeNewPassword));
    return promise;
  });
});
