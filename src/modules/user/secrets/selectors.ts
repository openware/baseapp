import { RootState } from '../../';
import { SecretsState } from './reducer';

export const selectSecretsLoading = (state: RootState): SecretsState['loading'] =>
    state.user.secrets.loading;

export const selectSecretsSuccess = (state: RootState): SecretsState['success'] =>
    state.user.secrets.success;

export const selectSecretsError = (state: RootState): SecretsState['error'] =>
    state.user.secrets.error;
