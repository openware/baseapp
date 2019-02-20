import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../../';
import { Cryptobase, defaultConfig } from '../../../../api';
import { setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { pushAlertSuccess } from '../actions';
import { ALERT_SUCCESS_DATA, ALERT_SUCCESS_PUSH } from '../constants';

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
        Cryptobase.config = {
            ...defaultConfig,
            msAlertDisplayTime: '0.01',
        };
    });

    describe('Fetch success', () => {
        const successMessage = 'success';

        const expectedErrorActionUnauthorized = {
            type: ALERT_SUCCESS_PUSH,
            success: 'success',
        };

        const expectedHandleSuccess = {
            type: ALERT_SUCCESS_DATA,
            success: 'success',
        };
        const expectedDeleteSuccess = {
            type: 'alert/DELETE_SUCCESS',
        };
        it('should handle success', async () => {
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];

                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual(expectedErrorActionUnauthorized);
                            break;

                        case 2:
                            expect(lastAction).toEqual(expectedHandleSuccess);
                            break;

                        case 3:
                            expect(lastAction).toEqual(expectedDeleteSuccess);
                            setTimeout(resolve, 0.01);
                            break;

                        default:
                            fail(`Unexpected action: ${JSON.stringify(lastAction)}`);
                            break;
                    }
                });
            });
            store.dispatch(pushAlertSuccess(successMessage));
            return promise;
        });
    });
});
