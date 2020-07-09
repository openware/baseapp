import { RootState } from '../../../modules';
import { BlocklistAccessState } from './reducer';

export const selectBlocklistAccessLoading = (state: RootState): BlocklistAccessState['loading'] =>
    state.public.blocklistAccess.loading;

export const selectBlocklistAccessSuccess = (state: RootState): BlocklistAccessState['success'] =>
    state.public.blocklistAccess.success;

export const selectPlatformAccessStatus = (state: RootState): BlocklistAccessState['status'] =>
    state.public.blocklistAccess.status;
