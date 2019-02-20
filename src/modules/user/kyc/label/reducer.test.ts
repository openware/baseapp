import * as actions from './actions';
import {
    initialLabelState,
    labelReducer,
} from './reducer';

describe('Profile reducer', () => {
    const labelData = [{
      created_at: '2018-12-10T12:49:00Z',
      key: 'email',
      scope: 'private',
      updated_at: '2018-12-10T12:49:00Z',
      value: 'verified',
    }];

    const error = {
        code: 401,
        message: ['Invalid Session'],
    };

    it('should handle GET_LABEL_FETCH', () => {
        const expectedState = {
            ...initialLabelState,
            isFetching: true,
        };
        expect(labelReducer(initialLabelState, actions.labelFetch())).toEqual(expectedState);
    });

    it('should handle GET_USER_DATA', () => {
        const expectedState = {
            ...initialLabelState,
            data: labelData,
        };
        expect(labelReducer(initialLabelState, actions.labelData(labelData))).toEqual(expectedState);
    });

    it('should handle GET_USER_ERROR', () => {
        const expectedState = {
            ...initialLabelState,
            error: error,
        };
        expect(labelReducer(initialLabelState, actions.labelError(error))).toEqual(expectedState);
    });
});
