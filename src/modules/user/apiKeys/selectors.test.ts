import { createStore } from 'redux';
import { rootReducer } from '../../index';
import { selectApiKeys, selectApiKeysDataLoaded, selectApiKeysModal } from './selectors';

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
});
