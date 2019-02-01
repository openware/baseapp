import * as actions from './actions';


describe('Currency History actions', () => {
    it('should check fetchCurrencyHistory action creator', () => {
        const payload = { page: 0, currency: 'btc', type: 'deposits', fullHistory: 0 };
        const expectedAction = { type: 'currencyHistory/HISTORY_FETCH', payload };
        expect(actions.fetchCurrencyHistory(payload)).toEqual(expectedAction);
    });

    it('should check successCurrencyHistory action creator', () => {
        const payload = { list: [], page: 2 };
        const expectedAction = { type: 'currencyHistory/HISTORY_DATA', payload };
        expect(actions.successCurrencyHistory(payload)).toEqual(expectedAction);
    });

    it('should check failCurrencyHistory action creator', () => {
        const expectedAction = { type: 'currencyHistory/HISTORY_ERROR', payload: [] };
        expect(actions.failCurrencyHistory([])).toEqual(expectedAction);
    });

    it('should check resetCurrencyHistory action creator', () => {
        const expectedAction = { type: 'currencyHistory/HISTORY_RESET' };
        expect(actions.resetCurrencyHistory()).toEqual(expectedAction);
    });

    it('should check setFullHistoryLength action creator', () => {
        const expectedAction = {
            type: 'currencyHistory/SET_FULL_HISTORY_LENGTH',
            payload: 2,
        };
        expect(actions.setFullHistoryLength(2)).toEqual(expectedAction);
    });
});
