import { RootState } from '../../';

export const selectOrderCreateSuccess = (state: RootState): boolean => state.user.quickExchange.success;
