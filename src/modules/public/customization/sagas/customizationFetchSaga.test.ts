import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { customizationData, customizationError, customizationFetch } from '../actions';
import { CustomizationDataInterface } from '../types';

describe('Saga: customizationFetchSaga', () => {
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

    const fakeCustomization: CustomizationDataInterface = {
        settings: '{\"theme_id\":\"1\",\"theme_colors\":{\"light\":[],\"dark\":[]}}',
    };

    const mockCustomization = () => {
        mockAxios.onGet('/customization').reply(200, fakeCustomization);
    };

    const error: CommonError = {
        message: ['Server error'],
        code: 500,
    };

    it('should fetch customization', async () => {
        const expectedActions = [
            customizationFetch(),
            customizationData(fakeCustomization),
        ];

        mockCustomization();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });

        store.dispatch(customizationFetch());

        return promise;
    });


    it('should trigger an error on customization fetch', async () => {
        const expectedActions = [
            customizationFetch(),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: customizationError,
                },
            }),
        ];

        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    resolve();
                }
            });
        });
        store.dispatch(customizationFetch());

        return promise;
    });
});
