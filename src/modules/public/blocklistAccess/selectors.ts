import { RootState } from '../../../modules';
import { BlocklistAccessState } from './reducer';

export const selectBlacklistAccessLoading = (state: RootState): BlocklistAccessState['loading'] =>
    state.public.blocklistAccess.loading;

export const selectBlacklistAccessSuccess = (state: RootState): BlocklistAccessState['success'] =>
    state.public.blocklistAccess.success;
