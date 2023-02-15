import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { rootSaga, sendError } from '../../../../modules/index';
import { CommonError } from '../../../types';
import { docTradeUserApiData, docTradeUserApiError, docTradeUserApiFetch } from '../actions';
import { DocTradeUserApiDataInterface } from '../types';

const debug = false;

describe('Documentation trade user api', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware;
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

    describe('Fetch trade user api', () => {
        const fakeResponse: DocTradeUserApiDataInterface = {
            info: {
                title: 'Peatio User API v2',
                description: 'API for Peatio application.',
                contact: {
                    name: 'openware.com',
                    email: 'hello@openware.com',
                    url: 'https://www.openware.com',
                },
                license: {
                    url: 'https://github.com/openware/peatio/blob/master/LICENSE.md',
                },
                version: '2.6.0-89e3acd',
            },
            swagger: '2.0',
            produces: ['application/json'],
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'JWT',
                    in: 'header',
                },
            },
            host: 'localhost:3000',
            basePath: '/api/v2/peatio',
            tags: [
                {
                    name: 'api',
                    description: 'Operations about apis',
                },
            ],
            paths: {},
            definitions: {},
        };

        const fakeError: CommonError = {
            code: 500,
            message: ['Server error'],
        };

        const mockDocTradeUserApiFetch = () => {
            mockAxios.onGet('/swagger').reply(200, fakeResponse);
        };

        const expectedActionsFetch = [docTradeUserApiFetch(), docTradeUserApiData(fakeResponse)];

        const expectedActionsError = [
            docTradeUserApiFetch(),
            sendError({
                error: fakeError,
                processingType: 'alert',
                extraOptions: {
                    actionError: docTradeUserApiError,
                },
            }),
        ];

        it('should fetch deposits in success flow', async () => {
            mockDocTradeUserApiFetch();

            const promise = new Promise((resolve) => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsFetch.length) {
                        expect(actions).toEqual(expectedActionsFetch);
                        resolve();
                    }
                });
            });
            store.dispatch(docTradeUserApiFetch());

            return promise;
        });

        it('should handle fetch deposits error', async () => {
            mockNetworkError(mockAxios);
            const promise = new Promise((resolve) => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsError.length) {
                        expect(actions).toEqual(expectedActionsError);
                        resolve();
                    }
                });
            });
            store.dispatch(docTradeUserApiFetch());

            return promise;
        });
    });
});
