import { CommonError } from '../../types';
import * as actions from './actions';
import { initialWithdrawLimitState, withdrawLimitReducer } from './reducer';
import { WithdrawLimit } from './types';

describe('withdrawLimitList reducer', () => {
    const withdrawLimit: WithdrawLimit = {
            limit: 3,
            period: 48,
            withdrawal_amount: 0.3,
            currency: 'btc',
        };

    const error: CommonError = {
        code: 500,
        message: ['Server error'],
    };

    it('should handle WITHDRAW_LIMIT_FETCH', () => {
        const expectedState = {
            data: {
                limit: '0.0',
                period: 0,
                withdrawal_amount: '0.0',
                currency: '',
            },
            loading: true,
            success: false,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitFetch())).toEqual(expectedState);
    });

    it('should handle WITHDRAW_LIMIT_DATA', () => {
        const expectedState = {
            data: withdrawLimit,
            loading: false,
            success: true,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitData(withdrawLimit))).toEqual(expectedState);
    });

    it('should handle WITHDRAW_LIMIT_ERROR', () => {
        const expectedState = {
            data: {
                limit: '0.0',
                period: 0,
                withdrawal_amount: '0.0',
                currency: '',
            },
            loading: false,
            success: false,
            error: error,
         };
        expect(withdrawLimitReducer(initialWithdrawLimitState, actions.withdrawLimitError(error))).toEqual(expectedState);
    });
});
