import { CommonError } from '../../types';
import * as actions from './actions';

describe('MemberLevels actions', () => {
    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check membersFetch action creator', () => {
        const expectedAction = { type: 'memberLevels/FETCH' };
        expect(actions.memberLevelsFetch()).toEqual(expectedAction);
    });

    it('should check memberLevelsData action creator', () => {
        const payload = {
            deposit: { minimum_level: 1 },
            withdraw: { minimum_level: 1 },
            trading: { minimum_level: 1 },
        };
        const expectedAction = { type: 'memberLevels/DATA', payload };
        expect(actions.memberLevelsData(payload)).toEqual(expectedAction);
    });

    it('should check memberLevelsError action creator', () => {
        const expectedAction = { type: 'memberLevels/ERROR', error };
        expect(actions.memberLevelsError(error)).toEqual(expectedAction);
    });
});
