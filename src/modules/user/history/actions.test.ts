import * as actions from './actions';


describe('Currency History actions', () => {
    it('should check fetchHistory action creator', () => {
        const payload = { page: 0, currency: 'btc', type: 'deposits', limit: 6 };
        const expectedAction = { type: 'history/HISTORY_FETCH', payload };
        expect(actions.fetchHistory(payload)).toEqual(expectedAction);
    });

    it('should check successHistory action creator', () => {
        const payload = { list: [], page: 2, fullHistory: 0 };
        const expectedAction = { type: 'history/HISTORY_DATA', payload };
        expect(actions.successHistory(payload)).toEqual(expectedAction);
    });

    it('should check failHistory action creator', () => {
        const expectedAction = { type: 'history/HISTORY_ERROR', payload: [] };
        expect(actions.failHistory([])).toEqual(expectedAction);
    });

    it('should check resetHistory action creator', () => {
        const expectedAction = { type: 'history/HISTORY_RESET' };
        expect(actions.resetHistory()).toEqual(expectedAction);
    });
});
