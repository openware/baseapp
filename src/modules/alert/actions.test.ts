import * as actions from './actions';


const error = {
    code: 401,
    message: 'Invalid Session',
};

describe('Alert actions', () => {
    it('should check deleteError action creator', () => {
        const expectedAction = { type: 'error/DELETE_ERROR' };
        expect(actions.deleteError()).toEqual(expectedAction);
    });

    it('should check handleError action creator', () => {
        const expectedAction = { type: 'error/ERROR_DATA', error };
        expect(actions.handleError(error)).toEqual(expectedAction);
    });

    it('should check fetchError action creator', () => {
        const expectedAction = { type: 'error/ERROR_FETCH', error };
        expect(actions.fetchError(error)).toEqual(expectedAction);
    });

    it('should check deleteErrorByIndex action creator', () => {
        const expectedAction = { type: 'error/DELETE_ERROR_BY_INDEX', index: 1 };
        expect(actions.deleteErrorByIndex(1)).toEqual(expectedAction);
    });
});
