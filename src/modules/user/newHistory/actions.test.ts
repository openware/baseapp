import * as actions from './actions';
import { NEW_HISTORY_DATA, NEW_HISTORY_ERROR, NEW_HISTORY_FETCH, NEW_HISTORY_RESET } from './constants';


describe('Currency History actions', () => {
    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should check fetchHistory action creator', () => {
        const payload = { page: 0, currency: 'btc', filter: 'deposits', limit: 6 };
        const expectedAction = { type: NEW_HISTORY_FETCH, payload };
        expect(actions.fetchNewHistory(payload)).toEqual(expectedAction);
    });

    it('should check successHistory action creator', () => {
        const payload = { list: [], page: 2 };
        const expectedAction = { type: NEW_HISTORY_DATA, payload };
        expect(actions.successNewHistory(payload)).toEqual(expectedAction);
    });

    it('should check failHistory action creator', () => {
        const expectedAction = { type: NEW_HISTORY_ERROR, payload: error };
        expect(actions.failNewHistory(error)).toEqual(expectedAction);
    });

    it('should check resetHistory action creator', () => {
        const expectedAction = { type: NEW_HISTORY_RESET };
        expect(actions.resetNewHistory()).toEqual(expectedAction);
    });
});
