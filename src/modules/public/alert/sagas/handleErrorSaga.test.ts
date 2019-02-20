import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../../';
import { Cryptobase, defaultConfig } from '../../../../api';
import { setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { RESET_USER } from '../../../user/profile/constants';
import { pushAlertError } from '../actions';
import { ALERT_DELETE_ERROR, ALERT_ERROR_DATA, ALERT_ERROR_PUSH } from '../constants';

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

    describe('Fetch handle error', () => {
        const errorCodeAccountNotActive = { code: 401, message: ['identity.session.not_active'] };

        const expectedErrorActionUnauthorized = {
            type: ALERT_ERROR_PUSH,
            error: errorCodeAccountNotActive,
        };

        const expectedUserProfileReset = {
            type: RESET_USER,
        };

        const expectedAlertErrorData = {
            type: ALERT_ERROR_DATA,
            error: {
                code: 401,
                message: ['identity.session.not_active'],
            },
        };

        const expectedDeleteError = {
            type: ALERT_DELETE_ERROR,
        };

        it('should handle error', async () => {
            const promise = new Promise(resolve => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    const lastAction = actions.slice(-1)[0];

                    switch (actions.length) {
                        case 1:
                            expect(lastAction).toEqual(expectedErrorActionUnauthorized);
                            break;

                        case 2:
                            expect(lastAction).toEqual(expectedUserProfileReset);
                            break;

                        case 3:
                            expect(lastAction).toEqual(expectedAlertErrorData);
                            break;

                        case 4:
                            expect(lastAction).toEqual(expectedDeleteError);
                            setTimeout(resolve, 0.01);
                            break;

                        default:
                            fail(`Unexpected action: ${JSON.stringify(lastAction)}`);
                            break;
                    }
                });
            });
            store.dispatch(pushAlertError(errorCodeAccountNotActive));
            return promise;
        });
    });
});
