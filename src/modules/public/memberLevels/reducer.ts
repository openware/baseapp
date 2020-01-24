import { CommonState } from '../../types';
import { MemberLevelsAction } from './actions';
import {
    MEMBER_LEVELS_DATA,
    MEMBER_LEVELS_ERROR,
    MEMBER_LEVELS_FETCH,
} from './constants';
import { MemberLevels } from './types';

export interface MemberLevelsState extends CommonState {
    levels?: MemberLevels;
    loading: boolean;
}

export const initialMemberLevelsState: MemberLevelsState = {
    loading: false,
};

export const memberLevelsReducer = (state = initialMemberLevelsState, action: MemberLevelsAction) => {
    switch (action.type) {
        case MEMBER_LEVELS_FETCH:
            return {
                ...state,
                loading: true,
            };
        case MEMBER_LEVELS_DATA:
            return {
                ...state,
                loading: false,
                levels: action.payload,
            };
        case MEMBER_LEVELS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
