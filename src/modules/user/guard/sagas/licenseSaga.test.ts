import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { alertData, alertPush, rootSaga } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { licenseData, licenseError, licenseFetch } from '../actions';

describe('License saga', () => {
    let mockAxios: MockAdapter;
    let sagaMiddleware: SagaMiddleware<{}>;
    let store: MockStoreEnhanced;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const response = { token: 'foo' };

    const mockLicenseFetch = () => {
        mockAxios.onPut('/activate').reply(200, response);
    };

    it('should get license', async () => {
        const expectedActionsFetch = [
            licenseFetch(),
            licenseData({ token: response.token }),
        ];

        mockLicenseFetch();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(licenseFetch());
        return promise;
    });

    it('should handle network error', async () => {
        const expectedActionsNetworkError = [
            licenseFetch(),
            licenseError(),
            alertPush({
                code: 500,
                message: ['Server error'],
                type: 'error',
            }),
            alertData({
                code: 500,
                message: ['Server error'],
                type: 'error',
            }),
        ];

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
        store.dispatch(licenseFetch());
        return promise;
    });
});
