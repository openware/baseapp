import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../../helpers/jest';
import { CommonError } from '../../../../types';
import { sendCode, sendCodeData, sendCodeError } from '../actions';

describe('Module: phone', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
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

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    const data = {
        phone_number: '12345678',
    };

    const mockLabel = () => {
        mockAxios.onPost('/resource/phones').reply(200);
    };

    const expectedActionsFetch = [sendCode(data), sendCodeData()];
    const expectedActionsError = [
        sendCode(data),
        sendError({
            error,
            processingType: 'alert',
            extraOptions: {
                actionError: sendCodeError,
            },
        }),
    ];

    it('should fetch label in success flow', async () => {
        mockLabel();
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsFetch.length) {
                    expect(actions).toEqual(expectedActionsFetch);
                    resolve();
                }
            });
        });

        store.dispatch(sendCode(data));

        return promise;
    });

    it('should trigger an error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise((resolve) => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActionsError.length) {
                    expect(actions).toEqual(expectedActionsError);
                    resolve(data);
                }
            });
        });
        store.dispatch(sendCode(data));

        return promise;
    });
});
