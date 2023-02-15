import { RootState } from '../..';

export const selectP2PDisputeCreateSuccess = (state: RootState): boolean => state.user.p2pDispute.success;
