import * as actions from './actions';
import {
  initialWithdrawLimitState,
  withdrawLimitReducer,
} from './reducer';
import { WithdrawLimit } from './types';

describe('withdrawLimitList reducer', () => {
    const withdrawLimit: WithdrawLimit[] = [
        {
            limit: 3,
            period: 48,
            withdrawed_amount: 0.3,
            limit_currency: 'btc',
        },
    ];

    const error = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle WITHDRAW_LIMIT_FETCH', () => {
        const expectedState = {
            list: [],
            loading: true,
            success: false,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitFetch())).toEqual(expectedState);
    });

    it('should handle WITHDRAW_LIMIT_DATA', () => {
        const expectedState = {
            list: withdrawLimit,
            loading: false,
            success: true,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitData(withdrawLimit))).toEqual(expectedState);
    });

    it('should handle WITHDRAW_LIMIT_ERROR', () => {
        const expectedState = {
            list: [],
            loading: false,
            success: false,
            error: error,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitError(error))).toEqual(expectedState);
    });
});
