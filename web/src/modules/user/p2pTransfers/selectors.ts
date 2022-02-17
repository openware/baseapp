import { RootState } from '../..';

export const selectP2PTransfersCreateSuccess = (state: RootState): boolean =>
    state.user.p2pTransfers.success;
