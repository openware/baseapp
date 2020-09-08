import { createStore } from 'redux';
import { PluginsManager } from '../../../../plugins/PluginsManager';
import { rootReducer } from '../../../index';
import {
    selectSendAddressesLoading,
    selectSendAddressesSuccess,
} from './selectors';

const Plugins = new PluginsManager();

describe('KYC address selectors', () => {
    const state = createStore(rootReducer(Plugins.getReduxReducer())).getState();

    it('should select loading', () => {
        expect(selectSendAddressesLoading(state)).toEqual(state.user.addresses.loading);
    });

    it('should select loading', () => {
        expect(selectSendAddressesSuccess(state)).toEqual(state.user.addresses.success);
    });
});
