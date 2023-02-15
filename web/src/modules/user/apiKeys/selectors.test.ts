import { createStore } from 'redux';
import { rootReducer } from '../../';
import {
    selectApiKeys,
    selectApiKeysDataLoaded,
    selectApiKeysFirstElemIndex,
    selectApiKeysLastElemIndex,
    selectApiKeysModal,
    selectApiKeysNextPageExists,
    selectApiKeysPageIndex,
} from './selectors';

describe('Api Keys selectors', () => {
    const state = createStore(rootReducer).getState();

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
        expect(selectApiKeysFirstElemIndex(state, 4)).toEqual(state.user.apiKeys.pageIndex * 4 + 1);
    });

    it('should select selectApiKeysLastElemIndex', () => {
        expect(selectApiKeysLastElemIndex(state, 4)).toEqual(
            state.user.apiKeys.pageIndex * 4 + state.user.apiKeys.apiKeys.length,
        );
    });

    it('should select selectApiKeysNextPageExists', () => {
        expect(selectApiKeysNextPageExists(state)).toEqual(state.user.apiKeys.nextPageExists);
    });
});
