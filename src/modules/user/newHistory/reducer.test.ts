import * as actions from './actions';
import { initialNewHistoryState, newHistoryReducer } from './reducer';

describe('newHistoryReducer', () => {
    const fakeSuccessPayload = { list:
        [{
            id: 1,
            created_at: '1555085773369',
            side: 'buy',
            type: 'deposit+withdraw',
            market: 'btczar',
            price: 12,
            amount: 1,
            currency: 'btc',
            state: 'canceled',
            fee: 0.1,
            rid: undefined,
            txid: undefined,
        }],
    };

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle NEW_HISTORY_FETCH', () => {
        const expectedState = {
            ...initialNewHistoryState,
            fetching: true,
         };
        const payload = { filter: 'deposit+withdraw' };
        expect(newHistoryReducer(initialNewHistoryState, actions.fetchNewHistory(payload))).toEqual(expectedState);
    });

    it('should handle NEW_HISTORY_DATA', () => {
        const expectedState = {
            ...fakeSuccessPayload,
            fetching: false,
         };
        const payload = { ...fakeSuccessPayload };
        expect(newHistoryReducer(initialNewHistoryState, actions.successNewHistory(payload))).toEqual(expectedState);
    });

    it('should handle NEW_HISTORY_ERROR', () => {
        const expectedState = {
            ...initialNewHistoryState,
            error: error,
         };
        expect(newHistoryReducer(initialNewHistoryState, actions.failNewHistory(error))).toEqual(expectedState);
    });

    it('should handle NEW_HISTORY_RESET', () => {
        const expectedState = {
            ...initialNewHistoryState,
         };
        expect(newHistoryReducer(initialNewHistoryState, actions.resetNewHistory())).toEqual(expectedState);
    });
});
