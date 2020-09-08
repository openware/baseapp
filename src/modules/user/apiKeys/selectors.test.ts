import { createStore } from 'redux';
import { PluginsManager } from '../../../plugins/PluginsManager';
import { rootReducer } from '../../index';
import {
    selectApiKeys,
    selectApiKeysDataLoaded,
    selectApiKeysFirstElemIndex,
    selectApiKeysLastElemIndex,
    selectApiKeysModal,
    selectApiKeysNextPageExists,
    selectApiKeysPageIndex,
} from './selectors';

const Plugins = new PluginsManager();

describe('Api Keys selectors', () => {
    const state = createStore(rootReducer(Plugins.getReduxReducer())).getState();

    it('should select apiKeys', () => {
        expect(selectApiKeys(state)).toEqual(state.user.apiKeys.apiKeys);
    });

    it('should select selectApiKeysDataLoaded', () => {
        expect(selectApiKeysDataLoaded(state)).toEqual(state.user.apiKeys.dataLoaded);
    });

    it('should select selectApiKeysModal', () => {
        expect(selectApiKeysModal(state)).toEqual(state.user.apiKeys.modal);
    });

    it('should select selectApiKeysPageIndex', () => {
        expect(selectApiKeysPageIndex(state)).toEqual(state.user.apiKeys.pageIndex);
    });

    it('should select selectApiKeysFirstElemIndex', () => {
        expect(selectApiKeysFirstElemIndex(state, 4)).toEqual((state.user.apiKeys.pageIndex * 4) + 1);
    });

    it('should select selectApiKeysLastElemIndex', () => {
        expect(selectApiKeysLastElemIndex(state, 4)).toEqual((state.user.apiKeys.pageIndex * 4) + state.user.apiKeys.apiKeys.length);
    });

    it('should select selectApiKeysNextPageExists', () => {
        expect(selectApiKeysNextPageExists(state)).toEqual(state.user.apiKeys.nextPageExists);
    });
});
