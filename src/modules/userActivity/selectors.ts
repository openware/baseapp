import { RootState } from '../index';

export const selectUserActivity = (state: RootState) =>
    state.app.userActivity.userActivity;

export const selectUserActivityLoading = (state: RootState): boolean | undefined =>
    state.app.userActivity.loading;

export const selectUserActivityError = (state: RootState) =>
    state.app.userActivity.error;
