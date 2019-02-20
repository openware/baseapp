import { RootState } from '../../';

export const selectUserActivity = (state: RootState) =>
    state.user.userActivity.userActivity;

export const selectUserActivityLoading = (state: RootState): boolean | undefined =>
    state.user.userActivity.loading;
