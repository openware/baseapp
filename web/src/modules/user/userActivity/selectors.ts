import { RootState } from '../../';

export const selectUserActivity = (state: RootState) => state.user.userActivity.list;

export const selectTotalNumber = (state: RootState): number => state.user.userActivity.total;

export const selectUserActivityCurrentPage = (state: RootState): number => state.user.userActivity.page;

export const selectUserActivityPageCount = (state: RootState, limit): number =>
    Math.ceil(state.user.userActivity.total / limit);

export const selectUserActivityFirstElemIndex = (state: RootState, limit): number =>
    state.user.userActivity.page * limit + 1;

export const selectUserActivityLastElemIndex = (state: RootState, limit: number): number => {
    if (state.user.userActivity.page * limit + limit > selectTotalNumber(state)) {
        return selectTotalNumber(state);
    } else {
        return state.user.userActivity.page * limit + limit;
    }
};

export const selectUserActivityNextPageExists = (state: RootState, limit: number): boolean =>
    state.user.userActivity.page + 1 < selectUserActivityPageCount(state, limit);

export const selectUserActivityLoading = (state: RootState): boolean => state.user.userActivity.loading;
