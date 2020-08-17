import { CommonError } from '../../types';
import { MEMBER_LEVELS_DATA, MEMBER_LEVELS_ERROR, MEMBER_LEVELS_FETCH } from './constants';
import { MemberLevels } from './types';

export interface MemberLevelsFetch {
    type: typeof MEMBER_LEVELS_FETCH;
}

export interface MemberLevelsData {
    type: typeof MEMBER_LEVELS_DATA;
    payload: MemberLevels;
}

export interface MemberLevelsError {
    type: typeof MEMBER_LEVELS_ERROR;
    error: CommonError;
}

export type MemberLevelsAction =
    MemberLevelsFetch
    | MemberLevelsData
    | MemberLevelsError;

export const memberLevelsFetch = (): MemberLevelsFetch => ({
    type: MEMBER_LEVELS_FETCH,
});

export const memberLevelsData = (payload: MemberLevelsData['payload']): MemberLevelsData => ({
    type: MEMBER_LEVELS_DATA,
    payload,
});

export const memberLevelsError = (error: CommonError): MemberLevelsError => ({
    type: MEMBER_LEVELS_ERROR,
    error,
});
