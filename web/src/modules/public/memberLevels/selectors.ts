import { RootState } from '../../';
import { MemberLevels } from './types';

export const selectMemberLevels = (state: RootState): MemberLevels | undefined => state.public.memberLevels.levels;

export const selectMemberLevelsLoading = (state: RootState): boolean => state.public.memberLevels.loading;
