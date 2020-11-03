import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { rootSaga, sendError } from '../../../';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { getUserActivity, userActivityData, userActivityError } from '../actions';

const debug = false;

describe('User activity', () => {
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

    describe('Fetch user activity data', () => {
        const payload = [
            {
                id: 1,
                user_id: 1,
                user_ip: '195.214.197.210',
                user_agent:
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
                topic: 'session',
                action: 'login',
                result: 'succeed',
                data: null,
                created_at: '2019-01-22T15:08:36.000Z',
            },
        ];

        const fakeHeaders = { total: 1 };

        const fakeSuccessPayloadFirstPage = {
            list: payload,
            page: 0,
            total: fakeHeaders.total,
        };

        const fakeFetchPayloadFirstPage = {
            page: 0,
            limit: 2,
        };

        const error: CommonError = {
            code: 500,
            message: ['Server error'],
        };

        const mockUserActivityFetch = () => {
            mockAxios.onGet('/resource/users/activity/all?limit=2&page=1').reply(200, payload, fakeHeaders);
        };

        const expectedActionsFetchWithFirstPage = [
            getUserActivity(fakeFetchPayloadFirstPage),
            userActivityData(fakeSuccessPayloadFirstPage),
        ];

        const expectedActionsError = [
            getUserActivity(fakeFetchPayloadFirstPage),
            sendError({
                error,
                processingType: 'console',
                extraOptions: {
                    actionError: userActivityError,
                },
            }),
        ];

        it('should fetch user activity for 1 page in success flow', async () => {
            mockUserActivityFetch();

            const promise = new Promise((resolve) => {
                store.subscribe(() => {
                    const actions = store.getActions();
                    if (actions.length === expectedActionsFetchWithFirstPage.length) {
                        expect(actions).toEqual(expectedActionsFetchWithFirstPage);
                        resolve();
                    }
                });
            });
            store.dispatch(getUserActivity(fakeFetchPayloadFirstPage));

            return promise;
        });

        it('should handle user activity error', async () => {
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
            store.dispatch(getUserActivity(fakeFetchPayloadFirstPage));

            return promise;
        });
    });
});
