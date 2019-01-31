import * as actions from './actions';
import {
    depositsReducer,
    initialDepositsState,
} from './reducer';

describe('History - Deposits reducer', () => {
    const deposits = [
        {
            id: 566,
            currency: 'bch',
            amount: '0.99',
            fee: '0.0',
            txid: '4516e174e7f04fafd14026c22d2bc288695aaa96f4b44518aa86ac7e27fc2458',
            created_at: '2018-12-03T17:13:58+01:00',
            confirmations: 1,
            completed_at: '2018-12-03T17:14:56+01:00',
            state: 'accepted',
        },
        {
            id: 393,
            currency: 'btc',
            amount: '0.001',
            fee: '0.0',
            txid: 'dd5024e99c92aaa8787ed8273c8a6b635388eb4624d9cc1f8e04313dce843180',
            created_at: '2018-11-16T09:56:38+01:00',
            confirmations: 0,
            completed_at: '2018-11-16T09:56:56+01:00',
            state: 'accepted',
        },
    ];

    const error = {
        code: 500,
        message: 'Server error',
    };

    it('should handle DEPOSITS_FETCH', () => {
        const expectedState = {
            ...initialDepositsState,
            loading: true,
        };
        expect(depositsReducer(initialDepositsState, actions.depositsFetch())).toEqual(expectedState);
    });

    it('should handle DEPOSITS_DATA', () => {
        const expectedState = {
            ...initialDepositsState,
            list: deposits,
        };
        expect(depositsReducer(initialDepositsState, actions.depositsData(deposits))).toEqual(expectedState);
    });

    it('should handle DEPOSITS_ERROR', () => {
        const expectedState = {
            ...initialDepositsState,
            error: error,
        };
        expect(depositsReducer(initialDepositsState, actions.depositsError(error))).toEqual(expectedState);
    });
});
