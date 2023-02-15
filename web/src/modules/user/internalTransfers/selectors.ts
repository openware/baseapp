import { RootState } from '../../';

export const selectInternalTransfersCreateSuccess = (state: RootState): boolean => state.user.internalTransfers.success;
