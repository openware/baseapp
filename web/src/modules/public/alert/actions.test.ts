import * as actions from './actions';

describe('Alert actions', () => {
    it('should check alertPush action creator', () => {
        const expectedActionError = {
            type: 'alert/ALERT_PUSH',
            payload: {
                type: 'error',
                message: ['Error'],
                code: 500,
            },
        };

        const expectedActionSuccess = {
            type: 'alert/ALERT_PUSH',
            payload: {
                type: 'success',
                message: ['Success message'],
            },
        };

        expect(actions.alertPush(expectedActionError.payload)).toEqual(expectedActionError);
        expect(actions.alertPush(expectedActionSuccess.payload)).toEqual(expectedActionSuccess);
    });

    it('should check alertData action creator', () => {
        const expectedActionError = {
            type: 'alert/ALERT_DATA',
            payload: {
                type: 'error',
                message: ['Error'],
                code: 500,
            },
        };

        const expectedActionSuccess = {
            type: 'alert/ALERT_DATA',
            payload: {
                type: 'success',
                message: ['Success message'],
            },
        };

        expect(actions.alertData(expectedActionError.payload)).toEqual(expectedActionError);
        expect(actions.alertData(expectedActionSuccess.payload)).toEqual(expectedActionSuccess);
    });

    it('should check alertDelete action creator', () => {
        const expectedAction = {
              type: 'alert/ALERT_DELETE',
        };

        expect(actions.alertDelete()).toEqual(expectedAction);
    });

    it('should check alertDelete action creator', () => {
        const expectedAction = {
            type: 'alert/ALERT_DELETE_BY_INDEX',
            index: 1,
        };

        expect(actions.alertDeleteByIndex(expectedAction.index)).toEqual(expectedAction);
    });
});
