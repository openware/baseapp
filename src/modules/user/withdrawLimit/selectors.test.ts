import { createStore } from 'redux';
import { PluginsManager } from '../../../plugins/PluginsManager';
import { rootReducer } from '../../index';
import {
    selectWithdrawLimit,
    selectWithdrawLimitError,
    selectWithdrawLimitLoading,
    selectWithdrawLimitSuccess,
} from './selectors';

const Plugins = new PluginsManager();

describe('WithdrawLimit selectors', () => {
    const state = createStore(rootReducer(Plugins.getReduxReducer())).getState();

    it('should select list', () => {
        expect(selectWithdrawLimit(state)).toEqual(state.user.withdrawLimit.data);
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
