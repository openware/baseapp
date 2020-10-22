import * as actions from './actions';
import { HISTORY_DATA, HISTORY_ERROR, HISTORY_FETCH, HISTORY_RESET } from './constants';

describe('Currency History actions', () => {
    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should check fetchHistory action creator', () => {
        const payload = { page: 0, currency: 'btc', type: 'deposits', limit: 6 };
        const expectedAction = { type: HISTORY_FETCH, payload };
        expect(actions.fetchHistory(payload)).toEqual(expectedAction);
    });

    it('should check fetchHistory action creator with market pair', () => {
        const payload = { page: 0, market: 'ethbtc', type: 'trades', limit: 0 };
        const expectedAction = { type: HISTORY_FETCH, payload };
        expect(actions.fetchHistory(payload)).toEqual(expectedAction);
    });

    it('should check successHistory action creator', () => {
        const payload = { list: [], page: 2, total: 0, nextPageExists: false };
        const expectedAction = { type: HISTORY_DATA, payload };
        expect(actions.successHistory(payload)).toEqual(expectedAction);
    });

    it('should check failHistory action creator', () => {
        const expectedAction = { type: HISTORY_ERROR, error };
        expect(actions.failHistory(error)).toEqual(expectedAction);
    });

    it('should check resetHistory action creator', () => {
        const expectedAction = { type: HISTORY_RESET };
        expect(actions.resetHistory()).toEqual(expectedAction);
    });
});
