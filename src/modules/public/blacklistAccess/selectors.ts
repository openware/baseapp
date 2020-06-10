import { RootState } from '../../../modules';
import { BlacklistAccessState } from './reducer';

export const selectBlacklistAccessLoading = (state: RootState): BlacklistAccessState['platformLoading'] =>
    state.public.blacklistAccess.platformLoading;
