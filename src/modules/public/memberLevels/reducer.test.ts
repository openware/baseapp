import * as actions from './actions';
import { initialMemberLevelsState, memberLevelsReducer, MemberLevelsState } from './reducer';
import { MemberLevels } from './types';

describe('MemberLevels reducer', () => {
    const fakeMemberLevels: MemberLevels = {
        deposit: { minimum_level: 1 },
        withdraw: { minimum_level: 1 },
        trading: { minimum_level: 1 },
    };

    it('should handle MEMBER_LEVELS_FETCH', () => {
        const expectedState: MemberLevelsState = {
            ...initialMemberLevelsState,
            loading: true,
        };
        expect(memberLevelsReducer(initialMemberLevelsState, actions.memberLevelsFetch())).toEqual(expectedState);
    });

    it('should handle MEMBER_LEVELS_DATA', () => {
        const expectedState: MemberLevelsState = {
            ...initialMemberLevelsState,
            loading: false,
            levels: fakeMemberLevels,
        };
        expect(memberLevelsReducer(initialMemberLevelsState, actions.memberLevelsData(fakeMemberLevels))).toEqual(expectedState);
    });

    it('should handle MEMBER_LEVELS_ERROR', () => {
        const expectedState: MemberLevelsState = {
            ...initialMemberLevelsState,
            loading: false,
        };
        expect(memberLevelsReducer(initialMemberLevelsState, actions.memberLevelsError())).toEqual(expectedState);
    });
});
