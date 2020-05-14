import { RootState } from '../../../index';
import { AddressesState } from './reducer';

export const selectSendAddressesSuccess = (state: RootState): AddressesState['success'] =>
    state.user.addresses.success;

export const selectSendAddressesLoading = (state: RootState): AddressesState['loading'] =>
    state.user.addresses.loading;
