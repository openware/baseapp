import { store } from 'src/store';
import { selectSendAddressesLoading, selectSendAddressesSuccess } from './selectors';

describe('KYC address selectors', () => {
    const state = store.getState();

    it('should select loading', () => {
        expect(selectSendAddressesLoading(state)).toEqual(state.user.addresses.loading);
    });

    it('should select loading', () => {
        expect(selectSendAddressesSuccess(state)).toEqual(state.user.addresses.success);
    });
});
