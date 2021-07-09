import { RootState } from '../../../';
import { IdentityState } from './reducer';

export const selectEditIdentitySuccess = (state: RootState): IdentityState['edit']['success'] =>
    state.user.identity.edit.success;

export const selectEditIdentityError = (state: RootState): IdentityState['edit']['error'] =>
    state.user.identity.edit.error;

export const selectEditIdentityLoading = (state: RootState): IdentityState['edit']['loading'] =>
    state.user.identity.edit.loading;

export const selectSendIdentitySuccess = (state: RootState): IdentityState['send']['success'] =>
    state.user.identity.send.success;

export const selectSendIdentityError = (state: RootState): IdentityState['send']['error'] =>
    state.user.identity.send.error;

export const selectSendIdentityLoading = (state: RootState): IdentityState['send']['loading'] =>
    state.user.identity.send.loading;
