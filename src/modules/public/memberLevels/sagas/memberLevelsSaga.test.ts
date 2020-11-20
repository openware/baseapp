import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga, sendError } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { CommonError } from '../../../types';
import { memberLevelsData, memberLevelsError, memberLevelsFetch } from '../actions';
import { MemberLevels } from '../types';

describe('Saga: memberLevelsFetchSaga', () => {
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

    const fakeMemberLevels: MemberLevels = {
        deposit: { minimum_level: 1 },
        withdraw: { minimum_level: 1 },
        trading: { minimum_level: 1 },
    };

    const mockMemberLevels = () => {
        mockAxios.onGet('/public/member-levels').reply(200, fakeMemberLevels);
    };

    const error: CommonError = {
        message: ['Server error'],
        code: 500,
    };

    it('should fetch memberLevels in success flow', async () => {
        mockMemberLevels();
        const expectedMemberLevelsActionsFetch = [
            memberLevelsFetch(),
            memberLevelsData(fakeMemberLevels),
        ];
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedMemberLevelsActionsFetch.length) {
                    expect(actions).toEqual(expectedMemberLevelsActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(memberLevelsFetch());

        return promise;
    });

    it('should trigger fetch memberLevels error', async () => {
        mockNetworkError(mockAxios);
        const expectedMemberLevelsActionsError = [
            memberLevelsFetch(),
            sendError({
                error,
                processingType: 'alert',
                extraOptions: {
                    actionError: memberLevelsError,
                },
            }),
        ];
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedMemberLevelsActionsError.length) {
                    expect(actions).toEqual(expectedMemberLevelsActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(memberLevelsFetch());

        return promise;
    });
});
