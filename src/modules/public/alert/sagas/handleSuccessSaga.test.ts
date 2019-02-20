import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../../';
import { setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { pushAlertSuccess } from '../actions';

const debug = false;

describe('Error handler', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    afterEach(() => {
        mockAxios.reset();
    });

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, debug)();
        sagaMiddleware.run(rootSaga);
    });

    describe('Fetch success', () => {
        const successMessage = 'success';

        const expectedErrorActionUnauthorized = {
            type: 'alert/SUCCESS_FETCH',
            success: 'success',
        };

        const expectedHandleSuccess = {
            type: 'alert/SUCCESS_DATA',
            success: 'success',
        };

        it('should handle success', async () => {
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === 2) {
                        expect(actions[0]).toEqual(expectedErrorActionUnauthorized);
                        expect(actions[1]).toEqual(expectedHandleSuccess);
                        resolve();
                    }
                });
            });
            store.dispatch(pushAlertSuccess(successMessage));
            return promise;
        });
    });
});
