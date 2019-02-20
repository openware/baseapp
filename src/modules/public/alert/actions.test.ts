import * as actions from './actions';


const error = {
    code: 401,
    message: ['Invalid Session'],
};

const success = 'success';

describe('Alert actions', () => {
    it('should check deleteError action creator', () => {
        const expectedAction = { type: 'alert/DELETE_ERROR' };
        expect(actions.deleteError()).toEqual(expectedAction);
    });

    it('should check handleError action creator', () => {
        const expectedAction = { type: 'alert/ERROR_DATA', error };
        expect(actions.handleError(error)).toEqual(expectedAction);
    });

    it('should check fetchError action creator', () => {
        const expectedAction = { type: 'alert/ERROR_FETCH', error };
        expect(actions.pushAlertError(error)).toEqual(expectedAction);
    });

    it('should check deleteErrorByIndex action creator', () => {
        const expectedAction = { type: 'alert/DELETE_ERROR_BY_INDEX', index: 1 };
        expect(actions.deleteErrorByIndex(1)).toEqual(expectedAction);
    });
    it('should check deleteSuccess action creator', () => {
        const expectedAction = { type: 'alert/DELETE_SUCCESS' };
        expect(actions.deleteSuccess()).toEqual(expectedAction);
    });

    it('should check handleSuccess action creator', () => {
        const expectedAction = { type: 'alert/SUCCESS_DATA', success };
        expect(actions.handleSuccess(success)).toEqual(expectedAction);
    });

    it('should check fetchSuccess action creator', () => {
        const expectedAction = { type: 'alert/SUCCESS_FETCH', success };
        expect(actions.pushAlertSuccess(success)).toEqual(expectedAction);
    });

    it('should check deleteSuccessByIndex action creator', () => {
        const expectedAction = { type: 'alert/DELETE_SUCCESS_BY_INDEX', index: 1 };
        expect(actions.deleteSuccessByIndex(1)).toEqual(expectedAction);
    });
});
