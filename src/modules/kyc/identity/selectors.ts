import { RootState } from '../../index';
import { IdentityState } from './reducer';

export const selectSendIdentitySuccess = (state: RootState): IdentityState['success'] =>
    state.app.identity.success;

export const selectSendIdentityError = (state: RootState): IdentityState['error'] =>
    state.app.identity.error;
