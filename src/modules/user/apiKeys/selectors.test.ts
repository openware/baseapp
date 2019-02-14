import { createStore } from 'redux';
import { rootReducer } from '../../index';
import { selectApiKeys } from './selectors';

describe('Api Keys selectors', () => {
    const state = createStore(rootReducer).getState();

    it('should select apiKeys', () => {
        expect(selectApiKeys(state)).toEqual(state.user.apiKeys.apiKeys);
    });
});
