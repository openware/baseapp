import { createStore } from 'redux';
import { rootReducer } from '../../index';
import {
    selectWithdrawLimit,
    selectWithdrawLimitError,
    selectWithdrawLimitLoading,
    selectWithdrawLimitSuccess,
} from './selectors';

describe('WithdrawLimit selectors', () => {
    const state = createStore(rootReducer).getState();

    it('should select list', () => {
        expect(selectWithdrawLimit(state)).toEqual(state.user.withdrawLimit.list);
    });

    it('should select loading', () => {
        expect(selectWithdrawLimitLoading(state)).toEqual(state.user.withdrawLimit.loading);
    });

    it('should select success', () => {
        expect(selectWithdrawLimitSuccess(state)).toEqual(state.user.withdrawLimit.success);
    });

    it('should select error', () => {
        expect(selectWithdrawLimitError(state)).toEqual(state.user.withdrawLimit.error);
    });
});
