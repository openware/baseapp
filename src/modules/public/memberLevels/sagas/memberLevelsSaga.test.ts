import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import {
    memberLevelsData,
    memberLevelsError,
    memberLevelsFetch,
} from '../actions';
import { MemberLevels } from '../types';

describe('Saga: memberLevelsFetchSaga', () => {
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

    const fakeMemberLevels: MemberLevels = {
        deposit: { minimum_level: 1 },
        withdraw: { minimum_level: 1 },
        trading: { minimum_level: 1 },
    };

    const mockMemberLevels = () => {
        mockAxios.onGet('/public/member-levels').reply(200, fakeMemberLevels);
    };

    const expectedBeneficiariesActionsFetch = [
        memberLevelsFetch(),
        memberLevelsData(fakeMemberLevels),
    ];

    const expectedBeneficiariesActionsError = [
        memberLevelsFetch(),
        memberLevelsError(),
    ];


    it('should fetch memberLevels in success flow', async () => {
        mockMemberLevels();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesActionsFetch.length) {
                    expect(actions).toEqual(expectedBeneficiariesActionsFetch);
                    resolve();
                }
            });
        });
        store.dispatch(memberLevelsFetch());

        return promise;
    });

    it('should trigger fetch memberLevels error', async () => {
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedBeneficiariesActionsError.length) {
                    expect(actions).toEqual(expectedBeneficiariesActionsError);
                    resolve();
                }
            });
        });
        store.dispatch(memberLevelsFetch());

        return promise;
    });
});
