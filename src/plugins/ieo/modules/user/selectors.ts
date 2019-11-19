import { RootState } from '../../../../modules';
import { CommonError } from '../../../../modules/types';
import { OrderIEOData } from './types';

export const selectIEOOrdersData = (state: RootState): OrderIEOData[] =>
    state.plugins.ieo.user.fetch.data;

export const selectIEOOrdersSuccess = (state: RootState): boolean =>
    state.plugins.ieo.user.fetch.success;

export const selectIEOOrdersLoading = (state: RootState): boolean =>
    state.plugins.ieo.user.fetch.loading;

export const selectIEOOrdersError = (state: RootState): CommonError | undefined =>
    state.plugins.ieo.user.fetch.error;

export const selectIEOOrderCancelSuccess = (state: RootState): boolean =>
    state.plugins.ieo.user.cancel.success;

export const selectIEOOrderCancelLoading = (state: RootState): boolean =>
    state.plugins.ieo.user.cancel.loading;

export const selectIEOOrderCancelError = (state: RootState): CommonError | undefined =>
    state.plugins.ieo.user.cancel.error;

export const selectIEOOrderExecuteData = (state: RootState): OrderIEOData | undefined =>
    state.plugins.ieo.user.execute.data;

export const selectIEOOrderExecuteSuccess = (state: RootState): boolean =>
    state.plugins.ieo.user.execute.success;

export const selectIEOOrderExecuteLoading = (state: RootState): boolean =>
    state.plugins.ieo.user.execute.loading;

export const selectIEOOrderExecuteError = (state: RootState): CommonError | undefined =>
    state.plugins.ieo.user.execute.error;

export const selectIEOHistoryData = (state: RootState): OrderIEOData[] =>
    state.plugins.ieo.user.history.data;

export const selectIEOHistoryLoading = (state: RootState): boolean =>
    state.plugins.ieo.user.history.loading;

export const selectIEOHistoryTotal = (state: RootState): number =>
    state.plugins.ieo.user.history.total;

export const selectIEOHistoryCurrentPage = (state: RootState): number =>
    state.plugins.ieo.user.history.page;

export const selectIEOHistoryPageCount = (state: RootState, limit): number =>
    Math.ceil(state.plugins.ieo.user.history.total / limit);

export const selectIEOHistoryFirstElemIndex = (state: RootState, limit): number =>
    state.plugins.ieo.user.history.page * limit;

export const selectIEOHistoryLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.plugins.ieo.user.history.page * limit) + limit > selectIEOHistoryTotal(state)) {
        return selectIEOHistoryTotal(state);
    } else {
        return (state.plugins.ieo.user.history.page * limit) + limit;
    }
};

export const selectIEOHistoryNextPageExists = (state: RootState, limit: number): boolean =>
    state.plugins.ieo.user.history.page < selectIEOHistoryPageCount(state, limit);

